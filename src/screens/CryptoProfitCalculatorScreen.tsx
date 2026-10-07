import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Calculator, TrendingUp, TrendingDown, ArrowRight, ShieldCheck, Zap,
    DollarSign, Percent, RefreshCw, CheckCircle2, ChevronDown, HelpCircle,
    Sparkles, Scale, Layers, Award, Landmark, Lock, Plus, Share2, Check,
    Coins, Wallet, CircleDollarSign, ArrowUpRight, Info
} from 'lucide-react';

interface CryptoProfitCalculatorScreenProps {
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
    buyPrice: number;
    targetPrice: number;
    investment: number;
    ladderTargets: [number, number, number, number]; // 4 step prices
}

const PRESETS: PresetOption[] = [
    {
        name: 'Bitcoin Cycle Swing (BTC)',
        symbol: 'BTC/USDT',
        buyPrice: 95000,
        targetPrice: 150000,
        investment: 5000,
        ladderTargets: [115000, 135000, 150000, 180000]
    },
    {
        name: 'Ethereum Breakout (ETH)',
        symbol: 'ETH/USDT',
        buyPrice: 2700,
        targetPrice: 4800,
        investment: 2500,
        ladderTargets: [3400, 4100, 4800, 6000]
    },
    {
        name: 'Solana High Beta (SOL)',
        symbol: 'SOL/USDT',
        buyPrice: 190,
        targetPrice: 380,
        investment: 1500,
        ladderTargets: [250, 310, 380, 500]
    },
    {
        name: 'Altcoin 5x Runner',
        symbol: 'ALT/USDT',
        buyPrice: 1.20,
        targetPrice: 6.00,
        investment: 1000,
        ladderTargets: [2.00, 3.50, 6.00, 10.00]
    }
];

interface ExchangeFeePreset {
    name: string;
    feePct: number;
}

const EXCHANGES: ExchangeFeePreset[] = [
    { name: 'Binance (0.10%)', feePct: 0.10 },
    { name: 'Bybit (0.06%)', feePct: 0.06 },
    { name: 'CoinDCX (0.20%)', feePct: 0.20 },
    { name: 'Coinbase (0.60%)', feePct: 0.60 },
    { name: 'Zero Fee Tier (0.00%)', feePct: 0.00 }
];

export const CryptoProfitCalculatorScreen: React.FC<CryptoProfitCalculatorScreenProps> = ({
    theme,
    isDarkMode = true,
    primaryCurrencySymbol = '$',
    onBackToLanding,
    onSignIn,
    onLogTrade
}) => {
    // Mode toggle: 'single' (Quick Profit & Tax) vs 'ladder' (Staged Exit Ladder)
    const [calcMode, setCalcMode] = useState<'single' | 'ladder'>('single');

    // Preset & Currency
    const [currencySymbol, setCurrencySymbol] = useState<string>(primaryCurrencySymbol);
    const [symbol, setSymbol] = useState('BTC/USDT');

    // Input States
    const [investmentAmount, setInvestmentAmount] = useState<number>(5000); // in currency
    const [buyPrice, setBuyPrice] = useState<number>(95000);
    const [targetPrice, setTargetPrice] = useState<number>(150000);
    const [exchangeFeeIndex, setExchangeFeeIndex] = useState<number>(0);

    // Tax Settings
    const [applyTax, setApplyTax] = useState<boolean>(false);
    const [taxRatePct, setTaxRatePct] = useState<number>(30); // 30% default (India/Short-term)
    const [applyTds, setApplyTds] = useState<boolean>(false); // 1% TDS

    // Staged Ladder Settings (Percentages must sum to 100% or moonbag)
    const [ladderP1, setLadderP1] = useState<number>(115000);
    const [ladderPct1, setLadderPct1] = useState<number>(20); // Sell 20%
    const [ladderP2, setLadderP2] = useState<number>(135000);
    const [ladderPct2, setLadderPct2] = useState<number>(30); // Sell 30%
    const [ladderP3, setLadderP3] = useState<number>(150000);
    const [ladderPct3, setLadderPct3] = useState<number>(30); // Sell 30%
    const [ladderP4, setLadderP4] = useState<number>(180000); // Moonbag target
    const [ladderPct4, setLadderPct4] = useState<number>(20); // Moonbag 20%

    // UI state
    const [copied, setCopied] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    // Load preset
    const handlePresetSelect = (idx: number) => {
        const p = PRESETS[idx];
        setSymbol(p.symbol);
        setBuyPrice(p.buyPrice);
        setTargetPrice(p.targetPrice);
        setInvestmentAmount(p.investment);
        setLadderP1(p.ladderTargets[0]);
        setLadderP2(p.ladderTargets[1]);
        setLadderP3(p.ladderTargets[2]);
        setLadderP4(p.ladderTargets[3]);
    };

    // Fees calculation
    const feeRateDecimal = (EXCHANGES[exchangeFeeIndex].feePct) / 100;

    // Single Target Calculation
    const singleResults = useMemo(() => {
        const inv = Math.max(investmentAmount, 1);
        const bPrice = Math.max(buyPrice, 0.000001);
        const sPrice = Math.max(targetPrice, 0.000001);

        // Coin quantity bought
        const coinsBought = inv / bPrice;

        // Buy fee
        const buyFee = inv * feeRateDecimal;
        const netInvested = inv; // Initial capital deployed

        // Exit valuation before fees
        const grossExitValue = coinsBought * sPrice;

        // Sell fee
        const sellFee = grossExitValue * feeRateDecimal;
        const totalFees = buyFee + sellFee;

        // Gross Profit (before tax)
        const grossProfit = grossExitValue - inv;
        const netProfitBeforeTax = grossProfit - totalFees;

        // Tax & TDS calculation
        let taxAmount = 0;
        let tdsAmount = 0;
        if (applyTax && netProfitBeforeTax > 0) {
            taxAmount = netProfitBeforeTax * (taxRatePct / 100);
        }
        if (applyTds) {
            tdsAmount = grossExitValue * 0.01; // 1% of total transaction value
        }

        // Net In-Hand Profit
        const netInHandProfit = netProfitBeforeTax - taxAmount - tdsAmount;
        const finalCashInHand = inv + netInHandProfit;
        const netRoiPct = (netInHandProfit / inv) * 100;

        // Break-Even Price (Price needed to cover 2-way exchange fees)
        // bPrice * (1 + fee) / (1 - fee)
        const breakEvenPrice = bPrice * ((1 + feeRateDecimal) / (1 - feeRateDecimal));

        // "Free Ride / Principal Recovery" Price:
        // Price at which selling 50% coins pays back 100% investment
        // Or at current target price: how many coins to sell to pull out exact initial capital
        const coinsToSellForCapitalRecovery = Math.min(coinsBought, inv / sPrice);
        const pctToSellForCapitalRecovery = (coinsToSellForCapitalRecovery / coinsBought) * 100;
        const remainingRiskFreeCoins = Math.max(0, coinsBought - coinsToSellForCapitalRecovery);
        const remainingRiskFreeValue = remainingRiskFreeCoins * sPrice;

        return {
            coinsBought,
            buyFee,
            sellFee,
            totalFees,
            grossExitValue,
            grossProfit,
            taxAmount,
            tdsAmount,
            netInHandProfit,
            finalCashInHand,
            netRoiPct,
            breakEvenPrice,
            coinsToSellForCapitalRecovery,
            pctToSellForCapitalRecovery,
            remainingRiskFreeCoins,
            remainingRiskFreeValue
        };
    }, [investmentAmount, buyPrice, targetPrice, feeRateDecimal, applyTax, taxRatePct, applyTds]);

    // Staged Ladder Exit Calculation
    const ladderResults = useMemo(() => {
        const inv = Math.max(investmentAmount, 1);
        const bPrice = Math.max(buyPrice, 0.000001);
        const totalCoins = inv / bPrice;

        const tiers = [
            { id: 1, label: 'Tier 1 (Capital Return)', price: ladderP1, pct: ladderPct1 },
            { id: 2, label: 'Tier 2 (Bank Profit)', price: ladderP2, pct: ladderPct2 },
            { id: 3, label: 'Tier 3 (Euphoria Exit)', price: ladderP3, pct: ladderPct3 },
            { id: 4, label: 'Tier 4 (Moonbag Runner)', price: ladderP4, pct: ladderPct4 }
        ];

        let totalCashGenerated = 0;
        let totalSellFees = 0;
        const tierBreakdown = tiers.map(t => {
            const coinsToSell = (totalCoins * t.pct) / 100;
            const grossCash = coinsToSell * t.price;
            const fee = grossCash * feeRateDecimal;
            const netCash = grossCash - fee;
            const gainFromEntryPct = ((t.price - bPrice) / bPrice) * 100;

            totalCashGenerated += netCash;
            totalSellFees += fee;

            return {
                ...t,
                coinsToSell,
                grossCash,
                netCash,
                gainFromEntryPct
            };
        });

        const initialBuyFee = inv * feeRateDecimal;
        const totalFees = initialBuyFee + totalSellFees;
        const netProfit = totalCashGenerated - inv;
        const totalRoiPct = (netProfit / inv) * 100;

        return {
            totalCoins,
            tierBreakdown,
            totalCashGenerated,
            totalFees,
            netProfit,
            totalRoiPct
        };
    }, [investmentAmount, buyPrice, ladderP1, ladderPct1, ladderP2, ladderPct2, ladderP3, ladderPct3, ladderP4, ladderPct4, feeRateDecimal]);

    // Formatters
    const fmt = (val: number, decimals: number = 2) => {
        if (isNaN(val)) return '0.00';
        return val.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    };

    const fmtCoin = (val: number) => {
        if (isNaN(val)) return '0.00';
        if (val < 0.001) return val.toFixed(6);
        if (val < 1) return val.toFixed(4);
        return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    };

    // Copy Plan to Clipboard
    const handleCopyPlan = () => {
        const text = calcMode === 'single'
            ? `📊 Crypto Profit Plan (${symbol}):\n• Investment: ${currencySymbol}${fmt(investmentAmount)}\n• Buy: ${currencySymbol}${fmt(buyPrice)} | Target: ${currencySymbol}${fmt(targetPrice)}\n• Net Profit: ${currencySymbol}${fmt(singleResults.netInHandProfit)} (${fmt(singleResults.netRoiPct, 1)}% ROI)\n• Break-Even Price: ${currencySymbol}${fmt(singleResults.breakEvenPrice)}\nCalculated via tradejournall.com`
            : `🪜 Crypto Staged Exit Ladder (${symbol}):\n• Total Invested: ${currencySymbol}${fmt(investmentAmount)} (${fmtCoin(ladderResults.totalCoins)} tokens)\n• Tier 1 (${ladderPct1}% @ ${currencySymbol}${fmt(ladderP1)}): ${currencySymbol}${fmt(ladderResults.tierBreakdown[0].netCash)}\n• Tier 2 (${ladderPct2}% @ ${currencySymbol}${fmt(ladderP2)}): ${currencySymbol}${fmt(ladderResults.tierBreakdown[1].netCash)}\n• Tier 3 (${ladderPct3}% @ ${currencySymbol}${fmt(ladderP3)}): ${currencySymbol}${fmt(ladderResults.tierBreakdown[2].netCash)}\n• Moonbag (${ladderPct4}% @ ${currencySymbol}${fmt(ladderP4)}): ${currencySymbol}${fmt(ladderResults.tierBreakdown[3].netCash)}\n• Total Return: ${currencySymbol}${fmt(ladderResults.totalCashGenerated)} (+${fmt(ladderResults.totalRoiPct, 1)}%)\nCalculated via tradejournall.com`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Schema Data
    const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "SoftwareApplication",
                "name": "Crypto Profit & Staged Exit Ladder Calculator",
                "operatingSystem": "All",
                "applicationCategory": "FinanceApplication",
                "description": "Free interactive crypto profit calculator with exchange fee deduction, tax calculation, and multi-tier staged profit taking exit ladder (DCA-out strategy).",
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
                        "name": "How to accurately calculate crypto profit after exchange fees?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Gross profit is simply (Sell Price - Buy Price) * Quantity. However, true net profit requires deducting the Maker/Taker exchange fee for both entry and exit transactions (typically 0.06% to 0.2% each way). Our calculator automatically deducts these 2-way fees and displays your exact in-hand cash."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What is a Crypto Staged Exit Ladder (DCA Out)?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "A staged exit ladder is a strategy where an investor scales out of a profitable position in pre-planned percentages at specific price levels (e.g. selling 20% at a 50% pump, 30% at 2x, 25% at 3x, and keeping 25% as a Moonbag). This eliminates emotional market timing and locks in risk-free profit."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How does the 'Free Ride / Capital Recovery' rule work in crypto?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "The free ride rule calculates the exact number of tokens you need to sell at a profit to recoup 100% of your initial deposited principal. Once sold, your remaining tokens carry zero downside financial risk."
                        }
                    }
                ]
            }
        ]
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 pb-16">
            <Helmet>
                <title>Crypto Profit Calculator &amp; Staged Exit Ladder (After Fees &amp; Tax) - TradeJournall</title>
                <meta
                    name="description"
                    content="Free interactive Crypto Profit Calculator &amp; Staged Exit Ladder Strategy Tool. Calculate exact net in-hand profit after exchange fees &amp; taxes, break-even price, and DCA-out scaling targets."
                />
                <meta
                    name="keywords"
                    content="crypto profit calculator, crypto exit strategy calculator, crypto take profit ladder calculator, bitcoin profit calculator, crypto dca out calculator, crypto fee calculator, tradejournall"
                />
                <link rel="canonical" href="https://tradejournall.com/tools/crypto-profit-exit-ladder-calculator" />
                <meta property="og:title" content="Crypto Profit Calculator &amp; Staged Exit Ladder" />
                <meta
                    property="og:description"
                    content="Calculate net crypto profit after exchange fees, model staged take-profit exit ladders, and eliminate bull run FOMO."
                />
            </Helmet>

            {/* Structured Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />

            {/* Top Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    {onBackToLanding && (
                        <button
                            onClick={onBackToLanding}
                            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                        >
                            <ArrowRight size={18} className="rotate-180" />
                        </button>
                    )}
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                                <CircleDollarSign size={16} />
                            </span>
                            <span className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider">
                                High-Intent Strategy Tool
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                            Crypto Profit &amp; Exit Ladder Calculator 🚀
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Currency Switcher */}
                    <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                        <button
                            onClick={() => setCurrencySymbol('$')}
                            className={`px-3 py-1 text-xs font-black rounded-lg transition ${currencySymbol === '$' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                        >
                            $ USD
                        </button>
                        <button
                            onClick={() => setCurrencySymbol('₹')}
                            className={`px-3 py-1 text-xs font-black rounded-lg transition ${currencySymbol === '₹' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                        >
                            ₹ INR
                        </button>
                    </div>

                    <button
                        onClick={handleCopyPlan}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        title="Copy summary plan to clipboard"
                    >
                        {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                        <span>{copied ? 'Copied!' : 'Share Plan'}</span>
                    </button>
                </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex flex-col sm:flex-row gap-3 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <button
                    onClick={() => setCalcMode('single')}
                    className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${calcMode === 'single' ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                >
                    <Calculator size={17} />
                    <span>Quick Profit &amp; Net Tax Mode</span>
                </button>
                <button
                    onClick={() => setCalcMode('ladder')}
                    className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${calcMode === 'ladder' ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                >
                    <Layers size={17} />
                    <span>Staged Exit Ladder (DCA Out)</span>
                    <span className="text-[10px] bg-purple-900/60 text-purple-200 border border-purple-400/40 px-1.5 py-0.5 rounded uppercase font-black">PRO</span>
                </button>
            </div>

            {/* Quick 1-Click Presets */}
            <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <Zap size={14} className="text-amber-400" /> 1-Click Market Presets:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESETS.map((p, idx) => (
                        <button
                            key={idx}
                            onClick={() => handlePresetSelect(idx)}
                            className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 text-left transition text-xs group cursor-pointer hover:bg-slate-800/50"
                        >
                            <span className="font-extrabold text-white block group-hover:text-emerald-400 transition truncate">
                                {p.name}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                                {currencySymbol}{fmt(p.buyPrice, 0)} ➔ {currencySymbol}{fmt(p.targetPrice, 0)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Interactive Workstation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT COLUMN: Controls & Parameters */}
                <div className="lg:col-span-5 space-y-5">
                    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                <Wallet size={15} className="text-emerald-400" /> Investment Parameters
                            </span>
                            <span className="text-xs font-mono font-bold text-emerald-400">{symbol}</span>
                        </div>

                        {/* Input 1: Total Investment */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                                <label className="text-slate-300 font-bold">Total Investment Capital</label>
                                <span className="font-mono text-emerald-400 font-bold">{currencySymbol}{fmt(investmentAmount)}</span>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                                    {currencySymbol}
                                </span>
                                <input
                                    type="number"
                                    min="1"
                                    step="100"
                                    value={investmentAmount}
                                    onChange={(e) => setInvestmentAmount(Math.max(1, parseFloat(e.target.value) || 0))}
                                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 font-mono text-white text-sm outline-none transition"
                                />
                            </div>
                        </div>

                        {/* Input 2: Buy Price */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                                <label className="text-slate-300 font-bold">Average Buy Price (Entry)</label>
                                <span className="font-mono text-slate-400">{currencySymbol}{fmt(buyPrice)}</span>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                                    {currencySymbol}
                                </span>
                                <input
                                    type="number"
                                    min="0.000001"
                                    step="any"
                                    value={buyPrice}
                                    onChange={(e) => setBuyPrice(Math.max(0.000001, parseFloat(e.target.value) || 0))}
                                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 font-mono text-white text-sm outline-none transition"
                                />
                            </div>
                        </div>

                        {/* Mode-Specific Inputs */}
                        {calcMode === 'single' ? (
                            <>
                                {/* Input 3: Target Sell Price */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center text-xs">
                                        <label className="text-slate-300 font-bold">Target Exit Price</label>
                                        <span className="font-mono text-emerald-400 font-bold">
                                            {targetPrice > buyPrice ? `+${fmt(((targetPrice - buyPrice) / buyPrice) * 100, 1)}%` : 'Below Entry'}
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                                            {currencySymbol}
                                        </span>
                                        <input
                                            type="number"
                                            min="0.000001"
                                            step="any"
                                            value={targetPrice}
                                            onChange={(e) => setTargetPrice(Math.max(0.000001, parseFloat(e.target.value) || 0))}
                                            className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 font-mono text-white text-sm outline-none transition"
                                        />
                                    </div>
                                    {/* Slider for quick multiples */}
                                    <div className="pt-2 flex gap-1.5">
                                        {[1.25, 1.5, 2.0, 3.0, 5.0].map((mult) => (
                                            <button
                                                key={mult}
                                                type="button"
                                                onClick={() => setTargetPrice(buyPrice * mult)}
                                                className="flex-1 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500 text-[11px] font-mono text-slate-300 transition cursor-pointer"
                                            >
                                                {mult}x
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Ladder Target Inputs */
                            <div className="space-y-3 pt-2 border-t border-slate-800/80">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black uppercase text-purple-400">4-Tier Exit Targets</span>
                                    <span className="text-[10px] text-slate-400 font-bold">Total: {ladderPct1 + ladderPct2 + ladderPct3 + ladderPct4}%</span>
                                </div>

                                {/* Tier 1 */}
                                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-emerald-400">Tier 1 (Capital Return)</span>
                                        <span className="font-mono text-slate-400">Sell {ladderPct1}%</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            value={ladderP1}
                                            onChange={(e) => setLadderP1(parseFloat(e.target.value) || 0)}
                                            placeholder="Target Price"
                                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white outline-none"
                                        />
                                        <input
                                            type="number"
                                            value={ladderPct1}
                                            onChange={(e) => setLadderPct1(parseFloat(e.target.value) || 0)}
                                            placeholder="Sell %"
                                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Tier 2 */}
                                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-teal-400">Tier 2 (Bank Profit)</span>
                                        <span className="font-mono text-slate-400">Sell {ladderPct2}%</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            value={ladderP2}
                                            onChange={(e) => setLadderP2(parseFloat(e.target.value) || 0)}
                                            placeholder="Target Price"
                                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white outline-none"
                                        />
                                        <input
                                            type="number"
                                            value={ladderPct2}
                                            onChange={(e) => setLadderPct2(parseFloat(e.target.value) || 0)}
                                            placeholder="Sell %"
                                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Tier 3 */}
                                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-indigo-400">Tier 3 (Euphoria Exit)</span>
                                        <span className="font-mono text-slate-400">Sell {ladderPct3}%</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            value={ladderP3}
                                            onChange={(e) => setLadderP3(parseFloat(e.target.value) || 0)}
                                            placeholder="Target Price"
                                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white outline-none"
                                        />
                                        <input
                                            type="number"
                                            value={ladderPct3}
                                            onChange={(e) => setLadderPct3(parseFloat(e.target.value) || 0)}
                                            placeholder="Sell %"
                                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Tier 4 */}
                                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-purple-400">Tier 4 (Moonbag Runner)</span>
                                        <span className="font-mono text-slate-400">Hold {ladderPct4}%</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            value={ladderP4}
                                            onChange={(e) => setLadderP4(parseFloat(e.target.value) || 0)}
                                            placeholder="Target Price"
                                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white outline-none"
                                        />
                                        <input
                                            type="number"
                                            value={ladderPct4}
                                            onChange={(e) => setLadderPct4(parseFloat(e.target.value) || 0)}
                                            placeholder="Hold %"
                                            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Exchange Fee Selector */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                            <label className="text-xs text-slate-300 font-bold flex items-center justify-between">
                                <span>Exchange Fee Tier</span>
                                <span className="font-mono text-emerald-400 font-bold">{EXCHANGES[exchangeFeeIndex].feePct}%</span>
                            </label>
                            <select
                                value={exchangeFeeIndex}
                                onChange={(e) => setExchangeFeeIndex(parseInt(e.target.value))}
                                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 outline-none cursor-pointer"
                            >
                                {EXCHANGES.map((ex, idx) => (
                                    <option key={idx} value={idx}>{ex.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Optional Tax & TDS Accordion */}
                        <div className="pt-2 border-t border-slate-800/80 space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={applyTax}
                                        onChange={(e) => setApplyTax(e.target.checked)}
                                        className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                                    />
                                    <span>Apply Capital Gains Tax ({taxRatePct}%)</span>
                                </label>
                                {applyTax && (
                                    <input
                                        type="number"
                                        value={taxRatePct}
                                        onChange={(e) => setTaxRatePct(parseFloat(e.target.value) || 0)}
                                        className="w-16 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-right font-mono text-xs text-white"
                                    />
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="text-xs text-slate-300 font-bold flex items-center gap-1.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={applyTds}
                                        onChange={(e) => setApplyTds(e.target.checked)}
                                        className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                                    />
                                    <span>Apply 1% TDS on Total Sale (India)</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Mathematical Outputs & Strategic Matrix */}
                <div className="lg:col-span-7 space-y-5">
                    {calcMode === 'single' ? (
                        /* SINGLE PROFIT CALCULATION CARD */
                        <div className="space-y-4">
                            {/* Primary Result Banner */}
                            <div className={`p-6 rounded-3xl border ${singleResults.netInHandProfit >= 0 ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/40 shadow-emerald-500/10' : 'bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border-rose-500/40 shadow-rose-500/10'} shadow-2xl space-y-4`}>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        Net In-Hand Profit (After Fees &amp; Tax)
                                    </span>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-black font-mono ${singleResults.netInHandProfit >= 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>
                                        {singleResults.netRoiPct >= 0 ? '+' : ''}{fmt(singleResults.netRoiPct, 1)}% ROI
                                    </span>
                                </div>

                                <div>
                                    <h2 className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${singleResults.netInHandProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {singleResults.netInHandProfit >= 0 ? '+' : '-'}{currencySymbol}{fmt(Math.abs(singleResults.netInHandProfit))}
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Total Cash Realized: <strong className="text-white font-mono">{currencySymbol}{fmt(singleResults.finalCashInHand)}</strong> (Principal {currencySymbol}{fmt(investmentAmount)} + Profit)
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Gross Profit</span>
                                        <span className="font-mono font-bold text-white mt-0.5 block">{currencySymbol}{fmt(singleResults.grossProfit)}</span>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Exchange Fees</span>
                                        <span className="font-mono font-bold text-rose-400 mt-0.5 block">-{currencySymbol}{fmt(singleResults.totalFees)}</span>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Tax &amp; TDS</span>
                                        <span className="font-mono font-bold text-rose-400 mt-0.5 block">
                                            {applyTax || applyTds ? `-${currencySymbol}${fmt(singleResults.taxAmount + singleResults.tdsAmount)}` : '0.00'}
                                        </span>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Break-Even</span>
                                        <span className="font-mono font-bold text-amber-300 mt-0.5 block">{currencySymbol}{fmt(singleResults.breakEvenPrice)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* "Risk-Free Principal Recovery" Alert Box */}
                            <div className="p-5 rounded-3xl bg-slate-900/90 border border-purple-500/30 space-y-3">
                                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
                                    <ShieldCheck size={16} className="text-purple-400" />
                                    <span>"Free Ride" Capital Recovery Strategy</span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    At target price of <strong className="text-white font-mono">{currencySymbol}{fmt(targetPrice)}</strong>, you only need to sell <strong className="text-emerald-400 font-mono">{fmt(singleResults.pctToSellForCapitalRecovery, 1)}%</strong> ({fmtCoin(singleResults.coinsToSellForCapitalRecovery)} {symbol.split('/')[0]}) to pull out your entire <strong>{currencySymbol}{fmt(investmentAmount)}</strong> initial investment!
                                </p>
                                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 flex items-center justify-between">
                                    <span>Remaining Free-Ride Tokens:</span>
                                    <span className="font-mono font-bold text-white">
                                        {fmtCoin(singleResults.remainingRiskFreeCoins)} {symbol.split('/')[0]} ({currencySymbol}{fmt(singleResults.remainingRiskFreeValue)})
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* STAGED EXIT LADDER MATRIX CARD */
                        <div className="space-y-4">
                            <div className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/40 shadow-2xl space-y-5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        Cumulative Ladder Realized Cash
                                    </span>
                                    <span className="px-2.5 py-1 rounded-full text-xs font-black font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                        +{fmt(ladderResults.totalRoiPct, 1)}% Blended ROI
                                    </span>
                                </div>

                                <div>
                                    <h2 className="text-4xl sm:text-5xl font-black font-mono text-purple-300 tracking-tight">
                                        {currencySymbol}{fmt(ladderResults.totalCashGenerated)}
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Net Profit Realized: <strong className="text-emerald-400 font-mono">+{currencySymbol}{fmt(ladderResults.netProfit)}</strong> (Total Fees: {currencySymbol}{fmt(ladderResults.totalFees)})
                                    </p>
                                </div>

                                {/* Visual Staged Ladder Breakdown Table */}
                                <div className="space-y-2 pt-2">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                                        Exit Level Distribution Schedule
                                    </span>
                                    <div className="space-y-2">
                                        {ladderResults.tierBreakdown.map((t) => (
                                            <div
                                                key={t.id}
                                                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                                            >
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-xs text-white">{t.label}</span>
                                                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                                                            +{fmt(t.gainFromEntryPct, 0)}%
                                                        </span>
                                                    </div>
                                                    <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                                                        Sell {t.pct}% ({fmtCoin(t.coinsToSell)} coins) @ {currencySymbol}{fmt(t.price)}
                                                    </span>
                                                </div>
                                                <div className="sm:text-right">
                                                    <span className="text-xs font-black font-mono text-emerald-400 block">
                                                        +{currencySymbol}{fmt(t.netCash)}
                                                    </span>
                                                    <span className="text-[10px] text-slate-500">In-Hand Cash</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Log to Trade Journal Integration */}
                    {onLogTrade && (
                        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                                    <Sparkles size={16} className="text-emerald-400" />
                                    Import Plan into Trade Journal
                                </h4>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Log this {symbol} exit strategy to track execution and discipline.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    onLogTrade({
                                        symbol: symbol,
                                        entryPrice: buyPrice,
                                        exitPrice: calcMode === 'single' ? targetPrice : ladderP3,
                                        pnl: calcMode === 'single' ? singleResults.netInHandProfit : ladderResults.netProfit,
                                        type: 'Long'
                                    });
                                }}
                                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl transition shadow-lg cursor-pointer flex items-center gap-2 shrink-0 active:scale-95"
                            >
                                <Plus size={16} /> Log to Journal
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Comprehensive SEO Masterclass Article */}
            <div className="mt-12 p-6 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-8 text-slate-300 text-sm leading-relaxed">
                <div className="border-b border-slate-800 pb-4">
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-400 block mb-1">
                        Masterclass Guide &amp; Trading Psychology
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        How to Calculate Crypto Profits Accurately &amp; Plan Staged Exit Ladders
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                        The definitive guide to calculating gross vs net crypto profit, accounting for exchange fees &amp; taxes, and scaling out without FOMO.
                    </p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Scale size={18} className="text-emerald-400" /> 1. Gross Profit vs. Net In-Hand Profit: Why Most Beginners Lose Money
                    </h3>
                    <p>
                        Most retail crypto calculators simply multiply your coin quantity by the price difference. However, real-world execution on exchanges like <strong>Binance, Bybit, Coinbase, and CoinDCX</strong> incurs hidden friction:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <strong className="text-white">Two-Way Exchange Fees:</strong> You pay a Maker/Taker fee when you purchase the asset, and another fee when you sell. On large positions, 0.1% to 0.6% fees on both sides can eliminate up to 10% of small percentage scalps.
                        </li>
                        <li>
                            <strong className="text-white">Crypto Taxes &amp; TDS:</strong> In countries like India, Section 115BBH levies a flat 30% tax on crypto gains without loss offsets, plus a mandatory 1% TDS on every sell transaction. In the US, short-term capital gains can tax up to 37% depending on income brackets.
                        </li>
                        <li>
                            <strong className="text-white">Slippage &amp; Order Book Depth:</strong> Selling a large order into illiquid altcoin order books often causes average exit price slippage of 0.5% - 2.0%.
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Layers size={18} className="text-purple-400" /> 2. What is a Staged Profit Exit Ladder (DCA Out)?
                    </h3>
                    <p>
                        In every crypto bull market, the biggest psychological trap is <em>"Round-Tripping"</em>—watching your portfolio pump 5x, refusing to sell because you think it will 10x, and then holding all the way back down to zero during the bear market.
                    </p>
                    <p>
                        Institutional whales solve this with a <strong>Staged Exit Ladder (Reverse Dollar-Cost Averaging)</strong>:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 my-3">
                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                            <h4 className="font-bold text-emerald-400 text-xs uppercase mb-1">Level 1: Capital Recovery (+50% to +100%)</h4>
                            <p className="text-xs text-slate-400">
                                Sell 20% - 30% of your holdings to withdraw 100% of your original invested cash. Your initial capital is safe in your bank, and the rest is a "Free Trade".
                            </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                            <h4 className="font-bold text-purple-400 text-xs uppercase mb-1">Level 2: Moonbag Allocation (Last 15% - 25%)</h4>
                            <p className="text-xs text-slate-400">
                                Never sell 100% of your coins. Keep a 20% Moonbag that you hold indefinitely in case Bitcoin or an altcoin runs to unforeseen all-time highs.
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="pt-6 border-t border-slate-800 space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <HelpCircle size={18} className="text-emerald-400" /> Frequently Asked Questions (FAQ)
                    </h3>

                    <div className="space-y-3">
                        {[
                            {
                                q: "How do I calculate Break-Even Price after exchange fees?",
                                a: "Break-Even Price = Entry Price * (1 + Buy Fee Rate) / (1 - Sell Fee Rate). For a 0.1% fee on a $100,000 Bitcoin buy, your break-even exit price is $100,200.40."
                            },
                            {
                                q: "Should I sell all my crypto at once or use an exit ladder?",
                                a: "Using a staged exit ladder is mathematically superior to attempting to time the exact market top. Staged selling locks in profit along the way while ensuring you don't suffer FOMO if price keeps rising."
                            },
                            {
                                q: "Does this calculator account for Indian 30% tax and 1% TDS?",
                                a: "Yes! Simply enable the 'Apply 30% Tax' and 'Apply 1% TDS' toggles in the parameters panel, and the calculator will automatically compute and deduct them from your net in-hand payout."
                            }
                        ].map((faq, idx) => (
                            <div key={idx} className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
                                <button
                                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                                    className="w-full p-4 text-left font-bold text-sm text-white flex justify-between items-center cursor-pointer hover:bg-slate-900/50"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown size={16} className={`transition-transform ${openFaqIndex === idx ? 'rotate-180 text-emerald-400' : 'text-slate-500'}`} />
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
