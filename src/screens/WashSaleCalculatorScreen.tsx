import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Calculator, Calendar, DollarSign, ArrowRight, ShieldCheck, ShieldAlert,
    CheckCircle2, AlertTriangle, HelpCircle, ChevronDown, Copy, Check,
    Sparkles, RefreshCw, FileText, Share2, Info, ArrowLeft, ArrowUpRight,
    TrendingDown, Bookmark, ExternalLink, BookOpen, Scale, Clock, Eye
} from 'lucide-react';
import { RelatedToolsGrid } from '../components/RelatedToolsGrid';

export interface WashSaleCalculatorScreenProps {
    theme?: any;
    isDarkMode?: boolean;
    primaryCurrencySymbol?: string;
    onBackToLanding?: () => void;
    onSignIn?: () => void;
}

interface PresetScenario {
    id: string;
    label: string;
    desc: string;
    symbol: string;
    buyPrice: number;
    sellPrice: number;
    sharesSold: number;
    sellDate: string;
    repurchasePrice: number;
    repurchaseShares: number;
    repurchaseDate: string;
}

const PRESETS: PresetScenario[] = [
    {
        id: 'full-wash',
        label: '100% Wash Sale (Full Repurchase)',
        desc: 'Sold 100 shares at a loss and repurchased all 100 shares within 14 days.',
        symbol: 'TSLA',
        buyPrice: 240,
        sellPrice: 190,
        sharesSold: 100,
        sellDate: '2026-10-01',
        repurchasePrice: 205,
        repurchaseShares: 100,
        repurchaseDate: '2026-10-15'
    },
    {
        id: 'partial-wash',
        label: 'Partial Wash Sale (50% Replaced)',
        desc: 'Sold 100 shares at a loss, but only bought back 50 shares within 30 days.',
        symbol: 'NVDA',
        buyPrice: 140,
        sellPrice: 110,
        sharesSold: 100,
        sellDate: '2026-09-20',
        repurchasePrice: 115,
        repurchaseShares: 50,
        repurchaseDate: '2026-10-05'
    },
    {
        id: 'safe-trade',
        label: 'Safe Trade (Waited 31+ Days)',
        desc: 'Waited 32 days after selling before buying back. 100% tax loss allowed!',
        symbol: 'SPY',
        buyPrice: 560,
        sellPrice: 520,
        sharesSold: 50,
        sellDate: '2026-08-15',
        repurchasePrice: 535,
        repurchaseShares: 50,
        repurchaseDate: '2026-09-17'
    }
];

export const WashSaleCalculatorScreen: React.FC<WashSaleCalculatorScreenProps> = ({
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
    // Active Tab: 'calculator' | 'calendar' | 'tax-guide'
    const [activeTab, setActiveTab] = useState<'calculator' | 'calendar' | 'tax-guide'>('calculator');

    // Input States
    const [symbol, setSymbol] = useState('TSLA');
    const [buyPrice, setBuyPrice] = useState<number>(240);
    const [sellPrice, setSellPrice] = useState<number>(190);
    const [sharesSold, setSharesSold] = useState<number>(100);
    const [sellDate, setSellDate] = useState<string>('2026-10-01');

    const [hasRepurchased, setHasRepurchased] = useState<boolean>(true);
    const [repurchasePrice, setRepurchasePrice] = useState<number>(205);
    const [repurchaseShares, setRepurchaseShares] = useState<number>(100);
    const [repurchaseDate, setRepurchaseDate] = useState<string>('2026-10-15');

    // UI helpers
    const [copied, setCopied] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // Apply Preset
    const applyPreset = (preset: PresetScenario) => {
        setSymbol(preset.symbol);
        setBuyPrice(preset.buyPrice);
        setSellPrice(preset.sellPrice);
        setSharesSold(preset.sharesSold);
        setSellDate(preset.sellDate);
        setHasRepurchased(true);
        setRepurchasePrice(preset.repurchasePrice);
        setRepurchaseShares(preset.repurchaseShares);
        setRepurchaseDate(preset.repurchaseDate);
    };

    // Calculate 61-day window dates
    const windowDates = useMemo(() => {
        if (!sellDate) {
            const today = new Date();
            const start = new Date(today);
            start.setDate(today.getDate() - 30);
            const end = new Date(today);
            end.setDate(today.getDate() + 30);
            const safe = new Date(today);
            safe.setDate(today.getDate() + 31);
            return {
                start: start.toISOString().split('T')[0],
                end: end.toISOString().split('T')[0],
                safe: safe.toISOString().split('T')[0]
            };
        }
        const [year, month, day] = sellDate.split('-').map(Number);
        const sale = new Date(Date.UTC(year, month - 1, day));

        const start = new Date(sale);
        start.setUTCDate(sale.getUTCDate() - 30);

        const end = new Date(sale);
        end.setUTCDate(sale.getUTCDate() + 30);

        const safe = new Date(sale);
        safe.setUTCDate(sale.getUTCDate() + 31);

        return {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0],
            safe: safe.toISOString().split('T')[0]
        };
    }, [sellDate]);

    // Wash Sale Calculations
    const calc = useMemo(() => {
        const lossPerShare = Math.max(0, buyPrice - sellPrice);
        const totalRealizedLoss = lossPerShare * (sharesSold || 0);
        const isLoss = buyPrice > sellPrice;

        if (!isLoss || totalRealizedLoss <= 0) {
            return {
                isLoss: false,
                totalRealizedLoss: 0,
                lossPerShare: 0,
                daysBetween: 0,
                isWashSale: false,
                disallowedShares: 0,
                allowedShares: sharesSold,
                disallowedLoss: 0,
                allowedLoss: 0,
                adjustedCostBasisPerShare: repurchasePrice,
                totalAdjustedCostBasis: repurchasePrice * repurchaseShares,
                addedCostBasisPerShare: 0
            };
        }

        if (!hasRepurchased || !repurchaseDate || !sellDate) {
            return {
                isLoss: true,
                totalRealizedLoss,
                lossPerShare,
                daysBetween: 0,
                isWashSale: false,
                disallowedShares: 0,
                allowedShares: sharesSold,
                disallowedLoss: 0,
                allowedLoss: totalRealizedLoss,
                adjustedCostBasisPerShare: repurchasePrice,
                totalAdjustedCostBasis: repurchasePrice * repurchaseShares,
                addedCostBasisPerShare: 0
            };
        }

        const sDate = new Date(sellDate);
        const rDate = new Date(repurchaseDate);
        const diffTime = rDate.getTime() - sDate.getTime();
        const daysBetween = Math.round(diffTime / (1000 * 60 * 60 * 24));

        // Wash sale rule applies if purchased 30 days BEFORE or 30 days AFTER (-30 <= daysBetween <= 30)
        const isWashSale = daysBetween >= -30 && daysBetween <= 30;

        if (!isWashSale) {
            return {
                isLoss: true,
                totalRealizedLoss,
                lossPerShare,
                daysBetween,
                isWashSale: false,
                disallowedShares: 0,
                allowedShares: sharesSold,
                disallowedLoss: 0,
                allowedLoss: totalRealizedLoss,
                adjustedCostBasisPerShare: repurchasePrice,
                totalAdjustedCostBasis: repurchasePrice * repurchaseShares,
                addedCostBasisPerShare: 0
            };
        }

        // Partial or Full wash sale
        const disallowedShares = Math.min(sharesSold, repurchaseShares);
        const allowedShares = Math.max(0, sharesSold - disallowedShares);

        const disallowedLoss = disallowedShares * lossPerShare;
        const allowedLoss = totalRealizedLoss - disallowedLoss;

        const addedCostBasisPerShare = repurchaseShares > 0 ? disallowedLoss / repurchaseShares : 0;
        const adjustedCostBasisPerShare = repurchasePrice + addedCostBasisPerShare;
        const totalAdjustedCostBasis = adjustedCostBasisPerShare * repurchaseShares;

        return {
            isLoss: true,
            totalRealizedLoss,
            lossPerShare,
            daysBetween,
            isWashSale: true,
            disallowedShares,
            allowedShares,
            disallowedLoss,
            allowedLoss,
            adjustedCostBasisPerShare,
            totalAdjustedCostBasis,
            addedCostBasisPerShare
        };
    }, [buyPrice, sellPrice, sharesSold, sellDate, hasRepurchased, repurchasePrice, repurchaseShares, repurchaseDate]);

    // Copy Summary
    const handleCopy = () => {
        const text = `=== IRS WASH SALE CALCULATION SUMMARY ===
Ticker: ${symbol}
Original Buy Price: $${buyPrice} | Sale Price: $${sellPrice} | Shares Sold: ${sharesSold}
Sale Date: ${sellDate} | Total Realized Loss: $${calc.totalRealizedLoss.toLocaleString()}
Repurchase: ${hasRepurchased ? `${repurchaseShares} shares @ $${repurchasePrice} on ${repurchaseDate}` : 'None'}
Status: ${calc.isWashSale ? '⚠️ WASH SALE TRIGGERED (Rule 1091)' : '✅ NO WASH SALE (Loss Allowed)'}
Disallowed Loss: $${calc.disallowedLoss.toLocaleString()}
Allowed Loss (Deductible): $${calc.allowedLoss.toLocaleString()}
New Adjusted Cost Basis: $${calc.adjustedCostBasisPerShare.toFixed(2)} / share
IRS Form 8949: Code 'W', Column (g) Adjustment: +$${calc.disallowedLoss.toLocaleString()}
Calculated via TradeJournall Wash Sale Calculator`;

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Calendar Days Generator for visual calendar
    const calendarDays = useMemo(() => {
        if (!sellDate) return [];
        const [year, month, day] = sellDate.split('-').map(Number);
        const saleDateObj = new Date(Date.UTC(year, month - 1, day));

        // Generate 65 days centered around sale date (-32 to +32 days)
        const days = [];
        for (let i = -30; i <= 31; i++) {
            const current = new Date(saleDateObj);
            current.setUTCDate(saleDateObj.getUTCDate() + i);
            const dateStr = current.toISOString().split('T')[0];
            const isSaleDay = i === 0;
            const isRepurchaseDay = hasRepurchased && dateStr === repurchaseDate;
            const isDanger = i >= -30 && i <= 30 && !isSaleDay;
            const isSafe = i > 30 || i < -30;

            days.push({
                offset: i,
                dateStr,
                displayDay: current.getUTCDate(),
                displayMonth: current.toLocaleString('default', { month: 'short' }),
                isSaleDay,
                isRepurchaseDay,
                isDanger,
                isSafe
            });
        }
        return days;
    }, [sellDate, hasRepurchased, repurchaseDate]);

    // SEO FAQs (Targeting all 129 keyword variations)
    const faqs = [
        {
            q: 'What is the IRS 30-Day Wash Sale Rule (IRC § 1091)?',
            a: 'The wash sale rule prevents taxpayers from claiming an immediate tax deduction for a security sold at a loss if they repurchase the same or a "substantially identical" security (or acquire an option/contract to do so) within 30 days before or 30 days after the sale date. This creates a total 61-day window (30 days prior + day of sale + 30 days after).'
        },
        {
            q: 'Is my disallowed loss gone forever, or do I get it back?',
            a: 'Your loss is NOT gone forever! Instead of deducting the loss in the current tax year, the disallowed loss amount is added directly to the cost basis of the newly acquired replacement shares. When you eventually sell those replacement shares in a non-wash sale, the higher cost basis will decrease your future capital gains or increase your future deductible capital loss.'
        },
        {
            q: 'How does the Wash Sale Rule affect my holding period for capital gains?',
            a: 'Under IRS rules, the holding period of the original shares you sold at a loss is added to the holding period of your newly repurchased shares. For example, if you held the original stock for 8 months before selling at a loss, and then hold the replacement shares for 5 months, your total holding period is 13 months, qualifying you for the lower Long-Term Capital Gains tax rate.'
        },
        {
            q: 'What is considered a "Substantially Identical" security?',
            a: 'The IRS considers common stock of the same company, or call options and convertible securities on that stock, to be substantially identical. However, stock in two competing companies in the same sector (e.g., selling AMD at a loss and buying NVDA) is NOT considered substantially identical. Similarly, selling SPY (S&P 500 ETF) and buying VTI (Total Stock Market ETF) is widely considered safe by tax professionals.'
        },
        {
            q: 'Does the Wash Sale Rule apply to Crypto (Bitcoin, Ethereum, Solana)?',
            a: 'Under current IRS tax regulations (as of 2026), cryptocurrency is classified as "property" rather than a security or stock under IRC Section 1091. Therefore, the wash sale rule does NOT currently apply to spot cryptocurrency trading. You can sell Bitcoin at a loss for tax-loss harvesting and immediately buy it back. However, always check for legislative updates as Congress periodically introduces bills to close this crypto exemption.'
        },
        {
            q: 'How do Options trigger the Wash Sale Rule?',
            a: 'Options trigger wash sales in two key ways: (1) Selling an option contract at a loss and repurchasing an identical option on the same underlying stock within 30 days; and (2) Selling underlying stock at a loss and purchasing a deep-in-the-money Call option or a Call option contract on that stock within the 30-day window. In both cases, the loss is disallowed and added to the option premium basis.'
        },
        {
            q: 'What is a Partial Wash Sale and how is it calculated?',
            a: 'A partial wash sale occurs when the number of replacement shares repurchased is different from the number of shares sold at a loss. For example, if you sell 100 shares at a $2,000 loss and only repurchase 40 shares within 30 days, the wash sale penalty applies only to the 40 shares ($800 disallowed loss). The remaining 60 shares ($1,200 loss) are fully deductible on this year’s tax return.'
        },
        {
            q: 'Why is buying in an IRA or Roth IRA a dangerous wash sale trap?',
            a: 'Under IRS Revenue Ruling 2008-5, if you sell stock at a loss in a taxable brokerage account and buy the replacement shares inside an IRA or 401(k) within 30 days, your loss is disallowed permanently! Furthermore, you CANNOT add the disallowed loss to the IRA cost basis because IRAs are tax-sheltered accounts. The tax deduction is permanently destroyed.'
        },
        {
            q: 'Do brokers like Robinhood, Webull, Charles Schwab, and Fidelity track wash sales automatically?',
            a: 'Brokers track wash sales automatically and report them in Box 1g of Form 1099-B, but ONLY for trades made within that specific account. Brokers do NOT track wash sales across your other brokerages, your spouse’s accounts, or your IRAs. You are legally responsible for aggregating and reporting cross-broker wash sales on IRS Form 8949.'
        },
        {
            q: 'What happens if I have wash sales at the end of the year (December)?',
            a: 'If you sell a stock at a loss in December and buy it back within 30 days (even in January of the following tax year), the loss from December is disallowed for that tax year. To claim losses for the current tax year, you must either: (1) Not repurchase the stock for at least 31 days after the sale, or (2) Completely close out all replacement positions before December 31 and remain out for 31 days.'
        }
    ];

    const currentPath = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
    const canonicalUrl = currentPath.includes('wash-sale-rule-calculator')
        ? 'https://tradejournall.com/tools/wash-sale-rule-calculator'
        : currentPath.includes('30-day-wash-sale-calculator')
        ? 'https://tradejournall.com/tools/30-day-wash-sale-calculator'
        : 'https://tradejournall.com/tools/wash-sale-calculator';

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} pb-16`}>
            {/* SEO Helmet with WebApplication & FAQPage Schema */}
            <Helmet>
                <title>Wash Sale Rule Calculator 2026 — Disallowed Loss, Cost Basis & 61-Day Calendar</title>
                <meta
                    name="description"
                    content="Free IRS 30-Day Wash Sale Calculator. Calculate disallowed loss, adjusted cost basis per share, 61-day calendar window, and IRS Form 8949 adjustments for US stocks, ETFs & options."
                />
                <meta
                    name="keywords"
                    content="wash sale calculator, wash sale rule calculator, calculate wash sale, cost basis adjustment calculator, 30 day wash sale calculator, wash sale disallowed loss, irs form 8949 wash sale"
                />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:url" content={canonicalUrl} />
                <script type="application/ld+json">
                    {JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "WebApplication",
                            "name": "IRS Wash Sale Rule & Cost Basis Calculator",
                            "url": "https://tradejournall.com/tools/wash-sale-calculator",
                            "applicationCategory": "FinanceApplication",
                            "operatingSystem": "All",
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "USD"
                            },
                            "description": "Calculate disallowed loss, adjusted cost basis, and 61-day wash sale window for US stock and option traders under IRS Section 1091."
                        },
                        {
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
                        }
                    ])}
                </script>
            </Helmet>

            {/* Top Navigation Bar */}
            <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-30 px-4 py-3">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {onBackToLanding && (
                            <button
                                onClick={onBackToLanding}
                                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition flex items-center gap-1 text-sm"
                            >
                                <ArrowLeft size={16} />
                                <span className="hidden sm:inline">Back to Tools</span>
                            </button>
                        )}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                                ⚖️
                            </div>
                            <div>
                                <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                                    Wash Sale Rule Calculator
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                                        IRS § 1091
                                    </span>
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopy}
                            className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
                            title="Copy summary"
                        >
                            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                        </button>
                        {onSignIn && (
                            <button
                                onClick={onSignIn}
                                className="px-3 py-1.5 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition"
                            >
                                Journal Trades
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Hero / Intro Banner */}
            <div className="max-w-6xl mx-auto px-4 pt-6 pb-4">
                <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/30 rounded-2xl p-4 sm:p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-2">
                                <Sparkles size={13} />
                                US Stock & Options Tax Tool 2026
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                Calculate Disallowed Loss & Adjusted Cost Basis Instantly
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                                Avoid IRS tax penalties. Discover if your trades triggered a wash sale, how much loss is disallowed this tax year, and your exact new cost basis.
                            </p>
                        </div>

                        {/* Presets Button Row */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                Quick Scenarios:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {PRESETS.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => applyPreset(p)}
                                        className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition hover:border-emerald-500/50"
                                        title={p.desc}
                                    >
                                        {p.label.split(' ')[0]} {p.label.split(' ')[1]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Switcher */}
                <div className="flex border-b border-slate-800 mb-6 space-x-2">
                    <button
                        onClick={() => setActiveTab('calculator')}
                        className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
                            activeTab === 'calculator'
                                ? 'border-emerald-500 text-emerald-400'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <Calculator size={16} />
                        Dollar & Cost Basis Calculator
                    </button>
                    <button
                        onClick={() => setActiveTab('calendar')}
                        className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
                            activeTab === 'calendar'
                                ? 'border-emerald-500 text-emerald-400'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <Calendar size={16} />
                        61-Day Calendar Window
                    </button>
                    <button
                        onClick={() => setActiveTab('tax-guide')}
                        className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
                            activeTab === 'tax-guide'
                                ? 'border-emerald-500 text-emerald-400'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <FileText size={16} />
                        IRS Form 8949 Guide
                    </button>
                </div>

                {/* MAIN TAB CONTENT */}
                {activeTab === 'calculator' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* LEFT COLUMN: INPUTS (5 Cols) */}
                        <div className="lg:col-span-5 space-y-5">
                            {/* Card 1: Loss Sale Details */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <TrendingDown className="text-rose-400" size={18} />
                                        <h3 className="font-semibold text-white text-sm">Step 1: Original Loss Sale</h3>
                                    </div>
                                    <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                                        Loss Trade
                                    </span>
                                </div>

                                <div className="space-y-3.5">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                                Asset Symbol
                                            </label>
                                            <input
                                                type="text"
                                                value={symbol}
                                                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                                                placeholder="TSLA"
                                                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                                Shares Sold
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={sharesSold}
                                                onChange={(e) => setSharesSold(Math.max(1, Number(e.target.value)))}
                                                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                                Original Buy Price ($)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2 text-slate-500 text-sm">$</span>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={buyPrice}
                                                    onChange={(e) => setBuyPrice(Math.max(0, Number(e.target.value)))}
                                                    className="w-full pl-7 pr-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                                Sale Price ($)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2 text-slate-500 text-sm">$</span>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={sellPrice}
                                                    onChange={(e) => setSellPrice(Math.max(0, Number(e.target.value)))}
                                                    className="w-full pl-7 pr-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">
                                            Date Sold at a Loss
                                        </label>
                                        <input
                                            type="date"
                                            value={sellDate}
                                            onChange={(e) => setSellDate(e.target.value)}
                                            className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>

                                    {/* Realized Loss Notice */}
                                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                                        <span className="text-xs text-slate-400">Total Realized Loss:</span>
                                        <span className={`text-sm font-bold ${calc.isLoss ? 'text-rose-400' : 'text-emerald-400'}`}>
                                            {calc.isLoss ? `-$${calc.totalRealizedLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '$0.00 (No Loss)'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Repurchase / Replacement Details */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <RefreshCw className="text-blue-400" size={18} />
                                        <h3 className="font-semibold text-white text-sm">Step 2: Replacement Purchase</h3>
                                    </div>
                                    <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={hasRepurchased}
                                            onChange={(e) => setHasRepurchased(e.target.checked)}
                                            className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                                        />
                                        <span>Repurchased?</span>
                                    </label>
                                </div>

                                {hasRepurchased ? (
                                    <div className="space-y-3.5">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-400 mb-1">
                                                    Replacement Shares
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={repurchaseShares}
                                                    onChange={(e) => setRepurchaseShares(Math.max(1, Number(e.target.value)))}
                                                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-400 mb-1">
                                                    Repurchase Price ($)
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2 text-slate-500 text-sm">$</span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={repurchasePrice}
                                                        onChange={(e) => setRepurchasePrice(Math.max(0, Number(e.target.value)))}
                                                        className="w-full pl-7 pr-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                                Date Repurchased
                                            </label>
                                            <input
                                                type="date"
                                                value={repurchaseDate}
                                                onChange={(e) => setRepurchaseDate(e.target.value)}
                                                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                                            />
                                            <p className="text-[11px] text-slate-500 mt-1">
                                                Days since loss sale: <strong className={calc.isWashSale ? 'text-amber-400' : 'text-emerald-400'}>{calc.daysBetween} days</strong>
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-slate-500 text-xs">
                                        <p>You indicated you haven't repurchased this stock yet.</p>
                                        <p className="mt-1 text-slate-400">
                                            Safe to buy without penalty on or after: <strong className="text-emerald-400">{windowDates.safe}</strong>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: RESULTS & SUMMARY (7 Cols) */}
                        <div className="lg:col-span-7 space-y-5">
                            {/* Status Card */}
                            <div className={`p-5 rounded-2xl border transition ${
                                calc.isWashSale
                                    ? 'bg-rose-950/20 border-rose-800/40 text-slate-200'
                                    : 'bg-emerald-950/20 border-emerald-800/40 text-slate-200'
                            }`}>
                                <div className="flex items-start gap-3">
                                    {calc.isWashSale ? (
                                        <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 shrink-0">
                                            <ShieldAlert size={24} />
                                        </div>
                                    ) : (
                                        <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shrink-0">
                                            <ShieldCheck size={24} />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-base sm:text-lg font-bold text-white">
                                                {calc.isWashSale
                                                    ? '⚠️ Wash Sale Triggered (Rule 1091)'
                                                    : '✅ No Wash Sale (100% Tax Deductible)'}
                                            </h3>
                                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                                                calc.isWashSale
                                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                            }`}>
                                                {calc.isWashSale ? 'Loss Disallowed' : 'Loss Allowed'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {calc.isWashSale
                                                ? `You repurchased within ${calc.daysBetween} days of your loss sale. IRS rules prohibit claiming this loss for the current tax year.`
                                                : `Repurchase date is outside the 61-day wash sale window. Your entire realized loss can be deducted on your taxes!`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 4 Key Stat Metric Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                                    <span className="text-[11px] font-medium text-slate-400 block">
                                        Realized Loss
                                    </span>
                                    <span className="text-lg font-bold text-white block mt-1">
                                        ${calc.totalRealizedLoss.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                                    </span>
                                    <span className="text-[10px] text-slate-500">Gross trading loss</span>
                                </div>

                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                                    <span className="text-[11px] font-medium text-rose-400 block">
                                        Disallowed Loss
                                    </span>
                                    <span className="text-lg font-bold text-rose-400 block mt-1">
                                        ${calc.disallowedLoss.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                                    </span>
                                    <span className="text-[10px] text-slate-500">
                                        {calc.disallowedShares} shares affected
                                    </span>
                                </div>

                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                                    <span className="text-[11px] font-medium text-emerald-400 block">
                                        Allowed Loss
                                    </span>
                                    <span className="text-lg font-bold text-emerald-400 block mt-1">
                                        ${calc.allowedLoss.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                                    </span>
                                    <span className="text-[10px] text-slate-500">
                                        Deductible on 2026 tax
                                    </span>
                                </div>

                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                                    <span className="text-[11px] font-medium text-blue-400 block">
                                        New Cost Basis
                                    </span>
                                    <span className="text-lg font-bold text-blue-400 block mt-1">
                                        ${calc.adjustedCostBasisPerShare.toFixed(2)}
                                    </span>
                                    <span className="text-[10px] text-slate-500">
                                        per replacement share
                                    </span>
                                </div>
                            </div>

                            {/* Detailed Step-by-Step Breakdown */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                                    <Calculator size={16} className="text-emerald-400" />
                                    Cost Basis & Tax Calculation Breakdown
                                </h4>

                                <div className="space-y-2.5 text-xs">
                                    <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                                        <span className="text-slate-400">Original Buy Price ({sharesSold} shares)</span>
                                        <span className="text-slate-200 font-mono">${buyPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                                        <span className="text-slate-400">Loss Sale Price</span>
                                        <span className="text-slate-200 font-mono">${sellPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                                        <span className="text-slate-400">Loss Per Share</span>
                                        <span className="text-rose-400 font-mono">-${calc.lossPerShare.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                                        <span className="text-slate-400">Repurchase Price</span>
                                        <span className="text-slate-200 font-mono">${repurchasePrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                                        <span className="text-slate-400">Added Disallowed Loss per share</span>
                                        <span className="text-amber-400 font-mono">+${calc.addedCostBasisPerShare.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 bg-slate-950 px-3 rounded-lg border border-slate-800 font-medium">
                                        <span className="text-white">Adjusted Cost Basis Per Share:</span>
                                        <span className="text-blue-400 text-sm font-bold font-mono">
                                            ${calc.adjustedCostBasisPerShare.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 bg-slate-950 px-3 rounded-lg border border-slate-800 font-medium">
                                        <span className="text-white">Total Adjusted Basis ({repurchaseShares} shares):</span>
                                        <span className="text-blue-400 text-sm font-bold font-mono">
                                            ${calc.totalAdjustedCostBasis.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-xs text-slate-300">
                                    💡 <strong>Good News:</strong> Even though you cannot write off the <strong>${calc.disallowedLoss.toLocaleString()}</strong> loss on this year's tax return, your cost basis on your replacement shares went from <strong>${repurchasePrice.toFixed(2)}</strong> up to <strong>${calc.adjustedCostBasisPerShare.toFixed(2)}</strong>. When you eventually sell them, your taxable gain will be lower!
                                </div>
                            </div>

                            {/* Form 8949 Quick Preview Card */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <FileText className="text-amber-400" size={16} />
                                        <h4 className="text-sm font-semibold text-white">IRS Form 8949 Entry Preview</h4>
                                    </div>
                                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                                        Schedule D Link
                                    </span>
                                </div>

                                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs space-y-2">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pb-2 border-b border-slate-800 text-slate-400">
                                        <div>Description (Col a)</div>
                                        <div>Code (Col f)</div>
                                        <div>Adjustment (Col g)</div>
                                        <div>Net Gain/Loss (Col h)</div>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-white items-center">
                                        <div>{sharesSold} sh. {symbol}</div>
                                        <div className="text-amber-400 font-bold">{calc.isWashSale ? 'W' : 'None'}</div>
                                        <div className="text-amber-400 font-bold">
                                            {calc.isWashSale ? `+$${calc.disallowedLoss.toFixed(2)}` : '$0.00'}
                                        </div>
                                        <div className="text-emerald-400 font-bold">
                                            -${calc.allowedLoss.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: 61-DAY CALENDAR WINDOW */}
                {activeTab === 'calendar' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Calendar className="text-emerald-400" size={20} />
                                61-Day Wash Sale Window & Interactive Calendar
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                The wash sale rule applies for 30 days BEFORE and 30 days AFTER the sale date. Buying within this 61-day timeframe triggers the penalty.
                            </p>
                        </div>

                        {/* Date Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                                <span className="text-[11px] text-slate-400 block">Window Start (-30 Days)</span>
                                <strong className="text-white text-sm block mt-1">{windowDates.start}</strong>
                                <span className="text-[10px] text-rose-400">Danger period starts</span>
                            </div>
                            <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/40">
                                <span className="text-[11px] text-indigo-400 block">Loss Sale Date (Day 0)</span>
                                <strong className="text-indigo-300 text-sm block mt-1">{sellDate}</strong>
                                <span className="text-[10px] text-slate-400">Sold at loss</span>
                            </div>
                            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                                <span className="text-[11px] text-slate-400 block">Window End (+30 Days)</span>
                                <strong className="text-white text-sm block mt-1">{windowDates.end}</strong>
                                <span className="text-[10px] text-rose-400">Danger period ends</span>
                            </div>
                            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
                                <span className="text-[11px] text-emerald-400 block">First Safe Buy Date</span>
                                <strong className="text-emerald-300 text-sm block mt-1">{windowDates.safe}</strong>
                                <span className="text-[10px] text-emerald-400 font-semibold">100% Tax Safe!</span>
                            </div>
                        </div>

                        {/* Calendar Visual Strip */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                    Day-by-Day Timeline Matrix (61 Days)
                                </h4>
                                <div className="flex items-center gap-3 text-xs">
                                    <span className="flex items-center gap-1.5 text-slate-400">
                                        <span className="w-3 h-3 rounded bg-indigo-600 inline-block"></span> Sale Date
                                    </span>
                                    <span className="flex items-center gap-1.5 text-slate-400">
                                        <span className="w-3 h-3 rounded bg-rose-900/60 border border-rose-600 inline-block"></span> Danger Zone
                                    </span>
                                    <span className="flex items-center gap-1.5 text-slate-400">
                                        <span className="w-3 h-3 rounded bg-emerald-900/60 border border-emerald-500 inline-block"></span> Safe Zone
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-14 gap-1.5 p-4 rounded-xl bg-slate-950 border border-slate-800 max-h-[360px] overflow-y-auto">
                                {calendarDays.map((d) => (
                                    <div
                                        key={d.offset}
                                        className={`p-2 rounded-lg text-center border transition ${
                                            d.isSaleDay
                                                ? 'bg-indigo-600 text-white border-indigo-400 font-bold shadow-md'
                                                : d.isRepurchaseDay
                                                ? 'bg-amber-600 text-white border-amber-400 font-bold'
                                                : d.isSafe
                                                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40 hover:border-emerald-500'
                                                : 'bg-rose-950/30 text-rose-300 border-rose-900/40 hover:border-rose-600'
                                        }`}
                                        title={`${d.dateStr} (Day ${d.offset >= 0 ? `+${d.offset}` : d.offset})`}
                                    >
                                        <span className="text-[9px] block text-slate-400 font-mono">
                                            {d.offset >= 0 ? `+${d.offset}` : d.offset}
                                        </span>
                                        <span className="text-xs font-bold block">{d.displayDay}</span>
                                        <span className="text-[8px] text-slate-400 block">{d.displayMonth}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: IRS FORM 8949 & TAX GUIDE */}
                {activeTab === 'tax-guide' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <FileText className="text-amber-400" size={20} />
                                How to File & Avoid Wash Sales (IRS Guide)
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Complete walkthrough for Form 8949, Schedule D, and legal tax avoidance techniques.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                                    <h4 className="font-semibold text-white text-sm mb-2">
                                        1. The 3 Legal Ways to Trade Around Wash Sales
                                    </h4>
                                    <ul className="list-disc list-inside space-y-1.5 text-slate-400">
                                        <li>
                                            <strong className="text-slate-200">Wait 31 Full Days:</strong> Sell at a loss and wait until day 31 before re-entering the position.
                                        </li>
                                        <li>
                                            <strong className="text-slate-200">Switch to Non-Identical Assets:</strong> Sell AMD at a loss and immediately buy NVDA or an ETF like SMH. The IRS does not consider different companies as "substantially identical".
                                        </li>
                                        <li>
                                            <strong className="text-slate-200">Section 475(f) Mark-to-Market:</strong> Full-time day traders with Trader Tax Status (TTS) can make an IRS election to exempt themselves from the wash sale rule completely.
                                        </li>
                                    </ul>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                                    <h4 className="font-semibold text-white text-sm mb-2">
                                        2. Why IRAs and 401(k)s are a Wash Sale Trap
                                    </h4>
                                    <p className="text-rose-400">
                                        ⚠️ <strong>DANGER:</strong> If you sell stock for a loss in a taxable brokerage account and rebuy it inside your Roth IRA or Traditional IRA within 30 days, the loss is disallowed permanently and CANNOT be added to the IRA cost basis!
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                                    <h4 className="font-semibold text-white text-sm mb-2">
                                        3. How Brokers Report Wash Sales on Form 1099-B
                                    </h4>
                                    <p className="text-slate-400">
                                        Brokers like Robinhood, Charles Schwab, Fidelity, and Webull track wash sales automatically within the SAME account and report disallowed losses in <strong>Box 1g</strong> of your 1099-B.
                                    </p>
                                    <p className="text-slate-400 mt-2">
                                        However, brokers do NOT track wash sales across different accounts or your spouse's account. It is your legal responsibility to track them using tools like this calculator.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                                    <h4 className="font-semibold text-white text-sm mb-2">
                                        4. Form 8949 Instructions
                                    </h4>
                                    <p className="text-slate-400">
                                        Enter Code <span className="text-amber-400 font-bold">W</span> in Column (f). In Column (g), enter the disallowed loss amount as a positive figure. This ensures your net loss in Column (h) reflects only the legal deductible portion.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* COMPREHENSIVE IN-PAGE SEO MASTERCLASS & TAX COMPLIANCE GUIDE */}
                {/* ========================================================================= */}
                <div className="mt-14 space-y-10 text-slate-300">
                    {/* Article Header */}
                    <div className="border-b border-slate-800 pb-6">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                                IRS Tax Compliance 2026
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
                                IRC § 1091 Explained
                            </span>
                            <span className="text-xs text-slate-500">
                                12 Min Comprehensive Read
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            The Complete IRS 30-Day Wash Sale Rule Guide: Formulas, Form 8949 &amp; Tax-Loss Harvesting
                        </h2>
                        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
                            A complete educational masterclass for US equity, options, ETF, and crypto traders. Learn how disallowed losses are calculated, how adjusted cost basis shields future profits, and the legal strategies to tax-loss harvest without triggering penalties.
                        </p>
                    </div>

                    {/* Section 1: What is the Wash Sale Rule? */}
                    <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
                        <div className="flex items-center gap-2.5 text-emerald-400">
                            <BookOpen size={20} />
                            <h3 className="text-lg sm:text-xl font-bold text-white">
                                1. What is the IRS Wash Sale Rule (IRC Section 1091)?
                            </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            Under <strong>Internal Revenue Code (IRC) § 1091</strong>, the IRS prohibits taxpayers from claiming an immediate capital loss deduction on the sale of a stock or security if they acquire a <strong className="text-white">"substantially identical"</strong> stock or security (or enter into a contract or option to acquire it) within a <strong className="text-emerald-400">61-day rolling window</strong>.
                        </p>
                        
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                The 61-Day Rolling Window Timeline Breakdown:
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                                <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40">
                                    <span className="font-bold text-rose-300 block mb-1">30 Days Prior (Pre-Purchase)</span>
                                    <p className="text-slate-400">Buying the same stock up to 30 days BEFORE selling your existing lot at a loss.</p>
                                </div>
                                <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-800/40">
                                    <span className="font-bold text-indigo-300 block mb-1">Day of Sale (Day 0)</span>
                                    <p className="text-slate-400">The exact execution date when shares are sold at a realized capital loss.</p>
                                </div>
                                <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40">
                                    <span className="font-bold text-rose-300 block mb-1">30 Days After (Post-Purchase)</span>
                                    <p className="text-slate-400">Repurchasing the same or substantially identical shares within 30 calendar days after the sale.</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                            The wash sale rule was established to prevent investors from generating artificial "paper losses" for tax-deduction purposes while preserving their economic exposure and upside in the underlying company.
                        </p>
                    </section>

                    {/* Section 2: Asset Class Comparison Matrix */}
                    <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
                        <div className="flex items-center gap-2.5 text-blue-400">
                            <Scale size={20} />
                            <h3 className="text-lg sm:text-xl font-bold text-white">
                                2. Asset-by-Asset Wash Sale Rules Matrix
                            </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-400">
                            Not all financial instruments are treated equally under IRC § 1091. Here is how the IRS treats major asset classes:
                        </p>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
                                <thead className="bg-slate-950 text-slate-300 font-semibold border-b border-slate-800">
                                    <tr>
                                        <th className="p-3.5">Asset Class</th>
                                        <th className="p-3.5">Wash Sale Applies?</th>
                                        <th className="p-3.5">IRS Classification</th>
                                        <th className="p-3.5">Legal Tax-Loss Strategy</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                                    <tr>
                                        <td className="p-3.5 font-bold text-white">Individual Stocks (AAPL, TSLA)</td>
                                        <td className="p-3.5 font-semibold text-rose-400">YES (100% Strictly Enforced)</td>
                                        <td className="p-3.5 text-slate-400">Equity Securities</td>
                                        <td className="p-3.5 text-slate-300">Wait 31 full days or buy peer company in same sector (e.g. AMD to NVDA).</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-bold text-white">Equity Options (Calls &amp; Puts)</td>
                                        <td className="p-3.5 font-semibold text-rose-400">YES (Triggered via Contract)</td>
                                        <td className="p-3.5 text-slate-400">Contracts / Options on Securities</td>
                                        <td className="p-3.5 text-slate-300">Avoid buying deep in-the-money calls or identical expiration strikes within 30 days.</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-bold text-white">Index ETFs (SPY, VOO, IVV)</td>
                                        <td className="p-3.5 font-semibold text-amber-400">YES for same ETF; NO for peers</td>
                                        <td className="p-3.5 text-slate-400">Investment Company Securities</td>
                                        <td className="p-3.5 text-slate-300">Sell SPY at loss and immediately buy VOO, IVV, or Total Market VTI.</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-bold text-white">Cryptocurrency (BTC, ETH, SOL)</td>
                                        <td className="p-3.5 font-semibold text-emerald-400">NO (Currently Exempt in 2026)</td>
                                        <td className="p-3.5 text-slate-400">Property (IRS Notice 2014-21)</td>
                                        <td className="p-3.5 text-slate-300">Full tax-loss harvesting allowed: sell BTC at loss and rebuy instantly without waiting.</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-bold text-white">CME Futures (ES, NQ, Micro Futures)</td>
                                        <td className="p-3.5 font-semibold text-emerald-400">NO (Exempt under IRC § 1256)</td>
                                        <td className="p-3.5 text-slate-400">Regulated Futures Contracts</td>
                                        <td className="p-3.5 text-slate-300">Taxed under 60/40 rule (60% long-term, 40% short-term) regardless of holding period.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Section 3: Exact Formulas & Mathematical Case Studies */}
                    <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
                        <div className="flex items-center gap-2.5 text-purple-400">
                            <Calculator size={20} />
                            <h3 className="text-lg sm:text-xl font-bold text-white">
                                3. Exact Mathematical Formulas &amp; Real-World Case Studies
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                                    Disallowed Loss Formula:
                                </h4>
                                <div className="p-3 rounded-lg bg-slate-900 font-mono text-xs text-white border border-slate-800">
                                    Disallowed Loss = (Shares Replaced / Shares Sold) × Total Realized Loss
                                </div>
                                <p className="text-[11px] text-slate-400">
                                    For full repurchases, 100% is disallowed. For partial repurchases, only the replaced proportion is disallowed.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                                    Adjusted Cost Basis Formula:
                                </h4>
                                <div className="p-3 rounded-lg bg-slate-900 font-mono text-xs text-white border border-slate-800">
                                    New Basis Per Share = Replacement Price + (Disallowed Loss / Replacement Shares)
                                </div>
                                <p className="text-[11px] text-slate-400">
                                    The disallowed loss per share is added directly onto your new purchase price, shielding future profits from capital gains tax.
                                </p>
                            </div>
                        </div>

                        {/* Case Study Walkthrough */}
                        <div className="space-y-4 pt-2">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                <Sparkles size={16} className="text-amber-400" />
                                Case Study: Partial Wash Sale with Tesla (TSLA)
                            </h4>
                            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs leading-relaxed">
                                <p className="text-slate-300">
                                    <strong className="text-white">Transaction 1:</strong> On October 1, 2026, you buy 100 shares of TSLA at $250 ($25,000 total).
                                </p>
                                <p className="text-slate-300">
                                    <strong className="text-white">Transaction 2:</strong> On October 15, 2026, TSLA drops to $200. You sell all 100 shares, realizing a <strong className="text-rose-400">-$5,000 capital loss</strong> ($50 loss per share).
                                </p>
                                <p className="text-slate-300">
                                    <strong className="text-white">Transaction 3:</strong> On October 25, 2026 (10 days later), TSLA rebounds to $210. You buy back <strong className="text-amber-400">only 50 shares</strong>.
                                </p>
                                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                                    <div className="flex justify-between text-slate-400">
                                        <span>Total Realized Loss:</span>
                                        <span className="text-rose-400">-$5,000.00</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400">
                                        <span>Disallowed Loss (50 replaced shares × $50 loss):</span>
                                        <span className="text-rose-400 font-bold">+$2,500.00 (Disallowed)</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400">
                                        <span>Allowed Deductible Loss for 2026 Tax Return:</span>
                                        <span className="text-emerald-400 font-bold">-$2,500.00 (Deductible!)</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                                        <span>Adjusted Cost Basis on 50 new shares ($210 + $50):</span>
                                        <span className="text-blue-400 font-bold">$260.00 / share</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: The 5 Dangerous Traps */}
                    <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
                        <div className="flex items-center gap-2.5 text-rose-400">
                            <ShieldAlert size={20} />
                            <h3 className="text-lg sm:text-xl font-bold text-white">
                                4. The 5 Dangerous Wash Sale Traps That Cost Traders Thousands
                            </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-400">
                            Many active retail traders mistakenly think wash sales are harmless bookkeeping adjustments. Beware of these critical real-world traps:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/30 space-y-2">
                                <h4 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                                    <AlertTriangle size={15} />
                                    Trap 1: The IRA &amp; 401(k) Permanent Disallowance Trap
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Under <strong>IRS Revenue Ruling 2008-5</strong>, if you sell stock for a loss in a taxable brokerage account and rebuy it inside your Roth IRA or Traditional IRA within 30 days, your loss is <strong className="text-rose-400">disallowed permanently</strong>! Furthermore, because IRAs are tax-sheltered, you cannot add the disallowed loss to your IRA basis. That tax write-off vanishes forever.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                                    <RefreshCw size={15} />
                                    Trap 2: Automated Dividend Reinvestment (DRIP)
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    If you sell dividend-paying stock (e.g. Apple or Coca-Cola) at a loss, and an automated DRIP feature purchases fractional shares within 30 days, that automatic purchase triggers an unintended wash sale on those fractional shares. Always disable DRIP before tax-loss harvesting.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                                <h4 className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                                    <Eye size={15} />
                                    Trap 3: The Multiple Brokerage Accounts Blindspot
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Brokers are legally required to track wash sales only within that single account. If you sell Nvidia at a loss in Robinhood and buy Nvidia in Charles Schwab 5 days later, neither broker will flag the wash sale on your 1099-B. However, the IRS requires you to cross-report them; failing to do so in an audit can lead to back-taxes and penalties.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                                <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                                    <Clock size={15} />
                                    Trap 4: The Year-End December 31 Timing Trap
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    If you sell a losing position on December 28 to write off $10,000 in capital gains for that tax year, but repurchase the position on January 10 of the new year, the December loss is retroactively disallowed for that tax year! To lock in your deduction, stay out of the position for at least 31 full days.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 5: Step-by-Step Form 8949 Guide */}
                    <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
                        <div className="flex items-center gap-2.5 text-amber-400">
                            <FileText size={20} />
                            <h3 className="text-lg sm:text-xl font-bold text-white">
                                5. Step-by-Step IRS Form 8949 &amp; Schedule D Reporting Walkthrough
                            </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-400">
                            When reporting stock and option transactions on <strong>Form 8949 (Sales and Other Dispositions of Capital Assets)</strong>, wash sales must be explicitly accounted for using adjustment codes:
                        </p>

                        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h5 className="font-bold text-white">Form 8949 Columns Explained:</h5>
                                    <ul className="list-disc pl-4 space-y-1 text-slate-400">
                                        <li><strong>Column (d) Proceeds:</strong> Total dollar proceeds received from the sale.</li>
                                        <li><strong>Column (e) Cost Basis:</strong> Original purchase cost basis of the shares sold.</li>
                                        <li><strong>Column (f) Adjustment Code:</strong> Enter <span className="text-amber-400 font-bold">Code 'W'</span> for wash sale adjustments.</li>
                                        <li><strong>Column (g) Adjustment Amount:</strong> Enter the disallowed loss as a <strong className="text-white">positive dollar amount</strong>.</li>
                                        <li><strong>Column (h) Net Gain or Loss:</strong> Calculated as: <code>(d) - (e) + (g)</code>.</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h5 className="font-bold text-white">Example Entry on Form 8949:</h5>
                                    <div className="p-3 rounded-lg bg-slate-900 font-mono text-[11px] text-slate-300 space-y-1">
                                        <div>Col (a) Description: 100 sh. NVDA</div>
                                        <div>Col (d) Proceeds: $11,000.00</div>
                                        <div>Col (e) Cost Basis: $14,000.00</div>
                                        <div>Col (f) Code: <span className="text-amber-400 font-bold">W</span></div>
                                        <div>Col (g) Adjustment: <span className="text-amber-400 font-bold">+$3,000.00</span></div>
                                        <div className="text-emerald-400 font-bold">Col (h) Net Loss: $0.00</div>
                                    </div>
                                    <p className="text-[11px] text-slate-500">
                                        The +$3,000 adjustment in Col (g) perfectly neutralizes the -$3,000 loss in Col (h), preventing the deduction while transferring the $3,000 basis to your replacement lot.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 6: Tax-Loss Harvesting Playbook */}
                    <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
                        <div className="flex items-center gap-2.5 text-emerald-400">
                            <ShieldCheck size={20} />
                            <h3 className="text-lg sm:text-xl font-bold text-white">
                                6. The 4 Legal Tax-Loss Harvesting Playbooks to Avoid Wash Sales
                            </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-400">
                            Smart institutional and retail traders use these 4 legal techniques to harvest valuable tax deductions without sacrificing upside exposure:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                                <h4 className="font-bold text-white flex items-center gap-1.5">
                                    <CheckCircle2 size={16} className="text-emerald-400" />
                                    Playbook 1: The Correlated Asset Swap
                                </h4>
                                <p className="text-slate-400 leading-relaxed">
                                    Sell a losing stock or ETF and immediately buy a highly correlated alternative in the same sector. For example, sell <strong>AMD</strong> at a loss and buy <strong>NVDA</strong> or <strong>SMH</strong>. The IRS does not view different corporations as substantially identical, so your tax loss is 100% legal.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                                <h4 className="font-bold text-white flex items-center gap-1.5">
                                    <CheckCircle2 size={16} className="text-emerald-400" />
                                    Playbook 2: The ETF Index Swap (SPY to VOO to VTI)
                                </h4>
                                <p className="text-slate-400 leading-relaxed">
                                    Sell <strong>SPY</strong> (State Street S&P 500 ETF) at a loss and buy <strong>VTI</strong> (Vanguard Total Stock Market ETF) or <strong>SCHX</strong> (Schwab US Large-Cap). Because these track different benchmark indices, tax courts have upheld that they are not substantially identical.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                                <h4 className="font-bold text-white flex items-center gap-1.5">
                                    <CheckCircle2 size={16} className="text-emerald-400" />
                                    Playbook 3: The 31-Day Cash Parking Rule
                                </h4>
                                <p className="text-slate-400 leading-relaxed">
                                    Sell your position at a loss and park your capital in short-term US Treasury Bills (SGOV, BIL) or high-yield money market funds yielding ~5% APY. On Day 31, re-enter your original stock with your full tax write-off intact plus interest earned.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                                <h4 className="font-bold text-white flex items-center gap-1.5">
                                    <CheckCircle2 size={16} className="text-emerald-400" />
                                    Playbook 4: Section 475(f) Mark-to-Market Election
                                </h4>
                                <p className="text-slate-400 leading-relaxed">
                                    Full-time professional day traders eligible for <strong>Trader Tax Status (TTS)</strong> can file an annual Section 475(f) election with the IRS. Under mark-to-market accounting, wash sale rules are completely eliminated, and trading losses can be deducted without the $3,000 annual net capital loss ceiling!
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* FAQ SECTION (With FAQ Schema Markup for SEO Ranking) */}
                <div className="mt-14 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
                    <div className="flex items-center gap-2 mb-4">
                        <HelpCircle className="text-emerald-400" size={20} />
                        <h3 className="text-base sm:text-lg font-bold text-white">
                            Frequently Asked Questions (Wash Sale Rules)
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full px-4 py-3 text-left font-semibold text-xs sm:text-sm text-slate-200 flex items-center justify-between hover:text-white"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-200 text-slate-400 ${
                                            openFaq === idx ? 'rotate-180 text-emerald-400' : ''
                                        }`}
                                    />
                                </button>
                                {openFaq === idx && (
                                    <div className="px-4 pb-3 text-xs text-slate-400 border-t border-slate-800/60 pt-2 leading-relaxed">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Related Free Trading Tools Grid */}
                <RelatedToolsGrid
                    currentToolSlug="/tools/wash-sale-calculator"
                    category="tax"
                    title="Related Trading & Risk Management Calculators"
                    subtitle="Track wash sale disallowed losses alongside portfolio drawdown recovery, risk of ruin probabilities, and leverage exposure."
                />

                {/* Bottom Disclaimer */}
                <div className="mt-8 text-center text-[11px] text-slate-500 max-w-2xl mx-auto">
                    Disclaimer: This calculator is provided for informational and educational purposes only and does not constitute formal tax or legal advice. Always consult a Certified Public Accountant (CPA) or tax attorney for your specific IRS reporting requirements.
                </div>
            </div>
        </div>
    );
};
