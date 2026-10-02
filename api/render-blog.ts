import type { VercelRequest, VercelResponse } from '@vercel/node';

function markdownToHtml(md: string): string {
    if (!md) return '';
    return md
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3 text-white">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4 text-white">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-black mt-8 mb-4 text-white">$1</h1>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-green-500 pl-4 py-1 my-4 text-gray-300 italic">$1</blockquote>')
        .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-gray-300">$1</li>')
        .split('\n\n')
        .map(paragraph => {
            const trimmed = paragraph.trim();
            if (!trimmed) return '';
            if (trimmed.startsWith('<h') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<li')) {
                return trimmed;
            }
            return `<p class="my-4 text-gray-300 leading-relaxed">${trimmed.replace(/\n/g, '<br/>')}</p>`;
        })
        .join('\n');
}

const STATIC_MASTER_ARTICLES: Record<string, any> = {
    'zerodha-vs-groww-brokerage-and-crypto-tax-calculator-guide': {
        title: 'Zerodha vs Groww Brokerage & Crypto Tax Calculator 2026: STT, GST, 1% TDS & 30% Tax Explained',
        metaTitle: 'Zerodha vs Groww Brokerage & Crypto Tax Calculator 2026',
        metaDescription: 'Free 2026 fee & tax guide comparing Zerodha vs Groww brokerage charges, STT, 18% GST, 1% TDS, and 30% flat crypto tax. Know your exact net profit before trading.',
        author: 'TradeJournall Senior Tax & Quant Analyst',
        category: 'Brokerage & Taxes',
        date: '2026-09-28',
        featuredImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
        content: `When executing trades in the Indian Stock Market or Global Crypto Derivatives markets, hidden trading costs and taxes can consume up to 30% to 50% of your gross profits. Whether you trade Nifty Options on Zerodha, Intraday stocks on Groww, or BTC Futures on Delta Exchange India and CoinDCX, knowing your exact net profit is crucial.`
    },
    'indian-crypto-tax-1-percent-tds-30-percent-tax-guide': {
        title: 'Indian Crypto Tax Guide 2026: Section 194S 1% TDS and Section 115BBH 30% Tax Math',
        metaTitle: 'Indian Crypto Tax Guide 2026: 1% TDS & 30% Tax',
        metaDescription: 'Step-by-step guide to calculating 1% TDS withholding (Sec 194S) and 30% flat tax (Sec 115BBH) on Bitcoin, Ethereum, and crypto futures trades in India.',
        author: 'TradeJournall Tax Research Desk',
        category: 'Crypto Tax',
        date: '2026-09-25',
        featuredImage: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80',
        content: `Under current Indian tax laws, Virtual Digital Assets (VDAs) including Bitcoin, Ethereum, Altcoins, and Crypto Futures contracts are taxed under a strict regime: 1% TDS (Section 194S) and flat 30% Tax (Section 115BBH).`
    },
    'option-trading-net-profit-breakeven-calculator-guide': {
        title: 'Options Trading Net Profit & Breakeven Point Calculation: Nifty & BankNifty Guide',
        metaTitle: 'Options Trading Net Profit & Breakeven Guide',
        metaDescription: 'Calculate exact breakeven points for Nifty & BankNifty options trading including STT, GST, and exchange fees.',
        author: 'Quant Derivative Analyst',
        category: 'Options Trading',
        date: '2026-09-20',
        featuredImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
        content: `In Options trading, buying an option at 100 and selling at 105 does not mean a net profit of 5 points. After deducting flat 40 brokerage, STT (0.0625% on sell premium), NSE charges, and 18% GST, your actual breakeven requires extra points.`
    }
};

const FALLBACK_SHELL = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/png" href="/logo.png" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TradeJournall Blog</title>
  <meta name="title" content="TradeJournall Blog" />
  <meta name="description" content="Master trading with professional articles." />
  <meta property="og:title" content="TradeJournall Blog" />
  <meta property="og:description" content="Master trading with professional articles." />
  <meta property="og:image" content="https://tradejournall.com/logo.png" />
  <meta property="og:url" content="https://tradejournall.com/blog" />
  <meta property="twitter:title" content="TradeJournall Blog" />
  <meta property="twitter:description" content="Master trading with professional articles." />
  <meta property="twitter:image" content="https://tradejournall.com/logo.png" />
  <meta property="twitter:url" content="https://tradejournall.com/blog" />
</head>
<body class="bg-[#0a0f1d] text-slate-100 font-sans">
  <div id="root"></div>
</body>
</html>`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { slug } = req.query;
    const baseUrl = 'https://tradejournall.com';
    
    let indexHtml = '';
    try {
        const resp = await fetch(baseUrl, { signal: AbortSignal.timeout(3000) });
        if (resp.ok) {
            indexHtml = await resp.text();
        } else {
            indexHtml = FALLBACK_SHELL;
        }
    } catch (e) {
        console.warn("Could not fetch live index.html, using fallback shell:", e);
        indexHtml = FALLBACK_SHELL;
    }

    if (!slug || typeof slug !== 'string') {
        return res.status(200).setHeader('Content-Type', 'text/html').send(indexHtml);
    }

    let article: any = STATIC_MASTER_ARTICLES[slug] || null;

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
                article = querySnapshot.docs[0].data();
            }
        }
    } catch (err) {
        console.error('[Blog SEO] Failed to read from Firestore:', err);
    }

    if (article) {
        const title = article.metaTitle || `${article.title} | TradeJournall Blog`;
        const description = article.metaDescription || article.excerpt || "Trading journal blog article.";
        const image = article.featuredImage || "https://tradejournall.com/logo.png";
        const author = article.author || "TradeJournall Senior Analyst";
        const articleUrl = `https://tradejournall.com/blog/${slug}`;
        const rawDate = article.date || article.lastUpdated;
        const publishedDate = rawDate?.toDate 
            ? rawDate.toDate().toISOString() 
            : (typeof rawDate === 'string' ? rawDate : new Date().toISOString());

        // JSON-LD Structured Data for Googlebot & Rich Snippets
        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "description": description,
            "image": image,
            "author": {
                "@type": "Person",
                "name": author
            },
            "publisher": {
                "@type": "Organization",
                "name": "TradeJournall",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://tradejournall.com/logo.png"
                }
            },
            "datePublished": publishedDate,
            "dateModified": publishedDate,
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": articleUrl
            }
        };

        const jsonLdScript = `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
        const canonicalTag = `<link rel="canonical" href="${articleUrl}" />`;

        // Pre-render semantic article content into <div id="root"> so Googlebot sees the complete text immediately!
        const contentHtml = markdownToHtml(article.content || article.excerpt || '');
        const preRenderedHtml = `
<div id="root">
  <div class="min-h-screen bg-[#0a0f1d] text-slate-100 font-sans py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <nav class="mb-8 flex items-center justify-between">
        <a href="/blog" class="text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-2">&larr; All Articles</a>
        <a href="/" class="text-slate-400 hover:text-white text-sm font-semibold">TradeJournall Home</a>
      </nav>
      <article class="prose prose-invert max-w-none">
        <header class="mb-8 border-b border-slate-800 pb-8">
          ${article.category ? `<span class="inline-block px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-4">${article.category}</span>` : ''}
          <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">${article.title || title}</h1>
          <div class="flex items-center gap-4 text-sm text-slate-400">
            <span>By <strong class="text-slate-200">${author}</strong></span>
            <span>&bull;</span>
            <time datetime="${publishedDate}">${new Date(publishedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
          </div>
        </header>
        ${image ? `<div class="mb-8 rounded-2xl overflow-hidden"><img src="${image}" alt="${title}" class="w-full h-auto object-cover max-h-[500px]" /></div>` : ''}
        <div class="text-slate-300 text-base sm:text-lg leading-relaxed space-y-4">
          ${contentHtml}
        </div>
      </article>
      <footer class="mt-12 pt-8 border-t border-slate-800 flex justify-between items-center text-sm text-slate-400">
        <a href="/blog" class="text-emerald-400 font-bold">&larr; Back to Trading Blog</a>
        <a href="/" class="text-white font-bold">Start Free Crypto Journal &rarr;</a>
      </footer>
    </div>
  </div>
</div>`;

        indexHtml = indexHtml
            .replace(
                /<title>.*?<\/title>/gi, 
                `<title>${title}</title>\n    ${canonicalTag}\n    ${jsonLdScript}`
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
                /<meta property="og:url" content=".*?"\s*\/>/gi, 
                `<meta property="og:url" content="${articleUrl}" />`
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
                /<meta property="twitter:url" content=".*?"\s*\/>/gi, 
                `<meta property="twitter:url" content="${articleUrl}" />`
            )
            .replace(
                /<meta property="twitter:description"[\s\S]*?content=".*?"\s*\/>/gi, 
                `<meta property="twitter:description" content="${description}" />`
            )
            .replace(
                /<meta property="twitter:image" content=".*?"\s*\/>/gi, 
                `<meta property="twitter:image" content="${image}" />`
            )
            .replace(
                /<div id="root"><\/div>/i,
                preRenderedHtml
            );
    }

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).send(indexHtml);
}
