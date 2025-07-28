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

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <Breadcrumb />
      </div>

      <div className="container row mx-auto">

        {pathSegments.length < 2 && (<>        
        {/* Filtros a la derecha */}
        <div className="col-md-4">
          <div className="row">
            <h5 className="col-8 m-0 p-0">Filtros</h5>
            <a className="col-2 ms-auto my-0 p-0" style={{ "cursor": "pointer" }} onClick={handleClearFilters}>Limpiar</a>
          </div>
          <hr />
          <div className="row">

            <div className="d-flex flex-column col-6">
              <h5 className="text-center">Dispositivos</h5>
              {devices.map(device => (
                <button className={`btn ${deviceSelected == device.patente ? "btn-dark" : "btn-secondary"}`} onClick={handleClickDevice} value={device.patente}>{device.patente}</button>
              ))}
            </div>
            {!!deviceSelected &&
              <div className="d-flex flex-column col-6">
                <h5 className="text-center">Sesiones</h5>

                {sesionsOpt.map(sesion => (
                  <button className={`btn ${sesionSelected == sesion.sesion_id ? "btn-dark" : "btn-secondary"}`} onClick={handleClickSesion} value={sesion.sesion_id}>{sesion.sesion_id}</button>
                ))}
              </div>
            }
          </div>
        </div>
</>)}

        {/* Gráfico a la izquierda */}
        <div className="col-md-8">
          <h5 className="text-center">{!!sesionSelected ? deviceSelected + " > Sesión " + sesionSelected : (!!deviceSelected ? deviceSelected : "Todos los datos")}</h5>
          <hr className="w-75 mx-auto" />
          {!!datos && (
            <div className="row">
              <ChartComponent datos={datos} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
