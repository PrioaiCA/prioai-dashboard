// Cloudflare Pages Function - Airtable Proxy
// Handles CORS by proxying requests server-side

export async function onRequest(context) {
    const { request, env } = context;
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400',
            }
        });
    }
    
    try {
        const url = new URL(request.url);
        const path = url.searchParams.get('path');
        
        if (!path) {
            return jsonResponse({ error: 'Missing path parameter' }, 400);
        }
        
        // Get token from environment or request header
        const token = env.AIRTABLE_TOKEN || request.headers.get('X-Airtable-Token');
        
        if (!token) {
            return jsonResponse({ error: 'Missing Airtable token' }, 401);
        }
        
        // Build Airtable URL
        const airtableUrl = `https://api.airtable.com/v0/${path}`;
        
        // Forward the request to Airtable
        const airtableResponse = await fetch(airtableUrl, {
            method: request.method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: request.method !== 'GET' ? await request.text() : undefined,
        });
        
        const data = await airtableResponse.json();
        
        return jsonResponse(data, airtableResponse.status);
        
    } catch (err) {
        console.error('Airtable proxy error:', err);
        return jsonResponse({ error: err.message }, 500);
    }
}

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        }
    });
}
