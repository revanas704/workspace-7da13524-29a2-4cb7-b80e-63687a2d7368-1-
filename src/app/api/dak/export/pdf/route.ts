import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const periode = searchParams.get('periode')
    const gelombang = searchParams.get('gelombang')

    const data = await db.dAKPenyaluran.findMany({
      where: {
        ...(periode && periode !== 'ALL' && { periode }),
        ...(gelombang && gelombang !== 'ALL' && { gelombang: parseInt(gelombang) })
      },
      orderBy: [
        { periode: 'asc' },
        { gelombang: 'asc' }
      ]
    })

    // Format currency
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('id-ID').format(value)
    }

    // Generate HTML for PDF
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Laporan Penyaluran DAK Non Fisik</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 20px;
          }
          h1 {
            text-align: center;
            color: #991b1b;
            margin-bottom: 5px;
          }
          h2 {
            text-align: center;
            color: #333;
            font-size: 14px;
            margin-top: 0;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background-color: #991b1b;
            color: white;
            padding: 10px;
            text-align: left;
            font-weight: bold;
            font-size: 10px;
          }
          td {
            padding: 8px;
            border: 1px solid #ddd;
            font-size: 10px;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .text-right {
            text-align: right;
          }
          .text-center {
            text-align: center;
          }
          .status-pending {
            background-color: #dbeafe;
            color: #1e40af;
          }
          .status-process {
            background-color: #fef3c7;
            color: #92400e;
          }
          .status-done {
            background-color: #dcfce7;
            color: #166534;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <h1>LAPORAN PENYALURAN DAK NON FISIK</h1>
        <h2>SIM Tunjangan Profesi Guru - Kabupaten Blitar</h2>
        <p><strong>Periode:</strong> ${periode === 'ALL' ? 'Semua Periode' : periode}</p>
        <p><strong>Gelombang:</strong> ${gelombang === 'ALL' ? 'Semua Gelombang' : gelombang}</p>
        <p><strong>Tanggal Cetak:</strong> ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Jenis</th>
              <th>Kanwil</th>
              <th>KPPN</th>
              <th>PEMDA</th>
              <th>Periode</th>
              <th>Gelombang</th>
              <th class="text-right">Salur Bruto</th>
              <th class="text-right">Pot. PPH</th>
              <th class="text-right">Pot. JKN</th>
              <th class="text-right">Nilai Rek.</th>
              <th class="text-center">Jml Penerima</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.jenis}</td>
                <td>${item.kanwil}</td>
                <td>${item.kppn}</td>
                <td>${item.pemda}</td>
                <td>${item.periode}</td>
                <td>${item.gelombang}</td>
                <td class="text-right">${formatCurrency(item.salurBruto)}</td>
                <td class="text-right">${formatCurrency(item.potPph)}</td>
                <td class="text-right">${formatCurrency(item.potJknPns + item.potJknPppk)}</td>
                <td class="text-right">${formatCurrency(item.nilaiRekomendasi)}</td>
                <td class="text-center">${item.jumlahPenerima}</td>
                <td class="${
                  item.status === 'Sudah SP2D' ? 'status-done' :
                  item.status === 'Proses Pencairan' ? 'status-process' : 'status-pending'
                }">${item.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} SIM Tunjangan Profesi Guru - Pemerintah Kabupaten Blitar</p>
        </div>
      </body>
      </html>
    `

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="dak-penyaluran-${periode === 'ALL' ? 'semua' : periode}-${new Date().toISOString().split('T')[0]}.pdf"`
      }
    })
  } catch (error) {
    console.error('Export PDF error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
