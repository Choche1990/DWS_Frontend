const fs = require('fs');
const path = require('path');
const { readCSVFile, writeCSVFileAtomic } = require('./csvStore');
const { appendAudit } = require('./auditStore');

const DATA_DIR = path.join(__dirname, 'data');
const TASKS_CSV = path.join(DATA_DIR, 'independent_tasks.csv');
const HEADERS = [
  'id', 'titulo', 'complejidad', 'estado', 'inicio', 'fin', 'asignado',
  'descripcion', 'solicitanteNombre', 'solicitanteArea', 'capacidadHoras',
  'createdByEmail', 'dateSetupUntil', 'createdAt', 'updatedAt',
];

function ensureIndependentTasksFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(TASKS_CSV)) writeCSVFileAtomic(TASKS_CSV, HEADERS, []);
}

function rowToTask(row) {
  return {
    id: row.id,
    titulo: row.titulo || '',
    complejidad: row.complejidad || 'Media',
    estado: row.estado || 'En proceso',
    inicio: row.inicio || '',
    fin: row.fin || '',
    asignado: row.asignado || '',
    descripcion: row.descripcion || '',
    solicitanteNombre: row.solicitanteNombre || '',
    solicitanteArea: row.solicitanteArea || '',
    capacidadHoras: row.capacidadHoras === '' ? 1 : Number(row.capacidadHoras),
    createdByEmail: row.createdByEmail || '',
    dateSetupUntil: row.dateSetupUntil || '',
  };
}

function loadIndependentTasks() {
  ensureIndependentTasksFile();
  return { tasks: readCSVFile(TASKS_CSV).rows.map(rowToTask) };
}

function saveIndependentTasks({ tasks, actor = {} }) {
  ensureIndependentTasksFile();
  const previous = readCSVFile(TASKS_CSV).rows;
  const previousById = new Map(previous.map((row) => [String(row.id), row]));
  const role = String(actor.role || '').trim().toLowerCase();
  const canDelete = role === 'admin' || role === 'coordinador';
  const canManageDates = canDelete;
  const incomingIds = new Set(tasks.map((task) => String(task.id)));
  if (!canDelete && previous.some((row) => !incomingIds.has(String(row.id)))) {
    throw new Error('independent_task_deletion_not_allowed');
  }
  const now = new Date().toISOString();
  const rows = tasks.map((task) => {
    const prev = previousById.get(String(task.id));
    const isCreationDraft = prev && prev.createdByEmail &&
      String(prev.createdByEmail).toLowerCase() === String(actor.email || '').toLowerCase() &&
      !String(prev.titulo || '').trim();
    const mayEditDates = !prev || canManageDates || isCreationDraft;
    return {
      id: task.id,
      titulo: task.titulo || '',
      complejidad: task.complejidad || 'Media',
      estado: task.estado || 'En proceso',
      inicio: mayEditDates ? (task.inicio || '') : (prev.inicio || ''),
      fin: mayEditDates ? (task.fin || '') : (prev.fin || ''),
      asignado: task.asignado || '',
      descripcion: task.descripcion || '',
      solicitanteNombre: task.solicitanteNombre || '',
      solicitanteArea: task.solicitanteArea || '',
      capacidadHoras: task.capacidadHoras == null ? 1 : task.capacidadHoras,
      createdByEmail: (prev && prev.createdByEmail) || actor.email || '',
      dateSetupUntil: (prev && prev.dateSetupUntil) || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      createdAt: (prev && prev.createdAt) || now,
      updatedAt: now,
    };
  });
  const auditEntries = [];
  for (const row of rows) {
    const prev = previousById.get(String(row.id));
    if (!prev) {
      auditEntries.push({ action: 'CREATE', entityType: 'independent_task', entityId: row.id, newValue: row.titulo || 'Nueva tarea independiente' });
      continue;
    }
    for (const field of ['inicio', 'fin']) {
      if (String(prev[field] || '') !== String(row[field] || '')) {
        auditEntries.push({ action: 'UPDATE', entityType: 'independent_task', entityId: row.id, field, oldValue: prev[field], newValue: row[field] });
      }
    }
  }
  for (const prev of previous) {
    if (!incomingIds.has(String(prev.id))) auditEntries.push({ action: 'DELETE', entityType: 'independent_task', entityId: prev.id, oldValue: prev.titulo || 'Tarea independiente' });
  }
  writeCSVFileAtomic(TASKS_CSV, HEADERS, rows);
  appendAudit(auditEntries, { email: actor.email || '', name: actor.name || '', role });
  return { tasks: rows.map(rowToTask) };
}

function upsertIndependentTask({ task, actor = {} }) {
  if (!task || task.id == null || String(task.id).trim() === '') throw new Error('independent_task_id_required');
  ensureIndependentTasksFile();
  const current = loadIndependentTasks().tasks;
  const index = current.findIndex((item) => String(item.id) === String(task.id));
  const next = index < 0 ? current.concat(task) : current.map((item, i) => i === index ? { ...item, ...task } : item);
  return saveIndependentTasks({ tasks: next, actor });
}

function deleteIndependentTask({ id, actor = {} }) {
  ensureIndependentTasksFile();
  const role = String(actor.role || '').trim().toLowerCase();
  if (role !== 'admin' && role !== 'coordinador') throw new Error('independent_task_deletion_not_allowed');
  const current = loadIndependentTasks().tasks;
  return saveIndependentTasks({ tasks: current.filter((task) => String(task.id) !== String(id)), actor });
}

module.exports = {
  ensureIndependentTasksFile,
  loadIndependentTasks,
  saveIndependentTasks,
  upsertIndependentTask,
  deleteIndependentTask,
};
