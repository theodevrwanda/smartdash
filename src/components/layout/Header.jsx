import React from 'react';
import { Menu } from 'lucide-react';

const Header = ({ isDesktopSidebarOpen, setIsDesktopSidebarOpen, isMobileSidebarOpen, setIsMobileSidebarOpen }) => {

    const handleToggle = () => {
        if (window.innerWidth < 1024) {
            setIsMobileSidebarOpen(!isMobileSidebarOpen);
        } else {
            setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
        }
    };

    return (
        <header className="h-20 flex items-center justify-between px-8 mb-4">
            <div className="flex items-center gap-4">
                {/* Global Sidebar Toggle Button */}
                <button
                    onClick={handleToggle}
                    className="p-2.5 rounded-full hover:bg-white text-slate-500 hover:text-slate-900 transition-all pill-shadow focus:outline-none bg-white/50"
                    title={isMobileSidebarOpen || isDesktopSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                >
                    <Menu size={20} />
                </button>

                {/* Center Links (Placeholder as per design) - Hidden on small screens */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500 bg-white px-6 py-3 rounded-full pill-shadow">
                    <span className="text-slate-800 cursor-pointer">Products</span>
                    <span className="hover:text-slate-800 cursor-pointer transition-colors">Categories</span>
                    <span className="hover:text-slate-800 cursor-pointer transition-colors">Reports</span>
                </div>
            </div>

            {/* Right Side - Welcome Pill */}
            <div className="ml-auto flex items-center gap-4">
                <div className="bg-white rounded-full pl-6 pr-2 py-2 pill-shadow flex items-center gap-4">
                    <span className="text-sm font-bold text-slate-700 hidden sm:inline">Welcome, Admin!</span>
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-slate-100">
                        <img src="https://media.licdn.com/dms/image/v2/D4D03AQE0Jj9aQ_XgMw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1718274685322?e=2147483647&v=beta&t=k6hJ6i6d3T2j8_g3y_z6l_x3q_n8m4_j5k7_l2a4_s5" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
