const $=id=>document.getElementById(id);let snapshot=null,epoch=0;
const node=(tag,text)=>{const n=document.createElement(tag);n.textContent=text;return n;};
async function api(path,body){const r=await fetch(path,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined,cache:'no-store'});const data=await r.json();if(!r.ok)throw Error(data.error);return data;}
function clear(){snapshot=null;$('developer').hidden=true;$('identity').textContent='Not connected';$('proposals').replaceChildren();}
async function refresh(){const turn=epoch;const data=await api('/state');if(turn!==epoch)return;snapshot=data;$('identity').textContent=`SIMULATED ${data.actor.role} · ${data.actor.id}`;$('developer').hidden=data.actor.role!=='developer';$('project').replaceChildren(...data.actor.projects.map(id=>{const n=node('option',id);n.value=id;return n;}));$('worker').textContent=JSON.stringify(data.worker||{});render();}
async function act(path,body){try{await api(path,body);await refresh();$('message').textContent='Simulated event recorded. No real work executed.';}catch(e){$('message').textContent=e.message;}}
function button(container,label,action){const b=node('button',label);b.type='button';b.onclick=action;container.append(b);}
function render(){const target=$('proposals');target.replaceChildren();for(const p of snapshot.proposals){const card=node('article','');card.className='card';card.append(node('h3',p.title),node('p',`SIMULATED ${p.state} · ${p.projectId} · revision ${p.revision}`),node('p',`Original job: ${p.job.state} — ${p.job.reason}`));
  if(snapshot.actor.role==='developer'){
    if(p.state==='requested'){
      const form=document.createElement('form');form.dataset.spec=p.id;
      const fields=[['inputs','Inputs','Sample note text'],['outputs','Outputs','A summary string'],['acceptance','Acceptance test','Output contains a non-empty summary'],['rollback','Rollback plan','Remove only the simulated capability']];
      for(const [name,label,value] of fields){const l=node('label',label),input=document.createElement('textarea');input.name=name;input.value=value;input.required=true;l.append(input);form.append(l);}
      const submit=node('button','Freeze specification');form.append(submit);form.onsubmit=e=>{e.preventDefault();const v=new FormData(form);act('/proposals/'+p.id,{action:'specify',revision:p.revision,specification:{inputs:v.get('inputs'),outputs:v.get('outputs'),dependencies:[],permissions:['memory.read'],acceptanceTests:[v.get('acceptance')],rollback:v.get('rollback'),budget:{maxAttempts:2,units:3}}});};card.append(form);
    }
    const actions={specified:[['Simulate build','build']],failed:[['Retry simulated build','build']],building:[['Start simulated tests','test']],testing:[['Simulate passing tests','result','pass'],['Simulate failed tests','result','fail'],['Simulate exhausted budget','result','exhausted']],needs_review:[['Approve simulated staging','approve_staging'],['Reject proposal','reject']],approved_for_staging:[['Verify simulated staging','verify_staging']],staging_verified:[['Approve simulated promotion','approve_promotion'],['Reject proposal','reject']],approved_for_promotion:[['Register in simulation only','register']],registered:[['Revoke simulation','revoke'],['Roll back simulation','rollback']],revoked:[['Roll back simulation','rollback']]};
    const controls=node('div','');controls.className='controls';for(const [label,action,outcome] of actions[p.state]||[])button(controls,label,()=>act('/proposals/'+p.id,{action,outcome,revision:p.revision}));card.append(controls);
    if(['needs_review','staging_verified'].includes(p.state))card.append(node('p','Independent reviewer fixture required. Sign out and connect the reviewer key.'));
    const details=node('details','');details.append(node('summary','Specification, simulated receipts and audit trail'),node('pre',JSON.stringify({specification:p.specification,attempts:p.attempts,spent:p.spent,receipts:p.receipts,reviews:p.reviews,audit:p.audit},null,2)));card.append(details);
  }
  target.append(card);
}if(!snapshot.proposals.length)target.append(node('p','No proposals visible to this fixture.'));}
$('login').onsubmit=async e=>{e.preventDefault();++epoch;clear();const key=$('key').value;$('key').value='';try{await api('/session',{key});await refresh();$('message').textContent='Synthetic fixture session connected.';}catch(e){$('message').textContent=e.message;}};
$('logout').onclick=async()=>{++epoch;clear();try{await api('/logout',{});$('message').textContent='Signed out.';}catch(e){$('message').textContent=e.message;}};
$('proposal').onsubmit=e=>{e.preventDefault();act('/proposals',{projectId:$('project').value,title:$('title').value});};
for(const b of document.querySelectorAll('[data-worker]'))b.onclick=()=>act('/worker-scenario',{available:b.dataset.worker!=='offline',fresh:b.dataset.worker!=='stale'});
refresh().catch(()=>clear());
