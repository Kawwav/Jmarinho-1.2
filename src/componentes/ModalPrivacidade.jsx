import { useEffect } from 'react'
import './ModalPrivacidade.css'

function ModalPrivacidade({ isOpen, onClose }) {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="privacy-overlay" onClick={onClose} translate="no">
      <div className="privacy-container" onClick={(e) => e.stopPropagation()}>

        <button className="privacy-close" onClick={onClose} aria-label="Fechar modal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Conteúdo Exclusivo da Política */}
        <div className="privacy-content">
          <span className="privacy-eyebrow">Segurança e Transparência</span>
          <h2 className="privacy-title">Política de Privacidade</h2>
          
          <div className="privacy-text-box">
            <p>
              A <strong>JMarinho Imóveis</strong> valoriza a segurança das suas informações. Os dados pessoais coletados em nossos canais de atendimento (como Nome, E-mail e Telefone em nossa página de Contato) possuem a finalidade exclusiva de estabelecer comunicação direta para responder às suas dúvidas, propostas ou solicitações de atendimento imobiliário[cite: 1].
            </p>
            <p>
              Garantimos que suas informações não serão compartilhadas, vendidas ou utilizadas para o envio de campanhas de marketing não autorizadas (spam). Todos os dados recebidos permanecem armazenados de forma estritamente segura e confidencial.
            </p>
            
            <h3>Atendimento via WhatsApp e LGPD</h3>
            <p>
              Ao clicar em nossos links de redirecionamento para o <strong>WhatsApp</strong>, você concorda com o tratamento dos dados fornecidos para fins de atendimento nos termos da <strong>Lei Geral de Proteção de Dados (LGPD)</strong>. Garantimos a confidencialidade e a utilização responsável de todas as informações compartilhadas durante as nossas conversas.
            </p>

            <h3>Uso de Dados Coletados</h3>
            <p>
              As informações enviadas voluntariamente por você através do nosso site servem unicamente para que nossa equipe retorne o contato com as informações sobre os imóveis ou serviços comerciais de seu interesse.
            </p>

            <h3>Direito de Alteração e Remoção</h3>
            <p>
              A qualquer momento você poderá solicitar a exclusão definitiva dos seus dados de nossos registros, bastando manifestar essa vontade respondendo diretamente a um de nossos e-mails de atendimento ou durante o contato em nossos canais digitais.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ModalPrivacidade