import React, { useState, useEffect } from 'react';
import { db, appId } from '../utils/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { BlogCard } from '../components/BlogCard';
import { Search, Filter, ArrowLeft, Loader2 } from 'lucide-react';

interface BlogScreenProps {
    onBack: () => void;
    onArticleClick: (slug: string) => void;
    theme: any;
}

export const BlogScreen: React.FC<BlogScreenProps> = ({ onBack, onArticleClick, theme }) => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            if (!db) return;
            try {
                const q = query(
                    collection(db, 'artifacts', appId, 'blog'),
                    where('isActive', '==', true),
                    orderBy('date', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const fetchedPosts = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPosts(fetchedPosts);
            } catch (error) {
                console.error("Error fetching blog posts:", error);
                // Fallback or empty state
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`flex flex-col h-full animate-in fade-in duration-500`}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className={`p-2 rounded-xl ${theme.card} border ${theme.border} hover:scale-105 active:scale-95 transition-all text-gray-400 hover:text-white`}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                            Trading Blog
                        </h2>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Master the Markets with Daily Articles</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 rounded-2xl ${theme.card} border ${theme.border} outline-none focus:border-green-500 transition-all font-bold placeholder:text-gray-600`}
                    />
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-green-500 mb-4" size={40} />
                    <p className="text-gray-500 font-bold">Loading Articles...</p>
                </div>
            ) : filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {filteredPosts.map(post => (
                        <BlogCard 
                            key={post.id} 
                            post={post} 
                            onClick={onArticleClick} 
                            theme={theme} 
                        />
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-gray-800 rounded-3xl flex items-center justify-center mb-6 text-gray-600">
                        <Search size={40} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No Articles Found</h3>
                    <p className="text-gray-500 max-w-xs">Try searching for something else or check back later for new posts.</p>
                </div>
            )}

            {/* Newsletter / CTA */}
            {!loading && (
                <div className={`mt-16 p-8 rounded-3xl bg-gradient-to-br from-green-500/10 to-transparent border ${theme.border} text-center relative overflow-hidden`}>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black mb-3">Never Miss a Strategy</h3>
                        <p className="text-gray-400 mb-6 max-w-md mx-auto">Get trading tips, market analysis, and educational content delivered straight to your dashboard.</p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input 
                                type="email" 
                                placeholder="Your email address" 
                                className={`flex-1 px-6 py-4 rounded-xl ${theme.card} border ${theme.border} outline-none font-bold`}
                            />
                            <button className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-black rounded-xl transition-all shadow-lg shadow-green-900/20 active:scale-95">
                                SUBSCRIBE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
