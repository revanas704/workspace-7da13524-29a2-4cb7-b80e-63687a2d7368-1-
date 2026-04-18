'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import {
  ArrowLeft,
  Upload,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Search,
  ChevronDown,
} from 'lucide-react'

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
  details: DAKDetailPenerima[]
}

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

export default function AdminDAKPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [importLoading, setImportLoading] = useState(false)
  const [penyaluranData, setPenyaluranData] = useState<DAKPenyaluran[]>([])
  const [selectedPenyaluran, setSelectedPenyaluran] = useState<DAKPenyaluran | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Import form state
  const [importForm, setImportForm] = useState({
    jenis: 'TPG',
    periode: '2025',
    gelombang: '1',
    status: 'PENDING',
  })
  const [importFile, setImportFile] = useState<File | null>(null)

  // Filter state
  const [filterPeriode, setFilterPeriode] = useState('ALL')
  const [filterGelombang, setFilterGelombang] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')

  // Detail pagination state
  const [detailCurrentPage, setDetailCurrentPage] = useState(1)
  const [detailItemsPerPage, setDetailItemsPerPage] = useState<number | 'ALL'>(10)
  const [searchDetail, setSearchDetail] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated' || !session) {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/guru/dashboard')
    } else if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchData()
    }
  }, [status, session, router])

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterPeriode !== 'ALL') params.append('periode', filterPeriode)
      if (filterGelombang !== 'ALL') params.append('gelombang', filterGelombang)

      const res = await fetch(`/api/dak/penyaluran?${params}`)
      if (res.ok) {
        const data = await res.json()
        setPenyaluranData(data || [])
      }
    } catch (error) {
      toast.error('Gagal memuat data DAK')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [filterPeriode, filterGelombang])

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!importFile) {
      toast.error('Silakan pilih file Excel terlebih dahulu')
      return
    }

    setImportLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', importFile)
      formData.append('jenis', importForm.jenis)
      formData.append('periode', importForm.periode)
      formData.append('gelombang', importForm.gelombang)
      formData.append('status', importForm.status)

      const res = await fetch('/api/dak/penyaluran', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        toast.success(`Berhasil mengimpor ${data.count} data penerima`)
        setImportFile(null)
        setImportForm({
          jenis: 'TPG',
          periode: '2025',
          gelombang: '1',
          status: 'PENDING',
        })
        fetchData()
      } else {
        const error = await res.json()
        toast.error(error.error || 'Gagal mengimpor data')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengimpor')
      console.error(error)
    } finally {
      setImportLoading(false)
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      window.open('/api/dak/template', '_blank')
      toast.success('Template sedang diunduh')
    } catch (error) {
      toast.error('Gagal mengunduh template')
    }
  }

  const handleExportExcel = async (id: string) => {
    try {
      window.open(`/api/dak/export/xlsx?id=${id}`, '_blank')
      toast.success('Data sedang diekspor')
    } catch (error) {
      toast.error('Gagal mengekspor data')
    }
  }

  const handleExportPDF = async (id: string) => {
    try {
      window.open(`/api/dak/export/pdf?id=${id}`, '_blank')
      toast.success('PDF sedang dibuat')
    } catch (error) {
      toast.error('Gagal membuat PDF')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'TERBIT':
        return <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> TERBIT</Badge>
      case 'PENDING':
        return <Badge variant="outline" className="border-orange-500 text-orange-700"><Clock className="w-3 h-3 mr-1" /> PENDING</Badge>
      case 'DITOLAK':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> DITOLAK</Badge>
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

  const filteredRecipients = selectedPenyaluran?.details?.filter(item =>
    item.nama.toLowerCase().includes(searchDetail.toLowerCase()) ||
    item.nip.includes(searchDetail)
  ) || []

  const totalPages = typeof detailItemsPerPage === 'number'
    ? Math.ceil(filteredRecipients.length / detailItemsPerPage)
    : 1

  const startIndex = typeof detailItemsPerPage === 'number'
    ? (detailCurrentPage - 1) * detailItemsPerPage
    : 0

  const endIndex = typeof detailItemsPerPage === 'number'
    ? startIndex + detailItemsPerPage
    : filteredRecipients.length

  const paginatedRecipients = detailItemsPerPage === 'ALL'
    ? filteredRecipients
    : filteredRecipients.slice(startIndex, endIndex)

  const uniquePeriodes = Array.from(new Set(penyaluranData.map(d => d.periode)))
  const uniqueGelombangs = Array.from(new Set(penyaluranData.map(d => d.gelombang)))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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
              onClick={() => router.push('/admin/dashboard')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">DAK Non Fisik - Tunjangan Profesi Guru</h1>
              <p className="text-sm text-red-100">Kelola Penyaluran Tunjangan Profesi Guru</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Import Section */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Data Penyaluran DAK
            </CardTitle>
            <CardDescription>
              Unggah file Excel berisi data penerima tunjangan profesi guru
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleImport} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jenis">Jenis Tunjangan</Label>
                  <Select
                    value={importForm.jenis}
                    onValueChange={(value) => setImportForm({ ...importForm, jenis: value })}
                  >
                    <SelectTrigger id="jenis">
                      <SelectValue placeholder="Pilih jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TPG">TPG ASN Daerah</SelectItem>
                      <SelectItem value="TAMSIL">Tunjangan Tambahan Penghasilan</SelectItem>
                      <SelectItem value="INSENTIF">Insentif Guru</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="periode">Periode</Label>
                  <Input
                    id="periode"
                    type="text"
                    placeholder="Contoh: 2025"
                    value={importForm.periode}
                    onChange={(e) => setImportForm({ ...importForm, periode: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gelombang">Gelombang</Label>
                  <Input
                    id="gelombang"
                    type="text"
                    placeholder="Contoh: 1"
                    value={importForm.gelombang}
                    onChange={(e) => setImportForm({ ...importForm, gelombang: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={importForm.status}
                    onValueChange={(value) => setImportForm({ ...importForm, status: value })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">PENDING</SelectItem>
                      <SelectItem value="TERBIT">TERBIT</SelectItem>
                      <SelectItem value="DITOLAK">DITOLAK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-2 border-dashed rounded-lg p-8">
                <div className="flex flex-col items-center justify-center text-center">
                  <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {importFile ? importFile.name : 'Pilih file Excel (.xlsx)'}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleDownloadTemplate}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download Template
                      </Button>
                      <label htmlFor="file-upload">
                        <Button type="button" variant="outline" asChild className="gap-2 cursor-pointer">
                          <span>
                            <Upload className="h-4 w-4" />
                            Pilih File
                          </span>
                        </Button>
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".xlsx,.xls"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setImportFile(file)
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={importLoading || !importFile}
                className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700"
              >
                {importLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mengimpor...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Filter Section */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle>Filter Data Penyaluran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Periode</Label>
                <Select value={filterPeriode} onValueChange={setFilterPeriode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih periode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua</SelectItem>
                    {uniquePeriodes.map((periode) => (
                      <SelectItem key={periode} value={periode}>
                        {periode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Gelombang</Label>
                <Select value={filterGelombang} onValueChange={setFilterGelombang}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih gelombang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua</SelectItem>
                    {uniqueGelombangs.map((gelombang) => (
                      <SelectItem key={gelombang} value={gelombang}>
                        Gelombang {gelombang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua</SelectItem>
                    <SelectItem value="TERBIT">TERBIT</SelectItem>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="DITOLAK">DITOLAK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daftar Penyaluran */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Daftar Penyaluran DAK</CardTitle>
          </CardHeader>
          <CardContent>
            {penyaluranData.length === 0 ? (
              <div className="text-center py-12">
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Belum ada data penyaluran</p>
              </div>
            ) : (
              <div className="space-y-4">
                {penyaluranData.map((penyaluran) => {
                  const isExpanded = expandedId === penyaluran.id

                  return (
                    <Card key={penyaluran.id} className="border-l-4 border-l-red-500">
                      <CardContent className="py-4">
                        <div className="flex flex-col gap-4">
                          {/* Header Row */}
                          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold">
                                  {penyaluran.jenis} - {penyaluran.periode}
                                </h3>
                                <span className="text-sm text-muted-foreground">
                                  Gelombang {penyaluran.gelombang}
                                </span>
                                {getStatusBadge(penyaluran.status)}
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Salur Bruto</p>
                                  <p className="font-semibold">{formatCurrency(penyaluran.salurBruto)}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Nilai Rekomendasi</p>
                                  <p className="font-semibold">{formatCurrency(penyaluran.nilaiRekomendasi)}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Pot PPH</p>
                                  <p className="font-semibold text-red-600">{formatCurrency(penyaluran.potPph)}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Pot JKN (PNS+PPPK)</p>
                                  <p className="font-semibold text-red-600">{formatCurrency(penyaluran.potJknPns + penyaluran.potJknPppk)}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (selectedPenyaluran?.id === penyaluran.id && isExpanded) {
                                    setSelectedPenyaluran(null)
                                    setExpandedId(null)
                                  } else {
                                    setSelectedPenyaluran(penyaluran)
                                    setExpandedId(penyaluran.id)
                                    setDetailCurrentPage(1)
                                    setSearchDetail('')
                                  }
                                }}
                                className="gap-1"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 rotate-180" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                                {isExpanded ? 'Tutup' : 'Detail'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExportExcel(penyaluran.id)}
                                className="gap-1"
                              >
                                <Download className="h-4 w-4" />
                                Excel
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExportPDF(penyaluran.id)}
                                className="gap-1"
                              >
                                <Download className="h-4 w-4" />
                                PDF
                              </Button>
                            </div>
                          </div>

                          {/* Detail Table */}
                          {isExpanded && selectedPenyaluran?.id === penyaluran.id && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="mb-4">
                                <h4 className="font-semibold mb-3">Daftar Penerima ({filteredRecipients.length} penerima)</h4>
                                <div className="flex gap-4 flex-wrap">
                                  <div className="relative flex-1 min-w-[200px]">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      placeholder="Cari nama atau NIP..."
                                      className="pl-10"
                                      value={searchDetail}
                                      onChange={(e) => {
                                        setSearchDetail(e.target.value)
                                        setDetailCurrentPage(1)
                                      }}
                                    />
                                  </div>
                                  <Select
                                    value={detailItemsPerPage.toString()}
                                    onValueChange={(value) => {
                                      setDetailItemsPerPage(value === 'ALL' ? 'ALL' : parseInt(value))
                                      setDetailCurrentPage(1)
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
                                      <TableHead className="sticky top-0 bg-red-50 dark:bg-red-950/30 text-right">Nilai Diterima (Salur Netto)</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {paginatedRecipients.length === 0 ? (
                                      <TableRow>
                                        <TableCell colSpan={9} className="text-center py-8">
                                          <p className="text-muted-foreground">Tidak ada data penerima</p>
                                        </TableCell>
                                      </TableRow>
                                    ) : (
                                      paginatedRecipients.map((item, index) => (
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
                              {detailItemsPerPage !== 'ALL' && totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                  <p className="text-sm text-muted-foreground">
                                    Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredRecipients.length)} dari {filteredRecipients.length} data
                                  </p>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setDetailCurrentPage(prev => Math.max(1, prev - 1))}
                                      disabled={detailCurrentPage === 1}
                                    >
                                      Sebelumnya
                                    </Button>
                                    <div className="flex items-center gap-1">
                                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <Button
                                          key={page}
                                          variant={page === detailCurrentPage ? 'default' : 'outline'}
                                          size="sm"
                                          onClick={() => setDetailCurrentPage(page)}
                                          className={`w-8 h-8 ${
                                            page === detailCurrentPage
                                              ? 'bg-red-600 hover:bg-red-700'
                                              : ''
                                          }`}
                                        >
                                          {page}
                                        </Button>
                                      ))}
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setDetailCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                      disabled={detailCurrentPage === totalPages}
                                    >
                                      Selanjutnya
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
