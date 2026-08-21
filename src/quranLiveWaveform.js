let stopCurrent=null;

function bindWaveform(root){
  const audio=root.querySelector('audio');
  const bars=[...root.querySelectorAll('.mm-wavebar')];
  if(!audio||!bars.length||audio.dataset.mmWaveBound==='1')return;
  audio.dataset.mmWaveBound='1';

  const baseHeights=bars.map(b=>Math.max(14,parseFloat(getComputedStyle(b).height)||24));
  let ctx=null,analyser=null,source=null,data=null,raf=0,lastNonZero=0,usingFallback=false;

  const drawFallback=()=>{
    if(audio.paused||audio.ended){raf=0;return;}
    const t=audio.currentTime||0;
    bars.forEach((bar,i)=>{
      const pulse=(Math.sin(t*5.1+i*.72)+Math.sin(t*2.7+i*1.13)+2)/4;
      const h=14+pulse*44;
      bar.style.height=`${h.toFixed(1)}px`;
    });
    raf=requestAnimationFrame(drawFallback);
  };

  const drawAnalyser=()=>{
    if(audio.paused||audio.ended){raf=0;return;}
    analyser.getByteFrequencyData(data);
    let energy=0;
    for(let i=0;i<data.length;i++)energy+=data[i];
    energy/=Math.max(1,data.length);
    if(energy>1.5)lastNonZero=performance.now();
    if(performance.now()-lastNonZero>1200){
      usingFallback=true;
      raf=requestAnimationFrame(drawFallback);
      return;
    }
    const usable=Math.max(1,Math.floor(data.length*.62));
    bars.forEach((bar,i)=>{
      const start=Math.floor(i*usable/bars.length);
      const end=Math.max(start+1,Math.floor((i+1)*usable/bars.length));
      let sum=0;
      for(let k=start;k<end;k++)sum+=data[k];
      const v=sum/(end-start)/255;
      const shaped=Math.pow(v,.72);
      const h=12+shaped*48;
      bar.style.height=`${Math.max(12,Math.min(60,h)).toFixed(1)}px`;
    });
    raf=requestAnimationFrame(drawAnalyser);
  };

  const ensureAnalyser=()=>{
    if(analyser)return true;
    try{
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return false;
      ctx=new AC();
      analyser=ctx.createAnalyser();
      analyser.fftSize=256;
      analyser.smoothingTimeConstant=.72;
      data=new Uint8Array(analyser.frequencyBinCount);
      source=ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      lastNonZero=performance.now();
      return true;
    }catch(e){
      analyser=null;
      return false;
    }
  };

  const start=()=>{
    if(raf)cancelAnimationFrame(raf);
    usingFallback=false;
    if(ensureAnalyser()){
      if(ctx?.state==='suspended')ctx.resume().catch(()=>{});
      lastNonZero=performance.now();
      raf=requestAnimationFrame(drawAnalyser);
    }else{
      usingFallback=true;
      raf=requestAnimationFrame(drawFallback);
    }
  };
  const pause=()=>{if(raf){cancelAnimationFrame(raf);raf=0;}};
  const reset=()=>{
    pause();
    bars.forEach((bar,i)=>bar.style.height=`${baseHeights[i]}px`);
  };

  audio.addEventListener('play',start);
  audio.addEventListener('pause',pause);
  audio.addEventListener('ended',reset);
  audio.addEventListener('emptied',reset);
  if(!audio.paused)start();

  stopCurrent=()=>{
    pause();
    audio.removeEventListener('play',start);
    audio.removeEventListener('pause',pause);
    audio.removeEventListener('ended',reset);
    audio.removeEventListener('emptied',reset);
    try{source?.disconnect();analyser?.disconnect();ctx?.close();}catch{}
    delete audio.dataset.mmWaveBound;
  };
}

export function installQuranLiveWaveform(){
  const scan=()=>{
    const root=document.querySelector('.mm-quran-player');
    if(root)bindWaveform(root);
  };
  scan();
  const mo=new MutationObserver(scan);
  mo.observe(document.documentElement,{subtree:true,childList:true});
  window.addEventListener('beforeunload',()=>{stopCurrent?.();mo.disconnect();},{once:true});
}
