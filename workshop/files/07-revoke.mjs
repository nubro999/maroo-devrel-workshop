import {wallet,recipient,provider,pcl,coder,Contract,ContractFactory,Interface,parseEther,ZeroAddress,ZeroHash,id,compile,send,decode,easTools} from '../terminal/context.mjs';
import {run, payment, policyFor} from './session.mjs';

// 승인 취소와 지급 차단
await run(6, async state => {
const {proxy,abi,schemaUID,uid}=state;
const api=new Interface(abi);
const app=new Contract(proxy,abi,wallet);
const {eas,indexer}=await easTools();
await send('revoke',await eas.revoke.populateTransaction({schema:schemaUID,data:{uid,value:0n}}));
console.log('revocationTime:',String((await eas.getAttestation(uid)).revocationTime));
try { await app.pay.staticCall(recipient,{value:parseEther('0.001')}); } catch(e) { console.log(decode(e)); }
await payment(app,'revoked-payment',0);
await send('restore-denylist',await pcl.changeContractPolicies.populateTransaction(policyFor(proxy,api,[])));

return {};
});
