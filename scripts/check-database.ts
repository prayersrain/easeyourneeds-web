/**
 * Script to check all database tables in Supabase
 * Run: npx tsx scripts/check-database.ts
 */

import pool from "@/lib/db";

async function checkDatabase() {
  console.log("🔍 Checking database tables...\n");

  try {
    // 1. Get all tables
    const tablesResult = await pool.query(`
      SELECT 
        tablename,
        schemaname
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `);

    console.log("📊 TABLES IN DATABASE:");
    console.log("=".repeat(60));
    console.log(`${"Table Name".padEnd(35)} | Schema`);
    console.log("=".repeat(60));
    
    for (const table of tablesResult.rows) {
      console.log(`${table.tablename.padEnd(35)} | ${table.schemaname}`);
    }
    console.log("=".repeat(60));
    console.log(`Total: ${tablesResult.rows.length} tables\n`);

    // 2. Check expected tables from migration
    const expectedTables = [
      'users',
      'accounts',
      'sessions',
      'verification_token',
      'zoom_accounts',
      'bookings',
      'booking_addons',
      'mc_profiles',
      'operator_profiles',
      'recordings',
      'transactions',
      'withdrawals',
      'loyalty_points',
      'balance_history',
      'failed_operations',
      'admin_audit_log',
      'pricing_config',
      'support_tickets',
      'ticket_messages',
      'points_earning_rules',
      'loyalty_rewards'
    ];

    const existingTables = tablesResult.rows.map(r => r.tablename);
    
    console.log("📋 MIGRATION STATUS:");
    console.log("=".repeat(60));
    console.log(`${"Table Name".padEnd(35)} | Status`);
    console.log("=".repeat(60));
    
    let created = 0;
    let missing = 0;

    for (const table of expectedTables) {
      const exists = existingTables.includes(table);
      const status = exists ? "✅ Created" : "❌ Missing";
      console.log(`${table.padEnd(35)} | ${status}`);
      if (exists) created++;
      else missing++;
    }
    console.log("=".repeat(60));
    console.log(`Created: ${created}/${expectedTables.length} | Missing: ${missing}/${expectedTables.length}\n`);

    // 3. Check row counts for each table
    if (created > 0) {
      console.log("📈 ROW COUNTS:");
      console.log("=".repeat(60));
      console.log(`${"Table Name".padEnd(35)} | Row Count`);
      console.log("=".repeat(60));

      for (const table of existingTables) {
        if (expectedTables.includes(table)) {
          const countResult = await pool.query(`SELECT COUNT(*) FROM ${table}`);
          const count = parseInt(countResult.rows[0].count);
          console.log(`${table.padEnd(35)} | ${count.toLocaleString()} rows`);
        }
      }
      console.log("=".repeat(60));
      console.log();
    }

    // 4. Check users table structure
    console.log("👥 USERS TABLE STRUCTURE:");
    console.log("=".repeat(60));
    const usersStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);

    console.log(`${"Column".padEnd(25)} | ${"Type".padEnd(20)} | Nullable | Default`);
    console.log("=".repeat(60));
    for (const col of usersStructure.rows) {
      const nullable = col.is_nullable === 'YES' ? 'YES' : 'NO ';
      const defaultVal = col.column_default || '-';
      console.log(`${col.column_name.padEnd(25)} | ${col.data_type.padEnd(20)} | ${nullable} | ${defaultVal}`);
    }
    console.log("=".repeat(60));
    console.log();

    // 5. Check all users
    console.log("👥 ALL USERS IN DATABASE:");
    console.log("=".repeat(80));
    const users = await pool.query(`
      SELECT id, email, name, role, 
             password IS NOT NULL as has_password,
             balance, balance_available, balance_locked,
             created_at
      FROM users
      ORDER BY role, email;
    `);

    console.log(`${"Email".padEnd(40)} | ${"Role".padEnd(12)} | ${"Password".padEnd(8)} | ${"Balance".padEnd(12)}`);
    console.log("=".repeat(80));
    for (const user of users.rows) {
      const balance = new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR',
        minimumFractionDigits: 0 
      }).format(user.balance || 0);
      console.log(`${user.email.padEnd(40)} | ${user.role.padEnd(12)} | ${user.has_password ? "✅".padEnd(8) : "❌".padEnd(8)} | ${balance}`);
    }
    console.log("=".repeat(80));
    console.log(`Total users: ${users.rows.length}\n`);

    // 6. Check operator profiles
    console.log("🎤 OPERATOR PROFILES:");
    console.log("=".repeat(80));
    const operators = await pool.query(`
      SELECT op.name, op.tier, op.is_available, op.hourly_rate,
             u.email, u.id as user_id
      FROM operator_profiles op
      LEFT JOIN users u ON op.user_id = u.id
      ORDER BY op.name;
    `);

    console.log(`${"Name".padEnd(15)} | ${"Tier".padEnd(8)} | ${"Available".padEnd(10)} | ${"Email".padEnd(35)} | Linked`);
    console.log("=".repeat(80));
    for (const op of operators.rows) {
      const email = op.email || "❌ No user account";
      const linked = op.user_id ? "✅" : "❌";
      console.log(`${op.name.padEnd(15)} | ${op.tier.padEnd(8)} | ${String(op.is_available).padEnd(10)} | ${email.padEnd(35)} | ${linked}`);
    }
    console.log("=".repeat(80));
    console.log(`Total operators: ${operators.rows.length}\n`);

    // 7. Check zoom accounts
    console.log("📹 ZOOM ACCOUNTS:");
    console.log("=".repeat(80));
    const zoomAccounts = await pool.query(`
      SELECT account_id, account_email, daily_limit, concurrent_limit, 
             is_backup, account_tier, status
      FROM zoom_accounts
      ORDER BY account_id;
    `);

    console.log(`${"Account ID".padEnd(12)} | ${"Email".padEnd(30)} | ${"Limit".padEnd(8)} | ${"Concurrent".padEnd(12)} | ${"Tier".padEnd(20)}`);
    console.log("=".repeat(80));
    for (const acc of zoomAccounts.rows) {
      console.log(`${acc.account_id.padEnd(12)} | ${acc.account_email.padEnd(30)} | ${acc.daily_limit.toString().padEnd(8)} | ${acc.concurrent_limit.toString().padEnd(12)} | ${acc.account_tier.padEnd(20)}`);
    }
    console.log("=".repeat(80));
    console.log(`Total Zoom accounts: ${zoomAccounts.rows.length}\n`);

    console.log("✅ Database check complete!\n");

  } catch (error) {
    console.error("❌ Error:", (error as Error).message);
    throw error;
  } finally {
    await pool.end();
  }
}

checkDatabase();
