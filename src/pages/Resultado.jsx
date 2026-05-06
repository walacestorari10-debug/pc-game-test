import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import FeedbackScrollPrompt from '../components/FeedbackScrollPrompt'
import AffiliateButton from '../components/AffiliateButton'
import FeedbackWidget from '../components/FeedbackWidget'
import FpsEstimateNotice from '../components/FpsEstimateNotice'
import Footer from '../components/Footer'
import Header from '../components/Header'
import SEOHead from '../components/SEOHead'
import { games } from '../data/games'
import { getUpgradeRecommendations } from '../data/upgradeRecommendations'
import { calculatePcPerformance } from '../utils/performanceEngine'
import { notifyPcGameTestUpdated } from '../utils/storageEvents'
import apexImage from '../assets/images/thumbnails/apexlegends-card.webp'
import cs2Image from '../assets/images/thumbnails/cs2-card.webp'
import cyberpunkImage from '../assets/images/thumbnails/cyberpunk-card.webp'
import eldenRingImage from '../assets/images/thumbnails/eldenring-card.webp'
import fortniteImage from '../assets/images/thumbnails/fortnite-card.webp'
import forzaImage from '../assets/images/thumbnails/forza-card.webp'
import redDeadImage from '../assets/images/thumbnails/reddead2-card.webp'
import warzoneImage from '../assets/images/thumbnails/warzone-card.webp'
import '../styles/resultado.css'

const setupStorageKey = 'pcGameTestSetup'
const historyStorageKey = 'pcGameTestHistory'
const requiredSetupKeys = [
  'selectedGame',
  'cpu',
  'gpu',
  'ram',
  'storage',
  'resolution',
  'quality',
]

const confidenceBadges = [
  'Baseado em benchmarks reais',
  'Estimativa inteligente',
  'Simulação de desempenho',
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

const gradientBySlug = {
  'apex-legends': 'apex',
  cs2: 'cs2',
  'cyberpunk-2077': 'cyberpunk',
  'elden-ring': 'elden',
  fortnite: 'fortnite',
  'forza-horizon-5': 'forza',
  'red-dead-redemption-2': 'reddead',
  warzone: 'warzone',
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function useCountUp(targetValue, duration = 850, decimals = 0) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let animationFrame
    let start = 0

    const animate = (timestamp) => {
      const elapsed = timestamp - start
      const progress = clamp(elapsed / duration, 0, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)

      setValue(Number((targetValue * easedProgress).toFixed(decimals)))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame((timestamp) => {
      start = timestamp
      setValue(0)
      animationFrame = requestAnimationFrame(animate)
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [targetValue, duration, decimals])

  return value
}

function getSavedSetup() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const savedSetup = JSON.parse(localStorage.getItem(setupStorageKey))
    const isValidSetup =
      savedSetup && requiredSetupKeys.every((key) => Boolean(savedSetup[key]))

    return isValidSetup ? savedSetup : null
  } catch {
    return null
  }
}

function getHistoryKey(setup) {
  if (setup.testId) {
    return String(setup.testId)
  }

  return [
    setup.selectedGame,
    setup.cpu,
    setup.gpu,
    setup.ram,
    setup.storage,
    setup.resolution,
    setup.quality,
  ].join('|')
}

function getSavedHistory() {
  try {
    const savedHistory = JSON.parse(localStorage.getItem(historyStorageKey))

    return Array.isArray(savedHistory) ? savedHistory : []
  } catch {
    return []
  }
}

function saveResultToHistory(setup, result) {
  if (typeof window === 'undefined') {
    return
  }

  const testKey = getHistoryKey(setup)
  const savedHistory = getSavedHistory()
  const alreadySaved = savedHistory.some((item) => item.testKey === testKey)

  if (alreadySaved) {
    return
  }

  const id = Number(setup.testId) || Date.now()
  const historyItem = {
    id,
    testKey,
    createdAt: new Date(id).toISOString(),
    gameSlug: result.game.slug,
    gameName: result.game.name,
    cpu: setup.cpu,
    gpu: setup.gpu,
    ram: setup.ram,
    storage: setup.storage,
    resolution: setup.resolution,
    quality: setup.quality,
    overallScore: result.overallScore,
    averageFps: result.averageFps,
    fpsRange: result.fpsRange,
    status: result.status,
    bottleneck: result.bottleneck,
  }

  localStorage.setItem(
    historyStorageKey,
    JSON.stringify([historyItem, ...savedHistory].slice(0, 30)),
  )
  notifyPcGameTestUpdated()
}

function getHistoryComparison(setup, result) {
  const currentTestKey = getHistoryKey(setup)
  const previousTests = getSavedHistory().filter((item) => {
    return item.testKey !== currentTestKey && typeof item.averageFps === 'number'
  })

  if (!previousTests.length) {
    return null
  }

  const lowerFpsTests = previousTests.filter(
    (item) => item.averageFps < result.averageFps,
  ).length

  return Math.round((lowerFpsTests / previousTests.length) * 100)
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

function getScoreColor(status) {
  if (status === 'Ótimo') {
    return '#22c55e'
  }

  if (status === 'Jogável') {
    return '#f59e0b'
  }

  return '#ef4444'
}

function getScoreRingStyle(score, status) {
  const color = getScoreColor(status)
  const angle = clamp(score, 0, 100) * 3.6

  return {
    '--resultado-score-color': color,
    background: `
      radial-gradient(circle, #101827 0 56%, transparent 57%),
      conic-gradient(from 220deg, ${color} 0 ${angle}deg, rgba(55, 65, 81, 0.82) ${angle}deg 360deg)
    `,
  }
}

function ResultadoScoreRingFx() {
  return (
    <>
      <span className="resultado-score-orbit orbit-one" aria-hidden="true" />
      <span className="resultado-score-orbit orbit-two" aria-hidden="true" />
      <span className="resultado-score-sweep" aria-hidden="true" />
      <span className="resultado-score-tick tick-top" aria-hidden="true" />
      <span className="resultado-score-tick tick-right" aria-hidden="true" />
      <span className="resultado-score-tick tick-bottom" aria-hidden="true" />
      <span className="resultado-score-tick tick-left" aria-hidden="true" />
    </>
  )
}

function ScoreStat({ label, value }) {
  return (
    <div className="resultado-score-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function ComponentBar({ name, value, isAnimated }) {
  return (
    <div className="resultado-component-row">
      <div className="resultado-component-label">
        <span>{name}</span>
        <strong>{value}%</strong>
      </div>
      <div className="resultado-component-track" aria-hidden="true">
        <span style={{ width: `${isAnimated ? value : 0}%` }} />
      </div>
    </div>
  )
}

function GameFpsCard({ game }) {
  const [hasImageError, setHasImageError] = useState(false)
  const statusClass = getStatusClass(game.status)

  return (
    <article className={`resultado-game-card fallback-${game.gradient}`}>
      {!hasImageError && (
        <img
          src={game.image}
          alt=""
          loading="lazy"
          onError={() => setHasImageError(true)}
        />
      )}
      <div className="resultado-game-overlay" />
      <div className="resultado-game-content">
        <h3>{game.name}</h3>
        <div>
          <strong>
            {game.fpsRange.min}-{game.fpsRange.max} FPS
          </strong>
          <span>{game.preset}</span>
        </div>
        <em className={statusClass}>{game.status}</em>
      </div>
    </article>
  )
}

function UpgradeCard({ upgrade }) {
  return (
    <article className="resultado-upgrade-card">
      <div>
        <span>{upgrade.type}</span>
        <strong>{upgrade.expectedGain}</strong>
      </div>
      <h3>{upgrade.name}</h3>
      <p>{upgrade.description}</p>
      <AffiliateButton
        className="resultado-upgrade-button"
        isAffiliatePending={upgrade.isAffiliatePending}
        link={upgrade.link}
        productName={upgrade.name}
        provider="amazon"
      />
    </article>
  )
}

function EmptyResult() {
  return (
    <div className="resultado-page">
      <SEOHead
        title="Resultado do seu PC | PC Game Test"
        description="Veja a análise do seu setup, FPS estimado, gargalos, status de desempenho e recomendações de upgrade."
        canonicalPath="/resultado"
      />
      <Header />

      <main className="resultado-main">
        <section className="resultado-hero" aria-labelledby="resultado-title">
          <div className="resultado-hero-copy">
            <p className="resultado-kicker">PC Game Test Lab</p>
            <h1 id="resultado-title">Resultado do seu PC</h1>
            <p>Nenhum teste encontrado.</p>
          </div>
        </section>

        <section className="resultado-card resultado-empty-state">
          <p className="resultado-kicker">Análise indisponível</p>
          <h2>Nenhum teste encontrado</h2>
          <p>Escolha seu hardware, resolução, qualidade e jogo para gerar uma estimativa.</p>
          <Link className="resultado-action resultado-action-primary" to="/teste">
            Fazer teste agora
          </Link>
        </section>

        <FeedbackWidget />
      </main>

      <Footer />
    </div>
  )
}

function ResultContent({ setup, selectedResult }) {
  const [areBarsAnimated, setAreBarsAnimated] = useState(false)
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false)
  const animatedScore = useCountUp(selectedResult.overallScore / 10, 950, 1)
  const animatedAverageFps = useCountUp(selectedResult.averageFps, 900, 0)
  const statusClass = getStatusClass(selectedResult.status)
  const comparisonPercent = getHistoryComparison(setup, selectedResult)
  const scoreStats = [
    ['FPS médio', animatedAverageFps],
    [
      'FPS estimado',
      `${selectedResult.fpsRange.min}-${selectedResult.fpsRange.max}`,
    ],
    ['Status', selectedResult.status],
  ]
  const estimatedGames = games.map((game) => {
    const result = calculatePcPerformance(setup, game.slug)

    return {
      name: game.name,
      image: imageBySlug[game.slug],
      gradient: gradientBySlug[game.slug],
      fpsRange: result.fpsRange,
      preset: `${setup.resolution} ${result.idealQuality}`,
      status: result.status,
    }
  })
  const recommendedUpgrades = getUpgradeRecommendations(
    selectedResult.bottleneck,
    setup,
    selectedResult,
  )

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAreBarsAnimated(true))

    return () => cancelAnimationFrame(frame)
  }, [selectedResult])

  return (
    <div className="resultado-page">
      <SEOHead
        title="Resultado do seu PC | PC Game Test"
        description="Veja a análise do seu setup, FPS estimado, gargalos, status de desempenho e recomendações de upgrade."
        canonicalPath="/resultado"
      />
      <Header />

      <main className="resultado-main">
        <section className="resultado-hero" aria-labelledby="resultado-title">
          <div className="resultado-hero-copy">
            <p className="resultado-kicker">PC Game Test Lab</p>
            <h1 id="resultado-title">Resultado do seu PC</h1>
            <p>
              Estimativa baseada em dados de referência e benchmarks públicos. O
              resultado pode variar conforme drivers, temperatura, configurações
              e otimização do sistema.
            </p>
          </div>

          <div className={`resultado-hero-panel ${statusClass}`} aria-hidden="true">
            <span>ANÁLISE LOCAL</span>
            <strong>{selectedResult.game.name}</strong>
            <small>
              {setup.resolution} · {setup.quality}
            </small>
          </div>
        </section>

        <div className="resultado-grid">
          <section
            className={`resultado-card resultado-score-card ${statusClass}`}
            aria-labelledby="resultado-score-title"
          >
            <div
              className="resultado-score-ring"
              style={getScoreRingStyle(animatedScore * 10, selectedResult.status)}
              aria-label={`Pontuação geral ${selectedResult.overallScore} de 100, status ${selectedResult.status}`}
            >
              <ResultadoScoreRingFx />
              <div className="resultado-score-ring-inner">
                <strong>{animatedScore.toFixed(1)}</strong>
                <span>/10</span>
                <small style={{ color: getScoreColor(selectedResult.status) }}>
                  {selectedResult.status.toUpperCase()}
                </small>
              </div>
            </div>

            <div className="resultado-score-copy">
              <p className="resultado-kicker">Pontuação geral</p>
              <h2 id="resultado-score-title">
                {selectedResult.status} para {setup.resolution}
              </h2>
              <p>{selectedResult.explanation}</p>

              <div className="resultado-setup-meta">
                <span>Jogo: {selectedResult.game.name}</span>
                <span>Resolução: {setup.resolution}</span>
                <span>Qualidade: {setup.quality}</span>
                <span>Qualidade sugerida: {selectedResult.idealQuality}</span>
              </div>

              <div className="resultado-trust-badges" aria-label="Indicadores de confiança">
                {confidenceBadges.map((badge) => (
                  <span key={badge}>{badge}</span>
                ))}
              </div>

              {comparisonPercent !== null && (
                <div className={`resultado-peer-comparison ${statusClass}`}>
                  <span aria-hidden="true">↗</span>
                  <strong>
                    Seu PC é melhor que {comparisonPercent}% dos testes realizados
                  </strong>
                </div>
              )}

              <div className="resultado-score-stats">
                {scoreStats.map(([label, value]) => (
                  <ScoreStat label={label} value={value} key={label} />
                ))}
              </div>
              <FpsEstimateNotice className="resultado-fps-note" />
            </div>
          </section>

          <section
            className="resultado-card resultado-components-card"
            aria-labelledby="resultado-components-title"
          >
            <div className="resultado-section-heading">
              <p className="resultado-kicker">Componentes analisados</p>
              <h2 id="resultado-components-title">Performance por peça</h2>
            </div>

            <div className="resultado-component-list">
              {selectedResult.componentScores.map(([name, value]) => (
                <ComponentBar
                  name={name}
                  value={value}
                  isAnimated={areBarsAnimated}
                  key={name}
                />
              ))}
            </div>
          </section>

          <section
            className="resultado-card resultado-fps-card"
            id="fps-estimado"
            aria-labelledby="resultado-fps-title"
          >
            <div className="resultado-section-heading">
              <p className="resultado-kicker">FPS estimado em jogos</p>
              <h2 id="resultado-fps-title">Jogos populares no seu setup</h2>
            </div>

            <div className="resultado-games-grid">
              {estimatedGames.map((game) => (
                <GameFpsCard game={game} key={game.name} />
              ))}
            </div>
            <FpsEstimateNotice className="resultado-games-fps-note" />
          </section>

          <section
            className="resultado-card resultado-bottleneck-card"
            aria-labelledby="resultado-bottleneck-title"
          >
            <div className="resultado-alert-badge">Análise</div>
            <h2 id="resultado-bottleneck-title">Gargalo detectado</h2>
            <p>{selectedResult.recommendation}</p>

            <dl className="resultado-bottleneck-list">
              <div>
                <dt>Componente limitante</dt>
                <dd>{selectedResult.bottleneck}</dd>
              </div>
              <div>
                <dt>Impacto</dt>
                <dd>{selectedResult.bottleneckImpact}</dd>
              </div>
              <div>
                <dt>Recomendação</dt>
                <dd>{selectedResult.recommendation}</dd>
              </div>
            </dl>
          </section>

          <section
            className="resultado-card resultado-upgrades-card"
            aria-labelledby="resultado-upgrades-title"
          >
            <div className="resultado-section-heading">
              <p className="resultado-kicker">Próximos passos</p>
              <h2 id="resultado-upgrades-title">Recomendações do teste</h2>
            </div>

            <div className="resultado-upgrades-grid">
              {recommendedUpgrades.map((upgrade) => (
                <UpgradeCard upgrade={upgrade} key={upgrade.name} />
              ))}
            </div>
          </section>
        </div>

        <section
          className={`resultado-methodology-card ${
            isMethodologyOpen ? 'is-open' : ''
          }`}
          aria-labelledby="resultado-methodology-title"
        >
          <div className="resultado-methodology-header">
            <span className="resultado-methodology-icon" aria-hidden="true">
              i
            </span>

            <div>
              <p className="resultado-kicker">Metodologia</p>
              <h2 id="resultado-methodology-title">
                Como calculamos este resultado?
              </h2>
            </div>

            <button
              className="resultado-methodology-toggle"
              type="button"
              onClick={() => setIsMethodologyOpen((current) => !current)}
              aria-expanded={isMethodologyOpen}
              aria-controls="resultado-methodology-content"
            >
              {isMethodologyOpen ? 'Recolher' : 'Entender cálculo'}
            </button>
          </div>

          <div
            className="resultado-methodology-content"
            id="resultado-methodology-content"
            hidden={!isMethodologyOpen}
          >
            <p>
              O PC Game Test gera uma estimativa de desempenho usando um modelo
              interno que combina scores de CPU, GPU, memória RAM e
              armazenamento com dados de referência e benchmarks públicos dos
              jogos. A GPU tem o maior peso no score, enquanto CPU, RAM e
              armazenamento ajudam a identificar gargalos e estabilidade.
            </p>
            <p>
              Também consideramos a resolução e a qualidade gráfica escolhidas,
              porque jogar em presets altos ou resoluções maiores exige mais do
              hardware. Por isso, o FPS exibido deve ser visto como uma faixa
              provável, não como uma medição exata do seu computador.
            </p>

            <div className="resultado-methodology-grid">
              <div className="resultado-methodology-item">
                <strong>Hardware</strong>
                <span>CPU, GPU, RAM e armazenamento entram no cálculo.</span>
              </div>
              <div className="resultado-methodology-item">
                <strong>Jogo</strong>
                <span>Usamos requisitos e referências de desempenho.</span>
              </div>
              <div className="resultado-methodology-item">
                <strong>Preset</strong>
                <span>Resolução e qualidade ajustam a exigência final.</span>
              </div>
              <div className="resultado-methodology-item">
                <strong>Resultado</strong>
                <span>Score, FPS e gargalo são estimativas combinadas.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="resultado-transparency-card">
          Os resultados apresentados são estimativas baseadas em benchmarks
          públicos e podem variar conforme drivers, temperatura, otimização do
          sistema e atualizações dos jogos.
        </section>

        <section className="resultado-actions" aria-label="Ações do resultado">
          <Link className="resultado-action resultado-action-primary" to="/teste">
            Refazer teste
          </Link>
          <Link className="resultado-action resultado-action-secondary" to="/comparar">
            Comparar outro PC
          </Link>
          <Link className="resultado-action resultado-action-secondary" to="/jogos">
            Ver jogos compatíveis
          </Link>
          <Link className="resultado-action resultado-action-secondary" to="/historico">
            Ver histórico
          </Link>
        </section>
        <FeedbackWidget />
      </main>

      <Footer />
      <FeedbackScrollPrompt />
    </div>
  )
}

function Resultado() {
  const [setup] = useState(getSavedSetup)
  const selectedResult = useMemo(() => {
    return setup ? calculatePcPerformance(setup, setup.selectedGame) : null
  }, [setup])

  useEffect(() => {
    if (!setup || !selectedResult) {
      return
    }

    saveResultToHistory(setup, selectedResult)
  }, [setup, selectedResult])

  if (!setup || !selectedResult) {
    return <EmptyResult />
  }

  return <ResultContent setup={setup} selectedResult={selectedResult} />
}

export default Resultado
