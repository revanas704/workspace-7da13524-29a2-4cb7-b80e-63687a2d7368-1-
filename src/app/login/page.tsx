'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, GraduationCap, ShieldCheck } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
      } else {
        // Redirect based on role
        const response = await fetch('/api/auth/me')
        const user = await response.json()

        if (user.role === 'ADMIN') {
          router.push('/admin/dashboard')
        } else {
          router.push('/guru/dashboard')
        }
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200/30 dark:bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-200/30 dark:bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-200/20 dark:bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-6 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-2xl mb-4 ring-4 ring-white dark:ring-slate-700">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/2/23/Lambang_Kabupaten_Blitar.png"
              alt="Logo Pemkab Blitar"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            PEMERINTAH KABUPATEN BLITAR
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Dinas Pendidikan</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="space-y-3 text-center pb-4">
            <div className="flex justify-center">
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl">
                <GraduationCap className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              SIM Tunjangan Profesi
            </CardTitle>
            <CardDescription className="text-base text-slate-600 dark:text-slate-300">
              Sistem Informasi Manajemen Tunjangan Profesi Guru
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20">
                  <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Username / NIP
                </Label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Masukkan username atau NIP"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11 pl-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
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
                  className="h-11 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Masuk'
                )}
              </Button>

              <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-700/50 dark:to-slate-700/50 rounded-xl border border-emerald-100 dark:border-slate-600">
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Petunjuk Login
                </p>
                <div className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  <p>• Guru: Gunakan NIP sebagai username</p>
                  <p>• Admin: Gunakan username admin</p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-slate-600 dark:text-slate-400">
          <p className="font-medium">© 2024 Pemerintah Kabupaten Blitar</p>
          <p className="text-xs mt-1">Dinas Pendidikan</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
