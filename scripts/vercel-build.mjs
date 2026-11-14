// Vercel build: prepare the database (migrations + course seed), then build the site.
// Both database steps are safe to repeat on every deploy.
import { execSync } from 'node:child_process';

const run = (command, env = process.env) => execSync(command, { stdio: 'inherit', env });
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (databaseUrl) {
  const env = { ...process.env, DATABASE_URL: databaseUrl, DATABASE_SSL: process.env.DATABASE_SSL || 'true' };
  run('node server/scripts/migrate.js', env);
  run('node server/scripts/seed-course.js', env);
} else {
  console.warn('No DATABASE_URL or POSTGRES_URL set: skipping database setup. Sign-up and sign-in will not work until a database is connected.');
}

run('npx vite build');
