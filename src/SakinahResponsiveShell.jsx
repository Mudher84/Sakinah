import React,{useEffect,useState} from "react";
import SakinahNativeReadyLayer from "./SakinahNativeReadyLayer.jsx";
import "./responsiveShell.css";

function emit(name,detail){window.dispatchEvent(new CustomEvent(name,{detail}))}
const feature=(id)=>()=>emit("sakinah:feature",id);
const groups=[
 {title:"القرآن والحديث",items:[
  ["♪","مشغل القرآن",feature("quran-player")],["▤","الكتب التسعة",feature("nine-books")],["▥","ذكاء القرآن",feature("quran-intelligence")],["⌕","البحث الإسلامي",feature("islamic-search")],["◫","تحليلات القرآن",feature("quran-analytics")],["◌","تدبر آية",feature("tadabbur-ayah")],["⌘","موضوعات القرآن",feature("quran-topics")],["≍","مقارنة الكلمات",feature("quran-compare")],["⌁","جذور القرآن",feature("quran-roots")],["◇","كيانات القرآن",feature("quran-entities")]
 ]},
 {title:"الذكر والمحتوى",items:[
  ["✦","المحتوى الموثق",feature("trusted-daily")],["☾","أدعية قرآنية",feature("quranic-duas")],["◎","الأذكار الذكية",feature("smart-quranic-adhkar")],["◌","التأمل اليومي",feature("daily-reflection")],["✧","السيرة والقصص",feature("sourced-seerah")],["99","أسماء الله الحسنى",feature("names-live")],["▧","حصن المسلم",feature("hisn-center")],["♡","المكتبة المحفوظة",feature("saved-library")]
 ]},
 {title:"يومي والعبادات",items:[
  ["☼","يومي الذكي",feature("my-day")],["◫","أدوات العبادة اليومية",feature("daily-tools")],["▦","التقويم الإسلامي",feature("islamic-calendar")],["☽","الصيام",feature("fasting-center")],["✦","رمضان",feature("ramadan-center")],["✓","الختمة الذكية",feature("smart-khatmah")],["▥","الحفظ والمراجعة",feature("memorization-center")],["☼","الجمعة",feature("jumuah-center")],["◷","أوقات العبادة",feature("worship-times")]
 ]},
 {title:"العبادة الميدانية",items:[
  ["⌖","القبلة",()=>emit("sakinah:worship","qibla")],["⌂","أقرب مسجد",()=>emit("sakinah:worship","mosques")],["◈","الزكاة",()=>emit("sakinah:worship","zakat")],["◌","مناسك الحج والعمرة",()=>emit("sakinah:worship","manasik")],["◎","المسبحة",()=>emit("sakinah:devotion","tasbeeh")],["▤","تعليم الصلاة والوضوء",()=>emit("sakinah:devotion","guide")]
 ]},
 {title:"الأطفال والعائلة",items:[
  ["☀","عالم الأطفال",feature("kids-world")],["▥","معلم القرآن للأطفال",feature("kids-quran-live")],["?","مسابقات الأطفال",feature("kids-quiz-live")],["☀","الرقابة الأبوية",feature("parental-controls")]
 ]},
 {title:"الشخصي والإبداع",items:[
  ["✎","دفتر الملاحظات",()=>emit("sakinah:notebook","notes")],["⌁","دفتر الحسابات",()=>emit("sakinah:notebook","accounts")],["♙","البروفايلات",()=>emit("sakinah:devotion","profiles")],["◇","صانع البطاقات الإسلامية",feature("card-maker")],["♡","المحفوظات",feature("saved-library")]
 ]},
 {title:"التنبيهات والنظام",items:[
  ["◔","المؤذن والتنبيهات",()=>emit("sakinah:native","alerts")],["♪","أصوات الأذان لكل صلاة",()=>emit("sakinah:native","adhan-audio")],["▦","Widget",()=>emit("sakinah:native","widget")],["⌾","قفل الخصوصية",feature("privacy-lock")],["◫","Offline والنسخ الاحتياطي",feature("offline-backup")]
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
  <div className="responsiveAppStage"><SakinahNativeReadyLayer/></div>
  {discover&&<button className="discoverServicesButton" onClick={()=>setOpen(true)}>☷ <span>كل الخدمات</span></button>}
  {open&&<div className="mobileServicesOverlay" onClick={()=>setOpen(false)}><div className="mobileServicesSheet" onClick={e=>e.stopPropagation()}><div className="sheetHead"><div><b>خدمات سكينة</b><small>كل الميزات المطلوبة في مكان واحد</small></div><button onClick={()=>setOpen(false)}>×</button></div><ServiceList close={()=>setOpen(false)}/></div></div>}
 </div>;
}
