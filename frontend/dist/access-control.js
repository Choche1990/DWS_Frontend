(() => {
  const $ = id => document.getElementById(id);
  const labels = {LOGIN_SUCCESS:'Ingreso correcto',LOGIN_FAILED:'Intento fallido',LOGOUT:'Cierre de sesión',SESSION_EXPIRED:'Sesión vencida',GANTT_ENTER:'Entrada al Gantt'};
  let events = [], page = 0, loaded = false;
  const metrics=window.AccessMetrics;
  const teamLabel=id=>({datalab:'DataLab',pmo:'PMO',smartdesk:'SmartDesk',presupuesto:'Presupuesto',lideres:'Jefes / l?deres',__unknown:'Sin equipo registrado'})[id]||id;
  function filterBy(id,value){$(id).value=value;page=0;render();}
  function ranking(id,items,action){
    $(id).replaceChildren();
    if(!items.length){$(id).textContent='Sin accesos para estos filtros.';return;}
    const max=items[0].count;
    for(const item of items.slice(0,10)){
      const button=document.createElement('button'),title=document.createElement('div'),label=document.createElement('span'),value=document.createElement('span'),track=document.createElement('div'),fill=document.createElement('div');
      button.className='chart-button';button.type='button';title.className='bar-label';label.textContent=item.label||teamLabel(item.key);value.textContent=item.count;title.append(label,value);track.className='track';fill.className='fill';fill.style.width=(item.count/max*100)+'%';track.append(fill);button.append(title,track);button.title=(item.label||teamLabel(item.key))+' ? '+item.count+' accesos';button.addEventListener('click',()=>action(item.key));$(id).append(button);
    }
  }
  function charts(selected){
    const summary=metrics.summarize(selected);
    $('active').textContent=summary.active;$('average').textContent=summary.average.toLocaleString('es-PE',{maximumFractionDigits:1});$('returning').textContent=summary.returning;$('peak').textContent=summary.peak?.key||'?';$('peakCount').textContent=summary.peak?summary.peak.count+' accesos':'Sin accesos';
    ranking('rankingUsers',summary.users,key=>filterBy('search',key));ranking('rankingTeams',summary.teams,key=>filterBy('team',key));
    $('trend').replaceChildren();
    if(!summary.days.length){$('trend').textContent='Sin accesos para estos filtros.';return;}
    const last=summary.days[summary.days.length-1][0],end=new Date(last+'T12:00:00'),start=new Date(end);start.setDate(start.getDate()-29);const dayCounts=new Map(summary.days),max=summary.peak.count;
    for(const d=new Date(start);d<=end;d.setDate(d.getDate()+1)){
      const key=metrics.dayKey(d);if(($('from').value&&key<$('from').value)||key<summary.days[0][0])continue;
      const count=dayCounts.get(key)||0,button=document.createElement('button'),number=document.createElement('span'),bar=document.createElement('span'),label=document.createElement('span');button.className='day';button.type='button';number.textContent=count;bar.className='column';bar.style.height=Math.max(2,count/max*120)+'px';label.textContent=key.slice(5);button.title=key+': '+count+' accesos';button.setAttribute('aria-label',button.title);button.append(number,bar,label);button.addEventListener('click',()=>{$('from').value=key;filterBy('to',key);});$('trend').append(button);
    }
  }
  const size = 25;
  function render() {
    if(!loaded)return;
    if ($('from').value && $('to').value && $('from').value > $('to').value) {
      $('status').textContent = 'La fecha inicial debe ser anterior o igual a la fecha final.';
      $('results').hidden = true; return;
    }
    const selected=metrics.select(events,Object.fromEntries(['from','to','search','module','team'].map(id=>[id,$(id).value])));
    charts(selected);
    const count = type => selected.filter(e => e.event === type).length;
    $('success').textContent = count('LOGIN_SUCCESS'); $('failed').textContent = count('LOGIN_FAILED');
    $('visits').textContent = count('GANTT_ENTER'); $('users').textContent = new Set(selected.filter(e => e.event === 'GANTT_ENTER').map(e => e.email)).size;
    $('bars').replaceChildren();
    const maximum = Math.max(1,...Object.keys(labels).map(count));
    for (const [type,label] of Object.entries(labels)) {
      const row = document.createElement('div'), title = document.createElement('div'), name = document.createElement('span'), value = document.createElement('span'), track = document.createElement('div'), fill = document.createElement('div');
      title.className='bar-label';name.textContent=label;value.textContent=count(type);title.append(name,value);
      track.className='track';fill.className='fill';fill.style.width=(count(type)/maximum*100)+'%';track.append(fill);row.append(title,track);$('bars').append(row);
    }
    page = Math.max(0,Math.min(page,Math.ceil(selected.length/size)-1));
    $('events').replaceChildren();
    for (const e of selected.slice(page*size,(page+1)*size)) {
      const tr = document.createElement('tr');
      for (const value of [new Date(e.timestamp).toLocaleString(),labels[e.event]||e.event,e.name||e.email||'Sin usuario',metrics.moduleOf(e)==='gantt'?'Gantt':'Plataforma',teamLabel(metrics.groupOf(e))]) {
        const td = document.createElement('td');td.textContent=value;tr.append(td);
      }
      if(e.name && e.email){const email=document.createElement('small');email.textContent=e.email;tr.children[2].append(email);}
      $('events').append(tr);
    }
    $('pageInfo').textContent=selected.length ? `${page*size+1}–${Math.min((page+1)*size,selected.length)} de ${selected.length} registros` : 'Sin registros para los filtros seleccionados.';
    $('prev').disabled=page===0;$('next').disabled=(page+1)*size>=selected.length;
    $('results').hidden=false;$('status').textContent=events.length ? 'Registros disponibles. Filtra por fecha o usuario para explorar la actividad.' : 'Todavía no hay registros de acceso.';
  }
  async function refresh() {
    loaded=false;$('refresh').disabled=true;$('status').textContent='Cargando registros…';$('results').hidden=true;
    try {
      const response=await fetch('/api/access-history');
      if(!response.ok)throw new Error(response.status===403?'Solo los administradores pueden consultar este módulo.':response.status===401?'Inicia sesión para consultar este módulo.':'No se pudo consultar el registro. Vuelve a intentar.');
      const data=await response.json();events=data.events.sort((a,b)=>b.timestamp.localeCompare(a.timestamp));const current=$('team').value;$('team').replaceChildren(new Option('Todos los equipos',''));for(const group of [...new Set(events.map(metrics.groupOf))].sort())$('team').add(new Option(teamLabel(group),group));$('team').value=current;if($('team').selectedIndex<0)$('team').value='';loaded=true;page=0;render();
    } catch(error){events=[];$('status').textContent=error.message||'No se pudo conectar con el servidor.';}
    finally{$('refresh').disabled=false;}
  }
  for(const id of ['from','to','search','module','team'])$(id).addEventListener('input',()=>{page=0;render();});
  $('reset').addEventListener('click',()=>{for(const id of ['from','to','search','module','team'])$(id).value='';page=0;render();});
  $('prev').addEventListener('click',()=>{page--;render();});$('next').addEventListener('click',()=>{page++;render();});
  $('refresh').addEventListener('click',refresh);window.dwsSessionReady.then(refresh);
})();
