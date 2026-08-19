import React,{useEffect,useState} from "react";
import SakinahDevotionLayer from "./SakinahDevotionLayer.jsx";
import {NativeDailyCenter,WidgetLockPreview} from "./nativeDaily.jsx";
import {AdhanAudioSettings} from "./adhanAudioSettings.jsx";

export default function SakinahNativeReadyLayer(){
 const [tool,setTool]=useState(null);
 const lang="ar";
 useEffect(()=>{const h=e=>{const t=e.detail;if(["alerts","widget","adhan-audio"].includes(t))setTool(t)};window.addEventListener("sakinah:native",h);return()=>window.removeEventListener("sakinah:native",h)},[]);
 return <div style={{minHeight:"100vh"}}>
  {!tool&&<SakinahDevotionLayer/>}
  {tool==="alerts"&&<NativeDailyCenter lang={lang} go={()=>setTool(null)}/>} 
  {tool==="widget"&&<WidgetLockPreview lang={lang} go={()=>setTool(null)}/>} 
  {tool==="adhan-audio"&&<AdhanAudioSettings lang={lang} go={()=>setTool(null)}/>} 
 </div>;
}
