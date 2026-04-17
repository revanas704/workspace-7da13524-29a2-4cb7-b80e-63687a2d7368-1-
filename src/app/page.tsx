'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, Shield, TrendingUp, Users } from 'lucide-react'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role === 'ADMIN') {
        router.push('/admin/dashboard')
      } else {
        router.push('/guru/dashboard')
      }
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Memuat...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <header className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">SIM Tunjangan Profesi</h1>
                <p className="text-sm text-muted-foreground">Sistem Informasi Manajemen Tunjangan Profesi Guru</p>
              </div>
            </div>
            <Button onClick={() => router.push('/login')}>
              Masuk
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 text-slate-900 dark:text-slate-100">
            Kelola Tunjangan Profesi Guru dengan Mudah
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Sistem informasi terintegrasi untuk mengelola data guru, perhitungan tunjangan,
            dan verifikasi pengajuan secara modern dan efisien.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Manajemen Data</CardTitle>
              <CardDescription>
                Kelola data guru secara lengkap dan terstruktur
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Perhitungan Otomatis</CardTitle>
              <CardDescription>
                Hitung gaji pokok dan tunjangan sesuai PP No. 5 Tahun 2024
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Sistem Verifikasi</CardTitle>
              <CardDescription>
                Proses pengajuan perubahan data dengan verifikasi admin
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Laporan Terintegrasi</CardTitle>
              <CardDescription>
                Export data laporan dalam format Excel dengan mudah
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-2 border-primary">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">Mulai Gunakan Sistem</CardTitle>
              <CardDescription className="text-base">
                Silakan login untuk mengakses dashboard dan mulai menggunakan sistem
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => router.push('/login')}
              >
                Masuk ke Sistem
              </Button>
              <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                <p>• Guru: Gunakan NIP sebagai username</p>
                <p>• Admin: Gunakan username dan password admin</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 SIM Tunjangan Profesi Guru. Semua hak dilindungi.</p>
        </div>
      </footer>
    </div>
  )
}
