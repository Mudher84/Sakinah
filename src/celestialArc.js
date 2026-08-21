function qBezier(t,p0,p1,p2){const u=1-t;return u*u*p0+2*u*t*p1+t*t*p2}
function clamp(v,min=0,max=1){return Math.max(min,Math.min(max,v))}
function nowHour(){const d=new Date();return d.getHours()+d.getMinutes()/60+d.getSeconds()/3600}
function isDay(hour){return hour>=6&&hour<18}
function phase(hour){if(isDay(hour))return clamp((hour-6)/12);const h=hour>=18?hour-18:hour+6;return clamp(h/12)}
function targetArc(){
 const modern=document.querySelector('.mm-reference-home svg[viewBox="0 0 340 126"]');
 if(modern)return{svg:modern,kind:'modern'};
 const legacy=document.querySelector('.sakinah-live-hero svg[viewBox="0 0 420 110"]');
 if(legacy)return{svg:legacy,kind:'legacy'};
 return null;
}
function ensureMarker(target){
 const wrap=target.svg.parentElement;
 let marker=document.getElementById('sakinah-celestial-marker');
 if(!marker){marker=document.createElement('div');marker.id='sakinah-celestial-marker';marker.setAttribute('aria-hidden','true')}
 if(marker.parentElement!==wrap)wrap.appendChild(marker);
 Object.assign(marker.style,{position:'absolute',zIndex:'20',width:'26px',height:'26px',display:'grid',placeItems:'center',pointerEvents:'none',transform:'translate(-50%,-50%)',transition:'left .35s linear,top .35s linear,color .35s ease,filter .35s ease',fontFamily:'Georgia,serif',fontWeight:'400',lineHeight:'1'});
 return marker;
}
function updateMarker(){
 const target=targetArc();
 const stale=document.getElementById('sakinah-celestial-marker');
 if(!target){if(stale)stale.style.display='none';return}
 const marker=ensureMarker(target),hour=nowHour(),day=isDay(hour),t=phase(hour);
 let x,y;
 if(target.kind==='modern'){
  // RTL prayer timeline: fajr begins on the right, sunset ends on the left.
  x=qBezier(t,334,170,6);
  y=qBezier(t,112,-18,112)-5;
 }else{
  x=qBezier(t,400,210,20);
  y=qBezier(t,88,7,88)-6;
 }
 marker.style.display='grid';
 marker.style.left=`${x/340*100}%`;
 marker.style.top=target.kind==='modern'?`${y/126*100}%`:`${y/110*100}%`;
 marker.textContent=day?'☀︎':'☾';
 marker.style.fontSize=day?'19px':'21px';
 marker.style.color=day?'#E0B24E':'#F0EADB';
 marker.style.textShadow=day?'0 0 8px rgba(224,178,78,.34),0 0 18px rgba(224,178,78,.12)':'0 0 8px rgba(240,234,219,.28)';
 marker.style.filter=day?'drop-shadow(0 1px 1px rgba(85,58,8,.14))':'drop-shadow(0 1px 1px rgba(0,0,0,.16))';
}
export function installCelestialArc(){
 const start=()=>{
  updateMarker();
  const root=document.getElementById('root');
  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;updateMarker()})};
  const observer=new MutationObserver(m=>{if(m.some(x=>x.type==='childList'))schedule()});
  if(root)observer.observe(root,{subtree:true,childList:true});
  window.addEventListener('resize',schedule,{passive:true});
  ['sakinah:feature','sakinah:global-root'].forEach(n=>window.addEventListener(n,schedule));
  setInterval(updateMarker,30000);
 };
 requestAnimationFrame(()=>requestAnimationFrame(start));
}
