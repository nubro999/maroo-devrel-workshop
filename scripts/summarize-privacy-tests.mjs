// Publish test identities/status only. Raw output stays ignored: it may contain fixture secrets.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
const input=process.argv[2]??'.private/privacy-validation/go-privacy-all.jsonl';
if(!existsSync(input)) throw Error('Run the upstream tests before summarizing.');
const raw=readFileSync(input,'utf8');
const events=raw.split(/\r?\n/).filter(Boolean).flatMap(line=>{try{return [JSON.parse(line)];}catch{return [];}});
const completed=events.filter(e=>['pass','fail','skip'].includes(e.Action));
const packages=completed.filter(e=>!e.Test).map(e=>({package:e.Package,status:e.Action.toUpperCase(),elapsedSeconds:e.Elapsed}));
const tests=completed.filter(e=>e.Test).map(e=>({package:e.Package,name:e.Test,status:e.Action.toUpperCase()}));
const started=new Set(events.filter(e=>e.Action==='start').map(e=>e.Package));
const ended=new Set(packages.map(e=>e.package));
const counts=items=>items.reduce((a,t)=>(a[t.status]=(a[t.status]??0)+1,a),{});
const result={label:'Local',timestamp:new Date().toISOString(),upstreamCommit:'af04cfc994a3da87a8b1b902eda0988feb512539',host:process.platform,command:'go test -json -count=1 -p 2 -timeout 3m ./x/privacy/... ./cmd/clairveil-setup ./app ./cmd/clairveild/cmd',rawSHA256:createHash('sha256').update(raw).digest('hex'),packageCounts:counts(packages),testEventCounts:counts(tests),incompletePackages:[...started].filter(p=>!ended.has(p)),packages,tests,limitations:['Test and subtest counts overlap; these are completion-event counts, not independent scenario counts.','Passing unit/fixture tests do not demonstrate a running-chain lifecycle or Maroo compatibility.','Raw stdout/stderr remains ignored because it may contain secret test vectors.','Build failures may prevent tests from starting. Inspect the validation report for the first failure layer.']};
if(!packages.length) throw Error('No completed packages; refusing to publish an empty success.');
mkdirSync('evidence/local',{recursive:true});writeFileSync('evidence/local/CLAIRVEIL_TESTS.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({packageCounts:result.packageCounts,testEventCounts:result.testEventCounts,incompletePackages:result.incompletePackages},null,2));
