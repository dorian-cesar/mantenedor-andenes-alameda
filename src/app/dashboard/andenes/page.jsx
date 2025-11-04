"use client";
import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, Box } from "lucide-react";
import AndenService from "@/services/anden.service";
import Notification from "@/components/notification";
import AndenModal from "@/components/modals/andenModal";

export default function AndenesPage() {
  const [andenes, setAndenes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [notification, setNotification] = useState({ type: "", message: "" });

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const andenesPerPage = 6;

  useEffect(() => {
    loadAndenes();
  }, []);

  useEffect(() => {
    const f = andenes.filter(a =>
      a.numero.toString().includes(searchTerm) ||
      a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.estado || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(f);
    setCurrentPage(1);
  }, [searchTerm, andenes]);

  const loadAndenes = async () => {
    try {
      setLoading(true);
      const data = await AndenService.getAndenes();
      setAndenes(data);
      setFiltered(data);
    } catch (err) {
      notify("error", "Error al cargar andenes: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const notify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: "", message: "" }), 4500);
  };

  const handleCreate = () => {
    setEditing(null);
    setShowModal(true);
  };

  const handleEdit = (anden) => {
    setEditing(anden);
    setShowModal(true);
  };

  const handleDelete = async (anden) => {
    if (!confirm(`¿Eliminar anden ${anden.numero} - ${anden.nombre}?`)) return;
    try {
      // si tienes backend: await AndenService.deleteAnden(anden.id)
      await AndenService.deleteAndenMock(anden.id); // mock
      notify("success", "Andén eliminado correctamente");
      loadAndenes();
    } catch (err) {
      notify("error", "Error al eliminar: " + err.message);
    }
  };

  const handleSave = async (andenData) => {
    try {
      if (editing) {
        // await AndenService.updateAnden(editing.id, andenData);
        await AndenService.updateAndenMock(editing.id, andenData);
        notify("success", "Andén actualizado");
      } else {
        // await AndenService.createAnden(andenData);
        await AndenService.createAndenMock(andenData);
        notify("success", "Andén creado");
      }
      setShowModal(false);
      loadAndenes();
    } catch (err) {
      notify("error", err.message || "Error al guardar");
    }
  };

  // pagination helpers
  const indexOfLast = currentPage * andenesPerPage;
  const indexOfFirst = indexOfLast - andenesPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(filtered.length / andenesPerPage));

  const prevPage = () => setCurrentPage(p => Math.max(1, p - 1));
  const nextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  return (
    <div className="p-4 md:p-6">
      <Notification type={notification.type} message={notification.message} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Box className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Andenes</h1>
            <p className="text-gray-600">Administra andenes (plataformas) del terminal</p>
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-linear-to-r from-emerald-500 to-emerald-700 text-white font-semibold py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Nuevo Andén
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar por número, nombre o estado..."
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
              {/* Tabla para desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Nombre</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Estado</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Descripción</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Creado</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map(a => (
                      <tr key={a.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{a.numero}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{a.nombre}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${a.estado === "activo" ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-800"}`}>
                            {a.estado}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{a.descripcion || "-"}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(a.creado_en).toLocaleDateString("es-ES")}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(a)} className="text-green-600 hover:text-green-900 bg-green-200 p-2 rounded-full">
                              <Edit className="h-5 w-5" />
                            </button>
                            <button onClick={() => handleDelete(a)} className="text-red-600 hover:text-red-900 bg-red-100 p-2 rounded-full">
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards para móvil */}
              <div className="md:hidden divide-y divide-gray-200">
                {currentItems.map(a => (
                  <div key={a.id} className="p-4 bg-white">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">Andén {a.numero} — {a.nombre}</div>
                            <div className="text-xs text-gray-500 truncate">{a.descripcion}</div>
                          </div>
                          <div>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${a.estado === "activo" ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-800"}`}>
                              {a.estado}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">Creado: {new Date(a.creado_en).toLocaleDateString("es-ES")}</div>
                      </div>

                      <div className="flex flex-col items-end gap-2 ml-2">
                        <button onClick={() => handleEdit(a)} className="p-2 rounded-md bg-green-100 hover:bg-green-200">
                          <Edit className="h-4 w-4 text-green-600" />
                        </button>
                        <button onClick={() => handleDelete(a)} className="p-2 rounded-md bg-red-100 hover:bg-red-200">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-8">
                  <Box className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No se encontraron andenes</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Paginación */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-3 mt-4">
            <div className="flex items-center gap-2">
              <button onClick={prevPage} disabled={currentPage === 1} className="bg-linear-to-tr from-gray-400 to-gray-500 text-white p-3 rounded-xl disabled:opacity-50">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-600 font-medium">Página {currentPage} de {totalPages}</span>
              <button onClick={nextPage} disabled={currentPage === totalPages} className="bg-linear-to-tr from-gray-400 to-gray-500 text-white p-3 rounded-xl disabled:opacity-50">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="hidden sm:block text-sm text-gray-500">{filtered.length} resultados</div>
          </div>
        )}
      </div>

      {showModal && (
        <AndenModal
          anden={editing}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
