import AffiliateButton from '../components/AffiliateButton'
import Footer from '../components/Footer'
import Header from '../components/Header'
import SEOHead from '../components/SEOHead'
import '../styles/staticPages.css'

const promotions = [
  {
    title: 'Jogos de mundo aberto',
    discount: 'Ofertas monitoradas',
    description:
      'Espaço preparado para reunir promoções de RPGs, corridas e jogos de mundo aberto quando os links oficiais estiverem prontos.',
  },
  {
    title: 'FPS e battle royale',
    discount: 'Links em breve',
    description:
      'Cards reservados para jogos competitivos, pacotes e descontos relevantes para a comunidade PC Game Test.',
  },
  {
    title: 'Bundles gamer',
    discount: 'Seleção em breve',
    description:
      'Área para combos, expansões e bundles com preço realmente interessante, sem redirecionamento genérico.',
  },
]

function Promocoes() {
  return (
    <div className="static-page">
      <SEOHead
        title="Promoções de Jogos | PC Game Test"
        description="Veja promoções de jogos selecionadas pelo PC Game Test. Links reais serão adicionados em breve."
        canonicalPath="/promocoes"
      />
      <Header />

      <main className="static-page-main">
        <section className="static-hero" aria-labelledby="promocoes-title">
          <p className="static-kicker">Economia gamer</p>
          <h1 id="promocoes-title">Promoções de Jogos</h1>
          <p>
            Uma área para ofertas reais e selecionadas. Por enquanto, os cards
            mostram o espaço preparado sem mandar você para links aleatórios.
          </p>
        </section>

        <section className="static-card-grid" aria-label="Promoções disponíveis em breve">
          {promotions.map((promotion) => (
            <article className="static-feature-card promo-card" key={promotion.title}>
              <span>{promotion.discount}</span>
              <h2>{promotion.title}</h2>
              <p>{promotion.description}</p>
              <AffiliateButton
                className="static-action-button"
                isAffiliatePending
                link="#"
                pendingMessage="Links de promoções serão adicionados em breve."
              >
                Ver oferta
              </AffiliateButton>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Promocoes
