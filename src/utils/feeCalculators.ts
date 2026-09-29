/**
 * TradeJournall - Financial Calculation Engine
 * Highly accurate, zero-latency client-side calculations for Indian Stock Brokerage (Zerodha vs Groww)
 * and Crypto Trading Fees & Taxes (Delta Exchange vs CoinDCX).
 */

export interface StockInput {
  segment: 'options' | 'intraday';
  exchange: 'NSE' | 'BSE';
  buyPrice: number;
  sellPrice: number;
  quantity: number;
}

export interface TaxBreakdown {
  brokerage: number;
  stt: number;
  exchangeCharges: number;
  sebiCharges: number;
  stampDuty: number;
  gst: number;
  totalCharges: number;
}

export interface StockCalculationResult {
  brokerName: string;
  turnoverBuy: number;
  turnoverSell: number;
  totalTurnover: number;
  grossPnL: number;
  charges: TaxBreakdown;
  netPnL: number;
  breakevenPoints: number;
}

export interface StockComparisonResult {
  zerodha: StockCalculationResult;
  groww: StockCalculationResult;
  differenceNetPnL: number;
  cheaperBroker: 'Zerodha' | 'Groww' | 'Equal';
  savingsAmount: number;
}

export interface CryptoInput {
  margin: number; // Initial Margin in USDT or INR
  leverage: number; // e.g., 1 to 100
  entryPrice: number;
  exitPrice: number;
  positionType: 'long' | 'short';
  orderType: 'maker' | 'taker';
}

export interface CryptoCalculationResult {
  exchangeName: string;
  positionSize: number;
  quantity: number;
  grossPnL: number;
  roiPercentage: number;
  entryFee: number;
  exitFee: number;
  totalExchangeFees: number;
  tdsDeducted: number; // 1% Sec 194S
  netProfitBeforeIncomeTax: number;
  estimatedIncomeTax: number; // 30% Sec 115BBH
  netRealizedProfit: number;
}

export interface CryptoComparisonResult {
  deltaExchange: CryptoCalculationResult;
  coinDcx: CryptoCalculationResult;
  differenceNetProfit: number;
  cheaperExchange: 'Delta Exchange' | 'CoinDCX' | 'Equal';
  savingsAmount: number;
}

/**
 * Calculates stock trading charges for Zerodha and Groww (Intraday & Options).
 */
export function calculateStockCharges(input: StockInput): StockComparisonResult {
  const { segment, buyPrice, sellPrice, quantity } = input;
  const turnoverBuy = buyPrice * quantity;
  const turnoverSell = sellPrice * quantity;
  const totalTurnover = turnoverBuy + turnoverSell;
  const grossPnL = (sellPrice - buyPrice) * quantity;

  // --- ZERODHA COMPUTATION ---
  const zerodhaCharges = computeZerodhaCharges(segment, turnoverBuy, turnoverSell, quantity);
  const zerodhaNetPnL = grossPnL - zerodhaCharges.totalCharges;
  const zerodhaBreakeven = quantity > 0 ? zerodhaCharges.totalCharges / quantity : 0;

  const zerodhaResult: StockCalculationResult = {
    brokerName: 'Zerodha',
    turnoverBuy,
    turnoverSell,
    totalTurnover,
    grossPnL,
    charges: zerodhaCharges,
    netPnL: zerodhaNetPnL,
    breakevenPoints: Number(zerodhaBreakeven.toFixed(2)),
  };

  // --- GROWW COMPUTATION ---
  const growwCharges = computeGrowwCharges(segment, turnoverBuy, turnoverSell, quantity);
  const growwNetPnL = grossPnL - growwCharges.totalCharges;
  const growwBreakeven = quantity > 0 ? growwCharges.totalCharges / quantity : 0;

  const growwResult: StockCalculationResult = {
    brokerName: 'Groww',
    turnoverBuy,
    turnoverSell,
    totalTurnover,
    grossPnL,
    charges: growwCharges,
    netPnL: growwNetPnL,
    breakevenPoints: Number(growwBreakeven.toFixed(2)),
  };

  const differenceNetPnL = Math.abs(zerodhaNetPnL - growwNetPnL);
  let cheaperBroker: 'Zerodha' | 'Groww' | 'Equal' = 'Equal';
  if (zerodhaCharges.totalCharges < growwCharges.totalCharges) {
    cheaperBroker = 'Zerodha';
  } else if (growwCharges.totalCharges < zerodhaCharges.totalCharges) {
    cheaperBroker = 'Groww';
  }

  return {
    zerodha: zerodhaResult,
    groww: growwResult,
    differenceNetPnL: Number(differenceNetPnL.toFixed(2)),
    cheaperBroker,
    savingsAmount: Number(differenceNetPnL.toFixed(2)),
  };
}

function computeZerodhaCharges(
  segment: 'options' | 'intraday',
  tBuy: number,
  tSell: number,
  qty: number
): TaxBreakdown {
  let brokerage = 0;
  let stt = 0;
  let exchangeCharges = 0;
  let stampDuty = 0;

  if (segment === 'intraday') {
    // Brokerage: Min ₹20 or 0.03% per order
    const buyBrokerage = Math.min(20, tBuy * 0.0003);
    const sellBrokerage = Math.min(20, tSell * 0.0003);
    brokerage = buyBrokerage + sellBrokerage;

    // STT: 0.025% on Sell side only
    stt = tSell * 0.00025;

    // Exchange turnover charges: NSE 0.00297%
    exchangeCharges = (tBuy + tSell) * 0.0000297;

    // Stamp duty: 0.003% on Buy side
    stampDuty = tBuy * 0.00003;
  } else {
    // Options
    // Flat ₹20 per executed order (Buy + Sell = ₹40)
    brokerage = 40;

    // STT: 0.0625% on Sell side Premium
    stt = tSell * 0.000625;

    // Exchange turnover charges: NSE Options 0.0355% on premium
    exchangeCharges = (tBuy + tSell) * 0.000355;

    // Stamp duty: 0.003% on Buy side premium
    stampDuty = tBuy * 0.00003;
  }

  // SEBI turnover charges: ₹10 per Crore (0.0001%)
  const sebiCharges = (tBuy + tSell) * 0.000001;

  // GST: 18% on (Brokerage + Exchange Charges + SEBI Charges)
  const gst = (brokerage + exchangeCharges + sebiCharges) * 0.18;

  const totalCharges = brokerage + stt + exchangeCharges + sebiCharges + stampDuty + gst;

  return {
    brokerage: Number(brokerage.toFixed(2)),
    stt: Number(stt.toFixed(2)),
    exchangeCharges: Number(exchangeCharges.toFixed(2)),
    sebiCharges: Number(sebiCharges.toFixed(2)),
    stampDuty: Number(stampDuty.toFixed(2)),
    gst: Number(gst.toFixed(2)),
    totalCharges: Number(totalCharges.toFixed(2)),
  };
}

function computeGrowwCharges(
  segment: 'options' | 'intraday',
  tBuy: number,
  tSell: number,
  qty: number
): TaxBreakdown {
  let brokerage = 0;
  let stt = 0;
  let exchangeCharges = 0;
  let stampDuty = 0;

  if (segment === 'intraday') {
    // Groww Intraday: Min ₹20 or 0.05% per order
    const buyBrokerage = Math.min(20, tBuy * 0.0005);
    const sellBrokerage = Math.min(20, tSell * 0.0005);
    brokerage = buyBrokerage + sellBrokerage;

    stt = tSell * 0.00025;
    exchangeCharges = (tBuy + tSell) * 0.0000297;
    stampDuty = tBuy * 0.00003;
  } else {
    // Options: Flat ₹20 per executed order (₹40 total)
    brokerage = 40;
    stt = tSell * 0.000625;
    exchangeCharges = (tBuy + tSell) * 0.000355;
    stampDuty = tBuy * 0.00003;
  }

  const sebiCharges = (tBuy + tSell) * 0.000001;
  const gst = (brokerage + exchangeCharges + sebiCharges) * 0.18;
  const totalCharges = brokerage + stt + exchangeCharges + sebiCharges + stampDuty + gst;

  return {
    brokerage: Number(brokerage.toFixed(2)),
    stt: Number(stt.toFixed(2)),
    exchangeCharges: Number(exchangeCharges.toFixed(2)),
    sebiCharges: Number(sebiCharges.toFixed(2)),
    stampDuty: Number(stampDuty.toFixed(2)),
    gst: Number(gst.toFixed(2)),
    totalCharges: Number(totalCharges.toFixed(2)),
  };
}

/**
 * Calculates Crypto Futures & Spot Fees, 1% TDS, and 30% Flat Tax (Delta Exchange vs CoinDCX).
 */
export function calculateCryptoFees(input: CryptoInput): CryptoComparisonResult {
  const { margin, leverage, entryPrice, exitPrice, positionType, orderType } = input;
  const positionSize = margin * leverage;
  const quantity = entryPrice > 0 ? positionSize / entryPrice : 0;
  const exitPositionSize = quantity * exitPrice;

  // Gross PnL
  const grossPnL = positionType === 'long'
    ? (exitPrice - entryPrice) * quantity
    : (entryPrice - exitPrice) * quantity;

  const roiPercentage = margin > 0 ? (grossPnL / margin) * 100 : 0;

  // --- DELTA EXCHANGE INDIA COMPUTATION ---
  // Delta Fee Rates: Maker = 0.02% (0.0002), Taker = 0.05% (0.0005)
  const deltaFeeRate = orderType === 'maker' ? 0.0002 : 0.0005;
  const deltaResult = computeCryptoExchangeResult(
    'Delta Exchange',
    positionSize,
    exitPositionSize,
    quantity,
    grossPnL,
    roiPercentage,
    deltaFeeRate,
    margin
  );

  // --- COINDCX FUTURES COMPUTATION ---
  // CoinDCX Fee Rates: Maker = 0.025% (0.00025), Taker = 0.075% (0.00075)
  const coinDcxFeeRate = orderType === 'maker' ? 0.00025 : 0.00075;
  const coinDcxResult = computeCryptoExchangeResult(
    'CoinDCX',
    positionSize,
    exitPositionSize,
    quantity,
    grossPnL,
    roiPercentage,
    coinDcxFeeRate,
    margin
  );

  const differenceNetProfit = Math.abs(deltaResult.netRealizedProfit - coinDcxResult.netRealizedProfit);
  let cheaperExchange: 'Delta Exchange' | 'CoinDCX' | 'Equal' = 'Equal';
  if (deltaResult.totalExchangeFees < coinDcxResult.totalExchangeFees) {
    cheaperExchange = 'Delta Exchange';
  } else if (coinDcxResult.totalExchangeFees < deltaResult.totalExchangeFees) {
    cheaperExchange = 'CoinDCX';
  }

  return {
    deltaExchange: deltaResult,
    coinDcx: coinDcxResult,
    differenceNetProfit: Number(differenceNetProfit.toFixed(2)),
    cheaperExchange,
    savingsAmount: Number(differenceNetProfit.toFixed(2)),
  };
}

function computeCryptoExchangeResult(
  exchangeName: string,
  entryPos: number,
  exitPos: number,
  quantity: number,
  grossPnL: number,
  roiPercentage: number,
  feeRate: number,
  margin: number
): CryptoCalculationResult {
  const entryFee = entryPos * feeRate;
  const exitFee = exitPos * feeRate;
  const totalExchangeFees = entryFee + exitFee;

  // 1% TDS deducted on sell transaction value (Sec 194S)
  const tdsDeducted = exitPos * 0.01;

  // Net Profit before income tax = Gross PnL - Total Exchange Fees
  const netProfitBeforeIncomeTax = grossPnL - totalExchangeFees;

  // Indian Crypto Tax: Flat 30% on positive profits (Sec 115BBH)
  const estimatedIncomeTax = netProfitBeforeIncomeTax > 0 ? netProfitBeforeIncomeTax * 0.30 : 0;

  // Net Realized Profit post tax and fees
  const netRealizedProfit = netProfitBeforeIncomeTax - estimatedIncomeTax;

  return {
    exchangeName,
    positionSize: Number(entryPos.toFixed(2)),
    quantity: Number(quantity.toFixed(4)),
    grossPnL: Number(grossPnL.toFixed(2)),
    roiPercentage: Number(roiPercentage.toFixed(2)),
    entryFee: Number(entryFee.toFixed(2)),
    exitFee: Number(exitFee.toFixed(2)),
    totalExchangeFees: Number(totalExchangeFees.toFixed(2)),
    tdsDeducted: Number(tdsDeducted.toFixed(2)),
    netProfitBeforeIncomeTax: Number(netProfitBeforeIncomeTax.toFixed(2)),
    estimatedIncomeTax: Number(estimatedIncomeTax.toFixed(2)),
    netRealizedProfit: Number(netRealizedProfit.toFixed(2)),
  };
}
