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

function ensureLayer() {
  let layer = document.getElementById('sakinah-atmosphere-overlay');
  if (layer) return layer;
  layer = document.createElement('div');
  layer.id = 'sakinah-atmosphere-overlay';
  Object.assign(layer.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    width: '0',
    height: '0',
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: '25000',
    borderRadius: 'inherit',
    transition: 'opacity 700ms ease, background 900ms ease'
  });
  document.body.appendChild(layer);
  return layer;
}

function syncBounds(layer, hero) {
  const r = hero.getBoundingClientRect();
  layer.style.left = `${r.left}px`;
  layer.style.top = `${r.top}px`;
  layer.style.width = `${r.width}px`;
  layer.style.height = `${r.height}px`;
  layer.style.display = r.bottom < 0 || r.top > innerHeight ? 'none' : 'block';
}

function dot(x,y,s,o) {
  const e=document.createElement('i');
  Object.assign(e.style,{position:'absolute',left:`${x}%`,top:`${y}%`,width:`${s}px`,height:`${s}px`,borderRadius:'50%',background:'rgba(255,255,255,.96)',opacity:String(o),boxShadow:'0 0 10px rgba(255,255,255,.5)'});
  return e;
}

function cloud(x,y,w,o) {
  const e=document.createElement('i');
  Object.assign(e.style,{position:'absolute',left:`${x}%`,top:`${y}%`,width:`${w}px`,height:`${Math.round(w*.24)}px`,borderRadius:'999px',background:'rgba(255,255,255,.72)',opacity:String(o),filter:'blur(4px)',boxShadow:`${Math.round(w*.20)}px -${Math.round(w*.07)}px 0 rgba(255,255,255,.55), ${Math.round(w*.38)}px 2px 0 rgba(255,255,255,.36)`});
  return e;
}

function sun(x,y,size,o) {
  const e=document.createElement('i');
  Object.assign(e.style,{position:'absolute',left:`${x}%`,top:`${y}%`,width:`${size}px`,height:`${size}px`,transform:'translate(-50%,-50%)',borderRadius:'50%',background:'rgba(255,219,126,.92)',opacity:String(o),boxShadow:'0 0 26px rgba(255,213,111,.58),0 0 70px rgba(255,213,111,.22)'});
  return e;
}

function moon(x,y,size,o) {
  const e=document.createElement('i');
  Object.assign(e.style,{position:'absolute',left:`${x}%`,top:`${y}%`,width:`${size}px`,height:`${size}px`,transform:'translate(-50%,-50%)',borderRadius:'50%',background:'rgba(245,241,226,.92)',opacity:String(o),boxShadow:'0 0 24px rgba(235,240,255,.22)'});
  const cut=document.createElement('b');
  Object.assign(cut.style,{position:'absolute',width:`${Math.round(size*.82)}px`,height:`${Math.round(size*.82)}px`,borderRadius:'50%',left:`${Math.round(size*.30)}px`,top:`-${Math.round(size*.08)}px`,background:'rgba(18,24,34,.97)'});
  e.appendChild(cut);
  return e;
}

function paint(layer,p) {
  if (layer.dataset.phase === p) return;
  layer.dataset.phase = p;
  layer.replaceChildren();
  layer.style.background = 'transparent';

  if (p === 'night') {
    [[8,12,2.4,.70],[16,22,1.7,.55],[26,10,2.1,.68],[37,18,1.5,.46],[49,9,2.1,.58],[61,24,1.7,.48],[74,12,2.3,.65],[86,28,1.7,.45],[92,14,2.0,.60],[20,38,1.4,.40],[55,34,1.5,.38],[79,41,1.4,.34]].forEach(v=>layer.appendChild(dot(...v)));
    layer.appendChild(moon(86,16,22,.66));
    layer.style.background='radial-gradient(circle at 84% 16%,rgba(210,222,255,.10),transparent 25%)';
  } else if (p === 'fajr') {
    layer.appendChild(sun(82,16,28,.35));
    layer.appendChild(cloud(8,21,88,.18));
    layer.style.background='radial-gradient(circle at 82% 16%,rgba(255,210,156,.20),transparent 31%)';
  } else if (p === 'morning') {
    layer.appendChild(sun(82,14,34,.62));
    layer.appendChild(cloud(5,19,92,.20));
    layer.appendChild(cloud(61,31,70,.13));
    layer.style.background='radial-gradient(circle at 82% 14%,rgba(255,223,130,.28),transparent 31%)';
  } else if (p === 'noon') {
    layer.appendChild(sun(76,12,38,.72));
    layer.appendChild(cloud(10,27,68,.10));
    layer.style.background='radial-gradient(circle at 76% 12%,rgba(255,246,200,.34),transparent 29%)';
  } else if (p === 'afternoon') {
    layer.appendChild(sun(72,17,34,.55));
    layer.appendChild(cloud(7,20,96,.18));
    layer.appendChild(cloud(65,35,74,.11));
    layer.style.background='radial-gradient(circle at 72% 17%,rgba(255,199,124,.24),transparent 33%)';
  } else if (p === 'sunset') {
    layer.appendChild(sun(73,23,32,.48));
    layer.appendChild(cloud(11,25,98,.16));
    layer.style.background='radial-gradient(circle at 73% 23%,rgba(255,151,86,.28),transparent 34%),linear-gradient(180deg,transparent 58%,rgba(255,112,72,.08))';
  }
}

function render() {
  const hero = document.querySelector('.sakinah-live-hero');
  const layer = ensureLayer();
  if (!hero) { layer.style.display='none'; return; }
  syncBounds(layer,hero);
  paint(layer,phase(getPreviewHour(hero)));
}

export function installHeroAtmosphere() {
  const start=()=>{
    render();
    const root=document.getElementById('root');
    const mo=new MutationObserver(()=>requestAnimationFrame(render));
    if(root) mo.observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['style','class']});
    document.addEventListener('input',e=>{if(e.target?.matches?.('input[type="range"][aria-label="معاينة وقت الهيرو"]'))requestAnimationFrame(render)},true);
    document.addEventListener('click',e=>{if(e.target?.textContent?.trim()==='الآن')requestAnimationFrame(()=>requestAnimationFrame(render))},true);
    addEventListener('scroll',render,{passive:true});
    addEventListener('resize',render,{passive:true});
    setInterval(render,60000);
  };
  requestAnimationFrame(()=>requestAnimationFrame(start));
}
