import React from 'react'
import { Navbar } from '../components/Navbar'
import { Link } from 'react-router-dom'
import { Breadcrumb } from '../components/Breadcrumb'

export const AddDevicesPage = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <Breadcrumb />



        <h2 className="fw-bold mb-4">Agregar Dispositivo:</h2>

        <form>
          {/* Nombre */}
          <div className="mb-4">
            <label htmlFor="nombre" className="form-label fw-semibold">
              Nombre:
            </label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              placeholder="Eolo MP 4"
              disabled
            />
          </div>

          {/* Modelo */}
          <div className="mb-4">
            <label htmlFor="modelo" className="form-label fw-semibold">
              Modelo:
            </label>
            <select className="form-select" id="modelo" disabled>

              <option>Modelo 1.0</option>
              <option>Modelo 2.0</option>
              <option>Modelo 3.0</option>
            </select>
          </div>

          {/* Comentarios */}
          <div className="mb-4">
            <label htmlFor="comentarios" className="form-label fw-semibold">
              Comentarios:
            </label>
            <textarea
              className="form-control"
              id="comentarios"
              rows="3"
              placeholder="Dedicado a recolectar datos en Santiago"
            ></textarea>
          </div>

          {/* Botón */}
          <div className="row">
            <Link to={"/devices"} type="submit" className="btn btn-dark w-25 text-center ms-auto">
              Agregar Dispositivo
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
