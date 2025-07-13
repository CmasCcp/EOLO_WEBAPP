import React from 'react'
import { Navbar } from '../components/Navbar'

export const UploadDataSessionPage = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="fw-bold mb-4">Agregar sesión:</h2>

        <form>
          {/* Nombre */}
          <div className="mb-4">
            <label htmlFor="nombre" className="form-label fw-semibold">
              Código de dispositivo:
            </label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              placeholder="Eolo MP 2 - 12345"
              disabled
            />
          </div>
          {/* Nombre */}
          <div className="mb-4">
            <label htmlFor="nombre" className="form-label fw-semibold">
              Fecha:
            </label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              placeholder="DD-MM-YYYY"
            />
          </div>

          {/* HORA */}
          <div className="mb-4">
            <label htmlFor="nombre" className="form-label fw-semibold">
              Hora de inicio:
            </label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              placeholder="HH:MM"
            />
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

          {/* Localización */}
          <div className="mb-4">
            <label htmlFor="comentarios" className="form-label fw-semibold">
              Localización:
            </label>

            <div className="border" style={{ height: "200px", width: "100%", overflow: "hidden" }}>
              <iframe
                title="Mapa"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src="https://www.openstreetmap.org/export/embed.html?bbox=-73.15%2C-36.82%2C-73.05%2C-36.78&layer=mapnik"
                allowFullScreen
              ></iframe>
            </div>
          </div>


          {/* Cargar datos sesion SD */}
          <div className="row">
            <button type="submit" className="btn btn-secondary w-25 text-center ms-auto">
              Cargar Datos SD
            </button>
          </div>
          {/* Botón */}
          <div className="row">
            <button type="submit" className="btn btn-dark w-25 text-center ms-auto">
              Agregar Dispositivo
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
