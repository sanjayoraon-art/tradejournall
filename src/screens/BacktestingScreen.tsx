import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, FastForward, RefreshCw, TrendingUp, TrendingDown, Clock, Search, SkipForward } from 'lucide-react';
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
    const [interval, setInterval] = useState('5m');
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

    // Chart References
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<IChartApi | null>(null);
    const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
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
            initChart(data.slice(0, initialVisibleCandles));
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

        chartInstanceRef.current = chart;
        candleSeriesRef.current = series;
    };

    // Replay Logic
    useEffect(() => {
        if (isPlaying && historicalData.length > 0 && currentIndex < historicalData.length - 1) {
            const baseDelay = 1000;
            const delay = baseDelay / speed;

            intervalRef.current = setInterval(() => {
                setCurrentIndex(prev => {
                    if (prev >= historicalData.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, delay) as any;
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPlaying, speed, historicalData, currentIndex]);

    // Update Chart on Index Change
    useEffect(() => {
        if (historicalData.length > 0 && candleSeriesRef.current && currentIndex >= initialVisibleCandles) {
            const newCandle = historicalData[currentIndex];
            candleSeriesRef.current.update({
                time: (newCandle.openTime / 1000) as Time,
                open: newCandle.open,
                high: newCandle.high,
                low: newCandle.low,
                close: newCandle.close,
            });
            setCurrentPrice(newCandle.close);
        }
    }, [currentIndex, historicalData]);

    const handleNextCandle = () => {
        if (historicalData.length > 0 && currentIndex < historicalData.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    // Trading Logic
    const handleBuy = () => {
        if (!activeTrade) {
            setActiveTrade({ type: 'Long', entryPrice: currentPrice, entryTime: historicalData[currentIndex].openTime });
        }
    };

    const handleSell = () => {
        if (!activeTrade) {
            setActiveTrade({ type: 'Short', entryPrice: currentPrice, entryTime: historicalData[currentIndex].openTime });
        }
    };

    const handleCloseTrade = () => {
        if (!activeTrade) return;

        let pnl = 0;
        if (activeTrade.type === 'Long') {
            pnl = ((currentPrice - activeTrade.entryPrice) / activeTrade.entryPrice) * 1000; // Simulating $1000 position size
        } else {
            pnl = ((activeTrade.entryPrice - currentPrice) / activeTrade.entryPrice) * 1000;
        }

        const newTrade = {
            symbol: symbol.toUpperCase(),
            date: new Date(activeTrade.entryTime).toISOString().split('T')[0],
            entryPrice: activeTrade.entryPrice,
            exitPrice: currentPrice,
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
    let currentUnrealizedPnl = 0;
    if (activeTrade) {
        if (activeTrade.type === 'Long') {
            currentUnrealizedPnl = ((currentPrice - activeTrade.entryPrice) / activeTrade.entryPrice) * 1000;
        } else {
            currentUnrealizedPnl = ((activeTrade.entryPrice - currentPrice) / activeTrade.entryPrice) * 1000;
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <History size={24} className="text-blue-500" /> Chart Replay
                </h2>
                <p className="text-sm text-gray-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    Free data via Binance Public API
                </p>
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
                        onChange={(e) => setInterval(e.target.value)}
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
            <div className={`${theme.card} p-1 rounded-xl border ${theme.border} h-[400px] w-full relative overflow-hidden`}>
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
