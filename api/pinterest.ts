import type { VercelRequest, VercelResponse } from '@vercel/node';

const PINTEREST_APP_ID = process.env.PINTEREST_APP_ID || '1608278';
const PINTEREST_APP_SECRET = process.env.PINTEREST_APP_SECRET || '8e04537157d0e775f424f0a8f9845fcdc25370ed';
const REDIRECT_URI = 'https://tradejournall.com/api/pinterest';

// Helper to get Firestore instance
async function getFirestoreDb() {
    const firebaseConfigStr = process.env.VITE_FIREBASE_CONFIG;
    if (!firebaseConfigStr) return null;
    try {
        const { initializeApp, getApps } = await import('firebase/app');
        const { getFirestore } = await import('firebase/firestore');
        const firebaseConfig = JSON.parse(firebaseConfigStr);
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
        return getFirestore(app);
    } catch (e) {
        console.error('[Pinterest] Firebase init error:', e);
        return null;
    }
}

// Helper to get saved Pinterest config from Firestore or env
export async function getSavedPinterestConfig() {
    let token = process.env.PINTEREST_ACCESS_TOKEN || '';
    let boardId = process.env.PINTEREST_BOARD_ID || '';
    let boardName = '';

    const db = await getFirestoreDb();
    if (db) {
        try {
            const { doc, getDoc } = await import('firebase/firestore');
            const appId = process.env.VITE_APP_ID || 'tradejournall-app';
            const snap = await getDoc(doc(db, 'artifacts', appId, 'config', 'pinterest'));
            if (snap.exists()) {
                const data = snap.data();
                if (data.accessToken) token = data.accessToken;
                if (data.boardId) boardId = data.boardId;
                if (data.boardName) boardName = data.boardName;
            }
        } catch (e) {
            console.error('[Pinterest] Failed to read config from Firestore:', e);
        }
    }

    return { token, boardId, boardName };
}

// Post a pin to Pinterest API v5
export async function postPinToPinterest({
    title,
    description,
    link,
    imageUrl,
    boardIdOverride
}: {
    title: string;
    description: string;
    link: string;
    imageUrl: string;
    boardIdOverride?: string;
}) {
    const { token, boardId } = await getSavedPinterestConfig();
    const activeBoardId = boardIdOverride || boardId;

    if (!token) {
        return { success: false, reason: 'Pinterest Access Token not configured.' };
    }
    if (!activeBoardId) {
        return { success: false, reason: 'Pinterest Board ID not configured.' };
    }

    try {
        const cleanTitle = title.substring(0, 100).trim();
        const cleanDescription = description.substring(0, 500).trim();

        const payload = {
            board_id: activeBoardId,
            title: cleanTitle,
            description: cleanDescription,
            link: link,
            media_source: {
                source_type: 'image_url',
                url: imageUrl
            }
        };

        const resp = await fetch('https://api.pinterest.com/v5/pins', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await resp.json();

        if (!resp.ok) {
            console.error('[Pinterest API Error]', data);
            return {
                success: false,
                reason: data.message || `Pinterest Error (HTTP ${resp.status})`,
                errorDetails: data
            };
        }

        const pinUrl = `https://www.pinterest.com/pin/${data.id}/`;
        return {
            success: true,
            pinId: data.id,
            pinUrl: pinUrl,
            data: data
        };
    } catch (err: any) {
        console.error('[Pinterest Post Exception]', err);
        return { success: false, reason: err.message };
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { action, code } = req.query;

    // 1. Connect Action: Redirect to Pinterest OAuth screen
    if (action === 'connect') {
        const scopes = 'boards:read,boards:write,pins:read,pins:write';
        const authUrl = `https://www.pinterest.com/oauth/?client_id=${PINTEREST_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scopes)}`;
        return res.redirect(302, authUrl);
    }

    // 2. OAuth Callback: Exchange code for access token
    if (code && typeof code === 'string') {
        try {
            const authHeader = `Basic ${Buffer.from(`${PINTEREST_APP_ID}:${PINTEREST_APP_SECRET}`).toString('base64')}`;
            const tokenParams = new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI
            });

            const tokenResp = await fetch('https://api.pinterest.com/v5/oauth/token', {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: tokenParams.toString()
            });

            const tokenData = await tokenResp.json();

            if (!tokenResp.ok || !tokenData.access_token) {
                return res.status(400).send(`
                    <html>
                    <body style="font-family:sans-serif; background:#111827; color:#fff; padding:40px; text-align:center;">
                        <h2 style="color:#ef4444;">Failed to connect Pinterest</h2>
                        <p style="color:#9ca3af;">${tokenData.message || JSON.stringify(tokenData)}</p>
                        <a href="/api/pinterest?action=connect" style="display:inline-block; padding:12px 24px; background:#10b981; color:#fff; border-radius:8px; text-decoration:none; font-weight:bold; margin-top:20px;">Try Again</a>
                    </body>
                    </html>
                `);
            }

            const accessToken = tokenData.access_token;
            const refreshToken = tokenData.refresh_token || '';
            const scope = tokenData.scope || '';

            // Fetch user info
            let username = 'User';
            try {
                const uResp = await fetch('https://api.pinterest.com/v5/user_account', {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
                const uData = await uResp.json();
                if (uData.username) username = uData.username;
            } catch (_) {}

            // Fetch boards & pick/create default
            let boardId = '';
            let boardName = '';
            let boardsList: any[] = [];
            try {
                const bResp = await fetch('https://api.pinterest.com/v5/boards', {
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                });
                const bData = await bResp.json();
                if (bData.items && bData.items.length > 0) {
                    boardsList = bData.items;
                    // Prefer a board named "Trading" or "Crypto" or take the first public one
                    const preferredBoard = boardsList.find((b: any) => 
                        b.name.toLowerCase().includes('trading') || 
                        b.name.toLowerCase().includes('crypto') ||
                        b.name.toLowerCase().includes('journal')
                    ) || boardsList[0];

                    boardId = preferredBoard.id;
                    boardName = preferredBoard.name;
                }
            } catch (_) {}

            // Save to Firestore config
            const db = await getFirestoreDb();
            if (db) {
                const { doc, setDoc } = await import('firebase/firestore');
                const appId = process.env.VITE_APP_ID || 'tradejournall-app';
                await setDoc(doc(db, 'artifacts', appId, 'config', 'pinterest'), {
                    accessToken,
                    refreshToken,
                    scope,
                    boardId,
                    boardName,
                    username,
                    connectedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }, { merge: true });
            }

            // Return clean celebratory success HTML
            return res.setHeader('Content-Type', 'text/html').send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Pinterest Connected! | TradeJournall</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #111827; color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
                        .card { background: #1f2937; border: 1px solid #374151; border-radius: 24px; padding: 40px; max-width: 500px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
                        .badge { display: inline-block; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); padding: 6px 14px; border-radius: 9999px; font-weight: bold; font-size: 13px; margin-bottom: 20px; }
                        h1 { font-size: 26px; font-weight: 900; margin-bottom: 12px; }
                        p { color: #9ca3af; font-size: 15px; line-height: 1.6; margin-bottom: 24px; }
                        .details { background: #111827; border: 1px solid #374151; border-radius: 16px; padding: 16px; text-align: left; margin-bottom: 24px; font-size: 14px; }
                        .details div { display: flex; justify-content: space-between; margin-bottom: 8px; }
                        .details div:last-child { margin-bottom: 0; }
                        .label { color: #6b7280; font-weight: 600; }
                        .val { color: #10b981; font-weight: bold; }
                        .btn { display: inline-block; width: 100%; padding: 14px; background: #10b981; hover: #059669; color: #fff; font-weight: 800; border-radius: 14px; text-decoration: none; margin-bottom: 12px; transition: background 0.2s; }
                        .btn-sec { display: inline-block; width: 100%; padding: 14px; background: #374151; color: #e5e7eb; font-weight: 700; border-radius: 14px; text-decoration: none; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <div class="badge">✔ Automated Pinterest Integration Active</div>
                        <h1>Pinterest Connected!</h1>
                        <p>Your Pinterest account has been successfully linked. All future AI blog posts will now automatically publish Pins with your website backlinks!</p>
                        
                        <div class="details">
                            <div><span class="label">Pinterest User:</span> <span class="val">@${username}</span></div>
                            <div><span class="label">Target Board:</span> <span class="val">${boardName || 'Selected'}</span></div>
                            <div><span class="label">Permissions:</span> <span class="val">pins:write, boards:read</span></div>
                        </div>

                        <a href="/api/pinterest?action=test_pin" class="btn">🚀 Create Test Pin Now</a>
                        <a href="/" class="btn-sec">Return to TradeJournall</a>
                    </div>
                </body>
                </html>
            `);
        } catch (err: any) {
            console.error('[Pinterest OAuth Error]', err);
            return res.status(500).json({ error: 'OAuth exchange failed', message: err.message });
        }
    }

    // 3. Status Action
    if (action === 'status') {
        const config = await getSavedPinterestConfig();
        if (!config.token) {
            return res.json({ connected: false, message: 'Not connected. Visit /api/pinterest?action=connect to link.' });
        }
        return res.json({ connected: true, boardId: config.boardId, boardName: config.boardName });
    }

    // 4. Test Pin Action
    if (action === 'test_pin') {
        const result = await postPinToPinterest({
            title: 'How to Build a Consistent Crypto Trading Strategy in 2026',
            description: 'Master risk-reward ratios, stop loss placement, and trading psychology. Free trading journal and auto analytics at TradeJournall.com! #CryptoTrading #Bitcoin #DayTrading #TradingJournal',
            link: 'https://tradejournall.com/blog',
            imageUrl: 'https://image.pollinations.ai/prompt/photorealistic%20golden%20Bitcoin%20medallion%20on%20luxury%20dark%20trader%20desk%20with%20glowing%20candlestick%20charts%208k?width=1000&height=1500&nologo=true'
        });

        if (result.success) {
            return res.setHeader('Content-Type', 'text/html').send(`
                <html>
                <body style="font-family:sans-serif; background:#111827; color:#fff; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; padding:20px;">
                    <div style="background:#1f2937; border:1px solid #374151; border-radius:20px; padding:35px; max-width:450px; text-align:center;">
                        <h2 style="color:#10b981; margin-bottom:10px;">🎉 Test Pin Created Successfully!</h2>
                        <p style="color:#9ca3af; margin-bottom:24px;">Your test pin has been published to Pinterest with your live website backlink.</p>
                        <a href="${result.pinUrl}" target="_blank" style="display:inline-block; padding:12px 24px; background:#e60023; color:#fff; font-weight:bold; border-radius:12px; text-decoration:none; margin-bottom:12px;">View Pin on Pinterest ↗</a>
                        <br/><br/>
                        <a href="/" style="color:#9ca3af; text-decoration:none; font-size:14px;">Back to TradeJournall</a>
                    </div>
                </body>
                </html>
            `);
        } else {
            return res.status(500).json({ success: false, reason: result.reason, details: result.errorDetails });
        }
    }

    // 5. Manual Pin Creation via POST
    if (req.method === 'POST') {
        const { title, description, link, imageUrl, boardId } = req.body || {};
        if (!title || !link || !imageUrl) {
            return res.status(400).json({ error: 'Missing required fields (title, link, imageUrl)' });
        }
        const result = await postPinToPinterest({
            title,
            description: description || title,
            link,
            imageUrl,
            boardIdOverride: boardId
        });
        return res.status(result.success ? 200 : 500).json(result);
    }

    // Default fallback: show connection prompt
    const { token } = await getSavedPinterestConfig();
    return res.setHeader('Content-Type', 'text/html').send(`
        <html>
        <body style="font-family:sans-serif; background:#111827; color:#fff; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; padding:20px;">
            <div style="background:#1f2937; border:1px solid #374151; border-radius:20px; padding:35px; max-width:450px; text-align:center;">
                <h2 style="color:#fff; margin-bottom:10px;">Pinterest Automation API</h2>
                <p style="color:#9ca3af; margin-bottom:24px;">${token ? 'Status: Connected ✔' : 'Status: Not connected'}</p>
                <a href="/api/pinterest?action=connect" style="display:inline-block; padding:12px 24px; background:#e60023; color:#fff; font-weight:bold; border-radius:12px; text-decoration:none;">${token ? 'Reconnect Pinterest' : 'Connect Pinterest Account'}</a>
            </div>
        </body>
        </html>
    `);
}
