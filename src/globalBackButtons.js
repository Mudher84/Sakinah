const STYLE_ID='muslim-mirror-global-back-style';
const HIDDEN_CLASS='muslim-mirror-back-hidden';
const BAR_ID='sakinah-back-bar';
const BAR_BUTTON_ID='sakinah-back-bar-button';
let activeTarget=null;

function ensureStyles(){
 if(document.getElementById(STYLE_ID))return;
 const s=document.createElement('style');
 s.id=STYLE_ID;
 s.textContent=`
 .${HIDDEN_CLASS}{display:none!important}
 #${BAR_ID}{position:fixed!important;top:0!important;left:0!important;right:0!important;height:42px!important;z-index:2147483595!important;display:none!important;align-items:center!important;justify-content:flex-start!important;padding:0 9px!important;box-sizing:border-box!important;background:rgba(246,243,236,.94)!important;border-bottom:1px solid rgba(16,16,15,.055)!important;box-shadow:0 3px 12px rgba(16,16,15,.035)!important;backdrop-filter:blur(18px) saturate(130%)!important;-webkit-backdrop-filter:blur(18px) saturate(130%)!important}
 #${BAR_ID}[data-visible="true"]{display:flex!important}
 #${BAR_BUTTON_ID}{height:30px!important;min-width:34px!important;padding:0 10px!important;border:1px solid rgba(16,16,15,.07)!important;border-radius:10px!important;background:rgba(255,255,255,.56)!important;color:#26343B!important;box-shadow:0 2px 7px rgba(16,16,15,.035)!important;font-family:inherit!important;font-size:10px!important;font-weight:500!important;line-height:1!important;cursor:pointer!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:5px!important}
 #${BAR_BUTTON_ID}.${HIDDEN_CLASS}{display:none!important}
 body{padding-top:0!important;box-sizing:border-box!important}
 body.mm-has-global-back-bar{padding-top:42px!important}
 .global-feature-shell{box-sizing:border-box!important}
 button[aria-label="أنا"],button[aria-label="تغيير صورة البروفايل"],button[aria-label="Change profile image"]{border-radius:50%!important;border:0!important;outline:0!important;box-shadow:none!important;filter:none!important;overflow:hidden!important;padding:0!important}
 button[aria-label="أنا"] img,button[aria-label="تغيير صورة البروفايل"] img,button[aria-label="Change profile image"] img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:50%!important;display:block!important;border:0!important;outline:0!important;box-shadow:none!important;filter:none!important}
 `;
 document.head.appendChild(s);
}

function isBackButton(b){
 if(!(b instanceof HTMLButtonElement)||b.id===BAR_BUTTON_ID)return false;
 const text=(b.textContent||'').replace(/\s+/g,' ').trim();
 const aria=(b.getAttribute('aria-label')||'').trim();
 const title=(b.getAttribute('title')||'').trim();
 const meta=`${aria} ${title}`.trim();
 const exact=/^(?:رجوع|الرجوع|عودة|Back|←|→|‹|›|⟵|⟶|←\s*رجوع|رجوع\s*[←→]|Back\s*[←→]|[←→]\s*Back)$/i.test(text);
 const labelled=/\bback\b|رجوع|الرجوع|عودة/i.test(meta);
 return exact||labelled||b.classList.contains('global-feature-back');
}
function visible(el){
 if(!el||!el.isConnected)return false;
 const s=getComputedStyle(el);
 return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&el.getClientRects().length>0;
}
function depth(el){let d=0;while(el?.parentElement){d++;el=el.parentElement}return d}
function ensureBar(){
 let bar=document.getElementById(BAR_ID);
 if(bar)return bar;
 bar=document.createElement('div');
 bar.id=BAR_ID;
 bar.setAttribute('role','navigation');
 bar.setAttribute('aria-label','زر الرجوع العام');
 const b=document.createElement('button');
 b.id=BAR_BUTTON_ID;
 b.type='button';
 b.innerHTML='<span aria-hidden="true">→</span><span>رجوع</span>';
 b.setAttribute('aria-label','رجوع');
 b.onclick=()=>{
  const target=activeTarget;
  if(target&&target.isConnected){target.click();return}
  window.dispatchEvent(new CustomEvent('sakinah:global-root'));
  window.dispatchEvent(new CustomEvent('sakinah:feature',{detail:'home'}));
 };
 bar.appendChild(b);document.body.appendChild(bar);return bar;
}
function reconcile(){
 ensureStyles();const bar=ensureBar();
 const candidates=[...document.querySelectorAll('button')].filter(isBackButton).filter(b=>b.id!==BAR_BUTTON_ID);
 candidates.forEach(b=>b.classList.remove(HIDDEN_CLASS));
 const shown=candidates.filter(visible);
 activeTarget=shown.length?shown.reduce((best,b)=>!best||depth(b)>depth(best)?b:best,null):null;
 candidates.forEach(b=>b.classList.add(HIDDEN_CLASS));
 const feature=document.querySelector('.global-feature-shell');
 const onHome=!!document.querySelector('.mm-reference-home');
 const shouldShow=!onHome&&(!!feature||!!activeTarget);
 bar.dataset.visible=shouldShow?'true':'false';
 document.body.classList.toggle('mm-has-global-back-bar',shouldShow);
 const globalBack=bar.querySelector(`#${BAR_BUTTON_ID}`);
 globalBack.classList.toggle(HIDDEN_CLASS,!shouldShow);
}
export function installGlobalBackButtons(){
 reconcile();let queued=false;
 const run=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;reconcile()})};
 new MutationObserver(run).observe(document.body,{childList:true,subtree:true});
 ['sakinah:feature','sakinah:native','sakinah:devotion','sakinah:global-root','popstate','resize'].forEach(n=>window.addEventListener(n,run));
 document.addEventListener('click',run,true);
}
