import { spawnSync } from "node:child_process";
const checks=[
  ["jev",["--version"]],
  ["jev-claude",["--help"]],
  ["jev-codex",["--help"]],
  ["claude",["--version"]],
  ["codex",["--version"]]
];
let failed=false;
for(const [bin,args] of checks){
  const r=spawnSync(bin,args,{encoding:"utf8"});
  const ok=!r.error && (r.status===0 || r.status===1);
  console.log(`${ok?"PASS":"FAIL"}  ${bin}`);
  if(!ok) failed=true;
}
console.log(`${process.env.JEV_API_KEY||process.env.TYPESAFE_API_KEY?"PASS":"WARN"}  JEV routing key in environment`);
console.log(`${process.env.LMC_WORKSPACE?"PASS":"WARN"}  LMC_WORKSPACE`);
process.exit(failed?1:0);
