import React, { useState } from 'react'

export const DashboardHeaderComponent = ({ pathSegments, sesionData, historic=false }) => {
    const battery = sesionData[0]?.bateria;

    let batteryIcon = "fa-battery-full";
    let batteryColor = "";

    if (battery === 0) {
        batteryIcon = "fa-battery-empty";
        batteryColor = "text-danger";
    } else if (battery <= 20) {
        batteryIcon = "fa-battery-quarter";
        batteryColor = "text-danger";
    } else if (battery <= 40) {
        batteryIcon = "fa-battery-quarter";
        batteryColor = "text-warning";
    } else if (battery <= 60) {
        batteryIcon = "fa-battery-half";
        batteryColor = "text-warning";
    } else if (battery <= 80) {
        batteryIcon = "fa-battery-half";
        batteryColor = "text-success";
    } else {
        batteryIcon = "fa-battery-full";
        batteryColor = "text-success";
    }


    return (
        <div className="card p-3">

            {!historic ? (

                <h5 className="text-center mb-4">
                    Sesión {sesionData[0]?.id_sesion} <br />
                    <small className='text-muted'>{pathSegments[1]}</small>
                </h5>
            ) : (
                <>
                    <h5 className="text-center mb-4">
                        Histórico Dispositivo <br />
                        <small className='text-muted'>{pathSegments[1]}</small>
                    </h5>
                </>
            )}


            {sesionData[0] && (

                <div className="d-flex flex-column flex-md-row justify-content-around mb-2 align-items-around">
                    {/* Ubicación y batería arriba en móvil, al centro en desktop */}
                    <div className="d-flex flex-row justify-content-around align-items-center gap-4 order-1 order-md-2 mb-2 mb-md-0">
                        <div className="text-center">
                            <span className="fw-bold">
                                Ubicación:
                            </span>
                            <div className='fw-bold'>
                                <i className="fas fa-map-marker-alt m-2"></i>
                                {sesionData[0]?.ubicacion_corto}
                            </div>
                        </div>
                        <div className="text-center">
                            <span className="fw-bold">
                                Batería:
                            </span>
                            <div className="fw-bold">
                                <i className={`fas ${batteryIcon} ${batteryColor} m-2`}></i>
                                {sesionData[0]?.bateria + '%'}
                            </div>
                        </div>
                    </div>
                    {/* Inicio y Fin abajo en móvil, a los lados en desktop */}
                    <div className="order-2 order-md-1 mb-2 mb-md-0">
                        <span className="fw-bold">Inicio:</span>
                        <input
                            type="text"
                            className="form-control"
                            value={sesionData[0]?.timestamp_inicial}
                            disabled
                            readOnly
                        />
                    </div>
                    <div className="order-3 order-md-3">
                        <span className="fw-bold">Fin:</span>
                        <input
                            type="text"
                            className="form-control"
                            value={sesionData[0]?.timestamp_final}
                            disabled
                            readOnly
                        />
                    </div>
                </div>
            )}




        </div>
    )
}