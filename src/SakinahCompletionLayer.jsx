import React,{useState} from "react";
import SakinahNotebookLayer from "./SakinahNotebookLayer.jsx";
import {QiblaCompass,NearbyMosques,ZakatCenter,ManasikCenter} from "./worshipUtilities.jsx";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62"};
const btn={border:"1px solid rgba(16,16,15,.08)",borderRadius:18,padding:14,background:"rgba(255,255,255,.56)",fontFamily:"inherit",color:"inherit"};

function WorshipHub({lang,go}){
 const items=[["qibla","⌖","القبلة والبوصلة","Qibla & Compass"],["mosques","⌂","أقرب مسجد","Nearby Mosques"],["zakat","◈","ميزان الزكاة","Zakat Calculator"],["manasik","◌","مناسك الحج والعمرة","Hajj & Umrah"]];
 return <div style={{position:"fixed",inset:0,zIndex:30000,background:C.ivory,color:C.ink,overflowY:"auto",padding:"26px 22px 120px"}} dir={lang==="ar"?"rtl":"ltr"}>
  <button onClick={()=>go(null)} style={{...btn,border:0,padding:0,background:"transparent"}}>{lang==="ar"?"رجوع ←":"← Back"}</button>
  <div style={{fontFamily:"Fraunces,serif",fontSize:32,marginTop:17}}>{lang==="ar"?"خدمات العبادة":"Worship Utilities"}</div>
  <div style={{fontSize:11.5,opacity:.48,lineHeight:1.8,marginTop:7}}>{lang==="ar"?"أدوات عملية مرتبطة بالموقع والحسابات والمناسك.":"Practical tools for location, calculations and pilgrimage rites."}</div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:22}}>{items.map(([id,icon,ar,en],i)=><button key={id} onClick={()=>go(id)} style={{...btn,minHeight:130,textAlign:lang==="ar"?"right":"left",background:i===0?"linear-gradient(145deg,#173B57,#0C293E)":"rgba(255,255,255,.58)",color:i===0?"white":C.ink,boxShadow:"0 12px 30px rgba(16,16,15,.05)"}}><div style={{fontSize:26,color:i===0?"#E7D29B":C.gold}}>{icon}</div><div style={{fontSize:14,fontWeight:700,lineHeight:1.5,marginTop:20}}>{lang==="ar"?ar:en}</div></button>)}</div>
 </div>
}

export default function SakinahCompletionLayer(){
 const [tool,setTool]=useState(null),[lang,setLang]=useState("ar");
 const go=t=>setTool(t);
 const screens={hub:<WorshipHub lang={lang} go={go}/>,qibla:<QiblaCompass lang={lang} go={()=>go("hub")}/>,mosques:<NearbyMosques lang={lang} go={()=>go("hub")}/>,zakat:<ZakatCenter lang={lang} go={()=>go("hub")}/>,manasik:<ManasikCenter lang={lang} go={()=>go("hub")}/>};
 return <div style={{minHeight:"100vh"}}>
  {!tool&&<SakinahNotebookLayer/>}
  {tool&&screens[tool]}
  {tool&&<button onClick={()=>setLang(v=>v==="ar"?"en":"ar")} style={{position:"fixed",top:14,right:14,zIndex:40000,width:40,height:40,borderRadius:14,border:"1px solid rgba(16,16,15,.08)",background:C.ivory,fontWeight:700,color:C.ink}}>{lang==="ar"?"EN":"ع"}</button>}
  {!tool&&<button onClick={()=>go("hub")} title={lang==="ar"?"خدمات العبادة":"Worship Utilities"} style={{position:"fixed",left:12,bottom:86,zIndex:12000,width:48,height:48,borderRadius:17,border:"1px solid rgba(16,16,15,.08)",background:"linear-gradient(145deg,#173B57,#0C293E)",color:"#E7D29B",boxShadow:"0 10px 28px rgba(23,59,87,.22)",fontSize:20}}>⌖</button>}
 </div>;
}
