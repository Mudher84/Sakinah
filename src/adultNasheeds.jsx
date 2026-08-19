import React,{useEffect,useRef,useState} from "react";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62"};
const DB="sakinah-adult-audio",STORE="nasheeds";
function openDb(){return new Promise((ok,fail)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:"id",autoIncrement:true})};r.onsuccess=()=>ok(r.result);r.onerror=()=>fail(r.error)})}
async function all(){const db=await openDb();return new Promise((ok,fail)=>{const tx=db.transaction(STORE,"readonly"),r=tx.objectStore(STORE).getAll();r.onsuccess=()=>ok(r.result||[]);r.onerror=()=>fail(r.error)})}
async function addFiles(files){const db=await openDb();return Promise.all([...files].map(file=>new Promise((ok,fail)=>{const tx=db.transaction(STORE,"readwrite"),r=tx.objectStore(STORE).add({name:file.name,type:file.type||"audio/*",size:file.size,blob:file,createdAt:Date.now()});r.onsuccess=()=>ok(r.result);r.onerror=()=>fail(r.error)})))}
async function del(id){const db=await openDb();return new Promise((ok,fail)=>{const tx=db.transaction(STORE,"readwrite"),r=tx.objectStore(STORE).delete(id);r.onsuccess=()=>ok();r.onerror=()=>fail(r.error)})}

export default function AdultNasheeds({go}){
 const [rows,setRows]=useState([]),[current,setCurrent]=useState(null),[status,setStatus]=useState("");
 const urlRef=useRef(null);
 const reload=()=>all().then(setRows).catch(()=>setStatus("تعذر فتح مكتبة الأناشيد"));
 useEffect(()=>{reload();return()=>{if(urlRef.current)URL.revokeObjectURL(urlRef.current)}},[]);
 const choose=x=>{if(urlRef.current)URL.revokeObjectURL(urlRef.current);const url=URL.createObjectURL(x.blob);urlRef.current=url;setCurrent({...x,url})};
 const upload=async e=>{const files=e.target.files;if(!files?.length)return;try{await addFiles(files);setStatus("تمت إضافة الأناشيد وحفظها على الجهاز");await reload()}catch{setStatus("تعذر حفظ الملفات")}e.target.value=""};
 const remove=async id=>{await del(id);if(current?.id===id){if(urlRef.current)URL.revokeObjectURL(urlRef.current);urlRef.current=null;setCurrent(null)}reload()};
 return <div style={{minHeight:"100vh",background:C.ivory,color:C.ink,padding:"26px 22px 130px"}} dir="rtl">
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,marginBottom:14}}><button onClick={()=>go?.("quran-player")} style={{height:42,padding:"0 15px",border:"1px solid rgba(16,16,15,.09)",borderRadius:999,background:"rgba(255,255,255,.62)",fontFamily:"inherit",color:C.ink,boxShadow:"0 7px 20px rgba(16,16,15,.06)",cursor:"pointer"}}>← رجوع</button><div style={{fontSize:10,letterSpacing:1.4,opacity:.4}}>SAKINAH · NASHEEDS</div></div>
  <div style={{fontFamily:"Fraunces,serif",fontSize:33,marginTop:6}}>الأناشيد</div>
  <div style={{fontSize:12,opacity:.5,lineHeight:1.8,marginTop:7}}>مكتبة أناشيد عامة مستقلة عن محتوى الأطفال. أضف الملفات المرخّصة أو المملوكة لك وتبقى محفوظة محلياً على جهازك.</div>
  <div style={{marginTop:20,borderRadius:26,padding:20,background:"linear-gradient(145deg,#17232a,#0b1318)",color:"white"}}>
   <div style={{fontSize:10,opacity:.5}}>المكتبة الصوتية</div><div style={{fontFamily:"Fraunces,serif",fontSize:24,marginTop:7}}>استمع بهدوء</div>
   {current?<><div style={{fontSize:14,marginTop:18,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{current.name}</div><audio src={current.url} controls autoPlay style={{width:"100%",marginTop:12}}/></>:<div style={{fontSize:11,opacity:.45,marginTop:18}}>اختر نشيداً من القائمة بالأسفل</div>}
  </div>
  <label style={{display:"block",marginTop:14,padding:13,borderRadius:15,background:C.lapis,color:"white",textAlign:"center",fontSize:12,fontWeight:650,cursor:"pointer"}}>إضافة أناشيد<input type="file" accept="audio/*" multiple hidden onChange={upload}/></label>
  {status&&<div style={{marginTop:10,fontSize:10.5,color:C.gold}}>{status}</div>}
  <div style={{marginTop:15}}>{rows.length===0?<div style={{padding:"30px 0",textAlign:"center",opacity:.4,fontSize:11}}>لا توجد أناشيد بعد</div>:rows.map(x=><div key={x.id} style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:8,alignItems:"center",padding:"13px 0",borderTop:"1px solid rgba(16,16,15,.07)"}}><button onClick={()=>choose(x)} style={{border:0,background:"transparent",fontFamily:"inherit",textAlign:"right",color:"inherit",minWidth:0}}><b style={{fontSize:16,display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{x.name}</b><small style={{opacity:.42}}>{Math.max(1,Math.round((x.size||0)/1024/1024*10)/10)} MB</small></button><button onClick={()=>choose(x)} style={{border:"1px solid rgba(16,16,15,.08)",borderRadius:12,padding:"8px 10px",background:"transparent"}}>▶</button><button onClick={()=>remove(x.id)} style={{border:"1px solid rgba(164,77,60,.18)",borderRadius:12,padding:"8px 10px",background:"transparent",color:"#A44D3C"}}>×</button></div>)}</div>
 </div>
}
