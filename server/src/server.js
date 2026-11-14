import { app } from './app.js';
import { config } from './config.js';
import { pool } from './db.js';

await pool.query('SELECT 1');
const server = app.listen(config.port, () => console.info(`Thinking Academy API listening on port ${config.port}`));

async function shutdown(signal) {
  console.info(`${signal} received; closing API server`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
