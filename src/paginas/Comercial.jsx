import { useState, useEffect, useCallback } from 'react'
import Nav from '../componentes/Nav'
import Footer from '../componentes/Footer'
import { supabase } from '../supabaseClient'
import './Comercial.css'

const tipos = ['Todos', 'Venda', 'Aluguel']
const categorias = ['Loja', 'Barracão', 'Escritório', 'Prédio Comercial', 'Galpão']

function formatarValor(valor, modalidade) {
  if (valor === undefined || valor === null || valor === '') return '—'
  const num = Number(valor) || 0
  const fmt = num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })
  return modalidade === 'aluguel' ? `${fmt}/mês` : fmt
}

function IconeCategoria({ categoria }) {
  switch (categoria) {
    case 'Loja':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l1-6h16l1 6"/><path d="M3 9a2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2 2 2 0 0 0 2 2 2 2 0 0 0 2-2"/>
          <path d="M5 11v9h14v-9"/>
        </svg>
      )
    case 'Galpão':
    case 'Barracão':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 20h20M4 20V10l8-6 8 6v10"/><path d="M10 20v-6h4v6"/>
        </svg>
      )
    case 'Escritório':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 21V3M2 9h6M2 15h6M14 9h6M14 15h6M14 3v18"/>
        </svg>
      )
    case 'Prédio Comercial':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M9 21v-4h6v4"/><rect x="9" y="10" width="2" height="2"/><rect x="13" y="10" width="2" height="2"/><rect x="9" y="14" width="2" height="2"/><rect x="13" y="14" width="2" height="2"/>
        </svg>
      )
    default:
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/>
        </svg>
      )
  }
}

function ComercialModal({ imovel, onClose }) {
  const temImagens = imovel.imagens && imovel.imagens.length > 0
  const totalFotos = temImagens ? imovel.imagens.length : 1
  const [fotoAtual, setFotoAtual] = useState(0)

  const prev = useCallback(() => setFotoAtual(f => (f - 1 + totalFotos) % totalFotos), [totalFotos])
  const next = useCallback(() => setFotoAtual(f => (f + 1) % totalFotos), [totalFotos])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next])

  const tipoLabel = imovel.modalidade === 'aluguel' ? 'ALUGUEL' : 'VENDA'

  return (
    <div className="com-modal-overlay" onClick={onClose}>
      <div className="com-modal-container" onClick={e => e.stopPropagation()}>

        <div className="com-modal-carousel">
          <div className="carousel-top-fade" />

          {temImagens ? (
            <img
              src={imovel.imagens[fotoAtual]?.url}
              alt={imovel.titulo}
              className="carousel-img"
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          ) : (
            <div
              className="carousel-img"
              style={{
                background: `linear-gradient(135deg,
                  hsl(${195 + fotoAtual * 20}, 55%, 22%) 0%,
                  hsl(${205 + fotoAtual * 15}, 65%, 32%) 50%,
                  hsl(${215 + fotoAtual * 10}, 45%, 18%) 100%)`
              }}
            />
          )}

          <div className="carousel-counter">
            {fotoAtual + 1} / {totalFotos}
            <span className="carousel-tipo">{tipoLabel}</span>
          </div>
          <span className="carousel-categoria">{imovel.categoria ? imovel.categoria.toUpperCase() : ''}</span>

          {totalFotos > 1 && (
            <>
              <button className="carousel-btn carousel-prev" onClick={prev}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button className="carousel-btn carousel-next" onClick={next}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
              <div className="carousel-dots">
                {imovel.imagens.map((_, i) => (
                  <button key={i} className={`carousel-dot ${i === fotoAtual ? 'active' : ''}`} onClick={() => setFotoAtual(i)} />
                ))}
              </div>
            </>
          )}

          <button className="com-modal-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Coluna direita */}
        <div className="com-modal-content-col">
        <div className="com-modal-body">
          <div className="com-modal-header-row">
            <p className="com-modal-endereco">
              {[imovel.bairro, imovel.cidade].filter(Boolean).join(' — ')}
            </p>
            <p className="com-modal-preco">{formatarValor(imovel.valor, imovel.modalidade)}</p>
          </div>
          <h2 className="com-modal-titulo">{imovel.titulo}</h2>
          {imovel.descricao && <p className="com-modal-descricao">{imovel.descricao}</p>}

          <div className="com-modal-specs">
            {imovel.area && (
              <div className="com-modal-spec-item">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/>
                </svg>
                <span className="spec-valor">{imovel.area} m²</span>
                <span className="spec-label">ÁREA</span>
              </div>
            )}
            {imovel.vagas && (
              <div className="com-modal-spec-item">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3l-4 4-4-4"/>
                </svg>
                <span className="spec-valor">{imovel.vagas}</span>
                <span className="spec-label">VAGAS</span>
              </div>
            )}
            {imovel.banheiros && (
              <div className="com-modal-spec-item">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12h16M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6M4 12v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>
                </svg>
                <span className="spec-valor">{imovel.banheiros}</span>
                <span className="spec-label">BANHEIROS</span>
              </div>
            )}
            {imovel.categoria && (
              <div className="com-modal-spec-item">
                <IconeCategoria categoria={imovel.categoria} />
                <span className="spec-valor">{imovel.categoria}</span>
                <span className="spec-label">TIPO</span>
              </div>
            )}
          </div>
        </div>

        <div className="com-modal-footer">
          <button className="com-modal-btn-contato">ENTRAR EM CONTATO</button>
          <button className="com-modal-btn-voltar" onClick={onClose}>VOLTAR</button>
        </div>
        </div>
      </div>
    </div>
  )
}

/* ── Card ── */
function ComercialCard({ imovel, onAbrir }) {
  const temImagem = imovel.imagens && imovel.imagens.length > 0
  const tipoLabel = imovel.modalidade === 'aluguel' ? 'ALUGUEL' : 'VENDA'
  const badgeClass = imovel.modalidade === 'aluguel' ? 'badge-alugar' : 'badge-venda'

  return (
    <div className="imovel-card" onClick={() => onAbrir(imovel)}>
      <div className="card-img">
        {temImagem ? (
          <img src={imovel.imagens[0].url} alt={imovel.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="card-img-placeholder comercial" />
        )}
        <span className={`card-badge ${badgeClass}`}>{tipoLabel}</span>
        <span className="card-categoria">{imovel.categoria ? imovel.categoria.toUpperCase() : ''}</span>
      </div>

      <div className="card-body">
        <p className="card-localizacao">
          {[imovel.bairro, imovel.cidade].filter(Boolean).join(' · ')}
        </p>
        <h3 className="card-titulo">{imovel.titulo}</h3>
        <p className="card-preco">{formatarValor(imovel.valor, imovel.modalidade)}</p>

        <div className="card-specs">
          {imovel.area && (
            <span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/>
              </svg>
              {imovel.area} m²
            </span>
          )}
          {imovel.vagas && (
            <span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3l-4 4-4-4"/>
              </svg>
              {imovel.vagas} vagas
            </span>
          )}
          {imovel.banheiros && (
            <span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12h16M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6M4 12v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>
              </svg>
              {imovel.banheiros} ban.
            </span>
          )}
          {imovel.categoria && (
            <span>
              <IconeCategoria categoria={imovel.categoria} />
              {imovel.categoria}
            </span>
          )}
        </div>

        <button className="card-btn">VER DETALHES</button>
      </div>
    </div>
  )
}

/* ── Filtro Dropdown reutilizável ── */
function FiltroDropdown({ icone, rotulo, valor, aberto, onToggle, onLimpar, children }) {
  return (
    <div className="filtro-wrapper">
      <button
        className={`filtro-input ${aberto ? 'open' : ''} ${valor ? 'ativo' : ''}`}
        onClick={onToggle}
      >
        <span className="filtro-icon">{icone}</span>
        <span className="filtro-input__texto">
          <span className="filtro-input__rotulo">{rotulo}</span>
          {valor && <span className="filtro-input__valor">{valor}</span>}
        </span>
        {valor ? (
          <span className="filtro-clear" onClick={e => { e.stopPropagation(); onLimpar() }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </span>
        ) : (
          <span className={`filtro-arrow ${aberto ? 'open' : ''}`}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </span>
        )}
      </button>
      {aberto && <ul className="filtro-dropdown">{children}</ul>}
    </div>
  )
}

/* ── Página principal ── */
function Comercial() {
  const [imoveis, setImoveis]               = useState([])
  const [carregando, setCarregando]         = useState(true)
  const [cidadeOpen, setCidadeOpen]         = useState(false)
  const [bairroOpen, setBairroOpen]         = useState(false)
  const [categoriaOpen, setCategoriaOpen]   = useState(false)
  const [valorOpen, setValorOpen]           = useState(false)
  const [areaOpen, setAreaOpen]             = useState(false)
  const [cidadeSelecionada, setCidadeSelecionada]       = useState('')
  const [bairroSelecionado, setBairroSelecionado]       = useState('')
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('')
  const [valorMax, setValorMax]                         = useState('')
  const [areaMin, setAreaMin]                           = useState('')
  const [tipoSelecionado, setTipoSelecionado]           = useState('Todos')
  const [imovelAberto, setImovelAberto]                 = useState(null)

  // Busca do Supabase — apenas comerciais
  useEffect(() => {
    async function buscar() {
      const { data, error } = await supabase
        .from('imoveis')
        .select('*')
        .eq('tipo', 'comercial')
        .order('id', { ascending: false })

      if (!error) setImoveis(data || [])
      setCarregando(false)
    }
    buscar()
  }, [])

  // Listas dinâmicas baseadas nos dados reais
  const cidades = [...new Set(imoveis.map(i => i.cidade).filter(Boolean))]
  const bairros = [...new Set(imoveis.map(i => i.bairro).filter(Boolean))]

  function fecharTodos() {
    setCidadeOpen(false); setBairroOpen(false); setCategoriaOpen(false)
    setValorOpen(false); setAreaOpen(false)
  }

  const imoveisFiltrados = imoveis.filter((im) => {
    const modalidadeLabel = im.modalidade === 'aluguel' ? 'Aluguel' : 'Venda'
    const filtraTipo      = tipoSelecionado === 'Todos' || modalidadeLabel === tipoSelecionado
    const filtraCidade    = !cidadeSelecionada || im.cidade === cidadeSelecionada
    const filtraBairro    = !bairroSelecionado || im.bairro === bairroSelecionado
    const filtroCategoria = !categoriaSelecionada || im.categoria === categoriaSelecionada
    const filtroValor     = !valorMax || Number(im.valor) <= parseInt(valorMax)
    const filtroArea      = !areaMin || Number(im.area) >= parseInt(areaMin)
    return filtraTipo && filtraCidade && filtraBairro && filtroCategoria && filtroValor && filtroArea
  })

  const totalAtivos = [cidadeSelecionada, bairroSelecionado, categoriaSelecionada, valorMax, areaMin].filter(Boolean).length

  if (carregando) {
    return (
      <>
        <Nav />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', fontFamily: 'Jost', color: '#004169' }}>
          <p>Carregando imóveis...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Nav />
      <main className="imoveis-page">

        <div className="imoveis-header">
          <h1 className="imoveis-title">Imóveis Comerciais</h1>
          <p className="imoveis-subtitle">
            Lojas, galpões, escritórios e muito mais, encontre o espaço ideal para impulsionar o seu negócio
          </p>
        </div>

        <div className="imoveis-filtros">

          {/* Tipo: Todos / Venda / Aluguel */}
          <div className="filtro-tipo">
            {tipos.map((t) => (
              <button
                key={t}
                className={`tipo-btn ${tipoSelecionado === t ? 'active' : ''}`}
                onClick={() => setTipoSelecionado(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="filtros-separador" />

          <div className="filtros-grade">

            {/* Cidade */}
            <FiltroDropdown
              icone={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18M3 7l9-4 9 4M4 21V7M20 21V7M9 21v-4h6v4"/>
                  <rect x="9" y="10" width="2" height="3" rx="0.4"/>
                  <rect x="13" y="10" width="2" height="3" rx="0.4"/>
                </svg>
              }
              rotulo="Cidade"
              valor={cidadeSelecionada}
              aberto={cidadeOpen}
              onToggle={() => { setCidadeOpen(v => !v); setBairroOpen(false); setCategoriaOpen(false); setValorOpen(false); setAreaOpen(false) }}
              onLimpar={() => { setCidadeSelecionada(''); setCidadeOpen(false) }}
            >
              {cidades.map(c => (
                <li key={c} onClick={() => { setCidadeSelecionada(c); setCidadeOpen(false) }} className={cidadeSelecionada === c ? 'active' : ''}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18M3 7l9-4 9 4M4 21V7M20 21V7M9 21v-4h6v4"/>
                  </svg>
                  {c}
                  {cidadeSelecionada === c && <svg className="check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </li>
              ))}
            </FiltroDropdown>

            {/* Bairro */}
            <FiltroDropdown
              icone={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
              }
              rotulo="Bairro"
              valor={bairroSelecionado}
              aberto={bairroOpen}
              onToggle={() => { setBairroOpen(v => !v); setCidadeOpen(false); setCategoriaOpen(false); setValorOpen(false); setAreaOpen(false) }}
              onLimpar={() => { setBairroSelecionado(''); setBairroOpen(false) }}
            >
              {bairros.map(b => (
                <li key={b} onClick={() => { setBairroSelecionado(b); setBairroOpen(false) }} className={bairroSelecionado === b ? 'active' : ''}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2"/>
                  </svg>
                  {b}
                  {bairroSelecionado === b && <svg className="check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </li>
              ))}
            </FiltroDropdown>

            {/* Categoria */}
            <FiltroDropdown
              icone={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
              }
              rotulo="Tipo"
              valor={categoriaSelecionada}
              aberto={categoriaOpen}
              onToggle={() => { setCategoriaOpen(v => !v); setCidadeOpen(false); setBairroOpen(false); setValorOpen(false); setAreaOpen(false) }}
              onLimpar={() => { setCategoriaSelecionada(''); setCategoriaOpen(false) }}
            >
              {categorias.map(cat => (
                <li key={cat} onClick={() => { setCategoriaSelecionada(cat); setCategoriaOpen(false) }} className={categoriaSelecionada === cat ? 'active' : ''}>
                  <IconeCategoria categoria={cat} />
                  {cat}
                  {categoriaSelecionada === cat && <svg className="check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </li>
              ))}
            </FiltroDropdown>

            {/* Valor máx. */}
            <FiltroDropdown
              icone={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              }
              rotulo="Valor máx."
              valor={valorMax ? { 500000: 'até R$ 500k', 1000000: 'até R$ 1mi', 2000000: 'até R$ 2mi', 5000000: 'até R$ 5mi', 10000000: 'até R$ 10mi' }[valorMax] : ''}
              aberto={valorOpen}
              onToggle={() => { setValorOpen(v => !v); setCidadeOpen(false); setBairroOpen(false); setCategoriaOpen(false); setAreaOpen(false) }}
              onLimpar={() => { setValorMax(''); setValorOpen(false) }}
            >
              {[
                ['500000',   'até R$ 500 mil'],
                ['1000000',  'até R$ 1 milhão'],
                ['2000000',  'até R$ 2 milhões'],
                ['5000000',  'até R$ 5 milhões'],
                ['10000000', 'até R$ 10 milhões'],
              ].map(([val, label]) => (
                <li key={val} onClick={() => { setValorMax(val); setValorOpen(false) }} className={valorMax === val ? 'active' : ''}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  {label}
                  {valorMax === val && <svg className="check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </li>
              ))}
            </FiltroDropdown>

            {/* Área mín. */}
            <FiltroDropdown
              icone={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/>
                </svg>
              }
              rotulo="Área mín."
              valor={areaMin ? `${areaMin}+ m²` : ''}
              aberto={areaOpen}
              onToggle={() => { setAreaOpen(v => !v); setCidadeOpen(false); setBairroOpen(false); setCategoriaOpen(false); setValorOpen(false) }}
              onLimpar={() => { setAreaMin(''); setAreaOpen(false) }}
            >
              {[
                ['50',   '50+ m²'],
                ['100',  '100+ m²'],
                ['300',  '300+ m²'],
                ['500',  '500+ m²'],
                ['1000', '1.000+ m²'],
              ].map(([val, label]) => (
                <li key={val} onClick={() => { setAreaMin(val); setAreaOpen(false) }} className={areaMin === val ? 'active' : ''}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/>
                  </svg>
                  {label}
                  {areaMin === val && <svg className="check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </li>
              ))}
            </FiltroDropdown>

          </div>

          {/* Limpar filtros */}
          {(cidadeSelecionada || bairroSelecionado || categoriaSelecionada || valorMax || areaMin) && (
            <button
              className="filtros-limpar"
              onClick={() => {
                setCidadeSelecionada(''); setBairroSelecionado('')
                setCategoriaSelecionada(''); setValorMax(''); setAreaMin('')
                fecharTodos()
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Limpar filtros
              {totalAtivos > 0 && <span className="filtros-limpar__badge">{totalAtivos}</span>}
            </button>
          )}

        </div>

        <div className="imoveis-grid">
          {imoveisFiltrados.length > 0
            ? imoveisFiltrados.map((im) => (
                <ComercialCard key={im.id} imovel={im} onAbrir={setImovelAberto} />
              ))
            : <p className="sem-resultados">Nenhum imóvel encontrado para os filtros selecionados.</p>
          }
        </div>

      </main>

      {imovelAberto && (
        <ComercialModal imovel={imovelAberto} onClose={() => setImovelAberto(null)} />
      )}
    </>
  )
}

export default Comercial