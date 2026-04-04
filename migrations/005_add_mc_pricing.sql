-- ============================================
-- EASE YOUR NEEDS - MC PRICING
-- Migration: 005_add_mc_pricing.sql
-- Description: Add MC pricing (1jt/hari default)
-- Database: PostgreSQL 15+ (Supabase)
-- ============================================

-- Update all MC daily_rate to 1.000.000
UPDATE mc_profiles 
SET daily_rate = 1000000, 
    half_day_rate = 600000
WHERE daily_rate = 0;

-- Add MC pricing to pricing_config
INSERT INTO pricing_config (service_type, name, description, base_price, unit, tier, metadata, sort_order) VALUES
('mc', 'MC Jeje - Full Day', 'Usia 26 | Formal & Informal | Seluruh Indonesia | Professional & Energetic. Pengalaman: Pertamina, Future Talent Hub Launch, Garuda Store.', 1000000, 'per_day', 'general', '{"mc_name":"Jeje","age":26,"area":"Seluruh Indonesia","vibes":"Professional & Energetic","event_types":["Formal","Informal"]}', 60),
('mc', 'MC Jeje - Half Day', 'Usia 26 | Formal & Informal | Seluruh Indonesia | Professional & Energetic. Pengalaman: Pertamina, Future Talent Hub Launch, Garuda Store.', 600000, 'per_session', 'general', '{"mc_name":"Jeje","age":26,"area":"Seluruh Indonesia","vibes":"Professional & Energetic","event_types":["Formal","Informal"]}', 61),

('mc', 'MC Indah - Full Day', 'Usia 36 | Formal & Informal | Jabodetabek | Professional & Energetic. Pengalaman: Xiaomi, Trinitiland, Telkomsel, Nestle, Kemenparekraf, Unilever.', 1000000, 'per_day', 'corporate', '{"mc_name":"Indah","age":36,"area":"Jabodetabek","vibes":"Professional & Energetic","event_types":["Formal","Informal"]}', 62),
('mc', 'MC Indah - Half Day', 'Usia 36 | Formal & Informal | Jabodetabek | Professional & Energetic. Pengalaman: Xiaomi, Trinitiland, Telkomsel, Nestle, Kemenparekraf, Unilever.', 600000, 'per_session', 'corporate', '{"mc_name":"Indah","age":36,"area":"Jabodetabek","vibes":"Professional & Energetic","event_types":["Formal","Informal"]}', 63),

('mc', 'MC Jaya - Full Day', 'Usia 32 | Formal & Informal | Seluruh Indonesia | Profesional, Energetic & Fun. Pengalaman: Tiket.com, Traveloka, PT PLN, BCA, AIA.', 1000000, 'per_day', 'corporate', '{"mc_name":"Jaya","age":32,"area":"Seluruh Indonesia","vibes":"Profesional, Energetic & Fun","event_types":["Formal","Informal"]}', 64),
('mc', 'MC Jaya - Half Day', 'Usia 32 | Formal & Informal | Seluruh Indonesia | Profesional, Energetic & Fun. Pengalaman: Tiket.com, Traveloka, PT PLN, BCA, AIA.', 600000, 'per_session', 'corporate', '{"mc_name":"Jaya","age":32,"area":"Seluruh Indonesia","vibes":"Profesional, Energetic & Fun","event_types":["Formal","Informal"]}', 65),

('mc', 'MC Risma - Full Day', 'Usia 32 | Formal & Informal | Jabodetabek | Profesional & Energetic. Pengalaman: Astra Auto Part, Telkomsel, Komisi 1 DPR RI, Gloria Origita Cosmetic.', 1000000, 'per_day', 'corporate', '{"mc_name":"Risma","age":32,"area":"Jabodetabek","vibes":"Profesional & Energetic","event_types":["Formal","Informal"]}', 66),
('mc', 'MC Risma - Half Day', 'Usia 32 | Formal & Informal | Jabodetabek | Profesional & Energetic. Pengalaman: Astra Auto Part, Telkomsel, Komisi 1 DPR RI, Gloria Origita Cosmetic.', 600000, 'per_session', 'corporate', '{"mc_name":"Risma","age":32,"area":"Jabodetabek","vibes":"Profesional & Energetic","event_types":["Formal","Informal"]}', 67),

('mc', 'MC Reynatha - Full Day', 'Usia 25 | Formal & Informal | Jabodetabek | Profesional & Soft-spoken. Pengalaman: HUT Korpri, Universitas Indonesia Hospital, IGLive Kemenperin.', 1000000, 'per_day', 'general', '{"mc_name":"Reynatha","age":25,"area":"Jabodetabek","vibes":"Profesional & Soft-spoken","event_types":["Formal","Informal"]}', 68),
('mc', 'MC Reynatha - Half Day', 'Usia 25 | Formal & Informal | Jabodetabek | Profesional & Soft-spoken. Pengalaman: HUT Korpri, Universitas Indonesia Hospital, IGLive Kemenperin.', 600000, 'per_session', 'general', '{"mc_name":"Reynatha","age":25,"area":"Jabodetabek","vibes":"Profesional & Soft-spoken","event_types":["Formal","Informal"]}', 69),

('mc', 'MC Elva - Full Day', 'Usia 28 | Formal & Informal | Jabodetabek & Luar Jabodetabek | Energetic. Pengalaman: Charity Saint Peters School, Purnabakti Kalbe Group, Festival TandaSalib.', 1000000, 'per_day', 'general', '{"mc_name":"Elva","age":28,"area":"Jabodetabek & Luar Jabodetabek","vibes":"Energetic","event_types":["Formal","Informal"]}', 70),
('mc', 'MC Elva - Half Day', 'Usia 28 | Formal & Informal | Jabodetabek & Luar Jabodetabek | Energetic. Pengalaman: Charity Saint Peters School, Purnabakti Kalbe Group, Festival TandaSalib.', 600000, 'per_session', 'general', '{"mc_name":"Elva","age":28,"area":"Jabodetabek & Luar Jabodetabek","vibes":"Energetic","event_types":["Formal","Informal"]}', 71),

('mc', 'MC Aban - Full Day', 'Usia 31 | Formal & Informal | Seluruh Indonesia | Energetic, Fun & Cool. Pengalaman: Kementerian Ketenagakerjaan RI, Kementerian Kesehatan RI, BKKBN Jawa Barat.', 1000000, 'per_day', 'corporate', '{"mc_name":"Aban","age":31,"area":"Seluruh Indonesia","vibes":"Energetic, Fun & Cool","event_types":["Formal","Informal"]}', 72),
('mc', 'MC Aban - Half Day', 'Usia 31 | Formal & Informal | Seluruh Indonesia | Energetic, Fun & Cool. Pengalaman: Kementerian Ketenagakerjaan RI, Kementerian Kesehatan RI, BKKBN Jawa Barat.', 600000, 'per_session', 'corporate', '{"mc_name":"Aban","age":31,"area":"Seluruh Indonesia","vibes":"Energetic, Fun & Cool","event_types":["Formal","Informal"]}', 73),

('mc', 'MC Inaroh - Full Day', 'Usia 22 | Formal & Informal | Jabodetabek | Profesional & Calm. Pengalaman: PT Pertamina, IAMI, Wisuda UIN Syarif Hidayatullah Jakarta.', 1000000, 'per_day', 'general', '{"mc_name":"Inaroh","age":22,"area":"Jabodetabek","vibes":"Profesional & Calm","event_types":["Formal","Informal"]}', 74),
('mc', 'MC Inaroh - Half Day', 'Usia 22 | Formal & Informal | Jabodetabek | Profesional & Calm. Pengalaman: PT Pertamina, IAMI, Wisuda UIN Syarif Hidayatullah Jakarta.', 600000, 'per_session', 'general', '{"mc_name":"Inaroh","age":22,"area":"Jabodetabek","vibes":"Profesional & Calm","event_types":["Formal","Informal"]}', 75),

('mc', 'MC Phelia - Full Day', 'Usia 26 | Formal & Semi formal | Bandung, Bogor, & Jabodetabek | Profesional. Pengalaman: AL Mekkah Foundation, PT. Villa Butik Development, Kreasiland.', 1000000, 'per_day', 'general', '{"mc_name":"Phelia","age":26,"area":"Bandung, Bogor, & Jabodetabek","vibes":"Profesional","event_types":["Formal","Semi formal"]}', 76),
('mc', 'MC Phelia - Half Day', 'Usia 26 | Formal & Semi formal | Bandung, Bogor, & Jabodetabek | Profesional. Pengalaman: AL Mekkah Foundation, PT. Villa Butik Development, Kreasiland.', 600000, 'per_session', 'general', '{"mc_name":"Phelia","age":26,"area":"Bandung, Bogor, & Jabodetabek","vibes":"Profesional","event_types":["Formal","Semi formal"]}', 77)
ON CONFLICT DO NOTHING;

-- ============================================
-- END OF MIGRATION 005
-- ============================================
