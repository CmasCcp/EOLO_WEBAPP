import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const ChartComponent = ({datos, title, fileName}) => {

  const [data, setData] = useState(datos);
  // const [fileName, setFileName] = useState(fileName);


  // Opcional: Si el Excel tiene un formato específico, puedes adaptar cómo procesar los datos
  // Suponemos que el archivo Excel tiene columnas `date`, `value` para el gráfico
  const chartData = data.map(row =>
  ({
    // date: row['dia'] + "-" + row['mes']+ "-" + row['año'] + "  " +  row['timestamp'], // Columna de fechas
    date: row['id'], // Columna de fechas
    "°C": row['valor'], // Columna de valores
  }));


  return (
    <div>
      {data.length > 0 && (<div className='' >
        <p className='text-center mt-4 mb-0'>
          <span className="fw-bolder">{title || "Gráfico de Datos"}</span>
        </p>
        <div className="pe-5">

        <ResponsiveContainer className="mt-5" width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={data[0].variable} stroke="#8884d8" />
            {/* <Line type="monotone" dataKey="value" stroke="#8884d8" /> */}
          </LineChart>
        </ResponsiveContainer>
        </div>
      </div>
      )}
    </div>
  );

}

const ExcelChart = () => {

  const datos = [
    {'patente': 'MP-01-EXPRESS', 'sesion_id': 3001, 'dia': 3, 'mes': 1, 'año': 2025, 'timestamp': '19:00:00', 'variable': '°C', 'valor': 50, 'id': 1 },
    {'patente':'MP-01-EXPRESS', 'sesion_id': 3001, 'dia': 3, 'mes': 1, 'año': 2025, 'timestamp': '20:00:00', 'variable': '°C', 'valor': 20, 'id': 2},
    {'patente': 'MP-01-EXPRESS', 'sesion_id': 3001, 'dia': 3, 'mes': 1, 'año': 2025, 'timestamp': '21:00:00', 'variable': '°C', 'valor': 30, 'id': 3 }
  ]

  return (
    <ChartComponent datos={datos} fileName="file" />
  )
  
  
};

export default ExcelChart;
