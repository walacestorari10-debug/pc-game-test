import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import SEOHead from '../components/SEOHead'
import '../styles/historico.css'

const historyStorageKey = 'pcGameTestHistory'

function getSavedHistory() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const savedHistory = JSON.parse(localStorage.getItem(historyStorageKey))

    return Array.isArray(savedHistory) ? savedHistory : []
  } catch {
    return []
  }
}

function formatHistoryDate(value) {
  if (!value) {
    return 'Data não informada'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

function getStatusClass(status) {
  if (status === 'Ótimo') {
    return 'is-great'
  }

  if (status === 'Jogável') {
    return 'is-playable'
  }

  return 'is-low'
}

function HistoryCard({ item }) {
  return (
    <article className="history-card">
      <div className="history-card-top">
        <div>
          <span className="history-kicker">Jogo analisado</span>
          <h2>{item.gameName}</h2>
        </div>
        <time dateTime={item.createdAt}>{formatHistoryDate(item.createdAt)}</time>
      </div>

      <div className="history-fps-row">
        <div>
          <span>FPS médio</span>
          <strong>{item.averageFps}</strong>
        </div>
        <div>
          <span>Range</span>
          <strong>
            {item.fpsRange?.min}-{item.fpsRange?.max}
          </strong>
        </div>
        <em className={getStatusClass(item.status)}>{item.status}</em>
      </div>

      <dl className="history-specs">
        <div>
          <dt>CPU</dt>
          <dd>{item.cpu}</dd>
        </div>
        <div>
          <dt>GPU</dt>
          <dd>{item.gpu}</dd>
        </div>
        <div>
          <dt>RAM</dt>
          <dd>{item.ram}</dd>
        </div>
        <div>
          <dt>Armazenamento</dt>
          <dd>{item.storage}</dd>
        </div>
        <div>
          <dt>Resolução</dt>
          <dd>{item.resolution}</dd>
        </div>
        <div>
          <dt>Qualidade</dt>
          <dd>{item.quality}</dd>
        </div>
        <div>
          <dt>Gargalo</dt>
          <dd>{item.bottleneck}</dd>
        </div>
      </dl>
    </article>
  )
}

function EmptyHistory() {
  return (
    <section className="history-empty-card">
      <p className="history-kicker">Histórico local</p>
      <h2>Nenhum teste realizado ainda</h2>
      <p>Faça uma análise para salvar o setup e consultar depois neste navegador.</p>
      <Link className="history-action history-action-primary" to="/teste">
        Fazer meu primeiro teste
      </Link>
    </section>
  )
}

function Historico() {
  const [history, setHistory] = useState(getSavedHistory)

  const clearHistory = () => {
    const shouldClear = window.confirm('Deseja apagar todo o histórico de testes?')

    if (!shouldClear) {
      return
    }

    localStorage.removeItem(historyStorageKey)
    setHistory([])
  }

  return (
    <div className="history-page">
      <SEOHead
        title="Histórico de Testes | PC Game Test"
        description="Veja os testes salvos no seu navegador com FPS estimado, setup, gargalo e status de desempenho."
        canonicalPath="/historico"
      />
      <Header />

      <main className="history-main">
        <section className="history-hero" aria-labelledby="history-title">
          <div>
            <p className="history-kicker">PC Game Test Lab</p>
            <h1 id="history-title">Histórico de Testes</h1>
            <p>Veja os últimos setups analisados no seu navegador.</p>
          </div>

          {history.length > 0 && (
            <button
              className="history-action history-action-secondary"
              type="button"
              onClick={clearHistory}
            >
              Limpar histórico
            </button>
          )}
        </section>

        {history.length === 0 ? (
          <EmptyHistory />
        ) : (
          <section className="history-grid" aria-label="Testes realizados">
            {history.map((item) => (
              <HistoryCard item={item} key={item.id} />
            ))}
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Historico
