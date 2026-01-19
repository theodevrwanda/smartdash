import React, { useState } from 'react';
import { Menu, Moon, Sun, ChevronRight, Home, LogOut, User, ChevronDown, UserCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useLocation, Link } from 'react-router-dom';

const Header = ({ isDesktopSidebarOpen, setIsDesktopSidebarOpen, isMobileSidebarOpen, setIsMobileSidebarOpen }) => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleToggle = () => {
        if (window.innerWidth < 1024) {
            setIsMobileSidebarOpen(!isMobileSidebarOpen);
        } else {
            setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
        }
    };

    const pathnames = location.pathname.split('/').filter((x) => x);

    const getDisplayName = (path) => {
        const names = {
            'dashboard': 'Dashboard',
            'accounts': 'Businesses',
            'transactions': 'Payments',
            'branches': 'Branches',
            'employees': 'Users',
            'logs': 'Audit Logs',
            'settings': 'Settings',
            'profile': 'My Profile'
        };
        return names[path] || path.charAt(0).toUpperCase() + path.slice(1);
    };

    return (
        <header className="h-20 flex items-center justify-between px-8 mb-4">
            <div className="flex items-center gap-4">
                {/* Global Sidebar Toggle Button */}
                <button
                    onClick={handleToggle}
                    className="p-2.5 rounded-full hover:bg-white dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-all pill-shadow focus:outline-none bg-white/50 dark:bg-slate-800/50"
                    title={isMobileSidebarOpen || isDesktopSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                >
                    <Menu size={20} />
                </button>

                {/* Breadcrumbs Navigation */}
                <div className="hidden md:flex items-center gap-2 text-xs font-semibold bg-white dark:bg-slate-800 px-5 py-3 rounded-full pill-shadow">
                    <Link to="/dashboard" className="text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                        <Home size={14} />
                    </Link>
                    {pathnames.map((name, index) => {
                        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                        const isLast = index === pathnames.length - 1;
                        return (
                            <React.Fragment key={name}>
                                <ChevronRight size={12} className="text-slate-300 dark:text-slate-600" />
                                {isLast ? (
                                    <span className="text-slate-900 dark:text-slate-100 whitespace-nowrap">
                                        {getDisplayName(name)}
                                    </span>
                                ) : (
                                    <Link to={routeTo} className="text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap">
                                        {getDisplayName(name)}
                                    </Link>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Right Side - Tools & Profile */}
            <div className="ml-auto flex items-center gap-4">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all pill-shadow focus:outline-none"
                    title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="bg-white dark:bg-slate-800 rounded-full pl-4 pr-2 py-2 pill-shadow flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none"
                    >
                        <div className="text-right hidden sm:block">
                            <span className="block text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">Welcome, {user?.firstName || 'User'}!</span>
                            <span className="block text-[10px] text-slate-400 font-medium leading-tight">{user?.role?.replace('_', ' ') || 'Admin'}</span>
                        </div>
                        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-700 bg-slate-100">
                            <img
                                src={user?.profileImage || "https://res.cloudinary.com/dhjdtt7rj/image/upload/v1768836672/smartstock/users/aoaa7zq0g89ewxxbdw3y.png"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsDropdownOpen(false)}
                            ></div>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1 z-20 animate-fade-in-up">
                                <Link
                                    to="/profile"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    <UserCircle size={16} /> My Profile
                                </Link>
                                <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                                <button
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        logout();
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                >
                                    <LogOut size={16} /> Log Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
