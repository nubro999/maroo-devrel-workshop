import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const scanner = resolve('scripts/check-secrets.mjs');
function fixture(run: (dir: string, git: (...args: string[]) => void) => void) {
  const dir = mkdtempSync(join(tmpdir(), 'maroo-secret-test-'));
  const git = (...args: string[]) => { execFileSync('git', args, { cwd: dir, stdio: 'pipe' }); };
  try { git('init'); git('config', 'user.email', 'test@example.invalid'); git('config', 'user.name', 'Test'); run(dir, git); }
  finally { rmSync(dir, { recursive: true, force: true }); }
}
function scan(dir: string, ...args: string[]) { return spawnSync(process.execPath, [scanner, ...args], { cwd: dir, encoding: 'utf8' }); }
const synthetic = () => 'ab'.repeat(32);

test('accepts templates, environment references and transaction hashes', () => fixture((dir) => {
  writeFileSync(join(dir, '.env.example'), 'PRIVATE_KEY=\nAPI_KEY=YOUR_API_KEY\n');
  writeFileSync(join(dir, 'safe.ts'), `const privateKey = process.env.PRIVATE_KEY;\nconst txHash = "0x${synthetic()}";\n`);
  assert.equal(scan(dir).status, 0);
}));
test('blocks literal keys without printing secret contents', () => fixture((dir) => {
  writeFileSync(join(dir, 'unsafe.txt'), `PRIVATE_KEY=0x${synthetic()}\n`);
  const result = scan(dir);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /literal private key/);
  assert.ok(!result.stderr.includes(synthetic()));
}));
test('staged scan reads staged blob even after working copy is cleaned', () => fixture((dir, git) => {
  writeFileSync(join(dir, 'config.txt'), `PRIVATE_KEY=${synthetic()}\n`);
  git('add', 'config.txt');
  writeFileSync(join(dir, 'config.txt'), 'PRIVATE_KEY=\n');
  assert.equal(scan(dir).status, 0);
  assert.equal(scan(dir, '--staged').status, 1);
}));
test('history detects secrets removed by later commits', () => fixture((dir, git) => {
  writeFileSync(join(dir, 'config.txt'), `PRIVATE_KEY=${synthetic()}\n`);
  git('add', '.'); git('commit', '-m', 'fixture');
  writeFileSync(join(dir, 'config.txt'), 'PRIVATE_KEY=\n');
  git('add', '.'); git('commit', '-m', 'clean');
  assert.equal(scan(dir).status, 0);
  assert.equal(scan(dir, '--history').status, 1);
}));
test('ignored local env is excluded but forcibly staged env is blocked', () => fixture((dir, git) => {
  writeFileSync(join(dir, '.gitignore'), '.env\n');
  writeFileSync(join(dir, '.env'), 'LOCAL=placeholder\n');
  assert.equal(scan(dir).status, 0);
  git('add', '-f', '.env');
  assert.equal(scan(dir, '--staged').status, 1);
}));
test('detects seed phrases and credentials while keeping values out of logs', () => fixture((dir) => {
  const phrase = Array.from({ length: 12 }, (_, index) => `word${index}`).join(' ');
  const token = ['gh', 'p_', 'Z'.repeat(36)].join('');
  writeFileSync(join(dir, 'credentials.txt'), `MNEMONIC="${phrase}"\nAPI_KEY=${'Q'.repeat(24)}\n${token}\n`);
  const result = scan(dir);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /literal seed phrase/);
  assert.match(result.stderr, /literal credential/);
  assert.match(result.stderr, /recognized access token/);
  assert.ok(!result.stderr.includes(phrase));
  assert.ok(!result.stderr.includes(token));
}));
