# 📖 PANDUAN VISUAL: Upload Website ke Hosting (DARI NOL)

## Panduan dengan Gambaran Visual untuk Pemula

---

## 🎯 RANGKUMAN LANGKAH

```
[Langkah 1] Persiapan Local (5 min)
      ↓
[Langkah 2] Buat Akun (10 min)
      ↓
[Langkah 3] Setup Database Supabase (10 min)
      ↓
[Langkah 4] Upload ke GitHub (10 min)
      ↓
[Langkah 5] Deploy ke Vercel (10 min)
      ↓
[Langkah 6] Testing (5 min)
      ↓
[Selesai!] Website Online! 🎉
```

---

# 📝 LANGKAH 1: PERSIAPAN LOCAL

## 1.1 Cek Folder Project

Buka folder project di komputer Anda:

```
sim-tunjangan-guru/
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
├── prisma/
│   └── schema.prisma
├── package.json
├── .env              ← JANGAN UPLOAD KE GITHUB!
├── .gitignore
└── supabase-schema.sql  ← WAJIB ADA!
```

✅ Checklist:
- [ ] Folder project ada
- [ ] File `supabase-schema.sql` ada
- [ ] File `.gitignore` ada

---

## 1.2 Cek File .gitignore

Buka file `.gitignore`, pastikan berisi:

```
# Dependencies
node_modules/

# Environment variables
.env
.env.local

# Database
*.db
*.sqlite

# Next.js
.next/

# Logs
*.log
```

✅ Checklist:
- [ ] File `.gitignore` sudah benar

---

## 1.3 Test Website Lokal

1. Buka terminal/CMD
2. Masuk ke folder project: `cd /home/z/my-project`
3. Jalankan: `npm run dev`
4. Buka browser: `http://localhost:3000`
5. Website harus muncul

✅ Checklist:
- [ ] Website bisa jalan di lokal
- [ ] Tidak ada error

---

# 📝 LANGKAH 2: BUAT AKUN

## 2.1 Buat Akun GitHub

### Visual 1: Halaman GitHub Sign Up

```
┌─────────────────────────────────────┐
│                                     │
│         [Logo GitHub]   [Sign in]  Sign up │
│                                     │
│      Build and ship software.        │
│                                     │
│         [Sign up for GitHub]        │
│                                     │
│         Email address                │
│         [nama@email.com           ] │
│                                     │
│         Create a password           │
│         [************             ] │
│                                     │
│         Create a username           │
│         [@username               ] │
│                                     │
│         [x] I agree to terms       │
│                                     │
│              [Create an account]      │
│                                     │
└─────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Buka: `https://github.com`
2. Klik **Sign up**
3. Isi email, password, username
4. Click **Create an account**
5. Cek email → klik verifikasi
6. Login ke GitHub

---

## 2.2 Buat Akun Supabase

### Visual 2: Halaman Supabase Sign Up

```
┌─────────────────────────────────────┐
│                                     │
│   [Logo Supabase]        [Sign In] │
│                                     │
│      Build in a weekend. Scale to   │
│      millions.                      │
│                                     │
│         [Start your project]        │
│                                     │
│     [Sign up with GitHub]           │
│     [Sign up with Email]            │
│     [Continue with Google]          │
│                                     │
└─────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Buka: `https://supabase.com`
2. Klik **Start your project**
3. Klik **Sign up with GitHub** (paling cepat!)
4. Authorize GitHub
5. Login ke Supabase

---

## 2.3 Buat Akun Vercel

### Visual 3: Halaman Vercel Sign Up

```
┌─────────────────────────────────────┐
│                                     │
│     Deploy. Preview. Ship.         │
│                                     │
│     Start deploying your apps       │
│                                     │
│     [Continue with GitHub]          │
│     [Continue with GitLab]         │
│     [Continue with Bitbucket]      │
│                                     │
└─────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Buka: `https://vercel.com`
2. Klik **Sign Up**
3. Klik **Continue with GitHub**
4. Klik **Authorize Vercel**
5. Dashboard Vercel terbuka

---

✅ Checklist Langkah 2:
- [ ] Akun GitHub dibuat dan bisa login
- [ ] Akun Supabase dibuat dan bisa login
- [ ] Akun Vercel dibuat dan bisa login

---

# 📝 LANGKAH 3: SETUP DATABASE DI SUPABASE

## 3.1 Buat Project Database

### Visual 4: Dashboard Supabase - New Project

```
┌─────────────────────────────────────┐
│                                     │
│   [Logo Supabase]                  │
│                                     │
│   Your Projects                     │
│                                     │
│   ┌─────────────────────────────┐  │
│   │                             │  │
│   │        [+ New Project]      │  │
│   │                             │  │
│   └─────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Di dashboard Supabase, klik **[+ New Project]**

---

### Visual 5: Form Create New Project

```
┌─────────────────────────────────────┐
│  Create a new project      [Close] │
│                                     │
│  Name                               │
│  [sim-tunjangan-guru              ] │
│                                     │
│  Database Password                  │
│  [*******************              ] │
│      (minimum 10 characters)         │
│      ← CATAT PASSWORD INI! ←        │
│                                     │
│  Region                             │
│  [Singapore                     ▼ ] │
│                                     │
│  Pricing Plan                       │
│  (●) Free    ( ) Pro ($25/mo)       │
│                                     │
│              [Create new project]    │
│                                     │
└─────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. **Name**: `sim-tunjangan-guru`
2. **Database Password**: Buat password kuat & **CATAT!**
3. **Region**: Singapore
4. **Pricing Plan**: Free
5. Click **Create new project**
6. Tunggu 1-2 menit

---

## 3.2 Upload Schema Database

### Visual 6: SQL Editor

```
┌─────────────────────────────────────┐
│  SQL Editor              [New query]│
│                                     │
│  ┌─────────────────────────────┐   │
│  │ -- Enable UUID extension     │   │
│  │ CREATE EXTENSION IF NOT...   │   │
│  │                             │   │
│  │ -- TABEL: User             │   │
│  │ CREATE TABLE IF NOT EXI...   │   │
│  │                             │   │
│  │ -- Sample Data: 1 Admin...   │   │
│  │ INSERT INTO "User"...         │   │
│  │                             │   │
│  │                             │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│        [▶ Run]  [Save]  [Clear]     │
│                                     │
└─────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Klik menu **SQL Editor** di sidebar kiri
2. Klik **New query**
3. Buka file `supabase-schema.sql` di komputer
4. Copy semua isi
5. Paste ke SQL Editor
6. Klik **[▶ Run]**

---

## 3.3 Verifikasi Database

### Visual 7: Table Editor - Cek Tabel

```
┌─────────────────────────────────────┐
│  Table Editor                    │
│                                     │
│  Tables (5)                         │
│                                     │
│  ▶ User                             │
│  ▶ Guru                             │
│  ▶ Pengajuan                        │
│  ▶ DAKPenyaluran                    │
│  ▶ DAKDetailPenerima                │
│                                     │
│  [Create new table]                 │
│                                     │
└─────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Klik menu **Table Editor**
2. Pastikan ada 5 tabel
3. Klik tabel **User**
4. Pastikan ada 2 data:
   - 1 admin
   - 1 guru

---

## 3.4 Dapatkan Connection String

### Visual 8: Settings Database - Connection String

```
┌─────────────────────────────────────┐
│  Settings  Database  API  Auth      │
│                                     │
│  Database Settings                   │
│                                     │
│  Connection Info                    │
│                                     │
│  Connection string                  │
│  ┌─────────────────────────────┐   │
│  │ postgresql://postgres.[REF]... │   │
│  │ postgresql://postgres:[PA..]   │   │
│  │                   [Copy]      │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Klik menu **Settings** → **Database**
2. Scroll ke **Connection Info**
3. Click **[Copy]** di Connection string
4. Paste ke Notepad
5. Edit:
   - Ganti `[YOUR-PASSWORD]` dengan password database Anda
   - Ganti `[PROJECT-REF]` dengan project reference
   - Hapus tanda kurung siku `[` `]`

**Format yang BENAR:**
```
postgresql://postgres:KucingHitam#12345@db.abc123xyz.supabase.co:5432/postgres
```

---

### Visual 9: Settings API - Project URL & ANON Key

```
┌─────────────────────────────────────┐
│  Settings  Database  API  Auth      │
│                                     │
│  Connection Info                    │
│                                     │
│  Project URL                        │
│  ┌─────────────────────────────┐   │
│  │ https://abc123xyz.supabase.co│   │
│  │                   [Copy]      │   │
│  └─────────────────────────────┘   │
│                                     │
│  Project API keys                   │
│                                     │
│  anon public                        │
│  ┌─────────────────────────────┐   │
│  │ eyJhbGciOiJIUzI1NiIsInR5...   │   │
│  │                   [Copy]      │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Klik menu **API**
2. Copy **Project URL**
3. Copy **anon/public key**
4. Simpan di Notepad bersama DATABASE_URL

---

✅ Checklist Langkah 3:
- [ ] Project database dibuat di Supabase
- [ ] Schema SQL di-upload
- [ ] 5 tabel ada di Table Editor
- [ ] Data admin & guru ada
- [ ] DATABASE_URL dicatat dan benar
- [ ] API keys dicatat

---

# 📝 LANGKAH 4: UPLOAD KE GITHUB

## 4.1 Install GitHub Desktop

### Visual 10: Download GitHub Desktop

```
┌─────────────────────────────────────┐
│                                     │
│   [Logo GitHub Desktop]             │
│                                     │
│   Focus on what matters             │
│   instead of fighting with Git.     │
│                                     │
│         Download for Windows         │
│         Download for macOS          │
│                                     │
│         [Download for Windows]       │
│         [Download for macOS]        │
│                                     │
└─────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Buka: `https://desktop.github.com/`
2. Click **Download for Windows/macOS**
3. Install aplikasi
4. Login dengan akun GitHub

---

## 4.2 Upload Project ke GitHub

### Visual 11: GitHub Desktop - Add Repository

```
┌─────────────────────────────────────┐
│  GitHub Desktop     [File] [View]  │
│                                     │
│     Add a Local Repository           │
│                                     │
│     Choose...      [Browse]          │
│                                     │
│     /Users/username/Documents/...    │
│                                     │
│               [Add Repository]       │
│                                     │
└─────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Buka GitHub Desktop
2. **File** → **Add Local Repository**
3. Click **Choose** atau **Browse**
4. Pilih folder project Anda
5. Click **Add Repository**

---

### Visual 12: GitHub Desktop - Commit & Publish

```
┌─────────────────────────────────────┐
│  [sim-tunjangan-guru]    [main]  │
│                                     │
│  Summary:                           │
│  [Initial commit: SIM Tunjangan Guru] │
│                                     │
│  [▼] Changes (45)                   │
│                                     │
│     ✓ src/app/page.tsx             │
│     ✓ src/components/...           │
│     ✓ package.json                 │
│     ✓ prisma/schema.prisma         │
│     ✓ supabase-schema.sql          │
│     ✓ ...                          │
│                                     │
│      [Commit to main]                │
│                                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Publish your repository            │
│                                     │
│  Name:                             │
│  [sim-tunjangan-guru              ] │
│                                     │
│  Description:                      │
│  [Sistem Informasi Tunjangan Guru ] │
│                                     │
│  Privacy:                          │
│  (●) Public    ( ) Private          │
│                                     │
│                [Publish repository]   │
│                                     │
└─────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Tulis: `Initial commit: SIM Tunjangan Guru`
2. Click **Commit to main**
3. Click **Publish repository**
4. Click **Publish repository** lagi

---

### Visual 13: GitHub - Repository Berhasil

```
┌─────────────────────────────────────┐
│                                     │
│  sim-tunjangan-guru                 │
│                                     │
│  Public  ⭐  Code  Pull requests    │
│                                     │
│  [Branch: main ▼]  [New pull request]│
│                                     │
│  ▼ src/                            │
│  ▼ prisma/                         │
│  ▼ package.json                     │
│  ▼ supabase-schema.sql              │
│  ▼ .gitignore                      │
│                                     │
│  Latest commit                      │
│  Initial commit: SIM Tunjangan Guru  │
│                                     │
└─────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Buka: `https://github.com/[username]/sim-tunjangan-guru`
2. Pastikan semua file ada
3. Pastikan `.env` TIDAK ada!

---

✅ Checklist Langkah 4:
- [ ] Repository GitHub dibuat
- [ ] Project di-upload
- [ ] File `.env` tidak ada di GitHub

---

# 📝 LANGKAH 5: DEPLOY KE VERCEL

## 5.1 Import Project ke Vercel

### Visual 14: Vercel Dashboard - Add New Project

```
┌─────────────────────────────────────┐
│                                     │
│   [Logo Vercel]                    │
│                                     │
│   Your Projects                     │
│                                     │
│   ┌─────────────────────────────┐  │
│   │                             │  │
│   │      [+ Add New...]         │  │
│   │                             │  │
│   └─────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Buka: `https://vercel.com/dashboard`
2. Click **[+ Add New...]**
3. Click **Project**

---

### Visual 15: Import Git Repository

```
┌─────────────────────────────────────┐
│  Import Git Repository             │
│                                     │
│  Choose a Git repository...         │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ username/sim-tunjangan...   │   │
│  │                             │   │
│  │  description: Sistem...     │   │
│  │  Updated: 5 minutes ago    │   │
│  │                [Import]     │   │
│  └─────────────────────────────┘   │
│                                     │
│                     [Cancel]  [Continue]│
│                                     │
└─────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Cari repository: `sim-tunjangan-guru`
2. Click **[Import]**

---

## 5.2 Configure Project - Environment Variables

### Visual 16: Configure Project

```
┌─────────────────────────────────────┐
│  Configure Project        [Cancel]  │
│                                     │
│  Framework Preset                   │
│  [Next.js                     ▼]  │
│                                     │
│  Root Directory                    │
│  [./]                              │
│                                     │
│  Build Command                     │
│  [npm run build]                   │
│                                     │
│  Output Directory                  │
│  [.next]                           │
│                                     │
│  Install Command                   │
│  [npm install]                     │
│                                     │
└─────────────────────────────────────┘
```

**Biarkan default, scroll ke bawah ke Environment Variables**

---

### Visual 17: Environment Variables - Tambah Variable

```
┌─────────────────────────────────────┐
│  Environment Variables              │
│                                     │
│  [+ Add New]                        │
│                                     │
│  DATABASE_URL              [✓]      │
│  postgresql://postgres:Kucing...     │
│                                     │
│  NEXT_PUBLIC_SUPABASE_URL  [✓]      │
│  https://abc123xyz.supabase.co       │
│                                     │
│  NEXT_PUBLIC_SUPABASE_AN... [✓]      │
│  eyJhbGciOiJIUzI1NiIsInR5...         │
│                                     │
│  NEXTAUTH_URL             [✓]      │
│  https://sim-tunjangan-guru...       │
│                                     │
│  NEXTAUTH_SECRET          [✓]      │
│  X7OpFw9S8qL9V0X4Y5Z3QOpw8...      │
│                                     │
└─────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Click **[+ Add New]**
2. Tambahkan 5 variables:
   - DATABASE_URL
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - NEXTAUTH_URL
   - NEXTAUTH_SECRET
3. Pastikan semua checklist ✅ di Production

---

## 5.3 Deploy

### Visual 18: Deploying

```
┌─────────────────────────────────────┐
│  Deploying                         │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Installing dependencies...  │   │
│  │                             │   │
│  │ [████████████████████░░░] 80%│   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Build Output                       │
│  > npm install                      │
│  > added 123 packages in 15s       │
│  > npm run build                    │
│  > info  - Creating an optimized... │
│  > Route (app) /...                │
│                                     │
│  Time remaining: ~30s               │
│                                     │
└─────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
- Tunggu 1-3 menit
- Status akan berubah ke **Ready**

---

### Visual 19: Deploy Berhasil!

```
┌─────────────────────────────────────┐
│                                     │
│  Congratulations!                   │
│                                     │
│  Your project is ready.             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Visit Deployment          │   │
│  │                             │   │
│  │  https://sim-tunjangan...   │   │
│  │         .vercel.app         │   │
│  │                             │   │
│  │  [Open]                     │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Continue to Dashboard]             │
│                                     │
└─────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Click URL atau tombol **[Open]**
2. Website terbuka di browser!

---

✅ Checklist Langkah 5:
- [ ] 5 environment variables di-set
- [ ] Deploy berhasil (Ready)
- [ ] Website bisa diakses

---

# 📝 LANGKAH 6: TESTING

## 6.1 Test Login

### Visual 20: Halaman Login

```
┌─────────────────────────────────────┐
│                                     │
│   SIM Tunjangan Profesi Guru        │
│                                     │
│   ┌─────────────────────────────┐   │
│   │                             │   │
│   │  Username                   │   │
│   │  [admin                   ] │   │
│   │                             │   │
│   │  Password                   │   │
│   │  [••••••••                ] │   │
│   │                             │   │
│   │                             │   │
│   │      [   Login    ]         │   │
│   │                             │   │
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Test Admin:
- Username: `admin`
- Password: `admin123`
- Click **Login**

### Test Guru:
- Logout
- Username: `guru`
- Password: `guru123`
- Click **Login**

---

✅ Checklist Langkah 6:
- [ ] Login admin berhasil
- [ ] Login guru berhasil
- [ ] Data tampil dengan benar

---

# 🎉 SELESAI!

## URL Website:
```
https://sim-tunjangan-guru.vercel.app
```

## Akun Login:

**Admin**: `admin` / `admin123`
**Guru**: `guru` / `guru123`

---

# ✅ CHECKLIST FINAL

### Akun:
- [ ] Akun GitHub sudah dibuat
- [ ] Akun Supabase sudah dibuat
- [ ] Akun Vercel sudah dibuat

### Supabase:
- [ ] Project database dibuat
- [ ] Schema SQL di-upload
- [ ] 5 tabel ada di Table Editor
- [ ] Data admin & guru ada
- [ ] DATABASE_URL dicatat
- [ ] API keys dicatat

### GitHub:
- [ ] Repository dibuat
- [ ] Project di-upload
- [ ] File `.env` tidak ada

### Vercel:
- [ ] Project di-import
- [ ] 5 environment variables di-set
- [ ] Deploy berhasil
- [ ] Website bisa diakses

### Testing:
- [ ] Login admin berhasil
- [ ] Login guru berhasil
- [ ] Data tampil

---

**Selamat! Website Anda sudah online! 🎊**
