import React, { useState } from 'react'

export const DashboardHeaderComponent = ({ pathSegments, sesionData }) => {
    const battery = sesionData[0]?.bateria;
    console.log("sesionData.bateria", sesionData[0]?.bateria)
    console.log("sesionData.bateria", sesionData[0])

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

            {sesionData[0]?.id_sesion ? (

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

            <div className="d-flex justify-content-around mb-2">
                <div>
                    <span className="fw-bold">Inicio:</span>
                    <input
                        type="text"
                        className="form-control"
                        value={sesionData[0]?.timestamp_inicial}
                        disabled
                        readOnly
                    />
                </div>
                <div className="d-flex justify-content-center align-items-center mb-2 gap-4">
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
                <div>
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