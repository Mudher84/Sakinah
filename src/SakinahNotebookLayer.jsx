import React,{useState} from "react";
import MergedSakinah from "./MergedSakinah.jsx";
import {NotesNotebook,AccountsNotebook} from "./personalNotebooks.jsx";
export default function SakinahNotebookLayer(){
 const [tool,setTool]=useState(null),[lang,setLang]=useState("ar");
 const go=()=>setTool(null);
 return <div style={{minHeight:"100vh"}}>
  {!tool&&<MergedSakinah/>}
  {tool==="notes"&&<NotesNotebook lang={lang} go={go}/>} 
  {tool==="accounts"&&<AccountsNotebook lang={lang} go={go}/>} 
  {tool&&<button onClick={()=>setLang(v=>v==="ar"?"en":"ar")} style={{position:"fixed",top:14,right:14,zIndex:20001,width:40,height:40,borderRadius:14,border:"1px solid rgba(16,16,15,.08)",background:"#F6F3EC",fontWeight:700}}>{lang==="ar"?"EN":"ع"}</button>}
  {!tool&&<div aria-label="personal notebooks" style={{position:"fixed",right:12,bottom:86,zIndex:9999,display:"grid",gap:7}}>
   <button onClick={()=>setTool("notes")} title="دفتر الملاحظات" style={{width:44,height:44,borderRadius:16,border:"1px solid rgba(16,16,15,.08)",background:"rgba(246,243,236,.96)",boxShadow:"0 8px 22px rgba(0,0,0,.10)",fontSize:18}}>✎</button>
   <button onClick={()=>setTool("accounts")} title="دفتر الحسابات" style={{width:44,height:44,borderRadius:16,border:"1px solid rgba(16,16,15,.08)",background:"rgba(246,243,236,.96)",boxShadow:"0 8px 22px rgba(0,0,0,.10)",fontSize:17}}>⌁</button>
  </div>}
 </div>;
}
