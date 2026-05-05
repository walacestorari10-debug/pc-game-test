import gpuImage from '../assets/images/optimized/gpu.webp'
import nvidiaImage from '../assets/images/optimized/nvidia.webp'
import otimizacaoImage from '../assets/images/optimized/otmizacao.webp'
import ramImage from '../assets/images/optimized/ram.webp'
import soldadoImage from '../assets/images/optimized/soldado.webp'
import ssdImage from '../assets/images/optimized/ssd.webp'

export const articles = [
  {
    slug: 'como-aumentar-fps-em-jogos',
    title: 'Como aumentar FPS em jogos',
    description:
      'Ajustes práticos para ganhar FPS, reduzir quedas e deixar seus jogos mais estáveis sem precisar trocar peças imediatamente.',
    category: 'Desempenho',
    readTime: '4 min de leitura',
    image: soldadoImage,
    imageAspectRatio: '3 / 2',
    date: '2026-05-05',
    author: 'Equipe PC Game Test',
    visual: 'fps',
    topics: ['performance', 'gpu', 'cpu', 'ram', 'optimization', 'windows'],
    contentSections: [
      {
        heading: 'Comece reduzindo os ajustes que mais pesam',
        paragraphs: [
          'Sombras, reflexos, ray tracing, oclusão de ambiente e distância de visão costumam pesar bastante na GPU. Reduzir esses itens primeiro costuma entregar mais FPS com perda visual menor do que simplesmente colocar tudo no mínimo.',
          'Texturas dependem muito da VRAM. Se sua placa de vídeo tem pouca memória, reduza texturas para evitar travamentos, carregamento lento de cenário e quedas bruscas em áreas abertas.',
        ],
      },
      {
        heading: 'Atualize drivers com critério',
        paragraphs: [
          'Drivers novos podem melhorar desempenho em jogos recentes, corrigir bugs e otimizar estabilidade. Para jogos recém-lançados, vale conferir se há driver específico antes de jogar.',
          'Se o PC ficou instável depois de uma atualização, volte para uma versão anterior ou faça uma instalação limpa do driver. O ganho de FPS não compensa travamentos constantes.',
        ],
      },
      {
        heading: 'Ative recursos do sistema para jogos',
        paragraphs: [
          'No Windows, o Modo de Jogo ajuda a priorizar recursos para o jogo aberto. Ele não faz milagre, mas pode reduzir interferências de processos em segundo plano.',
          'Também vale revisar capturas automáticas, overlays e gravação em segundo plano. Esses recursos podem consumir CPU, GPU e disco sem você perceber.',
        ],
      },
      {
        heading: 'Feche programas em segundo plano',
        paragraphs: [
          'Navegadores com muitas abas, launchers, clientes de chat, gravação de tela e apps de RGB podem ocupar memória e processamento. Antes de jogar, feche o que não for necessário.',
          'Em PCs com 8GB ou 16GB de RAM, essa limpeza costuma ser ainda mais importante, principalmente em jogos de mundo aberto ou battle royale.',
        ],
      },
      {
        heading: 'Ajuste resolução e escala de renderização',
        paragraphs: [
          'Diminuir a resolução aumenta bastante o FPS, mas pode deixar a imagem menos nítida. Uma alternativa melhor é reduzir a escala de renderização dentro do jogo ou usar recursos como FSR, DLSS ou XeSS quando disponíveis.',
          'Para monitores 1080p, testar escala entre 85% e 95% pode equilibrar qualidade e desempenho. Em 1440p ou 4K, tecnologias de upscaling fazem ainda mais diferença.',
        ],
      },
      {
        heading: 'Verifique temperatura e estabilidade',
        paragraphs: [
          'CPU e GPU muito quentes reduzem frequência automaticamente para evitar dano. Isso causa perda de FPS, stutter e quedas durante partidas longas.',
          'Limpeza interna, troca de pasta térmica, curva de fan bem configurada e gabinete ventilado podem recuperar desempenho sem upgrade de hardware.',
        ],
      },
    ],
  },
  {
    slug: 'melhor-placa-de-video-custo-beneficio',
    title: 'Melhor placa de vídeo custo-benefício em 2026',
    description:
      'Entenda como escolher uma GPU equilibrada para 1080p, 1440p, consumo de energia, VRAM e vida útil do seu setup.',
    category: 'Hardware',
    readTime: '4 min de leitura',
    image: gpuImage,
    imageAspectRatio: '3 / 2',
    date: '2026-05-05',
    author: 'Equipe PC Game Test',
    visual: 'gpu',
    topics: ['gpu', 'cpu', 'performance'],
    contentSections: [
      {
        heading: 'Para 1080p, equilíbrio vale mais que exagero',
        paragraphs: [
          'Em 1080p, uma placa intermediária costuma entregar ótima experiência com presets altos. O ideal é buscar uma GPU que mantenha boa média de FPS sem exigir fonte muito forte ou processador caro.',
          'Se o objetivo é jogar competitivo em 144Hz, priorize estabilidade e baixa latência. Para campanha e jogos single-player, qualidade visual e VRAM podem pesar mais na decisão.',
        ],
      },
      {
        heading: 'Para 1440p, a exigência sobe',
        paragraphs: [
          '1440p aumenta bastante a carga sobre a GPU. Nesse cenário, placas com mais desempenho bruto e mais VRAM fazem diferença para manter texturas altas e FPS confortável.',
          'Se você pretende migrar de 1080p para 1440p, não escolha a placa pensando apenas no jogo atual. Considere uma margem para lançamentos futuros.',
        ],
      },
      {
        heading: 'Consumo de energia também é custo-benefício',
        paragraphs: [
          'Uma GPU barata pode sair cara se exigir fonte nova, consumir muito e esquentar demais. Antes de comprar, confira consumo típico, conectores de energia e recomendação de fonte.',
          'Modelos eficientes ajudam a manter temperatura menor, ruído mais baixo e mais estabilidade em gabinetes compactos.',
        ],
      },
      {
        heading: 'VRAM influencia texturas e vida útil',
        paragraphs: [
          'A VRAM não aumenta FPS sozinha, mas evita gargalos em texturas altas, mapas grandes e resoluções maiores. Jogos atuais já podem consumir bastante memória de vídeo.',
          'Para 1080p, 8GB ainda pode ser suficiente em muitos jogos. Para 1440p e presets altos, buscar mais VRAM dá margem melhor.',
        ],
      },
      {
        heading: 'Quando vale trocar de placa de vídeo',
        paragraphs: [
          'Vale trocar quando você precisa reduzir qualidade demais para manter FPS, quando a VRAM está sempre no limite ou quando a GPU fica em 100% enquanto CPU e RAM têm folga.',
          'Se o gargalo principal for processador, trocar só a placa de vídeo pode não entregar o ganho esperado. Antes da compra, compare o conjunto inteiro do seu setup.',
        ],
      },
    ],
  },
  {
    slug: 'quanto-de-ram-precisa',
    title: 'Quanto de RAM você realmente precisa?',
    description:
      'Veja quando 8GB ainda serve, por que 16GB virou o ponto ideal e quando 32GB fazem sentido para jogos e multitarefa.',
    category: 'Guias',
    readTime: '3 min de leitura',
    image: ramImage,
    imageAspectRatio: '3 / 2',
    date: '2026-05-05',
    author: 'Equipe PC Game Test',
    visual: 'ram',
    topics: ['ram', 'performance'],
    contentSections: [
      {
        heading: '8GB: o mínimo para jogos leves',
        paragraphs: [
          '8GB de RAM ainda podem rodar jogos leves, e-sports e títulos mais antigos, mas a margem é pequena. Com navegador, Discord e launcher abertos, o sistema pode começar a usar memória virtual no disco.',
          'Quando isso acontece, aparecem travamentos, carregamentos lentos e quedas de fluidez mesmo que CPU e GPU pareçam suficientes.',
        ],
      },
      {
        heading: '16GB: o ponto ideal para a maioria',
        paragraphs: [
          '16GB são hoje a escolha mais equilibrada para jogar em 1080p e 1440p com apps comuns em segundo plano. É a quantidade que reduz problemas sem encarecer demais o setup.',
          'Para quem joga battle royale, mundo aberto ou jogos recentes, 16GB em dual channel costuma ser uma melhoria clara em relação a 8GB.',
        ],
      },
      {
        heading: '32GB: folga para jogos pesados e multitarefa',
        paragraphs: [
          '32GB fazem sentido para quem joga títulos muito pesados, usa mods, grava gameplay, faz streaming ou mantém muitos programas abertos.',
          'Nem todo jogo vai usar 32GB, mas a folga ajuda o sistema a respirar e prepara melhor o PC para lançamentos futuros.',
        ],
      },
      {
        heading: 'Dual channel importa',
        paragraphs: [
          'Dois pentes trabalhando em dual channel entregam mais largura de banda do que um pente único. Isso pode melhorar FPS mínimo e reduzir engasgos em vários jogos.',
          'Na prática, 2x8GB costuma ser melhor que 1x16GB para jogos, desde que sua placa-mãe tenha slots disponíveis.',
        ],
      },
      {
        heading: 'DDR4 vs DDR5',
        paragraphs: [
          'DDR5 oferece maior largura de banda e faz mais sentido em plataformas novas. DDR4 ainda é muito competente e pode ser a melhor escolha de custo-benefício em upgrades de PCs existentes.',
          'Antes de comprar, verifique compatibilidade da placa-mãe e processador. DDR4 e DDR5 não são intercambiáveis no mesmo slot.',
        ],
      },
    ],
  },
  {
    slug: 'otimizacao-windows-para-jogos',
    title: 'Otimização do Windows para jogos',
    description:
      'Configurações essenciais no Windows para reduzir processos inúteis, melhorar estabilidade e preparar o sistema para jogar.',
    category: 'Software',
    readTime: '4 min de leitura',
    image: otimizacaoImage,
    imageAspectRatio: '3 / 2',
    date: '2026-05-05',
    author: 'Equipe PC Game Test',
    visual: 'windows',
    topics: ['optimization', 'windows', 'performance'],
    contentSections: [
      {
        heading: 'Ative o Modo de Jogo',
        paragraphs: [
          'O Modo de Jogo do Windows ajuda o sistema a priorizar recursos para o jogo em execução. Ele não substitui hardware forte, mas reduz interferências durante partidas.',
          'Depois de ativar, teste seus jogos principais. Em alguns PCs o ganho aparece nos FPS mínimos, mais do que na média.',
        ],
      },
      {
        heading: 'Use um plano de energia adequado',
        paragraphs: [
          'Em desktops, usar um plano de energia de alto desempenho pode evitar quedas de frequência agressivas. Em notebooks, conecte o carregador antes de jogar.',
          'Cuidado com planos extremos que aumentam temperatura sem necessidade. O melhor ajuste é o que mantém desempenho estável sem aquecer demais.',
        ],
      },
      {
        heading: 'Limpe a inicialização',
        paragraphs: [
          'Muitos programas iniciam com o Windows e ficam consumindo RAM, CPU e disco. Revise a aba de inicialização do Gerenciador de Tarefas e desative o que não precisa abrir sempre.',
          'Launchers, atualizadores, apps de periféricos e ferramentas de sincronização são bons candidatos para revisão.',
        ],
      },
      {
        heading: 'Evite serviços e overlays desnecessários',
        paragraphs: [
          'Overlays de gravação, contadores, chats e recursos sociais podem causar conflitos ou consumir recursos. Mantenha apenas os que você realmente usa.',
          'Não desative serviços do Windows sem saber a função. A meta é reduzir excesso, não quebrar atualização, áudio, rede ou segurança.',
        ],
      },
      {
        heading: 'Mantenha drivers essenciais em dia',
        paragraphs: [
          'Driver de GPU é o mais lembrado, mas chipset, rede, áudio e Windows Update também importam. Um sistema desatualizado pode ter stutters e incompatibilidades.',
          'Faça mudanças uma por vez e teste. Assim fica mais fácil descobrir qual ajuste realmente melhorou ou piorou o desempenho.',
        ],
      },
    ],
  },
  {
    slug: 'ssd-vs-hd',
    title: 'SSD vs HD: qual vale mais a pena em 2026?',
    description:
      'Comparativo direto entre SSD e HD para sistema operacional, jogos grandes, carregamentos, NVMe e custo-benefício.',
    category: 'Hardware',
    readTime: '3 min de leitura',
    image: ssdImage,
    imageAspectRatio: '1652 / 952',
    date: '2026-05-05',
    author: 'Equipe PC Game Test',
    visual: 'ssd',
    topics: ['optimization', 'performance'],
    contentSections: [
      {
        heading: 'Tempo de carregamento é a diferença mais visível',
        paragraphs: [
          'A troca de HD para SSD reduz bastante o tempo para abrir Windows, carregar mapas, iniciar jogos e alternar entre programas.',
          'Em jogos modernos, um SSD também ajuda no carregamento contínuo de textura e cenário, reduzindo travamentos causados por disco lento.',
        ],
      },
      {
        heading: 'Sistema operacional deve ficar no SSD',
        paragraphs: [
          'Se você tem SSD e HD no mesmo PC, instale o Windows e programas principais no SSD. Isso deixa o computador inteiro mais responsivo.',
          'O HD pode continuar útil para arquivos grandes, backups, mídia e jogos menos exigentes.',
        ],
      },
      {
        heading: 'Jogos grandes se beneficiam muito',
        paragraphs: [
          'Jogos de mundo aberto, battle royale e títulos com muitos assets carregam melhor em SSD. A melhora nem sempre aparece como FPS maior, mas aparece como fluidez e menos espera.',
          'Com jogos passando facilmente de 100GB, capacidade também importa. Um SSD de 1TB costuma ser o ponto mais confortável.',
        ],
      },
      {
        heading: 'NVMe é mais rápido, mas nem sempre obrigatório',
        paragraphs: [
          'SSDs NVMe são muito mais rápidos que SSDs SATA em leitura sequencial, instalação e transferência de arquivos. Para uso geral e jogos, ambos já são muito melhores que HD.',
          'Se a diferença de preço for pequena, escolha NVMe. Se o orçamento estiver apertado, um bom SSD SATA ainda transforma a experiência.',
        ],
      },
      {
        heading: 'Custo-benefício: combine os dois se precisar',
        paragraphs: [
          'A melhor estratégia para muitos PCs é SSD para sistema e jogos principais, HD para armazenamento frio. Assim você equilibra velocidade e espaço.',
          'Se você joga poucos títulos por vez, um SSD maior pode substituir o HD completamente e simplificar o setup.',
        ],
      },
    ],
  },
  {
    slug: 'atualizar-drivers-nvidia',
    title: 'Como atualizar drivers NVIDIA corretamente',
    description:
      'Aprenda quando atualizar drivers NVIDIA, a diferença entre Game Ready e Studio Driver e como fazer instalação limpa com segurança.',
    category: 'Software',
    readTime: '3 min de leitura',
    image: nvidiaImage,
    imageAspectRatio: '1654 / 951',
    date: '2026-05-05',
    author: 'Equipe PC Game Test',
    visual: 'drivers',
    topics: ['gpu', 'optimization', 'windows', 'performance'],
    contentSections: [
      {
        heading: 'Game Ready Driver ou Studio Driver?',
        paragraphs: [
          'O Game Ready Driver é focado em jogos, especialmente lançamentos recentes e correções específicas para títulos populares. Para a maioria dos gamers, ele é a escolha natural.',
          'O Studio Driver prioriza estabilidade em apps criativos, edição, 3D e produção. Ele também roda jogos, mas pode receber otimizações gamer com menos urgência.',
        ],
      },
      {
        heading: 'Use o GeForce Experience com atenção',
        paragraphs: [
          'O GeForce Experience facilita baixar e instalar drivers, além de oferecer otimização automática de jogos. É prático para quem não quer procurar o instalador manualmente.',
          'Se você prefere um sistema mais limpo, pode baixar o driver direto no site da NVIDIA e instalar apenas os componentes necessários.',
        ],
      },
      {
        heading: 'Quando fazer instalação limpa',
        paragraphs: [
          'Instalação limpa é recomendada quando há troca de placa, bugs gráficos, queda de desempenho depois de atualizar ou conflito com versões antigas.',
          'Durante a instalação do driver NVIDIA, marque a opção de instalação personalizada e escolha instalação limpa para redefinir perfis e configurações anteriores.',
        ],
      },
      {
        heading: 'Quando atualizar e quando esperar',
        paragraphs: [
          'Atualize quando um jogo novo pedir driver recente, quando houver correção de bug importante ou quando você estiver enfrentando problema conhecido.',
          'Se tudo está estável e você não joga lançamentos recentes, esperar alguns dias antes de atualizar pode evitar bugs de versões recém-lançadas.',
        ],
      },
      {
        heading: 'Teste depois da atualização',
        paragraphs: [
          'Depois de atualizar, teste seus jogos principais e observe FPS, temperatura, uso de GPU e estabilidade. Um driver bom deve melhorar ou manter a experiência.',
          'Se aparecerem travamentos, telas pretas ou queda de FPS, volte para a versão anterior e aguarde uma correção.',
        ],
      },
    ],
  },
]

export function getArticleBySlug(slug) {
  return articles.find((article) => article.slug === slug) ?? null
}

export function getRelatedArticles(currentSlug, limit = 3) {
  const currentArticle = getArticleBySlug(currentSlug)

  if (!currentArticle) {
    return articles.slice(0, limit)
  }

  const sameCategory = articles.filter(
    (article) =>
      article.slug !== currentSlug && article.category === currentArticle.category,
  )
  const otherArticles = articles.filter(
    (article) =>
      article.slug !== currentSlug && article.category !== currentArticle.category,
  )

  return [...sameCategory, ...otherArticles].slice(0, limit)
}
