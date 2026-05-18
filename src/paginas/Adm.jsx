import { useState, useRef } from 'react'
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
  tipo: 'apartamento',
  modalidade: 'venda',
  valor: '',
  area: '',
  quartos: '',
  banheiros: '',
  vagas: '',
  descricao: '',
  imagens: [],
}

const IcoPlus   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IcoEdit   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const IcoTrash  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
const IcoSearch = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IcoUpload = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
const IcoWarn   = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
const IcoCheck  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
const IcoClose  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const IcoImg    = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>


function formatarValor(valor, modalidade) {
  if (!valor) return '—'
  const num = parseFloat(valor.replace(/\D/g, '')) || 0
  const fmt = num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })
  return modalidade === 'aluguel' ? `${fmt}/mês` : fmt
}

function Toast({ msg, tipo }) {
  return (
    <div className={`adm-toast adm-toast--${tipo}`}>
      {tipo === 'success' ? <IcoCheck /> : <IcoClose />}
      {msg}
    </div>
  )
}

/* Card de imóvel */
function CardImovel({ imovel, onEditar, onRemover }) {
  const { titulo, tipo, modalidade, valor, area, quartos, banheiros, vagas, imagens } = imovel
  const temImagem = imagens && imagens.length > 0

  return (
    <div className="adm-card">
      <div className="adm-card__imagem">
        {temImagem
          ? <img src={imagens[0].url} alt={titulo} />
          : <div className="adm-card__imagem-placeholder"><IcoImg /></div>
        }
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
        <h3 className="adm-card__titulo">{titulo || 'Sem título'}</h3>
        <p className="adm-card__valor">
          {formatarValor(valor, modalidade)}
          {area && <span>{area} m²</span>}
        </p>
        <div className="adm-card__atributos">
          {quartos && (
            <span className="adm-card__atrib">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 9v6m0-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 15v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2M8 9v2M16 9v2"/></svg>
              {quartos} qto{quartos !== '1' ? 's' : ''}
            </span>
          )}
          {banheiros && (
            <span className="adm-card__atrib">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4z"/><path d="M6 12V5a2 2 0 0 1 2-2h1v2"/><line x1="4" y1="12" x2="20" y2="12"/></svg>
              {banheiros} banh
            </span>
          )}
          {vagas && (
            <span className="adm-card__atrib">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="10" width="20" height="8" rx="2"/><path d="M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"/><circle cx="7" cy="18" r="1"/><circle cx="17" cy="18" r="1"/></svg>
              {vagas} vaga{vagas !== '1' ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div className="adm-card__footer">
        <button className="adm-card__btn adm-card__btn--editar" onClick={() => onEditar(imovel)}>
          <IcoEdit /> Editar
        </button>
        <button className="adm-card__btn adm-card__btn--remover" onClick={() => onRemover(imovel)}>
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

  function set(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }))
  }

  function handleImagemAdd(e) {
    const arquivos = Array.from(e.target.files)
    const novas = arquivos.map(f => ({ url: URL.createObjectURL(f), nome: f.name }))
    setForm(f => ({ ...f, imagens: [...(f.imagens || []), ...novas] }))
    e.target.value = ''
  }

  function removerImagem(idx) {
    setForm(f => ({ ...f, imagens: f.imagens.filter((_, i) => i !== idx) }))
  }

  function handleSubmit() {
    if (!form.titulo.trim()) { alert('Informe o título do imóvel.'); return }
    if (!form.valor.trim())  { alert('Informe o valor.'); return }
    onSalvar({ ...form, id: imovelEditando?.id ?? Date.now() })
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
            <div className="adm-form__group">
              <label className="adm-form__label">Título do imóvel</label>
              <input
                className="adm-form__input"
                placeholder="Ex: Apartamento no Bigorrilho"
                value={form.titulo}
                onChange={e => set('titulo', e.target.value)}
              />
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
                <select className="adm-form__select" value={form.tipo} onChange={e => set('tipo', e.target.value)}>
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa</option>
                  <option value="sobrado">Sobrado</option>
                  <option value="comercial">Comercial</option>
                  <option value="terreno">Terreno</option>
                </select>
              </div>
            </div>
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
                  {[1,2,3,4,5,6].map(n => <option key={n} value={String(n)}>{n}</option>)}
                  <option value="7+">7+</option>
                </select>
              </div>
              <div className="adm-form__group">
                <label className="adm-form__label">Banheiros</label>
                <select className="adm-form__select" value={form.banheiros} onChange={e => set('banheiros', e.target.value)}>
                  <option value="">—</option>
                  {[1,2,3,4,5].map(n => <option key={n} value={String(n)}>{n}</option>)}
                  <option value="6+">6+</option>
                </select>
              </div>
              <div className="adm-form__group">
                <label className="adm-form__label">Vagas</label>
                <select className="adm-form__select" value={form.vagas} onChange={e => set('vagas', e.target.value)}>
                  <option value="">—</option>
                  {[1,2,3,4,5].map(n => <option key={n} value={String(n)}>{n}</option>)}
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
                const novas = arquivos.map(f => ({ url: URL.createObjectURL(f), nome: f.name }))
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
  const [imoveis, setImoveis]           = useState(IMOVEIS_INICIAIS)
  const [modalAberto, setModalAberto]   = useState(false)
  const [imovelEditando, setImovelEdit] = useState(null)
  const [imovelRemover, setImovelRemov] = useState(null)
  const [toast, setToast]               = useState(null)
  const [busca, setBusca]               = useState('')
  const [filtroTipo, setFiltroTipo]     = useState('')
  const [filtroMod, setFiltroMod]       = useState('')

  function showToast(msg, tipo = 'success') {
    setToast({ msg, tipo })
    setTimeout(() => setToast(null), 3000)
  }

  function abrirNovo() { setImovelEdit(null); setModalAberto(true) }
  function abrirEditar(imovel) { setImovelEdit(imovel); setModalAberto(true) }
  function fecharModal() { setModalAberto(false); setImovelEdit(null) }

  function salvar(dados) {
    const edicao = imoveis.some(i => i.id === dados.id)
    if (edicao) {
      setImoveis(list => list.map(i => i.id === dados.id ? dados : i))
      showToast('Imóvel atualizado com sucesso!')
    } else {
      setImoveis(list => [dados, ...list])
      showToast('Imóvel publicado com sucesso!')
    }
    fecharModal()
  }

  function pedirRemocao(imovel) { setImovelRemov(imovel) }

  function confirmarRemocao() {
    setImoveis(list => list.filter(i => i.id !== imovelRemover.id))
    showToast('Imóvel removido.', 'error')
    setImovelRemov(null)
  }

  const imoveisFiltrados = imoveis.filter(im => {
    const matchBusca = im.titulo.toLowerCase().includes(busca.toLowerCase())
    const matchTipo  = !filtroTipo || im.tipo === filtroTipo
    const matchMod   = !filtroMod  || im.modalidade === filtroMod
    return matchBusca && matchTipo && matchMod
  })

  const totalVenda   = imoveis.filter(i => i.modalidade === 'venda').length
  const totalAluguel = imoveis.filter(i => i.modalidade === 'aluguel').length

  return (
    <div className="adm-page">
      <aside className="adm-sidebar">
        <div className="adm-sidebar__top">
          <span className="adm-sidebar__logo-nome">JMarinho</span>
          <span className="adm-sidebar__logo-tag">Painel Administrativo</span>
        </div>

        <div className="adm-sidebar__stats">
          <div className="adm-sidebar__stat-label">Portfólio atual</div>

          <div className="adm-sidebar__stat-row">
            <span className="adm-sidebar__stat-name">Total de imóveis</span>
            <span className="adm-sidebar__stat-value">{imoveis.length}</span>
          </div>
          <div className="adm-sidebar__stat-row">
            <span className="adm-sidebar__stat-name">À venda</span>
            <span className="adm-sidebar__stat-value adm-sidebar__stat-value--azul">{totalVenda}</span>
          </div>
          <div className="adm-sidebar__stat-row">
            <span className="adm-sidebar__stat-name">Aluguel</span>
            <span className="adm-sidebar__stat-value adm-sidebar__stat-value--azul">{totalAluguel}</span>
          </div>
          <div className="adm-sidebar__stat-row">
            <span className="adm-sidebar__stat-name">Exibindo</span>
            <span className="adm-sidebar__stat-value">{imoveisFiltrados.length}</span>
          </div>
        </div>
      </aside>
      <div className="adm-body">
        <div className="adm-topbar">
          <div className="adm-topbar__inner">
            <span className="adm-topbar__titulo">Gestão de Imóveis</span>
            <div className="adm-topbar__right">
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
            <select className="adm-filter-select" value={filtroMod} onChange={e => setFiltroMod(e.target.value)}>
              <option value="">Todas as modalidades</option>
              <option value="venda">Venda</option>
              <option value="aluguel">Aluguel</option>
            </select>
            <select className="adm-filter-select" value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
              <option value="">Todos os tipos</option>
              <option value="apartamento">Apartamento</option>
              <option value="casa">Casa</option>
              <option value="sobrado">Sobrado</option>
              <option value="comercial">Comercial</option>
              <option value="terreno">Terreno</option>
            </select>
          </div>

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

      {toast && <Toast msg={toast.msg} tipo={toast.tipo} />}

    </div>
  )
}

export default Adm