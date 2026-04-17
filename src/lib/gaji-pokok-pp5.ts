/**
 * Gaji Pokok PNS Berdasarkan PP 5 Tahun 2024
 * Peraturan Pemerintah Nomor 5 Tahun 2024 tentang Perubahan ke-18 atas
 * Peraturan Pemerintah Nomor 7 Tahun 1977 tentang Peraturan Gaji Pegawai Negeri Sipil
 *
 * Gaji pokok ditentukan berdasarkan Golongan dan Masa Kerja
 */

export interface GajiPokok {
  golongan: string
  masaKerja: number
  gajiPokok: number
}

// Gaji Pokok berdasarkan Golongan dan Masa Kerja (dalam tahun)
// Data ini mencakup golongan III dan IV dengan kenaikan setiap 2 tahun
const GAJI_POKOK_TABLE: { [key: string]: { [key: number]: number } } = {
  // Golongan III
  'III/a': {
    0: 2579000,
    2: 2630000,
    4: 2681000,
    6: 2732000,
    8: 2783000,
    10: 2834000,
    12: 2885000,
    14: 2936000,
    16: 2987000,
    18: 3038000,
    20: 3089000,
    22: 3140000,
    24: 3191000,
    26: 3242000,
    28: 3293000,
    30: 3344000,
    32: 3395000,
    34: 3446000,
  },
  'III/b': {
    0: 2686500,
    2: 2739000,
    4: 2791500,
    6: 2844000,
    8: 2896500,
    10: 2949000,
    12: 3001500,
    14: 3054000,
    16: 3106500,
    18: 3159000,
    20: 3211500,
    22: 3264000,
    24: 3316500,
    26: 3369000,
    28: 3421500,
    30: 3474000,
    32: 3526500,
    34: 3579000,
  },
  'III/c': {
    0: 2794000,
    2: 2848000,
    4: 2902000,
    6: 2956000,
    8: 3010000,
    10: 3064000,
    12: 3118000,
    14: 3172000,
    16: 3226000,
    18: 3280000,
    20: 3334000,
    22: 3388000,
    24: 3442000,
    26: 3496000,
    28: 3550000,
    30: 3604000,
    32: 3658000,
    34: 3712000,
  },
  'III/d': {
    0: 2901500,
    2: 2957000,
    4: 3012500,
    6: 3068000,
    8: 3123500,
    10: 3179000,
    12: 3234500,
    14: 3290000,
    16: 3345500,
    18: 3401000,
    20: 3456500,
    22: 3512000,
    24: 3567500,
    26: 3623000,
    28: 3678500,
    30: 3734000,
    32: 3789500,
    34: 3845000,
  },

  // Golongan IV
  'IV/a': {
    0: 3043500,
    2: 3104000,
    4: 3164500,
    6: 3225000,
    8: 3285500,
    10: 3346000,
    12: 3406500,
    14: 3467000,
    16: 3527500,
    18: 3588000,
    20: 3648500,
    22: 3709000,
    24: 3769500,
    26: 3830000,
    28: 3890500,
    30: 3951000,
    32: 4011500,
    34: 4072000,
  },
  'IV/b': {
    0: 3173500,
    2: 3236000,
    4: 3298500,
    6: 3361000,
    8: 3423500,
    10: 3486000,
    12: 3548500,
    14: 3611000,
    16: 3673500,
    18: 3736000,
    20: 3798500,
    22: 3861000,
    24: 3923500,
    26: 3986000,
    28: 4048500,
    30: 4111000,
    32: 4173500,
    34: 4236000,
  },
  'IV/c': {
    0: 3295500,
    2: 3360000,
    4: 3424500,
    6: 3489000,
    8: 3553500,
    10: 3618000,
    12: 3682500,
    14: 3747000,
    16: 3811500,
    18: 3876000,
    20: 3940500,
    22: 4005000,
    24: 4069500,
    26: 4134000,
    28: 4198500,
    30: 4263000,
    32: 4327500,
    34: 4392000,
  },
  'IV/d': {
    0: 3417500,
    2: 3484000,
    4: 3550500,
    6: 3617000,
    8: 3683500,
    10: 3750000,
    12: 3816500,
    14: 3883000,
    16: 3949500,
    18: 4016000,
    20: 4082500,
    22: 4149000,
    24: 4215500,
    26: 4282000,
    28: 4348500,
    30: 4415000,
    32: 4481500,
    34: 4548000,
  },
  'IV/e': {
    0: 3569500,
    2: 3638000,
    4: 3706500,
    6: 3775000,
    8: 3843500,
    10: 3912000,
    12: 3980500,
    14: 4049000,
    16: 4117500,
    18: 4186000,
    20: 4254500,
    22: 4323000,
    24: 4391500,
    26: 4460000,
    28: 4528500,
    30: 4597000,
    32: 4665500,
    34: 4734000,
  },
}

/**
 * Mendapatkan gaji pokok berdasarkan golongan dan masa kerja
 * @param golongan Golongan pegawai (contoh: 'III/a', 'IV/b')
 * @param masaKerja Masa kerja dalam tahun
 * @returns Gaji pokok dalam rupiah, atau 0 jika golongan tidak ditemukan
 */
export function getGajiPokok(golongan: string, masaKerja: number = 0): number {
  const table = GAJI_POKOK_TABLE[golongan]

  if (!table) {
    return 0
  }

  // Get all masa kerja thresholds sorted
  const masaKerjaThresholds = Object.keys(table).map(Number).sort((a, b) => a - b)

  // Find the highest masa kerja threshold that is <= the actual masa kerja
  let matchedMasaKerja = masaKerjaThresholds[0]
  for (const threshold of masaKerjaThresholds) {
    if (masaKerja >= threshold) {
      matchedMasaKerja = threshold
    } else {
      break
    }
  }

  // Cap at maximum masa kerja (34 years)
  const cappedMasaKerja = Math.min(masaKerja, 34)
  const finalMasaKerja = masaKerjaThresholds.find(t => t >= cappedMasaKerja) || matchedMasaKerja

  // Use the matched or final masa kerja
  const finalMasaKerjaKey = masaKerjaThresholds.find(t => t >= cappedMasaKerja) ||
                           masaKerjaThresholds[masaKerjaThresholds.length - 1]

  return table[finalMasaKerjaKey] || 0
}

/**
 * Mendapatkan daftar semua golongan yang tersedia
 * @returns Array string golongan yang tersedia
 */
export function getAllGolongan(): string[] {
  return Object.keys(GAJI_POKOK_TABLE)
}

/**
 * Mendapatkan daftar masa kerja yang tersedia untuk golongan tertentu
 * @param golongan Golongan pegawai
 * @returns Array number masa kerja yang tersedia
 */
export function getAvailableMasaKerja(golongan: string): number[] {
  const table = GAJI_POKOK_TABLE[golongan]
  if (!table) return []
  return Object.keys(table).map(Number).sort((a, b) => a - b)
}
