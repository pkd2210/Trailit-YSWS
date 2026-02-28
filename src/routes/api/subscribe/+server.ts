import Airtable from 'airtable';
import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';

dotenv.config();

function getBase() {
    return new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.BASE_ID!);
}

async function getSlackId(access_token: string): Promise<string | null> {
    const response = await fetch('https://auth.hackclub.com/api/v1/me', {
        headers: { Authorization: `Bearer ${access_token}` }
    });
    const userData = await response.json();
    return userData.identity?.slack_id ?? null;
}

async function findUserRecord(slackId: string) {
    const base = getBase();
    // Sanitize by keeping only alphanumeric characters valid in Slack IDs
    const safeSlackId = slackId.replace(/[^A-Za-z0-9]/g, '');
    return base(process.env.USERS_TABLE_ID!).select({
        filterByFormula: `{SlackID} = '${safeSlackId}'`
    }).firstPage();
}

export async function POST({ request, cookies }) {
    const access_token = cookies.get('hca_access_token');

    if (!access_token) {
        return json({ success: false, message: 'Not authenticated.' }, { status: 401 });
    }

    const userSlackId = await getSlackId(access_token);
    if (!userSlackId) {
        return json({ success: false, message: 'Could not identify user.' }, { status: 401 });
    }

    const body = await request.json();
    const { subscribe } = body;

    try {
        const userRecords = await findUserRecord(userSlackId);

        if (userRecords.length === 0) {
            return json({ success: false, message: 'User record not found.' }, { status: 404 });
        }

        const base = getBase();
        await base(process.env.USERS_TABLE_ID!).update([
            { id: userRecords[0].id, fields: { Subscribed: subscribe === true } }
        ]);

        return json({ success: true, subscribed: subscribe === true });
    } catch (error) {
        console.error('Error updating subscription:', error);
        return json({ success: false, message: 'Error updating subscription.' }, { status: 500 });
    }
}

export async function GET({ cookies }) {
    const access_token = cookies.get('hca_access_token');

    if (!access_token) {
        return json({ subscribed: false });
    }

    const userSlackId = await getSlackId(access_token);
    if (!userSlackId) {
        return json({ subscribed: false });
    }

    try {
        const userRecords = await findUserRecord(userSlackId);

        if (userRecords.length === 0) {
            return json({ subscribed: false });
        }

        const subscribed = userRecords[0].get('Subscribed') === true;
        return json({ subscribed });
    } catch (error) {
        console.error('Error fetching subscription status:', error);
        return json({ subscribed: false });
    }
}
