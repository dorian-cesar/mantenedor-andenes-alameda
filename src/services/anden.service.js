// services/anden.service.js
// Mock service para desarrollo local. Reemplaza con llamadas reales al backend cuando esté listo.

let _andenes = [
    { id: "a1", numero: 1, nombre: "Andén Principal", estado: "activo", descripcion: "Andén para servicios largos", creado_en: new Date().toISOString() },
    { id: "a2", numero: 2, nombre: "Andén Corto", estado: "inactivo", descripcion: "Reservado por mantenimiento", creado_en: new Date(Date.now() - 86400000).toISOString() },
    { id: "a3", numero: 3, nombre: "Andén L4", estado: "activo", descripcion: "", creado_en: new Date(Date.now() - 2*86400000).toISOString() },
  ];
  
  const wait = (ms) => new Promise(r => setTimeout(r, ms));
  
  export default {
    // lectura
    async getAndenes() {
      await wait(300); // simula latencia
      // devuelve copia para evitar mutaciones externas
      return JSON.parse(JSON.stringify(_andenes));
    },
  
    // --- MOCK create/update/delete que la UI usa mientras backend no está listo ---
    async createAndenMock(data) {
      await wait(200);
      const newItem = {
        id: Math.random().toString(36).slice(2, 9),
        numero: data.numero,
        nombre: data.nombre,
        estado: data.estado || "activo",
        descripcion: data.descripcion || "",
        creado_en: new Date().toISOString(),
      };
      _andenes.unshift(newItem);
      return newItem;
    },
  
    async updateAndenMock(id, data) {
      await wait(200);
      const idx = _andenes.findIndex(x => x.id === id);
      if (idx === -1) throw new Error("Andén no encontrado");
      _andenes[idx] = { ..._andenes[idx], ...data };
      return _andenes[idx];
    },
  
    async deleteAndenMock(id) {
      await wait(200);
      _andenes = _andenes.filter(x => x.id !== id);
      return true;
    },
  
    // Si quieres, añade funciones que llamen a fetch/axios cuando tengas el backend:
    // async createAnden(data) { return axios.post('/andenes', data) ... }
  };
  