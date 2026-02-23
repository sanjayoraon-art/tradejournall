
import React from 'react';
import { BarChart, Target, TrendingDown, DollarSign, Scale, LucideIcon, TrendingUp, Activity, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { formatNumber } from '../utils/helpers';
import { Trade } from '../types';

interface StatCardProps {
    title: string;
    value: number;
    units?: string;
    valueDecimals?: number;
    comparison?: string;
    prefix?: string;
    isDarkMode: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, units = '', valueDecimals = 0, comparison = '', prefix = '', isDarkMode }) => {
    const theme = isDarkMode ? { text: 'text-gray-100', subText: 'text-gray-400', card: 'bg-[#1e2230]', border: 'border-gray-700/50' } : { text: 'text-gray-900', subText: 'text-gray-500', card: 'bg-white', border: 'border-gray-200' };
    const numericValue = typeof value === 'number' ? value : 0;

    const isPnlField = title.toLowerCase().includes('expectancy');
    const displayValue = title.includes('Max Drawdown') ? formatNumber(numericValue, valueDecimals) : formatNumber(Math.abs(numericValue), valueDecimals);
    const sign = title.includes('Max Drawdown') && numericValue < 0 ? '-' : (title.includes('Max Drawdown') ? '' : (numericValue >= 0 ? '+' : '-'));

    const pnlColor = isPnlField ? (numericValue >= 0 ? 'text-green-500' : 'text-red-500') : theme.text;

    let Icon: LucideIcon = BarChart;
    if (title.includes('Sharpe')) Icon = Target;
    else if (title.includes('Drawdown')) Icon = TrendingDown;
    else if (title.includes('Expectancy')) Icon = DollarSign;
    else if (title.includes('Risk-Reward')) Icon = Scale;

    return (
        <div className={`${theme.card} p-4 rounded-xl shadow-lg border ${theme.border} min-h-[120px] flex flex-col justify-between transition-colors duration-300`}>
            <div className='flex items-center justify-between mb-2'>
                <p className={`text-xs font-medium ${theme.subText} uppercase truncate`}>{title}</p>
                <Icon size={16} className={theme.subText} />
            </div>
            <div>
                <span className={`text-2xl font-bold ${pnlColor}`}>{prefix}{sign}{displayValue}{units}</span>
                {comparison && <p className={`text-xs mt-1 ${theme.subText}`}>{comparison}</p>}
            </div>
        </div>
    );
};

interface AdvancedStatCardProps {
    title: string;
    value: string;
    subValue?: string;
    icon: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    isDarkMode: boolean;
    colorClass?: string;
}

export const AdvancedStatCard: React.FC<AdvancedStatCardProps> = ({ title, value, subValue, icon, trend, isDarkMode, colorClass = 'text-blue-500' }) => {
    const theme = isDarkMode ? { bg: 'bg-[#1e2230]', text: 'text-gray-100', sub: 'text-gray-400', border: 'border-white/5' } : { bg: 'bg-white', text: 'text-gray-900', sub: 'text-gray-500', border: 'border-gray-100' };

    return (
        <div className={`${theme.bg} p-5 rounded-2xl border ${theme.border} shadow-lg relative overflow-hidden group hover:border-gray-600/30 transition-all duration-300`}>
            <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-xl bg-opacity-10 ${colorClass.replace('text-', 'bg-')}`}>
                    <div className={`${colorClass}`}>{icon}</div>
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'text-green-500 bg-green-500/10' : trend === 'down' ? 'text-red-500 bg-red-500/10' : 'text-gray-500 bg-gray-500/10'}`}>
                        {trend === 'up' ? <TrendingUp size={12} /> : trend === 'down' ? <TrendingDown size={12} /> : <Activity size={12} />}
                    </div>
                )}
            </div>

            <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider ${theme.sub} mb-1`}>{title}</h3>
                <div className={`text-2xl font-black ${theme.text} tracking-tight`}>{value}</div>
                {subValue && <div className={`text-xs font-medium mt-1 ${theme.sub}`}>{subValue}</div>}
            </div>

            {/* Decoration */}
            <div className={`absolute -right-6 -bottom-6 opacity-5 rotate-12 scale-150 pointer-events-none ${colorClass}`}>
                {icon}
            </div>
        </div>
    );
};

interface TopTradesWidgetProps {
    trades: Trade[];
    title: string;
    type: 'winners' | 'losers';
    currencySymbol: string;
    isDarkMode: boolean;
}

export const TopTradesWidget: React.FC<TopTradesWidgetProps> = ({ trades, title, type, currencySymbol, isDarkMode }) => {
    const theme = isDarkMode ? { bg: 'bg-[#1e2230]', text: 'text-gray-100', sub: 'text-gray-400', border: 'border-gray-700/50' } : { bg: 'bg-white', text: 'text-gray-900', sub: 'text-gray-500', border: 'border-gray-200' };
    const isWin = type === 'winners';

    return (
        <div className={`${theme.bg} p-5 rounded-2xl border ${theme.border} shadow-lg h-full`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${isWin ? 'text-green-500' : 'text-red-500'}`}>
                {isWin ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                {title}
            </h3>

            <div className="space-y-3">
                {trades.length === 0 ? (
                    <div className={`text-center py-6 text-sm ${theme.sub}`}>No trades recorded.</div>
                ) : (
                    trades.map((t, i) => (
                        <div key={t.id} className={`flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-gray-700/30 transition-all ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-100'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${isWin ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                    {i + 1}
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-sm font-bold ${theme.text}`}>{t.symbol}</span>
                                    <span className={`text-[10px] ${theme.sub}`}>{new Date(t.date).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className={`text-sm font-mono font-bold ${t.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {t.pnl >= 0 ? '+' : ''}{currencySymbol}{formatNumber(t.pnl, 2)}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

interface StatBlockProps {
    label: string;
    value: string | number;
    color: string;
    icon: LucideIcon;
    theme: any;
    isDarkMode: boolean;
}

export const StatBlock: React.FC<StatBlockProps> = ({ label, value, color, icon: Icon, theme, isDarkMode }) => (
    <div className={`flex flex-col items-start p-3 rounded-lg flex-1 min-w-0 ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100 border'}`}>
        <Icon size={18} className={`mb-1 ${color}`} />
        <span className={`text-xs font-medium uppercase truncate ${theme.subText}`}>{label}</span>
        <span className={`text-lg font-bold ${color}`}>{value}</span>
    </div>
);
