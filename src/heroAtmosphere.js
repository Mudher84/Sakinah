function getPreviewHour(hero){
  const slider=hero?.querySelector('input[type="range"][aria-label="معاينة وقت الهيرو"]');
  if(slider&&(document.activeElement===slider||slider.dataset.celestialPreview==='1'))return Number(slider.value);
  const d=new Date();return d.getHours()+d.getMinutes()/60;
}
function phase(hour){if(hour<5)return'night';if(hour<7)return'fajr';if(hour<11)return'morning';if(hour<15)return'noon';if(hour<18)return'afternoon';if(hour<20)return'sunset';return'night'}
function ensureStyle(){
  if(document.getElementById('sakinah-atmosphere-style'))return;
  const s=document.createElement('style');s.id='sakinah-atmosphere-style';s.textContent=`
  @keyframes mmCloudDrift{0%{transform:translate3d(-28px,0,0)}50%{transform:translate3d(22px,-2px,0)}100%{transform:translate3d(-28px,0,0)}}
  @keyframes mmCloudDrift2{0%{transform:translate3d(24px,0,0)}50%{transform:translate3d(-18px,2px,0)}100%{transform:translate3d(24px,0,0)}}
  @keyframes mmWindFlow{0%{transform:translateX(-18px);opacity:0}18%{opacity:.34}72%{opacity:.18}100%{transform:translateX(88px);opacity:0}}
  @keyframes mmWindFlowRtl{0%{transform:translateX(18px);opacity:0}18%{opacity:.28}72%{opacity:.14}100%{transform:translateX(-88px);opacity:0}}
  #sakinah-atmosphere-overlay .mm-atm-cloud{will-change:transform}
  #sakinah-atmosphere-overlay .mm-atm-wind{will-change:transform,opacity}
  @media(prefers-reduced-motion:reduce){#sakinah-atmosphere-overlay .mm-atm-cloud,#sakinah-atmosphere-overlay .mm-atm-wind{animation:none!important}}
  `;document.head.appendChild(s);
}
function ensureLayer(){
  ensureStyle();let layer=document.getElementById('sakinah-atmosphere-overlay');if(layer)return layer;
  layer=document.createElement('div');layer.id='sakinah-atmosphere-overlay';Object.assign(layer.style,{position:'fixed',left:'0',top:'0',width:'0',height:'0',overflow:'hidden',pointerEvents:'none',zIndex:'2147483520',borderRadius:'inherit',transition:'opacity 700ms ease,background 900ms ease'});document.body.appendChild(layer);return layer;
}
function targetHero(){return document.querySelector('.mm-reference-home .mm-reference-sheet>section:first-child')||document.querySelector('.sakinah-live-hero')}
function syncBounds(layer,hero){const r=hero.getBoundingClientRect();layer.style.left=`${r.left}px`;layer.style.top=`${r.top}px`;layer.style.width=`${r.width}px`;layer.style.height=`${r.height}px`;layer.style.borderRadius=getComputedStyle(hero).borderRadius;layer.style.display=r.bottom<0||r.top>innerHeight?'none':'block'}
function dot(x,y,s,o){const e=document.createElement('i');Object.assign(e.style,{position:'absolute',left:`${x}%`,top:`${y}%`,width:`${s}px`,height:`${s}px`,borderRadius:'50%',background:'rgba(255,255,255,.96)',opacity:String(o),boxShadow:'0 0 8px rgba(255,255,255,.42)'});return e}
function cloud(x,y,w,o,slow=false){const e=document.createElement('i');e.className='mm-atm-cloud';Object.assign(e.style,{position:'absolute',left:`${x}%`,top:`${y}%`,width:`${w}px`,height:`${Math.round(w*.22)}px`,borderRadius:'999px',background:'rgba(247,246,240,.82)',opacity:String(o),filter:'blur(3.5px)',boxShadow:`${Math.round(w*.20)}px -${Math.round(w*.07)}px 0 rgba(247,246,240,.68),${Math.round(w*.38)}px 1px 0 rgba(247,246,240,.42)`,animation:`${slow?'mmCloudDrift2':'mmCloudDrift'} ${slow?'18s':'14s'} ease-in-out infinite`});return e}
function wind(x,y,w,o,rtl=false,delay=0){const e=document.createElement('i');e.className='mm-atm-wind';Object.assign(e.style,{position:'absolute',left:`${x}%`,top:`${y}%`,width:`${w}px`,height:'1px',borderRadius:'999px',background:'linear-gradient(90deg,transparent,rgba(247,243,234,.9),transparent)',opacity:String(o),animation:`${rtl?'mmWindFlowRtl':'mmWindFlow'} ${7+delay}s linear ${delay*.35}s infinite`});const tail=document.createElement('b');Object.assign(tail.style,{position:'absolute',right:'8%',top:'4px',width:'55%',height:'1px',borderRadius:'999px',background:'linear-gradient(90deg,transparent,rgba(247,243,234,.5),transparent)'});e.appendChild(tail);return e}
function paint(layer,p){
  if(layer.dataset.phase===p)return;layer.dataset.phase=p;layer.replaceChildren();layer.style.background='transparent';
  if(p==='night'){
    [[8,12,2.2,.52],[18,20,1.5,.4],[30,9,1.8,.48],[48,15,1.4,.34],[66,10,1.8,.46],[84,24,1.5,.34],[93,13,1.8,.44]].forEach(v=>layer.appendChild(dot(...v)));
    layer.appendChild(cloud(6,31,78,.10,true));layer.appendChild(wind(8,49,78,.12,true,1));layer.appendChild(wind(55,38,64,.09,true,2));
    layer.style.background='radial-gradient(circle at 82% 15%,rgba(214,224,255,.08),transparent 27%)';
  }else if(p==='fajr'){
    layer.appendChild(cloud(4,24,96,.20));layer.appendChild(cloud(58,38,72,.12,true));layer.appendChild(wind(5,48,86,.20,false,1));layer.appendChild(wind(48,33,72,.13,false,2));
    layer.style.background='radial-gradient(circle at 78% 16%,rgba(255,207,151,.16),transparent 34%)';
  }else if(p==='morning'){
    layer.appendChild(cloud(2,22,100,.18));layer.appendChild(cloud(62,36,74,.11,true));layer.appendChild(wind(4,50,92,.22,false,1));layer.appendChild(wind(46,31,70,.14,false,2));layer.appendChild(wind(18,40,62,.10,false,3));
    layer.style.background='radial-gradient(circle at 78% 14%,rgba(255,222,130,.15),transparent 31%)';
  }else if(p==='noon'){
    layer.appendChild(cloud(8,28,72,.09,true));layer.appendChild(wind(8,44,88,.15,false,1));layer.appendChild(wind(53,30,62,.10,false,2));
    layer.style.background='radial-gradient(circle at 74% 12%,rgba(255,245,197,.14),transparent 29%)';
  }else if(p==='afternoon'){
    layer.appendChild(cloud(3,24,102,.17));layer.appendChild(cloud(63,39,76,.10,true));layer.appendChild(wind(4,49,94,.23,false,1));layer.appendChild(wind(44,34,78,.15,false,2));layer.appendChild(wind(17,41,58,.10,false,3));
    layer.style.background='radial-gradient(circle at 72% 17%,rgba(255,198,122,.12),transparent 33%)';
  }else if(p==='sunset'){
    layer.appendChild(cloud(5,27,102,.15));layer.appendChild(cloud(61,39,72,.09,true));layer.appendChild(wind(4,49,92,.18,false,1));layer.appendChild(wind(48,35,72,.12,false,2));
    layer.style.background='radial-gradient(circle at 72% 23%,rgba(255,151,86,.16),transparent 34%),linear-gradient(180deg,transparent 58%,rgba(255,112,72,.05))';
  }
}
function render(){const hero=targetHero(),layer=ensureLayer();if(!hero){layer.style.display='none';return}syncBounds(layer,hero);paint(layer,phase(getPreviewHour(hero)))}
export function installHeroAtmosphere(){
  const start=()=>{render();const root=document.getElementById('root');const mo=new MutationObserver(()=>requestAnimationFrame(render));if(root)mo.observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['style','class']});document.addEventListener('input',e=>{if(e.target?.matches?.('input[type="range"][aria-label="معاينة وقت الهيرو"]'))requestAnimationFrame(render)},true);document.addEventListener('click',e=>{if(e.target?.textContent?.trim()==='الآن')requestAnimationFrame(()=>requestAnimationFrame(render))},true);addEventListener('scroll',render,{passive:true});addEventListener('resize',render,{passive:true});setInterval(render,60000)};requestAnimationFrame(()=>requestAnimationFrame(start));
}
