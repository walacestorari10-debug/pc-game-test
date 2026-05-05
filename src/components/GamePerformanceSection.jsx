import { Link } from 'react-router-dom'
import apexImage from '../assets/images/thumbnails/apexlegends-card.webp'
import cs2Image from '../assets/images/thumbnails/cs2-card.webp'
import cyberpunkImage from '../assets/images/thumbnails/cyberpunk-card.webp'
import forzaImage from '../assets/images/thumbnails/forza-card.webp'
import fortniteImage from '../assets/images/thumbnails/fortnite-card.webp'
import warzoneImage from '../assets/images/thumbnails/warzone-card.webp'
import { calculatePcPerformance } from '../utils/performanceEngine'

const featuredGames = [
  {
    ariaLabel: 'Ver análise de Warzone',
    fps: 95,
    settings: '1080p | Alta',
    status: 'Ótimo',
    name: 'Warzone',
    gameSlug: 'warzone',
    slug: 'warzone',
    href: '/pc-roda-warzone',
    cover: warzoneImage,
  },
  {
    ariaLabel: 'Ver análise de Fortnite',
    fps: 120,
    settings: '1080p | Alta',
    status: 'Ótimo',
    name: 'Fortnite',
    gameSlug: 'fortnite',
    slug: 'fortnite',
    href: '/pc-roda-fortnite',
    cover: fortniteImage,
  },
  {
    ariaLabel: 'Ver análise de CS2',
    fps: 112,
    settings: '1080p | Alta',
    status: 'Ótimo',
    name: 'CS2',
    gameSlug: 'cs2',
    slug: 'cs2',
    href: '/pc-roda-cs2',
    cover: cs2Image,
  },
  {
    ariaLabel: 'Ver análise de Cyberpunk 2077',
    fps: 64,
    settings: '1080p | Alta',
    status: 'Jogável',
    name: 'Cyberpunk 2077',
    gameSlug: 'cyberpunk-2077',
    slug: 'cyberpunk',
    href: '/pc-roda-cyberpunk-2077',
    cover: cyberpunkImage,
  },
  {
    ariaLabel: 'Ver análise de Apex Legends',
    fps: 118,
    settings: '1080p | Alta',
    status: 'Ótimo',
    name: 'Apex Legends',
    gameSlug: 'apex-legends',
    slug: 'apex',
    href: '/pc-roda-apex-legends',
    cover: apexImage,
  },
  {
    ariaLabel: 'Ver análise de Forza Horizon 5',
    fps: 87,
    settings: '1080p | Alta',
    status: 'Ótimo',
    name: 'Forza Horizon 5',
    gameSlug: 'forza-horizon-5',
    slug: 'forza',
    href: '/pc-roda-forza-horizon-5',
    cover: forzaImage,
  },
]

function getStatusClass(status) {
  if (status === 'Ótimo') {
    return 'status-good'
  }

  if (status === 'Jogável') {
    return 'status-playable'
  }

  return 'status-low'
}

function getDisplayGame(game, setupResult) {
  const setup = setupResult?.setup

  if (!setup) {
    return game
  }

  try {
    const result = calculatePcPerformance(setup, game.gameSlug)

    return {
      ...game,
      ariaLabel: `Ver análise personalizada de ${game.name}`,
      fps: result.averageFps,
      settings: `${setup.resolution} | ${result.idealQuality}`,
      status: result.status,
    }
  } catch {
    return game
  }
}

function GameCard({ game }) {
  return (
    <Link className="game-performance-card" to={game.href} aria-label={game.ariaLabel}>
      <div className={`game-cover cover-${game.slug}`}>
        <img src={game.cover} alt="" loading="lazy" />
      </div>
      <div className="game-card-info">
        <small>{game.settings}</small>
        <strong>{game.fps}</strong>
        <span>FPS</span>
        <em className={getStatusClass(game.status)}>{game.status}</em>
      </div>
    </Link>
  )
}

function GamePerformanceSection({ setupResult }) {
  const games = featuredGames.map((game) => getDisplayGame(game, setupResult))

  return (
    <section className="dashboard-card game-performance-section" id="games">
      <div className="section-heading">
        <div>
          <h2>Desempenho em Jogos</h2>
          {setupResult && (
            <p className="game-performance-context">
              FPS recalculado com seu último setup salvo
            </p>
          )}
        </div>
        <Link to="/jogos">Ver todos</Link>
      </div>
      <div className="game-scroller">
        {games.map((game) => (
          <GameCard game={game} key={game.slug} />
        ))}
      </div>
    </section>
  )
}

export default GamePerformanceSection
