function phase(hour){if(hour<5)return'night';if(hour<7)return'fajr';if(hour<11)return'morning';if(hour<15)return'noon';if(hour<18)return'afternoon';if(hour<20)return'sunset';return'night'}
function ensureLayer(){let layer=document.getElementById('sakinah-atmosphere-overlay');if(layer)return layer;layer=document.createElement('div');layer.id='sakinah-atmosphere-overlay';Object.assign(layer.style,{position:'fixed',left:'0',top:'0',width:'0',height:'0',overflow:'hidden',pointerEvents:'none',zIndex:'2147483540',borderRadius:'inherit'});document.body.appendChild(layer);return layer}
function cloud(x,y,w,o,delay=0){const e=document.createElement('i');Object.assign(e.style,{position:'absolute',left:`${x}%`,top:`${y}%`,width:`${w}px`,height:`${Math.round(w*.20)}px`,borderRadius:'999px',background:'rgba(238,244,248,.72)',opacity:String(o),filter:'blur(3.4px)',boxShadow:`${Math.round(w*.17)}px -${Math.round(w*.055)}px 0 rgba(238,244,248,.46),${Math.round(w*.32)}px 2px 0 rgba(238,244,248,.25)`,animation:`mmCloudDrift ${22+delay}s ease-in-out ${delay}s infinite alternate`});return e}
function wind(x,y,w,o,delay=0){const e=document.createElement('i');Object.assign(e.style,{position:'absolute',left:`${x}%`,top:`${y}%`,width:`${w}px`,height:'18px',opacity:String(o),borderTop:'1px solid rgba(238,244,248,.42)',borderRadius:'50%',transform:'skewX(-12deg)',animation:`mmWindMove ${10+delay}s ease-in-out ${delay}s infinite alternate`});return e}
function leaf(x,y,o,delay=0){const e=document.createElement('i');Object.assign(e.style,{position:'absolute',left:`${x}%`,top:`${y}%`,width:'7px',height:'4px',borderRadius:'80% 20% 80% 20%',background:'rgba(214,167,70,.64)',opacity:String(o),transform:'rotate(-24deg)',animation:`mmLeafFloat ${12+delay}s linear ${delay}s infinite`});return e}
function sync(layer,hero){const r=hero.getBoundingClientRect();layer.style.left=`${r.left}px`;layer.style.top=`${r.top}px`;layer.style.width=`${r.width}px`;layer.style.height=`${r.height}px`;layer.style.display=r.bottom<0||r.top>innerHeight?'none':'block';layer.style.borderRadius=getComputedStyle(hero).borderRadius}
function paint(layer,p){
 if(layer.dataset.phase===p)return;layer.dataset.phase=p;layer.replaceChildren();const day=p!=='night';
 const a=day?.16:.07;
 layer.append(
  cloud(-12,23,100,a,0),cloud(78,25,82,a*.72,5),
  cloud(-8,56,76,a*.60,3),cloud(84,52,66,a*.50,7),
  wind(-5,35,92,day?.18:.07,0),wind(72,34,82,day?.16:.06,4),
  leaf(14,32,day?.45:.12,1),leaf(86,37,day?.38:.10,4),leaf(24,48,day?.28:.08,7)
 );
 if(p==='sunset')layer.append(cloud(73,45,92,.12,2));
 if(p==='night')layer.append(cloud(2,43,72,.055,1));
}
function render(){const hero=document.querySelector('.mm-prayer-hero')||document.querySelector('.sakinah-live-hero');const layer=ensureLayer();if(!hero){layer.style.display='none';return}sync(layer,hero);const d=new Date();paint(layer,phase(d.getHours()+d.getMinutes()/60))}
export function installHeroAtmosphere(){
 if(!document.getElementById('mm-weather-keyframes')){const s=document.createElement('style');s.id='mm-weather-keyframes';s.textContent='@keyframes mmCloudDrift{from{transform:translateX(-6px)}to{transform:translateX(14px)}}@keyframes mmWindMove{from{transform:translateX(-5px) skewX(-12deg);opacity:.28}to{transform:translateX(14px) skewX(-12deg);opacity:.62}}@keyframes mmLeafFloat{0%{transform:translate(0,0) rotate(-24deg)}50%{transform:translate(24px,8px) rotate(20deg)}100%{transform:translate(48px,2px) rotate(62deg)}}';document.head.appendChild(s)}
 const start=()=>{render();const root=document.getElementById('root');const mo=new MutationObserver(()=>requestAnimationFrame(render));if(root)mo.observe(root,{subtree:true,childList:true});addEventListener('scroll',render,{passive:true});addEventListener('resize',render,{passive:true});setInterval(render,60000)};requestAnimationFrame(()=>requestAnimationFrame(start));
}
