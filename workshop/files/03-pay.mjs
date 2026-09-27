import {wallet,recipient,provider,pcl,coder,Contract,ContractFactory,Interface,parseEther,ZeroAddress,ZeroHash,id,compile,send,decode,easTools} from '../terminal/context.mjs';
import {run, payment, policyFor} from './session.mjs';

// 정상 지급
await run(2, async state => {
const {proxy,abi,schemaUID,uid}=state;
const api=new Interface(abi);
const app=new Contract(proxy,abi,wallet);
await payment(app,'allowed-payment',1);
return {};
});
