import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { subscribePcGameTestUpdated } from '../utils/storageEvents'

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

function sortRanking(history) {
  return [...history].sort((current, next) => {
    const fpsDifference = (next.averageFps ?? 0) - (current.averageFps ?? 0)

    if (fpsDifference !== 0) {
      return fpsDifference
    }

    const scoreDifference = (next.overallScore ?? 0) - (current.overallScore ?? 0)

    if (scoreDifference !== 0) {
      return scoreDifference
    }

    return new Date(next.createdAt).getTime() - new Date(current.createdAt).getTime()
  })
}

function formatRankingTitle(item) {
  return item.gpu || item.cpu || 'PC analisado'
}

function formatSetupDetail(item) {
  return [item.cpu, item.gameName].filter(Boolean).join(' / ') || 'Setup analisado'
}

function formatRankingValue(item) {
  return item.averageFps ?? item.overallScore ?? '-'
}

function RankingSection() {
  const [history, setHistory] = useState(getSavedHistory)
  const ranking = useMemo(() => sortRanking(history).slice(0, 5), [history])

  useEffect(() => {
    return subscribePcGameTestUpdated(() => {
      setHistory(getSavedHistory())
    })
  }, [])

  return (
    <section className="dashboard-card ranking-section" id="ranking" aria-labelledby="ranking-title">
      <div className="section-heading">
        <h2 id="ranking-title">Ranking de PCs</h2>
        <Link to="/ranking">Ver ranking completo</Link>
      </div>
      {ranking.length > 0 ? (
        <ol className="ranking-list">
          {ranking.map((item, index) => (
            <li className="ranking-item" key={item.id ?? `${item.gameSlug}-${index}`}>
              <span className="ranking-position">{index + 1}</span>
              <span className="ranking-avatar" />
              <div>
                <strong>{formatRankingTitle(item)}</strong>
                <p>{formatSetupDetail(item)}</p>
              </div>
              <em title="FPS médio">{formatRankingValue(item)}</em>
            </li>
          ))}
        </ol>
      ) : (
        <div className="ranking-home-empty">
          <p>Faça um teste para montar o ranking deste navegador.</p>
          <Link to="/teste">Testar PC</Link>
        </div>
      )}
    </section>
  )
}

export default RankingSection
