import React,{useEffect,useState} from "react";
import MergedSakinah from "./MergedSakinah.jsx";
import {LiveQuranAudio} from "./liveAudio.jsx";
import {LiveHadithHub} from "./liveHadith.jsx";
import QuranCenter from "./QuranCenter.jsx";
import AdultNasheeds from "./adultNasheeds.jsx";

const C={ivory:"#F6F3EC",ink:"#10100F"};

export default function SakinahSevenDock(){
 const [panel,setPanel]=useState("home");
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
 const isFullPanel=["quran","quran-player","adult-nasheeds","hadith"].includes(panel);
 return <div className="sakinah-seven-shell" onClickCapture={captureAudioHub} style={{position:"relative",minHeight:"100vh",background:C.ivory,color:C.ink}} dir="rtl">
  <style>{`.sakinah-seven-page{position:relative;min-height:100vh;padding-bottom:94px}.sakinah-seven-page.full-panel{position:fixed;inset:0;z-index:12000;padding-bottom:0;overflow:hidden;background:${C.ivory}}`}</style>
  <div className={`sakinah-seven-page${isFullPanel?" full-panel":""}`}>
   {panel==="quran"?<QuranCenter/>:panel==="quran-player"?<LiveQuranAudio lang={lang} go={to=>to==="quran-home"?setPanel("quran"):window.dispatchEvent(new CustomEvent("sakinah:feature",{detail:to}))}/>:panel==="adult-nasheeds"?<AdultNasheeds go={()=>setPanel("quran-player")}/>:panel==="hadith"?<LiveHadithHub go={()=>openOld("discover")}/>:<MergedSakinah/>}
  </div>
 </div>;
}
