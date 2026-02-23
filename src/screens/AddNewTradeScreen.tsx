import React, { useState } from 'react';
import { Star, RefreshCw, Upload, TrendingUp, TrendingDown, Brain } from 'lucide-react';
import { InputField } from '../components/InputField';
import { AD_UNITS } from '../components/Ads';
import { analyzeTradeScreenshot } from '../utils/api';
import { fileToBase64 } from '../utils/helpers';
import { addDoc, collection, Firestore } from 'firebase/firestore';

interface AddNewTradeScreenProps {
    db: Firestore;
    appId: string;
    userId: string;
    theme: any;
    setCurrentScreen: (screen: string) => void;
    showInterstitial: (callback?: () => void) => void;
}

export const AddNewTradeScreen: React.FC<AddNewTradeScreenProps> = ({ db, appId, userId, theme, setCurrentScreen, showInterstitial }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [tradeData, setTradeData] = useState({
        symbol: '',
        date: new Date().toISOString().substring(0, 10),
        entryPrice: '',
        exitPrice: '',
        resultType: 'Profit',
        pnlAmountValue: '',
        tradeType: 'Long',
        currency: 'USD',
        tradeStyle: 'Scalping',
        marketConcept: 'Breakout',
        psychology: 'Disciplined',
        note: '',
        isFavorite: false
    });

    const strategies = ['Breakout', 'Trend', 'Reversal', 'Scalp', 'Mean Reversion', 'Range', 'Other'];
    const styles = ['Scalping', 'Day Trade', 'Swing', 'Position', 'Investment'];
    const psychologies = ['Disciplined', 'FOMO', 'Revenge', 'Boredom', 'Hesitant', 'Rushed', 'Flow State', 'Anxious'];
    const currencies = ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

    const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsAnalyzing(true);
        try {
            const base64 = await fileToBase64(file);
            const data = await analyzeTradeScreenshot(base64);

            setTradeData(prev => ({
                ...prev,
                symbol: data.symbol?.toUpperCase() || prev.symbol,
                date: data.date || prev.date,
                entryPrice: data.entryPrice?.toString() || prev.entryPrice,
                exitPrice: data.exitPrice?.toString() || prev.exitPrice,
                pnlAmountValue: data.pnlAmountValue?.toString() || prev.pnlAmountValue,
                tradeType: (data.tradeType === 'Short') ? 'Short' : 'Long',
                resultType: (data.resultType === 'Loss') ? 'Loss' : 'Profit',
                currency: currencies.includes(data.currency?.toUpperCase()) ? data.currency.toUpperCase() : prev.currency,
                note: data.note || prev.note
            }));
        } catch (err) {
            console.error("AI Analysis failed:", err);
            alert("AI Analysis failed. Please try again or enter data manually.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const saveTrade = async () => {
        const absoluteAmount = Math.abs(parseFloat(tradeData.pnlAmountValue) || 0);
        const pnl = tradeData.resultType === 'Profit' ? absoluteAmount : -absoluteAmount;

        await addDoc(collection(db, 'artifacts', appId, 'users', userId, 'trades'), {
            ...tradeData,
            entryPrice: parseFloat(tradeData.entryPrice) || 0,
            exitPrice: parseFloat(tradeData.exitPrice) || 0,
            pnlAmount: pnl,
            timestamp: Date.now()
        });

        setCurrentScreen('Dashboard');
    };

    return (
        <div className="max-w-md mx-auto p-4 pb-24">
            <div className={`${theme.card} p-5 rounded-2xl border shadow-xl`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-xl font-bold ${theme.text}`}>Log New Trade</h2>
                    <button onClick={() => setTradeData(prev => ({ ...prev, isFavorite: !prev.isFavorite }))} className="p-2 rounded-full hover:bg-gray-500/10 transition-colors">
                        <Star size={24} className={tradeData.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"} />
                    </button>
                </div>

                <label className={`group relative w-full py-4 mb-6 flex items-center justify-center rounded-2xl font-bold transition-all overflow-hidden cursor-pointer ${isAnalyzing ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                    {isAnalyzing ? <RefreshCw size={20} className="animate-spin mr-2" /> : <Upload size={20} className="mr-2" />}
                    {isAnalyzing ? 'Extracting Data...' : 'Analyze Screenshot'}
                    <input type="file" className="hidden" accept="image/*" onChange={handleScreenshotUpload} disabled={isAnalyzing} />
                </label>

                <div className="space-y-1">
                    <InputField label="Symbol" value={tradeData.symbol} onChange={(v) => setTradeData(prev => ({ ...prev, symbol: v.toUpperCase() }))} placeholder="e.g. BTCUSDT" theme={theme} />
                    <InputField label="Date" type="date" value={tradeData.date} onChange={(v) => setTradeData(prev => ({ ...prev, date: v }))} theme={theme} />
                    <div className="mb-4">
                        <label className={`block text-xs font-semibold uppercase tracking-wider ${theme.label} mb-1.5`}>Direction</label>
                        <div className="flex gap-2">
                            {['Long', 'Short'].map(dir => (
                                <button key={dir} type="button" onClick={() => setTradeData(prev => ({ ...prev, tradeType: dir }))} className={`flex-1 py-2.5 rounded-xl font-bold border transition-all flex items-center justify-center gap-2 ${tradeData.tradeType === dir ? (dir === 'Long' ? 'bg-green-600/20 border-green-500 text-green-500' : 'bg-red-600/20 border-red-500 text-red-500') : `${theme.input} opacity-60`}`}>{dir === 'Long' ? <TrendingUp size={16} /> : <TrendingDown size={16} />} {dir}</button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <InputField label="Entry Price" type="number" value={tradeData.entryPrice} onChange={(v) => setTradeData(prev => ({ ...prev, entryPrice: v }))} theme={theme} />
                        <InputField label="Exit Price" type="number" value={tradeData.exitPrice} onChange={(v) => setTradeData(prev => ({ ...prev, exitPrice: v }))} theme={theme} />
                    </div>
                    <div className={`p-4 rounded-2xl border ${theme.card} mb-4`}>
                        <div className="flex gap-2 mb-3">
                            {['Profit', 'Loss'].map(res => (
                                <button key={res} type="button" onClick={() => setTradeData(prev => ({ ...prev, resultType: res }))} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${tradeData.resultType === res ? (res === 'Profit' ? 'bg-green-600 text-white shadow-lg' : 'bg-red-600 text-white shadow-lg') : theme.input}`}>{res}</button>
                            ))}
                        </div>
                        <InputField label={`Amount (${tradeData.currency})`} type="number" value={tradeData.pnlAmountValue} onChange={(v) => setTradeData(prev => ({ ...prev, pnlAmountValue: v }))} theme={theme} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="mb-4">
                            <label className={`block text-xs font-semibold uppercase tracking-wider ${theme.label} mb-1.5`}>Strategy</label>
                            <select value={tradeData.marketConcept} onChange={(e) => setTradeData(prev => ({ ...prev, marketConcept: e.target.value }))} className={`w-full p-3 rounded-xl border outline-none ${theme.input}`}>
                                {strategies.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className={`block text-xs font-semibold uppercase tracking-wider ${theme.label} mb-1.5`}>Style</label>
                            <select value={tradeData.tradeStyle} onChange={(e) => setTradeData(prev => ({ ...prev, tradeStyle: e.target.value }))} className={`w-full p-3 rounded-xl border outline-none ${theme.input}`}>
                                {styles.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className={`block text-xs font-semibold uppercase tracking-wider ${theme.label} mb-2 flex items-center`}>Mental State <Brain size={14} className="ml-1.5" /></label>
                        <div className="flex flex-wrap gap-2">
                            {psychologies.map(p => (
                                <button key={p} type="button" onClick={() => setTradeData(prev => ({ ...prev, psychology: p }))} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${tradeData.psychology === p ? 'bg-purple-600 border-purple-600 text-white' : `${theme.input} hover:bg-gray-600`}`}>{p}</button>
                            ))}
                        </div>
                    </div>
                    <InputField label="Journal Note" value={tradeData.note} onChange={(v) => setTradeData(prev => ({ ...prev, note: v }))} placeholder="Lessons learned from this trade..." theme={theme} />
                </div>
                <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setCurrentScreen('Dashboard')} className={`flex-1 py-4 font-bold rounded-2xl border transition-all ${theme.input}`}>Cancel</button>
                    <button type="button" onClick={saveTrade} className="flex-[2] py-4 bg-green-600 text-white font-bold rounded-2xl shadow-xl hover:bg-green-700 active:scale-95 transition-all">Commit Trade</button>
                </div>
            </div>

            {/* AI Analysis Loading Overlay */}
            {isAnalyzing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="text-center p-8 rounded-3xl bg-gray-800 border border-gray-700 shadow-2xl scale-110">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <div className="absolute inset-0 border-4 border-green-500/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-green-500 rounded-full animate-spin"></div>
                            <Brain className="absolute inset-0 m-auto text-green-500 animate-pulse" size={32} />
                        </div>
                        <h3 className="text-xl font-black text-white mb-2">Extracting Trade Data</h3>
                        <p className="text-gray-400 text-sm">AI is reading your screenshot...</p>
                        <div className="mt-4 flex gap-1 justify-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};
