import { Breadcrumb } from "../components/Breadcrumb";
import { ChartComponent } from "../components/ExcelChart";
import { Navbar } from "../components/Navbar";
import datos from "../../api/db/sesiones/json/sesion_3001.json";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export const DashboardPage = () => {
  // Datos de dispositivos y sesiones
  const devices = [
    {
      "patente": "MP-01-EXPRESS",
      "modelo": "Eolo MP Express",
    },
    {
      "patente": "MP-02-EXPRESS",
      "modelo": "Eolo MP Express",
    },
  ];

  const sesiones_en_dispositivo = [
    {
      "sesion_id": 3001,
      "patente": "MP-01-EXPRESS",
    },
    {
      "sesion_id": 3002,
      "patente": "MP-01-EXPRESS",
    },
    {
      "sesion_id": 3003,
      "patente": "MP-02-EXPRESS",
    },
    {
      "sesion_id": 3004,
      "patente": "MP-02-EXPRESS",
    },
  ];

  const location = useLocation();

  // Dividir la ruta actual en segmentos
  const pathSegments = location.pathname.split('/').filter(Boolean);

  console.log(pathSegments)

  const [deviceSelected, setDeviceSelected] = useState();
  const [sesionsOpt, setSesionsOpt] = useState(sesiones_en_dispositivo);
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

  // {pathSegments.length < 2 && (<>
  //   {/* Filtros a la derecha */}
  //   <div className="col-md-4">
  //     <div className="row">
  //       <h5 className="col-8 m-0 p-0">Filtros</h5>
  //       <a className="col-2 ms-auto my-0 p-0" style={{ "cursor": "pointer" }} onClick={handleClearFilters}>Limpiar</a>
  //     </div>
  //     <hr />
  //     <div className="row">

  //       <div className="d-flex flex-column col-6">
  //         <h5 className="text-center">Dispositivos</h5>
  //         {devices.map(device => (
  //           <button className={`btn ${deviceSelected == device.patente ? "btn-dark" : "btn-secondary"}`} onClick={handleClickDevice} value={device.patente}>{device.patente}</button>
  //         ))}
  //       </div>
  //       {!!deviceSelected &&
  //         <div className="d-flex flex-column col-6">
  //           <h5 className="text-center">Sesiones</h5>

  //           {sesionsOpt.map(sesion => (
  //             <button className={`btn ${sesionSelected == sesion.sesion_id ? "btn-dark" : "btn-secondary"}`} onClick={handleClickSesion} value={sesion.sesion_id}>{sesion.sesion_id}</button>
  //           ))}
  //         </div>
  //       }
  //     </div>
  //   </div>
  // </>)}

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <Breadcrumb />
      </div>

      <div className="row mx-auto">

        <div className="col-md-10 mx-auto">
          <h5 className="text-center">{!!sesionSelected ? deviceSelected + " > Sesión " + sesionSelected : (!!deviceSelected ? deviceSelected : "Todos los datos")}</h5>
          <hr className="col-10 mx-auto" />
          {!!datos && (
            <div className="container">
              {/* Tarjetas de resumen */}
              <div className="mx-auto d-flex flex-row justify-content-between flex-wrap mb-2">
                <div className="card p-0 col-12 col-sm-2 text-center">
                  <div className="card-body p-1">
                    <h5 className="m-0">1000</h5>
                    <span><small className="fs-6">LPM</small></span>
                  </div>
                </div>
                <div className="card p-0 col-12 col-sm-2 text-center">
                  <div className="card-body p-1">
                    <h5 className="m-0">1000</h5>
                    <span><small className="fs-6">M Cúbicos</small></span>
                  </div>
                </div>
                <div className="card p-0 col-12 col-sm-2 text-center">
                  <div className="card-body p-1">
                    <h5 className="m-0">1000</h5>
                    <span><small className="fs-6">°C</small></span>
                  </div>
                </div>
                <div className="card p-0 col-12 col-sm-2 text-center">
                  <div className="card-body p-1">
                    <h5 className="m-0">1000</h5>
                    <span><small className="fs-6">% hum.</small></span>
                  </div>
                </div>
                <div className="card p-0 col-12 col-sm-2 text-center">
                  <div className="card-body p-1">
                    <h5 className="m-0">1000</h5>
                    <span><small className="fs-6">hPa</small></span>
                  </div>
                </div>
              </div>
              {/* Gráficos */}
              <div className="col-md-12 mx-auto px-0 d-flex flex-row flex-wrap justify-content-between">
                <div className="col-6">
                  
                </div>
                <div className="col-6">
                  <div className="card col-12 col-md-12 ">
                    <ChartComponent title="Litros Por Minuto" datos={datos} />
                  </div>
                  <div className="card col-12 col-md-12  ">
                    <ChartComponent title="Metros Cubicos" datos={datos} />
                  </div>
                  <div className="card col-12 col-md-12  ">
                    <ChartComponent title="Temperatura" datos={datos} />
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
