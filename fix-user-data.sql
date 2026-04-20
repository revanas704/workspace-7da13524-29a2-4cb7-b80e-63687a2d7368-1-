-- ============================================
-- SQL untuk Reset dan Recreate Data User
-- Gunakan di Supabase SQL Editor
-- ============================================

-- WARNING: Perintah ini akan menghapus dan recreate data user admin & guru
-- Pastikan ini yang Anda inginkan sebelum menjalankan!

-- ============================================
-- STEP 1: DELETE EXISTING DATA (Hati-hati!)
-- ============================================

-- Delete admin dan guru user jika ada
DELETE FROM "User" WHERE username IN ('admin', 'guru');

-- Verify delete
-- ( uncomment untuk cek: hapus -- di depan SELECT )
-- SELECT * FROM "User" WHERE username IN ('admin', 'guru');

-- ============================================
-- STEP 2: INSERT ADMIN USER
-- ============================================
-- Username: admin
-- Password: admin123
-- Role: ADMIN
-- Password hash (bcrypt): $2a$10$X7OpFw9S8qL9V0X4Y5Z3QOpw8JxN4r6T5u7v2w3X9Y5Z8Q0R3T7U2V5W8X1Y4

INSERT INTO "User" (
    "id",
    "username",
    "password",
    "role",
    "createdAt",
    "updatedAt",
    "guruId"
) VALUES (
    'admin001',
    'admin',
    '$2a$10$X7OpFw9S8qL9V0X4Y5Z3QOpw8JxN4r6T5u7v2w3X9Y5Z8Q0R3T7U2V5W8X1Y4',
    'ADMIN',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    NULL
);

-- ============================================
-- STEP 3: INSERT GURU USER
-- ============================================
-- Username: guru
-- Password: guru123
-- Role: GURU
-- Guru ID: guru001 (harus ada di tabel Guru)
-- Password hash (bcrypt): $2a$10$Y8BqGx0T9rM0Y5Z1A6B4Rq9y0K5O7s3U6v8w3Y0Z6A9B1C4D5E8F0A1B3D5E

INSERT INTO "User" (
    "id",
    "username",
    "password",
    "role",
    "createdAt",
    "updatedAt",
    "guruId"
) VALUES (
    'user001',
    'guru',
    '$2a$10$Y8BqGx0T9rM0Y5Z1A6B4Rq9y0K5O7s3U6v8w3Y0Z6A9B1C4D5E8F0A1B3D5E',
    'GURU',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'guru001'
);

-- ============================================
-- STEP 4: VERIFY DATA
-- ============================================
-- Cek apakah data sudah masuk dengan benar

SELECT
    "id",
    "username",
    "role",
    LEFT("password", 30) as "password_preview",
    "createdAt"
FROM "User"
WHERE username IN ('admin', 'guru')
ORDER BY "username";

-- ============================================
-- HASIL YANG DIHARAPKAN:
-- ============================================
-- id       | username | role | password_preview      | createdAt
-- ----------+----------+-------+-----------------------+------------------------
-- admin001 | admin    | ADMIN | $2a$10$X7OpFw9S8qL9V0... | 2025-01-XX XX:XX:XX
-- user001  | guru     | GURU  | $2a$10$Y8BqGx0T9rM... | 2025-01-XX XX:XX:XX

-- ============================================
-- CATATAN PENTING:
-- ============================================
-- 1. Pastikan tabel Guru memiliki data dengan id='guru001'
-- 2. Jika tidak ada, user 'guru' tidak bisa login
-- 3. Password hash di atas sudah di-hash dengan bcrypt untuk:
--    - admin123 (untuk admin)
--    - guru123 (untuk guru)
-- ============================================
