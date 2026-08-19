import React,{useEffect,useState} from "react";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62"};
const btn={border:"1px solid rgba(16,16,15,.08)",borderRadius:16,padding:12,background:"rgba(255,255,255,.56)",fontFamily:"inherit",color:"inherit"};
const PR=[["Fajr","الفجر"],["Dhuhr","الظهر"],["Asr","العصر"],["Maghrib","المغرب"],["Isha","العشاء"]];
const native=()=>typeof window!=="undefined"&&window.SakinahNative?window.SakinahNative:null;

export function AdhanAudioSettings({lang,go}){
 const [picked,setPicked]=useState({});
 const [msg,setMsg]=useState("");
 useEffect(()=>{
  const h=e=>{const d=e?.detail||{};if(d.prayer){setPicked(x=>({...x,[d.prayer]:d.name||"✓"}));setMsg(lang==="ar"?"تم حفظ صوت الأذان لهذه الصلاة":"Adhan sound saved for this prayer")}};
  window.addEventListener("sakinah-adhan-picked",h);return()=>window.removeEventListener("sakinah-adhan-picked",h);
 },[lang]);
 const pick=p=>{const n=native();if(!n?.pickAdhan){setMsg(lang==="ar"?"اختيار الصوت المحلي يعمل داخل نسخة Android فقط":"Local audio selection is available in Android only");return}try{n.pickAdhan(p)}catch{setMsg(lang==="ar"?"تعذر فتح منتقي الملفات":"Could not open file picker")}};
 const clear=p=>{const n=native();try{n?.clearAdhan?.(p);setPicked(x=>({...x,[p]:""}));setMsg(lang==="ar"?"تم إلغاء صوت الأذان لهذه الصلاة":"Adhan sound cleared for this prayer")}catch{}};
 return <div style={{position:"fixed",inset:0,zIndex:65000,background:C.ivory,color:C.ink,overflowY:"auto",padding:"25px 22px 130px"}} dir={lang==="ar"?"rtl":"ltr"}>
  <button onClick={go} style={{...btn,border:0,padding:0,background:"transparent"}}>{lang==="ar"?"رجوع ←":"← Back"}</button>
  <div style={{fontFamily:"Fraunces,serif",fontSize:31,marginTop:16}}>{lang==="ar"?"أصوات الأذان":"Adhan Sounds"}</div>
  <div style={{fontSize:11.5,opacity:.5,lineHeight:1.8,marginTop:7}}>{lang==="ar"?"اختر ملفاً صوتياً من جهازك لكل صلاة. سكينة لا تضمّن أي ملف صوت مجهول أو غير مرخّص.":"Choose a local audio file for each prayer. Sakinah bundles no unknown or unlicensed adhan audio."}</div>
  <div style={{marginTop:18,borderRadius:22,overflow:"hidden",border:"1px solid rgba(16,16,15,.07)",background:"rgba(255,255,255,.45)"}}>{PR.map(([id,ar])=><div key={id} style={{padding:"14px 15px",borderBottom:"1px solid rgba(16,16,15,.06)"}}><div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center"}}><div><b style={{fontSize:12.5}}>{lang==="ar"?ar:id}</b><small style={{display:"block",opacity:.42,marginTop:3}}>{picked[id]||(lang==="ar"?"لا يوجد صوت محدد":"No local sound selected")}</small></div><div style={{display:"flex",gap:7}}><button onClick={()=>pick(id)} style={{...btn,padding:"8px 10px",background:C.lapis,color:"white",border:0}}>{lang==="ar"?"اختيار":"Choose"}</button><button onClick={()=>clear(id)} style={{...btn,padding:"8px 10px"}}>{lang==="ar"?"مسح":"Clear"}</button></div></div></div>)}</div>
  {msg&&<div style={{marginTop:12,padding:12,borderRadius:14,background:"rgba(181,154,98,.10)",fontSize:10.5}}>{msg}</div>}
 </div>;
}
