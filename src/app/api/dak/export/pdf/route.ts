import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID penyaluran tidak ditemukan' },
        { status: 400 }
      )
    }

    const penyaluran = await prisma.dAKPenyaluran.findUnique({
      where: { id },
      include: { detailPenerima: true },
    })

    if (!penyaluran) {
      return NextResponse.json(
        { error: 'Penyaluran tidak ditemukan' },
        { status: 404 }
      )
    }

    // Create HTML content for PDF
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            font-size: 12px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .header h1 {
            font-size: 16px;
            margin: 0;
          }
          .header h2 {
            font-size: 14px;
            margin: 5px 0;
          }
          .header p {
            font-size: 11px;
            margin: 2px 0;
          }
          .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .info-table td {
            padding: 5px;
            border: 1px solid #000;
          }
          .info-table .label {
            font-weight: bold;
            background-color: #f0f0f0;
            width: 30%;
          }
          .data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
          }
          .data-table th {
            background-color: #f0f0f0;
            border: 1px solid #000;
            padding: 5px;
            text-align: center;
            font-weight: bold;
          }
          .data-table td {
            border: 1px solid #000;
            padding: 4px;
          }
          .data-table .number {
            text-align: right;
          }
          .data-table .center {
            text-align: center;
          }
          .summary-row {
            background-color: #f0f0f0;
            font-weight: bold;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PEMERINTAH KABUPATEN BLITAR</h1>
          <h1>DINAS PENDIDIKAN</h1>
          <p>Jalan Jendral Sudirman No. 10 Kanigoro - Blitar</p>
          <p>Telp: (0342) 802345 - Email: disdik@blitarkab.go.id</p>
          <hr>
        </div>

        <h2 style="text-align: center; margin: 20px 0;">REKOMENDASI PENYALURAN DAK NON FISIK<br/>TUNJANGAN PROFESI GURU</h2>

        <table class="info-table">
          <tr>
            <td class="label">Jenis Tunjangan</td>
            <td>${penyaluran.jenis}</td>
          </tr>
          <tr>
            <td class="label">Periode</td>
            <td>${penyaluran.periode}</td>
          </tr>
          <tr>
            <td class="label">Gelombang</td>
            <td>${penyaluran.gelombang}</td>
          </tr>
          <tr>
            <td class="label">Status</td>
            <td>${penyaluran.status}</td>
          </tr>
        </table>

        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 5%;">No</th>
              <th style="width: 15%;">NIP</th>
              <th style="width: 20%;">Nama</th>
              <th style="width: 10%;">Bank</th>
              <th style="width: 15%;">No. Rekening</th>
              <th style="width: 12%;">Salur Bruto</th>
              <th style="width: 8%;">Pot PPH</th>
              <th style="width: 8%;">Pot JKN</th>
              <th style="width: 12%;">Salur Netto</th>
            </tr>
          </thead>
          <tbody>
            ${penyaluran.detailPenerima.map((item, index) => `
            <tr>
              <td class="center">${index + 1}</td>
              <td>${item.nip}</td>
              <td>${item.nama}</td>
              <td>${item.bank || '-'}</td>
              <td>${item.noRekening}</td>
              <td class="number">${item.salurBruto.toLocaleString('id-ID')}</td>
              <td class="number">${item.pph.toLocaleString('id-ID')}</td>
              <td class="number">${item.potIjn.toLocaleString('id-ID')}</td>
              <td class="number">${item.salurNetto.toLocaleString('id-ID')}</td>
            </tr>
            `).join('')}
            <tr class="summary-row">
              <td colspan="5" class="center">TOTAL</td>
              <td class="number">${penyaluran.salurBruto.toLocaleString('id-ID')}</td>
              <td class="number">${penyaluran.potPph.toLocaleString('id-ID')}</td>
              <td class="number">${(penyaluran.potJknPns + penyaluran.potJknPppk).toLocaleString('id-ID')}</td>
              <td class="number">${penyaluran.nilaiRekomendasi.toLocaleString('id-ID')}</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          <p>Dicetak pada: ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          <p>Jumlah Penerima: ${penyaluran.detailPenerima.length} orang</p>
        </div>
      </body>
      </html>
    `

    // Return HTML for browser to print or save as PDF
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Gagal membuat PDF' },
      { status: 500 }
    )
  }
}
