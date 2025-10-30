"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut, User } from 'lucide-react';
import SessionHelper from '@/utils/session';

import Notification from './notification';

export default function Nav({ title = "Terminal Alameda" }) {
    const router = useRouter();
    const [showSessionWarning, setShowSessionWarning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const user = isClient ? SessionHelper.getUser() : null;
    const userName = user?.nombre || "Usuario";
    const role = user?.rol || "Administrador";

    useEffect(() => {
        if (!isClient) return;

        const checkSession = () => {
            if (!SessionHelper.isValidSession()) {
                handleSessionExpired();
                return;
            }

            const minutesLeft = SessionHelper.getSessionTimeLeft();
            setTimeLeft(minutesLeft);

            console.log('Minutes left:', minutesLeft); // Para debug

            if (minutesLeft > 0 && minutesLeft <= 15) {
                setShowSessionWarning(true);
                handleSessionExpired();
            } else {
                setShowSessionWarning(false);
            }
        };

        const interval = setInterval(checkSession, 30000);
        checkSession();

        return () => clearInterval(interval);
    }, [isClient]);

    const handleSessionExpired = () => {
        SessionHelper.logout();
        router.replace('/');
    };

    const handleLogout = async () => {
        await SessionHelper.logout();
        router.replace("/");
    };

    return (
        <>
            {showSessionWarning && (
                <Notification
                    type="warning"
                    message={`Tu sesión ha expirado. Por favor, inicia sesión nuevamente.`}
                    title="Sesión expirada"
                    timer={5000}
                />
            )}
            <nav className="relative z-50 bg-white border-b border-gray-200 shadow-lg">
                <div className="px-4 sm:px-6 lg:px-16">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2">
                                <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <User className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="text-sm flex flex-col items-center">
                                    <p className="font-medium text-gray-900">{userName}</p>
                                    <p className={
                                        `${role.toLowerCase() === 'superusuario' 
                                        ? 'bg-purple-200 text-purple-800'
                                        : 'bg-blue-200 text-blue-800'} capitalize px-2 py-1 rounded-full font-bold`
                                        }>{role.toLowerCase()}</p>
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
        </>

    );
}