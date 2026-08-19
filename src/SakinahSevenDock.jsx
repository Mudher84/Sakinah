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
   .sakinah-seven-page{position:relative;min-height:100vh;padding-bottom:92px}
   .sakinah-seven-dock{position:fixed;left:50%;transform:translateX(-50%);bottom:10px;z-index:70000;width:min(560px,calc(100vw - 14px));display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:2px;padding:7px;border:1px solid rgba(16,16,15,.08);border-radius:25px;background:rgba(246,243,236,.96);backdrop-filter:blur(20px);box-shadow:0 14px 40px rgba(16,16,15,.13)}
   .sakinah-seven-dock button{border:0;border-radius:16px;padding:8px 2px 7px;background:transparent;color:rgba(16,16,15,.58);font-family:inherit;display:grid;place-items:center;gap:4px;min-width:0}
   .sakinah-seven-dock button.active{background:rgba(181,154,98,.15);color:#173B57}
   .sakinah-seven-dock .dockIcon{font-size:16px;line-height:1;color:inherit}
   .sakinah-seven-dock .dockLabel{font-size:8.4px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
   @media(max-width:430px){.sakinah-seven-dock{bottom:7px;width:calc(100vw - 10px);padding:6px 4px}.sakinah-seven-dock button{padding:7px 1px 6px}.sakinah-seven-dock .dockLabel{font-size:7.5px}}
  `}</style>
  <div className="sakinah-seven-page">
   {panel==="quran-player"?<LiveQuranAudio lang={lang} go={()=>openOld("quran")}/>:panel==="hadith"?<LiveHadithHub go={()=>openOld("discover")}/>:<div ref={baseRef} className="sakinah-seven-base"><MergedSakinah/></div>}
  </div>
  <nav className="sakinah-seven-dock" aria-label="Sakinah seven primary">
   {items.map(([id,icon,label])=>{const active=panel===id;return <button key={id} className={active?"active":""} onClick={()=>id==="quran-player"||id==="hadith"?setPanel(id):openOld(id)}><span className="dockIcon">{icon}</span><span className="dockLabel">{label}</span></button>})}
  </nav>
 </div>;
}
