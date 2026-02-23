import React, { useState } from 'react';
import { Star, BarChart, Trash2 } from 'lucide-react';
import { Trade } from '../types';
import { AD_UNITS } from '../components/Ads';
import { getCurrencySymbol, formatNumber } from '../utils/helpers';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { TradeDetailsModal } from '../components/TradeDetailsModal';
import { deleteDoc, doc, Firestore } from 'firebase/firestore';
import { updateDoc } from 'firebase/firestore';

interface TradeListScreenProps {
    db: Firestore;
    appId: string;
    userId: string;
    trades: Trade[];
    theme: any;
    isDarkMode: boolean;
}

export const TradeListScreen: React.FC<TradeListScreenProps> = ({ db, appId, userId, trades, theme, isDarkMode }) => {
    const [tradeToDelete, setTradeToDelete] = useState<Trade | null>(null);
    const [selectedTradeForDetail, setSelectedTradeForDetail] = useState<Trade | null>(null);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const handleTradeDelete = async () => {
        if (!tradeToDelete || !tradeToDelete.id) return;
        await deleteDoc(doc(db, 'artifacts', appId, 'users', userId, 'trades', tradeToDelete.id));
        setTradeToDelete(null);
    };

    const toggleFavorite = async (trade: Trade) => {
        if (!trade.id) return;
        const tradeRef = doc(db, 'artifacts', appId, 'users', userId, 'trades', trade.id);
        await updateDoc(tradeRef, { isFavorite: !trade.isFavorite });
    };

    const filteredTrades = showFavoritesOnly ? trades.filter(t => t.isFavorite) : trades;

    return (
        <div className="px-4 pb-24 pt-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className={`text-xl font-bold ${theme.text}`}>Your Trades</h2>
                <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all font-medium text-xs ${showFavoritesOnly ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : `${theme.input} opacity-80`}`}>
                    <Star size={14} fill={showFavoritesOnly ? "currentColor" : "none"} />
                    {showFavoritesOnly ? "Show All" : "Favorites Only"}
                </button>
            </div>

            <div className={`${theme.card} rounded-2xl border ${theme.border} overflow-hidden shadow-xl mb-4`}>
                {filteredTrades.length > 0 ? filteredTrades.map((trade, index) => {
                    const pnl = parseFloat(trade.pnlAmount as any) || 0;
                    const isProfit = pnl >= 0;
                    return (
                        <React.Fragment key={trade.id || index}>

                            <div className={`flex justify-between items-center p-4 border-b ${theme.border} hover:bg-gray-500/5 transition-colors`}>
                                <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => setSelectedTradeForDetail(trade)}>
                                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(trade); }} className="transition-transform active:scale-125">
                                        <Star size={18} className={trade.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-500/40"} />
                                    </button>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white uppercase">{trade.symbol}</span>
                                        <span className="text-xs text-gray-400">{trade.date}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className={`font-bold ${isProfit ? 'text-green-500' : 'text-red-400'}`}>
                                        {isProfit ? '+' : ''}{getCurrencySymbol(trade.currency)}{formatNumber(pnl, 2)}
                                    </span>
                                    <button onClick={() => setTradeToDelete(trade)} className="p-1 hover:bg-red-500/10 rounded">
                                        <Trash2 size={16} className="text-red-400 opacity-60 hover:opacity-100 transition-opacity" />
                                    </button>
                                </div>
                            </div>
                        </React.Fragment>
                    )
                }) : (
                    <div className="p-10 text-center flex flex-col items-center">
                        <BarChart size={40} className="text-gray-600 mb-2 opacity-20" />
                        <p className="text-gray-500 font-medium">No trades found</p>
                    </div>
                )}
            </div>
            <ConfirmationModal isOpen={!!tradeToDelete} onClose={() => setTradeToDelete(null)} onConfirm={handleTradeDelete} title="Delete Trade" message="Permanently delete this trade?" isDarkMode={isDarkMode} />
            <TradeDetailsModal trade={selectedTradeForDetail} onClose={() => setSelectedTradeForDetail(null)} theme={theme} isDarkMode={isDarkMode} />
        </div>
    );
};
