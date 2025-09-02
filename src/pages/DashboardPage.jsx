import { Breadcrumb } from "../components/Breadcrumb";
import { DashboardHeaderComponent } from "../components/DashboardHeaderComponent";
import { ChartComponent } from "../components/ExcelChart";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import { CardGraphic } from "../components/graphics/CardGraphic";
import {BiAxialLineChart} from "../components/graphics/BiAxialLineChart";
import { BiAxialLineChartComponent } from "../components/BiAxialLineChartComponent";
import { Anemografo } from "../components/dummys/Anemografo";
// import datos from "../../api/db/sesiones/json/sesion_3001.json";

export const DashboardPage = () => {
  const [datos, setDatos] = useState(null);
  const [idSesion, setIdSesion] = useState(); // Puedes cambiar esto dinámicamente según tu lógica
  const [sesionData, setSesionData] = useState([]); // Puedes cambiar esto dinámicamente según tu lógica
  const [filteredSessions, setFilteredSessions] = useState([]);

  // Arrays separados
  const [flujoArr, setFlujoArr] = useState([]);
  const [volumenArr, setVolumenArr] = useState([]);
  const [flujoVolumenArr, setFlujoVolumenArr] = useState([]);
  const [humedadArr, setHumedadArr] = useState([]);
  const [presionArr, setPresionArr] = useState([]);
  const [temperaturaArr, setTemperaturaArr] = useState([]);
  const [pm25Arr, setPm25Arr] = useState([]);
  const [pm10Arr, setPm10Arr] = useState([]);
  const [bateriaArr, setBateriaArr] = useState([]);
  const [direccionArr, setDireccionArr] = useState([]);
  const [velocidadArr, setVelocidadArr] = useState([]);


  // // Calculados
  // const [humedadArr, setHumedadArr] = useState([]);
  // const [presionArr, setPresionArr] = useState([]);
  // const [temperaturaArr, setTemperaturaArr] = useState([]);

  const location = useLocation();

  // Dividir la ruta actual en segmentos
  const pathSegments = location.pathname.split('/').filter(Boolean);

  console.log(datos)

  useEffect(() => {
    // Aquí puedes obtener el id de la sesión desde la URL o desde donde lo necesites
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id_sesion');
    if (id) {
      setIdSesion(id);
    } else {
      const fetchSessions = async () => {
        try {
          const response = await fetch(import.meta.env.VITE_REACT_APP_API_URL + '/mis-sesiones?patente=' + titulo);  // Endpoint para obtener las sesiones
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
    }
  }, []);

  useEffect(() => {
    if (idSesion) {
      console.log(idSesion)
      fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/datos${idSesion && `?id_sesion=${idSesion}`}`)
        .then(res => res.json())
        .then(data => {
          setDatos(data);

          // Separar arrays
          setHumedadArr(
            data.map(d => ({
              date: d.timestamp,
              id_dato: d.id_dato,
              porcentaje_humedad: parseFloat(d.humedad)
            }))
          );
          setFlujoArr(
            data.map(d => ({
              date: d.timestamp,
              id_dato: d.id_dato,
              flujo: parseFloat(d.flujo)
            }))
          );
          setVolumenArr(
            data.map(d => ({
              date: d.timestamp,
              id_dato: d.id_dato,
              volumen: parseFloat(d.volumen)
            }))
          );
          setFlujoVolumenArr(
            data.map(d => ({
              date: d.timestamp,
              id_dato: d.id_dato,
              flujo: parseFloat(d.flujo),
              volumen: parseFloat(d.volumen)
            }))
          );
          setPresionArr(
            data.map(d => ({
              date: d.timestamp,
              id_dato: d.id_dato,
              presion: parseFloat(d.presion)
            }))
          );
          setTemperaturaArr(
            data.map(d => ({
              date: d.timestamp,
              id_dato: d.id_dato,
              temperatura: parseFloat(d.temperatura)
            }))
          );
          setPm25Arr(
            data.map(d => ({
              date: d.timestamp,
              id_dato: d.id_dato,
              pm25: parseFloat(d.pm2_5)
            }))
          );
          setPm10Arr(
            data.map(d => ({
              date: d.timestamp,
              id_dato: d.id_dato,
              pm10: parseFloat(d.pm10)
            }))
          );
          setBateriaArr(
            data.map(d => ({
              date: d.timestamp,
              id_dato: d.id_dato,
              bateria: parseFloat(d.bateria)
            }))
          );
          setVelocidadArr(
            data.map(d => ({
              date: d.timestamp,
              id_dato: d.id_dato,
              velocidad: parseFloat(d.velocidad)
            }))
          );
          setDireccionArr(
            data.map(d => ({
              date: d.timestamp,
              id_dato: d.id_dato,
              grados: parseFloat(d.direccion)
            }))
          );
        })
        .catch(err => {
          console.error("No se pudo cargar los datos de la API:", err);
          setDatos(null);
        });


      fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/sesion?id_sesion=${idSesion}`)
        .then(res => res.json())
        .then(data => {
          setSesionData(data);
          console.log("sesion data", data)
        }).catch(err => {
          console.error("No se pudo cargar los datos de la sesión:", err);
          setSesionData(null);
        }
        );
    }
  }, [idSesion]);


  const [deviceSelected, setDeviceSelected] = useState();
  const [sesionSelected, setSesionSelected] = useState();

  const handleClickDevice = (e) => {
    console.log(e.target.value);
    setDeviceSelected(e.target.value)
    setSesionSelected("")

    const filtered_sesions = sesiones_en_dispositivo.filter(x => x.patente === e.target.value);
    setSesionsOpt(filtered_sesions)
  }
  const handleClickSesion = (e) => {
    console.log(e.target.value);
    setSesionSelected(e.target.value)
  }

  const handleClearFilters = () => {
    setDeviceSelected("")
    setSesionSelected("")
  }

  // Supongamos que ya tienes el arreglo humedadArr con los datos de humedads
  const promedioFlujo = Math.round(
    flujoArr.reduce((sum, d) => sum + d.flujo, 0) / flujoArr.length
  );
  const promedioVolumen = Math.round(
    volumenArr.reduce((sum, d) => sum + d.volumen, 0) / volumenArr.length
  );
  const promedioPM25 = Math.round(
    pm25Arr.reduce((sum, d) => sum + d.pm25, 0) / pm25Arr.length
  );
  const promedioPM10 = Math.round(
    pm10Arr.reduce((sum, d) => sum + d.pm10, 0) / pm10Arr.length
  );
  const promedioTemperatura = Math.round(
    temperaturaArr.reduce((sum, d) => sum + d.temperatura, 0) / temperaturaArr.length
  );
  const promedioHumedad = Math.round(
    humedadArr.reduce((sum, d) => sum + d.porcentaje_humedad, 0) / humedadArr.length
  );
  const promedioPresion = Math.round(
    presionArr.reduce((sum, d) => sum + d.presion, 0) / presionArr.length
  );
  const promedioDireccion = Math.round(
    direccionArr.reduce((sum, d) => sum + d.grados, 0) / direccionArr.length
  );
  const promedioVelocidad = Math.round(
    velocidadArr.reduce((sum, d) => sum + d.velocidad, 0) / velocidadArr.length
  );

  const [selectedChart, setSelectedChart] = useState("mapa");

  // Opciones de gráficos
  const chartOptions = [
    { key: "mapa", label: "Mapa" }, // <-- Nuevo tab
    // { key: "flujo", label: "Flujo (LPM)", data: flujoArr },
    // { key: "volumen", label: "Volumen (m³)", data: volumenArr },
    { key: "flujoVolumen", label: "Flujo / Volumen", data: flujoVolumenArr },
    { key: "pm2_5", label: "PM 2.5 (µg/m³)", data: pm25Arr },
    { key: "pm10", label: "PM 10 (µg/m³)", data: pm10Arr },
    { key: "temperatura", label: "Temperatura (°C)", data: temperaturaArr },
    { key: "humedad", label: "Humedad (%)", data: humedadArr },
    { key: "presion", label: "Presión (hPa)", data: presionArr },
    { key: "anemografo", label: "Anemógrafo", data: direccionArr },
  ];

  // Encuentra la opción seleccionada
  const selectedOption = chartOptions.find(opt => opt.key === selectedChart);
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <Breadcrumb />
      </div>

      {/* Contenido pagina */}
      <div className="row mx-auto">
        <div className="col-md-10 mx-auto">
          <div className="container mx-auto m-0">
            {/* <div className="d-flex flex-row justify-content-end">
              <button className="btn btn-dark mx-1"><small> Descargar Reporte</small></button>
              <button className="btn btn-dark mx-0"><small>Descargar Datos</small></button>
            </div> */}

            <DashboardHeaderComponent pathSegments={pathSegments} sesionData={sesionData} />
            <hr className="col-12 mx-auto" />
          </div>

          {!!datos && (
            <div className="container">
              {/* Tarjetas de resumen ... */}

              <div className="d-flex flex-row mb-4 justify-content-center">
                <CardGraphic titulo="Flujo Promediado" valor={promedioFlujo || promedioFlujo} unidad="LPM" />
                <CardGraphic titulo="Volumen Acumulado" valor={promedioVolumen || sesionData[0]?.volumen} unidad="m³" />
                <CardGraphic titulo="PM 2.5" valor={isNaN(promedioPM25) ? '-' : promedioPM25} unidad="µg/m³" />
                <CardGraphic titulo="PM 10" valor={isNaN(promedioPM10) ? '-' : promedioPM10} unidad="µg/m³" />
                <CardGraphic titulo="Temperatura Promediado" valor={isNaN(promedioTemperatura) ? '-' : promedioTemperatura} unidad="°C" />
                <CardGraphic titulo="Humedad Promediado" valor={isNaN(promedioHumedad) ? '-' : promedioHumedad} unidad="%" />
                <CardGraphic titulo="Presión Atmosférica Promediado" valor={isNaN(promedioPresion) ? '-' : promedioPresion} unidad="hPa" />

              </div>
              {/* <div className="d-flex flex-row justify-content-end">
                <button className="btn btn-dark mx-1"><small> Descargar Reporte</small></button>
                <button className="btn btn-dark mx-0"><small>Descargar Datos</small></button>
              </div> */}
              <hr className="col-12 mx-auto" />

              {/* Navegador de gráficos tipo tabs */}
              <ul className="nav nav-pills fs-6 d-row justify-content-center flex-nowrap mb-3">
                {chartOptions.map(opt => (
                  <li className="nav-item" key={opt.key}>
                    <button
                      className={`nav-link ${selectedChart === opt.key ? "active bg-dark text-white" : "text-dark"}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedChart(opt.key)}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
              {/* <div className="container-fluid">
                <BiAxialLineChartComponent datos={flujoVolumenArr} lineDataKeyOne={"flujo"} lineDataKeyTwo={"volumen"} title="Flujo / Volumen" />
              </div> */}

              {/* Gráficos y mapa: solo uno visible según selección */}
              <div className="col-12">
                <div className="card col-12 col-md-12 mb-2">
                  <div style={{ display: selectedChart === "flujo" ? "block" : "none" }}>
                    <ChartComponent title="Flujo (LPM)" datos={flujoArr} />
                  </div>
                  <div style={{ display: selectedChart === "volumen" ? "block" : "none" }}>
                    <ChartComponent title="Volumen (m³)" datos={volumenArr} />
                  </div>
                  <div style={{ display: selectedChart === "flujoVolumen" ? "block" : "none" }}>
                    <BiAxialLineChartComponent datos={flujoVolumenArr} lineDataKeyOne={"flujo"} lineDataKeyTwo={"volumen"} title="Flujo (L/min) / Volumen (m³)" />
                  </div>
                  <div style={{ display: selectedChart === "pm2_5" ? "block" : "none" }}>
                    <ChartComponent title="PM 2.5 (µg/m³)" datos={pm25Arr} />
                  </div>
                  <div style={{ display: selectedChart === "pm10" ? "block" : "none" }}>
                    <ChartComponent title="PM 10 (µg/m³)" datos={pm10Arr} />
                  </div>
                  <div style={{ display: selectedChart === "temperatura" ? "block" : "none" }}>
                    <ChartComponent title="Temperatura (°C)" datos={temperaturaArr} />
                  </div>
                  <div style={{ display: selectedChart === "humedad" ? "block" : "none" }}>
                    <ChartComponent title="Humedad Ambiental (%)" datos={humedadArr} />
                  </div>
                  <div style={{ display: selectedChart === "presion" ? "block" : "none" }}>
                    <ChartComponent title="Presión (hPa)" datos={presionArr} />
                  </div>
                  <div style={{ display: selectedChart === "anemografo" ? "block" : "none" }}>
                    <Anemografo title="Anemógrafo" promedio={promedioDireccion} datosVelocidad={velocidadArr} promedioVelocidad={promedioVelocidad} datos={direccionArr} />
                  </div>
                  <div style={{ display: selectedChart === "mapa" ? "block" : "none" }}>
                    
                    <iframe
                      title="Google Map"
                      width="100%"
                      height="350"
                      style={{ border: 0, marginBottom: "1rem" }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://www.google.com/maps?q=${parseFloat(sesionData[0]?.lat) || -36.8270698},${parseFloat(sesionData[0]?.lon) || -73.0502064}&z=15&output=embed`}
                    />
                    {/* <MapComponent lat={parseFloat(sesionData[0]?.lat) || -36.8270698} lon={parseFloat(sesionData[0]?.lon) || -73.0502064} handleChangeLocation={() => console.log("first")} /> */}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>


      </div>
    </>
  );
};
