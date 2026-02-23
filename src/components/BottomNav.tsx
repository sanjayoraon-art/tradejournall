import React from 'react';
import { Home, BarChart, User, TrendingUp, Brain } from 'lucide-react';

interface BottomNavProps {
    theme: any;
    currentScreen: string;
    setCurrentScreen: (screen: string) => void;
    isChatOpen: boolean;
    setIsChatOpen: (isOpen: boolean) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ theme, currentScreen, setCurrentScreen, isChatOpen, setIsChatOpen }) => {
    const navItems = [
        { name: 'Home', icon: Home, screen: 'Dashboard', type: 'screen' },
        { name: 'Trades', icon: BarChart, screen: 'TradeList', type: 'screen' },
        { name: 'AI Coach', icon: Brain, screen: 'AICoach', type: 'ai' },
        { name: 'Stats', icon: TrendingUp, screen: 'PerformanceMetrics', type: 'screen' },
        { name: 'Profile', icon: User, screen: 'Profile', type: 'screen' }
    ];

    return (
        <nav className={`w-full border-t shadow-xl p-2 z-10 ${theme.nav}`}>
            <div className="flex justify-around items-center max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive = item.type === 'ai' ? isChatOpen : (currentScreen === item.screen && !isChatOpen);
                    return (
                        <div
                            key={item.name}
                            className="flex flex-col items-center cursor-pointer p-1 min-w-[60px]"
                            onClick={() => {
                                if (item.type === 'ai') {
                                    setIsChatOpen(true);
                                } else {
                                    setIsChatOpen(false);
                                    setCurrentScreen(item.screen);
                                }
                            }}
                        >
                            <item.icon size={22} className={isActive ? 'text-green-500' : 'text-gray-400'} />
                            <span className={`text-[10px] mt-1 ${isActive ? 'text-green-500' : 'text-gray-400'}`}>{item.name}</span>
                        </div>
                    );
                })}
            </div>
        </nav>
    );
};
