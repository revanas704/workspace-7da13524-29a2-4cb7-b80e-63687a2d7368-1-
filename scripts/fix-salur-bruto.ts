import { db } from '@/lib/db'

/**
 * Migration Script to fix salurBruto values in database
 * Ensures that salurBruto always equals gajiPokok for all records
 */

async function fixSalurBruto() {
  console.log('🔧 Starting migration: Fix salurBruto to equal gajiPokok...')

  try {
    // Get all gurus
    const gurus = await db.guru.findMany()

    console.log(`📊 Found ${gurus.length} guru records`)

    let fixedCount = 0
    let alreadyCorrectCount = 0

    for (const guru of gurus) {
      const gajiPokok = guru.gajiPokok
      const salurBruto = guru.salurBruto

      // Check if they are already equal
      if (Math.abs(gajiPokok - salurBruto) < 0.01) {
        alreadyCorrectCount++
        continue
      }

      // Update salurBruto to equal gajiPokok
      await db.guru.update({
        where: { id: guru.id },
        data: {
          salurBruto: gajiPokok,
        },
      })

      fixedCount++
      console.log(`✓ Fixed ${guru.nama} (${guru.nip}): salurBruto ${salurBruto} → ${gajiPokok}`)
    }

    console.log('\n✅ Migration completed!')
    console.log(`📈 Records fixed: ${fixedCount}`)
    console.log(`✅ Records already correct: ${alreadyCorrectCount}`)
    console.log(`📊 Total records processed: ${gurus.length}`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error during migration:', error)
    process.exit(1)
  }
}

fixSalurBruto()
