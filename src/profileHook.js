const PROFILE_KEY = 'sakinah.profile.photo.v1';

function makeDefaultSvg() {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <rect width="128" height="128" rx="32" fill="#f3ead5"/>
      <circle cx="64" cy="50" r="24" fill="#b89443" opacity=".78"/>
      <path d="M28 106c5-23 20-35 36-35s31 12 36 35" fill="#b89443" opacity=".78"/>
    </svg>`)} `;
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const size = 320;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('canvas'));
        const scale = Math.max(size / img.width, size / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        resolve(canvas.toDataURL('image/jpeg', .86));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function ensureProfileHook() {
  const hero = document.querySelector('.sakinah-live-hero');
  if (!hero) return;
  if (hero.querySelector(':scope > .sakinah-profile-hook')) return;

  const wrap = document.createElement('div');
  wrap.className = 'sakinah-profile-hook';
  Object.assign(wrap.style, {
    position: 'absolute',
    top: '-28px',
    left: '22px',
    zIndex: '18',
    width: '74px',
    height: '74px',
    pointerEvents: 'auto'
  });

  const tail = document.createElement('div');
  Object.assign(tail.style, {
    position: 'absolute',
    left: '36px',
    top: '41px',
    width: '34px',
    height: '24px',
    borderLeft: '2px solid rgba(184,148,67,.58)',
    borderBottom: '2px solid rgba(184,148,67,.58)',
    borderBottomLeftRadius: '22px',
    transform: 'rotate(-18deg)',
    opacity: '.9',
    pointerEvents: 'none'
  });

  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-label', 'تغيير صورة البروفايل');
  Object.assign(button.style, {
    position: 'absolute',
    inset: '0 auto auto 0',
    width: '58px',
    height: '58px',
    padding: '0',
    border: '2px solid rgba(255,255,255,.72)',
    borderRadius: '22px 22px 22px 8px',
    overflow: 'hidden',
    background: 'rgba(255,255,255,.74)',
    boxShadow: '0 10px 26px rgba(37,31,20,.14)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    cursor: 'pointer'
  });

  const img = document.createElement('img');
  img.alt = '';
  img.src = localStorage.getItem(PROFILE_KEY) || makeDefaultSvg();
  Object.assign(img.style, {
    width: '100%',
    height: '100%',
    display: 'block',
    objectFit: 'cover'
  });
  button.appendChild(img);

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.hidden = true;

  button.addEventListener('click', () => input.click());
  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImage(file);
      localStorage.setItem(PROFILE_KEY, dataUrl);
      img.src = dataUrl;
    } catch {}
    input.value = '';
  });

  wrap.append(tail, button, input);
  hero.appendChild(wrap);
}

export function installProfileHook() {
  const start = () => {
    ensureProfileHook();
    const root = document.getElementById('root');
    const observer = new MutationObserver(() => ensureProfileHook());
    if (root) observer.observe(root, {subtree: true, childList: true});
  };
  requestAnimationFrame(() => requestAnimationFrame(start));
}
