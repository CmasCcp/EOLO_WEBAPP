import React, { useRef, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';

export const UploadDataSessionPage = () => {
  let params = useParams();
  const fileInputRef = useRef(null); // Ref para el input de archivo
  const [file, setFile] = useState(null); // Estado para almacenar el archivo seleccionado
  const [uploading, setUploading] = useState(false); // Estado para manejar el estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const [fileName, setFileName] = useState(''); // Estado para almacenar el nombre del archivo seleccionado

  // datos formulario
  const [device, setDevice] = useState(params.deviceSessions);
  const [fechaInicio, setFechaInicio] = useState("DD-MM-YYYY");
  const [horaInicio, setHoraInicio] = useState("HH:MM:SS");
  const [fechaFinal, setFechaFinal] = useState("DD-MM-YYYY");
  const [horaFinal, setHoraFinal] = useState("HH:MM:SS");


  //API UBICACION
  const [ubicacion, setUbicacion] = useState(""); // Estado para la ubicación ingresada
  const [lat, setLat] = useState(null); // Estado para la latitud
  const [lon, setLon] = useState(null); // Estado para la longitud
  // const [error, setError] = useState(null); // Estado para manejar errores

 
  const handleLocationChange = async (ubicacion) => {
    const location = ubicacion;
    setUbicacion(location); // Actualizar la ubicación con el valor ingresado

    if (location.trim() === "") {
      setLat(null);
      setLon(null);
      return;
    }

    try {
      // Llamada al backend para obtener las coordenadas de la ubicación
      const response = await fetch(`http://127.0.0.1:5000/geocode?location=${location}`);
      const data = await response.json();
      
      if (data.lat && data.lon) {
        setLat(parseFloat(data.lat));  // Asegurarse de que lat y lon sean números
        setLon(parseFloat(data.lon));
        setError(null); // Limpiar cualquier error previo
      } else {
        setError("Ubicación no encontrada");
      }
    } catch (err) {
      setError("Error al buscar la ubicación");
    }
  };

  const iframeSrc = lat && lon ?
    `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.05}%2C${lat - 0.05}%2C${lon + 0.05}%2C${lat + 0.05}&layer=mapnik`
    // `https://www.openstreetmap.org/export/embed.html?bbox=${lon}%2C${lat}%2C${lon}%2C${lat}&layer=mapnik`
    : "";

  const handleFileSelect = () => {
    // Activar el input de archivo al hacer clic en el botón
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    // Guardar el archivo seleccionado en el estado
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name); // Actualizar el nombre del archivo seleccionado
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

    if (!file) {
      setError("Por favor, selecciona un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true); // Cambiar el estado a "cargando"

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.data[0]);
        setDevice(data.data[0].dispositivo)
        setFechaInicio(`${String(data.data[0].dia_inicial) + "-" + String(data.data[0].mes_inicial) + "-" + String(data.data[0].año_inicial)}`)
        setHoraInicio(`${String(data.data[0].hora_inicial)}`)
        handleLocationChange(data.data[0].ubicacion)

        setFechaFinal(`${String(data.data[0].dia_final) + "-" + String(data.data[0].mes_final) + "-" + String(data.data[0].año_final)}`)
        setHoraFinal(`${String(data.data[0].hora_final)}`)
        console.log(fechaInicio)
        // setHoraInicio(data.data.dia_inicial, "-", data.data.mes_inicial, "-", data.data.año_inicial)
        alert(data.message || "Archivo subido exitosamente");
        setError(null); // Limpiar el error
      } else {
        throw new Error('Error al subir el archivo');
      }
    } catch (err) {
      setError(err.message); // Capturar cualquier error que ocurra
    } finally {
      setUploading(false); // Cambiar el estado a "no cargando"
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <Breadcrumb />

        <h2 className="fw-bold mb-4">Agregar sesión:</h2>

        {/* Cargar datos sesión SD */}
        <div className="row mb-2">
          <button
            type="button"
            className="btn m-0 btn-secondary w-25 text-center me-auto"
            onClick={handleFileSelect}
          >
            Cargar Datos SD
          </button>
          {/* Input de archivo oculto */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"  // Aceptar solo archivos Excel
            style={{ display: 'none' }}  // Ocultar el input
            onChange={handleFileChange}  // Llamar a la función de manejo
          />

          {/* Botón para enviar archivo */}
          <div className="mb-4">
            <button
              type="submit"
              className="btn m-0 btn-secondary w-25 text-center ms-auto"
              disabled={uploading}  // Deshabilitar el botón mientras se carga el archivo
            >
              Enviar archivo al backend
            </button>
          </div>

        </div>

        


        {/* Mostrar nombre del archivo seleccionado */}
        {fileName && (
          <div className="mb-4">
            <p><strong>Archivo seleccionado:</strong> {fileName}</p>
          </div>
        )}

        <form onSubmit={handleUpload}>
          {/* Nombre */}
          <div className="mb-4">
            <label htmlFor="nombre" className="form-label fw-semibold">
              Código de dispositivo:
            </label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              placeholder={device}
              disabled
            />
          </div>
          {/* Nombre */}
          <div className="mb-4">
            <label htmlFor="nombre" className="form-label fw-semibold">
              Fecha inicial:
            </label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              placeholder={String(fechaInicio)}
            />
          </div>

          {/* HORA */}
          <div className="mb-4">
            <label htmlFor="nombre" className="form-label fw-semibold">
              Hora de inicio:
            </label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              placeholder={horaInicio}
            />
          </div>
          {/* Nombre */}
          <div className="mb-4">
            <label htmlFor="nombre" className="form-label fw-semibold">
              Fecha final:
            </label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              placeholder={fechaFinal}
            />
          </div>

          {/* HORA */}
          <div className="mb-4">
            <label htmlFor="nombre" className="form-label fw-semibold">
              Hora de fin:
            </label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              placeholder={horaFinal}
            />
          </div>

          {/* Comentarios */}
          <div className="mb-4">
            <label htmlFor="comentarios" className="form-label fw-semibold">
              Comentarios:
            </label>
            <textarea
              className="form-control"
              id="comentarios"
              rows="3"
              placeholder="Dedicado a recolectar datos en Santiago"
            ></textarea>
          </div>

          {/* Localización */}
          {/* <div className="mb-4">
            <label htmlFor="comentarios" className="form-label fw-semibold">
              Localización:
            </label>

            <div className="border" style={{ height: "200px", width: "100%", overflow: "hidden" }}>
              <iframe
                title="Mapa"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src="https://www.openstreetmap.org/export/embed.html?bbox=-73.15%2C-36.82%2C-73.05%2C-36.78&layer=mapnik"
                allowFullScreen
              ></iframe>
            </div>
          </div> */}


          {/* Mostrar el mapa solo si las coordenadas están disponibles */}
          {lat && lon && (
            <div className="border" style={{ height: "200px", width: "100%", overflow: "hidden" }}>
              <iframe
                title="Mapa"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={iframeSrc} // Asignar la URL dinámica al iframe
                allowFullScreen
              ></iframe>
            </div>
          )}
          {/* Mostrar errores o el estado de carga */}
          {error && <div className="text-danger mb-3">{error}</div>}
          {uploading && <div>Subiendo archivo...</div>}

          {/* Botón para agregar sesión */}
          <div className="row mb-4">
            <button
              type="submit"
              className="btn btn-dark w-25 text-center ms-auto"
              disabled={uploading}  // Deshabilitar el botón mientras se carga el archivo
            >
              Agregar Sesión
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
