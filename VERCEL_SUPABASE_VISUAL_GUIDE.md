# 🎯 Panduan Visual Langkah demi Langkah: Supabase → Vercel

## Bagian 1: DAPATKAN DATA DARI SUPABASE

### Langkah 1.1: Login ke Supabase
1. Buka browser
2. Ketik: `https://supabase.com`
3. Klik **"Sign In"** di pojok kanan atas
4. Login dengan email/password atau GitHub

### Langkah 1.2: Buka Project Database
1. Setelah login, Anda akan melihat **Dashboard**
2. Klik pada project database Anda
   - Misal: `sim-tunjangan-guru`

### Langkah 1.3: Dapatkan DATABASE_URL
1. Di sidebar kiri (menu vertikal), cari menu **Settings**
   - Ikon: ⚙️ (gear)
2. Klik **Settings**
3. Sub-menu akan muncul, klik **Database**
4. Scroll ke bawah sampai menemukan bagian: **Connection Info**
5. Cari baris: **Connection String**
6. Klik tombol **Copy** di sebelahnya (ikon clipboard)

Isi yang di-copy akan seperti ini:
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

ATAU Anda bisa pakai format ini (lebih mudah):
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**PENTING**:
- Ganti `[YOUR-PASSWORD]` dengan password database Anda
- Ganti `[PROJECT-REF]` dengan project reference Anda
- JANGAN tanda kurung siku `[` dan `]`

Contoh yang benar:
```
postgresql://postgres:KucingHitam123@db.abc123xyz.supabase.co:5432/postgres
```

### Langkah 1.4: Dapatkan NEXT_PUBLIC_SUPABASE_URL
1. Masih di halaman yang sama, tapi klik menu **API** di sidebar kiri
2. Di bagian atas, cari: **Project URL**
3. Copy URL yang ada di sebelah kanan

Contoh:
```
https://abc123xyz.supabase.co
```

### Langkah 1.5: Dapatkan NEXT_PUBLIC_SUPABASE_ANON_KEY
1. Masih di halaman **Settings → API**
2. Scroll ke bawah sampai menemukan bagian: **Project API keys**
3. Cari baris: **anon** atau **public** key
4. Klik tombol **Copy** (ikon clipboard)

Contoh:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFicjEyM3h5eiIsInB1ciI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTU1NTU1NX0.abc123xyz
```

### Langkah 1.6: Catat Semua Data
Buka Notepad atau TextEdit, copy-paste semua data:

```
✅ DATABASE_URL = "postgresql://postgres:KucingHitam123@db.abc123xyz.supabase.co:5432/postgres"
✅ NEXT_PUBLIC_SUPABASE_URL = "https://abc123xyz.supabase.co"
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Bagian 2: SETUP ENVIRONMENT VARIABLES DI VERCEL

### Langkah 2.1: Buka Vercel Dashboard
1. Buka tab baru di browser
2. Ketik: `https://vercel.com`
3. Login dengan GitHub (klik **Continue with GitHub**)

### Langkah 2.2: Buat Project Baru di Vercel
1. Di dashboard, klik tombol **"Add New..."** di pojok kanan atas
2. Pilih **"Project"**
3. Klik **"Continue with GitHub"** atau **"Import Git Repository"**
4. Pilih repository project Anda dari list yang muncul
5. Klik tombol **"Import"**

### Langkah 2.3: Halaman Configure Project
Anda akan melihat form dengan beberapa bagian:

#### Bagian A: Framework Preset
- **Framework Preset**: Next.js (otomatis terdeteksi)
- **Root Directory**: `./`
- Biarkan default, jangan diubah

#### Bagian B: Environment Variables
Di sini kita akan menambahkan 5 environment variables.

**PENTING**: Klik lingkaran/checkbox untuk:
- ✅ **Production** (WAJIB)
- ✅ **Preview** (direkomendasikan)
- ☐ **Development** (opsional, abaikan dulu)

---

### Langkah 2.4: Tambahkan DATABASE_URL

1. Scroll ke bagian **Environment Variables**
2. Klik tombol **"Add New"** atau ikon **+**
3. Kolom yang muncul:

   **Name**: `DATABASE_URL`

   **Value**: Paste value dari Supabase
   ```
   postgresql://postgres:KucingHitam123@db.abc123xyz.supabase.co:5432/postgres
   ```

4. Klik tombol ✓ atau tekan **Enter** untuk save
5. Pastikan muncul di list:
   ```
   ✓ DATABASE_URL
   ```

**CATATAN PENTING**:
- Password di DATABASE_URL harus password database Supabase yang benar
- BUKAN password akun Supabase
- Password database adalah password yang Anda buat saat create project di Supabase

---

### Langkah 2.5: Tambahkan NEXT_PUBLIC_SUPABASE_URL

1. Klik tombol **"Add New"** lagi
2. Kolom yang muncul:

   **Name**: `NEXT_PUBLIC_SUPABASE_URL`

   **Value**: Paste value dari Supabase
   ```
   https://abc123xyz.supabase.co
   ```

3. Klik tombol ✓ atau tekan **Enter**
4. Muncul di list:
   ```
   ✓ DATABASE_URL
   ✓ NEXT_PUBLIC_SUPABASE_URL
   ```

---

### Langkah 2.6: Tambahkan NEXT_PUBLIC_SUPABASE_ANON_KEY

1. Klik tombol **"Add New"**
2. Kolom yang muncul:

   **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

   **Value**: Paste ANON key dari Supabase
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFicjEyM3h5eiIsInB1ciI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTU1NTU1NX0.abc123xyz
   ```

3. Klik tombol ✓
4. Muncul di list:
   ```
   ✓ DATABASE_URL
   ✓ NEXT_PUBLIC_SUPABASE_URL
   ✓ NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

---

### Langkah 2.7: Tambahkan NEXTAUTH_URL

1. Klik tombol **"Add New"**
2. Kolom yang muncul:

   **Name**: `NEXTAUTH_URL`

   **Value**: Isi dengan URL website Anda nanti
   ```
   https://sim-tunjangan-guru.vercel.app
   ```

   **CATATAN**:
   - Gunakan HTTPS, bukan HTTP
   - Belum ada? Pakai nama project Anda + `.vercel.app`
   - Contoh: jika nama project di Vercel adalah `sim-tunjangan-guru`, maka URL: `https://sim-tunjangan-guru.vercel.app`

3. Klik tombol ✓
4. Muncul di list:
   ```
   ✓ DATABASE_URL
   ✓ NEXT_PUBLIC_SUPABASE_URL
   ✓ NEXT_PUBLIC_SUPABASE_ANON_KEY
   ✓ NEXTAUTH_URL
   ```

**NANTI**: Setelah deploy berhasil dan Anda tahu URL yang sebenarnya, Anda bisa update NEXTAUTH_URL.

---

### Langkah 2.8: Tambahkan NEXTAUTH_SECRET

1. Buka tab baru di browser
2. Kunjungi: `https://generate-secret.vercel.app/32`
3. Anda akan melihat secret yang sudah di-generate
4. Copy secret tersebut

   Contoh:
   ```
   X7OpFw9S8qL9V0X4Y5Z3QOpw8JxN4r6T5u7v2w3X9Y5Z8Q0R3T7U2V5W8X1Y4
   ```

5. Kembali ke Vercel
6. Klik tombol **"Add New"**
7. Kolom yang muncul:

   **Name**: `NEXTAUTH_SECRET`

   **Value**: Paste secret yang di-generate tadi

8. Klik tombol ✓
9. Muncul di list:
   ```
   ✓ DATABASE_URL
   ✓ NEXT_PUBLIC_SUPABASE_URL
   ✓ NEXT_PUBLIC_SUPABASE_ANON_KEY
   ✓ NEXTAUTH_URL
   ✓ NEXTAUTH_SECRET
   ```

---

### Langkah 2.9: Cek Semua Environment Variables

Pastikan semua 5 variables ada dan terlihat seperti ini:

```
Environment Variables (5)
✓ DATABASE_URL
✓ NEXT_PUBLIC_SUPABASE_URL
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY
✓ NEXTAUTH_URL
✓ NEXTAUTH_SECRET
```

**PENTING**:
- Semua harus ada lingkaran/checkbox untuk **Production** dan **Preview**
- Pastikan tidak ada typo (cek huruf besar/kecil)
- Pastikan tidak ada spasi berlebih

---

### Langkah 2.10: Deploy Project

1. Scroll ke bagian paling bawah
2. Klik tombol biru besar: **"Deploy"**
3. Tunggu proses deploy:
   - Status akan berubah: **Building** → **Deploying** → **Ready**
   - Waktu: 1-3 menit tergantung ukuran project

---

## Bagian 3: VERIFIKASI DEPLOY

### Langkah 3.1: Buka Website

1. Setelah deploy selesai, Anda akan melihat pesan: **"Congratulations!"**
2. Klik URL yang diberikan
   - Contoh: `https://sim-tunjangan-guru.vercel.app`
3. Website harus terbuka di browser

### Langkah 3.2: Test Login Admin

1. Di halaman login, isi:
   - Username: `admin`
   - Password: `admin123`
2. Klik tombol **Login**
3. Login harus berhasil
4. Redirect ke dashboard admin

### Langkah 3.3: Test Login Guru

1. Logout (atau buka incognito window)
2. Login dengan:
   - Username: `guru`
   - Password: `guru123`
3. Login harus berhasil
4. Redirect ke dashboard guru

### Langkah 3.4: Verifikasi Data dari Supabase

1. Buka halaman yang menampilkan data guru
2. Data harus muncul:
   - Nama: `Ahmad Fauzi, S.Pd`
   - NIP: `198001012000121001`
   - Golongan: `III/c`
   - Gaji Pokok: `Rp 4.000.000`
3. Data ini datang dari Supabase database!

---

## Bagian 4: UPDATE NEXTAUTH_URL (Jika Perlu)

### Langkah 4.1: Cek URL Production

1. Setelah deploy, Vercel akan memberikan URL production
2. Note URL tersebut:
   ```
   https://sim-tunjangan-guru.vercel.app
   ```

### Langkah 4.2: Update NEXTAUTH_URL di Vercel

1. Buka Vercel Dashboard: `https://vercel.com/dashboard`
2. Klik project Anda
3. Klik tab **Settings**
4. Klik submenu **Environment Variables**
5. Cari variabel: `NEXTAUTH_URL`
6. Klik tombol **Edit** (ikon pensil)
7. Update value dengan URL production yang benar:
   ```
   https://sim-tunjangan-guru.vercel.app
   ```
8. Klik **Save**

### Langkah 4.3: Redeploy

1. Kembali ke tab **Deployments**
2. Cari deployment terbaru
3. Klik tombol tiga titik (⋮) di kanan
4. Pilih **Redeploy**
5. Klik **Redeploy** lagi di popup
6. Tunggu redeploy selesai

---

## Bagian 5: MASALAH UMUM & SOLUSI

### Problem 1: Login Tidak Berhasil (Gagal Terus)

**Gejala**:
- Login selalu gagal
- Tidak ada error yang jelas

**Solusi**:
1. Cek data di Supabase:
   - Buka Supabase Dashboard
   - Table Editor → Tabel `User`
   - Pastikan ada data: username `admin` dan `guru`

2. Cek NEXTAUTH_SECRET:
   - Pastikan NEXTAUTH_SECRET sudah di-set di Vercel
   - Generate secret baru jika perlu

3. Hapus cookies browser:
   - Buka DevTools (F12)
   - Application → Cookies
   - Hapus semua cookies untuk website

---

### Problem 2: Error "Database Connection Failed"

**Gejala**:
- Website blank
- Console browser menampilkan error database

**Solusi**:
1. Cek DATABASE_URL:
   - Pastikan format benar
   - Pastikan password database benar
   - Pastikan project reference benar

2. Reset password database (jika lupa):
   - Supabase Dashboard → Settings → Database
   - Scroll ke **Reset Database Password**
   - Masukkan password baru
   - Update DATABASE_URL di Vercel

---

### Problem 3: Website Blank Putih

**Gejala**:
- Website terbuka tapi kosong
- Tidak ada error yang jelas

**Solusi**:
1. Cek Vercel Logs:
   - Vercel Dashboard → Project → Deployments
   - Klik deployment terbaru
   - Cek tab **Function Logs**

2. Cek browser console:
   - Tekan F12 → Console
   - Cari error di JavaScript console

---

### Problem 4: Build Error di Vercel

**Gejala**:
- Deploy gagal
- Build status: Failed

**Solusi**:
1. Cek build log di Vercel:
   - Buka deployment yang failed
   - Scroll ke bagian **Build Output**
   - Cari error message

2. Pastikan script di `package.json` benar:
   ```json
   "scripts": {
     "dev": "next dev",
     "build": "next build",
     "start": "node .next/standalone/server.js"
   }
   ```

3. Clear build cache:
   - Vercel Dashboard → Settings → General
   - Scroll ke **Build & Development**
   - Klik **Clear Build Cache**
   - Redeploy

---

## CHECKLIST SELESAI

Sebelum menganggap selesai, pastikan:

### di Supabase:
- [ ] Project sudah dibuat
- [ ] Database sudah diupload (schema.sql)
- [ ] Tabel-tabel sudah ada (cek di Table Editor)
- [ ] Data sample sudah ada (admin & guru)

### di Vercel:
- [ ] Project sudah di-import dari GitHub
- [ ] 5 Environment variables sudah di-set:
  - [ ] DATABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] NEXTAUTH_URL
  - [ ] NEXTAUTH_SECRET
- [ ] Deploy berhasil (status: Ready)
- [ ] Website bisa diakses

### Testing:
- [ ] Website bisa dibuka di browser
- [ ] Login admin berhasil
- [ ] Login guru berhasil
- [ ] Data tampil dari Supabase
- [ ] Tidak ada error di console

---

## SUMBER DAYA TAMBAHAN

### Dokumentasi:
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [NextAuth.js Docs](https://next-auth.js.org)

### Tool:
- Generate Secret: https://generate-secret.vercel.app/32
- Test Database Connection: https://prisma.io

---

## BUTUH BANTUAN?

Jika masih mengalami masalah:
1. Cek Vercel Logs untuk error message spesifik
2. Cek Console Browser untuk error JavaScript
3. Cek Supabase Dashboard untuk status database

---

**Selamat! 🎉 Website Anda sudah terdeploy di Vercel dengan database Supabase!**
