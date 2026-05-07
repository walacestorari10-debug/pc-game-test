import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import SEOHead from '../components/SEOHead'
import { supabase } from '../lib/supabaseClient'
import { hasFeedbackSent, saveFeedbackSent } from '../utils/feedbackStorage'
import '../styles/staticPages.css'
import '../styles/otimizacaoOnline.css'

const seoStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: 'Otimização Online para Jogos',
      url: 'https://pc-game-test.vercel.app/otimizacao-online',
      description:
        'Entenda como melhorar estabilidade, reduzir ping, evitar lag e otimizar sua conexão para jogos online competitivos.',
      inLanguage: 'pt-BR',
      isPartOf: {
        '@type': 'WebSite',
        name: 'PC Game Test',
        url: 'https://pc-game-test.vercel.app/',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'VPN gamer reduz lag?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Pode reduzir em alguns casos, mas não é garantido. O resultado depende da rota, do provedor, do servidor do jogo e da localização do jogador.',
          },
        },
        {
          '@type': 'Question',
          name: 'Quando usar otimizadores de conexão para jogos?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Eles fazem mais sentido quando há perda de pacote, rotas instáveis, variação forte de ping ou distância ruim até o servidor do jogo.',
          },
        },
      ],
    },
  ],
}

const tips = [
  'Use cabo de rede sempre que possível para reduzir perda e variação de sinal.',
  'Feche downloads, backups e streams antes de jogar partidas competitivas.',
  'Escolha servidores próximos da sua região dentro do próprio jogo.',
  'Reinicie modem e roteador quando notar perda de pacote recorrente.',
  'Mantenha drivers de rede atualizados e evite muitos dispositivos usando a conexão ao mesmo tempo.',
]

const interestPage = '/otimizacao-online'

const interestOptions = [
  {
    label: 'Tenho interesse',
    value: 'interessado',
    rating: 5,
  },
  {
    label: 'Talvez',
    value: 'talvez',
    rating: 3,
  },
  {
    label: 'Não tenho interesse',
    value: 'sem-interesse',
    rating: 1,
  },
]

function OptimizationInterestBlock() {
  const [selectedOption, setSelectedOption] = useState(null)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(() =>
    hasFeedbackSent(interestPage) ? 'submitted' : 'idle',
  )

  const handleSelectOption = (option) => {
    setSelectedOption(option)
    setStatus('idle')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!selectedOption) {
      return
    }

    if (hasFeedbackSent(interestPage)) {
      setStatus('submitted')
      return
    }

    setStatus('submitting')

    try {
      if (!supabase) {
        throw new Error('Supabase environment variables are missing.')
      }

      const { error } = await supabase.from('feedbacks').insert({
        page: interestPage,
        category: 'otimizacao-online',
        type: 'interesse',
        message: message.trim() || null,
        rating: selectedOption.rating,
      })

      if (error) {
        throw error
      }

      saveFeedbackSent(interestPage)
      setMessage('')
      setStatus('submitted')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'submitted') {
    return (
      <section
        className="optimization-interest-card is-submitted"
        aria-live="polite"
      >
        <p>Obrigado! Seu feedback ajuda a decidir os próximos recursos.</p>
      </section>
    )
  }

  return (
    <section
      className="optimization-interest-card"
      aria-labelledby="optimization-interest-title"
    >
      <div className="optimization-interest-copy">
        <p className="optimization-kicker">FEEDBACK RÁPIDO</p>
        <h2 id="optimization-interest-title">
          Quer ser avisado quando essa área estiver pronta?
        </h2>
        <p>
          Estamos preparando recursos e recomendações para melhorar
          estabilidade, ping e conexão em jogos online.
        </p>
      </div>

      <form className="optimization-interest-form" onSubmit={handleSubmit}>
        <p className="optimization-interest-options-title">Opções rápidas:</p>
        <div className="optimization-interest-options" aria-label="Opções rápidas">
          {interestOptions.map((option) => (
            <button
              className={
                selectedOption?.value === option.value ? 'is-selected' : ''
              }
              type="button"
              key={option.value}
              onClick={() => handleSelectOption(option)}
              aria-pressed={selectedOption?.value === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>

        <label htmlFor="optimization-interest-message">
          Quer deixar uma sugestão?
        </label>
        <textarea
          id="optimization-interest-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Conte rapidamente o que você gostaria de ver nessa área..."
          rows={4}
        />

        <div className="optimization-interest-footer">
          {status === 'error' && (
            <span role="status">
              Não foi possível enviar agora. Tente novamente em instantes.
            </span>
          )}
          <button
            type="submit"
            disabled={!selectedOption || status === 'submitting'}
          >
            {status === 'submitting' ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </form>
    </section>
  )
}

function OtimizacaoOnline() {
  return (
    <div className="static-page optimization-page">
      <SEOHead
        title="Otimização Online para Jogos | Reduza Ping e Lag | PC Game Test"
        description="Entenda como melhorar estabilidade, reduzir ping, evitar lag e otimizar sua conexão para jogos online competitivos."
        canonicalPath="/otimizacao-online"
        structuredData={seoStructuredData}
      />
      <Header />

      <main className="static-page-main optimization-main">
        <section className="optimization-hero" aria-labelledby="optimization-title">
          <div className="optimization-hero-copy">
            <p className="optimization-kicker">OTIMIZAÇÃO ONLINE</p>
            <h1 id="optimization-title">Otimização online para jogos</h1>
            <p>
              Entenda como ping, rotas, perda de pacote e estabilidade afetam
              sua experiência em jogos online, sem promessas mágicas e com foco
              em decisões mais confiáveis.
            </p>

            <div className="optimization-cta-row" aria-label="Ações principais">
              <Link to="/teste">Testar meu PC</Link>
              <Link to="/jogos">Ver jogos analisados</Link>
              <Link to="/upgrades">Ver upgrades recomendados</Link>
            </div>
          </div>

          <div className="optimization-signal-card" aria-hidden="true">
            <div className="optimization-radar">
              <span className="radar-ring radar-ring-1" />
              <span className="radar-ring radar-ring-2" />
              <span className="radar-ring radar-ring-3" />
              <span className="radar-axis radar-axis-x" />
              <span className="radar-axis radar-axis-y" />
              <span className="radar-sweep" />
              <span className="radar-center" />
              <span className="radar-node radar-node-1" />
              <span className="radar-node radar-node-2" />
              <span className="radar-node radar-node-3" />
            </div>

            <div className="optimization-radar-status">
              <span>Ping</span>
            </div>
          </div>
        </section>

        <section className="optimization-grid" aria-label="Guia de otimização online">
          <article className="optimization-content-card">
            <h2>O que é otimização online?</h2>
            <p>
              Otimização online é o conjunto de ajustes que busca deixar a
              conexão mais estável para jogar. Ela pode envolver configuração de
              rede, escolha de servidor, redução de tráfego em segundo plano e,
              em alguns cenários, ferramentas que tentam encontrar rotas mais
              eficientes até os servidores do jogo.
            </p>
          </article>

          <article className="optimization-content-card">
            <h2>Por que o ping alto atrapalha nos jogos?</h2>
            <p>
              Ping alto aumenta o tempo entre sua ação e a resposta do servidor.
              Em jogos competitivos, isso pode aparecer como atraso nos tiros,
              movimentação imprecisa, teleporte de jogadores ou sensação de que
              você reagiu certo, mas o servidor registrou tarde.
            </p>
          </article>

          <article className="optimization-content-card">
            <h2>VPN gamer reduz lag?</h2>
            <p>
              Pode ajudar em casos específicos, principalmente quando a rota do
              seu provedor até o servidor do jogo está ruim. Mas VPN gamer não
              reduz lag sempre. Em algumas situações ela melhora a rota; em
              outras, adiciona mais uma etapa na conexão e pode piorar o ping.
            </p>
          </article>

          <article className="optimization-content-card">
            <h2>O que são rotas de conexão?</h2>
            <p>
              Rota é o caminho que seus dados percorrem até o servidor do jogo.
              Mesmo com internet rápida, uma rota instável pode causar perda de
              pacote, variação de ping e travadinhas. Por isso, velocidade de
              download alta não garante uma partida online estável.
            </p>
          </article>

          <article className="optimization-content-card">
            <h2>Quando usar serviços como VPN, aceleradores ou otimizadores?</h2>
            <p>
              Esses serviços fazem mais sentido quando você percebe problemas
              constantes de rota, perda de pacote ou ping variando muito, mesmo
              com o PC e a internet funcionando bem. O ideal é testar com calma,
              comparar antes e depois, e evitar qualquer serviço que prometa FPS
              ou ping perfeito para todos os jogos.
            </p>
          </article>

          <article className="optimization-content-card optimization-tips-card">
            <h2>Dicas para melhorar sua conexão</h2>
            <ul>
              {tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </article>

          <article className="optimization-content-card optimization-wide-card">
            <h2>Ferramentas gamer em breve</h2>
            <p>
              O PC Game Test está preparando uma área para explicar, comparar e
              organizar soluções voltadas a estabilidade online. A ideia é
              ajudar jogadores a entender quando vale testar VPN gamer,
              aceleradores de rota, ferramentas de diagnóstico e ajustes de
              conexão, sempre deixando claro que o resultado pode variar conforme
              jogo, servidor, provedor e região.
            </p>
          </article>
        </section>

        <section className="optimization-partner-card" aria-labelledby="partner-title">
          <div>
            <p className="optimization-kicker">PARCERIAS FUTURAS</p>
            <h2 id="partner-title">Serviços de otimização gamer</h2>
            <p>
              Em breve, esta área poderá receber recomendações de serviços
              voltados a estabilidade, redução de ping e conexão para jogos
              online.
            </p>
          </div>
          <button type="button" disabled>
            Parcerias em breve
          </button>
        </section>

        <OptimizationInterestBlock />
      </main>

      <Footer />
    </div>
  )
}

export default OtimizacaoOnline
