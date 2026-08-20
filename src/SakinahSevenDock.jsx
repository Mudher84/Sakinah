import React,{useEffect,useRef,useState} from "react";
import MergedSakinah from "./MergedSakinah.jsx";
import {LiveQuranAudio} from "./liveAudio.jsx";
import {LiveHadithHub} from "./liveHadith.jsx";
import QuranCenter from "./QuranCenter.jsx";
import AdultNasheeds from "./adultNasheeds.jsx";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62"};
const OLD_INDEX={home:0,quran:1,myday:2,discover:3,profile:4};

function DockIcon({name}){
 const p={width:25,height:25,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true"};
 if(name==="home")return <svg {...p}><path d="M3.5 10.6 12 3.8l8.5 6.8"/><path d="M5.7 9.7v10h12.6v-10"/><path d="M9.4 19.7v-5.4h5.2v5.4"/></svg>;
 if(name==="quran")return <svg {...p}><path d="M4.3 5.2c2.7-.9 5.2-.4 7.7 1.2v13c-2.5-1.6-5-2-7.7-1.2z"/><path d="M19.7 5.2c-2.7-.9-5.2-.4-7.7 1.2v13c2.5-1.6 5-2 7.7-1.2z"/><path d="M12 6.4v13"/></svg>;
 if(name==="quran-player")return <svg {...p}><circle cx="12" cy="12" r="8.7"/><path d="m10.3 8.9 5.1 3.1-5.1 3.1z"/></svg>;
 if(name==="hadith")return <svg {...p}><rect x="4.1" y="3.8" width="15.8" height="16.4" rx="2.6"/><path d="M8 8h8M8 11.7h8M8 15.4h5.4"/><path d="M7 3.8v16.4"/></svg>;
 if(name==="myday")return <svg {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2.8v2.1M12 19.1v2.1M2.8 12h2.1M19.1 12h2.1M5.5 5.5 7 7M17 17l1.5 1.5M18.5 5.5 17 7M7 17l-1.5 1.5"/></svg>;
 if(name==="discover")return <svg {...p}><circle cx="11" cy="11" r="6.4"/><path d="m15.8 15.8 4 4"/><path d="M11 8.4v5.2M8.4 11h5.2"/></svg>;
 if(name==="profile")return <svg {...p}><circle cx="12" cy="8.1" r="3.4"/><path d="M5.4 20c.7-3.6 3-5.5 6.6-5.5s5.9 1.9 6.6 5.5"/></svg>;
 return null;
}

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
 const items=[["home","الرئيسية"],["quran","القرآن"],["quran-player","المشغل"],["hadith","الأحاديث"],["myday","يومي"],["discover","اكتشف"],["profile","أنا"]];
 return <div className="sakinah-seven-shell" onClickCapture={captureAudioHub} style={{position:"relative",minHeight:"100vh",background:C.ivory,color:C.ink}} dir="rtl">
  <style>{`
   .sakinah-seven-base nav[aria-label="Sakinah primary"]{display:none!important}
   .sakinah-seven-page{position:relative;min-height:100vh;padding-bottom:94px}
   .sakinah-seven-shell .sakinah-seven-dock{position:fixed!important;left:50%!important;right:auto!important;top:auto!important;transform:translateX(-50%)!important;bottom:max(10px,env(safe-area-inset-bottom))!important;z-index:2147483000!important;width:min(560px,calc(100vw - 14px));display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px;padding:7px;border:1px solid rgba(255,255,255,.5);border-radius:26px;background:rgba(246,243,236,.82);-webkit-backdrop-filter:blur(26px) saturate(150%);backdrop-filter:blur(26px) saturate(150%);box-shadow:0 14px 38px rgba(16,16,15,.10),inset 0 1px 0 rgba(255,255,255,.6);visibility:visible!important;opacity:1!important;pointer-events:auto!important}
   .sakinah-seven-dock button{border:0;border-radius:17px;padding:9px 2px;background:transparent;color:rgba(16,16,15,.48);font-family:inherit;display:grid;place-items:center;min-width:0;min-height:54px;transition:transform .22s ease,background .22s ease,color .22s ease,box-shadow .22s ease}
   .sakinah-seven-dock button:active{transform:scale(.92)}
   .sakinah-seven-dock button.active{background:rgba(255,255,255,.5);color:#173B57;box-shadow:inset 0 0 0 1px rgba(181,154,98,.13),0 4px 12px rgba(23,59,87,.06)}
   .sakinah-seven-dock .dockIcon{width:28px;height:28px;display:grid;place-items:center;color:inherit}
   .sakinah-seven-dock .dockIcon svg{display:block;width:25px;height:25px}
   .sakinah-seven-dock button.active .dockIcon{transform:translateY(-1px)}
   @media(max-width:430px){.sakinah-seven-shell .sakinah-seven-dock{bottom:max(7px,env(safe-area-inset-bottom))!important;width:calc(100vw - 10px)}.sakinah-seven-dock{padding:6px 4px}.sakinah-seven-dock button{padding:8px 1px;min-height:50px}.sakinah-seven-dock .dockIcon{width:26px;height:26px}.sakinah-seven-dock .dockIcon svg{width:23px;height:23px}}
  `}</style>
  <div className="sakinah-seven-page">
   {panel==="quran"?<QuranCenter/>:panel==="quran-player"?<LiveQuranAudio lang={lang} go={to=>to==="quran-home"?setPanel("quran"):window.dispatchEvent(new CustomEvent("sakinah:feature",{detail:to}))}/>:panel==="adult-nasheeds"?<AdultNasheeds go={()=>setPanel("quran-player")}/>:panel==="hadith"?<LiveHadithHub go={()=>openOld("discover")}/>:<div ref={baseRef} className="sakinah-seven-base"><MergedSakinah/></div>}
  </div>
  <nav className="sakinah-seven-dock" aria-label="Sakinah seven primary">
   {items.map(([id,label])=>{const active=panel===id;return <button key={id} aria-label={label} title={label} className={active?"active":""} onClick={()=>id==="quran"||id==="quran-player"||id==="hadith"?setPanel(id):openOld(id)}><span className="dockIcon"><DockIcon name={id}/></span></button>})}
  </nav>
 </div>;
}
