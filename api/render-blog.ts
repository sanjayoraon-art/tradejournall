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
                const author = article.author || "Pro Analyst";
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
  <div class="min-h-screen bg-gray-900 text-white font-sans py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <nav class="mb-8 flex items-center justify-between">
        <a href="/blog" class="text-green-400 hover:text-green-300 font-bold inline-flex items-center gap-2">&larr; All Articles</a>
        <a href="/" class="text-gray-400 hover:text-white text-sm font-semibold">TradeJournall Home</a>
      </nav>
      <article class="prose prose-invert max-w-none">
        <header class="mb-8 border-b border-gray-800 pb-8">
          ${article.category ? `<span class="inline-block px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full bg-green-500/10 text-green-400 border border-green-500/30 mb-4">${article.category}</span>` : ''}
          <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">${article.title || title}</h1>
          <div class="flex items-center gap-4 text-sm text-gray-400">
            <span>By <strong class="text-gray-200">${author}</strong></span>
            <span>&bull;</span>
            <time datetime="${publishedDate}">${new Date(publishedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
          </div>
        </header>
        ${image ? `<div class="mb-8 rounded-2xl overflow-hidden"><img src="${image}" alt="${title}" class="w-full h-auto object-cover max-h-[500px]" /></div>` : ''}
        <div class="text-gray-300 text-base sm:text-lg leading-relaxed space-y-4">
          ${contentHtml}
        </div>
      </article>
      <footer class="mt-12 pt-8 border-t border-gray-800 flex justify-between items-center text-sm text-gray-400">
        <a href="/blog" class="text-green-400 font-bold">&larr; Back to Trading Blog</a>
        <a href="/" class="text-white font-bold">Start Free Crypto Journal &rarr;</a>
      </footer>
    </div>
  </div>
</div>`;

                // Replace strictly matching tags from index.html
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
        }
    } catch (err) {
        console.error('[Blog SEO] Failed to read from Firestore:', err);
        // Fallback gracefully and serve unmodified index.html instead of failing completely
    }

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).send(indexHtml);
}
