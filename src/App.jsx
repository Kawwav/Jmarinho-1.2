import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Nav from './componentes/Nav'
import Footer from './componentes/Footer'
import Inicio from './paginas/Inicio'
import Imoveis from './paginas/Imoveis'
import Comercial from './paginas/Comercial'
import Sobre from './paginas/Sobre'
import Contato from './paginas/Contato'
import Adm from './paginas/Adm'
import Login from './paginas/Login'
import './App.css'

/*git add .*/
/*git commit -m "....."*/
/*git push*/

/*npm run deploy*/


function App() {
  const [sessao, setSessao] = useState(undefined) // undefined = ainda verificando

  useEffect(() => {
    // Verifica se já tem sessão ativa
    supabase.auth.getSession().then(({ data }) => {
      setSessao(data.session)
    })

    // Fica escutando mudanças de login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessao(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // Ainda verificando sessão — não renderiza nada para evitar flash
  if (sessao === undefined) return null

  return (
    <BrowserRouter basename="/Jmarinho-1.2">
      <Routes>

        {/* Rota de login */}
        <Route
          path="/login"
          element={sessao ? <Navigate to="/adm" replace /> : <Login />}
        />

        {/* Rota do painel — protegida */}
        <Route
          path="/adm"
          element={sessao ? <Adm /> : <Navigate to="/login" replace />}
        />

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