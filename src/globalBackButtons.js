const STYLE_ID='sakinah-global-back-buttons-style';
const BACK_CLASS='sakinah-global-back-button';
const HIDDEN_CLASS='sakinah-back-hidden';
const BAR_ID='sakinah-back-bar';
const BAR_BUTTON_ID='sakinah-back-bar-button';
const BRAND_ID='sakinah-global-brand';
const INLINE_BRAND_CLASS='sakinah-inline-brand-hidden';
const INLINE_AR_BRAND_CLASS='sakinah-inline-arabic-brand-centered';
const TITLE_CLASS='sakinah-centered-page-title';
let activeTarget=null;

function ensureStyles(){
 if(document.getElementById(STYLE_ID))return;
 const s=document.createElement('style');
 s.id=STYLE_ID;
 s.textContent=`
 .${HIDDEN_CLASS}{display:none!important}
 .${INLINE_BRAND_CLASS}{display:none!important}
 .${INLINE_AR_BRAND_CLASS}{display:block!important;position:static!important;inset:auto!important;width:100%!important;max-width:none!important;box-sizing:border-box!important;text-align:center!important;margin:0 auto 12px!important;transform:none!important;translate:none!important;animation:none!important;transition:none!important;opacity:1!important;visibility:visible!important;will-change:auto!important}
 .${TITLE_CLASS}{display:block!important;width:100%!important;max-width:none!important;box-sizing:border-box!important;text-align:center!important;margin-left:auto!important;margin-right:auto!important;margin-inline:auto!important;transform:none!important}
 button[aria-label="أنا"],button[aria-label="تغيير صورة البروفايل"],button[aria-label="Change profile image"]{border-radius:50%!important;border:0!important;outline:0!important;box-shadow:none!important;filter:none!important;overflow:hidden!important;padding:0!important}
 button[aria-label="أنا"] img,button[aria-label="تغيير صورة البروفايل"] img,button[aria-label="Change profile image"] img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:50%!important;display:block!important;border:0!important;outline:0!important;box-shadow:none!important;filter:none!important}
 #${BAR_ID}{position:fixed!important;top:0!important;left:0!important;right:0!important;height:54px!important;z-index:2147483595!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:0 12px!important;box-sizing:border-box!important;background:rgba(246,243,236,.92)!important;border-bottom:1px solid rgba(16,16,15,.07)!important;box-shadow:0 5px 18px rgba(16,16,15,.045)!important;backdrop-filter:blur(18px) saturate(130%)!important;-webkit-backdrop-filter:blur(18px) saturate(130%)!important}
 #${BAR_BUTTON_ID}{position:absolute!important;inset-inline-start:12px!important;height:36px!important;min-width:42px!important;padding:0 12px!important;border:1px solid rgba(16,16,15,.08)!important;border-radius:12px!important;background:rgba(255,255,255,.62)!important;color:#26343B!important;box-shadow:0 3px 10px rgba(16,16,15,.04)!important;font-family:inherit!important;font-size:12px!important;font-weight:600!important;line-height:1!important;cursor:pointer!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:7px!important}
 #${BAR_BUTTON_ID}.${HIDDEN_CLASS}{display:none!important}
 #${BRAND_ID}{position:absolute!important;left:50%!important;top:50%!important;transform:translate(-50%,-50%)!important;margin:0!important;pointer-events:none!important;user-select:none!important;font-family:Georgia,'Times New Roman',serif!important;font-size:14px!important;font-weight:500!important;letter-spacing:2px!important;line-height:1!important;color:#B43B35!important;text-transform:uppercase!important;animation:none!important;transition:none!important;opacity:1!important;visibility:visible!important;will-change:auto!important}
 body{padding-top:54px!important;box-sizing:border-box!important}
 .global-feature-shell{padding-top:0!important;box-sizing:border-box!important}
 .global-feature-shell>div[style*="position: absolute"],.global-feature-shell>div[style*="position:absolute"]{top:0!important;bottom:0!important;height:auto!important;min-height:calc(100vh - 54px)!important;box-sizing:border-box!important}
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
 bar.setAttribute('aria-label','شريط سكينة العالمي');
 const brand=document.createElement('div');
 brand.id=BRAND_ID;
 brand.textContent='SAKINAH';
 brand.setAttribute('aria-label','SAKINAH');
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
 bar.appendChild(brand);
 bar.appendChild(b);
 document.body.appendChild(bar);
 return bar;
}

function normalizeInlineBrands(){
 document.querySelectorAll(`.${INLINE_BRAND_CLASS}`).forEach(el=>el.classList.remove(INLINE_BRAND_CLASS));
 document.querySelectorAll(`.${INLINE_AR_BRAND_CLASS}`).forEach(el=>el.classList.remove(INLINE_AR_BRAND_CLASS));
 const nodes=[...document.querySelectorAll('div,span,p,small')];
 nodes.forEach(el=>{
  if(el.id===BRAND_ID||el.closest(`#${BAR_ID}`)||el.children.length)return;
  const text=(el.textContent||'').replace(/\s+/g,' ').trim();
  if(text==='SAKINAH')el.classList.add(INLINE_BRAND_CLASS);
  if(text==='سكينة'&&!el.closest('button'))el.classList.add(INLINE_AR_BRAND_CLASS);
 });
}

function centerPrimaryTitles(){
 document.querySelectorAll(`.${TITLE_CLASS}`).forEach(el=>el.classList.remove(TITLE_CLASS));
 const nodes=[...document.querySelectorAll('h1,h2,h3,div')];
 nodes.forEach(el=>{
  if(!visible(el)||el.closest('button')||el.id===BAR_ID||el.id===BRAND_ID)return;
  const text=(el.textContent||'').replace(/\s+/g,' ').trim();
  if(!text||text.length>60)return;
  const s=getComputedStyle(el);
  const size=parseFloat(s.fontSize)||0;
  const rect=el.getBoundingClientRect();
  const headingTag=/^H[1-3]$/.test(el.tagName);
  const likelyPageTitle=size>=23&&rect.height<=88;
  const inHeaderZone=rect.top>=45&&rect.top<=260;
  if(inHeaderZone&&(headingTag||likelyPageTitle))el.classList.add(TITLE_CLASS);
 });
}

function depth(el){let d=0;while(el?.parentElement){d++;el=el.parentElement}return d}

function reconcile(){
 ensureStyles();
 const bar=ensureBar();
 normalizeInlineBrands();
 centerPrimaryTitles();
 const candidates=[...document.querySelectorAll('button')].filter(isBackButton).filter(b=>b.id!==BAR_BUTTON_ID);
 candidates.forEach(b=>b.classList.remove(HIDDEN_CLASS));
 const shown=candidates.filter(visible);
 const feature=document.querySelector('.global-feature-shell');
 let winner=null;
 if(shown.length)winner=shown.reduce((best,b)=>!best||depth(b)>depth(best)?b:best,null);
 activeTarget=winner;
 candidates.forEach(b=>b.classList.add(HIDDEN_CLASS));
 const globalBack=bar.querySelector(`#${BAR_BUTTON_ID}`);
 if(feature||winner)globalBack.classList.remove(HIDDEN_CLASS);else globalBack.classList.add(HIDDEN_CLASS);
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