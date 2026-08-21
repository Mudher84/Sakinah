const ROW_RX=/برنامج الجمعة اليوم|تأمل اليوم|ورد القرآن.*21|أذكار الصباح|أوقات العبادة|سجل الصلاة|السفر والتنبيهات|المؤذن والتنبيهات|أقرب مسجد/i;
const QURAN_CATEGORY_RX=/القرآن الكريم وعلومه|Quran(?:ic)?\s+(?:Sciences|Knowledge)/i;
const QURAN_SVG='<svg viewBox="0 0 24 24" aria-hidden="true"><path class="qci-book" d="M4.4 5.7c2.9-.8 5.4-.3 7.6 1.4v12c-2.4-1.4-5-1.8-7.6-1z"/><path class="qci-book qci-book-alt" d="M19.6 5.7c-2.9-.8-5.4-.3-7.6 1.4v12c2.4-1.4 5-1.8 7.6-1z"/><path class="qci-line" d="M12 7.1v12M7.3 9.4c1.4-.2 2.6.1 3.6.7M16.7 9.4c-1.4-.2-2.6.1-3.6.7"/><path class="qci-gold" d="m12 4.2.75 1.2 1.35.35-1 .95.2 1.4-1.3-.65-1.3.65.2-1.4-1-.95 1.35-.35z"/></svg>';
function score(n,root){
 if(n===root||n.classList.contains('remaining-card-lux-icon'))return-999;
 const r=n.getBoundingClientRect(),cs=getComputedStyle(n),txt=(n.textContent||'').trim();
 let s=0;
 if(r.width>=38&&r.width<=70&&r.height>=38&&r.height<=70)s+=8;
 if(parseFloat(cs.borderRadius)>=12)s+=4;
 if(parseFloat(cs.borderWidth)>0&&cs.borderStyle!=='none')s+=3;
 if(n.querySelector('svg'))s+=2;
 if(txt.length<=3)s+=2;
 const rr=root.getBoundingClientRect();
 if(r.left>rr.left+rr.width*.55)s+=5;
 return s;
}
function repairQuranCategory(){
 for(const card of document.querySelectorAll('button,[role="button"],a')){
  const text=(card.innerText||card.textContent||'').replace(/\s+/g,' ').trim();
  if(!QURAN_CATEGORY_RX.test(text))continue;
  if(card.querySelector('.quran-category-lux-icon'))continue;
  const direct=[...card.children].filter(n=>n.tagName==='SPAN'||n.tagName==='DIV');
  let host=direct.find(n=>{
   const t=(n.textContent||'').trim(),r=n.getBoundingClientRect();
   return t.length<=2&&r.height>15&&r.height<80;
  });
  if(!host){
   host=document.createElement('span');
   card.prepend(host);
  }
  host.innerHTML=QURAN_SVG;
  host.className='quran-category-lux-icon';
  host.setAttribute('aria-hidden','true');
 }
}
function repair(){
 repairQuranCategory();
 for(const row of document.querySelectorAll('button,[role="button"],a')){
  if(row.closest('[data-smart-my-day="true"]'))continue;
  const text=(row.innerText||row.textContent||'').replace(/\s+/g,' ').trim(); if(!ROW_RX.test(text))continue;
  const lux=[...row.querySelectorAll('.remaining-card-lux-icon')]; if(!lux.length)continue;
  const src=lux[0]; const html=src.innerHTML;
  const candidates=[...row.querySelectorAll('span,div')].filter(n=>!n.closest('.remaining-card-lux-icon'));
  const host=candidates.sort((a,b)=>score(b,row)-score(a,row))[0];
  if(!host||score(host,row)<8)continue;
  for(const n of lux)if(n!==host)n.remove();
  host.innerHTML=html;
  host.classList.add('remaining-card-lux-icon','remaining-card-lux-host');
  host.setAttribute('aria-hidden','true');
 }
}
export function installIconHostRepair(){
 if(document.getElementById('icon-host-repair-style'))return;
 const s=document.createElement('style');s.id='icon-host-repair-style';s.textContent=`.remaining-card-lux-host{width:auto!important;height:auto!important;min-width:0!important}.remaining-card-lux-host svg{width:24px!important;height:24px!important}.quran-category-lux-icon{width:44px!important;height:44px!important;min-width:44px!important;display:grid!important;place-items:center!important;border-radius:14px!important;background:rgba(255,255,255,.08)!important;color:#f5efe3!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.09)!important;margin:0!important;padding:0!important}.quran-category-lux-icon svg{display:block!important;width:28px!important;height:28px!important;overflow:visible!important}.quran-category-lux-icon .qci-book{fill:rgba(245,239,227,.12);stroke:#f5efe3;stroke-width:1.25;stroke-linecap:round;stroke-linejoin:round}.quran-category-lux-icon .qci-book-alt{fill:rgba(192,160,98,.10)}.quran-category-lux-icon .qci-line{fill:none;stroke:#f5efe3;stroke-width:1.15;stroke-linecap:round;stroke-linejoin:round}.quran-category-lux-icon .qci-gold{fill:#c0a062;stroke:#c0a062;stroke-width:.7}`;document.head.appendChild(s);
 const run=()=>requestAnimationFrame(repair);run();setTimeout(run,80);setTimeout(run,300);
 let q=false;new MutationObserver(()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;repair()})}).observe(document.body,{subtree:true,childList:true});
 window.addEventListener('sakinah:global-root',run);window.addEventListener('sakinah:feature',run);
}
