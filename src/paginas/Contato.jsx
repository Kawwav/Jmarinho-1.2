import { useState } from 'react'
import './Contato.css'

const EMAIL_ENDPOINT = '/api/send-email.php'

function Contato() {
  const [status, setStatus] = useState('idle') // idle | enviando | sucesso | erro
  const [mensagemErro, setMensagemErro] = useState('')

  function handleMouseMove(e) {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--bx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--by', `${e.clientY - r.top}px`)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    setStatus('enviando')
    setMensagemErro('')

    try {
      const formData = new FormData(form)

      const res = await fetch(EMAIL_ENDPOINT, {
        method: 'POST',
        body: formData,
      })

      const dados = await res.json().catch(() => ({}))

      if (!res.ok || !dados.success) {
        throw new Error(dados.message || 'Não foi possível enviar sua mensagem.')
      }

      setStatus('sucesso')
      form.reset()
    } catch (erro) {
      setStatus('erro')
      setMensagemErro(erro.message || 'Não foi possível enviar sua mensagem. Tente novamente.')
    }
  }

  return (
    <div className="contato-page">

      <header className="contato-hero">
        <div className="contato-hero__bg" />
        <div className="contato-hero__gradient" />
        <div className="contato-hero__content">
          <p className="contato-hero__eyebrow">Fale conosco</p>
          <h1 className="contato-hero__title">Contato</h1>
          <p className="contato-hero__sub">
            Entre em contato hoje mesmo com a JMarinho Imóveis
          </p>
        </div>
      </header>

      <main className="contato-main">
        <div className="contato-grid">
          <div className="contato-info">
            <div className="contato-info__header">
              <p className="contato-info__eyebrow">Onde nos encontrar</p>
              <h2 className="contato-info__title">Estamos prontos<br />para atender você</h2>
              <p className="contato-info__desc">
                Nossa equipe está disponível para tirar dúvidas, agendar visitas e
                ajudá-lo a encontrar o imóvel ideal.
              </p>
            </div>

            <div className="contato-info__lista">

              <a className="contato-info__item contato-info__item--link" href="tel:0000.0000">
                <div className="contato-info__item-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="contato-info__item-texto">
                  <span className="contato-info__item-tipo">Telefone</span>
                  <span className="contato-info__item-label">41 3018-0887</span>
                </div>
              </a>

              <a className="contato-info__item contato-info__item--link" href="tel:55410000.0000">
                <div className="contato-info__item-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none"/>
                    <circle cx="12" cy="18" r="1" fill="currentColor"/>
                  </svg>
                </div>
                <div className="contato-info__item-texto">
                  <span className="contato-info__item-tipo">Celular</span>
                  <span className="contato-info__item-label">41 98400-0887</span>
                </div>
              </a>
              <a
                className="contato-info__item contato-info__item--link"
                href="https://wa.me/5541984000887"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="contato-info__item-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.533 5.858L.057 23.486a.5.5 0 0 0 .611.61l5.78-1.516A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.497-5.195-1.367l-.373-.217-3.43.9.914-3.337-.237-.386A9.955 9.955 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                </div>
                <div className="contato-info__item-texto">
                  <span className="contato-info__item-tipo">WhatsApp</span>
                  <span className="contato-info__item-label">41 98400-0887</span>
                </div>
              </a>
              <div className="contato-info__item">
                <div className="contato-info__item-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div className="contato-info__item-texto">
                  <span className="contato-info__item-tipo">Endereço</span>
                  <span className="contato-info__item-label">Av. Cândido Hartmann, 1326 – Mercês</span>
                </div>
              </div>
            </div>

            <div className="contato-info__slogan">
              <div className="contato-info__slogan-linha" />
              <p className="contato-info__slogan-texto">
                JMarinho Imóveis — O Imóvel Ideal Para Você.
              </p>
            </div>
          </div>

          <div className="contato-form-wrap">
            <div className="contato-form__header">
              <p className="contato-form__eyebrow">Formulário de contato</p>
              <h2 className="contato-form__title">Envie sua mensagem<br />para a JMarinho</h2>
            </div>

            <form className="contato-form" onSubmit={handleSubmit} noValidate>

              <div className="contato-form__group">
                <label className="contato-form__label" htmlFor="nome">Nome</label>
                <input
                  className="contato-form__input"
                  id="nome"
                  name="nome"
                  type="text"
                  placeholder="Seu nome completo"
                  required
                  disabled={status === 'enviando'}
                />
              </div>

              <div className="contato-form__group">
                <label className="contato-form__label" htmlFor="email">E-mail</label>
                <input
                  className="contato-form__input"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  disabled={status === 'enviando'}
                />
              </div>

              <div className="contato-form__group">
                <label className="contato-form__label" htmlFor="telefone">Número de telefone</label>
                <input
                  className="contato-form__input"
                  id="telefone"
                  name="telefone"
                  type="tel"
                  placeholder="(41) 9 0000-0000"
                  disabled={status === 'enviando'}
                />
              </div>

              <div className="contato-form__group">
                <label className="contato-form__label" htmlFor="mensagem">Mensagem</label>
                <textarea
                  className="contato-form__textarea"
                  id="mensagem"
                  name="mensagem"
                  placeholder="Escreva sua mensagem…"
                  required
                  disabled={status === 'enviando'}
                />
              </div>

              {status === 'sucesso' && (
                <div className="contato-form__aviso contato-form__aviso--sucesso">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="8 12 11 15 16 9"/>
                  </svg>
                  Mensagem enviada com sucesso! Em breve entraremos em contato.
                </div>
              )}

              {status === 'erro' && (
                <div className="contato-form__aviso contato-form__aviso--erro">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {mensagemErro}
                </div>
              )}

              <button
                className="contato-form__btn"
                type="submit"
                onMouseMove={handleMouseMove}
                disabled={status === 'enviando'}
              >
                {status === 'enviando' ? (
                  <span className="contato-form__spinner" />
                ) : (
                  <>
                    <span>Enviar mensagem</span>
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M1 5H13M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>

            </form>
          </div>

        </div>
      </main>
    </div>
  )
}

export default Contato