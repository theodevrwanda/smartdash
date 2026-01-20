import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Check, Mail, Building2, User2, Github,
    Code2, Shield, Rocket, MessageSquare, Globe, Sun, Moon,
    Calendar
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const DocumentationPage = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [selectedYear, setSelectedYear] = useState('2026');
    const years = ['2026', '2025', '2024', '2023'];

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Header / Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/smartstock.png" alt="Logo" className="w-8 h-8 object-contain" />
                        <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight hidden sm:block">SmartDash Docs</span>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                            <ArrowLeft size={16} /> <span className="hidden xs:block">Back to Login</span>
                        </button>
                    </div>
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
                        <div className="relative z-10 flex flex-col md:flex-row items-start gap-8 md:gap-12">
                            <div className="w-full md:w-auto flex flex-col items-center gap-4">
                                <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl md:rounded-[32px] overflow-hidden border-4 border-white/10 dark:border-slate-900/10 shadow-2xl flex-shrink-0">
                                    <img src="/theodev.png" alt="Theogene Iradukunda" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => window.open('https://github.com/theodevrwanda', '_blank')} className="p-2 bg-white/10 dark:bg-slate-100 rounded-lg hover:bg-white/20 dark:hover:bg-slate-200 transition-colors">
                                        <Github size={18} />
                                    </button>
                                    <button onClick={() => window.open('https://www.linkedin.com/in/theogene-iradukunda-88b07a381/', '_blank')} className="p-2 bg-white/10 dark:bg-slate-100 rounded-lg hover:bg-white/20 dark:hover:bg-slate-200 transition-colors">
                                        <Globe size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-4 md:space-y-6 w-full text-center md:text-left">
                                <div className="space-y-1 md:space-y-2">
                                    <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white dark:text-slate-900 leading-tight">
                                        Theogene Iradukunda
                                    </h2>
                                    <p className="text-indigo-300 dark:text-indigo-600 font-bold uppercase tracking-widest text-[10px] md:text-sm flex items-center justify-center md:justify-start gap-2">
                                        <Building2 size={14} /> Founder & CEO, RwandaScratch
                                    </p>
                                </div>

                                <p className="text-slate-300 dark:text-slate-600 text-sm md:text-base leading-relaxed max-w-2xl">
                                    Full-Stack Developer & Graphic Designer based in Kigali, Rwanda. Passionate about tech,
                                    I build innovative software solutions at Rwandascratch while exploring creative tech,
                                    UI/UX design, and complex web architectures.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
                                    <div className="flex items-center justify-center md:justify-start gap-3 text-slate-300 dark:text-slate-600">
                                        <Mail size={16} className="text-indigo-400 flex-shrink-0" />
                                        <span className="truncate">theodevrwanda@gmail.com</span>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-3 text-slate-300 dark:text-slate-600">
                                        <MessageSquare size={16} className="text-indigo-400 flex-shrink-0" />
                                        <span>+250 792 734 752</span>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-3 text-slate-300 dark:text-slate-600">
                                        <Globe size={16} className="text-indigo-400 flex-shrink-0" />
                                        <span>theodevrw.netlify.app</span>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-3 text-slate-300 dark:text-slate-600">
                                        <Shield size={16} className="text-indigo-400 flex-shrink-0" />
                                        <span>Kigali, Rwanda</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                                    <button
                                        onClick={() => window.open('https://wa.me/250792734752?text=Hello%20Theogene,%20I%20would%20like%20to%20discuss%20a%20project.', '_blank')}
                                        className="px-6 py-2.5 bg-indigo-600 text-white dark:bg-slate-900 dark:text-white rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-indigo-500/20 text-xs"
                                    >
                                        Let's Talk
                                    </button>
                                    <button
                                        onClick={() => window.open('https://buymeacoffee.com/theodevrwanda', '_blank')}
                                        className="px-6 py-2.5 bg-[#FFDD00] text-black rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 text-xs"
                                    >
                                        ☕ Buy coffee
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Tech Stack Section */}
                    <section className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Technical Expertise</h2>
                            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-2">The modern technologies I use to build scaleable digital products.</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    cat: 'Frontend',
                                    techs: ['React', 'TypeScript', 'Next.js', 'Angular', 'TailwindCSS', 'MUI', 'Vite'],
                                    color: 'indigo'
                                },
                                {
                                    cat: 'Mobile',
                                    techs: ['React Native', 'Expo', 'Flutter', 'Swift'],
                                    color: 'sky'
                                },
                                {
                                    cat: 'Backend',
                                    techs: ['Node.js', 'Express', 'JWT', 'MongoDB', 'Nodemon'],
                                    color: 'emerald'
                                },
                                {
                                    cat: 'DevOps',
                                    techs: ['Vercel', 'Netlify', 'AWS', 'GitHub Actions', 'Docker'],
                                    color: 'slate'
                                },
                                {
                                    cat: 'Design',
                                    techs: ['Figma', 'Photoshop', 'Canva', 'UI/UX Design'],
                                    color: 'rose'
                                },
                                {
                                    cat: 'Version Control',
                                    techs: ['Git', 'GitHub', 'GitLab'],
                                    color: 'orange'
                                }
                            ].map((group) => (
                                <div key={group.cat} className="p-6 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4 group hover:border-indigo-500/20 transition-all duration-300">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-base md:text-lg flex items-center gap-2">
                                        <div className={`w-1.5 h-6 rounded-full bg-${group.color}-500`}></div>
                                        {group.cat}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {group.techs.map((t) => (
                                            <span key={t} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-medium border border-slate-100 dark:border-slate-700/50">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* GitHub Contributions */}
                    <section className="space-y-6 md:space-y-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                            <div className="text-center md:text-left">
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-3">
                                    <Github className="text-emerald-500" /> Open Source Activity
                                </h2>
                                <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-2">
                                    Development velocity and commits for @theodevrwanda.
                                </p>
                            </div>

                            <div className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                                {years.map(year => (
                                    <button
                                        key={year}
                                        onClick={() => setSelectedYear(year)}
                                        className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${selectedYear === year
                                            ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                            }`}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-8">
                            <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
                                <div className="min-w-[800px]">
                                    <img
                                        src={`https://github-contributions-api.deno.dev/theodevrwanda.svg?year=${selectedYear}&scheme=green&t=${new Date().getTime()}`}
                                        alt={`theodevrwanda's Github Chart for ${selectedYear}`}
                                        className="w-full filter dark:brightness-110 dark:contrast-125 transition-opacity duration-300"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] md:text-xs font-semibold uppercase tracking-wider">
                                <span className="text-slate-400 dark:text-slate-500">Less</span>
                                <div className="flex gap-1.5">
                                    <div className="w-3.5 h-3.5 rounded-sm bg-slate-100 dark:bg-slate-800"></div>
                                    <div className="w-3.5 h-3.5 rounded-sm bg-emerald-200"></div>
                                    <div className="w-3.5 h-3.5 rounded-sm bg-emerald-400"></div>
                                    <div className="w-3.5 h-3.5 rounded-sm bg-emerald-600"></div>
                                    <div className="w-3.5 h-3.5 rounded-sm bg-emerald-800"></div>
                                </div>
                                <span className="text-slate-400 dark:text-slate-500">More</span>
                            </div>

                            {/* GitHub Stats Grid */}
                            <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
                                <img
                                    src="https://github-readme-stats.vercel.app/api?username=theodevrwanda&theme=dark&hide_border=false&include_all_commits=true&count_private=true"
                                    alt="GitHub Stats"
                                    className="w-full rounded-xl shadow-md border border-slate-100 dark:border-slate-800"
                                />
                                <img
                                    src="https://nirzak-streak-stats.vercel.app/?user=theodevrwanda&theme=dark&hide_border=false"
                                    alt="GitHub Streak"
                                    className="w-full rounded-xl shadow-md border border-slate-100 dark:border-slate-800"
                                />
                                <img
                                    src="https://github-readme-stats.vercel.app/api/top-langs/?username=theodevrwanda&theme=dark&hide_border=false&include_all_commits=true&count_private=true&layout=compact"
                                    alt="Top Langs"
                                    className="w-full rounded-xl shadow-md border border-slate-100 dark:border-slate-800"
                                />
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
            <footer className="py-16 border-t border-slate-100 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-900/20">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex flex-wrap justify-center gap-4">
                        {[
                            { label: 'X', color: '000000', link: 'https://x.com/theo_dev_rw', icon: 'x' },
                            { label: 'Instagram', color: 'E4405F', link: 'https://www.instagram.com/theodev.rw/', icon: 'instagram' },
                            { label: 'LinkedIn', color: '0A66C2', link: 'https://www.linkedin.com/in/theogene-iradukunda-88b07a381/', icon: 'linkedin' },
                            { label: 'Gmail', color: 'D14836', link: 'mailto:theodevrwanda@gmail.com', icon: 'gmail' },
                            { label: 'WhatsApp', color: '25D366', link: 'https://wa.me/250792734752', icon: 'whatsapp' }
                        ].map(social => (
                            <button
                                key={social.label}
                                onClick={() => window.open(social.link, '_blank')}
                                className="group flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-500 transition-all shadow-sm"
                            >
                                <img src={`https://img.icons8.com/ios-filled/24/${social.color === '000000' ? '6366f1' : social.color}/${social.icon}.png`} className="w-4 h-4" alt={social.label} />
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">{social.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="text-center space-y-2">
                        <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
                            © 2026 RwandaScratch. All rights reserved.
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                            Developed with precision by Theogene Iradukunda for SmartDash. Passionate about empowering business through technology.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default DocumentationPage;
