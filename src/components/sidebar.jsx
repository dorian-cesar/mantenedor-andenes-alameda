"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, Users, Settings, BarChart3, FileText,
    ChevronLeft, ChevronRight, Terminal, Building, Truck,
    Calendar, HelpCircle, Menu
} from 'lucide-react';

export default function Sidebar({ isOpen: externalIsOpen, onToggle }) {
    const [isOpen, setIsOpen] = useState(true);
    const pathname = usePathname();

    const toggleSidebar = () => {
        if (onToggle) onToggle();
        else setIsOpen(!isOpen);
    };

    const sidebarOpen = externalIsOpen !== undefined ? externalIsOpen : isOpen;

    const menuItems = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            name: 'Usuarios y Roles',
            href: '/dashboard/usuarios',
            icon: Terminal,
        },
        {
            name: 'Vehículos',
            href: '/dashboard/vehiculos',
            icon: Truck,
        },
        {
            name: 'Andenes',
            href: '/dashboard/andenes',
            icon: Users,
        },
        {
            name: 'Permanencias',
            href: '/dashboard/permanencias',
            icon: BarChart3,
        },
    ];

    const bottomMenuItems = [
        {
            name: 'Configuración',
            href: '/configuracion',
            icon: Settings,
        },
        {
            name: 'Ayuda',
            href: '/ayuda',
            icon: HelpCircle,
        },
    ];

    return (
        <>
            <div className={`
                fixed lg:static inset-y-0 left-0 z-40
                bg-white border-r border-gray-200
                transition-all duration-300 ease-in-out
                ${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 lg:w-20 -translate-x-full lg:translate-x-0'}
                h-screen overflow-hidden lg:overflow-visible
            `}>

                <div className={`
                    w-64 lg:w-auto
                    ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100'}
                    transition-opacity duration-300
                    h-full flex flex-col
                `}>
                    <div className={`${sidebarOpen ? 'justify-between' : 'justify-center'} flex items-center p-4 border-b border-gray-200`}>
                        {sidebarOpen && (
                            <div className="flex flex-col items-center gap-5">
                                <div>
                                    <h2 className="font-bold text-gray-900">Sistema Control</h2>
                                    <p className="text-xs text-gray-500">Terminales</p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden lg:flex cursor-pointer"
                            aria-label="Toggle sidebar"
                        >
                            {sidebarOpen ? (
                                <ChevronLeft className="h-4 w-4 text-gray-600" />
                            ) : (
                                <ChevronRight className="h-4 w-4 text-gray-600" />
                            )}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto py-4">
                        <nav className="space-y-1 px-3">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`
                                            flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                                            ${isActive ? 'bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                                            ${!sidebarOpen ? 'justify-center lg:justify-start' : ''}
                                        `}
                                    >
                                        <div className={`
                                            p-2 rounded-lg transition-colors shrink-0
                                            ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'}
                                        `}>
                                            <Icon className="h-4 w-4" />
                                        </div>

                                        {sidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Menú inferior */}
                    <div className="border-t border-gray-200 p-4 space-y-2">
                        {bottomMenuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                                        ${isActive ? 'bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                                        ${!sidebarOpen ? 'justify-center lg:justify-start' : ''}
                                    `}
                                >
                                    <div className={`
                                        p-2 rounded-lg transition-colors shrink-0
                                        ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'}
                                    `}>
                                        <Icon className="h-4 w-4" />
                                    </div>

                                    {sidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 z-30"
                    onClick={toggleSidebar}
                />
            )}

            {/* Botón móvil para abrir sidebar */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200"
                aria-label="Abrir sidebar"
            >
                <Menu className="h-5 w-5" />
            </button>
        </>
    );
}