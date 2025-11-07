"use client"
import React, { useState, useEffect } from 'react';
import { X, Users2, Building, Barcode, Tag, CircleStar, Puzzle } from 'lucide-react';
import EmpresaService from '@/services/empresa.service';
import SessionHelper from '@/utils/session';

const sanitizePatente = (val = "") => {
  return String(val).toUpperCase().replace(/[^A-Z0-9]/g, '');
};

const sanitizeTag = (val = "") => {
  return String(val).toUpperCase().replace(/[^A-Z0-9\-_.]/g, '');
};

const extractArray = (resp) => {
  if (!resp) return [];
  if (Array.isArray(resp)) return resp;
  if (resp && Array.isArray(resp.data)) return resp.data;
  return [];
};

export default function VehiculoModal({ bus, onSave, onClose }) {
  const [formData, setFormData] = useState({
    patente: '',
    tag_uhf: '',
    marca: '',
    modelo: '',
    capacidad: '',
    empresa_id: '',
    estado: 'activo'
  });
  const [loading, setLoading] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [superUser, setSuperUser] = useState(false);

  useEffect(() => {
    const currentUser = SessionHelper.getUser();
    setSuperUser(Number(currentUser?.id) === 1);
  }, []);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const res = await EmpresaService.getEmpresas();
        const lista = extractArray(res);
        setEmpresas(lista);
      } catch (err) {
        console.error('Error al obtener empresas:', err);
        setEmpresas([]);
      }
    };
    fetchEmpresas();
  }, []);

  useEffect(() => {
    if (bus) {
      setFormData({
        patente: bus.patente ? sanitizePatente(bus.patente) : '',
        tag_uhf: bus.tag_uhf ? sanitizeTag(bus.tag_uhf) : '',
        marca: bus.marca || '',
        modelo: bus.modelo || '',
        capacidad: bus.capacidad ?? '',
        empresa_id: bus.empresa_id ?? '',
        estado: bus.estado || 'activo'
      });
    } else {
      setFormData({
        patente: '',
        tag_uhf: '',
        marca: '',
        modelo: '',
        capacidad: '',
        empresa_id: '',
        estado: 'activo'
      });
    }
  }, [bus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        patente: sanitizePatente(formData.patente),
        tag_uhf: sanitizeTag(formData.tag_uhf),
        marca: formData.marca || '',
        modelo: formData.modelo || '',
        capacidad: Number(formData.capacidad) || 0,
        empresa_id: Number(formData.empresa_id) || null,
        estado: formData.estado || 'activo'
      };

      if (!dataToSend.patente) throw new Error('Patente requerida');
      if (!dataToSend.tag_uhf) throw new Error('Tag UHF requerido');
      if (!dataToSend.empresa_id) throw new Error('Empresa requerida');

      await onSave(dataToSend);
    } catch (err) {
      console.error('Error al guardar vehículo:', err);
      alert(err?.message || 'Error al guardar vehículo');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'patente') {
      setFormData(prev => ({ ...prev, patente: sanitizePatente(value) }));
      return;
    }

    if (name === 'tag_uhf') {
      setFormData(prev => ({ ...prev, tag_uhf: sanitizeTag(value) }));
      return;
    }

    if (name === 'capacidad') {
      const num = value === '' ? '' : Number(value);
      setFormData(prev => ({ ...prev, capacidad: num }));
      return;
    }

    if (name === 'empresa_id') {
      setFormData(prev => ({ ...prev, empresa_id: value }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-400">
          <h2 className="text-xl font-semibold">
            {bus ? 'Editar Vehículo' : 'Nuevo Vehículo'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patente
            </label>
            <div className="relative">
              <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                name="patente"
                value={formData.patente}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-12 py-3 border-2 border-gray-400 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200"
                placeholder="Ej: AB123CD"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tag UHF
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                name="tag_uhf"
                value={formData.tag_uhf}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-12 py-3 border-2 border-gray-400 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200"
                placeholder="Ej: TAG001"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marca
            </label>
            <div className="relative">
              <CircleStar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-12 py-3 border-2 border-gray-400 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200"
                placeholder="Ej: Mercedes"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modelo
            </label>
            <div className="relative">
              <Puzzle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-12 py-3 border-2 border-gray-400 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200"
                placeholder="Ej: Benz O500U"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacidad
            </label>
            <div className="relative">
              <Users2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="number"
                name="capacidad"
                value={formData.capacidad}
                onChange={handleChange}
                required
                min={0}
                className="w-full pl-11 pr-12 py-3 border-2 border-gray-400 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200"
                placeholder="Ej: 45"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Empresa
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                name="empresa_id"
                value={formData.empresa_id}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-12 py-3 border-2 border-gray-400 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200"
              >
                <option value="">Seleccionar empresa...</option>
                {empresas.map((empresa) => (
                  <option key={empresa.id} value={empresa.id}>
                    {empresa.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border-2 border-gray-400 rounded-xl text-gray-700 hover:bg-gray-300 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-linear-to-r from-sky-600 to-sky-800 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Guardando...' : (bus ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
