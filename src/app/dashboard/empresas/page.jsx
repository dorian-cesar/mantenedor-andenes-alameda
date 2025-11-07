"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Building, Edit, Trash2, Check, ChevronLeft, ChevronRight, RefreshCcw, XIcon } from 'lucide-react';
import EmpresaService from '@/services/empresa.service';
import Notification from '@/components/notification';
import EmpresaModal from '@/components/modals/empresaModal';


export default function EmpresasPage() {
    const [empresas, setEmpresas] = useState([]);
    const [filteredEmpresas, setFilteredEmpresas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEmpresa, seteditingEmpresa] = useState(null);
    const [notification, setNotification] = useState({ type: '', message: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const empresasPerPage = 5;



    const debounceRef = useRef(null);

    useEffect(() => {
        loadEmpresas();
    }, []);

    useEffect(() => {
        // debounce para no ejecutar lógica en cada tecla
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            (async () => {
                const term = searchTerm?.trim() ?? '';

                if (!term) {
                    setFilteredEmpresas(empresas);
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
                        const empresa = await EmpresaService.getEmpresaByID(id, true);
                        if (empresa) {
                            setFilteredEmpresas([empresa]);
                        } else {
                            setFilteredEmpresas([]);
                            showNotification('error', `No se encontró el empresa con id ${id}`);
                        }
                    } catch (err) {
                        setFilteredEmpresas([]);
                        showNotification('error', err?.message || `Error buscando empresa ${id}`);
                    } finally {
                        setLoading(false);
                        setCurrentPage(1);
                    }
                    return;
                }

                // Caso: búsqueda por texto - filtrado local
                const filtered = empresas.filter(empresa =>
                    (empresa.nombre || '').toLowerCase().includes(term.toLowerCase()) ||
                    (empresa.rut || '').toLowerCase().includes(term.toLowerCase()) ||
                    (empresa.estado || '').toLowerCase().includes(term.toLowerCase())
                );
                setFilteredEmpresas(filtered);
                setCurrentPage(1);
            })();
        }, 300);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [searchTerm, empresas]);

    const loadEmpresas = async () => {
        try {
            setLoading(true);
            const empresasData = await EmpresaService.getEmpresas(true);
            setEmpresas(empresasData);
            setFilteredEmpresas(empresasData);
        } catch (error) {
            showNotification('error', 'Error al cargar empresas: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification({ type: '', message: '' }), 5000);
    };

    const handleCreateEmpresa = () => {
        seteditingEmpresa(null);
        setShowModal(true);
    };

    const handleEditEmpresa = (empresa) => {
        seteditingEmpresa(empresa);
        setShowModal(true);
    };

    const handleActiveEmpresa = async (empresa) => {
        try {
            await EmpresaService.activarEmpresa(empresa.id);
            loadEmpresas();
            showNotification('success', 'Empresa activada correctamente');
        } catch (error) {
            showNotification('error', 'Error al desactivar empresa: ' + error.message);
        }

    };

    const handleDesactiveEmpresa = async (empresa) => {
        if (confirm(`¿Estás seguro de que quieres desactivar la empresa ${empresa.nombre}?`)) {
            try {
                await EmpresaService.desactivarEmpresa(empresa.id);
                loadEmpresas();
                showNotification('success', 'Empresa desactivada correctamente');
            } catch (error) {
                showNotification('error', 'Error al desactivar empresa: ' + error.message);
            }
        }
    };

    const handleSaveEmpresa = async (empresaData) => {
        try {
            if (editingEmpresa) {
                await EmpresaService.updateEmpresa(editingEmpresa.id, empresaData);
                showNotification('success', 'Empresa actualizada correctamente');
            } else {
                await EmpresaService.createEmpresa(empresaData);
                showNotification('success', 'Empresa creada correctamente');
            }
            setShowModal(false);
            loadEmpresas();
        } catch (error) {
            showNotification('error', error.message);
        }
    };

    const indexOfLastEmpresa = currentPage * empresasPerPage
    const indexOfFirstEmpresa = indexOfLastEmpresa - empresasPerPage
    const currentEmpresas = filteredEmpresas.slice(indexOfFirstEmpresa, indexOfLastEmpresa)
    const totalPages = Math.ceil(filteredEmpresas.length / empresasPerPage)

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
                    <Building className="h-8 w-8 text-blue-600" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestión de Empresas</h1>
                        <p className="text-gray-600">Gestiona las empresas en el sistema</p>
                    </div>

                    <button
                        onClick={() => { loadEmpresas() }}
                        className='flex items-center bg-linear-to-r from-sky-600 to-sky-800 text-white font-semibold p-3 rounded-full cursor-pointer'
                    >
                        <RefreshCcw />
                    </button>
                </div>
                <button
                    onClick={handleCreateEmpresa}
                    className="flex items-center gap-2 bg-linear-to-r from-sky-600 to-sky-800 text-white font-semibold py-2 px-4 rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                    <Plus className="h-4 w-4" />
                    Nueva Empresa
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
                                            <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Nombre</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Rut</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Dirección</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Telefono</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Contacto</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Estado</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Fecha</th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentEmpresas.map((empresa) => (
                                            <tr key={empresa.id} className={` ${empresa.estado === 'activa' ? 'hover:bg-gray-50' : 'hover:bg-gray-300 bg-gray-200'}`}>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{empresa.id}</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{empresa.nombre}</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{empresa.rut}</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{empresa.direccion}</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{empresa.telefono}</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{empresa.contacto}</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${empresa.estado === 'activa'
                                                        ? 'bg-emerald-200 text-emerald-800'
                                                        : 'bg-orange-200 text-orange-800'
                                                        }`}>
                                                        {empresa.estado}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(empresa.creado_en).toLocaleDateString('es-ES')}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEditEmpresa(empresa)}
                                                            className="text-blue-600 hover:text-blue-900 bg-blue-200 p-2 rounded-full cursor-pointer"
                                                            aria-label={`Editar ${empresa.nombre}`}
                                                        >
                                                            <Edit className="h-5 w-5" />
                                                        </button>
                                                        {empresa.estado === 'activa'
                                                            ? <button
                                                                onClick={() => handleDesactiveEmpresa(empresa)}
                                                                className="text-red-600 hover:text-red-900 bg-red-200 p-2 rounded-full cursor-pointer"
                                                                aria-label={`Desactivar ${empresa.nombre}`}
                                                                title={`Desactivar ${empresa.nombre}`}
                                                            >
                                                                <XIcon className="h-5 w-5" />
                                                            </button>
                                                            : <button
                                                                onClick={() => handleActiveEmpresa(empresa)}
                                                                className="text-emerald-800 hover:text-emerald-900 bg-emerald-200 p-2 rounded-full cursor-pointer"
                                                                aria-label={`Activar ${empresa.nombre}`}
                                                                title={`Activar ${empresa.nombre}`}
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
                                {currentEmpresas.map((empresa) => (
                                    <div key={empresa.id} className="p-4 bg-white">
                                        <div className="flex justify-between items-center gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div>
                                                        <div className='flex items-center'>
                                                            <div className="text-sm font-semibold text-gray-900">{empresa.id}</div>
                                                            <div className='w-5 text-center'>•</div>
                                                            <div className="text-sm font-semibold text-gray-900">{empresa.nombre}</div>
                                                        </div>

                                                    </div>
                                                    <div>
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${empresa.estado === 'activa'
                                                            ? 'bg-emerald-200 text-emerald-800'
                                                            : 'bg-orange-200 text-orange-800'
                                                            }`}>
                                                            {empresa.estado}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mb-2 text-xs text-gray-500">
                                                    <div className="text-xs text-gray-500 truncate">{empresa.contacto}</div>
                                                    <div className="text-xs text-gray-500 truncate">{empresa.telefono}</div>
                                                </div>

                                                <div className="mt-2 text-xs text-gray-500">
                                                    <div>
                                                        Creado: {new Date(empresa.creado_en).toLocaleDateString('es-ES')}
                                                    </div>
                                                    <div className='flex'>
                                                        <div>
                                                            {empresa.direccion}
                                                        </div>
                                                        <div className='w-5 text-center'>•</div>
                                                        <div>
                                                            {empresa.rut}
                                                        </div>
                                                    </div>

                                                </div>

                                            </div>

                                            <div className="flex flex-col items-center justify-between h-full gap-2 ml-2">
                                                <button
                                                    onClick={() => handleEditEmpresa(empresa)}
                                                    className="p-2 rounded-md text-blue-600 hover:text-blue-900 bg-blue-200"
                                                    aria-label={`Editar ${empresa.nombre}`}
                                                >
                                                    <Edit className="h-4 w-4 text-blue-600" />
                                                </button>

                                                {empresa.estado === 'activa'
                                                    ? <button
                                                        onClick={() => handleDesactiveEmpresa(empresa)}
                                                        className="p-2 rounded-md text-red-600 hover:text-red-900 bg-red-200"
                                                        aria-label={`Desactivar ${empresa.nombre}`}
                                                        title={`Desactivar ${empresa.nombre}`}
                                                    >
                                                        <XIcon className="h-4 w-4" />
                                                    </button>
                                                    : <button
                                                        onClick={() => handleActiveEmpresa(empresa)}
                                                        className="p-2 rounded-md text-emerald-800 hover:text-emerald-900 bg-emerald-200"
                                                        aria-label={`Activar ${empresa.nombre}`}
                                                        title={`Activar ${empresa.nombre}`}
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredEmpresas.length === 0 && (
                                <div className="text-center py-8">
                                    <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No se encontraron empresas</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {filteredEmpresas.length > 0 && (
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
                            {filteredEmpresas.length} resultados
                        </div>
                    </div>
                )}
            </div>


            {showModal && (
                <EmpresaModal
                    empresa={editingEmpresa}
                    onSave={handleSaveEmpresa}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}