import React from 'react'
import { Link } from 'react-router-dom';
import 'animate.css';
import { RenderComponent } from '../components/RenderComponent';

export const HomePage = () => {
    return (
        <div className="container-fluid p-5 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'black', height: '100vh' }}>
            <div className="text-center text-white">

                {/* <RenderComponent /> */}
                {/* <iframe id="vs_iframe" src="https://www.viewstl.com/?embedded&local=C:/Users/DREAMFYRE 5/Desktop/Proyectos/EOLO_WEBAPP/src/components/Eolo de Polvo 1_.stl" style={{"border":0,"margin":0,"width":"100%","height":"100%"}}></iframe> */}
                
                <h1 className='animate__animated animate__backInDown animate__fast'>Bienvenido a ELUN</h1>
                <p>Seleccione una opción para continuar</p>

                <div className="d-flex justify-content-center gap-3">
                    {/* Botón para ver dispositivos */}
                    <Link to="/dispositivos">
                        <button className="btn btn-light btn-lg animate__animated animate__bounce animate__fast animate__delay-2s">Ver mis dispositivos</button>
                    </Link>

                    {/* Botón para ver datos */}
                    <Link to="/datos">
                        <button className="btn btn-light btn-lg animate__animated animate__bounce animate__fast animate__delay-3s">Ver Datos</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};