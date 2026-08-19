function qBezier(t, p0, p1, p2) {
  const u = 1 - t;
  return u * u * p0 + 2 * u * t * p1 + t * t * p2;
}

function currentPreviewHour(hero) {
  const slider = hero?.querySelector('input[type="range"][aria-label="معاينة وقت الهيرو"]');
  if (slider && slider.dataset.celestialPreview === '1') return Number(slider.value);
  const d = new Date();
  return d.getHours() + d.getMinutes() / 60;
}

function isDay(hour) {
  return hour >= 6 && hour < 18;
}

function markerT(hour) {
  if (isDay(hour)) return Math.max(0, Math.min(1, (hour - 6) / 12));
  const nightHour = hour >= 18 ? hour - 18 : hour + 6;
  return Math.max(0, Math.min(1, nightHour / 12));
}

function ensureMarker() {
  let marker = document.getElementById('sakinah-celestial-marker');
  if (marker) return marker;

  marker = document.createElement('div');
  marker.id = 'sakinah-celestial-marker';
  marker.setAttribute('aria-hidden', 'true');
  Object.assign(marker.style, {
    position: 'fixed',
    zIndex: '65000',
    width: '34px',
    height: '34px',
    display: 'grid',
    placeItems: 'center',
    pointerEvents: 'none',
    transform: 'translate(-50%,-50%)',
    transition: 'left .45s ease, top .45s ease, color .45s ease, filter .45s ease',
    fontFamily: 'Georgia, serif',
    fontSize: '27px',
    lineHeight: '1'
  });
  document.body.appendChild(marker);
  return marker;
}

function updateMarker() {
  const hero = document.querySelector('.sakinah-live-hero');
  const svg = hero?.querySelector('svg[viewBox="0 0 420 110"]');
  const marker = ensureMarker();

  if (!hero || !svg) {
    marker.style.display = 'none';
    return;
  }

  const rect = svg.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    marker.style.display = 'none';
    return;
  }

  const hour = currentPreviewHour(hero);
  const day = isDay(hour);
  const t = markerT(hour);

  // Match DayArc's SVG quadratic path: M20 88 Q210 -14 400 88.
  const vx = qBezier(t, 20, 210, 400);
  const vy = qBezier(t, 88, -14, 88);
  const x = rect.left + (vx / 420) * rect.width;
  const y = rect.top + (vy / 110) * rect.height;

  marker.style.display = 'grid';
  marker.style.left = `${x}px`;
  marker.style.top = `${y}px`;
  marker.textContent = day ? '☀' : '☾';
  marker.style.color = day ? '#B89443' : '#F0E9D7';
  marker.style.textShadow = day
    ? '0 0 7px rgba(205,166,78,.38), 0 0 18px rgba(205,166,78,.18)'
    : '0 0 8px rgba(240,233,215,.36), 0 0 18px rgba(240,233,215,.16)';
  marker.style.filter = day ? 'drop-shadow(0 1px 1px rgba(93,68,18,.12))' : 'drop-shadow(0 1px 1px rgba(0,0,0,.18))';
}

export function installCelestialArc() {
  const start = () => {
    updateMarker();

    const root = document.getElementById('root');
    const observer = new MutationObserver(() => requestAnimationFrame(updateMarker));
    if (root) observer.observe(root, {subtree:true, childList:true});

    document.addEventListener('input', e => {
      if (e.target?.matches?.('input[type="range"][aria-label="معاينة وقت الهيرو"]')) {
        e.target.dataset.celestialPreview = '1';
        requestAnimationFrame(updateMarker);
      }
    }, true);

    document.addEventListener('click', e => {
      if (e.target?.textContent?.trim() === 'الآن') {
        const slider = document.querySelector('input[type="range"][aria-label="معاينة وقت الهيرو"]');
        if (slider) delete slider.dataset.celestialPreview;
        requestAnimationFrame(updateMarker);
      }
    }, true);

    window.addEventListener('resize', updateMarker, {passive:true});
    window.addEventListener('scroll', updateMarker, {passive:true});
    setInterval(updateMarker, 30000);
  };

  requestAnimationFrame(() => requestAnimationFrame(start));
}
