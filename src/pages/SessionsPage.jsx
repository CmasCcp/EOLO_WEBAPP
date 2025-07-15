import React from 'react'
import EoloCard from '../components/EoloCard'
import { Navbar } from '../components/Navbar'
import { Link } from 'react-router-dom'

export const SessionsPage = () => {
  return (
    <div className='container-fluid p-0'>
      {/* NAVEGADOR */}
      <Navbar />
      <div className="container mt-5">


        <div className="row">
          <h2 className='col-md-3 m-0 p-0'>EOLO MP 2</h2>

          <div className="col-md-9 m-0 p-0 d-grid gap-3 d-md-flex justify-content-md-end">

            <Link to={"/dashboard"} className='btn btn-dark'>Dashboard</Link>
            <Link to={"/dashboard"} className='btn btn-dark'>Ver Datos Online</Link>
            <Link to={"/upload-data-sessions"} className='btn btn-dark'>Agregar Sesión</Link>
          </div>
        </div>


        <Link to={"/dashboard"}>
          <EoloCard titulo="Sesión 1" lateral="30-02-25 17:54" body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et diam ante. Integer nec odio pulvinar, ornare dui ac." />
        </Link>
        <Link to={"/dashboard"}>
          <EoloCard titulo="Sesión 2" lateral="30-02-25 17:54" body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et diam ante. Integer nec odio pulvinar, ornare dui ac." />
        </Link>
        <Link to={"/dashboard"}>
          <EoloCard titulo="Sesión 3" lateral="30-02-25 17:54" body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et diam ante. Integer nec odio pulvinar, ornare dui ac." />
        </Link>
      </div>

    </div>
  )
}
