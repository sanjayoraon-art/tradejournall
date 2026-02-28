import React, { useState, useEffect, useMemo } from 'react';
import { Home, TrendingUp, Calculator, BarChart3, User, Plus, X, Star, Trash2, Upload, Brain, ChevronDown, MessageSquare, ShieldCheck, Bell } from 'lucide-react';
import { AiChatScreen } from './screens/AiChatScreen';
import { LandingScreen } from './screens/LandingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RiskRewardCalculatorScreen } from './screens/RiskRewardCalculatorScreen';
import { PerformanceMetricsScreen } from './screens/PerformanceMetricsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { AdminScreen } from './screens/AdminScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { InformationScreen } from './screens/InformationScreen';
import { exponentialBackoffFetch, API_URL, analyzeTradeScreenshot } from './utils/api';
import { db, auth, appId } from './utils/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, collection, onSnapshot, getDocs, query, orderBy, limit, increment, getDoc, addDoc, serverTimestamp, deleteDoc, updateDoc } from 'firebase/firestore';
import { CandlestickChart, SimpleBarChart, PerformanceHeatmap, MonthlyPerformanceWidget } from './components/Charts';
import { isAdmin } from './utils/admin';

interface Trade {
    id: string;
    symbol: string;
    date: string;
    entryPrice: number;
    exitPrice: number;
    pnl: number;
    type: 'Long' | 'Short';
    strategy: string;
    style?: string;
    mentalState?: string;
    note?: string;
    isFavorite?: boolean;
    screenshot?: string;
}

const App = () => {
    const [currentScreen, setCurrentScreen] = useState(() => localStorage.getItem('currentScreen') || 'dashboard');

    useEffect(() => {
        localStorage.setItem('currentScreen', currentScreen);
    }, [currentScreen]);
    const [statsTimeframe, setStatsTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearly' | 'all'>(() => (localStorage.getItem('statsTimeframe') as any) || 'monthly');
    useEffect(() => {
        localStorage.setItem('statsTimeframe', statsTimeframe);
    }, [statsTimeframe]);
    const [statsStrategy, setStatsStrategy] = useState<string>('All');
    const [globalCurrency, setGlobalCurrency] = useState('$');
    const [initialBalance, setInitialBalance] = useState<number>(10000);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [showAddTrade, setShowAddTrade] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState<{ role: string; text: string }[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
    const [user, setUser] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [products, setProducts] = useState<any[]>([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [pendingTrade, setPendingTrade] = useState<Trade | null>(null);
    const [showLanding, setShowLanding] = useState(true);
    const [infoPage, setInfoPage] = useState<'about' | 'privacy' | 'terms' | 'contact' | null>(null);
    const chatEndRef = React.useRef<HTMLDivElement>(null);
    // Analytics Tracking
    useEffect(() => {
        if (!db) return;
        const trackPageView = async () => {
            try {
                const analyticsRef = doc(db!, 'artifacts', appId, 'analytics', currentScreen);
                await setDoc(analyticsRef, { count: increment(1) }, { merge: true });
            } catch (e) { console.error("Analytics Error", e); }
        };
        trackPageView();
    }, [currentScreen]);

    // Firebase Auth and Sync
    useEffect(() => {
        if (!auth || !db) return;

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);

            if (currentUser) {
                // Listen to trades from Firestore
                const tradesRef = collection(db!, 'artifacts', appId, 'users', currentUser.uid, 'trades');
                const unsubTrades = onSnapshot(tradesRef, (snapshot) => {
                    const firestoreTrades = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Trade));
                    // Sort by Date Descending, then by Creation Time (ID) Descending
                    const sortedTrades = firestoreTrades.sort((a, b) => {
                        const tA = new Date(a.date || "").getTime() || 0;
                        const tB = new Date(b.date || "").getTime() || 0;
                        if (tA !== tB) return tA - tB;
                        return (a.id || "").localeCompare(b.id || "");
                    });
                    setTrades(sortedTrades);
                });

                // Listen for Products in Real-time (Robust - No Index)
                const productsQuery = collection(db!, 'artifacts', appId, 'products');
                const unsubProducts = onSnapshot(productsQuery,
                    (snapshot) => {
                        const productData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        // Sort client-side: Click Count (DESC) then Timestamp (DESC)
                        productData.sort((a: any, b: any) => {
                            const clickDiff = (b.clickCount || 0) - (a.clickCount || 0);
                            if (clickDiff !== 0) return clickDiff;

                            const tA = a.timestamp?.toMillis ? a.timestamp.toMillis() : (a.timestamp || Date.now());
                            const tB = b.timestamp?.toMillis ? b.timestamp.toMillis() : (b.timestamp || Date.now());
                            return tB - tA;
                        });
                        setProducts(productData);
                    },
                    (error) => {
                    }
                );


                // Initialize User Profile (Ensure "Sign Up" defaults exist)
                const userDocRef = doc(db!, 'artifacts', appId, 'users', currentUser.uid);
                getDoc(userDocRef).then((docSnap) => {
                    if (!docSnap.exists()) {
                        // New User -> Create Profile with Defaults
                        setDoc(userDocRef, {
                            email: currentUser.email,
                            displayName: currentUser.displayName,
                            photoURL: currentUser.photoURL,
                            createdAt: Date.now(),
                            initialBalance: 10000,
                            currency: 'USD'
                        }, { merge: true });
                    } else {
                        // Existing User -> Load Settings
                        const data = docSnap.data();
                        if (data.initialBalance) setInitialBalance(data.initialBalance);
                    }
                });

                // Listen for Notifications
                const msgsQuery = query(collection(db!, 'artifacts', appId, 'messages'), orderBy('timestamp', 'desc'), limit(1));
                const unsubMsgs = onSnapshot(msgsQuery, (snap) => {
                    const lastMsg = snap.docs[0];
                    if (lastMsg) {
                        const lastRead = localStorage.getItem('lastReadMessageId');
                        if (lastRead !== lastMsg.id) {
                            setUnreadNotifications(1); // Simple badge logic (showing dot if newest is unread)
                        }
                    }
                });

                return () => { unsubTrades(); unsubMsgs(); unsubProducts(); };
            } else {
                setTrades([]); // Clear trades on logout
            }
        });
        return () => unsubscribe();
    }, []);


    const handleAiAsk = async () => {
        if (!chatInput.trim()) return;
        const userMsg = chatInput;
        setChatInput('');
        setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsThinking(true);

        try {
            const historyContext = trades.length > 0
                ? `Here is my recent trade history: ${JSON.stringify([...trades].reverse().slice(0, 10))}. `
                : "I don't have any trades logged yet. ";

            const payload = {
                contents: [{
                    role: "user",
                    parts: [{
                        text: `${historyContext} 
                        
                        Context: You are a professional trading coach.
                        Available Affiliate Tools: ${JSON.stringify(products.map(p => ({ name: p.name, desc: p.description, link: p.link })))}
                        
                        Instruction: 
                        1. Provide a direct and helpful answer to the user's question first.
                        2. Analyze if any of the "Available Affiliate Tools" is directly relevant to solving the user's problem or topic.
                        3. ONLY if a tool is relevant, suggest it naturally at the end of your answer. 
                        4. If no tool is relevant, do NOT suggest any products.
                        5. Mention the product name clearly, but do not show the link yourself.

                        Question: ${userMsg}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 1000,
                }
            };

            const result = await exponentialBackoffFetch(API_URL(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const aiResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that request.";
            setChatMessages(prev => [...prev, { role: 'assistant', text: aiResponse }]);

            // Log interaction to Firestore for Admin
            if (db && user) {
                try {
                    addDoc(collection(db, 'artifacts', appId, 'ai_logs'), {
                        userId: user.uid,
                        userEmail: user.email,
                        question: userMsg,
                        response: aiResponse,
                        timestamp: serverTimestamp()
                    });
                } catch (err) {
                    console.error("Failed to log AI chat:", err);
                }
            }
        } catch (error) {
            console.error(error);
            setChatMessages(prev => [...prev, { role: 'assistant', text: "Error: Could not connect to the AI Coach. Please check your API key and connection." }]);
        } finally {
            setIsThinking(false);
        }
    };

    const trackProductClick = async (productId: string) => {
        if (!db || !productId) return;
        try {
            const productRef = doc(db, 'artifacts', appId, 'products', productId);
            await updateDoc(productRef, {
                clickCount: increment(1)
            });
            console.log(`[DEBUG] Tracked click for product: ${productId}`);
        } catch (error) {
            console.error('[ERROR] Failed to track product click:', error);
        }
    };

    const clearChat = () => {
        setChatMessages([]);
    };

    // Load trades from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('trades');
        if (saved && saved !== '[]') {
            try {
                setTrades(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse cached trades", e);
                setTrades([]);
            }
        } else {
            setTrades([]);
        }

        const savedBalance = localStorage.getItem('initialBalance');
        if (savedBalance) {
            setInitialBalance(parseFloat(savedBalance));
        }
    }, []);

    // Load products from localStorage
    useEffect(() => {
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
            try {
                setProducts(JSON.parse(savedProducts));
            } catch (e) {
                console.error("Failed to parse cached products", e);
            }
        }
    }, []);

    // Save products to localStorage
    useEffect(() => {
        if (products.length > 0) {
            localStorage.setItem('products', JSON.stringify(products));
        }
    }, [products]);

    // Save trades to localStorage
    useEffect(() => {
        localStorage.setItem('trades', JSON.stringify(trades));
    }, [trades]);

    useEffect(() => {
        localStorage.setItem('initialBalance', initialBalance.toString());
    }, [initialBalance]);

    // Calculate stats
    const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
    const winningTrades = trades.filter(t => t.pnl > 0).length;
    const winRate = trades.length > 0 ? (winningTrades / trades.length * 100).toFixed(1) : '0';
    const grossProfit = trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0);
    const grossLoss = Math.abs(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0));



    const addTrade = async (trade: Omit<Trade, 'id'>) => {
        const id = Date.now().toString();
        const newTrade = { ...trade, id };

        // Optimistic Update
        const updatedTrades = [...trades, newTrade].sort((a, b) => {
            const tA = new Date(a.date || "").getTime() || 0;
            const tB = new Date(b.date || "").getTime() || 0;
            if (tA !== tB) return tA - tB;
            return (a.id || "").localeCompare(b.id || "");
        });
        setTrades(updatedTrades);
        setShowAddTrade(false);

        // Firestore Update
        if (user && db) {
            try {
                const tradeRef = doc(db, 'artifacts', appId, 'users', user.uid, 'trades', id);
                await setDoc(tradeRef, newTrade);
            } catch (err) {
                console.error("Failed to save trade to Firestore:", err);
            }
        }
    };

    const deleteTrade = async (id: string) => {
        // Optimistic Update
        setTrades(trades.filter(t => t.id !== id));

        // Firestore Update
        if (user && db) {
            try {
                const tradeRef = doc(db, 'artifacts', appId, 'users', user.uid, 'trades', id);
                await deleteDoc(tradeRef);
            } catch (err) {
                console.error("Failed to delete trade from Firestore:", err);
                // Rollback or alert could be added here
            }
        }
    };

    const toggleFavorite = (id: string) => {
        setTrades(trades.map(t => t.id === id ? { ...t, isFavorite: !t.isFavorite } : t));
    };

    // Performance Stats Calculation
    const calculatePerformanceStats = () => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        const filteredTrades = trades.filter(t => {
            const tradeDate = new Date(t.date);
            // Fix timezone offset for date comparison if needed, but treating strings as local date usually works for simple equality
            // Since t.date is YYYY-MM-DD string, we can compare parts directly

            if (statsTimeframe === 'daily') {
                return tradeDate.getDate() === now.getDate() &&
                    tradeDate.getMonth() === now.getMonth() &&
                    tradeDate.getFullYear() === now.getFullYear();
            }
            if (statsTimeframe === 'weekly') return tradeDate >= startOfWeek;
            if (statsTimeframe === 'monthly') return tradeDate >= startOfMonth;
            if (statsTimeframe === 'yearly') return tradeDate >= startOfYear;
            if (statsTimeframe === 'all') return true;
            return true;
        }).filter(t => {
            if (statsStrategy === 'All') return true;
            return t.strategy === statsStrategy;
        });

        const totalProfit = filteredTrades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0);
        const totalLoss = Math.abs(filteredTrades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0));

        // Metrics calculation logic
        // Sharpe Ratio Calculation (Daily)
        const dailyPnlMap: Record<string, number> = {};
        filteredTrades.forEach(t => {
            const dateStr = new Date(t.date).toISOString().split('T')[0];
            dailyPnlMap[dateStr] = (dailyPnlMap[dateStr] || 0) + t.pnl;
        });
        const dailyPnls = Object.values(dailyPnlMap);
        let sharpeRatio = 0;
        if (dailyPnls.length > 1) {
            const avgDailyPnl = dailyPnls.reduce((a, b) => a + b, 0) / dailyPnls.length;
            const variance = dailyPnls.reduce((a, b) => a + Math.pow(b - avgDailyPnl, 2), 0) / (dailyPnls.length - 1);
            const stdDev = Math.sqrt(variance);
            if (stdDev !== 0) {
                sharpeRatio = (avgDailyPnl / stdDev) * Math.sqrt(365); // Annualized
            }
        }

        // Max Drawdown Calculation
        // Sort trades by date for equity curve
        const sortedForDd = [...filteredTrades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        let currentEquity = 0;
        let peakEquity = 0;
        let maxDrawdown = 0;

        sortedForDd.forEach(t => {
            currentEquity += t.pnl;
            if (currentEquity > peakEquity) peakEquity = currentEquity;
            const drawdown = peakEquity - currentEquity;
            if (drawdown > maxDrawdown) maxDrawdown = drawdown;
        });

        // Metrics calculation logic
        const winRate = filteredTrades.length > 0 ? (filteredTrades.filter(t => t.pnl > 0).length / filteredTrades.length) * 100 : 0;
        const avgProfit = filteredTrades.filter(t => t.pnl > 0).length > 0 ? filteredTrades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0) / filteredTrades.filter(t => t.pnl > 0).length : 0;
        const avgLoss = filteredTrades.filter(t => t.pnl < 0).length > 0 ? Math.abs(filteredTrades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0)) / filteredTrades.filter(t => t.pnl < 0).length : 1;
        const riskReward = avgLoss === 0 ? 0 : (avgProfit / avgLoss);
        const expectancy = (avgProfit * (winRate / 100)) - (avgLoss * (1 - (winRate / 100)));

        const strategyDataMap: any = {};
        const monthlyDataMap: any = {};
        const weeklyDataMap: any = {};
        const yearlyDataMap: any = {};

        filteredTrades.forEach(t => {
            const strat = t.strategy || 'Unknown';
            strategyDataMap[strat] = (strategyDataMap[strat] || 0) + t.pnl;

            const date = new Date(t.date);

            // Monthly Key
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyDataMap[monthKey] = (monthlyDataMap[monthKey] || 0) + t.pnl;

            // Yearly Key
            const yearKey = `${date.getFullYear()}`;
            yearlyDataMap[yearKey] = (yearlyDataMap[yearKey] || 0) + t.pnl;

            // Weekly Key (Sunday to Saturday)
            const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
            const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
            const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
            const weekKey = `${date.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
            weeklyDataMap[weekKey] = (weeklyDataMap[weekKey] || 0) + t.pnl;
        });

        const strategyProfitData = Object.keys(strategyDataMap).map(name => ({ name, pnl: strategyDataMap[name] }));
        const monthlyPnlData = Object.keys(monthlyDataMap).sort().map(month => ({ month, pnl: monthlyDataMap[month] }));
        const weeklyPnlData = Object.keys(weeklyDataMap).sort().map(week => ({ week, pnl: weeklyDataMap[week] }));
        const yearlyPnlData = Object.keys(yearlyDataMap).sort().map(year => ({ year, pnl: yearlyDataMap[year] }));

        // Generate Equity Curve Candlestick Data
        const sortedForCurve = [...filteredTrades].sort((a, b) => {
            const tA = new Date(a.date || "").getTime() || 0;
            const tB = new Date(b.date || "").getTime() || 0;
            if (tA !== tB) return tA - tB;
            return (a.id || "").localeCompare(b.id || "");
        });
        let curveEquity = 0;
        const perTradeCandles = sortedForCurve.map((t, i) => {
            const pnlVal = t.pnlAmount ?? t.pnl ?? 0;
            const open = curveEquity;
            const close = curveEquity + pnlVal;
            const high = Math.max(open, close);
            const low = Math.min(open, close);
            curveEquity = close;
            return {
                id: t.id,
                symbol: t.symbol,
                open,
                high,
                low,
                close,
                pnl: pnlVal,
                date: t.date,
                index: i + 1
            };
        });

        return {
            totalPnl,
            totalTrades: filteredTrades.length,
            winRate,
            expectancy,
            totalProfit,
            totalLoss,
            strategyProfitData,
            monthlyPnlData,
            weeklyPnlData,
            yearlyPnlData,
            metricsCards: [
                { title: 'Sharpe Ratio', value: sharpeRatio, units: '', valueDecimals: 2, prefix: '' },
                { title: 'Max Drawdown', value: maxDrawdown, units: '', valueDecimals: 0, prefix: '-' + globalCurrency },
                { title: 'Risk-Reward Ratio', value: riskReward, units: ':1', valueDecimals: 2, prefix: '' },
                { title: 'Expectancy (Avg)', value: expectancy, units: '', valueDecimals: 2, prefix: globalCurrency }
            ],
            baseCurrencyCode: 'USD',
            baseCurrencySymbol: globalCurrency,
            perTradeCandles,
            filteredTrades
        };
    };

    const performanceStats = useMemo(() => calculatePerformanceStats(), [trades, statsTimeframe, statsStrategy]);

    const theme = isDarkMode ? {
        bg: 'bg-gray-900',
        card: 'bg-gray-800',
        text: 'text-white',
        subtext: 'text-gray-400',
        border: 'border-gray-700',
        input: 'bg-gray-900 text-white border-gray-700 placeholder-gray-600',
        label: 'text-gray-400'
    } : {
        bg: 'bg-gray-100',
        card: 'bg-white',
        text: 'text-gray-900',
        subtext: 'text-gray-600',
        border: 'border-gray-300',
        input: 'bg-white text-gray-900 border-gray-300 placeholder-gray-400',
        label: 'text-gray-600'
    };

    if (!auth || !db) {
        return (
            <div className={`min-h-screen ${theme.bg} ${theme.text} flex flex-col items-center justify-center p-6 text-center`}>
                <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-3xl max-w-md">
                    <h2 className="text-2xl font-black text-red-500 mb-4">Configuration Missing</h2>
                    <p className="text-gray-400 mb-6">
                        Firebase configuration not found. Please ensure <strong>VITE_FIREBASE_CONFIG</strong> is set in your environment variables.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold transition-all"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    if (authLoading) {
        return (
            <div className={`min-h-screen ${theme.bg} ${theme.text} flex items-center justify-center`}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (!user) {
        if (infoPage) {
            return <InformationScreen pageType={infoPage} onBack={() => setInfoPage(null)} theme={theme} />;
        }
        if (showLanding) {
            return <LandingScreen onSignIn={() => setShowLanding(false)} onOpenInfo={(page) => setInfoPage(page)} theme={theme} isDarkMode={isDarkMode} />;
        }
        return <LoginScreen theme={theme} />;
    }

    return (
        <div className={`min-h-screen w-full flex flex-col md:flex-row ${theme.bg} ${theme.text} transition-colors duration-300`}>
            {/* Desktop Sidebar */}
            <aside className={`hidden md:flex flex-col w-64 border-r ${theme.border} ${theme.card} h-screen sticky top-0 z-50`}>
                <div className="p-6 border-b border-gray-700/50 flex items-center gap-3">
                    <img src="/logo.png" alt="Trade Journal Logo" className="w-10 h-10 object-contain rounded-xl bg-white/10" />
                    <span className="text-xl font-black tracking-tight">Trade Journal</span>
                </div>
                <nav className="flex-1 p-4 space-y-2 mt-4">
                    <DeskNavButton icon={<Home size={20} />} label="Dashboard" active={currentScreen === 'dashboard'} onClick={() => setCurrentScreen('dashboard')} />
                    <DeskNavButton icon={<TrendingUp size={20} />} label="Trades" active={currentScreen === 'trades'} onClick={() => setCurrentScreen('trades')} />
                    <DeskNavButton icon={<MessageSquare size={20} />} label="AI Coach" active={currentScreen === 'ai-coach'} onClick={() => setCurrentScreen('ai-coach')} />
                    <DeskNavButton icon={<BarChart3 size={20} />} label="Stats" active={currentScreen === 'stats'} onClick={() => setCurrentScreen('stats')} />
                    <DeskNavButton icon={<User size={20} />} label="Profile" active={currentScreen === 'profile'} onClick={() => setCurrentScreen('profile')} />
                </nav>
            </aside>

            {/* Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className={`md:hidden ${theme.card} border-b ${theme.border} p-4 flex items-center justify-between z-10`}>
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Trade Journal Logo" className="w-8 h-8 object-contain rounded-lg bg-white/10" />
                        <h1 className="text-xl font-black tracking-tight">Trade Journal</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {currentScreen === 'ai-coach' && (
                            <button
                                onClick={clearChat}
                                className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors"
                                title="Clear Chat"
                            >
                                <Trash2 size={20} />
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setCurrentScreen('notifications');
                                setUnreadNotifications(0);
                            }}
                            className={`p-2 rounded-xl border ${theme.border} ${theme.card} relative hover:bg-gray-700/50 transition-colors`}
                        >
                            <Bell size={20} className="text-gray-400" />
                            {unreadNotifications > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-gray-800"></span>
                            )}
                        </button>
                    </div>
                </header>

                {/* Desktop Top Bar (Optional, for notifications) */}
                <header className={`hidden md:flex ${theme.card} border-b ${theme.border} p-4 items-center justify-end z-10 sticky top-0`}>
                    <div className="flex items-center gap-3">
                        {currentScreen === 'ai-coach' && (
                            <button
                                onClick={clearChat}
                                className="px-4 py-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2"
                            >
                                <Trash2 size={18} /> <span className="text-sm font-bold">Clear Chat</span>
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setCurrentScreen('notifications');
                                setUnreadNotifications(0);
                            }}
                            className={`p-2 rounded-xl border ${theme.border} ${theme.card} relative hover:bg-gray-700/50 transition-colors`}
                        >
                            <Bell size={20} className="text-gray-400" />
                            {unreadNotifications > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-gray-800"></span>
                            )}
                        </button>
                    </div>
                </header>

                {/* Bottom Navigation */}
                <nav className={`md:hidden ${theme.card} border-t ${theme.border} fixed bottom-0 left-0 w-full z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]`}>
                    <div className="max-w-md mx-auto flex items-center justify-around py-2 px-2 pb-safe">
                        <NavButton icon={<Home size={20} />} label="Home" active={currentScreen === 'dashboard'} onClick={() => setCurrentScreen('dashboard')} />
                        <NavButton icon={<TrendingUp size={20} />} label="Trades" active={currentScreen === 'trades'} onClick={() => setCurrentScreen('trades')} />
                        <NavButton icon={<MessageSquare size={20} />} label="AI Coach" active={currentScreen === 'ai-coach'} onClick={() => setCurrentScreen('ai-coach')} />
                        <NavButton icon={<BarChart3 size={20} />} label="Stats" active={currentScreen === 'stats'} onClick={() => setCurrentScreen('stats')} />
                        <NavButton icon={<User size={20} />} label="Profile" active={currentScreen === 'profile'} onClick={() => setCurrentScreen('profile')} />
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 pb-24 md:pb-8">
                    {currentScreen === 'dashboard' && (
                        <div className="space-y-4">
                            {/* 1. Total Net P&L (Value Only) */}
                            <div className={`${theme.card} p-5 rounded-xl border ${theme.border} text-center mb-4`}>
                                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-semibold">Total Net P&L</p>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className={`text-5xl font-black ${totalPnl >= 0 ? 'text-green-500' : 'text-red-500'} tracking-tight`}>
                                        {totalPnl >= 0 ? '+' : ''}{globalCurrency}{totalPnl.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* 2. P&L History Chart */}
                            <div className={`${theme.card} p-4 md:p-6 rounded-xl border ${theme.border} mb-4`}>
                                <h3 className="text-xs text-gray-400 uppercase tracking-widest mb-4 font-bold">Equity Curve</h3>
                                <div className="h-48 md:h-72 w-full">
                                    <div className="w-full h-full">
                                        <CandlestickChart
                                            data={performanceStats.perTradeCandles}
                                            currencySymbol={globalCurrency}
                                            isDarkMode={isDarkMode}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => setShowAddTrade(true)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-green-900/20 mb-4">
                                <Plus size={24} /> Add New Trade
                            </button>


                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
                                <div className={`${theme.card} p-4 rounded-xl border ${theme.border} flex flex-col gap-1`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="p-1.5 bg-green-500/20 rounded-lg text-green-500">
                                            <TrendingUp size={16} />
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Gross Profit</p>
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold font-mono text-green-500">+{globalCurrency}{grossProfit.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500 font-medium">{winningTrades} Trades</p>
                                    </div>
                                </div>
                                <div className={`${theme.card} p-4 rounded-xl border ${theme.border} flex flex-col gap-1`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="p-1.5 bg-red-500/20 rounded-lg text-red-500">
                                            <TrendingUp size={16} className="rotate-180" />
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Gross Loss</p>
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold font-mono text-red-500">-{globalCurrency}{grossLoss.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500 font-medium">{trades.length - winningTrades} Trades</p>
                                    </div>
                                </div>
                                <div className={`${theme.card} p-4 rounded-xl border ${theme.border} flex flex-col gap-1`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-500">
                                            <BarChart3 size={16} />
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total</p>
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold font-mono">{trades.length}</p>
                                        <p className="text-xs text-gray-500 font-medium">Trades</p>
                                    </div>
                                </div>
                                <div className={`${theme.card} p-4 rounded-xl border ${theme.border} flex flex-col gap-1`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="p-1.5 bg-purple-500/20 rounded-lg text-purple-500">
                                            <TrendingUp size={16} />
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Win Rate</p>
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold font-mono">{winRate}%</p>
                                        <p className="text-xs text-gray-500 font-medium">Consistency</p>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => setCurrentScreen('risk-reward')} className={`${theme.card} border ${theme.border} w-full text-blue-500 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-500/10 mb-4`}>
                                <Calculator size={20} /> Risk Reward Calculator
                            </button>

                            <div className={`${theme.card} p-4 rounded-xl border ${theme.border}`}>
                                <h2 className="font-bold mb-4">Recent Trades</h2>
                                <div className="space-y-3">
                                    {[...trades].reverse().slice(0, 50).map((trade) => (
                                        <div key={trade.id} className={`p-3 rounded-lg border ${theme.border} hover:bg-gray-700/50 transition-colors`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold">{trade.symbol}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded ${trade.type === 'Long' ? 'bg-green-600/20 text-green-500' : 'bg-red-600/20 text-red-500'}`}>{trade.type}</span>
                                                </div>
                                                <span className={`font-bold ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>{trade.pnl >= 0 ? '+' : ''}{globalCurrency}{trade.pnl}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-400">
                                                <span>{trade.date}</span>
                                                <span>{trade.strategy}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentScreen === 'trades' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-bold">Your Trades</h2>
                                <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition-all ${showFavoritesOnly ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-700 text-gray-400'}`}>
                                    <Star size={14} className={showFavoritesOnly ? "fill-white" : ""} /> Favorites Only
                                </button>
                            </div>
                            <div className="space-y-3">
                                {[...trades].reverse().filter(t => !showFavoritesOnly || t.isFavorite).map((trade, index) => (
                                    <React.Fragment key={trade.id}>
                                        <div onClick={() => setSelectedTrade(trade)} className={`${theme.card} p-4 rounded-2xl border ${theme.border} flex items-center justify-between shadow-sm cursor-pointer active:bg-gray-700/50`}>
                                            <div className="flex items-center gap-4">
                                                <button onClick={(e) => { e.stopPropagation(); toggleFavorite(trade.id); }} className="p-1"><Star size={24} className={trade.isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-gray-700'} /></button>
                                                <div><h3 className="font-bold text-base tracking-wide">{trade.symbol}</h3><p className={`text-xs ${theme.subtext}`}>{trade.date}</p></div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`font-bold text-base ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>{trade.pnl >= 0 ? '+' : ''}{globalCurrency}{Math.abs(trade.pnl).toLocaleString()}</span>
                                                <button onClick={(e) => { e.stopPropagation(); deleteTrade(trade.id); }} className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-500/10"><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))}
                                {trades.filter(t => !showFavoritesOnly || t.isFavorite).length === 0 && (
                                    <div className="text-center py-10 text-gray-500"><p>No trades found.</p></div>
                                )}
                            </div>
                        </div>
                    )}

                    {currentScreen === 'ai-coach' && (
                        <div className="h-[calc(100vh-140px)]">
                            <AiChatScreen theme={theme} chatMessages={chatMessages} isThinking={isThinking} chatEndRef={chatEndRef} chatInput={chatInput} setChatInput={setChatInput} handleAiAsk={handleAiAsk} products={products} trackProductClick={trackProductClick} />
                        </div>
                    )}

                    {currentScreen === 'risk-reward' && (
                        <RiskRewardCalculatorScreen theme={theme} isDarkMode={isDarkMode} primaryCurrencySymbol={globalCurrency} />
                    )}

                    {currentScreen === 'profile' && (
                        <ProfileScreen theme={theme} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setCurrentScreen={setCurrentScreen} />
                    )}

                    {currentScreen === 'stats' && (
                        <PerformanceMetricsScreen performanceStats={performanceStats as any} trades={performanceStats.filteredTrades} theme={theme} primaryCurrencySymbol={globalCurrency} isDarkMode={isDarkMode} timeframe={statsTimeframe} setTimeframe={setStatsTimeframe} selectedStrategy={statsStrategy} setSelectedStrategy={setStatsStrategy} availableStrategies={[...Array.from(new Set(trades.map(t => t.strategy || 'Unknown'))).filter(s => s !== 'Unknown' && s !== 'Breakout')]} initialBalance={initialBalance} setInitialBalance={setInitialBalance} />
                    )}

                    {currentScreen === 'admin' && (
                        <AdminScreen theme={theme} isDarkMode={isDarkMode} onBack={() => setCurrentScreen('profile')} />
                    )}

                    {currentScreen === 'notifications' && (
                        <NotificationsScreen theme={theme} onBack={() => setCurrentScreen('dashboard')} />
                    )}
                </main>

                {/* Add Trade Modal */}
                {
                    showAddTrade && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                            <div className={`${theme.card} p-6 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        Log New Trade
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const event = new CustomEvent('toggleFormFavorite');
                                                window.dispatchEvent(event);
                                            }}
                                            id="modal-fav-btn"
                                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-500"
                                        >
                                            <Star size={20} id="modal-fav-icon" />
                                        </button>
                                        <button onClick={() => setShowAddTrade(false)} className="p-2 hover:bg-gray-700 rounded-lg">
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>
                                <AddTradeForm onSubmit={addTrade} theme={theme} setGlobalCurrency={setGlobalCurrency} />
                            </div>
                        </div>
                    )
                }

                {/* Trade Details Modal */}
                {selectedTrade && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className={`${theme.card} p-7 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto border ${theme.border} shadow-2xl`}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black flex items-center gap-2">Trade Details</h2>
                                <button onClick={() => setSelectedTrade(null)} className="p-2 hover:bg-gray-700 rounded-xl transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'} border ${theme.border}`}>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Symbol</p>
                                        <p className="font-bold text-lg">{selectedTrade.symbol}</p>
                                    </div>
                                    <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'} border ${theme.border}`}>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Direction</p>
                                        <p className={`font-bold text-lg ${selectedTrade.type === 'Long' ? 'text-green-500' : 'text-red-500'}`}>{selectedTrade.type}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-700/30">
                                        <span className="text-sm text-gray-400 font-bold uppercase">Date</span>
                                        <span className="font-mono">{selectedTrade.date}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-700/30">
                                        <span className="text-sm text-gray-400 font-bold uppercase">Entry Price</span>
                                        <span className="font-mono font-bold">{globalCurrency}{selectedTrade.entryPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-700/30">
                                        <span className="text-sm text-gray-400 font-bold uppercase">Exit Price</span>
                                        <span className="font-mono font-bold">{globalCurrency}{selectedTrade.exitPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 bg-gray-800/20 px-3 rounded-xl border border-gray-700/30">
                                        <span className="text-sm text-gray-400 font-bold uppercase">Return (P&L)</span>
                                        <span className={`text-xl font-black ${selectedTrade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {selectedTrade.pnl >= 0 ? '+' : ''}{globalCurrency}{selectedTrade.pnl.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Strategy</p>
                                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>{selectedTrade.strategy}</span>
                                    </div>
                                    {selectedTrade.style && (
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Style</p>
                                            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>{selectedTrade.style}</span>
                                        </div>
                                    )}
                                </div>

                                {selectedTrade.mentalState && (
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2 flex items-center gap-1">Mental State <Brain size={12} /></p>
                                        <span className="inline-block px-4 py-2 rounded-full text-xs font-bold bg-purple-900/20 text-purple-400 border border-purple-500/30">{selectedTrade.mentalState}</span>
                                    </div>
                                )}

                                {selectedTrade.note && (
                                    <div className="pt-2">
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Trade Note</p>
                                        <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border text-sm italic leading-relaxed`}>
                                            "{selectedTrade.note}"
                                        </div>
                                    </div>
                                )}

                                {selectedTrade.screenshot && (
                                    <div className="pt-2">
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Trade Screenshot</p>
                                        <div className={`rounded-2xl overflow-hidden border ${theme.border}`}>
                                            <img src={selectedTrade.screenshot} alt="Trade Screenshot" className="w-full h-auto object-cover" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {/* End of modals */}
            </div>
        </div>
    );
};

const DeskNavButton = ({ icon, label, active, onClick }: any) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${active ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
        {icon}
        <span className="text-sm">{label}</span>
    </button>
);

const NavButton = ({ icon, label, active, onClick }: any) => (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${active ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}>
        {icon}
        <span className="text-xs">{label}</span>
    </button>
);

const StatCard = ({ label, value, subValue, color, icon, theme }: any) => (
    <div className={`${theme.card} p-4 rounded-xl border ${theme.border} flex flex-col gap-1`}>
        <div className="flex items-center gap-2 mb-1">
            <div className={`p-1.5 bg-opacity-20 rounded-lg ${color.replace('text-', 'bg-')} ${color}`}>
                {icon}
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
        </div>
        <div>
            <p className={`text-lg font-bold font-mono ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 font-medium">{subValue}</p>
        </div>
    </div>
);

const AddTradeForm = ({ onSubmit, theme, setGlobalCurrency }: any) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [formData, setFormData] = useState({
        symbol: '',
        date: new Date().toISOString().split('T')[0],
        entryPrice: '',
        exitPrice: '',
        type: 'Long' as 'Long' | 'Short',
        strategy: 'Breakout',
        style: 'Scalping',
        mentalState: '',
        note: '',
        pnlOverride: '',
        isFavorite: false,
        screenshot: ''
    });

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const dataUrl = reader.result as string;
                const base64String = dataUrl.split(',')[1];
                const analysis = await analyzeTradeScreenshot(base64String);

                if (analysis) {
                    // Update global currency if detected
                    if (analysis.currencySymbol) {
                        setGlobalCurrency(analysis.currencySymbol);
                    }

                    let finalPnl = analysis.pnlAmountValue || 0;
                    if (analysis.resultType === 'Loss') {
                        finalPnl = -Math.abs(finalPnl);
                    } else {
                        finalPnl = Math.abs(finalPnl);
                    }

                    setFormData(prev => ({
                        ...prev,
                        symbol: analysis.symbol || prev.symbol,
                        date: analysis.date || prev.date,
                        entryPrice: analysis.entryPrice?.toString() || prev.entryPrice,
                        exitPrice: analysis.exitPrice?.toString() || prev.exitPrice,
                        type: analysis.tradeType || prev.type,
                        pnlOverride: finalPnl.toString(),
                        note: analysis.note || prev.note,
                        isFavorite: prev.isFavorite,
                        screenshot: dataUrl
                    }));
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Analysis failed", error);
            alert("Could not analyze screenshot. Please enter manually.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const mentalStates = ['Disciplined', 'FOMO', 'Revenge', 'Boredom', 'Hesitant', 'Rushed', 'Flow State', 'Anxious'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const pnl = Number(formData.pnlOverride) || (
            formData.type === 'Long'
                ? (Number(formData.exitPrice) - Number(formData.entryPrice))
                : (Number(formData.entryPrice) - Number(formData.exitPrice))
        );

        onSubmit({
            ...formData,
            entryPrice: Number(formData.entryPrice),
            exitPrice: Number(formData.exitPrice),
            pnl: pnl
        });
    };

    const togglePnlType = (isLoss: boolean) => {
        let val = Math.abs(Number(formData.pnlOverride) || 0);
        if (val === 0 && isLoss) {
            // If it's 0 and they want loss, we'll store a hint or just use a small negative
            setFormData({ ...formData, pnlOverride: '-0.01' });
        } else {
            setFormData({ ...formData, pnlOverride: (isLoss ? -val : val).toString() });
        }
    };

    useEffect(() => {
        const handleToggle = () => {
            setFormData(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
        };
        window.addEventListener('toggleFormFavorite', handleToggle);
        return () => window.removeEventListener('toggleFormFavorite', handleToggle);
    }, []);

    // Update the icon in the header based on state (DOM manipulation for simple sync)
    useEffect(() => {
        const icon = document.getElementById('modal-fav-icon');
        const btn = document.getElementById('modal-fav-btn');
        if (icon && btn) {
            if (formData.isFavorite) {
                icon.classList.add('fill-yellow-500', 'text-yellow-500');
                btn.classList.add('bg-yellow-500/10');
            } else {
                icon.classList.remove('fill-yellow-500', 'text-yellow-500');
                btn.classList.remove('bg-yellow-500/10');
            }
        }
    }, [formData.isFavorite]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6 relative">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleScreenshotUpload}
            />
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className={`w-full ${isAnalyzing ? 'bg-gray-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg ${isAnalyzing ? '' : 'shadow-green-900/20'}`}
            >
                <Upload size={20} />
                <span>Analyze Screenshot</span>
            </button>

            {/* Full Form Loading Overlay */}
            {isAnalyzing && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-white font-bold text-lg animate-pulse">AI Analyzing Trade...</p>
                    <p className="text-gray-400 text-xs mt-2">Extracting data from screenshot</p>
                </div>
            )}

            {formData.screenshot && (
                <div className="relative group">
                    <div className={`rounded-xl overflow-hidden border ${theme.border} h-32`}>
                        <img src={formData.screenshot} alt="Preview" className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold bg-black/50 px-3 py-1 rounded-full text-white">Screenshot Loaded ✅</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className={`text-xs ${theme.subtext} font-bold uppercase tracking-wider mb-1 block`}>Symbol</label>
                    <input type="text" value={formData.symbol} onChange={e => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })} className={`w-full p-4 rounded-xl ${theme.bg} border ${theme.border} outline-none focus:border-green-500 transition-colors uppercase font-bold tracking-wide placeholder-gray-600`} placeholder="e.g. BTCUSDT" required />
                </div>
                <div>
                    <label className={`text-xs ${theme.subtext} font-bold uppercase tracking-wider mb-1 block`}>Date</label>
                    <div className="relative">
                        {/* Visual Input (Shows DD/MM/YYYY) */}
                        <input
                            type="text"
                            readOnly
                            value={formData.date ? formData.date.split('-').reverse().join('/') : ''}
                            className={`w-full p-4 rounded-xl ${theme.bg} border ${theme.border} outline-none focus:border-green-500 transition-colors cursor-pointer font-mono`}
                            placeholder="DD/MM/YYYY"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                            📅
                        </div>
                        {/* Hidden Native Input (Handles Selection) */}
                        <input
                            type="date"
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            required
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className={`text-xs ${theme.subtext} font-bold uppercase tracking-wider mb-2 block`}>Direction</label>
                <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setFormData({ ...formData, type: 'Long' })} className={`py-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-2 ${formData.type === 'Long' ? 'bg-green-600/20 border-green-500 text-green-500' : `border-gray-700 text-gray-500 hover:bg-gray-800`}`}><TrendingUp size={18} /> Long</button>
                    <button type="button" onClick={() => setFormData({ ...formData, type: 'Short' })} className={`py-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-2 ${formData.type === 'Short' ? 'bg-red-600/20 border-red-500 text-red-500' : `border-gray-700 text-gray-500 hover:bg-gray-800`}`}><TrendingUp size={18} className="rotate-180" /> Short</button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div><label className={`text-xs ${theme.subtext} font-bold uppercase tracking-wider mb-1 block`}>Entry Price</label><input type="number" step="0.01" value={formData.entryPrice} onChange={e => setFormData({ ...formData, entryPrice: e.target.value })} className={`w-full p-4 rounded-xl ${theme.bg} border ${theme.border} outline-none`} /></div>
                <div><label className={`text-xs ${theme.subtext} font-bold uppercase tracking-wider mb-1 block`}>Exit Price</label><input type="number" step="0.01" value={formData.exitPrice} onChange={e => setFormData({ ...formData, exitPrice: e.target.value })} className={`w-full p-4 rounded-xl ${theme.bg} border ${theme.border} outline-none`} /></div>
            </div>

            <div className="p-4 rounded-xl border border-dashed border-gray-700 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => togglePnlType(false)}
                        className={`font-bold py-2 rounded-lg text-center text-sm transition-all ${Number(formData.pnlOverride) >= 0 ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-500'}`}
                    >
                        Profit
                    </button>
                    <button
                        type="button"
                        onClick={() => togglePnlType(true)}
                        className={`font-bold py-2 rounded-lg text-center text-sm transition-all ${Number(formData.pnlOverride) < 0 ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-500'}`}
                    >
                        Loss
                    </button>
                </div>
                <div><label className={`text-xs ${theme.subtext} font-bold uppercase tracking-wider mb-1 block`}>Amount (USD)</label><input type="number" placeholder="Calc. Automatically" value={formData.pnlOverride} onChange={e => setFormData({ ...formData, pnlOverride: e.target.value })} className={`w-full p-4 rounded-xl ${theme.bg} border ${theme.border} outline-none focus:border-green-500`} /></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={`text-xs ${theme.subtext} font-bold uppercase tracking-wider mb-1 block`}>Strategy</label>
                    <div className="relative">
                        <input
                            list="strategies-list"
                            value={formData.strategy}
                            onChange={e => setFormData({ ...formData, strategy: e.target.value })}
                            className={`w-full p-3 rounded-xl ${theme.bg} border ${theme.border} outline-none focus:border-blue-500 transition-colors`}
                            placeholder="Select or Type..."
                        />
                        <datalist id="strategies-list">
                            <option value="Breakout" />
                            <option value="Trend" />
                            <option value="Reversal" />
                            <option value="Scalp" />
                            <option value="Range" />
                            <option value="Gap Fill" />
                            <option value="Pullback" />
                        </datalist>
                    </div>
                </div>
                <div>
                    <label className={`text-xs ${theme.subtext} font-bold uppercase tracking-wider mb-1 block`}>Style</label>
                    <div className="relative">
                        <select value={formData.style} onChange={e => setFormData({ ...formData, style: e.target.value })} className={`w-full p-3 rounded-xl ${theme.bg} border ${theme.border} appearance-none outline-none`}><option>Scalping</option><option>Day Trading</option><option>Swing</option><option>Position</option></select>
                        <ChevronDown className="absolute right-3 top-3.5 text-gray-500 pointer-events-none" size={16} />
                    </div>
                </div>
            </div>

            <div>
                <label className={`text-xs ${theme.subtext} font-bold uppercase tracking-wider mb-2 flex items-center gap-1`}>Mental State <Brain size={14} /></label>
                <div className="flex flex-wrap gap-2">
                    {mentalStates.map(state => (
                        <button key={state} type="button" onClick={() => setFormData({ ...formData, mentalState: state })} className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${formData.mentalState === state ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]' : `border-gray-700 text-gray-400 hover:border-gray-500`}`}>{state}</button>
                    ))}
                </div>
            </div>

            <div><label className={`text-xs ${theme.subtext} font-bold uppercase tracking-wider mb-1 block`}>Journal Note</label><textarea rows={3} value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} className={`w-full p-4 rounded-xl ${theme.bg} border ${theme.border} outline-none focus:border-purple-500 transition-colors`} placeholder="Lessons learned..."></textarea></div>

            <div className="grid grid-cols-2 gap-4 pt-2">
                <button type="button" className={`py-4 rounded-xl font-bold bg-gray-700 text-gray-300 hover:bg-gray-600`}>Cancel</button>
                <button type="submit" className="py-4 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-900/20">Commit Trade</button>
            </div>
        </form>
    );
};

export default App;
