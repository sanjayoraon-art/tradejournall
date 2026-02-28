import React, { useState, useEffect } from 'react';
import { Globe, Search, X, Check } from 'lucide-react';

const LANGUAGES = [
    { code: 'af', name: 'Afrikaans' }, { code: 'sq', name: 'Albanian' }, { code: 'am', name: 'Amharic' },
    { code: 'ar', name: 'Arabic' }, { code: 'hy', name: 'Armenian' }, { code: 'az', name: 'Azerbaijani' },
    { code: 'eu', name: 'Basque' }, { code: 'be', name: 'Belarusian' }, { code: 'bn', name: 'Bengali' },
    { code: 'bs', name: 'Bosnian' }, { code: 'bg', name: 'Bulgarian' }, { code: 'ca', name: 'Catalan' },
    { code: 'ceb', name: 'Cebuano' }, { code: 'ny', name: 'Chichewa' }, { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'zh-TW', name: 'Chinese (Traditional)' }, { code: 'co', name: 'Corsican' }, { code: 'hr', name: 'Croatian' },
    { code: 'cs', name: 'Czech' }, { code: 'da', name: 'Danish' }, { code: 'nl', name: 'Dutch' },
    { code: 'en', name: 'English' }, { code: 'eo', name: 'Esperanto' }, { code: 'et', name: 'Estonian' },
    { code: 'tl', name: 'Filipino' }, { code: 'fi', name: 'Finnish' }, { code: 'fr', name: 'French' },
    { code: 'fy', name: 'Frisian' }, { code: 'gl', name: 'Galician' }, { code: 'ka', name: 'Georgian' },
    { code: 'de', name: 'German' }, { code: 'el', name: 'Greek' }, { code: 'gu', name: 'Gujarati' },
    { code: 'ht', name: 'Haitian Creole' }, { code: 'ha', name: 'Hausa' }, { code: 'haw', name: 'Hawaiian' },
    { code: 'iw', name: 'Hebrew' }, { code: 'hi', name: 'Hindi' }, { code: 'hmn', name: 'Hmong' },
    { code: 'hu', name: 'Hungarian' }, { code: 'is', name: 'Icelandic' }, { code: 'ig', name: 'Igbo' },
    { code: 'id', name: 'Indonesian' }, { code: 'ga', name: 'Irish' }, { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' }, { code: 'jw', name: 'Javanese' }, { code: 'kn', name: 'Kannada' },
    { code: 'kk', name: 'Kazakh' }, { code: 'km', name: 'Khmer' }, { code: 'ko', name: 'Korean' },
    { code: 'ku', name: 'Kurdish (Kurmanji)' }, { code: 'ky', name: 'Kyrgyz' }, { code: 'lo', name: 'Lao' },
    { code: 'la', name: 'Latin' }, { code: 'lv', name: 'Latvian' }, { code: 'lt', name: 'Lithuanian' },
    { code: 'lb', name: 'Luxembourgish' }, { code: 'mk', name: 'Macedonian' }, { code: 'mg', name: 'Malagasy' },
    { code: 'ms', name: 'Malay' }, { code: 'ml', name: 'Malayalam' }, { code: 'mt', name: 'Maltese' },
    { code: 'mi', name: 'Maori' }, { code: 'mr', name: 'Marathi' }, { code: 'mn', name: 'Mongolian' },
    { code: 'my', name: 'Myanmar (Burmese)' }, { code: 'ne', name: 'Nepali' }, { code: 'no', name: 'Norwegian' },
    { code: 'ps', name: 'Pashto' }, { code: 'fa', name: 'Persian' }, { code: 'pl', name: 'Polish' },
    { code: 'pt', name: 'Portuguese' }, { code: 'pa', name: 'Punjabi' }, { code: 'ro', name: 'Romanian' },
    { code: 'ru', name: 'Russian' }, { code: 'sm', name: 'Samoan' }, { code: 'gd', name: 'Scots Gaelic' },
    { code: 'sr', name: 'Serbian' }, { code: 'st', name: 'Sesotho' }, { code: 'sn', name: 'Shona' },
    { code: 'sd', name: 'Sindhi' }, { code: 'si', name: 'Sinhala' }, { code: 'sk', name: 'Slovak' },
    { code: 'sl', name: 'Slovenian' }, { code: 'so', name: 'Somali' }, { code: 'es', name: 'Spanish' },
    { code: 'su', name: 'Sundanese' }, { code: 'sw', name: 'Swahili' }, { code: 'sv', name: 'Swedish' },
    { code: 'tg', name: 'Tajik' }, { code: 'ta', name: 'Tamil' }, { code: 'te', name: 'Telugu' },
    { code: 'th', name: 'Thai' }, { code: 'tr', name: 'Turkish' }, { code: 'uk', name: 'Ukrainian' },
    { code: 'ur', name: 'Urdu' }, { code: 'uz', name: 'Uzbek' }, { code: 'vi', name: 'Vietnamese' },
    { code: 'cy', name: 'Welsh' }, { code: 'xh', name: 'Xhosa' }, { code: 'yi', name: 'Yiddish' },
    { code: 'yo', name: 'Yoruba' }, { code: 'zu', name: 'Zulu' }
];

interface LanguageSelectorProps {
    isDarkMode?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isDarkMode = true }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedLang, setSelectedLang] = useState('en');

    useEffect(() => {
        // Try to get current language from Google Translate cookie or select element if it exists
        const match = document.cookie.match(/(^|;\s*)googtrans=([^;]+)/);
        if (match && match[2]) {
            const parts = decodeURIComponent(match[2]).split('/');
            if (parts.length > 2 && parts[2]) {
                setSelectedLang(parts[2]);
            }
        }
    }, []);

    const changeLanguage = (code: string) => {
        setSelectedLang(code);
        setIsOpen(false);

        // Find the hidden google translate select and change its value
        const comboElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (comboElement) {
            comboElement.value = code;
            comboElement.dispatchEvent(new Event('change'));
        } else {
            // Fallback: Set cookie and reload if select isn't available immediately
            const domain = window.location.hostname;
            document.cookie = `googtrans=/en/${code}; path=/; domain=${domain}`;
            document.cookie = `googtrans=/en/${code}; path=/;`; // also without domain
            window.location.reload();
        }
    };

    const filteredLangs = LANGUAGES.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.code.toLowerCase().includes(search.toLowerCase()));

    const currentLangName = LANGUAGES.find(l => l.code === selectedLang)?.name || 'Language';

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(true)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all active:scale-95 ${isDarkMode
                        ? 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
            >
                <Globe size={18} />
                <span className="text-sm font-bold hidden md:inline">{currentLangName}</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    ></div>

                    {/* Modal */}
                    <div className={`relative w-full max-w-md max-h-[80vh] flex flex-col rounded-[24px] border shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-[#1e2230] border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
                        }`}>

                        {/* Header */}
                        <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-500'}`}>
                                    <Globe size={20} />
                                </div>
                                <h2 className="text-lg font-black">Select Language</h2>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                            >
                                <X size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-800 bg-[#2a2f3e]/30' : 'border-gray-100 bg-gray-50'}`}>
                            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border ${isDarkMode ? 'bg-gray-900/50 border-gray-700 focus-within:border-indigo-500/50' : 'bg-white border-gray-200 focus-within:border-indigo-500'
                                }`}>
                                <Search size={18} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                                <input
                                    type="text"
                                    placeholder="Search language..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-transparent border-none outline-none w-full text-sm font-medium placeholder:text-gray-500"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-600 space-y-1">
                            {filteredLangs.length === 0 ? (
                                <div className="text-center py-10 opacity-50">
                                    <p className="text-sm font-bold">No languages found</p>
                                </div>
                            ) : (
                                filteredLangs.map((lang) => {
                                    const isSelected = selectedLang === lang.code;
                                    return (
                                        <button
                                            key={lang.code}
                                            onClick={() => changeLanguage(lang.code)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isSelected
                                                    ? (isDarkMode ? 'bg-indigo-500/20 text-indigo-400 font-bold' : 'bg-indigo-50 text-indigo-600 font-bold')
                                                    : (isDarkMode ? 'hover:bg-gray-800/50 text-gray-300' : 'hover:bg-gray-50 text-gray-700')
                                                }`}
                                        >
                                            <span>{lang.name}</span>
                                            {isSelected && <Check size={18} />}
                                        </button>
                                    );
                                })
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};
