import React, { useState } from 'react';
import { User, Camera, Edit, PlayCircle, Moon, Sun, Share2, Download, ShieldCheck, FileCheck, Info, HelpCircle, ChevronRight, ArrowLeft, LogOut } from 'lucide-react';
import { auth } from '../utils/firebase';
import { signOut } from 'firebase/auth';
import { SupportChatModal } from '../components/SupportChatModal';
import { ADMIN_EMAILS, isAdmin } from '../utils/admin';
import { AdOverlay, AD_UNITS } from '../components/Ads';

interface ProfileActionProps {
    icon: any;
    label: string;
    sub?: string;
    onClick?: () => void;
    trailing?: React.ReactNode;
    isDarkMode: boolean;
    iconColor?: string;
}

const ProfileAction: React.FC<ProfileActionProps> = ({ icon: Icon, label, sub, onClick, trailing, isDarkMode, iconColor }) => (
    <div
        onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick();
        }}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-all active:scale-[0.98]"
    >
        <div className="flex items-center space-x-4">
            <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-[#2a2f3e]' : 'bg-gray-100'}`}>
                <Icon size={20} className={iconColor || (isDarkMode ? 'text-gray-300' : 'text-gray-600')} />
            </div>
            <div className="flex flex-col">
                <span className={`text-[15px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{label}</span>
                {sub && <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{sub}</span>}
            </div>
        </div>
        <div>
            {trailing ? trailing : <ChevronRight size={18} className="text-gray-600" />}
        </div>
    </div>
);

interface ProfileScreenProps {
    theme: any;
    isDarkMode: boolean;
    setIsDarkMode: (val: boolean) => void;
    setCurrentScreen: (screen: string) => void;
}

const InfoModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
    isDarkMode: boolean;
}> = ({ isOpen, onClose, title, content, isDarkMode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-[100] animate-in fade-in duration-300">
            <div className={`${isDarkMode ? 'bg-[#1e2230] border-gray-700' : 'bg-white border-gray-100'} border p-8 rounded-[32px] w-full max-w-md shadow-2xl transform animate-in zoom-in-95 duration-300`}>
                <h2 className={`text-2xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
                <div className={`text-sm leading-relaxed mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {content}
                </div>
                <button
                    onClick={onClose}
                    className="w-full py-4 bg-green-500 hover:bg-green-400 text-white font-black rounded-2xl transition-all active:scale-95"
                >
                    GOT IT
                </button>
            </div>
        </div>
    );
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ theme, isDarkMode, setIsDarkMode, setCurrentScreen }) => {
    const [userName, setUserName] = useState('Alpha Trader');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdminVisible, setIsAdminVisible] = useState(false);
    const [tapCount, setTapCount] = useState(0);
    const [modalInfo, setModalInfo] = useState<{ title: string; content: string } | null>(null);
    const [isWatchingAd, setIsWatchingAd] = useState(false);
    const [showSupportChat, setShowSupportChat] = useState(false);

    // Simplified admin check using centralized utility
    const currentUserEmail = auth?.currentUser?.email;
    const isOwner = isAdmin(currentUserEmail);

    const userId = auth?.currentUser?.uid || "Guest";

    const handleIdClick = () => {
        const newCount = tapCount + 1;
        setTapCount(newCount);
        if (newCount >= 5) {
            setIsAdminVisible(true);
            setModalInfo({
                title: "Admin Mode Unlocked!",
                content: "You've successfully unlocked the hidden Admin Panel. You can now access detailed stats and management tools from the profile menu."
            });
            setTapCount(0);
        }
    };

    const handleWatchAd = () => {
        setIsWatchingAd(true);
    };

    const handleShare = async () => {
        const shareData = {
            title: 'Trade Journal Pro',
            text: 'Check out this awesome trading journal app!',
            url: window.location.href
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                setModalInfo({
                    title: "Share App",
                    content: `Copy this link to invite your friends: ${window.location.href}`
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDownloadData = () => {
        const trades = localStorage.getItem('trades') || '[]';
        const blob = new Blob([trades], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `trade-journal-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setProfileImage(reader.result as string);
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen pb-24">
            {/* Header */}
            <header className="px-4 pt-6 pb-4 flex items-center gap-4">
                <button onClick={() => setCurrentScreen('dashboard')} className={`p-2 rounded-xl ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                    <ArrowLeft size={24} className={isDarkMode ? 'text-white' : 'text-gray-900'} />
                </button>
                <h1 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Profile</h1>
            </header>

            <div className="px-4 space-y-6">
                {/* Profile Card */}
                <div className={`${isDarkMode ? 'bg-[#1e2230]' : 'bg-white'} p-8 rounded-[32px] border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-100'} shadow-2xl text-center relative overflow-hidden group`}>
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-green-500 shadow-[0_2px_10px_rgba(34,197,94,0.3)]"></div>

                    <div className="relative inline-block mb-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden shadow-2xl border-4 border-[#2a2f3e] mx-auto bg-[#2a2f3e] flex items-center justify-center transition-transform group-hover:scale-105 duration-500">
                            {profileImage ? (
                                <img src={profileImage} className="w-full h-full object-cover" alt="Profile" />
                            ) : (
                                <User size={48} className="text-gray-500" />
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 p-2.5 bg-green-500 rounded-full border-4 border-[#1e2230] cursor-pointer hover:bg-green-400 transition-all shadow-lg active:scale-90">
                            <Camera size={14} className="text-white font-black" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    </div>

                    <div className="flex flex-col items-center">
                        {isEditing ? (
                            <div className="flex gap-2 mb-2">
                                <input
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="bg-gray-800 border-none rounded-lg px-3 py-1 text-white text-center font-bold focus:ring-2 ring-green-500 outline-none"
                                    autoFocus
                                    onBlur={() => setIsEditing(false)}
                                    onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userName}</h2>
                                <button onClick={() => setIsEditing(true)} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                                    <Edit size={16} className="text-gray-500" />
                                </button>
                            </div>
                        )}
                        {isOwner && (
                            <p
                                onClick={handleIdClick}
                                className="text-[11px] text-gray-500 font-mono tracking-tighter opacity-60 cursor-pointer active:opacity-100 transition-opacity"
                            >
                                ID: {userId}
                            </p>
                        )}
                    </div>
                </div>

                {/* Monetization Section */}
                {!isOwner && (
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Support & Rewards</h3>
                        <div className={`${isDarkMode ? 'bg-[#1e2230]' : 'bg-white'} rounded-[24px] border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-100'} overflow-hidden shadow-xl`}>
                            <ProfileAction
                                icon={PlayCircle}
                                label="Watch Ad"
                                sub="Support Developer"
                                iconColor="text-yellow-500"
                                isDarkMode={isDarkMode}
                                onClick={handleWatchAd}
                            />
                        </div>
                    </div>
                )}

                {/* App Settings Section */}
                <div className="space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">App Settings</h3>
                    <div className={`${isDarkMode ? 'bg-[#1e2230]' : 'bg-white'} rounded-[24px] border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-100'} overflow-hidden shadow-xl divide-y ${isDarkMode ? 'divide-gray-800' : 'divide-gray-50'}`}>
                        <div className="flex justify-between items-center p-4">
                            <div className="flex items-center space-x-4">
                                <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-[#2a2f3e]' : 'bg-gray-100'}`}>
                                    {isDarkMode ? <Moon size={20} className="text-indigo-400" /> : <Sun size={20} className="text-yellow-500" />}
                                </div>
                                <span className={`text-[15px] font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dark Mode</span>
                            </div>
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className={`w-12 h-6.5 rounded-full p-1 transition-all duration-500 ${isDarkMode ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transition-transform duration-500 ${isDarkMode ? 'translate-x-5.5' : ''}`} />
                            </button>
                        </div>
                        <ProfileAction icon={Share2} label="Share App" sub="Invite Friends" isDarkMode={isDarkMode} iconColor="text-blue-400" onClick={handleShare} />
                        <ProfileAction icon={Download} label="Download All Data" sub="Export as JSON" isDarkMode={isDarkMode} iconColor="text-gray-400" onClick={handleDownloadData} />
                    </div>
                </div>

                {/* Admin Section (Hidden by default) */}
                {isAdminVisible && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 ml-2">Admin Settings</h2>
                        <div className={`${isDarkMode ? 'bg-[#1e2230]' : 'bg-white'} rounded-[24px] border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-100'} overflow-hidden shadow-xl`}>
                            <ProfileAction
                                icon={ShieldCheck}
                                label="Admin Panel"
                                sub="Management & Stats"
                                isDarkMode={isDarkMode}
                                iconColor="text-indigo-400"
                                onClick={() => setCurrentScreen('admin')}
                            />
                        </div>
                    </div>
                )}

                {/* Information Section */}
                <div className="space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Information</h3>
                    <div className={`${isDarkMode ? 'bg-[#1e2230]' : 'bg-white'} rounded-[24px] border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-100'} overflow-hidden shadow-xl divide-y ${isDarkMode ? 'divide-gray-800' : 'divide-gray-50'}`}>
                        <ProfileAction
                            icon={ShieldCheck}
                            label="Privacy Policy"
                            isDarkMode={isDarkMode}
                            onClick={() => setModalInfo({
                                title: "Privacy Policy",
                                content: "Your data is stored locally on your device and optionally synced to your private Firebase container. We do not sell your trading data to third parties."
                            })}
                        />
                        <ProfileAction
                            icon={FileCheck}
                            label="Terms & Conditions"
                            isDarkMode={isDarkMode}
                            onClick={() => setModalInfo({
                                title: "Terms & Conditions",
                                content: "By using Trade Journal Pro, you agree that trading carries risk and you are solely responsible for your financial decisions. The AI coach provides suggestions, not financial advice."
                            })}
                        />
                        <ProfileAction
                            icon={Info}
                            label="About Trade Journal"
                            isDarkMode={isDarkMode}
                            onClick={() => setModalInfo({
                                title: "About Trade Journal",
                                content: "Trade Journal Pro is built for traders by traders. Our mission is to provide the best tools for performance tracking and psychological analysis."
                            })}
                        />
                        <ProfileAction
                            icon={HelpCircle}
                            label="Help Center"
                            sub="AI Support Agent"
                            isDarkMode={isDarkMode}
                            onClick={() => setShowSupportChat(true)}
                        />
                    </div>
                </div>

                <div className="pt-4 pb-4">
                    <button
                        onClick={async () => {
                            if (!auth) return;
                            try {
                                await signOut(auth);
                                // window.location.reload(); // Optional, App.tsx should handle auth state change
                            } catch (error) {
                                console.error("Error signing out: ", error);
                            }
                        }}
                        className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black transition-all active:scale-95 ${isDarkMode ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                    >
                        <LogOut size={20} />
                        SIGN OUT
                    </button>
                </div>

                <div className="pt-2 text-center">
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">Trade Journal Pro v2.5.0</p>
                </div>
            </div>

            {/* Ad Player Overlay */}
            {isWatchingAd && (
                <AdOverlay
                    title="Supporting Developer"
                    unitId={AD_UNITS.REWARDED}
                    type="rewarded"
                    onClose={() => {
                        setIsWatchingAd(false);
                        setModalInfo({
                            title: "Reward Earned!",
                            content: "Thank you for supporting the developer. You've earned a 'Supporter' badge (conceptually)!"
                        });
                    }}
                />
            )}

            {/* Info Modal */}
            <InfoModal
                isOpen={!!modalInfo}
                onClose={() => setModalInfo(null)}
                title={modalInfo?.title || ''}
                content={modalInfo?.content || ''}
                isDarkMode={isDarkMode}
            />

            {/* Support Chat Modal */}
            <SupportChatModal
                isOpen={showSupportChat}
                onClose={() => setShowSupportChat(false)}
                isDarkMode={isDarkMode}
                theme={theme}
            />
        </div>
    );
};
