/**
 * Script to add passwords for existing users and create operator accounts
 * Run this with: npx tsx scripts/add-user-passwords.ts
 */

import pool from "@/lib/db";
import bcrypt from "bcryptjs";

async function addPasswords() {
  console.log("🔐 Adding user passwords...\n");

  // Generate bcrypt hashes
  const supportPassword = await bcrypt.hash("support123", 10);
  const operatorPassword = await bcrypt.hash("operator123", 10);
  const adminPassword = await bcrypt.hash("admin123", 10);

  console.log("Generated password hashes:");
  console.log("- support123:", supportPassword);
  console.log("- operator123:", operatorPassword);
  console.log("- admin123:", adminPassword);
  console.log();

  try {
    // 1. Update super admin password (if not already set)
    console.log("📝 Updating super admin password...");
    await pool.query(
      `UPDATE users SET password = $1 WHERE email = $2`,
      [adminPassword, "nodeyourwebapp@gmail.com"]
    );
    console.log("✅ Super admin password updated\n");

    // 2. Update customer support -> operator + add password
    console.log("📝 Converting customer support to operator...");
    const supportResult = await pool.query(
      `UPDATE users SET role = 'operator', password = $1 WHERE email = $2 RETURNING id, email, role`,
      [supportPassword, "support@easeyourneeds.com"]
    );
    if (supportResult.rows.length > 0) {
      console.log(`✅ Updated: ${supportResult.rows[0].email} -> role: ${supportResult.rows[0].role}\n`);
    }

    // 3. Create operator user accounts
    console.log("📝 Creating operator user accounts...");
    const operators = [
      { name: "Operator A", email: "operator.a@easeyourneeds.com", phone: "+6281234567001" },
      { name: "Operator B", email: "operator.b@easeyourneeds.com", phone: "+6281234567002" },
      { name: "Operator C", email: "operator.c@easeyourneeds.com", phone: "+6281234567003" },
      { name: "Operator D", email: "operator.d@easeyourneeds.com", phone: "+6281234567004" },
      { name: "Operator E", email: "operator.e@easeyourneeds.com", phone: "+6281234567005" },
      { name: "Operator F", email: "operator.f@easeyourneeds.com", phone: "+6281234567006" },
    ];

    for (const op of operators) {
      const result = await pool.query(
        `INSERT INTO users (email, name, phone, role, password, balance, balance_available, balance_locked)
         VALUES ($1, $2, $3, 'operator', $4, 0, 0, 0)
         ON CONFLICT (email) DO UPDATE SET password = $4
         RETURNING id, email`,
        [op.email, op.name, op.phone, operatorPassword]
      );
      console.log(`✅ Created: ${result.rows[0].email} (ID: ${result.rows[0].id})`);
    }
    console.log();

    // 4. Link operator profiles to user accounts
    console.log("🔗 Linking operator profiles to user accounts...");
    for (const op of operators) {
      const result = await pool.query(
        `UPDATE operator_profiles 
         SET user_id = (SELECT id FROM users WHERE email = $1)
         WHERE name = $2
         RETURNING id, name`,
        [op.email, op.name]
      );
      if (result.rows.length > 0) {
        console.log(`✅ Linked: ${op.name} -> ${op.email}`);
      }
    }
    console.log();

    // 5. Verification
    console.log("📊 Verification - All users with roles:");
    const allUsers = await pool.query(
      `SELECT id, email, name, role, password IS NOT NULL as has_password, created_at
       FROM users
       ORDER BY role, email`
    );

    console.log("\n" + "=".repeat(80));
    console.log(`${"Email".padEnd(40)} | ${"Role".padEnd(12)} | ${"Password".padEnd(8)}`);
    console.log("=".repeat(80));
    for (const user of allUsers.rows) {
      console.log(`${user.email.padEnd(40)} | ${user.role.padEnd(12)} | ${user.has_password ? "✅" : "❌"}`);
    }
    console.log("=".repeat(80));
    console.log(`\nTotal users: ${allUsers.rows.length}`);

    // 6. Operator profiles verification
    console.log("\n📊 Operator profiles linked to users:");
    const operatorProfiles = await pool.query(
      `SELECT op.name, op.tier, u.email, u.id as user_id
       FROM operator_profiles op
       LEFT JOIN users u ON op.user_id = u.id
       ORDER BY op.name`
    );

    console.log("\n" + "=".repeat(80));
    console.log(`${"Name".padEnd(15)} | ${"Tier".padEnd(8)} | ${"Email".padEnd(35)} | User ID`);
    console.log("=".repeat(80));
    for (const op of operatorProfiles.rows) {
      const email = op.email || "❌ Not linked";
      const userId = op.user_id || "❌ NULL";
      console.log(`${op.name.padEnd(15)} | ${op.tier.padEnd(8)} | ${email.padEnd(35)} | ${userId}`);
    }
    console.log("=".repeat(80));

    console.log("\n✅ All done!\n");
    console.log("📝 Default credentials:");
    console.log("   - Super Admin: nodeyourwebapp@gmail.com / admin123");
    console.log("   - Support/Operator: support@easeyourneeds.com / support123");
    console.log("   - Operators: operator.a@easeyourneeds.com / operator123 (and B, C, D, E, F)");

  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

addPasswords();
