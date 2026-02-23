import React, { useState, useEffect } from 'react';
import {
    Users,
    User,
    Settings,
    ShieldCheck,
    BarChart3,
    Megaphone,
    ArrowLeft,
    MoreVertical,
    ChevronRight,
    UserPlus,
    Activity,
    DollarSign,
    AlertTriangle,
    RefreshCcw,
    CheckCircle2,
    MessageSquare,
    ShoppingBag,
    Plus,
    Trash2,
    Link,
    Image as ImageIcon,
    Upload,
    Clipboard,
    Brain
} from 'lucide-react';
import { db, appId, storage, firebaseConfig } from '../utils/firebase';
import { collection, query, getDocs, limit, orderBy, addDoc, deleteDoc, doc, serverTimestamp, setDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface AdminScreenProps {
    theme: any;
    onBack: () => void;
    isDarkMode: boolean;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({ theme, onBack, isDarkMode }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'ads' | 'messages' | 'products' | 'settings' | 'ai_logs'>(() =>
        (localStorage.getItem('adminActiveTab') as any) || 'overview'
    );

    useEffect(() => {
        localStorage.setItem('adminActiveTab', activeTab);
    }, [activeTab]);
    const [aiLogs, setAiLogs] = useState<any[]>([]);
    const [adConfig, setAdConfig] = useState({
        bannerDashboard: true,
        interstitialProfile: true,
        bannerAllTrades: true
    });
    const [isLoading, setIsLoading] = useState(false);
    const [pageViews, setPageViews] = useState<any[]>([]); // { page: string, views: number }
    const [firebaseStatus, setFirebaseStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');

    // Broadcast State
    const [broadcastTitle, setBroadcastTitle] = useState('');
    const [broadcastBody, setBroadcastBody] = useState('');
    const [isSendingMsg, setIsSendingMsg] = useState(false);

    // Products State
    const [products, setProducts] = useState<any[]>([]);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', link: '', imageUrl: '', isActive: true });
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [realStats, setRealStats] = useState({
        users: 0,
        trades: 0,
        revenue: 0,
        active: 0
    });
    const [usersList, setUsersList] = useState<any[]>([]);

    const fetchFirebaseData = async () => {
        if (!db) {
            setFirebaseStatus('disconnected');
            return;
        }

        setIsLoading(true);
        try {
            setFirebaseStatus('connected');

            // Step 1: Fetch total users
            // In our design: artifacts/{appId}/users
            const usersRef = collection(db!, 'artifacts', appId, 'users');
            const usersSnap = await getDocs(usersRef);
            const totalUsers = usersSnap.size;

            let totalTrades = 0;
            let tempUsers: any[] = [];

            // Step 2: Fetch trades count (Iterating users for global count in this simple setup)
            // Note: In a production app with many users, you'd want a dedicated stats document updated via triggers.
            for (const userDoc of usersSnap.docs) {
                const tradesRef = collection(db!, 'artifacts', appId, 'users', userDoc.id, 'trades');
                const tradesSnap = await getDocs(tradesRef);
                totalTrades += tradesSnap.size;

                const profileRef = collection(db!, 'artifacts', appId, 'users', userDoc.id, 'profile');
                const profileSnap = await getDocs(profileRef);
                const profileData = profileSnap.docs[0]?.data() || {};

                tempUsers.push({
                    id: userDoc.id,
                    name: profileData.name || 'Trader ' + userDoc.id.slice(0, 4),
                    email: profileData.email || 'No Email',
                    trades: tradesSnap.size,
                    status: 'Active',
                    plan: 'Free'
                });
            }

            setRealStats({
                users: totalUsers,
                trades: totalTrades,
                revenue: totalUsers * 10, // Mock revenue calculation based on users
                active: Math.max(0, Math.floor(totalUsers * 0.1)) // Mock active users
            });
            console.log("Admin Panel: Successfully fetched real stats:", totalUsers, totalTrades);
            setUsersList(tempUsers);
        } catch (error) {
            console.error("Firebase fetch error:", error);
            setFirebaseStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFirebaseData();
        // fetchProducts(); // Handled by real-time listener above
        fetchAnalytics();
        fetchAdConfig();

        // Load cached products
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
            try {
                setProducts(JSON.parse(savedProducts));
            } catch (e) {
                console.error("Failed to parse cached products", e);
            }
        }
    }, []);


    // Cache products whenever they update
    useEffect(() => {
        if (products.length > 0) {
            localStorage.setItem('products', JSON.stringify(products));
        }
    }, [products]);

    const fetchAdConfig = async () => {
        if (!db) return;
        try {
            const docRef = doc(db, 'artifacts', appId, 'config', 'ads');
            const snap = await getDocs(query(collection(db, 'artifacts', appId, 'config'))); // Simplification, ideally getDoc
            // For now, let's assume we store it in a specific doc or collection. 
            // Better: 'artifacts/{appId}/config/ads'
            // Since structure is flexible, let's read/write to 'artifacts/{appId}/config/ads'
            // BUT wait, getDoc is better for single config.
            // Let's us collection 'config' doc 'ads'
            // ... actually, let's just use a local state for demo if fetch fails, but try to persist.
        } catch (e) {
            console.error(e);
        }
    };

    // Simulate Fetching Analytics (Since we haven't implemented writing it yet, we'll placeholder read)
    const fetchAnalytics = async () => {
        if (!db) return;
        try {
            // We will implement writing to 'artifacts/{appId}/analytics/page_views' in App.tsx
            // Reading logic:
            const q = collection(db, 'artifacts', appId, 'analytics');
            const snap = await getDocs(q);
            const views = snap.docs.map(d => ({ page: d.id, views: d.data().count || 0 }));
            setPageViews(views.sort((a, b) => b.views - a.views));
        } catch (e) { console.error(e); }
    };

    const toggleAd = async (key: keyof typeof adConfig) => {
        const newConfig = { ...adConfig, [key]: !adConfig[key] };
        setAdConfig(newConfig);
        // Persist to Firestore
        if (db) {
            try {
                await setDoc(doc(db, 'artifacts', appId, 'config', 'ads'), newConfig);
            } catch (e) { console.error(e); }
        }
    };

    useEffect(() => {
        if (!db) return;

        // Simple query without sorting to avoid index requirements
        const q = collection(db, 'artifacts', appId, 'products');

        const unsubscribe = onSnapshot(q,
            (querySnapshot) => {
                console.log(`[DEBUG] onSnapshot firing. AppID: ${appId}, Docs found: ${querySnapshot.size}`);
                const fetchedProducts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                // Sort client-side
                fetchedProducts.sort((a: any, b: any) => {
                    // Handle pending writes (null timestamp) by treating them as "now"
                    const tA = a.timestamp?.toMillis ? a.timestamp.toMillis() : (a.timestamp || Date.now());
                    const tB = b.timestamp?.toMillis ? b.timestamp.toMillis() : (b.timestamp || Date.now());
                    return tB - tA; // Descending
                });
                console.log("[DEBUG] Setting products:", fetchedProducts);
                setProducts(fetchedProducts);
            },
            (error) => {
                console.error("Product fetch error:", error);
            }
        );

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (activeTab === 'ai_logs' && db) {
            const q = query(collection(db, 'artifacts', appId, 'ai_logs'), orderBy('timestamp', 'desc'), limit(50));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                setAiLogs(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
            });
            return () => unsubscribe();
        }
    }, [activeTab]);

    const fetchProducts = async () => {
        // No-op now as we use real-time listeners
    };

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const uploadFile = async (file: File) => {
        if (!storage) return;
        setIsUploading(true);
        try {
            const path = `products/${Date.now()}_${file.name}`;
            const storageRef = ref(storage, path);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setNewProduct(prev => ({ ...prev, imageUrl: downloadURL }));
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            uploadFile(e.target.files[0]);
        }
    };

    const handlePaste = async (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        let foundImage = false;

        // 1. Check for Image Files (Binary Copy)
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                if (blob) {
                    uploadFile(blob);
                    foundImage = true;
                    break;
                }
            }
        }

        // 2. Check for Text (URL Paste)
        if (!foundImage) {
            const text = e.clipboardData.getData('text');
            if (text && (text.match(/\.(jpeg|jpg|gif|png|webp)$/i) || text.startsWith('http'))) {
                setNewProduct(prev => ({ ...prev, imageUrl: text }));
            }
        }
    };

    const handleSendBroadcast = async () => {
        if (!broadcastTitle.trim() || !broadcastBody.trim() || !db) return;
        setIsSendingMsg(true);
        try {
            await addDoc(collection(db, 'artifacts', appId, 'messages'), {
                title: broadcastTitle,
                body: broadcastBody,
                timestamp: serverTimestamp(),
                author: 'Admin'
            });
            alert('Broadcast sent successfully!');
            setBroadcastTitle('');
            setBroadcastBody('');
        } catch (error) {
            console.error("Error sending broadcast:", error);
            alert('Failed to send broadcast.');
        } finally {
            setIsSendingMsg(false);
        }
    };

    const handleAddProduct = async () => {
        console.log("[DEBUG] handleAddProduct called");
        if (!newProduct.name || !newProduct.link) {
            alert("Please provide both name and link.");
            return;
        }

        // Check for duplicates
        const isDuplicate = products.some(p =>
            p.name.toLowerCase() === newProduct.name.toLowerCase() ||
            p.link.toLowerCase() === newProduct.link.toLowerCase()
        );

        if (isDuplicate) {
            alert("A product with this name or link already exists.");
            window.location.reload();
            return;
        }

        if (!db) {
            console.error("[DEBUG] DB is not initialized");
            alert("Database not connected. Please check your config.");
            return;
        }

        console.log("[DEBUG] Proceeding to add product. AppId:", appId);
        setIsAddingProduct(true);

        let timeoutId: any;

        try {
            // Create a timeout promise to reject after 10 seconds
            const timeoutPromise = new Promise((_, reject) => {
                timeoutId = setTimeout(() => {
                    console.error("[DEBUG] Product addition timed out");
                    reject(new Error("Operation timed out"));
                }, 10000);
            });

            const addProductPromise = (async () => {
                console.log("[DEBUG] Executing addDoc...");
                const docRef = await addDoc(collection(db, 'artifacts', appId, 'products'), {
                    ...newProduct,
                    clickCount: 0,
                    timestamp: serverTimestamp()
                });
                console.log("[DEBUG] addDoc successful. DocId:", docRef.id);
                return docRef;
            })();

            // Race the addDoc against the timeout
            await Promise.race([addProductPromise, timeoutPromise]);

            clearTimeout(timeoutId);
            console.log("[DEBUG] Product added successfully");
            setNewProduct({ name: '', description: '', link: '', imageUrl: '', isActive: true });
        } catch (error: any) {
            clearTimeout(timeoutId);
            console.error("[DEBUG] Error adding product:", error);
            if (error.message === "Operation timed out") {
                alert("Request timed out. Please check your internet connection or Firebase permissions.");
            } else {
                alert(`Failed to add product: ${error.message}`);
            }
        } finally {
            console.log("[DEBUG] handleAddProduct finished");
            setIsAddingProduct(false);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!db || !window.confirm('Are you sure?')) return;
        try {
            await deleteDoc(doc(db, 'artifacts', appId, 'products', id));
            setNewProduct({ name: '', description: '', link: '', imageUrl: '', isActive: true });

        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const mockUsers: any[] = [];

    const adminStats = [
        { label: 'Total Users', value: isLoading ? '...' : (realStats?.users || 0).toLocaleString(), icon: <Users size={20} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Total Trades', value: isLoading ? '...' : (realStats?.trades || 0).toLocaleString(), icon: <Activity size={20} />, color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: 'Revenue', value: isLoading ? '...' : `$${(realStats?.revenue || 0).toLocaleString()}`, icon: <DollarSign size={20} />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { label: 'Active Now', value: isLoading ? '...' : (realStats?.active || 0).toLocaleString(), icon: <Activity size={20} />, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    ];

    return (
        <div className={`flex flex-col h-full animate-in fade-in duration-500`}>
            {/* Admin Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className={`p-2 rounded-xl ${theme.card} border ${theme.border} hover:scale-105 active:scale-95 transition-all`}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-600 rounded-lg text-white">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black tracking-tight">Admin Panel</h2>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Control Center</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {firebaseStatus === 'connected' ? (
                        <div className={`px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-2`}>
                            <CheckCircle2 size={14} className="text-green-500" />
                            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Firebase Live</span>
                        </div>
                    ) : (
                        <div className={`px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center gap-2`}>
                            <AlertTriangle size={14} className="text-amber-500" />
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Mock Data</span>
                        </div>
                    )}
                    <button
                        onClick={fetchFirebaseData}
                        disabled={isLoading}
                        className={`p-2 rounded-xl ${theme.card} border ${theme.border} hover:bg-gray-700/50 ${isLoading ? 'animate-spin' : ''}`}
                    >
                        <RefreshCcw size={20} />
                    </button>
                </div>
            </div>

            {/* Admin Navigation Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
                {[
                    { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
                    { id: 'users', label: 'Users', icon: <Users size={16} /> },
                    { id: 'ads', label: 'Ads', icon: <Megaphone size={16} /> },
                    { id: 'messages', label: 'Messages', icon: <MessageSquare size={16} /> },
                    { id: 'products', label: 'Products', icon: <ShoppingBag size={16} /> },
                    { id: 'ai_logs', label: 'AI Chats', icon: <Brain size={16} /> },
                    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                            : `${theme.card} border ${theme.border} text-gray-400 hover:text-white`
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 space-y-6">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            {adminStats.map((stat, idx) => (
                                <div key={idx} className={`${theme.card} p-4 rounded-2xl border ${theme.border} relative overflow-hidden group`}>
                                    <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform ${stat.color}`}>
                                        {stat.icon}
                                    </div>
                                    <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                                        {stat.icon}
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-2xl font-black mt-1">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className={`${theme.card} p-5 rounded-2xl border ${theme.border}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-black flex items-center gap-2 text-sm uppercase tracking-widest text-gray-400">
                                    <Activity size={16} className="text-orange-500" />
                                    Top Engagement (Page Views)
                                </h3>
                            </div>
                            <div className="space-y-3">
                                {pageViews.length > 0 ? pageViews.map((pv, i) => (
                                    <div key={pv.page} className="flex items-center justify-between">
                                        <span className="text-xs text-gray-400 font-bold capitalize">
                                            {i + 1}. {pv.page}
                                        </span>
                                        <div className="flex items-center gap-2 w-1/2">
                                            <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                                                <div className="bg-orange-500 h-full" style={{ width: `${Math.min((pv.views / (pageViews[0].views || 1)) * 100, 100)}%` }}></div>
                                            </div>
                                            <span className="text-xs font-mono">{pv.views}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center text-xs text-gray-500 py-4">No analytics data yet.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-black text-sm uppercase tracking-widest text-gray-400">User Management</h3>
                            <button className="flex items-center gap-2 text-[10px] font-black bg-indigo-600/20 text-indigo-400 px-3 py-1.5 rounded-lg border border-indigo-500/30">
                                <UserPlus size={14} />
                                INVITE USER
                            </button>
                        </div>

                    </div>
                )}

                {activeTab === 'ads' && (
                    <div className="space-y-6">
                        <div className={`${theme.card} p-5 rounded-2xl border ${theme.border}`}>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="font-black text-lg tracking-tight">Monetization</h3>
                                    <p className="text-xs text-gray-500">Configure global ad behavior</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-black text-sm uppercase tracking-widest text-gray-400">Ad Placements</h3>

                                <div className={`p-4 rounded-xl border ${theme.border} flex items-center justify-between`}>
                                    <div>
                                        <p className="font-bold text-sm">Dashboard Banner</p>
                                        <p className="text-[10px] text-gray-500">Shows below the trades list</p>
                                    </div>
                                    <button
                                        onClick={() => toggleAd('bannerDashboard')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${adConfig.bannerDashboard ? 'bg-indigo-600' : 'bg-gray-700'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${adConfig.bannerDashboard ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                <div className={`p-4 rounded-xl border ${theme.border} flex items-center justify-between`}>
                                    <div>
                                        <p className="font-bold text-sm">Profile Interstitial</p>
                                        <p className="text-[10px] text-gray-500">Shows "Watch Ad" button</p>
                                    </div>
                                    <button
                                        onClick={() => toggleAd('interstitialProfile')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${adConfig.interstitialProfile ? 'bg-indigo-600' : 'bg-gray-700'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${adConfig.interstitialProfile ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                <div className={`p-4 rounded-xl border ${theme.border} flex items-center justify-between`}>
                                    <div>
                                        <p className="font-bold text-sm">Trades List Banner</p>
                                        <p className="text-[10px] text-gray-500">Shows between trade items</p>
                                    </div>
                                    <button
                                        onClick={() => toggleAd('bannerAllTrades')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${adConfig.bannerAllTrades ? 'bg-indigo-600' : 'bg-gray-700'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${adConfig.bannerAllTrades ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex gap-3">
                            <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                            <div>
                                <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Ad Limit Warning</p>
                                <p className="text-[10px] text-amber-400/80 leading-relaxed">Interstitial ads are showing high bounce rates. Consider reducing frequency in next update.</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="space-y-6">
                        <div className={`${theme.card} p-6 rounded-2xl border ${theme.border}`}>
                            <h3 className="font-black text-lg mb-4">Send Broadcast</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Title</label>
                                    <input
                                        value={broadcastTitle}
                                        onChange={(e) => setBroadcastTitle(e.target.value)}
                                        className={`w-full p-3 rounded-xl bg-transparent border ${theme.border} outline-none focus:border-indigo-500 transition-colors font-bold`}
                                        placeholder="e.g. key Level Update"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Message Body</label>
                                    <textarea
                                        value={broadcastBody}
                                        onChange={(e) => setBroadcastBody(e.target.value)}
                                        className={`w-full p-3 rounded-xl bg-transparent border ${theme.border} outline-none focus:border-indigo-500 transition-colors h-32 resize-none`}
                                        placeholder="Type your message to all users..."
                                    />
                                </div>
                                <button
                                    onClick={handleSendBroadcast}
                                    disabled={isSendingMsg}
                                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSendingMsg ? 'Sending...' : 'SEND BROADCAST'}
                                    <Megaphone size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="space-y-6">
                        {/* Add Product Form */}
                        <div className={`${theme.card} p-6 rounded-2xl border ${theme.border}`}>
                            <h3 className="font-black text-lg mb-4">Add Affiliate Product</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Product Name</label>
                                        <input
                                            value={newProduct.name}
                                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                            className={`w-full p-3 rounded-xl bg-transparent border ${theme.border} outline-none focus:border-indigo-500 transition-colors font-bold`}
                                            placeholder="e.g. TradingView"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Affiliate Link</label>
                                        <input
                                            value={newProduct.link}
                                            onChange={(e) => setNewProduct({ ...newProduct, link: e.target.value })}
                                            className={`w-full p-3 rounded-xl bg-transparent border ${theme.border} outline-none focus:border-indigo-500 transition-colors text-blue-500`}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Description (for AI)</label>
                                    <input
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                        className={`w-full p-3 rounded-xl bg-transparent border ${theme.border} outline-none focus:border-indigo-500 transition-colors`}
                                        placeholder="Why is it useful? (AI uses this context)"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Product Image</label>

                                    {/* URL Input */}
                                    <div className="mb-2">
                                        <input
                                            value={newProduct.imageUrl}
                                            onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                                            className={`w-full p-3 rounded-xl bg-transparent border ${theme.border} outline-none focus:border-indigo-500 transition-colors text-xs font-mono text-gray-400`}
                                            placeholder="https://example.com/image.png (or paste below)"
                                        />
                                    </div>

                                    {/* Upload Area */}
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        onPaste={handlePaste}
                                        className={`w-full p-4 rounded-xl bg-transparent border-2 border-dashed ${theme.border} hover:border-indigo-500 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer outline-none focus:border-indigo-500 relative overflow-hidden`}
                                        tabIndex={0}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            accept="image/*"
                                        />

                                        {isUploading ? (
                                            <div className="animate-spin text-indigo-500"><RefreshCcw size={24} /></div>
                                        ) : newProduct.imageUrl ? (
                                            <div className="relative w-full h-32 group/img">
                                                <img src={newProduct.imageUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setNewProduct({ ...newProduct, imageUrl: '' });
                                                    }}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="p-3 bg-gray-800 rounded-full text-gray-400">
                                                    <Upload size={24} />
                                                </div>
                                                <p className="text-xs font-bold text-gray-500 text-center">
                                                    Click to <span className="text-indigo-400">Browse</span> or Paste Image (Ctrl+V)
                                                </p>
                                                <p className="text-[10px] text-gray-600">Supports URL pasting too</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={handleAddProduct}
                                    disabled={isAddingProduct}
                                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isAddingProduct ? 'Adding...' : 'ADD PRODUCT'}
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Product List */}
                        <div className="space-y-4">
                            <h3 className="font-black text-sm uppercase tracking-widest text-gray-400">Active Products</h3>
                            {products.map(product => (
                                <div key={product.id} className={`${theme.card} p-4 rounded-xl border ${theme.border} flex items-center gap-4`}>
                                    <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                <ImageIcon size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold truncate">{product.name}</h4>
                                        <p className="text-xs text-gray-500 truncate">{product.description}</p>
                                        <a href={product.link} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline truncate block">{product.link}</a>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {products.length === 0 && (
                                <div className="text-center py-8 text-gray-500 text-sm">No products added yet.</div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className={`${theme.card} rounded-2xl border ${theme.border} overflow-hidden`}>
                        {[
                            { label: 'Platform Name', value: 'Trade Journal Pro', icon: <Activity size={18} /> },
                            { label: 'Project ID', value: (firebaseConfig as any)?.projectId || 'Not Configured', icon: <Link size={18} /> },
                            { label: 'App ID (Identifier)', value: appId, icon: <ShieldCheck size={18} /> },
                            { label: 'Database Status', value: firebaseStatus === 'connected' ? 'Connected' : 'Disconnected', icon: <Activity size={18} />, status: firebaseStatus === 'connected' ? 'Online' : 'Offline' },
                        ].map((item, idx) => (
                            <div key={idx} className={`p-4 flex items-center justify-between ${idx !== 3 ? `border-b ${theme.border}` : ''} hover:bg-gray-700/20 transition-colors`}>
                                <div className="flex items-center gap-3">
                                    <div className="text-gray-500">{item.icon}</div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">{item.label}</p>
                                        <p className="text-sm font-bold">{item.value}</p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-gray-600" />
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'ai_logs' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-black text-sm uppercase tracking-widest text-gray-400">Live AI Interactions</h3>
                        </div>
                        <div className="space-y-3">
                            {aiLogs.map((log: any) => (
                                <div key={log.id} className={`${theme.card} p-4 rounded-xl border ${theme.border} space-y-3`}>
                                    <div className="flex items-center justify-between pb-2 border-b border-gray-700/50">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                                                <User size={12} />
                                            </div>
                                            <span className="text-xs font-bold text-gray-400">{log.userEmail || 'Anonymous'}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-500 font-mono">
                                            {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : 'Just now'}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">User Asked:</p>
                                        <p className="text-sm font-medium leading-relaxed">{log.question}</p>
                                    </div>
                                    <div className="pl-3 border-l-2 border-green-500/30 space-y-1">
                                        <p className="text-xs font-bold text-green-500 uppercase tracking-wider">AI Answered:</p>
                                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
                                            {log.response}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {aiLogs.length === 0 && (
                                <div className="text-center py-10 text-gray-500">
                                    <Brain size={48} className="mx-auto text-gray-700 mb-2" />
                                    <p>No AI interactions recorded yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
