import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Check, Globe, Mail, Lock, Github, CheckCircle, 
    ArrowRight, MessageSquare, BookOpen, Code2 
} from 'lucide-react';
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

    useEffect(() => {
        if (user && !authLoading) {
            navigate('/dashboard');
        }
    }, [user, authLoading, navigate]);

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
        <div className="min-h-screen w-full flex font-sans bg-white dark:bg-slate-950">
            
            {/* Left Panel - Green Section */}
            <div className="hidden lg:flex w-5/12 bg-[#2ea043] flex-col justify-between p-12 text-white relative overflow-hidden">
                {/* Pattern Overlay (Subtle) */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                
                {/* Header/Logo Area */}
                <div className="z-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
                        <Code2 className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">SmartDash</span>
                </div>

                {/* Central Illustration Area */}
                <div className="z-10 flex-1 flex items-center justify-center py-12">
                    <div className="relative w-full max-w-md">
                        {/* Abstract Laptop/Dashboard representation */}
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500 shadow-2xl">
                            <div className="flex gap-4 mb-4">
                                <div className="w-1/3 h-24 bg-white/20 rounded-lg animate-pulse"></div>
                                <div className="w-2/3 h-24 bg-white/20 rounded-lg"></div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                                <div className="h-4 bg-white/10 rounded w-1/2"></div>
                                <div className="h-4 bg-white/10 rounded w-5/6"></div>
                            </div>
                            
                            {/* Floating Elements */}
                            <div className="absolute -right-8 -top-8 bg-green-500 p-4 rounded-xl shadow-lg border border-white/20 animate-bounce delay-700">
                                <BookOpen className="text-white" size={24} />
                            </div>
                            <div className="absolute -left-6 bottom-8 bg-blue-500 p-3 rounded-lg shadow-lg border border-white/20 animate-bounce delay-1000">
                                <MessageSquare className="text-white" size={20} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Content */}
                <div className="z-10 space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-light">Documentation</h2>
                        <p className="text-green-50 opacity-90 text-sm leading-relaxed max-w-sm">
                            Explore our guides, references and examples to integrate SmartDash seamlessly.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {[
                            'Interactive tutorials with IDE-like experience',
                            'Guided product walkthroughs',
                            'Easily accessible code samples'
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <Check className="text-white/80" size={18} />
                                <span className="text-sm font-medium">{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4">
                        <button className="flex items-center gap-2 text-sm font-bold hover:gap-3 transition-all">
                            Check it out <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-8 lg:p-12 bg-white dark:bg-slate-950 relative">
                
                {/* Mobile pattern gutter (hidden on large) */}
                <div className="lg:hidden absolute top-0 left-0 w-full h-2 bg-[#2ea043]"></div>

                <div className="w-full max-w-[440px] space-y-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Log in to your account</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Welcome back! Please enter your details.</p>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-5">
                        <div className="space-y-4">
                            {/* Email Input */}
                            <div className="space-y-1.5">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ea043]/20 focus:border-[#2ea043] transition-all text-slate-800 dark:text-white placeholder-slate-400 text-sm"
                                        placeholder="Email"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-1.5">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ea043]/20 focus:border-[#2ea043] transition-all text-slate-800 dark:text-white placeholder-slate-400 text-sm"
                                        placeholder="Password"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium border border-red-100 dark:border-red-900/30 flex items-center gap-2">
                                <CheckCircle className="rotate-45" size={14} />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#2ea043] hover:bg-[#268a39] text-white h-12 rounded-lg font-bold transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                        >
                            {loading ? 'Logging In...' : 'Log In'}
                        </button>

                        <div className="flex flex-col gap-4 text-center text-sm">
                            <p className="text-slate-500 dark:text-slate-400">
                                Don't have an account yet? <button type="button" className="text-[#2ea043] font-bold hover:underline">Register</button>
                            </p>
                            <button type="button" className="text-[#2ea043] font-medium hover:underline text-xs">
                                Forgot your password?
                            </button>
                        </div>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-4 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-medium">Or login with...</span>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button className="flex items-center gap-2 px-6 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-900 shadow-sm">
                            <Github size={20} className="text-slate-800 dark:text-white" />
                            <span className="text-sm font-medium text-slate-700 dark:text-white">Github</span>
                        </button>
                        <button 
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-900 shadow-sm"
                        >
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="G" className="w-5 h-5" />
                            <span className="text-sm font-medium text-slate-700 dark:text-white">Google</span>
                        </button>
                        {/* Microsoft Button - Placeholder */}
                        <button className="flex items-center gap-2 px-6 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-900 shadow-sm">
                             <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoft/microsoft-original.svg" alt="M" className="w-5 h-5" />
                             <span className="text-sm font-medium text-slate-700 dark:text-white">Microsoft</span>
                        </button>
                    </div>
                </div>

                {/* Chat Widget Icon Placeholder */}
                <div className="absolute bottom-6 right-6">
                    <button className="w-12 h-12 bg-[#2ea043] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform">
                        <MessageSquare size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
