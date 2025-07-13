import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">EOLO WEB</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/devices">Dispositivos</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/add-device">Agregar Dispositivo</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/sessions">Sesiones</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/upload-data-sessions">Agregar Sesión</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};
