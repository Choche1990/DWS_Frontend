// Motor CSV genérico (RFC4180) sin dependencias externas.
// Usado por ganttStore.js para leer/escribir projects.csv y tasks.csv.

const fs = require('fs');
const crypto = require('crypto');

const BOM = '﻿';

function parseCSV(text) {
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);

  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let i = 0;
  const len = text.length;

  function endField() {
    row.push(field);
    field = '';
  }
  function endRow() {
    endField();
    rows.push(row);
    row = [];
  }

  while (i < len) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i += 1; continue;
      }
      field += ch; i += 1; continue;
    }
    if (ch === '"') { inQuotes = true; i += 1; continue; }
    if (ch === ',') { endField(); i += 1; continue; }
    if (ch === '\r') { i += 1; continue; }
    if (ch === '\n') { endRow(); i += 1; continue; }
    field += ch; i += 1;
  }
  if (field.length > 0 || row.length > 0) endRow();

  // Descarta líneas finales completamente vacías (típico de un archivo terminado en \n)
  while (rows.length && rows[rows.length - 1].length === 1 && rows[rows.length - 1][0] === '') {
    rows.pop();
  }

  if (rows.length === 0) return { headers: [], rows: [] };

  const headers = rows[0];
  const dataRows = rows.slice(1).map((r) => {
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = r[idx] !== undefined ? r[idx] : ''; });
    return obj;
  });
  return { headers, rows: dataRows };
}

function csvEscapeCell(value) {
  const s = value === null || value === undefined ? '' : String(value);
  if (/[",\r\n]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function stringifyCSV(headers, rows) {
  const lines = [headers.map(csvEscapeCell).join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscapeCell(row[h])).join(','));
  }
  return BOM + lines.join('\r\n') + '\r\n';
}

function readCSVFile(filePath) {
  if (!fs.existsSync(filePath)) return { headers: [], rows: [] };
  const text = fs.readFileSync(filePath, 'utf8');
  return parseCSV(text);
}

function writeCSVFileAtomic(filePath, headers, rows) {
  const tmp = filePath + '.tmp-' + crypto.randomBytes(6).toString('hex');
  fs.writeFileSync(tmp, stringifyCSV(headers, rows));
  fs.renameSync(tmp, filePath);
}

module.exports = { parseCSV, stringifyCSV, readCSVFile, writeCSVFileAtomic };
