const OVERLAY_ID='sakinah-scroll-title-motion';
const STYLE_ID='sakinah-scroll-title-motion-style';
const TITLE_CLASS='sakinah-centered-page-title';
let activeTitle=null;
let baseline=null;
let scroller=null;
let raf=0;
let queued=false;

const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>1-Math.pow(1-clamp(t),3);

function ensureStyle(){
 if(document.getElementById(STYLE_ID))return;
 const s=document.createElement('style');
 s.id=STYLE_ID;
 s.textContent=`
 #${OVERLAY_ID}{position:fixed;z-index:2147483597;left:0;top:0;margin:0;pointer-events:none;user-select:none;white-space:nowrap;transform-origin:0 0;will-change:transform,opacity;line-height:1.1;text-align:center}
 .sakinah-title-motion-source{color:transparent!important;text-shadow:none!important}
 `;
 document.head.appendChild(s);
}

function ensureOverlay(){
 let el=document.getElementById(OVERLAY_ID);
 if(el)return el;
 el=document.createElement('div');
 el.id=OVERLAY_ID;
 el.setAttribute('aria-hidden','true');
 document.body.appendChild(el);
 return el;
}

function isVisible(el){
 if(!el?.isConnected)return false;
 const cs=getComputedStyle(el),r=el.getBoundingClientRect();
 return cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>0&&r.height>0;
}

function findTitle(){
 const list=[...document.querySelectorAll(`.${TITLE_CLASS}`)].filter(isVisible);
 if(!list.length)return null;
 return list.reduce((best,el)=>{
   const r=el.getBoundingClientRect();
   if(!best)return el;
   const br=best.getBoundingClientRect();
   return Math.abs(r.top-100)<Math.abs(br.top-100)?el:best;
 },null);
}

function findScroller(el){
 let p=el?.parentElement;
 while(p&&p!==document.body){
   const cs=getComputedStyle(p);
   if(/auto|scroll/.test(cs.overflowY)&&p.scrollHeight>p.clientHeight+4)return p;
   p=p.parentElement;
 }
 return document.scrollingElement||document.documentElement;
}

function scrollTopOf(s){
 if(!s||s===document.documentElement||s===document.body||s===document.scrollingElement)return window.scrollY||document.documentElement.scrollTop||0;
 return s.scrollTop||0;
}

function copyLook(from,to){
 const cs=getComputedStyle(from);
 to.textContent=(from.textContent||'').replace(/\s+/g,' ').trim();
 to.style.fontFamily=cs.fontFamily;
 to.style.fontWeight=cs.fontWeight;
 to.style.fontStyle=cs.fontStyle;
 to.style.fontSize=cs.fontSize;
 to.style.letterSpacing=cs.letterSpacing;
 to.style.color=cs.color;
 to.style.direction=cs.direction;
}

function activate(title){
 if(activeTitle===title&&baseline)return;
 if(activeTitle)activeTitle.classList.remove('sakinah-title-motion-source');
 activeTitle=title;
 baseline=null;
 scroller=null;
 const overlay=ensureOverlay();
 if(!title){overlay.style.opacity='0';return}
 scroller=findScroller(title);
 const r=title.getBoundingClientRect();
 baseline={left:r.left,top:r.top,width:r.width,height:r.height,scroll:scrollTopOf(scroller)};
 copyLook(title,overlay);
 title.classList.add('sakinah-title-motion-source');
 update();
}

function update(){
 raf=0;
 const title=findTitle();
 if(title!==activeTitle)activate(title);
 if(!activeTitle||!baseline)return;
 const overlay=ensureOverlay();
 copyLook(activeTitle,overlay);
 const raw=(scrollTopOf(scroller)-baseline.scroll)/118;
 const p=ease(clamp(raw));
 const targetRight=Math.max(18,Math.min(32,window.innerWidth*.045));
 const targetTop=17;
 const targetScale=0.62;
 const targetLeft=window.innerWidth-targetRight-baseline.width*targetScale;
 const x=lerp(baseline.left,targetLeft,p);
 const y=lerp(baseline.top,targetTop,p);
 const scale=lerp(1,targetScale,p);
 overlay.style.opacity='1';
 overlay.style.transform=`translate3d(${x}px,${y}px,0) scale(${scale})`;
}

function schedule(){
 if(queued)return;
 queued=true;
 requestAnimationFrame(()=>{queued=false;update()});
}

export function installScrollTitleMotion(){
 ensureStyle();
 ensureOverlay();
 schedule();
 document.addEventListener('scroll',schedule,true);
 window.addEventListener('resize',()=>{baseline=null;schedule()});
 ['sakinah:feature','sakinah:native','sakinah:devotion','sakinah:global-root','popstate'].forEach(n=>window.addEventListener(n,()=>{baseline=null;schedule()}));
 new MutationObserver(()=>schedule()).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
}
