import React from 'react';
import { X, Target, Zap, Brain, FileText } from 'lucide-react';
import { Trade } from '../types';
import { getCurrencySymbol, formatNumber } from '../utils/helpers';

interface TradeDetailsModalProps {
    trade: Trade | null;
    onClose: () => void;
    theme: any;
    isDarkMode: boolean;
}

export const TradeDetailsModal: React.FC<TradeDetailsModalProps> = ({ trade, onClose, theme, isDarkMode }) => {
    if (!trade) return null;
    const pnl = parseFloat(trade.pnlAmount as any) || 0;
    const isProfit = pnl >= 0;

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-sm p-4">
            <div className={`flex justify-between items-center mb-4 ${theme.text}`}>
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isProfit ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    Trade Details
                </h2>
                <button onClick={onClose} className="p-2 rounded-full bg-gray-700 text-white"><X size={20} /></button>
            </div>

            <div className={`flex-1 overflow-y-auto ${theme.card} rounded-3xl border ${theme.border} p-6 shadow-2xl`}>
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white">{trade.symbol}</h1>
                        <p className="text-gray-400 font-medium">{trade.date}</p>
                    </div>
                    <div className="text-right">
                        <p className={`text-2xl font-black ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                            {isProfit ? '+' : ''}{getCurrencySymbol(trade.currency)}{formatNumber(pnl, 2)}
                        </p>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${trade.tradeType === 'Long' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                            {trade.tradeType}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-700/30 p-4 rounded-2xl border border-gray-600/50">
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Entry Price</p>
                        <p className="text-lg font-bold text-white">{formatNumber(trade.entryPrice, 4)}</p>
                    </div>
                    <div className="bg-gray-700/30 p-4 rounded-2xl border border-gray-600/50">
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Exit Price</p>
                        <p className="text-lg font-bold text-white">{formatNumber(trade.exitPrice, 4)}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border-b border-gray-700">
                        <span className="text-gray-400 text-sm flex items-center gap-2"><Target size={14} /> Strategy</span>
                        <span className="text-white font-bold">{trade.marketConcept}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border-b border-gray-700">
                        <span className="text-gray-400 text-sm flex items-center gap-2"><Zap size={14} /> Style</span>
                        <span className="text-white font-bold">{trade.tradeStyle}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border-b border-gray-700">
                        <span className="text-gray-400 text-sm flex items-center gap-2"><Brain size={14} /> Psychology</span>
                        <span className="text-white font-bold">{trade.psychology}</span>
                    </div>
                </div>

                {trade.note && (
                    <div className="mt-8">
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-3 flex items-center gap-2">
                            <FileText size={12} /> Journal Note
                        </p>
                        <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-700 text-sm text-gray-300 leading-relaxed italic">
                            "{trade.note}"
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={onClose}
                className="mt-6 w-full py-4 bg-green-600 text-white font-black rounded-2xl shadow-xl shadow-green-500/20 active:scale-95 transition-all"
            >
                CLOSE VIEW
            </button>
        </div>
    );
};
