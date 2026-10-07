import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Calculator,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Share2,
  Check,
  Zap,
  Layers,
  HelpCircle,
  ExternalLink,
  ArrowRight,
  Activity,
  Award,
  DollarSign,
  Scale,
  Lock,
  Percent,
  Clock,
  RefreshCw,
  Info,
  CreditCard,
  Building2,
  Landmark,
  Sparkles,
  BarChart3,
  Calendar,
  Compass
} from 'lucide-react';

export interface PropFirmScalingCalculatorScreenProps {
  theme?: any;
  isDarkMode?: boolean;
  primaryCurrencySymbol?: string;
  onBackToLanding?: () => void;
  onSignIn?: () => void;
  onLogTrade?: (tradeData: { symbol: string; entryPrice: number; exitPrice: number; pnl: number; type: 'Long' | 'Short' }) => void;
}

// Preset Prop Firm Scaling Rules
interface PropFirmScalingPreset {
  id: string;
  name: string;
  profitTargetPercent: number;    // % profit required to trigger scaling
  scalingIncreasePercent: number; // % capital bump upon scaling
  evalMonthsInterval: number;     // Months required between scaling evaluation
  maxCapitalLimit: number;        // Maximum scaled account balance ($)
  upgradesProfitSplit: boolean;  // e.g. 80/20 upgrades to 90/10
  description: string;
}

const SCALING_PRESETS: PropFirmScalingPreset[] = [
  {
    id: 'ftmo',
    name: 'FTMO Scaling Plan',
    profitTargetPercent: 10,
    scalingIncreasePercent: 25,
    evalMonthsInterval: 4,
    maxCapitalLimit: 2000000,
    upgradesProfitSplit: true,
    description: '25% Capital Increase every 4 months upon 10% total profit + 90/10 split upgrade (Up to $2M)'
  },
  {
    id: 'topstep',
    name: 'Topstep Scaling Plan',
    profitTargetPercent: 5,
    scalingIncreasePercent: 20,
    evalMonthsInterval: 2,
    maxCapitalLimit: 1500000,
    upgradesProfitSplit: true,
    description: 'Dynamic contract lot size scaling & capital increase (Up to $1.5M)'
  },
  {
    id: 'fundednext',
    name: 'FundedNext Scaling',
    profitTargetPercent: 10,
    scalingIncreasePercent: 40,
    evalMonthsInterval: 4,
    maxCapitalLimit: 4000000,
    upgradesProfitSplit: true,
    description: '40% Capital Bump every 4 months upon 10% target hit + 90/10 split (Up to $4M)'
  },
  {
    id: 'fivepercenters',
    name: 'The 5%ers Scaling',
    profitTargetPercent: 10,
    scalingIncreasePercent: 100,
    evalMonthsInterval: 3,
    maxCapitalLimit: 4000000,
    upgradesProfitSplit: true,
    description: 'Doubles Account Size (100% Increase) every 10% target reached (Up to $4M)'
  },
  {
    id: 'apex',
    name: 'Apex Master Scaling',
    profitTargetPercent: 6,
    scalingIncreasePercent: 25,
    evalMonthsInterval: 2,
    maxCapitalLimit: 3000000,
    upgradesProfitSplit: true,
    description: 'Multi-account scaling schedule up to 20 Performance Accounts'
  },
  {
    id: 'custom',
    name: 'Custom Scaling Rule',
    profitTargetPercent: 10,
    scalingIncreasePercent: 25,
    evalMonthsInterval: 3,
    maxCapitalLimit: 2000000,
    upgradesProfitSplit: false,
    description: 'Custom target & capital bump percentage'
  },
];

export const PropFirmScalingCalculatorScreen: React.FC<PropFirmScalingCalculatorScreenProps> = ({
  theme,
  isDarkMode = true,
  primaryCurrencySymbol = '$',
  onBackToLanding,
  onSignIn,
  onLogTrade
}) => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [selectedFirmId, setSelectedFirmId] = useState<string>('ftmo');
  const [startingCapitalUsd, setStartingCapitalUsd] = useState<number>(50000);
  const [monthlyReturnPercent, setMonthlyReturnPercent] = useState<number>(6); // 6% average monthly profit
  const [targetHorizonMonths, setTargetHorizonMonths] = useState<number>(12); // 12 months roadmap
  const [profitSplitPercent, setProfitSplitPercent] = useState<number>(80);    // 80% to trader
  const [copied, setCopied] = useState<boolean>(false);

  // Active preset object
  const activePreset = useMemo(() => {
    return SCALING_PRESETS.find(p => p.id === selectedFirmId) || SCALING_PRESETS[0];
  }, [selectedFirmId]);

  // ---------------------------------------------------------------------------
  // MATHEMATICAL SCALING ROADMAP CALCULATIONS
  // ---------------------------------------------------------------------------
  const roadmapResults = useMemo(() => {
    const { profitTargetPercent, scalingIncreasePercent, evalMonthsInterval, maxCapitalLimit, upgradesProfitSplit } = activePreset;

    let currentAccountCapital = startingCapitalUsd;
    let currentSplit = profitSplitPercent;
    let accumulatedTraderPayoutUsd = 0;
    let accumulatedFirmPayoutUsd = 0;
    let accumulatedAccountProfitUsd = 0;
    let totalScalingEventsCount = 0;

    const monthlySnapshots: Array<{
      month: number;
      startingBalance: number;
      monthlyProfitUsd: number;
      cumulativeProfitUsd: number;
      traderPayoutUsd: number;
      endingBalance: number;
      scaledAccountCapital: number;
      scaledEvent: boolean;
      profitSplitRatio: number;
      maxLotSize: number;
    }> = [];

    const scalingMilestoneStages: Array<{
      stageNumber: number;
      achievedMonth: number;
      accountCapital: number;
      cumulativePayoutUsd: number;
      maxLotSize: number;
    }> = [
      {
        stageNumber: 1,
        achievedMonth: 0,
        accountCapital: startingCapitalUsd,
        cumulativePayoutUsd: 0,
        maxLotSize: Math.round(startingCapitalUsd / 10000)
      }
    ];

    let cycleAccumulatedProfitPercent = 0;

    for (let m = 1; m <= targetHorizonMonths; m++) {
      const monthStartCapital = currentAccountCapital;
      const monthlyProfitUsd = monthStartCapital * (monthlyReturnPercent / 100);
      const monthlyProfitPercent = (monthlyProfitUsd / monthStartCapital) * 100;
      
      cycleAccumulatedProfitPercent += monthlyProfitPercent;
      accumulatedAccountProfitUsd += monthlyProfitUsd;

      // Payout calculation for this month
      const traderPayoutUsd = monthlyProfitUsd * (currentSplit / 100);
      const firmPayoutUsd = monthlyProfitUsd - traderPayoutUsd;
      
      accumulatedTraderPayoutUsd += traderPayoutUsd;
      accumulatedFirmPayoutUsd += firmPayoutUsd;

      let scaledEvent = false;

      // Check if Scaling Evaluation Cycle is reached (e.g. every evalMonthsInterval)
      if (m % evalMonthsInterval === 0) {
        if (cycleAccumulatedProfitPercent >= profitTargetPercent) {
          // Trigger Scaling Bump!
          scaledEvent = true;
          totalScalingEventsCount++;

          const capitalBumpUsd = currentAccountCapital * (scalingIncreasePercent / 100);
          currentAccountCapital = Math.min(maxCapitalLimit, currentAccountCapital + capitalBumpUsd);
          
          // Upgrade split if applicable (e.g. 80/20 upgrades to 90/10)
          if (upgradesProfitSplit && currentSplit < 90) {
            currentSplit = 90;
          }

          // Record Stage Milestone
          scalingMilestoneStages.push({
            stageNumber: scalingMilestoneStages.length + 1,
            achievedMonth: m,
            accountCapital: currentAccountCapital,
            cumulativePayoutUsd: accumulatedTraderPayoutUsd,
            maxLotSize: Math.round(currentAccountCapital / 10000)
          });

          // Reset cycle profit tracking for next scaling tier
          cycleAccumulatedProfitPercent = 0;
        }
      }

      // Estimate max allowed lot size based on current capital ($10k = 1 Lot standard rule)
      const maxLotSize = Math.round(currentAccountCapital / 10000);

      monthlySnapshots.push({
        month: m,
        startingBalance: monthStartCapital,
        monthlyProfitUsd,
        cumulativeProfitUsd: accumulatedAccountProfitUsd,
        traderPayoutUsd,
        endingBalance: monthStartCapital + monthlyProfitUsd,
        scaledAccountCapital: currentAccountCapital,
        scaledEvent,
        profitSplitRatio: currentSplit,
        maxLotSize
      });
    }

    const finalAccountCapital = currentAccountCapital;
    const capitalGrowthMultiplier = finalAccountCapital / startingCapitalUsd;
    const finalMaxLotSize = Math.round(finalAccountCapital / 10000);

    // Status classification
    let statusLevel: 'safe' | 'warning' | 'danger' = 'safe';
    let statusTitle = 'Exponential Capital Scaling Zone';
    let statusMessage = `At ${monthlyReturnPercent}% monthly return, your account scales ${capitalGrowthMultiplier.toFixed(1)}x in ${targetHorizonMonths} months!`;

    if (totalScalingEventsCount === 0) {
      statusLevel = 'warning';
      statusTitle = 'Scaling Target Unreached';
      statusMessage = `Increase monthly return above ${profitTargetPercent}% or extend target horizon to trigger capital scale bumps!`;
    }

    return {
      finalAccountCapital,
      accumulatedTraderPayoutUsd,
      accumulatedFirmPayoutUsd,
      accumulatedAccountProfitUsd,
      capitalGrowthMultiplier,
      totalScalingEventsCount,
      finalMaxLotSize,
      monthlySnapshots,
      scalingMilestoneStages,
      statusLevel,
      statusTitle,
      statusMessage
    };
  }, [activePreset, startingCapitalUsd, monthlyReturnPercent, targetHorizonMonths, profitSplitPercent]);

  // Share tool link
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Structured JSON-LD Schema Markup
  const jsonLdSchema = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          'name': 'Prop Firm Account Scaling Plan & Growth Roadmap Calculator',
          'operatingSystem': 'Web Browser',
          'applicationCategory': 'FinanceApplication',
          'url': 'https://tradejournall.com/tools/prop-firm-scaling-plan-calculator',
          'description': 'Calculate step-by-step prop firm account scaling roadmaps for FTMO, Topstep, Apex, FundedNext, and 5%ers. Model capital growth, lot size scaling, and cumulative trader payouts.',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
          }
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://tradejournall.com/'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Trading Tools',
              'item': 'https://tradejournall.com/tools'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': 'Prop Firm Scaling Plan Calculator',
              'item': 'https://tradejournall.com/tools/prop-firm-scaling-plan-calculator'
            }
          ]
        },
        {
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'How does the FTMO scaling plan work in 2026?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'The FTMO scaling plan increases account capital by 25% every 4 months if the trader achieves a total net profit of at least 10% over the 4-month cycle and receives at least 2 payouts. In addition, the profit split upgrades from 80/20 to 90/10 up to a maximum capital cap of $2,000,000.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How do lot sizes scale as prop firm account balance grows?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Prop firms scale maximum contract lot size proportionately with account capital. Generally, for every $10,000 increase in account balance, allowable lot size increases by 1 full lot (e.g. $50k = 5 lots, $100k = 10 lots, $200k = 20 lots).'
              }
            },
            {
              '@type': 'Question',
              'name': 'What is the highest scaling limit among prop firms like 5%ers and FundedNext?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'The 5%ers and FundedNext offer maximum capital scaling caps up to $4,000,000 per trader, doubling account size (100% increase) upon hitting 10% profit targets.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How to calculate cumulative trader payouts over a 12-month scaling roadmap?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Cumulative Trader Payout = Sum of Monthly Account Profit x Trader Profit Split Ratio (80% or 90%) across all scaling tiers.'
              }
            }
          ]
        }
      ]
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 text-slate-100 font-sans">
      {/* --------------------------------------------------------------------- */}
      {/* HELMET SEO META TAGS */}
      {/* --------------------------------------------------------------------- */}
      <Helmet>
        <title>Prop Firm Account Scaling Plan & Growth Roadmap Calculator (FTMO, Topstep, Apex) — TradeJournall</title>
        <meta
          name="description"
          content="Free Prop Firm Account Scaling Plan & Growth Roadmap Calculator. Model FTMO 25% capital bumps, Topstep lot scaling, Apex scaling schedules, and cumulative trader payouts up to $2M+."
        />
        <meta
          name="keywords"
          content="ftmo scaling plan calculator, topstep account scaling calculator, prop firm account scaling roadmap tool, apex trader funding scaling schedule, 5percenters scaling calculator, tradejournall"
        />
        <link rel="canonical" href="https://tradejournall.com/tools/prop-firm-scaling-plan-calculator" />
        <meta property="og:title" content="Prop Firm Account Scaling Plan & Growth Roadmap Calculator" />
        <meta
          property="og:description"
          content="Step-by-step visual scaling roadmap for FTMO, Topstep & Apex. Model account capital growth, lot size scaling, and cumulative payouts."
        />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLdSchema)}</script>
      </Helmet>

      {/* --------------------------------------------------------------------- */}
      {/* HEADER BAR */}
      {/* --------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
                title="Back to Home"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              Global Prop Firm Growth Suite
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="text-emerald-400" size={26} />
            Prop Firm Account Scaling Plan & Growth Roadmap Calculator
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Calculate step-by-step capital growth roadmaps for FTMO, Topstep, Apex, FundedNext, and 5%ers. Model capital scaling bumps, lot size increases, and cumulative trader payouts up to $2M+.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold transition border border-slate-700"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
            <span>{copied ? 'Link Copied!' : 'Share Tool'}</span>
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* MAIN CALCULATOR GRID */}
      {/* --------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        
        {/* INPUT CONTROLS (LEFT 7 COLUMNS) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
          
          {/* PROP FIRM SCALING PRESETS */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Select Prop Firm Scaling Preset
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SCALING_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedFirmId(preset.id)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    selectedFirmId === preset.id
                      ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-xs font-black">{preset.name}</span>
                  <span className="text-[10px] text-emerald-400 font-mono mt-1 font-semibold">
                    +{preset.scalingIncreasePercent}% Bump / {preset.evalMonthsInterval}m
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 italic pt-1">
              💡 {activePreset.description}
            </p>
          </div>

          {/* STARTING CAPITAL INPUT */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <label>2. Starting Funded Account Balance ({primaryCurrencySymbol})</label>
              <span className="text-emerald-400 font-mono">{primaryCurrencySymbol}{startingCapitalUsd.toLocaleString()}</span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">
                {primaryCurrencySymbol}
              </span>
              <input
                type="number"
                min="5000"
                max="500000"
                step="5000"
                value={startingCapitalUsd}
                onChange={(e) => setStartingCapitalUsd(Math.max(1000, parseFloat(e.target.value) || 0))}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-9 pr-4 text-white font-mono font-bold text-sm focus:border-emerald-500 outline-none transition"
              />
            </div>
            {/* Quick Capital Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[25000, 50000, 100000, 200000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setStartingCapitalUsd(amt)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition cursor-pointer ${
                    startingCapitalUsd === amt
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {primaryCurrencySymbol}{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* AVERAGE MONTHLY RETURN & ROADMAP HORIZON */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* MONTHLY RETURN SLIDER */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                <label>3. Avg. Monthly Profit Return (%)</label>
                <span className="text-purple-400 font-mono font-bold">+{monthlyReturnPercent}% / month</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={monthlyReturnPercent}
                onChange={(e) => setMonthlyReturnPercent(parseFloat(e.target.value) || 5)}
                className="w-full accent-purple-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>2% Conservative</span>
                <span>5% Steady</span>
                <span>10% Aggressive</span>
              </div>
            </div>

            {/* HORIZON MONTHS SLIDER */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                <label>4. Roadmap Target Horizon ({targetHorizonMonths} Months)</label>
                <span className="text-emerald-400 font-mono font-bold">{targetHorizonMonths} Months ({ (targetHorizonMonths / 12).toFixed(1) } Yrs)</span>
              </div>
              <input
                type="range"
                min="3"
                max="24"
                step="1"
                value={targetHorizonMonths}
                onChange={(e) => setTargetHorizonMonths(parseInt(e.target.value) || 12)}
                className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>3m</span>
                <span>6m</span>
                <span>12m (1 Year)</span>
                <span>24m (2 Years)</span>
              </div>
            </div>

          </div>

          {/* PROFIT SPLIT % */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <label>5. Trader Profit Split Ratio (%)</label>
              <span className="text-emerald-400 font-mono font-bold">{profitSplitPercent}% Trader / {100 - profitSplitPercent}% Firm</span>
            </div>
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              {[80, 85, 90].map((split) => (
                <button
                  key={split}
                  type="button"
                  onClick={() => setProfitSplitPercent(split)}
                  className={`py-2 px-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center cursor-pointer ${
                    profitSplitPercent === split
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{split}/{100 - split} Split</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* OUTPUT RESULTS CARD (RIGHT 5 COLUMNS) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* CORE ROADMAP SUMMARY CARD */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 relative overflow-hidden">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <BarChart3 size={16} className="text-emerald-400" />
                {targetHorizonMonths}-Month Account Growth Summary
              </span>
              <span className="text-[10px] bg-emerald-950 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold">
                {roadmapResults.totalScalingEventsCount} Scale Events
              </span>
            </div>

            {/* BIG METRIC 1: FINAL SCALED ACCOUNT BALANCE */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/40 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                🚀 Final Scaled Account Balance
              </span>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-black font-mono text-emerald-400 tracking-tight">
                  {primaryCurrencySymbol}{roadmapResults.finalAccountCapital.toLocaleString()}
                </div>
                <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  {roadmapResults.capitalGrowthMultiplier.toFixed(1)}x Growth
                </span>
              </div>
            </div>

            {/* METRICS GRID 2: CUMULATIVE PAYOUT & MAX LOTS */}
            <div className="grid grid-cols-2 gap-3">
              {/* CUMULATIVE PAYOUT */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Cumulative Trader Payout
                </span>
                <div className="text-lg font-black font-mono text-purple-300">
                  {primaryCurrencySymbol}{roadmapResults.accumulatedTraderPayoutUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>

              {/* MAX LOT SIZE */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Max Allowable Lot Size
                </span>
                <div className="text-lg font-black font-mono text-amber-300">
                  {roadmapResults.finalMaxLotSize} Lots
                </div>
              </div>
            </div>

            {/* BREAKDOWN LIST */}
            <div className="space-y-2.5 pt-2 text-xs border-t border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Total Account Gross Profit Earned:</span>
                <span className="font-mono font-bold text-white">
                  {primaryCurrencySymbol}{roadmapResults.accumulatedAccountProfitUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Prop Firm Split Share ({100 - profitSplitPercent}%):</span>
                <span className="font-mono font-bold text-amber-400">
                  {primaryCurrencySymbol}{roadmapResults.accumulatedFirmPayoutUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Scaling Evaluation Cycle:</span>
                <span className="font-mono font-bold text-emerald-400">
                  Every {activePreset.evalMonthsInterval} Months (+{activePreset.scalingIncreasePercent}%)
                </span>
              </div>
            </div>

          </div>

          {/* STATUS GAUGE CARD */}
          <div className={`p-5 rounded-3xl border shadow-xl space-y-2.5 ${
            roadmapResults.statusLevel === 'safe'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
          }`}>
            <h4 className="text-sm font-extrabold flex items-center gap-2">
              {roadmapResults.statusLevel === 'safe' ? <CheckCircle2 size={18} className="text-emerald-400" /> : <AlertTriangle size={18} className="text-amber-400" />}
              <span>{roadmapResults.statusTitle}</span>
            </h4>
            <p className="text-xs leading-relaxed opacity-90">
              {roadmapResults.statusMessage}
            </p>
          </div>

        </div>

      </div>

      {/* --------------------------------------------------------------------- */}
      {/* STEP-BY-STEP VISUAL SCALING ROADMAP STAGES */}
      {/* --------------------------------------------------------------------- */}
      <div className="mb-10 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Compass className="text-emerald-400" size={20} />
            <span>Step-by-Step Capital Growth Roadmap ({activePreset.name})</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {roadmapResults.scalingMilestoneStages.length} Growth Stages
          </span>
        </div>

        {/* MILESTONE STAGE CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {roadmapResults.scalingMilestoneStages.map((stage) => (
            <div
              key={stage.stageNumber}
              className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  Stage {stage.stageNumber}
                </span>
                <span className="text-[11px] text-slate-400 font-mono font-bold">
                  {stage.achievedMonth === 0 ? 'Start' : `Month ${stage.achievedMonth}`}
                </span>
              </div>

              <div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Account Balance</div>
                <div className="text-xl font-black font-mono text-white mt-0.5">
                  {primaryCurrencySymbol}{stage.accountCapital.toLocaleString()}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Cum. Payout:</span>
                  <span className="font-mono text-purple-300 font-bold">
                    {primaryCurrencySymbol}{stage.cumulativePayoutUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Max Lot Size:</span>
                  <span className="font-mono text-amber-300 font-bold">{stage.maxLotSize} Lots</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* CONVERSION LEAD MAGNET BANNER */}
      {/* --------------------------------------------------------------------- */}
      <div className="mb-10 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
            TradeJournall Prop Firm Scaling Suite
          </span>
          <h4 className="text-base font-extrabold text-white mt-0.5">
            Track Prop Firm Scaling Milestones & Log Trades Automatically
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            Log your setups on TradeJournall to audit monthly returns, win-rates, and account scaling milestones.
          </p>
        </div>

        <button
          onClick={() => {
            if (onLogTrade) {
              onLogTrade({
                symbol: `${activePreset.name} SCALING`,
                entryPrice: startingCapitalUsd,
                exitPrice: roadmapResults.finalAccountCapital,
                pnl: roadmapResults.accumulatedTraderPayoutUsd,
                type: 'Long',
              });
            }
          }}
          className="whitespace-nowrap bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs sm:text-sm transition shadow-lg shadow-emerald-400/20 flex items-center gap-2 cursor-pointer"
        >
          <span>Log Scaling Setup</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* ON-PAGE SEO EDUCATIONAL GUIDE & KEYWORD HEADINGS */}
      {/* --------------------------------------------------------------------- */}
      <div className="pt-8 border-t border-slate-800 text-slate-300">
        <article className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8">
            
            {/* ARTICLE HEADER */}
            <div className="border-b border-slate-800 pb-6">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                Funded Scaling Masterclass 2026
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-3 mb-2 leading-tight">
                Prop Firm Account Scaling Plan & Growth Roadmap Masterclass
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Learn how prop firm scaling plans work for <strong>FTMO</strong>, <strong>Topstep</strong>, <strong>FundedNext</strong>, <strong>The 5%ers</strong>, and <strong>Apex Trader Funding</strong>. Master the step-by-step mathematics of scaling funded account balances from $50,000 to $2,000,000+.
              </p>
            </div>

            {/* SECTION 1: HOW SCALING PLANS WORK */}
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-400">
                1. What is a Prop Firm Scaling Plan and How Does It Work?
              </h3>
              <p className="text-slate-300 leading-relaxed">
                A <strong>Prop Firm Scaling Plan</strong> is an incentive program offered by funded trading firms that rewards consistent, profitable traders with additional capital. Rather than requiring traders to re-pass evaluation challenges, prop firms automatically increase your account balance by <strong>25% to 100%</strong> once specific profit milestones are met.
              </p>
              <ul className="text-slate-300 space-y-2 list-disc list-inside text-xs sm:text-sm">
                <li><strong>FTMO Scaling Rule:</strong> Generates a 25% capital increase every 4 months if the trader achieves a total net profit of at least 10% over the cycle and receives 2 payouts. In addition, the profit split upgrades to 90/10 up to $2,000,000 max.</li>
                <li><strong>The 5%ers Scaling Rule:</strong> Doubles account size (100% bump) every time a 10% net profit target is reached, up to an industry-leading $4,000,000 maximum capital cap.</li>
                <li><strong>FundedNext Scaling Rule:</strong> Offers a 40% capital increase every 4 months upon achieving 10% cumulative growth.</li>
              </ul>
            </div>

            {/* SECTION 2: LOT SIZE SCALING */}
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-400">
                2. Lot Size Scaling & Contract Sizing Rules
              </h3>
              <p className="text-slate-300 leading-relaxed">
                As your account capital scales, your allowable maximum contract lot size increases proportionately. This allows traders to scale position sizing without increasing percentage risk per trade.
              </p>
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm text-center font-bold text-emerald-300 space-y-1">
                <div>Max Lot Size = Scaled Account Balance / $10,000</div>
                <div className="text-[11px] text-slate-400 font-normal">($50k = 5 Lots | $100k = 10 Lots | $200k = 20 Lots)</div>
              </div>
            </div>

            {/* SECTION 3: FAQ SECTION */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-400">
                Frequently Asked Questions (FAQ) — Prop Firm Scaling Rules
              </h3>
              
              <div className="space-y-3">
                <div className="border border-slate-800 rounded-2xl p-5 bg-slate-950/60 space-y-2">
                  <h5 className="font-bold text-white text-sm">How does the FTMO scaling plan work in 2026?</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The FTMO scaling plan increases account capital by 25% every 4 months if the trader achieves a total net profit of at least 10% over the 4-month cycle and receives at least 2 payouts. In addition, the profit split upgrades from 80/20 to 90/10 up to a maximum capital cap of $2,000,000.
                  </p>
                </div>

                <div className="border border-slate-800 rounded-2xl p-5 bg-slate-950/60 space-y-2">
                  <h5 className="font-bold text-white text-sm">How do lot sizes scale as prop firm account balance grows?</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Prop firms scale maximum contract lot size proportionately with account capital. Generally, for every $10,000 increase in account balance, allowable lot size increases by 1 full lot (e.g. $50k = 5 lots, $100k = 10 lots, $200k = 20 lots).
                  </p>
                </div>

                <div className="border border-slate-800 rounded-2xl p-5 bg-slate-950/60 space-y-2">
                  <h5 className="font-bold text-white text-sm">What is the highest scaling limit among prop firms like 5%ers and FundedNext?</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The 5%ers and FundedNext offer maximum capital scaling caps up to $4,000,000 per trader, doubling account size (100% increase) upon hitting 10% profit targets.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </article>
      </div>

    </div>
  );
};
