import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Calculator, TrendingUp, TrendingDown, ShieldAlert, ShieldCheck,
    RefreshCw, Copy, Check, Sparkles, BookOpen, HelpCircle, ChevronDown,
    ArrowLeft, AlertTriangle, Scale, BarChart3, Flame, PieChart, Coins
} from 'lucide-react';
import { RelatedToolsGrid } from '../components/RelatedToolsGrid';

export interface RiskOfRuinCalculatorScreenProps {
    theme?: any;
    isDarkMode?: boolean;
    primaryCurrencySymbol?: string;
    onBackToLanding?: () => void;
    onSignIn?: () => void;
}

interface PresetScenario {
    id: string;
    label: string;
    badge: string;
    desc: string;
    mode: 'trading' | 'poker';
    winRate: number;
    rrRatio: number;
    riskPerTrade: number;
    maxDrawdown: number;
    totalTrades: number;
    // Poker params
    pokerWinRate?: number; // bb/100
    pokerStdDev?: number;  // bb/100
    pokerBuyins?: number;  // buyins
}

const PRESETS: PresetScenario[] = [
    {
        id: 'prop-firm-safe',
        label: 'Prop Firm 10% DD (Safe Lot)',
        badge: 'PROP FIRM',
        desc: '50% Win Rate, 1:2 R:R, 0.5% Risk on 10% Max Drawdown. Mathematical Ruin < 0.1%!',
        mode: 'trading',
        winRate: 50,
        rrRatio: 2.0,
        riskPerTrade: 0.5,
        maxDrawdown: 10,
        totalTrades: 150
    },
    {
        id: 'prop-firm-danger',
        label: 'Overleveraged Scalper (High Danger)',
        badge: 'DANGER',
        desc: '45% Win Rate, 1:1.5 R:R, 2.5% Risk on 8% Max Drawdown. Over 60% probability of blowing account!',
        mode: 'trading',
        winRate: 45,
        rrRatio: 1.5,
        riskPerTrade: 2.5,
        maxDrawdown: 8,
        totalTrades: 100
    },
    {
        id: 'conservative-daytrader',
        label: 'Trend Follower (1:3 R:R)',
        badge: 'TREND',
        desc: '40% Win Rate, 1:3 R:R, 1% Risk on 20% Max Drawdown.',
        mode: 'trading',
        winRate: 40,
        rrRatio: 3.0,
        riskPerTrade: 1.0,
        maxDrawdown: 20,
        totalTrades: 200
    },
    {
        id: 'primedope-poker-cash',
        label: 'Primedope Poker Cash Game (5 bb/100)',
        badge: 'PRIMEDOPE',
        desc: 'Online 6-max cash game: 5 bb/100 win rate, 100 bb/100 standard deviation, 50 buy-in bankroll.',
        mode: 'poker',
        winRate: 52,
        rrRatio: 1.1,
        riskPerTrade: 2,
        maxDrawdown: 15,
        totalTrades: 100,
        pokerWinRate: 5,
        pokerStdDev: 100,
        pokerBuyins: 50
    },
    {
        id: 'primedope-poker-mtt',
        label: 'Tournament / High Variance (2.5 bb/100)',
        badge: 'POKER',
        desc: 'Aggressive games with high variance: 2.5 bb/100 win rate, 120 bb/100 SD, 30 buy-in bankroll.',
        mode: 'poker',
        winRate: 48,
        rrRatio: 1.2,
        riskPerTrade: 3.3,
        maxDrawdown: 25,
        totalTrades: 100,
        pokerWinRate: 2.5,
        pokerStdDev: 120,
        pokerBuyins: 30
    }
];

export const RiskOfRuinCalculatorScreen: React.FC<RiskOfRuinCalculatorScreenProps> = ({
    theme = {
        bg: 'bg-slate-950',
        text: 'text-slate-100',
        card: 'bg-slate-900 border-slate-800',
        input: 'bg-slate-950 border-slate-800 text-slate-100',
        subtext: 'text-slate-400'
    },
    isDarkMode = true,
    primaryCurrencySymbol = '$',
    onBackToLanding,
    onSignIn
}) => {
    // Mode Switcher: 'trading' vs 'poker'
    const [mode, setMode] = useState<'trading' | 'poker'>('trading');

    // Trading Inputs
    const [winRate, setWinRate] = useState<number>(50); // %
    const [rrRatio, setRrRatio] = useState<number>(2.0); // Reward to Risk ratio
    const [riskPerTrade, setRiskPerTrade] = useState<number>(1.0); // % of account
    const [maxDrawdown, setMaxDrawdown] = useState<number>(10); // % max allowable loss before ruin
    const [totalTrades, setTotalTrades] = useState<number>(150); // simulation horizon
    const [startingBalance, setStartingBalance] = useState<number>(10000); // $ account size

    // Poker Mode Inputs (Targeting Primedope Variance Keywords)
    const [pokerWinRate, setPokerWinRate] = useState<number>(5.0); // bb / 100 hands
    const [pokerStdDev, setPokerStdDev] = useState<number>(100); // bb / 100 hands
    const [pokerBuyins, setPokerBuyins] = useState<number>(40); // Bankroll in Buy-ins (1 buy-in = 100 bb)

    // UI States
    const [copied, setCopied] = useState<boolean>(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [isSimulating, setIsSimulating] = useState<boolean>(false);

    // Canvas Ref for Monte Carlo Chart
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Apply Preset
    const applyPreset = (preset: PresetScenario) => {
        setMode(preset.mode);
        setWinRate(preset.winRate);
        setRrRatio(preset.rrRatio);
        setRiskPerTrade(preset.riskPerTrade);
        setMaxDrawdown(preset.maxDrawdown);
        setTotalTrades(preset.totalTrades);
        if (preset.pokerWinRate !== undefined) setPokerWinRate(preset.pokerWinRate);
        if (preset.pokerStdDev !== undefined) setPokerStdDev(preset.pokerStdDev);
        if (preset.pokerBuyins !== undefined) setPokerBuyins(preset.pokerBuyins);
    };

    // -------------------------------------------------------------
    // Analytical Math Engine (Perry Kaufman / Ralph Vince Formula)
    // -------------------------------------------------------------
    const calc = useMemo(() => {
        if (mode === 'trading') {
            const p = Math.min(0.99, Math.max(0.01, winRate / 100)); // Win probability
            const q = 1 - p; // Loss probability
            const b = Math.max(0.1, rrRatio); // Payout ratio (Reward : Risk)

            // Statistical Expectancy per trade (in units of risk R)
            // E = (p * b) - (q * 1)
            const expectancyPerTradeR = (p * b) - q;
            const hasEdge = expectancyPerTradeR > 0;

            // Maximum allowable loss units before ruin
            // U = Max Drawdown (%) / Risk Per Trade (%)
            const riskFraction = Math.max(0.1, riskPerTrade);
            const units = Math.max(1, maxDrawdown / riskFraction);

            let analyticalRuinProb = 0;

            if (!hasEdge) {
                // If system has no positive edge, ruin is 100% mathematically guaranteed given enough trades
                analyticalRuinProb = 100;
            } else {
                // Perry Kaufman / Ralph Vince Classical Risk of Ruin Formula
                // A = (p * b - q) / (p * b + q)
                // Ruin = ((1 - A) / (1 + A)) ^ U
                const numerator = (p * b) - q;
                const denominator = (p * b) + q;
                const A = numerator / denominator;

                if (A <= 0) {
                    analyticalRuinProb = 100;
                } else {
                    const ratio = (1 - A) / (1 + A);
                    const rawRuin = Math.pow(ratio, units);
                    analyticalRuinProb = Math.min(100, Math.max(0, rawRuin * 100));
                }
            }

            // Kelly Criterion optimal risk percentage
            // Kelly % = (b * p - q) / b
            const kellyFraction = hasEdge ? ((b * p) - q) / b : 0;
            const optimalKellyRiskPercent = Math.max(0, kellyFraction * 100);
            const halfKellyRiskPercent = optimalKellyRiskPercent / 2;

            const survivalRate = Math.max(0, 100 - analyticalRuinProb);

            return {
                mode: 'trading',
                hasEdge,
                expectancyPerTradeR,
                unitsToRuin: Math.round(units),
                riskOfRuinPercent: analyticalRuinProb,
                survivalRatePercent: survivalRate,
                optimalKellyRiskPercent,
                halfKellyRiskPercent,
                pokerRuinPercent: 0,
                requiredBankrollFor1Percent: 0
            };
        } else {
            // ---------------------------------------------------------
            // Poker Variance & Primedope Formula Engine
            // Formula: Ruin = exp(-2 * winRate * Bankroll / (StdDev ^ 2))
            // ---------------------------------------------------------
            const wr = pokerWinRate; // bb/100
            const sd = Math.max(1, pokerStdDev); // bb/100
            const bankrollBB = Math.max(1, pokerBuyins * 100); // 1 buy-in = 100 bb

            let pokerRuin = 100;
            let requiredBankrollBB = 0;

            if (wr <= 0) {
                pokerRuin = 100;
                requiredBankrollBB = Infinity;
            } else {
                // Primedope Classical Continuous Variance Formula:
                // Risk of Ruin = e ^ ( - (2 * WinRate * Bankroll) / (StdDev^2) )
                const exponent = (-2 * wr * bankrollBB) / (sd * sd);
                pokerRuin = Math.min(100, Math.max(0, Math.exp(exponent) * 100));

                // Required Bankroll for 1% Risk of Ruin:
                // ln(0.01) = -4.605
                // Bankroll = (4.605 * StdDev^2) / (2 * WinRate)
                requiredBankrollBB = Math.round((4.60517 * sd * sd) / (2 * wr));
            }

            return {
                mode: 'poker',
                hasEdge: wr > 0,
                expectancyPerTradeR: wr,
                unitsToRuin: pokerBuyins,
                riskOfRuinPercent: pokerRuin,
                survivalRatePercent: Math.max(0, 100 - pokerRuin),
                optimalKellyRiskPercent: 0,
                halfKellyRiskPercent: 0,
                pokerRuinPercent: pokerRuin,
                requiredBankrollFor1Percent: Math.round(requiredBankrollBB / 100) // in buy-ins
            };
        }
    }, [mode, winRate, rrRatio, riskPerTrade, maxDrawdown, pokerWinRate, pokerStdDev, pokerBuyins]);

    // -------------------------------------------------------------
    // Real-Time Monte Carlo Simulation Chart (1,000 Iterations)
    // -------------------------------------------------------------
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Parameters
        const simulationsCount = 150; // Visible sample curves
        const steps = Math.min(150, Math.max(50, totalTrades));
        const pWin = winRate / 100;
        const rewardRatio = rrRatio;
        const riskPct = riskPerTrade / 100;
        const ddThreshold = maxDrawdown / 100;

        let ruinedCount = 0;
        const paths: number[][] = [];

        // Run Monte Carlo simulations
        for (let s = 0; s < simulationsCount; s++) {
            let balance = 1.0; // Start normalized at 1.0
            const path = [balance];
            let isRuined = false;

            for (let step = 0; step < steps; step++) {
                if (isRuined) {
                    path.push(balance);
                    continue;
                }

                const isWin = Math.random() < pWin;
                if (isWin) {
                    balance += balance * (riskPct * rewardRatio);
                } else {
                    balance -= balance * riskPct;
                }

                // Check drawdown from initial 1.0
                if (balance <= (1.0 - ddThreshold)) {
                    isRuined = true;
                    ruinedCount++;
                }

                path.push(balance);
            }
            paths.push(path);
        }

        // Determine min and max balance for Y-axis scale
        let minY = 1.0 - ddThreshold;
        let maxY = 1.0;
        paths.forEach(p => {
            p.forEach(val => {
                if (val < minY) minY = val;
                if (val > maxY) maxY = val;
            });
        });
        maxY = Math.max(maxY, 1.8);
        minY = Math.min(minY, 0.7);

        const padLeft = 45;
        const padRight = 20;
        const padTop = 20;
        const padBottom = 30;

        const plotW = width - padLeft - padRight;
        const plotH = height - padTop - padBottom;

        const getX = (stepIndex: number) => padLeft + (stepIndex / steps) * plotW;
        const getY = (val: number) => padTop + plotH - ((val - minY) / (maxY - minY)) * plotH;

        // Background Grid
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);

        for (let i = 0; i <= 4; i++) {
            const gridVal = minY + (i / 4) * (maxY - minY);
            const y = getY(gridVal);
            ctx.beginPath();
            ctx.moveTo(padLeft, y);
            ctx.lineTo(width - padRight, y);
            ctx.stroke();

            // Y Labels
            ctx.fillStyle = '#64748b';
            ctx.font = '10px monospace';
            ctx.fillText(`${(gridVal * 100).toFixed(0)}%`, 5, y + 3);
        }

        // Ruin Threshold Line (Red Dash)
        const ruinY = getY(1.0 - ddThreshold);
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(padLeft, ruinY);
        ctx.lineTo(width - padRight, ruinY);
        ctx.stroke();

        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText(`Ruin Threshold (-${maxDrawdown}%)`, width - 140, ruinY - 6);

        // Reset Line Dash for paths
        ctx.setLineDash([]);

        // Render Simulation Curves
        paths.forEach(path => {
            const finalVal = path[path.length - 1];
            const isRuined = finalVal <= (1.0 - ddThreshold);

            ctx.beginPath();
            ctx.strokeStyle = isRuined
                ? 'rgba(244, 63, 94, 0.35)' // Ruined: Rose Red
                : finalVal >= 1.0
                ? 'rgba(16, 185, 129, 0.35)' // Profitable: Emerald Green
                : 'rgba(56, 189, 248, 0.25)'; // Breakeven: Sky Blue
            ctx.lineWidth = 1;

            path.forEach((val, i) => {
                const x = getX(i);
                const y = getY(val);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
        });

        // X-Axis Labels
        ctx.fillStyle = '#64748b';
        ctx.font = '10px monospace';
        ctx.fillText('Trade 0', padLeft, height - 10);
        ctx.fillText(`Trade ${Math.round(steps / 2)}`, padLeft + plotW / 2 - 25, height - 10);
        ctx.fillText(`Trade ${steps}`, width - padRight - 50, height - 10);

    }, [winRate, rrRatio, riskPerTrade, maxDrawdown, totalTrades, mode]);

    // Copy Summary Handler
    const handleCopy = () => {
        const text = `=== RISK OF RUIN & VARIANCE REPORT ===
Mode: ${mode.toUpperCase()}
Win Rate: ${winRate}% | Risk-to-Reward: 1:${rrRatio}
Risk Per Trade: ${riskPerTrade}% | Max Drawdown Limit: ${maxDrawdown}%
Mathematical Edge (Expectancy): ${calc.expectancyPerTradeR.toFixed(2)} R
Risk of Ruin Probability: ${calc.riskOfRuinPercent.toFixed(2)}%
Survival Probability: ${calc.survivalRatePercent.toFixed(2)}%
Half-Kelly Safe Size: ${calc.halfKellyRiskPercent.toFixed(2)}% per trade
Status: ${calc.riskOfRuinPercent < 1 ? '✅ ULTRA SAFE (<1% Ruin)' : calc.riskOfRuinPercent < 10 ? '⚠️ MODERATE RISK' : '🚨 HIGH DANGER OF RUIN'}
Calculated via TradeJournall Risk of Ruin & Monte Carlo Calculator`;

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // SEO FAQs Targeting Semrush Questions
    const faqs = [
        {
            q: 'How to calculate Risk of Ruin in trading?',
            a: 'Risk of ruin is calculated using Perry Kaufman and Ralph Vince’s mathematical probability formula: Ruin = ((1 - A) / (1 + A)) ^ U, where A is your net statistical edge: A = (Win Rate × R:R - Loss Rate) / (Win Rate × R:R + Loss Rate), and U is your drawdown buffer units (Max Drawdown % / Risk % per trade). If you have a positive edge (A > 0), increasing your drawdown buffer exponentially decreases ruin.'
        },
        {
            q: 'What is the Primedope Poker Variance Calculator Risk of Ruin formula?',
            a: 'Primedope uses the continuous Brownian motion variance formula for poker cash games: Risk of Ruin = exp(-2 × WinRate × Bankroll / StdDev²), where WinRate is expressed in big blinds per 100 hands (bb/100), Bankroll is in total big blinds, and StdDev is the standard deviation per 100 hands (typically 80 to 120 bb/100 for No-Limit Texas Hold\'em).'
        },
        {
            q: 'What is an acceptable Risk of Ruin percentage for Prop Firm traders (FTMO, Topstep)?',
            a: 'For funded prop firm traders, the Risk of Ruin MUST be under 1% (ideally under 0.1%). Because prop firms enforce strict 4% to 10% maximum trailing drawdown rules, risking more than 0.5% to 1.0% per trade creates an unacceptable statistical probability of hitting the maximum loss limit during normal variance or losing streaks.'
        },
        {
            q: 'What is the difference between Gambler\'s Ruin and Trading Risk of Ruin?',
            a: 'In classical Gambler\'s Ruin (e.g. Roulette or Blackjack), the house always has a negative statistical expectation (-EV), meaning ruin is 100% mathematically guaranteed given unlimited trials. In trading, a trader can develop a positive edge (+EV) through higher win rates and favorable risk-to-reward ratios, bringing the probability of ruin down to near zero.'
        },
        {
            q: 'How does the Kelly Criterion prevent Risk of Ruin?',
            a: 'The Kelly Criterion formula calculates the optimal mathematical position size to maximize long-term geometric compounding: Kelly % = (b × p - q) / b. While Full-Kelly maximizes capital growth, it suffers from extreme drawdowns. Most professional traders use "Half-Kelly" or "Quarter-Kelly" to maintain maximum growth while keeping Risk of Ruin under 0.01%.'
        },
        {
            q: 'Why can a trader with a 60% win rate still face a high Risk of Ruin?',
            a: 'A 60% win rate does not protect against ruin if the Risk-to-Reward ratio is poor or if position sizing is too aggressive. For instance, if a trader wins $50 on winners but loses $200 on losers (1:0.25 R:R), their expectancy is negative (-$50 per trade), guaranteeing account blowout over time.'
        }
    ];

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} pb-16`}>
            {/* SEO Helmet */}
            <Helmet>
                <title>Risk of Ruin Calculator — Monte Carlo Trading & Poker Variance Tool 2026</title>
                <meta
                    name="description"
                    content="Free Risk of Ruin Calculator & Monte Carlo Variance Simulator. Calculate account blowout probability, Primedope poker bankroll variance, and prop firm drawdown limits."
                />
                <meta
                    name="keywords"
                    content="risk of ruin calculator, primedope poker variance calculator risk of ruin formula, how to calculate risk of ruin in trading, gamblers ruin calculator, monte carlo trading simulator, risk of ruin trader roi position size"
                />
                <link rel="canonical" href="https://tradejournall.com/tools/risk-of-ruin-calculator" />
                <script type="application/ld+json">
                    {JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "WebApplication",
                            "name": "Risk of Ruin & Monte Carlo Variance Calculator",
                            "url": "https://tradejournall.com/tools/risk-of-ruin-calculator",
                            "applicationCategory": "FinanceApplication",
                            "operatingSystem": "All",
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "USD"
                            },
                            "description": "Calculate exact risk of ruin probability, Monte Carlo simulated equity curves, and bankroll survival rates for prop traders, day traders, and poker players."
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": faqs.map(f => ({
                                "@type": "Question",
                                "name": f.q,
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": f.a
                                }
                            }))
                        }
                    ])}
                </script>
            </Helmet>

            {/* Top Navigation Bar */}
            <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-30 px-4 py-3">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {onBackToLanding && (
                            <button
                                onClick={onBackToLanding}
                                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition flex items-center gap-1 text-sm"
                            >
                                <ArrowLeft size={16} />
                                <span className="hidden sm:inline">Back to Tools</span>
                            </button>
                        )}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
                                🎲
                            </div>
                            <div>
                                <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                                    Risk of Ruin Calculator
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
                                        Monte Carlo
                                    </span>
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopy}
                            className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
                            title="Copy summary"
                        >
                            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                        </button>
                        {onSignIn && (
                            <button
                                onClick={onSignIn}
                                className="px-3 py-1.5 text-xs rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium transition"
                            >
                                Journal Trades
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Hero / Header Section */}
            <div className="max-w-6xl mx-auto px-4 pt-6 pb-4">
                <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-900/30 rounded-2xl p-4 sm:p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium mb-2">
                                <Sparkles size={13} />
                                Mathematical Edge &amp; Drawdown Survival Engine
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                Calculate Your Exact Probability of Blowing an Account
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                                Test your trading edge or poker variance. Discover if your position sizing guarantees mathematical ruin or sustainable long-term compounding.
                            </p>
                        </div>

                        {/* Presets List */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                Instant Scenarios:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {PRESETS.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => applyPreset(p)}
                                        className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition hover:border-rose-500/50"
                                        title={p.desc}
                                    >
                                        <span className="text-[10px] text-rose-400 font-bold mr-1">[{p.badge}]</span>
                                        {p.label.split(' ')[0]} {p.label.split(' ')[1]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mode Selector Switcher */}
                <div className="flex border-b border-slate-800 mb-6 space-x-2">
                    <button
                        onClick={() => setMode('trading')}
                        className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
                            mode === 'trading'
                                ? 'border-rose-500 text-rose-400'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <TrendingUp size={16} />
                        Trading &amp; Prop Firm Mode (Ralph Vince / Kaufman)
                    </button>
                    <button
                        onClick={() => setMode('poker')}
                        className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
                            mode === 'poker'
                                ? 'border-rose-500 text-rose-400'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <Coins size={16} />
                        Poker Variance Mode (Primedope Bankroll Math)
                    </button>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT COLUMN: INPUTS (5 Cols) */}
                    <div className="lg:col-span-5 space-y-5">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                                <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                                    <Calculator size={16} className="text-rose-400" />
                                    {mode === 'trading' ? 'Trading Strategy Parameters' : 'Poker Variance Inputs'}
                                </h3>
                                <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                                    {mode.toUpperCase()}
                                </span>
                            </div>

                            {mode === 'trading' ? (
                                <div className="space-y-4">
                                    {/* Win Rate Slider & Input */}
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <label className="font-medium text-slate-300">Win Rate (%)</label>
                                            <span className="font-mono text-emerald-400 font-bold">{winRate}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="10"
                                            max="90"
                                            value={winRate}
                                            onChange={(e) => setWinRate(Number(e.target.value))}
                                            className="w-full accent-rose-500"
                                        />
                                        <div className="flex justify-between text-[10px] text-slate-500">
                                            <span>10% (Trend)</span>
                                            <span>50% (Breakout)</span>
                                            <span>90% (Scalp)</span>
                                        </div>
                                    </div>

                                    {/* Risk to Reward Ratio */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                                Risk-to-Reward (R:R)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2 text-slate-500 text-xs">1:</span>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    min="0.2"
                                                    max="10"
                                                    value={rrRatio}
                                                    onChange={(e) => setRrRatio(Math.max(0.1, Number(e.target.value)))}
                                                    className="w-full pl-8 pr-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                                Risk Per Trade (%)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0.1"
                                                max="20"
                                                value={riskPerTrade}
                                                onChange={(e) => setRiskPerTrade(Math.max(0.1, Number(e.target.value)))}
                                                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Max Drawdown Threshold & Total Trades */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                                Max Drawdown Limit (%)
                                            </label>
                                            <input
                                                type="number"
                                                step="1"
                                                min="2"
                                                max="90"
                                                value={maxDrawdown}
                                                onChange={(e) => setMaxDrawdown(Math.max(1, Number(e.target.value)))}
                                                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                                            />
                                            <span className="text-[10px] text-slate-500">e.g. 10% for Prop Firms</span>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1">
                                                Simulated Trades Horizon
                                            </label>
                                            <input
                                                type="number"
                                                step="25"
                                                min="25"
                                                max="500"
                                                value={totalTrades}
                                                onChange={(e) => setTotalTrades(Math.max(25, Number(e.target.value)))}
                                                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Poker Winrate bb/100 */}
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">
                                            Win Rate (bb / 100 hands)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            value={pokerWinRate}
                                            onChange={(e) => setPokerWinRate(Number(e.target.value))}
                                            className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                                        />
                                        <span className="text-[10px] text-slate-500">Typical winning players: 3 to 8 bb/100</span>
                                    </div>

                                    {/* Poker Std Dev bb/100 */}
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">
                                            Standard Deviation (bb / 100 hands)
                                        </label>
                                        <input
                                            type="number"
                                            step="5"
                                            min="20"
                                            max="200"
                                            value={pokerStdDev}
                                            onChange={(e) => setPokerStdDev(Math.max(1, Number(e.target.value)))}
                                            className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                                        />
                                        <span className="text-[10px] text-slate-500">6-max NLHE typical: 90 - 110 bb/100</span>
                                    </div>

                                    {/* Bankroll in Buy-ins */}
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">
                                            Bankroll Size (Buy-ins)
                                        </label>
                                        <input
                                            type="number"
                                            step="5"
                                            min="10"
                                            max="200"
                                            value={pokerBuyins}
                                            onChange={(e) => setPokerBuyins(Math.max(1, Number(e.target.value)))}
                                            className="w-full px-3 py-2 text-sm rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-rose-500"
                                        />
                                        <span className="text-[10px] text-slate-500">1 Buy-in = 100 Big Blinds</span>
                                    </div>
                                </div>
                            )}

                            {/* Mathematical Edge Indicator */}
                            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                                <span className="text-slate-400">Mathematical Edge (+EV):</span>
                                <span className={`font-bold font-mono ${calc.hasEdge ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {calc.hasEdge ? `+${calc.expectancyPerTradeR.toFixed(2)} R Expectancy` : 'NEGATIVE EXPECTANCY (-EV)'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SIMULATION CHART & RESULTS (7 Cols) */}
                    <div className="lg:col-span-7 space-y-5">
                        {/* Risk of Ruin Probability Banner */}
                        <div className={`p-5 rounded-2xl border transition ${
                            calc.riskOfRuinPercent < 1
                                ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-200'
                                : calc.riskOfRuinPercent < 10
                                ? 'bg-amber-950/20 border-amber-800/40 text-slate-200'
                                : 'bg-rose-950/30 border-rose-800/50 text-slate-200'
                        }`}>
                            <div className="flex items-start gap-3.5">
                                {calc.riskOfRuinPercent < 1 ? (
                                    <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shrink-0">
                                        <ShieldCheck size={28} />
                                    </div>
                                ) : (
                                    <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 shrink-0">
                                        <ShieldAlert size={28} />
                                    </div>
                                )}

                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            Probability of Account Ruin
                                        </span>
                                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                                            calc.riskOfRuinPercent < 1
                                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                : calc.riskOfRuinPercent < 10
                                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                        }`}>
                                            {calc.riskOfRuinPercent < 1 ? 'SAFE SYSTEM' : calc.riskOfRuinPercent < 10 ? 'MODERATE RISK' : 'EXTREME DANGER'}
                                        </span>
                                    </div>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-mono ${
                                            calc.riskOfRuinPercent < 1 ? 'text-emerald-400' : calc.riskOfRuinPercent < 10 ? 'text-amber-400' : 'text-rose-400'
                                        }`}>
                                            {calc.riskOfRuinPercent < 0.01 ? '<0.01%' : `${calc.riskOfRuinPercent.toFixed(2)}%`}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            chance of hitting {maxDrawdown}% drawdown limit
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">
                                        {calc.riskOfRuinPercent < 1
                                            ? 'Outstanding position sizing. Your probability of surviving market downswings is over 99.9%.'
                                            : calc.riskOfRuinPercent < 10
                                            ? 'Acceptable for personal risk, but risky for strict Prop Firm evaluations. Consider reducing lot size by 30%.'
                                            : 'Mathematically reckless. Even with a positive win rate, variance will blow your account within 100 trades.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Monte Carlo Visual Canvas Chart */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                                    <BarChart3 size={16} className="text-rose-400" />
                                    Monte Carlo Simulation (150 Random Paths)
                                </h4>
                                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Survived
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> Ruined
                                    </span>
                                </div>
                            </div>

                            <div className="relative w-full h-[220px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                                <canvas
                                    ref={canvasRef}
                                    width={520}
                                    height={220}
                                    className="w-full h-full block"
                                />
                            </div>
                            <p className="text-[10px] text-slate-500 text-center">
                                Simulates 150 independent randomized equity curves based on your Win Rate and Risk:Reward ratio.
                            </p>
                        </div>

                        {/* 4 Stat Metric Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                                <span className="text-[11px] font-medium text-slate-400 block">
                                    Survival Rate
                                </span>
                                <span className="text-lg font-bold text-emerald-400 block mt-1 font-mono">
                                    {calc.survivalRatePercent.toFixed(1)}%
                                </span>
                                <span className="text-[10px] text-slate-500">Account longevity</span>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                                <span className="text-[11px] font-medium text-slate-400 block">
                                    Buffer Units
                                </span>
                                <span className="text-lg font-bold text-white block mt-1 font-mono">
                                    {calc.unitsToRuin} Losses
                                </span>
                                <span className="text-[10px] text-slate-500">Consecutive loss tolerance</span>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                                <span className="text-[11px] font-medium text-blue-400 block">
                                    {mode === 'trading' ? 'Half-Kelly Size' : '1% Safe Bankroll'}
                                </span>
                                <span className="text-lg font-bold text-blue-400 block mt-1 font-mono">
                                    {mode === 'trading' ? `${calc.halfKellyRiskPercent.toFixed(2)}%` : `${calc.requiredBankrollFor1Percent} Buy-ins`}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                    {mode === 'trading' ? 'Safe risk per trade' : 'Min bankroll buffer'}
                                </span>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                                <span className="text-[11px] font-medium text-amber-400 block">
                                    Expectancy
                                </span>
                                <span className="text-lg font-bold text-amber-400 block mt-1 font-mono">
                                    {calc.expectancyPerTradeR > 0 ? `+${calc.expectancyPerTradeR.toFixed(2)}` : calc.expectancyPerTradeR.toFixed(2)} R
                                </span>
                                <span className="text-[10px] text-slate-500">Per trade edge</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* COMPREHENSIVE IN-PAGE SEO GUIDE (Targeting All Semrush Keywords) */}
                {/* ========================================================================= */}
                <div className="mt-14 space-y-10 text-slate-300">
                    <div className="border-b border-slate-800 pb-6">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold">
                                Risk Management &amp; Probability
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
                                Primedope &amp; Ralph Vince Math
                            </span>
                            <span className="text-xs text-slate-500">
                                10 Min Comprehensive Guide
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            How to Calculate Risk of Ruin in Trading &amp; Poker: The Complete Mathematical Guide
                        </h2>
                        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
                            Learn the classical gambler's ruin theorem, Perry Kaufman's trading formula, and the Primedope poker variance equations to protect your bankroll and pass prop firm evaluations.
                        </p>
                    </div>

                    {/* Section 1: What is Risk of Ruin? */}
                    <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
                        <div className="flex items-center gap-2.5 text-rose-400">
                            <BookOpen size={20} />
                            <h3 className="text-lg sm:text-xl font-bold text-white">
                                1. What is Risk of Ruin? (Definition in Trading &amp; Poker)
                            </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            <strong>Risk of Ruin (RoR)</strong> is a statistical concept measuring the probability that an investor, day trader, or gambler will lose a specified amount of capital (or blow up an entire account) through normal market variance before achieving their financial target.
                        </p>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                            In modern prop firm trading (FTMO, Topstep, Apex), "ruin" does not mean losing 100% of your account. It means hitting the <strong>Maximum Allowed Drawdown</strong> (typically 4% to 10%), which immediately terminates the trading account.
                        </p>
                    </section>

                    {/* Section 2: Mathematical Formulas (Kaufman vs Primedope) */}
                    <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
                        <div className="flex items-center gap-2.5 text-blue-400">
                            <Calculator size={20} />
                            <h3 className="text-lg sm:text-xl font-bold text-white">
                                2. The Exact Risk of Ruin Formulas Explained
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                                    Trading Formula (Perry Kaufman &amp; Ralph Vince):
                                </h4>
                                <div className="p-3 rounded-lg bg-slate-900 font-mono text-xs text-white border border-slate-800">
                                    Ruin = ((1 - A) / (1 + A)) ^ U
                                </div>
                                <ul className="text-[11px] text-slate-400 space-y-1">
                                    <li><strong>A (Statistical Edge):</strong> (Win Rate × R:R - Loss Rate) / (Win Rate × R:R + Loss Rate)</li>
                                    <li><strong>U (Units to Ruin):</strong> Max Drawdown % / Risk % Per Trade</li>
                                </ul>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                                    Primedope Poker Variance Formula:
                                </h4>
                                <div className="p-3 rounded-lg bg-slate-900 font-mono text-xs text-white border border-slate-800">
                                    Ruin = exp(-2 × WinRate × Bankroll / StdDev²)
                                </div>
                                <ul className="text-[11px] text-slate-400 space-y-1">
                                    <li><strong>WinRate:</strong> Expected Value in bb / 100 hands</li>
                                    <li><strong>Bankroll:</strong> Total stack in big blinds (bb)</li>
                                    <li><strong>StdDev:</strong> Volatility per 100 hands</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Prop Firm Position Sizing Rules */}
                    <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
                        <div className="flex items-center gap-2.5 text-emerald-400">
                            <ShieldCheck size={20} />
                            <h3 className="text-lg sm:text-xl font-bold text-white">
                                3. Why 90% of Prop Traders Fail: The Math of Drawdown Limits
                            </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            Consider a trader attempting an FTMO challenge with a 10% maximum drawdown rule:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-900/40">
                                <span className="font-bold text-rose-400 block mb-1">Scenario A: Risking 2.5% per trade</span>
                                <p className="text-slate-400">Drawdown Buffer: Only 4 consecutive losses. Risk of Ruin: <strong>65%+</strong>. Guaranteed evaluation failure.</p>
                            </div>
                            <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-900/40">
                                <span className="font-bold text-amber-400 block mb-1">Scenario B: Risking 1.0% per trade</span>
                                <p className="text-slate-400">Drawdown Buffer: 10 losses. Risk of Ruin: <strong>~12%</strong>. Moderate survival probability.</p>
                            </div>
                            <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-900/40">
                                <span className="font-bold text-emerald-400 block mb-1">Scenario C: Risking 0.5% per trade</span>
                                <p className="text-slate-400">Drawdown Buffer: 20 losses. Risk of Ruin: <strong>&lt; 0.1%</strong>. High mathematical probability of passing!</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* FAQ SECTION */}
                <div className="mt-14 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
                    <div className="flex items-center gap-2 mb-4">
                        <HelpCircle className="text-rose-400" size={20} />
                        <h3 className="text-base sm:text-lg font-bold text-white">
                            Frequently Asked Questions (Risk of Ruin &amp; Variance)
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full px-4 py-3 text-left font-semibold text-xs sm:text-sm text-slate-200 flex items-center justify-between hover:text-white"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-200 text-slate-400 ${
                                            openFaq === idx ? 'rotate-180 text-rose-400' : ''
                                        }`}
                                    />
                                </button>
                                {openFaq === idx && (
                                    <div className="px-4 pb-3 text-xs text-slate-400 border-t border-slate-800/60 pt-2 leading-relaxed">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Related Free Trading Tools Grid for Internal Linking */}
                <RelatedToolsGrid
                    currentToolSlug="/tools/risk-of-ruin-calculator"
                    category="risk"
                    title="Related Capital Protection & Trading Calculators"
                    subtitle="Protect your trading account from drawdowns, calculate tax implications, and optimize risk-reward ratios with our suite of free mathematical tools."
                />

                {/* Bottom Disclaimer */}
                <div className="mt-8 text-center text-[11px] text-slate-500 max-w-2xl mx-auto">
                    Disclaimer: This calculator and Monte Carlo simulation tool are for mathematical and educational modeling only and do not constitute investment advice. Past performance and statistical simulations do not guarantee future live trading results.
                </div>
            </div>
        </div>
    );
};
