import React,{useEffect,useRef,useState} from "react";
const C={ivory:"#F6F3EC",ink:"#26343B",lapis:"#173B57",gold:"#B59A62"};
const DB="sakinah-kids-audio",STORE="nasheeds";
function openDb(){return new Promise((ok,fail)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:"id",autoIncrement:true})};r.onsuccess=()=>ok(r.result);r.onerror=()=>fail(r.error)})}
async function all(){const db=await openDb();return new Promise((ok,fail)=>{const tx=db.transaction(STORE,"readonly"),r=tx.objectStore(STORE).getAll();r.onsuccess=()=>ok(r.result||[]);r.onerror=()=>fail(r.error)})}
async function addFiles(files){const db=await openDb();return Promise.all([...files].map(file=>new Promise((ok,fail)=>{const tx=db.transaction(STORE,"readwrite"),r=tx.objectStore(STORE).add({name:file.name,type:file.type||"audio/*",size:file.size,blob:file,createdAt:Date.now()});r.onsuccess=()=>ok(r.result);r.onerror=()=>fail(r.error)})))}
async function del(id){const db=await openDb();return new Promise((ok,fail)=>{const tx=db.transaction(STORE,"readwrite"),r=tx.objectStore(STORE).delete(id);r.onsuccess=()=>ok();r.onerror=()=>fail(r.error)})}
export function KidsNasheedsLive({lang="ar",go}){
 const [rows,setRows]=useState([]),[current,setCurrent]=useState(null),[status,setStatus]=useState("");
 const urlRef=useRef(null);
 const reload=()=>all().then(setRows).catch(()=>setStatus(lang==="ar"?"تعذر فتح مكتبة الصوت المحلية":"Could not open local audio library"));
 useEffect(()=>{reload();return()=>{if(urlRef.current)URL.revokeObjectURL(urlRef.current)}},[]);
 const choose=x=>{if(urlRef.current)URL.revokeObjectURL(urlRef.current);const url=URL.createObjectURL(x.blob);urlRef.current=url;setCurrent({...x,url})};
 const upload=async e=>{const files=e.target.files;if(!files?.length)return;try{await addFiles(files);setStatus(lang==="ar"?"تمت إضافة الملفات وحفظها على الجهاز":"Files added and stored on this device");await reload()}catch{setStatus(lang==="ar"?"تعذر حفظ الملفات":"Could not save files")}e.target.value=""};
 const remove=async id=>{await del(id);if(current?.id===id){if(urlRef.current)URL.revokeObjectURL(urlRef.current);urlRef.current=null;setCurrent(null)}reload()};
 return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,display:"flex",flexDirection:"column"}} dir={lang==="ar"?"rtl":"ltr"}>
  <div style={{padding:"22px 22px 0"}}><button onClick={()=>go?.("kids-world")} style={{border:0,background:"transparent",fontFamily:"inherit",color:"inherit"}}>{lang==="ar"?"← الأطفال":"← Kids"}</button></div>
  <div style={{flex:1,overflowY:"auto",padding:"15px 22px 130px"}}>
   <div style={{fontFamily:"Fraunces,serif",fontSize:29}}>{lang==="ar"?"أناشيد الأطفال":"Kids Nasheeds"}</div>
   <div style={{fontSize:11.5,opacity:.48,lineHeight:1.75,marginTop:7}}>{lang==="ar"?"مكتبة صوتية خاصة على جهازك. أضف ملفات أناشيد مرخّصة أو مملوكة لك، وتبقى محفوظة محلياً.":"A private on-device audio library. Add licensed or owned nasheed files; they stay stored locally."}</div>
   <label style={{display:"block",marginTop:16,padding:13,borderRadius:15,background:C.lapis,color:"white",textAlign:"center",fontSize:12,fontWeight:650,cursor:"pointer"}}>{lang==="ar"?"إضافة ملفات صوتية":"Add audio files"}<input type="file" accept="audio/*" multiple hidden onChange={upload}/></label>
   {status&&<div style={{marginTop:10,fontSize:10.5,color:C.gold}}>{status}</div>}
   {current&&<div style={{marginTop:16,padding:16,borderRadius:20,background:"linear-gradient(135deg,#FFF0C9,#DFF6FF 65%,#F3E7FF)"}}><div style={{fontSize:12.5,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{current.name}</div><audio src={current.url} controls autoPlay style={{width:"100%",marginTop:12}}/></div>}
   <div style={{marginTop:14}}>{rows.length===0?<div style={{padding:"24px 0",textAlign:"center",opacity:.42,fontSize:11}}>{lang==="ar"?"لا توجد ملفات بعد":"No audio files yet"}</div>:rows.map(x=><div key={x.id} style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:8,alignItems:"center",padding:"12px 0",borderTop:"1px solid rgba(16,16,15,.07)"}}><button onClick={()=>choose(x)} style={{border:0,background:"transparent",fontFamily:"inherit",textAlign:lang==="ar"?"right":"left",color:"inherit",minWidth:0}}><b style={{fontSize:12.5,display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{x.name}</b><small style={{opacity:.42}}>{Math.max(1,Math.round((x.size||0)/1024/1024*10)/10)} MB</small></button><button onClick={()=>choose(x)} style={{border:"1px solid rgba(16,16,15,.08)",borderRadius:12,padding:"8px 10px",background:"transparent"}}>▶</button><button onClick={()=>remove(x.id)} style={{border:"1px solid rgba(164,77,60,.18)",borderRadius:12,padding:"8px 10px",background:"transparent",color:"#A44D3C"}}>×</button></div>)}</div>
  </div>
 </div>
}
