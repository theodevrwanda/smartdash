import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingBag, PieChart, Settings, ArrowRight, ChevronLeft, ChevronRight, X, Building2, CreditCard, MapPin, FileText } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = ({ isDesktopOpen, setIsDesktopOpen, isMobileOpen, setIsMobileOpen }) => {

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', color: 'text-emerald-500', bg: 'bg-emerald-100' },
        { name: 'Businesses', icon: Building2, path: '/accounts', color: 'text-violet-500', bg: 'bg-violet-100' },
        { name: 'Payments', icon: CreditCard, path: '/transactions', color: 'text-blue-500', bg: 'bg-blue-100' },
        { name: 'Branches', icon: MapPin, path: '/branches', color: 'text-amber-500', bg: 'bg-amber-100' },
        { name: 'Users', icon: Users, path: '/employees', color: 'text-rose-500', bg: 'bg-rose-100' },
        { name: 'Audit Logs', icon: FileText, path: '/logs', color: 'text-slate-500', bg: 'bg-slate-100' },
        { name: 'Settings', icon: Settings, path: '/settings', color: 'text-indigo-500', bg: 'bg-indigo-100' },
    ];

    return (
        <>
            {/* Sidebar Container */}
            <div className={clsx(
                "h-screen bg-white fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out border-r border-slate-100 flex flex-col justify-between py-6",
                // Mobile: Translate logic
                isMobileOpen ? "translate-x-0 w-72 shadow-2xl" : "-translate-x-full lg:translate-x-0",
                // Desktop: Width logic based on isDesktopOpen prop
                isDesktopOpen ? "lg:w-72" : "lg:w-20"
            )}>
                {/* Mobile Close Button (Inside Drawer) */}
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                    <X size={20} />
                </button>

                <div>
                    {/* Logo Area & Toggle */}
                    <div className={clsx("flex items-center mb-8 px-6", isDesktopOpen ? "justify-between" : "justify-center")}>
                        {isDesktopOpen && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                    <div className="grid grid-cols-2 gap-1">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-violet-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                    </div>
                                </div>
                                <span className="text-xl font-bold text-slate-800 tracking-tight whitespace-nowrap">SmartDash</span>
                            </div>
                        )}

                        {/* Desktop Collapse Toggle */}
                        <button
                            onClick={() => setIsDesktopOpen(!isDesktopOpen)}
                            className={clsx("hidden lg:flex p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors", !isDesktopOpen && "mx-auto")}
                        >
                            {isDesktopOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-2 px-3">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    clsx(
                                        "flex items-center gap-4 py-3 rounded-full transition-all duration-200 group text-sm font-semibold",
                                        isDesktopOpen ? "px-4" : "justify-center px-0",
                                        isActive
                                            ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    )
                                }
                                onClick={() => setIsMobileOpen(false)}
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className={clsx(
                                            "p-1.5 rounded-full transition-colors flex-shrink-0",
                                            isActive ? "bg-white/20" : item.bg
                                        )}>
                                            <item.icon size={18} className={clsx(isActive ? "text-white" : item.color)} />
                                        </div>

                                        {/* Text Label (Hidden if collapsed) */}
                                        <span className={clsx(
                                            "transition-all duration-300 overflow-hidden whitespace-nowrap",
                                            isDesktopOpen ? "w-auto opacity-100" : "w-0 opacity-0 hidden"
                                        )}>
                                            {item.name}
                                        </span>

                                        {/* Active Dot (Hidden if collapsed) */}
                                        {isActive && isDesktopOpen && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white flex-shrink-0"></div>}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Footer "Down By" */}
                <div className="mt-auto px-4">
                    <NavLink to="/profile" className={clsx(
                        "bg-slate-900 rounded-full flex items-center group cursor-pointer hover:bg-slate-800 transition-all overflow-hidden",
                        isDesktopOpen ? "p-2 pl-4 justify-between" : "p-2 justify-center w-12 h-12 mx-auto"
                    )}>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center text-amber-700 text-xs font-bold flex-shrink-0">
                                A
                            </div>
                            {isDesktopOpen && (
                                <div className="flex flex-col whitespace-nowrap">
                                    <span className="text-xs text-slate-400 font-medium leading-none mb-0.5">DOWN BY</span>
                                    <span className="text-white text-sm font-bold leading-none">Admin User</span>
                                </div>
                            )}
                        </div>
                        {isDesktopOpen && (
                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white/50 group-hover:bg-white/20 group-hover:text-white transition-colors">
                                <ArrowRight size={14} />
                            </div>
                        )}
                </div>
            </div>
        </div >

            {/* Overlay for mobile */ }
    {
        isMobileOpen && (
            <div
                className="fixed inset-0 bg-black/20 z-30 lg:hidden backdrop-blur-sm"
                onClick={() => setIsMobileOpen(false)}
            ></div>
        )
    }
        </>
    );
};

export default Sidebar;
