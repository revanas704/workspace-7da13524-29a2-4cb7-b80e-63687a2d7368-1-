'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, GraduationCap, ShieldCheck, Sparkles, Clock, Calendar } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Real-time date and time
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Format date in Indonesian
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    return date.toLocaleDateString('id-ID', options)
  }

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  // Get current year
  const currentYear = currentDateTime.getFullYear()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Username atau password salah')
        setIsLoading(false)
      } else {
        // Login successful, redirect to home page
        // The home page will check the session and redirect to the appropriate dashboard
        router.push('/')
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange-200/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Logo Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-28 h-28 mb-6 bg-gradient-to-br from-red-100 to-amber-100 rounded-full shadow-xl">
            <img
              src="/Kabupaten Blitar(1).png"
              alt="Logo Pemkab Blitar"
              className="w-20 h-20 object-contain"
            />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-amber-100 rounded-full mb-3">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700">Pemerintah Kabupaten Blitar</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 to-amber-600 bg-clip-text text-transparent mb-2">
            Dinas Pendidikan
          </h1>
          <p className="text-sm text-slate-600">Kabupaten Blitar</p>
        </div>

        <Card className="shadow-2xl border-2 border-red-200/50 bg-white/90 backdrop-blur-sm overflow-hidden">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 px-6 py-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-tr-full" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <GraduationCap className="h-9 w-9 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                SIM Tunjangan Profesi
              </CardTitle>
              <CardDescription className="text-white/90 mt-2 text-base">
                Sistem Informasi Manajemen Tunjangan Profesi Guru
              </CardDescription>
            </div>
          </div>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="border-red-300 bg-red-50/90 backdrop-blur-sm">
                  <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <Label htmlFor="username" className="text-sm font-bold text-red-900">
                  Username / NIP
                </Label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-red-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Masukkan username atau NIP"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 pl-12 border-red-200 focus:border-red-500 focus:ring-red-500/50 bg-white/80 backdrop-blur-sm text-base"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-bold text-red-900">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 border-red-200 focus:border-red-500 focus:ring-red-500/50 bg-white/80 backdrop-blur-sm text-base"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-800 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all duration-300 font-bold text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Masuk'
                )}
              </Button>

              <div className="mt-6 p-5 bg-gradient-to-r from-red-50 to-amber-50 rounded-xl border border-red-200/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-gradient-to-br from-red-700 to-amber-600 rounded-lg">
                    <ShieldCheck className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm font-bold text-red-900">Petunjuk Login</p>
                </div>
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <p><strong>Guru:</strong> Gunakan NIP sebagai username</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <p><strong>Admin:</strong> Gunakan username admin</p>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img
              src="/Kabupaten Blitar(1).png"
              alt="Logo Pemkab Blitar"
              className="w-6 h-6 object-contain"
            />
            <p className="text-sm font-semibold text-red-800">Pemerintah Kabupaten Blitar</p>
          </div>
          <p className="text-xs text-slate-600 mb-3">Dinas Pendidikan</p>

          {/* Real-time Date and Time */}
          <div className="flex items-center justify-center gap-4 mb-3 bg-gradient-to-r from-red-50 to-amber-50 rounded-lg py-2 px-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-red-600" />
              <span className="text-xs font-medium text-slate-700">{formatDate(currentDateTime)}</span>
            </div>
            <div className="h-4 w-px bg-slate-300" />
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs font-mono font-medium text-slate-700">{formatTime(currentDateTime)}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500">&copy; {currentYear} Semua hak dilindungi.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  )
}
