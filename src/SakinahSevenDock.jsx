import React,{useEffect,useState} from "react";
import MergedSakinah from "./MergedSakinah.jsx";
import {LiveQuranAudio} from "./liveAudio.jsx";
import {LiveHadithHub} from "./liveHadith.jsx";
import {LiveSurahList,LiveQuranReader} from "./liveCore.jsx";
import QuranToolsPremium from "./QuranToolsPremium.jsx";
import AdultNasheeds from "./adultNasheeds.jsx";

const C={ivory:"#F6F3EC",ink:"#10100F"};

export default function SakinahSevenDock(){
 const [panel,setPanel]=useState("home");
 const [surahId,setSurahId]=useState(1);
 const lang="ar";
 const openOld=key=>{
  setPanel(key);
  requestAnimationFrame(()=>window.dispatchEvent(new CustomEvent("muslimmirror:legacy-nav",{detail:key})));
 };
 const routeDock=id=>{
  if(id==="quran"){setPanel("quran");return}
  if(id==="quran-player"){setPanel("quran-player");return}
  if(id==="hadith"){setPanel("hadith");return}
  if(["home","myday","discover","profile"].includes(id)){openOld(id);return}
 };
 useEffect(()=>{
  const h=e=>{
   const id=e.detail;
   if(id==="quran-home"||id==="quran-intelligence"){setPanel("quran");return}
   if(id==="quran-player"){setPanel("quran-player");return}
   if(id==="adult-nasheeds"){setPanel("adult-nasheeds");return}
   if(id==="nine-books"){setPanel("hadith");return}
  };
  const dock=e=>routeDock(e.detail);
  window.addEventListener("sakinah:feature",h);
  window.addEventListener("muslimmirror:dock",dock);
  return()=>{window.removeEventListener("sakinah:feature",h);window.removeEventListener("muslimmirror:dock",dock)};
 },[]);
 const captureAudioHub=e=>{
  if(panel!=="quran-player")return;
  const btn=e.target.closest?.("button");
  if(!btn)return;
  const label=(btn.textContent||"").trim();
  if(label==="الأناشيد"){
   e.preventDefault();e.stopPropagation();setPanel("adult-nasheeds");
  }
 };
 const goFromQuran=to=>{
  if(to==="quran-home"){setPanel("quran");return}
  if(to==="quran-mushaf"){setPanel("quran-surahs");return}
  if(to==="quran-audio"||to==="quran-player"){setPanel("quran-player");return}
  window.dispatchEvent(new CustomEvent("sakinah:feature",{detail:to}));
 };
 const goMushaf=(to,payload={})=>{
  if(to==="quran-home"){setPanel("quran");return}
  if(to==="surah-list"){setPanel("quran-surahs");return}
  if(to==="reader"){
   const id=Math.min(114,Math.max(1,Number(payload?.surahId||1)||1));
   setSurahId(id);
   try{localStorage.setItem("sakinah-quran-last-read",JSON.stringify({surahId:id,savedAt:Date.now()}))}catch{}
   setPanel("quran-reader");
   return;
  }
  window.dispatchEvent(new CustomEvent("sakinah:feature",{detail:to}));
 };
 const isFullPanel=["quran","quran-surahs","quran-reader","quran-player","adult-nasheeds","hadith"].includes(panel);
 const isQuranTools=panel==="quran";
 return <div className="sakinah-seven-shell" onClickCapture={captureAudioHub} style={{position:"relative",minHeight:"100vh",background:C.ivory,color:C.ink}} dir="rtl">
  <style>{`.sakinah-seven-page{position:relative;min-height:100vh;padding-bottom:94px}.sakinah-seven-page.full-panel{position:fixed;inset:0;z-index:12000;padding-bottom:0;overflow:hidden;background:${C.ivory}}.sakinah-seven-page.full-panel.quran-tools-panel{overflow:visible!important}`}</style>
  <div className={`sakinah-seven-page${isFullPanel?" full-panel":""}${isQuranTools?" quran-tools-panel":""}`}>
   {panel==="quran"?<QuranToolsPremium go={goFromQuran}/>:panel==="quran-surahs"?<LiveSurahList lang={lang} go={goMushaf}/>:panel==="quran-reader"?<LiveQuranReader lang={lang} go={goMushaf} surahId={surahId}/>:panel==="quran-player"?<LiveQuranAudio lang={lang} go={to=>to==="quran-home"?setPanel("quran"):window.dispatchEvent(new CustomEvent("sakinah:feature",{detail:to}))}/>:panel==="adult-nasheeds"?<AdultNasheeds go={()=>setPanel("quran-player")}/>:panel==="hadith"?<div data-smart-my-day="true" data-hadith-react-safe="true" style={{position:"absolute",inset:0,overflow:"hidden",background:C.ivory}}><LiveHadithHub go={()=>openOld("discover")}/></div>:<MergedSakinah/>}
  </div>
 </div>;
}
