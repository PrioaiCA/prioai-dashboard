// Cloudflare Pages Function - Stripe Customer Portal Session
// Creates a portal session so users can manage their subscription, payment method, and invoices

const ALLOWED_ORIGINS = [
    'https://dashboard.prioai.ca',
    'https://dash.prioai.ca',
    'https://prioai.ca',
    'https://www.prioai.ca',
    'http://localhost:3000',
    'http://localhost:8788',
    'http://127.0.0.1:8788'
];

function getCorsOrigin(request) {
    const origin = request.headers.get('Origin') || '';
    return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
}

function jsonResponse(data, status, corsOrigin) {
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
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Max-Age': '86400',
                'Vary': 'Origin'
            }
        });
    }

    if (request.method !== 'POST') {
        return jsonResponse({ error: 'Method not allowed' }, 405, corsOrigin);
    }

    const stripeKey = env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
        return jsonResponse({ error: 'Stripe not configured' }, 500, corsOrigin);
    }

    try {
        const body = await request.json();
        const email = (body.email || '').trim().toLowerCase();

        if (!email) {
            return jsonResponse({ error: 'Email is required' }, 400, corsOrigin);
        }

        // Look up Stripe customer by email
        const searchParams = new URLSearchParams({ email, limit: '1' });
        const customerRes = await fetch(
            `https://api.stripe.com/v1/customers?${searchParams.toString()}`,
            {
                headers: { 'Authorization': `Bearer ${stripeKey}` }
            }
        );

        if (!customerRes.ok) {
            const err = await customerRes.json();
            console.error('Stripe customer lookup failed:', err);
            return jsonResponse({ error: 'Failed to look up customer' }, 502, corsOrigin);
        }

        const customers = await customerRes.json();

        if (!customers.data || customers.data.length === 0) {
            return jsonResponse({ error: 'No Stripe customer found for this email' }, 404, corsOrigin);
        }

        const customerId = customers.data[0].id;

        // Determine return URL from the request origin
        const returnUrl = corsOrigin + '/';

        // Create a billing portal session
        const portalRes = await fetch(
            'https://api.stripe.com/v1/billing_portal/sessions',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${stripeKey}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    customer: customerId,
                    return_url: returnUrl
                }).toString()
            }
        );

        if (!portalRes.ok) {
            const err = await portalRes.json();
            console.error('Stripe portal session failed:', err);
            return jsonResponse({ error: 'Failed to create portal session' }, 502, corsOrigin);
        }

        const session = await portalRes.json();

        return jsonResponse({ url: session.url }, 200, corsOrigin);

    } catch (err) {
        console.error('Stripe portal error:', err);
        return jsonResponse({ error: 'Internal server error' }, 500, corsOrigin);
    }
}
