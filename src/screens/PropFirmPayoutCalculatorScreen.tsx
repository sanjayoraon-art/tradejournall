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
  Info,
  CreditCard,
  Building2,
  Landmark,
  Sparkles
} from 'lucide-react';

export interface PropFirmPayoutCalculatorScreenProps {
  theme?: any;
  isDarkMode?: boolean;
  primaryCurrencySymbol?: string;
  onBackToLanding?: () => void;
  onSignIn?: () => void;
  onLogTrade?: (tradeData: { symbol: string; entryPrice: number; exitPrice: number; pnl: number; type: 'Long' | 'Short' }) => void;
}

// Prop Firm Presets
interface PropFirmPreset {
  name: string;
  defaultSplitPercent: number; // e.g. 90 = 90/10 split
  hasFirst10kBonus: boolean;   // e.g. Apex/Topstep 100% first $10k
  description: string;
}

const PROP_FIRM_PRESETS: PropFirmPreset[] = [
  { name: 'Apex Trader Funding', defaultSplitPercent: 90, hasFirst10kBonus: true, description: '100% First $10k, then 90/10 Split' },
  { name: 'Topstep', defaultSplitPercent: 90, hasFirst10kBonus: true, description: '100% First $10k, then 90/10 Split' },
  { name: 'FTMO Standard', defaultSplitPercent: 80, hasFirst10kBonus: false, description: '80/20 Standard (90/10 Scaling)' },
  { name: 'FundedNext', defaultSplitPercent: 90, hasFirst10kBonus: false, description: '90/10 Standard Split' },
  { name: 'Funding Pips', defaultSplitPercent: 80, hasFirst10kBonus: false, description: '80/20 to 90/10 Scaling' },
  { name: 'Custom Prop Firm', defaultSplitPercent: 80, hasFirst10kBonus: false, description: 'Custom Split Ratio' },
];

// Payout Method Presets
interface PayoutMethodPreset {
  name: string;
  type: 'percent' | 'flat';
  value: number;
  description: string;
}

const PAYOUT_METHODS: PayoutMethodPreset[] = [
  { name: 'Deel / Rise', type: 'percent', value: 1.5, description: '1.5% Withdrawal & Currency Conversion Fee' },
  { name: 'Crypto (USDT / LTC)', type: 'flat', value: 10, description: '$10 Flat Network Gas Fee' },
  { name: 'Bank Wire (SWIFT)', type: 'flat', value: 35, description: '$35 Flat Bank Wire Fee' },
  { name: 'Zero Fee', type: 'flat', value: 0, description: 'Direct Free Transfer' },
];

// Country Tax Presets
interface CountryTaxPreset {
  name: string;
  taxRatePercent: number;
  description: string;
}

const COUNTRY_TAXES: CountryTaxPreset[] = [
  { name: 'United States (1099)', taxRatePercent: 15.3, description: 'Self-Employment Tax (~15.3% Federal + State)' },
  { name: 'United Kingdom', taxRatePercent: 20, description: 'Self-Assessment Income Tax (~20%)' },
  { name: 'Dubai / UAE', taxRatePercent: 0, description: '0% Personal Income Tax' },
  { name: 'India (VDA / Income)', taxRatePercent: 30, description: '30% Capital Gains / Income Tax' },
  { name: 'Custom Tax', taxRatePercent: 15, description: 'Custom Tax Percentage' },
];

export const PropFirmPayoutCalculatorScreen: React.FC<PropFirmPayoutCalculatorScreenProps> = ({
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
  const [selectedFirm, setSelectedFirm] = useState<string>('Apex Trader Funding');
  const [grossProfitUsd, setGrossProfitUsd] = useState<number>(12000);
  const [traderSplitPercent, setTraderSplitPercent] = useState<number>(90);
  const [applyFirst10kBonus, setApplyFirst10kBonus] = useState<boolean>(true);
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState<string>('Deel / Rise');
  const [transferFeeValue, setTransferFeeValue] = useState<number>(1.5);
  const [transferFeeType, setTransferFeeType] = useState<'percent' | 'flat'>('percent');
  const [selectedCountry, setSelectedCountry] = useState<string>('United States (1099)');
  const [taxRatePercent, setTaxRatePercent] = useState<number>(15.3);
  const [copied, setCopied] = useState<boolean>(false);

  // Handle Preset Changes
  const handleFirmSelect = (preset: PropFirmPreset) => {
    setSelectedFirm(preset.name);
    setTraderSplitPercent(preset.defaultSplitPercent);
    setApplyFirst10kBonus(preset.hasFirst10kBonus);
  };

  const handleMethodSelect = (method: PayoutMethodPreset) => {
    setSelectedPayoutMethod(method.name);
    setTransferFeeType(method.type);
    setTransferFeeValue(method.value);
  };

  const handleCountrySelect = (tax: CountryTaxPreset) => {
    setSelectedCountry(tax.name);
    setTaxRatePercent(tax.taxRatePercent);
  };

  // ---------------------------------------------------------------------------
  // MATHEMATICAL CALCULATIONS
  // ---------------------------------------------------------------------------
  const results = useMemo(() => {
    // 1. Calculate Trader Gross Share ($)
    let traderGrossShare = 0;
    let propFirmShare = 0;

    if (applyFirst10kBonus) {
      // First $10,000 gets 100% split
      const bonusTierProfit = Math.min(grossProfitUsd, 10000);
      const remainingProfit = Math.max(0, grossProfitUsd - 10000);

      const traderBonusShare = bonusTierProfit * 1.0; // 100%
      const traderRemainingShare = remainingProfit * (traderSplitPercent / 100);

      traderGrossShare = traderBonusShare + traderRemainingShare;
      propFirmShare = grossProfitUsd - traderGrossShare;
    } else {
      traderGrossShare = grossProfitUsd * (traderSplitPercent / 100);
      propFirmShare = grossProfitUsd - traderGrossShare;
    }

    // 2. Transfer / Payout Fee ($)
    let transferFeeUsd = 0;
    if (transferFeeType === 'percent') {
      transferFeeUsd = traderGrossShare * (transferFeeValue / 100);
    } else {
      transferFeeUsd = transferFeeValue;
    }

    // 3. Net Payout Received Before Tax ($)
    const netPayoutReceivedUsd = Math.max(0, traderGrossShare - transferFeeUsd);

    // 4. Tax Deduction ($)
    const taxDeductionUsd = netPayoutReceivedUsd * (taxRatePercent / 100);

    // 5. FINAL IN-HAND NET CASH IN BANK ($)
    const finalInHandNetCashUsd = Math.max(0, netPayoutReceivedUsd - taxDeductionUsd);

    // 6. Net Retention Percentage (%)
    const netRetentionPercent = grossProfitUsd > 0 ? (finalInHandNetCashUsd / grossProfitUsd) * 100 : 0;
    const totalDeductionsUsd = grossProfitUsd - finalInHandNetCashUsd;

    // 7. Risk / Retention Status Classification
    let retentionLevel: 'safe' | 'warning' | 'danger' = 'safe';
    let statusTitle = 'High Retention Payout Zone';
    let statusMessage = `You keep ${netRetentionPercent.toFixed(1)}% of your gross profit! Excellent payout optimization.`;

    if (netRetentionPercent < 50) {
      retentionLevel = 'danger';
      statusTitle = 'High Tax & Fee Drag Zone';
      statusMessage = 'More than 50% of your gross profit is lost to firm split, transfer fees, and taxes!';
    } else if (netRetentionPercent < 75) {
      retentionLevel = 'warning';
      statusTitle = 'Moderate Retention Zone';
      statusMessage = 'Consider optimizing withdrawal methods or tax structure to boost in-hand net cash.';
    }

    return {
      traderGrossShare,
      propFirmShare,
      transferFeeUsd,
      netPayoutReceivedUsd,
      taxDeductionUsd,
      finalInHandNetCashUsd,
      netRetentionPercent,
      totalDeductionsUsd,
      retentionLevel,
      statusTitle,
      statusMessage
    };
  }, [grossProfitUsd, traderSplitPercent, applyFirst10kBonus, transferFeeType, transferFeeValue, taxRatePercent]);

  // Share tool link
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Structured JSON-LD Schema Markup
  const jsonLdSchema = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          'name': 'Prop Firm Profit Split & Net Payout Tax Calculator',
          'operatingSystem': 'Web Browser',
          'applicationCategory': 'FinanceApplication',
          'url': 'https://tradejournall.com/tools/prop-firm-profit-split-payout-calculator',
          'description': 'Calculate exact net in-hand payout cash after prop firm profit splits (Apex, Topstep, FTMO), Deel transfer fees, and country taxes.',
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
              'name': 'Prop Firm Profit Split Payout Calculator',
              'item': 'https://tradejournall.com/tools/prop-firm-profit-split-payout-calculator'
            }
          ]
        },
        {
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'How do prop firm profit splits work for Apex, Topstep, and FTMO?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Prop firms split trader profits based on agreed percentages. Apex and Topstep offer 100% profit split on the first $10,000 earned, followed by a 90/10 split. FTMO offers an 80/20 split scaling up to 90/10.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How are prop firm payouts taxed in the US, UK, and India?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'In the US, prop firm payouts are classified as 1099 Independent Contractor income subject to ~15.3% Self-Employment Tax plus State tax. In the UK, it is taxed as Self-Assessment Income Tax. In India, it is taxed under Virtual Assets / Foreign Capital Gains rules.'
              }
            },
            {
              '@type': 'Question',
              'name': 'What is the best payout transfer method for funded traders?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Crypto (USDT/LTC) offers flat low gas fees ($5-$10) and rapid delivery. Platforms like Deel and Rise offer direct local bank deposits with ~1.5% currency conversion fees.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Does Apex Trader Funding give 100% of the first $10,000 profit?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Yes, Apex Trader Funding gives traders 100% of the first $10,000 profit per account, after which withdrawals follow a 90/10 profit split.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How to calculate final in-hand net cash from a prop firm payout?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Final In-Hand Cash = (Gross Account Profit x Trader Split %) - Payout Transfer Fees - Country Income/Self-Employment Tax.'
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
        <title>Prop Firm Profit Split & Net Payout Tax Calculator (Apex, Topstep, FTMO) — TradeJournall</title>
        <meta
          name="description"
          content="Free Prop Firm Profit Split & Net Payout Tax Calculator. Calculate exact in-hand cash after 80/20 or 90/10 profit splits, Deel transfer fees, and country taxes for Apex, Topstep & FTMO."
        />
        <meta
          name="keywords"
          content="prop firm profit split calculator, topstep payout net income calculator, apex trader funding payout tax calculator, ftmo 80 percent profit split calculator, funded firm tax calculator, tradejournall"
        />
        <link rel="canonical" href="https://tradejournall.com/tools/prop-firm-profit-split-payout-calculator" />
        <meta property="og:title" content="Prop Firm Profit Split & Net Payout Tax Calculator" />
        <meta
          property="og:description"
          content="Calculate exact in-hand net bank payout after firm split %, Deel/crypto transfer fees, and country taxes."
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
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-950/60 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
              Global Prop Firm Income Suite
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Landmark className="text-purple-400" size={26} />
            Prop Firm Profit Split & Net Payout Tax Calculator
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Calculate your exact in-hand bank payout after 80/20 or 90/10 profit splits, Deel/Crypto transfer fees, and country taxes for Apex, Topstep, FTMO & FundedNext.
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
          
          {/* PROP FIRM PRESETS */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Select Prop Firm Preset
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROP_FIRM_PRESETS.map((firm) => (
                <button
                  key={firm.name}
                  type="button"
                  onClick={() => handleFirmSelect(firm)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    selectedFirm === firm.name
                      ? 'bg-purple-950/60 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-xs font-black">{firm.name}</span>
                  <span className="text-[10px] text-purple-300 font-mono mt-1 font-semibold">
                    {firm.hasFirst10kBonus ? '100% 1st $10k + ' : ''}{firm.defaultSplitPercent}/{100 - firm.defaultSplitPercent} Split
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* GROSS PROFIT INPUT */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <label>2. Gross Account Profit Earned ({primaryCurrencySymbol})</label>
              <span className="text-purple-400 font-mono">{primaryCurrencySymbol}{grossProfitUsd.toLocaleString()}</span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">
                {primaryCurrencySymbol}
              </span>
              <input
                type="number"
                min="100"
                max="1000000"
                step="500"
                value={grossProfitUsd}
                onChange={(e) => setGrossProfitUsd(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-9 pr-4 text-white font-mono font-bold text-sm focus:border-purple-500 outline-none transition"
              />
            </div>
            {/* Quick Profit Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[3000, 5000, 10000, 15000, 25000, 50000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setGrossProfitUsd(amt)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono transition cursor-pointer ${
                    grossProfitUsd === amt
                      ? 'bg-purple-500 text-slate-950 font-black'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {primaryCurrencySymbol}{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* PROFIT SPLIT % & FIRST $10K BONUS TOGGLE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* TRADER SPLIT SLIDER */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                <label>3. Trader Profit Split Share (%)</label>
                <span className="text-purple-400 font-mono font-bold">{traderSplitPercent}% / {100 - traderSplitPercent}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={traderSplitPercent}
                onChange={(e) => setTraderSplitPercent(parseInt(e.target.value) || 80)}
                className="w-full accent-purple-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>70/30</span>
                <span>80/20</span>
                <span>90/10</span>
                <span>100%</span>
              </div>
            </div>

            {/* FIRST $10K BONUS TOGGLE */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                100% First $10,000 Bonus?
              </label>
              <button
                type="button"
                onClick={() => setApplyFirst10kBonus(!applyFirst10kBonus)}
                className={`w-full py-3 px-4 rounded-2xl border text-xs font-extrabold transition flex items-center justify-between cursor-pointer ${
                  applyFirst10kBonus
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span>{applyFirst10kBonus ? '✅ Active (First $10k = 100%)' : '❌ Disabled (Standard Split Only)'}</span>
                <Sparkles size={16} className={applyFirst10kBonus ? 'text-emerald-400' : 'text-slate-600'} />
              </button>
            </div>

          </div>

          {/* PAYOUT METHOD PRESETS */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              4. Payout Transfer Method & Fee
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PAYOUT_METHODS.map((method) => (
                <button
                  key={method.name}
                  type="button"
                  onClick={() => handleMethodSelect(method)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    selectedPayoutMethod === method.name
                      ? 'bg-purple-950/60 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-xs font-black">{method.name}</span>
                  <span className="text-[10px] text-purple-300 font-mono mt-1 font-semibold">
                    {method.type === 'percent' ? `${method.value}% Fee` : `$${method.value} Flat`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* COUNTRY TAX PRESETS */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <label>5. Country Tax Deduction Rate (%)</label>
              <span className="text-rose-400 font-mono font-bold">{taxRatePercent}% Tax</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COUNTRY_TAXES.map((tax) => (
                <button
                  key={tax.name}
                  type="button"
                  onClick={() => handleCountrySelect(tax)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    selectedCountry === tax.name
                      ? 'bg-rose-950/60 border-rose-500 text-white shadow-lg shadow-rose-500/10'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="text-xs font-black">{tax.name}</span>
                  <span className="text-[10px] text-rose-300 font-mono mt-1 font-semibold">
                    {tax.taxRatePercent}% Tax Rate
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* OUTPUT RESULTS CARD (RIGHT 5 COLUMNS) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* CORE PAYOUT RETENTION CARD */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 relative overflow-hidden">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <CreditCard size={16} className="text-emerald-400" />
                Net Payout Cash Breakdown
              </span>
              <span className="text-[10px] bg-emerald-950 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold">
                {results.netRetentionPercent.toFixed(1)}% Retained
              </span>
            </div>

            {/* BIG METRIC 1: FINAL IN-HAND NET CASH */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/40 space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                💵 Final In-Hand Net Cash in Bank
              </span>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-black font-mono text-emerald-400 tracking-tight">
                  {primaryCurrencySymbol}{results.finalInHandNetCashUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  Take-Home
                </span>
              </div>
            </div>

            {/* METRICS GRID 2: TRADER SHARE VS TOTAL DEDUCTIONS */}
            <div className="grid grid-cols-2 gap-3">
              {/* TRADER GROSS SHARE */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Trader Split Share
                </span>
                <div className="text-lg font-black font-mono text-purple-300">
                  {primaryCurrencySymbol}{results.traderGrossShare.toLocaleString()}
                </div>
              </div>

              {/* PROP FIRM SHARE */}
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Prop Firm Keep
                </span>
                <div className="text-lg font-black font-mono text-amber-300">
                  {primaryCurrencySymbol}{results.propFirmShare.toLocaleString()}
                </div>
              </div>
            </div>

            {/* BREAKDOWN LIST */}
            <div className="space-y-2.5 pt-2 text-xs border-t border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Transfer / Withdrawal Fee ({selectedPayoutMethod}):</span>
                <span className="font-mono font-bold text-rose-400">
                  -{primaryCurrencySymbol}{results.transferFeeUsd.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Net Payout Received ({selectedPayoutMethod}):</span>
                <span className="font-mono font-bold text-purple-300">
                  {primaryCurrencySymbol}{results.netPayoutReceivedUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Country Tax Deduction ({selectedCountry}):</span>
                <span className="font-mono font-bold text-rose-400">
                  -{primaryCurrencySymbol}{results.taxDeductionUsd.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Total Deductions (Split + Fee + Tax):</span>
                <span className="font-mono font-bold text-rose-400">
                  -{primaryCurrencySymbol}{results.totalDeductionsUsd.toFixed(2)}
                </span>
              </div>
            </div>

          </div>

          {/* RETENTION STATUS GAUGE CARD */}
          <div className={`p-5 rounded-3xl border shadow-xl space-y-2.5 ${
            results.retentionLevel === 'safe'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : results.retentionLevel === 'warning'
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}>
            <h4 className="text-sm font-extrabold flex items-center gap-2">
              {results.retentionLevel === 'safe' && <CheckCircle2 size={18} className="text-emerald-400" />}
              {results.retentionLevel === 'warning' && <AlertTriangle size={18} className="text-amber-400" />}
              {results.retentionLevel === 'danger' && <XCircle size={18} className="text-rose-400" />}
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
      <div className="mb-10 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-500/40 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">
            TradeJournall Prop Firm Discipline
          </span>
          <h4 className="text-base font-extrabold text-white mt-0.5">
            Log your Prop Firm Payouts & Audit Net Returns Automatically
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            Track daily profit targets, payout schedules, and net take-home earnings on TradeJournall.
          </p>
        </div>

        <button
          onClick={() => {
            if (onLogTrade) {
              onLogTrade({
                symbol: `${selectedFirm} PAYOUT`,
                entryPrice: grossProfitUsd,
                exitPrice: results.finalInHandNetCashUsd,
                pnl: results.finalInHandNetCashUsd,
                type: 'Long',
              });
            }
          }}
          className="whitespace-nowrap bg-purple-500 hover:bg-purple-400 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs sm:text-sm transition shadow-lg shadow-purple-500/20 flex items-center gap-2 cursor-pointer"
        >
          <span>Log Prop Firm Payout</span>
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
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest bg-purple-950/60 border border-purple-500/30 px-3 py-1 rounded-full">
                Ultimate Funded Trader Guide 2026
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-3 mb-2 leading-tight">
                Prop Firm Profit Split, Payout Methods & Tax Guide
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Learn how profit splits work for <strong>Apex Trader Funding</strong>, <strong>Topstep</strong>, <strong>FTMO</strong>, and <strong>FundedNext</strong>. Master the exact formulas for calculating net in-hand bank cash after profit splits, Deel/Crypto transfer fees, and country-specific taxes.
              </p>
            </div>

            {/* SECTION 1: HOW PROFIT SPLITS WORK */}
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-purple-400">
                1. How Prop Firm Profit Splits Work (Apex, Topstep & FTMO)
              </h3>
              <p className="text-slate-300 leading-relaxed">
                When you pass a prop firm evaluation and earn funded status, the profits generated in your Performance Account (PA) are divided between you (the trader) and the proprietary trading firm according to a pre-defined <strong>Profit Split Percentage</strong>.
              </p>
              <ul className="text-slate-300 space-y-2 list-disc list-inside text-xs sm:text-sm">
                <li><strong>Apex Trader Funding & Topstep (100% First $10k Bonus):</strong> Both firms grant traders 100% of the first $10,000 in accumulated profits per account. After $10,000, profits follow a 90/10 split (90% to trader, 10% to firm).</li>
                <li><strong>FTMO & Funding Pips (80/20 to 90/10 Scaling):</strong> FTMO starts traders at an 80/20 profit split. If you reach scaling plan criteria (10% profit over 4 months), your split upgrades to 90/10.</li>
              </ul>
            </div>

            {/* SECTION 2: PAYOUT METHODS COMPARED */}
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-purple-400">
                2. Comparing Payout Methods: Deel vs Crypto vs Bank Wire
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-purple-300">Deel & Rise Platforms</div>
                  <p className="text-slate-400">Deel allows direct local bank payouts worldwide. They charge ~1.5% currency conversion fee when transferring to local currencies.</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-emerald-300">Crypto (USDT / LTC)</div>
                  <p className="text-slate-400">Crypto payouts deliver within hours with low flat gas fees ($5-$10). Ideal for international traders avoiding bank conversion spreads.</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-amber-300">Direct Bank Wire (SWIFT)</div>
                  <p className="text-slate-400">International wire transfers cost $30-$50 in flat bank fees and take 2-5 business days to clear.</p>
                </div>
              </div>
            </div>

            {/* SECTION 3: TAX CLASSIFICATION GLOBALLY */}
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-purple-400">
                3. How Prop Firm Payouts Are Taxed Globally (US, UK, Dubai, India)
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Prop firm earnings are not standard W-2 employment salary. Because funded traders trade firm capital as independent contractors, tax classification varies by country:
              </p>
              <ul className="text-slate-300 space-y-2 list-disc list-inside text-xs sm:text-sm">
                <li><strong>United States (1099 Contractor):</strong> Payouts are reported on Form 1099-NEC. Earnings are subject to 15.3% Self-Employment Tax plus federal and state income tax.</li>
                <li><strong>United Kingdom (Self-Assessment):</strong> Payouts are treated as trading income under Self-Assessment (subject to Income Tax & National Insurance).</li>
                <li><strong>Dubai / UAE (0% Tax):</strong> Personal income tax is 0%, making Dubai a premier destination for funded prop traders.</li>
                <li><strong>India (VDA / Income):</strong> Payouts received via crypto or foreign invoice are taxed under income/capital gains tax rules.</li>
              </ul>
            </div>

            {/* SECTION 4: FAQ SECTION */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-xl sm:text-2xl font-bold text-purple-400">
                Frequently Asked Questions (FAQ) — Prop Firm Payouts & Taxes
              </h3>
              
              <div className="space-y-3">
                <div className="border border-slate-800 rounded-2xl p-5 bg-slate-950/60 space-y-2">
                  <h5 className="font-bold text-white text-sm">How do prop firm profit splits work for Apex, Topstep, and FTMO?</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Prop firms split trader profits based on agreed percentages. Apex and Topstep offer 100% profit split on the first $10,000 earned, followed by a 90/10 split. FTMO offers an 80/20 split scaling up to 90/10.
                  </p>
                </div>

                <div className="border border-slate-800 rounded-2xl p-5 bg-slate-950/60 space-y-2">
                  <h5 className="font-bold text-white text-sm">How are prop firm payouts taxed in the US, UK, and India?</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    In the US, prop firm payouts are classified as 1099 Independent Contractor income subject to ~15.3% Self-Employment Tax plus State tax. In the UK, it is taxed as Self-Assessment Income Tax. In India, it is taxed under Virtual Assets / Foreign Capital Gains rules.
                  </p>
                </div>

                <div className="border border-slate-800 rounded-2xl p-5 bg-slate-950/60 space-y-2">
                  <h5 className="font-bold text-white text-sm">What is the best payout transfer method for funded traders?</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Crypto (USDT/LTC) offers flat low gas fees ($5-$10) and rapid delivery. Platforms like Deel and Rise offer direct local bank deposits with ~1.5% currency conversion fees.
                  </p>
                </div>

                <div className="border border-slate-800 rounded-2xl p-5 bg-slate-950/60 space-y-2">
                  <h5 className="font-bold text-white text-sm">Does Apex Trader Funding give 100% of the first $10,000 profit?</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Yes, Apex Trader Funding gives traders 100% of the first $10,000 profit per account, after which withdrawals follow a 90/10 profit split.
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
