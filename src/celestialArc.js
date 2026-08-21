function qBezier(t,p0,p1,p2){const u=1-t;return u*u*p0+2*u*t*p1+t*t*p2}
function clamp(v,min=0,max=1){return Math.max(min,Math.min(max,v))}
function nowHour(){const d=new Date();return d.getHours()+d.getMinutes()/60+d.getSeconds()/3600}
function isDay(hour){return hour>=6&&hour<18}
function phase(hour){if(isDay(hour))return clamp((hour-6)/12);const h=hour>=18?hour-18:hour+6;return clamp(h/12)}
function ensureMarker(){
 let marker=document.getElementById('sakinah-celestial-marker');
 if(marker)return marker;
 marker=document.createElement('div');marker.id='sakinah-celestial-marker';marker.setAttribute('aria-hidden','true');
 Object.assign(marker.style,{position:'fixed',zIndex:'2147483550',width:'26px',height:'26px',display:'grid',placeItems:'center',pointerEvents:'none',transform:'translate(-50%,-50%)',transition:'left .8s ease,top .8s ease,color .5s ease,opacity .35s ease,filter .5s ease',fontFamily:'Georgia,serif',fontSize:'20px',fontWeight:'400',lineHeight:'1'});
 document.body.appendChild(marker);return marker;
}
function targetArc(){
 const modern=document.querySelector('.mm-reference-home svg[viewBox="0 0 340 126"]');
 if(modern)return{svg:modern,kind:'modern'};
 const legacy=document.querySelector('.sakinah-live-hero svg[viewBox="0 0 420 110"]');
 if(legacy)return{svg:legacy,kind:'legacy'};
 return null;
}
function polishPrayerPoints(target){
 if(target.kind!=='modern')return;const wrap=target.svg.parentElement;if(!wrap)return;
 [...wrap.querySelectorAll('button[aria-label]')].filter(b=>['الفجر','الظهر','العصر','المغرب','العشاء'].includes(b.getAttribute('aria-label'))).forEach((b,i)=>{
  b.style.width=i===2?'10px':'9px';b.style.height=i===2?'10px':'9px';b.style.transition='transform .2s ease,background .25s ease,border-color .25s ease';b.style.opacity='0.92';
 });
}
function updateMarker(){
 const marker=ensureMarker(),target=targetArc();if(!target){marker.style.display='none';return}
 const rect=target.svg.getBoundingClientRect();if(!rect.width||!rect.height){marker.style.display='none';return}
 polishPrayerPoints(target);
 const hour=nowHour(),day=isDay(hour),t=phase(hour);let vx,vy,vw,vh;
 if(target.kind==='modern'){vw=340;vh=126;vx=qBezier(t,6,170,334);vy=qBezier(t,112,-18,112)-5}else{vw=420;vh=110;vx=qBezier(t,20,210,400);vy=qBezier(t,88,7,88)-6}
 marker.style.display='grid';marker.style.left=`${rect.left+(vx/vw)*rect.width}px`;marker.style.top=`${rect.top+(vy/vh)*rect.height}px`;
 marker.textContent=day?'☀︎':'☾';marker.style.fontSize=day?'19px':'21px';marker.style.color=day?'#E0B24E':'#F0EADB';marker.style.opacity='1';
 marker.style.textShadow=day?'0 0 8px rgba(224,178,78,.34),0 0 18px rgba(224,178,78,.12)':'0 0 8px rgba(240,234,219,.28)';
 marker.style.filter=day?'drop-shadow(0 1px 1px rgba(85,58,8,.14))':'drop-shadow(0 1px 1px rgba(0,0,0,.16))';
}
export function installCelestialArc(){
 const start=()=>{updateMarker();let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;updateMarker()})};const root=document.getElementById('root');const observer=new MutationObserver(schedule);if(root)observer.observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['style','class']});window.addEventListener('resize',schedule,{passive:true});window.addEventListener('scroll',schedule,{passive:true});['sakinah:feature','sakinah:global-root'].forEach(n=>window.addEventListener(n,schedule));setInterval(updateMarker,30000)};
 requestAnimationFrame(()=>requestAnimationFrame(start));
}
