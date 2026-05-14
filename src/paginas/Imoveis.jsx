import { useState, useEffect, useCallback } from 'react'
import Nav from '../componentes/Nav'
import Footer from '../componentes/Footer'
import './Imoveis.css'

const cidades = ['Curitiba', 'Pinhais', 'Uberaba', 'Santa Cândida', 'Colombo']
const bairros = ['Santa Felicidade', 'Água Verde', 'Mercês', 'CIC', 'Centro']
const tipos = ['Todos', 'Venda', 'Alugar']

const imoveis = [
  {
    id: 1,
    tipo: 'Venda',
    categoria: 'Apartamento',
    titulo: 'Apartamento Alto Padrão',
    endereco: 'Rua Comendador Araújo, 512',
    bairro: 'Batel',
    cidade: 'Curitiba',
    estado: 'PR',
    preco: 'R$ 980.000',
    quartos: 3,
    banheiros: 2,
    vagas: 2,
    area: 142,
    andar: '14º andar',
    iptu: 'R$ 520 / mês',
    condominio: 'R$ 1.100 / mês',
    descricao: 'Apartamento de alto padrão localizado no coração do Batel, com acabamentos premium, varanda gourmet e vista privilegiada para a cidade. Projeto moderno com iluminação planejada e amplos espaços integrados.',
    diferenciais: ['Varanda gourmet', 'Piscina', 'Portaria 24h', 'Academia', 'Salão de festas', 'Gerador'],
    fotos: [null, null, null, null],
    imagem: null,
  },
  {
    id: 2,
    tipo: 'Alugar',
    categoria: 'Casa',
    titulo: 'Casa em Condomínio Fechado',
    endereco: 'Rua das Araucárias, 88',
    bairro: 'Santa Felicidade',
    cidade: 'Curitiba',
    estado: 'PR',
    preco: 'R$ 4.500/mês',
    quartos: 4,
    banheiros: 3,
    vagas: 2,
    area: 210,
    andar: 'Térrea',
    iptu: 'R$ 380 / mês',
    condominio: 'R$ 850 / mês',
    descricao: 'Casa espaçosa em condomínio fechado com segurança 24h, amplo jardim e área de lazer completa. Acabamentos de qualidade e localização privilegiada próxima a escolas e comércio.',
    diferenciais: ['Jardim privativo', 'Churrasqueira', 'Segurança 24h', 'Playground', 'Quadra esportiva', 'Portão automático'],
    fotos: [null, null, null, null],
    imagem: null,
  },
  {
    id: 3,
    tipo: 'Venda',
    categoria: 'Apartamento',
    titulo: 'Apartamento Moderno',
    endereco: 'Av. Água Verde, 1.240',
    bairro: 'Água Verde',
    cidade: 'Curitiba',
    estado: 'PR',
    preco: 'R$ 650.000',
    quartos: 2,
    banheiros: 2,
    vagas: 1,
    area: 88,
    andar: '7º andar',
    iptu: 'R$ 310 / mês',
    condominio: 'R$ 780 / mês',
    descricao: 'Apartamento moderno com planta inteligente, cozinha americana integrada e sacada com vista para a cidade. Localização excelente, próximo ao metrô e principais vias.',
    diferenciais: ['Sacada integrada', 'Cozinha americana', 'Fitness', 'Salão de festas', 'Portaria 24h'],
    fotos: [null, null, null, null],
    imagem: null,
  },
  {
    id: 4,
    tipo: 'Alugar',
    categoria: 'Casa',
    titulo: 'Casa Térrea com Quintal',
    endereco: 'Rua Professora Maria José, 45',
    bairro: 'Mercês',
    cidade: 'Curitiba',
    estado: 'PR',
    preco: 'R$ 3.200/mês',
    quartos: 3,
    banheiros: 2,
    vagas: 1,
    area: 175,
    andar: 'Térrea',
    iptu: 'R$ 290 / mês',
    condominio: '—',
    descricao: 'Casa térrea charmosa com quintal arborizado, área de serviço ampla e garagem coberta. Bairro tranquilo, residencial, com fácil acesso ao centro e excelente infraestrutura.',
    diferenciais: ['Quintal arborizado', 'Churrasqueira', 'Garagem coberta', 'Área de serviço', 'Próx. ao centro'],
    fotos: [null, null, null, null],
    imagem: null,
  },
]

/* ── Modal ── */
function ImovelModal({ imovel, onClose }) {
  const [fotoAtual, setFotoAtual] = useState(0)
  const totalFotos = imovel.fotos?.length || 4

  const prev = useCallback(() => setFotoAtual(f => (f - 1 + totalFotos) % totalFotos), [totalFotos])
  const next = useCallback(() => setFotoAtual(f => (f + 1) % totalFotos), [totalFotos])

  // Fechar com ESC e bloquear scroll
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

        {/* ── Carrossel ── */}
        <div className="modal-carousel">
          {/* Gradiente escuro no topo para o X */}
          <div className="carousel-top-fade" />

          {/* Placeholder de foto */}
          <div
            className="carousel-img"
            style={{
              background: `linear-gradient(135deg,
                hsl(${200 + fotoAtual * 20}, 60%, 25%) 0%,
                hsl(${210 + fotoAtual * 15}, 70%, 35%) 50%,
                hsl(${220 + fotoAtual * 10}, 50%, 20%) 100%)`
            }}
          />

          {/* Contador */}
          <div className="carousel-counter">
            {fotoAtual + 1} / {totalFotos}
            <span className="carousel-tipo">{imovel.tipo.toUpperCase()}</span>
          </div>

          {/* Categoria */}
          <span className="carousel-categoria">{imovel.categoria.toUpperCase()}</span>

          {/* Setas */}
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

          {/* Dots */}
          <div className="carousel-dots">
            {Array.from({ length: totalFotos }).map((_, i) => (
              <button
                key={i}
                className={`carousel-dot ${i === fotoAtual ? 'active' : ''}`}
                onClick={() => setFotoAtual(i)}
              />
            ))}
          </div>

          {/* Botão fechar */}
          <button className="modal-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ── Conteúdo ── */}
        <div className="modal-body">

          {/* Endereço + preço */}
          <div className="modal-header-row">
            <p className="modal-endereco">
              © {imovel.endereco} — {imovel.bairro}, {imovel.cidade}
            </p>
            <p className="modal-preco">{imovel.preco}</p>
          </div>

          {/* Título */}
          <h2 className="modal-titulo">{imovel.titulo}</h2>

          {/* Descrição */}
          <p className="modal-descricao">{imovel.descricao}</p>

          {/* Specs */}
          <div className="modal-specs">
            <div className="modal-spec-item">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span className="spec-valor">{imovel.quartos}</span>
              <span className="spec-label">QUARTOS</span>
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
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3l-4 4-4-4"/>
              </svg>
              <span className="spec-valor">{imovel.vagas}</span>
              <span className="spec-label">VAGAS</span>
            </div>
            <div className="modal-spec-item">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/>
              </svg>
              <span className="spec-valor">{imovel.area} m²</span>
              <span className="spec-label">ÁREA</span>
            </div>
          </div>

          {/* Infos adicionais */}
          <div className="modal-info-list">
            <div className="modal-info-row">
              <span className="info-key">ANDAR / POSIÇÃO</span>
              <span className="info-val">{imovel.andar}</span>
            </div>
            <div className="modal-info-row">
              <span className="info-key">IPTU</span>
              <span className="info-val">{imovel.iptu}</span>
            </div>
            <div className="modal-info-row">
              <span className="info-key">CONDOMÍNIO</span>
              <span className="info-val">{imovel.condominio}</span>
            </div>
          </div>

          {/* Diferenciais */}
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

        {/* ── Footer do modal ── */}
        <div className="modal-footer">
          <button className="modal-btn-contato">ENTRAR EM CONTATO</button>
          <button className="modal-btn-voltar" onClick={onClose}>VOLTAR</button>
        </div>

      </div>
    </div>
  )
}

/* ── Card ── */
function ImovelCard({ imovel, onAbrir }) {
  return (
    <div className="imovel-card" onClick={() => onAbrir(imovel)}>
      <div className="card-img">
        <div className="card-img-placeholder" />
        <span className={`card-badge ${imovel.tipo === 'Venda' ? 'badge-venda' : 'badge-alugar'}`}>
          {imovel.tipo.toUpperCase()}
        </span>
        <span className="card-categoria">{imovel.categoria.toUpperCase()}</span>
      </div>

      <div className="card-body">
        <p className="card-localizacao">
          {imovel.bairro} · {imovel.cidade} – {imovel.estado}
        </p>
        <h3 className="card-titulo">{imovel.titulo}</h3>
        <p className="card-preco">{imovel.preco}</p>

        <div className="card-specs">
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            {imovel.quartos} quartos
          </span>
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12h16M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6M4 12v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>
            </svg>
            {imovel.banheiros} banheiros
          </span>
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3l-4 4-4-4"/>
            </svg>
            {imovel.vagas} vagas
          </span>
          <span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/>
            </svg>
            {imovel.area} m²
          </span>
        </div>

        <button className="card-btn">VER DETALHES</button>
      </div>
    </div>
  )
}

/* ── Página principal ── */
function Imoveis() {
  const [cidadeOpen, setCidadeOpen] = useState(false)
  const [bairroOpen, setBairroOpen] = useState(false)
  const [cidadeSelecionada, setCidadeSelecionada] = useState('')
  const [bairroSelecionado, setBairroSelecionado] = useState('')
  const [tipoSelecionado, setTipoSelecionado] = useState('Todos')
  const [imovelAberto, setImovelAberto] = useState(null)

  function selecionarCidade(cidade) {
    setCidadeSelecionada(cidade)
    setCidadeOpen(false)
  }

  function selecionarBairro(bairro) {
    setBairroSelecionado(bairro)
    setBairroOpen(false)
  }

  const imoveisFiltrados = imoveis.filter((im) => {
    const filtraTipo = tipoSelecionado === 'Todos' || im.tipo === tipoSelecionado
    const filtraCidade = !cidadeSelecionada || im.cidade === cidadeSelecionada
    const filtraBairro = !bairroSelecionado || im.bairro === bairroSelecionado
    return filtraTipo && filtraCidade && filtraBairro
  })

  return (
    <>
      <Nav />
      <main className="imoveis-page">

        <div className="imoveis-header">
          <h1 className="imoveis-title">Imóveis Disponíveis</h1>
          <p className="imoveis-subtitle">
            Encontre o imóvel ideal para você com a qualidade e confiança da JMarinho
          </p>
        </div>

        <div className="imoveis-filtros">
          <div className="filtros-row">

            {/* Cidade */}
            <div className="filtro-wrapper">
              <button
                className={`filtro-input ${cidadeOpen ? 'open' : ''}`}
                onClick={() => { setCidadeOpen(!cidadeOpen); setBairroOpen(false) }}
              >
                <span className="filtro-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18M3 7l9-4 9 4M4 21V7M20 21V7M9 21v-4h6v4"/>
                    <rect x="9" y="10" width="2" height="3" rx="0.4"/>
                    <rect x="13" y="10" width="2" height="3" rx="0.4"/>
                  </svg>
                </span>
                <span className={`filtro-label ${cidadeSelecionada ? 'selected' : ''}`}>
                  {cidadeSelecionada || 'Cidade'}
                </span>
                {cidadeSelecionada ? (
                  <span
                    className="filtro-clear"
                    onClick={(e) => { e.stopPropagation(); setCidadeSelecionada(''); setCidadeOpen(false) }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </span>
                ) : (
                  <span className={`filtro-arrow ${cidadeOpen ? 'open' : ''}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </span>
                )}
              </button>
              {cidadeOpen && (
                <ul className="filtro-dropdown">
                  {cidades.map((c) => (
                    <li key={c} onClick={() => selecionarCidade(c)} className={cidadeSelecionada === c ? 'active' : ''}>
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Bairro */}
            <div className="filtro-wrapper">
              <button
                className={`filtro-input ${bairroOpen ? 'open' : ''}`}
                onClick={() => { setBairroOpen(!bairroOpen); setCidadeOpen(false) }}
              >
                <span className="filtro-icon">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    <circle cx="12" cy="9" r="2.5"/>
                  </svg>
                </span>
                <span className={`filtro-label ${bairroSelecionado ? 'selected' : ''}`}>
                  {bairroSelecionado || 'Bairros'}
                </span>
                {bairroSelecionado ? (
                  <span
                    className="filtro-clear"
                    onClick={(e) => { e.stopPropagation(); setBairroSelecionado(''); setBairroOpen(false) }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </span>
                ) : (
                  <span className={`filtro-arrow ${bairroOpen ? 'open' : ''}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </span>
                )}
              </button>
              {bairroOpen && (
                <ul className="filtro-dropdown">
                  {bairros.map((b) => (
                    <li key={b} onClick={() => selecionarBairro(b)} className={bairroSelecionado === b ? 'active' : ''}>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

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
        </div>

        <div className="imoveis-grid">
          {imoveisFiltrados.length > 0
            ? imoveisFiltrados.map((im) => (
                <ImovelCard key={im.id} imovel={im} onAbrir={setImovelAberto} />
              ))
            : <p className="sem-resultados">Nenhum imóvel encontrado para os filtros selecionados.</p>
          }
        </div>

      </main>


      {imovelAberto && (
        <ImovelModal imovel={imovelAberto} onClose={() => setImovelAberto(null)} />
      )}
    </>
  )
}

export default Imoveis