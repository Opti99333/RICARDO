
(() => {
  const $ = (sel, ctx=document) => ctx.querySelector(sel);

  const enter = $('#enter');
  const enterBtn = $('#enterBtn');
  const enterVideo = $('#enterVideo');
  const app = $('#app');
  const bgMusic = $('#bgMusic');
  const bgVideo = $('#bgVideo');
  const muteBtn = $('#muteBtn');

  function startMainMedia(){
   
    try {
      bgVideo.pause();
      bgVideo.currentTime = 0;
      bgVideo.loop = true;
      bgVideo.muted = true; // keep video silent; music comes from bgMusic
      const vPlay = bgVideo.play();
      if (vPlay && typeof vPlay.then === 'function') vPlay.catch(()=>{});
    } catch(e){ /* noop */ }

    
    try {
      bgMusic.muted = false;
      bgMusic.volume = 0.9;
      const aPlay = bgMusic.play();
      if (aPlay && typeof aPlay.then === 'function') {
        aPlay.then(() => {
          muteBtn.classList.remove('is-muted');
          muteBtn.setAttribute('aria-pressed', 'false');
        }).catch(() => {
         
          bgMusic.muted = true;
          muteBtn.classList.add('is-muted');
          muteBtn.setAttribute('aria-pressed', 'true');
        });
      }
    } catch(e){
      bgMusic.muted = true;
      muteBtn.classList.add('is-muted');
      muteBtn.setAttribute('aria-pressed', 'true');
    }
  }

  function showApp(){
    
    app.classList.remove('hidden');
    app.classList.add('shown', 'fade-in');
    app.setAttribute('aria-hidden', 'false');

    
    startMainMedia();
  }

  function exitEnter(){
    if (enterVideo) { try { enterVideo.pause(); } catch(e){} }
    if (!enter) return;
    enter.classList.add('fade-out');
    setTimeout(() => enter.remove(), 650);
  }

  
  if (enterBtn){
    enterBtn.addEventListener('click', () => {
      exitEnter();
      showApp();
    });
  }

  
  if (muteBtn){
    muteBtn.addEventListener('click', () => {
      const nowMuted = !bgMusic.muted;
      bgMusic.muted = nowMuted;
      muteBtn.classList.toggle('is-muted', nowMuted);
      muteBtn.setAttribute('aria-pressed', nowMuted ? 'true' : 'false');
      if (!nowMuted){
        bgMusic.play().catch(()=>{});
      } else {
        
      }
    });
  }

 
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'm'){
      muteBtn?.click();
    }
  });

  
})();


(() => {
  const btn = document.getElementById('copyContractBtn');
  if (!btn) return;
  const getText = () => {
    const sel = btn.getAttribute('data-copy-target');
    const el = sel ? document.querySelector(sel) : null;
    if (el && el.textContent) return el.textContent.trim();
    const chip = btn.closest('#contractChip');
    return chip?.dataset?.address || '';
  };
  btn.addEventListener('click', async () => {
    const text = getText();
    if (!text) return;
    try{
      await navigator.clipboard.writeText(text);
      btn.classList.add('copied');
      const prev = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = prev; btn.classList.remove('copied'); }, 1200);
    }catch(e){
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try{ document.execCommand('copy'); }catch(_){}
      document.body.removeChild(ta);
      btn.classList.add('copied');
      const prev = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = prev; btn.classList.remove('copied'); }, 1200);
    }
  });
})();

