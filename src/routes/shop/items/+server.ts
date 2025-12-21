import Airtable from 'airtable';
import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';

dotenv.config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.BASE_ID!);

export async function GET({ params }) {
    const records = await base(process.env.ITEMS_TABLE_ID!).select().all();

    if (records.length === 0) {
        return json([]);
    }

    const items = records.map(record => ({
        id: record.id,
        ...record.fields
    }));

    return json(items);
};