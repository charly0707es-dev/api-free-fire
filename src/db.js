import pg from 'pg';
if (!process.env.DATABASE_URL) throw new Error('Falta DATABASE_URL. Configura .env o las variables de Render.');
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});
pool.on('error', () => console.error('Conexion inactiva de PostgreSQL interrumpida.'));
