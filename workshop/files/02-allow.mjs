import {wallet,recipient,provider,pcl,coder,Contract,ContractFactory,Interface,parseEther,ZeroAddress,ZeroHash,id,compile,send,decode,easTools} from '../terminal/context.mjs';
import {run, payment, policyFor} from './session.mjs';

// 지급 허용 정책
await run(1, async state => {
const {proxy,abi,schemaUID,uid}=state;
const api=new Interface(abi);
const app=new Contract(proxy,abi,wallet);
await send('allow',await pcl.changeContractPolicies.populateTransaction(policyFor(proxy,api,[])));
console.log(await pcl.contractPolicies(proxy));
return {};
});
