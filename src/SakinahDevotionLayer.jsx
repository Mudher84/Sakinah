import React,{useEffect,useState} from "react";
import SakinahCompletionLayer from "./SakinahCompletionLayer.jsx";
import {DevotionHub,AdhanReminderCenter,SmartTasbeeh,UnifiedProfiles,PrayerWuduGuide} from "./devotionSuite.jsx";

const C={ivory:"#F6F3EC",ink:"#10100F"};
export default function SakinahDevotionLayer(){
 const [tool,setTool]=useState(null),[lang,setLang]=useState("ar");
 const go=t=>setTool(t);
 useEffect(()=>{const h=e=>{const t=e.detail;if(["hub","adhan","tasbeeh","profiles","guide"].includes(t))setTool(t)};window.addEventListener("sakinah:devotion",h);return()=>window.removeEventListener("sakinah:devotion",h)},[]);
 const screens={hub:<DevotionHub lang={lang} go={go}/>,adhan:<AdhanReminderCenter lang={lang} go={()=>go("hub")}/>,tasbeeh:<SmartTasbeeh lang={lang} go={()=>go("hub")}/>,profiles:<UnifiedProfiles lang={lang} go={()=>go("hub")}/>,guide:<PrayerWuduGuide lang={lang} go={()=>go("hub")}/>};
 return <div style={{minHeight:"100vh"}}>{!tool&&<SakinahCompletionLayer/>}{tool&&screens[tool]}{tool&&<button onClick={()=>setLang(v=>v==="ar"?"en":"ar")} style={{position:"fixed",top:14,right:14,zIndex:60000,width:40,height:40,borderRadius:14,border:"1px solid rgba(16,16,15,.08)",background:C.ivory,color:C.ink,fontWeight:700}}>{lang==="ar"?"EN":"ع"}</button>}</div>;
}
