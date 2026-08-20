import React,{useEffect,useState} from "react";
import SakinahNativeReadyLayer from "./SakinahNativeReadyLayer.jsx";
import SakinahAllFeaturesLayer from "./SakinahAllFeaturesLayer.jsx";
import "./responsiveShell.css";

function emit(id){window.dispatchEvent(new CustomEvent("sakinah:feature",{detail:id}))}
const feature=id=>()=>emit(id);
const groups=[
 {title:"القرآن والحديث",items:[["♪","مشغل القرآن",feature("quran-player")],["▤","الأحاديث الموثقة",feature("nine-books")],["▥","التفسير",feature("tafsir-library")],["▥","ذكاء القرآن",feature("quran-intelligence")],["⌕","البحث الإسلامي",feature("islamic-search")],["◫","تحليلات القرآن",feature("quran-analytics")],["◌","تدبر آية",feature("tadabbur-ayah")],["⌘","موضوعات القرآن",feature("quran-topics")],["≍","مقارنة الكلمات",feature("quran-compare")],["⌁","جذور القرآن",feature("quran-roots")],["◇","كيانات القرآن",feature("quran-entities")]]},
 {title:"الذكر والمحتوى",items:[["✦","المحتوى الموثق",feature("trusted-daily")],["☾","أدعية قرآنية",feature("quranic-duas")],["◎","الأذكار الذكية",feature("smart-quranic-adhkar")],["▧","أذكار السنة الموثقة",feature("hisn-center")],["◌","التأمل اليومي",feature("daily-reflection")],["✧","السيرة والقصص",feature("sourced-seerah")],["99","أسماء الله الحسنى",feature("names-live")],["♡","المكتبة المحفوظة",feature("saved-library")]]},
 {title:"يومي والعبادات",items:[["☼","يومي الذكي",feature("my-day")],["◫","أدوات العبادة اليومية",feature("daily-tools")],["▦","التقويم الإسلامي",feature("islamic-calendar")],["☽","الصيام",feature("fasting-center")],["✦","رمضان",feature("ramadan-center")],["✓","الختمة الذكية",feature("smart-khatmah")],["▥","الحفظ والمراجعة",feature("memorization-center")],["☼","الجمعة",feature("jumuah-center")],["◷","أوقات العبادة الحية",feature("worship-times")]]},
 {title:"العبادة الميدانية",items:[["⌖","القبلة",feature("qibla")],["⌂","أقرب مسجد",feature("mosques")],["◈","الزكاة",feature("zakat")],["◌","مناسك الحج والعمرة",feature("manasik")],["◎","المسبحة",feature("tasbeeh")],["▤","تعليم الصلاة والوضوء",feature("guide")]]},
 {title:"الأطفال والعائلة",items:[["☀","عالم الأطفال",feature("kids-world")],["▥","معلم القرآن للأطفال",feature("kids-quran-live")],["?","مسابقات الأطفال",feature("kids-quiz-live")],["♪","أناشيد الطفل المحلية",feature("kids-nasheeds")],["☀","الرقابة الأبوية",feature("parental-controls")]]},
 {title:"الشخصي والإبداع",items:[["✎","دفتر الملاحظات",feature("notes")],["⌁","دفتر الحسابات",feature("accounts")],["♙","البروفايلات",feature("profiles")],["◇","صانع البطاقات الإسلامية",feature("card-maker")],["♡","المحفوظات",feature("saved-library")]]},
 {title:"التنبيهات والنظام",items:[["◔","المؤذن والتنبيهات",feature("alerts")],["♪","أصوات الأذان لكل صلاة",feature("adhan-audio")],["▦","Widget",feature("widget")],["⌾","قفل الخصوصية",feature("privacy-lock")],["◫","Offline والنسخ الاحتياطي",feature("offline-backup")]]},
];
function ServiceList({close}){return <div className="serviceGroups">{groups.map(g=><section key={g.title}><div className="serviceGroupTitle">{g.title}</div>{g.items.map(([icon,label,action])=><button key={label} onClick={()=>{action();close?.()}}><span>{icon}</span><b>{label}</b></button>)}</section>)}</div>}

function DockIcon({name}){
 const p={viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true"};
 if(name==="home")return <svg {...p}><path d="M3.5 10.6 12 3.8l8.5 6.8"/><path d="M5.8 9.8v10h12.4v-10"/><path d="M9.5 19.8v-5.3h5v5.3"/></svg>;
 if(name==="quran")return <svg {...p}><path d="M4.2 5.3c2.8-.9 5.4-.4 7.8 1.2v12.9c-2.4-1.5-5-1.9-7.8-1.1z"/><path d="M19.8 5.3c-2.8-.9-5.4-.4-7.8 1.2v12.9c2.4-1.5 5-1.9 7.8-1.1z"/><path d="M12 6.5v12.9"/></svg>;
 if(name==="quran-player")return <svg {...p}><circle cx="12" cy="12" r="8.7"/><path d="m10.2 8.8 5.2 3.2-5.2 3.2z"/></svg>;
 if(name==="hadith")return <svg {...p}><rect x="4" y="3.8" width="16" height="16.4" rx="2.5"/><path d="M7 3.8v16.4M8.8 8h7.1M8.8 11.7h7.1M8.8 15.4h5.1"/></svg>;
 if(name==="myday")return <svg {...p}><circle cx="12" cy="12" r="3.8"/><path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5 7 7M17 17l1.5 1.5M18.5 5.5 17 7M7 17l-1.5 1.5"/></svg>;
 if(name==="discover")return <svg {...p}><circle cx="11" cy="11" r="6.2"/><path d="m15.6 15.6 4.1 4.1"/><path d="M11 8.5v5M8.5 11h5"/></svg>;
 if(name==="profile")return <svg {...p}><circle cx="12" cy="8" r="3.3"/><path d="M5.3 20c.8-3.6 3.1-5.5 6.7-5.5s5.9 1.9 6.7 5.5"/></svg>;
 return null;
}

export default function SakinahResponsiveShell(){
 const [open,setOpen]=useState(false),[discover,setDiscover]=useState(false),[active,setActive]=useState("home");
 const goDock=(id,index,fallback)=>{
  setActive(id);setDiscover(id==="discover");
  window.dispatchEvent(new CustomEvent("sakinah:global-root"));
  emit("home");
  setTimeout(()=>{
   const nav=document.querySelector('nav[aria-label="Sakinah seven primary"]');
   const btn=nav?.querySelectorAll("button")?.[index];
   if(btn){btn.click();return}
   if(fallback)emit(fallback);
  },35);
 };
 useEffect(()=>{
  const onClick=e=>{
   const seven=e.target.closest?.('nav[aria-label="Sakinah seven primary"] button');
   if(seven){const buttons=[...seven.closest('nav').querySelectorAll('button')],i=buttons.indexOf(seven);setActive(["home","quran","quran-player","hadith","myday","discover","profile"][i]||"home");setDiscover(i===5)}
  };
  document.addEventListener('click',onClick,true);return()=>document.removeEventListener('click',onClick,true)
 },[]);
 const dock=[["home",0,null],["quran",1,"quran-intelligence"],["quran-player",2,"quran-player"],["hadith",3,"nine-books"],["myday",4,"my-day"],["discover",5,null],["profile",6,"profiles"]];
 return <div className="sakinahResponsiveShell" dir="rtl">
  <style>{`.sakinah-seven-dock,.global-feature-dock{display:none!important}.app-global-dock{position:fixed!important;left:50%!important;right:auto!important;bottom:max(10px,env(safe-area-inset-bottom))!important;transform:translateX(-50%)!important;z-index:2147483600!important;width:min(560px,calc(100vw - 14px));display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px;padding:7px;border:1px solid rgba(255,255,255,.55);border-radius:26px;background:rgba(246,243,236,.82);-webkit-backdrop-filter:blur(26px) saturate(150%);backdrop-filter:blur(26px) saturate(150%);box-shadow:0 14px 36px rgba(16,16,15,.10),inset 0 1px 0 rgba(255,255,255,.64)}.app-global-dock button{border:0;border-radius:17px;padding:8px 2px;min-height:54px;background:transparent;color:rgba(16,16,15,.48);display:grid;place-items:center;font-family:inherit;transition:transform .2s ease,background .2s ease,color .2s ease,box-shadow .2s ease}.app-global-dock button:active{transform:scale(.92)}.app-global-dock button.active{background:rgba(255,255,255,.5);color:#173B57;box-shadow:inset 0 0 0 1px rgba(181,154,98,.13),0 4px 12px rgba(23,59,87,.06)}.app-global-dock .dockIcon{width:28px;height:28px;display:grid;place-items:center}.app-global-dock .dockIcon svg{width:25px;height:25px;display:block}.app-global-dock button.active .dockIcon{transform:translateY(-1px)}@media(max-width:430px){.app-global-dock{width:calc(100vw - 10px);padding:6px 4px}.app-global-dock button{min-height:50px}.app-global-dock .dockIcon{width:26px;height:26px}.app-global-dock .dockIcon svg{width:23px;height:23px}}`}</style>
  <aside className="desktopServiceRail"><div className="railBrand"><span>س</span><div><b>سكينة</b><small>كل الخدمات</small></div></div><ServiceList/></aside>
  <div className="responsiveAppStage"><SakinahAllFeaturesLayer><SakinahNativeReadyLayer/></SakinahAllFeaturesLayer></div>
  <nav className="app-global-dock" aria-label="Sakinah persistent primary">{dock.map(([id,index,fallback])=><button key={id} className={active===id?"active":""} aria-label={id} onClick={()=>goDock(id,index,fallback)}><span className="dockIcon"><DockIcon name={id}/></span></button>)}</nav>
  {discover&&<button className="discoverServicesButton" onClick={()=>setOpen(true)}>☷ <span>كل الخدمات</span></button>}
  {open&&<div className="mobileServicesOverlay" onClick={()=>setOpen(false)}><div className="mobileServicesSheet" onClick={e=>e.stopPropagation()}><div className="sheetHead"><div><b>خدمات سكينة</b><small>كل الميزات المفعلة في مكان واحد</small></div><button onClick={()=>setOpen(false)}>×</button></div><ServiceList close={()=>setOpen(false)}/></div></div>}
 </div>;
}
