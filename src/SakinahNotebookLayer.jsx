import React,{useEffect,useState} from "react";
import MergedSakinah from "./MergedSakinah.jsx";
import {NotesNotebook,AccountsNotebook} from "./personalNotebooks.jsx";
export default function SakinahNotebookLayer(){
 const [tool,setTool]=useState(null),[lang,setLang]=useState("ar");
 useEffect(()=>{const h=e=>{if(["notes","accounts"].includes(e.detail))setTool(e.detail)};window.addEventListener("sakinah:notebook",h);return()=>window.removeEventListener("sakinah:notebook",h)},[]);
 const go=()=>setTool(null);
 return <div style={{minHeight:"100vh"}}>
  {!tool&&<MergedSakinah/>}
  {tool==="notes"&&<NotesNotebook lang={lang} go={go}/>} 
  {tool==="accounts"&&<AccountsNotebook lang={lang} go={go}/>} 
  {tool&&<button onClick={()=>setLang(v=>v==="ar"?"en":"ar")} style={{position:"fixed",top:14,right:14,zIndex:20001,width:40,height:40,borderRadius:14,border:"1px solid rgba(16,16,15,.08)",background:"#F6F3EC",fontWeight:700}}>{lang==="ar"?"EN":"ع"}</button>}
 </div>;
}
