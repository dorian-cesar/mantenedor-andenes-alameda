"use client"
import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, Building, IdCard, CornerUpRight } from 'lucide-react';
import SessionHelper from '@/utils/session';

const formatRut = (raw) => {
    if (!raw) return '';
    const s = raw.toString().toUpperCase().replace(/[^0-9K]/g, '');
    if (s.length === 0) return '';
    if (s.length === 1) return s;
    const dv = s.slice(-1);
    const body = s.slice(0, -1);
    const bodyWithDots = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${bodyWithDots}-${dv}`;
};

const unformatRut = (value) => {
    if (!value) return '';
    return value.toString().toUpperCase().replace(/[^0-9K]/g, '');
};

const formatPhone = (value) => {
    if (!value) return "";

    const cleaned = value.replace(/[^\d+]/g, "");

    const hasPlus = cleaned.startsWith("+");
    const digits = hasPlus ? cleaned.slice(1) : cleaned;

    let formatted = digits;

    if (digits.length <= 2) {
        formatted = digits; // +56
    } else if (digits.length <= 3) {
        formatted = `${digits.slice(0, 2)} ${digits.slice(2)}`;
    } else if (digits.length <= 7) {
        formatted = `${digits.slice(0, 2)} ${digits.slice(2, 3)} ${digits.slice(3)}`;
    } else if (digits.length <= 11) {
        formatted = `${digits.slice(0, 2)} ${digits.slice(2, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
    } else {
        formatted = `${digits.slice(0, 2)} ${digits.slice(2, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 11)}`;
    }

    return hasPlus ? `+${formatted}` : formatted;
};

export default function EmpresaModal({ empresa, onSave, onClose }) {
    const [formData, setFormData] = useState({
        nombre: '',
        rut: '',
        direccion: '',
        telefono: '',
        contacto: '',
        estado: 'activa'
    });
    const [loading, setLoading] = useState(false);
    const [superUser, setSuperUser] = useState(false);

    useEffect(() => {
        const currentUser = SessionHelper.getUser();
        setSuperUser(Number(currentUser?.id) === 1);
    }, []);

    useEffect(() => {
        if (empresa) {
            setFormData({
                nombre: empresa.nombre || '',
                rut: unformatRut(empresa.rut || ''),
                direccion: empresa.direccion || '',
                telefono: empresa.telefono || '',
                contacto: empresa.contacto || '',
                estado: empresa.estado || 'activa'
            });
        } else {
            setFormData({
                nombre: '',
                rut: '',
                direccion: '',
                telefono: '',
                contacto: '',
                estado: 'activa'
            });
        }
    }, [empresa]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToSend = {
                ...formData,
                rut: formatRut(formData.rut),
                telefono: formData.telefono.replace(/\s+/g, ""),
            };

            await onSave(dataToSend);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let newValue = value;

        if (name === "rut") {
            newValue = formatRut(value);
        } else if (name === "telefono") {
            newValue = formatPhone(value);
        }

        setFormData({
            ...formData,
            [name]: newValue,
        });
    };


    return (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
                <div className="flex justify-between items-center p-6 border-b border-gray-400">
                    <h2 className="text-xl font-semibold">
                        {empresa ? 'Editar Empresa' : 'Nueva Empresa'}
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                        <div className="relative">
                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                className="w-full pl-11 pr-12 py-3 border-2 border-gray-400 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200"
                                placeholder="Ej: Empresa ABC"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rut</label>
                        <div className="relative">
                            <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                name="rut"
                                value={formatRut(formData.rut)}
                                onChange={handleChange}
                                inputMode="numeric"
                                required
                                className="w-full pl-11 pr-12 py-3 border-2 border-gray-400 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200"
                                placeholder="Ej: 12345678-9"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                        <div className="relative">
                            <CornerUpRight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                required
                                className="w-full pl-11 pr-12 py-3 border-2 border-gray-400 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200"
                                placeholder="Ej: Av. Principal 123, Santiago"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefono</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                required
                                className="w-full pl-11 pr-12 py-3 border-2 border-gray-400 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200"
                                placeholder="Ej: +56 2 2345 6789"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contacto</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="email"
                                name="contacto"
                                value={formData.contacto}
                                onChange={handleChange}
                                required
                                className="w-full pl-11 pr-12 py-3 border-2 border-gray-400 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200"
                                placeholder="Ej: contacto@empresaejemplo.cl"
                            />
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
                            {loading ? 'Guardando...' : (empresa ? 'Actualizar' : 'Crear')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
