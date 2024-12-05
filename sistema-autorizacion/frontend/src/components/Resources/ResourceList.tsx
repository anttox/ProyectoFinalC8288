import React from 'react';
import EditResourceForm from './EditResourceForm';

interface Resource {
  id_recurso: number;
  tipo_recurso: string;
  configuracion: string;
  estado: string;
}

interface ResourceListProps {
  searchQuery: string;
  filterStatus: string;
  resources: Resource[]; // Nueva prop para pasar recursos desde el componente padre
}

const ResourceList: React.FC<ResourceListProps> = ({ searchQuery, filterStatus, resources }) => {
  const [editingResource, setEditingResource] = React.useState<Resource | null>(null);

  // Filtrar recursos en función de searchQuery y filterStatus
  const filteredResources = resources.filter((resource) => {
    const matchesQuery = searchQuery
      ? resource.tipo_recurso.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesStatus = filterStatus ? resource.estado === filterStatus : true;
    return matchesQuery && matchesStatus;
  });

  const deleteResource = (id: number) => {
    console.log('[ResourceList] Eliminando recurso con ID:', id);
    alert(`Eliminar recurso con ID: ${id}`);
    // Aquí podrías llamar una función del componente padre para eliminar recursos
  };

  return (
    <div>
      {editingResource ? (
        <EditResourceForm
          resource={editingResource}
          onUpdate={() => {
            setEditingResource(null);
            alert('Recurso actualizado.');
          }}
        />
      ) : (
        <ul className="space-y-2">
          {filteredResources.map((resource) => (
            <li key={resource.id_recurso} className="border rounded p-4">
              <p><strong>Tipo:</strong> {resource.tipo_recurso}</p>
              <p><strong>Configuración:</strong> {resource.configuracion}</p>
              <p><strong>Estado:</strong> {resource.estado}</p>
              <button onClick={() => deleteResource(resource.id_recurso)}>Eliminar</button>
              <button onClick={() => setEditingResource(resource)}>Editar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResourceList;
