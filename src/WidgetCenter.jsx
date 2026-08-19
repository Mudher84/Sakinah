import React,{useEffect,useMemo,useState} from "react";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62",green:"#426B5A"};
const PR=["Fajr","Dhuhr","Asr","Maghrib","Isha"];
const PR_AR={Fajr:"الفجر",Dhuhr:"الظهر",Asr:"العصر",Maghrib:"المغرب",Isha:"العشاء"};
const THEMES=[
 {id:"lapis",name:"كحلي",bg:"linear-gradient(145deg,#173B57,#0B293E)",accent:"#F0D58F",fg:"#FFFFFF"},
 {id:"emerald",name:"زمرد",bg:"linear-gradient(145deg,#28584D,#173E38)",accent:"#E8D19A",fg:"#FFFFFF"},
 {id:"ivory",name:"فاتح",bg:"linear-gradient(145deg,#FFFDF8,#EEE5D4)",accent:"#8E7642",fg:"#173B57"}
];
const btn={border:"1px solid rgba(16,16,15,.08)",borderRadius:16,padding:11,background:"rgba(255,255,255,.64)",fontFamily:"inherit",color:"inherit"};
const native=()=>typeof window!=="undefined"&&window.SakinahNative?window.SakinahNative:null;
function clean(v=""){return String(v).split(" ")[0]}
function epochToday(v){const [h,m]=clean(v).split(":").map(Number),d=new Date();d.setHours(h||0,m||0,0,0);return d.getTime()}
function nextPrayer(t){if(!t)return null;const now=Date.now();for(const p of PR){const at=epochToday(t[p]);if(at>now)return{prayer:p,time:clean(t[p]),at}}const d=new Date();d.setDate(d.getDate()+1);const[h,m]=clean(t.Fajr).split(":").map(Number);d.setHours(h||0,m||0,0,0);return{prayer:"Fajr",time:clean(t.Fajr),at:d.getTime()}}
function countdown(at,now){if(!at)return"--:--";const s=Math.max(0,Math.floor((at-now)/1000)),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),ss=s%60;return h>0?`${h}:${String(m).padStart(2,"0")}:${String(ss).padStart(2,"0")}`:`${m}:${String(ss).padStart(2,"0")}`}
async function loadPrayerData(){return new Promise((resolve,reject)=>{if(!navigator.geolocation)return reject(new Error("geo"));navigator.geolocation.getCurrentPosition(async p=>{try{const r=await fetch(`https://api.aladhan.com/v1/timings?latitude=${p.coords.latitude}&longitude=${p.coords.longitude}&method=4`);const j=await r.json();resolve(j?.data||null)}catch(e){reject(e)}},reject,{enableHighAccuracy:true,timeout:10000})})}
function hijriLabel(data){const h=data?.date?.hijri;if(!h)return"";return `${h.day||""} ${h.month?.ar||h.month?.en||""} ${h.year||""}`.trim()}

export default function WidgetCenter({lang="ar"}){
 const [data,setData]=useState(null),[now,setNow]=useState(Date.now()),[theme,setTheme]=useState(()=>{try{return localStorage.getItem("sakinah-widget-theme")||"lapis"}catch{return"lapis"}}),[msg,setMsg]=useState("");
 useEffect(()=>{let alive=true;loadPrayerData().then(x=>{if(alive)setData(x)}).catch(()=>alive&&setMsg("فعّل الموقع حتى نحسب أوقات الصلاة بدقة."));const t=setInterval(()=>setNow(Date.now()),1000);return()=>{alive=false;clearInterval(t)}},[]);
 const next=useMemo(()=>nextPrayer(data?.timings),[data,now]);
 const selected=THEMES.find(x=>x.id===theme)||THEMES[0];
 useEffect(()=>{if(!next)return;try{localStorage.setItem("sakinah-widget-theme",theme);localStorage.setItem("sakinah-widget-next-prayer",next.prayer);localStorage.setItem("sakinah-widget-next-time",next.time)}catch{}const bridge={nextPrayer:next.prayer,nextPrayerTime:next.time,nextPrayerAt:next.at,hijriDate:hijriLabel(data),widgetTheme:theme};const n=native();if(n){try{n.saveBridgeState(JSON.stringify(bridge));n.refreshWidget()}catch{}}},[next?.prayer,next?.time,next?.at,theme,data?.date?.hijri?.day]);
 const refresh=()=>{setMsg("جاري تحديث المواقيت…");loadPrayerData().then(x=>{setData(x);setMsg("تم تحديث المواقيت والـ Widget.")}).catch(()=>setMsg("تعذر التحديث. تأكد من إذن الموقع والاتصال."))};
 return <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,#FAF7F0,#F3EFE6)",color:C.ink,overflowY:"auto"}} dir="rtl">
  <div style={{maxWidth:720,margin:"0 auto",padding:"28px 18px 140px",boxSizing:"border-box"}}>
   <header style={{textAlign:"center",paddingTop:8}}><div style={{fontSize:10,color:C.gold,letterSpacing:1.2}}>SAKINAH</div><h1 style={{fontSize:29,lineHeight:1.45,margin:"8px 0 4px"}}>Widget الصلاة</h1><div style={{fontSize:11,opacity:.5}}>الصلاة القادمة، العدّ التنازلي، التاريخ الهجري — على الشاشة الرئيسية وشاشة القفل عند دعم الجهاز.</div></header>
   <section style={{marginTop:20,borderRadius:30,padding:22,background:selected.bg,color:selected.fg,boxShadow:"0 20px 48px rgba(16,16,15,.13)",minHeight:210,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"flex-start"}}><div><div style={{fontSize:10,opacity:.62}}>الصلاة القادمة</div><div style={{fontSize:30,fontWeight:800,marginTop:5}}>{PR_AR[next?.prayer]||"—"}</div></div><div style={{fontSize:11,opacity:.72,textAlign:"left"}}>{hijriLabel(data)||"التاريخ الهجري"}</div></div>
    <div><div style={{fontSize:44,fontWeight:800,color:selected.accent,lineHeight:1}}>{next?.time||"--:--"}</div><div style={{marginTop:10,fontSize:11,opacity:.65}}>متبقي على الصلاة</div><div style={{fontSize:22,fontWeight:700,marginTop:2}}>{countdown(next?.at,now)}</div></div>
   </section>
   <section style={{marginTop:16,padding:16,borderRadius:24,background:"rgba(255,255,255,.58)",border:"1px solid rgba(16,16,15,.055)"}}><div style={{fontSize:12,fontWeight:800}}>تصميم الـ Widget</div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:10}}>{THEMES.map(t=><button key={t.id} onClick={()=>setTheme(t.id)} style={{...btn,padding:7,border:theme===t.id?`2px solid ${C.gold}`:"2px solid transparent",background:"transparent"}}><div style={{height:62,borderRadius:13,background:t.bg,display:"grid",placeItems:"center",color:t.accent,fontSize:17,fontWeight:800}}>03:56</div><div style={{fontSize:10,marginTop:5}}>{t.name}</div></button>)}</div></section>
   <section style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginTop:12}}><button onClick={refresh} style={{...btn,background:C.lapis,color:"white",border:0,minHeight:52,fontWeight:700}}>↻ تحديث المواقيت</button><button onClick={()=>{const n=native();if(n){try{n.refreshWidget();setMsg("تم تحديث الـ Widget على Android.")}catch{setMsg("تعذر تحديث الـ Widget.")}}else setMsg("معاينة الويب لا تستطيع إضافة Widget للنظام؛ هذه الميزة تعمل داخل نسخة Android.")}} style={{...btn,minHeight:52}}>تحديث Widget</button></section>
   {msg&&<div style={{marginTop:10,padding:"10px 12px",borderRadius:14,background:"rgba(181,154,98,.11)",fontSize:10.5,lineHeight:1.7}}>{msg}</div>}
   <div style={{marginTop:15,padding:14,borderRadius:20,background:"rgba(23,59,87,.06)",fontSize:10.5,lineHeight:1.8}}><b>النسخة الأصلية Android:</b> الـ Widget مسجل للشاشة الرئيسية وKeyguard، ويعرض الصلاة القادمة ووقتها والتاريخ الهجري والعدّ التنازلي. ظهور Widget على شاشة القفل يعتمد على دعم إصدار Android والواجهة في جهازك.</div>
  </div>
 </div>
}
