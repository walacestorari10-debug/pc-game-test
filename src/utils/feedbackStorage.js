const storagePrefix = 'pcGameTestFeedbackSent'
export const feedbackSentEvent = 'pcGameTestFeedbackSentUpdated'

function getStorageKey(pathname) {
  return `${storagePrefix}:${pathname || '/'}`
}

export function hasFeedbackSent(pathname) {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    return Boolean(localStorage.getItem(getStorageKey(pathname)))
  } catch {
    return false
  }
}

export function saveFeedbackSent(pathname) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(getStorageKey(pathname), new Date().toISOString())
    window.dispatchEvent(
      new CustomEvent(feedbackSentEvent, {
        detail: { pathname: pathname || '/' },
      }),
    )
  } catch {
    // Feedback was already saved; local anti-spam is best-effort.
  }
}
