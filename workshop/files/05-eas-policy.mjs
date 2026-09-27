import {wallet,recipient,provider,pcl,coder,Contract,ContractFactory,Interface,parseEther,ZeroAddress,ZeroHash,id,compile,send,decode,easTools} from '../terminal/context.mjs';
import {run, payment, policyFor} from './session.mjs';

// 승인 증명이 없는 지급 차단
await run(4, async state => {
const {proxy,abi}=state;
const api=new Interface(abi);
const app=new Contract(proxy,abi,wallet);
var {addresses,registry,eas,indexer} = await easTools();
var {solidityPackedKeccak256} = await import('ethers');
var schemaText = 'bool workshopDemoEligible, bytes32 run'+Date.now();
var schemaUID = solidityPackedKeccak256(['string','address','bool'],[schemaText,ZeroAddress,true]);
await send('schema',await registry.register.populateTransaction(schemaText,ZeroAddress,true));
var easPolicy = {_contract:proxy,admin:wallet.address,policies:[{
  templateId:'EAS_POLICY',selector:api.getFunction('pay').selector,
  policy:coder.encode(['tuple(address easContract,address indexContract,bytes32 schemaUid)'],[{easContract:addresses.eas,indexContract:addresses.indexer,schemaUid:schemaUID}])
}]};
await send('bind-eas',await pcl.changeContractPolicies.populateTransaction(easPolicy));
await payment(app,'missing-credential',0);
return {schemaUID};
});
