// Convierte entre la forma anidada que usa el Gantt en memoria
// ({ projects: [{ ...campos, tareas:[...] }], nextId }) y dos tablas CSV
// relacionadas: projects.csv y tasks.csv (unidas por projectId).
//
// Reglas clave (ver plan): los ids nunca se regeneran, siempre viajan como
// Number; nextId no se persiste, se recalcula a partir de los ids reales;
// createdAt se conserva entre guardados, updatedAt se refresca siempre.

const fs = require('fs');
const path = require('path');
const { readCSVFile, writeCSVFileAtomic } = require('./csvStore');
const { appendAudit } = require('./auditStore');

const DATA_DIR = path.join(__dirname, 'data');
const PROJECTS_CSV = path.join(DATA_DIR, 'projects.csv');
const TASKS_CSV = path.join(DATA_DIR, 'tasks.csv');
const PROJECTS_SEED = path.join(DATA_DIR, 'projects.seed.csv');
const TASKS_SEED = path.join(DATA_DIR, 'tasks.seed.csv');

const PROJECT_STRING_FIELDS = [
  'nombre', 'descripcion', 'periodo', 'estado', 'asignado', 'solicitante',
  'complejidad', 'fechaSolicitud', 'inicio', 'fin', 'finReal',
  'tituloEjecutivo', 'descripcionEjecutiva', 'objetivo', 'prioridad',
  'monedaDinero',
];
const PROJECT_NUMBER_FIELDS = [
  'score', 'dineroAntes', 'dineroDespues', 'ahorroTiempoAntes',
  'ahorroTiempoDespues', 'ahorroFTE',
];
const PROJECT_BOOL_FIELDS = ['naDinero', 'naTiempo', 'naFTE'];
const PROJECT_JSON_FIELDS = ['equiposInvolucrados', 'procesoEtapas', 'proximosPasos', 'riesgos'];
const PROJECT_JSON_DEFAULTS = { equiposInvolucrados: '[]', procesoEtapas: '[]', proximosPasos: '[]', riesgos: '[]' };

// Orden explícito y estable de columnas del CSV de proyectos:
const PROJECTS_HEADERS = [
  'id', 'nombre', 'descripcion', 'periodo', 'estado', 'asignado', 'solicitante',
  'complejidad', 'score', 'fechaSolicitud', 'inicio', 'fin', 'finReal',
  'tituloEjecutivo', 'descripcionEjecutiva', 'objetivo', 'prioridad',
  'naDinero', 'monedaDinero', 'dineroAntes', 'dineroDespues',
  'naTiempo', 'ahorroTiempoAntes', 'ahorroTiempoDespues',
  'naFTE', 'ahorroFTE',
  'equiposInvolucrados', 'procesoEtapas', 'proximosPasos', 'riesgos',
  'extra', 'createdAt', 'updatedAt',
];
const PROJECT_EXPLICIT_FIELDS = new Set(PROJECTS_HEADERS.filter((f) => f !== 'extra' && f !== 'createdAt' && f !== 'updatedAt'));

const TASKS_HEADERS = [
  'projectId', 'id', 'nombre', 'peso', 'inicio', 'fin', 'asignado', 'avance',
  'comentario', 'createdByEmail', 'dateSetupUntil', 'createdAt', 'updatedAt',
];

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(PROJECTS_CSV) && fs.existsSync(PROJECTS_SEED)) {
    fs.copyFileSync(PROJECTS_SEED, PROJECTS_CSV);
  }
  if (!fs.existsSync(TASKS_CSV) && fs.existsSync(TASKS_SEED)) {
    fs.copyFileSync(TASKS_SEED, TASKS_CSV);
  }
}

function safeJsonParse(value, fallback) {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return parsed === undefined ? fallback : parsed;
  } catch (e) {
    return fallback;
  }
}

function rowToProject(row) {
  const extra = safeJsonParse(row.extra, {});
  const project = { ...extra };

  project.id = Number(row.id);
  for (const f of PROJECT_STRING_FIELDS) project[f] = row[f] || '';
  for (const f of PROJECT_NUMBER_FIELDS) project[f] = row[f] === '' || row[f] === undefined ? 0 : Number(row[f]);
  for (const f of PROJECT_BOOL_FIELDS) project[f] = row[f] === 'true';
  for (const f of PROJECT_JSON_FIELDS) project[f] = safeJsonParse(row[f], safeJsonParse(PROJECT_JSON_DEFAULTS[f], []));

  return project;
}

function rowToTask(row) {
  return {
    id: Number(row.id),
    nombre: row.nombre || '',
    peso: row.peso === '' || row.peso === undefined ? 0 : Number(row.peso),
    inicio: row.inicio || '',
    fin: row.fin || '',
    asignado: row.asignado || '',
    avance: row.avance === '' || row.avance === undefined ? 0 : Number(row.avance),
    comentario: row.comentario || '',
    createdByEmail: row.createdByEmail || '',
    dateSetupUntil: row.dateSetupUntil || '',
  };
}

function loadGantt() {
  const projectsCsv = readCSVFile(PROJECTS_CSV);
  const tasksCsv = readCSVFile(TASKS_CSV);

  const projects = projectsCsv.rows.map(rowToProject);
  const tasksByProjectId = new Map();
  for (const row of tasksCsv.rows) {
    const pid = Number(row.projectId);
    if (!tasksByProjectId.has(pid)) tasksByProjectId.set(pid, []);
    tasksByProjectId.get(pid).push(rowToTask(row));
  }
  for (const project of projects) {
    project.tareas = tasksByProjectId.get(project.id) || [];
  }

  const allIds = projects.map((p) => p.id).filter((n) => Number.isFinite(n));
  const nextId = allIds.length ? Math.max(100, ...allIds) + 1 : 100;

  return { projects, nextId };
}

function projectToRow(project, previousById, now) {
  const prev = previousById.get(project.id);
  const row = {
    id: project.id,
    createdAt: (prev && prev.createdAt) || now,
    updatedAt: now,
  };
  for (const f of PROJECT_STRING_FIELDS) row[f] = project[f] !== undefined ? project[f] : '';
  for (const f of PROJECT_NUMBER_FIELDS) row[f] = project[f] !== undefined ? project[f] : '';
  for (const f of PROJECT_BOOL_FIELDS) row[f] = project[f] ? 'true' : 'false';
  for (const f of PROJECT_JSON_FIELDS) row[f] = JSON.stringify(project[f] !== undefined ? project[f] : safeJsonParse(PROJECT_JSON_DEFAULTS[f], []));

  const extra = {};
  for (const key of Object.keys(project)) {
    if (key === 'tareas' || PROJECT_EXPLICIT_FIELDS.has(key)) continue;
    extra[key] = project[key];
  }
  row.extra = JSON.stringify(extra);

  return row;
}

function taskToRow(projectId, task, previousByKey, now) {
  const key = projectId + '::' + task.id;
  const prev = previousByKey.get(key);
  return {
    projectId,
    id: task.id,
    nombre: task.nombre !== undefined ? task.nombre : '',
    peso: task.peso !== undefined ? task.peso : '',
    inicio: task.inicio !== undefined ? task.inicio : '',
    fin: task.fin !== undefined ? task.fin : '',
    asignado: task.asignado !== undefined ? task.asignado : '',
    avance: task.avance !== undefined ? task.avance : '',
    comentario: task.comentario !== undefined ? task.comentario : '',
    createdByEmail: (prev && prev.createdByEmail) || task.createdByEmail || '',
    dateSetupUntil: (prev && prev.dateSetupUntil) || task.dateSetupUntil || '',
    createdAt: (prev && prev.createdAt) || now,
    updatedAt: now,
  };
}

function saveGantt({ projects, actorRole, actorEmail, actorName }) {
  const now = new Date().toISOString();

  const prevProjectsCsv = readCSVFile(PROJECTS_CSV);
  const prevTasksCsv = readCSVFile(TASKS_CSV);

  const previousProjectsById = new Map(prevProjectsCsv.rows.map((r) => [Number(r.id), r]));
  const previousTasksByKey = new Map(prevTasksCsv.rows.map((r) => [r.projectId + '::' + r.id, r]));

  // Solo coordinadores y administradores pueden eliminar. La misma regla se
  // valida aqui para no depender exclusivamente del boton de la interfaz.
  const normalizedRole = String(actorRole || '').trim().toLowerCase();
  const canDelete = normalizedRole === 'admin' || normalizedRole === 'coordinador';
  const canManageDates = canDelete;
  const incomingProjectIds = new Set(projects.map((p) => Number(p.id)));
  for (const previous of prevProjectsCsv.rows) {
    if (!canDelete && !incomingProjectIds.has(Number(previous.id))) {
      throw new Error('project_deletion_not_allowed');
    }
  }
  const incomingTaskKeys = new Set();
  for (const project of projects) {
    for (const task of (Array.isArray(project.tareas) ? project.tareas : [])) {
      incomingTaskKeys.add(String(project.id) + '::' + String(task.id));
    }
  }
  for (const previous of prevTasksCsv.rows) {
    const key = String(previous.projectId) + '::' + String(previous.id);
    if (!canDelete && !incomingTaskKeys.has(key)) throw new Error('task_deletion_not_allowed');
  }

  const projectRows = [];
  const taskRows = [];
  const auditEntries = [];

  for (const project of projects) {
    const previousProject = previousProjectsById.get(Number(project.id));
    if (previousProject && !canManageDates) {
      const previousExtra = safeJsonParse(previousProject.extra, {});
      const isCreationDraft = previousExtra.createdByEmail &&
        String(previousExtra.createdByEmail).toLowerCase() === String(actorEmail || '').toLowerCase() &&
        String(previousProject.nombre || '').trim() === 'Nuevo proyecto';
      if (!isCreationDraft) {
        project.inicio = previousProject.inicio || '';
        project.fin = previousProject.fin || '';
        project.fechaSolicitud = previousProject.fechaSolicitud || '';
        project.finReal = previousProject.finReal || '';
      }
    }
    const projectRow = projectToRow(project, previousProjectsById, now);
    projectRows.push(projectRow);
    if (!previousProject) {
      auditEntries.push({ action: 'CREATE', entityType: 'project', entityId: project.id, projectId: project.id, newValue: project.nombre || '' });
    } else {
      for (const field of ['fechaSolicitud', 'inicio', 'fin', 'finReal']) {
        if (String(previousProject[field] || '') !== String(projectRow[field] || '')) {
          auditEntries.push({ action: 'UPDATE', entityType: 'project', entityId: project.id, projectId: project.id, field, oldValue: previousProject[field], newValue: projectRow[field] });
        }
      }
    }
    const tareas = Array.isArray(project.tareas) ? project.tareas : [];
    for (const task of tareas) {
      const taskKey = String(project.id) + '::' + String(task.id);
      const previousTask = previousTasksByKey.get(taskKey);
      if (previousTask && !canManageDates) {
        const isCreationDraft = previousTask.createdByEmail &&
          String(previousTask.createdByEmail).toLowerCase() === String(actorEmail || '').toLowerCase() &&
          String(previousTask.nombre || '').trim() === 'Nueva tarea';
        if (!isCreationDraft) {
          task.inicio = previousTask.inicio || '';
          task.fin = previousTask.fin || '';
        }
      }
      const taskRow = taskToRow(project.id, task, previousTasksByKey, now);
      taskRows.push(taskRow);
      if (!previousTask) {
        auditEntries.push({ action: 'CREATE', entityType: 'project_task', entityId: task.id, projectId: project.id, newValue: task.nombre || '' });
      } else {
        for (const field of ['inicio', 'fin']) {
          if (String(previousTask[field] || '') !== String(taskRow[field] || '')) {
            auditEntries.push({ action: 'UPDATE', entityType: 'project_task', entityId: task.id, projectId: project.id, field, oldValue: previousTask[field], newValue: taskRow[field] });
          }
        }
      }
    }
  }

  for (const previous of prevProjectsCsv.rows) {
    if (!incomingProjectIds.has(Number(previous.id))) auditEntries.push({ action: 'DELETE', entityType: 'project', entityId: previous.id, projectId: previous.id, oldValue: previous.nombre || '' });
  }
  for (const previous of prevTasksCsv.rows) {
    const key = String(previous.projectId) + '::' + String(previous.id);
    if (!incomingTaskKeys.has(key) && incomingProjectIds.has(Number(previous.projectId))) {
      auditEntries.push({ action: 'DELETE', entityType: 'project_task', entityId: previous.id, projectId: previous.projectId, oldValue: previous.nombre || '' });
    }
  }

  writeCSVFileAtomic(PROJECTS_CSV, PROJECTS_HEADERS, projectRows);
  writeCSVFileAtomic(TASKS_CSV, TASKS_HEADERS, taskRows);
  appendAudit(auditEntries, { email: actorEmail, name: actorName, role: normalizedRole });
}

module.exports = { ensureDataFiles, loadGantt, saveGantt };
