import React,{useState} from "react";
import App from "./App.jsx";
import {TrustedDailyHub,QuranicDuasHub,SmartQuranicAdhkar,SourcedSeerahStories} from "./trustedDaily.jsx";
import {KidsWorldHub,KidsQuranTeacherLive,KidsQuizLive} from "./kidsWorld.jsx";
import {OfflineBackupCenter} from "./offlineBackup.jsx";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62"};

function KidsNasheedsLive({lang,go}){
 const [playing,setPlaying]=useState(false),[track,setTrack]=useState(0);
 const rows=lang==="ar"?["أحب ربي","صلاتي نور","بسم الله","الحمد لله","أخلاق المسلم","رمضان فرحة"]:["I Love My Lord","My Prayer is Light","Bismillah","Alhamdulillah","Muslim Manners","Ramadan Joy"];
 return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,padding:"22px 22px 120px",overflowY:"auto"}}>
  <button onClick={()=>go("kids-world")} style={{border:0,background:"transparent",fontFamily:"inherit",cursor:"pointer"}}>{lang==="ar"?"← الأطفال":"← Kids"}</button>
  <div style={{fontFamily:"Fraunces,serif",fontSize:29,marginTop:16}}>{lang==="ar"?"أناشيد إسلامية للأطفال":"Islamic Nasheeds for Kids"}</div>
  <div style={{fontSize:11.5,opacity:.48,marginTop:7}}>{lang==="ar"?"واجهة أناشيد بدون موسيقى. الصوت الفعلي لا يُربط إلا بمصدر مرخّص.":"Vocals-only kids nasheed interface. Audio is connected only from a licensed source."}</div>
  <div style={{marginTop:18,borderRadius:26,padding:20,background:"linear-gradient(135deg,#FFF0C9,#DFF6FF 60%,#F3E7FF)",textAlign:"center"}}>
   <div style={{width:132,height:132,borderRadius:36,margin:"0 auto",display:"grid",placeItems:"center",fontSize:48,background:"rgba(255,255,255,.58)"}}>♪</div>
   <div style={{fontFamily:"Fraunces,serif",fontSize:23,marginTop:14}}>{rows[track]}</div>
   <div style={{display:"grid",gridTemplateColumns:"44px 62px 44px",justifyContent:"center",gap:10,marginTop:16}}>
    <button onClick={()=>{setTrack(v=>(v-1+rows.length)%rows.length);setPlaying(false)}} style={{border:0,borderRadius:"50%",background:"rgba(255,255,255,.7)",fontSize:20}}>‹</button>
    <button onClick={()=>setPlaying(v=>!v)} style={{height:62,border:0,borderRadius:"50%",background:C.lapis,color:"white",fontSize:20}}>{playing?"Ⅱ":"▶"}</button>
    <button onClick={()=>{setTrack(v=>(v+1)%rows.length);setPlaying(false)}} style={{border:0,borderRadius:"50%",background:"rgba(255,255,255,.7)",fontSize:20}}>›</button>
   </div>
  </div>
  <div style={{marginTop:12}}>{rows.map((x,i)=><button key={x} onClick={()=>{setTrack(i);setPlaying(false)}} style={{width:"100%",display:"grid",gridTemplateColumns:"38px 1fr",gap:10,alignItems:"center",padding:"11px 0",border:0,borderTop:"1px solid rgba(16,16,15,.07)",background:i===track?"rgba(181,154,98,.08)":"transparent",fontFamily:"inherit",textAlign:lang==="ar"?"right":"left",color:"inherit"}}><div style={{width:34,height:34,borderRadius:12,display:"grid",placeItems:"center",background:"rgba(181,154,98,.12)"}}>♪</div><div><b style={{fontSize:12.5}}>{x}</b><small style={{display:"block",opacity:.42,marginTop:3}}>{lang==="ar"?"بدون موسيقى · المصدر الصوتي يحتاج ترخيص":"Vocals only · licensed audio source required"}</small></div></button>)}</div>
 </div>
}

function LiveHub({lang,setLang,go}){
 const cards=[
  ["trusted-daily","المحتوى الموثق","Sourced Content","القرآن والأدعية والأذكار والسيرة بمراجع واضحة","Quran, duas, adhkar and seerah with clear provenance"],
  ["kids-world","سكينة للأطفال","Sakinah Kids","معلّم قرآن ومسابقات وقصص وأناشيد","Quran teacher, quizzes, stories and nasheeds"],
  ["offline-backup","النسخ و Offline","Backup & Offline","تصدير واستعادة البيانات وفحص التخزين المحلي","Export/restore data and inspect offline storage"],
 ];
 return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,padding:"22px 22px 120px",overflowY:"auto"}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><button onClick={()=>go("app")} style={{border:0,background:"transparent",fontFamily:"inherit",cursor:"pointer"}}>{lang==="ar"?"← سكينة":"← Sakinah"}</button><button onClick={()=>setLang(lang==="ar"?"en":"ar")} style={{border:0,background:"transparent",fontWeight:700}}>{lang==="ar"?"EN":"ع"}</button></div>
  <div style={{fontFamily:"Fraunces,serif",fontSize:30,marginTop:18}}>{lang==="ar"?"سكينة · الوحدات المدمجة":"Sakinah · Integrated Modules"}</div>
  <div style={{fontSize:11.5,opacity:.5,lineHeight:1.7,marginTop:8}}>{lang==="ar"?"هذه الوحدات تعمل داخل نفس التطبيق ونفس التشغيل، وليست مشروعاً منفصلاً.":"These modules run inside the same app runtime, not as a separate project."}</div>
  <div style={{marginTop:18,display:"grid",gap:10}}>{cards.map(([id,ar,en,sa,se])=><button key={id} onClick={()=>go(id)} style={{padding:17,borderRadius:19,border:"1px solid rgba(16,16,15,.08)",background:"rgba(255,255,255,.48)",textAlign:lang==="ar"?"right":"left",fontFamily:"inherit",color:"inherit"}}><div style={{fontSize:14,fontWeight:650}}>{lang==="ar"?ar:en}</div><div style={{fontSize:10.5,opacity:.47,lineHeight:1.6,marginTop:6}}>{lang==="ar"?sa:se}</div></button>)}</div>
 </div>
}

export default function MergedSakinah(){
 const [panel,setPanel]=useState("app"),[lang,setLang]=useState("ar");
 const go=(to)=>{const known=new Set(["app","live-hub","trusted-daily","quranic-duas","smart-quranic-adhkar","sourced-seerah","kids-sourced-stories","kids-world","kids-home","kids-quran-live","kids-quiz-live","kids-nasheeds","offline-backup"]);setPanel(known.has(to)?to:"app")};
 const screens={
  "live-hub":<LiveHub lang={lang} setLang={setLang} go={go}/>,
  "trusted-daily":<TrustedDailyHub lang={lang} go={go}/>,
  "quranic-duas":<QuranicDuasHub lang={lang} go={go}/>,
  "smart-quranic-adhkar":<SmartQuranicAdhkar lang={lang} go={go}/>,
  "sourced-seerah":<SourcedSeerahStories lang={lang} go={go}/>,
  "kids-sourced-stories":<SourcedSeerahStories lang={lang} go={go} kids/>,
  "kids-world":<KidsWorldHub lang={lang} go={go}/>,
  "kids-home":<KidsWorldHub lang={lang} go={go}/>,
  "kids-quran-live":<KidsQuranTeacherLive lang={lang} go={go}/>,
  "kids-quiz-live":<KidsQuizLive lang={lang} go={go}/>,
  "kids-nasheeds":<KidsNasheedsLive lang={lang} go={go}/>,
  "offline-backup":<OfflineBackupCenter lang={lang} go={go}/>,
 };
 return <div style={{position:"relative",minHeight:"100vh"}}>{panel==="app"?<><App/><button aria-label="Integrated Sakinah modules" onClick={()=>setPanel("live-hub")} style={{position:"fixed",right:18,bottom:18,zIndex:9999,width:46,height:46,borderRadius:"50%",border:"1px solid rgba(181,154,98,.5)",background:"rgba(246,243,236,.94)",boxShadow:"0 8px 28px rgba(0,0,0,.16)",color:C.gold,fontSize:20,cursor:"pointer"}}>✦</button></>:screens[panel]||screens["live-hub"]}</div>
}
