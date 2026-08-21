import React,{useEffect,useMemo,useState} from "react";

const C={bg:"#F6F1E7",paper:"#FFFDF8",text:"#2A2622",muted:"#6B6255",light:"#8A8073",gold:"#B8873F",goldText:"#8A6320",white:"#FFFFFF"};
const PR=["Fajr","Dhuhr","Asr","Maghrib","Isha"];
const AR={Fajr:"الفجر",Dhuhr:"الظهر",Asr:"العصر",Maghrib:"المغرب",Isha:"العشاء"};
const STATIONS=[
 [0,"#070b1c","#141a3a","#1d2547"],[200,"#0a1026","#1b2148","#2c2f55"],[238,"#1b1f42","#4c3f68","#8a6a76"],[330,"#31456f","#8e7896","#dda278"],[420,"#3c6795","#7fa8c6","#c9d7dd"],[726,"#1f6aab","#69a8d2","#bfe0f0"],[946,"#2c6c9e","#7ba7bf","#e6c795"],[1080,"#3f5b8c","#9a6f86","#eba86c"],[1122,"#4a3566","#a8536a","#f0a05c"],[1180,"#241f4c","#5a3a63","#b86a5c"],[1212,"#141a3c","#2c2551","#42305c"],[1320,"#0a0f26","#171d3f","#20264a"],[1440,"#070b1c","#141a3a","#1d2547"]
];
const QUICK=[["qibla","⌖","القِبلة"],["quran","◫","المصحف"],["tasbeeh","◌","التسبيح"],["smart-quranic-adhkar","◇","الأدعية"]];
const GROUPS=[
 {name:"عبادات",items:[["guide","○","الصلاة والوضوء"],["fasting-center","◔","الصيام"],["manasik","⌂","المناسك"],["zakat","◈","الزكاة"],["jumuah-center","▱","الجمعة"],["ramadan-center","◐","رمضان"]]},
 {name:"تعلّم وحفظ",items:[["memorization-center","▤","الحفظ والمراجعة"],["names-live","◇","أسماء الله"],["card-maker","□","البطاقات"],["notes","⌁","الملاحظات"],["quran-teacher","◎","معلّم القرآن"],["saved-library","▥","الحقيبة"]]},
 {name:"أدوات",items:[["islamic-calendar","◴","التقويم"],["accounts","▦","الحسابات"],["privacy-lock","◉","قفل الخصوصية"]]},
 {name:"الأطفال",items:[["kids-world","▢","قصص الأنبياء"],["kids-quiz-live","◍","ألعاب تعليمية"],["kids-world","✧","وسام الإنجاز"]]}
];
const STARS=Array.from({length:34},(_,i)=>({left:(7+(i*37)%87)+"%",top:(5+(i*53)%45)+"%",size:1.7+(i%3)*.4,delay:(i%9)*.37,dur:2.5+(i%8)*.43}));
const clean=v=>String(v||"").split(" ")[0];
const ar=v=>String(v??"").replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]);
function timeMin(v){const[h,m]=clean(v).split(":").map(Number);return Number.isFinite(h)?h*60+(m||0):0}
function epoch(v,add=0){const[h,m]=clean(v).split(":").map(Number);const d=new Date();d.setDate(d.getDate()+add);d.setHours(h||0,m||0,0,0);return d.getTime()}
function nextPrayer(t){if(!t)return null;const now=Date.now();for(let i=0;i<PR.length;i++){const p=PR[i],at=epoch(t[p]);if(at>now)return{id:p,time:clean(t[p]),at,index:i}}return{id:"Fajr",time:clean(t.Fajr),at:epoch(t.Fajr,1),index:0}}
function remaining(ms){if(!Number.isFinite(ms)||ms<=0)return"٠ ساعة و ٠ دقيقة";const mins=Math.floor(ms/60000);return`${ar(Math.floor(mins/60))} ساعة و ${ar(mins%60)} دقيقة`}
function emit(id){window.dispatchEvent(new CustomEvent("sakinah:feature",{detail:id}))}
function hexRgb(h){const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255]}
function lerp(a,b,t){return Math.round(a+(b-a)*t)}
function mix(a,b,t){const A=hexRgb(a),B=hexRgb(b);return`rgb(${lerp(A[0],B[0],t)},${lerp(A[1],B[1],t)},${lerp(A[2],B[2],t)})`}
function skyAt(min){let a=STATIONS[0],b=STATIONS[1];for(let i=0;i<STATIONS.length-1;i++){if(min>=STATIONS[i][0]&&min<=STATIONS[i+1][0]){a=STATIONS[i];b=STATIONS[i+1];break}}const t=(min-a[0])/Math.max(1,b[0]-a[0]);return{A:mix(a[1],b[1],t),B:mix(a[2],b[2],t),C:mix(a[3],b[3],t)}}
function dayOfYear(){const d=new Date(),s=new Date(d.getFullYear(),0,0);return Math.floor((d-s)/86400000)}
function dailyAyah(){return((dayOfYear()*37+83)%6236)+1}
function arcPoint(p){const x=195+173*Math.cos(Math.PI*p),y=146-118*Math.sin(Math.PI*p);return{x,y}}

export default function SakinahLiveHome({profileAvatar="",onOpenProfile}){
 const[data,setData]=useState(null),[tick,setTick]=useState(Date.now()),[ayah,setAyah]=useState(null),[status,setStatus]=useState(""),[preview,setPreview]=useState(null),[done,setDone]=useState([false,false,false,false,false]);
 useEffect(()=>{
  let alive=true;try{window.scrollTo(0,0)}catch{}
  if(navigator.geolocation)navigator.geolocation.getCurrentPosition(async p=>{try{const{latitude,longitude}=p.coords;const r=await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=4`);if(!r.ok)throw new Error();const j=await r.json();if(alive){setData(j?.data||null);setStatus("")}}catch{if(alive)setStatus("تعذر تحميل مواقيت الصلاة")}},()=>alive&&setStatus("فعّل الموقع لعرض المواقيت الدقيقة"),{enableHighAccuracy:true,timeout:12000});
  fetch(`https://api.alquran.cloud/v1/ayah/${dailyAyah()}/quran-uthmani`).then(r=>r.ok?r.json():Promise.reject()).then(j=>alive&&setAyah(j?.data||null)).catch(()=>{});
  const id=setInterval(()=>setTick(Date.now()),1000);return()=>{alive=false;clearInterval(id)};
 },[]);
 const timings=data?.timings||null,next=useMemo(()=>nextPrayer(timings),[timings,tick]);
 useEffect(()=>{if(next)setDone(PR.map((_,i)=>i<next.index))},[next?.id]);
 const now=new Date(tick),realMin=now.getHours()*60+now.getMinutes()+now.getSeconds()/60,displayMin=preview==null?realMin:Number(preview),sky=skyAt(displayMin);
 const fajr=timeMin(timings?.Fajr)||238,maghrib=timeMin(timings?.Maghrib)||1122;
 const isDay=displayMin>=fajr&&displayMin<=maghrib;
 let p;if(isDay)p=(displayMin-fajr)/Math.max(1,maghrib-fajr);else{const nightTotal=(1440-maghrib)+fajr;const passed=displayMin>=maghrib?displayMin-maghrib:1440-maghrib+displayMin;p=passed/Math.max(1,nightTotal)}
 p=Math.max(0,Math.min(1,p));const body=arcPoint(p);
 const date=new Intl.DateTimeFormat("ar-IQ",{weekday:"long",day:"numeric",month:"long"}).format(now);
 const hijri=data?.date?.hijri?`${ar(data.date.hijri.day)} ${data.date.hijri.month?.ar||""} ${ar(data.date.hijri.year)}`:"";
 const fmtMin=m=>`${String(Math.floor(m/60)).padStart(2,"0")}:${String(Math.floor(m%60)).padStart(2,"0")}`;
 const prayerProgress=done.filter(Boolean).length;
 return <div className="mm2-home" dir="rtl">
  <style>{`
   #root .mm2-home{position:fixed;inset:0;z-index:2147483500;overflow:auto;background:${C.bg};color:${C.text};font-family:'IBM Plex Sans Arabic','Cairo',sans-serif;scrollbar-width:none}#root .mm2-home::-webkit-scrollbar{display:none}#root .mm2-home *{box-sizing:border-box}
   .mm2-shell{width:min(100%,430px);min-height:100%;margin:auto;background:${C.bg};padding-bottom:94px}.mm2-amiri{font-family:'Amiri','Noto Naskh Arabic',serif}.mm2-card{background:${C.paper};border:1px solid rgba(0,0,0,.065);border-radius:20px}.mm2-section{margin:14px 20px 0}.mm2-label{font-size:10px;color:${C.light}}
   .mm2-hero{height:548px;position:relative;overflow:hidden;color:#fff;background:linear-gradient(180deg,var(--A) 0%,var(--B) 44%,var(--C) 80%,${C.bg} 100%);transition:background 1.4s linear}.mm2-head{padding:42px 22px 0;display:grid;grid-template-columns:44px 1fr 44px;align-items:start}.mm2-headbtn{width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.24);background:rgba(255,255,255,.07);color:#fff;display:grid;place-items:center;overflow:hidden}.mm2-title{text-align:center;text-shadow:0 2px 14px rgba(0,0,0,.4)}.mm2-title h1{font-size:27px;line-height:1.2;margin:0;font-weight:700}.mm2-title small{display:block;margin-top:5px;font-size:9.5px;color:rgba(255,255,255,.76)}
   .mm2-next{text-align:center;margin-top:16px;text-shadow:0 2px 14px rgba(0,0,0,.35)}.mm2-next-label{font-size:10px;letter-spacing:.08em;color:rgba(255,255,255,.78)}.mm2-next-name{font-size:34px;color:#f2d494;margin-top:1px;line-height:1.25}.mm2-clock{font-size:76px;font-weight:200;letter-spacing:2px;font-variant-numeric:tabular-nums;line-height:.98;direction:ltr}.mm2-chip{display:inline-block;margin-top:10px;padding:7px 13px;border-radius:999px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(8px);font-size:10px}
   .mm2-stars{position:absolute;inset:0 0 auto;height:330px;pointer-events:none;opacity:${isDay?0:1};transition:opacity 1.6s}.mm2-star{position:absolute;border-radius:50%;background:white;animation:mmTwinkle var(--d) ease-in-out var(--delay) infinite alternate}@keyframes mmTwinkle{from{opacity:.18}to{opacity:.88}}
   .mm2-arc{position:absolute;left:28px;right:28px;bottom:30px;height:174px}.mm2-arc svg{width:100%;height:100%;display:block}.mm2-celestial{position:absolute;width:${isDay?34:26}px;height:${isDay?34:26}px;left:${(body.x/390)*100}%;top:${(body.y/158)*100}%;transform:translate(-50%,-50%);transition:left 1s cubic-bezier(.4,0,.2,1),top 1s cubic-bezier(.4,0,.2,1),width .5s,height .5s}.mm2-sun{border-radius:50%;background:radial-gradient(circle,#fffdf2 0%,#ffcf7d 46%,#f4b45f 100%);box-shadow:0 0 22px 6px rgba(255,214,140,.55),0 0 70px 22px rgba(255,190,110,.28)}.mm2-moon{border-radius:50%;background:#fffdf2;box-shadow:inset -7px -2px 0 0 rgba(20,26,60,.92),0 0 18px rgba(230,235,255,.25)}
   .mm2-prayers{margin:-8px 20px 0;display:grid;grid-template-columns:repeat(5,1fr);gap:6px;position:relative;z-index:2}.mm2-prayer{position:relative;padding:10px 4px 9px;text-align:center;background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:14px}.mm2-prayer.active{background:rgba(184,135,63,.14);border-color:rgba(184,135,63,.58)}.mm2-prayer.active:before{content:'';position:absolute;right:12px;left:12px;top:0;height:2px;background:${C.gold};border-radius:0 0 4px 4px}.mm2-prayer b{font-size:9.5px;font-weight:600}.mm2-prayer span{display:block;margin-top:4px;font-size:10.5px;direction:ltr;color:${C.muted}}
   .mm2-meta{margin:12px 20px 0;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px}.mm2-meta>div{font-size:9.5px;color:${C.muted}}.mm2-dots{display:flex;gap:5px}.mm2-dots i{width:6px;height:6px;border-radius:50%;background:#d3ccc0}.mm2-dots i:nth-child(2){background:${C.gold}}
   .mm2-ayah{padding:17px}.mm2-ayahtext{font-size:21px;line-height:2;text-align:center}.mm2-actions{display:flex;justify-content:center;gap:8px;margin-top:10px}.mm2-actions button,.mm2-btn{border:1px solid rgba(0,0,0,.06);background:#fff;border-radius:999px;padding:7px 11px;font-size:9.5px;color:${C.goldText}}
   .mm2-quick{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.mm2-quick button{padding:13px 4px;border:1px solid rgba(0,0,0,.06);background:#fff;border-radius:16px;color:${C.text}}.mm2-quick .ico,.mm2-services .ico{font-size:22px;color:${C.gold};line-height:1}.mm2-quick .txt{font-size:10px;margin-top:7px}
   .mm2-wird{padding:16px}.mm2-wird h3{margin:0 0 10px;font-size:18px}.mm2-task{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(0,0,0,.05);font-size:10.5px}.mm2-task:last-of-type{border-bottom:0}.mm2-task.done{text-decoration:line-through;color:${C.goldText}}.mm2-progress{height:5px;background:#e7dfd2;border-radius:999px;overflow:hidden;margin-top:10px}.mm2-progress i{display:block;width:62%;height:100%;background:${C.gold}}
   .mm2-two{display:grid;grid-template-columns:1fr 1fr;gap:10px}.mm2-mini{padding:14px}.mm2-mini h4{margin:3px 0 5px;font-size:16px}.mm2-mini p{margin:0;font-size:9.5px;line-height:1.7;color:${C.muted}}
   .mm2-preview{padding:15px}.mm2-preview-top{display:flex;justify-content:space-between;align-items:center}.mm2-preview input{width:100%;accent-color:${C.gold};margin-top:10px}.mm2-preview-scale{display:flex;justify-content:space-between;font-size:9.5px;color:${C.light};margin-top:3px}.mm2-preview button{margin-top:8px;border:0;background:transparent;color:${C.goldText};font-size:9.5px}
   .mm2-services{display:grid;gap:14px}.mm2-group-title{font-size:12px;margin:0 0 8px}.mm2-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.mm2-service{min-height:88px;padding:12px 6px;border:1px solid rgba(0,0,0,.065);background:#fff;border-radius:16px;text-align:center}.mm2-service .name{font-size:10px;margin-top:8px;line-height:1.45}.mm2-bottom{height:20px}
  `}</style>
  <div className="mm2-shell">
   <section className="mm2-hero" style={{'--A':sky.A,'--B':sky.B,'--C':sky.C}}>
    <div className="mm2-stars">{STARS.map((s,i)=><i key={i} className="mm2-star" style={{left:s.left,top:s.top,width:s.size,height:s.size,'--delay':`${s.delay}s`,'--d':`${s.dur}s`}}/>)}</div>
    <div className="mm2-head">
     <button className="mm2-headbtn" onClick={()=>emit('settings')} aria-label="الإعدادات">◴</button>
     <div className="mm2-title"><h1 className="mm2-amiri">مِرْآةُ المُسْلِم</h1><small>{date}{hijri?` · ${hijri}`:""}</small></div>
     <button className="mm2-headbtn" onClick={onOpenProfile} aria-label="الملف الشخصي">{profileAvatar?<img src={profileAvatar} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:'○'}</button>
    </div>
    <div className="mm2-next"><div className="mm2-next-label">الصلاة القادمة</div><div className="mm2-amiri mm2-next-name">{next?AR[next.id]:"—"}</div><div className="mm2-clock">{next?.time||"--:--"}</div><div className="mm2-chip">متبقٍ {next?remaining(next.at-tick):"بانتظار المواقيت"}</div></div>
    <div className="mm2-arc"><svg viewBox="0 0 390 158" aria-label="قوس الوقت"><polyline points={Array.from({length:61},(_,i)=>{const q=arcPoint(i/60);return`${q.x},${q.y}`}).join(' ')} fill="none" stroke="rgba(120,110,95,.40)" strokeWidth="1.3" strokeDasharray="2.8 5"/></svg><div className={`mm2-celestial ${isDay?'mm2-sun':'mm2-moon'}`}/></div>
   </section>

   <section className="mm2-prayers">{PR.map((p,i)=><button key={p} className={`mm2-prayer ${next?.id===p?'active':''}`} onClick={()=>setDone(v=>v.map((x,k)=>k===i?!x:x))}><b>{AR[p]}</b><span>{clean(timings?.[p])||'--:--'}</span></button>)}</section>
   <div className="mm2-meta"><div>الموقع<br/><b>{status||'بغداد - العراق'}</b></div><div className="mm2-dots"><i/><i/><i/></div><div style={{textAlign:'left'}}>أُنجز اليوم<br/><b style={{color:C.goldText}}>{ar(prayerProgress)} من ٥</b></div></div>

   <section className="mm2-section mm2-card mm2-ayah"><div className="mm2-label">آية اليوم</div><div className="mm2-amiri mm2-ayahtext">{ayah?.text||'﴿ إِنَّ مَعَ الْعُسْرِ يُسْرًا ﴾'}</div><div className="mm2-actions"><button onClick={()=>emit('quran')}>تفسير</button><button onClick={()=>emit('quran-player')}>استماع</button><button onClick={()=>emit('saved-library')}>حفظ</button></div></section>

   <section className="mm2-section"><div className="mm2-label" style={{marginBottom:8}}>أدوات سريعة</div><div className="mm2-quick">{QUICK.map(([id,ico,name])=><button key={id} onClick={()=>emit(id)}><div className="ico">{ico}</div><div className="txt">{name}</div></button>)}</div></section>

   <section className="mm2-section mm2-card mm2-wird"><div className="mm2-label">وِردُ اليوم</div><h3 className="mm2-amiri">خطواتك اليومية</h3><div className="mm2-task done"><span>أذكار الصباح</span><span>تم</span></div><div className="mm2-task"><span>صفحتان من القرآن</span><span>٢ / ٤</span></div><div className="mm2-task"><span>تسبيح ١٠٠ مرة</span><span>٦٢</span></div><div className="mm2-progress"><i/></div></section>

   <section className="mm2-section mm2-two"><button className="mm2-card mm2-mini" onClick={()=>emit('jumuah-center')}><div className="mm2-label">الجمعة</div><h4 className="mm2-amiri">خطبة الجمعة</h4><p>استعدادات الجمعة وسورة الكهف والتذكيرات الخاصة بها.</p></button><button className="mm2-card mm2-mini" onClick={()=>emit('fasting-center')}><div className="mm2-label">تذكير</div><h4 className="mm2-amiri">الصيام</h4><p>الأيام البيض والاثنين والخميس ومتابعة الصيام.</p></button></section>

   <section className="mm2-section mm2-card mm2-preview"><div className="mm2-preview-top"><div><div className="mm2-label">أداة تصميم</div><b style={{fontSize:11}}>معاينة الفترة الزمنية</b></div><b style={{fontSize:11,color:C.goldText}}>{fmtMin(displayMin)}</b></div><input type="range" min="0" max="1439" value={Math.round(displayMin)} onChange={e=>setPreview(Number(e.target.value))}/><div className="mm2-preview-scale"><span>٠٠:٠٠</span><span>الفجر</span><span>الظهر</span><span>المغرب</span><span>٢٣:٥٩</span></div>{preview!=null&&<button onClick={()=>setPreview(null)}>العودة للوقت الحقيقي</button>}</section>

   <section className="mm2-section mm2-services">{GROUPS.map(g=><div key={g.name}><h3 className="mm2-group-title">{g.name}</h3><div className="mm2-grid">{g.items.map(([id,ico,name])=><button className="mm2-service" key={`${g.name}-${name}`} onClick={()=>emit(id)}><div className="ico">{ico}</div><div className="name">{name}</div></button>)}</div></div>)}</section>
   <div className="mm2-bottom"/>
  </div>
 </div>;
}
