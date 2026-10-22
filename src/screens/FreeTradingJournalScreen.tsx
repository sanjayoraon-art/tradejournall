import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Sparkles, ArrowRight, ShieldCheck, CheckCircle2, XCircle, TrendingUp,
    TrendingDown, BarChart3, Brain, Calculator, Scale, Zap, Clock, ShieldAlert,
    ChevronDown, HelpCircle, Check, DollarSign, PieChart, Activity, ExternalLink,
    RefreshCw, Layers, Award, Laptop, Smartphone
} from 'lucide-react';
import { RelatedToolsGrid } from '../components/RelatedToolsGrid';

interface FreeTradingJournalScreenProps {
    theme?: any;
    isDarkMode?: boolean;
    primaryCurrencySymbol?: string;
    onBackToLanding?: () => void;
    onSignIn?: () => void;
    onStartJournaling?: () => void;
}

interface DemoTrade {
    id: string;
    symbol: string;
    asset: 'Crypto' | 'Futures' | 'Forex' | 'Stock';
    type: 'Long' | 'Short';
    entryPrice: string;
    exitPrice: string;
    pnl: number;
    pnlFormatted: string;
    roi: string;
    mentalState: 'Disciplined' | 'FOMO Warning' | 'Patient' | 'Revenge Warning';
    strategy: string;
}

const DEMO_TRADES: DemoTrade[] = [
    {
        id: '1',
        symbol: 'BTC/USDT',
        asset: 'Crypto',
        type: 'Long',
        entryPrice: '$64,200',
        exitPrice: '$67,800',
        pnl: 1800,
        pnlFormatted: '+$1,800.00',
        roi: '+5.61%',
        mentalState: 'Disciplined',
        strategy: 'Key Level Breakout'
    },
    {
        id: '2',
        symbol: 'NQ Futures (E-mini)',
        asset: 'Futures',
        type: 'Short',
        entryPrice: '20,450',
        exitPrice: '20,280',
        pnl: 1700,
        pnlFormatted: '+$1,700.00',
        roi: '+4.15%',
        mentalState: 'Patient',
        strategy: 'London Session Sweep'
    },
    {
        id: '3',
        symbol: 'XAU/USD (Gold)',
        asset: 'Forex',
        type: 'Long',
        entryPrice: '$2,642',
        exitPrice: '$2,668',
        pnl: 1300,
        pnlFormatted: '+$1,300.00',
        roi: '+3.94%',
        mentalState: 'Disciplined',
        strategy: 'Macro Trend Continuation'
    },
    {
        id: '4',
        symbol: 'NVDA',
        asset: 'Stock',
        type: 'Long',
        entryPrice: '$134.50',
        exitPrice: '$131.20',
        pnl: -480,
        pnlFormatted: '-$480.00',
        roi: '-2.45%',
        mentalState: 'FOMO Warning',
        strategy: 'Chased Gap Up'
    }
];

export const FreeTradingJournalScreen: React.FC<FreeTradingJournalScreenProps> = ({
    theme,
    onBackToLanding,
    onSignIn,
    onStartJournaling
}) => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const handleAction = () => {
        if (onStartJournaling) {
            onStartJournaling();
        } else if (onSignIn) {
            onSignIn();
        } else if (onBackToLanding) {
            onBackToLanding();
        }
    };

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const canonicalUrl = 'https://tradejournall.com/tools/free-trading-journal';

    const schemaData = [
        {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "TradeJournall Free Trading Journal",
            "operatingSystem": "All Web Browsers, iOS, Android",
            "applicationCategory": "FinanceApplication",
            "url": canonicalUrl,
            "image": "https://tradejournall.com/logo.png",
            "description": "Free trading journal software for stocks, crypto, forex, and futures traders. Automated P&L calculation, win rate analytics, psychology tags, and 25+ risk tools.",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            }
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Is TradeJournall really a 100% free trading journal?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes! TradeJournall is 100% free forever with no credit card required, no monthly subscription fees, and no artificial trade limits. You get unlimited trade logging, automated P&L calculations, and access to all 25+ quantitative risk calculators."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Why use an online free trading journal instead of Excel or Google Sheets?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Excel spreadsheets require manual formula maintenance, break frequently, and cannot track psychological trading biases. TradeJournall automatically calculates net P&L, risk-to-reward ratios, drawdown recovery, and visualizes your equity curve and P&L calendar in real-time."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How does TradeJournall compare to paid journals like TradeZella or TraderSync?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "TradeZella and TraderSync charge between $20 and $40 per month ($240 to $480 annually). TradeJournall offers core trade analytics, emotional state tracking, and institutional risk calculators completely free with zero monthly fees."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Which asset classes and markets are supported?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "You can journal trades across US Stocks, Indian Equities (NSE/BSE), Options, Cryptocurrency (Binance, Bybit, CoinDCX), Forex (Exness, XM), and Futures/Prop Firms (Apex, FTMO, Topstep)."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Does this free trading journal track emotional psychology and discipline?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes. Every trade entry allows you to log mental state tags like Disciplined, FOMO Warning, Revenge Warning, or Hesitant, helping you spot psychological mistakes before they damage your capital."
                    }
                }
            ]
        }
    ];

    return (
        <div className="w-full max-w-6xl mx-auto space-y-12 pb-20 font-sans text-slate-100">
            {/* SEO Helmet */}
            <Helmet>
                <title>Free Trading Journal 2026 — #1 Free Online Trade Tracker (Stocks, Crypto, Forex) | TradeJournall</title>
                <meta
                    name="description"
                    content="TradeJournall is a 100% free trading journal for stocks, crypto, forex, and futures. Automated P&amp;L tracking, win rate analytics, psychology tags, and 25+ risk tools with zero subscription fees."
                />
                <meta
                    name="keywords"
                    content="free trading journal, trading journal free, best free trading journal, free trading journal software, free trade tracker, crypto trading journal, forex trading journal, stock trading journal, trading journal free online, tradejournall"
                />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:title" content="Free Trading Journal — #1 Free Online Trade Tracker | TradeJournall" />
                <meta property="og:url" content={canonicalUrl} />
                <meta
                    property="og:description"
                    content="The #1 free trading journal software for disciplined traders. Track Stocks, Crypto, Forex, and Futures with automated P&amp;L, psychology tags, and institutional risk tools — 100% free."
                />
                <meta property="twitter:title" content="Free Trading Journal — #1 Free Online Trade Tracker | TradeJournall" />
                <meta
                    property="twitter:description"
                    content="100% free trading journal for stocks, crypto, forex &amp; futures. Auto P&amp;L calculator, risk-reward analysis &amp; psychology tracker — zero subscription fees."
                />
            </Helmet>

            {/* JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />

            {/* Top Breadcrumb & Navigation Bar */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 pt-2">
                <button
                    onClick={onBackToLanding || handleAction}
                    className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 font-semibold transition cursor-pointer"
                >
                    &larr; Back to Overview
                </button>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Sparkles size={12} />
                        100% Free Forever
                    </span>
                </div>
            </div>

            {/* HERO SECTION */}
            <div className="text-center space-y-6 pt-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/10">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>Best Free Trading Journal Software (2026)</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
                    The #1 Free Trading Journal. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                        Stop Paying $30/Month for Spreadsheets.
                    </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    Track every trade across <strong className="text-white">Stocks, Crypto, Forex, and Futures</strong>. Automated P&amp;L calculation, win rate analytics, emotional psychology tracking, and 25+ institutional risk tools — <strong>100% free with zero monthly fees</strong>.
                </p>

                {/* Primary CTA Button */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <button
                        onClick={handleAction}
                        className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-2xl transition-all duration-300 shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center gap-3 text-base sm:text-lg active:scale-95 cursor-pointer"
                    >
                        <Sparkles size={20} className="text-slate-950" />
                        <span>Launch Free Trading Journal</span>
                        <ArrowRight size={20} />
                    </button>
                </div>
                <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span>No Credit Card Required • Instant Free Access • Unlimited Trade Entries</span>
                </p>
            </div>

            {/* LIVE INTERACTIVE DEMO JOURNAL CARD */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            <h2 className="text-xl sm:text-2xl font-bold text-white">Live Journal Preview &amp; Performance Summary</h2>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">
                            Sample multi-asset trading log with automated ROI, R:R calculation, and psychological mistake tagging.
                        </p>
                    </div>
                    <button
                        onClick={handleAction}
                        className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                        <span>Open Live Terminal</span>
                        <ArrowRight size={14} />
                    </button>
                </div>

                {/* Performance Metric Stat Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Net Realized P&amp;L</span>
                        <div className="text-2xl font-black text-emerald-400 mt-1">+$4,320.00</div>
                        <span className="text-[11px] text-emerald-500 font-bold flex items-center gap-1 mt-0.5">
                            <TrendingUp size={12} /> +18.4% Monthly ROI
                        </span>
                    </div>

                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Win Rate</span>
                        <div className="text-2xl font-black text-white mt-1">75.0%</div>
                        <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">3 Wins • 1 Loss</span>
                    </div>

                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Profit Factor</span>
                        <div className="text-2xl font-black text-cyan-400 mt-1">10.0</div>
                        <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">Gross Win / Gross Loss</span>
                    </div>

                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Discipline Rate</span>
                        <div className="text-2xl font-black text-purple-400 mt-1">87.5%</div>
                        <span className="text-[11px] text-purple-400 font-medium mt-0.5 block">Low Emotional Leakage</span>
                    </div>
                </div>

                {/* Table of Demo Trades */}
                <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
                    <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-bold border-b border-slate-800">
                            <tr>
                                <th className="py-3 px-4">Symbol / Pair</th>
                                <th className="py-3 px-4">Side</th>
                                <th className="py-3 px-4">Entry &rarr; Exit</th>
                                <th className="py-3 px-4">Net P&amp;L</th>
                                <th className="py-3 px-4">Strategy</th>
                                <th className="py-3 px-4">Mental State</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                            {DEMO_TRADES.map((trade) => {
                                const isProfit = trade.pnl > 0;
                                return (
                                    <tr key={trade.id} className="hover:bg-slate-800/30 transition">
                                        <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                                            <span>{trade.symbol}</span>
                                            <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                                                {trade.asset}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-black uppercase ${
                                                trade.type === 'Long'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                            }`}>
                                                {trade.type}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 font-mono text-slate-300">
                                            {trade.entryPrice} &rarr; {trade.exitPrice}
                                        </td>
                                        <td className="py-3.5 px-4 font-mono font-black">
                                            <span className={isProfit ? 'text-emerald-400' : 'text-rose-400'}>
                                                {trade.pnlFormatted}
                                            </span>
                                            <span className={`text-[11px] ml-1.5 ${isProfit ? 'text-emerald-500/80' : 'text-rose-500/80'}`}>
                                                ({trade.roi})
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-300">
                                            {trade.strategy}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                                                trade.mentalState === 'Disciplined' || trade.mentalState === 'Patient'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                            }`}>
                                                <Brain size={12} />
                                                {trade.mentalState}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* HEAD-TO-HEAD COMPARISON TABLE */}
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                        TradeJournall vs Paid Trading Journals &amp; Excel
                    </h2>
                    <p className="text-slate-400 text-sm max-w-xl mx-auto">
                        Why pay $360 every year when you can get professional-grade trading analytics for $0?
                    </p>
                </div>

                <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/60 shadow-xl">
                    <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-bold border-b border-slate-800">
                            <tr>
                                <th className="py-4 px-5">Features &amp; Value</th>
                                <th className="py-4 px-5 text-emerald-400 bg-emerald-500/5 font-black text-sm sm:text-base border-x border-emerald-500/20">
                                    TradeJournall (Free)
                                </th>
                                <th className="py-4 px-5">TradeZella</th>
                                <th className="py-4 px-5">TraderSync</th>
                                <th className="py-4 px-5">Excel / Sheets</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/70">
                            <tr className="hover:bg-slate-800/20">
                                <td className="py-3.5 px-5 font-bold text-white">Monthly Subscription</td>
                                <td className="py-3.5 px-5 font-black text-emerald-400 bg-emerald-500/5 border-x border-emerald-500/20 text-sm">
                                    $0 / Month (100% Free)
                                </td>
                                <td className="py-3.5 px-5 text-rose-400 font-bold">$29 - $49 / Mo</td>
                                <td className="py-3.5 px-5 text-rose-400 font-bold">$29.95 - $79.95 / Mo</td>
                                <td className="py-3.5 px-5 text-slate-300">Free</td>
                            </tr>
                            <tr className="hover:bg-slate-800/20">
                                <td className="py-3.5 px-5 font-bold text-white">Annual Cost</td>
                                <td className="py-3.5 px-5 font-black text-emerald-400 bg-emerald-500/5 border-x border-emerald-500/20 text-sm">
                                    $0.00
                                </td>
                                <td className="py-3.5 px-5 text-rose-400 font-bold">$348 - $588 / Year</td>
                                <td className="py-3.5 px-5 text-rose-400 font-bold">$360 - $960 / Year</td>
                                <td className="py-3.5 px-5 text-slate-300">$0.00</td>
                            </tr>
                            <tr className="hover:bg-slate-800/20">
                                <td className="py-3.5 px-5 font-bold text-white">Psychology &amp; Mistake Tagging</td>
                                <td className="py-3.5 px-5 text-emerald-400 bg-emerald-500/5 border-x border-emerald-500/20 font-bold flex items-center gap-1.5">
                                    <CheckCircle2 size={16} /> Included (FOMO, Revenge)
                                </td>
                                <td className="py-3.5 px-5 text-slate-300">Included</td>
                                <td className="py-3.5 px-5 text-slate-300">Included</td>
                                <td className="py-3.5 px-5 text-slate-500">Manual / None</td>
                            </tr>
                            <tr className="hover:bg-slate-800/20">
                                <td className="py-3.5 px-5 font-bold text-white">25+ Integrated Risk Calculators</td>
                                <td className="py-3.5 px-5 text-emerald-400 bg-emerald-500/5 border-x border-emerald-500/20 font-bold">
                                    <span className="flex items-center gap-1.5"><CheckCircle2 size={16} /> Yes (Prop, Futures, Options)</span>
                                </td>
                                <td className="py-3.5 px-5 text-slate-400">Basic only</td>
                                <td className="py-3.5 px-5 text-slate-400">Basic only</td>
                                <td className="py-3.5 px-5 text-rose-400 font-bold flex items-center gap-1"><XCircle size={16} /> No (Manual math)</td>
                            </tr>
                            <tr className="hover:bg-slate-800/20">
                                <td className="py-3.5 px-5 font-bold text-white">Prop Firm Challenge Tools (FTMO/Apex)</td>
                                <td className="py-3.5 px-5 text-emerald-400 bg-emerald-500/5 border-x border-emerald-500/20 font-bold">
                                    <span className="flex items-center gap-1.5"><CheckCircle2 size={16} /> Included Free</span>
                                </td>
                                <td className="py-3.5 px-5 text-slate-300">Included</td>
                                <td className="py-3.5 px-5 text-slate-300">Higher Tier only</td>
                                <td className="py-3.5 px-5 text-rose-400 font-bold flex items-center gap-1"><XCircle size={16} /> None</td>
                            </tr>
                            <tr className="hover:bg-slate-800/20">
                                <td className="py-3.5 px-5 font-bold text-white">Mobile Friendly PWA (iOS &amp; Android)</td>
                                <td className="py-3.5 px-5 text-emerald-400 bg-emerald-500/5 border-x border-emerald-500/20 font-bold">
                                    <span className="flex items-center gap-1.5"><CheckCircle2 size={16} /> Fast Web App</span>
                                </td>
                                <td className="py-3.5 px-5 text-slate-300">Web App</td>
                                <td className="py-3.5 px-5 text-slate-300">Mobile App</td>
                                <td className="py-3.5 px-5 text-rose-400 font-bold flex items-center gap-1"><XCircle size={16} /> Clunky on phones</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 5 CORE VALUE PILLARS */}
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                        Why Disciplined Traders Choose This Free Trading Journal
                    </h2>
                    <p className="text-slate-400 text-sm max-w-xl mx-auto">
                        Five institutional tools built right into your daily trading workflow.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                            <BarChart3 size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Automated P&amp;L &amp; Risk Metrics</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Stop recalculating trade returns manually. Get instant profit factor, average R:R, win/loss streak counters, and net ROI after commissions.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                            <Brain size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Psychology &amp; FOMO Detection</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Tag mental states like Revenge Warning, FOMO, Hesitant, or Disciplined on every trade to isolate which emotion is costing you the most money.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                            <Scale size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">25+ Institutional Calculators</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Directly integrated with Futures Position Sizers, Prop Firm Scaling Roadmaps, Risk of Ruin, 0DTE Option Theta Decay, and Wash Sale tools.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                            <PieChart size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">P&amp;L Calendar &amp; Heatmaps</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Review your entire trading month on a visual calendar heatmap. Spot high-performing trading days and cut out unprofitable session times.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold">
                            <ShieldAlert size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Revenge Trading Cooldown</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Trigger psychological cooldown timers after maximum daily loss thresholds are breached, preventing account-blowing revenge trading loops.
                        </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                            <Laptop size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-white">100% Free Forever</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            No 14-day trials that suddenly ask for your credit card. TradeJournall was engineered by traders for traders to remain completely free.
                        </p>
                    </div>
                </div>
            </div>

            {/* FREQUENTLY ASKED QUESTIONS (FAQ) */}
            <div className="space-y-6 pt-4 border-t border-slate-800">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                        Frequently Asked Questions (FAQ)
                    </h2>
                    <p className="text-slate-400 text-sm">
                        Everything you need to know about TradeJournall's free trading journal.
                    </p>
                </div>

                <div className="space-y-3 max-w-3xl mx-auto">
                    {[
                        {
                            q: "Is TradeJournall really a 100% free trading journal?",
                            a: "Yes! TradeJournall is 100% free forever. There are zero subscriptions, no hidden paywalls, and no credit card required. You get unlimited trade logging, P&L analytics, and full access to all 25+ quantitative risk calculators."
                        },
                        {
                            q: "Why use an online free trading journal instead of Excel or Google Sheets?",
                            a: "Excel spreadsheets require manual formula maintenance, break frequently, cannot attach charts easily, and fail to track psychological trading biases. TradeJournall automatically computes net P&L, risk-to-reward ratios, drawdown recovery, and visualizes your equity curve and P&L calendar in real-time."
                        },
                        {
                            q: "How does TradeJournall compare to paid journals like TradeZella or TraderSync?",
                            a: "TradeZella and TraderSync charge between $20 and $40 per month ($240 to $480 annually). TradeJournall offers core trade analytics, emotional state tracking, and institutional risk calculators completely free with zero monthly fees."
                        },
                        {
                            q: "Which asset classes and markets are supported?",
                            a: "You can journal trades across US Stocks, Indian Equities (NSE/BSE), Options, Cryptocurrency (Binance, Bybit, CoinDCX), Forex (Exness, XM), and Futures/Prop Firms (Apex, FTMO, Topstep)."
                        },
                        {
                            q: "Does this free trading journal track emotional psychology and discipline?",
                            a: "Yes. Every trade entry allows you to log mental state tags like Disciplined, FOMO Warning, Revenge Warning, or Hesitant, helping you spot psychological mistakes before they damage your capital."
                        }
                    ].map((item, idx) => {
                        const isOpen = openFaq === idx;
                        return (
                            <div
                                key={idx}
                                className="border border-slate-800 bg-slate-900/60 rounded-2xl overflow-hidden transition"
                            >
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full text-left px-5 py-4 flex items-center justify-between font-bold text-white hover:text-emerald-400 transition cursor-pointer"
                                >
                                    <span>{item.q}</span>
                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-200 text-slate-400 ${
                                            isOpen ? 'rotate-180 text-emerald-400' : ''
                                        }`}
                                    />
                                </button>
                                {isOpen && (
                                    <div className="px-5 pb-4 pt-1 text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* BOTTOM CALL TO ACTION */}
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 text-center space-y-5 shadow-2xl">
                <h3 className="text-2xl sm:text-4xl font-black text-white">
                    Start Your Free Trading Journal Today
                </h3>
                <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
                    Join thousands of disciplined traders tracking P&amp;L, risk metrics, and emotional state. 100% free forever.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={handleAction}
                        className="px-8 sm:px-10 py-4 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black rounded-2xl transition shadow-xl shadow-emerald-500/30 flex items-center gap-2 cursor-pointer text-base sm:text-lg active:scale-95"
                    >
                        <span>Open Trading Journal</span>
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>

            {/* RELATED TOOLS GRID */}
            <RelatedToolsGrid
                currentToolSlug="/tools/free-trading-journal"
                category="risk"
                title="Explore Integrated Quantitative Trading Calculators"
                subtitle="Pair your trading journal with institutional risk models, prop firm evaluation trackers, and position sizing tools."
            />
        </div>
    );
};
export default FreeTradingJournalScreen;
