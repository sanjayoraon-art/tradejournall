import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, TrendingUp, TrendingDown, Search, SkipForward, Maximize, Minimize } from 'lucide-react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts';
import { fetchBinanceKlines, BinanceKline } from '../utils/binanceApi';
import { Trade } from '../types';
import { formatNumber, getCurrencySymbol } from '../utils/helpers';

interface BacktestingScreenProps {
    theme: any;
    isDarkMode: boolean;
    primaryCurrencySymbol: string;
    addTrade: (trade: any) => void;
}

export const BacktestingScreen: React.FC<BacktestingScreenProps> = ({ theme, isDarkMode, primaryCurrencySymbol, addTrade }) => {
    // UI State
    const [symbol, setSymbol] = useState('BTCUSDT');
    const [interval, setTimeInterval] = useState('5m');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Replay State
    const [historicalData, setHistoricalData] = useState<BinanceKline[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState<1 | 2 | 5>(1); // Speed multiplier

    // Trading State
    const [activeTrade, setActiveTrade] = useState<{ type: 'Long' | 'Short', entryPrice: number, entryTime: number } | null>(null);
    const [currentPrice, setCurrentPrice] = useState(0);

    // Options State
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showSMA20, setShowSMA20] = useState(false);
    const [showSMA50, setShowSMA50] = useState(false);
    const [showVolume, setShowVolume] = useState(false);

    // Chart Refs
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<IChartApi | null>(null);
    const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

    // Dynamic Series Refs
    const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
    const sma20SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
    const sma50SeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

    const calcSMA = (data: BinanceKline[], period: number) => {
        const smaData = [];
        for (let i = 0; i < data.length; i++) {
            if (i < period - 1) continue;
            let sum = 0;
            for (let j = 0; j < period; j++) {
                sum += data[i - j].close;
            }
            smaData.push({ time: (data[i].openTime / 1000) as Time, value: sum / period });
        }
        return smaData;
    };
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const initialVisibleCandles = 100;

    // Load Data
    const handleLoadData = async () => {
        setIsLoading(true);
        setError('');
        setIsPlaying(false);
        setActiveTrade(null);
        if (intervalRef.current) clearInterval(intervalRef.current);

        try {
            // Fetch 1000 candles max to have historical context + future replay
            const data = await fetchBinanceKlines(symbol, interval, undefined, undefined, 1000);
            if (data.length < initialVisibleCandles + 10) {
                setError("Not enough historical data returned.");
                setIsLoading(false);
                return;
            }
            setHistoricalData(data);
            setCurrentIndex(initialVisibleCandles);
            setCurrentPrice(data[initialVisibleCandles].close);
            initChart(data.slice(0, initialVisibleCandles + 1));
        } catch (err: any) {
            setError(err.message || 'Failed to fetch data. Check symbol and connection.');
        } finally {
            setIsLoading(false);
        }
    };

    // Initialize Chart
    const initChart = (initialData: BinanceKline[]) => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.remove();
        }

        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { color: isDarkMode ? '#1F2937' : '#FFFFFF' }, // gray-800 or white
                textColor: isDarkMode ? '#D1D5DB' : '#374151',
            },
            grid: {
                vertLines: { color: isDarkMode ? '#374151' : '#E5E7EB' },
                horzLines: { color: isDarkMode ? '#374151' : '#E5E7EB' },
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
            rightPriceScale: {
                borderColor: isDarkMode ? '#374151' : '#E5E7EB',
            },
        });

        const series = chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

        const formattedData: CandlestickData[] = initialData.map(d => ({
            time: (d.openTime / 1000) as Time,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
        }));

        series.setData(formattedData);
        chart.timeScale().fitContent();

        // Add Indicators
        const volumeSeries = chart.addHistogramSeries({
            color: '#26a69a',
            priceFormat: { type: 'volume' },
            priceScaleId: '',
        });
        chart.priceScale('').applyOptions({
            scaleMargins: { top: 0.8, bottom: 0 }
        });
        volumeSeriesRef.current = volumeSeries;

        const sma20Series = chart.addLineSeries({ color: 'rgba(41, 98, 255, 1)', lineWidth: 2, crosshairMarkerVisible: false });
        sma20SeriesRef.current = sma20Series;

        const sma50Series = chart.addLineSeries({ color: 'rgba(255, 152, 0, 1)', lineWidth: 2, crosshairMarkerVisible: false });
        sma50SeriesRef.current = sma50Series;

        const volData = initialData.map(d => ({
            time: (d.openTime / 1000) as Time,
            value: d.volume,
            color: d.close >= d.open ? 'rgba(38, 166, 154, 0.4)' : 'rgba(239, 83, 80, 0.4)'
        }));
        volumeSeries.setData(volData);

        sma20Series.setData(calcSMA(initialData, 20));
        sma50Series.setData(calcSMA(initialData, 50));

        // Initial Visibility
        volumeSeries.applyOptions({ visible: showVolume });
        sma20Series.applyOptions({ visible: showSMA20 });
        sma50Series.applyOptions({ visible: showSMA50 });

        chartInstanceRef.current = chart;
        candleSeriesRef.current = series;
    };

    // Toggle Visibility Effects
    useEffect(() => {
        if (sma20SeriesRef.current) sma20SeriesRef.current.applyOptions({ visible: showSMA20 });
    }, [showSMA20]);

    useEffect(() => {
        if (sma50SeriesRef.current) sma50SeriesRef.current.applyOptions({ visible: showSMA50 });
    }, [showSMA50]);

    useEffect(() => {
        if (volumeSeriesRef.current) volumeSeriesRef.current.applyOptions({ visible: showVolume });
    }, [showVolume]);

    // Replay Logic
    useEffect(() => {
        if (isPlaying && historicalData.length > 0 && currentIndex < historicalData.length - 1) {
            const baseDelay = 1000;
            const delay = baseDelay / speed;

            const id = setInterval(() => {
                setCurrentIndex(prev => {
                    if (prev >= historicalData.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, delay);
            intervalRef.current = id as unknown as NodeJS.Timeout;
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPlaying, speed, historicalData.length]);

    // Update Chart on Index Change
    useEffect(() => {
        if (historicalData.length > 0 && candleSeriesRef.current && currentIndex >= initialVisibleCandles && chartInstanceRef.current) {
            const newCandle = historicalData[currentIndex];
            const time = (newCandle.openTime / 1000) as Time;

            candleSeriesRef.current.update({
                time,
                open: newCandle.open,
                high: newCandle.high,
                low: newCandle.low,
                close: newCandle.close,
            });

            if (volumeSeriesRef.current) {
                volumeSeriesRef.current.update({
                    time,
                    value: newCandle.volume,
                    color: newCandle.close >= newCandle.open ? 'rgba(38, 166, 154, 0.4)' : 'rgba(239, 83, 80, 0.4)'
                });
            }

            if (sma20SeriesRef.current && currentIndex >= 19) {
                let sum = 0;
                for (let i = 0; i < 20; i++) sum += historicalData[currentIndex - i].close;
                sma20SeriesRef.current.update({ time, value: sum / 20 });
            }

            if (sma50SeriesRef.current && currentIndex >= 49) {
                let sum = 0;
                for (let i = 0; i < 50; i++) sum += historicalData[currentIndex - i].close;
                sma50SeriesRef.current.update({ time, value: sum / 50 });
            }
            // Only scroll to realtime if we are actively playing or stepping, to keep the new candle in view
            if (isPlaying || currentIndex > initialVisibleCandles) {
                chartInstanceRef.current.timeScale().scrollToRealTime();
            }
        }
    }, [currentIndex, historicalData, isPlaying]);

    const handleNextCandle = () => {
        if (historicalData.length > 0 && currentIndex < historicalData.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    // Trading Logic
    // Trading Logic
    const handleBuy = () => {
        if (!activeTrade) {
            const entry = historicalData.length > 0 ? historicalData[currentIndex].close : currentPrice;
            setActiveTrade({ type: 'Long', entryPrice: entry, entryTime: historicalData[currentIndex].openTime });
        }
    };

    const handleSell = () => {
        if (!activeTrade) {
            const entry = historicalData.length > 0 ? historicalData[currentIndex].close : currentPrice;
            setActiveTrade({ type: 'Short', entryPrice: entry, entryTime: historicalData[currentIndex].openTime });
        }
    };

    const handleCloseTrade = () => {
        if (!activeTrade) return;

        let pnl = 0;
        const exitPriceToUse = historicalData.length > 0 && currentIndex < historicalData.length
            ? historicalData[currentIndex].close
            : currentPrice;

        if (activeTrade.type === 'Long') {
            pnl = ((exitPriceToUse - activeTrade.entryPrice) / activeTrade.entryPrice) * 1000; // Simulating $1000 position size
        } else {
            pnl = ((activeTrade.entryPrice - exitPriceToUse) / activeTrade.entryPrice) * 1000;
        }

        const newTrade = {
            symbol: symbol.toUpperCase(),
            date: new Date(activeTrade.entryTime).toISOString().split('T')[0],
            entryPrice: activeTrade.entryPrice,
            exitPrice: exitPriceToUse,
            pnl: parseFloat(pnl.toFixed(2)),
            type: activeTrade.type,
            strategy: 'Backtest',
            note: 'Backtesting simulation trade',
            isBacktest: true
        };

        addTrade(newTrade);
        setActiveTrade(null);
    };

    // Calculate Unr. PnL
    // Calculate Unr. PnL
    let currentUnrealizedPnl = 0;
    const priceToUse = historicalData.length > 0 && currentIndex < historicalData.length
        ? historicalData[currentIndex].close
        : currentPrice;

    if (activeTrade) {
        if (activeTrade.type === 'Long') {
            currentUnrealizedPnl = ((priceToUse - activeTrade.entryPrice) / activeTrade.entryPrice) * 1000;
        } else {
            currentUnrealizedPnl = ((activeTrade.entryPrice - priceToUse) / activeTrade.entryPrice) * 1000;
        }
    }

    return (
        <div className={`space-y-4 ${isFullscreen ? `fixed inset-0 z-50 p-4 md:p-8 overflow-y-auto ${theme.bg} ${theme.text}` : ''}`}>
            <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <History size={24} className="text-blue-500" /> Chart Replay
                </h2>
                <div className="flex gap-2 items-center mt-2 md:mt-0">
                    <button onClick={() => setShowSMA20(!showSMA20)} className={`px-2 py-1 text-xs rounded-md font-bold transition-colors ${showSMA20 ? 'bg-blue-600 text-white' : 'bg-gray-500/20 text-gray-500'}`}>
                        SMA 20
                    </button>
                    <button onClick={() => setShowSMA50(!showSMA50)} className={`px-2 py-1 text-xs rounded-md font-bold transition-colors ${showSMA50 ? 'bg-orange-500 text-white' : 'bg-gray-500/20 text-gray-500'}`}>
                        SMA 50
                    </button>
                    <button onClick={() => setShowVolume(!showVolume)} className={`px-2 py-1 text-xs rounded-md font-bold transition-colors ${showVolume ? 'bg-green-600 text-white' : 'bg-gray-500/20 text-gray-500'}`}>
                        Volume
                    </button>
                    <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-1.5 rounded-md bg-gray-500/20 text-gray-500 hover:text-blue-500 transition-colors ml-2 hidden sm:block">
                        {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                    </button>
                </div>
            </div>

            {/* Controls Header */}
            <div className={`${theme.card} p-4 rounded-xl border ${theme.border} flex flex-wrap gap-4 items-end`}>
                <div className="flex-1 min-w-[120px]">
                    <label className={`block text-xs font-bold mb-1 ${theme.subText}`}>Symbol</label>
                    <input
                        type="text"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                        placeholder="BTCUSDT"
                        className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${theme.input}`}
                    />
                </div>
                <div className="flex-1 min-w-[120px]">
                    <label className={`block text-xs font-bold mb-1 ${theme.subText}`}>Interval</label>
                    <select
                        value={interval}
                        onChange={(e) => setTimeInterval(e.target.value)}
                        className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${theme.input}`}
                    >
                        <option value="1m">1m</option>
                        <option value="5m">5m</option>
                        <option value="15m">15m</option>
                        <option value="1h">1H</option>
                        <option value="4h">4H</option>
                        <option value="1d">1D</option>
                    </select>
                </div>
                <button
                    onClick={handleLoadData}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2"
                >
                    {isLoading ? <RefreshCw className="animate-spin" size={20} /> : <Search size={20} />}
                    {isLoading ? 'Loading...' : 'Load'}
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500">
                    {error}
                </div>
            )}

            {/* Main Chart Area */}
            <div className={`${theme.card} p-1 rounded-xl border ${theme.border} ${isFullscreen ? 'h-[60vh] md:h-[70vh]' : 'h-[400px]'} w-full relative overflow-hidden`}>
                {historicalData.length === 0 && !isLoading && !error && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 z-10 bg-black/5">
                        Enter a symbol and hit Load to start backtesting
                    </div>
                )}
                <div ref={chartContainerRef} className="w-full h-full" />
            </div>

            {/* Replay Controls */}
            <div className={`${theme.card} p-4 rounded-xl border ${theme.border} flex justify-between items-center`}>
                <div className="flex items-center gap-2">
                    <button
                        onClick={togglePlay}
                        disabled={historicalData.length === 0}
                        className={`p-3 rounded-lg flex items-center justify-center transition-all ${isPlaying ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}
                    >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    <button
                        onClick={handleNextCandle}
                        disabled={isPlaying || historicalData.length === 0}
                        className="p-3 bg-gray-500/20 text-gray-400 hover:text-white rounded-lg transition-all disabled:opacity-50"
                    >
                        <SkipForward size={24} />
                    </button>
                    <div className="flex items-center bg-gray-800 rounded-lg p-1 ml-4 border border-gray-700">
                        {[1, 2, 5].map(s => (
                            <button
                                key={s}
                                onClick={() => setSpeed(s as any)}
                                className={`px-3 py-1 text-sm rounded cursor-pointer transition-colors ${speed === s ? 'bg-blue-600 text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                            >
                                {s}x
                            </button>
                        ))}
                    </div>
                </div>
                <div className="text-sm font-mono text-gray-400">
                    {historicalData.length > 0 && currentIndex < historicalData.length ? new Date(historicalData[currentIndex].openTime).toLocaleString() : '--'}
                </div>
            </div>

            {/* Trading Area */}
            {historicalData.length > 0 && (
                <div className={`${theme.card} p-4 rounded-xl border ${theme.border} grid grid-cols-1 md:grid-cols-2 gap-6`}>
                    <div className="flex gap-4">
                        <button
                            onClick={handleBuy}
                            disabled={!!activeTrade}
                            className={`flex-1 py-4 font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${!activeTrade ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30 border border-green-500/50' : 'opacity-30 cursor-not-allowed bg-gray-800 text-gray-500'}`}
                        >
                            <TrendingUp size={24} />
                            <span>BUY LONG</span>
                        </button>
                        <button
                            onClick={handleSell}
                            disabled={!!activeTrade}
                            className={`flex-1 py-4 font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${!activeTrade ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/50' : 'opacity-30 cursor-not-allowed bg-gray-800 text-gray-500'}`}
                        >
                            <TrendingDown size={24} />
                            <span>SELL SHORT</span>
                        </button>
                    </div>

                    <div className="flex flex-col justify-center border-l border-gray-700/50 pl-6">
                        <h3 className="text-sm text-gray-400 mb-1">Active Simulation ($1000 size)</h3>
                        {activeTrade ? (
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className={`font-bold ${activeTrade.type === 'Long' ? 'text-green-500' : 'text-red-500'}`}>
                                        {activeTrade.type} @ {activeTrade.entryPrice}
                                    </span>
                                    <span className={`text-xl font-black ${currentUnrealizedPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {currentUnrealizedPnl >= 0 ? '+' : ''}${currentUnrealizedPnl.toFixed(2)}
                                    </span>
                                </div>
                                <button
                                    onClick={handleCloseTrade}
                                    className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-all"
                                >
                                    Close Position
                                </button>
                            </div>
                        ) : (
                            <div className="text-gray-500 italic text-center py-4">
                                No active position.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Lucide Icon for History that isn't imported from lucide-react above by default
const History = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
    </svg>
);
