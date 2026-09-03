import type { VercelRequest, VercelResponse } from '@vercel/node';

function cleanAndParseJSON(raw: string) {
    if (!raw) throw new Error('Empty AI response');
    
    // 1. Strip markdown fences if present
    let text = raw.trim();
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

    // 2. Try standard parse first
    try {
        return JSON.parse(text);
    } catch (e1) {
        // 3. Fix unescaped control characters inside JSON strings without breaking outside whitespace
        let inString = false;
        let escaped = false;
        let out = '';
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            if (escaped) {
                out += char;
                escaped = false;
                continue;
            }
            
            if (char === '\\') {
                out += char;
                escaped = true;
                continue;
            }
            
            if (char === '"') {
                inString = !inString;
                out += char;
                continue;
            }
            
            if (inString) {
                if (char === '\n') out += '\\n';
                else if (char === '\r') out += '\\r';
                else if (char === '\t') out += '\\t';
                else if (char.charCodeAt(0) < 32) {} // skip invalid control chars
                else out += char;
            } else {
                out += char;
            }
        }
        
        return JSON.parse(out);
    }
}

// Google Instant Indexing API integration
async function notifyGoogleIndexing(articleUrl: string) {
    let serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    let parseError = '';

    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        try {
            let rawJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON.trim();
            if (!rawJson.startsWith('{') && !rawJson.startsWith('"')) {
                try {
                    rawJson = Buffer.from(rawJson, 'base64').toString('utf8').trim();
                } catch (_) {}
            }
            if (rawJson.startsWith('"') && rawJson.endsWith('"')) {
                rawJson = JSON.parse(rawJson);
            }
            const parsed = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
            serviceAccountEmail = parsed.client_email;
            privateKey = parsed.private_key;
        } catch (err: any) {
            parseError = err.message;
            console.error('[Indexing API] Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:', err.message);
        }
    }

    if (!serviceAccountEmail || !privateKey) {
        const reason = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
            ? `JSON parsing issue: ${parseError || 'Missing client_email or private_key in JSON'}`
            : 'GOOGLE_SERVICE_ACCOUNT_JSON not found in Vercel settings';
        return { notified: false, reason };
    }

    try {
        privateKey = privateKey.replace(/\\n/g, '\n');
        const crypto = await import('crypto');

        const header = { alg: 'RS256', typ: 'JWT' };
        const now = Math.floor(Date.now() / 1000);
        const claimSet = {
            iss: serviceAccountEmail,
            scope: 'https://www.googleapis.com/auth/indexing',
            aud: 'https://oauth2.googleapis.com/token',
            exp: now + 3600,
            iat: now
        };

        const b64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
        const b64Claims = Buffer.from(JSON.stringify(claimSet)).toString('base64url');
        const signInput = `${b64Header}.${b64Claims}`;

        const signer = crypto.createSign('RSA-SHA256');
        signer.update(signInput);
        const signature = signer.sign(privateKey, 'base64url');
        const jwt = `${signInput}.${signature}`;

        const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwt
            })
        });

        if (!tokenResp.ok) {
            const err = await tokenResp.text();
            throw new Error(`OAuth failed: ${err.substring(0, 200)}`);
        }

        const tokenData = await tokenResp.json();
        const accessToken = tokenData.access_token;

        const indexResp = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: articleUrl,
                type: 'URL_UPDATED'
            })
        });

        const indexData = await indexResp.json();
        return { notified: indexResp.ok, status: indexResp.status, response: indexData };
    } catch (e: any) {
        console.error('[Indexing API] Failed to notify Google:', e.message);
        return { notified: false, error: e.message };
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // 1. Security Check
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}` && req.body?.adminToken !== cronSecret) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const errors: string[] = [];

    try {
        const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
        const groqApiKey = process.env.GROQ_API_KEY;

        if (!geminiApiKey && !groqApiKey) {
            return res.status(500).json({ 
                error: 'No API keys configured. Please add GEMINI_API_KEY or GROQ_API_KEY to Vercel Environment Variables.'
            });
        }

        const prompt = `You are a highly sought-after Wall Street quantitative analyst and an elite proprietary trader. 
Write a master-level, deeply informative, and highly actionable trading blog post about a specific, current trending topic in the stock market, crypto, or forex.

CRITICAL INSTRUCTIONS TO ELIMINATE AI SPAM & DELIVER MASTER-CLASS VALUE:
1. Write in clear, sharp, and conversational professional English. 
2. ABSOLUTELY PROHIBITED PHRASES: Do NOT use "In today's fast-paced digital world", "Delving into", "It's important to remember", "In conclusion", "Navigating the complexities", "A testament to", "Let's dive in", or any other cliche AI filler.
3. TONE & STYLE: Write like a real human hedge fund manager talking to serious traders. Use varied sentence lengths (high burstiness). Be direct, factual, and analytical. 
4. DEPTH: Do not give generic advice (like "buy low, sell high"). Provide deep market mechanics, historical data comparisons, specific risk management math, or psychological insights. The information MUST be verified and highly valuable.
5. FORMATTING: Use H2/H3 tags, bullet points, and bold text for readability. 
6. SEO: Naturally integrate long-tail keywords. The content must be comprehensive enough to rank on Google's first page.

MANDATORY 3 PHOTOREALISTIC & TOPIC-ACCURATE IMAGES:
Every article MUST feature 3 completely distinct, realistic photographic scenes directly related to the subject:
- "featuredImagePrompt": The primary hero close-up shot of the exact asset symbol. 
  Example for Bitcoin: "A photorealistic, gleaming metallic golden Bitcoin medallion with the bold engraved ₿ symbol, resting on a sleek dark trading desk with glowing candlestick charts, 8k resolution, cinematic studio lighting, depth of field."
  Example for Ethereum: "A photorealistic, multifaceted glowing crystal Ethereum diamond emblem resting on a luxury dark metallic trading surface, 8k."
  Example for Stocks/Gold: "Photorealistic stacked 999.9 pure gold bullion bars or Wall Street stock exchange floor with vibrant green market ticker displays, 8k."
- "chartImagePrompt": A realistic, atmospheric cinematic photograph of a professional trader's desk in action.
  Describe: "Cinematic photograph of an elite trader's sleek multi-monitor trading workstation at night: glowing curved displays showing trading charts of the specific asset, mechanical keyboard, warm ambient lamp light, luxury modern office background, photorealistic, 8k, crisp focus." (IMPORTANT: NEVER ask for abstract squiggly lines or fake charts, always describe a real workstation desk photograph).
- "strategyImagePrompt": A tangible, high-impact scene representing market victory and disciplined execution.
  Describe: "A dramatic, photorealistic sculpture of a muscular bronze Wall Street Bull charging forward across a financial trading room with green laser light accents, cinematic shadows, 8k." or "A high-security crypto cold storage hardware vault with illuminated LED status indicators and physical coins, photorealistic."
- In the "content" markdown, insert the placeholder [IMAGE_CHART] where technical setups/charts are discussed (around 35% into the article), and [IMAGE_STRATEGY] where execution strategy or risk management is discussed (around 70% into the article).

Return ONLY a raw JSON object with the following structure (no markdown formatting around the JSON):
{
  "title": "A highly engaging, SEO-friendly title",
  "slug": "url-friendly-seo-slug",
  "excerpt": "A powerful 2-sentence hook and summary",
  "content": "The full blog post in Markdown format with [IMAGE_CHART] and [IMAGE_STRATEGY] placeholders included.",
  "metaTitle": "SEO meta title under 60 chars",
  "metaDescription": "SEO meta description under 160 chars",
  "keywords": "comma, separated, seo, long-tail, keywords",
  "featuredImagePrompt": "Photorealistic hero prompt with authentic asset symbol (e.g. bold ₿ for Bitcoin)",
  "chartImagePrompt": "Cinematic photograph of professional trader multi-monitor desk at night showing this asset's charts, 8k",
  "strategyImagePrompt": "Dramatic photorealistic bronze Wall Street bull or high-security crypto vault scene, 8k"
}`;

        // Function to call Gemini (gemini-3.6-flash)
        const callGemini = async () => {
            if (!geminiApiKey) throw new Error('GEMINI_API_KEY not set');
            const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiApiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.4, responseMimeType: "application/json" }
                })
            });
            if (!resp.ok) {
                const errBody = await resp.text();
                throw new Error(`Gemini HTTP ${resp.status}: ${errBody.substring(0, 250)}`);
            }
            const data = await resp.json();
            const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            return cleanAndParseJSON(rawText);
        };

        // Function to call Groq (openai/gpt-oss-120b)
        const callGroq = async () => {
            if (!groqApiKey) throw new Error('GROQ_API_KEY not set');
            const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${groqApiKey}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'openai/gpt-oss-120b',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.4,
                    response_format: { type: 'json_object' }
                })
            });
            if (!resp.ok) {
                const errBody = await resp.text();
                throw new Error(`Groq HTTP ${resp.status}: ${errBody.substring(0, 250)}`);
            }
            const data = await resp.json();
            const rawContent = data.choices?.[0]?.message?.content;
            return cleanAndParseJSON(rawContent);
        };

        // Run both APIs concurrently
        const results = await Promise.allSettled([callGroq(), callGemini()]);
        
        results.forEach((r, i) => {
            const name = i === 0 ? 'Groq' : 'Gemini';
            if (r.status === 'rejected') {
                errors.push(`${name}: ${r.reason?.message || r.reason}`);
            }
        });

        const validResults = results
            .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
            .map(r => r.value)
            .filter(blog => blog && blog.title && blog.content);

        if (validResults.length === 0) {
            return res.status(500).json({ 
                error: 'Both AI providers failed to generate valid blog content.',
                details: errors
            });
        }

        // Pick the best result based on depth (longest content)
        validResults.sort((a, b) => (b.content?.length || 0) - (a.content?.length || 0));
        const blogPost = validResults[0];

        // 1. Featured Cover Image (Exact asset symbol, 1200x630)
        const featuredPrompt = blogPost.featuredImagePrompt || blogPost.imagePrompt || `photorealistic golden Bitcoin medallion with bold ₿ symbol on dark executive desk, 8k cinematic lighting`;
        const customImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(featuredPrompt)}?width=1200&height=630&nologo=true`;

        // 2. Pro Trader Workstation (1000x560)
        const chartPrompt = blogPost.chartImagePrompt || `cinematic photograph of elite trader workstation multi curved monitors glowing charts at night, dark aesthetic, mechanical keyboard, 8k photorealistic`;
        const chartImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(chartPrompt)}?width=1000&height=560&nologo=true`;

        // 3. Wall Street Bull / Institutional Execution (1000x560)
        const strategyPrompt = blogPost.strategyImagePrompt || `dramatic photorealistic charging bronze Wall Street bull sculpture glowing green market lines cinematic lighting 8k`;
        const strategyImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(strategyPrompt)}?width=1000&height=560&nologo=true`;

        // Embed in-content images into markdown
        let content = blogPost.content || '';
        const chartMarkdown = `\n\n![Technical Chart Setup Analysis](${chartImage})\n\n`;
        const strategyMarkdown = `\n\n![Trading Strategy & Risk Management](${strategyImage})\n\n`;

        if (content.includes('[IMAGE_CHART]')) {
            content = content.replace('[IMAGE_CHART]', chartMarkdown);
        }
        if (content.includes('[IMAGE_STRATEGY]')) {
            content = content.replace('[IMAGE_STRATEGY]', strategyMarkdown);
        }

        // Robust Fallback: If AI omitted placeholders, inject after 2nd and 4th section headings
        if (!content.includes(chartImage)) {
            const parts = content.split('\n## ');
            if (parts.length >= 3) {
                parts[1] = `${parts[1]}${chartMarkdown}`;
                content = parts.join('\n## ');
            } else {
                content = `${content}${chartMarkdown}`;
            }
        }
        if (!content.includes(strategyImage)) {
            const parts = content.split('\n## ');
            if (parts.length >= 4) {
                parts[parts.length - 2] = `${parts[parts.length - 2]}${strategyMarkdown}`;
                content = parts.join('\n## ');
            } else {
                content = `${content}${strategyMarkdown}`;
            }
        }

        blogPost.content = content;

        // Clean up prompt fields before database save
        delete blogPost.featuredImagePrompt;
        delete blogPost.chartImagePrompt;
        delete blogPost.strategyImagePrompt;
        delete blogPost.imagePrompt;

        // 3. Save to Firebase Firestore
        const firebaseConfigStr = process.env.VITE_FIREBASE_CONFIG;
        if (!firebaseConfigStr) {
            throw new Error('Firebase config (VITE_FIREBASE_CONFIG) not found in environment.');
        }

        const { initializeApp, getApps } = await import('firebase/app');
        const { getFirestore, collection, addDoc } = await import('firebase/firestore');

        const firebaseConfig = JSON.parse(firebaseConfigStr);
        const appId = process.env.VITE_APP_ID || 'tradejournall-app';

        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
        const db = getFirestore(app);

        const newPost = {
            ...blogPost,
            author: 'Pro Analyst',
            isActive: true,
            featuredImage: customImage,
            date: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };

        const docRef = await addDoc(collection(db, 'artifacts', appId, 'blog'), newPost);
        const articleUrl = `https://tradejournall.com/blog/${newPost.slug}`;

        // 4. Submit to Google Instant Indexing API
        const indexingResult = await notifyGoogleIndexing(articleUrl);

        return res.status(200).json({ 
            success: true, 
            id: docRef.id, 
            post: newPost,
            url: articleUrl,
            googleIndexing: indexingResult
        });
    } catch (error: any) {
        console.error("AI Blog Generation Error:", error);
        return res.status(500).json({ 
            error: error.message || 'Internal Server Error',
            details: errors
        });
    }
}
