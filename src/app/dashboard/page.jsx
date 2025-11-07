"use client"

import { useState, useEffect } from "react"
import { Users, BusFront, CircleParking, Clock, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { DashboardCard1, DashboardCard2 } from '@/components/cards/dashboardCard'

export default function DashboardPage() {

    const [currentTime, setCurrentTime] = useState("")

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            setCurrentTime(now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }))
        }
        updateTime()
        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div>
            <div className="bg-linear-to-r from-gray-900 to-gray-800 text-white p-10 md:p-15">
                <div className="flex flex-col items-center justify-between w-full">
                    <div className=" w-full flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-balance">Panel Principal</h2>
                            <p className="text-gray-300 mt-2">Bienvenido, gestiona todas tus operaciones desde aquí</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold">{currentTime}</div>
                            <p className="text-gray-300 text-sm">
                                {new Date().toLocaleDateString("es-ES", {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                    timeZone: "America/Santiago"
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                        <DashboardCard1 icon={<TrendingUp className="h-6 w-6" />} title={"Buses en terminal"} data={"12"} color={"red"} />
                        <DashboardCard1 icon={<AlertCircle className="h-6 w-6" />} title={"Andenes ocupados"} data={"12"} color={"green"} />
                        <DashboardCard1 icon={<CheckCircle className="h-6 w-6" />} title={"Permanencias cobradas"} data={"12"} color={"emerald"} />
                    </div>
                </div>
            </div>
            <div className="p-4 md:p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Módulos de Gestión</h2>
                    <p className="text-gray-600">Selecciona un módulo para gestionar aspectos específicos del terminal</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">


                    <DashboardCard2 link={"/dashboard/vehiculos"} icon={<Users className='h-6 w-6' />} title={"Gestión de Vehículos"} description={"Administra los buses del terminal"} color={"red"}></DashboardCard2>
                    <DashboardCard2 link={"/dashboard/empresas"} icon={<Users className='h-6 w-6' />} title={"Gestión de Empresas"} description={"Administra las empresas del sistema"} color={"emerald"}></DashboardCard2>
                    <DashboardCard2 link={"/dashboard/andenes"} icon={<Users className='h-6 w-6' />} title={"Gestión de Andenes"} description={"Gestiona los andenes del terminal"} color={"blue"}></DashboardCard2>
                    <DashboardCard2 link={"/dashboard/usuarios"} icon={<Users className='h-6 w-6' />} title={"Gestión de Usuarios"} description={"Administra los usuarios del sistema"} color={"purple"}></DashboardCard2>
                    <DashboardCard2 link={"/dashboard/permanencias"} icon={<Users className='h-6 w-6' />} title={"Permanencias"} description={"Tiempo de estadía de los buses en el terminal"} color={"green"}></DashboardCard2>
                    {/* <div className='flex border-t-3 border-amber-600 w-10 h-10 rounded-full animate-spin'></div>
            <div className='flex border-r-3 border-green-600 w-10 h-10 rounded-full animate-spin'></div>
            <div className='flex border-b-3 border-blue-600 w-10 h-10 rounded-full animate-spin'></div>
            <div className='flex border-l-3 border-red-600 w-10 h-10 rounded-full animate-spin'></div> */}
                </div>
            </div>
        </div>

    )
}