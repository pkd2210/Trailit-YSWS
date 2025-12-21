import config from '$lib/stores/config.json';
import { redirect } from '@sveltejs/kit';
import dotenv from 'dotenv';

dotenv.config();

export const GET = async ({ url, cookies }) => {
    // debugging if the callback dosent work
    // console.log('Client ID:', config["hca-client-id"]);
    // console.log('Client Secret exists:', !!process.env.HCA_CLIENT_SECRET);
    
    const code = url.searchParams.get('code');
    if (!code) {
        throw redirect(303, config["url-base"]);
    }
    
    const response = await fetch('https://auth.hackclub.com/oauth/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: config["hca-client-id"],
            client_secret: process.env.HCA_CLIENT_SECRET || '',
            redirect_uri: `${config["url-base"]}/api/callback`,
            code: code,
            grant_type: "authorization_code"
        }),
    });
    const data = await response.json();
    
    cookies.set('hca_access_token', data.access_token, { 
        path: '/', 
        expires: new Date(Date.now() + data.expires_in * 1000)
    });

    throw redirect(303, config["url-base"] + "/shop");
};
