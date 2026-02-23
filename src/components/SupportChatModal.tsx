import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, MessageSquare, Trash2 } from 'lucide-react';
import { exponentialBackoffFetch, API_URL } from '../utils/api';

interface SupportChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    isDarkMode: boolean;
    theme: any;
}

export const SupportChatModal: React.FC<SupportChatModalProps> = ({ isOpen, onClose, isDarkMode, theme }) => {
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Initial greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                { role: 'assistant', text: "Hello! I'm the automated support agent for Trade Journal Pro. How can I help you today?" }
            ]);
        }
    }, [isOpen]);

    // Auto-scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isThinking, isOpen]);

    const handleSend = async () => {
        if (!chatInput.trim()) return;
        const userMsg = chatInput;
        setChatInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsThinking(true);

        try {
            // Build conversation history for context
            // Limit history to last 10 messages to save tokens/complexity, or send full string
            const historyText = messages.map(m => `${m.role === 'user' ? 'User' : 'Agent'}: ${m.text}`).join('\n');

            const payload = {
                contents: [{
                    role: "user",
                    parts: [{
                        text: `System: You are a helpful customer support agent for the "Trade Journal Pro" app. 
                        Your goal is to help users with app navigation, features, and basic trading journal questions. 
                        Be polite, concise, and professional.
                        
                        Current Conversation History:
                        ${historyText}
                        
                        User's new question: ${userMsg}
                        
                        Answer as the Support Agent:`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 800,
                }
            };

            const result = await exponentialBackoffFetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const aiResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, I'm having trouble connecting to the support server right now. Please try again later.";
            setMessages(prev => [...prev, { role: 'assistant', text: aiResponse }]);

        } catch (error) {
            console.error("Support Chat Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsThinking(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
            <div className={`${theme.card} w-full max-w-md h-[600px] max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border ${theme.border} animate-in zoom-in-95 duration-200`}>

                {/* Header */}
                <div className={`p-4 border-b ${theme.border} flex items-center justify-between ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-xl">
                            <Bot size={24} className="text-indigo-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Help Center</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-xs text-gray-500 font-medium">AI Agent Online</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setMessages([
                                { role: 'assistant', text: "Chat cleared. How can I help you regarding Trade Journal Pro?" }
                            ])}
                            className={`p-2 rounded-xl transition-colors text-gray-400 hover:text-red-500 ${isDarkMode ? 'hover:bg-red-500/20' : 'hover:bg-red-100'}`}
                            title="Clear Chat"
                        >
                            <Trash2 size={20} />
                        </button>
                        <button onClick={onClose} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDarkMode ? 'bg-[#111318]' : 'bg-gray-50'}`}>
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {m.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mr-2 shrink-0 mt-2">
                                    <Bot size={14} className="text-indigo-500" />
                                </div>
                            )}
                            <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                : `${isDarkMode ? 'bg-gray-800 border border-gray-700 text-gray-200' : 'bg-white border border-gray-200 text-gray-800'} rounded-tl-none`
                                }`}>
                                {m.text}
                            </div>
                        </div>
                    ))}

                    {isThinking && (
                        <div className="flex justify-start">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mr-2 shrink-0">
                                <Bot size={14} className="text-indigo-500" />
                            </div>
                            <div className={`p-4 rounded-2xl rounded-tl-none ${isDarkMode ? 'bg-gray-800' : 'bg-white'} flex gap-1.5 items-center`}>
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className={`p-4 border-t ${theme.border} ${theme.card}`}>
                    <div className={`flex items-center gap-2 p-1.5 pr-2 rounded-2xl border ${theme.border} ${isDarkMode ? 'bg-gray-900/50' : 'bg-white'} focus-within:ring-2 ring-indigo-500/50 transition-all`}>
                        <input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            className={`flex-1 bg-transparent px-3 py-2.5 outline-none text-sm ${theme.text}`}
                            autoFocus
                        />
                        <button
                            onClick={handleSend}
                            disabled={!chatInput.trim() || isThinking}
                            className={`p-2.5 rounded-xl transition-all ${chatInput.trim() && !isThinking
                                ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-90'
                                : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
