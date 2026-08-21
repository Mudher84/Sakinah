const ROW_RX=/برنامج الجمعة اليوم|تأمل اليوم|ورد القرآن.*21|أذكار الصباح|أوقات العبادة|سجل الصلاة|السفر والتنبيهات|المؤذن والتنبيهات|أقرب مسجد/i;
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
function repair(){
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
 const s=document.createElement('style');s.id='icon-host-repair-style';s.textContent=`.remaining-card-lux-host{width:auto!important;height:auto!important;min-width:0!important}.remaining-card-lux-host svg{width:24px!important;height:24px!important}`;document.head.appendChild(s);
 const run=()=>requestAnimationFrame(repair);run();setTimeout(run,80);setTimeout(run,300);
 let q=false;new MutationObserver(()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;repair()})}).observe(document.body,{subtree:true,childList:true});
 window.addEventListener('sakinah:global-root',run);window.addEventListener('sakinah:feature',run);
}
