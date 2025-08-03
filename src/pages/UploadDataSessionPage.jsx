import React, { useEffect, useRef, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb';
import MapComponent from '../components/MapComponent';

// TODO: verificar campos completos




// cargar csv
// guardar csv
// llenar formulario
// llenar ubicacion
// guardar sesion

export const UploadDataSessionPage = () => {

  let params = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null); // Estado para manejar errores
  const [successMessage, setSuccessMessage] = useState(null); // Estado para manejar errores


  //cargar csv
  const fileInputRef = useRef(null); // Ref para el input de archivo
  const [isSelected, setIsSelected] = useState(false); // Estado para almacenar el nombre del archivo seleccionado
  const [file, setFile] = useState(null); // Estado para almacenar el archivo seleccionado
  const [fileName, setFileName] = useState(''); // Estado para almacenar el nombre del archivo seleccionado
  const [uploading, setUploading] = useState(false); // Estado para manejar el estado de carga

  // guardar csv
  const [updated, setUpdated] = useState(false); // 

  // llenar formulario
  const [jsonData, setJsonData] = useState(); // 
  const inputRef = useRef(null);  // Referencia al input de texto

  // datos formulario
  const [patente, setPatente] = useState(params.deviceSessions);
  const [fechaInicio, setFechaInicio] = useState("DD-MM-YYYY");
  const [fechaFinal, setFechaFinal] = useState("DD-MM-YYYY");
  const [flujo, setFlujo] = useState("");
  const [volumen, setVolumen] = useState("");


  //Completar ubicacion - API UBICACION
  const [ubicacion, setUbicacion] = useState(""); // Estado para la ubicación ingresada
  const [lat, setLat] = useState("-36.8270698"); // Estado para la latitud
  const [lon, setLon] = useState("-73.0502064"); // Estado para la longitud




  // Funciones ------------------------------------------------------------------------


  // cargar csv
  const handleFileSelect = () => {
    // Activar el input de archivo al hacer clic en el botón
    fileInputRef.current.click();

  };

  const handleFileChange = async (e) => {
    // Guardar el archivo seleccionado en el estado
    e.preventDefault()
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log("selectedFile", selectedFile.name)
      setFile(selectedFile);
      setFileName(selectedFile.name); // Actualizar el nombre del archivo seleccionado
      setIsSelected(true)
      await handleUpload(selectedFile)
      // handleUpload(e)
    }
  };

  const handleUpload = async (fileSelected) => {
    // e.preventDefault();
    console.log("handleUpload")
    if (!fileSelected) {
      setError("Por favor, selecciona un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append('file', fileSelected);

    setUploading(true); // Cambiar el estado a "cargando"

    try {
      const response = await fetch(import.meta.env.VITE_REACT_APP_API_URL + '/upload?patente=' + patente, {
        method: 'POST',
        body: formData,
      });

      console.log(response)

      if (response.ok) {
        const data = await response.json();
        setFechaInicio(data.data[0].timestamp_inicial);
        setFechaFinal(data.data[0].timestamp_final);
        setFlujo(data.data[0].flujo);
        setVolumen(data.data[0].volumen);
        
        setJsonData(data.mediciones)
        console.log(data.mediciones)


        setError(null); // Limpiar el error
        setUpdated(true)
      } else {
        const data = await response.json();
        console.log(data.error)
        alert(data.error);
        // throw new Error(data.error);
      }
    } catch (err) {
      setError(err); // Capturar cualquier error que ocurra
      // console.error("Error al subir el archivo:", err);
    } finally {
      setUploading(false); // Cambiar el estado a "no cargando"
    }
  };

  // llenar formulario



  // llenar ubicacion

  // Usamos useEffect para observar el cambio de 'active' y aplicar el foco cuando cambie
  // useEffect(() => {
  //   if (updated && inputRef.current) {
  //     inputRef.current.focus();  // Enfocar el input cuando 'active' sea true
  //   }
  // }, [updated]);  // Ejecutar cuando 'active' cambie

  const handleChangeLocation = (newlat, newlon) => {
    setLat(newlat);
    setLon(newlon);
    console.log("cambiar por picker", newlat, newlon)
  }

  const handleLocationChange = async (e) => {
    e.preventDefault()
    const location = String(e.target.value);
    setUbicacion(location); // Actualizar la ubicación con el valor ingresado
    console.log(location);
    if (location.trim() === "") {
      setLat(null);
      setLon(null);
      return;
    }


    try {
      // Llamada al backend para obtener las coordenadas de la ubicación
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/geocode?location=${location} Chile`);
      const data = await response.json();

      console.log("mapa", data);
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

  // guardar sesion

  const handleAddSession = async (e) => {
    e.preventDefault(); // Evitar que el formulario se recargue

    // Validar que todos los campos estén completos
    if (!patente || !fechaFinal || !fechaInicio) {
      setError('Por favor, completa todos los campos');
      return;
    }

    const newSession = {
      filename: fileName,
      patente: patente,
      fecha_inicial: fechaInicio,
      fecha_final: fechaFinal,
      volumen: volumen,
      flujo: flujo,
      lat: lat,
      lon: lon,
    };

    try {
      console.log("first")
      // Enviar los datos de la nueva sesión al backend
      const response = await fetch(import.meta.env.VITE_REACT_APP_API_URL + '/add-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSession),
      });

      // Verificar si la respuesta es exitosa
      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(data.message || 'Sesión agregada exitosamente');
        setError('');
        // Limpiar los campos después de agregar la sesión
        setError(null); // Limpiar el error
        alert(data.message || "Sesión cargada exitosamente");
        navigate(-1);
        // Redirigir a /devices después de agregar la sesión
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Error al agregar la sesión');
      }
    } catch (error) {
      setError(error.message); // Capturar cualquier error y mostrarlo
    }
  };





  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <Breadcrumb />

        <h2 className="fw-bold mb-4">Agregar sesión:</h2>

        {/* Cargar datos sesión SD */}
        <div className="col-md-12 m-0 p-0 d-grid gap-3 d-md-flex justify-content-md-start">
          <button
            className={`btn m-0 btn-${isSelected ? "secondary" : "success"}`}
            onClick={handleFileSelect}
          >
            {isSelected ? "Datos Cargados" : "Cargar Datos SD"}
          </button>
          {/* Input de archivo oculto */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"  // Aceptar solo archivos Excel
            style={{ display: 'none' }}  // Ocultar el input
            onChange={handleFileChange}  // Llamar a la función de manejo
          />

        </div>

        {/* Mostrar nombre del archivo seleccionado */}
        {fileName && (
          <div className="mb-4">
            <p><strong>Archivo seleccionado:</strong> {fileName}</p>
          </div>
        )}

        <form onSubmit={handleAddSession}>
        {/* <form> */}
          {/* Nombre */}
          <div className="row">
            <div className="col-4">
              <div className="mb-4">
                <label htmlFor="nombre" className="form-label fw-semibold">
                  Patente del dispositivo:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  placeholder={patente}
                  disabled
                />
              </div>
              
            </div>
                        <div className="col-4">
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
                  disabled

                />
              </div>

            </div>
            <div className="col-4">
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
                  disabled
                />
              </div>
            </div>
          </div>
          {/* Localización */}
          <div className="mb-4">
            <label htmlFor="ubicacion" className="form-label fw-semibold">
              Localización:
            </label>
            <input
              // ref={inputRef}
              type="text"
              className="form-control"
              id="ubicacion"
              onChange={handleLocationChange}
              placeholder={"Buscar en el mapa."}
            />
          </div>

          {/* Mostrar el mapa solo si las coordenadas están disponibles */}
          {lat && lon && (
            <>
              <MapComponent handleChangeLocation={handleChangeLocation} lat={lat} lon={lon} />
            </>
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
