export async function sendLetter(letterData: {
    first_name: string;
    last_name: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    recipient_email?: string;
    mail_type: 'lettermail' | 'bubble_packet' | 'parcel';
    weight_grams?: number;
    rubber_stamps: string;
    notes?: string;
}) {
    const baseUrl = 'https://fulfillment.hackclub.com/'
    const res = await fetch(`${baseUrl}api/v1/letters`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.FULFILLMENT_KEY}`
        },
        body: JSON.stringify(letterData)
    })
    
    return {
        success: res.ok,
        status: res.status,
        data: res.ok ? await res.json() : await res.text()
    }
}

export async function sendOrder(orderData: {
    order_text: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone_number?: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    order_notes?: string;
}) {
    const baseUrl = 'https://fulfillment.hackclub.com/'
    const res = await fetch(`${baseUrl}api/v1/order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.FULFILLMENT_KEY}`
        },
        body: JSON.stringify(orderData)
    })
    
    return {
        success: res.ok,
        status: res.status,
        data: res.ok ? await res.json() : await res.text()
    }
}