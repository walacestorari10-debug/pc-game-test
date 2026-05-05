import { useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import SEOHead from '../components/SEOHead'
import { cpus, gpus, ram, storage } from '../data/hardware'
import { games } from '../data/games'
import { calculatePcPerformance } from '../utils/performanceEngine'
import '../styles/comparar.css'

const hardwareFields = [
  {
    key: 'cpu',
    label: 'CPU',
    options: cpus.map((item) => item.name),
  },
  {
    key: 'gpu',
    label: 'GPU',
    options: gpus.map((item) => item.name),
  },
  {
    key: 'ram',
    label: 'RAM',
    options: ram.map((item) => item.name),
  },
  {
    key: 'storage',
    label: 'Armazenamento',
    options: storage.map((item) => item.name),
  },
]

const globalFields = [
  {
    key: 'selectedGame',
    label: 'Jogo para comparar',
    options: games.map((game) => ({
      label: game.name,
      value: game.slug,
    })),
  },
  {
    key: 'resolution',
    label: 'Resolução',
    options: ['720p', '1080p', '1440p', '4K'].map((value) => ({
      label: value,
      value,
    })),
  },
  {
    key: 'quality',
    label: 'Qualidade',
    options: ['Baixa', 'Média', 'Alta', 'Ultra'].map((value) => ({
      label: value,
      value,
    })),
  },
]

const emptySetup = {
  cpu: '',
  gpu: '',
  ram: '',
  storage: '',
}

const emptyGlobalSetup = {
  selectedGame: '',
  resolution: '',
  quality: '',
}

function getStatusClass(status) {
  if (status === 'Ótimo') {
    return 'is-great'
  }

  if (status === 'Jogável') {
    return 'is-playable'
  }

  return 'is-low'
}

function getComponentScore(result, label) {
  return result.componentScores.find(([name]) => name === label)?.[1] ?? 0
}

function getBarWidth(value, maxValue) {
  if (!maxValue) {
    return 0
  }

  return Math.min(Math.round((value / maxValue) * 100), 100)
}

function SetupForm({ title, setup, onChange, isWinner, hasResult }) {
  return (
    <section
      className={`compare-setup-card ${
        hasResult && isWinner ? 'is-winner' : ''
      }`}
      aria-labelledby={`${title.toLowerCase().replace(' ', '-')}-title`}
    >
      <div className="compare-card-heading">
        <div>
          <p className="compare-kicker">Configuração</p>
          <h2 id={`${title.toLowerCase().replace(' ', '-')}-title`}>{title}</h2>
        </div>
        {hasResult && isWinner && <span>Vencedor</span>}
      </div>

      <div className="compare-field-grid">
        {hardwareFields.map((field) => (
          <label className="compare-select" key={field.key}>
            <span>{field.label}</span>
            <select
              value={setup[field.key]}
              onChange={(event) => onChange(field.key, event.target.value)}
            >
              <option value="">Selecione...</option>
              {field.options.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </section>
  )
}

function GlobalControls({ values, onChange }) {
  return (
    <section className="compare-global-card" aria-label="Configurações globais">
      {globalFields.map((field) => (
        <label className="compare-select" key={field.key}>
          <span>{field.label}</span>
          <select
            value={values[field.key]}
            onChange={(event) => onChange(field.key, event.target.value)}
          >
            <option value="">Selecione...</option>
            {field.options.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ))}
    </section>
  )
}

function ResultSummary({ comparison }) {
  const { resultA, resultB, winner, fpsDifference } = comparison
  const isTie = winner === 'Empate'

  return (
    <section className="compare-result-card" aria-labelledby="compare-result-title">
      <div className="compare-result-heading">
        <div>
          <p className="compare-kicker">Resultado</p>
          <h2 id="compare-result-title">
            {isTie
              ? 'Empate técnico'
              : `Setup ${winner} vence por +${fpsDifference} FPS`}
          </h2>
        </div>
        <span>{comparison.gameName}</span>
      </div>

      <div className="compare-score-grid">
        <article className={winner === 'A' ? 'is-winner' : ''}>
          <span>Setup A</span>
          <strong>{resultA.averageFps} FPS</strong>
          <em className={getStatusClass(resultA.status)}>{resultA.status}</em>
        </article>
        <article className={winner === 'B' ? 'is-winner' : ''}>
          <span>Setup B</span>
          <strong>{resultB.averageFps} FPS</strong>
          <em className={getStatusClass(resultB.status)}>{resultB.status}</em>
        </article>
      </div>
    </section>
  )
}

function CompareMetric({ label, valueA, valueB, maxValue }) {
  const winner = valueA === valueB ? 'tie' : valueA > valueB ? 'A' : 'B'

  return (
    <article className="compare-metric-row">
      <div className="compare-metric-title">
        <span>{label}</span>
        <strong>
          {valueA} vs {valueB}
        </strong>
      </div>
      <div className="compare-bars">
        <div className={winner === 'A' ? 'is-leading' : ''}>
          <span>Setup A</span>
          <strong>{valueA}</strong>
          <div aria-hidden="true">
            <span style={{ width: `${getBarWidth(valueA, maxValue)}%` }} />
          </div>
        </div>
        <div className={winner === 'B' ? 'is-leading' : ''}>
          <span>Setup B</span>
          <strong>{valueB}</strong>
          <div aria-hidden="true">
            <span style={{ width: `${getBarWidth(valueB, maxValue)}%` }} />
          </div>
        </div>
      </div>
    </article>
  )
}

function ComparisonBars({ comparison }) {
  const { resultA, resultB } = comparison
  const maxFps = Math.max(resultA.averageFps, resultB.averageFps, 60)
  const metrics = [
    {
      label: 'Pontuação geral',
      valueA: resultA.overallScore,
      valueB: resultB.overallScore,
      maxValue: 100,
    },
    {
      label: 'FPS médio',
      valueA: resultA.averageFps,
      valueB: resultB.averageFps,
      maxValue: maxFps,
    },
    {
      label: 'CPU',
      valueA: getComponentScore(resultA, 'Processador'),
      valueB: getComponentScore(resultB, 'Processador'),
      maxValue: 100,
    },
    {
      label: 'GPU',
      valueA: getComponentScore(resultA, 'Placa de vídeo'),
      valueB: getComponentScore(resultB, 'Placa de vídeo'),
      maxValue: 100,
    },
    {
      label: 'RAM',
      valueA: getComponentScore(resultA, 'Memória RAM'),
      valueB: getComponentScore(resultB, 'Memória RAM'),
      maxValue: 100,
    },
    {
      label: 'Armazenamento',
      valueA: getComponentScore(resultA, 'Armazenamento'),
      valueB: getComponentScore(resultB, 'Armazenamento'),
      maxValue: 100,
    },
  ]

  return (
    <section className="compare-bars-card" aria-labelledby="compare-bars-title">
      <div className="compare-section-heading">
        <p className="compare-kicker">Barras comparativas</p>
        <h2 id="compare-bars-title">Desempenho lado a lado</h2>
      </div>

      <div className="compare-metrics-grid">
        {metrics.map((metric) => (
          <CompareMetric {...metric} key={metric.label} />
        ))}
      </div>
    </section>
  )
}

function Comparar() {
  const [setupA, setSetupA] = useState(emptySetup)
  const [setupB, setSetupB] = useState(emptySetup)
  const [globalSetup, setGlobalSetup] = useState(emptyGlobalSetup)
  const [comparison, setComparison] = useState(null)

  const isReadyToCompare =
    Object.values(setupA).every(Boolean) &&
    Object.values(setupB).every(Boolean) &&
    Object.values(globalSetup).every(Boolean)

  const updateSetupA = (key, value) => {
    setSetupA((currentSetup) => ({ ...currentSetup, [key]: value }))
  }

  const updateSetupB = (key, value) => {
    setSetupB((currentSetup) => ({ ...currentSetup, [key]: value }))
  }

  const updateGlobalSetup = (key, value) => {
    setGlobalSetup((currentSetup) => ({ ...currentSetup, [key]: value }))
  }

  const handleCompare = (event) => {
    event.preventDefault()

    if (!isReadyToCompare) {
      return
    }

    const setupBase = {
      resolution: globalSetup.resolution,
      quality: globalSetup.quality,
    }
    const resultA = calculatePcPerformance(
      { ...setupA, ...setupBase },
      globalSetup.selectedGame,
    )
    const resultB = calculatePcPerformance(
      { ...setupB, ...setupBase },
      globalSetup.selectedGame,
    )
    const fpsDifference = Math.abs(resultA.averageFps - resultB.averageFps)
    const winner =
      resultA.averageFps === resultB.averageFps
        ? 'Empate'
        : resultA.averageFps > resultB.averageFps
          ? 'A'
          : 'B'

    setComparison({
      resultA,
      resultB,
      winner,
      fpsDifference,
      gameName: resultA.game.name,
    })
  }

  return (
    <div className="compare-page">
      <SEOHead
        title="Comparar PCs | PC Game Test"
        description="Compare dois setups gamer e veja diferenças de FPS, pontuação, gargalos e desempenho estimado em jogos."
        canonicalPath="/comparar"
      />
      <Header />

      <main className="compare-main">
        <section className="compare-hero" aria-labelledby="compare-title">
          <p className="compare-kicker">PC Game Test Lab</p>
          <h1 id="compare-title">Comparar PCs</h1>
          <p>Compare dois setups e veja qual entrega mais desempenho em jogos.</p>
        </section>

        <form className="compare-form" onSubmit={handleCompare}>
          <GlobalControls values={globalSetup} onChange={updateGlobalSetup} />

          <div className="compare-setups-grid">
            <SetupForm
              title="Setup A"
              setup={setupA}
              onChange={updateSetupA}
              hasResult={Boolean(comparison)}
              isWinner={comparison?.winner === 'A'}
            />
            <SetupForm
              title="Setup B"
              setup={setupB}
              onChange={updateSetupB}
              hasResult={Boolean(comparison)}
              isWinner={comparison?.winner === 'B'}
            />
          </div>

          <button
            className="compare-submit-button"
            type="submit"
            disabled={!isReadyToCompare}
          >
            COMPARAR SETUPS
          </button>
        </form>

        {comparison && (
          <div className="compare-results">
            <ResultSummary comparison={comparison} />
            <ComparisonBars comparison={comparison} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Comparar
