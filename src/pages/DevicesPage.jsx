import React, { useEffect, useState } from 'react';
import EoloCard from '../components/EoloCard';
import { Navbar } from '../components/Navbar';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';

export const DevicesPage = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);  // Estado para saber si los datos están cargando
    const [error, setError] = useState(null); // Estado para manejar errores

    useEffect(() => {
        // Función para obtener las sesiones desde el backend
        const fetchDevices = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_REACT_APP_API_URL + "/mis-dispositivos");  // Endpoint para obtener las sesiones
                if (!response.ok) {
                    throw new Error('Error al obtener las sesiones');
                }
                const data = await response.json();  // Parsear la respuesta JSON
                setDevices(data); // Guardar las sesiones en el estado
                console.log(data)

                // // Extraer dispositivos únicos de las sesiones
                // const uniqueDevices = [
                //     ...new Set(data.map(session => session.patente))
                // ];

                // setDevices(uniqueDevices);  // Establecer los dispositivos en el estado
            } catch (err) {
                setError(err.message);  // Si ocurre un error, almacenamos el mensaje de error
            } finally {
                setLoading(false);  // Cuando termine la carga, cambiamos el estado de loading
            }
        };

        fetchDevices();  // Llamar a la función de carga de datos
    }, []);  // El efecto se ejecuta solo una vez, al cargar el componente

    // Mostrar un mensaje mientras se están cargando los datos
    if (loading) {
        return <div>Loading...</div>;
    }

    // Mostrar un mensaje si hubo un error al cargar los datos
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Función para obtener el modelo único de un dispositivo
    const getDeviceModel = (device) => {
        // Filtrar las sesiones del dispositivo y obtener los modelos únicos
        const models = [...new Set(sessionsData.filter(session => session.dispositivo === device).map(session => session.modelo))];
        return models.length > 0 ? models[0] : "Desconocido";  // Retorna el primer modelo o "Desconocido" si no se encuentra
    };

    return (
        <div className='container-fluid p-0'>
            {/* NAVEGADOR */}
            <Navbar />
            <div className="container mt-5">
                <Breadcrumb />
                <div className="row">
                    <h2 className='col-md-9'>Mis dispositivos</h2>
                    <div className="col-md-3 d-grid d-md-block">
                        <Link to="/agregar-dispositivo" className='btn btn-dark w-100'>Agregar Dispositivo</Link>
                    </div>
                </div>
                <div className="d-flex flex-row justify-content-between flex-wrap">
                    {/* Mostrar las tarjetas de los dispositivos */}
                    {devices.map((device, index) => (
                        <EoloCard
                            index={index}
                            device={device}
                            titulo={{ "valor": device.patente, "label": "Patente" }}
                            lateral={{ "valor": device.modelo, "label": "Modelo" }}  // Mostrar el modelo dinámicamente
                        // body={`Número de sesiones: ${sessionsData.filter(session => session.dispositivo === device).length}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
