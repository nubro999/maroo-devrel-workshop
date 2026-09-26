import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {loadEnvFile} from 'node:process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import solc from 'solc';
import {Wallet,Contract,ContractFactory,Interface,AbiCoder,JsonRpcProvider,FetchRequest,parseEther,formatEther,getAddress} from 'ethers';
const root=fileURLToPath(new URL('../../',import.meta.url));
if (process.argv.length !== 3 || process.argv[2] !== '--broadcast') { console.log('No transaction sent. Use --broadcast to run this TESTNET demo; requires ignored .env, chain 450815. Fees capped at 100 tOKRW per run. Run lab:pcl before lab:eas or lab:boolean. Existing run directories are never overwritten.'); process.exit(process.argv.length === 2 ? 0 : 1); }
const req=createRequire(root+'/package.json');const {iPclAbi}=req('@maroo-chain/contracts/abi/precompiles/pcl/IPcl');
loadEnvFile(root+'/.env');
const outDir=new URL('../../.private/pcl-proxy/',import.meta.url);mkdirSync(new URL('../../.private/',import.meta.url),{recursive:true});mkdirSync(outDir);
const out={label:'Live Testnet',chainId:450815,started:new Date().toISOString(),steps:[]};
function save(){writeFileSync(new URL('RESULT.json',outDir),JSON.stringify(out,(_,x)=>typeof x==='bigint'?x.toString():x,2));}
function record(x){out.steps.push(x);save();console.log(JSON.stringify(x,(_,v)=>typeof v==='bigint'?v.toString():v));}
const source=readFileSync(new URL('./WorkshopPayment.sol',import.meta.url),'utf8');
writeFileSync(new URL('WorkshopPayment.sol',outDir),source);
const compiled=JSON.parse(solc.compile(JSON.stringify({language:'Solidity',sources:{'Payment.sol':{content:source}},settings:{evmVersion:'paris',optimizer:{enabled:true,runs:200},outputSelection:{'*':{'*':['abi','evm.bytecode.object']}}}})));
if(compiled.errors?.some(e=>e.severity==='error'))throw Error('Compilation failed');
const artifact=compiled.contracts['Payment.sol'].WorkshopPayment;
writeFileSync(new URL('artifact.json',outDir),JSON.stringify(artifact,null,2));
const request=new FetchRequest('https://rpc-testnet.maroo.io');request.timeout=20000;
const p=new JsonRpcProvider(request,undefined,{batchMaxCount:1,cacheTimeout:-1});
const key=process.env.MAROO_PRIVATE_KEY;const wallet=new Wallet(key.startsWith('0x')?key:'0x'+key,p);
const pclAddress='0x1000000000000000000000000000000000000005';const pcl=new Contract(pclAddress,iPclAbi,wallet);const pi=new Interface(iPclAbi);const coder=AbiCoder.defaultAbiCoder();
let spent=0n;let restorePolicy;
function err(e){const d=e.data??e.info?.error?.data;let decoded;try{const x=pi.parseError(typeof d==='string'?d:d?.data);decoded=x?{name:x.name,args:Array.from(x.args)}:null;}catch{}return {code:e.code,message:e.shortMessage??'RPC request failed',decoded,rpcMessage:e.info?.error?.message};}
async function send(name,tx,gasOverride){
 const gas=gasOverride??((await p.estimateGas({...tx,from:wallet.address}))*130n/100n);const price=(await p.getFeeData()).gasPrice;
 if(!price||gas*price+spent>parseEther('100'))throw Error('Run fee budget exceeded');
 if((await p.getBalance(wallet.address))<gas*price+(tx.value??0n))throw Error('Insufficient balance');
 const r=await wallet.sendTransaction({...tx,chainId:450815,type:0,gasLimit:gas,gasPrice:price});record({step:name,phase:'submitted',hash:r.hash});
 let receipt;try{receipt=await r.wait(1,60000);}catch(e){if(e.receipt)receipt=e.receipt;else throw e;}
 if(!receipt)throw Error('Receipt unavailable; inspect submitted hash before retry');spent+=receipt.fee;
 const logs=receipt.logs.map(l=>{try{const x=pi.parseLog(l);return x?{name:x.name,args:Array.from(x.args)}:null;}catch{return null;}}).filter(Boolean);
 record({step:name,phase:'included',hash:r.hash,status:receipt.status,block:receipt.blockNumber,fee:formatEther(receipt.fee),logs});return receipt;
}
try{
 if((await p.getNetwork()).chainId!==450815n)throw Error('Wrong chain');
 out.sender=wallet.address;out.recipient=getAddress(process.env.MAROO_RECIPIENT);if(out.sender===out.recipient||out.recipient==='0x0000000000000000000000000000000000000000')throw Error('Distinct nonzero recipient required');if(process.env.MAROO_ADDRESS&&getAddress(process.env.MAROO_ADDRESS)!==out.sender)throw Error('MAROO_ADDRESS does not match signing key');save();
 const f=new ContractFactory(artifact.abi,artifact.evm.bytecode.object,wallet);
 const r=await send('deploy-implementation',await f.getDeployTransaction());if(r.status!==1)throw Error('Implementation deployment failed');out.implementation=r.contractAddress;save();
 const api=new Interface(artifact.abi);
 const init=coder.encode(['address','address','bytes'],[out.implementation,wallet.address,api.encodeFunctionData('initialize',[wallet.address])]);
 const proxyReceipt=await send('deploy-pcl-proxy',await pcl.deployPclProxy.populateTransaction(1,0n,init));if(proxyReceipt.status!==1)throw Error('Proxy deployment failed');
 const event=proxyReceipt.logs.map(l=>{try{return pi.parseLog(l);}catch{return null;}}).find(l=>l?.name==='PclProxyDeployed');if(!event)throw Error('Proxy event missing');out.proxy=event.args.proxy;save();
 const entry=await pcl.pclProxy(out.proxy);record({step:'registry',kind:entry.kind,admin:entry.admin,proxy:entry.proxy});
 if(entry.kind!==1n||entry.admin.toLowerCase()!==wallet.address.toLowerCase())throw Error('Registry mismatch');
 const app=new Contract(out.proxy,artifact.abi,wallet);
 if((await app.owner())!==wallet.address)throw Error('Initialization mismatch');
 async function policy(addresses,name){const enc=coder.encode(['tuple(address[] addresses)'],[{addresses}]);const cfg={_contract:out.proxy,admin:wallet.address,policies:[{templateId:'DENYLIST_POLICY',policy:enc,selector:api.getFunction('pay').selector}]};const receipt=await send(name,await pcl.changeContractPolicies.populateTransaction(cfg));if(receipt.status!==1)throw Error('Policy update failed');}
 restorePolicy=()=>policy([],'restore-allow-policy');
 await policy([],'allow-policy');
 const amount=parseEther('0.001');const pay=await app.pay.populateTransaction(out.recipient,{value:amount});
 const before=await p.getBalance(out.recipient);const success=await send('normal-payment',pay);const after=await p.getBalance(out.recipient);const count=await app.paymentCount();
 record({step:'normal-payment-verification',recipientDelta:after-before,paymentCount:count});if(success.status!==1||after-before!==amount||count!==1n)throw Error('Normal payment evidence mismatch');
 await policy([wallet.address],'block-sender-policy');
 let rejected=false;try{await p.estimateGas({...pay,from:wallet.address});record({step:'blocked-preflight',unexpected:'estimate succeeded'});}catch(e){const detail=err(e);rejected=detail.decoded?.name==='InDenylist';record({step:'blocked-preflight',...detail});}
 const blockedBefore=await p.getBalance(out.recipient);const countBefore=await app.paymentCount();
 if(!rejected)throw Error('Expected InDenylist preflight rejection');
 const fail=await send('blocked-payment-submission',pay,500000n);if(fail.status!==0)throw Error('Blocked payment did not produce status 0 receipt');
 const blockedAfter=await p.getBalance(out.recipient);const countAfter=await app.paymentCount();record({step:'blocked-state',recipientDelta:blockedAfter-blockedBefore,countBefore,countAfter});
 await restorePolicy();restorePolicy=undefined;out.restored=true;
 try{await p.estimateGas({to:out.implementation,data:pay.data,value:amount,from:wallet.address});record({step:'direct-implementation',unexpected:'estimate succeeded'});}catch(e){record({step:'direct-implementation',rejected:true,...err(e)});}
 out.passed=rejected&&blockedAfter===blockedBefore&&countAfter===countBefore;if(!out.passed)throw Error('Blocked state verification failed');out.totalFeeTOKRW=formatEther(spent);save();
}catch(e){out.failure=err(e);out.failure.message=e.shortMessage??e.message;save();console.log(JSON.stringify(out.failure));process.exitCode=1;}finally{if(restorePolicy){try{await restorePolicy();out.restored=true;}catch(e){out.restoreFailure=err(e);process.exitCode=1;}}out.totalFeeTOKRW=formatEther(spent);save();p.destroy();}
