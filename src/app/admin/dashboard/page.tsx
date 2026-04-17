'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/salary-calculator'

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

  // Dialog states
  const [guruDialogOpen, setGuruDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [verifikasiDialogOpen, setVerifikasiDialogOpen] = useState(false)
  const [selectedGuru, setSelectedGuru] = useState<Guru | null>(null)
  const [selectedPengajuan, setSelectedPengajuan] = useState<Pengajuan | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Form state
  const [formData, setFormData] = useState<Partial<Guru>>({
    salurBruto: 2000000,
    statusSktp: 'BELUM',
  })

  const [verifikasiForm, setVerifikasiForm] = useState({
    status: '',
    catatan: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/guru/dashboard')
    } else if (status === 'authenticated') {
      fetchData()
    }
  }, [status, session, router])

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

    const matchGolongan = filterGolongan === '' || guru.golongan === filterGolongan
    const matchStatus = filterStatus === '' || guru.statusSktp === filterStatus

    return matchSearch && matchGolongan && matchStatus
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
        throw new Error('Verifikasi failed')
      }

      toast.success('Pengajuan berhasil diverifikasi')
      setVerifikasiDialogOpen(false)
      fetchData()
    } catch (error) {
      toast.error('Gagal memverifikasi pengajuan')
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
      PANGKAT: 'Perubahan Pangkat',
      MASA_KERJA: 'Perubahan Masa Kerja',
      REKENING: 'Perubahan Rekening',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Sistem Tunjangan Profesi Guru</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{session?.user?.username || 'Admin'}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <Button variant="outline" size="icon" onClick={() => signOut({ callbackUrl: '/login' })}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGuru}</div>
              <p className="text-xs text-muted-foreground">Guru terdaftar</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SKTP Terbit</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sktpTerbit}</div>
              <p className="text-xs text-muted-foreground">Sudah memiliki SKTP</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SKTP Belum</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sktpBelum}</div>
              <p className="text-xs text-muted-foreground">Belum memiliki SKTP</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Pengajuan</CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingPengajuan}</div>
              <p className="text-xs text-muted-foreground">Menunggu verifikasi</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="guru" className="space-y-4">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="guru" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Data Guru
            </TabsTrigger>
            <TabsTrigger value="verifikasi" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Verifikasi Pengajuan
              {pengajuan.length > 0 && (
                <Badge variant="destructive" className="ml-auto">{pengajuan.length}</Badge>
              )}
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
                        <SelectItem value="">Semua</SelectItem>
                        <SelectItem value="III">Gol. III</SelectItem>
                        <SelectItem value="IV">Gol. IV</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Semua</SelectItem>
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
                    <Button onClick={handleAddGuru} className="gap-2">
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
                      <TableRow className="bg-slate-50 dark:bg-slate-800">
                        <TableHead className="sticky top-0 bg-slate-50 dark:bg-slate-800">No</TableHead>
                        <TableHead className="sticky top-0 bg-slate-50 dark:bg-slate-800">NIP</TableHead>
                        <TableHead className="sticky top-0 bg-slate-50 dark:bg-slate-800">Nama</TableHead>
                        <TableHead className="sticky top-0 bg-slate-50 dark:bg-slate-800">Golongan</TableHead>
                        <TableHead className="sticky top-0 bg-slate-50 dark:bg-slate-800">Salur Netto</TableHead>
                        <TableHead className="sticky top-0 bg-slate-50 dark:bg-slate-800">Status</TableHead>
                        <TableHead className="sticky top-0 bg-slate-50 dark:bg-slate-800 text-right">Aksi</TableHead>
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
                          <TableRow key={guru.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-mono text-sm">{guru.nip}</TableCell>
                            <TableCell className="font-medium">{guru.nama}</TableCell>
                            <TableCell>{guru.golongan}</TableCell>
                            <TableCell className="font-semibold">{formatCurrency(guru.salurNetto)}</TableCell>
                            <TableCell>{getStatusBadge(guru.statusSktp)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditGuru(guru)}>
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
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Daftar Pengajuan Pending
                </CardTitle>
                <CardDescription>
                  Daftar pengajuan yang menunggu verifikasi
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pengajuan.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Tidak ada pengajuan yang menunggu verifikasi</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {pengajuan.map((p) => {
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

                      return (
                        <Card key={p.id} className="border-l-4 border-l-orange-500">
                          <CardContent className="pt-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                              <div className="flex-1 space-y-4">
                                <div>
                                  <h3 className="font-semibold text-lg mb-2">
                                    {formatJenisPengajuan(p.jenisPengajuan)}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {p.guru?.nama || '-'} - {p.guru?.nip || '-'}
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium mb-2">Data Lama:</p>
                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-md p-3 space-y-1 text-sm">
                                      {dataLama ? (
                                        Object.entries(dataLama).map(([key, value]) => (
                                          <div key={key} className="flex justify-between">
                                            <span className="text-muted-foreground capitalize">{key}:</span>
                                            <span className="font-medium">{String(value)}</span>
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-muted-foreground italic">Tidak ada data</p>
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <p className="text-sm font-medium mb-2">Data Baru:</p>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-md p-3 space-y-1 text-sm">
                                      {Object.entries(dataBaru).map(([key, value]) => (
                                        <div key={key} className="flex justify-between">
                                          <span className="text-muted-foreground capitalize">{key}:</span>
                                          <span className="font-medium text-blue-700 dark:text-blue-300">{String(value)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="text-sm text-muted-foreground">
                                  Tanggal Diajukan: {formatDate(p.tanggalDiajukan)}
                                </div>
                              </div>

                              <div className="lg:w-[200px] flex lg:flex-col gap-2">
                                <Button
                                  onClick={() => handleVerifikasi(p)}
                                  className="flex-1 gap-2"
                                  size="sm"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Verifikasi
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add/Edit Guru Dialog */}
      <Dialog open={guruDialogOpen} onOpenChange={setGuruDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Data Guru' : 'Tambah Guru Baru'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Perbarui data guru yang sudah ada.' : 'Isi form untuk menambahkan guru baru.'}
            </DialogDescription>
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
                />
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
                    <SelectItem value="III/a">III/a</SelectItem>
                    <SelectItem value="III/b">III/b</SelectItem>
                    <SelectItem value="III/c">III/c</SelectItem>
                    <SelectItem value="III/d">III/d</SelectItem>
                    <SelectItem value="IV/a">IV/a</SelectItem>
                    <SelectItem value="IV/b">IV/b</SelectItem>
                    <SelectItem value="IV/c">IV/c</SelectItem>
                    <SelectItem value="IV/d">IV/d</SelectItem>
                    <SelectItem value="IV/e">IV/e</SelectItem>
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
              <Label htmlFor="satuanPendidikan">Satuan Pendidikan</Label>
              <Input
                id="satuanPendidikan"
                value={formData.satuanPendidikan || ''}
                onChange={(e) => setFormData({ ...formData, satuanPendidikan: e.target.value })}
                placeholder="Contoh: SDN 1 Jakarta"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salurBruto">Salur Bruto (Rp)</Label>
              <Input
                id="salurBruto"
                type="number"
                value={formData.salurBruto || ''}
                onChange={(e) => setFormData({ ...formData, salurBruto: parseFloat(e.target.value) || 0 })}
              />
              <p className="text-xs text-muted-foreground">Salur Bruto akan dikurangi PPH dan JKN untuk mendapatkan Salur Netto</p>
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setGuruDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Memproses...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Guru')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Data Guru</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data <strong>{selectedGuru?.nama || ''}</strong>? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isSubmitting}>
              {isSubmitting ? 'Memproses...' : 'Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verifikasi Dialog */}
      <Dialog open={verifikasiDialogOpen} onOpenChange={setVerifikasiDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verifikasi Pengajuan</DialogTitle>
            <DialogDescription>
              {selectedPengajuan && (
                <span>
                  {formatJenisPengajuan(selectedPengajuan.jenisPengajuan)} oleh {selectedPengajuan.guru?.nama || '-'}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setVerifikasiDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={!verifikasiForm.status || isSubmitting}>
                {isSubmitting ? 'Memproses...' : 'Simpan Keputusan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
