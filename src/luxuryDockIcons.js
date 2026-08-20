const ICONS={
 home:'<svg viewBox="0 0 24 24" aria-hidden="true"><path class="lux-fill" d="M5 10.6 12 5l7 5.6v8.1a1.3 1.3 0 0 1-1.3 1.3H6.3A1.3 1.3 0 0 1 5 18.7z"/><path class="lux-cut" d="M9.7 20v-5.2h4.6V20"/><path class="lux-line" d="M3.8 10.3 12 3.8l8.2 6.5"/></svg>',
 quran:'<svg viewBox="0 0 24 24" aria-hidden="true"><path class="lux-fill" d="M3.9 5.8c3.1-.9 5.8-.3 8.1 1.5v11.9c-2.5-1.5-5.2-2-8.1-1.1z"/><path class="lux-fill lux-alt" d="M20.1 5.8c-3.1-.9-5.8-.3-8.1 1.5v11.9c2.5-1.5 5.2-2 8.1-1.1z"/><path class="lux-line" d="M12 7.3v11.9"/><path class="lux-gold" d="m12 9.3 1.05 1.15L12 11.6l-1.05-1.15z"/></svg>',
 'quran-player':'<svg viewBox="0 0 24 24" aria-hidden="true"><circle class="lux-fill" cx="12" cy="12" r="8.5"/><path class="lux-cut" d="m10 8.8 5.5 3.2-5.5 3.2z"/><path class="lux-gold" d="M5.8 12a6.2 6.2 0 0 1 6.2-6.2" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
 hadith:'<svg viewBox="0 0 24 24" aria-hidden="true"><path class="lux-fill" d="M5.3 4.2h10.9a2.1 2.1 0 0 1 2.1 2.1v13.5H7.7a2.4 2.4 0 0 1-2.4-2.4z"/><path class="lux-cut" d="M8.7 8h6.2M8.7 11.3h6.2M8.7 14.6h4.5"/><path class="lux-gold" d="M5.3 17.2c.7-.5 1.6-.8 2.6-.8h10.4" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
 myday:'<svg viewBox="0 0 24 24" aria-hidden="true"><path class="lux-fill" d="M7 15.1a5 5 0 0 1 10 0z"/><path class="lux-line" d="M4 16.9h16M8 19.6h8"/><path class="lux-gold" d="M12 3.7v2.1M5.8 6.6l1.5 1.5M18.2 6.6l-1.5 1.5M3.8 11.1h2.1M18.1 11.1h2.1" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>',
 discover:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle class="lux-fill" cx="12" cy="12" r="8.6"/><path class="lux-cut" d="m14.9 9.1-1.6 4.2-4.2 1.6 1.6-4.2z"/><circle class="lux-gold" cx="12" cy="12" r="1.05"/></svg>',
 profile:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle class="lux-fill" cx="12" cy="8.1" r="3.2"/><path class="lux-fill lux-alt" d="M5.8 19.7c.8-3.5 3-5.3 6.2-5.3s5.4 1.8 6.2 5.3z"/><path class="lux-gold" d="M8.1 19.7h7.8" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>'
};
function style(){if(document.getElementById('sakinah-luxury-dock-style'))return;const s=document.createElement('style');s.id='sakinah-luxury-dock-style';s.textContent=`
.app-global-dock{background:linear-gradient(135deg,rgba(255,255,255,.16),rgba(246,243,236,.06))!important;border:1px solid rgba(255,255,255,.36)!important;-webkit-backdrop-filter:blur(30px) saturate(165%)!important;backdrop-filter:blur(30px) saturate(165%)!important;box-shadow:0 16px 42px rgba(24,30,36,.10),inset 0 1px 0 rgba(255,255,255,.56),inset 0 -1px 0 rgba(181,154,98,.05)!important}
.app-global-dock:before{content:"";position:absolute;inset:1px;border-radius:inherit;pointer-events:none;background:linear-gradient(115deg,rgba(255,255,255,.20),transparent 34%,transparent 72%,rgba(255,255,255,.07));opacity:.64}
.app-global-dock button{color:rgba(72,72,68,.72)!important;position:relative;z-index:1}
.app-global-dock button.active{color:#173B57!important;background:linear-gradient(145deg,rgba(255,255,255,.30),rgba(255,255,255,.09))!important;border:1px solid rgba(255,255,255,.32)!important;box-shadow:0 7px 20px rgba(23,59,87,.07),inset 0 1px 0 rgba(255,255,255,.62)!important;-webkit-backdrop-filter:blur(14px)!important;backdrop-filter:blur(14px)!important}
.app-global-dock .dockIcon{width:30px!important;height:30px!important}
.app-global-dock .dockIcon svg{width:27px!important;height:27px!important;display:block;overflow:visible}
.app-global-dock .lux-fill{fill:currentColor;opacity:.16;stroke:currentColor;stroke-width:1.45;stroke-linecap:round;stroke-linejoin:round}
.app-global-dock .lux-alt{opacity:.1}
.app-global-dock .lux-line{fill:none;stroke:currentColor;stroke-width:1.45;stroke-linecap:round;stroke-linejoin:round}
.app-global-dock .lux-cut{fill:none;stroke:rgba(255,255,255,.66);stroke-width:1.45;stroke-linecap:round;stroke-linejoin:round}
.app-global-dock .lux-gold{fill:#b59a62;stroke:#b59a62}
.app-global-dock button.active .lux-fill{opacity:.24}
.app-global-dock button.active .lux-gold{fill:#c2a35f;stroke:#c2a35f}
.app-global-dock button.active .dockIcon{transform:translateY(-1px) scale(1.06);filter:drop-shadow(0 3px 7px rgba(23,59,87,.13))}
`;document.head.appendChild(s)}
function apply(){style();document.querySelectorAll('.app-global-dock button[aria-label]').forEach(btn=>{const id=btn.getAttribute('aria-label');const svg=ICONS[id];if(!svg)return;const slot=btn.querySelector('.dockIcon')||btn;if(slot.dataset.luxuryIconVersion==='2'&&slot.dataset.luxuryIcon===id)return;slot.innerHTML=svg;slot.dataset.luxuryIcon=id;slot.dataset.luxuryIconVersion='2'})}
export function installLuxuryDockIcons(){apply();let q=false;const run=()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;apply()})};new MutationObserver(run).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','aria-label']});window.addEventListener('sakinah:feature',run);window.addEventListener('sakinah:global-root',run)}