import { Link } from 'react-router-dom'

const ranking = [
  ['PC EXTREME', 'RTX 4090 / i9-13900K', '9.8'],
  ['Ninja Setup', 'RTX 4080 / i7-13700K', '9.5'],
  ['Gamer Pro', 'RTX 4070 Ti / Ryzen 7 7800X3D', '9.3'],
  ['Elite Machine', 'RTX 4070 / i7-13700F', '9.1'],
  ['Shadow PC', 'RTX 4060 Ti / i5-13600K', '8.9'],
]

function RankingSection() {
  return (
    <section className="dashboard-card ranking-section" id="ranking" aria-labelledby="ranking-title">
      <div className="section-heading">
        <h2 id="ranking-title">Ranking de PCs</h2>
        <Link to="/ranking">Ver ranking completo</Link>
      </div>
      <ol className="ranking-list">
        {ranking.map(([name, setup, score], index) => (
          <li className="ranking-item" key={name}>
            <span className="ranking-position">{index + 1}</span>
            <span className="ranking-avatar" />
            <div>
              <strong>{name}</strong>
              <p>{setup}</p>
            </div>
            <em>{score}</em>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default RankingSection
