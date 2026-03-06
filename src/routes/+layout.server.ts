import Airtable from 'airtable';
import { config } from 'dotenv';

// Load environment variables
config();

export async function load({ cookies }: any) {
    const access_token = cookies.get('hca_access_token') || null;
    
    // Check if this is a demo token
    if (access_token && access_token.startsWith('demo_user_token_')) {
        // Return demo user data
        return {
            user: {
                first_name: 'Demo',
                last_name: 'User',
                slack_id: 'demo_user',
                avatar: null
            },
            isAdmin: false,
            userTokens: 1000, // Give demo user some tokens to play with
            userRecordId: 'demo_record',
            filloutPasskey: 'demo_passkey'
        };
    }
    
    const response = await fetch('https://auth.hackclub.com/api/v1/me', {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });
    const data = await response.json();

    let isAdmin = false;
    let userTokens = 0;
    let userRecordId = null;
    
    if (data.identity?.slack_id) {
        try {
            const base = new Airtable({ 
                apiKey: process.env.AIRTABLE_ACCESS_TOKEN 
            }).base(process.env.BASE_ID!);
            
            const records = await base(process.env.ADMIN_LIST_TABLE_ID!).select().all();
            const adminSlackIds = records.map((record) => record.get('SlackID')).filter(Boolean);
            isAdmin = adminSlackIds.includes(data.identity.slack_id);

            const userRecord = await base(process.env.USERS_TABLE_ID!).select({
                filterByFormula: `{SlackID} = '${data.identity.slack_id}'`
            }).firstPage();
            if (userRecord.length === 0) {
                const newUserRecord = await base(process.env.USERS_TABLE_ID!).create([
                    {
                        fields: {
                            SlackID: data.identity.slack_id,
                            Tokens: 0
                        }
                    }
                ]);
                userTokens = 0;
                userRecordId = newUserRecord[0].id;
            } else {
                userTokens = Number(userRecord[0].get('Tokens')) || 0;
                userRecordId = userRecord[0].id;
            }
        } catch (error) {
            console.error('Error checking admin status:', error);
            isAdmin = false;
        }
    }
    
    return {
        user: data.identity,
        isAdmin,
        userTokens,
        userRecordId
    };
}