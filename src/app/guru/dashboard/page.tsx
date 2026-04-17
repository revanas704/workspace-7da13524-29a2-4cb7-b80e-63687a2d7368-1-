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
  Download
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
      if (!formData.namaPemilikRekening || !formData.nomorRekening || !formData.bank) {
        toast.error('Mohon lengkapi semua data rekening')
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">SIM Tunjangan Profesi</h1>
            <p className="text-sm text-muted-foreground">Dashboard Guru</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold">{guruData.nama}</p>
              <p className="text-sm text-muted-foreground">{guruData.nip}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
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
        <Card className="mb-6 shadow-lg border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">Selamat Datang, {guruData.nama}</CardTitle>
                <CardDescription>Status SKTP Anda saat ini</CardDescription>
              </div>
              {guruData.statusSktp === 'TERBIT' ? (
                <Badge className="bg-green-600 text-lg px-4 py-2">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  SKTP Terbit
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  <XCircle className="w-5 h-5 mr-2" />
                  SKTP Belum Terbit
                </Badge>
              )}
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="profil" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profil">Profil</TabsTrigger>
            <TabsTrigger value="tunjangan">Tunjangan</TabsTrigger>
            <TabsTrigger value="rekening">Rekening</TabsTrigger>
            <TabsTrigger value="riwayat">Riwayat</TabsTrigger>
          </TabsList>

          {/* Profil Tab */}
          <TabsContent value="profil">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Data Pribadi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">NIK</p>
                    <p className="font-semibold">{guruData.nik}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">NUPTK</p>
                    <p className="font-semibold">{guruData.nuptk}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">NIP</p>
                    <p className="font-semibold">{guruData.nip}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Nama</p>
                    <p className="font-semibold">{guruData.nama}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Pangkat</p>
                    <p className="font-semibold">{guruData.pangkat}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Golongan</p>
                    <p className="font-semibold">{guruData.golongan}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Masa Kerja</p>
                    <p className="font-semibold">{guruData.masaKerja} Tahun</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Satuan Pendidikan</p>
                    <p className="font-semibold">{guruData.satuanPendidikan}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tunjangan Tab */}
          <TabsContent value="tunjangan">
            <div className="grid gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Gaji Pokok
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(guruData.gajiPokok)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Berdasarkan PP No. 5 Tahun 2024 - {guruData.pangkat} - Golongan {guruData.golongan} - {guruData.masaKerja} Tahun
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Rincian Tunjangan Profesi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-lg">Salur Bruto</span>
                    <span className="text-2xl font-bold">{formatCurrency(guruData.salurBruto)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">Salur Bruto sama dengan Gaji Pokok</p>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        <span>PPH ({guruData.golongan === 'I' || guruData.golongan?.startsWith('I/') ? '0%' : 
                                     guruData.golongan === 'II' || guruData.golongan?.startsWith('II/') ? '0%' :
                                     guruData.golongan === 'III' || guruData.golongan?.startsWith('III/') ? '5%' : 
                                     guruData.golongan === 'IV' || guruData.golongan?.startsWith('IV/') ? '15%' : '0%'} dari Gaji Pokok)</span>
                      </div>
                      <span className="font-semibold text-red-600">-{formatCurrency(guruData.pph)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <span>Potongan JKN (1% dari Gaji Pokok)</span>
                      </div>
                      <span className="font-semibold text-red-600">-{formatCurrency(guruData.potonganJkn)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                    <span className="text-xl font-bold">Salur Netto</span>
                    <span className="text-3xl font-bold text-primary">{formatCurrency(guruData.salurNetto)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">Gaji Pokok - PPH - Potongan JKN</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Rekening Tab */}
          <TabsContent value="rekening">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Landmark className="w-5 h-5" />
                  Informasi Rekening
                </CardTitle>
                <CardDescription>
                  Data rekening untuk pencairan tunjangan profesi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Nama Pemilik Rekening</p>
                  <p className="text-xl font-semibold">{guruData.namaPemilikRekening}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Nomor Rekening</p>
                  <p className="text-xl font-semibold">{guruData.nomorRekening}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Bank</p>
                  <p className="text-xl font-semibold">{guruData.bank}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Riwayat Tab */}
          <TabsContent value="riwayat">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Riwayat Pengajuan
                    </CardTitle>
                    <CardDescription>
                      Riwayat pengajuan perubahan data dan status verifikasi
                    </CardDescription>
                  </div>
                  <Dialog open={showPengajuanDialog} onOpenChange={setShowPengajuanDialog}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
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
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    setFormData({ ...formData, dokumen: file })
                                  }
                                }}
                              />
                              <p className="text-xs text-muted-foreground">
                                Format yang diterima: PDF, JPG, PNG. Maksimal 5MB.
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
                                value={formData.nomorRekening || ''}
                                onChange={(e) => setFormData({ ...formData, nomorRekening: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Bank Baru</Label>
                              <Input
                                value={formData.bank || ''}
                                onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                              />
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
                        >
                          Batal
                        </Button>
                        <Button
                          onClick={handlePengajuanSubmit}
                          disabled={
                            !jenisPengajuan || 
                            isSubmitting || 
                            (jenisPengajuan === 'GAJI_POKOK' && !formData.dokumen)
                          }
                        >
                          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          Kirim Pengajuan
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {guruData.pengajuanList.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Belum ada riwayat pengajuan</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {guruData.pengajuanList.map((pengajuan) => (
                      <div
                        key={pengajuan.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
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
