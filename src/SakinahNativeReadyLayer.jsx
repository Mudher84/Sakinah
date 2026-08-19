import React,{useState} from "react";
import SakinahDevotionLayer from "./SakinahDevotionLayer.jsx";
import {NativeDailyCenter,WidgetLockPreview} from "./nativeDaily.jsx";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62"};
export default function SakinahNativeReadyLayer(){
 const [tool,setTool]=useState(null),[lang,setLang]=useState("ar");
 return <div style={{minHeight:"100vh"}}>
  {!tool&&<SakinahDevotionLayer/>}
  {tool==="alerts"&&<NativeDailyCenter lang={lang} go={()=>setTool(null)}/>} 
  {tool==="widget"&&<WidgetLockPreview lang={lang} go={()=>setTool(null)}/>} 
  {tool&&<button onClick={()=>setLang(v=>v==="ar"?"en":"ar")} style={{position:"fixed",top:14,right:14,zIndex:60000,width:40,height:40,borderRadius:14,border:"1px solid rgba(16,16,15,.08)",background:C.ivory,fontWeight:700,color:C.ink}}>{lang==="ar"?"EN":"ع"}</button>}
  {!tool&&<div style={{position:"fixed",left:12,bottom:144,zIndex:13000,display:"grid",gap:7}}><button onClick={()=>setTool("alerts")} title={lang==="ar"?"المؤذن والتنبيهات":"Adhan & Alerts"} style={{width:48,height:48,borderRadius:17,border:"1px solid rgba(16,16,15,.08)",background:"linear-gradient(145deg,#173B57,#0C293E)",color:"#E7D29B",boxShadow:"0 10px 28px rgba(23,59,87,.22)",fontSize:19}}>◔</button><button onClick={()=>setTool("widget")} title="Widget" style={{width:48,height:48,borderRadius:17,border:"1px solid rgba(16,16,15,.08)",background:"rgba(246,243,236,.96)",color:C.lapis,boxShadow:"0 8px 22px rgba(0,0,0,.10)",fontSize:18}}>▦</button></div>}
 </div>;
}
