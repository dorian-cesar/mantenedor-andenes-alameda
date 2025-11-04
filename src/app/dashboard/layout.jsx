"use client"
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar';
import Nav from '@/components/navbar';

export default function SecondaryLayout({ children, title = "Terminal de Buses" }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (window.innerWidth >= 1024) {
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

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}