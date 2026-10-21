import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Calculator, DollarSign, ArrowRight, ShieldCheck, ShieldAlert,
    CheckCircle2, AlertTriangle, HelpCircle, ChevronDown, Copy, Check,
    Sparkles, RefreshCw, FileText, Share2, Info, ArrowLeft, ArrowUpRight,
    TrendingDown, TrendingUp, BookOpen, Scale, Clock, Eye, Plus, Trash2,
    PieChart, Landmark, Percent, Zap, Award, ExternalLink, Car, Navigation,
    Fuel, Smartphone, ShoppingBag, Receipt, Calendar, Download, SlidersHorizontal
} from 'lucide-react';
import { RelatedToolsGrid } from '../components/RelatedToolsGrid';

export interface DoorDashTaxCalculatorScreenProps {
    theme?: any;
    isDarkMode?: boolean;
    primaryCurrencySymbol?: string;
    onBackToLanding?: () => void;
    onSignIn?: () => void;
}

interface PresetScenario {
    id: string;
    title: string;
    badge: string;
    description: string;
    grossEarnings: number;
    businessMiles: number;
    phoneExpense: number;
    suppliesExpense: number;
    tollsParking: number;
    otherExpenses: number;
    state: string;
    filingStatus: 'single' | 'married_joint' | 'head_of_household';
    otherW2Income: number;
}

const PRESET_SCENARIOS: PresetScenario[] = [
    {
        id: 'weekend-dasher',
        title: 'Part-Time / Weekend Dasher',
        badge: 'Side Hustle',
        description: 'Driving 8-10 hours on weekends to earn extra cash alongside a full-time W-2 day job.',
        grossEarnings: 8500,
        businessMiles: 4200,
        phoneExpense: 360,
        suppliesExpense: 120,
        tollsParking: 85,
        otherExpenses: 50,
        state: 'Texas',
        filingStatus: 'single',
        otherW2Income: 55000
    },
    {
        id: 'fulltime-gig-pro',
        title: 'Full-Time Multi-App Driver',
        badge: 'High Mileage',
        description: 'Driving 35-40+ hours per week multi-apping DoorDash, UberEats, and Instacart full-time.',
        grossEarnings: 48000,
        businessMiles: 26500,
        phoneExpense: 720,
        suppliesExpense: 350,
        tollsParking: 320,
        otherExpenses: 250,
        state: 'California',
        filingStatus: 'single',
        otherW2Income: 0
    },
    {
        id: 'suburban-dasher',
        title: 'Suburban Evening Dasher',
        badge: 'Balanced',
        description: 'Evenings dinner rush delivery in sprawling suburban zones with higher miles per order.',
        grossEarnings: 22000,
        businessMiles: 14000,
        phoneExpense: 480,
        suppliesExpense: 180,
        tollsParking: 110,
        otherExpenses: 90,
        state: 'Florida',
        filingStatus: 'single',
        otherW2Income: 35000
    },
    {
        id: 'city-scooter-hybrid',
        title: 'Metro / High-Density Dasher',
        badge: 'Low Mileage',
        description: 'Dense metropolitan delivery with short distances, high tips, and low vehicle wear-and-tear.',
        grossEarnings: 31000,
        businessMiles: 9500,
        phoneExpense: 600,
        suppliesExpense: 250,
        tollsParking: 450,
        otherExpenses: 150,
        state: 'New York',
        filingStatus: 'single',
        otherW2Income: 0
    }
];

// 2026 IRS Standard Mileage Rate ($0.67 per business mile)
const IRS_MILEAGE_RATE_2026 = 0.67;

// US State Income Tax approximate effective brackets for quick reference
const STATE_TAX_RATES: Record<string, { rate: number; name: string; isZero: boolean }> = {
    'Alaska': { rate: 0.0, name: 'Alaska (0% State Tax)', isZero: true },
    'Florida': { rate: 0.0, name: 'Florida (0% State Tax)', isZero: true },
    'Nevada': { rate: 0.0, name: 'Nevada (0% State Tax)', isZero: true },
    'New Hampshire': { rate: 0.0, name: 'New Hampshire (0% Earned Tax)', isZero: true },
    'South Dakota': { rate: 0.0, name: 'South Dakota (0% State Tax)', isZero: true },
    'Tennessee': { rate: 0.0, name: 'Tennessee (0% State Tax)', isZero: true },
    'Texas': { rate: 0.0, name: 'Texas (0% State Tax)', isZero: true },
    'Washington': { rate: 0.0, name: 'Washington (0% State Tax)', isZero: true },
    'Wyoming': { rate: 0.0, name: 'Wyoming (0% State Tax)', isZero: true },
    'California': { rate: 0.06, name: 'California (Avg ~6.0% Brackets)', isZero: false },
    'New York': { rate: 0.055, name: 'New York (Avg ~5.5% Brackets)', isZero: false },
    'Illinois': { rate: 0.0495, name: 'Illinois (Flat 4.95%)', isZero: false },
    'Pennsylvania': { rate: 0.0307, name: 'Pennsylvania (Flat 3.07%)', isZero: false },
    'Ohio': { rate: 0.035, name: 'Ohio (Avg ~3.5%)', isZero: false },
    'Georgia': { rate: 0.0549, name: 'Georgia (Flat 5.49%)', isZero: false },
    'North Carolina': { rate: 0.045, name: 'North Carolina (Flat 4.5%)', isZero: false },
    'Michigan': { rate: 0.0425, name: 'Michigan (Flat 4.25%)', isZero: false },
    'New Jersey': { rate: 0.055, name: 'New Jersey (Avg ~5.5%)', isZero: false },
    'Arizona': { rate: 0.025, name: 'Arizona (Flat 2.5%)', isZero: false },
    'Virginia': { rate: 0.0575, name: 'Virginia (Avg ~5.0%)', isZero: false },
    'Colorado': { rate: 0.044, name: 'Colorado (Flat 4.4%)', isZero: false },
    'Other': { rate: 0.045, name: 'Other US State (Avg ~4.5%)', isZero: false }
};

export const DoorDashTaxCalculatorScreen: React.FC<DoorDashTaxCalculatorScreenProps> = ({
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
    // Form Inputs
    const [grossEarnings, setGrossEarnings] = useState<number>(24000);
    const [businessMiles, setBusinessMiles] = useState<number>(14500);
    const [calculationMethod, setCalculationMethod] = useState<'standard' | 'actual'>('standard');
    
    // Actual Expenses (Alternative Method)
    const [actualGas, setActualGas] = useState<number>(3600);
    const [actualInsurance, setActualInsurance] = useState<number>(1800);
    const [actualRepairs, setActualRepairs] = useState<number>(1200);
    const [actualDepreciation, setActualDepreciation] = useState<number>(2400);
    const [businessUsePercentage, setBusinessUsePercentage] = useState<number>(75);

    // Common 1099 Deductions
    const [phoneExpense, setPhoneExpense] = useState<number>(480);
    const [suppliesExpense, setSuppliesExpense] = useState<number>(200);
    const [tollsParking, setTollsParking] = useState<number>(150);
    const [otherExpenses, setOtherExpenses] = useState<number>(100);

    // Tax Settings
    const [selectedState, setSelectedState] = useState<string>('California');
    const [filingStatus, setFilingStatus] = useState<'single' | 'married_joint' | 'head_of_household'>('single');
    const [otherW2Income, setOtherW2Income] = useState<number>(0);

    // Copy Feedback
    const [copied, setCopied] = useState<boolean>(false);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

    // Core Calculation Logic
    const calculations = useMemo(() => {
        // 1. Calculate Vehicle Deductions
        const standardMileageDeduction = businessMiles * IRS_MILEAGE_RATE_2026;
        const totalActualExpenses = (actualGas + actualInsurance + actualRepairs + actualDepreciation) * (businessUsePercentage / 100);
        
        const vehicleDeduction = calculationMethod === 'standard' ? standardMileageDeduction : totalActualExpenses;

        // 2. Total Business Deductions (Schedule C Expenses)
        const nonVehicleDeductions = Math.max(0, phoneExpense) + Math.max(0, suppliesExpense) + Math.max(0, tollsParking) + Math.max(0, otherExpenses);
        const totalTaxDeductions = vehicleDeduction + nonVehicleDeductions;

        // 3. Net Schedule C Business Profit
        const netProfit = Math.max(0, grossEarnings - totalTaxDeductions);

        // 4. Self-Employment Tax (SECA - Schedule SE)
        // 92.35% of net profit is subject to 15.3% SE tax (12.4% Social Security + 2.9% Medicare)
        const taxableSelfEmploymentIncome = netProfit * 0.9235;
        const selfEmploymentTax = taxableSelfEmploymentIncome * 0.153;

        // 5. Deductible Part of Self-Employment Tax (Line 15 Schedule 1)
        const deductibleSeTax = selfEmploymentTax * 0.5;

        // 6. Federal Income Tax Approximation
        // Qualified Business Income (QBI) 20% deduction under Section 199A
        const qbiDeduction = netProfit * 0.20;
        
        // Standard Deduction 2026 approx
        const standardDeduction = filingStatus === 'married_joint' ? 30000 : (filingStatus === 'head_of_household' ? 22500 : 15000);
        
        const totalAdjustedIncome = (netProfit - deductibleSeTax - qbiDeduction) + otherW2Income;
        const federalTaxableIncome = Math.max(0, totalAdjustedIncome - standardDeduction);

        // Tiered Federal Brackets calculation
        let federalIncomeTax = 0;
        if (federalTaxableIncome > 0) {
            if (federalTaxableIncome <= 11600) {
                federalIncomeTax = federalTaxableIncome * 0.10;
            } else if (federalTaxableIncome <= 47150) {
                federalIncomeTax = 1160 + (federalTaxableIncome - 11600) * 0.12;
            } else if (federalTaxableIncome <= 100525) {
                federalIncomeTax = 5426 + (federalTaxableIncome - 47150) * 0.22;
            } else {
                federalIncomeTax = 17168 + (federalTaxableIncome - 100525) * 0.24;
            }
        }

        // 7. State Income Tax
        const stateConfig = STATE_TAX_RATES[selectedState] || STATE_TAX_RATES['Other'];
        const stateIncomeTax = stateConfig.isZero ? 0 : Math.max(0, netProfit * stateConfig.rate);

        // 8. Total Estimated Tax Liability
        const totalEstimatedTax = selfEmploymentTax + federalIncomeTax + stateIncomeTax;

        // 9. Effective Tax Rate & Take Home
        const effectiveTaxRate = grossEarnings > 0 ? (totalEstimatedTax / grossEarnings) * 100 : 0;
        const netTakeHome = grossEarnings - totalEstimatedTax - (calculationMethod === 'actual' ? totalActualExpenses : 0);
        const netPerMile = businessMiles > 0 ? (netTakeHome / businessMiles) : 0;

        // 10. Quarterly Estimated Payments (Form 1040-ES)
        const quarterlyPayment = totalEstimatedTax / 4;
        const weeklySavingsGoal = totalEstimatedTax / 52;

        return {
            standardMileageDeduction,
            totalActualExpenses,
            vehicleDeduction,
            nonVehicleDeductions,
            totalTaxDeductions,
            netProfit,
            selfEmploymentTax,
            deductibleSeTax,
            qbiDeduction,
            federalIncomeTax,
            stateIncomeTax,
            totalEstimatedTax,
            effectiveTaxRate,
            netTakeHome,
            netPerMile,
            quarterlyPayment,
            weeklySavingsGoal,
            isMileageBetter: standardMileageDeduction >= totalActualExpenses,
            mileageAdvantage: Math.abs(standardMileageDeduction - totalActualExpenses)
        };
    }, [
        grossEarnings, businessMiles, calculationMethod,
        actualGas, actualInsurance, actualRepairs, actualDepreciation, businessUsePercentage,
        phoneExpense, suppliesExpense, tollsParking, otherExpenses,
        selectedState, filingStatus, otherW2Income
    ]);

    const handleApplyPreset = (preset: PresetScenario) => {
        setGrossEarnings(preset.grossEarnings);
        setBusinessMiles(preset.businessMiles);
        setPhoneExpense(preset.phoneExpense);
        setSuppliesExpense(preset.suppliesExpense);
        setTollsParking(preset.tollsParking);
        setOtherExpenses(preset.otherExpenses);
        setSelectedState(preset.state);
        setFilingStatus(preset.filingStatus);
        setOtherW2Income(preset.otherW2Income);
    };

    const handleCopySummary = () => {
        const summary = `--- DOORDASH 1099 TAX SUMMARY (2026 IRS RATES) ---
Gross Earnings: $${grossEarnings.toLocaleString()}
Business Miles Driven: ${businessMiles.toLocaleString()} miles
Total Tax Deductions (Write-Offs): $${calculations.totalTaxDeductions.toLocaleString(undefined, { maximumFractionDigits: 0 })}
Net Taxable Profit (Schedule C): $${calculations.netProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
--------------------------------------------------
Self-Employment Tax (15.3% SECA): $${calculations.selfEmploymentTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
Est. Federal Income Tax: $${calculations.federalIncomeTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
Est. State Tax (${selectedState}): $${calculations.stateIncomeTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
TOTAL ESTIMATED TAX OWED: $${calculations.totalEstimatedTax.toLocaleString(undefined, { maximumFractionDigits: 0 })} (${calculations.effectiveTaxRate.toFixed(1)}% Effective Rate)
--------------------------------------------------
Quarterly 1040-ES Payment: $${calculations.quarterlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })} / quarter
Weekly Set-Aside Target: $${calculations.weeklySavingsGoal.toLocaleString(undefined, { maximumFractionDigits: 0 })} / week
Net Take-Home Pay: $${calculations.netTakeHome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
Calculated with TradeJournall DoorDash Tax Calculator: https://tradejournall.com/tools/doordash-tax-calculator`;

        navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const faqItems = [
        {
            q: "Do DoorDash drivers have to pay taxes on their earnings?",
            a: "Yes. DoorDash classifies delivery drivers as independent contractors (1099 workers), not W-2 employees. DoorDash does not withhold federal, state, or Social Security taxes from your payouts. If you earn $600 or more during the calendar year, DoorDash will send you Form 1099-NEC, and you must report all delivery income on IRS Schedule C."
        },
        {
            q: "How much should I set aside each week for DoorDash taxes?",
            a: "As a general rule of thumb, full-time and part-time Dashers should set aside between 20% to 30% of their net profits (gross pay minus mileage deductions) for taxes. If you drive high miles, your IRS 67¢/mile deduction will drastically reduce your taxable profit, lowering your effective tax rate to 12% - 18%."
        },
        {
            q: "Can I write off gas AND the IRS standard mileage deduction?",
            a: "No! This is the most common mistake made by delivery drivers. You must choose between the IRS Standard Mileage Rate ($0.67 per mile in 2026) OR the Actual Car Expense method (gas, oil changes, insurance, car depreciation, repairs). You cannot claim both. Over 95% of Dashers save significantly more money and avoid audit headaches using the Standard Mileage Rate."
        },
        {
            q: "What other tax deductions can DoorDash drivers claim besides mileage?",
            a: "In addition to your vehicle mileage, you can 100% deduct: the business-use percentage of your mobile phone bill, insulated food delivery bags, drink carriers, phone mounts and car chargers, bridge/highway tolls, parking fees, AAA/roadside assistance, and self-employed health insurance premiums on Schedule C."
        },
        {
            q: "When are DoorDash quarterly estimated taxes due (Form 1040-ES)?",
            a: "If you expect to owe $1,000 or more in federal taxes for the year, the IRS requires quarterly estimated payments to avoid underpayment penalties. Deadlines are: Q1 (April 15), Q2 (June 15), Q3 (September 15), and Q4 (January 15 of the following year)."
        },
        {
            q: "What is the 15.3% Self-Employment Tax (SECA)?",
            a: "Self-employment tax covers Social Security (12.4%) and Medicare (2.9%). Regular W-2 employees split this with their boss (paying 7.65% each). As a self-employed Dasher, you pay both halves (15.3%), but the IRS lets you deduct 50% of this self-employment tax when calculating your adjusted gross income on Form 1040."
        }
    ];

    const jsonLdScript = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "SoftwareApplication",
                "name": "DoorDash Tax Calculator & 1099 Mileage Deductions App",
                "operatingSystem": "All",
                "applicationCategory": "FinanceApplication",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                },
                "description": "Free DoorDash tax calculator app. Calculate 15.3% self-employment tax, IRS 67¢ standard mileage deduction, Schedule C write-offs, and Form 1040-ES quarterly estimated payments."
            },
            {
                "@type": "FAQPage",
                "mainEntity": faqItems.map(item => ({
                    "@type": "Question",
                    "name": item.q,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": item.a
                    }
                }))
            }
        ]
    };

    const currentPath = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
    const canonicalUrl = currentPath.includes('tax-calculator-for-doordash-drivers')
        ? 'https://tradejournall.com/tools/tax-calculator-for-doordash-drivers'
        : currentPath.includes('doordash-taxes-calculator')
        ? 'https://tradejournall.com/tools/doordash-taxes-calculator'
        : currentPath.includes('doordash-tax-calculator-app')
        ? 'https://tradejournall.com/tools/doordash-tax-calculator-app'
        : currentPath.includes('doordash-tax-deductions-calculator')
        ? 'https://tradejournall.com/tools/doordash-tax-deductions-calculator'
        : 'https://tradejournall.com/tools/doordash-tax-calculator';

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} pb-20 selection:bg-rose-500 selection:text-white`}>
            <Helmet>
                <title>DoorDash Tax Calculator 2026 | 1099 Mileage & Tax Deductions App</title>
                <meta name="description" content="Free DoorDash Tax Calculator for delivery drivers. Calculate exact 15.3% self-employment tax, 2026 IRS 67¢/mile deductions, Schedule C write-offs, and quarterly 1040-ES estimated payments." />
                <meta name="keywords" content="doordash tax calculator, tax calculator for doordash drivers, doordash taxes calculator, doordash tax calculator app, doordash tax deductions calculator, gig worker tax calculator, 1099 delivery driver taxes" />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:url" content={canonicalUrl} />
                <script type="application/ld+json">
                    {JSON.stringify(jsonLdScript)}
                </script>
            </Helmet>

            {/* Top Navigation Bar */}
            <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {onBackToLanding && (
                            <button
                                onClick={onBackToLanding}
                                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
                            >
                                <ArrowLeft size={16} />
                                <span>Back to Tools</span>
                            </button>
                        )}
                        <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 font-bold">
                                <Car size={18} />
                            </span>
                            <div>
                                <h1 className="text-sm font-bold text-white flex items-center gap-2">
                                    <span>DoorDash Tax Calculator</span>
                                    <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-black tracking-wider uppercase">
                                        IRS 67¢ Rate 2026
                                    </span>
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopySummary}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition active:scale-95"
                        >
                            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            <span>{copied ? 'Copied Summary!' : 'Copy Summary'}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Hero Header */}
                <div className="mb-8 text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-3">
                        <Receipt size={14} />
                        <span>1099 Schedule C & Self-Employment Tax Estimator</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                        DoorDash Tax Calculator & <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400">1099 Deductions App</span>
                    </h1>
                    <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                        Calculate exact 15.3% Self-Employment Tax (SECA), 2026 IRS 67¢/mile deductions, net Schedule C taxable profit, and quarterly 1040-ES estimated payments — 100% free with no login required.
                    </p>
                </div>

                {/* Preset Scenario Cards */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles size={14} className="text-amber-400" />
                            <span>Quick Presets: Select Your Driver Profile</span>
                        </h2>
                        <span className="text-xs text-slate-400">One-click realistic 1099 models</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {PRESET_SCENARIOS.map((preset) => (
                            <button
                                key={preset.id}
                                onClick={() => handleApplyPreset(preset)}
                                className={`p-4 rounded-2xl border text-left transition-all group hover:scale-[1.01] active:scale-[0.99] ${
                                    grossEarnings === preset.grossEarnings && businessMiles === preset.businessMiles
                                        ? 'bg-rose-500/10 border-rose-500/50 shadow-lg shadow-rose-500/5'
                                        : `${theme.card} hover:border-slate-700`
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-white group-hover:text-rose-400 transition">
                                        {preset.title}
                                    </span>
                                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-semibold border border-slate-700">
                                        {preset.badge}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                                    {preset.description}
                                </p>
                                <div className="flex items-center justify-between text-[11px] font-mono border-t border-slate-800/80 pt-2 text-slate-300">
                                    <span>${preset.grossEarnings.toLocaleString()} gross</span>
                                    <span className="text-rose-400">{preset.businessMiles.toLocaleString()} mi</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main 2-Column Grid: Inputs Left, Dashboard Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                    {/* Left Column: Form Controls (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Section 1: Earnings & Mileage */}
                        <div className={`p-6 rounded-3xl border ${theme.card}`}>
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2">
                                    <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                                        <DollarSign size={18} />
                                    </span>
                                    <div>
                                        <h2 className="text-base font-bold text-white">1. DoorDash Earnings & Mileage</h2>
                                        <p className="text-xs text-slate-400">Gross 1099 payout and business miles driven</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-semibold text-slate-300">
                                            Annual DoorDash / Gig Gross Earnings ($)
                                        </label>
                                        <span className="text-xs font-mono font-bold text-emerald-400">
                                            ${grossEarnings.toLocaleString()}
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1000"
                                        max="100000"
                                        step="500"
                                        value={grossEarnings}
                                        onChange={(e) => setGrossEarnings(Number(e.target.value))}
                                        className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg mb-2"
                                    />
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                                        <input
                                            type="number"
                                            value={grossEarnings}
                                            onChange={(e) => setGrossEarnings(Math.max(0, Number(e.target.value)))}
                                            className={`w-full pl-8 pr-4 py-2.5 rounded-xl border text-sm font-mono font-semibold focus:outline-none focus:border-rose-500 transition ${theme.input}`}
                                            placeholder="24000"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="text-xs font-semibold text-slate-300">
                                            Total Business Miles Logged While Dashing
                                        </label>
                                        <span className="text-xs font-mono font-bold text-rose-400">
                                            {businessMiles.toLocaleString()} miles
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="60000"
                                        step="500"
                                        value={businessMiles}
                                        onChange={(e) => setBusinessMiles(Number(e.target.value))}
                                        className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg mb-2"
                                    />
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                                            <Navigation size={15} />
                                        </span>
                                        <input
                                            type="number"
                                            value={businessMiles}
                                            onChange={(e) => setBusinessMiles(Math.max(0, Number(e.target.value)))}
                                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-mono font-semibold focus:outline-none focus:border-rose-500 transition ${theme.input}`}
                                            placeholder="14500"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                                        <span className="flex items-center gap-1.5">
                                            <ShieldCheck size={14} className="text-emerald-400" />
                                            <span>2026 IRS Standard Rate: <strong>$0.67 per mile</strong></span>
                                        </span>
                                        <span className="font-mono font-bold text-emerald-400">
                                            = ${calculations.standardMileageDeduction.toLocaleString(undefined, { maximumFractionDigits: 0 })} write-off
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Deduction Method & Additional Write-Offs */}
                        <div className={`p-6 rounded-3xl border ${theme.card}`}>
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2">
                                    <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                                        <Scale size={18} />
                                    </span>
                                    <div>
                                        <h2 className="text-base font-bold text-white">2. Vehicle Method & Other 1099 Expenses</h2>
                                        <p className="text-xs text-slate-400">Choose your calculation method & claim legitimate write-offs</p>
                                    </div>
                                </div>
                            </div>

                            {/* Method Toggle */}
                            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 mb-5">
                                <button
                                    onClick={() => setCalculationMethod('standard')}
                                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                                        calculationMethod === 'standard'
                                            ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <Navigation size={14} />
                                    <span>Standard Mileage (67¢/mi)</span>
                                </button>
                                <button
                                    onClick={() => setCalculationMethod('actual')}
                                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                                        calculationMethod === 'actual'
                                            ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    <Fuel size={14} />
                                    <span>Actual Car Expenses</span>
                                </button>
                            </div>

                            {/* Actual Expenses Fields (if selected) */}
                            {calculationMethod === 'actual' && (
                                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3 mb-5">
                                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                                        <AlertTriangle size={15} />
                                        <span>Actual Vehicle Expenses (Annual Receipts)</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                        <div>
                                            <label className="text-slate-400 mb-1 block">Gas & Fuel ($)</label>
                                            <input
                                                type="number"
                                                value={actualGas}
                                                onChange={(e) => setActualGas(Number(e.target.value))}
                                                className={`w-full px-3 py-2 rounded-xl border font-mono ${theme.input}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-slate-400 mb-1 block">Auto Insurance ($)</label>
                                            <input
                                                type="number"
                                                value={actualInsurance}
                                                onChange={(e) => setActualInsurance(Number(e.target.value))}
                                                className={`w-full px-3 py-2 rounded-xl border font-mono ${theme.input}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-slate-400 mb-1 block">Repairs & Tires ($)</label>
                                            <input
                                                type="number"
                                                value={actualRepairs}
                                                onChange={(e) => setActualRepairs(Number(e.target.value))}
                                                className={`w-full px-3 py-2 rounded-xl border font-mono ${theme.input}`}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-slate-400 mb-1 block">Car Depreciation ($)</label>
                                            <input
                                                type="number"
                                                value={actualDepreciation}
                                                onChange={(e) => setActualDepreciation(Number(e.target.value))}
                                                className={`w-full px-3 py-2 rounded-xl border font-mono ${theme.input}`}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-slate-400">Business Use Percentage:</span>
                                            <span className="font-mono font-bold text-amber-300">{businessUsePercentage}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="10"
                                            max="100"
                                            value={businessUsePercentage}
                                            onChange={(e) => setBusinessUsePercentage(Number(e.target.value))}
                                            className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Additional 1099 Deductions (Always Allowed Alongside Mileage!) */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                    <ShoppingBag size={14} className="text-rose-400" />
                                    <span>Other Permissible 1099 Business Deductions</span>
                                </h3>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <label className="text-slate-400 mb-1 flex items-center justify-between">
                                            <span>Phone Bill (Work Portion)</span>
                                            <span className="text-[10px] text-slate-500">e.g. 50%</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={phoneExpense}
                                            onChange={(e) => setPhoneExpense(Number(e.target.value))}
                                            className={`w-full px-3 py-2 rounded-xl border font-mono ${theme.input}`}
                                            placeholder="480"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-slate-400 mb-1 flex items-center justify-between">
                                            <span>Hot Bags, Phone Mount & Gear</span>
                                            <span className="text-[10px] text-slate-500">100% Deductible</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={suppliesExpense}
                                            onChange={(e) => setSuppliesExpense(Number(e.target.value))}
                                            className={`w-full px-3 py-2 rounded-xl border font-mono ${theme.input}`}
                                            placeholder="200"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-slate-400 mb-1 flex items-center justify-between">
                                            <span>Tolls & Parking Fees</span>
                                            <span className="text-[10px] text-slate-500">During Shifts</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={tollsParking}
                                            onChange={(e) => setTollsParking(Number(e.target.value))}
                                            className={`w-full px-3 py-2 rounded-xl border font-mono ${theme.input}`}
                                            placeholder="150"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-slate-400 mb-1 flex items-center justify-between">
                                            <span>AAA Roadside / Other</span>
                                            <span className="text-[10px] text-slate-500">Receipts</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={otherExpenses}
                                            onChange={(e) => setOtherExpenses(Number(e.target.value))}
                                            className={`w-full px-3 py-2 rounded-xl border font-mono ${theme.input}`}
                                            placeholder="100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Tax Filing Profile & State */}
                        <div className={`p-6 rounded-3xl border ${theme.card}`}>
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2">
                                    <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                                        <Landmark size={18} />
                                    </span>
                                    <div>
                                        <h2 className="text-base font-bold text-white">3. Tax Bracket & US State Selection</h2>
                                        <p className="text-xs text-slate-400">State income tax and household filing status</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs text-slate-300 font-semibold mb-1.5 block">State</label>
                                    <select
                                        value={selectedState}
                                        onChange={(e) => setSelectedState(e.target.value)}
                                        className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none focus:border-rose-500 ${theme.input}`}
                                    >
                                        {Object.entries(STATE_TAX_RATES).map(([stateKey, config]) => (
                                            <option key={stateKey} value={stateKey}>
                                                {config.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs text-slate-300 font-semibold mb-1.5 block">Filing Status</label>
                                    <select
                                        value={filingStatus}
                                        onChange={(e) => setFilingStatus(e.target.value as any)}
                                        className={`w-full px-3 py-2 rounded-xl border text-xs font-semibold focus:outline-none focus:border-rose-500 ${theme.input}`}
                                    >
                                        <option value="single">Single</option>
                                        <option value="married_joint">Married Filing Jointly</option>
                                        <option value="head_of_household">Head of Household</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs text-slate-300 font-semibold mb-1.5 block">Other W-2 Income ($)</label>
                                    <input
                                        type="number"
                                        value={otherW2Income}
                                        onChange={(e) => setOtherW2Income(Math.max(0, Number(e.target.value)))}
                                        className={`w-full px-3 py-2 rounded-xl border text-xs font-mono font-semibold ${theme.input}`}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Visual Tax Dashboard (5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Primary Results Card */}
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/40 border border-rose-500/30 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                <Car size={160} />
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-black tracking-wider uppercase text-rose-400 flex items-center gap-1.5">
                                    <Receipt size={15} />
                                    <span>2026 Estimated Tax Liability</span>
                                </span>
                                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                    {calculations.effectiveTaxRate.toFixed(1)}% Eff. Rate
                                </span>
                            </div>

                            <div className="mb-6">
                                <div className="text-4xl md:text-5xl font-black text-white font-mono tracking-tight">
                                    ${calculations.totalEstimatedTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </div>
                                <p className="text-xs text-slate-400 mt-1">
                                    Total estimated tax owed (Self-Employment + Federal + State)
                                </p>
                            </div>

                            {/* KPI Metrics Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                                        Total Tax Write-Offs
                                    </span>
                                    <div className="text-lg font-black text-emerald-400 font-mono">
                                        ${calculations.totalTaxDeductions.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </div>
                                    <span className="text-[10px] text-slate-500">Mileage + supplies</span>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                                        Schedule C Net Profit
                                    </span>
                                    <div className="text-lg font-black text-white font-mono">
                                        ${calculations.netProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </div>
                                    <span className="text-[10px] text-slate-500">Taxable business profit</span>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                                        Quarterly 1040-ES
                                    </span>
                                    <div className="text-lg font-black text-amber-400 font-mono">
                                        ${calculations.quarterlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </div>
                                    <span className="text-[10px] text-slate-500">Pay each quarter</span>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                                        Weekly Savings Goal
                                    </span>
                                    <div className="text-lg font-black text-rose-400 font-mono">
                                        ${calculations.weeklySavingsGoal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </div>
                                    <span className="text-[10px] text-slate-500">Save per week for taxes</span>
                                </div>
                            </div>

                            {/* Detailed Tax Breakdown List */}
                            <div className="border-t border-slate-800/80 pt-4 space-y-2 text-xs">
                                <div className="flex items-center justify-between text-slate-300">
                                    <span className="flex items-center gap-1.5">
                                        <Percent size={13} className="text-rose-400" />
                                        <span>Self-Employment Tax (15.3% SECA):</span>
                                    </span>
                                    <span className="font-mono font-bold text-white">
                                        ${calculations.selfEmploymentTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-slate-300">
                                    <span className="flex items-center gap-1.5">
                                        <Landmark size={13} className="text-blue-400" />
                                        <span>Federal Income Tax:</span>
                                    </span>
                                    <span className="font-mono font-bold text-white">
                                        ${calculations.federalIncomeTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-slate-300">
                                    <span className="flex items-center gap-1.5">
                                        <Landmark size={13} className="text-purple-400" />
                                        <span>State Income Tax ({selectedState}):</span>
                                    </span>
                                    <span className="font-mono font-bold text-white">
                                        ${calculations.stateIncomeTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-emerald-400 pt-2 border-t border-slate-800/80 font-bold">
                                    <span>Estimated Pure Take-Home Cash:</span>
                                    <span className="font-mono text-sm">
                                        ${calculations.netTakeHome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Mileage vs Actual Expense Comparison Card */}
                        <div className={`p-6 rounded-3xl border ${theme.card}`}>
                            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                    <Scale size={14} className="text-emerald-400" />
                                    <span>Mileage vs. Actual Expenses</span>
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                    calculations.isMileageBetter ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                }`}>
                                    {calculations.isMileageBetter ? 'Standard Mileage Wins' : 'Actual Expenses Win'}
                                </span>
                            </h3>

                            <div className="space-y-3 text-xs mb-4">
                                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-white">Standard Mileage (67¢/mi)</div>
                                        <div className="text-[11px] text-slate-400">{businessMiles.toLocaleString()} miles × $0.67</div>
                                    </div>
                                    <div className="font-mono font-bold text-emerald-400 text-sm">
                                        ${calculations.standardMileageDeduction.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                                    <div>
                                        <div className="font-bold text-white">Actual Vehicle Receipts</div>
                                        <div className="text-[11px] text-slate-400">Gas, insurance, repairs ({businessUsePercentage}% work)</div>
                                    </div>
                                    <div className="font-mono font-bold text-slate-300 text-sm">
                                        ${calculations.totalActualExpenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </div>
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-400 leading-relaxed bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                                💡 <strong>Pro Tip:</strong> By using the <strong>Standard Mileage Method</strong>, you deduct <strong>${calculations.mileageAdvantage.toLocaleString(undefined, { maximumFractionDigits: 0 })} {calculations.isMileageBetter ? 'MORE' : 'LESS'}</strong> compared to collecting shoeboxes of gas receipts!
                            </p>
                        </div>

                        {/* Quarterly Estimated Tax Calendar */}
                        <div className={`p-6 rounded-3xl border ${theme.card}`}>
                            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                                <Calendar size={14} className="text-rose-400" />
                                <span>IRS Form 1040-ES Quarterly Deadlines</span>
                            </h3>

                            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                                    <span className="text-[10px] text-slate-400 block font-sans">Q1 Deadline</span>
                                    <span className="font-bold text-white">April 15</span>
                                    <div className="text-rose-400 font-bold mt-1">${calculations.quarterlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                                    <span className="text-[10px] text-slate-400 block font-sans">Q2 Deadline</span>
                                    <span className="font-bold text-white">June 15</span>
                                    <div className="text-rose-400 font-bold mt-1">${calculations.quarterlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                                    <span className="text-[10px] text-slate-400 block font-sans">Q3 Deadline</span>
                                    <span className="font-bold text-white">September 15</span>
                                    <div className="text-rose-400 font-bold mt-1">${calculations.quarterlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                                    <span className="text-[10px] text-slate-400 block font-sans">Q4 Deadline</span>
                                    <span className="font-bold text-white">January 15</span>
                                    <div className="text-rose-400 font-bold mt-1">${calculations.quarterlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SEO Informational Article & Deductions Checklist */}
                <div className={`p-8 rounded-3xl border ${theme.card} mb-12 space-y-6 text-slate-300 text-sm leading-relaxed`}>
                    <div className="border-b border-slate-800 pb-4">
                        <h2 className="text-2xl font-black text-white tracking-tight mb-2">
                            The Complete DoorDash Tax Guide: 1099 Schedule C & Mileage Write-Offs
                        </h2>
                        <p className="text-xs text-slate-400">
                            Everything food delivery drivers, couriers, and gig workers must know before filing taxes with the IRS.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-emerald-400" />
                                <span>How DoorDash Taxes Work (Form 1099-NEC)</span>
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-3">
                                When you drive for DoorDash, you are classified as an independent contractor, not a traditional W-2 employee. This means DoorDash does not withhold federal income tax, state income tax, or FICA taxes (Social Security and Medicare) from your weekly direct deposits.
                            </p>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                You report your total delivery revenue on <strong>IRS Form 1040 Schedule C (Profit or Loss from Business)</strong>. You only pay taxes on your <em>Net Profit</em>, which is calculated as:
                                <br />
                                <code className="block my-2 p-2 rounded bg-slate-950 font-mono text-emerald-400 text-[11px] border border-slate-800">
                                    Net Profit = Gross DoorDash Pay - Legitimate Business Deductions (Mileage + Supplies)
                                </code>
                            </p>
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                                <Receipt size={16} className="text-rose-400" />
                                <span>Understanding the 15.3% Self-Employment Tax</span>
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed mb-3">
                                Every self-employed American must pay <strong>15.3% Self-Employment Tax (SECA)</strong> on 92.35% of their net Schedule C business profit. This consists of:
                            </p>
                            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside mb-3">
                                <li><strong>12.4% for Social Security</strong> (covers your retirement & disability credits).</li>
                                <li><strong>2.9% for Medicare</strong> (hospital & medical insurance).</li>
                            </ul>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                <strong>Good News:</strong> The IRS allows you to deduct half of your self-employment tax (7.65%) directly from your taxable income on Form 1040 Line 15, reducing your overall federal income tax bracket.
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                        <h3 className="text-base font-bold text-white mb-3">
                            Complete 1099 Tax Deductions Checklist for DoorDash & UberEats
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                                <span className="font-bold text-rose-400 block mb-1">1. Business Mileage</span>
                                <p className="text-slate-400 text-[11px]">
                                    Miles driven while waiting for orders, driving to restaurants, and delivering to customers (IRS rate: $0.67/mile).
                                </p>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                                <span className="font-bold text-amber-400 block mb-1">2. Delivery Equipment</span>
                                <p className="text-slate-400 text-[11px]">
                                    Insulated hot bags, pizza bags, drink caddies, phone mounts, car dash cams, flashlight, and sturdy charging cables.
                                </p>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                                <span className="font-bold text-blue-400 block mb-1">3. Mobile Phone & Data</span>
                                <p className="text-slate-400 text-[11px]">
                                    The percentage of your monthly wireless phone bill used to run the Dasher app, GPS navigation, and customer calls.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Frequently Asked Questions (FAQ) Accordion */}
                <div className={`p-8 rounded-3xl border ${theme.card} mb-12`}>
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <HelpCircle size={20} className="text-rose-400" />
                            <span>Frequently Asked Questions About DoorDash Taxes</span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Common tax questions answered for 1099 delivery couriers and gig workers.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {faqItems.map((faq, idx) => (
                            <div
                                key={idx}
                                className="rounded-2xl border border-slate-800/80 bg-slate-950/60 overflow-hidden"
                            >
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-xs text-white hover:text-rose-400 transition"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown
                                        size={16}
                                        className={`text-slate-400 transition-transform ${
                                            expandedFaq === idx ? 'rotate-180 text-rose-400' : ''
                                        }`}
                                    />
                                </button>
                                {expandedFaq === idx && (
                                    <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Related Quantitative & Tax Tools Grid */}
                <RelatedToolsGrid
                    currentToolId="doordash-tax-calculator"
                    theme={theme}
                    onNavigate={(path) => {
                        window.history.pushState({}, '', path);
                        window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                />
            </div>
        </div>
    );
};
