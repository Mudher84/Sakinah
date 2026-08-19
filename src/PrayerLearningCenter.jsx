import React,{useMemo,useState} from "react";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62",soft:"#EFE7D8",green:"#416F5A"};
const btn={border:"1px solid rgba(16,16,15,.08)",borderRadius:16,padding:11,background:"rgba(255,255,255,.62)",fontFamily:"inherit",color:"inherit"};
const AR_NUM=n=>String(n).replace(/[0-9]/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]);

const PRAYERS={
 fajr:{name:"الفجر",rakats:2,sujud:4,color:"#5C7082"},
 dhuhr:{name:"الظهر",rakats:4,sujud:8,color:"#B18C4A"},
 asr:{name:"العصر",rakats:4,sujud:8,color:"#9A7448"},
 maghrib:{name:"المغرب",rakats:3,sujud:6,color:"#8A5D55"},
 isha:{name:"العشاء",rakats:4,sujud:8,color:"#35495E"}
};
const WUDU=[
 {title:"النية والتسمية",body:"انوِ الوضوء بقلبك، وابدأ بقول: بسم الله."},
 {title:"غسل الكفين",body:"اغسل الكفين إلى الرسغين، مع إيصال الماء بين الأصابع."},
 {title:"المضمضة والاستنشاق",body:"تمضمض بالماء، ثم استنشق الماء برفق واستنثره."},
 {title:"غسل الوجه",body:"اغسل الوجه كله من منابت الشعر المعتادة إلى أسفل الذقن، ومن الأذن إلى الأذن."},
 {title:"غسل اليدين إلى المرفقين",body:"اغسل اليد اليمنى إلى المرفق، ثم اليسرى، مع إيصال الماء إلى كامل الموضع."},
 {title:"مسح الرأس والأذنين",body:"امسح الرأس بيدين مبللتين، ثم امسح الأذنين."},
 {title:"غسل الرجلين إلى الكعبين",body:"اغسل الرجل اليمنى إلى الكعبين ثم اليسرى، وانتبه لما بين الأصابع."}
];
const BASE_RECITATION={
 standing:"قف معتدلاً مستقبل القبلة. انوِ الصلاة بقلبك، ثم قل: الله أكبر.",
 fatiha:"اقرأ سورة الفاتحة. في الركعتين الأولى والثانية اقرأ بعدها ما تيسر من القرآن.",
 ruku:"قل: الله أكبر واركع مطمئناً، وسبّح ربك في الركوع.",
 rise:"ارفع من الركوع حتى تعتدل قائماً مطمئناً.",
 sujud1:"قل: الله أكبر واسجد السجدة الأولى مطمئناً.",
 sit:"ارفع من السجود واجلس جلسة مطمئنة بين السجدتين.",
 sujud2:"اسجد السجدة الثانية مطمئناً، وبذلك تتم سجدتا هذه الركعة.",
 tashahhud:"اجلس للتشهد في هذا الموضع.",
 final:"أكمل التشهد الأخير والصلاة على النبي ﷺ، ثم سلّم عن اليمين وعن اليسار."
};
function rakahSteps(r,total){
 const steps=[
  {k:"قيام",t:`القيام للركعة ${AR_NUM(r)}`,d:r===1?BASE_RECITATION.standing:"قم للركعة التالية قائماً."},
  {k:"قراءة",t:"الفاتحة والقراءة",d:(r<=2?BASE_RECITATION.fatiha:"اقرأ سورة الفاتحة. في هذا الدليل المبسط نكتفي بها في الركعات بعد الثانية.")},
  {k:"ركوع",t:"الركوع",d:BASE_RECITATION.ruku},
  {k:"قيام",t:"الرفع من الركوع",d:BASE_RECITATION.rise},
  {k:"سجود",t:"السجدة الأولى",d:BASE_RECITATION.sujud1},
  {k:"جلوس",t:"الجلوس بين السجدتين",d:BASE_RECITATION.sit},
  {k:"سجود",t:"السجدة الثانية",d:BASE_RECITATION.sujud2}
 ];
 const isFinal=r===total;
 const firstTashahhud=r===2&&total>2;
 if(firstTashahhud)steps.push({k:"تشهد",t:"التشهد الأول",d:"بعد السجدة الثانية اجلس للتشهد الأول، ثم قم للركعة التالية."});
 if(isFinal)steps.push({k:"تشهد",t:"التشهد الأخير والتسليم",d:BASE_RECITATION.final});
 return steps;
}
function prayerPlan(p){
 const out=[];
 for(let r=1;r<=p.rakats;r++)out.push({r,steps:rakahSteps(r,p.rakats)});
 return out;
}

function Stepper({items,current,setCurrent}){
 const item=items[current];
 return <section style={{marginTop:14,padding:16,borderRadius:24,background:"rgba(255,255,255,.66)",border:"1px solid rgba(16,16,15,.06)"}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}><b style={{fontSize:13}}>التعليم خطوة بخطوة</b><span style={{fontSize:10,opacity:.45}}>{AR_NUM(current+1)} / {AR_NUM(items.length)}</span></div>
  <div style={{marginTop:14,padding:18,borderRadius:20,background:"rgba(181,154,98,.09)"}}><div style={{width:36,height:36,borderRadius:"50%",background:C.lapis,color:"white",display:"grid",placeItems:"center",fontWeight:700}}>{AR_NUM(current+1)}</div><h3 style={{fontSize:20,margin:"12px 0 6px"}}>{item.title}</h3><div style={{fontSize:13,lineHeight:2,opacity:.78}}>{item.body}</div></div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:10}}><button disabled={current===0} onClick={()=>setCurrent(v=>Math.max(0,v-1))} style={{...btn,opacity:current===0?.4:1}}>السابق</button><button disabled={current===items.length-1} onClick={()=>setCurrent(v=>Math.min(items.length-1,v+1))} style={{...btn,background:C.lapis,color:"white",border:0,opacity:current===items.length-1?.5:1}}>التالي</button></div>
 </section>
}

export default function PrayerLearningCenter(){
 const[tab,setTab]=useState("wudu"),[wuduStep,setWuduStep]=useState(0),[prayerId,setPrayerId]=useState("fajr"),[activeRakah,setActiveRakah]=useState(1),[compact,setCompact]=useState(false);
 const prayer=PRAYERS[prayerId];
 const plan=useMemo(()=>prayerPlan(prayer),[prayerId]);
 return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,overflowY:"auto"}} dir="rtl"><div style={{maxWidth:760,margin:"0 auto",padding:"28px 18px 140px",boxSizing:"border-box"}}>
  <header style={{textAlign:"center"}}><div style={{fontSize:10,color:C.gold,letterSpacing:1.2}}>SAKINAH</div><h1 style={{fontSize:30,margin:"7px 0 3px"}}>تعليم الصلاة والوضوء</h1><div style={{fontSize:11,opacity:.52,lineHeight:1.8}}>تعليم عملي للمبتدئ: ركعة ركعة، مع عدد السجدات والتشهدات ومكان التسليم.</div></header>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:18}}><button onClick={()=>setTab("wudu")} style={{...btn,background:tab==="wudu"?C.lapis:"rgba(255,255,255,.56)",color:tab==="wudu"?"white":C.ink}}>الوضوء</button><button onClick={()=>setTab("prayer")} style={{...btn,background:tab==="prayer"?C.lapis:"rgba(255,255,255,.56)",color:tab==="prayer"?"white":C.ink}}>الصلاة</button></div>

  {tab==="wudu"&&<>
   <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginTop:12}}>{["العربية","English","Türkçe","اردو"].map((x,i)=><button key={x} style={{...btn,padding:9,background:i===0?"rgba(181,154,98,.14)":"rgba(255,255,255,.5)"}}>{x}</button>)}</div>
   <Stepper items={WUDU} current={wuduStep} setCurrent={setWuduStep}/>
   <section style={{marginTop:14}}><div style={{fontSize:12,fontWeight:800,marginBottom:8}}>كل خطوات الوضوء</div>{WUDU.map((x,i)=><div key={x.title} style={{display:"grid",gridTemplateColumns:"38px 1fr",gap:10,padding:"13px 0",borderTop:"1px solid rgba(16,16,15,.07)"}}><div style={{width:34,height:34,borderRadius:13,background:C.soft,color:C.gold,display:"grid",placeItems:"center",fontWeight:700}}>{AR_NUM(i+1)}</div><div><b style={{fontSize:12.5}}>{x.title}</b><div style={{fontSize:11,lineHeight:1.8,opacity:.55,marginTop:3}}>{x.body}</div></div></div>)}</section>
  </>}

  {tab==="prayer"&&<>
   <section style={{marginTop:14,padding:14,borderRadius:22,background:"rgba(255,255,255,.62)",border:"1px solid rgba(16,16,15,.06)"}}><div style={{fontSize:12,fontWeight:800}}>اختر الصلاة المفروضة</div><div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginTop:9}}>{Object.entries(PRAYERS).map(([id,p])=><button key={id} onClick={()=>{setPrayerId(id);setActiveRakah(1)}} style={{...btn,padding:"10px 4px",background:prayerId===id?p.color:"rgba(255,255,255,.48)",color:prayerId===id?"white":C.ink,border:0}}><b style={{fontSize:11}}>{p.name}</b><span style={{display:"block",fontSize:9,opacity:.72,marginTop:3}}>{AR_NUM(p.rakats)} ركعات</span></button>)}</div></section>
   <section style={{marginTop:12,padding:18,borderRadius:26,background:`linear-gradient(145deg,${prayer.color},#173B57)`,color:"white"}}><div style={{fontSize:11,opacity:.7}}>صلاة {prayer.name}</div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginTop:12}}><div><b style={{fontSize:28}}>{AR_NUM(prayer.rakats)}</b><small style={{display:"block",opacity:.72}}>ركعات</small></div><div><b style={{fontSize:28}}>{AR_NUM(prayer.sujud)}</b><small style={{display:"block",opacity:.72}}>سجدات</small></div><div><b style={{fontSize:28}}>{AR_NUM(prayer.rakats*2)}</b><small style={{display:"block",opacity:.72}}>سجدتان بكل ركعة</small></div></div></section>
   <div style={{display:"flex",gap:7,overflowX:"auto",padding:"12px 0 4px"}}>{plan.map(x=><button key={x.r} onClick={()=>setActiveRakah(x.r)} style={{...btn,whiteSpace:"nowrap",background:activeRakah===x.r?C.lapis:"rgba(255,255,255,.56)",color:activeRakah===x.r?"white":C.ink}}>الركعة {AR_NUM(x.r)}</button>)}</div>
   <section style={{marginTop:8,padding:16,borderRadius:24,background:"rgba(255,255,255,.64)",border:"1px solid rgba(16,16,15,.06)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}><div><div style={{fontSize:10,color:C.gold}}>صلاة {prayer.name}</div><h2 style={{fontSize:22,margin:"3px 0 0"}}>الركعة {AR_NUM(activeRakah)}</h2></div><button onClick={()=>setCompact(v=>!v)} style={{...btn,padding:"8px 10px"}}>{compact?"شرح مفصل":"عرض مختصر"}</button></div>
    <div style={{marginTop:12,display:"grid",gap:8}}>{plan[activeRakah-1].steps.map((s,i)=><div key={`${s.t}-${i}`} style={{display:"grid",gridTemplateColumns:"38px 1fr",gap:10,padding:12,borderRadius:17,background:s.k==="سجود"?"rgba(181,154,98,.11)":"rgba(23,59,87,.045)"}}><div style={{width:34,height:34,borderRadius:12,background:s.k==="سجود"?C.gold:C.lapis,color:"white",display:"grid",placeItems:"center",fontSize:11,fontWeight:700}}>{AR_NUM(i+1)}</div><div><b style={{fontSize:12.5}}>{s.t}</b>{!compact&&<div style={{fontSize:11.5,lineHeight:1.9,opacity:.64,marginTop:3}}>{s.d}</div>}</div></div>)}</div>
   </section>
   <section style={{marginTop:14,padding:15,borderRadius:22,background:"rgba(65,111,90,.08)",border:"1px solid rgba(65,111,90,.12)"}}><b style={{fontSize:12}}>ملخص للمبتدئ</b><div style={{fontSize:11.5,lineHeight:1.9,marginTop:7}}>كل ركعة فيها <b>ركوع واحد وسجدتان</b>. صلاة {prayer.name} فيها {AR_NUM(prayer.rakats)} ركعات، لذلك مجموع السجدات {AR_NUM(prayer.sujud)}. {prayer.rakats>2?"بعد الركعة الثانية يوجد تشهد أول، ثم تكمل الركعات، وفي الركعة الأخيرة التشهد الأخير والتسليم.":"بعد الركعة الثانية يكون التشهد الأخير ثم التسليم."}</div></section>
   <div style={{fontSize:9.5,opacity:.45,lineHeight:1.8,marginTop:12}}>هذا مسار تعليمي مبسط للمبتدئ يشرح الهيكل العام للصلاة. توجد تفاصيل فقهية في بعض الهيئات والأذكار قد تختلف بين المذاهب، لذلك لا يستبدل التلقي من معلّم موثوق عند الحاجة.</div>
  </>}
 </div></div>
}
