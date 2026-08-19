import React,{useState} from "react";
import App from "./App.jsx";
import {TrustedDailyHub,QuranicDuasHub,SmartQuranicAdhkar,SourcedSeerahStories} from "./trustedDaily.jsx";
import {KidsWorldHub,KidsQuranTeacherLive,KidsQuizLive} from "./kidsWorld.jsx";
import {OfflineBackupCenter} from "./offlineBackup.jsx";
import {DailyReflection} from "./dailyReflection.jsx";
import {LiveNamesOfAllah} from "./verifiedIslamic.jsx";
import {MyDayCenter,DailyToolsHub,IslamicCalendar,FastingCenter,RamadanCenter,SmartKhatmah,MemorizationCenter,HisnCenter,JumuahCenter,WorshipTimes,ParentalControls,PrivacyLock,CardMaker} from "./dailySuite.jsx";
import {SmartMyDay} from "./smartMyDay.jsx";
import {UniversalIslamicSearch,SavedLibrary} from "./searchLibrary.jsx";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62"};

function KidsNasheedsLive({lang,go}){
 const [playing,setPlaying]=useState(false),[track,setTrack]=useState(0);
 const rows=lang==="ar"?["أحب ربي","صلاتي نور","بسم الله","الحمد لله","أخلاق المسلم","رمضان فرحة"]:["I Love My Lord","My Prayer is Light","Bismillah","Alhamdulillah","Muslim Manners","Ramadan Joy"];
 return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,padding:"22px 22px 120px",overflowY:"auto"}}>
  <button onClick={()=>go("kids-world")} style={{border:0,background:"transparent",fontFamily:"inherit",cursor:"pointer"}}>{lang==="ar"?"← الأطفال":"← Kids"}</button>
  <div style={{fontFamily:"Fraunces,serif",fontSize:29,marginTop:16}}>{lang==="ar"?"أناشيد إسلامية للأطفال":"Islamic Nasheeds for Kids"}</div>
  <div style={{fontSize:11.5,opacity:.48,marginTop:7}}>{lang==="ar"?"أناشيد صوتية بلا موسيقى. لا يُشغّل صوت فعلي إلا بعد ربط مصدر مرخّص.":"Vocals-only nasheeds. Audio playback stays disabled until a licensed source is connected."}</div>
  <div style={{marginTop:18,borderRadius:26,padding:20,background:"linear-gradient(135deg,#FFF0C9,#DFF6FF 60%,#F3E7FF)",textAlign:"center"}}>
   <div style={{width:132,height:132,borderRadius:36,margin:"0 auto",display:"grid",placeItems:"center",fontSize:48,background:"rgba(255,255,255,.58)"}}>♪</div>
   <div style={{fontFamily:"Fraunces,serif",fontSize:23,marginTop:14}}>{rows[track]}</div>
   <div style={{display:"grid",gridTemplateColumns:"44px 62px 44px",justifyContent:"center",gap:10,marginTop:16}}>
    <button onClick={()=>{setTrack(v=>(v-1+rows.length)%rows.length);setPlaying(false)}} style={{border:0,borderRadius:"50%",background:"rgba(255,255,255,.7)",fontSize:20}}>‹</button>
    <button disabled onClick={()=>setPlaying(v=>!v)} style={{height:62,border:0,borderRadius:"50%",background:"rgba(23,59,87,.45)",color:"white",fontSize:20,cursor:"not-allowed"}}>{playing?"Ⅱ":"▶"}</button>
    <button onClick={()=>{setTrack(v=>(v+1)%rows.length);setPlaying(false)}} style={{border:0,borderRadius:"50%",background:"rgba(255,255,255,.7)",fontSize:20}}>›</button>
   </div>
  </div>
  <div style={{marginTop:12}}>{rows.map((x,i)=><button key={x} onClick={()=>{setTrack(i);setPlaying(false)}} style={{width:"100%",display:"grid",gridTemplateColumns:"38px 1fr",gap:10,alignItems:"center",padding:"11px 0",border:0,borderTop:"1px solid rgba(16,16,15,.07)",background:i===track?"rgba(181,154,98,.08)":"transparent",fontFamily:"inherit",textAlign:lang==="ar"?"right":"left",color:"inherit"}}><div style={{width:34,height:34,borderRadius:12,display:"grid",placeItems:"center",background:"rgba(181,154,98,.12)"}}>♪</div><div><b style={{fontSize:12.5}}>{x}</b><small style={{display:"block",opacity:.42,marginTop:3}}>{lang==="ar"?"بدون موسيقى · بانتظار مصدر صوتي مرخّص":"Vocals only · licensed audio source pending"}</small></div></button>)}</div>
 </div>
}

function UnifiedNav({lang,panel,go,setLang}){
 const items=[
  ["app","سكينة","Home","⌂"],
  ["my-day","يومي","My Day","☼"],
  ["islamic-search","بحث","Search","⌕"],
  ["daily-reflection","تأمّل","Reflect","◌"],
  ["trusted-daily","الموثق","Sourced","✦"],
  ["kids-world","الأطفال","Kids","☀"],
  ["saved-library","مكتبتي","Library","♡"],
  ["offline-backup","بياناتي","Data","◫"],
 ];
 const daily=new Set(["daily-tools","islamic-calendar","fasting-center","ramadan-center","smart-khatmah","memorization-center","names-live","hisn-center","jumuah-center","worship-times","parental-controls","privacy-lock","card-maker"]);
 const active=panel.startsWith("kids-")?"kids-world":["quranic-duas","smart-quranic-adhkar","sourced-seerah"].includes(panel)?"trusted-daily":daily.has(panel)?"my-day":panel;
 return <>
  <button onClick={()=>setLang(lang==="ar"?"en":"ar")} aria-label="language" style={{position:"fixed",top:14,right:14,zIndex:10001,width:38,height:38,borderRadius:13,border:"1px solid rgba(16,16,15,.08)",background:"rgba(246,243,236,.92)",backdropFilter:"blur(14px)",fontFamily:"inherit",fontWeight:700,color:C.ink}}>{lang==="ar"?"EN":"ع"}</button>
  <nav aria-label="Sakinah primary" style={{position:"fixed",left:"50%",transform:"translateX(-50%)",bottom:12,zIndex:10000,width:"min(560px,calc(100vw - 18px))",padding:5,borderRadius:23,border:"1px solid rgba(16,16,15,.09)",background:"rgba(246,243,236,.94)",backdropFilter:"blur(18px)",boxShadow:"0 12px 36px rgba(0,0,0,.14)",display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:1}}>
   {items.map(([id,ar,en,icon])=>{const on=active===id;return <button key={id} onClick={()=>go(id)} style={{border:0,borderRadius:16,padding:"7px 2px 6px",background:on?"rgba(181,154,98,.16)":"transparent",color:on?C.lapis:C.ink,fontFamily:"inherit",display:"grid",gap:3,placeItems:"center",minWidth:0}}><span style={{fontSize:15,lineHeight:1}}>{icon}</span><span style={{fontSize:8,fontWeight:on?700:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"100%"}}>{lang==="ar"?ar:en}</span></button>})}
  </nav>
 </>;
}

export default function MergedSakinah(){
 const [panel,setPanel]=useState("app"),[lang,setLang]=useState("ar");
 const known=new Set(["app","my-day","daily-tools","daily-reflection","trusted-daily","quranic-duas","smart-quranic-adhkar","sourced-seerah","kids-sourced-stories","kids-world","kids-home","kids-quran-live","kids-quiz-live","kids-nasheeds","offline-backup","islamic-calendar","fasting-center","ramadan-center","smart-khatmah","memorization-center","names-live","hisn-center","jumuah-center","worship-times","parental-controls","privacy-lock","card-maker","islamic-search","saved-library"]);
 const go=(to)=>setPanel(known.has(to)?to:"app");
 const screens={
  "my-day":<SmartMyDay lang={lang} go={go}/>,
  "daily-tools":<DailyToolsHub lang={lang} go={go}/>,
  "daily-reflection":<DailyReflection lang={lang} go={go}/>,
  "trusted-daily":<TrustedDailyHub lang={lang} go={go}/>,
  "quranic-duas":<QuranicDuasHub lang={lang} go={go}/>,
  "smart-quranic-adhkar":<SmartQuranicAdhkar lang={lang} go={go}/>,
  "sourced-seerah":<SourcedSeerahStories lang={lang} go={go}/>,
  "kids-sourced-stories":<SourcedSeerahStories lang={lang} go={go} kids/>,
  "kids-world":<KidsWorldHub lang={lang} go={go}/>,
  "kids-home":<KidsWorldHub lang={lang} go={go}/>,
  "kids-quran-live":<KidsQuranTeacherLive lang={lang} go={go}/>,
  "kids-quiz-live":<KidsQuizLive lang={lang} go={go}/>,
  "kids-nasheeds":<KidsNasheedsLive lang={lang} go={go}/>,
  "offline-backup":<OfflineBackupCenter lang={lang} go={go}/>,
  "islamic-calendar":<IslamicCalendar lang={lang} go={go}/>,
  "fasting-center":<FastingCenter lang={lang} go={go}/>,
  "ramadan-center":<RamadanCenter lang={lang} go={go}/>,
  "smart-khatmah":<SmartKhatmah lang={lang} go={go}/>,
  "memorization-center":<MemorizationCenter lang={lang} go={go}/>,
  "names-live":<LiveNamesOfAllah lang={lang} go={go}/>,
  "hisn-center":<HisnCenter lang={lang} go={go}/>,
  "jumuah-center":<JumuahCenter lang={lang} go={go}/>,
  "worship-times":<WorshipTimes lang={lang} go={go}/>,
  "parental-controls":<ParentalControls lang={lang} go={go}/>,
  "privacy-lock":<PrivacyLock lang={lang} go={go}/>,
  "card-maker":<CardMaker lang={lang} go={go}/>,
  "islamic-search":<UniversalIslamicSearch lang={lang} go={go}/>,
  "saved-library":<SavedLibrary lang={lang} go={go}/>,
 };
 return <div style={{position:"relative",minHeight:"100vh",background:C.ivory}}>
  {panel==="app"?<App/>:(screens[panel]||screens["trusted-daily"])}
  <UnifiedNav lang={lang} panel={panel} go={go} setLang={setLang}/>
 </div>;
}
