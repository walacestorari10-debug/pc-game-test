import { Link } from 'react-router-dom'

function getStatusColor(status) {
  if (status === 'Ótimo') {
    return '#22c55e'
  }

  if (status === 'Jogável') {
    return '#f59e0b'
  }

  return '#ef4444'
}

function getScoreRingStyle(score, status) {
  const scoreAngle = Math.min(Math.max(score, 0), 100) * 3.6
  const scoreColor = getStatusColor(status)

  return {
    '--score-color': scoreColor,
    background: `
      radial-gradient(circle, #101827 0 57%, transparent 58%),
      conic-gradient(from 220deg, ${scoreColor} 0 ${scoreAngle}deg, rgba(31, 41, 55, 0.92) ${scoreAngle}deg 360deg)
    `,
  }
}

function ScoreRingFx() {
  return (
    <>
      <span className="score-ring-orbit orbit-one" aria-hidden="true" />
      <span className="score-ring-orbit orbit-two" aria-hidden="true" />
      <span className="score-ring-sweep" aria-hidden="true" />
      <span className="score-ring-tick tick-top" aria-hidden="true" />
      <span className="score-ring-tick tick-right" aria-hidden="true" />
      <span className="score-ring-tick tick-bottom" aria-hidden="true" />
      <span className="score-ring-tick tick-left" aria-hidden="true" />
    </>
  )
}

function getPerformanceText(result) {
  if (result.status === 'Ótimo') {
    return `Seu PC é capaz de rodar ${result.game.name} e a maioria dos jogos atuais com ótima estabilidade.`
  }

  if (result.status === 'Jogável') {
    return `Seu PC deve rodar ${result.game.name}, mas alguns jogos podem pedir ajustes de qualidade para manter FPS estável.`
  }

  return `Seu PC pode ter dificuldade em ${result.game.name}; reduzir qualidade ou resolução deve melhorar a experiência.`
}

function EmptyPerformanceSummary() {
  return (
    <section
      className="dashboard-card performance-summary"
      id="performance"
      aria-labelledby="performance-title"
    >
      <h2 id="performance-title">Descubra quantos FPS seu computador roda</h2>
      <div className="performance-body">
        <div className="score-ring score-ring-empty" aria-label="Nenhum teste feito">
          <ScoreRingFx />
          <div className="score-ring-inner">
            <strong>--</strong>
            <span>/10</span>
            <small>TESTE</small>
          </div>
        </div>

        <div className="performance-copy">
          <p>Faça um teste para ver o desempenho do seu PC.</p>
          <div className="stats-row">
            <div>
              <span>Jogo</span>
              <strong>--</strong>
            </div>
            <div>
              <span>Média de FPS</span>
              <strong>--</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>--</strong>
            </div>
          </div>
          <Link className="ghost-button" to="/teste">
            Testar meu PC
          </Link>
        </div>
      </div>
    </section>
  )
}

function PerformanceSummary({ setupResult }) {
  if (!setupResult) {
    return <EmptyPerformanceSummary />
  }

  const { result } = setupResult
  const scoreLabel = (result.overallScore / 10).toFixed(1)

  return (
    <section
      className="dashboard-card performance-summary"
      id="performance"
      aria-labelledby="performance-title"
    >
      <h2 id="performance-title">Descubra quantos FPS seu computador roda</h2>
      <div className="performance-body">
        <div
          className="score-ring"
          style={getScoreRingStyle(result.overallScore, result.status)}
          aria-label={`Pontuação ${scoreLabel} de 10, status ${result.status}`}
        >
          <ScoreRingFx />
          <div className="score-ring-inner">
            <strong>{scoreLabel}</strong>
            <span>/10</span>
            <small style={{ color: getStatusColor(result.status) }}>
              {result.status.toUpperCase()}
            </small>
          </div>
        </div>

        <div className="performance-copy">
          <p>{getPerformanceText(result)}</p>
          <div className="stats-row">
            <div>
              <span>Jogo</span>
              <strong>{result.game.name}</strong>
            </div>
            <div>
              <span>Média de FPS</span>
              <strong>{result.averageFps}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{result.status}</strong>
            </div>
          </div>
          <Link className="ghost-button" to="/resultado">
            Ver resultado completo
          </Link>
        </div>
      </div>
    </section>
  )
}

export default PerformanceSummary
