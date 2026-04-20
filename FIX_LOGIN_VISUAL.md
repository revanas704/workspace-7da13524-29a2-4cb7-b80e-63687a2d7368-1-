# 🔧 FIX LOGIN VISUAL GUIDE

## Masalah: Tidak Bisa Login di Vercel

---

## LANGKAH 1: CEK DATA DI SUPABASE

### 1.1 Buka Supabase Dashboard
```
Buka: https://supabase.com → Login → Klik project Anda
```

### 1.2 Buka Table Editor
```
Sidebar kiri → Klik "Table Editor"
```

### 1.3 Klik Tabel User
```
Table Editor → Klik "User"
```

### 1.4 Apakah Ada Data?
```
✅ Jika ADA: Lanjut ke LANGKAH 2
❌ Jika TIDAK ADA: Ikuti LANGKAH 1.5 di bawah
```

### 1.5 Jika TIDAK ADA DATA:
```
Sidebar kiri → Klik "SQL Editor"
            → Klik "New query"
            → Copy isi file: fix-user-data.sql
            → Paste ke SQL Editor
            → Klik tombol "Run"
            → Done! ✅
```

---

## LANGKAH 2: CEK NEXTAUTH_SECRET DI VERCEL

### 2.1 Buka Vercel Dashboard
```
Buka: https://vercel.com/dashboard → Klik project Anda
```

### 2.2 Buka Environment Variables
```
Settings → Environment Variables
```

### 2.3 Cek NEXTAUTH_SECRET
```
Cari variabel: NEXTAUTH_SECRET

❌ Jika TIDAK ADA: Ikuti LANGKAH 2.4
✅ Jika SUDAH ADA: Lanjut ke LANGKAH 3
```

### 2.4 Tambahkan NEXTAUTH_SECRET
```
1. Buka tab baru di browser
2. Kunjungi: https://generate-secret.vercel.app/32
3. Copy secret yang muncul
   Contoh: X7OpFw9S8qL9V0X4Y5Z3QOpw8...
4. Kembali ke Vercel (Environment Variables)
5. Klik "Add New"
6. Name: NEXTAUTH_SECRET
7. Value: [Paste secret tadi]
8. Checklist ✅ Production
9. Klik Save
```

---

## LANGKAH 3: CEK DATABASE_URL DI VERCEL

### 3.1 Cek DATABASE_URL
```
Masih di: Vercel → Settings → Environment Variables
```

### 3.2 Format yang BENAR:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### 3.3 Format yang SALAH (❌):
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### 3.4 Jika SALAH, Fix:
```
1. Buka Supabase Dashboard → Settings → Database
2. Copy "Connection String"
3. Ganti [YOUR-PASSWORD] dengan password database Anda
4. Ganti [PROJECT-REF] dengan project reference
5. Hapus tanda kurung siku [ ]
6. Kembali ke Vercel → Edit DATABASE_URL → Update → Save
```

---

## LANGKAH 4: REDEPLOY DI VERCEL

### 4.1 Redeploy
```
Vercel Dashboard → Deployments
            → Klik deployment terbaru
            → Klik tiga titik (⋮) di kanan
            → Klik "Redeploy"
            → Klik "Redeploy" lagi
            → Tunggu 1-3 menit
            → Done! ✅
```

---

## LANGKAH 5: CLEAR COOKIES

### 5.1 Di Chrome/Edge:
```
Tekan F12 → Tab Application
         → Cookies di sidebar kiri
         → Klik domain website
         → Klik "Clear all"
         → Done! ✅
```

### 5.2 Di Safari:
```
Safari → Settings → Privacy
      → Manage Website Data
      → Cari domain website
      → Remove
      → Done! ✅
```

---

## LANGKAH 6: TEST LOGIN

### 6.1 Buka Website
```
https://sim-tunjangan-guru.vercel.app
```

### 6.2 Login Admin
```
Username: admin
Password: admin123
Klik Login

✅ Berhasil: Redirect ke dashboard admin
❌ Gagal: Lanjut ke TROUBLESHOOTING
```

### 6.3 Login Guru
```
Username: guru
Password: guru123
Klik Login

✅ Berhasil: Redirect ke dashboard guru
❌ Gagal: Lanjut ke TROUBLESHOOTING
```

---

## TROUBLESHOOTING

### Problem 1: Login Gagal Terus
```
Cek:
1. Apakah NEXTAUTH_SECRET sudah ada di Vercel?
2. Apakah DATABASE_URL sudah benar?
3. Apakah data user sudah ada di Supabase Table Editor?

Fix:
- Jika tidak, ikuti LANGKAH 1-4 di atas
```

### Problem 2: Error "User not found"
```
Penyebab: Data user tidak ada di database

Fix:
- Jalankan SQL dari file: fix-user-data.sql
- Di Supabase SQL Editor → Run
```

### Problem 3: Error "Invalid password"
```
Penyebab: Password hash salah

Fix:
- Jalankan SQL dari file: fix-user-data.sql
- Pastikan menggunakan hash yang benar:
  admin: $2a$10$X7OpFw9S8qL9V0X4Y5Z3QOpw8...
  guru: $2a$10$Y8BqGx0T9rM0Y5Z1A6B4Rq9y0...
```

### Problem 4: Error Database Connection Failed
```
Penyebab: DATABASE_URL salah atau database tidak aktif

Fix:
- Cek password database di Supabase Settings
- Update DATABASE_URL di Vercel
- Pastikan project Supabase status: Active
```

---

## CHECKLIST AKHIR

Selesai jika semua ini:

- [ ] Data user ada di Supabase (admin & guru)
- [ ] NEXTAUTH_SECRET ada di Vercel (Production ✅)
- [ ] DATABASE_URL benar di Vercel (Production ✅)
- [ ] Redeploy sudah dilakukan
- [ ] Cookies sudah di-clear
- [ ] Login admin berhasil (admin/admin123)
- [ ] Login guru berhasil (guru/guru123)

---

## 🎉 SELESAI!

Website Anda sekarang sudah bisa login!

---
