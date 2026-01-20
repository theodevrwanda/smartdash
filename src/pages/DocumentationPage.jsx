import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Check, Mail, Building2, User2,
    Code2, Shield, Rocket, MessageSquare, Globe
} from 'lucide-react';

const DocumentationPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Header / Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/smartstock.png" alt="Logo" className="w-8 h-8 object-contain" />
                        <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight hidden sm:block">SmartStock Docs</span>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Login
                    </button>
                </div>
            </nav>

            <main className="pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-6">
                <div className="max-w-4xl mx-auto space-y-16 md:space-y-24">

                    {/* Hero Section */}
                    <section className="text-center space-y-4 md:space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-2 md:mb-4">
                            <Rocket size={14} /> Documentation
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight px-2">
                            SmartDash: The Control <br className="hidden sm:block" /> Center for <span className="text-indigo-600">SmartStock</span>
                        </h1>
                        <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
                            SmartDash is an advanced administrative infrastructure designed to empower system administrators
                            and collaborators with complete control over the SmartStock ecosystem.
                        </p>
                    </section>

                    {/* Features Grid */}
                    <section className="grid sm:grid-cols-2 gap-4 md:gap-8">
                        <div className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 group hover:border-indigo-500/30 transition-all duration-500">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                                <Shield size={20} />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3">Administrative Engine</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                                Manage business registrations, approve subscriptions, and monitor real-time transactions
                                across the entire SmartStock platform.
                            </p>
                        </div>
                        <div className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 group hover:border-emerald-500/30 transition-all duration-500">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl md:rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                                <User2 size={20} />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3">Collaboration Access</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                                Join our team as a system collaborator or regional administrator to help manage
                                and grow the SmartStock business network.
                            </p>
                        </div>
                    </section>

                    {/* Author & Company Section */}
                    <section className="rounded-3xl md:rounded-[40px] bg-slate-900 dark:bg-white p-6 md:p-12 text-white dark:text-slate-900 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-16 md:-mr-32 -mt-16 md:-mt-32"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left">
                            <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl md:rounded-[32px] overflow-hidden border-4 border-white/10 dark:border-slate-900/10 shadow-2xl flex-shrink-0">
                                <img src="/theodev.png" alt="Theodev" className="w-full h-full object-cover" />
                            </div>
                            <div className="space-y-4 md:space-y-6 w-full">
                                <div className="space-y-1 md:space-y-2">
                                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white dark:text-slate-900">Theodev</h2>
                                    <p className="text-indigo-300 dark:text-indigo-600 font-bold uppercase tracking-widest text-[10px] md:text-sm flex items-center justify-center md:justify-start gap-2">
                                        <Building2 size={14} /> RwandaScratch
                                    </p>
                                </div>
                                <div className="space-y-2 md:space-y-4 text-xs md:text-base">
                                    <div className="flex items-center justify-center md:justify-start gap-3 text-slate-300 dark:text-slate-600">
                                        <Mail size={16} className="text-indigo-400" />
                                        <span className="truncate max-w-[200px] sm:max-w-none">theodevrwanda@gmail.com</span>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-3 text-slate-300 dark:text-slate-600">
                                        <Globe size={16} className="text-indigo-400" />
                                        <span>Rwanda, Kigali</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => window.open('https://wa.me/250792734752?text=Hello,%20I%20want%20to%20apply%20as%20a%20collaborator%20for%20SmartDash.', '_blank')}
                                    className="w-full md:w-auto px-6 md:px-8 py-3 bg-indigo-600 text-white dark:bg-slate-900 dark:text-white rounded-full font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                                >
                                    <MessageSquare size={18} /> Apply as Collaborator
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* How to Collaborate */}
                    <section className="space-y-6 md:space-y-8">
                        <div className="text-center px-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Becoming a Collaborator</h2>
                            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-2">Follow these simple steps to join the SmartDash ecosystem.</p>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-4 md:gap-6 px-4 sm:px-0">
                            {[
                                { step: '01', title: 'Request Access', desc: 'Contact our support via WhatsApp or Email expressing your intent.' },
                                { step: '02', title: 'Verification', desc: 'Our team will review your credentials and collaboration request.' },
                                { step: '03', title: 'Onboarding', desc: 'Receive your admin credentials and start managing the ecosystem.' }
                            ].map((item) => (
                                <div key={item.step} className="p-6 rounded-2xl md:rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 md:space-y-4">
                                    <span className="text-3xl md:text-4xl font-black text-slate-100 dark:text-slate-800">{item.step}</span>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm md:text-base">{item.title}</h4>
                                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    © 2026 RwandaScratch. All rights reserved. | Developed with precision for SmartStock.
                </p>
            </footer>
        </div>
    );
};

export default DocumentationPage;
