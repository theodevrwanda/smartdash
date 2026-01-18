import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col lg:ml-72 relative z-10 h-full transition-all duration-300">
                <Header />
                <main className="flex-1 overflow-y-auto px-8 pb-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
