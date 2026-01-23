-- Esquema de la base de dades per al Joc del Cavall
-- Base de dades Cloudflare D1: joc-cavall-10x10

CREATE TABLE IF NOT EXISTS rankings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  puntuacio INTEGER NOT NULL,
  data TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_rankings_puntuacio ON rankings(puntuacio DESC);
