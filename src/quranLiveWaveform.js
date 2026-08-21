const STYLE_ID='mm-quran-wave-motion-style';

function ensureStyle(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
    .mm-quran-player .mm-wavebar{
      transform-origin:50% 100%;
      will-change:transform;
      transition:background .12s linear,transform .12s ease;
    }
    .mm-quran-player.mm-wave-playing .mm-wavebar{
      animation:mmQuranWavePulse 760ms ease-in-out infinite alternate !important;
    }
    .mm-quran-player.mm-wave-playing .mm-wavebar:nth-child(4n+1){animation-duration:520ms !important;animation-delay:-180ms !important;}
    .mm-quran-player.mm-wave-playing .mm-wavebar:nth-child(4n+2){animation-duration:690ms !important;animation-delay:-320ms !important;}
    .mm-quran-player.mm-wave-playing .mm-wavebar:nth-child(4n+3){animation-duration:880ms !important;animation-delay:-110ms !important;}
    .mm-quran-player.mm-wave-playing .mm-wavebar:nth-child(4n){animation-duration:610ms !important;animation-delay:-260ms !important;}
    @keyframes mmQuranWavePulse{
      0%{transform:scaleY(.28)}
      35%{transform:scaleY(.72)}
      70%{transform:scaleY(1.14)}
      100%{transform:scaleY(.46)}
    }
    @media (prefers-reduced-motion:reduce){
      .mm-quran-player.mm-wave-playing .mm-wavebar{animation-duration:1400ms !important;}
    }
  `;
  document.head.appendChild(style);
}

function bind(root){
  const audio=root.querySelector('audio');
  if(!audio||audio.dataset.mmWaveMotionBound==='1')return;
  audio.dataset.mmWaveMotionBound='1';
  const sync=()=>root.classList.toggle('mm-wave-playing',!audio.paused&&!audio.ended);
  audio.addEventListener('play',sync);
  audio.addEventListener('playing',sync);
  audio.addEventListener('pause',sync);
  audio.addEventListener('ended',sync);
  audio.addEventListener('emptied',sync);
  sync();
}

export function installQuranLiveWaveform(){
  ensureStyle();
  const scan=()=>document.querySelectorAll('.mm-quran-player').forEach(bind);
  scan();
  const mo=new MutationObserver(scan);
  mo.observe(document.documentElement,{subtree:true,childList:true});
}
