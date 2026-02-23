import React, { useEffect, useRef } from 'react';
import { BarChart, ChevronDown } from 'lucide-react';
import { formatNumber } from '../utils/helpers';
import { ChartData } from '../types';

interface SimpleBarChartProps {
    data: any[];
    dataKey: string;
    nameKey: string;
    title: string;
    currencySymbol: string;
    isDarkMode: boolean;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, dataKey, nameKey, title, currencySymbol, isDarkMode }) => {
    // 1. Calculate Ranges
    // Sort descending by PnL strictly
    const sortedData = nameKey === 'month'
        ? data.slice().sort((a, b) => a.month.localeCompare(b.month))
        : data.slice().sort((a, b) => b.pnl - a.pnl);

    if (sortedData.length === 0) {
        return (
            <div className={`p-5 rounded-2xl shadow-lg border transition-colors duration-300 ${isDarkMode ? 'bg-[#1e2230] border-gray-700/50 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>
                <h3 className="text-lg font-bold mb-6 flex items-center">{title}</h3>
                <p className="text-center py-4 text-xs font-bold">No data available.</p>
            </div>
        );
    }

    const maxVal = Math.max(...sortedData.map(d => d[dataKey]), 0);
    const minVal = Math.min(...sortedData.map(d => d[dataKey]), 0);

    // Add 10% padding
    // If all zero, default range 100
    const range = (maxVal - minVal) || 100;
    const renderMax = maxVal === 0 && minVal === 0 ? 100 : maxVal + (range * 0.1);
    const renderMin = maxVal === 0 && minVal === 0 ? -100 : minVal - (range * 0.1);
    const totalRenderRange = renderMax - renderMin;

    const zeroPercent = ((0 - renderMin) / totalRenderRange) * 100;

    // Generate Y-Axis Ticks (5 ticks)
    const ticks = [0, 0.25, 0.5, 0.75, 1].map(t => renderMin + (totalRenderRange * t));

    const theme = isDarkMode ? { bg: 'bg-[#1e2230]', text: 'text-gray-100', subText: 'text-gray-400', border: 'border-gray-700/50' } : { bg: 'bg-white', text: 'text-gray-900', subText: 'text-gray-500', border: 'border-gray-200' };

    return (
        <div className={`${theme.bg} p-5 rounded-2xl shadow-lg border ${theme.border} transition-colors duration-300`}>
            <h3 className={`text-lg font-bold ${theme.text} mb-6 flex items-center`}>{title}<BarChart size={18} className={`ml-2 text-green-500`} /></h3>

            <div className="flex w-full h-64">
                {/* Y-Axis Labels */}
                <div className="flex flex-col justify-between h-full pr-2 text-[9px] font-mono text-gray-400 text-right w-14 border-r border-gray-700/20 py-1">
                    {ticks.slice().reverse().map((tick, i) => (
                        <span key={i} className="leading-none">{formatNumber(tick, 0)}</span>
                    ))}
                </div>

                {/* Chart Area */}
                <div className="flex-1 h-full relative ml-2">
                    {/* Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((pos, i) => (
                        <div key={i} className="absolute inset-x-0 h-px bg-gray-700/20 md:bg-gray-700/10" style={{ top: `${pos * 100}%` }}></div>
                    ))}

                    {/* Zero Line */}
                    <div
                        className={`absolute inset-x-0 border-t border-dashed ${isDarkMode ? 'border-gray-500' : 'border-gray-400'} z-0 opacity-50`}
                        style={{ bottom: `${zeroPercent}%` }}
                    ></div>

                    {/* Bars Container */}
                    <div className="absolute inset-0 flex items-end justify-around px-2 pb-0 pt-0">
                        {sortedData.map((item, index) => {
                            const val = item[dataKey];
                            const isProfit = val >= 0;
                            const heightPercent = (Math.abs(val) / totalRenderRange) * 100;
                            const bottomPos = isProfit ? zeroPercent : (zeroPercent - heightPercent);
                            const name = item[nameKey].length > 8 ? item[nameKey].substring(0, 6) + '..' : item[nameKey];

                            return (
                                <div key={index} className="flex flex-col items-center justify-end h-full w-full relative group">
                                    {/* Bar Wrapper */}
                                    <div className="absolute w-full flex justify-center" style={{ height: '100%' }}>
                                        <div
                                            className={`w-3/5 rounded-sm transition-all duration-500 relative border ${isProfit ? 'bg-green-500 border-green-400' : 'bg-red-500 border-red-400'}`}
                                            style={{
                                                height: `${Math.max(heightPercent, 1)}%`,
                                                bottom: `${bottomPos}%`,
                                                position: 'absolute'
                                            }}
                                        >
                                            <div className={`absolute left-1/2 -translate-x-1/2 text-[9px] font-bold whitespace-nowrap opacity-100 transition-opacity bg-black/80 text-white px-1.5 py-0.5 rounded -top-6 z-10`}>
                                                {isProfit ? '+' : ''}{formatNumber(val, 0)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* X-Axis Label */}
                                    <div
                                        className="absolute w-full text-center"
                                        style={{
                                            bottom: '0px',
                                        }}
                                    >
                                        <span className={`text-[9px] font-bold uppercase tracking-tighter block truncate ${theme.subText} mt-1 pt-2 select-none`} title={item[nameKey]}>
                                            {name}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface MonthlyPerformanceWidgetProps {
    trades: any[];
    currencySymbol: string;
    isDarkMode: boolean;
    initialBalance: number;
}

export const MonthlyPerformanceWidget: React.FC<MonthlyPerformanceWidgetProps> = ({ trades, currencySymbol, isDarkMode, initialBalance }) => {
    const [historyRange, setHistoryRange] = React.useState<number>(12); // Months to show
    const [isOpen, setIsOpen] = React.useState(false);

    const theme = isDarkMode ? { bg: 'bg-[#1e2230]', text: 'text-gray-100', subText: 'text-gray-400', border: 'border-gray-700/50' } : { bg: 'bg-white', text: 'text-gray-900', subText: 'text-gray-500', border: 'border-gray-200' };

    // Calculate Monthly Data
    const monthlyData = React.useMemo(() => {
        const data: Record<string, { pnl: number, roi: number, balance: number }> = {};

        // Sort trades by date
        const sortedTrades = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        let currentBalance = initialBalance;

        // Group by month
        const monthlyGroups: Record<string, any[]> = {};
        sortedTrades.forEach(t => {
            const date = new Date(t.date);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!monthlyGroups[key]) monthlyGroups[key] = [];
            monthlyGroups[key].push(t);
        });

        // Calculate ROI per month cumulatively
        const allMonths = Object.keys(monthlyGroups).sort();

        // Need to fill in missing months if we want a continuous line? 
        // For now, let's just show months with activity or significant ones.
        // Actually, better to iterate through expected months.

        allMonths.forEach(month => {
            const monthTrades = monthlyGroups[month];
            const monthPnl = monthTrades.reduce((sum, t) => sum + t.pnl, 0);
            const startOfMonthBalance = currentBalance;
            const roi = startOfMonthBalance > 0 ? (monthPnl / startOfMonthBalance) * 100 : 0;

            currentBalance += monthPnl;

            data[month] = { pnl: monthPnl, roi, balance: currentBalance };
        });

        return Object.entries(data)
            .map(([month, stats]) => ({ month, ...stats }))
            .sort((a, b) => a.month.localeCompare(b.month)); // Oldest first
    }, [trades, initialBalance]);

    const displayData = monthlyData.slice(-historyRange);

    const options = [
        { label: 'Last 3 Months', value: 3 },
        { label: 'Last 6 Months', value: 6 },
        { label: 'Last 12 Months', value: 12 },
        { label: 'All Time', value: 999 },
    ];

    return (
        <div className={`${theme.bg} p-5 rounded-2xl shadow-lg border ${theme.border} transition-colors duration-300 mb-6`}>
            <div className="flex justify-between items-center mb-6">
                <h3 className={`text-lg font-bold ${theme.text}`}>Monthly Performance</h3>

                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                    >
                        {options.find(o => o.value === historyRange)?.label || 'Select Range'}
                        <ChevronDown size={14} />
                    </button>

                    {isOpen && (
                        <div className={`absolute right-0 top-full mt-2 w-36 rounded-xl overflow-hidden shadow-2xl z-20 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            {options.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => { setHistoryRange(opt.value); setIsOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-opacity-10 ${isDarkMode ? 'hover:bg-white text-gray-300' : 'hover:bg-black text-gray-700'} ${historyRange === opt.value ? 'bg-blue-500/10 text-blue-500' : ''}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {displayData.length === 0 ? (
                <div className="py-8 text-center text-gray-500 text-sm">No trading data available for this period.</div>
            ) : (
                <div className="space-y-4">
                    {displayData.map((item) => {
                        const date = new Date(item.month + '-01');
                        const monthName = date.toLocaleString('default', { month: 'short' });
                        const year = date.getFullYear();
                        const isProfit = item.pnl >= 0;

                        return (
                            <div key={item.month} className="flex items-center gap-4">
                                <div className={`w-12 text-xs font-bold ${theme.subText} uppercase text-right leading-tight`}>
                                    {monthName}<br /><span className="text-[10px] opacity-60">{year}</span>
                                </div>

                                <div className="flex-1 h-8 bg-gray-800/20 rounded-lg relative overflow-hidden flex items-center px-3">
                                    {/* Progress Bar Background */}
                                    {/* This is complex because P&L can be negative. Let's do a simple flex row for value and a badge for % */}

                                    <div className="flex-1 flex justify-between items-center z-10">
                                        <span className={`font-bold font-mono text-sm ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                                            {isProfit ? '+' : ''}{currencySymbol}{formatNumber(Math.abs(item.pnl), 2)}
                                        </span>

                                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${isProfit ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                            {isProfit ? '+' : ''}{item.roi.toFixed(2)}%
                                        </div>
                                    </div>

                                    {/* Visual Bar (Optional, simpler to just show values for now as requested "view" not explicitly chart type) 
                                         But a visual indicator is nice. Let's add a subtle background tint based on performance?
                                     */}
                                    <div
                                        className={`absolute inset-0 opacity-10 ${isProfit ? 'bg-green-500' : 'bg-red-500'}`}
                                        style={{ width: `${Math.min(Math.abs(item.roi) * 2, 100)}%` }} // Cap visual width at 50% ROI for scaling
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

interface CandlestickChartProps {
    data: any[];
    tradesToShow?: number;
    currencySymbol: string;
    isDarkMode: boolean;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, tradesToShow, currencySymbol, isDarkMode }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const relevantData = data;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [relevantData.length]);

    if (relevantData.length === 0) return <div className="h-32 flex items-center justify-center text-gray-500">No Trade Data</div>;

    const allPnl = relevantData.flatMap(d => [d.high, d.low, 0]), minPnl = Math.min(...allPnl), maxPnl = Math.max(...allPnl);
    const padding = (maxPnl - minPnl) * 0.1 || 10, yMin = minPnl - padding, yMax = maxPnl + padding, yRange = yMax - yMin;

    const SVG_HEIGHT = 180;
    const FIXED_GAP = 30; // Fixed spacing between candles
    const SVG_WIDTH = Math.max(relevantData.length * FIXED_GAP, 350);
    const scaleY = (val: number) => SVG_HEIGHT - ((val - yMin) / yRange) * SVG_HEIGHT;
    const zeroY = scaleY(0);

    return (
        <div className="relative w-full">

            <div
                ref={scrollRef}
                className="w-full overflow-x-auto overflow-y-hidden no-scrollbar"
                style={{ scrollBehavior: 'smooth' }}
            >
                <div style={{ width: SVG_WIDTH }}>
                    <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="h-auto block" style={{ minWidth: '100%' }}>
                        {/* Grid Lines & Zero Line */}
                        <line x1="0" y1={zeroY} x2={SVG_WIDTH} y2={zeroY} stroke={isDarkMode ? "#4B5563" : "#D1D5DB"} strokeWidth="1" strokeDasharray="4 2" />


                        {relevantData.map((d, i) => {
                            const x = (i * FIXED_GAP) + (FIXED_GAP / 2);
                            const color = d.close >= d.open ? '#10B981' : '#EF4444';
                            const rectY = Math.min(scaleY(d.open), scaleY(d.close)), rectH = Math.max(Math.abs(scaleY(d.open) - scaleY(d.close)), 2);
                            const candleW = FIXED_GAP * 0.7;

                            return (
                                <g key={i}>
                                    <line x1={x} y1={scaleY(d.high)} x2={x} y2={scaleY(d.low)} stroke={color} strokeWidth="1.5" />
                                    <rect x={x - (candleW / 2)} y={rectY} width={candleW} height={rectH} fill={color} rx="1" />
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>
        </div>
    );
};

interface PerformanceHeatmapProps {
    trades: any[];
    isDarkMode: boolean;
}

export const PerformanceHeatmap: React.FC<PerformanceHeatmapProps> = ({ trades, isDarkMode }) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const dailyPnl: Record<number, number> = {};
    trades.forEach(t => {
        // Manually parse YYYY-MM-DD to ensure we get the exact day in the string
        // independent of timezone shifts (which new Date() introduces for YYYY-MM-DD)
        let year, month, day;
        if (typeof t.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(t.date)) {
            const parts = t.date.split('-').map(Number);
            year = parts[0];
            month = parts[1] - 1; // 0-indexed
            day = parts[2];
        } else {
            const d = new Date(t.date);
            year = d.getFullYear();
            month = d.getMonth();
            day = d.getDate();
        }

        if (month === currentMonth && year === currentYear) {
            dailyPnl[day] = (dailyPnl[day] || 0) + Number(t.pnl);
        }
    });

    const theme = isDarkMode ? { bg: 'bg-[#1e2230]', text: 'text-gray-100', subText: 'text-gray-400', border: 'border-gray-700/50' } : { bg: 'bg-white', text: 'text-gray-900', subText: 'text-gray-500', border: 'border-gray-200' };
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className={`${theme.bg} p-5 rounded-2xl shadow-lg border ${theme.border} transition-colors duration-300 mb-6`}>
            <h3 className={`text-sm font-bold ${theme.subText} uppercase tracking-wider mb-4`}>Activity Heatmap ({today.toLocaleString('default', { month: 'long' })})</h3>
            <div className="grid grid-cols-7 gap-2">
                {dayLabels.map((lbl, i) => (
                    <div key={i} className={`text-center text-[9px] font-bold ${theme.subText} uppercase`}>{lbl}</div>
                ))}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square opacity-0"></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const pnl = dailyPnl[day];
                    let bgColor = isDarkMode ? 'bg-gray-800' : 'bg-gray-100';
                    if (pnl > 0) bgColor = 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]';
                    else if (pnl < 0) bgColor = 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]';

                    return (
                        <div
                            key={day}
                            className={`aspect-square rounded-lg ${bgColor} flex items-center justify-center text-[10px] font-black transition-all relative group cursor-default`}
                        >
                            <span className={pnl !== undefined ? 'text-white' : theme.subText}>{day}</span>
                            {pnl !== undefined && (
                                <div className="absolute bottom-full mb-2 hidden group-hover:block z-50 bg-[#0f172a] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap border border-gray-700 shadow-2xl">
                                    {pnl > 0 ? '+' : ''}${pnl.toFixed(2)}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-700/30">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div><span className="text-[10px] font-bold text-gray-500">Profit</span></div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div><span className="text-[10px] font-bold text-gray-500">Loss</span></div>
                <div className="flex items-center gap-2"><div className={`w-2.5 h-2.5 rounded-sm ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}></div><span className="text-[10px] font-bold text-gray-500">No Trade</span></div>
            </div>
        </div>
    );
};
