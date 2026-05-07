import heroImage from '../assets/images/optimized/hero1.webp'
import { Link } from 'react-router-dom'

const heroTechBarItems = [
  {
    icon: 'zap',
    label: 'Rápido',
  },
  {
    icon: 'shieldCheck',
    label: 'Seguro',
  },
  {
    icon: 'target',
    label: 'Preciso',
  },
]

const heroMiniCards = [
  {
    icon: 'gauge',
    title: 'Desempenho Completo',
    description: 'Analise FPS, desempenho e estabilidade do seu setup.',
  },
  {
    icon: 'barChart',
    title: 'Análise Detalhada',
    description: 'Veja informações completas sobre seu hardware gamer.',
  },
  {
    icon: 'shieldCheck',
    title: '100% Seguro',
    description: 'Teste seguro sem instalar programas pesados.',
  },
]

const heroProofItems = [
  {
    icon: 'shieldCheck',
    title: 'Privacidade garantida',
    description: 'Seus dados estão protegidos',
  },
  {
    icon: 'windows',
    title: 'Compatível com',
    description: 'Windows 10 e 11',
  },
  {
    icon: 'zap',
    title: 'Teste rápido',
    description: 'Resultados em segundos',
  },
  {
    icon: 'download',
    title: 'Sem instalação pesada',
    description: 'Tudo 100% online',
  },
  {
    icon: 'refresh',
    title: 'Atualizado 2026',
    description: 'Sempre com os últimos testes',
  },
  {
    icon: 'barChart',
    title: 'Benchmark em tempo real',
    description: 'Dados precisos do seu hardware',
  },
]

function HeroIcon({ type }) {
  const commonProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.9',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  }

  if (type === 'barChart') {
    return (
      <svg {...commonProps}>
        <path d="M3 3v18h18" />
        <path d="M7 16v-5" />
        <path d="M12 16V8" />
        <path d="M17 16v-9" />
      </svg>
    )
  }

  if (type === 'download') {
    return (
      <svg {...commonProps}>
        <path d="M12 3v11" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
    )
  }

  if (type === 'refresh') {
    return (
      <svg {...commonProps}>
        <path d="M21 12a9 9 0 0 1-15.2 6.5" />
        <path d="M3 12A9 9 0 0 1 18.2 5.5" />
        <path d="M18 2v4h-4" />
        <path d="M6 22v-4h4" />
      </svg>
    )
  }

  if (type === 'shieldCheck') {
    return (
      <svg {...commonProps}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
  }

  if (type === 'target') {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3" />
        <path d="M12 19v3" />
        <path d="M2 12h3" />
        <path d="M19 12h3" />
      </svg>
    )
  }

  if (type === 'windows') {
    return (
      <svg {...commonProps}>
        <path d="M3 5.3 10.5 4v7H3V5.3Z" />
        <path d="M13.5 3.5 21 2.2V11h-7.5V3.5Z" />
        <path d="M3 13h7.5v7L3 18.7V13Z" />
        <path d="M13.5 13H21v8.8l-7.5-1.3V13Z" />
      </svg>
    )
  }

  if (type === 'zap') {
    return (
      <svg {...commonProps}>
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
      </svg>
    )
  }

  return (
    <svg {...commonProps}>
      <path d="M4.34 19a8 8 0 1 1 15.32 0" />
      <path d="M4 19h16" />
      <path d="M12 14l3-3" />
      <path d="M12 4v2" />
      <path d="m4.93 7.93 1.41 1.41" />
      <path d="m19.07 7.93-1.41 1.41" />
    </svg>
  )
}

function HeroSection() {
  return (
    <section className="hero-section" id="dashboard">
      <div className="hero-visual" aria-hidden="true">
        <img src={heroImage} alt="" />
      </div>

      <div className="hero-tech-dots" aria-hidden="true" />

      <div className="hero-tech-bar" aria-label="Destaques do teste">
        {heroTechBarItems.map((item) => (
          <span className="hero-tech-bar-item" key={item.label}>
            <HeroIcon type={item.icon} />
            {item.label}
          </span>
        ))}
      </div>

      <div className="hero-content">
        <p className="eyebrow">Dashboard gamer</p>
        <h1>
          Descubra o verdadeiro <span>poder</span> do seu PC gamer
        </h1>
        <h2 className="hero-copy">
          Teste o desempenho do seu PC gamer
        </h2>
        <Link className="primary-button hero-button" to="/teste">
          TESTAR MEU PC AGORA
          <span aria-hidden="true">&rsaquo;</span>
        </Link>

        <div className="hero-mini-cards" aria-label="Benefícios do teste">
          {heroMiniCards.map((card, index) => (
            <article
              className="hero-mini-card"
              key={card.title}
              style={{ '--hero-mini-card-delay': `${index * 90}ms` }}
            >
              <span className="hero-mini-card-icon">
                <HeroIcon type={card.icon} />
              </span>
              <strong>{card.title}</strong>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="hero-proof-bar" aria-label="Informações do teste">
        {heroProofItems.map((item) => (
          <article className="hero-proof-item" key={item.title}>
            <span className="hero-proof-icon">
              <HeroIcon type={item.icon} />
            </span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default HeroSection
