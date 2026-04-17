/**
 * Gaji Pokok PNS Berdasarkan PP 5 Tahun 2024
 * Peraturan Pemerintah Nomor 5 Tahun 2024 tentang Perubahan ke-18 atas
 * Peraturan Pemerintah Nomor 7 Tahun 1977 tentang Peraturan Gaji Pegawai Negeri Sipil
 *
 * Gaji pokok ditentukan berdasarkan Golongan, Pangkat, dan Masa Kerja
 * Data resmi sesuai PP Nomor 5 Tahun 2024
 */

export interface GajiPokok {
  golongan: string
  pangkat: string
  masaKerja: number
  gajiPokok: number
}

// Gaji Pokok berdasarkan Golongan, Pangkat, dan Masa Kerja (dalam tahun)
// Data resmi PP Nomor 5 Tahun 2024
const GAJI_POKOK_TABLE: { [key: string]: { [key: number]: number } } = {
  // ============================
  // GOLONGAN I - JURU
  // ============================

  // I/a - Juru Muda: Rp1.685.700 - Rp2.522.600
  'I/a': {
    0: 1685700,
    2: 1737800,
    4: 1789900,
    6: 1842000,
    8: 1894100,
    10: 1946200,
    12: 1998300,
    14: 2050400,
    16: 2102500,
    18: 2154600,
    20: 2206700,
    22: 2258800,
    24: 2310900,
    26: 2363000,
    28: 2415100,
    30: 2467200,
    32: 2522600,
  },

  // I/b - Juru Muda Tingkat I: Rp1.840.800 - Rp2.670.700
  'I/b': {
    0: 1840800,
    2: 1894900,
    4: 1949000,
    6: 2003100,
    8: 2057200,
    10: 2111300,
    12: 2165400,
    14: 2219500,
    16: 2273600,
    18: 2327700,
    20: 2381800,
    22: 2435900,
    24: 2490000,
    26: 2544100,
    28: 2598200,
    30: 2652300,
    32: 2670700,
  },

  // I/c - Juru: Rp1.918.700 - Rp2.783.700
  'I/c': {
    0: 1918700,
    2: 1973700,
    4: 2028700,
    6: 2083700,
    8: 2138700,
    10: 2193700,
    12: 2248700,
    14: 2303700,
    16: 2358700,
    18: 2413700,
    20: 2468700,
    22: 2523700,
    24: 2578700,
    26: 2633700,
    28: 2688700,
    30: 2743700,
    32: 2783700,
  },

  // I/d - Juru Tingkat I: Rp1.999.900 - Rp2.901.400
  'I/d': {
    0: 1999900,
    2: 2055900,
    4: 2111900,
    6: 2167900,
    8: 2223900,
    10: 2279900,
    12: 2335900,
    14: 2391900,
    16: 2447900,
    18: 2503900,
    20: 2559900,
    22: 2615900,
    24: 2671900,
    26: 2727900,
    28: 2783900,
    30: 2839900,
    32: 2901400,
  },

  // ============================
  // GOLONGAN II - PENGATUR
  // ============================

  // II/a - Pengatur Muda: Rp2.184.000 - Rp3.643.400
  'II/a': {
    0: 2184000,
    2: 2246800,
    4: 2309600,
    6: 2372400,
    8: 2435200,
    10: 2498000,
    12: 2560800,
    14: 2623600,
    16: 2686400,
    18: 2749200,
    20: 2812000,
    22: 2874800,
    24: 2937600,
    26: 3000400,
    28: 3063200,
    30: 3126000,
    32: 3643400,
  },

  // II/b - Pengatur Muda Tingkat I: Rp2.385.000 - Rp3.797.500
  'II/b': {
    0: 2385000,
    2: 2451600,
    4: 2518200,
    6: 2584800,
    8: 2651400,
    10: 2718000,
    12: 2784600,
    14: 2851200,
    16: 2917800,
    18: 2984400,
    20: 3051000,
    22: 3117600,
    24: 3184200,
    26: 3250800,
    28: 3317400,
    30: 3384000,
    32: 3797500,
  },

  // II/c - Pengatur: Rp2.485.900 - Rp3.958.200
  'II/c': {
    0: 2485900,
    2: 2553800,
    4: 2621700,
    6: 2689600,
    8: 2757500,
    10: 2825400,
    12: 2893300,
    14: 2961200,
    16: 3029100,
    18: 3097000,
    20: 3164900,
    22: 3232800,
    24: 3300700,
    26: 3368600,
    28: 3436500,
    30: 3504400,
    32: 3958200,
  },

  // II/d - Pengatur Tingkat I: Rp2.591.100 - Rp4.125.600
  'II/d': {
    0: 2591100,
    2: 2660200,
    4: 2729300,
    6: 2798400,
    8: 2867500,
    10: 2936600,
    12: 3005700,
    14: 3074800,
    16: 3143900,
    18: 3213000,
    20: 3282100,
    22: 3351200,
    24: 3420300,
    26: 3489400,
    28: 3558500,
    30: 3627600,
    32: 4125600,
  },

  // ============================
  // GOLONGAN III - PENATA
  // ============================

  // III/a - Penata Muda: Rp2.785.700 - Rp4.575.200
  'III/a': {
    0: 2785700,
    2: 2860000,
    4: 2934300,
    6: 3008600,
    8: 3082900,
    10: 3157200,
    12: 3231500,
    14: 3305800,
    16: 3380100,
    18: 3454400,
    20: 3528700,
    22: 3603000,
    24: 3677300,
    26: 3751600,
    28: 3825900,
    30: 3900200,
    32: 4575200,
  },

  // III/b - Penata Muda Tingkat I: Rp2.903.600 - Rp4.768.800
  'III/b': {
    0: 2903600,
    2: 2980000,
    4: 3056400,
    6: 3132800,
    8: 3209200,
    10: 3285600,
    12: 3362000,
    14: 3438400,
    16: 3514800,
    18: 3591200,
    20: 3667600,
    22: 3744000,
    24: 3820400,
    26: 3896800,
    28: 3973200,
    30: 4049600,
    32: 4768800,
  },

  // III/c - Penata: Rp3.026.400 - Rp4.970.500
  'III/c': {
    0: 3026400,
    2: 3104000,
    4: 3181600,
    6: 3259200,
    8: 3336800,
    10: 3414400,
    12: 3492000,
    14: 3569600,
    16: 3647200,
    18: 3724800,
    20: 3802400,
    22: 3880000,
    24: 3957600,
    26: 4035200,
    28: 4112800,
    30: 4190400,
    32: 4970500,
  },

  // III/d - Penata Tingkat I: Rp3.154.400 - Rp5.180.700
  'III/d': {
    0: 3154400,
    2: 3233200,
    4: 3312000,
    6: 3390800,
    8: 3469600,
    10: 3548400,
    12: 3627200,
    14: 3706000,
    16: 3784800,
    18: 3863600,
    20: 3942400,
    22: 4021200,
    24: 4100000,
    26: 4178800,
    28: 4257600,
    30: 4336400,
    32: 5180700,
  },

  // ============================
  // GOLONGAN IV - PEMBINA
  // ============================

  // IV/a - Pembina: Rp3.287.800 - Rp5.399.900
  'IV/a': {
    0: 3287800,
    2: 3379300,
    4: 3470800,
    6: 3562300,
    8: 3653800,
    10: 3745300,
    12: 3836800,
    14: 3928300,
    16: 4019800,
    18: 4111300,
    20: 4202800,
    22: 4294300,
    24: 4385800,
    26: 4477300,
    28: 4568800,
    30: 4660300,
    32: 5399900,
    33: 5399900,
    34: 5399900,
  },

  // IV/b - Pembina Pratama: Rp3.426.900 - Rp5.628.300
  'IV/b': {
    0: 3426900,
    2: 3521700,
    4: 3616500,
    6: 3711300,
    8: 3806100,
    10: 3900900,
    12: 3995700,
    14: 4090500,
    16: 4185300,
    18: 4280100,
    20: 4374900,
    22: 4469700,
    24: 4564500,
    26: 4659300,
    28: 4754100,
    30: 4848900,
    32: 5628300,
    33: 5628300,
    34: 5628300,
  },

  // IV/c - Pembina Utama Muda: Rp3.571.900 - Rp5.866.400
  'IV/c': {
    0: 3571900,
    2: 3713500,
    4: 3855100,
    6: 3996700,
    8: 4138300,
    10: 4279900,
    12: 4421500,
    14: 4563100,
    16: 4704700,
    18: 4846300,
    20: 4987900,
    22: 5129500,
    24: 5271100,
    26: 5412700,
    28: 5554300,
    30: 5695900,
    32: 5866400,
    33: 5951900,
    34: 6037400,
  },

  // IV/d - Pembina Utama Madya: Rp3.723.000 - Rp6.114.500
  'IV/d': {
    0: 3723000,
    2: 3821400,
    4: 3919800,
    6: 4018200,
    8: 4116600,
    10: 4215000,
    12: 4313400,
    14: 4411800,
    16: 4510200,
    18: 4608600,
    20: 4707000,
    22: 4805400,
    24: 4903800,
    26: 5002200,
    28: 5100600,
    30: 5199000,
    32: 6114500,
    33: 6114500,
    34: 6114500,
  },

  // IV/e - Pembina Utama: Rp3.880.400 - Rp6.373.200
  'IV/e': {
    0: 3880400,
    2: 3981200,
    4: 4082000,
    6: 4182800,
    8: 4283600,
    10: 4384400,
    12: 4485200,
    14: 4586000,
    16: 4686800,
    18: 4787600,
    20: 4888400,
    22: 4989200,
    24: 5090000,
    26: 5190800,
    28: 5291600,
    30: 5392400,
    32: 6373200,
    33: 6373200,
    34: 6373200,
  },
}

// Mapping Pangkat berdasarkan Golongan (PP 5 Tahun 2024)
export const PANGKAT_BY_GOLONGAN: { [key: string]: string } = {
  // Golongan I
  'I/a': 'Juru Muda',
  'I/b': 'Juru Muda Tingkat I',
  'I/c': 'Juru',
  'I/d': 'Juru Tingkat I',

  // Golongan II
  'II/a': 'Pengatur Muda',
  'II/b': 'Pengatur Muda Tingkat I',
  'II/c': 'Pengatur',
  'II/d': 'Pengatur Tingkat I',

  // Golongan III
  'III/a': 'Penata Muda',
  'III/b': 'Penata Muda Tingkat I',
  'III/c': 'Penata',
  'III/d': 'Penata Tingkat I',

  // Golongan IV
  'IV/a': 'Pembina',
  'IV/b': 'Pembina Pratama',
  'IV/c': 'Pembina Utama Muda',
  'IV/d': 'Pembina Utama Madya',
  'IV/e': 'Pembina Utama',
}

/**
 * Mendapatkan gaji pokok berdasarkan golongan dan masa kerja
 * @param golongan Golongan pegawai (contoh: 'I/a', 'III/b', 'IV/c')
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

  // Find highest masa kerja threshold that is <= actual masa kerja
  let matchedMasaKerja = masaKerjaThresholds[0]
  for (const threshold of masaKerjaThresholds) {
    if (masaKerja >= threshold) {
      matchedMasaKerja = threshold
    } else {
      break
    }
  }

  // Cap at maximum masa kerja (34 years for Golongan IV, 32 years for others)
  const maxMasaKerja = masaKerjaThresholds[masaKerjaThresholds.length - 1]
  const finalMasaKerjaKey = Math.min(masaKerja, maxMasaKerja)

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

/**
 * Mendapatkan pangkat berdasarkan golongan
 * @param golongan Golongan pegawai
 * @returns Nama pangkat, atau kosong jika tidak ditemukan
 */
export function getPangkatByGolongan(golongan: string): string {
  return PANGKAT_BY_GOLONGAN[golongan] || ''
}

/**
 * Mendapatkan daftar golongan berdasarkan jenis golongan (I, II, III, IV)
 * @param jenis Jenis golongan (1, 2, 3, atau 4)
 * @returns Array string golongan yang sesuai dengan jenis
 */
export function getGolonganByJenis(jenis: number): string[] {
  const prefix = jenis.toString()
  return Object.keys(GAJI_POKOK_TABLE).filter(gol => gol.startsWith(prefix + '/'))
}
