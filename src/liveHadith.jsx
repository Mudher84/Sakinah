import React,{useEffect,useMemo,useRef,useState} from "react";
import NineBooksCenter from "./NineBooksCenter.jsx";
import KufanHadiths from "./KufanHadiths.jsx";

const C={ivory:"#F6F3EC",paper:"#FBF9F4",ink:"#10100F",lapis:"#173B57",lapisDeep:"#0C293E",gold:"#B59A62",muted:"#74716A",red:"#9C4A3B"};
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

function CategoryIcon({title="",size=22}){
 const p={viewBox:"0 0 24 24",width:size,height:size,fill:"none",stroke:"currentColor",strokeWidth:1.55,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true"};
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

function HeaderBar({onBack,onSearch}){
 return <div style={{position:"sticky",top:0,zIndex:40,background:"rgba(246,243,236,.94)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(16,16,15,.06)",padding:"14px 20px",display:"grid",gridTemplateColumns:"34px 1fr 34px",alignItems:"center"}}>
  <button onClick={onBack} aria-label="رجوع" style={{border:0,background:"transparent",fontFamily:"inherit",fontSize:18,color:"rgba(16,16,15,.55)",cursor:"pointer"}}>→</button>
  <div style={{textAlign:"center",fontSize:13,fontWeight:650}}>الأحاديث النبوية</div>
  <button onClick={onSearch} aria-label="بحث" style={{border:0,background:"transparent",color:C.gold,cursor:"pointer",display:"grid",placeItems:"center"}}><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg></button>
 </div>;
}

function TodayHadith(){
 return <section style={{margin:"28px 20px 0",paddingTop:18,borderTop:"1px solid rgba(16,16,15,.09)"}}>
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:11,color:C.gold}}>مشروح · صحيح</span><span style={{fontSize:13,fontWeight:650}}>حديث اليوم</span></div>
  <div style={{fontFamily:"'Amiri','Noto Naskh Arabic',serif",fontSize:21,lineHeight:2.05,marginTop:14,textAlign:"center"}}>«إنَّ الدِّينَ يُسْرٌ، ولن يُشادَّ الدِّينَ أحدٌ إلا غَلَبَه»</div>
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:12}}><div style={{display:"flex",gap:16,color:C.gold}}><span>♡</span><span>↗</span><span>▤</span></div><span style={{fontSize:11,opacity:.42}}>صحيح البخاري · ٣٩</span></div>
 </section>;
}

export function LiveHadithHub({go}){
 const [cats,setCats]=useState([]),[allCats,setAllCats]=useState([]),[cat,setCat]=useState(null),[subcats,setSubcats]=useState([]),[rows,setRows]=useState([]),[detail,setDetail]=useState(null),[q,setQ]=useState(""),[searchOpen,setSearchOpen]=useState(false),[loading,setLoading]=useState(true),[err,setErr]=useState(""),[nineBooks,setNineBooks]=useState(false),[kufa,setKufa]=useState(false);
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
  setCat(c);setRows([]);setSubcats([]);setDetail(null);setQ("");setSearchOpen(false);setErr("");setLoading(true);
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
    setSubcats(every.filter(x=>parentOf(x)===idOf(c)&&idOf(x)!==idOf(c)));
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

 return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,overflowY:"auto",paddingBottom:120}} dir="rtl">
  <HeaderBar onBack={()=>go?.(null)} onSearch={()=>setSearchOpen(v=>!v)}/>
  <div style={{padding:"26px 20px 0",textAlign:"center"}}>
   <div style={{fontSize:9,letterSpacing:".22em",color:C.gold,direction:"ltr"}}>HADEETHENC</div>
   <div style={{fontFamily:"Fraunces,'Amiri',serif",fontSize:31,marginTop:8}}>الأحاديث النبوية</div>
   <div style={{fontSize:11.5,opacity:.48,marginTop:8,lineHeight:1.8}}>موسوعة أحاديث صحيحة ومشروحة من المصدر</div>
   {searchOpen&&<input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="ابحث في الأحاديث…" style={{...btn,width:"100%",boxSizing:"border-box",marginTop:15,background:"rgba(255,255,255,.42)"}}/>}
  </div>

  <button onClick={()=>setNineBooks(true)} style={{display:"block",width:"calc(100% - 40px)",margin:"22px 20px 0",padding:20,border:0,borderRadius:24,background:`linear-gradient(145deg,${C.lapis},${C.lapisDeep})`,color:"white",fontFamily:"inherit",textAlign:"right",cursor:"pointer",position:"relative",overflow:"hidden"}}>
   <span style={{position:"absolute",inset:0,background:"radial-gradient(85% 75% at 88% -10%,rgba(181,154,98,.28),transparent 60%)"}}/>
   <span style={{position:"relative",display:"flex",alignItems:"flex-start",gap:16}}><span style={{width:56,height:56,borderRadius:18,background:"rgba(255,255,255,.08)",border:"1px solid rgba(181,154,98,.35)",display:"grid",placeItems:"center",color:"#E7D29B",flex:"0 0 auto"}}><CategoryIcon title="الحديث وعلومه" size={23}/></span><span style={{flex:1}}><span style={{display:"block",fontSize:10.5,opacity:.48}}>مكتبة الحديث</span><b style={{display:"block",fontFamily:"Fraunces,'Amiri',serif",fontSize:25,marginTop:4}}>الكتب التسعة</b><small style={{display:"block",fontSize:10.5,opacity:.62,marginTop:8,lineHeight:1.8}}>البخاري، مسلم، السنن والمسانيد في مكتبة واحدة.</small></span></span>
   <span style={{position:"relative",marginTop:16,paddingTop:14,borderTop:"1px solid rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{display:"flex",gap:18}}><span><b style={{display:"block",fontSize:15,color:"#E7D29B"}}>٩</b><small style={{fontSize:9.5,opacity:.42}}>كتب</small></span><span><b style={{display:"block",fontSize:15,color:"#E7D29B"}}>٤٠ك</b><small style={{fontSize:9.5,opacity:.42}}>حديثاً</small></span></span><span style={{fontSize:11,color:"#E7D29B"}}>افتح المكتبة ←</span></span>
  </button>

  <button onClick={()=>setKufa(true)} style={{display:"flex",width:"calc(100% - 40px)",margin:"12px 20px 0",padding:"18px 20px",borderRadius:24,border:"1px solid rgba(181,154,98,.22)",background:"rgba(181,154,98,.08)",fontFamily:"inherit",color:C.ink,textAlign:"right",alignItems:"center",gap:16,cursor:"pointer"}}><span style={{width:48,height:48,borderRadius:16,background:"rgba(181,154,98,.13)",display:"grid",placeItems:"center",color:C.gold,flex:"0 0 auto"}}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="7.6"/><circle cx="12" cy="12" r="2.2"/><path d="M12 4.4v3M12 16.6v3M4.4 12h3M16.6 12h3"/></svg></span><span style={{flex:1}}><small style={{display:"block",fontSize:10.5,opacity:.48}}>رواة الكوفة</small><b style={{display:"block",fontFamily:"Fraunces,'Amiri',serif",fontSize:21,marginTop:3}}>أحاديث أهل الكوفة</b><small style={{display:"block",fontSize:10.5,opacity:.54,marginTop:6,lineHeight:1.7}}>مرويات الرواة الكوفيين مع المصدر ورقم الحديث.</small><span style={{display:"block",fontSize:11,color:C.gold,marginTop:10}}>افتح الفهرس ←</span></span></button>

  <section style={{margin:"28px 20px 0"}}>
   <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:12}}><span style={{fontSize:10.5,opacity:.4}}>{cats.length?`${cats.length} تصنيفات`:"التصنيفات"}</span><span style={{fontSize:13,fontWeight:650}}>تصنيفات الموسوعة</span></div>
   {loading&&<div style={{padding:"18px 0",fontSize:11.5,opacity:.45}}>تحميل التصنيفات…</div>}
   {err&&<ErrorBox text={err} onRetry={loadRoots}/>} 
   <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{cats.map((c,i)=>{const active=i===0;return <button key={idOf(c)||i} onClick={()=>loadCategory(c)} style={{gridColumn:i===cats.length-1&&cats.length%2===1?"span 2":"auto",padding:16,minHeight:120,borderRadius:20,border:active?`1px solid ${C.lapis}`:"1px solid rgba(16,16,15,.07)",background:active?C.lapis:C.paper,color:active?"white":C.ink,fontFamily:"inherit",textAlign:"right",cursor:"pointer"}}><div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:9.5,opacity:.42}}>{String(c?.count||c?.hadeeths_count||"")}</span><span style={{width:38,height:38,borderRadius:13,background:active?"rgba(255,255,255,.09)":"rgba(181,154,98,.09)",color:active?"#E7D29B":C.gold,display:"grid",placeItems:"center"}}><CategoryIcon title={c.title}/></span></div><div style={{fontSize:12.5,fontWeight:600,lineHeight:1.65,marginTop:14}}>{c.title||"تصنيف"}</div></button>})}</div>
  </section>

  <TodayHadith/>
 </div>;
}
