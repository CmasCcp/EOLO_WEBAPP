import { Routes, Route } from "react-router-dom"
import { LoginPage } from "../pages/LoginPage.jsx"
import { DevicesPage } from "../pages/DevicesPage.jsx"
import { AddDevicesPage } from "../pages/AddDevicesPage.jsx"
import { SessionsPage } from "../pages/SessionsPage.jsx"
import { UploadDataSessionPage } from "../pages/UploadDataSessionPage.jsx"
import { DashboardPage } from "../pages/DashboardPage.jsx"

export const AppRoute = () => {
    return (
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="*" element={<LoginPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/devices" element={<DevicesPage/>}/>
            <Route path="/add-device" element={<AddDevicesPage/>}/>
            <Route path="/sessions" element={<SessionsPage/>}/>
            <Route path="/upload-data-sessions" element={<UploadDataSessionPage/>}/>
            <Route path="/dashboard" element={<DashboardPage/>}/>
        </Routes>
    )
}