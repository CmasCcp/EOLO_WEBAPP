import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DashboardHeaderComponent } from './components/DashboardHeaderComponent.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <div className="row mx-auto p-5 bg-secondary vh-100"> */}
      {/* <div className="col-md-10 mx-auto"> */}
      {/* <DashboardHeaderComponent /> */}
      {/* </div> */}
    {/* </div> */}
  </StrictMode>,
)
