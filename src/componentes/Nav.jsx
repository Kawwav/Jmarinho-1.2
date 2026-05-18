import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import './Nav.css'

const navItems = [
  { label: 'Início', to: '/' },
  { label: 'Imóveis', to: '/imoveis' },
  { label: 'Comercial', to: '/comercial' },
  { label: 'Sobre a JMarinho', to: '/sobre' },
  { label: 'Contato', to: '/contato' },
  { label: 'Adm', to: '/adm' },
]

function Nav() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const heroRoutes = ['/', '/sobre', '/contato']
  const isHero = heroRoutes.includes(pathname)

  // Esconde o Nav completamente na página Adm (ela tem sua própria topbar)
  if (pathname === '/adm') return null

  // Fecha o menu ao trocar de rota
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Trava o scroll quando o menu está aberto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header className={`nav ${isHero ? 'nav--hero' : 'nav--solid'} ${menuOpen ? 'nav--open' : ''}`}>
      <div className="nav__inner">
        <NavLink to="/" className="nav__logo" aria-label="JMarinho - Início">
          <img src="./logo.png" alt="JMarinho" />
        </NavLink>
        <nav aria-label="Menu principal" className="nav__desktop">
          <ul className="nav__links">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  end={item.to === '/'}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav__right" aria-hidden="true" />

        <button
          className={`nav__burger ${menuOpen ? 'nav__burger--open' : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div className={`nav__drawer ${menuOpen ? 'nav__drawer--open' : ''}`} aria-hidden={!menuOpen}>
        <nav aria-label="Menu mobile">
          <ul className="nav__drawer-links">
            {navItems.map((item, i) => (
              <li key={item.to} style={{ '--i': i }}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  end={item.to === '/'}
                  tabIndex={menuOpen ? 0 : -1}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {menuOpen && (
        <div className="nav__overlay" onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}
    </header>
  )
}

export default Nav