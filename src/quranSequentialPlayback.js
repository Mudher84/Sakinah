function getCurrentSurah(root){
  const text=root?.textContent||'';
  const m=text.match(/SURAH\s*(\d{1,3})/i);
  const n=m?Number(m[1]):0;
  return Number.isFinite(n)?n:0;
}

function bind(root){
  const audio=root.querySelector('audio');
  if(!audio||audio.dataset.mmSequentialBound==='1')return;
  audio.dataset.mmSequentialBound='1';

  audio.addEventListener('ended',()=>{
    const current=getCurrentSurah(root);
    if(!current||current>=114)return;
    const cards=[...root.querySelectorAll('.mm-surah-card')];
    const nextCard=cards[current];
    if(nextCard){
      requestAnimationFrame(()=>nextCard.click());
    }
  });
}

export function installQuranSequentialPlayback(){
  const scan=()=>{
    document.querySelectorAll('.mm-quran-player').forEach(bind);
  };
  scan();
  const mo=new MutationObserver(scan);
  mo.observe(document.documentElement,{subtree:true,childList:true});
}
