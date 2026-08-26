// Tabla de usuarios (control de accesos) respaldada en CSV, editable a mano en Excel.
// Mismo patrón que ganttStore.js: seed committeado + archivo real gitignored.

const fs = require('fs');
const path = require('path');
const { readCSVFile } = require('./csvStore');

const DATA_DIR = path.join(__dirname, 'data');
const USERS_CSV = path.join(DATA_DIR, 'users.csv');
const USERS_SEED = path.join(DATA_DIR, 'users.seed.csv');

const ALL_MODULES = ['gantt', 'process-mining', 'autoatencion-ia'];

function ensureUsersFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_CSV) && fs.existsSync(USERS_SEED)) {
    fs.copyFileSync(USERS_SEED, USERS_CSV);
  }
}

function parseModulos(raw, rol) {
  if (rol === 'admin') return ALL_MODULES.slice();
  const s = (raw || '').trim();
  if (!s) return ['gantt'];
  if (s === '*') return ALL_MODULES.slice();
  return s.split(',').map((x) => x.trim()).filter(Boolean);
}

function findUser(email, password) {
  const { rows } = readCSVFile(USERS_CSV);
  const target = (email || '').trim().toLowerCase();
  const row = rows.find((r) => (r.email || '').trim().toLowerCase() === target);
  if (!row) return null;
  if ((row.password || '') !== password) return null;

  return {
    email: row.email,
    nombre: row.nombre || '',
    rol: row.rol || '',
    grupo: row.grupo || '',
    modulos: parseModulos(row.modulos, row.rol),
  };
}

module.exports = { ensureUsersFile, findUser };
