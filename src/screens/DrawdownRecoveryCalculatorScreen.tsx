import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
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
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import { formatNumber } from '../utils/helpers';

interface DrawdownRecoveryCalculatorScreenProps {
  theme?: any;
  isDarkMode?: boolean;
  primaryCurrencySymbol?: string;
  onBackToLanding?: () => void;
  onSignIn?: () => void;
  onNavigateToTools?: (toolRoute: string) => void;
}

// Preset options
export const LOSS_PRESETS = [10, 20, 30, 50, 70];
export const CAPITAL_PRESETS = [2000, 5000, 10000, 25000, 50000, 100000];
export const RRR_PRESETS = [
  { label: '1:1', value: 1.0 },
  { label: '1:1.5', value: 1.5 },
  { label: '1:2', value: 2.0 },
  { label: '1:3', value: 3.0 },
  { label: 'Custom', value: 0 }
];
export const RISK_PERCENT_PRESETS = [0.5, 1.0, 1.5, 2.0, 3.0];
export const COMPOUNDING_RETURN_PRESETS = [2, 5, 8, 10, 15];

export const DrawdownRecoveryCalculatorScreen: React.FC<DrawdownRecoveryCalculatorScreenProps> = ({
  theme,
  isDarkMode = true,
  primaryCurrencySymbol = '$',
  onBackToLanding,
  onSignIn,
  onNavigateToTools
}) => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  // Mode Switcher: 'recovery' | 'compounding'
  const [activeMode, setActiveMode] = useState<'recovery' | 'compounding'>('recovery');

  // Currency Selection
  const [currencySymbol, setCurrencySymbol] = useState<string>(primaryCurrencySymbol || '$');

  // --- MODE 1: DRAWDOWN RECOVERY INPUTS ---
  const [startingCapital, setStartingCapital] = useState<number>(10000);
  const [currentEquity, setCurrentEquity] = useState<number>(7000);
  const [lossAmount, setLossAmount] = useState<number>(3000);
  const [lossPercentage, setLossPercentage] = useState<number>(30);

  // Risk per trade options: 'percent' | 'fixed'
  const [riskType, setRiskType] = useState<'percent' | 'fixed'>('percent');
  const [riskPercent, setRiskPercent] = useState<number>(1.0); // 1%
  const [riskFixedAmount, setRiskFixedAmount] = useState<number>(70); // based on equity

  // Risk to Reward Ratio (RRR)
  const [rrrPreset, setRrrPreset] = useState<number>(2.0); // 1:2 default
  const [customRrr, setCustomRrr] = useState<string>('2.5');

  // Strategy Win Rate (%)
  const [winRate, setWinRate] = useState<number>(50); // 50% default

  // --- MODE 2: COMPOUNDING GOAL INPUTS ---
  const [compInitialCapital, setCompInitialCapital] = useState<number>(10000);
  const [compFrequency, setCompFrequency] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [compReturnRate, setCompReturnRate] = useState<number>(5.0); // 5% per period
  const [compDuration, setCompDuration] = useState<number>(12); // 12 periods
  const [compTargetGoal, setCompTargetGoal] = useState<number>(25000); // 25k target goal
  const [compContribution, setCompContribution] = useState<number>(0); // periodic deposit

  // --- INTERACTION & FEEDBACK STATES ---
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeTabTable, setActiveTabTable] = useState<'summary' | 'table'>('summary');
  const [hoveredChartPoint, setHoveredChartPoint] = useState<any | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // ---------------------------------------------------------------------------
  // SYNCHRONIZED DRAWDOWN INPUT HANDLERS
  // ---------------------------------------------------------------------------
  const handleStartingCapitalChange = (newVal: number) => {
    const validVal = Math.max(1, newVal);
    setStartingCapital(validVal);
    // Keep loss percentage constant and update equity & loss amount
    const newLossAmount = (validVal * lossPercentage) / 100;
    const newEquity = Math.max(0, validVal - newLossAmount);
    setLossAmount(newLossAmount);
    setCurrentEquity(newEquity);

    if (riskType === 'percent') {
      setRiskFixedAmount((newEquity * riskPercent) / 100);
    }
  };

  const handleLossPercentageChange = (newPct: number) => {
    const clampedPct = Math.min(99.9, Math.max(0.1, newPct));
    setLossPercentage(clampedPct);
    const newLossAmt = (startingCapital * clampedPct) / 100;
    const newEq = Math.max(0, startingCapital - newLossAmt);
    setLossAmount(newLossAmt);
    setCurrentEquity(newEq);

    if (riskType === 'percent') {
      setRiskFixedAmount((newEq * riskPercent) / 100);
    }
  };

  const handleCurrentEquityChange = (newEq: number) => {
    const clampedEq = Math.max(0, Math.min(startingCapital, newEq));
    setCurrentEquity(clampedEq);
    const newLossAmt = startingCapital - clampedEq;
    setLossAmount(newLossAmt);
    const newPct = (newLossAmt / startingCapital) * 100;
    setLossPercentage(newPct);

    if (riskType === 'percent') {
      setRiskFixedAmount((clampedEq * riskPercent) / 100);
    }
  };

  const handleLossAmountChange = (newLoss: number) => {
    const clampedLoss = Math.max(0, Math.min(startingCapital, newLoss));
    setLossAmount(clampedLoss);
    const newEq = startingCapital - clampedLoss;
    setCurrentEquity(newEq);
    const newPct = (clampedLoss / startingCapital) * 100;
    setLossPercentage(newPct);

    if (riskType === 'percent') {
      setRiskFixedAmount((newEq * riskPercent) / 100);
    }
  };

  const handleRiskPercentChange = (pct: number) => {
    setRiskPercent(pct);
    setRiskFixedAmount((currentEquity * pct) / 100);
  };

  const handleRiskFixedChange = (amt: number) => {
    setRiskFixedAmount(amt);
    if (currentEquity > 0) {
      setRiskPercent((amt / currentEquity) * 100);
    }
  };

  // Reset to default
  const handleReset = () => {
    if (activeMode === 'recovery') {
      setStartingCapital(10000);
      setCurrentEquity(7000);
      setLossAmount(3000);
      setLossPercentage(30);
      setRiskType('percent');
      setRiskPercent(1.0);
      setRiskFixedAmount(70);
      setRrrPreset(2.0);
      setCustomRrr('2.5');
      setWinRate(50);
    } else {
      setCompInitialCapital(10000);
      setCompFrequency('monthly');
      setCompReturnRate(5.0);
      setCompDuration(12);
      setCompTargetGoal(25000);
      setCompContribution(0);
    }
  };

  // ---------------------------------------------------------------------------
  // MATHEMATICAL ENGINE (MODE 1: DRAWDOWN RECOVERY)
  // ---------------------------------------------------------------------------
  const recoveryMetrics = useMemo(() => {
    const lossPct = Math.min(99.9, Math.max(0.1, lossPercentage));
    const recoveryAmt = Math.max(0, startingCapital - currentEquity);

    // Required Gain Percentage Formula: (Loss % / (100 - Loss %)) * 100
    const reqGainPct = (lossPct / (100 - lossPct)) * 100;

    // Asymmetry Multiplier (e.g. 50% loss -> req 100% gain = 2.0x asymmetry)
    const asymmetryFactor = reqGainPct / lossPct;

    // Active RRR
    const effectiveRrr = rrrPreset === 0 ? parseFloat(customRrr) || 1.0 : rrrPreset;

    // Dollar Risk per trade
    const dollarRisk = riskType === 'percent'
      ? (currentEquity * (riskPercent / 100))
      : riskFixedAmount;

    // Profit Per Winning Trade = Dollar Risk * RRR
    const profitPerWin = Math.max(0.01, dollarRisk * effectiveRrr);

    // Consecutive Winning Trades Needed = Recovery Amount / Profit Per Winning Trade
    const consecutiveWinsNeeded = dollarRisk > 0 && recoveryAmt > 0
      ? Math.ceil(recoveryAmt / profitPerWin)
      : 0;

    // Mathematical Expectancy per Trade: E = (WinRate * Reward - LossRate * Risk)
    // In units of Risk: Expectancy = (W * RRR - (1 - W))
    const winProb = winRate / 100;
    const lossProb = 1 - winProb;
    const netExpectancyPerUnitRisk = (winProb * effectiveRrr) - (lossProb * 1.0);
    const expectedDollarPerTrade = dollarRisk * netExpectancyPerUnitRisk;

    // Real-world estimated trades needed (if expectancy > 0)
    let estimatedRealWorldTrades: number | null = null;
    let isExpectancyNegative = false;

    if (recoveryAmt === 0) {
      estimatedRealWorldTrades = 0;
    } else if (expectedDollarPerTrade > 0) {
      estimatedRealWorldTrades = Math.ceil(recoveryAmt / expectedDollarPerTrade);
    } else {
      isExpectancyNegative = true;
    }

    // Danger Zone classification
    let dangerLevel: 'safe' | 'caution' | 'danger' = 'safe';
    let zoneTitle = 'Easy Recovery Zone';
    let zoneColor = 'text-emerald-400';
    let zoneBg = 'bg-emerald-500/10 border-emerald-500/30';
    let gaugePosition = Math.min(100, (lossPct / 80) * 100);

    if (lossPct < 15) {
      dangerLevel = 'safe';
      zoneTitle = 'Controlled Variance Zone (<15% Loss)';
      zoneColor = 'text-emerald-400';
      zoneBg = 'bg-emerald-500/10 border-emerald-500/30';
    } else if (lossPct <= 30) {
      dangerLevel = 'caution';
      zoneTitle = 'Caution & Discipline Zone (15%–30% Loss)';
      zoneColor = 'text-amber-400';
      zoneBg = 'bg-amber-500/10 border-amber-500/30';
    } else {
      dangerLevel = 'danger';
      zoneTitle = 'Mathematical Asymmetry Trap Zone (>30% Loss)';
      zoneColor = 'text-rose-400';
      zoneBg = 'bg-rose-500/10 border-rose-500/30';
    }

    // Dynamic Psychological Warning Callout
    let warningMessage = '';
    if (lossPct < 15) {
      warningMessage = `Low drawdown of ${lossPct.toFixed(1)}% is normal market friction. It only requires a modest +${reqGainPct.toFixed(1)}% gain to recover. Maintain your standard position sizing and do not deviate from your trading journal rules.`;
    } else if (lossPct <= 30) {
      warningMessage = `At ${lossPct.toFixed(1)}% drawdown, the required gain jumps to +${reqGainPct.toFixed(1)}%. Protect remaining equity by limiting risk to 1.0% per trade. Avoid emotional revenge trading.`;
    } else if (lossPct <= 50) {
      warningMessage = `CRITICAL WARNING: A ${lossPct.toFixed(1)}% account drawdown demands a brutal +${reqGainPct.toFixed(1)}% account growth just to break even! DO NOT increase lot sizes or employ Martingale tactics. Cut position sizing to 0.5% immediately.`;
    } else {
      warningMessage = `SEVERE RISK COLLAPSE: A ${lossPct.toFixed(1)}% loss requires an exponential +${reqGainPct.toFixed(1)}% gain! The account is inside the mathematical asymmetry trap. Stop live trading immediately. Take a 48-hour cool-off period and conduct a forensic trade journal review.`;
    }

    // Milestone roadmap
    const milestones = [
      { pct: 25, label: '25% Recovered', equity: currentEquity + (recoveryAmt * 0.25) },
      { pct: 50, label: 'Halfway Mark (50%)', equity: currentEquity + (recoveryAmt * 0.50) },
      { pct: 75, label: '75% Recovered', equity: currentEquity + (recoveryAmt * 0.75) },
      { pct: 100, label: 'Full Break-Even', equity: startingCapital }
    ].map(m => {
      const neededFromCurrent = m.equity - currentEquity;
      const tradesNeeded = expectedDollarPerTrade > 0
        ? Math.ceil(neededFromCurrent / expectedDollarPerTrade)
        : Math.ceil(neededFromCurrent / profitPerWin);
      return {
        ...m,
        tradesNeeded: Math.max(0, tradesNeeded),
        gainFromCurrent: currentEquity > 0 ? ((neededFromCurrent / currentEquity) * 100) : 0
      };
    });

    return {
      lossPct,
      reqGainPct,
      recoveryAmt,
      asymmetryFactor,
      effectiveRrr,
      dollarRisk,
      profitPerWin,
      consecutiveWinsNeeded,
      expectedDollarPerTrade,
      estimatedRealWorldTrades,
      isExpectancyNegative,
      netExpectancyPerUnitRisk,
      dangerLevel,
      zoneTitle,
      zoneColor,
      zoneBg,
      gaugePosition,
      warningMessage,
      milestones
    };
  }, [
    startingCapital,
    currentEquity,
    lossPercentage,
    riskType,
    riskPercent,
    riskFixedAmount,
    rrrPreset,
    customRrr,
    winRate
  ]);

  // ---------------------------------------------------------------------------
  // MATHEMATICAL ENGINE (MODE 2: COMPOUNDING GROWTH ROADMAP)
  // ---------------------------------------------------------------------------
  const compoundingResults = useMemo(() => {
    const P0 = Math.max(1, compInitialCapital);
    const r = compReturnRate / 100;
    const n = Math.max(1, Math.min(120, compDuration));
    const contribution = Math.max(0, compContribution);

    const schedule: Array<{
      period: number;
      startBalance: number;
      periodReturn: number;
      contribution: number;
      endBalance: number;
      cumulativeProfit: number;
      cumulativeRoi: number;
      isGoalHit: boolean;
    }> = [];

    let currentBal = P0;
    let goalHitPeriod: number | null = null;

    for (let i = 1; i <= n; i++) {
      const startBalance = currentBal;
      const periodReturn = startBalance * r;
      const endBalance = startBalance + periodReturn + contribution;
      const cumulativeProfit = endBalance - P0 - (contribution * i);
      const cumulativeRoi = ((endBalance - P0) / P0) * 100;
      const isGoalHit = endBalance >= compTargetGoal;

      if (isGoalHit && goalHitPeriod === null && compTargetGoal > P0) {
        goalHitPeriod = i;
      }

      schedule.push({
        period: i,
        startBalance,
        periodReturn,
        contribution,
        endBalance,
        cumulativeProfit,
        cumulativeRoi,
        isGoalHit
      });

      currentBal = endBalance;
    }

    const finalBalance = currentBal;
    const totalProfit = finalBalance - P0 - (contribution * n);
    const totalRoi = ((finalBalance - P0) / P0) * 100;

    // Calculate periods required to reach target goal via closed form (if no contributions)
    let calculatedPeriodsToGoal: number | null = null;
    if (compTargetGoal > P0 && r > 0) {
      if (contribution === 0) {
        calculatedPeriodsToGoal = Math.ceil(Math.log(compTargetGoal / P0) / Math.log(1 + r));
      } else {
        calculatedPeriodsToGoal = goalHitPeriod;
      }
    }

    return {
      schedule,
      finalBalance,
      totalProfit,
      totalRoi,
      goalHitPeriod: goalHitPeriod || calculatedPeriodsToGoal,
      calculatedPeriodsToGoal
    };
  }, [compInitialCapital, compReturnRate, compDuration, compTargetGoal, compContribution]);

  // ---------------------------------------------------------------------------
  // INTERACTIVE ASYMMETRY CURVE POINTS (FOR MODE 1 SVG CHART)
  // ---------------------------------------------------------------------------
  const asymmetryCurveData = useMemo(() => {
    const points = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90];
    return points.map(l => {
      const g = (l / (100 - l)) * 100;
      return { loss: l, gain: g };
    });
  }, []);

  // ---------------------------------------------------------------------------
  // ONE-CLICK SUMMARY COPY & EXPORT HANDLERS
  // ---------------------------------------------------------------------------
  const handleCopySummary = () => {
    let summaryText = '';
    if (activeMode === 'recovery') {
      summaryText = `📊 TRADEJOURNAL DRAWDOWN RECOVERY ROADMAP
----------------------------------------
• Starting Capital: ${currencySymbol}${formatNumber(startingCapital, 2)}
• Current Equity: ${currencySymbol}${formatNumber(currentEquity, 2)} (-${recoveryMetrics.lossPct.toFixed(1)}%)
• Recovery Required: ${currencySymbol}${formatNumber(recoveryMetrics.recoveryAmt, 2)}
• Required Gain to Breakeven: +${recoveryMetrics.reqGainPct.toFixed(2)}%
• Risk-to-Reward Ratio: 1:${recoveryMetrics.effectiveRrr}
• Risk Per Trade: ${currencySymbol}${formatNumber(recoveryMetrics.dollarRisk, 2)} (${riskPercent.toFixed(1)}%)
• Net Consecutive Wins Needed: ${recoveryMetrics.consecutiveWinsNeeded} trades
• Strategy Win Rate: ${winRate}%
• Estimated Real-World Trades: ${recoveryMetrics.isExpectancyNegative ? 'Negative Expectancy!' : `~${recoveryMetrics.estimatedRealWorldTrades} trades`}
• Risk Danger Zone: ${recoveryMetrics.zoneTitle}
----------------------------------------
Calculated via TradeJournal: https://tradejournall.com/tools/drawdown-recovery-calculator`;
    } else {
      summaryText = `📈 TRADEJOURNAL COMPOUNDING GROWTH ROADMAP
----------------------------------------
• Initial Capital: ${currencySymbol}${formatNumber(compInitialCapital, 2)}
• Return Rate: ${compReturnRate}% per ${compFrequency}
• Duration: ${compDuration} ${compFrequency}s
• Projected Balance: ${currencySymbol}${formatNumber(compCompoundingFinalBalance, 2)}
• Total Net Profit: +${currencySymbol}${formatNumber(compoundingResults.totalProfit, 2)} (+${compoundingResults.totalRoi.toFixed(1)}%)
• Target Milestone Goal: ${currencySymbol}${formatNumber(compTargetGoal, 2)} ${compoundingResults.goalHitPeriod ? `(Reached in period ${compoundingResults.goalHitPeriod})` : ''}
----------------------------------------
Plan your growth on TradeJournal: https://tradejournall.com/tools/drawdown-recovery-calculator`;
    }

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const compCompoundingFinalBalance = compoundingResults.finalBalance;

  // CSV Export for Compounding Table
  const handleExportCSV = () => {
    const headers = ['Period', 'Starting Capital', 'Period Return', 'Deposit', 'Ending Balance', 'Cumulative Profit', 'ROI %'];
    const rows = compoundingResults.schedule.map(s => [
      s.period,
      s.startBalance.toFixed(2),
      s.periodReturn.toFixed(2),
      s.contribution.toFixed(2),
      s.endBalance.toFixed(2),
      s.cumulativeProfit.toFixed(2),
      s.cumulativeRoi.toFixed(2)
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tradejournal-compounding-roadmap-${compDuration}-${compFrequency}s.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

    // Background Gradient (FinTech Slate Deep Dark)
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 680);
    bgGrad.addColorStop(0, '#090D16');
    bgGrad.addColorStop(0.5, '#0F172A');
    bgGrad.addColorStop(1, '#080E1A');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 680);

    // Decorative subtle grid & glow
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    for (let x = 40; x < 1200; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 680);
      ctx.stroke();
    }
    for (let y = 40; y < 680; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1200, y);
      ctx.stroke();
    }

    // Top Brand Header
    ctx.fillStyle = '#22C55E';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText('TRADEJOURNAL.COM • TRADING PSYCHOLOGY & RISK UTILITIES', 50, 55);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 34px Inter, sans-serif';
    const mainTitle = activeMode === 'recovery'
      ? 'Drawdown Recovery & Break-Even Roadmap'
      : 'Account Compounding Growth Plan';
    ctx.fillText(mainTitle, 50, 100);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '15px Inter, sans-serif';
    ctx.fillText('Professional Risk Management & Asymmetry Calculator for Disciplined Traders', 50, 130);

    // Divider Line
    ctx.strokeStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(50, 150);
    ctx.lineTo(1150, 150);
    ctx.stroke();

    if (activeMode === 'recovery') {
      // 4 Metric Highlight Cards
      const cardW = 255;
      const cardH = 150;
      const cardY = 175;

      const cards = [
        {
          label: 'CURRENT DRAWDOWN',
          val: `-${recoveryMetrics.lossPct.toFixed(1)}%`,
          sub: `Loss: ${currencySymbol}${formatNumber(recoveryMetrics.recoveryAmt, 0)}`,
          color: recoveryMetrics.lossPct > 30 ? '#EF4444' : '#F59E0B'
        },
        {
          label: 'REQUIRED GAIN',
          val: `+${recoveryMetrics.reqGainPct.toFixed(1)}%`,
          sub: `${recoveryMetrics.asymmetryFactor.toFixed(2)}x Math Asymmetry`,
          color: '#22C55E'
        },
        {
          label: 'NET WINNING TRADES',
          val: `${recoveryMetrics.consecutiveWinsNeeded}`,
          sub: `At 1:${recoveryMetrics.effectiveRrr} RRR (${riskPercent}% Risk)`,
          color: '#38BDF8'
        },
        {
          label: 'EST. REAL-WORLD TRADES',
          val: recoveryMetrics.isExpectancyNegative ? 'NEGATIVE' : `~${recoveryMetrics.estimatedRealWorldTrades}`,
          sub: `Factoring ${winRate}% Win Rate`,
          color: recoveryMetrics.isExpectancyNegative ? '#EF4444' : '#A78BFA'
        }
      ];

      cards.forEach((c, idx) => {
        const cx = 50 + idx * (cardW + 40);
        // Card bg
        ctx.fillStyle = '#1E293B';
        ctx.roundRect ? ctx.roundRect(cx, cardY, cardW, cardH, 16) : ctx.fillRect(cx, cardY, cardW, cardH);
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.stroke();

        ctx.fillStyle = '#94A3B8';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText(c.label, cx + 20, cardY + 36);

        ctx.fillStyle = c.color;
        ctx.font = '900 36px Inter, sans-serif';
        ctx.fillText(c.val, cx + 20, cardY + 84);

        ctx.fillStyle = '#CBD5E1';
        ctx.font = '13px Inter, sans-serif';
        ctx.fillText(c.sub, cx + 20, cardY + 120);
      });

      // Gauge / Warning Box
      const warnBoxY = 355;
      ctx.fillStyle = recoveryMetrics.lossPct > 30 ? '#450A0A' : '#1E293B';
      ctx.strokeStyle = recoveryMetrics.lossPct > 30 ? '#DC2626' : '#F59E0B';
      ctx.lineWidth = 1.5;
      ctx.roundRect ? ctx.roundRect(50, warnBoxY, 1100, 110, 16) : ctx.fillRect(50, warnBoxY, 1100, 110);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = recoveryMetrics.zoneColor.includes('rose') ? '#F87171' : (recoveryMetrics.zoneColor.includes('amber') ? '#FBBF24' : '#4ADE80');
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.fillText(`STATUS: ${recoveryMetrics.zoneTitle.toUpperCase()}`, 75, warnBoxY + 38);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = '15px Inter, sans-serif';
      ctx.fillText(recoveryMetrics.warningMessage, 75, warnBoxY + 74);

      // Psychological Discipline Footer Bar
      const ruleBoxY = 490;
      ctx.fillStyle = '#131D31';
      ctx.roundRect ? ctx.roundRect(50, ruleBoxY, 1100, 130, 16) : ctx.fillRect(50, ruleBoxY, 1100, 130);
      ctx.fill();

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText('CORE RULES FOR DRAWDOWN RECOVERY:', 75, ruleBoxY + 35);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText('1. Never increase lot size or use Martingale after a loss — math guarantees ruin.', 75, ruleBoxY + 65);
      ctx.fillText('2. Stick strictly to 1:2+ Risk-to-Reward to maintain a positive recovery expectancy.', 75, ruleBoxY + 92);
      ctx.fillText('3. Log every emotion and mistake on TradeJournal to isolate and eliminate behavioral leaks.', 75, ruleBoxY + 118);

    } else {
      // Compounding Snapshot Cards
      const cardW = 345;
      const cardH = 150;
      const cardY = 175;

      const cards = [
        {
          label: 'INITIAL INVESTMENT',
          val: `${currencySymbol}${formatNumber(compInitialCapital, 0)}`,
          sub: `${compReturnRate}% per ${compFrequency}`,
          color: '#38BDF8'
        },
        {
          label: 'PROJECTED BALANCE',
          val: `${currencySymbol}${formatNumber(compoundingResults.finalBalance, 0)}`,
          sub: `After ${compDuration} ${compFrequency}s`,
          color: '#22C55E'
        },
        {
          label: 'TOTAL NET PROFIT',
          val: `+${currencySymbol}${formatNumber(compoundingResults.totalProfit, 0)}`,
          sub: `+${compoundingResults.totalRoi.toFixed(1)}% ROI`,
          color: '#A78BFA'
        }
      ];

      cards.forEach((c, idx) => {
        const cx = 50 + idx * (cardW + 32);
        ctx.fillStyle = '#1E293B';
        ctx.roundRect ? ctx.roundRect(cx, cardY, cardW, cardH, 16) : ctx.fillRect(cx, cardY, cardW, cardH);
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.stroke();

        ctx.fillStyle = '#94A3B8';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText(c.label, cx + 25, cardY + 36);

        ctx.fillStyle = c.color;
        ctx.font = '900 36px Inter, sans-serif';
        ctx.fillText(c.val, cx + 25, cardY + 84);

        ctx.fillStyle = '#CBD5E1';
        ctx.font = '14px Inter, sans-serif';
        ctx.fillText(c.sub, cx + 25, cardY + 120);
      });

      // Target Goal Milestone Callout
      const milestoneY = 360;
      ctx.fillStyle = '#1E293B';
      ctx.roundRect ? ctx.roundRect(50, milestoneY, 1100, 250, 16) : ctx.fillRect(50, milestoneY, 1100, 250);
      ctx.fill();

      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.fillText(`TARGET MILESTONE: ${currencySymbol}${formatNumber(compTargetGoal, 0)}`, 80, milestoneY + 45);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = '18px Inter, sans-serif';
      const goalMsg = compoundingResults.goalHitPeriod
        ? `Target is reached within period ${compoundingResults.goalHitPeriod} (${compFrequency}).`
        : `Target not reached within current ${compDuration} periods. Increase duration or return rate.`;
      ctx.fillText(goalMsg, 80, milestoneY + 85);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText('Rule of 72 & Compounding Power: Small consistent returns outperform erratic big swings.', 80, milestoneY + 130);
      ctx.fillText('Journal your daily/weekly P&L on TradeJournal to track variance against this compounding model.', 80, milestoneY + 160);
    }

    // Watermark / Brand Badge bottom-right
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText('Generate your free trading roadmap at: tradejournall.com', 750, 650);

    // Export to PNG
    const imgUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = activeMode === 'recovery'
      ? `tradejournal-drawdown-recovery-roadmap-${recoveryMetrics.lossPct.toFixed(0)}pct.png`
      : `tradejournal-compounding-plan-${compDuration}-${compFrequency}s.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setIsExportingImage(false);
  };

  // ---------------------------------------------------------------------------
  // JSON-LD SCHEMA INJECTION (SOFTWARE APPLICATION & FAQ RICH SNIPPETS)
  // ---------------------------------------------------------------------------
  const schemaJson = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          'name': 'Trading Drawdown Recovery & Compounding Goal Calculator',
          'operatingSystem': 'All',
          'applicationCategory': 'FinanceApplication',
          'description': 'Free online trading drawdown recovery calculator and compounding goal tracker. Calculate exact percentage return, required winning trades at 1:2 RRR, and real-world trade count to recover trading losses.',
          'url': 'https://tradejournall.com/tools/drawdown-recovery-calculator',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'TradeJournal',
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
              'name': 'Drawdown Recovery Calculator',
              'item': 'https://tradejournall.com/tools/drawdown-recovery-calculator'
            }
          ]
        },
        {
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'What is the trading drawdown recovery formula and why is it asymmetric?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'The drawdown recovery formula is: Required Gain % = (Loss % / (100 - Loss %)) * 100. It is asymmetric because when you lose capital, your remaining equity base shrinks. A 10% loss requires an 11.11% gain, but a 50% loss requires a 100% gain, and a 90% loss requires a staggering 900% gain just to break even.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How many winning trades do I need to recover a 50% trading loss?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'At a 1:2 risk-to-reward ratio and risking 1% of current equity per trade, each winning trade yields a 2% gain. Consecutive winning trades needed = Recovery Amount / Profit Per Trade. Factoring in a 50% realistic win rate, a trader typically needs approximately 30 to 50 real-world trades with disciplined sizing rather than trying to make it back in 1 or 2 high-leverage gambles.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How does the 1 to 2 risk reward drawdown recovery tool protect prop firm and crypto accounts?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'By maintaining a minimum 1:2 risk-to-reward ratio, your strategy maintains a positive statistical expectancy even with a win rate as low as 40%. This prevents the fatal trap of revenge trading or doubling position size (Martingale), which causes 95% of prop firm challenge failures and crypto account liquidations.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How to calculate account compounding growth in trading?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Account compounding is calculated with the formula: Compounded Capital = Initial Investment * (1 + (Return Rate / 100))^N, where N is the number of periods (months, weeks, or days). Even a conservative 5% monthly return doubles a trading account in approximately 14.2 months.'
              }
            }
          ]
        }
      ]
    };
  }, []);

  // Update document title and sync meta tags
  useEffect(() => {
    document.title = 'Trading Drawdown Recovery Calculator & Compounding Goal Tracker — TradeJournal';
  }, []);

  // ---------------------------------------------------------------------------
  // RENDER COMPONENT
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 text-slate-100 font-sans">
      <Helmet>
        <title>Trading Drawdown Recovery Calculator & Compounding Goal Tracker — TradeJournal</title>
        <meta
          name="description"
          content="Calculate exact percentage gain and winning trades needed to recover from trading drawdown losses. Plan your account compounding growth roadmap and prevent revenge trading."
        />
        <meta
          name="keywords"
          content="trading drawdown recovery calculator, how to recover trading loss percentage tool, trading loss recovery trades needed calculator, forex account drawdown recovery calculator, option trading loss recovery plan calculator, trading compounding goal tracker, capital recovery percentage calculator, 1 to 2 risk reward drawdown recovery tool, tradejournal"
        />
        <link rel="canonical" href="https://tradejournall.com/tools/drawdown-recovery-calculator" />
        <meta property="og:title" content="Trading Drawdown Recovery Calculator & Compounding Goal Tracker" />
        <meta
          property="og:description"
          content="Calculate exact gain percentage and trades needed to break even after a loss. Interactive visual asymmetry gauge and compounding roadmap."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tradejournall.com/tools/drawdown-recovery-calculator" />
        <script type="application/ld+json">{JSON.stringify(schemaJson)}</script>
      </Helmet>

      {/* --------------------------------------------------------------------- */}
      {/* TOP BREADCRUMB & HEADER BAR */}
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
            FinTech Trading Psychology & Risk Utility
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 shadow-lg shadow-emerald-500/10">
              <Scale size={28} />
            </span>
            Drawdown Recovery & Compounding Goal Calculator
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Visual calculation engine for equity, options, forex, and crypto traders. Unmask non-linear loss asymmetry, compute exact winning trades needed, and engineer your account compounding roadmap.
          </p>
        </div>

        {/* Global Toolbar: Currency & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Currency Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-1 text-xs font-bold">
            {['$', '₹', '€', '£'].map((sym) => (
              <button
                key={sym}
                onClick={() => setCurrencySymbol(sym)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  currencySymbol === sym
                    ? 'bg-emerald-500 text-slate-950 font-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>

          {/* Share / Copy Button */}
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition active:scale-95 cursor-pointer"
            title="Copy formatted recovery roadmap summary"
          >
            {copiedSummary ? <Check size={15} className="text-emerald-400" /> : <Share2 size={15} />}
            {copiedSummary ? 'Copied!' : 'Share Plan'}
          </button>

          {/* Download PNG Snapshot */}
          <button
            onClick={handleDownloadBrandedImage}
            disabled={isExportingImage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-bold border border-emerald-500/40 transition active:scale-95 cursor-pointer disabled:opacity-50"
            title="Download high-resolution roadmap snapshot"
          >
            <Download size={15} />
            {isExportingImage ? 'Generating...' : 'Save PNG'}
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition active:scale-95 cursor-pointer"
            title="Reset calculator values"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* MODE SWITCHER TABS */}
      {/* --------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <button
          onClick={() => setActiveMode('recovery')}
          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left cursor-pointer ${
            activeMode === 'recovery'
              ? 'bg-gradient-to-r from-slate-900 to-slate-800/90 border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
          }`}
        >
          <div
            className={`p-3 rounded-xl ${
              activeMode === 'recovery' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <TrendingDown size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Mode 1</span>
              {activeMode === 'recovery' && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-black">
                  ACTIVE
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-white">Drawdown Loss Recovery</h3>
            <p className="text-xs text-slate-400">Break-even gain % & winning trades engine</p>
          </div>
        </button>

        <button
          onClick={() => setActiveMode('compounding')}
          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left cursor-pointer ${
            activeMode === 'compounding'
              ? 'bg-gradient-to-r from-slate-900 to-slate-800/90 border-blue-500/60 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
          }`}
        >
          <div
            className={`p-3 rounded-xl ${
              activeMode === 'compounding' ? 'bg-blue-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <TrendingUp size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-400">Mode 2</span>
              {activeMode === 'compounding' && (
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-black">
                  ACTIVE
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-white">Account Compounding Growth</h3>
            <p className="text-xs text-slate-400">Exponential roadmap & milestone target tracker</p>
          </div>
        </button>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* MAIN 2-COLUMN WORKSPACE GRID */}
      {/* --------------------------------------------------------------------- */}
      {activeMode === 'recovery' ? (
        /* MODE 1: DRAWDOWN RECOVERY WORKSPACE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* LEFT COLUMN: PARAMETER CONTROLS (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Account Equity & Loss Inputs */}
            <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <DollarSign size={16} className="text-emerald-400" />
                  Capital & Loss Parameters
                </h3>
                <span className="text-[11px] text-slate-400">Real-time sync</span>
              </div>

              {/* Starting Capital */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-300">Starting Account Capital</label>
                  <span className="text-xs font-black text-emerald-400 font-mono">
                    {currencySymbol}{formatNumber(startingCapital, 0)}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={startingCapital || ''}
                    onChange={(e) => handleStartingCapitalChange(parseFloat(e.target.value) || 0)}
                    min={1}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500 transition"
                    placeholder="10000"
                  />
                </div>
                {/* Quick Capital Presets */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {CAPITAL_PRESETS.map((cap) => (
                    <button
                      key={cap}
                      onClick={() => handleStartingCapitalChange(cap)}
                      className={`text-[11px] font-bold px-2 py-1 rounded-lg border transition ${
                        startingCapital === cap
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {currencySymbol}{cap >= 1000 ? `${cap / 1000}k` : cap}
                    </button>
                  ))}
                </div>
              </div>

              {/* Loss Percentage Slider & Presets */}
              <div className="pt-2 border-t border-slate-700/60">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-300">Drawdown Loss Percentage</label>
                  <span
                    className={`text-sm font-black font-mono ${
                      lossPercentage > 30 ? 'text-rose-400' : (lossPercentage > 15 ? 'text-amber-400' : 'text-emerald-400')
                    }`}
                  >
                    -{lossPercentage.toFixed(1)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="90"
                  step="1"
                  value={lossPercentage}
                  onChange={(e) => handleLossPercentageChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                {/* Presets */}
                <div className="flex gap-1.5 mt-2.5">
                  {LOSS_PRESETS.map((pct) => (
                    <button
                      key={pct}
                      onClick={() => handleLossPercentageChange(pct)}
                      className={`flex-1 py-1.5 text-xs font-black rounded-lg border transition ${
                        Math.round(lossPercentage) === pct
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      -{pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Dual Sync: Current Equity OR Loss Amount */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/60">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Current Equity</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      value={Math.round(currentEquity) || ''}
                      onChange={(e) => handleCurrentEquityChange(parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-2 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                      placeholder="7000"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Total Loss Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400 text-xs font-bold">
                      -
                    </span>
                    <input
                      type="number"
                      value={Math.round(lossAmount) || ''}
                      onChange={(e) => handleLossAmountChange(parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-2 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-rose-300 font-mono text-xs focus:outline-none focus:border-rose-500"
                      placeholder="3000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Sizing & Execution Strategy */}
            <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Activity size={16} className="text-blue-400" />
                  Risk & Execution Parameters
                </h3>
                <span className="text-[11px] text-blue-400 font-bold">Expectancy Engine</span>
              </div>

              {/* Risk Sizing Mode Toggle */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-300">Risk per Trade</label>
                  <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px] font-bold">
                    <button
                      onClick={() => setRiskType('percent')}
                      className={`px-2 py-0.5 rounded ${
                        riskType === 'percent' ? 'bg-blue-500 text-slate-950 font-black' : 'text-slate-400'
                      }`}
                    >
                      % Equity
                    </button>
                    <button
                      onClick={() => setRiskType('fixed')}
                      className={`px-2 py-0.5 rounded ${
                        riskType === 'fixed' ? 'bg-blue-500 text-slate-950 font-black' : 'text-slate-400'
                      }`}
                    >
                      Fixed {currencySymbol}
                    </button>
                  </div>
                </div>

                {riskType === 'percent' ? (
                  <div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0.25"
                        max="5.0"
                        step="0.25"
                        value={riskPercent}
                        onChange={(e) => handleRiskPercentChange(parseFloat(e.target.value))}
                        className="flex-1 h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <span className="text-xs font-black text-blue-400 font-mono w-14 text-right">
                        {riskPercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
                      <span>Dollar Risk: <strong className="text-slate-200">{currencySymbol}{formatNumber(recoveryMetrics.dollarRisk, 2)}</strong></span>
                      <div className="flex gap-1">
                        {RISK_PERCENT_PRESETS.map((p) => (
                          <button
                            key={p}
                            onClick={() => handleRiskPercentChange(p)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              riskPercent === p ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-900 text-slate-500'
                            }`}
                          >
                            {p}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                        {currencySymbol}
                      </span>
                      <input
                        type="number"
                        value={riskFixedAmount || ''}
                        onChange={(e) => handleRiskFixedChange(parseFloat(e.target.value) || 0)}
                        className="w-full pl-7 pr-3 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                        placeholder="100"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Represents {currentEquity > 0 ? ((riskFixedAmount / currentEquity) * 100).toFixed(2) : 0}% of current equity.
                    </span>
                  </div>
                )}
              </div>

              {/* Risk to Reward Ratio (RRR) */}
              <div className="pt-2 border-t border-slate-700/60">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-300">Risk-to-Reward Ratio (RRR)</label>
                  <span className="text-xs font-black text-emerald-400 font-mono">
                    1 : {recoveryMetrics.effectiveRrr}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {RRR_PRESETS.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setRrrPreset(item.value)}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                        rrrPreset === item.value
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                {rrrPreset === 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-slate-400">1 :</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      max="10"
                      value={customRrr}
                      onChange={(e) => setCustomRrr(e.target.value)}
                      className="w-24 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white"
                      placeholder="2.5"
                    />
                    <span className="text-xs text-slate-400">(Custom Reward Multiple)</span>
                  </div>
                )}
              </div>

              {/* Strategy Win Rate (%) */}
              <div className="pt-2 border-t border-slate-700/60">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-300">Strategy Estimated Win Rate</label>
                  <span className="text-xs font-black text-purple-400 font-mono">{winRate}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="20"
                    max="80"
                    step="1"
                    value={winRate}
                    onChange={(e) => setWinRate(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="flex gap-1">
                    {[40, 50, 60].map((w) => (
                      <button
                        key={w}
                        onClick={() => setWinRate(w)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          winRate === w ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-900 text-slate-500'
                        }`}
                      >
                        {w}%
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 mt-2">
                  <span>Expectancy / Trade:</span>
                  <span
                    className={`font-black font-mono ${
                      recoveryMetrics.netExpectancyPerUnitRisk > 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {recoveryMetrics.netExpectancyPerUnitRisk > 0 ? '+' : ''}
                    {recoveryMetrics.netExpectancyPerUnitRisk.toFixed(2)}R ({currencySymbol}{formatNumber(recoveryMetrics.expectedDollarPerTrade, 2)})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: REAL-TIME OUTPUT ENGINES & CHARTS (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Stat Cards (4 Cards Grid) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Card 1: Required Gain % */}
              <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Required Gain</span>
                <div className="my-1">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                    +{recoveryMetrics.reqGainPct.toFixed(1)}%
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {recoveryMetrics.asymmetryFactor.toFixed(2)}x non-linear hurdle
                </span>
              </div>

              {/* Card 2: Recovery Amount */}
              <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Amount to Recover</span>
                <div className="my-1">
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                    {currencySymbol}{formatNumber(recoveryMetrics.recoveryAmt, 0)}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Back to {currencySymbol}{formatNumber(startingCapital, 0)}
                </span>
              </div>

              {/* Card 3: Consecutive Wins Needed */}
              <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Net Winning Trades</span>
                <div className="my-1">
                  <span className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
                    {recoveryMetrics.consecutiveWinsNeeded}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  at 1:{recoveryMetrics.effectiveRrr} RRR
                </span>
              </div>

              {/* Card 4: Estimated Real-World Trades */}
              <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Est. Total Trades</span>
                <div className="my-1">
                  {recoveryMetrics.isExpectancyNegative ? (
                    <span className="text-lg font-black text-rose-400 leading-tight">
                      Negative Expectancy!
                    </span>
                  ) : (
                    <span className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">
                      ~{recoveryMetrics.estimatedRealWorldTrades}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">
                  At {winRate}% win rate
                </span>
              </div>
            </div>

            {/* Asymmetry & Danger Gauge Bar */}
            <div className={`p-5 rounded-3xl border shadow-xl transition-all ${recoveryMetrics.zoneBg}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={20} className={recoveryMetrics.zoneColor} />
                  <h4 className="text-sm font-black text-white">{recoveryMetrics.zoneTitle}</h4>
                </div>
                <span className={`text-xs font-mono font-black ${recoveryMetrics.zoneColor}`}>
                  Drawdown: {recoveryMetrics.lossPct.toFixed(1)}% | Gain Hurdle: +{recoveryMetrics.reqGainPct.toFixed(1)}%
                </span>
              </div>

              {/* Visual Multi-Zone Gauge */}
              <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden p-0.5 flex mb-2 border border-slate-700">
                <div className="h-full bg-emerald-500 rounded-l-full w-[25%]" title="Safe Zone (<15%)"></div>
                <div className="h-full bg-amber-500 w-[25%]" title="Caution Zone (15%-30%)"></div>
                <div className="h-full bg-rose-500 rounded-r-full w-[50%]" title="Danger Zone (>30%)"></div>
              </div>

              {/* Needle Position Indicator */}
              <div className="relative w-full h-4 mb-3">
                <div
                  className="absolute -top-1 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                  style={{ left: `${recoveryMetrics.gaugePosition}%` }}
                >
                  <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-white"></div>
                  <span className="text-[9px] font-black font-mono text-white bg-slate-900 px-1 rounded shadow">
                    YOU ARE HERE
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                <span className="text-emerald-400">0% Safe</span>
                <span className="text-amber-400">15% Caution</span>
                <span className="text-rose-400">30% High Danger</span>
                <span className="text-rose-500">80%+ Catastrophic</span>
              </div>

              {/* Dynamic Callout Message */}
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 text-xs leading-relaxed text-slate-200">
                <p>
                  <strong className="text-white">Psychology Callout: </strong>
                  {recoveryMetrics.warningMessage}
                </p>
              </div>
            </div>

            {/* Visual Non-Linear Asymmetry Hockey Stick Chart */}
            <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <BarChart3 size={18} className="text-emerald-400" />
                    The Mathematical Asymmetry Hockey Stick Curve
                  </h4>
                  <p className="text-xs text-slate-400">Why losses hurt exponentially more than gains</p>
                </div>
                <span className="text-xs font-bold text-slate-400 hidden sm:inline">
                  Interactive Chart
                </span>
              </div>

              {/* SVG Curve Component */}
              <div className="relative w-full h-56 bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col justify-end">
                {/* SVG Visualizing the Curve */}
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[36, 72, 108, 144].map((y) => (
                    <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#334155" strokeDasharray="4 4" strokeWidth="0.8" opacity="0.6" />
                  ))}

                  {/* Exponential Path: X maps 0-100% loss, Y maps 0-400% gain (inverted SVG Y) */}
                  <path
                    d={`M 0,180 ${asymmetryCurveData
                      .map((d) => {
                        const x = (d.loss / 90) * 500;
                        const y = 180 - Math.min(180, (d.gain / 400) * 180);
                        return `L ${x.toFixed(1)},${y.toFixed(1)}`;
                      })
                      .join(' ')}`}
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="3"
                  />

                  {/* Area fill under curve */}
                  <path
                    d={`M 0,180 ${asymmetryCurveData
                      .map((d) => {
                        const x = (d.loss / 90) * 500;
                        const y = 180 - Math.min(180, (d.gain / 400) * 180);
                        return `L ${x.toFixed(1)},${y.toFixed(1)}`;
                      })
                      .join(' ')} L 500,180 Z`}
                    fill="url(#curveGradient)"
                    opacity="0.25"
                  />

                  <defs>
                    <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Marker for Current Trader Position */}
                  {(() => {
                    const cx = Math.min(500, (recoveryMetrics.lossPct / 90) * 500);
                    const cy = 180 - Math.min(175, (recoveryMetrics.reqGainPct / 400) * 180);
                    return (
                      <g>
                        <circle cx={cx} cy={cy} r="8" fill="#22C55E" className="animate-ping" opacity="0.5" />
                        <circle cx={cx} cy={cy} r="6" fill="#22C55E" stroke="#FFFFFF" strokeWidth="2" />
                      </g>
                    );
                  })()}
                </svg>

                {/* X Axis Labels */}
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2 border-t border-slate-800 pt-1">
                  <span>-10% Loss (+11% Gain)</span>
                  <span>-30% (+43%)</span>
                  <span>-50% (+100%)</span>
                  <span>-70% (+233%)</span>
                  <span>-90% (+900%)</span>
                </div>
              </div>

              {/* Quick Asymmetry Reference Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-xs font-mono">
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">10% Drawdown</span>
                  <span className="text-emerald-400 font-bold">+11.1% Gain</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">30% Drawdown</span>
                  <span className="text-amber-400 font-bold">+42.9% Gain</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">50% Drawdown</span>
                  <span className="text-rose-400 font-bold">+100.0% Gain</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">70% Drawdown</span>
                  <span className="text-rose-500 font-black">+233.3% Gain</span>
                </div>
              </div>
            </div>

            {/* Step-by-Step Recovery Milestone Roadmap */}
            <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl">
              <h4 className="text-sm font-black text-white mb-3 flex items-center gap-2">
                <Target size={18} className="text-blue-400" />
                Step-by-Step Capital Recovery Milestones
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recoveryMetrics.milestones.map((m) => (
                  <div
                    key={m.pct}
                    className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={14} className={m.pct === 100 ? 'text-emerald-400' : 'text-blue-400'} />
                        <span className="text-xs font-bold text-white">{m.label}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Target Equity: {currencySymbol}{formatNumber(m.equity, 0)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-400 block font-mono">
                        +{m.gainFromCurrent.toFixed(1)}%
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ~{m.tradesNeeded} trades
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MODE 2: ACCOUNT COMPOUNDING GROWTH ROADMAP */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* LEFT COLUMN: COMPOUNDING CONTROLS (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp size={16} className="text-blue-400" />
                  Growth Parameters
                </h3>
                <span className="text-[11px] text-blue-400 font-bold">Compounding Engine</span>
              </div>

              {/* Initial Investment */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Starting Capital</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={compInitialCapital || ''}
                    onChange={(e) => setCompInitialCapital(parseFloat(e.target.value) || 0)}
                    min={1}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                    placeholder="10000"
                  />
                </div>
              </div>

              {/* Compounding Frequency */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Compounding Period Frequency</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'daily', label: 'Daily (20 days)' },
                    { id: 'weekly', label: 'Weekly' },
                    { id: 'monthly', label: 'Monthly' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setCompFrequency(f.id as any)}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        compFrequency === f.id
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 shadow'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Return Rate % */}
              <div className="pt-2 border-t border-slate-700/60">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-300">Expected Return Rate per {compFrequency}</label>
                  <span className="text-sm font-black text-emerald-400 font-mono">+{compReturnRate}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="30"
                  step="0.5"
                  value={compReturnRate}
                  onChange={(e) => setCompReturnRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex gap-1.5 mt-2">
                  {COMPOUNDING_RETURN_PRESETS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setCompReturnRate(r)}
                      className={`flex-1 py-1 text-xs font-bold rounded-lg border transition ${
                        compReturnRate === r
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {r}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration in Periods */}
              <div className="pt-2 border-t border-slate-700/60">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Compounding Duration ({compFrequency}s)
                  </label>
                  <span className="text-sm font-black text-white font-mono">{compDuration} {compFrequency}s</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="60"
                  step="1"
                  value={compDuration}
                  onChange={(e) => setCompDuration(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex gap-1.5 mt-2">
                  {[6, 12, 24, 36, 48].map((d) => (
                    <button
                      key={d}
                      onClick={() => setCompDuration(d)}
                      className={`flex-1 py-1 text-xs font-bold rounded-lg border transition ${
                        compDuration === d
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {d} {compFrequency === 'monthly' ? 'M' : (compFrequency === 'weekly' ? 'W' : 'D')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Goal Amount */}
              <div className="pt-2 border-t border-slate-700/60">
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Target Milestone Goal Amount</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={compTargetGoal || ''}
                    onChange={(e) => setCompTargetGoal(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                    placeholder="25000"
                  />
                </div>
              </div>

              {/* Periodic Contribution */}
              <div className="pt-2 border-t border-slate-700/60">
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Periodic Deposit / Contribution (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    {currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={compContribution || ''}
                    onChange={(e) => setCompContribution(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: COMPOUNDING OUTPUT CARDS & CURVE (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-4 shadow-lg">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Projected Balance</span>
                <div className="my-1">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                    {currencySymbol}{formatNumber(compoundingResults.finalBalance, 0)}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  After {compDuration} {compFrequency}s
                </span>
              </div>

              <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-4 shadow-lg">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Profit Earned</span>
                <div className="my-1">
                  <span className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
                    +{currencySymbol}{formatNumber(compoundingResults.totalProfit, 0)}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 font-bold font-mono">
                  +{compoundingResults.totalRoi.toFixed(1)}% Total ROI
                </span>
              </div>

              <div className="bg-[#1E293B] border border-slate-700/80 rounded-2xl p-4 shadow-lg">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Milestone</span>
                <div className="my-1">
                  {compoundingResults.goalHitPeriod ? (
                    <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                      {compFrequency === 'monthly' ? `Month ${compoundingResults.goalHitPeriod}` : `${compFrequency} ${compoundingResults.goalHitPeriod}`}
                    </span>
                  ) : (
                    <span className="text-lg font-black text-slate-400 leading-tight">
                      Not Reached Yet
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">
                  Goal: {currencySymbol}{formatNumber(compTargetGoal, 0)}
                </span>
              </div>
            </div>

            {/* Interactive Compounding Growth Curve Chart */}
            <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <TrendingUp size={18} className="text-blue-400" />
                    Projected Capital Compounding Curve
                  </h4>
                  <p className="text-xs text-slate-400">Exponential balance progression across periods</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTabTable('summary')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                      activeTabTable === 'summary' ? 'bg-blue-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Chart
                  </button>
                  <button
                    onClick={() => setActiveTabTable('table')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                      activeTabTable === 'table' ? 'bg-blue-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Table
                  </button>
                </div>
              </div>

              {activeTabTable === 'summary' ? (
                /* Visual SVG Compounding Line & Area Chart */
                <div className="relative w-full h-64 bg-slate-900/90 rounded-2xl p-4 border border-slate-800 flex flex-col justify-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                    {/* Grid */}
                    {[40, 80, 120, 160].map((y) => (
                      <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#334155" strokeDasharray="4 4" strokeWidth="0.8" opacity="0.6" />
                    ))}

                    {/* Target Line */}
                    {(() => {
                      const maxB = Math.max(compoundingResults.finalBalance, compTargetGoal * 1.05);
                      const targetY = 200 - (compTargetGoal / maxB) * 190;
                      if (targetY >= 0 && targetY <= 200) {
                        return (
                          <g>
                            <line x1="0" y1={targetY} x2="500" y2={targetY} stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="5 3" />
                            <text x="490" y={targetY - 5} fill="#F59E0B" fontSize="10" fontWeight="bold" textAnchor="end">
                              GOAL: {currencySymbol}{formatNumber(compTargetGoal, 0)}
                            </text>
                          </g>
                        );
                      }
                      return null;
                    })()}

                    {/* Area Gradient */}
                    <path
                      d={`M 0,200 ${compoundingResults.schedule
                        .map((s, idx) => {
                          const maxB = Math.max(compoundingResults.finalBalance, compTargetGoal * 1.05);
                          const x = ((idx + 1) / compoundingResults.schedule.length) * 500;
                          const y = 200 - (s.endBalance / maxB) * 190;
                          return `L ${x.toFixed(1)},${y.toFixed(1)}`;
                        })
                        .join(' ')} L 500,200 Z`}
                      fill="url(#compGradient)"
                      opacity="0.3"
                    />

                    {/* Curve Line */}
                    <path
                      d={`M 0,${200 - (compInitialCapital / Math.max(compoundingResults.finalBalance, compTargetGoal * 1.05)) * 190} ${compoundingResults.schedule
                        .map((s, idx) => {
                          const maxB = Math.max(compoundingResults.finalBalance, compTargetGoal * 1.05);
                          const x = ((idx + 1) / compoundingResults.schedule.length) * 500;
                          const y = 200 - (s.endBalance / maxB) * 190;
                          return `L ${x.toFixed(1)},${y.toFixed(1)}`;
                        })
                        .join(' ')}`}
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="3"
                    />

                    <defs>
                      <linearGradient id="compGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38BDF8" />
                        <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Axis labels */}
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2 border-t border-slate-800 pt-1">
                    <span>Start: {currencySymbol}{formatNumber(compInitialCapital, 0)}</span>
                    <span>Period {Math.round(compDuration / 2)}</span>
                    <span className="text-emerald-400 font-bold">End: {currencySymbol}{formatNumber(compoundingResults.finalBalance, 0)}</span>
                  </div>
                </div>
              ) : (
                /* Period Compounding Table */
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Month-by-month capital breakdown</span>
                    <button
                      onClick={handleExportCSV}
                      className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                    >
                      <FileSpreadsheet size={14} /> Export CSV
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto border border-slate-800 rounded-xl">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-900 sticky top-0 text-slate-400 uppercase text-[10px]">
                        <tr>
                          <th className="p-2.5">Period</th>
                          <th className="p-2.5">Start</th>
                          <th className="p-2.5">Profit</th>
                          <th className="p-2.5">End Balance</th>
                          <th className="p-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {compoundingResults.schedule.map((row) => (
                          <tr key={row.period} className="hover:bg-slate-800/50">
                            <td className="p-2.5 font-bold text-white">{row.period}</td>
                            <td className="p-2.5 text-slate-300">{currencySymbol}{formatNumber(row.startBalance, 0)}</td>
                            <td className="p-2.5 text-emerald-400">+{currencySymbol}{formatNumber(row.periodReturn, 0)}</td>
                            <td className="p-2.5 font-bold text-white">{currencySymbol}{formatNumber(row.endBalance, 0)}</td>
                            <td className="p-2.5">
                              {row.isGoalHit ? (
                                <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded text-[9px] font-black">
                                  GOAL HIT
                                </span>
                              ) : (
                                <span className="text-slate-500 text-[10px]">—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* CONVERSION CALL-TO-ACTION (CTA) FOOTER BANNER */}
      {/* --------------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl mb-12">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Zap size={14} /> Trading Psychology & Discipline Protocol
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Drawdown recovery starts with emotional discipline. Stop revenge trading.
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Log every setup, mental trigger, and RRR automatically with TradeJournal. Transform catastrophic drawdowns into controlled statistical variance.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => {
                if (onSignIn) onSignIn();
                else if (onBackToLanding) onBackToLanding();
              }}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/25 transition active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              Start Free Trial <ArrowRight size={16} />
            </button>
            <button
              onClick={handleCopySummary}
              className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-2xl border border-slate-700 transition active:scale-95 cursor-pointer"
            >
              Copy Roadmap
            </button>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* SEO EDUCATIONAL MASTER GUIDE & LONG-TAIL KEYWORD SECTIONS */}
      {/* --------------------------------------------------------------------- */}
      <div className="space-y-8 bg-[#1E293B]/70 border border-slate-800 rounded-3xl p-6 sm:p-10 text-slate-300 leading-relaxed shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <BookOpen size={16} /> Comprehensive Trader Field Manual
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Trading Drawdown Recovery: Mathematical Asymmetry & Risk Management
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Why 90% of retail equity, options, forex, and crypto traders fail to recover from drawdowns, and how to use the 1 to 2 risk reward drawdown recovery tool to mathematically preserve your trading edge.
          </p>
        </div>

        {/* Section 1: The Asymmetry Law */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Percent size={18} className="text-emerald-400" />
            1. The Non-Linear Math: How to Recover Trading Loss Percentage
          </h3>
          <p className="text-sm">
            Most novice traders believe that recovering a loss is symmetrical: that after losing 50%, a 50% gain will restore their account balance. This is a fatal mathematical fallacy.
          </p>
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-300">
            Required Gain Percentage = (Loss Percentage / (100 - Loss Percentage)) * 100
          </div>
          <p className="text-sm">
            For example, if you start with $10,000 and suffer a 50% drawdown, your equity is reduced to $5,000. To get back to your original $10,000, you must generate a profit of $5,000 on your new $5,000 base — which represents a <strong>+100% gain</strong>. At 70% drawdown, your hurdle explodes to <strong>+233.3%</strong>, and at 90% drawdown, you must achieve a <strong>+900% gain</strong> just to break even.
          </p>
        </div>

        {/* Section 2: Winning Trades Needed & 1 to 2 RRR */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Target size={18} className="text-blue-400" />
            2. Trading Loss Recovery Trades Needed Calculator & 1:2 RRR Protection
          </h3>
          <p className="text-sm">
            When in a drawdown, traders frequently commit two deadly sins:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 text-slate-300">
            <li><strong>Revenge Trading:</strong> Taking impulsive, low-quality trades immediately following a loss in an emotional bid to make the money back.</li>
            <li><strong>Position Sizing Blowup (Martingale):</strong> Increasing position size or leverage to recover the loss faster, accelerating account ruin.</li>
          </ul>
          <p className="text-sm">
            Our <strong>trading loss recovery trades needed calculator</strong> proves that maintaining a disciplined <strong>1 to 2 risk reward ratio</strong> combined with small, static risk (0.5% to 1% of current equity) allows an account to recover steadily over a series of high-probability setups without risking liquidation.
          </p>
        </div>

        {/* Section 3: Forex & Option Specific Drawdown Strategies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-400" />
              Forex Account Drawdown Recovery Calculator
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              In high-leverage Forex and Prop Firm environments (such as FTMO, FundedNext, and E8 Markets), daily drawdown limits (typically 4%–5%) require micro-lot position sizing. Keeping risk per trade at 0.5% gives you a 10-trade safety buffer before violating max daily loss thresholds.
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
              <Flame size={16} className="text-amber-400" />
              Option Trading Loss Recovery Plan Calculator
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Option buyers frequently suffer rapid theta decay and 30%–70% drawdowns. Recovering with out-of-the-money lotteries almost always triggers complete capital evaporation. Systematic debit spreads or mechanical delta-defined entries allow options traders to achieve 1:2 RRR targets with defined risk.
            </p>
          </div>
        </div>

        {/* FAQ ACCORDION SECTION */}
        <div className="pt-6 border-t border-slate-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <HelpCircle size={18} className="text-purple-400" />
            Frequently Asked Questions (Drawdown & Compounding FAQs)
          </h3>
          <div className="space-y-3">
            {[
              {
                q: 'What is the formula to calculate drawdown recovery percentage?',
                a: 'The formula is Required Gain % = (Loss % / (100 - Loss %)) * 100. It demonstrates that the recovery hurdle increases exponentially rather than linearly with every percentage point of drawdown.'
              },
              {
                q: 'How many winning trades do I need to recover from a 20% loss at 1:2 RRR?',
                a: 'If you risk 1% of your current equity per trade with a 1:2 Risk-to-Reward Ratio, each winning trade generates +2%. It takes approximately 12 to 13 consecutive winning trades, or roughly 24 to 28 total trades at a 50% strategy win rate, to recover fully.'
              },
              {
                q: 'Why does revenge trading destroy trading accounts during a drawdown?',
                a: 'Revenge trading is triggered by the brain\'s amygdala perceiving a financial loss as an existential threat. This causes cognitive tunnel vision, leading traders to abandon stop-losses, overleverage, and gamble on low-probability setups, which turns a temporary 10% drawdown into a permanent 80% account blowup.'
              },
              {
                q: 'How does this tool help with trading compounding goal tracking?',
                a: 'Mode 2 of this calculator models compound interest curves for trading accounts. It projects your future equity month-by-month based on realistic return rates (such as 3%–8% per month), helping traders understand that patience and consistent small gains build generational wealth faster than gambling on 100x moonshots.'
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

export default DrawdownRecoveryCalculatorScreen;
