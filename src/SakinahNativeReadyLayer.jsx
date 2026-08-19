import React,{useEffect,useState} from "react";
import SakinahDevotionLayer from "./SakinahDevotionLayer.jsx";
import {NativeDailyCenter,WidgetLockPreview} from "./nativeDaily.jsx";
import {AdhanAudioSettings} from "./adhanAudioSettings.jsx";

const C={ivory:"#F6F3EC",ink:"#10100F"};
export default function SakinahNativeReadyLayer(){
 const [tool,setTool]=useState(null),[lang,setLang]=useState("ar");
 useEffect(()=>{const h=e=>{const t=e.detail;if(["alerts","widget","adhan-audio"].includes(t))setTool(t)};window.addEventListener("sakinah:native",h);return()=>window.removeEventListener("sakinah:native",h)},[]);
 return <div style={{minHeight:"100vh"}}>
  {!tool&&<SakinahDevotionLayer/>}
  {tool==="alerts"&&<NativeDailyCenter lang={lang} go={()=>setTool(null)}/>} 
  {tool==="widget"&&<WidgetLockPreview lang={lang} go={()=>setTool(null)}/>} 
  {tool==="adhan-audio"&&<AdhanAudioSettings lang={lang} go={()=>setTool(null)}/>} 
  {tool&&<button onClick={()=>setLang(v=>v==="ar"?"en":"ar")} style={{position:"fixed",top:14,right:14,zIndex:70000,width:40,height:40,borderRadius:14,border:"1px solid rgba(16,16,15,.08)",background:C.ivory,fontWeight:700,color:C.ink}}>{lang==="ar"?"EN":"ع"}</button>}
 </div>;
}
