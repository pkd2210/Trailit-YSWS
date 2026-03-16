import Airtable from 'airtable';
import dotenv from 'dotenv';
import type { PageServerLoad } from './$types';

dotenv.config();

async function fetchUserProfile(slackId: string) {
    try {
        const response = await fetch(`https://cachet.dunkirk.sh/users/${slackId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return {
            displayName: data.displayName || slackId,
            imageUrl: data.imageUrl || null
        };
    } catch (error) {
        console.warn(`Failed to fetch profile for ${slackId}:`, error);
        return {
            displayName: slackId,
            imageUrl: null
        };
    }
}

export const load: PageServerLoad = async () => {
    try {
        const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.BASE_ID);
        const records = await base(process.env.USERS_TABLE_ID).select({ maxRecords: 15 }).all();
        
        const usersData = records.map(record => ({
            SlackID: record.get('SlackID'),
            Tokens: record.get('Tokens')
        }));

        const usersWithProfiles = await Promise.all(
            usersData.map(async (user) => {
                const profile = await fetchUserProfile(user.SlackID);
                return {
                    ...user,
                    displayName: profile.displayName,
                    imageUrl: profile.imageUrl
                };
            })
        );
        const users = usersWithProfiles.sort((a, b) => b.Tokens - a.Tokens);

        return {
            users
        };
    } catch (error) {
        console.error('Error fetching users from Airtable:', error);
        return {
            users: []
        };
    }
};