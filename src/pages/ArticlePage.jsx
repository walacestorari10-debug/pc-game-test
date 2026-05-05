import { Link, useParams } from 'react-router-dom'
import AffiliateButton from '../components/AffiliateButton'
import FeedbackWidget from '../components/FeedbackWidget'
import Footer from '../components/Footer'
import Header from '../components/Header'
import SEOHead from '../components/SEOHead'
import { getArticleProductRecommendations } from '../data/articleProductRecommendations'
import { getArticleBySlug, getRelatedArticles } from '../data/articles'
import '../styles/artigos.css'

function formatArticleDate(value) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

function ArticleNotFound() {
  return (
    <div className="artigos-page">
      <SEOHead
        title="Artigo não encontrado | PC Game Test"
        description="O artigo solicitado não foi encontrado no PC Game Test."
        canonicalPath="/artigos"
      />
      <Header />

      <main className="article-page-main">
        <section className="article-not-found">
          <p className="article-detail-kicker">Artigos e Guias</p>
          <h1>Artigo não encontrado</h1>
          <p>O conteúdo que você tentou acessar não está disponível.</p>
          <Link className="article-back-button" to="/artigos">
            Voltar para artigos
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function RelatedArticleCard({ article }) {
  return (
    <Link
      className="article-related-card"
      to={`/artigos/${article.slug}`}
      style={{ '--article-image-ratio': article.imageAspectRatio }}
    >
      <img src={article.image} alt="" loading="lazy" />
      <div>
        <span>{article.category}</span>
        <h3>{article.title}</h3>
        <p>{article.readTime}</p>
      </div>
    </Link>
  )
}

function ArticleProductRecommendations({ recommendations }) {
  if (!recommendations?.items?.length) {
    return null
  }

  return (
    <section className="article-products-section" aria-labelledby="article-products-title">
      <div className="article-products-header">
        <p className="article-products-kicker">Produtos relacionados</p>
        <h2 id="article-products-title">{recommendations.title}</h2>
        <p>{recommendations.description}</p>
      </div>

      <div className="article-products-grid">
        {recommendations.items.map((item) => {
          return (
            <div className="article-product-card" key={item.name}>
              <span className="article-product-label">{item.label}</span>
              <h3>{item.name}</h3>
              <p>{item.reason}</p>
              <span className="article-product-detail">{item.detail}</span>
              <AffiliateButton
                className="article-product-button"
                isAffiliatePending={item.isAffiliatePending}
                link={item.link}
              />
            </div>
          )
        })}
      </div>

      <p className="article-products-note">{recommendations.note}</p>
    </section>
  )
}

function toSectionId(heading) {
  return heading
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function ArticleSideRail({ article, relatedArticles }) {
  const sectionLinks = article.contentSections.map((section) => ({
    id: toSectionId(section.heading),
    heading: section.heading.replace(/^\d+\.\s*/, ''),
  }))
  const nextArticle = relatedArticles[0]

  return (
    <aside className="article-side-rail" aria-label="Apoio do artigo">
      <section className="article-side-card article-guide-card" aria-labelledby="article-guide-title">
        <span>Guia rápido</span>
        <h2 id="article-guide-title">Neste artigo</h2>
        <nav aria-label="Seções do artigo">
          {sectionLinks.map((section) => (
            <a href={`#${section.id}`} key={section.id}>
              {section.heading}
            </a>
          ))}
        </nav>
      </section>

      <section className="article-side-card article-test-card" aria-labelledby="article-test-title">
        <span>Seu setup</span>
        <h2 id="article-test-title">Compare com o seu PC</h2>
        <p>
          Faça uma análise rápida e veja FPS estimado, gargalo e upgrade ideal
          para jogos.
        </p>
        <Link className="article-side-action" to="/teste">
          Testar meu PC
        </Link>
      </section>

      {nextArticle && (
        <section className="article-side-card article-next-card" aria-labelledby="article-next-title">
          <span>Leia também</span>
          <h2 id="article-next-title">{nextArticle.title}</h2>
          <p>{nextArticle.readTime}</p>
          <Link className="article-side-link" to={`/artigos/${nextArticle.slug}`}>
            Abrir guia
          </Link>
        </section>
      )}
    </aside>
  )
}

function ArticlePage() {
  const { slug } = useParams()
  const article = getArticleBySlug(slug)

  if (!article) {
    return <ArticleNotFound />
  }

  const relatedArticles = getRelatedArticles(article.slug, 3)
  const productRecommendations = getArticleProductRecommendations(article.slug)
  const canonicalPath = `/artigos/${article.slug}`
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.date,
    author: {
      '@type': 'Organization',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PC Game Test',
    },
    mainEntityOfPage: canonicalPath,
  }

  return (
    <div className="artigos-page">
      <SEOHead
        title={`${article.title} | PC Game Test`}
        description={article.description}
        canonicalPath={canonicalPath}
        structuredData={structuredData}
      />
      <Header />

      <main className="article-page-main">
        <article className="article-detail" aria-labelledby="article-detail-title">
          <nav className="article-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/artigos">Artigos</Link>
            <span>/</span>
            <span>{article.category}</span>
          </nav>

          <header className="article-detail-hero">
            <div className="article-detail-copy">
              <p className="article-detail-kicker">{article.category}</p>
              <h1 id="article-detail-title">{article.title}</h1>
              <p>{article.description}</p>

              <div className="article-detail-meta">
                <span>{article.readTime}</span>
                <span>{article.author}</span>
                <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
              </div>
            </div>

            <div
              className="article-detail-image"
              style={{ '--article-image-ratio': article.imageAspectRatio }}
            >
              <img src={article.image} alt="" />
            </div>
          </header>

          <div className="article-detail-content-grid">
            <div className="article-detail-body">
              {article.contentSections.map((section) => (
                <section key={section.heading}>
                  <h2 id={toSectionId(section.heading)}>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </section>
              ))}
            </div>

            <ArticleSideRail article={article} relatedArticles={relatedArticles} />
          </div>

          <ArticleProductRecommendations recommendations={productRecommendations} />

          <FeedbackWidget />
        </article>

        <section className="article-related-section" aria-labelledby="related-articles-title">
          <div className="articles-section-heading">
            <span className="articles-heading-icon" aria-hidden="true" />
            <h2 id="related-articles-title">Veja também</h2>
          </div>

          <div className="article-related-grid">
            {relatedArticles.map((relatedArticle) => (
              <RelatedArticleCard
                article={relatedArticle}
                key={relatedArticle.slug}
              />
            ))}
          </div>
        </section>

        <div className="article-detail-actions">
          <Link className="article-back-button" to="/artigos">
            Voltar para artigos
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ArticlePage
