import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface BlogCardProps {
    post: {
        id: string;
        title: string;
        excerpt: string;
        featuredImage: string;
        date: any;
        author?: string;
        slug: string;
    };
    onClick: (slug: string) => void;
    theme: any;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, onClick, theme }) => {
    const formattedDate = post.date?.toDate ? post.date.toDate().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }) : new Date().toLocaleDateString();

    return (
        <div 
            onClick={() => onClick(post.slug)}
            className={`${theme.card} border ${theme.border} rounded-2xl overflow-hidden cursor-pointer hover:border-green-500/50 transition-all group group-hover:shadow-xl group-hover:shadow-green-500/5`}
        >
            <div className="aspect-video w-full overflow-hidden relative">
                {post.featuredImage ? (
                    <img 
                        src={post.featuredImage} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-600 font-bold">Trade Journal Blog</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white font-bold text-sm flex items-center gap-1">
                        Read Article <ArrowRight size={14} />
                    </span>
                </div>
            </div>
            
            <div className="p-5">
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-black text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-green-500" />
                        {formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                        <User size={12} className="text-blue-500" />
                        {post.author || 'Admin'}
                    </span>
                </div>
                
                <h3 className="text-xl font-black mb-2 leading-tight group-hover:text-green-500 transition-colors">
                    {post.title}
                </h3>
                
                <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                    {post.excerpt}
                </p>
                
                <div className="mt-4 pt-4 border-t border-gray-700/50 flex items-center justify-between">
                    <span className="text-xs font-bold text-green-500 uppercase tracking-wider">Read More</span>
                    <ArrowRight size={16} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </div>
    );
};
