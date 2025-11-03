let _vehiculos = [
    { id: "v1", patente: "AB123CD", marca: "Mercedes", modelo: "Sprinter", anio: 2019 },
    { id: "v2", patente: "XY987ZT", marca: "Volvo", modelo: "9700", anio: 2021 },
    { id: "v3", patente: "LM456OP", marca: "Scania", modelo: "K360", anio: 2020 },
];

const wait = (ms) => new Promise(r => setTimeout(r, ms));

export default {
    async getVehiculos() {
        await wait(200);
        return JSON.parse(JSON.stringify(_vehiculos));
    },
    async createVehiculoMock(data) {
        await wait(200);
        const newItem = { id: Math.random().toString(36).slice(2, 9), ...data };
        _vehiculos.unshift(newItem);
        return newItem;
    },
    async updateVehiculoMock(id, data) {
        await wait(200);
        const idx = _vehiculos.findIndex(v => v.id === id);
        if (idx === -1) throw new Error("Vehículo no encontrado");
        _vehiculos[idx] = { ..._vehiculos[idx], ...data };
        return _vehiculos[idx];
    },
    async deleteVehiculoMock(id) {
        await wait(200);
        _vehiculos = _vehiculos.filter(v => v.id !== id);
        return true;
    }
};
