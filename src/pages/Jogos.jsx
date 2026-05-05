import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import SEOHead from '../components/SEOHead'
import { games } from '../data/games'
import { getUpgradeRecommendations } from '../data/upgradeRecommendations'
import { calculatePcPerformance } from '../utils/performanceEngine'
import { subscribePcGameTestUpdated } from '../utils/storageEvents'
import apexImage from '../assets/images/thumbnails/apexlegends-card.webp'
import cs2Image from '../assets/images/thumbnails/cs2-card.webp'
import cyberpunkImage from '../assets/images/thumbnails/cyberpunk-card.webp'
import eldenRingImage from '../assets/images/thumbnails/eldenring-card.webp'
import forzaImage from '../assets/images/thumbnails/forza-card.webp'
import fortniteImage from '../assets/images/thumbnails/fortnite-card.webp'
import redDeadImage from '../assets/images/thumbnails/reddead2-card.webp'
import warzoneImage from '../assets/images/thumbnails/warzone-card.webp'
import '../styles/jogos.css'

const setupStorageKey = 'pcGameTestSetup'
const requiredSetupKeys = ['cpu', 'gpu', 'ram', 'storage', 'resolution', 'quality']

const filters = [
  ['Todos', 'all'],
  ['Leve', 'leve'],
  ['Médio', 'medio'],
  ['Pesado', 'pesado'],
  ['Muito pesado', 'muito_pesado'],
]

const imageBySlug = {
  'apex-legends': apexImage,
  cs2: cs2Image,
  'cyberpunk-2077': cyberpunkImage,
  'elden-ring': eldenRingImage,
  fortnite: fortniteImage,
  'forza-horizon-5': forzaImage,
  'red-dead-redemption-2': redDeadImage,
  warzone: warzoneImage,
}

const demandStatus = {
  leve: 'is-light',
  medio: 'is-medium',
  pesado: 'is-heavy',
  muito_pesado: 'is-very-heavy',
}

const performanceStatus = {
  Ótimo: 'performance-great',
  Jogável: 'performance-playable',
  Baixo: 'performance-low',
}

function readSavedSetup() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const savedSetup = JSON.parse(localStorage.getItem(setupStorageKey))

    if (!savedSetup || !requiredSetupKeys.every((key) => Boolean(savedSetup[key]))) {
      return null
    }

    return savedSetup
  } catch {
    return null
  }
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function getGameUrl(game) {
  return `/pc-roda-${game.slug}`
}

function getPersonalizedResult(savedSetup, game) {
  if (!savedSetup) {
    return null
  }

  try {
    return calculatePcPerformance(savedSetup, game.slug)
  } catch {
    return null
  }
}

function GameLibraryCard({ game, result, savedSetup }) {
  const statusClass = demandStatus[game.demandLevel] ?? 'is-medium'
  const resultStatusClass = result ? performanceStatus[result.status] : ''
  const recommendedUpgrade = result
    ? getUpgradeRecommendations(result.bottleneck)[0]
    : null
  const cardClassName = ['jogos-card', statusClass, resultStatusClass]
    .filter(Boolean)
    .join(' ')

  return (
    <article className={cardClassName}>
      <div className="jogos-card-cover">
        {imageBySlug[game.slug] && (
          <img src={imageBySlug[game.slug]} alt="" loading="lazy" />
        )}
        <span className="jogos-status-dot" aria-hidden="true" />
      </div>

      <div className="jogos-card-body">
        <div className="jogos-card-heading">
          <div>
            <span>{game.category}</span>
            <h2>{game.name}</h2>
          </div>
          <em>{result ? result.status : game.demandLabel}</em>
        </div>

        <dl className="jogos-card-meta">
          <div>
            <dt>{result ? 'FPS estimado' : 'Referência 1080p'}</dt>
            <dd>
              {result
                ? `${result.fpsRange.min}-${result.fpsRange.max}`
                : game.fpsBase1080p}
            </dd>
          </div>
          <div>
            <dt>{result ? 'Qualidade' : 'Meta ideal'}</dt>
            <dd>{result ? result.idealQuality : `${game.recommendedFps} FPS`}</dd>
          </div>
        </dl>

        {result ? (
          <div className="jogos-personalized-panel">
            <div>
              <span>Gargalo</span>
              <strong>{result.bottleneck}</strong>
            </div>
            <div>
              <span>Upgrade sugerido</span>
              <strong>{recommendedUpgrade?.name ?? result.recommendation}</strong>
            </div>
            <small>
              {savedSetup.resolution} · {savedSetup.quality} ·{' '}
              {result.averageFps} FPS médio
            </small>
          </div>
        ) : (
          <p className="jogos-reference-note">
            Valores de referência do jogo. Faça o teste para ver o FPS do seu PC.
          </p>
        )}

        <Link className="jogos-card-button" to={getGameUrl(game)}>
          {result ? 'Ver análise personalizada' : 'Ver análise'}
        </Link>
      </div>
    </article>
  )
}

function JogosContent({ initialSearchTerm }) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [activeFilter, setActiveFilter] = useState('all')
  const [savedSetup, setSavedSetup] = useState(readSavedSetup)
  const visibleGames = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm.trim())

    return games.filter((game) => {
      const matchesSearch = normalizeText(game.name).includes(normalizedSearch)
      const matchesFilter =
        activeFilter === 'all' || game.demandLevel === activeFilter

      return matchesSearch && matchesFilter
    })
  }, [activeFilter, searchTerm])

  useEffect(() => {
    const refreshSavedSetup = () => setSavedSetup(readSavedSetup())

    refreshSavedSetup()

    const unsubscribe = subscribePcGameTestUpdated(refreshSavedSetup)
    window.addEventListener('focus', refreshSavedSetup)

    return () => {
      unsubscribe()
      window.removeEventListener('focus', refreshSavedSetup)
    }
  }, [])

  return (
    <div className="jogos-page">
      <SEOHead
        title="Jogos analisados | PC Game Test"
        description="Veja análises de desempenho, requisitos e FPS estimado para os principais jogos de PC."
        canonicalPath="/jogos"
      />
      <Header />

      <main className="jogos-main">
        <section className="jogos-hero" aria-labelledby="jogos-title">
          <div>
            <p className="jogos-kicker">PC Game Test Library</p>
            <h1 id="jogos-title">Jogos analisados</h1>
            <p>
              {savedSetup
                ? 'Veja FPS estimado, gargalos e upgrades sugeridos para o seu setup salvo.'
                : 'Confira referências de FPS, metas e requisitos dos jogos. Faça o teste para ver o resultado do seu PC.'}
            </p>
          </div>
        </section>

        {savedSetup && (
          <section className="jogos-setup-status" aria-label="Setup usado nos cards">
            <div>
              <span>Setup conectado</span>
              <strong>{savedSetup.resolution} · {savedSetup.quality}</strong>
            </div>
            <p>
              Os cards abaixo usam o último teste salvo para recalcular FPS e
              gargalos em cada jogo.
            </p>
            <Link to="/teste">Atualizar setup</Link>
          </section>
        )}

        {!savedSetup && (
          <section className="jogos-reference-status" aria-label="Aviso sobre valores de referência">
            <div>
              <span>Referência geral</span>
              <strong>Sem setup conectado</strong>
            </div>
            <p>
              Os FPS exibidos nos cards são referências dos jogos em 1080p.
              Faça o teste para calcular FPS, gargalo e qualidade ideal para o seu PC.
            </p>
            <Link to="/teste">Testar meu PC</Link>
          </section>
        )}

        <section className="jogos-tools" aria-label="Busca e filtros de jogos">
          <label className="jogos-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar jogo..."
            />
          </label>

          <div className="jogos-filter-group" aria-label="Filtrar por exigência">
            {filters.map(([label, value]) => (
              <button
                className={activeFilter === value ? 'is-active' : ''}
                type="button"
                onClick={() => setActiveFilter(value)}
                aria-pressed={activeFilter === value}
                key={value}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="jogos-results" aria-live="polite">
          <div className="jogos-results-heading">
            <span>
              {visibleGames.length}{' '}
              {visibleGames.length === 1 ? 'jogo encontrado' : 'jogos encontrados'}
            </span>
          </div>

          {visibleGames.length > 0 ? (
            <div className="jogos-grid">
              {visibleGames.map((game) => (
                <GameLibraryCard
                  game={game}
                  key={game.slug}
                  result={getPersonalizedResult(savedSetup, game)}
                  savedSetup={savedSetup}
                />
              ))}
            </div>
          ) : (
            <div className="jogos-empty-state">
              <h2>Nenhum jogo encontrado</h2>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

function Jogos() {
  const [searchParams] = useSearchParams()
  const searchParam = searchParams.get('search') ?? ''

  return <JogosContent initialSearchTerm={searchParam} key={searchParam} />
}

export default Jogos
