import { describe, expect, it } from 'vitest'
import { getUpgradeRecommendations } from './upgradeRecommendations'

const weakGpuSetup = {
  cpu: 'Intel Core i5-12400F',
  gpu: 'GTX 1050 Ti',
  ram: '16GB DDR4',
  storage: 'SSD SATA 1TB',
}

const strongGpuSetup = {
  cpu: 'AMD Ryzen 7 7800X3D',
  gpu: 'RTX 4070',
  ram: '32GB DDR5',
  storage: 'SSD NVMe 1TB',
}

const hdSetup = {
  cpu: 'AMD Ryzen 5 5600',
  gpu: 'RTX 3060 12GB',
  ram: '16GB DDR4',
  storage: 'HD 1TB',
}

describe('getUpgradeRecommendations', () => {
  it('returns GPU upgrades above the current hardware level', () => {
    const upgrades = getUpgradeRecommendations('Placa de vídeo', weakGpuSetup)

    expect(upgrades).toHaveLength(3)
    expect(upgrades.every((upgrade) => upgrade.type === 'GPU')).toBe(true)
    expect(upgrades.map((upgrade) => upgrade.name)).not.toContain('GTX 1050 Ti')
    expect(upgrades.some((upgrade) => upgrade.name === 'RTX 3060 12GB')).toBe(true)
  })

  it('does not suggest weaker GPU options for a strong setup', () => {
    const upgrades = getUpgradeRecommendations('Placa de vídeo', strongGpuSetup)
    const upgradeNames = upgrades.map((upgrade) => upgrade.name)

    expect(upgradeNames).not.toContain('RTX 3060 12GB')
    expect(upgradeNames).not.toContain('RTX 4060')
    expect(upgrades.every((upgrade) => upgrade.type === 'GPU')).toBe(true)
  })

  it('keeps the real Amazon link for SSD NVMe 1TB and pending links for the rest', () => {
    const upgrades = getUpgradeRecommendations('Armazenamento', hdSetup)
    const nvmeUpgrade = upgrades.find((upgrade) => upgrade.name === 'SSD NVMe 1TB')
    const pendingUpgrades = upgrades.filter((upgrade) => upgrade.name !== 'SSD NVMe 1TB')

    expect(nvmeUpgrade).toMatchObject({
      link: 'https://amzn.to/4d5DHDv',
      isAffiliatePending: false,
    })
    expect(pendingUpgrades.every((upgrade) => upgrade.link === '#')).toBe(true)
  })
})
