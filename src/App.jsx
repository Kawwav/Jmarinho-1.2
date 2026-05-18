import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './componentes/Nav'
import Footer from './componentes/Footer'
import Inicio from './paginas/Inicio'
import Imoveis from './paginas/Imoveis'
import Comercial from './paginas/Comercial'
import Sobre from './paginas/Sobre'
import Contato from './paginas/Contato'
import Adm from './paginas/Adm'
import './App.css'

/*git add .*/
/*git commit -m "....."*/
/*git push*/

/*npm run deploy*/


function App() {
  return (
    <BrowserRouter basename="/Jmarinho-1.2">
      <Routes>
        {/* Rota do painel — sem Nav e sem Footer */}
        <Route path="/adm" element={<Adm />} />

        {/* Rotas públicas — com Nav e Footer */}
        <Route path="/*" element={
          <>
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
          </>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App