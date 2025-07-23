import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Breadcrumb = () => {
  const location = useLocation();

  // Dividir la ruta actual en segmentos
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        {pathSegments.map((segment, index) => {
          const pathTo = `/${pathSegments.slice(0, index + 1).join('/')}`;
          return (
            <li key={index} className="breadcrumb-item">
              {index === pathSegments.length - 1 ? (
                <span>{segment}</span> // No es un enlace en la última parte
              ) : (
                <Link to={pathTo}>{segment}</Link> // Crear enlace a la ruta correspondiente
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
