import { formatEther } from 'ethers';
import { provider, assertTestnet, address } from './config.ts';
import { record, fail } from './evidence.ts';
let p;
try {
  const target = address(process.env.MAROO_ADDRESS, 'MAROO_ADDRESS');
  p = provider();
  await assertTestnet(p);
  const blockNumber = await p.getBlockNumber();
  const value = await p.getBalance(target, blockNumber);
  record('balance', { status: 'success', target, method: 'eth_getBalance', blockNumber, aokrw: value, tOKRW: formatEther(value), stateChange: false });
} catch (e) { fail('balance', e); }
finally { p?.destroy(); }

