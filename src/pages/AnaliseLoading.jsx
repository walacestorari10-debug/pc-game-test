import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import SEOHead from '../components/SEOHead'
import '../styles/analise.css'

const setupStorageKey = 'pcGameTestSetup'
const scanNodes = [
  ['CPU', 'Clock / threads'],
  ['GPU', 'Frames / render'],
  ['RAM', 'Buffer / cache'],
  ['FPS', 'Preset / estabilidade'],
]
const analysisSteps = [
  'Analisando processador...',
  'Comparando placa de vídeo...',
  'Verificando memória RAM...',
  'Calculando FPS em jogos...',
  'Gerando resultado final...',
]

function hasSavedSetup() {
  try {
    return Boolean(JSON.parse(localStorage.getItem(setupStorageKey)))
  } catch {
    return false
  }
}

function AnaliseLoading() {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const progress = useMemo(
    () => Math.round(((activeStep + 1) / analysisSteps.length) * 100),
    [activeStep],
  )

  useEffect(() => {
    if (!hasSavedSetup()) {
      navigate('/teste', { replace: true })
      return undefined
    }

    const stepTimers = analysisSteps.map((_, index) =>
      setTimeout(() => setActiveStep(index), index * 380),
    )
    const finishTimer = setTimeout(() => {
      navigate('/resultado', { replace: true })
    }, 2200)

    return () => {
      stepTimers.forEach((timer) => clearTimeout(timer))
      clearTimeout(finishTimer)
    }
  }, [navigate])

  return (
    <div className="analysis-loading-page">
      <SEOHead
        title="Analisando seu PC | PC Game Test"
        description="Aguarde enquanto o PC Game Test calcula FPS estimado, status de desempenho, gargalos e recomendações."
        canonicalPath="/analise"
      />
      <Header />

      <main className="analysis-loading-main">
        <section className="analysis-loading-card" aria-labelledby="analysis-loading-title">
          <div className="analysis-scan-stage" aria-hidden="true">
            <div className="analysis-orb">
              <span className="analysis-orb-ring ring-one" />
              <span className="analysis-orb-ring ring-two" />
              <span className="analysis-orb-core" />
              <span className="analysis-orb-sweep" />
            </div>

            <div className="analysis-node-grid">
              {scanNodes.map(([label, detail], index) => (
                <div
                  className={`analysis-node ${
                    index <= activeStep ? 'is-online' : ''
                  } ${index === activeStep ? 'is-scanning' : ''}`}
                  key={label}
                >
                  <span>{label}</span>
                  <small>{detail}</small>
                </div>
              ))}
            </div>
          </div>

          <p className="analysis-kicker">PC Game Test Lab</p>
          <h1 id="analysis-loading-title">Analisando seu PC</h1>
          <p className="analysis-loading-copy">
            Cruzando dados do setup, presets gráficos e referências de desempenho.
          </p>

          <div className="analysis-telemetry" aria-hidden="true">
            <span>SCAN {String(activeStep + 1).padStart(2, '0')}</span>
            <span>FPS MODEL</span>
            <span>{progress}% SYNC</span>
          </div>

          <div className="analysis-step-list" aria-live="polite">
            {analysisSteps.map((step, index) => (
              <div
                className={`analysis-step ${
                  index < activeStep
                    ? 'is-complete'
                    : index === activeStep
                      ? 'is-active'
                      : ''
                }`}
                key={step}
              >
                <span aria-hidden="true" />
                <strong>{step}</strong>
              </div>
            ))}
          </div>

          <div className="analysis-progress" aria-label={`Progresso ${progress}%`}>
            <div>
              <i aria-hidden="true" />
              <span style={{ width: `${progress}%` }} />
            </div>
            <strong>{progress}%</strong>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default AnaliseLoading
