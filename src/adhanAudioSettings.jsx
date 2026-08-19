import React,{useEffect,useState} from "react";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62",mint:"#E5F0E8",sky:"#E4EEF6"};
const btn={border:"1px solid rgba(16,16,15,.08)",borderRadius:16,padding:12,background:"rgba(255,255,255,.56)",fontFamily:"inherit",color:"inherit"};
const PR=[["Fajr","الفجر"],["Dhuhr","الظهر"],["Asr","العصر"],["Maghrib","المغرب"],["Isha","العشاء"]];
const VOICES=[
 {id:"wadee-al-yamani",ar:"وديع اليمني",en:"Wadee Al Yamani"},
 {id:"ahmed-al-nufais",ar:"أحمد النفيس",en:"Ahmed Al Nufais"},
 {id:"mishary-alafasy",ar:"مشاري العفاسي",en:"Mishary Alafasy"},
 {id:"makkah",ar:"أذان الحرم المكي",en:"Makkah Adhan"},
 {id:"madinah",ar:"أذان المسجد النبوي",en:"Madinah Adhan"},
 {id:"classic",ar:"أذان تقليدي",en:"Classic Adhan"}
];
const native=()=>typeof window!=="undefined"&&window.SakinahNative?window.SakinahNative:null;
const loadVoices=()=>{try{return JSON.parse(localStorage.getItem("sakinah-adhan-voice-map")||"{}")||{}}catch{return{}}};
const saveVoices=x=>{try{localStorage.setItem("sakinah-adhan-voice-map",JSON.stringify(x))}catch{}};

export function AdhanAudioSettings({lang,go}){
 const [picked,setPicked]=useState({});
 const [voices,setVoices]=useState(loadVoices);
 const [open,setOpen]=useState("");
 const [msg,setMsg]=useState("");
 useEffect(()=>{
  const h=e=>{const d=e?.detail||{};if(d.prayer){setPicked(x=>({...x,[d.prayer]:d.name||"✓"}));setMsg(lang==="ar"?"تم حفظ صوت الأذان لهذه الصلاة":"Adhan sound saved for this prayer")}};
  window.addEventListener("sakinah-adhan-picked",h);return()=>window.removeEventListener("sakinah-adhan-picked",h);
 },[lang]);
 const pick=p=>{const n=native();if(!n?.pickAdhan){setMsg(lang==="ar"?"اختيار ملف الأذان المحلي يعمل داخل نسخة Android فقط":"Local adhan file selection is available in Android only");return}try{n.pickAdhan(p)}catch{setMsg(lang==="ar"?"تعذر فتح منتقي الملفات":"Could not open file picker")}};
 const clear=p=>{const n=native();try{n?.clearAdhan?.(p)}catch{}setPicked(x=>({...x,[p]:""}));setVoices(x=>{const y={...x};delete y[p];saveVoices(y);return y});setMsg(lang==="ar"?"تم إلغاء إعداد الأذان لهذه الصلاة":"Adhan setting cleared for this prayer")};
 const chooseVoice=(p,id)=>{const v={...voices,[p]:id};setVoices(v);saveVoices(v);setOpen("");setMsg(lang==="ar"?"تم اختيار المؤذن. اربط تسجيله المرخّص من زر «ملف الصوت» ليعمل الأذان فعلياً.":"Muezzin selected. Link a licensed recording with the audio-file button for actual playback.")};
 const voiceName=p=>{const v=VOICES.find(x=>x.id===voices[p]);return v?(lang==="ar"?v.ar:v.en):(lang==="ar"?"اختر المؤذن":"Choose muezzin")};
 return <div style={{position:"fixed",inset:0,zIndex:65000,background:"linear-gradient(180deg,#F8F5EE,#F2F6F4)",color:C.ink,overflowY:"auto",padding:"max(74px,calc(env(safe-area-inset-top) + 48px)) 18px 130px",boxSizing:"border-box"}} dir={lang==="ar"?"rtl":"ltr"}>
  <button onClick={go} style={{...btn,border:0,padding:"8px 12px",background:"rgba(255,255,255,.72)",borderRadius:999}}>{lang==="ar"?"→ رجوع":"← Back"}</button>
  <div style={{textAlign:"center",marginTop:18}}><div style={{fontSize:10,color:C.gold,letterSpacing:.7}}>SAKINAH</div><div style={{fontSize:30,fontWeight:700,lineHeight:1.5,marginTop:3}}>{lang==="ar"?"المؤذن وأصوات الأذان":"Muezzin & Adhan Sounds"}</div><div style={{fontSize:11.5,opacity:.5,lineHeight:1.8,margin:"6px auto 0",maxWidth:560}}>{lang==="ar"?"اختر المؤذن لكل صلاة، ثم اربط تسجيل الأذان المرخّص من جهازك. يمكن أن يكون لكل صلاة مؤذن مختلف.":"Choose a muezzin for each prayer, then link a licensed adhan recording from your device. Each prayer can use a different voice."}</div></div>

  <div style={{marginTop:18,display:"grid",gap:10}}>{PR.map(([id,ar])=>{
   const isOpen=open===id;
   return <section key={id} style={{padding:14,borderRadius:22,background:"rgba(255,255,255,.72)",border:"1px solid rgba(16,16,15,.055)",boxShadow:"0 10px 28px rgba(20,25,20,.035)"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}><div><b style={{fontSize:13}}>{lang==="ar"?ar:id}</b><small style={{display:"block",opacity:.42,marginTop:3}}>{picked[id]||(lang==="ar"?"لا يوجد ملف صوت مرتبط":"No audio file linked")}</small></div><span style={{fontSize:18,color:C.gold}}>◷</span></div>
    <div style={{position:"relative",marginTop:11}}><button onClick={()=>setOpen(isOpen?"":id)} style={{width:"100%",border:0,borderRadius:999,padding:"11px 14px",background:C.sky,fontFamily:"inherit",color:C.ink,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>{voiceName(id)}</span><span style={{fontSize:12,opacity:.5}}>{isOpen?"▲":"▼"}</span></button>
     {isOpen&&<div style={{marginTop:7,padding:6,borderRadius:19,background:"#FFF",border:"1px solid rgba(16,16,15,.07)",boxShadow:"0 14px 32px rgba(16,16,15,.08)",display:"grid",gap:4}}>{VOICES.map(v=><button key={v.id} onClick={()=>chooseVoice(id,v.id)} style={{border:0,borderRadius:14,padding:"10px 12px",background:voices[id]===v.id?C.mint:"transparent",fontFamily:"inherit",color:C.ink,textAlign:lang==="ar"?"right":"left",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>{lang==="ar"?v.ar:v.en}</span>{voices[id]===v.id&&<span style={{color:C.gold}}>✓</span>}</button>)}</div>}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8,marginTop:9}}><button onClick={()=>pick(id)} style={{...btn,background:C.lapis,color:"white",border:0,padding:"10px 12px"}}>{lang==="ar"?"ربط ملف الصوت":"Link audio file"}</button><button onClick={()=>clear(id)} style={{...btn,padding:"10px 12px"}}>{lang==="ar"?"مسح":"Clear"}</button></div>
   </section>
  })}</div>
  <div style={{marginTop:14,padding:13,borderRadius:18,background:"rgba(181,154,98,.10)",fontSize:10.5,lineHeight:1.75}}>{lang==="ar"?"ملاحظة: أسماء المؤذنين متاحة للاختيار داخل الواجهة، لكن سكينة لا تضمّن تسجيلاتهم تلقائياً من دون ملف صوت مرخّص. اربط التسجيل الذي تملكه أو المسموح لك باستخدامه لكل صلاة.":"Note: muezzin names are selectable in the UI, but Sakinah does not bundle their recordings without a licensed audio file. Link a recording you own or are permitted to use for each prayer."}</div>
  {msg&&<div style={{marginTop:10,padding:12,borderRadius:14,background:"rgba(23,59,87,.08)",fontSize:10.5}}>{msg}</div>}
 </div>;
}
