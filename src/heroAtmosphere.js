function getPreviewHour(hero) {
  const slider = hero?.querySelector('input[type="range"][aria-label="معاينة وقت الهيرو"]');
  if (slider && (document.activeElement === slider || slider.dataset.celestialPreview === '1')) return Number(slider.value);
  const d = new Date();
  return d.getHours() + d.getMinutes() / 60;
}

function phase(hour) {
  if (hour < 5) return 'night';
  if (hour < 7) return 'fajr';
  if (hour < 11) return 'morning';
  if (hour < 15) return 'noon';
  if (hour < 18) return 'afternoon';
  if (hour < 20) return 'sunset';
  return 'night';
}

function makeLayer(hero) {
  let layer = hero.querySelector(':scope > .sakinah-atmosphere-layer');
  if (layer) return layer;
  layer = document.createElement('div');
  layer.className = 'sakinah-atmosphere-layer';
  Object.assign(layer.style, {
    position: 'absolute', inset: '0', overflow: 'hidden', pointerEvents: 'none', zIndex: '0',
    transition: 'opacity 900ms ease, background 1200ms ease'
  });
  hero.prepend(layer);
  [...hero.children].forEach(el => {
    if (el !== layer && el instanceof HTMLElement && !el.style.zIndex) {
      el.style.position = el.style.position || 'relative';
      el.style.zIndex = '1';
    }
  });
  return layer;
}

function star(x,y,s,o) {
  const e=document.createElement('i');
  Object.assign(e.style,{position:'absolute',left:`${x}%`,top:`${y}%`,width:`${s}px`,height:`${s}px`,borderRadius:'50%',background:'rgba(255,255,255,.9)',opacity:String(o),boxShadow:'0 0 8px rgba(255,255,255,.35)'});
  return e;
}
function cloud(x,y,w,o) {
  const e=document.createElement('i');
  Object.assign(e.style,{position:'absolute',left:`${x}%`,top:`${y}%`,width:`${w}px`,height:`${Math.round(w*.28)}px`,borderRadius:'999px',background:'rgba(255,255,255,.42)',opacity:String(o),filter:'blur(5px)',boxShadow:`${Math.round(w*.22)}px -${Math.round(w*.08)}px 0 rgba(255,255,255,.28), ${Math.round(w*.42)}px 2px 0 rgba(255,255,255,.20)`});
  return e;
}

function render() {
  const hero = document.querySelector('.sakinah-live-hero');
  if (!hero) return;
  const layer = makeLayer(hero);
  const p = phase(getPreviewHour(hero));
  if (layer.dataset.phase === p) return;
  layer.dataset.phase = p;
  layer.replaceChildren();
  layer.style.background = 'transparent';

  if (p === 'night') {
    [[10,12,2,0.42],[20,24,1.5,0.32],[31,9,2,0.4],[44,18,1.5,0.28],[58,10,2,0.35],[72,22,1.5,0.3],[84,13,2,0.38],[91,30,1.5,0.24],[16,39,1.5,0.2],[67,39,1.5,0.22]].forEach(v=>layer.appendChild(star(...v)));
    layer.style.background='radial-gradient(circle at 78% 14%,rgba(230,236,255,.05),transparent 28%)';
  } else if (p === 'fajr') {
    layer.style.background='radial-gradient(circle at 78% 10%,rgba(255,210,156,.16),transparent 32%)';
    layer.appendChild(cloud(8,18,78,0.09));
  } else if (p === 'morning') {
    layer.style.background='radial-gradient(circle at 78% 8%,rgba(255,218,120,.22),transparent 30%)';
    layer.appendChild(cloud(7,17,86,0.11));
    layer.appendChild(cloud(62,31,64,0.07));
  } else if (p === 'noon') {
    layer.style.background='radial-gradient(circle at 76% 8%,rgba(255,245,203,.30),transparent 27%)';
    layer.appendChild(cloud(12,24,64,0.06));
  } else if (p === 'afternoon') {
    layer.style.background='radial-gradient(circle at 76% 12%,rgba(255,206,135,.18),transparent 32%)';
    layer.appendChild(cloud(9,20,92,0.09));
    layer.appendChild(cloud(66,34,70,0.06));
  } else if (p === 'sunset') {
    layer.style.background='radial-gradient(circle at 76% 18%,rgba(255,157,91,.22),transparent 34%),linear-gradient(180deg,transparent 58%,rgba(255,120,80,.05))';
    layer.appendChild(cloud(12,23,92,0.08));
  }
}

export function installHeroAtmosphere() {
  const start=()=>{
    render();
    const root=document.getElementById('root');
    const mo=new MutationObserver(()=>render());
    if(root) mo.observe(root,{subtree:true,childList:true});
    document.addEventListener('input',e=>{if(e.target?.matches?.('input[type="range"][aria-label="معاينة وقت الهيرو"]'))requestAnimationFrame(render)},true);
    document.addEventListener('click',e=>{if(e.target?.textContent?.trim()==='الآن')requestAnimationFrame(()=>requestAnimationFrame(render))},true);
    setInterval(render,60000);
  };
  requestAnimationFrame(()=>requestAnimationFrame(start));
}
