'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { formatCurrency, calculatePph, calculatePotonganJkn } from '@/lib/salary-calculator'
import { getGajiPokok, getPangkatByGolongan } from '@/lib/gaji-pokok-pp5'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

import {
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  LogOut,
  Plus,
  Edit,
  Trash2,
  GraduationCap,
  Search,
  ChevronDown,
  Upload,
  FileSpreadsheet,
} from 'lucide-react'

interface Guru {
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
}

interface Pengajuan {
  id: string
  guruId: string
  jenisPengajuan: string
  dataLama: string
  dataBaru: string
  status: string
  catatan?: string
  tanggalDiajukan: string
  tanggalVerifikasi?: string
  guru: any
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [gurus, setGurus] = useState<Guru[]>([])
  const [pengajuan, setPengajuan] = useState<Pengajuan[]>([])

  // Filter states
  const [filterSearch, setFilterSearch] = useState('')
  const [filterGolongan, setFilterGolongan] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Filter states for verification
  const [filterPengajuanSearch, setFilterPengajuanSearch] = useState('')
  const [filterJenisPengajuan, setFilterJenisPengajuan] = useState('')
  const [filterPengajuanStatus, setFilterPengajuanStatus] = useState('')
  const [expandedPengajuanId, setExpandedPengajuanId] = useState<string | null>(null)

  // Dialog states
  const [guruDialogOpen, setGuruDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [verifikasiDialogOpen, setVerifikasiDialogOpen] = useState(false)
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [selectedGuru, setSelectedGuru] = useState<Guru | null>(null)
  const [selectedPengajuan, setSelectedPengajuan] = useState<Pengajuan | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Form state
  const [formData, setFormData] = useState<Partial<Guru>>({
    statusSktp: 'BELUM',
  })

  const [verifikasiForm, setVerifikasiForm] = useState({
    status: '',
    catatan: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated' || !session) {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/guru/dashboard')
    } else if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchData()
    }
  }, [status, session, router])

  // Auto fill pangkat, gajiPokok, salurBruto, pph, potonganJkn, salurNetto based on golongan AND masa kerja (PP 5 Tahun 2024)
  useEffect(() => {
    if (formData.golongan && !isEditing) {
      // Auto fill pangkat based on golongan
      const pangkat = getPangkatByGolongan(formData.golongan) || ''

      // Auto fill gajiPokok based on golongan and masa kerja
      const masaKerja = formData.masaKerja || 0
      const gajiPokok = getGajiPokok(formData.golongan, masaKerja)

      // Salur Bruto = Gaji Pokok (same value)
      const salurBruto = gajiPokok

      // Calculate PPH based on golongan
      const pphRate = calculatePph(formData.golongan)
      const pph = gajiPokok * pphRate

      // Calculate Potongan JKN (1% of gaji pokok)
      const potonganJkn = calculatePotonganJkn(gajiPokok)

      // Calculate Salur Netto
      const salurNetto = salurBruto - pph - potonganJkn

      setFormData((prev) => ({
        ...prev,
        pangkat,
        gajiPokok,
        salurBruto,
        pph,
        potonganJkn,
        salurNetto,
      }))
    }
  }, [formData.golongan, formData.masaKerja, isEditing])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch gurus
      const gurusRes = await fetch('/api/admin/gurus')
      if (gurusRes.ok) {
        const gurusData = await gurusRes.json()
        setGurus(gurusData || [])
      }

      // Fetch pengajuan
      const pengajuanRes = await fetch('/api/admin/pengajuan')
      if (pengajuanRes.ok) {
        const pengajuanData = await pengajuanRes.json()
        setPengajuan(pengajuanData || [])
      }
    } catch (error) {
      toast.error('Gagal memuat data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredGurus = gurus.filter((guru) => {
    const matchSearch =
      filterSearch === '' ||
      guru.nama.toLowerCase().includes(filterSearch.toLowerCase()) ||
      guru.nip.includes(filterSearch)

    const matchGolongan = filterGolongan === '' || filterGolongan === 'all' || guru.golongan === filterGolongan
    const matchStatus = filterStatus === '' || filterStatus === 'all' || guru.statusSktp === filterStatus

    return matchSearch && matchGolongan && matchStatus
  })

  const filteredPengajuan = pengajuan.filter((p) => {
    const matchSearch =
      filterPengajuanSearch === '' ||
      (p.guru?.nama || '').toLowerCase().includes(filterPengajuanSearch.toLowerCase()) ||
      (p.guru?.nip || '').includes(filterPengajuanSearch)

    const matchJenis = filterJenisPengajuan === '' || filterJenisPengajuan === 'all' || p.jenisPengajuan === filterJenisPengajuan
    const matchStatus = filterPengajuanStatus === '' || filterPengajuanStatus === 'all' || p.status === filterPengajuanStatus

    return matchSearch && matchJenis && matchStatus
  })

  const handleExport = async () => {
    try {
      const params = new URLSearchParams()
      if (filterGolongan) params.append('golongan', filterGolongan)
      if (filterStatus) params.append('statusSktp', filterStatus)

      window.open(`/api/admin/export?${params}`, '_blank')
      toast.success('Data sedang diekspor')
    } catch (error) {
      toast.error('Gagal mengekspor data')
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      window.open('/api/admin/guru/template', '_blank')
      toast.success('Template sedang diunduh')
    } catch (error) {
      toast.error('Gagal mengunduh template')
    }
  }

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!importFile) {
      toast.error('Silakan pilih file Excel terlebih dahulu')
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('file', importFile)

      const res = await fetch('/api/admin/import', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        toast.success(`Berhasil mengimpor ${data.count} data guru`)
        setImportDialogOpen(false)
        setImportFile(null)
        fetchData()
      } else {
        const error = await res.json()
        toast.error(error.error || 'Gagal mengimpor data')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengimpor')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddGuru = () => {
    setIsEditing(false)
    setSelectedGuru(null)
    setFormData({
      salurBruto: 2000000,
      statusSktp: 'BELUM',
    })
    setGuruDialogOpen(true)
  }

  const handleEditGuru = (guru: Guru) => {
    setIsEditing(true)
    setSelectedGuru(guru)
    setFormData({
      nik: guru.nik,
      nuptk: guru.nuptk,
      nip: guru.nip,
      nama: guru.nama,
      pangkat: guru.pangkat,
      golongan: guru.golongan,
      masaKerja: guru.masaKerja,
      namaPemilikRekening: guru.namaPemilikRekening,
      nomorRekening: guru.nomorRekening,
      bank: guru.bank,
      satuanPendidikan: guru.satuanPendidikan,
      salurBruto: guru.salurBruto,
      statusSktp: guru.statusSktp,
    })
    setGuruDialogOpen(true)
  }

  const handleDeleteGuru = (guru: Guru) => {
    setSelectedGuru(guru)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedGuru) return

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/gurus/${selectedGuru.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Data guru berhasil dihapus')
        setDeleteDialogOpen(false)
        fetchData()
      } else {
        toast.error('Gagal menghapus data guru')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitGuru = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nip || !formData.nama) {
      toast.error('NIP dan Nama harus diisi')
      return
    }

    setIsSubmitting(true)
    try {
      const url = isEditing && selectedGuru ? `/api/admin/gurus/${selectedGuru.id}` : '/api/admin/gurus'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Submit failed')
      }

      toast.success(isEditing ? 'Data guru berhasil diperbarui' : 'Data guru berhasil ditambahkan')
      setGuruDialogOpen(false)
      fetchData()
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyimpan data guru')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifikasi = (pengajuan: Pengajuan) => {
    setSelectedPengajuan(pengajuan)
    setVerifikasiForm({
      status: '',
      catatan: '',
    })
    setVerifikasiDialogOpen(true)
  }

  const handleViewDocument = (documentUrl: string) => {
    setSelectedDocument(documentUrl)
    setDocumentDialogOpen(true)
  }

  const handleSubmitVerifikasi = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPengajuan || !verifikasiForm.status) {
      toast.error('Silakan pilih status verifikasi')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/pengajuan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedPengajuan.id,
          status: verifikasiForm.status,
          catatan: verifikasiForm.catatan,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Verifikasi failed')
      }

      toast.success(
        verifikasiForm.status === 'BELUM_TERBACA_SIMTUN'
          ? 'Status pengajuan diubah ke Belum Terbaca SIMTUN'
          : 'Pengajuan berhasil diverifikasi'
      )
      setVerifikasiDialogOpen(false)
      fetchData()
    } catch (error: any) {
      toast.error(error?.message || 'Gagal memverifikasi pengajuan')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'TERBIT':
        return <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> TERBIT</Badge>
      case 'BELUM':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> BELUM</Badge>
      case 'DISETUJUI':
        return <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> DISETUJUI</Badge>
      case 'DITOLAK':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> DITOLAK</Badge>
      case 'BELUM_TERBACA_SIMTUN':
        return <Badge variant="outline" className="border-slate-400 text-slate-700"><Clock className="w-3 h-3 mr-1" /> BELUM TERBACA SIMTUN</Badge>
      case 'PENDING':
        return <Badge variant="outline" className="border-orange-500 text-orange-700"><Clock className="w-3 h-3 mr-1" /> PENDING</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return dateString
    }
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatJenisPengajuan = (jenis: string) => {
    const types: Record<string, string> = {
      GAJI_POKOK: 'Perubahan Gaji Pokok',
      REKENING: 'Perubahan Rekening',
      PANGKAT: 'Perubahan Pangkat',
      MASA_KERJA: 'Perubahan Masa Kerja',
    }
    return types[jenis] || jenis
  }

  const stats = {
    totalGuru: gurus.length,
    sktpTerbit: gurus.filter((g) => g.statusSktp === 'TERBIT').length,
    sktpBelum: gurus.filter((g) => g.statusSktp === 'BELUM').length,
    pendingPengajuan: pengajuan.length,
    totalSalurNetto: gurus.reduce((sum, g) => sum + g.salurNetto, 0),
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 dark:from-slate-900 dark:via-red-950/20 dark:to-amber-950/20 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200/30 dark:bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-200/30 dark:bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-200/20 dark:bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 to-amber-600 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/Kabupaten Blitar(1).png" alt="Logo Blitar" className="h-10 w-10 object-contain" />
            <div>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm text-red-100">Pemerintah Kabupaten Blitar - Dinas Pendidikan</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{session?.user?.username || 'Admin'}</p>
              <p className="text-xs text-red-100">Administrator</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={async () => {
                await signOut({ 
                  callbackUrl: '/login',
                  redirect: true 
                })
              }}
              className="text-white hover:bg-white/20"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-lg border-red-100 bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Guru</CardTitle>
              <Users className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalGuru}</div>
              <p className="text-xs text-red-100">Guru terdaftar</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-amber-100 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">SKTP Terbit</CardTitle>
              <CheckCircle className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.sktpTerbit}</div>
              <p className="text-xs text-amber-100">Sudah memiliki SKTP</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-orange-100 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">SKTP Belum</CardTitle>
              <Clock className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.sktpBelum}</div>
              <p className="text-xs text-orange-100">Belum memiliki SKTP</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-red-100 bg-gradient-to-br from-red-600 to-orange-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Pengajuan Verifikasi</CardTitle>
              <FileText className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.pendingPengajuan}</div>
              <p className="text-xs text-red-100">Perlu verifikasi</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="guru" className="space-y-4">
          <TabsList className="grid w-full md:w-[600px] grid-cols-3 bg-white/50 dark:bg-slate-800/50">
            <TabsTrigger value="guru" className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Users className="h-4 w-4" />
              Data Guru
            </TabsTrigger>
            <TabsTrigger value="verifikasi" className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <FileText className="h-4 w-4" />
              Verifikasi Pengajuan
              {pengajuan.length > 0 && (
                <Badge className="ml-auto bg-amber-500 hover:bg-amber-600 text-white border-0">{pengajuan.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="dak" className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <FileSpreadsheet className="h-4 w-4" />
              DAK Non Fisik
            </TabsTrigger>
          </TabsList>

          {/* Data Guru Tab */}
          <TabsContent value="guru">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="flex-1 flex gap-2 items-start flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Cari nama atau NIP..."
                        className="pl-10"
                        value={filterSearch}
                        onChange={(e) => setFilterSearch(e.target.value)}
                      />
                    </div>
                    <Select value={filterGolongan} onValueChange={setFilterGolongan}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Golongan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        <SelectItem value="I">Gol. I</SelectItem>
                        <SelectItem value="II">Gol. II</SelectItem>
                        <SelectItem value="III">Gol. III</SelectItem>
                        <SelectItem value="IV">Gol. IV</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        <SelectItem value="TERBIT">Terbit</SelectItem>
                        <SelectItem value="BELUM">Belum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleExport} variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                    <Button onClick={() => setImportDialogOpen(true)} variant="outline" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Import Excel
                    </Button>
                    <Button onClick={handleAddGuru} className="gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700">
                      <Plus className="h-4 w-4" />
                      Tambah Guru
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto max-h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-red-50 dark:bg-red-950/30">
                        <TableHead className="sticky top-0 bg-red-50 dark:bg-red-950/30">No</TableHead>
                        <TableHead className="sticky top-0 bg-red-50 dark:bg-red-950/30">NIP</TableHead>
                        <TableHead className="sticky top-0 bg-red-50 dark:bg-red-950/30">Nama</TableHead>
                        <TableHead className="sticky top-0 bg-red-50 dark:bg-red-950/30">Golongan</TableHead>
                        <TableHead className="sticky top-0 bg-red-50 dark:bg-red-950/30">Gaji Pokok</TableHead>
                        <TableHead className="sticky top-0 bg-red-50 dark:bg-red-950/30">Salur Netto</TableHead>
                        <TableHead className="sticky top-0 bg-red-50 dark:bg-red-950/30">Status</TableHead>
                        <TableHead className="sticky top-0 bg-red-50 dark:bg-red-950/30 text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGurus.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <p className="text-muted-foreground">Tidak ada data guru</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredGurus.map((guru, index) => (
                          <TableRow key={guru.id} className="hover:bg-red-50/50 dark:hover:bg-red-950/10">
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-mono text-sm">{guru.nip}</TableCell>
                            <TableCell className="font-medium">{guru.nama}</TableCell>
                            <TableCell>{guru.golongan}</TableCell>
                            <TableCell className="font-semibold">{formatCurrency(guru.gajiPokok || 0)}</TableCell>
                            <TableCell className="font-semibold">{formatCurrency(guru.salurNetto)}</TableCell>
                            <TableCell>{getStatusBadge(guru.statusSktp)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditGuru(guru)} className="hover:bg-red-100 dark:hover:bg-red-900/20">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteGuru(guru)}>
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verifikasi Pengajuan Tab */}
          <TabsContent value="verifikasi">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex flex-col gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Daftar Pengajuan Verifikasi
                    </CardTitle>
                    <CardDescription>
                      Daftar pengajuan yang belum disetujui atau ditolak (PENDING dan BELUM TERBACA SIMTUN)
                    </CardDescription>
                  </div>
                  <div className="flex-1 flex gap-2 items-start flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Cari nama atau NIP..."
                        className="pl-10"
                        value={filterPengajuanSearch}
                        onChange={(e) => setFilterPengajuanSearch(e.target.value)}
                      />
                    </div>
                    <Select value={filterJenisPengajuan} onValueChange={setFilterJenisPengajuan}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Jenis Pengajuan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        <SelectItem value="GAJI_POKOK">Gaji Pokok</SelectItem>
                        <SelectItem value="REKENING">Rekening</SelectItem>
                        <SelectItem value="PANGKAT">Pangkat</SelectItem>
                        <SelectItem value="MASA_KERJA">Masa Kerja</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterPengajuanStatus} onValueChange={setFilterPengajuanStatus}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="BELUM_TERBACA_SIMTUN">Belum Terbaca SIMTUN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredPengajuan.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Tidak ada pengajuan yang perlu diverifikasi</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {filteredPengajuan.map((p) => {
                      let dataBaru: any = {}
                      let dataLama: any = null

                      try {
                        dataBaru = JSON.parse(p.dataBaru)
                      } catch (e) {
                        dataBaru = {}
                      }

                      try {
                        dataLama = p.dataLama ? JSON.parse(p.dataLama) : null
                      } catch (e) {
                        // ignore
                      }

                      const isExpanded = expandedPengajuanId === p.id

                      return (
                        <Collapsible key={p.id} open={isExpanded} onOpenChange={(open) => setExpandedPengajuanId(open ? p.id : null)}>
                          <Card className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
                            <CollapsibleTrigger asChild>
                              <CardContent className="py-3 cursor-pointer">
                                <div className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <p className="font-medium text-sm truncate">{p.guru?.nama || '-'}</p>
                                        <span className="text-xs text-muted-foreground truncate">({p.guru?.nip || '-'})</span>
                                        {getStatusBadge(p.status)}
                                      </div>
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>{formatJenisPengajuan(p.jenisPengajuan)}</span>
                                        <span>•</span>
                                        <span>{formatDate(p.tanggalDiajukan)}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleVerifikasi(p)
                                    }}
                                    className="gap-1 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700"
                                    size="sm"
                                  >
                                    <CheckCircle className="h-3 w-3" />
                                    Verifikasi
                                  </Button>
                                </div>
                              </CardContent>
                            </CollapsibleTrigger>

                            <CollapsibleContent>
                              <div className="px-6 pb-4 border-t">
                                <div className="pt-4 space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm font-medium mb-2">Data Lama:</p>
                                      <div className="bg-red-50 dark:bg-red-950/20 rounded-md p-3 space-y-1 text-sm">
                                        {dataLama ? (
                                          Object.entries(dataLama)
                                            .filter(([key]) => {
                                              if (p.jenisPengajuan === 'GAJI_POKOK') {
                                                return true
                                              }
                                              const excludedFields = ['gajiPokok', 'pangkat', 'masaKerja']
                                              return !excludedFields.includes(key)
                                            })
                                            .map(([key, value]) => (
                                            <div key={key} className="flex justify-between">
                                              <span className="text-muted-foreground capitalize">
                                                {key === 'gajiPokok' ? 'Gaji Pokok' :
                                                 key === 'pangkat' ? 'Pangkat' :
                                                 key === 'masaKerja' ? 'Masa Kerja' : key}:
                                              </span>
                                              <span className="font-medium">
                                                {key === 'gajiPokok' ? formatCurrency(Number(value)) : String(value)}
                                              </span>
                                            </div>
                                          ))
                                        ) : (
                                          <p className="text-muted-foreground italic">Tidak ada data</p>
                                        )}
                                      </div>
                                    </div>

                                    <div>
                                      <p className="text-sm font-medium mb-2">Data Baru:</p>
                                      <div className="bg-amber-50 dark:bg-amber-950/20 rounded-md p-3 space-y-1 text-sm">
                                        {Object.entries(dataBaru)
                                          .filter(([key]) => {
                                            if (p.jenisPengajuan === 'GAJI_POKOK') {
                                              return !['alasan'].includes(key)
                                            }
                                            const excludedFields = ['alasan', 'gajiPokok', 'pangkat', 'masaKerja']
                                            return !excludedFields.includes(key)
                                          })
                                          .map(([key, value]) => (
                                          <div key={key} className="flex justify-between">
                                            <span className="text-muted-foreground capitalize">
                                              {key === 'gajiPokok' ? 'Gaji Pokok' :
                                               key === 'pangkat' ? 'Pangkat' :
                                               key === 'masaKerja' ? 'Masa Kerja' : key}:
                                            </span>
                                            <span className="font-medium text-amber-700 dark:text-amber-300">
                                              {key === 'gajiPokok' ? formatCurrency(Number(value)) : String(value)}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Highlight salary difference for GAJI_POKOK */}
                                  {p.jenisPengajuan === 'GAJI_POKOK' && dataLama?.gajiPokok && dataBaru.gajiPokok && (
                                    <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-md">
                                      <p className="text-sm font-medium mb-1">Perubahan Gaji Pokok:</p>
                                      <div className="flex items-center gap-2 text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">
                                          {formatCurrency(Number(dataLama.gajiPokok))}
                                        </span>
                                        <span className="text-red-600 font-semibold">→</span>
                                        <span className="text-red-700 dark:text-red-300 font-bold">
                                          {formatCurrency(Number(dataBaru.gajiPokok))}
                                        </span>
                                        <span className="text-red-600 text-xs font-semibold">
                                          ({dataBaru.gajiPokok > dataLama.gajiPokok ? '+' : ''}
                                          {formatCurrency(Number(dataBaru.gajiPokok) - Number(dataLama.gajiPokok))})
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  {/* Alasan Perubahan (khusus REKENING) */}
                                  {p.jenisPengajuan === 'REKENING' && dataBaru.alasan && (
                                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                                      <p className="text-sm font-medium mb-1">Alasan Perubahan:</p>
                                      <p className="text-sm text-amber-800 dark:text-amber-200">
                                        {dataBaru.alasan === 'REKENING_BERMASALAH_DIBLOKIR' && 'Rekening Bermasalah/Diblokir'}
                                        {dataBaru.alasan === 'KEAMANAN_SCAM_PHISHING' && 'Keamanan (Scam/Phishing)'}
                                        {dataBaru.alasan === 'KETIDAKSESUAIAN_DATA' && 'Ketidaksesuaian Data'}
                                        {dataBaru.alasan === 'GURU_MUTASI' && 'Guru Mutasi'}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-2">
                                        {dataBaru.alasan === 'REKENING_BERMASALAH_DIBLOKIR' &&
                                          'Rekening tidak aktif, dormant, atau diblokir oleh pihak bank.'}
                                        {dataBaru.alasan === 'KEAMANAN_SCAM_PHISHING' &&
                                          'Rekening terkena tindak kejahatan perbankan (penipuan, phishing, kartu ATM hilang/dicuri).'}
                                        {dataBaru.alasan === 'KETIDAKSESUAIAN_DATA' &&
                                          'Perbedaan nama antara data di SKTP/SKTK dengan nama pemilik di buku rekening/bank.'}
                                        {dataBaru.alasan === 'GURU_MUTASI' &&
                                          'Perubahan karena perpindahan tugas atau mutasi daerah.'}
                                      </p>
                                    </div>
                                  )}

                                  {p.dokumenPendukung && (
                                    <div className="flex items-center gap-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewDocument(p.dokumenPendukung)}
                                        className="gap-2"
                                      >
                                        <Download className="h-4 w-4" />
                                        Lihat Dokumen
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CollapsibleContent>
                          </Card>
                        </Collapsible>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* DAK Non Fisik Tab */}
          <TabsContent value="dak">
            <div className="grid gap-6">
              <Card className="shadow-xl border-0 bg-gradient-to-br from-red-600 to-amber-500 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-24 translate-x-24"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    DAK Non Fisik
                  </CardTitle>
                  <CardDescription className="text-white/90 text-base mt-2">
                    Dana Alokasi Khusus Non Fisik - Penyaluran Tunjangan Profesi
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 pt-6">
                  <Button
                    onClick={() => router.push('/admin/dak')}
                    className="w-full bg-white text-red-600 hover:bg-red-50 text-lg py-6 shadow-xl border-0"
                  >
                    <FileSpreadsheet className="w-5 h-5 mr-3" />
                    Kelola Data Penyaluran DAK
                  </Button>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                      <p className="text-sm text-white/90 mb-1">Dana Tunjangan Profesi</p>
                      <p className="text-xl font-bold text-white">TPG ASN Daerah</p>
                    </div>
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                      <p className="text-sm text-white/90 mb-1">Dana Tambahan Penghasilan</p>
                      <p className="text-xl font-bold text-white">TAMSIL ASN Daerah</p>
                    </div>
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                      <p className="text-sm text-white/90 mb-1">Pemberkasan</p>
                      <p className="text-xl font-bold text-white">Periode & Gelombang</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-red-50/50 dark:from-slate-800 dark:to-red-950/50">
                <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Fitur Menu DAK
                  </CardTitle>
                  <CardDescription className="text-white/90">
                    Fungsi-fungsi yang tersedia di menu DAK Non Fisik
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-lg border border-red-100 dark:border-red-900">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Upload className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Import Data</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Upload file Excel untuk import data penyaluran</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-lg border border-orange-100 dark:border-orange-900">
                      <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Kelola Data</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">View, edit, dan delete data penyaluran</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-lg border border-amber-100 dark:border-amber-900">
                      <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Lihat Detail Penerima</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Cek daftar penerima dengan pagination & search</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-950/40 dark:to-orange-950/40 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <Download className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Export Data</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Download Excel & PDF laporan penyaluran</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add/Edit Guru Dialog */}
      <Dialog open={guruDialogOpen} onOpenChange={setGuruDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-red-200 dark:border-red-800 shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-red-700 to-amber-600 text-white -mx-8 -mt-6 px-8 pt-8 pb-4 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-white text-xl font-semibold">{isEditing ? 'Edit Data Guru' : 'Tambah Guru Baru'}</DialogTitle>
                <DialogDescription className="text-red-100 text-sm">
                  {isEditing ? 'Perbarui data guru yang sudah ada.' : 'Isi form untuk menambahkan guru baru.'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmitGuru} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nik">NIK</Label>
                <Input
                  id="nik"
                  value={formData.nik || ''}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nuptk">NUPTK</Label>
                <Input
                  id="nuptk"
                  value={formData.nuptk || ''}
                  onChange={(e) => setFormData({ ...formData, nuptk: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nip">NIP *</Label>
                <Input
                  id="nip"
                  value={formData.nip || ''}
                  onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nama">Nama Lengkap *</Label>
              <Input
                id="nama"
                value={formData.nama || ''}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pangkat">Pangkat</Label>
                <Input
                  id="pangkat"
                  value={formData.pangkat || ''}
                  onChange={(e) => setFormData({ ...formData, pangkat: e.target.value })}
                  placeholder="Otomatis terisi berdasarkan golongan"
                />
                <p className="text-xs text-muted-foreground">
                  Otomatis terisi sesuai golongan yang dipilih
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="golongan">Golongan</Label>
                <Select
                  value={formData.golongan || ''}
                  onValueChange={(value) => setFormData({ ...formData, golongan: value })}
                >
                  <SelectTrigger id="golongan">
                    <SelectValue placeholder="Pilih Golongan" />
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="masaKerja">Masa Kerja (Tahun)</Label>
              <Input
                id="masaKerja"
                type="number"
                min="0"
                max="40"
                value={formData.masaKerja || ''}
                onChange={(e) => setFormData({ ...formData, masaKerja: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gajiPokok">Gaji Pokok (Rp)</Label>
              <Input
                id="gajiPokok"
                type="number"
                value={formData.gajiPokok || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Otomatis berdasarkan <strong>Golongan</strong> dan <strong>Masa Kerja</strong> (PP 5 Tahun 2024)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salurBruto">Salur Bruto (Rp)</Label>
              <Input
                id="salurBruto"
                type="number"
                value={formData.salurBruto || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Otomatis sama dengan <strong>Gaji Pokok</strong>
              </p>
            </div>

            {/* Rincian Potongan */}
            <div className="border-t pt-4 space-y-4">
              <h4 className="font-medium">Rincian Potongan</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pph">PPH (Rp)</Label>
                  <Input
                    id="pph"
                    type="number"
                    value={formData.pph || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.golongan?.startsWith('I') ? '0%' : 
                     formData.golongan?.startsWith('II') ? '0%' :
                     formData.golongan?.startsWith('III') ? '5%' : 
                     formData.golongan?.startsWith('IV') ? '15%' : '0%'} dari Gaji Pokok
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="potonganJkn">Potongan JKN (Rp)</Label>
                  <Input
                    id="potonganJkn"
                    type="number"
                    value={formData.potonganJkn || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">1% dari Gaji Pokok</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salurNetto">Salur Netto (Rp)</Label>
                  <Input
                    id="salurNetto"
                    type="number"
                    value={formData.salurNetto || ''}
                    disabled
                    className="bg-muted font-semibold"
                  />
                  <p className="text-xs text-muted-foreground">Gaji Pokok - PPH - Potongan JKN</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="satuanPendidikan">Satuan Pendidikan</Label>
              <Input
                id="satuanPendidikan"
                value={formData.satuanPendidikan || ''}
                onChange={(e) => setFormData({ ...formData, satuanPendidikan: e.target.value })}
                placeholder="Contoh: SDN 1 Jakarta"
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Informasi Rekening</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="namaPemilikRekening">Nama Pemilik Rekening</Label>
                  <Input
                    id="namaPemilikRekening"
                    value={formData.namaPemilikRekening || ''}
                    onChange={(e) => setFormData({ ...formData, namaPemilikRekening: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomorRekening">Nomor Rekening</Label>
                  <Input
                    id="nomorRekening"
                    value={formData.nomorRekening || ''}
                    onChange={(e) => setFormData({ ...formData, nomorRekening: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank">Bank</Label>
                  <Input
                    id="bank"
                    value={formData.bank || ''}
                    onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                    placeholder="Contoh: BNI, BRI"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="statusSktp">Status SKTP</Label>
              <Select
                value={formData.statusSktp || ''}
                onValueChange={(value) => setFormData({ ...formData, statusSktp: value })}
              >
                <SelectTrigger id="statusSktp">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TERBIT">TERBIT</SelectItem>
                  <SelectItem value="BELUM">BELUM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-3 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setGuruDialogOpen(false)}
                className="border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 shadow-lg"
              >
                {isSubmitting ? 'Memproses...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Guru')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md border-2 border-red-300 dark:border-red-800 shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-red-700 to-orange-600 text-white -mx-8 -mt-6 px-8 pt-8 pb-4 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-white text-xl font-semibold">Hapus Data Guru</DialogTitle>
                <DialogDescription className="text-red-100 text-sm">
                  Konfirmasi penghapusan data guru
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-6">
            <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-6">
              <p className="text-center text-lg">
                Apakah Anda yakin ingin menghapus data{' '}
                <strong className="text-red-700 dark:text-red-400">{selectedGuru?.nama || ''}</strong>
                ?
              </p>
              <p className="text-center text-sm text-red-600 dark:text-red-300 mt-2">
                ⚠️ Tindakan ini tidak dapat dibatalkan
              </p>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              className="border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Batal
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete} 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-red-700 to-orange-600 hover:from-red-800 hover:to-orange-700 shadow-lg"
            >
              {isSubmitting ? 'Memproses...' : 'Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verifikasi Dialog */}
      <Dialog open={verifikasiDialogOpen} onOpenChange={setVerifikasiDialogOpen}>
        <DialogContent className="max-w-md border-2 border-amber-200 dark:border-amber-800 shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-amber-600 to-orange-500 text-white -mx-8 -mt-6 px-8 pt-8 pb-4 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-white text-xl font-semibold">Verifikasi Pengajuan</DialogTitle>
                <DialogDescription className="text-amber-100 text-sm">
                  {selectedPengajuan && (
                    <span>
                      {formatJenisPengajuan(selectedPengajuan.jenisPengajuan)}
                    </span>
                  )}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          {selectedPengajuan && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Guru:</strong> {selectedPengajuan.guru?.nama || '-'}
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>NIP:</strong> {selectedPengajuan.guru?.nip || '-'}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmitVerifikasi} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verifikasiStatus">Keputusan</Label>
              <Select
                value={verifikasiForm.status}
                onValueChange={(value) => setVerifikasiForm({ ...verifikasiForm, status: value })}
                required
              >
                <SelectTrigger id="verifikasiStatus">
                  <SelectValue placeholder="Pilih keputusan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BELUM_TERBACA_SIMTUN">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      Belum Terbaca SIMTUN
                    </div>
                  </SelectItem>
                  <SelectItem value="DISETUJUI">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Setujui
                    </div>
                  </SelectItem>
                  <SelectItem value="DITOLAK">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      Tolak
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan (Opsional)</Label>
              <Textarea
                id="catatan"
                value={verifikasiForm.catatan}
                onChange={(e) => setVerifikasiForm({ ...verifikasiForm, catatan: e.target.value })}
                placeholder="Tambahkan catatan verifikasi..."
                rows={3}
              />
            </div>

            <DialogFooter className="gap-3 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setVerifikasiDialogOpen(false)}
                className="border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={!verifikasiForm.status || isSubmitting}
                className="bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 shadow-lg"
              >
                {isSubmitting ? 'Memproses...' : 'Simpan Keputusan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Document Dialog */}
      <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-red-200 dark:border-red-800 shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-red-600 to-amber-600 text-white -mx-8 -mt-6 px-8 pt-8 pb-4 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-white text-xl font-semibold">Lihat Dokumen Pendukung</DialogTitle>
                <DialogDescription className="text-red-100 text-sm">
                  Dokumen pendukung untuk verifikasi pengajuan
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="w-full h-[70vh] bg-slate-50 dark:bg-slate-900/50 rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-700">
            {selectedDocument && (
              <iframe
                src={selectedDocument}
                className="w-full h-full border-0"
                title="Dokumen Pendukung"
              />
            )}
          </div>
          <DialogFooter className="gap-3 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setDocumentDialogOpen(false)}
              className="border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Excel Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-md border-2 border-green-200 dark:border-green-800 shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-green-600 to-emerald-500 text-white -mx-8 -mt-6 px-8 pt-8 pb-4 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-white text-xl font-semibold">Import Data Guru dari Excel</DialogTitle>
                <DialogDescription className="text-green-100 text-sm">
                  Unggah file Excel (.xlsx) untuk mengimpor data guru secara massal
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadTemplate}
            className="w-full mt-4 gap-2 border-green-300 hover:bg-green-50 dark:border-green-700 dark:hover:bg-green-900/20"
          >
            <Download className="h-4 w-4" />
            Download Template Excel
          </Button>
          <form onSubmit={handleImport} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="importFile">File Excel</Label>
              <Input
                id="importFile"
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setImportFile(file)
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                Format yang diterima: .xlsx atau .xls
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border-2 border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200 font-medium mb-2">
                <strong>Panduan:</strong>
              </p>
              <ul className="text-xs text-green-700 dark:text-green-300 space-y-1 list-disc list-inside">
                <li>Download template Excel terlebih dahulu</li>
                <li>Isi data sesuai format yang telah ditentukan</li>
                <li>Pastikan NIP bersifat unik (tidak boleh ada duplikat)</li>
                <li>Status SKTP: isi dengan "TERBIT" atau "BELUM"</li>
              </ul>
            </div>
            <DialogFooter className="gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setImportDialogOpen(false)
                  setImportFile(null)
                }}
                className="border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={!importFile || isSubmitting}
                className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 shadow-lg"
              >
                {isSubmitting ? 'Mengimpor...' : 'Import'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
