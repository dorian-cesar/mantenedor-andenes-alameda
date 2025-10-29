"use client"
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar';
import Nav from '@/components/navbar';

export default function SecondaryLayout({ children, title = "Terminal Alameda" }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
            setSidebarOpen(true);
        }
    }, []);

    return (
        <div className="flex h-screen">
            <Sidebar
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Nav title={title} />

                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}