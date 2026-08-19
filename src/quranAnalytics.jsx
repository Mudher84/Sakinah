import React,{useMemo,useState} from "react";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62"};
const btn={border:"1px solid rgba(16,16,15,.09)",borderRadius:14,padding:11,background:"transparent",fontFamily:"inherit",color:"inherit"};
const normalizeArabic=(s="")=>s
 .normalize("NFKD")
 .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g,"")
 .replace(/[إأآٱ]/g,"ا")
 .replace(/ى/g,"ي")
 .replace(/ؤ/g,"و")
 .replace(/ئ/g,"ي")
 .replace(/ـ/g,"")
 .replace(/[^\u0621-\u063A\u0641-\u064A0-9\s]/g," ")
 .replace(/\s+/g," ")
 .trim();

export function SmartQuranAnalytics({lang,go}){
 const [q,setQ]=useState(""),[mode,setMode]=useState("word"),[state,setState]=useState({loading:false,error:"",rows:[],stats:null});
 const search=async()=>{
  const term=normalizeArabic(q); if(!term)return;
  setState({loading:true,error:"",rows:[],stats:null});
  try{
   const r=await fetch("https://api.alquran.cloud/v1/quran/quran-uthmani");
   const j=await r.json(); const surahs=j?.data?.surahs||[];
   let totalLetters=0,totalWords=0,occurrences=0; const rows=[]; const bySurah=[];
   for(const s of surahs){let sCount=0;for(const a of s.ayahs||[]){const raw=a.text||"";const n=normalizeArabic(raw);const words=n.split(" ").filter(Boolean);totalWords+=words.length;totalLetters+=n.replace(/\s/g,"").length;
     let c=0;if(mode==="word") c=words.filter(w=>w===term).length; else {let from=0;while(true){const idx=n.indexOf(term,from);if(idx<0)break;c++;from=idx+Math.max(1,term.length)}}
     if(c){occurrences+=c;sCount+=c;rows.push({surah:s.number,surahName:s.name,ayah:a.numberInSurah,text:raw,count:c});}
   } if(sCount)bySurah.push({surah:s.number,name:s.name,count:sCount});}
   bySurah.sort((a,b)=>b.count-a.count);
   setState({loading:false,error:"",rows,stats:{occurrences,ayahs:rows.length,surahs:bySurah.length,totalLetters,totalWords,bySurah}});
  }catch(e){setState({loading:false,error:lang==="ar"?"تعذر تحميل نص القرآن الآن.":"Could not load Quran text.",rows:[],stats:null});}
 };
 const termLetters=useMemo(()=>normalizeArabic(q).replace(/\s/g,"").length,[q]);
 return <div dir={lang==="ar"?"rtl":"ltr"} style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,overflowY:"auto",padding:"22px 22px 120px"}}>
  <button onClick={()=>go("quran-search")} style={{...btn,border:0,padding:0}}>{lang==="ar"?"← رجوع":"← Back"}</button>
  <div style={{fontFamily:"Fraunces,serif",fontSize:30,marginTop:16}}>{lang==="ar"?"البحث الذكي في القرآن":"Smart Quran Analytics"}</div>
  <div style={{fontSize:11.5,opacity:.5,lineHeight:1.7,marginTop:7}}>{lang==="ar"?"ابحث عن اسم أو كلمة واعرف كم مرة ذكرت، وفي أي سور وآيات، مع إحصاءات الحروف والكلمات.":"Search any name or word to see frequency, surahs, ayahs, letters and word statistics."}</div>
  <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8,marginTop:18}}><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()} placeholder={lang==="ar"?"مثال: موسى، إبراهيم، رحمة":"e.g. موسى، إبراهيم، رحمة"} style={{...btn,width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,.5)"}}/><button onClick={search} style={{...btn,background:C.lapis,color:"white",border:0,minWidth:76}}>{lang==="ar"?"احسب":"Analyze"}</button></div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:9}}><button onClick={()=>setMode("word")} style={{...btn,background:mode==="word"?"rgba(181,154,98,.13)":"transparent"}}>{lang==="ar"?"كلمة مطابقة":"Exact word"}</button><button onClick={()=>setMode("contains")} style={{...btn,background:mode==="contains"?"rgba(181,154,98,.13)":"transparent"}}>{lang==="ar"?"ضمن النص":"Contains"}</button></div>
  <div style={{fontSize:10,opacity:.45,marginTop:8}}>{lang==="ar"?`عدد حروف عبارة البحث بعد التطبيع: ${termLetters}`:`Normalized query letters: ${termLetters}`}</div>
  {state.loading&&<div style={{padding:28,textAlign:"center",opacity:.5}}>{lang==="ar"?"أحلل القرآن كاملاً…":"Analyzing the full Quran…"}</div>}
  {state.error&&<div style={{marginTop:16,padding:13,borderRadius:14,background:"rgba(164,77,60,.08)",fontSize:11}}>{state.error}</div>}
  {state.stats&&<><div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginTop:18}}>{[[lang==="ar"?"عدد مرات الذكر":"Occurrences",state.stats.occurrences],[lang==="ar"?"عدد الآيات":"Ayahs",state.stats.ayahs],[lang==="ar"?"عدد السور":"Surahs",state.stats.surahs],[lang==="ar"?"حروف القرآن المحللة":"Quran letters",state.stats.totalLetters]].map(([l,v])=><div key={l} style={{padding:14,borderRadius:17,border:"1px solid rgba(16,16,15,.08)",background:"rgba(255,255,255,.46)"}}><div style={{fontSize:9.5,opacity:.45}}>{l}</div><div style={{fontFamily:"Fraunces,serif",fontSize:23,marginTop:5}}>{Number(v).toLocaleString()}</div></div>)}</div>
   <div style={{marginTop:18,fontSize:13,fontWeight:700}}>{lang==="ar"?"أعلى السور تكراراً":"Top surahs by frequency"}</div><div>{state.stats.bySurah.slice(0,12).map(x=><div key={x.surah} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:"1px solid rgba(16,16,15,.07)",fontSize:12}}><span>{x.surah}. {x.name}</span><b>{x.count}</b></div>)}</div>
   <div style={{marginTop:18,fontSize:13,fontWeight:700}}>{lang==="ar"?"مواضع الذكر":"Occurrences"}</div><div>{state.rows.slice(0,300).map((x,i)=><div key={`${x.surah}-${x.ayah}-${i}`} style={{padding:"12px 0",borderTop:"1px solid rgba(16,16,15,.07)"}}><div style={{fontSize:10,opacity:.48}}>{x.surahName} · {x.surah}:{x.ayah} · ×{x.count}</div><div style={{fontFamily:"serif",fontSize:18,lineHeight:2,marginTop:6}}>{x.text}</div></div>)}</div>
   <div style={{fontSize:9.5,opacity:.42,lineHeight:1.7,marginTop:14}}>{lang==="ar"?"الحساب يعتمد نص المصحف العثماني من المصدر الحي. وضع «كلمة مطابقة» يعدّ الكلمة بعد إزالة التشكيل وتوحيد أشكال الألف، أما «ضمن النص» فيحسب التطابق داخل النص أيضاً.":"Counts use the live Uthmani Quran text. Exact-word mode normalizes Arabic diacritics and letter forms; Contains mode also counts substring matches."}</div></>}
 </div>;
}
