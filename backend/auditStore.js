const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { readCSVFile, writeCSVFileAtomic } = require('./csvStore');

const DATA_DIR = path.join(__dirname, 'data');
const AUDIT_CSV = path.join(DATA_DIR, 'audit_log.csv');
const HEADERS = [
  'changeId', 'timestamp', 'userEmail', 'userName', 'userRole',
  'action', 'entityType', 'entityId', 'projectId', 'field',
  'oldValue', 'newValue',
];

function ensureAuditFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(AUDIT_CSV)) writeCSVFileAtomic(AUDIT_CSV, HEADERS, []);
}

function appendAudit(entries, actor = {}) {
  if (!Array.isArray(entries) || entries.length === 0) return;
  ensureAuditFile();
  const current = readCSVFile(AUDIT_CSV).rows;
  const timestamp = new Date().toISOString();
  const rows = entries.map((entry) => ({
    changeId: crypto.randomUUID(),
    timestamp,
    userEmail: actor.email || '',
    userName: actor.name || '',
    userRole: actor.role || '',
    action: entry.action || 'UPDATE',
    entityType: entry.entityType || 'project',
    entityId: entry.entityId == null ? '' : entry.entityId,
    projectId: entry.projectId == null ? '' : entry.projectId,
    field: entry.field || '',
    oldValue: entry.oldValue == null ? '' : String(entry.oldValue),
    newValue: entry.newValue == null ? '' : String(entry.newValue),
  }));
  writeCSVFileAtomic(AUDIT_CSV, HEADERS, current.concat(rows));
}

function loadProjectHistory(projectId) {
  ensureAuditFile();
  return readCSVFile(AUDIT_CSV).rows
    .filter((row) => String(row.projectId) === String(projectId))
    .filter((row) => {
      if (row.action === 'CREATE' || row.action === 'DELETE') return row.entityType === 'project' || row.entityType === 'project_task';
      return row.action === 'UPDATE' && (row.field === 'fechaSolicitud' || row.field === 'inicio' || row.field === 'fin' || row.field === 'finReal');
    })
    .sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)));
}

function loadIndependentTaskHistory() {
  ensureAuditFile();
  return readCSVFile(AUDIT_CSV).rows
    .filter((row) => row.entityType === 'independent_task')
    .filter((row) => row.action === 'CREATE' || row.action === 'DELETE' || (row.action === 'UPDATE' && (row.field === 'inicio' || row.field === 'fin')))
    .sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)));
}

module.exports = { ensureAuditFile, appendAudit, loadProjectHistory, loadIndependentTaskHistory };
