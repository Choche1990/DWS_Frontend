(() => {
  const nativeFetch=window.fetch.bind(window);
  const userKey='digital-workspace-user', activeKey='digital-workspace-demo-session';
  function clear(){localStorage.removeItem(userKey);localStorage.removeItem(activeKey);}
  function end(){clear();window.top.location.replace('/');}
  window.dwsLogout=async()=>{try {const response=await nativeFetch('/api/logout',{method:'POST'});if(!response.ok&&response.status!==401)throw new Error('logout_failed');end();} catch (_) {alert('No se pudo cerrar la sesi?n en el servidor. Revisa la conexi?n e int?ntalo nuevamente.');}};
  window.fetch=async(...args)=>{const res=await nativeFetch(...args);const url=new URL(args[0] instanceof Request?args[0].url:String(args[0]),location.href);if(url.origin===location.origin&&url.pathname.startsWith('/api/')&&url.pathname!=='/api/login'&&res.status===401)end();return res;};
  let lastActivity=0;
  function activity(event){if(!event.isTrusted||!localStorage.getItem(activeKey))return;const t=Date.now();if(t-lastActivity<15000)return;lastActivity=t;window.fetch('/api/session/activity',{method:'POST'}).catch(()=>{});}
  for(const event of ['pointerdown','pointermove','keydown','scroll'])window.addEventListener(event,activity,{passive:true,capture:true});
  window.addEventListener('storage',e=>{if(e.key===activeKey&&!e.newValue)end();});
  setInterval(()=>{if(localStorage.getItem(activeKey))window.fetch('/api/session').catch(()=>{});},15000);
  window.dwsSessionReady=nativeFetch('/api/session').then(async r=>{if(!r.ok){clear();return;}const data=await r.json();localStorage.setItem(userKey,JSON.stringify(data.user));localStorage.setItem(activeKey,'active');if(window===window.top&&data.user.rol==='admin'&&location.pathname!=='/access-control.html'){const addLink=()=>{const link=document.createElement('a');link.href='/access-control.html';link.textContent='Control de accesos';link.style.cssText='position:fixed;bottom:12px;right:16px;z-index:9999;background:#fff;color:#0039a6;border:1px solid #dce3eb;border-radius:8px;padding:8px 12px;font:12px system-ui';document.body.append(link);};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addLink,{once:true});else addLink();}}).catch(()=>clear());
})();
