import http from 'node:http';
import { pool } from './db.js';

function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return send(res, 405, { error: 'Solo se permite GET.' });
    }
    if (url.pathname === '/') return send(res, 200, {
      nombre: 'API educativa de Free Fire',
      aviso: 'Catalogo propio con datos de ejemplo. No oficial.',
      rutas: ['/health', '/api/personajes', '/api/personajes/1'],
    });
    if (url.pathname === '/health') {
      await pool.query('SELECT 1');
      return send(res, 200, { estado: 'ok', base_de_datos: 'conectada' });
    }
    if (url.pathname === '/api/personajes') {
      const { rows } = await pool.query('SELECT * FROM personajes ORDER BY id');
      return send(res, 200, rows);
    }
    const match = url.pathname.match(/^\/api\/personajes\/([^/]+)$/);
    if (match) {
      const id = Number(match[1]);
      if (!/^\d+$/.test(match[1]) || !Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
        return send(res, 400, { error: 'El ID debe ser un entero positivo valido.' });
      }
      const { rows } = await pool.query('SELECT * FROM personajes WHERE id = $1', [id]);
      return rows.length ? send(res, 200, rows[0]) : send(res, 404, { error: 'Personaje no encontrado.' });
    }
    send(res, 404, { error: 'Ruta no encontrada.' });
  } catch {
    console.error('Fallo al atender una consulta. Revisa la conexion y la inicializacion de PostgreSQL.');
    send(res, 503, { error: 'Base de datos temporalmente no disponible.' });
  }
});

server.listen(Number(process.env.PORT || 3000), '0.0.0.0', () => {
  console.log(`API escuchando en el puerto ${process.env.PORT || 3000}`);
});
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(async () => { await pool.end(); process.exit(0); });
  });
}
