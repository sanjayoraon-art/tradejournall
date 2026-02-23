import React, { useState, useEffect } from 'react';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { auth } from '../utils/firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithRedirect,
    signInWithPopup,
    getRedirectResult,
    signInWithCredential,
    sendPasswordResetEmail
} from 'firebase/auth';

interface LoginScreenProps {
    theme: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ theme }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetSent, setResetSent] = useState(false);

    useEffect(() => {
        const checkRedirect = async () => {
            if (!auth) return;
            try {
                const result = await getRedirectResult(auth);
                console.log("Redirect Result:", result); // Debugging log
                if (result && result.user) {
                    console.log("User from redirect:", result.user.email);
                    if (result.user.email) setEmail(result.user.email);
                }
            } catch (err: any) {
                console.error("Redirect Auth Error:", err);
                if (err.customData && err.customData.email) {
                    setEmail(err.customData.email);
                }

                let msg = "Google sign-in failed.";
                if (err.code === 'auth/account-exists-with-different-credential') {
                    msg = "Account exists with different credentials. Please use your password.";
                }
                if (err.code === 'auth/popup-blocked') msg = "Popup was blocked by the browser. Please allow popups.";
                if (err.code === 'auth/popup-closed-by-user') msg = "Sign-in popup was closed before completing.";
                if (err.code === 'auth/operation-not-allowed') msg = "Google sign-in is not enabled in Firebase Console.";
                setError(msg);
            }
        };
        checkRedirect();
    }, []);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!auth) {
            setError("Firebase configuration is missing. Please check your .env file or environment variables.");
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (err: any) {
            console.error("Auth Error:", err);
            let msg = "An error occurred: " + err.message;
            if (err.code === 'auth/invalid-credential') {
                msg = isLogin
                    ? "Invalid email or password. If you haven't created an account yet, please switch to 'Create Account Mode' below."
                    : "Invalid email or password.";
            }
            if (err.code === 'auth/email-already-in-use') msg = "This email is already registered. Please switch to 'Sign In Mode' above.";
            if (err.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";
            if (err.code === 'auth/operation-not-allowed') msg = "Email/Password sign-in is not enabled in Firebase Console.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!email) {
            setError("Please enter your email address first.");
            return;
        }
        setError('');
        setLoading(true);
        setResetSent(false);

        try {
            await sendPasswordResetEmail(auth!, email);
            setResetSent(true);
        } catch (err: any) {
            console.error("Reset Error:", err);
            setError("Failed to send reset email. " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);

        if (!auth) {
            setError("Firebase configuration is missing. Please check your .env file.");
            setLoading(false);
            return;
        }

        try {
            if (Capacitor.isNativePlatform()) {
                // Native Google Login
                console.log("[AUTH] Starting Native Google Sign-In");
                const result = await FirebaseAuthentication.signInWithGoogle();
                console.log("[AUTH] Native result received:", !!result.credential);

                if (result.credential) {
                    const credential = GoogleAuthProvider.credential(result.credential.idToken);
                    await signInWithCredential(auth, credential);
                } else {
                    throw new Error("No credential received from Google Sign-In");
                }
            } else {
                // Web Google Login
                const provider = new GoogleAuthProvider();
                await signInWithPopup(auth, provider);
            }
            // Result handled by onAuthStateChanged in App.tsx
        } catch (err: any) {
            console.error("Google Auth Error:", err);
            let msg = "Google sign-in failed: " + (err.message || "Unknown error");
            if (err.code) msg += ` (Code: ${err.code})`;

            if (err.code === 'auth/operation-not-allowed') msg = "Google sign-in is not enabled in Firebase Console.";
            if (err.code === 'auth/popup-blocked') msg = "Popup was blocked. Please allow popups for this site.";
            if (err.code === 'auth/popup-closed-by-user') msg = "Sign-in cancelled.";

            // Helpful tip for developer error 10
            if (err.message && err.message.includes("10")) {
                msg = "Google Error 10: This usually means the SHA-1 key in Firebase Console is missing or incorrect.";
            }

            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`h-full w-full overflow-y-auto ${theme.bg} ${theme.text} flex items-center justify-center p-4`}>
            <div className={`${theme.card} border ${theme.border} w-full max-w-md p-8 rounded-3xl shadow-2xl`}>
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black mb-2 tracking-tight">Trade Journal</h1>
                    <p className={`${theme.subtext} font-bold text-blue-500 uppercase tracking-widest text-xs mb-2`}>
                        {isLogin ? 'Sign In Mode' : 'Create Account Mode'}
                    </p>
                    <p className={`${theme.subtext} font-medium`}>Your personal trading companion</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center font-bold">
                        {error}
                    </div>
                )}

                {resetSent && (
                    <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/50 text-green-500 text-sm text-center font-bold">
                        Password reset link sent to your email!
                    </div>
                )}

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className={`w-full ${theme.bg} border ${theme.border} hover:bg-gray-700/50 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 mb-8`}
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Continue with Google
                </button>

                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className={`w-full border-t ${theme.border}`}></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className={`px-4 ${theme.card} ${theme.subtext} font-bold`}>OR</span>
                    </div>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div className="relative">
                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.subtext}`} />
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full bg-black/20 border ${theme.border} focus:border-blue-500 rounded-xl py-4 pl-12 pr-4 outline-none transition-all font-medium`}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.subtext}`} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full bg-black/20 border ${theme.border} focus:border-blue-500 rounded-xl py-4 pl-12 pr-4 outline-none transition-all font-medium`}
                            required
                        />
                    </div>

                    {isLogin && (
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleResetPassword}
                                className={`${theme.subtext} hover:text-white text-xs font-bold transition-colors`}
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </form>

                <div className="mt-8 text-center bg-blue-500/5 p-4 rounded-2xl border border-blue-500/20">
                    <p className={`${theme.subtext} text-xs mb-2 font-bold uppercase tracking-wider`}>
                        {isLogin ? "New to Trade Journal?" : "Already have an account?"}
                    </p>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-500 hover:text-blue-400 text-sm font-black transition-colors underline decoration-2 underline-offset-4"
                    >
                        {isLogin ? "SWITCH TO CREATE ACCOUNT MODE" : "SWITCH TO SIGN IN MODE"}
                    </button>
                </div>
            </div>
        </div>
    );
};
