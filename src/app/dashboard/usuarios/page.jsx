"use client"
import React, { useState, useEffect } from 'react';
import { Plus, Search, Users, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import UserService from '@/services/user.service';
import Notification from '@/components/notification';
import UserModal from '@/components/modals/userModal';


export default function UsuariosPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.rol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await UserService.getUsers();
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      showNotification('error', 'Error al cargar usuarios: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 5000);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (user) => {
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${user.nombre}?`)) {
      try {
        // await UserService.deleteUser(user.id);
        // loadUsers();
        showNotification('success', 'Usuario eliminado correctamente');
      } catch (error) {
        showNotification('error', 'Error al eliminar usuario: ' + error.message);
      }
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        // await UserService.updateUser(editingUser.id, userData);
        showNotification('success', 'Usuario actualizado correctamente');
      } else {
        // await UserService.createUser(userData);
        showNotification('success', 'Usuario creado correctamente');
      }
      setShowModal(false);
      loadUsers();
    } catch (error) {
      showNotification('error', error.message);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="p-4 md:p-6">
      <Notification type={notification.type} message={notification.message} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-gray-600">Administra los usuarios del sistema</p>
          </div>
        </div>
        <button
          onClick={handleCreateUser}
          className="flex items-center gap-2 bg-linear-to-r from-sky-600 to-sky-800 text-white font-semibold py-2 px-4 rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Nuevo Usuario
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border-2 border-gray-400 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all duration-200"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : (
            <>
              {/* Tabla para md+ */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Usuario</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Correo</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Rol</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Fecha</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.nombre}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.correo}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.rol === 'superusuario'
                            ? 'bg-purple-200 text-purple-800'
                            : user.rol === 'administrador'
                              ? 'bg-blue-200 text-blue-800'
                              : 'bg-gray-200 text-black'}`}>
                            {user.rol}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.creado_en).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-blue-600 hover:text-blue-900 bg-blue-200 p-2 rounded-full cursor-pointer"
                              aria-label={`Editar ${user.nombre}`}
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="text-red-600 hover:text-red-900 bg-red-200 p-2 rounded-full cursor-pointer"
                              aria-label={`Eliminar ${user.nombre}`}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards para móvil (sm - md) */}
              <div className="md:hidden divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <div key={user.id} className="p-4 bg-white">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{user.nombre}</div>
                            <div className="text-xs text-gray-500 truncate">{user.correo}</div>
                          </div>
                          <div>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.rol === 'superusuario'
                              ? 'bg-purple-200 text-purple-800'
                              : user.rol === 'administrador'
                                ? 'bg-blue-200 text-blue-800'
                                : 'bg-gray-200 text-black'}`}>
                              {user.rol}
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-gray-500">
                          Creado: {new Date(user.creado_en).toLocaleDateString('es-ES')}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 ml-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 rounded-md bg-blue-100 hover:bg-blue-200"
                          aria-label={`Editar ${user.nombre}`}
                        >
                          <Edit className="h-4 w-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 rounded-md bg-red-100 hover:bg-red-200"
                          aria-label={`Eliminar ${user.nombre}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No se encontraron usuarios</p>
                </div>
              )}
            </>
          )}
        </div>

        {filteredUsers.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-3 mt-4">
            <div className="flex items-center gap-2">
              <button
                className="bg-linear-to-tr from-gray-400 to-gray-500 hover:from-gray-600 hover:to-gray-800 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-600 font-medium">
                Página {currentPage} de {totalPages}
              </span>
              <button
                className="bg-linear-to-tr from-gray-400 to-gray-500 hover:from-gray-600 hover:to-gray-800 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                aria-label="Página siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="hidden sm:block text-sm text-gray-500">
              {filteredUsers.length} resultados
            </div>
          </div>
        )}
      </div>


      {showModal && (
        <UserModal
          user={editingUser}
          onSave={handleSaveUser}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}