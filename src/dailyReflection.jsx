import React,{useEffect,useMemo,useRef,useState} from "react";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62",terracotta:"#A44D3C",green:"#416F5A",soft:"#EEE7D8"};
const DAILY_REFS=["2:286","3:139","8:46","13:28","14:7","16:97","17:70","20:46","21:87","29:69","39:53","41:34","49:13","57:20","65:2","65:3","93:5","94:5","94:6","103:3"];
const pad=n=>String(n).padStart(2,"0");
const todayKey=()=>{const d=new Date();return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`};
const profileId=()=>{try{return localStorage.getItem("sakinah-active-profile")||"me"}catch{return "me"}};
const refForDay=day=>DAILY_REFS[Number(day.replaceAll("-",""))%DAILY_REFS.length];
const arDigits=x=>String(x).replace(/[0-9]/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]);
const prettyDate=day=>{try{return new Intl.DateTimeFormat("ar-IQ",{day:"numeric",month:"long",year:"numeric"}).format(new Date(`${day}T12:00:00`))}catch{return day}};
async function loadAyah(ref){const r=await fetch(`https://api.alquran.cloud/v1/ayah/${ref}/editions/quran-uthmani,en.sahih`);if(!r.ok)throw new Error("ayah");const x=await r.json();return {ar:x.data?.[0],en:x.data?.[1]};}

export function DailyReflection({lang,go}){
 const day=useMemo(todayKey,[]),ref=useMemo(()=>refForDay(day),[day]),profile=useMemo(profileId,[]),storeKey=`sakinah-reflections-${profile}`;
 const [ayah,setAyah]=useState(null),[busy,setBusy]=useState(true),[error,setError]=useState("");
 const [history,setHistory]=useState(()=>{try{return JSON.parse(localStorage.getItem(storeKey))||[]}catch{return[]}});
 const existing=history.find(x=>x.day===day&&x.ref===ref);
 const [note,setNote]=useState(existing?.note||""),[saveState,setSaveState]=useState(existing?.note?"saved":"idle"),[expanded,setExpanded]=useState(false);
 const timer=useRef(null);
 useEffect(()=>{let alive=true;setBusy(true);setError("");loadAyah(ref).then(x=>alive&&setAyah(x)).catch(()=>alive&&setError(lang==="ar"?"تعذر تحميل آية اليوم":"Could not load today's verse")).finally(()=>alive&&setBusy(false));return()=>{alive=false}},[ref,lang]);
 const persist=value=>{const clean=value.trim(),row={day,ref,note:value,savedAt:new Date().toISOString()};const current=(()=>{try{return JSON.parse(localStorage.getItem(storeKey))||[]}catch{return history}})();let next=current.filter(x=>!(x.day===day&&x.ref===ref));if(clean)next=[row,...next];next=next.slice(0,365);setHistory(next);try{localStorage.setItem(storeKey,JSON.stringify(next));setSaveState(clean?"saved":"idle")}catch{setSaveState("error")}};
 const onNote=value=>{setNote(value);setSaveState("saving");clearTimeout(timer.current);timer.current=setTimeout(()=>persist(value),550)};
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 const shown=expanded?history:history.slice(0,3);
 return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,overflowY:"auto",paddingTop:26,paddingLeft:16,paddingRight:16,paddingBottom:"calc(230px + env(safe-area-inset-bottom, 0px))",scrollPaddingBottom:"calc(230px + env(safe-area-inset-bottom, 0px))",boxSizing:"border-box"}} dir={lang==="ar"?"rtl":"ltr"}>
  <main style={{maxWidth:700,margin:"0 auto"}}>
   <header style={{textAlign:"center",padding:"10px 8px 2px"}}><div style={{fontSize:10,color:C.gold,letterSpacing:1.2}}>SAKINAH · DAILY</div><h1 style={{fontFamily:"Fraunces,serif",fontSize:28,margin:"6px 0 4px"}}>{lang==="ar"?"تأمّل":"Reflect"}</h1><p style={{fontSize:10.5,opacity:.45,lineHeight:1.8,margin:0}}>{lang==="ar"?"آية اليوم ومساحتك الهادئة للتدبر":"Today's verse and your quiet space for reflection"}</p></header>

   <section style={{marginTop:16,borderRadius:26,padding:"18px 20px 22px",background:"linear-gradient(150deg,rgba(181,154,98,.10),rgba(255,255,255,.62))",border:"1px solid rgba(181,154,98,.20)",boxShadow:"0 10px 30px rgba(40,34,22,.035)"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,fontSize:9.5,opacity:.45}}><span>{lang==="ar"?"آية اليوم":"Verse of the day"}</span><span>{arDigits(ref)}</span></div>
    <div style={{minHeight:235,display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center"}}>{busy?<span style={{fontSize:10.5,opacity:.42}}>{lang==="ar"?"تحميل آية اليوم…":"Loading today's verse…"}</span>:error?<span style={{fontSize:10.5,color:C.terracotta}}>{error}</span>:ayah&&<div style={{width:"100%",maxWidth:600,fontFamily:"'Noto Naskh Arabic','Amiri',serif",fontSize:"clamp(23px,5vw,31px)",lineHeight:2.05,direction:"rtl",textAlign:"center",padding:"6px 0"}}>{ayah.ar?.text}</div>}</div>
    {ayah&&<div style={{textAlign:"center",fontSize:9.5,opacity:.42}}>{ayah.ar?.surah?.name||""} · الآية {arDigits(ayah.ar?.numberInSurah||ref.split(":")[1])}</div>}
   </section>

   <section style={{marginTop:20}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,padding:"0 3px 8px"}}><div><b style={{fontSize:13}}>{lang==="ar"?"ماذا أخذت من الآية؟":"What did you take from this verse?"}</b><div style={{fontSize:9.5,opacity:.38,marginTop:3}}>{prettyDate(day)}</div></div><span style={{fontSize:9.5,color:saveState==="error"?C.terracotta:C.green,opacity:.75}}>{saveState==="saving"?"جارٍ الحفظ…":saveState==="saved"?"محفوظ ✓":saveState==="error"?"تعذر الحفظ":""}</span></div><textarea value={note} onChange={e=>onNote(e.target.value)} onBlur={()=>persist(note)} placeholder={lang==="ar"?"اكتب ما لامس قلبك، العبرة التي خرجت بها، أو قراراً تريد تذكره…":"Write what touched you, what you learned, or a decision you want to remember…"} style={{width:"100%",boxSizing:"border-box",minHeight:145,padding:"15px 16px",borderRadius:20,border:"1px solid rgba(16,16,15,.075)",background:"rgba(255,255,255,.56)",fontFamily:"inherit",fontSize:12.5,lineHeight:1.9,resize:"vertical",color:"inherit",outline:"none",boxShadow:"inset 0 1px 0 rgba(255,255,255,.7)"}}/><div style={{display:"flex",alignItems:"center",gap:6,fontSize:9,opacity:.38,padding:"7px 3px 0"}}><span>●</span><span>{lang==="ar"?"حفظ تلقائي وخاص بهذا البروفايل":"Auto-saved privately to this profile"}</span></div></section>

   <section style={{marginTop:25,paddingTop:16,borderTop:"1px solid rgba(16,16,15,.07)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}><div><b style={{fontSize:13}}>{lang==="ar"?"تأملاتي السابقة":"Previous reflections"}</b><div style={{fontSize:9.5,opacity:.38,marginTop:3}}>{history.length?`${arDigits(history.length)} ${lang==="ar"?"ملاحظة محفوظة":"saved notes"}`:(lang==="ar"?"لا توجد ملاحظات بعد":"No notes yet")}</div></div>{history.length>3&&<button onClick={()=>setExpanded(x=>!x)} style={{border:0,background:"transparent",fontFamily:"inherit",fontSize:10,color:C.lapis,cursor:"pointer"}}>{expanded?"عرض أقل":"عرض الكل"}</button>}</div>{shown.length===0?<div style={{marginTop:10,padding:"18px",borderRadius:17,background:"rgba(181,154,98,.07)",textAlign:"center",fontSize:10,opacity:.45}}>أول ملاحظة تكتبها اليوم ستظهر هنا تلقائياً.</div>:shown.map(x=><article key={`${x.day}-${x.ref}`} style={{marginTop:9,padding:"13px 14px",borderRadius:17,background:"rgba(255,255,255,.42)",border:"1px solid rgba(16,16,15,.055)"}}><div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center"}}><b style={{fontSize:10.5,color:C.lapis}}>آية {arDigits(x.ref)}</b><span style={{fontSize:9,opacity:.38}}>{prettyDate(x.day)}</span></div><div style={{fontSize:11.5,lineHeight:1.85,opacity:.68,marginTop:7,whiteSpace:"pre-wrap"}}>{x.note}</div></article>)}</section>
   <div aria-hidden="true" style={{height:40}}/>
  </main>
 </div>;
}