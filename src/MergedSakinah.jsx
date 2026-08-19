import React,{useEffect,useRef,useState} from "react";
import SakinahLiveHome from "./SakinahLiveHome.jsx";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62"};
const baseBtn={border:"1px solid rgba(16,16,15,.08)",borderRadius:18,padding:14,background:"rgba(255,255,255,.55)",fontFamily:"inherit",color:"inherit"};
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
const activeProfile=()=>{try{return localStorage.getItem("sakinah-active-profile")||"me"}catch{return"me"}};
function openFeature(id){window.dispatchEvent(new CustomEvent("sakinah:feature",{detail:id}))}
function profileAvatarKey(id){return `sakinah-profile-avatar-${id||activeProfile()}`}
function profileNameKey(id){return `sakinah-profile-display-name-${id||activeProfile()}`}
function recoverAvatar(id){
 try{
  const direct=localStorage.getItem(profileAvatarKey(id));
  if(direct)return direct;
  const legacy=["sakinah-profile-avatar","sakinah-avatar","profile-avatar"];
  for(const key of legacy){const v=localStorage.getItem(key);if(v)return v}
  for(let i=0;i<localStorage.length;i++){
   const key=localStorage.key(i);
   if(key&&key.startsWith("sakinah-profile-avatar-")){
    const v=localStorage.getItem(key);
    if(v)return v;
   }
  }
 }catch{}
 return "";
}
function readSharedProfile(lang="ar"){
 const id=activeProfile();
 const profiles=read("sakinah-profiles",[{id:"me",nameAr:"أنا",nameEn:"Me",kind:"adult",age:""}]);
 const current=profiles.find(p=>p.id===id)||profiles[0]||{id:"me",nameAr:"أنا",nameEn:"Me",kind:"adult"};
 let avatar="",name=lang==="ar"?current.nameAr:current.nameEn;
 try{
  avatar=recoverAvatar(id);
  name=localStorage.getItem(profileNameKey(id))||name||"أنا";
  if(avatar&&!localStorage.getItem(profileAvatarKey(id)))try{localStorage.setItem(profileAvatarKey(id),avatar)}catch{}
 }catch{}
 return {id,avatar,name,current};
}
function compressAvatar(file){
 return new Promise((resolve,reject)=>{
  const reader=new FileReader();
  reader.onerror=()=>reject(new Error("read"));
  reader.onload=()=>{
   const img=new Image();
   img.onerror=()=>reject(new Error("image"));
   img.onload=()=>{
    const size=256,scale=Math.max(size/img.width,size/img.height),sw=size/scale,sh=size/scale,sx=(img.width-sw)/2,sy=(img.height-sh)/2;
    const canvas=document.createElement("canvas");canvas.width=size;canvas.height=size;
    const ctx=canvas.getContext("2d",{alpha:false});if(!ctx){reject(new Error("canvas"));return}
    ctx.drawImage(img,sx,sy,sw,sh,0,0,size,size);
    resolve(canvas.toDataURL("image/jpeg",.82));
   };
   img.src=String(reader.result||"");
  };
  reader.readAsDataURL(file);
 });
}

function DiscoverSection({title,rows,lang,go}){
 return <section style={{marginTop:20}}>
  <div style={{fontSize:10.5,opacity:.42,marginBottom:8}}>{title}</div>
  <div style={{borderRadius:24,overflow:"hidden",border:"1px solid rgba(16,16,15,.07)",background:"rgba(255,255,255,.5)"}}>
   {rows.map(([id,icon,ar,en,subAr,subEn])=><button key={id} onClick={()=>go(id)} style={{width:"100%",display:"grid",gridTemplateColumns:"38px 1fr auto",gap:10,alignItems:"center",padding:"14px",border:0,borderBottom:"1px solid rgba(16,16,15,.06)",background:"transparent",fontFamily:"inherit",color:"inherit",textAlign:lang==="ar"?"right":"left"}}><span style={{fontSize:18,color:C.gold}}>{icon}</span><span><span style={{display:"block",fontSize:12.5,fontWeight:650}}>{lang==="ar"?ar:en}</span><small style={{display:"block",fontSize:9.5,opacity:.42,marginTop:3,lineHeight:1.45}}>{lang==="ar"?subAr:subEn}</small></span><span style={{opacity:.28}}>{lang==="ar"?"‹":"›"}</span></button>)}
  </div>
 </section>
}

function DiscoverHub({lang,go}){
 const featured=[["trusted-daily","✦","المحتوى الموثق","Sourced Content","محتوى إسلامي موثوق بالمصادر","Sourced Islamic content"]];
 const knowledge=[
  ["names-live","◉","أسماء الله الحسنى","Names of Allah","الأسماء الحسنى ومعانيها","The Beautiful Names and meanings"],
  ["sourced-seerah","▤","السيرة والقصص الموثقة","Sourced Seerah & Stories","السيرة والقصص الإسلامية من مصادر موثوقة","Sourced Seerah and Islamic stories"],
  ["guide","◎","تعليم الصلاة والوضوء","Prayer & Wudu Guide","شرح مبسط ومتعدد اللغات","Simple multilingual learning guide"]
 ];
 const worship=[
  ["islamic-calendar","▦","التقويم الإسلامي","Islamic Calendar","المناسبات والأيام الهجرية","Hijri dates and occasions"],
  ["zakat","◇","الزكاة","Zakat","حساب وإرشادات الزكاة","Zakat calculator and guidance"],
  ["manasik","△","المناسك","Manasik","دليل الحج والعمرة","Hajj and Umrah guide"]
 ];
 return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,overflowY:"auto",padding:"28px 22px 130px"}} dir={lang==="ar"?"rtl":"ltr"}>
  <div style={{fontSize:11,letterSpacing:1.6,opacity:.42}}>{lang==="ar"?"سكينة":"SAKINAH"}</div>
  <div style={{fontFamily:"Fraunces,serif",fontSize:34,marginTop:6}}>{lang==="ar"?"اكتشف":"Discover"}</div>
  <div style={{fontSize:12,opacity:.5,lineHeight:1.8,marginTop:6}}>{lang==="ar"?"الخدمات التي لا تملك مكاناً دائماً في القرآن أو يومي أو أنا تجدها هنا فقط.":"Services without a permanent home in Quran, My Day or Me live here only."}</div>
  <div style={{display:"grid",gridTemplateColumns:"1fr",gap:10,marginTop:22}}>{featured.map(([id,icon,ar,en,subAr,subEn])=><button key={id} onClick={()=>go(id)} style={{...baseBtn,minHeight:118,textAlign:lang==="ar"?"right":"left",background:"linear-gradient(145deg,#173B57,#0C293E)",color:"white",boxShadow:"0 12px 32px rgba(16,16,15,.05)"}}><div style={{fontSize:24,color:"#E7D29B"}}>{icon}</div><div style={{fontSize:14,fontWeight:700,lineHeight:1.45,marginTop:16}}>{lang==="ar"?ar:en}</div><small style={{display:"block",fontSize:9.5,opacity:.52,marginTop:5,lineHeight:1.5}}>{lang==="ar"?subAr:subEn}</small></button>)}</div>
  <DiscoverSection title={lang==="ar"?"المعرفة والإيمان":"KNOWLEDGE & FAITH"} rows={knowledge} lang={lang} go={go}/>
  <DiscoverSection title={lang==="ar"?"خدمات ومناسبات":"SERVICES & OCCASIONS"} rows={worship} lang={lang} go={go}/>
 </div>
}

function ProfileGroup({title,rows,lang,go}){
 return <section style={{marginTop:19}}>
  <div style={{fontSize:10.5,opacity:.42,marginBottom:8}}>{title}</div>
  <div style={{borderRadius:24,overflow:"hidden",border:"1px solid rgba(16,16,15,.07)",background:"rgba(255,255,255,.48)"}}>{rows.map(([id,icon,ar,en,subAr,subEn])=><button key={id} onClick={()=>go(id)} style={{width:"100%",display:"grid",gridTemplateColumns:"38px 1fr auto",gap:10,alignItems:"center",padding:"14px",border:0,borderBottom:"1px solid rgba(16,16,15,.06)",background:"transparent",fontFamily:"inherit",color:"inherit",textAlign:lang==="ar"?"right":"left"}}><span style={{color:C.gold,fontSize:18}}>{icon}</span><span><span style={{display:"block",fontSize:12.5,fontWeight:650}}>{lang==="ar"?ar:en}</span><small style={{display:"block",fontSize:9.5,opacity:.42,marginTop:3,lineHeight:1.45}}>{lang==="ar"?subAr:subEn}</small></span><span style={{opacity:.3}}>{lang==="ar"?"‹":"›"}</span></button>)}</div>
 </section>
}

function ProfileHub({lang,go,profile,onProfileChange}){
 const fileRef=useRef(null);
 const [editing,setEditing]=useState(false);
 const [draftName,setDraftName]=useState(profile.name||"أنا");
 const [avatarError,setAvatarError]=useState("");
 useEffect(()=>setDraftName(profile.name||"أنا"),[profile.name]);
 const saveName=()=>{const n=draftName.trim()||"أنا";onProfileChange({name:n});try{localStorage.setItem(profileNameKey(profile.id),n)}catch{};setEditing(false)};
 const chooseAvatar=async e=>{
  const f=e.target.files?.[0];e.target.value="";
  if(!f||!f.type.startsWith("image/"))return;
  setAvatarError("");
  try{
   const v=await compressAvatar(f);
   onProfileChange({avatar:v});
   try{localStorage.setItem(profileAvatarKey(profile.id),v)}catch{setAvatarError(lang==="ar"?"تم عرض الصورة، لكن تعذر حفظها بعد إغلاق التطبيق.":"Photo is shown, but could not be saved after closing the app.")}
  }catch{setAvatarError(lang==="ar"?"تعذر قراءة الصورة. اختر صورة أخرى.":"Could not read the image. Choose another image.")}
 };
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
 const current=profile.current||{kind:"adult"};
 return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,overflowY:"auto",padding:"28px 22px 130px"}} dir={lang==="ar"?"rtl":"ltr"}>
  <input ref={fileRef} type="file" accept="image/*" onChange={chooseAvatar} style={{display:"none"}}/>
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",gap:10,paddingTop:4,paddingBottom:4}}>
   <button className="sakinah-profile-avatar" onClick={()=>fileRef.current?.click()} aria-label={lang==="ar"?"تغيير صورة البروفايل":"Change profile image"} style={{width:92,height:92,padding:0,borderRadius:"50%",border:0,overflow:"hidden",display:"grid",placeItems:"center",background:"transparent",color:"white",fontFamily:"inherit",fontSize:30,boxShadow:"none",filter:"none",outline:0,flex:"0 0 auto"}}>{profile.avatar?<img src={profile.avatar} alt="" style={{display:"block",width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%",border:0,boxShadow:"none",filter:"none",outline:0}}/>:<span style={{color:C.lapis}}>{(profile.name||"س").trim().slice(0,1)}</span>}</button>
   <div style={{minWidth:0,width:"100%",maxWidth:310}}>
    {editing?<div style={{display:"flex",gap:7,justifyContent:"center"}}><input autoFocus value={draftName} onChange={e=>setDraftName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveName()} style={{...baseBtn,width:"100%",boxSizing:"border-box",padding:"10px 12px",background:"rgba(255,255,255,.52)",fontSize:18,textAlign:"center"}}/><button onClick={saveName} style={{...baseBtn,padding:"10px 12px"}}>✓</button></div>:<button onClick={()=>setEditing(true)} style={{border:0,padding:0,background:"transparent",fontFamily:"Fraunces,serif",fontSize:31,color:"inherit",textAlign:"center",maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{profile.name}</button>}
    <div style={{fontSize:11.5,opacity:.48,marginTop:5}}>{current.kind==="child"?(lang==="ar"?"ملف طفل · بياناته وتقدمه مستقلان":"Child profile · independent data"):lang==="ar"?"ملفك، محفوظاتك وخصوصيتك":"Your profile, library and privacy"}</div>
    <button onClick={()=>fileRef.current?.click()} style={{border:0,background:"transparent",padding:0,marginTop:7,fontFamily:"inherit",fontSize:10,color:C.gold}}>{lang==="ar"?"تغيير الصورة":"Change photo"}</button>
    {avatarError&&<div role="status" style={{fontSize:10,color:"#9B2C2C",marginTop:7,lineHeight:1.5}}>{avatarError}</div>}
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
 const [profile,setProfile]=useState(()=>readSharedProfile(lang));
 useEffect(()=>{const sync=()=>setProfile(readSharedProfile(lang));window.addEventListener("storage",sync);window.addEventListener("sakinah-profile-change",sync);return()=>{window.removeEventListener("storage",sync);window.removeEventListener("sakinah-profile-change",sync)}},[]);
 const updateProfile=patch=>setProfile(p=>({...p,...patch}));
 const go=to=>{if(to==="app"||to==="discover"||to==="profile"){setPanel(to);return}openFeature(to)};
 return <div style={{position:"relative",minHeight:"100vh",background:C.ivory}}>
  <style>{`.sakinah-profile-avatar,.sakinah-profile-avatar img{border:0!important;outline:0!important;box-shadow:none!important;filter:none!important;background:transparent!important;-webkit-appearance:none!important;appearance:none!important}.sakinah-profile-avatar{border-radius:50%!important;overflow:hidden!important}.sakinah-profile-avatar img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;border-radius:50%!important}`}</style>
  {panel==="app"?<SakinahLiveHome profileAvatar={profile.avatar} profileName={profile.name} onOpenProfile={()=>setPanel("profile")}/>:panel==="discover"?<DiscoverHub lang={lang} go={go}/>:<ProfileHub lang={lang} go={go} profile={profile} onProfileChange={updateProfile}/>}
  <UnifiedNav lang={lang} panel={panel} go={go}/>
 </div>;
}
