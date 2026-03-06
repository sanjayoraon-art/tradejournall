import { BinanceKline } from './binanceApi';

/**
 * Fetches historical K-lines (candlesticks) from Yahoo Finance via a public CORS proxy.
 * This allows fetching data for Stocks (e.g. AAPL) and Forex (e.g. EURUSD=X) without a backend.
 * 
 * Note: Public proxies can be rate-limited.
 */
export const fetchYahooKlines = async (
    symbol: string,
    interval: string, // Expected format: '1m', '5m', '15m', '30m', '1h', '1d', '1wk', '1mo'
    limit: number = 500
): Promise<BinanceKline[]> => {
    try {
        // Map common Binance intervals to Yahoo intervals
        const intervalMap: Record<string, string> = {
            '1m': '1m',
            '3m': '1m', // Yahoo doesn't support 3m natively, fallback to 1m requires aggregation (taking shortcut here)
            '5m': '5m',
            '15m': '15m',
            '30m': '30m',
            '1h': '1h',
            '2h': '1h', // Fallback
            '4h': '1h', // Fallback 
            '1d': '1d',
            '1w': '1wk',
        };

        const yInterval = intervalMap[interval] || '1d';

        // Yahoo Finance chart API endpoint
        const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=${yInterval}&range=1y`;

        // Using corsproxy.io to bypass browser CORS restrictions
        const proxyUrl = 'https://corsproxy.io/?url=';
        const url = proxyUrl + encodeURIComponent(targetUrl);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Yahoo Finance API error: ${response.statusText}`);
        }

        const json = await response.json();

        if (!json.chart || !json.chart.result || json.chart.result.length === 0) {
            throw new Error(`No data found for symbol: ${symbol}`);
        }

        const result = json.chart.result[0];
        const timestamps = result.timestamp;

        if (!timestamps || timestamps.length === 0) {
            throw new Error(`No timestamp data found for symbol: ${symbol}`);
        }

        const quote = result.indicators.quote[0];

        if (!quote) {
            throw new Error(`No quote data found for symbol: ${symbol}`);
        }

        // Map to our BinanceKline format so the chart doesn't need to care where it came from
        const klines: BinanceKline[] = [];

        for (let i = 0; i < timestamps.length; i++) {
            // Yahoo sometimes has nulls for missing periods
            if (quote.open[i] === null || quote.high[i] === null || quote.low[i] === null || quote.close[i] === null) {
                continue;
            }

            klines.push({
                timestamp: timestamps[i] * 1000, // Convert to ms
                open: quote.open[i],
                high: quote.high[i],
                low: quote.low[i],
                close: quote.close[i],
                volume: quote.volume[i] || 0,
                closeTime: timestamps[i] * 1000,
            });
        }

        // Return latest `limit` records
        return klines.slice(-limit);

    } catch (error) {
        console.error("Error fetching Yahoo Klines:", error);
        throw error;
    }
};
