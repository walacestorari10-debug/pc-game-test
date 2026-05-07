import { useEffect } from 'react'

const jsonLdScriptId = 'pc-game-test-json-ld'
const defaultOpenGraphImage = '/og-image.png'
const defaultOpenGraphImageAlt = 'PC Game Test'

function getSiteUrl() {
  const envSiteUrl = import.meta.env.VITE_SITE_URL

  if (envSiteUrl) {
    return envSiteUrl
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }

  return ''
}

function getCanonicalUrl(canonicalPath) {
  const siteUrl = getSiteUrl()

  if (!canonicalPath) {
    return siteUrl
  }

  if (/^https?:\/\//i.test(canonicalPath)) {
    return canonicalPath
  }

  const normalizedBaseUrl = siteUrl.replace(/\/$/, '')
  const normalizedPath = canonicalPath.startsWith('/')
    ? canonicalPath
    : `/${canonicalPath}`

  return `${normalizedBaseUrl}${normalizedPath}`
}

function getAbsoluteUrl(pathOrUrl) {
  if (!pathOrUrl) {
    return ''
  }

  if (/^(https?:)?\/\//i.test(pathOrUrl) || /^data:/i.test(pathOrUrl)) {
    return pathOrUrl
  }

  const siteUrl = getSiteUrl()

  if (!siteUrl) {
    return pathOrUrl
  }

  const normalizedBaseUrl = siteUrl.replace(/\/$/, '')
  const normalizedPath = pathOrUrl.startsWith('/')
    ? pathOrUrl
    : `/${pathOrUrl}`

  return `${normalizedBaseUrl}${normalizedPath}`
}

function upsertMeta(selector, attributes, content) {
  let element = document.head.querySelector(selector)

  if (!element) {
    element = document.createElement('meta')

    Object.entries(attributes).forEach(([name, value]) => {
      element.setAttribute(name, value)
    })

    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

function upsertCanonical(href) {
  let canonical = document.head.querySelector('link[rel="canonical"]')

  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }

  canonical.setAttribute('href', href)
}

function upsertJsonLd(structuredData) {
  const currentScript = document.getElementById(jsonLdScriptId)

  if (!structuredData) {
    currentScript?.remove()
    return
  }

  const script = currentScript ?? document.createElement('script')

  script.id = jsonLdScriptId
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(structuredData)

  if (!currentScript) {
    document.head.appendChild(script)
  }
}

function SEOHead({
  title,
  description,
  canonicalPath,
  structuredData,
  openGraphTitle = title,
  openGraphDescription = description,
  openGraphImage = defaultOpenGraphImage,
  openGraphImageAlt = defaultOpenGraphImageAlt,
  openGraphType = 'website',
}) {
  useEffect(() => {
    const canonicalUrl = getCanonicalUrl(canonicalPath)
    const absoluteOpenGraphImage = getAbsoluteUrl(openGraphImage)

    document.title = title
    upsertMeta('meta[name="description"]', { name: 'description' }, description)
    upsertMeta(
      'meta[property="og:site_name"]',
      { property: 'og:site_name' },
      'PC Game Test',
    )
    upsertMeta(
      'meta[property="og:locale"]',
      { property: 'og:locale' },
      'pt_BR',
    )
    upsertMeta(
      'meta[property="og:title"]',
      { property: 'og:title' },
      openGraphTitle,
    )
    upsertMeta(
      'meta[property="og:description"]',
      { property: 'og:description' },
      openGraphDescription,
    )
    upsertMeta('meta[property="og:url"]', { property: 'og:url' }, canonicalUrl)
    upsertMeta('meta[property="og:type"]', { property: 'og:type' }, openGraphType)
    if (absoluteOpenGraphImage) {
      upsertMeta(
        'meta[property="og:image"]',
        { property: 'og:image' },
        absoluteOpenGraphImage,
      )
      upsertMeta(
        'meta[property="og:image:secure_url"]',
        { property: 'og:image:secure_url' },
        absoluteOpenGraphImage,
      )
      upsertMeta(
        'meta[property="og:image:alt"]',
        { property: 'og:image:alt' },
        openGraphImageAlt,
      )
    }
    upsertMeta(
      'meta[name="twitter:card"]',
      { name: 'twitter:card' },
      'summary_large_image',
    )
    upsertMeta(
      'meta[name="twitter:title"]',
      { name: 'twitter:title' },
      openGraphTitle,
    )
    upsertMeta(
      'meta[name="twitter:description"]',
      { name: 'twitter:description' },
      openGraphDescription,
    )
    if (absoluteOpenGraphImage) {
      upsertMeta(
        'meta[name="twitter:image"]',
        { name: 'twitter:image' },
        absoluteOpenGraphImage,
      )
      upsertMeta(
        'meta[name="twitter:image:alt"]',
        { name: 'twitter:image:alt' },
        openGraphImageAlt,
      )
    }
    upsertCanonical(canonicalUrl)
    upsertJsonLd(structuredData)
  }, [
    canonicalPath,
    description,
    openGraphDescription,
    openGraphImage,
    openGraphImageAlt,
    openGraphTitle,
    openGraphType,
    structuredData,
    title,
  ])

  return null
}

export default SEOHead
