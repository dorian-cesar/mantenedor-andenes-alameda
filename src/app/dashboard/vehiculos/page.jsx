"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit, Trash2, Check, ChevronLeft, ChevronRight, RefreshCcw, XIcon, Truck } from 'lucide-react';
import VehiculoService from '@/services/vehiculo.service';
import Notification from '@/components/notification';
import VehiculoModal from '@/components/modals/vehiculoModal';


export default function VehiculosPage() {
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBuses, setEditingBuses] = useState(null);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const busesPerPage = 3;



  const debounceRef = useRef(null);

  useEffect(() => {
    loadBuses();
  }, []);

  useEffect(() => {
    // debounce para no ejecutar lógica en cada tecla
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      (async () => {
        const term = searchTerm?.trim() ?? '';

        if (!term) {
          setFilteredBuses(buses);
          setCurrentPage(1);
          return;
        }

        // Caso: búsqueda por ID -> números puros o "id:123"
        const idMatch = term.match(/^id\s*:\s*(\d+)$/i);
        const numericMatch = term.match(/^\d+$/);

        if (idMatch || numericMatch) {
          const id = idMatch ? idMatch[1] : term;
          try {
            setLoading(true);
            const bus = await VehiculoService.getBusByID(id);
            if (bus) {
              setFilteredBuses([bus]);
            } else {
              setFilteredBuses([]);
              showNotification('error', `No se encontró el vehículo con id ${id}`);
            }
          } catch (err) {
            setFilteredBuses([]);
            showNotification('error', err?.message || `Error buscando vehiculo ${id}`);
          } finally {
            setLoading(false);
            setCurrentPage(1);
          }
          return;
        }

        // Caso: búsqueda por texto (nombre, correo, rol) - filtrado local
        const filtered = buses.filter(bus =>
          (bus.patente || '').toLowerCase().includes(term.toLowerCase()) ||
          (bus.modelo || '').toLowerCase().includes(term.toLowerCase()) ||
          (bus.empresa_nombre || '').toLowerCase().includes(term.toLowerCase())
        );
        setFilteredBuses(filtered);
        setCurrentPage(1);
      })();
    }, 300); // debounce 300ms

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm, buses]);

  const loadBuses = async () => {
    try {
      setLoading(true);
      const busesData = await VehiculoService.getBuses();
      setBuses(busesData);
      setFilteredBuses(busesData);
    } catch (error) {
      showNotification('error', 'Error al cargar vehiculos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 5000);
  };

  const handleCreateBus = () => {
    setEditingBuses(null);
    setShowModal(true);
  };

  const handleEditBus = (bus) => {
    setEditingBuses(bus);
    setShowModal(true);
  };

  const handleActiveBus = async (bus) => {
    try {
      await VehiculoService.activateBus(bus.id);
      loadBuses();
      showNotification('success', 'Vehículo activado correctamente');
    } catch (error) {
      showNotification('error', 'Error al desactivar vehículo: ' + error.message);
    }

  };

  const handleDesactiveBus = async (bus) => {
    if (confirm(`¿Estás seguro de que quieres desactivar al vehiculo ${bus.patente}?`)) {
      try {
        await VehiculoService.deactivateBus(bus.id);
        loadBuses();
        showNotification('success', 'Vehículo desactivado correctamente');
      } catch (error) {
        showNotification('error', 'Error al desactivar vehículo: ' + bus.message);
      }
    }
  };

  const handleSaveBus = async (busData) => {
    try {
      if (editingBuses) {
        await VehiculoService.updateBus(editingBuses.id, busData);
        showNotification('success', 'Vehículo actualizado correctamente');
      } else {
        await VehiculoService.createBus(busData);
        showNotification('success', 'Vehículo creado correctamente');
      }
      setShowModal(false);
      loadBuses();
    } catch (error) {
      showNotification('error', error.message);
    }
  };

  const indexOfLastBus = currentPage * busesPerPage
  const indexOfFirstBus = indexOfLastBus - busesPerPage
  const currentBuses = filteredBuses.slice(indexOfFirstBus, indexOfLastBus)
  const totalPages = Math.ceil(filteredBuses.length / busesPerPage)

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="p-4 md:p-6">
      <Notification type={notification.type} message={notification.message} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Truck className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Buses</h1>
            <p className="text-gray-600">Controla los vehículos del terminal</p>
          </div>

          <button
            onClick={() => { loadBuses() }}
            className='flex items-center bg-linear-to-r from-sky-600 to-sky-800 text-white font-semibold p-3 rounded-full cursor-pointer'
          >
            <RefreshCcw />
          </button>
        </div>
        <button
          onClick={handleCreateBus}
          className="flex items-center gap-2 bg-linear-to-r from-sky-600 to-sky-800 text-white font-semibold py-2 px-4 rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
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
            placeholder="Buscar ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border-2 border-gray-400 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : (
            <>
              {/* Tabla para md+ */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Patente</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Tag UHF</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Marca</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Modelo</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Capacidad</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Empresa</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Estado</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentBuses.map((bus) => (
                      <tr key={bus.id} className={` ${bus.estado === 'activo' ? 'hover:bg-gray-50' : 'hover:bg-gray-300 bg-gray-200'}`}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{bus.id}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{bus.patente}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{bus.tag_uhf}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{bus.marca}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{bus.modelo}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{bus.capacidad}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{bus.empresa_nombre}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={
                              `inline-flex px-2 py-1 text-xs font-semibold rounded-full 
                            ${bus.estado === 'activo'
                                ? 'bg-emerald-200 text-emerald-800'
                                : 'bg-orange-200 text-orange-800'
                              }`}>
                            {bus.estado}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditBus(bus)}
                              className="text-blue-600 hover:text-blue-900 bg-blue-200 p-2 rounded-full cursor-pointer"
                              aria-label={`Editar ${bus.patente}`}
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            {bus.estado === 'activo'
                              ? <button
                                onClick={() => handleDesactiveBus(bus)}
                                className="text-red-600 hover:text-red-900 bg-red-200 p-2 rounded-full cursor-pointer"
                                aria-label={`Desactivar ${bus.patente}`}
                                title={`Desactivar ${bus.patente}`}
                              >
                                <XIcon className="h-5 w-5" />
                              </button>
                              : <button
                                onClick={() => handleActiveBus(bus)}
                                className="text-emerald-800 hover:text-emerald-900 bg-emerald-200 p-2 rounded-full cursor-pointer"
                                aria-label={`Activar ${bus.patente}`}
                                title={`Activar ${bus.patente}`}
                              >
                                <Check className="h-5 w-5" />
                              </button>
                            }

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards para móvil (sm - md) */}
              <div className="md:hidden divide-y divide-gray-200">
                {currentBuses.map((bus) => (
                  <div key={bus.patente} className="p-4 bg-white">
                    <div className="flex justify-between items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <div className='flex items-center'>
                              <div className="text-sm font-semibold text-gray-900">{bus.id}</div>
                              <div className='w-5 text-center'>•</div>
                              <div className="text-sm font-semibold text-gray-900">{bus.empresa_nombre}</div>
                            </div>

                          </div>
                          <div>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${bus.estado === 'activo'
                              ? 'bg-emerald-200 text-emerald-800'
                              : 'bg-orange-200 text-orange-800'
                              }`}>
                              {bus.estado}
                            </span>
                          </div>
                        </div>
                        <div className="mb-2 text-xs text-gray-500">
                          <div className="text-xs text-gray-500 truncate">{bus.marca} {bus.modelo}</div>
                          <div className="text-xs text-gray-500 truncate">Patente: {bus.patente}</div>
                          <div className="text-xs text-gray-500 truncate">Tag UHF: {bus.tag_uhf}</div>
                        </div>
                        <div className="flex mt-2 text-xs text-gray-500 gap-3">
                          <div>Capacidad: {bus.capacidad}</div>
                          <div>Empresa: {bus.empresa_id}</div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-between h-full gap-2 ml-2">
                        <button
                          onClick={() => handleEditBus(bus)}
                          className="p-2 rounded-md text-blue-600 hover:text-blue-900 bg-blue-200"
                          aria-label={`Editar ${bus.patente}`}
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </button>

                        {bus.estado === 'activo'
                          ? <button
                            onClick={() => handleDesactiveBus(bus)}
                            className="p-2 rounded-md text-red-600 hover:text-red-900 bg-red-200"
                            aria-label={`Desactivar ${bus.patente}`}
                            title={`Desactivar ${bus.patente}`}
                          >
                            <XIcon className="h-4 w-4" />
                          </button>
                          : <button
                            onClick={() => handleActiveBus(bus)}
                            className="p-2 rounded-md text-emerald-800 hover:text-emerald-900 bg-emerald-200"
                            aria-label={`Activar ${bus.patente}`}
                            title={`Activar ${bus.patente}`}
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredBuses.length === 0 && (
                <div className="text-center py-8">
                  <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No se encontraron vehículos</p>
                </div>
              )}
            </>
          )}
        </div>

        {filteredBuses.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-3 mt-4">
            <div className="flex items-center gap-2">
              <button
                className="bg-linear-to-tr from-gray-400 to-gray-500 hover:from-gray-600 hover:to-gray-800 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-600 font-medium">
                Página {currentPage} de {totalPages}
              </span>
              <button
                className="bg-linear-to-tr from-gray-400 to-gray-500 hover:from-gray-600 hover:to-gray-800 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                aria-label="Página siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="hidden sm:block text-sm text-gray-500">
              {filteredBuses.length} resultados
            </div>
          </div>
        )}
      </div>


      {showModal && (
        <VehiculoModal
          bus={editingBuses}
          onSave={handleSaveBus}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}