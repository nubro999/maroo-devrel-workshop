import { ADDRESSES } from './config.ts';
const surface = process.argv[2];
if (surface !== 'pcl' && surface !== 'privacy') throw new Error('Choose pcl or privacy');
console.log(JSON.stringify({ label: 'Docs Only', status: 'placeholder-no-network-call', surface, address: ADDRESSES[surface], next: surface === 'pcl' ? ['Obtain exact IPcl ABI from current official source', 'Record getParams/template results and access control', 'Demonstrate policy effect; lookup alone is not meaningful integration'] : ['Verify circuit pin matches live verifier', 'Obtain compatible proving artifacts', 'Verify privacy-state and Merkle-witness queries', 'Obtain serialization or known-good fixture', 'Record first blocked layer; never fabricate proof'], source: 'https://docs.maroo.io', liveVerified: false }, null, 2));

