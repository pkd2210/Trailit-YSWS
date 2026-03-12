import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import Airtable from 'airtable';

let userdata;
export const load = async ({ parent, url }) => {
    userdata = await parent();
    const data = await parent();
    if (!data.user) {
        throw redirect(303, '/api/login');
    }
    // Get users project from https://hackatime.hackclub.com/api/v1/users/SLACKID/stats?features=projects&start_date=2026-01-01
    const response = await fetch(`https://hackatime.hackclub.com/api/v1/users/${data.user.slack_id}/stats?features=projects&start_date=2026-01-01`);
    const projectsData = await response.json();
    
    // Check if the response has projects and if it's an array
    if (!projectsData || !projectsData.data || !projectsData.data.projects || !Array.isArray(projectsData.data.projects)) {
        return {
            user: data.user,
            projectListByName: {}
        };
    }
    
    if (projectsData.data.projects.length === 0) {
        throw redirect(303, '/submit');
    }
    let projectListByName: Record<string, any> = {};
    projectsData.data.projects.forEach((project) => {
        projectListByName[project.name] = project;
    });
    return {
        user: data.user,
        projectListByName: projectListByName
    };
}





export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const access_token = cookies.get('hca_access_token') || null;
        const response = await fetch('https://auth.hackclub.com/api/v1/me', {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
        });
        const data = await response.json();

        const user = data.identity;
        
        // Get or create user record in Airtable to get the record ID
        let userRecordId = null;
        try {
            const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.BASE_ID);
            const userRecord = await base(process.env.USERS_TABLE_ID!).select({
                filterByFormula: `{SlackID} = '${user.slack_id}'`
            }).firstPage();
            
            if (userRecord.length === 0) {
                const newUserRecord = await base(process.env.USERS_TABLE_ID!).create([
                    {
                        fields: {
                            SlackID: user.slack_id,
                            Tokens: 0
                        }
                    }
                ]);
                userRecordId = newUserRecord[0].id;
            } else {
                userRecordId = userRecord[0].id;
            }
        } catch (error) {
            console.error('Error getting user record:', error);
            return fail(500, { 
                errors: ['Failed to get user information'], 
                formData: {} 
            });
        }
        
        const formDataRaw = await request.formData();
        
        const formData = {
            projectName: formDataRaw.get('projectName') as string,
            projectDescription: formDataRaw.get('projectDescription') as string,
            playableLink: formDataRaw.get('playableLink') as string,
            githubLink: formDataRaw.get('githubLink') as string,
            hackatimeProject: formDataRaw.get('hackatimeProject') as string,
            aiUsage: formDataRaw.get('aiUsage') === 'on',
            aiUsageDetails: formDataRaw.get('aiUsageDetails') as string,
            uploadedImageUrl: formDataRaw.get('uploadedImageUrl') as string,
        };

        // Check what is the hackatime project hours
        const hackatimeResponse = await fetch(`https://hackatime.hackclub.com/api/v1/users/${user.slack_id}/stats?features=projects&start_date=2026-01-01`);
        const hackatimeData = await hackatimeResponse.json();
        
        // Validation
        const errors: string[] = [];
        let projectHours = 0;
        
        // Check if the response has projects and if it's an array
        if (!hackatimeData || !hackatimeData.data || !hackatimeData.data.projects || !Array.isArray(hackatimeData.data.projects)) {
            errors.push("Failed to retrieve projects from Hackatime");
        } else {
            const project = hackatimeData.data.projects.find((p) => p.name === formData.hackatimeProject);
            if (!project) {
                errors.push(`Project "${formData.hackatimeProject}" not found in Hackatime. Available projects: ${hackatimeData.data.projects.map(p => p.name).join(', ')}`);
            } else {
                projectHours = project.hours;
            }
        }
        
        if (!formData.projectName?.trim()) {
            errors.push("Project Name is required");
        }
        
        if (!formData.projectDescription?.trim()) {
            errors.push("Project Description is required");
        }
        
        if (!formData.uploadedImageUrl?.trim()) {
            errors.push("Project Screenshot is required");
        }
        
        if (!formData.playableLink?.trim()) {
            errors.push("Playable Link is required");
        }
        
        if (!formData.githubLink?.trim()) {
            errors.push("GitHub Link is required");
        }
        
        if (!formData.hackatimeProject?.trim()) {
            errors.push("Hackatime Project selection is required");
        }
        
        if (formData.aiUsage && !(formData.aiUsageDetails && formData.aiUsageDetails.trim())) {
            errors.push("AI Usage details are required when AI usage is checked");
        }

        if (errors.length > 0) {
            return fail(400, { errors, formData });
        }

        // Process the form data here
        console.log("Submitting form data:", formData);
        
        try {
            // Check if required environment variables are set
            if (!process.env.AIRTABLE_ACCESS_TOKEN) {
                throw new Error("AIRTABLE_ACCESS_TOKEN environment variable is not set");
            }
            if (!process.env.BASE_ID) {
                throw new Error("BASE_ID environment variable is not set");
            }
            if (!process.env.PRODUCTS_TABLE_ID) {
                throw new Error("PRODUCTS_TABLE_ID environment variable is not set");
            }
            if (!process.env.USERS_TABLE_ID) {
                throw new Error("USERS_TABLE_ID environment variable is not set");
            }

            // Extract GitHub username safely
            let githubUsername = '';
            if (formData.githubLink) {
                try {
                    const url = new URL(formData.githubLink);
                    const pathParts = url.pathname.split('/').filter(part => part !== '');
                    githubUsername = pathParts[0] || '';
                } catch {
                    // Fallback for non-URL formats
                    githubUsername = formData.githubLink
                        .replace(/^https?:\/\//, '')
                        .replace(/^(www\.)?github\.com\//, '')
                        .split('/')[0] || '';
                }
            }

            // Add your submission logic here (save to database, API calls, etc.)
            const base = new Airtable({ apiKey: process.env.AIRTABLE_ACCESS_TOKEN }).base(process.env.BASE_ID);
            await base(process.env.PRODUCTS_TABLE_ID).create([
                {
                    fields: {
                        "Code URL": formData.githubLink || '',
                        "Product Name": formData.projectName || '',
                        "Description": formData.projectDescription || '',
                        "User": [userRecordId], // Use record ID array for linked field
                        "Email": user.primary_email || '',
                        "Playable URL": formData.playableLink || '',
                        "Screenshot": formData.uploadedImageUrl || '',
                        "GitHub Username": githubUsername,
                        "Hours": projectHours || 0,
                        "AI Usage": formData.aiUsage,
                        "AI Usage Explanation": formData.aiUsageDetails || '',
                        "Hackatime project": formData.hackatimeProject || '',
                        "address": user.addresses && user.addresses.length > 0 ? `${user.addresses[0].line_1 || ''} ${user.addresses[0].line_2 || ''}`.trim() : '',
                        "city": user.addresses && user.addresses.length > 0 ? user.addresses[0].city || '' : '',
                        "state": user.addresses && user.addresses.length > 0 ? user.addresses[0].state || '' : '',
                        "zip": user.addresses && user.addresses.length > 0 ? user.addresses[0].postal_code || '' : '',
                        "country": user.addresses && user.addresses.length > 0 ? user.addresses[0].country || '' : '',
                        "birthdate": user.birthday || '',
                    }
                }
            ]);
            
        } catch (error) {
            console.error("Error submitting form:", error);
            return fail(500, { 
                errors: [`Failed to submit project: ${error.message || 'Unknown error'}`], 
                formData 
            });
        }

        // Redirect to success page after successful submission
        throw redirect(303, '/shop/projects');
    }
};