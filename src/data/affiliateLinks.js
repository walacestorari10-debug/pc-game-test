export const amazonAssociateId = 'pcgametest-20'
export const affiliateLinkFallback = '#'

export const affiliateLinks = {
  'SSD NVMe 1TB': {
    amazon: 'https://amzn.to/4d5DHDv',
  },
  'SSD SATA 1TB': {
    amazon: 'https://amzn.to/49wIywy',
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
