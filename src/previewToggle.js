let hideTimer = null;

function findPreview(hero) {
  const slider = hero?.querySelector('input[type="range"][aria-label="معاينة وقت الهيرو"]');
  return slider?.closest('div[style*="margin-bottom"]') || slider?.parentElement?.parentElement || null;
}

function ensureToggle(hero, panel) {
  let button = hero.querySelector(':scope > .sakinah-preview-toggle');
  if (button) return button;
  button = document.createElement('button');
  button.type = 'button';
  button.className = 'sakinah-preview-toggle';
  button.textContent = '◷';
  button.setAttribute('aria-label', 'معاينة الوقت');
  Object.assign(button.style, {
    position: 'absolute',
    top: '18px',
    right: '20px',
    zIndex: '12',
    width: '42px',
    height: '42px',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,.24)',
    background: 'rgba(255,255,255,.12)',
    color: 'inherit',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    cursor: 'pointer',
    fontSize: '18px',
    transition: 'opacity .35s ease, transform .35s ease, background .35s ease'
  });
  hero.appendChild(button);

  const hidePanel = () => {
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(-8px) scale(.985)';
    panel.style.pointerEvents = 'none';
    setTimeout(() => {
      button.style.pointerEvents = 'auto';
      button.style.opacity = '1';
      button.style.transform = 'scale(1)';
    }, 360);
  };

  const scheduleHide = () => {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hidePanel, 3200);
  };

  const showPanel = () => {
    clearTimeout(hideTimer);
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(-8px) scale(.985)';
    panel.style.pointerEvents = 'auto';
    button.style.opacity = '0';
    button.style.transform = 'scale(.92)';
    button.style.pointerEvents = 'none';
    requestAnimationFrame(() => {
      panel.style.opacity = '1';
      panel.style.transform = 'translateY(0) scale(1)';
    });
    scheduleHide();
  };

  panel.addEventListener('pointerdown', scheduleHide, true);
  panel.addEventListener('input', scheduleHide, true);
  panel.addEventListener('click', scheduleHide, true);
  button.addEventListener('click', showPanel);
  hidePanel();
  return button;
}

function apply() {
  const hero = document.querySelector('.sakinah-live-hero');
  if (!hero) return;
  const panel = findPreview(hero);
  if (!panel) return;
  if (panel.dataset.previewToggleReady === '1') return;
  panel.dataset.previewToggleReady = '1';

  /* Keep the preview permanently out of document flow so opening/closing it
     never changes hero height or moves the prayer time/content. */
  Object.assign(panel.style, {
    position: 'absolute',
    top: '12px',
    left: '14px',
    right: '14px',
    width: 'auto',
    margin: '0',
    boxSizing: 'border-box',
    zIndex: '11',
    display: 'block',
    opacity: '0',
    pointerEvents: 'none',
    transition: 'opacity .35s ease, transform .35s ease',
    transform: 'translateY(-8px) scale(.985)',
    transformOrigin: 'top center'
  });

  ensureToggle(hero, panel);
}

export function installPreviewToggle() {
  const start = () => {
    apply();
    const root = document.getElementById('root');
    const observer = new MutationObserver(() => apply());
    if (root) observer.observe(root, {subtree:true, childList:true});
  };
  requestAnimationFrame(() => requestAnimationFrame(start));
}
