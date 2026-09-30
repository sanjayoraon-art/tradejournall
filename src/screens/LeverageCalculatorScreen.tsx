import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ShieldAlert,
  AlertTriangle,
  Zap,
  TrendingUp,
  RotateCcw,
  Copy,
  Check,
  Code,
  Share2,
  Info,
  DollarSign,
  Percent,
  Activity,
  Layers,
  Flame,
  ArrowRight,
  ExternalLink,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  SlidersHorizontal
} from 'lucide-react';
import { formatNumber } from '../utils/helpers';

interface LeverageCalculatorScreenProps {
  theme: any;
  isDarkMode: boolean;
  primaryCurrencySymbol?: string;
  onBackToLanding?: () => void;
  onSignIn?: () => void;
  onLogTrade?: (tradeData: {
    symbol: string;
    entryPrice: number;
    exitPrice: number;
    pnl: number;
    type: 'Long' | 'Short';
  }) => void;
}

// Preset definitions for Crypto & Forex Assets
export interface AssetPreset {
  symbol: string;
  name: string;
  category: 'crypto' | 'forex';
  defaultPrice: number;
  contractSize: number; // 1 unit for crypto, 100,000 for standard forex lot
  defaultMMR: number; // Maintenance margin rate %
  stepPrice: number;
  unitLabel: string;
}

export const ASSET_PRESETS: AssetPreset[] = [
  // Crypto
  { symbol: 'BTC/USDT', name: 'Bitcoin Perpetual', category: 'crypto', defaultPrice: 65000, contractSize: 1, defaultMMR: 0.5, stepPrice: 1, unitLabel: 'BTC' },
  { symbol: 'ETH/USDT', name: 'Ethereum Perpetual', category: 'crypto', defaultPrice: 3400, contractSize: 1, defaultMMR: 0.5, stepPrice: 0.1, unitLabel: 'ETH' },
  { symbol: 'SOL/USDT', name: 'Solana Perpetual', category: 'crypto', defaultPrice: 145, contractSize: 1, defaultMMR: 0.5, stepPrice: 0.01, unitLabel: 'SOL' },
  { symbol: 'CUSTOM_CRYPTO', name: 'Custom Crypto Pair', category: 'crypto', defaultPrice: 100, contractSize: 1, defaultMMR: 0.5, stepPrice: 0.01, unitLabel: 'Coins' },
  // Forex & Commodities
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'forex', defaultPrice: 1.0850, contractSize: 100000, defaultMMR: 1.0, stepPrice: 0.0001, unitLabel: 'Lots' },
  { symbol: 'GBP/USD', name: 'British Pound / USD', category: 'forex', defaultPrice: 1.2950, contractSize: 100000, defaultMMR: 1.0, stepPrice: 0.0001, unitLabel: 'Lots' },
  { symbol: 'XAU/USD', name: 'Gold Spot / USD', category: 'forex', defaultPrice: 2650.00, contractSize: 100, defaultMMR: 0.5, stepPrice: 0.1, unitLabel: 'Oz' },
  { symbol: 'CUSTOM_FOREX', name: 'Custom Forex / Commodity', category: 'forex', defaultPrice: 1.0000, contractSize: 100000, defaultMMR: 1.0, stepPrice: 0.0001, unitLabel: 'Lots' },
];

export interface MMRPreset {
  id: string;
  name: string;
  mmr: number;
  description: string;
}

export const MMR_PRESETS: MMRPreset[] = [
  { id: 'binance', name: 'Binance / Bybit (0.5% MMR)', mmr: 0.5, description: 'StandardTier 1 Crypto Futures MMR' },
  { id: 'okx', name: 'OKX / KuCoin (0.4% MMR)', mmr: 0.4, description: 'Competitive Tier MMR for major pairs' },
  { id: 'forex_std', name: 'Standard Forex Broker (1.0% MMR)', mmr: 1.0, description: '1:100 leverage margin requirement' },
  { id: 'custom', name: 'Custom MMR %', mmr: 0.5, description: 'User-specified Maintenance Margin' },
];

export const LeverageCalculatorScreen: React.FC<LeverageCalculatorScreenProps> = ({
  theme,
  isDarkMode,
  primaryCurrencySymbol = '$',
  onBackToLanding,
  onSignIn,
  onLogTrade
}) => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [assetCategory, setAssetCategory] = useState<'crypto' | 'forex'>('crypto');
  const [direction, setDirection] = useState<'Long' | 'Short'>('Long');
  const [marginMode, setMarginMode] = useState<'isolated' | 'cross'>('isolated');

  // Selected Asset Preset
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState<string>('BTC/USDT');

  // Numerical Inputs
  const [entryPriceInput, setEntryPriceInput] = useState<string>('65000');
  const [allocatedMarginInput, setAllocatedMarginInput] = useState<string>('500');
  const [totalEquityInput, setTotalEquityInput] = useState<string>('2500');
  const [leverage, setLeverage] = useState<number>(20);
  const [mmrPresetId, setMmrPresetId] = useState<string>('binance');
  const [customMMRInput, setCustomMMRInput] = useState<string>('0.5');

  // Stop Loss & Risk Management Inputs
  const [stopLossInput, setStopLossInput] = useState<string>('63000');
  const [maxAccountRiskPercentInput, setMaxAccountRiskPercentInput] = useState<string>('2'); // 2% risk

  // Interactive Modals & Toast State
  const [showEmbedModal, setShowEmbedModal] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [loggedNotice, setLoggedNotice] = useState<boolean>(false);
  const [embedTheme, setEmbedTheme] = useState<'dark' | 'light'>('dark');

  // Sync preset changes
  const handleAssetPresetChange = (symbol: string) => {
    setSelectedAssetSymbol(symbol);
    const preset = ASSET_PRESETS.find(p => p.symbol === symbol);
    if (preset) {
      setEntryPriceInput(preset.defaultPrice.toString());
      setAssetCategory(preset.category);
      if (preset.category === 'forex' && mmrPresetId === 'binance') {
        setMmrPresetId('forex_std');
      } else if (preset.category === 'crypto' && mmrPresetId === 'forex_std') {
        setMmrPresetId('binance');
      }

      // Default stop loss calculation (approx 3% risk)
      const isLong = direction === 'Long';
      const offset = preset.defaultPrice * 0.03;
      const sl = isLong ? preset.defaultPrice - offset : preset.defaultPrice + offset;
      setStopLossInput(preset.stepPrice < 1 ? sl.toFixed(4) : sl.toFixed(1));
    }
  };

  const handleCategorySwitch = (cat: 'crypto' | 'forex') => {
    setAssetCategory(cat);
    const defaultForCat = ASSET_PRESETS.find(p => p.category === cat);
    if (defaultForCat) {
      handleAssetPresetChange(defaultForCat.symbol);
    }
  };

  // ---------------------------------------------------------------------------
  // MATHEMATICAL CALCULATION ENGINE
  // ---------------------------------------------------------------------------
  const calculations = useMemo(() => {
    const entryPrice = Math.max(0.000001, parseFloat(entryPriceInput) || 0);
    const margin = Math.max(0, parseFloat(allocatedMarginInput) || 0);
    const totalEquity = Math.max(margin, parseFloat(totalEquityInput) || margin);
    const curLeverage = Math.max(1, Math.min(125, leverage));

    // Determine MMR %
    let mmrRate = 0.5; // default 0.5%
    if (mmrPresetId === 'custom') {
      mmrRate = Math.max(0.01, Math.min(50, parseFloat(customMMRInput) || 0.5));
    } else {
      const found = MMR_PRESETS.find(m => m.id === mmrPresetId);
      if (found) mmrRate = found.mmr;
    }
    const mmrFraction = mmrRate / 100;

    // 1. Notional Position Value ($)
    const positionNotional = margin * curLeverage;

    // Current Asset specs
    const currentAsset = ASSET_PRESETS.find(a => a.symbol === selectedAssetSymbol) || ASSET_PRESETS[0];

    // Position Size in Base Units (e.g. BTC, ETH, Lots)
    const positionUnits = entryPrice > 0 ? positionNotional / entryPrice : 0;
    const forexLots = currentAsset.category === 'forex' ? positionNotional / 100000 : 0;

    // 2. Liquidation Price Calculation
    let liquidationPrice = 0;
    let bankruptcyPrice = 0;

    if (direction === 'Long') {
      // Bankruptcy Price: Loss = Margin => Entry * (1 - 1/Leverage)
      bankruptcyPrice = entryPrice * (1 - 1 / curLeverage);

      if (marginMode === 'isolated') {
        // Isolated Long Liq = Entry * (1 - (1/Leverage) + MMR)
        liquidationPrice = entryPrice * (1 - (1 / curLeverage) + mmrFraction);
      } else {
        // Cross Margin Long Liq = Entry - ((Total Equity - (Notional * MMR)) / Position Units)
        const maxTolerableLoss = totalEquity - (positionNotional * mmrFraction);
        const lossPerUnit = positionUnits > 0 ? maxTolerableLoss / positionUnits : 0;
        liquidationPrice = entryPrice - lossPerUnit;
      }
      liquidationPrice = Math.max(0, liquidationPrice);
      bankruptcyPrice = Math.max(0, bankruptcyPrice);
    } else {
      // Short Direction
      // Bankruptcy Price: Loss = Margin => Entry * (1 + 1/Leverage)
      bankruptcyPrice = entryPrice * (1 + 1 / curLeverage);

      if (marginMode === 'isolated') {
        // Isolated Short Liq = Entry * (1 + (1/Leverage) - MMR)
        liquidationPrice = entryPrice * (1 + (1 / curLeverage) - mmrFraction);
      } else {
        // Cross Margin Short Liq = Entry + ((Total Equity - (Notional * MMR)) / Position Units)
        const maxTolerableLoss = totalEquity - (positionNotional * mmrFraction);
        const lossPerUnit = positionUnits > 0 ? maxTolerableLoss / positionUnits : 0;
        liquidationPrice = entryPrice + lossPerUnit;
      }
    }

    // 3. Distance to Liquidation (% and $)
    const distancePrice = Math.abs(entryPrice - liquidationPrice);
    const distancePercent = entryPrice > 0 ? (distancePrice / entryPrice) * 100 : 0;

    // 4. Danger Level Categorization
    // Green (Safe): > 15% away
    // Yellow/Orange (Caution): 5% - 15% away
    // Red (Danger): < 5% away (Flash Wick Risk)
    let dangerZone: 'safe' | 'caution' | 'danger' = 'safe';
    let dangerColorClass = 'text-green-500';
    let dangerBgClass = 'bg-green-500/20 border-green-500/30';
    let dangerBadgeText = 'Safe Zone';
    let barWidthPercent = Math.min(100, Math.max(5, (distancePercent / 25) * 100));

    if (distancePercent < 5) {
      dangerZone = 'danger';
      dangerColorClass = 'text-red-500';
      dangerBgClass = 'bg-red-500/20 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse';
      dangerBadgeText = '⚡ FLASH WICK DANGER';
    } else if (distancePercent <= 15) {
      dangerZone = 'caution';
      dangerColorClass = 'text-amber-400';
      dangerBgClass = 'bg-amber-500/20 border-amber-500/30';
      dangerBadgeText = 'Caution Zone';
    }

    // 5. Recommended Safe Position Size & Stop Loss Risk Calculation
    const stopLossPrice = parseFloat(stopLossInput) || 0;
    const maxAccountRiskPercent = parseFloat(maxAccountRiskPercentInput) || 2;
    const maxAllowedRiskDollar = totalEquity * (maxAccountRiskPercent / 100);

    const slDistancePrice = Math.abs(entryPrice - stopLossPrice);
    const slDistancePercent = entryPrice > 0 ? (slDistancePrice / entryPrice) * 100 : 0;

    // Recommended Safe Position Notional ($) = Risk Amount / (SL Distance %)
    let maxSafeNotional = 0;
    let maxSafeMargin = 0;
    let maxSafePositionUnits = 0;
    let maxSafeForexLots = 0;

    if (slDistancePercent > 0) {
      maxSafeNotional = maxAllowedRiskDollar / (slDistancePercent / 100);
      maxSafeMargin = maxSafeNotional / curLeverage;
      maxSafePositionUnits = entryPrice > 0 ? maxSafeNotional / entryPrice : 0;
      maxSafeForexLots = maxSafeNotional / 100000;
    }

    // Stop Loss Validity Check
    let isSlInvalid = false;
    let isSlWorseThanLiq = false;

    if (stopLossPrice > 0) {
      if (direction === 'Long') {
        if (stopLossPrice >= entryPrice) isSlInvalid = true;
        if (stopLossPrice <= liquidationPrice) isSlWorseThanLiq = true;
      } else {
        if (stopLossPrice <= entryPrice) isSlInvalid = true;
        if (stopLossPrice >= liquidationPrice) isSlWorseThanLiq = true;
      }
    }

    // Effective Leverage (Actual leverage on total equity)
    const effectiveLeverage = totalEquity > 0 ? positionNotional / totalEquity : curLeverage;

    return {
      entryPrice,
      margin,
      totalEquity,
      curLeverage,
      effectiveLeverage,
      mmrRate,
      positionNotional,
      positionUnits,
      forexLots,
      liquidationPrice,
      bankruptcyPrice,
      distancePrice,
      distancePercent,
      dangerZone,
      dangerColorClass,
      dangerBgClass,
      dangerBadgeText,
      barWidthPercent,
      stopLossPrice,
      slDistancePrice,
      slDistancePercent,
      maxAllowedRiskDollar,
      maxSafeNotional,
      maxSafeMargin,
      maxSafePositionUnits,
      maxSafeForexLots,
      isSlInvalid,
      isSlWorseThanLiq,
      currentAsset
    };
  }, [
    entryPriceInput,
    allocatedMarginInput,
    totalEquityInput,
    leverage,
    mmrPresetId,
    customMMRInput,
    direction,
    marginMode,
    selectedAssetSymbol,
    stopLossInput,
    maxAccountRiskPercentInput
  ]);

  // ---------------------------------------------------------------------------
  // COPIES & EMBED UTILITIES
  // ---------------------------------------------------------------------------
  const generateEmbedCode = () => {
    return `<iframe src="https://tradejournall.com/tools/leverage-danger-calculator?embed=true&theme=${embedTheme}" width="100%" height="700" frameborder="0" style="border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3);" title="Crypto & Forex Leverage Danger Calculator - TradeJournal"></iframe>`;
  };

  const handleCopyEmbedCode = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopySummary = () => {
    const summaryText = `📊 TRADING LEVERAGE RISK CALCULATION (${calculations.currentAsset.symbol})
-----------------------------------
- Direction: ${direction.toUpperCase()} (${marginMode.toUpperCase()} MARGIN)
- Entry Price: ${primaryCurrencySymbol}${formatNumber(calculations.entryPrice, 2)}
- Allocated Margin: ${primaryCurrencySymbol}${formatNumber(calculations.margin, 2)}
- Leverage: ${calculations.curLeverage}x (Notional Value: ${primaryCurrencySymbol}${formatNumber(calculations.positionNotional, 2)})
-----------------------------------
🚨 EXACT LIQUIDATION PRICE: ${primaryCurrencySymbol}${formatNumber(calculations.liquidationPrice, 2)}
📉 Distance to Liquidation: ${formatNumber(calculations.distancePercent, 2)}% (${primaryCurrencySymbol}${formatNumber(calculations.distancePrice, 2)})
⚡ Danger Level: ${calculations.dangerBadgeText}
🛡️ Recommended Max Safe Position: ${formatNumber(calculations.maxSafeNotional, 2)} USD
-----------------------------------
Calculated with TradeJournal Leverage Danger Calculator
https://tradejournall.com/tools/leverage-danger-calculator`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleLogCalculatedTrade = () => {
    if (onLogTrade) {
      // Calculate estimated PnL at Stop Loss or target
      const slDist = Math.abs(calculations.entryPrice - calculations.stopLossPrice);
      const estPnl = direction === 'Long'
        ? (calculations.stopLossPrice - calculations.entryPrice) * calculations.positionUnits
        : (calculations.entryPrice - calculations.stopLossPrice) * calculations.positionUnits;

      onLogTrade({
        symbol: calculations.currentAsset.symbol.replace('/', ''),
        entryPrice: calculations.entryPrice,
        exitPrice: calculations.stopLossPrice > 0 ? calculations.stopLossPrice : calculations.liquidationPrice,
        pnl: estPnl || -calculations.margin,
        type: direction
      });
      setLoggedNotice(true);
      setTimeout(() => setLoggedNotice(false), 3000);
    }
  };

  // Reset all fields
  const handleReset = () => {
    setEntryPriceInput('65000');
    setAllocatedMarginInput('500');
    setTotalEquityInput('2500');
    setLeverage(20);
    setDirection('Long');
    setMarginMode('isolated');
    setSelectedAssetSymbol('BTC/USDT');
    setMmrPresetId('binance');
    setStopLossInput('63000');
    setMaxAccountRiskPercentInput('2');
  };

  // Inject Structured JSON-LD Schema & Dynamic SEO Meta Tags on mount
  useEffect(() => {
    const metaTitle = "Crypto Liquidation Calculator & Leverage Danger Tool | TradeJournal";
    const metaDescription = "Calculate exact liquidation price, distance to liquidation for Binance, Bybit, BTC, XAUUSD, and 100x leverage trades before executing.";
    const metaKeywords = "crypto liquidation calculator, leverage danger tool, binance liquidation calculator, bybit liquidation calculator, btc liquidation price, xauusd leverage calculator, 100x leverage calculator, crypto futures position sizing, tradejournal";

    document.title = metaTitle;

    const setMetaTag = (nameAttr: string, attrValue: string, contentValue: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    setMetaTag('name', 'title', metaTitle);
    setMetaTag('name', 'description', metaDescription);
    setMetaTag('name', 'keywords', metaKeywords);
    setMetaTag('property', 'og:title', metaTitle);
    setMetaTag('property', 'og:description', metaDescription);
    setMetaTag('property', 'twitter:title', metaTitle);
    setMetaTag('property', 'twitter:description', metaDescription);

    const scriptId = 'leverage-calc-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Crypto Liquidation Calculator & Leverage Danger Tool",
      "url": "https://tradejournall.com/tools/leverage-danger-calculator",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All",
      "description": metaDescription,
      "publisher": {
        "@type": "Organization",
        "name": "TradeJournal",
        "url": "https://tradejournall.com"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };

    scriptTag.text = JSON.stringify(schemaData);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 pb-20 pt-2 animate-in fade-in duration-500 text-slate-50">
      <Helmet>
        <title>Crypto Liquidation Calculator & Leverage Danger Tool | TradeJournal</title>
        <meta name="title" content="Crypto Liquidation Calculator & Leverage Danger Tool | TradeJournal" />
        <meta name="description" content="Calculate exact liquidation price, distance to liquidation for Binance, Bybit, BTC, XAUUSD, and 100x leverage trades before executing." />
        <meta name="keywords" content="crypto liquidation calculator, leverage danger tool, binance liquidation calculator, bybit liquidation calculator, btc liquidation price, xauusd leverage calculator, 100x leverage calculator, crypto futures position sizing, tradejournal" />
        <meta property="og:title" content="Crypto Liquidation Calculator & Leverage Danger Tool | TradeJournal" />
        <meta property="og:description" content="Calculate exact liquidation price, distance to liquidation for Binance, Bybit, BTC, XAUUSD, and 100x leverage trades before executing." />
        <meta property="twitter:title" content="Crypto Liquidation Calculator & Leverage Danger Tool | TradeJournal" />
        <meta property="twitter:description" content="Calculate exact liquidation price, distance to liquidation for Binance, Bybit, BTC, XAUUSD, and 100x leverage trades before executing." />
        <link rel="canonical" href="https://tradejournall.com/tools/leverage-danger-calculator" />
      </Helmet>
      {/* ----------------------------------------------------------------------- */}
      {/* HEADER BAR & METADATA SECTION */}
      {/* ----------------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            TradeJournal Pro Financial Utilities
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <ShieldAlert className="text-emerald-400 w-8 h-8" />
            Leverage & Liquidation Danger Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Visually calculate exact Liquidation Price, Flash-Wick Risk Distance (%), Position Notional Value, and Maximum Safe Lot Sizes for Crypto Perpetuals & Forex Futures.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setShowEmbedModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all active:scale-95"
            title="Embed Widget on your blog"
          >
            <Code size={16} className="text-emerald-400" />
            Embed Widget
          </button>
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all active:scale-95"
            title="Copy formatted summary"
          >
            {copiedSummary ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
            {copiedSummary ? 'Copied!' : 'Share Calc'}
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all active:scale-95"
            title="Reset Calculator"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* MAIN 2-COLUMN GRID LAYOUT (MOBILE RESPONSIVE) */}
      {/* ----------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* =================================================================== */}
        {/* LEFT COLUMN: INPUT CONTROLS & LEVERAGE SLIDER (7 COLS) */}
        {/* =================================================================== */}
        <div className="lg:col-span-7 space-y-5">

          {/* 1. ASSET CLASS & PRESET SELECTOR CARD */}
          <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700/80 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sliders size={15} className="text-emerald-400" />
                1. Asset Class & Trading Instrument
              </label>

              {/* ASSET CLASS SWITCHER TOGGLE */}
              <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => handleCategorySwitch('crypto')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${assetCategory === 'crypto' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  Crypto Perpetuals
                </button>
                <button
                  type="button"
                  onClick={() => handleCategorySwitch('forex')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${assetCategory === 'forex' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  Forex & Commodities
                </button>
              </div>
            </div>

            {/* PRESET INSTRUMENT BUTTONS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ASSET_PRESETS.filter(p => p.category === assetCategory).map((preset) => (
                <button
                  key={preset.symbol}
                  type="button"
                  onClick={() => handleAssetPresetChange(preset.symbol)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-left flex flex-col justify-between ${selectedAssetSymbol === preset.symbol ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(34,197,94,0.15)]' : 'bg-slate-900/50 border-slate-700/80 text-slate-300 hover:border-slate-500'}`}
                >
                  <span className="font-extrabold truncate">{preset.symbol}</span>
                  <span className="text-[10px] text-slate-400 font-normal truncate">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. TRADE DIRECTION & MARGIN MODE TOGGLES CARD */}
          <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700/80 shadow-xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* DIRECTION TOGGLE */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                  Trade Direction
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setDirection('Long')}
                    className={`py-2.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${direction === 'Long' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white'}`}
                  >
                    <TrendingUp size={16} /> Long / Buy
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirection('Short')}
                    className={`py-2.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${direction === 'Short' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-slate-400 hover:text-white'}`}
                  >
                    <TrendingUp size={16} className="rotate-180" /> Short / Sell
                  </button>
                </div>
              </div>

              {/* MARGIN MODE TOGGLE */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                  Margin Mode
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setMarginMode('isolated')}
                    className={`py-2.5 rounded-lg text-xs font-extrabold transition-all ${marginMode === 'isolated' ? 'bg-slate-700 text-emerald-400 border border-emerald-500/50' : 'text-slate-400 hover:text-white'}`}
                  >
                    🔒 Isolated
                  </button>
                  <button
                    type="button"
                    onClick={() => setMarginMode('cross')}
                    className={`py-2.5 rounded-lg text-xs font-extrabold transition-all ${marginMode === 'cross' ? 'bg-slate-700 text-emerald-400 border border-emerald-500/50' : 'text-slate-400 hover:text-white'}`}
                  >
                    🌐 Cross Margin
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* 3. DYNAMIC NUMERICAL INPUTS CARD */}
          <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700/80 shadow-xl space-y-4">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <DollarSign size={15} className="text-emerald-400" />
              2. Price & Collateral Inputs
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ENTRY PRICE */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 flex justify-between">
                  <span>Entry Price ({primaryCurrencySymbol})</span>
                  <span className="text-[10px] text-slate-400 font-mono">Market / Trigger</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={entryPriceInput}
                    onChange={(e) => setEntryPriceInput(e.target.value)}
                    placeholder="65000"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm font-mono font-bold text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* ALLOCATED MARGIN */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 flex justify-between">
                  <span>Margin Allocated ({primaryCurrencySymbol})</span>
                  <span className="text-[10px] text-slate-400 font-mono">Position Initial Margin</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={allocatedMarginInput}
                    onChange={(e) => setAllocatedMarginInput(e.target.value)}
                    placeholder="500"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm font-mono font-bold text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* TOTAL ACCOUNT EQUITY (CRITICAL FOR CROSS MARGIN & RISK %) */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 flex justify-between">
                  <span>Account Total Equity ({primaryCurrencySymbol})</span>
                  <span className="text-[10px] text-slate-400 font-mono">Available Balance</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={totalEquityInput}
                    onChange={(e) => setTotalEquityInput(e.target.value)}
                    placeholder="2500"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm font-mono font-bold text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* EXCHANGE MMR PRESET SELECTOR */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 flex justify-between">
                  <span>Maintenance Margin Rate (MMR)</span>
                  <span className="text-[10px] text-slate-400 font-mono">Exchange Buffer</span>
                </label>
                <select
                  value={mmrPresetId}
                  onChange={(e) => setMmrPresetId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  {MMR_PRESETS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                {mmrPresetId === 'custom' && (
                  <div className="mt-2">
                    <input
                      type="number"
                      step="0.01"
                      value={customMMRInput}
                      onChange={(e) => setCustomMMRInput(e.target.value)}
                      placeholder="Custom MMR % (e.g. 0.5)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE LEVERAGE SLIDER CARD */}
          <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700/80 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <SlidersHorizontal size={15} className="text-emerald-400" />
                3. Choose Position Leverage ({leverage}x)
              </label>

              <span className={`text-lg font-black font-mono px-3 py-1 rounded-xl border ${leverage >= 50 ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' : leverage >= 20 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>
                {leverage}x Leverage
              </span>
            </div>

            {/* REALTIME RANGE SLIDER */}
            <div className="space-y-2 pt-2">
              <input
                type="range"
                min="1"
                max="125"
                step="1"
                value={leverage}
                onChange={(e) => setLeverage(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400 font-mono">
                <span>1x (Safe)</span>
                <span>25x</span>
                <span>50x (Caution)</span>
                <span>100x</span>
                <span>125x (Extreme Risk)</span>
              </div>
            </div>

            {/* QUICK PRESET BUTTONS */}
            <div className="flex flex-wrap gap-2 pt-2">
              {[2, 5, 10, 20, 50, 100, 125].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLeverage(lvl)}
                  className={`flex-1 min-w-[50px] py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${leverage === lvl ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md' : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'}`}
                >
                  {lvl}x
                </button>
              ))}
            </div>
          </div>

          {/* 5. STOP LOSS & RISK MANAGEMENT SIZING INPUTS */}
          <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700/80 shadow-xl space-y-4">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-emerald-400" />
              4. Stop Loss & Risk Management Sizing
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 flex justify-between">
                  <span>Stop Loss Price ({primaryCurrencySymbol})</span>
                  <span className="text-[10px] text-slate-400 font-mono">Exit Threshold</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={stopLossInput}
                  onChange={(e) => setStopLossInput(e.target.value)}
                  placeholder="63000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 flex justify-between">
                  <span>Max Account Risk %</span>
                  <span className="text-[10px] text-slate-400 font-mono">Target Max Loss</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={maxAccountRiskPercentInput}
                  onChange={(e) => setMaxAccountRiskPercentInput(e.target.value)}
                  placeholder="2"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* STOP LOSS WARNING HINTS */}
            {calculations.isSlWorseThanLiq && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />
                <span>
                  <strong>CRITICAL WARNING:</strong> Your Stop Loss is placed <u>past your Liquidation Price</u>! You will be liquidated by the exchange before your Stop Loss can execute!
                </span>
              </div>
            )}
            {calculations.isSlInvalid && !calculations.isSlWorseThanLiq && (
              <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
                <Info size={18} className="text-amber-400 flex-shrink-0" />
                <span>
                  Note: Stop Loss price should be {direction === 'Long' ? 'lower' : 'higher'} than your Entry Price for a {direction} setup.
                </span>
              </div>
            )}
          </div>

        </div>


        {/* =================================================================== */}
        {/* RIGHT COLUMN: REALTIME VISUAL ENGINE & OUTPUT CARDS (5 COLS) */}
        {/* =================================================================== */}
        <div className="lg:col-span-5 space-y-5">

          {/* 1. PRIMARY METRIC CARD: EXACT LIQUIDATION PRICE */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Flame size={120} className="text-red-500" />
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                Exact Liquidation Price
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${calculations.dangerBgClass}`}>
                {calculations.dangerBadgeText}
              </span>
            </div>

            <div className="my-3">
              <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                {primaryCurrencySymbol}{formatNumber(calculations.liquidationPrice, calculations.currentAsset.stepPrice < 1 ? 4 : 2)}
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-mono">
                <span>Entry: {primaryCurrencySymbol}{formatNumber(calculations.entryPrice, 2)}</span>
                <span>•</span>
                <span>Bankruptcy: {primaryCurrencySymbol}{formatNumber(calculations.bankruptcyPrice, 2)}</span>
              </p>
            </div>

            {/* DISTANCE STATS ROW */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700/60 mt-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Distance (%)</span>
                <span className={`text-xl font-black font-mono ${calculations.dangerColorClass}`}>
                  {formatNumber(calculations.distancePercent, 2)}%
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Distance ($)</span>
                <span className="text-xl font-black font-mono text-slate-200">
                  {primaryCurrencySymbol}{formatNumber(calculations.distancePrice, calculations.currentAsset.stepPrice < 1 ? 4 : 2)}
                </span>
              </div>
            </div>
          </div>

          {/* 2. VISUAL DANGER GAUGE BAR */}
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow-xl space-y-3">
            <div className="flex justify-between items-center text-xs font-extrabold text-slate-300">
              <span className="flex items-center gap-1">
                <Activity size={15} className="text-emerald-400" />
                Liquidation Safety Buffer
              </span>
              <span className={calculations.dangerColorClass}>
                {formatNumber(calculations.distancePercent, 2)}% Away
              </span>
            </div>

            {/* COLOR GRADIENT STATUS BAR */}
            <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700 relative">
              <div
                style={{ width: `${calculations.barWidthPercent}%` }}
                className={`h-full rounded-full transition-all duration-500 ${calculations.dangerZone === 'danger' ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]' : calculations.dangerZone === 'caution' ? 'bg-amber-400' : 'bg-emerald-500'}`}
              ></div>
            </div>

            <div className="flex justify-between text-[10px] font-bold text-slate-400 font-mono pt-1">
              <span className="text-red-400">🔴 Danger (&lt;5%)</span>
              <span className="text-amber-400">🟡 Caution (5-15%)</span>
              <span className="text-emerald-400">🟢 Safe (&gt;15%)</span>
            </div>
          </div>

          {/* 3. KEY METRICS TILES */}
          <div className="grid grid-cols-2 gap-3">
            {/* POSITION NOTIONAL VALUE */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Total Notional Value
              </span>
              <div className="text-lg font-black font-mono text-emerald-400">
                {primaryCurrencySymbol}{formatNumber(calculations.positionNotional, 2)}
              </div>
              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                Margin ({primaryCurrencySymbol}{formatNumber(calculations.margin, 0)}) × {calculations.curLeverage}x
              </span>
            </div>

            {/* RECOMMENDED SAFE POSITION SIZE */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Max Safe Notional ({maxAccountRiskPercentInput}%)
              </span>
              <div className="text-lg font-black font-mono text-amber-400">
                {primaryCurrencySymbol}{formatNumber(calculations.maxSafeNotional, 2)}
              </div>
              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                {assetCategory === 'forex' ? `${formatNumber(calculations.maxSafeForexLots, 2)} Lots` : `${formatNumber(calculations.maxSafePositionUnits, 4)} ${calculations.currentAsset.unitLabel}`}
              </span>
            </div>
          </div>

          {/* 4. SMART RISK ALERT INSIGHT BOX */}
          <div className={`p-4 sm:p-5 rounded-2xl border text-xs leading-relaxed shadow-lg ${calculations.dangerZone === 'danger' ? 'bg-red-500/10 border-red-500/30 text-red-200' : calculations.dangerZone === 'caution' ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'}`}>
            <div className="flex items-center gap-2 font-extrabold text-sm mb-2">
              {calculations.dangerZone === 'danger' ? <AlertTriangle className="text-red-400" size={18} /> : <Zap className="text-emerald-400" size={18} />}
              Smart Liquidation Insight
            </div>
            <p>
              At <strong>{calculations.curLeverage}x leverage</strong> in <strong>{marginMode.toUpperCase()} margin</strong> mode, a market wick of just <strong>{formatNumber(calculations.distancePercent, 2)}%</strong> ({primaryCurrencySymbol}{formatNumber(calculations.distancePrice, 2)}) against your {direction} entry will trigger full <strong>100% liquidation of your {primaryCurrencySymbol}{formatNumber(calculations.margin, 2)} margin</strong>.
            </p>
            {calculations.curLeverage >= 20 && (
              <p className="mt-2 text-[11px] opacity-90 border-t border-white/10 pt-2 font-sans">
                💡 <strong>Pro Tip:</strong> High leverage does not change market probability; it shrinks your error margin. Reduce leverage or lower position size to give trades breathing room against flash wicks.
              </p>
            )}
          </div>

          {/* LOG TRADE TO TRADEJOURNAL BUTTON */}
          <div className="pt-2">
            <button
              onClick={handleLogCalculatedTrade}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-emerald-500/20"
            >
              <TrendingUp size={20} />
              Log Setup to TradeJournal
            </button>
            {loggedNotice && (
              <p className="text-center text-xs text-emerald-400 font-bold mt-2 animate-bounce">
                ✅ Setup sent to TradeJournal entry form!
              </p>
            )}
          </div>

        </div>

      </div>


      {/* ----------------------------------------------------------------------- */}
      {/* CONVERSION CTA FOOTER BANNER */}
      {/* ----------------------------------------------------------------------- */}
      <div className="mt-12 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Zap size={14} /> TradeJournal Automated Tracking
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Don't Lose Trades to Flash Liquidation
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Log, track, analyze, and backtest your leveraged setups automatically with TradeJournal. Stop relying on spreadsheets and protect your capital.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {onSignIn ? (
            <button
              onClick={onSignIn}
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              Start Free Trial <ArrowRight size={18} />
            </button>
          ) : (
            <a
              href="https://tradejournall.com"
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 text-center"
            >
              Start Free Trial <ArrowRight size={18} />
            </a>
          )}
        </div>
      </div>


      {/* ----------------------------------------------------------------------- */}
      {/* EMBED CODE MODAL */}
      {/* ----------------------------------------------------------------------- */}
      {showEmbedModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Code className="text-emerald-400" size={20} />
                Embed Calculator Widget
              </h3>
              <button
                onClick={() => setShowEmbedModal(false)}
                className="text-slate-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Copy the HTML code snippet below to embed this real-time Leverage Danger Calculator on your blog or website.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Widget Theme</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setEmbedTheme('dark')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${embedTheme === 'dark' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  Dark Mode (Recommended)
                </button>
                <button
                  onClick={() => setEmbedTheme('light')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${embedTheme === 'light' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  Light Mode
                </button>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 break-all select-all">
              {generateEmbedCode()}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowEmbedModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Close
              </button>
              <button
                onClick={handleCopyEmbedCode}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1.5"
              >
                {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                {copiedCode ? 'Copied to Clipboard!' : 'Copy Embed Code'}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ----------------------------------------------------------------------- */}
      {/* SEO EDUCATIONAL ARTICLE & FAQ SECTION */}
      {/* ----------------------------------------------------------------------- */}
      <div className="mt-14 bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 sm:p-10 space-y-8 text-slate-300 leading-relaxed text-sm">
        <div className="border-b border-slate-700 pb-4">
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BookOpen className="text-emerald-400" size={24} />
            Understanding Crypto & Forex Futures Liquidation Dynamics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete guide on Maintenance Margin Rates (MMR), Isolated vs Cross Margin, and flash wick risk mitigation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="text-emerald-400" size={18} />
              1. Isolated vs Cross Margin Modes
            </h3>
            <p className="text-xs text-slate-300">
              <strong>Isolated Margin:</strong> Limits your max loss for a single trade strictly to the allocated initial margin. If the market wicks against you to the liquidation price, only that specific margin is lost, keeping the rest of your account equity safe.
            </p>
            <p className="text-xs text-slate-300">
              <strong>Cross Margin:</strong> Uses your entire available account balance to prevent liquidation. While it lowers the likelihood of getting liquidated on short wicks, a sudden catastrophic market crash can wipe out your entire account balance!
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="text-emerald-400" size={18} />
              2. Maintenance Margin Rate (MMR) Explained
            </h3>
            <p className="text-xs text-slate-300">
              The <strong>Maintenance Margin Rate (MMR)</strong> is the minimum percentage of collateral required by exchanges (such as Binance, Bybit, OKX, or Forex brokers) to keep a open leveraged position active.
            </p>
            <p className="text-xs text-slate-300">
              When unrealized position losses reduce margin below the MMR threshold, the exchange automatically triggers position liquidation before equity drops below zero.
            </p>
          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <div className="pt-6 border-t border-slate-700/60 space-y-4">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <HelpCircle className="text-emerald-400" size={20} />
            Frequently Asked Questions (FAQ)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 space-y-1">
              <h4 className="font-bold text-white">Why does liquidation happen before Bankruptcy Price?</h4>
              <p className="text-slate-400">
                Exchanges enforce Maintenance Margin (MMR) as a risk buffer to ensure positions can be closed safely in order books before negative account balance occurs.
              </p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 space-y-1">
              <h4 className="font-bold text-white">Can a Stop Loss prevent flash wick liquidation?</h4>
              <p className="text-slate-400">
                Only if your Stop Loss price is placed closer to entry than your Liquidation Price! If high leverage places your Liquidation Price before your Stop Loss, liquidation occurs first.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LeverageCalculatorScreen;
