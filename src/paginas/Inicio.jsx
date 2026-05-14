import { useNavigate } from 'react-router-dom'
import './Inicio.css'

function Inicio() {
  const navigate = useNavigate()

  return (
    <section id="inicio" className="hero">
      {/* Imagem de fundo */}
      <div className="hero__bg" />

      {/* Conteúdo centralizado */}
      <div className="hero__content">
        <h1 className="hero__title">
          A JMarinho tem o imóvel ideal para você
        </h1>
        <p className="hero__subtitle">
          Encontre seu próximo lar com quem entende do assunto
        </p>
        <button className="hero__btn" onClick={() => navigate('/imoveis')}>
          Ver Imóveis
        </button>
      </div>
    </section>
  )
}

export default Inicio