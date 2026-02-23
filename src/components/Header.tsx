import React from 'react';
import { ArrowLeft, TrendingUp, Trash2 } from 'lucide-react';

interface HeaderProps {
    title: string;
    theme: any;
    isChatOpen: boolean;
    setIsChatOpen: (isOpen: boolean) => void;
    setCurrentScreen: (screen: string) => void;
    onClearChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, theme, isChatOpen, setIsChatOpen, setCurrentScreen, onClearChat }) => (
    <header className={`sticky top-0 z-20 flex justify-between items-center p-4 border-b ${theme.header}`}>
        <div className="flex items-center space-x-3">
            {(title !== 'Dashboard' || isChatOpen) && (
                <ArrowLeft
                    size={24}
                    className={`${theme.text} cursor-pointer`}
                    onClick={() => { if (isChatOpen) setIsChatOpen(false); else setCurrentScreen('Dashboard'); }}
                />
            )}
            {title === 'Dashboard' && !isChatOpen ? (
                <div className="flex items-center space-x-3">
                    <h1 className={`text-xl font-bold ${theme.text} tracking-tight`}>Trade Journal</h1>
                </div>
            ) : <h1 className={`text-xl font-bold ${theme.text}`}>{isChatOpen ? 'AI Coach' : (title === 'RiskReward' ? 'Risk Calculator' : title)}</h1>}
        </div>
        {isChatOpen && (
            <button onClick={onClearChat} className="p-2 hover:bg-red-500/10 rounded-full text-red-400 transition-colors">
                <Trash2 size={20} />
            </button>
        )}
    </header>
);
