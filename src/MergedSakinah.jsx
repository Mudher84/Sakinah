import React,{useState} from "react";
import App from "./App.jsx";
import {TrustedDailyHub,QuranicDuasHub,SmartQuranicAdhkar,SourcedSeerahStories} from "./trustedDaily.jsx";
import {KidsWorldHub,KidsQuranTeacherLive,KidsQuizLive} from "./kidsWorld.jsx";
import {OfflineBackupCenter} from "./offlineBackup.jsx";
import {DailyReflection} from "./dailyReflection.jsx";
import {LiveNamesOfAllah} from "./verifiedIslamic.jsx";
import {DailyToolsHub,IslamicCalendar,FastingCenter,RamadanCenter,SmartKhatmah,MemorizationCenter,HisnCenter,JumuahCenter,WorshipTimes,ParentalControls,PrivacyLock,CardMaker} from "./dailySuite.jsx";
import {SmartMyDay} from "./smartMyDay.jsx";
import {UniversalIslamicSearch,SavedLibrary} from "./searchLibrary.jsx";
import {SmartQuranAnalytics} from "./quranAnalytics.jsx";
import {QuranIntelligenceHub,QuranTopicExplorer,QuranWordCompare,QuranEntityMap,QuranRootExplorer,TadabburAyah} from "./quranInsights.jsx";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62"};
const baseBtn={border:"1px solid rgba(16,16,15,.08)",borderRadius:18,padding:14,background:"rgba(255,255,255,.55)",fontFamily:"inherit",color:"inherit"};

function KidsNasheedsLive({lang,go}){
 const [track,setTrack]=useState(0);
 const rows=lang==="ar"?["أحب ربي","صلاتي نور","بسم الله","الحمد لله","أخلاق المسلم","رمضان فرحة"]:["I Love My Lord","My Prayer is Light","Bismillah","Alhamdulillah","Muslim Manners","Ramadan Joy"];
 return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,padding:"22px 22px 120px",overflowY:"auto"}}>
  <button onClick={()=>go("kids-world")} style={{border:0,background:"transparent",fontFamily:"inherit"}}>{lang==="ar"?"← الأطفال":"← Kids"}</button>
  <div style={{fontFamily:"Fraunces,serif",fontSize:29,marginTop:16}}>{lang==="ar"?"أناشيد إسلامية للأطفال":"Islamic Nasheeds for Kids"}</div>
  <div style={{fontSize:11.5,opacity:.48,marginTop:7}}>{lang==="ar"?"أناشيد بلا موسيقى. التشغيل الصوتي ينتظر مصدراً مرخّصاً.":"Vocals-only nasheeds. Playback waits for a licensed source."}</div>
  <div style={{marginTop:18,borderRadius:28,padding:22,background:"linear-gradient(135deg,#FFF0C9,#DFF6FF 60%,#F3E7FF)",textAlign:"center"}}><div style={{width:132,height:132,borderRadius:38,margin:"0 auto",display:"grid",placeItems:"center",fontSize:48,background:"rgba(255,255,255,.62)"}}>♪</div><div style={{fontFamily:"Fraunces,serif",fontSize:23,marginTop:14}}>{rows[track]}</div></div>
  <div style={{marginTop:12}}>{rows.map((x,i)=><button key={x} onClick={()=>setTrack(i)} style={{width:"100%",display:"grid",gridTemplateColumns:"38px 1fr",gap:10,alignItems:"center",padding:"12px 0",border:0,borderTop:"1px solid rgba(16,16,15,.07)",background:i===track?"rgba(181,154,98,.08)":"transparent",fontFamily:"inherit",textAlign:lang==="ar"?"right":"left",color:"inherit"}}><div style={{width:34,height:34,borderRadius:12,display:"grid",placeItems:"center",background:"rgba(181,154,98,.12)"}}>♪</div><div><b style={{fontSize:12.5}}>{x}</b><small style={{display:"block",opacity:.42,marginTop:3}}>{lang==="ar"?"بدون موسيقى · مصدر مرخّص مطلوب":"Vocals only · licensed source required"}</small></div></button>)}</div>
 </div>
}

function DiscoverHub({lang,go}){
 const cards=[
  ["islamic-search","⌕","البحث الإسلامي وذكاء القرآن","Islamic Search & Quran Intelligence"],
  ["daily-reflection","◌","تأمّل","Reflection"],
  ["trusted-daily","✦","المحتوى الموثق","Sourced Content"],
  ["kids-world","☀","عالم الأطفال","Kids World"],
  ["saved-library","♡","مكتبتي","My Library"],
  ["daily-tools","☼","أدوات العبادة اليومية","Daily Worship Tools"],
 ];
 return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,overflowY:"auto",padding:"28px 22px 130px"}} dir={lang==="ar"?"rtl":"ltr"}>
  <div style={{fontSize:11,letterSpacing:1.6,opacity:.42}}>{lang==="ar"?"سكينة":"SAKINAH"}</div>
  <div style={{fontFamily:"Fraunces,serif",fontSize:34,marginTop:6}}>{lang==="ar"?"اكتشف":"Discover"}</div>
  <div style={{fontSize:12,opacity:.5,lineHeight:1.8,marginTop:6}}>{lang==="ar"?"كل أدوات سكينة في مكان هادئ وواضح، بدون حذف أي ميزة.":"All Sakinah tools in one calm, clear place without removing any feature."}</div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:22}}>{cards.map(([id,icon,ar,en],i)=><button key={id} onClick={()=>go(id)} style={{...baseBtn,minHeight:i<2?128:108,textAlign:lang==="ar"?"right":"left",background:i===0?"linear-gradient(145deg,#173B57,#0C293E)":"rgba(255,255,255,.58)",color:i===0?"white":C.ink,boxShadow:"0 12px 32px rgba(16,16,15,.05)"}}><div style={{fontSize:24,color:i===0?"#E7D29B":C.gold}}>{icon}</div><div style={{fontSize:14,fontWeight:700,lineHeight:1.45,marginTop:18}}>{lang==="ar"?ar:en}</div></button>)}</div>
  <button onClick={()=>go("offline-backup")} style={{...baseBtn,width:"100%",marginTop:10,textAlign:lang==="ar"?"right":"left"}}>{lang==="ar"?"البيانات · Offline · النسخ الاحتياطي":"Data · Offline · Backup"}</button>
 </div>
}

function ProfileHub({lang,go}){
 const rows=[["saved-library","♡","المكتبة المحفوظة","Saved Library"],["offline-backup","◫","البيانات والنسخ الاحتياطي","Data & Backup"],["privacy-lock","⌾","قفل الخصوصية","Privacy Lock"],["parental-controls","☀","الرقابة الأبوية","Parental Controls"],["card-maker","◇","صانع البطاقات","Card Maker"]];
 return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,overflowY:"auto",padding:"28px 22px 130px"}} dir={lang==="ar"?"rtl":"ltr"}>
  <div style={{width:72,height:72,borderRadius:24,display:"grid",placeItems:"center",background:"linear-gradient(145deg,#173B57,#0C293E)",color:"white",fontSize:26,boxShadow:"0 14px 32px rgba(23,59,87,.18)"}}>س</div>
  <div style={{fontFamily:"Fraunces,serif",fontSize:31,marginTop:15}}>{lang==="ar"?"أنا":"Me"}</div>
  <div style={{fontSize:11.5,opacity:.48,marginTop:5}}>{lang==="ar"?"ملفك، محفوظاتك وخصوصيتك":"Your profile, library and privacy"}</div>
  <div style={{marginTop:22,borderRadius:24,overflow:"hidden",border:"1px solid rgba(16,16,15,.07)",background:"rgba(255,255,255,.48)"}}>{rows.map(([id,icon,ar,en])=><button key={id} onClick={()=>go(id)} style={{width:"100%",display:"grid",gridTemplateColumns:"38px 1fr auto",gap:10,alignItems:"center",padding:"15px 14px",border:0,borderBottom:"1px solid rgba(16,16,15,.06)",background:"transparent",fontFamily:"inherit",color:"inherit",textAlign:lang==="ar"?"right":"left"}}><span style={{color:C.gold,fontSize:18}}>{icon}</span><span style={{fontSize:12.5,fontWeight:650}}>{lang==="ar"?ar:en}</span><span style={{opacity:.3}}>{lang==="ar"?"‹":"›"}</span></button>)}</div>
 </div>
}

function UnifiedNav({lang,panel,go,setLang}){
 const items=[["app","الرئيسية","Home","⌂"],["quran-intelligence","القرآن","Quran","▥"],["my-day","يومي","My Day","☼"],["discover","اكتشف","Discover","⌕"],["profile","أنا","Me","♙"]];
 const daily=new Set(["daily-tools","islamic-calendar","fasting-center","ramadan-center","smart-khatmah","memorization-center","names-live","hisn-center","jumuah-center","worship-times"]);
 const quran=new Set(["quran-intelligence","quran-analytics","quran-topics","quran-compare","quran-entities","quran-roots","tadabbur-ayah"]);
 const profile=new Set(["profile","saved-library","offline-backup","privacy-lock","parental-controls","card-maker"]);
 const discover=new Set(["discover","islamic-search","daily-reflection","trusted-daily","quranic-duas","smart-quranic-adhkar","sourced-seerah","kids-world","kids-home","kids-quran-live","kids-quiz-live","kids-nasheeds","kids-sourced-stories"]);
 const active=quran.has(panel)?"quran-intelligence":daily.has(panel)?"my-day":profile.has(panel)?"profile":discover.has(panel)?"discover":panel;
 return <>
  <button onClick={()=>setLang(lang==="ar"?"en":"ar")} aria-label="language" style={{position:"fixed",top:14,right:14,zIndex:10001,width:40,height:40,borderRadius:14,border:"1px solid rgba(16,16,15,.07)",background:"rgba(246,243,236,.9)",backdropFilter:"blur(18px)",fontFamily:"inherit",fontWeight:700,color:C.ink,boxShadow:"0 8px 22px rgba(16,16,15,.06)"}}>{lang==="ar"?"EN":"ع"}</button>
  <nav aria-label="Sakinah primary" style={{position:"fixed",left:"50%",transform:"translateX(-50%)",bottom:10,zIndex:10000,width:"min(500px,calc(100vw - 18px))",padding:"7px 8px",borderRadius:25,border:"1px solid rgba(16,16,15,.08)",background:"rgba(246,243,236,.95)",backdropFilter:"blur(20px)",boxShadow:"0 14px 40px rgba(16,16,15,.13)",display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:3}}>
   {items.map(([id,ar,en,icon])=>{const on=active===id;return <button key={id} onClick={()=>go(id)} style={{border:0,borderRadius:17,padding:"8px 3px 7px",background:on?"rgba(181,154,98,.15)":"transparent",color:on?C.lapis:"rgba(16,16,15,.58)",fontFamily:"inherit",display:"grid",gap:4,placeItems:"center",minWidth:0}}><span style={{fontSize:17,lineHeight:1,color:on?C.gold:"inherit"}}>{icon}</span><span style={{fontSize:9,fontWeight:on?750:550,whiteSpace:"nowrap"}}>{lang==="ar"?ar:en}</span></button>})}
  </nav>
 </>;
}

export default function MergedSakinah(){
 const [panel,setPanel]=useState("app"),[lang,setLang]=useState("ar");
 const known=new Set(["app","discover","profile","my-day","daily-tools","daily-reflection","trusted-daily","quranic-duas","smart-quranic-adhkar","sourced-seerah","kids-sourced-stories","kids-world","kids-home","kids-quran-live","kids-quiz-live","kids-nasheeds","offline-backup","islamic-calendar","fasting-center","ramadan-center","smart-khatmah","memorization-center","names-live","hisn-center","jumuah-center","worship-times","parental-controls","privacy-lock","card-maker","islamic-search","saved-library","quran-analytics","quran-intelligence","quran-topics","quran-compare","quran-entities","quran-roots","tadabbur-ayah"]);
 const go=(to)=>setPanel(known.has(to)?to:"app");
 const screens={
  "discover":<DiscoverHub lang={lang} go={go}/>,"profile":<ProfileHub lang={lang} go={go}/>,"my-day":<SmartMyDay lang={lang} go={go}/>,"daily-tools":<DailyToolsHub lang={lang} go={go}/>,"daily-reflection":<DailyReflection lang={lang} go={go}/>,"trusted-daily":<TrustedDailyHub lang={lang} go={go}/>,"quranic-duas":<QuranicDuasHub lang={lang} go={go}/>,"smart-quranic-adhkar":<SmartQuranicAdhkar lang={lang} go={go}/>,"sourced-seerah":<SourcedSeerahStories lang={lang} go={go}/>,"kids-sourced-stories":<SourcedSeerahStories lang={lang} go={go} kids/>,"kids-world":<KidsWorldHub lang={lang} go={go}/>,"kids-home":<KidsWorldHub lang={lang} go={go}/>,"kids-quran-live":<KidsQuranTeacherLive lang={lang} go={go}/>,"kids-quiz-live":<KidsQuizLive lang={lang} go={go}/>,"kids-nasheeds":<KidsNasheedsLive lang={lang} go={go}/>,"offline-backup":<OfflineBackupCenter lang={lang} go={go}/>,"islamic-calendar":<IslamicCalendar lang={lang} go={go}/>,"fasting-center":<FastingCenter lang={lang} go={go}/>,"ramadan-center":<RamadanCenter lang={lang} go={go}/>,"smart-khatmah":<SmartKhatmah lang={lang} go={go}/>,"memorization-center":<MemorizationCenter lang={lang} go={go}/>,"names-live":<LiveNamesOfAllah lang={lang} go={go}/>,"hisn-center":<HisnCenter lang={lang} go={go}/>,"jumuah-center":<JumuahCenter lang={lang} go={go}/>,"worship-times":<WorshipTimes lang={lang} go={go}/>,"parental-controls":<ParentalControls lang={lang} go={go}/>,"privacy-lock":<PrivacyLock lang={lang} go={go}/>,"card-maker":<CardMaker lang={lang} go={go}/>,"islamic-search":<UniversalIslamicSearch lang={lang} go={go}/>,"saved-library":<SavedLibrary lang={lang} go={go}/>,"quran-analytics":<SmartQuranAnalytics lang={lang} go={go}/>,"quran-intelligence":<QuranIntelligenceHub lang={lang} go={go}/>,"quran-topics":<QuranTopicExplorer lang={lang} go={go}/>,"quran-compare":<QuranWordCompare lang={lang} go={go}/>,"quran-entities":<QuranEntityMap lang={lang} go={go}/>,"quran-roots":<QuranRootExplorer lang={lang} go={go}/>,"tadabbur-ayah":<TadabburAyah lang={lang} go={go}/>,
 };
 return <div style={{position:"relative",minHeight:"100vh",background:C.ivory}}>{panel==="app"?<App/>:(screens[panel]||screens["discover"])}<UnifiedNav lang={lang} panel={panel} go={go} setLang={setLang}/></div>;
}
