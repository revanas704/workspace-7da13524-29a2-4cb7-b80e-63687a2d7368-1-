import { db } from '../src/lib/db'
import bcrypt from 'bcryptjs'

async function main() {
  try {
    console.log('🌱 Seeding database...')

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10)
    const admin = await db.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        password: adminPassword,
        role: 'ADMIN',
      },
    })
    console.log('✅ Admin user created:', admin.username)

    // Create sample guru user
    const guruPassword = await bcrypt.hash('guru123', 10)
    const sampleGuruUser = await db.user.upsert({
      where: { username: '198001012005011001' },
      update: {},
      create: {
        username: '198001012005011001',
        password: guruPassword,
        role: 'GURU',
      },
    })
    console.log('✅ Sample guru user created')

    // Create sample guru data
    const { calculateSalaries } = await import('../src/lib/salary-calculator')
    const salaryData = calculateSalaries('Penata Muda', 'III/a', 10, 2000000)

    const sampleGuru = await db.guru.upsert({
      where: { nip: '198001012005011001' },
      update: {},
      create: {
        nik: '3201128000010001',
        nuptk: '1234567890123456',
        nip: '198001012005011001',
        nama: 'Budi Santoso, S.Pd.',
        pangkat: 'Penata Muda',
        golongan: 'III/a',
        masaKerja: 10,
        namaPemilikRekening: 'Budi Santoso',
        nomorRekening: '1234567890',
        bank: 'Bank BNI',
        satuanPendidikan: 'SD Negeri 1 Jakarta',
        gajiPokok: salaryData.gajiPokok,
        salurBruto: 2000000,
        pph: salaryData.pph,
        potonganJkn: salaryData.potonganJkn,
        salurNetto: salaryData.salurNetto,
        statusSktp: 'TERBIT',
        user: {
          connect: { id: sampleGuruUser.id },
        },
      },
    })
    console.log('✅ Sample guru data created:', sampleGuru.nama)

    console.log('\n🎉 Seeding completed successfully!')
    console.log('\n📝 Login credentials:')
    console.log('   Admin: username=admin, password=admin123')
    console.log('   Guru: username=198001012005011001, password=guru123')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

main()
