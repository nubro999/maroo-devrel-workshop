import { mkdirSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { formatEther } from 'ethers';
import { InputError } from './config.ts';
export function record(operation: string, data: Record<string, unknown>): void {
  const amounts: Record<string, string> = {};
  const fields = ['valueAokrw', 'senderBefore', 'senderAfter', 'recipientBefore', 'recipientAfter', 'fee'] as const;
  for (const field of fields) {
    if (typeof data[field] === 'bigint') amounts[field] = formatEther(data[field]);
  }
  if (typeof data.gasLimit === 'bigint' && typeof data.gasPrice === 'bigint') {
    const feeLimit = data.gasLimit * data.gasPrice;
    amounts.estimatedFeeLimit = formatEther(feeLimit);
    if (typeof data.valueAokrw === 'bigint') amounts.estimatedTotalLimit = formatEther(data.valueAokrw + feeLimit);
  }
  const result = { label: 'Live Testnet', timestamp: new Date().toISOString(), network: 'maroo-testnet', node: process.version, platform: process.platform, operation, ...(Object.keys(amounts).length ? { amounts_tOKRW: amounts } : {}), ...data };
  const text = JSON.stringify(result, (_, value: unknown) => typeof value === 'bigint' ? value.toString() : value, 2);
  mkdirSync('.private/evidence', { recursive: true });
  writeFileSync(`.private/evidence/${Date.now()}-${operation}-${randomUUID()}.json`, text + '\n');
  console.log(text);
}
export function fail(operation: string, error: unknown): void {
  // Never print provider error objects: they may contain URLs, payloads or signed transactions.
  const code = (error as { code?: unknown })?.code;
  const safeCode = typeof code === 'string' && /^[A-Z_]{2,40}$/.test(code) ? code : 'UNCLASSIFIED';
  const message = error instanceof InputError ? error.message : 'Operation failed; inspect locally and record a manually redacted diagnostic.';
  record(operation, { status: 'failed', code: safeCode, message, limitation: 'Raw provider error intentionally omitted; this is not a complete failure diagnosis.' });
  process.exitCode = 1;
}

