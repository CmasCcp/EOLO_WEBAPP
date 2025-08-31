import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

export const BiAxialLineChartComponent = ({datos, title, lineDataKeyOne, lineDataKeyTwo, lineXDataKey="date"}) => {

  const [data, setData] = useState(datos);
  
  const propertyNames = data.length > 0 ? Object.keys(data[0]) : [];
  console.log("Propiedades:", propertyNames);
  const filteredProperties = propertyNames.filter(
    prop => prop !== "date" && prop !== "id_dato"
  );
  const remainingProperty = filteredProperties.length > 0 ? filteredProperties[0] : null;
  return (
    <div>
      {data.length > 0 && (<div className='' >
        <p className='text-center mt-4 mb-0'>
          <span className="fw-bolder">{title || "Gráfico de Datos"}</span>
        </p>
        <div className="pe-5">

        <ResponsiveContainer className={"mt-5"} width="100%" height={300}>
              {/* <LineChart */}
              <AreaChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={lineXDataKey} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey={lineDataKeyOne} stroke="#8884d8" activeDot={{ r: 8 }} />
                {/* <Line yAxisId="right" type="monotone" dataKey={lineDataKeyTwo} stroke="#82ca9d" /> */}
                <Area yAxisId="right" type="monotone" dataKey={lineDataKeyTwo} fill="#82ca9d" stroke="#82ca9d" />
              </AreaChart>
              {/* </LineChart> */}
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
