const commands = ["git clone https://github.com/nubro999/maroo-devrel-workshop.git\ncd maroo-devrel-workshop\nnpm ci\nnpm run setup", "npm run check:rpc\nnpm run balance\nnpm run privacy:public", "npm run lab:pcl -- --broadcast", "npm run lab:eas -- --broadcast", "npm run lab:boolean -- --broadcast", "SUBMISSION_DIR=\"$PWD\"\nRUN_PARENT=$(mktemp -d /tmp/maroo-workshop.XXXXXX)\ngit -c core.autocrlf=false clone https://github.com/DELIGHT-LABS/clairveil.git \"$RUN_PARENT/source\"\ngit -C \"$RUN_PARENT/source\" checkout --detach af04cfc994a3da87a8b1b902eda0988feb512539\nGOTOOLCHAIN=go1.25.13 python3 \"$SUBMISSION_DIR/demo/clairveil/run-local.py\" \\\n  --source \"$RUN_PARENT/source\" \\\n  --run-dir \"$RUN_PARENT/run\"", "python3 -m json.tool \"$RUN_PARENT/run/PUBLIC_RESULT.json\"", "REPEAT_PARENT=$(mktemp -d /tmp/maroo-repeat.XXXXXX)\nGOTOOLCHAIN=go1.25.13 python3 \"$SUBMISSION_DIR/demo/clairveil/run-local.py\" \\\n  --source \"$RUN_PARENT/source\" \\\n  --artifacts \"$RUN_PARENT/run/artifacts\" \\\n  --run-dir \"$REPEAT_PARENT/run\"\npython3 -m json.tool \"$REPEAT_PARENT/run/PUBLIC_RESULT.json\""];
let statusTimer;
for (const button of document.querySelectorAll('[data-copy]')) {
 button.addEventListener('click', async () => {
  const text = commands[Number(button.dataset.copy)];
  try {
   if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
   else { const field = document.createElement('textarea'); field.value = text; field.style.position='fixed'; field.style.opacity='0'; document.body.appendChild(field); field.select(); const ok=document.execCommand('copy'); field.remove(); if(!ok)throw new Error('copy'); }
   const old=button.textContent; button.textContent='복사됨';setTimeout(()=>button.textContent=old,1600);
   const status=document.getElementById('status');status.textContent='명령을 복사했습니다';status.classList.add('show');clearTimeout(statusTimer);statusTimer=setTimeout(()=>status.classList.remove('show'),2000);
  } catch { const pre=button.closest('.command').querySelector('pre');const range=document.createRange();range.selectNodeContents(pre);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);pre.focus();const status=document.getElementById('status');status.textContent='선택된 명령을 Ctrl+C 또는 ⌘C로 복사하세요';status.classList.add('show'); }
 });
}
