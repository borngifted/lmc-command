import {createHash,randomUUID} from 'node:crypto';
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const copy=x=>structuredClone(x);
export class ForgeError extends Error {constructor(status,message){super(message);this.status=status;}}
const reject=(condition,message,status=409)=>{if(condition)throw new ForgeError(status,message);};
export const fixtures=Object.freeze({
  builder:{id:'demo-builder',role:'developer',projects:['demo-a','demo-b']},
  reviewer:{id:'demo-reviewer',role:'developer',projects:['demo-a','demo-b']},
  client:{id:'demo-client',role:'client',projects:['demo-a']}
});
export class Forge {
  constructor({now=()=>Date.now()}={}){this.now=now;this.proposals=new Map();this.audit=[];this.worker={available:true,fresh:true};}
  log(p,actor,action,detail={}){const event={sequence:this.audit.length+1,at:this.now(),proposal:p.id,actor:actor.id,action,state:p.state,revision:p.revision,detail,previous:this.audit.at(-1)?.digest||null};event.digest=hash(event);this.audit.push(event);}
  visible(actor,p){return actor?.projects.includes(p.projectId);}
  get(actor,id){const p=this.proposals.get(id);reject(!p||!this.visible(actor,p),'Proposal not found',404);return p;}
  developer(actor){reject(actor?.role!=='developer','Developer fixture required',403);}
  create(actor,input){this.developer(actor);reject(!actor.projects.includes(input.projectId),'Project not found',404);reject(typeof input.title!=='string'||!input.title.trim()||input.title.length>120,'Title required (max 120 characters)',400);
    const p={id:randomUUID(),projectId:input.projectId,title:input.title.trim(),owner:actor.id,state:'requested',revision:0,specification:null,receipts:[],reviews:[],attempts:0,spent:0,job:{state:'queued',reason:'missing capability'},simulated:true};this.proposals.set(p.id,p);this.log(p,actor,'requested');return this.view(actor,p);}
  view(actor,p){const common={id:p.id,title:p.title,projectId:p.projectId,state:p.state,revision:p.revision,simulated:true,job:copy(p.job)};if(actor.role!=='developer')return common;return {...copy(p),audit:this.audit.filter(e=>e.proposal===p.id).map(copy),worker:copy(this.worker),executionEnabled:false,productionRegistered:false};}
  list(actor){return [...this.proposals.values()].filter(p=>this.visible(actor,p)).map(p=>this.view(actor,p));}
  receipt(p,kind,passed,reason){const r={id:randomUUID(),kind,passed,reason,at:this.now(),revision:p.revision,specHash:p.specHash,source:'simulated'};r.digest=hash(r);p.receipts.push(r);return r;}
  verified(p,kind){const r=p.receipts.filter(r=>r.kind===kind).at(-1);return r&&r.passed&&r.revision===p.revision&&r.specHash===p.specHash&&this.now()-r.at<=60000;}
  transition(actor,id,input){this.developer(actor);const p=this.get(actor,id);reject(input.revision!==p.revision,'Stale revision; refresh before reviewing');
    const action=input.action;
    if(action==='specify'){
      reject(p.state!=='requested','Specification already frozen');const s=input.specification;
      reject(!s||typeof s.inputs!=='string'||!s.inputs.trim()||typeof s.outputs!=='string'||!s.outputs.trim()||!Array.isArray(s.dependencies)||s.dependencies.some(d=>typeof d!=='string')||!Array.isArray(s.permissions)||s.permissions.some(x=>x!=='memory.read')||!Array.isArray(s.acceptanceTests)||!s.acceptanceTests.length||s.acceptanceTests.some(t=>typeof t!=='string'||!t.trim())||typeof s.rollback!=='string'||!s.rollback.trim()||!Number.isInteger(s.budget?.maxAttempts)||s.budget.maxAttempts<1||s.budget.maxAttempts>3||!Number.isInteger(s.budget?.units)||s.budget.units<1||s.budget.units>10||JSON.stringify(s).length>8000,'Invalid specification or unsafe permission request',400);
      p.specification=copy({inputs:s.inputs,outputs:s.outputs,dependencies:s.dependencies,permissions:s.permissions,acceptanceTests:s.acceptanceTests,rollback:s.rollback,budget:s.budget});p.specHash=hash(p.specification);p.state='specified';
    }else if(action==='build'){
      reject(!['specified','failed'].includes(p.state),'Cannot build in this state');reject(p.attempts>=p.specification.budget.maxAttempts||p.spent>=p.specification.budget.units,'Resource or retry budget exhausted');p.attempts++;p.state='building';
    }else if(action==='test'){
      reject(p.state!=='building','Build simulation required');p.state='testing';
    }else if(action==='result'){
      reject(p.state!=='testing','Testing state required');reject(!['pass','fail','exhausted'].includes(input.outcome),'Unknown fixture outcome',400);
      p.spent+=input.outcome==='exhausted'?p.specification.budget.units:1;
      const passed=input.outcome==='pass'&&p.spent<=p.specification.budget.units;p.state=passed?'needs_review':'failed';
      // Receipts bind to the resulting revision, so review uses exactly this evidence.
      p.revision++;this.receipt(p,'tests',passed,input.outcome);this.log(p,actor,'simulated_test_result',{outcome:input.outcome});return this.view(actor,p);
    }else if(action==='approve_staging'){
      reject(p.state!=='needs_review','Passing tests required');reject(actor.id===p.owner,'Independent review required',403);reject(!this.verified(p,'tests'),'Passing fresh test receipt required');p.reviews.push({actor:actor.id,kind:'staging',specHash:p.specHash,at:this.now()});p.state='approved_for_staging';
    }else if(action==='verify_staging'){
      reject(p.state!=='approved_for_staging','Staging approval required');reject(!this.worker.available||!this.worker.fresh,'Simulated worker unavailable or telemetry stale');p.state='staging_verified';p.revision++;this.receipt(p,'staging',true,'simulated acceptance only');this.log(p,actor,'simulated_staging_verified');return this.view(actor,p);
    }else if(action==='approve_promotion'){
      reject(p.state!=='staging_verified','Staging verification required');reject(actor.id===p.owner,'Independent review required',403);reject(!this.verified(p,'staging'),'Fresh staging receipt required');p.reviews.push({actor:actor.id,kind:'promotion',specHash:p.specHash,at:this.now()});p.state='approved_for_promotion';
    }else if(action==='register'){
      reject(p.state!=='approved_for_promotion','Separate promotion approval required');const r=p.receipts.filter(r=>r.kind==='staging').at(-1);reject(!r?.passed||r.specHash!==p.specHash||this.now()-r.at>60000||!this.worker.available||!this.worker.fresh,'Fresh staging verification and available worker required');p.state='registered';
    }else if(action==='reject'){
      reject(!['needs_review','staging_verified'].includes(p.state),'No review pending');reject(actor.id===p.owner,'Independent review required',403);p.state='rejected';
    }else if(action==='revoke'){
      reject(p.state!=='registered','Only simulated registered capabilities can be revoked');p.state='revoked';
    }else if(action==='rollback'){
      reject(!['registered','revoked'].includes(p.state),'Nothing to roll back');p.state='rolled_back';
    }else throw new ForgeError(400,'Unknown action');
    p.revision++;this.log(p,actor,action);return this.view(actor,p);
  }
  workerScenario(actor,{available,fresh}){this.developer(actor);reject(typeof available!=='boolean'||typeof fresh!=='boolean','Boolean scenario values required',400);this.worker={available,fresh};if(!available||!fresh)for(const p of this.proposals.values())if(p.state==='registered'){p.state='revoked';p.revision++;this.log(p,actor,'simulated_health_revocation');}return copy(this.worker);}
}
