import Airtable from 'airtable';

const inFlightPurchases = new Set<string>();

export async function POST({ request, cookies }) {
    const body = await request.json();
    const { item, amount } = body;
    const itemId = Number(item?.id);
    const grantAmount = Number(amount);

    if (!Number.isFinite(itemId)) {
        return new Response(JSON.stringify({ success: false, message: 'Invalid item ID.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (!Number.isInteger(grantAmount) || grantAmount < 1) {
        return new Response(JSON.stringify({ success: false, message: 'Invalid grant amount.' }), {
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

        if (inFlightPurchases.has(userRecordId)) {
            return new Response(JSON.stringify({ success: false, message: 'Order already processing. Please wait.' }), {
                status: 429,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        inFlightPurchases.add(userRecordId);

        try {
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
            const unitPrice = Number(itemRecord.fields.price) || 0;

            if (unitPrice <= 0) {
                return new Response(JSON.stringify({ success: false, message: 'Invalid item price.' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            const itemPrice = unitPrice * grantAmount;

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
                        grantAmount: grantAmount,
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
        } finally {
            inFlightPurchases.delete(userRecordId);
        }

    } catch (error) {
        console.error('Error creating order:', error);
        return new Response(JSON.stringify({ success: false, message: 'Error creating order.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    return new Response(JSON.stringify({ success: true, message: `Item ${itemId} purchased successfully.` }), {
        headers: { 'Content-Type': 'application/json' }
    });
}