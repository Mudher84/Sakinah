import React,{useRef,useState} from "react";
import MergedSakinah from "./MergedSakinah.jsx";
import {LiveQuranAudio} from "./liveAudio.jsx";
import {LiveHadithHub} from "./liveHadith.jsx";

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
 const items=[["home","⌂","الرئيسية"],["quran","▥","القرآن"],["quran-player","♪","المشغل"],["hadith","▤","الأحاديث"],["myday","☼","يومي"],["discover","⌕","اكتشف"],["profile","♙","أنا"]];
 return <div style={{position:"relative",minHeight:"100vh",background:C.ivory,color:C.ink}} dir="rtl">
  <style>{`
   .sakinah-seven-base nav[aria-label="Sakinah primary"]{display:none!important}
   .sakinah-seven-page{position:relative;min-height:100vh;padding-bottom:84px}
   .sakinah-seven-dock{position:fixed;left:50%;transform:translateX(-50%);bottom:10px;z-index:70000;width:min(560px,calc(100vw - 14px));display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:2px;padding:7px;border:1px solid rgba(255,255,255,.46);border-radius:25px;background:rgba(246,243,236,.80);-webkit-backdrop-filter:blur(24px) saturate(145%);backdrop-filter:blur(24px) saturate(145%);box-shadow:0 12px 34px rgba(16,16,15,.10),inset 0 1px 0 rgba(255,255,255,.52)}
   .sakinah-seven-dock button{border:0;border-radius:16px;padding:10px 2px;background:transparent;color:rgba(16,16,15,.58);font-family:inherit;display:grid;place-items:center;min-width:0;min-height:54px}
   .sakinah-seven-dock button.active{background:rgba(255,255,255,.34);color:#173B57;box-shadow:inset 0 0 0 1px rgba(181,154,98,.12)}
   .sakinah-seven-dock .dockIcon{font-size:32px;line-height:1;color:inherit;display:block}
   @media(max-width:430px){.sakinah-seven-dock{bottom:7px;width:calc(100vw - 10px);padding:6px 4px}.sakinah-seven-dock button{padding:8px 1px;min-height:50px}.sakinah-seven-dock .dockIcon{font-size:30px}}
  `}</style>
  <div className="sakinah-seven-page">
   {panel==="quran-player"?<LiveQuranAudio lang={lang} go={()=>openOld("quran")}/>:panel==="hadith"?<LiveHadithHub go={()=>openOld("discover")}/>:<div ref={baseRef} className="sakinah-seven-base"><MergedSakinah/></div>}
  </div>
  <nav className="sakinah-seven-dock" aria-label="Sakinah seven primary">
   {items.map(([id,icon,label])=>{const active=panel===id;return <button key={id} aria-label={label} title={label} className={active?"active":""} onClick={()=>id==="quran-player"||id==="hadith"?setPanel(id):openOld(id)}><span className="dockIcon">{icon}</span></button>})}
  </nav>
 </div>;
}
