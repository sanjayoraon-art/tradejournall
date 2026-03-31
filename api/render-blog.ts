import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { slug } = req.query;
    
    // Fetch the base HTML from the production environment (which contains the correct Vite asset hashes)
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host || 'tradejournall.com';
    const baseUrl = `${protocol}://${host}`;
    
    let indexHtml = '';
    try {
        const resp = await fetch(baseUrl);
        indexHtml = await resp.text();
    } catch (e) {
        console.error("Failed to fetch base index.html:", e);
        return res.status(500).send("Internal Server Error");
    }

    if (!slug || typeof slug !== 'string') {
        return res.status(200).setHeader('Content-Type', 'text/html').send(indexHtml);
    }

    try {
        const firebaseConfigStr = process.env.VITE_FIREBASE_CONFIG;
        if (firebaseConfigStr) {
            const { initializeApp, getApps } = await import('firebase/app');
            const { getFirestore, collection, query, where, getDocs, limit } = await import('firebase/firestore');

            const firebaseConfig = JSON.parse(firebaseConfigStr);
            const appId = process.env.VITE_APP_ID || 'tradejournall-app';

            const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
            const db = getFirestore(app);

            const q = query(
                collection(db, 'artifacts', appId, 'blog'),
                where('slug', '==', slug),
                limit(1)
            );

            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const article = querySnapshot.docs[0].data();
                const title = article.metaTitle || `${article.title} | Trade Journal Blog`;
                const description = article.metaDescription || article.excerpt || "Trading journal blog article.";
                const image = article.featuredImage || "https://tradejournall.com/logo.png";
                
                // Replace strictly matching tags from index.html
                indexHtml = indexHtml
                    .replace(
                        /<title>.*?<\/title>/gi, 
                        `<title>${title}</title>`
                    )
                    .replace(
                        /<meta name="title" content=".*?"\s*\/>/gi, 
                        `<meta name="title" content="${title}" />`
                    )
                    .replace(
                        /<meta name="description"[\s\S]*?content=".*?"\s*\/>/gi, 
                        `<meta name="description" content="${description}" />`
                    )
                    .replace(
                        /<meta property="og:title" content=".*?"\s*\/>/gi, 
                        `<meta property="og:title" content="${title}" />`
                    )
                    .replace(
                        /<meta property="og:description"[\s\S]*?content=".*?"\s*\/>/gi, 
                        `<meta property="og:description" content="${description}" />`
                    )
                    .replace(
                        /<meta property="og:image" content=".*?"\s*\/>/gi, 
                        `<meta property="og:image" content="${image}" />`
                    )
                    .replace(
                        /<meta property="twitter:title" content=".*?"\s*\/>/gi, 
                        `<meta property="twitter:title" content="${title}" />`
                    )
                    .replace(
                        /<meta property="twitter:description"[\s\S]*?content=".*?"\s*\/>/gi, 
                        `<meta property="twitter:description" content="${description}" />`
                    )
                    .replace(
                        /<meta property="twitter:image" content=".*?"\s*\/>/gi, 
                        `<meta property="twitter:image" content="${image}" />`
                    );
            }
        }
    } catch (err) {
        console.error('[Blog SEO] Failed to read from Firestore:', err);
        // Fallback gracefully and serve unmodified index.html instead of failing completely
    }

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).send(indexHtml);
}
