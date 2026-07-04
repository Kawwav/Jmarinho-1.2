import { useState, useRef, useEffect, useCallback } from 'react'
import { api } from "../apiClient";
import './Adm.css'
const IMOVEIS_INICIAIS = [
  {
    id: 1,
    titulo: 'Apartamento no Mercês',
    tipo: 'apartamento',
    modalidade: 'venda',
    valor: '480000',
    area: '87',
    quartos: '3',
    banheiros: '2',
    vagas: '1',
    descricao: 'Apartamento reformado, sol da manhã, vista livre. Próximo ao comércio e transporte público.',
    imagens: [],
  },
  {
    id: 2,
    titulo: 'Casa em Condomínio Água Verde',
    tipo: 'casa',
    modalidade: 'venda',
    valor: '1250000',
    area: '240',
    quartos: '4',
    banheiros: '3',
    vagas: '2',
    descricao: 'Casa espaçosa com jardim, churrasqueira e área gourmet. Condomínio fechado com segurança 24h.',
    imagens: [],
  },
  {
    id: 3,
    titulo: 'Sobrado no Batel',
    tipo: 'sobrado',
    modalidade: 'aluguel',
    valor: '4800',
    area: '160',
    quartos: '3',
    banheiros: '3',
    vagas: '2',
    descricao: 'Sobrado moderno, bem localizado, próximo a restaurantes e parques.',
    imagens: [],
  },
]

const FORM_VAZIO = {
  titulo: '',
  codigo: '',
  tipo: 'apartamento',
  modalidade: 'venda',
  valor: '',
  area: '',
  quartos: '',
  banheiros: '',
  vagas: '',
  descricao: '',
  imagens: [],
  categoria: '',
  bairro: '',
  cidade: '',
  ativo: true,
  status: '',
}

const IcoPlus = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
const IcoEdit = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
const IcoTrash = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>
const IcoSearch = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
const IcoUpload = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
const IcoWarn = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>
const IcoCheck = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
const IcoClose = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
const IcoShare = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
const IcoPause = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
const IcoPlay = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
const IcoImg = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>


function formatarValor(valor, modalidade) {
  if (valor === undefined || valor === null || valor === '') return '—';

  const num = Number(valor) || 0;

  const fmt = num.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0
  });

  return modalidade === 'aluguel' ? `${fmt}/mês` : fmt;
}

function Toast({ msg, tipo }) {
  return (
    <div className={`adm-toast adm-toast--${tipo}`}>
      {tipo === 'success' ? <IcoCheck /> : <IcoClose />}
      {msg}
    </div>
  )
}

/* Preview do imóvel (somente leitura, sem botão de contato) */
function ModalPreview({ imovel, onFechar, onEditar }) {
  const [fotoAtual, setFotoAtual] = useState(0)
  const totalFotos = imovel.imagens?.length || 1

  const prev = useCallback(() => setFotoAtual(f => (f - 1 + totalFotos) % totalFotos), [totalFotos])
  const next = useCallback(() => setFotoAtual(f => (f + 1) % totalFotos), [totalFotos])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onFechar()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onFechar, prev, next])

  const temImagem = imovel.imagens && imovel.imagens.length > 0

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>

        {/* Carrossel */}
        <div className="modal-carousel">
          <div className="carousel-top-fade" />

          {temImagem ? (
            <img
              src={imovel.imagens[fotoAtual]?.url}
              alt={imovel.titulo}
              className="carousel-img"
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          ) : (
            <div className="carousel-img" style={{
              background: 'linear-gradient(135deg, #0a2540 0%, #1a4a6e 50%, #0d3255 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <IcoImg />
            </div>
          )}

          <div className="carousel-counter">
            {fotoAtual + 1} / {totalFotos}
            <span className="carousel-tipo">{imovel.modalidade?.toUpperCase()}</span>
          </div>

          <span className="carousel-categoria">{imovel.tipo?.toUpperCase()}</span>

          {totalFotos > 1 && <>
            <button className="carousel-btn carousel-prev" onClick={prev}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button className="carousel-btn carousel-next" onClick={next}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
            <div className="carousel-dots">
              {imovel.imagens.map((_, i) => (
                <button key={i} className={`carousel-dot ${i === fotoAtual ? 'active' : ''}`} onClick={() => setFotoAtual(i)} />
              ))}
            </div>
          </>}

          <button className="modal-close" onClick={onFechar}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="modal-content-col">
        <div className="modal-body">
          <div className="modal-header-row">
            <p className="modal-endereco">
              {(imovel.bairro || imovel.cidade) && <><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 4, opacity: 0.7 }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>{[imovel.bairro, imovel.cidade].filter(Boolean).join(', ')} · </>}{imovel.categoria ? `${imovel.categoria} · ` : ''}{imovel.modalidade === 'aluguel' ? 'Aluguel' : 'Venda'}
            </p>
            <p className="modal-preco">{formatarValor(imovel.valor, imovel.modalidade)}</p>
          </div>

          <h2 className="modal-titulo">{imovel.titulo}</h2>
          {imovel.codigo && (
            <span style={{ display: 'inline-block', fontSize: '11px', color: 'var(--cinza-medio, #8a9bb0)', background: 'var(--fundo-alt, #f0f4fa)', borderRadius: 4, padding: '3px 8px', fontWeight: 600, letterSpacing: 0.5, marginTop: 4 }}>
              Cód: {imovel.codigo}
            </span>
          )}

          {imovel.descricao && <p className="modal-descricao">{imovel.descricao}</p>}

          <div className="modal-specs">
            {imovel.quartos && (
              <div className="modal-spec-item">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9v6m0-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 15v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2M8 9v2M16 9v2" /></svg>
                <span className="spec-valor">{imovel.quartos}</span>
                <span className="spec-label">QUARTOS</span>
              </div>
            )}
            {imovel.banheiros && (
              <div className="modal-spec-item">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4z" /><path d="M6 12V5a2 2 0 0 1 2-2h1v2" /></svg>
                <span className="spec-valor">{imovel.banheiros}</span>
                <span className="spec-label">BANHEIROS</span>
              </div>
            )}
            {imovel.vagas && (
              <div className="modal-spec-item">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 3l-4 4-4-4" /></svg>
                <span className="spec-valor">{imovel.vagas}</span>
                <span className="spec-label">VAGAS</span>
              </div>
            )}
            {imovel.area && (
              <div className="modal-spec-item">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="1" /><path d="M3 9h18M9 21V9" /></svg>
                <span className="spec-valor">{imovel.area} m²</span>
                <span className="spec-label">ÁREA</span>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn-voltar" onClick={onFechar}>FECHAR</button>
          <button className="modal-btn-contato" style={{ background: 'var(--azul-escuro)' }} onClick={() => { onFechar(); onEditar(imovel) }}>
            EDITAR IMÓVEL
          </button>
        </div>
        </div>

      </div>
    </div>
  )
}

/* Card de imóvel */
function CardImovel({ imovel, onEditar, onRemover, onPreview, onToggleAtivo }) {
  const [copied, setCopied] = useState(false)
  const { titulo, tipo, modalidade, valor, area, quartos, banheiros, vagas, imagens } = imovel
  const temImagem = imagens && imagens.length > 0

  return (
    <div className="adm-card adm-card--clicavel" onClick={() => onPreview(imovel)}>
      <div className="adm-card__imagem">
        {temImagem
          ? <img src={imagens[0].url} alt={titulo} />
          : <div className="adm-card__imagem-placeholder"><IcoImg /></div>
        }
        {!imovel.ativo && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2
          }}>
            <span style={{
              background: '#e53e3e', color: '#fff', fontWeight: 700,
              fontSize: 11, letterSpacing: 1.5, padding: '4px 12px', borderRadius: 6, textTransform: 'uppercase'
            }}>Inativo</span>
          </div>
        )}
        {imovel.status && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3,
            background: imovel.status === 'reservado' ? 'rgba(180,83,9,0.92)' : imovel.status === 'locado' ? 'rgba(21,128,61,0.92)' : 'rgba(30,64,175,0.92)',
            color: '#fff', textAlign: 'center', fontFamily: "'Jost', sans-serif",
            fontWeight: 700, fontSize: 10, letterSpacing: 2.5, padding: '5px 0', textTransform: 'uppercase'
          }}>{imovel.status}</div>
        )}
        <div className="adm-card__badges">
          <span className={`adm-badge adm-badge--${modalidade}`}>
            {modalidade === 'venda' ? 'Venda' : 'Aluguel'}
          </span>
          <span className="adm-badge adm-badge--tipo">
            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </span>
        </div>
      </div>

      <div className="adm-card__body">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <h3 className="adm-card__titulo">{titulo || 'Sem título'}</h3>
          {imovel.codigo && <span style={{ fontSize: '10px', color: 'var(--cinza-medio, #8a9bb0)', background: 'var(--fundo-alt, #f0f4fa)', borderRadius: 4, padding: '2px 6px', fontWeight: 600, letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{imovel.codigo}</span>}
        </div>
        {(imovel.bairro || imovel.cidade) && <p className="adm-card__bairro"><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 3, opacity: 0.6 }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>{[imovel.bairro, imovel.cidade].filter(Boolean).join(' · ')}</p>}
        <p className="adm-card__valor">
          {formatarValor(valor, modalidade)}
          {area && <span>{area} m²</span>}
        </p>
        <div className="adm-card__atributos">
          {quartos && (
            <span className="adm-card__atrib">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 9v6m0-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 15v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2M8 9v2M16 9v2" /></svg>
              {quartos} qto{quartos !== '1' ? 's' : ''}
            </span>
          )}
          {banheiros && (
            <span className="adm-card__atrib">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4z" /><path d="M6 12V5a2 2 0 0 1 2-2h1v2" /><line x1="4" y1="12" x2="20" y2="12" /></svg>
              {banheiros} banh
            </span>
          )}
          {vagas && (
            <span className="adm-card__atrib">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="10" width="20" height="8" rx="2" /><path d="M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" /><circle cx="7" cy="18" r="1" /><circle cx="17" cy="18" r="1" /></svg>
              {vagas} vaga{vagas !== '1' ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div className="adm-card__footer">
        <button className="adm-card__btn adm-card__btn--editar" onClick={e => { e.stopPropagation(); onEditar(imovel) }}>
          <IcoEdit /> Editar
        </button>
        <button
          className={`adm-card__btn adm-card__btn--share ${copied ? 'adm-card__btn--share-copied' : ''}`}
          title="Copiar link do imóvel"
          onClick={e => {
            e.stopPropagation()
            const tipo = imovel.tipo === 'comercial' ? 'comercial' : 'imoveis'
            const url = `${window.location.origin}/${tipo}?id=${imovel.id}`
            navigator.clipboard.writeText(url).then(() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            })
          }}
        >
          <IcoShare /> {copied ? 'Copiado!' : 'Link'}
        </button>
        <button
          className={`adm-card__btn ${imovel.ativo !== false ? 'adm-card__btn--desativar' : 'adm-card__btn--ativar'}`}
          onClick={e => { e.stopPropagation(); onToggleAtivo(imovel) }}
          title={imovel.ativo !== false ? 'Desativar imóvel (mantém dados e fotos)' : 'Reativar imóvel'}
        >
          {imovel.ativo !== false ? <><IcoPause /> Desativar</> : <><IcoPlay /> Ativar</>}
        </button>
        <button className="adm-card__btn adm-card__btn--remover" onClick={e => { e.stopPropagation(); onRemover(imovel) }}>
          <IcoTrash /> Remover
        </button>
      </div>
    </div>
  )
}


/* adicionar / editar*/
function ModalFormulario({ imovelEditando, onFechar, onSalvar }) {
  const edicao = !!imovelEditando
  const [form, setForm] = useState(imovelEditando ? { ...imovelEditando } : { ...FORM_VAZIO })
  const fileRef = useRef(null)

  useEffect(() => {
    if (imovelEditando) {
      setForm({
        id: imovelEditando.id ?? '',
        titulo: imovelEditando.titulo ?? '',
        codigo: imovelEditando.codigo ?? '',
        tipo: imovelEditando.tipo ?? 'apartamento',
        modalidade: imovelEditando.modalidade ?? 'venda',
        categoria: imovelEditando.categoria ?? '',
        valor: imovelEditando.valor ?? '',
        area: imovelEditando.area ?? '',
        quartos: imovelEditando.quartos ?? '',      // null → ''
        banheiros: imovelEditando.banheiros ?? '',  // null → ''
        vagas: imovelEditando.vagas ?? '',          // null → ''
        descricao: imovelEditando.descricao ?? '',
        bairro: imovelEditando.bairro ?? '',
        cidade: imovelEditando.cidade ?? '',
        imagens: imovelEditando.imagens ?? [],
        ativo: imovelEditando.ativo !== false,
        status: imovelEditando.status ?? ''
      })
    }
  }, [imovelEditando])

  function set(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }))
  }

  function handleImagemAdd(e) {
    const arquivos = Array.from(e.target.files)
    const novas = arquivos.map(f => ({
      url: URL.createObjectURL(f), // só para preview no form
      nome: f.name,
      file: f // guarda o arquivo original para fazer upload depois
    }))
    setForm(f => ({ ...f, imagens: [...(f.imagens || []), ...novas] }))
    e.target.value = ''
  }

  function removerImagem(idx) {
    setForm(f => ({ ...f, imagens: f.imagens.filter((_, i) => i !== idx) }))
  }

  function handleSubmit(e) {
    // Evita que a página recarregue ao clicar no botão
    if (e && e.preventDefault) e.preventDefault();

    // 1. Validação segura convertendo tudo para Texto antes de testar com o trim
    if (!String(form.titulo).trim() || !String(form.valor).trim() || !String(form.area).trim()) {
      alert('Por favor, preencha os campos obrigatórios (Título, Valor e Área).');
      return;
    }

    // 2. Validação secundária do valor também protegida contra números puros
    if (!String(form.valor).trim()) {
      alert('Informe o valor.');
      return;
    }

    // Envia os dados limpos para a função salvar salvar no Supabase
    onSalvar(form)
  }

  return (
    <>
      <div className="adm-overlay" onClick={onFechar} />
      <div className="adm-modal">
        <div className="adm-modal__header">
          <div>
            <h2 className="adm-modal__titulo">
              {edicao ? 'Editar Imóvel' : 'Novo Imóvel'}
            </h2>
            <p className="adm-modal__sub">
              {edicao ? 'Atualize as informações do imóvel' : 'Preencha os dados para publicar o imóvel'}
            </p>
          </div>
          <button className="adm-modal__fechar" onClick={onFechar} aria-label="Fechar">
            <IcoClose />
          </button>
        </div>

        <div className="adm-modal__body">
          <div className="adm-form__secao">
            <p className="adm-form__secao-titulo">Identificação</p>
            <div className="adm-form__row">
              <div className="adm-form__group" style={{ flex: 2 }}>
                <label className="adm-form__label">Título do imóvel</label>
                <input
                  className="adm-form__input"
                  placeholder="Ex: Apartamento no Bigorrilho"
                  value={form.titulo}
                  onChange={e => set('titulo', e.target.value)}
                />
              </div>
              <div className="adm-form__group" style={{ flex: 1 }}>
                <label className="adm-form__label">Código do imóvel</label>
                <input
                  className="adm-form__input"
                  placeholder="Ex: IM-0042"
                  value={form.codigo}
                  onChange={e => set('codigo', e.target.value)}
                />
              </div>
            </div>
            <div className="adm-form__group adm-form__grupo-status">
              <label className="adm-form__label">Status de negociação</label>
              <div className="adm-form__status-grid">
                {['', 'reservado', 'com proposta', 'locado'].map(s => (
                  <button
                    key={s}
                    type="button"
                    className={`adm-form__status-btn adm-form__status-btn--${s || 'nenhum'}${form.status === s ? ' adm-form__status-btn--ativo' : ''}`}
                    onClick={() => set('status', form.status === s ? '' : s)}
                  >
                    {s === '' ? 'Nenhum' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="adm-form__row">
              <div className="adm-form__group">
                <label className="adm-form__label">Cidade</label>
                <input
                  className="adm-form__input"
                  placeholder="Ex: Curitiba"
                  value={form.cidade}
                  onChange={e => set('cidade', e.target.value)}
                />
              </div>
              <div className="adm-form__group">
                <label className="adm-form__label">Bairro</label>
                <input
                  className="adm-form__input"
                  placeholder="Ex: Mercês"
                  value={form.bairro}
                  onChange={e => set('bairro', e.target.value)}
                />
              </div>
            </div>
            <div className="adm-form__row">
              <div className="adm-form__group">
                <label className="adm-form__label">Modalidade</label>
                <select className="adm-form__select" value={form.modalidade} onChange={e => set('modalidade', e.target.value)}>
                  <option value="venda">Venda</option>
                  <option value="aluguel">Aluguel</option>
                </select>
              </div>
              <div className="adm-form__group">
                <label className="adm-form__label">Tipo</label>
                <select className="adm-form__select" value={form.tipo} onChange={e => { set('tipo', e.target.value); set('categoria', '') }}>
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa</option>
                  <option value="sobrado">Sobrado</option>
                  <option value="comercial">Comercial</option>
                  <option value="terreno">Terreno</option>
                </select>
              </div>
            </div>

            {form.tipo === 'comercial' && (
              <div className="adm-form__group adm-form__grupo-comercial">
                <label className="adm-form__label">Categoria comercial</label>
                <div className="adm-form__categoria-grid">
                  {['Loja', 'Barracão', 'Escritório', 'Prédio Comercial', 'Galpão'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      className={`adm-form__categoria-btn${form.categoria === cat ? ' adm-form__categoria-btn--ativo' : ''}`}
                      onClick={() => set('categoria', form.categoria === cat ? '' : cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="adm-form__secao">
            <p className="adm-form__secao-titulo">Valores & Área</p>
            <div className="adm-form__row">
              <div className="adm-form__group">
                <label className="adm-form__label">
                  {form.modalidade === 'aluguel' ? 'Aluguel (R$/mês)' : 'Valor de venda (R$)'}
                </label>
                <input
                  className="adm-form__input"
                  placeholder="Ex: 450000"
                  value={form.valor}
                  onChange={e => set('valor', e.target.value)}
                  inputMode="numeric"
                />
              </div>
              <div className="adm-form__group">
                <label className="adm-form__label">Área (m²)</label>
                <input
                  className="adm-form__input"
                  placeholder="Ex: 90"
                  value={form.area}
                  onChange={e => set('area', e.target.value)}
                  inputMode="numeric"
                />
              </div>
            </div>
          </div>

          <div className="adm-form__secao">
            <p className="adm-form__secao-titulo">Características</p>
            <div className="adm-form__row adm-form__row--3">
              <div className="adm-form__group">
                <label className="adm-form__label">Quartos</label>
                <select className="adm-form__select" value={form.quartos} onChange={e => set('quartos', e.target.value)}>
                  <option value="">—</option>
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={String(n)}>{n}</option>)}
                  <option value="7+">7+</option>
                </select>
              </div>
              <div className="adm-form__group">
                <label className="adm-form__label">Banheiros</label>
                <select className="adm-form__select" value={form.banheiros} onChange={e => set('banheiros', e.target.value)}>
                  <option value="">—</option>
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={String(n)}>{n}</option>)}
                  <option value="6+">6+</option>
                </select>
              </div>
              <div className="adm-form__group">
                <label className="adm-form__label">Vagas</label>
                <select className="adm-form__select" value={form.vagas} onChange={e => set('vagas', e.target.value)}>
                  <option value="">—</option>
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={String(n)}>{n}</option>)}
                  <option value="6+">6+</option>
                </select>
              </div>
            </div>
          </div>
          <div className="adm-form__secao">
            <p className="adm-form__secao-titulo">Descrição</p>
            <div className="adm-form__group">
              <label className="adm-form__label">Texto descritivo</label>
              <textarea
                className="adm-form__textarea"
                placeholder="Descreva os diferenciais do imóvel, localização, estado de conservação…"
                value={form.descricao}
                onChange={e => set('descricao', e.target.value)}
              />
            </div>
          </div>

          <div className="adm-form__secao">
            <p className="adm-form__secao-titulo">Imagens</p>
            <div
              className="adm-form__upload-area"
              onClick={() => fileRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault()
                const arquivos = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
                const novas = arquivos.map(f => ({
                  url: URL.createObjectURL(f),
                  nome: f.name,
                  file: f  // ← adiciona isso
                }))
                setForm(f => ({ ...f, imagens: [...(f.imagens || []), ...novas] }))
              }}
            >
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImagemAdd} />
              <div className="adm-form__upload-icone"><IcoUpload /></div>
              <p className="adm-form__upload-texto">
                <strong>Clique para selecionar</strong> ou arraste as fotos aqui
              </p>
              <p className="adm-form__upload-hint">JPG, PNG, WEBP — múltiplas imagens permitidas</p>
            </div>

            {form.imagens && form.imagens.length > 0 && (
              <div className="adm-form__imagens-preview">
                {form.imagens.map((img, i) => (
                  <div key={i} className="adm-form__img-thumb">
                    <img src={img.url} alt={img.nome} />
                    <button
                      className="adm-form__img-remover"
                      onClick={() => removerImagem(i)}
                      aria-label="Remover imagem"
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="adm-modal__footer">
          <button className="adm-btn-cancelar" onClick={onFechar}>Cancelar</button>
          <button className="adm-btn-salvar" onClick={handleSubmit}>
            <span>{edicao ? 'Salvar alterações' : 'Publicar imóvel'}</span>
            <IcoCheck />
          </button>
        </div>
      </div>
    </>
  )
}

/* remoção*/
function ModalConfirmacao({ imovel, onConfirmar, onCancelar }) {
  return (
    <>
      <div className="adm-overlay" onClick={onCancelar} />
      <div className="adm-confirm">
        <div className="adm-confirm__box">
          <div className="adm-confirm__icone"><IcoWarn /></div>
          <h3 className="adm-confirm__titulo">Remover imóvel?</h3>
          <p className="adm-confirm__desc">
            Você está prestes a remover <strong>"{imovel.titulo}"</strong>.<br />
            Essa ação não poderá ser desfeita.
          </p>
          <div className="adm-confirm__acoes">
            <button className="adm-btn-cancelar" style={{ flex: 1 }} onClick={onCancelar}>Cancelar</button>
            <button className="adm-btn-remover-confirm" onClick={onConfirmar}>
              <IcoTrash /> Remover
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

/* pagina principal */
function Adm() {
  const [imoveis, setImoveis] = useState([]) // Começa vazio
  const [carregando, setCarregando] = useState(true) // Novo estado de carregamento
  const [modalAberto, setModalAberto] = useState(false)
  const [imovelEditando, setImovelEdit] = useState(null)
  const [imovelRemover, setImovelRemov] = useState(null)
  const [imovelPreview, setImovelPreview] = useState(null)
  const [toast, setToast] = useState(null)
  const [busca, setBusca] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroMod, setFiltroMod] = useState('')
  const [mostrarInativos, setMostrarInativos] = useState(false)

  // Busca os imóveis direto da nossa API PHP
  const buscarImoveis = async () => {
    try {
      setCarregando(true)
      const data = await api.listarImoveis()
      setImoveis(data || [])
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error.message)
      alert('Erro ao carregar os imóveis do banco de dados.')
    } finally {
      setCarregando(false)
    }
  }

  // EFEITO NOVO: Faz a busca rodar assim que a tela abre
  useEffect(() => {
    buscarImoveis()
  }, [])

  function showToast(msg, tipo = 'success') {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3000)
  }

  function abrirNovo() { setImovelEdit(null); setModalAberto(true) }
  function abrirEditar(imovel) { setImovelEdit(imovel); setModalAberto(true) }
  function fecharModal() { setModalAberto(false); setImovelEdit(null) }

  // Substitui a função salvar inteira:
  async function salvar(dadosForm) {
    try {
      // 1. Faz upload das imagens novas (que têm .file) pra nossa API PHP
      const imagensFinais = await Promise.all(
        (dadosForm.imagens || []).map(async (img) => {
          // Se já tem URL pública (não é blob: local), é imagem já salva — mantém
          if (!img.file) return { url: img.url, nome: img.nome }

          const resultado = await api.uploadImagem(img.file)
          return { url: resultado.url, nome: img.nome }
        })
      )
      console.log('imagensFinais:', imagensFinais)
      const dadosImovel = {
        titulo: dadosForm.titulo,
        tipo: dadosForm.tipo,
        modalidade: dadosForm.modalidade,
        categoria: dadosForm.tipo === 'comercial' ? dadosForm.categoria : null,
        valor: parseFloat(dadosForm.valor) || 0,
        area: parseFloat(dadosForm.area) || 0,
        quartos: dadosForm.tipo !== 'comercial' ? dadosForm.quartos : null,
        banheiros: dadosForm.banheiros || null,
        vagas: dadosForm.vagas || null,
        descricao: dadosForm.descricao,
        bairro: dadosForm.bairro || '',
        cidade: dadosForm.cidade || '',
        imagens: imagensFinais.length > 0 ? imagensFinais : null,
        ativo: dadosForm.ativo !== false,
        codigo: dadosForm.codigo || null,
        status: dadosForm.status || null,
      }

      if (dadosForm.id) {
        const atualizado = await api.atualizarImovel(dadosForm.id, dadosImovel)
        setImoveis(prev => prev.map(im => im.id === dadosForm.id ? atualizado : im))
        showToast('Imóvel atualizado com sucesso!', 'success')
      } else {
        const novo = await api.criarImovel(dadosImovel)
        setImoveis(prev => [novo, ...prev])
        showToast('Imóvel publicado com sucesso!', 'success')
      }

      fecharModal()
    } catch (error) {
      console.error('Erro ao salvar:', error.message)
      alert('Erro ao salvar: ' + error.message)
    }
  }

  function pedirRemocao(imovel) { setImovelRemov(imovel) }

  async function toggleAtivo(imovel) {
    const novoStatus = imovel.ativo === false ? true : false
    try {
      await api.atualizarImovel(imovel.id, { ativo: novoStatus })
      setImoveis(prev => prev.map(im => im.id === imovel.id ? { ...im, ativo: novoStatus } : im))
      showToast(novoStatus ? 'Imóvel reativado!' : 'Imóvel desativado (dados preservados).', 'success')
    } catch (error) {
      alert('Erro ao atualizar status: ' + error.message)
    }
  }

  async function confirmarRemocao() {
    if (!imovelRemover) return;

    try {
      // 1. Apaga na nossa API PHP usando o ID correto (imovelRemover.id)
      await api.removerImovel(imovelRemover.id);

      // 2. Só tira da tela depois que a API confirmou que apagou
      setImoveis(prev => prev.filter(im => im.id !== imovelRemover.id));

      // 3. Fecha o modal de confirmação
      setImovelRemov(null);

      showToast('Imóvel removido com sucesso!', 'success');
    } catch (error) {
      console.error('Erro real ao remover imóvel:', error.message);
      alert('Erro ao remover imóvel: ' + error.message);
    }
  }

  const totalVenda = imoveis.filter(i => i.modalidade === 'venda').length
  const totalAluguel = imoveis.filter(i => i.modalidade === 'aluguel').length
  const totalInativos = imoveis.filter(i => i.ativo === false).length

  const imoveisFiltrados = imoveis.filter(im => {
    const matchBusca = im.titulo.toLowerCase().includes(busca.toLowerCase())
    const matchTipo = !filtroTipo || im.tipo === filtroTipo
    const matchMod = !filtroMod || im.modalidade === filtroMod
    const matchCategoria = !filtroCategoria || im.categoria === filtroCategoria
    const matchAtivo = mostrarInativos ? true : im.ativo !== false
    return matchBusca && matchTipo && matchMod && matchCategoria && matchAtivo
  })

  // Imoveis da modalidade selecionada para mini-lista na sidebar
  const imoveisVenda = imoveis.filter(i => i.modalidade === 'venda')
  const imoveisAluguel = imoveis.filter(i => i.modalidade === 'aluguel')

  const tituloTopbar =
    filtroMod === 'venda' ? 'Imóveis à Venda' :
      filtroMod === 'aluguel' ? 'Imóveis para Aluguel' :
        'Gestão de Imóveis'

  if (carregando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Jost', color: '#004169' }}>
        <h2>Conectando ao banco de dados...</h2>
      </div>
    )
  }

  return (
    <div className="adm-page" translate="no">

      {/* ── Sidebar ── */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar__top">
          <span className="adm-sidebar__logo-nome">JMarinho</span>
          <span className="adm-sidebar__logo-tag">Painel Administrativo</span>
        </div>

        {/* ── Navegação por modalidade ── */}
        <nav className="adm-sidebar__nav">
          <p className="adm-sidebar__nav-label">Visualizar</p>

          <button
            className={`adm-sidebar__nav-item ${filtroMod === '' ? 'active' : ''}`}
            onClick={() => { setFiltroMod(''); setFiltroTipo('') }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span>Todos</span>
            <span className="adm-sidebar__nav-count">{imoveis.length}</span>
          </button>

          <button
            className={`adm-sidebar__nav-item ${filtroMod === 'venda' ? 'active' : ''}`}
            onClick={() => { setFiltroMod('venda'); setFiltroTipo('') }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Venda</span>
            <span className="adm-sidebar__nav-count adm-sidebar__nav-count--venda">{totalVenda}</span>
          </button>

          <button
            className={`adm-sidebar__nav-item ${filtroMod === 'aluguel' ? 'active' : ''}`}
            onClick={() => { setFiltroMod('aluguel'); setFiltroTipo('') }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 3l-4 4-4-4" />
            </svg>
            <span>Aluguel</span>
            <span className="adm-sidebar__nav-count adm-sidebar__nav-count--aluguel">{totalAluguel}</span>
          </button>
        </nav>

        {/* ── Mini-lista da modalidade selecionada ── */}
        {filtroMod !== '' && (
          <div className="adm-sidebar__lista">
            <p className="adm-sidebar__lista-label">
              {filtroMod === 'venda' ? 'À Venda' : 'Aluguel'} · {filtroMod === 'venda' ? imoveisVenda.length : imoveisAluguel.length} imóvel{(filtroMod === 'venda' ? imoveisVenda : imoveisAluguel).length !== 1 ? 'is' : ''}
            </p>
            <div className="adm-sidebar__lista-itens">
              {(filtroMod === 'venda' ? imoveisVenda : imoveisAluguel).map(im => (
                <div key={im.id} className="adm-sidebar__lista-item">
                  <div className="adm-sidebar__lista-thumb">
                    {im.imagens && im.imagens.length > 0
                      ? <img src={im.imagens[0].url} alt={im.titulo} />
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                    }
                  </div>
                  <div className="adm-sidebar__lista-info">
                    <span className="adm-sidebar__lista-titulo">{im.titulo}</span>
                    <span className="adm-sidebar__lista-valor">{formatarValor(im.valor, im.modalidade)}</span>
                  </div>
                </div>
              ))}
              {(filtroMod === 'venda' ? imoveisVenda : imoveisAluguel).length === 0 && (
                <p className="adm-sidebar__lista-vazia">Nenhum imóvel cadastrado</p>
              )}
            </div>
          </div>
        )}

        <div className="adm-sidebar__footer">
          <span className="adm-sidebar__footer-text">JMarinho Imóveis © 2025</span>
          <button
            className="adm-sidebar__sair"
            onClick={async () => { await api.logout(); window.location.href = '/login' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sair
          </button>
        </div>
      </aside>

      {/* ── Corpo ── */}
      <div className="adm-body">
        <div className="adm-topbar">
          <div className="adm-topbar__inner">
            <div className="adm-topbar__titulo-wrap">
              <span className="adm-topbar__titulo">{tituloTopbar}</span>
              {filtroMod && (
                <span className={`adm-topbar__mod-badge adm-topbar__mod-badge--${filtroMod}`}>
                  {filtroMod === 'venda' ? 'Venda' : 'Aluguel'}
                </span>
              )}
            </div>
            <div className="adm-topbar__right">
              {totalInativos > 0 && (
                <button
                  className={`adm-btn-inativos ${mostrarInativos ? 'adm-btn-inativos--ativo' : ''}`}
                  onClick={() => setMostrarInativos(v => !v)}
                  title="Exibir/ocultar imóveis desativados"
                >
                  {mostrarInativos ? <IcoPlay /> : <IcoPause />}
                  <span>{mostrarInativos ? 'Ocultar inativos' : `Inativos (${totalInativos})`}</span>
                </button>
              )}
              <button className="adm-btn-primary" onClick={abrirNovo}>
                <IcoPlus />
                <span>Adicionar imóvel</span>
              </button>
            </div>
          </div>
        </div>
        <main className="adm-main">
          <div className="adm-toolbar">
            <div className="adm-search">
              <div className="adm-search__icon"><IcoSearch /></div>
              <input
                className="adm-search__input"
                placeholder="Buscar por título…"
                value={busca}
                onChange={e => setBusca(e.target.value)}
              />
            </div>
            {/* Filtro de modalidade na toolbar aparece só se estiver em "Todos" */}
            {filtroMod === '' && (
              <select className="adm-filter-select" value={filtroMod} onChange={e => setFiltroMod(e.target.value)}>
                <option value="">Todas as modalidades</option>
                <option value="venda">Venda</option>
                <option value="aluguel">Aluguel</option>
              </select>
            )}
            <select
              className="adm-filter-select"
              value={filtroTipo}
              onChange={e => { setFiltroTipo(e.target.value); setFiltroCategoria('') }}
            >
              <option value="">Todos os tipos</option>
              <option value="apartamento">Apartamento</option>
              <option value="casa">Casa</option>
              <option value="sobrado">Sobrado</option>
              <option value="comercial">Comercial</option>
              <option value="terreno">Terreno</option>
            </select>
          </div>

          {filtroTipo === 'comercial' && (
            <div className="adm-toolbar adm-toolbar--sub">
              <span className="adm-filter-label">Categoria comercial:</span>
              <select
                className="adm-filter-select adm-filter-select--sub"
                value={filtroCategoria}
                onChange={e => setFiltroCategoria(e.target.value)}
              >
                <option value="">Todas as categorias</option>
                <option value="Loja">Loja</option>
                <option value="Barracão">Barracão</option>
                <option value="Escritório">Escritório</option>
                <option value="Prédio Comercial">Prédio Comercial</option>
                <option value="Galpão">Galpão</option>
              </select>
            </div>
          )}

          <div className="adm-grid">
            {imoveisFiltrados.length === 0 ? (
              <div className="adm-vazio">
                <IcoImg />
                <p>Nenhum imóvel encontrado</p>
                <small>Tente ajustar os filtros ou adicione um novo imóvel.</small>
              </div>
            ) : (
              imoveisFiltrados.map(im => (
                <CardImovel
                  key={im.id}
                  imovel={im}
                  onEditar={abrirEditar}
                  onRemover={pedirRemocao}
                  onPreview={setImovelPreview}
                  onToggleAtivo={toggleAtivo}
                />
              ))
            )}
          </div>

        </main>
      </div>

      {modalAberto && (
        <ModalFormulario
          imovelEditando={imovelEditando}
          onFechar={fecharModal}
          onSalvar={salvar}
        />
      )}

      {imovelRemover && (
        <ModalConfirmacao
          imovel={imovelRemover}
          onConfirmar={confirmarRemocao}
          onCancelar={() => setImovelRemov(null)}
        />
      )}

      {imovelPreview && (
        <ModalPreview
          imovel={imovelPreview}
          onFechar={() => setImovelPreview(null)}
          onEditar={abrirEditar}
        />
      )}

      {toast && <Toast msg={toast.msg} tipo={toast.tipo} />}

    </div>
  )
}

export default Adm