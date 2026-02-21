import Airtable from 'airtable';
import { sendLetter, sendOrder } from '$lib/components/autofulfill.server.ts';

export async function POST({ request}) {
    const body = await request.json();
    const { item, data } = body;

    if (!data.userRecordId) {
        return new Response(JSON.stringify({ success: false, message: 'User record ID not found.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const base = new Airtable({apiKey: process.env.AIRTABLE_ACCESS_TOKEN}).base(process.env.BASE_ID!);

        const userRecord = await base(process.env.USERS_TABLE_ID!).find(data.userRecordId);
        const actualUserTokens = userRecord.fields.Tokens as number;

        if (actualUserTokens < item.price) {
            return new Response(JSON.stringify({ success: false, message: 'Insufficient tokens.' }), {
                status: 402,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const itemRecords = await base(process.env.ITEMS_TABLE_ID!).select({
            filterByFormula: `{ID} = ${item.id}`
        }).firstPage();
        
        if (itemRecords.length === 0) {
            return new Response(JSON.stringify({ success: false, message: 'Item not found.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const itemRecord = itemRecords[0];
        
        await base(process.env.ORDERS_TABLE_ID!).create([
            {
                fields: {
                    SlackID: [data.userRecordId],
                    ItemID: [itemRecord.id],
                    Price: item.price,
                    OrderDate: new Date().toISOString(),
                    itemName: item.name,
                    Status: 'Pending'
                }
            }
        ]);
        await base(process.env.USERS_TABLE_ID!).update([
            {
                id: data.userRecordId,
                fields: {
                    Tokens: actualUserTokens - item.price
                }
            }
        ]);

        // Handle letter fulfillment if this is a letter item
        if (item.type === 'letter' && data.letterData) {
                const letterResult = await sendLetter({
                    first_name: "To add",
                    last_name: "To add",
                    address_line_1: "To add",
                    address_line_2: "To add",
                    city: "To add",
                    state: "To add",
                    postal_code: "To add",
                    country: "To add",
                    recipient_email: "To add",
                    mail_type: "To add",
                    weight_grams: "To add",
                    rubber_stamps: "To add",
                    notes: "To add"
                });
        }

        // Handle order fulfillment if this is an order item
        if (item.type === 'package' && data.orderData) {
                const orderResult = await sendOrder({
                    order_text: "To add",
                    first_name: "To add",
                    last_name: "To add",
                    email: "To add",
                    phone_number: "To add",
                    address_line_1: "To add",
                    address_line_2: "To add",
                    city: "To add",
                    state: "To add",
                    postal_code: "To add",
                    country: "To add",
                    order_notes: "To add"
                });
        }

    } catch (error) {
        console.error('Error creating order:', error);
        return new Response(JSON.stringify({ success: false, message: 'Error creating order.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    return new Response(JSON.stringify({ success: true, message: `Item ${item.id} purchased successfully.` }), {
        headers: { 'Content-Type': 'application/json' }
    });
}