import React,{useEffect,useRef,useState} from "react";
import SakinahLiveHome from "./SakinahLiveHome.jsx";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62"};
const baseBtn={border:"1px solid rgba(16,16,15,.08)",borderRadius:18,padding:14,background:"rgba(255,255,255,.55)",fontFamily:"inherit",color:"inherit"};
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
const activeProfile=()=>{try{return localStorage.getItem("sakinah-active-profile")||"me"}catch{return"me"}};

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

function ProfileGroup({title,rows,lang,go}){
 return <section style={{marginTop:19}}>
  <div style={{fontSize:10.5,opacity:.42,marginBottom:8}}>{title}</div>
  <div style={{borderRadius:24,overflow:"hidden",border:"1px solid rgba(16,16,15,.07)",background:"rgba(255,255,255,.48)"}}>{rows.map(([id,icon,ar,en,subAr,subEn])=><button key={id} onClick={()=>go(id)} style={{width:"100%",display:"grid",gridTemplateColumns:"38px 1fr auto",gap:10,alignItems:"center",padding:"14px",border:0,borderBottom:"1px solid rgba(16,16,15,.06)",background:"transparent",fontFamily:"inherit",color:"inherit",textAlign:lang==="ar"?"right":"left"}}><span style={{color:C.gold,fontSize:18}}>{icon}</span><span><span style={{display:"block",fontSize:12.5,fontWeight:650}}>{lang==="ar"?ar:en}</span><small style={{display:"block",fontSize:9.5,opacity:.42,marginTop:3,lineHeight:1.45}}>{lang==="ar"?subAr:subEn}</small></span><span style={{opacity:.3}}>{lang==="ar"?"‹":"›"}</span></button>)}</div>
 </section>
}

function ProfileHub({lang,go}){
 const fileRef=useRef(null);
 const [profileId,setProfileId]=useState(activeProfile());
 const profiles=read("sakinah-profiles",[{id:"me",nameAr:"أنا",nameEn:"Me",kind:"adult",age:""}]);
 const current=profiles.find(p=>p.id===profileId)||profiles[0]||{id:"me",nameAr:"أنا",nameEn:"Me",kind:"adult"};
 const avatarKey=`sakinah-profile-avatar-${profileId}`;
 const nameKey=`sakinah-profile-display-name-${profileId}`;
 const [avatar,setAvatar]=useState(()=>localStorage.getItem(avatarKey)||"");
 const [displayName,setDisplayName]=useState(()=>localStorage.getItem(nameKey)||(lang==="ar"?current.nameAr:current.nameEn)||"أنا");
 const [editing,setEditing]=useState(false);
 useEffect(()=>{const h=()=>{const id=activeProfile();setProfileId(id);const ps=read("sakinah-profiles",[]);const p=ps.find(x=>x.id===id)||ps[0]||{nameAr:"أنا",nameEn:"Me"};setAvatar(localStorage.getItem(`sakinah-profile-avatar-${id}`)||"");setDisplayName(localStorage.getItem(`sakinah-profile-display-name-${id}`)||(lang==="ar"?p.nameAr:p.nameEn)||"أنا")};window.addEventListener("sakinah-profile-change",h);return()=>window.removeEventListener("sakinah-profile-change",h)},[lang]);
 const saveName=()=>{const n=displayName.trim()||"أنا";setDisplayName(n);localStorage.setItem(nameKey,n);setEditing(false)};
 const chooseAvatar=e=>{const f=e.target.files?.[0];if(!f||!f.type.startsWith("image/"))return;const r=new FileReader();r.onload=()=>{const v=String(r.result||"");setAvatar(v);try{localStorage.setItem(avatarKey,v)}catch{}};r.readAsDataURL(f);e.target.value=""};
 const familyRows=[
  ["kids-world","☀","عالم الأطفال","Kids World","كل محتوى الأطفال من مكان واحد","All kids content in one place"],
  ["kids-quran-live","▥","معلم القرآن للأطفال","Kids Quran Teacher","تعلم القرآن ومتابعة الطفل","Quran learning for children"],
  ["kids-quiz-live","?","مسابقات الأطفال","Kids Quizzes","أسئلة ومسابقات دينية","Islamic quizzes for children"],
  ["kids-nasheeds","♪","أناشيد الطفل الجميلة","Kids Nasheeds","أناشيد مخصصة للأطفال","Nasheeds made for children"],
  ["parental-controls","☼","الرقابة الأبوية","Parental Controls","الوقت والصلاحيات ومحتوى الطفل","Time, permissions and child content"]
 ];
 const personalRows=[
  ["notes","✎","دفتر الملاحظات","Notes Notebook","ملاحظات هذا البروفايل","Notes for this profile"],
  ["accounts","⌁","دفتر الحسابات","Accounts Notebook","الحسابات الشخصية لهذا البروفايل","Personal ledger for this profile"],
  ["profiles","♙","البروفايلات","Profiles","تبديل وإدارة أفراد العائلة","Switch and manage family profiles"],
  ["card-maker","◇","صانع البطاقات الإسلامية","Islamic Card Maker","إنشاء وحفظ بطاقاتك","Create and save your cards"],
  ["saved-library","♡","المحفوظات","Saved Library","كل ما حفظته للرجوع إليه","Everything you saved"],
  ["tasbeeh","○","المسبحة وتقدمي","Tasbeeh & Progress","عدادك وسجل ذكرك اليومي","Your tasbeeh and daily progress"]
 ];
 const systemRows=[
  ["alerts","◉","المؤذن والتنبيهات","Adhan & Alerts","الصلاة والأذكار والتذكيرات","Prayer, dhikr and reminders"],
  ["adhan-audio","♪","أصوات الأذان لكل صلاة","Adhan Sounds","اختيار صوت الأذان وإعداداته","Choose and configure adhan audio"],
  ["widget","▦","Widget","Widget","الويدجت وشاشة القفل","Widget and lock-screen preview"],
  ["privacy-lock","◎","قفل الخصوصية","Privacy Lock","حماية بيانات البروفايل","Protect profile data"],
  ["offline-backup","◫","البيانات والنسخ الاحتياطي","Data & Backup","بياناتك ونسختك الاحتياطية","Your data and backup"]
 ];
 return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,overflowY:"auto",padding:"28px 22px 130px"}} dir={lang==="ar"?"rtl":"ltr"}>
  <input ref={fileRef} type="file" accept="image/*" onChange={chooseAvatar} style={{display:"none"}}/>
  <div style={{display:"flex",alignItems:"center",gap:15}}>
   <button onClick={()=>fileRef.current?.click()} aria-label={lang==="ar"?"تغيير صورة البروفايل":"Change profile image"} style={{width:78,height:78,padding:0,borderRadius:26,border:"1px solid rgba(16,16,15,.07)",overflow:"hidden",display:"grid",placeItems:"center",background:"linear-gradient(145deg,#173B57,#0C293E)",color:"white",fontFamily:"inherit",fontSize:27,boxShadow:"0 14px 32px rgba(23,59,87,.18)",flex:"0 0 auto"}}>{avatar?<img src={avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span>{(displayName||"س").trim().slice(0,1)}</span>}</button>
   <div style={{minWidth:0,flex:1}}>
    {editing?<div style={{display:"flex",gap:7}}><input autoFocus value={displayName} onChange={e=>setDisplayName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveName()} style={{...baseBtn,width:"100%",boxSizing:"border-box",padding:"10px 12px",background:"rgba(255,255,255,.52)",fontSize:18}}/><button onClick={saveName} style={{...baseBtn,padding:"10px 12px"}}>✓</button></div>:<button onClick={()=>setEditing(true)} style={{border:0,padding:0,background:"transparent",fontFamily:"Fraunces,serif",fontSize:31,color:"inherit",textAlign:lang==="ar"?"right":"left",maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{displayName}</button>}
    <div style={{fontSize:11.5,opacity:.48,marginTop:5}}>{current.kind==="child"?(lang==="ar"?"ملف طفل · بياناته وتقدمه مستقلان":"Child profile · independent data"):lang==="ar"?"ملفك، محفوظاتك وخصوصيتك":"Your profile, library and privacy"}</div>
    <button onClick={()=>fileRef.current?.click()} style={{border:0,background:"transparent",padding:0,marginTop:7,fontFamily:"inherit",fontSize:10,color:C.gold}}>{lang==="ar"?"تغيير الصورة":"Change photo"}</button>
   </div>
  </div>
  <ProfileGroup title={lang==="ar"?"الأطفال والعائلة":"FAMILY & KIDS"} rows={familyRows} lang={lang} go={go}/>
  <ProfileGroup title={lang==="ar"?"الشخصي والإبداع":"PERSONAL & CREATIVE"} rows={personalRows} lang={lang} go={go}/>
  <ProfileGroup title={lang==="ar"?"التنبيهات والنظام":"NOTIFICATIONS & SYSTEM"} rows={systemRows} lang={lang} go={go}/>
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
  {panel==="app"?<SakinahLiveHome/>:panel==="discover"?<DiscoverHub lang={lang} go={go}/>:<ProfileHub lang={lang} go={go}/>}
  <UnifiedNav lang={lang} panel={panel} go={go}/>
 </div>;
}
