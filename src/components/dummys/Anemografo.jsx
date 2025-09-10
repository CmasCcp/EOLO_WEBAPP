import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Line } from 'recharts';
import { Brujula } from '../Brujula';
import { ChartComponent } from '../ExcelChart';

// const data =
//     [
//         {
//             name: '2025-08-01T20:15:37',
//             uv: 4000,
//             grados: 180,
//             amt: 2400,
//         },
//         {
//             name: '2025-08-01T20:15:39',
//             uv: 4000,
//             grados: 0,
//             amt: 2400,
//         },
//         {
//             name: '2025-08-01T20:15:40',
//             uv: 3000,
//             grados: 120,
//             amt: 2210,
//         },
//         {
//             name: '2025-08-01T20:15:45',
//             uv: -1000,
//             grados: 0,
//             amt: 2290,
//         },
//         {
//             name: '2025-08-01T20:15:50',
//             uv: 500,
//             grados: 100,
//             amt: 2000,
//         },
//         {
//             name: '2025-08-01T20:15:55',
//             uv: -2000,
//             grados: 10,
//             amt: 2181,
//         },
//         {
//             name: '2025-08-01T20:16:00',
//             uv: -250,
//             grados: 300,
//             amt: 2500,
//         },
//         {
//             name: '2025-08-01T20:16:05',
//             uv: 3490,
//             grados: 120,
//             amt: 2100,
//         },
//         {
//             name: '2025-08-01T20:16:17',
//             uv: 4000,
//             grados: 18,
//             amt: 2400,
//         },
//         {
//             name: '2025-08-01T20:16:19',
//             uv: 4000,
//             grados: 180,
//             amt: 2400,
//         },
//         {
//             name: '2025-08-01T20:16:20',
//             uv: 3000,
//             grados: 20,
//             amt: 2210,
//         },
//         {
//             name: '2025-08-01T20:16:25',
//             uv: -1000,
//             grados: 140,
//             amt: 2290,
//         },
//         {
//             name: '2025-08-01T20:16:30',
//             uv: 500,
//             grados: 0,
//             amt: 2000,
//         },
//         {
//             name: '2025-08-01T20:16:35',
//             uv: -2000,
//             grados: 10,
//             amt: 2181,
//         },
//         {
//             name: '2025-08-01T20:17:40',
//             uv: -250,
//             grados: 100,
//             amt: 2500,
//         },
//         {
//             name: '2025-08-01T20:17:45',
//             uv: 3490,
//             grados: 0,
//             amt: 2100,
//         },
//         {
//             name: '2025-08-01T20:17:50',
//             uv: 3490,
//             grados: 360,
//             amt: 2100,
//         },
//         {
//             name: '2025-08-01T20:17:57',
//             uv: 4000,
//             grados: 18,
//             amt: 2400,
//         },
//         {
//             name: '2025-08-01T20:17:59',
//             uv: 4000,
//             grados: 180,
//             amt: 2400,
//         },
//         {
//             name: '2025-08-01T20:18:00',
//             uv: 3000,
//             grados: 20,
//             amt: 2210,
//         },
//         {
//             name: '2025-08-01T20:18:05',
//             uv: -1000,
//             grados: 140,
//             amt: 2290,
//         },
//         {
//             name: '2025-08-01T20:18:15',
//             uv: 500,
//             grados: 0,
//             amt: 2000,
//         },
//         {
//             name: '2025-08-01T20:18:25',
//             uv: -2000,
//             grados: 10,
//             amt: 2181,
//         },
//         {
//             name: '2025-08-01T20:18:30',
//             uv: -250,
//             grados: 100,
//             amt: 2500,
//         },
//         {
//             name: '2025-08-01T20:18:35',
//             uv: 3490,
//             grados: 0,
//             amt: 2100,
//         },

//     ];

// const gradientOffset = () => {
//     const dataMax = Math.max(...data.map((i) => i.grados));
//     const dataMin = Math.min(...data.map((i) => i.grados));

//     if (dataMax <= 0) {
//         return 0;
//     }
//     if (dataMin >= 0) {
//         return 1;
//     }

//     return dataMax / (dataMax - dataMin);
// };

// const off = gradientOffset();

export const Anemografo = ({ promedio, datos, datosVelocidad }) => {

    console.log("velocidad: ", datosVelocidad)
    const [points, setPoints] = useState([]);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [vientoSelectedChart,setVientoSelectedChart] = useState("velocidad");

    const handleSetSelectedPoint = (point) => {
        const filteredPoint = points.filter(p => p.x === point.x)[0]?.payload;
        setSelectedPoint(filteredPoint);
        // console.log(filteredPoint);
    };

    useEffect(() => {
        // Aquí puedes usar el punto seleccionado
        console.log("Punto seleccionado:", selectedPoint);
    }, [selectedPoint]);

    // Opciones de gráficos
    const chartOptions = [
        { key: "velocidad", label: "Velocidad" }, // <-- Nuevo tab
        { key: "direccion", label: "Dirección"},
    ];
    return (
        <>
            <div className="p-0 mb-0  pe-0 text-dark col-md-11 mx-auto d-flex flex-row justify-content-center align-items-end flex-wrap-reverse my-2">
                <div className="d-flex mt-auto flex-row mb-0 pb-0 justify-content-end align-items-end me-auto">
                    {/* Navegador de gráficos tipo tabs */}
                    <ul
                        className="mb-0 pb-0 nav nav-pills fs-6 flex-nowrap justify-content-start overflow-auto custom-tab-scroll"
                        style={{ whiteSpace: "nowrap" }}
                    >
                        {chartOptions.map(opt => (
                            <li className="nav-item d-inline-block m-0" key={opt.key}>
                                <button
                                    className={`m-0 nav-link ${vientoSelectedChart === opt.key ? "active bg-dark text-white" : "text-dark"}`}
                                    style={{ cursor: "pointer", minWidth: 120 }}
                                    onClick={() => setVientoSelectedChart(opt.key)}
                                >
                                    {opt.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="card ps-3 me-0">
                    <Brujula degrees={selectedPoint?.grados || promedio} />
                </div>
            </div>
            <hr className='col-11 mx-auto my-0 p-0' />
            <div style={{ display: vientoSelectedChart === "direccion" ? "block" : "none" }} className="card col-11 mx-auto my-3">

                <div className="d-flex flex-row justify-content-center pt-3">
                    <p className='text-center mt-4 mb-0'>
                        <span className="fw-bolder">{"Dirección del Viento"}</span>
                    </p>
                </div>
                <div className="container m-0 px-3">
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart
                            width={500}
                            height={400}
                            data={datos}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                            onClick={e => {
                                if (e && e.activeLabel) {
                                    // e.activeLabel es el valor del eje X (por ejemplo, fecha)
                                    // e.activePayload[0].payload es el objeto completo del punto
                                    // console.log("Punto seleccionado:", e.activePayload);
                                    handleSetSelectedPoint(e.activeCoordinate)
                                }
                                // console.log(e.activeCoordinate)
                            }}
                        >
                            <CartesianGrid strokeDasharray="360 200" />

                            <XAxis dataKey="date" />
                            <YAxis dataKey="grados" label={{ value: 'Grados (°)', angle: -90, position: 'insideLeft', fontSize: 16, fill: '#333', fontWeight: 'bold' }} />
                            {/* <YAxis yAxisId="right" orientation="right" label={{ value: 'Velocidad (m/s)', angle: 90, position: 'insideRight', fontSize: 16, fill: '#333', fontWeight: 'bold' }} /> */}
                            {/* <YAxis yAxisId="right" orientation="right" label={{ value: "Velocidad", angle: 90, position: 'insideRight', fontSize: 16, fill: '#333', fontWeight: 'bold' }} /> */}
                            <Line yAxisId="right" type="monotone" dataKey={datosVelocidad} stroke="#8884d8" activeDot={{ r: 8 }} />

                            <Tooltip />
                            <defs>
                                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset={1} stopColor="red" stopOpacity={1} />
                                    <stop offset={1} stopColor="purple" stopOpacity={1} />
                                    <stop offset={1} stopColor="blue" stopOpacity={1} />
                                    <stop offset={1} stopColor="red" stopOpacity={1} />
                                </linearGradient>
                            </defs>
                            <ReferenceLine y={360} label="Norte" stroke="red" opacity={0.1} />
                            <ReferenceLine y={270} label="Oeste" stroke="purple" opacity={0.1} />
                            <ReferenceLine y={180} label="Sur" stroke="blue" opacity={0.1} />
                            <ReferenceLine y={90} label="Este" stroke="purple" opacity={0.1} />
                            <Area onClick={e => {
                                // e es el evento, pero no siempre tiene el punto
                                // console.log(e.points);
                                setPoints(e.points);
                            }} type="monotone" dataKey="grados" stroke="#0000004d" fill="url(#splitColor)">
                            </Area>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

            </div>
            <div style={{ display: vientoSelectedChart === "velocidad" ? "block" : "none" }} className="card col-11 mx-auto my-3">
                <ChartComponent datos={datosVelocidad} title={"Velocidad del Viento (m/s)"} />
            </div>

        </>
    );
};
