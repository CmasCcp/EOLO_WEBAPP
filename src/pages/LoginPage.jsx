import React from 'react'
import { Link } from 'react-router-dom'

export const LoginPage = () => {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="container card col-md-4">
        <div className="container">
          <div className="p-3 text-center">
            <h2>Eolo Web</h2>
          </div>

            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <input type="text" className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input type="password" className="form-control" required />
            </div>
            <div className="mb-3">
              <Link to={"/devices"} type="submit" className="mx-auto btn w-100 btn-dark ">Iniciar Sesión</Link>
            </div>

            <div className="text-center mt-3">
              <a href="#">¿Olvidaste tu contraseña?</a>
            </div>

            <hr />

            <div className="text-center">
              <p>¿No tienes una cuenta? <a href="#">Regístrate</a></p>
            </div>
        </div>
      </div>
    </div>
  )
}