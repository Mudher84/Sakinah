const ITEMS=[
[/خريطة الأسماء|Name Map/i,'<svg viewBox="0 0 24 24"><circle class="rc-fill" cx="12" cy="12" r="7.2"/><path class="rc-line" d="M12 6.5 17.5 12 12 17.5 6.5 12z"/><circle class="rc-gold" cx="12" cy="12" r="1.2"/></svg>'],
[/مقارنة الكلمات|Word Comparison/i,'<svg viewBox="0 0 24 24"><path class="rc-line" d="M5 7.5c3 1.5 5.5 1.5 7.5 0S17 6 19 7.5M5 16.5c3-1.5 5.5-1.5 7.5 0s4.5 1.5 6.5 0"/><path class="rc-gold" d="M7 12h10"/></svg>'],
[/إحصائيات القرآن|Quran Statistics/i,'<svg viewBox="0 0 24 24"><rect class="rc-fill" x="4" y="4" width="16" height="16" rx="3"/><path class="rc-line" d="M8 16v-4M12 16V8M16 16v-6"/><path class="rc-gold" d="M7 17.5h10"/></svg>'],
[/برنامج الجمعة اليوم|Friday Program|Jumuah Program/i,'<svg viewBox="0 0 24 24"><path class="rc-fill" d="M5 6h14v13H5z"/><path class="rc-line" d="M8 4v4M16 4v4M5 9.5h14M8 13h8M8 16h5"/><path class="rc-gold" d="M16.5 15.5h1.8"/></svg>'],
[/تأمل اليوم|Daily Reflection/i,'<svg viewBox="0 0 24 24"><circle class="rc-fill" cx="12" cy="12" r="7.5"/><path class="rc-line" d="M8.4 13c1.7-2.8 4.6-4 7.2-2.7M9 16c1.6.7 3.3.8 4.9.2"/><path class="rc-gold" d="M12 3v2"/></svg>'],
[/ورد القرآن.*21|Quran Portion|Daily Quran/i,'<svg viewBox="0 0 24 24"><path class="rc-fill" d="M4.5 5.5c2.8-.8 5.3-.3 7.5 1.4v12c-2.3-1.3-4.8-1.7-7.5-1zM19.5 5.5c-2.8-.8-5.3-.3-7.5 1.4v12c2.3-1.3 4.8-1.7 7.5-1z"/><path class="rc-line" d="M8 9h2M14 9h2"/><path class="rc-gold" d="M12 7v12"/></svg>'],
[/أذكار الصباح|Morning Adhkar/i,'<svg viewBox="0 0 24 24"><circle class="rc-fill" cx="12" cy="12" r="5"/><path class="rc-line" d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3 7 7M17 17l1.7 1.7M18.7 5.3 17 7M7 17l-1.7 1.7"/><path class="rc-gold" d="M9.2 12.2h5.6"/></svg>'],
[/أوقات العبادة|Worship Times/i,'<svg viewBox="0 0 24 24"><circle class="rc-fill" cx="12" cy="12" r="8"/><path class="rc-line" d="M12 7v5l3.5 2"/><path class="rc-gold" d="M12 2.5V4"/></svg>'],
[/سجل الصلاة|Prayer Log/i,'<svg viewBox="0 0 24 24"><rect class="rc-fill" x="4.5" y="4" width="15" height="16" rx="3"/><path class="rc-line" d="M8 9h8M8 13h5"/><path class="rc-gold" d="m13.8 16 1.4 1.4 2.8-3.2"/></svg>'],
[/السفر والتنبيهات|Travel.*Alerts/i,'<svg viewBox="0 0 24 24"><path class="rc-fill" d="M5 15.5 19 12 5 8.5l2.2 3.5z"/><path class="rc-line" d="M7.2 12H14"/><circle class="rc-gold" cx="17.5" cy="6" r="1.5"/></svg>'],
[/المؤذن والتنبيهات|Adhan.*Alerts|Muezzin/i,'<svg viewBox="0 0 24 24"><path class="rc-fill" d="M7 17h10l-1.4-2.1V10a3.6 3.6 0 0 0-7.2 0v4.9z"/><path class="rc-line" d="M9.8 19c.6 1.1 1.3 1.5 2.2 1.5s1.6-.4 2.2-1.5"/><path class="rc-gold" d="M12 4V2.5"/></svg>'],
[/أقرب مسجد|Nearest Mosque/i,'<svg viewBox="0 0 24 24"><path class="rc-fill" d="M5 19v-8h14v8"/><path class="rc-line" d="M7.5 11V8.8a4.5 4.5 0 0 1 9 0V11M10 19v-4h4v4"/><path class="rc-gold" d="M12 3.5V2"/></svg>'],
[/القبلة|Qibla/i,'<svg viewBox="0 0 24 24"><circle class="rc-fill" cx="12" cy="12" r="8"/><path class="rc-line" d="m14.8 7.2-1.7 5.9-5.9 1.7 1.7-5.9z"/><circle class="rc-gold" cx="12" cy="12" r="1"/></svg>'],
[/أوقات الصلاة|Prayer Times/i,'<svg viewBox="0 0 24 24"><circle class="rc-fill" cx="12" cy="12" r="8"/><path class="rc-line" d="M12 7v5l3.5 2"/><path class="rc-gold" d="M12 2.5V4"/></svg>'],
[/أذكار اليوم|Daily Adhkar/i,'<svg viewBox="0 0 24 24"><circle class="rc-fill" cx="12" cy="12" r="7.5"/><path class="rc-line" d="M8.5 12.5c1.4-2.7 3.8-4 7-3.8M9.2 16c1.6.7 3.1.8 4.7.2"/><path class="rc-gold" d="M12 3v2"/></svg>']
];
const OTHER_ICON_CLASSES=['.sakinah-lux-app-icon','.quran-hub-lux-icon','.kids-shelf-lux-icon','.remaining-card-lux-icon'];
function cleanup(el){for(const sel of OTHER_ICON_CLASSES){for(const n of el.querySelectorAll(sel)){if(!n.classList.contains('remaining-card-lux-icon'))n.remove()}}}
function apply(){
 for(const el of document.querySelectorAll('button,[role="button"],a')){
  const text=(el.innerText||el.textContent||'').replace(/\s+/g,' ').trim();
  const hit=ITEMS.find(([r])=>r.test(text)); if(!hit)continue;
  cleanup(el);
  let box=el.querySelector('.remaining-card-lux-icon');
  if(!box){
   const old=[...el.querySelectorAll('span,div')].find(x=>x.children.length===0&&((x.textContent||'').trim().length<=4));
   box=document.createElement('span'); box.className='remaining-card-lux-icon';
   if(old)old.replaceWith(box); else el.prepend(box);
  }
  for(const extra of [...el.querySelectorAll('.remaining-card-lux-icon')].slice(1))extra.remove();
  box.innerHTML=hit[1];
 }
}
export function installRemainingCardLuxuryIcons(){
 if(document.getElementById('remaining-card-lux-style'))return;
 const s=document.createElement('style');s.id='remaining-card-lux-style';s.textContent=`.remaining-card-lux-icon{width:30px;height:30px;display:grid;place-items:center;flex:0 0 auto}.remaining-card-lux-icon svg{width:25px;height:25px}.remaining-card-lux-icon .rc-line{fill:none;stroke:#8f846d;stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round}.remaining-card-lux-icon .rc-fill{fill:rgba(198,193,180,.20);stroke:none}.remaining-card-lux-icon .rc-gold{fill:none;stroke:#b89a5b;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}`;document.head.appendChild(s);
 apply();let q=false;new MutationObserver(()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;apply()})}).observe(document.body,{subtree:true,childList:true});
}
