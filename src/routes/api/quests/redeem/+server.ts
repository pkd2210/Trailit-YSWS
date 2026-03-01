import Airtable from 'airtable';
import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';

dotenv.config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.BASE_ID!);
const questsBase = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.BASE_ID!);

export async function POST({ request, cookies }) {
    try {
        const { questId, tokenAmount } = await request.json();
        
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

        // Update user's tokens
        await base(process.env.USERS_TABLE_ID!).update([{
            id: userRecord.id,
            fields: {
                'Tokens': currentTokens + tokenAmount
            }
        }]);

        // Add user to redeemed list - add user record to the "Users Redeemed" linked field
        const currentUsersRedeemed = quest.fields['Users Redeemed'] || [];
        const updatedUsersRedeemed = [...currentUsersRedeemed, userRecord.id];
        
        await questsBase(process.env.QUESTS_TABLE_ID!).update([{
            id: questId,
            fields: {
                'Users Redeemed': updatedUsersRedeemed
            }
        }]);

        return json({ success: true, newTokenBalance: currentTokens + tokenAmount });
    } catch (error) {
        console.error('Error in /api/quests/redeem:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
}