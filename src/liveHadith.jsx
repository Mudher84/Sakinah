import React,{useEffect,useMemo,useRef,useState} from "react";
import NineBooksCenter from "./NineBooksCenter.jsx";
import KufanHadiths from "./KufanHadiths.jsx";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62",red:"#9C4A3B"};
const btn={border:"1px solid rgba(16,16,15,.09)",borderRadius:14,padding:11,background:"transparent",fontFamily:"inherit",color:"inherit"};
const API="https://hadeethenc.com/api/v1";

const rowsOf=x=>{
 if(Array.isArray(x))return x;
 if(Array.isArray(x?.data))return x.data;
 if(Array.isArray(x?.data?.data))return x.data.data;
 if(Array.isArray(x?.results))return x.results;
 return [];
};
const idOf=x=>String(x?.id??x?.category_id??"");
const parentOf=x=>String(x?.parent_id??x?.parent??x?.parent_category_id??"");

async function getJson(url,signal){
 const r=await fetch(url,{signal,headers:{Accept:"application/json"}});
 if(!r.ok)throw new Error(`HTTP ${r.status}`);
 return r.json();
}

function CategoryIcon({title=""}){
 const p={viewBox:"0 0 24 24",width:22,height:22,fill:"none",stroke:"currentColor",strokeWidth:1.55,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true"};
 if(/القرآن|علومه/.test(title))return <svg {...p}><path d="M4.2 5.7c2.7-.9 5.3-.4 7.8 1.2v12.3c-2.5-1.5-5.1-1.9-7.8-1z"/><path d="M19.8 5.7c-2.7-.9-5.3-.4-7.8 1.2v12.3c2.5-1.5 5.1-1.9 7.8-1z"/><path d="M12 6.9v12.3"/></svg>;
 if(/الحديث/.test(title))return <svg {...p}><rect x="4.3" y="3.8" width="15.4" height="16.4" rx="2.8"/><path d="M8 8h8M8 11.8h8M8 15.6h5.3"/><path d="M7 3.8v16.4"/></svg>;
 if(/العقيدة/.test(title))return <svg {...p}><path d="M12 3.7 18.7 6v5c0 4-2.4 7.2-6.7 9.1-4.3-1.9-6.7-5.1-6.7-9.1V6z"/><path d="m9.2 11.9 1.8 1.8 3.8-4"/></svg>;
 if(/الفقه|أصوله/.test(title))return <svg {...p}><path d="M12 4v16M5 7h14"/><path d="m7.2 7-2.6 5.8h5.2zM16.8 7l-2.6 5.8h5.2z"/><path d="M8.4 20h7.2"/></svg>;
 if(/الفضائل|الآداب/.test(title))return <svg {...p}><path d="M12 20s-6.8-3.7-6.8-9.1A3.8 3.8 0 0 1 12 8.5a3.8 3.8 0 0 1 6.8 2.4C18.8 16.3 12 20 12 20Z"/><path d="M9.4 5.2h5.2M12 2.7v5.8"/></svg>;
 if(/الدعوة|الحسبة|التربية/.test(title))return <svg {...p}><path d="M4.2 13.7V9.9l10.5-4v11.8l-10.5-4Z"/><path d="M14.7 9c2 .5 3.4 1.8 4.2 3.8M7.2 14.7l1.1 3.8h3.2"/></svg>;
 if(/السيرة|التاريخ/.test(title))return <svg {...p}><circle cx="12" cy="12" r="8.2"/><path d="M12 7.4V12l3.1 2"/><path d="M8.1 4.8 6.6 3.4M15.9 4.8l1.5-1.4"/></svg>;
 return <svg {...p}><path d="M5 5.5h14v13H5z"/><path d="M8 9h8M8 12h8M8 15h5"/></svg>;
}

function Shell({go,children,title="الأحاديث النبوية",sub="موسوعة أحاديث صحيحة ومشروحة من HadeethEnc"}){
 return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,display:"flex",flexDirection:"column"}} dir="rtl">
  <div style={{padding:"22px 22px 0"}}><button onClick={()=>go?.()} style={{...btn,border:0,padding:0,cursor:"pointer"}}>رجوع ←</button></div>
  <div style={{flex:1,overflowY:"auto",padding:"15px 22px 130px"}}>
   <div style={{fontFamily:"Fraunces,serif",fontSize:29}}>{title}</div>
   <div style={{fontSize:11.5,opacity:.48,lineHeight:1.7,marginTop:7}}>{sub}</div>
   {children}
   <div style={{fontSize:9.5,opacity:.42,lineHeight:1.7,marginTop:22}}>المصدر: HadeethEnc.com — موسوعة الأحاديث النبوية المترجمة.</div>
  </div>
 </div>;
}

function ErrorBox({text,onRetry}){
 return <div style={{marginTop:18,padding:14,borderRadius:16,border:"1px solid rgba(156,74,59,.18)",background:"rgba(156,74,59,.055)"}}>
  <div style={{fontSize:11.5,lineHeight:1.8,color:C.red}}>{text}</div>
  {onRetry&&<button onClick={onRetry} style={{...btn,marginTop:10,padding:"7px 11px",cursor:"pointer"}}>إعادة المحاولة</button>}
 </div>;
}

export function LiveHadithHub({go}){
 const [cats,setCats]=useState([]),[allCats,setAllCats]=useState([]),[cat,setCat]=useState(null),[subcats,setSubcats]=useState([]),[rows,setRows]=useState([]),[detail,setDetail]=useState(null),[q,setQ]=useState(""),[loading,setLoading]=useState(true),[err,setErr]=useState(""),[nineBooks,setNineBooks]=useState(false),[kufa,setKufa]=useState(false);
 const requestRef=useRef(0);

 const loadRoots=()=>{
  const rid=++requestRef.current;
  setLoading(true);setErr("");
  getJson(`${API}/categories/roots/?language=ar`).then(x=>{
   if(rid!==requestRef.current)return;
   setCats(rowsOf(x));setLoading(false);
  }).catch(()=>{if(rid===requestRef.current){setErr("تعذر الاتصال بمصدر الأحاديث حالياً. التطبيق ما زال يعمل ويمكن إعادة المحاولة.");setLoading(false)}});
 };
 useEffect(()=>{loadRoots();return()=>{requestRef.current++}},[]);

 const loadCategory=async c=>{
  if(!c)return;
  const rid=++requestRef.current;
  setCat(c);setRows([]);setSubcats([]);setDetail(null);setQ("");setErr("");setLoading(true);
  try{
   const cid=encodeURIComponent(idOf(c));
   const [hRes,cRes]=await Promise.allSettled([
    getJson(`${API}/hadeeths/list/?language=ar&category_id=${cid}&page=1&per_page=50`),
    allCats.length?Promise.resolve(allCats):getJson(`${API}/categories/list/?language=ar`)
   ]);
   if(rid!==requestRef.current)return;
   if(cRes.status==="fulfilled"){
    const every=Array.isArray(cRes.value)?cRes.value:rowsOf(cRes.value);
    if(every.length)setAllCats(every);
    const children=every.filter(x=>parentOf(x)===idOf(c)&&idOf(x)!==idOf(c));
    setSubcats(children);
   }
   if(hRes.status==="fulfilled")setRows(rowsOf(hRes.value));
   else if(cRes.status!=="fulfilled")throw new Error("category failed");
   setLoading(false);
  }catch{
   if(rid===requestRef.current){setErr("تعذر تحميل هذا الباب الآن، لكن الصفحة بقيت مستقرة. جرّب إعادة المحاولة.");setLoading(false)}
  }
 };

 const openHadith=async h=>{
  if(!h?.id)return;
  const rid=++requestRef.current;
  setErr("");setLoading(true);
  try{
   const x=await getJson(`${API}/hadeeths/one/?language=ar&id=${encodeURIComponent(h.id)}`);
   if(rid!==requestRef.current)return;
   setDetail(x?.data&&typeof x.data==="object"&&!Array.isArray(x.data)?x.data:x||null);setLoading(false);
  }catch{
   if(rid===requestRef.current){setErr("تعذر تحميل نص الحديث. يمكنك الرجوع أو إعادة المحاولة.");setLoading(false)}
  }
 };

 const shown=useMemo(()=>rows.filter(x=>String(x?.title||x?.hadeeth||"").includes(q)),[rows,q]);

 if(kufa)return <div style={{position:"absolute",inset:0,zIndex:42000,background:C.ivory}} dir="rtl"><KufanHadiths onBack={()=>setKufa(false)}/></div>;
 if(nineBooks)return <div style={{position:"absolute",inset:0,zIndex:42000,background:C.ivory}} dir="rtl"><NineBooksCenter/><button onClick={()=>setNineBooks(false)} style={{position:"fixed",top:66,right:14,zIndex:42050,border:"1px solid rgba(16,16,15,.08)",borderRadius:999,padding:"8px 12px",background:"rgba(246,243,236,.94)",fontFamily:"inherit",fontSize:11}}>رجوع إلى الحديث ←</button></div>;

 if(detail)return <Shell go={()=>{setDetail(null);setErr("")}} title={detail.title||"الحديث"} sub={detail.attribution||"حديث موثق من HadeethEnc"}>
  {err&&<ErrorBox text={err}/>}<article style={{marginTop:18,padding:18,borderRadius:22,background:"rgba(255,255,255,.48)",border:"1px solid rgba(16,16,15,.07)"}}>
   <div style={{fontFamily:"serif",fontSize:20,lineHeight:2}}>{detail.hadeeth||detail.hadith||detail.text||""}</div>
   {detail.explanation&&<><div style={{fontSize:12,fontWeight:700,marginTop:22}}>الشرح</div><div style={{fontSize:12,lineHeight:1.9,marginTop:8}}>{detail.explanation}</div></>}
   {Array.isArray(detail.hints)&&detail.hints.length>0&&<><div style={{fontSize:12,fontWeight:700,marginTop:22}}>الفوائد</div>{detail.hints.map((x,i)=><div key={i} style={{padding:"8px 0",borderTop:"1px solid rgba(16,16,15,.06)",fontSize:11.5,lineHeight:1.8}}>• {String(x)}</div>)}</>}
  </article>
 </Shell>;

 if(cat)return <Shell go={()=>{requestRef.current++;setCat(null);setRows([]);setSubcats([]);setErr("");setQ("")}} title={cat.title||"باب الحديث"} sub="الأبواب الفرعية والأحاديث التابعة لهذا القسم">
  <input value={q} onChange={e=>setQ(e.target.value)} placeholder="ابحث في أحاديث هذا الباب…" style={{...btn,width:"100%",boxSizing:"border-box",marginTop:16}}/>
  {loading&&<div style={{marginTop:22,opacity:.5}}>تحميل محتوى الباب…</div>}
  {err&&<ErrorBox text={err} onRetry={()=>loadCategory(cat)}/>} 
  {subcats.length>0&&<section style={{marginTop:18}}><div style={{fontSize:10,opacity:.45,marginBottom:8}}>الأبواب الفرعية</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{subcats.map(s=><button key={idOf(s)} onClick={()=>loadCategory(s)} style={{...btn,minHeight:78,textAlign:"right",background:"rgba(255,255,255,.48)",cursor:"pointer"}}><div style={{color:C.gold}}><CategoryIcon title={s.title}/></div><div style={{fontSize:11.5,lineHeight:1.6,marginTop:8}}>{s.title||"باب فرعي"}</div></button>)}</div></section>}
  {!loading&&!err&&shown.length===0&&subcats.length===0&&<div style={{marginTop:22,opacity:.48,fontSize:11.5,lineHeight:1.8}}>لا توجد مواد ظاهرة في هذا الباب من المصدر حالياً.</div>}
  <div style={{marginTop:16}}>{shown.map(h=><button key={h.id} onClick={()=>openHadith(h)} style={{width:"100%",padding:"13px 2px",border:0,borderTop:"1px solid rgba(16,16,15,.07)",background:"transparent",fontFamily:"inherit",textAlign:"right",color:"inherit",cursor:"pointer"}}><b style={{fontSize:12.5,lineHeight:1.7}}>{h.title||"حديث"}</b><small style={{display:"block",opacity:.4,marginTop:4}}>رقم {h.id}</small></button>)}</div>
 </Shell>;

 return <Shell go={()=>go?.(null)}>
  <div style={{display:"grid",gap:10,marginTop:20}}>
   <button onClick={()=>setNineBooks(true)} style={{width:"100%",minHeight:156,padding:"20px 18px",border:0,borderRadius:26,background:"linear-gradient(145deg,#173B57,#0C293E)",color:"white",fontFamily:"inherit",textAlign:"right",display:"grid",gridTemplateColumns:"1fr auto",gap:14,alignItems:"center",cursor:"pointer"}}><span><span style={{display:"block",fontSize:10,color:"#E7D29B"}}>مكتبة الحديث</span><b style={{display:"block",fontSize:24,marginTop:7}}>الكتب التسعة</b><small style={{display:"block",fontSize:11,opacity:.68,lineHeight:1.8,marginTop:7}}>صحيح البخاري، صحيح مسلم، السنن والمسانيد</small></span><span style={{width:64,height:76,borderRadius:20,display:"grid",placeItems:"center",background:"rgba(255,255,255,.09)",color:"#E7D29B"}}><CategoryIcon title="الحديث وعلومه"/></span></button>
   <button onClick={()=>setKufa(true)} style={{width:"100%",minHeight:142,padding:"19px 18px",border:"1px solid rgba(181,154,98,.16)",borderRadius:26,background:"rgba(255,255,255,.55)",fontFamily:"inherit",textAlign:"right",cursor:"pointer"}}><b style={{display:"block",fontSize:20}}>أحاديث أهل الكوفة</b><small style={{display:"block",fontSize:10.5,opacity:.58,lineHeight:1.8,marginTop:7}}>مرويات الرواة الكوفيين من الكتب التسعة</small></button>
  </div>
  {loading&&<div style={{marginTop:22,opacity:.5}}>تحميل أبواب الحديث…</div>}
  {err&&<ErrorBox text={err} onRetry={loadRoots}/>} 
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginTop:18}}>{cats.map((c,i)=><button key={idOf(c)||i} onClick={()=>loadCategory(c)} style={{...btn,minHeight:112,textAlign:"right",background:i===0?"linear-gradient(145deg,#173B57,#0C293E)":"rgba(255,255,255,.48)",color:i===0?"white":C.ink,cursor:"pointer"}}><div style={{width:34,height:34,borderRadius:11,display:"grid",placeItems:"center",color:i===0?"#E7D29B":C.gold,background:i===0?"rgba(255,255,255,.08)":"rgba(181,154,98,.07)"}}><CategoryIcon title={c.title}/></div><div style={{fontSize:12.5,fontWeight:700,lineHeight:1.6,marginTop:12}}>{c.title||"قسم"}</div></button>)}</div>
 </Shell>;
}
