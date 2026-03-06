export interface BinanceKline {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    closeTime: number;
}

/**
 * Fetches historical K-lines (candlesticks) from Binance API
 * @param symbol The trading pair symbol (e.g., 'BTCUSDT')
 * @param interval The timeframe (e.g., '1m', '5m', '15m', '1h', '4h', '1d')
 * @param startTime Optional start time in ms
 * @param endTime Optional end time in ms
 * @param limit Optional limit (max 1000)
 * @returns Array of Kline data
 */
export const fetchBinanceKlines = async (
    symbol: string,
    interval: string,
    startTime?: number,
    endTime?: number,
    limit: number = 500
): Promise<BinanceKline[]> => {
    try {
        let url = `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`;

        if (startTime) url += `&startTime=${startTime}`;
        if (endTime) url += `&endTime=${endTime}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Binance API error: ${response.statusText}`);
        }

        const data = await response.json();

        // Map Binance response array to our interface
        // Binance format: [Open time, Open, High, Low, Close, Volume, Close time, Quote asset volume, Number of trades, Taker buy base asset volume, Taker buy quote asset volume, Ignore]
        return data.map((d: any[]) => ({
            timestamp: d[0],
            open: parseFloat(d[1]),
            high: parseFloat(d[2]),
            low: parseFloat(d[3]),
            close: parseFloat(d[4]),
            volume: parseFloat(d[5]),
            closeTime: d[6],
        }));
    } catch (error) {
        console.error("Error fetching Binance Klines:", error);
        throw error;
    }
};
