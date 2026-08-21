const ITEMS=[
[/المعلّم|المعلم|Quran Teacher/i,'<svg viewBox="0 0 24 24"><circle class="qh-fill" cx="9" cy="7" r="2.7"/><path class="qh-line" d="M4.8 18c.5-3.2 1.9-5 4.2-5s3.7 1.8 4.2 5M15 6.5h4.5v8H15"/><path class="qh-gold" d="M17.2 8.5v4"/></svg>'],
[/الاستماع للقرآن|Quran Audio|Listen/i,'<svg viewBox="0 0 24 24"><path class="qh-line" d="M9 18V6l8-1.8v11.5"/><circle class="qh-fill" cx="6.6" cy="18" r="2.4"/><circle class="qh-fill" cx="14.6" cy="15.8" r="2.4"/><path class="qh-gold" d="M9 8.2l8-1.8"/></svg>'],
[/التفسير|Tafsir/i,'<svg viewBox="0 0 24 24"><path class="qh-fill" d="M4.5 5.3c2.8-.7 5.3-.2 7.5 1.4v12c-2.3-1.3-4.8-1.7-7.5-1zM19.5 5.3c-2.8-.7-5.3-.2-7.5 1.4v12c2.3-1.3 4.8-1.7 7.5-1z"/><path class="qh-line" d="M8 9h2M14 9h2M8 12h2M14 12h2"/><path class="qh-gold" d="M12 6.7v12"/></svg>'],
[/البحث في القرآن|Quran Search/i,'<svg viewBox="0 0 24 24"><circle class="qh-fill" cx="10.3" cy="10.3" r="5.4"/><circle class="qh-line" cx="10.3" cy="10.3" r="5.4"/><path class="qh-gold" d="m14.3 14.3 5 5"/></svg>'],
[/الحفظ والمراجعة|Memorization/i,'<svg viewBox="0 0 24 24"><path class="qh-fill" d="M5 4.5h14v15H5z"/><path class="qh-line" d="M8 8.5h8M8 12h5.5M8 15.5h4"/><path class="qh-gold" d="m15.5 15 1.2 1.2 2.2-2.6"/></svg>'],
[/تدبر آية|Reflection|Tadabbur/i,'<svg viewBox="0 0 24 24"><circle class="qh-fill" cx="12" cy="12" r="7.5"/><path class="qh-line" d="M8.5 13c1.8-3.2 5.1-4.4 7.6-2.8M9.2 16c1.7.8 3.4.8 5.1.1"/><path class="qh-gold" d="M12 3v2M19 7l-1.6 1"/></svg>'],
[/جذور القرآن|Quran Roots|Roots/i,'<svg viewBox="0 0 24 24"><path class="qh-line" d="M12 4v8M12 8c-2.2-2.4-4.1-2.8-6-2.4M12 9c2.3-2.2 4.4-2.5 6.2-1.9M12 12c-1 3-2.7 5.5-5.4 7.4M12 12c1.1 3 2.9 5.4 5.6 7.2"/><path class="qh-gold" d="M8.2 16.7 6 19M15.8 16.6l2.2 2.3"/></svg>'],
[/موضوعات القرآن|Quran Topics|Topics/i,'<svg viewBox="0 0 24 24"><circle class="qh-fill" cx="7" cy="7" r="2.5"/><circle class="qh-fill" cx="17" cy="7" r="2.5"/><circle class="qh-fill" cx="7" cy="17" r="2.5"/><circle class="qh-fill" cx="17" cy="17" r="2.5"/><path class="qh-line" d="M9.5 7h5M7 9.5v5M17 9.5v5M9.5 17h5"/><circle class="qh-gold" cx="12" cy="12" r="1"/></svg>']
];
const OTHER_ICON='.sakinah-lux-app-icon,.remaining-card-lux-icon,.kids-shelf-lux-icon';
function apply(){
 for(const el of document.querySelectorAll('button,[role="button"],a')){
  const text=(el.innerText||el.textContent||'').replace(/\s+/g,' ').trim();
  const hit=ITEMS.find(([rx])=>rx.test(text)); if(!hit)continue;
  const isMemorization=/الحفظ والمراجعة|Memorization/i.test(text);
  const quranIcons=[...el.querySelectorAll('.quran-hub-lux-icon')];
  const otherIcons=[...el.querySelectorAll(OTHER_ICON)].filter(n=>!n.classList.contains('quran-hub-lux-icon'));
  let box=null;
  if(quranIcons.length){
   box=quranIcons[0];
   quranIcons.slice(1).forEach(n=>n.remove());
   otherIcons.forEach(n=>n.remove());
  }else if(otherIcons.length){
   box=otherIcons[0];
   otherIcons.slice(1).forEach(n=>n.remove());
   box.classList.remove('sakinah-lux-app-icon','remaining-card-lux-icon','kids-shelf-lux-icon');
   box.classList.add('quran-hub-lux-icon');
  }else{
   const candidates=[...el.querySelectorAll('span,div')].filter(x=>x.children.length===0&&((x.textContent||'').trim().length<=4));
   const old=candidates[0]; box=document.createElement('span'); box.className='quran-hub-lux-icon';
   if(old)old.replaceWith(box); else el.prepend(box);
  }
  box.innerHTML=hit[1];
  box.classList.toggle('quran-hub-lux-icon-centered',isMemorization);
 }
}
export function installQuranHubLuxuryIcons(){
 if(document.getElementById('quran-hub-lux-style'))return;
 const s=document.createElement('style');s.id='quran-hub-lux-style';s.textContent=`.quran-hub-lux-icon{width:28px;height:28px;display:grid;place-items:center;color:#B59A62;flex:0 0 auto}.quran-hub-lux-icon-centered{margin-inline:auto!important;align-self:center!important;justify-self:center!important;position:relative!important;inset-inline:auto!important;left:auto!important;right:auto!important}.quran-hub-lux-icon svg{width:25px;height:25px;overflow:visible}.quran-hub-lux-icon .qh-line{fill:none;stroke:#9A8B6A;stroke-width:1.45;stroke-linecap:round;stroke-linejoin:round}.quran-hub-lux-icon .qh-fill{fill:rgba(197,191,176,.22);stroke:none}.quran-hub-lux-icon .qh-gold{fill:none;stroke:#B59A62;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}`;document.head.appendChild(s);
 apply();let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})}).observe(document.body,{subtree:true,childList:true});
}
