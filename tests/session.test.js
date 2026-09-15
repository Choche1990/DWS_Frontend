const {test}=require('node:test');
const assert=require('node:assert/strict');
const http=require('http');const fs=require('fs');const os=require('os');const path=require('path');
const {createAuth}=require('../backend/sessionStore');
test('session authentication, expiry, permissions, audit and logout',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'dws-auth-'));let time=0;
 const auth=createAuth({logFile:path.join(dir,'events'),now:()=>time,idleMs:100,maxMs:250,authenticate:(email,password)=>password==='valid'?{email,nombre:'Test',rol:email==='admin'?'admin':email==='jefe'?'jefe':'user',modulos:email==='denied'?[]:email==='ia'?['autoatencion-ia']:['gantt']}:null});
 const server=http.createServer((req,res)=>{if(!auth.handle(req,res)){res.writeHead(200);res.end(JSON.stringify(req.authActor));}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 async function request(p,method='GET',cookie='',body,headers={}){return fetch(base+p,{method,headers:{cookie,...headers},body:body?JSON.stringify(body):undefined,redirect:'manual'});}
 async function login(email='admin'){const r=await request('/api/login','POST','',{email,password:'valid'});assert.equal(r.status,200);assert.match(r.headers.get('set-cookie'),/HttpOnly; SameSite=Strict/);return r.headers.get('set-cookie').split(';')[0];}
 try{
 assert.equal((await request('/api/gantt')).status,401);
 assert.equal((await request('/access-control.html')).status,401);
 assert.equal((await request('/api/gantt','GET','dws_session=forged')).status,401);
 assert.equal((await request('/modules/Gantt/gantt.html')).status,302);
 assert.equal((await request('/api/login','POST','',{email:'admin',password:'bad'})).status,401);
 let cookie=await login();
 assert.equal((await request('/access-control.html','GET',cookie)).status,200);
 assert.equal((await request('/access-control.html','POST',cookie)).status,405);
 assert.equal((await request('/api/gantt','GET',cookie)).status,200);
 assert.equal((await request('/api/unknown','GET',cookie)).status,404);
 const actor=await(await request('/api/gantt','POST',cookie,{actor:{role:'fake',email:'fake'}})).json();assert.equal(actor.role,'admin');assert.equal(actor.email,'admin');
 assert.equal((await request('/api/gantt','POST',cookie,{}, {origin:'https://evil.example'})).status,403);
 await request('/modules/Gantt/gantt.html','GET',cookie);
 const report=await(await request('/api/access-history','GET',cookie)).json();assert.equal(report.summary.ganttVisits,1);assert.equal(report.summary.ganttUsers,1);assert.equal(report.summary.failedLogins,1);
 time=90;await request('/api/gantt','GET',cookie);time=101;assert.equal((await request('/api/session','GET',cookie)).status,401);
 cookie=await login();for(time=180;time<350;time+=80)assert.equal((await request('/api/session/activity','POST',cookie)).status,200);
 time=352;assert.equal((await request('/api/session','GET',cookie)).status,401);
 cookie=await login();await request('/api/logout','POST',cookie);assert.equal((await request('/api/gantt','GET',cookie)).status,401);
 cookie=await login('ia');assert.equal((await request('/modules/AutoatencionIA/index.html','GET',cookie)).status,200);assert.equal((await request('/api/gantt','GET',cookie)).status,403);
 cookie=await login('denied');assert.equal((await request('/api/gantt','GET',cookie)).status,403);assert.equal((await request('/api/access-history','GET',cookie)).status,403);
 assert.equal((await request('/access-control.html','GET',cookie)).status,403);
 cookie=await login('jefe');assert.equal((await request('/api/gantt','GET',cookie)).status,200);
 for (const endpoint of ['/api/gantt','/api/independent-tasks','/api/independent-task']) {
   const allowed=await request(endpoint,'POST',cookie,{actorRole:'admin',actor:{role:'admin'}});
   assert.equal(allowed.status,200);assert.equal((await allowed.json()).role,'jefe');
 }
 assert.equal((await request('/api/independent-task','DELETE',cookie,{id:'1'})).status,200);
 assert.equal((await request('/api/access-history','GET',cookie)).status,403);
 assert.equal((await request('/access-control.html','GET',cookie)).status,403);
 assert.equal((await request('/api/session/activity','POST',cookie)).status,200);
 const events=fs.readFileSync(path.join(dir,'events'),'utf8');assert.ok(events.includes('SESSION_EXPIRED'));assert.ok(events.includes('LOGOUT'));assert.ok(!events.includes('dws_session'));assert.ok(!events.includes('valid'));
 }finally{await new Promise(r=>server.close(r));fs.rmSync(dir,{recursive:true,force:true});}
});
