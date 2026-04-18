'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import {
  ArrowLeft,
  FileSpreadsheet,
  Search,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
} from 'lucide-react'

interface DAKDetailPenerima {
  id: string
  dakPenyaluranId: string
  nip: string
  nama: string
  namaPemilikRekening: string
  noRekening: string
  bank: string
  satdik: string
  salurBruto: number
  pph: number
  potIjn: number
  salurNetto: number
  status: string
}

interface DAKPenyaluran {
  id: string
  jenis: string
  periode: string
  gelombang: number
  status: string
  salurBruto: number
  nilaiRekomendasi: number
  potPph: number
  potJknPns: number
  potJknPppk: number
  jumlahPenerima: number
  createdAt: string
  updatedAt: string
}

interface DAKWithDetails extends DAKPenyaluran {
  detailPenerima: DAKDetailPenerima[]
}

export default function GuruDAKPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [dakData, setDakData] = useState<DAKWithDetails[]>([])
  const [search, setSearch] = useState('')
  const [detailSearch, setDetailSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10 as number | 'ALL',
  })

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      router.push('/admin/dashboard')
    } else if (status === 'authenticated' && session?.user?.role === 'GURU') {
      fetchDakData()
    }
  }, [status, session, router])

  const fetchDakData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/guru/dak')
      if (res.ok) {
        const data = await res.json()
        setDakData(data || [])
      } else {
        const error = await res.json()
        toast.error(error.error || 'Gagal memuat data DAK')
      }
    } catch (error) {
      console.error('Error fetching DAK data:', error)
      toast.error('Terjadi kesalahan saat memuat data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'UPLOAD_SELESAI':
        return <Badge variant="outline" className="border-blue-500 text-blue-700"><Clock className="w-3 h-3 mr-1" /> UPLOAD SELESAI</Badge>
      case 'DIKIRIM_KE_DJPK':
        return <Badge variant="outline" className="border-orange-500 text-orange-700"><Clock className="w-3 h-3 mr-1" /> DIKIRIM KE DJPK</Badge>
      case 'DIKIRIM_KE_DITPA':
        return <Badge variant="outline" className="border-amber-500 text-amber-700"><Clock className="w-3 h-3 mr-1" /> DIKIRIM KE DIT. PA</Badge>
      case 'SP2D':
        return <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> SP2D</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const filteredDakData = dakData.filter((dak) => {
    const matchesSearch =
      dak.periode.toLowerCase().includes(search.toLowerCase()) ||
      dak.jenis.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = filterStatus === 'ALL' || dak.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const filteredDetails = expandedId
    ? dakData.find((d) => d.id === expandedId)?.detailPenerima.filter(
        (detail) =>
          detail.nama.toLowerCase().includes(detailSearch.toLowerCase()) ||
          detail.nip.includes(detailSearch)
      ) || []
    : []

  // Pagination
  const totalPages = typeof pagination.itemsPerPage === 'number'
    ? Math.ceil(filteredDetails.length / pagination.itemsPerPage)
    : 1
  const startIndex = typeof pagination.itemsPerPage === 'number'
    ? (pagination.currentPage - 1) * pagination.itemsPerPage
    : 0
  const endIndex = typeof pagination.itemsPerPage === 'number'
    ? startIndex + pagination.itemsPerPage
    : filteredDetails.length
  const paginatedDetails = pagination.itemsPerPage === 'ALL'
    ? filteredDetails
    : filteredDetails.slice(startIndex, endIndex)

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 dark:from-slate-900 dark:via-red-950/20 dark:to-amber-950/20">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-700 to-amber-600 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/guru/dashboard')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">DAK Non Fisik</h1>
              <p className="text-sm text-red-100">Penyaluran Tunjangan Profesi Guru</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle>Pencarian & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cari Periode/Jenis</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari periode atau jenis..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Filter Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua Status</SelectItem>
                    <SelectItem value="UPLOAD_SELESAI">Upload Selesai</SelectItem>
                    <SelectItem value="DIKIRIM_KE_DJPK">Dikirim Ke DJPK</SelectItem>
                    <SelectItem value="DIKIRIM_KE_DITPA">Dikirim Ke Dit. PA</SelectItem>
                    <SelectItem value="SP2D">SP2D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DAK Penyaluran List */}
        {filteredDakData.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="py-12">
              <div className="text-center">
                <FileSpreadsheet className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground mb-2">
                  {dakData.length === 0
                    ? 'Belum ada data penyaluran DAK'
                    : 'Tidak ada data yang sesuai dengan pencarian'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Data penyaluran akan muncul di sini setelah diinput oleh admin
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredDakData.map((dak) => {
              const isExpanded = expandedId === dak.id

              return (
                <Card key={dak.id} className="shadow-lg border-l-4 border-l-red-500">
                  <CardContent className="py-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-lg font-semibold">
                            {dak.jenis} - {dak.periode}
                          </h3>
                          <span className="text-sm text-muted-foreground">
                            Gelombang {dak.gelombang}
                          </span>
                          {getStatusBadge(dak.status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Salur Bruto</p>
                            <p className="font-semibold">{formatCurrency(dak.salurBruto)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Nilai Rekomendasi</p>
                            <p className="font-semibold">{formatCurrency(dak.nilaiRekomendasi)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Pot PPH</p>
                            <p className="font-semibold text-red-600">{formatCurrency(dak.potPph)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Jumlah Penerima</p>
                            <p className="font-semibold">{dak.jumlahPenerima}</p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (isExpanded) {
                            setExpandedId(null)
                          } else {
                            setExpandedId(dak.id)
                            setPagination((prev) => ({ ...prev, currentPage: 1 }))
                            setDetailSearch('')
                          }
                        }}
                        className="gap-2"
                      >
                        {isExpanded ? 'Tutup' : 'Lihat Detail'}
                      </Button>
                    </div>

                    {/* Detail Table */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t">
                        {/* Detail Header with Pagination Controls */}
                        <div className="mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div>
                            <h4 className="font-semibold mb-3">Daftar Penerima ({filteredDetails.length} penerima)</h4>
                            <div className="flex gap-4 flex-wrap">
                              <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Cari nama atau NIP..."
                                  className="pl-10"
                                  value={detailSearch}
                                  onChange={(e) => {
                                    setDetailSearch(e.target.value)
                                    setPagination((prev) => ({ ...prev, currentPage: 1 }))
                                  }}
                                />
                              </div>
                              <Select
                                value={pagination.itemsPerPage.toString()}
                                onValueChange={(value) => {
                                  const newItemsPerPage = value === 'ALL' ? 'ALL' : parseInt(value)
                                  setPagination((prev) => ({ ...prev, itemsPerPage: newItemsPerPage, currentPage: 1 }))
                                }}
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Pilih" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="10">10 data</SelectItem>
                                  <SelectItem value="50">50 data</SelectItem>
                                  <SelectItem value="100">100 data</SelectItem>
                                  <SelectItem value="ALL">Semua</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-md border overflow-x-auto max-h-96 overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-red-50 dark:bg-red-950/30 sticky top-0">
                                <TableHead className="sticky top-0 bg-red-50 dark:bg-red-950/30">No</TableHead>
                                <TableHead className="sticky top-0 bg-red-50 dark:bg-red-950/30">NIP</TableHead>
                                <TableHead className="sticky top-0 bg-red-50 dark:bg-red-950/30">Nama</TableHead>
                                <TableHead className="sticky top-0 bg-red-50 dark:bg-red-950/30">Bank</TableHead>
                                <TableHead className="sticky top-0 bg-red-50 dark:bg-red-950/30">No. Rekening</TableHead>
                                <TableHead className="sticky top-0 bg-red-50 dark:bg-red-950/30 text-right">Salur Bruto</TableHead>
                                <TableHead className="sticky top-0 bg-red-50 dark:bg-red-950/30 text-right">Pot PPH</TableHead>
                                <TableHead className="sticky top-0 bg-red-50 dark:bg-red-950/30 text-right">Pot JKN</TableHead>
                                <TableHead className="sticky top-0 bg-red-50 dark:bg-red-950/30 text-right">Nilai Diterima</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {paginatedDetails.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={9} className="text-center py-8">
                                    <p className="text-muted-foreground">
                                      {filteredDetails.length === 0 && detailSearch === ''
                                        ? 'Tidak ada detail penerima'
                                        : 'Tidak ada data yang sesuai dengan pencarian'}
                                    </p>
                                  </TableCell>
                                </TableRow>
                              ) : (
                                paginatedDetails.map((item, index) => (
                                  <TableRow key={item.id} className="hover:bg-red-50/50 dark:hover:bg-red-950/10">
                                    <TableCell>{startIndex + index + 1}</TableCell>
                                    <TableCell className="font-mono text-sm">{item.nip}</TableCell>
                                    <TableCell className="font-medium">{item.nama}</TableCell>
                                    <TableCell>{item.bank || '-'}</TableCell>
                                    <TableCell className="font-mono text-sm">{item.noRekening}</TableCell>
                                    <TableCell className="text-right font-semibold">
                                      {formatCurrency(item.salurBruto)}
                                    </TableCell>
                                    <TableCell className="text-right text-red-600">
                                      {formatCurrency(item.pph)}
                                    </TableCell>
                                    <TableCell className="text-right text-red-600">
                                      {formatCurrency(item.potIjn)}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-green-600">
                                      {formatCurrency(item.salurNetto)}
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Pagination */}
                        {pagination.itemsPerPage !== 'ALL' && totalPages > 1 && (
                          <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-muted-foreground">
                              Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredDetails.length)} dari {filteredDetails.length} data
                            </p>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPagination((prev) => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }))}
                                disabled={pagination.currentPage === 1}
                              >
                                Sebelumnya
                              </Button>
                              <span className="flex items-center px-2 text-sm">
                                Halaman {pagination.currentPage} dari {totalPages}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPagination((prev) => ({ ...prev, currentPage: Math.min(totalPages, prev.currentPage + 1) }))}
                                disabled={pagination.currentPage === totalPages}
                              >
                                Selanjutnya
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
