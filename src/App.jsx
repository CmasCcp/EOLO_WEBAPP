import './App.css'
import { AppRoute } from './routes/AppRoute'
import { BrowserRouter } from 'react-router-dom'


function App() {

  return (
    <>
    <BrowserRouter>
      <AppRoute/>
    </BrowserRouter>
    </>
  )
}

export default App
