"use client";
import React, { useState, useEffect } from "react";

export default function VehiculoModal({ vehiculo, onSave, onClose }) {
  const [patente, setPatente] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (vehiculo) {
      setPatente(vehiculo.patente || "");
      setMarca(vehiculo.marca || "");
      setModelo(vehiculo.modelo || "");
      setAnio(vehiculo.anio || new Date().getFullYear());
    } else {
      setPatente("");
      setMarca("");
      setModelo("");
      setAnio(new Date().getFullYear());
    }
  }, [vehiculo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patente || !marca || !modelo) {
      alert("Patente, marca y modelo son obligatorios");
      return;
    }
    setSaving(true);
    try {
      await onSave({ patente, marca, modelo, anio });
    } catch (err) {
      console.error(err);
      alert(err.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

      <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-4">{vehiculo ? "Editar Vehículo" : "Nuevo Vehículo"}</h3>

        <label className="block mb-2 text-sm font-medium">Patente</label>
        <input type="text" value={patente} onChange={(e) => setPatente(e.target.value)} className="w-full px-3 py-2 border rounded-md mb-3 outline-none" required />

        <label className="block mb-2 text-sm font-medium">Marca</label>
        <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} className="w-full px-3 py-2 border rounded-md mb-3 outline-none" required />

        <label className="block mb-2 text-sm font-medium">Modelo</label>
        <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} className="w-full px-3 py-2 border rounded-md mb-3 outline-none" required />

        <label className="block mb-2 text-sm font-medium">Año</label>
        <input type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} className="w-full px-3 py-2 border rounded-md mb-4 outline-none" />

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-100">Cancelar</button>
          <button type="submit" disabled={saving} className="px-4 py-2 rounded-md bg-orange-600 text-white">
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
