// Salary calculation based on PP No. 5 Tahun 2024
// Base salary table for different pangkat and golongan

interface SalaryCalculation {
  gajiPokok: number
  pph: number
  potonganJkn: number
  salurNetto: number
}

export function calculateGajiPokok(
  pangkat: string,
  golongan: string,
  masaKerja: number
): number {
  // Base salary table (in millions of rupiah)
  const baseSalaryTable: { [key: string]: { [key: number]: number } } = {
    'II/a': { 0: 1.8, 2: 1.9, 4: 2.0, 6: 2.1, 8: 2.2, 10: 2.3, 12: 2.4, 14: 2.5, 16: 2.6, 18: 2.7, 20: 2.8, 22: 2.9, 24: 3.0 },
    'II/b': { 0: 1.9, 2: 2.0, 4: 2.1, 6: 2.2, 8: 2.3, 10: 2.4, 12: 2.5, 14: 2.6, 16: 2.7, 18: 2.8, 20: 2.9, 22: 3.0, 24: 3.1 },
    'II/c': { 0: 2.0, 2: 2.1, 4: 2.2, 6: 2.3, 8: 2.4, 10: 2.5, 12: 2.6, 14: 2.7, 16: 2.8, 18: 2.9, 20: 3.0, 22: 3.1, 24: 3.2 },
    'II/d': { 0: 2.1, 2: 2.2, 4: 2.3, 6: 2.4, 8: 2.5, 10: 2.6, 12: 2.7, 14: 2.8, 16: 2.9, 18: 3.0, 20: 3.1, 22: 3.2, 24: 3.3 },
    'III/a': { 0: 2.2, 2: 2.3, 4: 2.4, 6: 2.5, 8: 2.6, 10: 2.7, 12: 2.8, 14: 2.9, 16: 3.0, 18: 3.1, 20: 3.2, 22: 3.3, 24: 3.4 },
    'III/b': { 0: 2.3, 2: 2.4, 4: 2.5, 6: 2.6, 8: 2.7, 10: 2.8, 12: 2.9, 14: 3.0, 16: 3.1, 18: 3.2, 20: 3.3, 22: 3.4, 24: 3.5 },
    'III/c': { 0: 2.4, 2: 2.5, 4: 2.6, 6: 2.7, 8: 2.8, 10: 2.9, 12: 3.0, 14: 3.1, 16: 3.2, 18: 3.3, 20: 3.4, 22: 3.5, 24: 3.6 },
    'III/d': { 0: 2.5, 2: 2.6, 4: 2.7, 6: 2.8, 8: 2.9, 10: 3.0, 12: 3.1, 14: 3.2, 16: 3.3, 18: 3.4, 20: 3.5, 22: 3.6, 24: 3.7 },
    'IV/a': { 0: 2.6, 2: 2.7, 4: 2.8, 6: 2.9, 8: 3.0, 10: 3.1, 12: 3.2, 14: 3.3, 16: 3.4, 18: 3.5, 20: 3.6, 22: 3.7, 24: 3.8 },
    'IV/b': { 0: 2.7, 2: 2.8, 4: 2.9, 6: 3.0, 8: 3.1, 10: 3.2, 12: 3.3, 14: 3.4, 16: 3.5, 18: 3.6, 20: 3.7, 22: 3.8, 24: 3.9 },
    'IV/c': { 0: 2.8, 2: 2.9, 4: 3.0, 6: 3.1, 8: 3.2, 10: 3.3, 12: 3.4, 14: 3.5, 16: 3.6, 18: 3.7, 20: 3.8, 22: 3.9, 24: 4.0 },
    'IV/d': { 0: 2.9, 2: 3.0, 4: 3.1, 6: 3.2, 8: 3.3, 10: 3.4, 12: 3.5, 14: 3.6, 16: 3.7, 18: 3.8, 20: 3.9, 22: 4.0, 24: 4.1 },
    'IV/e': { 0: 3.0, 2: 3.1, 4: 3.2, 6: 3.3, 8: 3.4, 10: 3.5, 12: 3.6, 14: 3.7, 16: 3.8, 18: 3.9, 20: 4.0, 22: 4.1, 24: 4.2 },
  }

  const key = pangkat.toUpperCase()
  const table = baseSalaryTable[key]

  if (!table) {
    return 2000000 // Default base salary if not found
  }

  // Find the closest masa kerja
  const masaKerjaKeys = Object.keys(table).map(Number).sort((a, b) => a - b)
  let closestMasaKerja = masaKerjaKeys[0]

  for (const mk of masaKerjaKeys) {
    if (masaKerja >= mk) {
      closestMasaKerja = mk
    } else {
      break
    }
  }

  const gajiPokokInMillions = table[closestMasaKerja]
  return gajiPokokInMillions * 1000000 // Convert to rupiah
}

export function calculatePph(golongan: string): number {
  const golonganNumber = golongan.toUpperCase().replace(/[^IV]/g, '')

  switch (golonganNumber) {
    case 'II':
      return 0 // 0%
    case 'III':
      return 0.05 // 5%
    case 'IV':
      return 0.15 // 15%
    default:
      return 0
  }
}

export function calculatePotonganJkn(gajiPokok: number): number {
  return gajiPokok * 0.01 // 1% of gaji pokok
}

export function calculateSalaries(
  pangkat: string,
  golongan: string,
  masaKerja: number,
  salurBruto: number
): SalaryCalculation {
  const gajiPokok = calculateGajiPokok(pangkat, golongan, masaKerja)
  const pphRate = calculatePph(golongan)
  const pph = salurBruto * pphRate
  const potonganJkn = calculatePotonganJkn(gajiPokok)
  const salurNetto = salurBruto - pph - potonganJkn

  return {
    gajiPokok,
    pph,
    potonganJkn,
    salurNetto,
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
