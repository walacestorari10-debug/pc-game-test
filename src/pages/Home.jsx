import { useEffect, useState } from 'react'
import AdBanner from '../components/AdBanner'
import ArticlesSection from '../components/ArticlesSection'
import Footer from '../components/Footer'
import GameDealsSection from '../components/GameDealsSection'
import GamePerformanceSection from '../components/GamePerformanceSection'
import GeneralPerformance from '../components/GeneralPerformance'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import PerformanceSummary from '../components/PerformanceSummary'
import RankingSection from '../components/RankingSection'
import RecommendedUpgrades from '../components/RecommendedUpgrades'
import SEOHead from '../components/SEOHead'
import Sidebar from '../components/Sidebar'
import { calculatePcPerformance } from '../utils/performanceEngine'
import { subscribePcGameTestUpdated } from '../utils/storageEvents'
import '../styles/home.css'

const setupStorageKey = 'pcGameTestSetup'
const historyStorageKey = 'pcGameTestHistory'
const requiredSetupKeys = [
  'cpu',
  'gpu',
  'ram',
  'storage',
  'resolution',
  'quality',
]

function readStorageItem(key, fallback = null) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

function getSourceTime(source) {
  if (!source) {
    return 0
  }

  const createdAtTime = source.createdAt ? new Date(source.createdAt).getTime() : 0
  const idTime = Number(source.id) || 0
  const testIdTime = Number(source.testId) || 0

  return Math.max(createdAtTime || 0, idTime, testIdTime)
}

function getLatestHistoryItem() {
  const history = readStorageItem(historyStorageKey, [])

  if (!Array.isArray(history) || history.length === 0) {
    return null
  }

  return [...history].sort((current, next) => {
    return getSourceTime(next) - getSourceTime(current)
  })[0]
}

function buildSetupFromHistoryItem(historyItem) {
  if (!historyItem) {
    return null
  }

  const setup = {
    selectedGame: historyItem.gameSlug || 'warzone',
    cpu: historyItem.cpu,
    gpu: historyItem.gpu,
    ram: historyItem.ram,
    storage: historyItem.storage,
    resolution: historyItem.resolution,
    quality: historyItem.quality,
  }

  return requiredSetupKeys.every((key) => Boolean(setup[key])) ? setup : null
}

function getLatestSetup() {
  const savedSetup = readStorageItem(setupStorageKey)
  const historyItem = getLatestHistoryItem()
  const setupFromHistory = buildSetupFromHistoryItem(historyItem)
  const savedSetupTime = getSourceTime(savedSetup)
  const historyTime = getSourceTime(historyItem)

  if (setupFromHistory && historyTime >= savedSetupTime) {
    return setupFromHistory
  }

  if (savedSetup && requiredSetupKeys.every((key) => Boolean(savedSetup[key]))) {
    return savedSetup
  }

  return setupFromHistory
}

function getLastSetupResult() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const setup = getLatestSetup()

    if (!setup) {
      return null
    }

    const gameSlug = setup.selectedGame || 'warzone'

    return {
      setup,
      result: calculatePcPerformance(setup, gameSlug),
    }
  } catch {
    return null
  }
}

function Home() {
  const [lastSetupResult, setLastSetupResult] = useState(getLastSetupResult)

  useEffect(() => {
    const refreshLastSetupResult = () => {
      setLastSetupResult(getLastSetupResult())
    }

    refreshLastSetupResult()

    return subscribePcGameTestUpdated(refreshLastSetupResult)
  }, [])

  return (
    <div className="home-page">
      <SEOHead
        title="PC Game Test | Veja se seu PC roda jogos"
        description="Teste seu PC gamer, veja FPS estimado, gargalos, recomendações de upgrade e descubra se seu setup roda os principais jogos."
        canonicalPath="/"
      />
      <Header />

      <div className="home-shell">
        <Sidebar setupResult={lastSetupResult} />

        <main className="home-main">
          <HeroSection />

          <section className="dashboard-grid top-grid" aria-label="Resumo do dashboard">
            <PerformanceSummary setupResult={lastSetupResult} />
            <GeneralPerformance setupResult={lastSetupResult} />
          </section>

          <GamePerformanceSection setupResult={lastSetupResult} />

          <section className="dashboard-grid middle-grid" aria-label="Upgrades e promoções">
            <RecommendedUpgrades setupResult={lastSetupResult} />
            <GameDealsSection />
          </section>

          <section className="dashboard-grid lower-grid" aria-label="Conteudo e ranking">
            <ArticlesSection />
            <AdBanner />
            <RankingSection />
          </section>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default Home
