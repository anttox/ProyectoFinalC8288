import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminUser from './pages/AdminUser';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './hoc/ProtectedRoute'; // Importamos ProtectedRoute

const App = () => {
    return (
        <>
            <Navbar />
            <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Ruta protegida: accesible solo para usuarios autenticados */}
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute allowedRoles={['Operador', 'Administrador']}>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />

                {/* Ruta protegida: accesible solo para administradores */}
                <Route 
                    path="/admin/users" 
                    element={
                        <ProtectedRoute allowedRoles={['Administrador']}>
                            <AdminUser />
                        </ProtectedRoute>
                    } 
                />

                {/* Ruta protegida: accesible para todos los usuarios autenticados */}
                <Route 
                    path="/profile" 
                    element={
                        <ProtectedRoute allowedRoles={['Operador', 'Administrador']}>
                            <Profile />
                        </ProtectedRoute>
                    } 
                />
            </Routes>
            <Footer />
        </>
    );
};

export const AppWithRouter = () => (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

export default AppWithRouter;
