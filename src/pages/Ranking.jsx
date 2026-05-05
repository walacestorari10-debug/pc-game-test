import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import SEOHead from '../components/SEOHead'
import '../styles/ranking.css'

const historyStorageKey = 'pcGameTestHistory'

const gameFilters = [
  { label: 'Todos os jogos', value: 'all' },
  { label: 'Warzone', value: 'warzone' },
  { label: 'Fortnite', value: 'fortnite' },
  { label: 'Cyberpunk 2077', value: 'cyberpunk-2077' },
  { label: 'CS2', value: 'cs2' },
  { label: 'Apex Legends', value: 'apex-legends' },
  { label: 'Forza Horizon 5', value: 'forza-horizon-5' },
]

const statusWeight = {
  Ótimo: 3,
  Jogável: 2,
  Baixo: 1,
}

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

function formatRankingDate(value) {
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

function getRankClass(position) {
  if (position === 1) {
    return 'is-first'
  }

  if (position === 2) {
    return 'is-second'
  }

  if (position === 3) {
    return 'is-third'
  }

  return ''
}

function sortRanking(history) {
  return [...history].sort((current, next) => {
    const fpsDifference = (next.averageFps ?? 0) - (current.averageFps ?? 0)

    if (fpsDifference !== 0) {
      return fpsDifference
    }

    const statusDifference =
      (statusWeight[next.status] ?? 0) - (statusWeight[current.status] ?? 0)

    if (statusDifference !== 0) {
      return statusDifference
    }

    const scoreDifference = (next.overallScore ?? 0) - (current.overallScore ?? 0)

    if (scoreDifference !== 0) {
      return scoreDifference
    }

    return new Date(next.createdAt).getTime() - new Date(current.createdAt).getTime()
  })
}

function RankingFilter({ selectedFilter, onChange }) {
  return (
    <section className="ranking-filter-card" aria-label="Filtros de ranking">
      {gameFilters.map((filter) => (
        <button
          className={selectedFilter === filter.value ? 'is-active' : ''}
          type="button"
          onClick={() => onChange(filter.value)}
          key={filter.value}
        >
          {filter.label}
        </button>
      ))}
    </section>
  )
}

function RankingCard({ item, position }) {
  const rankClass = getRankClass(position)

  return (
    <article className={`ranking-card ${rankClass}`}>
      <div className="ranking-card-top">
        <div className="ranking-position">
          <span>{position}º</span>
        </div>

        <div className="ranking-game-heading">
          <p className="ranking-kicker">Jogo analisado</p>
          <h2>{item.gameName}</h2>
          <time dateTime={item.createdAt}>{formatRankingDate(item.createdAt)}</time>
        </div>

        <div className="ranking-fps-box">
          <span>FPS médio</span>
          <strong>{item.averageFps}</strong>
          <em className={getStatusClass(item.status)}>{item.status}</em>
        </div>
      </div>

      <dl className="ranking-spec-grid">
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
          <dt>Resolução</dt>
          <dd>{item.resolution}</dd>
        </div>
        <div>
          <dt>Qualidade</dt>
          <dd>{item.quality}</dd>
        </div>
        {item.overallScore && (
          <div>
            <dt>Pontuação</dt>
            <dd>{item.overallScore}</dd>
          </div>
        )}
      </dl>
    </article>
  )
}

function EmptyRanking() {
  return (
    <section className="ranking-empty-card">
      <p className="ranking-kicker">Ranking local</p>
      <h2>Nenhum teste no ranking ainda</h2>
      <p>Faça um teste para salvar seu resultado e entrar no ranking deste navegador.</p>
      <Link className="ranking-action ranking-action-primary" to="/teste">
        Fazer teste agora
      </Link>
    </section>
  )
}

function Ranking() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [history] = useState(getSavedHistory)
  const rankedHistory = useMemo(() => {
    const filteredHistory =
      selectedFilter === 'all'
        ? history
        : history.filter((item) => item.gameSlug === selectedFilter)

    return sortRanking(filteredHistory)
  }, [history, selectedFilter])

  return (
    <div className="ranking-page">
      <SEOHead
        title="Ranking de PCs | PC Game Test"
        description="Veja os melhores resultados salvos no ranking local com FPS médio, status e configuração dos setups."
        canonicalPath="/ranking"
      />
      <Header />

      <main className="ranking-main">
        <section className="ranking-hero" aria-labelledby="ranking-title">
          <p className="ranking-kicker">PC Game Test Lab</p>
          <h1 id="ranking-title">Ranking</h1>
          <p>Veja os melhores resultados salvos no histórico local do navegador.</p>
        </section>

        {history.length === 0 ? (
          <EmptyRanking />
        ) : (
          <>
            <RankingFilter
              selectedFilter={selectedFilter}
              onChange={setSelectedFilter}
            />

            {rankedHistory.length === 0 ? (
              <section className="ranking-empty-card">
                <p className="ranking-kicker">Filtro sem resultados</p>
                <h2>Nenhum teste para este jogo</h2>
                <p>Escolha outro filtro ou faça um novo teste com o jogo selecionado.</p>
                <Link className="ranking-action ranking-action-primary" to="/teste">
                  Fazer teste agora
                </Link>
              </section>
            ) : (
              <section className="ranking-list" aria-label="Melhores testes">
                {rankedHistory.map((item, index) => (
                  <RankingCard
                    item={item}
                    position={index + 1}
                    key={item.id ?? `${item.gameSlug}-${index}`}
                  />
                ))}
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Ranking
