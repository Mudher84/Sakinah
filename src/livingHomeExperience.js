const DAILY_HADITHS=[
 {text:"إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى.",source:"صحيح البخاري · 1"},
 {text:"أحب الأعمال إلى الله أدومها وإن قل.",source:"صحيح مسلم · 783"},
 {text:"الكلمة الطيبة صدقة.",source:"صحيح البخاري · 2989"},
 {text:"يسروا ولا تعسروا، وبشروا ولا تنفروا.",source:"صحيح البخاري · 69"},
 {text:"من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت.",source:"صحيح البخاري · 6018"},
 {text:"الراحمون يرحمهم الرحمن.",source:"سنن الترمذي · 1924"},
 {text:"لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه.",source:"صحيح البخاري · 13"}
];
const DAILY_TIPS=[
 "ابدأ بخمس دقائق قرآن فقط؛ الاستمرار أهم من الكثرة.",
 "اختر ذكراً واحداً تلازمه اليوم بدل أن تشتت نفسك بين أشياء كثيرة.",
 "قبل النوم راجع نعمة واحدة تستحق الحمد عليها.",
 "اجعل بينك وبين كل صلاة لحظة هدوء بلا هاتف.",
 "افتح المصحف على موضع توقفت عنده أمس ولا تبدأ من جديد.",
 "صلّ ركعتين بخشوع كامل أفضل من عمل كثير بلا حضور.",
 "اجعل لك دعاءً ثابتاً لأهلك ولمن تحب كل يوم."
];
const DAILY_STORIES=[
 {title:"دقيقة من السيرة",text:"في الهجرة كان التخطيط الدقيق ملازماً للتوكل؛ أُخذت بالأسباب كاملة ثم تُركت النتيجة لله."},
 {title:"موقف نتعلم منه",text:"كان النبي ﷺ يختار الرفق ما لم يكن فيه إثم؛ القوة في الأسلوب الهادئ لا في القسوة."},
 {title:"معنى يستحق التوقف",text:"الثبات على القليل يصنع أثراً أعمق من دفعات كبيرة تنقطع سريعاً."},
 {title:"من أدب اليوم",text:"من أجمل ما يحفظ العلاقات أن تختار الكلمة التي تُصلح قبل الكلمة التي تنتصر لك."},
 {title:"لحظة سكينة",text:"ليس كل تأخير خسارة؛ أحياناً تكون المسافة بين الدعاء والإجابة تربية للقلب."}
];
const ACCENTS=["#657C73","#70899A","#A88353","#887567","#6E7F91","#7D745D","#6B8978","#A06F62","#718A85","#687B9A","#93786E","#766B8E","#8A8064","#6B8290","#657A68","#B07C67","#8C7657","#6B6F79"];
function dayIndex(){const d=new Date();const start=new Date(d.getFullYear(),0,0);return Math.floor((d-start)/86400000)}
function greeting(){const h=new Date().getHours();if(h<5)return"ليلة هادئة";if(h<12)return"صباح السكينة";if(h<17)return"نهارك طيب";if(h<21)return"مساء السكينة";return"ليلة مطمئنة"}
function icon(kind){const p='viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';if(kind==="hadith")return `<svg ${p}><path d="M6 4.5h10.5a2 2 0 0 1 2 2v13H8a2 2 0 0 1-2-2z"/><path d="M8.8 8.5h6.6M8.8 12h6.6M8.8 15.5h4.8"/></svg>`;if(kind==="tip")return `<svg ${p}><path d="M9 18h6M10 21h4"/><path d="M8.4 14.7C6.9 13.6 6 11.8 6 9.8a6 6 0 1 1 12 0c0 2-.9 3.8-2.4 4.9-.8.6-1.1 1.2-1.1 2.1h-5c0-.9-.3-1.5-1.1-2.1z"/></svg>`;return `<svg ${p}><path d="M5 5.5h14v13H5z"/><path d="M8 8.5h8M8 12h5M8 15.5h7"/></svg>`}
function style(){if(document.getElementById("sakinah-living-home-style"))return;const s=document.createElement("style");s.id="sakinah-living-home-style";s.textContent=`
@keyframes sakinahHomeRise{from{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}
@keyframes sakinahHomeGlow{0%,100%{transform:translate3d(-10%,0,0);opacity:.18}50%{transform:translate3d(10%,0,0);opacity:.32}}
.sakinah-daily-stream{margin:-2px 0 22px;display:grid;gap:10px;animation:sakinahHomeRise .65s cubic-bezier(.2,.7,.2,1) both;text-align:center}
.sakinah-daily-hero{position:relative;overflow:hidden;border:1px solid rgba(16,16,15,.065);border-radius:24px;padding:18px;background:rgba(255,255,255,.62);color:#10100F;box-shadow:0 10px 28px rgba(16,16,15,.04);min-height:150px;text-align:center}
.sakinah-daily-hero:before{content:"";position:absolute;width:58%;height:150%;top:-30%;right:-16%;border-radius:50%;background:radial-gradient(circle,rgba(181,154,98,.12),transparent 70%);animation:sakinahHomeGlow 8s ease-in-out infinite;pointer-events:none}
.sakinah-daily-kicker{position:relative;font-size:9.5px;letter-spacing:.05em;color:#A88353;opacity:.88;text-align:center}
.sakinah-daily-title{position:relative;font-family:Fraunces,'Noto Naskh Arabic',serif;font-size:22px;margin-top:8px;color:#10100F;text-align:center}
.sakinah-daily-quote{position:relative;font-size:16px;line-height:1.95;margin:15px auto 0;max-width:520px;color:#10100F;text-align:center}
.sakinah-daily-source{position:relative;font-size:9.5px;opacity:.42;margin-top:8px;color:#10100F;text-align:center}
.sakinah-daily-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.sakinah-daily-card{border:1px solid rgba(16,16,15,.065);border-radius:22px;padding:15px;background:rgba(255,255,255,.62);box-shadow:0 10px 28px rgba(16,16,15,.04);min-height:126px;position:relative;overflow:hidden;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center}
.sakinah-daily-card svg{width:22px;height:22px;color:#B59A62}.sakinah-daily-label{font-size:9px;opacity:.42;margin-top:12px;text-align:center}.sakinah-daily-card b{display:block;width:100%;font-size:12.5px;font-weight:550;line-height:1.75;margin-top:7px;text-align:center}
.sakinah-quick-grid{perspective:900px}.sakinah-quick-card{position:relative!important;overflow:hidden!important;transition:transform .28s cubic-bezier(.2,.7,.2,1),box-shadow .28s ease,border-color .28s ease,background .28s ease!important;animation:sakinahHomeRise .55s cubic-bezier(.2,.7,.2,1) both!important}
.sakinah-quick-card:before{content:"";position:absolute;inset:0;background:linear-gradient(135deg,var(--sakinah-card-tint,rgba(181,154,98,.08)),transparent 62%);opacity:.72;pointer-events:none}.sakinah-quick-card:after{content:"";position:absolute;width:58px;height:58px;border-radius:50%;left:-24px;bottom:-30px;background:var(--sakinah-card-accent,#B59A62);opacity:.055;transition:transform .3s ease,opacity .3s ease}
.sakinah-quick-card:hover,.sakinah-quick-card:focus-visible{transform:translateY(-4px) scale(1.018);box-shadow:0 16px 34px rgba(16,16,15,.08)!important;border-color:color-mix(in srgb,var(--sakinah-card-accent,#B59A62) 32%,transparent)!important}.sakinah-quick-card:hover:after,.sakinah-quick-card:focus-visible:after{transform:scale(1.7);opacity:.09}.sakinah-quick-card:active{transform:translateY(-1px) scale(.97)}
.sakinah-quick-card>div:first-child{position:relative;z-index:1;transition:transform .28s ease,color .28s ease!important;color:var(--sakinah-card-accent,#B59A62)!important}.sakinah-quick-card:hover>div:first-child{transform:translateY(-2px) scale(1.1)}.sakinah-quick-card>div:last-child{position:relative;z-index:1}
@media(max-width:430px){.sakinah-daily-row{grid-template-columns:1fr}.sakinah-daily-card{min-height:108px}.sakinah-daily-quote{font-size:15.5px}.sakinah-daily-hero{padding:16px;border-radius:22px;min-height:138px}}
@media(prefers-reduced-motion:reduce){.sakinah-daily-stream,.sakinah-quick-card,.sakinah-daily-hero:before{animation:none!important}.sakinah-quick-card{transition:none!important}}
`;document.head.appendChild(s)}
function buildStream(){const n=dayIndex(),h=DAILY_HADITHS[n%DAILY_HADITHS.length],tip=DAILY_TIPS[n%DAILY_TIPS.length],story=DAILY_STORIES[n%DAILY_STORIES.length];const wrap=document.createElement("section");wrap.className="sakinah-daily-stream";wrap.dataset.sakinahDaily="1";wrap.innerHTML=`<article class="sakinah-daily-hero"><div class="sakinah-daily-kicker">${greeting()} · حديث اليوم</div><div class="sakinah-daily-title">شيء يستحق أن يبقى معك اليوم</div><div class="sakinah-daily-quote">${h.text}</div><div class="sakinah-daily-source">${h.source}</div></article><div class="sakinah-daily-row"><article class="sakinah-daily-card">${icon("tip")}<div class="sakinah-daily-label">نصيحة اليوم</div><b>${tip}</b></article><article class="sakinah-daily-card">${icon("story")}<div class="sakinah-daily-label">${story.title}</div><b>${story.text}</b></article></div>`;return wrap}
function apply(){style();const main=document.querySelector(".sakinah-live-content");if(!main)return;if(!main.querySelector('[data-sakinah-daily="1"]'))main.insertBefore(buildStream(),main.firstChild);const grids=[...main.querySelectorAll("div")].filter(el=>{const cs=getComputedStyle(el);return cs.display==="grid"&&cs.gridTemplateColumns.split(" ").length>=3&&el.querySelectorAll(":scope > button").length===18});const grid=grids[0];if(!grid)return;grid.classList.add("sakinah-quick-grid");[...grid.children].forEach((btn,i)=>{if(!(btn instanceof HTMLButtonElement))return;btn.classList.add("sakinah-quick-card");const c=ACCENTS[i%ACCENTS.length];btn.style.setProperty("--sakinah-card-accent",c);btn.style.setProperty("--sakinah-card-tint",`${c}18`);btn.style.animationDelay=`${Math.min(i*32,420)}ms`})}
export function installLivingHomeExperience(){apply();let queued=false;const run=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})};new MutationObserver(run).observe(document.body,{childList:true,subtree:true});window.addEventListener("sakinah:global-root",run);window.addEventListener("sakinah:feature",run)}