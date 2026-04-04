import { Pool } from "pg";

// Connection pool for Auth.js adapter
// Uses the transaction pooler URL from Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export default pool;
