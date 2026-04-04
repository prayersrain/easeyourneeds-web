-- ============================================
-- EASE YOUR NEEDS - ADD USER PASSWORDS
-- Migration: 003_add_user_passwords.sql
-- Description: Add passwords for existing users and create operator accounts
-- Database: PostgreSQL 15+ (Supabase)
-- 
-- INSTRUCTIONS:
-- 1. Copy this entire script
-- 2. Go to Supabase Dashboard -> SQL Editor
-- 3. Paste and run the script
-- 4. Verify results at the bottom of the script
-- ============================================

-- ============================================
-- PASSWORD HASHES (bcrypt with salt rounds = 10)
-- Generated using: bcrypt.hash('password', 10)
-- ============================================
-- admin123 -> $2b$10$YWPfv62u5IVzPHOatKCOQenOfr.rEAbtyWOjSCl.5Xb/6k.rw2Rge
-- support123 -> $2b$10$mbanVN5ItATcc.31sH6rUOchcRhExV6aQL/BMHGMzGPQTnP3lq0iO
-- operator123 -> $2b$10$i.5XGtN8pf3xPMy27oq5MOF6t8.6DrH9VENNHiAf/FjDo6EI4Edke

-- ============================================
-- 1. UPDATE SUPER ADMIN PASSWORD
-- ============================================
UPDATE users 
SET password = '$2b$10$YWPfv62u5IVzPHOatKCOQenOfr.rEAbtyWOjSCl.5Xb/6k.rw2Rge'
WHERE email = 'nodeyourwebapp@gmail.com';

-- ============================================
-- 2. UPDATE CUSTOMER SUPPORT -> OPERATOR + ADD PASSWORD
-- ============================================
UPDATE users 
SET 
    role = 'operator',
    password = '$2b$10$mbanVN5ItATcc.31sH6rUOchcRhExV6aQL/BMHGMzGPQTnP3lq0iO'
WHERE email = 'support@easeyourneeds.com';

-- ============================================
-- 3. CREATE OPERATOR USER ACCOUNTS
-- ============================================
-- Operator A
INSERT INTO users (email, name, phone, role, password, balance, balance_available, balance_locked)
VALUES ('operator.a@easeyourneeds.com', 'Operator A', '+6281234567001', 'operator', 
        '$2b$10$i.5XGtN8pf3xPMy27oq5MOF6t8.6DrH9VENNHiAf/FjDo6EI4Edke',
        0, 0, 0)
ON CONFLICT (email) DO UPDATE SET password = '$2b$10$i.5XGtN8pf3xPMy27oq5MOF6t8.6DrH9VENNHiAf/FjDo6EI4Edke';

-- Operator B
INSERT INTO users (email, name, phone, role, password, balance, balance_available, balance_locked)
VALUES ('operator.b@easeyourneeds.com', 'Operator B', '+6281234567002', 'operator',
        '$2b$10$i.5XGtN8pf3xPMy27oq5MOF6t8.6DrH9VENNHiAf/FjDo6EI4Edke',
        0, 0, 0)
ON CONFLICT (email) DO UPDATE SET password = '$2b$10$i.5XGtN8pf3xPMy27oq5MOF6t8.6DrH9VENNHiAf/FjDo6EI4Edke';

-- Operator C
INSERT INTO users (email, name, phone, role, password, balance, balance_available, balance_locked)
VALUES ('operator.c@easeyourneeds.com', 'Operator C', '+6281234567003', 'operator',
        '$2b$10$i.5XGtN8pf3xPMy27oq5MOF6t8.6DrH9VENNHiAf/FjDo6EI4Edke',
        0, 0, 0)
ON CONFLICT (email) DO UPDATE SET password = '$2b$10$i.5XGtN8pf3xPMy27oq5MOF6t8.6DrH9VENNHiAf/FjDo6EI4Edke';

-- Operator D
INSERT INTO users (email, name, phone, role, password, balance, balance_available, balance_locked)
VALUES ('operator.d@easeyourneeds.com', 'Operator D', '+6281234567004', 'operator',
        '$2b$10$i.5XGtN8pf3xPMy27oq5MOF6t8.6DrH9VENNHiAf/FjDo6EI4Edke',
        0, 0, 0)
ON CONFLICT (email) DO UPDATE SET password = '$2b$10$i.5XGtN8pf3xPMy27oq5MOF6t8.6DrH9VENNHiAf/FjDo6EI4Edke';

-- Operator E
INSERT INTO users (email, name, phone, role, password, balance, balance_available, balance_locked)
VALUES ('operator.e@easeyourneeds.com', 'Operator E', '+6281234567005', 'operator',
        '$2b$10$i.5XGtN8pf3xPMy27oq5MOF6t8.6DrH9VENNHiAf/FjDo6EI4Edke',
        0, 0, 0)
ON CONFLICT (email) DO UPDATE SET password = '$2b$10$i.5XGtN8pf3xPMy27oq5MOF6t8.6DrH9VENNHiAf/FjDo6EI4Edke';

-- Operator F
INSERT INTO users (email, name, phone, role, password, balance, balance_available, balance_locked)
VALUES ('operator.f@easeyourneeds.com', 'Operator F', '+6281234567006', 'operator',
        '$2b$10$i.5XGtN8pf3xPMy27oq5MOF6t8.6DrH9VENNHiAf/FjDo6EI4Edke',
        0, 0, 0)
ON CONFLICT (email) DO UPDATE SET password = '$2b$10$i.5XGtN8pf3xPMy27oq5MOF6t8.6DrH9VENNHiAf/FjDo6EI4Edke';

-- ============================================
-- 4. LINK OPERATOR PROFILES TO USER ACCOUNTS
-- ============================================
UPDATE operator_profiles 
SET user_id = (SELECT id FROM users WHERE email = 'operator.a@easeyourneeds.com')
WHERE name = 'Operator A';

UPDATE operator_profiles 
SET user_id = (SELECT id FROM users WHERE email = 'operator.b@easeyourneeds.com')
WHERE name = 'Operator B';

UPDATE operator_profiles 
SET user_id = (SELECT id FROM users WHERE email = 'operator.c@easeyourneeds.com')
WHERE name = 'Operator C';

UPDATE operator_profiles 
SET user_id = (SELECT id FROM users WHERE email = 'operator.d@easeyourneeds.com')
WHERE name = 'Operator D';

UPDATE operator_profiles 
SET user_id = (SELECT id FROM users WHERE email = 'operator.e@easeyourneeds.com')
WHERE name = 'Operator E';

UPDATE operator_profiles 
SET user_id = (SELECT id FROM users WHERE email = 'operator.f@easeyourneeds.com')
WHERE name = 'Operator F';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- 1. View all users with their password status
SELECT 
    id,
    email,
    name,
    role,
    CASE WHEN password IS NOT NULL THEN '✅' ELSE '❌' END as has_password,
    created_at
FROM users
ORDER BY role, email;

-- 2. View operator profiles linked to users
SELECT 
    op.name,
    op.tier,
    op.is_available,
    u.email,
    u.id as user_id
FROM operator_profiles op
LEFT JOIN users u ON op.user_id = u.id
ORDER BY op.name;

-- ============================================
-- SUMMARY OF CREDENTIALS
-- ============================================
-- Super Admin: nodeyourwebapp@gmail.com / admin123
-- Support/Operator: support@easeyourneeds.com / support123
-- Operator A: operator.a@easeyourneeds.com / operator123
-- Operator B: operator.b@easeyourneeds.com / operator123
-- Operator C: operator.c@easeyourneeds.com / operator123
-- Operator D: operator.d@easeyourneeds.com / operator123
-- Operator E: operator.e@easeyourneeds.com / operator123
-- Operator F: operator.f@easeyourneeds.com / operator123
