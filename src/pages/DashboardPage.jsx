import { Breadcrumb } from "../components/Breadcrumb";
import { ChartComponent } from "../components/ExcelChart";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// import datos from "../../api/db/sesiones/json/sesion_3001.json";

export const DashboardPage = () => {

  const [datos, setDatos] = useState(null);
  const [idSesion, setIdSesion] = useState(); // Puedes cambiar esto dinámicamente según tu lógica
  const [sesionData, setSesionData] = useState([]); // Puedes cambiar esto dinámicamente según tu lógica

  // Arrays separados
  const [humedadArr, setHumedadArr] = useState([]);
  const [presionArr, setPresionArr] = useState([]);
  const [temperaturaArr, setTemperaturaArr] = useState([]);

  useEffect(() => {
    // Aquí puedes obtener el id de la sesión desde la URL o desde donde lo necesites
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id_sesion');
    if (id) {
      setIdSesion(id);
    }
  }, []);

  const location = useLocation();

  // Dividir la ruta actual en segmentos
  const pathSegments = location.pathname.split('/').filter(Boolean);

  console.log(pathSegments)

  useEffect(() => {
    if (idSesion) {
      console.log(idSesion)
      fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/datos?id_sesion=${idSesion}`)
        .then(res => res.json())
        .then(data => {
          setDatos(data);

          // Separar arrays
          setHumedadArr(
            data.map(d => ({
              date: d.timestamp,
              id_dato: d.id_dato,
              porcentaje_humedad: parseInt(d.humedad)
            }))
          );
          setPresionArr(
            data.map(d => ({
              date: d.timestamp,
              id_dato: d.id_dato,
              presion: parseInt(d.presion)
            }))
          );
          setTemperaturaArr(
            data.map(d => ({
              date: d.timestamp,
              id_dato: d.id_dato,
              temperatura: parseInt(d.temperatura)
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
  const promedioTemperatura = Math.round(
    temperaturaArr.reduce((sum, d) => sum + d.temperatura, 0) / temperaturaArr.length
  );
  const promedioHumedad = Math.round(
    humedadArr.reduce((sum, d) => sum + d.porcentaje_humedad, 0) / humedadArr.length
  );
  const promedioPresion = Math.round(
    presionArr.reduce((sum, d) => sum + d.presion, 0) / presionArr.length
  );



  { console.log(datos) }
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <Breadcrumb />
      </div>

      <div className="row mx-auto">
        {/* {datos[0]?.patente } */}
        <div className="col-md-10 mx-auto">
          <h5 className="text-center">Sesión {idSesion} - {pathSegments[1]} </h5>
          <hr className="col-10 mx-auto" />
          {!!datos && (
            <div className="container">
              {/* Tarjetas de resumen */}
              <div className="mx-auto d-flex flex-row justify-content-between flex-wrap mb-2">
                <div className="card p-0 col-12 col-sm-2 text-center">
                  <div className="card-body p-1">
                    <h5 className="m-0">{sesionData[0].flujo || ""} LPM</h5>
                    <span><small className="fs-6">Flujo</small></span>
                  </div>
                </div>
                <div className="card p-0 col-12 col-sm-2 text-center">
                  <div className="card-body p-1">
                    <h5 className="m-0">{sesionData[0]?.volumen} m<sup>3</sup></h5>
                    <span><small className="fs-6">Volumen</small></span>
                  </div>
                </div>
                <div className="card p-0 col-12 col-sm-2 text-center">
                  <div className="card-body p-1">
                    <h5 className="m-0">{promedioTemperatura || ""} °C</h5>
                    <span><small className="fs-6">Temperatura</small></span>
                  </div>
                </div>
                <div className="card p-0 col-12 col-sm-2 text-center">
                  <div className="card-body p-1">
                    <h5 className="m-0">{promedioHumedad || ""}%</h5>
                    <span><small className="fs-6">Humedad</small></span>
                  </div>
                </div>
                <div className="card p-0 col-12 col-sm-2 text-center">
                  <div className="card-body p-1">
                    <h5 className="m-0">{promedioPresion || ""} hPa</h5>
                    <span><small className="fs-6">Presión atmosférica</small></span>
                  </div>
                </div>
              </div>
              {/* Gráficos */}
              <div className="col-md-12 mx-auto px-0 d-flex flex-row flex-wrap justify-content-between">
                {/* <div className="col-6">

                </div> */}
                <div className="col-12">
                  <div className="card col-12 col-md-12 mb-2 ">
                    <ChartComponent title="Humedad Ambiental (%)" datos={humedadArr} />
                  </div>
                  <div className="card col-12 col-md-12 mb-2 ">
                    <ChartComponent title="Temperatura (°C)" datos={temperaturaArr} />
                  </div>
                  <div className="card col-12 col-md-12 mb-2 ">
                    <ChartComponent title="Presión (hPa)" datos={presionArr} />
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
