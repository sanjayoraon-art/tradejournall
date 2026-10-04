import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Clock,
  Volume2,
  VolumeX,
  Flame,
  Zap,
  TrendingUp,
  Globe,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  ArrowLeft,
  SlidersHorizontal,
  ChevronDown,
  Info,
  Calendar,
  Sparkles,
  ExternalLink,
  HelpCircle,
  BarChart3,
  BookOpen,
  Target,
  Table,
  Layers,
  ShieldAlert,
  DollarSign,
  TrendingDown
} from 'lucide-react';

export interface SessionClockScreenProps {
  theme?: any;
  isDarkMode?: boolean;
  onBackToLanding?: () => void;
  onSignIn?: () => void;
  onNavigateToTools?: (toolRoute: string) => void;
}

export type AssetFilterId = 'all' | 'xauusd' | 'crypto' | 'fx_majors' | 'indices';

interface SessionConfig {
  id: string;
  name: string;
  region: string;
  exchanges: string;
  startHour: number; // 24-hr IST
  startMinute: number;
  endHour: number; // 24-hr IST
  endMinute: number;
  timeRangeDisplay: string; // e.g. "3:30 AM – 12:30 PM IST"
  crossesMidnight: boolean;
  keyAssets: string;
  highlightForAssets: AssetFilterId[];
}

// 4 Major World Sessions in IST (GMT +5:30)
const SESSIONS: SessionConfig[] = [
  {
    id: 'sydney',
    name: 'Sydney Session',
    region: 'Pacific Rim / Australasia',
    exchanges: 'ASX (Sydney), NZX (Wellington)',
    startHour: 3,
    startMinute: 30,
    endHour: 12,
    endMinute: 30,
    timeRangeDisplay: '3:30 AM – 12:30 PM IST',
    crossesMidnight: false,
    keyAssets: 'AUD/USD, NZD/USD, AUD/JPY, ASX 200',
    highlightForAssets: ['all']
  },
  {
    id: 'tokyo',
    name: 'Tokyo (Asian) Session',
    region: 'Asia-Pacific Core',
    exchanges: 'TSE (Tokyo), HKEX (Hong Kong), SGX (Singapore)',
    startHour: 5,
    startMinute: 30,
    endHour: 14,
    endMinute: 30,
    timeRangeDisplay: '5:30 AM – 2:30 PM IST',
    crossesMidnight: false,
    keyAssets: 'USD/JPY, Nikkei 225, AUD pairs, Early Asian Crypto Volatility',
    highlightForAssets: ['all', 'crypto']
  },
  {
    id: 'london',
    name: 'London (European) Session',
    region: 'Europe / Institutional Banking',
    exchanges: 'LSE (London), Deutsche Börse (Frankfurt), Euronext',
    startHour: 13,
    startMinute: 30,
    endHour: 22,
    endMinute: 30,
    timeRangeDisplay: '1:30 PM – 10:30 PM IST',
    crossesMidnight: false,
    keyAssets: 'EUR/USD, GBP/USD, DAX 40, FTSE 100, Gold (XAUUSD)',
    highlightForAssets: ['all', 'xauusd', 'fx_majors']
  },
  {
    id: 'new_york',
    name: 'New York (US) Session',
    region: 'North America / Wall Street',
    exchanges: 'NYSE, NASDAQ, CME Group, CBOE',
    startHour: 19,
    startMinute: 0,
    endHour: 3,
    endMinute: 30,
    timeRangeDisplay: '7:00 PM – 3:30 AM IST',
    crossesMidnight: true,
    keyAssets: 'Nasdaq 100, S&P 500, Gold (XAUUSD), BTC & ETH, Major FX Pairs',
    highlightForAssets: ['all', 'xauusd', 'crypto', 'fx_majors', 'indices']
  }
];

// Golden Volatility Overlap Window: 7:00 PM - 10:30 PM IST
const OVERLAP_CONFIG = {
  startHour: 19,
  startMinute: 0,
  endHour: 22,
  endMinute: 30,
  timeRangeDisplay: '7:00 PM – 10:30 PM IST',
  durationSeconds: 3.5 * 3600
};

// Play synthesized harmonic dual-chime using Web Audio API (Zero dependencies, offline-ready)
const playSessionOpenChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Harmonic bell note 1 (D5: 587.33 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.65);

    // Harmonic bell note 2 (A5: 880 Hz - fifth harmony for clarity)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.3, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.9);
  } catch (err) {
    console.warn('AudioContext playback error:', err);
  }
};

export const SessionClockScreen: React.FC<SessionClockScreenProps> = ({
  theme,
  isDarkMode = true,
  onBackToLanding,
  onSignIn,
  onNavigateToTools
}) => {
  // -------------------------------------------------------------------------
  // STATE MANAGEMENT
  // -------------------------------------------------------------------------
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [assetFilter, setAssetFilter] = useState<AssetFilterId>('all');
  const [soundAlert, setSoundAlert] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('tradejournal_session_clock_sound');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });
  const [copiedLink, setCopiedLink] = useState(false);
  const [audioTesting, setAudioTesting] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Store previous open status of each session to detect exact session open transitions
  const prevSessionStatusRef = useRef<Record<string, boolean>>({});

  // -------------------------------------------------------------------------
  // REAL-TIME CLOCK ENGINE (Ticks every 1,000ms)
  // -------------------------------------------------------------------------
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync sound setting to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tradejournal_session_clock_sound', String(soundAlert));
    } catch {
      // Ignore localStorage exceptions in private browsing
    }
  }, [soundAlert]);

  // -------------------------------------------------------------------------
  // TIME & TIMEZONE CALCULATIONS (IST: UTC + 5:30)
  // -------------------------------------------------------------------------
  const istInfo = useMemo(() => {
    // Exact IST 24-hr extraction via Intl (completely browser-timezone agnostic)
    const time24Formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    const [hStr, mStr, sStr] = time24Formatter.format(currentDate).split(':');
    const istHours = parseInt(hStr, 10);
    const istMinutes = parseInt(mStr, 10);
    const istSeconds = parseInt(sStr, 10);
    const totalDaySeconds = istHours * 3600 + istMinutes * 60 + istSeconds;

    // 12-hour AM/PM display
    const time12Formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    const time12String = time12Formatter.format(currentDate);

    // Full Date & Day in IST
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const dateString = dateFormatter.format(currentDate);

    // UTC time for reference
    const utcHours = String(currentDate.getUTCHours()).padStart(2, '0');
    const utcMins = String(currentDate.getUTCMinutes()).padStart(2, '0');
    const utcSecs = String(currentDate.getUTCSeconds()).padStart(2, '0');
    const utcString = `${utcHours}:${utcMins}:${utcSecs} UTC`;

    return {
      istHours,
      istMinutes,
      istSeconds,
      totalDaySeconds,
      time12String,
      dateString,
      utcString
    };
  }, [currentDate]);

  // Helper: Format remaining seconds into "01h 22m 10s"
  const formatCountdown = (sec: number): string => {
    const safeSec = Math.max(0, Math.floor(sec));
    const h = Math.floor(safeSec / 3600);
    const m = Math.floor((safeSec % 3600) / 60);
    const s = safeSec % 60;
    return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
  };

  // -------------------------------------------------------------------------
  // SESSION STATUS & PROGRESS CALCULATIONS
  // -------------------------------------------------------------------------
  const sessionStatuses = useMemo(() => {
    const curSec = istInfo.totalDaySeconds;

    return SESSIONS.map((sess) => {
      const startSec = sess.startHour * 3600 + sess.startMinute * 60;
      const endSec = sess.endHour * 3600 + sess.endMinute * 60;

      let isOpen = false;
      let progressPercent = 0;
      let secondsUntilClose = 0;
      let secondsUntilOpen = 0;
      let totalDurationSec = 0;

      if (!sess.crossesMidnight) {
        // Normal daytime window (e.g. Sydney 03:30 to 12:30)
        totalDurationSec = endSec - startSec;
        isOpen = curSec >= startSec && curSec < endSec;

        if (isOpen) {
          const elapsed = curSec - startSec;
          progressPercent = Math.min(100, Math.max(0, (elapsed / totalDurationSec) * 100));
          secondsUntilClose = endSec - curSec;
          secondsUntilOpen = 0;
        } else {
          progressPercent = 0;
          if (curSec < startSec) {
            secondsUntilOpen = startSec - curSec;
          } else {
            // After close, opens next morning
            secondsUntilOpen = 86400 - curSec + startSec;
          }
        }
      } else {
        // Crosses midnight window (e.g. New York 19:00 to 03:30)
        totalDurationSec = 86400 - startSec + endSec;
        isOpen = curSec >= startSec || curSec < endSec;

        if (isOpen) {
          let elapsed = 0;
          if (curSec >= startSec) {
            elapsed = curSec - startSec;
            secondsUntilClose = 86400 - curSec + endSec;
          } else {
            elapsed = 86400 - startSec + curSec;
            secondsUntilClose = endSec - curSec;
          }
          progressPercent = Math.min(100, Math.max(0, (elapsed / totalDurationSec) * 100));
          secondsUntilOpen = 0;
        } else {
          // Closed period is between 03:30 and 19:00
          progressPercent = 0;
          secondsUntilOpen = startSec - curSec;
        }
      }

      return {
        ...sess,
        isOpen,
        progressPercent: Math.round(progressPercent * 10) / 10,
        secondsUntilClose,
        secondsUntilOpen
      };
    });
  }, [istInfo.totalDaySeconds]);

  // -------------------------------------------------------------------------
  // GOLDEN VOLATILITY OVERLAP (London + New York: 7:00 PM – 10:30 PM IST)
  // -------------------------------------------------------------------------
  const overlapStatus = useMemo(() => {
    const curSec = istInfo.totalDaySeconds;
    const startSec = OVERLAP_CONFIG.startHour * 3600 + OVERLAP_CONFIG.startMinute * 60; // 68400 (19:00)
    const endSec = OVERLAP_CONFIG.endHour * 3600 + OVERLAP_CONFIG.endMinute * 60; // 81000 (22:30)
    const duration = OVERLAP_CONFIG.durationSeconds;

    const isActive = curSec >= startSec && curSec < endSec;

    let secondsUntilClose = 0;
    let secondsUntilOpen = 0;
    let progressPercent = 0;

    if (isActive) {
      const elapsed = curSec - startSec;
      progressPercent = Math.min(100, Math.max(0, (elapsed / duration) * 100));
      secondsUntilClose = endSec - curSec;
      secondsUntilOpen = 0;
    } else {
      progressPercent = 0;
      if (curSec < startSec) {
        secondsUntilOpen = startSec - curSec;
      } else {
        secondsUntilOpen = 86400 - curSec + startSec;
      }
    }

    // Determine next major session to open when outside overlap
    const closedSessions = sessionStatuses.filter((s) => !s.isOpen);
    let nextUpcomingSession = closedSessions.length > 0
      ? closedSessions.reduce((prev, curr) => (curr.secondsUntilOpen < prev.secondsUntilOpen ? curr : prev))
      : null;

    return {
      isActive,
      progressPercent: Math.round(progressPercent * 10) / 10,
      secondsUntilClose,
      secondsUntilOpen,
      nextUpcomingSession
    };
  }, [istInfo.totalDaySeconds, sessionStatuses]);

  // -------------------------------------------------------------------------
  // SESSION OPEN AUDIO ALERT DETECTOR
  // -------------------------------------------------------------------------
  useEffect(() => {
    const prev = prevSessionStatusRef.current;
    let openedSessionName: string | null = null;

    sessionStatuses.forEach((s) => {
      // If session was closed in the previous tick and is now open
      if (prev[s.id] === false && s.isOpen === true) {
        openedSessionName = s.name;
      }
      prev[s.id] = s.isOpen;
    });

    if (openedSessionName && soundAlert) {
      playSessionOpenChime();
    }
  }, [sessionStatuses, soundAlert]);

  // Test sound helper
  const handleTestChime = () => {
    setAudioTesting(true);
    playSessionOpenChime();
    setTimeout(() => setAudioTesting(false), 900);
  };

  // Copy shareable link
  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  // -------------------------------------------------------------------------
  // ASSET FILTER GUIDANCE CONTENT
  // -------------------------------------------------------------------------
  const assetGuidance = useMemo(() => {
    switch (assetFilter) {
      case 'xauusd':
        return {
          title: 'Gold (XAUUSD) Peak Volatility Window: 7:00 PM – 10:30 PM IST',
          tag: 'London + New York Overlap',
          badgeColor: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
          recommendation:
            'Peak liquidity and sharpest institutional breakouts occur during the London & New York session overlap. Key US economic data releases (CPI, Non-Farm Payrolls, PPI, Retail Sales) drop between 6:00 PM and 7:00 PM IST, setting up massive multi-dollar trend extensions.'
        };
      case 'crypto':
        return {
          title: 'BTC & Crypto High Volatility Session Clock IST: 6:30 PM – 1:30 AM IST',
          tag: 'US Cash Open & CME Derivatives Window',
          badgeColor: 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400',
          recommendation:
            'Although Bitcoin and Ethereum trade 24/7, over 65% of institutional spot ETF and CME futures volume executes when Wall Street opens at 7:00 PM / 8:00 PM IST. A secondary Asian volatility bounce takes place at 5:30 AM IST (Tokyo open).'
        };
      case 'fx_majors':
        return {
          title: 'EUR/USD & GBP/USD Prime Trading Hours in IST: 1:30 PM – 10:30 PM IST',
          tag: 'London + London/NY Overlap',
          badgeColor: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
          recommendation:
            'European currency pairs experience tightest bid-ask spreads and greatest institutional follow-through starting from London open (1:30 PM IST) through the explosive New York overlap (7:00 PM – 10:30 PM IST). Avoid trading major pairs during low-volume Asian hours.'
        };
      case 'indices':
        return {
          title: 'US Indices (Nasdaq 100 / S&P 500) Core Hours: 7:00 PM – 11:30 PM IST',
          tag: 'US Market Opening Bell in India Clock',
          badgeColor: 'border-purple-500/50 bg-purple-500/10 text-purple-400',
          recommendation:
            'The New York cash market opening bell rings at 7:00 PM IST (EDT) or 8:00 PM IST (EST). The opening 90 minutes represent the highest velocity moves of the day for Nasdaq futures and tech momentum stocks.'
        };
      default:
        return {
          title: 'Best Time to Trade Forex and Crypto in India: 7:00 PM – 10:30 PM IST',
          tag: 'Global Liquidity Confluence',
          badgeColor: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
          recommendation:
            'For Indian shift and night traders, the 7:00 PM – 10:30 PM IST window combines London banking liquidity with New York equity opening momentum. It offers the tightest broker spreads and cleanest price action across all major assets.'
        };
    }
  }, [assetFilter]);

  // -------------------------------------------------------------------------
  // SEO STRUCTURED DATA (JSON-LD)
  // -------------------------------------------------------------------------
  const schemaJson = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Shift & Night-Trader Session Volatility Clock (IST)',
        alternateName: 'Forex Market Session Hours in IST & US Market Open Time in India Clock',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web Application, iOS, Android',
        url: 'https://tradejournall.com/tools/session-clock-ist',
        image: 'https://tradejournall.com/logo.png',
        description:
          'Live interactive digital session clock in Indian Standard Time (IST) for forex, crypto, gold, and US stock traders. Features real-time visual progress bars for Sydney, Tokyo, London, and New York sessions, Golden Volatility Overlap highlights, and session open audio alerts.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        },
        featureList: [
          'Live Master Clock in IST (GMT +5:30) with 1-second precision',
          '4 Major World Session Progress Trackers (Sydney, Tokyo, London, New York in IST)',
          'Golden Volatility Overlap (7:00 PM – 10:30 PM IST) Active Zone Detection',
          'Live Web Audio Chime on Session Open',
          'Quick Asset Filter for Gold (XAUUSD), BTC Crypto, Forex Majors, and US Nasdaq Indices',
          'Ultra-Dark OLED Night Mode optimized for zero eye-strain'
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is the US market open time in India clock?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The US stock market (NYSE and NASDAQ) opens at 7:00 PM IST during US Daylight Saving Time (summer/fall) and 8:00 PM IST during standard winter time. The high-volatility New York forex and futures session commences at 7:00 PM IST and runs until 3:30 AM IST.'
            }
          },
          {
            '@type': 'Question',
            name: 'What are the forex market session hours in IST?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The four major global forex sessions in Indian Standard Time (IST, GMT+5:30) are: Sydney Session (3:30 AM – 12:30 PM IST), Tokyo Asian Session (5:30 AM – 2:30 PM IST), London European Session (1:30 PM – 10:30 PM IST), and New York US Session (7:00 PM – 3:30 AM IST).'
            }
          },
          {
            '@type': 'Question',
            name: 'What is the London New York overlap time IST?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The London and New York session overlap occurs between 7:00 PM and 10:30 PM IST. This 3.5-hour golden window accounts for over 70% of total daily global forex turnover and peak volume for Gold (XAUUSD) and US indices.'
            }
          },
          {
            '@type': 'Question',
            name: 'What is the best time to trade forex and crypto in India?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The best time to trade forex and crypto in India is between 7:00 PM and 10:30 PM IST during the London-New York overlap. For crypto, institutional trading volumes peak from 6:30 PM to 1:30 AM IST when US spot ETF flows and CME futures trade simultaneously.'
            }
          },
          {
            '@type': 'Question',
            name: 'How does the crypto high volatility session clock IST work?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'While crypto trades 24/7, high liquidity and directional breakout volume concentrate during the US market open (7:00 PM IST) and the Tokyo Asian morning open (5:30 AM IST).'
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
            name: 'Trading Tools',
            item: 'https://tradejournall.com/#tools'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Shift & Night-Trader Session Volatility Clock (IST)',
            item: 'https://tradejournall.com/tools/session-clock-ist'
          }
        ]
      }
    ]
  };

  const faqItems = [
    {
      q: 'What is the US market open time in India clock?',
      a: 'The US stock market (NYSE & NASDAQ) cash session opens at 7:00 PM IST (when Daylight Saving Time is active, mid-March to early November) and at 8:00 PM IST during US Standard Time. The broader New York forex and futures session begins at 7:00 PM IST and runs until 3:30 AM IST the next morning.'
    },
    {
      q: 'What are the forex market session hours in IST?',
      a: 'The 4 major global sessions in Indian Standard Time (IST, GMT +5:30) are:\n• Sydney Session: 3:30 AM – 12:30 PM IST\n• Tokyo (Asian) Session: 5:30 AM – 2:30 PM IST\n• London (European) Session: 1:30 PM – 10:30 PM IST\n• New York (US) Session: 7:00 PM – 3:30 AM IST'
    },
    {
      q: 'What is the London New York overlap time IST and why is it special?',
      a: 'The London and New York overlap spans from 7:00 PM IST to 10:30 PM IST (3.5 hours). This is the single most liquid window in global finance, accounting for over 70% of total daily forex turnover and generating the cleanest breakouts in Gold (XAUUSD), EUR/USD, GBP/USD, and Nasdaq futures.'
    },
    {
      q: 'What is the best time to trade forex and crypto in India?',
      a: 'For Indian night and shift traders, 7:00 PM to 10:30 PM IST offers the best risk-adjusted setups with tightest spreads, lowest slippage, and maximum trend continuity. For crypto traders, peak institutional volatility occurs between 6:30 PM and 1:30 AM IST during US cash market trading.'
    },
    {
      q: 'How does the crypto high volatility session clock IST work?',
      a: 'Even though blockchain markets run 24/7/365, retail and algorithmic volume alone produces low liquidity chop. High-volatility institutional expansion occurs when US ETF trading desks, CME futures, and Wall Street prop desks are active (7:00 PM to 1:30 AM IST).'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#090D16] text-[#F8FAFC] font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
      <Helmet>
        <title>Shift & Night-Trader Session Volatility Clock (IST) | US Market Open Time in India</title>
        <meta
          name="description"
          content="Fast, distraction-free live digital clock for Indian shift and night traders. Track London, New York, Tokyo and Sydney forex market session hours in IST, US market open time in India, and the Golden Volatility Overlap."
        />
        <meta
          name="keywords"
          content="us market open time in india clock, forex market session hours in ist, london new york overlap time ist, best time to trade forex and crypto in india, crypto high volatility session clock ist, xauusd trading hours ist, nasdaq opening time in india, night trader session clock"
        />
        <link rel="canonical" href="https://tradejournall.com/tools/session-clock-ist" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Shift & Night-Trader Session Volatility Clock (IST) - TradeJournal" />
        <meta
          property="og:description"
          content="Live market session hours in IST. Real-time visual progress bars for Sydney, Tokyo, London, and New York sessions with Golden Overlap alerts."
        />
        <meta property="og:url" content="https://tradejournall.com/tools/session-clock-ist" />
        <meta property="og:image" content="https://tradejournall.com/logo.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Shift & Night-Trader Session Volatility Clock (IST)" />
        <meta
          property="twitter:description"
          content="Keep this tab open all night without eye strain. Instant live IST clock, session countdowns, and sound alerts on market open."
        />
        <script type="application/ld+json">{JSON.stringify(schemaJson)}</script>
      </Helmet>

      {/* ----------------------------------------------------------------- */}
      {/* WRAPPER CONTAINER: Compact single-screen optimized desktop layout */}
      {/* ----------------------------------------------------------------- */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col min-h-screen justify-between gap-4">

        {/* TOP UTILITY HEADER */}
        <header className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            {onBackToLanding && (
              <button
                onClick={onBackToLanding}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold border border-slate-800 cursor-pointer"
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
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
                <Clock size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight text-white group-hover:text-emerald-400 transition">
                  TradeJournal<span className="text-emerald-400">.com</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Night-Trader Session Hub</span>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-2">
            {/* Live IST Sync Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>IST (GMT +5:30) Live</span>
            </div>

            {/* Sound Alert Toggle */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#161F30] border border-slate-700/80">
              <button
                onClick={() => setSoundAlert(!soundAlert)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  soundAlert
                    ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title="Toggle sound chime when any major market session opens"
              >
                {soundAlert ? <Volume2 size={14} /> : <VolumeX size={14} />}
                <span>Alerts: {soundAlert ? 'ON' : 'OFF'}</span>
              </button>

              {soundAlert && (
                <button
                  onClick={handleTestChime}
                  disabled={audioTesting}
                  className="px-2 py-1 rounded-md text-[11px] text-slate-300 hover:text-emerald-300 hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
                  title="Test session chime audio"
                >
                  {audioTesting ? 'Testing...' : 'Test'}
                </button>
              )}
            </div>

            {/* Share / Copy button */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-[#161F30] hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition cursor-pointer"
              title="Copy link to this tool"
            >
              {copiedLink ? <Check size={15} className="text-emerald-400" /> : <Share2 size={15} />}
            </button>
          </div>
        </header>

        {/* ----------------------------------------------------------------- */}
        {/* 1. LIVE MASTER CLOCK HEADER (IST Centric) */}
        {/* ----------------------------------------------------------------- */}
        <section className="p-4 sm:p-6 rounded-2xl bg-[#161F30] border border-slate-800 shadow-xl shadow-black/40 relative overflow-hidden">
          {/* Subtle ambient background glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
            {/* Title & SEO Keywords Microcopy */}
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-[11px] font-semibold mb-1.5">
                <Globe size={12} className="text-emerald-400" />
                <span>Shift & Night-Trader Session Volatility Clock (IST)</span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                US Market Open Time in India & Forex Session Clock
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Distraction-free, zero eye-strain live visual clock calibrated to Indian Standard Time (GMT +5:30).
              </p>
            </div>

            {/* Big Live Digital Clock Display */}
            <div className="flex flex-col items-center md:items-end">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-[0_0_20px_rgba(34,197,94,0.25)]">
                  {istInfo.time12String}
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                  IST
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mt-1">
                <span className="flex items-center gap-1 text-slate-300">
                  <Calendar size={13} className="text-slate-400" />
                  {istInfo.dateString}
                </span>
                <span>•</span>
                <span className="font-mono text-[11px] text-slate-400">{istInfo.utcString}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* 3. "GOLDEN VOLATILITY OVERLAP" HIGHLIGHT CARD */}
        {/* ----------------------------------------------------------------- */}
        <section
          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-500 relative overflow-hidden ${
            overlapStatus.isActive
              ? 'bg-gradient-to-r from-amber-950/40 via-[#161F30] to-emerald-950/40 border-amber-500/60 shadow-lg shadow-amber-500/10'
              : 'bg-[#161F30] border-slate-800/90'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div
                className={`p-3 rounded-xl border flex-shrink-0 ${
                  overlapStatus.isActive
                    ? 'bg-amber-500/20 border-amber-500 text-amber-400 animate-pulse'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400'
                }`}
              >
                <Flame size={24} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                    London + New York Overlap Time IST (7:00 PM – 10:30 PM)
                  </span>
                  {overlapStatus.isActive ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 animate-pulse">
                      ● Active Now
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                      Outside Overlap
                    </span>
                  )}
                </div>

                <h2 className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {overlapStatus.isActive ? (
                    <span className="text-amber-300 font-extrabold flex items-center gap-1.5">
                      🔥 GOLDEN VOLATILITY ZONE ACTIVE (Peak Volume for Gold, Forex &amp; US Stocks)
                    </span>
                  ) : (
                    <span className="text-slate-300 font-medium">
                      Next Major Surge:{' '}
                      <span className="text-white font-bold">
                        {overlapStatus.nextUpcomingSession
                          ? `${overlapStatus.nextUpcomingSession.name} opens in ${formatCountdown(
                              overlapStatus.nextUpcomingSession.secondsUntilOpen
                            )}`
                          : `Golden Overlap opens in ${formatCountdown(overlapStatus.secondsUntilOpen)}`}
                      </span>
                    </span>
                  )}
                </h2>

                <p className="text-[11px] text-slate-400 mt-0.5">
                  {overlapStatus.isActive
                    ? `Closes at 10:30 PM IST (${formatCountdown(overlapStatus.secondsUntilClose)} remaining). Maximum spread tightness and breakout momentum.`
                    : `Peak daily turnover window (accounts for over 70% of total world forex and gold trading volume).`}
                </p>
              </div>
            </div>

            {/* Overlap Progress Gauge or Countdown */}
            <div className="flex-shrink-0 w-full md:w-56 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-300 mb-1">
                <span>{overlapStatus.isActive ? 'Overlap Window' : 'Next Golden Overlap'}</span>
                <span className="font-mono font-bold text-amber-400">
                  {overlapStatus.isActive
                    ? `${overlapStatus.progressPercent}%`
                    : formatCountdown(overlapStatus.secondsUntilOpen)}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    overlapStatus.isActive
                      ? 'bg-gradient-to-r from-amber-500 to-emerald-400'
                      : 'bg-slate-700'
                  }`}
                  style={{ width: `${overlapStatus.isActive ? overlapStatus.progressPercent : 0}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* 4. QUICK ASSET DROPDOWN FILTER (Instant Guidance) */}
        {/* ----------------------------------------------------------------- */}
        <section className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <SlidersHorizontal size={14} className="text-emerald-400" />
              <span>Best Time to Trade Forex and Crypto in India (Quick Filter):</span>
            </div>

            {/* Asset Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Markets' },
                { id: 'xauusd', label: 'Gold (XAUUSD)' },
                { id: 'crypto', label: 'BTC / Crypto' },
                { id: 'fx_majors', label: 'EURUSD & GBPUSD' },
                { id: 'indices', label: 'US Indices (Nasdaq)' }
              ].map((btn) => {
                const active = assetFilter === btn.id;
                return (
                  <button
                    key={btn.id}
                    onClick={() => setAssetFilter(btn.id as AssetFilterId)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      active
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/20'
                        : 'bg-[#161F30] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Tactical Guidance Banner */}
          <div className="p-3 rounded-xl bg-[#161F30]/90 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{assetGuidance.title}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${assetGuidance.badgeColor}`}>
                  {assetGuidance.tag}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{assetGuidance.recommendation}</p>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* 2. ACTIVE SESSION VISUAL BAR PROGRESS TRACKERS (In IST) */}
        {/* ----------------------------------------------------------------- */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-semibold">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-emerald-400" />
              <span className="uppercase tracking-wider text-[11px] font-bold text-slate-300">
                Forex Market Session Hours in IST (World Session Trackers)
              </span>
            </div>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Auto-refreshes every second • Sound chime on open
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {sessionStatuses.map((sess) => {
              const isAssetTarget =
                assetFilter === 'all' || sess.highlightForAssets.includes(assetFilter);

              return (
                <div
                  key={sess.id}
                  className={`p-3 sm:p-3.5 rounded-xl transition-all duration-300 border ${
                    sess.isOpen
                      ? 'bg-[#161F30] border-emerald-500/40 shadow-sm shadow-emerald-500/5'
                      : 'bg-[#161F30]/70 border-slate-800/80'
                  } ${
                    isAssetTarget && assetFilter !== 'all'
                      ? 'ring-1 ring-amber-500/40'
                      : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    {/* Session Name & Hours */}
                    <div className="flex items-center gap-3">
                      {/* Status Indicator Dot */}
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          sess.isOpen
                            ? 'bg-[#22C55E] shadow-[0_0_8px_#22C55E] animate-pulse'
                            : 'bg-[#334155]'
                        }`}
                        title={sess.isOpen ? `${sess.name} is currently OPEN` : `${sess.name} is CLOSED`}
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white tracking-tight">{sess.name}</h3>
                          {sess.isOpen ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              OPEN
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
                              CLOSED
                            </span>
                          )}
                          {isAssetTarget && assetFilter !== 'all' && (
                            <span className="hidden md:inline px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              RECOMMENDED FOR {assetFilter.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">
                          <span className="text-slate-300 font-semibold">{sess.timeRangeDisplay}</span>
                          <span className="hidden sm:inline text-slate-500"> — {sess.exchanges}</span>
                        </p>
                      </div>
                    </div>

                    {/* Live Timing State */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between text-xs">
                      {sess.isOpen ? (
                        <div className="text-right">
                          <span className="text-[11px] text-slate-400">Closes in: </span>
                          <span className="font-mono font-bold text-emerald-400">
                            {formatCountdown(sess.secondsUntilClose)}
                          </span>
                        </div>
                      ) : (
                        <div className="text-right">
                          <span className="text-[11px] text-slate-400">Opens in: </span>
                          <span className="font-mono font-bold text-slate-300">
                            {formatCountdown(sess.secondsUntilOpen)}
                          </span>
                        </div>
                      )}
                      <span className="text-[10px] text-slate-500">
                        {sess.isOpen ? `${sess.progressPercent}% completed` : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Visual Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        sess.isOpen
                          ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 shadow-[0_0_10px_rgba(34,197,94,0.4)]'
                          : 'bg-[#334155]/40'
                      }`}
                      style={{
                        width: sess.isOpen ? `${sess.progressPercent}%` : '0%'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* CRYPTO HIGH VOLATILITY MICRO-BAR & INSIGHT */}
        {/* ----------------------------------------------------------------- */}
        <section className="p-3 rounded-xl bg-[#161F30]/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Zap size={15} className="text-cyan-400 flex-shrink-0" />
            <div>
              <span className="font-bold text-slate-200">Crypto High Volatility Session Clock IST: </span>
              <span className="text-slate-400">
                Peak derivative volume runs from <strong className="text-cyan-300">6:30 PM to 1:30 AM IST</strong> alongside US ETF &amp; CME futures order flow.
              </span>
            </div>
          </div>
          <button
            onClick={() => setAssetFilter('crypto')}
            className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition whitespace-nowrap cursor-pointer"
          >
            Filter Crypto &rarr;
          </button>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* 6. COMPREHENSIVE 1500+ WORD MASTER SEO EDUCATIONAL ARTICLE */}
        {/* ----------------------------------------------------------------- */}
        <article className="mt-4 p-5 sm:p-8 rounded-2xl bg-[#161F30]/90 border border-slate-800 text-slate-300 space-y-8 leading-relaxed shadow-xl">
          
          {/* Article Header */}
          <div className="border-b border-slate-800 pb-5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen size={14} />
              <span>Shift-Trader Institutional Field Guide (IST)</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Mastering Global Trading Sessions in Indian Standard Time (IST): The Ultimate Night-Trader Volatility Playbook
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              An exhaustive institutional guide for Indian retail traders, salaried shift workers, and prop firm aspirants. Understand exact <strong>forex market session hours in ist</strong>, master the <strong>london new york overlap time ist</strong>, navigate the true <strong>us market open time in india clock</strong>, and capture explosive momentum with our real-time <strong>crypto high volatility session clock ist</strong>.
            </p>
          </div>

          {/* Section 1: The Geography of Global Liquidity */}
          <section className="space-y-3">
            <h3 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
              <Globe size={18} className="text-emerald-400 flex-shrink-0" />
              <span>1. The Macro Geography of Global Liquidity: Why IST is the Ultimate Trading Sweet-Spot</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Unlike domestic equity markets such as the National Stock Exchange of India (NSE) or Bombay Stock Exchange (BSE), which trade strictly from 9:15 AM to 3:30 PM IST, the decentralized foreign exchange (Forex) and cryptocurrency markets never sleep. They operate on a seamless 24-hour relay race of global institutional order flow. When banks in Tokyo begin winding down, institutional desks in London and Frankfurt take over; as European trading desks approach their evening close, Wall Street powerhouses in New York unleash hundreds of billions of dollars into the order books.
            </p>
            <p className="text-xs sm:text-sm text-slate-300">
              For traders located in India, this continuous geographical rotation offers an extraordinary lifestyle advantage. Indian Standard Time (IST, GMT +5:30) places Indian traders right in the prime seat for high-velocity global moves. A software engineer, doctor, corporate analyst, or entrepreneur in Mumbai, Bengaluru, or Delhi can finish their regular day job and sit down at their terminal between <strong>7:00 PM and 10:30 PM IST</strong> to experience the absolute peak liquidity of the global financial universe.
            </p>
            <p className="text-xs sm:text-sm text-slate-300">
              However, taking advantage of this requires eliminating time-zone confusion. Calculating the difference between Greenwich Mean Time (GMT), Coordinated Universal Time (UTC), British Summer Time (BST), Eastern Daylight Time (EDT), and Eastern Standard Time (EST) while managing live risk often leads to costly execution mistakes. This is why our <strong>Shift &amp; Night-Trader Session Volatility Clock (IST)</strong> permanently synchronizes world market cycles to Indian Standard Time, giving you instant clarity in a single glance.
            </p>
          </section>

          {/* Section 2: Detailed Breakdown of 4 Major Sessions in IST */}
          <section className="space-y-4">
            <h3 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
              <Activity size={18} className="text-emerald-400 flex-shrink-0" />
              <span>2. Forex Market Session Hours in IST: Complete 4-Session Technical Breakdown</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Understanding when each major world financial hub opens and closes is critical because volatility, spread thickness, and false-breakout frequency directly depend on which banks and sovereign funds are active. Here is how the four major sessions unfold in Indian Standard Time:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sydney */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    Sydney Session (3:30 AM – 12:30 PM IST)
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">Moderate Volatility</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The trading day technically begins in Wellington and Sydney. This session represents the opening pulse of the Asia-Pacific region. Liquidity during early Sydney hours (3:30 AM – 5:30 AM IST) is relatively thin, resulting in wider spreads on European pairs like EUR/USD and GBP/USD. However, it provides early directional clues for the Australian Dollar (AUD), New Zealand Dollar (NZD), and Pacific commodities.
                </p>
                <div className="text-[11px] text-emerald-400 font-semibold">
                  Top Traded Pairs: AUD/USD, NZD/USD, AUD/JPY, ASX 200 Index.
                </div>
              </div>

              {/* Tokyo */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    Tokyo (Asian) Session (5:30 AM – 2:30 PM IST)
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">Consolidation &amp; Ranges</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  As the Tokyo Stock Exchange (TSE), Hong Kong Exchanges (HKEX), and Singapore (SGX) open, institutional volume surges. The Asian session is notorious for algorithmic range accumulation. The famous &ldquo;Asian Range&rdquo; established between 5:30 AM and 1:30 PM IST frequently acts as the baseline liquidity pool that London institutional market makers sweep later in the day.
                </p>
                <div className="text-[11px] text-cyan-400 font-semibold">
                  Top Traded Pairs: USD/JPY, EUR/JPY, Nikkei 225, Asian Crypto Flow.
                </div>
              </div>

              {/* London */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    London (European) Session (1:30 PM – 10:30 PM IST)
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">Massive Trend Inception</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  London is the historical capital of foreign exchange, processing more than 35% of all daily global currency transactions. When London and Frankfurt open between 1:30 PM and 2:30 PM IST, market spreads drop sharply to fractional pips. The first two hours often feature the &ldquo;Judas Swing&rdquo;&mdash;a deliberate liquidity hunt running Asian highs or lows before initiating the true high-volume trend of the day.
                </p>
                <div className="text-[11px] text-emerald-400 font-semibold">
                  Top Traded Pairs: EUR/USD, GBP/USD, DAX 40, FTSE 100, Gold (XAUUSD).
                </div>
              </div>

              {/* New York */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    New York (US) Session (7:00 PM – 3:30 AM IST)
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">Extreme Volatility Zone</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The heavyweight American session commands Wall Street, the New York Stock Exchange (NYSE), NASDAQ, and Chicago Mercantile Exchange (CME). Opening at 7:00 PM IST (8:00 PM during US winter time), the first 2.5 hours produce explosive price expansions. Because it crosses midnight in India, night traders must exercise strict discipline to avoid over-trading into the low-volume post-midnight hours.
                </p>
                <div className="text-[11px] text-amber-400 font-semibold">
                  Top Traded Pairs: Nasdaq 100, S&amp;P 500, Gold (XAUUSD), BTC/USD, USD Majors.
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: The Golden Volatility Overlap */}
          <section className="space-y-3">
            <h3 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
              <Flame size={18} className="text-amber-400 flex-shrink-0" />
              <span>3. The London New York Overlap Time IST (7:00 PM – 10:30 PM): The Holy Grail of Liquidity</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              If an Indian trader had only two hours a day to dedicate to the charts, the unquestioned period to trade is the <strong>london new york overlap time ist</strong> between <strong>7:00 PM and 10:30 PM IST</strong>. This 3.5-hour corridor represents the collision of the two largest financial centers on earth: London (the banking giant) and New York (the capital and equity powerhouse).
            </p>
            <p className="text-xs sm:text-sm text-slate-300">
              During this overlap, over <strong>70% of total daily global forex turnover</strong> and the largest volume spikes in Spot Gold (XAUUSD) and crude oil take place. Spreads reach their tightest levels of the 24-hour cycle, slippage is virtually non-existent on tier-1 brokers, and technical chart patterns experience their highest rates of follow-through.
            </p>
            
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/30 space-y-2">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Target size={14} /> Key Catalysts Operating During the 7:00 PM – 10:30 PM IST Overlap:
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-5">
                <li><strong>US High-Impact Economic Releases (6:00 PM – 7:30 PM IST):</strong> Non-Farm Payrolls (NFP), Consumer Price Index (CPI inflation), Producer Price Index (PPI), and Initial Jobless Claims drop right as the overlap begins, delivering 50-to-200 pip expansions in Gold and Forex within minutes.</li>
                <li><strong>The London 4:00 PM Fix (8:30 PM / 9:30 PM IST):</strong> Sovereign wealth funds, global mutual funds, and central banks execute massive multi-billion-dollar portfolio rebalancing orders against standardized benchmark prices.</li>
                <li><strong>US Cash Market Opening Bell:</strong> Wall Street opening liquidity at 7:00 PM / 8:00 PM IST triggers major institutional algorithmic sector rotations that cascade across equity indices and currency pairs.</li>
              </ul>
            </div>
          </section>

          {/* Section 4: US Market Open Time in India Clock & DST Navigating */}
          <section className="space-y-3">
            <h3 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
              <Clock size={18} className="text-emerald-400 flex-shrink-0" />
              <span>4. US Market Open Time in India Clock: Cracking the Daylight Saving Time (DST) Shift</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              One of the most persistent confusions among Indian equity and index futures traders is understanding the exact <strong>us market open time in india clock</strong>. Because the United States observes Daylight Saving Time (DST) while India remains steadfastly on UTC +5:30 all year round, the US stock market opening bell shifts by exactly 1 hour twice a year:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs font-black text-emerald-400 uppercase tracking-wider">Summer &amp; Autumn (EDT)</div>
                <div className="text-sm font-bold text-white mt-1">7:00 PM IST (Cash Open)</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Active from second Sunday in March to first Sunday in November. US regular cash trading runs 7:00 PM to 1:30 AM IST.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs font-black text-amber-400 uppercase tracking-wider">Winter &amp; Early Spring (EST)</div>
                <div className="text-sm font-bold text-white mt-1">8:00 PM IST (Cash Open)</div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Active from first Sunday in November to second Sunday in March. US regular cash trading runs 8:00 PM to 2:30 AM IST.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300">
              For active Nasdaq 100 (NQ), S&amp;P 500 (ES), and US tech stock momentum traders in India, the most lucrative window is the <strong>Initial Opening Range (first 90 minutes)</strong>: 7:00 PM to 8:30 PM IST (or 8:00 PM to 9:30 PM IST in winter). During this power window, institutional opening imbalances are filled, providing clean directional momentum before the midday lull sets in.
            </p>
          </section>

          {/* Section 5: Crypto High Volatility Session Clock IST */}
          <section className="space-y-3">
            <h3 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
              <Zap size={18} className="text-cyan-400 flex-shrink-0" />
              <span>5. Crypto High Volatility Session Clock IST: Debunking the 24/7 Blockchain Illusion</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Beginner cryptocurrency traders frequently fall into the trap of believing that because Bitcoin, Ethereum, and Solana trade 24 hours a day, 7 days a week, every hour offers equal profit opportunity. In reality, retail volume alone creates low-liquidity chop, jagged slippage, and erratic false breaks.
            </p>
            <p className="text-xs sm:text-sm text-slate-300">
              With the advent of US Spot Bitcoin &amp; Ethereum ETFs (managed by institutional giants like BlackRock, Fidelity, and Grayscale) alongside CME Bitcoin Futures, cryptocurrency price action has become deeply tethered to traditional Wall Street banking hours. Tracking our <strong>crypto high volatility session clock ist</strong> reveals that over <strong>65% of institutional directional volume</strong> concentrates between <strong>6:30 PM and 1:30 AM IST</strong>.
            </p>
            <p className="text-xs sm:text-sm text-slate-300">
              Secondary volatility expansions occur during the Tokyo Asian morning open (<strong>5:30 AM – 8:30 AM IST</strong>), when Korean and Japanese crypto exchanges open order books, and Asian derivatives desks rebalance perp leverage. If you want high-volume trend extensions and reliable breakout confirmation in crypto, align your execution window with Wall Street institutional cash hours.
            </p>
          </section>

          {/* Section 6: Comprehensive Comparison Table */}
          <section className="space-y-3">
            <h3 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
              <Table size={18} className="text-emerald-400 flex-shrink-0" />
              <span>6. Comprehensive World Session Comparison Matrix (Calibrated to IST)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Use this quick reference cheat sheet to compare liquidity, average pip movement, spread ratings, and ideal trading styles for all world sessions:
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/90 text-slate-300 border-b border-slate-800">
                    <th className="p-3 font-bold">Session Name</th>
                    <th className="p-3 font-bold">IST Hours</th>
                    <th className="p-3 font-bold">Volatility</th>
                    <th className="p-3 font-bold">Broker Spreads</th>
                    <th className="p-3 font-bold">Best Assets</th>
                    <th className="p-3 font-bold">Optimal Strategy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono text-[11px] text-slate-300">
                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-sans font-bold text-white">Sydney Session</td>
                    <td className="p-3 text-slate-400">03:30 AM – 12:30 PM</td>
                    <td className="p-3 text-amber-400 font-bold">Low (4/10)</td>
                    <td className="p-3 text-slate-400">Wide (except AUD)</td>
                    <td className="p-3">AUD/USD, NZD/USD</td>
                    <td className="p-3 font-sans">Range bounds, mean reversion</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-sans font-bold text-white">Tokyo (Asian)</td>
                    <td className="p-3 text-slate-400">05:30 AM – 02:30 PM</td>
                    <td className="p-3 text-cyan-400 font-bold">Medium (6/10)</td>
                    <td className="p-3 text-slate-300">Tight on JPY</td>
                    <td className="p-3">USD/JPY, Nikkei 225, BTC</td>
                    <td className="p-3 font-sans">Asian box range, liquidity levels</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-sans font-bold text-white">London (European)</td>
                    <td className="p-3 text-slate-400">01:30 PM – 10:30 PM</td>
                    <td className="p-3 text-emerald-400 font-bold">Very High (9/10)</td>
                    <td className="p-3 text-emerald-300">Ultra-Tight</td>
                    <td className="p-3">EUR/USD, GBP/USD, DAX</td>
                    <td className="p-3 font-sans">London open breakout, trend following</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-sans font-bold text-white">New York (US)</td>
                    <td className="p-3 text-slate-400">07:00 PM – 03:30 AM</td>
                    <td className="p-3 text-rose-400 font-bold">Extreme (10/10)</td>
                    <td className="p-3 text-emerald-300">Ultra-Tight</td>
                    <td className="p-3">Nasdaq, S&amp;P 500, Gold, BTC</td>
                    <td className="p-3 font-sans">Momentum expansion, ORB breakout</td>
                  </tr>
                  <tr className="bg-amber-500/10 hover:bg-amber-500/15 transition font-bold text-amber-300">
                    <td className="p-3 font-sans">🔥 Golden Overlap</td>
                    <td className="p-3 text-amber-400">07:00 PM – 10:30 PM</td>
                    <td className="p-3 text-amber-300">Peak Maximum (10/10)</td>
                    <td className="p-3 text-emerald-400">Lowest Spreads (0.0 - 0.2 pips)</td>
                    <td className="p-3 text-white">Gold (XAUUSD), EURUSD, NQ</td>
                    <td className="p-3 font-sans">High R:R Trend extensions, News play</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 7: Tactical Night-Trader Blueprint */}
          <section className="space-y-3">
            <h3 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
              <ShieldAlert size={18} className="text-emerald-400 flex-shrink-0" />
              <span>7. The Professional Evening Trading Routine for Indian Corporate Professionals</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Thousands of Indian traders attempt night trading while managing a high-stress day job, only to burn out within 90 days due to fatigue and poor trade selection. The difference between gambling into the night and operating like an institutional prop trader lies in having a structured evening operational routine:
            </p>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                <span className="font-mono font-bold text-emerald-400 flex-shrink-0">6:00 PM – 6:45 PM IST</span>
                <div>
                  <strong className="text-white">Pre-Market Chart Prep:</strong> Log out of your day job. Open your charts and mark the Asian High, Asian Low, and the London morning expansion high and low. Check the ForexFactory or economic calendar for US releases scheduled between 6:00 PM and 7:30 PM IST.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                <span className="font-mono font-bold text-amber-400 flex-shrink-0">7:00 PM – 9:30 PM IST</span>
                <div>
                  <strong className="text-white">Active Execution Window:</strong> As the New York opening bell rings and the Golden Overlap activates, wait for opening volatility to sweep liquidity and establish clear market structure. Execute maximum 1 or 2 high-probability setups with a strict pre-defined stop loss and at least 1:2 Risk-to-Reward Ratio (RRR).
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                <span className="font-mono font-bold text-cyan-400 flex-shrink-0">9:30 PM – 10:30 PM IST</span>
                <div>
                  <strong className="text-white">Trade Management &amp; London Close:</strong> Scale out profits or trail stops into break-even. As London desks close at 10:30 PM IST, liquidity thins out and chop increases.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                <span className="font-mono font-bold text-rose-400 flex-shrink-0">10:30 PM Onwards</span>
                <div>
                  <strong className="text-white">Hard Shutdown &amp; Trade Journaling:</strong> Close your charting platform completely. Log your trade details, screenshot, entry/exit reason, and psychological emotional state into <strong className="text-emerald-400">TradeJournal.com</strong>. Never sit in front of the charts past 11:00 PM IST hunting for &ldquo;boredom trades.&rdquo; Protect your capital and your circadian sleep rhythm.
                </div>
              </div>
            </div>
          </section>

          {/* Section 8: Night-Trader Sleep Hygiene and Psychology */}
          <section className="space-y-3">
            <h3 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400 flex-shrink-0" />
              <span>8. Circadian Rhythm, Sleep Hygiene &amp; The Psychology of Long-Term Consistency</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              The biggest silent account killer for Indian night traders is not a bad indicator or market manipulation&mdash;it is cognitive fatigue. Staring at bright, blinding white charting screens late into the night spikes cortisol, suppresses melatonin, and impairs the prefrontal cortex, which governs risk inhibition. This biological state triggers destructive revenge trading, lot size ballooning, and premature stop-loss removal.
            </p>
            <p className="text-xs sm:text-sm text-slate-300">
              Our <strong>Shift &amp; Night-Trader Session Volatility Clock (IST)</strong> is purposely designed with an ultra-dark OLED Black (`#090D16`) palette to minimize screen glare and eye fatigue during extended trading sessions. By pairing sound alerts with a structured trading journal like TradeJournal, you can confidently step away from the screen, execute with sniper-like discipline, and log off with your peace of mind and account equity intact.
            </p>
          </section>

        </article>

        {/* ----------------------------------------------------------------- */}
        {/* 7. SEO ACCORDION / LONG-TAIL KEYWORDS EXPANDER */}
        {/* ----------------------------------------------------------------- */}
        <section className="rounded-xl bg-[#161F30]/40 border border-slate-800/80 overflow-hidden">
          <button
            onClick={() => setActiveFaq(activeFaq === null ? 0 : null)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <HelpCircle size={14} className="text-emerald-400" />
              <span>Trader Knowledge Base: US Market Open Time in India &amp; Forex Session Hours in IST</span>
            </div>
            <ChevronDown
              size={14}
              className={`transform transition-transform duration-200 ${
                activeFaq !== null ? 'rotate-180 text-emerald-400' : ''
              }`}
            />
          </button>

          {activeFaq !== null && (
            <div className="px-4 pb-4 pt-1 space-y-3 text-xs border-t border-slate-800/80">
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
        {/* 5. CONVERSION CALL-TO-ACTION (CTA) FOOTER BAR */}
        {/* ----------------------------------------------------------------- */}
        <footer className="pt-2">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#161F30] to-cyan-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="space-y-0.5">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-emerald-400">
                <Sparkles size={14} />
                <span>Trade With Elite Execution Discipline</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Trading the night session? Log your setups and track your execution discipline automatically with TradeJournal.
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
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition duration-200 shadow-md shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5"
              >
                <span>Start Free Trial</span>
                <ExternalLink size={13} />
              </button>
            </div>
          </div>
          <div className="text-center py-2 text-[10px] text-slate-500">
            © {new Date().getFullYear()} TradeJournal.com • Shift &amp; Night-Trader Session Volatility Clock (IST) • All Rights Reserved.
          </div>
        </footer>

      </div>
    </div>
  );
};

export default SessionClockScreen;
