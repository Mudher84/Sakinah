import React,{useEffect,useMemo,useState} from "react";
import {LiveSurahList} from "./liveCore.jsx";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62"};
const card={border:"1px solid rgba(16,16,15,.07)",borderRadius:20,padding:14,background:"rgba(255,255,255,.55)",fontFamily:"inherit",color:"inherit",textAlign:"right",boxShadow:"0 10px 26px rgba(16,16,15,.035)"};
function emit(id){window.dispatchEvent(new CustomEvent("sakinah:feature",{detail:id}))}
function lastRead(){try{return JSON.parse(localStorage.getItem("sakinah-quran-last-read")||"null")}catch{return null}}
function arNum(n){return String(n).replace(/[0-9]/g,d=>"٠١٢٣٤٥٦٧٨٩"[d])}

function MushafReader({surahId,go}){
 const [surah,setSurah]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState("");
 useEffect(()=>{
  setLoading(true);setError("");
  fetch(`https://api.alquran.cloud/v1/surah/${surahId}/quran-uthmani`).then(r=>{if(!r.ok)throw new Error();return r.json()}).then(j=>{setSurah(j?.data||null);setLoading(false)}).catch(()=>{setError("تعذر تحميل السورة الآن");setLoading(false)});
 },[surahId]);
 const ayahs=surah?.ayahs||[];
 const showBasmala=surahId!==1&&surahId!==9;
 return <div style={{minHeight:"100vh",background:"#EDE7DA",padding:"18px 10px 120px"}} dir="rtl">
  <div style={{maxWidth:760,margin:"0 auto 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><button onClick={()=>go("surah-list")} style={{border:"1px solid rgba(16,16,15,.08)",background:"rgba(255,255,255,.7)",borderRadius:999,padding:"10px 14px",fontFamily:"inherit",boxShadow:"0 6px 18px rgba(16,16,15,.05)"}}>← الفهرس</button><div style={{fontSize:11,opacity:.48}}>عرض المصحف</div></div>
  <article style={{maxWidth:760,margin:"0 auto",background:"#FBF8EF",border:"1px solid rgba(142,118,66,.22)",boxShadow:"0 18px 48px rgba(63,49,24,.10)",padding:"clamp(22px,5vw,52px) clamp(18px,6vw,58px) 50px",position:"relative",overflow:"hidden"}}>
   <div style={{position:"absolute",inset:10,border:"1px solid rgba(181,154,98,.20)",pointerEvents:"none"}}/>
   <div style={{position:"relative",zIndex:1}}>
    <div style={{textAlign:"center",padding:"12px 16px",marginBottom:showBasmala?18:24,border:"1px solid rgba(181,154,98,.32)",background:"linear-gradient(90deg,rgba(181,154,98,.06),rgba(255,255,255,.55),rgba(181,154,98,.06))",boxShadow:"inset 0 0 0 3px rgba(181,154,98,.045)"}}>
     <div style={{fontFamily:"'Amiri Quran','Noto Naskh Arabic',serif",fontSize:"clamp(27px,5vw,38px)",lineHeight:1.5}}>سُورَةُ {surah?.name?.replace(/^سُورَةُ\s*/,'')||""}</div>
     {surah&&<div style={{fontSize:10.5,opacity:.5,marginTop:3}}>{arNum(surah.numberOfAyahs)} آية · {surah.revelationType==="Meccan"?"مكية":"مدنية"}</div>}
    </div>
    {showBasmala&&<div style={{fontFamily:"'Amiri Quran','Noto Naskh Arabic',serif",fontSize:"clamp(24px,4.6vw,34px)",textAlign:"center",lineHeight:1.8,margin:"4px 0 18px"}}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>}
    {loading&&<div style={{textAlign:"center",padding:40,opacity:.5}}>تحميل السورة…</div>}
    {error&&<div style={{textAlign:"center",padding:40,color:"#8B3C31"}}>{error}</div>}
    {surah&&<div className="mushaf-flow" style={{fontFamily:"'Amiri Quran','Noto Naskh Arabic',serif",fontSize:"clamp(25px,4.7vw,36px)",lineHeight:2.2,textAlign:"justify",textAlignLast:"center",direction:"rtl",color:"#17140F"}}>{ayahs.map((a,i)=><React.Fragment key={a.number}><span>{surahId!==1&&i===0&&showBasmala?a.text.replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/,''):a.text}</span><span style={{display:"inline-grid",placeItems:"center",width:"1.7em",height:"1.7em",margin:"0 .22em",verticalAlign:"middle",borderRadius:"50%",border:"1px solid rgba(181,154,98,.75)",fontFamily:"'Amiri Quran','Noto Naskh Arabic',serif",fontSize:".48em",lineHeight:1,color:"#8E7642",background:"rgba(181,154,98,.045)"}}>{arNum(a.numberInSurah)}</span>{" "}</React.Fragment>)}</div>}
    {surah&&<div style={{textAlign:"center",marginTop:28,color:C.gold,fontSize:18}}>۞</div>}
   </div>
  </article>
 </div>;
}

export default function QuranCenter(){
 const [view,setView]=useState("home");
 const [surahId,setSurahId]=useState(1);
 const lang="ar";
 const last=useMemo(()=>lastRead(),[view]);
 const go=(to,payload={})=>{
  if(to==="quran-home"){setView("home");return}
  if(to==="surah-list"){setView("index");return}
  if(to==="reader"){
   const id=Number(payload?.surahId||1);setSurahId(id);
   try{localStorage.setItem("sakinah-quran-last-read",JSON.stringify({surahId:id}))}catch{}
   setView("reader");return;
  }
  emit(to);
 };
 if(view==="index")return <LiveSurahList lang={lang} go={go}/>;
 if(view==="reader")return <MushafReader surahId={surahId} go={go}/>;

 const tools=[
  ["quran-player","♪","الاستماع للقرآن","القرّاء · السور · التكرار · السرعة"],["tafsir-library","▥","التفسير","تفاسير متعددة للآيات والسور"],["islamic-search","⌕","البحث في القرآن","ابحث عن كلمة أو معنى أو آية"],["tadabbur-ayah","◌","تدبّر آية","تأملاتك الخاصة والآيات المرتبطة"],["memorization-center","◒","الحفظ والمراجعة","خطط حفظ ومراجعة وتقدم"],["smart-khatmah","✓","الختمة الذكية","تابع ختمتك وخطتك اليومية"],["quran-topics","⌘","موضوعات القرآن","الرحمة · الصبر · الأسرة · المال وغيرها"],["quran-roots","⌁","جذور القرآن","استكشاف الجذور والتصريفات القريبة"],["quran-compare","≍","مقارنة الكلمات","قارن الكلمات وأماكن ورودها"],["quran-entities","◇","خريطة الأسماء","الأنبياء · الأقوام · الأماكن · الملائكة"],["quran-analytics","◫","إحصاءات القرآن","إحصاءات الكلمات والحروف والذكر"],["quranic-duas","☾","الأدعية القرآنية","أدعية من القرآن الكريم"],["smart-quranic-adhkar","◎","الأذكار القرآنية","أذكار مرتبطة بالقرآن"],["saved-library","♡","محفوظات القرآن","ما حفظته من آيات ومواد قرآنية"]
 ];
 return <div style={{minHeight:"100vh",background:C.ivory,color:C.ink,padding:"24px 20px 118px"}} dir="rtl">
  <div style={{fontSize:11,letterSpacing:1.3,opacity:.4}}>SAKINAH · QURAN</div><div style={{fontFamily:"Fraunces,serif",fontSize:34,marginTop:5}}>القرآن الكريم</div><div style={{fontSize:12,opacity:.48,lineHeight:1.8,marginTop:6}}>كل ما يخص القراءة والاستماع والتفسير والحفظ والتدبّر في مكان واحد.</div>
  <button onClick={()=>go("surah-list")} style={{width:"100%",marginTop:22,border:0,borderRadius:28,padding:"24px 22px",minHeight:180,background:"linear-gradient(145deg,#173B57,#0B2436)",color:"white",fontFamily:"inherit",textAlign:"right",boxShadow:"0 18px 44px rgba(23,59,87,.18)",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",width:180,height:180,borderRadius:"50%",background:"rgba(231,210,155,.11)",left:-38,top:-54}}/><div style={{fontSize:11,opacity:.62}}>المصحف</div><div style={{fontFamily:"Fraunces,serif",fontSize:31,marginTop:10}}>تابع القراءة</div><div style={{fontSize:12,opacity:.62,lineHeight:1.8,marginTop:8}}>{last?.surahId?`آخر سورة فتحتها · رقم ${last.surahId}`:"افتح فهرس القرآن الكريم · ١١٤ سورة"}</div><div style={{display:"inline-flex",alignItems:"center",gap:8,marginTop:24,padding:"9px 13px",borderRadius:999,background:"rgba(255,255,255,.11)",border:"1px solid rgba(255,255,255,.13)"}}><span>فتح الفهرس</span><span style={{fontSize:18,color:"#E7D29B"}}>←</span></div></button>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"end",marginTop:26}}><div><div style={{fontSize:10,opacity:.4}}>أدوات القرآن</div><div style={{fontSize:20,marginTop:4}}>القراءة · الاستماع · الفهم</div></div><button onClick={()=>go("surah-list")} style={{border:0,background:"transparent",fontFamily:"inherit",color:C.lapis,fontSize:12}}>فهرس السور</button></div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:10,marginTop:14}}>{tools.map(([id,icon,title,sub])=><button key={id} onClick={()=>go(id)} style={{...card,minHeight:128}}><div style={{fontSize:25,color:C.gold}}>{icon}</div><div style={{fontSize:14,fontWeight:700,marginTop:17}}>{title}</div><div style={{fontSize:10.5,opacity:.45,lineHeight:1.6,marginTop:6}}>{sub}</div></button>)}</div>
 </div>;
}
