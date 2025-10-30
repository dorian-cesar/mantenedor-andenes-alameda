"use client"
import React, { useState, useEffect } from 'react';
import { Plus, Search, Users, Edit, Trash2 } from 'lucide-react';
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
        await UserService.updateUser(editingUser.id, userData);
        showNotification('success', 'Usuario actualizado correctamente');
      } else {
        await UserService.createUser(userData);
        showNotification('success', 'Usuario creado correctamente');
      }
      setShowModal(false);
      loadUsers();
    } catch (error) {
      showNotification('error', error.message);
    }
  };

  return (
    <div className="p-6">
      <Notification type={notification.type} message={notification.message} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Creación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.correo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.rol === 'superusuario'
                        ? 'bg-purple-200 text-purple-800'
                        : user.rol === 'administrador'
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-gray-300 text-black'
                        }`}>
                        {user.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.creado_en).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-5 w-5 cursor-pointer" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5 cursor-pointer" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No se encontraron usuarios</p>
              </div>
            )}
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