import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(projectRoot, 'dist')
const assetsDir = path.join(distDir, 'assets')
const socialMetaStart = '<!-- pcgt-social-meta-start -->'
const socialMetaEnd = '<!-- pcgt-social-meta-end -->'
const siteUrl = normalizeSiteUrl(
  process.env.VITE_SITE_URL || 'https://pc-game-test.vercel.app',
)
const defaultImage = '/og-image.png'
const defaultTitle =
  'Teste de PC Gamer Online | Descubra FPS, Desempenho e Configuração'
const defaultOgTitle = 'Teste de PC Gamer Online | Veja FPS e Desempenho'
const defaultDescription =
  'Teste seu PC gamer online, descubra o desempenho em jogos, veja estimativa de FPS e compare sua configuração para melhorar sua experiência gamer.'
const defaultOgDescription =
  'Descubra o desempenho do seu PC gamer, veja estimativa de FPS e compare sua configuração com jogos populares.'
const defaultImageAlt = 'PC Game Test - teste de PC gamer online'

const articleRoutes = [
  {
    path: '/artigos/como-reduzir-ping-em-jogos',
    title: 'Como reduzir ping em jogos online | PC Game Test',
    description:
      'Veja dicas reais para reduzir ping, melhorar estabilidade e diminuir lag em jogos online competitivos.',
    image: 'reduzir.webp',
    imageAlt: 'Como reduzir ping em jogos online',
  },
  {
    path: '/artigos/vpn-gamer-reduz-lag',
    title: 'VPN gamer reduz lag? Entenda quando ajuda | PC Game Test',
    description:
      'Entenda quando VPN gamer pode melhorar estabilidade, rota e conexão em jogos online.',
    image: 'vpn.webp',
    imageAlt: 'VPN gamer reduz lag?',
  },
  {
    path: '/artigos/melhorar-estabilidade-internet-jogos',
    title: 'Como melhorar estabilidade da internet para jogar | PC Game Test',
    description:
      'Veja como melhorar estabilidade, reduzir perdas de conexão e evitar travamentos em jogos online.',
    image: 'estabilidade.webp',
    imageAlt: 'Como melhorar estabilidade da internet para jogos',
  },
  {
    path: '/artigos/como-aumentar-fps-em-jogos',
    title: 'Como aumentar FPS em jogos | PC Game Test',
    description:
      'Ajustes práticos para ganhar FPS, reduzir quedas e deixar seus jogos mais estáveis sem precisar trocar peças imediatamente.',
    image: 'soldado.webp',
    imageAlt: 'Como aumentar FPS em jogos',
  },
  {
    path: '/artigos/melhor-placa-de-video-custo-beneficio',
    title: 'Melhor placa de vídeo custo-benefício em 2026 | PC Game Test',
    description:
      'Entenda como escolher uma GPU equilibrada para 1080p, 1440p, consumo de energia, VRAM e vida útil do seu setup.',
    image: 'gpu.webp',
    imageAlt: 'Melhor placa de vídeo custo-benefício em 2026',
  },
  {
    path: '/artigos/quanto-de-ram-precisa',
    title: 'Quanto de RAM você realmente precisa? | PC Game Test',
    description:
      'Veja quando 8GB ainda serve, por que 16GB virou o ponto ideal e quando 32GB fazem sentido para jogos e multitarefa.',
    image: 'ram.webp',
    imageAlt: 'Quanto de RAM você realmente precisa?',
  },
  {
    path: '/artigos/otimizacao-windows-para-jogos',
    title: 'Otimização do Windows para jogos | PC Game Test',
    description:
      'Configurações essenciais no Windows para reduzir processos inúteis, melhorar estabilidade e preparar o sistema para jogar.',
    image: 'otmizacao.webp',
    imageAlt: 'Otimização do Windows para jogos',
  },
  {
    path: '/artigos/ssd-vs-hd',
    title: 'SSD vs HD: qual vale mais a pena em 2026? | PC Game Test',
    description:
      'Comparativo direto entre SSD e HD para sistema operacional, jogos grandes, carregamentos, NVMe e custo-benefício.',
    image: 'ssd.webp',
    imageAlt: 'SSD vs HD',
  },
  {
    path: '/artigos/atualizar-drivers-nvidia',
    title: 'Como atualizar drivers NVIDIA corretamente | PC Game Test',
    description:
      'Aprenda quando atualizar drivers NVIDIA, a diferença entre Game Ready e Studio Driver e como fazer instalação limpa com segurança.',
    image: 'nvidia.webp',
    imageAlt: 'Como atualizar drivers NVIDIA corretamente',
  },
].map((route) => ({ ...route, type: 'article' }))

const gameRoutes = [
  {
    slug: 'warzone',
    name: 'Warzone',
    image: 'warzone-card.webp',
    aliases: ['/gamezone'],
  },
  {
    slug: 'fortnite',
    name: 'Fortnite',
    image: 'fortnite-card.webp',
  },
  {
    slug: 'forza-horizon-5',
    name: 'Forza Horizon 5',
    image: 'forza-card.webp',
    aliases: ['/pc-roda-forza'],
  },
  {
    slug: 'cyberpunk-2077',
    name: 'Cyberpunk 2077',
    image: 'cyberpunk-card.webp',
    aliases: ['/pc-roda-cyberpunk'],
  },
  {
    slug: 'cs2',
    name: 'CS2',
    image: 'cs2-card.webp',
  },
  {
    slug: 'elden-ring',
    name: 'Elden Ring',
    image: 'eldenring-card.webp',
    aliases: ['/pc-roda-elden'],
  },
  {
    slug: 'red-dead-redemption-2',
    name: 'Red Dead Redemption 2',
    image: 'reddead2-card.webp',
    aliases: ['/pc-roda-rdr2'],
  },
  {
    slug: 'apex-legends',
    name: 'Apex Legends',
    image: 'apexlegends-card.webp',
    aliases: ['/pc-roda-apex'],
  },
].flatMap((game) => {
  const canonicalPath = `/pc-roda-${game.slug}`
  const route = {
    path: canonicalPath,
    canonicalPath,
    title: `PC roda ${game.name}? Veja FPS e requisitos | PC Game Test`,
    description: `Descubra se seu PC roda ${game.name}. Veja requisitos, FPS estimado, gargalos e recomendações para melhorar desempenho.`,
    image: game.image,
    imageAlt: `Análise de desempenho para ${game.name} no PC Game Test`,
    type: 'article',
  }

  const aliasRoutes = (game.aliases ?? []).map((aliasPath) => ({
    ...route,
    path: aliasPath,
  }))

  return [route, ...aliasRoutes]
})

const routeMeta = [
  {
    path: '/',
    title: defaultTitle,
    openGraphTitle: defaultOgTitle,
    description: defaultDescription,
    openGraphDescription: defaultOgDescription,
    image: defaultImage,
    imageAlt: defaultImageAlt,
  },
  {
    path: '/teste',
    title: 'Teste seu PC Gamer | PC Game Test',
    description:
      'Informe seu processador, placa de vídeo, memória RAM e descubra o desempenho estimado do seu PC em jogos.',
    image: 'input.webp',
    imageAlt: 'Configurador de setup gamer no PC Game Test',
  },
  {
    path: '/analise',
    title: 'Analisando seu PC | PC Game Test',
    description:
      'Aguarde enquanto o PC Game Test calcula FPS estimado, status de desempenho, gargalos e recomendações.',
    image: defaultImage,
  },
  {
    path: '/resultado',
    title: 'Resultado do seu PC | PC Game Test',
    description:
      'Veja a análise do seu setup, FPS estimado, gargalos, status de desempenho e recomendações de upgrade.',
    image: 'warzone-card.webp',
    imageAlt: 'Resultado de desempenho no PC Game Test',
  },
  {
    path: '/historico',
    title: 'Histórico de Testes | PC Game Test',
    description:
      'Veja os testes salvos no seu navegador com FPS estimado, setup, gargalo e status de desempenho.',
    image: defaultImage,
  },
  {
    path: '/ranking',
    title: 'Ranking de PCs | PC Game Test',
    description:
      'Veja os melhores resultados salvos no ranking local com FPS médio, status e configuração dos setups.',
    image: defaultImage,
  },
  {
    path: '/comparar',
    title: 'Comparar PCs | PC Game Test',
    description:
      'Compare dois setups gamer e veja diferenças de FPS, pontuação, gargalos e desempenho estimado em jogos.',
    image: defaultImage,
  },
  {
    path: '/jogos',
    title: 'Jogos analisados | PC Game Test',
    description:
      'Veja análises de desempenho, requisitos e FPS estimado para os principais jogos de PC.',
    image: 'warzone-card.webp',
    imageAlt: 'Biblioteca de jogos analisados no PC Game Test',
  },
  {
    path: '/artigos',
    title: 'Artigos e Guias | PC Game Test',
    description:
      'Dicas, tutoriais e conteúdos para melhorar o desempenho do seu PC gamer, otimizar jogos e escolher upgrades com mais confiança.',
    image: 'hero2.webp',
    imageAlt: 'Artigos e guias do PC Game Test',
  },
  {
    path: '/upgrades',
    title: 'Upgrades Recomendados | PC Game Test',
    description:
      'Veja sugestões de GPU, CPU, RAM e SSD para melhorar o desempenho do seu PC gamer.',
    image: 'gpu.webp',
    imageAlt: 'Upgrades recomendados para PC gamer',
  },
  {
    path: '/otimizacao-online',
    title: 'Otimização Online para Jogos | Reduza Ping e Lag | PC Game Test',
    description:
      'Entenda como melhorar estabilidade, reduzir ping, evitar lag e otimizar sua conexão para jogos online competitivos.',
    image: 'otmizacao.webp',
    imageAlt: 'Otimização online para jogos no PC Game Test',
  },
  {
    path: '/promocoes',
    title: 'Promoções de Jogos | PC Game Test',
    description:
      'Veja promoções de jogos selecionadas pelo PC Game Test. Links reais serão adicionados em breve.',
    image: 'hero2.webp',
    imageAlt: 'Promoções de jogos no PC Game Test',
  },
  {
    path: '/como-funciona',
    title: 'Como funciona | PC Game Test',
    description:
      'Entenda como o PC Game Test transforma hardware, jogo, resolução e qualidade gráfica em uma estimativa prática de desempenho.',
    image: defaultImage,
  },
  {
    path: '/perguntas-frequentes',
    title: 'Perguntas frequentes | PC Game Test',
    description:
      'Respostas diretas sobre resultados, histórico local, comparação de PCs, links de compra e variações de desempenho.',
    image: defaultImage,
  },
  {
    path: '/contato',
    title: 'Contato | PC Game Test',
    description:
      'Veja como falar com o PC Game Test para sugestões, correções, parcerias e assuntos relacionados ao projeto.',
    image: defaultImage,
  },
  {
    path: '/termos-de-uso',
    title: 'Termos de uso | PC Game Test',
    description:
      'Leia as condições gerais de uso do PC Game Test e entenda os limites das estimativas, recomendações e links externos.',
    image: defaultImage,
  },
  {
    path: '/politica-de-privacidade',
    title: 'Política de privacidade | PC Game Test',
    description:
      'Entenda como o PC Game Test usa dados locais, histórico de testes, feedback opcional e informações armazenadas no navegador.',
    image: defaultImage,
  },
  ...gameRoutes,
  ...articleRoutes,
]

function normalizeSiteUrl(value) {
  return value.replace(/\/$/, '')
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function toAbsoluteUrl(pathOrUrl) {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl
  }

  const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`

  return `${siteUrl}${normalizedPath}`
}

function findBuiltAsset(filename) {
  if (filename.startsWith('/')) {
    return filename
  }

  if (!existsSync(assetsDir)) {
    return defaultImage
  }

  const extension = path.extname(filename)
  const basename = path.basename(filename, extension)
  const builtFile = readdirSync(assetsDir).find((file) => {
    return file.startsWith(`${basename}-`) && file.endsWith(extension)
  })

  return builtFile ? `/assets/${builtFile}` : defaultImage
}

function getRouteUrl(route) {
  const canonicalPath = route.canonicalPath ?? route.path

  return canonicalPath === '/' ? `${siteUrl}/` : `${siteUrl}${canonicalPath}`
}

function renderMeta(route) {
  const title = route.title
  const description = route.description
  const openGraphTitle = route.openGraphTitle ?? title
  const openGraphDescription = route.openGraphDescription ?? description
  const image = toAbsoluteUrl(findBuiltAsset(route.image ?? defaultImage))
  const imageAlt = route.imageAlt ?? defaultImageAlt
  const url = getRouteUrl(route)
  const type = route.type ?? 'website'

  return `${socialMetaStart}
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(url)}" />
    <meta property="og:site_name" content="PC Game Test" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:title" content="${escapeHtml(openGraphTitle)}" />
    <meta property="og:description" content="${escapeHtml(openGraphDescription)}" />
    <meta property="og:type" content="${escapeHtml(type)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(image)}" />
    <meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(openGraphTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(openGraphDescription)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}" />
    ${socialMetaEnd}`
}

function applyRouteMeta(html, route) {
  const managedMetaPattern = new RegExp(
    `${socialMetaStart}[\\s\\S]*?${socialMetaEnd}`,
  )
  const htmlWithTitle = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(route.title)}</title>`,
  )
  const meta = renderMeta(route)

  if (managedMetaPattern.test(htmlWithTitle)) {
    return htmlWithTitle.replace(managedMetaPattern, meta)
  }

  return htmlWithTitle.replace('</head>', `${meta}\n  </head>`)
}

function getOutputPath(routePath) {
  if (routePath === '/') {
    return path.join(distDir, 'index.html')
  }

  const routeSegments = routePath.replace(/^\/+|\/+$/g, '').split('/')

  return path.join(distDir, ...routeSegments, 'index.html')
}

function getCleanUrlOutputPath(routePath) {
  if (routePath === '/') {
    return null
  }

  const routeSegments = routePath.replace(/^\/+|\/+$/g, '').split('/')
  const fileName = `${routeSegments.pop()}.html`

  return path.join(distDir, ...routeSegments, fileName)
}

function writeRouteHtml(baseHtml, route) {
  const routeHtml = applyRouteMeta(baseHtml, route)
  const outputPath = getOutputPath(route.path)
  const outputDir = path.dirname(outputPath)
  const cleanUrlOutputPath = getCleanUrlOutputPath(route.path)

  mkdirSync(outputDir, { recursive: true })
  writeFileSync(outputPath, routeHtml)

  if (cleanUrlOutputPath) {
    mkdirSync(path.dirname(cleanUrlOutputPath), { recursive: true })
    writeFileSync(cleanUrlOutputPath, routeHtml)
  }
}

const indexPath = path.join(distDir, 'index.html')

if (!existsSync(indexPath)) {
  throw new Error('dist/index.html was not found. Run this script after vite build.')
}

const baseHtml = readFileSync(indexPath, 'utf8')
const uniqueRoutes = new Map(routeMeta.map((route) => [route.path, route]))

for (const route of uniqueRoutes.values()) {
  writeRouteHtml(baseHtml, route)
}

console.info(`Generated Open Graph HTML for ${uniqueRoutes.size} routes.`)
