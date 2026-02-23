import React from 'react';
import { Trash2 } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    isDarkMode: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, isDarkMode }) => {
    if (!isOpen) return null;
    const theme = isDarkMode ? { bg: 'bg-gray-800', text: 'text-gray-100' } : { bg: 'bg-white', text: 'text-gray-900' };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className={`${theme.bg} w-full max-w-sm rounded-xl shadow-2xl overflow-hidden p-6`}>
                <h3 className={`text-xl font-bold ${theme.text} mb-3 flex items-center`}><Trash2 size={24} className="text-red-500 mr-2" /> {title}</h3>
                <p className={`text-sm text-gray-400 mb-6`}>{message}</p>
                <div className="flex gap-3"><button onClick={onClose} className="flex-1 py-2 rounded-lg font-medium text-gray-400 bg-gray-700">Cancel</button><button onClick={onConfirm} className="flex-1 py-2 rounded-lg font-bold bg-red-600 text-white">Confirm</button></div>
            </div>
        </div>
    );
};
