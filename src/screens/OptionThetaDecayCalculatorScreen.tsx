import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Clock,
  Zap,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  Share2,
  Check,
  TrendingDown,
  Scale,
  ShieldAlert,
  Flame,
  HelpCircle,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Timer
} from 'lucide-react';

export interface OptionThetaDecayCalculatorScreenProps {
  theme?: any;
  isDarkMode?: boolean;
  primaryCurrencySymbol?: string;
  onBackToLanding?: () => void;
  onSignIn?: () => void;
  onLogTrade?: (tradeData: { symbol: string; entryPrice: number; exitPrice: number; pnl: number; type: 'Long' | 'Short' }) => void;
}

// Preset indices & lot sizes for Indian Derivatives Market
interface IndexPreset {
  name: string;
  defaultLotSize: number;
  description: string;
}

const INDEX_PRESETS: IndexPreset[] = [
  { name: 'Nifty 50', defaultLotSize: 25, description: 'NSE Nifty 50 Index Options' },
  { name: 'Bank Nifty', defaultLotSize: 15, description: 'NSE Bank Nifty Index Options' },
  { name: 'FinNifty', defaultLotSize: 25, description: 'Nifty Financial Services' },
  { name: 'Sensex', defaultLotSize: 10, description: 'BSE Sensex Index Options' }
];

export const OptionThetaDecayCalculatorScreen: React.FC<OptionThetaDecayCalculatorScreenProps> = ({
  theme,
  isDarkMode = true,
  primaryCurrencySymbol = '₹',
  onBackToLanding,
  onSignIn,
  onLogTrade,
}) => {
  // ---------------------------------------------------------------------------
  // INPUT STATES
  // ---------------------------------------------------------------------------
  const [selectedIndex, setSelectedIndex] = useState<string>('Nifty 50');
  const [lotSize, setLotSize] = useState<number>(25);
  const [moneyness, setMoneyness] = useState<'ITM' | 'ATM' | 'OTM'>('ATM');
  const [buyPremium, setBuyPremium] = useState<number>(150);
  const [numberOfLots, setNumberOfLots] = useState<number>(1);
  const [daysToExpiry, setDaysToExpiry] = useState<number>(1); // 0.25 (0 DTE), 1, 2, 3+
  const [holdingHours, setHoldingHours] = useState<number>(1); // 0.5 (30m), 1, 2, 6.25 (Full Day)
  const [currencySymbol, setCurrencySymbol] = useState<string>('₹');

  // Live Holding Clock Timer state
  const [isClockRunning, setIsClockRunning] = useState<boolean>(false);
  const [clockElapsedSeconds, setClockElapsedSeconds] = useState<number>(0);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync lot size when index preset is clicked
  const handleIndexSelect = (preset: IndexPreset) => {
    setSelectedIndex(preset.name);
    setLotSize(preset.defaultLotSize);
  };

  // Timer Tick Effect
  useEffect(() => {
    if (isClockRunning) {
      timerRef.current = setInterval(() => {
        setClockElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isClockRunning]);

  const handleResetClock = () => {
    setIsClockRunning(false);
    setClockElapsedSeconds(0);
  };

  // ---------------------------------------------------------------------------
  // MATHEMATICAL THETA DECAY ALGORITHM APPROXIMATION
  // ---------------------------------------------------------------------------
  const calculationResults = useMemo(() => {
    const totalShares = numberOfLots * lotSize;
    const totalCapitalInvested = buyPremium * totalShares;

    // Days to Expiry effective modifier (avoid div by zero on 0 DTE)
    const effectiveDte = Math.max(0.15, daysToExpiry);

    // Moneyness theta multipliers
    // ATM options have highest absolute theta decay. OTM decays rapidly as a % of premium.
    let moneynessMultiplier = 1.0;
    let deltaEstimate = 0.50; // ATM Delta

    if (moneyness === 'ITM') {
      moneynessMultiplier = 0.75; // Intrinsic value resists theta decay
      deltaEstimate = 0.70;
    } else if (moneyness === 'OTM') {
      moneynessMultiplier = 1.25; // High extrinsic time-value leakage
      deltaEstimate = 0.30;
    }

    // Daily Theta Decay per share (₹) = Premium * (0.08 / sqrt(DaysToExpiry)) * MoneynessMultiplier
    const dailyDecayPerShare = buyPremium * (0.08 / Math.sqrt(effectiveDte)) * moneynessMultiplier;
    
    // Indian Market hours = 6.25 hrs (9:15 AM to 3:30 PM)
    const hourlyDecayPerShare = dailyDecayPerShare / 6.25;
    const minuteDecayPerShare = hourlyDecayPerShare / 60;

    // Per Lot Metrics
    const hourlyDecayPerLot = hourlyDecayPerShare * lotSize;
    const totalHourlyDecayPosition = hourlyDecayPerShare * totalShares;
    
    // Holding Loss over chosen target duration
    const holdingLossPerShare = hourlyDecayPerShare * holdingHours;
    const totalHoldingLoss = holdingLossPerShare * totalShares;
    const holdingPenaltyPercentage = totalCapitalInvested > 0 
      ? Math.min(100, (totalHoldingLoss / totalCapitalInvested) * 100) 
      : 0;

    // Breakeven Index Move Needed to cover time decay
    const breakevenIndexPoints = holdingLossPerShare / deltaEstimate;

    // Live Clock Decay accumulated
    const liveHoursElapsed = clockElapsedSeconds / 3600;
    const liveLossAccumulated = hourlyDecayPerShare * liveHoursElapsed * totalShares;

    // Time-Risk Danger Zone Classification
    let dangerZoneLevel: 'GREEN' | 'AMBER' | 'RED' = 'GREEN';
    let dangerZoneTitle = 'SAFE HOLDING ZONE';
    let dangerZoneDescription = 'Low theta leakage. Market trend has ample time to play out.';
    let isExtremeTrap = false;

    if (daysToExpiry <= 0.25) { // 0 DTE
      if (holdingHours >= 1 || moneyness === 'OTM') {
        dangerZoneLevel = 'RED';
        dangerZoneTitle = 'EXTREME THETA TRAP ZONE';
        dangerZoneDescription = '0 DTE Expiry Day! Holding options sideways causes rapid exponential value decay.';
        isExtremeTrap = true;
      } else {
        dangerZoneLevel = 'AMBER';
        dangerZoneTitle = 'HIGH EXPIRY DECAY ZONE';
        dangerZoneDescription = '0 DTE intraday scalp. Keep holding duration tight under 30 minutes.';
      }
    } else if (daysToExpiry <= 1.0) { // 1 DTE
      if (holdingHours >= 2 || moneyness === 'OTM') {
        dangerZoneLevel = 'AMBER';
        dangerZoneTitle = 'MODERATE HOLDING DECAY ZONE';
        dangerZoneDescription = 'Overnight / multi-hour holding leaks significant premium if index consolidates.';
      }
    }

    if (moneyness === 'OTM' && daysToExpiry <= 0.25) {
      isExtremeTrap = true;
    }

    return {
      totalShares,
      totalCapitalInvested,
      dailyDecayPerShare,
      hourlyDecayPerShare,
      minuteDecayPerShare,
      hourlyDecayPerLot,
      totalHourlyDecayPosition,
      totalHoldingLoss,
      holdingPenaltyPercentage,
      breakevenIndexPoints,
      deltaEstimate,
      liveLossAccumulated,
      liveHoursElapsed,
      dangerZoneLevel,
      dangerZoneTitle,
      dangerZoneDescription,
      isExtremeTrap
    };
  }, [selectedIndex, lotSize, moneyness, buyPremium, numberOfLots, daysToExpiry, holdingHours, clockElapsedSeconds]);

  // Format Elapsed Time Clock (HH:MM:SS)
  const formatClockTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Copy Summary Handler
  const handleCopySummary = () => {
    const summaryText = `⏱️ TRADEJOURNALL OPTION TIME DECAY RISK ROADMAP
----------------------------------------
• Index & Instrument: ${selectedIndex} (${moneyness} Strike)
• Option Premium: ${currencySymbol}${buyPremium} (${numberOfLots} Lot / ${calculationResults.totalShares} Qty)
• Total Capital Invested: ${currencySymbol}${calculationResults.totalCapitalInvested.toLocaleString()}
• Days to Expiry: ${daysToExpiry <= 0.25 ? '0 DTE (Expiry Day)' : `${daysToExpiry} Day(s)`}
• Intraday Holding Target: ${holdingHours} Hour(s)
----------------------------------------
📉 TIME DECAY RISK ANALYSIS:
• Hourly Decay Leakage: -${currencySymbol}${calculationResults.totalHourlyDecayPosition.toFixed(2)} / position (-${currencySymbol}${calculationResults.hourlyDecayPerLot.toFixed(2)} per lot)
• Total Holding Loss: -${currencySymbol}${calculationResults.totalHoldingLoss.toFixed(2)} (-${calculationResults.holdingPenaltyPercentage.toFixed(1)}% of premium)
• Breakeven Index Move: +${calculationResults.breakevenIndexPoints.toFixed(1)} pts required in ${selectedIndex} just to offset theta!
• Risk Status: ${calculationResults.dangerZoneTitle}
----------------------------------------
Calculate option theta in Rupees: https://tradejournall.com/tools/option-theta-decay-calculator`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  // ---------------------------------------------------------------------------
  // STRUCTURED JSON-LD SCHEMA FOR SEO & SEARCH ENGINE RICH SNIPPETS
  // ---------------------------------------------------------------------------
  const schemaJson = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          'name': 'Option Buying Theta Decay & Time-Risk Clock (Nifty / BankNifty)',
          'operatingSystem': 'All',
          'applicationCategory': 'FinanceApplication',
          'description': 'Free online Nifty and Bank Nifty option theta decay calculator in Rupees. Calculate hourly time leakage, 0 DTE holding risk, and breakeven index points movement.',
          'url': 'https://tradejournall.com/tools/option-theta-decay-calculator',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'INR'
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
              'name': 'Option Theta Decay Calculator',
              'item': 'https://tradejournall.com/tools/option-theta-decay-calculator'
            }
          ]
        },
        {
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'How is option theta decay calculated in Rupees for Nifty and Bank Nifty?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Option theta decay in Rupees is calculated by estimating the daily time value leakage based on Days to Expiry (DTE) and Moneyness (ITM, ATM, OTM), then dividing by 6.25 Indian market trading hours to find hourly decay per share and multiplying by total lot quantity.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Why is 0 DTE option decay so fast on expiry day?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'On expiry day (0 DTE), option contracts contain zero remaining multi-day time value. Time decay accelerates non-linearly (square root of remaining time), causing ATM and OTM options to lose 10% to 30% of their premium every hour if the underlying index consolidates sideways.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How many index points must Nifty move to break even against theta decay?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'The breakeven index movement is calculated as: Required Index Points = (Hourly Rupee Decay * Holding Hours) / Option Delta. For an ATM Nifty option with a 0.50 Delta and ₹8 per share decay over 2 hours, Nifty must move at least +16 points in your direction just to break even.'
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
        <title>0DTE Option Profit & Theta Decay Calculator | TradeJournall</title>
        <meta
          name="description"
          content="Free 0DTE Option Profit & Theta Decay Calculator. Compute hourly option time decay, 0DTE holding risk, breakeven move, and live holding clock timer for SPY, QQQ, Nifty, and Crypto options."
        />
        <meta
          name="keywords"
          content="0dte option profit calculator, 0dte calculator, option theta decay calculator, 0dte spy option calculator, hourly option decay calculator, 0 dte option decay risk timer, tradejournall"
        />
        <link rel="canonical" href="https://tradejournall.com/tools/0dte-option-profit-calculator" />
        <meta property="og:title" content="0DTE Option Profit & Theta Decay Calculator" />
        <meta
          property="og:description"
          content="Free 0DTE Option Profit & Theta Decay Calculator. Live holding timer clock and 0DTE expiry decay danger gauge."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tradejournall.com/tools/0dte-option-profit-calculator" />
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
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Indian Derivatives Time Decay Utility
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 shadow-lg shadow-amber-500/10">
              <Clock size={28} />
            </span>
            Option Buying Theta Decay & Time-Risk Clock
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Nifty, Bank Nifty & Sensex Option Decay Tool. Translates complex Greeks into simple <strong>Rupees (₹) per Lot</strong> so option buyers know their exact holding leakage per hour.
          </p>
        </div>

        {/* Global Toolbar: Currency & Share */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-1 text-xs font-bold">
            {['₹', '$', '€'].map((sym) => (
              <button
                key={sym}
                onClick={() => setCurrencySymbol(sym)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  currencySymbol === sym
                    ? 'bg-amber-500 text-slate-950 font-black shadow'
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
            title="Copy formatted time decay summary"
          >
            {copiedSummary ? <Check size={15} className="text-emerald-400" /> : <Share2 size={15} />}
            {copiedSummary ? 'Copied!' : 'Share Plan'}
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* DYNAMIC TIME-RISK DANGER GAUGE BAR */}
      {/* --------------------------------------------------------------------- */}
      <div className={`mb-8 p-4 rounded-3xl border shadow-xl transition-all ${
        calculationResults.dangerZoneLevel === 'RED'
          ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
          : calculationResults.dangerZoneLevel === 'AMBER'
          ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
          : 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${
              calculationResults.dangerZoneLevel === 'RED'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : calculationResults.dangerZoneLevel === 'AMBER'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}>
              <ShieldAlert size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700">
                  {calculationResults.dangerZoneLevel} RISK STATUS
                </span>
                <span className="text-xs font-bold opacity-80">
                  {daysToExpiry <= 0.25 ? '0 DTE Expiry Day' : `${daysToExpiry} Day(s) to Expiry`}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                {calculationResults.dangerZoneTitle}
              </h3>
              <p className="text-xs opacity-90">{calculationResults.dangerZoneDescription}</p>
            </div>
          </div>

          <div className="text-right shrink-0 self-end sm:self-auto">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Estimated Decay Speed</span>
            <span className="text-sm font-black font-mono text-white">
              -{currencySymbol}{calculationResults.hourlyDecayPerLot.toFixed(2)} / Lot / Hour
            </span>
          </div>
        </div>

        {/* Dynamic Extreme Theta Trap Warning Callout */}
        {calculationResults.isExtremeTrap && (
          <div className="mt-3 pt-3 border-t border-rose-500/30 flex items-center gap-2 text-xs font-bold text-rose-300">
            <Flame size={16} className="text-rose-400 shrink-0 animate-bounce" />
            <span>🚨 EXTREME THETA TRAP: Holding OTM options on Expiry day (0 DTE) loses value exponentially every 15 minutes. Cut position fast if trend stalls!</span>
          </div>
        )}
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* MAIN 2-COLUMN WORKSPACE GRID */}
      {/* --------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        
        {/* LEFT COLUMN: PARAMETER INPUT CONTROLS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Index & Strike Input Card */}
          <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-700/70 pb-3">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Layers size={16} className="text-amber-400" />
                Index & Option Contract Sizing
              </h3>
              <span className="text-[10px] text-amber-400 font-bold px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
                Step 1 of 2
              </span>
            </div>

            {/* Quick Index Selector Buttons */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Select Index Instrument</label>
              <div className="grid grid-cols-2 gap-2">
                {INDEX_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handleIndexSelect(preset)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition text-left flex flex-col justify-between cursor-pointer ${
                      selectedIndex === preset.name
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span className="font-extrabold text-white text-sm">{preset.name}</span>
                    <span className="text-[10px] opacity-75 font-mono">Lot Size: {preset.defaultLotSize} Qty</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Moneyness Selector (ITM / ATM / OTM) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Option Moneyness (Strike Selection)</label>
              <div className="grid grid-cols-3 gap-2">
                {(['ITM', 'ATM', 'OTM'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMoneyness(m)}
                    className={`py-2 rounded-xl text-xs font-black border transition cursor-pointer ${
                      moneyness === m
                        ? 'bg-amber-500/25 border-amber-500 text-amber-400 shadow'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {m === 'ITM' ? 'In-The-Money' : m === 'ATM' ? 'At-The-Money' : 'Out-Of-Money'}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                {moneyness === 'ATM' && '⚡ Standard theta decay. Maximum time value leakage per hour.'}
                {moneyness === 'ITM' && '🛡️ Intrinsic value resists decay. Lower % leakage rate.'}
                {moneyness === 'OTM' && '⚠️ Zero intrinsic value! 100% time value leakage.'}
              </p>
            </div>

            {/* Buy Premium Input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-300">Option Buy Premium ({currencySymbol})</label>
                <span className="text-xs font-black text-amber-400 font-mono">
                  {currencySymbol}{buyPremium}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  value={buyPremium || ''}
                  onChange={(e) => setBuyPremium(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-amber-500 transition"
                  placeholder="150"
                />
              </div>
              <input
                type="range"
                min="5"
                max="1000"
                step="5"
                value={buyPremium}
                onChange={(e) => setBuyPremium(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-500 mt-2"
              />
            </div>

            {/* Number of Lots & Custom Lot Size */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/60">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Number of Lots</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={numberOfLots || ''}
                  onChange={(e) => setNumberOfLots(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Lot Size (Qty)</label>
                <input
                  type="number"
                  min="1"
                  value={lotSize || ''}
                  onChange={(e) => setLotSize(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Total Capital Invested:</span>
              <span className="font-mono font-black text-amber-400">
                {currencySymbol}{calculationResults.totalCapitalInvested.toLocaleString()} ({calculationResults.totalShares} Qty)
              </span>
            </div>

          </div>

          {/* Expiry & Holding Target Card */}
          <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-700/70 pb-3">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Timer size={16} className="text-amber-400" />
                Expiry & Holding Horizon
              </h3>
              <span className="text-[10px] text-amber-400 font-bold px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
                Step 2 of 2
              </span>
            </div>

            {/* Days to Expiry (DTE) */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-300">Days to Expiry (DTE)</label>
                <span className="text-xs font-black text-rose-400 font-mono">
                  {daysToExpiry <= 0.25 ? '0 DTE (Expiry Day)' : `${daysToExpiry} Day(s)`}
                </span>
              </div>

              {/* DTE Presets */}
              <div className="grid grid-cols-4 gap-1.5 mb-2">
                {[
                  { label: '0 DTE', val: 0.25 },
                  { label: '1 Day', val: 1 },
                  { label: '2 Days', val: 2 },
                  { label: '3+ Days', val: 3 }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setDaysToExpiry(preset.val)}
                    className={`py-1.5 text-xs font-black rounded-lg border transition cursor-pointer ${
                      daysToExpiry === preset.val
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <input
                type="range"
                min="0.25"
                max="7"
                step="0.25"
                value={daysToExpiry}
                onChange={(e) => setDaysToExpiry(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            {/* Intraday Holding Target */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-300">Intraday Holding Target Duration</label>
                <span className="text-xs font-black text-amber-400 font-mono">
                  {holdingHours < 1 ? `${holdingHours * 60} Mins` : `${holdingHours} Hour(s)`}
                </span>
              </div>

              {/* Holding Target Presets */}
              <div className="grid grid-cols-4 gap-1.5 mb-2">
                {[
                  { label: '30 Mins', val: 0.5 },
                  { label: '1 Hour', val: 1 },
                  { label: '2 Hours', val: 2 },
                  { label: 'Full Day', val: 6.25 }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setHoldingHours(preset.val)}
                    className={`py-1.5 text-xs font-black rounded-lg border transition cursor-pointer ${
                      holdingHours === preset.val
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <input
                type="range"
                min="0.25"
                max="6.25"
                step="0.25"
                value={holdingHours}
                onChange={(e) => setHoldingHours(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: REAL-TIME RUPEE DECAY OUTPUT MATRIX & LIVE TIMER (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">

          {/* DYNAMIC RUPEE DECAY CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* CARD 1: HOURLY LOSS IN RUPEES */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-700/80 rounded-3xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 block mb-1">
                  Estimated Hourly Leakage
                </span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-rose-400">
                  -{currencySymbol}{calculationResults.totalHourlyDecayPosition.toFixed(2)}
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-1">
                  -{currencySymbol}{calculationResults.hourlyDecayPerLot.toFixed(2)} / Lot / Hour
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400">
                Minute Leakage: <strong className="text-slate-200 font-mono">-{currencySymbol}{(calculationResults.totalHourlyDecayPosition / 60).toFixed(2)} / min</strong>
              </div>
            </div>

            {/* CARD 2: HOLDING PENALTY METRIC */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-700/80 rounded-3xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-1">
                  Holding Penalty ({holdingHours}h)
                </span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400">
                  -{calculationResults.holdingPenaltyPercentage.toFixed(1)}%
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-1">
                  -{currencySymbol}{calculationResults.totalHoldingLoss.toFixed(2)} Premium Leakage
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400">
                Sideways Market Cost: <strong className="text-amber-300 font-bold">Eats ~{calculationResults.holdingPenaltyPercentage.toFixed(0)}% Capital</strong>
              </div>
            </div>

            {/* CARD 3: BREAKEVEN INDEX MOVE NEEDED */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-700/80 rounded-3xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-1">
                  Breakeven Index Move
                </span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                  +{calculationResults.breakevenIndexPoints.toFixed(1)} pts
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Required in {selectedIndex} to cover time decay
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400">
                Assumed Delta: <strong className="text-slate-200 font-mono">~{calculationResults.deltaEstimate.toFixed(2)} ({moneyness})</strong>
              </div>
            </div>

          </div>

          {/* LIVE HOLDING TIMER CLOCK WIDGET */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Clock size={13} className="animate-spin" />
                  <span>Interactive Real-Time Clock</span>
                </span>
                <h3 className="text-lg font-extrabold text-white mt-1">
                  Option Holding Time Risk Clock
                </h3>
              </div>

              {/* Timer Control Buttons */}
              <div className="flex items-center gap-2">
                {!isClockRunning ? (
                  <button
                    onClick={() => setIsClockRunning(true)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition shadow-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play size={14} fill="currentColor" />
                    <span>Start Live Holding Clock</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsClockRunning(false)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition shadow-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Pause size={14} fill="currentColor" />
                    <span>Pause Clock</span>
                  </button>
                )}

                <button
                  onClick={handleResetClock}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700 cursor-pointer"
                  title="Reset clock timer"
                >
                  <RotateCcw size={15} />
                </button>
              </div>
            </div>

            {/* LIVE TIMER DISPLAY & LEAKAGE TRACKER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Elapsed Holding Duration
                </span>
                <div className="text-3xl font-black font-mono text-amber-400">
                  {formatClockTime(clockElapsedSeconds)}
                </div>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Real-Time Rupee Decay Accumulated
                </span>
                <div className="text-3xl font-black font-mono text-rose-400">
                  -{currencySymbol}{calculationResults.liveLossAccumulated.toFixed(2)}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 text-center italic">
              Click Start when entering an intraday option buy trade to visualize exact rupee decay accumulating live on your screen.
            </p>
          </div>

          {/* CONVERSION LEAD MAGNET BANNER */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                TradeJournall Execution Edge
              </span>
              <h4 className="text-base font-extrabold text-white mt-0.5">
                Stop over-holding losing setups
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Option buying is all about execution timing. Log your setups and track your win-rates automatically with TradeJournall.
              </p>
            </div>

            <button
              onClick={() => {
                if (onLogTrade) {
                  onLogTrade({
                    symbol: `${selectedIndex} ${buyPremium} ${moneyness}`,
                    entryPrice: buyPremium,
                    exitPrice: Math.max(0, buyPremium - calculationResults.hourlyDecayPerShare * holdingHours),
                    pnl: -calculationResults.totalHoldingLoss,
                    type: 'Long',
                  });
                }
              }}
              className="whitespace-nowrap bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs sm:text-sm transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Log Trade Setup Now</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>

      </div>

      {/* --------------------------------------------------------------------- */}
      {/* ON-PAGE SEO EDUCATIONAL GUIDE & KEYWORD HEADINGS */}
      {/* --------------------------------------------------------------------- */}
      <div className="mt-12 pt-8 border-t border-slate-800 text-slate-300">
        <article className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Nifty Option Theta Decay Calculator & Time-Risk Holding Guide
            </h2>
            <p className="text-slate-300 leading-relaxed">
              When buying options on <strong>Nifty 50</strong>, <strong>Bank Nifty</strong>, or <strong>Sensex</strong>, time decay (Theta) is the option buyer’s silent killer. Every minute the index moves sideways, your option premium loses value. This <strong>option buying hourly decay calculator in rupees</strong> translates complex Greek math into transparent Rupee leakage per lot.
            </p>

            <h3 className="text-xl font-bold text-amber-400">
              1. How Does the Bank Nifty Option Time Decay Holding Tool Work?
            </h3>
            <p className="text-slate-300">
              Option theta decay is non-linear. As an option approaches its expiration date, time decay accelerates rapidly.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li><strong>Daily Theta Leakage</strong>: Estimated based on the square root of remaining Days to Expiry (<code className="text-amber-300 font-mono">√DTE</code>) and option moneyness (ITM, ATM, OTM).</li>
              <li><strong>Hourly Rupee Leakage</strong>: Computed by dividing daily decay by 6.25 Indian trading hours (9:15 AM to 3:30 PM).</li>
              <li><strong>Breakeven Index Move</strong>: Minimum points movement required in Nifty or Bank Nifty to offset time decay (<code className="text-emerald-300 font-mono">Breakeven Points = Rupee Loss / Option Delta</code>).</li>
            </ul>

            <h3 className="text-xl font-bold text-amber-400">
              2. 0 DTE Option Decay Risk Timer: Why Expiry Days are Dangerous
            </h3>
            <p className="text-slate-300">
              On <strong>0 DTE (Expiry Day)</strong>, options have zero multi-day time value remaining. At-The-Money (ATM) and Out-Of-The-Money (OTM) strikes lose 15% to 35% of their total premium every 30 minutes in a sideways market. Using our <strong>option holding time risk clock</strong>, traders can monitor live elapsed time to avoid over-holding stagnant intraday trades.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white mb-1">ATM Options (At-The-Money)</h4>
                <p className="text-xs text-slate-400">Contains the highest absolute time value (Theta). Suffers maximum rupee leakage per hour when market consolidates.</p>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <h4 className="font-bold text-white mb-1">OTM Options (Out-Of-The-Money)</h4>
                <p className="text-xs text-slate-400">Contains 100% time value. High risk of complete 100% premium wipeout on 0 DTE expiry afternoon.</p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-amber-400">Frequently Asked Questions (FAQ)</h3>
            <div className="space-y-4">
              <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/60">
                <h5 className="font-bold text-white mb-1">Which option strike suffers the lowest theta decay?</h5>
                <p className="text-xs text-slate-400">Deep In-The-Money (ITM) options with high Delta (0.70 to 0.90) consist mostly of intrinsic value, making them much more resistant to time decay than ATM or OTM options.</p>
              </div>
              <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/60">
                <h5 className="font-bold text-white mb-1">How many points must Nifty move to cover 1 hour of time decay?</h5>
                <p className="text-xs text-slate-400">For an ATM Nifty option with a 0.50 Delta and ₹8 per share hourly decay, Nifty must move at least +16 points in your trade direction just to break even against 1 hour of time decay.</p>
              </div>
            </div>

          </div>
        </article>
      </div>

    </div>
  );
};
