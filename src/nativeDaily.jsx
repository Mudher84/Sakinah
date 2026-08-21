import React,{useEffect,useRef,useState} from "react";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62"};
const btn={border:"1px solid rgba(16,16,15,.08)",borderRadius:18,padding:12,background:"rgba(255,255,255,.62)",fontFamily:"inherit",color:"inherit"};
const profile=()=>{try{return localStorage.getItem("sakinah-active-profile")||"me"}catch{return"me"}};
const key=n=>`sakinah-native-${profile()}-${n}`;
const read=(n,d)=>{try{const x=localStorage.getItem(key(n));return x==null?d:JSON.parse(x)}catch{return d}};
const write=(n,v)=>{try{localStorage.setItem(key(n),JSON.stringify(v))}catch{}};
const native=()=>typeof window!=="undefined"&&window.SakinahNative?window.SakinahNative:null;
const PR=["Fajr","Dhuhr","Asr","Maghrib","Isha"];
const PR_AR={Fajr:"الفجر",Dhuhr:"الظهر",Asr:"العصر",Maghrib:"المغرب",Isha:"العشاء"};
const METHODS=[{id:4,ar:"أم القرى · مكة"},{id:3,ar:"رابطة العالم الإسلامي"},{id:2,ar:"ISNA"},{id:5,ar:"الهيئة المصرية"},{id:1,ar:"جامعة كراتشي"}];
const MUEZZINS=[
 {id:"default",ar:"تنبيه فقط",asset:null},
 {id:"wadie-al-yamani",ar:"وديع اليمني",asset:"/audio/adhan/وديع اليمني.ogg"},
 {id:"ahmed-al-nafis",ar:"أحمد النفيس",asset:"/audio/adhan/احمد النفيس.ogg"},
 {id:"mishary-alafasy",ar:"مشاري العفاسي",asset:"/audio/adhan/مشاري العفاسي .ogg"},
 {id:"ahmed-galal-yahia",ar:"أحمد جلال يحيى",asset:"/audio/adhan/احمد يحيى.ogg"}
];
const voiceById=id=>MUEZZINS.find(x=>x.id===id)||MUEZZINS[0];
const clean=v=>String(v||"").split(" ")[0];
const epochToday=v=>{const [h,m]=clean(v).split(":").map(Number),d=new Date();d.setHours(h||0,m||0,0,0);return d.getTime()};
const nextPrayer=timings=>{if(!timings)return null;const now=Date.now();for(const p of PR){const at=epochToday(timings[p]);if(at>now)return[p,clean(timings[p]),at]}const d=new Date();d.setDate(d.getDate()+1);const[h,m]=clean(timings.Fajr).split(":").map(Number);d.setHours(h||0,m||0,0,0);return["Fajr",clean(timings.Fajr),d.getTime()]};
async function getPosition(){return new Promise((ok,fail)=>navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>ok(p.coords),fail,{enableHighAccuracy:true,timeout:15000,maximumAge:0}):fail(new Error("geo")))}
async function fetchPrayerData(method,school){const c=await getPosition();const r=await fetch(`https://api.aladhan.com/v1/timings?latitude=${c.latitude}&longitude=${c.longitude}&method=${method}&school=${school}`);if(!r.ok)throw new Error("http");const j=await r.json();return{data:j?.data||null,coords:{latitude:c.latitude,longitude:c.longitude,accuracy:c.accuracy}}}
function Shell({go,children}){return <div style={{position:"fixed",inset:0,zIndex:50000,background:"linear-gradient(180deg,#FAF7F0,#F3EFE6)",color:C.ink,overflowY:"auto"}} dir="rtl"><div style={{maxWidth:720,margin:"0 auto",padding:"max(76px,calc(env(safe-area-inset-top) + 48px)) 18px 130px",boxSizing:"border-box"}}><button onClick={go} style={{...btn,padding:"8px 12px",borderRadius:999}}>→ رجوع</button><div style={{textAlign:"center",marginTop:12}}><div style={{fontSize:10,color:C.gold,letterSpacing:.8}}>MUSLIM MIRROR</div><div style={{fontSize:30,lineHeight:1.5,fontWeight:700,marginTop:2}}>المؤذن والتنبيهات</div><div style={{fontSize:11,opacity:.48}}>جدولة أصلية على Android · مواقيت حسب الموقع · أصوات مدمجة</div></div>{children}</div></div>}
function Switch({on,onChange}){return <button type="button" onClick={()=>onChange(!on)} style={{width:46,height:27,padding:3,border:0,borderRadius:999,background:on?C.lapis:"rgba(16,16,15,.12)",display:"flex",alignItems:"center",justifyContent:on?"flex-end":"flex-start"}}><span style={{width:21,height:21,borderRadius:"50%",background:"white"}}/></button>}
function VoiceSelect({value,onChange,onPreview,playing}){return <div style={{display:"grid",gridTemplateColumns:"1fr 46px",gap:7}}><select value={value} onChange={e=>onChange(e.target.value)} style={{...btn,borderRadius:999,minHeight:48}}>{MUEZZINS.map(v=><option key={v.id} value={v.id}>{v.ar}</option>)}</select><button onClick={()=>onPreview(voiceById(value))} disabled={!voiceById(value).asset} style={{border:0,borderRadius:"50%",background:playing?C.gold:C.lapis,color:"white",opacity:voiceById(value).asset?1:.35}}>{playing?"■":"▶"}</button></div>}

export function NativeDailyCenter({go}){
 const [cfg,setCfg]=useState(()=>read("adhan",{Fajr:true,Dhuhr:true,Asr:true,Maghrib:true,Isha:true,friday:true,ramadan:true,voice:"default",voices:{},method:4,school:0}));
 const [payload,setPayload]=useState(null),[msg,setMsg]=useState(""),[playing,setPlaying]=useState("");
 const audioRef=useRef(null);
 const sync=(nextCfg=cfg,nextPayload=payload)=>{
  if(!nextPayload?.data)return;
  const data=nextPayload.data,meta=data.meta||{},nxt=nextPrayer(data.timings),voices=Object.fromEntries(PR.map(p=>{const id=(nextCfg.voices||{})[p]||nextCfg.voice||"default",v=voiceById(id);return[p,{id,asset:v.asset}]}));
  const bridge={schema:5,brand:"Muslim Mirror",updatedAt:new Date().toISOString(),profile:profile(),latitude:Number(meta.latitude??nextPayload.coords.latitude),longitude:Number(meta.longitude??nextPayload.coords.longitude),timezone:meta.timezone||Intl.DateTimeFormat().resolvedOptions().timeZone,method:Number(nextCfg.method||4),school:Number(nextCfg.school||0),notifications:nextCfg,voiceAssets:voices,timings:data.timings||null,calendar:data.date||null,nextPrayer:nxt?.[0]||"",nextPrayerTime:nxt?.[1]||"",nextPrayerAt:nxt?.[2]||0,hijriDate:data.date?.hijri?`${data.date.hijri.day} ${data.date.hijri.month?.ar||""} ${data.date.hijri.year}`:""};
  write("native-bridge",bridge);try{localStorage.setItem("sakinah-prayer-times",JSON.stringify(data.timings||{}))}catch{}
  const nat=native();if(nat){try{nat.saveBridgeState(JSON.stringify(bridge));nat.refreshPrayerSchedule?.();nat.refreshWidget?.()}catch{}}
 };
 const load=async(nextCfg=cfg)=>{setMsg("جاري تحديث المواقيت حسب موقعك…");try{const p=await fetchPrayerData(nextCfg.method||4,nextCfg.school||0);setPayload(p);sync(nextCfg,p);setMsg("تم تحديث المواقيت وجدولة الصلوات.")}catch{setMsg("تعذر تحديث المواقيت. فعّل الموقع والإنترنت ثم أعد المحاولة.")}};
 useEffect(()=>{load();return()=>{try{audioRef.current?.pause()}catch{}}},[]);
 const set=(k,v)=>{const n={...cfg,[k]:v};setCfg(n);write("adhan",n);sync(n,payload)};
 const setVoice=(p,v)=>{const n={...cfg,voices:{...(cfg.voices||{}),[p]:v}};setCfg(n);write("adhan",n);sync(n,payload)};
 const setAllVoice=v=>{const n={...cfg,voice:v,voices:Object.fromEntries(PR.map(p=>[p,v]))};setCfg(n);write("adhan",n);sync(n,payload)};
 const preview=v=>{try{if(audioRef.current){audioRef.current.pause();audioRef.current.currentTime=0}if(!v.asset)return;const a=new Audio(v.asset);audioRef.current=a;a.onended=()=>setPlaying("");a.onerror=()=>{setPlaying("");setMsg("تعذر تشغيل ملف الأذان")};a.play().then(()=>setPlaying(v.id)).catch(()=>setMsg("اضغط مرة أخرى للسماح بتشغيل الصوت"))}catch{}};
 const permission=async()=>{const nat=native();if(nat){try{nat.ensureExactAlarmPermission?.();nat.refreshPrayerSchedule?.();setMsg("تم تجهيز إشعارات Android. إذا ظهرت شاشة صلاحية المنبهات الدقيقة فاسمح بها.")}catch{}return}if(!("Notification" in window)){setMsg("المتصفح لا يدعم الإشعارات");return}const p=await Notification.requestPermission();setMsg(p==="granted"?"تم تفعيل إشعارات المتصفح":"لم يتم منح إذن الإشعارات")};
 return <Shell go={go}><div style={{display:"grid",gridTemplateColumns:"1.2fr .8fr",gap:9,marginTop:18}}><button onClick={permission} style={{...btn,background:C.lapis,color:"white",border:0,minHeight:54,fontWeight:700}}>تفعيل الإشعارات الدقيقة</button><button onClick={()=>load()} style={{...btn,minHeight:54}}>↻ تحديث المواقيت</button></div>{msg&&<div style={{fontSize:10.5,marginTop:9,padding:"10px 12px",borderRadius:14,background:"rgba(181,154,98,.10)"}}>{msg}</div>}
 <section style={{marginTop:16,padding:15,borderRadius:24,background:"rgba(255,255,255,.58)",border:"1px solid rgba(16,16,15,.06)"}}><b>طريقة حساب المواقيت</b><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:10}}><select value={cfg.method||4} onChange={e=>{const n={...cfg,method:Number(e.target.value)};setCfg(n);write("adhan",n);load(n)}} style={btn}>{METHODS.map(x=><option key={x.id} value={x.id}>{x.ar}</option>)}</select><select value={cfg.school||0} onChange={e=>{const n={...cfg,school:Number(e.target.value)};setCfg(n);write("adhan",n);load(n)}} style={btn}><option value={0}>العصر · قياسي</option><option value={1}>العصر · حنفي</option></select></div></section>
 <section style={{marginTop:14,padding:15,borderRadius:24,background:"rgba(255,255,255,.58)",border:"1px solid rgba(16,16,15,.06)"}}><b>المؤذن الافتراضي</b><div style={{marginTop:10}}><VoiceSelect value={cfg.voice||"default"} onChange={setAllVoice} onPreview={preview} playing={playing===(cfg.voice||"default")}/></div></section>
 <div style={{marginTop:14,display:"grid",gap:9}}>{PR.map(p=>{const selected=(cfg.voices||{})[p]||cfg.voice||"default";return <div key={p} style={{padding:14,borderRadius:24,background:"rgba(255,255,255,.72)",border:"1px solid rgba(16,16,15,.055)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}><div><b>{PR_AR[p]}</b><div style={{fontSize:11,opacity:.42,marginTop:3}}>{payload?.data?.timings?.[p]||"--:--"}</div></div><Switch on={!!cfg[p]} onChange={v=>set(p,v)}/></div><div style={{marginTop:11}}><VoiceSelect value={selected} onChange={v=>setVoice(p,v)} onPreview={preview} playing={playing===selected}/></div></div>})}</div>
 <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginTop:12}}><div style={{...btn,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>تذكير الجمعة</span><Switch on={!!cfg.friday} onChange={v=>set("friday",v)}/></div><div style={{...btn,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>تذكير رمضان</span><Switch on={!!cfg.ramadan} onChange={v=>set("ramadan",v)}/></div></div>
 <div style={{marginTop:14,padding:13,borderRadius:18,background:"rgba(23,59,87,.06)",fontSize:10.5,lineHeight:1.8}}>على Android تُحدَّث الجدولة دورياً وفي إعادة تشغيل الهاتف أو تغيير الوقت/المنطقة الزمنية. أصوات المؤذنين المضمنة مرتبطة الآن مباشرة بخدمة الأذان الأصلية.</div></Shell>;
}
