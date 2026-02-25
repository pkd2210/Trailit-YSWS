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
    })).sort((a, b) => {
        // sory by id
        //const aId = String(a.id);
        //const bId = String(b.id);

        // Natural sort comparison to handle numbers correctly
        //return aId.localeCompare(bId, undefined, { numeric: true, sensitivity: 'base' });

        
        // sort by price
        const aPrice = Number(a.price) || 0;
        const bPrice = Number(b.price) || 0;
        
        // Items with no price go to the end
        const aHasPrice = a.price != null && !isNaN(Number(a.price)) && Number(a.price) > 0;
        const bHasPrice = b.price != null && !isNaN(Number(b.price)) && Number(b.price) > 0;
        
        if (aHasPrice && !bHasPrice) return -1;
        if (!aHasPrice && bHasPrice) return 1;
        if (!aHasPrice && !bHasPrice) return 0;
        
        // Sort by price in ascending order
        return aPrice - bPrice;
    });

    return json(items);
};