(() => {
  const $ = id => document.getElementById(id);
  const labels = {LOGIN_SUCCESS:'Ingreso correcto',LOGIN_FAILED:'Intento fallido',LOGOUT:'Cierre de sesión',SESSION_EXPIRED:'Sesión vencida',GANTT_ENTER:'Entrada al Gantt'};
  let events = [], page = 0;
  const size = 25;
  function render() {
    if ($('from').value && $('to').value && $('from').value > $('to').value) {
      $('status').textContent = 'La fecha inicial debe ser anterior o igual a la fecha final.';
      $('results').hidden = true; return;
    }
    const query = $('search').value.trim().toLocaleLowerCase();
    const selected = events.filter(e => {
      const d = new Date(e.timestamp);
      const day = [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
      return (!$('from').value || day >= $('from').value) && (!$('to').value || day <= $('to').value) && (String(e.name||'')+' '+String(e.email||'')).toLocaleLowerCase().includes(query);
    });
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
      for (const value of [new Date(e.timestamp).toLocaleString(),labels[e.event]||e.event,e.name||e.email||'Sin usuario']) {
        const td = document.createElement('td');td.textContent=value;tr.append(td);
      }
      if(e.name && e.email){const email=document.createElement('small');email.textContent=e.email;tr.lastChild.append(email);}
      $('events').append(tr);
    }
    $('pageInfo').textContent=selected.length ? `${page*size+1}–${Math.min((page+1)*size,selected.length)} de ${selected.length} registros` : 'Sin registros para los filtros seleccionados.';
    $('prev').disabled=page===0;$('next').disabled=(page+1)*size>=selected.length;
    $('results').hidden=false;$('status').textContent=events.length ? 'Registros disponibles. Filtra por fecha o usuario para explorar la actividad.' : 'Todavía no hay registros de acceso.';
  }
  async function refresh() {
    $('refresh').disabled=true;$('status').textContent='Cargando registros…';$('results').hidden=true;
    try {
      const response=await fetch('/api/access-history');
      if(!response.ok)throw new Error(response.status===403?'Solo los administradores pueden consultar este módulo.':response.status===401?'Inicia sesión para consultar este módulo.':'No se pudo consultar el registro. Vuelve a intentar.');
      const data=await response.json();events=data.events.sort((a,b)=>b.timestamp.localeCompare(a.timestamp));page=0;render();
    } catch(error){events=[];$('status').textContent=error.message||'No se pudo conectar con el servidor.';}
    finally{$('refresh').disabled=false;}
  }
  for(const id of ['from','to','search'])$(id).addEventListener('input',()=>{page=0;render();});
  $('reset').addEventListener('click',()=>{for(const id of ['from','to','search'])$(id).value='';page=0;render();});
  $('prev').addEventListener('click',()=>{page--;render();});$('next').addEventListener('click',()=>{page++;render();});
  $('refresh').addEventListener('click',refresh);window.dwsSessionReady.then(refresh);
})();
