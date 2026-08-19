import React, { useEffect, useMemo, useState } from "react";

const C = { ivory: "#F6F3EC", ink: "#10100F", lapis: "#173B57", gold: "#B59A62", goldDeep: "#8E7642" };
const pad2 = n => String(n).padStart(2, "0");
const arDigits = s => String(s).replace(/[0-9]/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
const nd = (s, lang) => lang === "ar" ? arDigits(s) : String(s);

function Shell({ lang, go, back = "today", titleAr, titleEn, subAr, subEn, children }) {
  return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,display:"flex",flexDirection:"column"}}>
    <div style={{padding:"22px 22px 0"}}><button onClick={()=>go(back)} style={{border:0,background:"transparent",fontFamily:"inherit",fontSize:12,cursor:"pointer",color:"inherit"}}>{lang==="ar"?"← رجوع":"← Back"}</button></div>
    <div style={{flex:1,overflowY:"auto",padding:"16px 22px 128px"}}>
      <div style={{fontFamily:"Fraunces, serif",fontSize:lang==="ar"?30:27,lineHeight:1.2}}>{lang==="ar"?titleAr:titleEn}</div>
      <div style={{fontSize:12,opacity:.5,lineHeight:1.7,marginTop:8}}>{lang==="ar"?subAr:subEn}</div>
      {children}
    </div>
  </div>;
}

export function LiveSurahList({ lang, go }) {
  const [items,setItems]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
  useEffect(()=>{fetch("https://api.alquran.cloud/v1/surah").then(r=>{if(!r.ok)throw new Error("HTTP "+r.status);return r.json()}).then(x=>{setItems(x.data||[]);setLoading(false)}).catch(()=>{setError(lang==="ar"?"تعذر تحميل فهرس السور":"Could not load surah index");setLoading(false)})},[lang]);
  return <Shell lang={lang} go={go} back="quran-home" titleAr="سور القرآن" titleEn="Quran Surahs" subAr="الفهرس الكامل · ١١٤ سورة" subEn="Complete index · 114 surahs">
    {loading&&<div style={{marginTop:28,opacity:.5}}>{lang==="ar"?"تحميل السور…":"Loading surahs…"}</div>}
    {error&&<div style={{marginTop:28,color:"#8b3c31"}}>{error}</div>}
    <div style={{marginTop:14}}>{items.map(s=><button key={s.number} onClick={()=>go("reader",{surahId:s.number})} style={{width:"100%",display:"grid",gridTemplateColumns:"42px 1fr auto",gap:11,alignItems:"center",padding:"13px 0",border:0,borderTop:"1px solid rgba(16,16,15,.07)",background:"transparent",fontFamily:"inherit",color:"inherit",textAlign:lang==="ar"?"right":"left",cursor:"pointer"}}><div style={{width:34,height:34,borderRadius:"50%",border:"1px solid rgba(16,16,15,.12)",display:"grid",placeItems:"center",fontSize:10}}>{nd(s.number,lang)}</div><div><div style={{fontSize:14,fontWeight:600}}>{lang==="ar"?s.name:s.englishName}</div><div style={{fontSize:10.5,opacity:.43,marginTop:4}}>{lang==="ar"?s.englishName:s.name} · {nd(s.numberOfAyahs,lang)} {lang==="ar"?"آية":"ayahs"}</div></div><span style={{opacity:.28}}>›</span></button>)}</div>
  </Shell>;
}

export function LiveQuranReader({ lang, go, surahId = 1 }) {
  const [data,setData]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState(""),[mode,setMode]=useState("ar"),[scale,setScale]=useState(1);
  useEffect(()=>{setLoading(true);setError("");fetch(`https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,en.sahih`).then(r=>{if(!r.ok)throw new Error("HTTP "+r.status);return r.json()}).then(x=>{const a=x.data?.[0],e=x.data?.[1];if(!a||!e)throw new Error("missing");setData({ar:a,en:e});setLoading(false)}).catch(()=>{setError(lang==="ar"?"تعذر تحميل نص السورة. تحقق من الاتصال وحاول مجدداً.":"Could not load this surah. Check the connection and try again.");setLoading(false)})},[surahId,lang]);
  const title=data?(lang==="ar"?data.ar.name:data.ar.englishName):(lang==="ar"?"القرآن الكريم":"Quran");
  return <Shell lang={lang} go={go} back="surah-list" titleAr={title} titleEn={title} subAr="الرسم العثماني · ترجمة إنجليزية اختيارية" subEn="Uthmani text · optional English translation">
    <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center",marginTop:16,flexWrap:"wrap"}}>
      <div style={{display:"flex",gap:6,border:"1px solid rgba(16,16,15,.09)",padding:3,borderRadius:18}}><button onClick={()=>setMode("ar")} style={{border:0,borderRadius:14,padding:"7px 12px",background:mode==="ar"?"rgba(181,154,98,.16)":"transparent",fontFamily:"inherit"}}>العربية</button><button onClick={()=>setMode("en")} style={{border:0,borderRadius:14,padding:"7px 12px",background:mode==="en"?"rgba(181,154,98,.16)":"transparent",fontFamily:"inherit"}}>English</button></div>
      <div style={{display:"flex",gap:5}}><button onClick={()=>setScale(v=>Math.max(.85,v-.1))} style={{border:"1px solid rgba(16,16,15,.09)",background:"transparent",borderRadius:11,padding:"6px 10px"}}>A−</button><button onClick={()=>setScale(v=>Math.min(1.5,v+.1))} style={{border:"1px solid rgba(16,16,15,.09)",background:"transparent",borderRadius:11,padding:"6px 10px"}}>A+</button></div>
    </div>
    {loading&&<div style={{marginTop:30,opacity:.5}}>{lang==="ar"?"تحميل نص المصحف…":"Loading Quran text…"}</div>}
    {error&&<div style={{marginTop:30,color:"#8b3c31",lineHeight:1.7}}>{error}</div>}
    {data&&<div style={{marginTop:18}}>{data.ar.ayahs.map((a,i)=>{const e=data.en.ayahs[i];return <div key={a.number} style={{padding:"18px 0",borderTop:"1px solid rgba(16,16,15,.07)"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:9.5,opacity:.4,marginBottom:10}}><span>{nd(a.numberInSurah,lang)}</span><span>{data.ar.englishName}</span></div><div style={{fontFamily:"'Noto Naskh Arabic','Amiri',serif",fontSize:`${29*scale}px`,lineHeight:2.15,direction:"rtl",textAlign:"right"}}>{a.text}</div>{mode==="en"&&<div style={{fontSize:`${13*scale}px`,lineHeight:1.85,opacity:.68,direction:"ltr",textAlign:"left",marginTop:11}}>{e?.text}</div>}</div>})}</div>}
  </Shell>;
}

function localDateDDMMYYYY(){const d=new Date();return `${pad2(d.getDate())}-${pad2(d.getMonth()+1)}-${d.getFullYear()}`}
function minutesOf(t){const m=String(t||"").match(/(\d{1,2}):(\d{2})/);return m?Number(m[1])*60+Number(m[2]):0}
export function LivePrayerCenter({ lang, go }) {
  const [state,setState]=useState({status:"idle",times:null,meta:null,error:""}),[method,setMethod]=useState(3),[school,setSchool]=useState(0);
  const locate=()=>{if(!navigator.geolocation){setState({status:"error",times:null,meta:null,error:lang==="ar"?"الموقع غير مدعوم":"Location is unavailable"});return}setState(s=>({...s,status:"loading",error:""}));navigator.geolocation.getCurrentPosition(async p=>{try{const {latitude,longitude}=p.coords;const url=`https://api.aladhan.com/v1/timings/${localDateDDMMYYYY()}?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${school}`;const r=await fetch(url);if(!r.ok)throw new Error("HTTP "+r.status);const x=await r.json();setState({status:"ready",times:x.data.timings,meta:{...x.data.meta,latitude,longitude,date:x.data.date},error:""})}catch{setState({status:"error",times:null,meta:null,error:lang==="ar"?"تعذر جلب مواقيت الصلاة":"Could not load prayer times"})}},()=>setState({status:"error",times:null,meta:null,error:lang==="ar"?"لم يتم السماح بالموقع":"Location permission was not granted"}),{enableHighAccuracy:true,timeout:12000,maximumAge:60000})};
  useEffect(()=>{locate()},[method,school]);
  const prayers=state.times?[['Fajr','الفجر','Fajr'],['Sunrise','الشروق','Sunrise'],['Dhuhr','الظهر','Dhuhr'],['Asr','العصر','Asr'],['Maghrib','المغرب','Maghrib'],['Isha','العشاء','Isha']]:[];
  const next=useMemo(()=>{if(!state.times)return null;const now=new Date(),m=now.getHours()*60+now.getMinutes();const p=[['Fajr','الفجر','Fajr'],['Dhuhr','الظهر','Dhuhr'],['Asr','العصر','Asr'],['Maghrib','المغرب','Maghrib'],['Isha','العشاء','Isha']];return p.find(x=>minutesOf(state.times[x[0]])>m)||p[0]},[state.times]);
  return <Shell lang={lang} go={go} back="today" titleAr="مواقيت الصلاة" titleEn="Prayer Times" subAr="حسب موقعك الحالي وطريقة الحساب التي تختارها" subEn="Based on your live location and selected calculation method">
    <div style={{marginTop:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><select value={method} onChange={e=>setMethod(Number(e.target.value))} style={{padding:10,borderRadius:13,border:"1px solid rgba(16,16,15,.09)",background:"transparent",fontFamily:"inherit"}}><option value="3">Muslim World League</option><option value="4">Umm Al-Qura</option><option value="5">Egyptian Authority</option><option value="1">Karachi</option><option value="2">ISNA</option><option value="23">Jordan Awqaf</option></select><select value={school} onChange={e=>setSchool(Number(e.target.value))} style={{padding:10,borderRadius:13,border:"1px solid rgba(16,16,15,.09)",background:"transparent",fontFamily:"inherit"}}><option value="0">{lang==="ar"?"العصر · قياسي":"Asr · Standard"}</option><option value="1">{lang==="ar"?"العصر · حنفي":"Asr · Hanafi"}</option></select></div>
    <button onClick={locate} style={{marginTop:10,width:"100%",padding:11,border:0,borderRadius:14,background:C.lapis,color:"white",fontFamily:"inherit",fontWeight:600}}>{lang==="ar"?"تحديث الموقع والمواقيت":"Refresh location & times"}</button>
    {state.status==="loading"&&<div style={{marginTop:26,opacity:.5}}>{lang==="ar"?"جاري تحديد الموقع وحساب المواقيت…":"Locating and calculating prayer times…"}</div>}
    {state.error&&<div style={{marginTop:20,color:"#8b3c31",lineHeight:1.7}}>{state.error}</div>}
    {state.times&&<><div style={{marginTop:18,padding:16,borderRadius:18,background:"rgba(181,154,98,.10)",border:"1px solid rgba(181,154,98,.18)"}}><div style={{fontSize:10,opacity:.46}}>{lang==="ar"?"الصلاة القادمة":"NEXT PRAYER"}</div><div style={{display:"flex",justifyContent:"space-between",alignItems:"end",marginTop:7}}><div style={{fontSize:22,fontFamily:"Fraunces,serif"}}>{lang==="ar"?next?.[1]:next?.[2]}</div><div style={{fontSize:27,fontFamily:"Fraunces,serif"}}>{nd(state.times[next?.[0]],lang)}</div></div></div><div style={{marginTop:10}}>{prayers.map(([id,ar,en])=><div key={id} style={{display:"flex",justifyContent:"space-between",padding:"13px 2px",borderTop:"1px solid rgba(16,16,15,.07)"}}><span style={{fontSize:13.5}}>{lang==="ar"?ar:en}</span><b style={{fontSize:13.5}}>{nd(state.times[id],lang)}</b></div>)}</div><div style={{marginTop:12,fontSize:9.8,opacity:.42,lineHeight:1.7}}>{lang==="ar"?`الموقع ${state.meta.latitude.toFixed(4)}، ${state.meta.longitude.toFixed(4)} · المنطقة الزمنية ${state.meta.timezone||""}`:`Location ${state.meta.latitude.toFixed(4)}, ${state.meta.longitude.toFixed(4)} · ${state.meta.timezone||""}`}</div></>}
  </Shell>;
}
