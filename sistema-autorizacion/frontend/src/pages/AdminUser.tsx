import React, { useEffect, useState } from 'react';
import API from './../services/apiService';

const AdminUser = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    console.log('[AdminUser] Verificando autorización del usuario...');
    const verifyAuthorization = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('[AdminUser] Token no encontrado.');
        setError('No se encontró un token. Por favor, inicia sesión.');
        setLoading(false);
        return;
      }

      let userRole;
      try {
        console.log('[AdminUser] Decodificando token...');
        userRole = JSON.parse(atob(token.split('.')[1])).rol;
        console.log('[AdminUser] Rol del usuario:', userRole);
      } catch (decodeError) {
        console.error('[AdminUser] Error al decodificar el token:', decodeError);
        setError('Error al verificar el token.');
        setLoading(false);
        return;
      }

      if (userRole !== 'Administrador') {
        console.warn('[AdminUser] Usuario no autorizado. Rol:', userRole);
        setError('Acceso denegado. Solo los administradores pueden gestionar usuarios.');
        setLoading(false);
        return;
      }

      console.log('[AdminUser] Usuario autorizado.');
      setIsAuthorized(true);
    };

    verifyAuthorization();
  }, []);

  useEffect(() => {
    if (!isAuthorized) {
      console.log('[AdminUser] Usuario no autorizado. Abortando fetchUsers.');
      return;
    }

    const fetchUsers = async () => {
      console.log('[AdminUser] Iniciando solicitud para obtener usuarios...');
      try {
        const response = await API.get('/api/users/admin/users');
        console.log('[AdminUser] Usuarios obtenidos:', response.data);
        setUsers(response.data);
      } catch (fetchError: any) {
        console.error('[AdminUser] Error al obtener usuarios:', fetchError.response?.data || fetchError.message);
        setError(fetchError.response?.data?.mensaje || 'Error al obtener usuarios.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAuthorized]);

  const updateUserRole = async (id: string, newRole: string) => {
    console.log(`[AdminUser] Actualizando rol del usuario ${id} a ${newRole}...`);
    try {
      await API.put(`/api/users/${id}/role`, { rol: newRole });
      console.log('[AdminUser] Rol actualizado correctamente.');
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id_usuario === id ? { ...user, rol: newRole } : user
        )
      );
    } catch (error: any) {
      console.error('[AdminUser] Error al actualizar rol:', error.response?.data || error.message);
    }
  };

  const deleteUser = async (id: string) => {
    console.log(`[AdminUser] Eliminando usuario con ID ${id}...`);
    try {
      await API.delete(`/api/users/${id}`);
      console.log('[AdminUser] Usuario eliminado correctamente.');
      setUsers((prevUsers) => prevUsers.filter((user) => user.id_usuario !== id));
    } catch (error: any) {
      console.error('[AdminUser] Error al eliminar usuario:', error.response?.data || error.message);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Gestión de Usuarios</h2>
      {users.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id_usuario} className="border rounded p-4">
              <p><strong>Nombre:</strong> {user.nombre}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Rol:</strong> {user.rol}</p>
              <select
                value={user.rol}
                onChange={(e) => updateUserRole(user.id_usuario, e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="Operador">Operador</option>
                <option value="Administrador">Administrador</option>
              </select>
              <div className="mt-2">
                <button
                  onClick={() => deleteUser(user.id_usuario)}
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminUser;
