import React,{useEffect,useMemo,useState} from "react";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62",red:"#9C4A3B",green:"#416F5A"};
const MANIFEST="/data/hadiths/manifest.json";
const DIAC=/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const norm=s=>String(s??"").replace(DIAC,"").replace(/ـ/g,"").replace(/[أإآ]/g,"ا").replace(/ى/g,"ي").replace(/\s+/g," ").trim();
const ar=n=>String(n??"").replace(/[0-9]/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]);
const R= [
 {name:"الأعمش",aliases:["الأعمش","سليمان بن مهران"]},
 {name:"الشعبي",aliases:["الشعبي","عامر الشعبي","عامر بن شراحيل"]},
 {name:"سفيان الثوري",aliases:["سفيان الثوري"]},
 {name:"عبد الرحمن بن أبي ليلى",aliases:["عبد الرحمن بن أبي ليلى"]},
 {name:"سلمة بن كهيل",aliases:["سلمة بن كهيل"]},
 {name:"حبيب بن أبي ثابت",aliases:["حبيب بن أبي ثابت"]},
 {name:"الأسود بن يزيد",aliases:["الأسود بن يزيد"]},
 {name:"زر بن حبيش",aliases:["زر بن حبيش"]},
 {name:"شريك بن عبد الله",aliases:["شريك بن عبد الله"]},
 {name:"الحكم بن عتيبة",aliases:["الحكم بن عتيبة"]},
 {name:"أبو وائل شقيق بن سلمة",aliases:["شقيق بن سلمة","أبو وائل"]},
 {name:"إبراهيم النخعي",aliases:["إبراهيم النخعي"]},
 {name:"منصور بن المعتمر",aliases:["منصور بن المعتمر"]},
 {name:"عاصم بن بهدلة",aliases:["عاصم بن بهدلة"]},
 {name:"وكيع بن الجراح",aliases:["وكيع بن الجراح"]},
 {name:"أبو حصين عثمان بن عاصم",aliases:["عثمان بن عاصم","أبو حصين"]},
 {name:"زائدة بن قدامة",aliases:["زائدة بن قدامة"]},
 {name:"مسروق بن الأجدع",aliases:["مسروق بن الأجدع"]},
 {name:"سلام بن سليم",aliases:["سلام بن سليم"]},
 {name:"علقمة بن قيس",aliases:["علقمة بن قيس"]}
].map(x=>({...x,keys:x.aliases.map(norm)}));

async function loadJsonMaybeGzip(url){
 const r=await fetch(url,{cache:"force-cache"});
 if(!r.ok)throw new Error("missing");
 const buf=await r.arrayBuffer();
 const u8=new Uint8Array(buf);
 if(u8[0]===0x1f&&u8[1]===0x8b){
  if(typeof DecompressionStream!=="function")throw new Error("gzip-unsupported");
  const ds=new DecompressionStream("gzip");
  const out=await new Response(new Blob([buf]).stream().pipeThrough(ds)).text();
  return JSON.parse(out);
 }
 return JSON.parse(new TextDecoder("utf-8").decode(u8));
}

export default function KufanHadiths({onBack}){
 const[rows,setRows]=useState([]),[books,setBooks]=useState([]),[busy,setBusy]=useState(true),[progress,setProgress]=useState(0),[err,setErr]=useState("");
 const[q,setQ]=useState(""),[bookFilter,setBookFilter]=useState("all"),[narratorFilter,setNarratorFilter]=useState("all"),[detail,setDetail]=useState(null);
 useEffect(()=>{
  let alive=true;
  (async()=>{
   try{
    setBusy(true);setErr("");
    const mf=await fetch(MANIFEST,{cache:"no-cache"}).then(r=>{if(!r.ok)throw new Error("manifest");return r.json()});
    const bs=Array.isArray(mf?.books)?mf.books:[];if(!alive)return;setBooks(bs);
    const out=[];
    for(let i=0;i<bs.length;i++){
     const b=bs[i];
     const data=await loadJsonMaybeGzip(b.file);
     const hs=Array.isArray(data?.hadiths)?data.hadiths:[];
     for(const h of hs){
      const text=String(h?.arabic??""); if(!text)continue;
      const nt=norm(text), matched=[];
      for(const r of R)if(r.keys.some(k=>nt.includes(k)))matched.push(r.name);
      if(matched.length)out.push({bookId:b.id,bookTitle:b.titleAr,bookAuthor:b.authorAr,no:h.idInBook??h.id,id:h.id,chapterId:h.chapterId,text,narrators:[...new Set(matched)]});
     }
     if(!alive)return;setProgress(i+1);await new Promise(res=>setTimeout(res,0));
    }
    if(alive)setRows(out);
   }catch(e){if(alive)setErr(e?.message==="gzip-unsupported"?"هذا المتصفح لا يدعم فك ضغط بيانات الكتب المحلية.":"تعذر بناء فهرس أحاديث أهل الكوفة من المكتبة المحلية.")}
   finally{if(alive)setBusy(false)}
  })();
  return()=>{alive=false};
 },[]);
 const narrators=useMemo(()=>{const s=new Set();rows.forEach(x=>x.narrators.forEach(n=>s.add(n)));return [...s].sort((a,b)=>a.localeCompare(b,"ar"))},[rows]);
 const shown=useMemo(()=>{
  const s=norm(q);
  return rows.filter(x=>(bookFilter==="all"||x.bookId===bookFilter)&&(narratorFilter==="all"||x.narrators.includes(narratorFilter))&&(!s||norm(`${x.bookTitle} ${x.no} ${x.narrators.join(" ")} ${x.text}`).includes(s)));
 },[rows,q,bookFilter,narratorFilter]);
 if(detail)return <Shell><Top title={detail.bookTitle} sub={`حديث رقم ${ar(detail.no)} · ${detail.narrators.join("، ")}`} back={()=>setDetail(null)}/><article style={reader}><div style={hadithText}>{detail.text}</div></article><div style={tagRow}>{detail.narrators.map(n=><span key={n} style={tag}>راوٍ كوفي: {n}</span>)}</div><section style={note}>التصنيف هنا مبني على ظهور اسم راوٍ كوفي مميز في إسناد الحديث ضمن بيانات الكتب التسعة، ولا يعني أن متن الحديث خاص بمدينة الكوفة.</section></Shell>;
 return <Shell><Top title="أحاديث أهل الكوفة" sub="فهرس مرويات الرواة الكوفيين في الكتب التسعة" back={onBack}/><section style={hero}><div style={{fontSize:10,color:"#E7D29B",letterSpacing:.5}}>KUFA · HADITH</div><div style={{fontSize:22,fontWeight:800,marginTop:7}}>أحاديث أهل الكوفة</div><div style={{fontSize:10.5,opacity:.68,lineHeight:1.8,marginTop:7}}>جمع آلي محافظ من الأسانيد، مع اسم الراوي الكوفي والكتاب ورقم الحديث.</div></section>{busy&&<div style={loading}>جاري فحص الكتب التسعة… {ar(progress)} / {ar(books.length||9)}</div>}{err&&<div style={errorBox}>{err}</div>}{!busy&&!err&&<><div style={stats}><b>{ar(rows.length)}</b><span>حديثاً مطابقاً</span><b>{ar(narrators.length)}</b><span>راوياً كوفياً</span></div><input value={q} onChange={e=>setQ(e.target.value)} placeholder="ابحث في النص أو الراوي أو رقم الحديث…" style={input}/><div style={filters}><select value={bookFilter} onChange={e=>setBookFilter(e.target.value)} style={select}><option value="all">كل الكتب</option>{books.map(b=><option key={b.id} value={b.id}>{b.titleAr}</option>)}</select><select value={narratorFilter} onChange={e=>setNarratorFilter(e.target.value)} style={select}><option value="all">كل الرواة</option>{narrators.map(n=><option key={n} value={n}>{n}</option>)}</select></div><div style={sectionHead}><b>النتائج</b><span>{ar(shown.length)} حديث</span></div><div>{shown.map((h,i)=><button key={`${h.bookId}-${h.no}-${i}`} onClick={()=>setDetail(h)} style={row}><span style={num}>{ar(h.no)}</span><span style={{minWidth:0}}><b style={{display:"block",fontSize:12.5}}>{h.bookTitle}</b><small style={{display:"block",fontSize:9.5,color:C.gold,marginTop:3}}>{h.narrators.join("، ")}</small><small style={preview}>{h.text}</small></span><span style={{opacity:.25,fontSize:18}}>‹</span></button>)}</div><section style={note}>للدقة، يعتمد الفهرس على أسماء مميزة لرواة كوفيين داخل الإسناد، ولا يستخدم مجرد وجود كلمة «الكوفة» في المتن.</section></>}</Shell>
}
function Top({title,sub,back}){return <><button onClick={back} style={backBtn}>رجوع</button><header style={{textAlign:"center",margin:"12px 0 16px"}}><div style={{fontSize:9.5,color:C.gold}}>مكتبة الحديث</div><h1 style={{fontSize:29,margin:"4px 0"}}>{title}</h1><div style={{fontSize:9.5,opacity:.44}}>{sub}</div></header></>}
function Shell({children}){return <div dir="rtl" style={{position:"absolute",inset:0,overflowY:"auto",background:C.ivory,color:C.ink}}><main style={{maxWidth:720,margin:"0 auto",padding:"30px 18px calc(300px + env(safe-area-inset-bottom,0px))"}}>{children}</main></div>}
const hero={padding:"20px 18px",borderRadius:26,background:"linear-gradient(145deg,#173B57,#0C293E)",color:"white",boxShadow:"0 16px 40px rgba(23,59,87,.12)"};
const loading={marginTop:14,padding:14,borderRadius:16,background:"rgba(181,154,98,.08)",fontSize:10.5};
const errorBox={marginTop:14,padding:14,borderRadius:16,background:"rgba(156,74,59,.08)",color:C.red,fontSize:10.5};
const stats={display:"grid",gridTemplateColumns:"auto 1fr auto 1fr",gap:7,alignItems:"baseline",margin:"16px 2px 10px",fontSize:10.5};
const input={width:"100%",boxSizing:"border-box",padding:"13px 14px",borderRadius:17,border:"1px solid rgba(16,16,15,.08)",background:"rgba(255,255,255,.64)",fontFamily:"inherit",outline:"none",color:C.ink};
const filters={display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8};
const select={width:"100%",padding:"11px",borderRadius:14,border:"1px solid rgba(16,16,15,.08)",background:"rgba(255,255,255,.58)",fontFamily:"inherit",color:C.ink};
const sectionHead={display:"flex",justifyContent:"space-between",alignItems:"center",margin:"20px 2px 8px",fontSize:11.5};
const row={width:"100%",padding:"12px 3px",border:0,borderTop:"1px solid rgba(16,16,15,.06)",background:"transparent",fontFamily:"inherit",color:C.ink,display:"grid",gridTemplateColumns:"40px 1fr auto",gap:10,alignItems:"center",textAlign:"right"};
const num={width:36,height:36,borderRadius:11,display:"grid",placeItems:"center",background:"rgba(181,154,98,.12)",color:C.gold,fontSize:9};
const preview={display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",fontFamily:"'Noto Naskh Arabic','Amiri',serif",fontSize:11.5,lineHeight:1.75,opacity:.55,marginTop:5};
const reader={padding:"20px 17px",borderRadius:24,background:"#FFFDF8",border:"1px solid rgba(16,16,15,.065)"};
const hadithText={fontFamily:"'Noto Naskh Arabic','Amiri',serif",fontSize:"clamp(21px,5vw,29px)",lineHeight:2.15,textAlign:"justify",textJustify:"inter-character",direction:"rtl",whiteSpace:"pre-wrap"};
const tagRow={display:"flex",flexWrap:"wrap",gap:7,marginTop:10};
const tag={padding:"7px 10px",borderRadius:999,background:"rgba(181,154,98,.10)",color:C.gold,fontSize:9.5};
const note={marginTop:14,padding:12,borderRadius:16,background:"rgba(181,154,98,.08)",fontSize:9.5,lineHeight:1.8,opacity:.72};
const backBtn={border:"1px solid rgba(16,16,15,.08)",borderRadius:14,padding:"8px 11px",background:"rgba(255,255,255,.58)",fontFamily:"inherit",color:C.ink,fontSize:10};