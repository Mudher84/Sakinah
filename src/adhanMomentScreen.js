const ROOT_ID="sakinah-adhan-moment";
const PRAYERS={
 fajr:{ar:"الفجر",tone:"linear-gradient(180deg,rgba(15,28,64,.76),rgba(68,57,101,.44) 42%,rgba(216,166,117,.28))",accent:"#D8E3FF",glow:"rgba(126,164,255,.42)"},
 dhuhr:{ar:"الظهر",tone:"linear-gradient(180deg,rgba(255,244,214,.14),rgba(224,178,82,.20) 48%,rgba(111,76,34,.24))",accent:"#FFE4A3",glow:"rgba(255,218,127,.40)"},
 asr:{ar:"العصر",tone:"linear-gradient(180deg,rgba(91,58,29,.16),rgba(212,139,52,.28) 48%,rgba(86,47,30,.34))",accent:"#FFD092",glow:"rgba(255,164,78,.42)"},
 maghrib:{ar:"المغرب",tone:"linear-gradient(180deg,rgba(40,23,48,.24),rgba(143,54,32,.36) 48%,rgba(25,17,30,.54))",accent:"#FFC066",glow:"rgba(255,119,54,.52)"},
 isha:{ar:"العشاء",tone:"linear-gradient(180deg,rgba(3,13,42,.72),rgba(19,30,69,.58) 48%,rgba(3,9,27,.76))",accent:"#BFCBFF",glow:"rgba(92,122,255,.38)"}
};
const normalize=p=>PRAYERS[p]?p:"maghrib";
const pad=n=>String(n).padStart(2,"0");
function nowTime(){const d=new Date();return `${pad(d.getHours())}:${pad(d.getMinutes())}`}
function escapeHtml(s){return String(s??"").replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function close(){document.getElementById(ROOT_ID)?.remove();document.documentElement.style.removeProperty("overflow")}
function render(detail={}){
 close();
 const key=normalize(detail.prayer);
 const theme=PRAYERS[key];
 const time=detail.time||nowTime();
 const muezzin=detail.muezzin||"المؤذن المختار";
 const root=document.createElement("div");root.id=ROOT_ID;root.dir="rtl";
 root.innerHTML=`<style>
 #${ROOT_ID}{position:fixed;inset:0;z-index:2147483647;color:#fff;font-family:Cairo,system-ui,sans-serif;overflow:hidden;background:#0b0b10}
 #${ROOT_ID} *{box-sizing:border-box}
 #${ROOT_ID} .bg{position:absolute;inset:-2%;background-image:url('/images/adhan/adhan-screen.webp');background-size:cover;background-position:center;filter:saturate(.95) contrast(1.02) brightness(.72);transform:scale(1.04)}
 #${ROOT_ID} .tone{position:absolute;inset:0;background:${theme.tone};mix-blend-mode:color;opacity:.98}
 #${ROOT_ID} .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.18),rgba(0,0,0,.06) 38%,rgba(0,0,0,.52));box-shadow:inset 0 0 120px rgba(0,0,0,.28)}
 #${ROOT_ID} .content{position:relative;z-index:2;min-height:100%;display:flex;flex-direction:column;align-items:center;padding:max(28px,env(safe-area-inset-top)) 20px max(28px,env(safe-area-inset-bottom))}
 #${ROOT_ID} .brand{font-family:Georgia,serif;letter-spacing:.22em;font-size:13px;margin-top:8px;text-shadow:0 2px 14px rgba(0,0,0,.38)}
 #${ROOT_ID} .spacer{flex:1}
 #${ROOT_ID} .call{font-size:14px;opacity:.9;margin-bottom:8px}
 #${ROOT_ID} h1{margin:0;font-size:clamp(38px,10vw,70px);font-weight:700;line-height:1.2;text-shadow:0 6px 28px rgba(0,0,0,.36)}
 #${ROOT_ID} .accent{color:${theme.accent};text-shadow:0 0 26px ${theme.glow}}
 #${ROOT_ID} .orb{margin-top:22px;width:min(74vw,330px);aspect-ratio:1;border-radius:50%;display:grid;place-items:center;text-align:center;padding:30px;background:rgba(16,12,15,.46);border:1px solid rgba(255,255,255,.34);box-shadow:0 20px 70px rgba(0,0,0,.28),0 0 60px ${theme.glow};backdrop-filter:blur(18px)}
 #${ROOT_ID} .prayer{font-size:18px;color:${theme.accent};font-weight:600}
 #${ROOT_ID} .time{font:300 clamp(50px,14vw,78px)/1.05 Georgia,serif;direction:ltr;margin-top:6px;letter-spacing:-.04em}
 #${ROOT_ID} .date{font-size:11px;opacity:.72;margin-top:10px}
 #${ROOT_ID} .player{width:min(92vw,420px);margin-top:20px;padding:15px 17px;border-radius:22px;background:rgba(18,12,14,.48);border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(18px);display:flex;align-items:center;gap:13px}
 #${ROOT_ID} .sound{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.18);font-size:22px;color:${theme.accent}}
 #${ROOT_ID} .playerText{flex:1}.label{font-size:13px;color:${theme.accent};font-weight:700}.sub{font-size:11px;opacity:.74;margin-top:4px}
 #${ROOT_ID} .wave{height:16px;margin-top:7px;background:repeating-linear-gradient(90deg,${theme.accent} 0 2px,transparent 2px 5px);opacity:.58;mask:linear-gradient(180deg,transparent 0,#000 30%,#000 70%,transparent 100%)}
 #${ROOT_ID} .close{width:min(92vw,420px);margin-top:16px;border:0;border-radius:999px;padding:15px 20px;font-family:inherit;font-size:15px;font-weight:700;color:#2a1b0a;background:linear-gradient(90deg,#f1b34d,#ffe8a8,#f1b34d);box-shadow:0 12px 36px ${theme.glow};cursor:pointer}
 #${ROOT_ID} .preview{position:absolute;top:max(12px,env(safe-area-inset-top));left:12px;display:flex;gap:5px;z-index:3}.preview button{border:1px solid rgba(255,255,255,.2);background:rgba(0,0,0,.22);color:#fff;border-radius:999px;padding:5px 8px;font:10px inherit;backdrop-filter:blur(10px)}
 @media(max-height:700px){#${ROOT_ID} .orb{width:min(58vw,250px);margin-top:12px}#${ROOT_ID} .player{margin-top:12px}#${ROOT_ID} h1{font-size:34px}}
 </style><div class="bg"></div><div class="tone"></div><div class="shade"></div><div class="content"><div class="brand">SAKINAH</div><div class="spacer"></div><div class="call">حان الآن</div><h1>أذان <span class="accent">${theme.ar}</span></h1><div class="orb"><div><div class="prayer">${theme.ar}</div><div class="time">${escapeHtml(time)}</div><div class="date">حي على الصلاة</div></div></div><div class="player"><div class="sound">◖))</div><div class="playerText"><div class="label">وقت الأذان</div><div class="sub">أذان: ${escapeHtml(muezzin)}</div><div class="wave"></div></div></div><button class="close">إغلاق</button></div>`;
 root.querySelector(".close").addEventListener("click",close);
 document.body.appendChild(root);document.documentElement.style.overflow="hidden";
}
function parseStoredTimes(){
 const keys=["sakinah-prayer-times","sakinahPrayerTimes","prayerTimes"];
 for(const k of keys){try{const v=JSON.parse(localStorage.getItem(k)||"null");if(v&&typeof v==="object")return v}catch{}}
 const data={};document.querySelectorAll("[data-prayer-time]").forEach(el=>{const p=el.getAttribute("data-prayer-time"),t=el.getAttribute("data-time")||el.textContent?.match(/\b\d{1,2}:\d{2}\b/)?.[0];if(p&&t)data[p]=t});return data;
}
let lastKey="";
function tick(){
 const times=window.__SAKINAH_PRAYER_TIMES__||parseStoredTimes();if(!times)return;
 const hm=nowTime();
 for(const p of Object.keys(PRAYERS)){const t=String(times[p]||"").slice(0,5);if(t&&t===hm){const day=new Date().toISOString().slice(0,10),k=`${day}:${p}:${hm}`;if(k!==lastKey){lastKey=k;render({prayer:p,time:hm,muezzin:localStorage.getItem("sakinah-adhan-muezzin")||"المؤذن المختار"})}break}}
}
export function installAdhanMomentScreen(){
 window.addEventListener("sakinah:adhan-start",e=>render(e.detail||{}));
 window.addEventListener("sakinah:adhan-preview",e=>render(e.detail||{prayer:"maghrib"}));
 window.sakinahPreviewAdhan=(prayer="maghrib")=>render({prayer});
 tick();setInterval(tick,15000);
}
