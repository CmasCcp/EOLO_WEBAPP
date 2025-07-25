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



        <h2 className="fw-bold mb-4">Asociar dispositivo</h2>

        <form>
          {/* Nombre */}
          <div className="mb-4">
            <label htmlFor="nombre" className="form-label fw-semibold">
              Patente dispositivo:
            </label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              placeholder="ej: 123ABC"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="nombre" className="form-label fw-semibold">
              Pin dispositivo:
            </label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              placeholder="ej: 12345"
            />
          </div>
          <div className="mb-4 ms-auto">
            <button className='ms-auto'>Buscar dispositivo</button>
          </div>

          {/* Modelo */}
          {/* TODO: CAMBIAR ESTO A UNA DESCRIPCION DEL DISPOSITIVO QUE TIENE LA PATENTE INSERTADA */}
          <div className="mb-4">
            <select className="form-select" id="modelo" disabled>
              <option>Modelo 2.0</option>
              {/* <option>Modelo 3.0</option> */}
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
              placeholder="Puede agregar notas en este campo."
            ></textarea>
          </div>


          {/* Botón */}
          {/* TODO: LUEGO DEBE INGRESAR PIN DEL DISPOSITIVO */}
          {/* TODO: EN CASO DE VALIDAR PIN AGREGAR DISPOSITIVO A BASE DE DATOS */}
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
