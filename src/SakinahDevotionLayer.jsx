import React,{useState} from "react";
import SakinahCompletionLayer from "./SakinahCompletionLayer.jsx";
import {DevotionHub,AdhanReminderCenter,SmartTasbeeh,UnifiedProfiles,PrayerWuduGuide} from "./devotionSuite.jsx";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62"};
export default function SakinahDevotionLayer(){
 const [tool,setTool]=useState(null),[lang,setLang]=useState("ar");
 const go=t=>setTool(t);
 const screens={hub:<DevotionHub lang={lang} go={go}/>,adhan:<AdhanReminderCenter lang={lang} go={()=>go("hub")}/>,tasbeeh:<SmartTasbeeh lang={lang} go={()=>go("hub")}/>,profiles:<UnifiedProfiles lang={lang} go={()=>go("hub")}/>,guide:<PrayerWuduGuide lang={lang} go={()=>go("hub")}/>};
 return <div style={{minHeight:"100vh"}}>
  {!tool&&<SakinahCompletionLayer/>}
  {tool&&screens[tool]}
  {tool&&<button onClick={()=>setLang(v=>v==="ar"?"en":"ar")} style={{position:"fixed",top:14,right:14,zIndex:60000,width:40,height:40,borderRadius:14,border:"1px solid rgba(16,16,15,.08)",background:C.ivory,color:C.ink,fontWeight:700}}>{lang==="ar"?"EN":"ع"}</button>}
  {!tool&&<button onClick={()=>go("hub")} title={lang==="ar"?"العبادة اليومية":"Daily Devotion"} style={{position:"fixed",left:66,bottom:86,zIndex:13000,width:48,height:48,borderRadius:17,border:"1px solid rgba(16,16,15,.08)",background:"linear-gradient(145deg,#B59A62,#8F7440)",color:"white",boxShadow:"0 10px 28px rgba(181,154,98,.24)",fontSize:20}}>◎</button>}
 </div>;
}
