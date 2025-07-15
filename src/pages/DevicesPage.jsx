import React, { useEffect } from 'react'
import EoloCard from '../components/EoloCard'
import { Navbar } from '../components/Navbar'
import { Link } from 'react-router-dom'

export const DevicesPage = () => {


    return (
        <div className='container-fluid p-0'>
            {/* NAVEGADOR */}
            <Navbar />
            <div className="container mt-5">

            <div className="row">
                <h2 className='col-md-9'>Dispositivos</h2>
                <div className="col-md-3 d-grid d-md-block">
                    <Link to="/add-device" className='btn btn-dark w-100'>Agregar Dispositivo</Link>
                </div>
            </div>

            <Link to={"/sessions"}>
                <EoloCard titulo="Eolo MP 1" lateral="Modelo 1.0" body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et diam ante. Integer nec odio pulvinar, ornare dui ac."/>
            </Link>
            <Link to={"/sessions"}>
                <EoloCard titulo="Eolo MP 2" lateral="Modelo 1.0" body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et diam ante. Integer nec odio pulvinar, ornare dui ac."/>
            </Link>
            <Link to={"/sessions"}>
                <EoloCard titulo="Eolo MP 3" lateral="Modelo 1.0" body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean et diam ante. Integer nec odio pulvinar, ornare dui ac."/>
            </Link>
            </div>

        </div>
    )
}
