import Airtable from 'airtable';
import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';

dotenv.config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.BASE_ID!);
const questsBase = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.BASE_ID!);

export async function POST({ request, cookies }) {
    try {
        const { questId, rewardTypes, tokenAmount, prizeIds } = await request.json();
        
        const access_token = cookies.get('hca_access_token');
        
        if (!access_token) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user data
        const response = await fetch('https://auth.hackclub.com/api/v1/me', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        const userData = await response.json();
        const userSlackId = userData.identity?.slack_id;

        if (!userSlackId) {
            return json({ error: 'User not found' }, { status: 404 });
        }

        // Check if quest exists and user has completed it
        const quest = await questsBase(process.env.QUESTS_TABLE_ID!).find(questId);
        if (!quest) {
            return json({ error: 'Quest not found' }, { status: 404 });
        }

        // Check if quest is active
        const questStatus = quest.fields['Status'];
        if (questStatus !== 'Active') {
            return json({ error: `Quest is ${questStatus?.toLowerCase() || 'not available'}` }, { status: 400 });
        }

        const completedUsers = quest.fields['Users Completed ID'] || [];
        if (!completedUsers.includes(userSlackId)) {
            return json({ error: 'Quest not completed by user' }, { status: 400 });
        }

        // Get user record to update tokens
        const userRecords = await base(process.env.USERS_TABLE_ID!).select({
            filterByFormula: `{SlackID} = '${userSlackId}'`
        }).all();

        if (userRecords.length === 0) {
            return json({ error: 'User record not found' }, { status: 404 });
        }

        const userRecord = userRecords[0];

        // Check if already redeemed by looking at the Users Redeemed linked field directly
        const redeemedUserRecords = quest.fields['Users Redeemed'] || [];
        
        // Also check the lookup field as a secondary check
        const redeemedSlackIds = quest.fields['SlackID (from Users Redeemed)'] || [];
        
        if (redeemedUserRecords.includes(userRecord.id) || redeemedSlackIds.includes(userSlackId)) {
            return json({ error: 'Quest already redeemed' }, { status: 400 });
        }
        const currentTokens = userRecord.fields['Tokens'] || 0;
        let newTokenBalance = currentTokens;

        // Handle different reward types
        const hasTokenReward = rewardTypes?.includes('Tokens');
        const hasPrizeReward = rewardTypes?.includes('Order');

        if (hasTokenReward) {
            // Update user's tokens
            newTokenBalance = currentTokens + tokenAmount;
            await base(process.env.USERS_TABLE_ID!).update([{
                id: userRecord.id,
                fields: {
                    'Tokens': newTokenBalance
                }
            }]);
        }

        if (hasPrizeReward && prizeIds && prizeIds.length > 0) {
            // Create orders for each prize item
            const questName = quest.fields['Name'] || `Quest ${quest.id}`;
            const orderPromises = prizeIds.map(async (prizeId: string, index: number) => {
                const prizeName = quest.fields['name (from Prize)']?.[index] || 'Quest Prize';
                return base(process.env.ORDERS_TABLE_ID!).create([{
                    fields: {
                        SlackID: [userRecord.id],
                        ItemID: [prizeId],
                        Price: 0, // Free quest reward
                        OrderDate: new Date().toISOString(),
                        itemName: prizeName,
                        Status: 'Pending',
                        Notes: `Quest reward from: ${questName}`
                    }
                }]);
            });
            
            await Promise.all(orderPromises);
        }

        if (!hasTokenReward && !hasPrizeReward) {
            return json({ error: 'No valid rewards to redeem' }, { status: 400 });
        }

        // Add user to redeemed list - add user record to the "Users Redeemed" linked field
        const currentUsersRedeemed = quest.fields['Users Redeemed'] || [];
        const updatedUsersRedeemed = [...currentUsersRedeemed, userRecord.id];
        
        await questsBase(process.env.QUESTS_TABLE_ID!).update([{
            id: questId,
            fields: {
                'Users Redeemed': updatedUsersRedeemed
            }
        }]);

        return json({ 
            success: true, 
            newTokenBalance: newTokenBalance, 
            rewardTypes: rewardTypes,
            tokensRedeemed: hasTokenReward ? tokenAmount : 0,
            prizesRedeemed: hasPrizeReward ? prizeIds?.length || 0 : 0
        });
    } catch (error) {
        console.error('Error in /api/quests/redeem:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
}