import './Card.css'

/**
 * Card reutilizável para Imoveis, Comercial e Adm.
 *
 * Props:
 *  - imovel        {object}   dados do imóvel
 *  - onAbrir       {function} chamado ao clicar no card (Imoveis / Comercial)
 *  - onEditar      {function} chamado ao clicar em "Editar"  (Adm – opcional)
 *  - onRemover     {function} chamado ao clicar em "Remover" (Adm – opcional)
 *  - modoAdm       {boolean}  exibe botões Editar/Remover em vez de "Ver Detalhes"
 *  - renderSpecs   {function} função que recebe `imovel` e retorna os <span> de specs
 *                             (cada página passa os seus próprios ícones/campos)
 */
export default function Card({ imovel, onAbrir, onEditar, onRemover, modoAdm = false, renderSpecs }) {
  const temImagem = imovel.imagens && imovel.imagens.length > 0
  const tipoLabel = imovel.modalidade === 'aluguel' ? 'ALUGUEL' : 'VENDA'
  const badgeClass = imovel.modalidade === 'aluguel' ? 'card-badge--alugar' : 'card-badge--venda'

  function handleCardClick() {
    if (onAbrir) onAbrir(imovel)
  }

  return (
    <div className="card" onClick={handleCardClick}>

      {/* ── Imagem em cima ── */}
      <div className="card__img">
        {temImagem ? (
          <img src={imovel.imagens[0].url} alt={imovel.titulo} />
        ) : (
          <div className="card__img-placeholder" />
        )}
        <span className={`card__badge ${badgeClass}`}>{tipoLabel}</span>
        {(imovel.tipo || imovel.categoria) && (
          <span className="card__categoria">
            {(imovel.categoria || imovel.tipo || '').toUpperCase()}
          </span>
        )}
      </div>

      {/* ── Informações abaixo da imagem ── */}
      <div className="card__body">
        {(imovel.bairro || imovel.cidade) && (
          <p className="card__localizacao">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {[imovel.bairro, imovel.cidade].filter(Boolean).join(' · ')}
          </p>
        )}

        <h3 className="card__titulo">{imovel.titulo || 'Sem título'}</h3>
        <p className="card__preco">{formatarValor(imovel.valor, imovel.modalidade)}</p>

        {renderSpecs && (
          <div className="card__specs">
            {renderSpecs(imovel)}
          </div>
        )}

        {modoAdm ? (
          <div className="card__footer-adm">
            <button
              className="card__btn card__btn--editar"
              onClick={e => { e.stopPropagation(); onEditar && onEditar(imovel) }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Editar
            </button>
            <button
              className="card__btn card__btn--remover"
              onClick={e => { e.stopPropagation(); onRemover && onRemover(imovel) }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
              Remover
            </button>
          </div>
        ) : (
          <button className="card__btn-ver">VER DETALHES</button>
        )}
      </div>
    </div>
  )
}

/* helper local (igual ao das páginas) */
function formatarValor(valor, modalidade) {
  if (valor === undefined || valor === null || valor === '') return '—'
  const num = Number(valor) || 0
  const fmt = num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })
  return modalidade === 'aluguel' ? `${fmt}/mês` : fmt
}