const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {prepareUsers,migrate}=require('../scripts/reorganize-users');
const {readCSVFile,writeCSVFileAtomic}=require('../backend/csvStore');

test('user reorganization preserves existing identities, other accounts, columns and passwords',()=>{
 const source={headers:['email','password','nombre','rol','grupo','modulos','extra'],rows:[
  {email:'jmontesdeoca@intercorp.com.pe',password:'existing',nombre:'Jean Pierre',rol:'analista',grupo:'datalab',modulos:'gantt',extra:'keep'},
  {email:'admin@example.test',password:'untouched',nombre:'Admin',rol:'admin',grupo:'',modulos:'*',extra:'other'}
 ]};
 const planned=prepareUsers(source);
 assert.equal(planned.rows.length,8);
 assert.equal(planned.rows[0].nombre,'Jean Pierre');
 assert.equal(planned.rows[0].password,'existing');
 assert.equal(planned.rows[0].extra,'keep');
 assert.deepEqual(planned.rows[1],source.rows[1]);
 assert.equal(planned.missingPasswords.length,6);
 assert.equal(source.rows[0].rol,'analista');
 const passwordOnly=prepareUsers(source,{'admin@example.test':'replacement'});
 assert.deepEqual(passwordOnly.rows[1],{...source.rows[1],password:'replacement'});
 assert.equal(source.rows[1].password,'untouched');
 assert.throws(()=>prepareUsers(source,{'missing@example.test':'replacement'}),/Unknown password account/);
 assert.throws(()=>prepareUsers(source,{'admin@example.test':''}),/Empty password/);
});

test('migration backs up data, preserves all project bytes and is repeatable',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'dws-migration-'));
 const data=path.join(root,'data');fs.mkdirSync(data);
 try {
  writeCSVFileAtomic(path.join(data,'users.csv'),['email','password','nombre','rol','grupo','modulos'],[{email:'admin',password:'original',nombre:'Admin',rol:'admin',grupo:'',modulos:'*'}]);
  for(const name of ['projects.csv','tasks.csv','independent_tasks.csv','audit_log.csv']) fs.writeFileSync(path.join(data,name),'original bytes\r\n');
  assert.throws(()=>migrate(data),/Passwords required/);
  const plan=prepareUsers(readCSVFile(path.join(data,'users.csv')));
  const passwords=Object.fromEntries(plan.missingPasswords.map(email=>[email,'test-only']));
  const result=migrate(data,passwords);
  assert.equal(result.users,8);
  assert.equal(readCSVFile(path.join(result.backup,'users.csv')).rows.length,1);
  const first=fs.readFileSync(path.join(data,'users.csv'));
  migrate(data,passwords);
  assert.deepEqual(fs.readFileSync(path.join(data,'users.csv')),first);
  for(const name of result.unchanged) assert.equal(fs.readFileSync(path.join(data,name),'utf8'),'original bytes\r\n');
 } finally {fs.rmSync(root,{recursive:true,force:true});}
});
