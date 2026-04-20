-- ============================================
-- SQL untuk Verify Data Guru
-- Gunakan di Supabase SQL Editor untuk cek data
-- ============================================

-- ============================================
-- STEP 1: CEK DATA GURU
-- ============================================

SELECT
    "id",
    "nip",
    "nama",
    "golongan",
    "statusSktp",
    "createdAt"
FROM "Guru"
WHERE "id" = 'guru001';

-- ============================================
-- HASIL YANG DIHARAPKAN:
-- ============================================
-- id       | nip                  | nama                | golongan | statusSktp | createdAt
-- ----------+----------------------+---------------------+----------+------------+------------------------
-- guru001   | 198001012000121001 | Ahmad Fauzi, S.Pd   | III/c    | TERBIT     | 2025-01-XX XX:XX:XX

-- ============================================
-- STEP 2: JIKA DATA GURU TIDAK ADA, INSERT MANUAL
-- ============================================

-- Uncomment SQL di bawah ini jika data guru tidak ada:

-- INSERT INTO "Guru" (
--     "id", "nik", "nuptk", "nip", "nama", "pangkat", "golongan",
--     "masaKerja", "namaPemilikRekening", "nomorRekening", "bank",
--     "satuanPendidikan", "gajiPokok", "salurBruto", "pph",
--     "potonganJkn", "salurNetto", "statusSktp", "createdAt", "updatedAt"
-- ) VALUES (
--     'guru001',
--     '1234567890123456',
--     '7654321000123456789',
--     '198001012000121001',
--     'Ahmad Fauzi, S.Pd',
--     'Penata Muda',
--     'III/c',
--     15,
--     'Ahmad Fauzi',
--     '1234567890',
--     'Bank Rakyat Indonesia',
--     'SD Negeri 1 Jakarta',
--     4000000.00,
--     4000000.00,
--     200000.00,
--     40000.00,
--     3760000.00,
--     'TERBIT',
--     CURRENT_TIMESTAMP,
--     CURRENT_TIMESTAMP
-- );

-- ============================================
-- STEP 3: CEK USER DAN GURU CONNECTION
-- ============================================

SELECT
    u."id" as "user_id",
    u."username",
    u."role",
    u."guruId",
    g."id" as "guru_id",
    g."nip",
    g."nama"
FROM "User" u
LEFT JOIN "Guru" g ON u."guruId" = g."id"
WHERE u.username IN ('admin', 'guru')
ORDER BY u."username";

-- ============================================
-- HASIL YANG DIHARAPKAN:
-- ============================================
-- user_id  | username | role | guruId  | guru_id | nip                  | nama
-- ----------+----------+-------+---------+---------+----------------------+---------------------
-- admin001  | admin    | ADMIN | NULL    | NULL    | NULL                 | NULL
-- user001   | guru     | GURU  | guru001 | guru001 | 198001012000121001 | Ahmad Fauzi, S.Pd

-- ============================================
-- STEP 4: JIKA GURU TIDAK TERCONNECT, UPDATE USER
-- ============================================

-- Uncomment SQL di bawah ini jika guruId di user 'guru' salah atau NULL:

-- UPDATE "User"
-- SET "guruId" = 'guru001'
-- WHERE username = 'guru';

-- ============================================
-- STEP 5: FINAL VERIFICATION
-- ============================================

SELECT
    u."username",
    u."role",
    CASE
        WHEN u."role" = 'ADMIN' THEN 'OK (admin tidak perlu guruId)'
        WHEN u."guruId" IS NOT NULL AND g."id" IS NOT NULL THEN 'OK (terconnect ke guru)'
        ELSE 'ERROR (guruId tidak valid)'
    END as "status",
    g."nama" as "guru_nama"
FROM "User" u
LEFT JOIN "Guru" g ON u."guruId" = g."id"
WHERE u.username IN ('admin', 'guru')
ORDER BY u."username";
