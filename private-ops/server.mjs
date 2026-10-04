import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import {fileURLToPath} from 'node:url';

const staff = new Set(['ADMIN','PROJECT_MANAGER','INTERNAL_CREATIVE']);
export function createGateway({enabled=false, upstream, origin, simulated=false}={}) {
  const sessions = new Map();
  let loginAttempts=[];
  const base = upstream && new URL(upstream);
  if(enabled && (!base || !origin || !['http:','https:'].includes(base.protocol) || base.username || base.password)) throw Error('Explicit upstream and origin required');
  const api = async (path, token) => {
    const r = await fetch(new URL(path, base), {headers:{Authorization:`Bearer ${token}`}, redirect:'error', signal:AbortSignal.timeout(5000)});
    if(!r.ok) throw Object.assign(Error('Upstream unavailable'),{status:[401,403].includes(r.status)?r.status:502});
    return r.json();
  };
  return http.createServer(async(req,res)=>{
    const send=(code,value,type='application/json')=>{res.writeHead(code,{'Content-Type':type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"});res.end(type==='application/json'?JSON.stringify(value):value);};
    try {
      if(!enabled) return send(404,{error:'Experimental interface disabled'});
      if(req.headers.host!==new URL(origin).host) return send(403,{error:'Host rejected'});
      if(req.headers.origin && req.headers.origin!==origin) return send(403,{error:'Origin rejected'});
      const path=new URL(req.url,origin).pathname;
      if(req.method==='POST' && path==='/session') {
        if(req.headers.origin!==origin || req.headers['content-type']!=='application/json') return send(403,{error:'Same-origin JSON required'});
        loginAttempts=loginAttempts.filter(t=>t>Date.now()-60000);
        if(loginAttempts.length>=10) return send(429,{error:'Too many sign-in attempts; retry in one minute'});
        loginAttempts.push(Date.now());
        let body=''; for await(const part of req){body+=part;if(body.length>8192) return send(413,{error:'Request too large'});}
        const input=JSON.parse(body);
        let token=input.token;
        if(typeof input.email==='string' && typeof input.password==='string') {
          if(input.email.length>320 || input.password.length>1024 || !input.email.trim() || !input.password) return send(400,{error:'Credentials required'});
          const login=await fetch(new URL('/auth/login',base),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:input.email,password:input.password}),redirect:'error',signal:AbortSignal.timeout(5000)});
          if(!login.ok) return send(login.status===401?401:502,{error:'Sign in unavailable'});
          token=(await login.json()).access_token;
        }
        if(typeof token!=='string' || token.length>4096 || !token.trim()) return send(400,{error:'Token required'});
        await api('/auth/me',token);
        const now=Date.now(); for(const [key,s] of sessions) if(s.expires<=now) sessions.delete(key);
        if(sessions.size>=100) return send(503,{error:'Session capacity reached'});
        const previous=(req.headers.cookie||'').match(/(?:^|;\s*)ops_session=([a-f0-9]{64})(?:;|$)/)?.[1];
        sessions.delete(previous);
        const id=randomBytes(32).toString('hex');sessions.set(id,{token,expires:now+15*60*1000});
        setTimeout(()=>sessions.delete(id),15*60*1000).unref();
        res.setHeader('Set-Cookie',`ops_session=${id}; HttpOnly; SameSite=Strict; Path=/; Max-Age=900${origin.startsWith('https:')?'; Secure':''}`);
        return send(200,{ok:true});
      }
      const id=(req.headers.cookie||'').match(/(?:^|;\s*)ops_session=([a-f0-9]{64})(?:;|$)/)?.[1];
      const session=sessions.get(id);
      if(req.method==='POST' && path==='/logout') {
        if(req.headers.origin!==origin) return send(403,{error:'Origin required'});
        sessions.delete(id);res.setHeader('Set-Cookie','ops_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');return send(200,{ok:true});
      }
      if(req.method!=='GET') return send(405,{error:'Read-only interface; execution disabled'});
      if(path==='/telemetry') {
        if(!session || session.expires<=Date.now()) {sessions.delete(id);return send(401,{error:'Sign in required'});}
        const user=await api('/auth/me',session.token); // role revalidated on EVERY read
        const developer=staff.has(user.role);
        const projects=await api('/projects',session.token);
        const jobs=await api('/jobs',session.token);
        const visible=new Set(projects.map(p=>p.id));
        const result={source:simulated?'simulated':'live',observedAt:new Date().toISOString(),view:developer?'developer':'client',executionEnabled:false,reasoningPolicy:'Spark only; no cloud fallback',projects:projects.map(p=>({id:p.id,name:p.name,status:p.status})),jobs:jobs.filter(j=>visible.has(j.project_id)).map(j=>({projectId:j.project_id,state:j.state})),jobLimit:200};
        if(developer) result.workers=(await api('/workers',session.token)).map(w=>({name:w.display_name,status:w.status,lastSeen:w.last_seen,capabilities:w.capabilities}));
        return send(200,result);
      }
      if(path==='/ops.js') return send(200,await readFile(new URL('../ops.js',import.meta.url),'utf8'),'text/javascript');
      if(path==='/'||path==='/ops.html') {
        let html=await readFile(new URL('../ops.html',import.meta.url),'utf8');
        html=html.replace('data-private="false"',`data-private="true" data-simulated="${simulated}"`);
        return send(200,html,'text/html');
      }
      return send(404,{error:'Not found'});
    }catch(e){return send(e.status||502,{error:'Telemetry unavailable; no fallback used'});}
  });
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const port=Number(process.env.OPS_PORT||8391);
  createGateway({enabled:process.env.OPS_ENABLED==='1',upstream:process.env.OPS_PLATFORM_ORIGIN,origin:process.env.OPS_ORIGIN}).listen(port,'127.0.0.1');
}
