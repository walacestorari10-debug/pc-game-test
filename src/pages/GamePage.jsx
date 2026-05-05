import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AffiliateButton from '../components/AffiliateButton'
import FeedbackWidget from '../components/FeedbackWidget'
import Footer from '../components/Footer'
import Header from '../components/Header'
import SEOHead from '../components/SEOHead'
import { withAmazonAffiliateLinks } from '../data/affiliateLinks'
import { games, getGameBySlug } from '../data/games'
import { getUpgradeRecommendations } from '../data/upgradeRecommendations'
import { calculatePcPerformance } from '../utils/performanceEngine'
import {
  notifyPcGameTestUpdated,
  subscribePcGameTestUpdated,
} from '../utils/storageEvents'
import apexImage from '../assets/images/thumbnails/apexlegends-card.webp'
import cs2Image from '../assets/images/thumbnails/cs2-card.webp'
import cyberpunkImage from '../assets/images/thumbnails/cyberpunk-card.webp'
import eldenRingImage from '../assets/images/thumbnails/eldenring-card.webp'
import forzaImage from '../assets/images/thumbnails/forza-card.webp'
import fortniteImage from '../assets/images/thumbnails/fortnite-card.webp'
import redDeadImage from '../assets/images/thumbnails/reddead2-card.webp'
import warzoneImage from '../assets/images/thumbnails/warzone-card.webp'
import '../styles/gamePage.css'

const setupStorageKey = 'pcGameTestSetup'
const requiredSetupKeys = ['cpu', 'gpu', 'ram', 'storage', 'resolution', 'quality']

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

const referenceFpsMultipliers = [
  ['Baixa', 1.2],
  ['Média', 1.05],
  ['Alta', 1],
  ['Ultra', 0.75],
]

const genericUpgradeRecommendations = {
  leve: [
    {
      name: 'CPU moderno de 6 núcleos',
      type: 'CPU',
      expectedGain: 'FPS competitivo',
      description:
        'Ajuda a manter taxas altas e reduzir quedas em jogos focados em 144Hz.',
    },
    {
      name: '16GB de RAM',
      type: 'RAM',
      expectedGain: 'Mais folga',
      description:
        'Evita travamentos em partidas, navegador aberto e apps em segundo plano.',
    },
    {
      name: 'SSD NVMe',
      type: 'Storage',
      expectedGain: 'Carregamento rápido',
      description:
        'Melhora abertura do jogo, mapas e resposta geral do sistema.',
    },
  ],
  medio: [
    {
      name: 'RTX 3060 ou RX 6600',
      type: 'GPU',
      expectedGain: '1080p alto',
      description:
        'Boa base para presets altos com estabilidade em jogos populares.',
    },
    {
      name: '16GB de RAM',
      type: 'RAM',
      expectedGain: 'Estabilidade',
      description:
        'Recomendado para battle royales, multitarefa e texturas atuais.',
    },
    {
      name: 'SSD 1TB',
      type: 'Storage',
      expectedGain: 'Menos engasgos',
      description:
        'Ajuda em carregamentos e evita gargalos de disco em jogos maiores.',
    },
  ],
  pesado: [
    {
      name: 'RTX 4060 ou RX 6700 XT',
      affiliateKey: 'RTX 4060',
      type: 'GPU',
      expectedGain: 'Presets altos',
      description:
        'Priorize placa de vídeo para ganhar FPS e manter qualidade visual.',
    },
    {
      name: '32GB de RAM',
      type: 'RAM',
      expectedGain: 'Mais margem',
      description:
        'Dá folga para mundo aberto, texturas altas e apps em segundo plano.',
    },
    {
      name: 'SSD NVMe 1TB',
      type: 'Storage',
      expectedGain: 'Fluxo estável',
      description:
        'Reduz travamentos de streaming de cenário e melhora carregamentos.',
    },
  ],
  muito_pesado: [
    {
      name: 'RTX 4070 ou superior',
      type: 'GPU',
      expectedGain: 'Alta qualidade',
      description:
        'Indicado para jogos muito pesados, ray tracing e 1440p com mais folga.',
    },
    {
      name: 'Ryzen 5 5600 / i5-12400F',
      affiliateKey: 'AMD Ryzen 5 5600',
      type: 'CPU',
      expectedGain: 'Menos quedas',
      description:
        'Ajuda a manter estabilidade em cidades densas, física e muitas entidades.',
    },
    {
      name: '32GB de RAM + SSD NVMe',
      type: 'RAM',
      expectedGain: 'Base atual',
      description:
        'Combinação recomendada para texturas pesadas e carregamento contínuo.',
    },
  ],
}

function getSlugFromPath(pathname) {
  const cleanPath = pathname.replace(/\/$/, '')

  if (cleanPath === '/gamezone') {
    return 'warzone'
  }

  return cleanPath.replace(/^\/pc-roda-/, '') || 'warzone'
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

function getReferenceFpsRows(game) {
  return referenceFpsMultipliers.map(([preset, multiplier]) => ({
    preset,
    value: Math.round(game.fpsBase1080p * multiplier),
    label: `${Math.round(game.fpsBase1080p * multiplier)} FPS`,
  }))
}

function getCalculatedFpsRows(result, setup, game) {
  return [
    {
      preset: `${setup.resolution} ${setup.quality}`,
      value: result.averageFps,
      label: `${result.fpsRange.min}-${result.fpsRange.max} FPS`,
    },
    {
      preset: 'FPS médio calculado',
      value: result.averageFps,
      label: `${result.averageFps} FPS`,
    },
    {
      preset: 'Meta recomendada',
      value: game.recommendedFps,
      label: `${game.recommendedFps} FPS`,
    },
  ]
}

function getRelatedGames(currentGame) {
  const sameCategory = games.filter(
    (game) => game.slug !== currentGame.slug && game.category === currentGame.category,
  )
  const otherGames = games.filter(
    (game) => game.slug !== currentGame.slug && game.category !== currentGame.category,
  )

  return [...sameCategory, ...otherGames].slice(0, 4)
}

function getGenericUpgrades(game) {
  return withAmazonAffiliateLinks(
    genericUpgradeRecommendations[game.demandLevel] ??
      genericUpgradeRecommendations.medio,
  )
}

function syncResultGame(setup, gameSlug) {
  if (typeof window === 'undefined' || !setup) {
    return
  }

  try {
    localStorage.setItem(
      setupStorageKey,
      JSON.stringify({
        ...setup,
        selectedGame: gameSlug,
      }),
    )
    notifyPcGameTestUpdated()
  } catch {
    // The link still works if storage is unavailable.
  }
}

function RequirementColumn({ title, requirements }) {
  return (
    <article className="game-requirement-box">
      <h3>{title}</h3>
      <dl>
        {Object.entries(requirements).map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </article>
  )
}

function FpsRow({ preset, label, value, maxFps }) {
  const width = Math.min(Math.max(Math.round((value / maxFps) * 100), 8), 100)

  return (
    <div className="game-fps-row">
      <div className="game-fps-label">
        <span>{preset}</span>
        <strong>{label}</strong>
      </div>
      <div className="game-fps-track" aria-hidden="true">
        <span style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}

function UpgradeCard({ upgrade }) {
  return (
    <article className="game-upgrade-option">
      <div>
        <span>{upgrade.type}</span>
        <strong>{upgrade.expectedGain}</strong>
      </div>
      <h3>{upgrade.name}</h3>
      <p>{upgrade.description}</p>
      <AffiliateButton
        className="game-upgrade-price-button"
        isAffiliatePending={upgrade.isAffiliatePending ?? true}
        link={upgrade.link ?? '#'}
      />
    </article>
  )
}

function RelatedGameCard({ game }) {
  return (
    <Link
      className={`related-game-card fallback-${game.visualKey}`}
      to={`/pc-roda-${game.slug}`}
      aria-label={`Ver análise de ${game.name}`}
    >
      {imageBySlug[game.slug] && (
        <img src={imageBySlug[game.slug]} alt="" loading="lazy" />
      )}
      <div className="related-game-content">
        <h3>PC roda {game.name}?</h3>
        <span>Ver análise</span>
      </div>
    </Link>
  )
}

function HeroDecorations({ heroClassName }) {
  if (heroClassName === 'warzone-hero') {
    return (
      <>
        <span className="warzone-scan warzone-scan-one" aria-hidden="true" />
        <span className="warzone-scan warzone-scan-two" aria-hidden="true" />
        <span className="warzone-radar" aria-hidden="true" />
        <span className="warzone-grid" aria-hidden="true" />
      </>
    )
  }

  if (heroClassName === 'forza-hero') {
    return (
      <>
        <span className="forza-road" aria-hidden="true" />
        <span className="forza-light forza-light-red" aria-hidden="true" />
        <span className="forza-light forza-light-blue" aria-hidden="true" />
        <span className="forza-speed-line forza-speed-line-one" aria-hidden="true" />
        <span className="forza-speed-line forza-speed-line-two" aria-hidden="true" />
        <span className="forza-speed-line forza-speed-line-three" aria-hidden="true" />
      </>
    )
  }

  if (heroClassName === 'fortnite-hero') {
    return (
      <>
        <span className="fortnite-glow fortnite-glow-cyan" aria-hidden="true" />
        <span className="fortnite-glow fortnite-glow-pink" aria-hidden="true" />
        <span className="fortnite-shape fortnite-shape-diamond" aria-hidden="true" />
        <span className="fortnite-shape fortnite-shape-circle" aria-hidden="true" />
        <span className="fortnite-shape fortnite-shape-bolt" aria-hidden="true" />
      </>
    )
  }

  if (heroClassName === 'cyberpunk-hero') {
    return (
      <>
        <span className="cyberpunk-grid" aria-hidden="true" />
        <span className="cyberpunk-glow cyberpunk-glow-yellow" aria-hidden="true" />
        <span className="cyberpunk-glow cyberpunk-glow-cyan" aria-hidden="true" />
        <span className="cyberpunk-line cyberpunk-line-one" aria-hidden="true" />
        <span className="cyberpunk-line cyberpunk-line-two" aria-hidden="true" />
        <span className="cyberpunk-line cyberpunk-line-three" aria-hidden="true" />
      </>
    )
  }

  if (heroClassName === 'cs2-hero') {
    return (
      <>
        <span className="cs2-smoke cs2-smoke-purple" aria-hidden="true" />
        <span className="cs2-smoke cs2-smoke-blue" aria-hidden="true" />
        <span className="cs2-crosshair" aria-hidden="true" />
        <span className="cs2-line cs2-line-one" aria-hidden="true" />
        <span className="cs2-line cs2-line-two" aria-hidden="true" />
        <span className="cs2-line cs2-line-three" aria-hidden="true" />
      </>
    )
  }

  if (heroClassName === 'apex-hero') {
    return (
      <>
        <span className="apex-glow apex-glow-orange" aria-hidden="true" />
        <span className="apex-glow apex-glow-red" aria-hidden="true" />
        <span className="apex-energy" aria-hidden="true" />
        <span className="apex-triangle apex-triangle-one" aria-hidden="true" />
        <span className="apex-triangle apex-triangle-two" aria-hidden="true" />
        <span className="apex-triangle apex-triangle-three" aria-hidden="true" />
        <span className="apex-line apex-line-one" aria-hidden="true" />
        <span className="apex-line apex-line-two" aria-hidden="true" />
      </>
    )
  }

  if (heroClassName === 'elden-hero') {
    return (
      <>
        <span className="elden-ring-glow" aria-hidden="true" />
        <span className="elden-rune elden-rune-one" aria-hidden="true" />
        <span className="elden-rune elden-rune-two" aria-hidden="true" />
        <span className="elden-ray elden-ray-one" aria-hidden="true" />
        <span className="elden-ray elden-ray-two" aria-hidden="true" />
      </>
    )
  }

  if (heroClassName === 'rdr2-hero') {
    return (
      <>
        <span className="rdr2-sun" aria-hidden="true" />
        <span className="rdr2-dust rdr2-dust-one" aria-hidden="true" />
        <span className="rdr2-dust rdr2-dust-two" aria-hidden="true" />
        <span className="rdr2-horizon" aria-hidden="true" />
        <span className="rdr2-slash" aria-hidden="true" />
      </>
    )
  }

  return null
}

function GamePage() {
  const { pathname } = useLocation()
  const routeSlug = getSlugFromPath(pathname)
  const game = getGameBySlug(routeSlug)
  const [savedSetup, setSavedSetup] = useState(readSavedSetup)
  const result = useMemo(() => {
    if (!savedSetup) {
      return null
    }

    try {
      return calculatePcPerformance(savedSetup, game.slug)
    } catch {
      return null
    }
  }, [game.slug, savedSetup])
  const hasSetupResult = Boolean(savedSetup && result)
  const fpsRows = hasSetupResult
    ? getCalculatedFpsRows(result, savedSetup, game)
    : getReferenceFpsRows(game)
  const maxFps = Math.max(...fpsRows.map((row) => row.value), 1)
  const relatedGames = getRelatedGames(game)
  const upgradeRecommendations = hasSetupResult
    ? getUpgradeRecommendations(result.bottleneck, savedSetup, result)
    : getGenericUpgrades(game)
  const heroClassName = ['game-hero', game.heroClassName].filter(Boolean).join(' ')
  const seoTitle = `PC roda ${game.name}? Veja FPS e requisitos | PC Game Test`
  const seoDescription = `Descubra se seu PC roda ${game.name}. Veja requisitos, FPS estimado, gargalos e recomendações para melhorar desempenho.`
  const canonicalPath = `/pc-roda-${game.slug}`
  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: seoTitle,
      description: seoDescription,
      author: {
        '@type': 'Organization',
        name: 'PC Game Test',
      },
      publisher: {
        '@type': 'Organization',
        name: 'PC Game Test',
      },
      mainEntityOfPage: canonicalPath,
    }),
    [canonicalPath, seoDescription, seoTitle],
  )

  useEffect(() => {
    const refreshSavedSetup = () => setSavedSetup(readSavedSetup())

    refreshSavedSetup()

    const unsubscribe = subscribePcGameTestUpdated(refreshSavedSetup)
    window.addEventListener('focus', refreshSavedSetup)

    return () => {
      unsubscribe()
      window.removeEventListener('focus', refreshSavedSetup)
    }
  }, [pathname])

  return (
    <div className="game-page">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonicalPath={canonicalPath}
        structuredData={structuredData}
      />
      <Header />

      <main>
        <section className={heroClassName} aria-labelledby="game-title">
          <HeroDecorations heroClassName={game.heroClassName} />

          <div className="game-hero-content">
            <nav className="game-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>Jogos</span>
              <span>{game.name}</span>
            </nav>

            <p className="game-kicker">PC Game Test</p>
            <h1 id="game-title">PC roda {game.name}?</h1>
            <p>
              Veja requisitos, FPS estimado e uma leitura realista para o seu PC
              quando houver um setup salvo.
            </p>

            <div className="game-hero-meta" aria-label="Dados principais do jogo">
              <span>{game.category}</span>
              <span>Exigência: {game.demandLabel}</span>
              <span>FPS base: {game.fpsBase1080p}</span>
            </div>

            <div className="game-hero-badges" aria-label="Destaques do jogo">
              {game.badges.map((badge) => (
                <span key={badge}>{badge}</span>
              ))}
            </div>

            <Link className="game-primary-button" to="/teste">
              {hasSetupResult ? 'ATUALIZAR MEU PC' : 'TESTAR MEU PC'}
            </Link>
          </div>
        </section>

        <div className="game-page-shell">
          <section
            className={`game-card game-setup-result-card ${
              hasSetupResult ? 'has-result' : 'is-empty'
            }`}
            aria-labelledby="game-setup-title"
          >
            {hasSetupResult ? (
              <>
                <div>
                  <p className="game-kicker">Seu setup salvo</p>
                  <h2 id="game-setup-title">
                    Com base no seu PC, você roda {game.name} em aproximadamente{' '}
                    {result.fpsRange.min}-{result.fpsRange.max} FPS.
                  </h2>
                  <p>
                    A estimativa usa o último setup salvo e recalcula o resultado
                    especificamente para este jogo.
                  </p>
                </div>

                <dl className="game-setup-metrics">
                  <div>
                    <dt>Status</dt>
                    <dd>{result.status}</dd>
                  </div>
                  <div>
                    <dt>Gargalo</dt>
                    <dd>{result.bottleneck}</dd>
                  </div>
                  <div>
                    <dt>Qualidade ideal</dt>
                    <dd>{result.idealQuality}</dd>
                  </div>
                  <div>
                    <dt>Recomendação</dt>
                    <dd>{result.recommendation}</dd>
                  </div>
                </dl>

                <Link
                  className="game-primary-button game-result-button"
                  to="/resultado"
                  onClick={() => syncResultGame(savedSetup, game.slug)}
                >
                  Ver resultado completo
                </Link>
              </>
            ) : (
              <>
                <div>
                  <p className="game-kicker">Análise personalizada</p>
                  <h2 id="game-setup-title">Ainda não sabemos seu setup.</h2>
                  <p>Faça um teste para ver seu desempenho realista neste jogo.</p>
                </div>

                <Link className="game-primary-button game-result-button" to="/teste">
                  Testar meu PC
                </Link>
              </>
            )}
          </section>

          <section
            className="game-card game-requirements-card"
            aria-labelledby="requirements-title"
          >
            <div className="game-section-heading">
              <p className="game-kicker">Requisitos do jogo</p>
              <h2 id="requirements-title">Configurações para rodar {game.name}</h2>
            </div>

            <div className="game-requirements-grid">
              <RequirementColumn
                title="Requisitos mínimos"
                requirements={game.requirements.minimum}
              />
              <RequirementColumn
                title="Requisitos recomendados"
                requirements={game.requirements.recommended}
              />
            </div>
          </section>

          <section className="game-card game-fps-card" aria-labelledby="fps-title">
            <div className="game-section-heading">
              <p className="game-kicker">
                {hasSetupResult ? 'FPS calculado' : 'FPS de referência'}
              </p>
              <h2 id="fps-title">
                {hasSetupResult
                  ? `Estimativa em ${savedSetup.resolution}`
                  : 'Estimativa genérica em 1080p'}
              </h2>
            </div>

            <div className="game-fps-list">
              {fpsRows.map((row) => (
                <FpsRow
                  preset={row.preset}
                  label={row.label}
                  value={row.value}
                  maxFps={maxFps}
                  key={row.preset}
                />
              ))}
            </div>

            <p className="game-reference-note">
              {hasSetupResult
                ? `Preset analisado: ${savedSetup.quality}. Qualidade ideal sugerida: ${result.idealQuality}.`
                : `Valor base de referência: ${game.fpsBase1080p} FPS em 1080p.`}
            </p>
          </section>

          <section
            className="game-card game-performance-card"
            aria-labelledby="performance-title"
          >
            <div className="game-status-pill">
              {hasSetupResult ? result.status : game.demandLabel}
            </div>
            <h2 id="performance-title">Desempenho geral</h2>
            <p>
              {hasSetupResult
                ? `${game.name} deve ficar ${result.status.toLowerCase()} em ${savedSetup.resolution} com qualidade ${savedSetup.quality}.`
                : `${game.name} é um jogo de exigência ${game.demandLabel.toLowerCase()}, com referência de ${game.fpsBase1080p} FPS em 1080p.`}
            </p>
          </section>

          <section
            className="game-card game-bottleneck-card"
            aria-labelledby="bottleneck-title"
          >
            <div className="game-alert-pill">
              {hasSetupResult ? 'Gargalo' : 'Variação'}
            </div>
            <h2 id="bottleneck-title">Ponto de atenção</h2>
            <p>
              {hasSetupResult
                ? result.recommendation
                : 'O desempenho pode variar conforme CPU, GPU, RAM e armazenamento.'}
            </p>

            {hasSetupResult && (
              <dl>
                <div>
                  <dt>Componente</dt>
                  <dd>{result.bottleneck}</dd>
                </div>
                <div>
                  <dt>Impacto</dt>
                  <dd>{result.bottleneckImpact}</dd>
                </div>
              </dl>
            )}
          </section>

          <section
            className="game-card game-upgrade-card"
            aria-labelledby="upgrade-title"
          >
            <p className="game-kicker">
              {hasSetupResult ? 'Upgrade recomendado' : 'Sugestões gerais'}
            </p>
            <h2 id="upgrade-title">
              {hasSetupResult
                ? 'Próximos upgrades para este gargalo'
                : `Sugestões para jogos ${game.demandLabel.toLowerCase()}`}
            </h2>

            <div className="game-upgrade-list">
              {upgradeRecommendations.slice(0, 3).map((upgrade) => (
                <UpgradeCard upgrade={upgrade} key={upgrade.name} />
              ))}
            </div>
          </section>

          <section className="game-transparency-note">
            Estimativa baseada em dados de referência. O desempenho real pode variar
            conforme drivers, temperatura, configurações e atualizações do jogo.
          </section>
        </div>

        <section className="related-games-section" aria-labelledby="related-title">
          <div className="game-section-heading">
            <p className="game-kicker">Jogos relacionados</p>
            <h2 id="related-title">Veja outras análises</h2>
          </div>

          <div className="related-games-grid">
            {relatedGames.map((relatedGame) => (
              <RelatedGameCard game={relatedGame} key={relatedGame.slug} />
            ))}
          </div>
        </section>

        <FeedbackWidget />
      </main>

      <Footer />
    </div>
  )
}

export default GamePage
