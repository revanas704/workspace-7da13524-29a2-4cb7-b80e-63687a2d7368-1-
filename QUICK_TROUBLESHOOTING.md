# 🔧 Quick Troubleshooting: Supabase + Vercel

## Masalah #1: "Database Connection Failed"

### Gejala:
- Website tidak bisa mengambil data
- Error: `Connection refused` atau `ECONNREFUSED`
- Console menampilkan error database

### Cek 1: DATABASE_URL Format
Format yang benar:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Cara Fix:
1. Buka Supabase Dashboard → Settings → Database
2. Copy Connection String
3. Ganti `[PASSWORD]` dengan password database Anda
4. Ganti `[PROJECT-REF]` dengan project reference
5. Update di Vercel: Settings → Environment Variables

### Cek 2: Password Database
- BUKAN password login Supabase
- Adalah password yang dibuat saat create project
- Jika lupa, reset di: Supabase Dashboard → Settings → Database → Reset Database Password

---

## Masalah #2: "JWT Decryption Failed"

### Gejala:
- Login berhasil tapi sesi hilang
- Error: `JWEDecryptionFailed: decryption operation failed`

### Cara Fix:
1. Generate secret baru:
   - Buka: https://generate-secret.vercel.app/32
   - Copy secret

2. Update NEXTAUTH_SECRET di Vercel:
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Cari NEXTAUTH_SECRET
   - Edit → Paste secret baru → Save

3. Clear cookies browser:
   - Tekan F12 → Application → Cookies
   - Hapus semua cookies untuk website

4. Redeploy:
   - Vercel Dashboard → Deployments → ⋮ → Redeploy

---

## Masalah #3: "Table Does Not Exist"

### Gejala:
- Error: `Table "User" does not exist`
- Website tidak bisa akses database

### Cara Fix:
1. Buka Supabase Dashboard
2. SQL Editor
3. Copy-paste isi file `supabase-schema.sql`
4. Klik **Run**
5. Tunggu sampai selesai
6. Cek di Table Editor, pastikan ada tabel: User, Guru, Pengajuan, DAKPenyaluran, DAKDetailPenerima

---

## Masalah #4: Login Gagal Terus (401)

### Gejala:
- Login selalu gagal
- Error 401 Unauthorized

### Cara Fix:
1. Cek data di Supabase:
   - Table Editor → Tabel `User`
   - Pastikan ada data:
     - username: `admin`, role: `ADMIN`
     - username: `guru`, role: `GURU`

2. Jika data tidak ada:
   - Jalankan ulang `supabase-schema.sql` di Supabase SQL Editor

3. Test di lokal:
   - Setup `.env` lokal dengan DATABASE_URL Supabase
   - Jalankan `npm run dev`
   - Coba login

---

## Masalah #5: Build Error di Vercel

### Gejala:
- Deploy gagal
- Status: Failed

### Cara Fix:
1. Cek build log:
   - Vercel Dashboard → Deployments → Klik deployment terbaru
   - Scroll ke **Build Output**
   - Cari error message

2. Common errors:
   - `Module not found` → Dependencies tidak terinstall
   - `Cannot find module` → Pastikan file tidak hilang

3. Add postinstall script:
   - Edit `package.json`:
   ```json
   "scripts": {
     "postinstall": "prisma generate"
   }
   ```
   - Commit dan push ke GitHub

4. Clear build cache:
   - Vercel Dashboard → Settings → General
   - Scroll ke **Build & Development**
   - Klik **Clear Build Cache**
   - Redeploy

---

## Masalah #6: NEXTAUTH_URL Undefined

### Gejala:
- Error: `NEXTAUTH_URL is not defined`
- NextAuth tidak berjalan

### Cara Fix:
1. Add NEXTAUTH_SECRET di Vercel:
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Click "Add New"
   - Name: `NEXTAUTH_SECRET`
   - Value: Generate dari https://generate-secret.vercel.app/32
   - Check ✅ Production
   - Save

2. Add NEXTAUTH_URL di Vercel:
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Click "Add New"
   - Name: `NEXTAUTH_URL`
   - Value: `https://your-project.vercel.app`
   - Check ✅ Production
   - Save

3. Redeploy:
   - Vercel Dashboard → Deployments → ⋮ → Redeploy

---

## Masalah #7: Website Blank Putih

### Gejala:
- Website terbuka tapi kosong
- Tidak ada error jelas

### Cara Fix:
1. Cek Vercel Function Logs:
   - Vercel Dashboard → Project → Deployments → Klik deployment terbaru
   - Tab **Function Logs**
   - Cari error

2. Cek Browser Console:
   - Tekan F12 → Console
   - Cari error JavaScript

3. Cek di Lokal:
   - Setup `.env` dengan DATABASE_URL Supabase
   - Jalankan `npm run dev`
   - Cek jika error muncul

---

## Masalah #8: Environment Variables Tidak Terbaca

### Gejala:
- Error: `DATABASE_URL is undefined`
- Data tidak muncul

### Cara Fix:
1. Cek di Vercel:
   - Vercel Dashboard → Project → Settings → Environment Variables

2. Pastikan 5 variables ada:
   - ✅ DATABASE_URL
   - ✅ NEXT_PUBLIC_SUPABASE_URL
   - ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
   - ✅ NEXTAUTH_URL
   - ✅ NEXTAUTH_SECRET

3. Pastikan environment:
   - Setiap variable harus ada ✅ di **Production** dan **Preview**

4. Redeploy:
   - Setelah update environment variables
   - Klik **Redeploy**

---

## Masalah #9: Password Salah untuk Supabase

### Gejala:
- Error: `password authentication failed`

### Cara Fix:
1. Cek password database:
   - Adalah password yang dibuat SAAT create project di Supabase
   - BUKAN password login Supabase

2. Jika lupa password:
   - Supabase Dashboard → Settings → Database
   - Scroll ke **Reset Database Password**
   - Masukkan password baru
   - Klik **Reset Password**

3. Update DATABASE_URL:
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Cari DATABASE_URL
   - Edit → Update dengan password baru
   - Save

4. Redeploy

---

## Masalah #10: Data Tidak Muncul

### Gejala:
- Website jalan tapi data kosong
- Tidak ada error

### Cara Fix:
1. Cek di Supabase:
   - Table Editor → Cek semua tabel
   - Pastikan ada data sample

2. Jalankan schema SQL:
   - Supabase Dashboard → SQL Editor
   - Copy-paste `supabase-schema.sql`
   - Click **Run**

3. Cek API routes:
   - Buka DevTools (F12) → Network
   - Coba login, cek request API
   - Cek response dari API

---

## Quick Checklist Sebelum Debugging

- [ ] Supabase project sudah aktif (bukan Paused)
- [ ] Schema SQL sudah di-upload ke Supabase
- [ ] Semua tabel ada di Table Editor
- [ ] 5 Environment variables sudah di-set di Vercel (Production)
- [ ] Deploy di Vercel status: Ready (bukan Failed)
- [ ] Website bisa diakses di browser
- [ ] Cek Vercel Logs untuk error
- [ ] Cek Browser Console untuk error

---

## Cara Debug dengan Benar

### 1. Cek Vercel Logs
```
Vercel Dashboard → Project → Deployments → Klik deployment terbaru → Function Logs
```

### 2. Cek Browser Console
```
Tekan F12 → Tab Console → Cari error message
```

### 3. Cek Network Requests
```
Tekan F12 → Tab Network → Coba login → Cek request API
```

### 4. Cek di Lokal Dulu
```bash
# Setup .env dengan DATABASE_URL Supabase
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Jalankan project
npm run dev

# Cek error di terminal
```

---

## Resource Tambahan

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Prisma Troubleshooting](https://www.prisma.io/docs/guides/troubleshooting-orm)
