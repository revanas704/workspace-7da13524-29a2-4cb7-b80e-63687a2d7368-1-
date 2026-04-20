# 🔧 Panduan Memperbaiki Deploy Gagal di Vercel

## 🚨 Masalah:
Deploy ke Vercel gagal (Build Failed)

---

## 📋 Langkah-Langkah Perbaikan

---

## LANGKAH 1: CEK ERROR DI VERCEL

### 1.1 Buka Vercel Dashboard
```
https://vercel.com/dashboard
→ Klik project: sim-tunjangan-guru
```

### 1.2 Buka Deployment yang Gagal
```
Tab: Deployments
→ Klik deployment yang gagal (punya icon ❌ atau warna)
```

### 1.3 Baca Error Message
```
Bagian: Build Output
→ Scroll ke bawah
→ Cari error yang muncul (teks merah)
```

### 1.4 Catat Error yang Muncul

Error yang biasa terjadi:

| Error | Penyebab | Solusi |
|-------|----------|--------|
| `Module not found` | Dependencies tidak ada | LANGKAH 2 |
| `Cannot find module` | File hilang/path salah | LANGKAH 2 |
| `Syntax error` | Kode salah | LANGKAH 2 |
| `Environment variable undefined` | ENV tidak di-set | LANGKAH 3 |
| `Build timeout` | Build terlalu lama | LANGKAH 4 |

**Catat error yang muncul!** Ini akan membantu saya memperbaiki.

---

## LANGKAH 2: CEK ENVIRONMENT VARIABLES DI VERCEL

Ini penyebab paling umum dari deploy gagal!

### 2.1 Buka Environment Variables
```
Vercel Dashboard
→ Project: sim-tunjangan-guru
→ Settings → Environment Variables
```

### 2.2 Cek 5 Variables Ini:

| Variable | Ada? | Production ✅ | Preview ✅ |
|----------|-------|---------------|-----------|
| DATABASE_URL | ⬜ | ⬜ | ⬜ |
| NEXT_PUBLIC_SUPABASE_URL | ⬜ | ⬜ | ⬜ |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | ⬜ | ⬜ | ⬜ |
| NEXTAUTH_URL | ⬜ | ⬜ | ⬜ |
| NEXTAUTH_SECRET | ⬜ | ⬜ | ⬜ |

### 2.3 Pastikan Semua Variables Ada dan Checklist

**DATABASE_URL**
```
Format yang BENAR:
postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres

Contoh:
postgresql://postgres:KucingHitam#12345@db.abc123xyz.supabase.co:5432/postgres
```

**NEXT_PUBLIC_SUPABASE_URL**
```
Format yang BENAR:
https://abc123xyz.supabase.co
```

**NEXT_PUBLIC_SUPABASE_ANON_KEY**
```
Format yang BENAR:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**NEXTAUTH_URL**
```
Format yang BENAR:
https://sim-tunjangan-guru.vercel.app
⚠️ PENTING: Harus HTTPS, bukan HTTP!
```

**NEXTAUTH_SECRET**
```
Format yang BENAR:
X7OpFw9S8qL9V0X4Y5Z3QOpw8JxN4r6T5u7v2w3X9Y5Z8Q0R3T7U2V5W8X1Y4
```

---

## LANGKAH 3: REDEPLOY DENGAN CLEAN BUILD

### 3.1 Clear Build Cache

```
Vercel Dashboard
→ Project: sim-tunjangan-guru
→ Settings → General
→ Scroll ke: Build & Development
→ Klik: Clear Build Cache
→ Tunggu proses selesai
```

### 3.2 Trigger Redeploy

**Opsi A: Deploy Ulang dari Git**
```
1. Buka GitHub Desktop
2. Commit perubahan terbaru
   - Message: "Fix deployment issues"
3. Push ke GitHub
4. Vercel akan otomatis redeploy
```

**Opsi B: Redeploy Manual**
```
Vercel Dashboard
→ Deployments
→ Klik deployment yang gagal
→ Klik tiga titik (⋮)
→ Klik: Redeploy
→ Tunggu 1-3 menit
```

---

## LANGKAH 4: CEK PACKAGE.JSON

Pastikan scripts di `package.json` benar:

### 4.1 Cek File package.json
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "db:generate": "prisma generate",
    "postinstall": "prisma generate"
  }
}
```

**Catatan Penting:**
- ✅ "dev" gunakan `next dev` (bukan bun)
- ✅ "build" gunakan `next build` (bukan `&& cp -r .next/standalone`)
- ✅ Ada script `postinstall: "prisma generate"`

### 4.2 Jika package.json Salah

Jika masih ada script seperti:
```json
"dev": "next dev -p 3000 2>&1 | tee dev.log",
"build": "next build && cp -r .next/static .next/standalone/...",
"start": "NODE_ENV=production bun .next/standalone/server.js...",
```

Saya sudah perbaikinya sebelumnya. Pastikan di komputer lokal file sudah benar.

---

## LANGKAH 5: PUSH PERUBAHAN KE GITHUB

### 5.1 Cek Apa Sama dengan Lokal

Buka `package.json` di komputer Anda.

Pastikan isinya:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "db:generate": "prisma generate",
    "postinstall": "prisma generate"
  }
}
```

### 5.2 Push ke GitHub

**Dengan GitHub Desktop:**
```
1. Buka GitHub Desktop
2. Cari file yang berubah
3. Commit:
   - Message: "Fix: Update package.json for Vercel deployment"
4. Push ke GitHub
```

**Dengan Terminal/Command Line:**
```bash
git add .
git commit -m "Fix: Update package.json for Vercel deployment"
git push origin main
```

---

## LANGKAH 6: MONITOR DEPLOY BARU

### 6.1 Cek Status Deploy

```
Vercel Dashboard
→ Deployments
→ Lihat deployment terbaru
```

### 6.2 Waktu Normal

Deploy biasanya membutuhkan:
- **1-3 menit** untuk Next.js project
- Jika lebih dari 5 menit, mungkin ada issue

### 6.3 Build Stages

```
Cloning repository
Installing dependencies
Building Next.js
Compiling
```

Jika gagal di salah satu tahap, Vercel akan menampilkan error di bagian **Build Output**.

---

## LANGKAH 7: SOLUSI ERROR SPESIFIK

Berdasarkan error yang muncul, ikuti solusi berikut:

---

### ERROR TYPE 1: "Module not found" atau "Cannot find module"

**Solusi:**
```bash
1. Pastikan semua dependencies ter-install:
   npm install

2. Jika ada file dependencies yang salah:
   rm -rf node_modules package-lock.json
   npm install

3. Push perubahan ke GitHub
```

---

### ERROR TYPE 2: "Syntax Error" atau "Unexpected token"

**Solusi:**
```bash
1. Cek code di file yang terakhir di-edit
   - /src/app/guru/dak/page.tsx
   - /src/app/admin/dak/page.tsx

2. Cek apakah ada syntax error:
   npm run lint

3. Fix error yang ditemukan
4. Push perubahan ke GitHub
```

---

### ERROR TYPE 3: "DATABASE_URL is undefined" atau env variable error

**Solusi:**

**Step 1: Cek Environment Variables di Vercel**
```
Vercel → Settings → Environment Variables

Pastikan semua 5 variables ada:
✓ DATABASE_URL
✓ NEXT_PUBLIC_SUPABASE_URL
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY
✓ NEXTAUTH_URL
✓ NEXTAUTH_SECRET
```

**Step 2: Pastikan Production Checklist**
Untuk setiap variable:
- Ada checklist ✅ di kolom Production
- Ada checklist ✅ di kolom Preview

**Step 3: Jika Ada yang Hilang**
Klik "Add New" dan tambahkan ulang.

---

### ERROR TYPE 4: "Build timeout" atau memakan waktu terlalu lama

**Solusi:**

**Step 1: Clear Build Cache**
```
Vercel → Settings → General
→ Clear Build Cache
```

**Step 2: Cek Dependencies**
Pastikan `package.json` tidak terlalu banyak dependencies yang tidak perlu.

**Step 3: Redeploy Ulang**
Push commit ke GitHub dan biarkan Vercel auto-deploy.

---

### ERROR TYPE 5: "Error: Prisma Client initialization"

**Solusi:**

Pastikan `package.json` ada script:
```json
"postinstall": "prisma generate"
```

Script ini akan otomatis generate Prisma Client setiap kali build di Vercel.

---

## LANGKAH 8: VERIFIKASI DEPLOY BERHASIL

### 8.1 Cek Status Deploy

```
Vercel Dashboard
→ Deployments
→ Lihat deployment terbaru
```

**Tanda Deploy Berhasil:**
- ✅ Icon: 🟢 (hijau)
- ✅ Status: Ready
- ✅ Build duration: 1-3 menit

### 8.2 Buka Website

Klik tombol "Visit" atau URL deployment:
```
https://sim-tunjangan-guru.vercel.app
```

### 8.3 Test Login

**Test Login Admin:**
```
Username: admin
Password: admin123
```

**Test Login Guru:**
```
Username: guru
Password: guru123
```

### 8.4 Cek Tampilan Detail DAK

Buka halaman:
- Halaman Guru: `/guru/dak`
- Halaman Admin: `/admin/dak`

Pastikan:
- ✅ Header tidak terpotong
- ✅ Tabel detail rapi
- ✅ Kolom sejajar
- ✅ Pagination rapi
- ✅ Responsive di mobile

---

## ✅ CHECKLIST DEPLOY

Sebelum menganggap selesai, pastikan:

### di Vercel:
- [ ] Environment variables: 5 variables ada
- [ ] Environment variables: semua checklist Production
- [ ] Environment variables: semua checklist Preview
- [ ] Build cache: sudah di-clear
- [ ] Deploy status: Ready (bukan Failed)
- [ ] Build duration: 1-3 menit

### di GitHub:
- [ ] Package.json sudah diperbarui
- [ ] Perubahan sudah di-push
- [ ] Commit message jelas: "Fix: Update package.json for Vercel deployment"

### di Website:
- [ ] URL bisa diakses
- [ ] Halaman tidak blank
- [ ] Login admin berhasil
- [ ] Login guru berhasil
- [ ] Data dari Supabase muncul
- [ ] Tampilan Detail DAK sudah rapi

---

## ❓ MASIH DEPLOY GAGAL?

Jika setelah mengikuti semua langkah di atas masih gagal:

### Step 1: Ambil Error Screenshot

**Vercel Build Logs:**
```
1. Vercel Dashboard
2. Deployments
3. Klik deployment yang gagal
4. Screenshot error di Build Output
```

### Step 2: Screenshot Environment Variables

```
1. Vercel Dashboard
2. Settings → Environment Variables
3. Screenshot semua variables
```

### Step 3: Share Information Dengan Saya

Berikan:
1. Screenshot error dari Vercel Build Output
2. Screenshot environment variables dari Vercel
3. Error message yang muncul (copy teks)

Dengan informasi ini, saya bisa membantu memperbaiki masalah spesifik Anda.

---

## 💡 TIPS UNTUK MENCEGAH DEPLOY GAGAL

### Tip 1: Jangan Lupa Postinstall Script

Pastikan `package.json` punya:
```json
"postinstall": "prisma generate"
```

### Tip 2: Environment Variables harus Sama

Pastikan environment variables di Vercel SAMA dengan yang Anda gunakan di lokal.

### Tip 3: Push Perubahan Satu Per Satu

Push commit baru setiap kali perubahan:
```
Commit kecil → Push → Deploy otomatis
```

Vercel akan auto-deploy setiap push, jadi Anda bisa dengan cepat tahu jika ada error.

### Tip 4: Clear Build Cache Sebelum Redeploy

Jika deploy gagal, clear build cache dulu sebelum redeploy.

---

## 📞 RESOURCE TAMBAHAN

### Dokumentasi Resmi:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

### Panduan Tambahan:
- `VERCEL_SUPABASE_GUIDE.md` - Panduan lengkap Vercel + Supabase
- `PANDUAN_LENGKAP_UPLOAD_HOSTING.md` - Panduan lengkap deploy
- `FIX_ERROR_LOKAL_LOGIN.md` - Fix error login lokal

---

**Silakan ikuti langkah-langkah di atas dan coba deploy ulang. Jika masih gagal, share screenshot error dari Vercel Build Output agar saya bisa membantu lebih tepat!** 🙏
