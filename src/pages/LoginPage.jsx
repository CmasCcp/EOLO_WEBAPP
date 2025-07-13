import React from 'react'

export const LoginPage = () => {
  return (
    <body class="d-flex justify-content-center align-items-center min-vh-100">
      <div class="container card">
        <div class="container">
          <div class="p-3 text-center">
            <h2>Eolo Web</h2>
          </div>

          <form>
            <div class="mb-3">
              <label for="usuario" class="form-label">Usuario</label>
              <input type="text" class="form-control" id="usuario" required />
            </div>
            <div class="mb-3">
              <label for="contrasena" class="form-label">Contraseña</label>
              <input type="password" class="form-control" id="contrasena" required />
            </div>
            <div class="mb-3">
              <button type="submit" class="mx-auto btn w-100 btn-dark ">Iniciar Sesión</button>
            </div>

            <div class="text-center mt-3">
              <a href="#">¿Olvidaste tu contraseña?</a>
            </div>

            <hr />

            <div class="text-center">
              <p>¿No tienes una cuenta? <a href="#">Regístrate</a></p>
            </div>
          </form>
        </div>
      </div>
    </body>
  )
}