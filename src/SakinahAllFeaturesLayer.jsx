import React,{useEffect,useState} from "react";
import SakinahSevenDock from "./SakinahSevenDock.jsx";
import {TrustedDailyHub,QuranicDuasHub,SmartQuranicAdhkar,SourcedSeerahStories} from "./trustedDaily.jsx";
import {KidsWorldHub,KidsQuranTeacherLive,KidsQuizLive} from "./kidsWorld.jsx";
import {KidsNasheedsLive} from "./kidsNasheeds.jsx";
import {OfflineBackupCenter} from "./offlineBackup.jsx";
import {DailyReflection} from "./dailyReflection.jsx";
import {LiveNamesOfAllah} from "./verifiedIslamic.jsx";
import {LiveHadithHub} from "./liveHadith.jsx";
import {LiveTafsir} from "./liveTafsir.jsx";
import {LiveSunnahAdhkar} from "./liveSunnahAdhkar.jsx";
import {LiveWorshipTimes} from "./liveWorshipTimes.jsx";
import {DailyToolsHub,IslamicCalendar,FastingCenter,RamadanCenter,SmartKhatmah,MemorizationCenter,JumuahCenter,ParentalControls,PrivacyLock,CardMaker} from "./dailySuite.jsx";
import {SmartMyDay} from "./smartMyDay.jsx";
import {UniversalIslamicSearch,SavedLibrary} from "./searchLibrary.jsx";
import {SmartQuranAnalytics} from "./quranAnalytics.jsx";
import {QuranIntelligenceHub,QuranTopicExplorer,QuranWordCompare,QuranEntityMap,QuranRootExplorer,TadabburAyah} from "./quranInsights.jsx";
import {LiveQuranAudio} from "./liveAudio.jsx";
import {NotesNotebook,AccountsNotebook} from "./personalNotebooks.jsx";
import {QiblaCompass,NearbyMosques,ZakatCenter,ManasikCenter} from "./worshipUtilities.jsx";
import {SmartTasbeeh,UnifiedProfiles,PrayerWuduGuide} from "./devotionSuite.jsx";
import {NativeDailyCenter,WidgetLockPreview} from "./nativeDaily.jsx";
import {AdhanAudioSettings} from "./adhanAudioSettings.jsx";

const CLOSE_ROUTES=new Set([null,"","app","home","discover","profile","me","profiles-center"]);
const KIDS_CONTROL={"kids-quran-live":"quran","kids-sourced-stories":"stories","kids-quiz-live":"quiz","kids-nasheeds":"nasheed"};
const profile=()=>{try{return localStorage.getItem("sakinah-active-profile")||"me"}catch{return"me"}};
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
const dayKey=()=>new Date().toISOString().slice(0,10);
const usageKey=()=>`sakinah-kids-usage-${profile()}-${dayKey()}`;
const privacyKey=()=>`sakinah-privacy-pin-${profile()}`;
function childProfile(){const id=profile();const rows=read("sakinah-profiles",[]);return rows.find(x=>x.id===id)?.kind==="child"}
function parental(){return read(`sakinah-parental-${profile()}`,{minutes:60,quran:true,stories:true,quiz:true,nasheed:true,external:false})}
async function hashPin(v){const b=new TextEncoder().encode(v);const h=await crypto.subtle.digest("SHA-256",b);return Array.from(new Uint8Array(h)).map(x=>x.toString(16).padStart(2,"0")).join("")}
function LockGate({onUnlock}){const [pin,setPin]=useState(""),[msg,setMsg]=useState("");const unlock=async()=>{const saved=localStorage.getItem(privacyKey());if(!saved){onUnlock();return}if(await hashPin(pin)===saved){setPin("");setMsg("");onUnlock()}else setMsg("PIN غير صحيح")};return <div style={{position:"fixed",inset:0,zIndex:200000,background:"#F6F3EC",display:"grid",placeItems:"center",padding:24}} dir="rtl"><div style={{width:"min(390px,100%)",padding:24,borderRadius:28,background:"rgba(255,255,255,.68)",border:"1px solid rgba(16,16,15,.08)",boxShadow:"0 24px 70px rgba(16,16,15,.12)"}}><div style={{fontSize:11,opacity:.45}}>سكينة · الخصوصية</div><div style={{fontFamily:"Fraunces,serif",fontSize:30,marginTop:6}}>البروفايل مقفل</div><div style={{fontSize:11.5,opacity:.5,lineHeight:1.7,marginTop:7}}>أدخل PIN الخاص بالبروفايل لفتح بياناته ومحتواه.</div><input autoFocus inputMode="numeric" type="password" value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,"").slice(0,8))} onKeyDown={e=>e.key==="Enter"&&unlock()} placeholder="PIN" style={{width:"100%",boxSizing:"border-box",marginTop:18,padding:14,borderRadius:15,border:"1px solid rgba(16,16,15,.1)",background:"transparent",fontSize:22,textAlign:"center",letterSpacing:6}}/><button onClick={unlock} style={{width:"100%",marginTop:10,padding:13,border:0,borderRadius:15,background:"#173B57",color:"white",fontFamily:"inherit"}}>فتح سكينة</button>{msg&&<div style={{marginTop:10,fontSize:11,color:"#9C4A3B"}}>{msg}</div>}</div></div>}
function Blocked({text,close}){return <div style={{position:"absolute",inset:0,background:"#F6F3EC",display:"grid",placeItems:"center",padding:24}} dir="rtl"><div style={{width:"min(390px,100%)",padding:24,borderRadius:26,border:"1px solid rgba(16,16,15,.08)",background:"rgba(255,255,255,.62)",textAlign:"center"}}><div style={{fontSize:38}}>☀</div><div style={{fontSize:20,fontWeight:700,marginTop:10}}>الرقابة الأبوية</div><div style={{fontSize:12,lineHeight:1.8,opacity:.58,marginTop:8}}>{text}</div><button onClick={close} style={{marginTop:16,padding:"11px 18px",border:0,borderRadius:14,background:"#173B57",color:"white",fontFamily:"inherit"}}>رجوع</button></div></div>}

export default function SakinahAllFeaturesLayer({children}){
 const [feature,setFeature]=useState(null),[blocked,setBlocked]=useState(""),[locked,setLocked]=useState(()=>!!localStorage.getItem(privacyKey()));
 const lang="ar";
 const validate=to=>{if(!childProfile())return true;const cfg=parental();if(to?.startsWith("kids-")){const used=Number(localStorage.getItem(usageKey())||0);if(used>=Number(cfg.minutes||60)){setBlocked(`تم بلوغ حد الاستخدام اليومي (${cfg.minutes} دقيقة).`);return false}const k=KIDS_CONTROL[to];if(k&&cfg[k]===false){setBlocked("هذه الميزة متوقفة لهذا البروفايل من الرقابة الأبوية.");return false}}return true};
 const open=to=>{setBlocked("");if(CLOSE_ROUTES.has(to)){setFeature(null);return}if(to==="quran-home"){setFeature("quran-intelligence");return}if(to==="quran-search"){setFeature("islamic-search");return}if(to==="live-names"){setFeature("names-live");return}if(to==="dua-library"){setFeature("quranic-duas");return}if(!validate(to))return;const allowed=new Set(["daily-tools","daily-reflection","trusted-daily","quranic-duas","smart-quranic-adhkar","sourced-seerah","kids-world","kids-home","kids-quran-live","kids-quiz-live","kids-nasheeds","kids-sourced-stories","offline-backup","islamic-calendar","fasting-center","ramadan-center","smart-khatmah","memorization-center","names-live","hisn-center","jumuah-center","worship-times","parental-controls","privacy-lock","card-maker","islamic-search","saved-library","quran-analytics","quran-intelligence","quran-topics","quran-compare","quran-entities","quran-roots","tadabbur-ayah","my-day","quran-player","nine-books","tafsir-library","notes","accounts","profiles","qibla","mosques","zakat","manasik","tasbeeh","guide","alerts","adhan-audio","widget"]);setFeature(allowed.has(to)?to:null)};
 useEffect(()=>{const h=e=>open(e.detail||null);window.addEventListener("sakinah:feature",h);return()=>window.removeEventListener("sakinah:feature",h)});
 useEffect(()=>{const h=()=>{setFeature(null);setBlocked("");setLocked(!!localStorage.getItem(privacyKey()))};window.addEventListener("sakinah-profile-change",h);return()=>window.removeEventListener("sakinah-profile-change",h)},[]);
 useEffect(()=>{if(!childProfile()||!feature?.startsWith("kids-"))return;const tick=()=>{const n=Number(localStorage.getItem(usageKey())||0)+1;localStorage.setItem(usageKey(),String(n));const limit=Number(parental().minutes||60);if(n>=limit){setFeature(null);setBlocked(`تم بلوغ حد الاستخدام اليومي (${limit} دقيقة).`)}};const id=setInterval(tick,60000);return()=>clearInterval(id)},[feature]);
 const go=open;
 const close=()=>open(null);
 const screens={
  "daily-tools":<DailyToolsHub lang={lang} go={go}/>,"daily-reflection":<DailyReflection lang={lang} go={go}/>,"trusted-daily":<TrustedDailyHub lang={lang} go={go}/>,"quranic-duas":<QuranicDuasHub lang={lang} go={go}/>,"smart-quranic-adhkar":<SmartQuranicAdhkar lang={lang} go={go}/>,"sourced-seerah":<SourcedSeerahStories lang={lang} go={go}/>,"kids-sourced-stories":<SourcedSeerahStories lang={lang} go={go} kids/>,"kids-world":<KidsWorldHub lang={lang} go={go}/>,"kids-home":<KidsWorldHub lang={lang} go={go}/>,"kids-quran-live":<KidsQuranTeacherLive lang={lang} go={go}/>,"kids-quiz-live":<KidsQuizLive lang={lang} go={go}/>,"kids-nasheeds":<KidsNasheedsLive lang={lang} go={go}/>,"offline-backup":<OfflineBackupCenter lang={lang} go={go}/>,"islamic-calendar":<IslamicCalendar lang={lang} go={go}/>,"fasting-center":<FastingCenter lang={lang} go={go}/>,"ramadan-center":<RamadanCenter lang={lang} go={go}/>,"smart-khatmah":<SmartKhatmah lang={lang} go={go}/>,"memorization-center":<MemorizationCenter lang={lang} go={go}/>,"names-live":<LiveNamesOfAllah lang={lang} go={go}/>,"hisn-center":<LiveSunnahAdhkar go={go}/>,"jumuah-center":<JumuahCenter lang={lang} go={go}/>,"worship-times":<LiveWorshipTimes go={go}/>,"parental-controls":<ParentalControls lang={lang} go={go}/>,"privacy-lock":<PrivacyLock lang={lang} go={go}/>,"card-maker":<CardMaker lang={lang} go={go}/>,"islamic-search":<UniversalIslamicSearch lang={lang} go={go}/>,"saved-library":<SavedLibrary lang={lang} go={go}/>,"quran-analytics":<SmartQuranAnalytics lang={lang} go={go}/>,"quran-intelligence":<QuranIntelligenceHub lang={lang} go={go}/>,"quran-topics":<QuranTopicExplorer lang={lang} go={go}/>,"quran-compare":<QuranWordCompare lang={lang} go={go}/>,"quran-entities":<QuranEntityMap lang={lang} go={go}/>,"quran-roots":<QuranRootExplorer lang={lang} go={go}/>,"tadabbur-ayah":<TadabburAyah lang={lang} go={go}/>,"my-day":<SmartMyDay lang={lang} go={go}/>,"quran-player":<LiveQuranAudio lang={lang} go={go}/>,"nine-books":<LiveHadithHub go={go}/>,"tafsir-library":<LiveTafsir lang={lang} go={go}/>,
  "notes":<NotesNotebook lang={lang} go={close}/>,"accounts":<AccountsNotebook lang={lang} go={close}/>,"profiles":<UnifiedProfiles lang={lang} go={close}/>,"qibla":<QiblaCompass lang={lang} go={close}/>,"mosques":<NearbyMosques lang={lang} go={close}/>,"zakat":<ZakatCenter lang={lang} go={close}/>,"manasik":<ManasikCenter lang={lang} go={close}/>,"tasbeeh":<SmartTasbeeh lang={lang} go={close}/>,"guide":<PrayerWuduGuide lang={lang} go={close}/>,"alerts":<NativeDailyCenter lang={lang} go={close}/>,"adhan-audio":<AdhanAudioSettings lang={lang} go={close}/>,"widget":<WidgetLockPreview lang={lang} go={close}/>,
 };
 const base=children||<SakinahSevenDock/>;
 if(locked)return <LockGate onUnlock={()=>setLocked(false)}/>;
 if(blocked)return <Blocked text={blocked} close={()=>setBlocked("")}/>;
 return <div style={{minHeight:"100vh"}}>{feature?(screens[feature]||base):base}</div>;
}
