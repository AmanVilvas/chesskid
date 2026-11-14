import 'dotenv/config';
import pg from 'pg';

const email = process.argv[2]?.trim().toLowerCase();
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error('Usage: npm run make-admin -- learner@example.com');
  process.exit(2);
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: true } : false });
try {
  const result = await pool.query("UPDATE users SET role = 'admin', updated_at = NOW() WHERE email = $1 RETURNING id", [email]);
  if (!result.rowCount) {
    console.error('No user with that email exists. Create the account first.');
    process.exitCode = 1;
  } else {
    console.info('Admin role granted. The new role is applied on the next API request.');
  }
} catch {
  console.error('Admin role update failed. Verify database configuration.');
  process.exitCode = 1;
} finally {
  await pool.end();
}
