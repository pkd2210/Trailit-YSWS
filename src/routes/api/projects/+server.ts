import Airtable from 'airtable';
import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';

dotenv.config();

const projectsBase = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.PROJECTS_AIRTABLE_BASE_ID!);
export async function GET({ cookies }) {
    try {
        const access_token = cookies.get('hca_access_token');
        
        if (!access_token) {
            return json([]);
        }

        const response = await fetch('https://auth.hackclub.com/api/v1/me', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        const userData = await response.json();
        const userSlackId = userData.identity?.slack_id;

        if (!userSlackId) {
            return json([]);
        }


        //const projects = await projectsBase(process.env.PROJECTS_TABLE_ID!).select().filterByFormula(`FIND('${userSlackId}', {Slack ID})`).all();
        const projects = await projectsBase(process.env.PROJECTS_TABLE_ID!).select({
                filterByFormula: `{Slack ID} = '${userSlackId}'`
            }).firstPage();
        if (projects.length === 0) {
            return json([]);
        }

        return json(projects);
    } catch (error) {
        console.error('Error in /api/projects:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};