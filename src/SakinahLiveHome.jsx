import React,{useEffect,useMemo,useState} from "react";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62"};
const PR=["Fajr","Dhuhr","Asr","Maghrib","Isha"];
const AR={Fajr:"الفجر",Dhuhr:"الظهر",Asr:"العصر",Maghrib:"المغرب",Isha:"العشاء"};
const clean=v=>(v||"").split(" ")[0];
function hm(v){const [h,m]=clean(v).split(":").map(Number);return (h||0)+(m||0)/60}
function epoch(v,dayOffset=0){const [h,m]=clean(v).split(":").map(Number);const d=new Date();d.setDate(d.getDate()+dayOffset);d.setHours(h||0,m||0,0,0);return d.getTime()}
function nextPrayer(t){if(!t)return null;const now=Date.now();for(const p of PR){const at=epoch(t[p]);if(at>now)return {id:p,time:clean(t[p]),at}}return {id:"Fajr",time:clean(t.Fajr),at:epoch(t.Fajr,1)}}
function remaining(ms){if(ms<=0)return "٠ ساعة و ٠ دقيقة";const m=Math.floor(ms/60000),h=Math.floor(m/60),mm=m%60;return `${h} ساعة و ${mm} دقيقة`}
function emit(id){window.dispatchEvent(new CustomEvent("sakinah:feature",{detail:id}))}
function stageFor(t){
 const now=new Date(),x=now.getHours()+now.getMinutes()/60;
 if(!t)return {from:"#F6E9C8",to:"#F6F3EC",dark:false};
 const fajr=hm(t.Fajr),sun=hm(t.Sunrise),dhuhr=hm(t.Dhuhr),asr=hm(t.Asr),mag=hm(t.Maghrib),isha=hm(t.Isha);
 if(x<fajr||x>=isha)return {from:"#0D1118",to:"#151D2C",dark:true};
 if(x<sun)return {from:"#19293B",to:"#526A7A",dark:true};
 if(x<dhuhr)return {from:"#F0E3BF",to:"#F6F3EC",dark:false};
 if(x<asr)return {from:"#FAF8F2",to:"#ECE3CF",dark:false};
 if(x<mag)return {from:"#F4E7D2",to:"#DDBD96",dark:false};
 return {from:"#D59B70",to:"#3A2630",dark:true};
}
function DayArc({timings,next,dark}){
 const points=["Fajr","Dhuhr","Asr","Maghrib","Isha"];
 return <div style={{position:"relative",height:96,marginTop:22}}><svg viewBox="0 0 420 110" style={{width:"100%",height:"100%",overflow:"visible"}}><path d="M20 88 Q210 -14 400 88" fill="none" stroke={dark?"rgba(246,243,236,.25)":"rgba(16,16,15,.16)"} strokeWidth="1.2"/><path d="M20 88 Q210 -14 400 88" fill="none" stroke={C.gold} strokeWidth="1.8" strokeDasharray="205 400" strokeLinecap="round"/>{points.map((p,i)=>{const x=[20,120,210,300,400][i],y=[88,42,22,42,88][i],on=next?.id===p;return <g key={p}><circle cx={x} cy={y} r={on?6:3} fill={on?C.gold:(dark?"rgba(246,243,236,.55)":"rgba(16,16,15,.42)")}/></g>})}</svg></div>
}
const cardStyle={border:0,borderRadius:24,padding:17,background:"rgba(255,255,255,.58)",boxShadow:"0 12px 30px rgba(16,16,15,.05)",fontFamily:"inherit",textAlign:"right",color:C.ink};
export default function SakinahLiveHome(){
 const [data,setData]=useState(null),[status,setStatus]=useState(""),[tick,setTick]=useState(Date.now());
 const load=()=>{setStatus("جاري تحديد الموقع…");if(!navigator.geolocation){setStatus("الموقع غير مدعوم على هذا الجهاز");return}navigator.geolocation.getCurrentPosition(async p=>{try{const {latitude,longitude}=p.coords;const r=await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=4`);if(!r.ok)throw new Error();const j=await r.json();setData(j?.data||null);setStatus("")}catch{setStatus("تعذر تحميل مواقيت الصلاة الآن")}},()=>setStatus("فعّل الموقع واسمح لسكينة بالوصول إليه"),{enableHighAccuracy:true,timeout:12000})};
 useEffect(()=>{load();const id=setInterval(()=>setTick(Date.now()),30000);return()=>clearInterval(id)},[]);
 const next=useMemo(()=>nextPrayer(data?.timings),[data,tick]);
 const stage=stageFor(data?.timings);
 const fg=stage.dark?C.ivory:C.ink;
 const date=new Intl.DateTimeFormat("ar-IQ",{weekday:"long",day:"numeric",month:"long"}).format(new Date());
 const hijri=data?.date?.hijri?.date?`${data.date.hijri.day} ${data.date.hijri.month?.ar||""} ${data.date.hijri.year}`:"";
 return <div style={{minHeight:"100vh",background:C.ivory,color:C.ink,paddingBottom:118}} dir="rtl">
  <section style={{minHeight:500,padding:"18px 20px 22px",background:`linear-gradient(180deg,${stage.from},${stage.to})`,color:fg,transition:"background 1s ease,color .5s ease"}}>
   <header style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}><div><div style={{fontSize:9,letterSpacing:1.4,opacity:.4}}>SAKINAH</div><div style={{fontFamily:"Fraunces,serif",fontSize:29,marginTop:2}}>سكينة</div><div style={{fontSize:10,opacity:.46,marginTop:5}}>{date}{hijri?` · ${hijri}`:""}</div></div><button onClick={load} style={{width:42,height:42,borderRadius:15,border:`1px solid ${stage.dark?"rgba(246,243,236,.18)":"rgba(16,16,15,.08)"}`,background:stage.dark?"rgba(255,255,255,.07)":"rgba(255,255,255,.38)",color:fg,fontSize:17}}>↻</button></header>
   <div style={{marginTop:94}}><div style={{fontSize:11,letterSpacing:1,opacity:.52}}>{next?AR[next.id]:"الصلاة القادمة"}</div><div style={{fontSize:64,lineHeight:1,fontWeight:600,marginTop:9,fontFamily:"'IBM Plex Sans Arabic',sans-serif"}}>{next?.time||"--:--"}</div><div style={{fontSize:12.5,opacity:.56,marginTop:8}}>متبقي · {next?remaining(next.at-tick):"بانتظار المواقيت"}</div></div>
   <DayArc timings={data?.timings} next={next} dark={stage.dark}/>
   <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5,marginTop:7,paddingTop:16,borderTop:`1px solid ${stage.dark?"rgba(246,243,236,.14)":"rgba(16,16,15,.10)"}`}}>{PR.map(p=><div key={p} style={{textAlign:"center"}}><div style={{fontSize:8.5,opacity:.48}}>{AR[p]}</div><div style={{fontSize:12.5,marginTop:6,fontWeight:next?.id===p?700:500,color:next?.id===p?C.gold:fg}}>{clean(data?.timings?.[p])||"--:--"}</div></div>)}</div>
   {status&&<div style={{fontSize:10,opacity:.58,marginTop:12}}>{status}</div>}
  </section>

  <main style={{padding:"14px 20px 0"}}>
   <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}><button onClick={()=>emit("qibla")} style={cardStyle}><div style={{fontSize:24,color:C.gold}}>⌖</div><div style={{fontSize:14,fontWeight:700,marginTop:15}}>اتجاه القبلة</div><div style={{fontSize:9.5,opacity:.44,marginTop:5}}>GPS + البوصلة</div></button><button onClick={()=>emit("alerts")} style={cardStyle}><div style={{fontSize:24,color:C.gold}}>◔</div><div style={{fontSize:14,fontWeight:700,marginTop:15}}>المؤذن</div><div style={{fontSize:9.5,opacity:.44,marginTop:5}}>تنبيهات وأصوات الصلاة</div></button></div>

   <section style={{marginTop:24}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:9.5,opacity:.42}}>القرآن الكريم</div><div style={{fontFamily:"Fraunces,serif",fontSize:24,marginTop:3}}>اقرأ · استمع · تدبّر</div></div><button onClick={()=>emit("quran-intelligence")} style={{border:0,background:"transparent",fontFamily:"inherit",fontSize:11,color:C.lapis}}>فتح القرآن ←</button></div><div style={{display:"grid",gridTemplateColumns:"1.15fr .85fr",gap:10,marginTop:13}}><button onClick={()=>emit("quran-player")} style={{...cardStyle,minHeight:145,background:"linear-gradient(145deg,#181E22,#0D1418)",color:"white"}}><div style={{fontSize:26,color:"#E7D29B"}}>♪</div><div style={{fontSize:16,fontWeight:700,marginTop:37}}>مشغل القرآن</div><div style={{fontSize:9.5,opacity:.5,marginTop:5}}>قرّاء · سور · تكرار · سرعة</div></button><button onClick={()=>emit("tafsir-library")} style={{...cardStyle,minHeight:145}}><div style={{fontSize:26,color:C.gold}}>▥</div><div style={{fontSize:14,fontWeight:700,marginTop:37}}>التفسير</div><div style={{fontSize:9.5,opacity:.44,marginTop:5}}>تفاسير حية</div></button></div></section>

   <section style={{marginTop:24}}><div style={{fontSize:9.5,opacity:.42}}>أزرار سريعة</div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:10}}>{[["nine-books","▤","الأحاديث"],["smart-quranic-adhkar","◎","الأذكار"],["daily-tools","☼","يومي"],["mosques","⌂","المساجد"],["tasbeeh","◉","المسبحة"],["profiles","♙","البروفايلات"],["notes","✎","الملاحظات"],["accounts","⌁","الحسابات"],["card-maker","◇","البطاقات"]].map(([id,icon,label])=><button key={id} onClick={()=>emit(id)} style={{...cardStyle,minHeight:84,padding:12,textAlign:"center"}}><div style={{fontSize:20,color:C.gold}}>{icon}</div><div style={{fontSize:10.5,fontWeight:650,marginTop:8}}>{label}</div></button>)}</div></section>
  </main>
 </div>
}
