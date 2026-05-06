export const amazonAssociateId = 'pcgametest-20'
export const affiliateLinkFallback = '#'

export const affiliateLinks = {
  'SSD NVMe 1TB': {
    amazon: 'https://amzn.to/4d5DHDv',
  },
  'SSD NVMe 2TB': {
    amazon: 'https://amzn.to/3ONO7Ql',
  },
  'SSD SATA 1TB': {
    amazon: 'https://amzn.to/49wIywy',
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
