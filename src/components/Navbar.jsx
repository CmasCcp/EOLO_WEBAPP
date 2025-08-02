import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onLogout } from '../controllers/loginControl';

export const Navbar = () => {
  // Suponiendo que el username está en localStorage (ajusta según tu lógica real)
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Llamar a la función de logout
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">EOLO WEB</Link>
        <div className="d-flex align-items-center ms-auto">
          <span className="text-white me-3">
            <i className="bi bi-person-circle me-1"></i>
            {username}
          </span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
};