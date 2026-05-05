import { affiliateLinks } from './affiliateLinks'

const fallbackAffiliateLink = '#'

function getAffiliateLink(upgradeName) {
  return affiliateLinks[upgradeName]?.amazon ?? fallbackAffiliateLink
}

function withAffiliateLinks(upgrades) {
  return upgrades.map((upgrade) => {
    const link = getAffiliateLink(upgrade.name)

    return {
      ...upgrade,
      link,
      isAffiliatePending: link === fallbackAffiliateLink,
    }
  })
}

const baseUpgradeRecommendations = {
  'Placa de vídeo': [
    {
      name: 'RTX 3060 12GB',
      type: 'GPU',
      expectedGain: '+35%',
      description:
        'Boa opção para 1080p alto, texturas mais pesadas e mais estabilidade em jogos atuais.',
      link: '#',
      isAffiliatePending: true,
    },
    {
      name: 'RTX 4060',
      type: 'GPU',
      expectedGain: '+45%',
      description:
        'Upgrade eficiente para melhorar FPS, consumo e folga em presets altos.',
      link: '#',
      isAffiliatePending: true,
    },
    {
      name: 'RTX 4070',
      type: 'GPU',
      expectedGain: '+70%',
      description:
        'Salto forte para 1440p, presets altos e maior vida útil em jogos pesados.',
      link: '#',
      isAffiliatePending: true,
    },
  ],
  Processador: [
    {
      name: 'Intel Core i5-12400F',
      type: 'CPU',
      expectedGain: '+28%',
      description:
        'Processador equilibrado para reduzir quedas e melhorar consistência em jogos.',
      link: '#',
      isAffiliatePending: true,
    },
    {
      name: 'AMD Ryzen 5 5600',
      type: 'CPU',
      expectedGain: '+30%',
      description:
        'Ótimo custo-benefício para setups gamer em 1080p e multitarefa leve.',
      link: '#',
      isAffiliatePending: true,
    },
    {
      name: 'AMD Ryzen 7 5800X',
      type: 'CPU',
      expectedGain: '+42%',
      description:
        'Mais núcleos e folga para jogos exigentes, streaming e tarefas paralelas.',
      link: '#',
      isAffiliatePending: true,
    },
  ],
  'Memória RAM': [
    {
      name: '16GB DDR4 3200MHz',
      type: 'RAM',
      expectedGain: '+18%',
      description:
        'Ponto mínimo recomendado para jogos atuais com menos travamentos.',
      link: '#',
      isAffiliatePending: true,
    },
    {
      name: '32GB DDR4 3200MHz',
      type: 'RAM',
      expectedGain: '+28%',
      description:
        'Mais folga para mundos abertos, navegador, Discord e jogos com assets maiores.',
      isAffiliatePending: true,
      link: '#',
    },
    {
      name: '32GB DDR5',
      type: 'RAM',
      expectedGain: '+34%',
      description:
        'Memória moderna com boa margem para plataformas novas e multitarefa pesada.',
      link: '#',
      isAffiliatePending: true,
    },
  ],
  Armazenamento: [
    {
      name: 'SSD SATA 1TB',
      type: 'Storage',
      expectedGain: '+22%',
      description:
        'Melhora tempos de carregamento e reduz engasgos causados por HD.',
      link: '#',
      isAffiliatePending: true,
    },
    {
      name: 'SSD NVMe 1TB',
      type: 'Storage',
      expectedGain: '+34%',
      description:
        'Opção recomendada para carregamentos rápidos e sistema mais responsivo.',
      link: '#',
      isAffiliatePending: true,
    },
    {
      name: 'SSD NVMe 2TB',
      type: 'Storage',
      expectedGain: '+40%',
      description:
        'Mais espaço e velocidade para bibliotecas grandes de jogos atuais.',
      link: '#',
      isAffiliatePending: true,
    },
  ],
  balanced: [
    {
      name: 'RTX 4060',
      type: 'GPU',
      expectedGain: '+35%',
      description:
        'Upgrade equilibrado para ganhar FPS mantendo bom consumo de energia.',
      link: '#',
      isAffiliatePending: true,
    },
    {
      name: 'SSD NVMe 1TB',
      type: 'Storage',
      expectedGain: '+28%',
      description:
        'Melhora carregamentos, instalação de jogos e resposta geral do sistema.',
      link: '#',
      isAffiliatePending: true,
    },
    {
      name: '32GB RAM',
      type: 'RAM',
      expectedGain: '+18%',
      description:
        'Mais folga para multitarefa, jogos pesados e futuros lançamentos.',
      link: '#',
      isAffiliatePending: true,
    },
  ],
}

export const upgradeRecommendations = Object.fromEntries(
  Object.entries(baseUpgradeRecommendations).map(([group, upgrades]) => [
    group,
    withAffiliateLinks(upgrades),
  ]),
)

export function getUpgradeRecommendations(bottleneck) {
  return upgradeRecommendations[bottleneck] ?? upgradeRecommendations.balanced
}
