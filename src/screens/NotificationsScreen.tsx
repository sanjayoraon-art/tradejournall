import React, { useEffect, useState } from 'react';
import { ArrowLeft, Megaphone, Bell, Check, Clock, Trash2 } from 'lucide-react';
import { db, appId } from '../utils/firebase';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';

interface NotificationsScreenProps {
    theme: any;
    onBack: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ theme, onBack }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [hiddenIds, setHiddenIds] = useState<string[]>([]);

    useEffect(() => {
        // Load hidden messages
        const storedHidden = JSON.parse(localStorage.getItem('hiddenMessages') || '[]');
        setHiddenIds(storedHidden);

        const fetchMessages = async () => {
            if (!db) return;
            try {
                const q = query(collection(db, 'artifacts', appId, 'messages'), orderBy('timestamp', 'desc'), limit(20));
                const snap = await getDocs(q);
                const msgs = snap.docs.map(doc => {
                    const data = doc.data();
                    // Convert timestamp to date if possible
                    let dateStr = 'Just now';
                    if (data.timestamp?.toDate) {
                        dateStr = data.timestamp.toDate().toLocaleDateString();
                    }
                    return { id: doc.id, ...data, dateStr };
                });
                setMessages(msgs);

                // Mark all as read conceptually (store latest ID in local storage)
                if (msgs.length > 0) {
                    localStorage.setItem('lastReadMessageId', msgs[0].id);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    const handleDelete = (id: string) => {
        const newHidden = [...hiddenIds, id];
        setHiddenIds(newHidden);
        localStorage.setItem('hiddenMessages', JSON.stringify(newHidden));
    };

    const visibleMessages = messages.filter(m => !hiddenIds.includes(m.id));

    return (
        <div className="min-h-screen pb-24 animate-in fade-in slide-in-from-right duration-300">
            {/* Header */}
            <header className="px-4 pt-6 pb-4 flex items-center gap-4">
                <button onClick={onBack} className={`p-2 rounded-xl ${theme.card} border ${theme.border} hover:scale-105 active:scale-95 transition-all`}>
                    <ArrowLeft size={24} className={theme.text} />
                </button>
                <h1 className={`text-2xl font-black ${theme.text}`}>Notifications</h1>
            </header>

            <div className="px-4 space-y-4">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto"></div>
                    </div>
                ) : visibleMessages.length === 0 ? (
                    <div className="text-center py-20 opacity-50">
                        <Bell size={48} className="mx-auto mb-4" />
                        <p className="font-bold">No notifications yet</p>
                    </div>
                ) : (
                    visibleMessages.map((msg) => (
                        <div key={msg.id} className={`${theme.card} p-5 rounded-2xl border ${theme.border} relative overflow-hidden group`}>
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>

                            <button
                                onClick={() => handleDelete(msg.id)}
                                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500 shrink-0 mt-1">
                                    <Megaphone size={20} />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className={`font-bold text-lg ${theme.text}`}>{msg.title}</h3>
                                        <span className="text-[10px] text-gray-500 font-bold bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <Clock size={10} />
                                            {msg.dateStr}
                                        </span>
                                    </div>
                                    <p className={`text-sm leading-relaxed ${theme.subtext}`}>
                                        {msg.body}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="px-4 mt-8 pb-8 text-center text-xs text-gray-500">
                <p>Notifications are kept for 30 days.</p>
            </div>
        </div>
    );
};
