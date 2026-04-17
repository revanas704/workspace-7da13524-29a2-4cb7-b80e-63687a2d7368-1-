'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { 
  User, 
  Briefcase, 
  DollarSign, 
  FileText, 
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  CreditCard,
  Landmark,
  GraduationCap,
  Plus,
  Download,
  Trash2
} from 'lucide-react'
import { formatCurrency } from '@/lib/salary-calculator'
import { getGajiPokok, getPangkatByGolongan } from '@/lib/gaji-pokok-pp5'

interface PengajuanItem {
  id: string
  jenisPengajuan: string
  status: string
  tanggalDiajukan: string
  tanggalVerifikasi?: string
  catatan?: string
  dokumenPendukung?: string
}

interface GuruData {
  id: string
  nik: string
  nuptk: string
  nip: string
  nama: string
  pangkat: string
  golongan: string
  masaKerja: number
  namaPemilikRekening: string
  nomorRekening: string
  bank: string
  satuanPendidikan: string
  gajiPokok: number
  salurBruto: number
  pph: number
  potonganJkn: number
  salurNetto: number
  statusSktp: string
  pengajuanList: Array<PengajuanItem>
}

export default function GuruDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [guruData, setGuruData] = useState<GuruData | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Pengajuan dialog state
  const [showPengajuanDialog, setShowPengajuanDialog] = useState(false)
  const [jenisPengajuan, setJenisPengajuan] = useState('')
  const [formData, setFormData] = useState<any>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete pengajuan dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedPengajuanToDelete, setSelectedPengajuanToDelete] = useState<PengajuanItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    fetchGuruData()
  }, [status, session])

  const handleLogout = async () => {
    await router.push('/login')
  }

  const handlePengajuanSubmit = async () => {
    // Validation for GAJI_POKOK
    if (jenisPengajuan === 'GAJI_POKOK') {
      if (!formData.golongan || formData.masaKerja === undefined || formData.masaKerja === null) {
        toast.error('Mohon lengkapi Golongan dan Masa Kerja')
        return
      }
      if (!formData.dokumen) {
        toast.error('Mohon upload SK Berkala / SK Pangkat')
        return
      }
    }

    // Validation for REKENING
    if (jenisPengajuan === 'REKENING') {
      if (!formData.namaPemilikRekening || !formData.nomorRekening) {
        toast.error('Mohon lengkapi semua data rekening')
        return
      }

      // Validate nomorRekening length (10-13 digits)
      const nomorRekeningDigits = formData.nomorRekening.replace(/\D/g, '')
      if (nomorRekeningDigits.length < 10 || nomorRekeningDigits.length > 13) {
        toast.error('Nomor rekening harus terdiri dari 10-13 digit angka')
        return
      }

      // Set default bank to BPD JAWA TIMUR
      const finalFormData = {
        ...formData,
        bank: formData.bank || 'BPD JAWA TIMUR'
      }
      setFormData(finalFormData)

      if (!formData.alasan) {
        toast.error('Mohon pilih alasan perubahan')
        return
      }
      if (!formData.dokumen) {
        toast.error('Mohon upload dokumen pendukung')
        return
      }
    }

    setIsSubmitting(true)
    try {
      // Use FormData for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('jenisPengajuan', jenisPengajuan)
      
      // Prepare dataBaru (exclude the file object)
      const dataBaru = { ...formData }
      delete dataBaru.dokumen
      formDataToSend.append('dataBaru', JSON.stringify(dataBaru))
      
      // Append file if exists
      if (formData.dokumen) {
        formDataToSend.append('dokumen', formData.dokumen)
      }

      const response = await fetch('/api/guru/pengajuan', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        toast.success('Pengajuan berhasil dikirim')
        setShowPengajuanDialog(false)
        setJenisPengajuan('')
        setFormData({})
        fetchGuruData()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Gagal mengirim pengajuan')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeletePengajuan = async () => {
    if (!selectedPengajuanToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/guru/pengajuan/${selectedPengajuanToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Pengajuan berhasil dihapus')
        setShowDeleteDialog(false)
        setSelectedPengajuanToDelete(null)
        fetchGuruData()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Gagal menghapus pengajuan')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsDeleting(false)
    }
  }

  const fetchGuruData = async () => {
    if (status === 'authenticated' && session?.user?.role === 'GURU') {
      try {
        const response = await fetch('/api/guru/me')
        if (response.ok) {
          const data = await response.json()
          setGuruData(data)
        }
      } catch (error) {
        console.error('Error fetching guru data:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DISETUJUI':
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Disetujui</Badge>
      case 'DITOLAK':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Ditolak</Badge>
      case 'PENDING':
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Menunggu</Badge>
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!guruData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Data tidak ditemukan</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg border-b backdrop-blur-sm bg-opacity-95">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-7 h-7" />
              SIM Tunjangan Profesi
            </h1>
            <p className="text-sm text-white/80">Dashboard Guru</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-white">{guruData.nama}</p>
              <p className="text-sm text-white/70">{guruData.nip}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              className="gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Status SKTP */}
        <Card className="mb-6 shadow-xl border-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          <CardHeader className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl text-white flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <User className="w-6 h-6" />
                  </div>
                  Selamat Datang, {guruData.nama}
                </CardTitle>
                <CardDescription className="text-white/80">Status SKTP Anda saat ini</CardDescription>
              </div>
              {guruData.statusSktp === 'TERBIT' ? (
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-lg px-5 py-3 shadow-lg border-2 border-white/30 backdrop-blur-sm">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  SKTP Terbit
                </Badge>
              ) : (
                <Badge className="bg-amber-500 hover:bg-amber-600 text-lg px-5 py-3 shadow-lg border-2 border-white/30 backdrop-blur-sm">
                  <XCircle className="w-5 h-5 mr-2" />
                  SKTP Belum Terbit
                </Badge>
              )}
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="profil" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm shadow-lg border-0 p-1">
            <TabsTrigger value="profil" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <User className="w-4 h-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="tunjangan" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              <DollarSign className="w-4 h-4 mr-2" />
              Tunjangan
            </TabsTrigger>
            <TabsTrigger value="rekening" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white">
              <Landmark className="w-4 h-4 mr-2" />
              Rekening
            </TabsTrigger>
            <TabsTrigger value="riwayat" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Riwayat
            </TabsTrigger>
          </TabsList>

          {/* Profil Tab */}
          <TabsContent value="profil">
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-indigo-50/50 dark:from-slate-800 dark:to-indigo-950/50">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Data Pribadi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-100 dark:border-blue-900">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">NIK</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{guruData.nik}</p>
                  </div>
                  <div className="space-y-2 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-100 dark:border-purple-900">
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">NUPTK</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{guruData.nuptk}</p>
                  </div>
                  <div className="space-y-2 p-4 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 rounded-lg border border-pink-100 dark:border-pink-900">
                    <p className="text-sm text-pink-600 dark:text-pink-400 font-medium">NIP</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{guruData.nip}</p>
                  </div>
                  <div className="space-y-2 p-4 bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/30 rounded-lg border border-rose-100 dark:border-rose-900">
                    <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">Nama</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{guruData.nama}</p>
                  </div>
                  <div className="space-y-2 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-lg border border-orange-100 dark:border-orange-900">
                    <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Pangkat</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{guruData.pangkat}</p>
                  </div>
                  <div className="space-y-2 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-lg border border-amber-100 dark:border-amber-900">
                    <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">Golongan</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{guruData.golongan}</p>
                  </div>
                  <div className="space-y-2 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-lg border border-emerald-100 dark:border-emerald-900">
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Masa Kerja</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{guruData.masaKerja} Tahun</p>
                  </div>
                  <div className="space-y-2 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 rounded-lg border border-teal-100 dark:border-teal-900">
                    <p className="text-sm text-teal-600 dark:text-teal-400 font-medium">Satuan Pendidikan</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{guruData.satuanPendidikan}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

              {/* Tunjangan Tab */}
          <TabsContent value="tunjangan">
            <div className="grid gap-6">
              <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-500 to-pink-500 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-24 translate-x-24"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Gaji Pokok & Salur Bruto
                  </CardTitle>
                  <CardDescription className="text-white/80">
                    Berdasarkan PP No. 5 Tahun 2024
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                      <p className="text-sm text-white/90 mb-1">Gaji Pokok</p>
                      <p className="text-3xl font-bold text-white">
                        {formatCurrency(guruData.gajiPokok)}
                      </p>
                      <p className="text-xs text-white/80 mt-2">
                        {guruData.pangkat} - Golongan {guruData.golongan} - {guruData.masaKerja} Tahun
                      </p>
                    </div>
                    <div className="p-5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                      <p className="text-sm text-white/90 mb-1">Salur Bruto</p>
                      <p className="text-3xl font-bold text-white">
                        {formatCurrency(guruData.gajiPokok)}
                      </p>
                      <p className="text-xs text-white/80 mt-2">
                        Sama dengan Gaji Pokok
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-white/25 backdrop-blur-sm rounded-xl border border-white/30 text-center">
                    <p className="text-sm font-medium text-white">
                      ✓ Salur Bruto = Gaji Pokok = {formatCurrency(guruData.gajiPokok)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-rose-50/50 dark:from-slate-800 dark:to-rose-950/50">
                <CardHeader className="bg-gradient-to-r from-rose-500 to-orange-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Rincian Potongan & Salur Netto
                  </CardTitle>
                  <CardDescription className="text-white/90">
                    Potongan PPH dan JKN dari Tunjangan Profesi
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/30 rounded-lg border border-rose-100 dark:border-rose-900">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        <span className="text-slate-700 dark:text-slate-300">PPH ({guruData.golongan === 'I' || guruData.golongan?.startsWith('I/') ? '0%' :
                                     guruData.golongan === 'II' || guruData.golongan?.startsWith('II/') ? '0%' :
                                     guruData.golongan === 'III' || guruData.golongan?.startsWith('III/') ? '5%' :
                                     guruData.golongan === 'IV' || guruData.golongan?.startsWith('IV/') ? '15%' : '0%'} dari Gaji Pokok)</span>
                      </div>
                      <span className="font-semibold text-rose-600 dark:text-rose-400">-{formatCurrency(guruData.pph)}</span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-lg border border-orange-100 dark:border-orange-900">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        <span className="text-slate-700 dark:text-slate-300">Potongan JKN (1% dari Gaji Pokok)</span>
                      </div>
                      <span className="font-semibold text-orange-600 dark:text-orange-400">-{formatCurrency(guruData.potonganJkn)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center p-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg">
                    <span className="text-xl font-bold">Salur Netto</span>
                    <span className="text-3xl font-bold">{formatCurrency(guruData.salurNetto)}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                    Gaji Pokok - PPH - Potongan JKN = {formatCurrency(guruData.gajiPokok - guruData.pph - guruData.potonganJkn)}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Rekening Tab */}
          <TabsContent value="rekening">
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-pink-50/50 dark:from-slate-800 dark:to-pink-950/50">
              <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Landmark className="w-5 h-5" />
                  Informasi Rekening
                </CardTitle>
                <CardDescription className="text-white/90">
                  Data rekening untuk pencairan tunjangan profesi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2 p-4 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 rounded-lg border border-pink-100 dark:border-pink-900">
                  <p className="text-sm text-pink-600 dark:text-pink-400 font-medium">Nama Pemilik Rekening</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-white">{guruData.namaPemilikRekening}</p>
                </div>
                <div className="space-y-2 p-4 bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/30 rounded-lg border border-rose-100 dark:border-rose-900">
                  <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">Nomor Rekening</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-white font-mono">{guruData.nomorRekening}</p>
                </div>
                <div className="space-y-2 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-lg border border-orange-100 dark:border-orange-900">
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Bank</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-white">{guruData.bank}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Riwayat Tab */}
          <TabsContent value="riwayat">
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-orange-50/50 dark:from-slate-800 dark:to-orange-950/50">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Riwayat Pengajuan
                    </CardTitle>
                    <CardDescription className="text-white/90">
                      Riwayat pengajuan perubahan data dan status verifikasi
                    </CardDescription>
                  </div>
                  <Dialog open={showPengajuanDialog} onOpenChange={setShowPengajuanDialog}>
                    <DialogTrigger asChild>
                      <Button className="gap-2 bg-white text-orange-600 hover:bg-orange-50 shadow-lg border-0">
                        <Plus className="w-4 h-4" />
                        Ajukan Perubahan
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Ajukan Perubahan Data</DialogTitle>
                        <DialogDescription>
                          Pilih jenis perubahan yang ingin diajukan
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Jenis Pengajuan</Label>
                          <Select
                            value={jenisPengajuan}
                            onValueChange={(value) => {
                              setJenisPengajuan(value)
                              setFormData({})
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jenis pengajuan" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="GAJI_POKOK">Perubahan Gaji Pokok</SelectItem>
                              <SelectItem value="REKENING">Perubahan Rekening</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {jenisPengajuan === 'GAJI_POKOK' && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Golongan Baru</Label>
                              <Select
                                value={formData.golongan || ''}
                                onValueChange={(value) => {
                                  const pangkat = getPangkatByGolongan(value)
                                  const masaKerja = formData.masaKerja || 0
                                  const gajiPokok = getGajiPokok(value, masaKerja)
                                  setFormData({ 
                                    ...formData, 
                                    golongan: value, 
                                    pangkat,
                                    gajiPokok
                                  })
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih golongan" />
                                </SelectTrigger>
                                <SelectContent>
                                  {/* Golongan I - Juru */}
                                  <SelectItem value="I/a">I/a - Juru Muda</SelectItem>
                                  <SelectItem value="I/b">I/b - Juru Muda Tingkat I</SelectItem>
                                  <SelectItem value="I/c">I/c - Juru</SelectItem>
                                  <SelectItem value="I/d">I/d - Juru Tingkat I</SelectItem>
                                  
                                  {/* Golongan II - Pengatur */}
                                  <SelectItem value="II/a">II/a - Pengatur Muda</SelectItem>
                                  <SelectItem value="II/b">II/b - Pengatur Muda Tingkat I</SelectItem>
                                  <SelectItem value="II/c">II/c - Pengatur</SelectItem>
                                  <SelectItem value="II/d">II/d - Pengatur Tingkat I</SelectItem>
                                  
                                  {/* Golongan III - Penata */}
                                  <SelectItem value="III/a">III/a - Penata Muda</SelectItem>
                                  <SelectItem value="III/b">III/b - Penata Muda Tingkat I</SelectItem>
                                  <SelectItem value="III/c">III/c - Penata</SelectItem>
                                  <SelectItem value="III/d">III/d - Penata Tingkat I</SelectItem>
                                  
                                  {/* Golongan IV - Pembina */}
                                  <SelectItem value="IV/a">IV/a - Pembina</SelectItem>
                                  <SelectItem value="IV/b">IV/b - Pembina Tingkat I</SelectItem>
                                  <SelectItem value="IV/c">IV/c - Pembina Utama Muda</SelectItem>
                                  <SelectItem value="IV/d">IV/d - Pembina Utama Madya</SelectItem>
                                  <SelectItem value="IV/e">IV/e - Pembina Utama</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {formData.golongan && (
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Pangkat Baru</p>
                                <p className="font-semibold text-primary">
                                  {formData.pangkat || getPangkatByGolongan(formData.golongan)}
                                </p>
                              </div>
                            )}

                            <div className="space-y-2">
                              <Label>Masa Kerja Baru (Tahun)</Label>
                              <Input
                                type="number"
                                min="0"
                                max="34"
                                value={formData.masaKerja || ''}
                                onChange={(e) => {
                                  const masaKerja = parseInt(e.target.value) || 0
                                  const gajiPokok = getGajiPokok(formData.golongan || '', masaKerja)
                                  setFormData({ 
                                    ...formData, 
                                    masaKerja,
                                    gajiPokok
                                  })
                                }}
                                placeholder="Contoh: 15"
                              />
                            </div>

                            {formData.golongan && formData.masaKerja !== undefined && (
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Gaji Pokok Baru (PP 5 Tahun 2024)</p>
                                <p className="text-2xl font-bold text-primary">
                                  {formData.gajiPokok ? formatCurrency(formData.gajiPokok) : '-'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Berdasarkan Golongan {formData.golongan} dan Masa Kerja {formData.masaKerja} Tahun
                                </p>
                              </div>
                            )}

                            <div className="space-y-2">
                              <Label>Upload SK Berkala / SK Pangkat *</Label>
                              <Input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    setFormData({ ...formData, dokumen: file })
                                  }
                                }}
                              />
                              <p className="text-xs text-muted-foreground">
                                Format yang diterima: PDF. Maksimal 5MB.
                              </p>
                            </div>
                          </div>
                        )}

                        {jenisPengajuan === 'REKENING' && (
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label>Nama Pemilik Rekening Baru</Label>
                              <Input
                                value={formData.namaPemilikRekening || ''}
                                onChange={(e) => setFormData({ ...formData, namaPemilikRekening: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Nomor Rekening Baru</Label>
                              <Input
                                type="text"
                                inputMode="numeric"
                                value={formData.nomorRekening || ''}
                                onChange={(e) => {
                                  // Only allow numbers
                                  const value = e.target.value.replace(/\D/g, '')
                                  setFormData({ ...formData, nomorRekening: value })
                                }}
                                placeholder="Masukkan nomor rekening (10-13 digit)"
                              />
                              <p className="text-xs text-muted-foreground">
                                Nomor rekening harus terdiri dari 10-13 digit angka
                              </p>
                            </div>
                            <div className="space-y-2">
                              <Label>Bank</Label>
                              <Select
                                value={formData.bank || 'BPD JAWA TIMUR'}
                                onValueChange={(value) => setFormData({ ...formData, bank: value })}
                                defaultValue="BPD JAWA TIMUR"
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih bank" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="BPD JAWA TIMUR">BPD JAWA TIMUR</SelectItem>
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-muted-foreground">
                                Bank yang digunakan untuk pencairan tunjangan profesi
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label>Alasan Perubahan *</Label>
                              <Select
                                value={formData.alasan || ''}
                                onValueChange={(value) => setFormData({ ...formData, alasan: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Pilih alasan perubahan" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="REKENING_BERMASALAH_DIBLOKIR">
                                    Rekening Bermasalah/Diblokir
                                  </SelectItem>
                                  <SelectItem value="KEAMANAN_SCAM_PHISHING">
                                    Keamanan (Scam/Phishing)
                                  </SelectItem>
                                  <SelectItem value="KETIDAKSESAUAIAN_DATA">
                                    Ketidaksesuaian Data
                                  </SelectItem>
                                  <SelectItem value="GURU_MUTASI">
                                    Guru Mutasi
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              {formData.alasan && (
                                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-md space-y-2">
                                  <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                                    {formData.alasan === 'REKENING_BERMASALAH_DIBLOKIR' && 'Rekening Bermasalah/Diblokir/Dormant'}
                                    {formData.alasan === 'KEAMANAN_SCAM_PHISHING' && 'Keamanan (Scam/Phising/Kartu Hilang)'}
                                    {formData.alasan === 'KETIDAKSESUAIAN_DATA' && 'Ketidaksesuaian Data (Nama/Nomor)'}
                                    {formData.alasan === 'GURU_MUTASI' && 'Guru Mutasi (Pindah Tugas)'}
                                  </p>
                                  <p className="text-xs text-muted-foreground mb-2">
                                    {formData.alasan === 'REKENING_BERMASALAH_DIBLOKIR' && 'Rekening tidak aktif, dormant, atau diblokir oleh pihak bank.'}
                                    {formData.alasan === 'KEAMANAN_SCAM_PHISHING' && 'Rekening terkena tindak kejahatan perbankan (penipuan, phishing, kartu ATM hilang/dicuri).'}
                                    {formData.alasan === 'KETIDAKSESUAIAN_DATA' && 'Perbedaan nama antara data di SKTP/SKTK dengan nama pemilik di buku rekening/bank.'}
                                    {formData.alasan === 'GURU_MUTASI' && 'Perubahan karena perpindahan tugas atau mutasi daerah.'}
                                  </p>
                                  <div className="border-t pt-2">
                                    <p className="text-sm font-medium mb-2">Dokumen yang harus diupload:</p>
                                    <ul className="text-xs space-y-1 ml-4 list-disc">
                                      {formData.alasan === 'REKENING_BERMASALAH_DIBLOKIR' && (
                                        <>
                                          <li>Surat Keterangan Bank: Surat resmi dari bank penyalur yang menyatakan rekening aktif kembali, rekening baru, atau rekening tidak lagi dalam status dormant</li>
                                          <li>Buku Tabungan/Rekening Koran: Salinan buku tabungan terbaru yang menunjukkan nomor rekening dan nama pemilik yang jelas</li>
                                        </>
                                      )}
                                      {formData.alasan === 'KEAMANAN_SCAM_PHISHING' && (
                                        <>
                                          <li>Surat Laporan Kepolisian: Surat kehilangan atau surat laporan resmi tindak kejahatan dari pihak Kepolisian</li>
                                          <li>Surat Pemblokiran/Pembukaan Blokir Bank: Dokumen dari bank yang menunjukkan bahwa rekening lama telah diblokir akibat tindak kejahatan dan rekening baru telah disiapkan</li>
                                        </>
                                      )}
                                      {formData.alasan === 'KETIDAKSESUAIAN_DATA' && (
                                        <>
                                          <li>Buku Tabungan: Salinan halaman depan buku rekening</li>
                                          <li>KTP/Kartu Keluarga: Dokumen kependudukan untuk membuktikan nama yang benar</li>
                                          <li>Surat Keterangan Bank/Dukcapil: Jika terjadi perbedaan ejaan yang signifikan, diperlukan surat keterangan dari bank atau Disdukcapil</li>
                                          <li>SKTP/SKTK: Salinan SKTP yang salah untuk referensi perbaikan</li>
                                        </>
                                      )}
                                      {formData.alasan === 'GURU_MUTASI' && (
                                        <>
                                          <li>SK Mutasi/Surat Pindah: SK resmi mutasi dari Dinas Pendidikan atau Badan Kepegawaian Daerah</li>
                                          <li>Buku Tabungan Rekening Baru: (Jika rekening ikut dimutasi ke bank daerah baru)</li>
                                        </>
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label>Upload Dokumen Pendukung *</Label>
                              <Input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    setFormData({ ...formData, dokumen: file })
                                  }
                                }}
                              />
                              <p className="text-xs text-muted-foreground">
                                Format yang diterima: PDF. Maksimal 5MB.
                              </p>
                              {formData.alasan && (
                                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                  <p className="text-xs text-blue-800 dark:text-blue-200 font-medium">
                                    ℹ️ Pastikan semua dokumen yang disebutkan di atas telah terlampir dalam berkas yang Anda upload
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowPengajuanDialog(false)
                            setJenisPengajuan('')
                            setFormData({})
                          }}
                          className="border-slate-300"
                        >
                          Batal
                        </Button>
                        <Button
                          onClick={handlePengajuanSubmit}
                          disabled={
                            !jenisPengajuan ||
                            isSubmitting ||
                            (jenisPengajuan === 'GAJI_POKOK' && !formData.dokumen) ||
                            (jenisPengajuan === 'REKENING' && (!formData.dokumen || !formData.alasan))
                          }
                          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg"
                        >
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          Kirim Pengajuan
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>

              {/* Delete Confirmation Dialog */}
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle className="text-red-600 flex items-center gap-2">
                      <Trash2 className="w-5 h-5" />
                      Hapus Pengajuan
                    </DialogTitle>
                    <DialogDescription>
                      {selectedPengajuanToDelete?.status === 'DISETUJUI' ? (
                        <>
                          Apakah Anda yakin ingin menghapus pengajuan <strong className="text-red-600">yang sudah disetujui</strong>? Tindakan ini tidak dapat dibatalkan.
                        </>
                      ) : selectedPengajuanToDelete?.status === 'DITOLAK' ? (
                        <>
                          Apakah Anda yakin ingin menghapus pengajuan yang <strong className="text-red-600">ditolak</strong>? Tindakan ini tidak dapat dibatalkan.
                        </>
                      ) : (
                        <>
                          Apakah Anda yakin ingin menghapus pengajuan ini? Tindakan ini tidak dapat dibatalkan.
                        </>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex gap-2 justify-end pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDeleteDialog(false)
                        setSelectedPengajuanToDelete(null)
                      }}
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={handleDeletePengajuan}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Ya, Hapus
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <CardContent>
                {guruData.pengajuanList.length === 0 ? (
                  <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Belum ada riwayat pengajuan</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {guruData.pengajuanList.map((pengajuan) => (
                      <div
                        key={pengajuan.id}
                        className="bg-gradient-to-r from-white to-orange-50 dark:from-slate-800 dark:to-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4 hover:shadow-lg transition-all"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">
                              {pengajuan.jenisPengajuan === 'GAJI_POKOK' && 'Perubahan Gaji Pokok'}
                              {pengajuan.jenisPengajuan === 'REKENING' && 'Perubahan Rekening'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(pengajuan.tanggalDiajukan).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          {getStatusBadge(pengajuan.status)}
                        </div>
                        {pengajuan.dokumenPendukung && (
                          <div className="mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Open document in new tab
                                const win = window.open()
                                if (win) {
                                  win.document.write(
                                    `<iframe src="${pengajuan.dokumenPendukung}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
                                  )
                                }
                              }}
                              className="gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Lihat Dokumen
                            </Button>
                          </div>
                        )}
                        {pengajuan.catatan && (
                          <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800 rounded text-sm">
                            <p className="font-semibold">Catatan:</p>
                            <p>{pengajuan.catatan}</p>
                          </div>
                        )}
                        {(pengajuan.status === 'PENDING' || pengajuan.status === 'DISETUJUI' || pengajuan.status === 'DITOLAK') && (
                          <div className="mt-3 pt-3 border-t border-orange-200 dark:border-orange-800">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedPengajuanToDelete(pengajuan)
                                setShowDeleteDialog(true)
                              }}
                              className="gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Hapus
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
