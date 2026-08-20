const ROOT_ID="sakinah-adhan-moment";
const BG_URL="https://upload.wikimedia.org/wikipedia/commons/3/3c/Mosque_at_sunset_in_Dubai.jpg";
const PRAYERS={
 fajr:{ar:"الفجر",tone:"linear-gradient(180deg,rgba(9,24,61,.78),rgba(45,61,111,.46) 45%,rgba(188,139,110,.22))",accent:"#DCE8FF",glow:"rgba(122,160,255,.42)"},
 dhuhr:{ar:"الظهر",tone:"linear-gradient(180deg,rgba(255,245,218,.08),rgba(212,170,79,.18) 50%,rgba(107,77,36,.22))",accent:"#FFE8AD",glow:"rgba(255,219,129,.38)"},
 asr:{ar:"العصر",tone:"linear-gradient(180deg,rgba(72,49,30,.12),rgba(206,132,47,.27) 50%,rgba(82,49,30,.31))",accent:"#FFD39A",glow:"rgba(255,164,78,.40)"},
 maghrib:{ar:"المغرب",tone:"linear-gradient(180deg,rgba(38,22,47,.20),rgba(144,54,32,.34) 52%,rgba(22,15,27,.50))",accent:"#FFC46F",glow:"rgba(255,117,54,.50)"},
 isha:{ar:"العشاء",tone:"linear-gradient(180deg,rgba(3,13,42,.72),rgba(18,31,73,.60) 52%,rgba(3,9,27,.78))",accent:"#C7D1FF",glow:"rgba(92,122,255,.36)"}
};
const normalize=p=>PRAYERS[p]?p:"maghrib";
const pad=n=>String(n).padStart(2,"0");
function nowTime(){const d=new Date();return `${pad(d.getHours())}:${pad(d.getMinutes())}`}
function escapeHtml(s){return String(s??"").replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function close(){document.getElementById(ROOT_ID)?.remove();document.documentElement.style.removeProperty("overflow")}
function render(detail={}){
 close();
 const key=normalize(detail.prayer),theme=PRAYERS[key],time=detail.time||nowTime(),muezzin=detail.muezzin||"المؤذن المختار";
 const root=document.createElement("div");root.id=ROOT_ID;root.dir="rtl";
 root.innerHTML=`<style>
 #${ROOT_ID}{position:fixed;inset:0;z-index:2147483647;color:#fff;font-family:Cairo,system-ui,sans-serif;overflow:hidden;background:#0b0b10}
 #${ROOT_ID} *{box-sizing:border-box}
 #${ROOT_ID} .bg{position:absolute;inset:0;background-image:url('${BG_URL}');background-size:cover;background-position:center;filter:saturate(1.03) contrast(1.03) brightness(.63);transform:scale(1.02)}
 #${ROOT_ID} .tone{position:absolute;inset:0;background:${theme.tone};mix-blend-mode:color;opacity:.98}
 #${ROOT_ID} .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.30),rgba(0,0,0,.08) 36%,rgba(0,0,0,.62));box-shadow:inset 0 0 110px rgba(0,0,0,.30)}
 #${ROOT_ID} .content{position:relative;z-index:2;height:100%;display:grid;grid-template-rows:auto 1fr auto;gap:14px;padding:max(18px,env(safe-area-inset-top)) 18px max(18px,env(safe-area-inset-bottom))}
 #${ROOT_ID} .brand{text-align:center;font:600 12px/1.1 Georgia,serif;letter-spacing:.24em;text-shadow:0 2px 14px rgba(0,0,0,.42)}
 #${ROOT_ID} .center{align-self:center;justify-self:center;width:min(92vw,430px);display:flex;flex-direction:column;align-items:center;text-align:center;transform:translateY(1vh)}
 #${ROOT_ID} .call{font-size:13px;opacity:.88;margin-bottom:5px}
 #${ROOT_ID} h1{margin:0;font-size:clamp(30px,8vw,50px);font-weight:700;line-height:1.15;text-shadow:0 7px 26px rgba(0,0,0,.38)}
 #${ROOT_ID} .accent{color:${theme.accent};text-shadow:0 0 24px ${theme.glow}}
 #${ROOT_ID} .orb{margin-top:16px;width:min(58vw,250px);aspect-ratio:1;border-radius:50%;display:grid;place-items:center;padding:22px;background:rgba(13,11,14,.52);border:1px solid rgba(255,255,255,.30);box-shadow:0 18px 58px rgba(0,0,0,.32),0 0 48px ${theme.glow};-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
 #${ROOT_ID} .prayer{font-size:15px;color:${theme.accent};font-weight:600}
 #${ROOT_ID} .time{font:300 clamp(43px,12vw,68px)/1 Georgia,serif;direction:ltr;margin-top:5px;letter-spacing:-.045em}
 #${ROOT_ID} .date{font-size:10px;opacity:.76;margin-top:9px}
 #${ROOT_ID} .bottom{align-self:end;width:min(92vw,420px);justify-self:center}
 #${ROOT_ID} .player{padding:12px 14px;border-radius:19px;background:rgba(16,12,14,.50);border:1px solid rgba(255,255,255,.16);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);display:flex;align-items:center;gap:11px}
 #${ROOT_ID} .sound{width:42px;height:42px;flex:0 0 42px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.17);color:${theme.accent};font-size:18px}
 #${ROOT_ID} .playerText{flex:1;min-width:0}.label{font-size:12px;color:${theme.accent};font-weight:700}.sub{font-size:10px;opacity:.74;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 #${ROOT_ID} .wave{height:10px;margin-top:6px;background:repeating-linear-gradient(90deg,${theme.accent} 0 2px,transparent 2px 5px);opacity:.50;mask:linear-gradient(180deg,transparent 0,#000 28%,#000 72%,transparent 100%)}
 #${ROOT_ID} .close{width:100%;margin-top:11px;border:0;border-radius:999px;padding:13px 18px;font-family:inherit;font-size:14px;font-weight:700;color:#2a1b0a;background:linear-gradient(90deg,#efb24f,#ffe7a5,#efb24f);box-shadow:0 10px 28px ${theme.glow};cursor:pointer}
 @media(max-height:720px){#${ROOT_ID} .content{gap:8px;padding-top:max(12px,env(safe-area-inset-top));padding-bottom:max(12px,env(safe-area-inset-bottom))}#${ROOT_ID} .center{transform:none}#${ROOT_ID} h1{font-size:30px}#${ROOT_ID} .orb{width:min(46vw,205px);margin-top:10px;padding:16px}#${ROOT_ID} .time{font-size:46px}#${ROOT_ID} .player{padding:10px 12px}#${ROOT_ID} .close{padding:11px 16px;margin-top:8px}}
 @media(max-width:390px){#${ROOT_ID} .orb{width:min(56vw,220px)}#${ROOT_ID} .center{width:94vw}#${ROOT_ID} .bottom{width:94vw}}
 </style><div class="bg"></div><div class="tone"></div><div class="shade"></div><div class="content"><div class="brand">SAKINAH</div><div class="center"><div class="call">حان الآن</div><h1>أذان <span class="accent">${theme.ar}</span></h1><div class="orb"><div><div class="prayer">${theme.ar}</div><div class="time">${escapeHtml(time)}</div><div class="date">حي على الصلاة</div></div></div></div><div class="bottom"><div class="player"><div class="sound">◖))</div><div class="playerText"><div class="label">وقت الأذان</div><div class="sub">أذان: ${escapeHtml(muezzin)}</div><div class="wave"></div></div></div><button class="close">إغلاق</button></div></div>`;
 root.querySelector(".close").addEventListener("click",close);
 document.body.appendChild(root);document.documentElement.style.overflow="hidden";
}
function parseStoredTimes(){
 const keys=["sakinah-prayer-times","sakinahPrayerTimes","prayerTimes"];
 for(const k of keys){try{const v=JSON.parse(localStorage.getItem(k)||"null");if(v&&typeof v==="object")return v}catch{}}
 const data={};document.querySelectorAll("[data-prayer-time]").forEach(el=>{const p=el.getAttribute("data-prayer-time"),t=el.getAttribute("data-time")||el.textContent?.match(/\b\d{1,2}:\d{2}\b/)?.[0];if(p&&t)data[p]=t});return data;
}
let lastKey="";
function tick(){const times=window.__SAKINAH_PRAYER_TIMES__||parseStoredTimes();if(!times)return;const hm=nowTime();for(const p of Object.keys(PRAYERS)){const t=String(times[p]||"").slice(0,5);if(t&&t===hm){const day=new Date().toISOString().slice(0,10),k=`${day}:${p}:${hm}`;if(k!==lastKey){lastKey=k;render({prayer:p,time:hm,muezzin:localStorage.getItem("sakinah-adhan-muezzin")||"المؤذن المختار"})}break}}}
export function installAdhanMomentScreen(){window.addEventListener("sakinah:adhan-start",e=>render(e.detail||{}));window.addEventListener("sakinah:adhan-preview",e=>render(e.detail||{prayer:"maghrib"}));window.sakinahPreviewAdhan=(prayer="maghrib")=>render({prayer});tick();setInterval(tick,15000)}
