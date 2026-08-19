const STYLE_ID = 'sakinah-global-back-buttons-style';
const BACK_CLASS = 'sakinah-global-back-button';
const FALLBACK_ID = 'sakinah-fallback-back-button';
const HIDDEN_CLASS = 'sakinah-back-hidden';

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .${BACK_CLASS} {
      min-height: 42px !important;
      min-width: 42px !important;
      box-sizing: border-box !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 8px !important;
      padding: 8px 13px !important;
      margin: 0 !important;
      border: 1px solid rgba(16,16,15,.08) !important;
      border-radius: 14px !important;
      background: rgba(255,255,255,.72) !important;
      color: #26343B !important;
      box-shadow: 0 5px 15px rgba(16,16,15,.055), inset 0 1px 0 rgba(255,255,255,.75) !important;
      -webkit-backdrop-filter: blur(12px) saturate(125%) !important;
      backdrop-filter: blur(12px) saturate(125%) !important;
      font-family: inherit !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      line-height: 1 !important;
      cursor: pointer !important;
      white-space: nowrap !important;
      appearance: none !important;
      -webkit-appearance: none !important;
      transition: transform .16s ease, background .16s ease, box-shadow .16s ease !important;
      touch-action: manipulation !important;
    }
    .${BACK_CLASS}:hover { background: rgba(255,255,255,.86) !important; }
    .${BACK_CLASS}:active { transform: scale(.96) !important; background: rgba(181,154,98,.13) !important; }
    .${BACK_CLASS}:focus-visible { outline: 2px solid rgba(181,154,98,.55) !important; outline-offset: 2px !important; }
    [dir="rtl"] .${BACK_CLASS} { direction: rtl !important; }
    [dir="ltr"] .${BACK_CLASS} { direction: ltr !important; }
    .${HIDDEN_CLASS} { display: none !important; }
    #${FALLBACK_ID} {
      position: fixed !important;
      top: 16px !important;
      inset-inline-start: 16px !important;
      z-index: 2147483590 !important;
    }
  `;
  document.head.appendChild(style);
}

function isBackButton(button) {
  if (!(button instanceof HTMLButtonElement)) return false;
  const text = (button.textContent || '').replace(/\s+/g, ' ').trim();
  const aria = (button.getAttribute('aria-label') || '').trim();
  if (!text && !aria) return false;
  const exact = /^(?:←\s*)?(?:رجوع|عودة|الأطفال|القرآن|الفهرس|Back|Kids|Quran|Index)(?:\s*→)?$/i;
  const beginsWithArrow = /^←\s*\S+/.test(text);
  const namedBack = /^(?:رجوع|عودة|Back)\b/i.test(text) || /^(?:رجوع|عودة|Back)$/i.test(aria);
  return exact.test(text) || beginsWithArrow || namedBack;
}

function decorate(root = document) {
  const buttons = root instanceof HTMLButtonElement ? [root] : root.querySelectorAll?.('button') || [];
  for (const button of buttons) if (isBackButton(button)) button.classList.add(BACK_CLASS);
}

function visible(el) {
  if (!el || !el.isConnected) return false;
  const s = getComputedStyle(el);
  if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) return false;
  return el.getClientRects().length > 0;
}

function pageIsHome() {
  const active = document.querySelector('.app-global-dock button.active');
  if (active && (active.getAttribute('aria-label') || '') === 'home') {
    const featureShell = document.querySelector('.global-feature-shell');
    if (!featureShell) return true;
  }
  return false;
}

function createFallback() {
  let b = document.getElementById(FALLBACK_ID);
  if (b) return b;
  b = document.createElement('button');
  b.id = FALLBACK_ID;
  b.type = 'button';
  b.className = BACK_CLASS;
  b.textContent = '← رجوع';
  b.setAttribute('aria-label', 'رجوع');
  b.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('sakinah:global-root'));
    window.dispatchEvent(new CustomEvent('sakinah:feature', { detail: 'home' }));
  });
  document.body.appendChild(b);
  return b;
}

function reconcile() {
  decorate(document);
  const fallback = document.getElementById(FALLBACK_ID);
  const all = [...document.querySelectorAll(`button.${BACK_CLASS}`)].filter(b => b.id !== FALLBACK_ID);
  all.forEach(b => b.classList.remove(HIDDEN_CLASS));

  const visibleButtons = all.filter(visible);
  const featureGlobal = visibleButtons.find(b => b.classList.contains('global-feature-back'));
  const internal = visibleButtons.filter(b => !b.classList.contains('global-feature-back'));

  // Prefer the page's own back action because it knows the correct previous screen.
  if (internal.length) {
    if (featureGlobal) featureGlobal.classList.add(HIDDEN_CLASS);
    internal.slice(1).forEach(b => b.classList.add(HIDDEN_CLASS));
    if (fallback) fallback.classList.add(HIDDEN_CLASS);
    return;
  }

  // If a feature page has no internal control, keep its existing global back.
  if (featureGlobal) {
    if (fallback) fallback.classList.add(HIDDEN_CLASS);
    return;
  }

  // Last safety net for any current or future non-home page with no back control.
  if (!pageIsHome()) {
    createFallback().classList.remove(HIDDEN_CLASS);
  } else if (fallback) {
    fallback.classList.add(HIDDEN_CLASS);
  }
}

export function installGlobalBackButtons() {
  ensureStyles();
  reconcile();
  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; reconcile(); });
  };

  const observer = new MutationObserver(schedule);
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class','style','aria-label'] });

  ['sakinah:feature','sakinah:native','sakinah:devotion','sakinah:global-root','popstate'].forEach(name => window.addEventListener(name, schedule));
  document.addEventListener('click', schedule, true);
}
