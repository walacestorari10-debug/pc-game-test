import { Link } from 'react-router-dom'

const optimizationBullets = [
  'Redução de ping e rotas instáveis',
  'Mais estabilidade em partidas online',
  'Ideal para jogos competitivos',
  'Integrações gamer em breve',
]

function AdBanner() {
  return (
    <section className="ad-banner" aria-label="Otimização online gamer">
      <div className="ad-copy">
        <span>OTIMIZAÇÃO ONLINE</span>
        <small>Parceria em breve</small>
        <strong>Jogue com mais estabilidade</strong>
        <p>
          Área dedicada a serviços de conexão gamer, redução de ping e melhoria
          de rota para jogos online.
        </p>
      </div>

      <ul>
        {optimizationBullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>

      <div className="ad-action-wrap">
        <Link className="ad-button" to="/otimizacao-online">
          Saiba mais
        </Link>
      </div>
      <div className="ad-character" aria-hidden="true" />
    </section>
  )
}

export default AdBanner
