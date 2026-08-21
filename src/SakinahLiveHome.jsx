import React,{useEffect,useMemo,useState} from "react";

const C={bg:"#F7F3EA",paper:"#FDFBF7",navy:"#102D43",navy2:"#0B3756",gold:"#D6A746",gold2:"#B08D4F",muted:"#8E96A0",text:"#1E3E56"};
const PR=["Fajr","Dhuhr","Asr","Maghrib","Isha"];
const AR={Fajr:"الفجر",Dhuhr:"الظهر",Asr:"العصر",Maghrib:"المغرب",Isha:"العشاء"};
const PI={Fajr:"☾",Dhuhr:"☀",Asr:"☁",Maghrib:"☀",Isha:"☾"};
const MARK_POS=[{right:"5%",top:"88%"},{right:"27%",top:"28%"},{right:"50%",top:"8%"},{right:"73%",top:"28%"},{right:"95%",top:"88%"}];
const MOMENTS=[
 {reason:"الجمعة",title:"سورة الكهف",sub:"قراءتها يوم الجمعة سُنّة — ٢٥ دقيقة استماعاً مع المعيقلي.",cta:"ابدأ الاستماع",route:"quran-player"},
 {reason:"بعد الفجر",title:"أذكار الصباح",sub:"١٢ ذكراً · وقتها من الفجر إلى الضحى.",cta:"ابدأ الأذكار",route:"smart-quranic-adhkar"},
 {reason:"قبل المغرب",title:"وِردك اليومي",sub:"بقيت لك صفحتان لإكمال ورد اليوم.",cta:"أكمل الورد",route:"smart-khatmah"},
 {reason:"ليلاً",title:"أذكار النوم",sub:"آية الكرسي والمعوّذات وثلاث تسبيحات.",cta:"ابدأ",route:"smart-quranic-adhkar"}
];
const FAVS=[["quran","◍","القرآن","الكهف · ٩:١٢"],["smart-quranic-adhkar","✧","الأذكار","المساء"],["tasbeeh","◈","التسبيح","٣٣ / ١٠٠"],["adult-nasheeds","♪","الأناشيد","٨ ملفات"]];
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
  let alive=true;try{window.scrollTo(0,0)}catch{}
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
   #root .mm-reference-home::-webkit-scrollbar{display:none}#root .mm-reference-home *{box-sizing:border-box}
   #root .mm-reference-home .mm-amiri{font-family:'Amiri','Noto Naskh Arabic',serif!important}#root .mm-reference-home .mm-mono{font-family:'IBM Plex Mono',monospace!important}#root .mm-reference-home .mm-quran-text{font-family:'Amiri Quran','Amiri','Noto Naskh Arabic',serif!important}#root .mm-reference-home .mm-cairo{font-family:'Cairo','Noto Kufi Arabic',sans-serif!important}
   .mm-reference-frame{width:min(100%,560px);min-height:100%;margin:0 auto;padding:0 8px 96px;background:${C.navy}}
   .mm-reference-sheet{width:100%;min-height:100%;overflow:hidden;background:${C.bg}}
   .mm-prayer-hero{position:relative;overflow:hidden;isolation:isolate;background:linear-gradient(180deg,#07365b 0%,#0c4266 48%,#102d43 100%);color:#f7f3ea;border-radius:0 0 30px 30px;padding:24px 24px 24px;min-height:690px;border:1px solid rgba(210,190,140,.18);box-shadow:inset 0 1px 0 rgba(255,255,255,.05)}
   .mm-sky-glow{position:absolute;inset:0;z-index:-2;background:radial-gradient(circle at 78% 39%,rgba(240,184,75,.18),transparent 26%),radial-gradient(circle at 12% 25%,rgba(125,185,221,.10),transparent 26%)}
   .mm-prayer-row{position:relative;display:flex;justify-content:space-between;gap:6px;margin-top:4px}.mm-prayer-cell{flex:1;text-align:center;min-width:0}.mm-prayer-icon{height:28px;display:grid;place-items:center;font-size:20px;color:rgba(245,238,222,.72);margin-top:7px}.mm-prayer-cell.active .mm-prayer-icon{color:${C.gold}}
   .mm-hero-footer{position:relative;margin-top:22px;padding-top:16px;border-top:1px solid rgba(247,243,234,.13);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px}.mm-hero-footer .place{text-align:right}.mm-hero-footer .log{text-align:left}.mm-dots{display:flex;gap:7px;justify-content:center}.mm-dots i{width:7px;height:7px;border-radius:50%;background:rgba(247,243,234,.42)}.mm-dots i:nth-child(2){background:${C.gold}}
   .mm-ref-tap{transition:transform .14s ease}.mm-ref-tap:active{transform:scale(.97)}
   @media(max-width:520px){.mm-reference-frame{padding:0 0 96px}.mm-prayer-hero{border-left:0;border-right:0;border-top:0;border-radius:0 0 30px 30px;min-height:665px;padding:22px 18px 22px}.mm-reference-sheet{border-radius:0}.mm-hero-footer{grid-template-columns:1fr auto 1fr}}
  `}</style>
  <div className="mm-reference-frame"><div className="mm-reference-sheet">
   <section className="mm-prayer-hero">
    <div className="mm-sky-glow"/>
    <div style={{position:"relative",display:"grid",gridTemplateColumns:"44px 1fr 44px",alignItems:"start"}}>
     <button className="mm-ref-tap" onClick={onOpenProfile} style={{width:40,height:40,padding:0,borderRadius:"50%",background:"rgba(247,243,234,.08)",border:"1px solid rgba(192,160,98,.32)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",cursor:"pointer",justifySelf:"start"}} aria-label="الملف الشخصي">{profileAvatar?<img src={profileAvatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:"◉"}</button>
     <div style={{textAlign:"center"}}><div className="mm-amiri" style={{fontSize:29,lineHeight:1.25,textShadow:"0 2px 12px rgba(0,0,0,.22)"}}>مِرْآةُ الْمُسْلِمِ</div><div className="mm-cairo" style={{fontSize:10.5,color:"rgba(247,243,234,.68)",marginTop:8}}>{date}{hijri?` · ${hijri}`:""}</div></div>
     <button className="mm-ref-tap" onClick={()=>emit("islamic-calendar")} style={{width:40,height:40,padding:0,borderRadius:"50%",background:"rgba(247,243,234,.06)",border:"1px solid rgba(247,243,234,.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:"rgba(247,243,234,.84)",cursor:"pointer",justifySelf:"end"}} aria-label="التقويم">◔</button>
    </div>

    <div style={{position:"relative",marginTop:54,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center"}}>
     <div className="mm-mono" style={{fontSize:"clamp(64px,16vw,82px)",fontWeight:300,lineHeight:.92,letterSpacing:"-.05em",direction:"ltr",textShadow:"0 5px 24px rgba(0,0,0,.14)"}}>{next?.time||"--:--"}</div>
     <div className="mm-cairo" style={{fontSize:11,color:"rgba(247,243,234,.7)",marginTop:15}}>متبقٍ {next?remaining(next.at-tick):"بانتظار المواقيت"}</div>
     <div style={{width:34,height:1,background:C.gold,marginTop:13,opacity:.85}}/>
     <div className="mm-cairo" style={{fontSize:13,color:"rgba(247,243,234,.78)",marginTop:12}}>الصلاة القادمة</div>
     <div className="mm-amiri" style={{fontSize:30,color:C.gold,fontWeight:600,marginTop:2,lineHeight:1.25}}>{next?AR[next.id]:"—"}</div>
    </div>

    <div style={{position:"relative",height:126,marginTop:20}}>
     <svg viewBox="0 0 340 126" width="100%" height="126" style={{display:"block"}}><defs><linearGradient id="mmArcGold" x1="0" x2="1"><stop offset="0" stopColor="rgba(122,168,198,.42)"/><stop offset=".34" stopColor={C.gold}/><stop offset=".72" stopColor={C.gold}/><stop offset="1" stopColor="rgba(122,168,198,.42)"/></linearGradient></defs><path d="M6 112 C 72 2, 268 2, 334 112" fill="none" stroke="url(#mmArcGold)" strokeWidth="2.2"/></svg>
     {MARK_POS.map((p,i)=><button key={PR[i]} onClick={()=>togglePrayer(i)} aria-label={AR[PR[i]]} style={{position:"absolute",top:p.top,right:p.right,width:i===2?13:11,height:i===2?13:11,borderRadius:"50%",background:done[i]?C.gold:C.navy2,border:`1.5px solid ${done[i]?C.gold:"rgba(247,243,234,.65)"}`,boxShadow:"0 0 0 3px rgba(16,45,67,.7)",transform:"translate(50%,-50%)",padding:0,cursor:"pointer"}}/>)}
    </div>

    <div className="mm-prayer-row">{PR.map(p=><div key={p} className={`mm-prayer-cell ${next?.id===p?"active":""}`}><div className="mm-cairo" style={{fontSize:11,color:next?.id===p?C.gold:"rgba(247,243,234,.78)"}}>{AR[p]}</div><div className="mm-mono" style={{fontSize:13,color:next?.id===p?C.gold:"rgba(247,243,234,.94)",marginTop:4,direction:"ltr"}}>{clean(data?.timings?.[p])||"--:--"}</div><div className="mm-prayer-icon">{PI[p]}</div></div>)}</div>

    <div className="mm-hero-footer"><div className="place"><div className="mm-cairo" style={{fontSize:9,color:"rgba(247,243,234,.48)"}}>الموقع</div><div className="mm-cairo" style={{fontSize:10.5,color:"rgba(247,243,234,.78)",marginTop:3}}>بغداد - العراق</div></div><div className="mm-dots"><i/><i/><i/></div><div className="log"><div className="mm-cairo" style={{fontSize:9.5,color:"rgba(247,243,234,.48)"}}>{status||"اضغط النقاط لتسجيل ما أدّيته"}</div><div style={{fontSize:11,color:C.gold,marginTop:4}}>{ar(doneCount)} من ٥ صلوات</div></div></div>
   </section>

   <section style={{margin:"22px 20px 0",padding:"18px 20px",borderRadius:22,background:C.paper,border:"1px solid rgba(192,160,98,.35)",boxShadow:"0 16px 32px -26px rgba(16,45,67,.6)"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:11,color:C.gold2,background:"rgba(192,160,98,.13)",padding:"5px 12px",borderRadius:999}}>الآن</span><span className="mm-cairo" style={{fontSize:11,color:C.muted}}>{m.reason}</span></div><div className="mm-amiri" style={{fontSize:25,marginTop:12,lineHeight:1.45}}>{m.title}</div><div className="mm-cairo" style={{fontSize:12,color:"#6F7A85",marginTop:7,lineHeight:1.8}}>{m.sub}</div><div style={{display:"flex",gap:9,marginTop:15}}><button className="mm-ref-tap" onClick={()=>emit(m.route)} style={{flex:1,border:0,borderRadius:14,padding:"11px 14px",background:C.navy,color:C.bg,fontSize:11,cursor:"pointer"}}>{m.cta}</button><button className="mm-ref-tap" onClick={()=>setMoment(v=>(v+1)%MOMENTS.length)} style={{width:44,border:"1px solid rgba(16,45,67,.10)",borderRadius:14,background:"transparent",cursor:"pointer"}}>↻</button></div></section>

   <section style={{margin:"24px 20px 0"}}><div className="mm-cairo" style={{fontSize:11,color:C.muted,marginBottom:10}}>المفضلة</div><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>{FAVS.map(([id,icon,title,sub])=><button key={id} className="mm-ref-tap" onClick={()=>emit(id)} style={{border:"1px solid rgba(16,45,67,.08)",borderRadius:18,background:"rgba(255,255,255,.45)",padding:"14px 7px",cursor:"pointer"}}><div style={{fontSize:19,color:C.gold}}>{icon}</div><div style={{fontSize:11,marginTop:8}}>{title}</div><div style={{fontSize:9,color:C.muted,marginTop:3}}>{sub}</div></button>)}</div></section>
   <section style={{margin:"26px 20px 0"}}><div className="mm-cairo" style={{fontSize:11,color:C.muted,marginBottom:10}}>آية اليوم</div><button onClick={()=>emit("quran")} style={{width:"100%",border:"1px solid rgba(16,45,67,.08)",borderRadius:22,background:C.paper,padding:"18px 18px",textAlign:"right",cursor:"pointer"}}><div className="mm-quran-text" style={{fontSize:24,lineHeight:2}}>{ayah?.text||"﴿ إِنَّ مَعَ الْعُسْرِ يُسْرًا ﴾"}</div><div style={{fontSize:9,color:C.muted,marginTop:8}}>{ayah?.surah?.name||"الشرح"} · {ayah?.numberInSurah?ar(ayah.numberInSurah):"٦"}</div></button></section>
   <section style={{margin:"26px 20px 0 20px"}}>{GROUPS.map((g,gi)=><div key={g.name} style={{marginTop:gi?22:0}}><button onClick={()=>setOpen(v=>v.map((x,i)=>i===gi?!x:x))} style={{width:"100%",border:0,background:"transparent",display:"flex",justifyContent:"space-between",padding:"0 0 9px",cursor:"pointer"}}><span style={{fontSize:13}}>{g.name}</span><span style={{fontSize:13,color:C.gold}}>{open[gi]?"−":"+"}</span></button>{open[gi]&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>{g.items.map(([id,icon,title])=><button key={id} className="mm-ref-tap" onClick={()=>emit(id)} style={{minHeight:82,border:"1px solid rgba(16,45,67,.08)",borderRadius:17,background:"rgba(255,255,255,.42)",padding:10,cursor:"pointer"}}><div style={{fontSize:18,color:C.gold}}>{icon}</div><div style={{fontSize:10.5,marginTop:8,lineHeight:1.5}}>{title}</div></button>)}</div>}</div>)}</section>
   <section style={{margin:"26px 20px 30px",padding:"18px",borderRadius:22,background:"linear-gradient(135deg,#183B52,#102D43)",color:C.bg}}><div style={{fontSize:11,color:"rgba(247,243,234,.6)"}}>المسجد القريب</div><div className="mm-amiri" style={{fontSize:22,marginTop:7}}>وضع المسجد</div><div style={{fontSize:10,color:"rgba(247,243,234,.48)",marginTop:5}}>فعّل الواجهة الهادئة أثناء وجودك في المسجد.</div><button className="mm-ref-tap" onClick={()=>setMasjid(v=>!v)} style={{marginTop:13,border:`1px solid ${masjid?C.gold:"rgba(247,243,234,.18)"}`,borderRadius:999,padding:"8px 14px",background:masjid?"rgba(192,160,98,.16)":"transparent",color:masjid?C.gold:C.bg,cursor:"pointer",fontSize:10}}>{masjid?"مفعّل":"تفعيل"}</button></section>
  </div></div>
 </div>;
}
