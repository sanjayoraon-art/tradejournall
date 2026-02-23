import { Trade } from '../types';

export const calculateMaxDrawdown = (trades: Trade[], initialBalance: number = 10000): { amount: number; percentage: number } => {
    if (trades.length === 0) return { amount: 0, percentage: 0 };

    // Sort by date ascending
    const sorted = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let peak = initialBalance;
    let current = initialBalance;
    let maxDrawdown = 0;

    // We strictly look at closed trade P&L stream
    sorted.forEach(t => {
        current += t.pnl;
        if (current > peak) {
            peak = current;
        }
        const drawdown = peak - current;
        if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown;
        }
    });

    const percentage = peak > 0 ? (maxDrawdown / peak) * 100 : 0;
    return { amount: maxDrawdown, percentage };
};

export const calculateProfitFactor = (trades: Trade[]): number => {
    const grossProfit = trades.reduce((sum, t) => (t.pnl > 0 ? sum + t.pnl : sum), 0);
    const grossLoss = Math.abs(trades.reduce((sum, t) => (t.pnl < 0 ? sum + t.pnl : sum), 0));

    if (grossLoss === 0) return grossProfit > 0 ? 100 : 0; // Infinite or zero
    return grossProfit / grossLoss;
};

export const calculateExpectancy = (trades: Trade[]): number => {
    if (trades.length === 0) return 0;
    const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
    return totalPnl / trades.length;
};

export const calculateAverageRR = (trades: Trade[]): number => {
    const winners = trades.filter(t => t.pnl > 0);
    const losers = trades.filter(t => t.pnl < 0);

    if (winners.length === 0 || losers.length === 0) return 0;

    const avgWin = winners.reduce((sum, t) => sum + t.pnl, 0) / winners.length;
    const avgLoss = Math.abs(losers.reduce((sum, t) => sum + t.pnl, 0) / losers.length);

    if (avgLoss === 0) return 0;
    return avgWin / avgLoss;
};

export const getTopAndBottomTrades = (trades: Trade[]): { top: Trade[], bottom: Trade[] } => {
    const sortedByPnl = [...trades].sort((a, b) => b.pnl - a.pnl);
    const top = sortedByPnl.slice(0, 5);
    const bottom = sortedByPnl.slice(-5).reverse(); // Worst trades (most negative at start of array)
    // Actually slice(-5) gives [-5, -4, -3, -2, -1] which are the 5 smallest/most negative.
    // If sorted desc: [100, 50, ..., -50, -100]
    // Top is 100, 50.
    // Bottom slice(-5) is [-10, -20, -100]. Reversed makes it [-100, -20, -10]. 
    // We want "Worst" first usually.
    return { top, bottom: sortedByPnl.slice(-5).reverse() }; // Returns best winners and worst losers
};
