/**
 * Script to add passwords for users without passwords
 * Run: npx tsx --env-file=.env.local scripts/add-remaining-passwords.ts
 */

import pool from "@/lib/db";
import bcrypt from "bcryptjs";

async function addRemainingPasswords() {
  console.log("🔐 Adding remaining user passwords...\n");

  try {
    // Find users without passwords
    const usersWithoutPassword = await pool.query(`
      SELECT id, email, name, role 
      FROM users 
      WHERE password IS NULL 
      ORDER BY role, email
    `);

    console.log(`Found ${usersWithoutPassword.rows.length} users without passwords:`);
    for (const user of usersWithoutPassword.rows) {
      console.log(`  - ${user.email} (${user.role})`);
    }
    console.log();

    // Generate password based on role
    const passwords: Record<string, string> = {
      'admin': 'admin123',
      'customer': 'customer123',
      'operator': 'operator123',
      'super_admin': 'superadmin123'
    };

    for (const user of usersWithoutPassword.rows) {
      const password = passwords[user.role] || 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        `UPDATE users SET password = $1 WHERE id = $2`,
        [hashedPassword, user.id]
      );

      console.log(`✅ ${user.email.padEnd(45)} | Role: ${user.role.padEnd(12)} | Password: ${password}`);
    }

    console.log("\n✅ All passwords added!\n");

    // Verification
    const allUsers = await pool.query(`
      SELECT email, role, password IS NOT NULL as has_password
      FROM users
      ORDER BY role, email
    `);

    console.log("📊 VERIFICATION:");
    console.log("=".repeat(70));
    console.log(`${"Email".padEnd(45)} | ${"Role".padEnd(12)} | Password`);
    console.log("=".repeat(70));
    for (const user of allUsers.rows) {
      console.log(`${user.email.padEnd(45)} | ${user.role.padEnd(12)} | ${user.has_password ? "✅" : "❌"}`);
    }
    console.log("=".repeat(70));

  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

addRemainingPasswords();
