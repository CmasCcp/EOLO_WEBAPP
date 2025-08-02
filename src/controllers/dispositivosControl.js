// Traer todos los dispositivos
export const getMisDispositivos = async () => {
    const id_usuario = localStorage.getItem('id_usuario');
    const response = await fetch(
        import.meta.env.VITE_REACT_APP_API_URL + `/mis-dispositivos?usuario=${encodeURIComponent(id_usuario)}`);

    return response;
};

// Agregar un nuevo dispositivo
export const addDispositivo = async (patente, modelo) => {
    try {
        const response = await fetch(import.meta.env.VITE_REACT_APP_API_URL + '/add-device', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ patente, modelo }),
        });
        const data = await response.json();
        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, error: data.error || 'Error al agregar dispositivo' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
};