import React,{useMemo,useState} from "react";
import {LiveSurahList,LiveQuranReader} from "./liveCore.jsx";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62"};
const card={border:"1px solid rgba(16,16,15,.07)",borderRadius:20,padding:14,background:"rgba(255,255,255,.55)",fontFamily:"inherit",color:"inherit",textAlign:"right",boxShadow:"0 10px 26px rgba(16,16,15,.035)"};
function emit(id){window.dispatchEvent(new CustomEvent("sakinah:feature",{detail:id}))}
function lastRead(){try{return JSON.parse(localStorage.getItem("sakinah-quran-last-read")||"null")}catch{return null}}

export default function QuranCenter(){
 const [view,setView]=useState("home");
 const [surahId,setSurahId]=useState(1);
 const lang="ar";
 const last=useMemo(()=>lastRead(),[view]);
 const go=(to,payload={})=>{
  if(to==="quran-home"){setView("home");return}
  if(to==="surah-list"){setView("index");return}
  if(to==="reader"){
   const id=Number(payload?.surahId||1);
   setSurahId(id);
   try{localStorage.setItem("sakinah-quran-last-read",JSON.stringify({surahId:id}))}catch{}
   setView("reader");
   return;
  }
  emit(to);
 };
 if(view==="index")return <LiveSurahList lang={lang} go={go}/>;
 if(view==="reader")return <LiveQuranReader lang={lang} go={go} surahId={surahId}/>;

 const tools=[
  ["quran-player","♪","الاستماع للقرآن","القرّاء · السور · التكرار · السرعة"],
  ["tafsir-library","▥","التفسير","تفاسير متعددة للآيات والسور"],
  ["islamic-search","⌕","البحث في القرآن","ابحث عن كلمة أو معنى أو آية"],
  ["tadabbur-ayah","◌","تدبّر آية","تأملاتك الخاصة والآيات المرتبطة"],
  ["memorization-center","◒","الحفظ والمراجعة","خطط حفظ ومراجعة وتقدم"],
  ["smart-khatmah","✓","الختمة الذكية","تابع ختمتك وخطتك اليومية"],
  ["quran-topics","⌘","موضوعات القرآن","الرحمة · الصبر · الأسرة · المال وغيرها"],
  ["quran-roots","⌁","جذور القرآن","استكشاف الجذور والتصريفات القريبة"],
  ["quran-compare","≍","مقارنة الكلمات","قارن الكلمات وأماكن ورودها"],
  ["quran-entities","◇","خريطة الأسماء","الأنبياء · الأقوام · الأماكن · الملائكة"],
  ["quran-analytics","◫","إحصاءات القرآن","إحصاءات الكلمات والحروف والذكر"],
  ["quranic-duas","☾","الأدعية القرآنية","أدعية من القرآن الكريم"],
  ["smart-quranic-adhkar","◎","الأذكار القرآنية","أذكار مرتبطة بالقرآن"],
  ["saved-library","♡","محفوظات القرآن","ما حفظته من آيات ومواد قرآنية"],
 ];
 return <div style={{minHeight:"100vh",background:C.ivory,color:C.ink,padding:"24px 20px 118px"}} dir="rtl">
  <div style={{fontSize:11,letterSpacing:1.3,opacity:.4}}>SAKINAH · QURAN</div>
  <div style={{fontFamily:"Fraunces,serif",fontSize:34,marginTop:5}}>القرآن الكريم</div>
  <div style={{fontSize:12,opacity:.48,lineHeight:1.8,marginTop:6}}>كل ما يخص القراءة والاستماع والتفسير والحفظ والتدبّر في مكان واحد.</div>

  <button onClick={()=>go("surah-list")} style={{width:"100%",marginTop:22,border:0,borderRadius:28,padding:"24px 22px",minHeight:180,background:"linear-gradient(145deg,#173B57,#0B2436)",color:"white",fontFamily:"inherit",textAlign:"right",boxShadow:"0 18px 44px rgba(23,59,87,.18)",position:"relative",overflow:"hidden"}}>
   <div style={{position:"absolute",width:180,height:180,borderRadius:"50%",background:"rgba(231,210,155,.11)",left:-38,top:-54}}/>
   <div style={{fontSize:11,opacity:.62}}>المصحف</div>
   <div style={{fontFamily:"Fraunces,serif",fontSize:31,marginTop:10}}>تابع القراءة</div>
   <div style={{fontSize:12,opacity:.62,lineHeight:1.8,marginTop:8}}>{last?.surahId?`آخر سورة فتحتها · رقم ${last.surahId}`:"افتح فهرس القرآن الكريم · ١١٤ سورة"}</div>
   <div style={{display:"inline-flex",alignItems:"center",gap:8,marginTop:24,padding:"9px 13px",borderRadius:999,background:"rgba(255,255,255,.11)",border:"1px solid rgba(255,255,255,.13)"}}><span>فتح الفهرس</span><span style={{fontSize:18,color:"#E7D29B"}}>←</span></div>
  </button>

  <div style={{display:"flex",justifyContent:"space-between",alignItems:"end",marginTop:26}}><div><div style={{fontSize:10,opacity:.4}}>أدوات القرآن</div><div style={{fontSize:20,marginTop:4}}>القراءة · الاستماع · الفهم</div></div><button onClick={()=>go("surah-list")} style={{border:0,background:"transparent",fontFamily:"inherit",color:C.lapis,fontSize:12}}>فهرس السور</button></div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:10,marginTop:14}}>{tools.map(([id,icon,title,sub])=><button key={id} onClick={()=>go(id)} style={{...card,minHeight:128}}><div style={{fontSize:25,color:C.gold}}>{icon}</div><div style={{fontSize:14,fontWeight:700,marginTop:17}}>{title}</div><div style={{fontSize:10.5,opacity:.45,lineHeight:1.6,marginTop:6}}>{sub}</div></button>)}</div>
 </div>;
}
