import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import UpdateModal from './UpdateModal';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <Header onMenuClick={() => setIsSidebarOpen(true)} />
            <main className="flex-1 w-full max-w-4xl mx-auto p-4 animate-fade-in pb-20">
                <Outlet />
            </main>
            <UpdateModal />
        </div>
    );
};

export default Layout;
