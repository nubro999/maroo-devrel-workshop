// Local account configuration only: does not submit transactions.
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { createInterface } from 'node:readline';
import { Writable } from 'node:stream';
import { Wallet, isAddress } from 'ethers';

try {
  if (existsSync('.env')) {
    const env = parseEnv(readFileSync('.env', 'utf8'));
    let payer;
    try { payer = new Wallet(env.MAROO_PRIVATE_KEY); } catch { throw Error('기존 .env의 MAROO_PRIVATE_KEY를 확인하세요. 파일은 변경하지 않았습니다.'); }
    if (!isAddress(env.MAROO_RECIPIENT) || env.MAROO_RECIPIENT.toLowerCase() === payer.address.toLowerCase()) throw Error('기존 .env의 MAROO_RECIPIENT에 다른 유효한 주소를 설정하세요.');
    console.log('기존 .env 사용 · 지급자:', payer.address, '\nA1부터 진행하세요.');
  } else {
    if (!process.stdin.isTTY) throw Error('터미널에서 npm run setup:account를 직접 실행하세요.');
    const silent = new Writable({ write(chunk, encoding, callback) { callback(); } });
    const rl = createInterface({ input: process.stdin, output: silent, terminal: true });
    process.stdout.write('배정받은 테스트 개인키 입력 (화면에 표시되지 않음): ');
    const key = await new Promise(resolve => { rl.question('', resolve); rl.on('SIGINT', () => { rl.close(); process.stdout.write('\n취소했습니다.\n'); process.exit(130); }); });
    rl.close(); process.stdout.write('\n');
    let payer;
    try { payer = new Wallet(key.trim()); } catch { throw Error('개인키 형식이 올바르지 않습니다. 다시 실행하세요.'); }
    const recipient = Wallet.createRandom();
    mkdirSync('.private', { recursive: true, mode: 0o700 });
    writeFileSync('.private/terminal-recipient.json', JSON.stringify({ address: recipient.address, privateKey: recipient.privateKey }), { mode: 0o600, flag: 'wx' });
    writeFileSync('.env', `MAROO_RPC_URL=https://rpc-testnet.maroo.io\nMAROO_CHAIN_ID=450815\nMAROO_ADDRESS=${payer.address}\nMAROO_RECIPIENT=${recipient.address}\nMAROO_AMOUNT_OKRW=0.001\nMAROO_PRIVATE_KEY=${payer.privateKey}\n`, { mode: 0o600, flag: 'wx' });
    console.log('설정 완료 · 지급자:', payer.address, '\n수취인:', recipient.address, '\n테스트 토큰이 충전된 배정 계정을 사용하세요. A1부터 진행하세요.');
  }
} catch (error) {
  // Never print ethers errors: they can include the supplied key.
  console.error(error.message.startsWith('기존 ') || error.message.startsWith('터미널') || error.message.startsWith('개인키') ? error.message : '설정을 저장하지 못했습니다. 기존 파일을 확인하세요.');
  process.exitCode = 1;
}
