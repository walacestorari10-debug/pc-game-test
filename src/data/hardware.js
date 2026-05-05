export const cpus = [
  { name: 'AMD Ryzen 3 3100', score: 48, tier: 'entry' },
  { name: 'Intel Core i3-10100F', score: 50, tier: 'entry' },
  { name: 'Intel Core i5-10400F', score: 62, tier: 'mid' },
  { name: 'AMD Ryzen 5 3600', score: 64, tier: 'mid' },
  { name: 'Intel Core i5-11400F', score: 68, tier: 'mid' },
  { name: 'AMD Ryzen 7 3700X', score: 70, tier: 'mid' },
  { name: 'AMD Ryzen 5 5600', score: 72, tier: 'mid' },
  { name: 'Intel Core i5-12400F', score: 76, tier: 'mid' },
  { name: 'Intel Core i7-10700K', score: 78, tier: 'mid' },
  { name: 'Intel Core i5-13400F', score: 81, tier: 'high' },
  { name: 'AMD Ryzen 7 5800X', score: 82, tier: 'high' },
  { name: 'AMD Ryzen 5 7600', score: 84, tier: 'high' },
  { name: 'AMD Ryzen 9 5900X', score: 86, tier: 'high' },
  { name: 'Intel Core i7-12700K', score: 88, tier: 'high' },
  { name: 'Intel Core i9-12900K', score: 91, tier: 'enthusiast' },
  { name: 'Intel Core i7-13700K', score: 94, tier: 'enthusiast' },
  { name: 'AMD Ryzen 9 7950X', score: 96, tier: 'enthusiast' },
  { name: 'Intel Core i9-13900K', score: 97, tier: 'enthusiast' },
  { name: 'AMD Ryzen 7 7800X3D', score: 98, tier: 'enthusiast' },
]

export const gpus = [
  { name: 'GTX 1050 Ti', score: 36, tier: 'entry' },
  { name: 'RX 570', score: 39, tier: 'entry' },
  { name: 'GTX 1650', score: 45, tier: 'entry' },
  { name: 'RX 580', score: 48, tier: 'entry' },
  { name: 'RX 5500 XT', score: 50, tier: 'entry' },
  { name: 'GTX 1660 Super', score: 52, tier: 'entry' },
  { name: 'RX 5600 XT', score: 56, tier: 'entry' },
  { name: 'RX 6600', score: 58, tier: 'entry' },
  { name: 'RTX 2060', score: 60, tier: 'mid' },
  { name: 'RTX 3060 12GB', score: 68, tier: 'mid' },
  { name: 'RTX 4060', score: 72, tier: 'mid' },
  { name: 'RTX 3060 Ti', score: 76, tier: 'mid' },
  { name: 'RX 6700 XT', score: 78, tier: 'mid' },
  { name: 'RTX 3070', score: 80, tier: 'high' },
  { name: 'RX 7700 XT', score: 84, tier: 'high' },
  { name: 'RX 7800 XT', score: 86, tier: 'high' },
  { name: 'RTX 3080', score: 87, tier: 'high' },
  { name: 'RTX 4070', score: 88, tier: 'high' },
  { name: 'RX 6800 XT', score: 89, tier: 'high' },
  { name: 'RX 7900 XTX', score: 95, tier: 'enthusiast' },
  { name: 'RTX 4080', score: 96, tier: 'enthusiast' },
  { name: 'RTX 4090', score: 100, tier: 'enthusiast' },
]

export const ram = [
  { name: '8GB DDR4', score: 42, tier: 'entry' },
  { name: '16GB DDR4', score: 68, tier: 'mid' },
  { name: '16GB DDR5', score: 74, tier: 'mid' },
  { name: '32GB DDR4', score: 82, tier: 'high' },
  { name: '32GB DDR5', score: 90, tier: 'enthusiast' },
]

export const storage = [
  { name: 'HD 1TB', score: 35, tier: 'entry' },
  { name: 'SSD SATA 512GB', score: 62, tier: 'mid' },
  { name: 'SSD SATA 1TB', score: 68, tier: 'mid' },
  { name: 'SSD NVMe 512GB', score: 78, tier: 'high' },
  { name: 'SSD NVMe 1TB', score: 84, tier: 'high' },
  { name: 'SSD NVMe 2TB', score: 90, tier: 'enthusiast' },
]

export const hardwareCatalog = {
  cpus,
  gpus,
  ram,
  storage,
}
