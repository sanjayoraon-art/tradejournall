import React, { useState, useEffect, useRef } from 'react';
import {
    Play, Pause, RefreshCw, TrendingUp, TrendingDown, Search,
    SkipForward, Maximize, Minimize, MousePointer, Trash2, ChevronDown
} from 'lucide-react';
// klinecharts is loaded via CDN (window.klinecharts) to avoid Rollup bundling issues
// We use type-only imports for TypeScript, but access the runtime API via the global
import type { Chart, KLineData } from 'klinecharts';
const _kc = () => (window as any).klinecharts as typeof import('klinecharts');
const kcInit: typeof import('klinecharts')['init'] = (...args) => _kc().init(...args);
const kcDispose: typeof import('klinecharts')['dispose'] = (...args) => _kc().dispose(...args);
import { fetchBinanceKlines, BinanceKline } from '../utils/binanceApi';


interface BacktestingScreenProps {
    theme: any;
    isDarkMode: boolean;
    primaryCurrencySymbol: string;
    addTrade: (trade: any) => void;
}

// ─── Indicator definitions ────────────────────────────────────────────────────
// "main" pane indicators go on top of candles; "sub" get their own pane below.
const MAIN_PANE_INDICATORS = ['MA', 'EMA', 'SMA', 'BBI', 'BOLL', 'SAR'];
const ALL_INDICATORS: { name: string; label: string }[] = [
    { name: 'MA', label: 'MA' },
    { name: 'EMA', label: 'EMA' },
    { name: 'SMA', label: 'SMA' },
    { name: 'BBI', label: 'BBI' },
    { name: 'BOLL', label: 'BOLL' },
    { name: 'SAR', label: 'SAR' },
    { name: 'VOL', label: 'VOL' },
    { name: 'MACD', label: 'MACD' },
    { name: 'KDJ', label: 'KDJ' },
    { name: 'RSI', label: 'RSI' },
    { name: 'CCI', label: 'CCI' },
    { name: 'DMI', label: 'DMI' },
    { name: 'WR', label: 'WR' },
    { name: 'MTM', label: 'MTM' },
    { name: 'ROC', label: 'ROC' },
    { name: 'BIAS', label: 'BIAS' },
    { name: 'BRAR', label: 'BRAR' },
    { name: 'OBV', label: 'OBV' },
    { name: 'VR', label: 'VR' },
    { name: 'CR', label: 'CR' },
    { name: 'PSY', label: 'PSY' },
    { name: 'DMA', label: 'DMA' },
    { name: 'TRIX', label: 'TRIX' },
    { name: 'EMV', label: 'EMV' },
    { name: 'AO', label: 'AO' },
    { name: 'PVT', label: 'PVT' },
];

// ─── Drawing tool definitions ─────────────────────────────────────────────────
const DRAWING_TOOLS: { name: string; label: string; icon: string }[] = [
    { name: 'segment', label: 'Trend Line', icon: '↗' },
    { name: 'rayLine', label: 'Ray', icon: '→' },
    { name: 'straightLine', label: 'Extended Line', icon: '↔' },
    { name: 'horizontalStraightLine', label: 'Horizontal Line', icon: '—' },
    { name: 'verticalStraightLine', label: 'Vertical Line', icon: '|' },
    { name: 'priceLine', label: 'Price Line', icon: '$' },
    { name: 'parallelStraightLine', label: 'Parallel Channel', icon: '⫼' },
    { name: 'fibonacciLine', label: 'Fibonacci', icon: 'φ' },
    { name: 'rect', label: 'Rectangle', icon: '▭' },
    { name: 'circle', label: 'Circle', icon: '○' },
    { name: 'triangle', label: 'Triangle', icon: '△' },
    { name: 'text', label: 'Text', icon: 'T' },
    { name: 'arrow', label: 'Arrow', icon: '➜' },
];

// ─── Candle types ─────────────────────────────────────────────────────────────
const CANDLE_TYPES: { value: string; label: string }[] = [
    { value: 'candle_solid', label: '🕯 Candle' },
    { value: 'candle_stroke', label: '□ Hollow' },
    { value: 'ohlc', label: '| OHLC' },
    { value: 'area', label: '~ Area' },
];

const initialVisibleCandles = 100;

export const BacktestingScreen: React.FC<BacktestingScreenProps> = ({
    theme, isDarkMode, primaryCurrencySymbol, addTrade
}) => {
    // ── UI State ───────────────────────────────────────────────────────────────
    const [symbol, setSymbol] = useState('BTCUSDT');
    const [timeInterval, setTimeInterval] = useState('5m');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isFullscreen, setIsFullscreen] = useState(false);

    // ── Replay State ───────────────────────────────────────────────────────────
    const [historicalData, setHistoricalData] = useState<BinanceKline[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState<1 | 2 | 5>(1);

    // ── Trading State ──────────────────────────────────────────────────────────
    const [activeTrade, setActiveTrade] = useState<{
        type: 'Long' | 'Short'; entryPrice: number; entryTime: number;
    } | null>(null);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [positionSize, setPositionSize] = useState(1000);

    // ── Indicator State ────────────────────────────────────────────────────────
    // Tracks which indicators are currently active (to allow toggle)
    const [activeIndicators, setActiveIndicators] = useState<Set<string>>(new Set(['VOL', 'MA']));
    const [showIndicatorMenu, setShowIndicatorMenu] = useState(false);

    // ── Drawing Tool State ─────────────────────────────────────────────────────
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [showToolsMenu, setShowToolsMenu] = useState(false);

    // ── Candle Type ────────────────────────────────────────────────────────────
    const [candleType, setCandleType] = useState('candle_solid');
    const [showCandleMenu, setShowCandleMenu] = useState(false);

    // ── Chart Refs ─────────────────────────────────────────────────────────────
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // ─────────────────────────────────────────────────────────────────────────
    // Load Data
    // ─────────────────────────────────────────────────────────────────────────
    const handleLoadData = async () => {
        setIsLoading(true);
        setError('');
        setIsPlaying(false);
        setActiveTrade(null);
        setActiveTool(null);
        if (intervalRef.current) clearInterval(intervalRef.current);

        try {
            const data = await fetchBinanceKlines(symbol, timeInterval, undefined, undefined, 1000);
            if (data.length < initialVisibleCandles + 10) {
                setError('Not enough historical data returned.');
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

    // ─────────────────────────────────────────────────────────────────────────
    // Initialize Chart
    // ─────────────────────────────────────────────────────────────────────────
    const initChart = (initialData: BinanceKline[]) => {
        if (!chartContainerRef.current) return;

        if (chartInstanceRef.current) {
            kcDispose(chartContainerRef.current);
            chartInstanceRef.current = null;
        }

        const chart = kcInit(chartContainerRef.current);
        if (!chart) return;

        applyChartTheme(chart);

        // Default indicators: VOL in its own pane, MA on candle pane
        chart.createIndicator('VOL', true, { id: 'pane_vol' });
        chart.createIndicator('MA', false, { id: 'candle_pane' });

        const formattedData: KLineData[] = initialData.map(d => ({
            timestamp: d.timestamp,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
            volume: d.volume,
        }));

        chart.applyNewData(formattedData);
        chartInstanceRef.current = chart;
        setActiveIndicators(new Set(['VOL', 'MA']));
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Apply Theme to Chart
    // ─────────────────────────────────────────────────────────────────────────
    const applyChartTheme = (chart: Chart) => {
        chart.setStyles({
            grid: {
                show: true,
                horizontal: { color: isDarkMode ? '#374151' : '#E5E7EB' },
                vertical: { color: isDarkMode ? '#374151' : '#E5E7EB' },
            },
            candle: {
                type: candleType as any,
                bar: {
                    upColor: '#26a69a',
                    downColor: '#ef5350',
                    upBorderColor: '#26a69a',
                    downBorderColor: '#ef5350',
                    upWickColor: '#26a69a',
                    downWickColor: '#ef5350',
                },
                area: {
                    lineColor: '#2196F3',
                    backgroundColor: [
                        { offset: 0, color: 'rgba(33,150,243,0.3)' },
                        { offset: 1, color: 'rgba(33,150,243,0.0)' },
                    ],
                },
            },
            xAxis: {
                axisLine: { color: isDarkMode ? '#374151' : '#E5E7EB' },
                tickLine: { color: isDarkMode ? '#374151' : '#E5E7EB' },
                tickText: { color: isDarkMode ? '#D1D5DB' : '#374151' },
            },
            yAxis: {
                axisLine: { color: isDarkMode ? '#374151' : '#E5E7EB' },
                tickLine: { color: isDarkMode ? '#374151' : '#E5E7EB' },
                tickText: { color: isDarkMode ? '#D1D5DB' : '#374151' },
            },
        });
    };

    // Update candle type live when user changes it
    useEffect(() => {
        if (!chartInstanceRef.current) return;
        chartInstanceRef.current.setStyles({
            candle: { type: candleType as any },
        });
        setShowCandleMenu(false);
    }, [candleType]);

    // ─────────────────────────────────────────────────────────────────────────
    // Indicator Management
    // ─────────────────────────────────────────────────────────────────────────
    const getPaneIdForIndicator = (name: string) => {
        if (MAIN_PANE_INDICATORS.includes(name)) return 'candle_pane';
        if (name === 'VOL') return 'pane_vol';
        // Each sub-indicator gets its own named pane so they don't overlap
        return `pane_${name.toLowerCase()}`;
    };

    const handleToggleIndicator = (name: string) => {
        if (!chartInstanceRef.current) return;
        const paneId = getPaneIdForIndicator(name);

        if (activeIndicators.has(name)) {
            // Remove indicator
            try {
                if (MAIN_PANE_INDICATORS.includes(name)) {
                    // On main pane, remove by name (keeps candle pane itself)
                    chartInstanceRef.current.removeIndicator('candle_pane', name);
                } else {
                    // Sub-pane indicators — remove the whole pane
                    chartInstanceRef.current.removeIndicator(paneId, name);
                }
            } catch (_) { }
            setActiveIndicators(prev => {
                const next = new Set(prev);
                next.delete(name);
                return next;
            });
        } else {
            // Add indicator
            chartInstanceRef.current.createIndicator(name, true, { id: paneId });
            setActiveIndicators(prev => new Set(prev).add(name));
        }

        setShowIndicatorMenu(false);
    };

    const handleClearAllIndicators = () => {
        if (!chartInstanceRef.current) return;
        // Remove all known indicators
        [...activeIndicators].forEach(name => {
            try {
                const paneId = getPaneIdForIndicator(name);
                if (MAIN_PANE_INDICATORS.includes(name)) {
                    chartInstanceRef.current!.removeIndicator('candle_pane', name);
                } else {
                    chartInstanceRef.current!.removeIndicator(paneId, name);
                }
            } catch (_) { }
        });
        setActiveIndicators(new Set());
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Drawing Tools Management
    // ─────────────────────────────────────────────────────────────────────────
    const handleSelectTool = (toolName: string) => {
        if (!chartInstanceRef.current) return;
        chartInstanceRef.current.createOverlay(toolName);
        setActiveTool(toolName);
        setShowToolsMenu(false);
    };

    const handleCursorMode = () => {
        if (!chartInstanceRef.current) return;
        // Cancel any pending overlay draws by removing unfinished overlays
        chartInstanceRef.current.removeOverlay();
        setActiveTool(null);
        setShowToolsMenu(false);
    };

    const handleClearAllDrawings = () => {
        if (!chartInstanceRef.current) return;
        chartInstanceRef.current.removeOverlay();
        setActiveTool(null);
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Replay Logic
    // ─────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (isPlaying && historicalData.length > 0 && currentIndex < historicalData.length - 1) {
            const delay = 1000 / speed;
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
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isPlaying, speed, historicalData.length]);

    // Update chart when index changes
    useEffect(() => {
        if (
            historicalData.length > 0 &&
            currentIndex >= initialVisibleCandles &&
            chartInstanceRef.current
        ) {
            const newCandle = historicalData[currentIndex];
            const kline: KLineData = {
                timestamp: newCandle.timestamp,
                open: newCandle.open,
                high: newCandle.high,
                low: newCandle.low,
                close: newCandle.close,
                volume: newCandle.volume,
            };
            chartInstanceRef.current.updateData(kline);
            if (currentPrice !== newCandle.close) setCurrentPrice(newCandle.close);
        }
    }, [currentIndex, historicalData]);

    // ─────────────────────────────────────────────────────────────────────────
    // Trading Logic
    // ─────────────────────────────────────────────────────────────────────────
    const handleBuy = () => {
        if (activeTrade || historicalData.length === 0) return;
        const entry = historicalData[currentIndex].close;
        setActiveTrade({ type: 'Long', entryPrice: entry, entryTime: historicalData[currentIndex].timestamp });
    };

    const handleSell = () => {
        if (activeTrade || historicalData.length === 0) return;
        const entry = historicalData[currentIndex].close;
        setActiveTrade({ type: 'Short', entryPrice: entry, entryTime: historicalData[currentIndex].timestamp });
    };

    const handleCloseTrade = () => {
        if (!activeTrade) return;
        const exitPrice = historicalData.length > 0 ? historicalData[currentIndex].close : currentPrice;
        const size = positionSize || 1000;
        let pnl = 0;
        if (activeTrade.type === 'Long') {
            pnl = ((exitPrice - activeTrade.entryPrice) / activeTrade.entryPrice) * size;
        } else {
            pnl = ((activeTrade.entryPrice - exitPrice) / activeTrade.entryPrice) * size;
        }

        addTrade({
            symbol: symbol.toUpperCase(),
            date: new Date(activeTrade.entryTime).toISOString().split('T')[0],
            entryPrice: activeTrade.entryPrice,
            exitPrice,
            pnl: parseFloat(pnl.toFixed(2)),
            type: activeTrade.type,
            strategy: 'Backtest',
            note: `Backtesting simulation — $${size} position`,
            isBacktest: true,
        });
        setActiveTrade(null);
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Computed values
    // ─────────────────────────────────────────────────────────────────────────
    const priceToUse = historicalData.length > 0 && currentIndex < historicalData.length
        ? historicalData[currentIndex].close
        : currentPrice;

    let currentUnrealizedPnl = 0;
    if (activeTrade) {
        const size = positionSize || 1000;
        if (activeTrade.type === 'Long') {
            currentUnrealizedPnl = ((priceToUse - activeTrade.entryPrice) / activeTrade.entryPrice) * size;
        } else {
            currentUnrealizedPnl = ((activeTrade.entryPrice - priceToUse) / activeTrade.entryPrice) * size;
        }
    }

    const currentTimestamp = historicalData.length > 0 && currentIndex < historicalData.length
        ? new Date(historicalData[currentIndex].timestamp).toLocaleString()
        : '--';

    const activeToolLabel = activeTool
        ? DRAWING_TOOLS.find(t => t.name === activeTool)?.label ?? activeTool
        : 'Cursor';

    // ─────────────────────────────────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div
            className={`space-y-4 ${isFullscreen
                ? `fixed inset-0 z-50 p-4 md:p-6 overflow-y-auto ${theme.bg} ${theme.text}`
                : ''
                }`}
            onClick={() => {
                // Close all menus when clicking outside
                if (showIndicatorMenu) setShowIndicatorMenu(false);
                if (showToolsMenu) setShowToolsMenu(false);
                if (showCandleMenu) setShowCandleMenu(false);
            }}
        >
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-2">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <HistoryIcon size={24} className="text-blue-500" />
                    Chart Replay & Backtesting
                </h2>

                {/* Toolbar */}
                <div className="flex flex-wrap gap-2 items-center relative">

                    {/* ── Candle Type ── */}
                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => { setShowCandleMenu(!showCandleMenu); setShowIndicatorMenu(false); setShowToolsMenu(false); }}
                            className={`px-3 py-1.5 text-xs rounded-md font-semibold transition-colors bg-gray-700 hover:bg-gray-600 text-white flex items-center gap-1.5`}
                        >
                            {CANDLE_TYPES.find(c => c.value === candleType)?.label ?? 'Candle'}
                            <ChevronDown size={12} />
                        </button>
                        {showCandleMenu && (
                            <div className={`absolute top-full left-0 mt-1 w-36 rounded-lg shadow-xl border ${theme.border} ${theme.card} z-50`}>
                                {CANDLE_TYPES.map(ct => (
                                    <button
                                        key={ct.value}
                                        onClick={() => { setCandleType(ct.value); setShowCandleMenu(false); }}
                                        className={`w-full px-3 py-2 text-xs text-left transition-colors rounded-md
                                            ${candleType === ct.value
                                                ? 'bg-blue-600 text-white font-bold'
                                                : `${theme.text} hover:bg-blue-500/20`
                                            }`}
                                    >
                                        {ct.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Indicators ── */}
                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => { setShowIndicatorMenu(!showIndicatorMenu); setShowToolsMenu(false); setShowCandleMenu(false); }}
                            className="px-3 py-1.5 text-xs rounded-md font-bold transition-colors bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5"
                        >
                            <TrendingUp size={13} />
                            Indicators
                            {activeIndicators.size > 0 && (
                                <span className="bg-white/25 rounded-full px-1.5 py-0.5 font-black text-[10px]">
                                    {activeIndicators.size}
                                </span>
                            )}
                            <ChevronDown size={12} />
                        </button>

                        {showIndicatorMenu && (
                            <div className={`absolute top-full right-0 mt-1 w-52 max-h-72 rounded-lg shadow-xl border ${theme.border} ${theme.card} z-50 flex flex-col`}>
                                <div className="overflow-y-auto flex-1 p-2 grid grid-cols-2 gap-1">
                                    {ALL_INDICATORS.map(ind => {
                                        const isActive = activeIndicators.has(ind.name);
                                        return (
                                            <button
                                                key={ind.name}
                                                onClick={() => handleToggleIndicator(ind.name)}
                                                className={`p-1.5 text-xs text-center rounded transition-colors font-semibold
                                                    ${isActive
                                                        ? 'bg-blue-600 text-white'
                                                        : `${theme.text} hover:bg-blue-500/20`
                                                    }`}
                                            >
                                                {isActive && '✓ '}{ind.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className={`border-t ${theme.border} p-2`}>
                                    <button
                                        onClick={() => { handleClearAllIndicators(); setShowIndicatorMenu(false); }}
                                        className="w-full p-1.5 text-xs text-center text-red-400 hover:bg-red-500/20 transition-colors rounded flex items-center justify-center gap-1"
                                    >
                                        <Trash2 size={11} /> Clear All
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Drawing Tools ── */}
                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => { setShowToolsMenu(!showToolsMenu); setShowIndicatorMenu(false); setShowCandleMenu(false); }}
                            className={`px-3 py-1.5 text-xs rounded-md font-bold transition-colors flex items-center gap-1.5
                                ${activeTool ? 'bg-purple-600 text-white' : 'bg-purple-600/80 hover:bg-purple-600 text-white'}`}
                        >
                            ✏️ {activeToolLabel}
                            <ChevronDown size={12} />
                        </button>

                        {showToolsMenu && (
                            <div className={`absolute top-full right-0 mt-1 w-52 rounded-lg shadow-xl border ${theme.border} ${theme.card} z-50 flex flex-col`}>
                                {/* Cursor / Pointer mode */}
                                <div className="p-2 pb-0">
                                    <button
                                        onClick={handleCursorMode}
                                        className={`w-full px-3 py-2 text-xs text-left rounded-md transition-colors flex items-center gap-2 font-semibold
                                            ${!activeTool
                                                ? 'bg-purple-600 text-white'
                                                : `${theme.text} hover:bg-purple-500/20`
                                            }`}
                                    >
                                        <MousePointer size={13} /> Cursor (No Tool)
                                    </button>
                                </div>
                                <div className={`p-2 border-t ${theme.border} mt-2 overflow-y-auto max-h-60 flex flex-col gap-1`}>
                                    {DRAWING_TOOLS.map(tool => (
                                        <button
                                            key={tool.name}
                                            onClick={() => handleSelectTool(tool.name)}
                                            className={`px-3 py-2 text-xs text-left rounded-md transition-colors flex items-center gap-2
                                                ${activeTool === tool.name
                                                    ? 'bg-purple-600 text-white font-bold'
                                                    : `${theme.text} hover:bg-purple-500/20`
                                                }`}
                                        >
                                            <span className="font-mono text-sm w-5 text-center">{tool.icon}</span>
                                            {tool.label}
                                        </button>
                                    ))}
                                </div>
                                <div className={`border-t ${theme.border} p-2`}>
                                    <button
                                        onClick={() => { handleClearAllDrawings(); setShowToolsMenu(false); }}
                                        className="w-full p-1.5 text-xs text-center text-red-400 hover:bg-red-500/20 transition-colors rounded flex items-center justify-center gap-1"
                                    >
                                        <Trash2 size={11} /> Clear All Drawings
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Fullscreen */}
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className={`p-1.5 rounded-md transition-colors ${isFullscreen
                            ? 'bg-blue-500 text-white'
                            : `${theme.card} border ${theme.border} text-gray-400 hover:text-blue-500`
                            }`}
                        title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    >
                        {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                    </button>
                </div>
            </div>

            {/* ── Load Controls ── */}
            <div className={`${theme.card} p-4 rounded-xl border ${theme.border} flex flex-wrap gap-3 items-end`}>
                <div className="flex-1 min-w-[110px]">
                    <label className={`block text-xs font-bold mb-1 ${theme.subText}`}>Symbol</label>
                    <input
                        type="text"
                        value={symbol}
                        onChange={e => setSymbol(e.target.value.toUpperCase())}
                        placeholder="BTCUSDT"
                        className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none text-sm ${theme.input}`}
                    />
                </div>
                <div className="flex-1 min-w-[90px]">
                    <label className={`block text-xs font-bold mb-1 ${theme.subText}`}>Interval</label>
                    <select
                        value={timeInterval}
                        onChange={e => setTimeInterval(e.target.value)}
                        className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none text-sm ${theme.input}`}
                    >
                        <option value="1m">1m</option>
                        <option value="3m">3m</option>
                        <option value="5m">5m</option>
                        <option value="15m">15m</option>
                        <option value="30m">30m</option>
                        <option value="1h">1H</option>
                        <option value="2h">2H</option>
                        <option value="4h">4H</option>
                        <option value="1d">1D</option>
                        <option value="1w">1W</option>
                    </select>
                </div>
                <button
                    onClick={handleLoadData}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2 text-sm"
                >
                    {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />}
                    {isLoading ? 'Loading...' : 'Load'}
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
                    {error}
                </div>
            )}

            {/* ── Chart ── */}
            <div className={`${theme.card} rounded-xl border ${theme.border} ${isFullscreen ? 'h-[58vh]' : 'h-[420px]'} w-full relative overflow-hidden`}>
                {/* Timestamp overlay — only shown when data is loaded */}
                {historicalData.length > 0 && currentIndex < historicalData.length && (
                    <div className="absolute top-2 left-2 z-20 text-xs text-white bg-black/60 px-2 py-1 rounded pointer-events-none">
                        {currentTimestamp}
                        {activeTool && (
                            <span className="ml-2 text-purple-300">✏️ {activeToolLabel}</span>
                        )}
                    </div>
                )}

                {/* Empty state */}
                {historicalData.length === 0 && !isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-500 pointer-events-none">
                        <HistoryIcon size={48} className="opacity-20" />
                        <p className="text-sm">Enter a symbol and click <strong>Load</strong> to start replay</p>
                    </div>
                )}

                <div ref={chartContainerRef} className="w-full h-full" />
            </div>

            {/* ── Replay Controls ── */}
            <div className={`${theme.card} p-4 rounded-xl border ${theme.border} flex flex-wrap justify-between items-center gap-3`}>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        disabled={historicalData.length === 0}
                        className={`p-3 rounded-lg flex items-center justify-center transition-all disabled:opacity-40
                            ${isPlaying ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}
                        title={isPlaying ? 'Pause' : 'Play'}
                    >
                        {isPlaying ? <Pause size={22} /> : <Play size={22} />}
                    </button>
                    <button
                        onClick={() => {
                            if (historicalData.length > 0 && currentIndex < historicalData.length - 1)
                                setCurrentIndex(prev => prev + 1);
                        }}
                        disabled={isPlaying || historicalData.length === 0}
                        className="p-3 bg-gray-500/20 text-gray-400 hover:text-white rounded-lg transition-all disabled:opacity-40"
                        title="Next Candle"
                    >
                        <SkipForward size={22} />
                    </button>
                    {/* Speed */}
                    <div className={`flex items-center rounded-lg p-1 ml-2 border ${theme.border} ${theme.card}`}>
                        {([1, 2, 5] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => setSpeed(s)}
                                className={`px-3 py-1 text-sm rounded cursor-pointer transition-colors
                                    ${speed === s ? 'bg-blue-600 text-white font-bold' : 'text-gray-400 hover:text-white'}`}
                            >
                                {s}x
                            </button>
                        ))}
                    </div>
                </div>

                {/* Progress */}
                {historicalData.length > 0 && (
                    <div className="text-xs text-gray-500 font-mono">
                        Candle {currentIndex} / {historicalData.length - 1}
                        &nbsp;·&nbsp;
                        <span className={`font-bold ${priceToUse > 0 ? 'text-blue-400' : ''}`}>
                            {priceToUse > 0 ? priceToUse.toFixed(priceToUse < 10 ? 4 : 2) : '--'}
                        </span>
                    </div>
                )}
            </div>

            {/* ── Trading Panel ── */}
            {historicalData.length > 0 && (
                <div className={`${theme.card} p-4 rounded-xl border ${theme.border} grid grid-cols-1 md:grid-cols-2 gap-6`}>
                    {/* Buy / Sell */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleBuy}
                            disabled={!!activeTrade}
                            className={`flex-1 py-4 font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition-all
                                ${!activeTrade
                                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/40'
                                    : 'opacity-30 cursor-not-allowed bg-gray-800 text-gray-500'
                                }`}
                        >
                            <TrendingUp size={22} />
                            <span className="text-sm">BUY LONG</span>
                        </button>
                        <button
                            onClick={handleSell}
                            disabled={!!activeTrade}
                            className={`flex-1 py-4 font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition-all
                                ${!activeTrade
                                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40'
                                    : 'opacity-30 cursor-not-allowed bg-gray-800 text-gray-500'
                                }`}
                        >
                            <TrendingDown size={22} />
                            <span className="text-sm">SELL SHORT</span>
                        </button>
                    </div>

                    {/* Position Info */}
                    <div className={`flex flex-col justify-center border-l border-gray-700/50 pl-6 gap-3`}>
                        {/* Position size input */}
                        <div className="flex items-center gap-2">
                            <label className={`text-xs font-bold ${theme.subText} whitespace-nowrap`}>Position Size</label>
                            <div className="flex items-center border border-gray-600 rounded-lg overflow-hidden">
                                <span className="px-2 text-xs text-gray-400 bg-gray-800">$</span>
                                <input
                                    type="number"
                                    value={positionSize}
                                    onChange={e => setPositionSize(Math.max(1, parseInt(e.target.value) || 1000))}
                                    disabled={!!activeTrade}
                                    min={1}
                                    className={`w-24 px-2 py-1 text-sm outline-none bg-transparent ${theme.text} disabled:opacity-50`}
                                />
                            </div>
                        </div>

                        {/* Active trade status */}
                        {activeTrade ? (
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className={`font-bold text-sm ${activeTrade.type === 'Long' ? 'text-green-400' : 'text-red-400'}`}>
                                        {activeTrade.type} @ {activeTrade.entryPrice.toFixed(activeTrade.entryPrice < 10 ? 4 : 2)}
                                    </span>
                                    <span className={`text-xl font-black ${currentUnrealizedPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {currentUnrealizedPnl >= 0 ? '+' : ''}${currentUnrealizedPnl.toFixed(2)}
                                    </span>
                                </div>
                                <button
                                    onClick={handleCloseTrade}
                                    className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg transition-all text-sm"
                                >
                                    Close Position
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic text-sm text-center py-2">
                                No active position. Buy or Sell to start.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Inline SVG icon for "History" ─────────────────────────────────────────────
const HistoryIcon = ({ size = 24, className = '' }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size} height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
    </svg>
);
