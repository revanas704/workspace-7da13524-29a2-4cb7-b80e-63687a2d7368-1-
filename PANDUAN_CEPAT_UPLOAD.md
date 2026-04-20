# ⚡ PANDUAN CEPAT: Upload Website ke Hosting (Mulai Dari Awal)

## 📋 Ringkasan Tahapan

```
1. Buat Akun (15 menit)
2. Setup Database Supabase (15 menit)
3. Upload ke GitHub (10 menit)
4. Deploy ke Vercel (10 menit)
5. Testing (5 menit)

Total: ~55 menit
```

---

## TAHAP 1: BUAT AKUN (15 Menit)

### 1.1 Buat Akun GitHub
```
Buka: https://github.com
→ Sign up
→ Isi email, password, username
→ Verify email
→ Selesai! ✅
```

### 1.2 Buat Akun Supabase
```
Buka: https://supabase.com
→ Start your project / Sign up
→ Sign up with GitHub (paling cepat!)
→ Authorize
→ Selesai! ✅
```

### 1.3 Buat Akun Vercel
```
Buka: https://vercel.com
→ Sign up
→ Continue with GitHub (paling cepat!)
→ Authorize Vercel
→ Selesai! ✅
```

---

## TAHAP 2: SETUP DATABASE SUPABASE (15 Menit)

### 2.1 Buat Project Database
```
Dashboard Supabase
→ + New Project
→ Isi:
  - Name: sim-tunjangan-guru
  - Password: Buat kuat & CATAT! (misal: KucingHitam#12345)
  - Region: Singapore
  - Plan: Free
→ Create new project
→ Tunggu 1-2 menit
→ Selesai! ✅
```

### 2.2 Upload Schema Database
```
SQL Editor
→ New query
→ Copy isi file: supabase-schema.sql
→ Paste
→ Run
→ Selesai! ✅
```

**Cek di Table Editor**:
- Harus ada 5 tabel: User, Guru, Pengajuan, DAKPenyaluran, DAKDetailPenerima
- Tabel User harus punya 2 data: admin & guru

### 2.3 Ambil DATABASE_URL
```
Settings → Database
→ Connection Info
→ Copy Connection String
→ Edit & simpan di Notepad:

Format asli:
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

Setelah diedit:
postgresql://postgres:KucingHitam#12345@db.abc123xyz.supabase.co:5432/postgres

⚠️ Ganti [YOUR-PASSWORD] & [PROJECT-REF]
⚠️ Hapus tanda kurung siku [ ]
```

### 2.4 Ambil API Keys
```
Settings → API
→ Copy & simpan di Notepad:

✅ NEXT_PUBLIC_SUPABASE_URL
https://abc123xyz.supabase.co

✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## TAHAP 3: UPLOAD KE GITHUB (10 Menit)

### 3.1 Install GitHub Desktop
```
Buka: https://desktop.github.com/
→ Download (Windows/Mac)
→ Install
→ Buka & login dengan akun GitHub
→ Selesai! ✅
```

### 3.2 Upload Project
```
GitHub Desktop
→ File → Add Local Repository
→ Pilih folder project Anda
→ Tulis commit: "Initial commit"
→ Commit to main
→ Publish repository
→ Isi:
  - Name: sim-tunjangan-guru
  - Privacy: Public (atau Private)
→ Publish repository
→ Selesai! ✅
```

**Verifikasi di Browser**:
```
Buka: https://github.com/[username]/sim-tunjangan-guru
→ Pastikan semua file ada
→ Pastikan file .env TIDAK ada
→ Selesai! ✅
```

---

## TAHAP 4: DEPLOY KE VERCEL (10 Menit)

### 4.1 Import Project
```
Vercel Dashboard: https://vercel.com/dashboard
→ Add New... → Project
→ Cari: sim-tunjangan-guru
→ Import
→ Selesai! ✅
```

### 4.2 Setup Environment Variables

Tambahkan 5 variables ini:

**1. DATABASE_URL**
```
Name: DATABASE_URL
Value: postgresql://postgres:KucingHitam#12345@db.abc123xyz.supabase.co:5432/postgres
✓ Check Production
✓ Check Preview
```

**2. NEXT_PUBLIC_SUPABASE_URL**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://abc123xyz.supabase.co
✓ Check Production
✓ Check Preview
```

**3. NEXT_PUBLIC_SUPABASE_ANON_KEY**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
✓ Check Production
✓ Check Preview
```

**4. NEXTAUTH_URL**
```
Name: NEXTAUTH_URL
Value: https://sim-tunjangan-guru.vercel.app
✓ Check Production
✓ Check Preview
```

**5. NEXTAUTH_SECRET**
```
Generate secret:
→ Buka: https://generate-secret.vercel.app/32
→ Copy secret yang muncul

Set di Vercel:
Name: NEXTAUTH_SECRET
Value: [paste secret tadi]
✓ Check Production
✓ Check Preview
```

### 4.3 Deploy!
```
Configure Project
→ Scroll ke bawah
→ Click tombol: Deploy
→ Tunggu 1-3 menit
→ Selesai! ✅
```

---

## TAHAP 5: TESTING (5 Menit)

### 5.1 Buka Website
```
Click URL dari Vercel:
https://sim-tunjangan-guru.vercel.app

→ Website harus terbuka ✅
```

### 5.2 Test Login Admin
```
Halaman Login
→ Username: admin
→ Password: admin123
→ Click Login

→ Harus berhasil & redirect ke dashboard ✅
```

### 5.3 Test Login Guru
```
Logout
→ Login lagi:
  Username: guru
  Password: guru123
→ Click Login

→ Harus berhasil & redirect ke dashboard ✅
```

---

## ✅ CHECKLIST CEPAT

### Akun
- [ ] GitHub ✅
- [ ] Supabase ✅
- [ ] Vercel ✅

### Supabase
- [ ] Project database dibuat ✅
- [ ] Schema SQL uploaded ✅
- [ ] 5 tabel ada di Table Editor ✅
- [ ] Data admin & guru ada ✅
- [ ] DATABASE_URL dicatat & benar ✅
- [ ] API keys dicatat ✅

### GitHub
- [ ] Repository dibuat ✅
- [ ] Project uploaded ✅
- [ ] File .env tidak ada di GitHub ✅

### Vercel
- [ ] Project imported ✅
- [ ] 5 env vars set & checked Production ✅
- [ ] Deploy berhasil ✅
- [ ] Website online ✅

### Testing
- [ ] Website bisa diakses ✅
- [ ] Login admin berhasil ✅
- [ ] Login guru berhasil ✅
- [ ] Data dari Supabase muncul ✅

---

## ❌ PROBLEM UMUM & SOLUSI

### Problem: Login Gagal (Username/Password Salah)
**Solusi**:
```
1. Cek data di Supabase Table Editor → User
   → Harus ada 2 data: admin & guru

2. Jika tidak ada, run SQL di Supabase SQL Editor:
   → Copy dari file: fix-user-data.sql
   → Run

3. Pastikan NEXTAUTH_SECRET ada di Vercel
   → Environment Variables → Check

4. Hapus cookies browser
   → F12 → Application → Cookies → Clear

5. Redeploy Vercel
```

### Problem: Database Connection Failed
**Solusi**:
```
1. Cek DATABASE_URL format:
   postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres

2. Pastikan password database benar
   (Bukan password login Supabase)

3. Cek status Supabase project
   → Harus Active (bukan Paused)
```

### Problem: Deploy Failed
**Solusi**:
```
1. Cek build log di Vercel Deployments

2. Clear build cache:
   Vercel → Settings → General
   → Clear Build Cache
   → Redeploy
```

---

## 🎯 HASIL AKHIR

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

## 📚 Panduan Tambahan

- `PANDUAN_LENGKAP_UPLOAD_HOSTING.md` - Panduan sangat detail
- `FIX_LOGIN_ISSUE.md` - Troubleshooting login
- `QUICK_TROUBLESHOOTING.md` - Quick troubleshooting

---

**Selesai! 🎉 Website Anda sudah online! 🚀**
