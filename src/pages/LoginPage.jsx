import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Mail, Lock, Check } from 'lucide-react';
import { auth } from '../firebase/config';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';

import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (user && !authLoading) {
            navigate('/dashboard');
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate('/dashboard');
        } catch (err) {
            console.error('Google Sign-in Error:', err);
            setError('Failed to continue with Google.');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch (err) {
            console.error('Email Sign-in Error:', err);
            setError('Failed to sign in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] dark:bg-slate-950 relative overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">

            {/* Animated Background Gradients */}
            <div className={`absolute top-0 left-0 w-full h-full overflow-hidden transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-[80px] animate-blob"></div>
                <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-4000"></div>
            </div>

            {/* Language Selector */}
            <div className={`absolute top-6 left-6 z-20 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 text-slate-600 text-sm hover:bg-white/80 transition-all shadow-sm hover:shadow">
                    <Globe size={14} />
                    <span className="font-medium">English</span>
                </button>
            </div>

            {/* Main Card Container */}
            <div className={`w-full max-w-[400px] z-10 p-4 transition-all duration-700 ease-out ${mounted ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>

                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white dark:border-slate-800 rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] p-8 md:p-10 relative overflow-hidden group">

                    {/* Glass Shine Effect */}
                    <div className="absolute top-0 left-0 w-full h-[100%] bg-gradient-to-b from-white/60 to-transparent dark:from-white/5 pointer-events-none"></div>

                    {/* Logo/Header Area */}
                    <div className="relative text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 mb-4 transform transition-transform group-hover:scale-110 duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
                                <path d="M5.26 17.242a.75.75 0 10-.897-1.272A7.795 7.795 0 002.178 20.5a.75.75 0 00.416 1.135 5.86 5.86 0 003.418-.383l7.92-2.822.763-2.617a.75.75 0 10-1.439-.42l-.423 1.453-7.574 2.397z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Welcome back</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Please enter your details to sign in</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleEmailLogin} className="relative space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">Email</label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-blue-500 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white placeholder-slate-400 text-sm font-medium"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wider">Password</label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within/input:text-blue-500 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white placeholder-slate-400 text-sm font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium border border-red-100 dark:border-red-900/30 flex items-center gap-2 animate-pulse">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-blue-400 transition-colors flex items-center justify-center">
                                    {/* Custom checkbox check could go here, relying on default for now or add controlled state */}
                                    <input type="checkbox" className="hidden peer" />
                                    <Check size={10} className="text-blue-600 dark:text-blue-400 opacity-0 peer-checked:opacity-100" />
                                </div>
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-black text-white h-11 rounded-xl font-semibold transition-all shadow-md shadow-slate-900/20 hover:shadow-lg hover:shadow-slate-900/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex py-5 items-center">
                        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                        <span className="flex-shrink-0 mx-3 text-slate-400 font-medium uppercase text-[10px] tracking-widest">Or continue with</span>
                        <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                    </div>

                    {/* Google Button */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 h-11 rounded-xl font-semibold transition-all flex items-center justify-center gap-2.5 shadow-sm hover:shadow hover:-translate-y-0.5"
                    >
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="G" className="w-4 h-4" />
                        <span>Google</span>
                    </button>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-500">
                            Don't have an account? <span className="text-blue-600 font-bold cursor-pointer hover:underline">Create account</span>
                        </p>
                    </div>
                </div>

                {/* Copyright */}
                <div className={`mt-8 text-center transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <p className="text-xs text-slate-400 font-medium opacity-80">© 2026 SmartDash Tech, Inc.</p>
                </div>
            </div>

            {/* Custom Keyframe Animations for Blobs */}
            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
