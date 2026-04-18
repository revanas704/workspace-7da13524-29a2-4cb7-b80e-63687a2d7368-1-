const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('=== Checking DAK Penyaluran data ===')

  const penyaluranList = await prisma.dAKPenyaluran.findMany({
    take: 5
  })

  console.log('Total penyaluran:', penyaluranList.length)

  if (penyaluranList.length > 0) {
    const sample = penyaluranList[0]
    console.log('Sample penyaluran:', {
      id: sample.id,
      idType: typeof sample.id,
      jenis: sample.jenis,
      status: sample.status,
      periode: sample.periode,
      gelombang: sample.gelombang
    })

    // Test update
    console.log('\n=== Testing update ===')
    try {
      const updated = await prisma.dAKPenyaluran.update({
        where: { id: sample.id },
        data: { status: 'UPLOAD_SELESAI' },
        select: {
          id: true,
          status: true
        }
      })
      console.log('Update SUCCESS:', updated)
    } catch (error) {
      console.error('Update FAILED:', error.message)
    }
  } else {
    console.log('No data found. Please import data first.')
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
  })
