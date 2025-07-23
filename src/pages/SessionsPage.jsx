import React, { useEffect, useState } from 'react';
import EoloCard from '../components/EoloCard';
import { Navbar } from '../components/Navbar';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';

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
        const response = await fetch('http://127.0.0.1:5000/sesiones');  // Endpoint para obtener las sesiones
        if (!response.ok) {
          throw new Error('Error al obtener las sesiones');
        }
        const data = await response.json();  // Parsear la respuesta JSON

        // Filtrar las sesiones por el dispositivo actual
        const sessionsForDevice = data.filter(session => session.dispositivo === titulo);
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
      <div className="container mt-5">
        <Breadcrumb />

        <div className="row">
          <h2 className='col-md-3 m-0 p-0'>{titulo}</h2>

          <div className="col-md-9 m-0 p-0 d-grid gap-3 d-md-flex justify-content-md-end">
            <Link to={`/dashboard/${titulo}`} className='btn btn-dark'>Dashboard</Link>
            <Link to={"/dashboard"} className='btn btn-dark'>Ver Datos Online</Link>
            <Link to={"upload-data-sessions"} className='btn btn-dark'>Agregar Sesión</Link>
          </div>
        </div>

        {/* Mostrar las sesiones filtradas */}
        {filteredSessions.map((session, index) => (
          <Link key={index} to={`/dashboard/${titulo}/Sesión_${session.sesion_id}`}>
            <EoloCard
              className="col-md-5"
              titulo={`Sesión_${session.sesion_id}`}
              lateral={`${session.dia_inicial}-${session.mes_inicial}-${session.año_inicial} ${session.hora_inicio}`}
              body={session.descripcion}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
