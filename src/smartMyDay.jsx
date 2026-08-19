import React,{useEffect,useMemo,useState} from "react";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62",green:"#4F915C",red:"#A44D3C"};
const profile=()=>{try{return localStorage.getItem("sakinah-active-profile")||"me"}catch{return "me"}};
const read=(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch{return d}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const key=n=>`sakinah-${n}-${profile()}`;
const btn={border:"1px solid rgba(16,16,15,.09)",borderRadius:14,padding:11,background:"transparent",fontFamily:"inherit",color:"inherit"};
const PRAYERS=[["Fajr","الفجر"],["Dhuhr","الظهر"],["Asr","العصر"],["Maghrib","المغرب"],["Isha","العشاء"]];
function toMin(x){if(!x)return null;const m=String(x).match(/(\d{1,2}):(\d{2})/);return m?Number(m[1])*60+Number(m[2]):null}
function nextPrayer(t){if(!t)return null;const now=new Date(),mins=now.getHours()*60+now.getMinutes();for(const [en,ar] of PRAYERS){const m=toMin(t[en]);if(m!=null&&m>=mins)return {en,ar,time:t[en],mins:m-mins}};return {en:"Fajr",ar:"الفجر",time:t.Fajr,mins:(24*60-mins)+(toMin(t.Fajr)||0)}}
function hijriParts(){try{const f=new Intl.DateTimeFormat("en-u-ca-islamic",{day:"numeric",month:"numeric",year:"numeric"});const p=Object.fromEntries(f.formatToParts(new Date()).filter(x=>["day","month","year"].includes(x.type)).map(x=>[x.type,Number(x.value)]));return p}catch{return {}}}
function Shell({lang,children}){return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,display:"flex",flexDirection:"column"}}><div style={{flex:1,overflowY:"auto",padding:"70px 22px 135px"}}>{children}</div></div>}
function Progress({value}){return <div style={{height:8,borderRadius:8,background:"rgba(16,16,15,.07)",overflow:"hidden"}}><div style={{height:"100%",width:`${Math.max(0,Math.min(100,value))}%`,background:C.gold}}/></div>}
function ServiceCard({item,lang,go}){return <button onClick={()=>go(item.id)} style={{...btn,minHeight:78,padding:"13px 12px",textAlign:lang==="ar"?"right":"left",display:"flex",gap:11,alignItems:"center",width:"100%"}}><span style={{width:34,height:34,borderRadius:12,border:"1px solid rgba(16,16,15,.08)",display:"grid",placeItems:"center",fontSize:16,flex:"0 0 auto"}}>{item.icon}</span><span style={{minWidth:0}}><span style={{display:"block",fontSize:12.5,fontWeight:650,lineHeight:1.45}}>{lang==="ar"?item.ar:item.en}</span>{item.subAr&&<span style={{display:"block",fontSize:9.5,opacity:.42,marginTop:3,lineHeight:1.4}}>{lang==="ar"?item.subAr:item.subEn}</span>}</span></button>}

export function SmartMyDay({lang,go}){
 const [timings,setTimings]=useState(null),[place,setPlace]=useState(""),[locState,setLocState]=useState("idle");
 const dayKey=new Date().toISOString().slice(0,10),doneKey=key(`myday-${dayKey}`);const [done,setDone]=useState(()=>read(doneKey,{}));
 const hijri=useMemo(hijriParts,[]),isFriday=new Date().getDay()===5,isRamadan=hijri.month===9,isWhite=[13,14,15].includes(hijri.day);
 const khatmahPage=read(key("khatmah-page"),1),khatmahDays=read(key("khatmah-days"),30),portion=Math.max(1,Math.ceil((604-khatmahPage+1)/Math.max(1,khatmahDays)));
 const reflectCount=read(key("reflections"),[]).length;
 useEffect(()=>{if(!navigator.geolocation)return;setLocState("loading");navigator.geolocation.getCurrentPosition(async p=>{try{const {latitude,longitude}=p.coords;const r=await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=4`);if(!r.ok)throw new Error();const x=await r.json();setTimings(x.data?.timings||null);setPlace(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);setLocState("ok")}catch{setLocState("error")}},()=>setLocState("denied"),{enableHighAccuracy:false,timeout:10000,maximumAge:600000})},[]);
 const next=nextPrayer(timings);
 const hour=new Date().getHours();
 const dhikrLabel=hour<12?{ar:"أذكار الصباح",en:"Morning adhkar"}:hour>=17?{ar:"أذكار المساء",en:"Evening adhkar"}:{ar:"ذكر مناسب الآن",en:"Remembrance now"};
 const base=[
  {id:"daily-reflection",ar:"تأمّل اليوم",en:"Today's reflection",icon:"◌",track:true},
  {id:"smart-khatmah",ar:`ورد القرآن · ${portion} صفحة`,en:`Quran portion · ${portion} pages`,icon:"◈",track:true},
  {id:"smart-quranic-adhkar",ar:dhikrLabel.ar,en:dhikrLabel.en,icon:"✦",track:true},
  {id:"worship-times",ar:"أوقات العبادة",en:"Worship times",icon:"◷",track:true}
 ];
 const contextual=[];
 if(isFriday)contextual.push({id:"jumuah-center",ar:"برنامج الجمعة اليوم",en:"Friday program today",icon:"⌁",track:true});
 if(isRamadan)contextual.push({id:"ramadan-center",ar:"برنامج رمضان اليوم",en:"Ramadan plan today",icon:"☾",track:true});
 if(isWhite)contextual.push({id:"fasting-center",ar:"اليوم من الأيام البيض",en:"White Day fasting",icon:"☽",track:true});
 const items=[...contextual,...base];
 const services=[
  {id:"tasbeeh",ar:"المسبحة",en:"Tasbeeh",icon:"○",subAr:"ذكر سريع في أي وقت",subEn:"Quick remembrance"},
  {id:"quranic-duas",ar:"الأدعية",en:"Duas",icon:"♡",subAr:"أدعية يومية موثوقة",subEn:"Daily sourced duas"},
  {id:"qibla",ar:"القبلة",en:"Qibla",icon:"⌖",subAr:"اتجاه القبلة بسرعة",subEn:"Quick direction"},
  {id:"mosques",ar:"أقرب مسجد",en:"Nearby mosque",icon:"⌂",subAr:"المساجد القريبة منك",subEn:"Mosques near you"},
  {id:"notes",ar:"ملاحظاتي",en:"My notes",icon:"✎",subAr:"تدوين سريع",subEn:"Quick notes"},
  {id:"accounts",ar:"حساباتي",en:"My accounts",icon:"＋",subAr:"دفتر الحسابات الشخصي",subEn:"Personal ledger"},
  {id:"alerts",ar:"التنبيهات",en:"Alerts",icon:"◉",subAr:"الصلاة والأذكار",subEn:"Prayer & dhikr alerts"},
  {id:"hisn-center",ar:"حصن المسلم",en:"Hisn al-Muslim",icon:"◇",subAr:"أذكار اليوم والليلة",subEn:"Daily adhkar"}
 ];
 const mark=id=>{const x={...done,[id]:!done[id]};setDone(x);write(doneKey,x)};
 const count=items.length,complete=items.filter(x=>done[x.id]).length;
 const date=new Date().toLocaleDateString(lang==="ar"?"ar-IQ":"en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
 return <Shell lang={lang}>
  <div style={{fontFamily:"Fraunces,serif",fontSize:30,lineHeight:1.2}}>{lang==="ar"?"يومي مع سكينة":"My Day with Sakinah"}</div><div style={{fontSize:11.5,opacity:.48,marginTop:7}}>{date}</div>
  <div style={{marginTop:18,borderRadius:26,padding:19,background:"linear-gradient(135deg,rgba(181,154,98,.18),rgba(255,255,255,.58))",border:"1px solid rgba(181,154,98,.14)"}}><div style={{display:"flex",justifyContent:"space-between",gap:14,alignItems:"start"}}><div><div style={{fontSize:10,opacity:.45}}>{lang==="ar"?"الصلاة القادمة":"Next prayer"}</div><div style={{fontFamily:"Fraunces,serif",fontSize:26,marginTop:5}}>{next?(lang==="ar"?next.ar:next.en):(lang==="ar"?"تحديد الموقع…":"Locating…")}</div>{next&&<div style={{fontSize:11,opacity:.55,marginTop:4}}>{next.time} · {next.mins} {lang==="ar"?"دقيقة":"min"}</div>}</div><button onClick={()=>go("worship-times")} style={{...btn,padding:"8px 10px",fontSize:10}}>{lang==="ar"?"المواقيت":"Times"}</button></div><div style={{fontSize:9.5,opacity:.38,marginTop:10}}>{locState==="denied"?(lang==="ar"?"إذن الموقع غير مفعّل":"Location permission is off"):place||"GPS"}</div></div>
  <div style={{marginTop:12,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}><button onClick={()=>go("smart-khatmah")} style={{...btn,padding:12,textAlign:lang==="ar"?"right":"left"}}><small style={{opacity:.42}}>{lang==="ar"?"ورد اليوم":"Today's portion"}</small><b style={{display:"block",fontSize:18,marginTop:5}}>{portion}</b></button><button onClick={()=>go("daily-reflection")} style={{...btn,padding:12,textAlign:lang==="ar"?"right":"left"}}><small style={{opacity:.42}}>{lang==="ar"?"تأملاتك":"Reflections"}</small><b style={{display:"block",fontSize:18,marginTop:5}}>{reflectCount}</b></button><div style={{...btn,padding:12}}><small style={{opacity:.42}}>{lang==="ar"?"إنجاز اليوم":"Today"}</small><b style={{display:"block",fontSize:18,marginTop:5}}>{complete}/{count}</b></div></div>
  {(isFriday||isRamadan||isWhite)&&<div style={{marginTop:12,padding:13,borderRadius:17,background:"rgba(79,145,92,.09)",border:"1px solid rgba(79,145,92,.14)",fontSize:11.5,lineHeight:1.7}}>{lang==="ar"?(isFriday?"اليوم الجمعة · أظهرنا برنامج الجمعة ضمن خطتك.":isRamadan?"رمضان · أظهرنا برنامج رمضان ضمن خطتك.":"اليوم من الأيام البيض · ظهر تذكير الصيام ضمن خطتك."):(isFriday?"It is Friday · your Jumu'ah plan is included.":isRamadan?"It is Ramadan · your Ramadan plan is included.":"It is a White Day · fasting is surfaced in your plan.")}</div>}
  <div style={{marginTop:16}}><Progress value={count?complete/count*100:0}/></div>
  <div style={{marginTop:10}}>{items.map(item=><div key={item.id} style={{display:"grid",gridTemplateColumns:"42px 1fr auto",gap:10,alignItems:"center",padding:"12px 0",borderTop:"1px solid rgba(16,16,15,.07)"}}><button onClick={()=>mark(item.id)} aria-label={lang==="ar"?"تحديد كمكتمل":"Mark complete"} style={{width:36,height:36,borderRadius:13,border:"1px solid rgba(16,16,15,.08)",background:done[item.id]?"rgba(79,145,92,.14)":"transparent",fontFamily:"inherit"}}>{done[item.id]?"✓":item.icon}</button><button onClick={()=>go(item.id)} style={{border:0,background:"transparent",fontFamily:"inherit",textAlign:lang==="ar"?"right":"left",color:"inherit",fontSize:13,fontWeight:650}}>{lang==="ar"?item.ar:item.en}</button><span style={{opacity:.28}}>›</span></div>)}</div>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"end",marginTop:22,marginBottom:10}}><div><div style={{fontSize:15,fontWeight:700}}>{lang==="ar"?"استخدام يومي":"Daily essentials"}</div><div style={{fontSize:10,opacity:.42,marginTop:3}}>{lang==="ar"?"الخدمات التي تحتاجها غالباً، بدون زحام":"Frequently used services, kept simple"}</div></div></div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:8}}>{services.map(item=><ServiceCard key={item.id} item={item} lang={lang} go={go}/>)}</div>
  <button onClick={()=>go("daily-tools")} style={{...btn,width:"100%",marginTop:10,padding:"13px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:lang==="ar"?"right":"left"}}><span><span style={{display:"block",fontSize:12.5,fontWeight:700}}>{lang==="ar"?"كل الأدوات اليومية":"All daily tools"}</span><span style={{display:"block",fontSize:9.5,opacity:.42,marginTop:3}}>{lang==="ar"?"باقي الخدمات في مكان واحد":"Everything else in one place"}</span></span><span style={{opacity:.35}}>›</span></button>
 </Shell>;
}
