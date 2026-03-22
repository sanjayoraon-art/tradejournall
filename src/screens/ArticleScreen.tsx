import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { db, appId } from '../utils/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { ArrowLeft, Calendar, User, Share2, Facebook, Twitter, Link as LinkIcon, Loader2 } from 'lucide-react';

interface ArticleScreenProps {
    slug: string;
    onBack: () => void;
    theme: any;
}

export const ArticleScreen: React.FC<ArticleScreenProps> = ({ slug, onBack, theme }) => {
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState(false);

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

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
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

    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto px-4">
            <Helmet>
                <title>{article.metaTitle || `${article.title} | Trade Journal Blog`}</title>
                <meta name="description" content={article.metaDescription || article.excerpt} />
                <meta name="keywords" content={article.keywords} />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="article" />
                <meta property="og:title" content={article.metaTitle || article.title} />
                <meta property="og:description" content={article.metaDescription || article.excerpt} />
                <meta property="og:image" content={article.featuredImage} />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content={article.metaTitle || article.title} />
                <meta property="twitter:description" content={article.metaDescription || article.excerpt} />
                <meta property="twitter:image" content={article.featuredImage} />
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
                <div className="flex items-center gap-4 text-xs uppercase tracking-widest font-black text-gray-500 mb-4">
                    <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-green-500" />
                        {formattedDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <User size={14} className="text-blue-500" />
                        {article.author || 'Admin'}
                    </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-[1.1] tracking-tight text-white">
                    {article.title}
                </h1>

                {article.featuredImage && (
                    <div className="rounded-3xl overflow-hidden border border-gray-800 shadow-2xl mb-12 aspect-[21/9]">
                        <img 
                            src={article.featuredImage} 
                            alt={article.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
            </header>

            {/* Article Content */}
            <article className={`prose prose-invert prose-green max-w-none mb-20 leading-relaxed text-gray-300`}>
                <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({node, ...props}) => <h2 className="text-3xl font-black mt-12 mb-6 text-white" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-2xl font-black mt-10 mb-5 text-white" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-8 mb-4 text-white" {...props} />,
                        p: ({node, ...props}) => <p className="mb-6 leading-8 text-lg" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-8 space-y-3" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-8 space-y-3" {...props} />,
                        li: ({node, ...props}) => <li className="text-gray-300" {...props} />,
                        blockquote: ({node, ...props}) => (
                            <blockquote className="border-l-4 border-green-500 bg-green-500/5 p-6 rounded-r-2xl italic mb-8 mt-4 quote-no-padding-v" {...props} />
                        ),
                        img: ({node, ...props}) => (
                            <div className="my-10">
                                <img className="rounded-2xl border border-gray-800 shadow-xl w-full mx-auto" {...props} />
                                {props.alt && <p className="text-center text-sm text-gray-500 mt-3 italic font-medium">{props.alt}</p>}
                            </div>
                        ),
                        code: ({node, inline, className, children, ...props}: any) => {
                            return inline ? (
                                <code className="bg-gray-800 px-1.5 py-0.5 rounded text-pink-400 font-mono text-sm" {...props}>{children}</code>
                            ) : (
                                <pre className="bg-gray-900 border border-gray-800 p-5 rounded-2xl overflow-x-auto my-8">
                                    <code className="text-green-400 font-mono text-sm" {...props}>{children}</code>
                                </pre>
                            );
                        }
                    }}
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
                            <button className="p-3 rounded-full bg-gray-800 hover:bg-blue-600 transition-all text-white active:scale-90">
                                <Twitter size={18} />
                            </button>
                            <button className="p-3 rounded-full bg-gray-800 hover:bg-blue-800 transition-all text-white active:scale-90">
                                <Facebook size={18} />
                            </button>
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

            {/* Structured Data (Schema.org) for Google */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    "headline": article.title,
                    "image": article.featuredImage,
                    "author": {
                        "@type": "Person",
                        "name": article.author || "Admin"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "Trade Journal",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://tradejournal.app/logo.png"
                        }
                    },
                    "datePublished": article.date?.toDate ? article.date.toDate().toISOString() : new Date().toISOString(),
                    "description": article.metaDescription || article.excerpt
                })}
            </script>
        </div>
    );
};
