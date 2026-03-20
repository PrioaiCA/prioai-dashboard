// Mock data for demo account: satnam.mortgages@gmail.com
// Provides realistic sample data across all dashboard sections

(function() {
    'use strict';

    var DEMO_EMAIL = 'satnam.mortgages@gmail.com';

    // Helper: generate dates relative to today
    function daysAgo(n) {
        var d = new Date();
        d.setDate(d.getDate() - n);
        return d.toISOString();
    }
    function hoursAgo(n) {
        var d = new Date();
        d.setHours(d.getHours() - n);
        return d.toISOString();
    }
    function todayAt(hour, min) {
        var d = new Date();
        d.setHours(hour, min || 0, 0, 0);
        return d.toISOString();
    }
    function tomorrowAt(hour, min) {
        var d = new Date();
        d.setDate(d.getDate() + 1);
        d.setHours(hour, min || 0, 0, 0);
        return d.toISOString();
    }
    function daysFromNow(n, hour, min) {
        var d = new Date();
        d.setDate(d.getDate() + n);
        d.setHours(hour || 10, min || 0, 0, 0);
        return d.toISOString();
    }

    // Client record (agent/user profile)
    var mockClientRecord = {
        id: 'recDEMO001',
        fields: {
            'Agent Name': 'Satnam',
            'Email': DEMO_EMAIL,
            'Status': 'Active',
            'Monthly Plan': 'Professional',
            'Monthly Rate': 497,
            'Retell Phone': '+1 (647) 555-0199',
            'Calls This Month': 247,
            'Call Limit': 500,
            'Phone': '(416) 555-0188',
            'Google Calendar Email': DEMO_EMAIL,
            'Available Start': '09:00',
            'Available End': '18:00',
            'Can Share With': 'team@satnam.ca'
        }
    };

    // Leads — a realistic mix covering every section
    var mockLeads = [
        // ===== PRIO LEADS (Is Prio = true) =====
        {
            id: 'recDEMO100',
            fields: {
                'First Name': 'Amanpreet',
                'Last Name': 'Dhillon',
                'Phone #': '+14165550101',
                'Client Email': [DEMO_EMAIL],
                'Status': 'Booked',
                'Is Prio': true,
                'Booked Time': todayAt(14, 30),
                'Last Call Timestamp': hoursAgo(3),
                'Updated At': hoursAgo(3),
                'Last Call Summary': 'Very interested in pre-construction condos in Brampton. Pre-approved for $650K. Wants to see 3 units this week.',
                'Client Notes': JSON.stringify([
                    { text: 'Met at open house last Saturday - very motivated buyer', timestamp: daysAgo(3) },
                    { text: 'Pre-approved with TD Bank, looking to close within 60 days', timestamp: daysAgo(1) }
                ]),
                'Client Attempts': JSON.stringify([
                    { timestamp: daysAgo(5), outcome: 'No Answer' },
                    { timestamp: daysAgo(3), outcome: 'Booked' }
                ]),
                'Stated Interest': 'Pre-construction condos in Brampton',
                'Attempts': 2,
                'Bookings': 1
            }
        },
        {
            id: 'recDEMO101',
            fields: {
                'First Name': 'Rajveer',
                'Last Name': 'Singh',
                'Phone #': '+14165550102',
                'Client Email': [DEMO_EMAIL],
                'Status': 'Callback',
                'Is Prio': true,
                'Callback Date': todayAt(16, 0),
                'Last Call Timestamp': hoursAgo(6),
                'Updated At': hoursAgo(6),
                'Last Call Summary': 'Currently renting in Mississauga. Looking to buy first home. Budget $500-600K. Asked about mortgage rates.',
                'Client Notes': JSON.stringify([
                    { text: 'First-time buyer, needs guidance on the process', timestamp: daysAgo(2) }
                ]),
                'Client Attempts': JSON.stringify([
                    { timestamp: daysAgo(7), outcome: 'Voicemail' },
                    { timestamp: daysAgo(2), outcome: 'Callback' }
                ]),
                'Stated Interest': 'First home purchase, Mississauga',
                'Attempts': 2,
                'Bookings': 0
            }
        },
        {
            id: 'recDEMO102',
            fields: {
                'First Name': 'Priya',
                'Last Name': 'Sharma',
                'Phone #': '+14165550103',
                'Client Email': [DEMO_EMAIL],
                'Status': 'Booked',
                'Is Prio': true,
                'Booked Time': tomorrowAt(11, 0),
                'Last Call Timestamp': hoursAgo(1),
                'Updated At': hoursAgo(1),
                'Last Call Summary': 'Looking to sell her townhouse in Milton and upgrade to detached in Oakville. Home valued at ~$850K.',
                'Client Notes': JSON.stringify([
                    { text: 'Wants CMA report for her Milton townhouse ASAP', timestamp: hoursAgo(1) }
                ]),
                'Client Attempts': JSON.stringify([
                    { timestamp: daysAgo(1), outcome: 'Booked' }
                ]),
                'Stated Interest': 'Sell townhouse, buy detached',
                'Attempts': 1,
                'Bookings': 1
            }
        },

        // ===== BOOKED TODAY =====
        {
            id: 'recDEMO103',
            fields: {
                'First Name': 'Michael',
                'Last Name': 'Chen',
                'Phone #': '+14165550104',
                'Client Email': [DEMO_EMAIL],
                'Status': 'Booked',
                'Is Prio': false,
                'Booked Time': todayAt(10, 0),
                'Last Call Timestamp': hoursAgo(2),
                'Updated At': hoursAgo(2),
                'Last Call Summary': 'Investor looking for rental properties in Hamilton. Has $200K for down payment. Interested in duplexes.',
                'Client Notes': JSON.stringify([]),
                'Client Attempts': JSON.stringify([
                    { timestamp: daysAgo(4), outcome: 'Follow Up' },
                    { timestamp: hoursAgo(2), outcome: 'Booked' }
                ]),
                'Stated Interest': 'Investment property, Hamilton',
                'Attempts': 2,
                'Bookings': 1
            }
        },

        // ===== PIPELINE (Timeline / Follow Up) =====
        {
            id: 'recDEMO104',
            fields: {
                'First Name': 'Sarah',
                'Last Name': 'Williams',
                'Phone #': '+14165550105',
                'Client Email': [DEMO_EMAIL],
                'Status': 'Timeline',
                'Is Prio': false,
                'Last Call Timestamp': daysAgo(2),
                'Updated At': daysAgo(2),
                'Last Call Summary': 'Interested but not ready for 6+ months. Currently locked into a lease until September.',
                'Client Notes': JSON.stringify([
                    { text: 'Follow up in June when lease is closer to ending', timestamp: daysAgo(2) }
                ]),
                'Client Attempts': JSON.stringify([
                    { timestamp: daysAgo(5), outcome: 'Timeline' }
                ]),
                'Stated Interest': 'Condo purchase, downtown Toronto',
                'Attempts': 1,
                'Bookings': 0
            }
        },
        {
            id: 'recDEMO105',
            fields: {
                'First Name': 'David',
                'Last Name': 'Patel',
                'Phone #': '+14165550106',
                'Client Email': [DEMO_EMAIL],
                'Status': 'Follow Up',
                'Is Prio': false,
                'Last Call Timestamp': daysAgo(1),
                'Updated At': daysAgo(1),
                'Last Call Summary': 'Wants to refinance current mortgage. Mentioned rates are too high right now, will reconsider if rates drop.',
                'Client Notes': JSON.stringify([]),
                'Client Attempts': JSON.stringify([
                    { timestamp: daysAgo(3), outcome: 'Follow Up' }
                ]),
                'Stated Interest': 'Refinancing',
                'Attempts': 1,
                'Bookings': 0
            }
        },
        {
            id: 'recDEMO106',
            fields: {
                'First Name': 'Jessica',
                'Last Name': 'Lee',
                'Phone #': '+14165550107',
                'Client Email': [DEMO_EMAIL],
                'Status': 'Timeline',
                'Is Prio': false,
                'Last Call Timestamp': daysAgo(4),
                'Updated At': daysAgo(4),
                'Last Call Summary': 'Recently married, planning to buy within the year. Still saving for down payment.',
                'Client Notes': JSON.stringify([
                    { text: 'Couple wants 3BR in Scarborough area, budget ~$700K', timestamp: daysAgo(4) }
                ]),
                'Client Attempts': JSON.stringify([
                    { timestamp: daysAgo(6), outcome: 'No Answer' },
                    { timestamp: daysAgo(4), outcome: 'Timeline' }
                ]),
                'Stated Interest': '3BR home, Scarborough',
                'Attempts': 2,
                'Bookings': 0
            }
        },

        // ===== PROSPECTS (general active leads) =====
        {
            id: 'recDEMO107',
            fields: {
                'First Name': 'James',
                'Last Name': 'Morrison',
                'Phone #': '+14165550108',
                'Client Email': [DEMO_EMAIL],
                'Status': 'Retry',
                'Is Prio': false,
                'Last Call Timestamp': daysAgo(1),
                'Updated At': daysAgo(1),
                'Last Call Summary': 'Brief call - said he was busy at work. Asked to call back later.',
                'Client Notes': JSON.stringify([]),
                'Client Attempts': JSON.stringify([
                    { timestamp: daysAgo(1), outcome: 'Inconclusive' }
                ]),
                'Attempts': 1,
                'Bookings': 0
            }
        },
        {
            id: 'recDEMO108',
            fields: {
                'First Name': 'Fatima',
                'Last Name': 'Hassan',
                'Phone #': '+14165550109',
                'Client Email': [DEMO_EMAIL],
                'Status': 'New',
                'Is Prio': false,
                'Last Call Timestamp': null,
                'Updated At': daysAgo(0),
                'Client Notes': JSON.stringify([]),
                'Client Attempts': JSON.stringify([]),
                'Attempts': 0,
                'Bookings': 0
            }
        },

        // ===== UNQUALIFIED =====
        {
            id: 'recDEMO109',
            fields: {
                'First Name': 'Tom',
                'Last Name': 'Baker',
                'Phone #': '+14165550110',
                'Client Email': [DEMO_EMAIL],
                'Status': 'Not Interested',
                'Last Outcome': 'Not Interested',
                'Is Prio': false,
                'Last Call Timestamp': daysAgo(3),
                'Updated At': daysAgo(3),
                'Last Call Summary': 'Not looking to buy or sell at this time. Requested not to be called again for now.',
                'Client Notes': JSON.stringify([]),
                'Client Attempts': JSON.stringify([
                    { timestamp: daysAgo(5), outcome: 'No Answer' },
                    { timestamp: daysAgo(3), outcome: 'Not Interested' }
                ]),
                'Attempts': 2,
                'Bookings': 0
            }
        },
        {
            id: 'recDEMO110',
            fields: {
                'First Name': 'Kevin',
                'Last Name': 'Wright',
                'Phone #': '+14165550111',
                'Client Email': [DEMO_EMAIL],
                'Status': 'Max Attempts',
                'Last Outcome': 'Max Attempts',
                'Is Prio': false,
                'Last Call Timestamp': daysAgo(2),
                'Updated At': daysAgo(2),
                'Last Call Summary': '',
                'Client Notes': JSON.stringify([]),
                'Client Attempts': JSON.stringify([
                    { timestamp: daysAgo(8), outcome: 'No Answer' },
                    { timestamp: daysAgo(5), outcome: 'No Answer' },
                    { timestamp: daysAgo(2), outcome: 'Voicemail' }
                ]),
                'Attempts': 3,
                'Bookings': 0
            }
        },

        // ===== SHARED LEAD =====
        {
            id: 'recDEMO111',
            fields: {
                'First Name': 'Angela',
                'Last Name': 'Martin',
                'Phone #': '+14165550112',
                'Client Email': ['team@satnam.ca'],
                'Shared With Email': [DEMO_EMAIL],
                'Shared With': ['recSHARE001'],
                'Status': 'Booked',
                'Is Prio': false,
                'Booked Time': daysFromNow(2, 13, 0),
                'Last Call Timestamp': daysAgo(1),
                'Updated At': daysAgo(1),
                'Last Call Summary': 'Referral from team - looking for a condo in North York. Budget $550K.',
                'Client Notes': JSON.stringify([
                    { text: 'Shared from team lead - handle with care, high-value referral', timestamp: daysAgo(1) }
                ]),
                'Client Attempts': JSON.stringify([
                    { timestamp: daysAgo(1), outcome: 'Booked' }
                ]),
                'Stated Interest': 'Condo, North York',
                'Attempts': 1,
                'Bookings': 1
            },
            isShared: true
        },

        // ===== SMS LEADS =====
        {
            id: 'recDEMO112',
            fields: {
                'First Name': 'Nina',
                'Last Name': 'Gonzalez',
                'Phone #': '+14165550113',
                'Client Email': [DEMO_EMAIL],
                'Status': 'New',
                'Is Prio': false,
                'SMS Status': 'Sent',
                'SMS Response': '',
                'SMS Opt Out': false,
                'Last Call Timestamp': null,
                'Updated At': daysAgo(1),
                'Client Notes': JSON.stringify([]),
                'Client Attempts': JSON.stringify([]),
                'Attempts': 0,
                'Bookings': 0
            }
        },
        {
            id: 'recDEMO113',
            fields: {
                'First Name': 'Roberto',
                'Last Name': 'Silva',
                'Phone #': '+14165550114',
                'Client Email': [DEMO_EMAIL],
                'Status': 'Interested',
                'Is Prio': false,
                'SMS Status': 'Responded',
                'SMS Response': 'Yes I am interested, when can we talk?',
                'SMS Opt Out': false,
                'Last Call Timestamp': daysAgo(1),
                'Updated At': daysAgo(1),
                'Last Call Summary': 'Responded to SMS positively. Looking for investment properties.',
                'Client Notes': JSON.stringify([]),
                'Client Attempts': JSON.stringify([]),
                'Attempts': 0,
                'Bookings': 0
            }
        },
        {
            id: 'recDEMO114',
            fields: {
                'First Name': 'Lisa',
                'Last Name': 'Park',
                'Phone #': '+14165550115',
                'Client Email': [DEMO_EMAIL],
                'Status': 'New',
                'Is Prio': false,
                'SMS Status': 'Opted Out',
                'SMS Response': 'STOP',
                'SMS Opt Out': true,
                'Last Call Timestamp': null,
                'Updated At': daysAgo(2),
                'Client Notes': JSON.stringify([]),
                'Client Attempts': JSON.stringify([]),
                'Attempts': 0,
                'Bookings': 0
            }
        },

        // ===== EXTRA LEADS for today's calls stats =====
        {
            id: 'recDEMO115',
            fields: {
                'First Name': 'Mark',
                'Last Name': 'Thompson',
                'Phone #': '+14165550116',
                'Client Email': [DEMO_EMAIL],
                'Status': 'Voicemail',
                'Is Prio': false,
                'Last Call Timestamp': hoursAgo(4),
                'Updated At': hoursAgo(4),
                'Last Call Summary': '',
                'Client Notes': JSON.stringify([]),
                'Client Attempts': JSON.stringify([
                    { timestamp: hoursAgo(4), outcome: 'Voicemail' }
                ]),
                'Attempts': 1,
                'Bookings': 0
            }
        },
        {
            id: 'recDEMO116',
            fields: {
                'First Name': 'Harpreet',
                'Last Name': 'Kaur',
                'Phone #': '+14165550117',
                'Client Email': [DEMO_EMAIL],
                'Status': 'Booked',
                'Outcome': 'Booked',
                'Is Prio': false,
                'Booked Time': todayAt(15, 0),
                'Last Call Timestamp': hoursAgo(5),
                'Updated At': hoursAgo(5),
                'Last Call Summary': 'Very motivated. Selling family home and downsizing. Needs agent who speaks Punjabi.',
                'Client Notes': JSON.stringify([
                    { text: 'Prefers communication in Punjabi', timestamp: hoursAgo(5) }
                ]),
                'Client Attempts': JSON.stringify([
                    { timestamp: hoursAgo(5), outcome: 'Booked' }
                ]),
                'Stated Interest': 'Selling family home, downsizing',
                'Attempts': 1,
                'Bookings': 1
            }
        }
    ];

    // Calls data for analytics (spread across last 30 days)
    var mockCalls = [];
    var callOutcomes = ['Booked', 'Callback', 'Follow Up', 'Timeline', 'Not Interested', 'Inconclusive', 'No Answer', 'Voicemail', 'No Answer', 'Voicemail'];
    for (var i = 0; i < 247; i++) {
        var dayOffset = Math.floor(Math.random() * 30);
        var hour = 9 + Math.floor(Math.random() * 9); // 9am-6pm
        var min = Math.floor(Math.random() * 60);
        var d = new Date();
        d.setDate(d.getDate() - dayOffset);
        d.setHours(hour, min, 0, 0);
        mockCalls.push({
            id: 'recCALL' + String(i).padStart(3, '0'),
            fields: {
                'Timestamp': d.toISOString(),
                'Outcome': callOutcomes[Math.floor(Math.random() * callOutcomes.length)],
                'Client': ['Satnam']
            }
        });
    }
    // Ensure some calls are from today for the stats
    for (var j = 0; j < 12; j++) {
        var th = 8 + j;
        var td = new Date();
        td.setHours(th, Math.floor(Math.random() * 60), 0, 0);
        var outcomes = ['Booked', 'Callback', 'Follow Up', 'Timeline', 'Not Interested', 'No Answer', 'Voicemail', 'Inconclusive', 'Booked', 'Follow Up', 'No Answer', 'Voicemail'];
        mockCalls.push({
            id: 'recCALLTODAY' + j,
            fields: {
                'Timestamp': td.toISOString(),
                'Outcome': outcomes[j],
                'Client': ['Satnam']
            }
        });
    }

    // Expose for dashboard to pick up
    window.__PRIO_MOCK_DATA = {
        email: DEMO_EMAIL,
        clientRecord: mockClientRecord,
        leads: mockLeads,
        calls: mockCalls,
        callLimit: 500
    };

    // =========================================
    // DEMO INFO POPUPS — injected for demo account only
    // =========================================

    var SECTION_INFO = {
        'page-overview': {
            title: 'Overview',
            desc: 'Your command center. See today\'s scheduled calls, usage stats, pipeline health, and priority leads at a glance. Everything you need to start your day.',
            icon: '📊'
        },
        'page-prio': {
            title: 'Priority Leads',
            desc: 'Leads you\'ve flagged as high priority. These are your hottest prospects — ranked by engagement level so you always know who to call first.',
            icon: '⚡'
        },
        'page-prospects': {
            title: 'Prospects',
            desc: 'All leads with booked meetings or callback requests. These people have shown real interest — your AI has qualified them and they\'re ready to talk.',
            icon: '📋'
        },
        'page-booked-today': {
            title: 'Booked Today',
            desc: 'Leads that were qualified and booked by your AI caller today. Fresh conversations where the prospect agreed to a meeting or callback.',
            icon: '🎯'
        },
        'page-shared': {
            title: 'Shared Leads',
            desc: 'Leads shared between you and your team. Collaborate on deals by sharing prospects with other agents in your organization.',
            icon: '🔗'
        },
        'page-pipeline': {
            title: 'AI Pipeline',
            desc: 'Leads in your automated follow-up sequence. The AI will call these prospects back based on their stated timeline or scheduled follow-up date.',
            icon: '🤖'
        },
        'page-unqualified': {
            title: 'Unqualified',
            desc: 'Leads that haven\'t booked yet — organized by last outcome. Review these to find missed opportunities or re-engage cold leads.',
            icon: '📁'
        },
        'page-analytics': {
            title: 'Analytics',
            desc: 'Track your AI caller\'s performance. See call volumes, conversion rates, booking rates, and outcome breakdowns by day, week, or month.',
            icon: '📈'
        },
        'page-import': {
            title: 'Import Leads',
            desc: 'Add new leads to your database. Import a single lead manually or upload a CSV file to bulk-import hundreds of prospects at once.',
            icon: '📥'
        },
        'page-sms-leads': {
            title: 'SMS Outreach',
            desc: 'Leads in your text message outreach flow. Track SMS delivery, responses, and opt-outs. A great way to warm leads before the AI calls.',
            icon: '💬'
        },
        'page-search': {
            title: 'Search',
            desc: 'Find any lead instantly by name or phone number. Search across your entire database to pull up details on any prospect.',
            icon: '🔍'
        },
        'page-settings': {
            title: 'Settings',
            desc: 'Configure your profile, display name, calling preferences, availability hours, and calendar integration.',
            icon: '⚙️'
        },
        'page-billing': {
            title: 'Billing',
            desc: 'View your subscription plan, call usage, and billing details. Upgrade your plan to unlock more AI calls per month.',
            icon: '💳'
        }
    };

    function injectDemoPopups() {
        // Inject CSS
        var style = document.createElement('style');
        style.textContent = [
            '.demo-info-btn{',
            '  display:inline-flex;align-items:center;justify-content:center;',
            '  width:28px;height:28px;border-radius:50%;',
            '  background:linear-gradient(135deg,rgba(0,230,118,0.15),rgba(0,230,118,0.05));',
            '  border:1px solid rgba(0,230,118,0.25);',
            '  color:rgba(0,230,118,0.9);font-size:14px;font-weight:700;',
            '  cursor:pointer;transition:all 200ms ease;',
            '  margin-left:10px;vertical-align:middle;flex-shrink:0;',
            '  position:relative;z-index:10;',
            '}',
            '.demo-info-btn:hover{',
            '  background:linear-gradient(135deg,rgba(0,230,118,0.25),rgba(0,230,118,0.1));',
            '  border-color:rgba(0,230,118,0.5);',
            '  transform:scale(1.1);',
            '  box-shadow:0 0 16px rgba(0,230,118,0.2);',
            '}',
            '[data-theme="light"] .demo-info-btn{',
            '  background:linear-gradient(135deg,rgba(0,180,90,0.12),rgba(0,180,90,0.04));',
            '  border-color:rgba(0,180,90,0.3);color:rgba(0,150,70,0.9);',
            '}',
            '.demo-popup-overlay{',
            '  position:fixed;top:0;left:0;right:0;bottom:0;',
            '  background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);',
            '  z-index:99999;display:flex;align-items:center;justify-content:center;',
            '  opacity:0;transition:opacity 200ms ease;pointer-events:none;',
            '}',
            '.demo-popup-overlay.active{opacity:1;pointer-events:all;}',
            '.demo-popup{',
            '  background:linear-gradient(160deg,rgba(20,20,25,0.98),rgba(10,10,14,0.99));',
            '  border:1px solid rgba(255,255,255,0.08);',
            '  border-radius:20px;padding:32px;max-width:420px;width:90%;',
            '  box-shadow:0 24px 80px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.06);',
            '  transform:translateY(16px) scale(0.97);transition:transform 250ms ease;',
            '  position:relative;',
            '}',
            '.demo-popup-overlay.active .demo-popup{transform:translateY(0) scale(1);}',
            '[data-theme="light"] .demo-popup{',
            '  background:linear-gradient(160deg,#fff,#f8f9fc);',
            '  border-color:rgba(0,0,0,0.08);',
            '  box-shadow:0 24px 80px rgba(0,0,0,0.15);',
            '}',
            '.demo-popup-icon{',
            '  font-size:36px;margin-bottom:12px;line-height:1;',
            '}',
            '.demo-popup-title{',
            '  font-family:var(--font-heading,sans-serif);font-size:1.25rem;font-weight:800;',
            '  color:#fff;margin-bottom:8px;',
            '}',
            '[data-theme="light"] .demo-popup-title{color:#111;}',
            '.demo-popup-desc{',
            '  font-size:0.9375rem;line-height:1.6;color:rgba(255,255,255,0.65);',
            '  margin-bottom:20px;',
            '}',
            '[data-theme="light"] .demo-popup-desc{color:rgba(0,0,0,0.6);}',
            '.demo-popup-badge{',
            '  display:inline-flex;align-items:center;gap:6px;',
            '  padding:5px 12px;border-radius:20px;font-size:0.75rem;font-weight:600;',
            '  background:rgba(0,230,118,0.1);color:rgb(0,230,118);',
            '  border:1px solid rgba(0,230,118,0.2);',
            '}',
            '[data-theme="light"] .demo-popup-badge{',
            '  background:rgba(0,180,90,0.08);color:rgb(0,150,70);',
            '  border-color:rgba(0,150,70,0.2);',
            '}',
            '.demo-popup-close{',
            '  position:absolute;top:14px;right:14px;',
            '  width:32px;height:32px;border-radius:50%;border:none;',
            '  background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.4);',
            '  font-size:18px;cursor:pointer;transition:all 200ms ease;',
            '  display:flex;align-items:center;justify-content:center;',
            '}',
            '.demo-popup-close:hover{background:rgba(255,255,255,0.1);color:#fff;}',
            '[data-theme="light"] .demo-popup-close{',
            '  background:rgba(0,0,0,0.04);color:rgba(0,0,0,0.3);',
            '}',
            '[data-theme="light"] .demo-popup-close:hover{',
            '  background:rgba(0,0,0,0.08);color:rgba(0,0,0,0.6);',
            '}'
        ].join('\n');
        document.head.appendChild(style);

        // Create the popup overlay (shared, reused)
        var overlay = document.createElement('div');
        overlay.className = 'demo-popup-overlay';
        overlay.innerHTML = '<div class="demo-popup">' +
            '<button class="demo-popup-close">&times;</button>' +
            '<div class="demo-popup-icon" id="demoPopupIcon"></div>' +
            '<div class="demo-popup-title" id="demoPopupTitle"></div>' +
            '<div class="demo-popup-desc" id="demoPopupDesc"></div>' +
            '<div class="demo-popup-badge">Demo Mode — Sample Data</div>' +
            '</div>';
        document.body.appendChild(overlay);

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay || e.target.classList.contains('demo-popup-close')) {
                overlay.classList.remove('active');
            }
        });

        function showDemoPopup(pageId) {
            var info = SECTION_INFO[pageId];
            if (!info) return;
            document.getElementById('demoPopupIcon').textContent = info.icon;
            document.getElementById('demoPopupTitle').textContent = info.title;
            document.getElementById('demoPopupDesc').textContent = info.desc;
            overlay.classList.add('active');
        }

        // Inject info buttons into each page header
        Object.keys(SECTION_INFO).forEach(function(pageId) {
            var page = document.getElementById(pageId);
            if (!page) return;

            // Find the first h2 in the page header area
            var h2 = page.querySelector('h2');
            if (!h2) return;

            var btn = document.createElement('button');
            btn.className = 'demo-info-btn';
            btn.textContent = '?';
            btn.title = 'What is this section?';
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                showDemoPopup(pageId);
            });

            // Insert after the h2 text or at the end of the parent
            h2.parentElement.appendChild(btn);
        });
    }

    // Run after DOM is ready and only for demo account
    function initDemoPopups() {
        // Wait for auth check to complete, then check if demo user
        var checkInterval = setInterval(function() {
            var emailEl = document.getElementById('userEmail');
            if (!emailEl) return;
            var email = emailEl.textContent;
            if (email === DEMO_EMAIL) {
                clearInterval(checkInterval);
                injectDemoPopups();
            } else if (email && email !== 'Not signed in' && email !== '') {
                clearInterval(checkInterval); // Not demo user, stop checking
            }
        }, 500);
        // Safety timeout
        setTimeout(function() { clearInterval(checkInterval); }, 15000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDemoPopups);
    } else {
        initDemoPopups();
    }

})();
