import React,{useEffect,useState} from "react";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62",mint:"#E5F0E8",sky:"#E4EEF6"};
const btn={border:"1px solid rgba(16,16,15,.08)",borderRadius:16,padding:12,background:"rgba(255,255,255,.56)",fontFamily:"inherit",color:"inherit"};
const PR=[["Fajr","الفجر"],["Dhuhr","الظهر"],["Asr","العصر"],["Maghrib","المغرب"],["Isha","العشاء"]];
const VOICES=[
 {id:"default",ar:"تنبيه فقط",en:"Alert only",asset:null},
 {id:"wadie-al-yamani",ar:"وديع اليمني",en:"Wadie Al Yamani",asset:"/audio/adhan/وديع اليمني.ogg"},
 {id:"ahmed-al-nafis",ar:"أحمد النفيس",en:"Ahmed Al Nafis",asset:"/audio/adhan/احمد النفيس.ogg"},
 {id:"mishary-alafasy",ar:"مشاري العفاسي",en:"Mishary Alafasy",asset:"/audio/adhan/مشاري العفاسي .ogg"},
 {id:"ahmed-galal-yahia",ar:"أحمد جلال يحيى",en:"Ahmed Galal Yahia",asset:"/audio/adhan/احمد يحيى.ogg"}
];
const native=()=>typeof window!=="undefined"&&window.SakinahNative?window.SakinahNative:null;
const loadVoices=()=>{try{return JSON.parse(localStorage.getItem("sakinah-adhan-voice-map")||"{}")||{}}catch{return{}}};
const saveVoices=x=>{try{localStorage.setItem("sakinah-adhan-voice-map",JSON.stringify(x))}catch{}};
const syncNative=x=>{const n=native();if(!n?.saveBridgeState)return;try{let bridge={};try{bridge=JSON.parse(n.loadBridgeState?.()||"{}")||{}}catch{}bridge.voiceAssets=Object.fromEntries(PR.map(([p])=>{const v=VOICES.find(z=>z.id===x[p])||VOICES[0];return[p,{id:v.id,asset:v.asset}]}));bridge.updatedAt=new Date().toISOString();bridge.brand="Muslim Mirror";n.saveBridgeState(JSON.stringify(bridge));n.refreshPrayerSchedule?.()}catch{}};

export function AdhanAudioSettings({lang,go}){
 const [picked,setPicked]=useState({});
 const [voices,setVoices]=useState(loadVoices);
 const [open,setOpen]=useState("");
 const [msg,setMsg]=useState("");
 const [playing,setPlaying]=useState("");
 useEffect(()=>{
  const h=e=>{const d=e?.detail||{};if(d.prayer){setPicked(x=>({...x,[d.prayer]:d.name||"✓"}));setMsg(lang==="ar"?"تم حفظ ملف الأذان لهذه الصلاة":"Adhan file saved for this prayer")}};
  window.addEventListener("sakinah-adhan-picked",h);return()=>window.removeEventListener("sakinah-adhan-picked",h);
 },[lang]);
 const pick=p=>{const n=native();if(!n?.pickAdhan){setMsg(lang==="ar"?"اختيار ملف الأذان المحلي يعمل داخل نسخة Android فقط":"Local adhan file selection is available in Android only");return}try{n.pickAdhan(p)}catch{setMsg(lang==="ar"?"تعذر فتح منتقي الملفات":"Could not open file picker")}};
 const clear=p=>{const n=native();try{n?.clearAdhan?.(p)}catch{}setPicked(x=>({...x,[p]:""}));setMsg(lang==="ar"?"تم مسح ملف الأذان المحلي لهذه الصلاة":"Local adhan file cleared")};
 const chooseVoice=(p,id)=>{const v={...voices,[p]:id};setVoices(v);saveVoices(v);syncNative(v);setOpen("");setMsg(lang==="ar"?"تم اعتماد صوت المؤذن المضمن لهذه الصلاة":"Bundled muezzin voice selected for this prayer")};
 const voiceName=p=>{const v=VOICES.find(x=>x.id===voices[p]);return v?(lang==="ar"?v.ar:v.en):(lang==="ar"?"اختر المؤذن":"Choose muezzin")};
 const preview=async p=>{const v=VOICES.find(x=>x.id===voices[p]);if(!v?.asset)return;try{const a=new Audio(v.asset);setPlaying(p);a.onended=()=>setPlaying("");a.onerror=()=>setPlaying("");await a.play()}catch{setPlaying("");setMsg(lang==="ar"?"تعذر تشغيل المعاينة":"Could not play preview")}};
 return <div style={{position:"fixed",inset:0,zIndex:65000,background:"linear-gradient(180deg,#F8F5EE,#F2F6F4)",color:C.ink,overflowY:"auto",padding:"max(74px,calc(env(safe-area-inset-top) + 48px)) 18px 130px",boxSizing:"border-box"}} dir={lang==="ar"?"rtl":"ltr"}>
  <button onClick={go} style={{...btn,border:0,padding:"8px 12px",background:"rgba(255,255,255,.72)",borderRadius:999}}>{lang==="ar"?"→ رجوع":"← Back"}</button>
  <div style={{textAlign:"center",marginTop:18}}><div style={{fontSize:10,color:C.gold,letterSpacing:.7}}>MUSLIM MIRROR</div><div style={{fontSize:30,fontWeight:700,lineHeight:1.5,marginTop:3}}>{lang==="ar"?"المؤذن وأصوات الأذان":"Muezzin & Adhan Sounds"}</div><div style={{fontSize:11.5,opacity:.5,lineHeight:1.8,margin:"6px auto 0",maxWidth:560}}>{lang==="ar"?"اختر صوتاً مضمناً لكل صلاة، أو اربط ملفاً محلياً من جهازك. الملف المحلي له أولوية عند التشغيل.":"Choose a bundled voice for each prayer, or link a local file. The local file has playback priority."}</div></div>

  <div style={{marginTop:18,display:"grid",gap:10}}>{PR.map(([id,ar])=>{
   const isOpen=open===id,current=VOICES.find(v=>v.id===voices[id])||VOICES[0];
   return <section key={id} style={{padding:14,borderRadius:22,background:"rgba(255,255,255,.72)",border:"1px solid rgba(16,16,15,.055)",boxShadow:"0 10px 28px rgba(20,25,20,.035)"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}><div><b style={{fontSize:13}}>{lang==="ar"?ar:id}</b><small style={{display:"block",opacity:.42,marginTop:3}}>{picked[id]||(lang==="ar"?"لا يوجد ملف محلي مرتبط":"No local file linked")}</small></div><button onClick={()=>preview(id)} disabled={!current.asset} style={{border:0,borderRadius:"50%",width:38,height:38,background:C.lapis,color:"white",opacity:current.asset?1:.35}}>{playing===id?"■":"▶"}</button></div>
    <div style={{position:"relative",marginTop:11}}><button onClick={()=>setOpen(isOpen?"":id)} style={{width:"100%",border:0,borderRadius:999,padding:"11px 14px",background:C.sky,fontFamily:"inherit",color:C.ink,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>{voiceName(id)}</span><span style={{fontSize:12,opacity:.5}}>{isOpen?"▲":"▼"}</span></button>
     {isOpen&&<div style={{marginTop:7,padding:6,borderRadius:19,background:"#FFF",border:"1px solid rgba(16,16,15,.07)",boxShadow:"0 14px 32px rgba(16,16,15,.08)",display:"grid",gap:4}}>{VOICES.map(v=><button key={v.id} onClick={()=>chooseVoice(id,v.id)} style={{border:0,borderRadius:14,padding:"10px 12px",background:voices[id]===v.id?C.mint:"transparent",fontFamily:"inherit",color:C.ink,textAlign:lang==="ar"?"right":"left",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>{lang==="ar"?v.ar:v.en}</span>{voices[id]===v.id&&<span style={{color:C.gold}}>✓</span>}</button>)}</div>}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8,marginTop:9}}><button onClick={()=>pick(id)} style={{...btn,background:C.lapis,color:"white",border:0,padding:"10px 12px"}}>{lang==="ar"?"ربط ملف محلي":"Link local file"}</button><button onClick={()=>clear(id)} style={{...btn,padding:"10px 12px"}}>{lang==="ar"?"مسح":"Clear"}</button></div>
   </section>
  })}</div>
  <div style={{marginTop:14,padding:13,borderRadius:18,background:"rgba(181,154,98,.10)",fontSize:10.5,lineHeight:1.75}}>{lang==="ar"?"أصوات وديع اليمني وأحمد النفيس ومشاري العفاسي وأحمد جلال يحيى الموجودة داخل التطبيق أصبحت مرتبطة مباشرة بخدمة الأذان على Android.":"Bundled muezzin recordings are now connected directly to Android adhan playback."}</div>
  {msg&&<div style={{marginTop:10,padding:12,borderRadius:14,background:"rgba(23,59,87,.08)",fontSize:10.5}}>{msg}</div>}
 </div>;
}
