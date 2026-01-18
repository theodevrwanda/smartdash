import React from 'react';
import { Menu, Moon, Sun, ChevronRight, Home } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLocation, Link } from 'react-router-dom';

const Header = ({ isDesktopSidebarOpen, setIsDesktopSidebarOpen, isMobileSidebarOpen, setIsMobileSidebarOpen }) => {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

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

                <div className="bg-white dark:bg-slate-800 rounded-full pl-6 pr-2 py-2 pill-shadow flex items-center gap-4">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 hidden sm:inline">Welcome, Admin!</span>
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-700">
                        <img src="https://media.licdn.com/dms/image/v2/D4D03AQE0Jj9aQ_XgMw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1718274685322?e=2147483647&v=beta&t=k6hJ6i6d3T2j8_g3y_z6l_x3q_n8m4_j5k7_l2a4_s5" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
