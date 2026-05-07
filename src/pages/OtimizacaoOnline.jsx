import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import SEOHead from '../components/SEOHead'
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
      </main>

      <Footer />
    </div>
  )
}

export default OtimizacaoOnline
