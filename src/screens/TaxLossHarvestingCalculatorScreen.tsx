import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Calculator, DollarSign, ArrowRight, ShieldCheck, ShieldAlert,
    CheckCircle2, AlertTriangle, HelpCircle, ChevronDown, Copy, Check,
    Sparkles, RefreshCw, FileText, Share2, Info, ArrowLeft, ArrowUpRight,
    TrendingDown, TrendingUp, BookOpen, Scale, Clock, Eye, Plus, Trash2,
    PieChart, Landmark, Percent, Zap, Award, ExternalLink
} from 'lucide-react';
import { RelatedToolsGrid } from '../components/RelatedToolsGrid';

export interface TaxLossHarvestingCalculatorScreenProps {
    theme?: any;
    isDarkMode?: boolean;
    primaryCurrencySymbol?: string;
    onBackToLanding?: () => void;
    onSignIn?: () => void;
    onNavigateToWashSale?: () => void;
}

interface LossPosition {
    id: string;
    symbol: string;
    type: 'short-term' | 'long-term';
    unrealizedLoss: number;
    proxyReplacement: string;
}

interface PresetScenario {
    id: string;
    title: string;
    badge: string;
    description: string;
    country: 'US' | 'UK' | 'GLOBAL';
    stcg: number;
    ltcg: number;
    ordinaryIncome: number;
    stcl: number;
    ltcl: number;
    positions: LossPosition[];
}

const PRESET_SCENARIOS: PresetScenario[] = [
    {
        id: 'us-tech-heavy',
        title: 'US Tech Portfolio (Fidelity / Schwab DIY)',
        badge: 'Popular US Investor',
        description: 'Realized high short-term gains on NVDA/AAPL swing trades, holding unrealized pullbacks in TSLA & speculative growth stocks.',
        country: 'US',
        stcg: 15000,
        ltcg: 8000,
        ordinaryIncome: 125000,
        stcl: 9500,
        ltcl: 6000,
        positions: [
            { id: 'pos-1', symbol: 'TSLA', type: 'short-term', unrealizedLoss: 5500, proxyReplacement: 'QCLN / EV ETF' },
            { id: 'pos-2', symbol: 'COIN', type: 'short-term', unrealizedLoss: 4000, proxyReplacement: 'BITO / Cash (31 Days)' },
            { id: 'pos-3', symbol: 'ARKK', type: 'long-term', unrealizedLoss: 6000, proxyReplacement: 'VUG / Large-Cap Growth' }
        ]
    },
    {
        id: 'max-salary-offset',
        title: 'Max $3,000 W-2 Salary Offset (IRS Limit)',
        badge: 'High Tax Bracket',
        description: 'Zero realized capital gains this year. Harvesting exactly $3,000 in capital losses to write off top-bracket ordinary salary income.',
        country: 'US',
        stcg: 0,
        ltcg: 0,
        ordinaryIncome: 185000,
        stcl: 3000,
        ltcl: 0,
        positions: [
            { id: 'pos-1', symbol: 'PYPL', type: 'short-term', unrealizedLoss: 3000, proxyReplacement: 'V / MA (Payment Processors)' }
        ]
    },
    {
        id: 'crypto-loss-harvest',
        title: 'Crypto & Bitcoin Bear Dip Harvest',
        badge: 'Crypto Traders',
        description: 'Offset heavy crypto staking and altcoin profits with unrealized losses. Check IRS Notice 2014-21 capital loss rules.',
        country: 'US',
        stcg: 22000,
        ltcg: 5000,
        ordinaryIncome: 95000,
        stcl: 18000,
        ltcl: 4000,
        positions: [
            { id: 'pos-1', symbol: 'ETH', type: 'short-term', unrealizedLoss: 11000, proxyReplacement: 'SOL / Crypto Basket' },
            { id: 'pos-2', symbol: 'ADA', type: 'short-term', unrealizedLoss: 7000, proxyReplacement: 'AVAX' },
            { id: 'pos-3', symbol: 'LINK', type: 'long-term', unrealizedLoss: 4000, proxyReplacement: 'DOT' }
        ]
    },
    {
        id: 'uk-hmrc-allowance',
        title: 'UK Investor (HMRC £3,000 CGT Exemption)',
        badge: 'UK / Europe',
        description: 'Optimizing taxable gains against the reduced HMRC £3,000 annual Capital Gains Tax allowance with Bed-and-ISA strategy.',
        country: 'UK',
        stcg: 7500,
        ltcg: 4000,
        ordinaryIncome: 65000,
        stcl: 4500,
        ltcl: 2000,
        positions: [
            { id: 'pos-1', symbol: 'FTSE All-Share ETF', type: 'short-term', unrealizedLoss: 3500, proxyReplacement: 'MSCI World ETF' },
            { id: 'pos-2', symbol: 'AstraZeneca', type: 'long-term', unrealizedLoss: 3000, proxyReplacement: 'GSK' }
        ]
    }
];

export const TaxLossHarvestingCalculatorScreen: React.FC<TaxLossHarvestingCalculatorScreenProps> = ({
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
    onNavigateToWashSale
}) => {
    // Navigation / Active View Tab
    const [activeTab, setActiveTab] = useState<'calculator' | 'how-it-works' | 'fidelity-vs-diy' | 'wash-sale-rules' | 'faq'>('calculator');

    // Jurisdiction: 'US' | 'UK' | 'GLOBAL'
    const [country, setCountry] = useState<'US' | 'UK' | 'GLOBAL'>('US');

    // US Filing Status
    const [filingStatus, setFilingStatus] = useState<'single' | 'married-joint' | 'married-separate' | 'head-household'>('single');

    // Ordinary Annual Income (to determine marginal bracket)
    const [ordinaryIncome, setOrdinaryIncome] = useState<number>(125000);

    // Realized Capital Gains (Current Tax Year)
    const [realizedSTCG, setRealizedSTCG] = useState<number>(15000);
    const [realizedLTCG, setRealizedLTCG] = useState<number>(8000);

    // Prior Year Loss Carryforward
    const [priorCarryforwardST, setPriorCarryforwardST] = useState<number>(0);
    const [priorCarryforwardLT, setPriorCarryforwardLT] = useState<number>(0);

    // Custom Flat Rates (if GLOBAL)
    const [customStcgRate, setCustomStcgRate] = useState<number>(30);
    const [customLtcgRate, setCustomLtcgRate] = useState<number>(15);
    const [customIncomeRate, setCustomIncomeRate] = useState<number>(32);

    // Positions to Harvest
    const [positions, setPositions] = useState<LossPosition[]>([
        { id: 'pos-1', symbol: 'TSLA', type: 'short-term', unrealizedLoss: 5500, proxyReplacement: 'QCLN / EV ETF' },
        { id: 'pos-2', symbol: 'COIN', type: 'short-term', unrealizedLoss: 4000, proxyReplacement: 'BITO / 31-Day Hold' },
        { id: 'pos-3', symbol: 'ARKK', type: 'long-term', unrealizedLoss: 6000, proxyReplacement: 'VUG / Growth Index' }
    ]);

    // New Position Quick Inputs
    const [newSymbol, setNewSymbol] = useState('');
    const [newType, setNewType] = useState<'short-term' | 'long-term'>('short-term');
    const [newLoss, setNewLoss] = useState<number>(2000);
    const [newProxy, setNewProxy] = useState('');

    // Feedback toast / copied state
    const [copiedSummary, setCopiedSummary] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    // Currency Symbol based on country
    const currency = country === 'UK' ? '£' : (primaryCurrencySymbol || '$');

    // -------------------------------------------------------------
    // US Federal Tax Bracket Lookup (2025/2026 IRS Estimates)
    // -------------------------------------------------------------
    const usTaxRates = useMemo(() => {
        // Marginal ordinary income bracket (approximate US federal brackets)
        let ordinaryMarginalRate = 0.24;
        let ltcgRate = 0.15;

        if (filingStatus === 'single') {
            if (ordinaryIncome <= 11600) ordinaryMarginalRate = 0.10;
            else if (ordinaryIncome <= 47150) ordinaryMarginalRate = 0.12;
            else if (ordinaryIncome <= 100525) ordinaryMarginalRate = 0.22;
            else if (ordinaryIncome <= 191950) ordinaryMarginalRate = 0.24;
            else if (ordinaryIncome <= 243725) ordinaryMarginalRate = 0.32;
            else if (ordinaryIncome <= 609350) ordinaryMarginalRate = 0.35;
            else ordinaryMarginalRate = 0.37;

            // LTCG brackets for single
            if (ordinaryIncome <= 47025) ltcgRate = 0.00;
            else if (ordinaryIncome <= 518900) ltcgRate = 0.15;
            else ltcgRate = 0.20;
        } else if (filingStatus === 'married-joint') {
            if (ordinaryIncome <= 23200) ordinaryMarginalRate = 0.10;
            else if (ordinaryIncome <= 94300) ordinaryMarginalRate = 0.12;
            else if (ordinaryIncome <= 201050) ordinaryMarginalRate = 0.22;
            else if (ordinaryIncome <= 383900) ordinaryMarginalRate = 0.24;
            else if (ordinaryIncome <= 487450) ordinaryMarginalRate = 0.32;
            else if (ordinaryIncome <= 731200) ordinaryMarginalRate = 0.35;
            else ordinaryMarginalRate = 0.37;

            // LTCG brackets for married joint
            if (ordinaryIncome <= 94050) ltcgRate = 0.00;
            else if (ordinaryIncome <= 583750) ltcgRate = 0.15;
            else ltcgRate = 0.20;
        } else {
            // Married Separate / Head of Household average
            if (ordinaryIncome <= 50000) ordinaryMarginalRate = 0.12;
            else if (ordinaryIncome <= 100000) ordinaryMarginalRate = 0.22;
            else if (ordinaryIncome <= 190000) ordinaryMarginalRate = 0.24;
            else ordinaryMarginalRate = 0.32;

            ltcgRate = ordinaryIncome <= 50000 ? 0.00 : ordinaryIncome <= 450000 ? 0.15 : 0.20;
        }

        // Add 3.8% Net Investment Income Tax (NIIT) for high earners (>$200k single, >$250k joint)
        const isSubjectToNiit = (filingStatus === 'single' && ordinaryIncome > 200000) ||
                               (filingStatus === 'married-joint' && ordinaryIncome > 250000);
        const effectiveLtcgRate = isSubjectToNiit ? ltcgRate + 0.038 : ltcgRate;
        const effectiveStcgRate = isSubjectToNiit ? ordinaryMarginalRate + 0.038 : ordinaryMarginalRate;

        return {
            ordinaryRate: ordinaryMarginalRate,
            stcgRate: effectiveStcgRate,
            ltcgRate: effectiveLtcgRate,
            niitApplied: isSubjectToNiit
        };
    }, [filingStatus, ordinaryIncome]);

    // Active Effective Tax Rates
    const activeRates = useMemo(() => {
        if (country === 'US') {
            return {
                stcg: usTaxRates.stcgRate,
                ltcg: usTaxRates.ltcgRate,
                income: usTaxRates.ordinaryRate
            };
        } else if (country === 'UK') {
            // UK HMRC: Basic rate 10% CGT (or 20% higher/additional rate)
            const isHigherRate = ordinaryIncome > 50270;
            return {
                stcg: isHigherRate ? 0.20 : 0.10,
                ltcg: isHigherRate ? 0.20 : 0.10,
                income: isHigherRate ? 0.40 : 0.20
            };
        } else {
            // GLOBAL custom
            return {
                stcg: customStcgRate / 100,
                ltcg: customLtcgRate / 100,
                income: customIncomeRate / 100
            };
        }
    }, [country, usTaxRates, ordinaryIncome, customStcgRate, customLtcgRate, customIncomeRate]);

    // Total Harvested Losses from Positions List
    const harvestedLosses = useMemo(() => {
        let stcl = 0;
        let ltcl = 0;
        positions.forEach(pos => {
            if (pos.type === 'short-term') stcl += pos.unrealizedLoss;
            else ltcl += pos.unrealizedLoss;
        });
        return { stcl, ltcl, total: stcl + ltcl };
    }, [positions]);

    // -------------------------------------------------------------
    // Comprehensive Capital Gains Netting Math (IRS Schedule D Order)
    // -------------------------------------------------------------
    const calculation = useMemo(() => {
        const totalSTCL = harvestedLosses.stcl + priorCarryforwardST;
        const totalLTCL = harvestedLosses.ltcl + priorCarryforwardLT;

        // Step 1: Initial Baseline Tax without harvesting
        const baseStcgTax = realizedSTCG * activeRates.stcg;
        const baseLtcgTax = realizedLTCG * activeRates.ltcg;
        const baselineTotalTax = baseStcgTax + baseLtcgTax;

        // Step 2: Net within categories first (STCL vs STCG, LTCL vs LTCG)
        const netST_initial = realizedSTCG - totalSTCL;
        const netLT_initial = realizedLTCG - totalLTCL;

        let finalTaxableSTCG = 0;
        let finalTaxableLTCG = 0;
        let netRemainingLoss = 0;
        let lossNature: 'short-term' | 'long-term' | 'mixed' | 'none' = 'none';

        if (netST_initial >= 0 && netLT_initial >= 0) {
            // Both still positive
            finalTaxableSTCG = netST_initial;
            finalTaxableLTCG = netLT_initial;
            netRemainingLoss = 0;
            lossNature = 'none';
        } else if (netST_initial < 0 && netLT_initial >= 0) {
            // Excess Short-Term Loss can offset Long-Term Gain
            const excessSTCL = Math.abs(netST_initial);
            if (excessSTCL <= netLT_initial) {
                finalTaxableSTCG = 0;
                finalTaxableLTCG = netLT_initial - excessSTCL;
                netRemainingLoss = 0;
                lossNature = 'none';
            } else {
                finalTaxableSTCG = 0;
                finalTaxableLTCG = 0;
                netRemainingLoss = excessSTCL - netLT_initial;
                lossNature = 'short-term';
            }
        } else if (netST_initial >= 0 && netLT_initial < 0) {
            // Excess Long-Term Loss can offset Short-Term Gain
            const excessLTCL = Math.abs(netLT_initial);
            if (excessLTCL <= netST_initial) {
                finalTaxableLTCG = 0;
                finalTaxableSTCG = netST_initial - excessLTCL;
                netRemainingLoss = 0;
                lossNature = 'none';
            } else {
                finalTaxableLTCG = 0;
                finalTaxableSTCG = 0;
                netRemainingLoss = excessLTCL - netST_initial;
                lossNature = 'long-term';
            }
        } else {
            // Both are negative!
            finalTaxableSTCG = 0;
            finalTaxableLTCG = 0;
            netRemainingLoss = Math.abs(netST_initial) + Math.abs(netLT_initial);
            lossNature = 'mixed';
        }

        // Step 3: Ordinary Income Deduction ($3,000 IRS Limit)
        const maxOrdinaryDeductionAllowed = country === 'US'
            ? (filingStatus === 'married-separate' ? 1500 : 3000)
            : country === 'UK' ? 0 : 3000;

        const ordinaryIncomeDeduction = Math.min(netRemainingLoss, maxOrdinaryDeductionAllowed);
        const carryforwardToNextYear = netRemainingLoss - ordinaryIncomeDeduction;

        // Step 4: Final Taxes with Harvesting
        const finalStcgTax = finalTaxableSTCG * activeRates.stcg;
        const finalLtcgTax = finalTaxableLTCG * activeRates.ltcg;
        const capitalGainsTaxAfterHarvest = finalStcgTax + finalLtcgTax;

        // Tax saved directly from capital gains reduction
        const capitalGainsTaxSaved = baselineTotalTax - capitalGainsTaxAfterHarvest;

        // Tax saved from ordinary income write-off
        const ordinaryIncomeTaxSaved = ordinaryIncomeDeduction * activeRates.income;

        // Total Net Immediate Tax Savings
        const totalImmediateTaxSavings = capitalGainsTaxSaved + ordinaryIncomeTaxSaved;

        // Effective Tax Savings ROI (% of harvested losses recovered as real tax savings)
        const harvestRoi = harvestedLosses.total > 0
            ? (totalImmediateTaxSavings / harvestedLosses.total) * 100
            : 0;

        return {
            baselineTotalTax,
            finalTaxableSTCG,
            finalTaxableLTCG,
            capitalGainsTaxAfterHarvest,
            capitalGainsTaxSaved,
            ordinaryIncomeDeduction,
            ordinaryIncomeTaxSaved,
            carryforwardToNextYear,
            totalImmediateTaxSavings,
            harvestRoi,
            netST_initial,
            netLT_initial,
            lossNature
        };
    }, [realizedSTCG, realizedLTCG, harvestedLosses, priorCarryforwardST, priorCarryforwardLT, activeRates, country, filingStatus]);

    // Handle Quick Scenario Preset Selection
    const applyPreset = (preset: PresetScenario) => {
        setCountry(preset.country);
        setRealizedSTCG(preset.stcg);
        setRealizedLTCG(preset.ltcg);
        setOrdinaryIncome(preset.ordinaryIncome);
        setPositions(preset.positions);
    };

    // Add Loss Position
    const handleAddPosition = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSymbol.trim() || newLoss <= 0) return;

        const newPos: LossPosition = {
            id: `pos-${Date.now()}`,
            symbol: newSymbol.toUpperCase().trim(),
            type: newType,
            unrealizedLoss: Number(newLoss),
            proxyReplacement: newProxy.trim() || 'Cash / 31-Day Hold'
        };

        setPositions([...positions, newPos]);
        setNewSymbol('');
        setNewLoss(1500);
        setNewProxy('');
    };

    // Remove Loss Position
    const handleRemovePosition = (id: string) => {
        setPositions(positions.filter(p => p.id !== id));
    };

    // Copy Summary to Clipboard
    const copySummary = () => {
        const text = `Tax Loss Harvesting Summary 2026:
• Realized Capital Gains: ${currency}${realizedSTCG.toLocaleString()} STCG | ${currency}${realizedLTCG.toLocaleString()} LTCG
• Total Losses Harvested: ${currency}${harvestedLosses.total.toLocaleString()}
• Taxable Gains Remaining: ${currency}${Math.round(calculation.finalTaxableSTCG).toLocaleString()} STCG | ${currency}${Math.round(calculation.finalTaxableLTCG).toLocaleString()} LTCG
• Total Immediate Tax Savings: ${currency}${Math.round(calculation.totalImmediateTaxSavings).toLocaleString()}
• Ordinary Income Deduction Claimed: ${currency}${Math.round(calculation.ordinaryIncomeDeduction).toLocaleString()}
• Loss Carryforward to Next Year: ${currency}${Math.round(calculation.carryforwardToNextYear).toLocaleString()}
Generated by Trade Journal Tax-Loss Harvesting Calculator (Free)`;

        navigator.clipboard.writeText(text);
        setCopiedSummary(true);
        setTimeout(() => setCopiedSummary(false), 2500);
    };

    // FAQ Items targeting exact user keywords
    const FAQ_ITEMS = [
        {
            q: 'What is a Tax Loss Harvesting Calculator and how does it calculate tax savings?',
            a: 'A Tax Loss Harvesting Calculator calculates how much money you can legally save on your federal and state tax bill by selling securities (stocks, ETFs, mutual funds, or cryptocurrency) at a loss to offset realized taxable capital gains. In the US, short-term losses first offset short-term gains (taxed at up to 37%), long-term losses offset long-term gains (taxed at 0%, 15%, or 20%), and any net excess loss can offset up to $3,000 of ordinary W-2 salary income per year.'
        },
        {
            q: 'How does this free tool compare to the Fidelity Tax Loss Harvesting Calculator or Fidelity Go?',
            a: 'Brokerages like Fidelity, Charles Schwab, and Wealthfront offer automated tax-loss harvesting through robo-advisory accounts (such as Fidelity Go or Wealthfront Automated Investing), but they typically charge an ongoing management fee of 0.25% to 0.40% of your total assets under management (AUM). On a $200,000 portfolio, that is $500 to $800 every year! Our free tax loss harvest calculator lets self-directed investors calculate exact offsetting lots, schedule D netting, and carryover amounts with 0% advisory fees.'
        },
        {
            q: 'How to calculate tax loss harvesting step-by-step for IRS Form 8949 and Schedule D?',
            a: 'To calculate tax loss harvesting: 1) Group your realized gains and losses into Short-Term (held ≤ 1 year) and Long-Term (held > 1 year). 2) Subtract short-term losses from short-term gains, and long-term losses from long-term gains. 3) If one category is positive and the other is negative, cross-net them. 4) If a net loss remains, deduct up to $3,000 ($1,500 if married filing separately) against your ordinary taxable salary. 5) Carry over any leftover loss to next year indefinitely.'
        },
        {
            q: 'What is the 30-Day Wash Sale Rule and how do I avoid disallowance?',
            a: 'Under IRS Section 1091, if you sell a security at a loss and buy a "substantially identical" security within 30 days before or 30 days after the sale (a 61-day window), the tax loss is completely disallowed and added to the cost basis of the new purchase. To stay invested in the market while safely claiming the tax loss, investors buy a "proxy" replacement asset (e.g., selling Vanguard S&P 500 ETF VOO and simultaneously purchasing Vanguard Total Stock Market ETF VTI).'
        },
        {
            q: 'Can cryptocurrency be used for tax loss harvesting without wash sale restrictions?',
            a: 'Historically, IRS Section 1091 wash sale rules specifically applied to "stocks and securities". Because the IRS classified cryptocurrency as property (Notice 2014-21), crypto traders could sell Bitcoin or Ethereum at a loss and immediately buy back minutes later. However, with bipartisan legislative proposals to close the crypto wash-sale loophole, tax professionals strongly recommend either waiting 31 days or rotating into correlated crypto proxies to protect against IRS audit challenges.'
        },
        {
            q: 'What happens if my capital losses exceed $3,000 in a single tax year?',
            a: 'Any net capital loss beyond the annual $3,000 ordinary income deduction limit does NOT expire. It rolls over into the subsequent tax year as a "Capital Loss Carryforward" (reported on Line 6 & Line 14 of IRS Schedule D). You can carry forward unused capital losses indefinitely until they are completely exhausted by future gains or future $3,000 annual income offsets.'
        }
    ];

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} pb-16`}>
            {/* SEO Metadata targeting US / UK international keywords */}
            <Helmet>
                <title>Tax Loss Harvesting Calculator (Free) – Calculate Tax Savings & Capital Gains Offset 2026 | Fidelity Alternative</title>
                <meta
                    name="description"
                    content="Free tax loss harvesting calculator to calculate tax loss harvesting, offset short & long-term capital gains, deduct up to $3,000 on IRS Form 1040, and avoid 30-day wash sales without paying Fidelity robo-advisor fees."
                />
                <meta
                    name="keywords"
                    content="tax loss harvesting calculator, fidelity tax loss harvesting calculator, calculate tax loss harvesting, how to calculate tax loss harvesting, tax loss harvest calculator, tax-loss harvesting calculator, capital gains offset calculator, wash sale rule tax harvesting, IRS schedule D loss deduction"
                />
                <link rel="canonical" href="https://sanjayoraon-art.github.io/tradejournall/tools/tax-loss-harvesting-calculator" />

                {/* Structured Data Schema */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@graph': [
                            {
                                '@type': 'SoftwareApplication',
                                name: 'Tax Loss Harvesting Calculator',
                                operatingSystem: 'All',
                                applicationCategory: 'FinanceApplication',
                                offers: {
                                    '@type': 'Offer',
                                    price: '0.00',
                                    priceCurrency: 'USD'
                                },
                                description: 'Free web calculator to calculate tax-loss harvesting, capital gains offsets, IRS $3,000 salary deductions, and wash sale compliant ETF swaps.'
                            },
                            {
                                '@type': 'FAQPage',
                                mainEntity: FAQ_ITEMS.map(item => ({
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
                                className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
                                title="Back to Dashboard"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        <div className="flex items-center space-x-2">
                            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                                <Scale className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                                    Tax Loss Harvesting Calculator
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                        IRS 2026 Ready
                                    </span>
                                </h1>
                                <p className="text-xs text-slate-400 hidden sm:block">
                                    Calculate tax savings, capital gains offset, and $3,000 salary deduction
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={copySummary}
                            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
                        >
                            {copiedSummary ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
                        </button>
                        {onNavigateToWashSale && (
                            <button
                                onClick={onNavigateToWashSale}
                                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
                            >
                                <AlertTriangle className="w-4 h-4" />
                                <span className="hidden sm:inline">Wash Sale Checker</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Sub Navigation Tabs */}
                <div className="max-w-7xl mx-auto mt-3 flex space-x-2 overflow-x-auto pb-1 text-xs">
                    {[
                        { id: 'calculator', label: 'Calculator & Simulator', icon: Calculator },
                        { id: 'how-it-works', label: 'How to Calculate (Formula)', icon: BookOpen },
                        { id: 'fidelity-vs-diy', label: 'Fidelity vs DIY Harvesting', icon: Landmark },
                        { id: 'wash-sale-rules', label: 'Wash Sale & ETF Swaps', icon: ShieldAlert },
                        { id: 'faq', label: 'IRS Rules & FAQ', icon: HelpCircle }
                    ].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                                    isActive
                                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">

                {/* 1. CALCULATOR & SIMULATOR TAB */}
                {activeTab === 'calculator' && (
                    <div className="space-y-6">

                        {/* Top One-Click Scenario Presets */}
                        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                                        Quick 1-Click Investor Scenarios
                                    </span>
                                </div>
                                <span className="text-[11px] text-slate-400">Select to auto-populate</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {PRESET_SCENARIOS.map(preset => (
                                    <button
                                        key={preset.id}
                                        onClick={() => applyPreset(preset)}
                                        className="text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 hover:border-emerald-500/40 transition-all group"
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
                                                {preset.title}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                                            {preset.description}
                                        </p>
                                        <div className="flex items-center justify-between text-[10px]">
                                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                                                {preset.country} Rules
                                            </span>
                                            <span className="text-emerald-400 font-medium">Load Preset →</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Two Column Grid: Inputs vs Results */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                            {/* Left Column: Form & Portfolio Lots (7 Cols) */}
                            <div className="lg:col-span-7 space-y-6">

                                {/* Tax Jurisdiction & Filing Status */}
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                                            <Landmark className="w-4 h-4 text-emerald-400" />
                                            1. Tax Jurisdiction & Income Profile
                                        </h2>
                                        <span className="text-xs text-slate-400">Schedule D / Form 8949</span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                                Tax Country
                                            </label>
                                            <select
                                                value={country}
                                                onChange={(e) => setCountry(e.target.value as any)}
                                                className={`w-full px-3 py-2 text-xs rounded-lg border ${theme.input} focus:outline-none focus:ring-1 focus:ring-emerald-500`}
                                            >
                                                <option value="US">🇺🇸 United States (IRS)</option>
                                                <option value="UK">🇬🇧 United Kingdom (HMRC)</option>
                                                <option value="GLOBAL">🌐 Global / Custom Flat</option>
                                            </select>
                                        </div>

                                        {country === 'US' ? (
                                            <div>
                                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                                    IRS Filing Status
                                                </label>
                                                <select
                                                    value={filingStatus}
                                                    onChange={(e) => setFilingStatus(e.target.value as any)}
                                                    className={`w-full px-3 py-2 text-xs rounded-lg border ${theme.input} focus:outline-none focus:ring-1 focus:ring-emerald-500`}
                                                >
                                                    <option value="single">Single Filer</option>
                                                    <option value="married-joint">Married Filing Jointly</option>
                                                    <option value="married-separate">Married Filing Separately</option>
                                                    <option value="head-household">Head of Household</option>
                                                </select>
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                                    Tax Regime
                                                </label>
                                                <input
                                                    type="text"
                                                    disabled
                                                    value={country === 'UK' ? 'HMRC Capital Gains' : 'Custom Rates'}
                                                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-800 bg-slate-950 text-slate-400"
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-xs font-medium text-slate-300 mb-1">
                                                Annual W-2 / Salary Income
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-2.5 top-2 text-xs text-slate-400">{currency}</span>
                                                <input
                                                    type="number"
                                                    value={ordinaryIncome}
                                                    onChange={(e) => setOrdinaryIncome(Math.max(0, Number(e.target.value)))}
                                                    className={`w-full pl-6 pr-3 py-2 text-xs rounded-lg border ${theme.input} focus:outline-none focus:ring-1 focus:ring-emerald-500`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Estimated Bracket Display */}
                                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-wrap items-center justify-between text-xs gap-2">
                                        <div className="flex items-center space-x-2">
                                            <Percent className="w-3.5 h-3.5 text-blue-400" />
                                            <span className="text-slate-400">Effective Tax Rates:</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-[11px]">
                                            <span className="text-slate-300">
                                                STCG Rate: <strong className="text-emerald-400">{(activeRates.stcg * 100).toFixed(1)}%</strong>
                                            </span>
                                            <span className="text-slate-500">|</span>
                                            <span className="text-slate-300">
                                                LTCG Rate: <strong className="text-blue-400">{(activeRates.ltcg * 100).toFixed(1)}%</strong>
                                            </span>
                                            <span className="text-slate-500">|</span>
                                            <span className="text-slate-300">
                                                Salary Bracket: <strong className="text-amber-400">{(activeRates.income * 100).toFixed(1)}%</strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Realized Capital Gains Input */}
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-emerald-400" />
                                            2. Realized Capital Gains (Already Locked-in This Year)
                                        </h2>
                                        <span className="text-xs text-slate-400">Target to Offset</span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <label className="text-xs font-medium text-slate-300">
                                                    Short-Term Realized Gains (STCG)
                                                </label>
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300">
                                                    Held ≤ 1 Year
                                                </span>
                                            </div>
                                            <div className="relative">
                                                <span className="absolute left-2.5 top-2 text-xs text-slate-400">{currency}</span>
                                                <input
                                                    type="number"
                                                    value={realizedSTCG}
                                                    onChange={(e) => setRealizedSTCG(Math.max(0, Number(e.target.value)))}
                                                    className={`w-full pl-6 pr-3 py-2 text-xs rounded-lg border ${theme.input} focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono`}
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-1">
                                                Taxed at high ordinary income rate (up to 37%)
                                            </p>
                                        </div>

                                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <label className="text-xs font-medium text-slate-300">
                                                    Long-Term Realized Gains (LTCG)
                                                </label>
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300">
                                                    Held &gt; 1 Year
                                                </span>
                                            </div>
                                            <div className="relative">
                                                <span className="absolute left-2.5 top-2 text-xs text-slate-400">{currency}</span>
                                                <input
                                                    type="number"
                                                    value={realizedLTCG}
                                                    onChange={(e) => setRealizedLTCG(Math.max(0, Number(e.target.value)))}
                                                    className={`w-full pl-6 pr-3 py-2 text-xs rounded-lg border ${theme.input} focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono`}
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-1">
                                                Taxed at preferential long-term rate (0%, 15%, 20%)
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Positions to Harvest (Unrealized Losses) */}
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                        <div className="flex items-center space-x-2">
                                            <TrendingDown className="w-4 h-4 text-rose-400" />
                                            <h2 className="text-sm font-semibold text-white">
                                                3. Portfolio Positions with Unrealized Losses to Harvest
                                            </h2>
                                        </div>
                                        <span className="text-xs text-rose-400 font-semibold">
                                            Total: -{currency}{harvestedLosses.total.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Existing Positions List */}
                                    <div className="space-y-2.5">
                                        {positions.map((pos) => (
                                            <div
                                                key={pos.id}
                                                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center font-bold text-rose-400 text-xs">
                                                        {pos.symbol.substring(0, 4)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-xs font-bold text-white">{pos.symbol}</span>
                                                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                                                                pos.type === 'short-term'
                                                                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                                                    : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                                                            }`}>
                                                                {pos.type === 'short-term' ? 'ST Loss (< 1yr)' : 'LT Loss (> 1yr)'}
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                            <span>Swap Proxy:</span>
                                                            <strong className="text-slate-300">{pos.proxyReplacement}</strong>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-4 self-end sm:self-center">
                                                    <div className="text-right">
                                                        <span className="text-xs font-bold font-mono text-rose-400">
                                                            -{currency}{pos.unrealizedLoss.toLocaleString()}
                                                        </span>
                                                        <p className="text-[10px] text-slate-500">Unrealized Loss</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemovePosition(pos.id)}
                                                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                                                        title="Remove position"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add New Position Form */}
                                    <form onSubmit={handleAddPosition} className="p-3.5 rounded-xl bg-slate-950/80 border border-dashed border-slate-800 space-y-3">
                                        <div className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                                            <Plus className="w-3.5 h-3.5 text-emerald-400" />
                                            <span>Add Another Loss Position to Harvest</span>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                            <div>
                                                <label className="block text-[10px] text-slate-400 mb-1">Ticker / Symbol</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. NVDA"
                                                    value={newSymbol}
                                                    onChange={(e) => setNewSymbol(e.target.value)}
                                                    className={`w-full px-2.5 py-1.5 text-xs rounded-lg border ${theme.input} focus:outline-none`}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-slate-400 mb-1">Holding Period</label>
                                                <select
                                                    value={newType}
                                                    onChange={(e) => setNewType(e.target.value as any)}
                                                    className={`w-full px-2.5 py-1.5 text-xs rounded-lg border ${theme.input} focus:outline-none`}
                                                >
                                                    <option value="short-term">Short-Term (≤1 Yr)</option>
                                                    <option value="long-term">Long-Term (&gt;1 Yr)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-slate-400 mb-1">Loss Amount ({currency})</label>
                                                <input
                                                    type="number"
                                                    placeholder="2000"
                                                    value={newLoss}
                                                    onChange={(e) => setNewLoss(Math.max(0, Number(e.target.value)))}
                                                    className={`w-full px-2.5 py-1.5 text-xs rounded-lg border ${theme.input} focus:outline-none font-mono`}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-slate-400 mb-1">Replacement Proxy</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. VTI / SMH"
                                                    value={newProxy}
                                                    onChange={(e) => setNewProxy(e.target.value)}
                                                    className={`w-full px-2.5 py-1.5 text-xs rounded-lg border ${theme.input} focus:outline-none`}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end pt-1">
                                            <button
                                                type="submit"
                                                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                                            >
                                                + Add Position to Harvest
                                            </button>
                                        </div>
                                    </form>
                                </div>

                            </div>

                            {/* Right Column: Calculated Results & Tax Savings Cards (5 Cols) */}
                            <div className="lg:col-span-5 space-y-5">

                                {/* Main Highlight Result Card */}
                                <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden shadow-xl shadow-emerald-950/20">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                                            <Sparkles className="w-4 h-4" />
                                            Estimated Total Tax Savings
                                        </span>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                                            {calculation.harvestRoi.toFixed(0)}% ROI
                                        </span>
                                    </div>

                                    <div className="my-3">
                                        <span className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
                                            {currency}{Math.round(calculation.totalImmediateTaxSavings).toLocaleString()}
                                        </span>
                                        <p className="text-xs text-slate-300 mt-1">
                                            Direct cash retained in your pocket this tax year
                                        </p>
                                    </div>

                                    {/* Breakdown Mini Cards */}
                                    <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-800/80">
                                        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                                            <span className="text-[10px] text-slate-400 block">Cap Gains Tax Saved</span>
                                            <span className="text-sm font-bold text-emerald-400 font-mono">
                                                +{currency}{Math.round(calculation.capitalGainsTaxSaved).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                                            <span className="text-[10px] text-slate-400 block">Salary Deduction Saved</span>
                                            <span className="text-sm font-bold text-amber-400 font-mono">
                                                +{currency}{Math.round(calculation.ordinaryIncomeTaxSaved).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* IRS Schedule D Netting Breakdown */}
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3.5">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-2.5">
                                        <Scale className="w-4 h-4 text-blue-400" />
                                        IRS Schedule D Capital Gains Netting Order
                                    </h3>

                                    <div className="space-y-2 text-xs">
                                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950">
                                            <span className="text-slate-400">Original Realized STCG</span>
                                            <span className="font-mono text-slate-200">{currency}{realizedSTCG.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950">
                                            <span className="text-slate-400">Harvested STCL Offset</span>
                                            <span className="font-mono text-rose-400">-{currency}{harvestedLosses.stcl.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/90 font-medium border border-slate-800">
                                            <span className="text-slate-300">Remaining Taxable STCG</span>
                                            <span className="font-mono font-bold text-white">{currency}{Math.round(calculation.finalTaxableSTCG).toLocaleString()}</span>
                                        </div>

                                        <div className="pt-2 border-t border-slate-800/80"></div>

                                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950">
                                            <span className="text-slate-400">Original Realized LTCG</span>
                                            <span className="font-mono text-slate-200">{currency}{realizedLTCG.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950">
                                            <span className="text-slate-400">Harvested LTCL Offset</span>
                                            <span className="font-mono text-rose-400">-{currency}{harvestedLosses.ltcl.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/90 font-medium border border-slate-800">
                                            <span className="text-slate-300">Remaining Taxable LTCG</span>
                                            <span className="font-mono font-bold text-white">{currency}{Math.round(calculation.finalTaxableLTCG).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Ordinary Income Write-off & Carryforward */}
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-2.5">
                                        <Landmark className="w-4 h-4 text-amber-400" />
                                        $3,000 Ordinary Income Offset & Carryforward
                                    </h3>

                                    <div className="space-y-2.5 text-xs">
                                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                                            <div>
                                                <span className="font-semibold text-white block">Income Deduction Claimed</span>
                                                <span className="text-[11px] text-slate-400">
                                                    Offsets W-2 / 1099 salary income
                                                </span>
                                            </div>
                                            <span className="text-sm font-bold font-mono text-amber-400">
                                                {currency}{Math.round(calculation.ordinaryIncomeDeduction).toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                                            <div>
                                                <span className="font-semibold text-white block">Loss Carryforward to 2027</span>
                                                <span className="text-[11px] text-slate-400">
                                                    Does not expire, offsets future gains
                                                </span>
                                            </div>
                                            <span className="text-sm font-bold font-mono text-blue-400">
                                                {currency}{Math.round(calculation.carryforwardToNextYear).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Wash Sale Caution Box */}
                                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                                    <div className="flex items-center space-x-2 text-amber-400">
                                        <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                                        <h4 className="text-xs font-bold uppercase tracking-wider">
                                            IRS Section 1091 Wash Sale Caution
                                        </h4>
                                    </div>
                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                        Do not buy back the same asset within <strong>30 days before or after</strong> the sale. If you do, your entire tax deduction will be disallowed by the IRS. Rotate into the suggested proxy ETFs to maintain your market exposure safely.
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>
                )}

                {/* 2. HOW TO CALCULATE TAB */}
                {activeTab === 'how-it-works' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                                How to Calculate Tax Loss Harvesting: Step-by-Step Formula
                            </h2>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Tax-loss harvesting is a legal wealth preservation strategy recognized under IRS Code § 1211 and § 1222. Here is the exact mathematical order of operations used by certified CPAs and automated wealth managers.
                            </p>
                        </div>

                        {/* Step 1 to 5 Workflow */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                                    1
                                </div>
                                <h3 className="text-sm font-bold text-white">Segregate Holding Periods</h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Divide all realized gains and unrealized losses into Short-Term (assets held for 1 year or less) and Long-Term (assets held for more than 1 year).
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                                    2
                                </div>
                                <h3 className="text-sm font-bold text-white">Intra-Category Netting</h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Short-term losses first reduce short-term capital gains (which are taxed at ordinary income rates up to 37%). Long-term losses reduce long-term gains (0%, 15%, or 20%).
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                                    3
                                </div>
                                <h3 className="text-sm font-bold text-white">Cross-Category Netting</h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    If one category produces a net loss while the other produces a net gain, the excess loss offsets the remaining gain from the other category.
                                </p>
                            </div>
                        </div>

                        {/* Mathematical Formulas Card */}
                        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                                Official IRS Capital Gains Netting Formulas
                            </h3>
                            <div className="space-y-3 font-mono text-xs text-slate-300">
                                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                                    <strong className="text-emerald-400">Net Short-Term Capital Gain/Loss:</strong>
                                    <p className="mt-1 text-slate-300">Net ST = Realized STCG - (Harvested STCL + Prior ST Carryforward)</p>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                                    <strong className="text-blue-400">Net Long-Term Capital Gain/Loss:</strong>
                                    <p className="mt-1 text-slate-300">Net LT = Realized LTCG - (Harvested LTCL + Prior LT Carryforward)</p>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                                    <strong className="text-amber-400">Annual Ordinary Income Deduction (IRS § 1211(b)):</strong>
                                    <p className="mt-1 text-slate-300">Ordinary Deduction = min(Remaining Net Capital Loss, $3,000)</p>
                                </div>
                                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                                    <strong className="text-purple-400">Loss Carryforward (Schedule D Line 16):</strong>
                                    <p className="mt-1 text-slate-300">Carryforward = Remaining Net Capital Loss - Ordinary Deduction</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. FIDELITY VS DIY TAB */}
                {activeTab === 'fidelity-vs-diy' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8">
                        <div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Fidelity Tax Loss Harvesting Calculator Alternative
                            </span>
                            <h2 className="text-xl sm:text-2xl font-bold text-white mt-2 mb-2">
                                Fidelity & Robo-Advisors vs Free Self-Directed Harvesting
                            </h2>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Many retail traders ask: <em>&ldquo;Does Fidelity have a free tax loss harvesting calculator?&rdquo;</em> Fidelity offers tax-loss harvesting only through Fidelity Managed FidFolios® or Fidelity Go, which charge recurring annual management fees.
                            </p>
                        </div>

                        {/* Comparison Matrix Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 bg-slate-950 text-slate-300">
                                        <th className="p-3.5 font-semibold">Feature / Metric</th>
                                        <th className="p-3.5 font-semibold text-emerald-400">Our Free Calculator (DIY)</th>
                                        <th className="p-3.5 font-semibold text-slate-400">Fidelity FidFolios / Go</th>
                                        <th className="p-3.5 font-semibold text-slate-400">Wealthfront / Betterment</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 text-slate-300">
                                    <tr>
                                        <td className="p-3.5 font-medium text-white">Annual Advisory Fee</td>
                                        <td className="p-3.5 text-emerald-400 font-bold font-mono">0.00% (Free Forever)</td>
                                        <td className="p-3.5 font-mono text-rose-400">0.40% AUM / year</td>
                                        <td className="p-3.5 font-mono text-rose-400">0.25% AUM / year</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-medium text-white">Fee on $200k Portfolio</td>
                                        <td className="p-3.5 text-emerald-400 font-bold font-mono">$0 / year</td>
                                        <td className="p-3.5 font-mono text-rose-400">$800 every year</td>
                                        <td className="p-3.5 font-mono text-rose-400">$500 every year</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-medium text-white">Account Minimum</td>
                                        <td className="p-3.5 text-emerald-400 font-bold">$0 (No account needed)</td>
                                        <td className="p-3.5 text-slate-400">$5,000</td>
                                        <td className="p-3.5 text-slate-400">$500</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-medium text-white">Crypto Tax Harvesting</td>
                                        <td className="p-3.5 text-emerald-400 font-bold">Yes (BTC, ETH, Altcoins)</td>
                                        <td className="p-3.5 text-slate-500">No</td>
                                        <td className="p-3.5 text-slate-500">Limited</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-medium text-white">Custom Proxy Selection</td>
                                        <td className="p-3.5 text-emerald-400 font-bold">100% Control</td>
                                        <td className="p-3.5 text-slate-400">Algorithm decides</td>
                                        <td className="p-3.5 text-slate-400">Algorithm decides</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Fee Drag Simulation */}
                        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-400" />
                                Why Paying 0.40% for Automated Harvesting May Backfire
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                In bull market years with few unrealized losses, a 0.40% management fee continues to be deducted from your portfolio balance even when zero tax-loss harvesting occurs. By calculating your losses yourself in late November or December, you save both taxes AND management fees.
                            </p>
                        </div>
                    </div>
                )}

                {/* 4. WASH SALE & ETF SWAP TAB */}
                {activeTab === 'wash-sale-rules' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                                The 30-Day Wash Sale Trap & Safe ETF Replacement Pairs
                            </h2>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Under IRS Code Section 1091, you cannot harvest a tax loss and purchase a <em>substantially identical</em> security within a 61-day window (30 days before sale, day of sale, 30 days after sale). Here are legal, tax-compliant replacement pairs to maintain your market exposure:
                            </p>
                        </div>

                        {/* Replacement Pairs Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 bg-slate-950 text-slate-300">
                                        <th className="p-3.5 font-semibold">Security Sold at a Loss</th>
                                        <th className="p-3.5 font-semibold text-rose-400">DO NOT Buy (Wash Sale Trap)</th>
                                        <th className="p-3.5 font-semibold text-emerald-400">SAFE Replacement ETF</th>
                                        <th className="p-3.5 font-semibold">Underlying Rationale</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 text-slate-300">
                                    <tr>
                                        <td className="p-3.5 font-bold text-white">VOO (Vanguard S&P 500)</td>
                                        <td className="p-3.5 text-rose-400 font-mono">SPY, IVV (Tracks same index)</td>
                                        <td className="p-3.5 text-emerald-400 font-bold font-mono">VTI / SCHX / IWB</td>
                                        <td className="p-3.5 text-slate-400">Total Stock Market vs S&P 500 (Different index)</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-bold text-white">QQQ (Invesco Nasdaq 100)</td>
                                        <td className="p-3.5 text-rose-400 font-mono">QQQM (Substantially identical)</td>
                                        <td className="p-3.5 text-emerald-400 font-bold font-mono">VUG / SCHG / XLK</td>
                                        <td className="p-3.5 text-slate-400">Large-Cap Growth vs Tech-heavy Nasdaq</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-bold text-white">NVDA (Nvidia Corp)</td>
                                        <td className="p-3.5 text-rose-400 font-mono">NVDA Calls / Leveraged NVDA</td>
                                        <td className="p-3.5 text-emerald-400 font-bold font-mono">SMH / SOXX (Semiconductor ETF)</td>
                                        <td className="p-3.5 text-slate-400">Basket ETF containing Nvidia + AMD + TSMC</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-bold text-white">TSLA (Tesla Motors)</td>
                                        <td className="p-3.5 text-rose-400 font-mono">TSLA in IRA / spouse account</td>
                                        <td className="p-3.5 text-emerald-400 font-bold font-mono">DRIV / QCLN / XLY</td>
                                        <td className="p-3.5 text-slate-400">EV & Consumer Discretionary ETF proxy</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {onNavigateToWashSale && (
                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <span className="text-xs font-bold text-white">Need to check a specific trade date?</span>
                                    <p className="text-[11px] text-slate-400">Use our dedicated 61-day wash sale window calendar calculator.</p>
                                </div>
                                <button
                                    onClick={onNavigateToWashSale}
                                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                                >
                                    Open Wash Sale Rule Calculator →
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* 5. FAQ & IRS RULES TAB */}
                {activeTab === 'faq' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                                Frequently Asked Questions: Tax Loss Harvesting Calculator
                            </h2>
                            <p className="text-sm text-slate-400">
                                Answers to the most common tax questions for US and international equity investors.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {FAQ_ITEMS.map((item, idx) => {
                                const isOpen = openFaqIndex === idx;
                                return (
                                    <div
                                        key={idx}
                                        className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden transition-colors"
                                    >
                                        <button
                                            onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                            className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-emerald-400 transition-colors"
                                        >
                                            <span>{item.q}</span>
                                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
                                        </button>
                                        {isOpen && (
                                            <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                                                {item.a}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Bottom Cross-Linking Tools Registry */}
                <div className="mt-12">
                    <RelatedToolsGrid
                        currentToolSlug="/tools/tax-loss-harvesting-calculator"
                        category="tax"
                    />
                </div>

            </div>
        </div>
    );
};
