const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
test('history preserves event names and distinguishes project/task changes',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'gantt-history-'));
 try {
  for(const file of ['ganttStore.js','auditStore.js','csvStore.js']) fs.copyFileSync(path.join(__dirname,'../backend',file),path.join(dir,file));
  fs.mkdirSync(path.join(dir,'data'));
  const {saveGantt}=require(path.join(dir,'ganttStore.js'));
  const {loadProjectHistory}=require(path.join(dir,'auditStore.js'));
  const project={id:1,nombre:'Proyecto A',inicio:'2026-09-01',tareas:[{id:2,nombre:'Diseño, inicial',inicio:'2026-09-01',fin:'2026-09-10',avance:0}]};
  const save=()=>saveGantt({projects:[project],actorRole:'admin',actorName:'Ana'});
  save();
  project.inicio='2026-09-02'; project.tareas[0].inicio='2026-09-03'; project.tareas[0].avance=100; save();
  project.tareas[0].nombre='Diseño final'; save();
  project.tareas=[]; save();
  const rows=loadProjectHistory(1);
  const taskDate=rows.find(r=>r.entityType==='project_task'&&r.field==='inicio');
  assert.equal(taskDate.entityName,'Diseño, inicial');
  assert.equal(taskDate.projectName,'Proyecto A');
  assert.equal(taskDate.oldValue,'2026-09-01'); assert.equal(taskDate.newValue,'2026-09-03');
  assert.equal(rows.find(r=>r.entityType==='project'&&r.field==='inicio').entityName,'Proyecto A');
  assert.equal(rows.find(r=>r.field==='estado').newValue,'Completado');
  assert.equal(rows.find(r=>r.action==='DELETE').entityName,'Diseño final');
  assert.equal(rows.filter(r=>r.action==='CREATE').length,2);
 } finally { fs.rmSync(dir,{recursive:true,force:true}); }
});

test('legacy history resolves names by project and task without changing the audit file',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'gantt-legacy-history-'));
 try {
  for(const file of ['ganttStore.js','auditStore.js','csvStore.js']) fs.copyFileSync(path.join(__dirname,'../backend',file),path.join(dir,file));
  fs.mkdirSync(path.join(dir,'data'));
  const {saveGantt}=require(path.join(dir,'ganttStore.js'));
  const {appendAudit,loadProjectHistory}=require(path.join(dir,'auditStore.js'));
  saveGantt({actorRole:'admin',projects:[
   {id:1,nombre:'Proyecto A',tareas:[{id:2,nombre:'Tarea A'}]},
   {id:3,nombre:'Proyecto B',tareas:[{id:2,nombre:'Tarea B'}]},
  ]});
  appendAudit([
   {projectId:1,entityType:'project_task',entityId:2,field:'inicio',oldValue:'2026-09-01',newValue:'2026-09-02'},
   {projectId:3,entityType:'project_task',entityId:2,field:'inicio',oldValue:'2026-09-01',newValue:'2026-09-02'},
   {projectId:1,entityType:'project_task',entityId:99,field:'inicio'},
   {projectId:1,entityType:'project_task',entityId:100,action:'DELETE',oldValue:'Tarea eliminada'},
  ]);
  const auditFile=path.join(dir,'data/audit_log.csv');
  const before=fs.readFileSync(auditFile);
  const rows=loadProjectHistory(1);
  const legacy=rows.find(r=>r.entityId==='2'&&r.action==='UPDATE');
  assert.equal(legacy.entityName,'Tarea A');
  assert.equal(legacy.entityNameSource,'current');
  assert.equal(loadProjectHistory(3).find(r=>r.action==='UPDATE').entityName,'Tarea B');
  assert.equal(rows.find(r=>r.entityId==='99').entityNameSource,'unknown');
  assert.equal(rows.find(r=>r.entityId==='100').entityName,'Tarea eliminada');
  assert.deepEqual(fs.readFileSync(auditFile),before);
 } finally { fs.rmSync(dir,{recursive:true,force:true}); }
});
