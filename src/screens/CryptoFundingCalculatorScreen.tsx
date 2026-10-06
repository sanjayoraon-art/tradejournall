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
  Info
} from 'lucide-react';

export interface CryptoFundingCalculatorScreenProps {
  theme?: any;
  isDarkMode?: boolean;
  primaryCurrencySymbol?: string;
  onBackToLanding?: () => void;
  onSignIn?: () => void;
  onLogTrade?: (tradeData: { symbol: string; entryPrice: number; exitPrice: number; pnl: number; type: 'Long' | 'Short' }) => void;
}

// Preset Exchange Intervals
interface ExchangePreset {
  name: string;
  intervalHours: number;
  defaultFeeRate: number; // Taker fee rate %
  description: string;
}

const EXCHANGE_PRESETS: ExchangePreset[] = [
  { name: 'Binance Perps', intervalHours: 8, defaultFeeRate: 0.05, description: '8-Hour Funding Interval (Standard)' },
  { name: 'Bybit Perps', intervalHours: 8, defaultFeeRate: 0.055, description: '8-Hour Funding Interval' },
  { name: 'OKX Perps', intervalHours: 8, defaultFeeRate: 0.05, description: '8-Hour Funding Interval' },
  { name: 'Hyperliquid DEX', intervalHours: 1, defaultFeeRate: 0.035, description: '1-Hour Hourly Funding Interval' },
  { name: 'Custom Interval', intervalHours: 4, defaultFeeRate: 0.05, description: 'Custom Interval (4h / 1h / 8h)' },
];

export const CryptoFundingCalculatorScreen: React.FC<CryptoFundingCalculatorScreenProps> = ({
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
  const [selectedExchange, setSelectedExchange] = useState<string>('Binance Perps');
  const [calcMode, setCalcMode] = useState<'perps' | 'arbitrage'>('arbitrage'); // 'perps' = Simple Perps Position, 'arbitrage' = Delta-Neutral Cash & Carry
  const [positionSizeUsd, setPositionSizeUsd] = useState<number>(10000);
  const [fundingRatePercent, setFundingRatePercent] = useState<number>(0.01); // 0.01% per interval
  const [intervalHours, setIntervalHours] = useState<number>(8);
  const [positionSide, setPositionSide] = useState<'long' | 'short'>('short'); // For perps mode: short earns when rate is positive
  const [holdingDays, setHoldingDays] = useState<number>(30);
  const [tradingFeePercent, setTradingFeePercent] = useState<number>(0.05); // Entry + Exit fee total %
  const [copied, setCopied] = useState<boolean>(false);

  // When Exchange Preset Changes, update interval and fee rate
  const handleExchangeSelect = (preset: ExchangePreset) => {
    setSelectedExchange(preset.name);
    setIntervalHours(preset.intervalHours);
    setTradingFeePercent(preset.defaultFeeRate);
  };

  // ---------------------------------------------------------------------------
  // MATHEMATICAL CALCULATIONS
  // ---------------------------------------------------------------------------
  const results = useMemo(() => {
    const intervalsPerDay = 24 / (intervalHours || 8);
    const intervalsPerYear = intervalsPerDay * 365;

    // 1. Single Interval Funding Amount ($)
    // Rate is in percentage, so divide by 100
    const singleIntervalRateDecimal = fundingRatePercent / 100;
    
    // In Perps mode:
    // Positive rate: Long pays Short. If side == 'short', user earns +. If side == 'long', user pays -.
    // Negative rate: Short pays Long. If side == 'long', user earns +. If side == 'short', user pays -.
    let singleIntervalYieldUsd = 0;
    if (calcMode === 'perps') {
      if (positionSide === 'short') {
        singleIntervalYieldUsd = positionSizeUsd * singleIntervalRateDecimal;
      } else {
        singleIntervalYieldUsd = -positionSizeUsd * singleIntervalRateDecimal;
      }
    } else {
      // In Delta-Neutral Cash & Carry mode:
      // Strategy is Spot Buy + Perp Short.
      // User earns positive funding whenever rate is positive (Longs pay Shorts).
      singleIntervalYieldUsd = positionSizeUsd * singleIntervalRateDecimal;
    }

    // 2. Daily Earnings / Cost ($)
    const dailyYieldUsd = singleIntervalYieldUsd * intervalsPerDay;

    // 3. Total Holding Period Gross Yield ($)
    const totalHoldingIntervals = intervalsPerDay * holdingDays;
    const grossYieldHoldingPeriodUsd = singleIntervalYieldUsd * totalHoldingIntervals;

    // 4. Simple Annualized APR (%)
    // APR = (Single Interval Rate % * Intervals Per Year)
    const simpleAprPercent = (fundingRatePercent * intervalsPerYear);

    // 5. Compounded APY (%)
    // APY = ((1 + (Daily Rate))^365 - 1) * 100
    const dailyRateDecimal = (fundingRatePercent / 100) * intervalsPerDay;
    let compoundedApyPercent = 0;
    if (dailyRateDecimal > -0.99) {
      compoundedApyPercent = (Math.pow(1 + dailyRateDecimal, 365) - 1) * 100;
    }

    // 6. Exchange Trading Fees ($) (Spot entry + Spot exit + Perp entry + Perp exit)
    // Trading Fee input is for entry+exit round-trip percentage
    // For Delta-Neutral Arbitrage, you trade 2 legs (Spot + Perp), so round-trip fee applies to position size
    const totalTradingFeeUsd = calcMode === 'arbitrage'
      ? positionSizeUsd * (tradingFeePercent / 100) * 2 // 2 legs (Spot + Perp)
      : positionSizeUsd * (tradingFeePercent / 100);    // 1 leg (Perp only)

    // 7. Net Profit After Trading Fees ($)
    const netYieldHoldingPeriodUsd = grossYieldHoldingPeriodUsd - totalTradingFeeUsd;
    const netReturnOnCapitalPercent = (netYieldHoldingPeriodUsd / positionSizeUsd) * 100;

    // 8. Breakeven Holding Days Needed to Cover Trading Fees
    const dailyFeeCost = totalTradingFeeUsd;
    const breakevenDays = dailyYieldUsd > 0 ? (totalTradingFeeUsd / dailyYieldUsd) : Infinity;

    // 9. Status & Danger Zone Classification
    let riskLevel: 'safe' | 'warning' | 'danger' = 'safe';
    let statusTitle = 'High Yield Arbitrage Zone';
    let statusMessage = 'Excellent funding rate yield! Short position earns steady passive income.';

    if (netYieldHoldingPeriodUsd < 0) {
      riskLevel = 'danger';
      statusTitle = 'Negative Yield / Fee Leakage Zone';
      statusMessage = 'Trading fees or adverse funding rates eat your capital! Adjust holding duration or strategy.';
    } else if (breakevenDays > holdingDays) {
      riskLevel = 'warning';
      statusTitle = 'Fee Drag Horizon Warning';
      statusMessage = `You need to hold at least ${breakevenDays.toFixed(1)} days to break even on exchange trading fees!`;
    }

    return {
      intervalsPerDay,
      intervalsPerYear,
      singleIntervalYieldUsd,
      dailyYieldUsd,
      grossYieldHoldingPeriodUsd,
      simpleAprPercent,
      compoundedApyPercent,
      totalTradingFeeUsd,
      netYieldHoldingPeriodUsd,
      netReturnOnCapitalPercent,
      breakevenDays,
      riskLevel,
      statusTitle,
      statusMessage
    };
  }, [positionSizeUsd, fundingRatePercent, intervalHours, positionSide, holdingDays, tradingFeePercent, calcMode]);

  // ---------------------------------------------------------------------------
  // SHARE / COPY LINK
  // ---------------------------------------------------------------------------
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Structured Schema Markup for SEO & AI Crawlers
  const jsonLdSchema = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          'name': 'Crypto Funding Rate APR & Arbitrage Yield Calculator',
          'operatingSystem': 'Web Browser',
          'applicationCategory': 'FinanceApplication',
          'url': 'https://tradejournall.com/tools/crypto-funding-rate-arbitrage-calculator',
          'description': 'Calculate perpetual futures funding rates APR, compounded APY, and net delta-neutral cash and carry arbitrage returns for Binance, Bybit, OKX, and Hyperliquid.',
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
              'name': 'Crypto Funding Rate Arbitrage Calculator',
              'item': 'https://tradejournall.com/tools/crypto-funding-rate-arbitrage-calculator'
            }
          ]
        },
        {
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'What is crypto perpetual funding rate APR and how is it calculated?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Crypto perpetual funding rate APR is the annualized yield earned or paid on perpetual futures contracts. For an 8-hour funding interval, APR = 8-Hour Funding Rate (%) x 3 intervals x 365 days.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How does Delta-Neutral Cash and Carry Arbitrage work in crypto?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Cash and carry arbitrage involves buying spot crypto asset (e.g. BTC) and simultaneously opening a 1x short position on perpetual futures. Because market risk is hedged (delta-neutral), you collect positive funding rates without directional price risk.'
              }
            },
            {
              '@type': 'Question',
              'name': 'What is the difference between Simple APR and Compounded APY in funding rates?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Simple APR multiplies daily funding yield linearly by 365 days. Compounded APY assumes that daily funding earnings are reinvested back into the position to compound interest over 365 days.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Why do Hyperliquid and DEXs use 1-hour funding rates instead of 8-hour?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Decentralized perpetual exchanges like Hyperliquid update funding rates hourly (1-hour interval) to align contract prices faster with spot index prices, resulting in 24 funding payouts per day.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Does short position always earn funding rate in perpetual futures?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Short positions earn funding only when the funding rate is positive (perpetual price trades at a premium over spot). When funding rate is negative, Long positions earn funding from Short positions.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How to calculate net profit after Binance or Bybit trading fees?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Net Profit = Gross Accumulated Funding Yield - Total Exchange Taker/Maker Fees (Spot Entry/Exit + Perp Entry/Exit). You must hold the position long enough to break even on trading fees.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Is delta-neutral funding arbitrage completely risk free?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'No trading strategy is 100% risk free. Risks include exchange counterparty risk, liquidation of short position during extreme price spikes if leverage > 1x is used, and funding rates flipping negative.'
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
        <title>Crypto Funding Rate APR & Arbitrage Yield Calculator (Binance, Bybit, Hyperliquid) — TradeJournall</title>
        <meta
          name="description"
          content="Free Crypto Funding Rate APR & Delta-Neutral Arbitrage Yield Calculator. Convert 8h/1h funding rates to annual APR, compounded APY, and net profit after exchange fees for Binance, Bybit, OKX & Hyperliquid."
        />
        <meta
          name="keywords"
          content="crypto funding rate apr calculator, binance funding rate calculator, bybit funding rate annual yield, delta neutral arbitrage calculator, hyperliquid hourly funding calculator, cash and carry arbitrage profit tool, tradejournall"
        />
        <link rel="canonical" href="https://tradejournall.com/tools/crypto-funding-rate-arbitrage-calculator" />
        <meta property="og:title" content="Crypto Funding Rate APR & Delta-Neutral Arbitrage Yield Calculator" />
        <meta
          property="og:description"
          content="Calculate 8-hour and 1-hour funding rates to annual APR & APY yield. Delta-neutral cash & carry arbitrage net profit calculator."
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
              Global Crypto Derivatives Utility
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Zap className="text-emerald-400 fill-emerald-400/20" size={26} />
            Crypto Funding Rate APR & Arbitrage Yield Calculator
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Convert 8-hour / 1-hour perpetual funding rates into annual APR, daily yield ($), compounded APY, and net delta-neutral arbitrage profit after trading fees.
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
          
          {/* STRATEGY MODE TOGGLE */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Select Calculation Strategy Mode
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setCalcMode('arbitrage')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer ${
                  calcMode === 'arbitrage'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Scale size={15} />
                <span>Delta-Neutral Cash & Carry</span>
              </button>

              <button
                type="button"
                onClick={() => setCalcMode('perps')}
                className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer ${
                  calcMode === 'perps'
                    ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingUp size={15} />
                <span>Single Perp Position</span>
              </button>
            </div>
          </div>

          {/* EXCHANGE PRESETS */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              2. Exchange Interval Preset
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EXCHANGE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleExchangeSelect(preset)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    selectedExchange === preset.name
                      ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-xs font-black">{preset.name}</span>
                  <span className="text-[10px] text-emerald-400 font-mono mt-1 font-semibold">
                    {preset.intervalHours}h Interval
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* POSITION SIZE INPUT */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <label>3. Total Position / Capital Size ({primaryCurrencySymbol})</label>
              <span className="text-emerald-400 font-mono">{primaryCurrencySymbol}{positionSizeUsd.toLocaleString()}</span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">
                {primaryCurrencySymbol}
              </span>
              <input
                type="number"
                min="10"
                max="10000000"
                step="100"
                value={positionSizeUsd}
                onChange={(e) => setPositionSizeUsd(Math.max(10, parseFloat(e.target.value) || 0))}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-9 pr-4 text-white font-mono font-bold text-sm focus:border-emerald-500 outline-none transition"
              />
            </div>
            {/* Quick Capital Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[1000, 5000, 10000, 25000, 50000, 100000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setPositionSizeUsd(amt)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition cursor-pointer ${
                    positionSizeUsd === amt
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {primaryCurrencySymbol}{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* FUNDING RATE PERCENT & POSITION SIDE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* FUNDING RATE INPUT */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                <label>4. Funding Rate (% / {intervalHours}h)</label>
                <span className="text-purple-400 font-mono">{fundingRatePercent > 0 ? `+${fundingRatePercent}%` : `${fundingRatePercent}%`}</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  value={fundingRatePercent}
                  onChange={(e) => setFundingRatePercent(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-white font-mono font-bold text-sm focus:border-purple-500 outline-none transition"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-purple-400 font-bold">
                  %
                </span>
              </div>
              {/* Quick Rate Pills */}
              <div className="flex flex-wrap gap-1 pt-1">
                {[0.005, 0.01, 0.03, 0.05, 0.1].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setFundingRatePercent(rate)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                      fundingRatePercent === rate
                        ? 'bg-purple-500 text-slate-950 font-bold'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    +{rate}%
                  </button>
                ))}
              </div>
            </div>

            {/* POSITION SIDE (ONLY IN PERPS MODE) */}
            {calcMode === 'perps' ? (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Position Direction
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPositionSide('short')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      positionSide === 'short'
                        ? 'bg-rose-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <TrendingDown size={14} />
                    <span>Short (Earns Positive)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPositionSide('long')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      positionSide === 'long'
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <TrendingUp size={14} />
                    <span>Long (Earns Negative)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Round-Trip Trading Fee (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={tradingFeePercent}
                    onChange={(e) => setTradingFeePercent(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 px-4 text-white font-mono font-bold text-sm focus:border-emerald-500 outline-none transition"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-emerald-400 font-bold">
                    %
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Total entry + exit fees (Taker ~0.05%)</p>
              </div>
            )}

          </div>

          {/* HOLDING DURATION SLIDER */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <label className="flex items-center gap-1.5">
                <Clock size={14} className="text-emerald-400" />
                <span>5. Holding Target Duration ({holdingDays} Days)</span>
              </label>
              <span className="text-emerald-400 font-mono font-bold">{holdingDays} Days ({holdingDays * (24 / intervalHours)} payouts)</span>
            </div>
            <input
              type="range"
              min="1"
              max="365"
              step="1"
              value={holdingDays}
              onChange={(e) => setHoldingDays(parseInt(e.target.value) || 1)}
              className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1 Day</span>
              <span>7 Days</span>
              <span>30 Days</span>
              <span>90 Days</span>
              <span>365 Days (1 Year)</span>
            </div>
          </div>

        </div>

        {/* OUTPUT RESULTS CARD (RIGHT 5 COLUMNS) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* CORE YIELD SUMMARY CARD */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 relative overflow-hidden">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Activity size={16} className="text-emerald-400" />
                Real-Time Funding Yield Metrics
              </span>
              <span className="text-[10px] bg-emerald-950 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold">
                {intervalHours}h Interval
              </span>
            </div>

            {/* BIG METRIC 1: NET PROFIT HOLDING PERIOD */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Net Profit After Trading Fees ({holdingDays} Days)
              </span>
              <div className="flex items-baseline justify-between">
                <div className={`text-3xl font-black font-mono tracking-tight ${results.netYieldHoldingPeriodUsd >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {results.netYieldHoldingPeriodUsd >= 0 ? '+' : ''}{primaryCurrencySymbol}{results.netYieldHoldingPeriodUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <span className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded-md ${results.netReturnOnCapitalPercent >= 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-rose-950 text-rose-300 border border-rose-500/30'}`}>
                  {results.netReturnOnCapitalPercent >= 0 ? '+' : ''}{results.netReturnOnCapitalPercent.toFixed(2)}% ROI
                </span>
              </div>
            </div>

            {/* METRICS GRID 2: APR & APY */}
            <div className="grid grid-cols-2 gap-3">
              {/* SIMPLE APR */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Simple Annualized APR
                </span>
                <div className="text-lg font-black font-mono text-purple-300">
                  {results.simpleAprPercent >= 0 ? '+' : ''}{results.simpleAprPercent.toFixed(2)}%
                </div>
              </div>

              {/* COMPOUNDED APY */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Compounded APY (365d)
                </span>
                <div className="text-lg font-black font-mono text-emerald-300">
                  {results.compoundedApyPercent >= 0 ? '+' : ''}{results.compoundedApyPercent.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* BREAKDOWN LIST */}
            <div className="space-y-2.5 pt-2 text-xs border-t border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Single Interval Payout ({intervalHours}h):</span>
                <span className="font-mono font-bold text-white">
                  {results.singleIntervalYieldUsd >= 0 ? '+' : ''}{primaryCurrencySymbol}{results.singleIntervalYieldUsd.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Daily Funding Earnings (24h):</span>
                <span className="font-mono font-bold text-emerald-400">
                  {results.dailyYieldUsd >= 0 ? '+' : ''}{primaryCurrencySymbol}{results.dailyYieldUsd.toFixed(2)} / day
                </span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Total Exchange Trading Fees:</span>
                <span className="font-mono font-bold text-rose-400">
                  -{primaryCurrencySymbol}{results.totalTradingFeeUsd.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Fee Breakeven Horizon:</span>
                <span className="font-mono font-bold text-amber-300">
                  {isFinite(results.breakevenDays) ? `${results.breakevenDays.toFixed(1)} Days` : 'N/A'}
                </span>
              </div>
            </div>

          </div>

          {/* RISK & YIELD STATUS GAUGE CARD */}
          <div className={`p-5 rounded-3xl border shadow-xl space-y-2.5 ${
            results.riskLevel === 'safe'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : results.riskLevel === 'warning'
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}>
            <h4 className="text-sm font-extrabold flex items-center gap-2">
              {results.riskLevel === 'safe' && <CheckCircle2 size={18} className="text-emerald-400" />}
              {results.riskLevel === 'warning' && <AlertTriangle size={18} className="text-amber-400" />}
              {results.riskLevel === 'danger' && <XCircle size={18} className="text-rose-400" />}
              <span>{results.statusTitle}</span>
            </h4>
            <p className="text-xs leading-relaxed opacity-90">
              {results.statusMessage}
            </p>
          </div>

        </div>

      </div>

      {/* --------------------------------------------------------------------- */}
      {/* CONVERSION LEAD MAGNET BANNER */}
      {/* --------------------------------------------------------------------- */}
      <div className="mb-10 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
            TradeJournall Derivatives Discipline
          </span>
          <h4 className="text-base font-extrabold text-white mt-0.5">
            Track Perpetual Funding Yields & Arbitrage Trades Automatically
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            Log your Binance, Bybit, OKX, and Hyperliquid positions on TradeJournall to audit net funding payouts and win-rates in real time.
          </p>
        </div>

        <button
          onClick={() => {
            if (onLogTrade) {
              onLogTrade({
                symbol: `${selectedExchange} ARBITRAGE`,
                entryPrice: positionSizeUsd,
                exitPrice: positionSizeUsd + results.netYieldHoldingPeriodUsd,
                pnl: results.netYieldHoldingPeriodUsd,
                type: 'Short',
              });
            }
          }}
          className="whitespace-nowrap bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs sm:text-sm transition shadow-lg shadow-emerald-400/20 flex items-center gap-2 cursor-pointer"
        >
          <span>Log Arbitrage Setup</span>
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
                Derivatives Masterclass Guide 2026
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-3 mb-2 leading-tight">
                Crypto Funding Rate APR & Delta-Neutral Arbitrage Yield Masterclass
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Learn how perpetual futures funding rates work on <strong>Binance</strong>, <strong>Bybit</strong>, <strong>OKX</strong>, and <strong>Hyperliquid</strong>. Master the step-by-step mathematics of converting 8-hour / 1-hour funding rates to annual <strong>APR</strong>, compounded <strong>APY</strong>, and calculating net <strong>Delta-Neutral Cash & Carry Arbitrage profits</strong> after exchange trading fees.
              </p>
            </div>

            {/* SECTION 1: WHAT IS FUNDING RATE */}
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-400">
                1. What is Crypto Perpetual Funding Rate and How Does It Work?
              </h3>
              <p className="text-slate-300 leading-relaxed">
                In crypto derivatives markets, <strong>perpetual futures contracts</strong> do not have an expiry date. To ensure that the price of perpetual contracts stays anchored to the underlying spot market price, crypto exchanges enforce a periodic fee mechanism called the <strong>Funding Rate</strong>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Positive Funding Rate (+0.01%)</div>
                  <p className="text-xs text-slate-300">
                    Perpetual contract price is trading <strong>higher than spot price</strong> (Bullish sentiment). <strong>Long position holders pay Short position holders</strong> every funding interval.
                  </p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-rose-500/30 space-y-2">
                  <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">Negative Funding Rate (-0.02%)</div>
                  <p className="text-xs text-slate-300">
                    Perpetual contract price is trading <strong>lower than spot price</strong> (Bearish sentiment). <strong>Short position holders pay Long position holders</strong> every funding interval.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 2: 8-HOUR VS 1-HOUR INTERVALS */}
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-400">
                2. Exchange Funding Intervals: 8-Hour vs 1-Hour (Binance vs Hyperliquid)
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Different crypto exchanges calculate funding payouts at different time intervals:
              </p>
              <ul className="text-slate-300 space-y-2 list-disc list-inside text-xs sm:text-sm">
                <li><strong>Binance, Bybit & OKX (8-Hour Interval):</strong> Funding is paid 3 times per day (00:00, 08:00, 16:00 UTC). A 0.01% rate equals 0.03% daily yield (10.95% APR).</li>
                <li><strong>Hyperliquid & DEXs (1-Hour Interval):</strong> Funding is calculated every hour (24 times per day). Rates are smaller per interval, but compound faster over 365 days.</li>
              </ul>
            </div>

            {/* SECTION 3: DELTA NEUTRAL ARBITRAGE */}
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-400">
                3. Delta-Neutral Cash & Carry Arbitrage Mechanics
              </h3>
              <p className="text-slate-300 leading-relaxed">
                <strong>Delta-Neutral Cash & Carry Arbitrage</strong> is an institutional yield strategy that allows traders to collect funding yield with zero market direction risk:
              </p>
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">The 3-Step Cash & Carry Blueprint</div>
                <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
                  <li><strong>Buy Spot Crypto:</strong> Buy $10,000 worth of BTC in the spot market.</li>
                  <li><strong>Open 1x Short Perp:</strong> Open a $10,000 1x Short position on BTC Perpetual Futures.</li>
                  <li><strong>Collect Yield:</strong> If BTC price goes up 20%, your spot gain (+ $2,000) cancels out your perp short loss (- $2,000). You remain net $0 price risk (Delta Neutral) while collecting positive funding rate payouts every 8 hours!</li>
                </ol>
              </div>
            </div>

            {/* SECTION 4: APR VS APY FORMULAS */}
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-400">
                4. Mathematical Formulas: Simple APR vs. Compounded APY
              </h3>
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="font-mono text-xs sm:text-sm text-purple-300 bg-slate-900 p-3 rounded-xl border border-slate-800 text-center font-bold">
                  Simple APR (%) = Funding Rate per Interval (%) × Intervals Per Day × 365
                </div>
                <div className="font-mono text-xs sm:text-sm text-emerald-300 bg-slate-900 p-3 rounded-xl border border-slate-800 text-center font-bold">
                  Compounded APY (%) = [(1 + Daily Funding Rate)^365 - 1] × 100
                </div>
              </div>
            </div>

            {/* SECTION 5: FAQ SECTION */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-400">
                Frequently Asked Questions (FAQ) — Crypto Funding Rate & Arbitrage
              </h3>
              
              <div className="space-y-3">
                <div className="border border-slate-800 rounded-2xl p-5 bg-slate-950/60 space-y-2">
                  <h5 className="font-bold text-white text-sm">What is crypto perpetual funding rate APR and how is it calculated?</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Crypto perpetual funding rate APR is the annualized yield earned or paid on perpetual futures contracts. For an 8-hour funding interval, APR = 8-Hour Funding Rate (%) x 3 intervals x 365 days.
                  </p>
                </div>

                <div className="border border-slate-800 rounded-2xl p-5 bg-slate-950/60 space-y-2">
                  <h5 className="font-bold text-white text-sm">How does Delta-Neutral Cash and Carry Arbitrage work in crypto?</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Cash and carry arbitrage involves buying spot crypto asset (e.g. BTC) and simultaneously opening a 1x short position on perpetual futures. Because market risk is hedged (delta-neutral), you collect positive funding rates without directional price risk.
                  </p>
                </div>

                <div className="border border-slate-800 rounded-2xl p-5 bg-slate-950/60 space-y-2">
                  <h5 className="font-bold text-white text-sm">What is the difference between Simple APR and Compounded APY in funding rates?</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Simple APR multiplies daily funding yield linearly by 365 days. Compounded APY assumes that daily funding earnings are reinvested back into the position to compound interest over 365 days.
                  </p>
                </div>

                <div className="border border-slate-800 rounded-2xl p-5 bg-slate-950/60 space-y-2">
                  <h5 className="font-bold text-white text-sm">Why do Hyperliquid and DEXs use 1-hour funding rates instead of 8-hour?</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Decentralized perpetual exchanges like Hyperliquid update funding rates hourly (1-hour interval) to align contract prices faster with spot index prices, resulting in 24 funding payouts per day.
                  </p>
                </div>

                <div className="border border-slate-800 rounded-2xl p-5 bg-slate-950/60 space-y-2">
                  <h5 className="font-bold text-white text-sm">Does short position always earn funding rate in perpetual futures?</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Short positions earn funding only when the funding rate is positive (perpetual price trades at a premium over spot). When funding rate is negative, Long positions earn funding from Short positions.
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
