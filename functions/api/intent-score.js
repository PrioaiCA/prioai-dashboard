// Cloudflare Pages Function - Lead Intent Scoring via OpenAI
// POST /api/intent-score

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
    const origin = request.headers.get('Origin');
    if (ALLOWED_ORIGINS.includes(origin)) {
        return origin;
    }
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

const SYSTEM_PROMPT = `If any of the fields below are empty, work with whatever data IS available. An empty field should be treated as unknown, not negative. You must still return a score even if most fields are blank.
Analyze this lead's data and assign an intent score from 1 to 5. Return ONLY the number.
Scoring criteria:
5 - HOT: Ready to transact. Clear timeline (1-3 months), pre-approved or actively searching, agent confirmed strong intent in their notes after meeting
4 - HIGH: Serious interest. Engaged in conversation, asked about listings/pricing/process, showed up to meeting, agent notes suggest potential but needs follow-up
3 - MODERATE: Somewhat interested but non-committal. Vague timeline (6+ months), willing to talk but no concrete next steps
2 - LOW: Minimal engagement. Short or dismissive responses, "just looking," multiple attempts with little progress
1 - COLD: Dead lead. No answer after multiple attempts, explicitly not interested, DNC, no-show with no reschedule
CRITICAL WEIGHTING RULES:
1. HIGHEST WEIGHT — Agent Notes (ONLY when they exist): If Agent Notes are present AND a Booked Time exists AND the notes were written or updated AFTER that Booked Time, the agent's direct assessment after meeting the lead is the single most reliable indicator of intent. This OVERRIDES any prior AI call summary or transcript sentiment. If Agent Notes are empty or blank, SKIP this layer entirely and do NOT penalize the lead for missing notes. Agents don't always add notes — the absence of notes is neutral, not negative.
2. HIGH WEIGHT — AI Transcript & Call Summary: These capture what the lead actually said during the AI call. Use these as the primary signal when no agent notes exist. When agent notes DO exist post-meeting, these become secondary.
3. MODERATE WEIGHT — Status, Interest, Last Outcome: These provide supporting context but should not override what was said in the transcript or written in agent notes.
4. LOW WEIGHT — Attempts, Bookings count: Use as tiebreakers. High attempts with low engagement = negative signal. Booking existing = positive signal.
Decision logic:
- If post-meeting Agent Notes exist and indicate strong buyer/seller intent → 4 or 5
- If post-meeting Agent Notes exist and indicate the lead is not serious → 1 or 2 (regardless of AI transcript)
- If no Agent Notes exist, score based on Transcript, Call Summary, and Status alone — do NOT lower the score just because notes are missing
- If Booked Time exists with no agent notes → score normally based on transcript/status (do not cap or penalize)
- If Status is "Closed" or lead requested removal → 1
- If multiple attempts with no meaningful conversation and no notes → score based on transcript content, not attempt count alone
- If most fields are empty and the lead is new with no calls yet → default to 3 (unknown, not negative)
Return ONLY a single number: 1, 2, 3, 4, or 5.`;

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

    try {
        const token = env.OPENAI_TOKEN;
        if (!token) {
            console.error('OPENAI_TOKEN environment variable not set');
            return jsonResponse({ score: null, error: 'Server configuration error' }, 500, corsOrigin);
        }

        const body = await request.json();

        const userMessage = [
            'Status: ' + (body.status || ''),
            'Last Outcome: ' + (body.lastOutcome || ''),
            'Call Summary: ' + (body.callSummary || ''),
            'Stated Interest: ' + (body.interest || ''),
            'Lead Context: ' + (body.context || ''),
            'Attempts Made: ' + (body.attempts || ''),
            'Bookings: ' + (body.bookings || ''),
            'Booked Time: ' + (body.bookedTime || ''),
            'Agent Notes: ' + (body.clientNotes || ''),
            'Updated At: ' + (body.updatedAt || '')
        ].join('\n');

        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4.1-mini',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: userMessage }
                ],
                max_tokens: 5,
                temperature: 0.1
            })
        });

        if (!openaiResponse.ok) {
            const errData = await openaiResponse.text();
            console.error('OpenAI API error:', openaiResponse.status, errData);
            return jsonResponse({ score: null, error: 'AI scoring failed' }, 502, corsOrigin);
        }

        const data = await openaiResponse.json();
        const content = (data.choices?.[0]?.message?.content || '').trim();
        const score = parseInt(content, 10);

        if (isNaN(score) || score < 1 || score > 5) {
            console.error('Invalid score from OpenAI:', content);
            return jsonResponse({ score: null, error: 'Invalid score returned' }, 502, corsOrigin);
        }

        return jsonResponse({ score: score }, 200, corsOrigin);

    } catch (err) {
        console.error('Intent score error:', err);
        return jsonResponse({ score: null, error: 'Internal server error' }, 500, corsOrigin);
    }
}
