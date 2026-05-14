import { NavLink, useLocation } from 'react-router-dom'
import './Nav.css'

const navItems = [
  { label: 'Início', to: '/' },
  { label: 'Imóveis', to: '/imoveis' },
  { label: 'Comercial', to: '/comercial' },
  { label: 'Sobre a JMarinho', to: '/sobre' },
  { label: 'Contato', to: '/contato' },
]

function Nav() {
  const { pathname } = useLocation()
  // Rotas com header imersivo: nav transparente com letras brancas
  const heroRoutes = ['/', '/sobre']
  const isHero = heroRoutes.includes(pathname)

  return (
    <header className={`nav ${isHero ? 'nav--hero' : 'nav--solid'}`}>
      <div className="nav__inner">
        <NavLink to="/" className="nav__logo" aria-label="JMarinho - Início">
          <img src="/logo.png" alt="JMarinho" />
        </NavLink>

        <nav aria-label="Menu principal">
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
      </div>
    </header>
  )
}

export default Nav