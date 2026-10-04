const $=id=>document.getElementById(id);
function clearData(){for(const id of ['projects','jobs','workers']) $(id).replaceChildren();$('workersPanel').hidden=true;}
function row(target,title,detail){const item=document.createElement('div');item.className='item';const t=document.createElement('div');t.className='t';t.textContent=title;const m=document.createElement('div');m.className='m';m.textContent=detail;item.append(t,m);$(target).append(item);}
if(document.body.dataset.private==='true') {
  document.querySelector('.topnav').hidden=true; // existing public links are not private gateway routes
  $('login').hidden=false;
  $('boundary').textContent='Private experimental view. Authorization and project membership are checked by the platform on every refresh.';
  $('sessionNote').textContent='Sign in with your own platform account. No execution is available.';
  let busy=false, generation=0, signedOut=false;
  async function refresh(){
    if(busy||signedOut)return;busy=true;const current=generation;
    try{
      const r=await fetch('/telemetry',{cache:'no-store'});if(!r.ok)throw Error();const data=await r.json();if(current!==generation)return;clearData();
      $('status').textContent=`${data.source.toUpperCase()} · ${data.view.toUpperCase()} VIEW`;
      $('freshness').textContent=`${data.source==='simulated'?'SIMULATED TEST FIXTURE. ':''}Observed ${data.observedAt}. Job states are historical database records, limited to the latest ${data.jobLimit}; they are not a readiness verdict.`;
      for(const p of data.projects)row('projects',p.name,p.status);
      for(const p of data.projects){const counts={};for(const j of data.jobs.filter(j=>j.projectId===p.id))counts[j.state]=(counts[j.state]||0)+1;row('jobs',p.name,JSON.stringify(counts));}
      if(data.view==='developer'){$('workersPanel').hidden=false;for(const w of data.workers||[])row('workers',w.name,`${w.status}; last heartbeat: ${w.lastSeen||'unknown'}; registered capabilities: ${JSON.stringify(w.capabilities)}`);}
      if(!data.projects.length)row('projects','No assigned projects','No project data available to this session.');
    }catch{if(current===generation){clearData();$('status').textContent='UNAVAILABLE · SIGN IN OR RETRY';$('freshness').textContent='No current observation. Previous private data cleared; no fallback used.';}}finally{busy=false;}
  }
  $('login').addEventListener('submit',async e=>{e.preventDefault();const current=++generation;signedOut=true;const email=$('email').value;const password=$('password').value;$('password').value='';clearData();try{const r=await fetch('/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});if(!r.ok)throw Error();if(current!==generation)return;signedOut=false;await refresh();}catch{if(current===generation){clearData();$('status').textContent='AUTHENTICATION UNAVAILABLE';}}});
  $('logout').onclick=async()=>{++generation;signedOut=true;clearData();try{await fetch('/logout',{method:'POST'});$('status').textContent='SIGNED OUT';}catch{$('status').textContent='SIGN OUT FAILED · CLOSE THIS WINDOW';}finally{$('freshness').textContent='Private data cleared.';}};
  refresh();setInterval(refresh,15000);
}
