const mockData = [
    {
        id: "p1",
        bus: { patente: "AB123CD", marca: "Mercedes", modelo: "Sprinter" },
        andén: "1",
        entrada: new Date(new Date().getTime() - 45 * 60000).toISOString(), // 45 min atrás
        salida: null,
    },
    {
        id: "p2",
        bus: { patente: "XY987ZT", marca: "Volvo", modelo: "9700" },
        andén: "2",
        entrada: new Date(new Date().getTime() - 120 * 60000).toISOString(), // 2h atrás
        salida: new Date(new Date().getTime() - 30 * 60000).toISOString(), // 30 min atrás
    }
];

const wait = ms => new Promise(r => setTimeout(r, ms));

export default {
    async getPermanencias() {
        await wait(200);
        return JSON.parse(JSON.stringify(mockData));
    }
};
