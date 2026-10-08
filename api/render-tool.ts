import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ToolMeta {
    title: string;
    description: string;
    category: string;
    keywords: string;
    h1: string;
    summary: string;
    faq?: Array<{ q: string; a: string }>;
}

const TOOL_META_DATABASE: Record<string, ToolMeta> = {
    // 1. Crypto Liquidation Calculator
    'crypto-liquidation-calculator': {
        title: 'Crypto Liquidation Calculator — Binance, Bybit & OKX Risk Management',
        description: 'Calculate your exact crypto liquidation price, bankruptcy price, and maximum leverage safety margin for Binance, Bybit, OKX, and Bitget futures.',
        category: 'Risk Management',
        keywords: 'crypto liquidation calculator, binance liquidation calculator, bybit liquidation price, leverage danger calculator, futures risk management',
        h1: 'Crypto Futures Liquidation & Bankruptcy Calculator',
        summary: 'Prevent sudden account blowouts. Calculate your exact liquidation threshold across Cross and Isolated margin modes for BTC, ETH, and Altcoin futures positions.',
        faq: [
            { q: 'Crypto mein liquidation price kaise calculate hota hai?', a: 'Liquidation price aapke entry price, leverage (e.g. 10x, 50x), position size, aur maintenance margin rate par depend karta hai. Is calculator se aap exact price point jaan sakte hain.' },
            { q: 'Cross Margin aur Isolated Margin mein liquidation risk alag kyu hota hai?', a: 'Isolated margin mein aapka loss sirf us trade ke allocation tak limited rehta hai, jabki Cross margin mein pura wallet balance margin ki tarah use hota hai.' }
        ]
    },
    'leverage-danger-calculator': {
        title: 'Leverage Danger & Account Margin Calculator | TradeJournall',
        description: 'Understand the hidden risks of high leverage (10x to 100x). Calculate margin call limits and drawdown impact before opening high leverage trades.',
        category: 'Risk Management',
        keywords: 'leverage danger calculator, 100x leverage risk, margin call calculator, crypto leverage safety',
        h1: 'Leverage Danger & Account Risk Calculator',
        summary: 'Higher leverage dramatically reduces your liquidation buffer. Check how much price movement against your entry will wipe out your capital.',
    },

    // 2. Prop Firm Calculator
    'prop-firm-calculator': {
        title: 'Prop Firm Evaluation & Risk Calculator — FTMO, Funding Pips & Topstep',
        description: 'Free Prop Firm Risk & Lot Size Calculator. Calculate maximum allowed drawdown, daily loss limit, target profit requirements, and risk per trade.',
        category: 'Prop Trading',
        keywords: 'prop firm calculator, ftmo risk calculator, funding pips calculator, topstep drawdown calculator, prop trading lot size',
        h1: 'Prop Firm Challenge & Drawdown Risk Calculator',
        summary: 'Master your prop firm challenge rules. Calculate safe lot sizing and max loss limits for FTMO, Funding Pips, FundedNext, E8, and Topstep evaluations.',
        faq: [
            { q: 'Prop firm challenge fail hone se kaise bachein?', a: 'Har trade par max 0.5% se 1% risk lein aur daily loss limit ke 50% par trading stop kar dein.' }
        ]
    },
    'ftmo-calculator': {
        title: 'FTMO Challenge & Daily Loss Calculator | TradeJournall',
        description: 'Calculate FTMO 5% max daily loss limit, 10% total max drawdown, and safe lot sizing for FTMO 100k, 50k, and 200k accounts.',
        category: 'Prop Trading',
        keywords: 'ftmo calculator, ftmo daily loss limit, ftmo drawdown calculator, ftmo 100k challenge risk',
        h1: 'FTMO Challenge Drawdown & Lot Size Calculator',
        summary: 'Stay 100% compliant with FTMO strict daily drawdown and maximum loss rules.',
    },

    // 3. Exness vs XM Spread Calculator
    'exness-vs-xm-spread-calculator': {
        title: 'Exness vs XM Spread & Brokerage Fee Calculator 2026',
        description: 'Compare live spreads, commission per lot, overnight swap fees, and net trading costs between Exness Pro/Raw accounts and XM Ultra Low accounts.',
        category: 'Forex Broker Comparison',
        keywords: 'exness vs xm spread, exness spread calculator, xm brokerage charges, forex commission comparison, exness vs xm forex',
        h1: 'Exness vs XM Spread & Trading Cost Comparison',
        summary: 'Find out which broker offers lower total transaction costs for Gold (XAUUSD), EURUSD, GBPUSD, and Indices trading.',
        faq: [
            { q: 'Exness ya XM mein se kiski spread kam hai?', a: 'Exness Raw Spread account par zero spreads milti hain plus commission, jabki XM Ultra Low account zero commission ke sath ultra-tight spread deta hai.' }
        ]
    },

    // 4. Crypto 30% Tax and 1% TDS Calculator
    'crypto-30-percent-tax-and-1-percent-tds-calculator': {
        title: 'Indian Crypto Tax & 1% TDS Calculator (Sec 115BBH & 194S) 2026',
        description: 'Calculate exact 30% flat tax (Section 115BBH) and 1% TDS (Section 194S) on Indian crypto trades, futures, and P2P sales across WazirX, CoinDCX, and Binance.',
        category: 'Crypto Tax',
        keywords: 'crypto 30 percent tax calculator, 1 percent tds crypto calculator, section 194S calculator, section 115BBH crypto tax india, coindcx tax calculator',
        h1: 'Indian Crypto 30% Tax & 1% TDS Calculation Tool',
        summary: 'Compute net liability under Indian Virtual Digital Asset (VDA) income tax laws before filing ITR-2 or ITR-3.',
        faq: [
            { q: 'Kya crypto futures trading par bhi 30% tax lagta hai?', a: 'Haa, Income Tax Act ke under VDAs aur crypto derivatives profits par flat 30% tax + 4% cess lagta hai.' },
            { q: '1% TDS (Sec 194S) refund milta hai ya nahi?', a: 'Agar aapka total income taxable threshold se kam hai ya tax liability TDS se kam hai, toh aap ITR file karke 1% TDS refund claim kar sakte hain.' }
        ]
    },
    'coindcx-vs-delta-exchange-fee-calculator': {
        title: 'CoinDCX vs Delta Exchange Fee & Tax Calculator 2026',
        description: 'Compare maker/taker fees, 1% TDS deduction, and net profitability between CoinDCX Futures and Delta Exchange India.',
        category: 'Crypto Tax & Fees',
        keywords: 'coindcx vs delta exchange, delta exchange fee calculator, coindcx futures fee, crypto exchange fee comparison india',
        h1: 'CoinDCX vs Delta Exchange India Fee Comparison',
        summary: 'Compare derivative fees, leverage options, and Indian tax compliance between popular exchanges.',
    },

    // 5. Options Trading Net Profit & Breakeven Calculator
    'option-trading-net-profit-breakeven-calculator': {
        title: 'Option Trading Net Profit & Breakeven Calculator — Nifty & BankNifty',
        description: 'Calculate exact breakeven points, STT tax, GST, exchange turn-over fees, and net P&L after brokerage for Nifty, BankNifty, and Stock Options.',
        category: 'Options Derivatives',
        keywords: 'option trading net profit calculator, option breakeven calculator, nifty option brokerage calculator, banknifty option charges, option buying breakeven point',
        h1: 'Nifty & BankNifty Option Net Profit & Breakeven Calculator',
        summary: 'Factoring in STT (0.0625% on sell side), flat brokerage (Rs 20/order), NSE charges, and GST to find your real breakeven point in points.',
        faq: [
            { q: 'Option buying mein breakeven kitne points par hota hai?', a: 'Zyaadatar brokers par Rs 40 total brokerage + STT + GST milakar Nifty mein lagbhag 1.5 se 2.5 points ka moving cost hota hai.' }
        ]
    },
    'zerodha-vs-groww-brokerage-calculator': {
        title: 'Zerodha vs Groww Brokerage & STT Charges Calculator 2026',
        description: 'Calculate total brokerage, STT, stamp duty, exchange transaction charges, and GST for Zerodha Kite vs Groww app across Equity Intraday, Delivery, and F&O.',
        category: 'Brokerage Comparison',
        keywords: 'zerodha vs groww brokerage calculator, groww option brokerage, zerodha stt charges, intraday brokerage comparison',
        h1: 'Zerodha vs Groww Brokerage & Charges Comparison',
        summary: 'Detailed breakdowns of charges per trade for Indian stock market investors and traders.',
    },

    // Additional Specialized Tools
    'session-clock-ist': {
        title: 'Shift & Night-Trader Forex Market Session Clock (IST)',
        description: 'Live Forex Market Hours in Indian Standard Time (IST). Track London, New York, Tokyo, and Sydney session overlaps for high volatility setups.',
        category: 'Market Timing',
        keywords: 'forex market hours ist, London session ist time, New York session time in india, forex session clock ist',
        h1: 'Shift & Night-Trader Forex Session Clock (IST)',
        summary: 'Real-time countdown timer and volatility status for global market session overlaps in Indian Standard Time.',
    },
    'revenge-trading-cooldown-timer': {
        title: 'Revenge Trading Cooldown Timer & Psychology Reset Tool',
        description: 'Prevent emotional tilt and revenge trading after a stop loss hit. Interactive cooldown timer with psychological reset exercises for traders.',
        category: 'Trading Psychology',
        keywords: 'revenge trading cooldown timer, trading discipline timer, stop loss emotional reset, tilt breaker trading',
        h1: 'Revenge Trade Cooldown & Psychological Reset Widget',
        summary: 'Enforce strict cooling-off periods to protect your trading capital from emotional impulse trading.',
    },
    'drawdown-recovery-calculator': {
        title: 'Trading Drawdown Recovery & Compounding Calculator',
        description: 'Calculate the required percentage gain needed to recover from trading drawdowns (10% to 90%) and model your account growth with compounding.',
        category: 'Risk Management',
        keywords: 'drawdown recovery calculator, trading account recovery percentage, loss compounding calculator',
        h1: 'Drawdown Recovery & Capital Compounding Calculator',
        summary: 'Understand the exponential math of drawdowns: a 50% loss requires a 100% gain to breakeven.',
    },
    'apex-consistency-rule-calculator': {
        title: 'Apex & Topstep Prop Firm Consistency Rule Calculator',
        description: 'Calculate Apex Trader Funding 30% consistency rule limit and Topstep daily profit cap to ensure payout eligibility.',
        category: 'Prop Trading',
        keywords: 'apex consistency rule calculator, topstep trailing drawdown, apex 30 percent rule calculator',
        h1: 'Apex & Topstep Prop Firm Consistency Rule Tool',
        summary: 'Verify that no single trading day accounts for more than 30% of your total profit target.',
    },
    'prop-firm-scaling-plan-calculator': {
        title: 'Prop Firm Account Scaling Plan & Growth Roadmap Calculator',
        description: 'Model your capital scaling roadmap for FTMO, FundedNext, and Topstep accounts from $10,000 up to $2,000,000.',
        category: 'Prop Trading',
        keywords: 'prop firm scaling plan calculator, ftmo scaling calculator, fundednext growth schedule',
        h1: 'Prop Firm Capital Scaling Roadmap Calculator',
        summary: 'Plan your long-term prop trading career and compounding milestones.',
    },
    'prop-firm-profit-split-payout-calculator': {
        title: 'Prop Firm Profit Split & Net Payout Tax Calculator',
        description: 'Calculate exact net payout after 80%, 85%, or 90% profit splits, firm processing fees, and local tax withholding.',
        category: 'Prop Trading',
        keywords: 'prop firm payout calculator, ftmo profit split calculator, apex payout calculator',
        h1: 'Prop Firm Profit Split & Net Payout Calculator',
        summary: 'Know your exact take-home pay after prop firm splits and wire transfer fees.',
    },
    'crypto-funding-rate-arbitrage-calculator': {
        title: 'Crypto Funding Rate APR & Delta-Neutral Arbitrage Yield Calculator',
        description: 'Calculate annualized yield (APR/APY) from positive or negative perpetual funding rates across Binance, Bybit, and OKX.',
        category: 'Crypto Yield',
        keywords: 'crypto funding rate calculator, binance funding fee calculator, delta neutral arbitrage yield',
        h1: 'Crypto Funding Rate Arbitrage Yield Calculator',
        summary: 'Calculate passive yield from long spot / short perp delta-neutral positions.',
    },
    'nifty-pcr-calculator': {
        title: 'Nifty & BankNifty Put-Call Ratio (PCR) & Sentiment Gauge',
        description: 'Calculate live Put-Call Ratio (PCR) from open interest data to gauge bullish or bearish market sentiment for Nifty & BankNifty options.',
        category: 'Sentiment Analysis',
        keywords: 'nifty pcr calculator, banknifty put call ratio, pcr indicator nifty, option sentiment gauge',
        h1: 'Nifty & BankNifty PCR Sentiment Gauge',
        summary: 'Identify overbought (PCR > 1.3) and oversold (PCR < 0.7) option market extremes.',
    },
    'nifty-option-theta-decay-calculator': {
        title: 'Nifty & BankNifty Option Theta Decay & Time-Risk Calculator',
        description: 'Calculate hourly option theta decay, weekend time decay impact, and holding risk for 0-DTE and weekly option buyers.',
        category: 'Options Risk',
        keywords: 'nifty option theta decay calculator, option time decay tool, banknifty theta risk clock',
        h1: 'Nifty Option Theta Decay & Time-Risk Calculator',
        summary: 'Quantify premium decay per hour to avoid holding option buys in stagnant markets.',
    },
    'cross-vs-isolated-margin-calculator': {
        title: 'Cross Margin vs Isolated Margin Liquidation Risk Calculator',
        description: 'Compare liquidation points, margin call levels, and collateral usage between Cross and Isolated margin modes in crypto leverage trading.',
        category: 'Risk Management',
        keywords: 'cross vs isolated margin calculator, binance cross margin risk, isolated margin liquidation calculator',
        h1: 'Cross Margin vs Isolated Margin Risk Comparison Tool',
        summary: 'Determine which margin mode fits your trading strategy and risk tolerance.',
    },
    'crypto-profit-calculator': {
        title: 'Crypto Profit, Tax & Staged Exit Ladder Calculator',
        description: 'Calculate net ROI, profit targets, 30% VDA tax liability, and multi-tier take-profit ladder execution prices for crypto trades.',
        category: 'Trade Planning',
        keywords: 'crypto profit calculator, crypto exit strategy ladder, crypto take profit calculator',
        h1: 'Crypto Profit & Staged Exit Strategy Calculator',
        summary: 'Design multi-target exit ladders while accounting for exchange fees and tax liabilities.',
    }
};

const FALLBACK_SHELL = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/png" href="/logo.png" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Free Trading Tools & Calculators | TradeJournall</title>
  <meta name="title" content="Free Trading Tools & Calculators | TradeJournall" />
  <meta name="description" content="Professional risk calculators, prop firm evaluation tools, and trading calculators for traders." />
</head>
<body class="bg-[#07080a] text-slate-100 font-sans">
  <div id="root"></div>
</body>
</html>`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const rawPath = req.query.path;
    const pathStr = Array.isArray(rawPath) ? rawPath.join('/') : (rawPath as string || '');
    
    // Normalize path key (extract last segment if nested)
    const segments = pathStr.split('/').filter(Boolean);
    const toolKey = segments[segments.length - 1] || pathStr;

    const baseUrl = 'https://tradejournall.com';
    const canonicalUrl = `${baseUrl}${req.url ? req.url.split('?')[0] : '/tools/' + toolKey}`;

    let indexHtml = '';
    try {
        const resp = await fetch(baseUrl, { signal: AbortSignal.timeout(3000) });
        if (resp.ok) {
            indexHtml = await resp.text();
        } else {
            indexHtml = FALLBACK_SHELL;
        }
    } catch (e) {
        console.warn("[Tool SEO] Could not fetch live index.html, using fallback shell:", e);
        indexHtml = FALLBACK_SHELL;
    }

    const meta: ToolMeta = TOOL_META_DATABASE[toolKey] || {
        title: `${toolKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} | TradeJournall`,
        description: `Use our free ${toolKey.replace(/-/g, ' ')} for risk management, profit calculation, and trade planning on TradeJournall.`,
        category: 'Trading Calculator',
        keywords: `${toolKey.replace(/-/g, ' ')}, trading calculator, trade journall risk tool`,
        h1: toolKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        summary: `Professional calculator for stock, crypto, and forex traders.`
    };

    const title = meta.title;
    const description = meta.description;
    const image = "https://tradejournall.com/logo.png";

    // Build JSON-LD Structured Data
    const jsonLdGraph: any[] = [
        {
            "@type": "SoftwareApplication",
            "name": meta.h1,
            "operatingSystem": "All Web Browsers",
            "applicationCategory": "FinanceApplication",
            "url": canonicalUrl,
            "image": image,
            "description": description,
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            }
        }
    ];

    if (meta.faq && meta.faq.length > 0) {
        jsonLdGraph.push({
            "@type": "FAQPage",
            "mainEntity": meta.faq.map(item => ({
                "@type": "Question",
                "name": item.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.a
                }
            }))
        });
    }

    const jsonLdScript = `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": jsonLdGraph })}</script>`;
    const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;

    // Semantic Pre-rendered HTML inside <div id="root"> so Googlebot reads rich content immediately
    const preRenderedHtml = `
<div id="root">
  <div class="min-h-screen bg-[#07080a] text-slate-100 font-sans py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <nav class="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
        <a href="/" class="text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-2">&larr; Back to TradeJournall</a>
        <span class="text-xs uppercase tracking-widest text-emerald-400 font-extrabold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">${meta.category}</span>
      </nav>
      <header class="mb-8 text-center sm:text-left">
        <h1 class="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">${meta.h1}</h1>
        <p class="text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed">${meta.summary}</p>
      </header>
      <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-8 backdrop-blur-md shadow-2xl">
        <div class="flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
          <div class="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl animate-pulse">📊</div>
          <h2 class="text-xl font-bold text-white">Loading Interactive Calculator...</h2>
          <p class="text-sm text-slate-400 max-w-md">Our high-precision calculation engine is loading your real-time risk, tax, and margin parameters.</p>
        </div>
      </div>
      ${meta.faq ? `
      <section class="mt-12 border-t border-slate-800 pt-8">
        <h3 class="text-xl font-bold text-white mb-6">Frequently Asked Questions (FAQ)</h3>
        <div class="space-y-4">
          ${meta.faq.map(item => `
            <div class="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
              <h4 class="font-bold text-slate-200 text-base mb-2">Q: ${item.q}</h4>
              <p class="text-slate-400 text-sm leading-relaxed">${item.a}</p>
            </div>
          `).join('')}
        </div>
      </section>
      ` : ''}
      <footer class="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-sm text-slate-400 gap-4">
        <p>&copy; 2026 TradeJournall — Free Trading Journal & Risk Suite</p>
        <a href="/" class="text-emerald-400 font-bold hover:underline">Start Free Crypto & Forex Journal &rarr;</a>
      </footer>
    </div>
  </div>
</div>`;

    indexHtml = indexHtml
        .replace(
            /<title>.*?<\/title>/gi, 
            `<title>${title}</title>\n    ${canonicalTag}\n    ${jsonLdScript}`
        )
        .replace(
            /<meta name="title" content=".*?"\s*\/>/gi, 
            `<meta name="title" content="${title}" />`
        )
        .replace(
            /<meta name="description"[\s\S]*?content=".*?"\s*\/>/gi, 
            `<meta name="description" content="${description}" />`
        )
        .replace(
            /<meta property="og:title" content=".*?"\s*\/>/gi, 
            `<meta property="og:title" content="${title}" />`
        )
        .replace(
            /<meta property="og:url" content=".*?"\s*\/>/gi, 
            `<meta property="og:url" content="${canonicalUrl}" />`
        )
        .replace(
            /<meta property="og:description"[\s\S]*?content=".*?"\s*\/>/gi, 
            `<meta property="og:description" content="${description}" />`
        )
        .replace(
            /<meta property="twitter:title" content=".*?"\s*\/>/gi, 
            `<meta property="twitter:title" content="${title}" />`
        )
        .replace(
            /<meta property="twitter:url" content=".*?"\s*\/>/gi, 
            `<meta property="twitter:url" content="${canonicalUrl}" />`
        )
        .replace(
            /<meta property="twitter:description"[\s\S]*?content=".*?"\s*\/>/gi, 
            `<meta property="twitter:description" content="${description}" />`
        )
        .replace(
            /<div id="root"><\/div>/i,
            preRenderedHtml
        );

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).send(indexHtml);
}
