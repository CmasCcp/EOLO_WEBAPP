import React, { useEffect } from 'react'
import EoloCard from '../components/EoloCard'
import { Navbar } from '../components/Navbar'

export const DevicesPage = () => {


    return (
        <div className='container-fluid p-0'>
            {/* NAVEGADOR */}
            <Navbar />
            <div className="container mt-5">

            <div className="row">
                <h2 className='w-50'>Dispositivos</h2>
                <button className='ms-auto btn btn-dark w-25'> Agregar Dispositivo</button>
            </div>

            <EoloCard titulo="Eolo MP 1" lateral="Modelo 1.0" body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et diam ante. Integer nec odio pulvinar, ornare dui ac."/>
            <EoloCard titulo="Eolo MP 2" lateral="Modelo 1.0" body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et diam ante. Integer nec odio pulvinar, ornare dui ac."/>
            <EoloCard titulo="Eolo MP 3" lateral="Modelo 1.0" body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et diam ante. Integer nec odio pulvinar, ornare dui ac."/>
            </div>

        </div>
    )
}
