import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './componentes/Nav'
import Footer from './componentes/Footer'
import Inicio from './paginas/Inicio'
import Imoveis from './paginas/Imoveis'
import Comercial from './paginas/Comercial'
import Sobre from './paginas/Sobre'
import Contato from './paginas/Contato'
import './App.css'

/*git add .*/
/*git commit -m "Explique o que você fez aqui"*/
/*git push*/

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/imoveis" element={<Imoveis />} />
          <Route path="/comercial" element={<Comercial />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<Contato />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App