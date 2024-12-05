import React, { useState, useEffect } from 'react';
import ResourceForm from '../components/Resources/ResourceForm';
import ResourceList from '../components/Resources/ResourceList';
import API from '../services/apiService';

const Dashboard = () => {
  const [resources, setResources] = useState<any[]>([]); // Estado para recursos
  const [users, setUsers] = useState<any[]>([]); // Estado para usuarios
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log('[Dashboard] Cargando datos...');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No se encontró un token. Por favor, inicia sesión.');
          setLoading(false);
          return;
        }

        // Decodificar el token para obtener el rol del usuario
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserRole(decodedToken.rol);
        console.log('[Dashboard] Rol del usuario:', decodedToken.rol);

        // Cargar datos de recursos
        const resourcesResponse = await API.get('/api/resources');
        console.log('[Dashboard] Recursos obtenidos:', resourcesResponse.data);
        setResources(resourcesResponse.data);

        // Solo cargar usuarios si el rol es Administrador
        if (decodedToken.rol === 'Administrador') {
          const usersResponse = await API.get('/api/users/admin/users');
          console.log('[Dashboard] Usuarios obtenidos:', usersResponse.data);
          setUsers(usersResponse.data);
        }

        setLoading(false);
      } catch (error: any) {
        console.error('[Dashboard] Error al cargar datos:', error);
        setError('Error al cargar los datos del dashboard.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const updateUserRole = async (id: string, newRole: string) => {
    if (userRole !== 'Administrador') {
      alert('No tienes permiso para cambiar roles.');
      return;
    }

    console.log(`[Dashboard] Cambiando rol del usuario con ID ${id} a ${newRole}...`);
    try {
      await API.put(`/api/users/${id}/role`, { rol: newRole });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id_usuario === id ? { ...user, rol: newRole } : user
        )
      );
      alert('Rol del usuario actualizado correctamente.');
    } catch (error: any) {
      console.error('[Dashboard] Error al actualizar el rol del usuario:', error);
      alert('Error al actualizar el rol del usuario.');
    }
  };

  const deleteUser = async (id: string) => {
    if (userRole !== 'Administrador') {
      alert('No tienes permiso para eliminar usuarios.');
      return;
    }

    console.log(`[Dashboard] Eliminando usuario con ID ${id}...`);
    try {
      await API.delete(`/api/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id_usuario !== id));
      alert('Usuario eliminado correctamente.');
    } catch (error: any) {
      console.error('[Dashboard] Error al eliminar usuario:', error);
      alert('Error al eliminar usuario.');
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Panel de Control</h1>

      {/* Filtros para recursos */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar recursos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded px-4 py-2"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="">Todos</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>

      {/* Sección para gestionar recursos */}
      <ResourceForm />
      <ResourceList
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        resources={resources} // Pasar recursos como prop
      />

      {/* Mostrar usuarios solo si el rol es Administrador */}
      {userRole === 'Administrador' && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Usuarios</h2>
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
                  <button
                    onClick={() => deleteUser(user.id_usuario)}
                    className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
