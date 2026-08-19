const QURAN_TEXT_SELECTOR = [
  '[style*="Amiri Quran"]',
  '.ayah span',
  '.mushaf .ayah span',
  '.quranAudioText',
  '.quranMemo'
].join(',');

const expected = new WeakMap();
let observer = null;
let applying = false;

function hasReadableText(el) {
  const text = Array.from(el.childNodes || [])
    .filter(node => node.nodeType === Node.TEXT_NODE)
    .map(node => node.textContent || '')
    .join(' ')
    .trim();
  return /[\p{L}\p{N}]/u.test(text);
}

function isQuranText(el) {
  return !!el.closest?.(QURAN_TEXT_SELECTOR);
}

function boostElement(el) {
  if (!(el instanceof HTMLElement) || isQuranText(el) || !hasReadableText(el)) return;
  const size = parseFloat(getComputedStyle(el).fontSize);
  if (!Number.isFinite(size)) return;

  const target = expected.get(el);
  if (target != null) {
    if (Math.abs(size - target) > 0.25) {
      applying = true;
      el.style.fontSize = `${target}px`;
      applying = false;
    }
    return;
  }

  const boosted = size + 4;
  expected.set(el, boosted);
  applying = true;
  el.style.fontSize = `${boosted}px`;
  applying = false;
}

function scan(root) {
  if (!root) return;
  if (root instanceof HTMLElement) boostElement(root);
  root.querySelectorAll?.('*').forEach(boostElement);
}

export function installTypographyBoost() {
  const start = () => {
    const root = document.getElementById('root');
    if (!root) return;
    scan(root);
    observer?.disconnect();
    observer = new MutationObserver(mutations => {
      if (applying) return;
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node instanceof HTMLElement) scan(node);
          });
        } else if (mutation.type === 'attributes' && mutation.target instanceof HTMLElement) {
          boostElement(mutation.target);
        }
      }
    });
    observer.observe(root, {subtree:true, childList:true, attributes:true, attributeFilter:['style','class']});
  };

  requestAnimationFrame(() => requestAnimationFrame(start));
}
