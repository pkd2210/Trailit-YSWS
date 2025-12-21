import Airtable from 'airtable';

export async function load({ cookies }: any) {
    const access_token = cookies.get('hca_access_token') || null;
    const response = await fetch('https://auth.hackclub.com/api/v1/me', {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });
    const data = await response.json();

    let isAdmin = false;
    let userTokens = 0;
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
            if (!userRecord.includes(userRecord[0])) {
                await base(process.env.USERS_TABLE_ID!).create([
                    {
                        fields: {
                            SlackID: data.identity.slack_id,
                            Tokens: 0
                        }
                    }
                ]);
                userTokens = 0
            }
            else {
                userTokens = userRecord[0].get('Tokens') || 0;
            }
        } catch (error) {
            console.error('Error checking admin status:', error);
            isAdmin = false;
        }
    }
    
    return {
        user: data.identity,
        isAdmin,
        userTokens
    };
}