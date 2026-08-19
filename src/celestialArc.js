const SVG_NS = 'http://www.w3.org/2000/svg';

function qBezier(t, p0, p1, p2) {
  const u = 1 - t;
  return u * u * p0 + 2 * u * t * p1 + t * t * p2;
}

function currentPreviewHour(hero) {
  const slider = hero?.querySelector('input[type="range"][aria-label="معاينة وقت الهيرو"]');
  if (slider && document.activeElement === slider) return Number(slider.value);
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

function ensureMarker(svg) {
  let g = svg.querySelector('[data-sakinah-celestial]');
  if (g) return g;

  g = document.createElementNS(SVG_NS, 'g');
  g.setAttribute('data-sakinah-celestial', '1');
  g.style.transition = 'transform .55s ease';
  g.style.pointerEvents = 'none';

  const glow = document.createElementNS(SVG_NS, 'circle');
  glow.setAttribute('r', '15');
  glow.setAttribute('fill', 'rgba(181,154,98,.12)');
  glow.setAttribute('data-role', 'glow');

  const body = document.createElementNS(SVG_NS, 'circle');
  body.setAttribute('r', '8');
  body.setAttribute('fill', '#C9A85C');
  body.setAttribute('data-role', 'body');

  const rays = document.createElementNS(SVG_NS, 'g');
  rays.setAttribute('data-role', 'rays');
  for (let i = 0; i < 8; i++) {
    const line = document.createElementNS(SVG_NS, 'line');
    const a = (Math.PI * 2 * i) / 8;
    line.setAttribute('x1', String(Math.cos(a) * 11));
    line.setAttribute('y1', String(Math.sin(a) * 11));
    line.setAttribute('x2', String(Math.cos(a) * 15));
    line.setAttribute('y2', String(Math.sin(a) * 15));
    line.setAttribute('stroke', '#C9A85C');
    line.setAttribute('stroke-width', '1.5');
    line.setAttribute('stroke-linecap', 'round');
    rays.appendChild(line);
  }

  const moonCut = document.createElementNS(SVG_NS, 'circle');
  moonCut.setAttribute('r', '7');
  moonCut.setAttribute('cx', '4');
  moonCut.setAttribute('cy', '-2');
  moonCut.setAttribute('data-role', 'moon-cut');

  g.append(glow, rays, body, moonCut);
  svg.appendChild(g);
  return g;
}

function updateMarker() {
  const hero = document.querySelector('.sakinah-live-hero');
  const svg = hero?.querySelector('svg[viewBox="0 0 420 110"]');
  if (!hero || !svg) return;

  const hour = currentPreviewHour(hero);
  const day = isDay(hour);
  const t = markerT(hour);
  const x = qBezier(t, 20, 210, 400);
  const y = qBezier(t, 88, -14, 88);
  const g = ensureMarker(svg);

  g.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
  const body = g.querySelector('[data-role="body"]');
  const rays = g.querySelector('[data-role="rays"]');
  const cut = g.querySelector('[data-role="moon-cut"]');
  const glow = g.querySelector('[data-role="glow"]');

  if (day) {
    body?.setAttribute('fill', '#C9A85C');
    if (rays) rays.style.display = '';
    if (cut) cut.style.display = 'none';
    glow?.setAttribute('fill', 'rgba(201,168,92,.16)');
  } else {
    body?.setAttribute('fill', '#EDE7D7');
    if (rays) rays.style.display = 'none';
    if (cut) {
      cut.style.display = '';
      cut.setAttribute('fill', '#171727');
    }
    glow?.setAttribute('fill', 'rgba(237,231,215,.12)');
  }
}

export function installCelestialArc() {
  const start = () => {
    updateMarker();
    const root = document.getElementById('root');
    const observer = new MutationObserver(() => updateMarker());
    if (root) observer.observe(root, {subtree:true, childList:true});

    document.addEventListener('input', e => {
      if (e.target?.matches?.('input[type="range"][aria-label="معاينة وقت الهيرو"]')) {
        e.target.dataset.celestialPreview = '1';
        updateMarker();
      }
    }, true);

    document.addEventListener('click', e => {
      if (e.target?.textContent?.trim() === 'الآن') {
        const slider = document.querySelector('input[type="range"][aria-label="معاينة وقت الهيرو"]');
        if (slider) delete slider.dataset.celestialPreview;
        requestAnimationFrame(updateMarker);
      }
    }, true);

    setInterval(updateMarker, 60000);
  };

  requestAnimationFrame(() => requestAnimationFrame(start));
}
