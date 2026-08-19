import React,{useEffect,useState} from "react";
import SakinahSevenDock from "./SakinahSevenDock.jsx";
import {NotesNotebook,AccountsNotebook} from "./personalNotebooks.jsx";
export default function SakinahNotebookLayer(){
 const [tool,setTool]=useState(null),[lang]=useState("ar");
 useEffect(()=>{const h=e=>{if(["notes","accounts"].includes(e.detail))setTool(e.detail)};window.addEventListener("sakinah:notebook",h);return()=>window.removeEventListener("sakinah:notebook",h)},[]);
 const go=()=>setTool(null);
 return <div style={{minHeight:"100vh"}}>
  {!tool&&<SakinahSevenDock/>}
  {tool==="notes"&&<NotesNotebook lang={lang} go={go}/>} 
  {tool==="accounts"&&<AccountsNotebook lang={lang} go={go}/>} 
 </div>;
}
