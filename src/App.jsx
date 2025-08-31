import './index.css'
import { AppRoute } from './routes/AppRoute'
import { BrowserRouter } from 'react-router-dom'


function App() {

  return (
    <>
      <div style={{ minHeight: "100vh" }}>
        <AppRoute />
      </div>

        <footer style={{ position: "relative", bottom: 0, width: "100%" }} className="mt-5 bg-dark text-white text-center py-3">
          © 2025 EOLO WebApp. Todos los derechos reservados.
        </footer>
    </>
  )
}

export default App
