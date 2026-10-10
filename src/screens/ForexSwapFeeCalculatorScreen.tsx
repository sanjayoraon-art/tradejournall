import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Calculator, TrendingUp, TrendingDown, ArrowRight, ShieldCheck, Zap,
    DollarSign, Percent, RefreshCw, CheckCircle2, ChevronDown, HelpCircle,
    Sparkles, Scale, Layers, Award, Landmark, Lock, Plus, Share2, Check,
    Coins, Wallet, CircleDollarSign, ArrowUpRight, Info, AlertTriangle, ArrowLeft,
    Clock, Calendar, Moon, Sun, AlertCircle, Globe, FileText, CheckCircle, BarChart3, Shield, BookOpen
} from 'lucide-react';

export interface ForexSwapFeeCalculatorScreenProps {
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

interface PairPreset {
    name: string;
    symbol: string;
    category: 'Metals' | 'Forex' | 'Crypto' | 'Indices';
    longSwapPips: number;
    shortSwapPips: number;
    pipValuePerLot: number;
    contractSize: number;
    currency: string;
}

const PRESETS: PairPreset[] = [
    {
        name: 'Gold (XAU/USD)',
        symbol: 'XAUUSD',
        category: 'Metals',
        longSwapPips: -14.5,
        shortSwapPips: 8.2,
        pipValuePerLot: 10,
        contractSize: 100,
        currency: '$'
    },
    {
        name: 'EUR/USD Forex',
        symbol: 'EURUSD',
        category: 'Forex',
        longSwapPips: -6.8,
        shortSwapPips: 2.1,
        pipValuePerLot: 10,
        contractSize: 100000,
        currency: '$'
    },
    {
        name: 'GBP/USD Forex',
        symbol: 'GBPUSD',
        category: 'Forex',
        longSwapPips: -4.2,
        shortSwapPips: -1.8,
        pipValuePerLot: 10,
        contractSize: 100000,
        currency: '$'
    },
    {
        name: 'US30 (Dow Jones Index)',
        symbol: 'US30',
        category: 'Indices',
        longSwapPips: -8.5,
        shortSwapPips: -5.0,
        pipValuePerLot: 1,
        contractSize: 1,
        currency: '$'
    },
    {
        name: 'Bitcoin Perps (BTC/USD)',
        symbol: 'BTCUSD',
        category: 'Crypto',
        longSwapPips: -25.0,
        shortSwapPips: 12.0,
        pipValuePerLot: 1,
        contractSize: 1,
        currency: '$'
    }
];

export const ForexSwapFeeCalculatorScreen: React.FC<ForexSwapFeeCalculatorScreenProps> = ({
    theme,
    isDarkMode = true,
    primaryCurrencySymbol = '$',
    onBackToLanding,
    onSignIn,
    onLogTrade,
}) => {
    // Inputs
    const [selectedSymbol, setSelectedSymbol] = useState<string>('XAUUSD');
    const [tradeDirection, setTradeDirection] = useState<'long' | 'short'>('long');
    const [lotSize, setLotSize] = useState<number>(1.0);
    const [nightsHeld, setNightsHeld] = useState<number>(3);
    const [includesWednesday, setIncludesWednesday] = useState<boolean>(true);
    const [currency, setCurrency] = useState<string>('$');

    // Swap Rates (in pips/points)
    const [longSwapRate, setLongSwapRate] = useState<number>(-14.5);
    const [shortSwapRate, setShortSwapRate] = useState<number>(8.2);
    const [pipValuePerLot, setPipValuePerLot] = useState<number>(10);

    // UI States
    const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    // Apply Preset
    const applyPreset = (preset: PairPreset) => {
        setSelectedSymbol(preset.symbol);
        setLongSwapRate(preset.longSwapPips);
        setShortSwapRate(preset.shortSwapPips);
        setPipValuePerLot(preset.pipValuePerLot);
        setCurrency(preset.currency);
    };

    // Calculations
    const calculations = useMemo(() => {
        const activeSwapRate = tradeDirection === 'long' ? longSwapRate : shortSwapRate;

        // Effective Swap Days (Wednesday counts as 3 days due to weekend rollover settlement)
        const totalEffectiveNights = includesWednesday && nightsHeld > 0 ? nightsHeld + 2 : nightsHeld;

        // Daily Swap Cost ($ / ₹) = Lot Size * Active Swap Rate * Pip Value
        const dailySwapDollars = lotSize * activeSwapRate * (pipValuePerLot / 10);
        const totalSwapDollars = dailySwapDollars * totalEffectiveNights;

        const isEarningSwap = totalSwapDollars > 0;
        const isPayingSwap = totalSwapDollars < 0;

        return {
            activeSwapRate,
            totalEffectiveNights,
            dailySwapDollars,
            totalSwapDollars: Math.abs(totalSwapDollars),
            isEarningSwap,
            isPayingSwap,
            netSignedSwapDollars: totalSwapDollars
        };
    }, [tradeDirection, longSwapRate, shortSwapRate, lotSize, nightsHeld, includesWednesday, pipValuePerLot]);

    // Copy Summary Handler
    const handleCopySummary = () => {
        const text = `🌙 Forex & Gold Swap Fee Calculation Summary (${selectedSymbol}):
Direction: ${tradeDirection.toUpperCase()} | Lot Size: ${lotSize} Lots
Nights Held: ${nightsHeld} (Wednesday 3x Rollover: ${includesWednesday ? 'Yes' : 'No'})
Active Swap Rate: ${calculations.activeSwapRate} pips/day
-----------------------------------------
${calculations.isEarningSwap ? '🟢 Total Swap Earned' : '🔴 Total Swap Cost'}: ${currency}${calculations.totalSwapDollars.toFixed(2)}
Daily Swap Rate per Night: ${currency}${Math.abs(calculations.dailySwapDollars).toFixed(2)}
Total Effective Swap Days Charged: ${calculations.totalEffectiveNights} days
Calculated with TradeJournall (https://tradejournall.com/tools/forex-swap-fee-calculator)`;

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
                'name': 'Forex Swap Fee & Overnight Rollover Calculator',
                'url': 'https://tradejournall.com/tools/forex-swap-fee-calculator',
                'applicationCategory': 'FinanceApplication',
                'operatingSystem': 'All',
                'browserRequirements': 'Requires JavaScript',
                'description': 'Free online Forex Swap Fee & Gold Rollover Calculator. Calculate overnight holding swap costs in USD/Rupees, Wednesday 3x triple swap warning, and net profit impact for XAUUSD, EURUSD, and Crypto.',
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
                        'name': 'What is a Forex Swap Fee?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'A Forex Swap Fee (or Rollover Rate) is the interest paid or earned for holding a trading position overnight past 5:00 PM EST (22:00 UTC). Swap fees are determined by the interest rate differential between the two currencies in the pair.'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': 'Why is there a 3x Triple Swap on Wednesday night?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'Forex spot trades take 2 business days to settle (T+2). Positions held over Wednesday night rollover into Monday, covering Saturday and Sunday weekend interest. Therefore, brokers charge or pay 3 times the standard swap on Wednesday.'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': 'What is a Swap-Free (Islamic) Forex account?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'A Swap-Free account (Islamic Account) does not pay or charge overnight interest or swap fees, complying with Sharia financial principles. Instead, brokers may charge a fixed administration fee for long-held positions.'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': 'Can you earn positive swap on trades?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'Yes! If you buy a currency with a higher central bank interest rate and sell a currency with a lower interest rate (Carry Trade), your net swap rate will be positive, earning you daily interest payouts into your account.'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': 'What time is Forex swap charged?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'Forex swap fees are processed daily at server rollover time, which is 5:00 PM EST (22:00 UTC or 03:30 AM IST during daylight saving time). Any open position held past this exact minute incurs swap.'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': 'How does Gold (XAUUSD) swap work?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'Gold carries a high negative long swap rate because holding physical gold incurs storage, insurance, and leverage financing costs. Short Gold positions often earn positive or low negative swap depending on broker spreads.'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': 'What is the difference between Forex Swap and Crypto Funding Rate?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'Forex swap is an annual central bank interest differential charged once daily at 5 PM EST. Crypto funding rate is a peer-to-peer mechanism charged every 8 hours (00:00, 08:00, 16:00 UTC) to keep perpetual futures prices pegged to spot prices.'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': 'How can swing traders avoid heavy negative swap charges?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'Traders can avoid negative swap by closing positions before 5:00 PM EST, switching to Swap-Free Islamic accounts, trading futures contracts instead of spot CFDs, or structuring Carry Trades with positive swap.'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': 'Does MetaTrader (MT4 / MT5) show swap rates automatically?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'Yes! In MT4 or MT5, right-click any symbol in the Market Watch window, select Specification, and scroll down to view Swap Long and Swap Short in points/pips.'
                        }
                    },
                    {
                        '@type': 'Question',
                        'name': 'Are Forex swap rates fixed or variable?',
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': 'Swap rates are variable. They adjust periodically whenever central banks (US Fed, ECB, BOE, BOJ) change benchmark interest rates or when market liquidity changes.'
                        }
                    }
                ]
            }
        ]
    };

    const faqs = [
        {
            q: 'What is a Forex Swap Fee (Rollover Rate)?',
            a: 'A Forex Swap Fee is interest credited or debited to your trading account when you hold a position overnight past 5:00 PM EST. It is based on the interest rate differential between the base currency and quote currency set by central banks.'
        },
        {
            q: 'Why is Triple Swap charged on Wednesday?',
            a: 'Because the Forex market is closed on weekends, settlement for positions open on Wednesday night is pushed to Monday (due to standard T+2 settlement rules). Brokers charge or pay 3 days worth of interest on Wednesday to cover the weekend.'
        },
        {
            q: 'Can you earn positive swap on trades?',
            a: 'Yes! If you buy a currency with a higher central bank interest rate and sell a currency with a lower interest rate (Carry Trade), your net swap rate will be positive, earning you daily interest payouts into your trading account.'
        },
        {
            q: 'How does Swap affect Gold (XAU/USD) swing trades?',
            a: 'Gold carries high negative swap for Long positions on most brokers because holding gold incurs storage and financing costs. Always factor in swap fees when holding Gold swing trades for several days or weeks.'
        },
        {
            q: 'What is an Islamic Swap-Free account?',
            a: 'An Islamic Swap-Free trading account waives all overnight interest charges to adhere to Sharia law principles prohibiting Riba (interest). Brokers may replace swap fees with a flat administration fee after a grace period.'
        },
        {
            q: 'What exact time are Forex swap fees charged daily?',
            a: 'Forex swap fees are processed daily at server rollover time, which is 5:00 PM EST (22:00 UTC or 03:30 AM IST during daylight saving time). Any open position held past this exact minute incurs overnight swap.'
        },
        {
            q: 'What is the difference between Forex Swap and Crypto Funding Rate?',
            a: 'Forex swap is an annual central bank interest differential charged once daily at 5 PM EST. Crypto funding rate is a peer-to-peer mechanism charged every 8 hours (00:00, 08:00, 16:00 UTC) to keep perpetual futures prices pegged to spot prices.'
        },
        {
            q: 'How can swing traders avoid paying negative swap fees?',
            a: 'Traders can avoid negative swap by closing positions before 5:00 PM EST, switching to Swap-Free Islamic accounts, trading futures contracts instead of spot CFDs, or structuring Carry Trades with positive swap.'
        },
        {
            q: 'Where can I check live swap rates in MetaTrader 4 / MetaTrader 5?',
            a: 'In MT4 or MT5, right-click any symbol in the Market Watch window, select Specification, and scroll down to view Swap Long and Swap Short rates in points or pips.'
        },
        {
            q: 'Are Forex swap rates fixed or do brokers change them?',
            a: 'Swap rates are variable. They adjust periodically whenever central banks (US Fed, ECB, BOE, BOJ) update interest rates or when broker liquidity conditions shift.'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
            <Helmet>
                <title>Forex Swap Fee Calculator & Overnight Rollover Tool | TradeJournall</title>
                <meta name="description" content="Free Forex Swap Fee & Gold Rollover Calculator. Calculate overnight holding swap costs in USD/Rupees, Wednesday 3x triple swap warning, and net profit impact for XAUUSD, EURUSD, and Crypto." />
                <meta name="keywords" content="forex swap fee calculator, swap fee calculator, overnight swap calculator gold, exness swap fee calculator, rollover interest calculator, tradejournall" />
                <link rel="canonical" href="https://tradejournall.com/tools/forex-swap-fee-calculator" />
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
                            <Moon className="w-3.5 h-3.5" /> Forex & CFD Calculator Suite
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {/* Hero Title */}
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
                        Forex & Gold <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Swap Fee & Rollover Calculator</span>
                    </h1>
                    <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
                        Calculate exact overnight holding swap fees, Wednesday 3x triple swap multipliers, and net interest costs for Gold (XAUUSD), Forex pairs & Crypto.
                    </p>
                </div>

                {/* Preset Quick Selector */}
                <div className="mb-8">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center sm:text-left">
                        ⚡ Select Instrument Preset:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {PRESETS.map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => applyPreset(preset)}
                                className={`p-3 rounded-xl text-left border transition-all ${selectedSymbol === preset.symbol
                                        ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10'
                                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                                    }`}
                            >
                                <div className="font-semibold text-sm truncate">{preset.name}</div>
                                <div className="text-xs text-slate-400 mt-1">
                                    Long: {preset.longSwapPips} | Short: {preset.shortSwapPips}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Grid: Inputs vs Results */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
                    {/* Left Panel: Controls & Input Form (5 Cols) */}
                    <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
                        {/* Trade Direction */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                Position Direction
                            </label>
                            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                                <button
                                    onClick={() => setTradeDirection('long')}
                                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${tradeDirection === 'long'
                                            ? 'bg-emerald-500 text-slate-950 shadow-md'
                                            : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    Long (Buy)
                                </button>
                                <button
                                    onClick={() => setTradeDirection('short')}
                                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${tradeDirection === 'short'
                                            ? 'bg-rose-500 text-white shadow-md'
                                            : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    Short (Sell)
                                </button>
                            </div>
                        </div>

                        {/* Symbol Name & Currency */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Instrument Symbol</label>
                                <input
                                    type="text"
                                    value={selectedSymbol}
                                    onChange={(e) => setSelectedSymbol(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Account Currency</label>
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                >
                                    <option value="$">USD ($)</option>
                                    <option value="₹">INR (₹)</option>
                                    <option value="€">EUR (€)</option>
                                    <option value="£">GBP (£)</option>
                                </select>
                            </div>
                        </div>

                        {/* Trade Parameters */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Lot Size (Standard Lots)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={lotSize}
                                    onChange={(e) => setLotSize(Number(e.target.value))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Nights Held Overnight</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={nightsHeld}
                                    onChange={(e) => setNightsHeld(Number(e.target.value))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        {/* Wednesday Rollover Switch */}
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-amber-400" />
                                <div>
                                    <span className="text-xs font-bold text-white block">Includes Wednesday Night?</span>
                                    <span className="text-[11px] text-slate-400 block">Applies 3x Triple Swap Multiplier</span>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={includesWednesday}
                                onChange={(e) => setIncludesWednesday(e.target.checked)}
                                className="w-4 h-4 accent-emerald-500 cursor-pointer"
                            />
                        </div>

                        {/* Broker Swap Rates in Pips */}
                        <div className="space-y-3 pt-2 border-t border-slate-800/80">
                            <span className="block text-xs font-bold uppercase tracking-wider text-emerald-400">
                                ⚙️ Broker Swap Rates (Pips/Points per day)
                            </span>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Long Swap Rate (Pips)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={longSwapRate}
                                        onChange={(e) => setLongSwapRate(Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Short Swap Rate (Pips)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={shortSwapRate}
                                        onChange={(e) => setShortSwapRate(Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Results & Cards (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Summary Metrics Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Total Swap Fee */}
                            <div className={`border rounded-2xl p-5 shadow-lg ${calculations.isEarningSwap
                                    ? 'bg-slate-900/90 border-emerald-500/30 shadow-emerald-500/5'
                                    : 'bg-slate-900/90 border-rose-500/30 shadow-rose-500/5'
                                }`}>
                                <div className="text-xs text-slate-400 font-medium flex items-center justify-between mb-1">
                                    <span>Total Swap Cost / Credit</span>
                                    <Moon className="w-4 h-4 text-amber-400" />
                                </div>
                                <div className={`text-2xl sm:text-3xl font-black ${calculations.isEarningSwap ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {calculations.isEarningSwap ? '+' : '-'}{currency}{calculations.totalSwapDollars.toFixed(2)}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-1">
                                    {calculations.isEarningSwap ? 'Credit added to account' : 'Deducted from balance'}
                                </div>
                            </div>

                            {/* Daily Swap Rate */}
                            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
                                <div className="text-xs text-slate-400 font-medium mb-1">Daily Swap Rate</div>
                                <div className="text-xl font-bold text-white">
                                    {currency}{Math.abs(calculations.dailySwapDollars).toFixed(2)} / night
                                </div>
                                <div className="text-[11px] text-slate-500 mt-1">
                                    Rate: {calculations.activeSwapRate} pips
                                </div>
                            </div>

                            {/* Effective Charged Days */}
                            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
                                <div className="text-xs text-slate-400 font-medium mb-1">Effective Swap Days</div>
                                <div className="text-xl font-bold text-amber-400">
                                    {calculations.totalEffectiveNights} Days Charged
                                </div>
                                <div className="text-[11px] text-slate-500 mt-1">
                                    {includesWednesday ? 'Includes 3x Wednesday Rollover' : 'Standard 1x daily count'}
                                </div>
                            </div>
                        </div>

                        {/* Wednesday 3x Warning Banner */}
                        {includesWednesday && (
                            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3">
                                <AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />
                                <div>
                                    <h4 className="text-sm font-bold text-amber-300">Wednesday 3x Rollover Multiplier Active</h4>
                                    <p className="text-xs text-slate-300 mt-0.5">
                                        Because Forex trades settle in 2 days (T+2), positions held past Wednesday 5 PM EST cover Saturday & Sunday interest. Your swap is multiplied by 3 for that night.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Action Bar */}
                        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                            <span className="text-xs text-slate-400">
                                Calculated for {selectedSymbol} ({tradeDirection.toUpperCase()})
                            </span>
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

                {/* Comprehensive SEO Content & Educational Article */}
                <article className="mt-16 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 max-w-5xl mx-auto space-y-10 text-slate-300 text-sm leading-relaxed shadow-2xl">
                    <header className="border-b border-slate-800 pb-8">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest mb-2">
                            <BookOpen className="w-4 h-4" /> Comprehensive Trading Guide & Masterclass
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
                            Mastering Forex Swap Fees, Rollover Rates & Wednesday 3x Multipliers
                        </h2>
                        <p className="text-slate-400 text-base leading-relaxed">
                            In Forex, CFD, and Precious Metals (Gold/Silver) trading, a **Swap Fee** (also called a **Rollover Rate** or **Overnight Holding Fee**) is the interest paid or earned for maintaining an open position past 5:00 PM EST (22:00 UTC). Whether you are a swing trader holding positions for days or an institutional carry trader earning daily yields, understanding swap mechanics is essential to preserving your net trading profits.
                        </p>
                    </header>

                    {/* Section 1: Swap Calculation Formula */}
                    <section className="space-y-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-emerald-400" />
                            1. Forex Swap Calculation Formulas Explained
                        </h3>
                        <p className="text-slate-300">
                            Brokers calculate swap fees based on the interest rate differential between the base currency and quote currency set by central banks (e.g., US Federal Reserve vs European Central Bank). Swap can be quoted in **Pips/Points** or **Percentage APR**.
                        </p>
                        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                            <div className="text-xs font-mono font-bold text-slate-400 uppercase">Standard Pip-Based Formula:</div>
                            <code className="block bg-slate-900 p-3.5 rounded-xl text-xs sm:text-sm text-emerald-400 font-mono border border-slate-800">
                                Daily Swap ($) = Lot Size × Swap Rate (in pips) × Pip Value per Lot
                            </code>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-400">
                                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                                    <strong className="text-white block mb-1">Example A: Long Gold (XAU/USD)</strong>
                                    Holding 1.0 Lot Gold with -14.5 pips swap rate ($1 pip value per 0.1):<br />
                                    1.0 × -14.5 × $1.00 = <span className="text-rose-400 font-bold">-$14.50 / night</span>
                                </div>
                                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                                    <strong className="text-white block mb-1">Example B: Short EUR/USD Carry</strong>
                                    Holding 2.0 Lots EUR/USD with +2.1 pips swap rate ($10 pip value):<br />
                                    2.0 × +2.1 × $10.00 = <span className="text-emerald-400 font-bold">+$42.00 earned / night</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Wednesday 3x Triple Swap Rollover Settlement */}
                    <section className="space-y-4 pt-6 border-t border-slate-800">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-amber-400" />
                            2. Why is There a 3x Triple Swap Charged on Wednesday Night?
                        </h3>
                        <p className="text-slate-300">
                            Standard Forex spot transactions operate under **T+2 Settlement** rules (trades take 2 business days to clear). Because global financial markets are closed on Saturday and Sunday, positions held overnight past 5:00 PM EST on **Wednesday** settle on Monday of the following week.
                        </p>
                        
                        {/* Visual Settlement Flow */}
                        <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/30 space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                                📅 T+2 Settlement Timeline (Wednesday Night Rollover)
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                                    <span className="text-slate-400 block font-mono mb-1">Wednesday 5:00 PM</span>
                                    <strong className="text-white block">Trade Open</strong>
                                    <span className="text-amber-400 text-[11px]">Rolls over</span>
                                </div>
                                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                                    <span className="text-slate-400 block font-mono mb-1">Thursday</span>
                                    <strong className="text-white block">+1 Day Settlement</strong>
                                </div>
                                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                                    <span className="text-slate-400 block font-mono mb-1">Sat + Sun</span>
                                    <strong className="text-amber-400 block">+2 Weekend Days</strong>
                                </div>
                                <div className="p-3 bg-slate-900 rounded-xl border border-amber-500/40 bg-amber-500/10">
                                    <span className="text-amber-400 block font-mono mb-1">Monday</span>
                                    <strong className="text-amber-300 block">3 Days Interest Settlement</strong>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                💡 <em>Note: Some CFDs (such as US30 or Crude Oil) charge triple swap on Friday instead of Wednesday depending on asset class settlement rules. Always check your broker’s contract specification.</em>
                            </p>
                        </div>
                    </section>

                    {/* Section 3: Major Brokers Swap Benchmark Comparison */}
                    <section className="space-y-4 pt-6 border-t border-slate-800">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-emerald-400" />
                            3. Benchmark Swap Rates Across Popular Retail Brokers
                        </h3>
                        <p className="text-slate-300">
                            Brokers add their own financing markup spread to central bank interest rates. Below is a benchmark comparison of standard swap charges across major global Forex brokers:
                        </p>
                        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800 uppercase tracking-wider">
                                    <tr>
                                        <th className="p-3.5">Instrument</th>
                                        <th className="p-3.5">Direction</th>
                                        <th className="p-3.5">Exness / IC Markets</th>
                                        <th className="p-3.5">Pepperstone / XM</th>
                                        <th className="p-3.5">Net Impact per 1 Lot</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                                    <tr className="hover:bg-slate-900/40">
                                        <td className="p-3.5 font-bold text-amber-400">Gold (XAU/USD)</td>
                                        <td className="p-3.5 font-semibold text-emerald-400">Long (Buy)</td>
                                        <td className="p-3.5">-14.5 pips</td>
                                        <td className="p-3.5">-18.2 pips</td>
                                        <td className="p-3.5 text-rose-400 font-mono font-bold">-$14.50 to -$18.20 / night</td>
                                    </tr>
                                    <tr className="hover:bg-slate-900/40">
                                        <td className="p-3.5 font-bold text-amber-400">Gold (XAU/USD)</td>
                                        <td className="p-3.5 font-semibold text-rose-400">Short (Sell)</td>
                                        <td className="p-3.5">+8.2 pips</td>
                                        <td className="p-3.5">+5.4 pips</td>
                                        <td className="p-3.5 text-emerald-400 font-mono font-bold">+$5.40 to +$8.20 earned</td>
                                    </tr>
                                    <tr className="hover:bg-slate-900/40">
                                        <td className="p-3.5 font-bold text-slate-200">EUR/USD Forex</td>
                                        <td className="p-3.5 font-semibold text-emerald-400">Long (Buy)</td>
                                        <td className="p-3.5">-6.8 pips</td>
                                        <td className="p-3.5">-7.5 pips</td>
                                        <td className="p-3.5 text-rose-400 font-mono font-bold">-$6.80 to -$7.50 / night</td>
                                    </tr>
                                    <tr className="hover:bg-slate-900/40">
                                        <td className="p-3.5 font-bold text-slate-200">USD/JPY Forex</td>
                                        <td className="p-3.5 font-semibold text-emerald-400">Long (Buy)</td>
                                        <td className="p-3.5">+12.4 pips</td>
                                        <td className="p-3.5">+10.8 pips</td>
                                        <td className="p-3.5 text-emerald-400 font-mono font-bold">+$10.80 to +$12.40 earned</td>
                                    </tr>
                                    <tr className="hover:bg-slate-900/40">
                                        <td className="p-3.5 font-bold text-purple-400">Bitcoin (BTC/USD)</td>
                                        <td className="p-3.5 font-semibold text-emerald-400">Long (Buy)</td>
                                        <td className="p-3.5">-25.0 pips (or 0% Swap-Free)</td>
                                        <td className="p-3.5">-30.0 pips</td>
                                        <td className="p-3.5 text-rose-400 font-mono font-bold">-$25.00 / night</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Section 4: Positive Swap Carry Trade Strategy */}
                    <section className="space-y-4 pt-6 border-t border-slate-800">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                            4. Positive Swap Carry Trading Strategy: How Traders Earn Interest
                        </h3>
                        <p className="text-slate-300">
                            A **Carry Trade** is an institutional trading strategy where a trader buys a currency with a high central bank interest rate (e.g., US Federal Reserve at 5.25%) while selling a currency with a low interest rate (e.g., Bank of Japan at 0.25%).
                        </p>
                        <div className="p-5 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/30 rounded-2xl space-y-2">
                            <h4 className="text-sm font-bold text-emerald-400">🟢 Real-World Carry Trade Example: Long USD/JPY</h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                When holding a 5.0 Lot Long USD/JPY position over 30 days with a positive swap of +$12.00 per lot per night:<br />
                                <strong>Net Monthly Interest Yield:</strong> 5 Lots × $12.00 × 30 Days = <span className="text-emerald-400 font-bold">$1,800 USD in passive swap income</span> credited directly to your trading account balance regardless of minor price fluctuations.
                            </p>
                        </div>
                    </section>

                    {/* Section 5: Swap-Free (Islamic Accounts) */}
                    <section className="space-y-4 pt-6 border-t border-slate-800">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Shield className="w-5 h-5 text-cyan-400" />
                            5. Swap-Free (Islamic Accounts) vs Standard Accounts
                        </h3>
                        <p className="text-slate-300">
                            In Islamic finance, receiving or paying overnight interest is strictly prohibited under **Sharia principles (Riba)**. Most modern brokers offer **Islamic Swap-Free Accounts** where swap charges are completely removed.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                                <h4 className="font-bold text-emerald-400 mb-1">✅ Standard Trading Account</h4>
                                <ul className="space-y-1 text-slate-400 list-disc pl-4">
                                    <li>Earns positive swap on carry trades</li>
                                    <li>Pays negative swap on high-rate currencies</li>
                                    <li>Subject to Wednesday 3x triple rollover</li>
                                </ul>
                            </div>
                            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                                <h4 className="font-bold text-cyan-400 mb-1">☪️ Islamic Swap-Free Account</h4>
                                <ul className="space-y-1 text-slate-400 list-disc pl-4">
                                    <li>Zero overnight interest debited or credited</li>
                                    <li>Sharia-compliant for Muslim traders</li>
                                    <li>Brokers may apply flat admin fee after 7-14 days</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Accordion Section */}
                    <section className="space-y-4 pt-6 border-t border-slate-800">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-emerald-400" />
                            6. Frequently Asked Questions (FAQs)
                        </h3>
                        <div className="space-y-3">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                        className="w-full p-4 text-left font-semibold text-slate-200 flex items-center justify-between hover:bg-slate-900/50 transition-colors text-xs sm:text-sm"
                                    >
                                        <span className="pr-4">{faq.q}</span>
                                        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openFaqIndex === index ? 'rotate-180 text-emerald-400' : ''}`} />
                                    </button>
                                    {openFaqIndex === index && (
                                        <div className="px-4 pb-4 text-xs text-slate-400 border-t border-slate-800/60 pt-3 leading-relaxed bg-slate-900/30">
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
