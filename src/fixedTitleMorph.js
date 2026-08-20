const STYLE_ID='sakinah-fixed-title-morph-style';
const CLONE_ID='sakinah-fixed-title-morph-clone';
const TITLE_SELECTOR='.sakinah-centered-page-title';
let title=null,scroller=null,clone=null,start=null,raf=0,observer=null;

function ensureStyle(){
 if(document.getElementById(STYLE_ID))return;
 const s=document.createElement('style');
 s.id=STYLE_ID;
 s.textContent=`
 ${TITLE_SELECTOR}{transform:none!important;translate:none!important;position:static!important;inset:auto!important;will-change:auto!important}
 #${CLONE_ID}{position:fixed!important;z-index:2147483646!important;margin:0!important;padding:0!important;border:0!important;background:transparent!important;pointer-events:none!important;user-select:none!important;white-space:nowrap!important;overflow:visible!important;text-overflow:clip!important;transform-origin:center center!important;will-change:left,top,transform,opacity!important;contain:layout style paint!important}
 `;
 document.head.appendChild(s);
}
function visible(el){if(!el||!el.isConnected)return false;const cs=getComputedStyle(el);const r=el.getBoundingClientRect();return cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>1&&r.height>1}
function scrollable(el){if(!el||el===document.body)return false;const cs=getComputedStyle(el);return /(auto|scroll|overlay)/.test(cs.overflowY)&&el.scrollHeight>el.clientHeight+6}
function findScroller(el){for(let p=el?.parentElement;p;p=p.parentElement)if(scrollable(p))return p;return document.scrollingElement||document.documentElement}
function topOf(s){if(!s||s===document.scrollingElement||s===document.documentElement||s===document.body)return window.scrollY||document.documentElement.scrollTop||0;return s.scrollTop||0}
function pickTitle(){
 const all=[...document.querySelectorAll(TITLE_SELECTOR)].filter(visible).filter(el=>!el.closest('#sakinah-back-bar'));
 if(!all.length)return null;
 return all.reduce((best,el)=>{const r=el.getBoundingClientRect();const score=Math.abs(r.top-110)+(r.height>90?1000:0);if(!best)return {el,score};return score<best.score?{el,score}:best},null)?.el||null;
}
function cleanupClone(){if(clone?.isConnected)clone.remove();clone=null}
function reset(){
 if(title?.isConnected){title.style.removeProperty('opacity');title.style.removeProperty('visibility')}
 title=null;scroller=null;start=null;cleanupClone();
}
function makeClone(el){
 cleanupClone();
 const c=document.createElement('div');c.id=CLONE_ID;c.textContent=(el.textContent||'').trim();
 const cs=getComputedStyle(el);
 for(const p of ['fontFamily','fontSize','fontWeight','fontStyle','lineHeight','letterSpacing','color','direction','textAlign','textTransform'])c.style[p]=cs[p];
 document.body.appendChild(c);return c;
}
function freeSideTarget(width,height){
 const bar=document.getElementById('sakinah-back-bar');
 const back=document.getElementById('sakinah-back-bar-button');
 const backVisible=back&&visible(back);
 const y=bar?bar.getBoundingClientRect().top+(bar.getBoundingClientRect().height-height)/2:(54-height)/2;
 const pad=16;
 // In RTL the back button normally occupies the right side, so collapse to the free left side.
 const x=backVisible?pad:Math.max(pad,window.innerWidth-width-pad);
 return {x,y};
}
function capture(){
 const el=pickTitle();
 if(!el){reset();return false}
 const r=el.getBoundingClientRect();
 if(r.top<48||r.top>300){return false}
 title=el;scroller=findScroller(el);clone=makeClone(el);
 const cr=clone.getBoundingClientRect();
 start={left:r.left,top:r.top,width:r.width,height:r.height,scroll:topOf(scroller),fontSize:parseFloat(getComputedStyle(el).fontSize)||28,cloneW:cr.width||r.width,cloneH:cr.height||r.height};
 clone.style.left=`${r.left+(r.width-(cr.width||r.width))/2}px`;
 clone.style.top=`${r.top+(r.height-(cr.height||r.height))/2}px`;
 clone.style.opacity='0';
 return true;
}
function render(){
 raf=0;
 if(!title?.isConnected||!clone?.isConnected||!start){capture();if(!start)return}
 const delta=Math.max(0,topOf(scroller)-start.scroll);
 const p=Math.max(0,Math.min(1,delta/128));
 const eased=1-Math.pow(1-p,3);
 const targetScale=Math.max(.50,Math.min(.66,15/start.fontSize));
 const scale=1-(1-targetScale)*eased;
 const cw=start.cloneW*scale,ch=start.cloneH*scale;
 const target=freeSideTarget(cw,ch);
 const sx=start.left+(start.width-start.cloneW)/2;
 const sy=start.top+(start.height-start.cloneH)/2;
 const x=sx+(target.x-sx)*eased;
 const y=sy+(target.y-sy)*eased;
 clone.style.left=`${x}px`;clone.style.top=`${y}px`;clone.style.transform=`scale(${scale})`;
 clone.style.opacity=p<.015?'0':String(Math.min(1,p*2.7));
 title.style.setProperty('opacity',String(Math.max(0,1-p*1.8)),'important');
 if(p<=.002){title.style.removeProperty('opacity');clone.style.opacity='0'}
}
function schedule(){if(!raf)raf=requestAnimationFrame(render)}
function recaptureSoon(){
 requestAnimationFrame(()=>requestAnimationFrame(()=>{const next=pickTitle();if(next!==title||!start||topOf(scroller)<=3){reset();capture()}schedule()}));
}
export function installFixedTitleMorph(){
 ensureStyle();
 recaptureSoon();
 document.addEventListener('scroll',schedule,true);
 window.addEventListener('resize',recaptureSoon,{passive:true});
 ['sakinah:feature','sakinah:native','sakinah:devotion','sakinah:global-root','popstate'].forEach(n=>window.addEventListener(n,recaptureSoon));
 document.addEventListener('click',()=>setTimeout(recaptureSoon,80),true);
 observer=new MutationObserver(()=>{if(!title?.isConnected||!document.querySelector(TITLE_SELECTOR))recaptureSoon()});
 observer.observe(document.body,{childList:true,subtree:true});
 return ()=>{document.removeEventListener('scroll',schedule,true);window.removeEventListener('resize',recaptureSoon);observer?.disconnect();reset()};
}
