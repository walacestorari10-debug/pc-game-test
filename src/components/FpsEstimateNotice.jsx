import { useId, useState } from 'react'

const estimateText =
  'Estimativa baseada em média de desempenho. O resultado pode variar conforme drivers, configurações e otimizações.'
const explanationText =
  'Os resultados são calculados com base em médias de hardware semelhante, podendo variar conforme o sistema real.'

function FpsEstimateNotice({ className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const detailsId = useId()
  const classes = ['fps-estimate-note', className].filter(Boolean).join(' ')

  return (
    <div className={classes} role="note">
      <div className="fps-estimate-note-main">
        <button
          className="fps-estimate-info-button"
          type="button"
          aria-label="Entender estimativa de FPS"
          aria-expanded={isOpen}
          aria-controls={detailsId}
          onClick={() => setIsOpen((current) => !current)}
        >
          i
        </button>
        <span>{estimateText}</span>
      </div>
      <span className="fps-estimate-note-detail" id={detailsId} hidden={!isOpen}>
        {explanationText}
      </span>
    </div>
  )
}

export default FpsEstimateNotice
