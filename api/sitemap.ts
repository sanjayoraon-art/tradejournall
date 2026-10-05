// Vercel Serverless Function: /api/sitemap
// Returns a dynamic sitemap.xml with homepage + all trading tools + all published blog posts
// Data is read from Firestore: artifacts/{appId}/blog with fallback to static master articles

import type { VercelRequest, VercelResponse } from '@vercel/node';

const SITE_URL = 'https://tradejournall.com';

const STATIC_BLOG_SLUGS = [
    { slug: 'zerodha-vs-groww-brokerage-and-crypto-tax-calculator-guide', lastmod: '2026-09-28', priority: '0.90' },
    { slug: 'indian-crypto-tax-1-percent-tds-30-percent-tax-guide', lastmod: '2026-09-25', priority: '0.85' },
    { slug: 'option-trading-net-profit-breakeven-calculator-guide', lastmod: '2026-09-20', priority: '0.85' }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const today = new Date().toISOString().split('T')[0];

    // Try to read dynamic blog slugs from Firestore
    const blogMap = new Map<string, { lastmod: string; priority: string }>();

    // Seed with static master articles first
    STATIC_BLOG_SLUGS.forEach(item => {
        blogMap.set(item.slug, { lastmod: item.lastmod, priority: item.priority });
    });

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

            querySnapshot.docs.forEach(doc => {
                const data = doc.data();
                if (data.slug) {
                    const lastmod = data.lastUpdated 
                        ? (typeof data.lastUpdated === 'string' ? data.lastUpdated.split('T')[0] : today) 
                        : (data.date || today);
                    blogMap.set(data.slug, { lastmod, priority: '0.85' });
                }
            });
        }
    } catch (err) {
        console.error('[Sitemap] Failed to read from Firestore:', err);
    }

    const dynamicBlogUrls = Array.from(blogMap.entries()).map(([slug, meta]) => `
  <url>
    <loc>${SITE_URL}/blog/${slug}</loc>
    <lastmod>${meta.lastmod || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${meta.priority || '0.8'}</priority>
  </url>`).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage Master Hub -->
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Trading Tools and Risk Calculators -->
  <url>
    <loc>${SITE_URL}/tools/session-clock-ist</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>${SITE_URL}/tools/revenge-trading-cooldown-timer</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>${SITE_URL}/tools/drawdown-recovery-calculator</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>${SITE_URL}/tools/trading-drawdown-recovery-calculator</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>${SITE_URL}/tools/leverage-danger-calculator</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>${SITE_URL}/tools/crypto-liquidation-calculator</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>${SITE_URL}/tools/ftmo-calculator</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>${SITE_URL}/tools/prop-firm-calculator</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>${SITE_URL}/tools/nifty-option-theta-decay-calculator</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>${SITE_URL}/calculators/stocks/zerodha-vs-groww-brokerage-calculator</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>${SITE_URL}/calculators/stocks/option-trading-net-profit-breakeven-calculator</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>${SITE_URL}/calculators/crypto/coindcx-vs-delta-exchange-fee-calculator</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>${SITE_URL}/calculators/crypto/crypto-30-percent-tax-and-1-percent-tds-calculator</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>${SITE_URL}/calculators/forex/exness-vs-xm-spread-calculator</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>

  <!-- Trading Games and Practice Simulators -->
  <url>
    <loc>${SITE_URL}/candle-clash</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>${SITE_URL}/game</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>${SITE_URL}/buy-the-dip</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>${SITE_URL}/game-page.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>${SITE_URL}/buy-the-dip.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>

  <!-- Trading Blog and Educational Articles Hub -->
  <url>
    <loc>${SITE_URL}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.90</priority>
  </url>${dynamicBlogUrls}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).send(sitemap);
}
