import SessionHelper from '@/utils/session';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class EmpresaService {
    // 1. Crear Empresa - POST /api/empresas
    static async createEmpresa(empresaData) {
        try {
            const response = await fetch(`${API_URL}empresas`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SessionHelper.getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(empresaData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.mensaje || 'Error al crear empresa');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en createEmpresa:', error);
            throw error;
        }
    }

    // 2/3. Listar Empresas - GET /api/empresas[?incluirInactivas=true]
    // incluirInactivas: boolean (opcional)
    static async getEmpresas(incluirInactivas = false) {
        try {
            const query = incluirInactivas ? '?incluirInactivas=true' : '';
            const response = await fetch(`${API_URL}empresas${query}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${SessionHelper.getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.mensaje || 'Error al listar empresas');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getEmpresas:', error);
            throw error;
        }
    }

    // 4/5. Obtener Empresa por ID - GET /api/empresas/:id[?incluirInactivas=true]
    static async getEmpresaByID(empresaID, incluirInactivas = false) {
        try {
            const query = incluirInactivas ? '?incluirInactivas=true' : '';
            const response = await fetch(`${API_URL}empresas/${empresaID}${query}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${SessionHelper.getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.mensaje || `Empresa ${empresaID} no encontrada`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getEmpresaByID:', error);
            throw error;
        }
    }

    // 6/7. Actualizar Empresa - PUT /api/empresas/:id
    // empresaData puede incluir "estado" o no
    static async updateEmpresa(id, empresaData) {
        try {
            const response = await fetch(`${API_URL}empresas/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${SessionHelper.getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(empresaData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.mensaje || 'Error al actualizar empresa');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en updateEmpresa:', error);
            throw error;
        }
    }

    // 8. Cambiar Estado Empresa - PATCH /api/empresas/:id/estado
    // body: { estado: 'activa' | 'inactiva' }
    static async setEmpresaEstado(id, estado) {
        try {
            const response = await fetch(`${API_URL}empresas/${id}/estado`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${SessionHelper.getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.mensaje || 'Error al cambiar estado de la empresa');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en setEmpresaEstado:', error);
            throw error;
        }
    }

    // 9. Activar Empresa - PATCH /api/empresas/:id/activar
    static async activarEmpresa(id) {
        try {
            const response = await fetch(`${API_URL}empresas/${id}/activar`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${SessionHelper.getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}), // tu spec envía un body vacío
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.mensaje || 'Error al activar empresa');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en activarEmpresa:', error);
            throw error;
        }
    }

    // 10. Desactivar Empresa - PATCH /api/empresas/:id/desactivar
    static async desactivarEmpresa(id) {
        try {
            const response = await fetch(`${API_URL}empresas/${id}/desactivar`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${SessionHelper.getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}), // tu spec envía un body vacío
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.mensaje || 'Error al desactivar empresa');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en desactivarEmpresa:', error);
            throw error;
        }
    }
}

export default EmpresaService;
