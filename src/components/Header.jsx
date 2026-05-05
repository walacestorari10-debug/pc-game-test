import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  ['Início', '/'],
  ['Testar PC', '/teste'],
  ['Jogos', '/jogos'],
  ['Ranking', '/ranking'],
  ['Artigos', '/artigos'],
  ['Promoções', '/promocoes'],
]

function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  function handleSearchSubmit(event) {
    event.preventDefault()

    const term = searchTerm.trim()

    if (!term) {
      navigate('/jogos')
      return
    }

    navigate(`/jogos?search=${encodeURIComponent(term)}`)
  }

  return (
    <header className="site-header">
      <Link className="brand" to="/">
        <span className="brand-mark" aria-hidden="true">
          <span />
        </span>
        <strong>PC GAME TEST</strong>
      </Link>

      <nav className="top-nav" aria-label="Navegação principal">
        {navItems.map(([label, href]) => (
          <Link
            className={`top-nav-link ${pathname === href ? 'is-active' : ''}`}
            to={href}
            key={label}
          >
            {label}
          </Link>
        ))}
      </nav>

      <form className="header-actions" onSubmit={handleSearchSubmit}>
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Buscar jogos..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>
      </form>
    </header>
  )
}

export default Header
