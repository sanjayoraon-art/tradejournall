import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Calculator, TrendingUp, TrendingDown, ArrowRight, ShieldCheck, Zap,
    DollarSign, Percent, RefreshCw, CheckCircle2, ChevronDown, HelpCircle,
    Sparkles, Scale, Layers, Award, Landmark, Lock, Plus, Share2, Check,
    Coins, Wallet, CircleDollarSign, ArrowUpRight, Info, AlertTriangle, ArrowLeft
} from 'lucide-react';

export interface IronCondorCalculatorScreenProps {
    theme?: any;
    isDarkMode?: boolean;
    primaryCurrencySymbol?: string;
    onBackToLanding?: () => void;
    onSignIn?: () => void;
    onLogTrade?: (trade: {
        symbol: string;
        entryPrice: number;
        exitPrice: number;
        pnl: number;
        type: 'Long' | 'Short';
    }) => void;
}

interface IndexPreset {
    name: string;
    underlying: string;
    underlyingPrice: number;
    longPut: number;
    shortPut: number;
    shortCall: number;
    longCall: number;
    netPremium: number;
    lotSize: number;
    currency: string;
}

const PRESETS: IndexPreset[] = [
    {
        name: 'SPY US Options (100 Shares)',
        underlying: 'SPY',
        underlyingPrice: 580,
        longPut: 565,
        shortPut: 570,
        shortCall: 590,
        longCall: 595,
        netPremium: 1.85,
        lotSize: 100,
        currency: '$'
    },
    {
        name: 'Bitcoin Crypto Options (Deribit/Delta)',
        underlying: 'BTC/USD',
        underlyingPrice: 95000,
        longPut: 88000,
        shortPut: 90000,
        shortCall: 100000,
        longCall: 102000,
        netPremium: 450,
        lotSize: 1,
        currency: '$'
    },
    {
        name: 'Ethereum Crypto Options',
        underlying: 'ETH/USD',
        underlyingPrice: 2700,
        longPut: 2400,
        shortPut: 2500,
        shortCall: 2900,
        longCall: 3000,
        netPremium: 22,
        lotSize: 1,
        currency: '$'
    },
    {
        name: 'Nifty 50 Index Options (NSE)',
        underlying: 'NIFTY 50',
        underlyingPrice: 25000,
        longPut: 24500,
        shortPut: 24700,
        shortCall: 25300,
        longCall: 25500,
        netPremium: 45,
        lotSize: 25,
        currency: '₹'
    }
];

export const IronCondorCalculatorScreen: React.FC<IronCondorCalculatorScreenProps> = ({
    theme,
    isDarkMode = true,
    primaryCurrencySymbol = '$',
    onBackToLanding,
    onSignIn,
    onLogTrade,
}) => {
    // Strategy: Short Iron Condor (Credit) vs Long Iron Condor (Debit)
    const [strategyType, setStrategyType] = useState<'short' | 'long'>('short');

    // Asset details
    const [assetName, setAssetName] = useState<string>('SPY');
    const [underlyingPrice, setUnderlyingPrice] = useState<number>(580);
    const [currency, setCurrency] = useState<string>('$');

    // Strike Prices
    const [longPutStrike, setLongPutStrike] = useState<number>(565);
    const [shortPutStrike, setShortPutStrike] = useState<number>(570);
    const [shortCallStrike, setShortCallStrike] = useState<number>(590);
    const [longCallStrike, setLongCallStrike] = useState<number>(595);

    // Premium & Contracts
    const [netPremium, setNetPremium] = useState<number>(1.85); // per share/unit
    const [lotSize, setLotSize] = useState<number>(100);
    const [numContracts, setNumContracts] = useState<number>(1);

    // UI States
    const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    // Apply Preset
    const applyPreset = (preset: IndexPreset) => {
        setAssetName(preset.underlying);
        setUnderlyingPrice(preset.underlyingPrice);
        setLongPutStrike(preset.longPut);
        setShortPutStrike(preset.shortPut);
        setShortCallStrike(preset.shortCall);
        setLongCallStrike(preset.longCall);
        setNetPremium(preset.netPremium);
        setLotSize(preset.lotSize);
        setCurrency(preset.currency);
    };

    // Calculations
    const calculations = useMemo(() => {
        // Strike Spreads
        const putSpreadWidth = Math.max(0, shortPutStrike - longPutStrike);
        const callSpreadWidth = Math.max(0, longCallStrike - shortCallStrike);
        const maxSpreadWidth = Math.max(putSpreadWidth, callSpreadWidth);

        const totalMultiplier = lotSize * numContracts;

        if (strategyType === 'short') {
            // Short Iron Condor (Net Credit)
            const maxProfitPerUnit = netPremium;
            const maxLossPerUnit = Math.max(0, maxSpreadWidth - netPremium);

            const totalMaxProfit = maxProfitPerUnit * totalMultiplier;
            const totalMaxLoss = maxLossPerUnit * totalMultiplier;

            const lowerBreakeven = shortPutStrike - netPremium;
            const upperBreakeven = shortCallStrike + netPremium;

            const returnOnRiskPercent = totalMaxLoss > 0 ? (totalMaxProfit / totalMaxLoss) * 100 : 0;
            const riskRewardRatio = totalMaxProfit > 0 ? (totalMaxLoss / totalMaxProfit).toFixed(2) : '0';

            return {
                putSpreadWidth,
                callSpreadWidth,
                maxSpreadWidth,
                maxProfitPerUnit,
                maxLossPerUnit,
                totalMaxProfit,
                totalMaxLoss,
                lowerBreakeven,
                upperBreakeven,
                returnOnRiskPercent,
                riskRewardRatio,
                isValidOrder: longPutStrike < shortPutStrike && shortPutStrike < shortCallStrike && shortCallStrike < longCallStrike
            };
        } else {
            // Long Iron Condor (Net Debit)
            const maxLossPerUnit = netPremium;
            const maxProfitPerUnit = Math.max(0, maxSpreadWidth - netPremium);

            const totalMaxProfit = maxProfitPerUnit * totalMultiplier;
            const totalMaxLoss = maxLossPerUnit * totalMultiplier;

            const lowerBreakeven = longPutStrike + netPremium;
            const upperBreakeven = longCallStrike - netPremium;

            const returnOnRiskPercent = totalMaxLoss > 0 ? (totalMaxProfit / totalMaxLoss) * 100 : 0;
            const riskRewardRatio = totalMaxLoss > 0 ? (totalMaxProfit / totalMaxLoss).toFixed(2) : '0';

            return {
                putSpreadWidth,
                callSpreadWidth,
                maxSpreadWidth,
                maxProfitPerUnit,
                maxLossPerUnit,
                totalMaxProfit,
                totalMaxLoss,
                lowerBreakeven,
                upperBreakeven,
                returnOnRiskPercent,
                riskRewardRatio,
                isValidOrder: longPutStrike < shortPutStrike && shortPutStrike < shortCallStrike && shortCallStrike < longCallStrike
            };
        }
    }, [strategyType, longPutStrike, shortPutStrike, shortCallStrike, longCallStrike, netPremium, lotSize, numContracts]);

    // Payoff Diagram SVG Points Generator
    const payoffGraphPoints = useMemo(() => {
        const spreadWidth = calculations.maxSpreadWidth || 10;
        const minX = Math.max(0, longPutStrike - spreadWidth * 2);
        const maxX = longCallStrike + spreadWidth * 2;
        const step = (maxX - minX) / 100;

        const points: { x: number; y: number }[] = [];
        let minY = 0;
        let maxY = 0;

        for (let x = minX; x <= maxX; x += step) {
            let pnlPerUnit = 0;

            if (strategyType === 'short') {
                // Short Iron Condor Payoff
                if (x <= longPutStrike) {
                    pnlPerUnit = -(calculations.maxSpreadWidth - netPremium);
                } else if (x > longPutStrike && x < shortPutStrike) {
                    pnlPerUnit = -(shortPutStrike - x) + netPremium;
                } else if (x >= shortPutStrike && x <= shortCallStrike) {
                    pnlPerUnit = netPremium;
                } else if (x > shortCallStrike && x < longCallStrike) {
                    pnlPerUnit = -(x - shortCallStrike) + netPremium;
                } else {
                    pnlPerUnit = -(calculations.maxSpreadWidth - netPremium);
                }
            } else {
                // Long Iron Condor Payoff
                if (x <= longPutStrike) {
                    pnlPerUnit = calculations.maxSpreadWidth - netPremium;
                } else if (x > longPutStrike && x < shortPutStrike) {
                    pnlPerUnit = (shortPutStrike - x) - netPremium;
                } else if (x >= shortPutStrike && x <= shortCallStrike) {
                    pnlPerUnit = -netPremium;
                } else if (x > shortCallStrike && x < longCallStrike) {
                    pnlPerUnit = (x - shortCallStrike) - netPremium;
                } else {
                    pnlPerUnit = calculations.maxSpreadWidth - netPremium;
                }
            }

            const totalPnl = pnlPerUnit * lotSize * numContracts;
            if (totalPnl < minY) minY = totalPnl;
            if (totalPnl > maxY) maxY = totalPnl;

            points.push({ x, y: totalPnl });
        }

        return { points, minX, maxX, minY, maxY };
    }, [longPutStrike, shortPutStrike, shortCallStrike, longCallStrike, netPremium, lotSize, numContracts, strategyType, calculations.maxSpreadWidth]);

    // Copy Summary Handler
    const handleCopySummary = () => {
        const text = `🦅 Iron Condor Strategy Calculator Summary (${assetName}):
Strategy: ${strategyType === 'short' ? 'Short Iron Condor (Net Credit)' : 'Long Iron Condor (Net Debit)'}
Underlying Price: ${currency}${underlyingPrice}
Strikes: Long Put ${currency}${longPutStrike} | Short Put ${currency}${shortPutStrike} | Short Call ${currency}${shortCallStrike} | Long Call ${currency}${longCallStrike}
Net Premium: ${currency}${netPremium} (${numContracts} contracts, lot size ${lotSize})
-----------------------------------------
🔥 Max Profit: ${currency}${calculations.totalMaxProfit.toLocaleString('en-US', { maximumFractionDigits: 2 })}
🛡️ Max Loss: ${currency}${calculations.totalMaxLoss.toLocaleString('en-US', { maximumFractionDigits: 2 })}
⚖️ Lower Breakeven: ${currency}${calculations.lowerBreakeven.toFixed(2)}
⚖️ Upper Breakeven: ${currency}${calculations.upperBreakeven.toFixed(2)}
📈 Return on Risk: ${calculations.returnOnRiskPercent.toFixed(1)}%
Calculated with TradeJournall (https://tradejournall.com/tools/iron-condor-calculator)`;

        navigator.clipboard.writeText(text);
        setCopiedSummary(true);
        setTimeout(() => setCopiedSummary(false), 2500);
    };

    // Schema JSON-LD for Google Rich Snippets
    const jsonLdSchema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebApplication',
                'name': 'Iron Condor Max Loss & Profit Calculator',
                'url': 'https://tradejournall.com/tools/iron-condor-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'All',
                'browserRequirements': 'Requires JavaScript',
                'description': 'Free online Iron Condor options calculator to compute max loss, max profit, upper/lower breakeven points, and interactive payoff graph for stock & crypto options.',
                'offers': {
                    '@type': 'Offer',
                    'price': '0',
                    'priceCurrency': 'USD'
                }
            },
            {
                '@type': 'FAQPage',
                'mainEntity': [
                    {
                        '@type': 'Question',
                        'name': 'How to calculate max loss on a Short Iron Condor?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'The maximum loss on a Short Iron Condor is calculated as: Max Loss = (Width of Wider Option Spread - Net Credit Received) × Lot Size × Number of Contracts. For example, with a $5 wide spread and $1.50 credit, max loss is ($5.00 - $1.50) × 100 = $350 per contract.'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': 'What are the breakeven points for an Iron Condor?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'An Iron Condor has two breakeven points: Lower Breakeven = Short Put Strike - Net Credit Received, and Upper Breakeven = Short Call Strike + Net Credit Received.'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': 'What is the ideal DTE (Days to Expiration) to trade an Iron Condor?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'Most professional options traders recommend opening a Short Iron Condor at 30 to 45 DTE (Days to Expiration) to maximize theta decay (time decay) while maintaining manageable gamma risk.'
                        }
                    }
                ]
            }
        ]
    };

    const faqs = [
        {
            q: 'How is Maximum Loss calculated on a Short Iron Condor?',
            a: 'Maximum loss occurs when the underlying stock/crypto asset closes beyond either of your long strikes at expiration. The formula is: Max Loss = (Spread Width - Net Credit Received) × Contract Multiplier. Because you bought protective outer options, your maximum loss is strictly capped regardless of how far the market moves.'
        },
        {
            q: 'What is the difference between a Short Iron Condor and a Long Iron Condor?',
            a: 'A Short Iron Condor is a net-credit strategy used when you expect low market volatility and range-bound price action. A Long Iron Condor is a net-debit strategy used when you expect high market volatility and a sharp breakout in either direction.'
        },
        {
            q: 'What are the Upper and Lower Breakeven prices?',
            a: 'For a Short Iron Condor: Lower Breakeven = Short Put Strike - Net Credit Received; Upper Breakeven = Short Call Strike + Net Credit Received. As long as the underlying price stays between these two levels at expiration, the trade is profitable.'
        },
        {
            q: 'When should I manage or adjust an Iron Condor trade?',
            a: 'Option traders typically manage Short Iron Condors at 50% of maximum profit (to lock in gains early) or when the underlying asset tests either of the short strikes (by rolling the untested wing closer or closing the trade to limit losses).'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
            <Helmet>
                <title>Iron Condor Calculator (Max Loss, Profit & Payoff Graph) | TradeJournall</title>
                <meta name="description" content="Free Iron Condor Options Calculator. Calculate maximum loss, max profit, upper/lower breakeven points, return on risk, and interactive payoff visualizer graph." />
                <meta name="keywords" content="iron condor calculator, iron condor max loss calculator, iron condor breakeven calculator, iron condor option calculator, iron condor payoff visualizer, options risk calculator" />
                <link rel="canonical" href="https://tradejournall.com/tools/iron-condor-calculator" />
                <script type="application/ld+json">{JSON.stringify(jsonLdSchema)}</script>
            </Helmet>

            {/* Header Nav */}
            <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <button
                        onClick={onBackToLanding}
                        className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Dashboard</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Sparkles className="w-3.5 h-3.5" /> Options Calculator Tool
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {/* Hero Title */}
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
                        Iron Condor <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Max Loss & Payoff Calculator</span>
                    </h1>
                    <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
                        Calculate exact Maximum Loss, Max Profit, Breakeven Points, and visualize the complete Risk-to-Reward Payoff Graph for US Stocks, Indices & Crypto Options.
                    </p>
                </div>

                {/* Preset Quick Selector */}
                <div className="mb-8">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center sm:text-left">
                        ⚡ Quick Asset Presets:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {PRESETS.map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => applyPreset(preset)}
                                className={`p-3 rounded-xl text-left border transition-all ${assetName === preset.underlying
                                        ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10'
                                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                                    }`}
                            >
                                <div className="font-semibold text-sm truncate">{preset.name}</div>
                                <div className="text-xs text-slate-400 mt-1">
                                    Underlying: {preset.currency}{preset.underlyingPrice}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Grid: Inputs vs Results */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
                    {/* Left Panel: Controls & Input Form (5 Cols) */}
                    <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
                        {/* Strategy Type Switch */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                Strategy Direction
                            </label>
                            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                                <button
                                    onClick={() => setStrategyType('short')}
                                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${strategyType === 'short'
                                            ? 'bg-emerald-500 text-slate-950 shadow-md'
                                            : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    Short Iron Condor (Credit)
                                </button>
                                <button
                                    onClick={() => setStrategyType('long')}
                                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${strategyType === 'long'
                                            ? 'bg-cyan-500 text-slate-950 shadow-md'
                                            : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    Long Iron Condor (Debit)
                                </button>
                            </div>
                        </div>

                        {/* Validation Alert if strikes are unordered */}
                        {!calculations.isValidOrder && (
                            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                                <span>Ensure strikes follow: Long Put &lt; Short Put &lt; Short Call &lt; Long Call</span>
                            </div>
                        )}

                        {/* Underlying Details */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Asset Symbol / Name</label>
                                <input
                                    type="text"
                                    value={assetName}
                                    onChange={(e) => setAssetName(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Current Stock/Crypto Price ({currency})</label>
                                <input
                                    type="number"
                                    value={underlyingPrice}
                                    onChange={(e) => setUnderlyingPrice(Number(e.target.value))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        {/* Strike Prices 4-Leg Inputs */}
                        <div className="space-y-3 pt-2 border-t border-slate-800/80">
                            <span className="block text-xs font-bold uppercase tracking-wider text-emerald-400">
                                🦅 4-Leg Strike Prices ({currency})
                            </span>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">1. Long Put (Lowest Strike)</label>
                                    <input
                                        type="number"
                                        value={longPutStrike}
                                        onChange={(e) => setLongPutStrike(Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">2. Short Put Strike</label>
                                    <input
                                        type="number"
                                        value={shortPutStrike}
                                        onChange={(e) => setShortPutStrike(Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">3. Short Call Strike</label>
                                    <input
                                        type="number"
                                        value={shortCallStrike}
                                        onChange={(e) => setShortCallStrike(Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">4. Long Call (Highest Strike)</label>
                                    <input
                                        type="number"
                                        value={longCallStrike}
                                        onChange={(e) => setLongCallStrike(Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Premium & Quantity */}
                        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Net Premium ({currency})</label>
                                <input
                                    type="number"
                                    step="0.05"
                                    value={netPremium}
                                    onChange={(e) => setNetPremium(Number(e.target.value))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Lot Size</label>
                                <input
                                    type="number"
                                    value={lotSize}
                                    onChange={(e) => setLotSize(Number(e.target.value))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Contracts</label>
                                <input
                                    type="number"
                                    value={numContracts}
                                    onChange={(e) => setNumContracts(Number(e.target.value))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Results & Interactive Payoff Graph (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Summary Metrics Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {/* Max Profit */}
                            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 shadow-lg shadow-emerald-500/5">
                                <div className="text-xs text-slate-400 font-medium flex items-center justify-between mb-1">
                                    <span>Max Profit</span>
                                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                                </div>
                                <div className="text-xl sm:text-2xl font-black text-emerald-400">
                                    {currency}{calculations.totalMaxProfit.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-1">
                                    {strategyType === 'short' ? 'If price stays inside wings' : 'If price breaks wings'}
                                </div>
                            </div>

                            {/* Max Loss */}
                            <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-4 shadow-lg shadow-rose-500/5">
                                <div className="text-xs text-slate-400 font-medium flex items-center justify-between mb-1">
                                    <span>Max Loss</span>
                                    <TrendingDown className="w-4 h-4 text-rose-400" />
                                </div>
                                <div className="text-xl sm:text-2xl font-black text-rose-400">
                                    {currency}{calculations.totalMaxLoss.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-1">
                                    Capped risk limit
                                </div>
                            </div>

                            {/* Lower Breakeven */}
                            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                                <div className="text-xs text-slate-400 font-medium mb-1">Lower Breakeven</div>
                                <div className="text-lg sm:text-xl font-bold text-white">
                                    {currency}{calculations.lowerBreakeven.toFixed(2)}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-1">Short Put - Net Premium</div>
                            </div>

                            {/* Upper Breakeven */}
                            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                                <div className="text-xs text-slate-400 font-medium mb-1">Upper Breakeven</div>
                                <div className="text-lg sm:text-xl font-bold text-white">
                                    {currency}{calculations.upperBreakeven.toFixed(2)}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-1">Short Call + Net Premium</div>
                            </div>
                        </div>

                        {/* Interactive Payoff Visualizer (SVG Graph) */}
                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Layers className="w-5 h-5 text-emerald-400" />
                                    <h3 className="text-base font-bold text-white">Payoff Visualizer Diagram</h3>
                                </div>
                                <div className="flex items-center gap-4 text-xs">
                                    <span className="flex items-center gap-1 text-emerald-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span> Profit Zone</span>
                                    <span className="flex items-center gap-1 text-rose-400"><span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block"></span> Loss Zone</span>
                                </div>
                            </div>

                            {/* SVG Chart Canvas */}
                            <div className="w-full h-64 bg-slate-950 rounded-xl border border-slate-800 p-3 relative overflow-hidden">
                                <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                                    {/* Zero PnL Horizontal Line */}
                                    <line x1="0" y1="100" x2="500" y2="100" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />

                                    {/* Payoff Curve Line */}
                                    {payoffGraphPoints.points.length > 0 && (() => {
                                        const { points, minX, maxX, minY, maxY } = payoffGraphPoints;
                                        const rangeY = (Math.max(Math.abs(minY), Math.abs(maxY)) || 1) * 1.2;

                                        const svgPoints = points.map((p) => {
                                            const svgX = ((p.x - minX) / (maxX - minX)) * 500;
                                            const svgY = 100 - (p.y / rangeY) * 90;
                                            return `${svgX},${svgY}`;
                                        }).join(' ');

                                        return (
                                            <polyline
                                                fill="none"
                                                stroke={strategyType === 'short' ? '#10b981' : '#06b6d4'}
                                                strokeWidth="3"
                                                points={svgPoints}
                                            />
                                        );
                                    })()}
                                </svg>

                                {/* Underlying Price Marker */}
                                <div
                                    className="absolute bottom-2 transform -translate-x-1/2 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30"
                                    style={{
                                        left: `${Math.max(10, Math.min(90, ((underlyingPrice - payoffGraphPoints.minX) / (payoffGraphPoints.maxX - payoffGraphPoints.minX)) * 100))}%`
                                    }}
                                >
                                    Current: {currency}{underlyingPrice}
                                </div>
                            </div>

                            {/* Additional Stats Row */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-xs">
                                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                                    <span className="text-slate-400 block">Risk/Reward Ratio</span>
                                    <span className="text-sm font-bold text-white mt-0.5 block">
                                        1 : {calculations.riskRewardRatio}
                                    </span>
                                </div>
                                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                                    <span className="text-slate-400 block">Return on Risk %</span>
                                    <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
                                        {calculations.returnOnRiskPercent.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                                    <span className="text-slate-400 block">Spread Width</span>
                                    <span className="text-sm font-bold text-white mt-0.5 block">
                                        {currency}{calculations.maxSpreadWidth}
                                    </span>
                                </div>
                            </div>

                            {/* Share & Copy Button */}
                            <div className="mt-5 flex items-center justify-end gap-3">
                                <button
                                    onClick={handleCopySummary}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20"
                                >
                                    {copiedSummary ? <Check className="w-4 h-4 text-slate-950" /> : <Share2 className="w-4 h-4" />}
                                    <span>{copiedSummary ? 'Summary Copied!' : 'Copy Strategy Summary'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comprehensive SEO Content & Educational Article */}
                <article className="mt-16 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-10 max-w-5xl mx-auto space-y-8 text-slate-300 text-sm leading-relaxed">
                    <header className="border-b border-slate-800 pb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                            Complete Guide: How to Calculate Max Loss on an Iron Condor Strategy
                        </h2>
                        <p className="text-slate-400 text-base">
                            An Iron Condor is a multi-leg options trading strategy designed to profit from neutral price action and low market volatility. It consists of four option contracts with the same expiration date: a Bull Put Spread combined with a Bear Call Spread.
                        </p>
                    </header>

                    {/* Formulas Section */}
                    <section className="space-y-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-emerald-400" />
                            Iron Condor Formulas (Max Loss, Profit & Breakeven)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                <h4 className="font-bold text-emerald-400 mb-1">1. Maximum Profit Formula</h4>
                                <code className="block bg-slate-900 p-2 rounded text-xs text-slate-200 mb-2 font-mono">
                                    Max Profit = Net Premium Received × Contract Multiplier
                                </code>
                                <p className="text-xs text-slate-400">
                                    Occurs when the underlying price remains between the Short Put and Short Call strikes at expiration.
                                </p>
                            </div>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                <h4 className="font-bold text-rose-400 mb-1">2. Maximum Loss Formula</h4>
                                <code className="block bg-slate-900 p-2 rounded text-xs text-slate-200 mb-2 font-mono">
                                    Max Loss = (Spread Width - Net Premium) × Contract Multiplier
                                </code>
                                <p className="text-xs text-slate-400">
                                    Occurs when the underlying price closes beyond either the outer Long Put or outer Long Call strikes.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Step by Step Example */}
                    <section className="space-y-3">
                        <h3 className="text-xl font-bold text-white">Step-by-Step Example Calculation</h3>
                        <p>
                            Suppose SPY stock is trading at <strong>$580</strong>. You construct a Short Iron Condor with 30 Days to Expiration (DTE):
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-slate-300 pl-2">
                            <li>Buy 565 Long Put</li>
                            <li>Sell 570 Short Put (Spread Width = $5.00)</li>
                            <li>Sell 590 Short Call (Spread Width = $5.00)</li>
                            <li>Buy 595 Long Call</li>
                        </ul>
                        <p className="pt-2">
                            If you collect a total <strong>Net Credit of $1.50 ($150 total per contract)</strong>:
                        </p>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
                            <div>• <strong>Max Profit:</strong> $1.50 × 100 = <strong>$150.00</strong></div>
                            <div>• <strong>Max Loss:</strong> ($5.00 - $1.50) × 100 = <strong>$350.00</strong></div>
                            <div>• <strong>Lower Breakeven:</strong> 570 - $1.50 = <strong>$568.50</strong></div>
                            <div>• <strong>Upper Breakeven:</strong> 590 + $1.50 = <strong>$591.50</strong></div>
                        </div>
                    </section>

                    {/* FAQ Accordion Section */}
                    <section className="space-y-4 pt-4 border-t border-slate-800">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-emerald-400" />
                            Frequently Asked Questions (FAQs)
                        </h3>
                        <div className="space-y-3">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                        className="w-full p-4 text-left font-semibold text-slate-200 flex items-center justify-between hover:bg-slate-900/50 transition-colors"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaqIndex === index ? 'rotate-180 text-emerald-400' : ''}`} />
                                    </button>
                                    {openFaqIndex === index && (
                                        <div className="px-4 pb-4 text-xs text-slate-400 border-t border-slate-800/60 pt-3 leading-relaxed">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </article>
            </main>
        </div>
    );
};
