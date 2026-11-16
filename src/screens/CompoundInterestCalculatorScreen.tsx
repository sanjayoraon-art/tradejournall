import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Coins, Calculator, DollarSign, ArrowRight, ShieldCheck, ShieldAlert,
    CheckCircle2, AlertTriangle, HelpCircle, ChevronDown, Copy, Check,
    Sparkles, RefreshCw, FileText, Share2, Info, ArrowLeft, ArrowUpRight,
    TrendingDown, TrendingUp, BookOpen, Scale, Clock, Eye, Plus, Trash2,
    PieChart, Landmark, Percent, Zap, Award, ExternalLink, Target,
    SlidersHorizontal, Layers, CheckCircle, Table, BarChart3, AlertOctagon,
    Calendar, Flame, Download
} from 'lucide-react';
import { RelatedToolsGrid } from '../components/RelatedToolsGrid';

export interface CompoundInterestCalculatorScreenProps {
    theme?: any;
    isDarkMode?: boolean;
    primaryCurrencySymbol?: string;
    onBackToLanding?: () => void;
    onSignIn?: () => void;
}

interface YearBreakdown {
    year: number;
    depositTotal: number;
    interestEarnedYear: number;
    totalInterestAccrued: number;
    endBalance: number;
}

interface DayBreakdown {
    day: number;
    startBalance: number;
    dailyGain: number;
    endBalance: number;
    totalProfit: number;
}

interface PresetScenario {
    id: string;
    title: string;
    badge: string;
    description: string;
    mode: 'wealth' | 'trader' | 'goal';
    principal: number;
    monthlyContribution: number;
    rate: number;
    years: number;
    frequency: number; // 12 = monthly, 365 = daily, 1 = annually
    currency: string;
}

const PRESET_SCENARIOS: PresetScenario[] = [
    {
        id: 'sp500-longterm',
        title: 'S&P 500 Index Compounding (10% Historical)',
        badge: 'Classic Wealth',
        description: '$10,000 initial + $500/month in broad market index funds over 20 years.',
        mode: 'wealth',
        principal: 10000,
        monthlyContribution: 500,
        rate: 10,
        years: 20,
        frequency: 12,
        currency: '$'
    },
    {
        id: 'fire-millionaire',
        title: '$1 Million FIRE Retirement Fast-Track',
        badge: 'FIRE Goal',
        description: '$25,000 starting + $1,500 aggressive monthly savings at 11% return over 15 years.',
        mode: 'wealth',
        principal: 25000,
        monthlyContribution: 1500,
        rate: 11,
        years: 15,
        frequency: 12,
        currency: '$'
    },
    {
        id: 'indian-sip-wealth',
        title: 'Indian Crorepati SIP (₹10K / Month)',
        badge: 'NSE / Nifty 50',
        description: '₹50,000 initial + ₹10,000 monthly SIP compounding at 13% for 18 years to hit ₹1 Crore.',
        mode: 'wealth',
        principal: 50000,
        monthlyContribution: 10000,
        rate: 13,
        years: 18,
        frequency: 12,
        currency: '₹'
    },
    {
        id: 'day-trader-1pct',
        title: 'Day Trader 1% Daily Compounding Challenge',
        badge: 'Day Trading',
        description: '$2,000 account targetting 1% daily gain across 60 strict disciplined trading sessions.',
        mode: 'trader',
        principal: 2000,
        monthlyContribution: 0,
        rate: 1, // 1% per day
        years: 60, // 60 days
        frequency: 365,
        currency: '$'
    }
];

const FAQ_ITEMS = [
    {
        q: 'What is a compound interest calculator for daily compounding and how does it work?',
        a: 'A compound interest calculator for daily compounding calculates investment growth where interest is calculated and reinvested every single day (365 times per year). It supports two modes: (1) converting an Annual APY (like 5.5% on cash savings) into an exact daily compounded rate (r ÷ 365), and (2) modeling fixed daily percentage returns (like 1% per day in trading and crypto).'
    },
    {
        q: 'What is the formula for compound interest for daily compounding?',
        a: 'When compounding daily from an annual interest rate: A = P(1 + r/365)^(365 × t), where P is principal, r is nominal annual rate, and t is time in years. If you are compounding a fixed daily percentage gain (i): A = P(1 + i)^d, where d is the number of active days.'
    },
    {
        q: 'How much will $1,000 be in 1 year at 1% daily compound interest?',
        a: 'Mathematically, $1,000 compounded at 1% daily for 365 days grows to $37,783.43 ($1,000 × 1.01^365). Over 30 days, it grows to $1,347.85. Over 60 days, it reaches $1,816.70. This highlights the explosive nature of daily geometric growth.'
    },
    {
        q: 'Does daily compounding produce more money than monthly compounding?',
        a: 'Yes, but for standard banking interest rates, the difference is modest. For example, $10,000 at 10% annual interest over 20 years yields $67,275 with annual compounding, $73,280 with monthly compounding, and $73,870 with daily compounding. Daily compounding gives an extra $590 due to 365 reinvestment cycles.'
    },
    {
        q: 'What is the Rule of 72 and how does it relate to compounding?',
        a: 'The Rule of 72 is an algebraic shortcut to estimate how many years it takes for an investment to double: Doubling Years ≈ 72 ÷ Annual Interest Rate. For example, at an 8% annual return, your money doubles in approximately 72 ÷ 8 = 9 years; at 12%, it doubles in just 6 years.'
    },
    {
        q: 'What is the difference between Simple Interest and Compound Interest?',
        a: 'Simple interest only pays returns on the initial principal deposit forever. Compound interest pays returns on BOTH the initial principal AND all previously accumulated interest. Over 25 years, compound interest can generate 300% to 800% more total wealth than simple interest on the exact same capital.'
    },
    {
        q: 'Is 1% daily compounding realistic for day traders?',
        a: 'Mathematically, 1% daily compounding on $1,000 turns into $37,783 in 365 days. However, in reality, markets have losing streaks, liquidity limits, slippage, and psychological friction. Experienced day traders use compounding calculations to model account scaling, but always withdraw profits regularly rather than risking entire bloated account balances.'
    },
    {
        q: 'Which financial assets offer daily compound interest?',
        a: 'High-Yield Savings Accounts (HYSAs), Certificates of Deposit (CDs), Money Market Mutual Funds, DeFi Liquidity Pools, and Cryptocurrency Proof-of-Stake (PoS) validator rewards frequently calculate and accrue interest on a daily basis.'
    }
];

export const CompoundInterestCalculatorScreen: React.FC<CompoundInterestCalculatorScreenProps> = ({
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
    // Check if user came from a "daily" specific route
    const isDailyUrl = typeof window !== 'undefined' && (
        window.location.pathname.toLowerCase().includes('daily') ||
        window.location.pathname.toLowerCase().includes('compound-interest-calculator-for-daily')
    );

    // Mode Switcher: 'wealth' | 'trader' | 'goal'
    const [calcMode, setCalcMode] = useState<'wealth' | 'trader' | 'goal'>(isDailyUrl ? 'trader' : 'wealth');

    // Currency selection
    const [currency, setCurrency] = useState<string>(primaryCurrencySymbol || '$');

    // Mode 1: Wealth & Contributions State
    const [principal, setPrincipal] = useState<number>(10000);
    const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
    const [annualRate, setAnnualRate] = useState<number>(10);
    const [investmentYears, setInvestmentYears] = useState<number>(20);
    const [compoundFrequency, setCompoundFrequency] = useState<number>(12); // 12 = monthly, 1 = annually, 4 = quarterly, 365 = daily

    // Mode 2: Daily Compounding State (Day Trader & Daily Cash Interest)
    const [traderBalance, setTraderBalance] = useState<number>(2000);
    const [dailyInputType, setDailyInputType] = useState<'dailyRate' | 'annualApy'>('dailyRate');
    const [dailyTargetPercent, setDailyTargetPercent] = useState<number>(1.0);
    const [dailyApyRate, setDailyApyRate] = useState<number>(5.5);
    const [tradingDays, setTradingDays] = useState<number>(60);
    const [reinvestPercent, setReinvestPercent] = useState<number>(100);
    const [showAllDays, setShowAllDays] = useState<boolean>(false);

    // Mode 3: Goal Solver State
    const [targetGoalAmount, setTargetGoalAmount] = useState<number>(1000000);
    const [goalStartingCapital, setGoalStartingCapital] = useState<number>(15000);
    const [goalYears, setGoalYears] = useState<number>(15);
    const [goalRate, setGoalRate] = useState<number>(10);

    // UI State
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
    const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

    // ==========================================
    // 1. WEALTH COMPOUNDING CALCULATIONS
    // ==========================================
    const wealthResults = useMemo(() => {
        const P = Math.max(0, Number(principal) || 0);
        const PMT = Math.max(0, Number(monthlyContribution) || 0);
        const r = (Number(annualRate) || 0) / 100;
        const t = Math.max(1, Math.min(60, Number(investmentYears) || 1));
        const n = Number(compoundFrequency) || 12;

        const yearData: YearBreakdown[] = [];
        let runningBalance = P;
        let totalDeposited = P;

        for (let y = 1; y <= t; y++) {
            const startYearBalance = runningBalance;
            let yearDeposits = 0;
            
            for (let m = 1; m <= 12; m++) {
                runningBalance += PMT;
                yearDeposits += PMT;
                totalDeposited += PMT;
                const periodicRate = r / n;
                const compoundingEventsThisMonth = n / 12;
                runningBalance *= Math.pow(1 + periodicRate, compoundingEventsThisMonth);
            }

            const yearEndBalance = runningBalance;
            const interestEarnedThisYear = yearEndBalance - startYearBalance - yearDeposits;
            const totalInterestAccrued = yearEndBalance - totalDeposited;

            yearData.push({
                year: y,
                depositTotal: totalDeposited,
                interestEarnedYear: Math.max(0, interestEarnedThisYear),
                totalInterestAccrued: Math.max(0, totalInterestAccrued),
                endBalance: Math.max(0, yearEndBalance)
            });
        }

        const futureValue = runningBalance;
        const totalInterest = Math.max(0, futureValue - totalDeposited);
        const principalSharePercent = futureValue > 0 ? (totalDeposited / futureValue) * 100 : 0;
        const interestSharePercent = futureValue > 0 ? (totalInterest / futureValue) * 100 : 0;
        const wealthMultiplier = totalDeposited > 0 ? futureValue / totalDeposited : 1;
        const doublingYears = r > 0 ? (72 / (r * 100)).toFixed(1) : 'N/A';

        return {
            futureValue,
            totalDeposited,
            totalInterest,
            principalSharePercent,
            interestSharePercent,
            wealthMultiplier,
            doublingYears,
            yearData
        };
    }, [principal, monthlyContribution, annualRate, investmentYears, compoundFrequency]);

    // ==========================================
    // 2. DAILY COMPOUNDING CALCULATIONS (DAY TRADER & CASH APY)
    // ==========================================
    const traderResults = useMemo(() => {
        const start = Math.max(1, Number(traderBalance) || 0);
        // Effective daily rate
        const rate = dailyInputType === 'annualApy'
            ? ((Number(dailyApyRate) || 0) / 100) / 365
            : (Number(dailyTargetPercent) || 0) / 100;

        const days = Math.max(1, Math.min(365, Number(tradingDays) || 1));
        const reinvestFraction = Math.max(0, Math.min(100, Number(reinvestPercent) || 100)) / 100;

        let currentBalance = start;
        let totalWithdrawn = 0;
        const dayRows: DayBreakdown[] = [];

        for (let d = 1; d <= days; d++) {
            const startDay = currentBalance;
            const rawDailyGain = startDay * rate;
            const reinvestedGain = rawDailyGain * reinvestFraction;
            const withdrawnGain = rawDailyGain * (1 - reinvestFraction);

            currentBalance += reinvestedGain;
            totalWithdrawn += withdrawnGain;

            dayRows.push({
                day: d,
                startBalance: startDay,
                dailyGain: rawDailyGain,
                endBalance: currentBalance,
                totalProfit: (currentBalance - start) + totalWithdrawn
            });
        }

        const totalNetProfit = (currentBalance - start) + totalWithdrawn;
        const roiPercent = start > 0 ? (totalNetProfit / start) * 100 : 0;

        return {
            endBalance: currentBalance,
            totalWithdrawn,
            totalNetProfit,
            roiPercent,
            effectiveDailyRatePercent: rate * 100,
            dayRows
        };
    }, [traderBalance, dailyTargetPercent, dailyApyRate, dailyInputType, tradingDays, reinvestPercent]);

    // ==========================================
    // 3. GOAL SOLVER CALCULATIONS
    // ==========================================
    const goalResults = useMemo(() => {
        const target = Math.max(0, Number(targetGoalAmount) || 0);
        const P = Math.max(0, Number(goalStartingCapital) || 0);
        const t = Math.max(1, Number(goalYears) || 1);
        const r = (Number(goalRate) || 0) / 100;

        const months = t * 12;
        const monthlyRate = r / 12;

        const fvOfPrincipal = P * Math.pow(1 + monthlyRate, months);
        const remainingGoal = target - fvOfPrincipal;

        let monthlyDepositNeeded = 0;
        if (remainingGoal > 0 && monthlyRate > 0) {
            monthlyDepositNeeded = remainingGoal / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        }

        return {
            target,
            fvOfPrincipal,
            remainingGoal,
            monthlyDepositNeeded: Math.max(0, monthlyDepositNeeded),
            isAlreadyReached: fvOfPrincipal >= target
        };
    }, [targetGoalAmount, goalStartingCapital, goalYears, goalRate]);

    const applyPreset = (preset: PresetScenario) => {
        setCurrency(preset.currency);
        setCalcMode(preset.mode);
        if (preset.mode === 'wealth') {
            setPrincipal(preset.principal);
            setMonthlyContribution(preset.monthlyContribution);
            setAnnualRate(preset.rate);
            setInvestmentYears(preset.years);
            setCompoundFrequency(preset.frequency);
        } else if (preset.mode === 'trader') {
            setTraderBalance(preset.principal);
            setDailyInputType('dailyRate');
            setDailyTargetPercent(preset.rate);
            setTradingDays(preset.years);
        }
    };

    const exportDailyCsv = () => {
        let csv = `Day,Starting Balance (${currency}),Daily Interest/Gain (${currency}),Ending Balance (${currency}),Total Cumulative Profit (${currency})\n`;
        traderResults.dayRows.forEach((row) => {
            csv += `${row.day},${row.startBalance.toFixed(2)},${row.dailyGain.toFixed(2)},${row.endBalance.toFixed(2)},${row.totalProfit.toFixed(2)}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `compound-interest-daily-schedule-${tradingDays}-days.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const copySummary = () => {
        let text = '';
        if (calcMode === 'wealth') {
            text = `💰 Compound Interest Wealth Forecast:
• Initial Investment: ${currency}${wealthResults.totalDeposited.toLocaleString()}
• Future Value (${investmentYears} Years @ ${annualRate}%): ${currency}${wealthResults.futureValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Total Interest Earned: ${currency}${wealthResults.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Total Wealth Multiplier: ${wealthResults.wealthMultiplier.toFixed(2)}x
• Estimated Doubling Period: Every ${wealthResults.doublingYears} Years
Calculated via TradeJournall Compound Interest Calculator: https://tradejournall.com/tools/compound-interest-calculator`;
        } else if (calcMode === 'trader') {
            text = `📈 Compound Interest Calculator for Daily Schedule:
• Starting Balance: ${currency}${traderBalance.toLocaleString()}
• Daily Rate: ${traderResults.effectiveDailyRatePercent.toFixed(4)}% across ${tradingDays} Days
• Final Balance: ${currency}${traderResults.endBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Net Profit: ${currency}${traderResults.totalNetProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (+${traderResults.roiPercent.toFixed(1)}% ROI)
Calculated via TradeJournall: https://tradejournall.com/tools/compound-interest-calculator-for-daily`;
        } else {
            text = `🎯 Goal Target Wealth Solver:
• Target Milestone: ${currency}${targetGoalAmount.toLocaleString()} in ${goalYears} Years
• Starting Capital: ${currency}${goalStartingCapital.toLocaleString()} @ ${goalRate}% Return
• Required Monthly Savings: ${currency}${goalResults.monthlyDepositNeeded.toFixed(2)}/month
Calculated via TradeJournall: https://tradejournall.com/tools/compound-interest-calculator`;
        }

        navigator.clipboard.writeText(text);
        setCopiedSummary(true);
        setTimeout(() => setCopiedSummary(false), 2500);
    };

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans selection:bg-emerald-500/20`}>
            <Helmet>
                <title>Compound Interest Calculator for Daily – Daily Compounding Calculator (2026)</title>
                <meta
                    name="description"
                    content="Free compound interest calculator for daily returns. Calculate daily compound interest from annual APY savings or simulate 1% daily trading compounding with day-by-day schedules, Rule of 72 dates, and CSV export."
                />
                <meta
                    name="keywords"
                    content="compound interest calculator for daily, daily compound interest calculator, compound interest calculator daily, daily compounding calculator, daily compound interest formula, compound daily calculator, 1 percent daily compound interest calculator, compound interest calculator with monthly contributions, compound interest formula"
                />
                <link rel="canonical" href="https://tradejournall.com/tools/compound-interest-calculator-for-daily" />

                {/* Open Graph / Social */}
                <meta property="og:title" content="Compound Interest Calculator for Daily – Daily Compounding Calculator" />
                <meta property="og:description" content="Calculate daily compound interest from annual APY savings or simulate 1% daily trading compounding with day-by-day growth schedules." />
                <meta property="og:url" content="https://tradejournall.com/tools/compound-interest-calculator-for-daily" />
                <meta property="og:type" content="website" />

                {/* Structured Data Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@graph': [
                            {
                                '@type': 'SoftwareApplication',
                                name: 'Compound Interest Calculator for Daily & Wealth Growth Simulator',
                                operatingSystem: 'All',
                                applicationCategory: 'FinanceApplication',
                                offers: {
                                    '@type': 'Offer',
                                    price: '0.00',
                                    priceCurrency: 'USD'
                                },
                                description: 'Free online compound interest calculator for daily returns. Calculate daily compounding, annual APY daily accruals, monthly deposits, and day-by-day growth curves.'
                            },
                            {
                                '@type': 'HowTo',
                                name: 'How to Calculate Compound Interest for Daily Periods',
                                description: 'Step-by-step method to calculate daily compound interest on cash savings, high-yield accounts, or trading balances.',
                                step: [
                                    {
                                        '@type': 'HowToStep',
                                        name: 'Step 1: Determine starting principal and daily interest rate',
                                        text: 'Divide the annual interest rate (APY) by 365 to determine your daily interest rate (r/365), or input your fixed daily return percentage.'
                                    },
                                    {
                                        '@type': 'HowToStep',
                                        name: 'Step 2: Define the number of days (d)',
                                        text: 'Set the total number of compounding days, factoring in whether weekends are included or excluded.'
                                    },
                                    {
                                        '@type': 'HowToStep',
                                        name: 'Step 3: Apply the daily compounding formula',
                                        text: 'Calculate ending balance using: A = P(1 + r/365)^d or A = P(1 + daily_rate)^d.'
                                    },
                                    {
                                        '@type': 'HowToStep',
                                        name: 'Step 4: Analyze daily profit accruals',
                                        text: 'Review the day-by-day schedule to track interest earned each session.'
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
                        <Coins size={13} className="text-emerald-400" />
                        Daily Interest &amp; Geometric Compounding Engine
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                        Compound Interest Calculator for Daily
                    </h1>
                    <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                        Calculate exact <strong className="text-cyan-400">daily compound interest</strong> on savings and staking accounts, simulate <strong className="text-emerald-400">1% daily day-trading compounding</strong> across custom sessions, or project long-term monthly wealth with year-by-year accruals.
                    </p>
                </div>

                {/* Preset Scenarios Strip */}
                <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Zap size={13} className="text-amber-400" /> Quick Compounding Presets:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {PRESET_SCENARIOS.map((preset) => (
                            <button
                                key={preset.id}
                                onClick={() => applyPreset(preset)}
                                className="text-left p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850 transition group cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                        {preset.badge}
                                    </span>
                                    <span className="text-xs font-mono font-bold text-white group-hover:text-emerald-300">
                                        {preset.currency}
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

                {/* Calculator Mode Switcher Tabs */}
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
                    <button
                        onClick={() => setCalcMode('trader')}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                            calcMode === 'trader'
                                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                        }`}
                    >
                        <Flame size={14} />
                        <span>Mode 1: Compound Interest for Daily (Trading &amp; Daily APY)</span>
                    </button>

                    <button
                        onClick={() => setCalcMode('wealth')}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                            calcMode === 'wealth'
                                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                        }`}
                    >
                        <TrendingUp size={14} />
                        <span>Mode 2: Wealth &amp; Monthly Deposits Compounding</span>
                    </button>

                    <button
                        onClick={() => setCalcMode('goal')}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                            calcMode === 'goal'
                                ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                        }`}
                    >
                        <Target size={14} />
                        <span>Mode 3: Goal Solver ("How Much to Invest Monthly?")</span>
                    </button>
                </div>

                {/* ========================================================================= */}
                {/* MODE 1: DAILY COMPOUNDING (DAY TRADER & CASH APY)                         */}
                {/* ========================================================================= */}
                {calcMode === 'trader' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {/* Left Column: Form Controls (7 cols) */}
                            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
                                <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                                            <Flame size={16} className="text-cyan-400" />
                                            Daily Compounding Parameters
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            Calculate daily interest on savings or trading accounts.
                                        </p>
                                    </div>

                                    {/* Daily Calculation Mode Switcher */}
                                    <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-[11px]">
                                        <button
                                            onClick={() => setDailyInputType('dailyRate')}
                                            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                                                dailyInputType === 'dailyRate'
                                                    ? 'bg-cyan-500 text-slate-950'
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            Daily Rate (e.g. 1%)
                                        </button>
                                        <button
                                            onClick={() => setDailyInputType('annualApy')}
                                            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                                                dailyInputType === 'annualApy'
                                                    ? 'bg-cyan-500 text-slate-950'
                                                    : 'text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            Annual APY (e.g. 5.5%)
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Starting Account Balance */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                            Starting Principal Balance ({currency})
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">
                                                {currency}
                                            </span>
                                            <input
                                                type="number"
                                                min="1"
                                                value={traderBalance || ''}
                                                onChange={(e) => setTraderBalance(parseFloat(e.target.value) || 0)}
                                                placeholder="2000"
                                                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>
                                        <span className="text-[10px] text-slate-500 mt-1 block">Starting seed capital</span>
                                    </div>

                                    {/* Rate Input based on Type */}
                                    {dailyInputType === 'dailyRate' ? (
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                                Daily Target Gain (%)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    min="0.01"
                                                    step="0.1"
                                                    value={dailyTargetPercent || ''}
                                                    onChange={(e) => setDailyTargetPercent(parseFloat(e.target.value) || 0)}
                                                    placeholder="1.0"
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-cyan-500 focus:outline-none"
                                                />
                                                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm font-bold">
                                                    % / day
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-slate-500 mt-1 block">Typically 0.5% to 1.5% daily</span>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                                Annual APY Rate (%)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    min="0.1"
                                                    step="0.1"
                                                    value={dailyApyRate || ''}
                                                    onChange={(e) => setDailyApyRate(parseFloat(e.target.value) || 0)}
                                                    placeholder="5.5"
                                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-cyan-500 focus:outline-none"
                                                />
                                                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm font-bold">
                                                    % / year
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-slate-500 mt-1 block">Yields ~{(dailyApyRate / 365).toFixed(4)}% per day</span>
                                        </div>
                                    )}

                                    {/* Number of Days */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                            Total Compounding Days
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="365"
                                            value={tradingDays || ''}
                                            onChange={(e) => setTradingDays(parseInt(e.target.value) || 1)}
                                            placeholder="60"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-cyan-500 focus:outline-none"
                                        />
                                        <span className="text-[10px] text-slate-500 mt-1 block">~20 trading days/mo (or 30 calendar days)</span>
                                    </div>

                                    {/* Reinvestment Rate */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                            Reinvestment Rate (%)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={reinvestPercent || ''}
                                                onChange={(e) => setReinvestPercent(parseFloat(e.target.value) || 0)}
                                                placeholder="100"
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-cyan-500 focus:outline-none"
                                            />
                                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm font-bold">
                                                %
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-slate-500 mt-1 block">100% = Full Compounding</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Output Card (5 cols) */}
                            <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative space-y-6">
                                <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                                    <Flame size={14} /> Daily Compounding Projection
                                </span>

                                <div className="space-y-1">
                                    <span className="text-xs text-slate-400 font-medium">
                                        Projected Final Balance ({tradingDays} Days)
                                    </span>
                                    <div className="text-4xl sm:text-5xl font-black text-cyan-400 font-mono tracking-tight flex items-baseline gap-1">
                                        <span className="text-white text-3xl sm:text-4xl">{currency}</span>
                                        {traderResults.endBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    <span className="text-[11px] text-cyan-300 font-mono block">
                                        Effective rate: ~{traderResults.effectiveDailyRatePercent.toFixed(4)}% interest per day
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                            Net Profit Earned
                                        </span>
                                        <span className="text-sm font-mono font-bold text-emerald-400">
                                            +{currency}{traderResults.totalNetProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>

                                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                            Total Return (ROI)
                                        </span>
                                        <span className="text-sm font-mono font-bold text-cyan-300">
                                            +{traderResults.roiPercent.toFixed(1)}%
                                        </span>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                                    💡 <strong>Daily Compounding Edge:</strong> Reinvesting profits daily accelerates balance doubling compared to monthly or quarterly compounding periods.
                                </div>

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
                                            <span>Copy Daily Schedule Summary</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Day-by-Day Compounding Schedule Table */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Calendar size={18} className="text-cyan-400" />
                                        Day-by-Day Compound Interest Accrual Schedule ({tradingDays} Days)
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        Track the daily mathematical trajectory of your account balance and interest earned each session.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setShowAllDays(!showAllDays)}
                                        className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
                                    >
                                        {showAllDays ? 'Show First 15 Days' : `Show All ${tradingDays} Days`}
                                    </button>
                                    <button
                                        onClick={exportDailyCsv}
                                        className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                                    >
                                        <Download size={13} />
                                        <span>Export CSV</span>
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 max-h-96 overflow-y-auto">
                                <table className="w-full text-xs text-left border-collapse">
                                    <thead className="sticky top-0 bg-slate-900 z-10">
                                        <tr className="border-b border-slate-800 text-slate-300">
                                            <th className="p-3 font-bold">Day</th>
                                            <th className="p-3 font-bold">Starting Balance</th>
                                            <th className="p-3 font-bold text-cyan-400">Daily Gain / Interest</th>
                                            <th className="p-3 font-bold text-emerald-400">Total Profit</th>
                                            <th className="p-3 font-bold text-white">Ending Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/80 font-mono text-slate-300">
                                        {(showAllDays ? traderResults.dayRows : traderResults.dayRows.slice(0, 15)).map((row) => (
                                            <tr key={row.day} className="hover:bg-slate-900/50 transition">
                                                <td className="p-3 font-bold text-white">Day {row.day}</td>
                                                <td className="p-3 text-slate-400">{currency}{row.startBalance.toFixed(2)}</td>
                                                <td className="p-3 text-cyan-400 font-bold">+{currency}{row.dailyGain.toFixed(2)}</td>
                                                <td className="p-3 text-emerald-400 font-bold">+{currency}{row.totalProfit.toFixed(2)}</td>
                                                <td className="p-3 font-bold text-white">{currency}{row.endBalance.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {!showAllDays && traderResults.dayRows.length > 15 && (
                                <div className="text-center pt-2">
                                    <button
                                        onClick={() => setShowAllDays(true)}
                                        className="text-xs text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
                                    >
                                        Showing 15 of {tradingDays} days. Click to expand all {tradingDays} days ↓
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* MODE 2: WEALTH & MONTHLY DEPOSITS COMPOUNDING                              */}
                {/* ========================================================================= */}
                {calcMode === 'wealth' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left Column: Form Controls (7 cols) */}
                        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
                            <div className="border-b border-slate-800 pb-3">
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <Coins size={16} className="text-emerald-400" />
                                    Investment Capital &amp; Contribution Inputs
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Set your initial principal, recurring monthly savings, and time horizon.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Starting Principal */}
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                        Initial Principal ({currency})
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">
                                            {currency}
                                        </span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={principal || ''}
                                            onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
                                            placeholder="10000"
                                            className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-emerald-500 focus:outline-none"
                                        />
                                    </div>
                                    <span className="text-[10px] text-slate-500 mt-1 block">Starting seed investment</span>
                                </div>

                                {/* Monthly Contribution */}
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                        Monthly Contribution ({currency})
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">
                                            {currency}
                                        </span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={monthlyContribution || ''}
                                            onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)}
                                            placeholder="500"
                                            className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-emerald-500 focus:outline-none"
                                        />
                                    </div>
                                    <span className="text-[10px] text-slate-500 mt-1 block">Deposited every month</span>
                                </div>

                                {/* Estimated Annual Interest Rate */}
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                        Annual Interest Rate (%)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={annualRate || ''}
                                            onChange={(e) => setAnnualRate(parseFloat(e.target.value) || 0)}
                                            placeholder="10"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-emerald-500 focus:outline-none"
                                        />
                                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm font-bold">
                                            %
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 mt-1 block">Historic S&amp;P 500 average is ~10%</span>
                                </div>

                                {/* Investment Period (Years) */}
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                        Time Horizon (Years)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="60"
                                        value={investmentYears || ''}
                                        onChange={(e) => setInvestmentYears(parseInt(e.target.value) || 1)}
                                        placeholder="20"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-emerald-500 focus:outline-none"
                                    />
                                    <span className="text-[10px] text-slate-500 mt-1 block">Length of compounding period</span>
                                </div>
                            </div>

                            {/* Compounding Frequency Selector */}
                            <div className="pt-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                                    Compounding Frequency
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {[
                                        { label: 'Annually (1x)', freq: 1 },
                                        { label: 'Quarterly (4x)', freq: 4 },
                                        { label: 'Monthly (12x)', freq: 12 },
                                        { label: 'Daily (365x)', freq: 365 }
                                    ].map((opt) => (
                                        <button
                                            key={opt.freq}
                                            onClick={() => setCompoundFrequency(opt.freq)}
                                            className={`p-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                                                compoundFrequency === opt.freq
                                                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Master Output Dashboard (5 cols) */}
                        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-6">
                            <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="flex items-center justify-between">
                                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                                    <CheckCircle2 size={14} /> Total Future Value
                                </span>
                                <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                                    {investmentYears} Years
                                </span>
                            </div>

                            {/* Main Giant Total */}
                            <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-medium">
                                    Estimated Investment Portfolio Value
                                </span>
                                <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight flex items-baseline gap-1">
                                    <span className="text-emerald-400 text-3xl sm:text-4xl">{currency}</span>
                                    {wealthResults.futureValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <span className="text-[11px] text-emerald-400 font-bold block">
                                    ✨ Your money multiplied by {wealthResults.wealthMultiplier.toFixed(2)}x
                                </span>
                            </div>

                            {/* Visual Breakdown Bar */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-semibold">
                                    <span className="text-slate-400 flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block" />
                                        Principal: {wealthResults.principalSharePercent.toFixed(1)}%
                                    </span>
                                    <span className="text-emerald-400 flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                                        Interest: {wealthResults.interestSharePercent.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                                    <div
                                        className="h-full bg-slate-600 transition-all duration-500"
                                        style={{ width: `${wealthResults.principalSharePercent}%` }}
                                    />
                                    <div
                                        className="h-full bg-emerald-500 transition-all duration-500"
                                        style={{ width: `${wealthResults.interestSharePercent}%` }}
                                    />
                                </div>
                            </div>

                            {/* Stat Boxes */}
                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                        Total Deposited
                                    </span>
                                    <span className="text-sm font-mono font-bold text-white">
                                        {currency}{wealthResults.totalDeposited.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>

                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                                        Total Interest Earned
                                    </span>
                                    <span className="text-sm font-mono font-bold text-emerald-300">
                                        {currency}{wealthResults.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            {/* Doubling Rule of 72 Box */}
                            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                                <span className="text-slate-400 flex items-center gap-1.5">
                                    <Clock size={14} className="text-amber-400" /> Rule of 72 Doubling Time:
                                </span>
                                <span className="font-mono font-bold text-amber-300">
                                    Every ~{wealthResults.doublingYears} Years
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="space-y-2 pt-1">
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
                                            <span>Copy Compounding Forecast</span>
                                        </>
                                    )}
                                </button>

                                {onSignIn && (
                                    <button
                                        onClick={onSignIn}
                                        className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <Sparkles size={14} />
                                        <span>Track Growth in Free Trade Journal</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* MODE 3: GOAL TARGET REVERSE SOLVER                                        */}
                {/* ========================================================================= */}
                {calcMode === 'goal' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
                            <div className="border-b border-slate-800 pb-3">
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <Target size={16} className="text-purple-400" />
                                    How Much Must I Save Monthly to Hit My Goal?
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Work backwards from your retirement or financial freedom target.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                        Target Goal Amount ({currency})
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">
                                            {currency}
                                        </span>
                                        <input
                                            type="number"
                                            min="1000"
                                            value={targetGoalAmount || ''}
                                            onChange={(e) => setTargetGoalAmount(parseFloat(e.target.value) || 0)}
                                            placeholder="1000000"
                                            className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-purple-500 focus:outline-none"
                                        />
                                    </div>
                                    <span className="text-[10px] text-slate-500 mt-1 block">e.g. $1 Million or ₹1 Crore</span>
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                        Starting Capital Now ({currency})
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">
                                            {currency}
                                        </span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={goalStartingCapital || ''}
                                            onChange={(e) => setGoalStartingCapital(parseFloat(e.target.value) || 0)}
                                            placeholder="15000"
                                            className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-purple-500 focus:outline-none"
                                        />
                                    </div>
                                    <span className="text-[10px] text-slate-500 mt-1 block">Current seed savings</span>
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                        Years to Reach Milestone
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={goalYears || ''}
                                        onChange={(e) => setGoalYears(parseInt(e.target.value) || 1)}
                                        placeholder="15"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-purple-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                        Expected Annual Return (%)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="1"
                                            step="0.5"
                                            value={goalRate || ''}
                                            onChange={(e) => setGoalRate(parseFloat(e.target.value) || 0)}
                                            placeholder="10"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-purple-500 focus:outline-none"
                                        />
                                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm font-bold">
                                            %
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-purple-500/30 rounded-2xl p-6 shadow-2xl relative space-y-6">
                            <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
                                <Target size={14} /> Required Monthly Savings
                            </span>

                            {goalResults.isAlreadyReached ? (
                                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                                    🎉 Your starting capital of {currency}{goalStartingCapital.toLocaleString()} alone will grow to {currency}{goalResults.fvOfPrincipal.toLocaleString(undefined, { maximumFractionDigits: 0 })} at {goalRate}% in {goalYears} years. No extra monthly contributions are required!
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <span className="text-xs text-slate-400 font-medium">
                                            Monthly Deposit Needed
                                        </span>
                                        <div className="text-4xl sm:text-5xl font-black text-purple-400 font-mono tracking-tight flex items-baseline gap-1">
                                            <span className="text-white text-3xl sm:text-4xl">{currency}</span>
                                            {goalResults.monthlyDepositNeeded.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            <span className="text-base text-slate-400 font-normal ml-1">/mo</span>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                                        <div className="flex justify-between text-slate-400">
                                            <span>Goal Target:</span>
                                            <span className="text-white font-bold">{currency}{targetGoalAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-400">
                                            <span>Starting Seed Capital Growth:</span>
                                            <span className="text-white font-bold">{currency}{goalResults.fvOfPrincipal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                        </div>
                                        <div className="flex justify-between text-purple-300 font-bold pt-1.5 border-t border-slate-800">
                                            <span>Remaining to Fund:</span>
                                            <span>{currency}{goalResults.remainingGoal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

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
                                        <span>Copy Goal Solution</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* YEAR-BY-YEAR ACCRUAL BREAKDOWN TABLE (FOR WEALTH MODE)                    */}
                {/* ========================================================================= */}
                {calcMode === 'wealth' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Table size={18} className="text-emerald-400" />
                                    Year-by-Year Compound Interest Accrual Schedule
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Watch how the annual interest earned begins to outstrip your manual contributions.
                                </p>
                            </div>
                            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                {wealthResults.yearData.length} Years Projected
                            </span>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                            <table className="w-full text-xs text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-300">
                                        <th className="p-3.5 font-bold">Year</th>
                                        <th className="p-3.5 font-bold">Total Deposited</th>
                                        <th className="p-3.5 font-bold text-emerald-400">Interest Earned (Year)</th>
                                        <th className="p-3.5 font-bold">Total Cumulative Interest</th>
                                        <th className="p-3.5 font-bold text-white">Ending Balance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/80 font-mono text-slate-300">
                                    {wealthResults.yearData.map((row) => (
                                        <tr key={row.year} className="hover:bg-slate-900/50 transition">
                                            <td className="p-3.5 font-bold text-white">{row.year}</td>
                                            <td className="p-3.5 text-slate-400">{currency}{row.depositTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                            <td className="p-3.5 text-emerald-400 font-bold">+{currency}{row.interestEarnedYear.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                            <td className="p-3.5 text-slate-300">{currency}{row.totalInterestAccrued.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                            <td className="p-3.5 font-bold text-white">{currency}{row.endBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* IN-DEPTH SEO MASTER ARTICLE & COMPLETE GUIDE (PERMANENTLY VISIBLE)        */}
                {/* ========================================================================= */}
                <article className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-10 text-slate-300 text-sm leading-relaxed shadow-2xl">
                    <header className="border-b border-slate-800 pb-6 space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                            <BookOpen size={13} /> The Definitive Daily Compounding Guide 2026
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                            Compound Interest Calculator for Daily: Formulas, APY vs. Daily Rates &amp; Reality Math
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-4xl">
                            Whether you are looking for a <strong className="text-slate-200">compound interest calculator for daily</strong> compounding on High-Yield Savings Accounts, crypto staking rewards, or day-trading accounts, understanding the exact mathematics of 365 daily compounding cycles is essential to maximizing exponential gains.
                        </p>
                    </header>

                    {/* Section 1: The Exact Daily Compounding Formulas */}
                    <section className="space-y-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                            <Calculator className="text-cyan-400" size={20} />
                            <span>1. The Exact Daily Compound Interest Formulas Explained</span>
                        </h3>
                        <p>
                            Depending on whether your interest is derived from an <strong>Annual APY</strong> (cash savings, bonds, staking) or a <strong>Fixed Daily Return</strong> (day trading, scalping), two distinct mathematical formulas apply:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                    CASE A: ANNUAL APY COMPOUNDED DAILY (SAVINGS / BONDS)
                                </span>
                                <div className="p-3 rounded-xl bg-slate-900 font-mono text-xs text-emerald-300 text-center border border-slate-800">
                                    A = P × (1 + r / 365)^(365 × t)
                                </div>
                                <p className="text-[11px] text-slate-400">
                                    Divides the annual rate <strong>r</strong> by 365 days. If a bank pays 5.5% APY on $10,000, your daily interest rate is approximately 0.01506% per day ($1.51/day).
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                                    CASE B: FIXED DAILY RETURN COMPOUNDING (TRADING / ROI)
                                </span>
                                <div className="p-3 rounded-xl bg-slate-900 font-mono text-xs text-cyan-300 text-center border border-slate-800">
                                    A = P × (1 + i)^d
                                </div>
                                <p className="text-[11px] text-slate-400">
                                    Where <strong>i</strong> is the direct percentage gain per session (e.g. 1% = 0.01) and <strong>d</strong> is the total number of active trading days.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: What Happens to $1,000 at 1% Daily Compound Interest */}
                    <section className="space-y-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                            <Flame className="text-rose-400" size={20} />
                            <span>2. The 1% Daily Compounding Progression: $1,000 to $37,783</span>
                        </h3>
                        <p>
                            The viral <em>"1% a Day Compounding Challenge"</em> demonstrates the mind-boggling mathematics of geometric acceleration:
                        </p>

                        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-1 mt-4">
                            <table className="w-full text-xs text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 text-slate-300 bg-slate-900/60">
                                        <th className="p-3.5 font-bold">Timeline</th>
                                        <th className="p-3.5 font-bold">Account Balance (Starting: $1,000)</th>
                                        <th className="p-3.5 font-bold text-cyan-400">Daily Gain ($) on That Day</th>
                                        <th className="p-3.5 font-bold text-emerald-400">Net Profit ($)</th>
                                        <th className="p-3.5 font-bold">Total ROI %</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 text-slate-400 font-mono">
                                    <tr className="hover:bg-slate-900/40">
                                        <td className="p-3.5 font-bold text-white">Day 1</td>
                                        <td className="p-3.5 text-slate-300">$1,010.00</td>
                                        <td className="p-3.5 text-cyan-400">$10.00 / day</td>
                                        <td className="p-3.5 text-emerald-400">+$10.00</td>
                                        <td className="p-3.5 text-slate-300">+1.0%</td>
                                    </tr>
                                    <tr className="hover:bg-slate-900/40">
                                        <td className="p-3.5 font-bold text-white">Day 30 (1 Month)</td>
                                        <td className="p-3.5 text-slate-300">$1,347.85</td>
                                        <td className="p-3.5 text-cyan-400">$13.48 / day</td>
                                        <td className="p-3.5 text-emerald-400">+$347.85</td>
                                        <td className="p-3.5 text-slate-300">+34.8%</td>
                                    </tr>
                                    <tr className="hover:bg-slate-900/40">
                                        <td className="p-3.5 font-bold text-white">Day 60 (2 Months)</td>
                                        <td className="p-3.5 text-slate-300">$1,816.70</td>
                                        <td className="p-3.5 text-cyan-400">$18.17 / day</td>
                                        <td className="p-3.5 text-emerald-400">+$816.70</td>
                                        <td className="p-3.5 text-slate-300">+81.7%</td>
                                    </tr>
                                    <tr className="hover:bg-slate-900/40">
                                        <td className="p-3.5 font-bold text-white">Day 100</td>
                                        <td className="p-3.5 text-slate-300">$2,704.81</td>
                                        <td className="p-3.5 text-cyan-400">$27.05 / day</td>
                                        <td className="p-3.5 text-emerald-400">+$1,704.81</td>
                                        <td className="p-3.5 text-slate-300">+170.5%</td>
                                    </tr>
                                    <tr className="hover:bg-slate-900/40 bg-emerald-500/5">
                                        <td className="p-3.5 font-bold text-emerald-400">Day 365 (1 Year)</td>
                                        <td className="p-3.5 text-emerald-400 font-bold">$37,783.43</td>
                                        <td className="p-3.5 text-cyan-400 font-bold">$374.09 / day</td>
                                        <td className="p-3.5 text-emerald-400 font-bold">+$36,783.43</td>
                                        <td className="p-3.5 text-emerald-300 font-bold">+3,678.3%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Section 3: Simple vs Compound Interest */}
                    <section className="space-y-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                            <Scale className="text-emerald-400" size={20} />
                            <span>3. Simple Interest vs. Compound Interest: The $500,000 Difference</span>
                        </h3>
                        <p>
                            To truly grasp why wealth accelerates exponentially after year 10, consider a comparison between simple linear interest and true compounding on a $10,000 investment growing at 10% annual return over 30 years:
                        </p>

                        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-1 mt-4">
                            <table className="w-full text-xs text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 text-slate-300 bg-slate-900/60">
                                        <th className="p-3.5 font-bold">Model</th>
                                        <th className="p-3.5 font-bold">Annual Return Mechanics</th>
                                        <th className="p-3.5 font-bold">10-Year Value</th>
                                        <th className="p-3.5 font-bold">20-Year Value</th>
                                        <th className="p-3.5 font-bold">30-Year Final Value</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 text-slate-400">
                                    <tr className="hover:bg-slate-900/40">
                                        <td className="p-3.5 font-bold text-rose-400">Simple Interest (10%)</td>
                                        <td className="p-3.5 text-slate-400">Pays flat $1,000/year on initial $10,000 only</td>
                                        <td className="p-3.5 font-mono text-slate-300">$20,000</td>
                                        <td className="p-3.5 font-mono text-slate-300">$30,000</td>
                                        <td className="p-3.5 font-mono text-rose-300 font-bold">$40,000</td>
                                    </tr>
                                    <tr className="hover:bg-slate-900/40 bg-emerald-500/5">
                                        <td className="p-3.5 font-bold text-emerald-400">Compound Interest (10%)</td>
                                        <td className="p-3.5 text-emerald-300">Reinvests all interest back into principal</td>
                                        <td className="p-3.5 font-mono text-emerald-400">$25,937</td>
                                        <td className="p-3.5 font-mono text-emerald-400">$67,275</td>
                                        <td className="p-3.5 font-mono text-emerald-400 font-bold">$174,494 (+336% more!)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Section 4: The Rule of 72 */}
                    <section className="space-y-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                            <Clock className="text-amber-400" size={20} />
                            <span>4. The Rule of 72: How to Estimate Doubling Time Instantly</span>
                        </h3>
                        <p>
                            The Rule of 72 is an algebraic approximation that answers the question: <em>"At what rate will my money double?"</em>
                        </p>
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300 text-center">
                            Years to Double ≈ 72 ÷ Annual Expected Return Percentage
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                                <span className="text-slate-400 block">6% Return</span>
                                <strong className="text-white text-sm">12 Years</strong>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                                <span className="text-slate-400 block">9% Return</span>
                                <strong className="text-white text-sm">8 Years</strong>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                                <span className="text-slate-400 block">12% Return</span>
                                <strong className="text-white text-sm">6 Years</strong>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                                <span className="text-slate-400 block">18% Return</span>
                                <strong className="text-white text-sm">4 Years</strong>
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
                            <span>Frequently Asked Questions About Daily Compounding Interest</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400">
                            Clear, authoritative answers structured for Google AI Overviews and retail investors.
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
                    currentToolSlug="/tools/compound-interest-calculator-for-daily"
                    category="risk"
                />

            </div>
        </div>
    );
};
