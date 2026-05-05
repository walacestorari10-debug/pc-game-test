export const pcGameTestUpdatedEvent = 'pcGameTestUpdated'

export function notifyPcGameTestUpdated() {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new Event(pcGameTestUpdatedEvent))
}

export function subscribePcGameTestUpdated(callback) {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const handleUpdate = () => callback()
  const handleStorage = (event) => {
    const watchedKeys = ['pcGameTestSetup', 'pcGameTestHistory']

    if (!event.key || watchedKeys.includes(event.key)) {
      callback()
    }
  }

  window.addEventListener(pcGameTestUpdatedEvent, handleUpdate)
  window.addEventListener('storage', handleStorage)

  return () => {
    window.removeEventListener(pcGameTestUpdatedEvent, handleUpdate)
    window.removeEventListener('storage', handleStorage)
  }
}
