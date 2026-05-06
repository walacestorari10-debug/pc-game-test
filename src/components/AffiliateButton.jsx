import { track } from '@vercel/analytics'
import { useState } from 'react'

const defaultPendingMessage = 'Link em breve'

function AffiliateButton({
  children = 'Ver preço na Amazon',
  className = '',
  link = '#',
  isAffiliatePending = false,
  pendingMessage = defaultPendingMessage,
  pendingLabel = 'Link em breve',
  productName,
  provider = 'amazon',
}) {
  const [showMessage, setShowMessage] = useState(false)
  const isPending = isAffiliatePending || !link || link === '#'
  const handleAffiliateClick = () => {
    try {
      track('affiliate_click', {
        productName,
        provider,
        page: typeof window === 'undefined' ? '' : window.location.pathname,
        url: link,
      })

      if (import.meta.env.DEV) {
        console.info('Affiliate click tracked', productName)
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Affiliate click tracking failed', error)
      }
    }
  }

  if (isPending) {
    return (
      <span className="affiliate-button-wrap">
        <button
          className={className}
          type="button"
          onClick={() => setShowMessage(true)}
        >
          {pendingLabel}
        </button>
        {showMessage && (
          <small className="affiliate-feedback" role="status">
            {pendingMessage}
          </small>
        )}
      </span>
    )
  }

  return (
    <a
      className={className}
      href={link}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      onClick={handleAffiliateClick}
    >
      {children}
    </a>
  )
}

export default AffiliateButton
