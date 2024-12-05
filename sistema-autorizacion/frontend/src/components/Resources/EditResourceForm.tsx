import React, { useState } from 'react';
import API from '../../services/apiService';

interface EditResourceFormProps {
  resource: {
    id_recurso: number;
    tipo_recurso: string;
    configuracion: string;
    estado: string;
  };
  onUpdate: () => void;
}

const EditResourceForm: React.FC<EditResourceFormProps> = ({ resource, onUpdate }) => {
  const [tipo, setTipo] = useState(resource.tipo_recurso);
  const [configuracion, setConfiguracion] = useState(resource.configuracion);
  const [estado, setEstado] = useState(resource.estado);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.put(`api/resources/${resource.id_recurso}`, { tipo, configuracion, estado });
      alert('Recurso actualizado correctamente.');
      onUpdate();
    } catch (error: any) {
      alert('Error al actualizar recurso.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
      <div>
        <label className="block font-bold">Tipo:</label>
        <input
          type="text"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      </div>
      <div>
        <label className="block font-bold">Configuración:</label>
        <textarea
          value={configuracion}
          onChange={(e) => setConfiguracion(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        ></textarea>
      </div>
      <div>
        <label className="block font-bold">Estado:</label>
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Guardar Cambios
      </button>
    </form>
  );
};

export default EditResourceForm;
