import SessionHelper from '@/utils/session';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class VehiculoService {
    static async getBuses() {
        try {
            const response = await fetch(`${API_URL}buses`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${SessionHelper.getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener buses');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getBuses:', error);
            throw error;
        }
    }

    static async getBusByID(busID) {
        try {
            const response = await fetch(`${API_URL}buses/${busID}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${SessionHelper.getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.mensaje || `Vehiculo ${busID} no encontrado`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getBusByID:', error);
            throw error;
        }
    }

    static async createBus(busData) {
        try {
            const response = await fetch(`${API_URL}buses`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SessionHelper.getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(busData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.mensaje || 'Error al crear usuario');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en createBus:', error);
            throw error;
        }
    }

    static async updateBus(id, busData) {
        try {
            const response = await fetch(`${API_URL}buses/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${SessionHelper.getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(busData),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar vehículo');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en updateBus:', error);
            throw error;
        }
    }

    static async deactivateBus(id) {
        try {
            const response = await fetch(`${API_URL}buses/${id}/estado`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${SessionHelper.getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado: 'inactivo' }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.mensaje || 'Error al desactivar vehículo');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en deactivateBus:', error);
            throw error;
        }
    }

    static async activateBus(id) {
        try {
            const response = await fetch(`${API_URL}buses/${id}/estado`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${SessionHelper.getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado: 'activo' }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.mensaje || 'Error al activar vehículo');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en activateBus:', error);
            throw error;
        }
    }
}

export default VehiculoService;