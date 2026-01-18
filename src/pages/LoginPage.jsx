import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate login
        setTimeout(() => {
            setLoading(false);
            navigate('/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#8abbf9] flex flex-col items-center justify-center p-4 font-sans text-slate-900 relative">

            {/* Top Bar (Language) */}
            <div className="absolute top-8 left-8 flex items-center gap-2 text-slate-800">
                <Globe size={18} />
                <span className="font-medium text-sm">English</span>
            </div>

            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-medium text-slate-900 mb-4 tracking-tight">Sign in</h1>
                    <p className="text-slate-700 text-lg">Welcome back to SmartDash.</p>
                </div>

                {/* Google Button - Gamma Style */}
                <button className="w-full bg-[#0e3b8c] hover:bg-[#092a66] text-white font-semibold py-3.5 px-4 rounded-full transition-all flex items-center justify-center gap-3 shadow-md mb-8">
                    <div className="bg-white rounded-full p-1 w-6 h-6 flex items-center justify-center">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="G" className="w-full h-full" />
                    </div>
                    Continue with Google
                </button>

                <div className="relative flex py-2 items-center mb-8">
                    <div className="flex-grow border-t border-slate-700/20"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-700 text-sm font-medium">or</span>
                    <div className="flex-grow border-t border-slate-700/20"></div>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-slate-800 font-medium text-sm ml-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-5 py-3.5 bg-white/40 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e3b8c]/20 focus:border-[#0e3b8c] transition-all text-slate-900 placeholder-slate-600 backdrop-blur-md shadow-sm"
                            placeholder="name@company.com"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-slate-800 font-medium text-sm ml-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-5 py-3.5 bg-white/40 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e3b8c]/20 focus:border-[#0e3b8c] transition-all text-slate-900 placeholder-slate-600 backdrop-blur-md shadow-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-transparent hover:bg-black/5 text-slate-900 font-bold py-3.5 rounded-full transition-all border border-slate-900/10 mt-2"
                    >
                        {loading ? 'Signing in...' : 'Sign in with Email'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-700">
                    Don't have an account? <span className="text-slate-900 font-bold cursor-pointer hover:underline">Sign up</span>
                </div>

                {/* Terms Footer Centered */}
                <div className="mt-12 text-center">
                    <p className="text-xs text-slate-600 opacity-80 max-w-xs mx-auto">
                        By signing in, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
                    </p>
                    <div className="flex justify-center items-center gap-2 mt-6 opacity-70">
                        <span className="font-bold text-slate-900 tracking-tight">SMARTDASH</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
