import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { login } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<{ email: string; contraseña: string }>({
    email: '',
    contraseña: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login(formData)).unwrap();
      toast.success('Inicio de sesión exitoso');
      window.location.href = '/dashboard';
    } catch (error: any) {
      toast.error(error || 'Credenciales incorrectas.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Iniciar Sesión</h1>
      <input
        type="email"
        placeholder="Email"
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
      <button type="submit">Iniciar sesión</button>
    </form>
  );
};

export default Login;
