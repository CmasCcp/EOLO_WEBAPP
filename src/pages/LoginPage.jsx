import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onLogin } from '../controllers/loginControl';

export const LoginPage = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleLogin = async () => {
  const result = await onLogin(usuario, contrasena);
  if (result.success) {
    result.data.username = usuario; // Asegúrate de que el username se guarde correctamente
    console.log("Username guardado:", localStorage.getItem('username'));
    // Guardar username y cookie ya lo hace onLogin
    window.location.reload();
  } else {
    alert(result.error || 'Usuario o contraseña incorrectos');
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
