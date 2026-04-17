'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, Shield, TrendingUp, Users, Sparkles } from 'lucide-react'

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
        <div className="text-center">
          <div className="animate-pulse text-2xl font-bold bg-gradient-to-r from-red-700 to-amber-600 bg-clip-text text-transparent">
            Memuat...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange-200/20 rounded-full blur-3xl" />
      </div>

      {/* Hero Section - Glassmorphism Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md shadow-lg border-b border-red-200/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-red-700 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-700 to-amber-600 bg-clip-text text-transparent">
                  SIM Tunjangan Profesi
                </h1>
                <p className="text-sm text-slate-600">Sistem Informasi Manajemen Tunjangan Profesi Guru</p>
              </div>
            </div>
            <Button
              onClick={() => router.push('/login')}
              className="bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-800 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-8"
            >
              Masuk
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-5xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-amber-100 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-semibold text-amber-700">Pemerintah Kabupaten Blitar</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-red-700 via-amber-600 to-orange-500 bg-clip-text text-transparent leading-tight">
            Kelola Tunjangan Profesi Guru dengan Mudah
          </h2>
          <p className="text-xl text-slate-700 mb-10 max-w-3xl mx-auto leading-relaxed">
            Sistem informasi terintegrasi untuk mengelola data guru, perhitungan tunjangan,
            dan verifikasi pengajuan secara modern dan efisien.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <Card className="relative overflow-hidden bg-white/90 backdrop-blur-sm border-2 border-red-200/50 hover:border-red-400/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-700/10 to-transparent rounded-bl-3xl" />
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-red-50 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <Users className="w-7 h-7 text-red-700" />
              </div>
              <CardTitle className="text-lg font-bold text-red-900">Manajemen Data</CardTitle>
              <CardDescription className="text-slate-600">
                Kelola data guru secara lengkap dan terstruktur
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden bg-white/90 backdrop-blur-sm border-2 border-amber-200/50 hover:border-amber-400/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-600/10 to-transparent rounded-bl-3xl" />
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <TrendingUp className="w-7 h-7 text-amber-700" />
              </div>
              <CardTitle className="text-lg font-bold text-amber-900">Perhitungan Otomatis</CardTitle>
              <CardDescription className="text-slate-600">
                Hitung gaji pokok dan tunjangan sesuai PP No. 5 Tahun 2024
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden bg-white/90 backdrop-blur-sm border-2 border-orange-200/50 hover:border-orange-400/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-3xl" />
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <Shield className="w-7 h-7 text-orange-700" />
              </div>
              <CardTitle className="text-lg font-bold text-orange-900">Sistem Verifikasi</CardTitle>
              <CardDescription className="text-slate-600">
                Proses pengajuan perubahan data dengan verifikasi admin
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden bg-white/90 backdrop-blur-sm border-2 border-red-200/50 hover:border-amber-400/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-600/10 to-transparent rounded-bl-3xl" />
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-amber-50 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <GraduationCap className="w-7 h-7 text-red-700" />
              </div>
              <CardTitle className="text-lg font-bold text-red-900">Laporan Terintegrasi</CardTitle>
              <CardDescription className="text-slate-600">
                Export data laporan dalam format Excel dengan mudah
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto">
          <Card className="relative overflow-hidden bg-gradient-to-br from-red-700 to-amber-600 text-white shadow-2xl border-0">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-tr-full" />
            <CardHeader className="text-center relative z-10 pb-4">
              <CardTitle className="text-3xl md:text-4xl font-bold mb-4">Mulai Gunakan Sistem</CardTitle>
              <CardDescription className="text-white/90 text-lg">
                Silakan login untuk mengakses dashboard dan mulai menggunakan sistem
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center relative z-10">
              <Button
                size="lg"
                className="text-lg px-12 py-7 bg-white text-red-700 hover:bg-red-50 shadow-xl hover:shadow-2xl transition-all duration-300 font-bold"
                onClick={() => router.push('/login')}
              >
                Masuk ke Sistem
              </Button>
              <div className="mt-8 space-y-3 text-sm text-white/90 bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 text-white font-semibold mb-2">
                  <Shield className="w-5 h-5" />
                  <span>Panduan Login</span>
                </div>
                <p>• Guru: Gunakan NIP sebagai username</p>
                <p>• Admin: Gunakan username dan password admin</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-gradient-to-r from-red-800 to-amber-700 text-white mt-auto border-t border-red-700/50">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img
              src="/Kabupaten Blitar(1).png"
              alt="Logo Pemkab Blitar"
              className="w-10 h-10 object-contain"
            />
            <p className="font-semibold text-lg">Pemerintah Kabupaten Blitar</p>
          </div>
          <p className="text-sm text-white/90">Dinas Pendidikan</p>
          <p className="text-xs text-white/70 mt-3">&copy; 2024 SIM Tunjangan Profesi Guru. Semua hak dilindungi.</p>
        </div>
      </footer>
    </div>
  )
}
