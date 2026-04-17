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

  // I/a - Juru Muda
  'I/a': {
    0: 1685700,
    2: 1724000,
    4: 1762300,
    6: 1800600,
    8: 1838900,
    10: 1877200,
    12: 1915500,
    14: 1953800,
    16: 1992100,
    18: 2030400,
    20: 2068700,
    22: 2107000,
    24: 2145300,
    26: 2183600,
    28: 2221900,
    30: 2260200,
    32: 2298500,
  },

  // I/b - Juru Muda Tingkat I
  'I/b': {
    0: 1840800,
    2: 1880500,
    4: 1920200,
    6: 1959900,
    8: 1999600,
    10: 2039300,
    12: 2079000,
    14: 2118700,
    16: 2158400,
    18: 2198100,
    20: 2237800,
    22: 2277500,
    24: 2317200,
    26: 2356900,
    28: 2396600,
    30: 2436300,
    32: 2476000,
  },

  // I/c - Juru
  'I/c': {
    0: 1918700,
    2: 1960000,
    4: 2001300,
    6: 2042600,
    8: 2083900,
    10: 2125200,
    12: 2166500,
    14: 2207800,
    16: 2249100,
    18: 2290400,
    20: 2331700,
    22: 2373000,
    24: 2414300,
    26: 2455600,
    28: 2496900,
    30: 2538200,
    32: 2579500,
  },

  // I/d - Juru Tingkat I
  'I/d': {
    0: 2005200,
    2: 2048000,
    4: 2090800,
    6: 2133600,
    8: 2176400,
    10: 2219200,
    12: 2262000,
    14: 2304800,
    16: 2347600,
    18: 2390400,
    20: 2433200,
    22: 2476000,
    24: 2518800,
    26: 2561600,
    28: 2604400,
    30: 2647200,
    32: 2690000,
  },

  // ============================
  // GOLONGAN II - PENGATUR
  // ============================

  // II/a - Pengatur Muda
  'II/a': {
    0: 2184000,
    2: 2229000,
    4: 2274000,
    6: 2319000,
    8: 2364000,
    10: 2409000,
    12: 2454000,
    14: 2499000,
    16: 2544000,
    18: 2589000,
    20: 2634000,
    22: 2679000,
    24: 2724000,
    26: 2769000,
    28: 2814000,
    30: 2859000,
    32: 2904000,
  },

  // II/b - Pengatur Muda Tingkat I
  'II/b': {
    0: 2268000,
    2: 2313500,
    4: 2359000,
    6: 2404500,
    8: 2450000,
    10: 2495500,
    12: 2541000,
    14: 2586500,
    16: 2632000,
    18: 2677500,
    20: 2723000,
    22: 2768500,
    24: 2814000,
    26: 2859500,
    28: 2905000,
    30: 2950500,
    32: 2996000,
  },

  // II/c - Pengatur
  'II/c': {
    0: 2358000,
    2: 2405000,
    4: 2452000,
    6: 2499000,
    8: 2546000,
    10: 2593000,
    12: 2640000,
    14: 2687000,
    16: 2734000,
    18: 2781000,
    20: 2828000,
    22: 2875000,
    24: 2922000,
    26: 2969000,
    28: 3016000,
    30: 3063000,
    32: 3110000,
  },

  // II/d - Pengatur Tingkat I
  'II/d': {
    0: 2454000,
    2: 2502000,
    4: 2550000,
    6: 2598000,
    8: 2646000,
    10: 2694000,
    12: 2742000,
    14: 2790000,
    16: 2838000,
    18: 2886000,
    20: 2934000,
    22: 2982000,
    24: 3030000,
    26: 3078000,
    28: 3126000,
    30: 3174000,
    32: 3222000,
  },

  // ============================
  // GOLONGAN III - PENATA
  // ============================

  // III/a - Penata Muda
  'III/a': {
    0: 2785700,
    2: 2838000,
    4: 2890300,
    6: 2942600,
    8: 2994900,
    10: 3047200,
    12: 3099500,
    14: 3151800,
    16: 3204100,
    18: 3256400,
    20: 3308700,
    22: 3361000,
    24: 3413300,
    26: 3465600,
    28: 3517900,
    30: 3570200,
    32: 3622500,
  },

  // III/b - Penata Muda Tingkat I
  'III/b': {
    0: 2875000,
    2: 2928500,
    4: 2982000,
    6: 3035500,
    8: 3089000,
    10: 3142500,
    12: 3196000,
    14: 3249500,
    16: 3303000,
    18: 3356500,
    20: 3410000,
    22: 3463500,
    24: 3517000,
    26: 3570500,
    28: 3624000,
    30: 3677500,
    32: 3731000,
  },

  // III/c - Penata
  'III/c': {
    0: 2968000,
    2: 3023000,
    4: 3078000,
    6: 3133000,
    8: 3188000,
    10: 3243000,
    12: 3298000,
    14: 3353000,
    16: 3408000,
    18: 3463000,
    20: 3518000,
    22: 3573000,
    24: 3628000,
    26: 3683000,
    28: 3738000,
    30: 3793000,
    32: 3848000,
  },

  // III/d - Penata Tingkat I
  'III/d': {
    0: 3063000,
    2: 3119000,
    4: 3175000,
    6: 3231000,
    8: 3287000,
    10: 3343000,
    12: 3399000,
    14: 3455000,
    16: 3511000,
    18: 3567000,
    20: 3623000,
    22: 3679000,
    24: 3735000,
    26: 3791000,
    28: 3847000,
    30: 3903000,
    32: 3959000,
  },

  // ============================
  // GOLONGAN IV - PEMBINA
  // ============================

  // IV/a - Pembina
  'IV/a': {
    0: 3625000,
    2: 3689000,
    4: 3753000,
    6: 3817000,
    8: 3881000,
    10: 3945000,
    12: 4009000,
    14: 4073000,
    16: 4137000,
    18: 4201000,
    20: 4265000,
    22: 4329000,
    24: 4393000,
    26: 4457000,
    28: 4521000,
    30: 4585000,
    32: 4649000,
    33: 4686000,
    34: 4723000,
  },

  // IV/b - Pembina Pratama
  'IV/b': {
    0: 3978000,
    2: 4043000,
    4: 4108000,
    6: 4173000,
    8: 4238000,
    10: 4303000,
    12: 4368000,
    14: 4433000,
    16: 4498000,
    18: 4563000,
    20: 4628000,
    22: 4693000,
    24: 4758000,
    26: 4823000,
    28: 4888000,
    30: 4953000,
    32: 5018000,
    33: 5055500,
    34: 5093000,
  },

  // IV/c - Pembina Utama Muda
  'IV/c': {
    0: 4320500,
    2: 4386500,
    4: 4452500,
    6: 4518500,
    8: 4584500,
    10: 4650500,
    12: 4716500,
    14: 4782500,
    16: 4848500,
    18: 4914500,
    20: 4980500,
    22: 5046500,
    24: 5112500,
    26: 5178500,
    28: 5244500,
    30: 5310500,
    32: 5866400,
    33: 5936400,
    34: 6006400,
  },

  // IV/d - Pembina Utama Madya
  'IV/d': {
    0: 4663000,
    2: 4730000,
    4: 4797000,
    6: 4864000,
    8: 4931000,
    10: 4998000,
    12: 5065000,
    14: 5132000,
    16: 5199000,
    18: 5266000,
    20: 5333000,
    22: 5400000,
    24: 5467000,
    26: 5534000,
    28: 5601000,
    30: 5668000,
    32: 5735000,
    33: 5773500,
    34: 5812000,
  },

  // IV/e - Pembina Utama
  'IV/e': {
    0: 5005500,
    2: 5073500,
    4: 5141500,
    6: 5209500,
    8: 5277500,
    10: 5345500,
    12: 5413500,
    14: 5481500,
    16: 5549500,
    18: 5617500,
    20: 5685500,
    22: 5753500,
    24: 5821500,
    26: 5889500,
    28: 5957500,
    30: 6025500,
    32: 6093500,
    33: 6132500,
    34: 6171500,
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
