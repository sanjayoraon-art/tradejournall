import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Play, Pause, SkipForward, RefreshCw, Search,
    TrendingUp, TrendingDown, Maximize2, Minimize2,
    MousePointer, Trash2, ChevronDown, X, BarChart2, Zap
} from 'lucide-react';
import type { Chart, KLineData } from 'klinecharts';
import { fetchBinanceKlines, BinanceKline } from '../utils/binanceApi';
import { fetchYahooKlines } from '../utils/marketApi';

// ─── CDN global wrappers ─────────────────────────────────────────────────────
const _kc = () => (window as any).klinecharts as typeof import('klinecharts');
const kcInit: typeof import('klinecharts')['init'] = (...args) => _kc().init(...args);
const kcDispose: typeof import('klinecharts')['dispose'] = (...args) => _kc().dispose(...args);

// ─── Constants ───────────────────────────────────────────────────────────────
const INITIAL_VISIBLE = 150;

const MAIN_INDICATORS = new Set(['MA', 'EMA', 'SMA', 'BBI', 'BOLL', 'SAR']);

const INDICATOR_GROUPS = [
    {
        label: 'On Chart', color: 'blue',
        items: ['MA', 'EMA', 'SMA', 'BOLL', 'SAR', 'BBI'],
    },
    {
        label: 'Volume', color: 'emerald',
        items: ['VOL', 'OBV', 'VR'],
    },
    {
        label: 'Momentum', color: 'purple',
        items: ['MACD', 'RSI', 'KDJ', 'CCI', 'WR', 'ROC', 'MTM', 'AO'],
    },
    {
        label: 'Trend', color: 'amber',
        items: ['DMI', 'BIAS', 'BRAR', 'CR', 'PSY', 'DMA', 'TRIX', 'EMV', 'PVT'],
    },
];

const DRAWING_TOOLS = [
    { name: 'segment', label: 'Trend Line', icon: '↗' },
    { name: 'rayLine', label: 'Ray', icon: '→' },
    { name: 'straightLine', label: 'Extended Line', icon: '↔' },
    { name: 'horizontalStraightLine', label: 'Horizontal Line', icon: '—' },
    { name: 'verticalStraightLine', label: 'Vertical Line', icon: '|' },
    { name: 'priceLine', label: 'Price Level', icon: '$' },
    { name: 'parallelStraightLine', label: 'Parallel Channel', icon: '⫼' },
    { name: 'fibonacciLine', label: 'Fibonacci', icon: 'φ' },
    { name: 'rect', label: 'Rectangle', icon: '▭' },
    { name: 'circle', label: 'Circle', icon: '○' },
    { name: 'triangle', label: 'Triangle', icon: '△' },
    { name: 'text', label: 'Note', icon: 'T' },
    { name: 'arrow', label: 'Arrow', icon: '➜' },
];

const CANDLE_TYPES = [
    { value: 'candle_solid', label: 'Candle', icon: '🕯' },
    { value: 'candle_stroke', label: 'Hollow', icon: '□' },
    { value: 'ohlc', label: 'OHLC', icon: '|' },
    { value: 'area', label: 'Area', icon: '~' },
];

const INTERVALS = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '1d', '1w'];
const YAHOO_INTERVALS = ['1m', '5m', '15m', '30m', '1h', '1d', '1w'];

// ─── Component ───────────────────────────────────────────────────────────────
interface BacktestingScreenProps {
    theme: any;
    isDarkMode: boolean;
    primaryCurrencySymbol: string;
    addTrade: (trade: any) => void;
}

export const BacktestingScreen: React.FC<BacktestingScreenProps> = ({
    theme, isDarkMode, addTrade
}) => {
    // Load / Replay
    const [marketSource, setMarketSource] = useState<'crypto' | 'stocks'>('crypto');
    const [symbol, setSymbol] = useState('BTCUSDT');
    const [chartInterval, setChartInterval] = useState('5m');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [historicalData, setData] = useState<BinanceKline[]>([]);
    const [currentIndex, setIndex] = useState(0);
    const [isPlaying, setPlaying] = useState(false);
    const [speed, setSpeed] = useState<1 | 2 | 5>(1);

    // Trading
    const [activeTrade, setActiveTrade] = useState<{
        type: 'Long' | 'Short'; entryPrice: number; entryTime: number;
    } | null>(null);
    const [positionSize, setSize] = useState(1000);
    const [currentPrice, setPrice] = useState(0);

    // Chart toolbar
    const [candleType, setCandleType] = useState('candle_solid');
    const [activeIndicators, setActiveInds] = useState<Set<string>>(new Set(['VOL', 'MA']));
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [showIndMenu, setShowIndMenu] = useState(false);
    const [showToolMenu, setShowToolMenu] = useState(false);
    const [showCandleMenu, setShowCandleMenu] = useState(false);
    const [isFullscreen, setFullscreen] = useState(false);

    // Indicator settings
    const [editingIndicator, setEditingIndicator] = useState<{ paneId: string; name: string; params: number[] } | null>(null);

    // Chart
    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<Chart | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // ── Chart theme ───────────────────────────────────────────────────────────
    const applyTheme = useCallback((chart: Chart, type = candleType) => {
        chart.setStyles({
            grid: {
                show: true,
                horizontal: { color: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                vertical: { color: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' },
            },
            candle: {
                type: type as any,
                bar: { upColor: '#22c55e', downColor: '#ef4444', upBorderColor: '#22c55e', downBorderColor: '#ef4444', upWickColor: '#22c55e', downWickColor: '#ef4444' },
                area: {
                    lineColor: '#3b82f6',
                    backgroundColor: [
                        { offset: 0, color: 'rgba(59,130,246,0.25)' },
                        { offset: 1, color: 'rgba(59,130,246,0)' },
                    ],
                },
            },
            xAxis: { axisLine: { color: 'rgba(255,255,255,0.08)' }, tickLine: { color: 'rgba(255,255,255,0.08)' }, tickText: { color: isDarkMode ? '#6b7280' : '#9ca3af', size: 11 } },
            yAxis: { axisLine: { color: 'rgba(255,255,255,0.08)' }, tickLine: { color: 'rgba(255,255,255,0.08)' }, tickText: { color: isDarkMode ? '#6b7280' : '#9ca3af', size: 11 } },
            indicator: {
                tooltip: {
                    icons: [
                        {
                            id: 'setting', position: 'middle' as any, marginLeft: 8, marginTop: 7, marginRight: 0, marginBottom: 0, paddingLeft: 0, paddingTop: 0, paddingRight: 0, paddingBottom: 0,
                            icon: '\u2699\uFE0F', fontFamily: 'Helvetica', size: 14, color: '#76808F', activeColor: '#3b82f6', backgroundColor: 'transparent', activeBackgroundColor: 'transparent'
                        },
                        {
                            id: 'close', position: 'middle' as any, marginLeft: 8, marginTop: 7, marginRight: 0, marginBottom: 0, paddingLeft: 0, paddingTop: 0, paddingRight: 0, paddingBottom: 0,
                            icon: '\u274C', fontFamily: 'Helvetica', size: 14, color: '#76808F', activeColor: '#ef4444', backgroundColor: 'transparent', activeBackgroundColor: 'transparent'
                        }
                    ]
                }
            }
        });
    }, [isDarkMode, candleType]);

    // ── Init chart ────────────────────────────────────────────────────────────
    const initChart = useCallback((data: BinanceKline[]) => {
        if (!containerRef.current) return;
        if (chartRef.current) { kcDispose(containerRef.current); chartRef.current = null; }
        const chart = kcInit(containerRef.current);
        if (!chart) return;
        applyTheme(chart);
        chart.createIndicator('VOL', true, { id: 'pane_vol' });
        chart.createIndicator('MA', false, { id: 'candle_pane' });
        const formatted: KLineData[] = data.map(d => ({
            timestamp: d.timestamp, open: d.open, high: d.high,
            low: d.low, close: d.close, volume: d.volume,
        }));
        chart.applyNewData(formatted);
        chart.subscribeAction('onTooltipIconClick' as any, (data: any) => {
            const { paneId, indicatorName, iconId } = data;
            if (iconId === 'setting') {
                const ind = chart.getIndicatorByPaneId(paneId, indicatorName) as any;
                const params = ind?.calcParams || [];
                setEditingIndicator({ paneId, name: indicatorName, params: [...params] });
            } else if (iconId === 'close') {
                try { chart.removeIndicator(paneId, indicatorName); } catch { }
                setActiveInds(prev => { const n = new Set(prev); n.delete(indicatorName); return n; });
            }
        });
        chartRef.current = chart;
        setActiveInds(new Set(['VOL', 'MA']));
    }, [applyTheme]);

    // ── Load data ─────────────────────────────────────────────────────────────
    const loadData = useCallback(async (currentSymbol = symbol, currentInterval = chartInterval, currentMarketSource = marketSource) => {
        setIsLoading(true); setError(''); setPlaying(false); setActiveTrade(null); setActiveTool(null);
        if (timerRef.current) clearInterval(timerRef.current);
        try {
            const data = currentMarketSource === 'crypto'
                ? await fetchBinanceKlines(currentSymbol, currentInterval, undefined, undefined, 1000)
                : await fetchYahooKlines(currentSymbol, currentInterval, 1000);

            if (data.length < INITIAL_VISIBLE + 10) { setError('Not enough data. Try a longer timeframe or different symbol.'); return; }
            setData(data);
            setIndex(INITIAL_VISIBLE);
            setPrice(data[INITIAL_VISIBLE].close);
            initChart(data.slice(0, INITIAL_VISIBLE + 1));
        } catch (e: any) {
            setError(e.message ?? 'Failed to fetch. Check symbol format (e.g. AAPL, EURUSD=X) & connection.');
        } finally {
            setIsLoading(false);
        }
    }, [symbol, chartInterval, marketSource, initChart]);

    // ── Candle type live switch ───────────────────────────────────────────────
    useEffect(() => {
        if (!chartRef.current) return;
        chartRef.current.setStyles({ candle: { type: candleType as any } });
        setShowCandleMenu(false);
    }, [candleType]);

    // ── Auto-load Data ──────────────────────────────────────────────────────
    const initialLoadDone = useRef(false);
    useEffect(() => {
        if (initialLoadDone.current) return;
        initialLoadDone.current = true;
        loadData('BTCUSDT', '5m', 'crypto');
    }, [loadData]);

    // ── Indicator toggle ──────────────────────────────────────────────────────
    const toggleIndicator = (name: string) => {
        if (!chartRef.current) return;
        const paneId = MAIN_INDICATORS.has(name) ? 'candle_pane'
            : name === 'VOL' ? 'pane_vol'
                : `pane_${name.toLowerCase()}`;
        if (activeIndicators.has(name)) {
            try { chartRef.current.removeIndicator(paneId, name); } catch { }
            setActiveInds(prev => { const n = new Set(prev); n.delete(name); return n; });
        } else {
            chartRef.current.createIndicator(name, true, { id: paneId });
            setActiveInds(prev => new Set(prev).add(name));
        }
        setShowIndMenu(false);
    };

    const clearAllIndicators = () => {
        if (!chartRef.current) return;
        [...activeIndicators].forEach(name => {
            try {
                const paneId = MAIN_INDICATORS.has(name) ? 'candle_pane'
                    : name === 'VOL' ? 'pane_vol' : `pane_${name.toLowerCase()}`;
                chartRef.current!.removeIndicator(paneId, name);
            } catch { }
        });
        setActiveInds(new Set());
    };

    // ── Drawing tools ─────────────────────────────────────────────────────────
    const selectTool = (name: string) => {
        if (!chartRef.current) return;
        chartRef.current.createOverlay({
            name,
            onDrawEnd: () => { setActiveTool(null); return true; }
        });
        setActiveTool(name);
        setShowToolMenu(false);
    };
    const clearTool = () => {
        // Just cancel the active drawing mode
        chartRef.current?.overrideOverlay({ name: 'segment', lock: true } as any); // Simple way to lock/end drawing
        // In klinecharts v9 just setting active tool to null and creating no overlays stops drawing
        setActiveTool(null);
        setShowToolMenu(false);
    };
    const clearDrawings = () => { chartRef.current?.removeOverlay(); setActiveTool(null); };

    // ── Replay ────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (isPlaying && historicalData.length > 0 && currentIndex < historicalData.length - 1) {
            const id = window.setInterval(() => {
                setIndex(prev => {
                    if (prev >= historicalData.length - 1) { setPlaying(false); return prev; }
                    return prev + 1;
                });
            }, 1000 / speed);
            timerRef.current = id as unknown as NodeJS.Timeout;
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isPlaying, speed, historicalData.length]);

    useEffect(() => {
        if (!chartRef.current || historicalData.length === 0 || currentIndex < INITIAL_VISIBLE) return;
        const c = historicalData[currentIndex];
        chartRef.current.updateData({ timestamp: c.timestamp, open: c.open, high: c.high, low: c.low, close: c.close, volume: c.volume });
        if (c.close !== currentPrice) setPrice(c.close);
    }, [currentIndex, historicalData]);

    // ── Trading ───────────────────────────────────────────────────────────────
    const currentBar = historicalData.length > 0 && currentIndex < historicalData.length ? historicalData[currentIndex] : null;
    const price = currentBar?.close ?? currentPrice;

    const openTrade = (type: 'Long' | 'Short') => {
        if (activeTrade || !currentBar) return;
        setActiveTrade({ type, entryPrice: currentBar.close, entryTime: currentBar.timestamp });
    };

    const closeTrade = () => {
        if (!activeTrade) return;
        const size = positionSize || 1000;
        const pnl = activeTrade.type === 'Long'
            ? ((price - activeTrade.entryPrice) / activeTrade.entryPrice) * size
            : ((activeTrade.entryPrice - price) / activeTrade.entryPrice) * size;
        addTrade({
            symbol: symbol.toUpperCase(),
            date: new Date(activeTrade.entryTime).toISOString().split('T')[0],
            entryPrice: activeTrade.entryPrice,
            exitPrice: price,
            pnl: parseFloat(pnl.toFixed(2)),
            type: activeTrade.type,
            strategy: 'Backtest',
            note: `Backtest sim — $${size} position`,
            isBacktest: true,
        });
        setActiveTrade(null);
    };

    const unrealizedPnl = activeTrade
        ? activeTrade.type === 'Long'
            ? ((price - activeTrade.entryPrice) / activeTrade.entryPrice) * positionSize
            : ((activeTrade.entryPrice - price) / activeTrade.entryPrice) * positionSize
        : 0;

    const pnlPositive = unrealizedPnl >= 0;
    const priceDecimals = price < 1 ? 6 : price < 100 ? 4 : 2;
    const toolLabel = activeTool ? DRAWING_TOOLS.find(t => t.name === activeTool)?.label ?? activeTool : 'Cursor';

    const closeAllMenus = () => { setShowIndMenu(false); setShowToolMenu(false); setShowCandleMenu(false); };

    // ─────────────────────────────────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div
            className={`flex flex-col gap-3 ${isFullscreen ? `fixed inset-0 z-50 p-3 overflow-y-auto ${theme.bg}` : ''}`}
            onClick={closeAllMenus}
        >
            {/* ══ TOP BAR ══════════════════════════════════════════════════════ */}
            <div className={`flex flex-wrap items-center gap-2 px-4 py-2.5 rounded-xl border ${theme.border} ${theme.card}`}>
                {/* Icon + Title */}
                <div className="flex items-center gap-2 mr-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <BarChart2 size={16} className="text-blue-400" />
                    </div>
                    <span className="font-bold text-sm hidden sm:block" style={{ color: isDarkMode ? '#e5e7eb' : '#111827' }}>
                        Chart Replay
                    </span>
                </div>

                {/* Symbol input */}
                <div className="flex items-center gap-1.5 focus-within:ring-2 focus-within:ring-blue-500 rounded-lg border overflow-hidden" style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}>
                    <select
                        value={marketSource}
                        onChange={e => {
                            const val = e.target.value as 'crypto' | 'stocks';
                            setMarketSource(val);
                            if (val === 'crypto') setSymbol('BTCUSDT');
                            else { setSymbol('AAPL'); setChartInterval('1d'); }
                        }}
                        className={`px-2 py-1.5 text-xs font-semibold outline-none border-r cursor-pointer ${theme.input} ${theme.border}`}
                    >
                        <option value="crypto">Crypto</option>
                        <option value="stocks">Stocks/Forex</option>
                    </select>
                    <input
                        type="text"
                        value={symbol}
                        onChange={e => setSymbol(e.target.value.toUpperCase())}
                        placeholder={marketSource === 'crypto' ? "BTCUSDT" : "AAPL, EURUSD=X"}
                        className={`w-28 px-2 py-1.5 text-xs font-bold outline-none uppercase tracking-wide ${theme.input}`}
                    />
                </div>

                <div className="flex items-center gap-1.5">
                    {/* Interval select */}
                    <select
                        value={chartInterval}
                        onChange={e => {
                            const newInterval = e.target.value;
                            setChartInterval(newInterval);
                            // Auto-refresh when interval changes
                            loadData(symbol, newInterval, marketSource);
                        }}
                        className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${theme.input}`}
                    >
                        {(marketSource === 'crypto' ? INTERVALS : YAHOO_INTERVALS).map(i => <option key={i} value={i}>{i.toUpperCase()}</option>)}
                    </select>
                    {/* Load button */}
                    <button
                        onClick={e => { e.stopPropagation(); loadData(); }}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white transition-all disabled:opacity-50"
                    >
                        {isLoading ? <RefreshCw size={12} className="animate-spin" /> : <Search size={12} />}
                        {isLoading ? 'Loading…' : 'Load'}
                    </button>
                </div>

                {/* Divider */}
                <div className="h-5 w-px bg-gray-700/50 mx-1 hidden sm:block" />

                {/* Candle type */}
                <div className="relative" onClick={e => e.stopPropagation()}>
                    <button
                        onClick={() => { setShowCandleMenu(!showCandleMenu); setShowIndMenu(false); setShowToolMenu(false); }}
                        className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all
                            ${theme.border} ${showCandleMenu ? 'bg-gray-700 text-white' : `${theme.card} hover:border-gray-500 ${theme.text}`}`}
                    >
                        <span>{CANDLE_TYPES.find(c => c.value === candleType)?.icon}</span>
                        <span className="hidden sm:inline">{CANDLE_TYPES.find(c => c.value === candleType)?.label}</span>
                        <ChevronDown size={11} />
                    </button>
                    {showCandleMenu && (
                        <div className={`absolute top-full left-0 mt-1 w-32 rounded-xl shadow-2xl border ${theme.border} z-50`}
                            style={{ background: isDarkMode ? '#1f2937' : '#fff' }}>
                            {CANDLE_TYPES.map(ct => (
                                <button key={ct.value} onClick={() => { setCandleType(ct.value); setShowCandleMenu(false); }}
                                    className={`w-full px-3 py-2 text-xs text-left flex items-center gap-2 first:rounded-t-xl last:rounded-b-xl transition-colors
                                        ${candleType === ct.value ? 'bg-blue-600 text-white font-bold' : `${theme.text} hover:bg-blue-500/10`}`}>
                                    <span className="font-mono">{ct.icon}</span> {ct.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Indicators */}
                <div className="relative" onClick={e => e.stopPropagation()}>
                    <button
                        onClick={() => { setShowIndMenu(!showIndMenu); setShowToolMenu(false); setShowCandleMenu(false); }}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all
                            ${showIndMenu ? 'bg-blue-600 border-blue-600 text-white' : 'border-blue-500/40 text-blue-400 hover:bg-blue-500/10'}`}
                    >
                        <TrendingUp size={12} />
                        <span>Indicators</span>
                        {activeIndicators.size > 0 && (
                            <span className="bg-blue-500 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                                {activeIndicators.size}
                            </span>
                        )}
                    </button>
                    {showIndMenu && (
                        <div className={`absolute top-full left-0 mt-1 w-64 rounded-xl shadow-2xl border overflow-hidden ${theme.border} z-50`}
                            style={{ background: isDarkMode ? '#1f2937' : '#fff' }}>
                            <div className="max-h-80 overflow-y-auto p-2 space-y-3">
                                {INDICATOR_GROUPS.map(group => (
                                    <div key={group.label}>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-1 mb-1">{group.label}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {group.items.map(name => {
                                                const active = activeIndicators.has(name);
                                                return (
                                                    <button key={name} onClick={() => toggleIndicator(name)}
                                                        className={`px-2 py-1 text-xs rounded-lg font-semibold transition-all
                                                            ${active ? 'bg-blue-600 text-white' : `${theme.text} bg-gray-800/50 hover:bg-blue-500/20`}`}>
                                                        {active && <span className="mr-0.5">✓</span>}{name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className={`border-t ${theme.border} px-3 py-2`}>
                                <button onClick={() => { clearAllIndicators(); setShowIndMenu(false); }}
                                    className="w-full text-xs text-red-400 hover:text-red-300 flex items-center justify-center gap-1 py-1 rounded-lg hover:bg-red-500/10 transition-colors">
                                    <Trash2 size={11} /> Clear All Indicators
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Drawing Tools */}
                <div className="relative" onClick={e => e.stopPropagation()}>
                    <button
                        onClick={() => { setShowToolMenu(!showToolMenu); setShowIndMenu(false); setShowCandleMenu(false); }}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all
                            ${activeTool || showToolMenu ? 'bg-purple-600 border-purple-600 text-white' : 'border-purple-500/40 text-purple-400 hover:bg-purple-500/10'}`}
                    >
                        <span>✏️</span>
                        <span className="hidden sm:inline">{toolLabel}</span>
                        <ChevronDown size={11} />
                    </button>
                    {showToolMenu && (
                        <div className={`absolute top-full left-0 mt-1 w-48 rounded-xl shadow-2xl border overflow-hidden ${theme.border} z-50`}
                            style={{ background: isDarkMode ? '#1f2937' : '#fff' }}>
                            {/* Cursor */}
                            <button onClick={clearTool}
                                className={`w-full px-3 py-2.5 text-xs text-left flex items-center gap-2 border-b ${theme.border} transition-colors
                                    ${!activeTool ? 'bg-purple-600 text-white font-bold' : `${theme.text} hover:bg-purple-500/10`}`}>
                                <MousePointer size={12} /> Cursor (No Tool)
                            </button>
                            <div className="max-h-60 overflow-y-auto">
                                {DRAWING_TOOLS.map(tool => (
                                    <button key={tool.name} onClick={() => selectTool(tool.name)}
                                        className={`w-full px-3 py-2 text-xs text-left flex items-center gap-2.5 transition-colors
                                            ${activeTool === tool.name ? 'bg-purple-600 text-white font-bold' : `${theme.text} hover:bg-purple-500/10`}`}>
                                        <span className="font-mono w-4 text-center">{tool.icon}</span>
                                        {tool.label}
                                    </button>
                                ))}
                            </div>
                            <div className={`border-t ${theme.border} px-3 py-2`}>
                                <button onClick={() => { clearDrawings(); setShowToolMenu(false); }}
                                    className="w-full text-xs text-red-400 hover:text-red-300 flex items-center justify-center gap-1 py-1 rounded-lg hover:bg-red-500/10 transition-colors">
                                    <Trash2 size={11} /> Clear All Drawings
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Fullscreen */}
                <button onClick={() => setFullscreen(!isFullscreen)}
                    className={`p-1.5 rounded-lg border transition-all ${theme.border} ${theme.text} hover:text-blue-400`}>
                    {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    <X size={14} className="shrink-0" />
                    {error}
                </div>
            )}

            {/* ══ CHART AREA ══════════════════════════════════════════════════ */}
            <div className={`relative rounded-xl border overflow-hidden ${theme.border} ${isFullscreen ? 'h-[55vh]' : 'h-[420px] md:h-[490px]'}`}
                style={{ background: isDarkMode ? '#111827' : '#f9fafb' }}>

                {/* Chart container */}
                <div ref={containerRef} className="w-full h-full" />

                {/* Empty state overlay */}
                {historicalData.length === 0 && !isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none"
                        style={{ background: isDarkMode ? 'rgba(17,24,39,0.95)' : 'rgba(249,250,251,0.95)' }}>
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                            <BarChart2 size={32} className="text-blue-400/50" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-gray-400">No Chart Data</p>
                            <p className="text-xs text-gray-600 mt-1">Enter a symbol and click <strong className="text-gray-400">Load</strong> to begin replay</p>
                        </div>
                    </div>
                )}

                {/* Loading overlay */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center"
                        style={{ background: isDarkMode ? 'rgba(17,24,39,0.8)' : 'rgba(249,250,251,0.8)' }}>
                        <div className="flex items-center gap-2 text-blue-400">
                            <RefreshCw size={18} className="animate-spin" />
                            <span className="text-sm font-semibold">Loading {symbol}…</span>
                        </div>
                    </div>
                )}

                {/* Live price badge - top right */}
                {historicalData.length > 0 && (
                    <div className="absolute top-3 right-3 flex items-center gap-2 pointer-events-none">
                        <div className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-900/80 backdrop-blur border border-white/10 text-white">
                            <span className="text-gray-400 mr-1">{symbol}</span>
                            <span className={price > (historicalData[currentIndex > 0 ? currentIndex - 1 : 0]?.close ?? price) ? 'text-green-400' : 'text-red-400'}>
                                {price.toFixed(priceDecimals)}
                            </span>
                        </div>
                    </div>
                )}

                {/* Active tool indicator */}
                {activeTool && (
                    <div className="absolute top-3 left-3 pointer-events-none">
                        <div className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-600/90 backdrop-blur text-white flex items-center gap-1.5">
                            <span>✏️</span> {toolLabel}
                        </div>
                    </div>
                )}
            </div>

            {/* ══ CONTROLS + INFO BAR ════════════════════════════════════════ */}
            <div className={`flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl border ${theme.border} ${theme.card}`}>
                {/* Playback */}
                <div className="flex items-center gap-2">
                    <button onClick={() => setPlaying(!isPlaying)} disabled={historicalData.length === 0}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all disabled:opacity-40
                            ${isPlaying ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                        {isPlaying ? <><Pause size={13} /> Pause</> : <><Play size={13} /> Play</>}
                    </button>
                    <button
                        onClick={() => historicalData.length > 0 && currentIndex < historicalData.length - 1 && setIndex(p => p + 1)}
                        disabled={isPlaying || historicalData.length === 0}
                        className={`p-1.5 rounded-lg border transition-all disabled:opacity-40 ${theme.border} text-gray-400 hover:text-white hover:border-gray-500`}>
                        <SkipForward size={14} />
                    </button>
                </div>

                {/* Speed */}
                <div className={`flex items-center rounded-lg border overflow-hidden ${theme.border}`}>
                    {([1, 2, 5] as const).map(s => (
                        <button key={s} onClick={() => setSpeed(s)}
                            className={`px-2.5 py-1 text-xs font-bold transition-colors
                                ${speed === s ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                            {s}×
                        </button>
                    ))}
                </div>

                {/* Divider */}
                <div className="h-5 w-px bg-gray-700/50" />

                {/* Time & Progress */}
                {historicalData.length > 0 && (
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="font-mono bg-gray-800/50 px-2 py-1 rounded-lg">
                            {currentBar ? new Date(currentBar.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '--'}
                        </span>
                        {/* Progress bar */}
                        <div className="hidden sm:flex items-center gap-1.5">
                            <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full transition-all"
                                    style={{ width: `${((currentIndex - INITIAL_VISIBLE) / (historicalData.length - INITIAL_VISIBLE - 1)) * 100}%` }} />
                            </div>
                            <span className="text-[10px]">{currentIndex}/{historicalData.length - 1}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* ══ TRADING PANEL ══════════════════════════════════════════════ */}
            {historicalData.length > 0 && (
                <div className={`rounded-xl border ${theme.border} ${theme.card} overflow-hidden`}>
                    {/* Panel header */}
                    <div className={`px-4 py-2.5 border-b ${theme.border} flex items-center justify-between`}>
                        <div className="flex items-center gap-2">
                            <Zap size={14} className="text-amber-400" />
                            <span className="text-xs font-bold text-gray-400">Paper Trading</span>
                        </div>
                        {/* Position size */}
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 font-semibold">SIZE</span>
                            <div className={`flex items-center rounded-lg border overflow-hidden ${theme.border}`}>
                                <span className="px-2 py-1 text-xs text-gray-500 bg-gray-800/50">$</span>
                                <input
                                    type="number"
                                    value={positionSize}
                                    onChange={e => setSize(Math.max(1, parseInt(e.target.value) || 1000))}
                                    disabled={!!activeTrade}
                                    min={1}
                                    className={`w-20 px-2 py-1 text-xs outline-none text-right bg-transparent ${theme.text} disabled:opacity-50 disabled:cursor-not-allowed`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-800/50">
                        {/* Buttons */}
                        <div className="p-4 flex gap-3">
                            <button onClick={() => openTrade('Long')} disabled={!!activeTrade}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold flex flex-col items-center gap-1 transition-all border
                                    ${!activeTrade
                                        ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-500/60 active:scale-95'
                                        : 'opacity-30 cursor-not-allowed bg-gray-800/30 border-gray-700/30 text-gray-600'}`}>
                                <TrendingUp size={20} />
                                <span>BUY LONG</span>
                            </button>
                            <button onClick={() => openTrade('Short')} disabled={!!activeTrade}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold flex flex-col items-center gap-1 transition-all border
                                    ${!activeTrade
                                        ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/60 active:scale-95'
                                        : 'opacity-30 cursor-not-allowed bg-gray-800/30 border-gray-700/30 text-gray-600'}`}>
                                <TrendingDown size={20} />
                                <span>SELL SHORT</span>
                            </button>
                        </div>

                        {/* Active trade info */}
                        <div className="p-4 flex flex-col justify-center">
                            {activeTrade ? (
                                <div className="space-y-2.5">
                                    {/* Trade info row */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${activeTrade.type === 'Long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {activeTrade.type === 'Long' ? '▲ LONG' : '▼ SHORT'}
                                            </span>
                                            <span className="text-xs text-gray-500">@ {activeTrade.entryPrice.toFixed(priceDecimals)}</span>
                                        </div>
                                        <div className={`text-right`}>
                                            <p className="text-[10px] text-gray-600 uppercase tracking-wide">Unrealized P&L</p>
                                            <p className={`text-lg font-black leading-tight ${pnlPositive ? 'text-green-400' : 'text-red-400'}`}>
                                                {pnlPositive ? '+' : ''}${unrealizedPnl.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={closeTrade}
                                        className="w-full py-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black font-bold text-sm rounded-xl transition-all active:scale-95">
                                        Close Position
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-1 py-2 text-center">
                                    <p className="text-xs font-semibold text-gray-500">No Active Position</p>
                                    <p className="text-[10px] text-gray-600">Click Buy or Sell to start a paper trade</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Indicator Settings Modal */}
            {editingIndicator && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className={`w-full max-w-sm rounded-2xl shadow-2xl border ${theme.border} ${theme.card} overflow-hidden`}
                        style={{ background: isDarkMode ? '#1f2937' : '#ffffff' }}>
                        <div className={`px-4 py-3 border-b ${theme.border} flex items-center justify-between`}>
                            <h3 className={`font-bold ${theme.text}`}>
                                {editingIndicator.name} Settings
                            </h3>
                            <button onClick={() => setEditingIndicator(null)} className="text-gray-400 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            {editingIndicator.params.map((val, idx) => (
                                <div key={idx} className="flex items-center justify-between gap-4">
                                    <label className="text-xs font-semibold text-gray-400">Length {idx + 1}</label>
                                    <input
                                        type="number"
                                        value={val}
                                        onChange={e => {
                                            const newParams = [...editingIndicator.params];
                                            newParams[idx] = parseFloat(e.target.value) || 0;
                                            setEditingIndicator(prev => prev ? { ...prev, params: newParams } : null);
                                        }}
                                        className={`w-24 px-3 py-1.5 text-sm font-bold rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${theme.input}`}
                                    />
                                </div>
                            ))}
                            {editingIndicator.params.length === 0 && (
                                <div className="text-sm text-gray-500 text-center py-4">No parameters to configure.</div>
                            )}
                        </div>
                        <div className={`p-4 border-t ${theme.border} flex gap-3`}>
                            <button onClick={() => setEditingIndicator(null)}
                                className={`flex-1 py-2 text-sm font-bold rounded-xl border ${theme.border} ${theme.text} hover:bg-gray-800 transition-colors`}>
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (chartRef.current) {
                                        chartRef.current.overrideIndicator({
                                            name: editingIndicator.name,
                                            calcParams: editingIndicator.params
                                        });
                                    }
                                    setEditingIndicator(null);
                                }}
                                className="flex-1 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl transition-all">
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
