// Read-only recovery of an existing transaction; never loads keys or broadcasts.
import { JsonRpcProvider, FetchRequest, Interface } from 'ethers';
import { iPclAbi } from '@maroo-chain/contracts/abi/precompiles/pcl/IPcl';
import { writeFileSync } from 'node:fs';
const hash=process.argv[2];
if(!/^0x[0-9a-fA-F]{64}$/.test(hash??'')) throw new Error('Provide the existing transaction hash');
const request=new FetchRequest('https://rpc-testnet.maroo.io');request.timeout=20000;
const p=new JsonRpcProvider(request,undefined,{batchMaxCount:1});
try {
 if(BigInt(await p.send('eth_chainId',[]))!==450815n) throw new Error('Wrong chain');
 const tx=await p.getTransaction(hash), receipt=await p.getTransactionReceipt(hash);
 if(!tx||!receipt) throw new Error('Transaction or receipt missing');
 if(receipt.status!==1) throw new Error('Transaction did not succeed');
 const block=await p.getBlock(receipt.blockNumber);
 const [before,after]=await Promise.all([p.getBalance(tx.to,receipt.blockNumber-1),p.getBalance(tx.to,receipt.blockNumber)]);
 const iface=new Interface(iPclAbi), events=[];
 for(const log of receipt.logs) {try{const d=iface.parseLog(log);if(d)events.push({address:log.address,event:d.name,args:d.args.toObject(true)});}catch{}}
 const out={label:'Live Testnet',operation:'Read-only re-verification of prior user transaction',verifiedAt:new Date().toISOString(),hash,explorer:`https://explorer-testnet.maroo.io/tx/${hash}`,chainId:450815,from:tx.from,to:tx.to,valueAokrw:tx.value,blockNumber:receipt.blockNumber,blockTimestamp:block.timestamp,status:receipt.status,gasUsed:receipt.gasUsed,fee:receipt.fee,recipientBeforeBlock:before,recipientAfterBlock:after,recipientDelta:after-before,pclEvents:events,stateChange:true,newBroadcast:false,limitation:'Balance snapshots may contain unrelated transactions; PCL pass events do not establish rejection behavior or Privacy compatibility.'};
 writeFileSync('evidence/live-testnet/OKRW_TRANSFER_VERIFIED.json',JSON.stringify(out,(_,v)=>typeof v==='bigint'?v.toString():v,2)+'\n');
 console.log(JSON.stringify(out,(_,v)=>typeof v==='bigint'?v.toString():v,2));
} finally {p.destroy();}
