import { redirect } from '@sveltejs/kit';
import { page } from '$app/stores';

export const load = async ({ parent, url }) => {
    const data = await parent();
    if (url.pathname !== '/shop') {
        if (!data.user) {
            throw redirect(303, '/api/login');
        }
    }
    return {
        user: data.user,
        userTokens: data.userTokens,
        userRecordId: data.userRecordId,
        isAdmin: data.isAdmin
    };
}