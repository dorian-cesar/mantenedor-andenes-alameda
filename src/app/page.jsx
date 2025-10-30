"use client"
import Image from "next/image"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Mail, Lock, Eye, EyeOff, Building2, ArrowRight, User, BusFront, CircleParking, Clock } from 'lucide-react';

import Notification from "@/components/notification";
import SessionHelper from "@/utils/session";

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

      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Iniciar Sesión</h2>
            <p className="text-gray-600">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200"
                  placeholder="tu@email.com"
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
                  className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200"
                  placeholder="• • • • • • • •"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
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
              className="w-full py-3 bg-linear-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              { isLoading ? "Cargando..." : "Iniciar Sesión" }
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            ¿Problemas para acceder?{" "}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              Contacta un administrador
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}