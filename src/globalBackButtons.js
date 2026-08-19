const STYLE_ID = 'sakinah-global-back-buttons-style';
const BACK_CLASS = 'sakinah-global-back-button';
const FALLBACK_ID = 'sakinah-fallback-back-button';
const HIDDEN_CLASS = 'sakinah-back-hidden';

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .${BACK_CLASS}{min-height:42px!important;min-width:42px!important;box-sizing:border-box!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;padding:8px 13px!important;margin:0!important;border:1px solid rgba(16,16,15,.08)!important;border-radius:14px!important;background:rgba(255,255,255,.72)!important;color:#26343B!important;box-shadow:0 5px 15px rgba(16,16,15,.055),inset 0 1px 0 rgba(255,255,255,.75)!important;backdrop-filter:blur(12px) saturate(125%)!important;font-family:inherit!important;font-size:13px!important;font-weight:600!important;line-height:1!important;cursor:pointer!important;white-space:nowrap!important}
    .${BACK_CLASS}:active{transform:scale(.96)!important}.sakinah-back-hidden{display:none!important}
    #${FALLBACK_ID}{position:fixed!important;top:16px!important;inset-inline-start:16px!important;z-index:2147483590!important}
  `;
  document.head.appendChild(style);
}

function isBackButton(button) {
  if (!(button instanceof HTMLButtonElement)) return false;
  const text=(button.textContent||'').replace(/\s+/g,' ').trim();
  const aria=(button.getAttribute('aria-label')||'').trim();
  const title=(button.getAttribute('title')||'').trim();
  const value=`${text} ${aria} ${title}`.trim();
  return /(?:^|\s)(?:←|‹|⟵|رجوع|عودة|Back)(?:\s|$)/i.test(value) || /^(?:الأطفال|القرآن|الفهرس|Kids|Quran|Index)\s*(?:←|‹|⟵)?$/i.test(text);
}
function decorate(root=document){const buttons=root instanceof HTMLButtonElement?[root]:root.querySelectorAll?.('button')||[];for(const b of buttons)if(isBackButton(b))b.classList.add(BACK_CLASS)}
function visible(el){if(!el||!el.isConnected)return false;const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&el.getClientRects().length>0}
function createFallback(){let b=document.getElementById(FALLBACK_ID);if(b)return b;b=document.createElement('button');b.id=FALLBACK_ID;b.type='button';b.className=BACK_CLASS;b.textContent='← رجوع';b.setAttribute('aria-label','رجوع');b.onclick=()=>{window.dispatchEvent(new CustomEvent('sakinah:global-root'));window.dispatchEvent(new CustomEvent('sakinah:feature',{detail:'home'}))};document.body.appendChild(b);return b}
function isHome(){return !document.querySelector('.global-feature-shell')&&!document.querySelector('[data-sakinah-screen="feature"]')}

function reconcile(){
  decorate(document);
  const fallback=document.getElementById(FALLBACK_ID);
  const all=[...document.querySelectorAll(`button.${BACK_CLASS}`)].filter(b=>b.id!==FALLBACK_ID);
  all.forEach(b=>b.classList.remove(HIDDEN_CLASS));
  const shown=all.filter(visible);
  if(shown.length){
    // The last visible back control is normally the deepest/current page control.
    // Keep exactly that one and suppress every parent/global duplicate.
    const winner=shown[shown.length-1];
    shown.forEach(b=>{if(b!==winner)b.classList.add(HIDDEN_CLASS)});
    if(fallback)fallback.classList.add(HIDDEN_CLASS);
    return;
  }
  if(!isHome())createFallback().classList.remove(HIDDEN_CLASS);else if(fallback)fallback.classList.add(HIDDEN_CLASS);
}

export function installGlobalBackButtons(){
  ensureStyles();reconcile();let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;reconcile()})};
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','aria-label','title']});
  ['sakinah:feature','sakinah:native','sakinah:devotion','sakinah:global-root','popstate'].forEach(n=>window.addEventListener(n,schedule));
  document.addEventListener('click',schedule,true);
}
