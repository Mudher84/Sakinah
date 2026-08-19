import React,{useEffect,useMemo,useState} from "react";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62"};
const DHIKR=[
 ["سبحان الله","SubhanAllah",33],
 ["الحمد لله","Alhamdulillah",33],
 ["الله أكبر","Allahu Akbar",34],
 ["أستغفر الله","Astaghfirullah",100],
 ["لا إله إلا الله","La ilaha illa Allah",100],
 ["اللهم صل على محمد","Salawat",100]
];
const activeProfile=()=>{try{return localStorage.getItem("sakinah-active-profile")||"me"}catch{return"me"}};
const pkey=n=>`sakinah-${n}-${activeProfile()}`;
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};

export default function ModernTasbeeh({lang="ar",go}){
 const [idx,setIdx]=useState(()=>read(pkey("tasbeeh-dhikr"),0));
 const [count,setCount]=useState(()=>read(pkey("tasbeeh-count"),0));
 const [target,setTarget]=useState(()=>read(pkey("tasbeeh-target"),33));
 const [vibrate,setVibrate]=useState(()=>read(pkey("tasbeeh-vibrate"),true));
 const item=DHIKR[idx]||DHIKR[0];
 const isAr=lang==="ar";
 useEffect(()=>{
  write(pkey("tasbeeh-dhikr"),idx);
  write(pkey("tasbeeh-count"),count);
  write(pkey("tasbeeh-target"),target);
  write(pkey("tasbeeh-vibrate"),vibrate);
 },[idx,count,target,vibrate]);
 const cycle=count?Math.floor(count/target):0;
 const progress=useMemo(()=>Math.min(100,(count===0?0:((count%target)||target)/target*100)),[count,target]);
 const remaining=Math.max(0,target-(count%target||0));
 const tap=()=>{
  const n=count+1;setCount(n);
  const today=new Date().toISOString().slice(0,10);
  const hist=read(pkey("tasbeeh-history"),{});hist[today]=(hist[today]||0)+1;write(pkey("tasbeeh-history"),hist);
  if(vibrate&&navigator.vibrate)navigator.vibrate(n%target===0?[55,45,90]:15);
 };
 const chip=(active)=>({border:0,borderRadius:999,padding:"10px 15px",fontFamily:"inherit",fontSize:12,background:active?C.ink:"rgba(255,255,255,.66)",color:active?"white":C.ink,boxShadow:active?"0 8px 20px rgba(16,16,15,.12)":"inset 0 0 0 1px rgba(16,16,15,.08)",cursor:"pointer"});
 return <div dir={isAr?"rtl":"ltr"} style={{position:"fixed",inset:0,zIndex:50000,overflowY:"auto",background:"linear-gradient(180deg,#F7F3EB 0%,#F4F1EA 45%,#ECE8DF 100%)",color:C.ink,padding:"76px 18px 132px",boxSizing:"border-box"}}>
  <div style={{maxWidth:620,margin:"0 auto"}}>
   <header style={{position:"relative",padding:"0 2px 18px",textAlign:isAr?"right":"left"}}>
    <button onClick={go} aria-label={isAr?"رجوع":"Back"} style={{position:"absolute",top:-54,[isAr?"left":"right"]:0,width:42,height:42,border:0,borderRadius:14,background:"rgba(255,255,255,.72)",boxShadow:"0 8px 24px rgba(16,16,15,.07)",fontFamily:"inherit",fontSize:19,color:C.ink,cursor:"pointer"}}>{isAr?"←":"→"}</button>
    <div style={{fontSize:10,letterSpacing:2.1,color:C.gold,fontWeight:700}}>SAKINAH · DHIKR</div>
    <h1 style={{margin:"8px 0 0",fontSize:"clamp(31px,8vw,46px)",lineHeight:1.28,fontWeight:500,fontFamily:"'IBM Plex Sans Arabic','Noto Naskh Arabic',sans-serif"}}>{isAr?"المسبحة الذكية":"Smart Tasbeeh"}</h1>
    <p style={{margin:"7px 0 0",fontSize:12.5,lineHeight:1.8,opacity:.48}}>{isAr?"مساحة هادئة للذكر، تحفظ تقدمك تلقائياً لكل بروفايل.":"A calm dhikr space that saves progress for each profile."}</p>
   </header>

   <section style={{borderRadius:28,padding:"16px",background:"rgba(255,255,255,.58)",boxShadow:"0 18px 55px rgba(45,38,24,.07)",border:"1px solid rgba(255,255,255,.72)",backdropFilter:"blur(18px)"}}>
    <label style={{display:"block",fontSize:10.5,opacity:.42,marginBottom:7}}>{isAr?"الذكر الحالي":"Current dhikr"}</label>
    <select value={idx} onChange={e=>{const i=Number(e.target.value);setIdx(i);setCount(0);setTarget(DHIKR[i][2])}} style={{width:"100%",height:48,border:0,borderRadius:16,padding:"0 14px",background:"#F6F2E9",fontFamily:"inherit",fontSize:13,color:C.ink,outline:"none",boxShadow:"inset 0 0 0 1px rgba(16,16,15,.07)"}}>{DHIKR.map((x,i)=><option key={x[0]} value={i}>{isAr?x[0]:x[1]}</option>)}</select>

    <button onClick={tap} aria-label={isAr?"اضغط للتسبيح":"Tap to count"} style={{position:"relative",display:"grid",placeItems:"center",width:"min(290px,76vw)",aspectRatio:"1",margin:"24px auto 18px",border:0,borderRadius:"50%",background:"radial-gradient(circle at 50% 34%,#FFFDF8 0%,#F4E9D3 58%,#E7D6B3 100%)",boxShadow:"0 26px 70px rgba(76,61,31,.15),inset 0 0 0 1px rgba(181,154,98,.23),inset 0 16px 28px rgba(255,255,255,.72)",fontFamily:"inherit",color:C.ink,cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
     <span style={{position:"absolute",inset:13,borderRadius:"50%",border:"1px solid rgba(181,154,98,.14)"}}/>
     <span style={{position:"relative",zIndex:1,textAlign:"center"}}><b style={{display:"block",fontSize:"clamp(58px,16vw,82px)",lineHeight:1,fontWeight:500,fontVariantNumeric:"tabular-nums"}}>{count}</b><small style={{display:"block",marginTop:12,fontSize:13,opacity:.48}}>{isAr?item[0]:item[1]}</small><span style={{display:"block",marginTop:6,fontSize:9.5,letterSpacing:1.2,color:C.gold}}>{isAr?"اضغط للذكر":"TAP TO COUNT"}</span></span>
    </button>

    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,fontSize:10.5,opacity:.52,marginBottom:7}}><span>{isAr?`الجولة ${cycle+1}`:`Round ${cycle+1}`}</span><span>{isAr?`المتبقي ${remaining===target&&count===0?target:remaining}`:`${remaining===target&&count===0?target:remaining} left`}</span></div>
    <div style={{height:6,borderRadius:999,background:"rgba(16,16,15,.07)",overflow:"hidden"}}><div style={{height:"100%",width:`${progress}%`,borderRadius:999,background:"linear-gradient(90deg,#C6AC70,#9D7F43)",transition:"width .22s ease"}}/></div>
   </section>

   <section style={{marginTop:14,padding:"15px",borderRadius:24,background:"rgba(255,255,255,.42)",border:"1px solid rgba(16,16,15,.055)"}}>
    <div style={{fontSize:10.5,opacity:.43,marginBottom:10}}>{isAr?"هدف الجولة":"Round target"}</div>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{[33,100,1000].map(n=><button key={n} onClick={()=>setTarget(n)} style={chip(target===n)}>{n}</button>)}</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginTop:14}}>
     <button onClick={()=>setVibrate(v=>!v)} style={{height:48,border:0,borderRadius:16,background:vibrate?"rgba(23,59,87,.10)":"rgba(255,255,255,.58)",color:C.ink,fontFamily:"inherit",fontSize:12,boxShadow:"inset 0 0 0 1px rgba(16,16,15,.06)"}}>{isAr?`الاهتزاز · ${vibrate?"مفعّل":"متوقف"}`:`Vibration · ${vibrate?"On":"Off"}`}</button>
     <button onClick={()=>setCount(0)} style={{height:48,border:0,borderRadius:16,background:"rgba(255,255,255,.58)",color:C.ink,fontFamily:"inherit",fontSize:12,boxShadow:"inset 0 0 0 1px rgba(16,16,15,.06)"}}>{isAr?"تصفير العداد":"Reset count"}</button>
    </div>
   </section>
  </div>
 </div>;
}
