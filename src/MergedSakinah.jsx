import React,{useState} from "react";
import App from "./App.jsx";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62"};
const baseBtn={border:"1px solid rgba(16,16,15,.08)",borderRadius:18,padding:14,background:"rgba(255,255,255,.55)",fontFamily:"inherit",color:"inherit"};

function openFeature(id){window.dispatchEvent(new CustomEvent("sakinah:feature",{detail:id}))}

function DiscoverHub({lang,go}){
 const cards=[
  ["islamic-search","⌕","البحث الإسلامي وذكاء القرآن","Islamic Search & Quran Intelligence"],
  ["daily-reflection","◌","تأمّل","Reflection"],
  ["trusted-daily","✦","المحتوى الموثق","Sourced Content"],
  ["kids-world","☀","عالم الأطفال","Kids World"],
  ["saved-library","♡","مكتبتي","My Library"],
  ["daily-tools","☼","أدوات العبادة اليومية","Daily Worship Tools"],
 ];
 return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,overflowY:"auto",padding:"28px 22px 130px"}} dir={lang==="ar"?"rtl":"ltr"}>
  <div style={{fontSize:11,letterSpacing:1.6,opacity:.42}}>{lang==="ar"?"سكينة":"SAKINAH"}</div>
  <div style={{fontFamily:"Fraunces,serif",fontSize:34,marginTop:6}}>{lang==="ar"?"اكتشف":"Discover"}</div>
  <div style={{fontSize:12,opacity:.5,lineHeight:1.8,marginTop:6}}>{lang==="ar"?"كل أدوات سكينة في مكان هادئ وواضح، وكل بطاقة تفتح الميزة الفعلية.":"All Sakinah tools in one calm place, with every card opening the real feature."}</div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:22}}>{cards.map(([id,icon,ar,en],i)=><button key={id} onClick={()=>go(id)} style={{...baseBtn,minHeight:i<2?128:108,textAlign:lang==="ar"?"right":"left",background:i===0?"linear-gradient(145deg,#173B57,#0C293E)":"rgba(255,255,255,.58)",color:i===0?"white":C.ink,boxShadow:"0 12px 32px rgba(16,16,15,.05)"}}><div style={{fontSize:24,color:i===0?"#E7D29B":C.gold}}>{icon}</div><div style={{fontSize:14,fontWeight:700,lineHeight:1.45,marginTop:18}}>{lang==="ar"?ar:en}</div></button>)}</div>
  <button onClick={()=>go("offline-backup")} style={{...baseBtn,width:"100%",marginTop:10,textAlign:lang==="ar"?"right":"left"}}>{lang==="ar"?"البيانات · Offline · النسخ الاحتياطي":"Data · Offline · Backup"}</button>
 </div>
}

function ProfileHub({lang,go}){
 const rows=[
  ["saved-library","♡","المكتبة المحفوظة","Saved Library"],
  ["offline-backup","◫","البيانات والنسخ الاحتياطي","Data & Backup"],
  ["privacy-lock","⌾","قفل الخصوصية","Privacy Lock"],
  ["parental-controls","☀","الرقابة الأبوية","Parental Controls"],
  ["card-maker","◇","صانع البطاقات","Card Maker"],
 ];
 return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,overflowY:"auto",padding:"28px 22px 130px"}} dir={lang==="ar"?"rtl":"ltr"}>
  <div style={{width:72,height:72,borderRadius:24,display:"grid",placeItems:"center",background:"linear-gradient(145deg,#173B57,#0C293E)",color:"white",fontSize:26,boxShadow:"0 14px 32px rgba(23,59,87,.18)"}}>س</div>
  <div style={{fontFamily:"Fraunces,serif",fontSize:31,marginTop:15}}>{lang==="ar"?"أنا":"Me"}</div>
  <div style={{fontSize:11.5,opacity:.48,marginTop:5}}>{lang==="ar"?"ملفك، محفوظاتك وخصوصيتك":"Your profile, library and privacy"}</div>
  <div style={{marginTop:22,borderRadius:24,overflow:"hidden",border:"1px solid rgba(16,16,15,.07)",background:"rgba(255,255,255,.48)"}}>{rows.map(([id,icon,ar,en])=><button key={id} onClick={()=>go(id)} style={{width:"100%",display:"grid",gridTemplateColumns:"38px 1fr auto",gap:10,alignItems:"center",padding:"15px 14px",border:0,borderBottom:"1px solid rgba(16,16,15,.06)",background:"transparent",fontFamily:"inherit",color:"inherit",textAlign:lang==="ar"?"right":"left"}}><span style={{color:C.gold,fontSize:18}}>{icon}</span><span style={{fontSize:12.5,fontWeight:650}}>{lang==="ar"?ar:en}</span><span style={{opacity:.3}}>{lang==="ar"?"‹":"›"}</span></button>)}</div>
 </div>
}

function UnifiedNav({lang,panel,go}){
 const items=[["app","الرئيسية","Home","⌂"],["quran-intelligence","القرآن","Quran","▥"],["my-day","يومي","My Day","☼"],["discover","اكتشف","Discover","⌕"],["profile","أنا","Me","♙"]];
 return <nav aria-label="Sakinah primary" style={{position:"fixed",left:"50%",transform:"translateX(-50%)",bottom:10,zIndex:10000,width:"min(500px,calc(100vw - 18px))",padding:"7px 8px",borderRadius:25,border:"1px solid rgba(16,16,15,.08)",background:"rgba(246,243,236,.95)",backdropFilter:"blur(20px)",boxShadow:"0 14px 40px rgba(16,16,15,.13)",display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:3}}>
  {items.map(([id,ar,en,icon])=>{const on=panel===id;return <button key={id} onClick={()=>go(id)} style={{border:0,borderRadius:17,padding:"8px 3px 7px",background:on?"rgba(181,154,98,.15)":"transparent",color:on?C.lapis:"rgba(16,16,15,.58)",fontFamily:"inherit",display:"grid",gap:4,placeItems:"center",minWidth:0}}><span style={{fontSize:17,lineHeight:1,color:on?C.gold:"inherit"}}>{icon}</span><span style={{fontSize:9,fontWeight:on?750:550,whiteSpace:"nowrap"}}>{lang==="ar"?ar:en}</span></button>})}
 </nav>;
}

export default function MergedSakinah(){
 const [panel,setPanel]=useState("app");
 const lang="ar";
 const go=to=>{
  if(to==="app"||to==="discover"||to==="profile"){setPanel(to);return}
  openFeature(to);
 };
 return <div style={{position:"relative",minHeight:"100vh",background:C.ivory}}>
  {panel==="app"?<App/>:panel==="discover"?<DiscoverHub lang={lang} go={go}/>:<ProfileHub lang={lang} go={go}/>}
  <UnifiedNav lang={lang} panel={panel} go={go}/>
 </div>;
}
