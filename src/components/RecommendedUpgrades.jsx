import { Link } from 'react-router-dom'
import AffiliateButton from './AffiliateButton'
import {
  getUpgradeRecommendations,
  upgradeRecommendations,
} from '../data/upgradeRecommendations'

function RecommendedUpgrades({ setupResult }) {
  const setup = setupResult?.setup
  const result = setupResult?.result
  const upgrades = result
    ? getUpgradeRecommendations(result.bottleneck, setup, result)
    : upgradeRecommendations.balanced

  return (
    <section className="dashboard-card upgrades-card" id="upgrades" aria-labelledby="upgrades-title">
      <div className="section-heading">
        <div>
          <h2 id="upgrades-title">Upgrades Recomendados</h2>
          {result && (
            <p className="upgrade-context">
              Baseado no gargalo: {result.bottleneck}
            </p>
          )}
        </div>
      </div>
      <div className="upgrade-list">
        {upgrades.map((upgrade) => (
          <article className="upgrade-item" key={upgrade.name}>
            <span className="upgrade-icon" />
            <div>
              <strong>{upgrade.type}</strong>
              <p>{upgrade.name}</p>
              <small>{upgrade.expectedGain} de desempenho</small>
            </div>
            <AffiliateButton
              className="price-button"
              isAffiliatePending={upgrade.isAffiliatePending}
              link={upgrade.link}
            />
          </article>
        ))}
      </div>
      <Link className="inline-link" to="/upgrades">
        Ver todos os upgrades
      </Link>
    </section>
  )
}

export default RecommendedUpgrades
