// Read-only testnet simulation. No signing, broadcasting, or policy changes.
import { JsonRpcProvider,FetchRequest,parseEther,toQuantity,Interface } from 'ethers';
import { iPclAbi } from '@maroo-chain/contracts/abi/precompiles/pcl/IPcl';
import { writeFileSync } from 'node:fs';
const request=new FetchRequest('https://rpc-testnet.maroo.io');request.timeout=20000;
const p=new JsonRpcProvider(request,undefined,{batchMaxCount:1});
const from='0xC4A50f04B3eB7B95f87639d6133Db89E3cdC407C',to='0xA7B22eA2a4203E10F955b0FE5C52fBA5A96A4edA';
const iface=new Interface(iPclAbi);
function decodeError(data,depth=0){
 if(depth>8||typeof data!=='string') return null;
 try {const d=iface.parseError(data);if(!d)return null;return d.name==='AnyOfRejected'?{name:d.name,children:Array.from(d.args.childReverts,x=>decodeError(x,depth+1))}:{name:d.name,args:d.args.toObject(true)};}catch{return null;}
}
const out={label:'Simulation',network:'Maroo testnet',timestamp:new Date().toISOString(),stateChange:false,broadcast:false,method:'eth_estimateGas',balanceOverride:'100000000 tOKRW; simulated only',results:[]};
try {
 if(BigInt(await p.send('eth_chainId',[]))!==450815n) throw new Error('Wrong chain');
 out.block=await p.getBlockNumber();
 for(const amount of ['1','2000000','2000001']) {
  const tx={from,to,value:toQuantity(parseEther(amount))};
  try {const gas=await p.send('eth_estimateGas',[tx,toQuantity(out.block),{[from]:{balance:toQuantity(parseEther('100000000'))}}]);out.results.push({amount,estimatedGas:gas});}
  catch(e){let data=e.data??e.error?.data??e.info?.error?.data;const decoded=decodeError(typeof data==='string'?data:data?.data);out.results.push({amount,error:e.shortMessage??e.message,rpcError:e.info?.error,data,decoded});}
 }
 out.expectedBoundaryObserved=!!out.results[0]?.estimatedGas && !!out.results[1]?.estimatedGas && out.results[2]?.decoded?.name==='AnyOfRejected';
 out.limitation='RPC simulation with overridden sender balance; not a broadcast or on-chain rejected receipt. Only transaction value changes across cases at the same block.';
 if(!out.expectedBoundaryObserved) process.exitCode=1;
}finally{p.destroy();writeFileSync('evidence/local/PCL_ESTIMATION_PROBE.json',JSON.stringify(out,(_,v)=>typeof v==='bigint'?v.toString():v,2)+'\n');console.log(JSON.stringify(out,(_,v)=>typeof v==='bigint'?v.toString():v,2));}
