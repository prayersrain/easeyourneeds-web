-- ============================================
-- EASE YOUR NEEDS - DATABASE SCHEMA (REVISED)
-- Migration: 001_initial_schema.sql
-- Description: Create all tables for the application
-- Database: PostgreSQL 15+ (Supabase)
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- ============================================
-- 1. USERS TABLE
-- ============================================
-- CHANGED: Added Auth.js required columns (emailVerified, image).
-- CHANGED: Role enum now includes 'operator' for the Operator Portal.
-- CHANGED: Added balance_available and balance_locked directly
--          (previously in 006_critical_fixes.sql) to avoid ALTER TABLE.
-- CHANGED: Removed is_verified/verification_token/verification_token_expires
--          as Auth.js manages verification via its own token table.
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    "emailVerified" TIMESTAMPTZ,                    -- Auth.js standard column
    name VARCHAR(255),
    image TEXT,                                      -- Auth.js standard column
    phone VARCHAR(20),
    balance BIGINT DEFAULT 0 CHECK (balance >= 0),
    balance_available BIGINT DEFAULT 0 CHECK (balance_available >= 0),
    balance_locked BIGINT DEFAULT 0 CHECK (balance_locked >= 0),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'operator', 'admin', 'super_admin')),
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT balance_check CHECK (balance = balance_available + balance_locked)
);

-- ============================================
-- 2. ACCOUNTS TABLE (Auth.js / NextAuth v5)
-- ============================================
-- NEW TABLE: Required by @auth/pg-adapter.
-- Stores OAuth provider links (Google, Zoom, etc).
-- Without this table, Auth.js adapter throws a hard error on startup.
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(255) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    "providerAccountId" VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at BIGINT,
    token_type VARCHAR(255),
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. SESSIONS TABLE (Auth.js / NextAuth v5)
-- ============================================
-- CHANGED: Column names now use camelCase ("sessionToken", "userId")
-- to match Auth.js pg-adapter expected schema exactly.
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "sessionToken" VARCHAR(255) UNIQUE NOT NULL,
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. VERIFICATION TOKENS TABLE (Auth.js / NextAuth v5)
-- ============================================
-- CHANGED: Removed auto-increment id.
-- Auth.js expects composite primary key (identifier, token).
CREATE TABLE IF NOT EXISTS verification_token (
    identifier VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (identifier, token)
);

-- ============================================
-- 5. ZOOM ACCOUNTS TABLE
-- ============================================
-- CHANGED: Merged 005_backup_accounts.sql columns directly
-- (is_backup, account_tier, etc.) to avoid ALTER TABLE migration.
-- CHANGED: Removed api_key/api_secret (we use S2S OAuth via env vars,
-- not per-account keys stored in DB — more secure).
CREATE TABLE IF NOT EXISTS zoom_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id VARCHAR(100) UNIQUE NOT NULL,
    account_email VARCHAR(255) NOT NULL,
    daily_limit INTEGER DEFAULT 100,
    daily_usage INTEGER DEFAULT 0,
    usage_reset_date DATE DEFAULT CURRENT_DATE,
    concurrent_limit INTEGER DEFAULT 2,
    current_concurrent INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'rate_limited')),
    is_backup BOOLEAN DEFAULT FALSE,
    account_tier VARCHAR(20) DEFAULT 'business_active'
        CHECK (account_tier IN ('business_active', 'business_backup', 'free_backup')),
    activated_at TIMESTAMPTZ,
    deactivated_at TIMESTAMPTZ,
    last_sync TIMESTAMPTZ,
    health_check_failed_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. BOOKINGS TABLE
-- ============================================
-- UNCHANGED: Structure is solid. Kept as-is.
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    zoom_account_id UUID REFERENCES zoom_accounts(id),
    topic VARCHAR(500) NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity IN (100, 300, 500, 1000, 3000, 5000)),
    meeting_type VARCHAR(20) CHECK (meeting_type IN ('pro', 'webinar')),
    quality VARCHAR(20) CHECK (quality IN ('hd', 'full_hd')),
    zoom_link TEXT,
    hostkey VARCHAR(20),
    passcode VARCHAR(20),
    zoom_meeting_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed', 'cancelled', 'overtime')),
    total_price BIGINT NOT NULL,
    points_earned INTEGER DEFAULT 0,
    original_booking_id UUID REFERENCES bookings(id),
    cancellation_deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_booking_duration CHECK (end_time > start_time)
);

-- NOTE: Removed the overly strict valid_capacity_for_type constraint.
-- Reason: It locked capacity=100 to 'pro' only, which blocks future
-- "Small Webinar" packages. Business logic should validate this in app code.

-- ============================================
-- 7. BOOKING ADD-ONS TABLE
-- ============================================
-- UNCHANGED: Structure is solid.
CREATE TABLE IF NOT EXISTS booking_addons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    addon_type VARCHAR(20) NOT NULL CHECK (addon_type IN ('mc', 'operator', 'obs', 'livestream')),
    addon_name VARCHAR(255) NOT NULL,
    quantity INTEGER DEFAULT 1,
    total_price BIGINT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. MC PROFILES TABLE
-- ============================================
-- CHANGED: Added user_id FK so an MC can be linked to their user account
-- when they log in via the Operator Portal.
-- CHANGED: Added rating and total_sessions for the public talent showcase.
CREATE TABLE IF NOT EXISTS mc_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    is_available BOOLEAN DEFAULT TRUE,
    daily_rate BIGINT NOT NULL,
    half_day_rate BIGINT,
    photo_url TEXT,
    bio TEXT,
    rating NUMERIC(2,1) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
    total_sessions INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. OPERATOR PROFILES TABLE
-- ============================================
-- CHANGED: Same treatment — added user_id FK, rating, total_sessions.
CREATE TABLE IF NOT EXISTS operator_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    tier VARCHAR(20) CHECK (tier IN ('bronze', 'silver', 'gold')),
    is_available BOOLEAN DEFAULT TRUE,
    hourly_rate BIGINT NOT NULL,
    photo_url TEXT,
    bio TEXT,
    rating NUMERIC(2,1) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
    total_sessions INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. RECORDINGS TABLE
-- ============================================
-- CHANGED: Renamed r2_url/r2_key/r2_bucket to storage_url/storage_key/storage_bucket
-- since we migrated from Cloudflare R2 to Supabase Storage.
CREATE TABLE IF NOT EXISTS recordings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    zoom_cloud_id VARCHAR(100),
    storage_url TEXT,
    storage_key VARCHAR(500),
    storage_bucket VARCHAR(255) DEFAULT 'recordings',
    file_size BIGINT,
    duration INTEGER,
    recording_type VARCHAR(20) CHECK (recording_type IN ('cloud', 'local', 'speaker', 'gallery')),
    expires_at TIMESTAMPTZ NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 11. TRANSACTIONS TABLE
-- ============================================
-- UNCHANGED: Structure is solid.
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN (
        'topup', 'booking', 'refund', 'withdrawal',
        'loyalty_redemption', 'upgrade', 'cancellation_refund'
    )),
    amount BIGINT NOT NULL,
    balance_before BIGINT NOT NULL,
    balance_after BIGINT NOT NULL,
    reference_id VARCHAR(255),
    payment_method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
    metadata JSONB DEFAULT '{}',
    xendit_callback_token VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 12. WITHDRAWALS TABLE
-- ============================================
-- CHANGED: Added 'auto_released' to status enum 
-- (previously in 006_critical_fixes.sql function).
CREATE TABLE IF NOT EXISTS withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL CHECK (amount >= 50000),
    bank_name VARCHAR(100) NOT NULL,
    bank_account VARCHAR(50) NOT NULL,
    account_holder VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid', 'cancelled', 'auto_released')),
    admin_notes TEXT,
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMPTZ,
    rejection_reason VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 13. LOYALTY POINTS TABLE
-- ============================================
-- UNCHANGED: Structure is solid.
CREATE TABLE IF NOT EXISTS loyalty_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance INTEGER DEFAULT 0 CHECK (balance >= 0),
    total_earned INTEGER DEFAULT 0,
    total_redeemed INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 14. BALANCE HISTORY TABLE
-- ============================================
-- UNCHANGED: Structure is solid.
CREATE TABLE IF NOT EXISTS balance_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    change_type VARCHAR(30) NOT NULL,
    amount BIGINT NOT NULL,
    balance_before BIGINT NOT NULL,
    balance_after BIGINT NOT NULL,
    reference_type VARCHAR(50),
    reference_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 15. FAILED OPERATIONS TABLE
-- ============================================
-- UNCHANGED: Structure is solid.
CREATE TABLE IF NOT EXISTS failed_operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operation_type VARCHAR(50) NOT NULL CHECK (operation_type IN (
        'zoom_meeting_end', 'recording_download', 'recording_delete',
        'xendit_webhook', 'whatsapp_notification'
    )),
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID NOT NULL,
    error_message TEXT NOT NULL,
    error_code VARCHAR(50),
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    last_attempt TIMESTAMPTZ DEFAULT NOW(),
    next_retry TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'retrying', 'resolved', 'escalated')),
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 16. ADMIN AUDIT LOG TABLE
-- ============================================
-- UNCHANGED: Structure is solid.
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 17. PRICING CONFIG TABLE (NEW)
-- ============================================
-- NEW TABLE: Enables Admin to manage dynamic pricing
-- from the dashboard instead of hardcoding in source code.
CREATE TABLE IF NOT EXISTS pricing_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_type VARCHAR(30) NOT NULL CHECK (service_type IN ('zoom_rental', 'operator', 'mc', 'addon')),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price BIGINT NOT NULL,
    discount_price BIGINT,
    unit VARCHAR(30) DEFAULT 'per_hour' CHECK (unit IN ('per_hour', 'per_day', 'per_session', 'flat')),
    capacity INTEGER,
    tier VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 18. SUPPORT TICKETS TABLE (NEW)
-- ============================================
-- NEW TABLE: Customer support ticketing system
-- for B2B clients to report issues.
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(500) NOT NULL,
    category VARCHAR(30) DEFAULT 'general' CHECK (category IN ('general', 'billing', 'technical', 'booking', 'account')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_reply', 'resolved', 'closed')),
    assigned_to UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 19. TICKET MESSAGES TABLE (NEW)
-- ============================================
-- NEW TABLE: Chat messages within a support ticket.
CREATE TABLE IF NOT EXISTS ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ============================================
-- 20. POINTS EARNING RULES TABLE (NEW)
-- ============================================
-- NEW TABLE: Defines how many points a user earns
-- per capacity tier on daily Zoom Pro rentals.
-- Admin-editable from the dashboard.
CREATE TABLE IF NOT EXISTS points_earning_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    capacity INTEGER NOT NULL,
    points_earned INTEGER NOT NULL,
    description VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 21. LOYALTY REWARDS TABLE (NEW)
-- ============================================
-- NEW TABLE: Catalog of redeemable rewards.
-- Users can exchange accumulated points for discounts/free rentals.
-- Admin-editable from the dashboard.
CREATE TABLE IF NOT EXISTS loyalty_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    points_cost INTEGER NOT NULL CHECK (points_cost > 0),
    reward_type VARCHAR(30) NOT NULL CHECK (reward_type IN ('discount', 'free_rental')),
    discount_percent INTEGER CHECK (discount_percent >= 0 AND discount_percent <= 100),
    target_capacity INTEGER,
    target_duration VARCHAR(20) DEFAULT 'per_day',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ANTI-DOUBLE-BOOKING EXCLUSION CONSTRAINT
-- ============================================
-- Uses btree_gist to prevent overlapping time ranges
-- per zoom account (ignoring cancelled bookings).
ALTER TABLE bookings
    ADD CONSTRAINT exclude_zoom_account_overlap
    EXCLUDE USING GIST (
        zoom_account_id WITH =,
        tstzrange(start_time, end_time) WITH &&
    ) WHERE (status != 'cancelled');

-- ============================================
-- END OF MIGRATION 001
-- ============================================
