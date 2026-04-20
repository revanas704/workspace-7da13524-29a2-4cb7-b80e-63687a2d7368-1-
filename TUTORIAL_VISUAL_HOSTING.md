# 📸 Tutorial Visual: Upload Website ke Hosting Gratis

## Tutorial dengan Gambaran Visual untuk Pemula

Tutorial ini menggunakan deskripsi visual seperti screenshot, agar Anda bisa mengikuti langkah-langkahnya dengan mudah.

---

## 🎯 APA YANG AKAN KITA LAKUKAN

```
[Persiapan]
    ↓
[Buat Akun GitHub, Supabase, Vercel]
    ↓
[Setup Database di Supabase]
    ↓
[Upload ke GitHub]
    ↓
[Deploy ke Vercel]
    ↓
[Website ONLINE! 🎉]
```

---

## BAGIAN 1: MEMBUAT AKUN GITHUB

### Visual 1: Halaman Depan GitHub

```
┌─────────────────────────────────────────────┐
│                                             │
│         [Logo GitHub]     [Sign in]  Sign up  │
│                                             │
│                                             │
│            Build and ship software.         │
│                                             │
│                                             │
│          [Sign up for GitHub]               │
│                                             │
│              [Continue with Google]         │
│              [Continue with Microsoft]      │
│                                             │
│               or: Email address            │
│               [Enter your email]           │
│               [Create a password]           │
│               [Create a username]          │
│                                             │
│              [Create an account]  [Continue]│
│                                             │
└─────────────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Buka: `https://github.com`
2. Klik **Sign up** di pojok kanan atas
3. Isi:
   - Email
   - Password (buat kuat!)
   - Username (unik)
4. Klik **Create an account**
5. Buka email, klik link verifikasi

---

## BAGIAN 2: MEMBUAT AKUN SUPABASE

### Visual 2: Halaman Depan Supabase

```
┌─────────────────────────────────────────────┐
│                                             │
│   [Logo Supabase]              [Sign In]  │
│                                             │
│                                             │
│      Build in a weekend. Scale to millions  │
│                                             │
│                                             │
│          [Start your project]               │
│                                             │ │
│              [Sign up with GitHub]          │
│              [Sign up with Email]           │
│              [Continue with Google]         │
│              [Continue with Microsoft]     │
│                                             │
└─────────────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Buka: `https://supabase.com`
2. Klik **Start your project** atau **Sign Up**
3. Pilih **Sign up with GitHub** (paling cepat!)
4. Authorize GitHub

---

## BAGIAN 3: MEMBUAT PROJECT DATABASE DI SUPABASE

### Visual 3: Dashboard Supabase - Create New Project

```
┌─────────────────────────────────────────────┐
│  [Logo]  [Supabase] [Dashboard] [Docs]... │
│                                             │
│                                             │
│         Your Projects                       │
│                                             │
│   ┌─────────────────────────────────────┐  │
│   │                                     │  │
│   │        [+ New Project]              │  │
│   │                                     │  │
│   └─────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Setelah login, Anda akan melihat Dashboard
2. Klik tombol **[+ New Project]**

---

### Visual 4: Form Create New Project

```
┌─────────────────────────────────────────────┐
│  Create a new project              [X]     │
│                                             │
│  Name                                       │
│  [sim-tunjangan-guru                        ]
│                                             │
│  Database Password                          │
│  [*******************                      ]
│             (minimum 10 characters)          │
│                                             │
│  Region                                     │
│  [Singapore                     ▼]          │
│                                             │
│  Pricing Plan                               │
│  (●) Free                                   │
│  ( ) Pro ($25/mo)                           │
│                                             │
│                   [Create new project]       │
│                                             │
└─────────────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. **Name**: `sim-tunjangan-guru`
2. **Database Password**: Buat password kuat (min 10 karakter)
   - Contoh: `KucingHitam#12345`
   - **PENTING**: Catat password ini!
3. **Region**: Pilih `Singapore`
4. **Pricing Plan**: Pilih `Free`
5. Klik **Create new project**
6. Tunggu 1-2 menit

---

### Visual 5: SQL Editor - Upload Schema

```
┌─────────────────────────────────────────────┐
│  SQL Editor                 [New query]  ✕ │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ -- Enable UUID extension            │   │
│  │ CREATE EXTENSION IF NOT EXISTS...   │   │
│  │                                     │   │
│  │ -- TABEL: User                     │   │
│  │ CREATE TABLE IF NOT EXISTS...      │   │
│  │                                     │   │
│  │ -- Sample Data: 1 Admin & 1 Guru   │   │
│  │ INSERT INTO "User"...               │   │
│  │                                     │   │
│  │                                     │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│        [▶ Run]  [Save]  [Clear]           │
│                                             │
└─────────────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Klik menu **SQL Editor** di sidebar kiri
2. Klik **New query**
3. Buka file `supabase-schema.sql` di komputer Anda
4. Copy semua isi file
5. Paste ke SQL Editor
6. Klik tombol **[▶ Run]**
7. Tunggu sampai selesai

---

### Visual 6: Table Editor - Cek Tabel

```
┌─────────────────────────────────────────────┐
│  Table Editor                    [SQL] ...  │
│                                             │
│  ◉ Tables  ◉ Views                         │
│                                             │
│  Tables (5)                                 │
│                                             │
│  ▶ User                                     │
│  ▶ Guru                                     │
│  ▶ Pengajuan                                │
│  ▶ DAKPenyaluran                            │
│  ▶ DAKDetailPenerima                        │
│                                             │
│  [Create new table]                         │
│                                             │
└─────────────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Klik menu **Table Editor**
2. Pastikan ada 5 tabel:
   - ✅ User
   - ✅ Guru
   - ✅ Pengajuan
   - ✅ DAKPenyaluran
   - ✅ DAKDetailPenerima
3. Klik tabel **User**
4. Pastikan ada 2 data:
   - 1 akun admin
   - 1 akun guru

---

### Visual 7: Settings Database - Connection String

```
┌─────────────────────────────────────────────┐
│  Settings  ◉ Database  ◉ API  ◉ Auth ...    │
│                                             │
│  Database Settings                           │
│                                             │
│  Connection Info                            │
│                                             │
│  Connection string                          │
│  ┌─────────────────────────────────────┐   │
│  │ postgresql://postgres.[REF]...       │   │
│  │                   [Copy]           │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  URI                                        │
│  ┌─────────────────────────────────────┐   │
│  │ postgres://postgres...              │   │
│  │                   [Copy]           │   │ │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Klik menu **Settings** (ikon ⚙️)
2. Klik **Database**
3. Scroll ke **Connection Info**
4. Klik tombol **[Copy]** di Connection string
5. Paste ke Notepad
6. Edit:
   - Ganti `[YOUR-PASSWORD]` dengan password database
   - Ganti `[PROJECT-REF]` dengan project reference
   - Hapus tanda kurung siku `[` `]`

Contoh yang BENAR:
```
postgresql://postgres:KucingHitam#12345@db.abc123xyz.supabase.co:5432/postgres
```

---

### Visual 8: Settings API - Project URL & ANON Key

```
┌─────────────────────────────────────────────┐
│  Settings  ◉ Database  ◉ API  ◉ Auth ...   │
│                                             │
│  Connection Info                            │
│                                             │
│  Project URL                                │
│  ┌─────────────────────────────────────┐   │
│  │ https://abc123xyz.supabase.co       │   │
│  │                   [Copy]           │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Project API keys                           │
│                                             │
│  anon public                                │
│  ┌─────────────────────────────────────┐   │
│  │ eyJhbGciOiJIUzI1NiIsInR5cCI...     │   │
│  │                   [Copy]           │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Masih di Settings, klik **API**
2. Copy **Project URL**
3. Copy **anon/public key**
4. Simpan di Notepad bersama DATABASE_URL

---

## BAGIAN 4: MEMBUAT AKUN VERCEL

### Visual 9: Halaman Depan Vercel

```
┌─────────────────────────────────────────────┐
│  [Logo]                     [Sign In]  Sign Up │
│                                             │
│                                             │
│      Develop. Preview. Ship.                │
│                                             │
│                                             │
│          [Start Deploying]                 │
│                                             │
│              [Continue with GitHub]         │
│              [Continue with GitLab]        │
│              [Continue with Bitbucket]     │
│                                             │
└─────────────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Buka: `https://vercel.com`
2. Klik **Sign Up**
3. Klik **Continue with GitHub**
4. Klik **Authorize Vercel**

---

## BAGIAN 5: UPLOAD KE GITHUB DENGAN GITHUB DESKTOP

### Visual 10: GitHub Desktop - Add Local Repository

```
┌─────────────────────────────────────────────┐
│  GitHub Desktop             [File] [View]... │
│                                             │
│                                             │
│     Add a Local Repository                   │
│                                             │
│     Choose...      [Browse]                  │
│                                             │
│     /Users/username/Documents/...            │
│                                             │
│               [Add Repository]               │
│                                             │
└─────────────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Buka GitHub Desktop
2. **File** → **Add Local Repository**
3. Klik **Choose** atau **Browse**
4. Pilih folder project Anda
5. Klik **Add Repository**

---

### Visual 11: GitHub Desktop - Commit & Publish

```
┌─────────────────────────────────────────────┐
│  [sim-tunjangan-guru]    [main ▼]          │
│                                             │
│  Summary:                                   │
│  [Initial commit: SIM Tunjangan Guru         ]
│                                             │
│  [▼] Changes (45)                            │
│                                             │
│     ✓ src/app/page.tsx                     │
│     ✓ src/components/...                   │
│     ✓ package.json                         │
│     ✓ ...                                  │
│                                             │
│      [Commit to main]                        │
│                                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Publish your repository                    │
│                                             │
│  Name:                                     │
│  [sim-tunjangan-guru                        ]
│                                             │
│  Description:                              │
│  [Sistem Informasi Tunjangan Guru           ]
│                                             │
│  Privacy:                                   │
│  (●) Public  ( ) Private                   │
│                                             │
│                  [Publish repository]        │
│                                             │
└─────────────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Tulis commit message: `Initial commit: SIM Tunjangan Guru`
2. Klik **Commit to main**
3. Klik **Publish repository**
4. Klik **Publish repository** lagi

---

## BAGIAN 6: DEPLOY KE VERCEL

### Visual 12: Vercel - Import Project

```
┌─────────────────────────────────────────────┐
│  Import Git Repository                       │
│                                             │
│  Choose a Git repository...                  │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ username/sim-tunjangan-guru         │   │
│  │                                     │   │
│  │   description: Sistem Informasi...   │   │
│  │   Updated: 5 minutes ago            │   │
│  │                [Import]             │   │
│  └─────────────────────────────────────┘   │
│                                             │
│                     [Cancel]  [Continue]    │
│                                             │
└─────────────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Klik **Add New...** → **Project**
2. Cari repository: `sim-tunjangan-guru`
3. Klik **Import**

---

### Visual 13: Vercel - Configure Project

```
┌─────────────────────────────────────────────┐
│  Configure Project               [Cancel]   │
│                                             │
│  Framework Preset                            │
│  [Next.js                     ▼]            │
│                                             │
│  Environment Variables                       │
│                                             │
│  DATABASE_URL                   [✓]        │
│  postgresql://postgres:...                │
│                                             │
│  NEXT_PUBLIC_SUPABASE_URL      [✓]        │
│  https://abc123xyz.supabase.co             │
│                                             │
│  NEXT_PUBLIC_SUPABASE_ANON_KEY [✓]        │
│  eyJhbGciOiJIUzI1NiIsInR5cCI...            │
│                                             │
│  NEXTAUTH_URL                  [✓]        │
│  https://sim-tunjangan-guru.vercel.app      │
│                                             │
│  NEXTAUTH_SECRET              [✓]        │
│  X7OpFw9S8qL9V0X4Y5Z3QOpw8...              │
│                                             │
│  [+ Add New]                                │
│                                             │
│                          [Deploy]            │
└─────────────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Tambahkan 5 environment variables:
   - DATABASE_URL
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - NEXTAUTH_URL
   - NEXTAUTH_SECRET
2. Klik **[+ Add New]** untuk setiap variable
3. Isi dengan data dari Notepad
4. Klik ✓ untuk save setiap variable
5. Scroll ke bawah
6. Klik **Deploy**

---

### Visual 14: Vercel - Deploying...

```
┌─────────────────────────────────────────────┐
│  Deploying                                  │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ Installing dependencies...          │   │
│  │                                     │   │
│  │ [████████████████████████░░] 85%     │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Build Output                               │
│  > npm install                              │
│  > added 123 packages in 15s               │
│  > npm run build                            │
│  > info  - Creating an optimized...        │
│  > Route (app) /...                        │
│                                             │
│                                             │
│  Time remaining: ~30s                       │
│                                             │
└─────────────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
- Tunggu 1-3 menit
- Status akan berubah ke **Ready**

---

### Visual 15: Vercel - Deploy Berhasil!

```
┌─────────────────────────────────────────────┐
│                                             │
│  Congratulations!                           │
│                                             │
│  Your project is ready.                     │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  Visit Deployment                    │   │
│  │                                     │   │
│  │  https://sim-tunjangan-guru         │   │
│  │         .vercel.app                 │   │
│  │                                     │   │
│  │  [Open]                             │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Continue to Dashboard]                     │
│                                             │
└─────────────────────────────────────────────┘
```

**Yang harus Anda lakukan:**
1. Klik URL atau tombol **Open**
2. Website akan terbuka di browser
3. **Selesai!** ✅

---

## BAGIAN 7: TESTING WEBSITE

### Visual 16: Halaman Login

```
┌─────────────────────────────────────────────┐
│                                             │
│          SIM Tunjangan Profesi Guru         │
│                                             │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │  Username                           │   │
│  │  [________________________]          │   │
│  │                                     │   │
│  │  Password                           │   │
│  │  [________________________]          │   │
│  │                                     │   │
│  │                                     │   │
│  │      [    Login    ]                │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

**Test Admin:**
- Username: `admin`
- Password: `admin123`
- Klik **Login**
- Login harus berhasil!

**Test Guru:**
- Username: `guru`
- Password: `guru123`
- Klik **Login**
- Login harus berhasil!

---

## ✅ CHECKLIST VISUAL

### Setelah Selesai, Pastikan:

```
□ Akun GitHub: [✓] Sudah dibuat
□ Akun Supabase: [✓] Sudah dibuat
□ Akun Vercel: [✓] Sudah dibuat
□ Project Database: [✓] Sudah dibuat
□ Schema Database: [✓] Sudah di-upload
□ 5 Tabel: [✓] User, Guru, Pengajuan, DAKPenyaluran, DAKDetailPenerima
□ Data Sample: [✓] 1 admin & 1 guru
□ DATABASE_URL: [✓] Sudah dicatat
□ API Keys: [✓] Sudah dicatat
□ Repository GitHub: [✓] Sudah dibuat
□ Project uploaded: [✓] Sudah
□ Vercel Project: [✓] Sudah di-import
□ 5 Environment Variables: [✓] DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXTAUTH_URL, NEXTAUTH_SECRET
□ Deploy: [✓] Berhasil
□ Website Online: [✓] Bisa diakses
□ Login Admin: [✓] Berhasil
□ Login Guru: [✓] Berhasil
```

---

## 🎉 SELAMAT! WEBSITE ANDA ONLINE!

### Website URL:
```
https://sim-tunjangan-guru.vercel.app
```

---

## 📚 Butuh Tutorial Lain?

- `TUTORIAL_UPLOAD_HOSTING.md` - Tutorial lengkap & detail
- `TUTORIAL_CEPAT_HOSTING.md` - Tutorial cepat 10 menit
- `VERCEL_SUPABASE_GUIDE.md` - Panduan teknis
- `QUICK_TROUBLESHOOTING.md` - Quick troubleshooting

---

**Semoga membantu! 🚀**
