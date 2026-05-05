import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { hasFeedbackSent, saveFeedbackSent } from '../utils/feedbackStorage'
import '../styles/feedbackWidget.css'

function FeedbackSuccessAnimation() {
  return (
    <div className="feedback-success-tech">
      <div className="feedback-success-grid" aria-hidden="true" />
      <div className="feedback-success-frame" aria-hidden="true">
        <span className="top-left" />
        <span className="top-right" />
        <span className="bottom-left" />
        <span className="bottom-right" />
      </div>

      <div className="feedback-success-core" aria-hidden="true">
        <span className="feedback-success-ring ring-one" />
        <span className="feedback-success-ring ring-two" />
        <span className="feedback-success-check" />
      </div>

      <div className="feedback-success-copy">
        <span>FEEDBACK ENVIADO</span>
        <strong>Obrigado pelo feedback!</strong>
        <p>Sua opinião ajuda a melhorar o PC Game Test.</p>
      </div>

      <div className="feedback-success-bars" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

function FeedbackWidgetContent({ className = '', onSubmitted, pathname }) {
  const [selectedType, setSelectedType] = useState(null)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(() =>
    hasFeedbackSent(pathname) ? 'submitted' : 'idle',
  )

  const handleSelect = (type) => {
    setSelectedType(type)
    setStatus('idle')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!selectedType) {
      return
    }

    if (hasFeedbackSent(pathname)) {
      setStatus('submitted')
      return
    }

    setStatus('submitting')

    try {
      if (!supabase) {
        throw new Error('Supabase environment variables are missing.')
      }

      const page = window.location.pathname
      const isPositive = selectedType === 'positivo'
      const { error } = await supabase.from('feedbacks').insert({
        page,
        type: selectedType,
        message: message.trim() || null,
        rating: isPositive ? 5 : 1,
      })

      if (error) {
        throw error
      }

      saveFeedbackSent(page)
      setMessage('')
      setStatus('submitted')
      onSubmitted?.()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'submitted') {
    return (
      <section
        className={`feedback-widget is-submitted ${className}`.trim()}
        aria-live="polite"
      >
        <FeedbackSuccessAnimation />
      </section>
    )
  }

  return (
    <section
      className={`feedback-widget ${className}`.trim()}
      aria-labelledby="feedback-widget-title"
    >
      <div className="feedback-widget-header">
        <p id="feedback-widget-title">Essa página foi útil?</p>

        <div className="feedback-widget-options" aria-label="Avaliar utilidade da página">
          <button
            className={selectedType === 'positivo' ? 'is-selected positive' : ''}
            type="button"
            onClick={() => handleSelect('positivo')}
            aria-pressed={selectedType === 'positivo'}
          >
            <span aria-hidden="true">👍</span>
            Sim
          </button>
          <button
            className={selectedType === 'negativo' ? 'is-selected negative' : ''}
            type="button"
            onClick={() => handleSelect('negativo')}
            aria-pressed={selectedType === 'negativo'}
          >
            <span aria-hidden="true">👎</span>
            Não
          </button>
        </div>
      </div>

      {selectedType && (
        <form className="feedback-widget-form" onSubmit={handleSubmit}>
          <label htmlFor="feedback-message">Quer deixar uma sugestão?</label>
          <textarea
            id="feedback-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Escreva uma sugestão rápida..."
            rows={3}
          />

          <div className="feedback-widget-footer">
            {status === 'error' && (
              <span className="feedback-widget-error" role="status">
                Não foi possível enviar agora.
              </span>
            )}
            <button type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Enviando...' : 'Enviar feedback'}
            </button>
          </div>
        </form>
      )}
    </section>
  )
}

function FeedbackWidget({ className, onSubmitted }) {
  const { pathname } = useLocation()

  return (
    <FeedbackWidgetContent
      className={className}
      key={pathname}
      onSubmitted={onSubmitted}
      pathname={pathname}
    />
  )
}

export default FeedbackWidget
