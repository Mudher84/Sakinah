import React,{useState} from "react";
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
 const p={viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.35,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true"};
 if(name==="home")return <svg {...p}><path d="M4.4 10.9 12 4.75l7.6 6.15"/><path d="M6.35 9.9v8.85c0 .55.45 1 1 1h9.3c.55 0 1-.45 1-1V9.9"/><path d="M9.75 19.75v-5.15c0-.45.35-.8.8-.8h2.9c.45 0 .8.35.8.8v5.15"/></svg>;
 if(name==="quran")return <svg {...p}><path d="M4.1 5.45c2.9-.7 5.5-.18 7.9 1.55v12.05c-2.4-1.45-5-1.9-7.9-1.08z"/><path d="M19.9 5.45c-2.9-.7-5.5-.18-7.9 1.55v12.05c2.4-1.45 5-1.9 7.9-1.08z"/><path d="M12 7v12.05"/><path d="M7.15 8.55c1.15-.05 2.15.18 3.05.7M16.85 8.55c-1.15-.05-2.15.18-3.05.7" opacity=".72"/></svg>;
 if(name==="quran-player")return <svg {...p}><circle cx="12" cy="12" r="8.35"/><path d="M10.15 8.8c0-.55.6-.88 1.06-.58l4.68 3.03c.43.28.43.91 0 1.19l-4.68 3.03c-.46.3-1.06-.03-1.06-.58z"/><path d="M5.45 7.35a8.35 8.35 0 0 1 13.1 0" opacity=".5"/></svg>;
 if(name==="hadith")return <svg {...p}><path d="M5.1 4.2h11.45a2.35 2.35 0 0 1 2.35 2.35v12.9H7.45A2.35 2.35 0 0 1 5.1 17.1z"/><path d="M7.4 4.2v15.25"/><path d="M10.1 8.15h5.65M10.1 11.45h5.65M10.1 14.75h3.95"/><path d="M5.1 17.15c.62-.45 1.38-.68 2.35-.68H18.9" opacity=".65"/></svg>;
 if(name==="myday")return <svg {...p}><path d="M4.25 16.4h15.5"/><path d="M7 14.1a5.2 5.2 0 0 1 10 0"/><path d="M12 4.3v2.05M6.25 7.05l1.45 1.45M17.75 7.05 16.3 8.5M4.1 11.7h2.05M17.85 11.7h2.05"/><path d="M8.55 19.2h6.9" opacity=".55"/></svg>;
 if(name==="discover")return <svg {...p}><circle cx="12" cy="12" r="8.2"/><path d="m14.95 8.85-1.65 4.45-4.45 1.65 1.65-4.45z"/><circle cx="12" cy="12" r=".65" fill="currentColor" stroke="none"/></svg>;
 if(name==="profile")return <svg {...p}><circle cx="12" cy="8.05" r="3.05"/><path d="M6.1 19.45c.75-3.28 2.75-4.92 5.9-4.92s5.15 1.64 5.9 4.92"/><path d="M8.3 17.15c1.05.72 2.28 1.08 3.7 1.08s2.65-.36 3.7-1.08" opacity=".48"/></svg>;
 return null;
}

export default function SakinahResponsiveShell(){
 const [open,setOpen]=useState(false),[discover,setDiscover]=useState(false),[active,setActive]=useState("home");
 const goDock=id=>{
  setActive(id);
  setDiscover(id==="discover");
  window.dispatchEvent(new CustomEvent("sakinah:global-root"));
  emit("home");
  requestAnimationFrame(()=>window.dispatchEvent(new CustomEvent("muslimmirror:dock",{detail:id})));
 };
 const dock=["home","quran","quran-player","hadith","myday","discover","profile"];
 return <div className="sakinahResponsiveShell" dir="rtl">
  <style>{`.app-global-dock{position:fixed!important;left:50%!important;right:auto!important;bottom:max(10px,env(safe-area-inset-bottom))!important;transform:translateX(-50%)!important;z-index:2147483600!important;width:min(560px,calc(100vw - 14px));display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;padding:7px;border:1px solid rgba(255,255,255,.72);border-radius:28px;background:linear-gradient(180deg,rgba(250,248,242,.9),rgba(243,239,229,.82));-webkit-backdrop-filter:blur(28px) saturate(145%);backdrop-filter:blur(28px) saturate(145%);box-shadow:0 18px 44px rgba(34,30,24,.11),0 2px 8px rgba(34,30,24,.045),inset 0 1px 0 rgba(255,255,255,.86)}.app-global-dock button{position:relative;border:0;border-radius:19px;padding:8px 2px;min-height:54px;background:transparent;color:rgba(25,25,23,.42);display:grid;place-items:center;font-family:inherit;transition:transform .2s cubic-bezier(.2,.8,.2,1),background .2s ease,color .2s ease,box-shadow .2s ease}.app-global-dock button:active{transform:scale(.91)}.app-global-dock button.active{background:linear-gradient(180deg,rgba(255,255,255,.92),rgba(250,247,239,.82));color:#173B57;box-shadow:inset 0 0 0 1px rgba(181,154,98,.16),inset 0 1px 0 rgba(255,255,255,.96),0 8px 20px rgba(23,59,87,.08)}.app-global-dock button.active:after{content:"";position:absolute;bottom:4px;width:13px;height:1.5px;border-radius:999px;background:linear-gradient(90deg,rgba(181,154,98,0),#B59A62,rgba(181,154,98,0));opacity:.85}.app-global-dock .dockIcon{width:29px;height:29px;display:grid;place-items:center;transition:transform .2s ease}.app-global-dock .dockIcon svg{width:24px;height:24px;display:block}.app-global-dock button.active .dockIcon{transform:translateY(-1.5px) scale(1.03)}@media(max-width:430px){.app-global-dock{width:calc(100vw - 10px);padding:6px 4px;border-radius:25px}.app-global-dock button{min-height:50px;border-radius:17px}.app-global-dock .dockIcon{width:26px;height:26px}.app-global-dock .dockIcon svg{width:22px;height:22px}.app-global-dock button.active:after{bottom:3px}}`}</style>
  <aside className="desktopServiceRail"><div className="railBrand"><span>م</span><div><b>مِرْآةُ الْمُسْلِمِ</b><small>كل الخدمات</small></div></div><ServiceList/></aside>
  <div className="responsiveAppStage"><SakinahAllFeaturesLayer><SakinahNativeReadyLayer/></SakinahAllFeaturesLayer></div>
  <nav className="app-global-dock" aria-label="Muslim Mirror primary">{dock.map(id=><button key={id} className={active===id?"active":""} aria-label={id} onClick={()=>goDock(id)}><span className="dockIcon"><DockIcon name={id}/></span></button>)}</nav>
  {discover&&<button className="discoverServicesButton" onClick={()=>setOpen(true)}>☷ <span>كل الخدمات</span></button>}
  {open&&<div className="mobileServicesOverlay" onClick={()=>setOpen(false)}><div className="mobileServicesSheet" onClick={e=>e.stopPropagation()}><div className="sheetHead"><div><b>خدمات مِرْآةُ الْمُسْلِمِ</b><small>كل الميزات المفعلة في مكان واحد</small></div><button onClick={()=>setOpen(false)}>×</button></div><ServiceList close={()=>setOpen(false)}/></div></div>}
 </div>;
}
