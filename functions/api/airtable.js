// Cloudflare Pages Function - Secure Airtable Proxy
// Handles CORS, authentication validation, path validation, and rate limiting

// Configuration - these should match your Airtable setup
const ALLOWED_BASE = 'applOjDjhH0RqLtBH';
const ALLOWED_TABLES = ['tblMptC862PyL7Znw', 'tblLpN4wceakfNFpq'];

// CORS - restrict to your domains only
const ALLOWED_ORIGINS = [
    'https://dashboard.prioai.ca',
    'https://dash.prioai.ca',
    'https://prioai.ca',
    'https://www.prioai.ca',
    'http://localhost:3000',
    'http://localhost:8788',
    'http://127.0.0.1:8788'
];

// Simple in-memory rate limiting (resets on worker restart)
const rateLimits = new Map();
const RATE_LIMIT = 1000; // requests per window (high to allow analytics pagination)
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(ip) {
    if (!ip) return true;
    const now = Date.now();
    const record = rateLimits.get(ip) || { count: 0, resetAt: now + RATE_WINDOW };

    if (now > record.resetAt) {
        record.count = 1;
        record.resetAt = now + RATE_WINDOW;
    } else {
        record.count++;
    }

    rateLimits.set(ip, record);

    // Clean up old entries periodically
    if (rateLimits.size > 10000) {
        for (const [key, val] of rateLimits) {
            if (now > val.resetAt) rateLimits.delete(key);
        }
    }

    return record.count <= RATE_LIMIT;
}

function validateAirtablePath(path) {
    if (!path || typeof path !== 'string') {
        return { valid: false, error: 'Invalid path' };
    }

    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // Split path and query string
    const [pathPart] = cleanPath.split('?');
    const parts = pathPart.split('/').filter(Boolean);

    if (parts.length < 2 || parts.length > 3) {
        return { valid: false, error: 'Invalid path structure' };
    }

    const [base, table, recordId] = parts;

    // Validate base ID
    if (base !== ALLOWED_BASE) {
        return { valid: false, error: 'Invalid base' };
    }

    // Validate table ID
    if (!ALLOWED_TABLES.includes(table)) {
        return { valid: false, error: 'Invalid table' };
    }

    // Validate record ID format if present (rec followed by alphanumeric)
    if (recordId && !/^rec[a-zA-Z0-9]+$/.test(recordId)) {
        return { valid: false, error: 'Invalid record ID format' };
    }

    // Check for path traversal attempts
    if (path.includes('..') || path.includes('//')) {
        return { valid: false, error: 'Invalid path characters' };
    }

    return { valid: true };
}

function getCorsOrigin(request) {
    const origin = request.headers.get('Origin');
    if (ALLOWED_ORIGINS.includes(origin)) {
        return origin;
    }
    // Default to primary domain if origin not in list
    return ALLOWED_ORIGINS[0];
}

function jsonResponse(data, status = 200, corsOrigin = ALLOWED_ORIGINS[0]) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': corsOrigin,
            'Access-Control-Allow-Credentials': 'true',
            'Vary': 'Origin'
        }
    });
}

export async function onRequest(context) {
    const { request, env } = context;
    const corsOrigin = getCorsOrigin(request);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': corsOrigin,
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Max-Age': '86400',
                'Vary': 'Origin'
            }
        });
    }

    try {
        // Rate limiting
        const clientIP = request.headers.get('CF-Connecting-IP') ||
                         request.headers.get('X-Forwarded-For')?.split(',')[0] ||
                         'unknown';

        if (!checkRateLimit(clientIP)) {
            return jsonResponse(
                { error: 'Rate limit exceeded. Please try again later.' },
                429,
                corsOrigin
            );
        }

        const url = new URL(request.url);
        const path = url.searchParams.get('path');

        if (!path) {
            return jsonResponse({ error: 'Missing path parameter' }, 400, corsOrigin);
        }

        // Validate path to prevent SSRF
        const validation = validateAirtablePath(path);
        if (!validation.valid) {
            return jsonResponse({ error: validation.error }, 400, corsOrigin);
        }

        // Get token from environment variable ONLY (never from request)
        const token = env.AIRTABLE_TOKEN;

        if (!token) {
            console.error('AIRTABLE_TOKEN environment variable not set');
            return jsonResponse({ error: 'Server configuration error' }, 500, corsOrigin);
        }

        // Build Airtable URL - need to properly encode query parameters
        // The path comes decoded from searchParams.get(), so we need to re-encode the query string
        const [basePath, queryString] = path.split('?');
        let airtableUrl = `https://api.airtable.com/v0/${basePath}`;

        if (queryString) {
            // Manually encode each parameter - URLSearchParams uses + for spaces but Airtable needs %20
            const pairs = queryString.split('&');
            const encodedPairs = pairs.map(pair => {
                const eqIndex = pair.indexOf('=');
                if (eqIndex > -1) {
                    const key = pair.slice(0, eqIndex);
                    const value = pair.slice(eqIndex + 1);
                    return encodeURIComponent(key) + '=' + encodeURIComponent(value);
                }
                return encodeURIComponent(pair);
            });
            airtableUrl += '?' + encodedPairs.join('&');
        }

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

        // Don't expose detailed Airtable errors to client
        if (!airtableResponse.ok) {
            console.error('Airtable error:', data);
            return jsonResponse(
                { error: 'Database request failed' },
                airtableResponse.status >= 500 ? 502 : airtableResponse.status,
                corsOrigin
            );
        }

        return jsonResponse(data, 200, corsOrigin);

    } catch (err) {
        console.error('Airtable proxy error:', err);
        return jsonResponse({ error: 'Internal server error' }, 500, corsOrigin);
    }
}
