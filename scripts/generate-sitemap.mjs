import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const baseUrl = 'https://pc-game-test.vercel.app'
const currentDate = new Date().toISOString().slice(0, 10)
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(projectRoot, 'public')

const publicStaticRoutes = [
  '/',
  '/teste',
  '/jogos',
  '/artigos',
  '/upgrades',
  '/promocoes',
  '/como-funciona',
  '/contato',
  '/perguntas-frequentes',
  '/politica-de-privacidade',
  '/termos-de-uso',
]

const excludedRoutes = new Set([
  '/admin-feedbacks',
  '/analise',
  '/comparar',
  '/gamezone',
  '/historico',
  '/pc-roda-apex',
  '/pc-roda-forza',
  '/pc-roda-cyberpunk',
  '/pc-roda-elden',
  '/pc-roda-rdr2',
  '/ranking',
  '/resultado',
])

const articleRoutes = [
  '/artigos/como-aumentar-fps-em-jogos',
  '/artigos/atualizar-drivers-nvidia',
  '/artigos/ssd-vs-hd',
  '/artigos/melhor-placa-de-video-custo-beneficio',
  '/artigos/quanto-de-ram-precisa',
  '/artigos/otimizacao-windows-para-jogos',
]

const articleRouteSet = new Set(articleRoutes)

function readSource(relativePath) {
  return readFileSync(path.join(projectRoot, relativePath), 'utf8')
}

function normalizeRoute(route) {
  if (!route || route.includes(':')) {
    return null
  }

  const normalizedRoute = route.startsWith('/') ? route : `/${route}`

  if (normalizedRoute.length > 1 && normalizedRoute.endsWith('/')) {
    return normalizedRoute.slice(0, -1)
  }

  return normalizedRoute
}

function addRoute(routes, route) {
  const normalizedRoute = normalizeRoute(route)

  if (!normalizedRoute || excludedRoutes.has(normalizedRoute)) {
    return
  }

  routes.add(normalizedRoute)
}

function extractArticleRoutes() {
  const articlesSource = readSource('src/data/articles.js')
  const articleSlugs = new Set()

  for (const match of articlesSource.matchAll(/slug:\s*['"`]([^'"`]+)['"`]/g)) {
    articleSlugs.add(match[1])
  }

  const routes = new Set()

  for (const route of articleRoutes) {
    const slug = route.replace('/artigos/', '')

    if (articleSlugs.has(slug)) {
      addRoute(routes, route)
    }
  }

  return routes
}

function extractCanonicalGameRoutes() {
  const gamesSource = readSource('src/data/games.js')
  const routes = new Set()

  for (const match of gamesSource.matchAll(/slug:\s*['"`]([^'"`]+)['"`]/g)) {
    addRoute(routes, `/pc-roda-${match[1]}`)
  }

  return routes
}

function getPriority(route) {
  if (route === '/') {
    return '1.0'
  }

  if (articleRouteSet.has(route)) {
    return '0.7'
  }

  return '0.8'
}

function toAbsoluteUrl(route) {
  return route === '/' ? `${baseUrl}/` : `${baseUrl}${route}`
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function createSitemap(routes) {
  const urls = [...routes]
    .map((route) => {
      if (articleRouteSet.has(route)) {
        return `<url>
  <loc>${escapeXml(toAbsoluteUrl(route))}</loc>
  <changefreq>weekly</changefreq>
  <priority>${getPriority(route)}</priority>
</url>`
      }

      return `  <url>
    <loc>${escapeXml(toAbsoluteUrl(route))}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${getPriority(route)}</priority>
  </url>`
    })
    .join('\n\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls}

</urlset>
`
}

function createRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`
}

const sitemapRoutes = new Set()

for (const route of publicStaticRoutes) {
  addRoute(sitemapRoutes, route)
}

for (const route of extractCanonicalGameRoutes()) {
  addRoute(sitemapRoutes, route)
}

for (const route of extractArticleRoutes()) {
  addRoute(sitemapRoutes, route)
}

mkdirSync(publicDir, { recursive: true })
writeFileSync(path.join(publicDir, 'sitemap.xml'), createSitemap(sitemapRoutes))
writeFileSync(path.join(publicDir, 'robots.txt'), createRobotsTxt())

console.info(`Generated sitemap.xml with ${sitemapRoutes.size} URLs.`)
console.info('Generated robots.txt with Sitemap directive.')
