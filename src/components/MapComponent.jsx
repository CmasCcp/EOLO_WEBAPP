import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Asegúrate de importar los estilos de Leaflet
import 'leaflet/dist/leaflet.css';

const MapComponent = ({lat, lon, handleChangeLocation}) => {
    // Estado para almacenar la ubicación seleccionada
    const [position, setPosition] = useState([lat, lon]);  // Inicializa en una latitud y longitud por defecto
    console.log(lat, lon)
    useEffect(()=>{
        handleChangeLocation(lat, lon);
        setPosition([lat, lon])
    }, [lat, lon])
    
  // Manejador de eventos del mapa
  function LocationMarker() {
    const mapp = useMap();

    useEffect(() => {
      // Mover el mapa para centrar en la nueva ubicación
      mapp.setView(position, mapp.getZoom());  // Cambia la vista del mapa a la nueva ubicación
    }, [position, mapp]);

    const map = useMapEvents({
      click(e) {
        // Actualiza la posición con la latitud y longitud del lugar donde se hizo clic
        setPosition([e.latlng.lat, e.latlng.lng]);
        handleChangeLocation(e.latlng.lat, e.latlng.lng);
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
      <MapContainer center={position} zoom={50} style={{ width: '100%', height: '100%' }} scrollWheelZoom={false} >
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
