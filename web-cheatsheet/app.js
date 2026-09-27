let timer;
const $=id=>document.getElementById(id);
function toast(t){$('toast').textContent=t;clearTimeout(timer);timer=setTimeout(()=>$('toast').textContent='',3000);}
async function copy(t){try{await navigator.clipboard.writeText(t);toast('복사했습니다.');}catch{toast('복사 권한을 확인하거나 텍스트를 직접 선택하세요.');}}
function setOS(os){document.querySelectorAll('[data-os]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.os===os)));$('os-help').innerHTML=os==='mac'?'<p><strong>macOS Terminal · zsh 또는 Bash</strong></p><p><a href="https://nodejs.org/en/download">Node.js 22.14 이상 / 24</a> · Git · <a href="https://docs.docker.com/desktop/setup/install/mac-install/">Docker Desktop</a>을 설치하고 Docker를 실행하세요. Apple Silicon은 Apple 칩용 설치 파일을 선택하세요.</p>':'<p><strong>Linux 터미널 · Bash</strong></p><p><a href="https://nodejs.org/en/download">Node.js 22.14 이상 / 24</a> · Git · <a href="https://docs.docker.com/engine/install/">Docker Engine</a>이 필요합니다. <code>docker info</code>가 권한 오류 없이 실행되는지 확인하세요.</p>';}
document.querySelectorAll('[data-os]').forEach(b=>b.addEventListener('click',()=>setOS(b.dataset.os)));setOS('mac');
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>copy($(b.dataset.copy).textContent)));
