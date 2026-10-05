import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Gauge,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Share2,
  Check,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  ArrowRight,
  Activity,
  Layers,
  Sparkles,
  Info,
  Scale,
  Compass,
  CheckCircle2,
  Zap
} from 'lucide-react';

export interface PcrSentimentCalculatorScreenProps {
  theme?: any;
  isDarkMode?: boolean;
  primaryCurrencySymbol?: string;
  onBackToLanding?: () => void;
  onSignIn?: () => void;
  onLogTrade?: (tradeData: { symbol: string; entryPrice: number; exitPrice: number; pnl: number; type: 'Long' | 'Short' }) => void;
}

interface IndexPreset {
  name: string;
  typicalPoi: number;
  typicalCoi: number;
  description: string;
}

const INDEX_PRESETS: IndexPreset[] = [
  { name: 'Nifty 50', typicalPoi: 14500000, typicalCoi: 18000000, description: 'NSE Nifty 50 Index Options' },
  { name: 'Bank Nifty', typicalPoi: 8500000, typicalCoi: 9200000, description: 'NSE Bank Nifty Index Options' },
  { name: 'FinNifty', typicalPoi: 4200000, typicalCoi: 4800000, description: 'NSE Financial Services Options' },
  { name: 'Sensex', typicalPoi: 3500000, typicalCoi: 3100000, description: 'BSE Sensex Index Options' }
];

export const PcrSentimentCalculatorScreen: React.FC<PcrSentimentCalculatorScreenProps> = ({
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
  const [calculationMode, setCalculationMode] = useState<'pcr' | 'oi'>('pcr');
  const [selectedIndex, setSelectedIndex] = useState<string>('Nifty 50');
  const [directPcrValue, setDirectPcrValue] = useState<number>(0.78);
  
  // Total Open Interest inputs for Mode 2
  const [putOi, setPutOi] = useState<number>(14500000);
  const [callOi, setCallOi] = useState<number>(18000000);

  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Sync index presets
  const handleIndexPreset = (preset: IndexPreset) => {
    setSelectedIndex(preset.name);
    setPutOi(preset.typicalPoi);
    setCallOi(preset.typicalCoi);
  };

  // ---------------------------------------------------------------------------
  // PCR & SENTIMENT BIAS CALCULATION ENGINE
  // ---------------------------------------------------------------------------
  const results = useMemo(() => {
    let pcr = 0;
    if (calculationMode === 'pcr') {
      pcr = directPcrValue;
    } else {
      pcr = callOi > 0 ? putOi / callOi : 1.0;
    }

    // Clamp PCR between 0.20 and 2.20 for gauge math
    const clampedPcr = Math.max(0.20, Math.min(2.20, pcr));
    // Gauge percentage for visual meter (0% to 100%)
    const gaugePercentage = Math.min(100, Math.max(0, ((clampedPcr - 0.30) / (1.80 - 0.30)) * 100));

    // Sentiment Classification & Actionable Guidance
    let sentimentZone: 'EXTREME_OVERSOLD' | 'BEARISH' | 'NEUTRAL' | 'BULLISH' | 'EXTREME_OVERBOUGHT' = 'NEUTRAL';
    let zoneTitle = 'NEUTRAL / SIDEWAYS ZONE';
    let zoneColor = 'amber';
    let gaugeBadgeText = 'SIDEWAYS THETA TRAP';
    let optionBuyerAdvice = '⚠️ High Theta Leakage! Avoid buying OTM options during sideways PCR consolidation.';
    let optionSellerAdvice = '🛡️ Sell Short Straddle / Iron Condor to capture time decay.';
    let contrarianRiskWarning = 'Market is evenly balanced between Put & Call writers. Expect range-bound moves.';

    if (clampedPcr < 0.65) {
      sentimentZone = 'EXTREME_OVERSOLD';
      zoneTitle = 'EXTREME OVERSOLD (CONTRARIAN BOUNCE ZONE)';
      zoneColor = 'rose';
      gaugeBadgeText = 'SHORT COVERING BOUNCE RISK';
      optionBuyerAdvice = '🚨 EXTREME OVERSOLD! Do NOT buy fresh OTM Puts here. Look for Bullish Reversal at key support for a Short-Covering rally.';
      optionSellerAdvice = '🛡️ Avoid aggressive Call writing. Expect rapid short-covering spikes.';
      contrarianRiskWarning = 'Put Writers are trapped or market is heavily oversold. High probability of sharp V-shaped short covering bounce!';
    } else if (clampedPcr >= 0.65 && clampedPcr < 0.85) {
      sentimentZone = 'BEARISH';
      zoneTitle = 'BEARISH SENTIMENT BIAS';
      zoneColor = 'orange';
      gaugeBadgeText = 'BEARISH DOMINANCE';
      optionBuyerAdvice = '📉 Bearish Bias active. Look for Put buying opportunities on pullbacks to VWAP/Resistance.';
      optionSellerAdvice = '🛡️ Call Credit Spreads or Out-of-the-money Call selling has statistical edge.';
      contrarianRiskWarning = 'Call Open Interest exceeds Put Open Interest. Sellers dominating resistance levels.';
    } else if (clampedPcr >= 0.85 && clampedPcr <= 1.15) {
      sentimentZone = 'NEUTRAL';
      zoneTitle = 'NEUTRAL / SIDEWAYS CONSOLIDATION';
      zoneColor = 'amber';
      gaugeBadgeText = 'BALANCED RANGE';
      optionBuyerAdvice = '⚠️ Market in rangebound mode. High risk of premium decay for option buyers.';
      optionSellerAdvice = '🛡️ Premium Sellers market. High theta decay benefit.';
      contrarianRiskWarning = 'Put and Call Open Interest are balanced. Wait for PCR breakout above 1.15 or drop below 0.70.';
    } else if (clampedPcr > 1.15 && clampedPcr <= 1.45) {
      sentimentZone = 'BULLISH';
      zoneTitle = 'BULLISH SENTIMENT BIAS';
      zoneColor = 'emerald';
      gaugeBadgeText = 'BULLISH STRENGTH';
      optionBuyerAdvice = '📈 Bullish Momentum active. Call buying on dips to support/EMA has statistical edge.';
      optionSellerAdvice = '🛡️ Put Credit Spreads or OTM Put selling favored as Put Writers defend support.';
      contrarianRiskWarning = 'Put Writers dominate key support levels. Dips are likely to be bought.';
    } else { // > 1.45
      sentimentZone = 'EXTREME_OVERBOUGHT';
      zoneTitle = 'EXTREME OVERBOUGHT (PROFIT BOOKING ZONE)';
      zoneColor = 'purple';
      gaugeBadgeText = 'PROFIT TAKING PULLBACK RISK';
      optionBuyerAdvice = '🚨 EXTREME OVERBOUGHT! Avoid chasing Call options at top. High risk of sharp profit-booking pullback.';
      optionSellerAdvice = '🛡️ Avoid aggressive Put selling. Lock profits on long positions.';
      contrarianRiskWarning = 'Market is overextended on Put side. High probability of profit taking pullback or consolidation.';
    }

    // Put vs Call Ratio breakdown percentages
    const totalOiSum = putOi + callOi;
    const putPercentage = totalOiSum > 0 ? (putOi / totalOiSum) * 100 : 50;
    const callPercentage = totalOiSum > 0 ? (callOi / totalOiSum) * 100 : 50;

    return {
      pcr,
      clampedPcr,
      gaugePercentage,
      sentimentZone,
      zoneTitle,
      zoneColor,
      gaugeBadgeText,
      optionBuyerAdvice,
      optionSellerAdvice,
      contrarianRiskWarning,
      putPercentage,
      callPercentage
    };
  }, [calculationMode, directPcrValue, putOi, callOi]);

  // Copy Summary Handler
  const handleCopySummary = () => {
    const summaryText = `📊 TRADEJOURNALL PCR & SENTIMENT BIAS ANALYSIS
----------------------------------------
• Index Instrument: ${selectedIndex}
• Put-Call Ratio (PCR): ${results.pcr.toFixed(2)}
• Sentiment Bias: ${results.zoneTitle}
• Put OI Share: ${results.putPercentage.toFixed(1)}% | Call OI Share: ${results.callPercentage.toFixed(1)}%
----------------------------------------
💡 ACTIONABLE TRADING GUIDANCE:
• Option Buyer: ${results.optionBuyerAdvice}
• Option Seller: ${results.optionSellerAdvice}
• Market Warning: ${results.contrarianRiskWarning}
----------------------------------------
Calculate Nifty & BankNifty PCR Sentiment: https://tradejournall.com/tools/nifty-pcr-calculator`;

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
          'name': 'Nifty & BankNifty PCR (Put-Call Ratio) Sentiment Bias Gauge',
          'operatingSystem': 'All',
          'applicationCategory': 'FinanceApplication',
          'description': 'Free online Nifty 50 and Bank Nifty Put-Call Ratio (PCR) calculator and sentiment bias indicator. Calculate PCR ratio, interpret oversold short covering bounce zones, and get actionable option buying and selling guidance.',
          'url': 'https://tradejournall.com/tools/nifty-pcr-calculator',
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
              'name': 'Nifty PCR Calculator',
              'item': 'https://tradejournall.com/tools/nifty-pcr-calculator'
            }
          ]
        },
        {
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'What is PCR (Put-Call Ratio) in Nifty and Bank Nifty option trading?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Put-Call Ratio (PCR) is calculated by dividing total Put Open Interest (POI) by total Call Open Interest (COI). A PCR above 1.15 indicates bullish sentiment as Put writers defend support, while a PCR below 0.65 signals an extreme oversold zone with high potential for a short-covering bounce.'
              }
            },
            {
              '@type': 'Question',
              'name': 'What does a PCR below 0.70 mean for option buyers?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'A PCR below 0.70 indicates that Call Open Interest heavily exceeds Put Open Interest, making the market extremely oversold. Option buyers should avoid buying fresh Put options near these levels due to the high risk of a sharp V-shaped short-covering rally.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How to use PCR sentiment gauge for Nifty intraday trading?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Combine the PCR Sentiment Gauge with key support/resistance levels. When PCR is between 0.85 and 1.15, the market is in a sideways consolidation phase where option sellers profit from theta decay. Look for trades when PCR moves into bullish (> 1.15) or oversold bounce (< 0.65) extreme zones.'
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
        <title>Nifty & BankNifty PCR Calculator & Sentiment Bias Gauge — TradeJournall</title>
        <meta
          name="description"
          content="Free online Put-Call Ratio (PCR) calculator & sentiment bias gauge for Nifty 50, Bank Nifty & Sensex. Interpret oversold short-covering zones and actionable option buying guidance."
        />
        <meta
          name="keywords"
          content="nifty pcr calculator online, bank nifty put call ratio sentiment indicator, pcr ratio bullish bearish zone calculator, live pcr interpretation tool, how to read pcr ratio in nifty, nifty put call ratio today sentiment, tradejournall"
        />
        <link rel="canonical" href="https://tradejournall.com/tools/nifty-pcr-calculator" />
        <meta property="og:title" content="Nifty & BankNifty PCR (Put-Call Ratio) Sentiment Bias Gauge" />
        <meta
          property="og:description"
          content="Calculate & interpret Nifty & BankNifty PCR ratio in real-time. Interactive visual sentiment meter with option buyer & seller guidance."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tradejournall.com/tools/nifty-pcr-calculator" />
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
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Derivatives Market Structure & Sentiment Engine
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 shadow-lg shadow-emerald-500/10">
              <Compass size={28} />
            </span>
            Nifty & BankNifty PCR Sentiment Bias Gauge
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Put-Call Ratio (PCR) Indicator & Actionable Bias Utility. Instantly interpret Open Interest sentiment to avoid oversold traps and spot high-probability reversals.
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition active:scale-95 cursor-pointer"
            title="Copy PCR Sentiment Analysis Summary"
          >
            {copiedSummary ? <Check size={15} className="text-emerald-400" /> : <Share2 size={15} />}
            {copiedSummary ? 'Copied!' : 'Share Analysis'}
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* DYNAMIC PCR SENTIMENT NEEDLE & VISUAL GAUGE BAR */}
      {/* --------------------------------------------------------------------- */}
      <div className={`mb-8 p-6 rounded-3xl border shadow-2xl transition-all ${
        results.sentimentZone === 'EXTREME_OVERSOLD'
          ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
          : results.sentimentZone === 'BEARISH'
          ? 'bg-orange-950/40 border-orange-500/60 text-orange-200'
          : results.sentimentZone === 'BULLISH'
          ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
          : results.sentimentZone === 'EXTREME_OVERBOUGHT'
          ? 'bg-purple-950/40 border-purple-500/60 text-purple-200'
          : 'bg-amber-950/40 border-amber-500/60 text-amber-200'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left Column: Big PCR Value & Status */}
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-slate-900/80 border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              {results.gaugeBadgeText}
            </div>
            
            <div className="flex items-baseline gap-3 justify-center md:justify-start">
              <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white">
                {results.pcr.toFixed(2)}
              </span>
              <span className="text-sm font-bold text-slate-400">PCR Value</span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              {results.zoneTitle}
            </h3>
            <p className="text-xs sm:text-sm opacity-90 max-w-xl">{results.contrarianRiskWarning}</p>
          </div>

          {/* Right Column: Visual Gauge Slider Bar */}
          <div className="w-full md:w-80 space-y-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 shrink-0">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-rose-400">0.40 (Oversold)</span>
              <span className="text-amber-400">1.0 (Neutral)</span>
              <span className="text-emerald-400">1.80 (Bullish)</span>
            </div>

            {/* Custom Multi-Zone Gauge Track */}
            <div className="relative w-full h-4 bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 rounded-full overflow-hidden shadow-inner">
              {/* Animated Needle Indicator */}
              <div
                className="absolute top-0 bottom-0 w-2.5 bg-white border-2 border-slate-950 rounded-full shadow-lg transition-all duration-500"
                style={{ left: `calc(${results.gaugePercentage}% - 5px)` }}
              ></div>
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Short Covering Zone</span>
              <span>Put Support Zone</span>
            </div>
          </div>

        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* MAIN 2-COLUMN WORKSPACE GRID */}
      {/* --------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        
        {/* LEFT COLUMN: PARAMETER INPUT CONTROLS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-700/70 pb-3">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Gauge size={16} className="text-emerald-400" />
                PCR Calculation Mode
              </h3>
              <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                Live Calculator
              </span>
            </div>

            {/* Calculation Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setCalculationMode('pcr')}
                className={`py-2 text-xs font-black rounded-lg transition cursor-pointer ${
                  calculationMode === 'pcr'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Direct PCR Entry
              </button>
              <button
                onClick={() => setCalculationMode('oi')}
                className={`py-2 text-xs font-black rounded-lg transition cursor-pointer ${
                  calculationMode === 'oi'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Put & Call OI Entry
              </button>
            </div>

            {/* Quick Index Selector Buttons */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Select Index Instrument</label>
              <div className="grid grid-cols-2 gap-2">
                {INDEX_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handleIndexPreset(preset)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition text-left cursor-pointer ${
                      selectedIndex === preset.name
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow ring-1 ring-emerald-500/30'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span className="font-extrabold text-white text-sm block">{preset.name}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{preset.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* MODE 1: DIRECT PCR SLIDER & NUMBER INPUT */}
            {calculationMode === 'pcr' ? (
              <div className="space-y-4 pt-2 border-t border-slate-700/60">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300">PCR Value Input</label>
                  <span className="text-base font-black text-emerald-400 font-mono">
                    {directPcrValue.toFixed(2)}
                  </span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0.2"
                  max="2.5"
                  value={directPcrValue || ''}
                  onChange={(e) => setDirectPcrValue(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition"
                  placeholder="0.78"
                />
                <input
                  type="range"
                  min="0.30"
                  max="1.80"
                  step="0.01"
                  value={directPcrValue}
                  onChange={(e) => setDirectPcrValue(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0.40 (Oversold)</span>
                  <span>1.0 (Balanced)</span>
                  <span>1.60 (Overbought)</span>
                </div>
              </div>
            ) : (
              /* MODE 2: TOTAL PUT & CALL OI INPUTS */
              <div className="space-y-4 pt-2 border-t border-slate-700/60">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Total Put Open Interest (POI)</label>
                  <input
                    type="number"
                    value={putOi || ''}
                    onChange={(e) => setPutOi(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-emerald-300 font-mono text-sm focus:outline-none focus:border-emerald-500 transition"
                    placeholder="14500000"
                  />
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    {(putOi / 100000).toFixed(2)} Lakh Put Contracts
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Total Call Open Interest (COI)</label>
                  <input
                    type="number"
                    value={callOi || ''}
                    onChange={(e) => setCallOi(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-rose-300 font-mono text-sm focus:outline-none focus:border-rose-500 transition"
                    placeholder="18000000"
                  />
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    {(callOi / 100000).toFixed(2)} Lakh Call Contracts
                  </span>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN: ACTIONABLE TRADING GUIDANCE CARDS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">

          {/* ACTIONABLE ADVICE TILES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* OPTION BUYER GUIDANCE CARD */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Option Buyer Strategy
                </span>
                <TrendingUp size={18} className="text-emerald-400" />
              </div>
              <h4 className="text-sm font-extrabold text-white">Intraday Option Buyer Bias</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{results.optionBuyerAdvice}</p>
            </div>

            {/* OPTION SELLER GUIDANCE CARD */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  Option Seller Strategy
                </span>
                <ShieldAlert size={18} className="text-amber-400" />
              </div>
              <h4 className="text-sm font-extrabold text-white">Option Writer Positioning</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{results.optionSellerAdvice}</p>
            </div>

          </div>

          {/* OPEN INTEREST BREAKDOWN RATIO BAR */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Activity size={16} className="text-emerald-400" />
                Open Interest Share Breakdown ({selectedIndex})
              </h4>
              <span className="text-xs font-mono font-bold text-slate-400">Total OI Balance</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold font-mono">
                <span className="text-emerald-400">Put Writers: {results.putPercentage.toFixed(1)}%</span>
                <span className="text-rose-400">Call Writers: {results.callPercentage.toFixed(1)}%</span>
              </div>
              
              {/* Stacked Progress Bar */}
              <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden flex shadow-inner border border-slate-800">
                <div
                  className="bg-emerald-500 transition-all duration-500"
                  style={{ width: `${results.putPercentage}%` }}
                ></div>
                <div
                  className="bg-rose-500 transition-all duration-500"
                  style={{ width: `${results.callPercentage}%` }}
                ></div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              * Put Writers act as support buyers while Call Writers act as overhead resistance sellers. Higher Put share indicates strong institutional support.
            </p>
          </div>

          {/* CONVERSION LEAD MAGNET BANNER */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                TradeJournall Market Discipline
              </span>
              <h4 className="text-base font-extrabold text-white mt-0.5">
                Log your PCR Sentiment Trades
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Track whether you traded WITH or AGAINST the Put-Call Ratio sentiment bias to eliminate costly emotional trades.
              </p>
            </div>

            <button
              onClick={() => {
                if (onLogTrade) {
                  onLogTrade({
                    symbol: `${selectedIndex} PCR ${results.pcr.toFixed(2)}`,
                    entryPrice: 100,
                    exitPrice: 120,
                    pnl: 500,
                    type: results.sentimentZone === 'BULLISH' || results.sentimentZone === 'EXTREME_OVERSOLD' ? 'Long' : 'Short',
                  });
                }
              }}
              className="whitespace-nowrap bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs sm:text-sm transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Log PCR Trade Setup</span>
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
              Nifty PCR Calculator & Put-Call Ratio Sentiment Bias Guide
            </h2>
            <p className="text-slate-300 leading-relaxed">
              The <strong>Put-Call Ratio (PCR)</strong> is one of the most reliable sentiment indicators used by institutional derivative traders in the Indian Stock Market. Whether trading <strong>Nifty 50</strong>, <strong>Bank Nifty</strong>, or <strong>Sensex</strong> options, understanding PCR helps you identify key reversal zones and avoid buying options during sideways market consolidation.
            </p>

            <h3 className="text-xl font-bold text-emerald-400">
              1. How is PCR (Put-Call Ratio) Calculated in Nifty and Bank Nifty?
            </h3>
            <p className="text-slate-300">
              The formula for Put-Call Ratio is extremely simple:
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center font-mono font-bold text-emerald-400 text-base">
              PCR = Total Put Open Interest (POI) ÷ Total Call Open Interest (COI)
            </div>

            <h3 className="text-xl font-bold text-emerald-400">
              2. How to Read PCR Sentiment Zones for Option Buyers
            </h3>
            <ul className="list-disc pl-5 space-y-3 text-slate-300">
              <li><strong>Extreme Oversold (PCR &lt; 0.65)</strong>: Indicates that Call Open Interest heavily dominates Put Open Interest. Option buyers should avoid buying fresh Puts here, as the market has high statistical probability of a sharp <em>short-covering bounce</em>.</li>
              <li><strong>Bearish Zone (PCR 0.65 - 0.85)</strong>: Call writers dominate resistance levels. Look for Put buying or Call selling opportunities on minor pullbacks.</li>
              <li><strong>Neutral / Sideways Zone (PCR 0.85 - 1.15)</strong>: Put and Call writers are equally matched. Option buyers suffer heavy <em>theta decay loss</em> in this range.</li>
              <li><strong>Bullish Zone (PCR 1.15 - 1.45)</strong>: Put writers actively defend key support levels. Buying Call options on dips has a strong statistical edge.</li>
              <li><strong>Extreme Overbought (PCR &gt; 1.45)</strong>: Market is heavily overextended on the upside. High risk of profit-booking pullback.</li>
            </ul>

            <h3 className="text-xl font-bold text-emerald-400">Frequently Asked Questions (FAQ)</h3>
            <div className="space-y-4">
              <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/60">
                <h5 className="font-bold text-white mb-1">What is a good PCR value for buying Nifty Call options?</h5>
                <p className="text-xs text-slate-400">A PCR between 1.15 and 1.35 indicates healthy bullish sentiment where Put writers are aggressively defending support levels. Alternatively, a PCR dropping below 0.65 often marks an extreme oversold bottom for a short-covering bounce.</p>
              </div>
              <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/60">
                <h5 className="font-bold text-white mb-1">Why do Option Buyers lose money when PCR is between 0.85 and 1.15?</h5>
                <p className="text-xs text-slate-400">When PCR remains between 0.85 and 1.15, the index usually consolidates in a tight range without clear directional momentum. During this sideways phase, Option Sellers capture premium while Option Buyers suffer rapid time decay (Theta) leakage.</p>
              </div>
            </div>

          </div>
        </article>
      </div>

    </div>
  );
};
