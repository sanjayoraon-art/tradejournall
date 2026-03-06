import { BinanceKline } from './binanceApi';

/**
 * Fetches historical K-lines (candlesticks) from Yahoo Finance via a public CORS proxy.
 * This allows fetching data for Stocks (e.g. AAPL) and Forex (e.g. EURUSD=X).
 * 
 * Yahoo API Constraints:
 * - 1m: max 7 days
 * - 2m/5m/15m/30m: max 60 days
 * - 60m/1h: max 730 days
 * - 1d+: max available
 */
export const fetchYahooKlines = async (
    symbol: string,
    interval: string,
    limit: number = 500
): Promise<BinanceKline[]> => {
    try {
        const intervalMap: Record<string, string> = {
            '1m': '1m', '3m': '2m', '5m': '5m', '15m': '15m',
            '30m': '30m', '1h': '1h', '2h': '1h', '4h': '1h',
            '1d': '1d', '1w': '1wk', '1M': '1mo'
        };

        const yInterval = intervalMap[interval] || '1d';

        // Determine valid range based on interval
        let range = '1y';
        if (yInterval === '1m') range = '7d';
        else if (['2m', '5m', '15m', '30m'].includes(yInterval)) range = '60d';
        else if (['1h', '60m'].includes(yInterval)) range = '2y';
        else range = 'max';

        const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol.toUpperCase())}?interval=${yInterval}&range=${range}`;

        // Use AllOrigins with /get to handle cases where Yahoo doesn't return raw JSON sometimes
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}&timestamp=${Date.now()}`;

        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`Proxy failed: ${response.statusText}`);

        const resultDict = await response.json();
        const json = JSON.parse(resultDict.contents);

        if (json.chart.error) {
            throw new Error(`Yahoo Error: ${json.chart.error.description || JSON.stringify(json.chart.error)}`);
        }

        const data = json.chart.result?.[0];
        if (!data || !data.timestamp || !data.indicators?.quote?.[0]) {
            throw new Error("Invalid or empty data returned from Yahoo");
        }

        const timestamps = data.timestamp;
        const q = data.indicators.quote[0];
        const klines: BinanceKline[] = [];

        for (let i = 0; i < timestamps.length; i++) {
            // Filter out nulls
            if (q.open[i] == null || q.close[i] == null || q.low[i] == null || q.high[i] == null) continue;

            klines.push({
                timestamp: timestamps[i] * 1000,
                open: parseFloat(q.open[i].toFixed(4)),
                high: parseFloat(q.high[i].toFixed(4)),
                low: parseFloat(q.low[i].toFixed(4)),
                close: parseFloat(q.close[i].toFixed(4)),
                volume: parseFloat((q.volume[i] || 0).toFixed(0)),
                closeTime: (i < timestamps.length - 1) ? timestamps[i + 1] * 1000 : timestamps[i] * 1000 + 3600000
            });
        }

        // Apply limit at the end to get the most recent ones
        return klines.slice(-limit);

    } catch (error) {
        console.error("Error fetching Yahoo Klines:", error);
        throw error;
    }
};
