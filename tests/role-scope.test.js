const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { buildDirectory, scopeProjects, scopeTasks, parseGroups } = require('../backend/teamScope');

function componentFromBundle(file) {
  const html = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const raw = /<script type="__bundler\/template">([\s\S]*?)<\/script>/.exec(html)[1];
  const start = html.indexOf('    let template = JSON.parse(templateEl.textContent);');
  const end = html.indexOf('    // Nested page bundles (iframe targets).', start);
  const listeners = {};
  const storage = new Map();
  const context = { templateEl: { textContent: raw }, localStorage: { getItem: key => storage.get(key) || null, setItem(key,value) { storage.set(key,value); } }, window: {}, document: { addEventListener(name, handler) { listeners[name] = handler; } }, DCLogic: class {}, setTimeout, clearTimeout };
  vm.createContext(context);
  vm.runInContext(html.slice(start, end) + '\nglobalThis.result = template;', context);
  const script = context.result.slice(context.result.indexOf('class Component extends DCLogic'), context.result.lastIndexOf('</script>'));
  vm.runInContext(script + '\nglobalThis.ComponentClass = Component;', context);
  return { ComponentClass: context.ComponentClass, template: context.result, listeners, document:context.document };
}

test('supervisors see the union of assigned teams; old group names remain compatible', () => {
  const directorio = buildDirectory([{nombre:'Johannes',grupo:'PMO'}, {nombre:'Silbana',grupo:'SmartDesk'}, {nombre:'Patty',rol:'jefe'}]);
  const projects = [{id:1,asignado:'Jean Pierre'}, {id:2,asignado:'Johannes'}, {id:3,asignado:'Silbana'}, {id:4,asignado:'Marcelo'}];
  const user = grupos => ({rol:'jefe',gruposSupervisados:parseGroups(grupos),directorio});
  assert.deepEqual(scopeProjects(user('Datalab;PMO'),projects).map(p=>p.id),[1,2]);
  assert.deepEqual(scopeTasks(user('Datalab;PMO;SmartDesk'),projects).map(p=>p.id),[1,2,3]);
  assert.deepEqual(scopeProjects(user('SmartDesk'),projects).map(p=>p.id),[3]);
  assert.deepEqual(scopeProjects(user(''),projects),[]);
  assert.deepEqual(scopeProjects({rol:'coordinador'},projects),projects); // Keep writer payloads complete.
  assert.deepEqual(parseGroups('Proyectos;PMO;DATALAB'),['pmo','datalab']);
  assert.equal(directorio.personGroups['Jean Pierre'],'datalab');
  assert.equal(directorio.personGroups.Patty,undefined);
});

for (const file of ['gantt-demo.html','frontend/dist/modules/Gantt/gantt.html']) {
  test(file + ' removes board columns without deleting tasks and preserves the choice after refresh', () => {
    const {ComponentClass,template} = componentFromBundle(file);
    assert.ok(template.includes('!col.canRemoveColumn'));
    for (const rol of ['jefe','coordinador']) {
      const component = new ComponentClass();
      const tasks = [{id:'a',asignado:'Brian',titulo:'Conservar'}];
      component.state = {...component.state,currentUser:{email:rol+'@test',rol,grupo:'smartdesk',gruposSupervisados:['smartdesk'],directorio:buildDirectory([])},kanbanTasks:tasks,kanbanColumns:['Brian']};
      component.setState = update => {component.state={...component.state,...(typeof update==='function'?update(component.state):update)};};
      component.persistKanbanTasks = () => {throw new Error('Removing a column must not write task data');};
      component.removeKanbanColumn('Brian');
      assert.equal(component.state.kanbanTasks,tasks);
      assert.equal(component.visibleBoardColumns(component.state).includes('Brian'),false);
      component.state.kanbanColumns=['Brian']; // Server polling reconstructs assignees.
      assert.equal(component.visibleBoardColumns(component.state).includes('Brian'),false);
      const reloaded = new ComponentClass();
      reloaded.state=component.state;
      assert.equal(reloaded.visibleBoardColumns(reloaded.state).includes('Brian'),false);
      component.addKanbanColumn('Brian');
      assert.equal(component.visibleBoardColumns(component.state).includes('Brian'),true);
      component.addKanbanColumn('Richard'); // Empty columns survive reload/polling too.
      component.state.kanbanColumns=['Brian'];
      assert.equal(component.visibleBoardColumns(component.state).includes('Richard'),true);
      assert.equal(component.canManageBoardColumn('Johannes'),false);
      component.addKanbanColumn('Johannes');
      assert.equal(component.visibleBoardColumns(component.state).includes('Johannes'),false);
      component.state.currentUser={...component.state.currentUser,rol:'analista',nombre:'Brian'};
      assert.equal(component.canManageBoardColumn('Brian'),false);
    }
  });
  test(file + ' commits dates on blur and prevents wheel changes only on the focused date', () => {
    const {template,listeners,document} = componentFromBundle(file);
    const dates = template.match(/<input\b[^>]*type="date"[^>]*>/g);
    assert.ok(dates.length > 0);
    for (const tag of dates) {
      assert.ok(tag.includes('sc-camel-on-blur='));
      assert.ok(!tag.includes('sc-camel-on-change='));
    }
    const input = {matches:()=>true};
    let prevented = 0;
    const event = {target:input,preventDefault:()=>prevented++};
    listeners.wheel(event);
    assert.equal(prevented,0);
    document.activeElement=input;
    listeners.wheel(event);
    assert.equal(prevented,1);
    input.matches=()=>false;
    listeners.wheel(event);
    assert.equal(prevented,1);
  });
  test(file + ' polling leaves active date edits and unchanged task state alone', async () => {
    const {ComponentClass} = componentFromBundle(file);
    const mount = ComponentClass.prototype.componentDidMount.toString();
    const start = mount.indexOf('this.independentTasksPoll = setInterval(');
    const end = mount.indexOf('},5000);', start) + '},5000);'.length;
    assert.ok(start >= 0 && end > start);
    let poll, requests = 0, updates = 0, resolveResponse;
    const doc = {activeElement:{matches:()=>true}};
    const component = {state:{kanbanTasks:[]},setState:()=>updates++};
    const fetch = () => { requests++; return new Promise(resolve=>{resolveResponse=resolve;}); };
    new Function('setInterval','fetch','document',mount.slice(start,end)).call(component, fn=>{poll=fn;},fetch,doc);
    poll();
    assert.equal(requests,0);
    doc.activeElement=null;
    poll();
    doc.activeElement={matches:()=>true};
    resolveResponse({ok:true,json:async()=>({tasks:[{id:'a'}]})});
    await new Promise(resolve=>setImmediate(resolve));
    assert.equal(updates,0); // Editing began while the request was in flight.
    doc.activeElement=null;
    poll();
    resolveResponse({ok:true,json:async()=>({tasks:[]})});
    await new Promise(resolve=>setImmediate(resolve));
    assert.equal(updates,0);
    poll();
    resolveResponse({ok:true,json:async()=>({tasks:[{id:'a',asignado:'Anyela'}]})});
    await new Promise(resolve=>setImmediate(resolve));
    assert.equal(updates,1);
  });
  test(file + ' applies scopes, preserves history methods and allows jefe mutations', () => {
    const {ComponentClass,template} = componentFromBundle(file);
    const component = new ComponentClass();
    assert.equal(typeof component.openProjectHistory,'function');
    assert.equal(typeof component.openProjectAcceptance,'function');
    const projects = [{id:1,asignado:'Jean Pierre'}, {id:2,asignado:'Johannes'}, {id:3,asignado:'Silbana'}];
    const user = {rol:'jefe',gruposSupervisados:['datalab','pmo'],directorio:buildDirectory([])};
    component.state = {...component.state,currentUser:user,projects};
    component.props = {};
    const rendered = component.renderVals();
    assert.equal(rendered.isReadOnly,false);
    assert.equal(rendered.canDelete,true);
    assert.ok(!rendered.teamNames.includes('Silbana'));
    assert.deepEqual(Array.from(component.getScopedProjects(component.state),p=>p.id),[1,2]);
    assert.deepEqual(Array.from(component.getOrgState(component.state).groups,g=>g.id),['datalab','pmo']);
    component.setState = update => { component.state = {...component.state, ...(typeof update === 'function' ? update(component.state) : update)}; };
    component.persistData = () => {};
    component.update(1,{avance:100});
    assert.equal(component.state.projects.find(p=>p.id===1).avance,100);
    assert.equal(component.state.projects.find(p=>p.id===3).asignado,'Silbana');
    assert.ok(template.includes('Solo consulta'));
    assert.ok(template.includes('sc-camel-disabled="{{ isReadOnly }}"'));
    assert.ok(!template.includes('const scopedPeople = st.currentUser'));
  });
}
