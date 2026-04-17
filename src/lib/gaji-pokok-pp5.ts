/**
 * Gaji Pokok PNS Berdasarkan PP 5 Tahun 2024
 * Peraturan Pemerintah Nomor 5 Tahun 2024 tentang Perubahan ke-18 atas
 * Peraturan Pemerintah Nomor 7 Tahun 1977 tentang Peraturan Gaji Pegawai Negeri Sipil
 */

export interface GajiPokok {
  golongan: string
  gajiPokok: number
}

export const GAJI_POKOK_PP5_2024: GajiPokok[] = [
  // Golongan III
  { golongan: 'III/a', gajiPokok: 2579000 },
  { golongan: 'III/b', gajiPokok: 2686500 },
  { golongan: 'III/c', gajiPokok: 2794000 },
  { golongan: 'III/d', gajiPokok: 2901500 },
  
  // Golongan IV
  { golongan: 'IV/a', gajiPokok: 3043500 },
  { golongan: 'IV/b', gajiPokok: 3173500 },
  { golongan: 'IV/c', gajiPokok: 3295500 },
  { golongan: 'IV/d', gajiPokok: 3417500 },
  { golongan: 'IV/e', gajiPokok: 3569500 },
]

/**
 * Mendapatkan gaji pokok berdasarkan golongan
 * @param golongan Golongan pegawai (contoh: 'III/a', 'IV/b')
 * @returns Gaji pokok dalam rupiah, atau 0 jika golongan tidak ditemukan
 */
export function getGajiPokok(golongan: string): number {
  const gaji = GAJI_POKOK_PP5_2024.find((item) => item.golongan === golongan)
  return gaji?.gajiPokok || 0
}

/**
 * Mendapatkan daftar semua golongan yang tersedia
 * @returns Array string golongan yang tersedia
 */
export function getAllGolongan(): string[] {
  return GAJI_POKOK_PP5_2024.map((item) => item.golongan)
}
