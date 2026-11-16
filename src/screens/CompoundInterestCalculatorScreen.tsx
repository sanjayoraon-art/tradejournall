import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Calculator, DollarSign, ArrowRight, ShieldCheck, ShieldAlert,
    CheckCircle2, AlertTriangle, HelpCircle, ChevronDown, Copy, Check,
    Sparkles, RefreshCw, FileText, Share2, Info, ArrowLeft, ArrowUpRight,
    TrendingDown, TrendingUp, BookOpen, Scale, Clock, Eye, Plus, Trash2,
    PieChart, Landmark, Percent, Zap, Award, ExternalLink, Target,
    SlidersHorizontal, Layers, CheckCircle, Table, BarChart3, AlertOctagon,
    Calendar, Flame
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
        q: 'What is a compounding interest calculator and how does it work?',
        a: 'A compounding interest calculator computes the future value of an investment where interest earned in each period is added back to the principal, earning additional interest in subsequent periods. This creates an exponential growth curve over time, dramatically outpacing simple linear interest.'
    },
    {
        q: 'What is the exact compound interest formula?',
        a: 'The classic compound interest formula with regular periodic contributions is: A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)], where A is future value, P is starting principal, r is annual interest rate (decimal), n is compounding frequency per year, t is time in years, and PMT is the recurring periodic deposit.'
    },
    {
        q: 'What is the Rule of 72 and how does it relate to compounding?',
        a: 'The Rule of 72 is a quick mathematical shortcut to estimate how many years it takes for an investment to double: Doubling Years ≈ 72 ÷ Annual Interest Rate. For example, at an 8% annual return, your money doubles in approximately 72 ÷ 8 = 9 years; at 12%, it doubles in just 6 years.'
    },
    {
        q: 'What is the difference between Simple Interest and Compound Interest?',
        a: 'Simple interest only pays returns on the initial principal deposit forever. Compound interest pays returns on BOTH the initial principal AND all previously accumulated interest. Over 25 years, compound interest can generate 300% to 800% more total wealth than simple interest on the exact same capital.'
    },
    {
        q: 'How does compounding frequency (Daily vs Monthly vs Annually) affect returns?',
        a: 'The more frequently interest is compounded, the higher your total effective annual yield (APY). Compounding daily produces slightly higher returns than compounding monthly, which in turn beats compounding annually. However, the biggest factor in compound wealth is always time (number of years) and consistent contributions, not tiny differences in frequency.'
    },
    {
        q: 'Is 1% daily compounding realistic for day traders?',
        a: 'Mathematically, 1% daily compounding on $1,000 turns into $37,783 in 365 days. However, in reality, markets have losing streaks, liquidity limits, slippage, and psychological friction. Experienced day traders use compounding calculations to model account scaling, but always withdraw profits regularly rather than risking entire bloated account balances.'
    },
    {
        q: 'How does inflation affect compound interest returns?',
        a: 'Inflation erodes purchasing power over time. To calculate your real purchasing power, use the Fisher equation: Real Return ≈ Nominal Return - Inflation Rate. For example, if your investments compound at 10% and inflation averages 3.5%, your real wealth is growing at an effective rate of 6.5% per year.'
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
    // Mode Switcher: 'wealth' | 'trader' | 'goal'
    const [calcMode, setCalcMode] = useState<'wealth' | 'trader' | 'goal'>('wealth');

    // Currency selection
    const [currency, setCurrency] = useState<string>(primaryCurrencySymbol || '$');

    // Mode 1: Wealth & Contributions State
    const [principal, setPrincipal] = useState<number>(10000);
    const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
    const [annualRate, setAnnualRate] = useState<number>(10);
    const [investmentYears, setInvestmentYears] = useState<number>(20);
    const [compoundFrequency, setCompoundFrequency] = useState<number>(12); // 12 = monthly, 1 = annually, 4 = quarterly, 365 = daily

    // Mode 2: Day Trader Daily Compounding State
    const [traderBalance, setTraderBalance] = useState<number>(2000);
    const [dailyTargetPercent, setDailyTargetPercent] = useState<number>(1.0);
    const [tradingDays, setTradingDays] = useState<number>(60);
    const [reinvestPercent, setReinvestPercent] = useState<number>(100);

    // Mode 3: Goal Solver State
    const [targetGoalAmount, setTargetGoalAmount] = useState<number>(1000000);
    const [goalStartingCapital, setGoalStartingCapital] = useState<number>(15000);
    const [goalYears, setGoalYears] = useState<number>(15);
    const [goalRate, setGoalRate] = useState<number>(10);

    // UI State
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
    const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
    const [breakdownView, setBreakdownView] = useState<'annual' | 'summary'>('annual');

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
            
            // Monthly compounding steps inside the year
            for (let m = 1; m <= 12; m++) {
                // Add monthly deposit
                runningBalance += PMT;
                yearDeposits += PMT;
                totalDeposited += PMT;
                // Compound based on frequency proportion
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
        
        // Rule of 72 doubling estimate
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
    // 2. DAY TRADER DAILY COMPOUNDING CALCULATIONS
    // ==========================================
    const traderResults = useMemo(() => {
        const start = Math.max(1, Number(traderBalance) || 0);
        const rate = (Number(dailyTargetPercent) || 0) / 100;
        const days = Math.max(1, Math.min(250, Number(tradingDays) || 1));
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
            dayRows
        };
    }, [traderBalance, dailyTargetPercent, tradingDays, reinvestPercent]);

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

        // Future value of starting capital alone:
        const fvOfPrincipal = P * Math.pow(1 + monthlyRate, months);
        const remainingGoal = target - fvOfPrincipal;

        let monthlyDepositNeeded = 0;
        if (remainingGoal > 0 && monthlyRate > 0) {
            // Formula for PMT: FV = PMT * [((1 + r)^n - 1) / r]
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
            setDailyTargetPercent(preset.rate);
            setTradingDays(preset.years);
        }
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
            text = `📈 Day Trader Daily Compounding Simulation:
• Starting Balance: ${currency}${traderBalance.toLocaleString()}
• Daily Target: ${dailyTargetPercent}% across ${tradingDays} Days
• Final Trading Balance: ${currency}${traderResults.endBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
• Total Profit: ${currency}${traderResults.totalNetProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${traderResults.roiPercent.toFixed(1)}% ROI)
Calculated via TradeJournall: https://tradejournall.com/tools/compound-interest-calculator`;
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
                <title>Compound Interest Calculator – Compounding Interest Calculator (2026)</title>
                <meta
                    name="description"
                    content="Free compound interest calculator & compounding interest calculator. Calculate future value with monthly deposits, daily trading compounding, Rule of 72 doubling dates, and year-by-year growth charts."
                />
                <meta
                    name="keywords"
                    content="compounding interest calculator, compound interest calculator, daily compound interest calculator, compound interest calculator with monthly contributions, compound interest formula, compound interest calculator daily, compound growth calculator"
                />
                <link rel="canonical" href="https://tradejournall.com/tools/compound-interest-calculator" />

                {/* Open Graph / Social */}
                <meta property="og:title" content="Compound Interest Calculator – Free Compounding Interest Calculator" />
                <meta property="og:description" content="Simulate exponential compound wealth growth with regular deposits, daily trader compounding, and doubling schedules." />
                <meta property="og:url" content="https://tradejournall.com/tools/compound-interest-calculator" />
                <meta property="og:type" content="website" />

                {/* Structured Data Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@graph': [
                            {
                                '@type': 'SoftwareApplication',
                                name: 'Compound Interest Calculator & Wealth Growth Simulator',
                                operatingSystem: 'All',
                                applicationCategory: 'FinanceApplication',
                                offers: {
                                    '@type': 'Offer',
                                    price: '0.00',
                                    priceCurrency: 'USD'
                                },
                                description: 'Free online compound interest calculator. Calculate compound growth, monthly deposits, daily trading compounding, and Rule of 72 timelines.'
                            },
                            {
                                '@type': 'HowTo',
                                name: 'How to Calculate Compound Interest',
                                description: 'Step-by-step formula and mathematical method to calculate compound interest on investments with periodic contributions.',
                                step: [
                                    {
                                        '@type': 'HowToStep',
                                        name: 'Step 1: Identify your starting principal and interest rate',
                                        text: 'Determine your initial deposit amount (P) and your anticipated annual interest rate (r) expressed as a decimal.'
                                    },
                                    {
                                        '@type': 'HowToStep',
                                        name: 'Step 2: Define your compounding frequency',
                                        text: 'Decide how often interest compounds per year (n), such as annually (1), quarterly (4), monthly (12), or daily (365).'
                                    },
                                    {
                                        '@type': 'HowToStep',
                                        name: 'Step 3: Add regular recurring contributions',
                                        text: 'Factor in regular monthly or yearly deposits (PMT) that continuously expand your interest-earning base.'
                                    },
                                    {
                                        '@type': 'HowToStep',
                                        name: 'Step 4: Compute Future Value using the compounding formula',
                                        text: 'Apply the formula: A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)] to obtain your total future balance.'
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
                        Einstein's 8th Wonder of the World
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                        Compound Interest Calculator
                    </h1>
                    <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                        Simulate exponential compound interest growth with <strong className="text-slate-200">monthly contributions</strong>, explore <strong className="text-cyan-400">day trader 1% daily compounding</strong>, or solve your exact monthly savings needed to hit financial independence (FIRE).
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
                        onClick={() => setCalcMode('wealth')}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                            calcMode === 'wealth'
                                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                        }`}
                    >
                        <TrendingUp size={14} />
                        <span>Mode 1: Wealth &amp; Monthly Deposits Compounding</span>
                    </button>

                    <button
                        onClick={() => setCalcMode('trader')}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                            calcMode === 'trader'
                                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                        }`}
                    >
                        <Flame size={14} />
                        <span>Mode 2: Day Trader Daily Compounding (1% a Day)</span>
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
                {/* MODE 1: WEALTH & MONTHLY DEPOSITS COMPOUNDING                              */}
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
                {/* MODE 2: DAY TRADER DAILY COMPOUNDING (1% A DAY SIMULATOR)                 */}
                {/* ========================================================================= */}
                {calcMode === 'trader' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left Column: Form Controls (7 cols) */}
                        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
                            <div className="border-b border-slate-800 pb-3">
                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                    <Flame size={16} className="text-cyan-400" />
                                    Day Trading Daily Compounding Parameters
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Simulate daily account scaling with strict risk management.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                        Starting Account Balance ({currency})
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">
                                            {currency}
                                        </span>
                                        <input
                                            type="number"
                                            min="100"
                                            value={traderBalance || ''}
                                            onChange={(e) => setTraderBalance(parseFloat(e.target.value) || 0)}
                                            placeholder="2000"
                                            className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-cyan-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                        Daily Target Profit Rate (%)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0.1"
                                            step="0.1"
                                            value={dailyTargetPercent || ''}
                                            onChange={(e) => setDailyTargetPercent(parseFloat(e.target.value) || 0)}
                                            placeholder="1.0"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-cyan-500 focus:outline-none"
                                        />
                                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm font-bold">
                                            %
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 mt-1 block">Typically 0.5% to 1.5% daily</span>
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                        Number of Trading Days
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="250"
                                        value={tradingDays || ''}
                                        onChange={(e) => setTradingDays(parseInt(e.target.value) || 1)}
                                        placeholder="60"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-cyan-500 focus:outline-none"
                                    />
                                    <span className="text-[10px] text-slate-500 mt-1 block">~20 trading days in a calendar month</span>
                                </div>

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

                        {/* Right Column: Day Trader Output (5 cols) */}
                        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative space-y-6">
                            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                                <Flame size={14} /> Trading Account Projection
                            </span>

                            <div className="space-y-1">
                                <span className="text-xs text-slate-400 font-medium">
                                    Projected Final Balance ({tradingDays} Trading Days)
                                </span>
                                <div className="text-4xl sm:text-5xl font-black text-cyan-400 font-mono tracking-tight flex items-baseline gap-1">
                                    <span className="text-white text-3xl sm:text-4xl">{currency}</span>
                                    {traderResults.endBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                        Total Net Profit
                                    </span>
                                    <span className="text-sm font-mono font-bold text-emerald-400">
                                        +{currency}{traderResults.totalNetProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                        Total ROI
                                    </span>
                                    <span className="text-sm font-mono font-bold text-cyan-300">
                                        +{traderResults.roiPercent.toFixed(1)}%
                                    </span>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                                ⚠️ <strong>Trader Reality Note:</strong> Market conditions fluctuate. Ensure you risk only 0.5% to 1.0% per trade and log every emotional leak in your trade journal.
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
                                        <span>Copy Trader Forecast</span>
                                    </>
                                )}
                            </button>
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
                {/* YEAR-BY-YEAR ACCRUAL BREAKDOWN TABLE                                      */}
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
                            <BookOpen size={13} /> The Definitive Compounding Guide 2026
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                            The Power of Compounding Interest: Mathematics, Exponential Growth &amp; The Rule of 72
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-4xl">
                            Albert Einstein famously called compound interest the <em>"eighth wonder of the world. He who understands it, earns it; he who doesn't, pays it."</em> Explore the exact mathematical equations, differences between simple and compound growth, and strategic application for stocks, ETFs, and day trading.
                        </p>
                    </header>

                    {/* Section 1: Simple vs Compound Interest */}
                    <section className="space-y-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                            <Scale className="text-emerald-400" size={20} />
                            <span>1. Simple Interest vs. Compound Interest: The $500,000 Difference</span>
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

                    {/* Section 2: Mathematical Formula Breakdown */}
                    <section className="space-y-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                            <Calculator className="text-cyan-400" size={20} />
                            <span>2. The Complete Mathematical Compound Interest Equations</span>
                        </h3>
                        <p>
                            Financial institutions and quantitative analysts use two primary equations depending on whether additional recurring deposits are contributed:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                    EQUATION 1: LUMPSUM COMPOUNDING
                                </span>
                                <div className="p-3 rounded-xl bg-slate-900 font-mono text-xs text-emerald-300 text-center border border-slate-800">
                                    A = P × (1 + r/n)^(nt)
                                </div>
                                <p className="text-[11px] text-slate-400">
                                    Where <strong>P</strong> is starting balance, <strong>r</strong> is nominal rate, <strong>n</strong> is compounding frequency, and <strong>t</strong> is time in years.
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                                    EQUATION 2: WITH PERIODIC DEPOSITS (ANNUITY DUE)
                                </span>
                                <div className="p-3 rounded-xl bg-slate-900 font-mono text-xs text-cyan-300 text-center border border-slate-800">
                                    FV = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]
                                </div>
                                <p className="text-[11px] text-slate-400">
                                    Factors in continuous monthly deposits (<strong>PMT</strong>) which create snowballing compounding momentum.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: The Rule of 72 */}
                    <section className="space-y-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                            <Clock className="text-amber-400" size={20} />
                            <span>3. The Rule of 72: How to Estimate Doubling Time Instantly</span>
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

                    {/* Section 4: Day Trader Compounding Reality vs Fantasy */}
                    <section className="space-y-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                            <Flame className="text-rose-400" size={20} />
                            <span>4. The "1% a Day" Day Trader Compounding Challenge: Reality Check</span>
                        </h3>
                        <p>
                            On YouTube and TikTok, trading "gurus" frequently claim: <em>"Start with $1,000, make 1% daily, and become a multi-millionaire in 2 years!"</em> While the mathematics of $(1.01)^{500} = 144.77$ ($144,000) is undeniable on a spreadsheet, real trading involves drawdown streaks, liquidity bottlenecks, and psychological tilt.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                                <span className="font-bold text-emerald-400 block">Where Trader Compounding Works</span>
                                <ul className="space-y-1 text-slate-300 list-disc pl-4">
                                    <li>Scaling lot sizes proportionally as your equity increases in prop firm challenges.</li>
                                    <li>Enforcing strict fixed-fractional risk budgets (risking exactly 1% of equity per trade).</li>
                                    <li>Maintaining trading journals to eliminate emotional revenge cycles.</li>
                                </ul>
                            </div>

                            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
                                <span className="font-bold text-rose-400 block">Where Trader Compounding Breaks Down</span>
                                <ul className="space-y-1 text-slate-300 list-disc pl-4">
                                    <li>A 3-trade losing streak wipes out 5 days of compounding progress.</li>
                                    <li>Market slippage increases rapidly when scaling position sizes above $100k.</li>
                                    <li>Brokers enforce leverage restrictions on large account balances.</li>
                                </ul>
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
                            <span>Frequently Asked Questions About Compounding Interest</span>
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
                    currentToolSlug="/tools/compound-interest-calculator"
                    category="risk"
                />

            </div>
        </div>
    );
};
