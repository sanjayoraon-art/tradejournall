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
  Unlock,
  Percent
} from 'lucide-react';

export interface ApexConsistencyCalculatorScreenProps {
  theme?: any;
  isDarkMode?: boolean;
  primaryCurrencySymbol?: string;
  onBackToLanding?: () => void;
  onSignIn?: () => void;
  onLogTrade?: (tradeData: { symbol: string; entryPrice: number; exitPrice: number; pnl: number; type: 'Long' | 'Short' }) => void;
}

// Preset Prop Firm Accounts (Apex & Topstep Futures Accounts)
interface AccountPreset {
  name: string;
  accountSize: number;
  trailingDrawdown: number;
  firm: 'Apex' | 'Topstep' | 'Custom';
}

const ACCOUNT_PRESETS: AccountPreset[] = [
  { name: 'Apex $25k', accountSize: 25000, trailingDrawdown: 1500, firm: 'Apex' },
  { name: 'Apex $50k', accountSize: 50000, trailingDrawdown: 2500, firm: 'Apex' },
  { name: 'Apex $100k', accountSize: 100000, trailingDrawdown: 3000, firm: 'Apex' },
  { name: 'Apex $150k', accountSize: 150000, trailingDrawdown: 5000, firm: 'Apex' },
  { name: 'Topstep $50k', accountSize: 50000, trailingDrawdown: 2000, firm: 'Topstep' },
  { name: 'Topstep $100k', accountSize: 100000, trailingDrawdown: 3000, firm: 'Topstep' }
];

export const ApexConsistencyCalculatorScreen: React.FC<ApexConsistencyCalculatorScreenProps> = ({
  theme,
  isDarkMode = true,
  primaryCurrencySymbol = '$',
  onBackToLanding,
  onSignIn,
  onLogTrade,
}) => {
  // ---------------------------------------------------------------------------
  // INPUT STATES
  // ---------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState<'consistency' | 'trailing'>('consistency');
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');

  // Mode 1: Consistency Rule Inputs
  const [consistencyRulePct, setConsistencyRulePct] = useState<number>(30); // 30% for Apex, 50% for Topstep
  const [totalAccumulatedProfit, setTotalAccumulatedProfit] = useState<number>(10000);
  const [highestDayProfit, setHighestDayProfit] = useState<number>(4500);
  const [payoutRequested, setPayoutRequested] = useState<number>(2000);

  // Mode 2: Trailing Threshold Inputs
  const [selectedAccountPreset, setSelectedAccountPreset] = useState<string>('Apex $50k');
  const [startingBalance, setStartingBalance] = useState<number>(50000);
  const [allowedDrawdown, setAllowedDrawdown] = useState<number>(2500);
  const [highestPeakEquity, setHighestPeakEquity] = useState<number>(53500); // Intraday peak high water mark
  const [currentClosedBalance, setCurrentClosedBalance] = useState<number>(51800);

  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Sync preset accounts
  const handleAccountPresetSelect = (preset: AccountPreset) => {
    setSelectedAccountPreset(preset.name);
    setStartingBalance(preset.accountSize);
    setAllowedDrawdown(preset.trailingDrawdown);
    setHighestPeakEquity(preset.accountSize + 3500);
    setCurrentClosedBalance(preset.accountSize + 1800);

    if (preset.firm === 'Apex') {
      setConsistencyRulePct(30);
    } else if (preset.firm === 'Topstep') {
      setConsistencyRulePct(50);
    }
  };

  // ---------------------------------------------------------------------------
  // MATHEMATICAL COMPUTATIONS
  // ---------------------------------------------------------------------------
  
  // 1. Consistency Rule Calculations
  const consistencyResults = useMemo(() => {
    const currentConsistencyPct = totalAccumulatedProfit > 0 
      ? (highestDayProfit / totalAccumulatedProfit) * 100 
      : 0;

    const maxAllowedSingleDayProfit = totalAccumulatedProfit * (consistencyRulePct / 100);
    const isCompliant = currentConsistencyPct <= consistencyRulePct;

    // Additional profit required on other trading days to make highest day compliant
    let requiredTotalProfit = 0;
    let additionalProfitNeeded = 0;

    if (!isCompliant && highestDayProfit > 0) {
      requiredTotalProfit = highestDayProfit / (consistencyRulePct / 100);
      additionalProfitNeeded = Math.max(0, requiredTotalProfit - totalAccumulatedProfit);
    }

    return {
      currentConsistencyPct,
      maxAllowedSingleDayProfit,
      isCompliant,
      requiredTotalProfit,
      additionalProfitNeeded
    };
  }, [consistencyRulePct, totalAccumulatedProfit, highestDayProfit]);

  // 2. Trailing Threshold Peak Equity Calculations
  const trailingResults = useMemo(() => {
    // Initial threshold line before trading starts
    const initialThresholdFloor = startingBalance - allowedDrawdown;

    // Apex Trailing Threshold stops trailing once it reaches Starting Balance + Safety Cap ($100 or $0 depending on rules)
    const rawTrailingStopLine = highestPeakEquity - allowedDrawdown;
    
    // Safety lock: Threshold stops trailing at Starting Balance + $100 for Apex PA accounts
    const cappedTrailingStopLine = Math.min(startingBalance + 100, rawTrailingStopLine);
    const actualTrailingStopLine = Math.max(initialThresholdFloor, cappedTrailingStopLine);

    // Current Cushion / Distance to Liquidation
    const currentCushion = currentClosedBalance - actualTrailingStopLine;
    const isLiquidated = currentClosedBalance <= actualTrailingStopLine;

    // Peak equity drawdown penalty (unrealized profit given back)
    const peakEquityGiveback = Math.max(0, highestPeakEquity - currentClosedBalance);

    let healthStatus: 'SAFE' | 'WARNING' | 'LIQUIDATED' = 'SAFE';
    if (isLiquidated) {
      healthStatus = 'LIQUIDATED';
    } else if (currentCushion < 600) {
      healthStatus = 'WARNING';
    }

    return {
      initialThresholdFloor,
      rawTrailingStopLine,
      actualTrailingStopLine,
      currentCushion,
      isLiquidated,
      peakEquityGiveback,
      healthStatus
    };
  }, [startingBalance, allowedDrawdown, highestPeakEquity, currentClosedBalance]);

  // Copy Summary Handler
  const handleCopySummary = () => {
    let summaryText = '';
    if (activeTab === 'consistency') {
      summaryText = `📊 APEX / TOPSTEP 30% CONSISTENCY RULE CALCULATOR
----------------------------------------
• Account Profit: ${currencySymbol}${totalAccumulatedProfit.toLocaleString()}
• Highest Single Day Profit: ${currencySymbol}${highestDayProfit.toLocaleString()} (${consistencyResults.currentConsistencyPct.toFixed(1)}% of Total)
• Rule Threshold: Max ${consistencyRulePct}% Allowed (${currencySymbol}${consistencyResults.maxAllowedSingleDayProfit.toLocaleString()})
----------------------------------------
📌 PAYOUT COMPLIANCE STATUS: ${consistencyResults.isCompliant ? '✅ PASSED & QUALIFIED FOR PAYOUT' : '🚨 BLOCKED / NON-COMPLIANT'}
${!consistencyResults.isCompliant ? `• Additional Profit Needed on Other Days: +${currencySymbol}${consistencyResults.additionalProfitNeeded.toFixed(2)}` : '• Single day profit is fully compliant for payout request!'}
----------------------------------------
Calculate Prop Firm Consistency Rules: https://tradejournall.com/tools/apex-consistency-rule-calculator`;
    } else {
      summaryText = `🛡️ APEX / TOPSTEP TRAILING THRESHOLD CALCULATOR
----------------------------------------
• Selected Account: ${selectedAccountPreset} (${currencySymbol}${startingBalance.toLocaleString()})
• Allowed Drawdown: ${currencySymbol}${allowedDrawdown.toLocaleString()}
• Intraday Peak High-Water Mark: ${currencySymbol}${highestPeakEquity.toLocaleString()}
• Current Closed Balance: ${currencySymbol}${currentClosedBalance.toLocaleString()}
----------------------------------------
🎯 TRAILING THRESHOLD RESULTS:
• Trailing Stop-Out Line: ${currencySymbol}${trailingResults.actualTrailingStopLine.toLocaleString()}
• Current Buffer Cushion: ${currencySymbol}${trailingResults.currentCushion.toFixed(2)}
• Account Status: ${trailingResults.healthStatus === 'LIQUIDATED' ? '🚨 BLOWN / LIQUIDATED' : trailingResults.healthStatus === 'WARNING' ? '⚠️ CRITICAL DANGER ZONE' : '✅ SAFE CUSHION'}
----------------------------------------
Track Prop Firm Trailing Thresholds: https://tradejournall.com/tools/apex-consistency-rule-calculator`;
    }

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  // ---------------------------------------------------------------------------
  // JSON-LD STRUCTURED DATA SCHEMA FOR SEO RICH SNIPPETS
  // ---------------------------------------------------------------------------
  const schemaJson = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          'name': 'Apex & Topstep Prop Firm Consistency Rule & Trailing Drawdown Calculator',
          'operatingSystem': 'All',
          'applicationCategory': 'FinanceApplication',
          'description': 'Free online Apex Trader Funding and Topstep 30% consistency rule calculator and intraday trailing threshold peak equity calculator. Verify payout qualification and prevent prop firm account liquidations.',
          'url': 'https://tradejournall.com/tools/apex-consistency-rule-calculator',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'TradeJournall',
            'url': 'https://tradejournall.com'
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
              'name': 'Apex Consistency Rule Calculator',
              'item': 'https://tradejournall.com/tools/apex-consistency-rule-calculator'
            }
          ]
        },
        {
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'What is the 30% Consistency Rule in Apex Trader Funding?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'The 30% Consistency Rule in Apex Trader Funding requires that no single trading day accounts for more than 30% of your total accumulated profit at the time of requesting a payout. If a single day exceeds 30%, you must continue trading to make additional profit on other days until the highest day becomes 30% or less of total profits.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How does Apex trailing threshold intraday drawdown work?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Apex trailing drawdown trails your account in real-time based on intraday peak equity (high water mark), including unrealized profits during open trades. The trailing threshold stops trailing once the stop-out line reaches starting balance plus $100 safety cap.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How to calculate additional profit needed to pass Apex 30% rule?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'The formula for required total profit is: Required Total Profit = Highest Single Day Profit / 0.30. The additional profit needed = Required Total Profit - Current Total Profit.'
              }
            }
          ]
        }
      ]
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 text-slate-100 font-sans">
      <Helmet>
        <title>Apex & Topstep Prop Firm Consistency Rule & Trailing Drawdown Calculator — TradeJournall</title>
        <meta
          name="description"
          content="Free Apex Trader Funding 30% consistency rule calculator & Topstep trailing threshold peak equity calculator. Check payout qualification, max single-day profit, and trailing drawdown safety."
        />
        <meta
          name="keywords"
          content="apex consistency rule calculator, topstep trailing drawdown calculator, apex 30 percent rule calculator, trailing threshold calculator apex, prop firm consistency rule tool, apex payout calculator, tradejournall"
        />
        <link rel="canonical" href="https://tradejournall.com/tools/apex-consistency-rule-calculator" />
        <meta property="og:title" content="Apex & Topstep Prop Firm Consistency Rule & Trailing Drawdown Calculator" />
        <meta
          property="og:description"
          content="Verify 30% consistency rule compliance for Apex Trader Funding & Topstep. Live trailing threshold peak equity calculator."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tradejournall.com/tools/apex-consistency-rule-calculator" />
        <script type="application/ld+json">{JSON.stringify(schemaJson)}</script>
      </Helmet>

      {/* --------------------------------------------------------------------- */}
      {/* HEADER BAR & BREADCRUMB */}
      {/* --------------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-800">
        <div>
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400 mb-2 transition cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Dashboard & Home
            </button>
          )}
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            Global Futures & Forex Prop Firm Compliance Tool
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-purple-400 shadow-lg shadow-purple-500/10">
              <Award size={28} />
            </span>
            Apex & Topstep Consistency Rule & Trailing Threshold Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Audit your <strong>30% / 50% Consistency Rule</strong> compliance for Apex Trader Funding & Topstep. Track intraday peak equity trailing threshold cushions to prevent blown accounts.
          </p>
        </div>

        {/* Global Toolbar: Currency & Share */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-1 text-xs font-bold">
            {['$', '€', '£', '₹', 'R$'].map((sym) => (
              <button
                key={sym}
                onClick={() => setCurrencySymbol(sym)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  currencySymbol === sym
                    ? 'bg-purple-500 text-slate-950 font-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition active:scale-95 cursor-pointer"
            title="Copy Prop Firm Compliance Summary"
          >
            {copiedSummary ? <Check size={15} className="text-emerald-400" /> : <Share2 size={15} />}
            {copiedSummary ? 'Copied!' : 'Share Compliance Plan'}
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* MODE SWITCHER TABS */}
      {/* --------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <button
          onClick={() => setActiveTab('consistency')}
          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left cursor-pointer ${
            activeTab === 'consistency'
              ? 'bg-gradient-to-r from-slate-900 to-slate-800/90 border-purple-500/60 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
          }`}
        >
          <div
            className={`p-3 rounded-xl ${
              activeTab === 'consistency' ? 'bg-purple-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Scale size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-purple-400">Mode 1</span>
              {activeTab === 'consistency' && (
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-black">
                  PAYOUT AUDITOR
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-white">30% Consistency Rule & Payout Qualifier</h3>
            <p className="text-xs text-slate-400">Audit single day profit limits & additional profit needed</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('trailing')}
          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left cursor-pointer ${
            activeTab === 'trailing'
              ? 'bg-gradient-to-r from-slate-900 to-slate-800/90 border-rose-500/60 shadow-lg shadow-rose-500/10 ring-1 ring-rose-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
          }`}
        >
          <div
            className={`p-3 rounded-xl ${
              activeTab === 'trailing' ? 'bg-rose-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <ShieldAlert size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-rose-400">Mode 2</span>
              {activeTab === 'trailing' && (
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-black">
                  PEAK EQUITY TRAP
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-white">Trailing Threshold & Cushion Calculator</h3>
            <p className="text-xs text-slate-400">Intraday high-water mark stop line & safety buffer</p>
          </div>
        </button>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* MAIN 2-COLUMN WORKSPACE GRID */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'consistency' ? (
        /* MODE 1: CONSISTENCY RULE WORKSPACE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          
          {/* LEFT COLUMN: CONSISTENCY INPUTS (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-700/70 pb-3">
                <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Scale size={16} className="text-purple-400" />
                  Consistency Rule Parameters
                </h3>
                <span className="text-[10px] text-purple-400 font-bold px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-full">
                  Apex / Topstep
                </span>
              </div>

              {/* Consistency Percentage Rule Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Select Prop Firm Consistency Rule</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Apex (30%)', pct: 30 },
                    { label: 'Topstep (50%)', pct: 50 },
                    { label: 'Custom', pct: 40 }
                  ].map((rule) => (
                    <button
                      key={rule.label}
                      onClick={() => setConsistencyRulePct(rule.pct)}
                      className={`py-2 text-xs font-black rounded-xl border transition cursor-pointer ${
                        consistencyRulePct === rule.pct
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow ring-1 ring-purple-500/30'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {rule.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Accumulated Profit */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-300">Total Accumulated Profit ({currencySymbol})</label>
                  <span className="text-xs font-black text-purple-400 font-mono">
                    {currencySymbol}{totalAccumulatedProfit.toLocaleString()}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={totalAccumulatedProfit || ''}
                    onChange={(e) => setTotalAccumulatedProfit(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-purple-500 transition"
                    placeholder="10000"
                  />
                </div>
              </div>

              {/* Highest Single Day Profit */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-300">Highest Single Day Profit ({currencySymbol})</label>
                  <span className="text-xs font-black text-rose-400 font-mono">
                    {currencySymbol}{highestDayProfit.toLocaleString()}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={highestDayProfit || ''}
                    onChange={(e) => setHighestDayProfit(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-purple-500 transition"
                    placeholder="4500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Enter the highest profit you made on any single trading day during this evaluation/PA account cycle.
                </p>
              </div>

              {/* Requested Payout Amount */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Target Payout Requested ({currencySymbol})</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={payoutRequested || ''}
                    onChange={(e) => setPayoutRequested(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pl-8 pr-4 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                    placeholder="2000"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: CONSISTENCY AUDIT OUTPUTS (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">

            {/* STATUS BANNER */}
            <div className={`p-6 rounded-3xl border shadow-xl transition-all ${
              consistencyResults.isCompliant
                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/60 text-rose-200'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${
                    consistencyResults.isCompliant
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  }`}>
                    {consistencyResults.isCompliant ? <Unlock size={26} /> : <Lock size={26} />}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-slate-700">
                      {consistencyResults.isCompliant ? 'QUALIFIED FOR PAYOUT' : 'PAYOUT BLOCKED'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                      {consistencyResults.isCompliant
                        ? '30% Consistency Rule PASSED!'
                        : 'Highest Day Exceeds Consistency Threshold'}
                    </h3>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Highest Day Share</span>
                  <span className={`text-xl font-black font-mono ${consistencyResults.isCompliant ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {consistencyResults.currentConsistencyPct.toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">Limit: {consistencyRulePct}%</span>
                </div>
              </div>

              {!consistencyResults.isCompliant && (
                <div className="mt-4 pt-4 border-t border-rose-500/30 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">Max Allowed Single Day Profit:</span>
                    <span className="font-mono font-bold text-slate-200">{currencySymbol}{consistencyResults.maxAllowedSingleDayProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">Required Total Account Profit to Qualify:</span>
                    <span className="font-mono font-bold text-amber-300">{currencySymbol}{consistencyResults.requiredTotalProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-black pt-1 border-t border-rose-500/20 text-rose-300">
                    <span>Additional Profit Needed on Other Days:</span>
                    <span className="font-mono text-base">+ {currencySymbol}{consistencyResults.additionalProfitNeeded.toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-rose-200/90 italic pt-1">
                    * Apex Trader Funding requires you to continue trading on subsequent days to make +{currencySymbol}{consistencyResults.additionalProfitNeeded.toFixed(0)} more profit on other days before requesting your payout.
                  </p>
                </div>
              )}
            </div>

            {/* CONSISTENCY PROGRESS BAR */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Percent size={16} className="text-purple-400" />
                  Highest Day Profit Share Gauge
                </h4>
                <span className="text-xs font-mono font-bold text-slate-400">Rule Audit</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold font-mono">
                  <span className={consistencyResults.isCompliant ? 'text-emerald-400' : 'text-rose-400'}>
                    Highest Day: {currencySymbol}{highestDayProfit.toLocaleString()} ({consistencyResults.currentConsistencyPct.toFixed(1)}%)
                  </span>
                  <span className="text-slate-400">Allowed Cap: {consistencyRulePct}%</span>
                </div>

                <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden relative border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${consistencyResults.isCompliant ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${Math.min(100, (consistencyResults.currentConsistencyPct / 60) * 100)}%` }}
                  ></div>
                  {/* Rule Limit Marker */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-md"
                    style={{ left: `${(consistencyRulePct / 60) * 100}%` }}
                    title={`Consistency Cap (${consistencyRulePct}%)`}
                  ></div>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* MODE 2: TRAILING THRESHOLD PEAK EQUITY WORKSPACE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          
          {/* LEFT COLUMN: TRAILING INPUTS (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-700/70 pb-3">
                <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert size={16} className="text-rose-400" />
                  Trailing Threshold Parameters
                </h3>
                <span className="text-[10px] text-rose-400 font-bold px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded-full">
                  Peak Equity Trap
                </span>
              </div>

              {/* Prop Firm Account Preset Buttons */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">Select Account Preset</label>
                <div className="grid grid-cols-2 gap-2">
                  {ACCOUNT_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handleAccountPresetSelect(preset)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition text-left cursor-pointer ${
                        selectedAccountPreset === preset.name
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow ring-1 ring-rose-500/30'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="font-extrabold text-white block">{preset.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono block">Max Drawdown: {currencySymbol}{preset.trailingDrawdown}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Starting Account Balance */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-300">Starting Account Size ({currencySymbol})</label>
                  <span className="text-xs font-black text-slate-200 font-mono">
                    {currencySymbol}{startingBalance.toLocaleString()}
                  </span>
                </div>
                <input
                  type="number"
                  value={startingBalance || ''}
                  onChange={(e) => setStartingBalance(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full px-4 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Allowed Trailing Drawdown */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-300">Allowed Trailing Drawdown ({currencySymbol})</label>
                  <span className="text-xs font-black text-rose-400 font-mono">
                    {currencySymbol}{allowedDrawdown.toLocaleString()}
                  </span>
                </div>
                <input
                  type="number"
                  value={allowedDrawdown || ''}
                  onChange={(e) => setAllowedDrawdown(Math.max(100, parseFloat(e.target.value) || 0))}
                  className="w-full px-4 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Highest Intraday Peak Equity Reached */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-300">Highest Intraday Peak Equity ({currencySymbol})</label>
                  <span className="text-xs font-black text-amber-400 font-mono">
                    {currencySymbol}{highestPeakEquity.toLocaleString()}
                  </span>
                </div>
                <input
                  type="number"
                  value={highestPeakEquity || ''}
                  onChange={(e) => setHighestPeakEquity(Math.max(startingBalance, parseFloat(e.target.value) || startingBalance))}
                  className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  * High Water Mark: Enter the maximum unrealized profit equity your trade hit before pulling back.
                </p>
              </div>

              {/* Current Closed Balance */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-300">Current Closed Account Balance ({currencySymbol})</label>
                  <span className="text-xs font-black text-emerald-400 font-mono">
                    {currencySymbol}{currentClosedBalance.toLocaleString()}
                  </span>
                </div>
                <input
                  type="number"
                  value={currentClosedBalance || ''}
                  onChange={(e) => setCurrentClosedBalance(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: TRAILING OUTPUTS (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">

            {/* TRAILING STATUS CARDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* CARD 1: TRAILING STOP LINE */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 block mb-1">
                    Actual Trailing Stop Line
                  </span>
                  <div className="text-2xl font-black font-mono text-rose-400">
                    {currencySymbol}{trailingResults.actualTrailingStopLine.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Account liquidates if closed balance hits this line
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                  Initial Floor: <span className="font-mono text-slate-200">{currencySymbol}{trailingResults.initialThresholdFloor.toLocaleString()}</span>
                </div>
              </div>

              {/* CARD 2: CURRENT CUSHION BUFFER */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-1">
                    Current Cushion Distance
                  </span>
                  <div className={`text-2xl font-black font-mono ${trailingResults.healthStatus === 'LIQUIDATED' ? 'text-rose-400' : trailingResults.healthStatus === 'WARNING' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {currencySymbol}{trailingResults.currentCushion.toFixed(2)}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Remaining loss buffer before account fail
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                  Status: <strong className={trailingResults.healthStatus === 'LIQUIDATED' ? 'text-rose-400' : trailingResults.healthStatus === 'WARNING' ? 'text-amber-400' : 'text-emerald-400'}>{trailingResults.healthStatus}</strong>
                </div>
              </div>

              {/* CARD 3: UNREALIZED GIVEBACK PENALTY */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-1">
                    Peak Profit Giveback
                  </span>
                  <div className="text-2xl font-black font-mono text-amber-400">
                    -{currencySymbol}{trailingResults.peakEquityGiveback.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Unrealized profit given back from peak intraday high
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                  Intraday Peak: <span className="font-mono text-slate-200">{currencySymbol}{highestPeakEquity.toLocaleString()}</span>
                </div>
              </div>

            </div>

            {/* PEAK EQUITY TRAP EXPLANATION CARD */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
              <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-400" />
                Understanding Apex Trailing Threshold High-Water Mark Logic
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                When your open trade runs in profit up to <strong className="text-amber-400 font-mono">{currencySymbol}{highestPeakEquity.toLocaleString()}</strong>, the Apex trailing threshold instantly moves your liquidation line UP to <strong className="text-rose-400 font-mono">{currencySymbol}{trailingResults.actualTrailingStopLine.toLocaleString()}</strong>. Even if you let the trade pull back to breakeven, your stop-out line <strong>NEVER GOES DOWN</strong>. This peak equity trap causes 80% of prop firm challenge failures!
              </p>
            </div>

          </div>

        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* CONVERSION LEAD MAGNET BANNER */}
      {/* --------------------------------------------------------------------- */}
      <div className="mb-10 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/40 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">
            TradeJournall Prop Firm Discipline
          </span>
          <h4 className="text-base font-extrabold text-white mt-0.5">
            Log your Prop Firm Trades & Prevent Consistency Violations
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            Track daily profit caps, trailing drawdown cushions, and risk-to-reward ratios automatically on TradeJournall.
          </p>
        </div>

        <button
          onClick={() => {
            if (onLogTrade) {
              onLogTrade({
                symbol: `APEX ${selectedAccountPreset}`,
                entryPrice: startingBalance,
                exitPrice: currentClosedBalance,
                pnl: currentClosedBalance - startingBalance,
                type: 'Long',
              });
            }
          }}
          className="whitespace-nowrap bg-purple-500 hover:bg-purple-400 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs sm:text-sm transition shadow-lg shadow-purple-500/20 flex items-center gap-2 cursor-pointer"
        >
          <span>Log Prop Firm Setup</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* ON-PAGE SEO EDUCATIONAL GUIDE & KEYWORD HEADINGS */}
      {/* --------------------------------------------------------------------- */}
      <div className="pt-8 border-t border-slate-800 text-slate-300">
        <article className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Apex & Topstep Prop Firm Consistency Rule & Trailing Drawdown Guide
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Managing a funded futures trading account with <strong>Apex Trader Funding</strong> or <strong>Topstep</strong> requires strict compliance with evaluation and PA payout rules. The two biggest hurdles prop firm traders face are the <strong>30% Consistency Rule</strong> and the <strong>Live Intraday Peak Equity Trailing Drawdown</strong>.
            </p>

            <h3 className="text-xl font-bold text-purple-400">
              1. What is the Apex 30% Consistency Rule and How is it Calculated?
            </h3>
            <p className="text-slate-300">
              Apex Trader Funding requires that when requesting a payout, no single trading day can account for more than <strong>30% of your total accumulated profit</strong>.
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center font-mono font-bold text-purple-300 text-sm">
              Max Allowed Single Day Profit = Total Accumulated Profit × 0.30
            </div>
            <p className="text-slate-300">
              If your highest profit day exceeds 30%, your payout is not lost, but it is <strong>locked/blocked</strong> until you make additional profits on other trading days to bring that single day percentage down to 30% or lower.
            </p>

            <h3 className="text-xl font-bold text-purple-400">
              2. How Does the Apex Trailing Threshold Peak Equity Trap Work?
            </h3>
            <p className="text-slate-300">
              Unlike static drawdown rules, Apex trailing drawdown trails your account in real-time based on <strong>intraday peak equity (high water mark)</strong>. If an open trade goes up to +$3,000 in unrealized profit, your trailing stop-out threshold instantly ratchets UP by +$3,000. If you let that trade pull back to zero, your trailing stop line remains at the high point, reducing your drawdown cushion.
            </p>

            <h3 className="text-xl font-bold text-purple-400">Frequently Asked Questions (FAQ)</h3>
            <div className="space-y-4">
              <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/60">
                <h5 className="font-bold text-white mb-1">Does Apex 30% consistency rule apply to evaluation or PA accounts?</h5>
                <p className="text-xs text-slate-400">The 30% consistency rule applies to Performance Accounts (PA) when requesting payouts. Evaluation accounts do not have a 30% consistency requirement to pass, but PA accounts enforce it for withdrawals.</p>
              </div>
              <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/60">
                <h5 className="font-bold text-white mb-1">When does the Apex trailing threshold stop trailing?</h5>
                <p className="text-xs text-slate-400">For Apex PA accounts, the trailing threshold stops trailing once the liquidation line reaches your starting balance plus $100 safety cap (e.g., $50,100 for a $50k account).</p>
              </div>
            </div>

          </div>
        </article>
      </div>

    </div>
  );
};
