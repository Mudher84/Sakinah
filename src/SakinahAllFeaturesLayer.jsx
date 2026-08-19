import React,{useEffect,useState} from "react";
import SakinahSevenDock from "./SakinahSevenDock.jsx";
import {TrustedDailyHub,QuranicDuasHub,SmartQuranicAdhkar} from "./trustedDaily.jsx";
import SeerahStoriesCenter from "./SeerahStoriesCenter.jsx";
import {KidsWorldHub,KidsQuizLive} from "./kidsWorld.jsx";
import KidsQuranStories from "./KidsQuranStories.jsx";
import QuranTeacherLive from "./QuranTeacherLive.jsx";
import {KidsNasheedsLive} from "./kidsNasheeds.jsx";
import {OfflineBackupCenter} from "./offlineBackup.jsx";
import {DailyReflection} from "./dailyReflection.jsx";
import {LiveNamesOfAllah} from "./verifiedIslamic.jsx";
import {LiveHadithHub} from "./liveHadith.jsx";
import {LiveTafsir} from "./liveTafsir.jsx";
import {LiveSunnahAdhkar} from "./liveSunnahAdhkar.jsx";
import {LiveWorshipTimes} from "./liveWorshipTimes.jsx";
import {DailyToolsHub,IslamicCalendar,FastingCenter,RamadanCenter,SmartKhatmah,MemorizationCenter,JumuahCenter,ParentalControls,PrivacyLock} from "./dailySuite.jsx";
import PremiumCardMaker from "./PremiumCardMaker.jsx";
import {SmartMyDay} from "./smartMyDay.jsx";
import {UniversalIslamicSearch,SavedLibrary} from "./searchLibrary.jsx";
import {SmartQuranAnalytics} from "./quranAnalytics.jsx";
import {QuranIntelligenceHub,QuranTopicExplorer,QuranWordCompare,QuranEntityMap,QuranRootExplorer,TadabburAyah} from "./quranInsights.jsx";
import {LiveQuranAudio} from "./liveAudio.jsx";
import {NotesNotebook,AccountsNotebook} from "./personalNotebooks.jsx";
import {QiblaCompass,NearbyMosques,ZakatCenter,ManasikCenter} from "./worshipUtilities.jsx";
import {UnifiedProfiles} from "./devotionSuite.jsx";
import PrayerLearningCenter from "./PrayerLearningCenter.jsx";
import ModernTasbeeh from "./ModernTasbeeh.jsx";
import {NativeDailyCenter} from "./nativeDaily.jsx";
import WidgetCenter from "./WidgetCenter.jsx";
import {AdhanAudioSettings} from "./adhanAudioSettings.jsx";

const CLOSE_ROUTES=new Set([null,"","app","home","discover","profile","me","profiles-center"]);
const ALLOWED=new Set(["daily-tools","daily-reflection","trusted-daily","quranic-duas","smart-quranic-adhkar","sourced-seerah","kids-world","kids-home","kids-quran-live","kids-quiz-live","kids-nasheeds","kids-sourced-stories","offline-backup","islamic-calendar","fasting-center","ramadan-center","smart-khatmah","memorization-center","names-live","hisn-center","jumuah-center","worship-times","parental-controls","privacy-lock","card-maker","islamic-search","saved-library","quran-analytics","quran-intelligence","quran-topics","quran-compare","quran-entities","quran-roots","tadabbur-ayah","my-day","quran-player","quran-teacher","nine-books","tafsir-library","notes","accounts","profiles","qibla","mosques","zakat","manasik","tasbeeh","guide","alerts","adhan-audio","widget"]);

export default function SakinahAllFeaturesLayer({children}){
 const [feature,setFeature]=useState(null);
 const lang="ar";
 const open=to=>{
  if(CLOSE_ROUTES.has(to)){setFeature(null);return}
  if(to==="quran-home")to="quran-intelligence";
  if(to==="quran-search")to="islamic-search";
  if(to==="live-names")to="names-live";
  if(to==="dua-library")to="quranic-duas";
  setFeature(ALLOWED.has(to)?to:null);
 };
 useEffect(()=>{const h=e=>open(e.detail||null);window.addEventListener("sakinah:feature",h);return()=>window.removeEventListener("sakinah:feature",h)},[]);
 useEffect(()=>{const h=()=>setFeature(null);window.addEventListener("sakinah-profile-change",h);window.addEventListener("sakinah:global-root",h);return()=>{window.removeEventListener("sakinah-profile-change",h);window.removeEventListener("sakinah:global-root",h)}},[]);
 const close=()=>setFeature(null),go=open;
 const screens={
  "daily-tools":<DailyToolsHub lang={lang} go={go}/>,"daily-reflection":<DailyReflection lang={lang} go={go}/>,"trusted-daily":<TrustedDailyHub lang={lang} go={go}/>,"quranic-duas":<QuranicDuasHub lang={lang} go={go}/>,"smart-quranic-adhkar":<SmartQuranicAdhkar lang={lang} go={go}/>,"sourced-seerah":<SeerahStoriesCenter/>,"kids-sourced-stories":<KidsQuranStories go={go}/>,"kids-world":<KidsWorldHub lang={lang} go={go}/>,"kids-home":<KidsWorldHub lang={lang} go={go}/>,"kids-quran-live":<QuranTeacherLive go={go} back="kids-home"/>,"quran-teacher":<QuranTeacherLive go={go} learningOnly back="quran-player"/>,"kids-quiz-live":<KidsQuizLive lang={lang} go={go}/>,"kids-nasheeds":<KidsNasheedsLive lang={lang} go={go}/>,"offline-backup":<OfflineBackupCenter lang={lang} go={go}/>,"islamic-calendar":<IslamicCalendar lang={lang} go={go}/>,"fasting-center":<FastingCenter lang={lang} go={go}/>,"ramadan-center":<RamadanCenter lang={lang} go={go}/>,"smart-khatmah":<SmartKhatmah lang={lang} go={go}/>,"memorization-center":<MemorizationCenter lang={lang} go={go}/>,"names-live":<LiveNamesOfAllah lang={lang} go={go}/>,"hisn-center":<LiveSunnahAdhkar go={go}/>,"jumuah-center":<JumuahCenter lang={lang} go={go}/>,"worship-times":<LiveWorshipTimes go={go}/>,"parental-controls":<ParentalControls lang={lang} go={go}/>,"privacy-lock":<PrivacyLock lang={lang} go={go}/>,"card-maker":<PremiumCardMaker lang={lang} go={go}/>,"islamic-search":<UniversalIslamicSearch lang={lang} go={go}/>,"saved-library":<SavedLibrary lang={lang} go={go}/>,"quran-analytics":<SmartQuranAnalytics lang={lang} go={go}/>,"quran-intelligence":<QuranIntelligenceHub lang={lang} go={go}/>,"quran-topics":<QuranTopicExplorer lang={lang} go={go}/>,"quran-compare":<QuranWordCompare lang={lang} go={go}/>,"quran-entities":<QuranEntityMap lang={lang} go={go}/>,"quran-roots":<QuranRootExplorer lang={lang} go={go}/>,"tadabbur-ayah":<TadabburAyah lang={lang} go={go}/>,"my-day":<SmartMyDay lang={lang} go={go}/>,"quran-player":<LiveQuranAudio lang={lang} go={go}/>,"nine-books":<LiveHadithHub go={go}/>,"tafsir-library":<LiveTafsir lang={lang} go={go}/>,"notes":<NotesNotebook lang={lang} go={close}/>,"accounts":<AccountsNotebook lang={lang} go={close}/>,"profiles":<UnifiedProfiles lang={lang} go={close}/>,"qibla":<QiblaCompass lang={lang} go={close}/>,"mosques":<NearbyMosques lang={lang} go={close}/>,"zakat":<ZakatCenter lang={lang} go={close}/>,"manasik":<ManasikCenter lang={lang} go={close}/>,"tasbeeh":<ModernTasbeeh lang={lang} go={close}/>,"guide":<PrayerLearningCenter/>,"alerts":<NativeDailyCenter lang={lang} go={close}/>,"adhan-audio":<AdhanAudioSettings lang={lang} go={close}/>,"widget":<WidgetCenter lang={lang}/>
 };
 if(!feature)return children||<SakinahSevenDock/>;
 return <div className="global-feature-shell" style={{minHeight:"100vh",position:"relative"}} dir="rtl">{screens[feature]||null}</div>;
}
