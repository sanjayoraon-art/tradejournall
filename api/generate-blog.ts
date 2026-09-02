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

CRITICAL INSTRUCTIONS TO ELIMINATE AI SPAM:
1. Write in clear, sharp, and conversational professional English. 
2. ABSOLUTELY PROHIBITED PHRASES: Do NOT use "In today's fast-paced digital world", "Delving into", "It's important to remember", "In conclusion", "Navigating the complexities", "A testament to", "Let's dive in", or any other cliche AI filler.
3. TONE & STYLE: Write like a real human hedge fund manager talking to serious traders. Use varied sentence lengths (high burstiness). Be direct, factual, and analytical. 
4. DEPTH: Do not give generic advice (like "buy low, sell high"). Provide deep market mechanics, historical data comparisons, specific risk management math, or psychological insights. The information MUST be verified and highly valuable.
5. FORMATTING: Use H2/H3 tags, bullet points, and bold text for readability. 
6. SEO: Naturally integrate long-tail keywords. The content must be comprehensive enough to rank on Google's first page.

Return ONLY a raw JSON object with the following structure (no markdown formatting around the JSON):
{
  "title": "A highly engaging, SEO-friendly title",
  "slug": "url-friendly-seo-slug",
  "excerpt": "A powerful 2-sentence hook and summary",
  "content": "The full blog post in Markdown format.",
  "metaTitle": "SEO meta title under 60 chars",
  "metaDescription": "SEO meta description under 160 chars",
  "keywords": "comma, separated, seo, long-tail, keywords",
  "imagePrompt": "A highly detailed visual prompt describing an abstract, modern 3d illustration representing the topic of this blog post (for an AI image generator). E.g. 'A glowing green candlestick chart rising over a dark modern city skyline, 3d render, cinematic lighting'."
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

        // Generate unique image
        const imagePrompt = blogPost.imagePrompt || 'modern trading financial candlestick chart, 3d render, dark background';
        const customImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1200&height=630&nologo=true`;

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

        return res.status(200).json({ success: true, id: docRef.id, post: newPost });
    } catch (error: any) {
        console.error("AI Blog Generation Error:", error);
        return res.status(500).json({ 
            error: error.message || 'Internal Server Error',
            details: errors
        });
    }
}
