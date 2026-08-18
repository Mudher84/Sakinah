import React, { useEffect, useMemo, useRef, useState } from "react";

const C = {
  ivory: "#F6F3EC",
  ivory2: "#EEE9DE",
  ink: "#10100F",
  ink2: "#242321",
  lapis: "#173B57",
  lapis2: "#234E6E",
  gold: "#B59A62",
  earth: "#A44D3C",
  mist: "#DDE4E8",
};

const AR = "٠١٢٣٤٥٦٧٨٩";
const digits = (v, lang) => lang === "ar" ? String(v).replace(/\d/g, d => AR[d]) : String(v);
const pad2 = n => String(n).padStart(2, "0");
const hm = (hour, lang) => {
  const h = Math.floor(hour) % 24;
  const m = Math.round((hour - Math.floor(hour)) * 60) % 60;
  return digits(`${pad2(h)}:${pad2(m)}`, lang);
};

const PRAYERS = [
  { id:"fajr", ar:"الفجر", en:"Fajr", h:4.87 },
  { id:"sunrise", ar:"الشروق", en:"Sunrise", h:6.40, sun:true },
  { id:"dhuhr", ar:"الظهر", en:"Dhuhr", h:13.13 },
  { id:"asr", ar:"العصر", en:"Asr", h:16.78 },
  { id:"maghrib", ar:"المغرب", en:"Maghrib", h:19.70 },
  { id:"isha", ar:"العشاء", en:"Isha", h:21.08 },
];

const SURAH = {
  id:1, ar:"الفاتحة", en:"Al-Fātiḥah", verses:[
    "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    "الرَّحْمَٰنِ الرَّحِيمِ",
    "مَالِكِ يَوْمِ الدِّينِ",
    "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ"
  ]
};

const SURAHS = [
  [1,"الفاتحة","Al-Fātiḥah",7,true],
  [2,"البقرة","Al-Baqarah",286,false],
  [18,"الكهف","Al-Kahf",110,false],
  [36,"يس","Yā-Sīn",83,false],
  [55,"الرحمن","Ar-Raḥmān",78,false],
  [67,"الملك","Al-Mulk",30,false],
  [112,"الإخلاص","Al-Ikhlāṣ",4,false],
  [113,"الفلق","Al-Falaq",5,false],
  [114,"الناس","An-Nās",6,false],
];

const RECITERS = [
  { id:"abdulbasit", ar:"عبدالباسط عبدالصمد", en:"Abdul Basit Abdus Samad", detailAr:"مزود صوت موثوق مطلوب", detailEn:"Trusted licensed audio provider required" },
  { id:"minshawi", ar:"محمد صديق المنشاوي", en:"Muhammad Siddiq al-Minshawi", detailAr:"مزود صوت موثوق مطلوب", detailEn:"Trusted licensed audio provider required" },
  { id:"husary", ar:"محمود خليل الحصري", en:"Mahmoud Khalil Al-Husary", detailAr:"مزود صوت موثوق مطلوب", detailEn:"Trusted licensed audio provider required" },
];

const MUEZZINS = [
  { id:"m1", ar:"مؤذن 01", en:"Muezzin 01", sourceAr:"صوت تجريبي — يحتاج ترخيصاً", sourceEn:"Development audio — license required" },
  { id:"m2", ar:"مؤذن المسجد", en:"My Mosque Muezzin", sourceAr:"يتطلب بيانات مسجد موثّقة", sourceEn:"Requires verified mosque data" },
];

const STR = {
  ar:{
    today:"اليوم", quran:"القرآن", prayer:"الصلاة", explore:"استكشف", me:"أنا",
    remaining:"متبقٍ", continue:"متابعة القراءة", discover:"استكشف", source:"المصدر",
    demo:"بيانات تجريبية — ليست مواقيت إنتاجية", next:"الصلاة القادمة", search:"ابحث في سكينة…",
    prayerSettings:"إعدادات الصلاة", qibla:"القبلة", adhan:"الأذان", reciters:"القراء",
    listen:"استماع", memorize:"حفظ", tafsir:"تفسير", translation:"ترجمة", saved:"محفوظ",
    back:"رجوع", notConnected:"بانتظار مصدر موثّق", sacred:"الوضع الهادئ",
  },
  en:{
    today:"Today", quran:"Quran", prayer:"Prayer", explore:"Explore", me:"Me",
    remaining:"remaining", continue:"Continue reading", discover:"Explore", source:"Source",
    demo:"Demo data — not production prayer times", next:"Next prayer", search:"Search Sakinah…",
    prayerSettings:"Prayer settings", qibla:"Qibla", adhan:"Adhan", reciters:"Reciters",
    listen:"Listen", memorize:"Memorize", tafsir:"Tafsir", translation:"Translation", saved:"Saved",
    back:"Back", notConnected:"Trusted source required", sacred:"Sacred mode",
  }
};

function usePersist(key, initial){
  const [v,setV] = useState(()=>{
    try { const x = localStorage.getItem(key); return x ? JSON.parse(x) : initial; } catch { return initial; }
  });
  useEffect(()=>{ try { localStorage.setItem(key, JSON.stringify(v)); } catch {} },[key,v]);
  return [v,setV];
}

function Icon({name,size=20,stroke=1.55}){
  const p = {
    home:<><path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9 21v-7h6v7"/></>,
    book:<><path d="M4 4.5c3.2-.7 5.8-.1 8 1.5v15c-2.2-1.6-4.8-2.2-8-1.5z"/><path d="M20 4.5c-3.2-.7-5.8-.1-8 1.5v15c2.2-1.6 4.8-2.2 8-1.5z"/></>,
    compass:<><circle cx="12" cy="12" r="9"/><path d="m15.8 8.2-2.5 5.1-5.1 2.5 2.5-5.1z"/></>,
    search:<><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></>,
    user:<><circle cx="12" cy="8" r="3.5"/><path d="M4.5 21c.9-4.1 3.4-6.2 7.5-6.2s6.6 2.1 7.5 6.2"/></>,
    play:<path d="m9 7 8 5-8 5z"/>,
    pause:<><path d="M9 7v10"/><path d="M15 7v10"/></>,
    chevron:<path d="m9 6 6 6-6 6"/>,
    bell:<><path d="M6 9a6 6 0 0 1 12 0c0 7 3 7 3 7H3s3 0 3-7"/><path d="M10 20h4"/></>,
    moon:<path d="M20 15.5A8 8 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/>,
    spark:<><path d="m12 2 1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></>,
    download:<><path d="M12 3v12"/><path d="m8 11 4 4 4-4"/><path d="M5 21h14"/></>,
    shield:<><path d="M12 3 5 6v5c0 5.2 2.8 8.5 7 10 4.2-1.5 7-4.8 7-10V6z"/><path d="m9 12 2 2 4-4"/></>,
    family:<><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 21c.8-4.1 2.8-6.2 6-6.2s5.2 2.1 6 6.2"/><path d="M14 16c1-.8 2.1-1.2 3.4-1.2 2.5 0 4 1.7 4.6 5.2"/></>,
    mosque:<><path d="M4 21h16"/><path d="M6 21V10h12v11"/><path d="M9 10V7.5C9 5.7 10.3 4 12 3c1.7 1 3 2.7 3 4.5V10"/><path d="M10 21v-5h4v5"/></>,
    mic:<><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 10a6 6 0 0 0 12 0"/><path d="M12 16v5"/></>,
    camera:<><path d="M4 7h3l1.5-2h7L17 7h3v12H4z"/><circle cx="12" cy="13" r="3.5"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden>{p[name]||p.spark}</svg>
}

function stageFor(h){
  if(h < 5.5) return {id:"night",dark:true,a:"#0B0D14",b:"#101722",accent:"#9CB7C8"};
  if(h < 7) return {id:"fajr",dark:true,a:"#121927",b:"#3B5265",accent:"#D6C29E"};
  if(h < 11.5) return {id:"morning",dark:false,a:"#F2E7CF",b:"#F6F3EC",accent:"#9A7F4C"};
  if(h < 15.5) return {id:"dhuhr",dark:false,a:"#FAF8F2",b:"#EEE7D5",accent:"#9A7F4C"};
  if(h < 19.3) return {id:"asr",dark:false,a:"#F2E8D8",b:"#DFC6A5",accent:"#9A6D55"};
  if(h < 21.6) return {id:"maghrib",dark:true,a:"#70493B",b:"#1B1116",accent:"#D9B789"};
  return {id:"isha",dark:true,a:"#0D0C13",b:"#151C2B",accent:"#829EBA"};
}

function nextPrayer(h){
  const p = PRAYERS.filter(x=>!x.sun);
  for(const x of p) if(x.h > h) return {...x, delta:x.h-h};
  return {...p[0], h:p[0].h+24, delta:p[0].h+24-h};
}

function DayLightArc({hour,onChange,compact=false,dark=false}){
  const W=800,H=compact?110:190, base=compact?78:125, amp=compact?28:54;
  const min=PRAYERS[0].h, span=24;
  const mapH=h=>h<min?h+24:h;
  const x=h=>((mapH(h)-min)/span)*W;
  const y=h=>base-Math.sin(((mapH(h)-min)/span)*Math.PI)*amp;
  let d="";
  for(let i=0;i<=100;i++){const hh=min+(i/100)*24; d+=`${i?"L":"M"} ${x(hh)} ${y(hh)} `}
  const nx=x(hour), ny=y(hour);
  return <div className="arcWrap">
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="dayArc"
      onPointerDown={e=>{
        if(!onChange) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        const r=e.currentTarget.getBoundingClientRect();
        let f=(e.clientX-r.left)/r.width; f=Math.max(0,Math.min(1,f));
        let hh=min+f*24; if(hh>=24) hh-=24; onChange(hh);
      }}
      onPointerMove={e=>{
        if(!onChange || e.buttons!==1) return;
        const r=e.currentTarget.getBoundingClientRect();
        let f=(e.clientX-r.left)/r.width; f=Math.max(0,Math.min(1,f));
        let hh=min+f*24; if(hh>=24) hh-=24; onChange(hh);
      }}>
      <defs>
        <radialGradient id="halo"><stop offset="0" stopColor={C.gold} stopOpacity=".52"/><stop offset="1" stopColor={C.gold} stopOpacity="0"/></radialGradient>
        <linearGradient id="lightLine"><stop offset="0" stopColor={dark?"#D9E4EC":"#7E725C"} stopOpacity=".15"/><stop offset=".5" stopColor={dark?"#F5EDE0":"#4C4538"} stopOpacity=".7"/><stop offset="1" stopColor={dark?"#9DB6C8":"#7E725C"} stopOpacity=".15"/></linearGradient>
      </defs>
      <path d={d} fill="none" stroke="url(#lightLine)" strokeWidth="1.4"/>
      {PRAYERS.map(p=><circle key={p.id} cx={x(p.h)} cy={y(p.h)} r={p.sun?2.2:3} fill={dark?"#EAE3D8":"#272520"} opacity={p.sun?.38:.72}/>)}
      <circle cx={nx} cy={ny} r={compact?12:17} fill="url(#halo)"/>
      <circle cx={nx} cy={ny} r="3.3" fill={C.gold}/>
    </svg>
  </div>
}

function TopBar({lang,setLang,onTime,showTime,setShowTime,dark}){
  return <div className="topbar">
    <button className="ghost tiny" onClick={()=>setShowTime(!showTime)}>{showTime?"LIVE":"TIME"}</button>
    <div className="brandMark"><span></span><b>سكينة</b></div>
    <button className="ghost tiny" onClick={()=>setLang(lang==="ar"?"en":"ar")}>{lang==="ar"?"EN":"ع"}</button>
    {showTime && <input aria-label="time preview" className="timeSlider" type="range" min="0" max="23.98" step=".05" value={onTime.value} onChange={e=>onTime.set(+e.target.value)}/>}
  </div>
}

function Dock({world,setWorld,lang,next,dark}){
  const t=STR[lang];
  const items=[
    ["today","home",t.today],["quran","book",t.quran],["prayer","compass",""],["explore","search",t.explore],["me","user",t.me]
  ];
  return <div className={"dock "+(dark?"dockDark":"")}>
    {items.map(([id,icon,label])=>{
      const active=world===id || (id==="quran"&&world.startsWith("quran")) || (id==="explore"&&world!=="today"&&!["quran","prayer","me"].includes(world)&&!world.startsWith("quran"));
      if(id==="prayer") return <button key={id} className={"dockPrayer "+(active?"active":"")} onClick={()=>setWorld("prayer")}>
        <span className="prayerRing"><Icon name="compass" size={15}/></span>
        <small>{next[lang]} · {hm(next.h,lang)}</small>
      </button>
      return <button key={id} className={active?"active":""} onClick={()=>setWorld(id)}><Icon name={icon} size={17}/><small>{label}</small></button>
    })}
  </div>
}

function Today({lang,h,setH,stage,setWorld,lastRead}){
  const t=STR[lang], n=nextPrayer(h), mins=Math.round(n.delta*60), rh=Math.floor(mins/60), rm=mins%60;
  const rem=lang==="ar"?(rh?`${digits(rh,lang)} س ${digits(rm,lang)} د متبقٍ`:`${digits(rm,lang)} د متبقٍ`):(rh?`${rh}h ${rm}m remaining`:`${rm}m remaining`);
  const context = stage.id==="morning"||stage.id==="fajr" ? "continue" : stage.id==="maghrib" ? "adhkar" : stage.id==="isha"||stage.id==="night" ? "sleep" : "verse";
  return <section className="screen todayScreen">
    <div className="todayMeta">{lang==="ar"?"بغداد · اليوم":"Baghdad · Today"} <span>•</span> {t.demo}</div>
    <div className="hero">
      <div className="kicker">{t.next}</div>
      <h1>{n[lang]}</h1>
      <div className="heroTime">{hm(n.h,lang)}</div>
      <div className="remaining">{rem}</div>
    </div>
    <DayLightArc hour={h} onChange={setH} compact dark={stage.dark}/>
    <div className="contextBlock">
      {context==="continue" && <>
        <div className="eyebrow">{t.continue}</div>
        <button className="editorialAction" onClick={()=>setWorld("quran-reader")}>
          <span className="quranMini">الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ</span>
          <small>{SURAH.ar} · {lang==="ar"?"الآية ٢":"Ayah 2"}</small>
        </button>
      </>}
      {context==="adhkar" && <button className="editorialAction" onClick={()=>setWorld("adhkar")}>
        <span className="featureTitle">{lang==="ar"?"أذكار المساء":"Evening Adhkar"}</span>
        <small>{lang==="ar"?"جلسة هادئة بمصادر موثّقة عند الاتصال":"A calm sourced session when verified data is connected"}</small>
      </button>}
      {context==="sleep" && <button className="editorialAction" onClick={()=>setWorld("sacred")}>
        <span className="featureTitle">{lang==="ar"?"قبل النوم":"Before sleep"}</span>
        <small>{lang==="ar"?"استماع هادئ · أذكار · الفجر القادم":"Quiet listening · Adhkar · next Fajr"}</small>
      </button>}
      {context==="verse" && <button className="editorialAction center" onClick={()=>setWorld("quran-reader")}>
        <span className="quranHero">إِنَّ مَعَ الْعُسْرِ يُسْرًا</span>
        <small>{lang==="ar"?"مثال تصميمي — اربط النص الكامل بمصدر قرآن موثّق":"Design example — connect complete Quran text to a verified source"}</small>
      </button>}
    </div>
    <button className="quietLink" onClick={()=>setWorld("qibla")}>{t.qibla} · {digits("199°",lang)}</button>
  </section>
}

function QuranHome({lang,setWorld,selectedReciter}){
  const t=STR[lang];
  return <section className="screen light">
    <PageTitle title={t.quran} sub={lang==="ar"?"المصحف هو قلب سكينة. الواجهة تتراجع والنص يتقدم.":"The Mushaf is Sakinah's core. Interface recedes; the text leads."}/>
    <button className="continuePanel" onClick={()=>setWorld("quran-reader")}>
      <span>{t.continue}</span><b>{SURAH.ar}</b><small>{lang==="ar"?"الآية ٢":"Ayah 2"}</small>
    </button>
    <div className="sectionLabel">{lang==="ar"?"الوصول السريع":"QUICK ACCESS"}</div>
    <div className="quranQuick">
      <button onClick={()=>setWorld("quran-surahs")}>{lang==="ar"?"السور":"Surahs"}<Icon name="chevron" size={15}/></button>
      <button onClick={()=>setWorld("reciters")}>{t.reciters}<span>{selectedReciter.ar}</span></button>
      <button onClick={()=>setWorld("memorize")}>{t.memorize}<span>{lang==="ar"?"تكرار ومراجعة":"Repeat & review"}</span></button>
      <button onClick={()=>setWorld("quran-companion")}>{lang==="ar"?"رفيق القرآن":"Quran Companion"}<span>{lang==="ar"?"استمرار · خطط · مراجعة":"Continuity · plans · review"}</span></button>
      <button onClick={()=>setWorld("quran-deep")}>{lang==="ar"?"القرآن العميق":"Deep Quran"}<span>{t.notConnected}</span></button>
      <button onClick={()=>setWorld("tafsir-hadith")}>{lang==="ar"?"التفسير والحديث":"Tafsir & Hadith"}<span>{lang==="ar"?"مصادر منفصلة":"Separate sources"}</span></button>
    </div>
  </section>
}

function QuranReader({lang,setWorld,bookmarks,setBookmarks,sacred}){
  const [selected,setSelected]=useState(null);
  const [translation,setTranslation]=useState(false);
  return <section className={"screen quranReader "+(sacred?"sacredReader":"")}>
    <div className="readerTop">
      <button className="ghost" onClick={()=>setWorld("quran")}><Icon name="chevron" size={18}/></button>
      <div><b>{SURAH.ar}</b><small>{lang==="ar"?"مكية · ٧ آيات":"Makki · 7 Ayat"}</small></div>
      <button className="ghost" onClick={()=>setTranslation(!translation)}>{lang==="ar"?"تر":"EN"}</button>
    </div>
    <div className="mushaf">
      {SURAH.verses.map((v,i)=><button key={i} className={"ayah "+(selected===i?"sel":"")+(selected!==null&&selected!==i?" dim":"")} onClick={()=>setSelected(selected===i?null:i)}>
        <span>{v}</span><i>{digits(i+1,lang)}</i>
        {translation && <small>{["In the name of Allah, the Most Compassionate, the Most Merciful.","All praise belongs to Allah, Lord of all worlds.","The Most Compassionate, the Most Merciful.","Master of the Day of Judgment.","You alone we worship, and You alone we ask for help.","Guide us to the straight path.","the path of those You have blessed, not those who earned anger nor those who went astray."][i]}</small>}
      </button>)}
    </div>
    {selected!==null && <div className="ayahRail">
      {[
        ["book",STR[lang].tafsir,()=>setWorld("trust")],
        ["play",STR[lang].listen,()=>setWorld("quran-audio")],
        ["spark",STR[lang].memorize,()=>setWorld("memorize")],
        ["shield",STR[lang].source,()=>setWorld("trust")],
      ].map(([ic,l,fn])=><button key={l} onClick={fn}><Icon name={ic} size={18}/><span>{l}</span></button>)}
      <button onClick={()=>setBookmarks(b=>({...b,[selected]:!b[selected]}))}><Icon name="spark" size={18}/><span>{bookmarks[selected]?STR[lang].saved:(lang==="ar"?"حفظ":"Save")}</span></button>
    </div>}
  </section>
}

function QuranSurahs({lang,setWorld}){
  return <section className="screen light">
    <BackHeader title={lang==="ar"?"السور":"Surahs"} onBack={()=>setWorld("quran")}/>
    <input className="searchInput" placeholder={lang==="ar"?"ابحث باسم السورة…":"Search Surah…"} />
    <div className="rows">
      {SURAHS.map(s=><button key={s[0]} onClick={()=>s[4]?setWorld("quran-reader"):null}>
        <div className="num">{digits(s[0],lang)}</div>
        <div><b>{s[1]}</b><small>{s[2]} · {digits(s[3],lang)} {lang==="ar"?"آية":"Ayat"}</small></div>
        <span className={"status "+(s[4]?"ok":"wait")}>{s[4]?(lang==="ar"?"متاح":"Ready"):STR[lang].notConnected}</span>
      </button>)}
    </div>
  </section>
}

function Reciters({lang,setWorld,selected,setSelected}){
  const [playing,setPlaying]=useState(null);
  return <section className="screen light">
    <BackHeader title={STR[lang].reciters} onBack={()=>setWorld("quran")}/>
    <div className="heroStatement">{lang==="ar"?"القارئ صوتٌ، وليس متجر موسيقى.":"A reciter is a voice, not a music-store tile."}</div>
    <div className="rows reciterRows">
      {RECITERS.map(r=><div className="rowStatic" key={r.id}>
        <button className="playCircle" onClick={()=>setPlaying(playing===r.id?null:r.id)}><Icon name={playing===r.id?"pause":"play"} size={16}/></button>
        <div className="grow"><b>{r[lang]}</b><small>{r[lang==="ar"?"detailAr":"detailEn"]}</small></div>
        <button className={"selectPill "+(selected.id===r.id?"selected":"")} onClick={()=>setSelected(r)}>{selected.id===r.id?(lang==="ar"?"المختار":"Selected"):(lang==="ar"?"اختيار":"Choose")}</button>
      </div>)}
    </div>
    <DependencyNote lang={lang} textAr="المعاينة الصوتية هنا شكلية حتى نربط تسجيلات مرخّصة ومصدر موثوق." textEn="Audio preview is UI-only until licensed recordings and a trusted provider are connected."/>
  </section>
}

function QuranAudio({lang,setWorld,reciter}){
  const [play,setPlay]=useState(false), [repeat,setRepeat]=useState(1), [timer,setTimer]=useState("off");
  return <section className="screen audioScreen">
    <BackHeader title={lang==="ar"?"الاستماع":"Listening"} onBack={()=>setWorld("quran-reader")} dark/>
    <div className="audioSacred">
      <small>{SURAH.ar} · {lang==="ar"?"الآية ٢":"Ayah 2"}</small>
      <div className="quranAudioText">الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ</div>
      <div className="reciterName">{reciter.ar}</div>
      <div className="audioControls">
        <button onClick={()=>setRepeat(r=>r===5?1:r+1)}>×{digits(repeat,lang)}</button>
        <button className="mainPlay" onClick={()=>setPlay(!play)}><Icon name={play?"pause":"play"} size={24}/></button>
        <button onClick={()=>setTimer(timer==="off"?"20":timer==="20"?"ayah":"off")}>{timer==="off"?(lang==="ar"?"مؤقت":"Timer"):timer==="20"?digits("20د",lang):(lang==="ar"?"نهاية الآية":"End Ayah")}</button>
      </div>
      <div className="audioProgress"><span style={{width:play?"42%":"16%"}}/></div>
      <button className="audioDownloadEntry" onClick={()=>setWorld("audio-downloads")}><Icon name="download" size={16}/><span>{lang==="ar"?"إدارة التنزيلات":"Manage downloads"}</span></button>
    </div>
    <DependencyNote dark lang={lang} textAr="Background playback وMediaSession وLock Screen تحتاج تنفيذ Android Native وربط صوتيات حقيقية." textEn="Background playback, MediaSession and lock-screen controls require native Android implementation and real audio."/>
  </section>
}

function Memorize({lang,setWorld}){
  const [visible,setVisible]=useState(true), [count,setCount]=useState(3), [state,setState]=useState("review");
  return <section className="screen light">
    <BackHeader title={lang==="ar"?"الحفظ والمراجعة":"Memorization"} onBack={()=>setWorld("quran")}/>
    <div className="memorizeCard">
      <small>{SURAH.ar} · {lang==="ar"?"الآية ٢":"Ayah 2"}</small>
      <div className={"quranMemo "+(!visible?"hiddenText":"")}>الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ</div>
      <button className="outlineBtn" onClick={()=>setVisible(!visible)}>{visible?(lang==="ar"?"إخفاء النص":"Hide text"):(lang==="ar"?"إظهار النص":"Reveal text")}</button>
      <div className="repeatRow"><span>{lang==="ar"?"التكرار":"Repeat"}</span><button onClick={()=>setCount(count===10?1:count+1)}>×{digits(count,lang)}</button></div>
      <div className="reviewChoice">
        <button className={state==="review"?"on":""} onClick={()=>setState("review")}>{lang==="ar"?"تحتاج مراجعة":"Needs review"}</button>
        <button className={state==="ok"?"on":""} onClick={()=>setState("ok")}>{lang==="ar"?"مطمئن":"Comfortable"}</button>
      </div>
    </div>
  </section>
}

function Prayer({lang,h,setH,setWorld}){
  const n=nextPrayer(h);
  return <section className="screen light">
    <PageTitle title={STR[lang].prayer} sub={STR[lang].demo}/>
    <div className="prayerArcLarge"><DayLightArc hour={h} onChange={setH} dark={false}/></div>
    <div className="prayerTimeline">
      {PRAYERS.map(p=>{
        const past=(p.h<h), isNext=p.id===n.id;
        return <div className={(past?"past ":"")+(isNext?"next ":"")} key={p.id}>
          <span>{p[lang]}</span><b>{hm(p.h,lang)}</b>{isNext&&<i>{lang==="ar"?"التالي":"NEXT"}</i>}
        </div>
      })}
    </div>
    <button className="prepareEntry" onClick={()=>setWorld("prepare-prayer")}><span>{lang==="ar"?"الاستعداد للصلاة":"Prepare for prayer"}</span><Icon name="chevron" size={14}/></button>
    <div className="prayerActions">
      <button onClick={()=>setWorld("qibla")}><Icon name="compass"/><span>{STR[lang].qibla}</span></button>
      <button onClick={()=>setWorld("adhan")}><Icon name="bell"/><span>{STR[lang].adhan}</span></button>
      <button onClick={()=>setWorld("prayer-settings")}><Icon name="shield"/><span>{STR[lang].prayerSettings}</span></button>
    </div>
  </section>
}

function Qibla({lang,setWorld}){
  const [deg,setDeg]=useState(110), target=199, diff=Math.abs((((deg-target)+540)%360)-180), aligned=diff<5;
  return <section className="screen qiblaScreen">
    <BackHeader title={STR[lang].qibla} onBack={()=>setWorld("prayer")} dark/>
    <div className="qiblaSpace">
      <div className={"qiblaGeometry "+(aligned?"aligned":"")} style={{transform:`rotate(${deg-target}deg)`}}>
        <span></span><i></i>
      </div>
      <div className="qiblaLabel">{aligned?(lang==="ar"?"القبلة":"Qibla"):(lang==="ar"?"أدر الهاتف للمحاذاة":"Turn to align")}</div>
      <div className="bearing">{digits(Math.round(target)+"°",lang)}</div>
      <input type="range" min="0" max="359" value={deg} onChange={e=>setDeg(+e.target.value)} className="qiblaSlider"/>
      <small>{lang==="ar"?"محاكاة متصفح — الحساسات الحقيقية في Android Native":"Browser simulation — real sensors belong in native Android"}</small>
      <button className="mapQibla" onClick={()=>setWorld("qibla-map")}>{lang==="ar"?"عرض الاتجاه على الخريطة":"View direction on map"}</button>
    </div>
  </section>
}

function QiblaMap({lang,setWorld}){
  return <section className="screen mapScreen">
    <BackHeader title={lang==="ar"?"القبلة بالخريطة":"Qibla Map"} onBack={()=>setWorld("qibla")} dark/>
    <div className="mapFake">
      <div className="gridMap"></div>
      <div className="cityDot"><span></span><b>{lang==="ar"?"موقعك":"You"}</b></div>
      <div className="kaabaDot"><span></span><b>{lang==="ar"?"مكة":"Makkah"}</b></div>
      <svg viewBox="0 0 400 500"><path d="M80 410 Q185 240 325 90" fill="none" stroke={C.gold} strokeWidth="2" strokeDasharray="7 8"/></svg>
    </div>
    <DependencyNote dark lang={lang} textAr="الخريطة الحالية تصور الفكرة فقط. الربط الحقيقي يحتاج مزود خرائط وموقع جهاز." textEn="Current map visualizes the concept only. Production requires a map provider and device location."/>
  </section>
}

function Adhan({lang,setWorld,adhan,setAdhan}){
  const [preview,setPreview]=useState(null);
  const prayers=PRAYERS.filter(p=>!p.sun);
  return <section className="screen light">
    <BackHeader title={STR[lang].adhan} onBack={()=>setWorld("prayer")}/>
    <div className="heroStatement">{lang==="ar"?"لكل صلاة صوتها، وكل خيار واضح للمستخدم.":"Each prayer can have its own sound, with explicit user control."}</div>
    <div className="adhanList">
      {prayers.map(p=><div key={p.id}>
        <div><b>{p[lang]}</b><small>{adhan[p.id]?.ar||MUEZZINS[0].ar}</small></div>
        <button onClick={()=>setWorld("muezzins-"+p.id)}>{lang==="ar"?"تغيير":"Change"}</button>
      </div>)}
    </div>
    <div className="sectionLabel">{lang==="ar"?"سلوك Android":"ANDROID BEHAVIOUR"}</div>
    <div className="settingsRows">
      {["إشعار فقط","صوت قصير","أذان كامل","قبل الصلاة بـ ١٠ دقائق"].map((x,i)=><div key={x}><span>{lang==="ar"?x:["Notification only","Short sound","Full Adhan","10 min pre-prayer"][i]}</span><span className="status wait">{lang==="ar"?"يتطلب Android":"Android"}</span></div>)}
    </div>
    <DependencyNote lang={lang} textAr="تشغيل الأذان بالخلفية، reboot scheduling، DND وAudio Focus تحتاج Android Native." textEn="Background Adhan, reboot scheduling, DND and audio focus require native Android."/>
  </section>
}

function Muezzins({lang,setWorld,prayerId,adhan,setAdhan}){
  const [play,setPlay]=useState(null);
  return <section className="screen light">
    <BackHeader title={lang==="ar"?"اختيار المؤذن":"Choose Muezzin"} onBack={()=>setWorld("adhan")}/>
    <div className="rows reciterRows">
      {MUEZZINS.map(m=><div className="rowStatic" key={m.id}>
        <button className="playCircle" onClick={()=>setPlay(play===m.id?null:m.id)}><Icon name={play===m.id?"pause":"play"} size={16}/></button>
        <div className="grow"><b>{m[lang]}</b><small>{m[lang==="ar"?"sourceAr":"sourceEn"]}</small></div>
        <button className="selectPill" onClick={()=>{setAdhan(a=>({...a,[prayerId]:m})); setWorld("adhan")}}>{lang==="ar"?"اختيار":"Choose"}</button>
      </div>)}
    </div>
  </section>
}

function PrayerSettings({lang,setWorld}){
  const [method,setMethod]=usePersist("sk-method","MWL");
  const [asr,setAsr]=usePersist("sk-asr","standard");
  const [loc,setLoc]=useState("manual");
  return <section className="screen light">
    <BackHeader title={STR[lang].prayerSettings} onBack={()=>setWorld("prayer")}/>
    <Setting label={lang==="ar"?"الموقع":"Location"} value={loc==="manual"?(lang==="ar"?"يدوي — بغداد":"Manual — Baghdad"):(lang==="ar"?"تلقائي":"Automatic")} onClick={()=>setLoc(loc==="manual"?"auto":"manual")}/>
    <Setting label={lang==="ar"?"طريقة الحساب":"Calculation method"} value={method} onClick={()=>setMethod(method==="MWL"?"Umm al-Qura":method==="Umm al-Qura"?"ISNA":"MWL")}/>
    <Setting label={lang==="ar"?"طريقة العصر":"Asr method"} value={asr==="standard"?(lang==="ar"?"الجمهور":"Standard"):(lang==="ar"?"الحنفي":"Hanafi")} onClick={()=>setAsr(asr==="standard"?"hanafi":"standard")}/>
    <Setting label={lang==="ar"?"خطوط العرض العليا":"High latitude"} value={lang==="ar"?"منتصف الليل":"Middle of night"}/>
    <DependencyNote lang={lang} textAr="هذه إعدادات UI. محرك الحساب الإنتاجي يجب ربطه بمكتبة حساب موثوقة واختبارات مرجعية." textEn="These are UI settings. Production prayer calculations require a trusted calculation library and reference tests."/>
  </section>
}

function Explore({lang,setWorld}){
  const groups=[
    {titleAr:"العبادة",titleEn:"WORSHIP",items:[
      ["adhkar","spark","الأذكار","Adhkar","الصباح · المساء · النوم","Morning · evening · sleep"],
      ["dua","spark","الدعاء","Du'a","مأثور + شخصي","Sourced + private"],
      ["fasting","moon","الصيام","Fasting","رمضان وما تختاره أنت","Ramadan and user-selected contexts"],
      ["learning","book","تعلم","Learn","الوضوء · الصلاة · التجويد","Wudu · prayer · Tajweed"],
    ]},
    {titleAr:"المعرفة",titleEn:"KNOWLEDGE",items:[
      ["trust","shield","المصادر والثقة","Trust & Sources","لماذا؟ من أين؟ كيف تحقق؟","Why? source? verification?"],
      ["tafsir-hadith","book","التفسير والحديث","Tafsir & Hadith","مكتبتان منفصلتان","Two distinct libraries"],
      ["library","book","المكتبة الإسلامية","Islamic Library","كتب · خطب · دروس","Books · khutbahs · lessons"],
      ["teacher-imam","family","المعلم والإمام","Teacher & Imam","حلقة · إقامة · دروس","Circle · Iqamah · lessons"],
      ["scholar","book","وضع طالب العلم","Scholar Mode","تفسير · حديث · جذور · ملاحظات","Tafsir · Hadith · roots · notes"],
      ["archive","spark","ذاكرة الحضارة","Archive","سيرة · تاريخ · مخطوطات","Seerah · history · manuscripts"],
    ]},
    {titleAr:"الحياة",titleEn:"LIFE",items:[
      ["mosque","mosque","المسجد","Mosque","الإقامة · الجمعة · الحلقات","Iqamah · Friday · circles"],
      ["family","family","العائلة","Family","خاص بدون مراقبة العبادة","Private without worship surveillance"],
      ["kids","spark","سكينة للأطفال","Sakinah Kids","تعلم بلا إعلانات أو نقاط عبادة","Learning without ads or worship points"],
      ["journeys","compass","الحج والعمرة والسفر","Hajj, Umrah & Travel","Offline-minded","Offline-minded"],
    ]},
    {titleAr:"سكينة",titleEn:"SAKINAH",items:[
      ["search-all","search","البحث الشامل","Universal Search","محلي الآن، دلالي لاحقاً","Local now, semantic later"],
      ["moments","moon","الجمعة والعيد ورمضان","Friday, Eid & Ramadan","Moments موسمية موثقة","Trusted seasonal Moments"],
      ["hijri-zakat","spark","الهجري والزكاة","Hijri & Zakat","تقويم موثوق + حاسبة تعليمية","Trusted calendar + educational calculator"],
      ["intelligence","mic","Voice + Lens","Voice + Lens","أوامر · بحث · عدسة","Commands · search · lens"],
      ["offline","download","دون اتصال","Offline","حزم · تنزيلات · مزامنة","Packs · downloads · sync"],
      ["verification","shield","التحقق والنزاهة","Verification","إصدارات · checksum · rollback","Versions · checksum · rollback"],
      ["devices","home","الأجهزة","Devices","ساعة · ودجت · سيارة · شاشة","Watch · widgets · car · display"],
      ["corrections","shield","الإبلاغ والتصحيحات","Reports & Corrections","حلقة الثقة مع المستخدم","User trust feedback loop"],
    ]},
  ];
  return <section className="screen light exploreScreen">
    <PageTitle title={STR[lang].explore} sub={lang==="ar"?"كل هذا العمق موجود تحت سطح هادئ.":"All this depth stays beneath a calm surface."}/>
    {groups.map((g,gi)=><div className="exploreGroup" key={gi}>
      <div className="sectionLabel">{lang==="ar"?g.titleAr:g.titleEn}</div>
      {g.items.map((it,i)=><button className={i===0?"featured":""} key={it[0]} onClick={()=>setWorld(it[0])}>
        <Icon name={it[1]} size={i===0?21:18}/><div><b>{lang==="ar"?it[2]:it[3]}</b><small>{lang==="ar"?it[4]:it[5]}</small></div><Icon name="chevron" size={14}/>
      </button>)}
    </div>)}
  </section>
}

function Adhkar({lang,setWorld}){
  return <section className="screen light"><BackHeader title={lang==="ar"?"الأذكار":"Adhkar"} onBack={()=>setWorld("explore")}/>
    <div className="focusList">
      {[
        ["الصباح","Morning"],["المساء","Evening"],["بعد الصلاة","After prayer"],["النوم","Sleep"],["الاستيقاظ","Waking"],["السفر","Travel"]
      ].map((x,i)=><button key={i}><b>{x[lang==="ar"?0:1]}</b><small>{i<2?(lang==="ar"?"مثال قرآن متاح؛ بقية النصوص تحتاج مصدر حديث موثوق":"Quran examples available; Prophetic texts require verified Hadith source"):STR[lang].notConnected}</small></button>)}
    </div>
  </section>
}

function Dua({lang,setWorld}){
  const [tab,setTab]=useState("sourced"), [note,setNote]=usePersist("sk-dua","");
  return <section className="screen light"><BackHeader title={lang==="ar"?"الدعاء":"Du'a"} onBack={()=>setWorld("explore")}/>
    <Segment value={tab} setValue={setTab} items={[["sourced",lang==="ar"?"المأثور":"Sourced"],["private",lang==="ar"?"دعائي":"My Du'a"]]}/>
    {tab==="sourced"?<div className="emptySource"><Icon name="shield" size={28}/><b>{STR[lang].notConnected}</b><small>{lang==="ar"?"لا نملأ أدعية السنة من الذاكرة. اربط قاعدة موثقة أولاً.":"We do not fill Prophetic Du'a from memory. Connect a verified source first."}</small></div>
    :<textarea className="privateNote" value={note} onChange={e=>setNote(e.target.value)} placeholder={lang==="ar"?"مساحتك الخاصة — لا تُعرض كمصدر ديني":"Your private space — never shown as a religious source"}/>}
  </section>
}

function Trust({lang,setWorld}){
  return <section className="screen light"><BackHeader title={lang==="ar"?"المصادر والثقة":"Trust & Sources"} onBack={()=>setWorld("explore")}/>
    <div className="trustHero"><Icon name="shield" size={28}/><h2>{lang==="ar"?"الثقة نفسها ميزة":"Trust is a feature"}</h2><p>{lang==="ar"?"كل معلومة حساسة تعرف نوعها، مصدرها، إصدارها، وحالة مراجعتها.":"Every sensitive claim knows its type, source, version and review state."}</p></div>
    <div className="trustTypes">
      {[
        ["القرآن","QURAN","ثابت · لا يولده AI","Immutable · never AI-generated","ok"],
        ["الحديث","HADITH","مجموعة · مرجع · تصنيف · مصدر","Collection · ref · grade · source","wait"],
        ["التفسير","TAFSIR","الكتاب · المؤلف · الإصدار","Work · author · version","wait"],
        ["شرح AI","AI EXPLANATION","موسوم دائماً ومربوط بمصادر","Always labelled and sourced","wait"],
      ].map(x=><div key={x[1]}><b>{lang==="ar"?x[0]:x[1]}</b><small>{lang==="ar"?x[2]:x[3]}</small><span className={"status "+x[4]}>{x[4]==="ok"?(lang==="ar"?"محمي":"Protected"):STR[lang].notConnected}</span></div>)}
    </div>
    <div className="whyBox"><b>{lang==="ar"?"لماذا وقت الفجر هكذا؟":"Why is Fajr at this time?"}</b><p>{lang==="ar"?"سيعرض الموقع، المنطقة الزمنية، طريقة الحساب، الزوايا والتعديلات.":"Shows location, timezone, calculation method, angles and adjustments."}</p></div>
    <button className="primaryAction" onClick={()=>setWorld("source-inspector")}>{lang==="ar"?"افتح مفتش المصدر":"Open Source Inspector"}</button>
  </section>
}


function SearchAll({lang,setWorld}){
  const [q,setQ]=useState("");
  const items=[
    ["quran-reader","book","الفاتحة","Al-Fātiḥah","القرآن","Quran"],
    ["prayer","compass","الصلاة","Prayer","أداة","App action"],
    ["qibla","compass","القبلة","Qibla","أداة","App action"],
    ["adhkar","spark","الأذكار","Adhkar","عبادة","Worship"],
    ["dua","spark","الدعاء","Du'a","عبادة","Worship"],
    ["mosque","mosque","المسجد","Mosque","حياة","Life"],
    ["journeys","compass","الحج والعمرة","Hajj & Umrah","رحلة","Journey"],
    ["trust","shield","المصادر والثقة","Trust & Sources","ثقة","Trust"],
    ["library","book","المكتبة الإسلامية","Islamic Library","معرفة","Knowledge"],
  ];
  const norm=s=>s.toLowerCase().replace(/[ًٌٍَُِّْـ]/g,"");
  const filtered=q.trim()?items.filter(x=>norm(x[2]+" "+x[3]+" "+x[4]+" "+x[5]).includes(norm(q))):items;
  return <section className="screen light">
    <BackHeader title={lang==="ar"?"البحث الشامل":"Universal Search"} onBack={()=>setWorld("explore")}/>
    <input autoFocus className="searchInput searchBig" value={q} onChange={e=>setQ(e.target.value)} placeholder={lang==="ar"?"قرآن، صلاة، قبلة، مسجد…":"Quran, prayer, Qibla, mosque…"} />
    <div className="searchResults">
      {filtered.map(x=><button key={x[0]} onClick={()=>setWorld(x[0])}><Icon name={x[1]} size={18}/><div><b>{lang==="ar"?x[2]:x[3]}</b><small>{lang==="ar"?x[4]:x[5]}</small></div><Icon name="chevron" size={14}/></button>)}
      {!filtered.length&&<div className="emptySource"><Icon name="search" size={26}/><b>{lang==="ar"?"لا نتائج محلية":"No local results"}</b><small>{lang==="ar"?"البحث الدلالي بالمصادر الدينية يحتاج فهرساً موثوقاً.":"Semantic religious search requires a trusted index."}</small></div>}
    </div>
  </section>
}

function Moments({lang,setWorld}){
  const [moment,setMoment]=usePersist("sk-moment","friday");
  const data={
    friday:{ar:"الجمعة",en:"Friday",heroAr:"يوم مختلف، بدون أن يتحول إلى Theme.",heroEn:"A distinct day without becoming a decorative theme.",itemsAr:["سورة الكهف","وقت الجمعة من المسجد عند توفره","محتوى الجمعة الموثق"],itemsEn:["Surah Al-Kahf","Verified mosque Friday time","Sourced Friday content"]},
    eid:{ar:"العيد",en:"Eid",heroAr:"Moment موسمي يُفعّل فقط من تقويم موثوق.",heroEn:"A seasonal Moment activated only by a trusted calendar.",itemsAr:["صلاة العيد","المصلى/المسجد","التكبيرات من مصدر موثوق"],itemsEn:["Eid prayer","Verified prayer ground/mosque","Takbir from a trusted source"]},
    ramadan:{ar:"رمضان",en:"Ramadan",heroAr:"السحور والإفطار والختمة وآخر عشر ليالٍ كمنظومة واحدة.",heroEn:"Suhoor, Iftar, Quran plan and last ten nights as one system.",itemsAr:["السحور والإفطار","خطة ختمة مرنة","آخر عشر ليالٍ"],itemsEn:["Suhoor & Iftar","Adaptive Khatmah plan","Last ten nights"]}
  };
  const m=data[moment];
  return <section className="screen light">
    <BackHeader title={lang==="ar"?"اللحظات":"Moments"} onBack={()=>setWorld("explore")}/>
    <Segment value={moment} setValue={setMoment} items={Object.entries(data).map(([k,v])=>[k,lang==="ar"?v.ar:v.en])}/>
    <div className="momentHero"><span></span><h2>{lang==="ar"?m.ar:m.en}</h2><p>{lang==="ar"?m.heroAr:m.heroEn}</p></div>
    <div className="focusList">{(lang==="ar"?m.itemsAr:m.itemsEn).map((x,i)=><button key={i} onClick={()=>moment==="ramadan"&&i===0?setWorld("ramadan-center"):null}><b>{x}</b><small>{moment==="ramadan"&&i===0?(lang==="ar"?"فتح تجربة رمضان":"Open Ramadan experience"):STR[lang].notConnected}</small></button>)}</div>
    <DependencyNote lang={lang} textAr="التفعيل التلقائي للمناسبات يحتاج مزود تقويم هجري موثوق." textEn="Automatic religious occasions require a trusted Hijri calendar provider."/>
  </section>
}

function HijriZakat({lang,setWorld}){
  const [cash,setCash]=useState("0"),[gold,setGold]=useState("0"),[business,setBusiness]=useState("0"),[nisab,setNisab]=useState("0");
  const total=[cash,gold,business].reduce((a,v)=>a+(parseFloat(v)||0),0);
  const n=parseFloat(nisab)||0;
  const due=n>0 && total>=n ? total*0.025 : 0;
  return <section className="screen light">
    <BackHeader title={lang==="ar"?"الهجري والزكاة":"Hijri & Zakat"} onBack={()=>setWorld("explore")}/>
    <div className="hijriCard"><span>{lang==="ar"?"التاريخ الهجري":"Hijri date"}</span><b>{lang==="ar"?"بانتظار مزود موثوق":"Trusted provider required"}</b><small>{lang==="ar"?"لا نخمن التاريخ الهجري من الذاكرة.":"We do not guess Hijri dates from memory."}</small></div>
    <div className="sectionLabel">{lang==="ar"?"حاسبة تعليمية":"EDUCATIONAL CALCULATOR"}</div>
    <div className="calcGrid">
      <label><span>{lang==="ar"?"النقد":"Cash"}</span><input value={cash} onChange={e=>setCash(e.target.value)} inputMode="decimal"/></label>
      <label><span>{lang==="ar"?"الذهب/القيمة المدخلة":"Gold / entered value"}</span><input value={gold} onChange={e=>setGold(e.target.value)} inputMode="decimal"/></label>
      <label><span>{lang==="ar"?"أصول العمل":"Business assets"}</span><input value={business} onChange={e=>setBusiness(e.target.value)} inputMode="decimal"/></label>
      <label><span>{lang==="ar"?"النصاب الذي تعتمد عليه":"Your chosen Nisab threshold"}</span><input value={nisab} onChange={e=>setNisab(e.target.value)} inputMode="decimal"/></label>
    </div>
    <div className="zakatResult"><small>{lang==="ar"?"المجموع":"Total"}</small><b>{digits(total.toFixed(2),lang)}</b><small>{lang==="ar"?"الناتج التعليمي ٢.٥٪ عند بلوغ النصاب المدخل":"Educational 2.5% result when entered Nisab is met"}</small><strong>{digits(due.toFixed(2),lang)}</strong></div>
    <DependencyNote lang={lang} textAr="ليست فتوى ولا حاسبة نهائية للحالات المعقدة؛ المنهج والنصاب والمصادر يجب ربطها بمراجعة مختصة." textEn="Not a fatwa or final calculator for complex cases; methodology, Nisab and sources require expert review."/>
  </section>
}

function MosqueInteractive({lang,setWorld}){
  const [name,setName]=usePersist("sk-mosque-name",lang==="ar"?"مسجدي":"My Mosque");
  const [iqamah,setIqamah]=usePersist("sk-iqamah",{fajr:"05:10",dhuhr:"13:30",asr:"17:15",maghrib:"19:48",isha:"21:25"});
  const [mode,setMode]=usePersist("sk-mosque-mode",false);
  return <section className="screen light">
    <BackHeader title={lang==="ar"?"المسجد":"Mosque"} onBack={()=>setWorld("explore")}/>
    <div className="mosqueHero"><Icon name="mosque" size={28}/><input value={name} onChange={e=>setName(e.target.value)}/><small>{lang==="ar"?"إعداد محلي — لا يعني أن المسجد موثّق":"Local setting — does not mean the mosque is verified"}</small></div>
    <div className="sectionLabel">{lang==="ar"?"الإقامة المحلية":"LOCAL IQAMAH"}</div>
    <div className="iqamahGrid">{PRAYERS.filter(p=>!p.sun).map(p=><label key={p.id}><span>{p[lang]}</span><input value={iqamah[p.id]||""} onChange={e=>setIqamah(v=>({...v,[p.id]:e.target.value}))}/></label>)}</div>
    <Toggle label={lang==="ar"?"وضع المسجد الهادئ":"Quiet Mosque Mode"} on={mode} setOn={setMode}/>
    <div className="focusList">
      <button><b>{lang==="ar"?"الجمعة والخطبة":"Friday & Khutbah"}</b><small>{STR[lang].notConnected}</small></button>
      <button><b>{lang==="ar"?"حلقة القرآن":"Quran circle"}</b><small>{lang==="ar"?"مساحة خاصة للمعلم والطلاب":"Private teacher/student space"}</small></button>
      <button onClick={()=>setWorld("mosque-friday")}><b>{lang==="ar"?"الجمعة والخطبة":"Friday & Khutbah"}</b><small>{lang==="ar"?"بيانات المسجد الموثقة":"Verified mosque data"}</small></button>
      <button onClick={()=>setWorld("corrections")}><b>{lang==="ar"?"الإبلاغ عن خطأ في بيانات المسجد":"Report mosque data issue"}</b><small>{lang==="ar"?"لا يعدّل المستخدم البيانات مباشرة":"User reports; does not directly edit verified data"}</small></button>
    </div>
  </section>
}

function FamilyInteractive({lang,setWorld}){
  const [members,setMembers]=usePersist("sk-family",[]);
  const [name,setName]=useState("");
  const add=()=>{const n=name.trim();if(!n)return;setMembers(m=>[...m,{id:Date.now(),name:n,type:"child"}]);setName("")};
  return <section className="screen light">
    <BackHeader title={lang==="ar"?"العائلة":"Family"} onBack={()=>setWorld("explore")}/>
    <div className="heroStatement">{lang==="ar"?"مشاركة نافعة، بدون مراقبة العبادة.":"Useful sharing without worship surveillance."}</div>
    <div className="addFamily"><input value={name} onChange={e=>setName(e.target.value)} placeholder={lang==="ar"?"اسم ملف الطفل/العائلة":"Local child/family profile name"}/><button onClick={add}>+</button></div>
    <div className="familyCards">{members.map(m=><div key={m.id}><Icon name="family"/><b>{m.name}</b><small>{lang==="ar"?"ملف محلي · لا بريد · لا ترتيب عبادة":"Local profile · no email · no worship ranking"}</small><button onClick={()=>setMembers(x=>x.filter(y=>y.id!==m.id))}>×</button></div>)}</div>
    <div className="focusList">
      <button><b>{lang==="ar"?"خطة قرآن عائلية":"Family Quran plan"}</b><small>{lang==="ar"?"توزيع اختياري بدون كشف أداء الأفراد":"Optional distribution without exposing personal worship"}</small></button>
      <button onClick={()=>setWorld("kids")}><b>{lang==="ar"?"سكينة للأطفال":"Sakinah Kids"}</b><small>{lang==="ar"?"عالم مستقل آمن":"Separate safe child world"}</small></button>
    </div>
  </section>
}

function KidsInteractive({lang,setWorld}){
  const [tab,setTab]=useState("quran");
  return <section className="screen kidsScreen">
    <BackHeader title={lang==="ar"?"سكينة للأطفال":"Sakinah Kids"} onBack={()=>setWorld("family")}/>
    <div className="kidsSun"><span></span></div>
    <h1>{lang==="ar"?"نتعلم بهدوء":"Learn gently"}</h1>
    <Segment value={tab} setValue={setTab} items={[["quran",lang==="ar"?"القرآن":"Quran"],["stories",lang==="ar"?"القصص":"Stories"],["prayer",lang==="ar"?"الصلاة":"Prayer"]]}/>
    <div className="kidsFeature">
      {tab==="quran"&&<><Icon name="book" size={34}/><b>{lang==="ar"?"استماع وحفظ مناسب للعمر":"Age-appropriate listening & memorization"}</b><small>{lang==="ar"?"لا نقاط للعبادة ولا streaks":"No worship points or streaks"}</small></>}
      {tab==="stories"&&<><Icon name="spark" size={34}/><b>{lang==="ar"?"قصص الأنبياء والسيرة":"Prophet stories & Seerah"}</b><small>{lang==="ar"?"بدون تصوير الأنبياء، وبمصادر مراجعة":"No depiction of Prophets; reviewed sources"}</small></>}
      {tab==="prayer"&&<><Icon name="compass" size={34}/><b>{lang==="ar"?"تعلم الوضوء والصلاة":"Learn Wudu & Prayer"}</b><small>{lang==="ar"?"تعليم بصري وصوتي بلا تقييم ديني للشخص":"Visual/audio learning without judging religiosity"}</small></>}
    </div>
  </section>
}

function JourneysInteractive({lang,setWorld}){
  const [kind,setKind]=useState("hajj"),[step,setStep]=useState(0);
  const data={
    hajj:{ar:"الحج",en:"Hajj",stepsAr:["الاستعداد","الإحرام","منى","عرفة","مزدلفة","الجمرات","الإكمال"],stepsEn:["Prepare","Ihram","Mina","Arafat","Muzdalifah","Jamarat","Completion"]},
    umrah:{ar:"العمرة",en:"Umrah",stepsAr:["الاستعداد","الإحرام","الميقات","الطواف","السعي","الإكمال"],stepsEn:["Prepare","Ihram","Miqat","Tawaf","Sa'i","Completion"]},
    travel:{ar:"السفر",en:"Travel",stepsAr:["المدينة","الحزمة Offline","المواقيت","القبلة","العودة"],stepsEn:["City","Offline pack","Prayer times","Qibla","Return"]}
  };
  const d=data[kind], steps=lang==="ar"?d.stepsAr:d.stepsEn;
  useEffect(()=>setStep(0),[kind]);
  return <section className="screen journeyScreen">
    <BackHeader title={lang==="ar"?"الرحلات":"Journeys"} onBack={()=>setWorld("explore")} dark/>
    <Segment value={kind} setValue={setKind} items={Object.entries(data).map(([k,v])=>[k,lang==="ar"?v.ar:v.en])}/>
    <div className="journeyProgress"><span style={{width:`${((step+1)/steps.length)*100}%`}}/></div>
    <div className="journeyStep"><small>{digits(step+1,lang)} / {digits(steps.length,lang)}</small><h2>{steps[step]}</h2><p>{lang==="ar"?"الإرشاد التفصيلي لا يُملأ إلا من مصدر ديني موثّق ومراجع.":"Detailed religious guidance is only populated from reviewed trusted sources."}</p></div>
    <div className="journeyNav"><button disabled={step===0} onClick={()=>setStep(s=>Math.max(0,s-1))}>{lang==="ar"?"السابق":"Previous"}</button><button disabled={step===steps.length-1} onClick={()=>setStep(s=>Math.min(steps.length-1,s+1))}>{lang==="ar"?"التالي":"Next"}</button></div>
    <div className="journeyTools"><button onClick={()=>setWorld(kind==="travel"?"offline":"hajj-umrah-details")}><Icon name={kind==="travel"?"download":"spark"}/><span>{kind==="travel"?(lang==="ar"?"حزمة Offline":"Offline pack"):(lang==="ar"?"الدليل الكامل":"Full guide")}</span></button><button onClick={()=>setWorld("qibla")}><Icon name="compass"/><span>{STR[lang].qibla}</span></button></div>
  </section>
}

function Corrections({lang,setWorld}){
  const [type,setType]=useState("source"),[msg,setMsg]=useState(""),[sent,setSent]=useState(false);
  return <section className="screen light">
    <BackHeader title={lang==="ar"?"الإبلاغ والتصحيحات":"Reports & Corrections"} onBack={()=>setWorld("explore")}/>
    <div className="heroStatement">{lang==="ar"?"الخطأ الديني لا يُدفن. يُبلّغ، يُراجع، ويُصحح بإصدار واضح.":"Religious errors are reported, reviewed and corrected transparently."}</div>
    <Segment value={type} setValue={setType} items={[["source",lang==="ar"?"مصدر":"Source"],["mosque",lang==="ar"?"مسجد":"Mosque"],["app",lang==="ar"?"تطبيق":"App"]]}/>
    <textarea className="privateNote correctionBox" value={msg} onChange={e=>setMsg(e.target.value)} placeholder={lang==="ar"?"صف المشكلة بدقة…":"Describe the issue precisely…"}/>
    <button className="primaryAction" onClick={()=>{if(msg.trim())setSent(true)}}>{sent?(lang==="ar"?"تم حفظ البلاغ محلياً":"Report saved locally"):(lang==="ar"?"إرسال للمراجعة":"Submit for review")}</button>
    <DependencyNote lang={lang} textAr="حالياً يُحفظ كنموذج محلي؛ إرسال البلاغ الحقيقي يحتاج Backend ونظام مراجعين." textEn="Currently a local prototype state; real submission requires a backend and reviewer workflow."/>
  </section>
}

function PreparePrayer({lang,setWorld}){
  const [quiet,setQuiet]=useState(true),[wudu,setWudu]=useState(false);
  return <section className="screen prepareScreen">
    <BackHeader title={lang==="ar"?"الاستعداد للصلاة":"Prepare for Prayer"} onBack={()=>setWorld("prayer")} dark/>
    <div className="prepareLight"></div>
    <h2>{lang==="ar"?"المغرب يقترب":"Maghrib approaches"}</h2>
    <p>{lang==="ar"?"هذه الحالة اختيارية. تقلل ضوضاء سكينة وتضع الأدوات المهمة أمامك فقط.":"This is optional. It quiets Sakinah and brings only relevant tools forward."}</p>
    <Toggle label={lang==="ar"?"هدوء سكينة":"Quiet Sakinah"} on={quiet} setOn={setQuiet}/>
    <Toggle label={lang==="ar"?"تذكير بالوضوء":"Wudu reminder"} on={wudu} setOn={setWudu}/>
    <div className="prepareActions"><button onClick={()=>setWorld("qibla")}><Icon name="compass"/><span>{STR[lang].qibla}</span></button><button onClick={()=>setWorld("learning")}><Icon name="spark"/><span>{lang==="ar"?"الوضوء":"Wudu"}</span></button><button onClick={()=>setWorld("mosque")}><Icon name="mosque"/><span>{lang==="ar"?"الإقامة":"Iqamah"}</span></button></div>
  </section>
}

function PublicDisplay({lang,setWorld}){
  return <section className="screen publicDisplay">
    <BackHeader title={lang==="ar"?"العرض العام":"Public Display"} onBack={()=>setWorld("devices")} dark/>
    <div className="publicClock">{digits("19:12",lang)}</div>
    <div className="publicPrayer"><small>{lang==="ar"?"الصلاة القادمة":"NEXT PRAYER"}</small><b>{lang==="ar"?"المغرب":"Maghrib"}</b><span>{digits("19:42",lang)}</span></div>
    <DayLightArc hour={19.2} compact dark/>
    <div className="publicInfo"><span>{lang==="ar"?"الإقامة":"Iqamah"}</span><b>{digits("19:50",lang)}</b></div>
    <DependencyNote dark lang={lang} textAr="عرض مفاهيمي للبيت/المسجد بدون أي بيانات شخصية." textEn="Conceptual home/mosque display with no personal data."/>
  </section>
}


function QuranCompanion({lang,setWorld}){
  const [plan,setPlan]=usePersist("sk-quran-plan",{type:"30",days:30,progress:4});
  const [queue,setQueue]=usePersist("sk-review-queue",[
    {id:1,surah:"الفاتحة",ayah:2,state:"review"},
    {id:2,surah:"الملك",ayah:1,state:"comfortable"},
  ]);
  const [note,setNote]=usePersist("sk-quran-note","");
  const changePlan=()=>setPlan(p=>p.type==="30"?{type:"90",days:90,progress:p.progress}:{type:"custom",days:45,progress:p.progress}:{type:"30",days:30,progress:p.progress});
  return <section className="screen light">
    <BackHeader title={lang==="ar"?"رفيق القرآن":"Quran Companion"} onBack={()=>setWorld("quran")}/>
    <div className="companionHero">
      <small>{lang==="ar"?"استمرارك":"YOUR CONTINUITY"}</small>
      <h2>{SURAH.ar}</h2>
      <p>{lang==="ar"?"الآية ٢ · آخر قراءة اليوم":"Ayah 2 · last read today"}</p>
      <button onClick={()=>setWorld("quran-reader")}>{lang==="ar"?"نكمل من هنا":"Continue from here"}</button>
    </div>
    <div className="sectionLabel">{lang==="ar"?"خطة القراءة":"READING PLAN"}</div>
    <div className="planCard">
      <div><b>{plan.type==="30"?(lang==="ar"?"ختمة ٣٠ يوماً":"30-day plan"):plan.type==="90"?(lang==="ar"?"ختمة ٩٠ يوماً":"90-day plan"):(lang==="ar"?"خطة مخصصة":"Custom plan")}</b><small>{lang==="ar"?"تتكيف بدون لوم إذا فات يوم":"Adapts without guilt when a day is missed"}</small></div>
      <button onClick={changePlan}>{lang==="ar"?"تغيير":"Change"}</button>
      <div className="planProgress"><span style={{width:`${Math.min(100,(plan.progress/plan.days)*100)}%`}}/></div>
    </div>
    <div className="sectionLabel">{lang==="ar"?"مراجعة الحفظ":"MEMORIZATION REVIEW"}</div>
    <div className="reviewQueue">
      {queue.map((x,i)=><div key={x.id}><div><b>{x.surah} · {digits(x.ayah,lang)}</b><small>{x.state==="review"?(lang==="ar"?"تحتاج مراجعة":"Needs review"):(lang==="ar"?"مطمئن":"Comfortable")}</small></div><button onClick={()=>setQueue(q=>q.map(y=>y.id===x.id?{...y,state:y.state==="review"?"comfortable":"review"}:y))}>{x.state==="review"?"○":"✓"}</button></div>)}
    </div>
    <div className="sectionLabel">{lang==="ar"?"ملاحظة خاصة":"PRIVATE NOTE"}</div>
    <textarea className="privateNote companionNote" value={note} onChange={e=>setNote(e.target.value)} placeholder={lang==="ar"?"ملاحظة شخصية منفصلة تماماً عن التفسير والمصدر":"A private note, always separate from Tafsir and source text"}/>
  </section>
}

const LIBRARY_DATA = [
  {id:"b1",type:"book",ar:"كتاب تجريبي 01",en:"Demo Book 01",authorAr:"مصدر موثوق مطلوب",authorEn:"Trusted source required"},
  {id:"k1",type:"khutbah",ar:"خطبة الجمعة",en:"Friday Khutbah",authorAr:"مسجد موثّق مطلوب",authorEn:"Verified mosque source required"},
  {id:"l1",type:"lesson",ar:"درس في السيرة",en:"Seerah Lesson",authorAr:"مصدر وترخيص مطلوبان",authorEn:"Source and license required"},
  {id:"m1",type:"manuscript",ar:"مخطوطة",en:"Manuscript",authorAr:"أرشيف مرخّص مطلوب",authorEn:"Licensed archive required"},
];

function IslamicLibraryInteractive({lang,setWorld}){
  const [q,setQ]=useState(""),[type,setType]=useState("all"),[saved,setSaved]=usePersist("sk-library-saved",{});
  const norm=s=>s.toLowerCase();
  const rows=LIBRARY_DATA.filter(x=>(type==="all"||x.type===type)&&(!q||norm((x.ar+" "+x.en)).includes(norm(q))));
  return <section className="screen light">
    <BackHeader title={lang==="ar"?"المكتبة الإسلامية":"Islamic Library"} onBack={()=>setWorld("explore")}/>
    <input className="searchInput" value={q} onChange={e=>setQ(e.target.value)} placeholder={lang==="ar"?"ابحث في الكتب والخطب والدروس…":"Search books, khutbahs and lessons…"} />
    <Segment value={type} setValue={setType} items={[["all",lang==="ar"?"الكل":"All"],["book",lang==="ar"?"كتب":"Books"],["khutbah",lang==="ar"?"خطب":"Khutbahs"],["lesson",lang==="ar"?"دروس":"Lessons"]]}/>
    <div className="libraryGrid">{rows.map(x=><article key={x.id}><div className="libraryType">{x.type}</div><h3>{lang==="ar"?x.ar:x.en}</h3><p>{lang==="ar"?x.authorAr:x.authorEn}</p><button onClick={()=>setSaved(s=>({...s,[x.id]:!s[x.id]}))}>{saved[x.id]?(lang==="ar"?"محفوظ":"Saved"):(lang==="ar"?"حفظ":"Save")}</button></article>)}</div>
    <DependencyNote lang={lang} textAr="المحتوى هنا هيكل تفاعلي فقط؛ الكتب والخطب والدروس الحقيقية تحتاج مصادر وحقوق واضحة." textEn="This is interactive structure only; real books, khutbahs and lessons require explicit sources and rights."/>
  </section>
}

function ScholarWorkspace({lang,setWorld}){
  const [tab,setTab]=useState("tafsir"),[note,setNote]=usePersist("sk-scholar-note","");
  return <section className="screen light scholarWorkspace">
    <BackHeader title={lang==="ar"?"وضع طالب العلم":"Scholar Workspace"} onBack={()=>setWorld("explore")}/>
    <div className="scholarAyah">الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ <span>{digits("٢",lang)}</span></div>
    <Segment value={tab} setValue={setTab} items={[["tafsir",lang==="ar"?"تفسير":"Tafsir"],["hadith",lang==="ar"?"حديث":"Hadith"],["roots",lang==="ar"?"جذور":"Roots"],["notes",lang==="ar"?"ملاحظات":"Notes"]]}/>
    <div className="scholarPanel">
      {tab==="tafsir"&&<><h3>{lang==="ar"?"مقارنة التفاسير":"Tafsir comparison"}</h3><div className="compareCols"><div><b>{lang==="ar"?"تفسير A":"Tafsir A"}</b><p>{STR[lang].notConnected}</p></div><div><b>{lang==="ar"?"تفسير B":"Tafsir B"}</b><p>{STR[lang].notConnected}</p></div></div></>}
      {tab==="hadith"&&<><h3>{lang==="ar"?"الأحاديث المرتبطة":"Related Hadith"}</h3><div className="emptySource compactEmpty"><Icon name="shield"/><small>{lang==="ar"?"لا روابط بدون قاعدة حديث موثقة.":"No links without a trusted Hadith database."}</small></div></>}
      {tab==="roots"&&<><h3>{lang==="ar"?"الجذر واللغة":"Root & language"}</h3><div className="rootChip">ح م د</div><p className="scholarMuted">{lang==="ar"?"التفاصيل الصرفية تحتاج Dataset لغوي موثوق.":"Morphology details require a trusted linguistic dataset."}</p></>}
      {tab==="notes"&&<textarea className="privateNote" value={note} onChange={e=>setNote(e.target.value)} placeholder={lang==="ar"?"ملاحظاتك الخاصة…":"Your private study notes…"}/>}
    </div>
  </section>
}

function TeacherImam({lang,setWorld}){
  const [mode,setMode]=useState("teacher"),[title,setTitle]=useState(""),[items,setItems]=usePersist("sk-teacher-items",[]);
  const add=()=>{if(!title.trim())return;setItems(x=>[...x,{id:Date.now(),title:title.trim(),mode}]);setTitle("")};
  return <section className="screen light">
    <BackHeader title={lang==="ar"?"المعلم والإمام":"Teacher & Imam"} onBack={()=>setWorld("explore")}/>
    <Segment value={mode} setValue={setMode} items={[["teacher",lang==="ar"?"معلم":"Teacher"],["imam",lang==="ar"?"إمام/مسجد":"Imam/Mosque"]]}/>
    <div className="heroStatement">{mode==="teacher"?(lang==="ar"?"مساحة خاصة للحلقة والواجبات، بدون تقييم عبادة.":"Private class assignments without worship scoring."):(lang==="ar"?"إدارة الإقامة والدروس والإعلانات تحتاج هوية مسجد موثّقة.":"Iqamah, lessons and announcements require verified mosque identity.")}</div>
    <div className="assignmentAdd"><input value={title} onChange={e=>setTitle(e.target.value)} placeholder={mode==="teacher"?(lang==="ar"?"مثلاً: مراجعة الفاتحة":"e.g. Review Al-Fatihah"):(lang==="ar"?"مثلاً: درس بعد المغرب":"e.g. Lesson after Maghrib")}/><button onClick={add}>+</button></div>
    <div className="assignmentList">{items.filter(x=>x.mode===mode).map(x=><div key={x.id}><b>{x.title}</b><small>{mode==="teacher"?(lang==="ar"?"خاص بالمجموعة":"Private group item"):(lang==="ar"?"غير منشور — يحتاج توثيق":"Unpublished — verification required")}</small><button onClick={()=>setItems(a=>a.filter(y=>y.id!==x.id))}>×</button></div>)}</div>
  </section>
}

function PrivacyDataCenter({lang,setWorld}){
  const [ai,setAi]=usePersist("sk-ai-mode","local"),[guest,setGuest]=usePersist("sk-guest",false),[sync,setSync]=usePersist("sk-sync",false),[exported,setExported]=useState(false);
  const doExport=()=>{
    const data={version:1,reading:{surah:1,ayah:2},preferences:{lang,aiMode:ai},guestMode:guest};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url;a.download="sakinah-personal-data.json";a.click();URL.revokeObjectURL(url);setExported(true);
  };
  return <section className="screen light">
    <BackHeader title={lang==="ar"?"الخصوصية والبيانات":"Privacy & Data"} onBack={()=>setWorld("me")}/>
    <Toggle label={lang==="ar"?"وضع الضيف":"Guest mode"} on={guest} setOn={setGuest}/>
    <Toggle label={lang==="ar"?"مزامنة مشفرة اختيارية":"Optional encrypted sync"} on={sync} setOn={setSync}/>
    <div className="sectionLabel">{lang==="ar"?"وضع الذكاء":"AI MODE"}</div>
    <Segment value={ai} setValue={setAi} items={[["local",lang==="ar"?"محلي":"Local"],["cloud",lang==="ar"?"سحابة موثوقة":"Trusted cloud"],["off","AI Off"]]}/>
    <div className="privacyActions">
      <button onClick={doExport}><Icon name="download"/><span>{exported?(lang==="ar"?"تم تصدير نسخة":"Exported"):(lang==="ar"?"تصدير بياناتي":"Export my data")}</span></button>
      <button onClick={()=>{localStorage.clear();location.reload()}}><Icon name="shield"/><span>{lang==="ar"?"حذف البيانات المحلية":"Delete local data"}</span></button>
    </div>
    <div className="privacyExplain">
      {[
        ["الموقع","Location","لحساب الصلاة والقبلة عند الطلب","For prayer/Qibla when requested"],
        ["سجل القراءة","Reading history","محلي لاستكمال القراءة","Local for continuity"],
        ["الصوت","Audio","لا يُرفع تسجيلك تلقائياً","Your recordings are never auto-uploaded"],
        ["AI","AI","لا ملف نفسي ولا درجة تدين","No psychological/religiosity profiling"],
      ].map(x=><div key={x[1]}><b>{lang==="ar"?x[0]:x[1]}</b><small>{lang==="ar"?x[2]:x[3]}</small></div>)}
    </div>
  </section>
}

function WidgetGallery({lang,setWorld}){
  return <section className="screen light">
    <BackHeader title={lang==="ar"?"ودجت سكينة":"Sakinah Widgets"} onBack={()=>setWorld("devices")}/>
    <div className="widgetGallery">
      <div className="widgetCard prayerWidget"><small>{lang==="ar"?"المغرب":"Maghrib"}</small><b>{digits("19:42",lang)}</b><span>{lang==="ar"?"٣٠ د متبقٍ":"30m remaining"}</span></div>
      <div className="widgetCard arcWidget"><DayLightArc hour={18.9} compact/><small>{lang==="ar"?"قوس الضوء":"Day Light"}</small></div>
      <div className="widgetCard quranWidget"><Icon name="book"/><b>{SURAH.ar}</b><small>{lang==="ar"?"متابعة القراءة":"Continue reading"}</small></div>
      <div className="widgetCard ramadanWidget"><Icon name="moon"/><b>{lang==="ar"?"رمضان":"Ramadan"}</b><small>{lang==="ar"?"سحور · إفطار":"Suhoor · Iftar"}</small></div>
    </div>
    <DependencyNote lang={lang} textAr="هذه معاينات داخل التطبيق؛ الودجت الحقيقي يحتاج Android App Widgets." textEn="These are in-app previews; real widgets require Android App Widgets."/>
  </section>
}

function TabletPreview({lang,setWorld}){
  return <section className="screen tabletScreen">
    <BackHeader title={lang==="ar"?"معاينة التابلت":"Tablet Preview"} onBack={()=>setWorld("devices")}/>
    <div className="tabletFrame">
      <aside><div className="brandMark"><span></span><b>سكينة</b></div>{["القرآن","التفسير","الحديث","الملاحظات"].map((x,i)=><button className={i===0?"on":""} key={x}>{lang==="ar"?x:["Quran","Tafsir","Hadith","Notes"][i]}</button>)}</aside>
      <div className="tabletQuran"><small>{SURAH.ar}</small><div>الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ</div></div>
      <div className="tabletSide"><h3>{lang==="ar"?"التفسير":"Tafsir"}</h3><p>{STR[lang].notConnected}</p><h3>{lang==="ar"?"ملاحظة":"Note"}</h3><textarea placeholder={lang==="ar"?"ملاحظة خاصة":"Private note"}/></div>
    </div>
  </section>
}


function SourceInspector({lang,setWorld}){
  const [kind,setKind]=useState("quran");
  const data={
    quran:{ar:"القرآن",en:"Quran",rows:[
      ["السورة","Surah","الفاتحة","Al-Fātiḥah"],
      ["الآية","Ayah","٢","2"],
      ["حالة النص","Text status","نص تجريبي محدود داخل النموذج","Limited demo Quran text in prototype"],
      ["المصدر الإنتاجي","Production source","بانتظار Dataset قرآن موثّق","Verified Quran dataset required"],
    ]},
    hadith:{ar:"الحديث",en:"Hadith",rows:[
      ["المجموعة","Collection","بانتظار مصدر موثّق","Trusted source required"],
      ["المرجع","Reference","غير متصل","Not connected"],
      ["التصنيف","Grade","لا يُختلق","Never invented"],
      ["مصدر التصنيف","Grading source","يجب أن يكون صريحاً","Must be explicit"],
    ]},
    tafsir:{ar:"التفسير",en:"Tafsir",rows:[
      ["الكتاب","Work","بانتظار مكتبة موثّقة","Trusted library required"],
      ["المؤلف","Author","يُعرض دائماً","Always shown"],
      ["الإصدار","Version","يُحفظ مع المحتوى","Stored with content"],
      ["المقارنة","Comparison","لا دمج صامت","No silent blending"],
    ]},
  };
  const d=data[kind];
  return <section className="screen light">
    <BackHeader title={lang==="ar"?"مفتش المصدر":"Source Inspector"} onBack={()=>setWorld("trust")}/>
    <Segment value={kind} setValue={setKind} items={Object.entries(data).map(([k,v])=>[k,lang==="ar"?v.ar:v.en])}/>
    <div className="sourceSeal"><Icon name="shield" size={28}/><b>{lang==="ar"?d.ar:d.en}</b><small>{lang==="ar"?"كل نوع محتوى يبقى مميزاً بصرياً وتقنياً":"Each content type stays visually and technically distinct"}</small></div>
    <div className="sourceRows">{d.rows.map((r,i)=><div key={i}><span>{lang==="ar"?r[0]:r[1]}</span><b>{lang==="ar"?r[2]:r[3]}</b></div>)}</div>
  </section>
}

function TafsirHadithCenter({lang,setWorld}){
  const [tab,setTab]=useState("tafsir"),[query,setQuery]=useState("");
  const rows = tab==="tafsir"
    ? [
      ["تفسير 01","Tafsir 01","المؤلف/الإصدار مطلوبان","Author/version required"],
      ["تفسير 02","Tafsir 02","المقارنة تحفظ هوية المصدر","Comparison preserves source identity"],
    ]
    : [
      ["مجموعة حديث 01","Hadith Collection 01","المجموعة والكتاب والباب والمرجع","Collection, book, chapter, reference"],
      ["بحث بعبارة متذكّرة","Remembered wording lookup","يعرض مطابقات محتملة ولا يدعي التخريج النهائي","Shows candidate matches, not a final grading"],
    ];
  return <section className="screen light">
    <BackHeader title={lang==="ar"?"التفسير والحديث":"Tafsir & Hadith"} onBack={()=>setWorld("explore")}/>
    <Segment value={tab} setValue={setTab} items={[["tafsir",lang==="ar"?"التفسير":"Tafsir"],["hadith",lang==="ar"?"الحديث":"Hadith"]]}/>
    <input className="searchInput" value={query} onChange={e=>setQuery(e.target.value)} placeholder={tab==="tafsir"?(lang==="ar"?"ابحث في التفاسير…":"Search Tafsir…"):(lang==="ar"?"ابحث بالنص أو المرجع…":"Search text or reference…")}/>
    <div className="sourceLibrary">{rows.filter(r=>!query||(`${r[0]} ${r[1]}`).toLowerCase().includes(query.toLowerCase())).map((r,i)=><button key={i} onClick={()=>setWorld("source-inspector")}><div><b>{lang==="ar"?r[0]:r[1]}</b><small>{lang==="ar"?r[2]:r[3]}</small></div><Icon name="chevron" size={14}/></button>)}</div>
    <DependencyNote lang={lang} textAr="لا توجد نصوص تفسير أو حديث حقيقية في هذه النسخة حتى ربط مصدر موثّق." textEn="No real Tafsir/Hadith body text is shipped until trusted sources are connected."/>
  </section>
}

function AudioDownloads({lang,setWorld,reciter}){
  const [quality,setQuality]=usePersist("sk-audio-quality","medium");
  const [downloads,setDownloads]=usePersist("sk-audio-downloads",{fatiha:"ready",baqarah:"none",mulk:"none"});
  const toggle=id=>setDownloads(d=>({...d,[id]:d[id]==="none"?"downloading":d[id]==="downloading"?"ready":"none"}));
  const items=[
    ["fatiha","الفاتحة","Al-Fātiḥah","7 MB"],
    ["baqarah","البقرة","Al-Baqarah","182 MB"],
    ["mulk","الملك","Al-Mulk","18 MB"],
  ];
  return <section className="screen light">
    <BackHeader title={lang==="ar"?"تنزيلات التلاوة":"Recitation Downloads"} onBack={()=>setWorld("quran-audio")}/>
    <div className="audioDownloadHead"><b>{reciter.ar}</b><small>{lang==="ar"?"المصدر الصوتي الحقيقي غير متصل بعد":"Real audio provider not connected yet"}</small></div>
    <Segment value={quality} setValue={setQuality} items={[["low",lang==="ar"?"اقتصادي":"Low"],["medium",lang==="ar"?"متوسط":"Medium"],["high",lang==="ar"?"عالي":"High"]]}/>
    <div className="downloadRows">
      {items.map(x=><div key={x[0]}><div><b>{lang==="ar"?x[1]:x[2]}</b><small>{x[3]} · {quality}</small></div><button className={downloads[x[0]]==="ready"?"done":""} onClick={()=>toggle(x[0])}>{downloads[x[0]]==="ready"?(lang==="ar"?"منزّل":"Downloaded"):downloads[x[0]]==="downloading"?(lang==="ar"?"جارٍ…":"Downloading…"):(lang==="ar"?"تنزيل":"Download")}</button></div>)}
    </div>
    <Toggle label={lang==="ar"?"تنزيل عبر Wi‑Fi فقط":"Wi-Fi only"} on={true} setOn={()=>{}}/>
    <DependencyNote lang={lang} textAr="الحالات تفاعلية، لكن التنزيلات الحقيقية تحتاج ملفات صوت ومزوداً مرخّصاً وStorage API." textEn="States are interactive, but real downloads need licensed audio, a provider and storage APIs."/>
  </section>
}

function RamadanCenter({lang,setWorld}){
  const [day,setDay]=useState(12),[plan,setPlan]=usePersist("sk-ramadan-plan",{goal:30,done:6});
  const pct=Math.round((plan.done/plan.goal)*100);
  return <section className="screen ramadanScreen">
    <BackHeader title={lang==="ar"?"رمضان":"Ramadan"} onBack={()=>setWorld("moments")} dark/>
    <div className="ramadanMoon"><span></span></div>
    <div className="ramadanDay"><small>{lang==="ar"?"اليوم":"DAY"}</small><b>{digits(day,lang)}</b><p>{lang==="ar"?"حالة تجريبية — التفعيل الحقيقي يحتاج تقويم هجري موثوق":"Demo state — real activation requires a trusted Hijri calendar"}</p></div>
    <div className="ramadanTimes"><div><small>{lang==="ar"?"نهاية السحور":"Suhoor ends"}</small><b>{digits("04:52",lang)}</b></div><div><small>{lang==="ar"?"الإفطار":"Iftar"}</small><b>{digits("19:42",lang)}</b></div></div>
    <div className="ramadanPlan"><div><b>{lang==="ar"?"خطة الختمة":"Quran plan"}</b><small>{digits(plan.done,lang)} / {digits(plan.goal,lang)}</small></div><div className="planProgress"><span style={{width:`${pct}%`}}/></div><button onClick={()=>setPlan(p=>({...p,done:Math.min(p.goal,p.done+1)}))}>{lang==="ar"?"أنجزت ورد اليوم":"Completed today's portion"}</button></div>
    <div className="focusList ramadanLinks"><button><b>{lang==="ar"?"العشر الأواخر":"Last ten nights"}</b><small>{STR[lang].notConnected}</small></button><button onClick={()=>setWorld("hijri-zakat")}><b>{lang==="ar"?"الزكاة":"Zakat"}</b><small>{lang==="ar"?"حاسبة تعليمية شفافة":"Transparent educational calculator"}</small></button></div>
  </section>
}

function HajjUmrahDetails({lang,setWorld}){
  const [journey,setJourney]=useState("hajj"),[step,setStep]=useState(0),[checked,setChecked]=usePersist("sk-hajj-check",{});
  const content={
    hajj:[
      ["الاستعداد","Preparation","وثائق · حزمة Offline · خطة المجموعة","Documents · Offline pack · group plan"],
      ["الإحرام","Ihram","المواقيت والتعليمات تحتاج مصدر فقهي موثوق","Timing/guidance require trusted fiqh sources"],
      ["منى","Mina","الموقع والخدمات من مصدر رسمي","Location/services from official sources"],
      ["عرفة","Arafat","الوقت والخدمات والمصادر","Timing, services and sources"],
      ["مزدلفة","Muzdalifah","إرشاد Offline وموقع","Offline guidance and location"],
      ["الجمرات","Jamarat","سلامة ومسارات من مصادر رسمية","Safety/routes from official sources"],
      ["الإكمال","Completion","ملخص الرحلة والمحفوظات","Journey summary and saved items"],
    ],
    umrah:[
      ["الاستعداد","Preparation","حزمة Offline وخريطة","Offline pack and map"],
      ["الإحرام","Ihram","مصدر موثوق","Trusted source"],
      ["الميقات","Miqat","بيانات موقع موثوقة","Verified location data"],
      ["الطواف","Tawaf","إرشاد ومصدر","Guidance and source"],
      ["السعي","Sa'i","إرشاد ومصدر","Guidance and source"],
      ["الإكمال","Completion","ملخص خاص","Private summary"],
    ]
  };
  const arr=content[journey], x=arr[step];
  const key=`${journey}-${step}`;
  return <section className="screen journeyScreen">
    <BackHeader title={journey==="hajj"?(lang==="ar"?"الحج":"Hajj"):(lang==="ar"?"العمرة":"Umrah")} onBack={()=>setWorld("journeys")} dark/>
    <Segment value={journey} setValue={v=>{setJourney(v);setStep(0)}} items={[["hajj",lang==="ar"?"الحج":"Hajj"],["umrah",lang==="ar"?"العمرة":"Umrah"]]}/>
    <div className="journeyProgress"><span style={{width:`${((step+1)/arr.length)*100}%`}}/></div>
    <div className="ritualCard"><small>{digits(step+1,lang)} / {digits(arr.length,lang)}</small><h2>{lang==="ar"?x[0]:x[1]}</h2><p>{lang==="ar"?x[2]:x[3]}</p><button className={checked[key]?"checked":""} onClick={()=>setChecked(c=>({...c,[key]:!c[key]}))}>{checked[key]?(lang==="ar"?"تمت المراجعة":"Reviewed"):(lang==="ar"?"ضع علامة تمت المراجعة":"Mark reviewed")}</button></div>
    <div className="journeyNav"><button disabled={!step} onClick={()=>setStep(s=>s-1)}>{lang==="ar"?"السابق":"Previous"}</button><button disabled={step===arr.length-1} onClick={()=>setStep(s=>s+1)}>{lang==="ar"?"التالي":"Next"}</button></div>
    <div className="journeyTools"><button onClick={()=>setWorld("offline")}><Icon name="download"/><span>Offline</span></button><button onClick={()=>setWorld("qibla")}><Icon name="compass"/><span>{STR[lang].qibla}</span></button></div>
  </section>
}

function MosqueFriday({lang,setWorld}){
  const [khutbah,setKhutbah]=usePersist("sk-khutbah-title",lang==="ar"?"عنوان الخطبة غير متصل":"Khutbah title not connected");
  return <section className="screen light">
    <BackHeader title={lang==="ar"?"الجمعة في مسجدي":"Friday at My Mosque"} onBack={()=>setWorld("mosque")}/>
    <div className="fridayMosqueHero"><Icon name="mosque" size={30}/><h2>{lang==="ar"?"الجمعة":"Friday"}</h2><p>{lang==="ar"?"بيانات المسجد تبقى منفصلة عن حساب الصلاة الشخصي.":"Mosque data stays separate from personal prayer calculations."}</p></div>
    <Setting label={lang==="ar"?"وقت الجمعة":"Friday prayer"} value={STR[lang].notConnected}/>
    <Setting label={lang==="ar"?"الخطيب":"Khateeb"} value={STR[lang].notConnected}/>
    <div className="khutbahBox"><small>{lang==="ar"?"عنوان الخطبة":"KHUTBAH TITLE"}</small><input value={khutbah} onChange={e=>setKhutbah(e.target.value)}/><p>{lang==="ar"?"محلي فقط إلى أن يتوثق حساب المسجد." :"Local only until mosque identity is verified."}</p></div>
  </section>
}

function ContentOps({lang,setWorld}){
  const [items,setItems]=usePersist("sk-content-ops",[
    {id:1,type:"QURAN",status:"verified",version:"1.0-demo"},
    {id:2,type:"HADITH",status:"pending",version:"—"},
    {id:3,type:"TAFSIR",status:"pending",version:"—"},
    {id:4,type:"MOSQUE",status:"draft",version:"local"},
  ]);
  const cycle=s=>s==="draft"?"pending":s==="pending"?"reviewed":s==="reviewed"?"verified":"draft";
  return <section className="screen light">
    <BackHeader title={lang==="ar"?"إدارة المحتوى":"Content Operations"} onBack={()=>setWorld("verification")}/>
    <div className="opsTable">{items.map(x=><div key={x.id}><div><b>{x.type}</b><small>v{x.version}</small></div><button className={`ops-${x.status}`} onClick={()=>setItems(rows=>rows.map(r=>r.id===x.id?{...r,status:cycle(r.status)}:r))}>{x.status}</button></div>)}</div>
    <DependencyNote lang={lang} textAr="هذه محاكاة محلية لدورة المراجعة. الـCMS الحقيقي يحتاج Backend وصلاحيات ومراجعين." textEn="This is a local review-lifecycle simulation. A real CMS needs backend, roles and reviewers."/>
  </section>
}

function GenericHub({lang,setWorld,titleAr,titleEn,introAr,introEn,items=[]}){
  return <section className="screen light"><BackHeader title={lang==="ar"?titleAr:titleEn} onBack={()=>setWorld("explore")}/>
    <div className="heroStatement">{lang==="ar"?introAr:introEn}</div>
    <div className="focusList">{items.map((it,i)=><button key={i}><b>{lang==="ar"?it[0]:it[1]}</b><small>{lang==="ar"?it[2]:it[3]}</small></button>)}</div>
  </section>
}

function Intelligence({lang,setWorld}){
  const [mode,setMode]=usePersist("sk-ai-mode","local"), [q,setQ]=useState("");
  return <section className="screen intelligenceScreen">
    <BackHeader title={lang==="ar"?"سكينة الذكية":"Sakinah Intelligence"} onBack={()=>setWorld("explore")} dark/>
    <div className="commandOrb"><Icon name="mic" size={25}/><span></span></div>
    <h2>{lang==="ar"?"قل ما تريد فعله":"Say what you want to do"}</h2>
    <input value={q} onChange={e=>setQ(e.target.value)} placeholder={lang==="ar"?"مثلاً: كمل القرآن، كم باقي للمغرب؟":"e.g. Continue Quran, how long until Maghrib?"}/>
    <div className="commandSuggestions">
      {["كمل القرآن","وين القبلة؟","أريد أذكار المساء","افتح سورة الملك"].map((x,i)=><button key={i} onClick={()=>i===0?setWorld("quran-reader"):i===1?setWorld("qibla"):i===2?setWorld("adhkar"):setWorld("quran-surahs")}>{lang==="ar"?x:["Continue Quran","Where is Qibla?","Evening Adhkar","Open Al-Mulk"][i]}</button>)}
    </div>
    <Segment value={mode} setValue={setMode} items={[["local",lang==="ar"?"محلي":"Local"],["cloud",lang==="ar"?"سحابة موثوقة":"Trusted Cloud"],["off","AI Off"]]}/>
    <button className="lensBtn"><Icon name="camera"/><span>{lang==="ar"?"Sakinah Lens — اعثر على الآية من صفحة مطبوعة":"Sakinah Lens — find an Ayah from a printed page"}</span><em>{STR[lang].notConnected}</em></button>
  </section>
}

function Offline({lang,setWorld}){
  const [packs,setPacks]=usePersist("sk-packs",{core:true,quranAudio:false,hajj:false});
  const data=[
    ["core","الحزمة الأساسية","Essential Pack","24 MB"],
    ["quranAudio","تلاوة مختارة","Selected Recitation","180 MB"],
    ["hajj","الحج والعمرة","Hajj & Umrah","62 MB"],
  ];
  return <section className="screen light"><BackHeader title={lang==="ar"?"دون اتصال":"Offline"} onBack={()=>setWorld("explore")}/>
    <div className="heroStatement">{lang==="ar"?"الأساس يعمل حتى إذا اختفى الإنترنت.":"The core remains useful when the network disappears."}</div>
    <div className="downloadManager">{data.map(d=><div key={d[0]}><Icon name="download"/><div><b>{lang==="ar"?d[1]:d[2]}</b><small>{d[3]}</small></div><button onClick={()=>setPacks(p=>({...p,[d[0]]:!p[d[0]]}))}>{packs[d[0]]?(lang==="ar"?"مثبت":"Installed"):(lang==="ar"?"تنزيل":"Download")}</button></div>)}</div>
    <DependencyNote lang={lang} textAr="التنزيل هنا محاكاة حالة. الحزم الفعلية تحتاج ملفات ومزودات موثوقة وإدارة تخزين." textEn="Download states are simulated. Real packs require trusted files/providers and storage management."/>
  </section>
}

function Me({lang,setLang,setWorld}){
  const [guest,setGuest]=usePersist("sk-guest",false);
  return <section className="screen light meScreen"><PageTitle title={STR[lang].me} sub={guest?(lang==="ar"?"وضع الضيف — السجل الخاص مخفي":"Guest mode — private history hidden"):(lang==="ar"?"مساحتك الخاصة، وليست صفحة إعدادات.":"Your private space, not a settings dump.")}/>
    {!guest && <div className="personalReading"><span>{lang==="ar"?"قراءتك":"Your reading"}</span><b>{SURAH.ar}</b><small>{lang==="ar"?"الآية ٢ · محلي على الجهاز":"Ayah 2 · local on device"}</small></div>}
    <div className="meRows">
      <Setting label={lang==="ar"?"المحفوظات":"Saved"} value={lang==="ar"?"محلي":"Local"} onClick={()=>setWorld("quran")}/>
      <Setting label={lang==="ar"?"التنزيلات":"Downloads"} value={lang==="ar"?"إدارة":"Manage"} onClick={()=>setWorld("offline")}/>
      <Setting label={lang==="ar"?"الخصوصية":"Privacy"} value={guest?(lang==="ar"?"ضيف":"Guest"):(lang==="ar"?"خاص":"Private")} onClick={()=>setWorld("privacy-data")}/>
      <Setting label={lang==="ar"?"إمكانية الوصول":"Accessibility"} value={lang==="ar"?"بسيط · نص كبير":"Simple · Large text"} onClick={()=>setWorld("accessibility")}/>
      <Setting label={lang==="ar"?"اللغة":"Language"} value={lang==="ar"?"العربية":"English"} onClick={()=>setLang(lang==="ar"?"en":"ar")}/>
      <Setting label={lang==="ar"?"المصادر والشفافية":"Sources & transparency"} value={lang==="ar"?"عرض":"Open"} onClick={()=>setWorld("trust")}/>
      <Setting label={lang==="ar"?"العرض المنزلي/المسجد":"Home / mosque display"} value={lang==="ar"?"معاينة":"Preview"} onClick={()=>setWorld("public-display")}/>
    </div>
  </section>
}

function Accessibility({lang,setWorld}){
  const [simple,setSimple]=usePersist("sk-simple",false), [large,setLarge]=usePersist("sk-large",false), [motion,setMotion]=usePersist("sk-motion",true);
  return <section className="screen light"><BackHeader title={lang==="ar"?"إمكانية الوصول":"Accessibility"} onBack={()=>setWorld("me")}/>
    <Toggle label={lang==="ar"?"الوضع المبسط":"Simple mode"} on={simple} setOn={setSimple}/>
    <Toggle label={lang==="ar"?"نص كبير":"Large text"} on={large} setOn={setLarge}/>
    <Toggle label={lang==="ar"?"الحركة":"Motion"} on={motion} setOn={setMotion}/>
    <div className="accessPreview"><b>{lang==="ar"?"الصلاة":"Prayer"}</b><b>{lang==="ar"?"القرآن":"Quran"}</b><b>{lang==="ar"?"الأذكار":"Adhkar"}</b></div>
  </section>
}

function Sacred({lang,setWorld}){
  return <section className="screen sacredScreen"><BackHeader title={STR[lang].sacred} onBack={()=>setWorld("today")} dark/>
    <div className="sacredCenter"><span className="sacredLine"></span><h2>{lang==="ar"?"التطبيق يتراجع":"The app steps away"}</h2><p>{lang==="ar"?"تنقل أقل، حركة أقل، ضوء أهدأ، وتركيز أكبر على القرآن والذكر والاستماع.":"Less navigation, less motion, quieter light, more focus on Quran, Dhikr and listening."}</p><button onClick={()=>setWorld("quran-reader")}>{lang==="ar"?"افتح القرآن":"Open Quran"}</button></div>
  </section>
}

function PageTitle({title,sub}){return <div className="pageTitle"><h1>{title}</h1>{sub&&<p>{sub}</p>}</div>}
function BackHeader({title,onBack,dark=false}){return <div className={"backHeader "+(dark?"darkText":"")}><button className="ghost" onClick={onBack}><Icon name="chevron" size={18}/></button><b>{title}</b><span/></div>}
function DependencyNote({lang,textAr,textEn,dark=false}){return <div className={"dependency "+(dark?"darkDep":"")}><Icon name="shield" size={15}/><span>{lang==="ar"?textAr:textEn}</span></div>}
function Setting({label,value,onClick}){return <button className="setting" onClick={onClick}><span>{label}</span><b>{value}</b><Icon name="chevron" size={14}/></button>}
function Toggle({label,on,setOn}){return <div className="toggleRow"><span>{label}</span><button className={"switch "+(on?"on":"")} onClick={()=>setOn(!on)}><i/></button></div>}
function Segment({value,setValue,items}){return <div className="segment">{items.map(x=><button className={value===x[0]?"on":""} key={x[0]} onClick={()=>setValue(x[0])}>{x[1]}</button>)}</div>}

export default function App(){
  const [lang,setLang]=usePersist("sk-lang","ar");
  const [world,setWorld]=useState("today");
  const [preview,setPreview]=useState(null);
  const [showTime,setShowTime]=useState(false);
  const [now,setNow]=useState(()=>new Date());
  const [bookmarks,setBookmarks]=usePersist("sk-bookmarks",{});
  const [selectedReciter,setSelectedReciter]=usePersist("sk-reciter",RECITERS[1]);
  const [adhan,setAdhan]=usePersist("sk-adhan",{});
  const [lastRead]=usePersist("sk-last-read",{surah:1,ayah:1});

  useEffect(()=>{const id=setInterval(()=>setNow(new Date()),30000); return()=>clearInterval(id)},[]);
  const live=now.getHours()+now.getMinutes()/60;
  const h=preview??live;
  const setH=x=>setPreview(x);
  const stage=stageFor(h);
  const n=nextPrayer(h);
  const dir=lang==="ar"?"rtl":"ltr";

  const screen=()=>{
    if(world.startsWith("muezzins-")) return <Muezzins lang={lang} setWorld={setWorld} prayerId={world.split("-")[1]} adhan={adhan} setAdhan={setAdhan}/>;
    switch(world){
      case "today": return <Today lang={lang} h={h} setH={setH} stage={stage} setWorld={setWorld} lastRead={lastRead}/>;
      case "quran": return <QuranHome lang={lang} setWorld={setWorld} selectedReciter={selectedReciter}/>;
      case "quran-companion": return <QuranCompanion lang={lang} setWorld={setWorld}/>;
      case "quran-reader": return <QuranReader lang={lang} setWorld={setWorld} bookmarks={bookmarks} setBookmarks={setBookmarks}/>;
      case "quran-surahs": return <QuranSurahs lang={lang} setWorld={setWorld}/>;
      case "reciters": return <Reciters lang={lang} setWorld={setWorld} selected={selectedReciter} setSelected={setSelectedReciter}/>;
      case "quran-audio": return <QuranAudio lang={lang} setWorld={setWorld} reciter={selectedReciter}/>;
      case "audio-downloads": return <AudioDownloads lang={lang} setWorld={setWorld} reciter={selectedReciter}/>;
      case "memorize": return <Memorize lang={lang} setWorld={setWorld}/>;
      case "quran-deep": return <GenericHub lang={lang} setWorld={setWorld} titleAr="القرآن العميق" titleEn="Deep Quran" introAr="آية → تفسير → جذور → آيات ذات صلة → حديث موثّق → سياق، بدون Graph تقني مزعج." introEn="Ayah → Tafsir → roots → related verses → sourced Hadith → context, without a technical node graph." items={[
        ["التفسير المقارن","Tafsir comparison","بانتظار مكتبات موثقة","Trusted libraries required"],
        ["الجذر العربي","Arabic root","بانتظار Dataset لغوي موثوق","Trusted linguistic dataset required"],
        ["البحث الدلالي","Semantic search","النتيجة يجب أن تُوسم كتشابه دلالي لا كتفسير","Results must be labelled semantic, never Tafsir"],
      ]}/>;
      case "prayer": return <Prayer lang={lang} h={h} setH={setH} setWorld={setWorld}/>;
      case "qibla": return <Qibla lang={lang} setWorld={setWorld}/>;
      case "qibla-map": return <QiblaMap lang={lang} setWorld={setWorld}/>;
      case "adhan": return <Adhan lang={lang} setWorld={setWorld} adhan={adhan} setAdhan={setAdhan}/>;
      case "prayer-settings": return <PrayerSettings lang={lang} setWorld={setWorld}/>;
      case "explore": return <Explore lang={lang} setWorld={setWorld}/>;
      case "teacher-imam": return <TeacherImam lang={lang} setWorld={setWorld}/>;
      case "widget-gallery": return <WidgetGallery lang={lang} setWorld={setWorld}/>;
      case "tablet-preview": return <TabletPreview lang={lang} setWorld={setWorld}/>;
      case "search-all": return <SearchAll lang={lang} setWorld={setWorld}/>;
      case "moments": return <Moments lang={lang} setWorld={setWorld}/>;
      case "ramadan-center": return <RamadanCenter lang={lang} setWorld={setWorld}/>;
      case "hijri-zakat": return <HijriZakat lang={lang} setWorld={setWorld}/>;
      case "corrections": return <Corrections lang={lang} setWorld={setWorld}/>;
      case "content-ops": return <ContentOps lang={lang} setWorld={setWorld}/>;
      case "prepare-prayer": return <PreparePrayer lang={lang} setWorld={setWorld}/>;
      case "public-display": return <PublicDisplay lang={lang} setWorld={setWorld}/>;
      case "adhkar": return <Adhkar lang={lang} setWorld={setWorld}/>;
      case "dua": return <Dua lang={lang} setWorld={setWorld}/>;
      case "trust": return <Trust lang={lang} setWorld={setWorld}/>;
      case "source-inspector": return <SourceInspector lang={lang} setWorld={setWorld}/>;
      case "tafsir-hadith": return <TafsirHadithCenter lang={lang} setWorld={setWorld}/>;
      case "intelligence": return <Intelligence lang={lang} setWorld={setWorld}/>;
      case "offline": return <Offline lang={lang} setWorld={setWorld}/>;
      case "me": return <Me lang={lang} setLang={setLang} setWorld={setWorld}/>;
      case "privacy-data": return <PrivacyDataCenter lang={lang} setWorld={setWorld}/>;
      case "accessibility": return <Accessibility lang={lang} setWorld={setWorld}/>;
      case "sacred": return <Sacred lang={lang} setWorld={setWorld}/>;
      case "fasting": return <GenericHub lang={lang} setWorld={setWorld} titleAr="الصيام" titleEn="Fasting" introAr="لا يفترض سكينة أنك صائم. أنت تختار السياق، والمواعيد تُبنى فقط على تقويم ومواقيت موثوقة." introEn="Sakinah never assumes you are fasting. You opt into a context; timings require trusted calendar/prayer data." items={[
        ["رمضان","Ramadan","Moment كامل، مو Theme","A full Moment, not a theme"],
        ["الأيام البيض","White days","تحتاج تقويم هجري موثوق","Trusted Hijri calendar required"],
        ["الاثنين والخميس","Monday & Thursday","تذكير اختياري فقط","Optional reminder only"],
        ["عرفة وعاشوراء والست من شوال","Arafah, Ashura & six of Shawwal","مصدر وتقويم موثوقان","Trusted source and calendar required"]
      ]}/>;
      case "learning": return <GenericHub lang={lang} setWorld={setWorld} titleAr="تعلم" titleEn="Learn" introAr="تعلم بصري وصوتي، لا اختبارات عبادية ولا نقاط." introEn="Visual/audio learning without worship scoring." items={[
        ["الوضوء","Wudu","خطوات ومصادر واختلافات عند الحاجة","Steps, sources and differences when relevant"],
        ["الغسل والتيمم والطهارة","Ghusl, Tayammum & purification","منهج موثوق","Trusted methodology"],
        ["الصلاة","Prayer","وضع مبتدئ وصوت وترجمة","Beginner mode, audio and translation"],
        ["التجويد","Tajweed","لا تصحيح آلي ادعائي","No unvalidated automatic correctness claims"],
        ["العربية للقرآن","Arabic for Quran","جذور وصرف وسياق","Roots, morphology and context"]
      ]}/>;
      case "library": return <IslamicLibraryInteractive lang={lang} setWorld={setWorld}/>;
      case "__old_library": return <GenericHub lang={lang} setWorld={setWorld} titleAr="المكتبة الإسلامية" titleEn="Islamic Library" introAr="كتب وخطب ودروس بترخيص ومصدر وبحث وملاحظات وOffline." introEn="Books, khutbahs and lessons with licensing, provenance, search, notes and offline access." items={[
        ["الكتب","Books","بحث داخل الكتاب وملاحظات","In-book search and notes"],
        ["الخطب","Khutbahs","مسجد/خطيب/تاريخ/مصدر","Mosque/speaker/date/source"],
        ["الدروس الصوتية","Audio lessons","منفصلة عن مشغل القرآن","Separate from Quran playback"],
        ["المخطوطات","Manuscripts","حقوق وصور عالية الدقة","Rights and high-resolution images"]
      ]}/>;
      case "scholar": return <ScholarWorkspace lang={lang} setWorld={setWorld}/>;
      case "__old_scholar": return <GenericHub lang={lang} setWorld={setWorld} titleAr="وضع طالب العلم" titleEn="Scholar Mode" introAr="Workspace للتابلت: آية، تفسير، حديث، جذور، ملاحظات، Bibliography." introEn="Tablet workspace: Ayah, Tafsir, Hadith, roots, notes and bibliography." items={[
        ["مقارنة التفاسير","Compare Tafsir","عدة مصادر جنباً إلى جنب","Multiple sources side-by-side"],
        ["الإسناد والمراجع","Isnad & references","من قواعد موثقة فقط","Trusted datasets only"],
        ["ملاحظات وروابط شخصية","Private notes & links","محلي ومشفّر عند الحاجة","Local and encrypted when needed"],
        ["اختصارات لوحة المفاتيح","Keyboard shortcuts","للتابلت/الدسكتوب","For tablet/desktop"]
      ]}/>;
      case "archive": return <GenericHub lang={lang} setWorld={setWorld} titleAr="ذاكرة الحضارة" titleEn="Sakinah Archive" introAr="السيرة والتاريخ والعمارة والمخطوطات والمدن والعلماء ضمن Timeline وMap موثق." introEn="Seerah, history, architecture, manuscripts, cities and scholars in sourced timelines and maps." items={[
        ["خط زمني للسيرة","Seerah timeline","كل حدث بمصدر","Every event sourced"],
        ["أطلس التاريخ الإسلامي","Islamic history atlas","مكان + زمن + مصدر","Place + time + source"],
        ["Time Machine","Time Machine","سياق زمني ومكاني بلا اختلاق بصري","Temporal/spatial context without invented reconstruction"]
      ]}/>;
      case "mosque": return <MosqueInteractive lang={lang} setWorld={setWorld}/>;
      case "mosque-friday": return <MosqueFriday lang={lang} setWorld={setWorld}/>;
      /* replaced generic mosque */
      case "__old_mosque": return <GenericHub lang={lang} setWorld={setWorld} titleAr="المسجد" titleEn="Mosque" introAr="مسجدي ليس Social Media. الإقامة والجمعة والدروس والخدمات من جهة موثّقة." introEn="My Mosque is not social media. Iqamah, Friday prayer, lessons and services come from a verified source." items={[
        ["وقت الإقامة","Iqamah time","من المسجد نفسه أو مزود موثوق","From the mosque or verified provider"],
        ["الجمعة والخطبة","Friday & khutbah","معلومات موثقة","Verified data"],
        ["حلقة القرآن","Quran circle","مساحة خاصة للمعلم والطلاب","Private teacher/student space"],
        ["مرافق الوصول والوضوء","Accessibility & Wudu facilities","بيانات موثقة","Verified facilities data"],
        ["QR رسمي للمسجد","Official mosque QR","توثيق الإدارة أولاً","Admin verification first"]
      ]}/>;
      case "family": return <FamilyInteractive lang={lang} setWorld={setWorld}/>;
      case "__old_family": return <GenericHub lang={lang} setWorld={setWorld} titleAr="العائلة" titleEn="Family" introAr="مشاركة نافعة بدون مراقبة العبادة." introEn="Useful sharing without worship surveillance." items={[
        ["خطة قرآن عائلية","Family Quran plan","اختيارية ولا تكشف أداء العبادة","Optional; no worship-performance exposure"],
        ["تعلم الأطفال","Kids learning","ملفات محلية بدون بريد","Local profiles without email"],
        ["رمضان والحج","Ramadan & Hajj","تنظيم مشترك","Shared planning"],
        ["خصوصية الأسرة","Family privacy","لا مشاركة تلقائية","No automatic sharing"]
      ]}/>;
      case "kids": return <KidsInteractive lang={lang} setWorld={setWorld}/>;
      case "__old_kids": return <GenericHub lang={lang} setWorld={setWorld} titleAr="سكينة للأطفال" titleEn="Sakinah Kids" introAr="عالم طفل مستقل: تعلم ولعب هادئ، بلا إعلانات أو اقتصاد نقاط للعبادة." introEn="A dedicated child world: calm learning/play, no ads or worship reward economy." items={[
        ["القرآن","Quran","حفظ واستماع مناسب للعمر","Age-appropriate memorization/listening"],
        ["قصص الأنبياء","Prophet stories","بدون تصوير الأنبياء","Without depicting Prophets"],
        ["الصلاة والدعاء","Prayer & Du'a","تعلم بصري وصوتي","Visual and audio learning"],
        ["العربية والأخلاق","Arabic & character","تدرج حسب العمر","Age-based progression"],
        ["لا AI مفتوح","No open AI","حدود أمان للأطفال","Child safety boundaries"]
      ]}/>;
      case "journeys": return <JourneysInteractive lang={lang} setWorld={setWorld}/>;
      case "hajj-umrah-details": return <HajjUmrahDetails lang={lang} setWorld={setWorld}/>;
      case "__old_journeys": return <GenericHub lang={lang} setWorld={setWorld} titleAr="السفر والحرمين" titleEn="Travel & Haramain" introAr="حج وعمرة وسفر بقدر كبير من العمل Offline، بدون استنتاج الحالة الشرعية من GPS." introEn="Hajj, Umrah and travel designed for offline use without inferring religious status from GPS." items={[
        ["الحج","Hajj","مراحل + مصادر + Group Mode","Stages + sources + Group Mode"],
        ["العمرة","Umrah","إحرام · ميقات · طواف · سعي","Ihram · Miqat · Tawaf · Sa'i"],
        ["مكة والمدينة","Makkah & Madinah","خرائط وخدمات من مصادر رسمية","Maps/services from official sources"],
        ["Lost Mode","Lost Mode","مشاركة موقع مؤقتة وصريحة","Explicit temporary location sharing"],
        ["Emergency Pack","Emergency Pack","قرآن · أدعية · مناسك · خرائط","Quran · Du'a · rites · maps"]
      ]}/>;
      case "verification": return <section className="screen light"><BackHeader title={lang==="ar"?"التحقق والنزاهة":"Verification & Integrity"} onBack={()=>setWorld("explore")}/><div className="heroStatement">{lang==="ar"?"إذا شككنا بالبيانات، نفشل بأمان بدل ما نخترع fallback.":"When data is uncertain, fail safely instead of inventing a fallback."}</div><div className="focusList"><button onClick={()=>setWorld("content-ops")}><b>{lang==="ar"?"دورة مراجعة المحتوى":"Content review lifecycle"}</b><small>Draft → Pending → Reviewed → Verified</small></button><button><b>Checksums + Signatures</b><small>{lang==="ar"?"كشف التلف والتوقيع":"Corruption detection and signing"}</small></button><button><b>Rollback</b><small>{lang==="ar"?"العودة لآخر نسخة موثوقة":"Return to last trusted version"}</small></button><button onClick={()=>setWorld("corrections")}><b>{lang==="ar"?"التصحيحات":"Corrections"}</b><small>{lang==="ar"?"قناة مراجعة واضحة":"Transparent review channel"}</small></button></div></section>;
      case "devices": return <section className="screen light"><BackHeader title={lang==="ar"?"أجهزة سكينة":"Sakinah Surfaces"} onBack={()=>setWorld("explore")}/><div className="heroStatement">{lang==="ar"?"نصمم لكل سطح تجربة، مو نسخة مصغرة من الهاتف.":"Each surface gets a purpose-built experience, not a shrunken phone UI."}</div><div className="focusList"><button onClick={()=>setWorld("widget-gallery")}><b>Widgets</b><small>{lang==="ar"?"معاينات صلاة · قوس · قرآن · رمضان":"Prayer · arc · Quran · Ramadan previews"}</small></button><button onClick={()=>setWorld("tablet-preview")}><b>{lang==="ar"?"Tablet / Foldable":"Tablet / Foldable"}</b><small>{lang==="ar"?"Workspace متعدد الأعمدة":"Multi-column workspace"}</small></button><button onClick={()=>setWorld("public-display")}><b>{lang==="ar"?"Home / Public Display":"Home / Public Display"}</b><small>{lang==="ar"?"عرض بلا بيانات شخصية":"No personal data"}</small></button><button><b>Wear OS</b><small>{lang==="ar"?"يتطلب Android/Wear implementation":"Requires native Wear implementation"}</small></button><button><b>Android Auto</b><small>{lang==="ar"?"صوت أولاً وأمان":"Audio-first and safe"}</small></button></div></section>;
      default:return <Explore lang={lang} setWorld={setWorld}/>;
    }
  };

  const darkWorld = world==="today" ? stage.dark : ["qibla","qibla-map","quran-audio","intelligence","sacred"].includes(world);
  return <div className="appShell" dir={dir}>
    <div className={"phone "+(darkWorld?"darkWorld":"")} style={world==="today"?{background:`radial-gradient(circle at 70% 0%, ${stage.a} 0%, ${stage.b} 68%)`}:undefined}>
      <TopBar lang={lang} setLang={setLang} onTime={{value:h,set:setH}} showTime={showTime} setShowTime={setShowTime} dark={darkWorld}/>
      <main>{screen()}</main>
      {!["quran-reader","quran-audio","qibla","qibla-map","sacred","intelligence"].includes(world) && <Dock world={world} setWorld={setWorld} lang={lang} next={n} dark={darkWorld}/>}
    </div>
  </div>
}
