"use client";
import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, Truck } from "lucide-react";
import VehiculoService from "@/services/vehiculo.service";
import Notification from "@/components/notification";
import VehiculoModal from "@/components/modals/vehiculoModal";

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [notification, setNotification] = useState({ type: "", message: "" });

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadVehiculos();
  }, []);

  useEffect(() => {
    const f = vehiculos.filter(v =>
      v.patente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.modelo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(f);
    setCurrentPage(1);
  }, [searchTerm, vehiculos]);

  const loadVehiculos = async () => {
    try {
      setLoading(true);
      const data = await VehiculoService.getVehiculos();
      setVehiculos(data);
      setFiltered(data);
    } catch (err) {
      notify("error", "Error al cargar vehículos: " + (err.message || err));
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

  const handleEdit = (vehiculo) => {
    setEditing(vehiculo);
    setShowModal(true);
  };

  const handleDelete = async (vehiculo) => {
    if (!confirm(`¿Eliminar vehículo ${vehiculo.patente}?`)) return;
    try {
      await VehiculoService.deleteVehiculoMock(vehiculo.id);
      notify("success", "Vehículo eliminado");
      loadVehiculos();
    } catch (err) {
      notify("error", "Error al eliminar: " + err.message);
    }
  };

  const handleSave = async (vehiculoData) => {
    try {
      if (editing) {
        await VehiculoService.updateVehiculoMock(editing.id, vehiculoData);
        notify("success", "Vehículo actualizado");
      } else {
        await VehiculoService.createVehiculoMock(vehiculoData);
        notify("success", "Vehículo creado");
      }
      setShowModal(false);
      loadVehiculos();
    } catch (err) {
      notify("error", err.message || "Error al guardar");
    }
  };

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  const prevPage = () => setCurrentPage(p => Math.max(1, p - 1));
  const nextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  return (
    <div className="p-4 md:p-6">
      <Notification type={notification.type} message={notification.message} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Truck className="h-8 w-8 text-orange-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Vehículos</h1>
            <p className="text-gray-600">Administra los buses del terminal</p>
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-linear-to-r from-orange-500 to-orange-700 text-white font-semibold py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Nuevo Vehículo
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar por patente, marca o modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border-2 border-gray-400 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-50 outline-none transition-all duration-200"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Patente</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Marca</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Modelo</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Año</th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map(v => (
                      <tr key={v.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{v.patente}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{v.marca}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{v.modelo}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{v.anio}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(v)} className="text-orange-600 hover:text-orange-900 bg-orange-100 p-2 rounded-full">
                              <Edit className="h-5 w-5" />
                            </button>
                            <button onClick={() => handleDelete(v)} className="text-red-600 hover:text-red-900 bg-red-100 p-2 rounded-full">
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {currentItems.map(v => (
                  <div key={v.id} className="p-4 bg-white">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">{v.patente} — {v.marca} {v.modelo}</div>
                        <div className="mt-1 text-xs text-gray-500">Año: {v.anio}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-2">
                        <button onClick={() => handleEdit(v)} className="p-2 rounded-md bg-orange-100 hover:bg-orange-200">
                          <Edit className="h-4 w-4 text-orange-600" />
                        </button>
                        <button onClick={() => handleDelete(v)} className="p-2 rounded-md bg-red-100 hover:bg-red-200">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No se encontraron vehículos</p>
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

      {showModal && (
        <VehiculoModal vehiculo={editing} onSave={handleSave} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
