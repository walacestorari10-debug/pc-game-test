import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import SEOHead from '../components/SEOHead'
import hero2Image from '../assets/images/optimized/hero2.webp'
import { articles } from '../data/articles'
import '../styles/artigos.css'

const baseFilters = [['Todos', 'todos']]
const popularTopics = [
  { label: 'Aumentar FPS', value: 'performance', icon: 'performance' },
  { label: 'Placas de vídeo', value: 'gpu', icon: 'gpu' },
  { label: 'Processadores', value: 'cpu', icon: 'cpu' },
  { label: 'Memória RAM', value: 'ram', icon: 'ram' },
  { label: 'Otimização', value: 'optimization', icon: 'gear' },
  { label: 'Windows', value: 'windows', icon: 'windows' },
]

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function getCategoryKey(category) {
  return normalizeText(category).replace(/\s+/g, '-')
}

function getArticlePath(slug) {
  return `/artigos/${slug}`
}

function getTopicByValue(value) {
  return popularTopics.find((topic) => topic.value === value) ?? null
}

function getFilters() {
  const categoryFilters = [...new Set(articles.map((article) => article.category))]
    .sort((current, next) => current.localeCompare(next, 'pt-BR'))
    .map((category) => [category, getCategoryKey(category)])

  return [...baseFilters, ...categoryFilters]
}

const articleFilters = getFilters()

function ArticleBadge({ category }) {
  return (
    <span className={`article-category-badge is-${getCategoryKey(category)}`}>
      {category}
    </span>
  )
}

function FeaturedArticleCard({ article }) {
  return (
    <Link
      className="article-featured-card"
      id={article.slug}
      to={getArticlePath(article.slug)}
      aria-label={`Ler ${article.title}`}
    >
      <div
        className={`article-image-frame article-visual-${article.visual} ${
          article.image ? 'has-image' : ''
        }`}
        style={{ '--article-image-ratio': article.imageAspectRatio }}
      >
        {article.image ? (
          <img
            className="article-card-image"
            src={article.image}
            alt=""
            loading="lazy"
          />
        ) : (
          <div className="article-image-placeholder"></div>
        )}
        <ArticleBadge category={article.category} />
        <span className="article-read-time article-read-time-overlay">
          {article.readTime}
        </span>
      </div>

      <div className="article-card-content">
        <h3>{article.title}</h3>
        <p>{article.description}</p>
        <span className="article-card-action">Ler artigo &rarr;</span>
      </div>
    </Link>
  )
}

function RecentArticleItem({ article }) {
  return (
    <Link
      className="article-recent-item"
      id={article.slug}
      to={getArticlePath(article.slug)}
      aria-label={`Ler ${article.title}`}
    >
      <div
        className={`article-list-placeholder article-visual-${article.visual} ${
          article.image ? 'has-image' : ''
        }`}
        style={{ '--article-image-ratio': article.imageAspectRatio }}
      >
        {article.image && (
          <img
            className="article-list-image"
            src={article.image}
            alt=""
            loading="lazy"
          />
        )}
      </div>

      <div className="article-recent-copy">
        <h3>{article.title}</h3>
        <p>{article.description}</p>
      </div>

      <ArticleBadge category={article.category} />
      <span className="article-read-time">{article.readTime}</span>
      <span className="article-recent-arrow" aria-hidden="true">
        &rsaquo;
      </span>
    </Link>
  )
}

function Artigos() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('todos')
  const activeTopic = getTopicByValue(searchParams.get('tema'))
  const activeTopicValue = activeTopic?.value ?? ''
  const activeCategoryLabel =
    articleFilters.find(([, value]) => value === activeFilter)?.[0] ?? 'Todos'

  const filteredArticles = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm.trim())

    return articles.filter((article) => {
      const searchableText = [
        article.title,
        article.description,
        article.category,
        ...(article.topics ?? []),
      ].join(' ')
      const matchesSearch = normalizeText(searchableText).includes(normalizedSearch)
      const matchesFilter =
        activeFilter === 'todos' ||
        normalizeText(article.category) === activeFilter
      const matchesTopic =
        !activeTopicValue || article.topics?.includes(activeTopicValue)

      return matchesSearch && matchesFilter && matchesTopic
    })
  }, [activeFilter, activeTopicValue, searchTerm])

  const featuredArticles = articles.slice(0, 4)
  const recentArticles = articles.slice(4)
  const visibleFeaturedArticles = featuredArticles.filter((article) =>
    filteredArticles.some((filteredArticle) => filteredArticle.slug === article.slug),
  )
  const visibleRecentArticles = recentArticles.filter((article) =>
    filteredArticles.some((filteredArticle) => filteredArticle.slug === article.slug),
  )
  const hasArticles = filteredArticles.length > 0
  const resultContext = activeTopic
    ? `Tema: ${activeTopic.label}`
    : activeFilter === 'todos'
      ? 'Todos os artigos'
      : `Categoria: ${activeCategoryLabel}`

  const clearTopic = () => {
    setSearchParams({})
  }

  const handleFilterChange = (value) => {
    setActiveFilter(value)

    if (activeTopicValue) {
      clearTopic()
    }
  }

  return (
    <div className="artigos-page">
      <SEOHead
        title="Artigos e Guias | PC Game Test"
        description="Dicas, tutoriais e conteúdos para melhorar o desempenho do seu PC gamer, otimizar jogos e escolher upgrades com mais confiança."
        canonicalPath="/artigos"
        openGraphImage={hero2Image}
        openGraphImageAlt="Artigos e guias do PC Game Test"
      />
      <Header />

      <main className="artigos-main">
        <section className="articles-hero" aria-labelledby="articles-page-title">
          <div className="articles-hero-copy">
            <h1 id="articles-page-title">ARTIGOS E GUIAS</h1>
            <p>
              Dicas, tutoriais e conteúdos para você melhorar o desempenho do seu
              PC e aproveitar ao máximo seus jogos favoritos.
            </p>
          </div>

          <div className="article-hero-image" aria-hidden="true">
            <img src={hero2Image} alt="" />
          </div>
        </section>

        <section className="articles-library-panel" aria-label="Biblioteca de artigos">
          <div className="articles-toolbar">
            <label className="articles-search">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar artigos pelo título..."
              />
            </label>

            <div className="articles-filter-group" aria-label="Filtrar artigos">
              {articleFilters.map(([label, value]) => (
                <button
                  className={activeFilter === value ? 'is-active' : ''}
                  type="button"
                  aria-pressed={activeFilter === value}
                  onClick={() => handleFilterChange(value)}
                  key={value}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {activeTopic && (
            <div className="articles-active-topic">
              <span>Tema ativo</span>
              <strong>{activeTopic.label}</strong>
              <button type="button" onClick={clearTopic}>
                Limpar tema
              </button>
            </div>
          )}

          <div className="articles-results-summary" aria-live="polite">
            <span>{resultContext}</span>
            <strong>
              {filteredArticles.length}{' '}
              {filteredArticles.length === 1
                ? 'artigo encontrado'
                : 'artigos encontrados'}
            </strong>
          </div>

          {!hasArticles ? (
            <section className="articles-empty-state">
              <h2>Nenhum artigo encontrado</h2>
            </section>
          ) : (
            <>
              {visibleFeaturedArticles.length > 0 && (
                <section
                  className="articles-section-card articles-featured-section"
                  aria-labelledby="featured-articles-title"
                >
                  <div className="articles-section-heading">
                    <span className="articles-heading-icon" aria-hidden="true" />
                    <h2 id="featured-articles-title">Destaques</h2>
                  </div>

                  <div className="article-featured-grid">
                    {visibleFeaturedArticles.map((article) => (
                      <FeaturedArticleCard article={article} key={article.slug} />
                    ))}
                  </div>
                </section>
              )}

              <div className="articles-bottom-grid">
                <section
                  className="articles-section-card articles-recent-section"
                  aria-labelledby="recent-articles-title"
                >
                  <div className="articles-section-heading">
                    <span className="articles-heading-icon is-list" aria-hidden="true" />
                    <h2 id="recent-articles-title">Artigos recentes</h2>
                  </div>

                  {visibleRecentArticles.length > 0 ? (
                    <div className="article-recent-list">
                      {visibleRecentArticles.map((article) => (
                        <RecentArticleItem article={article} key={article.slug} />
                      ))}
                    </div>
                  ) : (
                    <div className="articles-inline-empty">
                      Nenhum artigo recente neste filtro.
                    </div>
                  )}
                </section>

                <aside
                  className="articles-section-card articles-topics-section"
                  aria-labelledby="popular-topics-title"
                >
                  <div className="articles-section-heading">
                    <span className="articles-heading-icon is-fire" aria-hidden="true" />
                    <h2 id="popular-topics-title">Temas populares</h2>
                  </div>

                  <div className="article-topic-list">
                    {popularTopics.map((topic) => (
                      <Link
                        to={`/artigos?tema=${topic.value}`}
                        className={`article-topic-link ${
                          activeTopicValue === topic.value ? 'is-active' : ''
                        }`}
                        aria-current={
                          activeTopicValue === topic.value ? 'page' : undefined
                        }
                        onClick={() => setActiveFilter('todos')}
                        key={topic.value}
                      >
                        <span
                          className={`article-topic-icon is-${topic.icon}`}
                          aria-hidden="true"
                        />
                        {topic.label}
                      </Link>
                    ))}
                  </div>

                  <Link
                    className="article-topics-button"
                    to="/artigos"
                    onClick={() => setActiveFilter('todos')}
                  >
                    Ver todos os artigos
                  </Link>
                </aside>
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Artigos
