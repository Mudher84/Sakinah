import React,{useEffect,useMemo,useState} from "react";

const isDev=()=>import.meta.env.DEV;

export default function DevMobileTest(){
 const [open,setOpen]=useState(false),[candidates,setCandidates]=useState([]),[selected,setSelected]=useState(""),[copied,setCopied]=useState(false),[error,setError]=useState("");
 useEffect(()=>{
  if(!open||!isDev())return;
  let alive=true;
  setError("");
  fetch("/__muslimmirror_mobile_test",{cache:"no-store"}).then(r=>r.ok?r.json():Promise.reject(new Error("endpoint"))).then(j=>{
   if(!alive)return;
   const list=Array.isArray(j?.candidates)?j.candidates:[];
   setCandidates(list);
   setSelected(x=>list.some(item=>item.url===x)?x:(list[0]?.url||""));
   if(!list.length)setError("لم أجد عنوان Wi‑Fi أو LAN حقيقي. تأكد أن اللابتوب والجوال على نفس الشبكة وأن Windows Firewall يسمح لـ Node/Vite على الشبكات الخاصة.");
  }).catch(()=>{
   if(!alive)return;
   setCandidates([]);setSelected("");setError("تعذر اكتشاف عنوان الشبكة المحلية. أعد تشغيل Vite ثم افتح نافذة الاختبار من جديد.");
  });
  return()=>{alive=false};
 },[open]);
 const selectedCandidate=useMemo(()=>candidates.find(item=>item.url===selected)||null,[candidates,selected]);
 const qr=useMemo(()=>selected?`https://quickchart.io/qr?size=320&margin=2&text=${encodeURIComponent(selected)}`:"",[selected]);
 if(!isDev())return null;
 const copy=async()=>{try{await navigator.clipboard.writeText(selected);setCopied(true);setTimeout(()=>setCopied(false),1400)}catch{}};
 return <>
  <button onClick={()=>setOpen(true)} aria-label="اختبار التصميم على الجوال" style={{position:"fixed",left:14,bottom:"calc(94px + env(safe-area-inset-bottom,0px))",zIndex:2147483000,border:"1px solid rgba(16,16,15,.10)",borderRadius:999,padding:"10px 13px",background:"rgba(255,253,248,.94)",backdropFilter:"blur(16px)",boxShadow:"0 10px 30px rgba(16,16,15,.14)",fontFamily:"inherit",fontSize:11,color:"#10100F",cursor:"pointer"}}>▦ اختبار على الجوال</button>
  {open&&<div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,zIndex:2147483001,background:"rgba(16,16,15,.42)",backdropFilter:"blur(8px)",display:"grid",placeItems:"center",padding:18}}>
   <div onClick={e=>e.stopPropagation()} dir="rtl" style={{width:"min(420px,100%)",maxHeight:"90vh",overflowY:"auto",boxSizing:"border-box",borderRadius:28,padding:18,background:"#F8F5ED",color:"#10100F",boxShadow:"0 28px 80px rgba(0,0,0,.25)"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}><div><div style={{fontSize:9,color:"#B59A62",letterSpacing:1}}>MUSLIM MIRROR · DEV</div><h2 style={{fontSize:22,margin:"3px 0 0"}}>اختبار التصميم على الجوال</h2></div><button onClick={()=>setOpen(false)} style={{width:38,height:38,borderRadius:"50%",border:"1px solid rgba(16,16,15,.08)",background:"white",fontSize:18}}>×</button></div>
    <p style={{fontSize:11,lineHeight:1.8,opacity:.58,margin:"9px 0 14px"}}>خلِّ الجوال واللابتوب على نفس شبكة Wi‑Fi. نختار تلقائياً عنوان الشبكة الحقيقي ونستبعد المحولات الوهمية وVPN.</p>
    {candidates.length>0&&<select value={selected} onChange={e=>setSelected(e.target.value)} style={{width:"100%",border:"1px solid rgba(16,16,15,.09)",borderRadius:14,padding:11,background:"white",fontFamily:"inherit"}}>{candidates.map(item=><option key={item.url} value={item.url}>{item.primary?"✓ ":""}{item.name} — {item.address}</option>)}</select>}
    {selectedCandidate&&<div style={{marginTop:8,fontSize:10,lineHeight:1.7,color:"#466157"}}>{selectedCandidate.primary?"هذا هو عنوان مسار الشبكة الفعلي على اللابتوب.":"عنوان LAN بديل؛ استخدمه فقط إذا كان الجوال على هذه الشبكة."}</div>}
    <div style={{display:"grid",placeItems:"center",marginTop:14}}>{qr&&<img src={qr} alt="QR لاختبار Muslim Mirror على الجوال" width="260" height="260" style={{width:"min(260px,76vw)",height:"auto",borderRadius:18,background:"white",padding:10,boxSizing:"border-box"}}/>}</div>
    <div dir="ltr" style={{marginTop:12,padding:"10px 12px",borderRadius:14,background:"rgba(23,59,87,.06)",fontSize:10.5,wordBreak:"break-all",textAlign:"left"}}>{selected||"لا يوجد عنوان LAN صالح حالياً"}</div>
    {error&&<div style={{fontSize:10,color:"#A44D3C",lineHeight:1.7,marginTop:8}}>{error}</div>}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}><button onClick={copy} disabled={!selected} style={{border:0,borderRadius:14,padding:11,background:"#173B57",color:"white",fontFamily:"inherit",opacity:selected?1:.45}}>{copied?"تم النسخ ✓":"نسخ الرابط"}</button><button onClick={()=>selected&&window.open(selected,"_blank")} disabled={!selected} style={{border:"1px solid rgba(16,16,15,.08)",borderRadius:14,padding:11,background:"white",fontFamily:"inherit",opacity:selected?1:.45}}>فتح الرابط</button></div>
    <div style={{fontSize:9.5,lineHeight:1.7,opacity:.5,marginTop:10}}>إذا ظهر الرابط الصحيح لكن الجوال لا يفتحه، فالمشكلة غالباً من Windows Firewall. اسمح لـ Node.js على Private networks ثم أعد المحاولة.</div>
   </div>
  </div>}
 </>;
}
