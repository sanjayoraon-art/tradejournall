import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Play, Pause, SkipForward, RefreshCw, Search,
    TrendingUp, TrendingDown, Maximize2, Minimize2,
    MousePointer, Trash2, ChevronDown, X, BarChart2, Zap, Pencil
} from 'lucide-react';
import type { Chart, KLineData } from 'klinecharts';
import { fetchBinanceKlines, BinanceKline } from '../utils/binanceApi';
import { fetchYahooKlines } from '../utils/marketApi';

// â”€â”€â”€ CDN global wrappers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const _kc = () => (window as any).klinecharts as typeof import('klinecharts');
const kcInit: typeof import('klinecharts')['init'] = (...args) => _kc().init(...args);
const kcDispose: typeof import('klinecharts')['dispose'] = (...args) => _kc().dispose(...args);

// â”€â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    { name: 'segment', label: 'Trend Line', icon: '/' },
    { name: 'rayLine', label: 'Ray', icon: '->' },
    { name: 'straightLine', label: 'Extended Line', icon: '<->' },
    { name: 'horizontalStraightLine', label: 'Horizontal Line', icon: '--' },
    { name: 'verticalStraightLine', label: 'Vertical Line', icon: '|' },
    { name: 'priceLine', label: 'Price Level', icon: '$' },
    { name: 'parallelStraightLine', label: 'Parallel Channel', icon: '=' },
    { name: 'fibonacciLine', label: 'Fibonacci', icon: 'Fib' },
    { name: 'rect', label: 'Rectangle', icon: '[]' },
    { name: 'circle', label: 'Circle', icon: 'O' },
    { name: 'triangle', label: 'Triangle', icon: '/\\' },
    { name: 'text', label: 'Note', icon: 'T' },
    { name: 'arrow', label: 'Arrow', icon: '->' },
];

const CANDLE_TYPES = [
    { value: 'candle_solid', label: 'Candle', icon: 'C' },
    { value: 'candle_stroke', label: 'Hollow', icon: 'H' },
    { value: 'ohlc', label: 'OHLC', icon: 'B' },
    { value: 'area', label: 'Area', icon: '~' },
];

const INTERVALS = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '1d', '1w'];
const YAHOO_INTERVALS = ['1m', '5m', '15m', '30m', '1h', '1d', '1w'];

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        type: 'Long' | 'Short'; entryPrice: number; entryTime: number; takeProfit?: number; stopLoss?: number;
    } | null>(null);
    const [positionSize, setSize] = useState(1000);
    const [currentPrice, setPrice] = useState(0);
    const [takeProfitStr, setTakeProfitStr] = useState('');
    const [stopLossStr, setStopLossStr] = useState('');

    // Chart toolbar
    const [candleType, setCandleType] = useState('candle_solid');
    const [activeIndicators, setActiveInds] = useState<Set<string>>(new Set());
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [showIndMenu, setShowIndMenu] = useState(false);
    const [showToolMenu, setShowToolMenu] = useState(false);
    const [showCandleMenu, setShowCandleMenu] = useState(false);
    const [isFullscreen, setFullscreen] = useState(false);

    // Indicator settings
    const [editingIndicator, setEditingIndicator] = useState<{ paneId: string; name: string; params: number[] } | null>(null);

    // Chart
    const containerRef = useRef<HTMLDivElement>(null);
    const modalContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<Chart | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [chartModalOpen, setChartModalOpen] = useState(false);

    // â”€â”€ Chart theme â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const applyTheme = useCallback((chart: Chart, type = candleType) => {
        chart.setStyles({
            grid: {
                show: true,
                horizontal: { color: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                vertical: { color: isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' },
            },
            candle: {
                type: type as any,
                tooltip: { showRule: 'none' as any }, // Hides the top-left OHLC numbers
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
            yAxis: {
                axisLine: { color: 'rgba(255,255,255,0.08)' },
                tickLine: { color: 'rgba(255,255,255,0.08)' },
                tickText: { color: isDarkMode ? '#6b7280' : '#9ca3af', size: 11 },
                inside: true // Better for mobile interaction
            },
            indicator: {
                tooltip: {
                    showRule: 'none' as any, // Hides indicator numeric values
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

    // â”€â”€ Init chart â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const initChart = useCallback((data: BinanceKline[]) => {
        if (!containerRef.current) return;
        if (chartRef.current) { kcDispose(containerRef.current); chartRef.current = null; }
        const chart = kcInit(containerRef.current);
        if (!chart) return;
        applyTheme(chart);
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
        setActiveInds(new Set());
    }, [applyTheme]);

    // â”€â”€ Load data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const loadData = useCallback(async (currentSymbol = symbol, currentInterval = chartInterval, currentMarketSource = marketSource) => {
        setIsLoading(true); setError(''); setPlaying(false); setActiveTrade(null); setActiveTool(null);
        if (timerRef.current) clearInterval(timerRef.current);
        setData([]); // Clear old data
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

    // â”€â”€ Candle type live switch â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    useEffect(() => {
        if (!chartRef.current) return;
        chartRef.current.setStyles({ candle: { type: candleType as any } });
        setShowCandleMenu(false);
    }, [candleType]);

    // â”€â”€ Auto-load Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const initialLoadDone = useRef(false);
    useEffect(() => {
        if (initialLoadDone.current) return;
        initialLoadDone.current = true;
        loadData('BTCUSDT', '5m', 'crypto');
    }, [loadData]);

    // â”€â”€ Indicator toggle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

    // â”€â”€ Drawing tools â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

    // â”€â”€ Replay â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

        // Check TP / SL hits
        if (activeTrade) {
            let triggeredExit: number | null = null;
            let note = '';

            if (activeTrade.type === 'Long') {
                if (activeTrade.stopLoss && c.low <= activeTrade.stopLoss) {
                    // Check if gap down bypassed SL completely, exit at open if so, else SL price
                    triggeredExit = c.open <= activeTrade.stopLoss ? c.open : activeTrade.stopLoss;
                    note = 'Hit Stop Loss';
                } else if (activeTrade.takeProfit && c.high >= activeTrade.takeProfit) {
                    triggeredExit = c.open >= activeTrade.takeProfit ? c.open : activeTrade.takeProfit;
                    note = 'Hit Take Profit';
                }
            } else {
                if (activeTrade.stopLoss && c.high >= activeTrade.stopLoss) {
                    triggeredExit = c.open >= activeTrade.stopLoss ? c.open : activeTrade.stopLoss;
                    note = 'Hit Stop Loss';
                } else if (activeTrade.takeProfit && c.low <= activeTrade.takeProfit) {
                    triggeredExit = c.open <= activeTrade.takeProfit ? c.open : activeTrade.takeProfit;
                    note = 'Hit Take Profit';
                }
            }

            if (triggeredExit !== null) {
                // Pause automatically when hitting target
                setPlaying(false);
                closeTrade(triggeredExit, `Auto-closed: ${note}`);
            }
        }
    }, [currentIndex, historicalData, activeTrade]);

    // ── Modal chart (fullscreen mirror) ───────────────────────────────────────
    const modalChartRef = useRef<Chart | null>(null);
    const fullscreenWrapperRef = useRef<HTMLDivElement>(null);

    // Orientation lock for mobile
    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                // If user leaves fullscreen via system gesture (e.g. back button)
                setChartModalOpen(false);
            }
        };

        if (chartModalOpen) {
            // Try to enter true fullscreen first
            const wrapper = fullscreenWrapperRef.current;
            if (wrapper && wrapper.requestFullscreen) {
                wrapper.requestFullscreen().then(() => {
                    // Lock orientation AFTER fullscreen is granted
                    if (screen.orientation && (screen.orientation as any).lock) {
                        (screen.orientation as any).lock('landscape').catch(() => {
                            console.warn('Orientation lock failed inside fullscreen.');
                        });
                    }
                }).catch(e => {
                    console.warn('Fullscreen entry failed:', e);
                    // Fallback to orientation lock if fullscreen fails
                    if (screen.orientation && (screen.orientation as any).lock) {
                        (screen.orientation as any).lock('landscape').catch(() => { });
                    }
                });
            }

            document.addEventListener('fullscreenchange', handleFullscreenChange);
        } else {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => { });
            }
            if (screen.orientation && screen.orientation.unlock) {
                try { screen.orientation.unlock(); } catch (e) { }
            }
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        }

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [chartModalOpen]);

    useEffect(() => {
        if (!chartModalOpen) {
            // Dispose modal chart when closed
            if (modalChartRef.current && modalContainerRef.current) {
                try { kcDispose(modalContainerRef.current); } catch { }
                modalChartRef.current = null;
            }
            return;
        }

        const handleResize = () => {
            if (modalChartRef.current) {
                modalChartRef.current.resize();
            }
        };

        // Wait for the DOM to be ready
        const timer = setTimeout(() => {
            if (!modalContainerRef.current) return;
            try { kcDispose(modalContainerRef.current); } catch { }
            const mc = kcInit(modalContainerRef.current);
            if (!mc) return;
            applyTheme(mc);
            if (historicalData.length > 0) {
                const slice = historicalData.slice(0, currentIndex + 1);
                mc.applyNewData(slice.map(d => ({ timestamp: d.timestamp, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volume })));
            }
            mc.resize(); // Ensure initial fit
            modalChartRef.current = mc;

            window.addEventListener('resize', handleResize);
            window.addEventListener('orientationchange', handleResize);
        }, 150); // Slightly longer delay to allow orientation lock to settle

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, [chartModalOpen]);

    // Sync modal chart during replay
    useEffect(() => {
        if (!modalChartRef.current || !chartModalOpen || historicalData.length === 0 || currentIndex < INITIAL_VISIBLE) return;
        const c = historicalData[currentIndex];
        try {
            modalChartRef.current.updateData({ timestamp: c.timestamp, open: c.open, high: c.high, low: c.low, close: c.close, volume: c.volume });
        } catch { }
    }, [currentIndex, chartModalOpen]);

    // â”€â”€ Trading â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const currentBar = historicalData.length > 0 && currentIndex < historicalData.length ? historicalData[currentIndex] : null;
    const price = currentBar?.close ?? currentPrice;

    const openTrade = (type: 'Long' | 'Short') => {
        if (activeTrade || !currentBar) return;
        const tp = parseFloat(takeProfitStr);
        const sl = parseFloat(stopLossStr);
        setActiveTrade({
            type,
            entryPrice: currentBar.close,
            entryTime: currentBar.timestamp,
            takeProfit: !isNaN(tp) && tp > 0 ? tp : undefined,
            stopLoss: !isNaN(sl) && sl > 0 ? sl : undefined,
        });
    };

    const closeTrade = (exitPrice = price, noteOverride?: string) => {
        if (!activeTrade) return;
        const size = positionSize || 1000;
        const pnl = activeTrade.type === 'Long'
            ? ((exitPrice - activeTrade.entryPrice) / activeTrade.entryPrice) * size
            : ((activeTrade.entryPrice - exitPrice) / activeTrade.entryPrice) * size;
        addTrade({
            symbol: symbol.toUpperCase(),
            date: new Date(activeTrade.entryTime).toISOString().split('T')[0],
            entryPrice: activeTrade.entryPrice,
            exitPrice: exitPrice,
            pnl: parseFloat(pnl.toFixed(2)),
            type: activeTrade.type,
            strategy: 'Backtest',
            note: noteOverride || `Backtest sim â€” $${size} position`,
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

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Render
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    return (
        <div
            className={`flex flex-col gap-3 ${isFullscreen ? `fixed inset-0 z-50 p-3 overflow-y-auto ${theme.bg}` : ''}`}
            onClick={closeAllMenus}
        >
            {/* â•â• TOP BAR â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <div className={`flex flex-col sm:flex-row flex-wrap sm:items-center gap-3 px-3 py-3 rounded-xl border ${theme.border} ${theme.card}`}>
                {/* Title + Fullscreen (Mobile) */}
                <div className="flex items-center justify-between sm:mr-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <BarChart2 size={16} className="text-blue-400" />
                        </div>
                        <span className="font-bold text-sm" style={{ color: isDarkMode ? '#e5e7eb' : '#111827' }}>
                            Chart Replay
                        </span>
                    </div>
                    <button onClick={() => setFullscreen(!isFullscreen)}
                        className={`sm:hidden p-1.5 rounded-lg border transition-all ${theme.border} ${theme.text} hover:text-blue-400`}>
                        {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                </div>

                {/* Symbol & Load */}
                <div className="flex flex-wrap items-center gap-2">
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
                            placeholder={marketSource === 'crypto' ? 'BTCUSDT' : 'AAPL, EURUSD=X'}
                            className={`w-28 px-2 py-1.5 text-xs font-bold outline-none uppercase tracking-wide ${theme.input}`}
                        />
                    </div>

                    <div className="flex items-center gap-1.5">
                        <select
                            value={chartInterval}
                            onChange={e => {
                                const newInterval = e.target.value;
                                setChartInterval(newInterval);
                                loadData(symbol, newInterval, marketSource);
                            }}
                            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${theme.input}`}
                        >
                            {(marketSource === 'crypto' ? INTERVALS : YAHOO_INTERVALS).map(i => <option key={i} value={i}>{i.toUpperCase()}</option>)}
                        </select>
                        <button
                            onClick={e => { e.stopPropagation(); loadData(); }}
                            disabled={isLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white transition-all disabled:opacity-50"
                        >
                            {isLoading ? <RefreshCw size={12} className="animate-spin" /> : <Search size={12} />}
                            {isLoading ? 'Loading...' : 'Load'}
                        </button>
                    </div>

                    {/* Tools Row */}
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        {/* Candle type */}
                        <div className="relative flex-1 sm:flex-none" onClick={e => e.stopPropagation()}>
                            <button
                                onClick={() => { setShowCandleMenu(!showCandleMenu); setShowIndMenu(false); setShowToolMenu(false); }}
                                className={`flex justify-center items-center w-full sm:w-auto gap-1 px-2.5 py-2 sm:py-1.5 text-xs font-semibold rounded-lg border transition-all
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
                        <div className="relative flex-1 sm:flex-none" onClick={e => e.stopPropagation()}>
                            <button
                                onClick={() => { setShowIndMenu(!showIndMenu); setShowToolMenu(false); setShowCandleMenu(false); }}
                                className={`flex justify-center items-center w-full sm:w-auto gap-1.5 px-2.5 py-2 sm:py-1.5 text-xs font-semibold rounded-lg border transition-all
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
                                                                {active && <span className="mr-0.5">&#10003;</span>}{name}
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
                        <div className="relative flex-1 sm:flex-none" onClick={e => e.stopPropagation()}>
                            <button
                                onClick={() => { setShowToolMenu(!showToolMenu); setShowIndMenu(false); setShowCandleMenu(false); }}
                                className={`flex justify-center items-center w-full sm:w-auto gap-1.5 px-2.5 py-2 sm:py-1.5 text-xs font-semibold rounded-lg border transition-all
                                    ${activeTool || showToolMenu ? 'bg-purple-600 border-purple-600 text-white' : 'border-purple-500/40 text-purple-400 hover:bg-purple-500/10'}`}
                            >
                                <Pencil size={12} />
                                <span className="hidden sm:inline">{toolLabel}</span>
                                <ChevronDown size={11} />
                            </button>
                            {showToolMenu && (
                                <div className={`absolute top-full left-0 mt-1 w-48 rounded-xl shadow-2xl border overflow-hidden ${theme.border} z-50`}
                                    style={{ background: isDarkMode ? '#1f2937' : '#fff' }}>
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

                        {/* Fullscreen (Desktop) */}
                        <button onClick={() => setFullscreen(!isFullscreen)}
                            className={`hidden sm:flex p-1.5 rounded-lg border transition-all ${theme.border} ${theme.text} hover:text-blue-400`}>
                            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    <X size={14} className="shrink-0" />
                    {error}
                </div>
            )}

            {/* â•â• CHART AREA â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            <div className={`relative rounded-xl border overflow-hidden ${theme.border} ${isFullscreen ? 'h-[55vh]' : 'h-[420px] md:h-[490px]'}`}
                style={{ background: isDarkMode ? '#111827' : '#f9fafb' }}>

                <div ref={containerRef} className="w-full h-full" style={{ touchAction: 'none' }} />

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

                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center"
                        style={{ background: isDarkMode ? 'rgba(17,24,39,0.8)' : 'rgba(249,250,251,0.8)' }}>
                        <div className="flex items-center gap-2 text-blue-400">
                            <RefreshCw size={18} className="animate-spin" />
                            <span className="text-sm font-semibold">Loading {symbol}...</span>
                        </div>
                    </div>
                )}

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

                {activeTool && (
                    <div className="absolute top-3 left-3 pointer-events-none">
                        <div className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-600/90 backdrop-blur text-white flex items-center gap-1.5">
                            <Pencil size={11} /> {toolLabel}
                        </div>
                    </div>
                )}

                {/* Expand button - always visible */}
                <button
                    onClick={() => setChartModalOpen(true)}
                    title="Chart ko fullscreen mein kholein"
                    className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gray-900/80 backdrop-blur border border-white/10 text-white hover:bg-blue-600/80 hover:border-blue-500/50 active:scale-95 transition-all"
                >
                    <Maximize2 size={13} />
                    <span>Expand</span>
                </button>
            </div>

            {/* ══ CHART FULLSCREEN MODAL ════════════════════════════════════════ */}
            {chartModalOpen && (
                <div
                    ref={fullscreenWrapperRef}
                    className="fixed inset-0 z-[200] flex animate-in fade-in duration-300 overflow-hidden"
                    style={{ background: isDarkMode ? '#111827' : '#0f172a' }}
                >
                    {/* LEFT SIDE: TOOLBAR/DRAWING TOOLS (Subtle icons) */}
                    <div className="hidden sm:flex flex-col items-center gap-4 py-4 w-12 border-right border-white/5 bg-black/20 shrink-0">
                        <button className="p-2 text-gray-500 hover:text-white transition-colors"><MousePointer size={18} /></button>
                        <button className="p-2 text-gray-500 hover:text-white transition-colors" onClick={() => selectTool('segment')}><Pencil size={18} /></button>
                        <button className="p-2 text-gray-500 hover:text-white transition-colors" onClick={() => selectTool('fibonacciLine')}><Zap size={18} /></button>
                        <div className="flex-1" />
                        <button className="p-2 text-red-500/50 hover:text-red-500 transition-colors" onClick={clearDrawings}><Trash2 size={18} /></button>
                    </div>

                    {/* CENTER: CHART + TOP/BOTTOM BARS */}
                    <div className="flex-1 flex flex-col relative">
                        {/* Modal Top Bar */}
                        <div className="flex items-center justify-between gap-1 px-2 py-1 border-b border-white/10 shrink-0 bg-gray-900/90 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 cursor-pointer hover:bg-white/5 px-1 rounded transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // You could add logic here to open a timeframe menu if needed, 
                                        // but for now let's just make it visible and ensure click doesn't hit chart
                                    }}>
                                    <span className="text-[11px] font-black text-white">{symbol}</span>
                                    <span className="text-[9px] font-bold text-gray-400 bg-white/5 px-1 rounded">{chartInterval.toUpperCase()}</span>
                                </div>
                                {historicalData.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[11px] font-mono font-bold ${price > (historicalData[currentIndex > 0 ? currentIndex - 1 : 0]?.close ?? price) ? 'text-green-400' : 'text-red-400'}`}>
                                            {price.toFixed(priceDecimals)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 ml-2 border-l border-white/10 pl-4">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setShowIndMenu(!showIndMenu); }}
                                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold transition-all
                                            ${showIndMenu ? 'bg-blue-600 text-white' : 'text-blue-400 hover:bg-blue-500/10'}`}>
                                        <TrendingUp size={10} /> Indicators
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setShowToolMenu(!showToolMenu); }}
                                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold transition-all
                                            ${showToolMenu ? 'bg-purple-600 text-white' : 'text-purple-400 hover:bg-purple-500/10'}`}>
                                        <Pencil size={10} /> Tools
                                    </button>
                                </div>
                            </div>

                            {/* Center Playback (Integrated into top bar for more chart space) */}
                            <div className="flex items-center gap-2 bg-black/40 rounded-full px-2 py-0.5 border border-white/10 scale-90 sm:scale-100">
                                <button
                                    onClick={() => historicalData.length > 0 && setIndex(p => Math.max(INITIAL_VISIBLE, p - 1))}
                                    disabled={isPlaying}
                                    className="p-0.5 text-gray-500 hover:text-white disabled:opacity-20"><SkipForward size={12} className="rotate-180" /></button>
                                <button
                                    onClick={() => setPlaying(p => !p)}
                                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider
                                        ${isPlaying ? 'text-amber-400' : 'text-green-400'}`}>
                                    {isPlaying ? <Pause size={10} fill="currentColor" /> : <Play size={10} fill="currentColor" />}
                                </button>
                                <button
                                    onClick={() => historicalData.length > 0 && currentIndex < historicalData.length - 1 && setIndex(p => p + 1)}
                                    disabled={isPlaying}
                                    className="p-0.5 text-gray-500 hover:text-white disabled:opacity-20"><SkipForward size={12} /></button>
                            </div>

                            <div className="flex items-center gap-1">
                                <button className="p-1 text-gray-400 hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}><RefreshCw size={12} /></button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setChartModalOpen(false); }}
                                    className="p-1 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {showIndMenu && (
                            <div className={`absolute top-10 left-2 w-56 rounded-xl shadow-2xl border overflow-hidden ${theme.border} z-[300]`}
                                style={{ background: isDarkMode ? '#1f2937' : '#fff' }}
                                onClick={e => e.stopPropagation()}
                                onTouchStart={e => e.stopPropagation()}
                            >
                                <div className="max-h-60 overflow-y-auto p-2 space-y-2 overscroll-contain">
                                    {INDICATOR_GROUPS.map(group => (
                                        <div key={group.label}>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-1 mb-1">{group.label}</p>
                                            <div className="flex flex-wrap gap-1">
                                                {group.items.map(name => (
                                                    <button key={name} onClick={() => toggleIndicator(name)}
                                                        className={`px-1.5 py-0.5 text-[10px] rounded font-semibold transition-all
                                                            ${activeIndicators.has(name) ? 'bg-blue-600 text-white' : `${theme.text} bg-gray-800/50 hover:bg-blue-500/10`}`}>
                                                        {name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {showToolMenu && (
                            <div className={`absolute top-10 left-2 w-44 rounded-xl shadow-2xl border overflow-hidden ${theme.border} z-[300]`}
                                style={{ background: isDarkMode ? '#1f2937' : '#fff' }}
                                onClick={e => e.stopPropagation()}
                                onTouchStart={e => e.stopPropagation()}
                            >
                                <div className="max-h-60 overflow-y-auto overscroll-contain">
                                    {DRAWING_TOOLS.map(tool => (
                                        <button key={tool.name} onClick={() => selectTool(tool.name)}
                                            className={`w-full px-2 py-1.5 text-[10px] text-left flex items-center gap-2 transition-colors
                                                ${activeTool === tool.name ? 'bg-purple-600 text-white font-bold' : `${theme.text} hover:bg-purple-500/10`}`}>
                                            <span className="font-mono w-4 text-center">{tool.icon}</span>
                                            {tool.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Chart Area */}
                        <div className="flex-1 relative w-full overflow-hidden" ref={modalContainerRef} style={{ touchAction: 'none' }} />

                        {/* Modal Bottom Bar - Slimmer */}
                        <div className="px-3 py-1 border-t border-white/5 flex items-center justify-between shrink-0 bg-gray-900/90 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <span className="text-[9px] font-bold text-gray-500 font-mono">
                                    {currentBar ? new Date(currentBar.timestamp).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '--'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 grayscale opacity-50 contrast-125">
                                    <BarChart2 size={10} className="text-blue-400" />
                                    <span className="text-[8px] font-bold text-gray-500 uppercase">log</span>
                                    <span className="text-[8px] font-bold text-blue-400 uppercase">auto</span>
                                </div>
                            </div>
                        </div>

                        {/* Buy/Sell Buttons Overlay (Floating on the right) */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
                            <button
                                onClick={() => activeTrade ? closeTrade() : openTrade('Long')}
                                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-xl active:scale-90 border-2
                                    ${activeTrade?.type === 'Long'
                                        ? 'bg-blue-600 border-blue-400 animate-pulse'
                                        : 'bg-green-600 border-green-400/50 hover:bg-green-500'}`}>
                                <span className="text-sm font-black text-white">{activeTrade?.type === 'Long' ? 'X' : 'B'}</span>
                            </button>
                            <button
                                onClick={() => activeTrade ? closeTrade() : openTrade('Short')}
                                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-xl active:scale-90 border-2
                                    ${activeTrade?.type === 'Short'
                                        ? 'bg-blue-600 border-blue-400 animate-pulse'
                                        : 'bg-red-600 border-red-400/50 hover:bg-red-500'}`}>
                                <span className="text-sm font-black text-white">{activeTrade?.type === 'Short' ? 'X' : 'S'}</span>
                            </button>

                            {/* Floating P&L Indicator when trade is active */}
                            {activeTrade && (
                                <div className={`px-2 py-1 rounded-lg border backdrop-blur-md shadow-xl transition-all
                                    ${pnlPositive ? 'bg-green-500/20 border-green-500/40 text-green-400' : 'bg-red-500/20 border-red-500/40 text-red-400'}`}>
                                    <p className="text-[8px] font-black uppercase text-center opacity-70">{activeTrade.type}</p>
                                    <p className="text-[10px] font-bold whitespace-nowrap">${unrealizedPnl.toFixed(2)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ━━ CONTROLS BAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
            <div className={`flex flex-wrap items-center gap-2 px-3 py-2.5 rounded-xl border ${theme.border} ${theme.card}`}>
                {/* Playback controls */}
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => historicalData.length > 0 && setIndex(p => Math.max(INITIAL_VISIBLE, p - 1))}
                        disabled={isPlaying || historicalData.length === 0}
                        className={`p-1.5 rounded-lg border transition-all disabled:opacity-40 ${theme.border} text-gray-400 hover:text-white hover:border-gray-500`}>
                        <SkipForward size={14} className="rotate-180" />
                    </button>
                    <button
                        onClick={() => setPlaying(p => !p)}
                        disabled={historicalData.length === 0 || currentIndex >= historicalData.length - 1}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-40
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
                            className={`px-2.5 py-1 text-xs font-bold transition-colors whitespace-nowrap
                                ${speed === s ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                            {s}x
                        </button>
                    ))}
                </div>

                <div className="h-5 w-px bg-gray-700/50" />

                {/* Time & Progress */}
                {historicalData.length > 0 && (
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="font-mono bg-gray-800/50 px-2 py-1 rounded-lg">
                            {currentBar ? new Date(currentBar.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '--'}
                        </span>
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

            {/* â•â• TRADING PANEL â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
            {historicalData.length > 0 && (
                <div className={`rounded-xl border ${theme.border} ${theme.card} overflow-hidden`}>
                    {/* Panel header */}
                    <div className={`px-4 py-2.5 border-b ${theme.border} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
                        <div className="flex items-center gap-2">
                            <Zap size={14} className="text-amber-400" />
                            <span className="text-xs font-bold text-gray-400">Paper Trading</span>
                        </div>

                        <div className="flex items-center flex-wrap gap-x-4 gap-y-2">
                            {/* Take Profit */}
                            <div className="flex items-center gap-2 flex-1 sm:flex-none">
                                <span className="text-[10px] text-green-500 font-semibold w-16 sm:w-auto">TARGET</span>
                                <input
                                    type="number"
                                    value={takeProfitStr}
                                    onChange={e => setTakeProfitStr(e.target.value)}
                                    disabled={!!activeTrade}
                                    placeholder="Price"
                                    className={`w-20 px-2 py-1 text-xs outline-none text-right rounded-lg border ${theme.border} bg-transparent ${theme.text} disabled:opacity-50`}
                                />
                            </div>

                            {/* Stop Loss */}
                            <div className="flex items-center gap-2 flex-1 sm:flex-none">
                                <span className="text-[10px] text-red-500 font-semibold w-16 sm:w-auto">STOP</span>
                                <input
                                    type="number"
                                    value={stopLossStr}
                                    onChange={e => setStopLossStr(e.target.value)}
                                    disabled={!!activeTrade}
                                    placeholder="Price"
                                    className={`w-20 px-2 py-1 text-xs outline-none text-right rounded-lg border ${theme.border} bg-transparent ${theme.text} disabled:opacity-50`}
                                />
                            </div>

                            {/* Position size */}
                            <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-2 sm:pl-4 sm:border-l sm:border-gray-700/50 pt-2 sm:pt-0 border-t border-gray-700/50 sm:border-t-0">
                                <span className="text-[10px] text-gray-500 font-semibold w-16 sm:w-auto">SIZE</span>
                                <div className={`flex items-center rounded-lg border overflow-hidden ${theme.border} flex-1 sm:flex-none`}>
                                    <span className="px-2 py-1 text-xs text-gray-500 bg-gray-800/50">$</span>
                                    <input
                                        type="number"
                                        value={positionSize}
                                        onChange={e => setSize(Math.max(1, parseInt(e.target.value) || 1000))}
                                        disabled={!!activeTrade}
                                        min={1}
                                        className={`w-full sm:w-20 px-2 py-1 text-xs outline-none text-right bg-transparent ${theme.text} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-800/50">
                        {/* Buy/Sell Buttons */}
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
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${activeTrade.type === 'Long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {activeTrade.type === 'Long' ? 'â–² LONG' : 'â–¼ SHORT'}
                                            </span>
                                            <span className="text-xs text-gray-500">@ {activeTrade.entryPrice.toFixed(priceDecimals)}</span>
                                            {(activeTrade.takeProfit || activeTrade.stopLoss) && (
                                                <div className="flex items-center gap-2">
                                                    {activeTrade.takeProfit && (
                                                        <span className="text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded border border-green-500/20">
                                                            ðŸŽ¯ {activeTrade.takeProfit.toFixed(priceDecimals)}
                                                        </span>
                                                    )}
                                                    {activeTrade.stopLoss && (
                                                        <span className="text-[10px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20">
                                                            ðŸ›‘ {activeTrade.stopLoss.toFixed(priceDecimals)}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-600 uppercase tracking-wide">Unrealized P&L</p>
                                            <p className={`text-lg font-black leading-tight ${pnlPositive ? 'text-green-400' : 'text-red-400'}`}>
                                                {pnlPositive ? '+' : ''}${unrealizedPnl.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => closeTrade(price)}
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

            {/* â•â• INDICATOR SETTINGS MODAL â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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

export default BacktestingScreen;
