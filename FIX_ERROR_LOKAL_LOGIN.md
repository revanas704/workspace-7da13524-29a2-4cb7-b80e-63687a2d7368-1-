# ✅ FIX ERROR: Server Error pada Login (WEBSITE LOKAL)

## 🚨 Error yang Terjadi:
```
Server error
There is a problem with the server configuration.
Check the server logs for more information.
```

---

## 🔍 Penyebab Error:

Dari `dev.log` dijalankan, error yang muncul:
```
NEXTAUTH_URL: undefined
NEXTAUTH_SECRET: NOT SET
```

File `.env` Anda hanya berisi:
```
DATABASE_URL=file:/home/z/my-project/db/custom.db
```

Tapi **TIDAK ada**:
- ❌ NEXTAUTH_URL
- ❌ NEXTAUTH_SECRET

Ini menyebabkan NextAuth tidak bisa encrypt/decrypt session cookies!

---

## ✅ SOLUSI: FILE .ENV SUDAH DI-UPDATE!

Saya sudah update file `.env` untuk Anda. Sekarang file berisi:

```env
# Database lokal
DATABASE_URL=file:/home/z/my-project/db/custom.db

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=rahasia-secret-key-untuk-auth-1234567890
```

---

## 🚀 RESTART DEV SERVER (PENTING!)

Agar environment variables baru terbaca, Anda harus restart dev server.

### Cara 1: Jika Dev Server Berjalan di Terminal

1. Buka terminal tempat dev server berjalan
2. Tekan: `Ctrl + C` (Windows) atau `Cmd + C` (Mac)
3. Tunggu dev server berhenti
4. Jalankan ulang:
   ```bash
   npm run dev
   ```

### Cara 2: Jika Dev Server Berjalan di Background

```bash
# Stop dev server
npm run dev

# Jalankan ulang
npm run dev
```

---

## ✅ VERIFIKASI

### 1. Cek apakah Environment Variables Terbaca

Setelah restart, dev.log akan menampilkan:

```
=== NextAuth Configuration ===
NODE_ENV: development
NEXTAUTH_URL: http://localhost:3000
NEXTAUTH_SECRET: [Set]  ← Harus bukan "NOT SET" lagi!
isDevelopment: true
```

### 2. Cek Dev Log Terbaru

```bash
# Cek 20 baris terakhir
tail -n 20 dev.log
```

Pastikan:
- `NEXTAUTH_URL` bukan `undefined` ✅
- `NEXTAUTH_SECRET` bukan `NOT SET` ✅

### 3. Buka Website dan Test Login

1. Buka: `http://localhost:3000`
2. Login dengan admin:
   - Username: `admin`
   - Password: `admin123`
3. Login harus berhasil! ✅

---

## 🔍 JIKA MASIH ERROR

### Error 1: "NEXTAUTH_SECRET masih NOT SET"

**Penyebab**: Dev server tidak restart setelah update .env

**Solusi**:
```bash
# Stop dev server
Ctrl + C (atau Cmd + C)

# Jalankan ulang
npm run dev
```

### Error 2: "JWEDecryptionFailed masih muncul"

**Penyebab**: Ada cookies lama di browser

**Solusi**:

**Clear Cookies:**
1. Buka website
2. Tekan `F12`
3. Tab: Application
4. Sidebar: Cookies
5. Click: `http://localhost:3000`
6. Click: Clear all

**Refresh Browser:**
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### Error 3: Environment variables tidak terbaca

**Penyebab**: File .env tidak terbaca dengan benar

**Solusi**:

Cek apakah file `.env` benar:
```bash
cat .env
```

Harus menampilkan:
```
# Database lokal
DATABASE_URL=file:/home/z/my-project/db/custom.db

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=rahasia-secret-key-untuk-auth-1234567890
```

### Error 4: Dev server gagal restart

**Penyebab**: Port 3000 masih terpakai

**Solusi**:

```bash
# Cari proses yang pakai port 3000
lsof -i :3000

# Kill proses
kill -9 [PID]

# Jalankan ulang dev server
npm run dev
```

---

## ✅ CHECKLIST FIX

- [ ] File `.env` sudah di-update
- [ ] NEXTAUTH_URL: http://localhost:3000
- [ ] NEXTAUTH_SECRET: rahasia-secret-key-untuk-auth-1234567890
- [ ] Dev server sudah di-restart
- [ ] Dev log menampilkan `NEXTAUTH_URL: http://localhost:3000`
- [ ] Dev log menampilkan `NEXTAUTH_SECRET: [Set]`
- [ ] Cookies browser sudah di-clear
- [ ] Browser di-refresh
- [ ] Buka: http://localhost:3000
- [ ] Login admin (admin/admin123) berhasil
- [ ] Login guru (guru/guru123) berhasil

---

## 🎯 HASIL

Setelah fix ini:
- ✅ Website lokal tidak lagi error
- ✅ Login berfungsi dengan normal
- ✅ NextAuth bisa encrypt/decrypt session cookies
- ✅ Environment variables terbaca dengan benar

---

**Silakan restart dev server sekarang dan coba login lagi! 🚀**
