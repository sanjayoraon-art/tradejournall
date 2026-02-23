import React, { useState } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { InputField } from '../components/InputField';
import { AD_UNITS } from '../components/Ads';
import { formatNumber } from '../utils/helpers';
import { Info as InfoIcon } from 'lucide-react';

interface RiskRewardCalculatorScreenProps {
    theme: any;
    isDarkMode: boolean;
    primaryCurrencySymbol: string;
}

export const RiskRewardCalculatorScreen: React.FC<RiskRewardCalculatorScreenProps> = ({ theme, isDarkMode, primaryCurrencySymbol }) => {
    const [calc, setCalc] = useState({
        entry: '',
        stopLoss: '',
        target: '',
        riskAmount: '',
        accountBalance: ''
    });

    const resetCalc = () => setCalc({
        entry: '',
        stopLoss: '',
        target: '',
        riskAmount: '',
        accountBalance: ''
    });

    const entry = parseFloat(calc.entry) || 0;
    const sl = parseFloat(calc.stopLoss) || 0;
    const target = parseFloat(calc.target) || 0;
    const riskAmt = parseFloat(calc.riskAmount) || 0;
    const balance = parseFloat(calc.accountBalance) || 0;

    const riskVal = Math.abs(entry - sl);
    const rewardVal = Math.abs(target - entry);
    // Avoid division by zero
    const rr = riskVal > 0 ? (rewardVal / riskVal).toFixed(2) : '0';

    const positionSize = (riskAmt > 0 && riskVal > 0) ? (riskAmt / riskVal) : 0;
    const notionalValue = positionSize * entry;

    const potentialProfit = positionSize * rewardVal;
    const accountRiskPercent = balance > 0 ? (riskAmt / balance) * 100 : 0;

    const barTotal = riskVal + rewardVal;
    const riskWidth = barTotal > 0 ? (riskVal / barTotal) * 100 : 50;
    const rewardWidth = barTotal > 0 ? (rewardVal / barTotal) * 100 : 50;

    return (
        <div className="px-4 pb-24 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-600 rounded-2xl shadow-lg shadow-green-500/20">
                        <Calculator size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className={`text-2xl font-black ${theme.text}`}>Calculator</h2>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Risk Management</p>
                    </div>
                </div>
                <button
                    onClick={resetCalc}
                    className={`p-3 rounded-2xl border ${theme.border} ${theme.card} active:scale-90 transition-all text-gray-400`}
                    title="Reset Calculator"
                >
                    <RotateCcw size={20} />
                </button>
            </div>

            <div className={`${theme.card} p-5 rounded-3xl border ${theme.border} shadow-xl mb-6`}>
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <InputField label="Account Balance" value={calc.accountBalance} onChange={(v) => setCalc({ ...calc, accountBalance: v })} placeholder="1000" theme={theme} type="number" />
                    </div>
                    <InputField label="Entry Price" value={calc.entry} onChange={(v) => setCalc({ ...calc, entry: v })} placeholder="0.00" theme={theme} type="number" />
                    <InputField label="Risk per Trade" value={calc.riskAmount} onChange={(v) => setCalc({ ...calc, riskAmount: v })} placeholder="50" theme={theme} type="number" />
                    <InputField label="Stop Loss" value={calc.stopLoss} onChange={(v) => setCalc({ ...calc, stopLoss: v })} placeholder="0.00" theme={theme} type="number" />
                    <InputField label="Take Profit" value={calc.target} onChange={(v) => setCalc({ ...calc, target: v })} placeholder="0.00" theme={theme} type="number" />
                </div>
            </div>

            {riskVal > 0 && rewardVal > 0 ? (
                <div className="space-y-4">
                    <div className={`${theme.card} p-5 rounded-3xl border ${theme.border} shadow-lg overflow-hidden relative`}>
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Risk:Reward</span>
                                <span className={`text-3xl font-black ${parseFloat(rr) >= 2 ? 'text-green-500' : 'text-yellow-500'}`}>1 : {rr}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Profit Potential</span>
                                <span className="text-2xl font-black text-green-500">+{primaryCurrencySymbol}{formatNumber(potentialProfit, 2)}</span>
                            </div>
                        </div>
                        <div className="w-full h-4 bg-gray-700/30 rounded-full overflow-hidden flex mb-3">
                            <div style={{ width: `${riskWidth}%` }} className="bg-red-500 h-full transition-all duration-700 flex items-center justify-center overflow-hidden">
                                {riskWidth > 15 && <span className="text-[8px] font-black text-white/50">RISK</span>}
                            </div>
                            <div style={{ width: `${rewardWidth}%` }} className="bg-green-500 h-full transition-all duration-700 flex items-center justify-center overflow-hidden">
                                {rewardWidth > 15 && <span className="text-[8px] font-black text-white/50">REWARD</span>}
                            </div>
                        </div>
                        <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase">
                            <span>Risk: {primaryCurrencySymbol}{formatNumber(riskAmt, 2)} ({riskWidth.toFixed(1)}%)</span>
                            <span>Reward: {primaryCurrencySymbol}{formatNumber(potentialProfit, 2)} ({rewardWidth.toFixed(1)}%)</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className={`${theme.card} p-5 rounded-2xl border ${theme.border} shadow-md flex flex-col justify-center min-h-[100px]`}>
                            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Position Units</p>
                            <p className={`text-xl font-black ${theme.text}`}>{formatNumber(positionSize, 4)}</p>
                            <p className="text-[10px] text-blue-400 font-bold mt-1">Value: {primaryCurrencySymbol}{formatNumber(notionalValue, 2)}</p>
                        </div>
                        <div className={`${theme.card} p-5 rounded-2xl border ${theme.border} shadow-md flex flex-col justify-center min-h-[100px]`}>
                            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Account Risk</p>
                            <p className={`text-xl font-black ${accountRiskPercent > 3 ? 'text-red-500' : 'text-green-500'}`}>{accountRiskPercent.toFixed(2)}%</p>
                            <p className="text-[10px] text-gray-400 font-bold mt-1">per trade</p>
                        </div>
                        <div className={`${theme.card} p-5 rounded-2xl border ${theme.border} shadow-md flex flex-col justify-center min-h-[100px]`}>
                            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Stop Loss Distance</p>
                            <p className={`text-xl font-black text-red-500`}>{((riskVal / entry) * 100).toFixed(2)}%</p>
                            <p className="text-[10px] text-gray-400 font-bold mt-1">-{primaryCurrencySymbol}{formatNumber(riskVal, 2)}</p>
                        </div>
                        <div className={`${theme.card} p-5 rounded-2xl border ${theme.border} shadow-md flex flex-col justify-center min-h-[100px]`}>
                            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Target Distance</p>
                            <p className={`text-xl font-black text-green-500`}>{((rewardVal / entry) * 100).toFixed(2)}%</p>
                            <p className="text-[10px] text-gray-400 font-bold mt-1">+{primaryCurrencySymbol}{formatNumber(rewardVal, 2)}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={`${theme.card} p-12 rounded-3xl border border-dashed ${theme.border} flex flex-col items-center justify-center text-center opacity-70`}>
                    <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                        <InfoIcon size={32} className="text-green-500" />
                    </div>
                    <p className="text-base font-bold text-white mb-1">Missing Inputs</p>
                    <p className="text-xs text-gray-500 max-w-[200px]">Fill Entry, Stop Loss, and Target to generate risk analysis.</p>
                </div>
            )}

        </div>
    );
};
