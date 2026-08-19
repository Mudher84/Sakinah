import React,{useEffect,useMemo,useRef,useState} from "react";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62",terracotta:"#A44D3C",green:"#416F5A"};
const DAILY_REFS=["2:286","3:139","8:46","13:28","14:7","16:97","17:70","20:46","21:87","29:69","39:53","41:34","49:13","57:20","65:2","65:3","93:5","94:5","94:6","103:3"];
const pad=n=>String(n).padStart(2,"0");
const todayKey=()=>{const d=new Date();return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`};
const profileId=()=>{try{return localStorage.getItem("sakinah-active-profile")||"me"}catch{return "me"}};
const refForDay=day=>{const numeric=Number(day.replaceAll("-",""));return DAILY_REFS[numeric%DAILY_REFS.length]};
async function loadAyah(ref){const r=await fetch(`https://api.alquran.cloud/v1/ayah/${ref}/editions/quran-uthmani,en.sahih`);if(!r.ok)throw new Error("ayah");const x=await r.json();return {ar:x.data?.[0],en:x.data?.[1]};}

export function DailyReflection({lang,go}){
 const day=useMemo(todayKey,[]),ref=useMemo(()=>refForDay(day),[day]),profile=useMemo(profileId,[]),storeKey=`sakinah-reflections-${profile}`;
 const [ayah,setAyah]=useState(null),[busy,setBusy]=useState(true),[error,setError]=useState("");
 const [history,setHistory]=useState(()=>{try{return JSON.parse(localStorage.getItem(storeKey))||[]}catch{return[]}});
 const existing=history.find(x=>x.day===day&&x.ref===ref);
 const [note,setNote]=useState(existing?.note||""),[saved,setSaved]=useState(Boolean(existing?.note)),[saveState,setSaveState]=useState(existing?.note?"saved":"idle");
 const timer=useRef(null);
 useEffect(()=>{let alive=true;setBusy(true);setError("");loadAyah(ref).then(x=>alive&&setAyah(x)).catch(()=>alive&&setError(lang==="ar"?"تعذر تحميل آية اليوم":"Could not load today's verse")).finally(()=>alive&&setBusy(false));return()=>{alive=false}},[ref,lang]);
 const persist=value=>{const clean=value.trim();const row={day,ref,note:value,savedAt:new Date().toISOString()};const current=(()=>{try{return JSON.parse(localStorage.getItem(storeKey))||[]}catch{return history}})();let next=current.filter(x=>!(x.day===day&&x.ref===ref));if(clean)next=[row,...next];next=next.slice(0,365);setHistory(next);try{localStorage.setItem(storeKey,JSON.stringify(next));setSaved(Boolean(clean));setSaveState(clean?"saved":"idle")}catch{setSaveState("error")}};
 const onNote=value=>{setNote(value);setSaveState("saving");clearTimeout(timer.current);timer.current=setTimeout(()=>persist(value),550)};
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,overflowY:"auto",padding:"28px 20px 140px",boxSizing:"border-box"}} dir={lang==="ar"?"rtl":"ltr"}>
  <header style={{maxWidth:720,margin:"0 auto",textAlign:"center"}}><h1 style={{fontFamily:"Fraunces,serif",fontSize:30,margin:"6px 0"}}>{lang==="ar"?"تأمّل":"Reflect"}</h1><div style={{fontSize:11.5,opacity:.5,lineHeight:1.8}}>{lang==="ar"?"آية مختلفة كل يوم، ومساحة خاصة تحفظ ما لامس قلبك.":"A different verse every day, with a private space for what touched you."}</div></header>
  <main style={{maxWidth:720,margin:"18px auto 0"}}>
   <section style={{minHeight:245,borderRadius:28,padding:"22px 20px",background:"linear-gradient(145deg,rgba(181,154,98,.12),rgba(255,255,255,.58))",border:"1px solid rgba(181,154,98,.20)",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center",boxSizing:"border-box"}}>
    <div style={{fontSize:9.5,opacity:.42,alignSelf:"stretch",textAlign:"center"}}>{lang==="ar"?"آية اليوم":"Verse of the day"} · {ref}</div>
    {busy&&<div style={{padding:"34px 0",fontSize:11,opacity:.45}}>{lang==="ar"?"تحميل آية اليوم…":"Loading today's verse…"}</div>}
    {error&&<div style={{padding:"28px 0",fontSize:11,color:C.terracotta}}>{error}</div>}
    {ayah&&<><div style={{width:"100%",maxWidth:620,fontFamily:"'Noto Naskh Arabic','Amiri',serif",fontSize:"clamp(25px,5.6vw,34px)",lineHeight:2.05,direction:"rtl",textAlign:"center",margin:"18px auto 0",display:"flex",alignItems:"center",justifyContent:"center"}}>{ayah.ar?.text}</div>{lang!=="ar"&&<div style={{maxWidth:560,fontSize:12,lineHeight:1.8,opacity:.58,direction:"ltr",textAlign:"center",marginTop:13}}>{ayah.en?.text}</div>}</>}
   </section>
   <section style={{marginTop:20}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}><b style={{fontSize:12.5}}>{lang==="ar"?"ماذا أخذت من الآية؟":"What did you take from this verse?"}</b><span style={{fontSize:9.5,color:saveState==="error"?C.terracotta:C.green,opacity:.78}}>{saveState==="saving"?(lang==="ar"?"جارٍ الحفظ…":"Saving…"):saveState==="saved"?(lang==="ar"?"محفوظ تلقائياً ✓":"Saved automatically ✓"):saveState==="error"?(lang==="ar"?"تعذر الحفظ":"Save failed"):""}</span></div><textarea value={note} onChange={e=>onNote(e.target.value)} onBlur={()=>persist(note)} placeholder={lang==="ar"?"اكتب العِبرة، الشعور، القرار أو الملاحظة التي تريد الاحتفاظ بها…":"Write the lesson, feeling, decision, or note you want to keep…"} style={{marginTop:9,width:"100%",boxSizing:"border-box",minHeight:170,padding:16,borderRadius:20,border:"1px solid rgba(16,16,15,.09)",background:"rgba(255,255,255,.52)",fontFamily:"inherit",fontSize:13,lineHeight:1.9,resize:"vertical",color:"inherit",outline:"none",textAlign:lang==="ar"?"right":"left"}}/><div style={{fontSize:9.5,opacity:.4,lineHeight:1.7,marginTop:7}}>{lang==="ar"?"يُحفظ ما تكتبه تلقائياً على هذا الجهاز، مرتبطاً بآية وتاريخ اليوم وبروفايلك الحالي.":"What you type is saved automatically on this device, linked to today's verse, date, and active profile."}</div></section>
   <section style={{marginTop:26}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><b style={{fontSize:13}}>{lang==="ar"?"تأملاتي السابقة":"Previous reflections"}</b><span style={{fontSize:9.5,opacity:.38}}>{history.length}</span></div><div style={{marginTop:8}}>{history.length===0?<div style={{padding:"20px 0",fontSize:10.5,opacity:.4}}>{lang==="ar"?"ستظهر الملاحظات التي كتبتها هنا تلقائياً.":"Your saved notes will appear here automatically."}</div>:history.map(x=><article key={`${x.day}-${x.ref}`} style={{padding:"13px 0",borderTop:"1px solid rgba(16,16,15,.07)"}}><div style={{display:"flex",justifyContent:"space-between",gap:10}}><b style={{fontSize:11.5}}>آية {x.ref}</b><span style={{fontSize:9.5,opacity:.4}}>{x.day}</span></div><div style={{fontSize:11.5,lineHeight:1.8,opacity:.64,marginTop:6,whiteSpace:"pre-wrap"}}>{x.note}</div></article>)}</div></section>
  </main>
 </div>;
}