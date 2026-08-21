let pending=false;
let previousSrc="";
let retries=0;
let timer=0;

function getPlayerAudio(){
  return document.querySelector('.mm-quran-player audio');
}

function clearPending(){
  pending=false;
  retries=0;
  if(timer){clearTimeout(timer);timer=0;}
}

function schedulePlay(delay=80){
  if(!pending)return;
  if(timer)clearTimeout(timer);
  timer=setTimeout(tryPlay,delay);
}

function tryPlay(){
  timer=0;
  if(!pending)return;
  const audio=getPlayerAudio();
  if(!audio){
    if(retries++<30)schedulePlay(80);else clearPending();
    return;
  }

  const currentSrc=audio.currentSrc||audio.src||"";
  const sourceChanged=currentSrc&&currentSrc!==previousSrc;
  const ready=audio.readyState>=2;

  if(sourceChanged&&ready){
    audio.currentTime=0;
    const p=audio.play();
    if(p&&typeof p.then==='function'){
      p.then(clearPending).catch(()=>{
        if(retries++<30)schedulePlay(100);else clearPending();
      });
    }else clearPending();
    return;
  }

  if(sourceChanged&&audio.readyState<2){
    const onReady=()=>{
      audio.removeEventListener('canplay',onReady);
      audio.removeEventListener('loadeddata',onReady);
      schedulePlay(0);
    };
    audio.addEventListener('canplay',onReady,{once:true});
    audio.addEventListener('loadeddata',onReady,{once:true});
  }

  if(retries++<30)schedulePlay(80);else clearPending();
}

export function installQuranSurahAutoPlay(){
  document.addEventListener('click',e=>{
    const card=e.target.closest?.('.mm-surah-card');
    if(!card)return;

    const audio=getPlayerAudio();
    previousSrc=audio?.currentSrc||audio?.src||"";
    pending=true;
    retries=0;

    // React changes the selected surah/src after this click handler returns.
    schedulePlay(40);
  },true);
}
