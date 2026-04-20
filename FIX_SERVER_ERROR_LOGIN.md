# 🔧 FIX: Server Error pada Login di Vercel

## 🚨 Masalah:
```
Server error

There is a problem with the server configuration.

Check the server logs for more information.
```

Error ini muncul ketika mencoba login di website yang sudah di-deploy di Vercel.

---

## 📋 Kemungkinan Penyebab:

1. ❌ NEXTAUTH_SECRET tidak di-set di Vercel
2. ❌ NEXTAUTH_URL tidak di-set atau salah
3. ❌ DATABASE_URL salah atau database connection failed
4. ❌ Prisma Client tidak ter-generate dengan benar
5. ❌ Environment variables tidak terbaca di server
6. ❌ Runtime configuration error

---

## ✅ SOLUSI LANGKAH DEMI LANGKAH

---

## LANGKAH 1: CEK VERCEL SERVER LOGS

Pertama, kita perlu melihat error yang sebenarnya di Vercel.

### 1.1 Buka Vercel Dashboard
```
Buka: https://vercel.com/dashboard
→ Klik project: sim-tunjangan-guru
```

### 1.2 Buka Deployments
```
Klik tab: Deployments
```

### 1.3 Klik Deployment Terbaru
```
Cari deployment yang aktif (punya icon ✅ di sebelah kiri)
→ Click pada deployment tersebut
```

### 1.4 Cek Function Logs
```
Di halaman deployment, klik tab: Function Logs
→ Scroll ke bawah
→ Cari error dengan teks merah
```

### 1.5 Identifikasi Error

Error yang biasanya muncul:

| Error Type | Error Message |
|------------|---------------|
| NEXTAUTH_SECRET | `NEXTAUTH_SECRET is not defined` atau `JWT_SECRET is not defined` |
| NEXTAUTH_URL | `NEXTAUTH_URL is not defined` |
| Database | `Connection refused`, `ECONNREFUSED`, `P1001: Can't reach database server` |
| Prisma | `PrismaClient initialization error`, `Cannot find module` |
| Runtime | `Runtime Error`, `Server configuration error` |

**Catat error yang muncul!**

---

## LANGKAH 2: FIX NEXTAUTH_SECRET (Paling Sering Menyebabkan Error)

### 2.1 Buka Environment Variables di Vercel
```
Vercel Dashboard
→ Project: sim-tunjangan-guru
→ Tab: Settings
→ Submenu: Environment Variables
```

### 2.2 Cek NEXTAUTH_SECRET
```
Cari variabel: NEXTAUTH_SECRET

Jika TIDAK ADA:
  → Ikuti LANGKAH 2.3

Jika SUDAH ADA:
  → Cek apakah checklist di Production
  → Lanjut ke LANGKAH 3
```

### 2.3 Generate dan Set NEXTAUTH_SECRET Baru

**Langkah 1: Generate Secret**
```
Buka tab baru di browser
→ Kunjungi: https://generate-secret.vercel.app/32
→ Copy secret yang muncul
```

Contoh secret:
```
X7OpFw9S8qL9V0X4Y5Z3QOpw8JxN4r6T5u7v2w3X9Y5Z8Q0R3T7U2V5W8X1Y4
```

**Langkah 2: Set di Vercel**
```
Kembali ke: Vercel → Settings → Environment Variables
→ Click: Add New
→ Isi:
  Name: NEXTAUTH_SECRET
  Value: [Paste secret tadi]
→ Checklist: ✅ Production
→ Checklist: ✅ Preview
→ Click: Save
```

---

## LANGKAH 3: FIX NEXTAUTH_URL

### 3.1 Cek NEXTAUTH_URL
```
Masih di: Vercel → Settings → Environment Variables

Cari variabel: NEXTAUTH_URL

Jika TIDAK ADA:
  → Ikuti LANGKAH 3.2

Jika SUDAH ADA:
  → Cek apakah value benar (harus HTTPS!)
  → Lanjut ke LANGKAH 4
```

### 3.2 Set NEXTAUTH_URL yang Benar

**Langkah 1: Dapatkan URL Production**
```
Vercel Dashboard
→ Tab: Deployments
→ Lihat URL deployment terbaru

Contoh:
https://sim-tunjangan-guru.vercel.app
```

**Langkah 2: Update NEXTAUTH_URL**
```
Vercel → Settings → Environment Variables
→ Cari: NEXTAUTH_URL
→ Click: Edit (ikon pensil)
→ Update value dengan URL production yang benar:

  https://sim-tunjangan-guru.vercel.app

⚠️ PENTING: Gunakan HTTPS, bukan HTTP!
⚠️ PENTING: Jangan gunakan localhost!

→ Click: Save
```

---

## LANGKAH 4: FIX DATABASE_URL

### 4.1 Cek DATABASE_URL
```
Masih di: Vercel → Settings → Environment Variables

Cari variabel: DATABASE_URL
```

### 4.2 Verifikasi Format

**Format yang BENAR:**
```
postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres
```

**Format yang SALAH:**
```
postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
postgresql://postgres:PASSWORD@db.[REF].supabase.co:5432/postgres
```

### 4.3 Jika Salah, Fix!

**Langkah 1: Dapatkan Connection String yang Benar**
```
Buka Supabase Dashboard
→ Settings → Database
→ Scroll ke: Connection Info
→ Copy: Connection String
```

**Langkah 2: Edit Connection String**
Format asli:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

Format setelah diedit (contoh):
```
postgresql://postgres:KucingHitam#12345@db.abc123xyz.supabase.co:5432/postgres
```

Yang harus diganti:
- `[YOUR-PASSWORD]` → Password database Anda
- `[PROJECT-REF]` → Project reference dari dashboard Supabase
- Hapus tanda kurung siku `[` dan `]`

**Langkah 3: Update di Vercel**
```
Vercel → Settings → Environment Variables
→ Cari: DATABASE_URL
→ Click: Edit
→ Paste connection string yang sudah diedit
→ Checklist: ✅ Production
→ Checklist: ✅ Preview
→ Click: Save
```

---

## LANGKAH 5: TAMBAHKAN POSTINSTALL SCRIPT

Ini akan memastikan Prisma Client ter-generate dengan benar setiap deploy.

### 5.1 Buka package.json
```
Di komputer Anda
→ Buka file: package.json
```

### 5.2 Tambah postinstall Script

Cari bagian `"scripts"` di package.json.

Contoh sebelum:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "node .next/standalone/server.js",
  "db:generate": "prisma generate"
}
```

Tambahkan `"postinstall"` script:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "node .next/standalone/server.js",
  "db:generate": "prisma generate",
  "postinstall": "prisma generate"
}
```

⚠️ **PENTING**: Tambahkan `"postinstall": "prisma generate"` di dalam `"scripts"`

### 5.3 Save & Push ke GitHub
```
Simpan file: package.json

Buka GitHub Desktop
→ Commit changes
→ Push to GitHub
```

Vercel akan otomatis redeploy setelah push!

---

## LANGKAH 6: REDEPLOY DI VERCEL

Setelah semua perbaikan, redeploy Vercel.

### 6.1 Redeploy Manual
```
Vercel Dashboard
→ Tab: Deployments
→ Cari deployment terbaru
→ Click tiga titik (⋮) di sebelah kanan
→ Click: Redeploy
→ Click: Redeploy lagi di popup
→ Tunggu 1-3 menit
→ Selesai! ✅
```

### 6.2 Setelah Redeploy
```
Click tombol: Visit deployment
→ Atau click URL:
  https://sim-tunjangan-guru.vercel.app
→ Coba login lagi
```

---

## LANGKAH 7: CLEAR COOKIES

Jika masih ada error, clear cookies browser.

### Untuk Chrome/Edge:
```
Tekan: F12
→ Tab: Application
→ Sidebar: Cookies
→ Click domain website
→ Click: Clear all
→ Refresh browser: Ctrl+Shift+R (Windows) atau Cmd+Shift+R (Mac)
```

### Untuk Safari:
```
Safari → Settings → Privacy
→ Click: Manage Website Data
→ Cari domain website
→ Click: Remove
→ Refresh browser
```

---

## LANGKAH 8: CEK DENGAN BROWSER INCOGNITO/PRIVATE

Untuk memastikan tidak ada cache atau cookies yang menyebabkan masalah:

### Chrome/Edge:
```
Press: Ctrl+Shift+N (Windows) atau Cmd+Shift+N (Mac)
→ Buka: https://sim-tunjangan-guru.vercel.app
→ Coba login
```

### Safari:
```
Press: Cmd+Shift+N
→ Buka: https://sim-tunjangan-guru.vercel.app
→ Coba login
```

Jika login berhasil di incognito/private mode:
- Ada masalah dengan cookies/cache di browser normal
- Clear cookies/cache sudah cukup

---

## 🔍 TROUBLESHOOTING BERDASARKAN ERROR DARI LOGS

### Error 1: "NEXTAUTH_SECRET is not defined"

**Penyebab**: NEXTAUTH_SECRET tidak di-set di Vercel

**Solusi**:
Ikuti **LANGKAH 2** di atas

---

### Error 2: "NEXTAUTH_URL is not defined"

**Penyebab**: NEXTAUTH_URL tidak di-set

**Solusi**:
Ikuti **LANGKAH 3** di atas

---

### Error 3: "Database connection failed" atau "P1001: Can't reach database server"

**Penyebab**:
- DATABASE_URL salah
- Password database salah
- Database Supabase paused

**Solusi**:
1. Cek DATABASE_URL format (LANGKAH 4)
2. Cek password database (bukan password login Supabase)
3. Cek status project Supabase (harus Active)
4. Reset password database jika lupa:
   ```
   Supabase → Settings → Database
   → Reset Database Password
   → Masukkan password baru
   → Update DATABASE_URL di Vercel
   ```

---

### Error 4: "PrismaClient initialization error"

**Penyebab**: Prisma Client tidak ter-generate dengan benar

**Solusi**:
1. Tambah postinstall script (LANGKAH 5)
2. Push ke GitHub
3. Redeploy

---

### Error 5: "Runtime Error" atau "Server configuration error"

**Penyebab**:
- Environment variables tidak terbaca di server
- Runtime configuration salah

**Solusi**:
1. Cek semua 5 environment variables di Vercel:
   - DATABASE_URL
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - NEXTAUTH_URL
   - NEXTAUTH_SECRET

2. Pastikan semua checklist ✅ di Production dan Preview

3. Redeploy

---

## ✅ CHECKLIST PERBAIKAN

Sebelum menganggap selesai, pastikan:

### di Vercel Environment Variables:
- [ ] DATABASE_URL ada ✅
- [ ] DATABASE_URL checklist di Production ✅
- [ ] DATABASE_URL checklist di Preview ✅
- [ ] DATABASE_URL format benar (tidak ada tanda kurung siku) ✅

- [ ] NEXT_PUBLIC_SUPABASE_URL ada ✅
- [ ] NEXT_PUBLIC_SUPABASE_URL checklist di Production ✅
- [ ] NEXT_PUBLIC_SUPABASE_URL checklist di Preview ✅

- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY ada ✅
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY checklist di Production ✅
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY checklist di Preview ✅

- [ ] NEXTAUTH_URL ada ✅
- [ ] NEXTAUTH_URL checklist di Production ✅
- [ ] NEXTAUTH_URL checklist di Preview ✅
- [ ] NEXTAUTH_URL menggunakan HTTPS (bukan HTTP) ✅

- [ ] NEXTAUTH_SECRET ada ✅
- [ ] NEXTAUTH_SECRET checklist di Production ✅
- [ ] NEXTAUTH_SECRET checklist di Preview ✅

### di package.json:
- [ ] postinstall script ada ✅
- [ ] postinstall script = "prisma generate" ✅
- [ ] package.json sudah di-commit dan push ke GitHub ✅

### di Vercel Deployments:
- [ ] Redeploy sudah dilakukan ✅
- [ ] Status: Ready (bukan Failed) ✅
- [ ] Tidak ada error di build log ✅

### di Browser:
- [ ] Cookies sudah di-clear ✅
- [ ] Browser sudah di-refresh (Ctrl+Shift+R / Cmd+Shift+R) ✅
- [ ] Login dicoba di incognito/private mode ✅

---

## 🎯 TEST LOGIN LAGI

Setelah semua perbaikan:

### 1. Buka Website
```
https://sim-tunjangan-guru.vercel.app
```

### 2. Login Admin
```
Username: admin
Password: admin123
Click: Login
```

### 3. Login Guru
```
Logout
Username: guru
Password: guru123
Click: Login
```

---

## ❓ MASIH TIDAK BISA LOGIN?

Jika setelah mengikuti semua langkah di atas masih tidak bisa:

### 1. Ambil Error dari Vercel Function Logs

```
Vercel Dashboard
→ Project → Deployments
→ Click deployment terbaru
→ Tab: Function Logs
→ Scroll ke bawah
→ Screenshot error yang muncul
```

### 2. Ambil Error dari Browser Console

```
Buka website
→ Tekan: F12
→ Tab: Console
→ Screenshot error yang muncul
```

### 3. Cek Environment Variables di Vercel

```
Vercel → Settings → Environment Variables
→ Screenshot semua 5 variables
```

### 4. Cek Project Supabase Status

```
Supabase Dashboard
→ Status project harus: Active
→ Screenshot jika status: Paused
```

Dengan screenshot-screenshot ini, saya bisa membantu diagnose lebih tepat!

---

## 📚 File Pendukung:

- `PANDUAN_LENGKAP_UPLOAD_HOSTING.md` - Panduan lengkap deployment
- `FIX_LOGIN_ISSUE.md` - Panduan fix login issue
- `QUICK_TROUBLESHOOTING.md` - Quick troubleshooting

---

**Semoga berhasil! 🙏**
