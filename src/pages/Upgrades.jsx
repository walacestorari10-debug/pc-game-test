import AffiliateButton from '../components/AffiliateButton'
import Footer from '../components/Footer'
import Header from '../components/Header'
import SEOHead from '../components/SEOHead'
import { upgradeRecommendations } from '../data/upgradeRecommendations'
import '../styles/staticPages.css'

const upgradeGroups = [
  ['GPU', 'Placa de vídeo', upgradeRecommendations['Placa de vídeo']],
  ['CPU', 'Processador', upgradeRecommendations.Processador],
  ['RAM', 'Memória RAM', upgradeRecommendations['Memória RAM']],
  ['SSD', 'Armazenamento', upgradeRecommendations.Armazenamento],
]

function Upgrades() {
  return (
    <div className="static-page">
      <SEOHead
        title="Upgrades Recomendados | PC Game Test"
        description="Veja sugestões de GPU, CPU, RAM e SSD para melhorar o desempenho do seu PC gamer."
        canonicalPath="/upgrades"
      />
      <Header />

      <main className="static-page-main">
        <section className="static-hero" aria-labelledby="upgrades-title">
          <p className="static-kicker">Hardware gamer</p>
          <h1 id="upgrades-title">Upgrades Recomendados</h1>
          <p>
            Sugestões mockadas para você deixar a área pronta para links de
            afiliado reais, sem enviar visitantes para buscas genéricas.
          </p>
        </section>

        {upgradeGroups.map(([label, title, upgrades]) => (
          <section className="upgrade-group-section" key={label}>
            <div className="static-section-heading">
              <span>{label}</span>
              <h2>{title}</h2>
            </div>

            <div className="static-card-grid">
              {upgrades.map((upgrade) => (
                <article className="static-feature-card upgrade-page-card" key={upgrade.name}>
                  <span>{upgrade.type}</span>
                  <h3>{upgrade.name}</h3>
                  <strong>{upgrade.expectedGain}</strong>
                  <p>{upgrade.description}</p>
                  <AffiliateButton
                    className="static-action-button"
                    isAffiliatePending={upgrade.isAffiliatePending}
                    link={upgrade.link}
                    productName={upgrade.name}
                    provider="amazon"
                  />
                </article>
              ))}
            </div>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  )
}

export default Upgrades
