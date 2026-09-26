// Synthetic encoding checks only. No provider, wallet, proof generation or broadcast.
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { Interface } from 'ethers';
import { iPrivacyAbi } from '@maroo-chain/contracts/abi/precompiles/privacy/IPrivacy';
const abi = new Interface(iPrivacyAbi);
const tests = [];
function check(name, run) { try { run(); tests.push({name,status:'PASS'}); } catch(e) { tests.push({name,status:'FAIL',message:e.message}); } }
check('Pinned package ABI loads', () => assert(abi.getFunction('deposit')));
check('Deposit outer ABI roundtrip with synthetic bytes', () => {
  const request = ['0x1234','0xabcd','0x'];
  const decoded = abi.decodeFunctionData('deposit',abi.encodeFunctionData('deposit',[request]));
  assert.deepEqual(Array.from(decoded[0]),request);
});
const empty = p => p.baseType==='tuple' ? p.components.map(empty) : p.baseType==='array' ? [] : p.type==='bool' ? false : p.type==='address' ? '0x0000000000000000000000000000000000000001' : p.type.startsWith('uint') || p.type.startsWith('int') ? 0n : p.type==='string' ? '' : p.type==='bytes' ? '0x' : '0x'+'00'.repeat(Number(p.type.slice(5)));
check('Transfer outer ABI roundtrip with synthetic fields', () => {
  const fragment=abi.getFunction('transfer'); const values=fragment.inputs.map(empty);
  const encoded=abi.encodeFunctionData(fragment,values);
  assert.equal(abi.encodeFunctionData(fragment,abi.decodeFunctionData(fragment,encoded)),encoded);
});
check('Transfer uint64 expiry overflow rejected by client encoder', () => {
  const fragment=abi.getFunction('transfer'); const values=fragment.inputs.map(empty);
  const idx=fragment.inputs[0].components.findIndex(x=>x.name==='expiresAtUnix');
  assert(idx>=0); values[0][idx]=1n<<64n;
  assert.throws(()=>abi.encodeFunctionData(fragment,values));
});
check('Official InvalidAmount error selector decodes', () => {
  const data=abi.encodeErrorResult('InvalidAmount',['18446744073709551616']);
  const decoded=abi.parseError(data); assert.equal(decoded.name,'InvalidAmount');
  assert.equal(decoded.args[0],'18446744073709551616');
});
check('Unknown error selector is not mislabelled',()=>assert.equal(abi.parseError('0xdeadbeef'),null));
let documentedImport;
try { await import('@maroo-chain/contracts/abi/IPrivacy'); documentedImport={status:'PASS'}; }
catch(e) {documentedImport={status:'FAIL',code:e.code,scope:'Documented path unavailable in pinned package 0.0.9; verified alternative used above.'};}
const result={label:'Local',timestamp:new Date().toISOString(),node:process.version,package:'@maroo-chain/contracts@0.0.9',tests,documentedImport,limitations:['Synthetic bytes are not valid Privacy requests or proofs.','ABI checks do not establish inner proof serialization or live verifier compatibility.','No transaction simulation, signing or broadcast.']};
mkdirSync('evidence/local',{recursive:true}); writeFileSync('evidence/local/PRIVACY_ABI.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2)); if(tests.some(t=>t.status==='FAIL'))process.exitCode=1;
