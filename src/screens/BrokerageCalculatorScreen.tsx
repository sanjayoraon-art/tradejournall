import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, ArrowRight, Sparkles, ChevronDown, ChevronUp, ExternalLink, ArrowLeft, Scale, Check, AlertCircle } from 'lucide-react';
import { calculateStockCharges, calculateCryptoFees, StockInput, CryptoInput } from '../utils/feeCalculators';
import { formatNumber } from '../utils/helpers';

interface BrokerageCalculatorScreenProps {
  theme: any;
  isDarkMode: boolean;
  primaryCurrencySymbol: string;
  initialTab?: 'stock' | 'crypto';
  onLogTrade?: (tradeData: { symbol: string; entryPrice: number; exitPrice: number; pnl: number; type: 'Long' | 'Short' }) => void;
  onBackToLanding?: () => void;
  onSignIn?: () => void;
}

export const BrokerageCalculatorScreen: React.FC<BrokerageCalculatorScreenProps> = ({
  theme,
  isDarkMode,
  primaryCurrencySymbol,
  initialTab = 'stock',
  onLogTrade,
  onBackToLanding,
  onSignIn,
}) => {
  const [activeTab, setActiveTab] = useState<'stock' | 'crypto'>(() => {
    const path = window.location.pathname;
    if (path.includes('coindcx-vs-delta') || path.includes('/calculators/crypto')) return 'crypto';
    return initialTab;
  });
  const [showBreakdown, setShowBreakdown] = useState(true);

  // Sync tab change with SEO clean URLs
  const handleTabChange = (tab: 'stock' | 'crypto') => {
    setActiveTab(tab);
    const newPath = tab === 'stock'
      ? '/calculators/stocks/zerodha-vs-groww-brokerage-calculator'
      : '/calculators/crypto/coindcx-vs-delta-exchange-fee-calculator';
    window.history.replaceState({}, '', newPath);
  };

  // Inject Dynamic SEO Title, Meta Tags & JSON-LD Schema for Google Search Console
  useEffect(() => {
    const isStock = activeTab === 'stock';
    const metaTitle = isStock
      ? "Zerodha vs Groww Brokerage Calculator 2026 | STT, GST & Net Profit | TradeJournall"
      : "CoinDCX vs Delta Exchange Fee & Crypto Tax Calculator 2026 | TradeJournall";
    const metaDescription = isStock
      ? "Compare Zerodha vs Groww brokerage fees, STT, 18% GST, Stamp Duty, and exact breakeven points for Indian Stock Options and Intraday trades in real-time."
      : "Calculate 1% TDS (Sec 194S), 30% Flat Tax (Sec 115BBH), and Maker/Taker fees comparing Delta Exchange vs CoinDCX for crypto futures trades in India.";
    const metaKeywords = isStock
      ? "zerodha vs groww brokerage calculator, zerodha brokerage calculator, groww brokerage calculator, option trading breakeven calculator, stt calculator, gst on brokerage, tradejournall"
      : "coindcx vs delta exchange fee calculator, delta exchange fee calculator, coindcx fee calculator, crypto 1% tds calculator, crypto 30% tax calculator, tradejournall";
    const canonicalUrl = isStock
      ? "https://tradejournall.com/calculators/stocks/zerodha-vs-groww-brokerage-calculator"
      : "https://tradejournall.com/calculators/crypto/coindcx-vs-delta-exchange-fee-calculator";

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
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'twitter:title', metaTitle);
    setMetaTag('property', 'twitter:description', metaDescription);
    setMetaTag('property', 'twitter:url', canonicalUrl);

    // Update or insert canonical link tag
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // Inject JSON-LD Structured Data Schema for Googlebot
    const scriptId = 'brokerage-calc-schema';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "name": isStock ? "Zerodha vs Groww Brokerage Calculator" : "CoinDCX vs Delta Exchange Fee Calculator",
          "url": canonicalUrl,
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "All",
          "description": metaDescription,
          "publisher": {
            "@type": "Organization",
            "name": "TradeJournall",
            "url": "https://tradejournall.com"
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
          }
        },
        {
          "@type": "FAQPage",
          "mainEntity": isStock ? [
            {
              "@type": "Question",
              "name": "Which broker is cheaper for option trading in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Both Zerodha and Groww charge flat ₹20 per order for Options. However, Zerodha offers lower slippage, GTT order execution, and transparent charge breakdown audit tools."
              }
            },
            {
              "@type": "Question",
              "name": "How is the breakeven point calculated for Options?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Breakeven Points = Total Taxes & Brokerage Charges ÷ Lot Quantity. On a 500 qty option trade, total charges of ₹87.50 require a minimum movement of +0.18 points per option contract to break even."
              }
            }
          ] : [
            {
              "@type": "Question",
              "name": "Which exchange has lower futures trading fees: CoinDCX or Delta Exchange?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Delta Exchange India generally offers lower futures trading fees with a 0.02% Maker and 0.05% Taker fee compared to CoinDCX's standard futures tier."
              }
            },
            {
              "@type": "Question",
              "name": "Is 1% TDS applicable on Delta Exchange India and CoinDCX?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, both exchanges are Indian FIU-compliant entities and automatically deduct 1% TDS on applicable crypto transactions as per Indian tax laws."
              }
            }
          ]
        }
      ]
    };
    scriptTag.textContent = JSON.stringify(schemaData);

    return () => {
      // Cleanup script on unmount
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }
    };
  }, [activeTab]);

  // Stock State
  const [stockInput, setStockInput] = useState<StockInput>({
    segment: 'options',
    exchange: 'NSE',
    buyPrice: 250,
    sellPrice: 285,
    quantity: 500,
  });

  // Crypto State
  const [cryptoInput, setCryptoInput] = useState<CryptoInput>({
    margin: 500,
    leverage: 10,
    entryPrice: 65000,
    exitPrice: 68500,
    positionType: 'long',
    orderType: 'taker',
  });

  // Calculated Results
  const stockResult = useMemo(() => calculateStockCharges(stockInput), [stockInput]);
  const cryptoResult = useMemo(() => calculateCryptoFees(cryptoInput), [cryptoInput]);

  return (
    <div className="px-4 pb-24 pt-4 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* GUEST MODE PUBLIC HEADER BAR */}
      {onBackToLanding && (
        <div className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl px-4 py-3 mb-6 flex items-center justify-between shadow-lg">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span>← Back to Home Page</span>
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-semibold hidden md:inline">
              Free Public Financial Calculator
            </span>
            {onSignIn && (
              <button
                onClick={onSignIn}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition shadow-md cursor-pointer"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}

      {/* HEADER HERO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-emerald-500 to-amber-500 rounded-2xl shadow-lg shadow-emerald-500/20 text-slate-950">
            <Calculator size={26} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-black ${theme.text}`}>
              Broker vs Broker Fee Calculator
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Compare Zerodha vs Groww & Delta Exchange vs CoinDCX fee difference in real-time
            </p>
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex bg-slate-800/80 p-1 rounded-2xl border border-slate-700/80 self-start md:self-auto">
          <button
            onClick={() => handleTabChange('stock')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'stock'
                ? 'bg-emerald-500 text-slate-950 shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>🇮🇳 Zerodha vs Groww</span>
          </button>
          <button
            onClick={() => handleTabChange('crypto')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'crypto'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>⚡ Delta vs CoinDCX</span>
          </button>
        </div>
      </div>

      {/* MAIN WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: INPUT CONTROLS (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`${theme.card} p-5 rounded-3xl border ${theme.border} shadow-xl space-y-5`}>
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className={`text-sm font-bold uppercase tracking-wider ${theme.text}`}>
                {activeTab === 'stock' ? 'Stock Trade Inputs' : 'Crypto Futures Inputs'}
              </h3>
              <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                Live Calculation
              </span>
            </div>

            {activeTab === 'stock' ? (
              <>
                {/* STOCK SEGMENT */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Trading Segment</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setStockInput({ ...stockInput, segment: 'options' })}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        stockInput.segment === 'options'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-slate-900 border-slate-800 text-gray-400'
                      }`}
                    >
                      Equity Options
                    </button>
                    <button
                      type="button"
                      onClick={() => setStockInput({ ...stockInput, segment: 'intraday' })}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        stockInput.segment === 'intraday'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-slate-900 border-slate-800 text-gray-400'
                      }`}
                    >
                      Equity Intraday
                    </button>
                  </div>
                </div>

                {/* BUY PRICE */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400 font-bold">Buy / Premium Price</span>
                    <span className="font-mono text-emerald-400 font-bold">₹ {stockInput.buyPrice}</span>
                  </div>
                  <input
                    type="number"
                    value={stockInput.buyPrice}
                    onChange={(e) => setStockInput({ ...stockInput, buyPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-emerald-500 outline-none mb-2"
                  />
                  <input
                    type="range"
                    min="1"
                    max="5000"
                    step="1"
                    value={stockInput.buyPrice}
                    onChange={(e) => setStockInput({ ...stockInput, buyPrice: parseFloat(e.target.value) || 1 })}
                    className="w-full accent-emerald-500 bg-slate-800"
                  />
                </div>

                {/* SELL PRICE */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400 font-bold">Sell / Exit Price</span>
                    <span className="font-mono text-emerald-400 font-bold">₹ {stockInput.sellPrice}</span>
                  </div>
                  <input
                    type="number"
                    value={stockInput.sellPrice}
                    onChange={(e) => setStockInput({ ...stockInput, sellPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-emerald-500 outline-none mb-2"
                  />
                  <input
                    type="range"
                    min="1"
                    max="5000"
                    step="1"
                    value={stockInput.sellPrice}
                    onChange={(e) => setStockInput({ ...stockInput, sellPrice: parseFloat(e.target.value) || 1 })}
                    className="w-full accent-emerald-500 bg-slate-800"
                  />
                </div>

                {/* QUANTITY */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400 font-bold">Quantity / Lots</span>
                    <span className="font-mono text-amber-400 font-bold">{stockInput.quantity} Qty</span>
                  </div>
                  <input
                    type="number"
                    value={stockInput.quantity}
                    onChange={(e) => setStockInput({ ...stockInput, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-amber-500 outline-none mb-2"
                  />
                  <input
                    type="range"
                    min="15"
                    max="5000"
                    step="15"
                    value={stockInput.quantity}
                    onChange={(e) => setStockInput({ ...stockInput, quantity: parseInt(e.target.value) || 15 })}
                    className="w-full accent-amber-500 bg-slate-800"
                  />
                </div>
              </>
            ) : (
              <>
                {/* CRYPTO POSITION TYPE */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Position Direction</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCryptoInput({ ...cryptoInput, positionType: 'long' })}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        cryptoInput.positionType === 'long'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-slate-900 border-slate-800 text-gray-400'
                      }`}
                    >
                      Long (Buy)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCryptoInput({ ...cryptoInput, positionType: 'short' })}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        cryptoInput.positionType === 'short'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                          : 'bg-slate-900 border-slate-800 text-gray-400'
                      }`}
                    >
                      Short (Sell)
                    </button>
                  </div>
                </div>

                {/* ORDER TYPE */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Order Execution</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCryptoInput({ ...cryptoInput, orderType: 'maker' })}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        cryptoInput.orderType === 'maker'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'bg-slate-900 border-slate-800 text-gray-400'
                      }`}
                    >
                      Maker (Limit)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCryptoInput({ ...cryptoInput, orderType: 'taker' })}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        cryptoInput.orderType === 'taker'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'bg-slate-900 border-slate-800 text-gray-400'
                      }`}
                    >
                      Taker (Market)
                    </button>
                  </div>
                </div>

                {/* MARGIN */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400 font-bold">Initial Margin ($)</span>
                    <span className="font-mono text-emerald-400 font-bold">${cryptoInput.margin}</span>
                  </div>
                  <input
                    type="number"
                    value={cryptoInput.margin}
                    onChange={(e) => setCryptoInput({ ...cryptoInput, margin: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-emerald-500 outline-none mb-2"
                  />
                  <input
                    type="range"
                    min="10"
                    max="10000"
                    step="10"
                    value={cryptoInput.margin}
                    onChange={(e) => setCryptoInput({ ...cryptoInput, margin: parseFloat(e.target.value) || 10 })}
                    className="w-full accent-emerald-500 bg-slate-800"
                  />
                </div>

                {/* LEVERAGE */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400 font-bold">Leverage</span>
                    <span className="font-mono text-amber-400 font-bold">{cryptoInput.leverage}x</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={cryptoInput.leverage}
                    onChange={(e) => setCryptoInput({ ...cryptoInput, leverage: parseInt(e.target.value) || 1 })}
                    className="w-full accent-amber-500 bg-slate-800 mb-1"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>1x</span>
                    <span>25x</span>
                    <span>50x</span>
                    <span>100x</span>
                  </div>
                </div>

                {/* ENTRY & EXIT PRICES */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Entry Price ($)</label>
                    <input
                      type="number"
                      value={cryptoInput.entryPrice}
                      onChange={(e) => setCryptoInput({ ...cryptoInput, entryPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Exit Price ($)</label>
                    <input
                      type="number"
                      value={cryptoInput.exitPrice}
                      onChange={(e) => setCryptoInput({ ...cryptoInput, exitPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: RESULTS MATRIX & COMPARISON (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">

          {/* PROMINENT WINNER & NET DIFFERENCE CARD */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-700/80 pb-4">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <Sparkles size={13} />
                  <span>Exact Net Difference</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
                  {activeTab === 'stock' ? (
                    stockResult.cheaperBroker === 'Equal'
                      ? 'Both Brokers Have Equal Charges'
                      : `${stockResult.cheaperBroker} gives ₹ ${stockResult.savingsAmount} MORE Net Profit`
                  ) : (
                    cryptoResult.cheaperExchange === 'Equal'
                      ? 'Both Exchanges Have Equal Fees'
                      : `${cryptoResult.cheaperExchange} saves $ ${cryptoResult.savingsAmount} in Fees`
                  )}
                </h3>
              </div>
              <a
                href={activeTab === 'stock' ? 'https://zerodha.com' : 'https://delta.exchange'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-lg flex items-center gap-1.5 shrink-0"
              >
                <span>{activeTab === 'stock' ? 'Open Zerodha Demat' : 'Trade on Delta'}</span>
                <ExternalLink size={14} />
              </a>
            </div>

            {/* SIDE-BY-SIDE SUMMARY TILES */}
            <div className="grid grid-cols-2 gap-4 mt-5">
              {activeTab === 'stock' ? (
                <>
                  <div className={`bg-slate-900/90 border ${stockResult.cheaperBroker === 'Zerodha' ? 'border-emerald-500/70 bg-emerald-950/20' : 'border-slate-700'} rounded-2xl p-4 text-center relative`}>
                    {stockResult.cheaperBroker === 'Zerodha' && (
                      <span className="absolute top-2 right-2 text-[9px] font-black bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded">WINNER</span>
                    )}
                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Zerodha Net In-Hand</span>
                    <div className={`text-2xl font-black mt-1 ${stockResult.zerodha.netPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ₹ {formatNumber(stockResult.zerodha.netPnL, 2)}
                    </div>
                    <span className="text-[10px] text-gray-400 block mt-1 font-mono">
                      Charges: ₹ {stockResult.zerodha.charges.totalCharges}
                    </span>
                  </div>

                  <div className={`bg-slate-900/90 border ${stockResult.cheaperBroker === 'Groww' ? 'border-emerald-500/70 bg-emerald-950/20' : 'border-slate-700'} rounded-2xl p-4 text-center relative`}>
                    {stockResult.cheaperBroker === 'Groww' && (
                      <span className="absolute top-2 right-2 text-[9px] font-black bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded">WINNER</span>
                    )}
                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Groww Net In-Hand</span>
                    <div className={`text-2xl font-black mt-1 ${stockResult.groww.netPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ₹ {formatNumber(stockResult.groww.netPnL, 2)}
                    </div>
                    <span className="text-[10px] text-gray-400 block mt-1 font-mono">
                      Charges: ₹ {stockResult.groww.charges.totalCharges}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className={`bg-slate-900/90 border ${cryptoResult.cheaperExchange === 'Delta Exchange' ? 'border-emerald-500/70 bg-emerald-950/20' : 'border-slate-700'} rounded-2xl p-4 text-center relative`}>
                    {cryptoResult.cheaperExchange === 'Delta Exchange' && (
                      <span className="absolute top-2 right-2 text-[9px] font-black bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded">WINNER</span>
                    )}
                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Delta Exchange Net Profit</span>
                    <div className={`text-2xl font-black mt-1 ${cryptoResult.deltaExchange.netRealizedProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      $ {formatNumber(cryptoResult.deltaExchange.netRealizedProfit, 2)}
                    </div>
                    <span className="text-[10px] text-gray-400 block mt-1 font-mono">
                      Fees: $ {cryptoResult.deltaExchange.totalExchangeFees}
                    </span>
                  </div>

                  <div className={`bg-slate-900/90 border ${cryptoResult.cheaperExchange === 'CoinDCX' ? 'border-emerald-500/70 bg-emerald-950/20' : 'border-slate-700'} rounded-2xl p-4 text-center relative`}>
                    {cryptoResult.cheaperExchange === 'CoinDCX' && (
                      <span className="absolute top-2 right-2 text-[9px] font-black bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded">WINNER</span>
                    )}
                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">CoinDCX Net Profit</span>
                    <div className={`text-2xl font-black mt-1 ${cryptoResult.coinDcx.netRealizedProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      $ {formatNumber(cryptoResult.coinDcx.netRealizedProfit, 2)}
                    </div>
                    <span className="text-[10px] text-gray-400 block mt-1 font-mono">
                      Fees: $ {cryptoResult.coinDcx.totalExchangeFees}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* FULL SIDE-BY-SIDE COMPARISON MATRIX TABLE */}
          <div className={`${theme.card} border ${theme.border} rounded-3xl p-6 shadow-xl`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-sm font-bold uppercase tracking-wider ${theme.text} flex items-center gap-2`}>
                <Scale size={18} className="text-amber-400" />
                <span>Side-by-Side Fee Comparison Matrix</span>
              </h3>
              <span className="text-xs text-gray-400 font-mono">Detailed Breakdown</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-700 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Metric / Charge</th>
                    <th className="py-2.5 px-3 text-center">{activeTab === 'stock' ? 'Zerodha' : 'Delta Exchange'}</th>
                    <th className="py-2.5 px-3 text-center">{activeTab === 'stock' ? 'Groww' : 'CoinDCX'}</th>
                    <th className="py-2.5 px-3 text-right">Net Difference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-gray-300 font-mono">
                  {activeTab === 'stock' ? (
                    <>
                      <tr>
                        <td className="py-2.5 px-3 font-sans text-gray-400 font-semibold">Brokerage (Buy + Sell)</td>
                        <td className="py-2.5 px-3 text-center">₹ {stockResult.zerodha.charges.brokerage}</td>
                        <td className="py-2.5 px-3 text-center">₹ {stockResult.groww.charges.brokerage}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-amber-400">
                          {stockResult.zerodha.charges.brokerage === stockResult.groww.charges.brokerage
                            ? 'Equal'
                            : stockResult.zerodha.charges.brokerage < stockResult.groww.charges.brokerage
                            ? `Zerodha -₹ ${(stockResult.groww.charges.brokerage - stockResult.zerodha.charges.brokerage).toFixed(2)}`
                            : `Groww -₹ ${(stockResult.zerodha.charges.brokerage - stockResult.groww.charges.brokerage).toFixed(2)}`}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-sans text-gray-400 font-semibold">STT (Securities Tax)</td>
                        <td className="py-2.5 px-3 text-center">₹ {stockResult.zerodha.charges.stt}</td>
                        <td className="py-2.5 px-3 text-center">₹ {stockResult.groww.charges.stt}</td>
                        <td className="py-2.5 px-3 text-right text-gray-500">Equal</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-sans text-gray-400 font-semibold">NSE Exchange Fees</td>
                        <td className="py-2.5 px-3 text-center">₹ {stockResult.zerodha.charges.exchangeCharges}</td>
                        <td className="py-2.5 px-3 text-center">₹ {stockResult.groww.charges.exchangeCharges}</td>
                        <td className="py-2.5 px-3 text-right text-gray-500">Equal</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-sans text-gray-400 font-semibold">GST (18%)</td>
                        <td className="py-2.5 px-3 text-center">₹ {stockResult.zerodha.charges.gst}</td>
                        <td className="py-2.5 px-3 text-center">₹ {stockResult.groww.charges.gst}</td>
                        <td className="py-2.5 px-3 text-right text-amber-400 font-bold">
                          {stockResult.zerodha.charges.gst === stockResult.groww.charges.gst
                            ? 'Equal'
                            : stockResult.zerodha.charges.gst < stockResult.groww.charges.gst
                            ? `-₹ ${(stockResult.groww.charges.gst - stockResult.zerodha.charges.gst).toFixed(2)}`
                            : `-₹ ${(stockResult.zerodha.charges.gst - stockResult.groww.charges.gst).toFixed(2)}`}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-sans text-gray-400 font-semibold">Total Taxes & Charges</td>
                        <td className="py-2.5 px-3 text-center font-bold text-rose-400">₹ {stockResult.zerodha.charges.totalCharges}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-rose-400">₹ {stockResult.groww.charges.totalCharges}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-amber-400">
                          ₹ {stockResult.savingsAmount} Diff
                        </td>
                      </tr>
                      <tr className="bg-slate-900/80 font-bold text-sm">
                        <td className="py-3 px-3 font-sans text-white">NET IN-HAND PROFIT</td>
                        <td className="py-3 px-3 text-center text-emerald-400">₹ {formatNumber(stockResult.zerodha.netPnL, 2)}</td>
                        <td className="py-3 px-3 text-center text-emerald-400">₹ {formatNumber(stockResult.groww.netPnL, 2)}</td>
                        <td className="py-3 px-3 text-right text-emerald-400">
                          +₹ {stockResult.savingsAmount}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr>
                        <td className="py-2.5 px-3 font-sans text-gray-400 font-semibold">Trading Fees (Entry + Exit)</td>
                        <td className="py-2.5 px-3 text-center">$ {cryptoResult.deltaExchange.totalExchangeFees}</td>
                        <td className="py-2.5 px-3 text-center">$ {cryptoResult.coinDcx.totalExchangeFees}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-amber-400">
                          Delta -$ {(cryptoResult.coinDcx.totalExchangeFees - cryptoResult.deltaExchange.totalExchangeFees).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-sans text-gray-400 font-semibold">1% TDS (Sec 194S)</td>
                        <td className="py-2.5 px-3 text-center">$ {cryptoResult.deltaExchange.tdsDeducted}</td>
                        <td className="py-2.5 px-3 text-center">$ {cryptoResult.coinDcx.tdsDeducted}</td>
                        <td className="py-2.5 px-3 text-right text-gray-500">Equal</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-sans text-gray-400 font-semibold">30% Tax (Sec 115BBH)</td>
                        <td className="py-2.5 px-3 text-center">$ {cryptoResult.deltaExchange.estimatedIncomeTax}</td>
                        <td className="py-2.5 px-3 text-center">$ {cryptoResult.coinDcx.estimatedIncomeTax}</td>
                        <td className="py-2.5 px-3 text-right text-gray-500">
                          Diff $ {Math.abs(cryptoResult.deltaExchange.estimatedIncomeTax - cryptoResult.coinDcx.estimatedIncomeTax).toFixed(2)}
                        </td>
                      </tr>
                      <tr className="bg-slate-900/80 font-bold text-sm">
                        <td className="py-3 px-3 font-sans text-white">NET REALIZED PROFIT</td>
                        <td className="py-3 px-3 text-center text-emerald-400">$ {formatNumber(cryptoResult.deltaExchange.netRealizedProfit, 2)}</td>
                        <td className="py-3 px-3 text-center text-emerald-400">$ {formatNumber(cryptoResult.coinDcx.netRealizedProfit, 2)}</td>
                        <td className="py-3 px-3 text-right text-emerald-400">
                          +$ {cryptoResult.savingsAmount}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* TRADEJOURNALL CONVERSION CTA BANNER */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                TradeJournall Integration
              </span>
              <h4 className="text-base font-extrabold text-white mt-0.5">
                Log this calculated trade to your Journal
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Save time and track your win-rate, profit factor, and expectancy automatically.
              </p>
            </div>

            <button
              onClick={() => {
                if (onLogTrade) {
                  if (activeTab === 'stock') {
                    onLogTrade({
                      symbol: stockInput.segment === 'options' ? 'NIFTY OPT' : 'INTRADAY STOCK',
                      entryPrice: stockInput.buyPrice,
                      exitPrice: stockInput.sellPrice,
                      pnl: stockResult.zerodha.netPnL,
                      type: stockInput.sellPrice >= stockInput.buyPrice ? 'Long' : 'Short',
                    });
                  } else {
                    onLogTrade({
                      symbol: 'BTCUSDT PERP',
                      entryPrice: cryptoInput.entryPrice,
                      exitPrice: cryptoInput.exitPrice,
                      pnl: cryptoResult.deltaExchange.netRealizedProfit,
                      type: cryptoInput.positionType === 'long' ? 'Long' : 'Short',
                    });
                  }
                }
              }}
              className="whitespace-nowrap bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs sm:text-sm transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Log Trade Now</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>

      </div>

      {/* IN-PAGE SEO EXPLAINER ARTICLE & FAQ ACCORDION */}
      <div className="mt-12 pt-8 border-t border-slate-800 space-y-8 text-slate-300">
        {activeTab === 'stock' ? (
          <article className="prose prose-invert max-w-none space-y-6 text-sm leading-relaxed">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Zerodha vs Groww Brokerage Charges: 2026 Complete Tax & Fee Guide
              </h2>
              <p className="text-gray-400">
                When trading Indian equities, options, or intraday stocks, understanding the exact fee structure between <strong>Zerodha</strong> and <strong>Groww</strong> ensures you calculate your true breakeven point and net in-hand profit before taking a position.
              </p>

              <h3 className="text-xl font-bold text-emerald-400">1. Brokerage Charges Breakdown</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li><strong>Equity Options Trading</strong>: Both Zerodha and Groww charge a flat <strong>₹20 per executed order</strong> (₹20 on Buy + ₹20 on Sell = ₹40 total per round trade).</li>
                <li><strong>Equity Intraday Trading</strong>: Zerodha charges <strong>0.03% or ₹20</strong> per order (whichever is lower). Groww charges <strong>0.05% or ₹20</strong> per order. For smaller intraday orders below ₹40,000 turnover, Zerodha is up to 40% cheaper.</li>
              </ul>

              <h3 className="text-xl font-bold text-emerald-400">2. Government Taxes & Exchange Charges</h3>
              <p className="text-gray-400">
                In addition to broker commissions, statutory government taxes are levied automatically on every trade:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <h4 className="font-bold text-white mb-1">STT (Securities Transaction Tax)</h4>
                  <p className="text-xs text-gray-400">0.0625% on Sell side premium for Options. 0.025% on Sell side turnover for Intraday.</p>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <h4 className="font-bold text-white mb-1">18% GST (Goods & Services Tax)</h4>
                  <p className="text-xs text-gray-400">18% GST is levied on (Brokerage + Exchange Fees + SEBI Fees). GST is NOT charged on STT or Stamp Duty.</p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-emerald-400">Frequently Asked Questions (FAQ)</h3>
              <div className="space-y-4">
                <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/60">
                  <h5 className="font-bold text-white mb-1">Which broker is cheaper for option trading in India?</h5>
                  <p className="text-xs text-gray-400">Both Zerodha and Groww charge flat ₹20 per order for Options. However, Zerodha offers lower slippage, GTT order execution, and transparent charge breakdown audit tools.</p>
                </div>
                <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/60">
                  <h5 className="font-bold text-white mb-1">How is the breakeven point calculated for Options?</h5>
                  <p className="text-xs text-gray-400">Breakeven Points = Total Taxes & Brokerage Charges ÷ Lot Quantity. On a 500 qty option trade, total charges of ₹87.50 require a minimum movement of +0.18 points per option contract to break even.</p>
                </div>
              </div>
            </div>
          </article>
        ) : (
          <article className="prose prose-invert max-w-none space-y-6 text-sm leading-relaxed">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                CoinDCX vs Delta Exchange Fee & Crypto Tax Math (2026 Guide)
              </h2>
              <p className="text-gray-400">
                Crypto futures and options traders in India must account for exchange Maker/Taker fees as well as Section 194S 1% TDS and Section 115BBH 30% Flat Tax.
              </p>

              <h3 className="text-xl font-bold text-amber-400">1. Delta Exchange vs CoinDCX Fee Comparison</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li><strong>Delta Exchange India</strong>: Charges <strong>0.02% Maker fee</strong> and <strong>0.05% Taker fee</strong> on futures, saving up to 33% compared to domestic exchanges.</li>
                <li><strong>CoinDCX Futures</strong>: Charges <strong>0.025% Maker fee</strong> and <strong>0.075% Taker fee</strong>.</li>
              </ul>

              <h3 className="text-xl font-bold text-amber-400">2. Indian Crypto Tax Rules (Section 194S & Section 115BBH)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <h4 className="font-bold text-white mb-1">1% TDS Withholding (Sec 194S)</h4>
                  <p className="text-xs text-gray-400">1% TDS is deducted on gross sell transaction value. It can be claimed as a credit or refund on your annual ITR.</p>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <h4 className="font-bold text-white mb-1">30% Flat Tax (Sec 115BBH)</h4>
                  <p className="text-xs text-gray-400">Flat 30% tax (plus 4% cess = 31.2%) is levied on net profits. Losses cannot be set off across different trading pairs.</p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-amber-400">Frequently Asked Questions (FAQ)</h3>
              <div className="space-y-4">
                <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/60">
                  <h5 className="font-bold text-white mb-1">Which exchange has lower futures trading fees: CoinDCX or Delta Exchange?</h5>
                  <p className="text-xs text-gray-400">Delta Exchange India generally offers lower futures trading fees with a 0.02% Maker and 0.05% Taker fee compared to CoinDCX's standard futures tier.</p>
                </div>
                <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/60">
                  <h5 className="font-bold text-white mb-1">Is 1% TDS applicable on Delta Exchange India and CoinDCX?</h5>
                  <p className="text-xs text-gray-400">Yes, both exchanges are Indian FIU-compliant entities and automatically deduct 1% TDS on applicable crypto transactions as per Indian tax laws.</p>
                </div>
              </div>
            </div>
          </article>
        )}
      </div>

    </div>
  );
};
