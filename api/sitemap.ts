// Vercel Serverless Function: /api/sitemap
// Returns a dynamic sitemap.xml with homepage + all published blog posts
// Data is read from Firestore: artifacts/{appId}/config/sitemap_data

import type { VercelRequest, VercelResponse } from '@vercel/node';

const SITE_URL = 'https://tradejournall.com';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Try to read blog slugs from Firestore
    let blogEntries: Array<{ slug: string; lastmod: string }> = [];

    try {
        const firebaseConfigStr = process.env.VITE_FIREBASE_CONFIG;
        if (firebaseConfigStr) {
            const { initializeApp, getApps } = await import('firebase/app');
            const { getFirestore, doc, getDoc } = await import('firebase/firestore');

            const firebaseConfig = JSON.parse(firebaseConfigStr);
            const appId = process.env.VITE_APP_ID || 'tradejournall-app';

            const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
            const db = getFirestore(app);

            const sitemapRef = doc(db, 'artifacts', appId, 'config', 'sitemap_data');
            const sitemapSnap = await getDoc(sitemapRef);

            if (sitemapSnap.exists()) {
                const data = sitemapSnap.data();
                blogEntries = (data.posts || []) as Array<{ slug: string; lastmod: string }>;
            }
        }
    } catch (err) {
        console.error('[Sitemap] Failed to read from Firestore:', err);
        // Graceful degradation: return homepage-only sitemap
    }

    const today = new Date().toISOString().split('T')[0];

    const blogUrls = blogEntries.map(entry => `
  <url>
    <loc>${SITE_URL}/blog/${entry.slug}</loc>
    <lastmod>${entry.lastmod || today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>${blogUrls}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).send(sitemap);
}
