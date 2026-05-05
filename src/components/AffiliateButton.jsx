import { useState } from 'react'

const defaultPendingMessage = 'Link em breve.'

function AffiliateButton({
  children = 'Ver preço na Amazon',
  className = '',
  link = '#',
  isAffiliatePending = false,
  pendingMessage = defaultPendingMessage,
  pendingLabel = 'Link em breve',
}) {
  const [showMessage, setShowMessage] = useState(false)
  const isPending = isAffiliatePending || !link || link === '#'

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
    >
      {children}
    </a>
  )
}

export default AffiliateButton
