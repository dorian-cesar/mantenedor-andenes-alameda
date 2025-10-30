import SessionHelper from '@/utils/session';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class UserService {
    static async getUsers() {
        try {
            const response = await fetch(`${API_URL}users`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${SessionHelper.getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener usuarios');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getUsers:', error);
            throw error;
        }
    }

    static async createUser(userData) {
        try {
            const response = await fetch(`${API_URL}users`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SessionHelper.getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.mensaje || 'Error al crear usuario');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en createUser:', error);
            throw error;
        }
    }

    static async updateUser(id, userData) {
        try {
            const response = await fetch(`${API_URL}users/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${SessionHelper.getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar usuario');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en updateUser:', error);
            throw error;
        }
    }

    static async deleteUser(id) {
        try {
            const response = await fetch(`${API_URL}users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${SessionHelper.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al eliminar usuario');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en deleteUser:', error);
            throw error;
        }
    }
}

export default UserService;