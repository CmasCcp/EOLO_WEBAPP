import React from 'react'
import EoloCard from '../components/EoloCard'
import { Navbar } from '../components/Navbar'

export const SessionsPage = () => {
  return (
    <div className='container-fluid p-0'>
      {/* NAVEGADOR */}
      <Navbar />
      <div className="container mt-5">

        <div className="row">
          <h2 className='w-25'>EOLO MP 2</h2>
          
          <div className="w-75 d-flex flex-row no-wrap justify-content-end">

            <button className='btn btn-dark mx-1'>Dashboard</button>
            <button className='btn btn-dark mx-1'>Ver Datos Online</button>
            <button className='btn btn-dark mx-1'>Agregar Sesión</button>
          </div>
        </div>

        <EoloCard titulo="Sesión 1" lateral="30-02-25 17:54" body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et diam ante. Integer nec odio pulvinar, ornare dui ac."/>
        <EoloCard titulo="Sesión 2" lateral="30-02-25 17:54" body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et diam ante. Integer nec odio pulvinar, ornare dui ac."/>
        <EoloCard titulo="Sesión 3" lateral="30-02-25 17:54" body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et diam ante. Integer nec odio pulvinar, ornare dui ac."/>
      </div>

    </div>
  )
}
