import React from 'react'

export const CardGraphic = ({titulo, valor, unidad}) => {
    return (
        <div className="mb-2 mx-1">
            <div className="card h-100 text-center shadow-sm">
                <div className="card-body">
                    <h6 className="card-title mb-2">{titulo}</h6>
                    <span className="fs-3 fw-bold">{isNaN(valor) ? '-' : valor}{unidad}</span>
                </div>
            </div>
        </div>
    )
}
