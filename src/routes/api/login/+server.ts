import config from '$lib/stores/config.json';

export const GET = async () => {
    return new Response(null, {
        status: 303,
        headers: {
            location: `https://auth.hackclub.com/oauth/authorize?client_id=${config["hca-client-id"]}&redirect_uri=${config["url-base"]}/api/callback&response_type=code&scope=email+name+slack_id+verification_status`
        }
    });
};