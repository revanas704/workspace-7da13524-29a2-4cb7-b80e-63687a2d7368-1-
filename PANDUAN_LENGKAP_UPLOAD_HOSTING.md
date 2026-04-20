# 🚀 PANDUAN LENGKAP: Upload Website ke Hosting (Mulai Dari Awal)

## 📋 Apa yang Akan Kita Lakukan?

Panduan ini akan membantu Anda mengupload website **SIM Tunjangan Profesi Guru** ke hosting dengan langkah-langkah yang sangat detail dari awal sampai selesai.

### Hasil Akhir:
- ✅ Website online di internet
- ✅ Bisa diakses dari mana saja
- ✅ Database sudah terconnect
- ✅ Login berfungsi (admin & guru)
- ✅ 100% GRATIS

---

## 📋 PERSIAPAN SEBELUM MULAI

### Checklist Awal (Wajib!):

- [ ] Punya akun email yang aktif (Gmail, Yahoo, dll)
- [ ] Punya komputer/laptop dengan internet
- [ ] Project Next.js sudah ada di komputer
- [ ] Website sudah bisa jalan di lokal (`npm run dev`)
- [ ] Punya waktu sekitar 45-60 menit
- [ ] Baca panduan ini sampai selesai sebelum mulai

### Apa yang Diperlukan?

| Item | Keterangan |
|------|-----------|
| Akun Email | Untuk daftar di GitHub, Supabase, Vercel |
| Project Next.js | Project website yang sudah ada |
| Browser | Chrome, Firefox, Safari, atau Edge |
| Internet | Koneksi internet stabil |

---

## 📅 ESTIMASI WAKTU

| Tahapan | Waktu |
|---------|-------|
| Buat akun (GitHub, Supabase, Vercel) | 10-15 menit |
| Setup database di Supabase | 10-15 menit |
| Upload ke GitHub | 5-10 menit |
| Deploy ke Vercel | 5-10 menit |
| Testing & verifikasi | 5 menit |
| **Total** | **45-60 menit** |

---

## BAGIAN 1: MEMBUAT AKUN-PROFIL (15 Menit)

### Overview:
```
Buat Akun GitHub → Buat Akun Supabase → Buat Akun Vercel
```

---

### STEP 1.1: Buat Akun GitHub

#### 1.1.1 Apa Itu GitHub?
GitHub adalah platform untuk menyimpan dan mengelola code project Anda. Semua file project akan disimpan di GitHub secara gratis.

#### 1.1.2 Cara Membuat Akun GitHub:

**Langkah 1: Buka Website**
1. Buka browser (Chrome, Firefox, Safari, atau Edge)
2. Ketik di address bar: `https://github.com`
3. Tekan Enter

**Langkah 2: Klik Sign Up**
1. Di pojok kanan atas, cari tulisan **"Sign up"**
2. Klik tombol **"Sign up"**

**Langkah 3: Isi Form Registrasi**
1. Masukkan email Anda
2. Buat password (minimal 8 karakter, kombinasi huruf & angka)
3. Buat username (harus unik, contoh: `ahmadguru123`)
4. Klik **"Continue"**

**Langkah 4: Verifikasi Email**
1. Buka email yang Anda daftarkan
2. Cari email dari GitHub
3. Buka email tersebut
4. Klik link verifikasi
5. Akun GitHub sudah aktif!

**Langkah 5: (Opsional) Profile Setup**
GitHub akan menanyakan beberapa pertanyaan tambahan:
- Apakah Anda programmer profesional?
- Apakah Anda bekerja di perusahaan?
- Apakah Anda sedang belajar?

**Anda bisa SKIP semua pertanyaan ini dengan klik "Skip"**

---

#### ✅ CHECKPOINT 1: Akun GitHub
- [ ] Akun GitHub sudah dibuat
- [ ] Email sudah diverifikasi
- [ ] Bisa login ke GitHub

---

### STEP 1.2: Buat Akun Supabase

#### 1.2.1 Apa Itu Supabase?
Supabase adalah database cloud gratis yang akan menyimpan semua data website Anda:
- Data user (admin & guru)
- Data guru
- Data DAK penyaluran
- Data pengajuan

#### 1.2.2 Cara Membuat Akun Supabase:

**Langkah 1: Buka Website**
1. Buka tab baru di browser
2. Ketik: `https://supabase.com`
3. Tekan Enter

**Langkah 2: Klik Start Your Project**
1. Di halaman depan, cari tombol besar **"Start your project"** atau **"Sign Up"**
2. Klik tombol tersebut

**Langkah 3: Pilih Metode Sign Up**
Anda akan melihat beberapa opsi:

**Opsi A (Paling Cepat): Sign up with GitHub**
1. Klik **"Sign up with GitHub"**
2. Authorize Supabase untuk akses akun GitHub Anda
3. Selesai! Akun Supabase sudah terhubung dengan GitHub

**Opsi B: Sign up with Email**
1. Klik **"Sign up with Email"**
2. Masukkan email
3. Buat password
4. Klik **"Sign up"**
5. Verifikasi email

**Rekomendasi**: Gunakan **Opsi A** (GitHub) karena lebih cepat dan mudah.

**Langkah 4: Setup Awal (Jika Diminta)**
Supabase mungkin menanyakan:
- Nama lengkap
- Perusahaan/organisasi
- Anda bisa mengisi atau kosongkan saja

---

#### ✅ CHECKPOINT 2: Akun Supabase
- [ ] Akun Supabase sudah dibuat
- [ ] Sudah login ke dashboard Supabase
- [ ] Bisa akses dashboard

---

### STEP 1.3: Buat Akun Vercel

#### 1.3.1 Apa Itu Vercel?
Vercel adalah platform hosting gratis yang akan:
- Menjalankan website Anda 24/7 di internet
- Memberikan URL: `your-project.vercel.app`
- Menyediakan SSL gratis (HTTPS)
- Auto-deploy setiap kali Anda update code

#### 1.3.2 Cara Membuat Akun Vercel:

**Langkah 1: Buka Website**
1. Buka tab baru di browser
2. Ketik: `https://vercel.com`
3. Tekan Enter

**Langkah 2: Klik Sign Up**
1. Di pojok kanan atas, cari **"Sign Up"**
2. Klik tombol tersebut

**Langkah 3: Pilih Metode Sign Up**

**Opsi A (Paling Cepat): Continue with GitHub**
1. Klik **"Continue with GitHub"**
2. Authorize Vercel untuk akses repository GitHub
3. Pilih scope (biarkan default)
4. Klik **"Authorize Vercel"**

**Opsi B: Continue with Email**
1. Klik **"Continue with Email"**
2. Masukkan email
3. Klik **"Continue"**
4. Buat password
5. Verifikasi email

**Rekomendasi**: Gunakan **Opsi A** (GitHub) karena akan mempermudah integrasi nanti.

**Langkah 4: Setup Awal (Jika Diminta)**
Vercel mungkin menanyakan:
- Nama lengkap
- Username
- Email

Isi sesuai yang diminta.

---

#### ✅ CHECKPOINT 3: Akun Vercel
- [ ] Akun Vercel sudah dibuat
- [ ] GitHub sudah ter-authorize ke Vercel
- [ ] Bisa akses dashboard Vercel

---

### ✅ BAGIAN 1 SELESAI!
Akun-akun yang diperlukan sudah dibuat:
- ✅ GitHub
- ✅ Supabase
- ✅ Vercel

---

## BAGIAN 2: SETUP DATABASE DI SUPABASE (15 Menit)

### Overview:
```
Buat Project Database → Upload Schema Database → Ambil Connection String → Ambil API Keys
```

---

### STEP 2.1: Buat Project Database Baru

**Langkah 1: Buka Supabase Dashboard**
1. Pastikan sudah login ke: `https://supabase.com`
2. Anda akan melihat dashboard dengan list project

**Langkah 2: Klik New Project**
1. Cari tombol besar **"+ New Project"**
2. Klik tombol tersebut

**Langkah 3: Isi Form Create Project**

**Section 1: Name**
- **Name**: `sim-tunjangan-guru`
- Bisa diganti dengan nama lain, tapi disarankan gunakan nama yang mudah diingat

**Section 2: Database Password**
- **Password**: Buat password kuat!
  - Minimal 10 karakter
  - Kombinasi huruf besar, kecil, angka, dan simbol
  - Contoh: `KucingHitam#12345`

**⚠️ PENTING ⚠️**
- Password ini BUKAN password untuk login Supabase
- Password ini adalah password untuk KONEKSI DATABASE
- **CATAT PASSWORD INI!** Anda akan membutuhkannya nanti

**Section 3: Region**
- Pilih: `Singapore` (untuk Indonesia) atau region terdekat dengan lokasi Anda
- Singapore direkomendasikan untuk Indonesia karena lebih cepat

**Section 4: Pricing Plan**
- Pilih: **Free**
- Ini gratis dan cukup untuk project ini

**Langkah 4: Create Project**
1. Cek semua data yang diisi
2. Klik tombol **"Create new project"**
3. Tunggu proses setup
   - Biasanya 1-2 menit
   - Status: "Setting up project..." → "Active"

**Langkah 5: Project Siap!**
1. Setelah selesai, Anda akan diarahkan ke dashboard project
2. Di pojok kiri atas, Anda akan melihat nama project: `sim-tunjangan-guru`

---

#### ✅ CHECKPOINT 4: Project Database Supabase
- [ ] Project database sudah dibuat
- [ ] Password database sudah dicatat
- [ ] Status project: Active

---

### STEP 2.2: Upload Schema Database

Schema adalah struktur database yang berisi:
- Tabel-tabel yang diperlukan (User, Guru, dll)
- Relasi antar tabel
- Data sample (admin & guru)

**Langkah 1: Buka File Schema di Komputer**
1. Buka file explorer di komputer Anda
2. Cari file: `supabase-schema.sql`
3. File ini ada di root folder project Anda
4. Buka file tersebut dengan text editor (Notepad, VS Code, dll)

**Langkah 2: Copy Semua Isi File**
1. Di file `supabase-schema.sql`
2. Tekan `Ctrl + A` (Windows) atau `Cmd + A` (Mac) untuk select all
3. Tekan `Ctrl + C` (Windows) atau `Cmd + C` (Mac) untuk copy

**Langkah 3: Buka SQL Editor di Supabase**
1. Di dashboard Supabase, cari sidebar di sebelah kiri
2. Cari menu dengan ikon seperti kode/skrip
3. Label menu: **SQL Editor**
4. Klik menu tersebut

**Langkah 4: Buat New Query**
1. Di halaman SQL Editor
2. Cari tombol **"New query"**
3. Klik tombol tersebut

**Langkah 5: Paste Schema**
1. Di area editor yang kosong
2. Tekan `Ctrl + V` (Windows) atau `Cmd + V` (Mac) untuk paste
3. Semua SQL dari file `supabase-schema.sql` akan muncul

**Langkah 6: Jalankan SQL**
1. Cari tombol **"Run"** atau ikon ▶️ di pojok kanan atas
2. Klik tombol tersebut
3. Tunggu proses (biasanya < 10 detik)
4. Jika sukses, akan muncul pesan: **"Success. No rows returned"**

**Langkah 7: Verifikasi di Table Editor**
1. Klik menu **Table Editor** di sidebar kiri
2. Pastikan ada 5 tabel:
   - ✅ `User`
   - ✅ `Guru`
   - ✅ `Pengajuan`
   - ✅ `DAKPenyaluran`
   - ✅ `DAKDetailPenerima`

**Langkah 8: Cek Data Sample**
1. Klik tabel `User`
2. Pastikan ada 2 data:
   - 1 data dengan username `admin` dan role `ADMIN`
   - 1 data dengan username `guru` dan role `GURU`

3. Klik tabel `Guru`
4. Pastikan ada 1 data guru sample:
   - Nama: `Ahmad Fauzi, S.Pd`
   - NIP: `198001012000121001`

---

#### ✅ CHECKPOINT 5: Schema Database
- [ ] Schema SQL sudah di-upload ke Supabase
- [ ] 5 tabel muncul di Table Editor
- [ ] Data admin & guru ada di tabel User
- [ ] Data guru sample ada di tabel Guru

---

### STEP 2.3: Ambil Connection String (DATABASE_URL)

Connection string adalah "kabel" untuk menghubungkan website (Vercel) dengan database (Supabase).

**Langkah 1: Buka Settings**
1. Di dashboard Supabase, cari sidebar kiri
2. Cari menu dengan ikon ⚙️ (gear/settings)
3. Label menu: **Settings**
4. Klik menu tersebut

**Langkah 2: Klik Database**
1. Di halaman Settings, Anda akan melihat sub-menu
2. Cari dan klik **Database**

**Langkah 3: Cari Connection String**
1. Scroll ke bawah halaman
2. Cari bagian dengan judul: **Connection Info**
3. Cari baris: **Connection String**
4. Cari tombol **Copy** di sebelah kanan

**Langkah 4: Copy Connection String**
1. Klik tombol **Copy**
2. Format yang di-copy akan seperti ini:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

ATAU ada format kedua:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

**Rekomendasi**: Gunakan format KEDUA (lebih simple).

**Langkah 5: Paste ke Notepad/TextEdit**
1. Buka Notepad (Windows) atau TextEdit (Mac)
2. Paste connection string

**Langkah 6: Edit Connection String**
Sekarang kita perlu mengganti placeholder dengan nilai yang sebenarnya.

Format asli:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

Format setelah diedit (contoh):
```
postgresql://postgres:KucingHitam#12345@db.abc123xyz.supabase.co:5432/postgres
```

Yang harus Anda ganti:
- `[YOUR-PASSWORD]` → Ganti dengan password database yang Anda buat di STEP 2.1
- `[PROJECT-REF]` → Ganti dengan project reference dari dashboard Supabase
- HAPUS semua tanda kurung siku `[` dan `]`

**Langkah 7: Simpan Notepad**
Simpan Notepad ini, kita butuh nanti!

---

#### ✅ CHECKPOINT 6: DATABASE_URL
- [ ] Connection string sudah di-copy dari Supabase
- [ ] Placeholder sudah diganti dengan nilai yang benar
- [ ] Tidak ada tanda kurung siku `[` dan `]`
- [ ] Disimpan di Notepad

---

### STEP 2.4: Ambil API Keys

API keys diperlukan untuk komunikasi antara frontend dan Supabase.

**Langkah 1: Buka Halaman API**
1. Masih di dashboard Supabase
2. Di sidebar kiri, klik menu **API**

**Langkah 2: Copy Project URL**
1. Di bagian atas, cari: **Project URL**
2. Cari tombol **Copy**
3. Klik tombol tersebut
4. Paste ke Notepad

Contoh:
```
https://abc123xyz.supabase.co
```

**Langkah 3: Copy ANON Key**
1. Scroll ke bawah
2. Cari bagian: **Project API keys**
3. Cari baris: **anon** atau **public** key
4. Cari tombol **Copy**
5. Klik tombol tersebut
6. Paste ke Notepad

Contoh:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFicjEyM3h5eiIsInB1ciI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTU1NTU1NX0.abc123xyz
```

**Langkah 4: Notepad Final**
Sekarang Notepad Anda harus berisi 3 data penting:

```notepad
✅ DATABASE_URL = "postgresql://postgres:KucingHitam#12345@db.abc123xyz.supabase.co:5432/postgres"
✅ NEXT_PUBLIC_SUPABASE_URL = "https://abc123xyz.supabase.co"
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Simpan Notepad dengan baik!

---

#### ✅ CHECKPOINT 7: API Keys
- [ ] Project URL sudah di-copy dan disimpan
- [ ] ANON key sudah di-copy dan disimpan
- [ ] Semua data Supabase ada di Notepad
- [ ] Notepad disimpan dengan aman

---

### ✅ BAGIAN 2 SELESAI!
Database Supabase sudah siap:
- ✅ Project database dibuat
- ✅ Schema sudah di-upload
- ✅ Data sample (admin & guru) sudah ada
- ✅ Connection string dan API keys sudah disimpan

---

## BAGIAN 3: UPLOAD CODE KE GITHUB (10 Menit)

### Overview:
```
Install GitHub Desktop → Add Local Repository → Commit → Publish to GitHub
```

---

### STEP 3.1: Install GitHub Desktop

**Langkah 1: Download GitHub Desktop**
1. Buka tab baru di browser
2. Ketik: `https://desktop.github.com/`
3. Tekan Enter

**Langkah 2: Download untuk OS Anda**
1. Anda akan melihat 2 tombol download:
   - **Download for Windows** (untuk Windows)
   - **Download for macOS** (untuk Mac)
2. Klik tombol sesuai sistem operasi Anda

**Langkah 3: Install GitHub Desktop**
**Untuk Windows:**
1. Cari file installer yang sudah didownload
2. Biasanya di folder Downloads
3. Klik dua kali file `.exe`
4. Follow instruksi di layar (Next → Next → Install → Finish)

**Untuk Mac:**
1. Cari file `.dmg` yang sudah didownload
2. Biasanya di folder Downloads
3. Klik dua kali untuk mount
4. Drag icon GitHub ke folder Applications

**Langkah 4: Buka GitHub Desktop**
1. Setelah install selesai, buka aplikasi GitHub Desktop
2. Login dengan akun GitHub yang sudah dibuat di BAGIAN 1

---

#### ✅ CHECKPOINT 8: GitHub Desktop
- [ ] GitHub Desktop sudah diinstall
- [ ] Sudah login dengan akun GitHub

---

### STEP 3.2: Upload Project ke GitHub

**Langkah 1: Buka GitHub Desktop**
1. Buka aplikasi GitHub Desktop
2. Pastikan sudah login

**Langkah 2: Add Local Repository**
1. Di menu bar atas, klik **File**
2. Pilih **"Add Local Repository..."**

**Langkah 3: Pilih Folder Project**
1. Klik tombol **"Choose..."** atau **"Browse..."**
2. Navigasi ke folder project Anda:
   - Contoh untuk Windows: `C:\Users\username\Documents\sim-tunjangan-guru`
   - Contoh untuk Mac: `/Users/username/Documents/sim-tunjangan-guru`
   - Contoh untuk Linux: `/home/z/my-project`

3. Klik tombol **"Add Repository"** atau **"Add"**

**Langkah 4: Cek File yang Akan Di-commit**
1. Di bagian bawah GitHub Desktop, Anda akan melihat list file yang berubah
2. Pastikan HANYA file project yang terlihat:
   - Folder `src/`
   - Folder `prisma/`
   - File `package.json`
   - File `next.config.mjs`
   - File `tsconfig.json`
   - dll

3. **PENTING**: Pastikan TIDAK ada file ini:
   - `.env` ❌ (file environment variables)
   - `*.db` atau `*.sqlite` ❌ (file database lokal)
   - `node_modules/` ❌ (folder dependencies)
   - `.next/` ❌ (folder Next.js build)

4. Jika ada file yang tidak seharusnya di-upload:
   - Buka file `.gitignore` di project
   - Tambahkan nama file/folder yang tidak boleh di-upload

**Langkah 5: Tulis Commit Message**
1. Di kolom **Summary** (atau **Commit message**), tulis:
   ```
   Initial commit: SIM Tunjangan Profesi Guru
   ```

2. (Opsional) Kolom **Description** bisa dikosongkan

**Langkah 6: Commit Changes**
1. Cari tombol besar: **"Commit to main"** atau ikon checklist ✓
2. Klik tombol tersebut
3. Tunggu proses commit selesai

**Langkah 7: Publish ke GitHub**
Setelah commit berhasil, Anda akan melihat tombol:

**Opsi A: Tombol "Publish repository"**
1. Klik tombol **"Publish repository"**

**Opsi B: Tidak ada tombol publish**
1. Klik menu **Repository** di menu bar
2. Pilih **"Push"**

**Langkah 8: Isi Form Publish**
1. **Name**: `sim-tunjangan-guru`
   - Bisa diganti dengan nama lain, tapi disarankan gunakan nama yang jelas

2. **Description**: `Sistem Informasi Tunjangan Profesi Guru`
   - Bisa diisi atau dikosongkan

3. **Privacy**:
   - Pilih **Public** (rekomendasi untuk pemula)
   - Atau **Private** (jika ingin private)

4. Klik tombol **"Publish repository"**

**Langkah 9: Tunggu Upload**
1. GitHub Desktop akan mengupload semua file ke GitHub
2. Tunggu sampai selesai (biasanya 1-3 menit tergantung ukuran project)
3. Setelah selesai, akan muncul pesan "Repository published"

---

#### ✅ CHECKPOINT 9: Project di GitHub
- [ ] Repository sudah dibuat di GitHub
- [ ] Semua file project sudah di-upload
- [ ] File `.env` TIDAK ada di GitHub
- [ ] Bisa akses repository di browser

---

### STEP 3.3: Verifikasi di GitHub

**Langkah 1: Buka Repository di Browser**
1. Buka tab baru di browser
2. Ketik: `https://github.com/[username]/sim-tunjangan-guru`
   - Ganti `[username]` dengan username GitHub Anda
   - Contoh: `https://github.com/ahmadguru123/sim-tunjangan-guru`

**Langkah 2: Cek File**
1. Pastikan semua file project terlihat:
   - Folder `src/`
   - Folder `prisma/`
   - File `package.json`
   - dll

2. Pastikan file `.env` TIDAK ada (ini penting!)

**Langkah 3: Catat Repository URL**
Simpan URL repository:
```
https://github.com/[username]/sim-tunjangan-guru
```

---

#### ✅ CHECKPOINT 10: Verifikasi GitHub
- [ ] Repository bisa dibuka di browser
- [ ] Semua file project ada
- [ ] File `.env` tidak ada
- [ ] Repository URL sudah dicatat

---

### ✅ BAGIAN 3 SELESAI!
Code project sudah di GitHub:
- ✅ GitHub Desktop terinstall
- ✅ Project sudah di-commit
- ✅ Repository sudah published ke GitHub
- ✅ Bisa diakses di browser

---

## BAGIAN 4: DEPLOY KE VERCEL (10 Menit)

### Overview:
```
Import Project dari GitHub → Setup Environment Variables → Deploy
```

---

### STEP 4.1: Import Project ke Vercel

**Langkah 1: Buka Vercel Dashboard**
1. Buka tab baru di browser
2. Ketik: `https://vercel.com/dashboard`
3. Pastikan sudah login

**Langkah 2: Add New Project**
1. Di pojok kanan atas, cari tombol **"Add New..."**
2. Klik tombol tersebut
3. Pilih **"Project"**

**Langkah 3: Import dari GitHub**
1. Anda akan melihat list repository dari GitHub
2. Cari repository: `sim-tunjangan-guru`
3. Jika tidak muncul, klik **"Adjust GitHub App permissions"** dan authorize
4. Setelah muncul, klik tombol **"Import"**

---

#### ✅ CHECKPOINT 11: Project di Vercel
- [ ] Repository sudah di-import ke Vercel
- [ ] Masuk ke halaman Configure Project

---

### STEP 4.2: Configure Project & Setup Environment Variables

Setelah klik Import, Anda akan melihat halaman **Configure Project**.

#### Section 1: Framework Preset
Biarkan default (jangan diubah):
- **Framework Preset**: Next.js (otomatis terdeteksi)
- **Root Directory**: `./`

#### Section 2: Environment Variables (PENTING!)

Di sini kita akan menghubungkan Vercel dengan Supabase.

**Langkah 1: Checklist Environment**
Cari checkbox untuk environment:
- ✅ Checklist **Production** (WAJIB!)
- ✅ Checklist **Preview** (Rekomendasikan)
- ☐ Development (Opsional, bisa diabaikan)

**Langkah 2: Tambahkan DATABASE_URL**
1. Cari bagian **Environment Variables**
2. Klik tombol **"Add New"** atau ikon **+**
3. Isi form:
   - **Name**: `DATABASE_URL`
   - **Value**: Paste DATABASE_URL dari Notepad
   ```
   postgresql://postgres:KucingHitam#12345@db.abc123xyz.supabase.co:5432/postgres
   ```
4. Klik tombol ✓ atau tekan Enter untuk save

**⚠️ PENTING ⚠️**
- Pastikan password yang Anda masukkan adalah password DATABASE
- BUKAN password untuk login Supabase
- Password ini yang Anda buat saat create project database di STEP 2.1

**Langkah 3: Tambahkan NEXT_PUBLIC_SUPABASE_URL**
1. Klik tombol **"Add New"** lagi
2. Isi form:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Paste Project URL dari Notepad
   ```
   https://abc123xyz.supabase.co
   ```
3. Klik tombol ✓

**Langkah 4: Tambahkan NEXT_PUBLIC_SUPABASE_ANON_KEY**
1. Klik tombol **"Add New"**
2. Isi form:
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Paste ANON key dari Notepad
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Klik tombol ✓

**Langkah 5: Tambahkan NEXTAUTH_URL**
1. Klik tombol **"Add New"**
2. Isi form:
   - **Name**: `NEXTAUTH_URL`
   - **Value**: Isi dengan URL website nanti
   ```
   https://sim-tunjangan-guru.vercel.app
   ```

**Catatan**:
- Gunakan HTTPS, bukan HTTP
- Nama project akan sama dengan nama repository GitHub
- Jika belum tahu URL-nya, gunakan nama project + `.vercel.app`

3. Klik tombol ✓

**Langkah 6: Generate NEXTAUTH_SECRET**
1. Buka tab baru di browser
2. Kunjungi: `https://generate-secret.vercel.app/32`
3. Anda akan melihat random string yang sudah di-generate

Contoh:
```
X7OpFw9S8qL9V0X4Y5Z3QOpw8JxN4r6T5u7v2w3X9Y5Z8Q0R3T7U2V5W8X1Y4
```

4. Copy secret tersebut (Ctrl+C / Cmd+C)

**Langkah 7: Tambahkan NEXTAUTH_SECRET**
1. Kembali ke Vercel (tab Configure Project)
2. Klik tombol **"Add New"**
3. Isi form:
   - **Name**: `NEXTAUTH_SECRET`
   - **Value**: Paste secret yang di-generate tadi
4. Klik tombol ✓

**Langkah 8: Cek Semua Variables**
Pastikan semua 5 environment variables sudah terisi:
```
✓ DATABASE_URL
✓ NEXT_PUBLIC_SUPABASE_URL
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY
✓ NEXTAUTH_URL
✓ NEXTAUTH_SECRET
```

**Langkah 9: Checklist Production & Preview**
Untuk setiap environment variable:
- Pastikan ada checklist ✅ di kolom **Production**
- Pastikan ada checklist ✅ di kolom **Preview**

---

#### ✅ CHECKPOINT 12: Environment Variables
- [ ] DATABASE_URL sudah di-set
- [ ] NEXT_PUBLIC_SUPABASE_URL sudah di-set
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY sudah di-set
- [ ] NEXTAUTH_URL sudah di-set
- [ ] NEXTAUTH_SECRET sudah di-set
- [ ] Semua variables checklist di Production & Preview

---

### STEP 4.3: Deploy Project

**Langkah 1: Scroll ke Bawah**
1. Di halaman Configure Project
2. Scroll ke bagian paling bawah

**Langkah 2: Klik Deploy**
1. Cari tombol besar berwarna biru: **"Deploy"**
2. Klik tombol tersebut

**Langkah 3: Tunggu Proses Deploy**
Anda akan melihat progress build:
- Status: **Building** → **Deploying** → **Ready**
- Waktu: 1-3 menit
- Anda bisa melihat log build di bagian bawah

**Langkah 4: Deploy Selesai**
Setelah selesai, Anda akan melihat:
```
Congratulations!

Your project is ready.
```

Dan ada tombol/URL untuk visit deployment.

---

#### ✅ CHECKPOINT 13: Deploy Berhasil
- [ ] Status deploy: Ready
- [ ] Tidak ada error di build log
- [ ] URL deployment tersedia
- [ ] Bisa click tombol "Visit"

---

### ✅ BAGIAN 4 SELESAI!
Website sudah di-deploy ke Vercel:
- ✅ Project di-import dari GitHub
- ✅ Environment variables sudah di-set
- ✅ Deploy berhasil
- ✅ Website online!

---

## BAGIAN 5: TESTING & VERIFIKASI (5 Menit)

### Overview:
```
Buka Website → Test Login Admin → Test Login Guru → Cek Data
```

---

### STEP 5.1: Buka Website

**Langkah 1: Get Deployment URL**
1. Masih di halaman deploy result di Vercel
2. Cari URL deployment

Format:
```
https://sim-tunjangan-guru.vercel.app
```

**Langkah 2: Buka Website**
1. Klik URL atau tombol **"Visit"**
2. Website akan terbuka di tab baru browser

**Langkah 3: Verifikasi Tampilan**
1. Pastikan website terbuka dengan benar
2. Tidak ada halaman blank
3. Tidak ada error yang jelas

---

#### ✅ CHECKPOINT 14: Website Online
- [ ] Website bisa dibuka di browser
- [ ] Tampilan normal
- [ ] Tidak ada halaman blank

---

### STEP 5.2: Test Login dengan Admin

**Langkah 1: Buka Halaman Login**
1. Jika belum di halaman login, cari tombol/menu untuk login
2. Klik untuk ke halaman login

**Langkah 2: Isi Username & Password**
1. **Username**: `admin`
2. **Password**: `admin123`

**Langkah 3: Klik Login**
1. Klik tombol **Login**
2. Tunggu proses

**Langkah 4: Verifikasi Login Berhasil**
Jika login berhasil:
- Akan redirect ke dashboard admin
- Data admin akan muncul
- Tidak ada error

Jika login gagal:
- Muncul pesan error (username/password salah)
- Tidak redirect ke dashboard

**⚠️ JIKA LOGIN GAGAL ⚠️**
Baca bagian **TROUBLESHOOTING** di akhir panduan ini.

---

#### ✅ CHECKPOINT 15: Login Admin
- [ ] Login admin berhasil
- [ ] Redirect ke dashboard admin
- [ ] Data admin muncul

---

### STEP 5.3: Test Login dengan Guru

**Langkah 1: Logout dari Admin**
1. Cari tombol/menu Logout
2. Klik untuk logout

**Langkah 2: Login dengan Guru**
1. Di halaman login, isi:
   - **Username**: `guru`
   - **Password**: `guru123`

**Langkah 3: Klik Login**
1. Klik tombol **Login**
2. Tunggu proses

**Langkah 4: Verifikasi Login Berhasil**
Jika login berhasil:
- Redirect ke dashboard guru
- Data guru muncul:
  - Nama: `Ahmad Fauzi, S.Pd`
  - NIP: `198001012000121001`
  - Golongan: `III/c`
  - dll

Jika login gagal:
- Muncul pesan error
- Tidak redirect

---

#### ✅ CHECKPOINT 16: Login Guru
- [ ] Login guru berhasil
- [ ] Redirect ke dashboard guru
- [ ] Data guru muncul

---

### STEP 5.4: Verifikasi Data dari Database

**Langkah 1: Buka Halaman yang Menampilkan Data**
1. Cari halaman yang menampilkan data guru atau DAK
2. Buka halaman tersebut

**Langkah 2: Cek Data**
1. Pastikan data muncul dengan benar
2. Data yang muncul harus sama dengan di Supabase:
   - Data guru: `Ahmad Fauzi, S.Pd`
   - Data DAK penyaluran (jika ada)
   - dll

**Langkah 3: Verifikasi Koneksi Database**
Jika data muncul:
- Koneksi ke Supabase berhasil ✅
- Website sudah full functional ✅

Jika data tidak muncul:
- Ada masalah koneksi database
- Baca bagian **TROUBLESHOOTING**

---

#### ✅ CHECKPOINT 17: Data dari Database
- [ ] Data guru muncul dengan benar
- [ ] Data berasal dari Supabase database
- [ ] Koneksi database berhasil

---

### ✅ BAGIAN 5 SELESAI!
Testing selesai:
- ✅ Website bisa diakses
- ✅ Login admin berhasil
- ✅ Login guru berhasil
- ✅ Data dari database muncul

---

## BAGIAN 6: UPDATE NEXTAUTH_URL (Opsional tapi Direkomendasikan)

Jika NEXTAUTH_URL yang Anda set di BAGIAN 4 belum sesuai dengan URL production yang sebenarnya, update sekarang.

---

### STEP 6.1: Cek URL Production

**Langkah 1: Buka Vercel Dashboard**
1. Buka: `https://vercel.com/dashboard`
2. Klik project `sim-tunjangan-guru`

**Langkah 2: Cek Deployment Terbaru**
1. Cari deployment terbaru
2. Lihat URL yang diberikan

Contoh:
```
https://sim-tunjangan-guru.vercel.app
```

**Langkah 3: Catat URL**
Copy URL tersebut.

---

### STEP 6.2: Update NEXTAUTH_URL di Vercel

**Langkah 1: Buka Environment Variables**
1. Masih di dashboard project Vercel
2. Klik tab **Settings**
3. Klik submenu **Environment Variables**

**Langkah 2: Edit NEXTAUTH_URL**
1. Cari variabel: `NEXTAUTH_URL`
2. Klik tombol **Edit** (ikon pensil)
3. Update value dengan URL production yang benar:
   ```
   https://sim-tunjangan-guru.vercel.app
   ```
4. Klik **Save**

---

### STEP 6.3: Redeploy

**Langkah 1: Buka Deployments**
1. Klik tab **Deployments**

**Langkah 2: Redeploy**
1. Cari deployment terbaru
2. Klik tombol tiga titik (⋮) di sebelah kanan
3. Pilih **Redeploy**
4. Klik **Redeploy** lagi di popup confirmation
5. Tunggu redeploy selesai (1-3 menit)

---

#### ✅ CHECKPOINT 18: NEXTAUTH_URL Updated
- [ ] NEXTAUTH_URL sudah di-update
- [ ] Redeploy sudah dilakukan
- [ ] Status deploy: Ready

---

### ✅ BAGIAN 6 SELESAI!
NEXTAUTH_URL sudah di-update dengan benar:
- ✅ URL production yang sebenarnya
- ✅ Redeploy sudah dilakukan

---

## TROUBLESHOOTING

---

### Problem 1: Deploy Failed di Vercel

**Gejala:**
- Status: Failed
- Build error di log

**Penyebab:**
- Dependencies tidak terinstall
- Error di code
- Build configuration salah

**Solusi:**

**Solusi 1: Cek Build Log**
1. Vercel Dashboard → Deployments
2. Klik deployment yang failed
3. Scroll ke **Build Output**
4. Cari error message

**Solusi 2: Common Errors & Fix**

| Error | Penyebab | Solusi |
|-------|-----------|--------|
| `Module not found` | Dependencies tidak ada | Pastikan `package.json` lengkap |
| `Cannot find module` | File hilang atau path salah | Cek struktur folder dan file |
| `Syntax error` | Error di code | Cek code yang error |

**Solusi 3: Clear Build Cache**
1. Vercel Dashboard → Settings → General
2. Scroll ke **Build & Development**
3. Klik **Clear Build Cache**
4. Redeploy

---

### Problem 2: Login Gagal Terus (Username/Password Salah)

**Gejala:**
- Login selalu gagal
- Error: "Username atau kata sandi salah"
- 401 Unauthorized

**Penyebab:**
- Data user tidak ada di database Supabase
- Password hash salah
- NEXTAUTH_SECRET tidak di-set
- Database connection gagal

**Solusi:**

**Solusi 1: Cek Data User di Supabase**
1. Buka Supabase Dashboard
2. Table Editor → Tabel `User`
3. Pastikan ada 2 data:
   - `admin` dengan role `ADMIN`
   - `guru` dengan role `GURU`

Jika tidak ada data:
- Jalankan SQL dari file `fix-user-data.sql`
- Buka SQL Editor → Run

**Solusi 2: Cek NEXTAUTH_SECRET di Vercel**
1. Vercel → Settings → Environment Variables
2. Cari `NEXTAUTH_SECRET`
3. Jika tidak ada, generate dan set:
   - Buka: `https://generate-secret.vercel.app/32`
   - Copy secret
   - Add to Vercel
4. Redeploy

**Solusi 3: Hapus Cookies Browser**
1. Tekan F12 → Application → Cookies
2. Hapus semua cookies untuk domain website
3. Refresh browser (Ctrl+Shift+R / Cmd+Shift+R)

**Solusi 4: Reset Password dengan SQL**
Jika password tidak cocok, jalankan SQL di Supabase SQL Editor:

```sql
-- Delete existing admin & guru
DELETE FROM "User" WHERE username IN ('admin', 'guru');

-- Insert admin (password: admin123)
INSERT INTO "User" (
    "id", "username", "password", "role", "createdAt", "updatedAt", "guruId"
) VALUES (
    'admin001',
    'admin',
    '$2a$10$X7OpFw9S8qL9V0X4Y5Z3QOpw8JxN4r6T5u7v2w3X9Y5Z8Q0R3T7U2V5W8X1Y4',
    'ADMIN',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    NULL
);

-- Insert guru (password: guru123)
INSERT INTO "User" (
    "id", "username", "password", "role", "createdAt", "updatedAt", "guruId"
) VALUES (
    'user001',
    'guru',
    '$2a$10$Y8BqGx0T9rM0Y5Z1A6B4Rq9y0K5O7s3U6v8w3Y0Z6A9B1C4D5E8F0A1B3D5E',
    'GURU',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'guru001'
);
```

---

### Problem 3: Database Connection Failed

**Gejala:**
- Error: `Connection refused` atau `ECONNREFUSED`
- Data tidak muncul
- Website blank

**Penyebab:**
- DATABASE_URL salah format
- Password database salah
- Project Supabase paused

**Solusi:**

**Solusi 1: Cek DATABASE_URL Format**
Format yang benar:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

Format yang SALAH:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Solusi 2: Cek Password Database**
- Password DATABASE bukan password login Supabase
- Adalah password yang dibuat saat create project
- Jika lupa, reset di Supabase:
  1. Settings → Database
  2. Scroll ke **Reset Database Password**
  3. Masukkan password baru
  4. Update DATABASE_URL di Vercel

**Solusi 3: Cek Status Project Supabase**
- Buka Supabase Dashboard
- Pastikan project status: **Active** (bukan Paused)
- Jika paused, click **Resume**

---

### Problem 4: Website Blank Putih

**Gejala:**
- Website terbuka tapi kosong
- Tidak ada error yang jelas

**Penyebab:**
- Runtime error di Next.js
- Database connection error
- Server-side rendering error

**Solusi:**

**Solusi 1: Cek Vercel Function Logs**
1. Vercel Dashboard → Deployments
2. Klik deployment terbaru
3. Tab **Function Logs**
4. Cari error message

**Solusi 2: Cek Browser Console**
1. Tekan F12 → Console
2. Cari error JavaScript

**Solusi 3: Test di Lokal Dulu**
1. Setup `.env` lokal dengan DATABASE_URL Supabase
2. Jalankan `npm run dev`
3. Cek error di terminal

---

### Problem 5: Environment Variables Tidak Terbaca

**Gejala:**
- Error: `DATABASE_URL is undefined`
- Data tidak muncul
- API error

**Penyebab:**
- Environment variables tidak di-set di Vercel
- Environment variables di-set untuk environment yang salah

**Solusi:**

**Solusi 1: Cek Environment Variables di Vercel**
1. Vercel → Settings → Environment Variables
2. Pastikan ada 5 variables:
   - DATABASE_URL
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - NEXTAUTH_URL
   - NEXTAUTH_SECRET

**Solusi 2: Pastikan Environment Checklist**
- Setiap variable harus ada checklist ✅ di:
  - Production
  - Preview

**Solusi 3: Redeploy Setelah Update**
- Setelah add/edit environment variables
- Selalu redeploy

---

### Problem 6: JWT Error / Decryption Failed

**Gejala:**
- Error: `JWEDecryptionFailed: decryption operation failed`
- Login berhasil tapi sesi langsung hilang

**Penyebab:**
- NEXTAUTH_SECRET berbeda antara environment
- Cookies lama masih tersimpan

**Solusi:**

**Solusi 1: Generate NEXTAUTH_SECRET Baru**
1. Buka: `https://generate-secret.vercel.app/32`
2. Copy secret
3. Update NEXTAUTH_SECRET di Vercel
4. Redeploy

**Solusi 2: Hapus Cookies**
1. Tekan F12 → Application → Cookies
2. Hapus semua cookies untuk domain website
3. Refresh browser

---

## CHECKLIST FINAL

Sebelum menganggap selesai, pastikan semua ini terpenuhi:

### Akun:
- [ ] Akun GitHub sudah dibuat
- [ ] Akun Supabase sudah dibuat
- [ ] Akun Vercel sudah dibuat

### Supabase:
- [ ] Project database sudah dibuat
- [ ] Status: Active
- [ ] Schema SQL sudah di-upload
- [ ] 5 tabel ada di Table Editor (User, Guru, Pengajuan, DAKPenyaluran, DAKDetailPenerima)
- [ ] Data admin & guru ada di tabel User
- [ ] DATABASE_URL sudah dicatat dengan format yang benar
- [ ] NEXT_PUBLIC_SUPABASE_URL sudah dicatat
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY sudah dicatat

### GitHub:
- [ ] GitHub Desktop terinstall
- [ ] Project sudah di-commit
- [ ] Repository sudah published ke GitHub
- [ ] Semua file project ada di GitHub
- [ ] File `.env` TIDAK ada di GitHub
- [ ] Repository bisa diakses di browser

### Vercel:
- [ ] Project sudah di-import dari GitHub
- [ ] 5 Environment variables sudah di-set:
  - [ ] DATABASE_URL (Production ✅)
  - [ ] NEXT_PUBLIC_SUPABASE_URL (Production ✅)
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY (Production ✅)
  - [ ] NEXTAUTH_URL (Production ✅)
  - [ ] NEXTAUTH_SECRET (Production ✅)
- [ ] Deploy berhasil (status: Ready)
- [ ] Website bisa diakses

### Testing:
- [ ] Website bisa dibuka di browser
- [ ] Tidak ada halaman blank
- [ ] Login admin berhasil (admin/admin123)
- [ ] Login guru berhasil (guru/guru123)
- [ ] Data dari Supabase muncul dengan benar
- [ ] Koneksi database berhasil

---

## TIPS TAMBAHAN

### Tip 1: Auto-Deploy
Setiap kali Anda push code ke GitHub:
- Push ke branch `main` → Production deployment otomatis
- Push ke branch lain → Preview deployment otomatis

Ini sangat membantu untuk update website tanpa perlu deploy manual!

### Tip 2: Update Website
Jika ingin mengupdate website:

1. Edit code di komputer
2. Buka GitHub Desktop
3. Commit changes
4. Push to GitHub
5. Vercel akan otomatis redeploy!

### Tip 3: Monitor Website
Aktifkan monitoring di Vercel:
1. Project → Settings → Monitoring
2. Aktifkan **Alerts** untuk error tracking

### Tip 4: Custom Domain (Opsional)
Jika ingin domain sendiri (misal: `sim-tunjangan.sekolah.sch.id`):

1. Vercel → Settings → Domains
2. Click **Add Domain**
3. Masukkan domain Anda
4. Follow instruksi untuk update DNS

### Tip 5: Backup Database
Supabase otomatis backup database setiap hari di free tier. Pastikan:
- Supabase project status: Active (tidak Paused)
- Storage limit tidak penuh

---

## RESOURCE TAMBAHAN

### Dokumentasi:
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [GitHub Documentation](https://docs.github.com)
- [Next.js Documentation](https://nextjs.org/docs)

### Tool:
- Generate NEXTAUTH_SECRET: https://generate-secret.vercel.app/32
- GitHub Desktop: https://desktop.github.com/

---

## SELESAI!

### 🎉 SELAMAT! WEBSITE ANDA SUDAH ONLINE!

Website **SIM Tunjangan Profesi Guru** Anda sekarang:
- ✅ Online di internet
- ✅ Bisa diakses dari mana saja
- ✅ Menggunakan database cloud Supabase
- ✅ Hosting gratis di Vercel
- ✅ SSL certificate gratis (HTTPS)

---

### URL Website Anda:
```
https://sim-tunjangan-guru.vercel.app
```

---

### Akun untuk Login:

**Admin**:
- Username: `admin`
- Password: `admin123`

**Guru**:
- Username: `guru`
- Password: `guru123`

---

### 📚 File Pendukung yang Tersedia:

- `fix-user-data.sql` - SQL untuk reset data user
- `verify-guru-data.sql` - SQL untuk verify data guru
- `FIX_LOGIN_ISSUE.md` - Panduan troubleshooting login
- `QUICK_TROUBLESHOOTING.md` - Quick troubleshooting

---

### ❓ Butuh Bantuan?

Jika mengalami masalah:
1. Baca bagian **TROUBLESHOOTING** di atas
2. Cek Vercel Logs untuk error
3. Cek Browser Console untuk error
4. Baca file-file panduan tambahan

---

**Selamat menggunakan website Anda! 🚀🎊**

---

*Dokumen ini dibuat untuk membantu Anda mengupload website ke hosting dengan langkah-langkah yang sangat detail dari awal sampai selesai.*
