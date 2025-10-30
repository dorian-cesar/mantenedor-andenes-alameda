"use client";
import Image from "next/image"
import Link from "next/link"
import React from 'react';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Search, AlertCircle, Rocket } from 'lucide-react';

export default function NotFound() {
    const router = useRouter();
    return (
        <div className="min-h-screen flex bg-linear-to-br from-blue-50 to-indigo-100">

            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center">
                        {/* Logo móvil */}
                        <div className="lg:hidden flex justify-center mb-8">
                            <div className="h-16 w-16 flex items-center justify-center rounded-xl bg-blue-600">
                                <Image
                                    src="/wit.png"
                                    alt="WIT Logo"
                                    width={48}
                                    height={48}
                                    className="filter brightness-0 invert"
                                />
                            </div>
                        </div>

                        {/* Icono de error */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                                    <AlertCircle className="w-12 h-12 text-red-600" />
                                </div>
                                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                                    404
                                </div>
                            </div>
                        </div>

                        {/* Texto principal */}
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-gray-900 mb-3">
                                Página No Encontrada
                            </h1>
                            <p className="text-gray-600 text-lg mb-4">
                                Lo sentimos, la página que estás buscando no existe o ha sido movida.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
                                <div className="flex items-start gap-3">
                                    <Search className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                                    <div className="text-left">
                                        <p className="text-blue-700 font-medium mb-1">Sugerencias:</p>
                                        <ul className="text-blue-700 text-sm space-y-1">
                                            <li>• Verifica la URL en la barra de direcciones</li>
                                            <li>• Navega desde el menú principal</li>
                                            <li>• Usa la búsqueda del sistema</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="space-y-4">
                            <Link
                                href="/dashboard"
                                className="w-full bg-linear-to-r from-sky-600 to-sky-800 text-white font-semibold py-3.5 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
                            >
                                <Home className="w-5 h-5" />
                                <span>Ir al Dashboard</span>
                            </Link>

                            <button
                                onClick={() => router.back()}
                                className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3.5 px-4 rounded-xl hover:border-blue-500 hover:text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Volver Atrás</span>
                            </button>
                        </div>

                        {/* Información adicional */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-center text-gray-500 text-sm">
                                ¿Necesitas ayuda?{" "}
                                <Link href="/soporte" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                    Contacta al soporte técnico
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}