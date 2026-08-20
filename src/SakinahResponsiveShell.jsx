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
 const p={viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.55,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true"};
 if(name==="home")return <svg {...p}><path d="M4.2 10.7 12 4.3l7.8 6.4"/><path d="M6.4 9.8v9.1h11.2V9.8"/><path d="M9.6 18.9v-5h4.8v5"/></svg>;
 if(name==="quran")return <svg {...p}><path d="M3.8 5.6c3-.9 5.7-.35 8.2 1.45v12c-2.5-1.55-5.2-2.05-8.2-1.2z"/><path d="M20.2 5.6c-3-.9-5.7-.35-8.2 1.45v12c2.5-1.55 5.2-2.05 8.2-1.2z"/><path d="M12 7.05v12"/></svg>;
 if(name==="quran-player")return <svg {...p}><circle cx="12" cy="12" r="8.4"/><path d="M10.4 8.9 15.6 12l-5.2 3.1z"/></svg>;
 if(name==="hadith")return <svg {...p}><rect x="4.2" y="4" width="15.6" height="16" rx="2.4"/><path d="M7.4 4v16"/><path d="M9.6 8h6.6M9.6 11.5h6.6M9.6 15h4.7"/></svg>;
 if(name==="myday")return <svg {...p}><path d="M4.1 16.5h15.8"/><path d="M6.6 14.1a5.7 5.7 0 0 1 10.8 0"/><path d="M12 4.2v2.1M5.9 7l1.5 1.5M18.1 7l-1.5 1.5M3.8 11.5h2.1M18.1 11.5h2.1"/></svg>;
 if(name==="discover")return <svg {...p}><circle cx="12" cy="12" r="8.1"/><path d="m14.8 9.2-1.5 4.1-4.1 1.5 1.5-4.1z"/></svg>;
 if(name==="profile")return <svg {...p}><circle cx="12" cy="8.1" r="3.05"/><path d="M6.2 19.6c.8-3.4 2.75-5.1 5.8-5.1s5 1.7 5.8 5.1"/></svg>;
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
  <style>{`.sakinah-seven-dock,.global-feature-dock{display:none!important}.app-global-dock{position:fixed!important;left:50%!important;right:auto!important;bottom:max(10px,env(safe-area-inset-bottom))!important;transform:translateX(-50%)!important;z-index:2147483600!important;width:min(560px,calc(100vw - 14px));display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px;padding:7px;border:1px solid rgba(255,255,255,.55);border-radius:26px;background:rgba(246,243,236,.82);-webkit-backdrop-filter:blur(26px) saturate(150%);backdrop-filter:blur(26px) saturate(150%);box-shadow:0 14px 36px rgba(16,16,15,.10),inset 0 1px 0 rgba(255,255,255,.64)}.app-global-dock button{border:0;border-radius:17px;padding:8px 2px;min-height:54px;background:transparent;color:rgba(16,16,15,.43);display:grid;place-items:center;font-family:inherit;transition:transform .2s ease,background .2s ease,color .2s ease,box-shadow .2s ease}.app-global-dock button:active{transform:scale(.92)}.app-global-dock button.active{background:rgba(255,255,255,.68);color:#173B57;box-shadow:inset 0 0 0 1px rgba(181,154,98,.11),0 4px 14px rgba(23,59,87,.07)}.app-global-dock .dockIcon{width:28px;height:28px;display:grid;place-items:center}.app-global-dock .dockIcon svg{width:24px;height:24px;display:block}.app-global-dock button.active .dockIcon{transform:translateY(-1px)}@media(max-width:430px){.app-global-dock{width:calc(100vw - 10px);padding:6px 4px}.app-global-dock button{min-height:50px}.app-global-dock .dockIcon{width:26px;height:26px}.app-global-dock .dockIcon svg{width:22px;height:22px}}`}</style>
  <aside className="desktopServiceRail"><div className="railBrand"><span>س</span><div><b>سكينة</b><small>كل الخدمات</small></div></div><ServiceList/></aside>
  <div className="responsiveAppStage"><SakinahAllFeaturesLayer><SakinahNativeReadyLayer/></SakinahAllFeaturesLayer></div>
  <nav className="app-global-dock" aria-label="Sakinah persistent primary">{dock.map(([id,index,fallback])=><button key={id} className={active===id?"active":""} aria-label={id} onClick={()=>goDock(id,index,fallback)}><span className="dockIcon"><DockIcon name={id}/></span></button>)}</nav>
  {discover&&<button className="discoverServicesButton" onClick={()=>setOpen(true)}>☷ <span>كل الخدمات</span></button>}
  {open&&<div className="mobileServicesOverlay" onClick={()=>setOpen(false)}><div className="mobileServicesSheet" onClick={e=>e.stopPropagation()}><div className="sheetHead"><div><b>خدمات سكينة</b><small>كل الميزات المفعلة في مكان واحد</small></div><button onClick={()=>setOpen(false)}>×</button></div><ServiceList close={()=>setOpen(false)}/></div></div>}
 </div>;
}
