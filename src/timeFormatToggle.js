const KEY='sakinah-hour-format';
let format=localStorage.getItem(KEY)==='12'?'12':'24';
let applying=false;

function parse24(text){
 const m=String(text||'').trim().match(/^(\d{1,2}):(\d{2})(?:\s*[صم])?$/);
 if(!m)return null;
 const h=Number(m[1]),min=m[2];
 if(!Number.isFinite(h)||h<0||h>23)return null;
 return {h,min};
}
function to12(h,min){
 const suffix=h<12?'ص':'م';
 const hour=h%12||12;
 return `${hour}:${min} ${suffix}`;
}
function to24(h,min){return `${String(h).padStart(2,'0')}:${min}`;}

function rawValue(el){
 if(el.dataset.sakinahRawTime)return el.dataset.sakinahRawTime;
 const p=parse24(el.textContent);
 if(!p)return null;
 const raw=to24(p.h,p.min);
 el.dataset.sakinahRawTime=raw;
 return raw;
}
function formatElement(el){
 if(!(el instanceof HTMLElement))return;
 const raw=rawValue(el); if(!raw)return;
 const p=parse24(raw); if(!p)return;
 const next=format==='12'?to12(p.h,p.min):to24(p.h,p.min);
 if(el.textContent!==next){applying=true;el.textContent=next;applying=false;}
}
function applyTimes(){
 const hero=document.querySelector('.sakinah-live-hero');
 if(!hero)return;
 hero.querySelectorAll('div,span').forEach(el=>{
   if(el.children.length===0 && parse24(el.textContent)) formatElement(el);
 });
 updateToggle(hero);
}
function updateToggle(hero){
 let box=hero.querySelector('[data-sakinah-hour-toggle]');
 if(!box){
   const preview=hero.querySelector('input[type="range"][aria-label="معاينة وقت الهيرو"]')?.parentElement;
   if(!preview)return;
   box=document.createElement('div');
   box.dataset.sakinahHourToggle='1';
   Object.assign(box.style,{display:'flex',gap:'6px',alignItems:'center',justifyContent:'center',marginTop:'8px',position:'relative',zIndex:'3'});
   for(const value of ['12','24']){
     const b=document.createElement('button');
     b.type='button'; b.dataset.hour=value; b.textContent=value;
     Object.assign(b.style,{minWidth:'38px',height:'28px',borderRadius:'10px',border:'1px solid rgba(255,255,255,.22)',fontFamily:'inherit',cursor:'pointer'});
     b.addEventListener('click',()=>{format=value;localStorage.setItem(KEY,value);applyTimes();});
     box.appendChild(b);
   }
   preview.appendChild(box);
 }
 box.querySelectorAll('button').forEach(b=>{
   const on=b.dataset.hour===format;
   b.style.background=on?'rgba(181,154,98,.28)':'rgba(255,255,255,.10)';
   b.style.color='inherit';
   b.style.fontWeight=on?'700':'500';
 });
}

export function installTimeFormatToggle(){
 const start=()=>{
  applyTimes();
  const root=document.getElementById('root');
  const mo=new MutationObserver(()=>{if(!applying)requestAnimationFrame(applyTimes)});
  if(root)mo.observe(root,{subtree:true,childList:true,characterData:true});
  setInterval(applyTimes,30000);
 };
 requestAnimationFrame(()=>requestAnimationFrame(start));
}
