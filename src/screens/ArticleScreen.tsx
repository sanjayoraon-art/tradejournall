import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { db, appId } from '../utils/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { ArrowLeft, Calendar, User, Share2, Facebook, Twitter, Link as LinkIcon, Loader2, Clock, List as ListIcon, ChevronRight } from 'lucide-react';

interface ArticleScreenProps {
    slug: string;
    onBack: () => void;
    theme: any;
}

// Estimate reading time
function getReadingTime(content: string): number {
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

// Extract headings from markdown for Table of Contents
interface Heading {
    level: 2 | 3;
    text: string;
    id: string;
}

function extractHeadings(content: string): Heading[] {
    const lines = content.split('\n');
    const headings: Heading[] = [];
    for (const line of lines) {
        const m2 = line.match(/^## (.+)$/);
        const m3 = line.match(/^### (.+)$/);
        if (m2) {
            const text = m2[1].trim();
            headings.push({ level: 2, text, id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-') });
        } else if (m3) {
            const text = m3[1].trim();
            headings.push({ level: 3, text, id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-') });
        }
    }
    return headings;
}

export const ArticleScreen: React.FC<ArticleScreenProps> = ({ slug, onBack, theme }) => {
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState(false);
    const [showToc, setShowToc] = useState(false);
    const [activeHeading, setActiveHeading] = useState('');
    const articleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!db || !slug) return;
            try {
                const q = query(
                    collection(db, 'artifacts', appId, 'blog'),
                    where('slug', '==', slug),
                    limit(1)
                );
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    setArticle(querySnapshot.docs[0].data());
                }
            } catch (error) {
                console.error("Error fetching article:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
        window.scrollTo(0, 0);
    }, [slug]);

    // Track active heading on scroll
    useEffect(() => {
        if (!article) return;
        const headings = extractHeadings(article.content || '');
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveHeading(entry.target.id);
                    }
                }
            },
            { rootMargin: '-80px 0px -60% 0px' }
        );

        headings.forEach(h => {
            const el = document.getElementById(h.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [article]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const scrollToHeading = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setShowToc(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-green-500 mb-4" size={40} />
                <p className="text-gray-500 font-bold">Loading Article...</p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                <h3 className="text-2xl font-black mb-4 text-red-500">Article Not Found</h3>
                <button
                    onClick={onBack}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold transition-all flex items-center gap-2 mx-auto"
                >
                    <ArrowLeft size={18} /> Back to Blog
                </button>
            </div>
        );
    }

    const formattedDate = article.date?.toDate ? article.date.toDate().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }) : new Date().toLocaleDateString();

    const readingTime = getReadingTime(article.content || '');
    const headings = extractHeadings(article.content || '');
    const canonicalUrl = `https://tradejournall.com/blog/${slug}`;
    const hasToc = headings.length >= 3;

    // Custom heading components that add id anchors
    const headingComponents = {
        h1: ({ node, children, ...props }: any) => {
            const text = String(children).replace(/\s+/g, ' ').trim();
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return <h2 id={id} className="text-3xl font-black mt-12 mb-6 text-white scroll-mt-24" {...props} />;
        },
        h2: ({ node, children, ...props }: any) => {
            const text = String(children).replace(/\s+/g, ' ').trim();
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return <h2 id={id} className="text-2xl font-black mt-10 mb-5 text-white scroll-mt-24" {...props} />;
        },
        h3: ({ node, children, ...props }: any) => {
            const text = String(children).replace(/\s+/g, ' ').trim();
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return <h3 id={id} className="text-xl font-bold mt-8 mb-4 text-white scroll-mt-24" {...props} />;
        },
        p: ({ node, ...props }: any) => <p className="mb-6 leading-8 text-lg" {...props} />,
        ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 mb-8 space-y-3" {...props} />,
        ol: ({ node, ...props }: any) => <ol className="list-decimal pl-6 mb-8 space-y-3" {...props} />,
        li: ({ node, ...props }: any) => <li className="text-gray-300" {...props} />,
        blockquote: ({ node, ...props }: any) => (
            <blockquote className="border-l-4 border-green-500 bg-green-500/5 p-6 rounded-r-2xl italic mb-8 mt-4" {...props} />
        ),
        strong: ({ node, ...props }: any) => <strong className="font-black text-white px-0.5" {...props} />,
        em: ({ node, ...props }: any) => <em className="italic text-gray-300" {...props} />,
        img: ({ node, ...props }: any) => (
            <div className="my-10 overflow-hidden flex justify-center bg-black/20 rounded-2xl p-2">
                <img className="rounded-xl shadow-xl mx-auto object-contain" style={{ width: 'auto', maxWidth: '100%', maxHeight: '600px' }} {...props} />
                {props.alt && <p className="text-center text-sm text-gray-500 mt-3 italic font-medium">{props.alt}</p>}
            </div>
        ),
        code: ({ node, inline, className, children, ...props }: any) => {
            return inline ? (
                <code className="bg-gray-800 px-1.5 py-0.5 rounded text-pink-400 font-mono text-sm" {...props}>{children}</code>
            ) : (
                <pre className="bg-gray-900 border border-gray-800 p-5 rounded-2xl overflow-x-auto my-8">
                    <code className="text-green-400 font-mono text-sm" {...props}>{children}</code>
                </pre>
            );
        }
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BlogPosting",
                "@id": `${canonicalUrl}#article`,
                "headline": article.title,
                "name": article.metaTitle || article.title,
                "description": article.metaDescription || article.excerpt,
                "image": {
                    "@type": "ImageObject",
                    "url": article.featuredImage || "https://tradejournall.com/logo.png"
                },
                "author": {
                    "@type": "Person",
                    "name": article.author || "Admin"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "TradeJournall",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://tradejournall.com/logo.png"
                    }
                },
                "datePublished": article.date?.toDate ? article.date.toDate().toISOString() : new Date().toISOString(),
                "dateModified": article.lastUpdated?.toDate ? article.lastUpdated.toDate().toISOString() : new Date().toISOString(),
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": canonicalUrl
                },
                "keywords": article.keywords,
                "timeRequired": `PT${readingTime}M`,
                "inLanguage": "en-IN",
                "url": canonicalUrl
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://tradejournall.com"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Blog",
                        "item": "https://tradejournall.com/blog"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": article.title,
                        "item": canonicalUrl
                    }
                ]
            }
        ]
    };

    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto px-4">
            <Helmet>
                <title>{article.metaTitle || `${article.title} | Trade Journal Blog`}</title>
                <meta name="description" content={article.metaDescription || article.excerpt} />
                <meta name="keywords" content={article.keywords} />
                <link rel="canonical" href={canonicalUrl} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="article" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:title" content={article.metaTitle || article.title} />
                <meta property="og:description" content={article.metaDescription || article.excerpt} />
                <meta property="og:image" content={article.featuredImage || 'https://tradejournall.com/logo.png'} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="article:published_time" content={article.date?.toDate ? article.date.toDate().toISOString() : new Date().toISOString()} />
                <meta property="article:author" content={article.author || 'Admin'} />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={canonicalUrl} />
                <meta name="twitter:title" content={article.metaTitle || article.title} />
                <meta name="twitter:description" content={article.metaDescription || article.excerpt} />
                <meta name="twitter:image" content={article.featuredImage || 'https://tradejournall.com/logo.png'} />
            </Helmet>

            {/* Back Button */}
            <button
                onClick={onBack}
                className={`mb-8 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-green-500 transition-colors group`}
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to Blog
            </button>

            {/* Article Header */}
            <header className="mb-10">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-[11px] text-gray-600 mb-6 font-medium" aria-label="Breadcrumb">
                    <button onClick={onBack} className="hover:text-gray-400 transition-colors">Home</button>
                    <ChevronRight size={12} />
                    <button onClick={onBack} className="hover:text-gray-400 transition-colors">Blog</button>
                    <ChevronRight size={12} />
                    <span className="text-gray-500 truncate max-w-xs">{article.title}</span>
                </nav>

                <div className="flex items-center gap-4 text-xs uppercase tracking-widest font-black text-gray-500 mb-4 flex-wrap">
                    <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-green-500" />
                        {formattedDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <User size={14} className="text-blue-500" />
                        {article.author || 'Admin'}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock size={14} className="text-purple-400" />
                        {readingTime} min read
                    </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-[1.1] tracking-tight text-white">
                    {article.title}
                </h1>

                {article.excerpt && (
                    <p className="text-xl text-gray-400 leading-relaxed mb-8 border-l-4 border-green-500/40 pl-5">
                        {article.excerpt}
                    </p>
                )}

                {article.featuredImage && (
                    <div className="rounded-3xl overflow-hidden shadow-2xl mb-12 flex justify-center bg-black/20 p-2">
                        <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="object-contain rounded-2xl mx-auto"
                            style={{ width: 'auto', maxWidth: '100%', maxHeight: '600px' }}
                        />
                    </div>
                )}
            </header>

            {/* Table of Contents */}
            {hasToc && (
                <div className={`mb-10 rounded-2xl border ${theme.border} overflow-hidden`}>
                    <button
                        onClick={() => setShowToc(p => !p)}
                        className={`w-full flex items-center justify-between p-4 ${theme.card} hover:bg-gray-700/30 transition-colors`}
                    >
                        <div className="flex items-center gap-2 font-black text-sm uppercase tracking-widest text-gray-300">
                            <ListIcon size={16} className="text-green-500" />
                            Table of Contents
                            <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                {headings.length} sections
                            </span>
                        </div>
                        <ChevronRight
                            size={18}
                            className={`text-gray-500 transition-transform duration-300 ${showToc ? 'rotate-90' : ''}`}
                        />
                    </button>

                    {showToc && (
                        <div className={`${theme.card} border-t ${theme.border} p-4`}>
                            <nav className="space-y-1" aria-label="Table of Contents">
                                {headings.map((h, i) => (
                                    <button
                                        key={i}
                                        onClick={() => scrollToHeading(h.id)}
                                        className={`w-full text-left flex items-start gap-2 py-2 px-3 rounded-xl text-sm transition-all hover:bg-green-500/10 group ${activeHeading === h.id
                                                ? 'text-green-400 bg-green-500/10 font-bold'
                                                : 'text-gray-400 hover:text-gray-200'
                                            } ${h.level === 3 ? 'ml-4 text-xs' : ''}`}
                                    >
                                        <span className={`mt-0.5 shrink-0 ${h.level === 2 ? 'text-green-500' : 'text-gray-600'}`}>
                                            {h.level === 2 ? '●' : '○'}
                                        </span>
                                        {h.text}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            )}

            {/* Article Content */}
            <article ref={articleRef} className={`prose prose-invert prose-green max-w-none mb-20 leading-relaxed text-gray-300`}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={headingComponents}
                >
                    {article.content}
                </ReactMarkdown>
            </article>

            {/* Footer / Share */}
            <footer className={`pt-10 border-t ${theme.border} mb-20`}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h4 className="font-bold text-gray-400 mb-2 uppercase text-[10px] tracking-widest text-center md:text-left">Share this article</h4>
                        <div className="flex items-center gap-3">
                            <a
                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(article.metaTitle || article.title)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-3 rounded-full bg-gray-800 hover:bg-blue-600 transition-all text-white active:scale-90"
                            >
                                <Twitter size={18} />
                            </a>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-3 rounded-full bg-gray-800 hover:bg-blue-800 transition-all text-white active:scale-90"
                            >
                                <Facebook size={18} />
                            </a>
                            <button
                                onClick={handleCopyLink}
                                className={`p-3 rounded-full ${copySuccess ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'} transition-all text-white active:scale-90 relative`}
                            >
                                <LinkIcon size={18} />
                                {copySuccess && (
                                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[10px] py-1 px-2 rounded font-bold whitespace-nowrap animate-bounce">
                                        LINK COPIED!
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-3">
                        <p className="text-gray-400 text-sm font-medium">Enjoying our content?</p>
                        <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl transition-all shadow-lg shadow-green-900/20 active:scale-95 flex items-center gap-2">
                            Subscribe for Updates <Share2 size={18} />
                        </button>
                    </div>
                </div>
            </footer>

            {/* Structured Data (Schema.org) for Google — BlogPosting + BreadcrumbList */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        </div>
    );
};
