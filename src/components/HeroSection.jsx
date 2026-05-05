import heroImage from '../assets/images/optimized/hero1.webp'
import { Link } from 'react-router-dom'

function HeroSection() {
  return (
    <section
      className="hero-section"
      id="dashboard"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(7, 11, 18, 0.98) 0%, rgba(7, 11, 18, 0.88) 24%, rgba(7, 11, 18, 0.42) 44%, rgba(7, 11, 18, 0.06) 60%, rgba(7, 11, 18, 0) 74%), url(${heroImage})`,
      }}
    >
      <div className="hero-content">
        <p className="eyebrow">Dashboard gamer</p>
        <h1>
          DESCUBRA O VERDADEIRO <span>PODER</span> DO SEU PC
        </h1>
        <p className="hero-copy">
          Teste, compare e melhore seu desempenho em centenas de jogos.
        </p>
        <Link className="primary-button hero-button" to="/teste">
          TESTAR MEU PC AGORA
          <span aria-hidden="true">&rsaquo;</span>
        </Link>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <div className="monitor monitor-left" />
        <div className="monitor monitor-center" />
        <div className="pc-tower">
          <span />
          <span />
          <span />
        </div>
        <div className="desk-glow" />
        <div className="keyboard-glow" />
      </div>
    </section>
  )
}

export default HeroSection
