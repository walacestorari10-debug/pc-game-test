import { useEffect, useRef } from 'react'

const adsenseScriptId = 'google-adsense-script'
const adsenseClient = import.meta.env.VITE_ADSENSE_CLIENT || ''

function ensureAdSenseScript() {
  if (!adsenseClient || typeof document === 'undefined') {
    return
  }

  if (document.getElementById(adsenseScriptId)) {
    return
  }

  const script = document.createElement('script')

  script.id = adsenseScriptId
  script.async = true
  script.crossOrigin = 'anonymous'
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`

  document.head.appendChild(script)
}

function AdSenseSlot({
  className = '',
  format = 'auto',
  label = 'Publicidade',
  layout,
  responsive = true,
  slot,
}) {
  const adRef = useRef(null)
  const isConfigured = Boolean(adsenseClient && slot)

  useEffect(() => {
    if (!isConfigured || typeof window === 'undefined') {
      return
    }

    ensureAdSenseScript()

    if (adRef.current?.dataset.adsenseLoaded === 'true') {
      return
    }

    adRef.current.dataset.adsenseLoaded = 'true'

    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch {
      // AdSense can reject duplicate renders during client-side navigation.
    }
  }, [isConfigured])

  return (
    <aside
      className={`adsense-slot ${isConfigured ? 'is-live' : 'is-placeholder'} ${className}`}
      aria-label={label}
    >
      <span className="adsense-label">{label}</span>
      {isConfigured ? (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={adsenseClient}
          data-ad-slot={slot}
          data-ad-format={format}
          data-ad-layout={layout}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      ) : (
        <div className="adsense-placeholder-box">
          <strong>Google AdSense</strong>
          <span>Configure o bloco de anúncio nas variáveis de ambiente.</span>
        </div>
      )}
    </aside>
  )
}

export default AdSenseSlot
