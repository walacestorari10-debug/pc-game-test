import { useState } from 'react'

const defaultPendingMessage = 'Links de compra estarão disponíveis em breve.'

function AffiliateButton({
  children = 'Ver preço',
  className = '',
  link = '#',
  isAffiliatePending = false,
  pendingMessage = defaultPendingMessage,
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
          {children}
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
      rel="sponsored noopener noreferrer"
    >
      {children}
    </a>
  )
}

export default AffiliateButton
