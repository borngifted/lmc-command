import {createGateway} from './server.mjs';
import http from 'node:http';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const evidence=new URL('../docs/neural-ops-evidence/',import.meta.url);await mkdir(evidence,{recursive:true});
const calls=[];let revoked=false,failed=false;
const upstream=http.createServer(async(req,res)=>{if(req.url==='/auth/login'){let body='';for await(const chunk of req)body+=chunk;const input=JSON.parse(body);if(input.password!=='fixture-only'){res.writeHead(401);return res.end('{}');}res.setHeader('Content-Type','application/json');return res.end(JSON.stringify({access_token:input.email.split('@')[0]}));}calls.push([req.method,req.url,req.headers.authorization]);res.setHeader('Content-Type','application/json');const staff=req.headers.authorization==='Bearer developer';if(failed){res.writeHead(503);return res.end('{}');}if(revoked || !['Bearer developer','Bearer client'].includes(req.headers.authorization)){res.writeHead(401);return res.end('{}');}res.end(JSON.stringify(req.url==='/auth/me'?{role:staff?'ADMIN':'CLIENT'}:req.url==='/projects'?[{id:'a',name:'Example project A',status:'ACTIVE',storage_root:'SECRET',address:'SECRET'},...(staff?[{id:'b',name:'Example project B',status:'ACTIVE'}]:[])]:req.url==='/jobs'?[{project_id:'a',state:'DONE',result:'SECRET'},{project_id:'b',state:'QUEUED',error_text:'SECRET'}]:req.url==='/workers'?[{display_name:'Example worker',status:'ONLINE',capabilities:{blender:true},last_seen:'2026-10-01T10:00:00Z'}]:{}));});
const listen=server=>new Promise(resolve=>server.listen(0,'127.0.0.1',()=>resolve(`http://127.0.0.1:${server.address().port}`)));
const base=await listen(upstream);
// Reserve a test port, then bind the isolated gateway with its exact origin.
const reservation=http.createServer();const origin=await listen(reservation);await new Promise(r=>reservation.close(r));
const gateway=createGateway({enabled:true,upstream:base,origin,simulated:true});await new Promise(r=>gateway.listen(Number(new URL(origin).port),'127.0.0.1',r));
const disabled=createGateway();const off=await listen(disabled);
const checks=[];const check=(name,condition)=>{assert.ok(condition,name);checks.push(name);};
let browser;
try{
  check('feature flag defaults off',(await fetch(off)).status===404);
  check('anonymous denied',(await fetch(origin+'/telemetry')).status===401);
  check('cross origin session rejected',(await fetch(origin+'/session',{method:'POST',headers:{Origin:'https://example.com','Content-Type':'application/json'},body:'{}'})).status===403);
  async function login(token){const r=await fetch(origin+'/session',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({token})});assert.equal(r.status,200);check(token+' cookie HttpOnly',r.headers.get('set-cookie').includes('HttpOnly'));return r.headers.get('set-cookie').split(';')[0];}
  check('invalid password rejected',(await fetch(origin+'/session',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({email:'client@example.test',password:'wrong'})})).status===401);
  const client=await login('client');let start=calls.length;
  let r=await fetch(origin+'/telemetry',{headers:{Cookie:client}});let data=await r.json();
  check('client membership projection',data.projects.length===1&&data.jobs.length===1&&!data.workers);
  check('sensitive fields stripped',!JSON.stringify(data).includes('SECRET'));
  check('client never queries workers',!calls.slice(start).some(c=>c[1]==='/workers'));
  const developer=await login('developer');data=await(await fetch(origin+'/telemetry',{headers:{Cookie:developer}})).json();check('developer capabilities visible',data.workers.length===1&&data.projects.length===2);
  check('execution rejected even for admin',(await fetch(origin+'/route',{method:'POST',headers:{Cookie:developer,Origin:origin}})).status===405);
  revoked=true;check('revocation takes effect next request',(await fetch(origin+'/telemetry',{headers:{Cookie:developer}})).status===401);revoked=false;
  failed=true;check('upstream failure closed',(await fetch(origin+'/telemetry',{headers:{Cookie:developer}})).status===502);failed=false;
  check('only read upstream calls',calls.every(c=>c[0]==='GET'));
  browser=await chromium.launch({headless:true,channel:process.env.OPS_BROWSER_CHANNEL||undefined});
  for(const [view,token,width,height] of [['developer','developer',1440,1000],['client','client',390,844]]){
    const context=await browser.newContext({viewport:{width,height}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(origin);await page.locator('#email').fill(token+'@example.test');await page.locator('#password').fill('fixture-only');await page.getByRole('button',{name:'Connect',exact:true}).click();await page.waitForFunction(()=>document.getElementById('status').textContent.includes('SIMULATED'));
    check(view+' no horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));check(view+' no browser errors',errors.length===0);
    await page.screenshot({path:new URL(view+'.png',evidence).pathname.replace(/^\/([A-Za-z]:)/,'$1'),fullPage:true});
    if(view==='client')check('client UI hides developer inventory',await page.locator('#workersPanel').isHidden());
    await page.getByRole('button',{name:'Sign out'}).click();await page.waitForFunction(()=>document.getElementById('status').textContent==='SIGNED OUT');check(view+' logout clears projects',await page.locator('#projects').textContent()==='');await context.close();
  }
  // Public artifact must not make ANY network request beyond its own HTML/script.
  const publicServer=http.createServer(async(req,res)=>{const {readFile}=await import('node:fs/promises');res.setHeader('Content-Type',req.url==='/ops.js'?'text/javascript':'text/html');res.end(await readFile(new URL(req.url==='/ops.js'?'../ops.js':'../ops.html',import.meta.url)));});const publicOrigin=await listen(publicServer);
  try{const page=await browser.newPage();const requests=[];page.on('request',r=>requests.push(r.url()));await page.goto(publicOrigin);await page.waitForTimeout(300);check('public artifact does not probe private APIs',requests.every(u=>[publicOrigin+'/',publicOrigin+'/ops.js'].includes(u)));await page.close();}finally{publicServer.close();}
  await writeFile(new URL('results.json',evidence),JSON.stringify({testedAt:new Date().toISOString(),source:'simulated fixture; no production connection',checks,passed:checks.length},null,2));console.log(JSON.stringify({passed:checks.length,checks},null,2));
}finally{await browser?.close();gateway.closeAllConnections();gateway.close();disabled.closeAllConnections();disabled.close();upstream.closeAllConnections();upstream.close();}
