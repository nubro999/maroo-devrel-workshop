import {wallet,recipient,provider,pcl,coder,Contract,ContractFactory,Interface,parseEther,ZeroAddress,ZeroHash,id,compile,send,decode,easTools} from '../terminal/context.mjs';
import {run, payment, policyFor} from './session.mjs';

// 승인 증명 발급과 지급
await run(5, async state => {
const {proxy,abi,schemaUID}=state;
const api=new Interface(abi);
const app=new Contract(proxy,abi,wallet);
const {eas,indexer}=await easTools();
var expiry = BigInt((await provider.getBlock('latest')).timestamp + 3600);
var issued = await send('attest',await eas.attest.populateTransaction({schema:schemaUID,data:{
  recipient:wallet.address,expirationTime:expiry,revocable:true,refUID:ZeroHash,
  data:coder.encode(['bool','bytes32'],[true,id('workshop')]),value:0n
}}));
var attested = issued.logs.map(l=>{try{return eas.interface.parseLog(l)}catch{return null}}).find(e=>e?.name==='Attested');
var uid = attested.args.uid;
console.log(await eas.getAttestation(uid));
if (!(await indexer.isAttestationIndexed(uid))) await send('index',await indexer.indexAttestation.populateTransaction(uid));
await payment(app,'credentialed-payment',1);
return {uid};
});
