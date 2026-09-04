import type { VercelRequest, VercelResponse } from '@vercel/node';

const SITE_URL = 'https://tradejournall.com';

function escapeXml(unsafe: string): string {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    let posts: any[] = [];

    try {
        const firebaseConfigStr = process.env.VITE_FIREBASE_CONFIG;
        if (firebaseConfigStr) {
            const { initializeApp, getApps } = await import('firebase/app');
            const { getFirestore, collection, query, where, getDocs } = await import('firebase/firestore');

            const firebaseConfig = JSON.parse(firebaseConfigStr);
            const appId = process.env.VITE_APP_ID || 'tradejournall-app';

            const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
            const db = getFirestore(app);

            const q = query(
                collection(db, 'artifacts', appId, 'blog'),
                where('isActive', '==', true)
            );
            const querySnapshot = await getDocs(q);

            posts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Sort descending: newest posts first
            posts.sort((a, b) => {
                const getTime = (p: any) => {
                    const val = p.date || p.lastUpdated || p.createdAt;
                    if (!val) return 0;
                    if (typeof val === 'object' && val.seconds) return val.seconds * 1000;
                    const ms = new Date(val).getTime();
                    return isNaN(ms) ? 0 : ms;
                };
                return getTime(b) - getTime(a);
            });
        }
    } catch (err) {
        console.error('[RSS Feed] Error fetching blogs:', err);
    }

    const itemsXml = posts.map(post => {
        const title = escapeXml(post.title || 'Trading Journal Article');
        const link = `${SITE_URL}/blog/${post.slug}`;
        const description = escapeXml(post.excerpt || post.metaDescription || post.title);
        const author = escapeXml(post.author || 'TradeJournall');
        const category = escapeXml(post.category || 'Trading');
        const rawDate = post.date || post.lastUpdated;
        const pubDate = rawDate?.toDate 
            ? rawDate.toDate().toUTCString() 
            : (typeof rawDate === 'string' ? new Date(rawDate).toUTCString() : new Date().toUTCString());

        // Pinterest loves 2:3 vertical images (1000x1500)
        const imageUrl = post.pinterestImage || post.featuredImage || `${SITE_URL}/logo.png`;

        return `
    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${description}</description>
      <dc:creator>${author}</dc:creator>
      <category>${category}</category>
      <pubDate>${pubDate}</pubDate>
      <media:content url="${escapeXml(imageUrl)}" medium="image" type="image/jpeg" />
      <enclosure url="${escapeXml(imageUrl)}" type="image/jpeg" length="0" />
    </item>`;
    }).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>TradeJournall - Free Crypto &amp; Stock Market Trading Guides</title>
    <link>${SITE_URL}</link>
    <description>Latest cryptocurrency trading strategies, risk management masterclasses, and trading psychology guides from TradeJournall.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
    res.status(200).send(rss);
}
