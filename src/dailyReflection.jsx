import React,{useEffect,useMemo,useState} from "react";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62",terracotta:"#A44D3C"};
const DAILY_REFS=["2:286","3:139","8:46","13:28","14:7","16:97","17:70","20:46","21:87","29:69","39:53","41:34","49:13","57:20","65:2","65:3","93:5","94:5","94:6","103:3"];
const todayKey=()=>new Date().toISOString().slice(0,10);
const profileId=()=>{try{return localStorage.getItem("sakinah-active-profile")||"me"}catch{return "me"}};
const refForToday=()=>{const d=todayKey().replaceAll("-","");const n=Number(d)%DAILY_REFS.length;return DAILY_REFS[n]};
async function loadAyah(ref){const r=await fetch(`https://api.alquran.cloud/v1/ayah/${ref}/editions/quran-uthmani,en.sahih`);if(!r.ok)throw new Error("ayah");const x=await r.json();return {ar:x.data?.[0],en:x.data?.[1]};}

export function DailyReflection({lang,go}){
 const ref=useMemo(refForToday,[]),profile=useMemo(profileId,[]),day=useMemo(todayKey,[]),storeKey=`sakinah-reflections-${profile}`;
 const [ayah,setAyah]=useState(null),[busy,setBusy]=useState(true),[error,setError]=useState("");
 const [history,setHistory]=useState(()=>{try{return JSON.parse(localStorage.getItem(storeKey))||[]}catch{return[]}});
 const existing=history.find(x=>x.day===day&&x.ref===ref); const [note,setNote]=useState(existing?.note||""); const [saved,setSaved]=useState(false);
 useEffect(()=>{let alive=true;setBusy(true);loadAyah(ref).then(x=>alive&&setAyah(x)).catch(()=>alive&&setError(lang==="ar"?"تعذر تحميل آية اليوم":"Could not load today's verse")).finally(()=>alive&&setBusy(false));return()=>{alive=false}},[ref,lang]);
 const persist=()=>{const row={day,ref,note:note.trim(),savedAt:new Date().toISOString()};const next=[row,...history.filter(x=>!(x.day===day&&x.ref===ref))].slice(0,365);setHistory(next);try{localStorage.setItem(storeKey,JSON.stringify(next))}catch{}setSaved(true);setTimeout(()=>setSaved(false),1400)};
 return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,overflowY:"auto",padding:"22px 22px 130px"}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}><button onClick={()=>go("app")} style={{border:0,background:"transparent",fontFamily:"inherit",color:"inherit",cursor:"pointer"}}>{lang==="ar"?"← سكينة":"← Sakinah"}</button><span style={{fontSize:10,opacity:.42}}>{day}</span></div>
  <div style={{fontFamily:"Fraunces,serif",fontSize:30,marginTop:18}}>{lang==="ar"?"تأمّل":"Reflect"}</div>
  <div style={{fontSize:11.5,opacity:.5,lineHeight:1.7,marginTop:7}}>{lang==="ar"?"آية كل يوم، ومساحة خاصة تكتب فيها العِبرة أو ما لامس قلبك.":"One verse each day, with a private space for what you learned or felt."}</div>
  <div style={{marginTop:18,borderRadius:24,padding:20,background:"linear-gradient(145deg,rgba(181,154,98,.13),rgba(255,255,255,.52))",border:"1px solid rgba(181,154,98,.18)"}}>
   <div style={{fontSize:10,opacity:.44}}>{lang==="ar"?"آية اليوم":"Verse of the day"} · {ref}</div>
   {busy&&<div style={{padding:"24px 0",fontSize:11,opacity:.45}}>{lang==="ar"?"تحميل الآية من المصدر…":"Loading verse from source…"}</div>}
   {error&&<div style={{padding:"18px 0",fontSize:11,color:C.terracotta}}>{error}</div>}
   {ayah&&<><div style={{fontFamily:"'Noto Naskh Arabic','Amiri',serif",fontSize:27,lineHeight:2.05,direction:"rtl",textAlign:"right",marginTop:15}}>{ayah.ar?.text}</div>{lang!=="ar"&&<div style={{fontSize:12,lineHeight:1.8,opacity:.58,direction:"ltr",textAlign:"left",marginTop:12}}>{ayah.en?.text}</div>}</>}
  </div>
  <div style={{marginTop:17}}><div style={{fontSize:12.5,fontWeight:650}}>{lang==="ar"?"ماذا أخذت من الآية؟":"What did you take from this verse?"}</div><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={lang==="ar"?"اكتب العِبرة، الشعور، القرار، أو الملاحظة التي تريد تذكرها…":"Write the lesson, feeling, decision, or note you want to remember…"} style={{marginTop:9,width:"100%",boxSizing:"border-box",minHeight:150,padding:14,borderRadius:18,border:"1px solid rgba(16,16,15,.09)",background:"rgba(255,255,255,.45)",fontFamily:"inherit",fontSize:13,lineHeight:1.8,resize:"vertical",color:"inherit",outline:"none"}}/><button onClick={persist} style={{width:"100%",marginTop:9,padding:12,border:0,borderRadius:15,background:C.lapis,color:"white",fontFamily:"inherit",fontWeight:650}}>{saved?(lang==="ar"?"تم الحفظ ✓":"Saved ✓"):(lang==="ar"?"احفظ تأمّلي":"Save reflection")}</button></div>
  <div style={{marginTop:24,fontSize:13,fontWeight:650}}>{lang==="ar"?"تأملاتي السابقة":"Previous reflections"}</div>
  <div style={{marginTop:8}}>{history.length===0?<div style={{padding:"20px 0",fontSize:10.5,opacity:.4}}>{lang==="ar"?"سيظهر سجل تأملاتك هنا بعد أول حفظ.":"Your reflection history will appear here after your first save."}</div>:history.map(x=><div key={`${x.day}-${x.ref}`} style={{padding:"13px 0",borderTop:"1px solid rgba(16,16,15,.07)"}}><div style={{display:"flex",justifyContent:"space-between",gap:10}}><b style={{fontSize:11.5}}>{x.ref}</b><span style={{fontSize:9.5,opacity:.4}}>{x.day}</span></div><div style={{fontSize:11.5,lineHeight:1.7,opacity:.62,marginTop:6,whiteSpace:"pre-wrap"}}>{x.note}</div></div>)}</div>
  <div style={{marginTop:20,fontSize:9.5,opacity:.38,lineHeight:1.7}}>{lang==="ar"?"التأملات محفوظة محلياً داخل بروفايلك وتدخل ضمن النسخة الاحتياطية المحلية لسكينة.":"Reflections are stored locally per profile and are included in Sakinah's local backup."}</div>
 </div>;
}
