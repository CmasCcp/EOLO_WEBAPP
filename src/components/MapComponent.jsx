import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Asegúrate de importar los estilos de Leaflet
import 'leaflet/dist/leaflet.css';

const MapComponent = ({lat, lon}) => {
    // Estado para almacenar la ubicación seleccionada
    //   const [position, setPosition] = useState([51.505, -0.09]);  // Inicializa en una latitud y longitud por defecto
    const [position, setPosition] = useState([lat, lon]);  // Inicializa en una latitud y longitud por defecto

    useEffect(()=>{
        const handle = ()=>{
            setPosition([lat, lon])
        }
        handle()
    }, [lat, lon])
    
  // Manejador de eventos del mapa
  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        // Actualiza la posición con la latitud y longitud del lugar donde se hizo clic
        setPosition([e.latlng.lat, e.latlng.lng]);
      }
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>
          Estás aquí: {position[0]}, {position[1]}
        </Popup>
      </Marker>
    );
  }

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <MapContainer center={position} zoom={13} style={{ width: '100%', height: '100%' }}>
        {/* Capa del mapa usando OpenStreetMap */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
