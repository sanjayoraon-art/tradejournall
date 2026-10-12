import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Calculator, TrendingUp, TrendingDown, ArrowRight, ShieldCheck, Zap,
    DollarSign, Percent, RefreshCw, CheckCircle2, ChevronDown, HelpCircle,
    Sparkles, Scale, Layers, Award, Landmark, Lock, Plus, Share2, Check,
    Coins, Wallet, CircleDollarSign, ArrowUpRight, Info, AlertTriangle, ArrowLeft,
    Clock, Calendar, Download, FileSpreadsheet, Trash2, Globe, BarChart3,
    BookOpen, CheckCircle, PieChart, Activity
} from 'lucide-react';
import { RelatedToolsGrid } from '../components/RelatedToolsGrid';

export interface DcaCalculatorScreenProps {
    theme?: any;
    isDarkMode?: boolean;
    primaryCurrencySymbol?: string;
    onBackToLanding?: () => void;
    onSignIn?: () => void;
}

// Asset Presets for Quick Mode
interface AssetPreset {
    id: string;
    name: string;
    symbol: string;
    category: 'crypto' | 'stock' | 'custom';
    annualCagr: number;
    defaultPrice: number;
    recommendedFeePct: number;
}

const ASSET_PRESETS: AssetPreset[] = [
    { id: 'btc', name: 'Bitcoin (BTC)', symbol: 'BTC', category: 'crypto', annualCagr: 45, defaultPrice: 68000, recommendedFeePct: 0.25 },
    { id: 'eth', name: 'Ethereum (ETH)', symbol: 'ETH', category: 'crypto', annualCagr: 38, defaultPrice: 2600, recommendedFeePct: 0.25 },
    { id: 'sol', name: 'Solana (SOL)', symbol: 'SOL', category: 'crypto', annualCagr: 52, defaultPrice: 155, recommendedFeePct: 0.30 },
    { id: 'spy', name: 'S&P 500 ETF (SPY)', symbol: 'SPY', category: 'stock', annualCagr: 10.5, defaultPrice: 580, recommendedFeePct: 0.05 },
    { id: 'qqq', name: 'Nasdaq 100 (QQQ)', symbol: 'QQQ', category: 'stock', annualCagr: 15.2, defaultPrice: 490, recommendedFeePct: 0.05 },
    { id: 'custom', name: 'Custom Strategy', symbol: 'CUSTOM', category: 'custom', annualCagr: 12.0, defaultPrice: 100, recommendedFeePct: 0.10 }
];

// Multi-Buy Row Item for Tab 2
interface BuyOrder {
    id: string;
    date: string;
    buyPrice: number;
    amountInvested: number;
    fee: number;
}

export const DcaCalculatorScreen: React.FC<DcaCalculatorScreenProps> = ({
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
    // TABS: 'simulator' (Future Growth) vs 'tracker' (Spreadsheet Entry Price)
    // ---------------------------------------------------------------------------
    const [activeTab, setActiveTab] = useState<'simulator' | 'tracker'>('simulator');
    const [currencySymbol, setCurrencySymbol] = useState<string>('$');

    // ---------------------------------------------------------------------------
    // TAB 1: DCA GROWTH & WEALTH SIMULATOR INPUTS
    // ---------------------------------------------------------------------------
    const [selectedPreset, setSelectedPreset] = useState<string>('btc');
    const [initialLumpSum, setInitialLumpSum] = useState<number>(1000);
    const [recurringAmount, setRecurringAmount] = useState<number>(100);
    const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'biweekly' | 'monthly'>('weekly');
    const [investmentYears, setInvestmentYears] = useState<number>(5);
    const [annualReturnRate, setAnnualReturnRate] = useState<number>(45);
    const [feeRatePct, setFeeRatePct] = useState<number>(0.25); // exchange / broker fee %
    const [adjustInflation, setAdjustInflation] = useState<boolean>(false);
    const [inflationRatePct, setInflationRatePct] = useState<number>(3.0);

    // ---------------------------------------------------------------------------
    // TAB 2: MULTI-BUY SPREADSHEET TRACKER INPUTS (Average Entry Price with fees)
    // ---------------------------------------------------------------------------
    const [trackerAsset, setTrackerAsset] = useState<string>('Bitcoin (BTC)');
    const [currentMarketPrice, setCurrentMarketPrice] = useState<number>(68000);
    const [buyOrders, setBuyOrders] = useState<BuyOrder[]>([
        { id: '1', date: '2025-01-15', buyPrice: 42000, amountInvested: 500, fee: 1.25 },
        { id: '2', date: '2025-04-10', buyPrice: 61000, amountInvested: 500, fee: 1.25 },
        { id: '3', date: '2025-08-05', buyPrice: 54000, amountInvested: 500, fee: 1.25 },
        { id: '4', date: '2025-11-20', buyPrice: 69000, amountInvested: 500, fee: 1.25 },
        { id: '5', date: '2026-03-12', buyPrice: 62000, amountInvested: 500, fee: 1.25 }
    ]);

    // UI Feedback
    const [copiedShareLink, setCopiedShareLink] = useState<boolean>(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Handle Preset Switch in Tab 1
    const handleSelectPreset = (presetId: string) => {
        setSelectedPreset(presetId);
        const p = ASSET_PRESETS.find(item => item.id === presetId);
        if (p) {
            setAnnualReturnRate(p.annualCagr);
            setFeeRatePct(p.recommendedFeePct);
            if (presetId === 'btc') setCurrentMarketPrice(68000);
            else if (presetId === 'eth') setCurrentMarketPrice(2600);
            else if (presetId === 'sol') setCurrentMarketPrice(155);
            else if (presetId === 'spy') setCurrentMarketPrice(580);
            else if (presetId === 'qqq') setCurrentMarketPrice(490);
        }
    };

    // ---------------------------------------------------------------------------
    // TAB 1 MATH: RECURRING DCA PROJECTIONS
    // ---------------------------------------------------------------------------
    const simulationResult = useMemo(() => {
        // Periods per year
        let periodsPerYear = 52;
        if (frequency === 'daily') periodsPerYear = 365;
        else if (frequency === 'weekly') periodsPerYear = 52;
        else if (frequency === 'biweekly') periodsPerYear = 26;
        else if (frequency === 'monthly') periodsPerYear = 12;

        const totalPeriods = Math.max(1, Math.round(investmentYears * periodsPerYear));
        
        // Effective rate per period
        const nominalAnnualRate = annualReturnRate / 100;
        const netAnnualRate = adjustInflation
            ? (1 + nominalAnnualRate) / (1 + (inflationRatePct / 100)) - 1
            : nominalAnnualRate;

        const ratePerPeriod = Math.pow(1 + netAnnualRate, 1 / periodsPerYear) - 1;
        const feeMultiplier = 1 - (feeRatePct / 100);

        let balance = initialLumpSum * feeMultiplier;
        let totalInvested = initialLumpSum;
        let totalFees = initialLumpSum * (feeRatePct / 100);

        // Track yearly progression for chart & schedule table
        interface YearData {
            year: number;
            totalInvested: number;
            portfolioValue: number;
            netProfit: number;
            feesPaid: number;
        }

        const yearlyMilestones: YearData[] = [];
        let periodCount = 0;

        for (let y = 1; y <= investmentYears; y++) {
            const periodsThisYear = (y === investmentYears)
                ? (totalPeriods - periodCount)
                : Math.round(periodsPerYear);

            for (let p = 0; p < periodsThisYear; p++) {
                // Compound existing balance
                balance = balance * (1 + ratePerPeriod);
                // Add recurring deposit minus fee
                const netDeposit = recurringAmount * feeMultiplier;
                balance += netDeposit;
                totalInvested += recurringAmount;
                totalFees += recurringAmount * (feeRatePct / 100);
                periodCount++;
            }

            yearlyMilestones.push({
                year: y,
                totalInvested: Math.round(totalInvested),
                portfolioValue: Math.round(balance),
                netProfit: Math.round(balance - totalInvested),
                feesPaid: Math.round(totalFees)
            });
        }

        const finalPortfolioValue = balance;
        const totalNetProfit = finalPortfolioValue - totalInvested;
        const totalProfitPct = totalInvested > 0 ? (totalNetProfit / totalInvested) * 100 : 0;
        const wealthMultiplier = totalInvested > 0 ? (finalPortfolioValue / totalInvested) : 1;

        return {
            totalInvested,
            finalPortfolioValue,
            totalNetProfit,
            totalProfitPct,
            totalFees,
            wealthMultiplier,
            yearlyMilestones,
            periodsPerYear,
            totalPeriods
        };
    }, [initialLumpSum, recurringAmount, frequency, investmentYears, annualReturnRate, feeRatePct, adjustInflation, inflationRatePct]);

    // ---------------------------------------------------------------------------
    // TAB 2 MATH: MULTI-BUY SPREADSHEET (AVERAGE ENTRY PRICE WITH FEES)
    // ---------------------------------------------------------------------------
    const trackerResult = useMemo(() => {
        let totalSpent = 0;
        let totalCoinsAccumulated = 0;
        let totalFeesPaid = 0;

        const processedOrders = buyOrders.map((order) => {
            const netCapital = Math.max(0, order.amountInvested - order.fee);
            const unitsBought = order.buyPrice > 0 ? netCapital / order.buyPrice : 0;
            totalSpent += order.amountInvested;
            totalFeesPaid += order.fee;
            totalCoinsAccumulated += unitsBought;

            return {
                ...order,
                unitsBought
            };
        });

        // Weighted Average Entry Price Formula:
        // True Average Entry Price = (Total Capital Invested + Total Fees) / Total Units Accumulated
        const trueAverageEntryPrice = totalCoinsAccumulated > 0
            ? totalSpent / totalCoinsAccumulated
            : 0;

        const currentTotalValue = totalCoinsAccumulated * currentMarketPrice;
        const unrealizedPnl = currentTotalValue - totalSpent;
        const unrealizedPnlPct = totalSpent > 0 ? (unrealizedPnl / totalSpent) * 100 : 0;

        return {
            processedOrders,
            totalSpent,
            totalCoinsAccumulated,
            totalFeesPaid,
            trueAverageEntryPrice,
            currentTotalValue,
            unrealizedPnl,
            unrealizedPnlPct
        };
    }, [buyOrders, currentMarketPrice]);

    // Add New Buy Order
    const handleAddBuyRow = () => {
        const nextId = String(buyOrders.length + 1);
        const lastOrder = buyOrders[buyOrders.length - 1];
        const newOrder: BuyOrder = {
            id: nextId,
            date: new Date().toISOString().split('T')[0],
            buyPrice: lastOrder ? lastOrder.buyPrice : 65000,
            amountInvested: 500,
            fee: 1.25
        };
        setBuyOrders([...buyOrders, newOrder]);
    };

    // Remove Buy Order
    const handleRemoveBuyRow = (id: string) => {
        if (buyOrders.length <= 1) return;
        setBuyOrders(buyOrders.filter(o => o.id !== id));
    };

    // Update Buy Row
    const handleUpdateBuyRow = (id: string, field: keyof BuyOrder, val: any) => {
        setBuyOrders(buyOrders.map(o => {
            if (o.id === id) {
                return { ...o, [field]: val };
            }
            return o;
        }));
    };

    // Quick Preset Loads for Tab 2
    const handleLoadSampleBtc = () => {
        setTrackerAsset('Bitcoin (BTC)');
        setCurrentMarketPrice(68000);
        setBuyOrders([
            { id: '1', date: '2024-01-10', buyPrice: 42000, amountInvested: 500, fee: 1.50 },
            { id: '2', date: '2024-04-15', buyPrice: 63000, amountInvested: 500, fee: 1.50 },
            { id: '3', date: '2024-08-05', buyPrice: 55000, amountInvested: 500, fee: 1.50 },
            { id: '4', date: '2024-11-18', buyPrice: 89000, amountInvested: 500, fee: 1.50 },
            { id: '5', date: '2025-05-20', buyPrice: 94000, amountInvested: 500, fee: 1.50 }
        ]);
    };

    const handleLoadSampleSpy = () => {
        setTrackerAsset('S&P 500 (SPY)');
        setCurrentMarketPrice(585);
        setBuyOrders([
            { id: '1', date: '2024-02-01', buyPrice: 495, amountInvested: 1000, fee: 0.00 },
            { id: '2', date: '2024-05-01', buyPrice: 510, amountInvested: 1000, fee: 0.00 },
            { id: '3', date: '2024-08-01', buyPrice: 540, amountInvested: 1000, fee: 0.00 },
            { id: '4', date: '2024-11-01', buyPrice: 575, amountInvested: 1000, fee: 0.00 },
            { id: '5', date: '2025-02-01', buyPrice: 590, amountInvested: 1000, fee: 0.00 }
        ]);
    };

    // CSV Download Function
    const handleDownloadCsv = () => {
        if (activeTab === 'tracker') {
            let csv = `Order,Date,Asset,Buy Price ($),Amount Invested ($),Fee ($),Units Acquired\n`;
            trackerResult.processedOrders.forEach((o, idx) => {
                csv += `${idx + 1},${o.date},"${trackerAsset}",${o.buyPrice},${o.amountInvested},${o.fee},${o.unitsBought.toFixed(6)}\n`;
            });
            csv += `\nSUMMARY,,Total Invested:,${trackerResult.totalSpent},Total Fees:,${trackerResult.totalFeesPaid},Total Units:,${trackerResult.totalCoinsAccumulated.toFixed(6)}\n`;
            csv += `,,,True Average Entry Price:,$${trackerResult.trueAverageEntryPrice.toFixed(2)},Current Value:,$${trackerResult.currentTotalValue.toFixed(2)},Unrealized PnL:,$${trackerResult.unrealizedPnl.toFixed(2)} (${trackerResult.unrealizedPnlPct.toFixed(2)}%)\n`;

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dca_tracker_average_entry_price_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        } else {
            let csv = `Year,Total Invested ($),Net Profit ($),Portfolio Value ($),Cumulative Fees ($)\n`;
            simulationResult.yearlyMilestones.forEach(m => {
                csv += `${m.year},${m.totalInvested},${m.netProfit},${m.portfolioValue},${m.feesPaid}\n`;
            });
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dca_growth_simulation_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    // Share link
    const handleCopyShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopiedShareLink(true);
        setTimeout(() => setCopiedShareLink(false), 2500);
    };

    // ---------------------------------------------------------------------------
    // FAQ ITEMS (Targeting all primary & secondary keywords)
    // ---------------------------------------------------------------------------
    const faqs = [
        {
            q: 'What is a DCA Calculator and how does Dollar-Cost Averaging work?',
            a: 'A DCA (Dollar-Cost Averaging) Calculator simulates or tracks the strategy of dividing the total amount to be invested across periodic purchases of a target asset (such as Bitcoin, Ethereum, or S&P 500 stocks). Instead of timing the market with a lump sum, DCA smooths out volatility by purchasing more units when prices drop and fewer units when prices rise, reducing psychological stress and emotional FOMO.'
        },
        {
            q: 'How to calculate DCA in crypto and determine the average entry price?',
            a: 'To calculate your DCA average entry price in crypto, divide the total dollars spent across all purchases (including exchange taker/maker trading fees) by the total number of cryptocurrency coins/tokens acquired. The formula is: True Average Price = Total Fiat Spent / Total Coins Acquired. For example, if you spent $1,000 on Bitcoin at $40,000 (0.025 BTC) and $1,000 at $60,000 (0.0166 BTC), you spent $2,000 for 0.0416 BTC, resulting in a weighted average entry price of $48,076.'
        },
        {
            q: 'Why should I include trading fees when calculating my Bitcoin DCA average cost basis?',
            a: 'Every time you execute an order on platforms like Coinbase, Kraken, or Binance, fees (0.10% to 1.50%) or bid-ask spreads reduce the actual amount of crypto you receive. Over years of weekly or daily recurring purchases, fees can eat into 2% to 5% of your total return. Factoring fees into your DCA spreadsheet ensures your true tax cost basis and breakeven exit prices are 100% accurate.'
        },
        {
            q: 'Is DCA better for volatile cryptos or traditional index stocks?',
            a: 'DCA is mathematically most powerful in highly volatile markets with long-term upward trajectories, making it exceptionally effective for Bitcoin and crypto during bear market drawdowns. For broad index stocks (like the S&P 500 or Nasdaq-100), DCA provides a disciplined, automated savings habit that eliminates the catastrophic risk of buying at market tops.'
        },
        {
            q: 'What is the best DCA frequency: Daily, Weekly, Bi-weekly, or Monthly?',
            a: 'Historical backtests show very little mathematical variance between weekly and monthly DCA for long-term horizons (5+ years). However, weekly DCA often smooths intraday weekend crypto dips better. Note that daily DCA on centralized exchanges with flat minimum fees (e.g., $0.99 per trade) will severely hurt your returns; use weekly or monthly DCA unless your broker offers zero-commission micro-investing.'
        },
        {
            q: '¿Qué es una Calculadora DCA y cómo calcular el precio medio de entrada en acciones y criptomonedas?',
            a: 'Una calculadora DCA (Dollar-Cost Averaging o Promedio del Coste Monetario) permite calcular la rentabilidad y el precio promedio de compra al invertir cantidades fijas de dinero de manera periódica. En lugar de intentar adivinar los mínimos del mercado, la estrategia DCA te protege de la volatilidad en Bitcoin, Ethereum y acciones de bolsa, acumulando más activos a precios bajos.'
        }
    ];

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} pb-24 font-sans`}>
            {/* ------------------------------------------------------------------- */}
            {/* SEO HELMET TAGS & STRUCTURED DATA (JSON-LD)                         */}
            {/* ------------------------------------------------------------------- */}
            <Helmet>
                <title>DCA Calculator – Bitcoin, Crypto & Stock Dollar Cost Averaging Simulator</title>
                <meta
                    name="description"
                    content="Free Dollar-Cost Averaging (DCA) Calculator for Bitcoin, crypto, and stocks. Simulate recurring investment growth, track multi-buy average entry price including fees, and export spreadsheet."
                />
                <meta
                    name="keywords"
                    content="dca calculator, bitcoin dca calculator, dca calculator stock, dca calculator crypto, dca calculator stocks, dca stock calculator, how to calculate dca in crypto, bitcoin dca tracker spreadsheet average entry price calculation including fees, calculadora dca"
                />
                <link rel="canonical" href="https://tradejournal.com/tools/dca-calculator" />

                {/* OpenGraph */}
                <meta property="og:title" content="DCA Calculator – Bitcoin, Crypto & Stock Investment Simulator" />
                <meta property="og:description" content="Calculate true average entry price including fees, backtest periodic DCA returns, and download ready-to-use CSV spreadsheet tracker." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://tradejournal.com/tools/dca-calculator" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="DCA Calculator & Bitcoin Average Cost Basis Tracker" />
                <meta name="twitter:description" content="Simulate recurring investments across Bitcoin, crypto, and S&P 500 stocks with fee-adjusted tracking." />

                {/* WebApplication Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebApplication",
                        "name": "DCA Calculator – Dollar Cost Averaging Simulator & Cost Basis Tracker",
                        "url": "https://tradejournal.com/tools/dca-calculator",
                        "description": "Interactive Dollar Cost Averaging calculator to project recurring crypto and stock growth, determine weighted average entry prices including trading fees, and export spreadsheets.",
                        "applicationCategory": "FinanceApplication",
                        "operatingSystem": "All",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        }
                    })}
                </script>

                {/* FAQPage Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": faqs.map(f => ({
                            "@type": "Question",
                            "name": f.q,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": f.a
                            }
                        }))
                    })}
                </script>

                {/* BreadcrumbList Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://tradejournal.com/"
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Tools",
                                "item": "https://tradejournal.com/tools"
                            },
                            {
                                "@type": "ListItem",
                                "position": 3,
                                "name": "DCA Calculator",
                                "item": "https://tradejournal.com/tools/dca-calculator"
                            }
                        ]
                    })}
                </script>
            </Helmet>

            {/* ------------------------------------------------------------------- */}
            {/* TOP BAR / NAVIGATION                                               */}
            {/* ------------------------------------------------------------------- */}
            <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={onBackToLanding || (() => window.history.back())}
                        className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition"
                    >
                        <ArrowLeft size={16} />
                        Back to Tools
                    </button>

                    <div className="flex items-center gap-2">
                        {/* Currency Toggle */}
                        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                            {['$', '€', '£', '₹'].map((sym) => (
                                <button
                                    key={sym}
                                    onClick={() => setCurrencySymbol(sym)}
                                    className={`px-2.5 py-0.5 rounded-lg transition ${
                                        currencySymbol === sym
                                            ? 'bg-emerald-500 text-slate-950 font-black'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    {sym}
                                </button>
                            ))}
                        </div>

                        {/* Share Button */}
                        <button
                            onClick={handleCopyShare}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/80 text-xs font-semibold text-slate-200 transition"
                        >
                            {copiedShareLink ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                            <span className="hidden sm:inline">{copiedShareLink ? 'Link Copied!' : 'Share Tool'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* MAIN CONTAINER                                                     */}
            {/* ------------------------------------------------------------------- */}
            <div className="max-w-6xl mx-auto px-4 pt-8">
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto mb-8 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                        <Sparkles size={14} />
                        Dual-Mode: Growth Simulator & Entry Price Tracker
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                        Dollar-Cost Averaging <span className="text-emerald-400">(DCA) Calculator</span>
                    </h1>

                    <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                        Simulate long-term recurring investments for <strong className="text-slate-200">Bitcoin, Crypto & Stocks</strong>, determine your exact weighted <strong className="text-slate-200">average entry price including trading fees</strong>, and export your spreadsheet tracker.
                    </p>

                    {/* Mode Selector Tabs */}
                    <div className="flex justify-center pt-3">
                        <div className="inline-flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-xl max-w-md w-full">
                            <button
                                onClick={() => setActiveTab('simulator')}
                                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                                    activeTab === 'simulator'
                                        ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <TrendingUp size={16} />
                                DCA Growth Simulator
                            </button>
                            <button
                                onClick={() => setActiveTab('tracker')}
                                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                                    activeTab === 'tracker'
                                        ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <FileSpreadsheet size={16} />
                                Multi-Buy Cost Tracker
                            </button>
                        </div>
                    </div>
                </div>

                {/* --------------------------------------------------------------- */}
                {/* TAB 1: DCA WEALTH & COMPOUNDING SIMULATOR                       */}
                {/* --------------------------------------------------------------- */}
                {activeTab === 'simulator' && (
                    <div className="space-y-8">
                        {/* 1-Click Asset Presets */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                    <Zap size={14} className="text-amber-400" />
                                    1-Click Asset Presets (Historical Benchmarks)
                                </span>
                                <span className="text-[11px] text-slate-500 hidden sm:inline">Auto-adjusts return & fee rates</span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                                {ASSET_PRESETS.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => handleSelectPreset(p.id)}
                                        className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                                            selectedPreset === p.id
                                                ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-sm'
                                                : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
                                        }`}
                                    >
                                        <div className="font-bold text-xs truncate">{p.name}</div>
                                        <div className="text-[11px] font-mono text-emerald-400 font-bold mt-1">
                                            {p.annualCagr}% CAGR
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Simulator Controls & Metric Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Input Form Column (5 Cols) */}
                            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
                                <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                                    <Calculator className="text-emerald-400" size={18} />
                                    Investment Parameters
                                </h3>

                                {/* Starting Lump Sum */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                                        Initial Principal (Starting Balance)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">
                                            {currencySymbol}
                                        </span>
                                        <input
                                            type="number"
                                            value={initialLumpSum}
                                            onChange={(e) => setInitialLumpSum(Math.max(0, parseFloat(e.target.value) || 0))}
                                            className="w-full pl-8 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition"
                                            placeholder="1000"
                                        />
                                    </div>
                                </div>

                                {/* Recurring Deposit Amount */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                                        Recurring Contribution
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">
                                            {currencySymbol}
                                        </span>
                                        <input
                                            type="number"
                                            value={recurringAmount}
                                            onChange={(e) => setRecurringAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                                            className="w-full pl-8 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition"
                                            placeholder="100"
                                        />
                                    </div>
                                </div>

                                {/* Contribution Frequency */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                                        Purchase Frequency
                                    </label>
                                    <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                                        {(['daily', 'weekly', 'biweekly', 'monthly'] as const).map((freq) => (
                                            <button
                                                key={freq}
                                                onClick={() => setFrequency(freq)}
                                                className={`py-1.5 rounded-lg capitalize transition ${
                                                    frequency === freq
                                                        ? 'bg-emerald-500 text-slate-950 font-black'
                                                        : 'text-slate-400 hover:text-white'
                                                }`}
                                            >
                                                {freq === 'biweekly' ? 'Bi-Wk' : freq}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Investment Horizon (Years Slider) */}
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-xs font-semibold text-slate-300">Time Horizon</label>
                                        <span className="text-xs font-mono font-bold text-emerald-400">
                                            {investmentYears} Years ({simulationResult.totalPeriods} Purchases)
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="30"
                                        step="1"
                                        value={investmentYears}
                                        onChange={(e) => setInvestmentYears(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                    <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                                        <span>1 Yr</span>
                                        <span>5 Yrs</span>
                                        <span>10 Yrs</span>
                                        <span>20 Yrs</span>
                                        <span>30 Yrs</span>
                                    </div>
                                </div>

                                {/* Expected Annual Growth Rate */}
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-xs font-semibold text-slate-300">
                                            Expected Annual Growth (CAGR)
                                        </label>
                                        <span className="text-xs font-mono font-bold text-emerald-400">
                                            {annualReturnRate}% / year
                                        </span>
                                    </div>
                                    <input
                                        type="number"
                                        step="0.5"
                                        value={annualReturnRate}
                                        onChange={(e) => setAnnualReturnRate(parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition"
                                        placeholder="12.0"
                                    />
                                </div>

                                {/* Trading Fee Drag (%) */}
                                <div className="pt-2 border-t border-slate-800">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                                            Trading Fee Drag per Order
                                            <span className="text-[10px] text-slate-500 font-normal">(Exchange/Broker)</span>
                                        </label>
                                        <span className="text-xs font-mono font-bold text-amber-400">
                                            {feeRatePct}%
                                        </span>
                                    </div>
                                    <input
                                        type="number"
                                        step="0.05"
                                        min="0"
                                        max="5"
                                        value={feeRatePct}
                                        onChange={(e) => setFeeRatePct(Math.max(0, parseFloat(e.target.value) || 0))}
                                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-300 font-mono text-sm focus:outline-none focus:border-amber-500 transition"
                                        placeholder="0.25"
                                    />
                                    <span className="text-[10px] text-slate-500 block mt-1">
                                        Coinbase/Kraken: ~0.25% - 0.40% | Robinhood/Stocks: ~0%
                                    </span>
                                </div>

                                {/* Inflation Toggle */}
                                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-300 block">
                                            Adjust for Inflation
                                        </label>
                                        <span className="text-[10px] text-slate-500">
                                            Discount by 3.0% annual CPI
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setAdjustInflation(!adjustInflation)}
                                        className={`w-11 h-6 rounded-full transition-colors p-1 flex items-center ${
                                            adjustInflation ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
                                        }`}
                                    >
                                        <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                                    </button>
                                </div>
                            </div>

                            {/* Output Metrics & Visual Graph Column (7 Cols) */}
                            <div className="lg:col-span-7 space-y-6">
                                {/* 4 Highlight Metric Cards */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Invested</span>
                                        <div className="my-1.5 text-lg sm:text-2xl font-black text-white font-mono truncate">
                                            {currencySymbol}{simulationResult.totalInvested.toLocaleString()}
                                        </div>
                                        <span className="text-[11px] text-slate-500">Out-of-pocket cash</span>
                                    </div>

                                    <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between bg-gradient-to-b from-emerald-950/20 to-transparent">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Total Value</span>
                                        <div className="my-1.5 text-lg sm:text-2xl font-black text-emerald-400 font-mono truncate">
                                            {currencySymbol}{Math.round(simulationResult.finalPortfolioValue).toLocaleString()}
                                        </div>
                                        <span className="text-[11px] text-emerald-500/80 font-bold">
                                            {simulationResult.wealthMultiplier.toFixed(2)}x Multiplier
                                        </span>
                                    </div>

                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Total Net Gain</span>
                                        <div className="my-1.5 text-lg sm:text-2xl font-black text-blue-400 font-mono truncate">
                                            +{currencySymbol}{Math.round(simulationResult.totalNetProfit).toLocaleString()}
                                        </div>
                                        <span className="text-[11px] text-blue-300 font-bold">
                                            +{simulationResult.totalProfitPct.toFixed(1)}% Return
                                        </span>
                                    </div>

                                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Fees Deducted</span>
                                        <div className="my-1.5 text-lg sm:text-2xl font-black text-amber-400 font-mono truncate">
                                            {currencySymbol}{Math.round(simulationResult.totalFees).toLocaleString()}
                                        </div>
                                        <span className="text-[11px] text-slate-500">To exchanges/brokers</span>
                                    </div>
                                </div>

                                {/* Visual Area Curve: Invested Capital vs Portfolio Growth */}
                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                        <div>
                                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                                <BarChart3 size={16} className="text-emerald-400" />
                                                DCA Wealth Accumulation Curve
                                            </h4>
                                            <p className="text-xs text-slate-400">
                                                Visual comparison of cash contributed vs total portfolio value
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 text-xs font-semibold">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-slate-500" />
                                                <span className="text-slate-400">Capital Invested</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                                <span className="text-emerald-400 font-bold">Portfolio Value</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Responsive SVG Chart */}
                                    <div className="w-full h-56 bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 relative flex flex-col justify-end">
                                        {/* SVG Graph */}
                                        <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
                                            <defs>
                                                <linearGradient id="dcaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                                                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                                                </linearGradient>
                                                <linearGradient id="investGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" stopColor="#64748B" stopOpacity="0.3" />
                                                    <stop offset="100%" stopColor="#64748B" stopOpacity="0.0" />
                                                </linearGradient>
                                            </defs>

                                            {/* Grid Horizontal Lines */}
                                            {[32, 64, 96, 128].map((y) => (
                                                <line
                                                    key={y}
                                                    x1="0"
                                                    y1={y}
                                                    x2="500"
                                                    y2={y}
                                                    stroke="#1E293B"
                                                    strokeDasharray="4 4"
                                                    strokeWidth="1"
                                                />
                                            ))}

                                            {/* Build dynamic polyline coordinates */}
                                            {(() => {
                                                const maxVal = Math.max(10, simulationResult.finalPortfolioValue);
                                                const pts = simulationResult.yearlyMilestones;
                                                const stepX = 500 / Math.max(1, pts.length);

                                                // Invested line path
                                                let investPath = `M 0 160`;
                                                pts.forEach((pt, i) => {
                                                    const x = (i + 1) * stepX;
                                                    const y = 160 - (pt.totalInvested / maxVal) * 140;
                                                    investPath += ` L ${x} ${Math.max(5, y)}`;
                                                });

                                                // Value area path
                                                let valArea = `M 0 160`;
                                                let valLine = `M 0 160`;
                                                pts.forEach((pt, i) => {
                                                    const x = (i + 1) * stepX;
                                                    const y = 160 - (pt.portfolioValue / maxVal) * 140;
                                                    valArea += ` L ${x} ${Math.max(5, y)}`;
                                                    valLine += ` L ${x} ${Math.max(5, y)}`;
                                                });
                                                valArea += ` L 500 160 Z`;

                                                return (
                                                    <>
                                                        {/* Value Fill Area */}
                                                        <path d={valArea} fill="url(#dcaGrad)" />
                                                        {/* Invested Line */}
                                                        <path d={investPath} fill="none" stroke="#64748B" strokeWidth="2.5" strokeDasharray="5 3" />
                                                        {/* Portfolio Line */}
                                                        <path d={valLine} fill="none" stroke="#10B981" strokeWidth="3" />

                                                        {/* Final Data Dots */}
                                                        {pts.map((pt, i) => {
                                                            const x = (i + 1) * stepX;
                                                            const y = 160 - (pt.portfolioValue / maxVal) * 140;
                                                            return (
                                                                <circle
                                                                    key={i}
                                                                    cx={x}
                                                                    cy={Math.max(5, y)}
                                                                    r="3.5"
                                                                    fill="#10B981"
                                                                    stroke="#022C22"
                                                                    strokeWidth="2"
                                                                />
                                                            );
                                                        })}
                                                    </>
                                                );
                                            })()}
                                        </svg>

                                        {/* X-axis labels */}
                                        <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800">
                                            <span>Start (Year 0)</span>
                                            <span>Year {Math.round(investmentYears / 2)}</span>
                                            <span>Year {investmentYears} Final</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Annual Breakdown Table with CSV Export */}
                                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Year-by-Year Accumulation Breakdown
                                        </h4>
                                        <button
                                            onClick={handleDownloadCsv}
                                            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-emerald-400 transition"
                                        >
                                            <Download size={13} />
                                            Export CSV
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left">
                                            <thead>
                                                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                                                    <th className="py-2 pr-3">Timeline</th>
                                                    <th className="py-2 px-3">Capital Contributed</th>
                                                    <th className="py-2 px-3">Interest Earned</th>
                                                    <th className="py-2 px-3">Ending Balance</th>
                                                    <th className="py-2 pl-3 text-right">Cumulative Fees</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-800/60 font-mono">
                                                {simulationResult.yearlyMilestones.map((m) => (
                                                    <tr key={m.year} className="hover:bg-slate-800/40 transition">
                                                        <td className="py-2 pr-3 text-white font-sans font-semibold">
                                                            Year {m.year}
                                                        </td>
                                                        <td className="py-2 px-3 text-slate-300">
                                                            {currencySymbol}{m.totalInvested.toLocaleString()}
                                                        </td>
                                                        <td className="py-2 px-3 text-emerald-400 font-bold">
                                                            +{currencySymbol}{m.netProfit.toLocaleString()}
                                                        </td>
                                                        <td className="py-2 px-3 text-white font-bold">
                                                            {currencySymbol}{m.portfolioValue.toLocaleString()}
                                                        </td>
                                                        <td className="py-2 pl-3 text-right text-amber-400/80">
                                                            {currencySymbol}{m.feesPaid.toLocaleString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --------------------------------------------------------------- */}
                {/* TAB 2: MULTI-BUY COST BASIS TRACKER (SPREADSHEET MODE)           */}
                {/* --------------------------------------------------------------- */}
                {activeTab === 'tracker' && (
                    <div className="space-y-8">
                        {/* Summary Metrics Banner */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Capital Spent</span>
                                <div className="my-1 text-lg sm:text-2xl font-black text-white font-mono truncate">
                                    {currencySymbol}{trackerResult.totalSpent.toLocaleString()}
                                </div>
                                <span className="text-[11px] text-slate-500">Including all order fees</span>
                            </div>

                            <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 flex flex-col justify-between bg-gradient-to-b from-emerald-950/20 to-transparent">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Average Entry Price</span>
                                <div className="my-1 text-lg sm:text-2xl font-black text-emerald-400 font-mono truncate">
                                    {currencySymbol}{trackerResult.trueAverageEntryPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <span className="text-[11px] text-emerald-400/80 font-semibold">
                                    Break-Even Cost Basis
                                </span>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Total Coins/Shares</span>
                                <div className="my-1 text-lg sm:text-2xl font-black text-blue-400 font-mono truncate">
                                    {trackerResult.totalCoinsAccumulated.toFixed(6)}
                                </div>
                                <span className="text-[11px] text-slate-500">{trackerAsset} accumulated</span>
                            </div>

                            <div className={`border rounded-2xl p-4 flex flex-col justify-between ${
                                trackerResult.unrealizedPnl >= 0
                                    ? 'bg-slate-900 border-emerald-500/30'
                                    : 'bg-slate-900 border-rose-500/30'
                            }`}>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Unrealized P&L</span>
                                <div className={`my-1 text-lg sm:text-2xl font-black font-mono truncate ${
                                    trackerResult.unrealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                                }`}>
                                    {trackerResult.unrealizedPnl >= 0 ? '+' : ''}{currencySymbol}{Math.round(trackerResult.unrealizedPnl).toLocaleString()}
                                </div>
                                <span className={`text-[11px] font-bold ${
                                    trackerResult.unrealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                                }`}>
                                    {trackerResult.unrealizedPnlPct >= 0 ? '+' : ''}{trackerResult.unrealizedPnlPct.toFixed(2)}% ROI
                                </span>
                            </div>
                        </div>

                        {/* Tracker Settings Bar */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                        Asset / Ticker
                                    </label>
                                    <input
                                        type="text"
                                        value={trackerAsset}
                                        onChange={(e) => setTrackerAsset(e.target.value)}
                                        className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold text-xs focus:outline-none focus:border-emerald-500"
                                        placeholder="e.g. Bitcoin (BTC)"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                        Current Market Price ({currencySymbol})
                                    </label>
                                    <input
                                        type="number"
                                        value={currentMarketPrice}
                                        onChange={(e) => setCurrentMarketPrice(parseFloat(e.target.value) || 0)}
                                        className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                                        placeholder="68000"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <button
                                    onClick={handleLoadSampleBtc}
                                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 text-[11px] font-bold text-slate-300 transition"
                                >
                                    Load BTC Sample
                                </button>
                                <button
                                    onClick={handleLoadSampleSpy}
                                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 text-[11px] font-bold text-slate-300 transition"
                                >
                                    Load S&P 500 Sample
                                </button>
                                <button
                                    onClick={handleDownloadCsv}
                                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition shadow-md"
                                >
                                    <Download size={14} />
                                    Export CSV Spreadsheet
                                </button>
                            </div>
                        </div>

                        {/* Interactive Spreadsheet Table */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                                        <FileSpreadsheet size={16} className="text-emerald-400" />
                                        Historical DCA Purchase Log
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        Add your actual buy orders to compute exact weighted cost basis including brokerage fees
                                    </p>
                                </div>

                                <button
                                    onClick={handleAddBuyRow}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold transition"
                                >
                                    <Plus size={14} />
                                    Add Buy Order
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                    <thead>
                                        <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                                            <th className="py-2.5 px-2">#</th>
                                            <th className="py-2.5 px-2">Date</th>
                                            <th className="py-2.5 px-2">Buy Price ({currencySymbol})</th>
                                            <th className="py-2.5 px-2">Amount Spent ({currencySymbol})</th>
                                            <th className="py-2.5 px-2">Trading Fee ({currencySymbol})</th>
                                            <th className="py-2.5 px-2">Acquired Units</th>
                                            <th className="py-2.5 px-2 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60 font-mono">
                                        {trackerResult.processedOrders.map((o, idx) => (
                                            <tr key={o.id} className="hover:bg-slate-800/30 transition">
                                                <td className="py-2 px-2 text-slate-500 font-bold">
                                                    {idx + 1}
                                                </td>
                                                <td className="py-2 px-2">
                                                    <input
                                                        type="date"
                                                        value={o.date}
                                                        onChange={(e) => handleUpdateBuyRow(o.id, 'date', e.target.value)}
                                                        className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-sans"
                                                    />
                                                </td>
                                                <td className="py-2 px-2">
                                                    <input
                                                        type="number"
                                                        value={o.buyPrice}
                                                        onChange={(e) => handleUpdateBuyRow(o.id, 'buyPrice', parseFloat(e.target.value) || 0)}
                                                        className="w-24 sm:w-28 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                                                    />
                                                </td>
                                                <td className="py-2 px-2">
                                                    <input
                                                        type="number"
                                                        value={o.amountInvested}
                                                        onChange={(e) => handleUpdateBuyRow(o.id, 'amountInvested', parseFloat(e.target.value) || 0)}
                                                        className="w-24 sm:w-28 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                                                    />
                                                </td>
                                                <td className="py-2 px-2">
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={o.fee}
                                                        onChange={(e) => handleUpdateBuyRow(o.id, 'fee', parseFloat(e.target.value) || 0)}
                                                        className="w-16 sm:w-20 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-amber-400 text-xs focus:outline-none focus:border-amber-500 font-mono"
                                                    />
                                                </td>
                                                <td className="py-2 px-2 text-emerald-400 font-bold">
                                                    {o.unitsBought.toFixed(6)}
                                                </td>
                                                <td className="py-2 px-2 text-right">
                                                    <button
                                                        onClick={() => handleRemoveBuyRow(o.id)}
                                                        disabled={buyOrders.length <= 1}
                                                        className="p-1 text-slate-500 hover:text-rose-400 disabled:opacity-30 transition"
                                                        title="Delete order"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 border-slate-700 bg-slate-950/60 font-bold text-slate-200">
                                            <td className="py-3 px-2" colSpan={3}>
                                                TOTAL ACCUMULATED
                                            </td>
                                            <td className="py-3 px-2 text-white font-mono">
                                                {currencySymbol}{trackerResult.totalSpent.toLocaleString()}
                                            </td>
                                            <td className="py-3 px-2 text-amber-400 font-mono">
                                                {currencySymbol}{trackerResult.totalFeesPaid.toFixed(2)}
                                            </td>
                                            <td className="py-3 px-2 text-emerald-400 font-mono" colSpan={2}>
                                                {trackerResult.totalCoinsAccumulated.toFixed(6)} Units
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ------------------------------------------------------------------- */}
                {/* SEO ARTICLES & COMPREHENSIVE EDUCATIONAL GUIDE                      */}
                {/* ------------------------------------------------------------------- */}
                <div className="mt-14 space-y-10 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800 pt-10">
                    {/* Section 1 */}
                    <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-base sm:text-lg">
                            <BookOpen size={20} />
                            <h2>What is Dollar-Cost Averaging (DCA)? Stocks vs Crypto Mechanics</h2>
                        </div>
                        <p>
                            <strong>Dollar-Cost Averaging (DCA)</strong> is an investment framework where an investor allocates a fixed sum of capital at systematic, recurring intervals (e.g., $100 every Monday or $500 monthly on payday) into a target instrument, regardless of its fluctuating price.
                        </p>
                        <p>
                            In traditional equities like the <span className="text-white font-semibold">S&P 500 (SPY)</span> or <span className="text-white font-semibold">Nasdaq-100 (QQQ)</span>, DCA acts as an automated wealth-building mechanism that harnesses steady multi-decade GDP expansion while smoothing out bear market recessions. In hyper-volatile digital assets such as <span className="text-white font-semibold">Bitcoin (BTC)</span> and <span className="text-white font-semibold">Ethereum (ETH)</span>, DCA serves as a psychological armor: by purchasing fractions of a coin consistently through 50% to 75% market corrections, investors mathematically lower their cost basis without succumbing to emotional panic or trying to catch falling knives.
                        </p>
                    </section>

                    {/* Section 2: Mathematical Formula */}
                    <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                        <div className="flex items-center gap-2 text-blue-400 font-bold text-base sm:text-lg">
                            <Scale size={20} />
                            <h2>How to Calculate DCA in Crypto: True Weighted Average Formula (With Fees)</h2>
                        </div>
                        <p>
                            A frequent mistake made by retail traders is averaging entry prices with a simple arithmetic mean. For example, buying at $60,000 and then at $40,000 does <strong>not</strong> yield an average of $50,000 if different amounts of cash were invested at each price tier.
                        </p>
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 space-y-2">
                            <div className="text-emerald-400 font-bold">// Standard Weighted Average Price Formula:</div>
                            <div>Average Entry Price = (P₁ × Q₁ + P₂ × Q₂ + ... + Pₙ × Qₙ) / (Q₁ + Q₂ + ... + Qₙ)</div>
                            <div className="text-amber-400 font-bold pt-2">// True Cost Basis Factoring Exchange Trading Fees:</div>
                            <div>Break-Even Price = (Total Fiat Deposited + Total Trading Fees Paid) / Total Coins Acquired</div>
                        </div>
                        <p>
                            When executing recurring purchases on centralized exchanges like Binance, Coinbase, or Kraken, trading fees (taker/maker rates of 0.10% to 0.60%) or hidden spread fees debit your fiat capital. If you invest $500 with a $2.50 fee, only $497.50 purchases cryptocurrency. Our tracker above automatically accounts for fee drag so your break-even exit calculation is 100% tax and profit compliant.
                        </p>
                    </section>

                    {/* Section 3: DCA vs Lump Sum */}
                    <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                        <div className="flex items-center gap-2 text-purple-400 font-bold text-base sm:text-lg">
                            <PieChart size={20} />
                            <h2>DCA vs Lump-Sum Investing: Which Strategy Wins?</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                                <h3 className="font-bold text-white flex items-center gap-1.5">
                                    <CheckCircle2 size={16} className="text-emerald-400" />
                                    When DCA Outperforms
                                </h3>
                                <p className="text-slate-400">
                                    DCA dominates during sideways consolidation, cyclical crypto bear markets, and volatile downturns. By continually buying through the drawdown, your average cost basis rapidly declines, allowing you to hit profitability much earlier in the recovery cycle than an investor who went all-in at the top.
                                </p>
                            </div>
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                                <h3 className="font-bold text-white flex items-center gap-1.5">
                                    <TrendingUp size={16} className="text-blue-400" />
                                    When Lump Sum Outperforms
                                </h3>
                                <p className="text-slate-400">
                                    In secular bull markets that relentlessly climb upward without deep pullbacks, lump-sum investing mathematically outperforms DCA because capital spends more total days exposed to compounding upside. However, DCA eliminates the risk of catastrophic market-timing regret.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Spanish Section for 'calculadora dca' */}
                    <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
                        <div className="flex items-center gap-2 text-amber-400 font-bold text-base sm:text-lg">
                            <Globe size={20} />
                            <h2>Guía en Español: ¿Cómo Funciona la Calculadora DCA (Dollar Cost Averaging)?</h2>
                        </div>
                        <p>
                            La <strong>Calculadora DCA</strong> es una herramienta financiera diseñada para simular y registrar compras periódicas en Bitcoin, criptomonedas y acciones bursátiles. La estrategia de <em>Dollar-Cost Averaging</em> consiste en invertir una cantidad fija de dinero (por ejemplo, 50€ o 100$ cada semana) sin importar si el precio del activo sube o baja.
                        </p>
                        <p>
                            Al utilizar esta calculadora, puedes calcular con exactitud tu <strong>precio medio de compra (Break-Even)</strong> incluyendo las comisiones cobradas por brokers como eToro, Interactive Brokers o exchanges como Binance. De este modo, eliminas la ansiedad emocional del mercado y construyes patrimonio de forma constante y disciplinada.
                        </p>
                    </section>
                </div>

                {/* ------------------------------------------------------------------- */}
                {/* FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION)                          */}
                {/* ------------------------------------------------------------------- */}
                <div className="mt-14 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                    <div className="flex items-center gap-2 mb-6">
                        <HelpCircle className="text-emerald-400" size={22} />
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                            Frequently Asked Questions (DCA Strategy & Math)
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full px-5 py-3.5 text-left font-semibold text-xs sm:text-sm text-slate-200 flex items-center justify-between hover:text-white transition"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-200 text-slate-400 shrink-0 ml-2 ${
                                            openFaq === idx ? 'rotate-180 text-emerald-400' : ''
                                        }`}
                                    />
                                </button>
                                {openFaq === idx && (
                                    <div className="px-5 pb-4 text-xs sm:text-sm text-slate-400 border-t border-slate-800/80 pt-3 leading-relaxed">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ------------------------------------------------------------------- */}
                {/* RELATED FREE TRADING TOOLS                                          */}
                {/* ------------------------------------------------------------------- */}
                <RelatedToolsGrid
                    currentToolSlug="/tools/dca-calculator"
                    category="crypto"
                    title="Explore Related Trading & Wealth Calculators"
                    subtitle="Track dollar-cost averaging growth alongside crypto funding arbitrage, wash sale compliance, and drawdown recovery models."
                />

                {/* Footer Disclaimer */}
                <div className="mt-10 text-center text-[11px] text-slate-500 max-w-2xl mx-auto">
                    Disclaimer: This DCA calculator is provided for informational and educational simulation purposes only and does not constitute financial, investment, or tax advice. Historical asset performance (Bitcoin, S&P 500) does not guarantee future results.
                </div>
            </div>
        </div>
    );
};
