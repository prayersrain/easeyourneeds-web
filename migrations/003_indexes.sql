-- ============================================
-- EASE YOUR NEEDS - DATABASE INDEXES (REVISED)
-- Migration: 003_indexes.sql
-- Description: Create performance indexes
-- Database: PostgreSQL 15+ (Supabase)
-- ============================================

-- ============================================
-- USERS TABLE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_balance ON users(balance_available, balance_locked);
-- REMOVED: idx_users_verified (column no longer exists)

-- ============================================
-- ACCOUNTS TABLE INDEXES (Auth.js) — NEW
-- ============================================
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts("userId");
CREATE UNIQUE INDEX IF NOT EXISTS idx_accounts_provider ON accounts(provider, "providerAccountId");

-- ============================================
-- SESSIONS TABLE INDEXES (Auth.js)
-- ============================================
-- CHANGED: Column name to "sessionToken" (camelCase)
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions("sessionToken");
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions("userId");
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires);

-- ============================================
-- VERIFICATION TOKEN TABLE INDEXES (Auth.js)
-- ============================================
-- CHANGED: Table name is now verification_token (singular, Auth.js standard)
CREATE INDEX IF NOT EXISTS idx_verification_token_identifier ON verification_token(identifier);
CREATE INDEX IF NOT EXISTS idx_verification_token_token ON verification_token(token);

-- ============================================
-- ZOOM ACCOUNTS TABLE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_zoom_accounts_status ON zoom_accounts(status);
CREATE INDEX IF NOT EXISTS idx_zoom_accounts_usage ON zoom_accounts(daily_usage, daily_limit);
CREATE INDEX IF NOT EXISTS idx_zoom_accounts_reset_date ON zoom_accounts(usage_reset_date);
CREATE INDEX IF NOT EXISTS idx_zoom_accounts_concurrent ON zoom_accounts(current_concurrent, concurrent_limit);
CREATE INDEX IF NOT EXISTS idx_zoom_accounts_backup ON zoom_accounts(is_backup, status, account_tier);
CREATE INDEX IF NOT EXISTS idx_zoom_accounts_capacity ON zoom_accounts(status, is_backup, daily_usage, daily_limit);

-- ============================================
-- BOOKINGS TABLE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_zoom_account_id ON bookings(zoom_account_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_time_range ON bookings(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_bookings_cancellation_deadline ON bookings(cancellation_deadline);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_user_status ON bookings(user_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_account_status_time ON bookings(zoom_account_id, status, start_time);

-- ============================================
-- BOOKING ADD-ONS TABLE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_booking_addons_booking_id ON booking_addons(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_addons_type ON booking_addons(addon_type);

-- ============================================
-- MC & OPERATOR PROFILES TABLE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_mc_profiles_available ON mc_profiles(is_available);
CREATE INDEX IF NOT EXISTS idx_mc_profiles_category ON mc_profiles(category);
CREATE INDEX IF NOT EXISTS idx_mc_profiles_user_id ON mc_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_operator_profiles_tier ON operator_profiles(tier);
CREATE INDEX IF NOT EXISTS idx_operator_profiles_available ON operator_profiles(is_available);
CREATE INDEX IF NOT EXISTS idx_operator_profiles_user_id ON operator_profiles(user_id);

-- ============================================
-- RECORDINGS TABLE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_recordings_booking_id ON recordings(booking_id);
CREATE INDEX IF NOT EXISTS idx_recordings_expires_at ON recordings(expires_at);
CREATE INDEX IF NOT EXISTS idx_recordings_deleted ON recordings(is_deleted);

-- ============================================
-- TRANSACTIONS TABLE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(reference_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_created ON transactions(user_id, created_at);
-- Idempotency: prevent Xendit double top-up (merged from 006_critical_fixes)
CREATE UNIQUE INDEX IF NOT EXISTS idx_transactions_topup_unique
    ON transactions(reference_id)
    WHERE type = 'topup' AND status = 'success';

-- ============================================
-- WITHDRAWALS TABLE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_created_at ON withdrawals(created_at);
-- One pending withdrawal per user (merged from 006_critical_fixes)
CREATE UNIQUE INDEX IF NOT EXISTS idx_withdrawals_one_pending_per_user
    ON withdrawals(user_id)
    WHERE status = 'pending';

-- ============================================
-- LOYALTY POINTS TABLE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_loyalty_points_user_id ON loyalty_points(user_id);

-- ============================================
-- BALANCE HISTORY TABLE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_balance_history_user_id ON balance_history(user_id);
CREATE INDEX IF NOT EXISTS idx_balance_history_reference ON balance_history(reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_balance_history_created_at ON balance_history(created_at);

-- ============================================
-- FAILED OPERATIONS TABLE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_failed_operations_status ON failed_operations(status);
CREATE INDEX IF NOT EXISTS idx_failed_operations_type ON failed_operations(operation_type);
CREATE INDEX IF NOT EXISTS idx_failed_operations_next_retry ON failed_operations(next_retry);
CREATE INDEX IF NOT EXISTS idx_failed_operations_resource ON failed_operations(resource_type, resource_id);

-- ============================================
-- ADMIN AUDIT LOG TABLE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_id ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action ON admin_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON admin_audit_log(created_at);

-- ============================================
-- PRICING CONFIG TABLE INDEXES (NEW)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_pricing_config_service ON pricing_config(service_type, is_active);
CREATE INDEX IF NOT EXISTS idx_pricing_config_sort ON pricing_config(sort_order);

-- ============================================
-- SUPPORT TICKETS TABLE INDEXES (NEW)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned ON support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_support_tickets_number ON support_tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_sender ON ticket_messages(sender_id);

-- ============================================
-- POINTS EARNING RULES TABLE INDEXES (NEW)
-- ============================================
CREATE UNIQUE INDEX IF NOT EXISTS idx_points_earning_rules_capacity ON points_earning_rules(capacity) WHERE is_active = TRUE;

-- ============================================
-- LOYALTY REWARDS TABLE INDEXES (NEW)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_loyalty_rewards_active ON loyalty_rewards(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_loyalty_rewards_type ON loyalty_rewards(reward_type);
CREATE INDEX IF NOT EXISTS idx_loyalty_rewards_capacity ON loyalty_rewards(target_capacity);

-- ============================================
-- END OF MIGRATION 003
-- ============================================
