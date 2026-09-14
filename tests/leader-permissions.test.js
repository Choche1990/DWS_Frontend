const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

for (const role of ['jefe', 'coordinador']) {
  test(role + ' can create, edit and delete projects and both kinds of tasks', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dws-permissions-'));
    try {
      for (const file of ['ganttStore.js', 'independentTasksStore.js', 'auditStore.js', 'csvStore.js']) {
        fs.copyFileSync(path.join(__dirname, '../backend', file), path.join(dir, file));
      }
      fs.mkdirSync(path.join(dir, 'data'));
      const gantt = require(path.join(dir, 'ganttStore.js'));
      const tasks = require(path.join(dir, 'independentTasksStore.js'));
      const project = {id:1, nombre:'Proyecto', tareas:[{id:2, nombre:'Tarea'}]};
      const other = {id:3, nombre:'Otro equipo', asignado:'Silbana', tareas:[]};
      const save = projects => gantt.saveGantt({projects, actorRole:role});
      save([project, other]);
      project.nombre = 'Editado';
      project.tareas[0].avance = 100;
      save([project, other]);
      assert.equal(gantt.loadGantt().projects.find(p => p.id === 1).nombre, 'Editado');
      project.tareas = [];
      save([project, other]);
      assert.equal(gantt.loadGantt().projects.find(p => p.id === 1).tareas.length, 0);
      save([other]);
      assert.deepEqual(gantt.loadGantt().projects.map(p => p.id), [3]);
      const actor = {role};
      tasks.upsertIndependentTask({task:{id:'a', titulo:'Nueva'}, actor});
      tasks.upsertIndependentTask({task:{id:'a', titulo:'Editada'}, actor});
      assert.equal(tasks.loadIndependentTasks().tasks[0].titulo, 'Editada');
      tasks.deleteIndependentTask({id:'a', actor});
      assert.equal(tasks.loadIndependentTasks().tasks.length, 0);
      tasks.saveIndependentTasks({tasks:[{id:'b'}], actor});
      tasks.saveIndependentTasks({tasks:[], actor});
      assert.equal(tasks.loadIndependentTasks().tasks.length, 0);
    } finally {
      fs.rmSync(dir, {recursive:true, force:true});
    }
  });
}
