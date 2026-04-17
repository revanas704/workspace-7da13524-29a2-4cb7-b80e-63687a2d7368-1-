'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/salary-calculator'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
  Wallet,
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
  pengajuanList?: any[]
}

interface Pengajuan {
  id: string
  guruId: string
  jenisPengajuan: string
  dataLama?: string
  dataBaru: string
  dokumenPendukung?: string
  status: string
  catatan?: string
  tanggalDiajukan: string
  tanggalVerifikasi?: string
  guru: Guru
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
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showVerifikasiDialog, setShowVerifikasiDialog] = useState(false)
  const [selectedGuru, setSelectedGuru] = useState<Guru | null>(null)
  const [selectedPengajuan, setSelectedPengajuan] = useState<Pengajuan | null>(null)

  // Form states
  const [formData, setFormData] = useState<Partial<Guru>>({})
  const [verifikasiData, setVerifikasiData] = useState({ status: '', catatan: '' })
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
      const gurusRes = await fetch('/api/admin/gurus')
      if (gurusRes.ok) {
        const gurusData = await gurusRes.json()
        setGurus(gurusData)
      }

      const pengajuanRes = await fetch('/api/admin/pengajuan')
      if (pengajuanRes.ok) {
        const pengajuanData = await pengajuanRes.json()
        setPengajuan(pengajuanData)
      }
    } catch (error) {
      toast.error('Gagal memuat data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddGuru = () => {
    setSelectedGuru(null)
    setFormData({
      salurBruto: 2000000,
      statusSktp: 'BELUM',
    })
    setShowAddDialog(true)
  }

  const handleEditGuru = (guru: Guru) => {
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
    setShowEditDialog(true)
  }

  const handleDeleteGuru = (guru: Guru) => {
    setSelectedGuru(guru)
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedGuru) return

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/gurus/${selectedGuru.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Data guru berhasil dihapus')
        setShowDeleteDialog(false)
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

  const handleSubmitGuru = async (isEdit: boolean) => {
    if (!formData.nip || !formData.nama) {
      toast.error('NIP dan Nama harus diisi')
      return
    }

    setIsSubmitting(true)
    try {
      const url = isEdit && selectedGuru
        ? `/api/admin/gurus/${selectedGuru.id}`
        : '/api/admin/gurus'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success(isEdit ? 'Data guru berhasil diperbarui' : 'Data guru berhasil ditambahkan')
        setShowAddDialog(false)
        setShowEditDialog(false)
        fetchData()
      } else {
        const error = await res.json()
        toast.error(error.error || 'Gagal menyimpan data')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifikasi = (pengajuan: Pengajuan) => {
    setSelectedPengajuan(pengajuan)
    setVerifikasiData({ status: '', catatan: '' })
    setShowVerifikasiDialog(true)
  }

  const handleSubmitVerifikasi = async () => {
    if (!selectedPengajuan || !verifikasiData.status) {
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
          status: verifikasiData.status,
          catatan: verifikasiData.catatan,
        }),
      })

      if (res.ok) {
        toast.success('Pengajuan berhasil diverifikasi')
        setShowVerifikasiDialog(false)
        fetchData()
      } else {
        toast.error('Gagal memverifikasi pengajuan')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

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

  const filteredGurus = gurus.filter((guru) => {
    const matchSearch =
      filterSearch === '' ||
      guru.nama.toLowerCase().includes(filterSearch.toLowerCase()) ||
      guru.nip.includes(filterSearch)
    const matchGolongan = filterGolongan === '' || guru.golongan === filterGolongan
    const matchStatus = filterStatus === '' || guru.statusSktp === filterStatus
    return matchSearch && matchGolongan && matchStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'TERBIT':
      case 'DISETUJUI':
        return <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> {status}</Badge>
      case 'BELUM':
      case 'PENDING':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> {status}</Badge>
      case 'DITOLAK':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> {status}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const stats = {
    totalGuru: gurus.length,
    sktpTerbit: gurus.filter((g) => g.statusSktp === 'TERBIT').length,
    sktpBelum: gurus.filter((g) => g.statusSktp === 'BELUM').length,
    pendingPengajuan: pengajuan.length,
    totalSalurNetto: gurus.reduce((sum, g) => sum + g.salurNetto, 0),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">SIM Tunjangan Profesi</h1>
            <p className="text-sm text-muted-foreground">Dashboard Admin</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold">Administrator</p>
              <p className="text-sm text-muted-foreground">{session?.user?.username}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/login' })}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGuru}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SKTP Terbit</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.sktpTerbit}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SKTP Belum</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.sktpBelum}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Pengajuan</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingPengajuan}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="guru" className="space-y-6">
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
                        <TableHead className="sticky top-0 bg-slate-50 dark:bg-slate-800">Satuan Pendidikan</TableHead>
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
                          <TableRow key={guru.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-mono text-sm">{guru.nip}</TableCell>
                            <TableCell className="font-medium">{guru.nama}</TableCell>
                            <TableCell className="max-w-[150px] truncate" title={guru.satuanPendidikan}>
                              {guru.satuanPendidikan}
                            </TableCell>
                            <TableCell>{guru.golongan}</TableCell>
                            <TableCell className="font-semibold">{formatCurrency(guru.salurNetto)}</TableCell>
                            <TableCell>{getStatusBadge(guru.statusSktp)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEditGuru(guru)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteGuru(guru)}>
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

          {/* Verifikasi Tab */}
          <TabsContent value="verifikasi">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Daftar Pengajuan Pending
                </CardTitle>
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
                      const dataBaru = JSON.parse(p.dataBaru)
                      const dataLama = p.dataLama ? JSON.parse(p.dataLama) : null

                      return (
                        <Card key={p.id} className="border-l-4 border-l-orange-500">
                          <CardContent className="pt-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                              <div className="flex-1 space-y-4">
                                <div>
                                  <h3 className="font-semibold text-lg mb-2">
                                    {p.jenisPengajuan === 'PANGKAT' && 'Perubahan Pangkat/Golongan'}
                                    {p.jenisPengajuan === 'MASA_KERJA' && 'Perubahan Masa Kerja'}
                                    {p.jenisPengajuan === 'REKENING' && 'Perubahan Data Rekening'}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {p.guru.nama} - {p.guru.nip}
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-2">Data Lama:</p>
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
                                    <p className="text-sm font-medium text-muted-foreground mb-2">Data Baru:</p>
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
      <Dialog open={showAddDialog || showEditDialog} onOpenChange={(open) => {
        setShowAddDialog(open)
        setShowEditDialog(false)
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedGuru ? 'Edit Data Guru' : 'Tambah Guru Baru'}</DialogTitle>
            <DialogDescription>
              {selectedGuru ? 'Perbarui data guru yang sudah ada.' : 'Isi form untuk menambahkan guru baru.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>NIK</Label>
                <Input
                  value={formData.nik || ''}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>NUPTK</Label>
                <Input
                  value={formData.nuptk || ''}
                  onChange={(e) => setFormData({ ...formData, nuptk: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>NIP *</Label>
                <Input
                  value={formData.nip || ''}
                  onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nama Lengkap *</Label>
              <Input
                value={formData.nama || ''}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pangkat</Label>
                <Input
                  value={formData.pangkat || ''}
                  onChange={(e) => setFormData({ ...formData, pangkat: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Golongan</Label>
                <Select
                  value={formData.golongan || ''}
                  onValueChange={(value) => setFormData({ ...formData, golongan: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih golongan" />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Masa Kerja (Tahun)</Label>
                <Input
                  type="number"
                  min="0"
                  max="40"
                  value={formData.masaKerja || ''}
                  onChange={(e) => setFormData({ ...formData, masaKerja: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Salur Bruto (Rp)</Label>
                <Input
                  type="number"
                  value={formData.salurBruto || ''}
                  onChange={(e) => setFormData({ ...formData, salurBruto: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Satuan Pendidikan</Label>
              <Input
                value={formData.satuanPendidikan || ''}
                onChange={(e) => setFormData({ ...formData, satuanPendidikan: e.target.value })}
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Informasi Rekening</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Nama Pemilik Rekening</Label>
                  <Input
                    value={formData.namaPemilikRekening || ''}
                    onChange={(e) => setFormData({ ...formData, namaPemilikRekening: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nomor Rekening</Label>
                  <Input
                    value={formData.nomorRekening || ''}
                    onChange={(e) => setFormData({ ...formData, nomorRekening: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bank</Label>
                  <Input
                    value={formData.bank || ''}
                    onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status SKTP</Label>
              <Select
                value={formData.statusSktp || ''}
                onValueChange={(value) => setFormData({ ...formData, statusSktp: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TERBIT">TERBIT</SelectItem>
                  <SelectItem value="BELUM">BELUM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false)
              setShowEditDialog(false)
              setFormData({})
            }}>
              Batal
            </Button>
            <Button onClick={() => handleSubmitGuru(!!selectedGuru)} disabled={isSubmitting}>
              {isSubmitting ? 'Memproses...' : (selectedGuru ? 'Simpan Perubahan' : 'Tambah Guru')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Data Guru</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data <strong>{selectedGuru?.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isSubmitting}>
              {isSubmitting ? 'Memproses...' : 'Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verifikasi Dialog */}
      <Dialog open={showVerifikasiDialog} onOpenChange={setShowVerifikasiDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verifikasi Pengajuan</DialogTitle>
            <DialogDescription>
              {selectedPengajuan && (
                <span>
                  {selectedPengajuan.jenisPengajuan === 'PANGKAT' && 'Perubahan Pangkat/Golongan'}
                  {selectedPengajuan.jenisPengajuan === 'MASA_KERJA' && 'Perubahan Masa Kerja'}
                  {selectedPengajuan.jenisPengajuan === 'REKENING' && 'Perubahan Data Rekening'}
                  {' '}oleh {selectedPengajuan.guru.nama}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Keputusan</Label>
              <Select
                value={verifikasiData.status}
                onValueChange={(value) => setVerifikasiData({ ...verifikasiData, status: value })}
              >
                <SelectTrigger>
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
              <Label>Catatan (Opsional)</Label>
              <Textarea
                value={verifikasiData.catatan}
                onChange={(e) => setVerifikasiData({ ...verifikasiData, catatan: e.target.value })}
                placeholder="Tambahkan catatan verifikasi..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowVerifikasiDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmitVerifikasi} disabled={!verifikasiData.status || isSubmitting}>
              {isSubmitting ? 'Memproses...' : 'Simpan Keputusan'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
