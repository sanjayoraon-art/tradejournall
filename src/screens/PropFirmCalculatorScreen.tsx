import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Calculator,
  ShieldAlert,
  Clock,
  ArrowRight,
  Sparkles,
  Share2,
  Copy,
  Check,
  RotateCcw,
  Info,
  ExternalLink,
  ArrowLeft,
  AlertTriangle,
  Zap,
  Download,
  Percent,
  DollarSign,
  Layers,
  Activity,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { formatNumber } from '../utils/helpers';

interface PropFirmCalculatorScreenProps {
  theme: any;
  isDarkMode: boolean;
  primaryCurrencySymbol?: string;
  onBackToLanding?: () => void;
  onSignIn?: () => void;
  onLogTrade?: (tradeData: { symbol: string; entryPrice: number; exitPrice: number; pnl: number; type: 'Long' | 'Short' }) => void;
}

// Preset definitions for Top Prop Firms
export interface PropFirmPreset {
  id: string;
  name: string;
  maxDailyPercent: number;
  maxOverallPercent: number;
  dailyLossType: 'balance' | 'equity_high';
  overallLossType: 'static' | 'trailing';
  resetTimezone: 'UTC' | 'CEST' | 'CE(S)T';
  badgeColor: string;
  description: string;
}

export const PROP_FIRM_PRESETS: PropFirmPreset[] = [
  {
    id: 'ftmo',
    name: 'FTMO',
    maxDailyPercent: 5,
    maxOverallPercent: 10,
    dailyLossType: 'balance',
    overallLossType: 'static',
    resetTimezone: 'CE(S)T',
    badgeColor: 'from-emerald-500 to-teal-600',
    description: '5% Daily Loss (00:00 CE(S)T reset), 10% Max Overall Loss based on initial balance.'
  },
  {
    id: 'funding-pips',
    name: 'Funding Pips',
    maxDailyPercent: 5,
    maxOverallPercent: 10,
    dailyLossType: 'equity_high',
    overallLossType: 'static',
    resetTimezone: 'UTC',
    badgeColor: 'from-blue-500 to-indigo-600',
    description: '5% Daily Loss (higher of Day Start Balance or Equity at 00:00 UTC), 10% Max Loss.'
  },
  {
    id: 'fundednext',
    name: 'FundedNext',
    maxDailyPercent: 5,
    maxOverallPercent: 10,
    dailyLossType: 'balance',
    overallLossType: 'static',
    resetTimezone: 'UTC',
    badgeColor: 'from-purple-500 to-indigo-700',
    description: '5% Balance/Equity Daily Loss, 10% Max Overall Loss static drawdown.'
  },
  {
    id: 'e8-markets',
    name: 'E8 Markets',
    maxDailyPercent: 4,
    maxOverallPercent: 8,
    dailyLossType: 'equity_high',
    overallLossType: 'trailing',
    resetTimezone: 'UTC',
    badgeColor: 'from-amber-500 to-orange-600',
    description: '4% Daily Loss (equity based), 8% Max Trailing Drawdown.'
  },
  {
    id: 'custom',
    name: 'Custom Mode',
    maxDailyPercent: 5,
    maxOverallPercent: 10,
    dailyLossType: 'balance',
    overallLossType: 'static',
    resetTimezone: 'UTC',
    badgeColor: 'from-gray-600 to-slate-700',
    description: 'Fully customizable daily loss %, max loss %, and drawdown calculation rules.'
  }
];

export interface InstrumentPair {
  symbol: string;
  name: string;
  category: 'Forex' | 'Metals' | 'Crypto' | 'Indices' | 'Custom';
  pipValuePerLot: number; // Value in USD per 1 standard lot per 1 pip/point
  pipStep: number; // e.g. 0.0001 for Forex, 0.1 for Gold, 1.0 for Indices/Crypto
  unitName: 'pips' | 'points';
}

export const INSTRUMENT_PAIRS: InstrumentPair[] = [
  { symbol: 'EUR/USD', name: 'EUR/USD (Forex)', category: 'Forex', pipValuePerLot: 10.0, pipStep: 0.0001, unitName: 'pips' },
  { symbol: 'GBP/USD', name: 'GBP/USD (Forex)', category: 'Forex', pipValuePerLot: 10.0, pipStep: 0.0001, unitName: 'pips' },
  { symbol: 'USD/JPY', name: 'USD/JPY (Forex)', category: 'Forex', pipValuePerLot: 9.0, pipStep: 0.01, unitName: 'pips' },
  { symbol: 'AUD/USD', name: 'AUD/USD (Forex)', category: 'Forex', pipValuePerLot: 10.0, pipStep: 0.0001, unitName: 'pips' },
  { symbol: 'XAU/USD', name: 'XAU/USD (Gold)', category: 'Metals', pipValuePerLot: 10.0, pipStep: 0.10, unitName: 'pips' },
  { symbol: 'BTC/USDT', name: 'BTC/USDT (Bitcoin)', category: 'Crypto', pipValuePerLot: 1.0, pipStep: 1.0, unitName: 'points' },
  { symbol: 'US30', name: 'US30 (Dow Jones)', category: 'Indices', pipValuePerLot: 1.0, pipStep: 1.0, unitName: 'points' },
  { symbol: 'NAS100', name: 'NAS100 (Nasdaq)', category: 'Indices', pipValuePerLot: 1.0, pipStep: 1.0, unitName: 'points' },
  { symbol: 'NIFTY50', name: 'NIFTY 50 (Index)', category: 'Indices', pipValuePerLot: 1.0, pipStep: 1.0, unitName: 'points' },
  { symbol: 'BANKNIFTY', name: 'BANK NIFTY (Index)', category: 'Indices', pipValuePerLot: 1.0, pipStep: 1.0, unitName: 'points' },
  { symbol: 'CUSTOM', name: 'Custom Instrument...', category: 'Custom', pipValuePerLot: 10.0, pipStep: 1.0, unitName: 'pips' }
];

export const CAPITAL_PRESETS = [5000, 10000, 25000, 50000, 100000, 200000];

export const PropFirmCalculatorScreen: React.FC<PropFirmCalculatorScreenProps> = ({
  theme,
  isDarkMode,
  primaryCurrencySymbol = '$',
  onBackToLanding,
  onSignIn,
  onLogTrade
}) => {
  // Parse URL search params or path for presets
  const getInitialParams = () => {
    const path = window.location.pathname.toLowerCase();
    const isToolPage = path.includes('/tools/') || path.includes('/calculators/');

    if (!isToolPage) {
      return { firmId: 'ftmo', capital: 100000, balance: 100000, equity: 100000, pair: 'EUR/USD', sl: 20 };
    }

    const search = new URLSearchParams(window.location.search);

    let firmId = 'ftmo';
    if (path.includes('funding-pips') || search.get('firm') === 'funding-pips') firmId = 'funding-pips';
    else if (path.includes('fundednext') || search.get('firm') === 'fundednext') firmId = 'fundednext';
    else if (path.includes('e8') || search.get('firm') === 'e8-markets') firmId = 'e8-markets';
    else if (path.includes('custom') || search.get('firm') === 'custom') firmId = 'custom';
    else if (search.get('firm')) firmId = search.get('firm') || 'ftmo';

    const capital = parseFloat(search.get('capital') || '100000') || 100000;
    const balance = parseFloat(search.get('balance') || capital.toString()) || capital;
    const equity = parseFloat(search.get('equity') || balance.toString()) || balance;
    const pair = search.get('pair') || 'EUR/USD';
    const sl = parseFloat(search.get('sl') || '20') || 20;

    return { firmId, capital, balance, equity, pair, sl };
  };

  const initialValues = getInitialParams();

  // State Variables
  const [selectedFirmId, setSelectedFirmId] = useState<string>(initialValues.firmId);
  const [accountCapital, setAccountCapital] = useState<number>(initialValues.capital);
  const [customCapitalInput, setCustomCapitalInput] = useState<string>(
    CAPITAL_PRESETS.includes(initialValues.capital) ? '' : initialValues.capital.toString()
  );
  const [isCustomCapital, setIsCustomCapital] = useState<boolean>(!CAPITAL_PRESETS.includes(initialValues.capital));

  const [startingDayBalance, setStartingDayBalance] = useState<number>(initialValues.balance);
  const [currentEquity, setCurrentEquity] = useState<number>(initialValues.equity);

  // Custom Prop Firm Rule Overrides
  const [customDailyPercent, setCustomDailyPercent] = useState<number>(5);
  const [customOverallPercent, setCustomOverallPercent] = useState<number>(10);
  const [customDailyLossType, setCustomDailyLossType] = useState<'balance' | 'equity_high'>('balance');

  // Trade Execution Settings
  const [selectedSymbol, setSelectedSymbol] = useState<string>(initialValues.pair);
  const [customPipValue, setCustomPipValue] = useState<number>(10);
  const [stopLossValue, setStopLossValue] = useState<number>(initialValues.sl);
  const [riskPercentPerTrade, setRiskPercentPerTrade] = useState<number>(1.0); // % of equity desired to risk

  // Reset Timer state
  const [resetTimezone, setResetTimezone] = useState<'UTC' | 'CEST'>('UTC');
  const [timeUntilReset, setTimeUntilReset] = useState<{ hours: string; minutes: string; seconds: string }>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  // UX Feedback states
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Current Prop Firm Object
  const currentFirm = useMemo(() => {
    return PROP_FIRM_PRESETS.find(f => f.id === selectedFirmId) || PROP_FIRM_PRESETS[0];
  }, [selectedFirmId]);

  // Current Instrument Pair Object
  const currentPairObj = useMemo(() => {
    return INSTRUMENT_PAIRS.find(p => p.symbol === selectedSymbol) || INSTRUMENT_PAIRS[0];
  }, [selectedSymbol]);

  // Effective Percentages & Rules based on Firm or Custom
  const effectiveMaxDailyPercent = selectedFirmId === 'custom' ? customDailyPercent : currentFirm.maxDailyPercent;
  const effectiveMaxOverallPercent = selectedFirmId === 'custom' ? customOverallPercent : currentFirm.maxOverallPercent;
  const effectiveDailyLossType = selectedFirmId === 'custom' ? customDailyLossType : currentFirm.dailyLossType;

  // Sync URL replacement without full page reload
  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    // Only update query params if currently on a dedicated tool/calculator route
    if (!path.includes('/tools/') && !path.includes('/calculators/')) {
      return;
    }

    const params = new URLSearchParams();
    params.set('firm', selectedFirmId);
    params.set('capital', accountCapital.toString());
    params.set('balance', startingDayBalance.toString());
    params.set('equity', currentEquity.toString());
    params.set('pair', selectedSymbol);
    params.set('sl', stopLossValue.toString());

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [selectedFirmId, accountCapital, startingDayBalance, currentEquity, selectedSymbol, stopLossValue]);

  // Dynamic SEO Title & Meta update & JSON-LD Injection
  useEffect(() => {
    const titleText = `${currentFirm.name} Prop Firm Calculator | Drawdown & Lot Size Calculator — TradeJournal`;
    document.title = titleText;

    // Inject JSON-LD Rich Snippet
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': `${currentFirm.name} Prop Firm Challenge Calculator`,
      'operatingSystem': 'All',
      'applicationCategory': 'FinanceApplication',
      'description': `Calculate daily drawdown limits, overall maximum drawdown buffer, and maximum position lot size for ${currentFirm.name} and other prop trading evaluation challenges.`,
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'author': {
        '@type': 'Organization',
        'name': 'TradeJournal',
        'url': 'https://tradejournall.com'
      }
    };

    let scriptTag = document.getElementById('prop-firm-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'prop-firm-schema';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemaData);
  }, [currentFirm]);

  // Live Countdown Clock Timer logic for 00:00 UTC / CEST
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      let target = new Date();

      if (resetTimezone === 'CEST') {
        // Paris / Prague / CEST Time offset approx UTC+2
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const cestNow = new Date(utc + (3600000 * 2));
        target = new Date(cestNow);
        target.setHours(24, 0, 0, 0);
        const diff = target.getTime() - cestNow.getTime();

        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeUntilReset({
          hours: String(h).padStart(2, '0'),
          minutes: String(m).padStart(2, '0'),
          seconds: String(s).padStart(2, '0')
        });
      } else {
        // 00:00 UTC Standard
        const utcHours = now.getUTCHours();
        const utcMinutes = now.getUTCMinutes();
        const utcSeconds = now.getUTCSeconds();

        const totalSecondsLeft = (23 - utcHours) * 3600 + (59 - utcMinutes) * 60 + (59 - utcSeconds);
        const h = Math.floor(totalSecondsLeft / 3600);
        const m = Math.floor((totalSecondsLeft % 3600) / 60);
        const s = totalSecondsLeft % 60;

        setTimeUntilReset({
          hours: String(h).padStart(2, '0'),
          minutes: String(m).padStart(2, '0'),
          seconds: String(s).padStart(2, '0')
        });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [resetTimezone]);

  // ----------------------------------------------------
  // CALCULATION ENGINE LOGIC
  // ----------------------------------------------------
  const calculations = useMemo(() => {
    const cap = Math.max(0, accountCapital);
    const startBal = Math.max(0, startingDayBalance);
    const eq = Math.max(0, currentEquity);

    // 1. Daily Drawdown
    // Base for daily loss (Start balance or equity if higher)
    const baseDailyBalance = effectiveDailyLossType === 'equity_high'
      ? Math.max(startBal, eq)
      : startBal;

    const dailyLossLimitDollars = baseDailyBalance * (effectiveMaxDailyPercent / 100);
    const maxDailyLossThreshold = baseDailyBalance - dailyLossLimitDollars;
    const remainingDailyBufferDollars = eq - maxDailyLossThreshold;
    const remainingDailyBufferPercent = startBal > 0 ? (remainingDailyBufferDollars / startBal) * 100 : 0;

    // 2. Overall Drawdown
    const overallLossLimitDollars = cap * (effectiveMaxOverallPercent / 100);
    const maxOverallLossThreshold = cap - overallLossLimitDollars;
    const remainingOverallBufferDollars = eq - maxOverallLossThreshold;
    const remainingOverallBufferPercent = cap > 0 ? (remainingOverallBufferDollars / cap) * 100 : 0;

    // 3. Effective Max Risk Allowed ($) before breach of ANY limit
    const effectiveRiskBuffer = Math.max(0, Math.min(remainingDailyBufferDollars, remainingOverallBufferDollars));

    // 4. Pip/Point Value Calculation
    const effectivePipValue = selectedSymbol === 'CUSTOM'
      ? Math.max(0.01, customPipValue)
      : currentPairObj.pipValuePerLot;

    // 5. Recommended Max Lot Sizes
    // A) Absolute Max Lot size allowed by drawdown limits (100% of remaining buffer)
    const absoluteMaxLot = (stopLossValue > 0 && effectivePipValue > 0 && effectiveRiskBuffer > 0)
      ? effectiveRiskBuffer / (stopLossValue * effectivePipValue)
      : 0;

    // B) Preferred Lot size based on user's target Risk % per trade
    const desiredRiskDollars = eq * (riskPercentPerTrade / 100);
    const cappedRiskDollars = Math.min(desiredRiskDollars, effectiveRiskBuffer);
    const recommendedLot = (stopLossValue > 0 && effectivePipValue > 0 && cappedRiskDollars > 0)
      ? cappedRiskDollars / (stopLossValue * effectivePipValue)
      : 0;

    // 6. Drawdown Risk Meter & Status Level
    const dailyLossUsedDollars = Math.max(0, baseDailyBalance - eq);
    const dailyUsedPercent = dailyLossLimitDollars > 0 ? (dailyLossUsedDollars / dailyLossLimitDollars) * 100 : 0;

    const overallLossUsedDollars = Math.max(0, cap - eq);
    const overallUsedPercent = overallLossLimitDollars > 0 ? (overallLossUsedDollars / overallLossLimitDollars) * 100 : 0;

    const maxUsagePercent = Math.max(0, Math.min(100, Math.max(dailyUsedPercent, overallUsedPercent)));

    let status: 'SAFE' | 'MODERATE' | 'NEAR_LIMIT' | 'BREACHED' = 'SAFE';
    if (remainingDailyBufferDollars <= 0 || remainingOverallBufferDollars <= 0) {
      status = 'BREACHED';
    } else if (maxUsagePercent >= 80) {
      status = 'NEAR_LIMIT';
    } else if (maxUsagePercent >= 50) {
      status = 'MODERATE';
    }

    return {
      dailyLossLimitDollars,
      maxDailyLossThreshold,
      remainingDailyBufferDollars,
      remainingDailyBufferPercent,
      overallLossLimitDollars,
      maxOverallLossThreshold,
      remainingOverallBufferDollars,
      remainingOverallBufferPercent,
      effectiveRiskBuffer,
      effectivePipValue,
      absoluteMaxLot,
      recommendedLot,
      desiredRiskDollars,
      cappedRiskDollars,
      dailyUsedPercent,
      overallUsedPercent,
      maxUsagePercent,
      status
    };
  }, [
    accountCapital,
    startingDayBalance,
    currentEquity,
    effectiveMaxDailyPercent,
    effectiveMaxOverallPercent,
    effectiveDailyLossType,
    selectedSymbol,
    customPipValue,
    currentPairObj,
    stopLossValue,
    riskPercentPerTrade
  ]);

  // Reset to Defaults
  const resetToDefaults = () => {
    setSelectedFirmId('ftmo');
    setAccountCapital(100000);
    setCustomCapitalInput('');
    setIsCustomCapital(false);
    setStartingDayBalance(100000);
    setCurrentEquity(100000);
    setSelectedSymbol('EUR/USD');
    setStopLossValue(20);
    setRiskPercentPerTrade(1.0);
  };

  // Copy shareable link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Copy structured channel summary
  const handleCopySummary = () => {
    const summaryText = `📊 PROP FIRM RISK SNAPSHOT (${currentFirm.name})
-----------------------------------------
💰 Account Capital: ${primaryCurrencySymbol}${formatNumber(accountCapital, 0)}
📈 Starting Day Balance: ${primaryCurrencySymbol}${formatNumber(startingDayBalance, 2)}
💵 Current Equity: ${primaryCurrencySymbol}${formatNumber(currentEquity, 2)}

🛡️ REMAINING DRAWDOWN BUFFERS:
• Daily Buffer: ${primaryCurrencySymbol}${formatNumber(calculations.remainingDailyBufferDollars, 2)} (${calculations.remainingDailyBufferPercent.toFixed(2)}%)
• Overall Buffer: ${primaryCurrencySymbol}${formatNumber(calculations.remainingOverallBufferDollars, 2)} (${calculations.remainingOverallBufferPercent.toFixed(2)}%)

⚡ TRADE RISK SETUP (${selectedSymbol}):
• Stop Loss: ${stopLossValue} ${currentPairObj.unitName}
• Desired Risk: ${riskPercentPerTrade}% (${primaryCurrencySymbol}${formatNumber(calculations.desiredRiskDollars, 2)})
🎯 RECOMMENDED MAX LOT SIZE: ${calculations.recommendedLot.toFixed(2)} Lots
⚠️ ABSOLUTE BREACH LIMIT: ${calculations.absoluteMaxLot.toFixed(2)} Lots
🚦 ACCOUNT STATUS: ${calculations.status.replace('_', ' ')} (${calculations.maxUsagePercent.toFixed(1)}% Drawdown Used)

Calculated live on TradeJournal.com 🚀`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="px-3 md:px-6 pb-24 pt-4 max-w-7xl mx-auto animate-in fade-in duration-500 font-sans">
      <Helmet>
        <title>Prop Firm Challenge Calculator & Pass Rate Simulator | TradeJournall</title>
        <meta
          name="description"
          content="Free Prop Firm Challenge Calculator & Pass Rate Simulator. Calculate daily drawdown limit, max overall loss, and safe lot sizes for FTMO, Funding Pips, Topstep, FundedNext & Apex."
        />
        <meta
          name="keywords"
          content="prop firm challenge calculator, prop firm pass rate calculator, ftmo challenge calculator, prop firm challenge simulator, funding pips calculator, topstep challenge calculator, tradejournall"
        />
        <link rel="canonical" href="https://tradejournall.com/tools/prop-firm-challenge-calculator" />
        <meta property="og:title" content="Prop Firm Challenge Calculator & Pass Rate Simulator" />
        <meta
          property="og:description"
          content="Free Prop Firm Challenge Calculator. Daily drawdown buffer, max loss threshold, and safe lot sizes for FTMO, Funding Pips, Topstep & Apex."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tradejournall.com/tools/prop-firm-challenge-calculator" />
      </Helmet>
      
      {/* 1. PUBLIC GUEST HEADER BAR */}
      {onBackToLanding && (
        <div className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl px-4 py-3 mb-6 flex items-center justify-between shadow-lg">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span>← Back to Home Page</span>
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-semibold hidden md:inline">
              Free Financial Trading Tool
            </span>
            {onSignIn && (
              <button
                onClick={onSignIn}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition shadow-md cursor-pointer"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. HERO TITLE BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-emerald-500 to-indigo-600 rounded-2xl shadow-lg shadow-emerald-500/20 text-slate-950">
            <ShieldAlert size={28} strokeWidth={2.5} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-2xl md:text-3xl font-black ${theme.text} tracking-tight`}>
                Prop Firm Challenge & Evaluation Rules Calculator
              </h1>
            </div>
            <p className="text-xs md:text-sm text-gray-400 font-medium mt-0.5">
              Calculate Daily Drawdown Buffer, Max Loss Threshold, and Safe Lot Sizes before executing trades.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleCopyLink}
            className={`px-3 py-2 rounded-xl border ${theme.border} ${theme.card} hover:bg-slate-700/50 text-gray-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95`}
            title="Share Direct Link"
          >
            {copiedLink ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Setup'}</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-emerald-400 text-xs font-extrabold flex items-center gap-1.5 transition active:scale-95 shadow-md"
            title="Copy Text Summary for Discord/Telegram"
          >
            {copiedSummary ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            <span>{copiedSummary ? 'Summary Copied!' : 'Copy Summary Card'}</span>
          </button>

          <button
            onClick={resetToDefaults}
            className={`p-2.5 rounded-xl border ${theme.border} ${theme.card} hover:bg-slate-700/50 text-gray-400 hover:text-white transition active:scale-95`}
            title="Reset Calculator"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* 3. PROP FIRM SELECTION PRESETS TABS */}
      <div className="mb-6">
        <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2.5">
          Select Prop Firm Evaluation Preset
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {PROP_FIRM_PRESETS.map((firm) => {
            const isSelected = selectedFirmId === firm.id;
            return (
              <button
                key={firm.id}
                onClick={() => {
                  setSelectedFirmId(firm.id);
                  if (firm.id !== 'custom') {
                    setCustomDailyPercent(firm.maxDailyPercent);
                    setCustomOverallPercent(firm.maxOverallPercent);
                    setCustomDailyLossType(firm.dailyLossType);
                  }
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500'
                    : 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500/20 rounded-bl-2xl flex items-center justify-center">
                    <Check size={14} className="text-emerald-400 font-bold" />
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-sm text-white tracking-wide">{firm.name}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-gray-400 space-x-1">
                    <span className="text-emerald-400">{firm.maxDailyPercent}% Daily</span>
                    <span>•</span>
                    <span className="text-indigo-400">{firm.maxOverallPercent}% Max</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-700/50 text-[10px] text-gray-500 font-medium line-clamp-1">
                  {firm.resetTimezone} Reset
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. MAIN TWO-COLUMN RESPONSIVE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: INPUT PARAMETERS FORM (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* CARD 1: ACCOUNT & DRAWDOWN PARAMETERS */}
          <div className={`${theme.card} p-5 md:p-6 rounded-3xl border ${theme.border} shadow-xl relative overflow-hidden`}>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <DollarSign size={20} className="text-emerald-400" />
                <h2 className="text-base font-extrabold text-white">Account & Balance Parameters</h2>
              </div>
              <span className="text-[11px] font-bold text-gray-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700">
                Preset: {currentFirm.name}
              </span>
            </div>

            <div className="space-y-4">
              {/* Account Capital Preset Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Prop Firm Account Size ($)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                  {CAPITAL_PRESETS.map((cap) => {
                    const isActive = !isCustomCapital && accountCapital === cap;
                    return (
                      <button
                        key={cap}
                        type="button"
                        onClick={() => {
                          setAccountCapital(cap);
                          setIsCustomCapital(false);
                          // Auto set starting balance if equal to initial capital
                          if (startingDayBalance === accountCapital) setStartingDayBalance(cap);
                          if (currentEquity === accountCapital) setCurrentEquity(cap);
                        }}
                        className={`py-2 px-2 rounded-xl text-xs font-extrabold transition-all border ${
                          isActive
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                            : 'bg-slate-900/60 text-gray-300 border-slate-700 hover:bg-slate-800'
                        }`}
                      >
                        ${formatNumber(cap, 0)}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Capital Checkbox / Input */}
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCustomCapital(!isCustomCapital)}
                    className={`text-xs font-bold transition flex items-center gap-1.5 ${
                      isCustomCapital ? 'text-emerald-400' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <span>Custom Account Size</span>
                  </button>
                  {isCustomCapital && (
                    <input
                      type="number"
                      value={customCapitalInput}
                      onChange={(e) => {
                        setCustomCapitalInput(e.target.value);
                        const val = parseFloat(e.target.value) || 0;
                        setAccountCapital(val);
                      }}
                      placeholder="Enter custom capital e.g. 300000"
                      className="flex-1 bg-slate-900 border border-emerald-500/60 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                  )}
                </div>
              </div>

              {/* Starting Day Balance & Current Equity Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Starting Day Balance ($)</span>
                    <span className="text-[10px] text-gray-500 font-normal">Balance at 00:00 Reset</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                    <input
                      type="number"
                      step="any"
                      value={startingDayBalance}
                      onChange={(e) => setStartingDayBalance(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl pl-8 pr-4 py-2.5 text-sm font-extrabold text-white font-mono transition focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Current Equity / Balance ($)</span>
                    <span className="text-[10px] text-gray-500 font-normal">Live Open P&L</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                    <input
                      type="number"
                      step="any"
                      value={currentEquity}
                      onChange={(e) => setCurrentEquity(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl pl-8 pr-4 py-2.5 text-sm font-extrabold text-white font-mono transition focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Equity Adjustment Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                <span className="text-[11px] text-gray-400 font-semibold mr-1">Quick Equity Test:</span>
                <button
                  type="button"
                  onClick={() => setCurrentEquity(startingDayBalance)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-gray-500 text-gray-300 font-mono text-[11px]"
                >
                  Break Even ($0 P&L)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentEquity(startingDayBalance + (accountCapital * 0.02))}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 font-mono text-[11px]"
                >
                  +2% Profit
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentEquity(startingDayBalance - (accountCapital * 0.03))}
                  className="px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-800/60 text-red-400 font-mono text-[11px]"
                >
                  -3% Loss
                </button>
              </div>

              {/* Custom Firm Rule Overrides Panel */}
              {selectedFirmId === 'custom' && (
                <div className="mt-4 p-4 rounded-2xl bg-slate-900/80 border border-amber-500/40 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <Sparkles size={16} />
                    <span>Custom Rules Configuration</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Max Daily Loss %</label>
                      <input
                        type="number"
                        step="0.5"
                        value={customDailyPercent}
                        onChange={(e) => setCustomDailyPercent(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Max Overall Loss %</label>
                      <input
                        type="number"
                        step="0.5"
                        value={customOverallPercent}
                        onChange={(e) => setCustomOverallPercent(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CARD 2: PLANNED TRADE & PAIR SPECIFICATIONS */}
          <div className={`${theme.card} p-5 md:p-6 rounded-3xl border ${theme.border} shadow-xl`}>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <Calculator size={20} className="text-indigo-400" />
                <h2 className="text-base font-extrabold text-white">Planned Trade Specifications</h2>
              </div>
              <span className="text-[11px] font-bold text-indigo-400 bg-indigo-950/40 px-2.5 py-1 rounded-lg border border-indigo-800/50">
                Lot Sizing Engine
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Instrument Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Traded Instrument / Pair
                </label>
                <select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm font-extrabold text-white transition focus:outline-none"
                >
                  {INSTRUMENT_PAIRS.map((pair) => (
                    <option key={pair.symbol} value={pair.symbol}>
                      {pair.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Pip Value Input if Custom Symbol Selected */}
              {selectedSymbol === 'CUSTOM' ? (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Pip Value per 1 Lot ($)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={customPipValue}
                    onChange={(e) => setCustomPipValue(parseFloat(e.target.value) || 1)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-extrabold text-white font-mono"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Standard Lot Value</span>
                    <span className="text-[10px] text-gray-500">Auto-detected</span>
                  </label>
                  <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-300 flex items-center justify-between">
                    <span>1.00 Lot = ${calculations.effectivePipValue} / {currentPairObj.unitName}</span>
                    <span className="text-gray-500 uppercase text-[10px]">{currentPairObj.category}</span>
                  </div>
                </div>
              )}

              {/* Planned Stop Loss (Pips/Points) */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Planned Stop Loss ({currentPairObj.unitName})</span>
                  <span className="text-[10px] text-indigo-400 font-semibold">Risk Distance</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="0.1"
                    value={stopLossValue}
                    onChange={(e) => setStopLossValue(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm font-extrabold text-white font-mono focus:outline-none"
                    placeholder="e.g. 20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 uppercase">
                    {currentPairObj.unitName}
                  </span>
                </div>
              </div>

              {/* Desired Risk % per trade */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Desired Risk per Trade (% Equity)</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">${formatNumber(calculations.desiredRiskDollars, 2)}</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.25"
                    min="0.1"
                    max="10"
                    value={riskPercentPerTrade}
                    onChange={(e) => setRiskPercentPerTrade(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm font-extrabold text-white font-mono focus:outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE LIVE RESULTS & RISK GAUGE (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">

          {/* MAIN CALCULATION SUMMARY CARD */}
          <div className={`${theme.card} p-5 md:p-6 rounded-3xl border ${theme.border} shadow-2xl relative overflow-hidden`}>
            
            {/* TOP RISK STATUS BADGE */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                Account Status Gauge
              </span>

              {calculations.status === 'SAFE' && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black">
                  <CheckCircle2 size={14} />
                  <span>SAFE ZONE</span>
                </div>
              )}

              {calculations.status === 'MODERATE' && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-black">
                  <AlertTriangle size={14} />
                  <span>MODERATE RISK</span>
                </div>
              )}

              {calculations.status === 'NEAR_LIMIT' && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs font-black animate-pulse">
                  <AlertTriangle size={14} />
                  <span>NEAR LIMIT WARNING</span>
                </div>
              )}

              {calculations.status === 'BREACHED' && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-500 border border-red-500/40 text-xs font-black animate-bounce">
                  <XCircle size={14} />
                  <span>BREACH WARNING</span>
                </div>
              )}
            </div>

            {/* VISUAL COLOR-CODED RISK GAUGE BAR */}
            <div className="mb-6">
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-gray-400">Total Drawdown Consumed:</span>
                <span className={`font-mono text-sm ${
                  calculations.maxUsagePercent >= 80 ? 'text-red-400' : calculations.maxUsagePercent >= 50 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {calculations.maxUsagePercent.toFixed(1)}%
                </span>
              </div>

              {/* Multi-tier Bar */}
              <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700 relative">
                <div
                  style={{ width: `${Math.min(100, calculations.maxUsagePercent)}%` }}
                  className={`h-full rounded-full transition-all duration-700 ${
                    calculations.status === 'BREACHED'
                      ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]'
                      : calculations.maxUsagePercent >= 80
                      ? 'bg-gradient-to-r from-amber-500 to-red-500'
                      : calculations.maxUsagePercent >= 50
                      ? 'bg-gradient-to-r from-emerald-500 to-amber-500'
                      : 'bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]'
                  }`}
                />
              </div>
            </div>

            {/* DRAWDOWN BUFFERS BREAKDOWN */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Daily Drawdown Buffer */}
              <div className={`p-4 rounded-2xl border ${
                calculations.remainingDailyBufferDollars <= 0
                  ? 'bg-red-950/30 border-red-500/50'
                  : 'bg-slate-900/80 border-slate-700/80'
              }`}>
                <div className="flex items-center justify-between text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                  <span>Daily Buffer</span>
                  <span className="text-gray-500">Max {effectiveMaxDailyPercent}%</span>
                </div>
                <div className={`text-lg md:text-xl font-black font-mono tracking-tight ${
                  calculations.remainingDailyBufferDollars <= 0 ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {primaryCurrencySymbol}{formatNumber(calculations.remainingDailyBufferDollars, 2)}
                </div>
                <div className="text-[11px] text-gray-400 font-semibold mt-1">
                  {calculations.remainingDailyBufferPercent.toFixed(2)}% of Day Start
                </div>
              </div>

              {/* Overall Drawdown Buffer */}
              <div className={`p-4 rounded-2xl border ${
                calculations.remainingOverallBufferDollars <= 0
                  ? 'bg-red-950/30 border-red-500/50'
                  : 'bg-slate-900/80 border-slate-700/80'
              }`}>
                <div className="flex items-center justify-between text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                  <span>Overall Buffer</span>
                  <span className="text-gray-500">Max {effectiveMaxOverallPercent}%</span>
                </div>
                <div className={`text-lg md:text-xl font-black font-mono tracking-tight ${
                  calculations.remainingOverallBufferDollars <= 0 ? 'text-red-400' : 'text-indigo-400'
                }`}>
                  {primaryCurrencySymbol}{formatNumber(calculations.remainingOverallBufferDollars, 2)}
                </div>
                <div className="text-[11px] text-gray-400 font-semibold mt-1">
                  {calculations.remainingOverallBufferPercent.toFixed(2)}% of Capital
                </div>
              </div>
            </div>

            {/* RECOMMENDED MAX POSITION LOT SIZE HERO BOX */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-emerald-500/60 p-5 rounded-2xl shadow-xl mb-6 relative">
              <div className="absolute -top-3 right-4 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-widest px-3 py-0.5 rounded-full shadow-md">
                Recommended Trade Size
              </div>

              <div className="text-xs font-extrabold text-gray-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Zap size={16} className="text-amber-400 fill-amber-400" />
                <span>Max Allowed Position Lot Size</span>
              </div>

              <div className="flex items-baseline gap-3 my-2">
                <span className="text-4xl md:text-5xl font-black font-mono text-emerald-400 tracking-tight">
                  {calculations.recommendedLot.toFixed(2)}
                </span>
                <span className="text-sm font-bold text-gray-300">
                  Lots ({selectedSymbol})
                </span>
              </div>

              <div className="pt-2 border-t border-slate-700/70 text-xs text-gray-300 space-y-1">
                <div className="flex justify-between">
                  <span>Risk Amount at {stopLossValue} {currentPairObj.unitName} SL:</span>
                  <span className="font-mono font-bold text-white">${formatNumber(calculations.cappedRiskDollars, 2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Absolute Breach Limit ({stopLossValue} SL):</span>
                  <span className="font-mono font-semibold text-amber-400">{calculations.absoluteMaxLot.toFixed(2)} Lots</span>
                </div>
              </div>
            </div>

            {/* LIVE DAILY RESET COUNTDOWN CLOCK */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <span>Prop Daily Reset Clock</span>
                    <button
                      onClick={() => setResetTimezone(resetTimezone === 'UTC' ? 'CEST' : 'UTC')}
                      className="text-[10px] text-indigo-400 font-extrabold underline ml-1 cursor-pointer"
                    >
                      ({resetTimezone})
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 font-medium">Resets daily drawdown buffer</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-black font-mono text-indigo-400 tracking-wider">
                  {timeUntilReset.hours}:{timeUntilReset.minutes}:{timeUntilReset.seconds}
                </div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase">Remaining</div>
              </div>
            </div>

            {/* ACTION LOG TRADE SHORTCUT */}
            {onLogTrade && (
              <button
                onClick={() => onLogTrade({
                  symbol: selectedSymbol,
                  entryPrice: 0,
                  exitPrice: 0,
                  pnl: 0,
                  type: 'Long'
                })}
                className="mt-5 w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition active:scale-95 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <span>Log Trade Plan into Journal</span>
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 5. SUMMARY COMPARISON TABLE OF TOP PROP FIRM RULES */}
      <div className="mt-12">
        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <Layers size={22} className="text-emerald-400" />
          <span>Top Prop Firms Rules Comparison Reference Matrix</span>
        </h2>

        <div className="overflow-x-auto rounded-3xl border border-slate-700 bg-slate-800/80 shadow-xl">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-slate-900/90 text-gray-400 font-bold uppercase text-[11px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-4">Prop Firm</th>
                <th className="p-4">Max Daily Loss</th>
                <th className="p-4">Max Overall Loss</th>
                <th className="p-4">Daily Drawdown Calculation</th>
                <th className="p-4">Daily Reset Time</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-gray-300">
              {PROP_FIRM_PRESETS.filter(f => f.id !== 'custom').map((firm) => (
                <tr key={firm.id} className="hover:bg-slate-700/40 transition">
                  <td className="p-4 font-black text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
                    <span>{firm.name}</span>
                  </td>
                  <td className="p-4 font-mono font-bold text-emerald-400">{firm.maxDailyPercent}%</td>
                  <td className="p-4 font-mono font-bold text-indigo-400">{firm.maxOverallPercent}%</td>
                  <td className="p-4 text-gray-300">
                    {firm.dailyLossType === 'equity_high' ? 'Higher of Balance or Equity' : 'Starting Day Balance'}
                  </td>
                  <td className="p-4 font-mono">{firm.resetTimezone} (00:00)</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedFirmId(firm.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-emerald-400 text-xs font-bold transition cursor-pointer"
                    >
                      Use Preset
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. COMPREHENSIVE SEO ARTICLE & GUIDE FOR HIGH GOOGLE RANKING */}
      <article className="mt-12 p-6 md:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/80 shadow-2xl space-y-8 text-gray-300">
        <header className="border-b border-slate-700/60 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider mb-3">
            <BookOpen size={14} /> Masterclass Guide
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
            Prop Firm Challenge & Evaluation Rules: Ultimate Drawdown & Risk Guide
          </h2>
          <p className="text-xs md:text-sm text-gray-400 mt-2 font-medium">
            Learn how top prop trading firms calculate Daily Drawdown limits, Maximum Trailing Loss thresholds, and Safe Position Lot Sizes before executing orders.
          </p>
        </header>

        {/* Article Section 1 */}
        <section className="space-y-3">
          <h3 className="text-lg md:text-xl font-extrabold text-white flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span>1. Understanding Prop Firm Evaluation Challenge Rules</span>
          </h3>
          <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
            Proprietary trading firms (prop firms) like <strong className="text-white">FTMO</strong>, <strong className="text-white">Funding Pips</strong>, <strong className="text-white">FundedNext</strong>, and <strong className="text-white">E8 Markets</strong> offer funded accounts ranging from $5,000 to $200,000+. However, to get funded and keep your account, traders must strictly abide by two non-negotiable risk constraints:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs md:text-sm text-gray-300 pl-2">
            <li><strong className="text-emerald-400">Max Daily Loss Limit (typically 4% - 5%):</strong> The maximum P&L loss permitted within a single 24-hour daily cycle.</li>
            <li><strong className="text-indigo-400">Max Overall Loss Limit (typically 8% - 10%):</strong> The maximum cumulative equity drawdown permitted relative to your starting capital.</li>
          </ul>
        </section>

        {/* Article Section 2 */}
        <section className="space-y-3">
          <h3 className="text-lg md:text-xl font-extrabold text-white flex items-center gap-2">
            <Layers size={18} className="text-indigo-400" />
            <span>2. Balance-Based vs. Floating Equity-Based Daily Loss</span>
          </h3>
          <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
            Understanding how your firm calculates daily loss is the difference between passing and breaching an account:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80">
              <h4 className="font-bold text-sm text-emerald-400 mb-1">Starting Balance Reset (e.g. FTMO)</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Your daily drawdown limit is calculated based on your exact account balance at the daily reset time (00:00 CE(S)T). Floating open profits during the day do not increase your daily loss allowance.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80">
              <h4 className="font-bold text-sm text-indigo-400 mb-1">Higher of Balance/Equity (e.g. Funding Pips)</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Your daily loss baseline resets to whichever is higher between your start-of-day balance OR your floating equity peak at 00:00 UTC. If you carry floating gains past reset time, your daily drawdown buffer adjusts automatically.
              </p>
            </div>
          </div>
        </section>

        {/* Article Section 3 */}
        <section className="space-y-3">
          <h3 className="text-lg md:text-xl font-extrabold text-white flex items-center gap-2">
            <Calculator size={18} className="text-amber-400" />
            <span>3. Mathematical Formula for Max Allowed Position Lot Size</span>
          </h3>
          <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
            To prevent accidental daily limit breaches, use the institutional position lot size formula before placing market or limit orders:
          </p>
          <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 text-center font-mono text-xs md:text-sm text-emerald-400 font-extrabold shadow-inner">
            Max Lot Size = Effective Risk Buffer ($) ÷ (Stop Loss in Pips × Pip Value per 1.00 Lot)
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            For example, on a $100,000 account with $4,000 remaining daily buffer, trading EUR/USD with a 20-pip Stop Loss ($10/pip per lot): <br />
            <span className="font-mono text-white font-bold">Max Lot Size = $4,000 ÷ (20 × $10) = 20.00 Standard Lots.</span>
          </p>
        </section>

        {/* Article Section 4 */}
        <section className="space-y-3">
          <h3 className="text-lg md:text-xl font-extrabold text-white flex items-center gap-2">
            <Zap size={18} className="text-emerald-400" />
            <span>4. 5 Golden Rules to Avoid Breaching Prop Evaluation Accounts</span>
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-xs md:text-sm text-gray-300">
            <li><strong className="text-white">Cap Risk per Trade at 0.5% - 1.0%:</strong> Never risk more than 1% of account equity on a single setup.</li>
            <li><strong className="text-white">Maintain a 25% Daily Buffer Cushion:</strong> If your daily loss limit is $5,000, stop trading for the day when losses hit $3,750.</li>
            <li><strong className="text-white">Mind the 00:00 Reset Time:</strong> Close or manage floating positions before daily reset clock expires to avoid equity baseline shifts.</li>
            <li><strong className="text-white">Account for Swap and Commission Fees:</strong> Always factor in broker commissions ($3-$7 per lot) when placing tight stop losses.</li>
            <li><strong className="text-white">Log Trades Automatically in TradeJournal:</strong> Track your mental state, revenge trade triggers, and equity curves in real time.</li>
          </ol>
        </section>
      </article>

      {/* 7. EDUCATIONAL FAQ SECTION */}
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-black text-white mb-2 flex items-center gap-2">
          <HelpCircle size={22} className="text-indigo-400" />
          <span>Frequently Asked Questions (FAQ)</span>
        </h2>

        {[
          {
            q: "What is the difference between Balance-based and Equity-based Daily Loss?",
            a: "Balance-based daily drawdown calculates your maximum loss limit strictly based on your account balance at the daily reset time (00:00 UTC/CEST). Equity-based daily drawdown (used by firms like Funding Pips) calculates daily loss based on whichever is higher between your start-of-day balance OR your floating equity peak."
          },
          {
            q: "How is Maximum Allowed Lot Size calculated?",
            a: "Max Allowed Lot Size is calculated by dividing your remaining drawdown buffer ($) by the product of your Stop Loss (in pips/points) and the Pip Value per Lot ($). Formula: Lot Size = Remaining Buffer / (Stop Loss * Pip Value)."
          },
          {
            q: "When does the Prop Firm daily drawdown reset?",
            a: "Most major prop firms (FTMO, FundedNext, Funding Pips) reset their daily drawdown counter at 00:00 UTC or 00:00 CE(S)T. Any trades open past 00:00 automatically set the new day's starting equity baseline."
          },
          {
            q: "How can I avoid breaching prop firm drawdown limits?",
            a: "Always calculate your maximum lot size BEFORE entering a trade. Never risk more than 0.5% - 1% of your account per trade, and leave a safety buffer of at least 20-30% on your daily drawdown limit."
          }
        ].map((faq, idx) => {
          const isOpen = activeFaq === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-slate-800/80 border border-slate-700/80 overflow-hidden transition"
            >
              <button
                onClick={() => setActiveFaq(isOpen ? null : idx)}
                className="w-full text-left p-4 font-bold text-sm text-white flex items-center justify-between hover:bg-slate-700/50 transition cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="text-gray-400 text-lg font-bold">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="p-4 pt-0 text-xs md:text-sm text-gray-300 border-t border-slate-700/50 bg-slate-900/50 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 7. NON-INTRUSIVE CALL TO ACTION (CTA) BANNER */}
      <div className="mt-12 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-500/40 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Automatic Trading Journal</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Avoid Overtrading & Revenge Trades on Evaluation Accounts
          </h3>
          <p className="text-xs md:text-sm text-gray-300 max-w-2xl leading-relaxed">
            Log this setup automatically into TradeJournal. Track your win rates, mental state, and prop firm equity growth in real time.
          </p>
        </div>

        <button
          onClick={onSignIn || onBackToLanding}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-4 rounded-2xl text-sm transition transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-emerald-500/25 whitespace-nowrap cursor-pointer flex items-center gap-2"
        >
          <span>Start Free Trial</span>
          <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
};

export default PropFirmCalculatorScreen;
