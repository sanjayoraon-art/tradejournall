import React, { useEffect, useState } from 'react';
import { Brain, Send, ShoppingBag } from 'lucide-react';
import { Trade, PerformanceStats } from '../types';
import { exponentialBackoffFetch, API_URL } from '../utils/api';
import { collection, getDocs } from 'firebase/firestore';
import { db, appId } from '../utils/firebase';

interface AiChatScreenProps {
    theme: any;
    chatMessages: Array<{ role: string; text: string }>;
    isThinking: boolean;
    chatEndRef: React.RefObject<HTMLDivElement>;
    chatInput: string;
    setChatInput: (input: string) => void;
    handleAiAsk: () => void;
    products: any[];
    trackProductClick: (productId: string) => void;
}

export const AiChatScreen: React.FC<AiChatScreenProps> = ({ theme, chatMessages, isThinking, chatEndRef, chatInput, setChatInput, handleAiAsk, products, trackProductClick }) => {
    // Products are now passed from App.tsx via props for real-time sync

    const scrollToBottom = () => {
        setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages, isThinking, products]);

    return (
        <div className="flex flex-col h-full bg-inherit">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-4">
                {chatMessages.length === 0 && (
                    <div className="text-center py-10">
                        <Brain size={48} className="mx-auto text-green-500/20 mb-4" />
                        <h3 className={`text-lg font-bold ${theme.text}`}>AI Performance Coach</h3>
                        <p className="text-gray-400 text-sm mt-2">Ask me anything about your trading history or ways to improve your strategy.</p>
                    </div>
                )}
                {chatMessages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm leading-relaxed ${m.role === 'user' ? 'bg-green-600 text-white rounded-tr-none' : 'bg-gray-800 border border-gray-700 text-gray-100 rounded-tl-none'}`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isThinking && (
                    <div className="flex justify-start">
                        <div className="bg-gray-800 border border-gray-700 p-3 rounded-2xl rounded-tl-none flex gap-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />

                {/* Product Recommendations - Integrated into main scroll */}
                {products.length > 0 ? (
                    <div className="pt-6 pb-20">
                        <div className="flex items-center gap-2 mb-4 px-1">
                            <ShoppingBag size={18} className="text-green-500" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Recommended Tools</h3>
                            <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded-full text-gray-500 font-bold">
                                {products.length} Items Loaded
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {products.map((p, i) => (
                                <a
                                    key={i}
                                    href={p.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={() => trackProductClick(p.id)}
                                    className={`flex flex-col rounded-[1.5rem] border ${theme.border} ${theme.card} overflow-hidden hover:border-green-500 transition-all cursor-pointer group shadow-lg hover:shadow-green-500/10 hover:-translate-y-1`}
                                >
                                    <div className="aspect-square w-full bg-black/40 relative overflow-hidden flex items-center justify-center border-b border-gray-700/30">
                                        {p.imageUrl ? (
                                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-600 gap-1">
                                                <ShoppingBag size={24} className="opacity-20" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-3 bg-gray-800/10 text-center">
                                        <p className="text-[11px] font-bold text-gray-300 group-hover:text-green-500 transition-colors truncate px-1">
                                            {p.name}
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="py-10 text-center opacity-30">
                        <p className="text-xs italic">Searching for personalized recommendations...</p>
                    </div>
                )}
            </div>

            <div className={`p-4 border-t ${theme.border} bg-inherit sticky bottom-0 z-10`}>
                <div className="flex gap-2 items-center bg-gray-800 rounded-2xl border border-gray-700 p-1 pl-3">
                    <input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAiAsk();
                            }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent py-3 text-white outline-none text-sm"
                    />
                    <button
                        onClick={handleAiAsk}
                        disabled={isThinking || !chatInput.trim()}
                        className={`p-3 rounded-xl transition-all ${!chatInput.trim() || isThinking ? 'text-gray-600' : 'bg-green-600 text-white hover:bg-green-500 active:scale-90'}`}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
