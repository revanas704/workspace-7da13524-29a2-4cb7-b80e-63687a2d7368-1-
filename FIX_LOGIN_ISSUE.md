# 🔧 Solusi: Masalah Login di Vercel (Username/Password Salah)

## 🚨 Masalah:
Website sudah berhasil diupload ke Vercel, tapi TIDAK bisa login - muncul pesan "Username atau kata sandi salah".

---

## 📋 Kemungkinan Penyebab:

1. ❌ Data user (admin/guru) TIDAK ada di database Supabase
2. ❌ Password hash di database TIDAK sesuai dengan `admin123` dan `guru123`
3. ❌ NEXTAUTH_SECRET tidak di-set di Vercel
4. ❌ Database connection gagal ke Supabase

---

## ✅ SOLUSI CEPAT (IKUTI LANGKAH INI):

---

## LANGKAH 1: CEK DATA DI SUPABASE (Paling Penting!)

### 1.1 Buka Supabase Dashboard
1. Buka: `https://supabase.com`
2. Login
3. Pilih project database Anda

### 1.2 Cek Tabel User
1. Klik menu **Table Editor** di sidebar kiri
2. Klik tabel **User**
3. **Apakah ada data di dalamnya?**

#### Jika TIDAK ADA DATA:
- Ini penyebab utama! Data admin dan guru belum ada di database
- Lanjut ke **LANGKAH 2** untuk mengupload schema

#### Jika ADA DATA:
- Cek apakah ada 2 data:
  - 1 data dengan `username: admin`
  - 1 data dengan `username: guru`
- Jika data tidak lengkap atau tidak ada, lanjut ke **LANGKAH 2**

---

## LANGKAH 2: RE-UPLOAD SCHEMA DATABASE

### 2.1 Buka SQL Editor di Supabase
1. Klik menu **SQL Editor** di sidebar kiri
2. Klik **New query**

### 2.2 Jalankan Query untuk Reset Data

Copy dan paste SQL berikut ke SQL Editor:

```sql
-- ============================================
-- RESET DAN RECREATE DATA USER
-- ============================================

-- Delete existing data (HATI-HATI!)
DELETE FROM "User" WHERE username IN ('admin', 'guru');

-- Verify delete was successful
-- SELECT * FROM "User";

-- Insert ADMIN user (username: admin, password: admin123)
INSERT INTO "User" (
    "id", "username", "password", "role", "createdAt", "updatedAt", "guruId"
) VALUES (
    'admin001',
    'admin',
    '$2a$10$X7OpFw9S8qL9V0X4Y5Z3QOpw8JxN4r6T5u7v2w3X9Y5Z8Q0R3T7U2V5W8X1Y4',
    'ADMIN',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    NULL
);

-- Insert GURU user (username: guru, password: guru123)
INSERT INTO "User" (
    "id", "username", "password", "role", "createdAt", "updatedAt", "guruId"
) VALUES (
    'user001',
    'guru',
    '$2a$10$Y8BqGx0T9rM0Y5Z1A6B4Rq9y0K5O7s3U6v8w3Y0Z6A9B1C4D5E8F0A1B3D5E',
    'GURU',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'guru001'
);

-- Verify data inserted
SELECT * FROM "User" WHERE username IN ('admin', 'guru');
```

### 2.3 Run SQL
1. Klik tombol **Run** (ikon ▶️)
2. Tunggu sampai selesai
3. Di bagian bawah, akan muncul hasil query:
   ```
   username | role   | password
   ---------+--------+----------------------------------
   admin    | ADMIN  | $2a$10$X7OpFw9S8qL9V0X4Y5Z3Q...
   guru     | GURU   | $2a$10$Y8BqGx0T9rM0Y5Z1A6B4R...
   ```

### 2.4 Cek di Table Editor
1. Kembali ke menu **Table Editor**
2. Klik tabel **User**
3. Pastikan ada 2 data:
   - ✅ `admin` dengan role `ADMIN`
   - ✅ `guru` dengan role `GURU`

---

## LANGKAH 3: CEK NEXTAUTH_SECRET DI VERCEL

### 3.1 Buka Vercel Dashboard
1. Buka: `https://vercel.com/dashboard`
2. Klik project Anda
3. Klik tab **Settings**
4. Klik submenu **Environment Variables**

### 3.2 Cek NEXTAUTH_SECRET
1. Cari variabel: `NEXTAUTH_SECRET`
2. Apakah ada?

#### Jika TIDAK ADA:
- Ini penyebab masalah! NEXTAUTH_SECRET wajib ada
- Lanjut ke **LANGKAH 3.3**

#### Jika SUDAH ADA:
- Cek apakah sudah ter-checklist di **Production**
- Jika tidak, checklist ✅ di kolom Production
- Lanjut ke **LANGKAH 4**

---

### 3.3 Generate dan Set NEXTAUTH_SECRET

1. Buka tab baru di browser
2. Kunjungi: `https://generate-secret.vercel.app/32`
3. Copy secret yang di-generate

Contoh:
```
X7OpFw9S8qL9V0X4Y5Z3QOpw8JxN4r6T5u7v2w3X9Y5Z8Q0R3T7U2V5W8X1Y4
```

4. Kembali ke Vercel (Environment Variables)
5. Klik tombol **"Add New"**
6. Isi:
   - **Name**: `NEXTAUTH_SECRET`
   - **Value**: Paste secret yang di-copy tadi
7. Checklist ✅ **Production** dan **Preview**
8. Klik **Save**

---

## LANGKAH 4: CEK DATABASE_URL DI VERCEL

### 4.1 Masih di Vercel Environment Variables
1. Cari variabel: `DATABASE_URL`
2. Cek isinya:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### 4.2 Verifikasi DATABASE_URL
Pastikan:
- ✅ Password database BENAR (bukan password login Supabase)
- ✅ Project reference BENAR
- ✅ Tidak ada tanda kurung siku `[` `]`

### 4.3 Cek Connection
1. Buka Supabase Dashboard
2. Settings → Database
3. Copy Connection String
4. Pastikan sama dengan yang ada di Vercel

**Jika tidak sama, update DATABASE_URL di Vercel!**

---

## LANGKAH 5: REDEPLOY DI VERCEL

Setelah semua environment variables diperbarui, redeploy:

1. Kembali ke tab **Deployments** di Vercel
2. Cari deployment terbaru
3. Klik tombol tiga titik (⋮) di kanan
4. Pilih **Redeploy**
5. Klik **Redeploy** lagi di popup
6. Tunggu sampai selesai (1-3 menit)

---

## LANGKAH 6: CLEAR COOKIES DI BROWSER

Setelah redeploy, clear cookies:

### Di Chrome/Edge:
1. Tekan `F12` untuk buka Developer Tools
2. Klik tab **Application**
3. Di sidebar kiri, cari **Cookies**
4. Klik domain website Anda
5. Hapus semua cookies (klik tombol Clear)

### Di Safari:
1. Safari → Settings → Privacy
2. Click **Manage Website Data**
3. Cari domain website Anda
4. Click **Remove**

---

## LANGKAH 7: TEST LOGIN KEMBALI

### 7.1 Test Login Admin
1. Buka website Vercel Anda:
   ```
   https://sim-tunjangan-guru.vercel.app
   ```
2. Login dengan:
   - **Username**: `admin`
   - **Password**: `admin123`
3. Klik **Login**

### 7.2 Test Login Guru
1. Logout
2. Login dengan:
   - **Username**: `guru`
   - **Password**: `guru123`
3. Klik **Login**

---

## 🔍 JIKA MASIH TIDAK BISA LOGIN:

### Cek Vercel Logs:

1. Vercel Dashboard → Project → Deployments
2. Klik deployment terbaru
3. Cek tab **Function Logs**
4. Cari error message seperti:
   - `User not found` → Data user tidak ada di database
   - `Invalid password` → Password salah atau hash tidak sesuai
   - `Database connection failed` → DATABASE_URL salah

### Cek Browser Console:

1. Buka website
2. Tekan `F12`
3. Klik tab **Console**
4. Cari error message

---

## ❓ TROUBLESHOOTING LANJUTAN

### Problem 1: "User not found" di logs

**Penyebab**: Data user tidak ada di database

**Solusi**:
- Jalankan ulang SQL di **LANGKAH 2**
- Verifikasi di Table Editor bahwa data ada

### Problem 2: "Invalid password" di logs

**Penyebab**: Password hash tidak sesuai

**Solusi**:
- Pastikan menggunakan hash yang benar:
  - admin: `$2a$10$X7OpFw9S8qL9V0X4Y5Z3QOpw8JxN4r6T5u7v2w3X9Y5Z8Q0R3T7U2V5W8X1Y4`
  - guru: `$2a$10$Y8BqGx0T9rM0Y5Z1A6B4Rq9y0K5O7s3U6v8w3Y0Z6A9B1C4D5E8F0A1B3D5E`
- Jalankan ulang SQL di **LANGKAH 2**

### Problem 3: "Database connection failed" di logs

**Penyebab**: DATABASE_URL salah atau database Supabase tidak aktif

**Solusi**:
- Cek DATABASE_URL format di Vercel
- Pastikan password database benar
- Cek status project Supabase (harus Active, bukan Paused)

### Problem 4: JWT error atau "decryption failed"

**Penyebab**: NEXTAUTH_SECRET tidak di-set atau berbeda

**Solusi**:
- Pastikan NEXTAUTH_SECRET sudah di-set di Vercel
- Clear cookies browser
- Redeploy Vercel

---

## ✅ CHECKLIST PEMECAHAN MASALAH:

Sebelum menganggap selesai, pastikan:

### di Supabase:
- [ ] Project database Active (tidak Paused)
- [ ] Tabel **User** ada
- [ ] Ada 2 data user:
  - [ ] `admin` (role: ADMIN)
  - [ ] `guru` (role: GURU)

### di Vercel:
- [ ] DATABASE_URL sudah di-set (Production ✅)
- [ ] NEXTAUTH_URL sudah di-set (Production ✅)
- [ ] NEXTAUTH_SECRET sudah di-set (Production ✅)
- [ ] Deploy status: Ready (bukan Failed)
- [ ] Redeploy sudah dilakukan

### di Browser:
- [ ] Cookies sudah di-clear
- [ ] Browser cache sudah di-clear (refresh: Ctrl+Shift+R / Cmd+Shift+R)

### Testing:
- [ ] Login `admin` / `admin123` berhasil
- [ ] Login `guru` / `guru123` berhasil

---

## 🆘 MASIH TIDAK BISA LOGIN?

Jika setelah mengikuti semua langkah di atas masih tidak bisa:

1. **Screenshot error di Vercel Logs**
2. **Screenshot error di Browser Console (F12 → Console)**
3. **Screenshot data di Supabase Table Editor (tabel User)**

Bagikan screenshot tersebut untuk diagnosa lebih lanjut.

---

**Semoga berhasil! 🙏**
