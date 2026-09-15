const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { findUser } = require('./usersStore');
function createAuth({ authenticate = findUser, now = Date.now, logFile = path.join(__dirname, 'data', 'access_log.jsonl'), idleMs = 30*60*1000, maxMs = 8*60*60*1000 } = {}) {
  const sessions = new Map();
  const attempts = new Map();
  const cookieName = 'dws_session';
  function log(event, user = {}, extra = {}) {
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
    fs.appendFileSync(logFile, JSON.stringify({timestamp:new Date(now()).toISOString(), event, email:user.email||'', name:user.nombre||'', group:user.grupo||'', module:event==='GANTT_ENTER'?'gantt':'platform', ...extra})+'\n');
  }
  function reply(res, status, data) { res.writeHead(status, {'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store'}); res.end(JSON.stringify(data)); }
  function cookie(req, res, value) { res.setHeader('Set-Cookie', cookieName+'='+value+'; HttpOnly; SameSite=Strict; Path=/'+(process.env.SESSION_COOKIE_SECURE==='true'||req.socket.encrypted?'; Secure':'')+(!value?'; Max-Age=0':'')); }
  function token(req) { const match = (req.headers.cookie||'').match(/(?:^|;\s*)dws_session=([^;]+)/); return match ? match[1] : ''; }
  function expire() { for (const [key,s] of sessions) if(now()-s.last>=idleMs||now()-s.created>=maxMs){log('SESSION_EXPIRED',s.user);sessions.delete(key);} for(const [k,v]of attempts)if(now()-v.start>=15*60*1000)attempts.delete(k); }
  function handle(req,res) {
    let p;
    try { p = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch (_) { reply(res,400,{error:'invalid_path'}); return true; }
    if(!p.startsWith('/api/')&&!p.startsWith('/modules/')&&p!=='/access-control.html')return false;
    res.setHeader('Cache-Control','no-store');
    if(!['GET','HEAD'].includes(req.method)) {
      const origin=req.headers.origin;
      if(req.headers['sec-fetch-site']==='cross-site'||(origin&&origin!==((req.socket.encrypted||process.env.SESSION_COOKIE_SECURE==='true')?'https://':'http://')+req.headers.host)){reply(res,403,{error:'invalid_origin'});return true;}
    }
    expire();
    if(p==='/api/login'&&req.method==='POST') {
      const ip=req.socket.remoteAddress||''; const a=attempts.get(ip)||{start:now(),count:0};
      if(a.count>=10){reply(res,429,{error:'too_many_attempts'});return true;}
      let body=''; let over=false;
      req.on('data',c=>{if(over)return;body+=c;if(body.length>8192){over=true;reply(res,413,{error:'body_too_large'});}});
      req.on('end',()=>{if(over)return;try{
        const input=JSON.parse(body); const email=typeof input.email==='string'?input.email.trim().toLowerCase():'';
        const user=authenticate(email,typeof input.password==='string'?input.password:'');
        if(!user){a.count++;attempts.set(ip,a);log('LOGIN_FAILED',{email});reply(res,401,{ok:false,error:'invalid_credentials'});return;}
        sessions.delete(token(req)); const id=crypto.randomBytes(32).toString('hex');
        log('LOGIN_SUCCESS',user); sessions.set(id,{user,created:now(),last:now()});cookie(req,res,id);
        reply(res,200,{ok:true,user});
      }catch(e){reply(res,400,{error:'login_failed'});}});return true;
    }
    const id=token(req); const session=sessions.get(id);
    if(!session){cookie(req,res,'');if(p.startsWith('/modules/')){res.writeHead(302,{Location:'/'});res.end();}else reply(res,401,{error:'session_required'});return true;}
    req.authUser=session.user;req.authActor={email:session.user.email,name:session.user.nombre,role:String(session.user.rol||'').trim().toLowerCase()};
    if(p==='/access-control.html') {
      if(req.authActor.role!=='admin'){reply(res,403,{error:'admin_required'});return true;}
      if(!['GET','HEAD'].includes(req.method)){reply(res,405,{error:'method_not_allowed'});return true;}
      return false;
    }
    if(p==='/api/session'&&req.method==='GET'){reply(res,200,{user:session.user,expiresAt:Math.min(session.last+idleMs,session.created+maxMs)});return true;}
    if(p==='/api/session/activity'&&req.method==='POST'){session.last=now();reply(res,200,{ok:true});return true;}
    if(p==='/api/logout'&&req.method==='POST'){log('LOGOUT',session.user);sessions.delete(id);cookie(req,res,'');reply(res,200,{ok:true});return true;}
    if(p==='/api/access-history'&&req.method==='GET') {
      if(req.authActor.role!=='admin'){reply(res,403,{error:'admin_required'});return true;}
      const events=fs.existsSync(logFile)?fs.readFileSync(logFile,'utf8').trim().split('\n').filter(Boolean).map(JSON.parse):[];
      const gantt=events.filter(e=>e.event==='GANTT_ENTER');
      reply(res,200,{summary:{successfulLogins:events.filter(e=>e.event==='LOGIN_SUCCESS').length,failedLogins:events.filter(e=>e.event==='LOGIN_FAILED').length,ganttVisits:gantt.length,ganttUsers:new Set(gantt.map(e=>e.email)).size},events});return true;
    }
    const ganttApis = ['/api/gantt','/api/independent-tasks','/api/independent-task','/api/project-history','/api/project-charter','/api/project-acceptance'];
    const module = p.startsWith('/modules/AutoatencionIA/') ? 'autoatencion-ia' : (p.startsWith('/modules/Gantt/') || ganttApis.includes(p)) ? 'gantt' : null;
    if (!module) { reply(res,404,{error:'not_found'}); return true; }
    if(req.authActor.role!=='admin'&&!(session.user.modulos||[]).includes(module)){reply(res,403,{error:'module_forbidden'});return true;}

    if(p==='/modules/Gantt/gantt.html'&&req.method==='GET')log('GANTT_ENTER',session.user);
    return false;
  }
  return {handle};
}
module.exports={createAuth};
