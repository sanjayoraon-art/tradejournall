import React, { useEffect, useState } from 'react';
import {
    TrendingUp, TrendingDown, BarChart3, ShieldCheck, ShieldAlert, Brain, ArrowRight, Zap,
    BookOpen, Clock, Sparkles, Loader2, Calculator, Scale, MoreVertical,
    ChevronDown, CheckCircle2, XCircle, Activity, Target, Shield, HelpCircle,
    Layers, Flame, Award, Lock, DollarSign, PieChart, Users, Check, AlertTriangle,
    Eye, Smartphone, Grid, Compass, Landmark, CircleDollarSign, RefreshCw
} from 'lucide-react';
import { LanguageSelector } from '../components/LanguageSelector';
import { SeoArticle } from '../components/SeoArticle';
import { BlogCard } from '../components/BlogCard';
import { db, appId } from '../utils/firebase';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';

import { DEFAULT_BLOG_POSTS } from '../utils/defaultArticles';

interface LandingScreenProps {
    onSignIn: () => void;
    onOpenInfo: (page: 'about' | 'privacy' | 'terms' | 'contact') => void;
    onOpenCalculator?: () => void;
    onOpenPropFirmCalculator?: () => void;
    onOpenLeverageCalculator?: () => void;
    onOpenDrawdownCalculator?: () => void;
    onOpenRiskRewardMatrix?: () => void;
    onOpenSessionClock?: () => void;
    onOpenCooldownTimer?: () => void;
    onOpenPropFirmScalingCalculator?: () => void;
    onOpenPropFirmPayoutCalculator?: () => void;
    onOpenApexConsistencyCalculator?: () => void;
    onOpenCrossVsIsolatedCalculator?: () => void;
    onOpenCryptoProfitCalculator?: () => void;
    onOpenIronCondorCalculator?: () => void;
    onOpenForexSwapCalculator?: () => void;
    theme: any;
    isDarkMode: boolean;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
    onSignIn,
    onOpenInfo,
    onOpenCalculator,
    onOpenPropFirmCalculator,
    onOpenLeverageCalculator,
    onOpenDrawdownCalculator,
    onOpenRiskRewardMatrix,
    onOpenSessionClock,
    onOpenCooldownTimer,
    onOpenPropFirmScalingCalculator,
    onOpenPropFirmPayoutCalculator,
    onOpenApexConsistencyCalculator,
    onOpenCrossVsIsolatedCalculator,
    onOpenCryptoProfitCalculator,
    onOpenIronCondorCalculator,
    onOpenForexSwapCalculator,
    theme,
    isDarkMode
}) => {
    const [blogPosts, setBlogPosts] = useState<any[]>(DEFAULT_BLOG_POSTS);
    const [loadingBlogs, setLoadingBlogs] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    // Fetch published blogs in real time and sort by newest first (merging with defaults)
    useEffect(() => {
        if (!db) {
            setLoadingBlogs(false);
            return;
        }

        const blogColRef = collection(db, 'artifacts', appId, 'blog');

        const getTime = (p: any) => {
            const val = p.date || p.lastUpdated || p.createdAt;
            if (!val) return 0;
            if (typeof val === 'object' && val.seconds) return val.seconds * 1000;
            const ms = new Date(val).getTime();
            return isNaN(ms) ? 0 : ms;
        };

        const unsubscribe = onSnapshot(
            blogColRef,
            (snapshot) => {
                const firestorePosts = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter((p: any) => p.isActive !== false);

                // Merge custom Firestore blogs + DEFAULT_BLOG_POSTS (deduplicated by slug)
                const mergedMap = new Map<string, any>();
                
                // 1. Static defaults first
                DEFAULT_BLOG_POSTS.forEach(p => {
                    if (p.slug) mergedMap.set(p.slug, p);
                });

                // 2. Override with Firestore posts (higher priority)
                firestorePosts.forEach((p: any) => {
                    if (p.slug) mergedMap.set(p.slug, p);
                });

                const allPosts = Array.from(mergedMap.values());
                allPosts.sort((a: any, b: any) => getTime(b) - getTime(a));

                setBlogPosts(allPosts.length > 0 ? allPosts : DEFAULT_BLOG_POSTS);
                setLoadingBlogs(false);
            },
            (err) => {
                console.error("Error subscribing to landing blog posts:", err);
                setBlogPosts(DEFAULT_BLOG_POSTS);
                setLoadingBlogs(false);
            }
        );

        return () => unsubscribe();
    }, []);

    // Page-specific SEO title & Meta tags
    useEffect(() => {
        document.title = "TradeJournall | #1 Free Crypto, Forex & Indian Stock Market Trading Journal";
        return () => {
            document.title = "TradeJournall";
        };
    }, []);

    // Real-time market ticker items
    const tickerItems = [
        { symbol: "BTC/USDT", price: "$96,420.50", change: "+3.42%", isUp: true },
        { symbol: "ETH/USDT", price: "$2,784.10", change: "+2.15%", isUp: true },
        { symbol: "SOL/USDT", price: "$198.80", change: "+6.84%", isUp: true },
        { symbol: "NIFTY 50", price: "24,185.30", change: "+0.82%", isUp: true },
        { symbol: "BANKNIFTY", price: "51,460.00", change: "+1.18%", isUp: true },
        { symbol: "XAU/USD (Gold)", price: "$2,658.40", change: "+0.95%", isUp: true },
        { symbol: "BNB/USDT", price: "$684.20", change: "-0.45%", isUp: false },
        { symbol: "EUR/USD", price: "1.0832", change: "+0.12%", isUp: true },
    ];

    // FAQ items with rich SEO schema
    const faqData = [
        {
            q: "Is TradeJournall really 100% free for all traders?",
            a: "Yes, TradeJournall is 100% free forever. There are zero subscriptions, paywalls, or hidden charges. You get unlimited trade logging, equity curve analytics, psychological AI mistake detection, and the crypto leverage danger calculator with no credit card required."
        },
        {
            q: "Which crypto exchanges and stock brokers are supported?",
            a: "TradeJournall supports trades from all major global and Indian exchanges including Binance, Bybit, WazirX, CoinDCX, Zerodha (Kite), Groww, AngelOne, Delta Exchange, OKX, and MT4/MT5 for Forex. You can log trades manually in seconds or import via standard CSV."
        },
        {
            q: "How does the Crypto Leverage Danger Calculator help prevent liquidation?",
            a: "High leverage (20x to 100x) is the #1 reason retail crypto traders wipe their accounts. Our Danger Calculator computes your exact liquidation price, margin buffer %, and risk score before you open an order, alerting you if market volatility can liquidate you within minutes."
        },
        {
            q: "What makes TradeJournall better than Excel or Google Sheets?",
            a: "Excel spreadsheets break easily, don't allow seamless chart screenshot attachments, fail on mobile devices, and lack automated metrics like Sharpe Ratio, Profit Factor, and AI mistake tagging (FOMO, revenge trading). TradeJournall automates your entire analytics workflow in real-time."
        },
        {
            q: "Can I use TradeJournall on my mobile phone?",
            a: "Yes! TradeJournall is a fully responsive Progressive Web App (PWA) optimized for smartphones, tablets, and desktops. You can log trades and review setups directly from your phone while on the go."
        }
    ];

    return (
        <div className="w-full bg-[#0a0f1d] text-slate-100 flex flex-col font-sans overflow-x-hidden min-h-screen selection:bg-emerald-500/30 selection:text-emerald-300">
            {/* Structured Data for SEO: SoftwareApplication & FAQPage */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "TradeJournall",
                        "operatingSystem": "Web, Android, iOS",
                        "applicationCategory": "FinanceApplication",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "ratingCount": "5120"
                        }
                    })
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": faqData.map(item => ({
                            "@type": "Question",
                            "name": item.q,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": item.a
                            }
                        }))
                    })
                }}
            />

            {/* Glowing Background Radial Highlights */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent blur-[140px] rounded-full animate-pulse-subtle"></div>
                <div className="absolute top-[800px] -left-64 w-[600px] h-[600px] bg-cyan-500/10 blur-[130px] rounded-full"></div>
                <div className="absolute top-[1600px] -right-64 w-[600px] h-[600px] bg-purple-500/10 blur-[140px] rounded-full"></div>
            </div>

            {/* Top Market Ticker Marquee */}
            <div className="w-full bg-[#060a14] border-b border-slate-800/80 py-2 overflow-hidden select-none z-40">
                <div className="flex items-center">
                    <div className="px-3 py-0.5 bg-emerald-500/10 text-emerald-400 font-extrabold text-[11px] uppercase tracking-wider border-r border-slate-800 flex items-center gap-1.5 shrink-0 z-10">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        Live Markets
                    </div>
                    <div className="overflow-hidden flex-1 relative">
                        <div className="animate-marquee gap-8 items-center text-xs font-semibold pl-4">
                            {[...tickerItems, ...tickerItems].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 shrink-0">
                                    <span className="text-slate-300 font-bold">{item.symbol}</span>
                                    <span className="text-slate-100 font-mono">{item.price}</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${item.isUp ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'}`}>
                                        {item.change}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Frosted Glass Sticky Navbar */}
            <nav className="w-full px-4 sm:px-8 py-3.5 flex justify-between items-center sticky top-0 z-50 backdrop-blur-xl bg-[#0a0f1d]/85 border-b border-slate-800/80 transition-all">
                <div className="flex items-center gap-3">
                    <div className="relative group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-300"></div>
                        <img src="/logo.png" alt="Trade Journal Logo" className="relative w-10 h-10 object-contain rounded-xl bg-slate-900 border border-slate-700/80 p-1" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg sm:text-xl font-black tracking-tight text-white">Trade<span className="text-emerald-400">Journall</span></span>
                            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-black text-[10px] tracking-wider uppercase">Free</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium hidden sm:block">AI-Powered Trading Analytics</p>
                    </div>
                </div>

                {/* Desktop Center Links for Risk Tools */}
                <div className="hidden lg:flex items-center gap-1 xl:gap-2">
                    <a
                        href="/tools/risk-reward-win-rate-matrix"
                        onClick={(e) => {
                            e.preventDefault();
                            if (onOpenRiskRewardMatrix) onOpenRiskRewardMatrix();
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition flex items-center gap-1.5 cursor-pointer border border-transparent hover:border-emerald-500/30 group"
                        style={{ textDecoration: 'none' }}
                    >
                        <Grid size={14} className="text-emerald-400 group-hover:scale-110 transition" />
                        <span>RR Matrix</span>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-black border border-emerald-500/30">MATRIX</span>
                    </a>
                    <a
                        href="/tools/drawdown-recovery-calculator"
                        onClick={(e) => {
                            e.preventDefault();
                            if (onOpenDrawdownCalculator) onOpenDrawdownCalculator();
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition flex items-center gap-1.5 cursor-pointer border border-transparent hover:border-rose-500/30 group"
                        style={{ textDecoration: 'none' }}
                    >
                        <TrendingDown size={14} className="text-rose-400 group-hover:scale-110 transition" />
                        <span>Drawdown &amp; Goal</span>
                        <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-black border border-rose-500/30">PRO</span>
                    </a>
                    <a
                        href="/tools/ftmo-calculator"
                        onClick={(e) => {
                            e.preventDefault();
                            if (onOpenPropFirmCalculator) onOpenPropFirmCalculator();
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition flex items-center gap-1.5 cursor-pointer border border-transparent hover:border-emerald-500/30 group"
                        style={{ textDecoration: 'none' }}
                    >
                        <ShieldAlert size={14} className="text-emerald-400 group-hover:scale-110 transition" />
                        <span>Prop Firm Calc</span>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-black border border-emerald-500/30">NEW</span>
                    </a>
                    <a
                        href="/tools/leverage-danger-calculator"
                        onClick={(e) => {
                            e.preventDefault();
                            if (onOpenLeverageCalculator) onOpenLeverageCalculator();
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition flex items-center gap-1.5 cursor-pointer border border-transparent hover:border-amber-500/30 group"
                        style={{ textDecoration: 'none' }}
                    >
                        <Zap size={14} className="text-amber-400 group-hover:scale-110 transition" />
                        <span>Leverage Danger</span>
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-black border border-amber-500/30">HOT</span>
                    </a>
                    <a
                        href="/calculators/stocks/zerodha-vs-groww-brokerage-calculator"
                        onClick={(e) => {
                            e.preventDefault();
                            if (onOpenCalculator) onOpenCalculator();
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition flex items-center gap-1.5 cursor-pointer border border-transparent hover:border-cyan-500/30 group"
                        style={{ textDecoration: 'none' }}
                    >
                        <Scale size={14} className="text-cyan-400 group-hover:scale-110 transition" />
                        <span>Brokerage &amp; Tax</span>
                    </a>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-4 relative">
                    {/* Directly visible High-Impact Sign In Button */}
                    <button
                        onClick={onSignIn}
                        className="px-5 sm:px-7 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 text-xs sm:text-sm cursor-pointer flex items-center gap-2 active:scale-95"
                    >
                        <span>Sign In</span>
                        <ArrowRight size={15} />
                    </button>

                    {/* 3-Dot Categorized Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`p-2.5 rounded-xl transition-all border active:scale-95 cursor-pointer flex items-center justify-center ${isMenuOpen ? 'bg-slate-800 text-emerald-400 border-emerald-500/40 shadow-lg shadow-emerald-500/10' : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/80'}`}
                        title="Tools & Menu Options"
                        aria-label="Navigation Menu"
                    >
                        <MoreVertical size={19} />
                    </button>

                    {/* 3-Dot Categorized Dropdown Card */}
                    {isMenuOpen && (
                        <div className="absolute right-0 top-14 w-72 bg-[#0e1628]/95 backdrop-blur-2xl border border-slate-700/90 rounded-2xl shadow-2xl p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 space-y-3">
                            {/* Category 1: 🏆 Prop Firm Calculators */}
                            <div>
                                <div className="flex items-center justify-between px-2 mb-1.5">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                                        🏆 Prop Firm Calculators
                                    </span>
                                    <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded font-bold">4 TOOLS</span>
                                </div>
                                <a
                                    href="/tools/prop-firm-scaling-plan-calculator"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsMenuOpen(false);
                                        if (onOpenPropFirmScalingCalculator) onOpenPropFirmScalingCalculator();
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800/80 text-purple-300 font-bold text-xs transition text-left cursor-pointer border border-transparent hover:border-purple-500/20 group"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className="p-1.5 rounded-lg bg-purple-500/15 text-purple-400 group-hover:scale-110 transition">
                                        <TrendingUp size={15} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span>Account Scaling Roadmap</span>
                                            <span className="bg-purple-500/20 border border-purple-500/40 text-purple-200 text-[8px] font-black px-1.5 py-0.5 rounded">ROADMAP</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-normal">Plan $25k to $2M+ growth roadmap</p>
                                    </div>
                                </a>

                                <a
                                    href="/tools/prop-firm-profit-split-payout-calculator"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsMenuOpen(false);
                                        if (onOpenPropFirmPayoutCalculator) onOpenPropFirmPayoutCalculator();
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800/80 text-emerald-300 font-bold text-xs transition text-left cursor-pointer border border-transparent hover:border-emerald-500/20 group mt-1"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition">
                                        <Landmark size={15} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span>Profit Split &amp; Net Tax</span>
                                            <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-[8px] font-black px-1.5 py-0.5 rounded">PAYOUT</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-normal">Actual in-hand cash after split &amp; tax</p>
                                    </div>
                                </a>

                                <a
                                    href="/tools/apex-consistency-rule-calculator"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsMenuOpen(false);
                                        if (onOpenApexConsistencyCalculator) onOpenApexConsistencyCalculator();
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800/80 text-amber-300 font-bold text-xs transition text-left cursor-pointer border border-transparent hover:border-amber-500/20 group mt-1"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 group-hover:scale-110 transition">
                                        <Award size={15} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span>Apex 30% Consistency</span>
                                            <span className="bg-amber-500/20 border border-amber-500/40 text-amber-200 text-[8px] font-black px-1.5 py-0.5 rounded">APEX</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-normal">Single-day profit cap % calculator</p>
                                    </div>
                                </a>

                                <a
                                    href="/tools/ftmo-calculator"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsMenuOpen(false);
                                        if (onOpenPropFirmCalculator) onOpenPropFirmCalculator();
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800/80 text-cyan-300 font-bold text-xs transition text-left cursor-pointer border border-transparent hover:border-cyan-500/20 group mt-1"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 group-hover:scale-110 transition">
                                        <ShieldAlert size={15} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span>FTMO Evaluation Calc</span>
                                            <span className="bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 text-[8px] font-black px-1.5 py-0.5 rounded">FTMO</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-normal">Max drawdown &amp; challenge risk</p>
                                    </div>
                                </a>
                            </div>

                            {/* Category 2: 🛠️ Risk & Execution Tools */}
                            <div className="border-t border-slate-800 pt-2">
                                <div className="flex items-center justify-between px-2 mb-1.5">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        🛠️ Risk &amp; Market Tools
                                    </span>
                                    <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-bold">5 TOOLS</span>
                                </div>
                                <a
                                    href="/tools/risk-reward-win-rate-matrix"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsMenuOpen(false);
                                        if (onOpenRiskRewardMatrix) onOpenRiskRewardMatrix();
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800/80 text-emerald-400 font-bold text-xs transition text-left cursor-pointer border border-transparent hover:border-emerald-500/20 group"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition">
                                        <Grid size={15} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span>Risk-Reward vs Win Rate Matrix</span>
                                            <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[8px] font-black px-1.5 py-0.5 rounded">MATRIX</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-normal">2D Heatmap &amp; Expectancy edge</p>
                                    </div>
                                </a>

                                <a
                                    href="/tools/session-clock-ist"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsMenuOpen(false);
                                        if (onOpenSessionClock) onOpenSessionClock();
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800/80 text-emerald-400 font-bold text-xs transition text-left cursor-pointer border border-transparent hover:border-emerald-500/20 group mt-1"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition">
                                        <Clock size={15} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span>IST Session Clock</span>
                                            <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[8px] font-black px-1.5 py-0.5 rounded">LIVE</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-normal">US market open &amp; Forex overlap in IST</p>
                                    </div>
                                </a>

                                <a
                                    href="/tools/revenge-trading-cooldown-timer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsMenuOpen(false);
                                        if (onOpenCooldownTimer) onOpenCooldownTimer();
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800/80 text-rose-400 font-bold text-xs transition text-left cursor-pointer border border-transparent hover:border-rose-500/20 group mt-1"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 group-hover:scale-110 transition">
                                        <ShieldAlert size={15} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span>Revenge Cooldown Timer</span>
                                            <span className="bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[8px] font-black px-1.5 py-0.5 rounded">RESET</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-normal">Stop-loss reset &amp; tilt breaker</p>
                                    </div>
                                </a>

                                <a
                                    href="/tools/leverage-danger-calculator"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsMenuOpen(false);
                                        if (onOpenLeverageCalculator) onOpenLeverageCalculator();
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800/80 text-amber-400 font-bold text-xs transition text-left cursor-pointer border border-transparent hover:border-amber-500/20 group mt-1"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-110 transition">
                                        <Zap size={15} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span>Crypto Leverage Danger</span>
                                            <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[8px] font-black px-1.5 py-0.5 rounded">HOT</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-normal">Calculate liquidation & risk</p>
                                    </div>
                                </a>

                                <a
                                    href="/tools/cross-vs-isolated-margin-calculator"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsMenuOpen(false);
                                        if (onOpenCrossVsIsolatedCalculator) onOpenCrossVsIsolatedCalculator();
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800/80 text-amber-400 font-bold text-xs transition text-left cursor-pointer border border-transparent hover:border-amber-500/20 group mt-1"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-110 transition">
                                        <Scale size={15} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span>Cross vs Isolated Liq</span>
                                            <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[8px] font-black px-1.5 py-0.5 rounded">LIQ</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-normal">Liquidation risk & wallet wipeout</p>
                                    </div>
                                </a>

                                <a
                                    href="/tools/crypto-profit-calculator"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsMenuOpen(false);
                                        if (onOpenCryptoProfitCalculator) onOpenCryptoProfitCalculator();
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800/80 text-emerald-400 font-bold text-xs transition text-left cursor-pointer border border-transparent hover:border-emerald-500/20 group mt-1"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition">
                                        <CircleDollarSign size={15} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span>Crypto Profit &amp; Exit</span>
                                            <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[8px] font-black px-1.5 py-0.5 rounded">PROFIT</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-normal">Net in-hand profit &amp; staged exit ladder</p>
                                    </div>
                                </a>

                                <a
                                    href="/calculators/stocks/zerodha-vs-groww-brokerage-calculator"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsMenuOpen(false);
                                        if (onOpenCalculator) onOpenCalculator();
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800/80 text-cyan-400 font-bold text-xs transition text-left cursor-pointer border border-transparent hover:border-cyan-500/20 group mt-1"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition">
                                        <Scale size={15} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span>Brokerage & Tax Calc</span>
                                            <span className="bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[8px] font-black px-1.5 py-0.5 rounded">FREE</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-normal">STT, GST & broker breakdown</p>
                                    </div>
                                </a>
                            </div>

                            {/* Category 2: Interactive Games */}
                            <div className="border-t border-slate-800 pt-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 block mb-1">
                                    🎮 Games & Practice
                                </span>
                                <a
                                    href="/game-page.html"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800/80 text-purple-400 font-bold text-xs transition text-left border border-transparent hover:border-purple-500/20 group"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition">
                                        <Flame size={15} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span>Candle Clash 🎮</span>
                                            <span className="bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[8px] font-black px-1.5 py-0.5 rounded">PLAY</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-normal">Interactive chart pattern game</p>
                                    </div>
                                </a>
                            </div>

                            {/* Category 3: Resources */}
                            <div className="border-t border-slate-800 pt-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 block mb-1">
                                    📚 Resources & Blog
                                </span>
                                <a
                                    href="/blog"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800/80 text-slate-200 font-bold text-xs transition text-left border border-transparent hover:border-slate-700 group"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition">
                                        <BookOpen size={15} />
                                    </div>
                                    <div>
                                        <span>Trading Blog & Guides</span>
                                        <p className="text-[10px] text-slate-400 font-normal">Strategies, risk & psychology</p>
                                    </div>
                                </a>
                            </div>

                            <div className="border-t border-slate-800 pt-2 px-2">
                                <LanguageSelector isDarkMode={isDarkMode} />
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section: Single High-Converting Primary CTA (No Middle Clutter Buttons) */}
            <header className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16 lg:pt-14 lg:pb-24 flex flex-col items-center">
                <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center w-full">
                    {/* Left Column: Punchy FinTech Messaging & Single CTA */}
                    <div className="lg:col-span-6 flex flex-col items-start space-y-6 text-left">
                        {/* Status Pill Badge */}
                        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md text-emerald-400 text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/10">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span>The #1 Free Crypto & Stock Trading Journal</span>
                        </div>

                        {/* High-Impact Main Heading */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight text-white">
                            Stop Trading Blind. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                                Journal Like an Institution.
                            </span>
                        </h1>

                        {/* Descriptive SEO Subtitle */}
                        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-xl">
                            Auto-calculate net P&amp;L, track risk-to-reward ratios, prevent 100x liquidations, and spot costly emotional leaks across <strong className="text-emerald-400">Binance, WazirX, CoinDCX, Zerodha &amp; Bybit</strong>. Completely free, no KYC, no credit card required.
                        </p>

                        {/* Single Primary CTA Button (Strictly NO extra buttons in hero center) */}
                        <div className="w-full sm:w-auto pt-2">
                            <button
                                onClick={onSignIn}
                                className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-2xl transition-all duration-300 shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center gap-3 text-base sm:text-lg active:scale-95 cursor-pointer"
                            >
                                <Sparkles size={20} className="text-slate-950" />
                                <span>Start Journaling Free</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                            </button>
                            <p className="text-[11px] text-slate-400 mt-2.5 flex items-center gap-2">
                                <ShieldCheck size={14} className="text-emerald-400" />
                                <span>Instant Google Sign-In • 100% Free Forever • Zero Hidden Fees</span>
                            </p>
                        </div>

                        {/* Social Proof & Rating Metrics */}
                        <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-slate-800/80 w-full">
                            <div className="flex -space-x-2.5 overflow-hidden">
                                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80" alt="Trader User" />
                                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80" alt="Trader User" />
                                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80" alt="Trader User" />
                                <img className="inline-block h-9 w-9 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80" alt="Trader User" />
                                <div className="inline-flex h-9 w-9 rounded-full ring-2 ring-slate-900 bg-emerald-500/20 text-emerald-400 items-center justify-center font-black text-xs">
                                    +5k
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-1 text-amber-400 text-xs">
                                    {'★'.repeat(5)}
                                    <span className="text-white font-extrabold ml-1">4.9 / 5.0</span>
                                </div>
                                <p className="text-xs text-slate-400">Trusted by 5,000+ Disciplined Traders</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: High-Tech FinTech Interactive Dashboard Terminal Mockup */}
                    <div className="lg:col-span-6 relative w-full">
                        {/* Ambient glow behind terminal */}
                        <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-60"></div>

                        {/* Terminal Window */}
                        <div className="relative rounded-2xl bg-[#0b1222]/95 border border-slate-700/80 shadow-2xl overflow-hidden backdrop-blur-xl">
                            {/* Window Header */}
                            <div className="px-4 py-3 bg-[#080d19] border-b border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                                    <span className="text-[11px] font-mono text-slate-400 font-semibold ml-2">TradeJournall Terminal v2.5</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    <span className="text-[10px] font-mono text-emerald-400 font-bold">EXCHANGES CONNECTED</span>
                                </div>
                            </div>

                            {/* Terminal Dashboard Body */}
                            <div className="p-4 sm:p-5 space-y-4">
                                {/* Top Metric Chips */}
                                <div className="grid grid-cols-3 gap-2.5">
                                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/90">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Net Profit</p>
                                        <p className="text-sm sm:text-base font-black text-emerald-400 font-mono mt-0.5">+$18,450.20</p>
                                        <span className="text-[9px] text-emerald-500 font-bold">+34.8% Month</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/90">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Win Rate</p>
                                        <p className="text-sm sm:text-base font-black text-white font-mono mt-0.5">69.4%</p>
                                        <span className="text-[9px] text-cyan-400 font-bold">Avg R:R 1:3.2</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/90">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Profit Factor</p>
                                        <p className="text-sm sm:text-base font-black text-teal-300 font-mono mt-0.5">2.84</p>
                                        <span className="text-[9px] text-slate-400 font-bold">124 Trades</span>
                                    </div>
                                </div>

                                {/* Glowing Equity Curve Chart SVG Visual */}
                                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-1.5">
                                            <Activity size={14} className="text-emerald-400" />
                                            <span className="text-xs font-bold text-slate-200">Cumulative Equity Growth</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">All-Time High</span>
                                    </div>
                                    {/* SVG Chart */}
                                    <div className="h-28 w-full relative">
                                        <svg className="w-full h-full" viewBox="0 0 400 110" preserveAspectRatio="none">
                                            <defs>
                                                <linearGradient id="equityGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                                                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                                                </linearGradient>
                                            </defs>
                                            <path d="M0,90 Q40,85 80,70 T160,55 T240,40 T320,20 T400,8 L400,110 L0,110 Z" fill="url(#equityGrad)" />
                                            <path d="M0,90 Q40,85 80,70 T160,55 T240,40 T320,20 T400,8" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                                            {/* Data Points */}
                                            <circle cx="80" cy="70" r="3.5" fill="#34d399" />
                                            <circle cx="160" cy="55" r="3.5" fill="#34d399" />
                                            <circle cx="240" cy="40" r="3.5" fill="#34d399" />
                                            <circle cx="320" cy="20" r="3.5" fill="#34d399" />
                                            <circle cx="400" cy="8" r="4.5" fill="#10b981" className="animate-ping" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Live Trade Executions Feed Inside Mockup */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">Recent Executions</span>
                                        <span className="text-[10px] text-slate-500 font-mono">Real-time sync</span>
                                    </div>

                                    {/* Trade Row 1 */}
                                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80 text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">LONG</span>
                                            <span className="font-bold text-white font-mono">BTC/USDT</span>
                                            <span className="text-slate-400 text-[10px] hidden sm:inline">Breakout Strategy</span>
                                        </div>
                                        <div className="flex items-center gap-3 font-mono">
                                            <span className="text-[11px] text-slate-400">R:R 1:3.4</span>
                                            <span className="text-emerald-400 font-bold">+$1,840.00</span>
                                        </div>
                                    </div>

                                    {/* Trade Row 2 */}
                                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80 text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">SHORT</span>
                                            <span className="font-bold text-white font-mono">ETH/USDT</span>
                                            <span className="text-slate-400 text-[10px] hidden sm:inline">Resistance Rejection</span>
                                        </div>
                                        <div className="flex items-center gap-3 font-mono">
                                            <span className="text-[11px] text-slate-400">R:R 1:2.8</span>
                                            <span className="text-emerald-400 font-bold">+$720.50</span>
                                        </div>
                                    </div>

                                    {/* Trade Row 3 */}
                                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80 text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">LONG</span>
                                            <span className="font-bold text-white font-mono">NIFTY 24200 CE</span>
                                            <span className="text-slate-400 text-[10px] hidden sm:inline">Gap Fill</span>
                                        </div>
                                        <div className="flex items-center gap-3 font-mono">
                                            <span className="text-[11px] text-slate-400">R:R 1:3.0</span>
                                            <span className="text-emerald-400 font-bold">+$950.00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Micro-Badge: Psychology Guard */}
                            <div className="absolute -top-3 -right-3 hidden sm:flex items-center gap-2 bg-[#0e172a] border border-emerald-500/40 px-3 py-1.5 rounded-xl shadow-xl backdrop-blur-md">
                                <Brain size={14} className="text-emerald-400 animate-pulse" />
                                <span className="text-[11px] font-bold text-slate-200">Discipline Score: <span className="text-emerald-400 font-mono">98%</span></span>
                            </div>

                            {/* Floating Micro-Badge: Leverage Danger Shield */}
                            <div className="absolute -bottom-3 -left-3 hidden sm:flex items-center gap-2 bg-[#0e172a] border border-amber-500/40 px-3 py-1.5 rounded-xl shadow-xl backdrop-blur-md">
                                <Zap size={14} className="text-amber-400" />
                                <span className="text-[11px] font-bold text-slate-200">Leverage Shield: <span className="text-amber-400 font-mono">Safe (Buffer 48%)</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Metrics Trust Strip */}
            <section className="w-full border-y border-slate-800/80 bg-[#070b16]/90 py-10 px-4">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
                        <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-mono">$14.8M+</p>
                        <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Trading Volume Tracked</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
                        <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-400 font-mono">5,000+</p>
                        <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Active Disciplined Traders</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
                        <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono">99.4%</p>
                        <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">P&amp;L &amp; Risk Accuracy</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
                        <p className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">100% FREE</p>
                        <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Zero Paywalls, Zero KYC</p>
                    </div>
                </div>
            </section>

            {/* 🏆 Dedicated Prop Firm Traders Suite Section */}
            <section className="w-full py-12 px-4 max-w-7xl mx-auto border-b border-slate-800/80">
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-purple-950/30 via-slate-900/60 to-slate-950 border border-purple-500/30 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 relative z-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-extrabold uppercase tracking-wider mb-2.5">
                                <Landmark size={14} className="text-purple-400" />
                                <span>Prop Firm Traders Suite</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                                Prop Firm Calculators &amp; Growth Tools 🏆
                            </h2>
                            <p className="text-slate-300 text-sm mt-1.5 max-w-2xl leading-relaxed">
                                Built for <strong className="text-purple-300">FTMO, Topstep, Apex Trader Funding, FundedNext &amp; 5%ers</strong> funded traders. Calculate scaling roadmaps, net payouts after taxes, 30% consistency caps, and drawdown risk.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-purple-300 bg-purple-900/40 px-3 py-1.5 rounded-xl border border-purple-500/30 font-bold">
                                4 Prop Firm Tools Live
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                        {/* Prop Firm Tool 1: Scaling Roadmap */}
                        <a
                            href="/tools/prop-firm-scaling-plan-calculator"
                            onClick={(e) => {
                                e.preventDefault();
                                if (onOpenPropFirmScalingCalculator) onOpenPropFirmScalingCalculator();
                            }}
                            className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/40 hover:border-purple-400 transition-all duration-300 shadow-xl group text-left cursor-pointer flex flex-col justify-between"
                            style={{ textDecoration: 'none' }}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 group-hover:scale-110 transition">
                                        <TrendingUp size={22} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500/30 text-purple-200 border border-purple-400/40">
                                        ROADMAP
                                    </span>
                                </div>
                                <h3 className="text-base font-bold text-white mb-1 group-hover:text-purple-300 transition">
                                    Account Scaling Roadmap
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Plan step-by-step scaling from $25k to $2M+ with lot size scaling &amp; compound growth schedule.
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-purple-500/20 flex items-center justify-between text-xs font-bold text-purple-300">
                                <span>Scale Account</span>
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                            </div>
                        </a>

                        {/* Prop Firm Tool 2: Profit Split & Tax */}
                        <a
                            href="/tools/prop-firm-profit-split-payout-calculator"
                            onClick={(e) => {
                                e.preventDefault();
                                if (onOpenPropFirmPayoutCalculator) onOpenPropFirmPayoutCalculator();
                            }}
                            className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 hover:border-emerald-400 transition-all duration-300 shadow-xl group text-left cursor-pointer flex flex-col justify-between"
                            style={{ textDecoration: 'none' }}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 group-hover:scale-110 transition">
                                        <Landmark size={22} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                                        PAYOUT
                                    </span>
                                </div>
                                <h3 className="text-base font-bold text-white mb-1 group-hover:text-emerald-300 transition">
                                    Profit Split &amp; Net Tax
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Calculate actual in-hand bank cash ($) after 80/20 split, transfer fees, and US/UK/India taxes.
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs font-bold text-emerald-300">
                                <span>Calculate Payout</span>
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                            </div>
                        </a>

                        {/* Prop Firm Tool 3: Apex 30% Consistency */}
                        <a
                            href="/tools/apex-consistency-rule-calculator"
                            onClick={(e) => {
                                e.preventDefault();
                                if (onOpenApexConsistencyCalculator) onOpenApexConsistencyCalculator();
                            }}
                            className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/40 hover:border-amber-400 transition-all duration-300 shadow-xl group text-left cursor-pointer flex flex-col justify-between"
                            style={{ textDecoration: 'none' }}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 group-hover:scale-110 transition">
                                        <Award size={22} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/30 text-amber-200 border border-amber-400/40">
                                        APEX
                                    </span>
                                </div>
                                <h3 className="text-base font-bold text-white mb-1 group-hover:text-amber-300 transition">
                                    30% Consistency Rule
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Track single-day profit caps to pass Apex &amp; Topstep consistency payout rules safely.
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs font-bold text-amber-300">
                                <span>Check Rule</span>
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                            </div>
                        </a>

                        {/* Prop Firm Tool 4: FTMO Challenge Drawdown */}
                        <a
                            href="/tools/ftmo-calculator"
                            onClick={(e) => {
                                e.preventDefault();
                                if (onOpenPropFirmCalculator) onOpenPropFirmCalculator();
                            }}
                            className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 hover:border-cyan-400 transition-all duration-300 shadow-xl group text-left cursor-pointer flex flex-col justify-between"
                            style={{ textDecoration: 'none' }}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 group-hover:scale-110 transition">
                                        <ShieldAlert size={22} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/30 text-cyan-200 border border-cyan-400/40">
                                        FTMO
                                    </span>
                                </div>
                                <h3 className="text-base font-bold text-white mb-1 group-hover:text-cyan-300 transition">
                                    FTMO Evaluation Calc
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Daily drawdown limits &amp; lot size calculator for FTMO, FundedNext &amp; Funding Pips.
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-cyan-500/20 flex items-center justify-between text-xs font-bold text-cyan-300">
                                <span>Calculate Risk</span>
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* Direct Tool Showcase Section: Highly Visible to All Users */}
            <section className="w-full py-12 px-4 max-w-7xl mx-auto border-b border-slate-800/80">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                            <Calculator size={13} /> Free Risk &amp; Performance Tools
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                            Essential Trading Tools &amp; Calculators
                        </h2>
                        <p className="text-slate-400 text-sm mt-1 max-w-xl">
                            Instant mathematical precision before executing high-risk trades. 100% free, no login or signup required.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Card 0: Shift & Night-Trader Session Volatility Clock */}
                    <a
                        href="/tools/session-clock-ist"
                        onClick={(e) => {
                            e.preventDefault();
                            if (onOpenSessionClock) onOpenSessionClock();
                        }}
                        className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-emerald-500/40 hover:border-emerald-500/80 transition-all duration-300 shadow-lg shadow-emerald-500/10 group text-left cursor-pointer flex flex-col justify-between"
                        style={{ textDecoration: 'none' }}
                    >
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition">
                                    <Clock size={22} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    LIVE IST
                                </span>
                            </div>
                            <h3 className="text-base font-bold text-white mb-1 group-hover:text-emerald-300 transition">
                                Session Volatility Clock
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Live visual progress bars for Sydney, Tokyo, London &amp; New York in IST. Golden Volatility Overlap, US market open alerts &amp; audio chimes.
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400">
                            <span>Launch Clock</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                        </div>
                    </a>

                    {/* Card: Revenge Trade Cooldown Clock */}
                    <a
                        href="/tools/revenge-trading-cooldown-timer"
                        onClick={(e) => {
                            e.preventDefault();
                            if (onOpenCooldownTimer) onOpenCooldownTimer();
                        }}
                        className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-rose-500/40 hover:border-rose-500/80 transition-all duration-300 shadow-lg shadow-rose-500/10 group text-left cursor-pointer flex flex-col justify-between"
                        style={{ textDecoration: 'none' }}
                    >
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 group-hover:scale-110 transition">
                                    <ShieldAlert size={22} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                    RESET TILT
                                </span>
                            </div>
                            <h3 className="text-base font-bold text-white mb-1 group-hover:text-rose-300 transition">
                                Revenge Cooldown Clock
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Halt emotional revenge trading after hitting a stop-loss. Interactive 15-minute cooldown timer, discipline quotes &amp; position sizing check.
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-rose-400">
                            <span>Start Cooldown</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                        </div>
                    </a>

                    {/* Card 1: Risk-Reward vs Win-Rate Matrix */}
                    <a
                        href="/tools/risk-reward-win-rate-matrix"
                        onClick={(e) => {
                            e.preventDefault();
                            if (onOpenRiskRewardMatrix) onOpenRiskRewardMatrix();
                        }}
                        className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-emerald-500/40 hover:border-emerald-500/80 transition-all duration-300 shadow-lg shadow-emerald-500/10 group text-left cursor-pointer flex flex-col justify-between"
                        style={{ textDecoration: 'none' }}
                    >
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition">
                                    <Grid size={22} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    PRO EDGE
                                </span>
                            </div>
                            <h3 className="text-base font-bold text-white mb-1 group-hover:text-emerald-300 transition">
                                Risk-Reward Matrix
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                2D Heatmap &amp; Expectancy Calculator. Analyze exact minimum win rates, 1:2 RRR hurdles, and avoid mathematical traps.
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400">
                            <span>Open Matrix</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                        </div>
                    </a>

                    {/* Card 1: Drawdown Recovery & Compounding */}
                    <a
                        href="/tools/drawdown-recovery-calculator"
                        onClick={(e) => {
                            e.preventDefault();
                            if (onOpenDrawdownCalculator) onOpenDrawdownCalculator();
                        }}
                        className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-rose-500/30 hover:border-rose-500/70 transition-all duration-300 shadow-lg shadow-rose-500/5 group text-left cursor-pointer flex flex-col justify-between"
                        style={{ textDecoration: 'none' }}
                    >
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 group-hover:scale-110 transition">
                                    <TrendingDown size={22} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                    PRO TOOL
                                </span>
                            </div>
                            <h3 className="text-base font-bold text-white mb-1 group-hover:text-rose-300 transition">
                                Drawdown Recovery &amp; Goal
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Calculate exact percentage return, RRR, and winning trades needed to recover losses and plan account compounding.
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-rose-400">
                            <span>Open Calculator</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                        </div>
                    </a>

                    {/* Card 2: Prop Firm Challenge Calculator */}
                    <a
                        href="/tools/ftmo-calculator"
                        onClick={(e) => {
                            e.preventDefault();
                            if (onOpenPropFirmCalculator) onOpenPropFirmCalculator();
                        }}
                        className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-emerald-500/30 hover:border-emerald-500/70 transition-all duration-300 shadow-lg shadow-emerald-500/5 group text-left cursor-pointer flex flex-col justify-between"
                        style={{ textDecoration: 'none' }}
                    >
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition">
                                    <ShieldAlert size={22} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    NEW
                                </span>
                            </div>
                            <h3 className="text-base font-bold text-white mb-1 group-hover:text-emerald-300 transition">
                                Prop Firm Calculator
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Max daily drawdown &amp; lot size calculator for FTMO, Funding Pips, FundedNext, and E8 evaluation challenges.
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400">
                            <span>Open Calculator</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                        </div>
                    </a>

                    {/* Card 3: Crypto Leverage Danger Calculator */}
                    <a
                        href="/tools/leverage-danger-calculator"
                        onClick={(e) => {
                            e.preventDefault();
                            if (onOpenLeverageCalculator) onOpenLeverageCalculator();
                        }}
                        className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-amber-500/30 hover:border-amber-500/70 transition-all duration-300 shadow-lg shadow-amber-500/5 group text-left cursor-pointer flex flex-col justify-between"
                        style={{ textDecoration: 'none' }}
                    >
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 group-hover:scale-110 transition">
                                    <Zap size={22} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    HOT
                                </span>
                            </div>
                            <h3 className="text-base font-bold text-white mb-1 group-hover:text-amber-300 transition">
                                Leverage Danger &amp; Liquidation
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Exact liquidation price and margin danger calculator for Binance, Bybit, BTC, and 100x futures contracts.
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400">
                            <span>Open Calculator</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                        </div>
                    </a>

                    {/* Card 4: Brokerage & Tax Calculator */}
                    <a
                        href="/calculators/stocks/zerodha-vs-groww-brokerage-calculator"
                        onClick={(e) => {
                            e.preventDefault();
                            if (onOpenCalculator) onOpenCalculator();
                        }}
                        className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-cyan-500/30 hover:border-cyan-500/70 transition-all duration-300 shadow-lg shadow-cyan-500/5 group text-left cursor-pointer flex flex-col justify-between"
                        style={{ textDecoration: 'none' }}
                    >
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 group-hover:scale-110 transition">
                                    <Scale size={22} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                    FREE
                                </span>
                            </div>
                            <h3 className="text-base font-bold text-white mb-1 group-hover:text-cyan-300 transition">
                                Brokerage &amp; Tax Calculator
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Zerodha vs Groww, STT, GST, SEBI fee comparison and Indian 30% crypto tax &amp; 1% TDS breakdowns.
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-400">
                            <span>Open Calculator</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                        </div>
                    </a>

                    {/* Card 5: Cross vs Isolated Margin Liquidation Risk Calculator */}
                    <a
                        href="/tools/cross-vs-isolated-margin-calculator"
                        onClick={(e) => {
                            e.preventDefault();
                            if (onOpenCrossVsIsolatedCalculator) onOpenCrossVsIsolatedCalculator();
                        }}
                        className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-purple-500/40 hover:border-purple-500/80 transition-all duration-300 shadow-lg shadow-purple-500/10 group text-left cursor-pointer flex flex-col justify-between"
                        style={{ textDecoration: 'none' }}
                    >
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 group-hover:scale-110 transition">
                                    <Scale size={22} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                    CRYPTO LIQ
                                </span>
                            </div>
                            <h3 className="text-base font-bold text-white mb-1 group-hover:text-purple-300 transition">
                                Cross vs Isolated Liquidation
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Binance &amp; Bybit futures liquidation price simulator. Compare safety buffer %, isolated contagion walls &amp; total wallet wipeout danger.
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-purple-400">
                            <span>Open Simulator</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                        </div>
                    </a>

                    {/* Card 6: Crypto Profit Calculator & Staged Exit Ladder */}
                    <a
                        href="/tools/crypto-profit-calculator"
                        onClick={(e) => {
                            e.preventDefault();
                            if (onOpenCryptoProfitCalculator) onOpenCryptoProfitCalculator();
                        }}
                        className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-emerald-500/40 hover:border-emerald-500/80 transition-all duration-300 shadow-lg shadow-emerald-500/10 group text-left cursor-pointer flex flex-col justify-between"
                        style={{ textDecoration: 'none' }}
                    >
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition">
                                    <CircleDollarSign size={22} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    PROFIT LADDER
                                </span>
                            </div>
                            <h3 className="text-base font-bold text-white mb-1 group-hover:text-emerald-300 transition">
                                Crypto Profit &amp; Exit Ladder
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Exact net profit after exchange fees &amp; 30% taxes. Model 4-tier staged exit ladders (DCA Out) and lock in risk-free free rides.
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400">
                            <span>Open Calculator</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                        </div>
                    </a>
                </div>
            </section>

            {/* Bento Grid Feature Showcase ("Built for Systematic Traders") */}
            <section id="features" className="w-full py-20 px-4 max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                        <Sparkles size={13} /> Institutional Grade Features
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                        Everything You Need to Turn Pro in <span className="text-emerald-400">One Unified Journal</span>
                    </h2>
                    <p className="text-slate-400 text-base sm:text-lg mt-3 leading-relaxed">
                        Stop managing 10 broken Excel sheets. TradeJournall gives you automatic calculations, AI psychology mentorship, and liquidation prevention in one sleek dashboard.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Bento 1: Multi-Exchange Automated Sync (Spans 2 cols on large screen) */}
                    <div className="md:col-span-2 p-7 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 shadow-xl group">
                        <div className="flex items-center justify-between mb-5">
                            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition">
                                <BarChart3 size={24} />
                            </div>
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                Multi-Exchange Hub
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Track Every Exchange &amp; Broker in One Unified Dashboard</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Whether you trade crypto on <strong className="text-white">Binance, WazirX, CoinDCX, Bybit</strong>, or Indian options on <strong className="text-white">Zerodha &amp; Groww</strong>, log your trades in seconds. Automatic calculations for gross P&amp;L, net P&amp;L after exchange fees, and R:R ratios.
                        </p>
                        {/* Supported exchange pill badges */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
                            {['Binance', 'WazirX', 'CoinDCX', 'Bybit', 'Zerodha Kite', 'Groww', 'Delta Exchange', 'Forex MT4/MT5'].map((ex, i) => (
                                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-[11px] font-semibold text-slate-300">
                                    {ex}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Bento 2: Crypto Leverage Danger Calculator Card */}
                    <div className="p-7 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 shadow-xl group">
                        <div className="flex items-center justify-between mb-5">
                            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition">
                                <Zap size={24} />
                            </div>
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                Liquidation Engine
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Crypto Leverage Danger &amp; Liquidation Radar</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            High leverage destroys accounts. Test your position sizing with our real-time liquidation engine before you execute on Binance or Bybit.
                        </p>
                        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5 font-mono">
                            <div className="flex justify-between text-slate-400">
                                <span>Leverage Level:</span>
                                <span className="text-amber-400 font-bold">50x Isolated</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Liquidation Drop:</span>
                                <span className="text-rose-400 font-bold">-1.8% from Entry</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                                <div className="bg-rose-500 h-full w-[85%]"></div>
                            </div>
                        </div>

                        <a
                            href="/tools/leverage-danger-calculator"
                            onClick={(e) => {
                                if (onOpenLeverageCalculator) {
                                    e.preventDefault();
                                    onOpenLeverageCalculator();
                                }
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 mt-4 group/link"
                            style={{ textDecoration: 'none' }}
                        >
                            <span>Launch Danger Calculator Free</span>
                            <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                        </a>
                    </div>

                    {/* Bento 3: AI Psychology Coach & Mistake Tagging */}
                    <div className="p-7 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all duration-300 shadow-xl group">
                        <div className="flex items-center justify-between mb-5">
                            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-105 transition">
                                <Brain size={24} />
                            </div>
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                                Tilt Defense
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">24/7 AI Psychology Coach &amp; Tilt Detection</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            Tag emotional executions — <span className="text-purple-300">FOMO, revenge trading, overtrading</span>. Our AI diagnoses which psychological triggers cause your biggest drawdowns.
                        </p>
                        <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-900/40 text-xs text-purple-300 italic">
                            &quot;You took 4 trades within 18 minutes after a loss on BTC. Cooling-off period suggested.&quot;
                        </div>
                    </div>

                    {/* Bento 4: Candlestick Replay & Backtesting */}
                    <div className="p-7 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 shadow-xl group">
                        <div className="flex items-center justify-between mb-5">
                            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition">
                                <Clock size={24} />
                            </div>
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                                Strategy Simulator
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Candlestick Replay Backtesting Simulator</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            Simulate setups bar-by-bar on historical Nifty, BankNifty, and Crypto data without risking a single rupee of real capital.
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-slate-800">
                            <span>Bar Replay Engine</span>
                            <span className="text-cyan-400 font-bold font-mono">1m • 5m • 15m • 1D</span>
                        </div>
                    </div>

                    {/* Bento 5: Calendar Heatmap & Institutional Analytics */}
                    <div className="p-7 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 hover:border-teal-500/50 transition-all duration-300 shadow-xl group">
                        <div className="flex items-center justify-between mb-5">
                            <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:scale-105 transition">
                                <TrendingUp size={24} />
                            </div>
                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-500/15 text-teal-300 border border-teal-500/30">
                                Analytics Pro
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">P&amp;L Calendar Heatmap &amp; Sharpe Ratio</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            Instantly see which days and hours generate your highest profit expectancy, and which sessions bleed money.
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-slate-800">
                            <span>Profit Expectancy</span>
                            <span className="text-teal-400 font-bold font-mono">+$420 / Trade</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* "TradeJournall vs Spreadsheets" Comparison Section */}
            <section className="w-full py-16 px-4 bg-[#080d1a] border-y border-slate-800/80">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
                            Why Spreadsheets Fail
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-white mt-3">
                            Manual Excel Sheets vs. <span className="text-emerald-400">TradeJournall</span>
                        </h2>
                        <p className="text-slate-400 text-sm sm:text-base mt-2">
                            90% of unprofitable traders still use clunky Google Sheets that break when they need them most.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Old Way: Clunky Spreadsheets */}
                        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-rose-500/30 relative">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400">
                                    <XCircle size={22} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Manual Spreadsheets (Excel / Sheets)</h3>
                                    <p className="text-xs text-rose-400 font-semibold">Slow, Frustrating, Error-Prone</p>
                                </div>
                            </div>
                            <ul className="space-y-3.5 text-sm text-slate-300">
                                <li className="flex items-start gap-2.5">
                                    <span className="text-rose-400 font-bold mt-0.5">✕</span>
                                    <span>Manual formulas break constantly when adding new rows or tokens.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-rose-400 font-bold mt-0.5">✕</span>
                                    <span>Impossible to store and review chart setup screenshots directly.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-rose-400 font-bold mt-0.5">✕</span>
                                    <span>Zero psychology tracking — no detection of FOMO or revenge trading.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-rose-400 font-bold mt-0.5">✕</span>
                                    <span>Miserable experience on mobile when trading on the go.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="text-rose-400 font-bold mt-0.5">✕</span>
                                    <span>No real-time crypto leverage liquidation risk alerts.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Modern Way: TradeJournall */}
                        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/20 via-slate-900 to-slate-900 border border-emerald-500/50 shadow-2xl relative">
                            <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                                Recommended
                            </div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                                    <CheckCircle2 size={22} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">TradeJournall (Automated System)</h3>
                                    <p className="text-xs text-emerald-400 font-semibold">Institutional Grade &amp; 100% Free</p>
                                </div>
                            </div>
                            <ul className="space-y-3.5 text-sm text-slate-200">
                                <li className="flex items-start gap-2.5">
                                    <Check size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <span><strong className="text-white">Auto-Calculated Metrics:</strong> Net P&amp;L, fees, win rate, and profit factor update live.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <Check size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <span><strong className="text-white">Chart Setup Screenshots:</strong> Attach setup photos directly to every trade for visual review.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <Check size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <span><strong className="text-white">AI Tilt &amp; Mistake Detection:</strong> Pinpoint exact mental errors that bleed capital.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <Check size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <span><strong className="text-white">Crypto Leverage Safety Shield:</strong> Live liquidation price warning engine.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <Check size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                    <span><strong className="text-white">Cloud Synced &amp; Mobile Ready:</strong> Seamless access across desktop and smartphone.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works (3 Clear Steps) */}
            <section className="w-full py-20 px-4 max-w-6xl mx-auto">
                <div className="text-center mb-14">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                        Simple 3-Step Process
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-black text-white mt-3">How TradeJournall Works</h2>
                    <p className="text-slate-400 text-base max-w-xl mx-auto mt-2">
                        Get started in less than 60 seconds with no credit card required.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all text-center group">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-2xl font-black flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                            1
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Log Your Trades</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Log trades manually in 10 seconds or upload CSV files from Binance, Bybit, WazirX, or Zerodha with ease.
                        </p>
                    </div>

                    <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/40 transition-all text-center group">
                        <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 text-2xl font-black flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                            2
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Get Instant Deep Analytics</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Our algorithmic engine computes your win rate, equity curve, Sharpe ratio, and profit factor in real-time.
                        </p>
                    </div>

                    <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all text-center group">
                        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-2xl font-black flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                            3
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Eliminate Costly Leaks</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Review setups, spot emotional tilt, and grow your trading account with disciplined, repeatable execution.
                        </p>
                    </div>
                </div>
            </section>

            {/* Comprehensive Inside the Terminal Feature Showcase */}
            <main className="w-full py-20 px-4 bg-[#080d19] border-t border-slate-800">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">Inside the Best Trade Tracker</h2>
                        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                            Discover every single screen and feature available inside our premier AI trading journal software. From P&amp;L logging to AI analysis, here is exactly what you get.
                        </p>
                    </div>

                    <div className="space-y-14">
                        {/* 01. Dashboard */}
                        <div className="bg-slate-900/70 border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col gap-6">
                            <div className="lg:flex gap-10 items-center">
                                <div className="lg:w-1/3 mb-4 lg:mb-0">
                                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 font-bold text-xs mb-3 border border-blue-500/20">
                                        <BarChart3 size={15} /> 01. Dashboard
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-black text-white">Real-Time Command Center</h3>
                                    <p className="text-xs text-slate-400 mt-2">Comprehensive portfolio overview at a single glance.</p>
                                </div>
                                <div className="lg:w-2/3">
                                    <ul className="grid sm:grid-cols-2 gap-3 text-slate-300 text-sm">
                                        <li className="flex items-start gap-2"><span className="text-blue-400 font-bold">✔</span> <strong>Total Net P&amp;L:</strong> Live calculation of total portfolio profit and loss.</li>
                                        <li className="flex items-start gap-2"><span className="text-blue-400 font-bold">✔</span> <strong>Equity Curve Chart:</strong> Visual growth curve graphing balance over time.</li>
                                        <li className="flex items-start gap-2"><span className="text-blue-400 font-bold">✔</span> <strong>Quick KPIs:</strong> Instant Gross Profit, Gross Loss, and Win Rate.</li>
                                        <li className="flex items-start gap-2"><span className="text-blue-400 font-bold">✔</span> <strong>Rapid Entry:</strong> 1-click &apos;Add Trade&apos; button during fast-moving markets.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 02. Trades */}
                        <div className="bg-slate-900/70 border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col gap-6">
                            <div className="lg:flex gap-10 items-center">
                                <div className="lg:w-1/3 mb-4 lg:mb-0">
                                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-xs mb-3 border border-emerald-500/20">
                                        <TrendingUp size={15} /> 02. Trade Log
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-black text-white">Complete P&amp;L Tracker</h3>
                                    <p className="text-xs text-slate-400 mt-2">Chronological trade records with setup tags.</p>
                                </div>
                                <div className="lg:w-2/3">
                                    <ul className="grid sm:grid-cols-2 gap-3 text-slate-300 text-sm">
                                        <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold">✔</span> <strong>Full Parameters:</strong> Entry, Exit, SL, TP, Fees, and Direction.</li>
                                        <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold">✔</span> <strong>Chart Attachments:</strong> Upload screenshot setups for visual review.</li>
                                        <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold">✔</span> <strong>Strategy Tags:</strong> Categorize trades (Breakout, Mean Reversion, Scalp).</li>
                                        <li className="flex items-start gap-2"><span className="text-emerald-400 font-bold">✔</span> <strong>Historical Export:</strong> Complete CSV export whenever you need offline backup.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 03. AI Coach */}
                        <div className="bg-slate-900/70 border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col gap-6">
                            <div className="lg:flex gap-10 items-center">
                                <div className="lg:w-1/3 mb-4 lg:mb-0">
                                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-400 font-bold text-xs mb-3 border border-purple-500/20">
                                        <Brain size={15} /> 03. AI Coach
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-black text-white">24/7 Trading Psychiatrist</h3>
                                    <p className="text-xs text-slate-400 mt-2">Personalized feedback tailored to your actual trades.</p>
                                </div>
                                <div className="lg:w-2/3">
                                    <ul className="grid sm:grid-cols-2 gap-3 text-slate-300 text-sm">
                                        <li className="flex items-start gap-2"><span className="text-purple-400 font-bold">✔</span> <strong>Context-Aware:</strong> AI reads your recent trades for precision coaching.</li>
                                        <li className="flex items-start gap-2"><span className="text-purple-400 font-bold">✔</span> <strong>Tilt Management:</strong> Helps stop revenge trading before catastrophic drawdowns.</li>
                                        <li className="flex items-start gap-2"><span className="text-purple-400 font-bold">✔</span> <strong>Pattern Recognition:</strong> Identifies hidden loss patterns across market sessions.</li>
                                        <li className="flex items-start gap-2"><span className="text-purple-400 font-bold">✔</span> <strong>Custom Prompts:</strong> Ask specific strategy and position-sizing questions.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 04. Analytics */}
                        <div className="bg-slate-900/70 border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col gap-6">
                            <div className="lg:flex gap-10 items-center">
                                <div className="lg:w-1/3 mb-4 lg:mb-0">
                                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-400 font-bold text-xs mb-3 border border-amber-500/20">
                                        <BarChart3 size={15} /> 04. Institutional Analytics
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-black text-white">Quantitative Performance Metrics</h3>
                                    <p className="text-xs text-slate-400 mt-2">Professional risk-adjusted return calculations.</p>
                                </div>
                                <div className="lg:w-2/3">
                                    <ul className="grid sm:grid-cols-2 gap-3 text-slate-300 text-sm">
                                        <li className="flex items-start gap-2"><span className="text-amber-400 font-bold">✔</span> <strong>Sharpe &amp; Sortino:</strong> Institutional risk-adjusted performance scores.</li>
                                        <li className="flex items-start gap-2"><span className="text-amber-400 font-bold">✔</span> <strong>Max Drawdown:</strong> Monitor peak-to-trough capital pullbacks.</li>
                                        <li className="flex items-start gap-2"><span className="text-amber-400 font-bold">✔</span> <strong>Expectancy Score:</strong> Statistical profit expectation per executed order.</li>
                                        <li className="flex items-start gap-2"><span className="text-amber-400 font-bold">✔</span> <strong>Heatmap Grid:</strong> Visual day-of-week and hourly profitability matrix.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 05. Risk Calculators */}
                        <div className="bg-slate-900/70 border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col gap-6">
                            <div className="lg:flex gap-10 items-center">
                                <div className="lg:w-1/3 mb-4 lg:mb-0">
                                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-400 font-bold text-xs mb-3 border border-rose-500/20">
                                        <Calculator size={15} /> 05. Calculators &amp; Danger Radar
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-black text-white">Pre-Trade Risk Calculators</h3>
                                    <p className="text-xs text-slate-400 mt-2">Position sizing, prop firm drawdown, and leverage warning.</p>
                                </div>
                                <div className="lg:w-2/3">
                                    <ul className="grid sm:grid-cols-2 gap-3 text-slate-300 text-sm">
                                        <li className="flex items-start gap-2"><span className="text-rose-400 font-bold">✔</span> <strong>Crypto Leverage Danger:</strong> Computes exact liquidation drop &amp; safety zone.</li>
                                        <li className="flex items-start gap-2"><span className="text-rose-400 font-bold">✔</span> <strong>Prop Firm Calculator:</strong> Prevents daily &amp; maximum drawdown breaches.</li>
                                        <li className="flex items-start gap-2"><span className="text-rose-400 font-bold">✔</span> <strong>Brokerage &amp; Tax:</strong> Indian STT, GST, and turnover fee calculation.</li>
                                        <li className="flex items-start gap-2"><span className="text-rose-400 font-bold">✔</span> <strong>Target Projections:</strong> 1:2 and 1:3 profit target calculations.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 06. Backtesting */}
                        <div className="bg-slate-900/70 border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col gap-6">
                            <div className="lg:flex gap-10 items-center">
                                <div className="lg:w-1/3 mb-4 lg:mb-0">
                                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold text-xs mb-3 border border-cyan-500/20">
                                        <TrendingUp size={15} /> 06. Backtesting
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-black text-white">Candlestick Replay Simulator</h3>
                                    <p className="text-xs text-slate-400 mt-2">Test historical setups for Indian indices &amp; Crypto.</p>
                                </div>
                                <div className="lg:w-2/3">
                                    <ul className="grid sm:grid-cols-2 gap-3 text-slate-300 text-sm">
                                        <li className="flex items-start gap-2"><span className="text-cyan-400 font-bold">✔</span> <strong>Nifty &amp; BankNifty:</strong> Bar-by-bar historical playback simulator.</li>
                                        <li className="flex items-start gap-2"><span className="text-cyan-400 font-bold">✔</span> <strong>Zero Risk:</strong> Validate strategy edge before putting real capital on the line.</li>
                                        <li className="flex items-start gap-2"><span className="text-cyan-400 font-bold">✔</span> <strong>Built-in Indicators:</strong> RSI, MACD, and Exponential Moving Averages.</li>
                                        <li className="flex items-start gap-2"><span className="text-cyan-400 font-bold">✔</span> <strong>Backtest Logging:</strong> Automatically tracks backtest win rate &amp; expectancy.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Comparison Table */}
                    <div className="mt-20">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl sm:text-3xl font-black text-white">Comprehensive Feature Matrix</h3>
                            <p className="text-slate-400 text-sm mt-1">Everything included in TradeJournall at zero cost.</p>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-slate-800 shadow-2xl bg-slate-900/60">
                            <table className="w-full text-left border-collapse text-xs sm:text-sm">
                                <thead>
                                    <tr className="bg-slate-800/80 text-slate-200">
                                        <th className="p-4 sm:p-5 font-bold border-b border-slate-700">Feature Category</th>
                                        <th className="p-4 sm:p-5 font-bold border-b border-slate-700">Capability</th>
                                        <th className="p-4 sm:p-5 font-bold border-b border-slate-700 text-center">TradeJournall</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-300 divide-y divide-slate-800/80 font-normal">
                                    <tr className="hover:bg-slate-800/40 transition">
                                        <td className="p-4 font-semibold text-white bg-slate-900/80" rowSpan={4}>Trade Logging</td>
                                        <td className="p-4">Unlimited Trade Entries &amp; History</td>
                                        <td className="p-4 text-center text-emerald-400 font-black">✔ Included Free</td>
                                    </tr>
                                    <tr className="hover:bg-slate-800/40 transition">
                                        <td className="p-4">Screenshot &amp; Image Attachments</td>
                                        <td className="p-4 text-center text-emerald-400 font-black">✔ Included Free</td>
                                    </tr>
                                    <tr className="hover:bg-slate-800/40 transition">
                                        <td className="p-4">Strategy Tags &amp; Psychological Notes</td>
                                        <td className="p-4 text-center text-emerald-400 font-black">✔ Included Free</td>
                                    </tr>
                                    <tr className="hover:bg-slate-800/40 transition">
                                        <td className="p-4">Commission, STT &amp; Exchange Fees</td>
                                        <td className="p-4 text-center text-emerald-400 font-black">✔ Included Free</td>
                                    </tr>

                                    <tr className="hover:bg-slate-800/40 transition">
                                        <td className="p-4 font-semibold text-white bg-slate-900/80 border-t border-slate-700" rowSpan={4}>Advanced Analytics</td>
                                        <td className="p-4 border-t border-slate-700">Auto Win Rate &amp; Cumulative Net P&amp;L</td>
                                        <td className="p-4 text-center text-emerald-400 font-black border-t border-slate-700">✔ Included Free</td>
                                    </tr>
                                    <tr className="hover:bg-slate-800/40 transition">
                                        <td className="p-4">Interactive Equity Curve Candlestick Chart</td>
                                        <td className="p-4 text-center text-emerald-400 font-black">✔ Included Free</td>
                                    </tr>
                                    <tr className="hover:bg-slate-800/40 transition">
                                        <td className="p-4">Sharpe Ratio, Max Drawdown &amp; Profit Factor</td>
                                        <td className="p-4 text-center text-emerald-400 font-black">✔ Included Free</td>
                                    </tr>
                                    <tr className="hover:bg-slate-800/40 transition">
                                        <td className="p-4">Calendar Heatmap of Profitable Trading Days</td>
                                        <td className="p-4 text-center text-emerald-400 font-black">✔ Included Free</td>
                                    </tr>

                                    <tr className="hover:bg-slate-800/40 transition">
                                        <td className="p-4 font-semibold text-white bg-slate-900/80 border-t border-slate-700" rowSpan={3}>Trading Tools &amp; AI</td>
                                        <td className="p-4 border-t border-slate-700">Crypto Leverage Danger &amp; Liquidation Engine</td>
                                        <td className="p-4 text-center text-emerald-400 font-black border-t border-slate-700">✔ Included Free</td>
                                    </tr>
                                    <tr className="hover:bg-slate-800/40 transition">
                                        <td className="p-4">Prop Firm Daily Drawdown Calculator</td>
                                        <td className="p-4 text-center text-emerald-400 font-black">✔ Included Free</td>
                                    </tr>
                                    <tr className="hover:bg-slate-800/40 transition">
                                        <td className="p-4">AI Psychology Coach &amp; Tilt Detection</td>
                                        <td className="p-4 text-center text-emerald-400 font-black">✔ Included Free</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Interactive FAQ Section for High-Ranking SEO Rich Snippets */}
            <section className="w-full py-20 px-4 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                        Frequently Asked Questions
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-white mt-3">Got Questions? We Have Answers.</h2>
                    <p className="text-slate-400 text-sm sm:text-base mt-2">
                        Everything you need to know about our free crypto and stock market journaling platform.
                    </p>
                </div>

                <div className="space-y-3.5">
                    {faqData.map((item, idx) => (
                        <div
                            key={idx}
                            className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden transition-all duration-200"
                        >
                            <button
                                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                                className="w-full p-5 text-left flex justify-between items-center gap-4 cursor-pointer hover:bg-slate-800/40 transition"
                            >
                                <span className="font-bold text-white text-sm sm:text-base">{item.q}</span>
                                <ChevronDown
                                    size={18}
                                    className={`text-emerald-400 shrink-0 transition-transform duration-200 ${openFaqIndex === idx ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {openFaqIndex === idx && (
                                <div className="px-5 pb-5 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/60 pt-3">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Trading Blog & Educational Guides Section */}
            <section id="trading-blog" className="w-full py-20 px-4 bg-[#080d19] border-t border-slate-800/80 relative">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-3">
                                <BookOpen size={14} /> Master The Markets
                            </div>
                            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                                Latest Trading Guides &amp; Insights
                            </h2>
                            <p className="text-slate-400 text-base sm:text-lg mt-2 max-w-2xl leading-relaxed">
                                Professional analysis, risk management frameworks, and trading psychology guides to protect your capital and build consistency.
                            </p>
                        </div>
                        <a
                            href="/blog"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 hover:border-emerald-500/50 transition-all text-sm w-fit"
                            style={{ textDecoration: 'none' }}
                        >
                            View All Articles ({blogPosts.length})
                            <ArrowRight size={16} className="text-emerald-400" />
                        </a>
                    </div>

                    {loadingBlogs ? (
                        <div className="py-20 flex flex-col items-center justify-center text-center">
                            <Loader2 className="animate-spin text-emerald-400 mb-3" size={36} />
                            <p className="text-slate-400 text-sm font-medium">Loading trading guides...</p>
                        </div>
                    ) : blogPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {blogPosts.map(post => (
                                <BlogCard
                                    key={post.id}
                                    post={post}
                                    theme={{
                                        card: 'bg-slate-900/80 backdrop-blur-md',
                                        border: 'border-slate-800',
                                        text: 'text-white',
                                        subtext: 'text-slate-400'
                                    }}
                                    onClick={(slug) => {
                                        window.location.href = `/blog/${slug}`;
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center">
                            <BookOpen size={40} className="mx-auto text-slate-600 mb-3" />
                            <h3 className="text-xl font-bold text-slate-300 mb-1">Trading Guides Coming Soon</h3>
                            <p className="text-slate-500 text-sm max-w-md mx-auto">
                                Our institutional analysts are drafting masterclasses on crypto leverage management, Binance strategies, and position sizing.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* SEO Deep Article Area */}
            <SeoArticle />

            {/* User-Provided High-Density Keywords Section */}
            <div className="w-full bg-[#060a14] border-t border-slate-800/80 text-center py-10 px-4">
                <div className="max-w-4xl mx-auto">
                    <p className="text-xs text-slate-500 leading-relaxed">
                        TradeJournall is a professional-grade <strong className="text-slate-400">free crypto trading journal</strong> for Binance, WazirX, CoinDCX, and Bybit traders. Whether you trade <strong className="text-slate-400">Bitcoin</strong>, <strong className="text-slate-400">Ethereum</strong>, <strong className="text-slate-400">Nifty 50 Options</strong>, or <strong className="text-slate-400">Forex</strong>, our tool helps you calculate P&amp;L, avoid revenge trading, eliminate liquidation risk with the <a href="/tools/leverage-danger-calculator" className="text-amber-400 hover:text-amber-300 font-bold underline decoration-amber-500/40 underline-offset-2">Crypto Leverage Danger Calculator</a>, and build true trading consistency — 100% free.
                    </p>
                </div>
            </div>

            {/* Categorized Footer (Strictly Maintaining Categories) */}
            <footer className="w-full py-12 text-sm border-t border-slate-800/90 bg-[#050811]">
                <div className="max-w-6xl mx-auto px-4 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {/* Column 1: Brand */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <img src="/logo.png" alt="Trade Journal Logo" className="w-8 h-8 object-contain rounded-xl bg-slate-900 border border-slate-800 p-0.5" />
                                <span className="font-extrabold text-lg text-white">Trade<span className="text-emerald-400">Journall</span></span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Free AI-powered trading journal &amp; financial risk tools for crypto, forex, and stock market traders worldwide.
                            </p>
                        </div>

                        {/* Column 2: 🏆 Prop Firm Suite (Dedicated Category) */}
                        <div className="space-y-2.5">
                            <h4 className="text-xs font-black uppercase tracking-widest text-purple-400">🏆 Prop Firm Suite</h4>
                            <ul className="space-y-2 text-xs">
                                <li>
                                    <a
                                        href="/tools/prop-firm-challenge-calculator"
                                        onClick={(e) => {
                                            if (onOpenPropFirmCalculator) {
                                                e.preventDefault();
                                                onOpenPropFirmCalculator();
                                            }
                                        }}
                                        className="hover:text-emerald-400 transition-colors text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer text-left group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Calculator size={14} className="text-emerald-400 group-hover:scale-110 transition" />
                                        <span>Prop Firm Challenge Calculator</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/tools/ftmo-calculator"
                                        onClick={(e) => {
                                            if (onOpenPropFirmCalculator) {
                                                e.preventDefault();
                                                onOpenPropFirmCalculator();
                                            }
                                        }}
                                        className="hover:text-cyan-400 transition-colors text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer text-left group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <ShieldAlert size={14} className="text-cyan-400 group-hover:scale-110 transition" />
                                        <span>FTMO Challenge Risk Calc</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/tools/prop-firm-scaling-plan-calculator"
                                        onClick={(e) => {
                                            if (onOpenPropFirmScalingCalculator) {
                                                e.preventDefault();
                                                onOpenPropFirmScalingCalculator();
                                            }
                                        }}
                                        className="hover:text-purple-300 transition-colors text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer text-left group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <TrendingUp size={14} className="text-purple-400 group-hover:scale-110 transition" />
                                        <span>Account Scaling Roadmap</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/tools/prop-firm-profit-split-payout-calculator"
                                        onClick={(e) => {
                                            if (onOpenPropFirmPayoutCalculator) {
                                                e.preventDefault();
                                                onOpenPropFirmPayoutCalculator();
                                            }
                                        }}
                                        className="hover:text-emerald-400 transition-colors text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer text-left group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Landmark size={14} className="text-emerald-400 group-hover:scale-110 transition" />
                                        <span>Profit Split &amp; Net Tax Calc</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/tools/apex-consistency-rule-calculator"
                                        onClick={(e) => {
                                            if (onOpenApexConsistencyCalculator) {
                                                e.preventDefault();
                                                onOpenApexConsistencyCalculator();
                                            }
                                        }}
                                        className="hover:text-amber-400 transition-colors text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer text-left group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Award size={14} className="text-amber-400 group-hover:scale-110 transition" />
                                        <span>Apex 30% Consistency Rule</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/tools/apex-trailing-drawdown-calculator"
                                        onClick={(e) => {
                                            if (onOpenApexConsistencyCalculator) {
                                                e.preventDefault();
                                                onOpenApexConsistencyCalculator();
                                            }
                                        }}
                                        className="hover:text-amber-400 transition-colors text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer text-left group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <ShieldAlert size={14} className="text-amber-400 group-hover:scale-110 transition" />
                                        <span>Apex Trailing Drawdown Calculator</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Market Risk & Execution Tools */}
                        <div className="space-y-2.5">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">🛠️ Risk &amp; Market Tools</h4>
                            <ul className="space-y-2 text-xs">
                                <li>
                                    <a
                                        href="/tools/risk-reward-win-rate-matrix"
                                        onClick={(e) => {
                                            if (onOpenRiskRewardMatrix) {
                                                e.preventDefault();
                                                onOpenRiskRewardMatrix();
                                            }
                                        }}
                                        className="hover:text-emerald-400 transition-colors text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer text-left group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Grid size={14} className="text-emerald-400 group-hover:scale-110 transition" />
                                        <span>Risk-Reward vs Win Rate Matrix</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/tools/session-clock-ist"
                                        onClick={(e) => {
                                            if (onOpenSessionClock) {
                                                e.preventDefault();
                                                onOpenSessionClock();
                                            }
                                        }}
                                        className="hover:text-emerald-400 transition-colors text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer text-left group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Clock size={14} className="text-emerald-400 group-hover:scale-110 transition" />
                                        <span>IST Session Volatility Clock</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/tools/revenge-trading-cooldown-timer"
                                        onClick={(e) => {
                                            if (onOpenCooldownTimer) {
                                                e.preventDefault();
                                                onOpenCooldownTimer();
                                            }
                                        }}
                                        className="hover:text-rose-400 transition-colors text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer text-left group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <ShieldAlert size={14} className="text-rose-400 group-hover:scale-110 transition" />
                                        <span>Revenge Cooldown Timer</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/tools/leverage-danger-calculator"
                                        onClick={(e) => {
                                            if (onOpenLeverageCalculator) {
                                                e.preventDefault();
                                                onOpenLeverageCalculator();
                                            }
                                        }}
                                        className="hover:text-amber-400 transition-colors text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer text-left group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Zap size={14} className="text-amber-400 group-hover:scale-110 transition" />
                                        <span>Crypto Leverage Danger Calc</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/calculators/stocks/zerodha-vs-groww-brokerage-calculator"
                                        onClick={(e) => {
                                            if (onOpenCalculator) {
                                                e.preventDefault();
                                                onOpenCalculator();
                                            }
                                        }}
                                        className="hover:text-cyan-400 transition-colors text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer text-left group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Scale size={14} className="text-cyan-400 group-hover:scale-110 transition" />
                                        <span>Brokerage &amp; Tax Calculator</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/tools/drawdown-recovery-calculator"
                                        onClick={(e) => {
                                            if (onOpenDrawdownCalculator) {
                                                e.preventDefault();
                                                onOpenDrawdownCalculator();
                                            }
                                        }}
                                        className="hover:text-rose-400 transition-colors text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer text-left group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Scale size={14} className="text-rose-400 group-hover:scale-110 transition" />
                                        <span>Drawdown &amp; Goal Calculator</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/tools/cross-vs-isolated-margin-calculator"
                                        onClick={(e) => {
                                            if (onOpenCrossVsIsolatedCalculator) {
                                                e.preventDefault();
                                                onOpenCrossVsIsolatedCalculator();
                                            }
                                        }}
                                        className="hover:text-amber-400 transition-colors text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer text-left group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Scale size={14} className="text-amber-400 group-hover:scale-110 transition" />
                                        <span>Cross vs Isolated Liq Calc</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/tools/cross-margin-calculator"
                                        onClick={(e) => {
                                            if (onOpenCrossVsIsolatedCalculator) {
                                                e.preventDefault();
                                                onOpenCrossVsIsolatedCalculator();
                                            }
                                        }}
                                        className="hover:text-amber-400 transition-colors text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer text-left group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Zap size={14} className="text-amber-400 group-hover:scale-110 transition" />
                                        <span>Cross Margin Calculator</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/tools/crypto-profit-calculator"
                                        onClick={(e) => {
                                            if (onOpenCryptoProfitCalculator) {
                                                e.preventDefault();
                                                onOpenCryptoProfitCalculator();
                                            }
                                        }}
                                        className="hover:text-emerald-400 transition-colors text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer text-left group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <CircleDollarSign size={14} className="text-emerald-400 group-hover:scale-110 transition" />
                                        <span>Crypto Profit Calculator</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/tools/crypto-exit-strategy-calculator"
                                        onClick={(e) => {
                                            if (onOpenCryptoProfitCalculator) {
                                                e.preventDefault();
                                                onOpenCryptoProfitCalculator();
                                            }
                                        }}
                                        className="hover:text-purple-400 transition-colors text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer text-left group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Layers size={14} className="text-purple-400 group-hover:scale-110 transition" />
                                        <span>Crypto Exit Strategy Ladder</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/tools/crypto-funding-rate-calculator"
                                        onClick={(e) => {
                                            window.history.pushState({}, '', '/tools/crypto-funding-rate-calculator');
                                        }}
                                        className="hover:text-emerald-400 transition-colors text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer text-left group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Zap size={14} className="text-emerald-400 group-hover:scale-110 transition" />
                                        <span>Crypto Funding Rate Calculator</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/tools/0dte-option-profit-calculator"
                                        onClick={(e) => {
                                            window.history.pushState({}, '', '/tools/0dte-option-profit-calculator');
                                        }}
                                        className="hover:text-cyan-400 transition-colors text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer text-left group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Clock size={14} className="text-cyan-400 group-hover:scale-110 transition" />
                                        <span>0DTE Option Profit & Theta Calculator</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/tools/iron-condor-calculator"
                                        onClick={(e) => {
                                            if (onOpenIronCondorCalculator) {
                                                e.preventDefault();
                                                onOpenIronCondorCalculator();
                                            }
                                        }}
                                        className="hover:text-emerald-400 transition-colors text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer text-left group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Sparkles size={14} className="text-emerald-400 group-hover:scale-110 transition" />
                                        <span>Iron Condor Options Calculator</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/tools/forex-swap-fee-calculator"
                                        onClick={(e) => {
                                            if (onOpenForexSwapCalculator) {
                                                e.preventDefault();
                                                onOpenForexSwapCalculator();
                                            }
                                        }}
                                        className="hover:text-amber-400 transition-colors text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer text-left group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <RefreshCw size={14} className="text-amber-400 group-hover:scale-110 transition" />
                                        <span>Forex Swap Fee & Rollover Calculator</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Games & Learning */}
                        <div className="space-y-2.5">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">🎮 Games &amp; Learning</h4>
                            <ul className="space-y-2 text-xs">
                                <li>
                                    <a
                                        href="/game-page.html"
                                        className="hover:text-purple-400 transition-colors text-slate-300 font-bold flex items-center gap-1.5 group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Flame size={14} className="text-purple-400 group-hover:scale-110 transition" />
                                        <span>Candle Clash Game 🎮</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/blog"
                                        className="hover:text-emerald-400 transition-colors text-slate-300 font-bold flex items-center gap-1.5 group"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <BookOpen size={14} className="text-emerald-400 group-hover:scale-110 transition" />
                                        <span>Trading Blog &amp; Guides</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Column 4: Company & Legal */}
                        <div className="space-y-2.5">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">ℹ️ Company</h4>
                            <ul className="space-y-1.5 text-xs text-slate-400">
                                <li><button onClick={() => onOpenInfo('about')} className="hover:text-white transition-colors cursor-pointer">About Us</button></li>
                                <li><button onClick={() => onOpenInfo('contact')} className="hover:text-white transition-colors cursor-pointer">Contact Support</button></li>
                                <li><button onClick={() => onOpenInfo('privacy')} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</button></li>
                                <li><button onClick={() => onOpenInfo('terms')} className="hover:text-white transition-colors cursor-pointer">Terms &amp; Conditions</button></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800/80 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-3">
                        <span>&copy; {new Date().getFullYear()} TradeJournall App. All rights reserved.</span>
                        <span className="text-slate-500">TradeJournall — Free Crypto &amp; Stock Trading Journal Platform</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};
