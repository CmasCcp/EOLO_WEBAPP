import { Breadcrumb } from "../components/Breadcrumb";
import { DashboardHeaderComponent } from "../components/DashboardHeaderComponent";
import { ChartComponent } from "../components/ExcelChart";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import { CardGraphic } from "../components/graphics/CardGraphic";
import { BiAxialLineChart } from "../components/graphics/BiAxialLineChart";
import { BiAxialLineChartComponent } from "../components/BiAxialLineChartComponent";
import { Anemografo } from "../components/dummys/Anemografo";
import { Statistics } from "../utils/dataFunctions";
import { MovilCardGraphic } from "../components/graphics/MovilCardGraphic";
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
  const lastPressure = Statistics.last(presionArr.map(d => d.presion));

  // calculos flujo
  let avgFlow = Statistics.mean(flujoArr.map(d => d.flujo));
  avgFlow = Statistics.round(avgFlow, 1);
  const minFlow = Statistics.min(flujoArr.map(d => d.flujo));
  const maxFlow = Statistics.max(flujoArr.map(d => d.flujo));


  // calculos volumen
  const lastVolume = Statistics.last(volumenArr.map(d => d.volumen));
  const minVolume = Statistics.min(volumenArr.map(d => d.volumen));
  const maxVolume = Statistics.max(volumenArr.map(d => d.volumen));

  // pm2.5 y pm10
  const promedioPM25 = Statistics.round(Statistics.mean(pm25Arr.map(d => d.pm25)));
  const promedioPM10 = Statistics.round(Statistics.mean(pm10Arr.map(d => d.pm10)));
  const minPM25 = Statistics.round(Statistics.min(pm25Arr.map(d => d.pm25)));
  const maxPM25 = Statistics.round(Statistics.max(pm25Arr.map(d => d.pm25)));
  const minPM10 = Statistics.round(Statistics.min(pm10Arr.map(d => d.pm10)));
  const maxPM10 = Statistics.round(Statistics.max(pm10Arr.map(d => d.pm10)));

  // temperatura
  let promedioTemperatura = Statistics.round(Statistics.mean(temperaturaArr.map(d => d.temperatura)));
  let minTemperatura = Statistics.round(Statistics.min(temperaturaArr.map(d => d.temperatura)));
  let maxTemperatura = Statistics.round(Statistics.max(temperaturaArr.map(d => d.temperatura)));

  const promedioHumedad = Statistics.round(Statistics.mean(humedadArr.map(d => d.porcentaje_humedad)));
  const minHumedad = Statistics.round(Statistics.min(humedadArr.map(d => d.porcentaje_humedad)));
  const maxHumedad = Statistics.round(Statistics.max(humedadArr.map(d => d.porcentaje_humedad)));
  const promedioPresion = Statistics.round(Statistics.mean(presionArr.map(d => d.presion)));

  const minPressure = Statistics.round(Statistics.min(presionArr.map(d => d.presion)));
  const maxPressure = Statistics.round(Statistics.max(presionArr.map(d => d.presion)));
  const promedioDireccion = Statistics.round(Statistics.mean(direccionArr.map(d => d.grados)));
  const minDireccion = Statistics.round(Statistics.min(direccionArr.map(d => d.grados)));
  const maxDireccion = Statistics.round(Statistics.max(direccionArr.map(d => d.grados)));
  const promedioVelocidad = Statistics.round(Statistics.mean(velocidadArr.map(d => d.velocidad)));

  const [selectedChart, setSelectedChart] = useState("mapa");

  // Opciones de gráficos
  const chartOptions = [
    { key: "mapa", label: "Mapa" }, // <-- Nuevo tab
    { key: "flujoVolumen", label: "Flujo / Volumen", data: flujoVolumenArr },
    { key: "pm2_5", label: "MP 2.5 (µg/m³)", data: pm25Arr },
    { key: "pm10", label: "MP 10 (µg/m³)", data: pm10Arr },
    { key: "temperatura", label: "Temperatura (°C)", data: temperaturaArr },
    { key: "humedad", label: "Humedad (%)", data: humedadArr },
    { key: "presion", label: "Presión (hPa)", data: presionArr },
    { key: "viento", label: "Viento", data: direccionArr },
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
            <div className="d-flex flex-row justify-content-end">
              <button className="btn btn-dark mx-1"><small> Descargar Reporte</small></button>
              <button className="btn btn-dark mx-0"><small>Descargar Datos</small></button>
            </div>

            <DashboardHeaderComponent pathSegments={pathSegments} sesionData={sesionData} />
            <hr className="col-12 mx-auto" />
          </div>

          {!!datos && (
            <div className="container">
              {/* Tarjetas de resumen ... */}
              {/* d-none d-md-block  */}

              {/* <div className="d-md-block block-inline d-flex flex-row flex-wrap mb-4 justify-content-around"> */}
              <div className="d-none d-lg-flex flex-row col-12 mb-4 justify-content-between">
                <CardGraphic onClick={() => setSelectedChart("flujo")} showStats={selectedChart === "flujo"} titulo="Flujo Promediado" min={minFlow} max={maxFlow} valor={avgFlow || "-"} unidad="l/min" />
                <CardGraphic onClick={() => setSelectedChart("volumen")} showStats={selectedChart === "volumen"} titulo="Volumen Acumulado" min={minVolume} max={maxVolume} valor={lastVolume || "-"} unidad="m³" />
                <CardGraphic onClick={() => setSelectedChart("pm2_5")} showStats={selectedChart === "pm2_5"} titulo="MP 2.5 Promediado" min={minPM25} max={maxPM25} valor={isNaN(promedioPM25) ? '-' : promedioPM25} unidad="µg/m³" />
                <CardGraphic onClick={() => setSelectedChart("pm10")} showStats={selectedChart === "pm10"} titulo="MP 10 Promediado" min={minPM10} max={maxPM10} valor={isNaN(promedioPM10) ? '-' : promedioPM10} unidad="µg/m³" />
                <CardGraphic onClick={() => setSelectedChart("temperatura")} showStats={selectedChart === "temperatura"} titulo="Temperatura Promediada" min={minTemperatura} max={maxTemperatura} valor={isNaN(promedioTemperatura) ? '-' : promedioTemperatura} unidad="°C" />
                <CardGraphic onClick={() => setSelectedChart("humedad")} showStats={selectedChart === "humedad"} titulo="Humedad Relativa Promediada" min={minHumedad} max={maxHumedad} valor={isNaN(promedioHumedad) ? '-' : promedioHumedad} unidad="%" />
                <CardGraphic onClick={() => setSelectedChart("presion")} showStats={selectedChart === "presion"} titulo="Presión Atmosférica Final" min={minPressure} max={maxPressure} valor={isNaN(lastPressure) ? '-' : lastPressure} unidad="hPa" />
              </div>

              {/* Resumen móvil: visible solo en pantallas pequeñas */}
              <div className="d-lg-none mb-3">
                <div className="row text-center">
                  <MovilCardGraphic titulo="Flujo Promediado" min={minFlow} max={maxFlow} valor={avgFlow || "-"} unidad="l/min" />
                  <MovilCardGraphic titulo="Volumen Acumulado" min={minVolume} max={maxVolume} valor={lastVolume || "-"} unidad="m³" />
                  <MovilCardGraphic titulo="MP 2.5 Promediado" min={minPM25} max={maxPM25} valor={isNaN(promedioPM25) ? '-' : promedioPM25} unidad="µg/m³" />
                  <MovilCardGraphic titulo="MP 10 Promediado" min={minPM10} max={maxPM10} valor={isNaN(promedioPM10) ? '-' : promedioPM10} unidad="µg/m³" />
                  <MovilCardGraphic titulo="Temperatura Promediada" min={minTemperatura} max={maxTemperatura} valor={isNaN(promedioTemperatura) ? '-' : promedioTemperatura} unidad="°C" />
                  <MovilCardGraphic titulo="Humedad Promediada" min={minHumedad} max={maxHumedad} valor={isNaN(promedioHumedad) ? '-' : promedioHumedad} unidad="%" />
                  <MovilCardGraphic titulo="Presión Final" min={minPressure} max={maxPressure} valor={isNaN(lastPressure) ? '-' : lastPressure} unidad="hPa" />
                </div>
              </div>
              {/* <div className="d-flex flex-row justify-content-end">
                <button className="btn btn-dark mx-1"><small> Descargar Reporte</small></button>
                <button className="btn btn-dark mx-0"><small>Descargar Datos</small></button>
              </div> */}
              <hr className="col-12 mx-auto" />

              {/* Navegador de gráficos tipo tabs */}
              <ul
                className="nav nav-pills fs-6 flex-nowrap justify-content-start mb-3 w-100 overflow-auto custom-tab-scroll"
                style={{ whiteSpace: "nowrap" }}
              >
                {chartOptions.map(opt => (
                  <li className="nav-item d-inline-block" key={opt.key}>
                    <button
                      className={`nav-link ${selectedChart === opt.key ? "active bg-dark text-white" : "text-dark"}`}
                      style={{ cursor: "pointer", minWidth: 120 }}
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
                <div className=" col-12 col-md-12 mb-2">
                  <div className="card" style={{ display: selectedChart === "flujo" ? "block" : "none" }}>
                    <ChartComponent title="Flujo (l/min)" datos={flujoArr} />
                  </div>
                  <div className="card" style={{ display: selectedChart === "volumen" ? "block" : "none" }}>
                    <ChartComponent title="Volumen (m³)" datos={volumenArr} />
                  </div>
                  <div className="card" style={{ display: selectedChart === "flujoVolumen" ? "block" : "none" }}>
                    <BiAxialLineChartComponent datos={flujoVolumenArr} lineDataKeyOne={"flujo"} lineDataKeyTwo={"volumen"} title="Flujo (l/min) / Volumen (m³)" />
                  </div>
                  <div className="card" style={{ display: selectedChart === "pm2_5" ? "block" : "none" }}>
                    <ChartComponent title="MP 2.5 (µg/m³)" datos={pm25Arr} />
                  </div>
                  <div className="card" style={{ display: selectedChart === "pm10" ? "block" : "none" }}>
                    <ChartComponent title="MP 10 (µg/m³)" datos={pm10Arr} />
                  </div>
                  <div className="card" style={{ display: selectedChart === "temperatura" ? "block" : "none" }}>
                    <ChartComponent title="Temperatura (°C)" datos={temperaturaArr} />
                  </div>
                  <div className="card" style={{ display: selectedChart === "humedad" ? "block" : "none" }}>
                    <ChartComponent title="Humedad Ambiental Relativa (%)" datos={humedadArr} />
                  </div>
                  <div className="card" style={{ display: selectedChart === "presion" ? "block" : "none" }}>
                    <ChartComponent title="Presión (hPa)" datos={presionArr} />
                  </div>
                  <div className="" style={{ display: selectedChart === "viento" ? "block" : "none" }}>
                    <Anemografo title="Viento" promedio={promedioDireccion} datosVelocidad={velocidadArr} promedioVelocidad={promedioVelocidad} datos={direccionArr} />
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
