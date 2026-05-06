export const amazonAssociateId = 'pcgametest-20'
export const affiliateLinkFallback = '#'

export const affiliateLinks = {
  'AMD Ryzen 7 5800X': {
    amazon: 'https://amzn.to/3OWQAYJ',
  },
  'AMD Ryzen 5 5600': {
    amazon: 'https://amzn.to/42hFuk0',
  },
  'Intel Core i5-12400F': {
    amazon: 'https://amzn.to/4wbrHsP',
  },
  'RTX 4060': {
    amazon: 'https://amzn.to/42d1som',
  },
  'RTX 3060 12GB': {
    amazon: 'https://amzn.to/4wcuz90',
  },
  'SSD NVMe 1TB': {
    amazon: 'https://amzn.to/4d5DHDv',
  },
  'SSD NVMe 2TB': {
    amazon: 'https://amzn.to/3ONO7Ql',
  },
  'SSD SATA 1TB': {
    amazon: 'https://amzn.to/49wIywy',
  },
  'SSD 1TB': {
    amazon: 'https://amzn.to/4wbsn1l',
  },
  '16GB DDR4': {
    amazon: 'https://amzn.to/49vrneN',
  },
  '16GB DDR4 3200MHz': {
    amazon: 'https://amzn.to/49vrneN',
  },
  'Kit 16GB DDR4': {
    amazon: 'https://amzn.to/49vrneN',
  },
  '32GB DDR4': {
    amazon: 'https://amzn.to/48KkTZk',
  },
  '32GB DDR4 3200MHz': {
    amazon: 'https://amzn.to/48KkTZk',
  },
  'Kit 32GB DDR4': {
    amazon: 'https://amzn.to/48KkTZk',
  },
  '32GB DDR5': {
    amazon: 'https://amzn.to/4dpxDXP',
  },
  'Kit 32GB DDR5': {
    amazon: 'https://amzn.to/4dpxDXP',
  },
}

export function getAmazonAffiliateLink(productName) {
  return affiliateLinks[productName]?.amazon ?? affiliateLinkFallback
}

export function withAmazonAffiliateLink(item) {
  const link = getAmazonAffiliateLink(item.affiliateKey ?? item.name)

  return {
    ...item,
    link,
    isAffiliatePending: link === affiliateLinkFallback,
  }
}

export function withAmazonAffiliateLinks(items = []) {
  return items.map(withAmazonAffiliateLink)
}
