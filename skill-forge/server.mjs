import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {Forge,fixtures,ForgeError} from './engine.mjs';
export function prototype({enabled=false,forge=new Forge()}={}){
  const keys=new Map(Object.entries(fixtures).map(([name,actor])=>[randomBytes(32).toString('hex'),{name,actor}]));
  const sessions=new Map();
  const server=http.createServer(async(req,res)=>{
    const send=(status,data,type='application/json')=>{res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"});res.end(type==='application/json'?JSON.stringify(data):data);};
    try{
      if(!enabled)return send(404,{error:'Skill Forge is disabled'});
      const origin=`http://127.0.0.1:${server.address().port}`;
      if(req.headers.host!==new URL(origin).host)throw new ForgeError(403,'Loopback host required');
      const path=new URL(req.url,origin).pathname;
      let body={};if(req.method==='POST'){
        if(req.headers.origin!==origin||req.headers['content-type']!=='application/json')throw new ForgeError(403,'Same-origin JSON required');
        let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>10000)throw new ForgeError(413,'Request too large');}
        try{body=JSON.parse(raw);}catch{throw new ForgeError(400,'Invalid JSON');}
      }
      if(req.method==='GET'&&['/','/ui.js','/style.css'].includes(path)){const file=path==='/'?'index.html':path.slice(1);return send(200,await readFile(new URL(file,import.meta.url),'utf8'),path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':'text/html');}
      if(req.method==='POST'&&path==='/session'){
        const identity=keys.get(body.key);if(!identity)throw new ForgeError(401,'Invalid fixture key');
        for(const [key,s] of sessions)if(s.expires<Date.now())sessions.delete(key);
        if(sessions.size>=100)throw new ForgeError(429,'Fixture session limit');
        const token=randomBytes(32).toString('hex');sessions.set(token,{actor:identity.actor,expires:Date.now()+900000});
        res.setHeader('Set-Cookie',`forge=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=900`);return send(200,{ok:true,source:'simulated'});
      }
      const token=(req.headers.cookie||'').match(/(?:^|;\s*)forge=([a-f0-9]{64})(?:;|$)/)?.[1];const session=sessions.get(token);
      if(!session||session.expires<Date.now())throw new ForgeError(401,'Fixture sign-in required');
      const actor=session.actor;
      if(req.method==='POST'&&path==='/logout'){sessions.delete(token);res.setHeader('Set-Cookie','forge=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');return send(200,{ok:true});}
      if(req.method==='GET'&&path==='/state')return send(200,{source:'simulated',ephemeral:true,executionEnabled:false,actor:{id:actor.id,role:actor.role,projects:actor.projects},worker:actor.role==='developer'?forge.worker:undefined,proposals:forge.list(actor)});
      if(req.method==='POST'&&path==='/proposals')return send(201,forge.create(actor,body));
      const match=path.match(/^\/proposals\/([a-f0-9-]+)$/);
      if(match&&req.method==='POST')return send(200,forge.transition(actor,match[1],body));
      if(match&&req.method==='GET')return send(200,forge.view(actor,forge.get(actor,match[1])));
      if(path==='/worker-scenario'&&req.method==='POST')return send(200,forge.workerScenario(actor,body));
      throw new ForgeError(404,'Not found');
    }catch(e){send(e instanceof ForgeError?e.status:500,{error:e instanceof ForgeError?e.message:'Prototype error; no work executed'});}
  });
  return {server,keys:Object.fromEntries([...keys].map(([key,{name}])=>[name,key])),forge};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
  const p=prototype({enabled:process.env.SKILL_FORGE_SIMULATION==='1'});
  p.server.listen(Number(process.env.SKILL_FORGE_PORT||8392),'127.0.0.1',()=>{
    console.log('Local simulation only; no production authorization or capability registration.');
    if(process.env.SKILL_FORGE_SIMULATION==='1')console.log(JSON.stringify({url:`http://127.0.0.1:${p.server.address().port}`,fixtureKeys:p.keys}));
  });
}
