export const onLogin = async (username, password) => {
    try {
        const response = await fetch(import.meta.env.VITE_REACT_APP_API_URL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Guardar username en localStorage
            localStorage.setItem('username', username);
            localStorage.setItem('id_usuario', data.id_usuario);
            // Puedes guardar token si tu backend lo retorna
            return { success: true, data };
        } else {
            return { success: false, error: data.error || 'Error de autenticación' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
};


export const onLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('id_usuario');
    document.cookie = "logged=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export const isLoggedIn = () => {
    return !!localStorage.getItem('id_usuario');
}