import { json, type RequestHandler } from '@sveltejs/kit';
import dotenv from 'dotenv';

dotenv.config();

export const POST: RequestHandler = async ({ request }) => {
    try {
        const data = await request.formData();
        const file = data.get('file') as File;

        if (!file) {
            return json({ error: 'No file provided' }, { status: 400 });
        }

        // Check if the file is an image
        if (!file.type.startsWith('image/')) {
            return json({ error: 'File must be an image' }, { status: 400 });
        }

        // Check file size (limit to 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return json({ error: 'File size must be less than 10MB' }, { status: 400 });
        }

        const hackclubApiKey = process.env.HACKCLUB_CDN_API_KEY;
        if (!hackclubApiKey) {
            return json({ error: 'CDN API key not configured' }, { status: 500 });
        }

        // Upload to Hack Club CDN
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const response = await fetch('https://cdn.hackclub.com/api/v4/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${hackclubApiKey}`
            },
            body: uploadFormData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Hack Club CDN upload failed:', errorData);
            return json({ 
                error: 'Upload failed', 
                details: errorData.error || 'Unknown error' 
            }, { status: response.status });
        }

        const result = await response.json();
        
        return json({
            success: true,
            url: result.url,
            filename: result.filename,
            id: result.id
        });

    } catch (error) {
        console.error('Upload error:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};