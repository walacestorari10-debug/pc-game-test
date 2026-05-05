import { affiliateLinks } from './affiliateLinks'
import { cpus, gpus, ram, storage } from './hardware'

const fallbackAffiliateLink = '#'
const tierLabels = {
  entry: 'entrada',
  mid: 'intermediário',
  high: 'alto',
  enthusiast: 'entusiasta',
  desconhecido: 'não identificado',
}

const componentConfigs = {
  cpu: {
    setupKey: 'cpu',
    catalog: cpus,
    type: 'CPU',
    fallbackGroup: 'Processador',
    label: 'processador',
  },
  gpu: {
    setupKey: 'gpu',
    catalog: gpus,
    type: 'GPU',
    fallbackGroup: 'Placa de vídeo',
    label: 'placa de vídeo',
  },
  ram: {
    setupKey: 'ram',
    catalog: ram,
    type: 'RAM',
    fallbackGroup: 'Memória RAM',
    label: 'memória RAM',
  },
  storage: {
    setupKey: 'storage',
    catalog: storage,
    type: 'Storage',
    fallbackGroup: 'Armazenamento',
    label: 'armazenamento',
  },
}

const bottleneckToComponent = {
  Processador: 'cpu',
  'Placa de vídeo': 'gpu',
  'Memória RAM': 'ram',
  Armazenamento: 'storage',
}

const smartCandidateNames = {
  cpu: [
    'AMD Ryzen 5 5600',
    'Intel Core i5-12400F',
    'AMD Ryzen 7 5700X3D',
    'Intel Core i5-13400F',
    'AMD Ryzen 5 7600',
    'Intel Core i5-14600K',
    'AMD Ryzen 7 7800X3D',
    'AMD Ryzen 7 9800X3D',
  ],
  gpu: [
    'GTX 1660 Super',
    'RX 6600',
    'RTX 3060 12GB',
    'RTX 4060',
    'RTX 4060 Ti',
    'RX 6700 XT',
    'RX 7800 XT',
    'RTX 4070',
    'RTX 4070 Super',
    'RTX 4070 Ti Super',
    'RTX 4080 Super',
    'RTX 4090',
  ],
  ram: [
    '16GB DDR4',
    '16GB DDR5',
    '32GB DDR4',
    '32GB DDR5',
    '64GB DDR4',
    '64GB DDR5',
  ],
  storage: [
    'SSD SATA 1TB',
    'SSD NVMe 1TB',
    'SSD NVMe 2TB',
    'SSD NVMe Gen4 1TB',
    'SSD NVMe Gen4 2TB',
    'SSD NVMe Gen5 2TB',
    'SSD NVMe 4TB',
  ],
}

const smartUpgradeLevels = ['Upgrade seguro', 'Salto equilibrado', 'Salto forte']

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

function findHardwarePart(catalog, name) {
  return catalog.find((part) => part.name === name) ?? null
}

function getCurrentPart(componentKey, setup) {
  const config = componentConfigs[componentKey]

  if (!config || !setup?.[config.setupKey]) {
    return null
  }

  return findHardwarePart(config.catalog, setup[config.setupKey])
}

function getCandidateParts(componentKey) {
  const config = componentConfigs[componentKey]

  return smartCandidateNames[componentKey]
    .map((name) => findHardwarePart(config.catalog, name))
    .filter(Boolean)
    .sort((first, second) => first.score - second.score)
}

function getMinimumScoreGap(score) {
  if (score < 55) {
    return 10
  }

  if (score < 75) {
    return 7
  }

  if (score < 90) {
    return 5
  }

  return 2
}

function uniqueParts(parts) {
  const seenNames = new Set()

  return parts.filter((part) => {
    if (!part || seenNames.has(part.name)) {
      return false
    }

    seenNames.add(part.name)

    return true
  })
}

function pickProgressiveCandidates(candidates, currentScore) {
  if (candidates.length <= 3) {
    return candidates
  }

  const thresholds = [
    currentScore + getMinimumScoreGap(currentScore),
    currentScore + 18,
    currentScore + 30,
  ]
  const progressivePicks = thresholds.map(
    (threshold) =>
      candidates.find((candidate) => candidate.score >= threshold) ??
      candidates.at(-1),
  )
  const pickedParts = uniqueParts(progressivePicks)

  if (pickedParts.length >= 3) {
    return pickedParts.slice(0, 3)
  }

  return uniqueParts([...pickedParts, ...candidates]).slice(0, 3)
}

function getExpectedGain(componentKey, scoreGap, index) {
  if (componentKey === 'ram') {
    return ['Menos travamentos', 'Mais folga', 'Base para jogos pesados'][index]
  }

  if (componentKey === 'storage') {
    return ['Carregamento rápido', 'Resposta melhor', 'Biblioteca maior'][index]
  }

  const estimatedGain = Math.min(Math.max(Math.round(scoreGap * 1.2), 8), 80)

  return `+${estimatedGain}% potencial`
}

function getSmartDescription(componentKey, currentPart, candidate, index) {
  const level = smartUpgradeLevels[index] ?? smartUpgradeLevels[0]
  const currentName = currentPart?.name ?? 'o hardware atual'
  const targetTier = tierLabels[candidate.tier] ?? candidate.tier

  if (componentKey === 'gpu') {
    return `${level} acima de ${currentName}, mirando um nível ${targetTier} para ganhar FPS e qualidade gráfica. Verifique fonte, espaço e conectores.`
  }

  if (componentKey === 'cpu') {
    return `${level} acima de ${currentName}, mirando um nível ${targetTier} para reduzir quedas de FPS. Verifique socket, placa-mãe e memória compatível.`
  }

  if (componentKey === 'ram') {
    return `${level} acima de ${currentName}, mirando um nível ${targetTier} para reduzir travamentos e dar folga em multitarefa. Confira o tipo DDR da sua placa-mãe.`
  }

  return `${level} acima de ${currentName}, mirando um nível ${targetTier} para melhorar carregamentos e resposta do sistema.`
}

function createSmartUpgrade(componentKey, candidate, currentPart, index) {
  const config = componentConfigs[componentKey]
  const currentScore = currentPart?.score ?? 0
  const link = getAffiliateLink(candidate.name)

  return {
    name: candidate.name,
    type: config.type,
    expectedGain: getExpectedGain(componentKey, candidate.score - currentScore, index),
    description: getSmartDescription(componentKey, currentPart, candidate, index),
    tier: candidate.tier,
    currentHardware: currentPart?.name,
    link,
    isAffiliatePending: link === fallbackAffiliateLink,
  }
}

function getSmartRecommendationsForComponent(componentKey, setup) {
  const currentPart = getCurrentPart(componentKey, setup)
  const currentScore = currentPart?.score ?? 0
  const candidates = getCandidateParts(componentKey).filter((candidate) => {
    return (
      candidate.name !== currentPart?.name &&
      candidate.score >= currentScore + getMinimumScoreGap(currentScore)
    )
  })

  return pickProgressiveCandidates(candidates, currentScore).map((candidate, index) =>
    createSmartUpgrade(componentKey, candidate, currentPart, index),
  )
}

function getWeakestComponents(setup) {
  return Object.entries(componentConfigs)
    .map(([componentKey]) => {
      const currentPart = getCurrentPart(componentKey, setup)

      return {
        componentKey,
        score: currentPart?.score ?? 0,
      }
    })
    .sort((first, second) => first.score - second.score)
    .map((item) => item.componentKey)
}

function uniqueUpgrades(upgrades) {
  const seenNames = new Set()

  return upgrades.filter((upgrade) => {
    if (seenNames.has(upgrade.name)) {
      return false
    }

    seenNames.add(upgrade.name)

    return true
  })
}

export function getSmartUpgradeRecommendations(setup, result) {
  if (!setup) {
    return []
  }

  const focusedComponent = bottleneckToComponent[result?.bottleneck]

  if (focusedComponent) {
    const focusedRecommendations = getSmartRecommendationsForComponent(
      focusedComponent,
      setup,
    )

    if (focusedRecommendations.length >= 3) {
      return focusedRecommendations.slice(0, 3)
    }

    const fillRecommendations = getWeakestComponents(setup)
      .filter((componentKey) => componentKey !== focusedComponent)
      .flatMap((componentKey) =>
        getSmartRecommendationsForComponent(componentKey, setup).slice(0, 1),
      )

    return uniqueUpgrades([
      ...focusedRecommendations,
      ...fillRecommendations,
    ]).slice(0, 3)
  }

  return uniqueUpgrades(
    getWeakestComponents(setup).flatMap((componentKey) =>
      getSmartRecommendationsForComponent(componentKey, setup).slice(0, 1),
    ),
  ).slice(0, 3)
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

export function getUpgradeRecommendations(bottleneck, setup, result) {
  const smartRecommendations = getSmartUpgradeRecommendations(
    setup,
    result ?? { bottleneck },
  )

  if (smartRecommendations.length) {
    return smartRecommendations
  }

  return upgradeRecommendations[bottleneck] ?? upgradeRecommendations.balanced
}
