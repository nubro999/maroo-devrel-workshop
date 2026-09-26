import { Wallet } from 'ethers';
import { address, amount, assertTestnet, provider, EXPLORER, InputError, signingKey } from './config.ts';
import { record, fail } from './evidence.ts';
let p;
let hash: string | undefined;
try {
  const args = process.argv.slice(2);
  if (args.some(a => a !== '--broadcast') || args.length > 1) throw new InputError('Usage: npm run transfer:okrw [-- --broadcast]');
  const broadcast = args.includes('--broadcast');
  const from = address(process.env.MAROO_ADDRESS, 'MAROO_ADDRESS');
  const to = address(process.env.MAROO_RECIPIENT, 'MAROO_RECIPIENT');
  const value = amount(process.env.MAROO_AMOUNT_OKRW);
  if (from === to) throw new InputError('Use distinct sender and recipient addresses');
  p = provider();
  await assertTestnet(p);
  const beforeBlock = await p.getBlockNumber();
  const senderBefore = await p.getBalance(from, beforeBlock);
  const recipientBefore = await p.getBalance(to, beforeBlock);
  const gasLimit = (await p.estimateGas({ from, to, value })) * 120n / 100n;
  const feeData = await p.getFeeData();
  const gasPrice = feeData.gasPrice;
  if (gasPrice === null) throw new InputError('RPC did not return gasPrice; no fee guess used');
  if (senderBefore < value + gasLimit * gasPrice) throw new InputError('Insufficient balance including estimated maximum gas fee');
  record('transfer-plan', { status: 'estimated', from, to, valueAokrw: value, beforeBlock, senderBefore, recipientBefore, gasLimit, gasPrice, stateChange: false, broadcast });
  if (broadcast) {
    const key = signingKey(process.env.MAROO_PRIVATE_KEY);
    let wallet: Wallet;
    try { wallet = new Wallet(key, p); } catch { throw new InputError('Invalid signing key'); }
    if (wallet.address !== from) throw new InputError('Signing key does not match MAROO_ADDRESS');
    await assertTestnet(p);
    const tx = await wallet.sendTransaction({ to, value, gasLimit, gasPrice, chainId: 450815, type: 0 });
    hash = tx.hash;
    record('transfer-submitted', { status: 'pending', hash, explorer: `${EXPLORER}/tx/${hash}`, from, to, valueAokrw: value });
    const receipt = await tx.wait(1, 60000);
    if (!receipt) throw new Error('No receipt');
    const senderAfter = await p.getBalance(from, receipt.blockNumber);
    const recipientAfter = await p.getBalance(to, receipt.blockNumber);
    record('transfer-receipt', { status: receipt.status === 1 ? 'success' : 'reverted', hash, explorer: `${EXPLORER}/tx/${hash}`, blockNumber: receipt.blockNumber, from, to, valueAokrw: value, senderBefore, senderAfter, recipientBefore, recipientAfter, gasUsed: receipt.gasUsed, fee: receipt.fee, stateChange: receipt.status === 1, limitation: 'Block snapshots may include unrelated transactions; verify receipt and explorer too.' });
    if (receipt.status !== 1) process.exitCode = 1;
  } else console.log('Dry run complete. Nothing signed or broadcast.');
} catch (e) {
  if (hash) record('transfer-followup', { status: 'unknown-check-receipt-before-retry', hash, explorer: `${EXPLORER}/tx/${hash}` });
  fail('transfer-okrw', e);
} finally { p?.destroy(); }

