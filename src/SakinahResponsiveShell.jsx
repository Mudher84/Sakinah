import React,{useEffect,useState} from "react";
import SakinahNativeReadyLayer from "./SakinahNativeReadyLayer.jsx";
import SakinahAllFeaturesLayer from "./SakinahAllFeaturesLayer.jsx";
import "./responsiveShell.css";

function emit(id){window.dispatchEvent(new CustomEvent("sakinah:feature",{detail:id}))}
const feature=id=>()=>emit(id);
const groups=[
 {title:"القرآن والحديث",items:[
  ["♪","مشغل القرآن",feature("quran-player")],["▤","الأحاديث الموثقة",feature("nine-books")],["▥","التفسير",feature("tafsir-library")],["▥","ذكاء القرآن",feature("quran-intelligence")],["⌕","البحث الإسلامي",feature("islamic-search")],["◫","تحليلات القرآن",feature("quran-analytics")],["◌","تدبر آية",feature("tadabbur-ayah")],["⌘","موضوعات القرآن",feature("quran-topics")],["≍","مقارنة الكلمات",feature("quran-compare")],["⌁","جذور القرآن",feature("quran-roots")],["◇","كيانات القرآن",feature("quran-entities")]
 ]},
 {title:"الذكر والمحتوى",items:[
  ["✦","المحتوى الموثق",feature("trusted-daily")],["☾","أدعية قرآنية",feature("quranic-duas")],["◎","الأذكار الذكية",feature("smart-quranic-adhkar")],["▧","أذكار السنة الموثقة",feature("hisn-center")],["◌","التأمل اليومي",feature("daily-reflection")],["✧","السيرة والقصص",feature("sourced-seerah")],["99","أسماء الله الحسنى",feature("names-live")],["♡","المكتبة المحفوظة",feature("saved-library")]
 ]},
 {title:"يومي والعبادات",items:[
  ["☼","يومي الذكي",feature("my-day")],["◫","أدوات العبادة اليومية",feature("daily-tools")],["▦","التقويم الإسلامي",feature("islamic-calendar")],["☽","الصيام",feature("fasting-center")],["✦","رمضان",feature("ramadan-center")],["✓","الختمة الذكية",feature("smart-khatmah")],["▥","الحفظ والمراجعة",feature("memorization-center")],["☼","الجمعة",feature("jumuah-center")],["◷","أوقات العبادة الحية",feature("worship-times")]
 ]},
 {title:"العبادة الميدانية",items:[
  ["⌖","القبلة",feature("qibla")],["⌂","أقرب مسجد",feature("mosques")],["◈","الزكاة",feature("zakat")],["◌","مناسك الحج والعمرة",feature("manasik")],["◎","المسبحة",feature("tasbeeh")],["▤","تعليم الصلاة والوضوء",feature("guide")]
 ]},
 {title:"الأطفال والعائلة",items:[
  ["☀","عالم الأطفال",feature("kids-world")],["▥","معلم القرآن للأطفال",feature("kids-quran-live")],["?","مسابقات الأطفال",feature("kids-quiz-live")],["♪","أناشيد الطفل المحلية",feature("kids-nasheeds")],["☀","الرقابة الأبوية",feature("parental-controls")]
 ]},
 {title:"الشخصي والإبداع",items:[
  ["✎","دفتر الملاحظات",feature("notes")],["⌁","دفتر الحسابات",feature("accounts")],["♙","البروفايلات",feature("profiles")],["◇","صانع البطاقات الإسلامية",feature("card-maker")],["♡","المحفوظات",feature("saved-library")]
 ]},
 {title:"التنبيهات والنظام",items:[
  ["◔","المؤذن والتنبيهات",feature("alerts")],["♪","أصوات الأذان لكل صلاة",feature("adhan-audio")],["▦","Widget",feature("widget")],["⌾","قفل الخصوصية",feature("privacy-lock")],["◫","Offline والنسخ الاحتياطي",feature("offline-backup")]
 ]},
];
function ServiceList({close}){return <div className="serviceGroups">{groups.map(g=><section key={g.title}><div className="serviceGroupTitle">{g.title}</div>{g.items.map(([icon,label,action])=><button key={label} onClick={()=>{action();close?.()}}><span>{icon}</span><b>{label}</b></button>)}</section>)}</div>}
export default function SakinahResponsiveShell(){
 const [open,setOpen]=useState(false),[discover,setDiscover]=useState(false);
 useEffect(()=>{
  const onClick=e=>{
   const seven=e.target.closest?.('nav[aria-label="Sakinah seven primary"] button');
   if(seven){const buttons=[...seven.closest('nav').querySelectorAll('button')];setDiscover(buttons.indexOf(seven)===5);return;}
   const old=e.target.closest?.('nav[aria-label="Sakinah primary"] button');
   if(old){const buttons=[...old.closest('nav').querySelectorAll('button')];setDiscover(buttons.indexOf(old)===3);}
  };
  document.addEventListener('click',onClick,true);
  return()=>document.removeEventListener('click',onClick,true);
 },[]);
 return <div className="sakinahResponsiveShell" dir="rtl">
  <aside className="desktopServiceRail"><div className="railBrand"><span>س</span><div><b>سكينة</b><small>كل الخدمات</small></div></div><ServiceList/></aside>
  <div className="responsiveAppStage"><SakinahAllFeaturesLayer><SakinahNativeReadyLayer/></SakinahAllFeaturesLayer></div>
  {discover&&<button className="discoverServicesButton" onClick={()=>setOpen(true)}>☷ <span>كل الخدمات</span></button>}
  {open&&<div className="mobileServicesOverlay" onClick={()=>setOpen(false)}><div className="mobileServicesSheet" onClick={e=>e.stopPropagation()}><div className="sheetHead"><div><b>خدمات سكينة</b><small>كل الميزات المفعلة في مكان واحد</small></div><button onClick={()=>setOpen(false)}>×</button></div><ServiceList close={()=>setOpen(false)}/></div></div>}
 </div>;
}
