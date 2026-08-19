const PROFILE_KEY = 'sakinah.profile.photo.v1';

function makeDefaultSvg() {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
      <rect width="128" height="128" rx="36" fill="#f5eddc"/>
      <circle cx="64" cy="48" r="22" fill="#b89443" opacity=".82"/>
      <path d="M30 106c5-22 19-34 34-34s29 12 34 34" fill="#b89443" opacity=".82"/>
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
    position: 'absolute', top: '18px', left: '18px', zIndex: '18',
    width: '42px', height: '42px', pointerEvents: 'auto'
  });

  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-label', 'تغيير صورة البروفايل');
  Object.assign(button.style, {
    position: 'absolute', inset: '0', boxSizing: 'border-box',
    width: '42px', height: '42px', padding: '3px', margin: '0',
    border: '1px solid rgba(184,148,67,.22)', borderRadius: '13px',
    overflow: 'hidden', background: 'rgba(255,255,255,.70)',
    boxShadow: '0 4px 12px rgba(37,31,20,.10)',
    backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
    cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none',
    outline: 'none'
  });

  const img = document.createElement('img');
  img.alt = '';
  img.src = localStorage.getItem(PROFILE_KEY) || makeDefaultSvg();
  Object.assign(img.style, {
    width: '100%', height: '100%', display: 'block', objectFit: 'cover',
    borderRadius: '10px', pointerEvents: 'none'
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

  wrap.append(button, input);
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
