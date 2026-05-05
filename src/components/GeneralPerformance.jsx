const emptyMetrics = [
  ['Processador', 0],
  ['Placa de vídeo', 0],
  ['Memória RAM', 0],
  ['Armazenamento', 0],
]

function GeneralPerformance({ setupResult }) {
  const metrics = setupResult?.result.componentScores ?? emptyMetrics

  return (
    <section
      className={`dashboard-card general-performance ${
        setupResult ? '' : 'general-performance-empty'
      }`}
      aria-labelledby="general-title"
    >
      <h2 id="general-title">Desempenho Geral</h2>
      {!setupResult && (
        <p className="general-empty-text">
          As barras serão preenchidas após o primeiro teste.
        </p>
      )}
      <div className="metric-list">
        {metrics.map(([label, value]) => (
          <div className="metric-item" key={label}>
            <div className="metric-label">
              <span>{label}</span>
              <strong>{value}%</strong>
            </div>
            <div className="metric-track">
              <span style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default GeneralPerformance
