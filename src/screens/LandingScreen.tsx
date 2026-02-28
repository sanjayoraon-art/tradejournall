import React, { useEffect } from 'react';
import { TrendingUp, BarChart3, ShieldCheck, Brain, ArrowRight } from 'lucide-react';
import { LanguageSelector } from '../components/LanguageSelector';

interface LandingScreenProps {
    onSignIn: () => void;
    onOpenInfo: (page: 'about' | 'privacy' | 'terms' | 'contact') => void;
    theme: any;
    isDarkMode: boolean;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onSignIn, onOpenInfo, theme, isDarkMode }) => {
    // Add page-specific SEO tags when the landing page mounts
    useEffect(() => {
        document.title = "Best AI Trade Tracker & Trading Journal - Master Your Trading Strategy";

        // Optional: Add more specific meta tags dynamically if needed
        // The generic ones in index.html already cover most cases well

        return () => {
            // Clean up if we navigate away (though resetting title is usually enough)
            document.title = "Trade Journal";
        };
    }, []);

    return (
        <div className={`w-full bg-[#111827] text-white flex flex-col font-sans overflow-x-hidden min-h-screen`}>
            {/* Navbar Minimal */}
            <nav className={`w-full px-4 pt-2 pb-4 sm:p-6 flex justify-between items-center z-50 relative`}>
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="Trade Journal Logo" className="w-10 h-10 object-contain rounded-xl bg-white/10" />
                    <span className="text-xl font-black tracking-tight">Trade Journal</span>
                </div>
                <div className="flex items-center gap-4">
                    <LanguageSelector isDarkMode={isDarkMode} />
                    <button
                        onClick={onSignIn}
                        className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-full transition-all border border-gray-700 hover:border-gray-500 shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                    >
                        Sign In
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="flex flex-col items-center justify-start px-4 relative max-w-6xl mx-auto w-full pt-2 lg:pt-10 pb-20">

                {/* Decorative background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

                <div className="grid lg:grid-cols-2 gap-12 items-center w-full pt-4 pb-12 lg:py-0">

                    {/* Text Content */}
                    <div className="flex flex-col items-start space-y-4 z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-500 font-semibold text-sm">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            The Ultimate AI Trading Journal
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                            Trade Smarter.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                                Track Better.
                            </span>
                        </h1>

                        <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
                            Elevate your day trading and portfolio management with the best AI trade tracker. Built for serious crypto, forex, and stock traders to dominate the markets.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
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

            {/* Comprehensive Page Details Section */}
            <main className="w-full py-20 bg-gray-900 border-t border-gray-800">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-black mb-4">Inside the Best Trade Tracker</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Discover every single screen and feature available inside our premier AI trading journal software. From P&L logging to AI analysis, here is exactly what you get.</p>
                    </div>

                    <div className="space-y-16">
                        {/* 1. Dashboard */}
                        <div className="bg-gray-800/50 border border-gray-700 p-8 rounded-3xl flex flex-col gap-8">
                            <div className="lg:flex gap-12 items-center">
                                <div className="lg:w-1/3 mb-6 lg:mb-0">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 font-bold mb-4 border border-blue-500/20">
                                        <BarChart3 size={18} /> 01. Dashboard
                                    </div>
                                    <h3 className="text-3xl font-black mb-4">Real-Time Command Center</h3>
                                </div>
                                <div className="lg:w-2/3">
                                    <ul className="grid sm:grid-cols-2 gap-4 text-gray-300">
                                        <li className="flex items-start gap-2"><span className="text-blue-500">✔</span> <strong>Total Net P&L:</strong> Live calculation of your total portfolio profit and loss.</li>
                                        <li className="flex items-start gap-2"><span className="text-blue-500">✔</span> <strong>Equity Curve Chart:</strong> Visual candlestick representation of your account balance growth over time.</li>
                                        <li className="flex items-start gap-2"><span className="text-blue-500">✔</span> <strong>Quick KPIs:</strong> Glance at Gross Profit, Gross Loss, Net Profit, and overall Win Rate instantly.</li>
                                        <li className="flex items-start gap-2"><span className="text-blue-500">✔</span> <strong>Quick Actions:</strong> Single-click 'Add New Trade' button for rapid data entry during live markets.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="w-full rounded-2xl overflow-hidden border border-gray-700 shadow-2xl relative group">
                                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" alt="Trading Dashboard Interface Screenshot" className="w-full h-[250px] sm:h-[400px] object-cover" />
                            </div>
                        </div>

                        {/* 2. Trades */}
                        <div className="bg-gray-800/50 border border-gray-700 p-8 rounded-3xl flex flex-col gap-8">
                            <div className="lg:flex gap-12 items-center">
                                <div className="lg:w-1/3 mb-6 lg:mb-0">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 font-bold mb-4 border border-green-500/20">
                                        <TrendingUp size={18} /> 02. Trade Log
                                    </div>
                                    <h3 className="text-3xl font-black mb-4">Complete P&L Tracker</h3>
                                </div>
                                <div className="lg:w-2/3">
                                    <ul className="grid sm:grid-cols-2 gap-4 text-gray-300">
                                        <li className="flex items-start gap-2"><span className="text-green-500">✔</span> <strong>Comprehensive Inputs:</strong> Log Symbol, Direction (Long/Short), Entry, Exit, Stop Loss, Quantity, and Fees.</li>
                                        <li className="flex items-start gap-2"><span className="text-green-500">✔</span> <strong>Image Attachments:</strong> Upload screenshots of your charts for visual review of specific setups.</li>
                                        <li className="flex items-start gap-2"><span className="text-green-500">✔</span> <strong>Trade Notes/Tags:</strong> Add psychological notes and strategy tags (e.g., Breakout, Mean Reversion) to categorize executions.</li>
                                        <li className="flex items-start gap-2"><span className="text-green-500">✔</span> <strong>Historical List:</strong> Chronological list of all closed operations with individual profit/loss highlighting.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="w-full rounded-2xl overflow-hidden border border-gray-700 shadow-2xl relative group">
                                <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200" alt="Trade Log and History Screenshot" className="w-full h-[250px] sm:h-[400px] object-cover" />
                            </div>
                        </div>

                        {/* 3. AI Coach */}
                        <div className="bg-gray-800/50 border border-gray-700 p-8 rounded-3xl flex flex-col gap-8">
                            <div className="lg:flex gap-12 items-center">
                                <div className="lg:w-1/3 mb-6 lg:mb-0">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 font-bold mb-4 border border-purple-500/20">
                                        <Brain size={18} /> 03. AI Coach
                                    </div>
                                    <h3 className="text-3xl font-black mb-4">24/7 Trading Psychiatrist</h3>
                                </div>
                                <div className="lg:w-2/3">
                                    <ul className="grid sm:grid-cols-2 gap-4 text-gray-300">
                                        <li className="flex items-start gap-2"><span className="text-purple-500">✔</span> <strong>Context-Aware Advice:</strong> The AI reads your actual recent trades to give targeted, highly personalized feedback.</li>
                                        <li className="flex items-start gap-2"><span className="text-purple-500">✔</span> <strong>Psychology Support:</strong> Helps manage Tilt, FOMO, and Revenge Trading through interactive dialogue.</li>
                                        <li className="flex items-start gap-2"><span className="text-purple-500">✔</span> <strong>Strategy Adjustments:</strong> Ask the AI to identify patterns in your losses or suggest risk parameter changes.</li>
                                        <li className="flex items-start gap-2"><span className="text-purple-500">✔</span> <strong>History Clearing:</strong> Reset the AI conversation context anytime for a fresh perspective.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="w-full rounded-2xl overflow-hidden border border-gray-700 shadow-2xl relative group">
                                <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200" alt="AI Coach Interface Screenshot" className="w-full h-[250px] sm:h-[400px] object-cover" />
                            </div>
                        </div>

                        {/* 4. Stats */}
                        <div className="bg-gray-800/50 border border-gray-700 p-8 rounded-3xl flex flex-col gap-8">
                            <div className="lg:flex gap-12 items-center">
                                <div className="lg:w-1/3 mb-6 lg:mb-0">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-400 font-bold mb-4 border border-yellow-500/20">
                                        <BarChart3 size={18} /> 04. Analytics
                                    </div>
                                    <h3 className="text-3xl font-black mb-4">Institutional Grade Metrics</h3>
                                </div>
                                <div className="lg:w-2/3">
                                    <ul className="grid sm:grid-cols-2 gap-4 text-gray-300">
                                        <li className="flex items-start gap-2"><span className="text-yellow-500">✔</span> <strong>Profit Factor & Expectancy:</strong> Mathematical formulas predicting long-term profitability based on your historical data.</li>
                                        <li className="flex items-start gap-2"><span className="text-yellow-500">✔</span> <strong>Sharpe Ratio & Drawdown Calculator:</strong> Understand your risk-adjusted returns and largest peak-to-trough portfolio drop.</li>
                                        <li className="flex items-start gap-2"><span className="text-yellow-500">✔</span> <strong>Averages:</strong> Calculate Average Win, Average Loss, and Average Risk-Reward ratio automatically.</li>
                                        <li className="flex items-start gap-2"><span className="text-yellow-500">✔</span> <strong>Calendar Heatmap:</strong> A visual grid showing your profitable vs unprofitable days throughout the year.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="w-full rounded-2xl overflow-hidden border border-gray-700 shadow-2xl relative group">
                                <div className="absolute inset-0 bg-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200" alt="Trading Analytics and Stats Screenshot" className="w-full h-[250px] sm:h-[400px] object-cover" />
                            </div>
                        </div>

                        {/* 5. Risk Calculator */}
                        <div className="bg-gray-800/50 border border-gray-700 p-8 rounded-3xl flex flex-col gap-8">
                            <div className="lg:flex gap-12 items-center">
                                <div className="lg:w-1/3 mb-6 lg:mb-0">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 text-pink-400 font-bold mb-4 border border-pink-500/20">
                                        <TrendingUp size={18} /> 05. Calculator
                                    </div>
                                    <h3 className="text-3xl font-black mb-4">Risk Reward Calculator</h3>
                                </div>
                                <div className="lg:w-2/3">
                                    <ul className="grid sm:grid-cols-2 gap-4 text-gray-300">
                                        <li className="flex items-start gap-2"><span className="text-pink-500">✔</span> <strong>Position Sizing:</strong> Type in your account limit and risk % to get the exact share/lot size you should trade.</li>
                                        <li className="flex items-start gap-2"><span className="text-pink-500">✔</span> <strong>Target Projections:</strong> Calculates exact Take Profit prices based on desired risk-reward ratios (e.g., 1:2, 1:3).</li>
                                        <li className="flex items-start gap-2"><span className="text-pink-500">✔</span> <strong>Stop Loss Validation:</strong> Visually confirm your stop distance before entering a live trade.</li>
                                        <li className="flex items-start gap-2"><span className="text-pink-500">✔</span> <strong>Pre-Trade Discipline:</strong> Forces you to do the math and respect your risk limits before executing the broker order.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="w-full rounded-2xl overflow-hidden border border-gray-700 shadow-2xl relative group">
                                <div className="absolute inset-0 bg-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img src="https://images.unsplash.com/photo-1616422285623-1d22dc05c486?auto=format&fit=crop&q=80&w=1200" alt="Risk Reward Calculator Interface Screenshot" className="w-full h-[250px] sm:h-[400px] object-cover" />
                            </div>
                        </div>

                        {/* 6. Profile */}
                        <div className="bg-gray-800/50 border border-gray-700 p-8 rounded-3xl flex flex-col gap-8">
                            <div className="lg:flex gap-12 items-center">
                                <div className="lg:w-1/3 mb-6 lg:mb-0">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-500/10 text-gray-400 font-bold mb-4 border border-gray-500/20">
                                        <ShieldCheck size={18} /> 06. Profile & Settings
                                    </div>
                                    <h3 className="text-3xl font-black mb-4">Account Customization</h3>
                                </div>
                                <div className="lg:w-2/3">
                                    <ul className="grid sm:grid-cols-2 gap-4 text-gray-300">
                                        <li className="flex items-start gap-2"><span className="text-gray-400">✔</span> <strong>Account Management:</strong> Secure Firebase-backed authentication, email updates, and password resets.</li>
                                        <li className="flex items-start gap-2"><span className="text-gray-400">✔</span> <strong>Starting Balance:</strong> Set your initial capital to properly track percentage growth.</li>
                                        <li className="flex items-start gap-2"><span className="text-gray-400">✔</span> <strong>Currency Options:</strong> Support for global traders (USD, EUR, GBP, INR, JPY, AUD).</li>
                                        <li className="flex items-start gap-2"><span className="text-gray-400">✔</span> <strong>Theme Selection:</strong> Toggle between system default, pure Dark Mode, or Light Mode interface.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="w-full rounded-2xl overflow-hidden border border-gray-700 shadow-2xl relative group">
                                <div className="absolute inset-0 bg-gray-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1200" alt="App Settings and Profile Interface Screenshot" className="w-full h-[250px] sm:h-[400px] object-cover" />
                            </div>
                        </div>
                    </div>

                    {/* Feature Comparison Table */}
                    <div className="mt-24">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl lg:text-4xl font-black mb-4">Comprehensive Features Table</h2>
                            <p className="text-gray-400">Everything you need to know about what's included in Trade Journal.</p>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-gray-700 shadow-xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-800 text-gray-200">
                                        <th className="p-5 font-bold border-b border-gray-700">Feature Category</th>
                                        <th className="p-5 font-bold border-b border-gray-700">Specific Function</th>
                                        <th className="p-5 font-bold border-b border-gray-700 text-center">Availability</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-900/50 text-gray-400 divide-y divide-gray-800">
                                    <tr className="hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 bg-gray-900/80 font-semibold align-top" rowSpan={4}>Trade Logging</td>
                                        <td className="p-4 text-gray-300">Unlimited Trade Entries</td>
                                        <td className="p-4 text-center text-green-500 font-black">✔</td>
                                    </tr>
                                    <tr className="hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 text-gray-300">Screenshot / Image Attachments</td>
                                        <td className="p-4 text-center text-green-500 font-black">✔</td>
                                    </tr>
                                    <tr className="hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 text-gray-300">Strategy Tags & Trade Notes</td>
                                        <td className="p-4 text-center text-green-500 font-black">✔</td>
                                    </tr>
                                    <tr className="hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 text-gray-300">Commission & Exchange Fees Tracking</td>
                                        <td className="p-4 text-center text-green-500 font-black">✔</td>
                                    </tr>

                                    <tr className="hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 bg-gray-900/80 font-semibold align-top border-t border-gray-700" rowSpan={4}>Advanced Analytics</td>
                                        <td className="p-4 text-gray-300 border-t border-gray-700">Auto-Calculated Win Rate & P&L</td>
                                        <td className="p-4 text-center text-green-500 font-black border-t border-gray-700">✔</td>
                                    </tr>
                                    <tr className="hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 text-gray-300">Max Drawdown & Sharpe Ratio</td>
                                        <td className="p-4 text-center text-green-500 font-black">✔</td>
                                    </tr>
                                    <tr className="hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 text-gray-300">Profit Factor & Trade Expectancy</td>
                                        <td className="p-4 text-center text-green-500 font-black">✔</td>
                                    </tr>
                                    <tr className="hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 text-gray-300">Interactive Equity Curve Candlestick Chart</td>
                                        <td className="p-4 text-center text-green-500 font-black">✔</td>
                                    </tr>

                                    <tr className="hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 bg-gray-900/80 font-semibold align-top border-t border-gray-700" rowSpan={3}>Artificial Intelligence</td>
                                        <td className="p-4 text-gray-300 border-t border-gray-700">Live Context-Aware Chat Bot</td>
                                        <td className="p-4 text-center text-green-500 font-black border-t border-gray-700">✔</td>
                                    </tr>
                                    <tr className="hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 text-gray-300">Trade Data Ingestion For AI Analysis</td>
                                        <td className="p-4 text-center text-green-500 font-black">✔</td>
                                    </tr>
                                    <tr className="hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 text-gray-300">Market Psychology & Mentorship</td>
                                        <td className="p-4 text-center text-green-500 font-black">✔</td>
                                    </tr>

                                    <tr className="hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 bg-gray-900/80 font-semibold align-top border-t border-gray-700" rowSpan={3}>Platform & Security</td>
                                        <td className="p-4 text-gray-300 border-t border-gray-700">Cloud Sync (Firebase Integration)</td>
                                        <td className="p-4 text-center text-green-500 font-black border-t border-gray-700">✔</td>
                                    </tr>
                                    <tr className="hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 text-gray-300">Global Currencies Supported (USD, INR, GBP, EUR, etc)</td>
                                        <td className="p-4 text-center text-green-500 font-black">✔</td>
                                    </tr>
                                    <tr className="hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 text-gray-300">Fully Responsive Desktop & Mobile PWA Ready</td>
                                        <td className="p-4 text-center text-green-500 font-black">✔</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-12 text-sm border-t border-gray-800/50 bg-gray-900/50">
                <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Trade Journal Logo" className="w-6 h-6 object-contain rounded-md bg-white/10" />
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
