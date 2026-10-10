import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Grid,
  Calculator,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Target,
  Percent,
  DollarSign,
  Layers,
  Activity,
  Sparkles,
  Share2,
  Copy,
  Check,
  Download,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  BookOpen,
  Info,
  Flame,
  Zap,
  BarChart3,
  Scale,
  Maximize2,
  Sliders,
  Table,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { formatNumber } from '../utils/helpers';

export interface RiskRewardMatrixCalculatorScreenProps {
  theme?: any;
  isDarkMode?: boolean;
  primaryCurrencySymbol?: string;
  onBackToLanding?: () => void;
  onSignIn?: () => void;
  onNavigateToTools?: (toolRoute: string) => void;
  onLogTrade?: (tradeData: { symbol: string; entryPrice: number; exitPrice: number; pnl: number; type: 'Long' | 'Short'; strategy?: string }) => void;
}

// Preset RRR rows for the 2D Heatmap Matrix (Reward multiple against 1 unit of risk)
export const MATRIX_RRR_PRESETS = [5.0, 4.0, 3.5, 3.0, 2.5, 2.0, 1.5, 1.0, 0.75, 0.5];

// Preset Win Rate columns (10% to 90% in 10% steps)
export const MATRIX_WIN_RATES = [10, 20, 30, 40, 50, 60, 70, 80, 90];

// Common capital presets
export const CAPITAL_PRESETS = [2000, 5000, 10000, 25000, 50000, 100000];

// Currency options
export const CURRENCY_OPTIONS = [
  { symbol: '$', code: 'USD', name: 'US Dollar' },
  { symbol: '€', code: 'EUR', name: 'Euro' },
  { symbol: '£', code: 'GBP', name: 'British Pound' },
  { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
  { symbol: 'A$', code: 'AUD', name: 'Australian Dollar' },
  { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar' },
];

export const RiskRewardMatrixCalculatorScreen: React.FC<RiskRewardMatrixCalculatorScreenProps> = ({
  theme,
  isDarkMode = true,
  primaryCurrencySymbol = '$',
  onBackToLanding,
  onSignIn,
  onNavigateToTools,
  onLogTrade
}) => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  // Dual-View Mode Switcher: 'matrix' (View 1) | 'calculator' (View 2)
  const [activeView, setActiveView] = useState<'matrix' | 'calculator'>('matrix');

  // Currency Selection
  const [currencySymbol, setCurrencySymbol] = useState<string>(primaryCurrencySymbol || '$');

  // --- VIEW 1 (HEATMAP MATRIX) CONTROLS ---
  // Cell display mode: 'simple_verdict' | 'expectancy_r' | 'expectancy_dollar' | 'net_pnl_100'
  const [cellDisplayMode, setCellDisplayMode] = useState<'simple_verdict' | 'expectancy_r' | 'expectancy_dollar' | 'net_pnl_100'>('simple_verdict');
  
  // Matrix Zone Highlight Filter: 'all' | 'profitable' | 'losing'
  const [matrixFilter, setMatrixFilter] = useState<'all' | 'profitable' | 'losing'>('all');

  // Toggle for 3-step beginner guide
  const [showGuide, setShowGuide] = useState<boolean>(true);

  // Active / Selected Cell in Matrix Inspector
  const [selectedCell, setSelectedCell] = useState<{ rrr: number; winRate: number } | null>({
    rrr: 2.0,
    winRate: 40
  });

  // --- VIEW 2 (CUSTOM STRATEGY CALCULATOR) INPUTS ---
  const [strategyWinRate, setStrategyWinRate] = useState<number>(45);
  const [strategyRrr, setStrategyRrr] = useState<number>(2.0);
  const [accountCapital, setAccountCapital] = useState<number>(10000);
  const [riskType, setRiskType] = useState<'percent' | 'fixed'>('percent');
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const [riskFixedAmount, setRiskFixedAmount] = useState<number>(100);
  const [sampleTrades, setSampleTrades] = useState<number>(100);

  // Interaction feedback states
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // ---------------------------------------------------------------------------
  // PARSE URL QUERY PARAMETERS ON MOUNT (FOR SOCIAL SHARING & BOOKMARKS)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const wrParam = searchParams.get('winrate') || searchParams.get('wr');
      const rrrParam = searchParams.get('rrr') || searchParams.get('rr');
      const capParam = searchParams.get('capital') || searchParams.get('cap');
      const riskParam = searchParams.get('risk');
      const tradesParam = searchParams.get('trades');
      const viewParam = searchParams.get('view');

      if (wrParam) {
        const parsedWr = parseFloat(wrParam);
        if (!isNaN(parsedWr) && parsedWr >= 0 && parsedWr <= 100) {
          setStrategyWinRate(parsedWr);
          if (selectedCell) setSelectedCell(prev => prev ? { ...prev, winRate: Math.round(parsedWr / 10) * 10 } : null);
        }
      }
      if (rrrParam) {
        const parsedRrr = parseFloat(rrrParam);
        if (!isNaN(parsedRrr) && parsedRrr > 0 && parsedRrr <= 20) {
          setStrategyRrr(parsedRrr);
          if (selectedCell) setSelectedCell(prev => prev ? { ...prev, rrr: parsedRrr } : null);
        }
      }
      if (capParam) {
        const parsedCap = parseFloat(capParam);
        if (!isNaN(parsedCap) && parsedCap > 0) setAccountCapital(parsedCap);
      }
      if (riskParam) {
        const parsedRisk = parseFloat(riskParam);
        if (!isNaN(parsedRisk) && parsedRisk > 0 && parsedRisk <= 50) setRiskPercent(parsedRisk);
      }
      if (tradesParam) {
        const parsedTrades = parseInt(tradesParam, 10);
        if (!isNaN(parsedTrades) && parsedTrades > 0) setSampleTrades(parsedTrades);
      }
      if (viewParam === 'calculator' || viewParam === 'calc') {
        setActiveView('calculator');
      } else if (viewParam === 'matrix') {
        setActiveView('matrix');
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  // Synchronize risk percent and fixed dollar amount whenever account capital or risk changes
  useEffect(() => {
    if (riskType === 'percent') {
      setRiskFixedAmount((accountCapital * riskPercent) / 100);
    }
  }, [accountCapital, riskPercent, riskType]);

  const handleRiskPercentChange = (pct: number) => {
    const clamped = Math.max(0.1, Math.min(25, pct));
    setRiskPercent(clamped);
    setRiskFixedAmount((accountCapital * clamped) / 100);
  };

  const handleRiskFixedChange = (amt: number) => {
    const clamped = Math.max(1, Math.min(accountCapital, amt));
    setRiskFixedAmount(clamped);
    if (accountCapital > 0) {
      setRiskPercent((clamped / accountCapital) * 100);
    }
  };

  // Reset tool to defaults
  const handleReset = () => {
    setStrategyWinRate(45);
    setStrategyRrr(2.0);
    setAccountCapital(10000);
    setRiskType('percent');
    setRiskPercent(1.0);
    setRiskFixedAmount(100);
    setSampleTrades(100);
    setSelectedCell({ rrr: 2.0, winRate: 40 });
    setCellDisplayMode('expectancy_r');
    setMatrixFilter('all');
  };

  // ---------------------------------------------------------------------------
  // MATHEMATICAL CALCULATION ENGINE
  // ---------------------------------------------------------------------------
  // Effective Risk Dollar Amount per trade
  const effectiveDollarRisk = useMemo(() => {
    return riskType === 'percent'
      ? (accountCapital * (riskPercent / 100))
      : riskFixedAmount;
  }, [accountCapital, riskType, riskPercent, riskFixedAmount]);

  // Core formula: Breakeven Win Rate (%) = (1 / (1 + Reward Multiple)) * 100
  const calculateBreakevenWinRate = (rewardMultiple: number): number => {
    if (rewardMultiple <= 0) return 100;
    return (1 / (1 + rewardMultiple)) * 100;
  };

  // Core formula: Expectancy (R-Multiple) = (WinRate% * Reward) - (LossRate% * Risk)
  const calculateExpectancyR = (winRatePct: number, rewardMultiple: number): number => {
    const winProb = winRatePct / 100;
    const lossProb = (100 - winRatePct) / 100;
    // Risk Multiple is normalized to 1 unit of risk
    return (winProb * rewardMultiple) - (lossProb * 1.0);
  };

  // View 2 Strategy Detailed Analytics
  const strategyAnalytics = useMemo(() => {
    const wr = Math.max(0, Math.min(100, strategyWinRate));
    const rrr = Math.max(0.1, strategyRrr);
    const trades = Math.max(1, sampleTrades);
    const dollarRisk = effectiveDollarRisk;

    // Mathematical calculations
    const breakevenWinRate = calculateBreakevenWinRate(rrr);
    const winRateEdge = wr - breakevenWinRate;
    const expectancyR = calculateExpectancyR(wr, rrr);
    const dollarExpectancyPerTrade = expectancyR * dollarRisk;
    const projectedNetPnl = dollarExpectancyPerTrade * trades;
    const projectedRoiPct = accountCapital > 0 ? (projectedNetPnl / accountCapital) * 100 : 0;
    const endingBalance = Math.max(0, accountCapital + projectedNetPnl);

    // Trade outcomes simulation breakdown
    const expectedWinsCount = (trades * wr) / 100;
    const expectedLossCount = trades - expectedWinsCount;
    const grossProfit = expectedWinsCount * (dollarRisk * rrr);
    const grossLoss = expectedLossCount * dollarRisk;
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 99.9 : 0;

    // Kelly Criterion calculation: Kelly % = W - ((1 - W) / RRR)
    const winProb = wr / 100;
    const lossProb = 1 - winProb;
    const fullKellyFraction = winProb - (lossProb / rrr);
    const halfKellyPct = Math.max(0, (fullKellyFraction / 2) * 100);

    // Strategy Status Classification
    let statusBadge: 'trap' | 'breakeven' | 'profitable' | 'elite' = 'breakeven';
    let statusLabel = 'Breakeven Edge';
    let statusDescription = 'Strategy sits right on the statistical razor edge. Slippage and brokerage fees will likely push this into net losses.';

    if (expectancyR < -0.05) {
      statusBadge = 'trap';
      statusLabel = 'Mathematical Trap';
      statusDescription = 'Negative expectancy strategy. Over a sufficient sample size, law of large numbers guarantees progressive account depletion.';
    } else if (expectancyR >= -0.05 && expectancyR <= 0.05) {
      statusBadge = 'breakeven';
      statusLabel = 'Breakeven Edge';
      statusDescription = 'Near-zero expectancy. Account equity will oscillate flat, with transaction costs and commissions creating net drag.';
    } else if (expectancyR > 0.05 && expectancyR < 0.50) {
      statusBadge = 'profitable';
      statusLabel = 'Positive Expectancy Edge';
      statusDescription = 'Robust positive edge. Mathematically sound foundation with favorable statistical drift over 100+ trade samples.';
    } else {
      statusBadge = 'elite';
      statusLabel = 'Elite High-Edge Strategy';
      statusDescription = 'Exceptional risk-adjusted profitability. Compounding returns accelerate rapidly if position risk is kept controlled.';
    }

    // Equity curve trajectory data points for SVG chart
    const curvePoints: { tradeNum: number; equity: number }[] = [];
    const step = Math.max(1, Math.floor(trades / 20));
    for (let i = 0; i <= trades; i += step) {
      const pnlAtStep = dollarExpectancyPerTrade * i;
      curvePoints.push({
        tradeNum: i,
        equity: Math.max(0, accountCapital + pnlAtStep)
      });
    }
    if (curvePoints[curvePoints.length - 1].tradeNum !== trades) {
      curvePoints.push({
        tradeNum: trades,
        equity: endingBalance
      });
    }

    return {
      breakevenWinRate,
      winRateEdge,
      expectancyR,
      dollarExpectancyPerTrade,
      projectedNetPnl,
      projectedRoiPct,
      endingBalance,
      expectedWinsCount,
      expectedLossCount,
      grossProfit,
      grossLoss,
      profitFactor,
      halfKellyPct,
      statusBadge,
      statusLabel,
      statusDescription,
      curvePoints
    };
  }, [strategyWinRate, strategyRrr, sampleTrades, effectiveDollarRisk, accountCapital]);

  // Selected Cell Metrics for Inspector Modal/Drawer
  const selectedCellMetrics = useMemo(() => {
    if (!selectedCell) return null;
    const { rrr, winRate } = selectedCell;
    const expectancyR = calculateExpectancyR(winRate, rrr);
    const breakevenWinRate = calculateBreakevenWinRate(rrr);
    const dollarExp = expectancyR * effectiveDollarRisk;
    const samplePnl = dollarExp * sampleTrades;
    const edgePct = winRate - breakevenWinRate;

    let status: 'trap' | 'breakeven' | 'profitable' | 'elite' = 'breakeven';
    if (expectancyR < -0.05) status = 'trap';
    else if (expectancyR <= 0.05) status = 'breakeven';
    else if (expectancyR < 0.50) status = 'profitable';
    else status = 'elite';

    // Intuitive 10-trade real-world breakdown simulation
    const winsIn10 = Math.round((winRate / 100) * 10);
    const lossesIn10 = 10 - winsIn10;
    const profitIn10 = winsIn10 * (effectiveDollarRisk * rrr);
    const lossIn10 = lossesIn10 * effectiveDollarRisk;
    const netPnlIn10 = profitIn10 - lossIn10;

    return {
      rrr,
      winRate,
      expectancyR,
      breakevenWinRate,
      dollarExp,
      samplePnl,
      edgePct,
      status,
      winsIn10,
      lossesIn10,
      profitIn10,
      lossIn10,
      netPnlIn10
    };
  }, [selectedCell, effectiveDollarRisk, sampleTrades]);

  // ---------------------------------------------------------------------------
  // COLOR SCALE UTILITIES FOR MATRIX CELLS
  // ---------------------------------------------------------------------------
  const getCellColorClass = (expectancyR: number): { bg: string; text: string; border: string; glow: string } => {
    if (expectancyR < -0.40) {
      // Deep Red - Severe Trap
      return {
        bg: 'bg-rose-950/80 hover:bg-rose-900',
        text: 'text-rose-300 font-bold',
        border: 'border-rose-900/60',
        glow: 'hover:shadow-rose-950/50'
      };
    }
    if (expectancyR < -0.05) {
      // Moderate Red - Negative Expectancy
      return {
        bg: 'bg-rose-900/30 hover:bg-rose-900/50',
        text: 'text-rose-400',
        border: 'border-rose-800/40',
        glow: 'hover:shadow-rose-900/30'
      };
    }
    if (expectancyR <= 0.05) {
      // Amber - Breakeven Zone
      return {
        bg: 'bg-amber-950/40 hover:bg-amber-900/50',
        text: 'text-amber-300 font-bold',
        border: 'border-amber-700/40',
        glow: 'hover:shadow-amber-900/30'
      };
    }
    if (expectancyR < 0.40) {
      // Soft Emerald - Profitable Edge
      return {
        bg: 'bg-emerald-950/40 hover:bg-emerald-900/50',
        text: 'text-emerald-400',
        border: 'border-emerald-800/40',
        glow: 'hover:shadow-emerald-900/30'
      };
    }
    if (expectancyR < 1.0) {
      // Bright Emerald - High Edge
      return {
        bg: 'bg-emerald-900/50 hover:bg-emerald-800/60',
        text: 'text-emerald-300 font-bold',
        border: 'border-emerald-700/50',
        glow: 'hover:shadow-emerald-800/40'
      };
    }
    // Electric Neon Green - Elite Edge
    return {
      bg: 'bg-emerald-600/30 hover:bg-emerald-500/40',
      text: 'text-emerald-200 font-black',
      border: 'border-emerald-500/60',
      glow: 'hover:shadow-emerald-500/40'
    };
  };

  // ---------------------------------------------------------------------------
  // SHARE & EXPORT CAPABILITIES
  // ---------------------------------------------------------------------------
  // Copy strategy summary to clipboard
  const handleCopySummary = () => {
    const text = `📊 Risk-Reward vs Win-Rate Expectancy Strategy
-----------------------------------------------
🎯 Strategy Win Rate: ${strategyWinRate}%
⚖️ Risk-to-Reward Ratio: 1:${strategyRrr.toFixed(1)}
🛑 Breakeven Win Rate Required: ${strategyAnalytics.breakevenWinRate.toFixed(2)}%
📈 Expectancy per Trade: ${strategyAnalytics.expectancyR >= 0 ? '+' : ''}${strategyAnalytics.expectancyR.toFixed(2)} R (${strategyAnalytics.dollarExpectancyPerTrade >= 0 ? '+' : ''}${currencySymbol}${formatNumber(strategyAnalytics.dollarExpectancyPerTrade, 2)})
💰 Projected Net P&L (${sampleTrades} trades): ${strategyAnalytics.projectedNetPnl >= 0 ? '+' : ''}${currencySymbol}${formatNumber(strategyAnalytics.projectedNetPnl, 2)} (${strategyAnalytics.projectedRoiPct.toFixed(1)}% ROI)
🛡️ Strategy Status: ${strategyAnalytics.statusLabel.toUpperCase()}
🔥 Verified via TradeJournal Expectancy Matrix: https://tradejournall.com/tools/risk-reward-win-rate-matrix?wr=${strategyWinRate}&rrr=${strategyRrr}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    });
  };

  // Copy shareable link with query parameters
  const handleCopyLink = () => {
    const url = `${window.location.origin}/tools/risk-reward-win-rate-matrix?wr=${strategyWinRate}&rrr=${strategyRrr}&risk=${riskPercent}&cap=${accountCapital}&trades=${sampleTrades}&view=${activeView}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    });
  };

  // High-Resolution Branded PNG Image Generation via HTML5 Canvas
  const handleDownloadBrandedImage = () => {
    setIsExportingImage(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 680;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsExportingImage(false);
      return;
    }

    // 1. Dark FinTech Dashboard Background
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 680);
    bgGrad.addColorStop(0, '#0F172A');
    bgGrad.addColorStop(1, '#0B0F19');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 680);

    // Subtle background glowing circles
    const radGrad = ctx.createRadialGradient(900, 150, 10, 900, 150, 450);
    radGrad.addColorStop(0, 'rgba(34, 197, 94, 0.08)');
    radGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 1200, 680);

    // 2. Top Header Bar
    ctx.fillStyle = '#22C55E';
    ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('TRADEJOURNAL', 60, 65);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('RISK-REWARD VS WIN-RATE EXPECTANCY MATRIX', 270, 65);

    // Date watermark
    ctx.fillStyle = '#64748B';
    ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Generated: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`, 1140, 65);
    ctx.textAlign = 'left';

    // Divider line
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 90);
    ctx.lineTo(1140, 90);
    ctx.stroke();

    // 3. Card 1: Key Strategy Snapshot
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.roundRect(60, 120, 500, 470, 16);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Strategy Status Banner
    const isTrap = strategyAnalytics.statusBadge === 'trap';
    const isBreakeven = strategyAnalytics.statusBadge === 'breakeven';
    const statusColor = isTrap ? '#EF4444' : isBreakeven ? '#F59E0B' : '#22C55E';

    ctx.fillStyle = isTrap ? 'rgba(239, 68, 68, 0.15)' : isBreakeven ? 'rgba(245, 158, 11, 0.15)' : 'rgba(34, 197, 94, 0.15)';
    ctx.beginPath();
    ctx.roundRect(85, 145, 450, 44, 10);
    ctx.fill();

    ctx.fillStyle = statusColor;
    ctx.font = '900 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`STATUS: ${strategyAnalytics.statusLabel.toUpperCase()}`, 105, 172);

    // Parameter Metrics in Card 1
    const drawMetric = (label: string, value: string, sub: string, yPos: number, valColor = '#F8FAFC') => {
      ctx.fillStyle = '#94A3B8';
      ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(label, 90, yPos);

      ctx.fillStyle = valColor;
      ctx.font = '900 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(value, 90, yPos + 30);

      ctx.fillStyle = '#64748B';
      ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(sub, 90, yPos + 50);
    };

    drawMetric(
      'STRATEGY WIN RATE vs BREAKEVEN HURDLE',
      `${strategyWinRate}%  (Breakeven: ${strategyAnalytics.breakevenWinRate.toFixed(1)}%)`,
      strategyAnalytics.winRateEdge >= 0 ? `+${strategyAnalytics.winRateEdge.toFixed(1)}% statistical safety margin` : `${strategyAnalytics.winRateEdge.toFixed(1)}% below required breakeven`,
      225,
      strategyAnalytics.winRateEdge >= 0 ? '#22C55E' : '#EF4444'
    );

    drawMetric(
      'EXPECTANCY PER TRADE',
      `${strategyAnalytics.expectancyR >= 0 ? '+' : ''}${strategyAnalytics.expectancyR.toFixed(2)} R  /  ${strategyAnalytics.dollarExpectancyPerTrade >= 0 ? '+' : ''}${currencySymbol}${formatNumber(strategyAnalytics.dollarExpectancyPerTrade, 2)}`,
      `Based on ${currencySymbol}${formatNumber(effectiveDollarRisk, 0)} risk per trade at 1:${strategyRrr.toFixed(1)} RRR`,
      325,
      statusColor
    );

    drawMetric(
      `PROJECTED NET P&L (${sampleTrades} SAMPLE TRADES)`,
      `${strategyAnalytics.projectedNetPnl >= 0 ? '+' : ''}${currencySymbol}${formatNumber(strategyAnalytics.projectedNetPnl, 2)}  (${strategyAnalytics.projectedRoiPct.toFixed(1)}% ROI)`,
      `Expected: ${strategyAnalytics.expectedWinsCount.toFixed(0)} Wins / ${strategyAnalytics.expectedLossCount.toFixed(0)} Losses`,
      425,
      strategyAnalytics.projectedNetPnl >= 0 ? '#22C55E' : '#EF4444'
    );

    // Kelly fraction note
    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`Half-Kelly Allocation Guide: ${strategyAnalytics.halfKellyPct.toFixed(1)}% of capital`, 90, 545);

    // 4. Card 2: Mini Heatmap Matrix Graphic
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.roundRect(590, 120, 550, 470, 16);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#F8FAFC';
    ctx.font = '800 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('2D EXPECTANCY MATRIX (R-MULTIPLES)', 620, 155);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Risk-to-Reward (Rows) vs Win Rate (Columns)', 620, 175);

    // Mini Matrix Grid Rendering
    const miniCols = [20, 30, 40, 50, 60, 70];
    const miniRows = [4.0, 3.0, 2.0, 1.5, 1.0, 0.5];
    const gridStartX = 675;
    const gridStartY = 215;
    const cellW = 72;
    const cellH = 46;

    // Draw Column Headers
    ctx.textAlign = 'center';
    ctx.font = '700 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#94A3B8';
    miniCols.forEach((colWr, cIdx) => {
      ctx.fillText(`${colWr}%`, gridStartX + (cIdx * cellW) + cellW / 2, gridStartY - 10);
    });

    // Draw Rows and Cells
    miniRows.forEach((rowRrr, rIdx) => {
      const y = gridStartY + (rIdx * cellH);
      // Row Label
      ctx.textAlign = 'right';
      ctx.fillStyle = '#94A3B8';
      ctx.font = '700 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`1:${rowRrr.toFixed(1)}`, gridStartX - 10, y + cellH / 2 + 4);

      // Cells
      miniCols.forEach((colWr, cIdx) => {
        const x = gridStartX + (cIdx * cellW);
        const expR = calculateExpectancyR(colWr, rowRrr);

        // Fill color based on expectancy
        let cellBg = '#1E293B';
        let cellText = '#F8FAFC';
        if (expR < -0.05) {
          cellBg = expR < -0.40 ? '#7F1D1D' : '#451A1A';
          cellText = '#FCA5A5';
        } else if (expR <= 0.05) {
          cellBg = '#452A12';
          cellText = '#FCD34D';
        } else {
          cellBg = expR > 0.8 ? '#047857' : '#064E3B';
          cellText = '#6EE7B7';
        }

        // Highlight active user setting if nearby
        const isCurrentPoint = Math.abs(strategyRrr - rowRrr) < 0.3 && Math.abs(strategyWinRate - colWr) < 6;

        ctx.fillStyle = cellBg;
        ctx.fillRect(x + 2, y + 2, cellW - 4, cellH - 4);

        if (isCurrentPoint) {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(x + 2, y + 2, cellW - 4, cellH - 4);
        } else {
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1;
          ctx.strokeRect(x + 2, y + 2, cellW - 4, cellH - 4);
        }

        // Text
        ctx.textAlign = 'center';
        ctx.font = '800 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillStyle = cellText;
        ctx.fillText(`${expR >= 0 ? '+' : ''}${expR.toFixed(2)}`, x + cellW / 2, y + cellH / 2 + 4);
      });
    });

    ctx.textAlign = 'left';

    // 5. Bottom Footer Branding
    ctx.fillStyle = '#64748B';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Explore the free interactive trading expectancy tool at tradejournall.com/tools/risk-reward-win-rate-matrix', 60, 630);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#22C55E';
    ctx.fillText('TradeJournal.com • Master Your Edge', 1140, 630);

    // Export to PNG download
    const imgUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = `TradeJournal-Expectancy-Matrix-RRR-1-${strategyRrr.toFixed(1)}-WR-${strategyWinRate}pct.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setIsExportingImage(false);
  };

  // Switch to custom calculator view with preset parameters from matrix cell
  const handleApplyMatrixCellToCalculator = (rrr: number, winRate: number) => {
    setStrategyRrr(rrr);
    setStrategyWinRate(winRate);
    setActiveView('calculator');
  };

  // ---------------------------------------------------------------------------
  // JSON-LD SCHEMA FOR RICH GOOGLE SNIPPETS
  // ---------------------------------------------------------------------------
  const schemaJson = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        'name': 'Interactive Risk-Reward vs Win-Rate Matrix & Expectancy Calculator',
        'url': 'https://tradejournall.com/tools/risk-reward-win-rate-matrix',
        'applicationCategory': 'FinanceApplication',
        'operatingSystem': 'All (Web Browser, iOS, Android)',
        'description': 'Free 2D interactive risk-reward vs win-rate heatmap matrix and trading expectancy calculator. Determine minimum win rates for 1:2 and 1:3 RRR, breakeven formulas, and projected sample P&L.',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        }
      },
      {
        '@type': 'FinancialProduct',
        'name': 'Trading Strategy Expectancy & Breakeven Calculator',
        'provider': {
          '@type': 'Organization',
          'name': 'TradeJournal',
          'url': 'https://tradejournall.com'
        },
        'description': 'Calculates the mathematical expectancy per trade in R-Multiples and cash value, alongside required breakeven win rate thresholds.'
      },
      {
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'What is the minimum win rate for a 1 to 2 risk reward ratio?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'The minimum breakeven win rate for a 1 to 2 risk-reward ratio is exactly 33.33%. Calculated via Breakeven Win Rate % = (1 / (1 + 2)) * 100 = 33.33%. Any win rate above 33.33% yields positive mathematical expectancy.'
            }
          },
          {
            '@type': 'Question',
            'name': 'How is trading expectancy calculated in R-multiples?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Expectancy (in R) is calculated using the formula: Expectancy = (Win Rate % * Reward Multiple) - (Loss Rate % * Risk Multiple). For instance, with a 40% win rate and 1:2 RRR, Expectancy = (0.40 * 2) - (0.60 * 1) = +0.20R per trade.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Can a trading strategy with a 40% win rate be profitable?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Yes, absolutely. A 40% win rate combined with a 1:2 risk-to-reward ratio produces +0.20R expectancy per trade. Over 100 trades risking $100 per trade, this generates an expected net profit of +$2,000, despite losing 60 out of 100 trades.'
            }
          },
          {
            '@type': 'Question',
            'name': 'What is a mathematical trap in trading?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'A mathematical trap occurs when a trader achieves a high win rate (e.g., 75%) but uses an inverted risk-reward ratio (e.g., 1:0.25). The resulting expectancy is negative: (0.75 * 0.25) - (0.25 * 1.0) = -0.0625R per trade. Occasional large losses inevitably wipe out frequent small gains.'
            }
          }
        ]
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
            'name': 'Risk-Reward vs Win-Rate Matrix',
            'item': 'https://tradejournall.com/tools/risk-reward-win-rate-matrix'
          }
        ]
      }
    ]
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 text-slate-100 font-sans">
      <Helmet>
        <title>Trading Expectancy Calculator & Risk Reward Matrix | TradeJournall</title>
        <meta
          name="description"
          content="Free Trading Expectancy Calculator & 2D Risk-Reward vs Win-Rate Heatmap Matrix. Calculate mathematical expectancy per trade, minimum win rate for 1:2 RRR, and breakeven win rate."
        />
        <meta
          name="keywords"
          content="trading expectancy calculator, expectancy calculator, trading expectancy matrix calculator, risk reward win rate matrix, breakeven win rate calculator, positive expectancy trading tool, tradejournall"
        />
        <link rel="canonical" href="https://tradejournall.com/tools/trading-expectancy-calculator" />
        <meta property="og:title" content="Trading Expectancy Calculator & Risk Reward Matrix" />
        <meta
          property="og:description"
          content="Free Trading Expectancy Calculator & 2D Heatmap Matrix. Calculate mathematical expectancy per trade and breakeven win rate."
        />
        <meta property="og:url" content="https://tradejournall.com/tools/trading-expectancy-calculator" />
        <script type="application/ld+json">{JSON.stringify(schemaJson)}</script>
      </Helmet>

      {/* --------------------------------------------------------------------- */}
      {/* TOP NAVIGATION & UTILITY BAR */}
      {/* --------------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-bold border border-slate-700 cursor-pointer"
              title="Return to TradeJournal Home"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back to Home</span>
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl shadow-lg shadow-emerald-500/20 text-white">
              <Grid size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Risk-Reward vs Win-Rate Matrix
                </h1>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-black px-2 py-0.5 rounded-full border border-emerald-500/30">
                  PRO EDGE
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Interactive 2D Heatmap &amp; Trading Expectancy Calculator
              </p>
            </div>
          </div>
        </div>

        {/* Currency Switcher & Global Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Currency Dropdown */}
          <div className="relative">
            <select
              value={currencySymbol}
              onChange={(e) => setCurrencySymbol(e.target.value)}
              className="bg-slate-800 hover:bg-slate-700/80 text-slate-200 text-xs font-bold py-2 px-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 transition cursor-pointer appearance-none pr-7"
            >
              {CURRENCY_OPTIONS.map((c) => (
                <option key={c.code} value={c.symbol}>
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>
            <span className="absolute right-2.5 top-2.5 pointer-events-none text-slate-400 text-xs">▼</span>
          </div>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-xl border border-slate-700 transition cursor-pointer"
            title="Reset to Defaults"
          >
            <RotateCcw size={16} />
          </button>

          {/* Share Link */}
          <button
            onClick={handleCopyLink}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="Copy Shareable Link"
          >
            {copiedUrl ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
            <span className="hidden md:inline">{copiedUrl ? 'Copied' : 'Share'}</span>
          </button>

          {/* Export PNG */}
          <button
            onClick={handleDownloadBrandedImage}
            disabled={isExportingImage}
            className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition flex items-center gap-1.5 text-xs font-black shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
            title="Download Branded PNG Matrix Snapshot"
          >
            <Download size={15} />
            <span className="hidden sm:inline">Export PNG</span>
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* DUAL-VIEW MODE SWITCHER (TABS) */}
      {/* --------------------------------------------------------------------- */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-1.5 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xl">
        <div className="grid grid-cols-2 gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveView('matrix')}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
              activeView === 'matrix'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Grid size={16} />
            <span>View 1: 2D Heatmap Matrix</span>
          </button>

          <button
            onClick={() => setActiveView('calculator')}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
              activeView === 'calculator'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Calculator size={16} />
            <span>View 2: Custom Expectancy Calculator</span>
          </button>
        </div>

        {/* Quick summary metric snippet in header */}
        <div className="hidden lg:flex items-center gap-4 px-3 text-xs text-slate-400 font-mono">
          <div>
            Active RRR: <span className="text-white font-bold">1:{strategyRrr.toFixed(1)}</span>
          </div>
          <div className="w-1 h-1 bg-slate-700 rounded-full" />
          <div>
            Breakeven Hurdle: <span className="text-emerald-400 font-bold">{strategyAnalytics.breakevenWinRate.toFixed(1)}%</span>
          </div>
          <div className="w-1 h-1 bg-slate-700 rounded-full" />
          <div>
            Expectancy:{' '}
            <span
              className={`font-bold ${
                strategyAnalytics.expectancyR > 0.05
                  ? 'text-emerald-400'
                  : strategyAnalytics.expectancyR < -0.05
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}
            >
              {strategyAnalytics.expectancyR >= 0 ? '+' : ''}{strategyAnalytics.expectancyR.toFixed(2)} R
            </span>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* VIEW 1: 2D INTERACTIVE HEATMAP MATRIX GRID */}
      {/* --------------------------------------------------------------------- */}
      {activeView === 'matrix' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* QUICK 10-SECOND EDGE CHECKER (TRADER-FRIENDLY VISUAL WIZARD) */}
          <div className="bg-gradient-to-br from-slate-900 via-[#1E293B] to-slate-900 border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 flex items-center gap-1 shadow-md">
                    <Sparkles size={13} /> 10-SECOND CHECKER
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    Will Your Trading Strategy Be Profitable?
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Just 2 inputs: Select your Win Rate and Target RRR to see if the mathematics work in your favor.
                </p>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-bold mr-1">Presets:</span>
                <button
                  onClick={() => {
                    setStrategyWinRate(40);
                    setStrategyRrr(2.0);
                    setSelectedCell({ rrr: 2.0, winRate: 40 });
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    strategyRrr === 2.0 && strategyWinRate === 40
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md'
                      : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  🎯 1:2 Day Trade (40% Win)
                </button>
                <button
                  onClick={() => {
                    setStrategyWinRate(55);
                    setStrategyRrr(1.0);
                    setSelectedCell({ rrr: 1.0, winRate: 50 });
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    strategyRrr === 1.0 && strategyWinRate === 55
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md'
                      : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  🏹 1:1 Scalper (55% Win)
                </button>
                <button
                  onClick={() => {
                    setStrategyWinRate(35);
                    setStrategyRrr(3.0);
                    setSelectedCell({ rrr: 3.0, winRate: 40 });
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    strategyRrr === 3.0 && strategyWinRate === 35
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md'
                      : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  🚀 1:3 Trend Rider (35% Win)
                </button>
                <button
                  onClick={() => {
                    setStrategyWinRate(60);
                    setStrategyRrr(0.5);
                    setSelectedCell({ rrr: 0.5, winRate: 60 });
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    strategyRrr === 0.5 && strategyWinRate === 60
                      ? 'bg-rose-500 text-white border-rose-400 font-black shadow-md'
                      : 'bg-rose-950/40 text-rose-300 border-rose-900/60 hover:bg-rose-900/50'
                  }`}
                >
                  ⚠️ 1:0.5 Retail Trap (60% Win)
                </button>
              </div>
            </div>

            {/* Two Friendly Sliders + Verdict Box Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Sliders Area (7 Cols) */}
              <div className="lg:col-span-7 space-y-4 bg-slate-950/60 rounded-2xl p-4 sm:p-5 border border-slate-800">
                {/* Input 1: Win Rate */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Target size={14} className="text-emerald-400" />
                      1. Win Rate: How often do you win out of 10 trades?
                    </span>
                    <span className="font-mono text-emerald-400 font-black text-sm bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                      {strategyWinRate}% ({Math.round(strategyWinRate / 10)} Wins, {10 - Math.round(strategyWinRate / 10)} Losses)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={strategyWinRate}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setStrategyWinRate(val);
                      setSelectedCell(prev => ({ rrr: prev ? prev.rrr : 2.0, winRate: Math.round(val / 10) * 10 }));
                    }}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>10% (1/10 Win)</span>
                    <span>33.3% (Breakeven at 1:2)</span>
                    <span>50% (50/50 Even)</span>
                    <span>70% (High Hit Rate)</span>
                    <span>90%</span>
                  </div>
                </div>

                {/* Input 2: Risk to Reward Ratio */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Scale size={14} className="text-blue-400" />
                      2. Target: How large is your profit target relative to stop loss?
                    </span>
                    <span className="font-mono text-blue-400 font-black text-sm bg-blue-500/10 px-2.5 py-0.5 rounded-lg border border-blue-500/20">
                      1 : {strategyRrr.toFixed(1)} ({currencySymbol}{formatNumber(strategyRrr * 100, 0)} profit per {currencySymbol}100 risk)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.5"
                    value={strategyRrr}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setStrategyRrr(val);
                      setSelectedCell(prev => ({ rrr: val, winRate: prev ? prev.winRate : 40 }));
                    }}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>1:0.5 (Small Target)</span>
                    <span>1:1 (Even 1:1)</span>
                    <span>1:2 (Standard)</span>
                    <span>1:3 (Large Target)</span>
                    <span>1:5</span>
                  </div>
                </div>
              </div>

              {/* Live Verdict Card (5 Cols) */}
              <div
                className={`lg:col-span-5 rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 shadow-xl ${
                  strategyAnalytics.statusBadge === 'trap'
                    ? 'bg-gradient-to-br from-rose-950/80 via-slate-900 to-slate-900 border-rose-500/40 text-rose-200'
                    : strategyAnalytics.statusBadge === 'breakeven'
                    ? 'bg-gradient-to-br from-amber-950/80 via-slate-900 to-slate-900 border-amber-500/40 text-amber-200'
                    : 'bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-900 border-emerald-500/40 text-emerald-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
                      Live Strategy Verdict
                    </span>
                    <span
                      className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        strategyAnalytics.statusBadge === 'trap'
                          ? 'bg-rose-500 text-white'
                          : strategyAnalytics.statusBadge === 'breakeven'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-emerald-500 text-slate-950'
                      }`}
                    >
                      {strategyAnalytics.statusBadge === 'trap' ? <XCircle size={13} /> : <CheckCircle2 size={13} />}
                      {strategyAnalytics.statusBadge === 'trap'
                        ? 'MATHEMATICAL TRAP'
                        : strategyAnalytics.statusBadge === 'breakeven'
                        ? 'BREAKEVEN'
                        : 'PROFITABLE EDGE'}
                    </span>
                  </div>

                  {/* Verdict Headline */}
                  <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                    {strategyAnalytics.statusBadge === 'trap' ? (
                      <span className="text-rose-400">⚠️ Mathematical Trap: Losing Strategy!</span>
                    ) : strategyAnalytics.statusBadge === 'breakeven' ? (
                      <span className="text-amber-400">⚖️ Breakeven Zone: Neutral Edge</span>
                    ) : (
                      <span className="text-emerald-400">🎉 Positive Edge: Profitable Strategy!</span>
                    )}
                  </h3>

                  {/* Plain Language Explanation */}
                  <p className="text-xs text-slate-300 leading-relaxed mt-2">
                    {strategyAnalytics.statusBadge === 'trap' ? (
                      <span>
                        At a 1:{strategyRrr.toFixed(1)} target, you require at least{' '}
                        <strong className="text-white font-mono">{strategyAnalytics.breakevenWinRate.toFixed(1)}%</strong> win rate to break even.
                        Your win rate is <strong className="text-rose-300">{strategyWinRate}%</strong>, meaning occasional large losses will wipe out frequent small gains over time.
                      </span>
                    ) : strategyAnalytics.statusBadge === 'breakeven' ? (
                      <span>
                        You are sitting right on the statistical razor edge. To break even, you need{' '}
                        <strong className="text-white font-mono">{strategyAnalytics.breakevenWinRate.toFixed(1)}%</strong> win rate.
                        Trading friction (commissions, slippage, and spread) will likely push this into net losses.
                      </span>
                    ) : (
                      <span>
                        At a 1:{strategyRrr.toFixed(1)} target, you only need a{' '}
                        <strong className="text-white font-mono">{strategyAnalytics.breakevenWinRate.toFixed(1)}%</strong> win rate to break even.
                        With your <strong className="text-emerald-300">{strategyWinRate}%</strong> win rate, you can{' '}
                        <strong>lose {10 - Math.round(strategyWinRate / 10)} out of 10 trades</strong> and still generate consistent net profit!
                      </span>
                    )}
                  </p>
                </div>

                {/* Quick 100-Trade P&L Highlight */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Projected After 100 Trades:</span>
                    <span
                      className={`font-black font-mono text-sm sm:text-base ${
                        strategyAnalytics.projectedNetPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {strategyAnalytics.projectedNetPnl >= 0 ? '+' : ''}
                      {currencySymbol}
                      {formatNumber(strategyAnalytics.projectedNetPnl, 0)} ({strategyAnalytics.projectedRoiPct.toFixed(1)}% ROI)
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const nearestR = MATRIX_RRR_PRESETS.reduce((prev, curr) =>
                        Math.abs(curr - strategyRrr) < Math.abs(prev - strategyRrr) ? curr : prev
                      );
                      const nearestWr = Math.min(90, Math.max(10, Math.round(strategyWinRate / 10) * 10));
                      setSelectedCell({ rrr: nearestR, winRate: nearestWr });
                      const el = document.getElementById('matrix-table-container');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect in Matrix</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3-STEP VISUAL GUIDE (COLLAPSIBLE) */}
          <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowGuide(!showGuide)}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-300 hover:text-white transition cursor-pointer"
              >
                <HelpCircle size={15} className="text-emerald-400" />
                <span>How to Read This Matrix? (Quick 10-Second Guide)</span>
                <span className="text-[10px] font-mono text-slate-500 font-normal">
                  {showGuide ? '[ Hide Guide ▲ ]' : '[ Show Guide ▼ ]'}
                </span>
              </button>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Simple 3-Step Visual Formula
              </span>
            </div>

            {showGuide && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-800/80 animate-in fade-in duration-200">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
                  <div className="font-bold text-white flex items-center gap-1.5 mb-1 text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-black inline-flex items-center justify-center text-[10px]">1</span>
                    Left Column: Risk-to-Reward (RRR)
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    1:2 means risking <strong>{currencySymbol}100</strong> to target <strong>{currencySymbol}200</strong> in profit. The larger your target, the lower the win rate needed to profit.
                  </p>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
                  <div className="font-bold text-white flex items-center gap-1.5 mb-1 text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-black inline-flex items-center justify-center text-[10px]">2</span>
                    Top Header: Win Rate (%)
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    A 40% win rate means winning <strong>only 4 out of 10 trades</strong>. You never need an unrealistic 80%–90% win rate to build wealth.
                  </p>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
                  <div className="font-bold text-white flex items-center gap-1.5 mb-1 text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 font-black inline-flex items-center justify-center text-[10px]">3</span>
                    Cell Color: The Mathematical Truth
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    <strong className="text-emerald-400">Green = Profitable Edge</strong> (Positive mathematical drift).{' '}
                    <strong className="text-rose-400">Red = Negative Trap</strong> (Account liquidation zone).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Matrix Top Controls & Filter Bar */}
          <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                <SlidersHorizontal size={14} className="text-emerald-400" />
                Grid Cell Output:
              </span>
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 flex-wrap">
                <button
                  onClick={() => setCellDisplayMode('simple_verdict')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    cellDisplayMode === 'simple_verdict'
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🟢 Simple (WIN / TRAP)
                </button>
                <button
                  onClick={() => setCellDisplayMode('expectancy_r')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    cellDisplayMode === 'expectancy_r'
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  R-Multiple (R)
                </button>
                <button
                  onClick={() => setCellDisplayMode('expectancy_dollar')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    cellDisplayMode === 'expectancy_dollar'
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Per Trade ({currencySymbol})
                </button>
                <button
                  onClick={() => setCellDisplayMode('net_pnl_100')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    cellDisplayMode === 'net_pnl_100'
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  100-Trade P&amp;L ({currencySymbol})
                </button>
              </div>
            </div>

            {/* Zone Filter & Legend */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Highlight:</span>
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setMatrixFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    matrixFilter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Zones
                </button>
                <button
                  onClick={() => setMatrixFilter('profitable')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    matrixFilter === 'profitable' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-emerald-400'
                  }`}
                >
                  Profitable Edge
                </button>
                <button
                  onClick={() => setMatrixFilter('losing')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    matrixFilter === 'losing' ? 'bg-rose-700 text-white' : 'text-slate-400 hover:text-rose-400'
                  }`}
                >
                  Losing Traps
                </button>
              </div>
            </div>
          </div>

          {/* Color Coding Legend Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3 px-4 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Info size={14} className="text-emerald-400" />
              <span className="font-semibold">Color Guide:</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-rose-950 border border-rose-900 flex-shrink-0" />
                <span className="text-slate-300 text-[11px]">Deep Loss Trap (&lt; -0.4R)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-rose-900/40 border border-rose-800 flex-shrink-0" />
                <span className="text-slate-300 text-[11px]">Negative Edge (&lt; -0.05R)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-amber-950/60 border border-amber-700 flex-shrink-0" />
                <span className="text-slate-300 text-[11px]">Breakeven (-0.05 to +0.05R)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-emerald-950/60 border border-emerald-800 flex-shrink-0" />
                <span className="text-slate-300 text-[11px]">Positive Edge (&gt; +0.05R)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-emerald-600/40 border border-emerald-500 flex-shrink-0" />
                <span className="text-emerald-300 font-bold text-[11px]">Elite High-Edge (&gt; +1.0R)</span>
              </div>
            </div>
          </div>

          {/* Interactive Heatmap Matrix Grid */}
          <div className="bg-[#1E293B] border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Grid size={18} className="text-emerald-400" />
                  Risk-to-Reward Ratio vs Win Rate Expectancy Grid
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any cell to inspect the mathematical breakdown or load it directly into the custom calculator.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                Risk Unit: {currencySymbol}{formatNumber(effectiveDollarRisk, 0)} per trade
              </span>
            </div>

            {/* Scrollable Container with sticky headers for mobile ergonomics */}
            <div id="matrix-table-container" className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
              <table className="w-full border-collapse min-w-[720px] select-none">
                <thead>
                  <tr>
                    {/* Top-Left Corner Header */}
                    <th className="sticky left-0 z-20 bg-[#1E293B] p-2.5 sm:p-3 text-left border-b border-r border-slate-800 w-24">
                      <div className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">RRR \ WR</div>
                    </th>
                    {/* Win Rate Column Headers */}
                    {MATRIX_WIN_RATES.map((wr) => {
                      const isSelectedCol = selectedCell?.winRate === wr;
                      return (
                        <th
                          key={wr}
                          className={`p-2.5 sm:p-3 text-center border-b border-slate-800 transition ${
                            isSelectedCol ? 'bg-emerald-950/40 text-emerald-300 font-black' : 'text-slate-400 font-bold'
                          }`}
                        >
                          <div className="text-xs sm:text-sm font-mono">{wr}%</div>
                          <div className="text-[9px] font-normal text-slate-500 uppercase tracking-tighter">Win Rate</div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs sm:text-sm">
                  {MATRIX_RRR_PRESETS.map((rrr) => {
                    const isSelectedRow = selectedCell?.rrr === rrr;
                    const reqBe = calculateBreakevenWinRate(rrr);

                    return (
                      <tr key={rrr} className="group hover:bg-slate-800/30 transition">
                        {/* Sticky Left Y-Axis Header: Risk-to-Reward Ratio */}
                        <td
                          className={`sticky left-0 z-10 p-2.5 sm:p-3 border-r border-slate-800 font-bold transition ${
                            isSelectedRow
                              ? 'bg-emerald-950/60 text-emerald-300 border-r-emerald-500'
                              : 'bg-[#1E293B] text-slate-300 group-hover:bg-slate-800/70'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs sm:text-sm">1:{rrr.toFixed(rrr % 1 === 0 ? 0 : 1)}</span>
                          </div>
                          <div className="text-[9px] text-slate-500 font-normal">BE: {reqBe.toFixed(0)}%</div>
                        </td>

                        {/* Interactive Matrix Cells */}
                        {MATRIX_WIN_RATES.map((wr) => {
                          const expR = calculateExpectancyR(wr, rrr);
                          const isProfitable = expR > 0.05;
                          const isLosing = expR < -0.05;

                          // Dim cell if filter is active
                          const isFilteredOut =
                            (matrixFilter === 'profitable' && !isProfitable) ||
                            (matrixFilter === 'losing' && !isLosing);

                          const isSelected = selectedCell?.rrr === rrr && selectedCell?.winRate === wr;
                          const color = getCellColorClass(expR);

                          // Determine cell display text based on mode
                          let cellContent = '';
                          let cellSubtext = '';
                          if (cellDisplayMode === 'simple_verdict') {
                            if (expR > 0.05) {
                              cellContent = 'WIN';
                              cellSubtext = `${expR >= 0 ? '+' : ''}${expR.toFixed(1)}R`;
                            } else if (expR < -0.05) {
                              cellContent = 'TRAP';
                              cellSubtext = `${expR.toFixed(1)}R`;
                            } else {
                              cellContent = 'EVEN';
                              cellSubtext = '0.0R';
                            }
                          } else if (cellDisplayMode === 'expectancy_r') {
                            cellContent = `${expR >= 0 ? '+' : ''}${expR.toFixed(2)}R`;
                          } else if (cellDisplayMode === 'expectancy_dollar') {
                            const dollarVal = expR * effectiveDollarRisk;
                            cellContent = `${dollarVal >= 0 ? '+' : ''}${currencySymbol}${formatNumber(dollarVal, 0)}`;
                          } else {
                            const pnl100 = expR * effectiveDollarRisk * 100;
                            cellContent = `${pnl100 >= 0 ? '+' : ''}${currencySymbol}${formatNumber(pnl100, 0)}`;
                          }

                          return (
                            <td
                              key={`${rrr}-${wr}`}
                              onClick={() => setSelectedCell({ rrr, winRate: wr })}
                              className={`p-2 sm:p-2.5 text-center border-slate-800/40 border cursor-pointer transition-all duration-150 relative ${color.bg} ${color.text} ${
                                isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 z-10 scale-[1.03] shadow-lg' : ''
                              } ${isFilteredOut ? 'opacity-20 saturate-50' : 'opacity-100'} ${color.glow}`}
                              title={`1:${rrr.toFixed(1)} RRR at ${wr}% Win Rate: Expectancy = ${expR >= 0 ? '+' : ''}${expR.toFixed(2)}R`}
                            >
                              <div className="font-black tracking-tight leading-tight">{cellContent}</div>
                              {cellSubtext && (
                                <div className="text-[9px] opacity-75 font-mono leading-none mt-0.5">{cellSubtext}</div>
                              )}
                              {/* Indicator dot on breakeven threshold */}
                              {Math.abs(expR) <= 0.05 && (
                                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Matrix Cell Inspector Card / Drawer */}
          {selectedCellMetrics && (
            <div className="bg-[#1E293B] border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left: Intersection Overview */}
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                      Inspecting Intersection:
                    </span>
                    <span className="text-xs font-black bg-slate-800 text-white px-2 py-0.5 rounded-lg border border-slate-700">
                      1:{selectedCellMetrics.rrr.toFixed(1)} RRR &bull; {selectedCellMetrics.winRate}% Win Rate
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        selectedCellMetrics.status === 'trap'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : selectedCellMetrics.status === 'breakeven'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {selectedCellMetrics.status === 'trap'
                        ? 'Mathematical Trap'
                        : selectedCellMetrics.status === 'breakeven'
                        ? 'Breakeven Zone'
                        : 'Profitable Edge'}
                    </span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-black text-white">
                    Expectancy:{' '}
                    <span
                      className={
                        selectedCellMetrics.expectancyR > 0.05
                          ? 'text-emerald-400'
                          : selectedCellMetrics.expectancyR < -0.05
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }
                    >
                      {selectedCellMetrics.expectancyR >= 0 ? '+' : ''}
                      {selectedCellMetrics.expectancyR.toFixed(2)} R per trade
                    </span>
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    At 1:{selectedCellMetrics.rrr.toFixed(1)} RRR, the required breakeven win rate is{' '}
                    <strong className="text-white font-mono">{selectedCellMetrics.breakevenWinRate.toFixed(2)}%</strong>.
                    With a {selectedCellMetrics.winRate}% win rate, your edge is{' '}
                    <strong
                      className={selectedCellMetrics.edgePct >= 0 ? 'text-emerald-400 font-mono' : 'text-rose-400 font-mono'}
                    >
                      {selectedCellMetrics.edgePct >= 0 ? '+' : ''}
                      {selectedCellMetrics.edgePct.toFixed(2)}%
                    </strong>{' '}
                    relative to the breakeven hurdle.
                  </p>

                  {/* 10 Trades Real-World Breakdown (Practical Example) */}
                  <div className="bg-slate-950/80 rounded-2xl p-3 sm:p-4 border border-slate-800 space-y-2 mt-3">
                    <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400 uppercase tracking-wide">
                      <Sparkles size={14} /> 10-Trade Real-World Simulation (Practical Example)
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Assuming you execute <strong>10 sample trades</strong> risking <strong>{currencySymbol}{formatNumber(effectiveDollarRisk, 0)}</strong> per trade:
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                      <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400">Wins ({selectedCellMetrics.winsIn10})</div>
                        <div className="text-emerald-400 font-bold font-mono">+{currencySymbol}{formatNumber(selectedCellMetrics.profitIn10, 0)}</div>
                      </div>
                      <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400">Losses ({selectedCellMetrics.lossesIn10})</div>
                        <div className="text-rose-400 font-bold font-mono">-{currencySymbol}{formatNumber(selectedCellMetrics.lossIn10, 0)}</div>
                      </div>
                      <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400">Net Outcome</div>
                        <div className={`font-black font-mono ${selectedCellMetrics.netPnlIn10 >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {selectedCellMetrics.netPnlIn10 >= 0 ? '+' : ''}{currencySymbol}{formatNumber(selectedCellMetrics.netPnlIn10, 0)}
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 italic">
                      {selectedCellMetrics.netPnlIn10 >= 0
                        ? `💡 Key Takeaway: Despite losing ${selectedCellMetrics.lossesIn10} out of 10 trades, you still generate a net profit of +${currencySymbol}${formatNumber(selectedCellMetrics.netPnlIn10, 0)}!`
                        : `⚠️ Warning: Due to low target payoff or insufficient win rate, 10 trades produce a net loss of -${currencySymbol}${formatNumber(Math.abs(selectedCellMetrics.netPnlIn10), 0)}.`}
                    </p>
                  </div>
                </div>

                {/* Center / Right: Quick Metrics & Action CTA */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 px-4 min-w-[140px]">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Cash Expectancy</div>
                    <div
                      className={`text-base font-black font-mono mt-0.5 ${
                        selectedCellMetrics.dollarExp >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {selectedCellMetrics.dollarExp >= 0 ? '+' : ''}
                      {currencySymbol}
                      {formatNumber(selectedCellMetrics.dollarExp, 2)}
                    </div>
                    <div className="text-[9px] text-slate-500">per trade</div>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 px-4 min-w-[150px]">
                    <div className="text-[10px] uppercase font-bold text-slate-400">100-Trade Net P&amp;L</div>
                    <div
                      className={`text-base font-black font-mono mt-0.5 ${
                        selectedCellMetrics.samplePnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {selectedCellMetrics.samplePnl >= 0 ? '+' : ''}
                      {currencySymbol}
                      {formatNumber(selectedCellMetrics.samplePnl, 0)}
                    </div>
                    <div className="text-[9px] text-slate-500">at current risk size</div>
                  </div>

                  <button
                    onClick={() => handleApplyMatrixCellToCalculator(selectedCellMetrics.rrr, selectedCellMetrics.winRate)}
                    className="px-5 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-500/25 transition active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Simulate in Calculator</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* VIEW 2: CUSTOM STRATEGY EXPECTANCY CALCULATOR */}
      {/* --------------------------------------------------------------------- */}
      {activeView === 'calculator' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: INTERACTIVE SLIDERS & INPUTS (7 cols on desktop) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-[#1E293B] border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sliders size={18} className="text-emerald-400" />
                    <h3 className="text-base font-black text-white">Custom Strategy Parameters</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Fine-Tune Exact Edge</span>
                </div>

                {/* 1. Strategy Win Rate Slider */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-1.5">
                      <Target size={15} className="text-emerald-400" />
                      Historical / Strategy Win Rate (%)
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setStrategyWinRate((prev) => Math.max(0, prev - 1))}
                        className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-black cursor-pointer"
                      >
                        -1
                      </button>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.5"
                          value={strategyWinRate}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setStrategyWinRate(isNaN(val) ? 0 : Math.min(100, Math.max(0, val)));
                          }}
                          className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-right text-sm font-black font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                        />
                        <span className="absolute right-6 top-1 text-slate-500 text-xs pointer-events-none">%</span>
                      </div>
                      <button
                        onClick={() => setStrategyWinRate((prev) => Math.min(100, prev + 1))}
                        className="w-7 h-7 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-black cursor-pointer"
                      >
                        +1
                      </button>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="99"
                    step="0.5"
                    value={strategyWinRate}
                    onChange={(e) => setStrategyWinRate(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />

                  {/* Quick Win Rate Presets */}
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                    {[25, 33.3, 40, 50, 60, 75].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setStrategyWinRate(preset)}
                        className={`px-2 py-0.5 rounded-md hover:bg-slate-800 transition font-mono ${
                          strategyWinRate === preset ? 'bg-emerald-500/20 text-emerald-300 font-bold' : ''
                        }`}
                      >
                        {preset}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Risk-to-Reward Ratio (RRR) Slider & Presets */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-1.5">
                      <Scale size={15} className="text-blue-400" />
                      Risk-to-Reward Ratio (1 : Reward)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono text-slate-400">1 :</span>
                      <input
                        type="number"
                        min="0.2"
                        max="10.0"
                        step="0.1"
                        value={strategyRrr}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setStrategyRrr(isNaN(val) ? 1.0 : Math.min(15, Math.max(0.1, val)));
                        }}
                        className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-center text-sm font-black font-mono text-blue-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0.5"
                    max="6.0"
                    step="0.1"
                    value={strategyRrr}
                    onChange={(e) => setStrategyRrr(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />

                  {/* Preset RRR Buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      { label: '1:1', val: 1.0 },
                      { label: '1:1.5', val: 1.5 },
                      { label: '1:2', val: 2.0 },
                      { label: '1:2.5', val: 2.5 },
                      { label: '1:3', val: 3.0 },
                      { label: '1:4', val: 4.0 },
                      { label: '1:5', val: 5.0 },
                    ].map((p) => (
                      <button
                        key={p.label}
                        onClick={() => setStrategyRrr(p.val)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                          Math.abs(strategyRrr - p.val) < 0.05
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                            : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Account Capital */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-1.5">
                      <DollarSign size={15} className="text-emerald-400" />
                      Account Trading Capital ({currencySymbol})
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono text-slate-400">{currencySymbol}</span>
                      <input
                        type="number"
                        min="100"
                        step="500"
                        value={accountCapital}
                        onChange={(e) => setAccountCapital(Math.max(1, parseFloat(e.target.value) || 0))}
                        className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-right text-sm font-black font-mono text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Capital quick presets */}
                  <div className="flex flex-wrap gap-2">
                    {CAPITAL_PRESETS.map((cap) => (
                      <button
                        key={cap}
                        onClick={() => setAccountCapital(cap)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                          accountCapital === cap
                            ? 'bg-slate-700 text-white font-bold border border-slate-600'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {currencySymbol}{cap >= 1000 ? `${cap / 1000}k` : cap}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Risk Per Trade (% or Fixed Amount) */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-1.5">
                      <ShieldAlert size={15} className="text-amber-400" />
                      Risk Per Trade
                    </label>

                    {/* Mode Selector */}
                    <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
                      <button
                        onClick={() => setRiskType('percent')}
                        className={`px-2 py-1 rounded-md font-bold transition cursor-pointer ${
                          riskType === 'percent' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        % Account
                      </button>
                      <button
                        onClick={() => setRiskType('fixed')}
                        className={`px-2 py-1 rounded-md font-bold transition cursor-pointer ${
                          riskType === 'fixed' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Fixed {currencySymbol}
                      </button>
                    </div>
                  </div>

                  {riskType === 'percent' ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Risk Percentage</span>
                        <span className="font-mono text-amber-400 font-bold">
                          {riskPercent}% ({currencySymbol}{formatNumber(effectiveDollarRisk, 0)})
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.25"
                        max="5.0"
                        step="0.25"
                        value={riskPercent}
                        onChange={(e) => handleRiskPercentChange(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        {[0.5, 1.0, 1.5, 2.0, 3.0].map((p) => (
                          <button
                            key={p}
                            onClick={() => handleRiskPercentChange(p)}
                            className="hover:text-amber-400"
                          >
                            {p}%
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">{currencySymbol}</span>
                      <input
                        type="number"
                        min="1"
                        value={riskFixedAmount}
                        onChange={(e) => handleRiskFixedChange(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                        placeholder="Risk amount"
                      />
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        ({((riskFixedAmount / accountCapital) * 100).toFixed(1)}% of capital)
                      </span>
                    </div>
                  )}
                </div>

                {/* 5. Total Sample Trades Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-slate-300 flex items-center gap-1.5">
                      <Activity size={15} className="text-purple-400" />
                      Backtest / Sample Trades Count
                    </label>
                    <span className="font-mono text-purple-400 font-bold text-sm">
                      {sampleTrades} trades
                    </span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={sampleTrades}
                    onChange={(e) => setSampleTrades(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />

                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    {[50, 100, 200, 300, 500].map((t) => (
                      <button
                        key={t}
                        onClick={() => setSampleTrades(t)}
                        className="hover:text-purple-400"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: DYNAMIC REAL-TIME OUTPUTS & CHARTS (5 cols on desktop) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Output Card 1: Strategy Status & Expectancy Badge */}
              <div
                className={`border rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden transition-all duration-300 ${
                  strategyAnalytics.statusBadge === 'trap'
                    ? 'bg-gradient-to-br from-rose-950/70 via-slate-900 to-slate-900 border-rose-500/40'
                    : strategyAnalytics.statusBadge === 'breakeven'
                    ? 'bg-gradient-to-br from-amber-950/70 via-slate-900 to-slate-900 border-amber-500/40'
                    : 'bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900 border-emerald-500/40'
                }`}
              >
                {/* Header Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Calculated Edge Verdict
                  </span>
                  <span
                    className={`text-xs font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg ${
                      strategyAnalytics.statusBadge === 'trap'
                        ? 'bg-rose-500 text-white shadow-rose-500/30'
                        : strategyAnalytics.statusBadge === 'breakeven'
                        ? 'bg-amber-500 text-slate-950 shadow-amber-500/30'
                        : 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                    }`}
                  >
                    {strategyAnalytics.statusBadge === 'trap' ? (
                      <AlertTriangle size={13} />
                    ) : (
                      <CheckCircle2 size={13} />
                    )}
                    {strategyAnalytics.statusLabel}
                  </span>
                </div>

                {/* Primary Expectancy Display */}
                <div className="space-y-1 mb-4">
                  <div className="text-xs text-slate-400">Expectancy Per Trade:</div>
                  <div className="flex items-baseline gap-3">
                    <span
                      className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${
                        strategyAnalytics.expectancyR > 0.05
                          ? 'text-emerald-400'
                          : strategyAnalytics.expectancyR < -0.05
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {strategyAnalytics.expectancyR >= 0 ? '+' : ''}
                      {strategyAnalytics.expectancyR.toFixed(2)} R
                    </span>
                    <span
                      className={`text-lg font-bold font-mono ${
                        strategyAnalytics.dollarExpectancyPerTrade >= 0 ? 'text-emerald-300' : 'text-rose-300'
                      }`}
                    >
                      ({strategyAnalytics.dollarExpectancyPerTrade >= 0 ? '+' : ''}
                      {currencySymbol}
                      {formatNumber(strategyAnalytics.dollarExpectancyPerTrade, 2)})
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pt-1">
                    {strategyAnalytics.statusDescription}
                  </p>
                </div>

                {/* Breakeven Hurdle Progress Bar */}
                <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-2 mb-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold">Breakeven Win Rate Required:</span>
                    <span className="text-white font-mono font-black">
                      {strategyAnalytics.breakevenWinRate.toFixed(2)}%
                    </span>
                  </div>

                  {/* Visual Win Rate vs Breakeven Bar */}
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden relative">
                    {/* Breakeven Marker Indicator */}
                    <div
                      style={{ left: `${strategyAnalytics.breakevenWinRate}%` }}
                      className="absolute top-0 bottom-0 w-1 bg-white z-10 shadow-sm"
                      title={`Breakeven mark: ${strategyAnalytics.breakevenWinRate.toFixed(1)}%`}
                    />
                    {/* Actual Win Rate Bar */}
                    <div
                      style={{ width: `${Math.min(100, strategyWinRate)}%` }}
                      className={`h-full transition-all duration-300 ${
                        strategyWinRate >= strategyAnalytics.breakevenWinRate ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-500">Your Win Rate: {strategyWinRate}%</span>
                    <span
                      className={
                        strategyAnalytics.winRateEdge >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'
                      }
                    >
                      {strategyAnalytics.winRateEdge >= 0 ? '+' : ''}
                      {strategyAnalytics.winRateEdge.toFixed(1)}% {strategyAnalytics.winRateEdge >= 0 ? 'Safety Margin' : 'Deficit'}
                    </span>
                  </div>
                </div>

                {/* Projected Sample Outcome Card */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      Net P&amp;L ({sampleTrades} Trades)
                    </div>
                    <div
                      className={`text-lg font-black font-mono mt-1 ${
                        strategyAnalytics.projectedNetPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {strategyAnalytics.projectedNetPnl >= 0 ? '+' : ''}
                      {currencySymbol}
                      {formatNumber(strategyAnalytics.projectedNetPnl, 2)}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {strategyAnalytics.projectedRoiPct >= 0 ? '+' : ''}
                      {strategyAnalytics.projectedRoiPct.toFixed(1)}% ROI
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Profit Factor</div>
                    <div className="text-lg font-black font-mono text-white mt-1">
                      {strategyAnalytics.profitFactor.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {strategyAnalytics.expectedWinsCount.toFixed(0)}W / {strategyAnalytics.expectedLossCount.toFixed(0)}L
                    </div>
                  </div>
                </div>
              </div>

              {/* Output Card 2: Expected Cumulative Trajectory Curve (SVG) */}
              <div className="bg-[#1E293B] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <BarChart3 size={15} className="text-emerald-400" />
                    Simulated Equity Trajectory ({sampleTrades} Trades)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    End: {currencySymbol}{formatNumber(strategyAnalytics.endingBalance, 0)}
                  </span>
                </div>

                <div className="h-44 w-full bg-slate-900/90 rounded-2xl p-3 border border-slate-800/80 flex flex-col justify-between relative overflow-hidden">
                  {/* SVG Chart */}
                  <svg className="w-full h-32 overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor={strategyAnalytics.expectancyR >= 0 ? '#22C55E' : '#EF4444'}
                          stopOpacity="0.3"
                        />
                        <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Breakeven Baseline */}
                    <line
                      x1="0"
                      y1="60"
                      x2="400"
                      y2="60"
                      stroke="#475569"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />

                    {/* Dynamic Path Calculation */}
                    {(() => {
                      const pts = strategyAnalytics.curvePoints;
                      if (!pts.length) return null;
                      const minEq = Math.min(...pts.map((p) => p.equity), accountCapital * 0.7);
                      const maxEq = Math.max(...pts.map((p) => p.equity), accountCapital * 1.3);
                      const range = maxEq - minEq || 1;

                      const pathD = pts
                        .map((p, idx) => {
                          const x = (idx / (pts.length - 1)) * 400;
                          const y = 110 - ((p.equity - minEq) / range) * 100;
                          return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
                        })
                        .join(' ');

                      const areaD = `${pathD} L 400,120 L 0,120 Z`;

                      return (
                        <>
                          <path d={areaD} fill="url(#equityGrad)" />
                          <path
                            d={pathD}
                            fill="none"
                            stroke={strategyAnalytics.expectancyR >= 0 ? '#22C55E' : '#EF4444'}
                            strokeWidth="2.5"
                          />
                        </>
                      );
                    })()}
                  </svg>

                  {/* Axis Legend */}
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800/80 pt-1">
                    <span>Trade 0: {currencySymbol}{formatNumber(accountCapital, 0)}</span>
                    <span>Trade {Math.round(sampleTrades / 2)}</span>
                    <span
                      className={`font-bold ${
                        strategyAnalytics.endingBalance >= accountCapital ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      Trade {sampleTrades}: {currencySymbol}{formatNumber(strategyAnalytics.endingBalance, 0)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
                  <span>Gross Profits: <strong className="text-emerald-400 font-mono">+{currencySymbol}{formatNumber(strategyAnalytics.grossProfit, 0)}</strong></span>
                  <span>Gross Losses: <strong className="text-rose-400 font-mono">-{currencySymbol}{formatNumber(strategyAnalytics.grossLoss, 0)}</strong></span>
                </div>
              </div>

              {/* Action Buttons: Copy & Export */}
              <div className="flex gap-2">
                <button
                  onClick={handleCopySummary}
                  className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-2xl border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedSummary ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                  <span>{copiedSummary ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
                </button>

                <button
                  onClick={handleDownloadBrandedImage}
                  className="flex-1 py-3 px-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-black text-xs rounded-2xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download size={15} />
                  <span>Download Card</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* QUICK COMPARISON BREAKEVEN LOOKUP TABLE */}
      {/* --------------------------------------------------------------------- */}
      <div className="mt-10 bg-[#1E293B] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Table size={20} className="text-emerald-400" />
              Risk-to-Reward Ratio vs Minimum Breakeven Win Rate Lookup Table
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Standard reference guide for day traders, swing traders, and funded prop firm accounts.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
            Formula: (1 / (1 + Reward)) &times; 100
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { rrr: '1:0.5', rew: 0.5, be: '66.67%', desc: 'Scalpers' },
            { rrr: '1:1.0', rew: 1.0, be: '50.00%', desc: 'Symmetrical' },
            { rrr: '1:1.5', rew: 1.5, be: '40.00%', desc: 'Day Trading' },
            { rrr: '1:2.0', rew: 2.0, be: '33.33%', desc: 'Standard Edge' },
            { rrr: '1:3.0', rew: 3.0, be: '25.00%', desc: 'Trend Following' },
            { rrr: '1:5.0', rew: 5.0, be: '16.67%', desc: 'Momentum Breakout' },
          ].map((item) => (
            <div
              key={item.rrr}
              onClick={() => {
                setStrategyRrr(item.rew);
                setActiveView('calculator');
              }}
              className="bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-2xl transition cursor-pointer group"
            >
              <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                <span>{item.rrr}</span>
                <span className="text-[10px] text-slate-500">{item.desc}</span>
              </div>
              <div className="text-lg font-black font-mono text-emerald-400 mt-1.5 group-hover:scale-105 transition-transform">
                {item.be}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Min Win Rate</div>
            </div>
          ))}
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* CONVERSION CALL-TO-ACTION (CTA) FOOTER BANNER */}
      {/* --------------------------------------------------------------------- */}
      <div className="mt-10 relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Zap size={14} /> Mathematical Execution Verification
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Is your trading strategy mathematically sound? Log your real execution, track win rate, and verify your edge automatically with TradeJournal.
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Stop guessing if your losses are bad luck or negative expectancy. Connect your exchange or broker, track real risk-to-reward ratios, and eliminate mathematical traps permanently.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => {
                if (onSignIn) onSignIn();
                else if (onBackToLanding) onBackToLanding();
              }}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/25 transition active:scale-95 flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              Start Free Trial <ArrowRight size={16} />
            </button>
            <button
              onClick={handleCopySummary}
              className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-2xl border border-slate-700 transition active:scale-95 cursor-pointer whitespace-nowrap"
            >
              Copy Strategy Data
            </button>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* SEO MASTER EDUCATIONAL GUIDE & LONG-TAIL KEYWORD SECTIONS */}
      {/* --------------------------------------------------------------------- */}
      <div className="mt-10 space-y-8 bg-[#1E293B]/70 border border-slate-800 rounded-3xl p-6 sm:p-10 text-slate-300 leading-relaxed shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <BookOpen size={16} /> Educational Trading Manual
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            The Mathematical Mechanics of Risk Reward vs Win Rate Matrix in Trading
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Why 90% of retail traders fail by chasing high win rates while ignoring expectancy mathematics, and how to use our <strong>risk reward vs win rate matrix tool</strong> to establish a verifiable edge.
          </p>
        </div>

        {/* Section 1: Minimum Win Rate for 1 to 2 RRR */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Percent size={18} className="text-emerald-400" />
            1. Minimum Win Rate for 1 to 2 Risk Reward Ratio Explained
          </h3>
          <p className="text-sm">
            One of the most frequently asked questions by active day traders and prop firm applicants is: <em>what is the minimum win rate for a 1 to 2 risk reward ratio?</em>
          </p>
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-300">
            Breakeven Win Rate (%) = (1 / (1 + Reward Multiple)) &times; 100
            <br />
            For 1:2 RRR: Breakeven Win Rate = (1 / (1 + 2)) &times; 100 = 33.33%
          </div>
          <p className="text-sm">
            This means that if you risk $100 to make $200, you only need to be right <strong>34 out of 100 times</strong> to make a net profit. Even after losing 66 trades, a 34% win rate produces positive expectancy. Understanding this fundamentally relieves psychological pressure, allowing traders to execute setups without hesitation or fear of being wrong.
          </p>
        </div>

        {/* Section 2: Mathematical Expectancy Formula */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calculator size={18} className="text-blue-400" />
            2. Trading Expectancy Matrix Calculator: The Core Equation
          </h3>
          <p className="text-sm">
            Win rate alone has zero statistical meaning without its corresponding payoff ratio. The true heartbeat of every profitable trader is <strong>mathematical expectancy</strong>:
          </p>
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-blue-300">
            Expectancy (R-Multiple) = (Win Rate % &times; Reward) - (Loss Rate % &times; Risk)
          </div>
          <p className="text-sm">
            Where <code>Risk = 1.0</code> and <code>Loss Rate % = 100 - Win Rate %</code>.
            If your expectancy is positive (e.g., <strong>+0.25R per trade</strong>), you possess a <strong>positive expectancy trading strategy tool</strong>. Over a large sample size of 100, 500, or 1,000 trades, your equity curve will mathematically trend upwards, regardless of temporary losing streaks.
          </p>
        </div>

        {/* Section 3: The 90% Win Rate Fallacy (Mathematical Trap) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
              <Flame size={16} className="text-rose-400" />
              The 90% Win Rate Fallacy (Losing Trap)
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Many scam signal groups advertise a 90% win rate. However, they achieve this by risking $500 to make $25 (1:0.05 RRR). A single black swan loss destroys months of small gains. In our <strong>risk reward ratio heatmap chart</strong>, this is immediately exposed as a dark red mathematical trap with negative expectancy.
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-400" />
              The Trend-Follower&apos;s Secret (Low WR, Massive Edge)
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Legendary trend followers and breakout swing traders frequently operate with a 30% to 35% win rate. By cutting losers ruthlessly at 1R and allowing mega-trends to reach 1:4 or 1:6 RRR, their net expectancy is vastly superior to scalpers who panic-sell winners at 1:0.5.
            </p>
          </div>
        </div>

        {/* Section 4: Breakeven Win Rate Calculator for Traders */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity size={18} className="text-purple-400" />
            3. Interactive Trading Win Rate Matrix: Practical Implementation
          </h3>
          <p className="text-sm">
            To use this <strong>breakeven win rate calculator for traders</strong> in your daily workflow:
          </p>
          <ol className="list-decimal pl-5 text-sm space-y-2 text-slate-300">
            <li>
              <strong>Audit your last 50 trades in TradeJournal:</strong> Note your real average win rate and average win-to-loss dollar ratio.
            </li>
            <li>
              <strong>Find your coordinates in the 2D Heatmap:</strong> Cross-reference your RRR row and Win Rate column.
            </li>
            <li>
              <strong>Eliminate negative zones:</strong> If you find yourself in the red zone, adjust either your target selection (increase reward multiple) or entry criteria (raise win rate quality) until your strategy sits securely in the green positive expectancy zone.
            </li>
          </ol>
        </div>

        {/* FAQ ACCORDION SECTION */}
        <div className="pt-6 border-t border-slate-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <HelpCircle size={18} className="text-emerald-400" />
            Frequently Asked Questions (Risk-Reward &amp; Expectancy FAQs)
          </h3>
          <div className="space-y-3">
            {[
              {
                q: 'What is the minimum win rate for a 1 to 2 risk reward ratio?',
                a: 'The minimum breakeven win rate for a 1 to 2 risk-reward ratio is exactly 33.33%. You can calculate this using the formula: Breakeven Win Rate % = (1 / (1 + Reward Multiple)) * 100. Any win rate above 33.33% yields positive mathematical expectancy.'
              },
              {
                q: 'How does the risk reward vs win rate matrix tool help me?',
                a: 'The interactive 2D matrix visualizes every possible combination of risk-to-reward ratio and win rate percentage in a color-coded heatmap. It instantly reveals whether your current strategy parameters produce positive expectancy, breakeven drift, or a hidden mathematical trap.'
              },
              {
                q: 'What is mathematical expectancy in trading and how is it measured?',
                a: 'Expectancy is the average amount a trader can expect to win or lose per dollar (or R-Multiple) risked across all trades. If your expectancy is +0.25R, you earn an average of $0.25 in pure profit for every $1.00 you risk over time.'
              },
              {
                q: 'Why does a 50% win rate lose money with a 1:0.8 risk reward ratio?',
                a: 'At 1:0.8 RRR with a 50% win rate, your expectancy is (0.50 * 0.8) - (0.50 * 1.0) = 0.40 - 0.50 = -0.10R per trade. You lose 10 cents for every dollar risked, ensuring your account bleeds over time even though you win half your trades.'
              },
              {
                q: 'How do commissions, slippage, and spread affect breakeven win rates?',
                a: 'Commissions and slippage increase your friction cost. If your theoretical breakeven win rate is 33.33% for 1:2 RRR, real-world execution friction typically requires a 35%–36% win rate to overcome trading fees and broker spreads.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex justify-between items-center text-sm font-bold text-white hover:text-emerald-400 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-slate-500 font-mono text-base">{activeFaq === idx ? '−' : '+'}</span>
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskRewardMatrixCalculatorScreen;
