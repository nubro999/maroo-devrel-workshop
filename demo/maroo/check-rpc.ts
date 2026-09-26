import { provider, assertTestnet } from './config.ts';
import { record, fail } from './evidence.ts';
let p;
try {
  p = provider();
  await assertTestnet(p);
  const block = await p.getBlock('latest');
  if (!block) throw new Error('Missing block');
  record('check-rpc', { status: 'success', chainId: 450815, target: 'eth_chainId + eth_getBlockByNumber', blockNumber: block.number, blockHash: block.hash, stateChange: false });
} catch (e) { fail('check-rpc', e); }
finally { p?.destroy(); }

