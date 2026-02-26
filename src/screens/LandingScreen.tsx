import React, { useEffect } from 'react';
import { TrendingUp, BarChart3, ShieldCheck, Brain, ArrowRight } from 'lucide-react';

interface LandingScreenProps {
    onSignIn: () => void;
    onOpenInfo: (page: 'about' | 'privacy' | 'terms' | 'contact') => void;
    theme: any;
    isDarkMode: boolean;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onSignIn, onOpenInfo, theme, isDarkMode }) => {
    // Add page-specific SEO tags when the landing page mounts
    useEffect(() => {
        document.title = "Trade Journal - Master Your Trading Strategy";

        // Optional: Add more specific meta tags dynamically if needed
        // The generic ones in index.html already cover most cases well

        return () => {
            // Clean up if we navigate away (though resetting title is usually enough)
            document.title = "Trade Journal";
        };
    }, []);

    return (
        <div className={`w-full bg-[#111827] text-white flex flex-col font-sans overflow-visible min-h-screen`}>
            {/* Navbar Minimal */}
            <nav className={`w-full p-6 flex justify-between items-center z-50 relative`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                        <TrendingUp size={24} className="text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tight">Trade Journal</span>
                </div>
                <button
                    onClick={onSignIn}
                    className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-full transition-all border border-gray-700 hover:border-gray-500 shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                >
                    Sign In
                </button>
            </nav>

            {/* Hero Section */}
            <header className="flex flex-col items-center justify-center px-4 relative max-w-6xl mx-auto w-full min-h-screen py-20 mt-10">

                {/* Decorative background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

                <div className="grid lg:grid-cols-2 gap-12 items-center w-full py-12 lg:py-0">

                    {/* Text Content */}
                    <div className="flex flex-col items-start space-y-8 z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-500 font-semibold text-sm">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            The Ultimate Trading Companion
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                            Trade Smarter.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                                Track Better.
                            </span>
                        </h1>

                        <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
                            Elevate your trading journey with advanced analytics, AI-powered insights, and comprehensive performance tracking. Built for serious traders.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-16 mt-8">
                            <button
                                onClick={onSignIn}
                                className="group px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 text-lg active:scale-95"
                            >
                                Start Journaling Now
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="flex items-center gap-6 pt-4 text-sm text-gray-500 font-medium">
                            <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-green-500" /> Secure Data</div>
                            <div className="flex items-center gap-2"><BarChart3 size={18} className="text-blue-500" /> Advanced Stats</div>
                            <div className="flex items-center gap-2"><Brain size={18} className="text-purple-500" /> AI Coach</div>
                        </div>
                    </div>

                    {/* Hero Image / Visual */}
                    <div className="relative z-10 w-full rounded-3xl p-2 bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-800 shadow-2xl skew-y-0 lg:-skew-y-3 transform transition-transform hover:-skew-y-1">
                        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent rounded-3xl"></div>
                        <img
                            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200"
                            alt="Trading dashboard and charts showing market analysis"
                            className="rounded-2xl w-full h-[400px] lg:h-[500px] object-cover opacity-90 sepia-[.2] hue-rotate-[-10deg]"
                        />
                        {/* Floating UI Elements for depth */}
                        <div className="absolute -left-6 top-1/4 bg-gray-800 border border-gray-700 p-4 rounded-xl shadow-xl backdrop-blur-sm animate-bounce" style={{ animationDuration: '3s' }}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center"><TrendingUp size={20} className="text-green-500" /></div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Win Rate</p>
                                    <p className="text-lg font-black text-white">68.4%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </header>

            {/* SEO Articles Section */}
            <main className="w-full py-20 bg-gray-900 border-t border-gray-800">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-black mb-4">Master Every Aspect of Trading</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Explore our five core features designed to give traders the ultimate edge in volatile markets. From real-time analytics to AI-driven coaching, our platform provides a complete trading arsenal.</p>
                    </div>

                    <div className="space-y-24">
                        {/* Article 1: Dashboard */}
                        <article className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="order-2 lg:order-1 space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 font-bold text-sm border border-blue-500/20">
                                    <BarChart3 size={16} /> Dashboard
                                </div>
                                <h3 className="text-3xl font-black">Your Central Trading Hub for Real-Time P&L</h3>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    Our comprehensive trading dashboard acts as your financial command center. View your total net profit and loss instantly, accompanied by an interactive equity curve that visualizes your growth trajectory. With a modern, dark-mode-first design, you can easily monitor your gross margins, consistency rates, and overall portfolio health at a single glance. Professional traders know that situational awareness is key, and our dashboard ensures you never miss a beat in the markets.
                                </p>
                            </div>
                            <div className="order-1 lg:order-2 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl relative group">
                                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" alt="Trading Dashboard Interface" className="w-full h-[300px] object-cover" />
                            </div>
                        </article>

                        {/* Article 2: Trades */}
                        <article className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl relative group">
                                <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800" alt="List of Recent Crypto and Forex Trades" className="w-full h-[300px] object-cover" />
                            </div>
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 font-bold text-sm border border-green-500/20">
                                    <TrendingUp size={16} /> Trade Log
                                </div>
                                <h3 className="text-3xl font-black">Detailed Trade Logging & History Tracking</h3>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    Maintain a meticulous record of every execution with our detailed Trade List page. From Bitcoin to Forex, log your exact entry and exit prices, symbols, and trade direction effortlessly. A disciplined trader is a profitable trader, and keeping a precise history allows you to review your past decisions. Filter through your favorite setups and learn from both your winning streaks and your losses with our intuitive, minimalist log interface.
                                </p>
                            </div>
                        </article>

                        {/* Article 3: AI Coach */}
                        <article className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="order-2 lg:order-1 space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 font-bold text-sm border border-purple-500/20">
                                    <Brain size={16} /> AI Coach
                                </div>
                                <h3 className="text-3xl font-black">Personalized AI Trading Mentorship & Analysis</h3>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    Unlock the power of artificial intelligence to elevate your trading psychology and strategy. Our built-in AI Coach acts as your personal 24/7 trading mentor. By analyzing your recent trade history, the AI provides context-aware feedback, suggests improvements, and keeps your mental state in check during volatile market swings. Whether you are dealing with FOMO or need a strategy pivot, get professional, customized advice instantly.
                                </p>
                            </div>
                            <div className="order-1 lg:order-2 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl relative group">
                                <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800" alt="Artificial Intelligence Trading Coach Concept" className="w-full h-[300px] object-cover" />
                            </div>
                        </article>

                        {/* Article 4: Stats */}
                        <article className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl relative group">
                                <div className="absolute inset-0 bg-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" alt="Advanced Trading Performance Statistics and Charts" className="w-full h-[300px] object-cover" />
                            </div>
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 font-bold text-sm border border-yellow-500/20">
                                    <BarChart3 size={16} /> Analytics
                                </div>
                                <h3 className="text-3xl font-black">Advanced Performance Metrics & Risk Ratios</h3>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    Dive deep into the numbers that matter. The Stats page offers an institutional-grade breakdown of your performance, including Sharpe Ratio, Maximum Drawdown, Risk-Reward averages, and Trade Expectancy. Visualize your consistency with monthly heatmaps and strategy comparisons. Professional risk management is what separates gamblers from long-term profitable traders, and our advanced analytics provide the exact numbers you need to optimize your edge.
                                </p>
                            </div>
                        </article>

                        {/* Article 5: Profile */}
                        <article className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="order-2 lg:order-1 space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-500/10 text-gray-400 font-bold text-sm border border-gray-500/20">
                                    <ShieldCheck size={16} /> Settings
                                </div>
                                <h3 className="text-3xl font-black">Secure Profile Management & App Preferences</h3>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    Maintain total control over your trading environment. The Profile page allows you to securely manage your account details, customize your starting balance, and toggle between aesthetic themes like Dark Mode. Built with Firebase integration, your data represents your life's trading work—which is why privacy and seamless synchronization across devices are our top priorities. Setup the app your way and focus on the charts.
                                </p>
                            </div>
                            <div className="order-1 lg:order-2 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl relative group">
                                <div className="absolute inset-0 bg-gray-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800" alt="Secure Trading Account Settings and Profile" className="w-full h-[300px] object-cover" />
                            </div>
                        </article>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-12 text-sm border-t border-gray-800/50 bg-gray-900/50">
                <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={18} className="text-green-500" />
                        <span className="font-bold text-gray-300">Trade Journal</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500 font-medium">
                        <button onClick={() => onOpenInfo('about')} className="hover:text-white transition-colors">About Us</button>
                        <button onClick={() => onOpenInfo('contact')} className="hover:text-white transition-colors">Contact Support</button>
                        <button onClick={() => onOpenInfo('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
                        <button onClick={() => onOpenInfo('terms')} className="hover:text-white transition-colors">Terms & Conditions</button>
                    </div>

                    <div className="text-gray-600">
                        &copy; {new Date().getFullYear()} Trade Journal App. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};
