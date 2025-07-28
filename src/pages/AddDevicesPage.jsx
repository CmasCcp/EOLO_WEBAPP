import React, { useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import { Breadcrumb } from '../components/Breadcrumb'
import tarjetaImg from "../assets/tarjeta.png"
import InputWithImagePopover from '../components/InputWithImagePopover'

export const AddDevicesPage = () => {
  const navigate = useNavigate();
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
  
  // Estado para manejar los datos del dispositivo
  const [patente, setPatente] = useState('');
  const [pin, setPin] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [valid, setValid] = useState(false);


  const handleAddDevice = async (e) => {
    e.preventDefault();  // Evitar que el formulario se recargue

    // Validar que los campos no estén vacíos
    if (!patente || !deviceModel || !valid) {
      console.log(patente, deviceModel, valid)
      setError('Por favor, completa todos los campos');
      return;
    }

    // Crear el objeto con los datos del dispositivo
    const newDevice = {
      patente: patente,
      modelo: deviceModel,
    };

    try {
      // Realizar el POST al backend
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/add-device`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDevice),
      });

      // Verificar si la respuesta es exitosa
      if (response.ok) {
        const data = await response.json();
        setSuccessMessage('Dispositivo agregado exitosamente');
        setError('');
        // Limpiar los campos después de agregar el dispositivo
        setPatente('');
        setDeviceModel('');
        setPin('');
        setValid(false);
        navigate(-1)


      } else {
        const data = await response.json();

        throw new Error(data.error);
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  const handleValidateDevice = async (e) => {
    e.preventDefault(); // Evitar que el formulario se recargue

    if (!patente || !pin) {
      setError("Por favor, ingresa la patente y el PIN");
      return;
    }
    setError(""); // Limpiar el error si los campos están llenos

    try {
      // Hacer la solicitud GET al backend para validar el PIN
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/validate-pin?text=${encodeURIComponent(patente)}&pin=${encodeURIComponent(pin)}`);

      const data = await response.json();

      if (response.ok) {
        console.log("validado")
        // Si la respuesta es exitosa, mostramos un mensaje de PIN válido
        setSuccessMessage("Dispositivo validado");

        try {
          const deviceRes = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/dispositivo?patente=${encodeURIComponent(patente)}`);
          const deviceData = await deviceRes.json();
          setValid(true);
          setDeviceModel(deviceData.modelo)

          console.log(deviceData)
        } catch (error) {
          console.log(error)
        }

      } else {
        // Si la respuesta es un error, mostramos el mensaje de error
        setError(data.message || "PIN incorrecto");
      }
    } catch (err) {
      // En caso de error en la solicitud, mostrar el error
      setError("Hubo un problema al validar el PIN");
    }
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <Breadcrumb />

        <h2 className="fw-bold mb-4">Asociar dispositivo</h2>

      

        <form onSubmit={handleAddDevice}>
            <InputWithImagePopover
              label="Patente dispositivo:"
              id="patente"
              placeholder="Ingrese la patente"
              value={patente}
              onChange={(e) => { setPatente(e.target.value); setValid(false); setDeviceModel("") }} // Actualiza el estado con la patente ingresada
              img_url={"tarjeta.png"}
              instruccion={"La patente está en la parte trasera del dispositivo."}
            />

            <InputWithImagePopover
              label="Pin dispositivo:"
              id="pin"
              placeholder="Ingrese el pin"
              value={pin}
              onChange={(e) => { setPin(e.target.value);; setValid(false); setDeviceModel("") }} // Actualiza el estado con el PIN ingresado
              img_url={"tarjeta.png"}
              instruccion={"El pin está en la parte trasera del dispositivo."}
            />

          {/* <b className='text-success'>{successMessage}</b> */}
          <b className='text-danger'>{error}</b>

          <div className="mb-4 ms-auto">

            <button
              disabled={valid}
              onClick={handleValidateDevice}
              className='btn btn-success ms-auto'>
              {valid ? "Dispositivo validado" : "Validar dispositivo"}
            </button>
          </div>

          {/* Modelo */}
          {/* TODO: CAMBIAR ESTO A UNA DESCRIPCION DEL DISPOSITIVO QUE TIENE LA PATENTE INSERTADA */}
          <div className="mb-4">
            <label htmlFor="nombre" className="form-label fw-semibold">
              Modelo:
            </label>
            <input
              type="text"
              id="modelo"
              className="form-control"
              value={deviceModel}
              disabled
            />
          </div>

          <div className="row">
            <button type="submit" className="btn btn-dark" disabled={!valid}>
              Agregar Dispositivo
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
