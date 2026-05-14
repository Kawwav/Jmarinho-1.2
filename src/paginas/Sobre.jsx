import { useEffect, useRef, useState, useCallback } from 'react'
import './Sobre.css'

/* ────────────────────────────────────────
   Hook: progresso 0→1 controlado em tempo
   real pelo scroll da página.

   - 0  quando o elemento entra pela base da tela
   - 1  quando o topo do elemento chega a 30% da tela
   - Funciona para cima e para baixo
──────────────────────────────────────── */
function useScrollProgress() {
  const ref = useRef(null)
  const [progress, setProgress] = useState(0)

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return

    const rect    = el.getBoundingClientRect()
    const winH    = window.innerHeight

    // scroll começa quando bottom do el cruza o fundo da tela
    // scroll termina quando top do el chega em 30% da tela
    const start   = winH              // rect.top quando começa
    const end     = winH * 0.30       // rect.top quando termina

    const raw     = (start - rect.top) / (start - end)
    const clamped = Math.min(Math.max(raw, 0), 1)

    setProgress(clamped)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [update])

  return [ref, progress]
}

/* ────────────────────────────────────────
   Componente individual de linha animada
──────────────────────────────────────── */
function NumeroAnimado({ valorFinal, prefixo = '', label, formatMil = false }) {
  const [ref, progress] = useScrollProgress()

  const count     = Math.floor(progress * valorFinal)
  const pct       = progress * 100
  const formatted = formatMil ? count.toLocaleString('pt-BR') : String(count)

  return (
    <div className="numero-item" ref={ref}>
      <div className="numero-track">
        <div className="numero-track__label">{label}</div>
        <div className="numero-track__bar-wrap">
          <div className="numero-track__fill" style={{ width: `${pct}%` }} />
          <div className="numero-track__dot"  style={{ left:  `${pct}%` }} />
        </div>
      </div>
      <div className="numero-valor">
        {prefixo}{formatted}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────
   Placeholder de imagem (prédio estilizado)
   — substitua src="/parceiro-X.jpg" quando
     tiver as imagens reais
──────────────────────────────────────── */
function ImagemParceiro({ src, alt }) {
  if (src) {
    return <img className="parceiro-card__imagem" src={src} alt={alt} />
  }

  // Placeholder SVG enquanto não há imagem real
  return (
    <div className="parceiro-card__imagem-placeholder" aria-hidden="true">
      <svg width="80" height="120" viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="20" width="60" height="90" fill="white" />
        <rect x="15" y="28" width="10" height="12" fill="#111418" />
        <rect x="30" y="28" width="10" height="12" fill="#111418" />
        <rect x="45" y="28" width="10" height="12" fill="#111418" />
        <rect x="15" y="46" width="10" height="12" fill="#111418" />
        <rect x="30" y="46" width="10" height="12" fill="#111418" />
        <rect x="45" y="46" width="10" height="12" fill="#111418" />
        <rect x="15" y="64" width="10" height="12" fill="#111418" />
        <rect x="30" y="64" width="10" height="12" fill="#111418" />
        <rect x="45" y="64" width="10" height="12" fill="#111418" />
        <rect x="28" y="85" width="24" height="25" fill="#111418" />
      </svg>
    </div>
  )
}

/* ────────────────────────────────────────
   Card de parceiro
──────────────────────────────────────── */
function ParceiroCaard({ titulo, descricao, imagemSrc, href = '#' }) {
  return (
    <div className="parceiro-card">
      <h3 className="parceiro-card__titulo">{titulo}</h3>
      <p  className="parceiro-card__descricao">{descricao}</p>
      <ImagemParceiro src={imagemSrc} alt={titulo} />
      <a
        className="parceiro-card__botao"
        href={href}
        onMouseMove={e => {
          const r = e.currentTarget.getBoundingClientRect()
          e.currentTarget.style.setProperty('--bx', `${e.clientX - r.left}px`)
          e.currentTarget.style.setProperty('--by', `${e.clientY - r.top}px`)
        }}
      >
        Saiba mais
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M1 5H13M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </div>
  )
}

/* ────────────────────────────────────────
   Página Sobre
──────────────────────────────────────── */
function Sobre() {
  return (
    <div className="sobre-page">

      <header className="sobre-hero">
        <div className="sobre-hero__bg" />
        <div className="sobre-hero__gradient" />
        <div className="sobre-hero__content">
          <p className="sobre-hero__eyebrow">Quem somos</p>
          <h1 className="sobre-hero__title">A JMarinho</h1>
          <p className="sobre-hero__sub">
            Tradição, confiança e dedicação no mercado imobiliário
          </p>
        </div>
      </header>

      <main className="sobre-main">

        <section className="sobre-intro">
          <div className="sobre-intro__inner">
            <div className="sobre-intro__texto">
              <h2 className="sobre-section-title">Nossa história</h2>
              <p>
                A JMarinho Imóveis atua no mercado imobiliário com o compromisso de oferecer um atendimento transparente, seguro e focado nas necessidades de cada cliente. Especializada em compra, venda, locação e administração de imóveis residenciais e comerciais em Curitiba e região metropolitana, a empresa busca sempre os melhores resultados em cada negociação.
              </p>
              <p>
               Com experiência no setor e visão voltada ao futuro, a JMarinho também oferece oportunidades para quem deseja investir em imóveis novos e na planta, proporcionando opções de crescimento e valorização a médio e longo prazo.
              </p>
            </div>

            <div className="sobre-intro__numeros">
              <NumeroAnimado
                valorFinal={200}
                prefixo="+"
                label="Imóveis negociados"
              />
              <NumeroAnimado
                valorFinal={10}
                prefixo="+"
                label="Anos de mercado"
              />
              <NumeroAnimado
                valorFinal={1000}
                prefixo="+"
                label="Clientes atendidos"
                formatMil
              />
            </div>
          </div>
        </section>

        {/* parceiros*/}
        <section className="sobre-parceiros">
          <div className="sobre-parceiros__inner">
            <h2 className="sobre-parceiros__titulo">Nossos Parceiros</h2>

            <div className="parceiros-grid">
              <ParceiroCaard
                titulo="Construtora Alpha"
                descricao="Especialistas em empreendimentos residenciais de alto padrão em Curitiba e região metropolitana."
                imagemSrc=""          
                href="#"
              />
              <ParceiroCaard
                titulo="Banco Imobiliário"
                descricao="Soluções de financiamento com as melhores taxas do mercado para aquisição de imóveis."
                imagemSrc=""          
                href="#"
              />
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}

export default Sobre