import { useEffect } from 'react'

const jsonLdScriptId = 'pc-game-test-json-ld'

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

function SEOHead({ title, description, canonicalPath, structuredData }) {
  useEffect(() => {
    const canonicalUrl = getCanonicalUrl(canonicalPath)

    document.title = title
    upsertMeta('meta[name="description"]', { name: 'description' }, description)
    upsertMeta('meta[property="og:title"]', { property: 'og:title' }, title)
    upsertMeta(
      'meta[property="og:description"]',
      { property: 'og:description' },
      description,
    )
    upsertMeta('meta[property="og:url"]', { property: 'og:url' }, canonicalUrl)
    upsertMeta('meta[property="og:type"]', { property: 'og:type' }, 'website')
    upsertCanonical(canonicalUrl)
    upsertJsonLd(structuredData)
  }, [canonicalPath, description, structuredData, title])

  return null
}

export default SEOHead
