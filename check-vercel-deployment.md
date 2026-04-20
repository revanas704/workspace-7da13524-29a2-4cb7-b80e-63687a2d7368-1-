# 🔍 CHECKLIST: Perbaiki Server Error di Vercel

## Gunakan checklist ini untuk memperbaiki "Server error" pada login

---

## ✅ STEP 1: Cek Environment Variables di Vercel

### 1.1 Buka Vercel
```
https://vercel.com/dashboard → Klik project → Settings → Environment Variables
```

### 1.2 Cek 5 Variables Berikut:

| Variable | Ada? | Production ✓ | Preview ✓ | Value Benar? |
|----------|-------|---------------|-------------|---------------|
| DATABASE_URL | ⬜ | ⬜ | ⬜ | ⬜ |
| NEXT_PUBLIC_SUPABASE_URL | ⬜ | ⬜ | ⬜ | ⬜ |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | ⬜ | ⬜ | ⬜ | ⬜ |
| NEXTAUTH_URL | ⬜ | ⬜ | ⬜ | ⬜ |
| NEXTAUTH_SECRET | ⬜ | ⬜ | ⬜ | ⬜ |

**Jika ada yang tidak ada/tidak checklist, ikuti panduan di bawah:**

---

## ✅ STEP 2: Fix Database_URL

### 2.1 Format yang BENAR:
```
postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres
```

### 2.2 Format yang SALAH (❌):
```
postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
postgresql://postgres:PASSWORD@db.[REF].supabase.co:5432/postgres
```

### 2.3 Cara Perbaiki:

```
1. Buka Supabase Dashboard
2. Settings → Database → Copy Connection String
3. Edit:
   - Ganti [YOUR-PASSWORD] dengan password database
   - Ganti [PROJECT-REF] dengan project reference
   - Hapus tanda kurung siku [ ]
4. Update di Vercel → Save
5. Checklist Production & Preview
```

---

## ✅ STEP 3: Fix NEXTAUTH_URL

### 3.1 Value yang BENAR:
```
https://sim-tunjangan-guru.vercel.app
```

### 3.2 Value yang SALAH (❌):
```
http://localhost:3000
http://sim-tunjangan-guru.vercel.app
https://localhost:3000
```

### 3.3 Cara Perbaiki:

```
1. Cek URL production di Vercel Deployments
2. Update NEXTAUTH_URL dengan URL production
3. Pastikan HTTPS (bukan HTTP)
4. Save
5. Checklist Production & Preview
```

---

## ✅ STEP 4: Fix NEXTAUTH_SECRET

### 4.1 Generate Secret Baru:
```
Buka: https://generate-secret.vercel.app/32
→ Copy secret yang muncul
```

### 4.2 Set di Vercel:
```
Vercel → Settings → Environment Variables
→ Add New
→ Name: NEXTAUTH_SECRET
→ Value: [Paste secret]
→ Checklist Production & Preview
→ Save
```

---

## ✅ STEP 5: Tambah Postinstall Script

### 5.1 Buka package.json di komputer

### 5.2 Cari "scripts":
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "node .next/standalone/server.js",
  "db:generate": "prisma generate"
}
```

### 5.3 Tambah postinstall:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "node .next/standalone/server.js",
  "db:generate": "prisma generate",
  "postinstall": "prisma generate"
}
```

### 5.4 Push ke GitHub:
```
GitHub Desktop → Commit → Push
```

---

## ✅ STEP 6: Redeploy Vercel

```
Vercel → Deployments
→ Click deployment terbaru → ⋮ → Redeploy
→ Tunggu 1-3 menit
→ Click URL
```

---

## ✅ STEP 7: Clear Cookies

### Chrome/Edge:
```
F12 → Application → Cookies
→ Click domain → Clear all
→ Refresh: Ctrl+Shift+R
```

### Safari:
```
Safari → Settings → Privacy
→ Manage Website Data → Remove domain
→ Refresh
```

---

## ✅ STEP 8: Test Login

### 8.1 Test di Browser Normal:
```
Buka: https://sim-tunjangan-guru.vercel.app
→ Login: admin/admin123
→ Login: guru/guru123
```

### 8.2 Test di Incognito/Private:
```
Chrome: Ctrl+Shift+N
Safari: Cmd+Shift+N
→ Buka URL → Test login
```

---

## 📋 CHECKLIST FINAL

Sebelum selesai, checklist semua:

### Environment Variables:
- [ ] DATABASE_URL ada & checklist Production & Preview
- [ ] DATABASE_URL format benar (tidak ada [ ])
- [ ] NEXT_PUBLIC_SUPABASE_URL ada & checklist Production & Preview
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY ada & checklist Production & Preview
- [ ] NEXTAUTH_URL ada & checklist Production & Preview
- [ ] NEXTAUTH_URL menggunakan HTTPS
- [ ] NEXTAUTH_SECRET ada & checklist Production & Preview

### Code:
- [ ] postinstall script ada di package.json
- [ ] package.json sudah push ke GitHub

### Deployment:
- [ ] Redeploy sudah dilakukan
- [ ] Status: Ready
- [ ] Tidak ada error di build log

### Browser:
- [ ] Cookies sudah di-clear
- [ ] Browser sudah di-refresh
- [ ] Login dicoba di incognito/private mode

### Testing:
- [ ] Login admin berhasil
- [ ] Login guru berhasil
- [ ] Tidak ada server error

---

## ❓ Masih Error?

### Ambil Informasi Berikut:

1. **Vercel Function Logs:**
```
Vercel → Project → Deployments
→ Click deployment terbaru
→ Tab: Function Logs
→ Screenshot error
```

2. **Browser Console:**
```
Buka website → F12 → Console
→ Screenshot error
```

3. **Environment Variables:**
```
Vercel → Settings → Environment Variables
→ Screenshot semua 5 variables
```

Dengan informasi ini, bisa dibantu lebih tepat!

---

**Semoga berhasil! 🙏**
