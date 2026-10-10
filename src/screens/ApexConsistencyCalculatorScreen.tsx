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
            },
            {
              '@type': 'Question',
              'name': 'Does the 30% consistency rule apply to evaluation or PA accounts?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'The 30% consistency rule applies specifically to Performance Accounts (PA) when requesting payouts. Evaluation accounts do not require 30% consistency to pass, though maintaining steady daily profits builds good habits for PA accounts.'
              }
            },
            {
              '@type': 'Question',
              'name': 'When does the Apex trailing threshold stop trailing permanently?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'For Apex PA accounts, once your threshold reaches starting balance plus $100 (e.g. $50,100 for a $50k account), it stops trailing and locks permanently at that level.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How is Topstep Consistency Rule different from Apex?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Topstep uses a 50% consistency rule during evaluations (no single day can exceed 50% of total profit) whereas Apex enforces a 30% consistency rule on PA payout requests. Both encourage steady, sustainable profit distribution.'
              }
            },
            {
              '@type': 'Question',
              'name': 'What happens if I make 50% of my total profit on Day 1 of an Apex PA account?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Your account is not penalized or forfeited. However, you will not be able to request a payout until you trade additional days and earn enough total profit so that Day 1 is 30% or less of your cumulative profit.'
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
        <title>Apex Trailing Drawdown Calculator & Consistency Rule Tool | TradeJournall</title>
        <meta
          name="description"
          content="Free Apex Trailing Drawdown Calculator & 30% consistency rule tool for Apex Trader Funding & Topstep. Calculate live trailing threshold, peak equity high water mark, max loss level, and payout safety."
        />
        <meta
          name="keywords"
          content="apex trailing drawdown calculator, apex trailing threshold calculator, apex drawdown calculator, apex consistency rule calculator, topstep trailing drawdown calculator, prop firm drawdown calculator, tradejournall"
        />
        <link rel="canonical" href="https://tradejournall.com/tools/apex-trailing-drawdown-calculator" />
        <meta property="og:title" content="Apex Trailing Drawdown Calculator & Consistency Rule Tool" />
        <meta
          property="og:description"
          content="Free Apex Trailing Drawdown Calculator & 30% consistency rule tool. Live trailing threshold peak equity calculator for Apex Trader Funding."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tradejournall.com/tools/apex-trailing-drawdown-calculator" />
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

      <div className="pt-8 border-t border-slate-800 text-slate-300">
        <article className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8">
            
            {/* ARTICLE HEADER */}
            <div className="border-b border-slate-800 pb-6">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest bg-purple-950/60 border border-purple-500/30 px-3 py-1 rounded-full">
                Ultimate Prop Firm Guide 2026
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-3 mb-2 leading-tight">
                Apex & Topstep Prop Firm Consistency Rule & Trailing Drawdown Calculator Masterclass
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Learn how to pass and keep your <strong>Apex Trader Funding</strong> and <strong>Topstep</strong> funded futures accounts by mastering the <strong>30% Consistency Rule</strong>, avoiding the <strong>Intraday Peak Equity Trailing Threshold trap</strong>, and calculating your exact payout eligibility.
              </p>
            </div>

            {/* SECTION 1: WHAT IS THE 30% CONSISTENCY RULE */}
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-purple-400 flex items-center gap-2">
                <span>1. What is the Apex 30% Consistency Rule?</span>
              </h3>
              <p className="text-slate-300 leading-relaxed">
                The <strong>Apex 30% Consistency Rule</strong> is a core payout policy enforced on <strong>Apex Trader Funding Performance Accounts (PA)</strong>. It mandates that when you submit a withdrawal request, <strong>no single trading day can account for more than 30% of your total cumulative profit</strong> accumulated in that account since inception or since your last reset.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Prop firms like Apex Trader Funding and Topstep implement consistency rules to ensure that traders demonstrate repeatable, risk-managed trading edge rather than relying on high-risk, "windfall" jackpot trades (such as gambling full lot size on high-impact NFP or CPI news events).
              </p>
              <div className="bg-slate-950 p-5 rounded-2xl border border-purple-500/30 space-y-2">
                <div className="text-xs text-purple-400 font-bold uppercase tracking-wider">Golden Consistency Formula</div>
                <div className="font-mono text-base sm:text-lg font-black text-emerald-400 text-center py-2 bg-slate-900 rounded-xl border border-slate-800">
                  Max Single Day Profit Allowed = Total Cumulative Profit × 0.30
                </div>
                <p className="text-xs text-slate-400 text-center">
                  If your highest single-day profit exceeds this threshold, your account is NOT forfeited, but your payout request will be declined until you earn more profits on other trading days to balance out the ratio.
                </p>
              </div>
            </div>

            {/* SECTION 2: MATHEMATICAL DEEP DIVE WITH WORKED EXAMPLES */}
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-purple-400">
                2. Step-by-Step Mathematical Examples: Calculating Apex Payout Eligibility
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Let's analyze two realistic trading scenarios on a standard <strong>$50,000 Apex PA Account</strong> to see how the 30% consistency rule applies in practice:
              </p>
              
              {/* EXAMPLE CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SCENARIO A */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">Scenario A: Consistency Violation (Locked Payout)</div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>Starting Account Balance: <strong>$50,000</strong></li>
                    <li>Day 1 Profit: <strong>+$1,800</strong> (Windfall Day)</li>
                    <li>Day 2 Profit: <strong>+$300</strong></li>
                    <li>Day 3 Profit: <strong>+$400</strong></li>
                    <li>Day 4 Profit: <strong>+$500</strong></li>
                    <li>Total Cumulative Profit: <strong>$3,000</strong></li>
                  </ul>
                  <div className="bg-rose-950/40 border border-rose-500/30 p-3 rounded-xl text-xs space-y-1">
                    <p className="text-slate-300"><strong>Max Single Day Share:</strong> $1,800 / $3,000 = <strong className="text-rose-400 font-mono">60.0%</strong> (Exceeds 30% Cap!)</p>
                    <p className="text-slate-300"><strong>Max Allowed for Payout:</strong> $3,000 × 0.30 = <strong>$900</strong></p>
                    <p className="text-slate-300"><strong>Required Total Profit Needed:</strong> $1,800 / 0.30 = <strong className="text-purple-300 font-mono">$6,000</strong></p>
                    <p className="font-bold text-rose-300">❌ Result: Payout Blocked! Needs +$3,000 additional profit across future days.</p>
                  </div>
                </div>

                {/* SCENARIO B */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Scenario B: Fully Compliant (Approved Payout)</div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>Starting Account Balance: <strong>$50,000</strong></li>
                    <li>Day 1 Profit: <strong>+$800</strong></li>
                    <li>Day 2 Profit: <strong>+$900</strong> (Highest Single Day)</li>
                    <li>Day 3 Profit: <strong>+$750</strong></li>
                    <li>Day 4 Profit: <strong>+$850</strong></li>
                    <li>Total Cumulative Profit: <strong>$3,300</strong></li>
                  </ul>
                  <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl text-xs space-y-1">
                    <p className="text-slate-300"><strong>Max Single Day Share:</strong> $900 / $3,300 = <strong className="text-emerald-400 font-mono">27.27%</strong> (Well Under 30%)</p>
                    <p className="text-slate-300"><strong>Max Allowed for Payout:</strong> $3,300 × 0.30 = <strong>$990</strong></p>
                    <p className="text-slate-300"><strong>Safety Cushion:</strong> $990 - $900 = <strong>+$90 headroom</strong></p>
                    <p className="font-bold text-emerald-300">✅ Result: Payout Approved! Ready for request.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: INTRADAY PEAK EQUITY TRAILING DRAWDOWN */}
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-purple-400">
                3. The Intraday Peak Equity Trailing Drawdown Mechanics (High-Water Mark Trap)
              </h3>
              <p className="text-slate-300 leading-relaxed">
                The most challenging technical aspect of Apex Trader Funding evaluations is the <strong>Live Intraday Peak Equity Trailing Threshold</strong>. Unlike standard End-of-Day (EOD) drawdowns that evaluate your balance after the 5:00 PM EST market close, Apex's threshold trails your account balance <strong>in real time during live trade execution</strong> based on your account's peak unrealized high-water mark.
              </p>
              
              <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/30 space-y-3">
                <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <span>⚠️ Real-World Trailing Drawdown Anatomy</span>
                </h4>
                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>You start a <strong>$50,000 account</strong> with a $2,500 trailing drawdown buffer (Initial liquidation line = <strong>$47,500</strong>).</li>
                  <li>You enter an NQ futures position. During the trade, price surges up and your unrealized floating profit reaches <strong>+$2,000</strong> (Peak Account Equity = <strong>$52,000</strong>).</li>
                  <li>The Apex trailing threshold instantly ratchets UP by $2,000 to <strong>$49,500</strong> ($52,000 peak minus $2,500 drawdown).</li>
                  <li>Market suddenly reverses. You hold out hoping for a rebound and close the trade at <strong>Breakeven ($50,000 balance)</strong>.</li>
                  <li><strong>The Trap:</strong> Even though your closed balance is still $50,000, your liquidation line stays locked at <strong>$49,500</strong>! Your remaining allowable drawdown cushion shrinks from $2,500 down to just <strong>$500</strong>!</li>
                </ol>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="font-bold text-purple-300">When Does the Apex Trailing Threshold Stop Trailing?</div>
                <p>
                  For Apex PA accounts, the trailing threshold <strong>stops trailing permanently</strong> once the liquidation line reaches your starting balance plus the $100 safety cap. For a $50k account, the threshold stops at <strong>$50,100</strong>. Once your account balance moves above this point, your liquidation line stays permanently at $50,100, allowing you to build an unlimited equity safety cushion above it.
                </p>
              </div>
            </div>

            {/* SECTION 4: APEX VS TOPSTEP COMPARISON */}
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-purple-400">
                4. Apex Trader Funding vs. Topstep Consistency Rule Comparison (2026 Rules)
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Both Apex and Topstep are leading futures prop trading firms, but they differ significantly in how they enforce consistency guidelines and drawdown thresholds:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-300 border-collapse border border-slate-800">
                  <thead>
                    <tr className="bg-slate-950 text-slate-200 border-b border-slate-800">
                      <th className="p-3 border-r border-slate-800 font-bold">Rule Feature</th>
                      <th className="p-3 border-r border-slate-800 font-bold text-purple-400">Apex Trader Funding</th>
                      <th className="p-3 font-bold text-indigo-400">Topstep</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                    <tr>
                      <td className="p-3 border-r border-slate-800 font-semibold text-white">Consistency Rule Target</td>
                      <td className="p-3 border-r border-slate-800"><strong>30% Max Single Day</strong> (Applied to PA Payout Requests)</td>
                      <td className="p-3"><strong>50% Best Day Rule</strong> (Applied during Evaluation phase)</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-r border-slate-800 font-semibold text-white">Drawdown Evaluation Method</td>
                      <td className="p-3 border-r border-slate-800 font-semibold text-amber-400">Real-Time Intraday Peak Equity (High-Water Mark)</td>
                      <td className="p-3 font-semibold text-emerald-400">End-of-Day (EOD) Account Balance Drawdown</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-r border-slate-800 font-semibold text-white">Trailing Threshold Stop Point</td>
                      <td className="p-3 border-r border-slate-800">Locks at Starting Balance + $100 Safety Cap</td>
                      <td className="p-3">Locks at Starting Balance (Maximum Drawdown cap)</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-r border-slate-800 font-semibold text-white">Payout Minimum Days</td>
                      <td className="p-3 border-r border-slate-800">10 Minimum Trading Days per payout request window</td>
                      <td className="p-3">5 Minimum Winning Trading Days ($200+ profit per day)</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-r border-slate-800 font-semibold text-white">Action on Rule Violation</td>
                      <td className="p-3 border-r border-slate-800 text-purple-300">Payout blocked until additional profit dilutes percentage</td>
                      <td className="p-3 text-indigo-300">Evaluation not passed until additional trading balances daily ratio</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 5: 5 RISK MANAGEMENT STRATEGIES */}
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-purple-400">
                5. Top 5 Risk Management Rules to Master Apex & Topstep Accounts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="font-bold text-purple-300">1. Cap Daily Profits at 20-25% of Account Target</div>
                  <p className="text-slate-400">Never allow a single trading day to exceed 20-25% of your total target. Stop trading when you hit your daily profit cap to guarantee 30% consistency compliance effortless.</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="font-bold text-purple-300">2. Trail Stop-Losses, Don't Let Winners Revert</div>
                  <p className="text-slate-400">Because intraday high-water marks push your liquidation line up immediately, use trailing stops to lock in profits early. Never let a +$1,000 unrealized trade turn into a loss.</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="font-bold text-purple-300">3. Scale Down Contract Size (Use Micro Futures)</div>
                  <p className="text-slate-400">Trade MNQ/MES micro contracts instead of full NQ/ES mini contracts. Micro lots allow precise risk scaling, smoother equity curves, and prevent sudden large single-day profit spikes.</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="font-bold text-purple-300">4. Monitor Peak Equity Cushion Live</div>
                  <p className="text-slate-400">Always track your peak equity high-water mark rather than just your closed account balance. Ensure your stop-loss distantly exceeds your trailing liquidation line.</p>
                </div>
              </div>
            </div>

            {/* SECTION 6: FAQ ACCORDION SECTION */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-xl sm:text-2xl font-bold text-purple-400">
                Frequently Asked Questions (FAQ) — Prop Firm Rules & Calculations
              </h3>
              
              <div className="space-y-3">
                <div className="border border-slate-800 rounded-2xl p-5 bg-slate-950/60 space-y-2">
                  <h5 className="font-bold text-white text-sm">What is the 30% Consistency Rule in Apex Trader Funding?</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The 30% Consistency Rule in Apex Trader Funding requires that no single trading day accounts for more than 30% of your total accumulated profit at the time of requesting a payout. If a single day exceeds 30%, you must continue trading to make additional profit on other days until the highest day becomes 30% or less of total profits.
                  </p>
                </div>

                <div className="border border-slate-800 rounded-2xl p-5 bg-slate-950/60 space-y-2">
                  <h5 className="font-bold text-white text-sm">How does Apex trailing threshold intraday drawdown work?</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Apex trailing drawdown trails your account in real-time based on intraday peak equity (high water mark), including unrealized profits during open trades. The trailing threshold stops trailing once the stop-out line reaches starting balance plus $100 safety cap.
                  </p>
                </div>

                <div className="border border-slate-800 rounded-2xl p-5 bg-slate-950/60 space-y-2">
                  <h5 className="font-bold text-white text-sm">How to calculate additional profit needed to pass Apex 30% rule?</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The formula for required total profit is: <code className="text-purple-300 bg-slate-900 px-1.5 py-0.5 rounded">Required Total Profit = Highest Single Day Profit / 0.30</code>. The additional profit needed = Required Total Profit - Current Total Profit.
                  </p>
                </div>

                <div className="border border-slate-800 rounded-2xl p-5 bg-slate-950/60 space-y-2">
                  <h5 className="font-bold text-white text-sm">Does the 30% consistency rule apply to evaluation or PA accounts?</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The 30% consistency rule applies specifically to Performance Accounts (PA) when requesting payouts. Evaluation accounts do not require 30% consistency to pass, though maintaining steady daily profits builds good habits for PA accounts.
                  </p>
                </div>

                <div className="border border-slate-800 rounded-2xl p-5 bg-slate-950/60 space-y-2">
                  <h5 className="font-bold text-white text-sm">When does the Apex trailing threshold stop trailing permanently?</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    For Apex PA accounts, once your threshold reaches starting balance plus $100 (e.g. $50,100 for a $50k account), it stops trailing and locks permanently at that level.
                  </p>
                </div>

                <div className="border border-slate-800 rounded-2xl p-5 bg-slate-950/60 space-y-2">
                  <h5 className="font-bold text-white text-sm">How is Topstep Consistency Rule different from Apex?</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Topstep uses a 50% consistency rule during evaluations (no single day can exceed 50% of total profit) whereas Apex enforces a 30% consistency rule on PA payout requests. Both encourage steady, sustainable profit distribution.
                  </p>
                </div>

                <div className="border border-slate-800 rounded-2xl p-5 bg-slate-950/60 space-y-2">
                  <h5 className="font-bold text-white text-sm">What happens if I make 50% of my total profit on Day 1 of an Apex PA account?</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your account is not penalized or forfeited. However, you will not be able to request a payout until you trade additional days and earn enough total profit so that Day 1 is 30% or less of your cumulative profit.
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
