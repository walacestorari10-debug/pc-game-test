import { Link } from 'react-router-dom'

const columns = [
  {
    title: 'Navegação',
    links: [
      ['Teste de PC', '/teste'],
      ['Jogos', '/jogos'],
      ['Ranking', '/ranking'],
      ['Artigos', '/artigos'],
      ['Promoções', '/promocoes'],
    ],
  },
  {
    title: 'Suporte',
    links: [
      ['Como funciona', '/como-funciona'],
      ['Perguntas frequentes', '/perguntas-frequentes'],
      ['Contato', '/contato'],
      ['Termos de uso', '/termos-de-uso'],
      ['Política de privacidade', '/politica-de-privacidade'],
    ],
  },
]

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Link className="brand footer-logo" to="/">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <strong>PC GAME TEST</strong>
        </Link>
        <p>
          A ferramenta definitiva para testar, comparar e melhorar o desempenho
          do seu PC em jogos.
        </p>
      </div>

      {columns.map((column) => (
        <div className="footer-column" key={column.title}>
          <h2>{column.title}</h2>
          {column.links.map(([label, to]) => (
            <Link to={to} key={to}>
              {label}
            </Link>
          ))}
        </div>
      ))}

      <small className="amazon-disclosure">
        Como associado da Amazon, posso ganhar comissões por compras qualificadas.
      </small>

      <small className="copyright">
        © 2026 PC Game Test. Todos os direitos reservados.
      </small>
    </footer>
  )
}

export default Footer
