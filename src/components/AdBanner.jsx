import { useState } from 'react'

function AdBanner() {
  const [message, setMessage] = useState('')

  return (
    <section className="ad-banner" aria-label="Banner promocional visual">
      <div className="ad-copy">
        <span>OTIMIZAÇÃO ONLINE</span>
        <small>Parceria em breve</small>
        <strong>JOGUE COM MAIS ESTABILIDADE</strong>
        <p>Área reservada para serviços de conexão gamer.</p>
      </div>
      <ul>
        <li>Redução de rota e ping</li>
        <li>Conexão mais estável</li>
        <li>Perfil para jogos online</li>
        <li>Parceria gamer em breve</li>
      </ul>
      <div className="ad-action-wrap">
        <button
          className="ad-button"
          type="button"
          onClick={() =>
            setMessage(
              'Serviços de otimização de conexão serão adicionados em breve.',
            )
          }
        >
          EM BREVE
        </button>
        {message && (
          <small className="affiliate-feedback" role="status">
            {message}
          </small>
        )}
      </div>
      <div className="ad-character" aria-hidden="true" />
    </section>
  )
}

export default AdBanner
