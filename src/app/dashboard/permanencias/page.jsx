"use client";
import React, { useState, useEffect } from "react";
import { Search, Clock, ChevronLeft, ChevronRight, Truck } from "lucide-react";
import PermanenciaService from "@/services/permanencia.service";
import Notification from "@/components/notification";

export default function PermanenciasPage() {
  const [permanencias, setPermanencias] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ type: "", message: "" });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadPermanencias();
  }, []);

  useEffect(() => {
    const f = permanencias.filter(p =>
      p.bus.patente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.andén.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(f);
    setCurrentPage(1);
  }, [searchTerm, permanencias]);

  const loadPermanencias = async () => {
    try {
      setLoading(true);
      const data = await PermanenciaService.getPermanencias();
      setPermanencias(data);
      setFiltered(data);
    } catch (err) {
      notify("error", "Error al cargar permanencias: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const notify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: "", message: "" }), 4500);
  };

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  const prevPage = () => setCurrentPage(p => Math.max(1, p - 1));
  const nextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  const calculateTiempo = (entrada, salida) => {
    const start = new Date(entrada);
    const end = salida ? new Date(salida) : new Date();
    const diffMs = end - start;
    const diffMin = Math.floor(diffMs / 60000);
    const h = Math.floor(diffMin / 60);
    const m = diffMin % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="p-4 md:p-6">
      <Notification type={notification.type} message={notification.message} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Clock className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Permanencias (desarrollo)</h1>
            <p className="text-gray-600">Tiempo de estadía de los buses en el terminal</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar por bus o andén..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border-2 border-gray-400 rounded-xl focus:border-green-400 focus:ring-4 focus:ring-green-50 outline-none transition-all duration-200"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Patente</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Andén</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Entrada</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Salida</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Tiempo</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{p.bus.patente}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{p.andén}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(p.entrada).toLocaleTimeString("es-ES")}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{p.salida ? new Date(p.salida).toLocaleTimeString("es-ES") : "-"}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{calculateTiempo(p.entrada, p.salida)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {currentItems.map(p => (
                  <div key={p.id} className="p-4 bg-white">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">{p.bus.patente}</div>
                        <div className="mt-1 text-xs text-gray-500">Andén: {p.andén}</div>
                        <div className="mt-1 text-xs text-gray-500">Entrada: {new Date(p.entrada).toLocaleTimeString("es-ES")}</div>
                        <div className="mt-1 text-xs text-gray-500">Salida: {p.salida ? new Date(p.salida).toLocaleTimeString("es-ES") : "-"}</div>
                        <div className="mt-1 text-xs text-gray-700 font-medium">Tiempo: {calculateTiempo(p.entrada, p.salida)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No hay registros de permanencia</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-3 mt-4">
            <div className="flex items-center gap-2">
              <button onClick={prevPage} disabled={currentPage === 1} className="bg-gray-400 text-white p-3 rounded-xl disabled:opacity-50">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-600 font-medium">Página {currentPage} de {totalPages}</span>
              <button onClick={nextPage} disabled={currentPage === totalPages} className="bg-gray-400 text-white p-3 rounded-xl disabled:opacity-50">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="hidden sm:block text-sm text-gray-500">{filtered.length} resultados</div>
          </div>
        )}
      </div>
    </div>
  );
}
