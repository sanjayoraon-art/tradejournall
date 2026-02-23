export interface Trade {
    id?: string;
    symbol: string;
    date: string;
    entryPrice: number | string;
    exitPrice: number | string;
    pnlAmount: number;
    pnlAmountValue: string;
    pnl: number; // Added to match usage
    resultType: 'Profit' | 'Loss';
    tradeType: 'Long' | 'Short';
    currency: string;
    marketConcept: string;
    tradeStyle: string;
    psychology: string;
    note: string;
    isFavorite?: boolean;
    timestamp?: number;
}

export interface MetricCard {
    title: string;
    value: number;
    change: number;
    units: string;
    prefix?: string;
    valueDecimals: number;
    comparison?: string;
}

export interface ChartData {
    name?: string;
    month?: string;
    pnl: number;
}

export interface CandleData {
    id?: string;
    symbol: string;
    open: number;
    close: number;
    high: number;
    low: number;
    date: string;
}

export interface PerformanceStats {
    totalPnl: number;
    totalTrades: number;
    winRate: number;
    expectancy: number;
    metricsCards: MetricCard[];
    baseCurrencyCode: string;
    baseCurrencySymbol: string;
    strategyProfitData: ChartData[];
    monthlyPnlData: ChartData[];
    perTradeCandles: CandleData[];
    totalProfit: number;
    totalLoss: number;
}
