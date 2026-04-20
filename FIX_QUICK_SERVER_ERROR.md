# ⚡ FIX CEPAT: Server Error pada Login

## 🚨 Masalah:
"Server error - There is a problem with the server configuration" ketika login

---

## ✅ SOLUSI CEPAT (3 LANGKAH)

---

## LANGKAH 1: UPDATE PACKAGE.JSON

File `package.json` sudah saya update untuk Anda!

Perubahan yang dilakukan:
- ✅ Menggunakan npm (bukan bun)
- ✅ Menambah postinstall script
- ✅ Menyederhanakan build & start script

Tidak perlu edit manual! File sudah diperbarui.

---

## LANGKAH 2: PUSH KE GITHUB

Setelah package.json diperbarui, push ke GitHub:

```
1. Buka GitHub Desktop
2. Cari perubahan di package.json
3. Tulis commit: "Fix: Update package.json for Vercel deployment"
4. Click: Commit to main
5. Click: Push
```

Vercel akan otomatis redeploy setelah push! ⏳ 1-3 menit

---

## LANGKAH 3: CEK & FIX ENVIRONMENT VARIABLES DI VERCEL

Ini paling penting! Cek di Vercel:

### 3.1 Buka Environment Variables
```
https://vercel.com/dashboard
→ Klik project: sim-tunjangan-guru
→ Settings → Environment Variables
```

### 3.2 Cek 5 Variables Berikut:

#### ✅ DATABASE_URL
- Ada? ⬜
- Checklist Production? ⬜
- Checklist Preview? ⬜
- Format benar?
  ```
  postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres
  ```
  Tidak ada tanda kurung siku `[` `]`?

Jika salah atau tidak ada:
```
Supabase Dashboard → Settings → Database
→ Copy Connection String
→ Edit: Ganti [YOUR-PASSWORD] & [PROJECT-REF]
→ Hapus tanda kurung siku [ ]
→ Update di Vercel → Save
→ Checklist Production & Preview
```

#### ✅ NEXT_PUBLIC_SUPABASE_URL
- Ada? ⬜
- Checklist Production? ⬜
- Checklist Preview? ⬜
- Format:
  ```
  https://abc123xyz.supabase.co
  ```

Jika tidak ada:
```
Add New → Name: NEXT_PUBLIC_SUPABASE_URL
→ Value: [Project URL dari Supabase]
→ Checklist Production & Preview → Save
```

#### ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
- Ada? ⬜
- Checklist Production? ⬜
- Checklist Preview? ⬜
- Format:
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

Jika tidak ada:
```
Add New → Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
→ Value: [ANON key dari Supabase]
→ Checklist Production & Preview → Save
```

#### ✅ NEXTAUTH_URL
- Ada? ⬜
- Checklist Production? ⬜
- Checklist Preview? ⬜
- Format:
  ```
  https://sim-tunjangan-guru.vercel.app
  ```
- Menggunakan HTTPS (bukan HTTP)? ⬜

Jika salah:
```
Cek URL production di Vercel Deployments
→ Edit NEXTAUTH_URL
→ Update dengan URL production (HTTPS!)
→ Save
→ Checklist Production & Preview
```

#### ✅ NEXTAUTH_SECRET
- Ada? ⬜
- Checklist Production? ⬜
- Checklist Preview? ⬜

Jika tidak ada:
```
Buka: https://generate-secret.vercel.app/32
→ Copy secret
→ Vercel → Add New
→ Name: NEXTAUTH_SECRET
→ Value: [Paste secret]
→ Checklist Production & Preview
→ Save
```

---

## LANGKAH 4: REDEPLOY MANUAL (Jika Perlu)

Jika setelah push tidak otomatis redeploy:

```
Vercel → Deployments
→ Click deployment terbaru → ⋮ → Redeploy
→ Tunggu 1-3 menit
```

---

## LANGKAH 5: CLEAR COOKIES & TEST

### 5.1 Clear Cookies
```
Chrome/Edge: F12 → Application → Cookies → Clear all
Safari: Safari → Settings → Privacy → Manage Website Data → Remove
```

### 5.2 Refresh Browser
```
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

### 5.3 Test Login
```
Buka: https://sim-tunjangan-guru.vercel.app

1. Login Admin:
   Username: admin
   Password: admin123

2. Logout & Login Guru:
   Username: guru
   Password: guru123
```

---

## ✅ CHECKLIST CEPAT

Selesai jika semua ini:

### Code & Deployment:
- [ ] package.json sudah push ke GitHub
- [ ] postinstall script ada di package.json
- [ ] Vercel otomatis redeploy (atau redeploy manual)
- [ ] Status: Ready (bukan Failed)

### Environment Variables:
- [ ] DATABASE_URL ada & checklist Production & Preview
- [ ] NEXT_PUBLIC_SUPABASE_URL ada & checklist Production & Preview
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY ada & checklist Production & Preview
- [ ] NEXTAUTH_URL ada & checklist Production & Preview
- [ ] NEXTAUTH_SECRET ada & checklist Production & Preview

### Browser:
- [ ] Cookies di-clear
- [ ] Browser di-refresh
- [ ] Login admin berhasil
- [ ] Login guru berhasil

---

## ❓ MASIH ERROR?

### 1. Cek Vercel Logs
```
Vercel → Project → Deployments
→ Click deployment terbaru
→ Tab: Function Logs
→ Cari error
```

### 2. Cek Browser Console
```
Buka website → F12 → Console
→ Cari error
```

### 3. Cek Supabase Status
```
Supabase Dashboard → Status project
→ Harus: Active (bukan Paused)
```

Jika masih error, screenshot error dari:
- Vercel Function Logs
- Browser Console
- Environment Variables di Vercel

---

**Semoga berhasil! 🙏**
