import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Calculator, DollarSign, ArrowRight, ShieldCheck, ShieldAlert,
    CheckCircle2, AlertTriangle, HelpCircle, ChevronDown, Copy, Check,
    Sparkles, RefreshCw, FileText, Share2, Info, ArrowLeft, ArrowUpRight,
    TrendingDown, TrendingUp, BookOpen, Scale, Clock, Eye, Plus, Trash2,
    PieChart, Landmark, Percent, Zap, Award, ExternalLink, Target,
    SlidersHorizontal, Layers, CheckCircle, Table, BarChart3, AlertOctagon
} from 'lucide-react';
import { RelatedToolsGrid } from '../components/RelatedToolsGrid';

export interface StockAverageCalculatorScreenProps {
    theme?: any;
    isDarkMode?: boolean;
    primaryCurrencySymbol?: string;
    onBackToLanding?: () => void;
    onSignIn?: () => void;
}

interface PurchaseLot {
    id: string;
    shares: number;
    price: number;
    fee: number;
}

interface PresetScenario {
    id: string;
    title: string;
    badge: string;
    description: string;
    symbol: string;
    cmp: number;
    currency: string;
    lots: PurchaseLot[];
}

const PRESET_SCENARIOS: PresetScenario[] = [
    {
        id: 'dip-buying-tech',
        title: 'Tech Dip Buying (NVDA / AAPL)',
        badge: 'Popular Strategy',
        description: 'First entered near resistance, then averaged down aggressively during market pullback.',
        symbol: 'NVDA',
        cmp: 128.50,
        currency: '$',
        lots: [
            { id: '1', shares: 50, price: 142.00, fee: 0 },
            { id: '2', shares: 75, price: 122.00, fee: 0 },
            { id: '3', shares: 100, price: 112.50, fee: 0 }
        ]
    },
    {
        id: 'value-turnaround',
        title: 'Deep Value Scale-In (3 Tranches)',
        badge: 'Classic Value',
        description: 'Buying in 3 staged tranches as a turnaround stock bottoms out before recovery.',
        symbol: 'PYPL',
        cmp: 64.00,
        currency: '$',
        lots: [
            { id: '1', shares: 100, price: 82.00, fee: 0 },
            { id: '2', shares: 150, price: 68.00, fee: 0 },
            { id: '3', shares: 250, price: 58.00, fee: 0 }
        ]
    },
    {
        id: 'indian-bluechip',
        title: 'Indian Bluechip (Reliance / Tata)',
        badge: 'NSE / BSE',
        description: 'Accumulating quality large-caps across standard brokerage delivery orders.',
        symbol: 'RELIANCE',
        cmp: 2840.00,
        currency: '₹',
        lots: [
            { id: '1', shares: 25, price: 3100.00, fee: 20 },
            { id: '2', shares: 40, price: 2850.00, fee: 20 },
            { id: '3', shares: 60, price: 2680.00, fee: 20 }
        ]
    },
    {
        id: 'growth-etf-dca',
        title: 'Index ETF DCA (VOO / QQQ)',
        badge: 'Passive Long-Term',
        description: 'Monthly scheduled buys accumulating total market exposure over time.',
        symbol: 'VOO',
        cmp: 535.00,
        currency: '$',
        lots: [
            { id: '1', shares: 15, price: 495.00, fee: 0 },
            { id: '2', shares: 15, price: 512.00, fee: 0 },
            { id: '3', shares: 20, price: 528.00, fee: 0 }
        ]
    }
];

const FAQ_ITEMS = [
    {
        q: 'What is a stock average calculator and how does it work?',
        a: 'A stock average calculator computes the blended, weighted average price per share across multiple separate purchase orders. Instead of simply adding purchase prices and dividing by the number of transactions (which is mathematically incorrect), it weights each purchase price by the exact number of shares bought in that lot.'
    },
    {
        q: 'What is the formula to calculate stock average price?',
        a: 'The formula for weighted stock average price is: Average Price = (Total Capital Invested across all buys + Total Brokerage Fees) ÷ (Total Shares Purchased). Mathematically: Average Price = [(Shares₁ × Price₁) + (Shares₂ × Price₂) + ... + (Sharesₙ × Priceₙ)] ÷ (Shares₁ + Shares₂ + ... + Sharesₙ).'
    },
    {
        q: 'How does the "Target Average Down" calculator work?',
        a: 'The target average solver tells you exactly how many additional shares you must purchase at the current lower market price to pull your overall average price down to a desired target level. The algebraic formula is: Additional Shares = [Existing Shares × (Existing Average - Target Average)] ÷ (Target Average - New Buy Price).'
    },
    {
        q: 'Why is simple average wrong for stocks?',
        a: 'Simple average treats every purchase equally, regardless of size. For example, buying 1 share at $100 and 99 shares at $50 results in a simple average of ($100 + $50) ÷ 2 = $75. However, your real weighted average is ($100 + $4,950) ÷ 100 = $50.50! Calculating simple average instead of weighted average leads to catastrophic errors in breakeven and risk management.'
    },
    {
        q: 'What is the difference between averaging down and averaging up?',
        a: 'Averaging down means buying more shares as the stock price falls, which lowers your breakeven cost basis and reduces the rally required to achieve profit. Averaging up (also called pyramiding) means buying more shares as the stock rises, adding size to winning positions.'
    },
    {
        q: 'Is averaging down a good trading strategy?',
        a: 'Averaging down can be effective for diversified index funds (like S&P 500 ETFs) or fundamentally rock-solid companies experiencing short-term macroeconomic market panics. However, averaging down on speculative, unprofitable, or fundamentally declining stocks (the "Martingale Trap") is extremely dangerous and can lead to 100% portfolio blowups.'
    },
    {
        q: 'How does stock averaging impact taxes and IRS Form 8949 / Schedule D?',
        a: 'For tax reporting in the US, brokers track separate "tax lots" rather than a single pooled average (unless using Average Cost basis for mutual funds). When selling partial positions, you can choose specific lot identification (Specific ID), FIFO (First-In, First-Out), or LIFO to optimize short-term vs long-term capital gains tax.'
    },
    {
        q: 'Can I use this stock average calculator for crypto and forex?',
        a: 'Yes! The mathematical principles of weighted average cost basis and target dollar-cost averaging apply identically to cryptocurrencies (like Bitcoin and Ethereum) and forex pairs.'
    }
];

export const StockAverageCalculatorScreen: React.FC<StockAverageCalculatorScreenProps> = ({
    theme = {
        bg: 'bg-slate-950',
        text: 'text-slate-100',
        card: 'bg-slate-900 border-slate-800',
        input: 'bg-slate-950 border-slate-800 text-slate-100',
        subtext: 'text-slate-400'
    },
    isDarkMode = true,
    primaryCurrencySymbol = '$',
    onBackToLanding,
    onSignIn
}) => {
    // Mode Switcher: 'multi-buy' | 'target-solver'
    const [calcMode, setCalcMode] = useState<'multi-buy' | 'target-solver'>('multi-buy');

    // Currency selection
    const [currency, setCurrency] = useState<string>(primaryCurrencySymbol || '$');

    // Multi-Buy State
    const [stockSymbol, setStockSymbol] = useState<string>('AAPL');
    const [lots, setLots] = useState<PurchaseLot[]>([
        { id: '1', shares: 50, price: 180, fee: 0 },
        { id: '2', shares: 50, price: 150, fee: 0 }
    ]);
    const [currentMarketPrice, setCurrentMarketPrice] = useState<number>(165);

    // Target Solver State
    const [targetExistingShares, setTargetExistingShares] = useState<number>(100);
    const [targetExistingAvg, setTargetExistingAvg] = useState<number>(150);
    const [targetNewPrice, setTargetNewPrice] = useState<number>(100);
    const [targetDesiredAvg, setTargetDesiredAvg] = useState<number>(120);

    // UI State
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
    const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

    // Multi-Buy Calculations
    const multiBuyResults = useMemo(() => {
        let totalShares = 0;
        let totalCost = 0;
        let totalFees = 0;
        let simplePriceSum = 0;

        lots.forEach((lot) => {
            const s = Number(lot.shares) || 0;
            const p = Number(lot.price) || 0;
            const f = Number(lot.fee) || 0;
            totalShares += s;
            totalCost += (s * p) + f;
            totalFees += f;
            simplePriceSum += p;
        });

        const weightedAvgPrice = totalShares > 0 ? totalCost / totalShares : 0;
        const simpleAvgPrice = lots.length > 0 ? simplePriceSum / lots.length : 0;

        const cmp = Number(currentMarketPrice) || 0;
        const currentPortfolioValue = totalShares * cmp;
        const unrealizedPnl = currentPortfolioValue - totalCost;
        const unrealizedPnlPercent = totalCost > 0 ? (unrealizedPnl / totalCost) * 100 : 0;

        // Breakeven distance from CMP
        const breakevenGapPoints = weightedAvgPrice - cmp;
        const breakevenGainRequiredPercent = cmp > 0 ? ((weightedAvgPrice - cmp) / cmp) * 100 : 0;

        // Compare to first buy alone (how much averaging down helped)
        const firstLotPrice = lots[0] ? Number(lots[0].price) || 0 : 0;
        const originalGainRequiredPercent = (cmp > 0 && firstLotPrice > 0)
            ? ((firstLotPrice - cmp) / cmp) * 100
            : 0;
        const breakevenReliefPercent = originalGainRequiredPercent - breakevenGainRequiredPercent;

        return {
            totalShares,
            totalCost,
            totalFees,
            weightedAvgPrice,
            simpleAvgPrice,
            currentPortfolioValue,
            unrealizedPnl,
            unrealizedPnlPercent,
            breakevenGapPoints,
            breakevenGainRequiredPercent,
            firstLotPrice,
            originalGainRequiredPercent,
            breakevenReliefPercent
        };
    }, [lots, currentMarketPrice]);

    // Target Solver Calculations
    const targetSolverResults = useMemo(() => {
        const Q1 = Number(targetExistingShares) || 0;
        const P1 = Number(targetExistingAvg) || 0;
        const P2 = Number(targetNewPrice) || 0;
        const P_target = Number(targetDesiredAvg) || 0;

        let status: 'valid' | 'impossible_low' | 'already_reached' | 'invalid_input' = 'valid';
        let errorMessage = '';
        let additionalSharesNeeded = 0;
        let additionalCashNeeded = 0;
        let newTotalShares = 0;
        let newTotalCost = 0;

        if (Q1 <= 0 || P1 <= 0 || P2 <= 0 || P_target <= 0) {
            status = 'invalid_input';
            errorMessage = 'Please enter positive numbers for all parameters.';
        } else if (P_target <= P2) {
            status = 'impossible_low';
            errorMessage = `Target average (${currency}${P_target.toFixed(2)}) must be higher than your new buy price (${currency}${P2.toFixed(2)}). You cannot mathematically reach an average lower than the lowest price you buy at!`;
        } else if (P_target >= P1) {
            status = 'already_reached';
            errorMessage = `Your desired target average (${currency}${P_target.toFixed(2)}) is equal to or higher than your current average (${currency}${P1.toFixed(2)}). No averaging down is needed.`;
        } else {
            // Formula: Q2 = [Q1 * (P1 - P_target)] / (P_target - P2)
            additionalSharesNeeded = Math.ceil((Q1 * (P1 - P_target)) / (P_target - P2));
            additionalCashNeeded = additionalSharesNeeded * P2;
            newTotalShares = Q1 + additionalSharesNeeded;
            newTotalCost = (Q1 * P1) + additionalCashNeeded;
        }

        return {
            status,
            errorMessage,
            additionalSharesNeeded,
            additionalCashNeeded,
            newTotalShares,
            newTotalCost,
            exactFormulaAvg: newTotalShares > 0 ? newTotalCost / newTotalShares : 0
        };
    }, [targetExistingShares, targetExistingAvg, targetNewPrice, targetDesiredAvg, currency]);

    // Lot handlers
    const addLot = () => {
        const newId = String(Date.now());
        const lastLot = lots[lots.length - 1];
        const lastPrice = lastLot ? Number(lastLot.price) : 100;
        const suggestedPrice = Math.max(1, Math.round(lastPrice * 0.9 * 100) / 100);
        setLots([...lots, { id: newId, shares: 50, price: suggestedPrice, fee: 0 }]);
    };

    const removeLot = (id: string) => {
        if (lots.length <= 1) return;
        setLots(lots.filter((lot) => lot.id !== id));
    };

    const updateLot = (id: string, field: keyof PurchaseLot, value: number) => {
        setLots(
            lots.map((lot) => (lot.id === id ? { ...lot, [field]: value } : lot))
        );
    };

    const applyPreset = (preset: PresetScenario) => {
        setStockSymbol(preset.symbol);
        setCurrency(preset.currency);
        setCurrentMarketPrice(preset.cmp);
        setLots(preset.lots);
    };

    const copySummary = () => {
        const text = `📊 Stock Average Calculation for ${stockSymbol}:
• Total Shares: ${multiBuyResults.totalShares.toLocaleString()}
• Weighted Average Price: ${currency}${multiBuyResults.weightedAvgPrice.toFixed(2)}
• Total Capital Invested: ${currency}${multiBuyResults.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Current Market Price: ${currency}${currentMarketPrice.toFixed(2)}
• Current Portfolio Value: ${currency}${multiBuyResults.currentPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Unrealized P&L: ${multiBuyResults.unrealizedPnl >= 0 ? '+' : ''}${currency}${multiBuyResults.unrealizedPnl.toFixed(2)} (${multiBuyResults.unrealizedPnlPercent.toFixed(2)}%)
• Required Gain to Breakeven: ${multiBuyResults.breakevenGainRequiredPercent <= 0 ? 'In Profit' : `+${multiBuyResults.breakevenGainRequiredPercent.toFixed(2)}%`}
Calculated via TradeJournall Stock Average Calculator: https://tradejournall.com/tools/stock-average-calculator`;

        navigator.clipboard.writeText(text);
        setCopiedSummary(true);
        setTimeout(() => setCopiedSummary(false), 2500);
    };

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans selection:bg-emerald-500/20`}>
            <Helmet>
                <title>Stock Average Calculator – Free Share Average Down Calculator (2026)</title>
                <meta
                    name="description"
                    content="Free stock average calculator and average down calculator. Compute exact weighted average share prices across multiple buys, or find how many shares you need to reach a target average price."
                />
                <meta
                    name="keywords"
                    content="stock average calculator, share average calculator, stock average down calculator, average down calculator, how many shares to buy to average down calculator, share price average calculator, stock average price formula, average down calculator for stocks"
                />
                <link rel="canonical" href="https://tradejournall.com/tools/stock-average-calculator" />

                {/* Open Graph / Social */}
                <meta property="og:title" content="Stock Average Calculator – Free Share Average Down Calculator" />
                <meta property="og:description" content="Calculate weighted average share prices across multiple purchase lots or solve how many shares you need to reach a target average price." />
                <meta property="og:url" content="https://tradejournall.com/tools/stock-average-calculator" />
                <meta property="og:type" content="website" />

                {/* Structured Data Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@graph': [
                            {
                                '@type': 'SoftwareApplication',
                                name: 'Stock Average Calculator & Average Down Solver',
                                operatingSystem: 'All',
                                applicationCategory: 'FinanceApplication',
                                offers: {
                                    '@type': 'Offer',
                                    price: '0.00',
                                    priceCurrency: 'USD'
                                },
                                description: 'Free online stock average calculator and share average down target solver. Calculate weighted cost basis and breakeven recovery.'
                            },
                            {
                                '@type': 'HowTo',
                                name: 'How to Calculate Stock Average Price',
                                description: 'Step-by-step method to compute the weighted average price of shares bought across multiple orders.',
                                step: [
                                    {
                                        '@type': 'HowToStep',
                                        name: 'Step 1: Multiply each lot quantity by purchase price',
                                        text: 'For each buy order, multiply the number of shares by the execution price to find the total cash spent on that order.'
                                    },
                                    {
                                        '@type': 'HowToStep',
                                        name: 'Step 2: Add all order costs together',
                                        text: 'Sum the total cash spent across all buy orders, including any brokerage or transaction fees.'
                                    },
                                    {
                                        '@type': 'HowToStep',
                                        name: 'Step 3: Sum the total number of shares',
                                        text: 'Add together the number of shares bought in each transaction.'
                                    },
                                    {
                                        '@type': 'HowToStep',
                                        name: 'Step 4: Divide total cost by total shares',
                                        text: 'Divide the total invested cost by the total quantity of shares to get your exact weighted average cost per share.'
                                    }
                                ]
                            },
                            {
                                '@type': 'FAQPage',
                                mainEntity: FAQ_ITEMS.map((item) => ({
                                    '@type': 'Question',
                                    name: item.q,
                                    acceptedAnswer: {
                                        '@type': 'Answer',
                                        text: item.a
                                    }
                                }))
                            }
                        ]
                    })}
                </script>
            </Helmet>

            {/* Header Navigation Bar */}
            <div className={`sticky top-0 z-40 ${theme.card} border-b backdrop-blur-md bg-opacity-90 px-4 py-3 sm:px-6`}>
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        {onBackToLanding && (
                            <button
                                onClick={onBackToLanding}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
                            >
                                <ArrowLeft size={14} className="text-emerald-400" />
                                <span className="hidden sm:inline">Back to Tools</span>
                                <span className="sm:hidden">Back</span>
                            </button>
                        )}
                        <a href="/" className="flex items-center gap-2 text-decoration-none">
                            <img
                                src="/logo.png"
                                alt="TradeJournall Logo"
                                className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 p-0.5 object-contain"
                            />
                            <span className="font-extrabold text-base tracking-tight text-white flex items-center">
                                Trade<span className="text-emerald-400">Journall</span>
                            </span>
                        </a>
                        <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">
                            <Sparkles size={11} /> 100% Free Tool
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Currency Selector */}
                        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
                            {['$', '₹', '£', '€'].map((sym) => (
                                <button
                                    key={sym}
                                    onClick={() => setCurrency(sym)}
                                    className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                                        currency === sym
                                            ? 'bg-emerald-500 text-slate-950 shadow-sm'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    {sym}
                                </button>
                            ))}
                        </div>

                        {onSignIn && (
                            <button
                                onClick={onSignIn}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 cursor-pointer"
                            >
                                Open Free Journal
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10">
                
                {/* Hero Title & SEO Description */}
                <div className="text-center sm:text-left space-y-3 max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                        <Scale size={13} className="text-emerald-400" />
                        Weighted Cost Basis &amp; Target Price Solver
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                        Stock Average Calculator
                    </h1>
                    <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                        Calculate your exact <strong className="text-slate-200">weighted average share price</strong> across multiple purchase orders, or use our reverse solver to find <strong className="text-emerald-400">how many shares you need to buy to average down</strong> to your target breakeven price.
                    </p>
                </div>

                {/* Preset Scenarios Strip */}
                <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Zap size={13} className="text-amber-400" /> Quick Preset Scenarios:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {PRESET_SCENARIOS.map((preset) => (
                            <button
                                key={preset.id}
                                onClick={() => {
                                    setCalcMode('multi-buy');
                                    applyPreset(preset);
                                }}
                                className="text-left p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850 transition group cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                        {preset.badge}
                                    </span>
                                    <span className="text-xs font-mono font-bold text-white group-hover:text-emerald-300">
                                        {preset.symbol}
                                    </span>
                                </div>
                                <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition">
                                    {preset.title}
                                </h4>
                                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                                    {preset.description}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Calculator Mode Switcher Toggle */}
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <button
                        onClick={() => setCalcMode('multi-buy')}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            calcMode === 'multi-buy'
                                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                        }`}
                    >
                        <Calculator size={14} />
                        <span>Mode 1: Multi-Buy Stock Average Calculator</span>
                    </button>
                    <button
                        onClick={() => setCalcMode('target-solver')}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            calcMode === 'target-solver'
                                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                        }`}
                    >
                        <Target size={14} />
                        <span>Mode 2: Target Average Down Solver ("How Many Shares to Buy?")</span>
                    </button>
                </div>

                {/* ========================================================================= */}
                {/* CALCULATOR WIDGET SECTION                                                 */}
                {/* ========================================================================= */}
                {calcMode === 'multi-buy' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left Column: Input Form (7 cols) */}
                        <div className="lg:col-span-7 space-y-5">
                            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
                                {/* Top Controls: Symbol & Current Market Price */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                                    <div>
                                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                            Stock Ticker / Asset Name
                                        </label>
                                        <input
                                            type="text"
                                            value={stockSymbol}
                                            onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                                            placeholder="e.g. AAPL, NVDA, RELIANCE"
                                            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-emerald-500 focus:outline-none uppercase w-full sm:w-44"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                            Current Market Price (CMP)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">
                                                {currency}
                                            </span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="any"
                                                value={currentMarketPrice || ''}
                                                onChange={(e) => setCurrentMarketPrice(parseFloat(e.target.value) || 0)}
                                                className="pl-8 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-emerald-500 focus:outline-none w-full sm:w-44"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Purchase Lots List */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Purchased Lots ({lots.length})
                                        </span>
                                        <span className="text-[11px] text-slate-500">
                                            Add as many buy tranches as needed
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {lots.map((lot, index) => (
                                            <div
                                                key={lot.id}
                                                className="p-3.5 sm:p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-3"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                                                        <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 inline-flex items-center justify-center text-[10px]">
                                                            {index + 1}
                                                        </span>
                                                        Buy Order #{index + 1}
                                                    </span>

                                                    {lots.length > 1 && (
                                                        <button
                                                            onClick={() => removeLot(lot.id)}
                                                            className="text-slate-500 hover:text-rose-400 transition p-1 cursor-pointer"
                                                            title="Remove this buy order"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    {/* Shares */}
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                                                            Quantity (Shares)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={lot.shares || ''}
                                                            onChange={(e) => updateLot(lot.id, 'shares', parseFloat(e.target.value) || 0)}
                                                            placeholder="50"
                                                            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-xs font-bold focus:border-emerald-500 focus:outline-none"
                                                        />
                                                    </div>

                                                    {/* Purchase Price */}
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                                                            Buy Price ({currency})
                                                        </label>
                                                        <div className="relative">
                                                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">
                                                                {currency}
                                                            </span>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="any"
                                                                value={lot.price || ''}
                                                                onChange={(e) => updateLot(lot.id, 'price', parseFloat(e.target.value) || 0)}
                                                                placeholder="150"
                                                                className="w-full pl-7 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-xs font-bold focus:border-emerald-500 focus:outline-none"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Commission / Fee (Optional) */}
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                                                            Broker Fee ({currency}) <span className="text-slate-600">opt</span>
                                                        </label>
                                                        <div className="relative">
                                                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">
                                                                {currency}
                                                            </span>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="any"
                                                                value={lot.fee || ''}
                                                                onChange={(e) => updateLot(lot.id, 'fee', parseFloat(e.target.value) || 0)}
                                                                placeholder="0"
                                                                className="w-full pl-7 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-xs font-bold focus:border-emerald-500 focus:outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                                                    <span>Subtotal:</span>
                                                    <span className="font-mono font-bold text-slate-200">
                                                        {currency}{((Number(lot.shares) || 0) * (Number(lot.price) || 0) + (Number(lot.fee) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add Lot Button */}
                                    <button
                                        onClick={addLot}
                                        className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-emerald-500/60 bg-slate-950/60 hover:bg-emerald-500/5 text-slate-300 hover:text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                                    >
                                        <Plus size={15} />
                                        <span>Add Another Buy Order (Lot #{lots.length + 1})</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Output Metrics & Analysis (5 cols) */}
                        <div className="lg:col-span-5 space-y-5">
                            {/* Master Result Card */}
                            <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-6">
                                <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                                        <CheckCircle2 size={14} /> Weighted Average Result
                                    </span>
                                    <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                                        {stockSymbol}
                                    </span>
                                </div>

                                {/* Main Average Number */}
                                <div className="space-y-1">
                                    <span className="text-xs text-slate-400 font-medium">
                                        Net Weighted Average Price Per Share
                                    </span>
                                    <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight flex items-baseline gap-1">
                                        <span className="text-emerald-400 text-3xl sm:text-4xl">{currency}</span>
                                        {multiBuyResults.weightedAvgPrice.toFixed(2)}
                                    </div>
                                    <span className="text-[11px] text-slate-500 block">
                                        (Factoring in all {multiBuyResults.totalShares.toLocaleString()} shares &amp; {currency}{multiBuyResults.totalFees.toFixed(2)} brokerage fees)
                                    </span>
                                </div>

                                {/* Key Metrics Grid */}
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                            Total Shares
                                        </span>
                                        <span className="text-base font-mono font-bold text-white">
                                            {multiBuyResults.totalShares.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                            Total Invested
                                        </span>
                                        <span className="text-base font-mono font-bold text-white">
                                            {currency}{multiBuyResults.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>

                                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                            Current Value
                                        </span>
                                        <span className="text-base font-mono font-bold text-white">
                                            {currency}{multiBuyResults.currentPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>

                                    <div className={`p-3 rounded-xl border space-y-1 ${
                                        multiBuyResults.unrealizedPnl >= 0
                                            ? 'bg-emerald-500/10 border-emerald-500/30'
                                            : 'bg-rose-500/10 border-rose-500/30'
                                    }`}>
                                        <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
                                            Unrealized P&amp;L
                                        </span>
                                        <span className={`text-base font-mono font-bold ${
                                            multiBuyResults.unrealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                                        }`}>
                                            {multiBuyResults.unrealizedPnl >= 0 ? '+' : ''}
                                            {currency}{multiBuyResults.unrealizedPnl.toFixed(2)}{' '}
                                            <span className="text-xs">
                                                ({multiBuyResults.unrealizedPnlPercent >= 0 ? '+' : ''}{multiBuyResults.unrealizedPnlPercent.toFixed(1)}%)
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                {/* Breakeven Distance Analysis */}
                                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-bold text-slate-300 flex items-center gap-1.5">
                                            <Target size={13} className="text-cyan-400" /> Breakeven Status
                                        </span>
                                        <span className="font-mono font-bold text-slate-400">
                                            CMP: {currency}{Number(currentMarketPrice || 0).toFixed(2)}
                                        </span>
                                    </div>

                                    {multiBuyResults.breakevenGainRequiredPercent <= 0 ? (
                                        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                                            <CheckCircle size={15} className="text-emerald-400 shrink-0" />
                                            <span>You are already in profit! Your position is {currency}{Math.abs(multiBuyResults.breakevenGapPoints).toFixed(2)} above average cost basis.</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-400">Rally required from CMP to breakeven:</span>
                                                <span className="font-mono font-bold text-amber-400">
                                                    +{multiBuyResults.breakevenGainRequiredPercent.toFixed(2)}%
                                                </span>
                                            </div>

                                            {/* Relief Comparison */}
                                            {multiBuyResults.breakevenReliefPercent > 0 && (
                                                <div className="text-[11px] text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 leading-relaxed">
                                                    ✨ <strong>Averaging Down Impact:</strong> Without averaging down, your original buy #{1} (@ {currency}{multiBuyResults.firstLotPrice.toFixed(2)}) required a <strong>+{multiBuyResults.originalGainRequiredPercent.toFixed(1)}%</strong> rally to breakeven. You reduced your breakeven hurdle by <strong>{multiBuyResults.breakevenReliefPercent.toFixed(1)}%</strong>!
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons: Copy & Journal Funnel */}
                                <div className="space-y-2 pt-2">
                                    <button
                                        onClick={copySummary}
                                        className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                                    >
                                        {copiedSummary ? (
                                            <>
                                                <Check size={14} className="text-emerald-400" />
                                                <span className="text-emerald-400">Copied to Clipboard!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={14} />
                                                <span>Copy Calculation Breakdown</span>
                                            </>
                                        )}
                                    </button>

                                    {onSignIn && (
                                        <button
                                            onClick={onSignIn}
                                            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <Sparkles size={14} />
                                            <span>Log Trades in Free Trade Journal</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Target Solver Mode */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left Column: Target Solver Inputs (7 cols) */}
                        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
                            <div>
                                <h3 className="text-lg font-black text-white flex items-center gap-2">
                                    <Target className="text-cyan-400" size={18} />
                                    How Many Shares Do I Need to Buy to Average Down?
                                </h3>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                    Enter your existing position, current lower market price, and the exact target average price you want to achieve.
                                </p>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Existing Shares */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                            1. Existing Shares Owned
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={targetExistingShares || ''}
                                            onChange={(e) => setTargetExistingShares(parseFloat(e.target.value) || 0)}
                                            placeholder="100"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-cyan-500 focus:outline-none"
                                        />
                                        <span className="text-[10px] text-slate-500 mt-1 block">
                                            Number of shares currently held
                                        </span>
                                    </div>

                                    {/* Existing Average Price */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                            2. Current Average Buy Price ({currency})
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">
                                                {currency}
                                            </span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="any"
                                                value={targetExistingAvg || ''}
                                                onChange={(e) => setTargetExistingAvg(parseFloat(e.target.value) || 0)}
                                                placeholder="150"
                                                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>
                                        <span className="text-[10px] text-slate-500 mt-1 block">
                                            Your original purchase price
                                        </span>
                                    </div>

                                    {/* New Buy Price (CMP) */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                            3. New Buy Price / Current Price ({currency})
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">
                                                {currency}
                                            </span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="any"
                                                value={targetNewPrice || ''}
                                                onChange={(e) => setTargetNewPrice(parseFloat(e.target.value) || 0)}
                                                placeholder="100"
                                                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>
                                        <span className="text-[10px] text-slate-500 mt-1 block">
                                            The dipped price you are buying at
                                        </span>
                                    </div>

                                    {/* Desired Target Average */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                            4. Desired Target Average ({currency})
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">
                                                {currency}
                                            </span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="any"
                                                value={targetDesiredAvg || ''}
                                                onChange={(e) => setTargetDesiredAvg(parseFloat(e.target.value) || 0)}
                                                placeholder="120"
                                                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-emerald-500 focus:outline-none"
                                            />
                                        </div>
                                        <span className="text-[10px] text-slate-500 mt-1 block">
                                            Must be between new price &amp; old average
                                        </span>
                                    </div>
                                </div>

                                {/* Mathematical Target Formula Breakdown Box */}
                                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <Layers size={13} className="text-cyan-400" /> Underlying Algebraic Formula:
                                    </span>
                                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 font-mono text-xs text-cyan-300 text-center overflow-x-auto">
                                        Additional Shares = [Existing Shares × (Old Avg - Target Avg)] ÷ (Target Avg - New Price)
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Target Solver Result Card (5 cols) */}
                        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative space-y-6">
                            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                                <Target size={14} /> Target Solver Solution
                            </span>

                            {targetSolverResults.status !== 'valid' ? (
                                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2">
                                    <div className="flex items-center gap-2 font-bold">
                                        <AlertTriangle size={16} className="text-amber-400 shrink-0" />
                                        <span>Calculation Notice</span>
                                    </div>
                                    <p className="leading-relaxed text-[11px]">
                                        {targetSolverResults.errorMessage}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {/* Primary Required Shares Answer */}
                                    <div className="space-y-1">
                                        <span className="text-xs text-slate-400 font-medium">
                                            Additional Shares to Buy @ {currency}{targetNewPrice.toFixed(2)}
                                        </span>
                                        <div className="text-4xl sm:text-5xl font-black text-cyan-400 font-mono tracking-tight">
                                            {targetSolverResults.additionalSharesNeeded.toLocaleString()}
                                            <span className="text-base text-slate-400 font-normal ml-2">shares</span>
                                        </div>
                                    </div>

                                    {/* Cash Required */}
                                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                            Fresh Capital Required
                                        </span>
                                        <div className="text-2xl font-black text-white font-mono">
                                            {currency}{targetSolverResults.additionalCashNeeded.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                    </div>

                                    {/* Post-Buy Summary Table */}
                                    <div className="space-y-2 text-xs">
                                        <span className="font-bold text-slate-300 block">
                                            Resulting Combined Position:
                                        </span>
                                        <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono">
                                            <div className="flex justify-between text-slate-400">
                                                <span>New Total Shares:</span>
                                                <span className="text-white font-bold">{targetSolverResults.newTotalShares.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-slate-400">
                                                <span>Total Cost Invested:</span>
                                                <span className="text-white font-bold">{currency}{targetSolverResults.newTotalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            </div>
                                            <div className="flex justify-between text-emerald-400 pt-1.5 border-t border-slate-800 font-bold">
                                                <span>Achieved Average Price:</span>
                                                <span>{currency}{targetSolverResults.exactFormulaAvg.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Simulation Tip */}
                                    <div className="text-[11px] text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-slate-800 leading-relaxed">
                                        💡 <strong>Tip:</strong> By buying {targetSolverResults.additionalSharesNeeded} shares, you bring your breakeven down from {currency}{targetExistingAvg.toFixed(2)} to {currency}{targetDesiredAvg.toFixed(2)}, making profit recovery significantly faster.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* IN-DEPTH SEO MASTER ARTICLE & EDUCATIONAL GUIDE (PERMANENTLY VISIBLE)     */}
                {/* ========================================================================= */}
                <article className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-10 text-slate-300 text-sm leading-relaxed shadow-2xl">
                    
                    {/* Article Header */}
                    <header className="border-b border-slate-800 pb-6 space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                            <BookOpen size={13} /> Comprehensive Investor Guide 2026
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                            The Complete Guide to Stock Averaging: Formulas, Target Solvers &amp; The Martingale Trap
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-4xl">
                            Whether you are investing in US stocks through Fidelity or Schwab, trading Indian equities via Zerodha and Groww, or accumulating crypto on Binance, calculating your exact weighted average cost basis is the single most critical factor in risk management and portfolio recovery.
                        </p>
                    </header>

                    {/* Section 1: What is Stock Averaging & Why Arithmetic Average is a Fatal Mistake */}
                    <section className="space-y-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                            <Scale className="text-emerald-400" size={20} />
                            <span>1. What is a Stock Average Calculator &amp; Why Simple Averages Fail</span>
                        </h3>
                        <p>
                            When investors buy shares of a stock at multiple price points over time, they need to determine their single combined cost basis per share. Many beginner traders make the catastrophic mistake of calculating a <strong>simple arithmetic average</strong> (adding the prices and dividing by the number of transactions). In financial accounting, this is completely wrong because it ignores lot sizing.
                        </p>
                        <p>
                            A true <strong>Stock Average Calculator</strong> computes the <em>weighted average</em> price. Every dollar and share is weighted proportionally to its transaction volume.
                        </p>

                        {/* Side-by-Side Comparison Table */}
                        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-1 mt-4">
                            <table className="w-full text-xs text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 text-slate-300 bg-slate-900/60">
                                        <th className="p-3.5 font-bold">Calculation Method</th>
                                        <th className="p-3.5 font-bold">Mathematical Formula</th>
                                        <th className="p-3.5 font-bold">Example (Buy 1: 10 @ $100 | Buy 2: 90 @ $50)</th>
                                        <th className="p-3.5 font-bold">Real-World Outcome</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 text-slate-400">
                                    <tr className="hover:bg-slate-900/40">
                                        <td className="p-3.5 font-bold text-rose-400">Simple Arithmetic Average</td>
                                        <td className="p-3.5 font-mono text-[11px]">(P₁ + P₂) ÷ 2</td>
                                        <td className="p-3.5 font-mono">($100 + $50) ÷ 2 = <strong className="text-rose-400">$75.00</strong></td>
                                        <td className="p-3.5 text-rose-300 text-[11px]">FATAL ERROR: Overestimates breakeven hurdle by $20/share!</td>
                                    </tr>
                                    <tr className="hover:bg-slate-900/40 bg-emerald-500/5">
                                        <td className="p-3.5 font-bold text-emerald-400">Weighted Average (Correct)</td>
                                        <td className="p-3.5 font-mono text-[11px]">(Cost₁ + Cost₂) ÷ (Shares₁ + Shares₂)</td>
                                        <td className="p-3.5 font-mono">($1,000 + $4,500) ÷ 100 = <strong className="text-emerald-400">$55.00</strong></td>
                                        <td className="p-3.5 text-emerald-300 text-[11px]">ACCURATE: Your stock turns profitable as soon as it crosses $55.00.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Section 2: Mathematical Formulas (Step-by-Step for AI Overviews) */}
                    <section className="space-y-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                            <Calculator className="text-cyan-400" size={20} />
                            <span>2. The Mathematical Formulas for Stock Averaging</span>
                        </h3>
                        <p>
                            To manually calculate your blended average share price across any number of buy orders, follow this standardized 4-step formula:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                    FORMULA 1: MULTI-LOT WEIGHTED AVERAGE
                                </span>
                                <div className="p-3 rounded-xl bg-slate-900 font-mono text-xs text-emerald-300 text-center border border-slate-800 overflow-x-auto">
                                    P_avg = [(Q₁ × P₁) + (Q₂ × P₂) + ... + (Qₙ × Pₙ) + Fees] ÷ (Q₁ + Q₂ + ... + Qₙ)
                                </div>
                                <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
                                    <li><strong>Q:</strong> Number of shares purchased in that specific order.</li>
                                    <li><strong>P:</strong> Execution purchase price per share.</li>
                                    <li><strong>Fees:</strong> Exchange turnover charges, SEC fees, STT, and broker commissions.</li>
                                </ul>
                            </div>

                            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                                    FORMULA 2: TARGET AVERAGE DOWN SOLVER
                                </span>
                                <div className="p-3 rounded-xl bg-slate-900 font-mono text-xs text-cyan-300 text-center border border-slate-800 overflow-x-auto">
                                    Q_needed = [Q₁ × (P₁ - P_target)] ÷ (P_target - P₂)
                                </div>
                                <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
                                    <li><strong>Q₁:</strong> Current shares currently held in portfolio.</li>
                                    <li><strong>P₁:</strong> Your current blended average purchase price.</li>
                                    <li><strong>P₂:</strong> The current market price at which you will buy more.</li>
                                    <li><strong>P_target:</strong> Desired lower average price you want to reach.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Averaging Down vs. Averaging Up (Pyramiding) */}
                    <section className="space-y-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                            <TrendingUp className="text-amber-400" size={20} />
                            <span>3. Averaging Down vs. Averaging Up: Which Strategy Should You Use?</span>
                        </h3>
                        <p>
                            Both techniques are widely practiced by institutional hedge funds and retail investors, but they serve completely opposite market conditions and psychological profiles:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                                <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                                    <TrendingDown size={16} /> Averaging Down (Cost Basis Reduction)
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Buying additional shares of an asset as its market price declines.
                                </p>
                                <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                                    <li><strong>Objective:</strong> Lower the breakeven price and recover faster during market rebounds.</li>
                                    <li><strong>Best for:</strong> Long-term index funds (S&amp;P 500 VOO, Nasdaq QQQ) and cash-rich bluechips.</li>
                                    <li><strong>Primary Risk:</strong> The "Martingale Trap" — continuing to throw capital into a bankrupting business.</li>
                                </ul>
                            </div>

                            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                                <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                                    <TrendingUp size={16} /> Averaging Up / Pyramiding (Trend Following)
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Buying additional shares of an asset as its market price increases.
                                </p>
                                <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                                    <li><strong>Objective:</strong> Maximize position size in high-momentum winning breakout trades (Jesse Livermore style).</li>
                                    <li><strong>Best for:</strong> Bull market growth stocks, crypto runs, and strong uptrends.</li>
                                    <li><strong>Primary Risk:</strong> Raising your cost basis too high, causing small pullbacks to trigger stop-losses.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: When to Average Down vs The Fatal Martingale Trap */}
                    <section className="space-y-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                            <AlertOctagon className="text-rose-400" size={20} />
                            <span>4. The Dangerous "Martingale Trap" &amp; 4 Rules to Avoid Portfolio Blowups</span>
                        </h3>
                        <p>
                            In casino gambling, the Martingale system dictates doubling your bet after every loss. Many traders subconsciously use this in the stock market by buying twice as many shares each time a stock crashes. <strong>On declining speculative stocks, this guarantees account liquidation.</strong>
                        </p>

                        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-3">
                            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                                ⚠️ Never Average Down on These 4 Categories:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                                    <strong className="text-rose-400 block mb-1">1. Penny &amp; Micro-Cap Stocks</strong>
                                    Companies with negative operating cash flows and recurring share dilution.
                                </div>
                                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                                    <strong className="text-rose-400 block mb-1">2. Leveraged ETFs (3x Bull Funds)</strong>
                                    Instruments with volatility decay (beta slippage) like TQQQ or SOXL during bear markets.
                                </div>
                                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                                    <strong className="text-rose-400 block mb-1">3. Options Contracts (0DTE / Calls)</strong>
                                    Options suffer rapid theta decay and expire worthless; never average down on losing long calls.
                                </div>
                                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                                    <strong className="text-rose-400 block mb-1">4. Structural Business Failures</strong>
                                    Companies losing pricing power, facing accounting fraud, or filing for Chapter 11 bankruptcy.
                                </div>
                            </div>
                        </div>

                        {/* Safe Averaging Checklist */}
                        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2 text-xs">
                            <span className="font-bold text-emerald-400 uppercase tracking-wider block">
                                ✅ The 4 Golden Rules of Safe Stock Averaging:
                            </span>
                            <ol className="list-decimal pl-4 space-y-1.5 text-slate-300">
                                <li><strong>Pre-Plan Capital Allocation:</strong> Never let a single averaging position exceed 15% to 20% of your total net liquid portfolio.</li>
                                <li><strong>Differentiate Market Panic from Company Trouble:</strong> Average down when the whole S&amp;P 500 or Nifty is falling due to rate hikes, NOT when the specific company reports deteriorating revenue.</li>
                                <li><strong>Space Out Purchases by Time or Points:</strong> Do not buy every 1% dip. Space out tranches across key technical support zones (e.g., 200-day moving average, 10% to 15% intervals).</li>
                                <li><strong>Always Keep Cash Reserves:</strong> Maintain at least 15% to 30% dry powder cash so you are never forced to liquidate at market bottoms.</li>
                            </ol>
                        </div>
                    </section>

                    {/* Section 5: Tax Implications & IRS Tax Lots */}
                    <section className="space-y-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                            <Landmark className="text-purple-400" size={20} />
                            <span>5. Tax Implications: Tax Lots, FIFO &amp; The 30-Day Wash Sale Rule</span>
                        </h3>
                        <p>
                            When you average down by purchasing multiple lots of stock, your brokerage account (such as Charles Schwab, Fidelity, Robinhood, or Zerodha) does not merge them into a single indistinguishable block for tax purposes. Each purchase is maintained as a distinct <strong>Tax Lot</strong> with its own cost basis and acquisition date.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                                <span className="font-bold text-white block">FIFO (First-In, First-Out)</span>
                                <p className="text-slate-400 text-[11px] leading-relaxed">
                                    The default IRS accounting method. When you sell shares, the oldest lots are sold first. If you held them for over 1 year, you receive preferential Long-Term Capital Gains (LTCG) tax rates (0%, 15%, or 20%).
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                                <span className="font-bold text-white block">Specific Identification (SpecID)</span>
                                <p className="text-slate-400 text-[11px] leading-relaxed">
                                    You choose exactly which tax lots to sell. You can select highest-cost lots to harvest a capital tax loss and offset capital gains tax on IRS Schedule D.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                                <span className="font-bold text-white block">30-Day Wash Sale Rule (IRS § 1091)</span>
                                <p className="text-slate-400 text-[11px] leading-relaxed">
                                    If you sell a stock lot at a loss and buy substantially identical shares within 30 days before or after the sale, your tax loss deduction is disallowed and added to the cost basis of the new shares.
                                </p>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                            <span className="text-slate-300">
                                Planning year-end tax strategies with your averaged stock losses?
                            </span>
                            <div className="flex items-center gap-2">
                                <a
                                    href="/tools/tax-loss-harvesting-calculator"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.history.pushState({}, '', '/tools/tax-loss-harvesting-calculator');
                                        window.dispatchEvent(new PopStateEvent('popstate'));
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-bold transition text-decoration-none"
                                >
                                    Tax Loss Harvesting Calc →
                                </a>
                                <a
                                    href="/tools/wash-sale-calculator"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.history.pushState({}, '', '/tools/wash-sale-calculator');
                                        window.dispatchEvent(new PopStateEvent('popstate'));
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 font-bold transition text-decoration-none"
                                >
                                    Wash Sale Calc →
                                </a>
                            </div>
                        </div>
                    </section>
                </article>

                {/* ========================================================================= */}
                {/* FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION)                                */}
                {/* ========================================================================= */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 flex items-center gap-2.5">
                            <HelpCircle className="text-emerald-400" size={24} />
                            <span>Frequently Asked Questions About Stock Averaging</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400">
                            Clear, authoritative answers designed for Google AI Overviews and retail investors.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {FAQ_ITEMS.map((item, idx) => {
                            const isOpen = openFaqIndex === idx;
                            return (
                                <div
                                    key={idx}
                                    className="rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden transition-colors"
                                >
                                    <button
                                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-emerald-400 transition-colors cursor-pointer"
                                    >
                                        <span>{item.q}</span>
                                        <ChevronDown
                                            className={`w-4 h-4 text-slate-400 transition-transform ${
                                                isOpen ? 'rotate-180 text-emerald-400' : ''
                                            }`}
                                        />
                                    </button>
                                    {isOpen && (
                                        <div className="px-4 sm:px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                                            {item.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* BOTTOM CROSS-LINKING TOOLS REGISTRY                                       */}
                {/* ========================================================================= */}
                <RelatedToolsGrid
                    currentToolSlug="/tools/stock-average-calculator"
                    category="risk"
                />

            </div>
        </div>
    );
};
