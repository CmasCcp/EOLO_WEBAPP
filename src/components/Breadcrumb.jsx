import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Breadcrumb = () => {
  const location = useLocation();
  
  //Para las rutas en español
  const spanishNames = {
    'home': 'Inicio',
    'dashboard': 'Panel',
    'devices' : 'Dispositivos',
    'sessions' : 'Sesiones',
    'add-device' : 'Añadir Dispositivo',
    'upload-data-sessions' : 'Subir Datos'
  };
  
  // Dividir la ruta actual en segmentos
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const translateSegment = (segment) => {
    // Convertir a minúsculas y buscar en el diccionario
    const lowerSegment = segment.toLowerCase();
    return spanishNames[lowerSegment] || segment;
  };

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Inicio</Link>
        </li>
        {pathSegments.map((segment, index) => {
          const pathTo = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const translatedSegment = translateSegment(segment);
          return (
            <li key={index} className="breadcrumb-item">
              {index === pathSegments.length - 1 ? (
                <span>{translatedSegment}</span> // No es un enlace en la última parte
              ) : (
                <Link to={pathTo}>{translatedSegment}</Link> // Crear enlace a la ruta correspondiente
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
