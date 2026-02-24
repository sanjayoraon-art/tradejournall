import React, { useMemo } from 'react';
import { AdvancedStatCard, TopTradesWidget } from '../components/Stats';
import { MonthlyPerformanceWidget, SimpleBarChart, PerformanceHeatmap } from '../components/Charts';
import { Pencil, TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';
import { PerformanceStats } from '../types';
import { calculateMaxDrawdown, calculateProfitFactor, calculateExpectancy, calculateAverageRR, getTopAndBottomTrades } from '../utils/analytics';

interface PerformanceMetricsScreenProps {
    performanceStats: PerformanceStats & { weeklyPnlData: any[], yearlyPnlData: any[] };
    trades: any[];
    theme: any;
    primaryCurrencySymbol: string;
    isDarkMode: boolean;
    timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all';
    setTimeframe: (t: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all') => void;
    selectedStrategy: string;
    setSelectedStrategy: (s: string) => void;
    availableStrategies: string[];
    initialBalance: number;
    setInitialBalance: (b: number) => void;
}

export const PerformanceMetricsScreen: React.FC<PerformanceMetricsScreenProps> = ({
    performanceStats,
    trades,
    theme,
    primaryCurrencySymbol,
    isDarkMode,
    timeframe,
    setTimeframe,
    selectedStrategy,
    setSelectedStrategy,
    availableStrategies,
    initialBalance,
    setInitialBalance
}) => {
    const { metricsCards, strategyProfitData } = performanceStats;
    const [isEditingBalance, setIsEditingBalance] = React.useState(false);
    const [tempBalance, setTempBalance] = React.useState(initialBalance.toString());

    // Calculate Advanced Metrics
    const advancedStats = useMemo(() => {
        const drawdown = calculateMaxDrawdown(trades, initialBalance);
        const profitFactor = calculateProfitFactor(trades);
        const expectancy = calculateExpectancy(trades);
        const avgRR = calculateAverageRR(trades);
        const { top, bottom } = getTopAndBottomTrades(trades);
        return { drawdown, profitFactor, expectancy, avgRR, topTrades: top, bottomTrades: bottom };
    }, [trades, initialBalance]);

    const handleBalanceSave = () => {
        const val = parseFloat(tempBalance);
        if (!isNaN(val) && val > 0) {
            setInitialBalance(val);
            setIsEditingBalance(false);
        }
    };

    return (
        <div className="px-4 pb-24 pt-4 space-y-6">
            <h2 className={`text-2xl font-bold ${theme.text}`}>Performance</h2>

            {/* Timeframe Selector */}
            <div className="flex bg-gray-800/50 p-1 rounded-xl border border-gray-700 overflow-x-auto no-scrollbar gap-2">
                {(['daily', 'weekly', 'monthly', 'yearly', 'all'] as const).map(t => (
                    <button
                        key={t}
                        onClick={() => setTimeframe(t)}
                        className={`flex-1 px-3 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center justify-center gap-2 ${timeframe === t ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
                    >
                        {t === 'all' ? 'ALL TIME' : t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {/* Advanced Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
                <AdvancedStatCard
                    title="Max Drawdown"
                    value={`${advancedStats.drawdown.percentage.toFixed(1)}%`}
                    subValue={`-${primaryCurrencySymbol}${Math.round(advancedStats.drawdown.amount).toLocaleString()}`}
                    icon={<TrendingDown />}
                    trend="down"
                    isDarkMode={isDarkMode}
                    colorClass="text-red-500"
                />
                <AdvancedStatCard
                    title="Expectancy"
                    value={`${advancedStats.expectancy >= 0 ? '+' : ''}${primaryCurrencySymbol}${Math.round(advancedStats.expectancy).toLocaleString()}`}
                    subValue="per trade"
                    icon={<Target />}
                    trend={advancedStats.expectancy >= 0 ? 'up' : 'down'}
                    isDarkMode={isDarkMode}
                    colorClass={advancedStats.expectancy >= 0 ? "text-green-500" : "text-yellow-500"}
                />
                <AdvancedStatCard
                    title="Profit Factor"
                    value={`${advancedStats.profitFactor.toFixed(2)}`}
                    icon={<Activity />}
                    trend={advancedStats.profitFactor > 1.5 ? 'up' : 'neutral'}
                    isDarkMode={isDarkMode}
                    colorClass="text-blue-500"
                />
                <AdvancedStatCard
                    title="Avg R:R"
                    value={`${advancedStats.avgRR.toFixed(2)}`}
                    icon={<TrendingUp />}
                    trend="neutral"
                    isDarkMode={isDarkMode}
                    colorClass="text-purple-500"
                />
            </div>

            {/* Performance Heatmap */}
            <div className={`p-4 rounded-2xl border ${theme.card} ${theme.border}`}>
                <h3 className={`text-sm font-bold uppercase tracking-wider ${theme.text} mb-4`}>Activity Heatmap</h3>
                <div className="overflow-x-auto">
                    <PerformanceHeatmap trades={trades} isDarkMode={isDarkMode} />
                </div>
            </div>


            {/* Monthly Performance Widget */}
            <MonthlyPerformanceWidget
                trades={trades}
                currencySymbol={primaryCurrencySymbol}
                isDarkMode={isDarkMode}
                initialBalance={initialBalance}
            />

            {/* Strategy Filter & Chart */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-bold ${theme.text}`}>Strategy Analysis</h3>
                    <div className="flex bg-gray-800/50 p-1 rounded-xl border border-gray-700 overflow-x-auto no-scrollbar gap-2 max-w-[60%]">
                        {availableStrategies.map(s => (
                            <button
                                key={s}
                                onClick={() => setSelectedStrategy(s)}
                                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all whitespace-nowrap ${selectedStrategy === s ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <SimpleBarChart
                    title={`P&L by Strategy (${selectedStrategy})`}
                    data={strategyProfitData}
                    dataKey="pnl"
                    nameKey="name"
                    currencySymbol={primaryCurrencySymbol}
                    isDarkMode={isDarkMode}
                />
            </div>

            {/* Initial Balance Config (At Bottom) */}
            <div className={`px-4 py-3 rounded-xl border ${theme.border} ${theme.card} flex items-center justify-between opacity-50 hover:opacity-100 transition-opacity`}>
                <span className={`text-xs font-bold ${theme.subText || 'text-gray-500'} uppercase tracking-wider`}>Initial Capital</span>
                <div className="flex items-center gap-2">
                    {isEditingBalance ? (
                        <div className="flex items-center gap-2">
                            <span className={theme.text}>{primaryCurrencySymbol}</span>
                            <input
                                type="number"
                                value={tempBalance}
                                onChange={(e) => setTempBalance(e.target.value)}
                                className="w-24 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white"
                                autoFocus
                            />
                            <button onClick={handleBalanceSave} className="text-green-500 text-xs font-bold hover:underline">SAVE</button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setIsEditingBalance(true)}>
                            <span className={`font-mono font-bold ${theme.text}`}>{primaryCurrencySymbol}{initialBalance.toLocaleString()}</span>
                            <Pencil size={12} className="text-gray-500 group-hover:text-green-500 transition-colors" />
                        </div>
                    )}
                </div>
            </div>

            <div className="h-4"></div>
        </div>
    );
};
