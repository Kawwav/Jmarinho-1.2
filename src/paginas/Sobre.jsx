import { useEffect, useRef, useState, useCallback } from 'react'
import './Sobre.css'

function useScrollProgress() {
  const ref = useRef(null)
  const [progress, setProgress] = useState(0)

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return

    const rect    = el.getBoundingClientRect()
    const winH    = window.innerHeight

    const start   = winH
    const end     = winH * 0.30

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
──────────────────────────────────────── */
function ImagemParceiro({ src, alt }) {
  if (src) {
    return <img className="parceiro-card__imagem" src={src} alt={alt} />
  }

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
function ParceiroCaard({ numero, tag, titulo, descricao, href = '#' }) {
  return (
    <div className="parceiro-card">
      <div className="parceiro-card__top">
        <span className="parceiro-card__num">{numero}</span>
        {tag && <span className="parceiro-card__tag">{tag}</span>}
      </div>
      <div className="parceiro-card__body">
        <h3 className="parceiro-card__titulo">{titulo}</h3>
        <p className="parceiro-card__descricao">{descricao}</p>
      </div>
      <div className="parceiro-card__divider" />
      <div className="parceiro-card__footer">
        <a className="parceiro-card__botao" href={href}>
          Saiba mais
          <svg width="12" height="9" viewBox="0 0 14 10" fill="none" aria-hidden="true">
            <path d="M1 5H13M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────
   Seção: Localização com Google Maps escuro
──────────────────────────────────────── */
function SecaoLocalizacao() {
  const ENDERECO = 'Av. Cândido Hartmann, 1326 – Mercês, Curitiba – PR'
  const MAPS_EMBED_URL =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3601.7!2d-49.3037!3d-25.4167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce4b7c08b5b3d%3A0x0!2sAv.%20C%C3%A2ndido%20Hartmann%2C%201326%20-%20Merc%C3%AAs%2C%20Curitiba%20-%20PR!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr&style=feature:all|element:geometry|color:0x1a2535&style=feature:all|element:labels.text.stroke|color:0x1a2535&style=feature:all|element:labels.text.fill|color:0x8ea4b5&style=feature:administrative|element:geometry|color:0x1a2535&style=feature:poi|element:geometry|color:0x0d1b2a&style=feature:road|element:geometry|color:0x253a4e&style=feature:road|element:labels.text.fill|color:0x8ea4b5&style=feature:transit|element:geometry|color:0x0d1b2a&style=feature:water|element:geometry|color:0x0d1b2a'


  const EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent('Av. Cândido Hartmann, 1326, Mercês, Curitiba, PR')}&t=&z=16&ie=UTF8&iwloc=&output=embed`

  return (
    <section className="sobre-localizacao">
      <div className="sobre-localizacao__inner">

        <div className="sobre-localizacao__header">
          <h2 className="sobre-localizacao__titulo">Nossa Localização</h2>
          <p className="sobre-localizacao__endereco">
            <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M7 0C3.134 0 0 3.134 0 7c0 5.25 7 11 7 11s7-5.75 7-11c0-3.866-3.134-7-7-7zm0 9.5A2.5 2.5 0 1 1 7 4.5a2.5 2.5 0 0 1 0 5z" fill="var(--azul-claro)"/>
            </svg>
            {ENDERECO}
          </p>
        </div>

        <div className="sobre-localizacao__mapa-wrap">
          <iframe
            className="sobre-localizacao__iframe"
            title="Localização JMarinho Imóveis"
            src={EMBED_URL}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="sobre-localizacao__overlay-corner" aria-hidden="true" />
        </div>

        <div className="sobre-localizacao__horarios">
          <div className="sobre-localizacao__horarios-titulo">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Horário de Funcionamento
          </div>
          <div className="sobre-localizacao__horarios-lista">
            <div className="sobre-localizacao__horario-item">
              <span className="sobre-localizacao__horario-dia">Segunda a Sexta</span>
              <span className="sobre-localizacao__horario-sep" />
              <span className="sobre-localizacao__horario-horas">09:00 – 12:00 &nbsp;|&nbsp; 13:30 – 16:30</span>
            </div>
            <div className="sobre-localizacao__horario-item sobre-localizacao__horario-item--plantao">
              <span className="sobre-localizacao__horario-dia">Sábado</span>
              <span className="sobre-localizacao__horario-sep" />
              <span className="sobre-localizacao__horario-horas">
                Plantão&nbsp;
                <a
                  className="sobre-localizacao__whatsapp"
                  href="https://wa.me/5541988968486"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.533 5.858L.057 23.486a.5.5 0 0 0 .611.61l5.78-1.516A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.497-5.195-1.367l-.373-.217-3.43.9.914-3.337-.237-.386A9.955 9.955 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                  98896.8486
                </a>
              </span>
            </div>
          </div>
        </div>

        <a
          className="sobre-localizacao__cta"
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Av. Cândido Hartmann, 1326, Mercês, Curitiba, PR')}`}
          target="_blank"
          rel="noopener noreferrer"
          onMouseMove={e => {
            const r = e.currentTarget.getBoundingClientRect()
            e.currentTarget.style.setProperty('--bx', `${e.clientX - r.left}px`)
            e.currentTarget.style.setProperty('--by', `${e.clientY - r.top}px`)
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
          </svg>
          Traçar rota no Google Maps
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M1 5H13M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>

      </div>
    </section>
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
                 A JMarinho Imóveis nasceu da paixão pelo mercado imobiliário e do compromisso em oferecer soluções seguras, transparentes e eficientes para seus clientes.

Ao longo de mais de três décadas de atuação, a empresa construiu uma sólida reputação baseada na confiança, credibilidade e excelência no atendimento, participando da intermediação, administração e desenvolvimento de centenas de negócios imobiliários.
              </p>
              <p>
               Com forte atuação no Paraná e em Santa Catarina, a JMarinho Imóveis oferece soluções em compra, venda, locação e administração de imóveis residenciais e comerciais, sempre com acompanhamento próximo e atendimento personalizado.

Hoje, mantém os mesmos valores que marcaram sua trajetória: ética, dedicação, transparência e respeito às pessoas.

JMarinho Imóveis. Mais de 30 anos transformando oportunidades em conquistas.
              </p>
            </div>

            <div className="sobre-intro__numeros">
              <NumeroAnimado
                valorFinal={200}
                prefixo="+"
                label="Imóveis negociados"
              />
              <NumeroAnimado
                valorFinal={30}
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

        {/* parceiros */}
        <section className="sobre-parceiros">
          <div className="sobre-parceiros__inner">
            <h2 className="sobre-parceiros__titulo">Nossos Parceiros</h2>
            <p className="sobre-parceiros__sub">Empresas que escolhemos para garantir a melhor experiência</p>

            <div className="parceiros-grid">
              <ParceiroCaard
                numero="01"
                tag="Incorporadora"
                titulo="Parceiro 1"
                descricao="Especialistas em empreendimentos residenciais de alto padrão em Curitiba e região metropolitana."
                href="#"
              />
              <ParceiroCaard
                numero="02"
                tag="Financiamento"
                titulo="Parceiro 2"
                descricao="Soluções de financiamento com as melhores taxas do mercado para aquisição de imóveis."
                href="#"
              />
            </div>
          </div>
        </section>

        {/* localização */}
        <SecaoLocalizacao />

      </main>
    </div>
  )
}

export default Sobre