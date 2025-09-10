import React, { useState } from 'react'

export const CardGraphic = ({ onClick, titulo, min = null, max = null, valor, unidad }) => {
    const [showStats, setShowStats] = useState(false);

    const handleOnClick = (e) => {
        e.stopPropagation();
        onClick();
        // setShowStats(prev => !prev);
    }
    return (
        <div className="mb-2 mx-0">
            <div className="h-auto card text-center shadow-sm" id={titulo} onClick={handleOnClick} style={{ cursor: 'pointer' }}>

                <div className="card-body px-2">
                    <h6 className="fs-6 card-title mb-1 ">{titulo}</h6>
                    <span className=" fw-bold">{isNaN(valor) ? '-' : valor} {unidad}</span>
                </div>
                <button
                    className={" m-0 mb-0 btn btn-outline-secondary" + (showStats ? " active" : "")}
                    onClick={() => setShowStats(!showStats)}
                >
                </button>
                <hr className='my-0' />


            </div>
            {(showStats && min !== null && max !== null) && (
                <div className="fs-6 d-flex flex-row justify-content-center bg-secondary px-1 py-2">
                    <div className="w-50 text-center fw-bold border-end">
                        <small className="text-dark ">Mín: <br /> {isNaN(min) ? '-' : min} {unidad}</small>
                    </div>
                    <div className="w-50 text-center fw-bold">
                        <small className="text-dark">Máx: <br /> {isNaN(max) ? '-' : max} {unidad}</small>
                    </div>
                </div>
            )}
        </div>
    )
}