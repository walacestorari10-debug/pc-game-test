import { withAmazonAffiliateLinks } from './affiliateLinks'

export const articleProductRecommendations = {
  'como-aumentar-fps-em-jogos': {
    title: 'Upgrades que podem ajudar no FPS',
    description:
      'Use estes cards como ponto de partida quando os ajustes de software não forem suficientes e o gargalo estiver no hardware.',
    note:
      'Antes de comprar, confirme compatibilidade com placa-mãe, fonte, gabinete e processador.',
    items: [
      {
        label: 'GPU',
        name: 'Placa de vídeo para 1080p',
        reason:
          'Boa opção quando a GPU atual fica em 100% de uso e você precisa reduzir muito os gráficos para manter FPS.',
        detail: 'Procure modelos com 8GB ou mais de VRAM para jogos atuais em Full HD.',
        link: '#',
        isAffiliatePending: true,
      },
      {
        label: 'RAM',
        name: 'Memória RAM 16GB ou 32GB',
        reason:
          'Ajuda a reduzir travamentos quando o PC fica sem memória com jogo, Discord, navegador e launcher abertos.',
        detail: 'Prefira kits em dual channel, como 2x8GB ou 2x16GB.',
        link: '#',
        isAffiliatePending: true,
      },
      {
        label: 'SSD',
        name: 'SSD NVMe 1TB',
        reason:
          'Não aumenta FPS médio em todos os jogos, mas melhora carregamentos e reduz engasgos causados por disco lento.',
        detail: 'Ideal para Windows, jogos principais e programas usados com frequência.',
        link: '#',
        isAffiliatePending: true,
      },
    ],
  },
  'melhor-placa-de-video-custo-beneficio': {
    title: 'Placas de vídeo para comparar',
    description:
      'Compare por resolução, VRAM, consumo e preço final. O melhor custo-benefício muda bastante conforme promoção e estoque.',
    note:
      'Confira também o consumo da GPU e se sua fonte possui potência e conectores suficientes.',
    items: [
      {
        label: '1080p',
        name: 'GPU 8GB para Full HD',
        reason:
          'Equilibrada para quem joga em 1080p e quer presets médios ou altos sem montar um PC caro.',
        detail: 'Boa faixa para e-sports, battle royale e jogos single-player em Full HD.',
        link: '#',
        isAffiliatePending: true,
      },
      {
        label: '1440p',
        name: 'GPU 12GB ou 16GB para Quad HD',
        reason:
          'Mais indicada para jogar em 1440p com texturas altas e maior folga para jogos novos.',
        detail: 'Priorize desempenho bruto, VRAM e eficiência energética.',
        link: '#',
        isAffiliatePending: true,
      },
      {
        label: 'Recursos',
        name: 'GPU com upscaling moderno',
        reason:
          'DLSS, FSR ou XeSS podem ajudar a ganhar FPS mantendo boa qualidade de imagem em jogos compatíveis.',
        detail: 'Compare suporte a tecnologias, garantia e desempenho nos jogos que você joga.',
        link: '#',
        isAffiliatePending: true,
      },
    ],
  },
  'quanto-de-ram-precisa': {
    title: 'Memórias para montar um setup equilibrado',
    description:
      'A quantidade ideal depende do seu uso, mas dual channel e compatibilidade com a plataforma fazem muita diferença.',
    note:
      'Verifique se sua placa-mãe usa DDR4 ou DDR5 antes de escolher o kit.',
    items: [
      {
        label: 'Entrada',
        name: 'Kit 16GB DDR4',
        reason:
          'Ponto ideal para a maioria dos jogadores que querem sair de 8GB sem gastar demais.',
        detail: 'Procure 2x8GB com frequência compatível com sua placa-mãe.',
        link: '#',
        isAffiliatePending: true,
      },
      {
        label: 'Folga',
        name: 'Kit 32GB DDR4',
        reason:
          'Boa escolha para jogos pesados, mods, multitarefa, streaming leve e uso com vários apps abertos.',
        detail: '2x16GB costuma ser o formato mais prático para upgrades.',
        link: '#',
        isAffiliatePending: true,
      },
      {
        label: 'Atual',
        name: 'Kit 32GB DDR5',
        reason:
          'Faz sentido em plataformas novas e setups pensados para durar mais tempo.',
        detail: 'Confirme suporte do processador e da placa-mãe antes da compra.',
        link: '#',
        isAffiliatePending: true,
      },
    ],
  },
  'otimizacao-windows-para-jogos': {
    title: 'Peças que combinam com um Windows mais rápido',
    description:
      'Depois de otimizar o sistema, estes upgrades podem atacar gargalos comuns de inicialização, carregamento e temperatura.',
    note:
      'Faça primeiro os ajustes gratuitos do artigo; compre hardware apenas se o gargalo continuar claro.',
    items: [
      {
        label: 'Sistema',
        name: 'SSD NVMe para Windows',
        reason:
          'Deixa inicialização, abertura de programas e carregamento de jogos muito mais rápidos que em HD.',
        detail: 'Um modelo de 1TB costuma equilibrar preço, espaço e velocidade.',
        link: '#',
        isAffiliatePending: true,
      },
      {
        label: 'Memória',
        name: 'RAM em dual channel',
        reason:
          'Reduz uso de memória virtual e ajuda o sistema a manter jogos e apps abertos com menos engasgos.',
        detail: 'Kits 2x8GB ou 2x16GB são os mais comuns para jogos.',
        link: '#',
        isAffiliatePending: true,
      },
      {
        label: 'Temperatura',
        name: 'Cooler para CPU',
        reason:
          'Ajuda quando o processador esquenta demais e reduz frequência durante partidas longas.',
        detail: 'Confira altura do cooler, socket compatível e espaço no gabinete.',
        link: '#',
        isAffiliatePending: true,
      },
    ],
  },
  'ssd-vs-hd': {
    title: 'SSDs para comparar preço',
    description:
      'Se a ideia é sair do HD, compare capacidade, tipo de conexão e garantia antes de escolher.',
    note:
      'NVMe precisa de slot M.2 compatível. Se o PC não tiver, um SSD SATA ainda é uma grande melhoria sobre HD.',
    items: [
      {
        label: 'Melhor salto',
        name: 'SSD NVMe 1TB',
        reason:
          'Ótimo para instalar Windows, programas e vários jogos grandes sem ficar apagando arquivos toda hora.',
        detail: 'Geralmente é o melhor equilíbrio entre espaço, velocidade e preço.',
        link: '#',
        isAffiliatePending: true,
      },
      {
        label: 'Compatibilidade',
        name: 'SSD SATA 1TB',
        reason:
          'Boa alternativa para PCs sem slot M.2 ou para notebooks e desktops mais antigos.',
        detail: 'Muito mais rápido que HD, mesmo não sendo tão veloz quanto NVMe.',
        link: '#',
        isAffiliatePending: true,
      },
      {
        label: 'Biblioteca',
        name: 'SSD NVMe 2TB',
        reason:
          'Indicado para quem instala muitos jogos grandes, grava gameplay ou trabalha com arquivos pesados.',
        detail: 'Custa mais, mas evita trocar ou adicionar armazenamento cedo demais.',
        link: '#',
        isAffiliatePending: true,
      },
    ],
  },
  'atualizar-drivers-nvidia': {
    title: 'GPUs NVIDIA para acompanhar preço',
    description:
      'Se você usa drivers NVIDIA e pensa em upgrade, compare modelos por resolução, VRAM, consumo e recursos como DLSS.',
    note:
      'Atualizar driver não resolve gargalo de hardware. Troque GPU apenas quando o limite estiver claro nos seus jogos.',
    items: [
      {
        label: 'Full HD',
        name: 'GeForce para 1080p',
        reason:
          'Boa faixa para quem joga em Full HD e quer suporte a tecnologias NVIDIA sem mirar no topo de linha.',
        detail: 'Compare VRAM, garantia e desempenho nos seus jogos principais.',
        link: '#',
        isAffiliatePending: true,
      },
      {
        label: 'Quad HD',
        name: 'GeForce para 1440p',
        reason:
          'Indicada para quem usa monitor 1440p e quer mais folga com presets altos.',
        detail: 'Priorize modelos com mais VRAM e boa eficiência energética.',
        link: '#',
        isAffiliatePending: true,
      },
      {
        label: 'Criação',
        name: 'GeForce com mais VRAM',
        reason:
          'Mais interessante para quem joga, edita vídeo, usa 3D ou trabalha com projetos que consomem memória gráfica.',
        detail: 'Observe consumo, tamanho físico da placa e exigência de fonte.',
        link: '#',
        isAffiliatePending: true,
      },
    ],
  },
}

export function getArticleProductRecommendations(slug) {
  const recommendations = articleProductRecommendations[slug]

  if (!recommendations) {
    return null
  }

  return {
    ...recommendations,
    items: withAmazonAffiliateLinks(recommendations.items),
  }
}
