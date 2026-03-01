import Airtable from 'airtable';
import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';

dotenv.config();

const questsBase = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.BASE_ID!);
export async function GET({ cookies }) {
    try {
        const access_token = cookies.get('hca_access_token');
        
        if (!access_token) {
            return json({ quests: [], userSlackId: null });
        }

        const response = await fetch('https://auth.hackclub.com/api/v1/me', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        const userData = await response.json();
        const userSlackId = userData.identity?.slack_id;

        if (!userSlackId) {
            return json({ quests: [], userSlackId: null });
        }


        const quests = await questsBase(process.env.QUESTS_TABLE_ID!).select().all();
        if (quests.length === 0) {
            return json({ quests: [], userSlackId });
        }

        return json({ quests, userSlackId });
    } catch (error) {
        console.error('Error in /api/quests:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};