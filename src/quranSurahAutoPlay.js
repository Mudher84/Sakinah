let pending=false;
let chosenLabel="";

function isSurahChoice(btn){
  if(!btn)return false;
  const text=(btn.textContent||"").trim();
  return /^\s*\d*\s*سورة\s+/u.test(text)||text.includes("سورة ");
}

function tryPlay(attempt=0){
  if(!pending)return;
  const audio=document.querySelector('.sakinah-audio-page audio, audio');
  if(audio&&audio.src){
    audio.play().then(()=>{pending=false}).catch(()=>{
      if(attempt<12)setTimeout(()=>tryPlay(attempt+1),120);
      else pending=false;
    });
    return;
  }
  if(attempt<12)setTimeout(()=>tryPlay(attempt+1),120);
  else pending=false;
}

export function installQuranSurahAutoPlay(){
  document.addEventListener('click',e=>{
    const btn=e.target.closest?.('button');
    if(!isSurahChoice(btn))return;
    chosenLabel=(btn.textContent||'').trim();
    pending=true;
    setTimeout(()=>tryPlay(0),60);
  },true);

  new MutationObserver(()=>{
    if(pending)tryPlay(0);
  }).observe(document.body,{childList:true,subtree:true});
}
