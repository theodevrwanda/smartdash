import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import clsx from 'clsx';

const Layout = () => {
    const [isDesktopOpen, setIsDesktopOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-300">
            {/* Sidebar remains fixed to the left or drawer */}
            <Sidebar
                isDesktopOpen={isDesktopOpen}
                setIsDesktopOpen={setIsDesktopOpen}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            {/* Main Wrapper */}
            <div className={clsx(
                "flex-1 flex flex-col relative z-20 h-full transition-all duration-300 overflow-hidden",
                isDesktopOpen ? "lg:ml-72" : "lg:ml-20"
            )}>
                <Header
                    isDesktopSidebarOpen={isDesktopOpen}
                    setIsDesktopSidebarOpen={setIsDesktopOpen}
                    isMobileSidebarOpen={isMobileOpen}
                    setIsMobileSidebarOpen={setIsMobileOpen}
                />

                <main className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto px-6 md:px-8 pb-8 w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
