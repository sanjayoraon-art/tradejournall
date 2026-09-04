import React from 'react';
import { Calendar, User, ArrowRight, Clock, Tag } from 'lucide-react';

interface BlogCardProps {
    post: {
        id: string;
        title: string;
        excerpt: string;
        featuredImage?: string;
        date: any;
        lastUpdated?: any;
        author?: string;
        slug: string;
        category?: string;
        readingTime?: number;
    };
    onClick?: (slug: string) => void;
    theme: any;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, onClick, theme }) => {
    // Robust date parsing (Timestamp, ISO string, Date object)
    const rawDate = post.date || post.lastUpdated;
    let formattedDate = 'Recent';
    try {
        if (rawDate?.toDate) {
            formattedDate = rawDate.toDate().toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } else if (typeof rawDate === 'string') {
            const d = new Date(rawDate);
            if (!isNaN(d.getTime())) {
                formattedDate = d.toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                });
            }
        } else if (rawDate?.seconds) {
            formattedDate = new Date(rawDate.seconds * 1000).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        }
    } catch (e) {
        formattedDate = 'Recent';
    }

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (onClick && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            onClick(post.slug);
        }
    };

    return (
        <a 
            href={`/blog/${post.slug}`}
            onClick={handleClick}
            className={`block ${theme.card} border ${theme.border} rounded-2xl overflow-hidden hover:border-green-500/50 transition-all group group-hover:shadow-2xl group-hover:shadow-green-500/10 no-underline`}
            style={{ textDecoration: 'none' }}
        >
            <div className="aspect-video w-full overflow-hidden relative bg-gray-900">
                {post.featuredImage ? (
                    <img 
                        src={post.featuredImage} 
                        alt={post.title} 
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-6 text-center">
                        <span className="text-gray-500 font-black text-lg tracking-tight group-hover:text-green-400 transition-colors">
                            {post.title}
                        </span>
                    </div>
                )}
                
                {post.category && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-full bg-gray-900/80 backdrop-blur-md text-green-400 border border-green-500/30">
                            {post.category}
                        </span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-green-400 font-bold text-sm flex items-center gap-1.5">
                        Read Full Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </div>
            </div>
            
            <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                    <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider font-bold text-gray-400 mb-3 flex-wrap">
                        <span className="flex items-center gap-1 text-green-400">
                            <Calendar size={12} />
                            {formattedDate}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400">
                            <User size={12} className="text-blue-400" />
                            {post.author || 'Pro Analyst'}
                        </span>
                        {post.readingTime && (
                            <span className="flex items-center gap-1 text-gray-500">
                                <Clock size={12} />
                                {post.readingTime} min read
                            </span>
                        )}
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-black mb-2 leading-snug text-white group-hover:text-green-400 transition-colors line-clamp-2">
                        {post.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed mb-4">
                        {post.excerpt}
                    </p>
                </div>
                
                <div className="pt-3 border-t border-gray-700/50 flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-green-400 uppercase tracking-wider flex items-center gap-1">
                        Read Guide
                    </span>
                    <ArrowRight size={16} className="text-green-400 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </a>
    );
};
