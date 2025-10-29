"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';

export default function Nav({ title = "Terminal Alameda", userName = "Usuario" }) {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.replace("/");
    };

    return (
        <nav className="relative z-50 bg-white border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-16">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2">
                            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="text-sm">
                                <p className="font-medium text-gray-900">{userName}</p>
                                <p className="text-gray-500">Administrador</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-xl focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-red-500/25 cursor-pointer"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:block">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}