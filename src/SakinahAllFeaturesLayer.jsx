import React,{useEffect,useState} from "react";
import SakinahSevenDock from "./SakinahSevenDock.jsx";
import {TrustedDailyHub,QuranicDuasHub,SmartQuranicAdhkar,SourcedSeerahStories} from "./trustedDaily.jsx";
import {KidsWorldHub,KidsQuranTeacherLive,KidsQuizLive} from "./kidsWorld.jsx";
import {OfflineBackupCenter} from "./offlineBackup.jsx";
import {DailyReflection} from "./dailyReflection.jsx";
import {LiveNamesOfAllah} from "./verifiedIslamic.jsx";
import {LiveHadithHub} from "./liveHadith.jsx";
import {DailyToolsHub,IslamicCalendar,FastingCenter,RamadanCenter,SmartKhatmah,MemorizationCenter,HisnCenter,JumuahCenter,WorshipTimes,ParentalControls,PrivacyLock,CardMaker} from "./dailySuite.jsx";
import {SmartMyDay} from "./smartMyDay.jsx";
import {UniversalIslamicSearch,SavedLibrary} from "./searchLibrary.jsx";
import {SmartQuranAnalytics} from "./quranAnalytics.jsx";
import {QuranIntelligenceHub,QuranTopicExplorer,QuranWordCompare,QuranEntityMap,QuranRootExplorer,TadabburAyah} from "./quranInsights.jsx";
import {LiveQuranAudio} from "./liveAudio.jsx";

export default function SakinahAllFeaturesLayer({children}){
 const [feature,setFeature]=useState(null);
 const lang="ar";
 useEffect(()=>{const h=e=>setFeature(e.detail||null);window.addEventListener("sakinah:feature",h);return()=>window.removeEventListener("sakinah:feature",h)},[]);
 const go=to=>{
  const allowed=new Set(["daily-tools","daily-reflection","trusted-daily","quranic-duas","smart-quranic-adhkar","sourced-seerah","kids-world","kids-home","kids-quran-live","kids-quiz-live","kids-sourced-stories","offline-backup","islamic-calendar","fasting-center","ramadan-center","smart-khatmah","memorization-center","names-live","hisn-center","jumuah-center","worship-times","parental-controls","privacy-lock","card-maker","islamic-search","saved-library","quran-analytics","quran-intelligence","quran-topics","quran-compare","quran-entities","quran-roots","tadabbur-ayah","my-day","quran-player","nine-books"]);
  setFeature(allowed.has(to)?to:null);
 };
 const screens={
  "daily-tools":<DailyToolsHub lang={lang} go={go}/>,"daily-reflection":<DailyReflection lang={lang} go={go}/>,"trusted-daily":<TrustedDailyHub lang={lang} go={go}/>,"quranic-duas":<QuranicDuasHub lang={lang} go={go}/>,"smart-quranic-adhkar":<SmartQuranicAdhkar lang={lang} go={go}/>,"sourced-seerah":<SourcedSeerahStories lang={lang} go={go}/>,"kids-sourced-stories":<SourcedSeerahStories lang={lang} go={go} kids/>,"kids-world":<KidsWorldHub lang={lang} go={go}/>,"kids-home":<KidsWorldHub lang={lang} go={go}/>,"kids-quran-live":<KidsQuranTeacherLive lang={lang} go={go}/>,"kids-quiz-live":<KidsQuizLive lang={lang} go={go}/>,"offline-backup":<OfflineBackupCenter lang={lang} go={go}/>,"islamic-calendar":<IslamicCalendar lang={lang} go={go}/>,"fasting-center":<FastingCenter lang={lang} go={go}/>,"ramadan-center":<RamadanCenter lang={lang} go={go}/>,"smart-khatmah":<SmartKhatmah lang={lang} go={go}/>,"memorization-center":<MemorizationCenter lang={lang} go={go}/>,"names-live":<LiveNamesOfAllah lang={lang} go={go}/>,"hisn-center":<HisnCenter lang={lang} go={go}/>,"jumuah-center":<JumuahCenter lang={lang} go={go}/>,"worship-times":<WorshipTimes lang={lang} go={go}/>,"parental-controls":<ParentalControls lang={lang} go={go}/>,"privacy-lock":<PrivacyLock lang={lang} go={go}/>,"card-maker":<CardMaker lang={lang} go={go}/>,"islamic-search":<UniversalIslamicSearch lang={lang} go={go}/>,"saved-library":<SavedLibrary lang={lang} go={go}/>,"quran-analytics":<SmartQuranAnalytics lang={lang} go={go}/>,"quran-intelligence":<QuranIntelligenceHub lang={lang} go={go}/>,"quran-topics":<QuranTopicExplorer lang={lang} go={go}/>,"quran-compare":<QuranWordCompare lang={lang} go={go}/>,"quran-entities":<QuranEntityMap lang={lang} go={go}/>,"quran-roots":<QuranRootExplorer lang={lang} go={go}/>,"tadabbur-ayah":<TadabburAyah lang={lang} go={go}/>,"my-day":<SmartMyDay lang={lang} go={go}/>,"quran-player":<LiveQuranAudio lang={lang} go={go}/>,"nine-books":<LiveHadithHub go={go}/>,
 };
 const base=children||<SakinahSevenDock/>;
 return <div style={{minHeight:"100vh"}}>{feature?(screens[feature]||base):base}</div>;
}
