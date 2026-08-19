import React,{useEffect,useRef,useState} from "react";
import MergedSakinah from "./MergedSakinah.jsx";
import {LiveQuranAudio} from "./liveAudio.jsx";
import {LiveHadithHub} from "./liveHadith.jsx";
import QuranCenter from "./QuranCenter.jsx";
import AdultNasheeds from "./adultNasheeds.jsx";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62"};
const OLD_INDEX={home:0,quran:1,myday:2,discover:3,profile:4};

export default function SakinahSevenDock(){
 const baseRef=useRef(null);
 const [panel,setPanel]=useState("home");
 const lang="ar";
 const openOld=(key)=>{
  setPanel(key);
  requestAnimationFrame(()=>{
   const nav=baseRef.current?.querySelector('nav[aria-label="Sakinah primary"]');
   const buttons=nav?[...nav.querySelectorAll("button")]:[];
   buttons[OLD_INDEX[key]]?.click();
  });
 };
 useEffect(()=>{
  const h=e=>{
   const id=e.detail;
   if(id==="quran-home"||id==="quran-intelligence"){setPanel("quran");return}
   if(id==="quran-player"){setPanel("quran-player");return}
   if(id==="adult-nasheeds"){setPanel("adult-nasheeds");return}
   if(id==="nine-books"){setPanel("hadith");return}
  };
  window.addEventListener("sakinah:feature",h);
  return()=>window.removeEventListener("sakinah:feature",h);
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
 const items=[["home","⌂","الرئيسية"],["quran","▥","القرآن"],["quran-player","♪","المشغل"],["hadith","▤","الأحاديث"],["myday","☼","يومي"],["discover","⌕","اكتشف"],["profile","♙","أنا"]];
 return <div className="sakinah-seven-shell" onClickCapture={captureAudioHub} style={{position:"relative",minHeight:"100vh",background:C.ivory,color:C.ink}} dir="rtl">
  <style>{`
   .sakinah-seven-base nav[aria-label="Sakinah primary"]{display:none!important}
   .sakinah-seven-page{position:relative;min-height:100vh;padding-bottom:94px}
   .sakinah-seven-shell .sakinah-seven-dock{position:fixed!important;left:50%!important;right:auto!important;top:auto!important;transform:translateX(-50%)!important;bottom:max(10px,env(safe-area-inset-bottom))!important;z-index:2147483000!important;width:min(560px,calc(100vw - 14px));display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr));gap:2px;padding:7px;border:1px solid rgba(255,255,255,.46);border-radius:25px;background:rgba(246,243,236,.80);-webkit-backdrop-filter:blur(24px) saturate(145%);backdrop-filter:blur(24px) saturate(145%);box-shadow:0 12px 34px rgba(16,16,15,.10),inset 0 1px 0 rgba(255,255,255,.52);visibility:visible!important;opacity:1!important;pointer-events:auto!important}
   .sakinah-seven-dock button{border:0;border-radius:16px;padding:10px 2px;background:transparent;color:rgba(16,16,15,.58);font-family:inherit;display:grid;place-items:center;min-width:0;min-height:54px}
   .sakinah-seven-dock button.active{background:rgba(255,255,255,.34);color:#173B57;box-shadow:inset 0 0 0 1px rgba(181,154,98,.12)}
   .sakinah-seven-dock .dockIcon{font-size:32px;line-height:1;color:inherit;display:block}
   @media(max-width:430px){.sakinah-seven-shell .sakinah-seven-dock{bottom:max(7px,env(safe-area-inset-bottom))!important;width:calc(100vw - 10px)}.sakinah-seven-dock{padding:6px 4px}.sakinah-seven-dock button{padding:8px 1px;min-height:50px}.sakinah-seven-dock .dockIcon{font-size:30px}}
  `}</style>
  <div className="sakinah-seven-page">
   {panel==="quran"?<QuranCenter/>:panel==="quran-player"?<LiveQuranAudio lang={lang} go={to=>to==="quran-home"?setPanel("quran"):window.dispatchEvent(new CustomEvent("sakinah:feature",{detail:to}))}/>:panel==="adult-nasheeds"?<AdultNasheeds go={()=>setPanel("quran-player")}/>:panel==="hadith"?<LiveHadithHub go={()=>openOld("discover")}/>:<div ref={baseRef} className="sakinah-seven-base"><MergedSakinah/></div>}
  </div>
  <nav className="sakinah-seven-dock" aria-label="Sakinah seven primary">
   {items.map(([id,icon,label])=>{const active=panel===id;return <button key={id} aria-label={label} title={label} className={active?"active":""} onClick={()=>id==="quran"||id==="quran-player"||id==="hadith"?setPanel(id):openOld(id)}><span className="dockIcon">{icon}</span></button>})}
  </nav>
 </div>;
}
