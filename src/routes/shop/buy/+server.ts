import Airtable from 'airtable';
import { sendLetter, sendOrder } from '$lib/components/autofulfill.server.ts';

export async function POST({ request}) {
    const body = await request.json();
    const { requestItem, data } = body;

    if (!data.userRecordId) {
        return new Response(JSON.stringify({ success: false, message: 'User record ID not found.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const base = new Airtable({apiKey: process.env.AIRTABLE_ACCESS_TOKEN}).base(process.env.BASE_ID!);

        const userRecord = await base(process.env.USERS_TABLE_ID!).find(data.userRecordId);
        const item = await base(process.env.ITEMS_TABLE_ID!).find(requestItem.id);
        const actualUserTokens = userRecord.fields.Tokens as number;
        const itemPrice = item.fields.price as number;

        if (actualUserTokens < itemPrice) {
            return new Response(JSON.stringify({ success: false, message: 'Insufficient tokens.' }), {
                status: 402,
                headers: { 'Content-Type': 'application/json' }
            });
        }


        await base(process.env.USERS_TABLE_ID!).update([
            {
                id: data.userRecordId,
                fields: {
                    Tokens: actualUserTokens - itemPrice
                }
            }
        ]);

        await base(process.env.ORDERS_TABLE_ID!).create([
            {
                fields: {
                    SlackID: [data.userRecordId],
                    ItemID: [item.id],
                    Price: itemPrice,
                    OrderDate: new Date().toISOString(),
                    itemName: item.fields.name,
                    Status: 'Pending'
                }
            }
        ]);

        // Handle letter fulfillment if this is a letter item
        if (item.fields.type === 'letter' && data.letterData) {
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
        if (item.fields.type === 'package' && data.orderData) {
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