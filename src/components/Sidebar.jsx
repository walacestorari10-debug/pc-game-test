import { Link, useLocation } from 'react-router-dom'
import { getGameBySlug } from '../data/games'

const menuItems = [
  ['Dashboard', 'grid', '/'],
  ['Meus Testes', 'check', '/historico'],
  ['Comparar PC', 'compare', '/comparar'],
]

const requiredSetupKeys = ['cpu', 'gpu', 'ram', 'storage', 'resolution', 'quality']

function hasSavedSetup(setup) {
  return Boolean(setup && requiredSetupKeys.every((key) => setup[key]))
}

function getSetupItems(setup) {
  const game = getGameBySlug(setup.selectedGame)

  return [
    ['CPU', setup.cpu, 'Processador'],
    ['GPU', setup.gpu, 'Placa de vídeo'],
    ['RAM', setup.ram, 'Memória'],
    ['Armazenamento', setup.storage, 'Disco principal'],
    ['Preset', `${setup.resolution} / ${setup.quality}`, 'Configuração alvo'],
    ['Jogo', game.name, game.category],
  ]
}

function Sidebar({ setupResult }) {
  const { pathname } = useLocation()
  const setup = setupResult?.setup
  const setupIsSaved = hasSavedSetup(setup)
  const setupItems = setupIsSaved ? getSetupItems(setup) : []

  return (
    <aside className="sidebar" aria-label="Menu lateral">
      <nav className="sidebar-menu">
        {menuItems.map(([label, icon, href]) => (
          <Link
            className={`sidebar-link ${pathname === href ? 'is-active' : ''}`}
            to={href}
            key={label}
          >
            <span className={`sidebar-link-icon icon-${icon}`} />
            {label}
          </Link>
        ))}
      </nav>

      <section className="setup-card" aria-labelledby="setup-title">
        <h2 id="setup-title">Seu Setup</h2>
        {setupIsSaved ? (
          <div className="setup-list">
            {setupItems.map(([label, value, meta]) => (
              <article className="setup-item" key={label}>
                <span className="setup-icon" />
                <div>
                  <strong>{label}</strong>
                  <p>{value}</p>
                  <small>{meta}</small>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="setup-empty-text">
            Nenhum setup salvo ainda. Cadastre suas peças para fixar suas
            configurações no dashboard.
          </p>
        )}
        <Link className="primary-button setup-button" to="/teste">
          Atualizar Setup
        </Link>
      </section>
    </aside>
  )
}

export default Sidebar
