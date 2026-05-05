import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import FeedbackWidget from './FeedbackWidget'
import { hasFeedbackSent } from '../utils/feedbackStorage'
import '../styles/feedbackWidget.css'

const dismissedPrefix = 'pcGameTestFeedbackPromptDismissed'

function getDismissedKey(pathname) {
  return `${dismissedPrefix}:${pathname || '/'}`
}

function isPromptDismissed(pathname) {
  if (typeof window === 'undefined') {
    return true
  }

  try {
    return Boolean(sessionStorage.getItem(getDismissedKey(pathname)))
  } catch {
    return false
  }
}

function savePromptDismissed(pathname) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    sessionStorage.setItem(getDismissedKey(pathname), 'true')
  } catch {
    // The close action still works even if sessionStorage is unavailable.
  }
}

function FeedbackScrollPromptContent({ pathname, threshold }) {
  const [isClosed, setIsClosed] = useState(() => {
    return isPromptDismissed(pathname) || hasFeedbackSent(pathname)
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isClosed || typeof window === 'undefined') {
      return undefined
    }

    const handleScroll = () => {
      if (hasFeedbackSent(pathname)) {
        setIsClosed(true)
        setIsVisible(false)
        return
      }

      const page = document.documentElement
      const distanceToBottom = page.scrollHeight - (window.scrollY + window.innerHeight)
      const hasScrollableContent = page.scrollHeight > window.innerHeight + threshold

      if (hasScrollableContent && distanceToBottom <= threshold) {
        setIsVisible(true)
      }
    }

    const frame = window.requestAnimationFrame(handleScroll)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [isClosed, pathname, threshold])

  const closePrompt = () => {
    savePromptDismissed(pathname)
    setIsClosed(true)
    setIsVisible(false)
  }

  const closeAfterThanks = () => {
    window.setTimeout(closePrompt, 2600)
  }

  if (!isVisible || isClosed) {
    return null
  }

  return (
    <div
      className="feedback-scroll-prompt"
      role="dialog"
      aria-label="Feedback da página"
    >
      <button
        className="feedback-scroll-prompt-close"
        type="button"
        onClick={closePrompt}
        aria-label="Fechar feedback"
      >
        X
      </button>
      <FeedbackWidget className="is-floating" onSubmitted={closeAfterThanks} />
    </div>
  )
}

function FeedbackScrollPrompt({ threshold = 420 }) {
  const { pathname } = useLocation()

  return (
    <FeedbackScrollPromptContent
      key={pathname}
      pathname={pathname}
      threshold={threshold}
    />
  )
}

export default FeedbackScrollPrompt
