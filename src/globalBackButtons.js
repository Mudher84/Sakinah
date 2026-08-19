const STYLE_ID = 'sakinah-global-back-buttons-style';
const BACK_CLASS = 'sakinah-global-back-button';

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
      background: rgba(255,255,255,.66) !important;
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
    .${BACK_CLASS}:hover {
      background: rgba(255,255,255,.82) !important;
      box-shadow: 0 7px 18px rgba(16,16,15,.075), inset 0 1px 0 rgba(255,255,255,.9) !important;
    }
    .${BACK_CLASS}:active {
      transform: scale(.96) !important;
      background: rgba(181,154,98,.13) !important;
    }
    .${BACK_CLASS}:focus-visible {
      outline: 2px solid rgba(181,154,98,.55) !important;
      outline-offset: 2px !important;
    }
    [dir="rtl"] .${BACK_CLASS} { direction: rtl !important; }
    [dir="ltr"] .${BACK_CLASS} { direction: ltr !important; }
  `;
  document.head.appendChild(style);
}

function isBackButton(button) {
  if (!(button instanceof HTMLButtonElement)) return false;
  const text = (button.textContent || '').replace(/\s+/g, ' ').trim();
  const aria = (button.getAttribute('aria-label') || '').trim();
  if (!text && !aria) return false;

  const exact = /^(?:←\s*)?(?:رجوع|عودة|الأطفال|Back|Kids)(?:\s*→)?$/i;
  const beginsWithArrow = /^←\s*\S+/.test(text);
  const namedBack = /^(?:رجوع|عودة|Back)\b/i.test(text) || /^(?:رجوع|عودة|Back)$/i.test(aria);
  return exact.test(text) || beginsWithArrow || namedBack;
}

function decorate(root = document) {
  const buttons = root instanceof HTMLButtonElement ? [root] : root.querySelectorAll?.('button') || [];
  for (const button of buttons) {
    if (isBackButton(button)) button.classList.add(BACK_CLASS);
  }
}

export function installGlobalBackButtons() {
  ensureStyles();
  decorate(document);

  const observer = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue;
        decorate(node);
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
