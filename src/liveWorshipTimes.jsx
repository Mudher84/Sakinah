import React,{useEffect,useState} from "react";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62",red:"#9C4A3B"};
const btn={border:"1px solid rgba(16,16,15,.09)",borderRadius:14,padding:11,background:"transparent",fontFamily:"inherit",color:"inherit"};
function Shell({go,children}){return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,display:"flex",flexDirection:"column"}} dir="rtl"><div style={{padding:"22px 22px 0"}}><button onClick={()=>go?.(null)} style={{...btn,border:0,padding:0}}>رجوع ←</button></div><div style={{flex:1,overflowY:"auto",padding:"15px 22px 130px"}}><div style={{fontFamily:"Fraunces,serif",fontSize:29}}>أوقات العبادة</div><div style={{fontSize:11.5,opacity:.48,lineHeight:1.7,marginTop:7}}>أوقات حية حسب موقعك: الشروق، الضحى التقريبي، والثلث الأخير من الليل.</div>{children}</div></div>}
const clean=v=>(v||"").split(" ")[0];
const mins=t=>{const [h,m]=clean(t).split(":").map(Number);return h*60+m};
const fmt=m=>`${String(Math.floor((m+1440)%1440/60)).padStart(2,"0")}:${String((m+1440)%60).padStart(2,"0")}`;
async function coords(){return new Promise((ok,fail)=>navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>ok(p.coords),fail,{enableHighAccuracy:true,timeout:12000}):fail(new Error()))}
export function LiveWorshipTimes({go}){
 const [data,setData]=useState(null),[busy,setBusy]=useState(true),[err,setErr]=useState("");
 const load=async()=>{setBusy(true);setErr("");try{const c=await coords();const r=await fetch(`https://api.aladhan.com/v1/timings?latitude=${c.latitude}&longitude=${c.longitude}&method=4`);if(!r.ok)throw new Error();const j=await r.json();setData(j?.data||null)}catch{setErr("تعذر تحميل الأوقات. فعّل الموقع والاتصال ثم حاول مجدداً.")}finally{setBusy(false)}};
 useEffect(()=>{load()},[]);
 const t=data?.timings||null;let duha="—",lastThird="—";if(t){const sr=mins(t.Sunrise),mg=mins(t.Maghrib),fj=mins(t.Fajr);duha=fmt(sr+20);let nextF=fj;if(nextF<=mg)nextF+=1440;const night=nextF-mg;lastThird=fmt(mg+Math.round(night*2/3));}
 const rows=t?[["الشروق",clean(t.Sunrise),"من بيانات مواقيت الموقع"],["الضحى · بداية تقريبية",duha,"بعد الشروق بنحو 20 دقيقة؛ تختلف التفاصيل الفقهية محلياً"],["المغرب",clean(t.Maghrib),"بداية الليل للحساب"],["الثلث الأخير · بداية تقريبية",lastThird,"محسوب من المغرب إلى فجر اليوم التالي"],["الفجر",clean(t.Fajr),"نهاية وقت قيام الليل"]]:[];
 return <Shell go={go}><button onClick={load} style={{...btn,width:"100%",marginTop:18,background:C.lapis,color:"white",border:0}}>{busy?"تحميل…":"تحديث حسب موقعي"}</button>{err&&<div style={{marginTop:12,color:C.red,fontSize:11}}>{err}</div>}<div style={{marginTop:14}}>{rows.map(([a,b,c])=><div key={a} style={{padding:"14px 2px",borderTop:"1px solid rgba(16,16,15,.07)",display:"grid",gridTemplateColumns:"1fr auto",gap:12}}><div><b style={{fontSize:12.5}}>{a}</b><div style={{fontSize:10,opacity:.45,lineHeight:1.6,marginTop:4}}>{c}</div></div><div style={{fontSize:23,fontWeight:700,color:C.gold}}>{b}</div></div>)}</div><div style={{marginTop:16,padding:13,borderRadius:16,background:"rgba(181,154,98,.10)",fontSize:10.5,lineHeight:1.8}}>لا يحدد سكينة «أوقات النهي» بحدود فقهية جامدة؛ لأن تفاصيلها تختلف في التقدير والمذهب. نعرض الأوقات الفلكية الحية ونترك التفصيل الشرعي للمصدر الموثوق.</div></Shell>
}
