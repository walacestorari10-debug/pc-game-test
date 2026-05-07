import { Analytics } from '@vercel/analytics/react'
import { useLayoutEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import AnaliseLoading from './pages/AnaliseLoading'
import ArticlePage from './pages/ArticlePage'
import Artigos from './pages/Artigos'
import Comparar from './pages/Comparar'
import Home from './pages/Home'
import Historico from './pages/Historico'
import InfoPage from './pages/InfoPage'
import GamePage from './pages/GamePage'
import Jogos from './pages/Jogos'
import OtimizacaoOnline from './pages/OtimizacaoOnline'
import Promocoes from './pages/Promocoes'
import Ranking from './pages/Ranking'
import Resultado from './pages/Resultado'
import TestePc from './pages/TestePc'
import Upgrades from './pages/Upgrades'
import { staticPages } from './data/staticPages'

const gameRoutes = [
  '/gamezone',
  '/pc-roda-warzone',
  '/pc-roda-fortnite',
  '/pc-roda-cyberpunk-2077',
  '/pc-roda-cs2',
  '/pc-roda-apex-legends',
  '/pc-roda-forza-horizon-5',
  '/pc-roda-elden-ring',
  '/pc-roda-red-dead-redemption-2',
  '/pc-roda-apex',
  '/pc-roda-forza',
  '/pc-roda-cyberpunk',
  '/pc-roda-elden',
  '/pc-roda-rdr2',
]

function ScrollToTop() {
  const { pathname, search } = useLocation()

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useLayoutEffect(() => {
    const root = document.documentElement
    const body = document.body
    const previousRootScrollBehavior = root.style.scrollBehavior
    const previousBodyScrollBehavior = body.style.scrollBehavior

    root.style.scrollBehavior = 'auto'
    body.style.scrollBehavior = 'auto'
    root.scrollTop = 0
    body.scrollTop = 0
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    const frame = window.requestAnimationFrame(() => {
      root.style.scrollBehavior = previousRootScrollBehavior
      body.style.scrollBehavior = previousBodyScrollBehavior
    })

    return () => {
      window.cancelAnimationFrame(frame)
      root.style.scrollBehavior = previousRootScrollBehavior
      body.style.scrollBehavior = previousBodyScrollBehavior
    }
  }, [pathname, search])

  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teste" element={<TestePc />} />
        <Route path="/analise" element={<AnaliseLoading />} />
        <Route path="/artigos" element={<Artigos />} />
        <Route path="/artigos/:slug" element={<ArticlePage />} />
        <Route path="/comparar" element={<Comparar />} />
        <Route path="/resultado" element={<Resultado />} />
        <Route path="/historico" element={<Historico />} />
        <Route path="/jogos" element={<Jogos />} />
        <Route path="/otimizacao-online" element={<OtimizacaoOnline />} />
        <Route path="/promocoes" element={<Promocoes />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/upgrades" element={<Upgrades />} />
        {staticPages.map((page) => (
          <Route path={page.path} element={<InfoPage page={page} />} key={page.path} />
        ))}
        {gameRoutes.map((path) => (
          <Route path={path} element={<GamePage />} key={path} />
        ))}
      </Routes>
      <Analytics />
    </>
  )
}

export default App
