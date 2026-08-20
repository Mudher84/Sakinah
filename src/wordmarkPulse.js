export function installWordmarkPulse(){
  let raf=0;
  const start=performance.now();

  const targets=()=>{
    const root=document.getElementById('root');
    if(!root)return [];
    return [...root.querySelectorAll('*')].filter(el=>{
      if(!(el instanceof HTMLElement))return false;
      if((el.textContent||'').trim()!=='SAKINAH')return false;
      const r=el.getBoundingClientRect();
      const cs=getComputedStyle(el);
      return r.width>0&&r.height>0&&cs.display!=='none'&&cs.visibility!=='hidden';
    });
  };

  const apply=now=>{
    const phase=((now-start)%1800)/1800;
    const opacity=phase<0.5?phase*2:(1-phase)*2;
    targets().forEach(el=>{
      el.style.setProperty('font-weight','900','important');
      el.style.setProperty('opacity',String(opacity),'important');
      el.style.setProperty('transform','none','important');
      el.style.setProperty('text-shadow','none','important');
      el.style.setProperty('transition','none','important');
    });
    raf=requestAnimationFrame(apply);
  };

  raf=requestAnimationFrame(apply);
  return()=>cancelAnimationFrame(raf);
}
