import React, { useEffect, useState } from 'react';
import EoloCard from '../components/EoloCard';
import { Navbar } from '../components/Navbar';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';
import { SessionCard } from '../components/SessionCard';

export const SessionsPage = () => {
  let params = useParams();
  const [titulo, setTitulo] = useState(params.deviceSessions);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);  // Estado para saber si los datos están cargando
  const [error, setError] = useState(null); // Estado para manejar errores

  // Efecto para obtener los datos de las sesiones desde el backend
  useEffect(() => {
    // Hacer la solicitud GET para obtener las sesiones
    const fetchSessions = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_REACT_APP_API_URL+'/mis-sesiones');  // Endpoint para obtener las sesiones
        if (!response.ok) {
          throw new Error('Error al obtener las sesiones');
        }
        const data = await response.json();  // Parsear la respuesta JSON
        console.log(data)
        // Filtrar las sesiones por el dispositivo actual
        const sessionsForDevice = data.filter(session => session.patente === titulo);
        setFilteredSessions(sessionsForDevice);  // Guardar las sesiones filtradas en el estado
      } catch (err) {
        setError(err.message);  // Si ocurre un error, almacenamos el mensaje de error
      } finally {
        setLoading(false);  // Cuando termine la carga, cambiamos el estado de loading
      }
    };

    fetchSessions();  // Llamar a la función de carga de datos
  }, [titulo]);  // El efecto se ejecutará cada vez que cambie el valor de `titulo`

  // Mostrar un mensaje mientras se están cargando los datos
  if (loading) {
    return <div>Loading...</div>;
  }

  // Mostrar un mensaje si hubo un error al cargar los datos
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='container-fluid p-0'>
      {/* NAVEGADOR */}
      <Navbar />
      <div className="container mx-auto px-0 mt-5">
        <Breadcrumb />

        <div className="row">
          <h2 className='col-md-3 m-0 p-0'>{titulo}</h2>

          <div className="col-md-9 m-0 p-0 d-grid gap-3 d-md-flex justify-content-md-end">

            {/* TODO: DEBE DEPENDER DEL MODELO DEL DISPOSITIVO */}
            <Link to={`/datos/${titulo}`} className='btn btn-dark'>Mediciones del dispositivo</Link>
            <Link to={"agregar-sesion"} className='btn btn-dark'>Agregar Sesión</Link>
            {/* <Link to={"/dashboard"} className='btn btn-dark'>Ver Datos Online</Link> */}
          </div>
        </div>
        <div className="d-flex flex-row flex-wrap justify-content-between">

        {/* Mostrar las sesiones filtradas */}
        {filteredSessions.map((session, index) => (
          // <Link key={index} to={`/dashboard/${titulo}/Sesión_${session.sesion_id}`}>
          //   <EoloCard
          //     className="col-md-5"
          //     titulo={`Sesión_${session.sesion_id}`}
          //     lateral={`${session.dia_inicial}-${session.mes_inicial}-${session.año_inicial} ${session.hora_inicio}`}
          //     body={session.descripcion}
          //   />
          // </Link>
          <SessionCard
            index={index}
            titulo={titulo}
            session={session}
            // color={index % 2 === 0 ? "white" : "secondary"}
            color={"white"}
            day={session.dia_inicial} 
            year={session.año_inicial} 
            month={session.mes_inicial} 
            hourStart={session.hora_inicio} 
            ubicacion={session.ubicacion_corto}
            final_day={session.dia_final}
            final_month={session.mes_final}
            final_year={session.año_final}
            hourFinal={session.hora_fin}
            />
        ))}
        </div>
      </div>
    </div>
  );
};
