const STYLE_ID='sakinah-global-back-buttons-style';
const BACK_CLASS='sakinah-global-back-button';
const HIDDEN_CLASS='sakinah-back-hidden';
const BAR_ID='sakinah-back-bar';
const BAR_BUTTON_ID='sakinah-back-bar-button';
const TITLE_CLASS='sakinah-centered-page-title';
let activeTarget=null;

function ensureStyles(){
 if(document.getElementById(STYLE_ID))return;
 const s=document.createElement('style');
 s.id=STYLE_ID;
 s.textContent=`
 .${HIDDEN_CLASS}{display:none!important}
 .${TITLE_CLASS}{width:100%!important;box-sizing:border-box!important;text-align:center!important;margin-inline:auto!important}
 #${BAR_ID}{position:fixed!important;top:0!important;left:0!important;right:0!important;height:54px!important;z-index:2147483595!important;display:flex!important;align-items:center!important;padding:0 12px!important;box-sizing:border-box!important;background:rgba(246,243,236,.88)!important;border-bottom:1px solid rgba(16,16,15,.07)!important;box-shadow:0 5px 18px rgba(16,16,15,.045)!important;backdrop-filter:blur(18px) saturate(130%)!important;-webkit-backdrop-filter:blur(18px) saturate(130%)!important}
 #${BAR_ID}.${HIDDEN_CLASS}{display:none!important}
 #${BAR_BUTTON_ID}{height:36px!important;min-width:42px!important;padding:0 12px!important;border:1px solid rgba(16,16,15,.08)!important;border-radius:12px!important;background:rgba(255,255,255,.62)!important;color:#26343B!important;box-shadow:0 3px 10px rgba(16,16,15,.04)!important;font-family:inherit!important;font-size:12px!important;font-weight:600!important;line-height:1!important;cursor:pointer!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:7px!important}
 .global-feature-shell{padding-top:54px!important;box-sizing:border-box!important}
 .global-feature-shell>div[style*="position: absolute"],.global-feature-shell>div[style*="position:absolute"]{top:54px!important;bottom:0!important;height:auto!important;min-height:calc(100vh - 54px)!important;box-sizing:border-box!important}
 `;
 document.head.appendChild(s);
}

function isBackButton(b){
 if(!(b instanceof HTMLButtonElement))return false;
 if(b.id===BAR_BUTTON_ID)return false;
 const text=(b.textContent||'').replace(/\s+/g,' ').trim();
 const aria=(b.getAttribute('aria-label')||'').trim();
 const title=(b.getAttribute('title')||'').trim();
 const meta=`${aria} ${title}`.trim();
 const exactText=/^(?:رجوع|الرجوع|عودة|Back|←|→|‹|›|⟵|⟶|←\s*رجوع|رجوع\s*[←→]|Back\s*[←→]|[←→]\s*Back|سكينة\s*[←→]|[←→]\s*سكينة)$/i.test(text);
 const labelled=/\bback\b|رجوع|الرجوع|عودة/i.test(meta);
 const knownSection=/^(?:الأطفال|القرآن|الفهرس|Kids|Quran|Index)$/i.test(text);
 const globalClass=b.classList.contains('global-feature-back');
 return exactText||labelled||knownSection||globalClass;
}

function visible(e){
 if(!e||!e.isConnected)return false;
 const s=getComputedStyle(e);
 return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&e.getClientRects().length>0;
}

function ensureBar(){
 let bar=document.getElementById(BAR_ID);
 if(bar)return bar;
 bar=document.createElement('div');
 bar.id=BAR_ID;
 bar.setAttribute('role','navigation');
 bar.setAttribute('aria-label','شريط الرجوع');
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
 bar.appendChild(b);
 document.body.appendChild(bar);
 return bar;
}

function centerPrimaryTitles(){
 document.querySelectorAll(`.${TITLE_CLASS}`).forEach(el=>el.classList.remove(TITLE_CLASS));
 const nodes=[...document.querySelectorAll('h1,h2,h3,div')];
 nodes.forEach(el=>{
  if(!visible(el)||el.closest('button'))return;
  const text=(el.textContent||'').trim();
  if(!text||text.length>90)return;
  const s=getComputedStyle(el);
  const size=parseFloat(s.fontSize)||0;
  const rect=el.getBoundingClientRect();
  const fraunces=(s.fontFamily||'').toLowerCase().includes('fraunces');
  const headingTag=/^H[1-3]$/.test(el.tagName);
  if((fraunces||headingTag)&&size>=24&&rect.top>=42&&rect.top<=210&&rect.width>=120){
   el.classList.add(TITLE_CLASS);
  }
 });
}

function depth(el){let d=0;while(el?.parentElement){d++;el=el.parentElement}return d}

function reconcile(){
 ensureStyles();
 centerPrimaryTitles();
 const bar=ensureBar();
 const candidates=[...document.querySelectorAll('button')].filter(isBackButton).filter(b=>b.id!==BAR_BUTTON_ID);
 candidates.forEach(b=>b.classList.remove(HIDDEN_CLASS));
 const shown=candidates.filter(visible);
 const feature=document.querySelector('.global-feature-shell');
 if(!feature&&!shown.length){activeTarget=null;bar.classList.add(HIDDEN_CLASS);return}
 let winner=null;
 if(shown.length){winner=shown.reduce((best,b)=>!best||depth(b)>depth(best)?b:best,null)}
 activeTarget=winner;
 candidates.forEach(b=>b.classList.add(HIDDEN_CLASS));
 bar.classList.remove(HIDDEN_CLASS);
}

export function installGlobalBackButtons(){
 ensureStyles();
 reconcile();
 let queued=false;
 const run=()=>{
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;reconcile()});
 };
 new MutationObserver(run).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','aria-label','title']});
 ['sakinah:feature','sakinah:native','sakinah:devotion','sakinah:global-root','popstate','resize'].forEach(n=>window.addEventListener(n,run));
 document.addEventListener('click',run,true);
}
