import React, { useEffect, useMemo, useState } from "react";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62",terracotta:"#A44D3C"};
const nd=(s,lang)=>lang==="ar"?String(s).replace(/[0-9]/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]):String(s);
function Shell({lang,go,back="discover",titleAr,titleEn,subAr,subEn,children}){return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,display:"flex",flexDirection:"column"}}><div style={{padding:"22px 22px 0"}}><button onClick={()=>go(back)} style={{border:0,background:"transparent",fontFamily:"inherit",fontSize:12,cursor:"pointer",color:"inherit"}}>{lang==="ar"?"← رجوع":"← Back"}</button></div><div style={{flex:1,overflowY:"auto",padding:"16px 22px 130px"}}><div style={{fontFamily:"Fraunces,serif",fontSize:lang==="ar"?30:27,lineHeight:1.2}}>{lang==="ar"?titleAr:titleEn}</div><div style={{fontSize:12,opacity:.5,lineHeight:1.7,marginTop:8}}>{lang==="ar"?subAr:subEn}</div>{children}</div></div>}

const DUA_REFS=[
 {ref:"2:201",ar:"دعاء خير الدنيا والآخرة",en:"Good in this world and the Hereafter"},
 {ref:"2:286",ar:"دعاء العفو والرحمة والنصر",en:"Forgiveness, mercy and support"},
 {ref:"3:8",ar:"دعاء الثبات والهداية",en:"Steadfastness and guidance"},
 {ref:"3:16",ar:"دعاء المغفرة والوقاية من النار",en:"Forgiveness and protection"},
 {ref:"3:147",ar:"دعاء المغفرة والثبات",en:"Forgiveness and firmness"},
 {ref:"7:23",ar:"دعاء التوبة",en:"Repentance"},
 {ref:"7:126",ar:"دعاء الصبر وحسن الخاتمة",en:"Patience and a faithful end"},
 {ref:"10:85-86",ar:"دعاء التوكل والنجاة",en:"Trust and deliverance"},
 {ref:"14:40-41",ar:"دعاء الصلاة والوالدين",en:"Prayer and parents"},
 {ref:"17:24",ar:"دعاء للوالدين",en:"For parents"},
 {ref:"20:25-28",ar:"دعاء شرح الصدر وتيسير الأمر",en:"Ease and clarity"},
 {ref:"21:83",ar:"دعاء أيوب عند الضر",en:"Ayyub in hardship"},
 {ref:"21:87",ar:"دعاء يونس في الكرب",en:"Yunus in distress"},
 {ref:"23:97-98",ar:"الاستعاذة من همزات الشياطين",en:"Protection from devils"},
 {ref:"25:74",ar:"دعاء للأزواج والذرية",en:"Spouse and offspring"},
 {ref:"28:24",ar:"دعاء طلب الخير والرزق",en:"Goodness and provision"},
 {ref:"40:7-9",ar:"دعاء الملائكة للمؤمنين",en:"Angels' prayer for believers"},
 {ref:"46:15",ar:"دعاء الشكر وصلاح الذرية",en:"Gratitude and righteous offspring"},
 {ref:"59:10",ar:"دعاء للمؤمنين وسلامة القلب",en:"For believers and a pure heart"},
 {ref:"66:8",ar:"دعاء تمام النور والمغفرة",en:"Perfected light and forgiveness"}
];
function normalizeRef(ref){const [s,a]=ref.split(":");return {surah:s,ayah:a.includes("-")?a.split("-")[0]:a,range:a}}
async function fetchAyah(ref){const {surah,ayah}=normalizeRef(ref);const r=await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/editions/quran-uthmani,en.sahih`);if(!r.ok)throw new Error("http");const x=await r.json();return {ar:x.data?.[0],en:x.data?.[1]}}
function AyahSourceCard({lang,item}){const [d,setD]=useState(null),[busy,setBusy]=useState(false),[err,setErr]=useState("");const load=async()=>{setBusy(true);setErr("");try{setD(await fetchAyah(item.ref))}catch{setErr(lang==="ar"?"تعذر تحميل الآية":"Could not load verse")}finally{setBusy(false)}};return <div style={{borderTop:"1px solid rgba(16,16,15,.07)",padding:"14px 0"}}><button onClick={load} style={{width:"100%",border:0,background:"transparent",padding:0,textAlign:lang==="ar"?"right":"left",fontFamily:"inherit",color:"inherit",cursor:"pointer"}}><div style={{display:"flex",justifyContent:"space-between",gap:12}}><b style={{fontSize:13.5}}>{lang==="ar"?item.ar:item.en}</b><span style={{fontSize:10,opacity:.45}}>{nd(item.ref,lang)}</span></div><div style={{fontSize:10.5,opacity:.42,marginTop:5}}>{busy?(lang==="ar"?"تحميل النص من المصدر…":"Loading from source…"):(lang==="ar"?"اضغط لعرض نص الآية من المصدر":"Tap to load the verse from source")}</div></button>{err&&<div style={{color:C.terracotta,fontSize:11,marginTop:8}}>{err}</div>}{d&&<div style={{marginTop:12,padding:15,borderRadius:16,background:"rgba(181,154,98,.08)",border:"1px solid rgba(181,154,98,.15)"}}><div style={{fontFamily:"'Noto Naskh Arabic','Amiri',serif",fontSize:24,lineHeight:2.05,direction:"rtl",textAlign:"right"}}>{d.ar?.text}</div><div style={{fontSize:11.5,lineHeight:1.7,opacity:.58,direction:"ltr",textAlign:"left",marginTop:9}}>{d.en?.text}</div><div style={{fontSize:9,opacity:.4,marginTop:9}}>Quran · {item.ref}</div></div>}</div>}

export function QuranicDuasHub({lang,go}){const [q,setQ]=useState("");const rows=DUA_REFS.filter(x=>(x.ar+" "+x.en+" "+x.ref).toLowerCase().includes(q.toLowerCase()));return <Shell lang={lang} go={go} titleAr="الأدعية القرآنية" titleEn="Quranic Duas" subAr="الأدعية تُحمّل من نص القرآن مباشرة مع مرجع الآية" subEn="Duas loaded directly from Quran text with verse references"><input value={q} onChange={e=>setQ(e.target.value)} placeholder={lang==="ar"?"ابحث في الأدعية…":"Search duas…"} style={{marginTop:16,width:"100%",boxSizing:"border-box",padding:11,borderRadius:14,border:"1px solid rgba(16,16,15,.09)",background:"transparent",fontFamily:"inherit"}}/><div style={{marginTop:10}}>{rows.map(x=><AyahSourceCard key={x.ref} lang={lang} item={x}/>)}</div></Shell>}

const CONTEXTS={
 morning:[{ref:"2:255",ar:"آية الكرسي",en:"Ayat al-Kursi"},{ref:"112:1",ar:"سورة الإخلاص",en:"Al-Ikhlas"},{ref:"113:1",ar:"سورة الفلق",en:"Al-Falaq"},{ref:"114:1",ar:"سورة الناس",en:"An-Nas"}],
 evening:[{ref:"2:255",ar:"آية الكرسي",en:"Ayat al-Kursi"},{ref:"112:1",ar:"سورة الإخلاص",en:"Al-Ikhlas"},{ref:"113:1",ar:"سورة الفلق",en:"Al-Falaq"},{ref:"114:1",ar:"سورة الناس",en:"An-Nas"}],
 distress:[{ref:"21:87",ar:"دعاء يونس",en:"Dua of Yunus"},{ref:"94:5",ar:"مع العسر يسراً",en:"With hardship comes ease"},{ref:"13:28",ar:"بذكر الله تطمئن القلوب",en:"Hearts find rest in Allah's remembrance"}],
 gratitude:[{ref:"27:19",ar:"دعاء الشكر",en:"Prayer of gratitude"},{ref:"14:7",ar:"وعد الزيادة بالشكر",en:"Promise of increase with gratitude"}]
};
function currentContext(){const h=new Date().getHours();if(h<11)return "morning";if(h>=17)return "evening";return "gratitude"}
export function SmartQuranicAdhkar({lang,go}){const [ctx,setCtx]=useState(currentContext());const [idx,setIdx]=useState(0);const rows=CONTEXTS[ctx];const item=rows[idx%rows.length];return <Shell lang={lang} go={go} titleAr="ذكر مناسب الآن" titleEn="A remembrance for now" subAr="اقتراح سياقي من القرآن؛ أذكار السنة تُربط عبر مصدر الحديث الموثق" subEn="Contextual Quran remembrance; Sunnah adhkar connect through the verified Hadith source"><div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:16}}>{[["morning","الصباح","Morning"],["evening","المساء","Evening"],["distress","الكرب","Distress"],["gratitude","الشكر","Gratitude"]].map(([id,ar,en])=><button key={id} onClick={()=>{setCtx(id);setIdx(0)}} style={{border:ctx===id?`1px solid ${C.gold}`:"1px solid rgba(16,16,15,.09)",borderRadius:16,padding:"7px 10px",background:ctx===id?"rgba(181,154,98,.10)":"transparent",fontFamily:"inherit"}}>{lang==="ar"?ar:en}</button>)}</div><div style={{marginTop:18}}><AyahSourceCard lang={lang} item={item}/></div><button onClick={()=>setIdx(v=>v+1)} style={{width:"100%",marginTop:12,border:0,borderRadius:15,padding:12,background:C.lapis,color:"white",fontFamily:"inherit",fontWeight:600}}>{lang==="ar"?"ذكر آخر":"Another remembrance"}</button></Shell>}

const SEERAH=[
 {ref:"17:1",ar:"الإسراء",en:"Al-Isra"},{ref:"9:40",ar:"الهجرة",en:"The Hijrah"},{ref:"3:123",ar:"غزوة بدر",en:"Battle of Badr"},{ref:"3:152",ar:"أحد",en:"Uhud"},{ref:"33:9",ar:"الأحزاب",en:"Al-Ahzab"},{ref:"48:1",ar:"الفتح",en:"The Opening"},{ref:"48:27",ar:"الرؤيا والعمرة",en:"Vision and Umrah"},{ref:"110:1",ar:"النصر",en:"Divine help and victory"}
];
const PROPHETS=[
 {ref:"2:30",ar:"آدم عليه السلام",en:"Adam"},{ref:"11:25",ar:"نوح عليه السلام",en:"Nuh"},{ref:"11:69",ar:"إبراهيم عليه السلام",en:"Ibrahim"},{ref:"12:4",ar:"يوسف عليه السلام",en:"Yusuf"},{ref:"20:9",ar:"موسى عليه السلام",en:"Musa"},{ref:"21:83",ar:"أيوب عليه السلام",en:"Ayyub"},{ref:"21:87",ar:"يونس عليه السلام",en:"Yunus"},{ref:"19:2",ar:"زكريا عليه السلام",en:"Zakariyya"},{ref:"19:16",ar:"مريم وعيسى عليه السلام",en:"Maryam and Isa"}
];
export function SourcedSeerahStories({lang,go,kids=false}){const [tab,setTab]=useState("seerah");const rows=tab==="seerah"?SEERAH:PROPHETS;return <Shell lang={lang} go={go} back={kids?"kids-home":"discover"} titleAr={kids?"قصص من القرآن":"السيرة وقصص الأنبياء"} titleEn={kids?"Stories from Quran":"Seerah & Prophets"} subAr="كل بطاقة مرتبطة بمرجع قرآني وتحمّل النص من المصدر" subEn="Every card is tied to a Quran reference and loads its text from source"><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:16}}><button onClick={()=>setTab("seerah")} style={{padding:10,borderRadius:14,border:tab==="seerah"?`1px solid ${C.gold}`:"1px solid rgba(16,16,15,.09)",background:tab==="seerah"?"rgba(181,154,98,.1)":"transparent",fontFamily:"inherit"}}>{lang==="ar"?"السيرة":"Seerah"}</button><button onClick={()=>setTab("prophets")} style={{padding:10,borderRadius:14,border:tab==="prophets"?`1px solid ${C.gold}`:"1px solid rgba(16,16,15,.09)",background:tab==="prophets"?"rgba(181,154,98,.1)":"transparent",fontFamily:"inherit"}}>{lang==="ar"?"الأنبياء":"Prophets"}</button></div><div style={{marginTop:10}}>{rows.map(x=><AyahSourceCard key={x.ref+x.en} lang={lang} item={x}/>)}</div></Shell>}

export function TrustedDailyHub({lang,go}){const cards=[["quranic-duas","الأدعية القرآنية","Quranic Duas"],["smart-quranic-adhkar","الأذكار الذكية الموثقة","Smart Sourced Adhkar"],["sourced-seerah","السيرة وقصص الأنبياء","Seerah & Prophets"]];return <Shell lang={lang} go={go} titleAr="المحتوى الموثق" titleEn="Sourced Content" subAr="محتوى ديني يعرض مرجعه ومصدره بوضوح" subEn="Religious content with explicit source and reference"><div style={{display:"grid",gap:10,marginTop:18}}>{cards.map(([id,ar,en])=><button key={id} onClick={()=>go(id)} style={{border:"1px solid rgba(16,16,15,.08)",borderRadius:18,padding:16,background:"rgba(255,255,255,.42)",textAlign:lang==="ar"?"right":"left",fontFamily:"inherit",color:"inherit"}}><b style={{fontSize:14}}>{lang==="ar"?ar:en}</b><div style={{fontSize:10.5,opacity:.45,marginTop:5}}>Quran source · live</div></button>)}</div></Shell>}
