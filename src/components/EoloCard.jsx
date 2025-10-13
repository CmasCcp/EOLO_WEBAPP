import React from "react";
import { Link } from "react-router-dom";

const EoloCard = ({index, device, titulo, lateral, body }) => {
  console.log(device.modelo)
  return (

    <div className="card m-1 col-md-3 col-sm-5 p-4 shadow-sm my-3 hover-zoom text-center">
      <Link key={index} to={`${device.modelo == "Eolo MP Express" ? device.patente_dispositivo : `/dispositivos/${device.patente_dispositivo}`}`}>
      {/* <Link key={index} to={`/dispositivos/${device.patente_dispositivo}`}> */}
        <div className="d-flex flex-column justify-content-between align-items-start text-dark">
          <div className="mx-auto">
            <b className="fw-bold mb-1 text-center">{titulo.label}</b>
            <h5 className="fw-bold mb-1 text-center">{titulo.valor}</h5>
            <p className="mb-0 text-muted" style={{ maxWidth: "500px" }}>{body}
            </p>
          </div>
          <br />
          <div className="mx-auto">
            <b className="fw-bold mb-1">{lateral.label}</b>
            <h5 className="fw-bold">{lateral.valor}</h5>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EoloCard;
