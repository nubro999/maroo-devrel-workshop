import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { FetchRequest, JsonRpcProvider, getAddress, parseEther, ZeroAddress } from 'ethers';
if (existsSync('.env')) loadEnvFile('.env');
export const CHAIN_ID = 450815n;
export const EXPLORER = 'https://explorer-testnet.maroo.io';
export const ADDRESSES = {
  okrw: '0x1000000000000000000000000000000000000001',
  okrwErc20: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  pcl: '0x1000000000000000000000000000000000000005',
  eas: '0x1000000000000000000000000000000000000009',
  agent: '0x100000000000000000000000000000000000000A',
  privacy: '0x100000000000000000000000000000000000000b'
} as const;
export class InputError extends Error {}
export function signingKey(value: string | undefined): string {
  if (!value) throw new InputError('MAROO_PRIVATE_KEY is empty; set the sender test-wallet key in ignored .env');
  if (!/^(?:0x)?[0-9a-fA-F]{64}$/.test(value)) throw new InputError('MAROO_PRIVATE_KEY must contain 64 hexadecimal characters, optionally prefixed with 0x');
  return value.startsWith('0x') ? value : `0x${value}`;
}
export function address(value: string | undefined, label: string): string {
  try {
    const result = getAddress(value ?? '');
    if (result === ZeroAddress) throw new Error();
    return result;
  } catch { throw new InputError(`${label}: valid non-zero address required`); }
}
export function amount(value: string | undefined): bigint {
  if (!value || !/^\d+(\.\d{1,18})?$/.test(value)) throw new InputError('MAROO_AMOUNT_OKRW: positive decimal, at most 18 places');
  const parsed = parseEther(value);
  if (parsed <= 0n) throw new InputError('MAROO_AMOUNT_OKRW must be positive');
  return parsed;
}
export function provider(): JsonRpcProvider {
  if (process.env.MAROO_CHAIN_ID && process.env.MAROO_CHAIN_ID !== String(CHAIN_ID)) throw new InputError('Only testnet chain 450815 is supported');
  let url: URL;
  try { url = new URL(process.env.MAROO_RPC_URL || 'https://rpc-testnet.maroo.io'); }
  catch { throw new InputError('Invalid RPC URL'); }
  if (url.protocol !== 'https:' || url.username || url.password) throw new InputError('Use HTTPS RPC without embedded credentials');
  const req = new FetchRequest(url.toString());
  req.timeout = 15000;
  return new JsonRpcProvider(req, undefined, { batchMaxCount: 1, cacheTimeout: -1 });
}
export async function assertTestnet(p: JsonRpcProvider): Promise<void> {
  if (BigInt(await p.send('eth_chainId', [])) !== CHAIN_ID) throw new InputError('RPC chain mismatch: refusing operation');
}

