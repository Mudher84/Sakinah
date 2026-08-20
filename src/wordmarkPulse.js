export function installWordmarkPulse(){
  let raf=0;
  const start=performance.now();
  const apply=now=>{
    const phase=((now-start)%1800)/1800;
    const opacity=phase<0.5?phase*2:(1-phase)*2;
    document.querySelectorAll('.sakinah-wordmark').forEach(el=>{
      el.style.setProperty('font-weight','900','important');
      el.style.setProperty('opacity',String(opacity),'important');
      el.style.setProperty('transform','none','important');
      el.style.setProperty('text-shadow','none','important');
    });
    raf=requestAnimationFrame(apply);
  };
  raf=requestAnimationFrame(apply);
  return()=>cancelAnimationFrame(raf);
}
