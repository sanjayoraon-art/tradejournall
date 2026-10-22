import React, { useState } from 'react';
import {
    LucideIcon,
    ShieldAlert,
    Scale,
    TrendingDown,
    TrendingUp,
    RefreshCw,
    BarChart3,
    Flame,
    PieChart,
    Coins,
    Award,
    Calculator,
    Percent,
    Clock,
    Zap,
    ChevronDown,
    ChevronUp,
    Sparkles,
    ArrowRight,
    Grid,
    Car
} from 'lucide-react';

export interface ToolItem {
    id: string;
    title: string;
    path: string;
    category: 'risk' | 'prop-firm' | 'options' | 'crypto' | 'forex' | 'tax';
    categoryLabel: string;
    badge: string;
    badgeColor: 'rose' | 'emerald' | 'amber' | 'purple' | 'cyan' | 'blue';
    description: string;
    icon: LucideIcon;
}

export const ALL_TOOLS_REGISTRY: ToolItem[] = [
    {
        id: 'free-trading-journal',
        title: 'Free Trading Journal & Performance Analytics',
        path: '/tools/free-trading-journal',
        category: 'risk',
        categoryLabel: 'Core Platform',
        badge: '100% FREE FOREVER',
        badgeColor: 'emerald',
        description: 'The #1 free trading journal software for stocks, crypto, forex, and futures. Automated P&L tracking, win rate analytics, and psychology mistake tagging.',
        icon: Sparkles
    },
    {
        id: 'dividend-snowball',
        title: 'Dividend Snowball & DRIP FIRE Calculator',
        path: '/tools/dividend-snowball-calculator',
        category: 'crypto',
        categoryLabel: 'Dividend Wealth',
        badge: 'SCHD & DRIP KD 22',
        badgeColor: 'emerald',
        description: 'Simulate exponential dividend snowball growth, DRIP compounding, SCHD ETF yield on cost (YOC), and FIRE milestone dates.',
        icon: TrendingUp
    },
    {
        id: 'futures-position-size',
        title: 'Futures Position Size Calculator (Free)',
        path: '/tools/futures-position-size-calculator',
        category: 'risk',
        categoryLabel: 'Futures Risk',
        badge: 'ES, NQ, Gold KD 29',
        badgeColor: 'cyan',
        description: 'Calculate exact contract quantities for E-mini ES, Nasdaq NQ, Micro MES/MNQ, and Gold futures with tick-based risk budgets.',
        icon: Scale
    },
    {
        id: 'dca-calc',
        title: 'Dollar-Cost Averaging (DCA) Calculator',
        path: '/tools/dca-calculator',
        category: 'crypto',
        categoryLabel: 'Wealth & Accumulation',
        badge: 'Bitcoin & Stocks KD 0%',
        badgeColor: 'emerald',
        description: 'Simulate recurring DCA growth for Bitcoin, crypto, and stocks, track multi-buy average entry price including fees, and export CSV.',
        icon: TrendingUp
    },
    {
        id: 'risk-of-ruin',
        title: 'Risk of Ruin Calculator (Monte Carlo)',
        path: '/tools/risk-of-ruin-calculator',
        category: 'risk',
        categoryLabel: 'Capital Protection',
        badge: 'Monte Carlo KD 8%',
        badgeColor: 'rose',
        description: 'Simulate 150 equity curve paths, Ralph Vince ruin formulas, and Primedope poker continuous variance models.',
        icon: ShieldAlert
    },
    {
        id: 'tax-loss-harvesting',
        title: 'Tax Loss Harvesting Calculator (IRS 2026)',
        path: '/tools/tax-loss-harvesting-calculator',
        category: 'tax',
        categoryLabel: 'Tax Strategy',
        badge: 'Fidelity Alternative KD 28',
        badgeColor: 'emerald',
        description: 'Calculate capital gains tax savings, offset short/long term gains, claim $3,000 IRS ordinary income write-offs, and track wash-sale safe ETF swaps.',
        icon: Scale
    },
    {
        id: 'doordash-tax-calculator',
        title: 'DoorDash Tax Calculator & 1099 Mileage App',
        path: '/tools/doordash-tax-calculator',
        category: 'tax',
        categoryLabel: '1099 Gig Tax',
        badge: 'IRS 67¢ Mileage Rate',
        badgeColor: 'rose',
        description: 'Calculate 15.3% self-employment tax, 2026 IRS 67¢/mile deductions, Schedule C net profit, and Form 1040-ES quarterly payments.',
        icon: Car
    },
    {
        id: 'wash-sale',
        title: 'Wash Sale Rule Calculator (IRS § 1091)',
        path: '/tools/wash-sale-calculator',
        category: 'tax',
        categoryLabel: 'Tax Compliance',
        badge: 'IRS 61-Day Window',
        badgeColor: 'emerald',
        description: 'Track disallowed losses, adjusted cost basis, Form 8949 compliance, and the 61-day wash sale window calendar.',
        icon: Scale
    },
    {
        id: 'drawdown-recovery',
        title: 'Drawdown Recovery & Compounding Calculator',
        path: '/tools/drawdown-recovery-calculator',
        category: 'risk',
        categoryLabel: 'Drawdown Math',
        badge: 'Asymmetric Loss Math',
        badgeColor: 'purple',
        description: 'Calculate the required gain % to recover from trading losses and project compound equity curve growth.',
        icon: TrendingDown
    },
    {
        id: 'risk-reward',
        title: 'Risk Reward & Win Rate Matrix Calculator',
        path: '/tools/risk-reward-win-rate-matrix',
        category: 'risk',
        categoryLabel: 'Expectancy',
        badge: 'Breakeven Win Rate',
        badgeColor: 'blue',
        description: 'Interactive heat-map matrix of R:R ratios versus required win rates and mathematical trade expectancy in R.',
        icon: BarChart3
    },
    {
        id: 'prop-firm',
        title: 'Prop Firm Challenge Drawdown & Lot Calculator',
        path: '/tools/prop-firm-challenge-calculator',
        category: 'prop-firm',
        categoryLabel: 'Evaluation Rules',
        badge: 'FTMO & Funding Pips',
        badgeColor: 'amber',
        description: 'Calculate safe position sizes to comply with 5% max daily loss limits and 10% maximum trailing drawdown rules.',
        icon: Award
    },
    {
        id: 'apex-consistency',
        title: 'Apex & Topstep Consistency Rule Calculator',
        path: '/tools/apex-consistency-rule-calculator',
        category: 'prop-firm',
        categoryLabel: 'Payout Rules',
        badge: '30% Profit Cap Rule',
        badgeColor: 'amber',
        description: 'Verify 30% single-day profit cap compliance and avoid account disqualification before requesting payouts.',
        icon: Flame
    },
    {
        id: 'prop-firm-payout',
        title: 'Prop Firm Profit Split & Net Payout Calculator',
        path: '/tools/prop-firm-profit-split-payout-calculator',
        category: 'prop-firm',
        categoryLabel: 'Payout Analytics',
        badge: '80/20 & 90/10 Splits',
        badgeColor: 'emerald',
        description: 'Compute your net cash payout after performance fees, performance split tiers, and local income tax withholding.',
        icon: Coins
    },
    {
        id: 'prop-firm-scaling',
        title: 'Prop Firm Scaling Plan & Growth Roadmap',
        path: '/tools/prop-firm-scaling-plan-calculator',
        category: 'prop-firm',
        categoryLabel: 'Capital Scaling',
        badge: '$100K to $2M Plan',
        badgeColor: 'cyan',
        description: 'Forecast account balance milestones, profit targets, and capital doubling timelines across funded trader scaling plans.',
        icon: TrendingUp
    },
    {
        id: 'forex-swap',
        title: 'Forex Swap Fee & Overnight Rollover Calculator',
        path: '/tools/forex-swap-fee-calculator',
        category: 'forex',
        categoryLabel: 'Forex Financing',
        badge: 'Triple Swap Wednesday',
        badgeColor: 'amber',
        description: 'Calculate holding costs, long/short rollover points, interest rate differentials, and Islamic swap-free rules.',
        icon: RefreshCw
    },
    {
        id: 'leverage-danger',
        title: 'Leverage Danger & Margin Call Calculator',
        path: '/tools/leverage-danger-calculator',
        category: 'risk',
        categoryLabel: 'Margin Safety',
        badge: '10x to 100x Danger',
        badgeColor: 'rose',
        description: 'Visual liquidation buffer calculator showing how high leverage rapidly evaporates account equity.',
        icon: Zap
    },
    {
        id: 'cross-vs-isolated',
        title: 'Cross vs Isolated Margin Liquidation Calculator',
        path: '/tools/cross-vs-isolated-margin-calculator',
        category: 'crypto',
        categoryLabel: 'Futures Margin',
        badge: 'Binance & Bybit',
        badgeColor: 'purple',
        description: 'Compare wallet blowout risks between Cross Margin and Isolated Margin modes across high-volatility pairs.',
        icon: Calculator
    },
    {
        id: 'isolated-margin',
        title: 'Isolated Margin Calculator (Binance & Bybit)',
        path: '/tools/isolated-margin-calculator',
        category: 'crypto',
        categoryLabel: 'Futures Margin',
        badge: 'Isolated Risk',
        badgeColor: 'purple',
        description: 'Calculate isolated position liquidation price and maintenance margin buffer to protect wallet equity.',
        icon: Scale
    },
    {
        id: 'crypto-funding',
        title: 'Crypto Funding Rate APR & Arbitrage Calculator',
        path: '/tools/crypto-funding-rate-calculator',
        category: 'crypto',
        categoryLabel: 'Funding Yields',
        badge: '8-Hour Funding APR',
        badgeColor: 'cyan',
        description: 'Compute annualized yields (APR/APY) from perpetual swap funding rates and delta-neutral cash-and-carry trades.',
        icon: Percent
    },
    {
        id: 'crypto-profit',
        title: 'Crypto Profit, Tax & Exit Ladder Calculator',
        path: '/tools/crypto-profit-calculator',
        category: 'crypto',
        categoryLabel: 'Take-Profit Ladder',
        badge: 'Staged Profit Targets',
        badgeColor: 'emerald',
        description: 'Plan stepped limit exit orders, calculate weighted average selling price, and factor in net profit after fees.',
        icon: PieChart
    },
    {
        id: 'crypto-profit-ladder',
        title: 'Crypto Profit Exit Ladder Calculator',
        path: '/tools/crypto-profit-exit-ladder-calculator',
        category: 'crypto',
        categoryLabel: 'Take-Profit Ladder',
        badge: 'DCA Out Plan',
        badgeColor: 'emerald',
        description: 'Model multi-tier take-profit exit orders and staged scaling targets to eliminate bull market FOMO.',
        icon: TrendingUp
    },
    {
        id: 'iron-condor',
        title: 'Iron Condor Max Loss & Breakeven Calculator',
        path: '/tools/iron-condor-calculator',
        category: 'options',
        categoryLabel: 'Option Strategies',
        badge: '4-Leg Option Spread',
        badgeColor: 'blue',
        description: 'Calculate net credit collected, upper & lower breakeven points, margin requirement, and maximum risk for Iron Condors.',
        icon: BarChart3
    },
    {
        id: 'option-theta',
        title: 'Option Buying Theta Decay & 0DTE Calculator',
        path: '/tools/0dte-option-profit-calculator',
        category: 'options',
        categoryLabel: 'Option Greeks',
        badge: '0DTE Intraday Decay',
        badgeColor: 'rose',
        description: 'Model hourly time-decay speed, theta acceleration near expiration, and intrinsic vs extrinsic value degradation.',
        icon: Clock
    },
    {
        id: 'pcr-sentiment',
        title: 'Nifty & BankNifty PCR Sentiment Bias Gauge',
        path: '/tools/nifty-pcr-calculator',
        category: 'options',
        categoryLabel: 'Market Sentiment',
        badge: 'Put-Call Ratio (OI)',
        badgeColor: 'purple',
        description: 'Decode open interest sentiment extremes: oversold reversals, bull rallies, and extreme put-call ratio zones.',
        icon: BarChart3
    },
    {
        id: 'revenge-cooldown',
        title: 'Revenge Trade Cooldown Clock & Reset Timer',
        path: '/tools/revenge-trading-cooldown',
        category: 'risk',
        categoryLabel: 'Trading Psychology',
        badge: 'Tilt Breaker Protocol',
        badgeColor: 'rose',
        description: 'Enforce mandatory psychological cool-off periods after a stop-loss to eliminate revenge trading and emotional tilt.',
        icon: Clock
    },
    {
        id: 'session-clock',
        title: 'Market Session Volatility Clock (IST & UTC)',
        path: '/tools/session-clock',
        category: 'forex',
        categoryLabel: 'Market Hours',
        badge: 'London/NY Overlap',
        badgeColor: 'blue',
        description: 'Live interactive world market sessions tracker with overlap alerts for Asian, London, and New York trading hours.',
        icon: Clock
    }
];

interface RelatedToolsGridProps {
    currentToolSlug?: string;
    currentToolId?: string;
    category?: 'risk' | 'prop-firm' | 'options' | 'crypto' | 'forex' | 'tax' | 'all';
    title?: string;
    subtitle?: string;
    className?: string;
    initialLimit?: number;
}

export const RelatedToolsGrid: React.FC<RelatedToolsGridProps> = ({
    currentToolSlug = '',
    currentToolId = '',
    category,
    title = 'Explore Related Trading & Risk Calculators',
    subtitle = 'Professional mathematical modeling tools to protect your capital, optimize position sizes, and calculate net trading performance.',
    className = '',
    initialLimit = 6
}) => {
    const [selectedTab, setSelectedTab] = useState<'all' | 'risk' | 'prop-firm' | 'options' | 'crypto' | 'forex' | 'tax'>(
        category && category !== 'all' ? category : 'all'
    );
    const [isExpanded, setIsExpanded] = useState(false);

    // Filter out current tool safely
    const targetSlug = currentToolSlug || currentToolId || '';
    const normalizedCurrent = targetSlug ? targetSlug.toLowerCase().replace(/\/$/, '') : '';
    const filteredTools = ALL_TOOLS_REGISTRY.filter((tool) => {
        if (!normalizedCurrent) return true;
        const normalizedTool = (tool.path || '').toLowerCase().replace(/\/$/, '');
        const normalizedId = (tool.id || '').toLowerCase();
        return (
            normalizedTool !== normalizedCurrent &&
            !normalizedTool.includes(normalizedCurrent) &&
            normalizedId !== normalizedCurrent
        );
    });

    // Tab-based filtering
    const tabFilteredTools = selectedTab === 'all'
        ? filteredTools
        : filteredTools.filter((t) => t.category === selectedTab);

    // Limit display unless expanded
    const displayTools = isExpanded ? tabFilteredTools : tabFilteredTools.slice(0, initialLimit);

    const getBadgeClass = (color: ToolItem['badgeColor']) => {
        switch (color) {
            case 'rose':
                return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case 'emerald':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'amber':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'purple':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'cyan':
                return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
            case 'blue':
            default:
                return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
        }
    };

    return (
        <section
            aria-label="Related Trading Calculators and Analysis Tools"
            className={`mt-14 bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden ${className}`}
        >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                        <Sparkles size={13} className="text-amber-400" />
                        <span>Interactive Quantitative Suite</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                {/* Counter Badge */}
                <div className="text-xs font-mono text-slate-400 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800/80 shrink-0 self-start md:self-auto">
                    <span className="text-emerald-400 font-bold">{ALL_TOOLS_REGISTRY.length}</span> Total Financial Tools Available
                </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="relative z-10 flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none text-xs">
                {[
                    { key: 'all', label: 'All Tools' },
                    { key: 'risk', label: 'Risk & Ruin' },
                    { key: 'prop-firm', label: 'Prop Firm' },
                    { key: 'options', label: 'Options & Theta' },
                    { key: 'forex', label: 'Forex & Carry' },
                    { key: 'crypto', label: 'Crypto & Futures' },
                    { key: 'tax', label: 'Tax & Compliance' }
                ].map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => {
                            setSelectedTab(tab.key as any);
                            setIsExpanded(true);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap cursor-pointer ${
                            selectedTab === tab.key
                                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Interactive Grid of Linked Tools */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {displayTools.map((tool) => {
                    const IconComp = tool.icon;
                    return (
                        <a
                            key={tool.id}
                            href={tool.path}
                            title={tool.title}
                            className="group relative flex flex-col justify-between p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80 transition duration-200 hover:shadow-lg hover:shadow-black/40 text-left"
                            style={{ textDecoration: 'none' }}
                        >
                            <div>
                                <div className="flex items-start justify-between gap-2 mb-2.5">
                                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 group-hover:scale-105 group-hover:border-slate-700 transition">
                                        <IconComp size={18} className="text-slate-300 group-hover:text-emerald-400 transition" />
                                    </div>
                                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getBadgeClass(tool.badgeColor)}`}>
                                        {tool.badge}
                                    </span>
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition leading-snug">
                                    {tool.title}
                                </h4>
                                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                                    {tool.description}
                                </p>
                            </div>

                            <div className="mt-3.5 pt-2.5 border-t border-slate-900 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-emerald-400 transition">
                                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                                    {tool.categoryLabel}
                                </span>
                                <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition">
                                    Launch Calculator
                                    <ArrowRight size={12} />
                                </span>
                            </div>
                        </a>
                    );
                })}
            </div>

            {/* Expand / Collapse Button & All Tools Hub Link */}
            <div className="relative z-10 mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-3">
                {tabFilteredTools.length > initialLimit && (
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700/80 text-xs font-bold text-slate-200 hover:text-white transition cursor-pointer"
                    >
                        <span>
                            {isExpanded
                                ? 'Show Fewer Tools'
                                : `Browse All ${tabFilteredTools.length} Tools in this View`}
                        </span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                )}
                <a
                    href="/tools"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
                    style={{ textDecoration: 'none' }}
                >
                    <Grid size={13} className="text-emerald-400" />
                    <span>View All Tools Directory (22+) &rarr;</span>
                </a>
            </div>
        </section>
    );
};

export default RelatedToolsGrid;
