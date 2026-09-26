// Decode already captured public state. No RPC, signing, or policy changes.
import { readFileSync, writeFileSync } from 'node:fs';
import { AbiCoder, Interface, formatEther } from 'ethers';
import { iPclAbi } from '@maroo-chain/contracts/abi/precompiles/pcl/IPcl';
const source = 'evidence/live-testnet/PRIVACY_PUBLIC_PROBE.json';
const probe = JSON.parse(readFileSync(source, 'utf8'));
const inputs = new Interface(iPclAbi).getFunction('_policies').inputs;
const names = ['EAS_POLICY','DENYLIST_POLICY','VOLUME_POLICY','PERIODIC_VOLUME_POLICY','AGENT_OKRW_TRANSFER_LIMIT_POLICY','LOGICAL_POLICY','FOR_EACH_POLICY'];
const types = Object.fromEntries(names.map((n,i)=>[n,inputs[i]]));
function decode(p, depth=0) {
 if(depth>20) throw new Error('Policy nesting exceeds decoder bound');
 const base = {templateId:p.templateId,selector:p.selector};
 if(!types[p.templateId]) return {...base,decoded:false,reason:'Unknown template'};
 const coder=AbiCoder.defaultAbiCoder();
 const v = coder.decode([types[p.templateId]],p.policy)[0];
 if(coder.encode([types[p.templateId]],[v]).toLowerCase()!==p.policy.toLowerCase()) throw new Error('Noncanonical policy encoding');
 if(p.templateId==='LOGICAL_POLICY') return {...base,quantifier:['UNSPECIFIED','AND','OR'][Number(v.quantifier)],children:Array.from(v.children,c=>decode(c,depth+1))};
 if(p.templateId==='FOR_EACH_POLICY') return {...base,quantifier:['UNSPECIFIED','ANY','EVERY'][Number(v.quantifier)],subject:['UNSPECIFIED','AGENT_OWNERS'][Number(v.subject)],child:decode(v.child,depth+1)};
 const fields = p.templateId==='VOLUME_POLICY' ? {tokens:Array.from(v.tokens),limits:Array.from(v.limits,x=>({minLimit:x.minLimit,maxLimit:x.maxLimit}))}
  : p.templateId==='PERIODIC_VOLUME_POLICY' ? {tokens:Array.from(v.tokens),limits:Array.from(v.limits,x=>({maxAmount:x.maxAmount,resetPeriodSeconds:x.resetPeriodSeconds}))}
  : p.templateId==='DENYLIST_POLICY' ? {addresses:Array.from(v.addresses)}
  : v.toObject(true);
 if(p.templateId==='VOLUME_POLICY') fields.display_tOKRW=Array.from(v.tokens,(token,i)=>token==='atokrw'?{min:formatEther(v.limits[i].minLimit),max:formatEther(v.limits[i].maxLimit)}:null);
 return {...base,fields};
}
const scopes=probe.tests.filter(t=>t.status==='PASS'&&t.result?.policies).map(t=>({scope:t.name,policies:t.result.policies.map(p=>decode(p))}));
const out={label:'Local',operation:'Decode previously captured Live Testnet policy bytes using published ABI',source,sourceTimestamp:probe.timestamp,block:probe.block,package:probe.package,enforcementVerified:false,scopes};
writeFileSync('evidence/local/PCL_DECODED.json',JSON.stringify(out,(_,v)=>typeof v==='bigint'?v.toString():v,2)+'\n');
console.log(JSON.stringify(out,(_,v)=>typeof v==='bigint'?v.toString():v,2));
