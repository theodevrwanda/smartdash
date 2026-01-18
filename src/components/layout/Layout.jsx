import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import clsx from 'clsx';

const Layout = () => {
    const [isDesktopOpen, setIsDesktopOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-300">
            <Sidebar
                isDesktopOpen={isDesktopOpen}
                setIsDesktopOpen={setIsDesktopOpen}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />
            <div className={clsx(
                "flex-1 flex flex-col relative z-20 h-full transition-all duration-300",
                isDesktopOpen ? "lg:ml-72" : "lg:ml-20"
            )}>
                <Header
                    isDesktopSidebarOpen={isDesktopOpen}
                    setIsDesktopSidebarOpen={setIsDesktopOpen}
                    isMobileSidebarOpen={isMobileOpen}
                    setIsMobileSidebarOpen={setIsMobileOpen}
                />
                <main className="flex-1 overflow-y-auto px-8 pb-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
