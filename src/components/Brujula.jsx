import React, { useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';

export const Brujula = ({ 
    degrees = 0 
}) => {

    // Normalize degrees to [0, 360)
    const angle = - degrees + 90;
    // const angle = (((degrees - 90) % 360) + 360) % 360;

    // Data for compass: full circle and pointer
    const data = [
        { name: 'Background', value: 360 },
        { name: 'Pointer', value: 1 },
    ];

    // Colors
    const COLORS = ['#e0e0e0', 'black'];
    const factor = 0.6;

    return (
        <div className='d-flex flex-row justify-content-end align-items-center col-12 px-2'>
            <div className='col-6 text-center fw-bold mt-0 mb-2 fs-1' style={{ marginTop: 8 }}>
                {degrees.toFixed(1)}°
            </div>
            <div className=' d-flex justify-content-end align-items-center' style={{ width: 200*factor, height: 200*factor }}>
                <PieChart width={200*factor} height={200*factor}>
                    {/* Compass background */}
                    <Pie
                        data={[data[0]]}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        startAngle={0}
                        endAngle={360}
                        innerRadius={70*factor}
                        outerRadius={90*factor}
                        fill={COLORS[0]}
                        isAnimationActive={false}
                    />
                    {/* Compass pointer */}
                    <Pie
                        data={[data[1]]}
                        dataKey="value"
                        cx={"50%"}
                        cy={"50%"}
                        startAngle={angle - 2}
                        endAngle={angle + 2}
                        innerRadius={0}
                        outerRadius={65*factor}
                        fill={COLORS[1]}
                        isAnimationActive={false}
                    />
                    {/* Center dot */}
                    <circle cx={100*factor} cy={100*factor} r={8*factor} fill="#fff" stroke="black" strokeWidth={2} />
                    {/* North label */}
                    <text x={100*factor} y={25*factor} textAnchor="middle" fontSize={16*factor} fill="black" fontWeight="bold">
                        N
                    </text>
                    {/* South label */}
                    <text x={100*factor} y={185*factor} textAnchor="middle" fontSize={16*factor} fill="black" fontWeight="bold">
                        S
                    </text>
                    {/* East label */}
                    <text x={180*factor} y={105*factor} textAnchor="middle" fontSize={16*factor} fill="black" fontWeight="bold">
                        E
                    </text>
                    {/* West label */}
                    <text x={20*factor} y={105*factor} textAnchor="middle" fontSize={16*factor} fill="black" fontWeight="bold">
                        O
                    </text>
                </PieChart>
            </div>
            
        </div>
    );
};