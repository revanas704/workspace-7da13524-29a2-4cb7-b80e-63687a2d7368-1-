# ⚡ TUTORIAL CEPAT: Upload Website ke Hosting GRATIS (10 Menit)

## 🎯 Cara Paling Cepat & Mudah

Ini adalah tutorial versi ringkas untuk upload website ke hosting GRATIS.

---

## PERSIAPAN (Sebelum Mulai)

Yang dibutuhkan:
1. ✅ Akun email (Gmail/Yahoo)
2. ✅ Project Next.js sudah ada di komputer
3. ✅ Website sudah bisa jalan di lokal (`npm run dev`)

---

## LANGKAH 1: BUAT AKUN-AKUN (3 Menit)

### 1.1 Akun GitHub
1. Buka: `https://github.com`
2. Klik **Sign Up**
3. Isi email, password, username
4. Verifikasi email
5. **Selesai!** ✅

### 1.2 Akun Supabase (Database)
1. Buka: `https://supabase.com`
2. Klik **Start your project**
3. Sign up dengan email atau GitHub
4. **Selesai!** ✅

### 1.3 Akun Vercel (Hosting)
1. Buka: `https://vercel.com`
2. Klik **Sign Up**
3. Klik **Continue with GitHub** (Paling cepat!)
4. Authorize Vercel
5. **Selesai!** ✅

---

## LANGKAH 2: SETUP DATABASE DI SUPABASE (5 Menit)

### 2.1 Buat Project Database
1. Login Supabase
2. Klik **New Project**
3. Isi:
   - **Name**: `sim-tunjangan-guru`
   - **Password**: Buat password kuat & **CATAT!**
   - **Region**: Singapore
   - **Plan**: Free
4. Klik **Create**
5. Tunggu 1-2 menit

### 2.2 Upload Schema Database
1. Klik menu **SQL Editor**
2. Klik **New query**
3. Copy isi file `supabase-schema.sql` dari project Anda
4. Paste ke SQL Editor
5. Klik **Run**
6. **Selesai!** ✅

### 2.3 Ambil Connection String
1. Klik menu **Settings** → **Database**
2. Copy **Connection String**:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
3. Edit & simpan:
   - Ganti `[PASSWORD]` dengan password database Anda
   - Ganti `[PROJECT-REF]` dengan project reference dari dashboard
   - Hapus tanda kurung siku `[` `]`

### 2.4 Ambil API Keys
1. Klik menu **API**
2. Copy & simpan:
   - **Project URL**: `https://[PROJECT-REF].supabase.co`
   - **anon key**: (copy yang panjang)

**Simpan semua di Notepad!** 📝

---

## LANGKAH 3: UPLOAD KE GITHUB (5 Menit)

### 3.1 Install GitHub Desktop
1. Buka: `https://desktop.github.com/`
2. Download & install

### 3.2 Upload Project
1. Buka GitHub Desktop
2. **File** → **Add Local Repository**
3. Pilih folder project Anda
4. Tulis commit message: `Initial commit`
5. Klik **Commit**
6. Klik **Publish repository**
7. Isi:
   - **Name**: `sim-tunjangan-guru`
   - **Privacy**: Public atau Private
8. Klik **Publish**
9. **Selesai!** ✅

---

## LANGKAH 4: DEPLOY KE VERCEL (5 Menit)

### 4.1 Import Project
1. Login Vercel
2. Klik **Add New...** → **Project**
3. Pilih repository `sim-tunjangan-guru`
4. Klik **Import**

### 4.2 Add Environment Variables (WAJIB!)

Tambahkan 5 variable ini di Vercel:

| Variable | Value | Contoh |
|----------|-------|--------|
| **DATABASE_URL** | Connection string Supabase | `postgresql://postgres:Pass123@db.abc.supabase.co:5432/postgres` |
| **NEXT_PUBLIC_SUPABASE_URL** | Project URL Supabase | `https://abc123xyz.supabase.co` |
| **NEXT_PUBLIC_SUPABASE_ANON_KEY** | ANON key Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| **NEXTAUTH_URL** | URL website Vercel | `https://sim-tunjangan-guru.vercel.app` |
| **NEXTAUTH_SECRET** | Generate secret | `X7OpFw9S8qL9V0X4Y5Z3QOpw8...` |

**Cara generate NEXTAUTH_SECRET**:
- Buka: `https://generate-secret.vercel.app/32`
- Copy secret yang muncul

**PENTING**:
- Check ✅ **Production** untuk semua variables
- Check ✅ **Preview** untuk semua variables

### 4.3 Deploy!
1. Scroll ke bawah
2. Klik tombol biru **Deploy**
3. Tunggu 1-3 menit
4. Klik URL yang muncul
5. **Selesai!** ✅

---

## LANGKAH 5: TESTING (2 Menit)

### Test Website
1. Buka URL: `https://sim-tunjangan-guru.vercel.app`
2. Website harus muncul

### Test Login Admin
- Username: `admin`
- Password: `admin123`
- Login harus berhasil ✅

### Test Login Guru
- Username: `guru`
- Password: `guru123`
- Login harus berhasil ✅

---

## ✅ CHECKLIST FINAL

Sebelum selesai, pastikan:

- [ ] Akun GitHub, Supabase, Vercel sudah dibuat
- [ ] Project database sudah dibuat di Supabase
- [ ] Schema database sudah di-upload
- [ ] Project sudah di-upload ke GitHub
- [ ] 5 environment variables sudah di-set di Vercel
- [ ] Deploy berhasil
- [ ] Website bisa diakses
- [ ] Login admin berhasil
- [ ] Login guru berhasil

---

## 🎉 SELAMAT! WEBSITE ANDA SUDAH ONLINE!

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

## ❓ TROUBLESHOOTING CEPAT

### Deploy Failed?
- Cek build log di Vercel
- Clear build cache: Settings → General → Clear Build Cache
- Redeploy

### Login Gagal?
- Cek NEXTAUTH_SECRET di Vercel
- Generate secret baru
- Hapus cookies browser
- Redeploy

### Database Connection Failed?
- Cek DATABASE_URL format
- Pastikan password database benar (bukan password login Supabase)
- Reset password database di Supabase jika lupa

### Website Blank?
- Cek Vercel Function Logs
- Cek Browser Console (F12)

---

## 📚 BUTUH TUTORIAL LEBIH LENGKAP?

Baca file-file ini:
- `TUTORIAL_UPLOAD_HOSTING.md` - Tutorial lengkap & detail
- `VERCEL_SUPABASE_GUIDE.md` - Panduan Vercel + Supabase
- `QUICK_TROUBLESHOOTING.md` - Quick troubleshooting

---

**Selesai dalam 10-15 menit! 🚀**
