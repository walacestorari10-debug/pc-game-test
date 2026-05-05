import Footer from '../components/Footer'
import FeedbackWidget from '../components/FeedbackWidget'
import Header from '../components/Header'
import SEOHead from '../components/SEOHead'
import '../styles/staticPages.css'

function getStructuredData(page) {
  if (page.faq?.length) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${page.title} | PC Game Test`,
    description: page.description,
  }
}

function QuickFacts({ items }) {
  if (!items?.length) {
    return null
  }

  return (
    <section className="static-quick-grid" aria-label="Informações principais">
      {items.map((item) => (
        <article className="static-quick-item" key={item.label}>
          <span>{item.label}</span>
          <p>{item.value}</p>
        </article>
      ))}
    </section>
  )
}

function ContentSection({ section }) {
  return (
    <article className="static-content-section">
      <h2>{section.heading}</h2>
      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {section.bullets?.length > 0 && (
        <ul className="static-bullet-list">
          {section.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
    </article>
  )
}

function FaqSection({ items }) {
  if (!items?.length) {
    return null
  }

  return (
    <section className="static-faq-section" aria-labelledby="static-faq-title">
      <div className="static-section-heading">
        <span>FAQ</span>
        <h2 id="static-faq-title">Respostas importantes</h2>
      </div>

      <div className="static-faq-list">
        {items.map((item) => (
          <article className="static-faq-item" key={item.question}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function InfoPage({ page }) {
  const structuredData = getStructuredData(page)

  return (
    <div className="static-page">
      <SEOHead
        title={`${page.title} | PC Game Test`}
        description={page.description}
        canonicalPath={page.path}
        structuredData={structuredData}
      />
      <Header />

      <main className="static-page-main">
        <section className="static-hero" aria-labelledby="static-page-title">
          <div className="static-hero-copy">
            <div className="static-hero-meta">
              <p className="static-kicker">{page.eyebrow}</p>
              {page.updatedAt && <span>{page.updatedAt}</span>}
            </div>

            <h1 id="static-page-title">{page.title}</h1>
            <p>{page.description}</p>
          </div>
        </section>

        {page.summary && (
          <section className="static-summary-panel" aria-label="Resumo da página">
            <p>{page.summary}</p>
          </section>
        )}

        <QuickFacts items={page.quickFacts} />

        {page.sections?.length > 0 && (
          <section className="static-content-card" aria-label="Conteúdo principal">
            {page.sections.map((section) => (
              <ContentSection section={section} key={section.heading} />
            ))}
          </section>
        )}

        <FaqSection items={page.faq} />

        {page.showFeedback && (
          <section className="static-feedback-section" aria-label="Enviar sugestão">
            <FeedbackWidget className="static-contact-feedback" />
          </section>
        )}

        {page.notice && (
          <section className="static-notice-card" aria-label="Observação importante">
            <strong>Observação</strong>
            <p>{page.notice}</p>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default InfoPage
