import React,{useEffect,useRef,useState} from "react";
import SakinahLiveHome from "./SakinahLiveHome.jsx";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62"};
const baseBtn={border:"1px solid rgba(16,16,15,.08)",borderRadius:18,padding:14,background:"rgba(255,255,255,.55)",fontFamily:"inherit",color:"inherit"};
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
const activeProfile=()=>{try{return localStorage.getItem("sakinah-active-profile")||"me"}catch{return"me"}};
const profileAvatarKey=id=>`sakinah-profile-avatar-${id||activeProfile()}`;
const profileNameKey=id=>`sakinah-profile-display-name-${id||activeProfile()}`;
function openFeature(id){window.dispatchEvent(new CustomEvent("sakinah:feature",{detail:id}))}
function recoverAvatar(id){
 try{
  const direct=localStorage.getItem(profileAvatarKey(id));
  if(direct)return direct;
  const legacy=["sakinah.profile.photo.v1","sakinah-profile-avatar","sakinah-avatar","profile-avatar"];
  for(const key of legacy){const value=localStorage.getItem(key);if(value)return value}
  for(let i=0;i<localStorage.length;i++){
   const key=localStorage.key(i);
   if(key&&key.startsWith("sakinah-profile-avatar-")){const value=localStorage.getItem(key);if(value)return value}
  }
 }catch{}
 return "";
}
function readSharedProfile(lang="ar"){
 const id=activeProfile();
 const profiles=read("sakinah-profiles",[{id:"me",nameAr:"أنا",nameEn:"Me",kind:"adult",age:""}]);
 const current=profiles.find(p=>p.id===id)||profiles[0]||{id:"me",nameAr:"أنا",nameEn:"Me",kind:"adult"};
 let avatar=recoverAvatar(id),name=lang==="ar"?current.nameAr:current.nameEn;
 try{
  name=localStorage.getItem(profileNameKey(id))||name||"أنا";
  if(avatar&&!localStorage.getItem(profileAvatarKey(id)))localStorage.setItem(profileAvatarKey(id),avatar);
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
 return <section style={{marginTop:20}}><div style={{fontSize:10.5,opacity:.42,marginBottom:8}}>{title}</div><div style={{borderRadius:24,overflow:"hidden",border:"1px solid rgba(16,16,15,.07)",background:"rgba(255,255,255,.5)"}}>{rows.map(([id,icon,ar,en,subAr,subEn])=><button key={id} onClick={()=>go(id)} style={{width:"100%",display:"grid",gridTemplateColumns:"38px 1fr auto",gap:10,alignItems:"center",padding:14,border:0,borderBottom:"1px solid rgba(16,16,15,.06)",background:"transparent",fontFamily:"inherit",color:"inherit",textAlign:lang==="ar"?"right":"left"}}><span style={{fontSize:18,color:C.gold}}>{icon}</span><span><span style={{display:"block",fontSize:12.5,fontWeight:650}}>{lang==="ar"?ar:en}</span><small style={{display:"block",fontSize:9.5,opacity:.42,marginTop:3,lineHeight:1.45}}>{lang==="ar"?subAr:subEn}</small></span><span style={{opacity:.28}}>{lang==="ar"?"‹":"›"}</span></button>)}</div></section>
}
function DiscoverHub({lang,go}){
 const featured=[["trusted-daily","✦","المحتوى الموثوق","Sourced Content","محتوى إسلامي موثوق بالمصادر","Sourced Islamic content"]];
 const knowledge=[["names-live","◉","أسماء الله الحسنى","Names of Allah","الأسماء الحسنى ومعانيها","The Beautiful Names and meanings"],["sourced-seerah","▤","السيرة والقصص الموثقة","Sourced Seerah & Stories","السيرة والقصص الإسلامية من مصادر موثوقة","Sourced Seerah and Islamic stories"],["guide","◎","تعليم الصلاة والوضوء","Prayer & Wudu Guide","شرح مبسط ومتعدد اللغات","Simple multilingual learning guide"]];
 const worship=[["islamic-calendar","▦","التقويم الإسلامي","Islamic Calendar","المناسبات والأيام الهجرية","Hijri dates and occasions"],["zakat","◇","الزكاة","Zakat","حساب وإرشادات الزكاة","Zakat calculator and guidance"],["manasik","△","المناسك","Manasik","دليل الحج والعمرة","Hajj and Umrah guide"]];
 return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,overflowY:"auto",padding:"28px 22px 130px"}} dir={lang==="ar"?"rtl":"ltr"}><div style={{fontSize:11,letterSpacing:1.6,opacity:.42}}>مِرْآةُ الْمُسْلِمِ</div><div style={{fontFamily:"Fraunces,serif",fontSize:34,marginTop:6}}>{lang==="ar"?"اكتشف":"Discover"}</div><div style={{fontSize:12,opacity:.5,lineHeight:1.8,marginTop:6}}>{lang==="ar"?"الخدمات التي لا تملك مكاناً دائماً في القرآن أو يومي أو أنا تجدها هنا فقط.":"Services without a permanent home in Quran, My Day or Me live here only."}</div><div style={{display:"grid",gridTemplateColumns:"1fr",gap:10,marginTop:22}}>{featured.map(([id,icon,ar,en,subAr,subEn])=><button key={id} onClick={()=>go(id)} style={{...baseBtn,minHeight:118,textAlign:lang==="ar"?"right":"left",background:"linear-gradient(145deg,#173B57,#0C293E)",color:"white"}}><div style={{fontSize:24,color:"#E7D29B"}}>{icon}</div><div style={{fontSize:14,fontWeight:700,lineHeight:1.45,marginTop:16}}>{lang==="ar"?ar:en}</div><small style={{display:"block",fontSize:9.5,opacity:.52,marginTop:5}}>{lang==="ar"?subAr:subEn}</small></button>)}</div><DiscoverSection title={lang==="ar"?"المعرفة والإيمان":"KNOWLEDGE & FAITH"} rows={knowledge} lang={lang} go={go}/><DiscoverSection title={lang==="ar"?"خدمات ومناسبات":"SERVICES & OCCASIONS"} rows={worship} lang={lang} go={go}/></div>
}
function ProfileHub({lang,go,profile,onProfileChange}){
 const fileRef=useRef(null),[editing,setEditing]=useState(false),[draftName,setDraftName]=useState(profile.name||"أنا"),[avatarError,setAvatarError]=useState("");
 const [toggles,setToggles]=useState(()=>({parental:read("sakinah-profile-parental-toggle",true),adhan:read("sakinah-profile-adhan-toggle",true)}));
 useEffect(()=>setDraftName(profile.name||"أنا"),[profile.name]);
 const saveName=()=>{const n=draftName.trim()||"أنا";onProfileChange({name:n});setEditing(false)};
 const chooseAvatar=async e=>{const f=e.target.files?.[0];e.target.value="";if(!f||!f.type.startsWith("image/"))return;setAvatarError("");try{const v=await compressAvatar(f);const persisted=onProfileChange({avatar:v});if(!persisted)setAvatarError(lang==="ar"?"الصورة ظاهرة الآن، لكن تعذر حفظها بعد إغلاق التطبيق.":"Photo is visible now, but could not be persisted.")}catch{setAvatarError(lang==="ar"?"تعذر قراءة الصورة. اختر صورة أخرى.":"Could not read the image.")}};
 const toggle=k=>{const n={...toggles,[k]:!toggles[k]};setToggles(n);try{localStorage.setItem(`sakinah-profile-${k}-toggle`,JSON.stringify(n[k]))}catch{}};
 const stats=[["١٤٢","محفوظاً"],["٢٦","يوماً متصلاً"],["٦٨٪","ورد الشهر"]];
 const sections=[
  {title:"الأطفال والعائلة",items:[
   ["kids-world","✦","عالم الأطفال","كل محتوى الأطفال في مكان واحد"],
   ["kids-quran-live","◎","معلّم القرآن للأطفال","تعلّم القرآن ومتابعة الطفل"],
   ["kids-quiz-live","?","مسابقات الأطفال","أسئلة ومسابقات دينية"],
   ["kids-nasheeds","♪","أناشيد الطفل الجميلة","أناشيد مخصّصة للأطفال"],
   ["parental-controls","⚿","الرقابة الأبوية","الوقت والصلاحيات ومحتوى الطفل","parental"]]},
  {title:"الشخصي والإبداع",items:[
   ["notes","✎","دفتر الملاحظات","ملاحظات هذا البروفايل"],
   ["accounts","$","دفتر الحسابات","الحسابات الشخصية لهذا البروفايل"],
   ["profiles","◍","البروفايلات","تبديل وإدارة أفراد العائلة"],
   ["card-maker","◈","صانع البطاقات الإسلامية","إنشاء وحفظ بطاقاتك"],
   ["saved-library","▤","المحفوظات","كل ما حفظته للرجوع إليه"],
   ["tasbeeh","❍","المسبحة وتقدّمي","عدّادك وسجل ذكرك اليومي"]]},
  {title:"التنبيهات والنظام",items:[
   ["alerts","◔","المؤذّن والتنبيهات","صوت الأذان ومواعيد التذكير","adhan"],
   ["appearance","◐","المظهر","فاتح · داكن · تلقائي"],
   ["offline-backup","⤓","النسخ الاحتياطي","آخر نسخة محفوظة وبياناتك"],
   ["privacy-lock","⚿","الخصوصية والقفل","قفل التطبيق ببصمة أو رمز"]]}
 ];
 return <div className="mm-me-page" dir="rtl">
  <style>{`
   .mm-me-page{position:absolute;inset:0;background:#E7E0D3;color:#102D43;overflow:hidden;font-family:'Noto Kufi Arabic','Cairo',sans-serif;display:flex;justify-content:center}.mm-me-frame{width:min(100%,406px);height:100%;padding:8px}.mm-me-shell{height:100%;overflow-y:auto;overflow-x:hidden;border-radius:34px;background:#F7F3EA;box-shadow:0 40px 90px -40px rgba(16,45,67,.5),0 0 0 1px rgba(16,45,67,.08);scrollbar-width:none;padding-bottom:112px}.mm-me-shell::-webkit-scrollbar{display:none}.mm-me-top{position:sticky;top:0;z-index:10;background:rgba(247,243,234,.93);backdrop-filter:blur(10px);border-bottom:1px solid rgba(16,45,67,.07);padding:15px 20px;display:grid;grid-template-columns:44px 1fr 44px;align-items:center}.mm-me-top button{width:44px;height:44px;border:0;background:transparent;font-family:inherit;color:#5B6672;font-size:18px}.mm-me-top strong{text-align:center;font-size:13px;font-weight:600}.mm-me-head{padding:22px 20px 0;display:flex;align-items:center;gap:15px}.mm-me-avatar{width:64px;height:64px;border-radius:50%;background:#EFE8DA;border:1px solid rgba(192,160,98,.4);display:grid;place-items:center;overflow:hidden;color:#B08D4F;flex:none;font-size:20px}.mm-me-avatar img{width:100%;height:100%;object-fit:cover;display:block}.mm-me-info{flex:1;min-width:0}.mm-me-name{font-family:'Amiri',serif;font-size:26px;line-height:1.2;border:0;background:transparent;color:#102D43;padding:0;text-align:right}.mm-me-sub{font-size:11px;color:#8E96A0;margin-top:5px}.mm-me-photo{display:inline-flex;align-items:center;margin-top:9px;padding:5px 12px;border-radius:999px;border:0;background:rgba(192,160,98,.13);color:#B08D4F;font:11px inherit}.mm-me-stats{margin:20px 20px 0;display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.mm-me-stat{padding:14px 8px;border-radius:18px;background:#FDFBF7;border:1px solid rgba(16,45,67,.07);text-align:center}.mm-me-stat b{display:block;font-family:'IBM Plex Mono',monospace;font-size:17px;color:#8E6F38;font-weight:400}.mm-me-stat span{display:block;font-size:9.5px;color:#8E96A0;margin-top:5px}.mm-me-sec{margin:24px 20px 0}.mm-me-sechead{display:flex;justify-content:space-between;align-items:center;margin-bottom:9px}.mm-me-sechead b{font-size:12px;font-weight:600}.mm-me-sechead span{font-size:9.5px;color:#B5BBC2}.mm-me-panel{border-radius:22px;overflow:hidden;background:#FDFBF7;border:1px solid rgba(16,45,67,.07)}.mm-me-row{width:100%;min-height:64px;padding:10px 14px;border:0;border-top:1px solid rgba(16,45,67,.07);background:transparent;color:#102D43;font-family:inherit;display:flex;align-items:center;gap:12px;text-align:right}.mm-me-row:first-child{border-top:0}.mm-me-ico{width:38px;height:38px;border-radius:13px;background:rgba(192,160,98,.10);display:grid;place-items:center;color:#8E6F38;flex:none;font-size:16px}.mm-me-copy{flex:1;min-width:0}.mm-me-copy b{display:block;font-size:12.5px;font-weight:500}.mm-me-copy small{display:block;font-size:9.5px;color:#8E96A0;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mm-me-arrow{font-size:12px;color:#C3C9CF;flex:none}.mm-me-switch{width:38px;height:22px;border-radius:999px;padding:2px;background:rgba(16,45,67,.12);display:flex;align-items:center;flex:none}.mm-me-switch.on{background:#102D43;justify-content:flex-end}.mm-me-switch i{width:18px;height:18px;border-radius:50%;background:#FDFBF7;box-shadow:0 1px 3px rgba(16,45,67,.3)}.mm-me-actions{margin:26px 20px 0;display:flex;gap:10px}.mm-me-actions button{flex:1;padding:13px;border-radius:16px;border:1px solid rgba(16,45,67,.09);background:#FDFBF7;color:#5B6672;font-family:inherit;font-size:12px}.mm-me-actions button:last-child{background:rgba(16,45,67,.05);color:#8A5B4F}.mm-me-version{text-align:center;padding:20px 0 26px;font-size:10px;color:#B5BBC2}@media(max-width:405px){.mm-me-frame{padding:0}.mm-me-shell{border-radius:0}}
  `}</style>
  <input ref={fileRef} type="file" accept="image/*" onChange={chooseAvatar} style={{display:"none"}}/>
  <div className="mm-me-frame"><div className="mm-me-shell">
   <header className="mm-me-top"><button onClick={()=>go("app")} aria-label="رجوع">→</button><strong>أنا</strong><button onClick={()=>go("saved-library")} aria-label="بحث">⌕</button></header>
   <section className="mm-me-head"><button className="mm-me-avatar sakinah-profile-avatar" onClick={()=>fileRef.current?.click()}>{profile.avatar?<img src={profile.avatar} alt=""/>:<span>{(profile.name||"أ").trim().slice(0,1)}</span>}</button><div className="mm-me-info">{editing?<div style={{display:"flex",gap:6}}><input autoFocus value={draftName} onChange={e=>setDraftName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveName()} style={{width:"100%",border:"1px solid rgba(16,45,67,.09)",borderRadius:12,padding:"7px 9px",background:"#FDFBF7",fontFamily:"Amiri,serif",fontSize:20,color:"#102D43"}}/><button onClick={saveName} style={{border:0,background:"transparent",color:"#8E6F38"}}>✓</button></div>:<button className="mm-me-name" onClick={()=>setEditing(true)}>{profile.name}</button>}<div className="mm-me-sub">ملفّك ومحفوظاتك وخصوصيتك</div><button className="mm-me-photo" onClick={()=>fileRef.current?.click()}>تغيير الصورة</button>{avatarError&&<div style={{fontSize:9.5,color:"#9B2C2C",marginTop:5}}>{avatarError}</div>}</div></section>
   <section className="mm-me-stats">{stats.map(([num,label])=><div className="mm-me-stat" key={label}><b>{num}</b><span>{label}</span></div>)}</section>
   {sections.map(sec=><section className="mm-me-sec" key={sec.title}><div className="mm-me-sechead"><b>{sec.title}</b><span>{String(sec.items.length).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d])} عناصر</span></div><div className="mm-me-panel">{sec.items.map(([id,icon,name,sub,toggleKey])=><button className="mm-me-row" key={id} onClick={()=>toggleKey?toggle(toggleKey):go(id)}><span className="mm-me-ico">{icon}</span><span className="mm-me-copy"><b>{name}</b><small>{sub}</small></span>{toggleKey?<span className={`mm-me-switch ${toggles[toggleKey]?'on':''}`}><i/></span>:<span className="mm-me-arrow">‹</span>}</button>)}</div></section>)}
   <div className="mm-me-actions"><button onClick={()=>go("about")}>عن التطبيق</button><button onClick={()=>go("profiles")}>تسجيل الخروج</button></div>
   <div className="mm-me-version">مِرْآةُ الْمُسْلِمِ · الإصدار ٢٫٤</div>
  </div></div>
 </div>
}
export default function MergedSakinah(){
 const [panel,setPanel]=useState("app"),lang="ar",[profile,setProfile]=useState(()=>readSharedProfile("ar"));
 useEffect(()=>{const sync=()=>setProfile(readSharedProfile(lang));window.addEventListener("storage",sync);window.addEventListener("sakinah-profile-change",sync);return()=>{window.removeEventListener("storage",sync);window.removeEventListener("sakinah-profile-change",sync)}},[]);
 useEffect(()=>{const route=e=>{const id=e.detail;if(id==="home"){setPanel("app");return}if(id==="profile"){setPanel("profile");return}if(id==="discover"){setPanel("discover");return}if(id==="myday"){openFeature("my-day")}};window.addEventListener("muslimmirror:legacy-nav",route);return()=>window.removeEventListener("muslimmirror:legacy-nav",route)},[]);
 const updateProfile=patch=>{const id=profile.id||activeProfile();let persisted=true;try{if(Object.prototype.hasOwnProperty.call(patch,"avatar"))localStorage.setItem(profileAvatarKey(id),patch.avatar||"");if(Object.prototype.hasOwnProperty.call(patch,"name"))localStorage.setItem(profileNameKey(id),patch.name||"أنا")}catch{persisted=false}setProfile(p=>({...p,...patch}));if(persisted)window.dispatchEvent(new CustomEvent("sakinah-profile-change",{detail:{profileId:id}}));return persisted};
 const go=to=>{if(to==="app"||to==="discover"||to==="profile"){setPanel(to);return}openFeature(to)};
 return <div style={{position:"relative",minHeight:"100vh",background:C.ivory}}><style>{`.sakinah-profile-avatar,.sakinah-profile-avatar img{border:0!important;outline:0!important;box-shadow:none!important;filter:none!important;background:transparent!important;-webkit-appearance:none!important;appearance:none!important}.sakinah-profile-avatar{border-radius:50%!important;overflow:hidden!important}.sakinah-profile-avatar img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;border-radius:50%!important}`}</style>{panel==="app"?<SakinahLiveHome profileAvatar={profile.avatar} profileName={profile.name} onOpenProfile={()=>setPanel("profile")}/>:panel==="discover"?<DiscoverHub lang={lang} go={go}/>:<ProfileHub lang={lang} go={go} profile={profile} onProfileChange={updateProfile}/>}</div>
}