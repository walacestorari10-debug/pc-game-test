import { cpus, gpus, ram, storage } from '../data/hardware.js'
import { getGameBySlug } from '../data/games.js'

const resolutionMultipliers = {
  '720p': 1.15,
  '1080p': 1,
  '1440p': 0.8,
  '4K': 0.6,
}

const qualityMultipliers = {
  Baixa: 1.2,
  Média: 1.05,
  Media: 1.05,
  Alta: 1,
  Ultra: 0.75,
  low: 1.2,
  medium: 1.05,
  high: 1,
  ultra: 0.75,
}

const qualityLabels = ['Ultra', 'Alta', 'Média', 'Baixa']

const demandCurves = {
  leve: 0.92,
  medio: 1,
  pesado: 1.08,
  muito_pesado: 1.15,
}

const estimationModeDescriptions = {
  conservative: 'Estimativa segura, considerando cenários mais pesados.',
  balanced: 'Estimativa média para uso normal.',
  optimized:
    'Considera drivers atualizados, sistema otimizado e tecnologias como DLSS/FSR quando disponíveis.',
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function findPart(parts, name) {
  return parts.find((part) => part.name === name) ?? {
    name: name || 'Não informado',
    score: 0,
    tier: 'desconhecido',
  }
}

function roundToNearest(value, step = 1) {
  return Math.round(value / step) * step
}

function getBaseOverallScore(scores) {
  return (
    scores.gpu * 0.5 +
    scores.cpu * 0.25 +
    scores.ram * 0.15 +
    scores.storage * 0.1
  )
}

function getAdjustedScore(baseScore, setup) {
  const resolutionMultiplier = resolutionMultipliers[setup.resolution] ?? 1
  const qualityMultiplier = qualityMultipliers[setup.quality] ?? 1

  return clamp(baseScore * resolutionMultiplier * qualityMultiplier, 0, 100)
}

function getAverageFps(baseScore, setup, game) {
  const adjustedScore = getAdjustedScore(baseScore, setup)
  const performanceRatio = adjustedScore / game.baseRequirementScore
  const demandCurve = demandCurves[game.demandLevel] ?? 1
  const estimatedFps = game.fpsBase1080p * Math.pow(performanceRatio, demandCurve)

  return Math.max(12, Math.round(estimatedFps))
}

function getFpsRange(averageFps) {
  const spread = clamp(Math.round(averageFps * 0.12), 6, 24)

  return {
    min: Math.max(10, roundToNearest(averageFps - spread)),
    max: Math.max(15, roundToNearest(averageFps + spread)),
  }
}

function getRangeFromCenter(averageFps, spreadRatio = 0.1) {
  const spread = clamp(Math.round(averageFps * spreadRatio), 7, 28)

  return {
    min: Math.max(10, roundToNearest(averageFps - spread)),
    max: Math.max(15, roundToNearest(averageFps + spread)),
  }
}

function getModernGpuFeatureFactor(gpuName = '') {
  const normalizedName = gpuName.toUpperCase()

  if (/RTX\s*(30|40|50)/.test(normalizedName)) {
    return 1
  }

  if (/RX\s*(6|7|9)\d{3}/.test(normalizedName)) {
    return 0.8
  }

  if (normalizedName.includes('ARC')) {
    return 0.7
  }

  return 0
}

function getHardwareOptimizationHeadroom(scores, parts) {
  const gpuHeadroom = clamp((scores.gpu - 70) / 30, 0, 1)
  const cpuHeadroom = clamp((scores.cpu - 78) / 22, 0, 1)
  const ramHeadroom = clamp((scores.ram - 68) / 28, 0, 1)
  const storageHeadroom = clamp((scores.storage - 68) / 28, 0, 1)
  const modernGpuFeatureFactor = getModernGpuFeatureFactor(parts.gpu.name)

  return clamp(
    gpuHeadroom * 0.46 +
      cpuHeadroom * 0.22 +
      ramHeadroom * 0.12 +
      storageHeadroom * 0.08 +
      modernGpuFeatureFactor * 0.12,
    0,
    1,
  )
}

function getFpsEstimationModes(averageFps, fpsRange, scores, parts, game) {
  const hardwareHeadroom = getHardwareOptimizationHeadroom(scores, parts)
  const demandOptimizationFactor =
    game.demandLevel === 'muito_pesado'
      ? 1
      : game.demandLevel === 'pesado'
        ? 0.86
        : 0.68
  const balancedMultiplier = 1 + 0.07 + hardwareHeadroom * 0.1
  const optimizedMultiplier =
    1 + 0.15 + hardwareHeadroom * 0.22 * demandOptimizationFactor
  const balancedAverageFps = Math.max(
    fpsRange.max,
    Math.round(averageFps * balancedMultiplier),
  )
  const optimizedAverageFps = Math.max(
    balancedAverageFps + 4,
    Math.round(averageFps * optimizedMultiplier),
  )

  return [
    {
      key: 'conservative',
      label: 'Conservador',
      description: estimationModeDescriptions.conservative,
      averageFps,
      range: fpsRange,
    },
    {
      key: 'balanced',
      label: 'Balanceado',
      description: estimationModeDescriptions.balanced,
      averageFps: balancedAverageFps,
      range: getRangeFromCenter(balancedAverageFps, 0.1),
    },
    {
      key: 'optimized',
      label: 'Otimizado',
      description: estimationModeDescriptions.optimized,
      averageFps: optimizedAverageFps,
      range: getRangeFromCenter(optimizedAverageFps, 0.09),
    },
  ]
}

function getStatus(averageFps, game) {
  if (averageFps >= game.recommendedFps) {
    return 'Ótimo'
  }

  if (averageFps >= game.minFpsPlayable) {
    return 'Jogável'
  }

  return 'Baixo'
}

function getIdealQuality(baseScore, setup, game) {
  const qualityThatHitsRecommended = qualityLabels.find((quality) => {
    const estimatedFps = getAverageFps(baseScore, { ...setup, quality }, game)

    return estimatedFps >= game.recommendedFps
  })

  if (qualityThatHitsRecommended) {
    return qualityThatHitsRecommended
  }

  const playableQuality = [...qualityLabels].reverse().find((quality) => {
    const estimatedFps = getAverageFps(baseScore, { ...setup, quality }, game)

    return estimatedFps >= game.minFpsPlayable
  })

  return playableQuality ?? 'Baixa'
}

function getBottleneck(scores, parts) {
  const candidates = []
  const gpuGap = scores.cpu - scores.gpu
  const cpuGap = scores.gpu - scores.cpu

  if (gpuGap >= 18) {
    candidates.push({
      bottleneck: 'Placa de vídeo',
      component: 'GPU',
      impactValue: gpuGap,
    })
  }

  if (cpuGap >= 22) {
    candidates.push({
      bottleneck: 'Processador',
      component: 'CPU',
      impactValue: cpuGap,
    })
  }

  if (scores.ram < 58) {
    candidates.push({
      bottleneck: 'Memória RAM',
      component: 'RAM',
      impactValue: 64 - scores.ram,
    })
  }

  if (scores.storage < 50) {
    candidates.push({
      bottleneck: 'Armazenamento',
      component: 'Storage',
      impactValue: 58 - scores.storage,
    })
  }

  if (!candidates.length) {
    return {
      bottleneck: 'Nenhum gargalo crítico',
      bottleneckImpact: 'Baixo',
      recommendation: 'Seu setup está equilibrado para a configuração escolhida.',
    }
  }

  const mainIssue = candidates.sort((a, b) => b.impactValue - a.impactValue)[0]
  const bottleneckImpact =
    mainIssue.impactValue >= 30 ? 'Alto' : mainIssue.impactValue >= 20 ? 'Médio' : 'Baixo'

  const recommendations = {
    GPU: 'Priorize um upgrade de GPU para ganhar FPS e manter presets mais altos.',
    CPU: 'Considere um processador mais forte para reduzir quedas e melhorar estabilidade.',
    RAM: parts.ram.name.includes('8GB')
      ? 'Subir para 16GB já melhora a experiência; 32GB dá mais folga em jogos atuais.'
      : 'Considere 32GB de RAM para mundos abertos, multitarefa e texturas mais pesadas.',
    Storage: 'Trocar para um SSD NVMe reduz travamentos de carregamento e melhora a fluidez geral.',
  }

  return {
    bottleneck: mainIssue.bottleneck,
    bottleneckImpact,
    recommendation: recommendations[mainIssue.component],
  }
}

function getScoreSummary(status, setup, game) {
  if (status === 'Ótimo') {
    return `Seu PC deve entregar uma experiência confortável em ${game.name} com ${setup.resolution} e qualidade ${setup.quality}.`
  }

  if (status === 'Jogável') {
    return `Seu PC deve rodar ${game.name}, mas pode exigir ajustes finos para manter estabilidade em ${setup.resolution}.`
  }

  return `Seu PC fica abaixo do mínimo jogável estimado para ${game.name} nessa combinação de resolução e qualidade.`
}

export function calculatePcPerformance(setup, gameSlug = 'warzone') {
  const game = getGameBySlug(gameSlug)
  const parts = {
    cpu: findPart(cpus, setup.cpu),
    gpu: findPart(gpus, setup.gpu),
    ram: findPart(ram, setup.ram),
    storage: findPart(storage, setup.storage),
  }
  const scores = {
    cpu: parts.cpu.score,
    gpu: parts.gpu.score,
    ram: parts.ram.score,
    storage: parts.storage.score,
  }
  const baseOverallScore = getBaseOverallScore(scores)
  const overallScore = Math.round(getAdjustedScore(baseOverallScore, setup))
  const averageFps = getAverageFps(baseOverallScore, setup, game)
  const fpsRange = getFpsRange(averageFps)
  const fpsEstimationModes = getFpsEstimationModes(
    averageFps,
    fpsRange,
    scores,
    parts,
    game,
  )
  const status = getStatus(averageFps, game)
  const idealQuality = getIdealQuality(baseOverallScore, setup, game)
  const bottleneckResult = getBottleneck(scores, parts)

  return {
    game,
    overallScore,
    baseOverallScore: Math.round(baseOverallScore),
    fpsRange,
    fpsEstimationModes,
    averageFps,
    status,
    idealQuality,
    bottleneck: bottleneckResult.bottleneck,
    bottleneckImpact: bottleneckResult.bottleneckImpact,
    recommendation: bottleneckResult.recommendation,
    explanation:
      `${getScoreSummary(status, setup, game)} ` +
      'Esta é uma estimativa baseada em dados de referência; drivers, temperatura, atualizações e configurações do sistema podem alterar o resultado.',
    componentScores: [
      ['Processador', scores.cpu],
      ['Placa de vídeo', scores.gpu],
      ['Memória RAM', scores.ram],
      ['Armazenamento', scores.storage],
    ],
  }
}
