'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/salary-calculator'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Search,
  School,
  ArrowUp,
  GraduationCap,
  Wallet,
  TrendingUp
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

interface Stats {
  totalGuru: number
  sktpTerbit: number
  sktpBelum: number
  pendingPengajuan: number
  totalSalurNetto: number
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    totalGuru: 0,
    sktpTerbit: 0,
    sktpBelum: 0,
    pendingPengajuan: 0,
    totalSalurNetto: 0,
  })
  const [gurus, setGurus] = useState<Guru[]>([])
  const [pengajuan, setPengajuan] = useState<Pengajuan[]>([])

  // Filter states
  const [filters, setFilters] = useState({
    satuanPendidikan: '',
    golongan: '',
    statusSktp: '',
    search: '',
  })

  // Dialog states
  const [guruDialogOpen, setGuruDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [verifikasiDialogOpen, setVerifikasiDialogOpen] = useState(false)
  const [selectedGuru, setSelectedGuru] = useState<Guru | null>(null)
  const [selectedPengajuan, setSelectedPengajuan] = useState<Pengajuan | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    nik: '',
    nuptk: '',
    nip: '',
    nama: '',
    pangkat: '',
    golongan: '',
    masaKerja: '',
    namaPemilikRekening: '',
    nomorRekening: '',
    bank: '',
    satuanPendidikan: '',
    salurBruto: '2000000',
    statusSktp: 'BELUM',
  })

  const [verifikasiForm, setVerifikasiForm] = useState({
    status: '',
    catatan: '',
  })

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
      // Fetch stats and gurus
      const gurusRes = await fetch('/api/admin/gurus')
      if (gurusRes.ok) {
        const gurusData = await gurusRes.json()
        setGurus(gurusData)
        calculateStats(gurusData)
      }

      // Fetch pengajuan
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

  const calculateStats = (data: Guru[]) => {
    const totalGuru = data.length
    const sktpTerbit = data.filter((g) => g.statusSktp === 'TERBIT').length
    const sktpBelum = data.filter((g) => g.statusSktp === 'BELUM').length
    const totalSalurNetto = data.reduce((sum, g) => sum + g.salurNetto, 0)
    const pendingPengajuan = data.reduce((sum, g) => sum + (g.pengajuanList?.length || 0), 0)

    setStats({
      totalGuru,
      sktpTerbit,
      sktpBelum,
      pendingPengajuan,
      totalSalurNetto,
    })
  }

  const filteredGurus = gurus.filter((guru) => {
    const matchSearch =
      filters.search === '' ||
      guru.nama.toLowerCase().includes(filters.search.toLowerCase()) ||
      guru.nip.includes(filters.search)

    const matchSatuan = filters.satuanPendidikan === '' || guru.satuanPendidikan.includes(filters.satuanPendidikan)
    const matchGolongan = filters.golongan === '' || guru.golongan === filters.golongan
    const matchStatus = filters.statusSktp === '' || guru.statusSktp === filters.statusSktp

    return matchSearch && matchSatuan && matchGolongan && matchStatus
  })

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        ...(filters.satuanPendidikan && { satuanPendidikan: filters.satuanPendidikan }),
        ...(filters.golongan && { golongan: filters.golongan }),
        ...(filters.statusSktp && { statusSktp: filters.statusSktp }),
      })

      const res = await fetch(`/api/admin/export?${params}`)
      if (!res.ok) throw new Error('Export failed')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'data-guru.xlsx'
      a.click()
      window.URL.revokeObjectURL(url)

      toast.success('Data berhasil diexport')
    } catch (error) {
      toast.error('Gagal mengexport data')
      console.error(error)
    }
  }

  const handleAddGuru = () => {
    setIsEditing(false)
    setFormData({
      nik: '',
      nuptk: '',
      nip: '',
      nama: '',
      pangkat: '',
      golongan: '',
      masaKerja: '',
      namaPemilikRekening: '',
      nomorRekening: '',
      bank: '',
      satuanPendidikan: '',
      salurBruto: '2000000',
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
      masaKerja: guru.masaKerja.toString(),
      namaPemilikRekening: guru.namaPemilikRekening,
      nomorRekening: guru.nomorRekening,
      bank: guru.bank,
      satuanPendidikan: guru.satuanPendidikan,
      salurBruto: guru.salurBruto.toString(),
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

    try {
      const res = await fetch(`/api/admin/gurus/${selectedGuru.id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Delete failed')

      toast.success('Data guru berhasil dihapus')
      setDeleteDialogOpen(false)
      fetchData()
    } catch (error) {
      toast.error('Gagal menghapus data guru')
      console.error(error)
    }
  }

  const handleSubmitGuru = async (e: React.FormEvent) => {
    e.preventDefault()

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

      if (!res.ok) throw new Error('Verifikasi failed')

      toast.success('Pengajuan berhasil diverifikasi')
      setVerifikasiDialogOpen(false)
      fetchData()
    } catch (error) {
      toast.error('Gagal memverifikasi pengajuan')
      console.error(error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      TERBIT: 'default',
      BELUM: 'secondary',
      PENDING: 'secondary',
      DISETUJUI: 'default',
      DITOLAK: 'destructive',
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Sistem Tunjangan Profesi Guru</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{session?.user?.username}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
            </div>
            <Button variant="outline" size="icon" onClick={() => signOut({ callbackUrl: '/login' })}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGuru}</div>
              <p className="text-xs text-gray-500">Guru terdaftar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SKTP Terbit</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sktpTerbit}</div>
              <p className="text-xs text-gray-500">Sudah memiliki SKTP</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SKTP Belum</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sktpBelum}</div>
              <p className="text-xs text-gray-500">Belum memiliki SKTP</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Pengajuan</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingPengajuan}</div>
              <p className="text-xs text-gray-500">Menunggu verifikasi</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Salur Netto</CardTitle>
              <Wallet className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalSalurNetto)}</div>
              <p className="text-xs text-gray-500">Total tunjangan</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="guru" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="guru" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Data Guru
            </TabsTrigger>
            <TabsTrigger value="verifikasi" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Verifikasi Pengajuan
            </TabsTrigger>
          </TabsList>

          {/* Data Guru Tab */}
          <TabsContent value="guru" className="space-y-4">
            {/* Filters and Actions */}
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="flex flex-1 gap-4 items-start flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Cari nama atau NIP..."
                        className="pl-10"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select value={filters.satuanPendidikan} onValueChange={(value) => setFilters({ ...filters, satuanPendidikan: value })}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Satuan Pendidikan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Semua Satuan</SelectItem>
                          {[...new Set(gurus.map((g) => g.satuanPendidikan))].map((satuan) => (
                            <SelectItem key={satuan} value={satuan}>
                              {satuan}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={filters.golongan} onValueChange={(value) => setFilters({ ...filters, golongan: value })}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Golongan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Semua</SelectItem>
                          <SelectItem value="II">Gol. II</SelectItem>
                          <SelectItem value="III">Gol. III</SelectItem>
                          <SelectItem value="IV">Gol. IV</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={filters.statusSktp} onValueChange={(value) => setFilters({ ...filters, statusSktp: value })}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Status SKTP" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Semua</SelectItem>
                          <SelectItem value="TERBIT">Terbit</SelectItem>
                          <SelectItem value="BELUM">Belum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                {/* Table */}
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>NIP</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Pangkat</TableHead>
                        <TableHead>Golongan</TableHead>
                        <TableHead>Masa Kerja</TableHead>
                        <TableHead>Satuan Pendidikan</TableHead>
                        <TableHead>Salur Netto</TableHead>
                        <TableHead>Status SKTP</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredGurus.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                            Tidak ada data guru
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredGurus.map((guru, index) => (
                          <TableRow key={guru.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-mono text-sm">{guru.nip}</TableCell>
                            <TableCell className="font-medium">{guru.nama}</TableCell>
                            <TableCell>{guru.pangkat}</TableCell>
                            <TableCell>{guru.golongan}</TableCell>
                            <TableCell>{guru.masaKerja} Tahun</TableCell>
                            <TableCell className="max-w-[200px] truncate" title={guru.satuanPendidikan}>
                              {guru.satuanPendidikan}
                            </TableCell>
                            <TableCell>{formatCurrency(guru.salurNetto)}</TableCell>
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
          <TabsContent value="verifikasi" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Daftar Pengajuan Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pengajuan.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Tidak ada pengajuan yang menunggu verifikasi</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pengajuan.map((p) => {
                      const dataBaru = JSON.parse(p.dataBaru)
                      const dataLama = p.dataLama ? JSON.parse(p.dataLama) : null

                      return (
                        <Card key={p.id} className="border-l-4 border-l-orange-500">
                          <CardContent className="pt-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                              <div className="flex-1 space-y-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                      {formatJenisPengajuan(p.jenisPengajuan)}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                      {p.guru.nama} - {p.guru.nip}
                                    </p>
                                  </div>
                                  <Badge variant="secondary">{getStatusBadge(p.status)}</Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Data Lama:</p>
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3 space-y-1 text-sm">
                                      {dataLama ? (
                                        Object.entries(dataLama)
                                          .filter(([key]) => !['id', 'createdAt', 'updatedAt', 'userId'].includes(key))
                                          .map(([key, value]) => (
                                            <div key={key} className="flex justify-between">
                                              <span className="text-gray-500 capitalize">{key}:</span>
                                              <span className="font-medium">{String(value)}</span>
                                            </div>
                                          ))
                                      ) : (
                                        <p className="text-gray-500 italic">Tidak ada data</p>
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Data Baru:</p>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-md p-3 space-y-1 text-sm">
                                      {Object.entries(dataBaru)
                                        .filter(([key]) => !['id', 'createdAt', 'updatedAt', 'userId'].includes(key))
                                        .map(([key, value]) => (
                                          <div key={key} className="flex justify-between">
                                            <span className="text-gray-500 capitalize">{key}:</span>
                                            <span className="font-medium text-blue-700 dark:text-blue-300">{String(value)}</span>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>Tanggal Diajukan: {formatDate(p.tanggalDiajukan)}</span>
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
                  value={formData.nik}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nuptk">NUPTK</Label>
                <Input
                  id="nuptk"
                  value={formData.nuptk}
                  onChange={(e) => setFormData({ ...formData, nuptk: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nip">NIP</Label>
                <Input
                  id="nip"
                  value={formData.nip}
                  onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pangkat">Pangkat</Label>
                <Select value={formData.pangkat} onValueChange={(value) => setFormData({ ...formData, pangkat: value })} required>
                  <SelectTrigger id="pangkat">
                    <SelectValue placeholder="Pilih Pangkat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="II/a">II/a</SelectItem>
                    <SelectItem value="II/b">II/b</SelectItem>
                    <SelectItem value="II/c">II/c</SelectItem>
                    <SelectItem value="II/d">II/d</SelectItem>
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

              <div className="space-y-2">
                <Label htmlFor="golongan">Golongan</Label>
                <Select value={formData.golongan} onValueChange={(value) => setFormData({ ...formData, golongan: value })} required>
                  <SelectTrigger id="golongan">
                    <SelectValue placeholder="Pilih Golongan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="II">II</SelectItem>
                    <SelectItem value="III">III</SelectItem>
                    <SelectItem value="IV">IV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="masaKerja">Masa Kerja (Tahun)</Label>
                <Input
                  id="masaKerja"
                  type="number"
                  min="0"
                  max="40"
                  value={formData.masaKerja}
                  onChange={(e) => setFormData({ ...formData, masaKerja: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="satuanPendidikan">Satuan Pendidikan</Label>
              <Input
                id="satuanPendidikan"
                value={formData.satuanPendidikan}
                onChange={(e) => setFormData({ ...formData, satuanPendidikan: e.target.value })}
                placeholder="Contoh: SDN 1 Jakarta"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salurBruto">Salur Bruto (Rp)</Label>
              <Input
                id="salurBruto"
                type="number"
                value={formData.salurBruto}
                onChange={(e) => setFormData({ ...formData, salurBruto: e.target.value })}
                required
              />
              <p className="text-xs text-gray-500">Salur Bruto akan dikurangi PPH dan JKN untuk mendapatkan Salur Netto</p>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Informasi Rekening</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="namaPemilikRekening">Nama Pemilik Rekening</Label>
                  <Input
                    id="namaPemilikRekening"
                    value={formData.namaPemilikRekening}
                    onChange={(e) => setFormData({ ...formData, namaPemilikRekening: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomorRekening">Nomor Rekening</Label>
                  <Input
                    id="nomorRekening"
                    value={formData.nomorRekening}
                    onChange={(e) => setFormData({ ...formData, nomorRekening: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank">Bank</Label>
                  <Input
                    id="bank"
                    value={formData.bank}
                    onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                    placeholder="Contoh: BNI, BRI"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="statusSktp">Status SKTP</Label>
              <Select value={formData.statusSktp} onValueChange={(value) => setFormData({ ...formData, statusSktp: value })} required>
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
              <Button type="submit">
                {isEditing ? 'Perbarui' : 'Simpan'}
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
              Apakah Anda yakin ingin menghapus data <strong>{selectedGuru?.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Hapus
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
                  {formatJenisPengajuan(selectedPengajuan.jenisPengajuan)} oleh {selectedPengajuan.guru.nama}
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
              <Button type="submit" disabled={!verifikasiForm.status}>
                Simpan Keputusan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
