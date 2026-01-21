import Airtable from 'airtable';
import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';

dotenv.config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.BASE_ID!);

export async function GET({ cookies }) {
    const access_token = cookies.get('hca_access_token');
    
    if (!access_token) {
        return json([]);
    }

    const response = await fetch('https://auth.hackclub.com/api/v1/me', {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });
    const userData = await response.json();
    const userSlackId = userData.identity?.slack_id;

    if (!userSlackId) {
        return json([]);
    }

    // Get the user's record ID from the users table
    const userRecord = await base(process.env.USERS_TABLE_ID!).select({
        filterByFormula: `{SlackID} = '${userSlackId}'`
    }).firstPage();

    if (userRecord.length === 0) {
        return json([]);
    }

    const userRecordId = userRecord[0].id;

    const records = await base(process.env.ORDERS_TABLE_ID!).select().all();

    if (records.length === 0) {
        return json([]);
    }

    // Only take orders where SlackID (linked record) matches the current user's record ID
    const orders = records
        .filter(record => {
            const slackIdField = record.fields.SlackID;
            return Array.isArray(slackIdField) && slackIdField.includes(userRecordId);
        })
        .map(record => ({
            id: record.id,
            ...record.fields
        }));

    return json(orders);
};