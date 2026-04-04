-- ============================================
-- EASE YOUR NEEDS - DATABASE SEED DATA (PRODUCTION)
-- Migration: 002_seed_data.sql
-- Description: Insert real production data
-- Database: PostgreSQL 15+ (Supabase)
-- ============================================

-- ============================================
-- 1. ADMIN & DEMO USERS
-- ============================================
INSERT INTO users (email, "emailVerified", name, phone, role, balance, balance_available, balance_locked) VALUES
('nodeyourwebapp@gmail.com', NOW(), 'Admin Ease', '+6285283142289', 'super_admin', 0, 0, 0),
('support@easeyourneeds.com', NOW(), 'Customer Support', NULL, 'admin', 0, 0, 0),
('customer@demo.com', NOW(), 'Demo Customer', '+6281234567899', 'customer', 1000000, 1000000, 0)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 2. ZOOM ACCOUNTS (20 Business + 10 Backup)
-- ============================================
INSERT INTO zoom_accounts (account_id, account_email, daily_limit, concurrent_limit, is_backup, account_tier, status) VALUES
('acc_001', 'zoom001@easeyourneeds.com', 100, 2, FALSE, 'business_active', 'active'),
('acc_002', 'zoom002@easeyourneeds.com', 100, 2, FALSE, 'business_active', 'active'),
('acc_003', 'zoom003@easeyourneeds.com', 100, 2, FALSE, 'business_active', 'active'),
('acc_004', 'zoom004@easeyourneeds.com', 100, 2, FALSE, 'business_active', 'active'),
('acc_005', 'zoom005@easeyourneeds.com', 100, 2, FALSE, 'business_active', 'active'),
('acc_006', 'zoom006@easeyourneeds.com', 100, 2, FALSE, 'business_active', 'active'),
('acc_007', 'zoom007@easeyourneeds.com', 100, 2, FALSE, 'business_active', 'active'),
('acc_008', 'zoom008@easeyourneeds.com', 100, 2, FALSE, 'business_active', 'active'),
('acc_009', 'zoom009@easeyourneeds.com', 100, 2, FALSE, 'business_active', 'active'),
('acc_010', 'zoom010@easeyourneeds.com', 100, 2, FALSE, 'business_active', 'active'),
('acc_011', 'zoom011@easeyourneeds.com', 100, 2, FALSE, 'business_active', 'active'),
('acc_012', 'zoom012@easeyourneeds.com', 100, 2, FALSE, 'business_active', 'active'),
('acc_013', 'zoom013@easeyourneeds.com', 100, 2, FALSE, 'business_active', 'active'),
('acc_014', 'zoom014@easeyourneeds.com', 100, 2, FALSE, 'business_active', 'active'),
('acc_015', 'zoom015@easeyourneeds.com', 100, 2, FALSE, 'business_active', 'active'),
('acc_016', 'zoom016@easeyourneeds.com', 100, 2, FALSE, 'business_active', 'active'),
('acc_017', 'zoom017@easeyourneeds.com', 100, 2, FALSE, 'business_active', 'active'),
('acc_018', 'zoom018@easeyourneeds.com', 100, 2, FALSE, 'business_active', 'active'),
('acc_019', 'zoom019@easeyourneeds.com', 100, 2, FALSE, 'business_active', 'active'),
('acc_020', 'zoom020@easeyourneeds.com', 100, 2, FALSE, 'business_active', 'active'),
-- Backup Free Accounts
('acc_021', 'zoom021@easeyourneeds.com', 50, 1, TRUE, 'free_backup', 'inactive'),
('acc_022', 'zoom022@easeyourneeds.com', 50, 1, TRUE, 'free_backup', 'inactive'),
('acc_023', 'zoom023@easeyourneeds.com', 50, 1, TRUE, 'free_backup', 'inactive'),
('acc_024', 'zoom024@easeyourneeds.com', 50, 1, TRUE, 'free_backup', 'inactive'),
('acc_025', 'zoom025@easeyourneeds.com', 50, 1, TRUE, 'free_backup', 'inactive'),
('acc_026', 'zoom026@easeyourneeds.com', 50, 1, TRUE, 'free_backup', 'inactive'),
('acc_027', 'zoom027@easeyourneeds.com', 50, 1, TRUE, 'free_backup', 'inactive'),
('acc_028', 'zoom028@easeyourneeds.com', 50, 1, TRUE, 'free_backup', 'inactive'),
('acc_029', 'zoom029@easeyourneeds.com', 50, 1, TRUE, 'free_backup', 'inactive'),
('acc_030', 'zoom030@easeyourneeds.com', 50, 1, TRUE, 'free_backup', 'inactive')
ON CONFLICT (account_id) DO NOTHING;

-- ============================================
-- 3. MC PROFILES (Real Data dari Ease Your Needs)
-- ============================================
INSERT INTO mc_profiles (name, category, daily_rate, half_day_rate, bio, is_available, rating, total_sessions) VALUES
(
    'Jeje', 'General', 0, 0,
    'Usia 26 | Formal & Informal | Area: Seluruh Indonesia | Vibes: Professional & Energetic. Pengalaman: Pertamina, Future Talent Hub Launch, Garuda Store.',
    TRUE, 4.8, 65
),
(
    'Indah', 'Corporate', 0, 0,
    'Usia 36 | Formal & Informal | Area: Jabodetabek | Vibes: Professional & Energetic. Pengalaman: Xiaomi, Trinitiland, Telkomsel, Nestle, Kemenparekraf, Unilever.',
    TRUE, 4.9, 120
),
(
    'Jaya', 'Corporate', 0, 0,
    'Usia 32 | Formal & Informal | Area: Seluruh Indonesia | Vibes: Profesional, Energetic & Fun. Pengalaman: Tiket.com, Traveloka, PT PLN, BCA, AIA.',
    TRUE, 4.9, 130
),
(
    'Risma', 'Corporate', 0, 0,
    'Usia 32 | Formal & Informal | Area: Jabodetabek | Vibes: Profesional & Energetic. Pengalaman: Astra Auto Part, Telkomsel, Komisi 1 DPR RI, Gloria Origita Cosmetic.',
    TRUE, 4.7, 85
),
(
    'Reynatha', 'General', 0, 0,
    'Usia 25 | Formal & Informal | Area: Jabodetabek | Vibes: Profesional & Soft-spoken. Pengalaman: HUT Korpri, Universitas Indonesia Hospital, IGLive Kemenperin.',
    TRUE, 4.8, 78
),
(
    'Elva', 'General', 0, 0,
    'Usia 28 | Formal & Informal | Area: Jabodetabek & Luar Jabodetabek | Vibes: Energetic. Pengalaman: Charity Saint Peters School, Purnabakti Kalbe Group, Festival TandaSalib.',
    TRUE, 4.6, 50
),
(
    'Aban', 'Corporate', 0, 0,
    'Usia 31 | Formal & Informal | Area: Seluruh Indonesia | Vibes: Energetic, Fun & Cool. Pengalaman: Kementerian Ketenagakerjaan RI, Kementerian Kesehatan RI, BKKBN Jawa Barat.',
    TRUE, 4.9, 110
),
(
    'Inaroh', 'General', 0, 0,
    'Usia 22 | Formal & Informal | Area: Jabodetabek | Vibes: Profesional & Calm. Pengalaman: PT Pertamina, IAMI, Wisuda UIN Syarif Hidayatullah Jakarta.',
    TRUE, 4.5, 40
),
(
    'Phelia', 'General', 0, 0,
    'Usia 26 | Formal & Semi formal | Area: Bandung, Bogor, & Jabodetabek | Vibes: Profesional. Pengalaman: AL Mekkah Foundation, PT. Villa Butik Development, Kreasiland.',
    TRUE, 4.7, 55
)
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. OPERATOR PROFILES (Only Bronze & Silver tiers)
-- ============================================
-- Note: Harga operator disimpan di pricing_config (paket jam).
-- hourly_rate di sini = harga terendah per jam sebagai referensi.
INSERT INTO operator_profiles (name, tier, hourly_rate, is_available, bio, rating, total_sessions) VALUES
('Operator A', 'bronze', 60000, TRUE, 'Admit/Remove Peserta, Sharescreen PPT, Record, Setting Host/Co-Host, Spotlight, Post-event: Link Recording & Report.', 4.5, 45),
('Operator B', 'bronze', 60000, TRUE, 'Admit/Remove Peserta, Sharescreen PPT, Record, Setting Host/Co-Host, Spotlight, Post-event: Link Recording & Report.', 4.6, 52),
('Operator C', 'bronze', 60000, TRUE, 'Admit/Remove Peserta, Sharescreen PPT, Record, Setting Host/Co-Host, Spotlight, Post-event: Link Recording & Report.', 4.4, 38),
('Operator D', 'silver', 133000, TRUE, 'Semua fitur Bronze + Pre-event: Kirim Link by Email, Quiz Slido/Kahoot, Gladi Resik, Rekomendasi Rundown. Hari H: Lobby & Musik.', 4.8, 90),
('Operator E', 'silver', 133000, TRUE, 'Semua fitur Bronze + Pre-event: Kirim Link by Email, Quiz Slido/Kahoot, Gladi Resik, Rekomendasi Rundown. Hari H: Lobby & Musik.', 4.9, 105),
('Operator F', 'silver', 133000, TRUE, 'Semua fitur Bronze + Pre-event: Kirim Link by Email, Quiz Slido/Kahoot, Gladi Resik, Rekomendasi Rundown. Hari H: Lobby & Musik.', 4.7, 78)
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. PRICING CONFIG — Zoom Pro (Per Jam)
-- ============================================
-- metadata stores: meeting_type, quality
INSERT INTO pricing_config (service_type, name, base_price, unit, capacity, tier, metadata, sort_order) VALUES
-- 100 Peserta
('zoom_rental', 'Zoom Pro 100P Per Jam HD', 6000, 'per_hour', 100, 'hd', '{"meeting_type":"pro","quality":"hd"}', 1),
('zoom_rental', 'Zoom Pro 100P Per Jam Full HD', 10000, 'per_hour', 100, 'full_hd', '{"meeting_type":"pro","quality":"full_hd"}', 2),
-- 300 Peserta
('zoom_rental', 'Zoom Pro 300P Per Jam HD', 25000, 'per_hour', 300, 'hd', '{"meeting_type":"pro","quality":"hd"}', 3),
('zoom_rental', 'Zoom Pro 300P Per Jam Full HD', 40000, 'per_hour', 300, 'full_hd', '{"meeting_type":"pro","quality":"full_hd"}', 4),
-- 500 Peserta
('zoom_rental', 'Zoom Pro 500P Per Jam HD', 35000, 'per_hour', 500, 'hd', '{"meeting_type":"pro","quality":"hd"}', 5),
('zoom_rental', 'Zoom Pro 500P Per Jam Full HD', 60000, 'per_hour', 500, 'full_hd', '{"meeting_type":"pro","quality":"full_hd"}', 6),
-- 1000 Peserta
('zoom_rental', 'Zoom Pro 1000P Per Jam HD', 60000, 'per_hour', 1000, 'hd', '{"meeting_type":"pro","quality":"hd"}', 7),
('zoom_rental', 'Zoom Pro 1000P Per Jam Full HD', 100000, 'per_hour', 1000, 'full_hd', '{"meeting_type":"pro","quality":"full_hd"}', 8)
ON CONFLICT DO NOTHING;

-- ============================================
-- 6. PRICING CONFIG — Zoom Pro (Per Hari)
-- ============================================
INSERT INTO pricing_config (service_type, name, base_price, unit, capacity, tier, metadata, sort_order) VALUES
-- 100 Peserta
('zoom_rental', 'Zoom Pro 100P Per Hari HD', 30000, 'per_day', 100, 'hd', '{"meeting_type":"pro","quality":"hd"}', 10),
('zoom_rental', 'Zoom Pro 100P Per Hari Full HD', 45000, 'per_day', 100, 'full_hd', '{"meeting_type":"pro","quality":"full_hd"}', 11),
-- 300 Peserta
('zoom_rental', 'Zoom Pro 300P Per Hari HD', 70000, 'per_day', 300, 'hd', '{"meeting_type":"pro","quality":"hd"}', 12),
('zoom_rental', 'Zoom Pro 300P Per Hari Full HD', 130000, 'per_day', 300, 'full_hd', '{"meeting_type":"pro","quality":"full_hd"}', 13),
-- 500 Peserta
('zoom_rental', 'Zoom Pro 500P Per Hari HD', 110000, 'per_day', 500, 'hd', '{"meeting_type":"pro","quality":"hd"}', 14),
('zoom_rental', 'Zoom Pro 500P Per Hari Full HD', 190000, 'per_day', 500, 'full_hd', '{"meeting_type":"pro","quality":"full_hd"}', 15),
-- 1000 Peserta
('zoom_rental', 'Zoom Pro 1000P Per Hari HD', 185000, 'per_day', 1000, 'hd', '{"meeting_type":"pro","quality":"hd"}', 16),
('zoom_rental', 'Zoom Pro 1000P Per Hari Full HD', 325000, 'per_day', 1000, 'full_hd', '{"meeting_type":"pro","quality":"full_hd"}', 17)
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. PRICING CONFIG — Zoom Webinar (Per Hari Only)
-- ============================================
INSERT INTO pricing_config (service_type, name, base_price, unit, capacity, tier, metadata, sort_order) VALUES
('zoom_rental', 'Zoom Webinar 300P HD', 200000, 'per_day', 300, 'hd', '{"meeting_type":"webinar","quality":"hd"}', 20),
('zoom_rental', 'Zoom Webinar 300P Full HD', 300000, 'per_day', 300, 'full_hd', '{"meeting_type":"webinar","quality":"full_hd"}', 21),
('zoom_rental', 'Zoom Webinar 500P HD', 325000, 'per_day', 500, 'hd', '{"meeting_type":"webinar","quality":"hd"}', 22),
('zoom_rental', 'Zoom Webinar 500P Full HD', 500000, 'per_day', 500, 'full_hd', '{"meeting_type":"webinar","quality":"full_hd"}', 23),
('zoom_rental', 'Zoom Webinar 1000P HD', 750000, 'per_day', 1000, 'hd', '{"meeting_type":"webinar","quality":"hd"}', 24),
('zoom_rental', 'Zoom Webinar 1000P Full HD', 1250000, 'per_day', 1000, 'full_hd', '{"meeting_type":"webinar","quality":"full_hd"}', 25),
('zoom_rental', 'Zoom Webinar 3000P HD', 1800000, 'per_day', 3000, 'hd', '{"meeting_type":"webinar","quality":"hd"}', 26),
('zoom_rental', 'Zoom Webinar 3000P Full HD', 2500000, 'per_day', 3000, 'full_hd', '{"meeting_type":"webinar","quality":"full_hd"}', 27),
('zoom_rental', 'Zoom Webinar 5000P HD', 4900000, 'per_day', 5000, 'hd', '{"meeting_type":"webinar","quality":"hd"}', 28),
('zoom_rental', 'Zoom Webinar 5000P Full HD', 6500000, 'per_day', 5000, 'full_hd', '{"meeting_type":"webinar","quality":"full_hd"}', 29)
ON CONFLICT DO NOTHING;

-- ============================================
-- 8. PRICING CONFIG — Operator Packages
-- ============================================
-- Bronze packages (paket jam)
INSERT INTO pricing_config (service_type, name, base_price, unit, capacity, tier, metadata, sort_order) VALUES
('operator', 'Operator Bronze 1 Jam', 60000, 'per_session', NULL, 'bronze', '{"hours":1,"includes":"Admit/Remove, Sharescreen, Record, Host/Co-Host, Spotlight. Post: Link Recording & Report."}', 40),
('operator', 'Operator Bronze 3 Jam', 150000, 'per_session', NULL, 'bronze', '{"hours":3,"includes":"Admit/Remove, Sharescreen, Record, Host/Co-Host, Spotlight. Post: Link Recording & Report."}', 41),
('operator', 'Operator Bronze 5 Jam', 250000, 'per_session', NULL, 'bronze', '{"hours":5,"includes":"Admit/Remove, Sharescreen, Record, Host/Co-Host, Spotlight. Post: Link Recording & Report."}', 42),
('operator', 'Operator Bronze 7 Jam', 350000, 'per_session', NULL, 'bronze', '{"hours":7,"includes":"Admit/Remove, Sharescreen, Record, Host/Co-Host, Spotlight. Post: Link Recording & Report."}', 43),
('operator', 'Operator Bronze 10 Jam', 450000, 'per_session', NULL, 'bronze', '{"hours":10,"includes":"Admit/Remove, Sharescreen, Record, Host/Co-Host, Spotlight. Post: Link Recording & Report."}', 44),
('operator', 'Operator Bronze 12 Jam', 550000, 'per_session', NULL, 'bronze', '{"hours":12,"includes":"Admit/Remove, Sharescreen, Record, Host/Co-Host, Spotlight. Post: Link Recording & Report."}', 45),
-- Silver packages (paket jam)
('operator', 'Operator Silver 3 Jam', 400000, 'per_session', NULL, 'silver', '{"hours":3,"includes":"Semua Bronze + Pre: Kirim Link Email, Quiz Slido/Kahoot, Gladi Resik, Rekomendasi Rundown. Hari H: Lobby & Musik."}', 50),
('operator', 'Operator Silver 5 Jam', 500000, 'per_session', NULL, 'silver', '{"hours":5,"includes":"Semua Bronze + Pre: Kirim Link Email, Quiz Slido/Kahoot, Gladi Resik, Rekomendasi Rundown. Hari H: Lobby & Musik."}', 51),
('operator', 'Operator Silver 7 Jam', 600000, 'per_session', NULL, 'silver', '{"hours":7,"includes":"Semua Bronze + Pre: Kirim Link Email, Quiz Slido/Kahoot, Gladi Resik, Rekomendasi Rundown. Hari H: Lobby & Musik."}', 52),
('operator', 'Operator Silver 10 Jam', 700000, 'per_session', NULL, 'silver', '{"hours":10,"includes":"Semua Bronze + Pre: Kirim Link Email, Quiz Slido/Kahoot, Gladi Resik, Rekomendasi Rundown. Hari H: Lobby & Musik."}', 53),
('operator', 'Operator Silver 12 Jam', 800000, 'per_session', NULL, 'silver', '{"hours":12,"includes":"Semua Bronze + Pre: Kirim Link Email, Quiz Slido/Kahoot, Gladi Resik, Rekomendasi Rundown. Hari H: Lobby & Musik."}', 54)
ON CONFLICT DO NOTHING;

-- ============================================
-- 9. LOYALTY POINTS FOR DEMO USER
-- ============================================
INSERT INTO loyalty_points (user_id, balance, total_earned, total_redeemed)
SELECT id, 250, 250, 0 FROM users WHERE email = 'customer@demo.com'
ON CONFLICT DO NOTHING;

-- ============================================
-- 10. POINTS EARNING RULES (Per Hari Zoom Pro only)
-- ============================================
-- Poin hanya didapat dari penyewaan HARIAN Zoom Pro.
INSERT INTO points_earning_rules (capacity, points_earned, description) VALUES
(100, 25, 'Sewa Zoom Pro 100P Per Hari = 25 Poin'),
(300, 60, 'Sewa Zoom Pro 300P Per Hari = 60 Poin'),
(500, 90, 'Sewa Zoom Pro 500P Per Hari = 90 Poin'),
(1000, 120, 'Sewa Zoom Pro 1000P Per Hari = 120 Poin')
ON CONFLICT DO NOTHING;

-- ============================================
-- 11. LOYALTY REWARDS CATALOG (Penukaran Poin)
-- ============================================
INSERT INTO loyalty_rewards (name, description, points_cost, reward_type, discount_percent, target_capacity, target_duration, sort_order) VALUES
(
    '50% Disc 1 Hari 100P',
    'Diskon 50% untuk penyewaan Zoom Pro 100 Peserta selama 1 hari.',
    200, 'discount', 50, 100, 'per_day', 1
),
(
    'GRATIS 1 Hari 100P',
    'Gratis penyewaan Zoom Pro 100 Peserta selama 1 hari penuh.',
    300, 'free_rental', 100, 100, 'per_day', 2
),
(
    '50% Disc 1 Hari 300P',
    'Diskon 50% untuk penyewaan Zoom Pro 300 Peserta selama 1 hari.',
    400, 'discount', 50, 300, 'per_day', 3
),
(
    '50% Disc 1 Hari 500P',
    'Diskon 50% untuk penyewaan Zoom Pro 500 Peserta selama 1 hari.',
    700, 'discount', 50, 500, 'per_day', 4
),
(
    'GRATIS 1 Hari 300P',
    'Gratis penyewaan Zoom Pro 300 Peserta selama 1 hari penuh.',
    700, 'free_rental', 100, 300, 'per_day', 5
),
(
    'GRATIS 1 Hari 500P',
    'Gratis penyewaan Zoom Pro 500 Peserta selama 1 hari penuh.',
    1200, 'free_rental', 100, 500, 'per_day', 6
),
(
    '50% Disc 1 Hari 1000P',
    'Diskon 50% untuk penyewaan Zoom Pro 1000 Peserta selama 1 hari.',
    1250, 'discount', 50, 1000, 'per_day', 7
),
(
    'GRATIS 1 Hari 1000P',
    'Gratis penyewaan Zoom Pro 1000 Peserta selama 1 hari penuh.',
    2400, 'free_rental', 100, 1000, 'per_day', 8
)
ON CONFLICT DO NOTHING;

-- ============================================
-- END OF MIGRATION 002
-- ============================================
