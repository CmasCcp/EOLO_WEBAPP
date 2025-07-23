import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage.jsx";
import { DevicesPage } from "../pages/DevicesPage.jsx";
import { AddDevicesPage } from "../pages/AddDevicesPage.jsx";
import { SessionsPage } from "../pages/SessionsPage.jsx";
import { UploadDataSessionPage } from "../pages/UploadDataSessionPage.jsx";
import { DashboardPage } from "../pages/DashboardPage.jsx";
import { Breadcrumb } from "../components/Breadcrumb"; // Importar el componente Breadcrumb
import { useState, useEffect } from "react";

export const AppRoute = () => {
  const [isLogged, setIsLogged] = useState(false);

  // Función para comprobar si la cookie "logged=true" existe
  const checkLoginStatus = () => {
    const cookies = document.cookie.split(';');
    const loggedCookie = cookies.find(cookie => cookie.trim().startsWith('logged='));
    if (loggedCookie && loggedCookie.split('=')[1] === 'true') {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  };

  // Ejecutamos la verificación de la cookie al montar el componente
  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Si está logueado, redirige a /devices */}
          <Route path="/" element={isLogged ? <Navigate to="devices" /> : <LoginPage />} />
          <Route path="*" element={<>NOT FOUND</>} />
          <Route path="login" element={isLogged ? <Navigate to="devices" /> : <LoginPage />} />
          <Route path="devices" >
            <Route path="" element={<DevicesPage />} />
            <Route path=":deviceSessions" >
              <Route path="" element={<SessionsPage />} />
              <Route path="upload-data-sessions" element={<UploadDataSessionPage />} />
            </Route>
          </Route>
          <Route path="add-device" element={<AddDevicesPage />} />
          <Route path="dashboard">
            <Route path="" element={<DashboardPage />} />
            <Route path=":device">
              <Route path="" element={<DashboardPage />} />
              <Route path=":session" element={<DashboardPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};
