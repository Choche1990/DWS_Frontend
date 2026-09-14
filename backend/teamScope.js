// Existing assignment names are stable keys; changing a role never renames work.
const DEFAULT_PERSON_GROUPS = {
  'Jean Pierre': 'datalab', Anyela: 'datalab', Camila: 'datalab', Edson: 'datalab', Weimar: 'datalab',
  Johannes: 'pmo', Franchesca: 'pmo',
  Marcelo: 'presupuesto', Miluska: 'presupuesto', Antonio: 'presupuesto',
  Brian: 'smartdesk', Richard: 'smartdesk', Silbana: 'smartdesk', Lucerito: 'smartdesk',
  Daniel: 'smartdesk', Macarena: 'smartdesk', Mauricio: 'lideres', Paolo: 'lideres', Patty: 'smartdesk', Otros: 'smartdesk',
};
const GROUP_NAMES = { datalab: 'DataLab', pmo: 'PMO', smartdesk: 'SmartDesk', presupuesto: 'Presupuesto', lideres: 'Jefes / líderes' };
function normalizeGroup(value) {
  const key = String(value || '').trim().toLowerCase();
  return key === 'proyectos' ? 'pmo' : key;
}
function parseGroups(value) {
  return [...new Set((Array.isArray(value) ? value : String(value || '').split(/[;,]/)).map(normalizeGroup).filter(Boolean))];
}
function membershipGroup(user) {
  // Compatibility with deployed CSVs from before supervisor memberships were added.
  // An explicitly configured group always takes precedence.
  if (['bperezc@intercorp.com.pe','pvallejoe@intercorp.com.pe'].includes(String(user.email || '').trim().toLowerCase())) return 'lideres';
  return normalizeGroup(user.grupo) ||
    (['pazana@intercorp.com.pe'].includes(String(user.email || '').trim().toLowerCase()) ? 'smartdesk' : '');
}
function buildDirectory(users) {
  const personGroups = { ...DEFAULT_PERSON_GROUPS };
  const leaderScopes = {Mauricio:['datalab','pmo'], Paolo:['datalab','pmo','smartdesk']};
  for (const user of users) {
    const group = membershipGroup(user);
    if (group === 'lideres') leaderScopes[user.nombre] = parseGroups(user.gruposSupervisados);
    if (user.nombre && group) personGroups[user.nombre] = group;
    // A supervisor's scope is not their team's membership.
    if (user.rol === 'jefe' && !group) delete personGroups[user.nombre];
  }
  const ids = [...new Set([...Object.keys(GROUP_NAMES), ...Object.values(personGroups), ...users.flatMap(u => parseGroups(u.gruposSupervisados))])];
  return { personGroups, leaderScopes, groups: ids.map(id => ({ id, name: GROUP_NAMES[id] || id })) };
}
function isJefe(user) { return String(user && user.rol || '').trim().toLowerCase() === 'jefe'; }
function canViewAssignment(user, name) {
  if (!isJefe(user)) return true;
  const group = user.directorio && user.directorio.personGroups[name];
  const scope = parseGroups(user.gruposSupervisados);
  if (group === 'lideres') return ((user.directorio.leaderScopes || {})[name] || []).some(g => scope.includes(g));
  return !!group && scope.includes(normalizeGroup(group));
}
function scopeProjects(user, projects) { return projects.filter(p => canViewAssignment(user, p.asignado)); }
function scopeTasks(user, tasks) { return tasks.filter(t => canViewAssignment(user, t.asignado)); }
module.exports = { normalizeGroup, parseGroups, membershipGroup, buildDirectory, isJefe, canViewAssignment, scopeProjects, scopeTasks };
