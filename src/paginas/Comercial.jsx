import { useState, useEffect, useCallback } from 'react'
import Nav from '../componentes/Nav'
import Footer from '../componentes/Footer'
import './Comercial.css'

const cidades = ['Curitiba', 'Pinhais', 'São José dos Pinhais', 'Colombo', 'Araucária']
const bairros = ['Centro', 'CIC', 'Rebouças', 'Portão', 'Cajuru', 'Boqueirão']
const tipos = ['Todos', 'Venda', 'Alugar']
const categorias = ['Loja', 'Barracão', 'Escritório', 'Prédio Comercial', 'Galpão']

const imoveis = [
  {
    id: 1,
    tipo: 'Alugar',
    categoria: 'Loja',
    titulo: 'Loja Comercial em Esquina',
    endereco: 'Av. Sete de Setembro, 4.210',
    bairro: 'Rebouças',
    cidade: 'Curitiba',
    estado: 'PR',
    preco: 'R$ 6.800/mês',
    area: 120,
    vagas: 2,
    banheiros: 2,
    andar: 'Térreo',
    iptu: 'R$ 480 / mês',
    condominio: 'R$ 950 / mês',
    descricao: 'Loja em posição de esquina com grande vitrine dupla, pé-direito alto e elétrica trifásica. Fluxo intenso de pedestres e veículos, ideal para varejo ou serviços.',
    diferenciais: ['Vitrine dupla', 'Elétrica trifásica', 'Ar-condicionado', 'Depósito', 'Fachada iluminada', 'Estacionamento próximo'],
    fotos: [null, null, null, null],
  },
  {
    id: 2,
    tipo: 'Alugar',
    categoria: 'Galpão',
    titulo: 'Galpão Industrial com Pátio',
    endereco: 'Rua Izaac Ferreira da Cruz, 890',
    bairro: 'CIC',
    cidade: 'Curitiba',
    estado: 'PR',
    preco: 'R$ 18.500/mês',
    area: 1800,
    vagas: 10,
    banheiros: 4,
    andar: 'Térreo',
    iptu: 'R$ 1.200 / mês',
    condominio: '—',
    descricao: 'Galpão industrial com pé-direito de 10m, piso de alta resistência, docas de carga e pátio de manobra pavimentado. Acesso facilitado para carretas.',
    diferenciais: ['Pé-direito 10m', 'Docas de carga', 'Pátio pavimentado', 'Elétrica trifásica', 'Sprinklers', 'Portaria 24h'],
    fotos: [null, null, null, null],
  },
  {
    id: 3,
    tipo: 'Venda',
    categoria: 'Prédio Comercial',
    titulo: 'Prédio Comercial — 6 Andares',
    endereco: 'Rua XV de Novembro, 1.050',
    bairro: 'Centro',
    cidade: 'Curitiba',
    estado: 'PR',
    preco: 'R$ 4.800.000',
    area: 2400,
    vagas: 20,
    banheiros: 12,
    andar: '6 pavimentos',
    iptu: 'R$ 3.800 / mês',
    condominio: 'R$ 4.200 / mês',
    descricao: 'Prédio comercial completo no coração do Centro, com elevador panorâmico, gerador próprio e salas moduláveis. Localização estratégica para escritórios, clínicas ou centros de serviço.',
    diferenciais: ['Elevador panorâmico', 'Gerador próprio', 'Salas moduláveis', 'Recepção 24h', 'Fibra óptica', 'Estacionamento'],
    fotos: [null, null, null, null],
  },
  {
    id: 4,
    tipo: 'Alugar',
    categoria: 'Escritório',
    titulo: 'Escritório Corporativo — Andar Inteiro',
    endereco: 'Av. Cândido de Abreu, 776',
    bairro: 'Centro Cívico',
    cidade: 'Curitiba',
    estado: 'PR',
    preco: 'R$ 12.000/mês',
    area: 380,
    vagas: 6,
    banheiros: 3,
    andar: '9º andar',
    iptu: 'R$ 920 / mês',
    condominio: 'R$ 2.100 / mês',
    descricao: 'Andar corporativo completo com vista panorâmica, piso elevado, forro modular e climatização central. Infraestrutura pronta para operação imediata.',
    diferenciais: ['Vista panorâmica', 'Piso elevado', 'Climatização central', 'Sala de reuniões', 'Copa completa', 'Fibra redundante'],
    fotos: [null, null, null, null],
  },
  {
    id: 5,
    tipo: 'Venda',
    categoria: 'Barracão',
    titulo: 'Barracão com Área Administrativa',
    endereco: 'Rua Dep. Heitor Alencar Furtado, 3.400',
    bairro: 'Portão',
    cidade: 'Curitiba',
    estado: 'PR',
    preco: 'R$ 2.200.000',
    area: 950,
    vagas: 8,
    banheiros: 4,
    andar: 'Térreo',
    iptu: 'R$ 980 / mês',
    condominio: '—',
    descricao: 'Barracão com área produtiva ampla e bloco administrativo separado. Elétrica trifásica, câmera de segurança, portão automático para caminhões e mezanino com escritório.',
    diferenciais: ['Mezanino / escritório', 'Portão para caminhões', 'Câmeras de segurança', 'Elétrica trifásica', 'Refeitório', 'Vestiários'],
    fotos: [null, null, null, null],
  },
  {
    id: 6,
    tipo: 'Alugar',
    categoria: 'Loja',
    titulo: 'Loja em Shopping Corporativo',
    endereco: 'Av. Affonso Camargo, 330',
    bairro: 'Cajuru',
    cidade: 'Curitiba',
    estado: 'PR',
    preco: 'R$ 4.200/mês',
    area: 65,
    vagas: 1,
    banheiros: 1,
    andar: 'Piso térreo',
    iptu: 'R$ 260 / mês',
    condominio: 'R$ 1.400 / mês',
    descricao: 'Loja compacta em shopping corporativo de alto fluxo, com infraestrutura completa, climatização e segurança 24h. Ideal para serviços, alimentação ou varejo especializado.',
    diferenciais: ['Segurança 24h', 'Climatização central', 'Alto fluxo', 'Estacionamento gratuito', 'Wi-Fi coletivo'],
    fotos: [null, null, null, null],
  },
]

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
  const [fotoAtual, setFotoAtual] = useState(0)
  const totalFotos = imovel.fotos?.length || 4

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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>

        <div className="modal-carousel">
          <div className="carousel-top-fade" />
          <div
            className="carousel-img"
            style={{
              background: `linear-gradient(135deg,
                hsl(${195 + fotoAtual * 20}, 55%, 22%) 0%,
                hsl(${205 + fotoAtual * 15}, 65%, 32%) 50%,
                hsl(${215 + fotoAtual * 10}, 45%, 18%) 100%)`
            }}
          />
          <div className="carousel-counter">
            {fotoAtual + 1} / {totalFotos}
            <span className="carousel-tipo">{imovel.tipo.toUpperCase()}</span>
          </div>
          <span className="carousel-categoria">{imovel.categoria.toUpperCase()}</span>

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
            {Array.from({ length: totalFotos }).map((_, i) => (
              <button key={i} className={`carousel-dot ${i === fotoAtual ? 'active' : ''}`} onClick={() => setFotoAtual(i)} />
            ))}
          </div>

          <button className="modal-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Conteúdo */}
        <div className="modal-body">
          <div className="modal-header-row">
            <p className="modal-endereco">© {imovel.endereco} — {imovel.bairro}, {imovel.cidade}</p>
            <p className="modal-preco">{imovel.preco}</p>
          </div>
          <h2 className="modal-titulo">{imovel.titulo}</h2>
          <p className="modal-descricao">{imovel.descricao}</p>

          <div className="modal-specs">
            <div className="modal-spec-item">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/>
              </svg>
              <span className="spec-valor">{imovel.area} m²</span>
              <span className="spec-label">ÁREA</span>
            </div>
            <div className="modal-spec-item">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3l-4 4-4-4"/>
              </svg>
              <span className="spec-valor">{imovel.vagas}</span>
              <span className="spec-label">VAGAS</span>
            </div>
            <div className="modal-spec-item">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12h16M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6M4 12v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>
              </svg>
              <span className="spec-valor">{imovel.banheiros}</span>
              <span className="spec-label">BANHEIROS</span>
            </div>
            <div className="modal-spec-item">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              </svg>
              <span className="spec-valor">{imovel.andar}</span>
              <span className="spec-label">POSIÇÃO</span>
            </div>
          </div>

          <div className="modal-info-list">
            <div className="modal-info-row">
              <span className="info-key">IPTU</span>
              <span className="info-val">{imovel.iptu}</span>
            </div>
            <div className="modal-info-row">
              <span className="info-key">CONDOMÍNIO</span>
              <span className="info-val">{imovel.condominio}</span>
            </div>
          </div>

          <div className="modal-diferenciais">
            <p className="diferenciais-titulo">DIFERENCIAIS</p>
            <div className="diferenciais-grid">
              {imovel.diferenciais.map((d) => (
                <div key={d} className="diferencial-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn-contato">ENTRAR EM CONTATO</button>
          <button className="modal-btn-voltar" onClick={onClose}>VOLTAR</button>
        </div>
      </div>
    </div>
  )
}

/* ── Card ── */
function ComercialCard({ imovel, onAbrir }) {
  return (
    <div className="imovel-card" onClick={() => onAbrir(imovel)}>
      <div className="card-img">
        <div className="card-img-placeholder comercial" />
        <span className={`card-badge ${imovel.tipo === 'Venda' ? 'badge-venda' : 'badge-alugar'}`}>
          {imovel.tipo.toUpperCase()}
        </span>
        <span className="card-categoria">{imovel.categoria.toUpperCase()}</span>
      </div>

      <div className="card-body">
        <p className="card-localizacao">{imovel.bairro} · {imovel.cidade} – {imovel.estado}</p>
        <h3 className="card-titulo">{imovel.titulo}</h3>
        <p className="card-preco">{imovel.preco}</p>

        <div className="card-specs">
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/>
            </svg>
            {imovel.area} m²
          </span>
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3l-4 4-4-4"/>
            </svg>
            {imovel.vagas} vagas
          </span>
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12h16M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6M4 12v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>
            </svg>
            {imovel.banheiros} ban.
          </span>
          <span>
            <IconeCategoria categoria={imovel.categoria} />
            {imovel.categoria}
          </span>
        </div>

        <button className="card-btn">VER DETALHES</button>
      </div>
    </div>
  )
}

/* ── Componente de filtro dropdown reutilizável ── */
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

  function fecharTodos() {
    setCidadeOpen(false); setBairroOpen(false); setCategoriaOpen(false)
    setValorOpen(false); setAreaOpen(false)
  }

  function parsePreco(str) {
    return parseInt(str.replace(/[^0-9]/g, '')) || 0
  }

  const imoveisFiltrados = imoveis.filter((im) => {
    const filtraTipo      = tipoSelecionado === 'Todos' || im.tipo === tipoSelecionado
    const filtraCidade    = !cidadeSelecionada || im.cidade === cidadeSelecionada
    const filtraBairro    = !bairroSelecionado || im.bairro === bairroSelecionado
    const filtroCategoria = !categoriaSelecionada || im.categoria === categoriaSelecionada
    const filtroValor     = !valorMax || parsePreco(im.preco) <= parseInt(valorMax)
    const filtroArea      = !areaMin || im.area >= parseInt(areaMin)
    return filtraTipo && filtraCidade && filtraBairro && filtroCategoria && filtroValor && filtroArea
  })

  const totalAtivos = [cidadeSelecionada, bairroSelecionado, categoriaSelecionada, valorMax, areaMin].filter(Boolean).length

  return (
    <>
      <Nav />
      <main className="imoveis-page">

        <div className="imoveis-header">
          <h1 className="imoveis-title">Imóveis Comerciais</h1>
          <p className="imoveis-subtitle">
            Lojas, galpões, escritórios e muito mais — encontre o espaço ideal para o seu negócio
          </p>
        </div>

        <div className="imoveis-filtros">

          {/* ── Tipo: Todos / Venda / Alugar ── */}
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

          {/* ── Separador ── */}
          <div className="filtros-separador" />

          {/* ── Grade de filtros ── */}
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