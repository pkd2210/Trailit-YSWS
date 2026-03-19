import Airtable from 'airtable';
import { sendLetter, sendOrder } from '$lib/components/autofulfill.server.ts';

export async function POST({ request, cookies }) {
    const body = await request.json();
    const { item, data } = body;
    const itemId = Number(item?.id);

    if (!Number.isFinite(itemId)) {
        return new Response(JSON.stringify({ success: false, message: 'Invalid item ID.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const base = new Airtable({apiKey: process.env.AIRTABLE_ACCESS_TOKEN}).base(process.env.BASE_ID!);
        const access_token = cookies.get('hca_access_token');

        if (!access_token) {
            return new Response(JSON.stringify({ success: false, message: 'Unauthorized.' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const response = await fetch('https://auth.hackclub.com/api/v1/me', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ success: false, message: 'Unauthorized.' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const userData = await response.json();
        const userSlackId = userData.identity?.slack_id;

        if (!userSlackId) {
            return new Response(JSON.stringify({ success: false, message: 'User not found.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const userRecords = await base(process.env.USERS_TABLE_ID!).select({
            filterByFormula: `{SlackID} = '${userSlackId}'`
        }).firstPage();

        if (userRecords.length === 0) {
            return new Response(JSON.stringify({ success: false, message: 'User record not found.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const userRecord = userRecords[0];
        const userRecordId = userRecord.id;
        const actualUserTokens = Number(userRecord.fields.Tokens) || 0;

        const itemRecords = await base(process.env.ITEMS_TABLE_ID!).select({
            filterByFormula: `{ID} = ${itemId}`
        }).firstPage();
        
        if (itemRecords.length === 0) {
            return new Response(JSON.stringify({ success: false, message: 'Item not found.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const itemRecord = itemRecords[0];
        const itemPrice = Number(itemRecord.fields.price) || 0;
        
        if (itemPrice <= 0) {
            return new Response(JSON.stringify({ success: false, message: 'Invalid item price.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (actualUserTokens < itemPrice) {
            return new Response(JSON.stringify({ success: false, message: 'Insufficient tokens.' }), {
                status: 402,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await base(process.env.ORDERS_TABLE_ID!).create([
            {
                fields: {
                    SlackID: [userRecordId],
                    ItemID: [itemRecord.id],
                    Price: itemPrice,
                    OrderDate: new Date().toISOString(),
                    Status: 'Pending'
                }
            }
        ]);
        await base(process.env.USERS_TABLE_ID!).update([
            {
                id: userRecordId,
                fields: {
                    Tokens: actualUserTokens - itemPrice
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