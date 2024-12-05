import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/profile">Perfil</Link></li>
                <li><Link to="/login">Iniciar Sesión</Link></li> {/* Enlace de Login */}
                <li><Link to="/register">Registrarse</Link></li> {/* Enlace de Registro */}
            </ul>
        </nav>
    );
};

export default Navbar;
