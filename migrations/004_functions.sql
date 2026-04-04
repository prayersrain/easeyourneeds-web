-- ============================================
-- EASE YOUR NEEDS - DATABASE FUNCTIONS & TRIGGERS (REVISED)
-- Migration: 004_functions.sql
-- Description: Create database functions and triggers
-- Database: PostgreSQL 15+ (Supabase)
-- ============================================

-- ============================================
-- 1. FUNCTION: Auto-update updated_at timestamp
-- ============================================
-- Applied universally to all tables with updated_at.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all relevant tables
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOREACH tbl IN ARRAY ARRAY[
        'users', 'zoom_accounts', 'bookings', 'recordings',
        'mc_profiles', 'operator_profiles', 'loyalty_points',
        'transactions', 'withdrawals', 'pricing_config', 'support_tickets',
        'points_earning_rules', 'loyalty_rewards'
    ]
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trg_update_%s_updated_at ON %I', tbl, tbl);
        EXECUTE format(
            'CREATE TRIGGER trg_update_%s_updated_at
             BEFORE UPDATE ON %I
             FOR EACH ROW
             EXECUTE FUNCTION update_updated_at_column()',
            tbl, tbl
        );
    END LOOP;
END $$;

-- ============================================
-- 2. FUNCTION: Reset Zoom Daily Usage
-- ============================================
CREATE OR REPLACE FUNCTION reset_zoom_daily_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.usage_reset_date < CURRENT_DATE THEN
        NEW.daily_usage := 0;
        NEW.usage_reset_date := CURRENT_DATE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_reset_zoom_usage ON zoom_accounts;
CREATE TRIGGER trg_reset_zoom_usage
    BEFORE INSERT OR UPDATE ON zoom_accounts
    FOR EACH ROW
    EXECUTE FUNCTION reset_zoom_daily_usage();

-- ============================================
-- 3. FUNCTION: Set Recording Expiry (7 days after event ends)
-- ============================================
CREATE OR REPLACE FUNCTION set_recording_expiry()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.expires_at IS NULL THEN
        SELECT b.end_time + INTERVAL '7 days'
        INTO NEW.expires_at
        FROM bookings b
        WHERE b.id = NEW.booking_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_recording_expiry ON recordings;
CREATE TRIGGER trg_set_recording_expiry
    BEFORE INSERT ON recordings
    FOR EACH ROW
    EXECUTE FUNCTION set_recording_expiry();

-- ============================================
-- 4. FUNCTION: Validate Balance Change
-- ============================================
CREATE OR REPLACE FUNCTION validate_balance_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.balance_after != NEW.balance_before + NEW.amount THEN
        RAISE EXCEPTION 'Balance calculation mismatch for transaction %: expected %, got %',
            NEW.id,
            NEW.balance_before + NEW.amount,
            NEW.balance_after;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validate_balance_change ON transactions;
CREATE TRIGGER trg_validate_balance_change
    BEFORE INSERT ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION validate_balance_change();

-- ============================================
-- 5. FUNCTION: Update User Balance on Transaction
-- ============================================
-- CHANGED: Now also updates balance_available (not just balance).
CREATE OR REPLACE FUNCTION update_user_balance_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'success' AND OLD.status != 'success' THEN
        IF NEW.type IN ('topup', 'refund', 'cancellation_refund') THEN
            UPDATE users
            SET balance = balance + NEW.amount,
                balance_available = balance_available + NEW.amount,
                updated_at = NOW()
            WHERE id = NEW.user_id;
        ELSIF NEW.type IN ('booking', 'withdrawal', 'upgrade') THEN
            UPDATE users
            SET balance = balance - NEW.amount,
                balance_available = balance_available - NEW.amount,
                updated_at = NOW()
            WHERE id = NEW.user_id;
        END IF;

        -- Log to balance history
        INSERT INTO balance_history (
            user_id, change_type, amount, balance_before, balance_after,
            reference_type, reference_id
        ) VALUES (
            NEW.user_id, NEW.type, NEW.amount, NEW.balance_before, NEW.balance_after,
            'transaction', NEW.id
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_user_balance ON transactions;
CREATE TRIGGER trg_update_user_balance
    AFTER UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_user_balance_on_transaction();

-- ============================================
-- 6. FUNCTION: Set Cancellation Deadline (24h before meeting)
-- ============================================
CREATE OR REPLACE FUNCTION set_cancellation_deadline()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cancellation_deadline IS NULL THEN
        NEW.cancellation_deadline := NEW.start_time - INTERVAL '24 hours';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_cancellation_deadline ON bookings;
CREATE TRIGGER trg_set_cancellation_deadline
    BEFORE INSERT OR UPDATE OF start_time ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION set_cancellation_deadline();

-- ============================================
-- 7. FUNCTION: Update Concurrent Zoom Count
-- ============================================
CREATE OR REPLACE FUNCTION update_concurrent_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status IN ('upcoming', 'in_progress') THEN
        UPDATE zoom_accounts
        SET current_concurrent = current_concurrent + 1
        WHERE id = NEW.zoom_account_id;
        RETURN NEW;
    END IF;

    IF TG_OP = 'UPDATE' AND OLD.status IN ('upcoming', 'in_progress')
        AND NEW.status NOT IN ('upcoming', 'in_progress') THEN
        UPDATE zoom_accounts
        SET current_concurrent = GREATEST(0, current_concurrent - 1)
        WHERE id = NEW.zoom_account_id;
        RETURN NEW;
    END IF;

    IF TG_OP = 'DELETE' AND OLD.status IN ('upcoming', 'in_progress') THEN
        UPDATE zoom_accounts
        SET current_concurrent = GREATEST(0, current_concurrent - 1)
        WHERE id = OLD.zoom_account_id;
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_concurrent_count ON bookings;
CREATE TRIGGER trg_update_concurrent_count
    AFTER INSERT OR UPDATE OR DELETE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_concurrent_count();

-- ============================================
-- 8. FUNCTION: Award Loyalty Points
-- ============================================
-- CHANGED: Now reads from points_earning_rules table instead of
-- using a hardcoded formula. Only awards points for Per Hari
-- Zoom Pro bookings (matching real Ease Your Needs business rules).
CREATE OR REPLACE FUNCTION award_loyalty_points()
RETURNS TRIGGER AS $$
DECLARE
    v_points INTEGER;
    v_loyalty RECORD;
    v_duration INTERVAL;
BEGIN
    -- Only process new bookings with meeting_type = 'pro'
    IF TG_OP = 'INSERT' AND NEW.meeting_type = 'pro' THEN
        -- Calculate duration: only award for Per Hari (>= 8 hours)
        v_duration := NEW.end_time - NEW.start_time;
        IF v_duration < INTERVAL '8 hours' THEN
            RETURN NEW; -- Per Jam bookings don't earn points
        END IF;

        -- Look up points from the rules table
        SELECT per.points_earned INTO v_points
        FROM points_earning_rules per
        WHERE per.capacity = NEW.capacity
          AND per.is_active = TRUE
        LIMIT 1;

        -- If no rule found or 0 points, skip
        IF v_points IS NULL OR v_points = 0 THEN
            RETURN NEW;
        END IF;

        -- Store points earned on the booking
        NEW.points_earned := v_points;

        -- Upsert loyalty points for the user
        SELECT * INTO v_loyalty FROM loyalty_points WHERE user_id = NEW.user_id;

        IF v_loyalty.id IS NOT NULL THEN
            UPDATE loyalty_points
            SET balance = balance + v_points,
                total_earned = total_earned + v_points,
                expires_at = COALESCE(expires_at, NOW() + INTERVAL '90 days'),
                updated_at = NOW()
            WHERE user_id = NEW.user_id;
        ELSE
            INSERT INTO loyalty_points (user_id, balance, total_earned, expires_at)
            VALUES (NEW.user_id, v_points, v_points, NOW() + INTERVAL '90 days');
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_award_loyalty_points ON bookings;
CREATE TRIGGER trg_award_loyalty_points
    BEFORE INSERT ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION award_loyalty_points();

-- ============================================
-- 9. FUNCTION: Check Booking Overlap (helper)
-- ============================================
CREATE OR REPLACE FUNCTION check_booking_overlap(
    p_zoom_account_id UUID,
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ,
    p_exclude_booking_id UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    overlap_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO overlap_count
    FROM bookings
    WHERE zoom_account_id = p_zoom_account_id
      AND status != 'cancelled'
      AND (p_exclude_booking_id IS NULL OR id != p_exclude_booking_id)
      AND start_time < p_end_time
      AND end_time > p_start_time;

    RETURN overlap_count > 0;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 10. FUNCTION: Get Available Zoom Account
-- ============================================
CREATE OR REPLACE FUNCTION get_available_zoom_account(
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ
) RETURNS UUID AS $$
DECLARE
    v_account_id UUID;
BEGIN
    SELECT za.id INTO v_account_id
    FROM zoom_accounts za
    WHERE za.status = 'active'
      AND za.is_backup = FALSE
      AND za.daily_usage < za.daily_limit
      AND za.current_concurrent < za.concurrent_limit
      AND NOT EXISTS (
          SELECT 1 FROM bookings b
          WHERE b.zoom_account_id = za.id
            AND b.status != 'cancelled'
            AND b.start_time < p_end_time
            AND b.end_time > p_start_time
      )
    ORDER BY (za.daily_usage::FLOAT / za.daily_limit) ASC, za.id ASC
    LIMIT 1;

    RETURN v_account_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 11. FUNCTION: Auto-Release Stuck Withdrawals (from 006)
-- ============================================
-- Merged from old 006_critical_fixes.sql.
-- Releases withdrawals pending > 7 days.
CREATE OR REPLACE FUNCTION auto_release_stuck_withdrawals()
RETURNS INTEGER AS $$
DECLARE
    released_count INTEGER;
BEGIN
    UPDATE withdrawals
    SET status = 'auto_released',
        rejection_reason = 'Auto-released after 7 days pending',
        updated_at = NOW()
    WHERE status = 'pending'
      AND created_at < NOW() - INTERVAL '7 days';

    GET DIAGNOSTICS released_count = ROW_COUNT;

    -- Release locked balance back to available
    UPDATE users u
    SET balance_available = balance_available + w.amount,
        balance_locked = balance_locked - w.amount,
        updated_at = NOW()
    FROM withdrawals w
    WHERE u.id = w.user_id
      AND w.status = 'auto_released'
      AND w.updated_at > NOW() - INTERVAL '1 minute';

    RETURN released_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 12. FUNCTION: Generate Ticket Number
-- ============================================
-- NEW: Auto-generates a human-readable ticket number
-- like "TK-20260401-0001" for new support tickets.
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
        SELECT COUNT(*) + 1 INTO v_count
        FROM support_tickets
        WHERE DATE(created_at) = CURRENT_DATE;

        NEW.ticket_number := 'TK-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(v_count::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generate_ticket_number ON support_tickets;
CREATE TRIGGER trg_generate_ticket_number
    BEFORE INSERT ON support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION generate_ticket_number();

-- ============================================
-- END OF MIGRATION 004
-- ============================================
