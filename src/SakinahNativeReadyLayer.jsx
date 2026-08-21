import React,{useEffect,useState} from "react";
import SakinahDevotionLayer from "./SakinahDevotionLayer.jsx";
import {NativeDailyCenter} from "./nativeDaily.jsx";
import WidgetCenter from "./WidgetCenter.jsx";
import {AdhanAudioSettings} from "./adhanAudioSettings.jsx";

export default function SakinahNativeReadyLayer(){
 const [tool,setTool]=useState(null);
 const lang="ar";
 useEffect(()=>{
  const h=e=>{const t=e.detail;if(["alerts","widget","adhan-audio"].includes(t))setTool(t)};
  const root=()=>setTool(null);
  window.addEventListener("sakinah:native",h);
  window.addEventListener("sakinah:global-root",root);
  return()=>{window.removeEventListener("sakinah:native",h);window.removeEventListener("sakinah:global-root",root)};
 },[]);
 const base=<SakinahDevotionLayer/>;
 return <div style={{minHeight:"100vh"}}>
  {!tool&&base}
  {tool==="alerts"&&<NativeDailyCenter lang={lang} go={()=>setTool(null)}/>} 
  {tool==="widget"&&<WidgetCenter lang={lang}/>} 
  {tool==="adhan-audio"&&<AdhanAudioSettings lang={lang} go={()=>setTool(null)}/>} 
 </div>;
}
