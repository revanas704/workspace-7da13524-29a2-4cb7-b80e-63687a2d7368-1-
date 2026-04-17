import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Define the template columns
    const templateData = [
      {
        'NIK': '',
        'NUPTK': '',
        'NIP': '',
        'Nama': '',
        'Pangkat': '',
        'Golongan': '',
        'Masa Kerja': '',
        'Nama Pemilik Rekening': '',
        'Nomor Rekening': '',
        'Bank': '',
        'Satuan Pendidikan': '',
        'Status SKTP': '',
      },
      // Add a sample row for guidance
      {
        'NIK': '3502000111111111',
        'NUPTK': '0011111111111111',
        'NIP': '19800101 201001 1 001',
        'Nama': 'Contoh Nama Guru',
        'Pangkat': 'Penata Muda',
        'Golongan': 'III/a',
        'Masa Kerja': '10',
        'Nama Pemilik Rekening': 'Contoh Nama Guru',
        'Nomor Rekening': '1234567890',
        'Bank': 'BPD JAWA TIMUR',
        'Satuan Pendidikan': 'SD Negeri 1 Contoh',
        'Status SKTP': 'TERBIT',
      },
    ];

    // Create workbook
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Guru');

    // Set column widths
    ws['!cols'] = [
      { wch: 18 }, // NIK
      { wch: 18 }, // NUPTK
      { wch: 22 }, // NIP
      { wch: 25 }, // Nama
      { wch: 18 }, // Pangkat
      { wch: 12 }, // Golongan
      { wch: 12 }, // Masa Kerja
      { wch: 25 }, // Nama Pemilik Rekening
      { wch: 18 }, // Nomor Rekening
      { wch: 15 }, // Bank
      { wch: 25 }, // Satuan Pendidikan
      { wch: 12 }, // Status SKTP
    ];

    // Generate buffer
    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Return file
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Template_Import_Data_Guru.xlsx"',
      },
    });
  } catch (error) {
    console.error('Error generating template:', error);
    return NextResponse.json(
      { error: 'Gagal membuat template Excel' },
      { status: 500 }
    );
  }
}
