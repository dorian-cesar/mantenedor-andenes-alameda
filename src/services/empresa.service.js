import SessionHelper from '@/utils/session';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper para estandarizar la respuesta: preferimos devolver json.data si existe.
const extractData = (json) => {
    if (!json) return null;
    // Si la respuesta tiene { success, data, total } devolvemos data
    if (typeof json === 'object' && Array.isArray(json.data)) return json.data;
    // Para endpoints que retornan un objeto en data: { data: { ... } }
    if (typeof json === 'object' && json.data && !Array.isArray(json.data)) return json.data;
    // Si no hay campo data, devolvemos el json completo (útil para mensajes o estructuras distintas)
    return json;
};

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

            const json = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(json.mensaje || 'Error al crear empresa');
            }

            // devolver la parte útil (data o el json)
            return extractData(json) ?? json;
        } catch (error) {
            console.error('Error en createEmpresa:', error);
            throw error;
        }
    }

    // 2/3. Listar Empresas - GET /api/empresas[?incluirInactivas=true]
    static async getEmpresas(incluirInactivas = false, extract = true) {
        try {
            const query = incluirInactivas ? '?incluirInactivas=true' : '';
            const response = await fetch(`${API_URL}empresas${query}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${SessionHelper.getToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const json = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(json.mensaje || 'Error al listar empresas');
            }

            if (extract) {
                const data = extractData(json);
                return Array.isArray(data) ? data : (data ? [data] : []);
                return data
            } else {
                const data = json;
                return data
            }

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

            const json = await response.json().catch(() => ({}));

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.mensaje || `Empresa ${empresaID} no encontrada`);
            }

            // devolver el objeto de la empresa (data puede ser objeto o array)
            const data = extractData(json);
            // si el backend envía data: { ... } devolvemos ese objeto
            // si por alguna razón viene un array, devolvemos el primer elemento
            if (Array.isArray(data)) return data[0] ?? null;
            return data ?? null;
        } catch (error) {
            console.error('Error en getEmpresaByID:', error);
            throw error;
        }
    }

    // 6/7. Actualizar Empresa - PUT /api/empresas/:id
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

            const json = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(json.mensaje || 'Error al actualizar empresa');
            }

            return extractData(json) ?? json;
        } catch (error) {
            console.error('Error en updateEmpresa:', error);
            throw error;
        }
    }

    // 8. Cambiar Estado Empresa - PATCH /api/empresas/:id/estado
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

            const json = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(json.mensaje || 'Error al cambiar estado de la empresa');
            }

            return extractData(json) ?? json;
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
                body: JSON.stringify({}),
            });

            const json = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(json.mensaje || 'Error al activar empresa');
            }

            return extractData(json) ?? json;
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
                body: JSON.stringify({}),
            });

            const json = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(json.mensaje || 'Error al desactivar empresa');
            }

            return extractData(json) ?? json;
        } catch (error) {
            console.error('Error en desactivarEmpresa:', error);
            throw error;
        }
    }
}

export default EmpresaService;
