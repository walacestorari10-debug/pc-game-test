import { describe, expect, it } from 'vitest'
import { calculatePcPerformance } from './performanceEngine'

const STATUS_GREAT = '\u00d3timo'
const STATUS_PLAYABLE = 'Jog\u00e1vel'
const STATUS_LOW = 'Baixo'

const weakSetup = {
  cpu: 'Intel Core i3-10100F',
  gpu: 'GTX 1050 Ti',
  ram: '8GB DDR4',
  storage: 'HD 1TB',
  resolution: '1080p',
  quality: 'Alta',
}

const midSetup = {
  cpu: 'AMD Ryzen 5 5600',
  gpu: 'RTX 3060 12GB',
  ram: '16GB DDR4',
  storage: 'SSD SATA 1TB',
  resolution: '1080p',
  quality: 'Alta',
}

const strongSetup = {
  cpu: 'AMD Ryzen 7 7800X3D',
  gpu: 'RTX 4090',
  ram: '32GB DDR5',
  storage: 'SSD NVMe 2TB',
  resolution: '1080p',
  quality: 'Alta',
}

function expectValidScore(result) {
  expect(result.overallScore).toBeGreaterThanOrEqual(0)
  expect(result.overallScore).toBeLessThanOrEqual(100)
}

function expectValidFpsRange(result) {
  expect(result.fpsRange).toEqual({
    min: expect.any(Number),
    max: expect.any(Number),
  })
  expect(result.fpsRange.min).toBeLessThan(result.fpsRange.max)
  expect(result.averageFps).toBeGreaterThanOrEqual(result.fpsRange.min)
  expect(result.averageFps).toBeLessThanOrEqual(result.fpsRange.max)
}

function expectValidEstimationModes(result) {
  expect(result.fpsEstimationModes).toHaveLength(3)
  expect(result.fpsEstimationModes.map((mode) => mode.key)).toEqual([
    'conservative',
    'balanced',
    'optimized',
  ])
  expect(result.fpsEstimationModes[0].range).toEqual(result.fpsRange)
  expect(result.fpsEstimationModes[1].averageFps).toBeGreaterThanOrEqual(
    result.fpsEstimationModes[0].averageFps,
  )
  expect(result.fpsEstimationModes[2].averageFps).toBeGreaterThan(
    result.fpsEstimationModes[1].averageFps,
  )
}

describe('calculatePcPerformance', () => {
  it('returns low or playable status for a weak PC in a heavy game', () => {
    const result = calculatePcPerformance(weakSetup, 'cyberpunk-2077')

    expect([STATUS_LOW, STATUS_PLAYABLE]).toContain(result.status)
    expect(result.status).not.toBe(STATUS_GREAT)
    expectValidScore(result)
  })

  it('returns a coherent result for a mid-range PC in a medium game', () => {
    const result = calculatePcPerformance(midSetup, 'apex-legends')

    expect([STATUS_PLAYABLE, STATUS_GREAT]).toContain(result.status)
    expect(result.averageFps).toBeGreaterThanOrEqual(result.game.minFpsPlayable)
    expect(result.overallScore).toBeGreaterThanOrEqual(60)
    expect(result.overallScore).toBeLessThanOrEqual(85)
    expectValidFpsRange(result)
    expectValidEstimationModes(result)
  })

  it('returns great status for a strong PC in a light game', () => {
    const result = calculatePcPerformance(strongSetup, 'cs2')

    expect(result.status).toBe(STATUS_GREAT)
    expect(result.averageFps).toBeGreaterThanOrEqual(result.game.recommendedFps)
    expectValidScore(result)
  })

  it('returns FPS range with min and max values', () => {
    const result = calculatePcPerformance(midSetup, 'warzone')

    expectValidFpsRange(result)
  })

  it('returns conservative, balanced and optimized FPS estimation modes', () => {
    const result = calculatePcPerformance(strongSetup, 'cyberpunk-2077')

    expectValidEstimationModes(result)
    expect(result.fpsEstimationModes[0].description).toContain(
      'cen\u00e1rios mais pesados',
    )
    expect(result.fpsEstimationModes[2].description).toContain('DLSS/FSR')
  })

  it('gives high-end hardware more optimized headroom without changing the conservative base', () => {
    const highEndSetup = {
      cpu: 'Intel Core i5-13600K',
      gpu: 'RTX 3080',
      ram: '32GB DDR4',
      storage: 'SSD NVMe 2TB',
      resolution: '1080p',
      quality: 'Alta',
    }
    const result = calculatePcPerformance(highEndSetup, 'warzone')

    expect(result.fpsEstimationModes[0].averageFps).toBe(result.averageFps)
    expect(result.fpsEstimationModes[2].averageFps).toBeGreaterThan(
      result.averageFps + 15,
    )
    expect(result.bottleneck).not.toBe('Processador')
  })

  it('keeps overallScore between 0 and 100 across different setups', () => {
    const results = [
      calculatePcPerformance(weakSetup, 'cyberpunk-2077'),
      calculatePcPerformance(midSetup, 'apex-legends'),
      calculatePcPerformance(strongSetup, 'cs2'),
    ]

    results.forEach(expectValidScore)
  })

  it('identifies a GPU bottleneck when GPU is much weaker than CPU', () => {
    const result = calculatePcPerformance(
      {
        ...strongSetup,
        cpu: 'Intel Core i9-13900K',
        gpu: 'GTX 1050 Ti',
      },
      'cyberpunk-2077',
    )

    expect(result.bottleneck).toBe('Placa de v\u00eddeo')
    expect(result.bottleneckImpact).not.toBe(STATUS_LOW)
  })

  it('identifies low RAM as a bottleneck', () => {
    const result = calculatePcPerformance(
      {
        ...strongSetup,
        ram: '8GB DDR4',
      },
      'cyberpunk-2077',
    )

    expect(result.bottleneck).toBe('Mem\u00f3ria RAM')
  })

  it('does not break with an invalid game slug or incomplete setup', () => {
    expect(() => calculatePcPerformance({}, 'jogo-invalido')).not.toThrow()

    const result = calculatePcPerformance({}, 'jogo-invalido')

    expect(result.game.slug).toBe('warzone')
    expect([STATUS_LOW, STATUS_PLAYABLE, STATUS_GREAT]).toContain(result.status)
    expectValidScore(result)
    expectValidFpsRange(result)
  })
})
