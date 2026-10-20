BEGIN;
CREATE TABLE IF NOT EXISTS personajes (
  id INTEGER PRIMARY KEY CHECK (id > 0),
  nombre TEXT NOT NULL,
  habilidad TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('Activa', 'Pasiva')),
  descripcion TEXT NOT NULL
);
-- Catalogo educativo de ejemplo. No representa datos oficiales actualizados.
INSERT INTO personajes (id, nombre, habilidad, tipo, descripcion) VALUES
  (1, 'Alok', 'Apoyo musical', 'Activa', 'Personaje de ejemplo enfocado en apoyo al equipo.'),
  (2, 'Kelly', 'Velocidad', 'Pasiva', 'Personaje de ejemplo enfocado en movilidad.'),
  (3, 'Hayato', 'Combate', 'Pasiva', 'Personaje de ejemplo enfocado en combate.'),
  (4, 'Moco', 'Rastreo', 'Pasiva', 'Personaje de ejemplo enfocado en informacion.'),
  (5, 'Chrono', 'Proteccion', 'Activa', 'Personaje de ejemplo enfocado en defensa.')
ON CONFLICT (id) DO NOTHING;
COMMIT;
