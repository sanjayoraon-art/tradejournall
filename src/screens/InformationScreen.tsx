import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface InformationScreenProps {
    pageType: 'about' | 'privacy' | 'terms' | 'contact';
    onBack: () => void;
    theme: any;
}

export const InformationScreen: React.FC<InformationScreenProps> = ({ pageType, onBack, theme }) => {

    const content = {
        about: {
            title: "About Us",
            body: (
                <div className="space-y-6">
                    <p>Welcome to <strong>Trade Journal</strong>, your ultimate companion for mastering the financial markets. We built this platform because we understand that profitable trading isn't just about strategy, it's about discipline, record-keeping, and psychology.</p>

                    <h3 className="text-xl font-bold mt-8 mb-4">Our Mission</h3>
                    <p>Our mission is to provide retail and professional traders with institutional-grade analytics, seamless trade-logging, and AI-driven coaching—all wrapped in a secure, privacy-first interface.</p>

                    <h3 className="text-xl font-bold mt-8 mb-4">Why We Built This</h3>
                    <p>Many traders lose money simply because they don't track their past mistakes. By centralizing your trades, evaluating your performance with advanced metrics like Sharpe Ratios and Drawdowns, and monitoring your emotional state, Trade Journal gives you the objective lens required to attain consistent profitability.</p>
                </div>
            )
        },
        privacy: {
            title: "Privacy Policy",
            body: (
                <div className="space-y-6">
                    <p><strong>Last Updated: {new Date().getFullYear()}</strong></p>
                    <p>At Trade Journal, your privacy and data security are our top priorities. This Privacy Policy outlines what information we collect, how it is used, and how it is safeguarded.</p>

                    <h3 className="text-xl font-bold mt-8 mb-4">1. Data Collection</h3>
                    <p>We collect essential information required to operate the application, including your email address (for authentication via Firebase) and the trade data you manually input. We do not link directly to your brokerage accounts; your financial data remains yours to manage.</p>

                    <h3 className="text-xl font-bold mt-8 mb-4">2. Data Storage & Security</h3>
                    <p>Your data is securely stored using Google Firebase databases. We utilize modern encryption standards to protect your trade logs and personal details.</p>

                    <h3 className="text-xl font-bold mt-8 mb-4">3. Local Storage</h3>
                    <p>We use your device's local storage to cache application settings (like theme preferences and base currency) to provide a snappy, seamless user experience.</p>

                    <h3 className="text-xl font-bold mt-8 mb-4">4. Third-Party Services</h3>
                    <p>We may use anonymous analytics to understand how the app is used to improve our services. Our AI coaching features utilize third-party Large Language Models; however, we only transmit the trade context necessary to generate advice, stripped of identifiable personal credentials.</p>
                </div>
            )
        },
        terms: {
            title: "Terms & Conditions",
            body: (
                <div className="space-y-6">
                    <p><strong>Last Updated: {new Date().getFullYear()}</strong></p>
                    <p>Please read these terms and conditions carefully before using the Trade Journal application.</p>

                    <h3 className="text-xl font-bold mt-8 mb-4">1. Acceptance of Terms</h3>
                    <p>By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.</p>

                    <h3 className="text-xl font-bold mt-8 mb-4">2. Not Financial Advice</h3>
                    <p className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400"><strong>DISCLAIMER:</strong> The information provided by the Trade Journal App, including its AI Coach features, is for educational and tracking purposes only. IT DOES NOT CONSTITUTE FINANCIAL, INVESTMENT, OR TRADING ADVICE. You are solely responsible for your trading decisions and any subsequent losses or profits.</p>

                    <h3 className="text-xl font-bold mt-8 mb-4">3. User Responsibilities</h3>
                    <p>You agree to provide accurate information when logging your trades and are responsible for maintaining the confidentiality of your account credentials.</p>

                    <h3 className="text-xl font-bold mt-8 mb-4">4. Service Modifications</h3>
                    <p>We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.</p>
                </div>
            )
        },
        contact: {
            title: "Contact Support",
            body: (
                <div className="space-y-6">
                    <p>Need help, have a feature request, or found a bug? We are here to assist you.</p>

                    <div className={`p-6 rounded-2xl border ${theme.border} ${theme.card} mt-8`}>
                        <h3 className="font-bold text-lg mb-2">Email Support</h3>
                        <p className="text-gray-400 mb-6">Reach out to our dedicated support team directly.</p>
                        <a href="mailto:support@tradejournal.app" className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors">
                            support@tradejournal.app
                        </a>
                    </div>

                    <div className={`p-6 rounded-2xl border ${theme.border} ${theme.card} mt-4`}>
                        <h3 className="font-bold text-lg mb-2">Community</h3>
                        <p className="text-gray-400">Join our growing community of traders on social media to share strategies and tips.</p>
                    </div>
                </div>
            )
        }
    };

    const currentContent = content[pageType];

    return (
        <div className={`min-h-screen w-full flex flex-col ${theme.bg} ${theme.text}`}>
            {/* Header */}
            <header className={`${theme.card} border-b ${theme.border} p-4 flex items-center justify-between sticky top-0 z-50`}>
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 hover:bg-gray-700/50 rounded-xl transition-colors text-gray-400 hover:text-white">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-bold tracking-tight">{currentContent.title}</h1>
                </div>
            </header>

            {/* Content Body */}
            <main className="flex-1 w-full max-w-3xl mx-auto p-6 md:p-10 leading-relaxed text-gray-300 pb-24">
                {currentContent.body}
            </main>
        </div>
    );
};
