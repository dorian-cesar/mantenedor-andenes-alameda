"use client";
import React, { useState, useEffect } from "react";

export default function AndenModal({ anden, onSave, onClose }) {
  const [numero, setNumero] = useState("");
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState("activo");
  const [descripcion, setDescripcion] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (anden) {
      setNumero(anden.numero || "");
      setNombre(anden.nombre || "");
      setEstado(anden.estado || "activo");
      setDescripcion(anden.descripcion || "");
    } else {
      setNumero("");
      setNombre("");
      setEstado("activo");
      setDescripcion("");
    }
  }, [anden]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!numero || !nombre) {
      alert("Número y nombre son obligatorios");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        numero,
        nombre,
        estado,
        descripcion,
      });
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
        <h3 className="text-lg font-semibold mb-4">{anden ? "Editar Andén" : "Nuevo Andén"}</h3>

        <label className="block mb-2 text-sm font-medium">Número</label>
        <input
          type="number"
          value={numero}
          onChange={(e) => setNumero(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-md mb-3 outline-none"
          required
        />

        <label className="block mb-2 text-sm font-medium">Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full px-3 py-2 border rounded-md mb-3 outline-none"
          required
        />

        <label className="block mb-2 text-sm font-medium">Estado</label>
        <select value={estado} onChange={(e) => setEstado(e.target.value)} className="w-full px-3 py-2 border rounded-md mb-3">
          <option value="activo">activo</option>
          <option value="inactivo">inactivo</option>
        </select>

        <label className="block mb-2 text-sm font-medium">Descripción</label>
        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full px-3 py-2 border rounded-md mb-4" rows={3} />

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-100">Cancelar</button>
          <button type="submit" disabled={saving} className="px-4 py-2 rounded-md bg-emerald-600 text-white">
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
