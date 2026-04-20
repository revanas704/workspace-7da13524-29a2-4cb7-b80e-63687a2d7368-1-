# ✅ CHECKLIST DEPLOYMENT LENGKAP

## Gunakan checklist ini untuk memastikan semuanya sudah benar!

---

## 📋 BAGIAN 1: PERSIAPAN

### Sebelum Mulai
- [ ] Punya akun email yang aktif
- [ ] Punya komputer/laptop dengan internet
- [ ] Project Next.js sudah ada di komputer
- [ ] Website sudah bisa jalan di lokal (`npm run dev`)
- [ ] Punya waktu 45-60 menit
- [ ] Sudah baca panduan minimal sekilas

---

## 📋 BAGIAN 2: BUAT AKUN

### Akun GitHub
- [ ] Buka `https://github.com`
- [ ] Click **Sign up**
- [ ] Isi email, password, username
- [ ] Verify email dari inbox
- [ ] Bisa login ke GitHub
- [ ] **AKUN GITHUB SELESAI ✅**

### Akun Supabase
- [ ] Buka `https://supabase.com`
- [ ] Click **Start your project** atau **Sign up**
- [ ] Sign up with GitHub (atau email)
- [ ] Login ke dashboard Supabase
- [ ] **AKUN SUPABASE SELESAI ✅**

### Akun Vercel
- [ ] Buka `https://vercel.com`
- [ ] Click **Sign up**
- [ ] Continue with GitHub (rekomendasi)
- [ ] Authorize Vercel untuk akses GitHub
- [ ] Bisa akses dashboard Vercel
- [ ] **AKUN VERCEL SELESAI ✅**

---

## 📋 BAGIAN 3: DATABASE SUPABASE

### Create Project Database
- [ ] Dashboard Supabase → Click **+ New Project**
- [ ] Isi Name: `sim-tunjangan-guru`
- [ ] Isi Database Password (buat kuat & CATAT!)
- [ ] Pilih Region: `Singapore`
- [ ] Pilih Pricing Plan: `Free`
- [ ] Click **Create new project**
- [ ] Tunggu 1-2 menit
- [ ] Status project: **Active**
- [ ] **PROJECT DATABASE DIBUAT ✅**

### Upload Schema
- [ ] Buka file `supabase-schema.sql` di komputer
- [ ] Copy semua isi file
- [ ] Supabase Dashboard → Click menu **SQL Editor**
- [ ] Click **New query**
- [ ] Paste schema SQL
- [ ] Click **Run**
- [ ] Sukses: "Success. No rows returned"
- [ ] **SCHEMA DATABASE UPLOADED ✅**

### Verify Schema di Table Editor
- [ ] Click menu **Table Editor**
- [ ] Tabel **User** ada ✅
- [ ] Tabel **Guru** ada ✅
- [ ] Tabel **Pengajuan** ada ✅
- [ ] Tabel **DAKPenyaluran** ada ✅
- [ ] Tabel **DAKDetailPenerima** ada ✅
- [ ] Total: 5 tabel ✅

### Verify Data User
- [ ] Click tabel **User**
- [ ] Ada data dengan username `admin` ✅
- [ ] Ada data dengan username `guru` ✅
- [ ] Total: 2 data user ✅

### Verify Data Guru
- [ ] Click tabel **Guru**
- [ ] Ada 1 data guru sample ✅
- [ ] Nama: `Ahmad Fauzi, S.Pd` ✅

### DATABASE_URL
- [ ] Supabase → Settings → Database
- [ ] Scroll ke **Connection Info**
- [ ] Click **Copy** di Connection String
- [ ] Paste ke Notepad
- [ ] Edit dan ganti placeholder:
  - [ ] `[YOUR-PASSWORD]` diganti password database
  - [ ] `[PROJECT-REF]` diganti project reference
  - [ ] Hapus tanda kurung siku `[` dan `]`
- [ ] Format final benar:
  ```
  postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres
  ```
- [ ] **DATABASE_URL SIAP ✅**

### API Keys
- [ ] Supabase → Settings → API
- [ ] Copy **Project URL** ✅
- [ ] Copy **anon/public key** ✅
- [ ] Simpan di Notepad
- [ ] **API KEYS SIAP ✅**

---

## 📋 BAGIAN 4: GITHUB

### Install GitHub Desktop
- [ ] Buka `https://desktop.github.com/`
- [ ] Download (Windows/Mac)
- [ ] Install
- [ ] Buka aplikasi
- [ ] Login dengan akun GitHub
- [ ] **GITHUB DESKTOP READY ✅**

### Upload Project ke GitHub
- [ ] GitHub Desktop → File → Add Local Repository
- [ ] Pilih folder project Anda
- [ ] Click **Add Repository**
- [ ] Tulis commit message: `Initial commit`
- [ ] Click **Commit to main**
- [ ] Click **Publish repository**
- [ ] Isi Name: `sim-tunjangan-guru`
- [ ] Pilih Privacy: Public atau Private
- [ ] Click **Publish repository**
- [ ] Tunggu upload selesai
- [ ] **PROJECT UPLOADED KE GITHUB ✅**

### Verify di GitHub Browser
- [ ] Buka: `https://github.com/[username]/sim-tunjangan-guru`
- [ ] Semua file project terlihat ✅
- [ ] Folder `src/` ada ✅
- [ ] File `package.json` ada ✅
- [ ] File `.env` TIDAK ada ✅
- [ ] **GITHUB VERIFIED ✅**

---

## 📋 BAGIAN 5: VERCEL

### Import Project
- [ ] Buka: `https://vercel.com/dashboard`
- [ ] Click **Add New...** → **Project**
- [ ] Cari repository: `sim-tunjangan-guru`
- [ ] Click **Import**
- [ ] Masuk ke halaman Configure Project
- [ ] **PROJECT DI-IMPORT ✅**

### Environment Variables

#### DATABASE_URL
- [ ] Click **Add New**
- [ ] Name: `DATABASE_URL`
- [ ] Value: Paste dari Notepad
- [ ] Checklist ✅ **Production**
- [ ] Checklist ✅ **Preview**
- [ ] Click **Save**
- [ ] **DATABASE_URL SET ✅**

#### NEXT_PUBLIC_SUPABASE_URL
- [ ] Click **Add New**
- [ ] Name: `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Value: Paste Project URL dari Notepad
- [ ] Checklist ✅ **Production**
- [ ] Checklist ✅ **Preview**
- [ ] Click **Save**
- [ ] **NEXT_PUBLIC_SUPABASE_URL SET ✅**

#### NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Click **Add New**
- [ ] Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Value: Paste ANON key dari Notepad
- [ ] Checklist ✅ **Production**
- [ ] Checklist ✅ **Preview**
- [ ] Click **Save**
- [ ] **NEXT_PUBLIC_SUPABASE_ANON_KEY SET ✅**

#### NEXTAUTH_URL
- [ ] Click **Add New**
- [ ] Name: `NEXTAUTH_URL`
- [ ] Value: `https://sim-tunjangan-guru.vercel.app`
- [ ] Checklist ✅ **Production**
- [ ] Checklist ✅ **Preview**
- [ ] Click **Save**
- [ ] **NEXTAUTH_URL SET ✅**

#### NEXTAUTH_SECRET
- [ ] Buka: `https://generate-secret.vercel.app/32`
- [ ] Copy secret yang muncul
- [ ] Kembali ke Vercel
- [ ] Click **Add New**
- [ ] Name: `NEXTAUTH_SECRET`
- [ ] Value: Paste secret
- [ ] Checklist ✅ **Production**
- [ ] Checklist ✅ **Preview**
- [ ] Click **Save**
- [ ] **NEXTAUTH_SECRET SET ✅**

### Verify All Environment Variables
- [ ] DATABASE_URL ada ✅
- [ ] NEXT_PUBLIC_SUPABASE_URL ada ✅
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY ada ✅
- [ ] NEXTAUTH_URL ada ✅
- [ ] NEXTAUTH_SECRET ada ✅
- [ ] Semua checklist **Production** ✅
- [ ] Semua checklist **Preview** ✅
- [ ] Total: 5 environment variables ✅

### Deploy
- [ ] Scroll ke bawah di halaman Configure Project
- [ ] Click tombol biru: **Deploy**
- [ ] Tunggu proses build
- [ ] Status berubah: Building → Ready
- [ ] Waktu: 1-3 menit
- [ ] Success message muncul
- [ ] **DEPLOY SUKSES ✅**

---

## 📋 BAGIAN 6: TESTING

### Buka Website
- [ ] Click URL dari Vercel
- [ ] Website terbuka di browser ✅
- [ ] Tidak ada halaman blank ✅
- [ ] Tidak ada error yang jelas ✅

### Test Login Admin
- [ ] Buka halaman login
- [ ] Username: `admin`
- [ ] Password: `admin123`
- [ ] Click **Login**
- [ ] Redirect ke dashboard admin ✅
- [ ] Data admin muncul ✅
- [ ] **LOGIN ADMIN BERHASIL ✅**

### Test Login Guru
- [ ] Logout dari admin
- [ ] Login dengan:
  - Username: `guru`
  - Password: `guru123`
- [ ] Click **Login**
- [ ] Redirect ke dashboard guru ✅
- [ ] Data guru muncul ✅
- [ ] Nama: `Ahmad Fauzi, S.Pd` ✅
- [ ] **LOGIN GURU BERHASIL ✅**

### Verify Data dari Database
- [ ] Buka halaman data guru
- [ ] Data muncul dengan benar ✅
- [ ] Data berasal dari Supabase ✅
- [ ] Koneksi database berhasil ✅
- [ ] **DATABASE CONNECTION VERIFIED ✅**

---

## 📋 BAGIAN 7: UPDATE NEXTAUTH_URL (Opsional)

### Update NEXTAUTH_URL
- [ ] Cek URL production dari Vercel
- [ ] Vercel → Settings → Environment Variables
- [ ] Cari `NEXTAUTH_URL`
- [ ] Click **Edit**
- [ ] Update dengan URL production yang benar
- [ ] Click **Save**
- [ ] **NEXTAUTH_URL UPDATED ✅**

### Redeploy
- [ ] Vercel → Deployments
- [ ] Click deployment terbaru
- [ ] Click ⋮ (tiga titik)
- [ ] Click **Redeploy**
- [ ] Click **Redeploy** lagi
- [ ] Tunggu redeploy selesai
- [ ] **REDEPLOY SELESAI ✅**

---

## ✅ CHECKLIST FINAL

### Akun
- [ ] GitHub: Siap ✅
- [ ] Supabase: Siap ✅
- [ ] Vercel: Siap ✅

### Database
- [ ] Project database: Dibuat ✅
- [ ] Schema: Uploaded ✅
- [ ] 5 tabel: Ada ✅
- [ ] Data admin & guru: Ada ✅
- [ ] DATABASE_URL: Benar & dicatat ✅
- [ ] API keys: Dicatat ✅

### Code Repository
- [ ] GitHub Desktop: Terinstall ✅
- [ ] Project: Uploaded ✅
- [ ] Repository: Terbuat ✅
- [ ] File .env: Tidak ada di GitHub ✅

### Hosting
- [ ] Project: Di-import ke Vercel ✅
- [ ] Environment variables: 5 variables set ✅
- [ ] Production & Preview: Checked ✅
- [ ] Deploy: Berhasil ✅
- [ ] Website: Online ✅

### Testing
- [ ] Website: Bisa diakses ✅
- [ ] Login admin: Berhasil ✅
- [ ] Login guru: Berhasil ✅
- [ ] Data: Muncul dari Supabase ✅

---

## 🎉 SELESAI!

### Website URL:
```
https://sim-tunjangan-guru.vercel.app
```

### Akun Login:

**Admin**:
- Username: `admin`
- Password: `admin123`

**Guru**:
- Username: `guru`
- Password: `guru123`

---

## ❌ JIKA ADA YANG TIDAK TERCENTANG:

### Problem: Login Gagal
Baca: `FIX_LOGIN_ISSUE.md`

### Problem: Deploy Failed
Baca: `QUICK_TROUBLESHOOTING.md`

### Problem: Database Connection Failed
Baca: `FIX_LOGIN_ISSUE.md`

### Problem: Lainnya
- Cek Vercel Logs (Deployments → Function Logs)
- Cek Browser Console (F12 → Console)
- Baca panduan troubleshooting yang tersedia

---

**Gunakan checklist ini untuk memastikan semuanya sudah benar selesai! ✅**
