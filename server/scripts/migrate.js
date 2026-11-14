import 'dotenv/config';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const here = path.dirname(fileURLToPath(import.meta.url));
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: true } : false });

try {
  const client = await pool.connect();
  try {
    await client.query("SELECT pg_advisory_lock(hashtext('thinking-academy-schema'))");
    await client.query('CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');
    const files = (await readdir(path.join(here, '../migrations'))).filter((name) => name.endsWith('.sql')).sort();
    for (const name of files) {
      const existing = await client.query('SELECT 1 FROM schema_migrations WHERE name = $1', [name]);
      if (existing.rowCount) continue;
      const sql = await readFile(path.join(here, '../migrations', name), 'utf8');
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [name]);
        await client.query('COMMIT');
        console.info(`Applied migration ${name}`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
    await client.query("SELECT pg_advisory_unlock(hashtext('thinking-academy-schema'))");
  } finally {
    client.release();
  }
} catch (error) {
  console.error('Database migration failed. Check database availability and configuration.');
  if (process.env.NODE_ENV !== 'production') console.error(error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
