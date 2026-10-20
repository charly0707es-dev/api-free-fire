import { readFile } from 'node:fs/promises';
import { pool } from './db.js';
try {
  await pool.query(await readFile(new URL('../sql/init.sql', import.meta.url), 'utf8'));
  console.log('Tabla personajes lista con datos de ejemplo.');
} catch {
  console.error('No se pudo inicializar PostgreSQL. Revisa Docker y DATABASE_URL.');
  process.exitCode = 1;
} finally {
  await pool.end();
}
