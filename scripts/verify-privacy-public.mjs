// Read-only probe. Does not load .env, private keys, sign, or send transactions.
import { mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Contract, FetchRequest, JsonRpcProvider, Interface } from 'ethers';
import { iPrivacyAbi } from '@maroo-chain/contracts/abi/precompiles/privacy/IPrivacy';
import { iPclAbi } from '@maroo-chain/contracts/abi/precompiles/pcl/IPcl';
const rpc = 'https://rpc-testnet.maroo.io';
const privacy = '0x100000000000000000000000000000000000000b';
const request = new FetchRequest(rpc); request.timeout = 20000;
const p = new JsonRpcProvider(request, undefined, { batchMaxCount: 1, cacheTimeout: -1 });
const results = { label: 'Live Testnet', timestamp: new Date().toISOString(), node: process.version, rpc, privacy, package: '@maroo-chain/contracts@0.0.9', stateChange: false, tests: [] };
async function check(name, fn) {
  try { results.tests.push({ name, status: 'PASS', result: await fn() }); }
  catch(e) { results.tests.push({ name, status: 'FAIL', code: e.code ?? 'UNKNOWN', message: e.shortMessage ?? e.message }); }
}
try {
  const chain = await p.send('eth_chainId', []);
  if (BigInt(chain) !== 450815n) throw new Error('Unexpected chain');
  results.chainId = Number(BigInt(chain));
  results.block = await p.getBlockNumber();
  const pcl = new Contract('0x1000000000000000000000000000000000000005', iPclAbi, p);
  const policies = items => Array.from(items, item => ({templateId:item.templateId,policy:item.policy,selector:item.selector}));
  await check('PCL.getParams', async () => (await pcl.getParams({blockTag:results.block})).toObject(true));
  await check('PCL.globalPolicies', async () => {const r=await pcl.globalPolicies({blockTag:results.block}); return {policies:policies(r.policies)};});
  await check('PCL.contractPolicies(Privacy)', async () => {const r=await pcl.contractPolicies(privacy,{blockTag:results.block}); return {contract:r._contract,admin:r.admin,policies:policies(r.policies)};});
  await check('Privacy account code (not a capability test)', () => p.getCode(privacy,results.block));
  const abi = new Interface(iPrivacyAbi);
  const events = abi.fragments.filter(f=>f.type==='event');
  results.documentedEvents = events.map(f=>f.format('full'));
  await check('Privacy event counts in last 1000 blocks', async () => {
    const logs=await p.getLogs({address:privacy,fromBlock:Math.max(0,results.block-999),toBlock:results.block});
    const counts={};
    for(const log of logs){ let name='unrecognized'; try{name=abi.parseLog(log)?.name??name;}catch{} counts[name]=(counts[name]??0)+1; }
    return {fromBlock:Math.max(0,results.block-999),toBlock:results.block,counts,note:'No logs in this range does not establish absence of use. No encrypted note contents exported.'};
  });
  results.abiInspection={label:'Docs Only',functions:iPrivacyAbi.filter(x=>x.type==='function').map(x=>({name:x.name,mutability:x.stateMutability})),errors:iPrivacyAbi.filter(x=>x.type==='error').map(x=>x.name),sha256:createHash('sha256').update(JSON.stringify(iPrivacyAbi)).digest('hex')};
} finally {
 p.destroy(); mkdirSync('evidence/live-testnet',{recursive:true});
 writeFileSync('evidence/live-testnet/PRIVACY_PUBLIC_PROBE.json',JSON.stringify(results,(_,v)=>typeof v==='bigint'?v.toString():v,2)+'\n');
 console.log(JSON.stringify({file:'evidence/live-testnet/PRIVACY_PUBLIC_PROBE.json',chainId:results.chainId,block:results.block,tests:results.tests.map(({name,status,code})=>({name,status,code})),stateChange:false},null,2));
 if(results.tests.some(t=>t.status==='FAIL')) process.exitCode=1;
}
