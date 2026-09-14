// Existing assignment names are stable keys; changing a role never renames work.
const DEFAULT_PERSON_GROUPS = {
  'Jean Pierre': 'datalab', Anyela: 'datalab', Camila: 'datalab', Edson: 'datalab', Weimar: 'datalab',
  Johannes: 'pmo', Franchesca: 'pmo',
  Marcelo: 'presupuesto', Miluska: 'presupuesto', Antonio: 'presupuesto',
  Brian: 'smartdesk', Richard: 'smartdesk', Silbana: 'smartdesk', Lucerito: 'smartdesk',
  Daniel: 'smartdesk', Macarena: 'smartdesk', Mauricio: 'smartdesk', Paolo: 'smartdesk', Patty: 'smartdesk', Otros: 'smartdesk',
};
const GROUP_NAMES = { datalab: 'DataLab', pmo: 'PMO', smartdesk: 'SmartDesk', presupuesto: 'Presupuesto' };
function normalizeGroup(value) {
  const key = String(value || '').trim().toLowerCase();
  return key === 'proyectos' ? 'pmo' : key;
}
function parseGroups(value) {
  return [...new Set((Array.isArray(value) ? value : String(value || '').split(/[;,]/)).map(normalizeGroup).filter(Boolean))];
}
function buildDirectory(users) {
  const personGroups = { ...DEFAULT_PERSON_GROUPS };
  for (const user of users) {
    if (user.nombre && user.grupo) personGroups[user.nombre] = normalizeGroup(user.grupo);
    // A supervisor's scope is not their team's membership.
    if (user.rol === 'jefe' && !user.grupo) delete personGroups[user.nombre];
  }
  const ids = [...new Set([...Object.keys(GROUP_NAMES), ...Object.values(personGroups), ...users.flatMap(u => parseGroups(u.gruposSupervisados))])];
  return { personGroups, groups: ids.map(id => ({ id, name: GROUP_NAMES[id] || id })) };
}
function isJefe(user) { return String(user && user.rol || '').trim().toLowerCase() === 'jefe'; }
function canViewAssignment(user, name) {
  if (!isJefe(user)) return true;
  const group = user.directorio && user.directorio.personGroups[name];
  return !!group && parseGroups(user.gruposSupervisados).includes(normalizeGroup(group));
}
function scopeProjects(user, projects) { return projects.filter(p => canViewAssignment(user, p.asignado)); }
function scopeTasks(user, tasks) { return tasks.filter(t => canViewAssignment(user, t.asignado)); }
module.exports = { normalizeGroup, parseGroups, buildDirectory, isJefe, canViewAssignment, scopeProjects, scopeTasks };
