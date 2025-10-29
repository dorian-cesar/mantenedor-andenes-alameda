"use client"
import Image from "next/image"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Mail, Lock, Eye, EyeOff, Building2, ArrowRight, User, BusFront, CircleParking, Clock } from 'lucide-react';

import Notification from "@/components/notification";

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
      if (res.ok && (data.token || data.status === 200)) {
        if (data.token) {
          try {
            localStorage.setItem("token", data.token);
            setNotif({ type: "success", message: "Inicio de sesión exitoso" });
            setTimeout(() => setNotif({ type: "", message: "" }), 100);
          } catch (err) {
            setNotif({ type: "error", message: "Error al iniciar sesión" });
            setTimeout(() => setNotif({ type: "", message: "" }), 100);
          }
        }
        router.push("/dashboard");
        return;
      }
      setNotif({ type: "error", message: data.mensaje || "Credenciales inválidas" });
      setTimeout(() => setNotif({ type: "", message: "" }), 100);
    } catch (err) {
      console.error("fetch error:", err);
      setNotif({ type: "error", message: "Error al conectar con el servidor" });
      setTimeout(() => setNotif({ type: "", message: "" }), 100);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Notification type={notif.type} message={notif.message} />

      <div className="flex-1 hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-blue-600 to-indigo-800 text-white">
        <div className="flex items-center gap-6 mb-16">
          <div className="h-20 w-20 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
            <Image
              src="/wit.png"
              alt="WIT Logo"
              width={64}
              height={64}
              className="filter brightness-0 invert"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Sistema de Control de Terminales</h1>
            <p className="text-blue-100 mt-1">Innovación con más de 15 años de trabajo</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 border rounded-xl">
            <User />
            <div>
              <h3 className="font-semibold">Usuarios</h3>
              <p className="text-sm text-blue-100">Gestión de usuarios del sistema</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 border rounded-xl">
            <BusFront />
            <div>
              <h3 className="font-semibold">Buses</h3>
              <p className="text-sm text-blue-100">Administración de buses</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 border rounded-xl">
            <CircleParking />
            <div>
              <h3 className="font-semibold">Andenes</h3>
              <p className="text-sm text-blue-100">Gestión de andenes</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 border rounded-xl">
            <Clock />
            <div>
              <h3 className="font-semibold">Permanencia</h3>
              <p className="text-sm text-blue-100">Control de permanencia</p>
            </div>
          </div>
        </div>

        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-8 h-8 text-blue-200" />
            <h2 className="text-3xl font-bold">SOMOS WIT</h2>
          </div>
          <p className="text-lg text-blue-100 mb-4 leading-relaxed">
            Empresa de desarrollo de productos y soluciones tecnológicas.
            Especialistas en creación, diseño e implementación de herramientas
            para optimizar procesos empresariales.
          </p>
          <p className="text-blue-100 leading-relaxed">
            Fortaleza basada en TIC y NTIC para desarrollo profesional y
            sustentabilidad financiera.
          </p>
          <div className="mt-8">
            <div className="w-16 h-1 bg-blue-300 rounded-full mb-4"></div>
            <p className="text-blue-200 text-sm">Transformando ideas en soluciones digitales</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
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

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h2>
              <p className="text-gray-600 text-lg">Ingresa a tu cuenta</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={correo}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={show ? "text" : "password"}
                    placeholder="• • • • • • • •"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <span>Iniciar Sesión</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-500 text-sm">
                ¿Necesitas ayuda?{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Contacta al soporte
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}