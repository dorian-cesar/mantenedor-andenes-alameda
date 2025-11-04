"use client"
import Image from "next/image"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Mail, Lock, Eye, EyeOff, Building2, ArrowRight, User, BusFront, CircleParking, Clock } from 'lucide-react';

import Notification from "@/components/notification";
import SessionHelper from "@/utils/session";
import { LoginCard1, LoginCard2 } from "@/components/cards/loginCard";

export default function Login() {

  const router = useRouter();
  const [correo, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [notif, setNotif] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!correo || !password) {
      setNotif({ type: "error", message: "Por favor completa todos los campos" });
      setTimeout(() => setNotif({ type: "", message: "" }), 100);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo, password }),
        }
      );

      const data = await res.json().catch(() => ({}));
      console.log(data)

      if (res.ok && (data.token || data.status === 200)) {
        const rol = data.usuario.rol;
        if (rol !== "superusuario" && rol !== "administrador") {
          setNotif({ type: "warning", message: "Acceso denegado, contacte un administrador." });
          setTimeout(() => setNotif({ type: "", message: "" }), 3000);
          return;
        }
        if (data.token) {
          const sessionResult = await SessionHelper.loginSession(
            data.token,
            data.usuario
          );

          if (sessionResult.success) {
            setNotif({ type: "success", message: "Inicio de sesión exitoso" });
            setTimeout(() => {
              setNotif({ type: "", message: "" });
              router.replace("/dashboard");
            }, 1500);
          } else {
            setNotif({ type: "error", message: sessionResult.error });
            setTimeout(() => setNotif({ type: "", message: "" }), 3000);
          }
        }
        return;
      }
      setNotif({ type: "error", message: data.mensaje || "Credenciales inválidas" });
      setTimeout(() => setNotif({ type: "", message: "" }), 3000);
    } catch (err) {
      console.error("fetch error:", err);
      setNotif({ type: "error", message: "Error al conectar con el servidor" });
      setTimeout(() => setNotif({ type: "", message: "" }), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <Notification type={notif.type} message={notif.message} />

      {/* Banner móvil (visible solo en sm/lg abajo) */}
      <div className="flex items-center gap-4 px-6 py-4 bg-linear-to-br from-gray-600 to-sky-800 text-white lg:hidden">
        <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
          <Image src="/wit.png" alt="WIT Logo" width={40} height={40} className="filter brightness-0 invert" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">Sistema de Control</h1>
          <p className="text-xs text-blue-100">Innovación con más de 15 años</p>
        </div>
      </div>

      <aside className="flex-1 hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-gray-600 to-sky-800 text-white">

        <div className="flex-1 flex gap-6">
          <div className="h-20 w-20 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <Image src="/wit.png" alt="WIT Logo" width={64} height={64} className="filter brightness-0 invert" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Sistema de Control de Terminales</h1>
            <p className="text-blue-100 mt-1">Innovación con más de 15 años de trabajo</p>
          </div>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LoginCard1 icon={<User />} title={"Usuarios"} description={"Creación de usuarios del sistema"} />
            <LoginCard1 icon={<BusFront />} title={"Buses"} description={"Administración de buses"} />
            <LoginCard1 icon={<CircleParking />} title={"Andenes"} description={"Gestión de andenes"} />
            <LoginCard1 icon={<Clock />} title={"Permanencia"} description={"Control de permanencia"} />
          </div>
        </div>


        <div className="flex-1">
          <LoginCard2 />
        </div>
      </aside>

      <main className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
        <div className="w-full max-w-md sm:max-w-lg">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Bienvenido</h2>
            <p className="text-sm sm:text-base text-gray-600">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={correo}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 sm:py-3.5 border-2 border-gray-400 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 sm:py-3.5 border-2 border-gray-400 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200"
                  placeholder="• • • • • • • •"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 sm:py-3.5 bg-linear-to-r from-sky-600 to-sky-800 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Cargando..." : "Iniciar Sesión"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-5 sm:mt-6">
            ¿Problemas para acceder?{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              Contacta un administrador
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}