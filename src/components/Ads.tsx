import React, { useEffect } from 'react';
import { ExternalLink, PlayCircle } from 'lucide-react';
import { AdMob, BannerAdPosition, BannerAdSize, InterstitialAdPluginEvents, RewardAdPluginEvents } from '@capacitor-community/admob';
import { auth } from '../utils/firebase';
import { isAdmin } from '../utils/admin';
import { Capacitor } from '@capacitor/core';

export const AD_UNITS = {
    // Official Google Test IDs for Android
    BANNER: "ca-app-pub-3940256099942544/6300978111",
    INTERSTITIAL: "ca-app-pub-3940256099942544/1033173712",
    REWARDED: "ca-app-pub-3940256099942544/5224354917",
    NATIVE: "ca-app-pub-3940256099942544/2247696110",
    APP_OPEN: "ca-app-pub-3940256099942544/9257395915",

    // [TODO] REPLACE THESE WITH YOUR REAL PRODUCTION IDs FROM ADMOB DASHBOARD
    PRODUCTION_BANNER: "ca-app-pub-3940256099942544/6300978111",
    PRODUCTION_INTERSTITIAL: "ca-app-pub-5245626981758881/6984502596",
    PRODUCTION_REWARDED: "ca-app-pub-5245626981758881/1763965500",
    PRODUCTION_NATIVE: "ca-app-pub-5245626981758881/9882128670",

    IS_TESTING: false // SET TO false WHEN READY FOR PRODUCTION
};

interface BannerAdProps {
    unitId: string;
    className?: string;
    hideFloating?: boolean;
    position?: 'TOP_CENTER' | 'BOTTOM_CENTER' | 'CENTER';
    adSize?: BannerAdSize | string;
}

export const BannerAd: React.FC<BannerAdProps> = ({ unitId, className = "", hideFloating = false, position = 'TOP_CENTER', adSize }) => {
    const userEmail = auth?.currentUser?.email;

    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return;

        const showBanner = async () => {
            try {
                await AdMob.showBanner({
                    adId: AD_UNITS.IS_TESTING ? unitId : (unitId === AD_UNITS.BANNER ? AD_UNITS.PRODUCTION_BANNER : unitId),
                    adSize: (adSize as any) || BannerAdSize.ADAPTIVE_BANNER,
                    position: position === 'TOP_CENTER' ? BannerAdPosition.TOP_CENTER :
                        position === 'BOTTOM_CENTER' ? BannerAdPosition.BOTTOM_CENTER :
                            BannerAdPosition.CENTER,
                    margin: position === 'TOP_CENTER' ? 0 : (position === 'BOTTOM_CENTER' ? 60 : 0),
                    isTesting: AD_UNITS.IS_TESTING
                });
            } catch (e) {
                console.error("Banner Ad Error:", e);
            }
        };

        showBanner();

        return () => {
            if (Capacitor.isNativePlatform()) {
                AdMob.removeBanner();
            }
        };
    }, [unitId, userEmail, position]);

    // On native, library handles the visual element via showBanner overlay
    if (Capacitor.isNativePlatform()) return null;

    // Show placeholder on web
    return (
        <div className={`w-full flex flex-col items-center my-4 ${className}`}>
            <span className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest font-bold">Advertisement (Web Placeholder)</span>
            <div className="w-full h-[50px] bg-gray-800/50 border border-dashed border-gray-600 flex items-center justify-center text-gray-500 text-xs rounded-lg">
                Banner Ad: {unitId}
            </div>
        </div>
    );
};

interface NativeAdPlaceholderProps {
    isDarkMode: boolean;
}

export const NativeAdPlaceholder: React.FC<NativeAdPlaceholderProps> = ({ isDarkMode }) => {
    // If on native, show a real "native-style" banner ad
    if (Capacitor.isNativePlatform() && !AD_UNITS.IS_TESTING) {
        return (
            <div className="w-full flex flex-col items-center my-4 overflow-hidden rounded-xl bg-gray-800/20 border border-gray-700/30">
                <BannerAd unitId={AD_UNITS.PRODUCTION_NATIVE} position="CENTER" adSize={BannerAdSize.MEDIUM_RECTANGLE} />
            </div>
        );
    }

    return (
        <div id="native-ad-container" className={`p-4 rounded-xl border mb-4 ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-600 rounded-lg animate-pulse"></div>
                <div className="flex-1">
                    <div className="h-4 bg-gray-600 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse"></div>
                </div>
                <span className="px-2 py-0.5 text-[10px] bg-yellow-500/20 text-yellow-500 font-bold border border-yellow-500/50 rounded">AD</span>
            </div>
            <div className="h-32 bg-gray-700/50 rounded-lg mb-3 animate-pulse flex items-center justify-center">
                <span className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter">Sponsored Activity</span>
            </div>
            <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold text-sm">Learn More</button>
        </div>
    );
};

interface AdOverlayProps {
    title: string;
    unitId: string;
    type: 'rewarded' | 'interstitial' | string;
    onClose: () => void;
}

export const AdOverlay: React.FC<AdOverlayProps> = ({ title, unitId, type, onClose }) => {
    const userEmail = auth?.currentUser?.email;

    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return;
        if (isAdmin(userEmail)) {
            onClose();
            return;
        }

        let listeners: any[] = [];

        const setupListeners = async () => {
            try {
                const l1 = await AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
                    onClose();
                });
                const l2 = await AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
                    onClose();
                });
                const l3 = await AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, () => {
                    onClose();
                });
                const l4 = await AdMob.addListener(RewardAdPluginEvents.FailedToLoad, () => {
                    onClose();
                });
                listeners = [l1, l2, l3, l4];
            } catch (err) {
                console.error("Error setting up AdMob listeners:", err);
            }
        };

        const showFullscreenAd = async () => {
            try {
                if (type === 'interstitial') {
                    await AdMob.prepareInterstitial({
                        adId: AD_UNITS.IS_TESTING ? unitId : AD_UNITS.PRODUCTION_INTERSTITIAL,
                        isTesting: AD_UNITS.IS_TESTING
                    });
                    await AdMob.showInterstitial();
                } else if (type === 'rewarded') {
                    await AdMob.prepareRewardVideoAd({
                        adId: AD_UNITS.IS_TESTING ? unitId : AD_UNITS.PRODUCTION_REWARDED,
                        isTesting: AD_UNITS.IS_TESTING
                    });
                    await AdMob.showRewardVideoAd();
                }
            } catch (e) {
                console.error("Fullscreen Ad Error:", e);
                onClose(); // Proceed if ad fails
            }
        };

        setupListeners();
        showFullscreenAd();

        return () => {
            listeners.forEach(l => l.remove());
        };
    }, [type, unitId, userEmail, onClose]);

    if (isAdmin(userEmail)) {
        onClose();
        return null;
    }

    // On Web, show the manual close placeholder
    if (!Capacitor.isNativePlatform()) {
        return (
            <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 border border-gray-700">
                    {type === 'rewarded' ? <PlayCircle size={40} className="text-yellow-500" /> : <ExternalLink size={40} className="text-blue-500" />}
                </div>
                <h2 className="text-2xl font-black text-white mb-2">{title}</h2>
                <p className="text-gray-400 text-sm mb-8">Web Placeholder Card for: <br /><span className="text-blue-400 font-mono text-xs">{unitId}</span></p>
                <button onClick={onClose} className="px-10 py-4 bg-white text-black font-black rounded-2xl active:scale-95 transition-all">
                    CLOSE AD (WEB)
                </button>
            </div>
        );
    }

    return null; // On native, library handles the visual overlay
};
