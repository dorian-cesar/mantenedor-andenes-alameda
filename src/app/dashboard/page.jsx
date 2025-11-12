"use client"

import { useState, useEffect } from "react"
import { Users, BusFront, CircleParking, Clock, TrendingUp, AlertCircle, CheckCircle, RefreshCcw, LayoutDashboard } from 'lucide-react'
import { DashboardCard1, DashboardCard2 } from '@/components/cards/dashboardCard'
import UserService from '@/services/user.service';
import EmpresaService from "@/services/empresa.service";
import Notification from '@/components/notification';

export default function DashboardPage() {
    const [currentTime, setCurrentTime] = useState("");
    const [users, setUsers] = useState([]);
    const [empresas, setEmpresas] = useState(null);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingEmpresas, setLoadingEmpresas] = useState(true);
    const [notification, setNotification] = useState({ type: '', message: '' });



    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            setCurrentTime(now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }))
        }
        updateTime()
        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        loadUsers();
        loadEmpresas();
    }, []);

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification({ type: '', message: '' }), 5000);
    };

    const loadAll = async () => {
        await loadUsers();
        await loadEmpresas();
    }

    const loadUsers = async () => {
        try {
            setLoadingUsers(true);
            const usersData = await UserService.getUsers();
            setUsers(usersData);
        } catch (error) {
            showNotification('error', 'Error al cargar usuarios: ' + error.message);
        } finally {
            setLoadingUsers(false);
        }
    };

    const loadEmpresas = async () => {
        try {
            setLoadingEmpresas(true);
            const empresaData = await EmpresaService.getEmpresas(true, false);
            setEmpresas(empresaData);
        } catch (error) {
            showNotification('error', 'Error al cargar empresas: ' + error.message);
        } finally {
            setLoadingEmpresas(false);
        }
    }

    return (
        <div className="p-4 md:p-6">
            <Notification type={notification.type} message={notification.message} />

            <div className="bg-gradient-to-r from-sky-700 to-sky-950 text-white p-6 rounded-lg mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Panel Principal</h1>
                        <p className="text-blue-100">Bienvenido al sistema de gestión del terminal</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 mt-4 md:mt-0">
                        <div className="text-2xl font-bold">{currentTime}</div>
                        <p className="text-blue-100 text-sm">
                            {new Date().toLocaleDateString("es-ES", {
                                weekday: "long",
                                month: "long",
                                day: "numeric"
                            })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-6 mb-6 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Estado del Sistema</h3>
                    <RefreshCcw className="h-5 w-5 text-blue-500 cursor-pointer" onClick={() => { loadAll() }} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Empresas</p>
                        <p className="font-semibold text-gray-800">{empresas?.total ?? 0}</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="h-6 w-6 bg-green-500 rounded-full mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">Base de Datos</p>
                        <p className="font-semibold text-gray-800">Activa</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Última Sinc.</p>
                        <p className="font-semibold text-gray-800">Hace 5 min</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Users className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Usuarios Activos</p>
                        <p className="font-semibold text-gray-800">12</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

                <DashboardCard2 link={"/dashboard/vehiculos"} icon={<Users className='h-6 w-6' />} title={"Gestión de Vehículos"} description={"Administra los buses del terminal"} color={"blue"}></DashboardCard2>
                <DashboardCard2 link={"/dashboard/usuarios"} icon={<Users className='h-6 w-6' />} title={"Gestión de Usuarios"} description={"Administra los usuarios del sistema"} color={"blue"}></DashboardCard2>
                <DashboardCard2 link={"/dashboard/empresas"} icon={<Users className='h-6 w-6' />} title={"Gestión de Empresas"} description={"Administra las empresas del sistema"} color={"blue"}></DashboardCard2>
                <DashboardCard2 link={"/dashboard/andenes"} icon={<Users className='h-6 w-6' />} title={"Gestión de Andenes"} description={"Gestiona los andenes del terminal"} color={"emerald"}></DashboardCard2>
                <DashboardCard2 link={"/dashboard/permanencias"} icon={<Users className='h-6 w-6' />} title={"Permanencias"} description={"Tiempo de estadía de los buses en el terminal"} color={"emerald"}></DashboardCard2>
                {/* <div className='flex border-t-3 border-amber-600 w-10 h-10 rounded-full animate-spin'></div>
            <div className='flex border-r-3 border-green-600 w-10 h-10 rounded-full animate-spin'></div>
            <div className='flex border-b-3 border-blue-600 w-10 h-10 rounded-full animate-spin'></div>
            <div className='flex border-l-3 border-red-600 w-10 h-10 rounded-full animate-spin'></div> */}
            </div>
        </div>

    )
}