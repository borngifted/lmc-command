import http from "node:http";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const HOST = process.env.LMC_JEV_HOST || "127.0.0.1";
const PORT = Number(process.env.LMC_JEV_PORT || 4317);
const WORKSPACE = process.env.LMC_WORKSPACE ? resolve(process.env.LMC_WORKSPACE) : process.cwd();
const TIMEOUT = Number(process.env.LMC_EXEC_TIMEOUT_MS || 600000);
const JEV = process.env.JEV_BIN || "jev";
const CLAUDE = process.env.JEV_CLAUDE_BIN || "jev-claude";
const CODEX = process.env.JEV_CODEX_BIN || "jev-codex";
const ORIGINS = new Set([
  process.env.LMC_ALLOWED_ORIGIN || "https://borngifted.github.io",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
]);

if (!existsSync(WORKSPACE)) {
  console.error("LMC_WORKSPACE does not exist:", WORKSPACE);
  process.exit(1);
}

function cors(req,res){
  const origin=req.headers.origin;
  if (origin && ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary","Origin");
  }
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS");
}
function send(res,status,data){
  res.writeHead(status,{"Content-Type":"application/json; charset=utf-8"});
  res.end(JSON.stringify(data));
}
function readJson(req){
  return new Promise((resolveBody,reject)=>{
    let raw="";
    req.on("data",c=>{
      raw+=c;
      if(raw.length>1024*1024){ reject(new Error("Request too large")); req.destroy(); }
    });
    req.on("end",()=>{
      try{ resolveBody(raw?JSON.parse(raw):{}); }catch(e){ reject(new Error("Invalid JSON")); }
    });
    req.on("error",reject);
  });
}
function run(bin,args,{cwd=WORKSPACE,timeout=TIMEOUT}={}){
  return new Promise((resolveRun,reject)=>{
    const child=spawn(bin,args,{cwd,env:process.env,stdio:["ignore","pipe","pipe"],shell:false});
    let stdout="",stderr="";
    const timer=setTimeout(()=>{ child.kill("SIGTERM"); },timeout);
    child.stdout.on("data",d=>stdout+=d.toString());
    child.stderr.on("data",d=>stderr+=d.toString());
    child.on("error",reject);
    child.on("close",code=>{
      clearTimeout(timer);
      resolveRun({code,stdout:stdout.trim(),stderr:stderr.trim()});
    });
  });
}
async function chooseAgent(prompt){
  const r=await run(JEV,[
    "pick",
    "Which LMC execution agent should handle this request?",
    "claude=Repository work, coding, terminal operations, debugging, implementation, refactoring, tests, or work that must inspect local project files",
    "openai=Planning, research, analysis, writing, creative direction, requirements, synthesis, or review that does not require local repository edits",
    "--other",
    "-s",prompt
  ],{timeout:30000});
  if(r.code!==0 && !r.stdout) throw new Error(r.stderr||"JEV routing failed");
  const first=(r.stdout.split(/\s+/)[0]||"").toLowerCase();
  return first==="claude"?"claude":first==="openai"?"openai":"claude";
}
async function execute(agent,prompt){
  if(agent==="claude") return run(CLAUDE,["-p",prompt]);
  if(agent==="openai") return run(CODEX,["exec",prompt]);
  throw new Error("Unsupported agent");
}
const server=http.createServer(async(req,res)=>{
  cors(req,res);
  if(req.method==="OPTIONS"){ res.writeHead(204); return res.end(); }
  try{
    if(req.method==="GET" && req.url==="/health"){
      return send(res,200,{ok:true,service:"lmc-jev-bridge",workspace:WORKSPACE});
    }
    if(req.method==="POST" && req.url==="/route"){
      const body=await readJson(req);
      const prompt=String(body.prompt||"").trim();
      if(!prompt) return send(res,400,{ok:false,error:"prompt is required"});
      const requested=["auto","claude","openai"].includes(body.agent)?body.agent:"auto";
      const agent=requested==="auto"?await chooseAgent(prompt):requested;
      return send(res,200,{ok:true,agent});
    }
    if(req.method==="POST" && req.url==="/execute"){
      const body=await readJson(req);
      const prompt=String(body.prompt||"").trim();
      if(!prompt) return send(res,400,{ok:false,error:"prompt is required"});
      const requested=["auto","claude","openai"].includes(body.agent)?body.agent:"auto";
      const agent=requested==="auto"?await chooseAgent(prompt):requested;
      const result=await execute(agent,prompt);
      return send(res,result.code===0?200:500,{
        ok:result.code===0,
        agent,
        exitCode:result.code,
        output:result.stdout,
        error:result.stderr
      });
    }
    send(res,404,{ok:false,error:"not found"});
  }catch(error){
    send(res,500,{ok:false,error:error?.message||String(error)});
  }
});
server.listen(PORT,HOST,()=>{
  console.log(`LMC JEV Bridge listening on http://${HOST}:${PORT}`);
  console.log(`Workspace: ${WORKSPACE}`);
});
