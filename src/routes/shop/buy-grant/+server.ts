import Airtable from 'airtable';

export async function POST({ request}) {
    const body = await request.json();
    const { item, data, amount } = body;

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
                    grantAmount: amount,
                    itemName: item.name,
                    OrderDate: new Date().toISOString(),
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