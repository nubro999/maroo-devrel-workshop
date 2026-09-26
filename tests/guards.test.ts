import { test } from 'node:test';
import assert from 'node:assert/strict';
import { address, amount, assertTestnet, signingKey } from '../demo/maroo/config.ts';
import type { JsonRpcProvider } from 'ethers';
test('accepts both key encodings and distinguishes missing from malformed input', () => {
  const synthetic = '1'.repeat(64);
  assert.equal(signingKey(synthetic), `0x${synthetic}`);
  assert.equal(signingKey(`0x${synthetic}`), `0x${synthetic}`);
  assert.throws(() => signingKey(undefined), /empty/);
  for (const bad of ['1'.repeat(63), 'g'.repeat(64), `${synthetic} `]) {
    assert.throws(() => signingKey(bad), /64 hexadecimal/);
  }
});
test('rejects unsafe amounts', () => {
  for (const value of ['', '0', '-1', '1e3', '1.1234567890123456789']) assert.throws(() => amount(value));
  assert.equal(amount('0.000000000000000001'), 1n);
});
test('rejects invalid and burn recipients', () => {
  assert.throws(() => address('0x0000000000000000000000000000000000000000', 'recipient'));
  assert.throws(() => address('bad', 'recipient'));
});
test('rejects non-testnet RPC before use', async () => {
  const fake = { send: async () => '0x1' } as unknown as JsonRpcProvider;
  await assert.rejects(() => assertTestnet(fake), /mismatch/);
});


