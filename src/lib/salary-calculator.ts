// Salary calculation based on PP No. 5 Tahun 2024
import { getGajiPokok } from './gaji-pokok-pp5'

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
  // Use official gaji pokok from PP 5 Tahun 2024
  return getGajiPokok(golongan)
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
