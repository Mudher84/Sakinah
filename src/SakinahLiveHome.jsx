import React,{useEffect,useMemo,useState} from "react";

const C={bg:"#F7F3EA",paper:"#FDFBF7",navy:"#102D43",gold:"#C0A062",gold2:"#B08D4F",muted:"#8E96A0",text:"#1E3E56"};
const PR=["Fajr","Dhuhr","Asr","Maghrib","Isha"];
const AR={Fajr:"الفجر",Dhuhr:"الظهر",Asr:"العصر",Maghrib:"المغرب",Isha:"العشاء"};
const MARK_POS=[{right:"5%",top:"84%"},{right:"27%",top:"32%"},{right:"50%",top:"19%"},{right:"73%",top:"32%"},{right:"95%",top:"84%"}];
const MOMENTS=[
 {reason:"الجمعة",title:"سورة الكهف",sub:"قراءتها يوم الجمعة سُنّة — ٢٥ دقيقة استماعاً مع المعيقلي.",cta:"ابدأ الاستماع",route:"quran-player"},
 {reason:"بعد الفجر",title:"أذكار الصباح",sub:"١٢ ذكراً · وقتها من الفجر إلى الضحى.",cta:"ابدأ الأذكار",route:"smart-quranic-adhkar"},
 {reason:"قبل المغرب",title:"وِردك اليومي",sub:"بقيت لك صفحتان لإكمال ورد اليوم.",cta:"أكمل الورد",route:"smart-khatmah"},
 {reason:"ليلاً",title:"أذكار النوم",sub:"آية الكرسي والمعوّذات وثلاث تسبيحات.",cta:"ابدأ",route:"smart-quranic-adhkar"}
];
const FAVS=[
 ["quran","◍","القرآن","الكهف · ٩:١٢"],
 ["smart-quranic-adhkar","✧","الأذكار","المساء"],
 ["tasbeeh","◈","التسبيح","٣٣ / ١٠٠"],
 ["adult-nasheeds","♪","الأناشيد","٨ ملفات"]
];
const GROUPS=[
 {name:"عبادات",items:[["guide","◉","الصلاة والوضوء"],["fasting-center","☾","الصيام"],["manasik","✧","المناسك"],["zakat","$","الزكاة"],["jumuah-center","◍","الجمعة"],["ramadan-center","❍","رمضان"]]},
 {name:"تعلّم وحفظ",items:[["memorization-center","▤","الحفظ والمراجعة"],["names-live","◇","أسماء الله"],["saved-library","▥","الحقيبة"],["card-maker","◈","البطاقات"],["notes","✎","الملاحظات"],["quran-teacher","◎","معلّم القرآن"]]},
 {name:"أدوات",items:[["islamic-calendar","◔","التقويم"],["accounts","⌂","الحسابات"],["privacy-lock","⚿","قفل الخصوصية"]]},
 {name:"الأطفال",items:[["kids-world","✦","عالم الأطفال"],["kids-nasheeds","♪","الأناشيد"],["kids-quiz-live","◐","ألعاب تعليمية"]]}
];
const clean=v=>String(v||"").split(" ")[0];
const ar=v=>String(v??"").replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]);
function epoch(v,add=0){const[h,m]=clean(v).split(":").map(Number);const d=new Date();d.setDate(d.getDate()+add);d.setHours(h||0,m||0,0,0);return d.getTime()}
function nextPrayer(t){if(!t)return null;const now=Date.now();for(let i=0;i<PR.length;i++){const p=PR[i],at=epoch(t[p]);if(at>now)return{id:p,time:clean(t[p]),at,index:i}}return{id:"Fajr",time:clean(t.Fajr),at:epoch(t.Fajr,1),index:0}}
function remaining(ms){if(!Number.isFinite(ms)||ms<=0)return"٠ ساعة و ٠ دقيقة";const mins=Math.floor(ms/60000),h=Math.floor(mins/60),m=mins%60;return`${ar(h)} ساعة و ${ar(m)} دقيقة`}
function emit(id){window.dispatchEvent(new CustomEvent("sakinah:feature",{detail:id}))}
function dayOfYear(){const d=new Date(),s=new Date(d.getFullYear(),0,0);return Math.floor((d-s)/86400000)}
function dailyAyah(){return((dayOfYear()*37+83)%6236)+1}

export default function SakinahLiveHome({profileAvatar="",profileName="أنا",onOpenProfile}){
 const[data,setData]=useState(null),[tick,setTick]=useState(Date.now()),[ayah,setAyah]=useState(null),[moment,setMoment]=useState(0),[done,setDone]=useState([false,false,false,false,false]),[open,setOpen]=useState([true,false,false,false]),[masjid,setMasjid]=useState(false),[status,setStatus]=useState("");
 useEffect(()=>{
  let alive=true;
  try{window.scrollTo(0,0)}catch{}
  if(navigator.geolocation){navigator.geolocation.getCurrentPosition(async p=>{try{const{latitude,longitude}=p.coords;const r=await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=4`);if(!r.ok)throw new Error();const j=await r.json();if(alive){setData(j?.data||null);setStatus("")}}catch{if(alive)setStatus("تعذر تحميل مواقيت الصلاة")}},()=>alive&&setStatus("فعّل الموقع لعرض المواقيت الدقيقة"),{enableHighAccuracy:true,timeout:12000})}else setStatus("الموقع غير مدعوم");
  fetch(`https://api.alquran.cloud/v1/ayah/${dailyAyah()}/quran-uthmani`).then(r=>r.ok?r.json():Promise.reject()).then(j=>alive&&setAyah(j?.data||null)).catch(()=>{});
  const id=setInterval(()=>setTick(Date.now()),30000);return()=>{alive=false;clearInterval(id)};
 },[]);
 const next=useMemo(()=>nextPrayer(data?.timings),[data,tick]);
 useEffect(()=>{if(next)setDone(PR.map((_,i)=>i<next.index))},[next?.id]);
 const doneCount=done.filter(Boolean).length,m=MOMENTS[moment];
 const date=new Intl.DateTimeFormat("ar-IQ",{weekday:"long",day:"numeric",month:"long"}).format(new Date());
 const hijri=data?.date?.hijri?`${ar(data.date.hijri.day)} ${data.date.hijri.month?.ar||""} ${ar(data.date.hijri.year)}`:"";
 const togglePrayer=i=>setDone(v=>v.map((x,k)=>k===i?!x:x));
 return <div className="mm-reference-home" dir="rtl">
  <style>{`
   #root .mm-reference-home{position:fixed;inset:0;z-index:2147483500;overflow-y:auto;overflow-x:hidden;background:#faf9f5;color:${C.navy};font-family:'Noto Kufi Arabic',sans-serif!important;-webkit-overflow-scrolling:touch;scrollbar-width:none}
   #root .mm-reference-home::-webkit-scrollbar{display:none}
   #root .mm-reference-home *{box-sizing:border-box}
   #root .mm-reference-home .mm-amiri{font-family:'Amiri','Noto Naskh Arabic',serif!important}
   #root .mm-reference-home .mm-mono{font-family:'IBM Plex Mono',monospace!important}
   #root .mm-reference-home .mm-quran-text{font-family:'Amiri Quran','Amiri','Noto Naskh Arabic',serif!important}
   #root .mm-reference-home .mm-cairo{font-family:'Cairo','Noto Kufi Arabic',sans-serif!important}
   #root .mm-reference-home button{font-family:inherit;color:inherit}
   .mm-reference-frame{width:min(100%,520px);min-height:100%;margin:0 auto;padding:8px 8px 96px}
   .mm-reference-sheet{width:100%;min-height:100%;border-radius:34px;overflow:hidden;background:${C.bg};box-shadow:0 40px 90px -40px rgba(16,45,67,.5),0 0 0 1px rgba(16,45,67,.08)}
   .mm-ref-tap{transition:transform .14s ease}.mm-ref-tap:active{transform:scale(.97)}
   @media(max-width:520px){.mm-reference-frame{padding:0 0 96px}.mm-reference-sheet{border-radius:0;box-shadow:none}}
  `}</style>
  <div className="mm-reference-frame"><div className="mm-reference-sheet">
   <section style={{background:C.navy,color:C.bg,borderRadius:"0 0 30px 30px",padding:"18px 22px 22px",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(90% 70% at 88% -12%,rgba(192,160,98,.28),transparent 62%)",pointerEvents:"none"}}/>
    <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
     <button className="mm-ref-tap" onClick={onOpenProfile} style={{width:34,height:34,padding:0,borderRadius:"50%",background:"rgba(247,243,234,.10)",border:"1px solid rgba(192,160,98,.35)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:C.gold,overflow:"hidden",cursor:"pointer"}} aria-label="الملف الشخصي">{profileAvatar?<img src={profileAvatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>:"◉"}</button>
     <div style={{textAlign:"center"}}><div className="mm-amiri" style={{fontSize:19}}>مِرْآةُ الْمُسْلِمِ</div><div className="mm-cairo" style={{fontSize:10,color:"rgba(247,243,234,.5)",marginTop:3}}>{date}{hijri?` · ${hijri}`:""}</div></div>
     <button className="mm-ref-tap" onClick={()=>emit("islamic-calendar")} style={{width:34,height:34,padding:0,borderRadius:"50%",background:"rgba(247,243,234,.06)",border:"1px solid rgba(247,243,234,.14)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"rgba(247,243,234,.7)",cursor:"pointer"}} aria-label="التقويم">◔</button>
    </div>

    <div style={{position:"relative",marginTop:22,display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
     <div><div className="mm-cairo" style={{fontSize:12,color:"rgba(247,243,234,.55)"}}>الصلاة القادمة</div><div style={{fontSize:16,color:C.gold,fontWeight:600,marginTop:3}}>{next?AR[next.id]:"—"}</div></div>
     <div style={{textAlign:"left"}}><div className="mm-mono" style={{fontSize:"clamp(46px,12vw,54px)",fontWeight:300,lineHeight:1,letterSpacing:"-.03em",direction:"ltr"}}>{next?.time||"--:--"}</div><div className="mm-cairo" style={{fontSize:11,color:"rgba(247,243,234,.5)",marginTop:6}}>متبقٍ {next?remaining(next.at-tick):"بانتظار المواقيت"}</div></div>
    </div>

    <div style={{position:"relative",height:74,marginTop:14}}>
     <svg viewBox="0 0 340 74" width="100%" height="74" style={{display:"block"}}><path d="M6 64 C 68 10, 272 10, 334 64" fill="none" stroke="rgba(247,243,234,.16)" strokeWidth="1.5"/><path d="M6 64 C 68 10, 272 10, 334 64" fill="none" stroke={C.gold} strokeWidth="2" strokeDasharray={`${420*doneCount/5} 420`}/></svg>
     {MARK_POS.map((p,i)=><button key={PR[i]} onClick={()=>togglePrayer(i)} aria-label={AR[PR[i]]} style={{position:"absolute",top:p.top,right:p.right,width:i===2?12:10,height:i===2?12:10,borderRadius:"50%",background:done[i]?C.gold:C.navy,border:`1.5px solid ${done[i]?C.gold:"rgba(247,243,234,.35)"}`,transform:"translate(50%,-50%)",padding:0,cursor:"pointer"}}/>)}
    </div>
    <div style={{position:"relative",display:"flex",justifyContent:"space-between"}}>{PR.map(p=><div key={p} style={{flex:1,textAlign:"center"}}><div className="mm-cairo" style={{fontSize:10,color:next?.id===p?C.gold:"rgba(247,243,234,.45)"}}>{AR[p]}</div><div className="mm-mono" style={{fontSize:12,color:next?.id===p?C.gold:"rgba(247,243,234,.75)",marginTop:4,direction:"ltr"}}>{clean(data?.timings?.[p])||"--:--"}</div></div>)}</div>
    <div style={{position:"relative",marginTop:16,paddingTop:13,borderTop:"1px solid rgba(247,243,234,.10)",display:"flex",alignItems:"center",justifyContent:"space-between"}}><span className="mm-cairo" style={{fontSize:10,color:"rgba(247,243,234,.4)"}}>{status||"اضغط النقاط لتسجيل ما أدّيته"}</span><span style={{fontSize:11,color:C.gold}}>{ar(doneCount)} من ٥ صلوات</span></div>
   </section>

   <section style={{margin:"22px 20px 0",padding:"18px 20px",borderRadius:22,background:C.paper,border:"1px solid rgba(192,160,98,.35)",boxShadow:"0 16px 32px -26px rgba(16,45,67,.6)"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:11,color:C.gold2,background:"rgba(192,160,98,.13)",padding:"5px 12px",borderRadius:999}}>الآن</span><span className="mm-cairo" style={{fontSize:11,color:C.muted}}>{m.reason}</span></div>
    <div className="mm-amiri" style={{fontSize:25,marginTop:12,lineHeight:1.45}}>{m.title}</div>
    <div className="mm-cairo" style={{fontSize:12,color:"#6F7A85",marginTop:7,lineHeight:1.8}}>{m.sub}</div>
    <div style={{display:"flex",gap:9,marginTop:16}}><button className="mm-ref-tap" onClick={()=>emit(m.route)} style={{flex:1,border:0,textAlign:"center",background:C.navy,color:C.bg,borderRadius:999,padding:11,fontSize:13,fontWeight:600,cursor:"pointer"}}>{m.cta}</button><button className="mm-ref-tap" onClick={()=>setMoment(v=>(v+1)%MOMENTS.length)} style={{width:46,borderRadius:999,border:"1px solid rgba(16,45,67,.14)",background:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:C.gold2,cursor:"pointer"}}>↻</button></div>
   </section>

   <section style={{margin:"26px 20px 0"}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{height:1,flex:1,background:"rgba(16,45,67,.10)"}}/><span className="mm-cairo" style={{fontSize:11,color:C.muted}}>آية اليوم</span></div>
    <div className="mm-quran-text" style={{fontSize:21,lineHeight:2.05,marginTop:14,textAlign:"center",textWrap:"pretty"}}>{ayah?.text||"وَعَصَىٰٓ ءَادَمُ رَبَّهُۥ فَغَوَىٰ"}</div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:12}}><div style={{display:"flex",gap:16,fontSize:14,color:C.gold2}}><button onClick={()=>emit("quran-player")} style={{border:0,background:"transparent",color:"inherit",fontSize:14,padding:0,cursor:"pointer"}}>▷</button><button style={{border:0,background:"transparent",color:"inherit",fontSize:14,padding:0,cursor:"pointer"}}>♡</button><button style={{border:0,background:"transparent",color:"inherit",fontSize:14,padding:0,cursor:"pointer"}}>↗</button></div><span className="mm-cairo" style={{fontSize:11,color:C.muted}}>{ayah?`${ayah.surah?.name||""} · الآية ${ar(ayah.numberInSurah)}`:"طه · الآية ١٢١"}</span></div>
   </section>

   <button className="mm-ref-tap" onClick={()=>emit("search-library")} style={{width:"calc(100% - 40px)",margin:"26px 20px 0",display:"flex",alignItems:"center",gap:10,background:C.paper,border:"1px solid rgba(16,45,67,.09)",borderRadius:16,padding:"12px 15px",cursor:"pointer",textAlign:"right"}}><span style={{color:"#A9B0B8",fontSize:14}}>⌕</span><span className="mm-cairo" style={{fontSize:13,color:"#A9B0B8"}}>ابحث في الخدمات، السور، الأذكار…</span></button>

   <section style={{margin:"22px 20px 0"}}>
    <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:11}}><span className="mm-cairo" style={{fontSize:11,color:C.muted}}>يتعلّم من عادتك</span><span style={{fontSize:13,fontWeight:600}}>الأكثر استخداماً</span></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>{FAVS.map(([id,icon,name,meta])=><button key={id} className="mm-ref-tap" onClick={()=>emit(id)} style={{display:"flex",alignItems:"center",gap:11,padding:"13px 14px",borderRadius:18,background:C.paper,border:"1px solid rgba(16,45,67,.07)",cursor:"pointer",textAlign:"right"}}><span style={{width:34,height:34,borderRadius:12,background:"rgba(192,160,98,.14)",color:C.gold2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flex:"none"}}>{icon}</span><span><span style={{display:"block",fontSize:13,fontWeight:500}}>{name}</span><span className="mm-cairo" style={{display:"block",fontSize:10,color:C.muted,marginTop:3}}>{meta}</span></span></button>)}</div>
   </section>

   <section style={{margin:"26px 20px 0"}}>
    <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:11}}><span className="mm-cairo" style={{fontSize:11,color:C.muted}}>١٨ خدمة</span><span style={{fontSize:13,fontWeight:600}}>المكتبة</span></div>
    <div style={{display:"flex",flexDirection:"column",gap:9}}>{GROUPS.map((g,gi)=><div key={g.name} style={{borderRadius:20,background:C.paper,border:"1px solid rgba(16,45,67,.07)",overflow:"hidden"}}><button onClick={()=>setOpen(v=>v.map((x,i)=>i===gi?!x:x))} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 17px",border:0,background:"transparent",cursor:"pointer"}}><span style={{fontSize:15,lineHeight:1,color:C.gold2}}>{open[gi]?"⌃":"⌄"}</span><span style={{display:"flex",alignItems:"baseline",gap:9}}><span className="mm-cairo" style={{fontSize:11,color:C.muted}}>{ar(g.items.length)} خدمات</span><span style={{fontSize:14,fontWeight:500}}>{g.name}</span></span></button>{open[gi]&&<div style={{padding:"0 12px 14px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>{g.items.map(([id,icon,name])=><button key={id} className="mm-ref-tap" onClick={()=>emit(id)} style={{textAlign:"center",padding:"13px 6px",borderRadius:15,background:"rgba(16,45,67,.035)",border:0,cursor:"pointer"}}><div style={{fontSize:15,color:C.gold2}}>{icon}</div><div style={{fontSize:11,marginTop:7,color:C.text}}>{name}</div></button>)}</div>}</div>)}</div>
   </section>

   <section style={{margin:"24px 20px 26px",padding:"15px 18px",borderRadius:20,background:C.navy,color:C.bg,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
    <button onClick={()=>setMasjid(v=>!v)} aria-label="وضع المسجد" style={{width:44,height:26,padding:0,border:0,borderRadius:999,background:masjid?C.gold:"rgba(247,243,234,.22)",position:"relative",cursor:"pointer",flex:"none"}}><span style={{position:"absolute",top:3,right:masjid?21:3,width:20,height:20,borderRadius:"50%",background:C.bg,transition:"right 160ms ease"}}/></button>
    <div style={{textAlign:"left"}}><div style={{fontSize:13,fontWeight:600}}>وضع المسجد</div><div className="mm-cairo" style={{fontSize:11,color:"rgba(247,243,234,.6)",marginTop:4}}>{masjid?"كتم الإشعارات · القبلة والإقامة بخط كبير":"يكتم الإشعارات تلقائياً حتى تنتهي الصلاة"}</div></div>
   </section>
  </div></div>
 </div>;
}
