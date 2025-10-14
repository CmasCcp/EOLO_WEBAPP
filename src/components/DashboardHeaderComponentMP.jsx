import React, { useState, useEffect } from 'react'

export const DashboardHeaderComponentMP = ({ pathSegments, battery, timestamp_inicial, timestamp_final, ubicacion_corto, historic=false }) => {

    console.log("🔋 DashboardHeaderComponentMP Props:", {
        pathSegments,
        battery,
        timestamp_inicial,
        timestamp_final,
        ubicacion_corto,
        historic
    });

    // Calcular el color del círculo de estado basado en timestamp_final
    const getStatusColor = () => {
        if (!timestamp_final) return { color: '#6c757d', name: 'gray' }; // Gris si no hay timestamp
        
        const finalTime = new Date(timestamp_final);
        const diffMinutes = Math.floor((currentTime - finalTime) / (1000 * 60));
        
        console.log(`⏰ Tiempo transcurrido: ${diffMinutes} minutos desde ${timestamp_final}`);
        
        if (diffMinutes > 30) {
            return { color: '#dc3545', name: 'red' }; // Rojo - más de 30 minutos
        } else if (diffMinutes > 5) {
            return { color: '#ffc107', name: 'yellow' }; // Amarillo - más de 5 minutos
        } else {
            return { color: '#28a745', name: 'green' }; // Verde - menos de 5 minutos
        }
    };

    const [currentTime, setCurrentTime] = useState(new Date());
    const statusColor = getStatusColor();

    // Actualizar el tiempo cada minuto para recalcular el color
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Cada 60 segundos

        return () => clearInterval(interval);
    }, []);

    let batteryIcon = "fa-battery-full";
    let batteryColor = "";

    if (battery === null || battery === undefined) {
        batteryIcon = "fa-battery-empty";
        batteryColor = "text-muted";
    } else if (battery === 0) {
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
                    <>
                        <style>{`
                            .status-dot {
                                width: 10px;
                                height: 10px;
                                border-radius: 50%;
                                display: inline-block;
                                margin-right: 8px;
                                vertical-align: middle;
                                animation: status-blink 1s infinite;
                            }
                            @keyframes status-blink {
                                0%, 50% { opacity: 1; transform: scale(1); }
                                51%, 100% { opacity: 0.25; transform: scale(0.9); }
                            }
                        `}</style>

                        <span 
                            className="status-dot" 
                            style={{ backgroundColor: statusColor.color }}
                            aria-hidden="true" 
                            title={
                                statusColor.name === 'green' ? "Conexión activa (< 5 min)" :
                                statusColor.name === 'yellow' ? "Conexión reciente (5-30 min)" :
                                statusColor.name === 'red' ? "Conexión antigua (> 30 min)" :
                                "Sin datos de conexión"
                            }
                        ></span>
                    </>
                    Sesión remota <br />
                    <small className='text-muted'>{pathSegments[1]}</small>
                </h5>
            ) : (
                <>
                    <h5 className="text-center mb-4">
                        Histórico Dispositivo <br />
                        {/* <small className='text-muted'>{pathSegments[1]}</small> */}
                    </h5>
                </>
            )}


            {true && (

                <div className="d-flex flex-column flex-md-row justify-content-around mb-2 align-items-around">
                    {/* Ubicación y batería arriba en móvil, al centro en desktop */}
                    <div className="d-flex flex-row justify-content-around align-items-center gap-4 order-1 order-md-2 mb-2 mb-md-0">
                        <div className="text-center">
                            <span className="fw-bold">
                                Ubicación:
                            </span>
                            <div className='fw-bold'>
                                <i className="fas fa-map-marker-alt m-2"></i>
                                {ubicacion_corto || 'Cargando ubicación...'}
                            </div>
                        </div>
                        <div className="text-center">
                            <span className="fw-bold">
                                Batería:
                            </span>
                            <div className="fw-bold">
                                <i className={`fas ${batteryIcon} ${batteryColor} m-2`}></i>
                                {battery !== null ? battery + '%' : 'N/A'}
                            </div>
                        </div>
                    </div>
                    {/* Inicio y Fin abajo en móvil, a los lados en desktop */}
                    <div className="order-2 order-md-1 mb-2 mb-md-0">
                        <span className="fw-bold">Inicio:</span>
                        <input
                            type="text"
                            className="form-control"
                            value={timestamp_inicial||""}
                            disabled
                            readOnly
                        />
                    </div>
                    <div className="order-3 order-md-3">
                        <span className="fw-bold">Fin:</span>
                        <input
                            type="text"
                            className="form-control"
                            value={timestamp_final||""}
                            disabled
                            readOnly
                        />
                    </div>
                </div>
            )}

        </div>
    )
}