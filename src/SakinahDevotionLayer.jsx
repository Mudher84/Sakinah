import React,{useEffect,useState} from "react";
import SakinahCompletionLayer from "./SakinahCompletionLayer.jsx";
import {DevotionHub,AdhanReminderCenter,SmartTasbeeh,UnifiedProfiles,PrayerWuduGuide} from "./devotionSuite.jsx";

export default function SakinahDevotionLayer(){
 const [tool,setTool]=useState(null);
 const lang="ar";
 const go=t=>setTool(t);
 useEffect(()=>{
  const h=e=>{const t=e.detail;if(["hub","adhan","tasbeeh","profiles","guide"].includes(t))setTool(t)};
  const root=()=>setTool(null);
  window.addEventListener("sakinah:devotion",h);
  window.addEventListener("sakinah:global-root",root);
  return()=>{window.removeEventListener("sakinah:devotion",h);window.removeEventListener("sakinah:global-root",root)};
 },[]);
 const screens={hub:<DevotionHub lang={lang} go={go}/>,adhan:<AdhanReminderCenter lang={lang} go={()=>go("hub")}/>,tasbeeh:<SmartTasbeeh lang={lang} go={()=>go("hub")}/>,profiles:<UnifiedProfiles lang={lang} go={()=>go("hub")}/>,guide:<PrayerWuduGuide lang={lang} go={()=>go("hub")}/>};
 return <div style={{minHeight:"100vh"}}>{!tool&&<SakinahCompletionLayer/>}{tool&&screens[tool]}</div>;
}
