const STYLE_ID='sakinah-title-scroll-morph-style';
const TITLE_CLASS='sakinah-centered-page-title';
let raf=0;
let activeTitle=null;
let activeScroller=null;
let baseRect=null;

function ensureStyle(){
  if(document.getElementById(STYLE_ID))return;
  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
    .${TITLE_CLASS}.sakinah-title-morphing{
      position:relative!important;
      z-index:2147483590!important;
      transform-origin:center center!important;
      will-change:transform,opacity!important;
      transition:none!important;
      backface-visibility:hidden!important;
    }
  `;
  document.head.appendChild(s);
}

function isScrollable(el){
  if(!(el instanceof HTMLElement))return false;
  const cs=getComputedStyle(el);
  const oy=cs.overflowY;
  return /(auto|scroll|overlay)/.test(oy)&&el.scrollHeight>el.clientHeight+4;
}

function findScroller(el){
  let p=el?.parentElement;
  while(p&&p!==document.body){
    if(isScrollable(p))return p;
    p=p.parentElement;
  }
  return document.scrollingElement||document.documentElement;
}

function visible(el){
  if(!el||!el.isConnected)return false;
  const r=el.getBoundingClientRect();
  const s=getComputedStyle(el);
  return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden';
}

function pickTitle(){
  const titles=[...document.querySelectorAll(`.${TITLE_CLASS}`)].filter(visible);
  if(!titles.length)return null;
  return titles.reduce((best,el)=>{
    const r=el.getBoundingClientRect();
    const score=Math.abs(r.top-110);
    if(!best||score<best.score)return {el,score};
    return best;
  },null)?.el||null;
}

function currentScrollTop(scroller){
  if(!scroller)return 0;
  if(scroller===document.scrollingElement||scroller===document.documentElement||scroller===document.body){
    return window.scrollY||document.documentElement.scrollTop||0;
  }
  return scroller.scrollTop||0;
}

function resetTitle(el){
  if(!el)return;
  el.classList.remove('sakinah-title-morphing');
  el.style.removeProperty('transform');
  el.style.removeProperty('opacity');
}

function bindTitle(title){
  if(activeTitle===title&&baseRect)return;
  resetTitle(activeTitle);
  activeTitle=title;
  activeScroller=findScroller(title);
  if(!title){baseRect=null;return;}
  title.classList.add('sakinah-title-morphing');
  title.style.setProperty('transform','none','important');
  baseRect=title.getBoundingClientRect();
}

function render(){
  const title=pickTitle();
  if(title!==activeTitle)bindTitle(title);
  if(!activeTitle||!baseRect){raf=requestAnimationFrame(render);return;}

  const y=currentScrollTop(activeScroller);
  const p=Math.max(0,Math.min(1,(y-10)/110));
  const eased=1-Math.pow(1-p,3);

  const live=activeTitle.getBoundingClientRect();
  const baseCenterX=baseRect.left+baseRect.width/2;
  const targetCenterX=window.innerWidth-22-baseRect.width*0.36;
  const targetCenterY=27;
  const baseCenterY=baseRect.top+baseRect.height/2;

  const dx=(targetCenterX-baseCenterX)*eased;
  const dy=(targetCenterY-baseCenterY)*eased;
  const scale=1-(0.28*eased);
  const opacity=1-(0.06*eased);

  activeTitle.style.setProperty('transform',`translate3d(${dx}px,${dy}px,0) scale(${scale})`,'important');
  activeTitle.style.setProperty('opacity',String(opacity),'important');

  raf=requestAnimationFrame(render);
}

export function installTitleScrollMorph(){
  ensureStyle();
  if(raf)cancelAnimationFrame(raf);
  const refresh=()=>{
    const t=pickTitle();
    if(t!==activeTitle)bindTitle(t);
    else if(t&&currentScrollTop(activeScroller)<=2){
      t.style.setProperty('transform','none','important');
      baseRect=t.getBoundingClientRect();
    }
  };
  const mo=new MutationObserver(()=>requestAnimationFrame(refresh));
  mo.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
  window.addEventListener('resize',refresh,{passive:true});
  document.addEventListener('scroll',refresh,true);
  refresh();
  raf=requestAnimationFrame(render);
  return()=>{
    if(raf)cancelAnimationFrame(raf);
    mo.disconnect();
    window.removeEventListener('resize',refresh);
    document.removeEventListener('scroll',refresh,true);
    resetTitle(activeTitle);
  };
}
