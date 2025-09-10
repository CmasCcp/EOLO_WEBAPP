import React from 'react'

export const MovilCardGraphic = ({
    titulo = "-", min = "-", max = "-", valor = "-", unidad = "l/min"
}) => {
    return (
        <div className="col-6 mb-2">
            <div>
                <span className="fw-bold">{titulo}</span>
                <div>{valor} <small>{unidad}</small></div>
                <div>
                    <small className="text-muted">Mín: {min} {unidad} | Máx: {max} {unidad}</small>
                </div>
            </div>
        </div>
    )
}
