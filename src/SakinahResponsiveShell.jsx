import React,{useState} from "react";
import SakinahAllFeaturesLayer from "./SakinahAllFeaturesLayer.jsx";
import SakinahSevenDock from "./SakinahSevenDock.jsx";
import "./responsiveShell.css";

function emit(id){window.dispatchEvent(new CustomEvent("sakinah:feature",{detail:id}))}

function DockIcon({name}){
 const p={viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.35,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true"};
 if(name==="home")return <svg {...p}><path d="M4.4 10.9 12 4.75l7.6 6.15"/><path d="M6.35 9.9v8.85c0 .55.45 1 1 1h9.3c.55 0 1-.45 1-1V9.9"/><path d="M9.75 19.75v-5.15c0-.45.35-.8.8-.8h2.9c.45 0 .8.35.8.8v5.15"/></svg>;
 if(name==="quran")return <svg {...p}><path d="M4.1 5.45c2.9-.7 5.5-.18 7.9 1.55v12.05c-2.4-1.45-5-1.9-7.9-1.08z"/><path d="M19.9 5.45c-2.9-.7-5.5-.18-7.9 1.55v12.05c2.4-1.45 5-1.9 7.9-1.08z"/><path d="M12 7v12.05"/></svg>;
 if(name==="quran-player")return <svg {...p}><circle cx="12" cy="12" r="8.35"/><path d="M10.15 8.8c0-.55.6-.88 1.06-.58l4.68 3.03c.43.28.43.91 0 1.19l-4.68 3.03c-.46.3-1.06-.03-1.06-.58z"/></svg>;
 if(name==="hadith")return <svg {...p}><path d="M5.1 4.2h11.45a2.35 2.35 0 0 1 2.35 2.35v12.9H7.45A2.35 2.35 0 0 1 5.1 17.1z"/><path d="M7.4 4.2v15.25"/><path d="M10.1 8.15h5.65M10.1 11.45h5.65M10.1 14.75h3.95"/></svg>;
 if(name==="myday")return <svg {...p}><path d="M4.25 16.4h15.5"/><path d="M7 14.1a5.2 5.2 0 0 1 10 0"/><path d="M12 4.3v2.05M6.25 7.05l1.45 1.45M17.75 7.05 16.3 8.5M4.1 11.7h2.05M17.85 11.7h2.05"/></svg>;
 if(name==="discover")return <svg {...p}><circle cx="12" cy="12" r="8.2"/><path d="m14.95 8.85-1.65 4.45-4.45 1.65 1.65-4.45z"/></svg>;
 if(name==="profile")return <svg {...p}><circle cx="12" cy="8.05" r="3.05"/><path d="M6.1 19.45c.75-3.28 2.75-4.92 5.9-4.92s5.15 1.64 5.9 4.92"/></svg>;
 return null;
}

export default function SakinahResponsiveShell(){
 const [active,setActive]=useState("home");
 const goDock=id=>{
  setActive(id);
  window.dispatchEvent(new CustomEvent("sakinah:global-root"));
  emit("home");
  requestAnimationFrame(()=>window.dispatchEvent(new CustomEvent("muslimmirror:dock",{detail:id})));
 };
 const dock=["home","quran","quran-player","hadith","myday","discover","profile"];
 return <div className="sakinahResponsiveShell" dir="rtl">
  <div className="responsiveAppStage"><SakinahAllFeaturesLayer><SakinahSevenDock/></SakinahAllFeaturesLayer></div>
  <nav className="app-global-dock" aria-label="Muslim Mirror primary">{dock.map(id=><button key={id} className={active===id?"active":""} aria-label={id} onClick={()=>goDock(id)}><span className="dockIcon"><DockIcon name={id}/></span></button>)}</nav>
 </div>;
}
