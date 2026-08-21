let boundAudio=null;
let cleanupBound=null;

function currentSurahNumber(audio){
  const src=String(audio?.currentSrc||audio?.src||'');
  const m=src.match(/(\d{3})\.mp3(?:$|[?#])/i);
  return m?Number(m[1]):0;
}

function waitForNextSource(audio,oldSrc,attempt=0){
  const now=String(audio.currentSrc||audio.src||'');
  if(now&&now!==oldSrc){
    const playNow=()=>audio.play().catch(()=>{});
    if(audio.readyState>=2)playNow();
    else audio.addEventListener('canplay',playNow,{once:true});
    return;
  }
  if(attempt<40)setTimeout(()=>waitForNextSource(audio,oldSrc,attempt+1),75);
}

function bind(audio){
  if(!audio||audio===boundAudio)return;
  cleanupBound?.();
  boundAudio=audio;

  const onEnded=()=>{
    if(audio.loop)return;
    const n=currentSurahNumber(audio);
    if(!n||n>=114)return;
    const cards=[...document.querySelectorAll('.mm-surah-card')];
    const next=cards[n];
    if(!next)return;
    const oldSrc=String(audio.currentSrc||audio.src||'');
    next.click();
    waitForNextSource(audio,oldSrc,0);
  };

  audio.addEventListener('ended',onEnded);
  cleanupBound=()=>audio.removeEventListener('ended',onEnded);
}

export function installQuranContinuousPlayback(){
  const scan=()=>{
    const audio=document.querySelector('.mm-quran-player audio');
    if(audio)bind(audio);
  };
  scan();
  const mo=new MutationObserver(scan);
  mo.observe(document.documentElement,{subtree:true,childList:true});
  window.addEventListener('beforeunload',()=>{cleanupBound?.();mo.disconnect();},{once:true});
}
