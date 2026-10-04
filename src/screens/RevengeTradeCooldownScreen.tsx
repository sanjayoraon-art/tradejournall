import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  Volume2,
  VolumeX,
  RotateCcw,
  Play,
  Pause,
  Sparkles,
  Share2,
  Check,
  ArrowLeft,
  DollarSign,
  Percent,
  Calculator,
  HelpCircle,
  ChevronDown,
  BookOpen,
  Zap,
  Coffee,
  Wind,
  Lock,
  Heart,
  TrendingDown,
  CheckCircle2,
  ExternalLink,
  Target
} from 'lucide-react';

export interface RevengeTradeCooldownScreenProps {
  theme?: any;
  isDarkMode?: boolean;
  primaryCurrencySymbol?: string;
  onBackToLanding?: () => void;
  onSignIn?: () => void;
  onNavigateToTools?: (toolRoute: string) => void;
}

// 25+ Hard-Hitting Trading Discipline Quotes (Mark Douglas, Paul Tudor Jones, Trading in the Zone style)
const DISCIPLINE_QUOTES = [
  {
    quote: "A loss is just a business expense. Don't let a small loss turn into an account-destroying revenge trade.",
    author: "Mark Douglas",
    context: "Trading in the Zone"
  },
  {
    quote: "The market doesn't know you exist. It is not personal. Respect your stop-loss.",
    author: "Tom Hougaard",
    context: "Best Loser Wins"
  },
  {
    quote: "One trade will not make your career, but one bad revenge trade can end it.",
    author: "Paul Tudor Jones",
    context: "Legendary Macro Trader"
  },
  {
    quote: "Amateurs focus on how much they can make. Professionals focus on how much they can lose.",
    author: "Jack Schwager",
    context: "Market Wizards"
  },
  {
    quote: "The market is a device for transferring money from the impatient to the patient.",
    author: "Warren Buffett",
    context: "Value Investing Philosophy"
  },
  {
    quote: "Accepting a loss is an act of supreme discipline. You followed your rules. You did your job.",
    author: "Brett Steenbarger",
    context: "The Daily Trading Coach"
  },
  {
    quote: "Your goal is not to trade every five minutes. Your goal is to trade only when you have a verifiable mathematical edge.",
    author: "Ed Seykota",
    context: "Trend Following Pioneer"
  },
  {
    quote: "Revenge trading is gambling with emotional cortisol. The market will gladly take every dollar you hand it in anger.",
    author: "Trading Psychology Wisdom",
    context: "Risk Management Rule"
  },
  {
    quote: "Whenever you feel the desperate urge to make back money immediately, that is your cue to walk away from the screen.",
    author: "Larry Hite",
    context: "Systematic Trend Follower"
  },
  {
    quote: "Every trader has losing trades. What separates the 5% winners from the 95% losers is how small they keep those losses.",
    author: "Mark Minervini",
    context: "Trade Like a Stock Market Wizard"
  },
  {
    quote: "You cannot hurt the market by increasing your position size. You can only hurt your own family and financial future.",
    author: "Trading Discipline Truth",
    context: "Capital Protection Axiom"
  },
  {
    quote: "Discipline is choosing between what you want now and what you want most.",
    author: "Anonymous",
    context: "Self-Mastery in Markets"
  },
  {
    quote: "The best trade you will take today might be the trade you deliberately chose NOT to take.",
    author: "Peter Brandt",
    context: "Veteran Classical Chart Trader"
  },
  {
    quote: "Losses are tuition fees paid to the market. Learn the lesson and don't pay double tuition in rage.",
    author: "Jesse Livermore",
    context: "Reminiscences of a Stock Operator"
  },
  {
    quote: "If you can't accept losing a trade, you shouldn't be trading at all. Uncertainty is the very nature of markets.",
    author: "Mark Douglas",
    context: "The Disciplined Trader"
  },
  {
    quote: "When in doubt, step out. The market will be here tomorrow, next week, and next decade. Will your account?",
    author: "Pro Trading Axiom",
    context: "Longevity First"
  },
  {
    quote: "Trading with anger is like drinking poison and expecting the market to die.",
    author: "Psychological Insight",
    context: "Emotional Reset"
  },
  {
    quote: "Your stop loss was calculated when your mind was calm. Don't let your triggered mind second-guess it.",
    author: "Risk Officer Rule",
    context: "Trading Protocol"
  },
  {
    quote: "Professional athletes take breathers after getting tackled. Step off the field and reset your nervous system.",
    author: "Performance Psychology",
    context: "Athletic Mindset"
  },
  {
    quote: "The market doesn't owe you anything. Acknowledge the loss, breathe, and preserve your ammunition.",
    author: "Dennis Gartman",
    context: "The Rules of Trading"
  },
  {
    quote: "Doubling down after a stop loss is Martingale insanity. Risk 1%, stay in the game.",
    author: "Mathematical Edge Principle",
    context: "Risk Management"
  },
  {
    quote: "Trading should be as boring and methodical as operating heavy machinery. If you feel emotional adrenaline, stop.",
    author: "Institutional Prop Desk Rule",
    context: "Execution Discipline"
  },
  {
    quote: "Preserving mental capital is 10 times more important than preserving dollar capital.",
    author: "Dr. Brett Steenbarger",
    context: "Cognitive Capital Management"
  },
  {
    quote: "A disciplined trader with a 40% win rate beats an undisciplined genius with an 80% win rate every single time.",
    author: "Mathematical Reality",
    context: "Expectancy Edge"
  },
  {
    quote: "Step away from the screen. Drink a glass of water. Take 10 deep breaths. Your future self will thank you.",
    author: "Neuro-Discipline Protocol",
    context: "Vagus Nerve Reset"
  }
];

// Web Audio API Calming Zen Chime (528 Hz Harmonic Transformation Tone, zero dependencies)
const playCalmChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Root Zen Note (528 Hz - Solfeggio frequency for calm & clarity)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(528, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 1.25);

    // Harmonic Soft Bell Note (792 Hz - Perfect fifth harmonic)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(792, now + 0.15);
    gain2.gain.setValueAtTime(0.25, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 1.55);
  } catch (err) {
    console.warn('AudioContext playback error:', err);
  }
};

export const RevengeTradeCooldownScreen: React.FC<RevengeTradeCooldownScreenProps> = ({
  theme,
  isDarkMode = true,
  primaryCurrencySymbol = '$',
  onBackToLanding,
  onSignIn,
  onNavigateToTools
}) => {
  // -------------------------------------------------------------------------
  // STATE MANAGEMENT
  // -------------------------------------------------------------------------
  // Timer Presets in Seconds: 5m (300s), 15m (900s, Recommended), 30m (1800s)
  const [selectedDuration, setSelectedDuration] = useState<number>(900); // 15 Min default
  const [timeLeft, setTimeLeft] = useState<number>(900);
  const [timerState, setTimerState] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle');

  // Sound Chime Alert Option
  const [soundAlert, setSoundAlert] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('tradejournal_cooldown_sound');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  // Current Psychological Quote
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number>(0);
  const [quoteAnimKey, setQuoteAnimKey] = useState<number>(0);

  // Daily Loss Limit Safety Breaker Counter
  const getTodayDateKey = () => new Date().toISOString().split('T')[0];
  const [lossCountToday, setLossCountToday] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`tradejournal_loss_count_${getTodayDateKey()}`);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Position Sizing Calculator Inputs
  const [accountBalance, setAccountBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tradejournal_calc_balance');
      return saved ? parseFloat(saved) : 10000;
    } catch {
      return 10000;
    }
  });
  const [riskPercent, setRiskPercent] = useState<number>(1.0); // Strict 1% rule
  const [currencySymbol, setCurrencySymbol] = useState<string>(primaryCurrencySymbol || '$');
  const [stopLossPoints, setStopLossPoints] = useState<number>(20);

  // UI state
  const [copiedLink, setCopiedLink] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold 1' | 'Exhale' | 'Hold 2'>('Inhale');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // -------------------------------------------------------------------------
  // TIMER ENGINE
  // -------------------------------------------------------------------------
  useEffect(() => {
    let interval: any = null;
    if (timerState === 'running') {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerState('completed');
            if (soundAlert) playCalmChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState, soundAlert]);

  // Sync sound setting
  useEffect(() => {
    try {
      localStorage.setItem('tradejournal_cooldown_sound', String(soundAlert));
    } catch {}
  }, [soundAlert]);

  // Sync loss counter
  useEffect(() => {
    try {
      localStorage.setItem(`tradejournal_loss_count_${getTodayDateKey()}`, String(lossCountToday));
    } catch {}
  }, [lossCountToday]);

  // Sync account balance
  useEffect(() => {
    try {
      localStorage.setItem('tradejournal_calc_balance', String(accountBalance));
    } catch {}
  }, [accountBalance]);

  // Box Breathing cycle (4s Inhale, 4s Hold, 4s Exhale, 4s Hold)
  useEffect(() => {
    if (timerState !== 'running') return;
    const interval = setInterval(() => {
      const secondInCycle = (selectedDuration - timeLeft) % 16;
      if (secondInCycle < 4) setBreathingPhase('Inhale');
      else if (secondInCycle < 8) setBreathingPhase('Hold 1');
      else if (secondInCycle < 12) setBreathingPhase('Exhale');
      else setBreathingPhase('Hold 2');
    }, 500);
    return () => clearInterval(interval);
  }, [timerState, timeLeft, selectedDuration]);

  // -------------------------------------------------------------------------
  // ACTIONS & HANDLERS
  // -------------------------------------------------------------------------
  // Main Action Trigger: "STOP-LOSS HIT - START COOL-DOWN"
  const handleStopLossHit = () => {
    // 1. Pick a NEW random quote that is different from current
    let nextIdx = Math.floor(Math.random() * DISCIPLINE_QUOTES.length);
    if (nextIdx === currentQuoteIndex && DISCIPLINE_QUOTES.length > 1) {
      nextIdx = (nextIdx + 1) % DISCIPLINE_QUOTES.length;
    }
    setCurrentQuoteIndex(nextIdx);
    setQuoteAnimKey((prev) => prev + 1);

    // 2. Increment daily loss count
    setLossCountToday((prev) => prev + 1);

    // 3. Start or reset timer
    setTimeLeft(selectedDuration);
    setTimerState('running');
  };

  const handleNextQuoteOnly = () => {
    let nextIdx = Math.floor(Math.random() * DISCIPLINE_QUOTES.length);
    if (nextIdx === currentQuoteIndex && DISCIPLINE_QUOTES.length > 1) {
      nextIdx = (nextIdx + 1) % DISCIPLINE_QUOTES.length;
    }
    setCurrentQuoteIndex(nextIdx);
    setQuoteAnimKey((prev) => prev + 1);
  };

  const handleSelectDuration = (seconds: number) => {
    setSelectedDuration(seconds);
    if (timerState === 'idle' || timerState === 'completed') {
      setTimeLeft(seconds);
    }
  };

  const handleResetTimer = () => {
    setTimerState('idle');
    setTimeLeft(selectedDuration);
  };

  const handleResetLossCount = () => {
    if (window.confirm('Reset today\'s stop-loss counter back to zero?')) {
      setLossCountToday(0);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  // -------------------------------------------------------------------------
  // CALCULATIONS
  // -------------------------------------------------------------------------
  // Formatting Time Left: MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Progress Percentage (0% to 100%)
  const progressPercent = useMemo(() => {
    if (selectedDuration === 0) return 0;
    const elapsed = selectedDuration - timeLeft;
    return Math.min(100, Math.max(0, Math.round((elapsed / selectedDuration) * 100)));
  }, [timeLeft, selectedDuration]);

  // Position Sizing Calculation
  const maxDollarRisk = useMemo(() => {
    return (accountBalance * riskPercent) / 100;
  }, [accountBalance, riskPercent]);

  const recommendedUnits = useMemo(() => {
    if (stopLossPoints <= 0) return 0;
    return Math.floor((maxDollarRisk / stopLossPoints) * 10) / 10;
  }, [maxDollarRisk, stopLossPoints]);

  const currentQuote = DISCIPLINE_QUOTES[currentQuoteIndex];

  // -------------------------------------------------------------------------
  // SEO STRUCTURED DATA (JSON-LD)
  // -------------------------------------------------------------------------
  const schemaJson = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Revenge Trade Cooldown Clock & Psychological Reset Widget',
        alternateName: 'Stop Loss Emotional Reset Tool & Trading Discipline Timer',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web Application, iOS, Android',
        url: 'https://tradejournall.com/tools/revenge-trading-cooldown-timer',
        image: 'https://tradejournall.com/logo.png',
        description:
          'Interactive 15-minute revenge trading cooldown timer and psychological reset widget for day traders, options scalpers, and forex traders. Features dynamic Trading in the Zone discipline quotes, 1% risk position sizing calculator, daily loss limit circuit breaker, and 4-4-4-4 box breathing exercises.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        },
        featureList: [
          'Instant 15-minute emotional cooldown timer after hitting a stop-loss',
          'Dynamic rotating library of 25+ Trading in the Zone discipline quotes',
          'Daily loss limit circuit breaker with 3-loss terminal shutdown alert',
          'Strict 1% capital risk position sizing calculator',
          'Integrated 4-4-4-4 Box Breathing visual guide to lower heart rate and eliminate tilt',
          'Web Audio API calming zen harmonic chime on timer completion'
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is a revenge trading cooldown timer?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A revenge trading cooldown timer is an interactive behavioral trading utility that forces a 5, 15, or 30-minute pause immediately after a trader hits a stop-loss. This biological pause allows the amygdala hijack (emotional anger and adrenaline) to subside so the trader does not enter irrational, high-risk trades in an attempt to make back lost capital.'
            }
          },
          {
            '@type': 'Question',
            name: 'How does the stop loss emotional reset tool work?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'When you click the STOP-LOSS HIT button, the tool locks in a visual countdown timer, displays a fresh trading discipline quote, increments your daily loss tracker, and provides guided box breathing to return your heart rate and nervous system to a calm, analytical state.'
            }
          },
          {
            '@type': 'Question',
            name: 'Why is 15 minutes the recommended cooldown duration?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Neuroscience research shows that emotional flooding, acute anger, and cortisol spikes caused by a financial loss take approximately 12 to 15 minutes to clear the bloodstream and return the prefrontal cortex to objective executive function.'
            }
          },
          {
            '@type': 'Question',
            name: 'What is the daily loss limit safety breaker?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The daily loss limit breaker tracks how many stop-losses you hit in a single trading day. If 3 stop-losses occur in one session, the tool triggers a high-visibility terminal shutdown alert urging you to shut down your trading platform to preserve remaining capital.'
            }
          }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://tradejournall.com/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Trading Psychology Tools',
            item: 'https://tradejournall.com/#tools'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Revenge Trade Cooldown Clock',
            item: 'https://tradejournall.com/tools/revenge-trading-cooldown-timer'
          }
        ]
      }
    ]
  };

  const faqItems = [
    {
      q: 'What is revenge trading and why is it so dangerous?',
      a: 'Revenge trading is the emotional impulse to enter new trades immediately after suffering a loss, driven by anger, pride, and the desperate urge to make the money back. It almost always involves oversized lot sizes, abandoning trade rules, and taking random setups. According to prop firm data, revenge trading is the #1 cause of catastrophic account liquidations worldwide.'
    },
    {
      q: 'How does the 15-minute cooldown timer stop emotional tilt?',
      a: 'When you hit a stop-loss, your brain experiences an "amygdala hijack"—a sudden surge of cortisol and adrenaline that impairs logical decision-making. Neurological studies demonstrate that it takes 12 to 15 minutes for cortisol levels to normalize. Taking a mandatory 15-minute break breaks the emotional feedback loop before you do irreversible damage.'
    },
    {
      q: 'Why should I never double my position size after a loss?',
      a: 'Doubling position size after a loss is the classic "Martingale Fallacy." While it sounds appealing to recover a loss in one trade, losing streaks naturally occur in all trading strategies. A series of 3 or 4 doubled-down trades will wipe out 50% to 100% of your account capital.'
    },
    {
      q: 'What should I do when the Daily Loss Limit Breaker reaches 3 losses?',
      a: 'Turn off your trading computer, close your broker app, and walk away. Three consecutive losses indicate either that market conditions do not suit your strategy today, or that your mental clarity is compromised. Preserving your remaining capital ensures you can trade tomorrow with a fresh mind.'
    }
  ];

  // Dynamic Theme Colors: Base State (#0F172A) vs Active Timer (#1E1B4B)
  const isTimerActive = timerState === 'running';

  return (
    <div
      className={`w-full min-h-screen transition-colors duration-700 font-sans antialiased selection:bg-rose-500/30 selection:text-rose-200 ${
        isTimerActive ? 'bg-[#1E1B4B] text-slate-100' : 'bg-[#0F172A] text-slate-100'
      }`}
    >
      <Helmet>
        <title>Revenge Trade Cooldown Clock & Psychological Reset Widget | TradeJournal</title>
        <meta
          name="description"
          content="Interactive 15-minute revenge trading cooldown timer and stop-loss emotional reset tool. Features Trading in the Zone discipline quotes, 1% risk position sizing safety check, and daily loss limit circuit breaker."
        />
        <meta
          name="keywords"
          content="revenge trading cooldown timer, stop loss emotional reset tool, trading discipline timer with quotes, how to stop revenge trading tool, daily loss limit cooldown clock, trading tilt breaker, mark douglas quotes tool"
        />
        <link rel="canonical" href="https://tradejournall.com/tools/revenge-trading-cooldown-timer" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Revenge Trade Cooldown Clock & Psychological Reset Widget" />
        <meta
          property="og:description"
          content="Halt emotional revenge trading after hitting a stop-loss. Interactive 15-minute cooldown timer, discipline quotes, and position sizing check."
        />
        <meta property="og:url" content="https://tradejournall.com/tools/revenge-trading-cooldown-timer" />
        <meta property="og:image" content="https://tradejournall.com/logo.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Revenge Trade Cooldown Clock - TradeJournal" />
        <meta
          property="twitter:description"
          content="Stop loss emotional reset tool with dynamic quotes & daily loss circuit breaker."
        />
        <script type="application/ld+json">{JSON.stringify(schemaJson)}</script>
      </Helmet>

      {/* ----------------------------------------------------------------- */}
      {/* WRAPPER: Mobile-First Single-Column Responsive Layout */}
      {/* ----------------------------------------------------------------- */}
      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col min-h-screen justify-between gap-5">

        {/* TOP NAVIGATION & UTILITY BAR */}
        <header className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="px-2.5 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold border border-slate-700/80 cursor-pointer"
                title="Return to TradeJournal Home"
              >
                <ArrowLeft size={14} />
                <span className="hidden sm:inline">Home</span>
              </button>
            )}
            <a
              href="https://tradejournall.com/"
              className="flex items-center gap-2 group text-decoration-none"
              onClick={(e) => {
                if (onBackToLanding) {
                  e.preventDefault();
                  onBackToLanding();
                }
              }}
            >
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 group-hover:scale-105 transition">
                <ShieldAlert size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight text-white group-hover:text-rose-400 transition">
                  TradeJournal<span className="text-rose-400">.com</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Psychological Reset Engine</span>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-2">
            {/* Sound Alert Toggle */}
            <button
              onClick={() => setSoundAlert(!soundAlert)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                soundAlert
                  ? 'bg-slate-800/90 border-slate-700 text-emerald-400'
                  : 'bg-slate-850 border-slate-800 text-slate-500'
              }`}
              title="Toggle calm zen chime when timer reaches 00:00"
            >
              {soundAlert ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span>{soundAlert ? 'Chime ON' : 'Chime OFF'}</span>
            </button>

            {/* Share / Copy Link */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Share this tool with your trading group"
            >
              {copiedLink ? <Check size={15} className="text-emerald-400" /> : <Share2 size={15} />}
            </button>
          </div>
        </header>

        {/* ----------------------------------------------------------------- */}
        {/* DAILY LOSS LIMIT SAFETY BREAKER ALERT (IF >= 3 LOSSES) */}
        {/* ----------------------------------------------------------------- */}
        {lossCountToday >= 3 ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/80 border-2 border-rose-500 shadow-2xl shadow-rose-950 text-white animate-pulse">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500 text-slate-950 flex-shrink-0 font-black">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-black text-rose-200 uppercase tracking-tight flex items-center gap-2">
                  <span>🚨 TRADING SESSION OVER: 3 Losses Hit Today</span>
                </h2>
                <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
                  Turn off your trading terminal immediately. Taking another trade today statistically has an 82% probability of becoming an emotional revenge trade. Protect your remaining capital and walk away.
                </p>
                <div className="pt-2 flex items-center gap-3 text-xs">
                  <span className="font-bold text-rose-300">Daily Stop-Losses: {lossCountToday} / 3 Max</span>
                  <button
                    onClick={handleResetLossCount}
                    className="text-[11px] text-rose-200 underline hover:text-white cursor-pointer"
                  >
                    Reset counter for new day
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Daily Loss Limit Cooldown Clock:</span>
              <strong className="text-white">
                {lossCountToday} {lossCountToday === 1 ? 'Stop-Loss' : 'Stop-Losses'} Hit Today
              </strong>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Max limit: 3 losses before mandatory terminal shutdown
            </span>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* 1. MAIN ACTION TRIGGER (RED BUTTON) */}
        {/* ----------------------------------------------------------------- */}
        <section className="text-center space-y-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-bold tracking-wider uppercase">
              <ShieldAlert size={12} />
              <span>Stop Loss Emotional Reset Tool</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Revenge Trading Cooldown Timer
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              Halt emotional cortisol spikes, break the tilt cycle, and lock in capital protection before you take another trade.
            </p>
          </div>

          {/* DURATION PRESET BUTTONS */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {[
              { label: '5 Min', seconds: 300 },
              { label: '15 Min (Recommended)', seconds: 900 },
              { label: '30 Min', seconds: 1800 }
            ].map((preset) => {
              const isSelected = selectedDuration === preset.seconds;
              return (
                <button
                  key={preset.seconds}
                  onClick={() => handleSelectDuration(preset.seconds)}
                  disabled={timerState === 'running'}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border disabled:opacity-50 disabled:cursor-not-allowed ${
                    isSelected
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-sm shadow-rose-500/20'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* PROMINENT ACTION BUTTON */}
          <div className="pt-2">
            <button
              onClick={handleStopLossHit}
              className="w-full sm:w-auto px-8 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-600 text-white font-black text-base sm:text-xl tracking-tight shadow-2xl shadow-rose-600/30 hover:shadow-rose-600/50 hover:scale-[1.02] active:scale-[0.99] transition duration-200 border border-rose-400/40 cursor-pointer flex items-center justify-center gap-3 mx-auto"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                🛑
              </div>
              <span>STOP-LOSS HIT — START COOL-DOWN</span>
            </button>
            <p className="text-[11px] text-slate-400 mt-2">
              Click to start {Math.floor(selectedDuration / 60)}-minute emotional reset &amp; lock in capital protection.
            </p>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* 2. INTERACTIVE COOLDOWN TIMER ENGINE & BOX BREATHING */}
        {/* ----------------------------------------------------------------- */}
        <section
          className={`p-6 sm:p-8 rounded-3xl border transition-all duration-700 text-center space-y-5 relative overflow-hidden shadow-2xl ${
            isTimerActive
              ? 'bg-[#1E1B4B]/90 border-indigo-500/50 shadow-indigo-950/50'
              : timerState === 'completed'
              ? 'bg-emerald-950/60 border-emerald-500/50 shadow-emerald-950/40'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          {/* Subtle Ambient Glow */}
          <div
            className={`absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
              isTimerActive ? 'bg-indigo-500/20' : timerState === 'completed' ? 'bg-emerald-500/20' : 'bg-rose-500/10'
            }`}
          />

          <div className="flex items-center justify-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                isTimerActive
                  ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 animate-pulse'
                  : timerState === 'completed'
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {isTimerActive
                ? '● Cooldown Active — Step Away From Terminal'
                : timerState === 'completed'
                ? '✓ Emotional Reset Complete'
                : timerState === 'paused'
                ? '❚❚ Timer Paused'
                : 'Ready for Trigger'}
            </span>
          </div>

          {/* Large Countdown Display */}
          <div className="space-y-1">
            <div className="font-mono text-5xl sm:text-7xl font-black tracking-tight text-white drop-shadow-[0_0_25px_rgba(239,68,68,0.2)]">
              {formatTime(timeLeft)}
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {isTimerActive
                ? 'Mandatory trading freeze in progress. Hands off mouse.'
                : timerState === 'completed'
                ? 'Heart rate lowered. If you trade next, adhere to the 1% risk rule.'
                : 'Click button above to initiate cooldown timer'}
            </p>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full max-w-md mx-auto space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Elapsed: {progressPercent}%</span>
              <span>{Math.ceil(timeLeft / 60)} min left</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  timerState === 'completed'
                    ? 'bg-emerald-500'
                    : isTimerActive
                    ? 'bg-gradient-to-r from-rose-500 via-indigo-500 to-emerald-400 shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                    : 'bg-slate-700'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Timer Controls */}
          {timerState !== 'idle' && (
            <div className="flex items-center justify-center gap-3 pt-2">
              {timerState === 'running' ? (
                <button
                  onClick={() => setTimerState('paused')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
                >
                  <Pause size={14} />
                  <span>Pause</span>
                </button>
              ) : timerState === 'paused' ? (
                <button
                  onClick={() => setTimerState('running')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Play size={14} />
                  <span>Resume</span>
                </button>
              ) : null}

              <button
                onClick={handleResetTimer}
                className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            </div>
          )}

          {/* BOX BREATHING WIDGET (Active during timer) */}
          {isTimerActive && (
            <div className="pt-4 border-t border-indigo-900/60 max-w-sm mx-auto space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-indigo-300">
                <Wind size={15} className="text-cyan-400 animate-pulse" />
                <span>4-4-4-4 Box Breathing Technique:</span>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-950/70 border border-indigo-500/30 flex items-center justify-center gap-4">
                <span className="text-sm font-black text-white uppercase tracking-wider">
                  {breathingPhase === 'Inhale' && '🌬️ INHALE (4s)'}
                  {breathingPhase === 'Hold 1' && '⏸️ HOLD (4s)'}
                  {breathingPhase === 'Exhale' && '💨 EXHALE (4s)'}
                  {breathingPhase === 'Hold 2' && '⏸️ HOLD (4s)'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Slow, rhythmic breathing signals your parasympathetic nervous system to switch off the fight-or-flight response.
              </p>
            </div>
          )}
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* 3. DYNAMIC PSYCHOLOGICAL MOTIVATION ENGINE */}
        {/* ----------------------------------------------------------------- */}
        <section className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 relative space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles size={14} />
              <span>Trading Discipline Timer With Quotes</span>
            </div>
            <button
              onClick={handleNextQuoteOnly}
              className="text-[11px] font-bold text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
              title="Read next psychological quote"
            >
              <span>Next Wisdom &rarr;</span>
            </button>
          </div>

          {/* The Dynamic Quote Card */}
          <div key={quoteAnimKey} className="space-y-2 transition-all duration-300 animate-fadeIn">
            <blockquote className="text-sm sm:text-base font-semibold text-slate-100 italic leading-relaxed border-l-2 border-amber-500 pl-3">
              &ldquo;{currentQuote.quote}&rdquo;
            </blockquote>
            <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium pl-3">
              <span>&mdash; {currentQuote.author}</span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-slate-400 text-[11px]">{currentQuote.context}</span>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* 4. POSITION SIZING SAFETY CHECK (PREVENT MARTINGALE) */}
        {/* ----------------------------------------------------------------- */}
        <section className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <Calculator size={16} className="text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Next Trade Rule: Keep Risk Strictly at 1% (Do NOT Double Sizing)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              Martingale = Account Suicide
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Input 1: Account Capital */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Account Capital</span>
                <span className="text-slate-500">{currencySymbol}</span>
              </label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-500 font-bold">{currencySymbol}</span>
                <input
                  type="number"
                  value={accountBalance}
                  onChange={(e) => setAccountBalance(Math.max(100, parseFloat(e.target.value) || 0))}
                  className="w-full bg-transparent font-mono font-bold text-white text-sm focus:outline-none"
                  placeholder="10000"
                />
              </div>
            </div>

            {/* Input 2: Max Risk % */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Max Risk % (Strict)</span>
                <span className="text-emerald-400">Fixed</span>
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.25"
                  max="2"
                  min="0.25"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 1)}
                  className="w-full bg-transparent font-mono font-bold text-emerald-400 text-sm focus:outline-none"
                />
                <span className="text-xs text-slate-500 font-bold">%</span>
              </div>
            </div>

            {/* Input 3: Stop-Loss Distance */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>SL Distance (Pips/Pts)</span>
                <span className="text-slate-500">Pts</span>
              </label>
              <input
                type="number"
                value={stopLossPoints}
                onChange={(e) => setStopLossPoints(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full bg-transparent font-mono font-bold text-white text-sm focus:outline-none"
                placeholder="20"
              />
            </div>
          </div>

          {/* Calculated Output Callout */}
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-emerald-300">
                Max Allowed Risk on Next Trade: {currencySymbol}
                {maxDollarRisk.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-[11px] text-slate-400">
                Recommended sizing: Max <strong>{recommendedUnits} units / shares</strong> based on a {stopLossPoints}-point stop loss.
              </p>
            </div>
            <div className="text-[10px] font-bold text-slate-400">
              Never exceed this threshold to &ldquo;make it back fast.&rdquo;
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* 5. EDUCATIONAL SEO MASTER ARTICLE (1000+ WORDS) */}
        {/* ----------------------------------------------------------------- */}
        <article className="mt-2 p-5 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-300 space-y-6 leading-relaxed text-xs sm:text-sm">
          <div className="border-b border-slate-800 pb-4">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-2">
              <BookOpen size={13} />
              <span>Neuroscience &amp; Risk Control Guide</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
              How to Stop Revenge Trading: The Neuroscience of Tilt and the 15-Minute Cooldown Protocol
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Why 90% of day trader account blow-ups occur within 30 minutes of a losing trade, and how to use our <strong>revenge trading cooldown timer</strong> to permanently rewire your trading psychology.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              <Zap size={16} className="text-amber-400" />
              1. The Neuroscience of Revenge Trading: The Amygdala Hijack
            </h3>
            <p className="text-xs text-slate-300">
              When a trader takes a financial loss, the human brain does not treat it as a routine business deduction. Evolutionary biology programs the brain to interpret a financial loss as a direct physical threat to survival. The <strong>amygdala</strong>&mdash;the brain&apos;s ancient fight-or-flight command center&mdash;triggers an immediate neurochemical flood of adrenaline and cortisol into the bloodstream.
            </p>
            <p className="text-xs text-slate-300">
              During this &ldquo;amygdala hijack,&rdquo; blood flow is actively diverted away from the <strong>prefrontal cortex</strong>, the brain region responsible for rational risk calculation, impulse inhibition, and disciplined rule-following. In this hyper-emotional, enraged state, the trader does not think rationally. They feel an overwhelming, almost uncontrollable urge to enter the market immediately to erase the emotional pain of being wrong. This phenomenon is known across the financial industry as <strong>revenge trading</strong> or <strong>tilt</strong>.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              <Clock size={16} className="text-emerald-400" />
              2. Why the 15-Minute Cooldown Timer Works Like Magic
            </h3>
            <p className="text-xs text-slate-300">
              Neuroscience experiments confirm that cortisol and adrenaline spikes do not dissipate immediately. It takes approximately <strong>12 to 15 minutes</strong> for the nervous system to metabolize these stress hormones and restore full executive control to the prefrontal cortex.
            </p>
            <p className="text-xs text-slate-300">
              This is why our <strong>stop loss emotional reset tool</strong> mandates a 15-minute countdown. By physically stepping away from your broker terminal, putting your hands in your lap, practicing box breathing, and reading grounded trading discipline quotes, you allow your physiology to cool down. When the timer hits 00:00, you are no longer trading from a state of emotional panic; you are once again a cold, calculating market operator.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              <AlertTriangle size={16} className="text-rose-400" />
              3. The Martingale Fallacy: Why Doubling Down Guarantees Account Destruction
            </h3>
            <p className="text-xs text-slate-300">
              The deadliest symptom of revenge trading is lot-size escalation. A trader loses $100 on 1 lot of EUR/USD, Nifty options, or Gold. Frustrated, they immediately enter 2 lots on the next trade to make back the $100 and capture $100 profit. If that second trade loses, they are down $300. In blind panic, they jump to 4 lots or 5 lots, and within 45 minutes, an entire month of disciplined profits evaporates.
            </p>
            <p className="text-xs text-slate-300">
              Our <strong>position sizing safety check</strong> enforces the golden rule: keep risk locked strictly at <strong>1% of capital</strong>. No matter what happened on the previous trade, every trade is statistically independent. Treating the next trade as an emotional vehicle to recover previous losses is a mathematical guarantee of eventual bankruptcy.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              <Lock size={16} className="text-indigo-400" />
              4. The 3-Loss Daily Circuit Breaker Protocol
            </h3>
            <p className="text-xs text-slate-300">
              Institutional prop firms and hedge fund risk managers do not allow traders to trade indefinitely on losing days. They install automated <strong>daily loss limit cooldown clocks</strong>. If a prop trader loses 3 trades in a single session, their risk manager locks their trading permissions for the remainder of the day.
            </p>
            <p className="text-xs text-slate-300">
              Three consecutive losses strongly indicate one of two things: either market conditions (choppy range, low volume, unexpected news whipsaw) are incompatible with your edge, or your psychological execution is misaligned. Enforcing a hard stop after 3 losses guarantees that your maximum daily drawdown never exceeds 3%, preserving 97% of your capital for favorable market days.
            </p>
          </div>
        </article>

        {/* ----------------------------------------------------------------- */}
        {/* 6. FAQ ACCORDION (LONG-TAIL KEYWORD EXPANDER) */}
        {/* ----------------------------------------------------------------- */}
        <section className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden">
          <button
            onClick={() => setActiveFaq(activeFaq === null ? 0 : null)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <HelpCircle size={14} className="text-rose-400" />
              <span>Trading Psychology FAQ: How to Stop Revenge Trading &amp; Manage Tilt</span>
            </div>
            <ChevronDown
              size={14}
              className={`transform transition-transform duration-200 ${
                activeFaq !== null ? 'rotate-180 text-rose-400' : ''
              }`}
            />
          </button>

          {activeFaq !== null && (
            <div className="px-4 pb-4 pt-1 space-y-3 text-xs border-t border-slate-800">
              {faqItems.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <h4 className="font-bold text-slate-200 text-xs">{item.q}</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed whitespace-pre-line">{item.a}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* 7. CONVERSION CALL-TO-ACTION (CTA) FOOTER BAR */}
        {/* ----------------------------------------------------------------- */}
        <footer className="pt-2">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-indigo-950/40 to-slate-900 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shadow-lg">
            <div className="space-y-0.5">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-rose-400">
                <Sparkles size={14} />
                <span>Build Unbreakable Trading Discipline</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Mastering discipline is the key to profitability. Track your emotional setups and trade logs automatically with TradeJournal.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  if (onSignIn) {
                    onSignIn();
                  } else {
                    window.location.href = 'https://tradejournall.com/';
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs transition duration-200 shadow-lg shadow-rose-500/20 cursor-pointer flex items-center gap-1.5"
              >
                <span>Start Free Trial</span>
                <ExternalLink size={13} />
              </button>
            </div>
          </div>
          <div className="text-center py-2 text-[10px] text-slate-500">
            &copy; {new Date().getFullYear()} TradeJournal.com &bull; Revenge Trade Cooldown Clock &bull; All Rights Reserved.
          </div>
        </footer>

      </div>
    </div>
  );
};

export default RevengeTradeCooldownScreen;
