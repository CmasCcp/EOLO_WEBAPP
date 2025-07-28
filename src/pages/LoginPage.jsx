import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (usuario === 'admin' && contrasena === 'admin') {
      console.log("login")
      // Crear cookie 'logged=true' con duración de 1 hora
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 1); // Establece la expiración a 1 hora
      document.cookie = `logged=true; expires=${expirationDate.toUTCString()}; path=/`;
      
      // navigate('/');
      window.location.reload();
      console.log("navigate")
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="container card col-md-4">
        <div className="container">
          <div className="p-3 text-center">
            <h2>Eolo Web</h2>
          </div>

          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input 
              type="text" 
              className="form-control" 
              value={usuario} 
              onChange={(e) => setUsuario(e.target.value)} 
              required 
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-control" 
              value={contrasena} 
              onChange={(e) => setContrasena(e.target.value)} 
              required 
            />
          </div>

          <div className="mb-3">
            <button 
              type="button" 
              className="mx-auto btn w-100 btn-dark" 
              onClick={handleLogin}
            >
              Iniciar Sesión
            </button>
          </div>
{/* 
          <div className="text-center mt-3">
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>

          <hr />

          <div className="text-center">
            <p>¿No tienes una cuenta? <a href="#">Regístrate</a></p>
          </div> */}
        </div>
      </div>
    </div>
  );
};
