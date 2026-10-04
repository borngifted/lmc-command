import {prototype} from './server.mjs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const evidence=new URL('evidence/',import.meta.url);await mkdir(evidence,{recursive:true});
const listen=s=>new Promise(r=>s.listen(0,'127.0.0.1',()=>r(`http://127.0.0.1:${s.address().port}`)));
const p=prototype({enabled:true}),off=prototype();const origin=await listen(p.server),disabled=await listen(off.server);const checks=[];
function check(name,value){assert.ok(value,name);checks.push(name);}
let browser;
try{
 check('default off returns 404',(await fetch(disabled)).status===404);
 check('anonymous state denied',(await fetch(origin+'/state')).status===401);
 check('forged role header denied',(await fetch(origin+'/state',{headers:{'X-Role':'developer'}})).status===401);
 check('cross-origin sign-in denied',(await fetch(origin+'/session',{method:'POST',headers:{Origin:'https://example.com','Content-Type':'application/json'},body:JSON.stringify({key:p.keys.builder})})).status===403);
 browser=await chromium.launch({headless:true,channel:process.env.OPS_BROWSER_CHANNEL||undefined});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];const urls=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>urls.push(r.url()));
 async function signIn(key){await page.locator('#key').fill(key);await page.getByRole('button',{name:'Connect fixture'}).click();await page.waitForFunction(()=>document.getElementById('identity').textContent.startsWith('SIMULATED'));}
 await page.goto(origin);await signIn(p.keys.builder);
 await page.locator('#title').fill('Summarize sample notes');await page.getByRole('button',{name:'Propose skill',exact:true}).click();await page.getByRole('button',{name:'Freeze specification'}).click();await page.getByRole('button',{name:'Simulate build',exact:true}).click();await page.getByRole('button',{name:'Start simulated tests'}).click();await page.getByRole('button',{name:'Simulate passing tests'}).click();await page.getByRole('button',{name:'Approve simulated staging'}).click();await page.waitForFunction(()=>document.getElementById('message').textContent.includes('Independent review'));
 check('UI blocks self approval',true);await page.getByRole('button',{name:'Sign out'}).click();await page.waitForFunction(()=>document.getElementById('message').textContent==='Signed out.');await signIn(p.keys.reviewer);
 await page.getByRole('button',{name:'Approve simulated staging'}).click();await page.getByRole('button',{name:'Verify simulated staging'}).click();await page.getByRole('button',{name:'Approve simulated promotion'}).click();await page.getByRole('button',{name:'Register in simulation only'}).click();await page.getByRole('button',{name:'Revoke simulation'}).waitFor();
 check('desktop no horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:new URL('developer.png',evidence).pathname.replace(/^\/([A-Za-z]:)/,'$1'),fullPage:true});
 await page.getByRole('button',{name:'Revoke simulation'}).click();await page.getByRole('button',{name:'Roll back simulation'}).click();await page.waitForFunction(()=>document.querySelector('.card').textContent.includes('rolled_back'));check('UI rollback completed',true);
 await page.getByRole('button',{name:'Sign out'}).click();await page.waitForFunction(()=>document.getElementById('message').textContent==='Signed out.');await page.setViewportSize({width:390,height:844});await signIn(p.keys.client);
 check('client proposal and review controls hidden',await page.locator('#developer').isHidden()&&await page.locator('.controls').count()===0);check('client evidence hidden',!await page.locator('#proposals').textContent().then(t=>t.includes('specHash')));check('mobile no overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:new URL('client-mobile.png',evidence).pathname.replace(/^\/([A-Za-z]:)/,'$1'),fullPage:true});check('no external network calls',urls.every(u=>u.startsWith(origin+'/')));check('no browser errors',errors.length===0);
 await writeFile(new URL('results.json',evidence),JSON.stringify({source:'simulated',checkedAt:new Date().toISOString(),passed:checks.length,checks},null,2));console.log(JSON.stringify({passed:checks.length,checks},null,2));
}finally{await browser?.close();p.server.closeAllConnections();p.server.close();off.server.closeAllConnections();off.server.close();}
