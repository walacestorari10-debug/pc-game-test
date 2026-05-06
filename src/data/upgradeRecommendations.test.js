import { describe, expect, it } from 'vitest'
import { getArticleProductRecommendations } from './articleProductRecommendations'
import { getUpgradeRecommendations } from './upgradeRecommendations'
import { withAmazonAffiliateLinks } from './affiliateLinks'

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

  it('keeps real Amazon links for registered SSDs and pending links for the rest', () => {
    const upgrades = getUpgradeRecommendations('Armazenamento', hdSetup)
    const sataUpgrade = upgrades.find((upgrade) => upgrade.name === 'SSD SATA 1TB')
    const nvmeUpgrade = upgrades.find((upgrade) => upgrade.name === 'SSD NVMe 1TB')
    const nvme2tbUpgrade = upgrades.find((upgrade) => upgrade.name === 'SSD NVMe 2TB')
    const linkedNames = ['SSD SATA 1TB', 'SSD NVMe 1TB', 'SSD NVMe 2TB']
    const pendingUpgrades = upgrades.filter(
      (upgrade) => !linkedNames.includes(upgrade.name),
    )

    expect(sataUpgrade).toMatchObject({
      link: 'https://amzn.to/49wIywy',
      isAffiliatePending: false,
    })
    expect(nvmeUpgrade).toMatchObject({
      link: 'https://amzn.to/4d5DHDv',
      isAffiliatePending: false,
    })
    expect(nvme2tbUpgrade).toMatchObject({
      link: 'https://amzn.to/3ONO7Ql',
      isAffiliatePending: false,
    })
    expect(pendingUpgrades.every((upgrade) => upgrade.link === '#')).toBe(true)
  })

  it('reuses the same affiliate link outside the main upgrade list', () => {
    const linkedProducts = [
      ['CPU moderno de 6 núcleos', 'https://amzn.to/3QIpvZV'],
      ['AMD Ryzen 7 5800X', 'https://amzn.to/3OWQAYJ'],
      ['AMD Ryzen 5 5600', 'https://amzn.to/42hFuk0'],
      ['Intel Core i5-12400F', 'https://amzn.to/4wbrHsP'],
      ['RTX 4060', 'https://amzn.to/42d1som'],
      ['RTX 4070 ou superior', 'https://amzn.to/4tYtvUI'],
      ['RTX 3060 12GB', 'https://amzn.to/4wcuz90'],
      ['SSD NVMe 1TB', 'https://amzn.to/4d5DHDv'],
      ['SSD SATA 1TB', 'https://amzn.to/49wIywy'],
      ['SSD 1TB', 'https://amzn.to/4wbsn1l'],
      ['SSD NVMe', 'https://amzn.to/49bntHW'],
      ['16GB de RAM', 'https://amzn.to/4n8j8Lm'],
      ['SSD NVMe 2TB', 'https://amzn.to/3ONO7Ql'],
      ['16GB DDR4 3200MHz', 'https://amzn.to/49vrneN'],
      ['Kit 16GB DDR4', 'https://amzn.to/49vrneN'],
      ['32GB RAM', 'https://amzn.to/3QIahEe'],
      ['32GB de RAM', 'https://amzn.to/3QIahEe'],
      ['32GB de RAM + SSD NVMe', 'https://amzn.to/3QIahEe'],
      ['32GB DDR4 3200MHz', 'https://amzn.to/48KkTZk'],
      ['Kit 32GB DDR4', 'https://amzn.to/48KkTZk'],
      ['32GB DDR5', 'https://amzn.to/4dpxDXP'],
      ['Kit 32GB DDR5', 'https://amzn.to/4dpxDXP'],
    ]
    const genericItems = withAmazonAffiliateLinks([
      ...linkedProducts.map(([name]) => ({ name })),
      { name: 'RX 6600' },
    ])
    const articleRecommendations = getArticleProductRecommendations('ssd-vs-hd')
    const articleSsd = articleRecommendations.items.find(
      (item) => item.name === 'SSD NVMe 1TB',
    )

    linkedProducts.forEach(([name, link], index) => {
      expect(genericItems[index]).toMatchObject({
        name,
        link,
        isAffiliatePending: false,
      })
    })
    expect(genericItems.at(-1)).toMatchObject({
      link: '#',
      isAffiliatePending: true,
    })
    expect(articleSsd).toMatchObject({
      link: 'https://amzn.to/4d5DHDv',
      isAffiliatePending: false,
    })
  })
})
