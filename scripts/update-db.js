const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: "postgresql://postgres.anczgzanagrqegiweclh:vgn6LIZDk2a4WBN7@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres",
});

async function run() {
  try {
    console.log("1. Adding 'password' column to 'users' table...");
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;");
    console.log("   - Success.");

    console.log("2. Setting temporary password for admin account...");
    const adminEmail = "nodeyourwebapp@gmail.com";
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const result = await pool.query(
      "UPDATE users SET password = $1 WHERE email = $2 RETURNING id",
      [hashedPassword, adminEmail]
    );

    if (result.rowCount > 0) {
      console.log(`   - Success: Admin password set to 'admin123' for ${adminEmail}`);
    } else {
      console.log(`   - Warning: Admin account ${adminEmail} not found in database.`);
    }

  } catch (err) {
    console.error("!!! Error during database update:", err);
  } finally {
    await pool.end();
  }
}

run();
