(function(root){
  const dayKey = timestamp => { const d=new Date(timestamp);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-'); };
  const moduleOf = e => e.module || (e.event==='GANTT_ENTER'?'gantt':'platform');
  const groupOf = e => e.group || '__unknown';
  function select(events, filters={}) {return events.filter(e => (!filters.from||dayKey(e.timestamp)>=filters.from)&&(!filters.to||dayKey(e.timestamp)<=filters.to)&&(!filters.module||moduleOf(e)===filters.module)&&(!filters.team||groupOf(e)===filters.team)&&(!filters.search||(String(e.name||'')+' '+String(e.email||'')).toLocaleLowerCase().includes(filters.search.trim().toLocaleLowerCase())));}
  function summarize(events){
    const accesses=events.filter(e=>['LOGIN_SUCCESS','GANTT_ENTER'].includes(e.event));
    const users=new Map(),teams=new Map(),days=new Map();
    for(const e of accesses){const day=dayKey(e.timestamp),email=String(e.email||'').trim().toLowerCase();days.set(day,(days.get(day)||0)+1);const group=groupOf(e);teams.set(group,(teams.get(group)||0)+1);if(email){const u=users.get(email)||{key:email,label:e.name||email,count:0,days:new Set()};u.count++;u.days.add(day);users.set(email,u);}}
    const ordered=values=>values.sort((a,b)=>b.count-a.count||a.key.localeCompare(b.key));
    return {total:accesses.length,active:users.size,average:users.size?accesses.length/users.size:0,returning:[...users.values()].filter(u=>u.days.size>1).length,users:ordered([...users.values()]),teams:ordered([...teams].map(([key,count])=>({key,count}))),days:[...days].sort(([a],[b])=>a.localeCompare(b)),peak:ordered([...days].map(([key,count])=>({key,count})))[0]};
  }
  const api={dayKey,moduleOf,groupOf,select,summarize};if(typeof module==='object'&&module.exports)module.exports=api;else root.AccessMetrics=api;
})(typeof window==='undefined'?globalThis:window);
