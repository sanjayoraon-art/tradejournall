import React from 'react';
import { Plus, TrendingUp, TrendingDown, Clock, Scale, Calculator, ChevronRight } from 'lucide-react';
import { PerformanceStats, Trade } from '../types';
import { formatNumber, getCurrencySymbol } from '../utils/helpers';
import { CandlestickChart } from '../components/Charts';
import { StatBlock } from '../components/Stats';

interface DashboardScreenProps {
    performanceStats: PerformanceStats;
    trades: Trade[];
    theme: any;
    isDarkMode: boolean;
    setCurrentScreen: (screen: string) => void;
    primaryCurrencySymbol: string;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ performanceStats, trades, theme, isDarkMode, setCurrentScreen, primaryCurrencySymbol }) => {
    const { totalPnl, totalTrades, winRate, perTradeCandles } = performanceStats;
    const recentTrades = trades.slice(0, 15);

    return (
        <div className="px-4 pb-24 pt-4">
            <div className={`${theme.card} p-4 rounded-xl shadow-lg border ${theme.border} mb-6`}>
                <span className={`text-sm ${theme.subText}`}>Total Portfolio P&L ({performanceStats.baseCurrencyCode})</span>
                <h2 className={`text-4xl font-extrabold ${totalPnl >= 0 ? 'text-green-500' : 'text-red-500'} mb-4`}>
                    {totalPnl >= 0 ? '+' : '-'}{primaryCurrencySymbol}{formatNumber(Math.abs(totalPnl), 2)}
                </h2>
                <h3 className={`text-lg font-semibold ${theme.text} mb-2 mt-4 flex items-center gap-2`}>
                    Equity Curve <TrendingUp size={16} className="text-green-500" />
                </h3>
                <div className={`w-full rounded-xl p-2 mb-4 ${isDarkMode ? 'bg-gray-700/50 border border-gray-600/30' : 'bg-white border shadow-inner'}`}>
                    <CandlestickChart data={perTradeCandles} currencySymbol={primaryCurrencySymbol} isDarkMode={isDarkMode} />
                </div>
            </div>

            <button className="w-full flex items-center justify-center py-4 mb-6 bg-green-600 text-white font-black rounded-xl shadow-lg shadow-green-500/20 active:scale-95 transition-all" onClick={() => setCurrentScreen('AddNewTrade')}><Plus size={20} className="mr-2" />ADD NEW TRADE</button>


            <div className={`${theme.card} p-2 rounded-xl shadow-lg border ${theme.border} mb-6`}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2">
                    <StatBlock label="Trades" value={totalTrades} color="text-yellow-500" icon={Clock} theme={theme} isDarkMode={isDarkMode} />
                    <StatBlock label="Win Rate" value={`${formatNumber(winRate, 1)}%`} color="text-green-500" icon={Scale} theme={theme} isDarkMode={isDarkMode} />
                    <StatBlock label="Profitable" value={trades.filter(t => t.pnlAmount > 0).length} color="text-green-500" icon={TrendingUp} theme={theme} isDarkMode={isDarkMode} />
                    <StatBlock label="Losses" value={trades.filter(t => t.pnlAmount < 0).length} color="text-red-500" icon={TrendingDown} theme={theme} isDarkMode={isDarkMode} />
                </div>
            </div>

            <div onClick={() => setCurrentScreen('RiskReward')} className={`${theme.card} p-5 rounded-2xl border ${theme.border} shadow-lg mb-6 flex items-center justify-between cursor-pointer active:scale-95 transition-all`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 rounded-xl">
                        <Calculator size={24} className="text-white" />
                    </div>
                    <div>
                        <h3 className={`text-base font-bold ${theme.text}`}>Risk Calculator</h3>
                        <p className="text-xs text-gray-500">Analyze position size</p>
                    </div>
                </div>
                <ChevronRight className="text-gray-600" />
            </div>

            <h3 className={`text-lg font-semibold ${theme.text} mb-3`}>Recent Trades</h3>
            <div className={`${theme.card} rounded-xl shadow-lg border ${theme.border} divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {recentTrades.length > 0 ? recentTrades.map(trade => (
                    <div key={trade.id} className="flex justify-between items-center p-4 hover:bg-gray-500/10">
                        <div className="flex flex-col"><span className={`text-sm font-semibold ${theme.text}`}>{trade.symbol}</span><span className={`text-xs ${theme.subText}`}>{trade.date}</span></div>
                        <span className={`text-sm font-bold ${trade.pnlAmount >= 0 ? 'text-green-500' : 'text-red-500'}`}>{trade.pnlAmount >= 0 ? '+' : ''}{getCurrencySymbol(trade.currency)}{formatNumber(trade.pnlAmount, 2)}</span>
                    </div>
                )) : <p className="p-4 text-center text-gray-500 text-sm italic">No recent trades found.</p>}
            </div>

        </div>
    );
};
