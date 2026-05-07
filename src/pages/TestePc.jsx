import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import HardwareSearchInput from '../components/HardwareSearchInput'
import Header from '../components/Header'
import SEOHead from '../components/SEOHead'
import { cpus, gpus, ram, storage } from '../data/hardware'
import { games } from '../data/games'
import { notifyPcGameTestUpdated } from '../utils/storageEvents'
import inputImage from '../assets/images/optimized/input.webp'
import '../styles/testePc.css'

const setupStorageKey = 'pcGameTestSetup'

const toOptions = (items) =>
  items.map((item) => ({
    label: item.name,
    value: item.name,
  }))

const setupFields = [
  {
    key: 'selectedGame',
    label: 'Jogo para analisar',
    shortLabel: 'Jogo',
    icon: 'GAME',
    placeholder: 'Digite Warzone, Fortnite, CS2...',
    options: games.map((game) => ({
      label: game.name,
      value: game.slug,
    })),
  },
  {
    key: 'cpu',
    label: 'Processador',
    shortLabel: 'CPU',
    icon: 'CPU',
    placeholder: 'Digite Ryzen, i5, 5600...',
    options: toOptions(cpus),
  },
  {
    key: 'gpu',
    label: 'Placa de vídeo',
    shortLabel: 'GPU',
    icon: 'GPU',
    placeholder: 'Digite RTX, RX, 3060...',
    options: toOptions(gpus),
  },
  {
    key: 'ram',
    label: 'Memória RAM',
    shortLabel: 'RAM',
    icon: 'RAM',
    placeholder: 'Digite 16GB, DDR4, DDR5...',
    options: toOptions(ram),
  },
  {
    key: 'storage',
    label: 'Armazenamento',
    shortLabel: 'Armazenamento',
    icon: 'SSD',
    placeholder: 'Digite SSD, NVMe, 1TB...',
    options: toOptions(storage),
  },
  {
    key: 'resolution',
    label: 'Resolução desejada',
    shortLabel: 'Resolução',
    icon: 'PX',
    options: ['720p', '1080p', '1440p', '4K'].map((value) => ({
      label: value,
      value,
    })),
  },
  {
    key: 'quality',
    label: 'Qualidade gráfica',
    shortLabel: 'Qualidade',
    icon: 'GFX',
    options: ['Baixa', 'Média', 'Alta', 'Ultra'].map((value) => ({
      label: value,
      value,
    })),
  },
]

const emptySetup = {
  selectedGame: '',
  cpu: '',
  gpu: '',
  ram: '',
  storage: '',
  resolution: '',
  quality: '',
}

const requiredSetupKeys = Object.keys(emptySetup)
const hardwareItemsByKey = {
  cpu: cpus,
  gpu: gpus,
  ram,
  storage,
}
const searchableItemsByKey = {
  selectedGame: games,
  ...hardwareItemsByKey,
}
const validSearchValuesByKey = Object.fromEntries(
  Object.entries(searchableItemsByKey).map(([key, items]) => [
    key,
    new Set(
      items.map((item) => (key === 'selectedGame' ? item.slug : item.name)),
    ),
  ]),
)

const analysisItems = [
  {
    title: 'FPS estimado',
    text: 'Projeção em range para o jogo escolhido e para outros títulos.',
    value: 'FPS',
  },
  {
    title: 'Gargalo do sistema',
    text: 'Leitura de equilíbrio entre CPU, GPU, memória e armazenamento.',
    value: 'BOT',
  },
  {
    title: 'Qualidade ideal',
    text: 'Sugestão de preset para jogar com mais estabilidade.',
    value: 'Alta',
  },
  {
    title: 'Recomendação',
    text: 'Próximo passo estimado caso algum componente limite o conjunto.',
    value: 'UP',
  },
]

function getInitialSetup() {
  if (typeof window === 'undefined') {
    return emptySetup
  }

  try {
    const savedSetup = JSON.parse(localStorage.getItem(setupStorageKey))

    return savedSetup ? { ...emptySetup, ...savedSetup } : emptySetup
  } catch {
    return emptySetup
  }
}

function getDisplayValue(field, value) {
  if (!value) {
    return 'Selecione'
  }

  return field.options.find((option) => option.value === value)?.label ?? value
}

function SetupSelect({ field, value, onChange, isUpdated }) {
  return (
    <label
      className={`setup-select ${value ? 'is-selected' : ''} ${
        isUpdated ? 'is-updated' : ''
      }`}
    >
      <span className="setup-label">
        <span className="setup-field-icon" aria-hidden="true">
          {field.icon}
        </span>
        <span>{field.label}</span>
      </span>
      <select
        value={value}
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
  )
}

function SetupSearchInput({ field, value, onChange, isUpdated }) {
  const isGameField = field.key === 'selectedGame'

  return (
    <HardwareSearchInput
      label={field.label}
      placeholder={field.placeholder}
      items={searchableItemsByKey[field.key]}
      value={value}
      onChange={(nextValue) => onChange(field.key, nextValue)}
      icon={field.icon}
      isUpdated={isUpdated}
      getItemLabel={isGameField ? (game) => game.name : undefined}
      getItemValue={isGameField ? (game) => game.slug : undefined}
      getItemMeta={isGameField ? (game) => game.demandLabel : undefined}
      getSearchText={
        isGameField
          ? (game) =>
              [
                game.name,
                game.slug,
                game.category,
                game.demandLabel,
                ...(game.badges ?? []),
              ]
                .filter(Boolean)
                .join(' ')
          : undefined
      }
      emptyMessage={
        isGameField ? 'Nenhum jogo encontrado' : 'Nenhum hardware encontrado'
      }
    />
  )
}

function SetupSummary({ setup, updatedFields }) {
  return (
    <aside className="setup-summary-card" aria-labelledby="setup-summary-title">
      <div className="summary-scan" aria-hidden="true">
        <span />
      </div>
      <p className="section-kicker">Resumo ao vivo</p>
      <h2 id="setup-summary-title">Resumo do Setup</h2>

      <dl className="summary-list">
        {setupFields.map((field) => (
          <div
            className={`summary-row ${updatedFields[field.key] ? 'is-updated' : ''}`}
            key={field.key}
          >
            <dt>
              <span className="summary-icon" aria-hidden="true">
                {field.icon}
              </span>
              <span>{field.shortLabel}</span>
            </dt>
            <dd>{getDisplayValue(field, setup[field.key])}</dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}

function AnalysisCard({ item }) {
  return (
    <article className="analysis-card">
      <span aria-hidden="true">{item.value}</span>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </article>
  )
}

function TestePc() {
  const [setup, setSetup] = useState(getInitialSetup)
  const [updatedFields, setUpdatedFields] = useState({})
  const navigate = useNavigate()
  const hasValidSearchFields = Object.entries(validSearchValuesByKey).every(
    ([key, optionValues]) => Boolean(setup[key]) && optionValues.has(setup[key]),
  )
  const isSetupComplete =
    requiredSetupKeys.every((key) => Boolean(setup[key])) &&
    hasValidSearchFields

  const updateSetup = (key, value) => {
    setSetup((currentSetup) => ({
      ...currentSetup,
      [key]: value,
    }))
    setUpdatedFields((currentFields) => ({
      ...currentFields,
      [key]: true,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!isSetupComplete) {
      return
    }

    const setupToSave = {
      ...setup,
      testId: Date.now(),
    }

    localStorage.setItem(setupStorageKey, JSON.stringify(setupToSave))
    notifyPcGameTestUpdated()
    navigate('/analise')
  }

  return (
    <div className="teste-page teste-flow-page">
      <SEOHead
        title="Teste seu PC Gamer | PC Game Test"
        description="Informe seu processador, placa de vídeo, memória RAM e descubra o desempenho estimado do seu PC em jogos."
        canonicalPath="/teste"
        openGraphImage={inputImage}
        openGraphImageAlt="Configurador de setup gamer no PC Game Test"
      />
      <Header />

      <main className="teste-main">
        <section className="teste-hero" aria-labelledby="teste-title">
          <div className="teste-hero-content">
            <p className="section-kicker">PC Game Test Lab</p>
            <h1 id="teste-title">
              TESTE SEU <span>PC</span> GAMER
            </h1>
            <p>
              Descubra o <strong>desempenho</strong> do seu setup em segundos
            </p>
          </div>

          <div className="teste-hero-card" aria-hidden="true">
            <div className="tech-chip">GPU</div>
            <div className="tech-core">
              <span />
            </div>
            <div className="tech-readout">
              <strong>Pronto para analisar</strong>
              <span>Estimativa local</span>
            </div>
          </div>
        </section>

        <section className="setup-grid" aria-label="Configurador de setup">
          <form className="setup-builder-card" onSubmit={handleSubmit}>
            <div className="section-heading setup-heading">
              <div>
                <p className="section-kicker">Configurador</p>
                <h2>Monte seu setup</h2>
              </div>
            </div>

            <div className="setup-form-grid">
              {setupFields.map((field) =>
                searchableItemsByKey[field.key] ? (
                  <SetupSearchInput
                    field={field}
                    value={setup[field.key]}
                    onChange={updateSetup}
                    isUpdated={updatedFields[field.key]}
                    key={field.key}
                  />
                ) : (
                  <SetupSelect
                    field={field}
                    value={setup[field.key]}
                    onChange={updateSetup}
                    isUpdated={updatedFields[field.key]}
                    key={field.key}
                  />
                ),
              )}
            </div>

            <button
              className="analyze-button"
              type="submit"
              disabled={!isSetupComplete}
            >
              <span aria-hidden="true">&rsaquo;</span>
              ANALISAR MEU PC
            </button>
          </form>

          <SetupSummary setup={setup} updatedFields={updatedFields} />
        </section>

        <section className="analysis-section" aria-labelledby="analysis-title">
          <div className="analysis-heading">
            <p className="section-kicker">Prévia da análise</p>
            <h2 id="analysis-title">O que será analisado</h2>
          </div>

          <div className="analysis-grid">
            {analysisItems.map((item) => (
              <AnalysisCard item={item} key={item.title} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default TestePc
