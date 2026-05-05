import { useState } from 'react'
import { Link } from 'react-router-dom'

const deals = [
  ['Hogwarts Legacy', 'hogwarts'],
  ['Dragon Ball Sparking Zero', 'dragonball'],
  ['Alan Wake 2', 'alanwake'],
  ['Spider-Man 2', 'spiderman'],
]

function GameDealsSection() {
  const [activeMessage, setActiveMessage] = useState('')

  return (
    <section className="dashboard-card deals-section" id="deals" aria-labelledby="deals-title">
      <div className="section-heading">
        <h2 id="deals-title">Promoções de Jogos</h2>
        <Link to="/promocoes">Ver todas</Link>
      </div>
      <div className="deals-grid">
        {deals.map(([title, slug]) => (
          <article className="deal-card" key={title}>
            <div className={`deal-cover deal-${slug}`}>
              <span>{title}</span>
            </div>
            <div className="deal-info">
              <strong>Em breve</strong>
              <div>
                <p>Oferta disponível em breve</p>
                <span className="deal-note">Seleção gamer em breve</span>
              </div>
              <button
                className="deal-action"
                type="button"
                onClick={() =>
                  setActiveMessage('Promoções reais serão adicionadas em breve.')
                }
              >
                Ver detalhes
              </button>
            </div>
          </article>
        ))}
      </div>
      {activeMessage && (
        <small className="affiliate-feedback deals-feedback" role="status">
          {activeMessage}
        </small>
      )}
    </section>
  )
}

export default GameDealsSection
