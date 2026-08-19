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
    zIndex: '8',
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

  const showPanel = () => {
    clearTimeout(hideTimer);
    panel.style.display = '';
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(-6px) scale(.985)';
    panel.style.pointerEvents = 'auto';
    button.style.opacity = '0';
    button.style.pointerEvents = 'none';
    requestAnimationFrame(() => {
      panel.style.opacity = '1';
      panel.style.transform = 'translateY(0) scale(1)';
    });
    const scheduleHide = () => {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(hidePanel, 3200);
    };
    panel.onpointerdown = scheduleHide;
    panel.oninput = scheduleHide;
    panel.onclick = scheduleHide;
    scheduleHide();
  };

  const hidePanel = () => {
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(-6px) scale(.985)';
    panel.style.pointerEvents = 'none';
    setTimeout(() => {
      panel.style.display = 'none';
      button.style.pointerEvents = 'auto';
      button.style.opacity = '1';
    }, 360);
  };

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
  panel.style.transition = 'opacity .35s ease, transform .35s ease';
  panel.style.transformOrigin = 'top center';
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
