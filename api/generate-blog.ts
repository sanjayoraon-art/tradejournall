import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // 1. Security Check: Only allow if Cron Secret matches or it's an admin request
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    
    // Allow either the cron secret or a manual admin token passed from the frontend
    if (cronSecret && authHeader !== `Bearer ${cronSecret}` && req.body?.adminToken !== cronSecret) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // 2. Generate Blog Content using Gemini API
        const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
        const groqApiKey = process.env.GROQ_API_KEY;

        const prompt = `You are a highly sought-after Wall Street quantitative analyst and an elite proprietary trader. 
Write a master-level, deeply informative, and highly actionable trading blog post about a specific, current trending topic in the stock market, crypto, or forex.

CRITICAL INSTRUCTIONS TO ELIMINATE AI SPAM:
1. Write in clear, sharp, and conversational professional English. 
2. ABSOLUTELY PROHIBITED PHRASES: Do NOT use "In today's fast-paced digital world", "Delving into", "It's important to remember", "In conclusion", "Navigating the complexities", "A testament to", "Let's dive in", or any other cliché AI filler.
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

        // Function to call Gemini
        const callGemini = async () => {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.4, responseMimeType: "application/json" }
                })
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            return JSON.parse(data.candidates[0].content.parts[0].text);
        };

        // Function to call Groq (Llama 3 70B)
        const callGroq = async () => {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${groqApiKey}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama3-70b-8192',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.4,
                    response_format: { type: 'json_object' }
                })
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            return JSON.parse(data.choices[0].message.content);
        };

        // Run both APIs concurrently to see which one performs better/faster
        const results = await Promise.allSettled([callGroq(), callGemini()]);
        
        const validResults = results
            .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
            .map(r => r.value)
            .filter(blog => blog.title && blog.content && blog.imagePrompt); // Basic validation

        if (validResults.length === 0) {
            throw new Error('Both AI providers failed to generate valid blog content.');
        }

        // Pick the best result based on the length of the content (deeper analysis = better)
        validResults.sort((a, b) => b.content.length - a.content.length);
        const blogPost = validResults[0]; // The one with the most comprehensive content

        // Generate unique image using Pollinations AI based on the imagePrompt
        const customImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(blogPost.imagePrompt)}?width=1200&height=630&nologo=true`;

        // 3. Save to Firebase Firestore
        const firebaseConfigStr = process.env.VITE_FIREBASE_CONFIG;
        if (!firebaseConfigStr) {
            throw new Error('Firebase config not found in environment.');
        }

        const { initializeApp, getApps } = await import('firebase/app');
        const { getFirestore, collection, addDoc } = await import('firebase/firestore');

        const firebaseConfig = JSON.parse(firebaseConfigStr);
        const appId = process.env.VITE_APP_ID || 'tradejournall-app';

        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
        const db = getFirestore(app);

        // Remove the temporary imagePrompt field before saving to DB
        delete blogPost.imagePrompt;

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
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
