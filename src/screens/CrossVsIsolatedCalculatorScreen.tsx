import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Scale, ShieldAlert, ShieldCheck, Zap, AlertTriangle, TrendingUp, TrendingDown,
    ArrowRight, Info, CheckCircle2, RefreshCw, Calculator, BookOpen, ChevronDown,
    HelpCircle, DollarSign, Percent, Layers, Award, Landmark, Lock, Sparkles, Plus
} from 'lucide-react';

interface CrossVsIsolatedCalculatorScreenProps {
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

interface PresetOption {
    name: string;
    symbol: string;
    entryPrice: number;
    leverage: number;
    notionalUsdt: number;
    walletBalance: number;
    type: 'Long' | 'Short';
}

const PRESETS: PresetOption[] = [
    {
        name: 'Bitcoin 20x Swing (BTC)',
        symbol: 'BTC/USDT',
        entryPrice: 95000,
        leverage: 20,
        notionalUsdt: 10000,
        walletBalance: 2500,
        type: 'Long'
    },
    {
        name: 'Ethereum 25x Scalp (ETH)',
        symbol: 'ETH/USDT',
        entryPrice: 2700,
        leverage: 25,
        notionalUsdt: 5000,
        walletBalance: 1000,
        type: 'Long'
    },
    {
        name: 'Solana 50x High Risk (SOL)',
        symbol: 'SOL/USDT',
        entryPrice: 190,
        leverage: 50,
        notionalUsdt: 5000,
        walletBalance: 800,
        type: 'Long'
    },
    {
        name: 'Altcoin Short Hedge',
        symbol: 'ALT/USDT',
        entryPrice: 1.50,
        leverage: 10,
        notionalUsdt: 2000,
        walletBalance: 1500,
        type: 'Short'
    }
];

interface ExchangePreset {
    name: string;
    mmr: number; // Maintenance Margin Rate %
}

const EXCHANGES: ExchangePreset[] = [
    { name: 'Binance Futures (0.4% MM)', mmr: 0.4 },
    { name: 'Bybit USDT Perpetual (0.5% MM)', mmr: 0.5 },
    { name: 'OKX Futures (0.4% MM)', mmr: 0.4 },
    { name: 'Bitget / MEXC (0.5% MM)', mmr: 0.5 },
    { name: 'Custom Maintenance Rate', mmr: 0.5 }
];

export const CrossVsIsolatedCalculatorScreen: React.FC<CrossVsIsolatedCalculatorScreenProps> = ({
    theme,
    isDarkMode = true,
    primaryCurrencySymbol = '$',
    onBackToLanding,
    onSignIn,
    onLogTrade
}) => {
    // State inputs
    const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
    const [symbol, setSymbol] = useState('BTC/USDT');
    const [positionType, setPositionType] = useState<'Long' | 'Short'>('Long');
    const [entryPrice, setEntryPrice] = useState<number>(95000);
    const [leverage, setLeverage] = useState<number>(20);
    const [positionSizeUsdt, setPositionSizeUsdt] = useState<number>(10000); // Total Notional Value
    const [walletBalance, setWalletBalance] = useState<number>(2500); // Total Available Futures Wallet Equity
    const [selectedExchangeIndex, setSelectedExchangeIndex] = useState<number>(0);
    const [customMmr, setCustomMmr] = useState<number>(0.4);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    // Apply Preset
    const handlePresetSelect = (index: number) => {
        setSelectedPresetIndex(index);
        const p = PRESETS[index];
        setSymbol(p.symbol);
        setEntryPrice(p.entryPrice);
        setLeverage(p.leverage);
        setPositionSizeUsdt(p.notionalUsdt);
        setWalletBalance(p.walletBalance);
        setPositionType(p.type);
    };

    // Maintenance Margin Rate
    const mmrPercent = selectedExchangeIndex === EXCHANGES.length - 1 ? customMmr : EXCHANGES[selectedExchangeIndex].mmr;
    const mmrDecimal = mmrPercent / 100;

    // Calculation Logic
    const calcResults = useMemo(() => {
        const pPrice = entryPrice > 0 ? entryPrice : 1;
        const sizeUsdt = Math.max(positionSizeUsdt, 10);
        const lev = Math.max(leverage, 1);
        const wallet = Math.max(walletBalance, 10);

        // Required Initial Margin for this position alone
        const initialMargin = sizeUsdt / lev;
        const coinQuantity = sizeUsdt / pPrice;

        // 1. ISOLATED MARGIN CALCULATIONS
        // In Isolated Mode, allocated margin = Initial Margin (unless extra margin is manually added)
        // Isolated Liquidation Price Formula:
        // For Long: Entry * (1 - (1 / Leverage) + MMR)
        // For Short: Entry * (1 + (1 / Leverage) - MMR)
        let isoLiqPrice = 0;
        if (positionType === 'Long') {
            isoLiqPrice = pPrice * (1 - (1 / lev) + mmrDecimal);
        } else {
            isoLiqPrice = pPrice * (1 + (1 / lev) - mmrDecimal);
        }
        isoLiqPrice = Math.max(isoLiqPrice, 0.000001);

        // Distance to Liquidation % for Isolated
        const isoDistancePct = positionType === 'Long'
            ? ((pPrice - isoLiqPrice) / pPrice) * 100
            : ((isoLiqPrice - pPrice) / pPrice) * 100;

        // Max Loss in Isolated (Capped at initial margin)
        const isoMaxLossUsdt = Math.min(initialMargin, wallet);
        const isoMaxLossPctOfWallet = (isoMaxLossUsdt / wallet) * 100;

        // 2. CROSS MARGIN CALCULATIONS
        // In Cross Mode, total available wallet balance acts as collateral buffer!
        // Dynamic Effective Leverage = Position Notional / Total Wallet Balance
        const effectiveCrossLeverage = sizeUsdt / wallet;

        // Cross Liquidation Price Formula:
        // For Long: Entry * (1 - (Wallet / Notional) + MMR)
        // For Short: Entry * (1 + (Wallet / Notional) - MMR)
        let crossLiqPrice = 0;
        const walletMarginRatio = wallet / sizeUsdt;
        if (positionType === 'Long') {
            crossLiqPrice = pPrice * (1 - walletMarginRatio + mmrDecimal);
        } else {
            crossLiqPrice = pPrice * (1 + walletMarginRatio - mmrDecimal);
        }
        crossLiqPrice = Math.max(crossLiqPrice, 0.000001);

        // Distance to Liquidation % for Cross
        const crossDistancePct = positionType === 'Long'
            ? ((pPrice - crossLiqPrice) / pPrice) * 100
            : ((crossLiqPrice - pPrice) / pPrice) * 100;

        // Max Loss in Cross (Destroys 100% of wallet balance if liquidated!)
        const crossMaxLossUsdt = wallet;
        const crossMaxLossPctOfWallet = 100;

        // Differences
        const liqPriceDiffUsdt = Math.abs(isoLiqPrice - crossLiqPrice);
        const distanceDiffPct = crossDistancePct - isoDistancePct;

        // Risk Meter Determination
        let riskScore: 'SAFE' | 'MODERATE' | 'HIGH' | 'EXTREME' = 'SAFE';
        if (isoDistancePct < 5 || effectiveCrossLeverage > 30) {
            riskScore = 'EXTREME';
        } else if (isoDistancePct < 15 || effectiveCrossLeverage > 15) {
            riskScore = 'HIGH';
        } else if (isoDistancePct < 30 || effectiveCrossLeverage > 8) {
            riskScore = 'MODERATE';
        }

        return {
            initialMargin,
            coinQuantity,
            effectiveCrossLeverage,
            isoLiqPrice,
            isoDistancePct,
            isoMaxLossUsdt,
            isoMaxLossPctOfWallet,
            crossLiqPrice,
            crossDistancePct,
            crossMaxLossUsdt,
            crossMaxLossPctOfWallet,
            liqPriceDiffUsdt,
            distanceDiffPct,
            riskScore,
            walletBalance: wallet
        };
    }, [entryPrice, positionSizeUsdt, leverage, walletBalance, positionType, mmrDecimal]);

    // Formatters
    const fmt = (val: number, decimals: number = 2) => {
        if (isNaN(val)) return '0.00';
        return val.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    };

    const fmtPrice = (val: number) => {
        if (val < 1) return val.toFixed(4);
        return fmt(val, 2);
    };

    // Schema Markup for Google SEO
    const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "SoftwareApplication",
                "name": "Cross vs Isolated Margin Liquidation Risk Calculator",
                "operatingSystem": "All",
                "applicationCategory": "FinanceApplication",
                "description": "Free interactive comparison tool for crypto futures traders. Compare Cross Margin vs Isolated Margin liquidation price, distance %, and wallet wipeout risk across Binance, Bybit, OKX & Bitget.",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                }
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What is the key difference between Cross Margin and Isolated Margin liquidation?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "In Isolated Margin, liquidation is strictly capped to the initial margin assigned to that specific trade. In Cross Margin, your entire futures wallet balance is used as collateral, moving your liquidation price further away, but risking 100% of your account balance if liquidated."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Which margin mode is safer for beginners: Cross or Isolated?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Isolated Margin is significantly safer for beginners and high-leverage trades because it walls off loss contagion. A bad trade can never drain your remaining wallet balance."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How is Liquidation Price calculated in Binance and Bybit futures?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "For Isolated Long: Entry Price * (1 - (1 / Leverage) + Maintenance Margin Rate). For Cross Long: Entry Price * (1 - (Wallet Equity / Notional Position Size) + Maintenance Margin Rate)."
                        }
                    }
                ]
            }
        ]
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 pb-16">
            <Helmet>
                <title>Cross vs Isolated Margin Liquidation Risk Calculator (Binance, Bybit) - TradeJournall</title>
                <meta
                    name="description"
                    content="Free Cross Margin vs Isolated Margin Liquidation Risk Calculator. Compare liquidation prices, distance percentages, and wallet wipeout risks for Binance, Bybit, OKX & Bitget futures."
                />
                <meta
                    name="keywords"
                    content="cross vs isolated margin calculator, cross margin calculator, binance cross vs isolated liquidation price, bybit cross margin liquidation calculator, isolated margin vs cross margin liquidation price, crypto futures liquidation calculator, tradejournall"
                />
                <link rel="canonical" href="https://tradejournall.com/tools/cross-vs-isolated-margin-calculator" />
                <meta property="og:title" content="Cross vs Isolated Margin Liquidation Risk Calculator" />
                <meta
                    property="og:description"
                    content="Dual interactive comparison simulator: Cross Margin vs Isolated Margin liquidation thresholds, safety buffer %, and wallet contagion risk."
                />
            </Helmet>

            {/* Inject JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />

            {/* Navigation Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    {onBackToLanding && (
                        <button
                            onClick={onBackToLanding}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition cursor-pointer"
                            title="Back to Terminal Landing"
                        >
                            ←
                        </button>
                    )}
                    <div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-[11px] font-extrabold uppercase tracking-wider mb-1">
                            <Scale size={13} /> Crypto Futures Risk Tool
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                            Cross vs Isolated Margin Calculator ⚡
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 font-bold flex items-center gap-1.5">
                        <CheckCircle2 size={14} /> 100% Free Calculator
                    </span>
                    {onSignIn && (
                        <button
                            onClick={onSignIn}
                            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs hover:from-emerald-400 hover:to-teal-300 transition shadow-lg cursor-pointer"
                        >
                            Save Results
                        </button>
                    )}
                </div>
            </div>

            {/* Quick Preset Selector Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-extrabold flex items-center gap-2">
                    <Zap size={14} className="text-amber-400" />
                    <span>Quick Trade Presets:</span>
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {PRESETS.map((preset, idx) => (
                        <button
                            key={idx}
                            onClick={() => handlePresetSelect(idx)}
                            className={`p-3 rounded-xl border text-left transition cursor-pointer ${selectedPresetIndex === idx ? 'bg-purple-500/20 border-purple-500/80 text-white shadow-lg' : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-xs">{preset.symbol}</span>
                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${preset.type === 'Long' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                    {preset.leverage}x {preset.type}
                                </span>
                            </div>
                            <p className="text-[11px] font-mono text-slate-400">${preset.entryPrice.toLocaleString()}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid lg:grid-cols-12 gap-6 items-start">
                {/* Left Controls Card (Inputs) */}
                <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h2 className="text-sm uppercase font-black tracking-wider text-slate-200 flex items-center gap-2">
                            <Calculator size={16} className="text-purple-400" /> Position Parameters
                        </h2>
                        <span className="text-[10px] text-slate-400 font-mono">Binance &amp; Bybit Specs</span>
                    </div>

                    {/* Trade Direction Toggle */}
                    <div>
                        <label className="text-xs font-bold text-slate-300 mb-1.5 block">Position Side:</label>
                        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
                            <button
                                onClick={() => setPositionType('Long')}
                                className={`py-2 rounded-lg font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${positionType === 'Long' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                            >
                                <TrendingUp size={14} /> LONG
                            </button>
                            <button
                                onClick={() => setPositionType('Short')}
                                className={`py-2 rounded-lg font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${positionType === 'Short' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                            >
                                <TrendingDown size={14} /> SHORT
                            </button>
                        </div>
                    </div>

                    {/* Symbol & Exchange Selection */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-slate-300 mb-1 block">Ticker Symbol:</label>
                            <input
                                type="text"
                                value={symbol}
                                onChange={(e) => setSymbol(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:border-purple-500 outline-none"
                                placeholder="BTC/USDT"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-300 mb-1 block">Exchange Maintenance:</label>
                            <select
                                value={selectedExchangeIndex}
                                onChange={(e) => setSelectedExchangeIndex(Number(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-[11px] font-bold text-white focus:border-purple-500 outline-none"
                            >
                                {EXCHANGES.map((ex, i) => (
                                    <option key={i} value={i}>{ex.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Custom MMR input if selected */}
                    {selectedExchangeIndex === EXCHANGES.length - 1 && (
                        <div>
                            <label className="text-xs font-bold text-slate-300 mb-1 block">Custom Maintenance Rate (%):</label>
                            <input
                                type="number"
                                step="0.1"
                                value={customMmr}
                                onChange={(e) => setCustomMmr(Number(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-purple-300 focus:border-purple-500 outline-none"
                            />
                        </div>
                    )}

                    {/* Entry Price ($) */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-bold text-slate-300">Entry Price ({primaryCurrencySymbol}):</label>
                            <span className="text-[10px] text-slate-400 font-mono">Current Market Entry</span>
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">{primaryCurrencySymbol}</span>
                            <input
                                type="number"
                                step="any"
                                value={entryPrice}
                                onChange={(e) => setEntryPrice(Number(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-7 pr-3 py-2 text-sm font-mono font-black text-white focus:border-purple-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Position Notional Value ($) */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-bold text-slate-300">Total Position Notional ({primaryCurrencySymbol}):</label>
                            <span className="text-[10px] text-purple-400 font-mono font-bold">Qty: {fmt(calcResults.coinQuantity, 4)} {symbol.split('/')[0]}</span>
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">{primaryCurrencySymbol}</span>
                            <input
                                type="number"
                                step="100"
                                value={positionSizeUsdt}
                                onChange={(e) => setPositionSizeUsdt(Number(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-7 pr-3 py-2 text-sm font-mono font-black text-purple-300 focus:border-purple-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Total Available Futures Wallet Balance ($) */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-bold text-slate-300">Total Futures Wallet Equity ({primaryCurrencySymbol}):</label>
                            <span className="text-[10px] text-slate-400 font-mono">Cross Collateral Pool</span>
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">{primaryCurrencySymbol}</span>
                            <input
                                type="number"
                                step="100"
                                value={walletBalance}
                                onChange={(e) => setWalletBalance(Number(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-7 pr-3 py-2 text-sm font-mono font-black text-emerald-400 focus:border-purple-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Leverage Slider */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-bold text-slate-300">Leverage Setting:</label>
                            <span className="text-sm font-black font-mono text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30">
                                {leverage}x
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="125"
                            value={leverage}
                            onChange={(e) => setLeverage(Number(e.target.value))}
                            className="w-full accent-purple-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                            <span>1x</span>
                            <span>10x</span>
                            <span>25x</span>
                            <span>50x</span>
                            <span>100x</span>
                            <span>125x</span>
                        </div>
                    </div>

                    {/* Summary Info */}
                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-medium">Initial Margin Required:</span>
                            <span className="font-mono font-bold text-white">{primaryCurrencySymbol}{fmt(calcResults.initialMargin)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-medium">Effective Cross Leverage:</span>
                            <span className="font-mono font-bold text-purple-300">{fmt(calcResults.effectiveCrossLeverage, 1)}x</span>
                        </div>
                    </div>
                </div>

                {/* Right Display Cards: Side-by-Side Comparison Matrix */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Header Delta Alert Banner */}
                    <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs sm:text-sm ${calcResults.riskScore === 'EXTREME' ? 'bg-rose-500/15 border-rose-500/40 text-rose-300' : calcResults.riskScore === 'HIGH' ? 'bg-amber-500/15 border-amber-500/40 text-amber-300' : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'}`}>
                        <div className="flex items-center gap-3">
                            <AlertTriangle size={20} className="shrink-0 animate-pulse" />
                            <div>
                                <strong className="block text-white font-bold">
                                    Liquidation Distance Delta: {fmt(calcResults.distanceDiffPct, 1)}% Difference
                                </strong>
                                <p className="text-[11px] opacity-90">
                                    Cross Mode moves your liquidation price <strong className="underline">{fmtPrice(calcResults.liqPriceDiffUsdt)} {primaryCurrencySymbol}</strong> further away, but puts 100% of your wallet equity at risk!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Side-by-Side Cards Grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        {/* 1. ISOLATED MARGIN CARD */}
                        <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 space-y-4 relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/20 text-emerald-300 border-b border-l border-emerald-500/30 text-[10px] font-black rounded-bl-xl uppercase tracking-widest">
                                ISOLATED MODE 🔒
                            </div>

                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Risk Containment</span>
                                <h3 className="text-lg font-black text-white mt-0.5">Isolated Margin</h3>
                                <p className="text-[11px] text-slate-400 leading-tight">Losses are strictly walled off to assigned margin.</p>
                            </div>

                            <div className="pt-2 border-t border-slate-800/80 space-y-3">
                                <div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Liquidation Price</span>
                                    <p className="text-2xl font-black font-mono text-emerald-400 mt-0.5">
                                        {primaryCurrencySymbol}{fmtPrice(calcResults.isoLiqPrice)}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                                        <span className="text-[10px] text-slate-400 font-bold">Distance to Liq</span>
                                        <p className="font-mono font-bold text-white mt-0.5">-{fmt(calcResults.isoDistancePct, 1)}%</p>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                                        <span className="text-[10px] text-slate-400 font-bold">Max Loss Capped</span>
                                        <p className="font-mono font-bold text-emerald-400 mt-0.5">{primaryCurrencySymbol}{fmt(calcResults.isoMaxLossUsdt)}</p>
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-medium leading-relaxed">
                                    ✅ <strong>Safe Contagion Barrier:</strong> If market crashes to {primaryCurrencySymbol}{fmtPrice(calcResults.isoLiqPrice)}, you only lose {primaryCurrencySymbol}{fmt(calcResults.isoMaxLossUsdt)}. Remaining wallet ({primaryCurrencySymbol}{fmt(calcResults.walletBalance - calcResults.isoMaxLossUsdt)}) is 100% safe!
                                </div>
                            </div>
                        </div>

                        {/* 2. CROSS MARGIN CARD */}
                        <div className="p-6 rounded-3xl bg-slate-900/90 border border-rose-500/40 space-y-4 relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 px-3 py-1 bg-rose-500/20 text-rose-300 border-b border-l border-rose-500/30 text-[10px] font-black rounded-bl-xl uppercase tracking-widest">
                                CROSS MODE 🌊
                            </div>

                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Collateral Pool</span>
                                <h3 className="text-lg font-black text-white mt-0.5">Cross Margin</h3>
                                <p className="text-[11px] text-slate-400 leading-tight">Entire wallet balance used to prevent liquidation.</p>
                            </div>

                            <div className="pt-2 border-t border-slate-800/80 space-y-3">
                                <div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Dynamic Liq Price</span>
                                    <p className="text-2xl font-black font-mono text-rose-400 mt-0.5">
                                        {primaryCurrencySymbol}{fmtPrice(calcResults.crossLiqPrice)}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                                        <span className="text-[10px] text-slate-400 font-bold">Distance to Liq</span>
                                        <p className="font-mono font-bold text-white mt-0.5">-{fmt(calcResults.crossDistancePct, 1)}%</p>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                                        <span className="text-[10px] text-slate-400 font-bold">Max Potential Loss</span>
                                        <p className="font-mono font-bold text-rose-400 mt-0.5">100% Wallet ({primaryCurrencySymbol}{fmt(calcResults.crossMaxLossUsdt)})</p>
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 font-medium leading-relaxed">
                                    ⚠️ <strong>Account Wipeout Warning:</strong> Liquidation is delayed to {primaryCurrencySymbol}{fmtPrice(calcResults.crossLiqPrice)}, but if hit, your ENTIRE wallet balance ({primaryCurrencySymbol}{fmt(calcResults.walletBalance)}) becomes ZERO!
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Log Simulation to Trade Journal Button */}
                    {onLogTrade && (
                        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                                    <Sparkles size={16} className="text-purple-400" />
                                    Import Parameters into Trade Journal
                                </h4>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Log this {symbol} position to track real-time P&amp;L and risk management.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    onLogTrade({
                                        symbol: symbol,
                                        entryPrice: entryPrice,
                                        exitPrice: calcResults.isoLiqPrice,
                                        pnl: -calcResults.initialMargin,
                                        type: positionType
                                    });
                                }}
                                className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-emerald-400 hover:from-purple-400 hover:to-emerald-300 text-slate-950 font-black text-xs rounded-xl transition shadow-lg cursor-pointer flex items-center gap-2 shrink-0 active:scale-95"
                            >
                                <Plus size={16} /> Log to Trade Log
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Comprehensive SEO Masterclass Article */}
            <div className="mt-12 p-6 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-8 text-slate-300 text-sm leading-relaxed">
                <div className="border-b border-slate-800 pb-4">
                    <span className="text-xs font-black uppercase tracking-widest text-purple-400 block mb-1">
                        Masterclass Guide &amp; Risk Mechanics
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        Cross Margin vs. Isolated Margin: Liquidation Formulas &amp; Risk Management Guide
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                        Comprehensive analysis for Binance Futures, Bybit USDT Perpetuals, OKX, and Bitget traders.
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Scale size={18} className="text-purple-400" /> 1. What is the Core Difference Between Cross and Isolated Margin?
                    </h3>
                    <p>
                        In cryptocurrency futures and perpetual contract trading, selecting between <strong>Cross Margin Mode</strong> and <strong>Isolated Margin Mode</strong> determines how your collateral is managed during unexpected market volatility:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <strong className="text-emerald-400">Isolated Margin Mode:</strong> The margin allocated to a specific trade is strictly separated from your account balance. If the market moves violently against your position, the maximum capital you can lose is limited to the initial margin (or additional margin) assigned to that isolated trade. Your remaining wallet equity remains completely untouched and safe.
                        </li>
                        <li>
                            <strong className="text-rose-400">Cross Margin Mode:</strong> All open positions in your futures account share a single combined collateral pool (your entire available wallet balance). Cross margin delays liquidation by using unallocated wallet equity to absorb unrealized losses. However, if market price hits the cross liquidation threshold, <strong>your entire futures account balance is wiped out to zero ($0)</strong>, liquidating all open positions simultaneously.
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Calculator size={18} className="text-purple-400" /> 2. Liquidation Price Mathematical Formulas
                    </h3>
                    <p>
                        Exchanges like Binance and Bybit calculate liquidation thresholds based on your entry price, position size, leverage, and Maintenance Margin Rate (MMR):
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 my-3">
                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                            <h4 className="font-bold text-emerald-400 text-xs uppercase mb-2">Isolated Long Position Formula</h4>
                            <code className="text-xs font-mono text-purple-300 block bg-slate-900 p-2 rounded border border-slate-800">
                                Liq Price = Entry * (1 - (1 / Leverage) + MMR)
                            </code>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                            <h4 className="font-bold text-rose-400 text-xs uppercase mb-2">Cross Long Position Formula</h4>
                            <code className="text-xs font-mono text-purple-300 block bg-slate-900 p-2 rounded border border-slate-800">
                                Liq Price = Entry * (1 - (Wallet Equity / Position Notional) + MMR)
                            </code>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="pt-6 border-t border-slate-800 space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <HelpCircle size={18} className="text-purple-400" /> Frequently Asked Questions (FAQ)
                    </h3>

                    <div className="space-y-3">
                        {[
                            {
                                q: "Which margin mode is better for high leverage trading (50x - 125x)?",
                                a: "Isolated Margin is strongly recommended for high leverage trading. At 50x or 125x, a tiny 1-2% price drop will trigger liquidation. Using Cross Margin at 100x leverage risks wiping out your entire account in milliseconds due to slippage."
                            },
                            {
                                q: "Can I add extra margin to an Isolated position to lower liquidation price?",
                                a: "Yes! In Isolated Mode on Binance and Bybit, you can manually deposit extra USDT into the position's margin pool at any time. This moves your liquidation price further away without risking the rest of your futures wallet."
                            },
                            {
                                q: "Does Cross Margin affect funding fee calculations?",
                                a: "No, funding fees depend strictly on the Notional Position Size (Coins * Price) and funding rate %, regardless of whether you are in Cross or Isolated Margin mode."
                            }
                        ].map((faq, idx) => (
                            <div key={idx} className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
                                <button
                                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                                    className="w-full p-4 text-left font-bold text-sm text-white flex justify-between items-center cursor-pointer hover:bg-slate-900/50"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown size={16} className={`transition-transform ${openFaqIndex === idx ? 'rotate-180 text-purple-400' : 'text-slate-500'}`} />
                                </button>
                                {openFaqIndex === idx && (
                                    <div className="p-4 pt-0 text-xs text-slate-300 border-t border-slate-900 leading-relaxed">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
