import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    TrendingUp, ArrowRight, ShieldCheck, Zap,
    DollarSign, Percent, RefreshCw, CheckCircle2, ChevronDown, HelpCircle,
    Sparkles, Scale, Layers, Award, Landmark, Lock, Plus, Share2, Check,
    Coins, Wallet, CircleDollarSign, ArrowUpRight, Info, AlertTriangle, ArrowLeft,
    Clock, BarChart2, BookOpen, Activity, Download, FileSpreadsheet, Calendar
} from 'lucide-react';
import { RelatedToolsGrid } from '../components/RelatedToolsGrid';

export interface DividendSnowballCalculatorScreenProps {
    theme?: any;
    isDarkMode?: boolean;
    primaryCurrencySymbol?: string;
    onBackToLanding?: () => void;
    onSignIn?: () => void;
}

export interface DividendPreset {
    id: string;
    name: string;
    ticker: string;
    dividendYield: number;
    dividendGrowthRate: number; // CAGR
    priceAppreciation: number;
    payoutFrequency: 'monthly' | 'quarterly';
    description: string;
}

export const DIVIDEND_PRESETS: DividendPreset[] = [
    {
        id: 'schd',
        name: 'Schwab U.S. Dividend Equity (SCHD)',
        ticker: 'SCHD',
        dividendYield: 3.50,
        dividendGrowthRate: 8.50,
        priceAppreciation: 5.50,
        payoutFrequency: 'quarterly',
        description: 'Gold standard dividend growth ETF with consistent double-digit 10-year dividend CAGR'
    },
    {
        id: 'o',
        name: 'Realty Income Corp (O)',
        ticker: 'O',
        dividendYield: 5.25,
        dividendGrowthRate: 3.80,
        priceAppreciation: 3.00,
        payoutFrequency: 'monthly',
        description: 'The Monthly Dividend Company® — Dividend Aristocrat paying monthly distributions'
    },
    {
        id: 'voo',
        name: 'Vanguard S&P 500 ETF (VOO)',
        ticker: 'VOO',
        dividendYield: 1.35,
        dividendGrowthRate: 6.50,
        priceAppreciation: 8.50,
        payoutFrequency: 'quarterly',
        description: 'Broad market benchmark combining steady dividend growth with robust capital appreciation'
    },
    {
        id: 'jepi',
        name: 'JPMorgan Equity Premium Income (JEPI)',
        ticker: 'JEPI',
        dividendYield: 7.80,
        dividendGrowthRate: 2.00,
        priceAppreciation: 2.50,
        payoutFrequency: 'monthly',
        description: 'High current monthly income generated via covered call options and lower beta exposure'
    },
    {
        id: 'custom',
        name: 'Custom Dividend Portfolio',
        ticker: 'CUSTOM',
        dividendYield: 4.00,
        dividendGrowthRate: 7.00,
        priceAppreciation: 5.00,
        payoutFrequency: 'quarterly',
        description: 'Tailor your own initial yield, annual dividend growth, and capital appreciation assumptions'
    }
];

export const DividendSnowballCalculatorScreen: React.FC<DividendSnowballCalculatorScreenProps> = ({
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
    // ---------------------------------------------------------------------------
    // STATE: PORTFOLIO & REINVESTMENT INPUTS
    // ---------------------------------------------------------------------------
    const [selectedPresetId, setSelectedPresetId] = useState<string>('schd');
    const [initialInvestment, setInitialInvestment] = useState<number>(10000);
    const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
    const [dividendYield, setDividendYield] = useState<number>(3.50);
    const [dividendGrowthRate, setDividendGrowthRate] = useState<number>(8.50);
    const [priceAppreciation, setPriceAppreciation] = useState<number>(5.50);
    const [investmentYears, setInvestmentYears] = useState<number>(20);
    const [dripEnabled, setDripEnabled] = useState<boolean>(true);
    const [monthlyExpenseTarget, setMonthlyExpenseTarget] = useState<number>(2500);

    // UI Feedback
    const [copiedLink, setCopiedLink] = useState<boolean>(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Handle Preset Switch
    const handleSelectPreset = (presetId: string) => {
        setSelectedPresetId(presetId);
        const preset = DIVIDEND_PRESETS.find(p => p.id === presetId);
        if (preset && presetId !== 'custom') {
            setDividendYield(preset.dividendYield);
            setDividendGrowthRate(preset.dividendGrowthRate);
            setPriceAppreciation(preset.priceAppreciation);
        }
    };

    // ---------------------------------------------------------------------------
    // CORE MATHEMATICS: YEAR-BY-YEAR SNOWBALL COMPOUNDING ENGINE
    // ---------------------------------------------------------------------------
    const projection = useMemo(() => {
        const rows: Array<{
            year: number;
            portfolioValue: number;
            totalInvested: number;
            annualContributions: number;
            annualDividends: number;
            monthlyDividends: number;
            yieldOnCost: number;
            cumulativeDividends: number;
        }> = [];

        let currentPortfolio = initialInvestment;
        let cumulativeInvested = initialInvestment;
        let cumulativeDividends = 0;

        // Base share math normalization
        // Assume initial unit share price = $100 for intuitive share count tracking
        let sharePrice = 100;
        let shareCount = initialInvestment > 0 ? (initialInvestment / sharePrice) : 0;
        let divPerShare = sharePrice * (dividendYield / 100);

        for (let yr = 1; yr <= investmentYears; yr++) {
            const annualContrib = monthlyContribution * 12;
            cumulativeInvested += annualContrib;

            // Buy shares throughout the year with monthly contributions at average share price
            const midYearSharePrice = sharePrice * (1 + (priceAppreciation / 100) / 2);
            const newSharesFromContrib = midYearSharePrice > 0 ? (annualContrib / midYearSharePrice) : 0;
            shareCount += newSharesFromContrib;

            // Annual dividend payout for current share count
            const annualDivPayout = shareCount * divPerShare;
            cumulativeDividends += annualDivPayout;

            // DRIP Reinvestment: Reinvest annual dividend payout into more shares
            if (dripEnabled && annualDivPayout > 0) {
                const endYearSharePrice = sharePrice * (1 + (priceAppreciation / 100));
                const dripShares = endYearSharePrice > 0 ? (annualDivPayout / endYearSharePrice) : 0;
                shareCount += dripShares;
            }

            // Apply price appreciation to share price for next cycle
            sharePrice = sharePrice * (1 + (priceAppreciation / 100));

            // Increase dividend payout per share by dividend growth rate (CAGR)
            divPerShare = divPerShare * (1 + (dividendGrowthRate / 100));

            // End of year portfolio value
            currentPortfolio = shareCount * sharePrice;

            // Yield on Cost (YOC) = Annual Dividend / Total Out-of-Pocket Invested Capital
            const yoc = cumulativeInvested > 0 ? ((annualDivPayout / cumulativeInvested) * 100) : 0;
            const monthlyDiv = annualDivPayout / 12;

            rows.push({
                year: yr,
                portfolioValue: currentPortfolio,
                totalInvested: cumulativeInvested,
                annualContributions: annualContrib,
                annualDividends: annualDivPayout,
                monthlyDividends: monthlyDiv,
                yieldOnCost: yoc,
                cumulativeDividends
            });
        }

        const finalRow = rows[rows.length - 1] || {
            year: 0,
            portfolioValue: 0,
            totalInvested: 0,
            annualDividends: 0,
            monthlyDividends: 0,
            yieldOnCost: 0,
            cumulativeDividends: 0
        };

        // Determine Milestone Years for FIRE freedom
        const milestones = [
            { label: 'Coffee & Streaming ($50/mo)', target: 50, achievedYear: null as number | null },
            { label: 'Utilities & Phone ($250/mo)', target: 250, achievedYear: null as number | null },
            { label: 'Groceries ($600/mo)', target: 600, achievedYear: null as number | null },
            { label: 'Rent / Mortgage ($1,500/mo)', target: 1500, achievedYear: null as number | null },
            { label: `Full FIRE Freedom ($${monthlyExpenseTarget.toLocaleString()}/mo)`, target: monthlyExpenseTarget, achievedYear: null as number | null }
        ];

        milestones.forEach(m => {
            const hitRow = rows.find(r => r.monthlyDividends >= m.target);
            if (hitRow) {
                m.achievedYear = hitRow.year;
            }
        });

        return {
            rows,
            finalRow,
            milestones,
            totalGain: Math.max(0, finalRow.portfolioValue - finalRow.totalInvested),
            growthMultiplier: finalRow.totalInvested > 0 ? (finalRow.portfolioValue / finalRow.totalInvested) : 1
        };
    }, [
        initialInvestment, monthlyContribution, dividendYield, dividendGrowthRate,
        priceAppreciation, investmentYears, dripEnabled, monthlyExpenseTarget
    ]);

    // CSV Exporter
    const handleExportCSV = () => {
        const headers = ['Year', 'Portfolio Value ($)', 'Total Out-of-Pocket ($)', 'Annual Dividends ($)', 'Monthly Dividends ($)', 'Yield on Cost (%)', 'Cumulative Dividends ($)'];
        const csvRows = projection.rows.map(r => [
            r.year,
            r.portfolioValue.toFixed(2),
            r.totalInvested.toFixed(2),
            r.annualDividends.toFixed(2),
            r.monthlyDividends.toFixed(2),
            r.yieldOnCost.toFixed(2) + '%',
            r.cumulativeDividends.toFixed(2)
        ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...csvRows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `dividend-snowball-${selectedPresetId}-${investmentYears}yr.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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
                <title>Dividend Snowball Calculator | Free SCHD & DRIP Compounding Tool</title>
                <meta
                    name="description"
                    content="Free Dividend Snowball Calculator and SCHD dividend growth simulator. Model DRIP compounding, annual dividend increases, yield on cost (YOC), and calculate your exact Financial Independence (FIRE) date."
                />
                <meta
                    name="keywords"
                    content="dividend snowball calculator, schd dividend snowball calculator, dividend snowball effect calculator, snowball dividend calculator, drip return calculator, dividend growth calculator, yield on cost calculator"
                />
                <link rel="canonical" href="https://tradejournall.com/tools/dividend-snowball-calculator" />

                {/* Open Graph */}
                <meta property="og:title" content="Dividend Snowball Calculator | DRIP & SCHD Growth Visualizer" />
                <meta property="og:description" content="Calculate your dividend compounding snowball effect with SCHD, Realty Income (O), and dividend aristocrats. See when your dividends cover living expenses." />
                <meta property="og:type" content="website" />

                {/* SoftwareApplication Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Dividend Snowball Calculator",
                        "applicationCategory": "FinanceApplication",
                        "operatingSystem": "All",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "description": "Interactive dividend snowball calculator modeling the compounding effects of dividend reinvestment (DRIP), annual dividend growth, and yield on cost."
                    })}
                </script>

                {/* FAQ Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "What is the dividend snowball effect?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "The dividend snowball effect occurs when you reinvest dividends (DRIP) back into dividend-paying stocks or ETFs. Each reinvestment purchases additional shares, which produce even larger dividend payouts in subsequent cycles, compounding your passive income exponentially."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How does the SCHD dividend snowball calculator work?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "The Schwab U.S. Dividend Equity ETF (SCHD) historically features an initial yield of around 3.5% paired with an impressive 8% to 11% 10-year dividend CAGR. Our calculator projects both price appreciation and annual dividend payout increases to forecast future quarterly and monthly payouts."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What is Yield on Cost (YOC)?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Yield on Cost measures annual dividend income divided by your original out-of-pocket capital invested, rather than current market price. Over 15 to 20 years with dividend growth companies, a modest 3.5% starting yield frequently snowballs into a 15% to 25%+ Yield on Cost."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How long does it take for the dividend snowball to start rolling?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "For most investors contributing regularly, the dividend snowball begins visibly accelerating around year 5 to 7. By year 10, reinvested dividends often exceed your fresh annual cash contributions."
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
                            <Sparkles size={12} /> 100% Free Wealth Tool
                        </span>
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            SCHD • O • VOO • JEPI
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleExportCSV}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
                            title="Export Year-by-Year Snowball to CSV"
                        >
                            <Download size={14} className="text-emerald-400" /> Export CSV
                        </button>
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
                        <Coins size={13} /> Exponential Compounding &amp; DRIP Visualizer
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
                        Dividend Snowball Calculator
                    </h1>
                    <p className="text-base md:text-lg text-slate-300 max-w-3xl leading-relaxed">
                        Watch your passive income compound exponentially. Model the unstoppable <strong>dividend snowball effect</strong> with dividend reinvestment (DRIP), annual dividend increases, and calculate your exact <strong>FIRE retirement milestone date</strong>.
                    </p>
                </div>

                {/* Popular Dividend ETF & Stock Presets */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                            <Layers size={14} className="text-emerald-400" /> Select Dividend Strategy Preset
                        </label>
                        <span className="text-xs text-slate-400">
                            Auto-loads historical yield &amp; dividend growth rates
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {DIVIDEND_PRESETS.map((preset) => {
                            const isSelected = selectedPresetId === preset.id;
                            return (
                                <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() => handleSelectPreset(preset.id)}
                                    className={`relative p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                        isSelected
                                            ? 'bg-emerald-600/15 border-emerald-500 ring-2 ring-emerald-500/30'
                                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-1.5">
                                        <span className={`text-sm font-bold ${isSelected ? 'text-emerald-300' : 'text-white'}`}>
                                            {preset.ticker}
                                        </span>
                                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                            {preset.dividendYield}% Yield
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-300 line-clamp-1 mb-2 font-medium">
                                        {preset.name}
                                    </span>
                                    <div className="text-[11px] text-slate-400 flex justify-between pt-1 border-t border-slate-800/60">
                                        <span>+{preset.dividendGrowthRate}% Div CAGR</span>
                                        <span className="capitalize">{preset.payoutFrequency}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Interactive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                    {/* Left Column: Form Inputs (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Box 1: Capital & Contributions */}
                        <div className="p-5 md:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm shadow-xl">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                    <Wallet size={18} />
                                </div>
                                <h2 className="text-base font-bold text-white">
                                    1. Investment Capital &amp; Monthly Savings
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Starting Portfolio Balance ($)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-semibold">$</span>
                                        <input
                                            type="number"
                                            value={initialInvestment}
                                            onChange={(e) => setInitialInvestment(Math.max(0, Number(e.target.value)))}
                                            className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                                            placeholder="10000"
                                        />
                                    </div>
                                    <div className="flex gap-1.5 mt-2">
                                        {[2500, 5000, 10000, 25000, 50000].map(amt => (
                                            <button
                                                key={amt}
                                                type="button"
                                                onClick={() => setInitialInvestment(amt)}
                                                className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                                            >
                                                ${amt >= 1000 ? `${amt / 1000}k` : amt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Monthly Contribution ($)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-semibold">$</span>
                                        <input
                                            type="number"
                                            value={monthlyContribution}
                                            onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
                                            className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                                            placeholder="500"
                                        />
                                    </div>
                                    <div className="flex gap-1.5 mt-2">
                                        {[250, 500, 1000, 1500, 2500].map(amt => (
                                            <button
                                                key={amt}
                                                type="button"
                                                onClick={() => setMonthlyContribution(amt)}
                                                className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                                            >
                                                ${amt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Box 2: Dividend Parameters & DRIP Toggle */}
                        <div className="p-5 md:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm shadow-xl">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                        <Activity size={18} />
                                    </div>
                                    <h2 className="text-base font-bold text-white">
                                        2. Yield &amp; Compounding Rates
                                    </h2>
                                </div>

                                {/* DRIP Toggle Switch */}
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-300">
                                        Reinvest Dividends (DRIP):
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setDripEnabled(!dripEnabled)}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                                            dripEnabled
                                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                                                : 'bg-slate-800 text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        <RefreshCw size={12} className={dripEnabled ? 'animate-spin' : ''} />
                                        {dripEnabled ? 'DRIP ON' : 'CASH OUT'}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Dividend Yield (%)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={dividendYield}
                                            onChange={(e) => setDividendYield(Math.max(0.1, Number(e.target.value)))}
                                            className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                                        />
                                        <span className="absolute right-3 top-2.5 text-slate-400 text-sm font-semibold">%</span>
                                    </div>
                                    <span className="text-[11px] text-slate-400 mt-1 block">Current dividend yield</span>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Annual Div Growth (%)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.5"
                                            value={dividendGrowthRate}
                                            onChange={(e) => setDividendGrowthRate(Math.max(0, Number(e.target.value)))}
                                            className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                                        />
                                        <span className="absolute right-3 top-2.5 text-slate-400 text-sm font-semibold">%</span>
                                    </div>
                                    <span className="text-[11px] text-slate-400 mt-1 block">Dividend CAGR per year</span>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Stock Price Growth (%)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.5"
                                            value={priceAppreciation}
                                            onChange={(e) => setPriceAppreciation(Math.max(0, Number(e.target.value)))}
                                            className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                                        />
                                        <span className="absolute right-3 top-2.5 text-slate-400 text-sm font-semibold">%</span>
                                    </div>
                                    <span className="text-[11px] text-slate-400 mt-1 block">Capital appreciation/yr</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800/60">
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="text-xs font-semibold text-slate-300">
                                            Investment Horizon: {investmentYears} Years
                                        </label>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="40"
                                        value={investmentYears}
                                        onChange={(e) => setInvestmentYears(Number(e.target.value))}
                                        className="w-full accent-emerald-500 cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                        <span>5 yrs</span>
                                        <span>15 yrs</span>
                                        <span>25 yrs</span>
                                        <span>40 yrs</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Target Monthly Living Expense for FIRE ($)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-semibold">$</span>
                                        <input
                                            type="number"
                                            value={monthlyExpenseTarget}
                                            onChange={(e) => setMonthlyExpenseTarget(Math.max(100, Number(e.target.value)))}
                                            className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                                            placeholder="2500"
                                        />
                                    </div>
                                    <span className="text-[11px] text-slate-400 mt-1 block">Milestone to achieve Financial Independence</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Key Results & Snowball Metrics (5 Cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Main Snowball Output Card */}
                        <div className="p-6 md:p-7 rounded-3xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/40 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                                <CircleDollarSign size={140} className="text-emerald-400" />
                            </div>

                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                                    Projected Annual Dividend Income
                                </span>
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                                    Year {investmentYears}
                                </span>
                            </div>

                            {/* Main Big Output */}
                            <div className="my-4">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl md:text-6xl font-black tracking-tight text-white font-mono">
                                        ${Math.round(projection.finalRow.annualDividends).toLocaleString()}
                                    </span>
                                    <span className="text-sm font-semibold text-emerald-300">/ year</span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-2xl font-bold text-emerald-400 font-mono">
                                        ${Math.round(projection.finalRow.monthlyDividends).toLocaleString()}
                                    </span>
                                    <span className="text-xs text-slate-400">passive income every month</span>
                                </div>
                            </div>

                            {/* Snowball Multipliers */}
                            <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Total Portfolio Net Worth:</span>
                                    <span className="font-mono font-bold text-white text-sm">
                                        ${Math.round(projection.finalRow.portfolioValue).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Total Out-of-Pocket Invested:</span>
                                    <span className="font-mono text-slate-300">
                                        ${Math.round(projection.finalRow.totalInvested).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Cumulative Dividends Collected:</span>
                                    <span className="font-mono font-bold text-emerald-400">
                                        ${Math.round(projection.finalRow.cumulativeDividends).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800/50">
                                    <span className="text-slate-400">Yield on Cost (YOC):</span>
                                    <span className="font-mono font-black text-emerald-300 text-sm">
                                        {projection.finalRow.yieldOnCost.toFixed(1)}% on invested cash
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Total Capital Multiplier:</span>
                                    <span className="font-mono font-bold text-indigo-300">
                                        {projection.growthMultiplier.toFixed(1)}x Initial Basis
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* FIRE Freedom Milestone Roadmap */}
                        <div className="p-5 md:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
                            <div className="flex items-center gap-2 mb-3 text-emerald-400">
                                <Sparkles size={16} />
                                <h3 className="text-xs font-bold uppercase tracking-wider">
                                    Financial Independence (FIRE) Milestone Tracker
                                </h3>
                            </div>
                            <div className="space-y-2.5">
                                {projection.milestones.map((m, idx) => (
                                    <div
                                        key={idx}
                                        className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                                    >
                                        <div className="flex items-center gap-2">
                                            {m.achievedYear ? (
                                                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                                            ) : (
                                                <Clock size={15} className="text-slate-500 shrink-0" />
                                            )}
                                            <span className={m.achievedYear ? 'text-white font-medium' : 'text-slate-400'}>
                                                {m.label}
                                            </span>
                                        </div>
                                        <span className={`font-mono font-bold ${m.achievedYear ? 'text-emerald-400' : 'text-slate-500'}`}>
                                            {m.achievedYear ? `Year ${m.achievedYear}` : `Beyond Year ${investmentYears}`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Year-by-Year Snowball Progression Table */}
                <div className="mb-12 p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <BarChart2 size={20} className="text-emerald-400" />
                                Year-by-Year Dividend Snowball Compounding Schedule
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Notice how reinvested dividends overtake annual cash contributions over time.
                            </p>
                        </div>
                        <button
                            onClick={handleExportCSV}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition self-start sm:self-auto shadow"
                        >
                            <FileSpreadsheet size={14} /> Download Schedule (CSV)
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs md:text-sm border-collapse font-mono">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="py-3 px-3">Year</th>
                                    <th className="py-3 px-3">Portfolio Value</th>
                                    <th className="py-3 px-3">Total Invested</th>
                                    <th className="py-3 px-3">Annual Dividend</th>
                                    <th className="py-3 px-3">Monthly Dividend</th>
                                    <th className="py-3 px-3">Yield on Cost (YOC)</th>
                                    <th className="py-3 px-3">Cumulative Dividends</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 text-slate-300">
                                {projection.rows.map((row) => (
                                    <tr key={row.year} className="hover:bg-slate-800/30 transition">
                                        <td className="py-2.5 px-3 font-bold text-emerald-400">Yr {row.year}</td>
                                        <td className="py-2.5 px-3 font-semibold text-white">${Math.round(row.portfolioValue).toLocaleString()}</td>
                                        <td className="py-2.5 px-3 text-slate-400">${Math.round(row.totalInvested).toLocaleString()}</td>
                                        <td className="py-2.5 px-3 font-bold text-emerald-300">${Math.round(row.annualDividends).toLocaleString()}</td>
                                        <td className="py-2.5 px-3 text-emerald-400 font-semibold">${Math.round(row.monthlyDividends).toLocaleString()}/mo</td>
                                        <td className="py-2.5 px-3 text-indigo-300 font-bold">{row.yieldOnCost.toFixed(1)}%</td>
                                        <td className="py-2.5 px-3 text-slate-400">${Math.round(row.cumulativeDividends).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Comprehensive SEO Content & Educational Article */}
                <article className="prose prose-invert max-w-none mb-12 p-6 md:p-10 rounded-3xl bg-slate-900/40 border border-slate-800/80">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                        What is the Dividend Snowball Effect and How Does It Compound Wealth?
                    </h2>
                    <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-4">
                        The <strong>dividend snowball calculator</strong> illustrates one of the most powerful wealth-generation engines in modern finance: <strong>dividend compounding</strong>. When you purchase high-quality dividend growth stocks or index funds (such as SCHD, Realty Income, or VOO), they reward shareholders with periodic cash distributions.
                    </p>
                    <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-4">
                        Instead of spending those dividends, an automated <strong>Dividend Reinvestment Plan (DRIP)</strong> immediately purchases additional fractional shares. In the subsequent quarter or month, those newly acquired shares generate their own dividends. When paired with companies that consistently grow their payouts annually (dividend growth rate / CAGR), your income stream starts rolling like a snowball down a steep snowy hill.
                    </p>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-emerald-300 my-6">
                        <p className="font-bold text-white mb-1">The Three Forces of the Snowball Effect:</p>
                        <ol className="list-decimal pl-5 space-y-1 text-slate-300">
                            <li><strong>Fresh Capital Contributions:</strong> Monthly cash additions increasing share count.</li>
                            <li><strong>DRIP Share Reinvestment:</strong> Dividends buying more shares without touching your paycheck.</li>
                            <li><strong>Organic Dividend Growth:</strong> Board of directors voting to increase the payout per share by 6%–10% annually.</li>
                        </ol>
                    </div>

                    <h3 className="text-xl font-bold text-white mt-8 mb-3">
                        Why SCHD is the King of the Dividend Snowball Calculator
                    </h3>
                    <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-4">
                        Across dividend investing communities like Reddit's <em>r/dividends</em>, the <strong>Schwab U.S. Dividend Equity ETF (SCHD)</strong> is considered the quintessential benchmark for long-term compounding.
                    </p>
                    <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-4">
                        Unlike fixed-income investments or high-yield covered call traps (which offer yields of 10%+ but suffer from capital erosion), SCHD screens for fundamental balance sheet health, return on equity (ROE), and 10 consecutive years of dividend payments. Historically, SCHD delivers a starting yield between 3.4% and 3.8% alongside an 8% to 11% 10-year dividend growth CAGR. As shown in our <strong>schd dividend snowball calculator</strong>, this combination turns modest monthly savings into thousands of dollars in passive income.
                    </p>

                    <h3 className="text-xl font-bold text-white mt-8 mb-3">
                        Understanding Yield on Cost (YOC) vs. Current Market Yield
                    </h3>
                    <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-4">
                        One of the most misunderstood metrics in income investing is <strong>Yield on Cost (YOC)</strong>. While current dividend yield divides the annual dividend by today’s stock price, Yield on Cost divides your current annual dividend by what you <em>originally paid</em> for the shares.
                    </p>
                    <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-4">
                        For example, if you bought shares yielding 3.5% a decade ago, and the company raised its dividend payout by 8% annually while reinvesting dividends, your Yield on Cost today might exceed <strong>15% or 20%</strong>. Every single dollar you originally invested is now returning 20 cents in fresh cash every single year!
                    </p>
                </article>

                {/* Frequently Asked Questions (FAQ Section with Schema Compliance) */}
                <div className="mb-14">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <HelpCircle size={22} className="text-emerald-400" />
                        Frequently Asked Questions: Dividend Snowball &amp; DRIP Investing
                    </h2>
                    <div className="space-y-3">
                        {[
                            {
                                q: "How long does it take to see the dividend snowball effect?",
                                a: "In the first 3 to 5 years, growth feels linear because fresh monthly savings make up the majority of portfolio expansion. However, around year 7 to 10, the snowball hits an inflection point where reinvested dividends match or exceed your personal monthly contributions. From that point forward, compounding explodes."
                            },
                            {
                                q: "How does the SCHD dividend snowball calculator compare to high-yield ETFs like JEPI?",
                                a: "Covered-call ETFs like JEPI offer high initial income (7%–9%) but limited dividend growth and capped capital appreciation. SCHD starts with a lower yield (3.5%) but increases its payout by ~8% to 10% annually. Over a 15+ year timeline, SCHD's snowball typically produces vastly higher annual dividend income and total net worth."
                            },
                            {
                                q: "Is this dividend snowball calculator completely free?",
                                a: "Yes, our dividend snowball calculator is 100% free with no sign-up or paywall required. You can model SCHD, Realty Income (O), VOO, or custom portfolios, view FIRE milestones, and export complete year-by-year CSV schedules."
                            },
                            {
                                q: "Should I turn on DRIP (Dividend Reinvestment) in a taxable brokerage account?",
                                a: "DRIP accelerates the snowball effect faster than collecting cash. However, keep in mind that in US taxable accounts, dividends are subject to dividend taxes in the year received, regardless of whether you reinvest them or take cash. In tax-advantaged accounts like a Roth IRA or 401(k), the dividend snowball compounds 100% tax-free."
                            },
                            {
                                q: "How much dividend income do I need to retire early (FIRE)?",
                                a: "Calculate your annual living expenses and divide by your expected safe portfolio yield (typically 3.5% to 4%). For example, if you need $3,000 per month ($36,000 annually), a dividend portfolio of approximately $900,000 to $1,000,000 paying 3.6% to 4.0% will cover 100% of your expenses without needing to sell shares."
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
                                        className="w-full p-4 md:p-5 text-left flex justify-between items-center text-sm md:text-base font-bold text-white hover:text-emerald-300 transition"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown
                                            size={18}
                                            className={`transform transition-transform text-slate-400 ${
                                                isOpen ? 'rotate-180 text-emerald-400' : ''
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
                        currentToolSlug="/tools/dividend-snowball-calculator"
                        category="all"
                        title="Explore More Wealth & Capital Calculators"
                        subtitle="Combine dividend growth with dollar-cost averaging, futures risk, and drawdown recovery tools."
                    />
                </div>
            </div>
        </div>
    );
};
