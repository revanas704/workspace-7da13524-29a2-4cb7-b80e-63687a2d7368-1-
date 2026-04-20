# 🚀 Panduan Lengkap: Menghubungkan Supabase ke Vercel

## 📋 Daftar Isi
1. [Persiapan](#1-persiapan)
2. [Mendapatkan Data dari Supabase](#2-mendapatkan-data-dari-supabase)
3. [Setup Environment Variables di Vercel](#3-setup-environment-variables-di-vercel)
4. [Push Code ke GitHub](#4-push-code-ke-github)
5. [Deploy ke Vercel](#5-deploy-ke-vercel)
6. [Verifikasi Deploy Berhasil](#6-verifikasi-deploy-berhasil)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Persiapan

### Checklist Sebelum Mulai:
- [ ] Akun Supabase sudah dibuat
- [ ] Database sudah diupload ke Supabase (menggunakan `supabase-schema.sql`)
- [ ] Akun GitHub sudah ada
- [ ] Akun Vercel sudah ada (atau login dengan GitHub)
- [ ] Project Next.js sudah siap di komputer

### Pastikan File Berikut Tidak Ada di Git:
Pastikan file `.env` dan file database lokal TIDAK diupload ke GitHub.

Buka atau buat file `.gitignore` di root project dan pastikan berisi:
```
# Dependencies
node_modules/

# Environment variables
.env
.env.local
.env.production.local

# Database
*.db
*.sqlite
prisma/migrations/

# Next.js
.next/
out/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
```

---

## 2. Mendapatkan Data dari Supabase

### 2.1 Buka Dashboard Supabase
1. Login ke https://supabase.com
2. Klik pada project yang sudah Anda buat (misal: `sim-tunjangan-guru`)

### 2.2 Mendapatkan DATABASE_URL
1. Di sidebar kiri, klik **Settings** (ikon ⚙️)
2. Klik **Database**
3. Scroll ke bagian **Connection Info**
4. Copy value di bagian **Connection String** dengan format:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
   atau
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

**Catatan**: Gunakan format kedua dengan port `5432` untuk koneksi langsung.

### 2.3 Mendapatkan NEXT_PUBLIC_SUPABASE_URL
1. Di sidebar kiri, klik **Settings**
2. Klik **API**
3. Copy value di bagian **Project URL**
4. Contoh: `https://abc123xyz.supabase.co`

### 2.4 Mendapatkan NEXT_PUBLIC_SUPABASE_ANON_KEY
1. Di halaman yang sama (**Settings → API**)
2. Scroll ke bagian **Project API keys**
3. Copy value di bagian **anon / public** key
4. Contoh: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2.5 Catat Semua Data
Buat catatan di Notepad atau temp lain:

```
✅ DATABASE_URL = "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
✅ NEXT_PUBLIC_SUPABASE_URL = "https://[PROJECT-REF].supabase.co"
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY = "[ANON-KEY-ANDA]"
```

**PENTING**: Jangan share data ini dengan siapapun!

---

## 3. Setup Environment Variables di Vercel

### 3.1 Hubungkan GitHub ke Vercel (Belum perlu Jika Sudah)
1. Buka https://vercel.com
2. Login dengan akun GitHub Anda
3. Klik avatar Anda → **Settings**
4. Klik **GitHub**
5. Klik **Connect GitHub** jika belum terhubung
6. Authorize Vercel untuk mengakses repository Anda

### 3.2 Import Project ke Vercel
1. Di dashboard Vercel, klik **"Add New..."** → **"Project"**
2. Klik **"Continue with GitHub"** atau **"Import Git Repository"**
3. Pilih repository project Anda dari GitHub
4. Klik **"Import"**

### 3.3 Configure Project
Anda akan melihat halaman **Configure Project** dengan form environment variables:

#### Step 1: Framework Preset
- **Framework Preset**: Next.js (otomatis terdeteksi)
- **Root Directory**: `./` (default)

#### Step 2: Environment Variables
Di bagian **Environment Variables**, tambahkan satu per satu:

##### Variabel 1: DATABASE_URL
1. Klik tombol **"Add New"** atau **"+"**
2. **Name**: `DATABASE_URL`
3. **Value**: Paste value DATABASE_URL dari Supabase
4. Klik tombol ✓ atau Enter untuk save

Contoh:
```
Name: DATABASE_URL
Value: postgresql://postgres:Rahasia123@db.abc123xyz.supabase.co:5432/postgres
```

##### Variabel 2: NEXT_PUBLIC_SUPABASE_URL
1. Klik tombol **"Add New"**
2. **Name**: `NEXT_PUBLIC_SUPABASE_URL`
3. **Value**: Paste value dari Supabase
4. Klik tombol ✓

Contoh:
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://abc123xyz.supabase.co
```

##### Variabel 3: NEXT_PUBLIC_SUPABASE_ANON_KEY
1. Klik tombol **"Add New"**
2. **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Value**: Paste ANON key dari Supabase
4. Klik tombol ✓

Contoh:
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

##### Variabel 4: NEXTAUTH_URL
1. Klik tombol **"Add New"**
2. **Name**: `NEXTAUTH_URL`
3. **Value**: Untuk awal, isi dengan `https://your-project.vercel.app`
   - Setelah deploy berhasil, update dengan URL production yang sebenarnya
4. Klik tombol ✓

Contoh:
```
Name: NEXTAUTH_URL
Value: https://sim-tunjangan-guru.vercel.app
```

##### Variabel 5: NEXTAUTH_SECRET
1. Klik tombol **"Add New"**
2. **Name**: `NEXTAUTH_SECRET`
3. **Value**: Generate random string dengan cara:
   - Option 1: Buka https://generate-secret.vercel.app/32
   - Option 2: Jika punya terminal: `openssl rand -base64 32`
   - Option 3: Buat sendiri: `secret-key-random-1234567890abcdef`
4. Copy dan paste ke Value
5. Klik tombol ✓

#### Step 3: Pilih Environment
Pilih di mana environment variables ini akan digunakan:
- ✅ **Production**: (wajib)
- ✅ **Preview**: (direkomendasikan)
- ✅ **Development**: (opsional, jika mau testing di Vercel)

Klik lingkaran/checkbox untuk Production dan Preview.

#### Step 4: Review
Setelah semua environment variables ditambahkan, Anda akan melihat:
```
Environment Variables (5)
✓ DATABASE_URL
✓ NEXT_PUBLIC_SUPABASE_URL
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY
✓ NEXTAUTH_URL
✓ NEXTAUTH_SECRET
```

---

## 4. Push Code ke GitHub

### 4.1 Install GitHub Desktop (Jika Belum Punya)
1. Download: https://desktop.github.com/
2. Install dan login dengan akun GitHub

### 4.2 Upload Project ke GitHub dengan GitHub Desktop

#### Step 1: Buka GitHub Desktop
1. Buka aplikasi GitHub Desktop
2. Klik menu **File** → **Add Local Repository**

#### Step 2: Pilih Folder Project
1. Klik **Choose...** atau **Browse...**
2. Pilih folder project Anda (misal: `/Users/username/Projects/sim-tunjangan-guru`)
3. Klik **Add Repository**

#### Step 3: Atur File yang Akan Di-commit
1. Di panel kiri bawah, Anda akan melihat list file yang berubah
2. Pastikan HANYA file project yang di-upload
3. Pastikan **TIDAK** ada:
   - `.env`
   - `*.db` atau `*.sqlite`
   - `node_modules/`

#### Step 4: Tulis Commit Message
1. Di kolom **Summary** atau **Commit message**, tulis:
   ```
   Initial commit: SIM Tunjangan Profesi Guru
   ```

#### Step 5: Commit
1. Klik tombol **Commit to main** atau **Commit** (ikon checklist ✓)

#### Step 6: Publish ke GitHub
1. Setelah commit berhasil, klik tombol **Publish repository**
2. Atau klik menu **Repository** → **Push**

#### Step 7: Isi Repository Settings
1. **Name**: `sim-tunjangan-guru`
2. **Description**: `Sistem Informasi Tunjangan Profesi Guru`
3. **Privacy**: Pilih **Public** atau **Private** (bebas)
4. Klik **Publish repository**

### 4.3 Verifikasi di GitHub
1. Buka https://github.com/[username]/sim-tunjangan-guru
2. Pastikan semua file sudah ter-upload
3. Pastikan file `.env` TIDAK ada di repository

---

## 5. Deploy ke Vercel

### 5.1 Deploy Pertama Kali
Setelah code sudah di GitHub:

#### Jika Masih di Halaman Configure Project:
1. Pastikan semua environment variables sudah diisi
2. Klik tombol **"Deploy"** di bagian bawah
3. Tunggu proses deploy (sekitar 1-3 menit)

#### Jika Sudah Pernah Import:
1. Buka dashboard Vercel: https://vercel.com/dashboard
2. Klik pada project Anda
3. Klik **"Deployments"**
4. Klik tombol **"Redeploy"** (jika ada) atau
5. Buka tab **Git**, lalu push perubahan dari GitHub Desktop

### 5.2 Proses Deploy
Anda akan melihat log deploy:

```
Build Output
Installing dependencies...
npm install
Building Next.js...
npm run build
Build completed
```

### 5.3 Tunggu Deploy Selesai
- Status akan berubah: **Building** → **Ready**
- Jika sukses, Anda akan melihat:
  - ✅ Build Succeeded
  - URL: `https://your-project.vercel.app`

---

## 6. Verifikasi Deploy Berhasil

### 6.1 Buka Website
1. Klik URL deployment: `https://your-project.vercel.app`
2. Website harus bisa dibuka di browser

### 6.2 Test Login dengan Akun Admin
1. Coba login dengan:
   - Username: `admin`
   - Password: `admin123`
2. Login harus berhasil
3. Redirect ke halaman admin dashboard

### 6.3 Test Login dengan Akun Guru
1. Logout dari admin
2. Login dengan:
   - Username: `guru`
   - Password: `guru123`
3. Login harus berhasil
4. Redirect ke halaman guru dashboard

### 6.4 Cek Data dari Database
1. Buka halaman yang menampilkan data (misal: halaman guru)
2. Pastikan data dari Supabase tampil dengan benar
3. Data sample harus muncul:
   - 1 guru (Ahmad Fauzi, S.Pd)
   - 1 penyaluran DAK

### 6.5 Cek Vercel Logs (Jika Ada Error)
1. Buka dashboard Vercel
2. Klik project Anda
3. Klik tab **Logs**
4. Cek jika ada error dalam logs

---

## 7. Troubleshooting

### Error 1: "Database connection failed" atau "P1001: Can't reach database server"

**Gejala**:
- Website tidak bisa mengambil data dari database
- Error: `Connection refused` atau `ECONNREFUSED`

**Penyebab**:
- DATABASE_URL salah
- Password database salah
- Database project Supabase belum aktif

**Solusi**:

1. **Cek DATABASE_URL**:
   - Pastikan format benar: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
   - Ganti `[PASSWORD]` dengan password yang Anda buat saat create project
   - Ganti `[PROJECT-REF]` dengan project reference dari dashboard Supabase

2. **Reset Password Database** (jika lupa):
   - Buka Supabase Dashboard
   - Settings → Database
   - Scroll ke **Reset Database Password**
   - Masukkan password baru
   - Update DATABASE_URL di Vercel dengan password baru

3. **Cek Status Database**:
   - Buka Supabase Dashboard
   - Pastikan project status: **Active** (bukan Paused)

4. **Test Koneksi Manual**:
   - Buka file `.env` lokal
   - Isi DATABASE_URL dari Supabase
   - Jalankan: `npm run dev`
   - Cek jika error masih muncul

---

### Error 2: "JWT decryption failed" atau "JWEDecryptionFailed"

**Gejala**:
- Login berhasil, tapi sesi langsung hilang
- Error: `JWEDecryptionFailed: decryption operation failed`

**Penyebab**:
- NEXTAUTH_SECRET tidak sama antara environment
- NEXTAUTH_URL salah

**Solusi**:

1. **Generate NEXTAUTH_SECRET yang Sama**:
   - Generate secret baru: https://generate-secret.vercel.app/32
   - Update di Vercel environment variables
   - Hapus semua cookies di browser
   - Coba login ulang

2. **Set NEXTAUTH_URL yang Benar**:
   - Di Vercel, set ke production URL: `https://your-project.vercel.app`
   - Pastikan HTTPS, bukan HTTP
   - Jangan gunakan `localhost` untuk production

3. **Clear Cookies & Cache**:
   - Buka browser
   - Tekan `Cmd + Shift + R` (Mac) atau `Ctrl + Shift + R` (Windows) untuk hard refresh
   - Hapus cookies untuk domain website

4. **Cek Vercel Logs**:
   - Buka Vercel Dashboard → Project → Logs
   - Cari error terkait NextAuth

---

### Error 3: "Table does not exist" atau "relation does not exist"

**Gejala**:
- Error di log: `Table "User" does not exist`
- Website tidak bisa mengakses database

**Penyebab**:
- Schema SQL belum diupload ke Supabase
- Schema upload gagal
- Tabel tidak terbentuk dengan benar

**Solusi**:

1. **Upload Ulang Schema**:
   - Buka Supabase Dashboard
   - SQL Editor
   - Copy-paste isi `supabase-schema.sql`
   - Klik **Run**
   - Tunggu sampai selesai

2. **Cek di Table Editor**:
   - Buka Supabase Dashboard
   - Klik **Table Editor**
   - Pastikan ada tabel: `User`, `Guru`, `Pengajuan`, `DAKPenyaluran`, `DAKDetailPenerima`

3. **Cek Error di SQL Editor**:
   - Setelah menjalankan SQL, lihat jika ada error message
   - Biasanya error karena syntax atau constraint violation

4. **Drop & Recreate Tabel** (jika perlu):
   ```sql
   DROP TABLE IF EXISTS "DAKDetailPenerima" CASCADE;
   DROP TABLE IF EXISTS "DAKPenyaluran" CASCADE;
   DROP TABLE IF EXISTS "Pengajuan" CASCADE;
   DROP TABLE IF EXISTS "User" CASCADE;
   DROP TABLE IF EXISTS "Guru" CASCADE;
   ```
   - Jalankan lagi `supabase-schema.sql`

---

### Error 4: "NEXTAUTH_URL is not defined"

**Gejala**:
- Error: `NEXTAUTH_URL is not defined`
- NextAuth tidak berjalan

**Penyebab**:
- Environment variable belum di-set di Vercel

**Solusi**:

1. **Set NEXTAUTH_URL**:
   - Buka Vercel Dashboard
   - Project → Settings → Environment Variables
   - Cek apakah `NEXTAUTH_URL` ada
   - Jika tidak, tambahkan dengan value: `https://your-project.vercel.app`

2. **Redeploy Setelah Update**:
   - Setelah menambah environment variables
   - Klik **Redeploy** di Vercel
   - Tunggu deploy selesai

---

### Error 5: "Module not found" atau Build Failed

**Gejala**:
- Build error di Vercel
- Error: `Module not found: Can't resolve 'xyz'`

**Penyebab**:
- Dependencies tidak ter-install dengan benar
- `package.json` tidak lengkap

**Solusi**:

1. **Cek package.json**:
   - Pastikan script dev/build/start sudah benar:
   ```json
   "scripts": {
     "dev": "next dev",
     "build": "next build",
     "start": "node .next/standalone/server.js",
     "db:generate": "prisma generate"
   }
   ```

2. **Generate Prisma Client**:
   - Tambahkan script `postinstall`:
   ```json
   "scripts": {
     "postinstall": "prisma generate"
   }
   ```
   - Commit dan push ke GitHub
   - Vercel akan otomatis menjalankan `postinstall` setelah `npm install`

3. **Clear Build Cache**:
   - Buka Vercel Dashboard
   - Project → Settings → General
   - Scroll ke bagian **Build & Development**
   - Klik **Clear Build Cache** (atau **Reset Build Cache**)
   - Redeploy

---

### Error 6: Login Tidak Berhasil (401 Unauthorized)

**Gejala**:
- Login selalu gagal
- Error 401 di console/browser

**Penyebab**:
- Data user belum ada di database
- Password salah
- API route tidak berfungsi

**Solusi**:

1. **Cek Data User di Supabase**:
   - Buka Supabase Dashboard
   - Table Editor → Tabel `User`
   - Pastikan ada 2 data:
     - username: `admin`, role: `ADMIN`
     - username: `guru`, role: `GURU`

2. **Test API Route Manual**:
   - Buka website di browser
   - Buka DevTools (F12)
   - Coba login dan lihat di tab **Network**
   - Cek request ke `/api/auth/callback` atau `/api/auth/signin`

3. **Cek Hash Password**:
   - Pastikan password di database sudah di-hash dengan bcrypt
   - File `supabase-schema.sql` sudah menggunakan hash yang benar

---

### Error 7: Website Blank atau 500 Error

**Gejala**:
- Website blank (putih kosong)
- Error 500 Internal Server Error

**Penyebab**:
- Runtime error di Next.js
- Database connection error
- Server-side rendering error

**Solusi**:

1. **Cek Vercel Logs**:
   - Buka Vercel Dashboard
   - Project → Deployments → Klik deployment terbaru
   - Cek tab **Function Logs**
   - Cari error message

2. **Cek Console Browser**:
   - Buka website
   - Tekan F12 → Console tab
   - Lihat error di JavaScript console

3. **Test di Lokal Dulu**:
   - Setup `.env` lokal dengan DATABASE_URL Supabase
   - Jalankan `npm run dev`
   - Cek jika error muncul di lokal

---

### Error 8: Environment Variables Tidak Terbaca

**Gejala**:
- Data tidak terbaca
- Error: `DATABASE_URL is undefined`

**Penyebab**:
- Environment variables belum di-set di Vercel
- Environment variables di-set untuk environment yang salah

**Solusi**:

1. **Cek Environment Variables di Vercel**:
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Pastikan semua 5 variables ada:
     - DATABASE_URL
     - NEXT_PUBLIC_SUPABASE_URL
     - NEXT_PUBLIC_SUPABASE_ANON_KEY
     - NEXTAUTH_URL
     - NEXTAUTH_SECRET

2. **Pastikan Environment yang Benar**:
   - Setiap variable harus ada lingkaran/checkbox untuk:
     - ✅ Production
     - ✅ Preview
     - ✅ Development (opsional)

3. **Redeploy Setelah Update**:
   - Setelah menambah/ubah environment variables
   - Klik **Redeploy**
   - Atau push commit baru ke GitHub

---

## 8. Checklist Final

Setelah semua selesai, pastikan:

### di Supabase:
- [ ] Project sudah dibuat dan aktif
- [ ] Schema `supabase-schema.sql` sudah di-upload
- [ ] Semua tabel ada: User, Guru, Pengajuan, DAKPenyaluran, DAKDetailPenerima
- [ ] Data sample ada: 1 admin, 1 guru, 1 DAK penyaluran

### di Vercel:
- [ ] Project sudah di-import dari GitHub
- [ ] 5 Environment variables sudah di-set (Production & Preview):
  - [ ] DATABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] NEXTAUTH_URL
  - [ ] NEXTAUTH_SECRET
- [ ] Deploy berhasil (Build Succeeded)
- [ ] URL website bisa diakses

### Testing:
- [ ] Website bisa dibuka di browser
- [ ] Login dengan admin berhasil
- [ ] Login dengan guru berhasil
- [ ] Data tampil dengan benar dari Supabase
- [ ] Tidak ada error di console browser
- [ ] Tidak ada error di Vercel Logs

---

## 9. Tips Tambahan

### 9.1 Auto-Deploy dari GitHub
Setiap kali Anda push code ke GitHub, Vercel akan otomatis redeploy:
- Push ke `main` branch → Production
- Push ke branch lain → Preview deployment

### 9.2 Domain Custom (Opsional)
Jika ingin menggunakan domain sendiri (misal: `sim-tunjangan.sekolah.sch.id`):
1. Buka Vercel Dashboard → Project → Settings → Domains
2. Klik **Add Domain**
3. Masukkan domain Anda
4. Ikuti instruksi untuk update DNS records

### 9.3 Backup Database
Supabase otomatis backup database setiap hari di free tier. Pastikan:
- Supabase project status: Active (tidak paused)
- Storage limit tidak penuh

### 9.4 Monitoring
Aktifkan monitoring di Vercel:
- Project → Settings → Monitoring
- Aktifkan **Alerts** untuk error tracking

---

## 10. Butuh Bantuan Lebih Lanjut?

Jika masih mengalami masalah:
1. Cek Vercel Logs untuk error message spesifik
2. Cek Supabase Logs untuk database error
3. Baca dokumentasi:
   - [Vercel Docs](https://vercel.com/docs)
   - [Supabase Docs](https://supabase.com/docs)
   - [NextAuth.js Docs](https://next-auth.js.org)

---

Selamat! Website SIM Tunjangan Profesi Guru Anda sudah terdeploy di Vercel dengan database Supabase 🎉
