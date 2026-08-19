import React,{useEffect,useState} from "react";
import SakinahNativeReadyLayer from "./SakinahNativeReadyLayer.jsx";
import "./responsiveShell.css";

const groups=[
 {title:"الشخصي",items:[["✎","الملاحظات",()=>emit("sakinah:notebook","notes")],["⌁","الحسابات",()=>emit("sakinah:notebook","accounts")],["♙","البروفايلات",()=>emit("sakinah:devotion","profiles")]]},
 {title:"العبادة",items:[["⌖","القبلة",()=>emit("sakinah:worship","qibla")],["⌂","أقرب مسجد",()=>emit("sakinah:worship","mosques")],["◈","الزكاة",()=>emit("sakinah:worship","zakat")],["◌","المناسك",()=>emit("sakinah:worship","manasik")],["◎","المسبحة",()=>emit("sakinah:devotion","tasbeeh")],["▤","الصلاة والوضوء",()=>emit("sakinah:devotion","guide")]]},
 {title:"التنبيهات",items:[["◔","المؤذن",()=>emit("sakinah:native","alerts")],["♪","أصوات الأذان",()=>emit("sakinah:native","adhan-audio")],["▦","Widget",()=>emit("sakinah:native","widget")]]},
];
function emit(name,detail){window.dispatchEvent(new CustomEvent(name,{detail}))}
function ServiceList({close}){return <div className="serviceGroups">{groups.map(g=><section key={g.title}><div className="serviceGroupTitle">{g.title}</div>{g.items.map(([icon,label,action])=><button key={label} onClick={()=>{action();close?.()}}><span>{icon}</span><b>{label}</b></button>)}</section>)}</div>}
export default function SakinahResponsiveShell(){
 const [open,setOpen]=useState(false),[discover,setDiscover]=useState(false);
 useEffect(()=>{
  const onClick=e=>{
   const b=e.target.closest?.('nav[aria-label="Sakinah primary"] button');
   if(!b)return;
   const nav=b.closest('nav[aria-label="Sakinah primary"]');
   const buttons=[...nav.querySelectorAll('button')];
   setDiscover(buttons.indexOf(b)===3);
  };
  document.addEventListener('click',onClick,true);
  return()=>document.removeEventListener('click',onClick,true);
 },[]);
 return <div className="sakinahResponsiveShell" dir="rtl">
  <aside className="desktopServiceRail"><div className="railBrand"><span>س</span><div><b>سكينة</b><small>خدماتك</small></div></div><ServiceList/></aside>
  <div className="responsiveAppStage"><SakinahNativeReadyLayer/></div>
  {discover&&<button className="discoverServicesButton" onClick={()=>setOpen(true)}>☷ <span>الخدمات</span></button>}
  {open&&<div className="mobileServicesOverlay" onClick={()=>setOpen(false)}><div className="mobileServicesSheet" onClick={e=>e.stopPropagation()}><div className="sheetHead"><div><b>خدمات سكينة</b><small>كل الأدوات في مكان واحد</small></div><button onClick={()=>setOpen(false)}>×</button></div><ServiceList close={()=>setOpen(false)}/></div></div>}
 </div>;
}
