import React, { useState, useMemo, useEffect } from 'react';
import {
    Search,
    X,
    Grid,
    TrendingUp,
    TrendingDown,
    ShieldAlert,
    Award,
    Landmark,
    Scale,
    Zap,
    CircleDollarSign,
    Coins,
    RefreshCw,
    Clock,
    Percent,
    Layers,
    Flame,
    Calculator,
    Sparkles,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    ShieldCheck,
    Compass,
    SlidersHorizontal,
    BookOpen,
    Car,
    Receipt
} from 'lucide-react';

export interface ToolDefinition {
    id: string;
    title: string;
    shortTitle?: string;
    path: string;
    screenKey: string;
    category: 'prop-firm' | 'crypto' | 'risk' | 'options' | 'forex' | 'tax';
    categoryLabel: string;
    badge: string;
    badgeColor: 'amber' | 'emerald' | 'cyan' | 'purple' | 'rose' | 'blue';
    description: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    tags: string[];
    featured?: boolean;
}

export const TOOLS_MASTER_LIST: ToolDefinition[] = [
    // 🏆 Prop Firm Suite
    {
        id: 'ftmo-calc',
        title: 'FTMO Challenge & Prop Firm Risk Calculator',
        shortTitle: 'FTMO Risk & Drawdown',
        path: '/tools/ftmo-calculator',
        screenKey: 'prop-firm-calc',
        category: 'prop-firm',
        categoryLabel: 'Prop Firm Suite',
        badge: 'FTMO & Funding Pips',
        badgeColor: 'amber',
        description: 'Calculate safe position & lot sizes to strictly comply with 5% max daily loss limits and 10% maximum trailing drawdown rules.',
        icon: Award,
        tags: ['ftmo', 'prop firm', 'drawdown', 'daily loss', 'lot size', 'funded account', 'challenge', 'topstep'],
        featured: true
    },
    {
        id: 'apex-consistency',
        title: 'Apex & Topstep Consistency Rule Calculator',
        shortTitle: 'Apex 30% Consistency',
        path: '/tools/apex-consistency-rule-calculator',
        screenKey: 'apex-consistency-calc',
        category: 'prop-firm',
        categoryLabel: 'Prop Firm Suite',
        badge: '30% Profit Cap Rule',
        badgeColor: 'amber',
        description: 'Verify 30% single-day profit cap compliance and calculate maximum daily profit threshold to prevent payout disqualification.',
        icon: Flame,
        tags: ['apex', 'topstep', 'consistency', '30% rule', 'profit cap', 'payout', 'prop firm', 'rules'],
        featured: true
    },
    {
        id: 'prop-firm-payout',
        title: 'Prop Firm Profit Split & Net Payout Calculator',
        shortTitle: 'Prop Firm Net Payout',
        path: '/tools/prop-firm-profit-split-payout-calculator',
        screenKey: 'prop-firm-payout-calc',
        category: 'prop-firm',
        categoryLabel: 'Prop Firm Suite',
        badge: '80/20 & 90/10 Splits',
        badgeColor: 'emerald',
        description: 'Compute exact net cash payout after prop firm profit splits (80/20, 90/10), platform performance fees, and income tax withholdings.',
        icon: Coins,
        tags: ['payout', 'profit split', 'ftmo payout', 'funded trader', 'prop firm tax', 'cashout', 'net profit'],
        featured: true
    },
    {
        id: 'prop-firm-scaling',
        title: 'Prop Firm Scaling Plan & Growth Roadmap',
        shortTitle: 'Account Scaling Roadmap',
        path: '/tools/prop-firm-scaling-plan-calculator',
        screenKey: 'prop-firm-scaling-calc',
        category: 'prop-firm',
        categoryLabel: 'Prop Firm Suite',
        badge: '$100K to $2M Plan',
        badgeColor: 'cyan',
        description: 'Forecast account balance milestones, profit targets, and capital doubling timelines across professional funded trader scaling plans.',
        icon: TrendingUp,
        tags: ['scaling plan', 'prop firm scaling', 'capital growth', 'ftmo scale', 'milestones', 'growth roadmap'],
        featured: false
    },

    // 🪙 Crypto & Futures
    {
        id: 'leverage-danger',
        title: 'Crypto Leverage Danger & Margin Call Calculator',
        shortTitle: 'Crypto Leverage Danger (100x)',
        path: '/tools/leverage-danger-calculator',
        screenKey: 'leverage-calc',
        category: 'crypto',
        categoryLabel: 'Crypto & Futures',
        badge: '10x to 100x Danger',
        badgeColor: 'rose',
        description: 'Visual liquidation buffer calculator showing how high leverage rapidly evaporates account equity on small adverse price moves.',
        icon: Zap,
        tags: ['leverage', 'crypto leverage', 'liquidation', 'margin call', 'binance', 'bybit', '100x', 'futures margin'],
        featured: true
    },
    {
        id: 'cross-vs-isolated',
        title: 'Cross vs Isolated Margin Liquidation Calculator',
        shortTitle: 'Cross vs Isolated Margin',
        path: '/tools/cross-vs-isolated-margin-calculator',
        screenKey: 'cross-vs-isolated-calc',
        category: 'crypto',
        categoryLabel: 'Crypto & Futures',
        badge: 'Binance & Bybit',
        badgeColor: 'purple',
        description: 'Compare wallet blowout risks and liquidation prices between Cross Margin and Isolated Margin modes across high-volatility pairs.',
        icon: Scale,
        tags: ['cross margin', 'isolated margin', 'liquidation', 'futures margin', 'binance futures', 'bybit margin'],
        featured: true
    },
    {
        id: 'crypto-profit',
        title: 'Crypto Profit, Tax & Exit Ladder Calculator',
        shortTitle: 'Crypto Exit Ladder',
        path: '/tools/crypto-profit-calculator',
        screenKey: 'crypto-profit-calc',
        category: 'crypto',
        categoryLabel: 'Crypto & Futures',
        badge: 'Staged Exit Ladder',
        badgeColor: 'emerald',
        description: 'Plan stepped limit exit orders, calculate weighted average selling price, and factor in net profit after exchange fees and taxes.',
        icon: CircleDollarSign,
        tags: ['crypto profit', 'exit ladder', 'take profit', 'target price', 'crypto tax', 'exit strategy', 'staged sell'],
        featured: true
    },
    {
        id: 'crypto-funding',
        title: 'Crypto Funding Rate APR & Arbitrage Calculator',
        shortTitle: 'Crypto Funding Rate APR',
        path: '/tools/crypto-funding-rate-calculator',
        screenKey: 'crypto-funding-calc',
        category: 'crypto',
        categoryLabel: 'Crypto & Futures',
        badge: '8-Hour Funding APR',
        badgeColor: 'cyan',
        description: 'Compute annualized yields (APR/APY) from perpetual swap funding rates and delta-neutral cash-and-carry basis trades.',
        icon: Percent,
        tags: ['funding rate', 'crypto funding', 'apr', 'apy', 'cash and carry', 'perpetual swaps', 'binance funding'],
        featured: false
    },
    {
        id: 'dca-calc',
        title: 'Dollar-Cost Averaging (DCA) & Multi-Buy Calculator',
        shortTitle: 'DCA & Multi-Buy Tracker',
        path: '/tools/dca-calculator',
        screenKey: 'dca-calc',
        category: 'crypto',
        categoryLabel: 'Crypto & Futures',
        badge: 'Bitcoin & Stocks DCA',
        badgeColor: 'emerald',
        description: 'Simulate recurring DCA growth for Bitcoin, crypto, and stocks, track multi-buy average entry price including fees, and export CSV.',
        icon: TrendingUp,
        tags: ['dca', 'dollar cost average', 'bitcoin dca', 'crypto accumulation', 'average down', 'recurring buy', 'portfolio'],
        featured: true
    },
    {
        id: 'dividend-snowball',
        title: 'Dividend Snowball & DRIP FIRE Calculator',
        shortTitle: 'Dividend Snowball & FIRE',
        path: '/tools/dividend-snowball-calculator',
        screenKey: 'dividend-snowball-calc',
        category: 'crypto',
        categoryLabel: 'Crypto & Futures',
        badge: 'SCHD & DRIP Compounding',
        badgeColor: 'emerald',
        description: 'Simulate exponential dividend snowball growth, DRIP reinvestment compounding, SCHD ETF yield on cost (YOC), and FIRE milestone dates.',
        icon: Coins,
        tags: ['dividend', 'drip', 'schd', 'snowball', 'fire', 'passive income', 'compound interest', 'wealth'],
        featured: true
    },

    // 🛡️ Risk & Psychology
    {
        id: 'futures-position-size',
        title: 'Futures Position Size Calculator (ES, NQ, Gold)',
        shortTitle: 'Futures Position Size',
        path: '/tools/futures-position-size-calculator',
        screenKey: 'futures-position-size-calc',
        category: 'risk',
        categoryLabel: 'Risk & Psychology',
        badge: 'ES, NQ, Gold & MES',
        badgeColor: 'cyan',
        description: 'Calculate exact contract quantities for E-mini S&P (ES), Nasdaq (NQ), Micro (MES/MNQ), and Gold futures based on tick-based risk budgets.',
        icon: Scale,
        tags: ['futures', 'position size', 'contracts', 'tick value', 'es', 'nq', 'gold futures', 'risk budget', 'lot sizing', 'es position size calculator', 'nq position size calculator', 'micro futures calculator'],
        featured: true
    },
    {
        id: 'risk-of-ruin',
        title: 'Risk of Ruin Calculator (Monte Carlo Simulation)',
        shortTitle: 'Risk of Ruin (Monte Carlo)',
        path: '/tools/risk-of-ruin-calculator',
        screenKey: 'risk-of-ruin-calc',
        category: 'risk',
        categoryLabel: 'Risk & Psychology',
        badge: 'Monte Carlo 150 Paths',
        badgeColor: 'rose',
        description: 'Simulate 150 equity curve paths, Ralph Vince ruin formulas, and continuous variance models to determine your mathematical ruin probability.',
        icon: ShieldAlert,
        tags: ['risk of ruin', 'monte carlo', 'poker variance', 'ruin formula', 'capital preservation', 'math expectancy'],
        featured: true
    },
    {
        id: 'risk-reward',
        title: 'Risk Reward & Win Rate Matrix Calculator',
        shortTitle: 'Risk-Reward vs Win Rate',
        path: '/tools/risk-reward-win-rate-matrix',
        screenKey: 'risk-reward',
        category: 'risk',
        categoryLabel: 'Risk & Psychology',
        badge: 'Mathematical Expectancy',
        badgeColor: 'blue',
        description: 'Interactive heat-map matrix of Risk:Reward ratios versus required breakeven win rates and mathematical trade expectancy in R multiples.',
        icon: Grid,
        tags: ['risk reward', 'win rate', 'expectancy', 'breakeven', 'matrix', 'r multiple', 'edge', 'mathematics'],
        featured: true
    },
    {
        id: 'drawdown-recovery',
        title: 'Drawdown Recovery & Compounding Calculator',
        shortTitle: 'Drawdown Recovery Math',
        path: '/tools/drawdown-recovery-calculator',
        screenKey: 'drawdown-calc',
        category: 'risk',
        categoryLabel: 'Risk & Psychology',
        badge: 'Asymmetric Loss Math',
        badgeColor: 'purple',
        description: 'Calculate the required gain % to recover from trading losses (e.g. 50% loss requires 100% gain) and project compound equity recovery curves.',
        icon: TrendingDown,
        tags: ['drawdown', 'recovery', 'compound growth', 'asymmetric risk', 'loss recovery', 'compounding curve'],
        featured: false
    },
    {
        id: 'revenge-cooldown',
        title: 'Revenge Trade Cooldown Clock & Reset Timer',
        shortTitle: 'Revenge Cooldown Timer',
        path: '/tools/revenge-trading-cooldown-timer',
        screenKey: 'cooldown-timer',
        category: 'risk',
        categoryLabel: 'Risk & Psychology',
        badge: 'Tilt Breaker Protocol',
        badgeColor: 'rose',
        description: 'Enforce mandatory psychological cool-off periods after a stop-loss to eliminate revenge trading, impulsive bets, and emotional tilt.',
        icon: Clock,
        tags: ['revenge trading', 'cooldown timer', 'psychology', 'discipline', 'tilt breaker', 'trading rules'],
        featured: true
    },

    // 📊 Options & Greeks
    {
        id: 'iron-condor',
        title: 'Iron Condor Max Loss & Breakeven Calculator',
        shortTitle: 'Iron Condor Greeks Calc',
        path: '/tools/iron-condor-calculator',
        screenKey: 'iron-condor-calc',
        category: 'options',
        categoryLabel: 'Options & Greeks',
        badge: '4-Leg Option Spread',
        badgeColor: 'blue',
        description: 'Calculate net credit collected, upper & lower breakeven points, margin requirement, probability of profit (POP), and max risk for Iron Condors.',
        icon: Layers,
        tags: ['iron condor', 'options spread', 'greeks', 'breakeven', 'credit spread', 'theta', 'options strategy'],
        featured: true
    },
    {
        id: 'option-theta',
        title: 'Option Buying Theta Decay & 0DTE Calculator',
        shortTitle: '0DTE Theta Decay Clock',
        path: '/tools/0dte-option-profit-calculator',
        screenKey: 'option-theta-calc',
        category: 'options',
        categoryLabel: 'Options & Greeks',
        badge: '0DTE Intraday Decay',
        badgeColor: 'rose',
        description: 'Model hourly time-decay speed, theta acceleration near expiration, and intrinsic vs extrinsic value degradation for index options.',
        icon: Clock,
        tags: ['0dte', 'theta decay', 'options buying', 'intraday theta', 'time decay', 'nifty options', 'spx options'],
        featured: true
    },
    {
        id: 'pcr-sentiment',
        title: 'Nifty & BankNifty PCR Sentiment Bias Gauge',
        shortTitle: 'Put Call Ratio (PCR) Gauge',
        path: '/tools/nifty-pcr-calculator',
        screenKey: 'pcr-calc',
        category: 'options',
        categoryLabel: 'Options & Greeks',
        badge: 'Put-Call Ratio (OI)',
        badgeColor: 'purple',
        description: 'Decode open interest sentiment extremes: oversold bounce reversals (< 0.70) and overbought distribution zones (> 1.30).',
        icon: Percent,
        tags: ['pcr', 'put call ratio', 'nifty pcr', 'sentiment gauge', 'open interest', 'contrarian', 'banknifty'],
        featured: false
    },

    // 💱 Forex & Sessions
    {
        id: 'session-clock',
        title: 'Market Session Volatility Clock (IST & UTC)',
        shortTitle: 'IST Session Clock',
        path: '/tools/session-clock-ist',
        screenKey: 'session-clock',
        category: 'forex',
        categoryLabel: 'Forex & Sessions',
        badge: 'London/NY Overlap',
        badgeColor: 'emerald',
        description: 'Live interactive world market sessions tracker with overlap alerts for Asian, London, and New York trading volatility hours.',
        icon: Clock,
        tags: ['session clock', 'market hours', 'ist time', 'london overlap', 'new york session', 'forex clock', 'volatility'],
        featured: true
    },
    {
        id: 'forex-swap',
        title: 'Forex Swap Fee & Overnight Rollover Calculator',
        shortTitle: 'Forex Swap & Rollover',
        path: '/tools/forex-swap-fee-calculator',
        screenKey: 'forex-swap-calc',
        category: 'forex',
        categoryLabel: 'Forex & Sessions',
        badge: 'Triple Swap Wednesday',
        badgeColor: 'amber',
        description: 'Calculate holding costs, long/short rollover points, interest rate differentials, and Islamic swap-free rules across major FX pairs.',
        icon: RefreshCw,
        tags: ['forex swap', 'rollover fee', 'overnight fee', 'triple swap', 'currency financing', 'forex interest'],
        featured: false
    },

    // 📑 Brokerage & Tax
    {
        id: 'tax-loss-harvesting',
        title: 'Tax Loss Harvesting Calculator (Free)',
        shortTitle: 'Tax Loss Harvesting Calc',
        path: '/tools/tax-loss-harvesting-calculator',
        screenKey: 'tax-loss-harvesting-calc',
        category: 'tax',
        categoryLabel: 'Brokerage & Tax',
        badge: 'Fidelity Alternative KD 28',
        badgeColor: 'emerald',
        description: 'Calculate tax loss harvesting savings, offset STCG/LTCG capital gains, claim up to $3,000 IRS salary deduction, and avoid 30-day wash sales.',
        icon: Scale,
        tags: ['tax loss harvesting', 'fidelity tax loss harvesting calculator', 'calculate tax loss harvesting', 'how to calculate tax loss harvesting', 'tax loss harvest calculator', 'tax-loss harvesting calculator', 'capital gains offset', 'irs schedule d'],
        featured: true
    },
    {
        id: 'wash-sale',
        title: 'Wash Sale Rule Calculator (IRS § 1091)',
        shortTitle: 'Wash Sale Rule Calc',
        path: '/tools/wash-sale-calculator',
        screenKey: 'wash-sale-calc',
        category: 'tax',
        categoryLabel: 'Brokerage & Tax',
        badge: 'IRS 61-Day Window',
        badgeColor: 'emerald',
        description: 'Track disallowed losses, adjusted cost basis, Form 8949 compliance, and the 61-day wash sale window calendar for stocks and crypto.',
        icon: Scale,
        tags: ['wash sale', 'irs 1091', 'tax loss harvesting', 'cost basis', 'disallowed loss', 'tax compliance', 'form 8949'],
        featured: true
    },
    {
        id: 'brokerage-calc',
        title: 'Zerodha vs Groww Brokerage & Tax Calculator',
        shortTitle: 'Brokerage & Tax Calc',
        path: '/calculators/stocks/zerodha-vs-groww-brokerage-calculator',
        screenKey: 'brokerage-calc',
        category: 'tax',
        categoryLabel: 'Brokerage & Tax',
        badge: 'Zerodha vs Groww',
        badgeColor: 'cyan',
        description: 'Calculate exact brokerage charges, STT turnover tax, GST, SEBI charges, stamp duty, and real breakeven point in points.',
        icon: Calculator,
        tags: ['brokerage calculator', 'zerodha vs groww', 'stt charges', 'gst tax', 'stock brokerage', 'angelone', 'taxes'],
        featured: true
    },
    {
        id: 'doordash-tax-calculator',
        title: 'DoorDash Tax Calculator & 1099 Mileage App (2026)',
        shortTitle: 'DoorDash 1099 Tax Calc',
        path: '/tools/doordash-tax-calculator',
        screenKey: 'doordash-tax-calc',
        category: 'tax',
        categoryLabel: 'Brokerage & Tax',
        badge: 'IRS 67¢ Mileage Rate',
        badgeColor: 'rose',
        description: 'Calculate 15.3% self-employment tax, 2026 IRS 67¢/mile deductions, net Schedule C taxable profit, and Form 1040-ES quarterly estimated payments.',
        icon: Car,
        tags: [
            'doordash tax calculator',
            'tax calculator for doordash drivers',
            'doordash taxes calculator',
            'doordash tax calculator app',
            'doordash tax deductions calculator',
            'gig worker tax calculator',
            '1099 delivery driver taxes',
            'mileage tax deduction calculator'
        ],
        featured: true
    }
];

export interface ToolsScreenProps {
    theme?: any;
    isDarkMode?: boolean;
    onBackToLanding: () => void;
    onSignIn?: () => void;
    onNavigateToTool: (route: string, screenKey: string) => void;
}

export const ToolsScreen: React.FC<ToolsScreenProps> = ({
    theme,
    isDarkMode = true,
    onBackToLanding,
    onSignIn,
    onNavigateToTool
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'prop-firm' | 'crypto' | 'risk' | 'options' | 'forex' | 'tax'>('all');
    const [sortBy, setSortBy] = useState<'featured' | 'az' | 'category'>('featured');

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'All Free Trading Tools & Financial Calculators | TradeJournall';
    }, []);

    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {
            all: TOOLS_MASTER_LIST.length,
            'prop-firm': 0,
            crypto: 0,
            risk: 0,
            options: 0,
            forex: 0,
            tax: 0
        };
        TOOLS_MASTER_LIST.forEach((tool) => {
            if (counts[tool.category] !== undefined) {
                counts[tool.category]++;
            }
        });
        return counts;
    }, []);

    const filteredTools = useMemo(() => {
        let list = [...TOOLS_MASTER_LIST];

        // 1. Filter by category
        if (selectedCategory !== 'all') {
            list = list.filter((tool) => tool.category === selectedCategory);
        }

        // 2. Filter by search query
        const query = searchQuery.trim().toLowerCase();
        if (query) {
            list = list.filter((tool) => {
                const matchTitle = tool.title.toLowerCase().includes(query);
                const matchShort = tool.shortTitle ? tool.shortTitle.toLowerCase().includes(query) : false;
                const matchDesc = tool.description.toLowerCase().includes(query);
                const matchCategory = tool.categoryLabel.toLowerCase().includes(query);
                const matchBadge = tool.badge.toLowerCase().includes(query);
                const matchTags = tool.tags.some((tag) => tag.toLowerCase().includes(query));
                return matchTitle || matchShort || matchDesc || matchCategory || matchBadge || matchTags;
            });
        }

        // 3. Sort
        if (sortBy === 'az') {
            list.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'category') {
            list.sort((a, b) => a.categoryLabel.localeCompare(b.categoryLabel) || a.title.localeCompare(b.title));
        } else {
            // Featured first, then alphabet
            list.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return a.title.localeCompare(b.title);
            });
        }

        return list;
    }, [selectedCategory, searchQuery, sortBy]);

    const getBadgeStyle = (color: ToolDefinition['badgeColor']) => {
        switch (color) {
            case 'rose':
                return 'bg-rose-500/10 text-rose-400 border-rose-500/25';
            case 'emerald':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
            case 'amber':
                return 'bg-amber-500/10 text-amber-300 border-amber-500/25';
            case 'purple':
                return 'bg-purple-500/10 text-purple-300 border-purple-500/25';
            case 'cyan':
                return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25';
            case 'blue':
            default:
                return 'bg-sky-500/10 text-sky-400 border-sky-500/25';
        }
    };

    const getIconGlow = (color: ToolDefinition['badgeColor']) => {
        switch (color) {
            case 'rose':
                return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
            case 'emerald':
                return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
            case 'amber':
                return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
            case 'purple':
                return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
            case 'cyan':
                return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
            case 'blue':
            default:
                return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
        }
    };

    const quickPopularSearches = ['FTMO', 'Leverage', 'DCA', 'Dividend', 'Options', 'Monte Carlo', 'Wash Sale', 'PCR'];

    return (
        <div className="min-h-screen bg-[#050811] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#050811]/90 border-b border-slate-800/80 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                    {/* Brand & Back Button */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            onClick={onBackToLanding}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer shadow-sm"
                            aria-label="Back to Homepage"
                        >
                            <ArrowLeft size={14} className="text-emerald-400" />
                            <span className="hidden sm:inline">Back to Home</span>
                            <span className="sm:hidden">Home</span>
                        </button>

                        <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

                        <a
                            href="/"
                            onClick={(e) => {
                                e.preventDefault();
                                onBackToLanding();
                            }}
                            className="flex items-center gap-2 text-decoration-none group cursor-pointer"
                        >
                            <img
                                src="/logo.png"
                                alt="TradeJournall Logo"
                                className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 p-0.5 object-contain group-hover:scale-105 transition"
                            />
                            <div className="flex flex-col">
                                <span className="font-extrabold text-base tracking-tight text-white flex items-center">
                                    Trade<span className="text-emerald-400">Journall</span>
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono -mt-1 hidden sm:block">
                                    Quantitative Suite
                                </span>
                            </div>
                        </a>
                    </div>

                    {/* Right Action */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800/80 font-mono">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>22 Quantitative Models</span>
                        </div>

                        {onSignIn && (
                            <button
                                onClick={onSignIn}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 cursor-pointer"
                            >
                                Open Journal
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 px-4 sm:px-6 overflow-hidden border-b border-slate-800/60 bg-gradient-to-b from-[#090e1d] to-[#050811]">
                {/* Background Ambient Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-purple-500/10 blur-3xl pointer-events-none" />
                <div className="absolute top-1/4 right-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-4xl mx-auto text-center space-y-4">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold uppercase tracking-widest shadow-sm">
                        <Sparkles size={13} className="text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
                        <span>100% Free Financial Modeling Engine</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight sm:leading-none">
                        All Quantitative Trading Tools &amp; Calculators
                    </h1>

                    {/* Subtitle */}
                    <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Institutional-grade financial calculators designed for crypto, prop firm, options, and stock traders.
                        Calculate exact position sizes, liquidation safety buffers, and tax compliance — no sign-up required.
                    </p>

                    {/* Search Bar */}
                    <div className="pt-4 max-w-2xl mx-auto">
                        <div className="relative flex items-center">
                            <div className="absolute left-4 text-slate-400 pointer-events-none">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search all tools (e.g., FTMO, leverage, DCA, wash sale, options, PCR)..."
                                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-slate-500 text-sm font-medium transition shadow-xl"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                                    aria-label="Clear Search"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Popular Quick-Search Suggestions */}
                        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-3 text-xs text-slate-400">
                            <span className="text-slate-500 text-[11px] font-semibold">Popular:</span>
                            {quickPopularSearches.map((term) => (
                                <button
                                    key={term}
                                    onClick={() => setSearchQuery(term)}
                                    className={`px-2 py-0.5 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                                        searchQuery.toLowerCase() === term.toLowerCase()
                                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                                    }`}
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
                {/* Controls Bar: Category Tabs & Sort */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
                    {/* Category Filter Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                        {[
                            { id: 'all', label: 'All Tools', count: categoryCounts.all },
                            { id: 'prop-firm', label: '🏆 Prop Firm', count: categoryCounts['prop-firm'] },
                            { id: 'crypto', label: '🪙 Crypto & Futures', count: categoryCounts.crypto },
                            { id: 'risk', label: '🛡️ Risk & Math', count: categoryCounts.risk },
                            { id: 'options', label: '📊 Options & Greeks', count: categoryCounts.options },
                            { id: 'forex', label: '💱 Forex & Sessions', count: categoryCounts.forex },
                            { id: 'tax', label: '📑 Tax & Brokerage', count: categoryCounts.tax }
                        ].map((tab) => {
                            const isActive = selectedCategory === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setSelectedCategory(tab.id as any)}
                                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                                        isActive
                                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                                            : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    <span
                                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                                            isActive
                                                ? 'bg-slate-950/30 text-slate-950 font-black'
                                                : 'bg-slate-800 text-slate-400'
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Sort & Counter Status */}
                    <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0">
                        <span className="text-xs text-slate-400 font-mono">
                            Showing <strong className="text-white">{filteredTools.length}</strong> of{' '}
                            {TOOLS_MASTER_LIST.length}
                        </span>

                        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-xl px-2.5 py-1 text-xs">
                            <SlidersHorizontal size={13} className="text-slate-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="bg-transparent text-slate-300 font-medium focus:outline-none cursor-pointer"
                            >
                                <option value="featured" className="bg-slate-900 text-white">Featured First</option>
                                <option value="az" className="bg-slate-900 text-white">Alphabetical (A - Z)</option>
                                <option value="category" className="bg-slate-900 text-white">By Category</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tools Grid */}
                {filteredTools.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredTools.map((tool) => {
                            const IconComponent = tool.icon;
                            return (
                                <div
                                    key={tool.id}
                                    onClick={() => onNavigateToTool(tool.path, tool.screenKey)}
                                    className="group relative flex flex-col justify-between bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800/90 hover:border-emerald-500/50 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 cursor-pointer overflow-hidden"
                                >
                                    {/* Top Corner Glow on Hover */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/0 group-hover:bg-emerald-500/10 rounded-full blur-2xl transition duration-500 pointer-events-none" />

                                    <div className="space-y-4">
                                        {/* Card Header: Icon + Category Badge */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm ${getIconGlow(tool.badgeColor)}`}>
                                                <IconComponent size={22} />
                                            </div>

                                            <div className="flex flex-col items-end gap-1.5">
                                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${getBadgeStyle(tool.badgeColor)}`}>
                                                    {tool.badge}
                                                </span>
                                                <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                                                    {tool.categoryLabel}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Title & Description */}
                                        <div className="space-y-2">
                                            <h3 className="font-extrabold text-base sm:text-lg text-white group-hover:text-emerald-300 transition-colors tracking-tight leading-snug">
                                                {tool.title}
                                            </h3>
                                            <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                                                {tool.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Card Footer: Tags & Action Button */}
                                    <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {tool.tags.slice(0, 2).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-[10px] bg-slate-950/80 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-400 group-hover:text-emerald-300 group-hover:translate-x-1 transition-all shrink-0">
                                            <span>Launch</span>
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty Search State */
                    <div className="py-16 text-center space-y-4 max-w-md mx-auto bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                            <Search size={24} />
                        </div>
                        <h4 className="text-lg font-extrabold text-white">No tools found</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            No tools matched your search query <strong className="text-white">"{searchQuery}"</strong> in the selected category.
                        </p>
                        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                }}
                                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
                            >
                                Clear Filters &amp; Search
                            </button>
                        </div>
                    </div>
                )}

                {/* Informational SEO & Value Section */}
                <section className="mt-16 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-10 space-y-8">
                    <div className="max-w-3xl space-y-2">
                        <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
                            <ShieldCheck size={16} />
                            <span>Why Traders Use TradeJournall Quantitative Tools</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-white">
                            Zero Cost, Zero Signup, Pure Mathematical Precision
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                            Most trading platforms hide basic risk calculations behind expensive monthly paywalls. TradeJournall provides institutional-grade mathematical models 100% free with complete privacy — your calculation data never leaves your browser.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                <CheckCircle2 size={16} className="text-emerald-400" />
                                <span>Prop Firm Evaluation Shield</span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Avoid account disqualifications with the Apex 30% consistency rule, FTMO daily loss limits, and profit split calculators.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                <CheckCircle2 size={16} className="text-purple-400" />
                                <span>High Leverage Liquidation Math</span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Visualize your true bankruptcy price across Cross and Isolated Margin modes on Binance, Bybit, and OKX before opening 100x leverage.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                <CheckCircle2 size={16} className="text-cyan-400" />
                                <span>Options Greeks &amp; Volatility Clocks</span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Model 0DTE intraday theta erosion, calculate Iron Condor breakevens, and sync with live London/New York session overlaps.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full py-10 text-xs border-t border-slate-800/80 bg-[#050811] text-slate-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="TradeJournall Logo" className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 p-0.5 object-contain" />
                        <span className="font-bold text-slate-300">TradeJournall Quantitative Suite</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400">
                        <button onClick={onBackToLanding} className="hover:text-white transition cursor-pointer">Landing Page</button>
                        <a href="/blog" className="hover:text-white transition" style={{ textDecoration: 'none' }}>Trading Blog</a>
                        <a href="/game-page.html" className="hover:text-white transition" style={{ textDecoration: 'none' }}>Candle Clash 🎮</a>
                    </div>
                    <span>&copy; {new Date().getFullYear()} TradeJournall App. All rights reserved.</span>
                </div>
            </footer>
        </div>
    );
};
