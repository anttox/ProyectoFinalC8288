import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { register } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<{
    nombre: string;
    email: string;
    contraseña: string;
    rol: string;
  }>({
    nombre: '',
    email: '',
    contraseña: '',
    rol: 'Operador',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(register(formData)).unwrap();
      toast.success('Usuario registrado correctamente');
      window.location.href = '/login';
    } catch (error: any) {
      toast.error(error || 'Error al registrar usuario.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Registro</h1>
      <input
        type="text"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Correo electrónico"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={formData.contraseña}
        onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })}
        required
      />
      <select
        value={formData.rol}
        onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
      >
        <option value="Operador">Operador</option>
        <option value="Administrador">Administrador</option>
      </select>
      <button type="submit">Registrarse</button>
    </form>
  );
};

export default Register;
