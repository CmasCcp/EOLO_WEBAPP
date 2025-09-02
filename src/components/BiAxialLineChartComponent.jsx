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

        <ResponsiveContainer className={"mt-5"} width="100%" height={400}>
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
                <YAxis yAxisId="left" label={{ value: lineDataKeyOne, angle: -90, position: 'insideLeft', fontSize: 16, fill: '#333', fontWeight: 'bold' }}/>
                <YAxis yAxisId="right" orientation="right" label={{ value: lineDataKeyTwo, angle: 90, position: 'insideRight', fontSize: 16, fill: '#333', fontWeight: 'bold' }} />
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
