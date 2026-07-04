import { useState, useEffect, useCallback, useRef } from 'react'
import Nav from '../componentes/Nav'
import Footer from '../componentes/Footer'
import { api } from '../apiClient'
import './Imoveis.css'

const tipos = ['Todos', 'Venda', 'Aluguel']

function formatarValor(valor, modalidade) {
  if (valor === undefined || valor === null || valor === '') return '—'
  const num = Number(valor) || 0
  const fmt = num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })
  return modalidade === 'aluguel' ? `${fmt}/mês` : fmt
}

/* ── Modal ── */
/* ── Lightbox com zoom ── */
function Lightbox({ imagens, indiceInicial, onClose }) {
  const total = imagens.length
  const [indice, setIndice] = useState(indiceInicial)
  const [zoom, setZoom] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [arrastando, setArrastando] = useState(false)
  const [origem, setOrigem] = useState({ x: 0, y: 0 })
  const thumbRef = useRef(null)

  const irPara = useCallback((i) => { setIndice(i); setZoom(1); setPos({ x: 0, y: 0 }) }, [])
  const prev = useCallback(() => irPara((indice - 1 + total) % total), [indice, total, irPara])
  const next = useCallback(() => irPara((indice + 1) % total), [indice, total, irPara])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === '+' || e.key === '=') setZoom(z => Math.min(z + 0.5, 4))
      if (e.key === '-') setZoom(z => { const nz = Math.max(z - 0.5, 1); if (nz === 1) setPos({ x: 0, y: 0 }); return nz })
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, prev, next])

  useEffect(() => {
    const el = thumbRef.current?.children[indice]
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [indice])

  const handleDoubleClick = () => {
    if (zoom > 1) { setZoom(1); setPos({ x: 0, y: 0 }) }
    else setZoom(2.5)
  }
  const handleMouseDown = (e) => { if (zoom <= 1) return; setArrastando(true); setOrigem({ x: e.clientX - pos.x, y: e.clientY - pos.y }) }
  const handleMouseMove = (e) => { if (!arrastando) return; setPos({ x: e.clientX - origem.x, y: e.clientY - origem.y }) }
  const handleMouseUp = () => setArrastando(false)
  const handleWheel = (e) => { e.preventDefault(); setZoom(z => { const nz = Math.min(Math.max(z - e.deltaY * 0.005, 1), 4); if (nz === 1) setPos({ x: 0, y: 0 }); return nz }) }

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
        <div
          className="lightbox-stage"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onDoubleClick={handleDoubleClick}
          style={{ cursor: zoom > 1 ? (arrastando ? 'grabbing' : 'grab') : 'zoom-in' }}
        >
          <img
            src={imagens[indice]?.url}
            alt=""
            className="lightbox-img"
            style={{ transform: `scale(${zoom}) translate(${pos.x / zoom}px, ${pos.y / zoom}px)`, transition: arrastando ? 'none' : 'transform 0.2s ease' }}
            draggable={false}
          />
        </div>

        <div className="lightbox-controls">
          <button className="lightbox-ctrl" onClick={() => setZoom(z => Math.max(z - 0.5, 1))} title="Diminuir zoom">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>
          <span className="lightbox-zoom-label">{Math.round(zoom * 100)}%</span>
          <button className="lightbox-ctrl" onClick={() => setZoom(z => Math.min(z + 0.5, 4))} title="Aumentar zoom">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          </button>
          <span className="lightbox-sep"/>
          <span className="lightbox-counter">{indice + 1} / {total}</span>
          <button className="lightbox-ctrl lightbox-close-btn" onClick={onClose} title="Fechar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {total > 1 && (
          <>
            <button className="lightbox-arrow lightbox-arrow-prev" onClick={prev}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button className="lightbox-arrow lightbox-arrow-next" onClick={next}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </>
        )}

        {total > 1 && (
          <div className="lightbox-thumbs" ref={thumbRef}>
            {imagens.map((img, i) => (
              <button key={i} className={`lightbox-thumb ${i === indice ? 'active' : ''}`} onClick={() => irPara(i)}>
                <img src={img.url} alt="" draggable={false} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ImovelModal({ imovel, onClose }) {
  const temImagens = imovel.imagens && imovel.imagens.length > 0
  const totalFotos = temImagens ? imovel.imagens.length : 1
  const [fotoAtual, setFotoAtual] = useState(0)
  const [lightboxAberto, setLightboxAberto] = useState(false)

  const prev = useCallback(() => setFotoAtual(f => (f - 1 + totalFotos) % totalFotos), [totalFotos])
  const next = useCallback(() => setFotoAtual(f => (f + 1) % totalFotos), [totalFotos])

  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxAberto) return
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
  }, [onClose, prev, next, lightboxAberto])

  const tipoLabel = imovel.modalidade === 'aluguel' ? 'ALUGUEL' : 'VENDA'

  return (
    <>
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>

        <div className="modal-carousel">
          <div className="carousel-top-fade" />

          {temImagens ? (
            <img
              src={imovel.imagens[fotoAtual]?.url}
              alt={imovel.titulo}
              className="carousel-img carousel-img--clickable"
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              onClick={() => setLightboxAberto(true)}
              title="Clique para ampliar"
            />
          ) : (
            <div
              className="carousel-img"
              style={{
                background: `linear-gradient(135deg,
                  hsl(${200 + fotoAtual * 20}, 60%, 25%) 0%,
                  hsl(${210 + fotoAtual * 15}, 70%, 35%) 50%,
                  hsl(${220 + fotoAtual * 10}, 50%, 20%) 100%)`
              }}
            />
          )}

          {temImagens && (
            <button className="carousel-zoom-btn" onClick={() => setLightboxAberto(true)} title="Ampliar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            </button>
          )}

          <div className="carousel-counter">
            {fotoAtual + 1} / {totalFotos}
            <span className="carousel-tipo">{tipoLabel}</span>
          </div>
          <span className="carousel-categoria">{imovel.tipo ? imovel.tipo.toUpperCase() : ''}</span>

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
            </>
          )}

          <button className="modal-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          {temImagens && totalFotos > 1 && (
            <div className="carousel-thumbs-strip">
              {imovel.imagens.map((img, i) => (
                <button key={i} className={`carousel-thumb-item ${i === fotoAtual ? 'active' : ''}`} onClick={() => setFotoAtual(i)}>
                  <img src={img.url} alt="" draggable={false} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="modal-content-col">

          {/* Cabeçalho: título + preço */}
          <div className="modal-header-bar">
            <div className="modal-header-bar__left">
              <p className="modal-endereco">{[imovel.bairro, imovel.cidade].filter(Boolean).join(' — ')}</p>
              <h2 className="modal-titulo">{imovel.titulo}</h2>
              {imovel.codigo && (
                <span style={{ display: 'inline-block', fontSize: '11px', color: '#8a9bb0', background: '#eef3f8', borderRadius: 4, padding: '3px 9px', fontWeight: 600, letterSpacing: 0.6, marginTop: 4 }}>
                  Cód: {imovel.codigo}
                </span>
              )}
            </div>
            <div className="modal-header-bar__right">
              <span className="modal-preco-label">VALOR</span>
              <p className="modal-preco">{formatarValor(imovel.valor, imovel.modalidade)}</p>
            </div>
          </div>

          {/* Duas colunas: descrição + specs */}
          <div className="modal-two-col">

            {/* Esquerda: descrição */}
            <div className="modal-col-desc">
              <p className="modal-col-label">DESCRIÇÃO</p>
              {imovel.descricao
                ? <p className="modal-descricao-full">{imovel.descricao}</p>
                : <p className="modal-descricao-vazia">Sem descrição disponível.</p>
              }
            </div>

            {/* Direita: specs */}
            <div className="modal-col-specs">
              <p className="modal-col-label">CARACTERÍSTICAS</p>
              <div className="modal-specs-grid">
                {imovel.quartos && (
                  <div className="modal-spec-item">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    <span className="spec-valor">{imovel.quartos}</span>
                    <span className="spec-label">QUARTOS</span>
                  </div>
                )}
                {imovel.banheiros && (
                  <div className="modal-spec-item">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12h16M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6M4 12v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>
                    </svg>
                    <span className="spec-valor">{imovel.banheiros}</span>
                    <span className="spec-label">BANHEIROS</span>
                  </div>
                )}
                {imovel.vagas && (
                  <div className="modal-spec-item">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3l-4 4-4-4"/>
                    </svg>
                    <span className="spec-valor">{imovel.vagas}</span>
                    <span className="spec-label">VAGAS</span>
                  </div>
                )}
                {imovel.area && (
                  <div className="modal-spec-item">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/>
                    </svg>
                    <span className="spec-valor">{imovel.area} m²</span>
                    <span className="spec-label">ÁREA</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="modal-footer">
            <a
              className="modal-btn-contato"
              href={`https://wa.me/5541984000887?text=${encodeURIComponent(
                `Olá! Tenho interesse no imóvel "${imovel.titulo}"` +
                (imovel.codigo ? ` (Cód: ${imovel.codigo})` : '') +
                ` — ${formatarValor(imovel.valor, imovel.modalidade)}.\n` +
                `${window.location.origin}${window.location.pathname}?id=${imovel.id}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              ENTRAR EM CONTATO
            </a>
            <button
              className="modal-btn-compartilhar"
              title="Copiar link do imóvel"
              onClick={() => {
                const url = `${window.location.origin}${window.location.pathname}?id=${imovel.id}`
                navigator.clipboard.writeText(url).then(() => {
                  const btn = document.activeElement
                  const orig = btn.innerHTML
                  btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> COPIADO!'
                  btn.style.background = '#dcfce7'
                  btn.style.color = '#15803d'
                  btn.style.borderColor = '#16a34a'
                  setTimeout(() => { btn.innerHTML = orig; btn.style = '' }, 2000)
                })
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              COMPARTILHAR
            </button>
            <button className="modal-btn-voltar" onClick={onClose}>VOLTAR</button>
          </div>
        </div>
      </div>
    </div>

    {lightboxAberto && temImagens && (
      <Lightbox imagens={imovel.imagens} indiceInicial={fotoAtual} onClose={() => setLightboxAberto(false)} />
    )}
    </>
  )
}

/* ── Card ── */
function ImovelCard({ imovel, onAbrir }) {
  const temImagem = imovel.imagens && imovel.imagens.length > 0
  const tipoLabel = imovel.modalidade === 'aluguel' ? 'ALUGUEL' : 'VENDA'
  const badgeClass = imovel.modalidade === 'aluguel' ? 'badge-alugar' : 'badge-venda'

  return (
    <div className="imovel-card" onClick={() => onAbrir(imovel)}>
      <div className="card-img">
        {temImagem ? (
          <img src={imovel.imagens[0].url} alt={imovel.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="card-img-placeholder" />
        )}
        {imovel.status && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3,
            background: imovel.status === 'reservado' ? 'rgba(180,83,9,0.92)' : imovel.status === 'locado' ? 'rgba(21,128,61,0.92)' : 'rgba(30,64,175,0.92)',
            color: '#fff', textAlign: 'center', fontFamily: "'Jost', sans-serif",
            fontWeight: 700, fontSize: 10, letterSpacing: 2.5, padding: '5px 0', textTransform: 'uppercase'
          }}>{imovel.status}</div>
        )}
        <span className={`card-badge ${badgeClass}`}>{tipoLabel}</span>
        <span className="card-categoria">{imovel.tipo ? imovel.tipo.toUpperCase() : ''}</span>
      </div>

      <div className="card-body">
        <p className="card-localizacao">
          {[imovel.bairro, imovel.cidade].filter(Boolean).join(' · ')}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
          <h3 className="card-titulo">{imovel.titulo}</h3>
          {imovel.codigo && (
            <span style={{ fontSize: '10px', color: '#8a9bb0', background: '#eef3f8', borderRadius: 4, padding: '2px 7px', fontWeight: 600, letterSpacing: 0.5, whiteSpace: 'nowrap', flexShrink: 0 }}>
              {imovel.codigo}
            </span>
          )}
        </div>
        <p className="card-preco">{formatarValor(imovel.valor, imovel.modalidade)}</p>

        <div className="card-specs">
          {imovel.quartos && (
            <span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              {imovel.quartos} quartos
            </span>
          )}
          {imovel.banheiros && (
            <span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12h16M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6M4 12v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>
              </svg>
              {imovel.banheiros} banheiros
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
          {imovel.area && (
            <span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/>
              </svg>
              {imovel.area} m²
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

/* ── Paginação ── */
function Paginacao({ paginaAtual, totalPaginas, onMudarPagina }) {
  if (totalPaginas <= 1) return null

  // Monta a lista de números a exibir, com "..." quando há muitas páginas
  const paginas = []
  const janela = 1 // quantas páginas mostrar de cada lado da atual

  for (let i = 1; i <= totalPaginas; i++) {
    if (
      i === 1 ||
      i === totalPaginas ||
      (i >= paginaAtual - janela && i <= paginaAtual + janela)
    ) {
      paginas.push(i)
    } else if (paginas[paginas.length - 1] !== '...') {
      paginas.push('...')
    }
  }

  return (
    <nav className="paginacao" aria-label="Paginação de imóveis">
      <button
        className="paginacao-btn paginacao-seta"
        onClick={() => onMudarPagina(paginaAtual - 1)}
        disabled={paginaAtual === 1}
        aria-label="Página anterior"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>

      {paginas.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="paginacao-dots">…</span>
        ) : (
          <button
            key={p}
            className={`paginacao-btn ${p === paginaAtual ? 'paginacao-btn--ativo' : ''}`}
            onClick={() => onMudarPagina(p)}
            aria-current={p === paginaAtual ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        className="paginacao-btn paginacao-seta"
        onClick={() => onMudarPagina(paginaAtual + 1)}
        disabled={paginaAtual === totalPaginas}
        aria-label="Próxima página"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    </nav>
  )
}

const ITENS_POR_PAGINA = 6

/* ── Página principal ── */
function Imoveis() {
  const [imoveis, setImoveis]               = useState([])
  const [carregando, setCarregando]         = useState(true)
  const [cidadeOpen, setCidadeOpen]         = useState(false)
  const [bairroOpen, setBairroOpen]         = useState(false)
  const [quartosOpen, setQuartosOpen]       = useState(false)
  const [valorOpen, setValorOpen]           = useState(false)
  const [areaOpen, setAreaOpen]             = useState(false)
  const [cidadeSelecionada, setCidadeSelecionada] = useState('')
  const [bairroSelecionado, setBairroSelecionado] = useState('')
  const [tipoSelecionado, setTipoSelecionado]     = useState('Todos')
  const [imovelAberto, setImovelAberto]           = useState(null)
  const [quartosMin, setQuartosMin]               = useState('')
  const [valorMax, setValorMax]                   = useState('')
  const [areaMin, setAreMin]                      = useState('')
  const [paginaAtual, setPaginaAtual]             = useState(1)

  // Abre modal automaticamente se URL tiver ?id=
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const idParam = params.get('id')
    if (idParam && imoveis.length > 0) {
      const found = imoveis.find(im => im.id === idParam)
      if (found) setImovelAberto(found)
    }
  }, [imoveis])

  // Busca da nossa API PHP — apenas não-comerciais e ativos
  useEffect(() => {
    async function buscar() {
      try {
        const data = await api.listarImoveis({ tipo_diferente: 'comercial', ativo: 'true' })
        setImoveis(data || [])
      } catch (error) {
        console.error('Erro ao buscar imóveis:', error.message)
      }
      setCarregando(false)
    }
    buscar()
  }, [])

  // Listas dinâmicas de cidades/bairros baseadas nos dados reais
  const cidades = [...new Set(imoveis.map(i => i.cidade).filter(Boolean))]
  const bairros = [...new Set(imoveis.map(i => i.bairro).filter(Boolean))]

  const imoveisFiltrados = imoveis.filter((im) => {
    const modalidadeLabel = im.modalidade === 'aluguel' ? 'Aluguel' : 'Venda'
    const filtraTipo   = tipoSelecionado === 'Todos' || modalidadeLabel === tipoSelecionado
    const filtraCidade = !cidadeSelecionada || im.cidade === cidadeSelecionada
    const filtraBairro = !bairroSelecionado || im.bairro === bairroSelecionado
    const filtroQuartos = !quartosMin || Number(im.quartos) >= parseInt(quartosMin)
    const filtroValor   = !valorMax || Number(im.valor) <= parseInt(valorMax)
    const filtroArea    = !areaMin || Number(im.area) >= parseInt(areaMin)
    return filtraTipo && filtraCidade && filtraBairro && filtroQuartos && filtroValor && filtroArea
  })

  const totalAtivos = [cidadeSelecionada, bairroSelecionado, quartosMin, valorMax, areaMin].filter(Boolean).length

  // Sempre que os filtros mudarem, volta pra primeira página
  useEffect(() => {
    setPaginaAtual(1)
  }, [tipoSelecionado, cidadeSelecionada, bairroSelecionado, quartosMin, valorMax, areaMin])

  const totalPaginas = Math.max(1, Math.ceil(imoveisFiltrados.length / ITENS_POR_PAGINA))
  const imoveisPaginados = imoveisFiltrados.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA
  )

  function irParaPagina(p) {
    if (p < 1 || p > totalPaginas) return
    setPaginaAtual(p)
    document.querySelector('.imoveis-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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
      <main className="imoveis-page" translate="no">

        <div className="imoveis-header">
          <h1 className="imoveis-title">Imóveis Disponíveis</h1>
          <p className="imoveis-subtitle">
            Encontre o imóvel ideal para você com a qualidade e confiança da JMarinho
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
              onToggle={() => { setCidadeOpen(v => !v); setBairroOpen(false); setQuartosOpen(false); setValorOpen(false); setAreaOpen(false) }}
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
              onToggle={() => { setBairroOpen(v => !v); setCidadeOpen(false); setQuartosOpen(false); setValorOpen(false); setAreaOpen(false) }}
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

            {/* Quartos */}
            <FiltroDropdown
              icone={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9v6m0-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 15v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2M8 9v2M16 9v2"/>
                </svg>
              }
              rotulo="Quartos"
              valor={quartosMin ? `${quartosMin}+ quartos` : ''}
              aberto={quartosOpen}
              onToggle={() => { setQuartosOpen(v => !v); setCidadeOpen(false); setBairroOpen(false); setValorOpen(false); setAreaOpen(false) }}
              onLimpar={() => { setQuartosMin(''); setQuartosOpen(false) }}
            >
              {[['1','1+ quarto'],['2','2+ quartos'],['3','3+ quartos'],['4','4+ quartos']].map(([val, label]) => (
                <li key={val} onClick={() => { setQuartosMin(val); setQuartosOpen(false) }} className={quartosMin === val ? 'active' : ''}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9v6m0-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 15v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2M8 9v2M16 9v2"/>
                  </svg>
                  {label}
                  {quartosMin === val && <svg className="check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </li>
              ))}
            </FiltroDropdown>

            {/* Valor */}
            <FiltroDropdown
              icone={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              }
              rotulo="Valor máx."
              valor={valorMax ? {300000:'até R$ 300k',500000:'até R$ 500k',800000:'até R$ 800k',1200000:'até R$ 1,2mi',2000000:'até R$ 2mi'}[valorMax] : ''}
              aberto={valorOpen}
              onToggle={() => { setValorOpen(v => !v); setCidadeOpen(false); setBairroOpen(false); setQuartosOpen(false); setAreaOpen(false) }}
              onLimpar={() => { setValorMax(''); setValorOpen(false) }}
            >
              {[['300000','até R$ 300 mil'],['500000','até R$ 500 mil'],['800000','até R$ 800 mil'],['1200000','até R$ 1,2 milhão'],['2000000','até R$ 2 milhões']].map(([val, label]) => (
                <li key={val} onClick={() => { setValorMax(val); setValorOpen(false) }} className={valorMax === val ? 'active' : ''}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  {label}
                  {valorMax === val && <svg className="check" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </li>
              ))}
            </FiltroDropdown>

            {/* Área */}
            <FiltroDropdown
              icone={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/>
                </svg>
              }
              rotulo="Área mín."
              valor={areaMin ? `${areaMin}+ m²` : ''}
              aberto={areaOpen}
              onToggle={() => { setAreaOpen(v => !v); setCidadeOpen(false); setBairroOpen(false); setQuartosOpen(false); setValorOpen(false) }}
              onLimpar={() => { setAreMin(''); setAreaOpen(false) }}
            >
              {[['50','50+ m²'],['80','80+ m²'],['120','120+ m²'],['200','200+ m²']].map(([val, label]) => (
                <li key={val} onClick={() => { setAreMin(val); setAreaOpen(false) }} className={areaMin === val ? 'active' : ''}>
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
          {(cidadeSelecionada || bairroSelecionado || quartosMin || valorMax || areaMin) && (
            <button
              className="filtros-limpar"
              onClick={() => {
                setCidadeSelecionada(''); setBairroSelecionado('')
                setQuartosMin(''); setValorMax(''); setAreMin('')
                setCidadeOpen(false); setBairroOpen(false)
                setQuartosOpen(false); setValorOpen(false); setAreaOpen(false)
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              Limpar filtros
              {totalAtivos > 0 && <span className="filtros-limpar__badge">{totalAtivos}</span>}
            </button>
          )}

        </div>

        <div className="imoveis-grid">
          {imoveisPaginados.length > 0
            ? imoveisPaginados.map((im) => (
                <ImovelCard key={im.id} imovel={im} onAbrir={setImovelAberto} />
              ))
            : <p className="sem-resultados">Nenhum imóvel encontrado para os filtros selecionados.</p>
          }
        </div>

        <Paginacao
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          onMudarPagina={irParaPagina}
        />

      </main>

      {imovelAberto && (
        <ImovelModal imovel={imovelAberto} onClose={() => setImovelAberto(null)} />
      )}
    </>
  )
}

export default Imoveis