import { Link } from 'react-router-dom'
import { articles } from '../data/articles'

const dashboardArticles = articles.slice(0, 3)

function ArticlesSection() {
  return (
    <section
      className="dashboard-card articles-section"
      id="articles"
      aria-labelledby="articles-title"
    >
      <div className="section-heading">
        <h2 id="articles-title">Artigos e Guias</h2>
        <Link to="/artigos">Ver todos</Link>
      </div>

      <div className="article-list">
        {dashboardArticles.map((article) => (
          <Link
            className="article-item"
            to={`/artigos/${article.slug}`}
            key={article.slug}
          >
            <div className={`article-thumb article-${article.visual}`} />
            <div>
              <strong>{article.title}</strong>
              <p>{article.readTime}</p>
            </div>
            <span>{article.category}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default ArticlesSection
