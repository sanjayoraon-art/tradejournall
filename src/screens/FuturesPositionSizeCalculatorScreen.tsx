import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Calculator, TrendingUp, TrendingDown, ArrowRight, ShieldCheck, Zap,
    DollarSign, Percent, RefreshCw, CheckCircle2, ChevronDown, HelpCircle,
    Sparkles, Scale, Layers, Award, Landmark, Lock, Plus, Share2, Check,
    Coins, Wallet, CircleDollarSign, ArrowUpRight, Info, AlertTriangle, ArrowLeft,
    Clock, ShieldAlert, BarChart2, BookOpen, Activity, Target, Flame
} from 'lucide-react';
import { RelatedToolsGrid } from '../components/RelatedToolsGrid';

export interface FuturesPositionSizeCalculatorScreenProps {
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

export interface FuturesContractPreset {
    id: string;
    name: string;
    ticker: string;
    exchange: string;
    category: 'indices' | 'metals' | 'energy' | 'crypto' | 'custom';
    tickSize: number;
    tickValue: number;
    pointValue: number;
    dayMarginEst: number;
    description: string;
    microAlternativeId?: string;
    isMicro?: boolean;
}

export const FUTURES_PRESETS: FuturesContractPreset[] = [
    {
        id: 'es',
        name: 'E-mini S&P 500 (ES)',
        ticker: 'ES',
        exchange: 'CME',
        category: 'indices',
        tickSize: 0.25,
        tickValue: 12.50,
        pointValue: 50.00,
        dayMarginEst: 500,
        description: '$12.50 per 0.25 tick ($50.00 / point)',
        microAlternativeId: 'mes',
        isMicro: false
    },
    {
        id: 'mes',
        name: 'Micro E-mini S&P 500 (MES)',
        ticker: 'MES',
        exchange: 'CME',
        category: 'indices',
        tickSize: 0.25,
        tickValue: 1.25,
        pointValue: 5.00,
        dayMarginEst: 50,
        description: '$1.25 per 0.25 tick ($5.00 / point) - 1/10th size',
        isMicro: true
    },
    {
        id: 'nq',
        name: 'E-mini Nasdaq 100 (NQ)',
        ticker: 'NQ',
        exchange: 'CME',
        category: 'indices',
        tickSize: 0.25,
        tickValue: 5.00,
        pointValue: 20.00,
        dayMarginEst: 1000,
        description: '$5.00 per 0.25 tick ($20.00 / point)',
        microAlternativeId: 'mnq',
        isMicro: false
    },
    {
        id: 'mnq',
        name: 'Micro E-mini Nasdaq (MNQ)',
        ticker: 'MNQ',
        exchange: 'CME',
        category: 'indices',
        tickSize: 0.25,
        tickValue: 0.50,
        pointValue: 2.00,
        dayMarginEst: 100,
        description: '$0.50 per 0.25 tick ($2.00 / point) - 1/10th size',
        isMicro: true
    },
    {
        id: 'gc',
        name: 'Gold Futures (GC)',
        ticker: 'GC',
        exchange: 'COMEX',
        category: 'metals',
        tickSize: 0.10,
        tickValue: 10.00,
        pointValue: 100.00,
        dayMarginEst: 1000,
        description: '$10.00 per 0.10 tick ($100.00 / full $1 move - 100 troy oz)',
        microAlternativeId: 'mgc',
        isMicro: false
    },
    {
        id: 'mgc',
        name: 'Micro Gold Futures (MGC)',
        ticker: 'MGC',
        exchange: 'COMEX',
        category: 'metals',
        tickSize: 0.10,
        tickValue: 1.00,
        pointValue: 10.00,
        dayMarginEst: 100,
        description: '$1.00 per 0.10 tick ($10.00 / point - 10 troy oz)',
        isMicro: true
    },
    {
        id: 'cl',
        name: 'Crude Oil (CL)',
        ticker: 'CL',
        exchange: 'NYMEX',
        category: 'energy',
        tickSize: 0.01,
        tickValue: 10.00,
        pointValue: 1000.00,
        dayMarginEst: 1000,
        description: '$10.00 per 0.01 tick ($1,000 / $1 barrel move)',
        microAlternativeId: 'mcl',
        isMicro: false
    },
    {
        id: 'mcl',
        name: 'Micro WTI Crude Oil (MCL)',
        ticker: 'MCL',
        exchange: 'NYMEX',
        category: 'energy',
        tickSize: 0.01,
        tickValue: 1.00,
        pointValue: 100.00,
        dayMarginEst: 100,
        description: '$1.00 per 0.01 tick ($100 / $1 move)',
        isMicro: true
    },
    {
        id: 'rty',
        name: 'E-mini Russell 2000 (RTY)',
        ticker: 'RTY',
        exchange: 'CME',
        category: 'indices',
        tickSize: 0.10,
        tickValue: 5.00,
        pointValue: 50.00,
        dayMarginEst: 500,
        description: '$5.00 per 0.10 tick ($50.00 / point)',
        microAlternativeId: 'm2k',
        isMicro: false
    },
    {
        id: 'm2k',
        name: 'Micro E-mini Russell (M2K)',
        ticker: 'M2K',
        exchange: 'CME',
        category: 'indices',
        tickSize: 0.10,
        tickValue: 0.50,
        pointValue: 5.00,
        dayMarginEst: 50,
        description: '$0.50 per 0.10 tick ($5.00 / point)',
        isMicro: true
    },
    {
        id: 'custom',
        name: 'Custom Contract',
        ticker: 'CUSTOM',
        exchange: 'CUSTOM',
        category: 'custom',
        tickSize: 0.25,
        tickValue: 12.50,
        pointValue: 50.00,
        dayMarginEst: 500,
        description: 'Configure your own tick size, tick value, and point multiplier',
        isMicro: false
    }
];

export const FuturesPositionSizeCalculatorScreen: React.FC<FuturesPositionSizeCalculatorScreenProps> = ({
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
    onSignIn,
    onLogTrade
}) => {
    // ---------------------------------------------------------------------------
    // STATE: CONTRACT SELECTION & CUSTOM SPECIFICATIONS
    // ---------------------------------------------------------------------------
    const [selectedPresetId, setSelectedPresetId] = useState<string>('es');
    const [customTickSize, setCustomTickSize] = useState<number>(0.25);
    const [customTickValue, setCustomTickValue] = useState<number>(12.50);
    const [customPointValue, setCustomPointValue] = useState<number>(50.00);
    const [dayMarginRequirement, setDayMarginRequirement] = useState<number>(500);

    // ---------------------------------------------------------------------------
    // STATE: CAPITAL & RISK SETTINGS
    // ---------------------------------------------------------------------------
    const [accountBalance, setAccountBalance] = useState<number>(50000);
    const [riskModel, setRiskModel] = useState<'percent' | 'dollars'>('percent');
    const [riskPercent, setRiskPercent] = useState<number>(1.0);
    const [fixedRiskDollars, setFixedRiskDollars] = useState<number>(500);

    // ---------------------------------------------------------------------------
    // STATE: STOP-LOSS INPUT METHOD
    // ---------------------------------------------------------------------------
    const [stopLossMode, setStopLossMode] = useState<'points' | 'ticks' | 'prices'>('points');
    const [stopPoints, setStopPoints] = useState<number>(10.00);
    const [stopTicks, setStopTicks] = useState<number>(40);
    const [entryPrice, setEntryPrice] = useState<number>(5450.00);
    const [stopPrice, setStopPrice] = useState<number>(5440.00);
    const [tradeDirection, setTradeDirection] = useState<'Long' | 'Short'>('Long');

    // UI Feedback
    const [copiedLink, setCopiedLink] = useState<boolean>(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Get current preset object
    const currentPreset = useMemo(() => {
        return FUTURES_PRESETS.find(p => p.id === selectedPresetId) || FUTURES_PRESETS[0];
    }, [selectedPresetId]);

    // Active specs
    const activeTickSize = selectedPresetId === 'custom' ? customTickSize : currentPreset.tickSize;
    const activeTickValue = selectedPresetId === 'custom' ? customTickValue : currentPreset.tickValue;
    const activePointValue = selectedPresetId === 'custom' ? (customTickValue / (customTickSize || 1)) : currentPreset.pointValue;
    const activeDayMargin = selectedPresetId === 'custom' ? dayMarginRequirement : currentPreset.dayMarginEst;

    // Handle Preset Switch
    const handleSelectPreset = (presetId: string) => {
        setSelectedPresetId(presetId);
        const preset = FUTURES_PRESETS.find(p => p.id === presetId);
        if (preset) {
            setDayMarginRequirement(preset.dayMarginEst);
            if (presetId === 'es') {
                setEntryPrice(5450.00);
                setStopPrice(5440.00);
                setStopPoints(10.00);
                setStopTicks(40);
            } else if (presetId === 'mes') {
                setEntryPrice(5450.00);
                setStopPrice(5440.00);
                setStopPoints(10.00);
                setStopTicks(40);
            } else if (presetId === 'nq' || presetId === 'mnq') {
                setEntryPrice(19800.00);
                setStopPrice(19760.00);
                setStopPoints(40.00);
                setStopTicks(160);
            } else if (presetId === 'gc' || presetId === 'mgc') {
                setEntryPrice(2650.00);
                setStopPrice(2642.00);
                setStopPoints(8.00);
                setStopTicks(80);
            } else if (presetId === 'cl' || presetId === 'mcl') {
                setEntryPrice(72.50);
                setStopPrice(71.90);
                setStopPoints(0.60);
                setStopTicks(60);
            }
        }
    };

    // Synchronize Stop Loss measurements
    const computedStopDistancePoints = useMemo(() => {
        if (stopLossMode === 'points') {
            return Math.max(0.001, stopPoints);
        } else if (stopLossMode === 'ticks') {
            return Math.max(0.001, (stopTicks * activeTickSize));
        } else {
            // prices
            return Math.max(0.001, Math.abs(entryPrice - stopPrice));
        }
    }, [stopLossMode, stopPoints, stopTicks, entryPrice, stopPrice, activeTickSize]);

    const computedStopDistanceTicks = useMemo(() => {
        if (activeTickSize <= 0) return 0;
        return Math.round(computedStopDistancePoints / activeTickSize);
    }, [computedStopDistancePoints, activeTickSize]);

    // ---------------------------------------------------------------------------
    // CORE SIZING MATH: STRICT RISK BUDGET & ROUND-DOWN INTEGER
    // ---------------------------------------------------------------------------
    const calculation = useMemo(() => {
        // 1. Total Dollar Risk Allowed
        const maxDollarRisk = riskModel === 'percent'
            ? (accountBalance * (riskPercent / 100))
            : fixedRiskDollars;

        // 2. Risk Per 1 Contract ($)
        // Formula: Stop Distance in Points * Point Value OR Stop Distance in Ticks * Tick Value
        const riskPerContract = computedStopDistancePoints * activePointValue;

        // 3. Contracts Calculation
        // Strict Round Down rule: cannot buy fractional futures contracts!
        const rawContracts = riskPerContract > 0 ? (maxDollarRisk / riskPerContract) : 0;
        const maxContracts = Math.floor(rawContracts);

        // 4. Actual Risk Taken with Whole Contracts
        const actualDollarRisk = maxContracts * riskPerContract;
        const actualRiskPercent = accountBalance > 0 ? ((actualDollarRisk / accountBalance) * 100) : 0;
        const unallocatedRiskBuffer = Math.max(0, maxDollarRisk - actualDollarRisk);

        // 5. Margin checks
        const totalDayMarginRequired = maxContracts * activeDayMargin;
        const isMarginDeficit = totalDayMarginRequired > accountBalance;
        const marginUtilizationPct = accountBalance > 0 ? ((totalDayMarginRequired / accountBalance) * 100) : 0;

        // 6. Micro Alternative Comparison (if current is full contract and rawContracts < 1 or has excess unallocated buffer)
        let microAlternativeInfo: {
            recommendedTicker: string;
            recommendedName: string;
            microContracts: number;
            microActualRisk: number;
            microRiskPercent: number;
            savingsDescription: string;
        } | null = null;

        if (currentPreset.microAlternativeId) {
            const microPreset = FUTURES_PRESETS.find(p => p.id === currentPreset.microAlternativeId);
            if (microPreset) {
                const microRiskPerContract = computedStopDistancePoints * microPreset.pointValue;
                const rawMicroContracts = microRiskPerContract > 0 ? (maxDollarRisk / microRiskPerContract) : 0;
                const microContracts = Math.floor(rawMicroContracts);
                const microActualRisk = microContracts * microRiskPerContract;
                const microRiskPercent = accountBalance > 0 ? ((microActualRisk / accountBalance) * 100) : 0;

                microAlternativeInfo = {
                    recommendedTicker: microPreset.ticker,
                    recommendedName: microPreset.name,
                    microContracts,
                    microActualRisk,
                    microRiskPercent,
                    savingsDescription: `Trading ${microContracts} ${microPreset.ticker} contracts risks $${microActualRisk.toFixed(2)} (${microRiskPercent.toFixed(2)}% of capital), closer to your $${maxDollarRisk.toFixed(2)} target.`
                };
            }
        }

        // 7. Multi-Target Risk-to-Reward Matrix
        const rMultipliers = [1, 1.5, 2, 2.5, 3, 4];
        const targetsMatrix = rMultipliers.map(r => {
            const profitTargetPoints = computedStopDistancePoints * r;
            const profitTargetTicks = Math.round(profitTargetPoints / (activeTickSize || 1));
            const targetPrice = tradeDirection === 'Long'
                ? entryPrice + profitTargetPoints
                : entryPrice - profitTargetPoints;
            const dollarProfit = actualDollarRisk * r;

            return {
                ratioLabel: `1:${r}`,
                points: profitTargetPoints,
                ticks: profitTargetTicks,
                targetPrice,
                dollarProfit,
                roiPercent: accountBalance > 0 ? ((dollarProfit / accountBalance) * 100) : 0
            };
        });

        return {
            maxDollarRisk,
            riskPerContract,
            rawContracts,
            maxContracts,
            actualDollarRisk,
            actualRiskPercent,
            unallocatedRiskBuffer,
            totalDayMarginRequired,
            isMarginDeficit,
            marginUtilizationPct,
            microAlternativeInfo,
            targetsMatrix
        };
    }, [
        riskModel, accountBalance, riskPercent, fixedRiskDollars,
        computedStopDistancePoints, activePointValue, activeTickSize,
        activeDayMargin, currentPreset, tradeDirection, entryPrice
    ]);

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2500);
        }
    };

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} pb-20`}>
            {/* SEO & Structured Data */}
            <Helmet>
                <title>Futures Position Size Calculator Free | Position Size Calculator for Futures & Gold</title>
                <meta
                    name="description"
                    content="Free futures position size calculator for E-mini ES, Nasdaq NQ, Micro MES/MNQ, and Gold futures (GC). Accurately calculate contract quantities, tick values, and dollar risk per trade."
                />
                <meta
                    name="keywords"
                    content="futures position size calculator, position size calculator futures, future position size calculator, futures calculator position size, futures position size calculator free, position size calculator for futures, gold futures position size calculator"
                />
                <link rel="canonical" href="https://sanjayoraon-art.github.io/tradejournall/tools/futures-position-size-calculator" />

                {/* Open Graph */}
                <meta property="og:title" content="Futures Position Size Calculator Free | Micro & E-Mini Risk Calculator" />
                <meta property="og:description" content="Calculate the exact contract size for ES, NQ, MES, MNQ, Crude Oil, and Gold futures based on your account risk tolerance." />
                <meta property="og:type" content="website" />

                {/* Schema.org SoftwareApplication */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Futures Position Size Calculator",
                        "applicationCategory": "FinanceApplication",
                        "operatingSystem": "All",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "description": "Professional futures position size calculator and risk management tool for E-mini, Micro, and Commodity futures contracts."
                    })}
                </script>

                {/* Schema.org FAQPage */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "How do you calculate position size in futures?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Futures position size is calculated by dividing your total allowed dollar risk by the risk per contract. The formula is: Number of Contracts = Allowed Dollar Risk / (Stop Distance in Points × Point Value). Always round down to the nearest whole integer."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Why must you round down futures contract position size?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Futures contracts cannot be traded in fractional sizes. If your math suggests 2.7 contracts, rounding up to 3 would cause you to exceed your maximum risk budget if your stop loss is hit. You must round down to 2 contracts to stay protected."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How does the gold futures position size calculator work?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Gold futures (GC) have a contract size of 100 troy ounces with a tick size of $0.10 worth $10.00 ($100 per full point move). The micro gold contract (MGC) is 1/10th the size, with a tick value of $1.00 ($10 per full point)."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What is the difference between margin requirement and risk in futures?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Margin is the collateral required by your broker (e.g., $500 for ES day trading) to open a position. Risk is the actual capital you lose if your stop-loss order is executed. Never size trades based on margin; always size based on dollar risk."
                                }
                            }
                        ]
                    })}
                </script>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {/* Top Navigation Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        {onBackToLanding && (
                            <button
                                onClick={onBackToLanding}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 bg-slate-800/80 text-xs font-semibold text-slate-300 transition-all hover:text-white"
                            >
                                <ArrowLeft size={14} /> Back to Hub
                            </button>
                        )}
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                            <Sparkles size={12} /> 100% Free US Futures Tool
                        </span>
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            ES • NQ • GC • CL
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleShare}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
                        >
                            {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                            {copiedLink ? 'Link Copied!' : 'Share Tool'}
                        </button>
                    </div>
                </div>

                {/* Hero Header */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
                        <Scale size={13} /> Institutional Risk Management Sizer
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
                        Futures Position Size Calculator
                    </h1>
                    <p className="text-base md:text-lg text-slate-300 max-w-3xl leading-relaxed">
                        Calculate exact contract quantities for E-mini, Micro, and Commodity futures contracts.
                        Eliminate sizing guesswork, comply with strict dollar risk budgets, and prevent over-leveraged account blowouts.
                    </p>
                </div>

                {/* Quick Instrument Preset Selector */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <Layers size={14} className="text-indigo-400" /> Select Futures Contract Preset
                        </label>
                        <span className="text-xs text-slate-400">
                            Auto-loads official CME/NYMEX/COMEX point multipliers
                        </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                        {FUTURES_PRESETS.map((preset) => {
                            const isSelected = selectedPresetId === preset.id;
                            return (
                                <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() => handleSelectPreset(preset.id)}
                                    className={`relative p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                        isSelected
                                            ? 'bg-indigo-600/15 border-indigo-500 ring-2 ring-indigo-500/30'
                                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-1">
                                        <span className={`text-sm font-bold ${isSelected ? 'text-indigo-300' : 'text-white'}`}>
                                            {preset.ticker}
                                        </span>
                                        {preset.isMicro && (
                                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                                Micro
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs text-slate-300 line-clamp-1 mb-2 font-medium">
                                        {preset.name}
                                    </span>
                                    <span className="text-[11px] text-slate-400 font-mono">
                                        ${preset.pointValue}/pt
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Interactive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                    {/* Left Column: Input Form (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Box 1: Account Capital & Risk Budget */}
                        <div className="p-5 md:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm shadow-xl">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                        <Wallet size={18} />
                                    </div>
                                    <h2 className="text-base font-bold text-white">
                                        1. Account Capital & Risk Tolerance
                                    </h2>
                                </div>
                                <div className="flex items-center p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => setRiskModel('percent')}
                                        className={`px-3 py-1 rounded-md font-semibold transition ${
                                            riskModel === 'percent'
                                                ? 'bg-emerald-600 text-white shadow'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        % of Balance
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRiskModel('dollars')}
                                        className={`px-3 py-1 rounded-md font-semibold transition ${
                                            riskModel === 'dollars'
                                                ? 'bg-emerald-600 text-white shadow'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        Fixed Dollar ($)
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Total Account Balance ($)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-semibold">$</span>
                                        <input
                                            type="number"
                                            value={accountBalance}
                                            onChange={(e) => setAccountBalance(Math.max(1, Number(e.target.value)))}
                                            className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                                            placeholder="50000"
                                        />
                                    </div>
                                    <div className="flex gap-1.5 mt-2">
                                        {[10000, 25000, 50000, 100000, 150000].map(amt => (
                                            <button
                                                key={amt}
                                                type="button"
                                                onClick={() => setAccountBalance(amt)}
                                                className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                                            >
                                                ${(amt / 1000)}k
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {riskModel === 'percent' ? (
                                    <div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <label className="text-xs font-semibold text-slate-300">
                                                Risk Percentage (%)
                                            </label>
                                            <span className="text-xs font-bold text-emerald-400 font-mono">
                                                = ${((accountBalance * riskPercent) / 100).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="0.25"
                                                value={riskPercent}
                                                onChange={(e) => setRiskPercent(Math.max(0.1, Number(e.target.value)))}
                                                className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                                                placeholder="1.0"
                                            />
                                            <span className="absolute right-3 top-2.5 text-slate-400 text-sm font-semibold">%</span>
                                        </div>
                                        <div className="flex gap-1.5 mt-2">
                                            {[0.5, 1.0, 1.5, 2.0, 3.0].map(pct => (
                                                <button
                                                    key={pct}
                                                    type="button"
                                                    onClick={() => setRiskPercent(pct)}
                                                    className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                                                >
                                                    {pct}%
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <label className="text-xs font-semibold text-slate-300">
                                                Fixed Dollar Risk ($)
                                            </label>
                                            <span className="text-xs font-bold text-emerald-400 font-mono">
                                                = {accountBalance > 0 ? ((fixedRiskDollars / accountBalance) * 100).toFixed(2) : 0}%
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-semibold">$</span>
                                            <input
                                                type="number"
                                                value={fixedRiskDollars}
                                                onChange={(e) => setFixedRiskDollars(Math.max(1, Number(e.target.value)))}
                                                className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                                                placeholder="500"
                                            />
                                        </div>
                                        <div className="flex gap-1.5 mt-2">
                                            {[150, 250, 500, 1000, 1500].map(dlr => (
                                                <button
                                                    key={dlr}
                                                    type="button"
                                                    onClick={() => setFixedRiskDollars(dlr)}
                                                    className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                                                >
                                                    ${dlr}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Box 2: Stop-Loss Distance & Trade Execution */}
                        <div className="p-5 md:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm shadow-xl">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                        <Target size={18} />
                                    </div>
                                    <h2 className="text-base font-bold text-white">
                                        2. Stop Loss Distance
                                    </h2>
                                </div>
                                <div className="flex items-center p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => setStopLossMode('points')}
                                        className={`px-2.5 py-1 rounded-md font-semibold transition ${
                                            stopLossMode === 'points'
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        Points
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStopLossMode('ticks')}
                                        className={`px-2.5 py-1 rounded-md font-semibold transition ${
                                            stopLossMode === 'ticks'
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        Ticks
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStopLossMode('prices')}
                                        className={`px-2.5 py-1 rounded-md font-semibold transition ${
                                            stopLossMode === 'prices'
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        Entry & Stop Price
                                    </button>
                                </div>
                            </div>

                            {stopLossMode === 'points' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                            Stop Loss Distance in Points
                                        </label>
                                        <input
                                            type="number"
                                            step="0.25"
                                            value={stopPoints}
                                            onChange={(e) => setStopPoints(Math.max(0.01, Number(e.target.value)))}
                                            className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                                            placeholder="10.0"
                                        />
                                        <p className="text-[11px] text-slate-400 mt-1.5">
                                            = {computedStopDistanceTicks} Ticks on {currentPreset.ticker}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                            Quick Presets
                                        </label>
                                        <div className="grid grid-cols-4 gap-1.5">
                                            {[4, 8, 10, 15, 20, 25, 30, 40].map(pts => (
                                                <button
                                                    key={pts}
                                                    type="button"
                                                    onClick={() => setStopPoints(pts)}
                                                    className="px-2 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white font-mono"
                                                >
                                                    {pts} pts
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {stopLossMode === 'ticks' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                            Stop Loss Distance in Ticks
                                        </label>
                                        <input
                                            type="number"
                                            value={stopTicks}
                                            onChange={(e) => setStopTicks(Math.max(1, Number(e.target.value)))}
                                            className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                                            placeholder="40"
                                        />
                                        <p className="text-[11px] text-slate-400 mt-1.5">
                                            = {computedStopDistancePoints.toFixed(2)} Points ({activeTickSize} pt/tick)
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                            Quick Presets
                                        </label>
                                        <div className="grid grid-cols-4 gap-1.5">
                                            {[16, 24, 32, 40, 60, 80, 100, 160].map(t => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    onClick={() => setStopTicks(t)}
                                                    className="px-2 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white font-mono"
                                                >
                                                    {t} ticks
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {stopLossMode === 'prices' && (
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setTradeDirection('Long')}
                                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                                                tradeDirection === 'Long'
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            <TrendingUp size={14} /> Long Trade
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setTradeDirection('Short')}
                                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                                                tradeDirection === 'Short'
                                                    ? 'bg-rose-600 text-white'
                                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            <TrendingDown size={14} /> Short Trade
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                                Entry Price
                                            </label>
                                            <input
                                                type="number"
                                                step="0.25"
                                                value={entryPrice}
                                                onChange={(e) => setEntryPrice(Number(e.target.value))}
                                                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                                Stop Loss Price
                                            </label>
                                            <input
                                                type="number"
                                                step="0.25"
                                                value={stopPrice}
                                                onChange={(e) => setStopPrice(Number(e.target.value))}
                                                className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex justify-between items-center text-xs">
                                        <span className="text-slate-400">Stop Distance:</span>
                                        <span className="font-mono font-bold text-indigo-400">
                                            {computedStopDistancePoints.toFixed(2)} pts ({computedStopDistanceTicks} ticks)
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Box 3: Custom Contract Specifications (Visible if Custom chosen) */}
                        {selectedPresetId === 'custom' && (
                            <div className="p-5 md:p-6 rounded-2xl bg-slate-900/80 border border-indigo-500/30 backdrop-blur-sm shadow-xl">
                                <h3 className="text-sm font-bold text-indigo-300 mb-3 flex items-center gap-1.5">
                                    <Zap size={15} /> Custom Contract Specifications
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">Tick Size (e.g. 0.25)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={customTickSize}
                                            onChange={(e) => setCustomTickSize(Math.max(0.001, Number(e.target.value)))}
                                            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">Tick Value ($)</label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            value={customTickValue}
                                            onChange={(e) => setCustomTickValue(Math.max(0.01, Number(e.target.value)))}
                                            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">Point Value ($)</label>
                                        <input
                                            type="number"
                                            value={customPointValue}
                                            onChange={(e) => setCustomPointValue(Math.max(0.1, Number(e.target.value)))}
                                            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Output Card & Recommendations (5 Cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Main Position Size Result Card */}
                        <div className="p-6 md:p-7 rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/40 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                                <Calculator size={140} className="text-indigo-400" />
                            </div>

                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                                    Recommended Position Size
                                </span>
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                                    Strict Round-Down
                                </span>
                            </div>

                            {/* Main Big Output */}
                            <div className="my-4">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-6xl md:text-7xl font-black tracking-tight text-white font-mono">
                                        {calculation.maxContracts}
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold text-indigo-300">
                                            {calculation.maxContracts === 1 ? 'Contract' : 'Contracts'}
                                        </span>
                                        <span className="text-xs text-slate-400 font-mono">
                                            {currentPreset.ticker} ({currentPreset.name})
                                        </span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">
                                    Exact mathematical quotient: <span className="font-mono text-slate-300 font-semibold">{calculation.rawContracts.toFixed(2)}</span> contracts.
                                    Always rounded down to prevent violating risk limit.
                                </p>
                            </div>

                            {/* Risk Breakdown Metrics */}
                            <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Target Max Risk Budget:</span>
                                    <span className="font-mono font-bold text-white">
                                        ${calculation.maxDollarRisk.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Risk per 1 Contract:</span>
                                    <span className="font-mono font-bold text-indigo-300">
                                        ${calculation.riskPerContract.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Actual Total Risk Taken:</span>
                                    <span className="font-mono font-bold text-emerald-400">
                                        ${calculation.actualDollarRisk.toFixed(2)} ({calculation.actualRiskPercent.toFixed(2)}% of Account)
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Unused Risk Buffer:</span>
                                    <span className="font-mono text-slate-300">
                                        ${calculation.unallocatedRiskBuffer.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800/50">
                                    <span className="text-slate-400">Estimated Day Trading Margin:</span>
                                    <span className={`font-mono font-bold ${calculation.isMarginDeficit ? 'text-rose-400' : 'text-slate-300'}`}>
                                        ${calculation.totalDayMarginRequired.toFixed(2)} ({calculation.marginUtilizationPct.toFixed(1)}%)
                                    </span>
                                </div>
                            </div>

                            {/* Warning or Zero Contract Handling */}
                            {calculation.maxContracts === 0 && (
                                <div className="mt-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
                                    <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-amber-300 mb-0.5">Risk Limit Exceeded for Full Contract</p>
                                        <p className="text-slate-300 leading-relaxed">
                                            Your stop loss of {computedStopDistancePoints.toFixed(2)} pts on {currentPreset.ticker} risks ${calculation.riskPerContract.toFixed(2)}, which exceeds your ${calculation.maxDollarRisk.toFixed(2)} budget.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {calculation.isMarginDeficit && (
                                <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-300">
                                    <ShieldAlert size={16} className="text-rose-400 shrink-0 mt-0.5" />
                                    <span>
                                        Warning: Total day trading margin required (${calculation.totalDayMarginRequired.toFixed(2)}) exceeds your account balance (${accountBalance.toFixed(2)}).
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Smart Micro Recommendation Card (Beats Competitors!) */}
                        {calculation.microAlternativeInfo && (
                            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 shadow-lg">
                                <div className="flex items-center gap-2 mb-2 text-emerald-400">
                                    <Sparkles size={16} />
                                    <h4 className="text-xs font-bold uppercase tracking-wider">
                                        Smart Sizing Optimization: Use {calculation.microAlternativeInfo.recommendedTicker}
                                    </h4>
                                </div>
                                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                                    {calculation.microAlternativeInfo.savingsDescription}
                                </p>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20">
                                    <div>
                                        <span className="text-[11px] text-slate-400 block">Optimal Micro Contracts:</span>
                                        <span className="text-xl font-black text-emerald-400 font-mono">
                                            {calculation.microAlternativeInfo.microContracts} {calculation.microAlternativeInfo.recommendedTicker}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleSelectPreset(currentPreset.microAlternativeId || 'mes')}
                                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 shadow"
                                    >
                                        Switch to {calculation.microAlternativeInfo.recommendedTicker} <ArrowRight size={13} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Action buttons */}
                        {onLogTrade && calculation.maxContracts > 0 && (
                            <button
                                type="button"
                                onClick={() => {
                                    onLogTrade({
                                        symbol: currentPreset.ticker,
                                        entryPrice: entryPrice,
                                        exitPrice: entryPrice + computedStopDistancePoints,
                                        pnl: calculation.actualDollarRisk,
                                        type: tradeDirection
                                    });
                                }}
                                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                            >
                                <Plus size={16} /> Log This Sized Setup to Trade Journal
                            </button>
                        )}
                    </div>
                </div>

                {/* Risk-to-Reward & Take-Profit Matrix */}
                <div className="mb-12 p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <BarChart2 size={20} className="text-indigo-400" />
                                Multi-Target Risk-to-Reward Execution Matrix
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Exact profit targets in Points, Ticks, and Net Dollar Gains for {calculation.maxContracts} {currentPreset.ticker} contracts.
                            </p>
                        </div>
                        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-800 text-slate-300 self-start sm:self-auto">
                            Risk Unit (1R): ${calculation.actualDollarRisk.toFixed(2)}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {calculation.targetsMatrix.map((target, idx) => (
                            <div
                                key={idx}
                                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-black text-indigo-400 font-mono">
                                        Target {target.ratioLabel}
                                    </span>
                                </div>
                                <div className="space-y-1.5 font-mono">
                                    <div>
                                        <span className="text-[10px] text-slate-500 uppercase block">Gain ($)</span>
                                        <span className="text-sm font-bold text-emerald-400">
                                            +${target.dollarProfit.toFixed(2)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-500 uppercase block">Distance</span>
                                        <span className="text-xs text-slate-300">
                                            +{target.points.toFixed(2)} pts ({target.ticks}t)
                                        </span>
                                    </div>
                                    {stopLossMode === 'prices' && (
                                        <div>
                                            <span className="text-[10px] text-slate-500 uppercase block">Target Price</span>
                                            <span className="text-xs text-indigo-300 font-bold">
                                                {target.targetPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comprehensive SEO Content & Educational Article */}
                <article className="prose prose-invert max-w-none mb-12 p-6 md:p-10 rounded-3xl bg-slate-900/40 border border-slate-800/80">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                        How to Calculate Futures Position Size: The Complete Mathematical Formula
                    </h2>
                    <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-4">
                        Unlike equities or forex where you can purchase arbitrary share amounts or micro-lots, futures contracts operate on standardized specifications set by exchanges such as the Chicago Mercantile Exchange (CME) and New York Mercantile Exchange (NYMEX). 
                        Because futures contracts are non-fractional, every trade requires precise calculations using our free <strong>futures position size calculator</strong>.
                    </p>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-indigo-300 my-6">
                        <p className="font-bold text-white mb-1">Standard Futures Position Sizing Formula:</p>
                        <p className="text-emerald-400">
                            Max Contracts = Floor[ (Account Balance × Risk %) / (Stop Distance in Points × Point Value) ]
                        </p>
                    </div>

                    <h3 className="text-xl font-bold text-white mt-8 mb-3">
                        Gold Futures Position Size Calculator (GC vs MGC)
                    </h3>
                    <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-4">
                        When using a <strong>gold futures position size calculator</strong>, it is crucial to recognize the difference between standard Gold (GC) and Micro Gold (MGC):
                    </p>
                    <ul className="text-sm md:text-base text-slate-300 space-y-2 list-disc pl-6 mb-6">
                        <li>
                            <strong>Standard Gold Futures (GC):</strong> 100 troy ounces. Every full \$1.00 move in gold price equals <strong>\$100.00 profit or loss</strong> per contract. Minimum tick is \$0.10 (\$10.00 per tick).
                        </li>
                        <li>
                            <strong>Micro Gold Futures (MGC):</strong> 10 troy ounces (1/10th size). Every full \$1.00 move equals <strong>\$10.00 per contract</strong>. Minimum tick is \$0.10 (\$1.00 per tick).
                        </li>
                    </ul>

                    <h3 className="text-xl font-bold text-white mt-8 mb-3">
                        Why the Strict Round-Down Rule is Essential
                    </h3>
                    <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-4">
                        Many beginner traders make the catastrophic mistake of rounding up fractional outputs. If your risk calculation yields <strong>2.8 contracts</strong> on E-mini S&P (ES), rounding up to 3 contracts causes you to risk more than your predefined tolerance. To protect your equity curve, our <strong>position size calculator for futures</strong> strictly enforces a mathematical floor (round-down), ensuring you never incur account ruin.
                    </p>

                    {/* Comparison Table */}
                    <div className="overflow-x-auto my-8">
                        <table className="w-full text-left text-xs md:text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                                    <th className="py-3 px-4">Contract Name</th>
                                    <th className="py-3 px-4">Ticker</th>
                                    <th className="py-3 px-4">Tick Size</th>
                                    <th className="py-3 px-4">Tick Value</th>
                                    <th className="py-3 px-4">Point Multiplier</th>
                                    <th className="py-3 px-4">Typical Day Margin</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                                <tr>
                                    <td className="py-3 px-4 font-semibold text-white">E-mini S&P 500</td>
                                    <td className="py-3 px-4 text-indigo-400">ES</td>
                                    <td className="py-3 px-4">0.25</td>
                                    <td className="py-3 px-4 text-emerald-400">$12.50</td>
                                    <td className="py-3 px-4">$50.00 / pt</td>
                                    <td className="py-3 px-4">$500</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-semibold text-white">Micro E-mini S&P</td>
                                    <td className="py-3 px-4 text-indigo-400">MES</td>
                                    <td className="py-3 px-4">0.25</td>
                                    <td className="py-3 px-4 text-emerald-400">$1.25</td>
                                    <td className="py-3 px-4">$5.00 / pt</td>
                                    <td className="py-3 px-4">$50</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-semibold text-white">E-mini Nasdaq 100</td>
                                    <td className="py-3 px-4 text-indigo-400">NQ</td>
                                    <td className="py-3 px-4">0.25</td>
                                    <td className="py-3 px-4 text-emerald-400">$5.00</td>
                                    <td className="py-3 px-4">$20.00 / pt</td>
                                    <td className="py-3 px-4">$1,000</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-semibold text-white">Micro E-mini Nasdaq</td>
                                    <td className="py-3 px-4 text-indigo-400">MNQ</td>
                                    <td className="py-3 px-4">0.25</td>
                                    <td className="py-3 px-4 text-emerald-400">$0.50</td>
                                    <td className="py-3 px-4">$2.00 / pt</td>
                                    <td className="py-3 px-4">$100</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-semibold text-white">Gold Futures</td>
                                    <td className="py-3 px-4 text-indigo-400">GC</td>
                                    <td className="py-3 px-4">0.10</td>
                                    <td className="py-3 px-4 text-emerald-400">$10.00</td>
                                    <td className="py-3 px-4">$100.00 / pt</td>
                                    <td className="py-3 px-4">$1,000</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-semibold text-white">Micro Gold Futures</td>
                                    <td className="py-3 px-4 text-indigo-400">MGC</td>
                                    <td className="py-3 px-4">0.10</td>
                                    <td className="py-3 px-4 text-emerald-400">$1.00</td>
                                    <td className="py-3 px-4">$10.00 / pt</td>
                                    <td className="py-3 px-4">$100</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </article>

                {/* Frequently Asked Questions (FAQ Section with Schema Compliance) */}
                <div className="mb-14">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <HelpCircle size={22} className="text-indigo-400" />
                        Frequently Asked Questions: Futures Position Sizing
                    </h2>
                    <div className="space-y-3">
                        {[
                            {
                                q: "How do you calculate position size in futures trading?",
                                a: "To calculate futures position size, divide your maximum allowable dollar risk by the dollar risk per contract. Dollar risk per contract is calculated as: Stop Loss Distance in Points × Dollar Value Per Point. For example, if you risk $500 on an ES trade with a 10-point stop loss ($50/point = $500 risk/contract), your position size is exactly 1 contract."
                            },
                            {
                                q: "Is this futures position size calculator completely free?",
                                a: "Yes, our futures position size calculator free tool requires no registration, credit card, or software download. It supports real-time calculations for ES, NQ, MES, MNQ, Gold (GC), Crude Oil (CL), and custom contracts."
                            },
                            {
                                q: "How does the gold futures position size calculator work?",
                                a: "Standard COMEX Gold (GC) represents 100 troy ounces where a $1 change in gold price equals $100 per contract. If you trade with a $5.00 stop loss, you are risking $500 per contract. For smaller accounts, Micro Gold (MGC) is 10 troy ounces, where each $1 move is $10."
                            },
                            {
                                q: "What should I do if my position size output is 0 contracts?",
                                a: "If the calculator outputs 0 contracts, your stop-loss distance is too wide for your chosen dollar risk on standard contracts (like ES or NQ). Instead of widening your risk, switch to Micro contracts (MES or MNQ) which are 1/10th the size, allowing you to execute with surgical precision."
                            },
                            {
                                q: "What is the difference between futures day trading margin and risk?",
                                a: "Day trading margin (e.g., $500 for ES or $50 for MES on brokers like NinjaTrader and Tradovate) is simply the collateral needed to open a position. It is NOT your risk. Your risk is the distance to your stop-loss multiplied by point value. Never size trades based on margin."
                            }
                        ].map((faq, index) => {
                            const isOpen = openFaq === index;
                            return (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaq(isOpen ? null : index)}
                                        className="w-full p-4 md:p-5 text-left flex justify-between items-center text-sm md:text-base font-bold text-white hover:text-indigo-300 transition"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown
                                            size={18}
                                            className={`transform transition-transform text-slate-400 ${
                                                isOpen ? 'rotate-180 text-indigo-400' : ''
                                            }`}
                                        />
                                    </button>
                                    {isOpen && (
                                        <div className="px-4 pb-5 md:px-5 md:pb-6 text-xs md:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Related Tools Grid */}
                <div className="mt-12">
                    <RelatedToolsGrid
                        currentToolSlug="/tools/futures-position-size-calculator"
                        category="all"
                        title="Explore More Risk & Capital Calculators"
                        subtitle="Pair position sizing with drawdown recovery, risk of ruin, and prop firm payout tools."
                    />
                </div>
            </div>
        </div>
    );
};
