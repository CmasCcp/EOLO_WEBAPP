import React, { useState, useEffect } from 'react';
import { Popover, PopoverBody } from 'reactstrap';

const InputWithImagePopover = ({ label, id, placeholder, value, onChange, img_url, instruccion }) => {
    const [popoverOpen, setPopoverOpen] = useState(false);

    // Función para cambiar el estado del Popover
    const togglePopover = () => setPopoverOpen(!popoverOpen);

    return (
        <div className="mb-3">
            <label htmlFor={id} className="form-label fw-semibold">
                {label}
            </label>
            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
                {/* Ícono de ayuda con un Popover */}
                <span
                    style={{"cursor":"pointer"}}
                    className="input-group-text"
                    id={`popover-${id}`}
                    onClick={togglePopover} // Toggle on click
                //   onMouseOver={togglePopover}
                >
                    <i className="fas fa-question-circle"></i>
                </span>
            </div>

            {/* Definimos el Popover con una imagen */}
            <Popover
                placement="top"
                isOpen={popoverOpen}
                target={`popover-${id}`}
                toggle={togglePopover}
            >
                <PopoverBody>
                    <img
                        className='mx-auto d-block'
                        src={img_url} // Reemplaza por la URL de tu imagen
                        alt={id}
                        style={{ width: '50%', height: 'auto' }}
                    />
                    <p className='text-center'>{instruccion}</p>
                </PopoverBody>
            </Popover>
        </div>
    );
};

export default InputWithImagePopover;
