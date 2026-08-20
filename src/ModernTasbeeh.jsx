import React,{useEffect,useMemo,useState} from "react";

const INK="#15130F",GOLD="#B99755",BLUE="#173B57",RED="#B73535";
const DHIKR=[["سبحان الله","SubhanAllah",33],["الحمد لله","Alhamdulillah",33],["الله أكبر","Allahu Akbar",34],["أستغفر الله","Astaghfirullah",100],["لا إله إلا الله","La ilaha illa Allah",100],["اللهم صل على محمد","Salawat",100]];
const activeProfile=()=>{try{return localStorage.getItem("sakinah-active-profile")||"me"}catch{return"me"}};
const pkey=n=>`sakinah-${n}-${activeProfile()}`;
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};

export default function ModernTasbeeh({lang="ar",go}){
 const ar=lang==="ar";
 const [idx,setIdx]=useState(()=>read(pkey("tasbeeh-dhikr"),0));
 const [count,setCount]=useState(()=>read(pkey("tasbeeh-count"),0));
 const [target,setTarget]=useState(()=>read(pkey("tasbeeh-target"),33));
 const [vibrate,setVibrate]=useState(()=>read(pkey("tasbeeh-vibrate"),true));
 const [dhikrOpen,setDhikrOpen]=useState(false);
 const item=DHIKR[idx]||DHIKR[0];
 useEffect(()=>{write(pkey("tasbeeh-dhikr"),idx);write(pkey("tasbeeh-count"),count);write(pkey("tasbeeh-target"),target);write(pkey("tasbeeh-vibrate"),vibrate)},[idx,count,target,vibrate]);
 const step=count%target;
 const progress=useMemo(()=>count===0?0:((step||target)/target)*100,[count,step,target]);
 const remaining=count===0?target:(step===0?0:target-step);
 const round=Math.floor(count/target)+1;
 const tap=()=>{const n=count+1;setCount(n);const today=new Date().toISOString().slice(0,10);const h=read(pkey("tasbeeh-history"),{});h[today]=(h[today]||0)+1;write(pkey("tasbeeh-history"),h);if(vibrate&&navigator.vibrate)navigator.vibrate(n%target===0?[55,45,95]:14)};
 const chooseDhikr=i=>{setIdx(i);setCount(0);setTarget(DHIKR[i][2]);setDhikrOpen(false)};
 const resetCount=()=>{setCount(0);if(vibrate&&navigator.vibrate)navigator.vibrate([25,35,25])};
 const beadCount=17;
 return <div className="sakinah-tasbeeh-scroll" dir={ar?"rtl":"ltr"} style={{position:"fixed",inset:0,zIndex:50000,overflowY:"auto",boxSizing:"border-box",background:"#F3EFE6",color:INK,fontFamily:"inherit",scrollbarWidth:"none",msOverflowStyle:"none"}}>
  <style>{`.sakinah-tasbeeh-scroll::-webkit-scrollbar{display:none;width:0;height:0}`}</style>
  <div style={{maxWidth:620,minHeight:"100%",margin:"0 auto",padding:"max(82px,calc(env(safe-area-inset-top) + 52px)) 18px 120px",boxSizing:"border-box"}}>
   <header style={{position:"relative",minHeight:88,display:"grid",gridTemplateColumns:"52px minmax(0,1fr) 52px",alignItems:"center",columnGap:12,boxSizing:"border-box"}}>
    <button onClick={resetCount} title={ar?"تصفير العداد":"Reset counter"} aria-label={ar?"تصفير العداد":"Reset counter"} style={{gridColumn:1,justifySelf:"center",width:44,height:44,border:0,borderRadius:22,background:RED,color:"white",boxShadow:"0 10px 24px rgba(183,53,53,.24),inset 0 1px 0 rgba(255,255,255,.2)",fontSize:18,fontWeight:500,cursor:"pointer",zIndex:2,display:"grid",placeItems:"center",WebkitTapHighlightColor:"transparent"}}>↺</button>
    <div style={{gridColumn:2,width:"100%",minWidth:0,textAlign:"center"}}><div style={{fontSize:9,letterSpacing:2.5,color:GOLD,fontWeight:700}}>SAKINAH</div><h1 style={{fontFamily:"'IBM Plex Sans Arabic','Noto Naskh Arabic',sans-serif",fontSize:"clamp(24px,7vw,30px)",lineHeight:1.45,fontWeight:500,margin:"4px 0 0",padding:"2px 0 4px",whiteSpace:"nowrap",overflow:"visible",textOverflow:"clip"}}>{ar?"المسبحة الذكية":"Smart Tasbeeh"}</h1></div>
    <button onClick={()=>setVibrate(v=>!v)} title={ar?"الاهتزاز":"Vibration"} aria-label={ar?"تشغيل أو إيقاف الاهتزاز":"Toggle vibration"} style={{gridColumn:3,justifySelf:"center",width:44,height:44,border:0,borderRadius:22,background:vibrate?BLUE:"rgba(255,255,255,.72)",color:vibrate?"white":INK,fontSize:15,cursor:"pointer",zIndex:2,display:"grid",placeItems:"center"}}>〰</button>
    <button onClick={go} aria-label={ar?"رجوع":"Back"} title={ar?"رجوع":"Back"} style={{position:"absolute",insetInlineStart:0,top:-34,width:34,height:34,border:0,borderRadius:17,background:"rgba(255,255,255,.58)",boxShadow:"0 6px 18px rgba(31,25,14,.05)",fontSize:15,color:INK,cursor:"pointer",zIndex:2}}>←</button>
   </header>

   <div style={{position:"relative",marginTop:16,zIndex:8}}>
    <button onClick={()=>setDhikrOpen(v=>!v)} aria-expanded={dhikrOpen} style={{width:"100%",height:58,border:0,borderRadius:999,padding:"0 14px",display:"grid",gridTemplateColumns:"42px 1fr auto",alignItems:"center",gap:10,background:"rgba(255,255,255,.72)",boxShadow:"0 14px 40px rgba(38,30,16,.055),inset 0 0 0 1px rgba(21,19,15,.055)",fontFamily:"inherit",color:INK,cursor:"pointer",textAlign:ar?"right":"left"}}>
     <span style={{width:38,height:38,borderRadius:"50%",display:"grid",placeItems:"center",background:"#EAE1CE",color:GOLD,fontSize:17}}>✦</span>
     <span style={{minWidth:0,fontSize:14,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ar?item[0]:item[1]}</span>
     <span style={{display:"flex",alignItems:"center",gap:8,fontSize:10,opacity:.48,whiteSpace:"nowrap"}}><span>{ar?`هدف ${target}`:`Goal ${target}`}</span><span style={{fontSize:13,transform:dhikrOpen?"rotate(180deg)":"none",transition:"transform .18s ease"}}>⌄</span></span>
    </button>
    {dhikrOpen&&<div style={{position:"absolute",top:66,left:0,right:0,padding:8,borderRadius:26,background:"rgba(255,253,248,.96)",boxShadow:"0 24px 65px rgba(32,26,16,.16)",border:"1px solid rgba(21,19,15,.06)",backdropFilter:"blur(18px)",overflow:"hidden"}}>{DHIKR.map((x,i)=><button key={x[0]} onClick={()=>chooseDhikr(i)} style={{width:"100%",minHeight:46,border:0,borderRadius:18,padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,background:i===idx?"#EDE3CF":"transparent",color:INK,fontFamily:"inherit",fontSize:13.5,textAlign:ar?"right":"left",cursor:"pointer"}}><span>{ar?x[0]:x[1]}</span><span style={{fontSize:10,opacity:.4}}>{x[2]}</span></button>)}</div>}
   </div>

   <main style={{position:"relative",height:390,marginTop:8,display:"grid",placeItems:"center"}}>
    <div style={{position:"absolute",width:306,height:306,borderRadius:"50%",border:"1px solid rgba(185,151,85,.18)"}}/>
    {Array.from({length:beadCount}).map((_,i)=>{const a=(i/(beadCount-1))*280+130;const r=153;const x=Math.cos(a*Math.PI/180)*r,y=Math.sin(a*Math.PI/180)*r;const active=(i/(beadCount-1))*100<=progress;return <span key={i} style={{position:"absolute",left:`calc(50% + ${x}px - 6px)`,top:`calc(50% + ${y}px - 6px)`,width:active?13:10,height:active?13:10,borderRadius:"50%",background:active?GOLD:"#D9D3C7",boxShadow:active?"0 4px 12px rgba(185,151,85,.28)":"none",transition:"all .2s ease"}}/>})}
    <button onClick={tap} style={{position:"relative",width:222,height:222,borderRadius:"50%",border:0,background:"linear-gradient(145deg,#FFFDF8,#E9DDC5)",boxShadow:"0 30px 75px rgba(61,48,24,.14),inset 0 0 0 1px rgba(185,151,85,.22),inset 0 18px 35px rgba(255,255,255,.72)",color:INK,fontFamily:"inherit",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
     <span style={{display:"block",fontSize:72,lineHeight:1,fontWeight:400,fontVariantNumeric:"tabular-nums"}}>{count}</span>
     <span style={{display:"block",fontSize:13,marginTop:10,opacity:.52}}>{ar?item[0]:item[1]}</span>
     <span style={{display:"inline-block",fontSize:9,marginTop:12,padding:"5px 10px",borderRadius:999,background:"rgba(185,151,85,.12)",color:"#8B6B31"}}>{ar?"اضغط للتسبيح":"TAP TO COUNT"}</span>
    </button>
   </main>

   <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:-8}}>
    {[[ar?"الجولة":"ROUND",round],[ar?"المتبقي":"LEFT",remaining],[ar?"الهدف":"GOAL",target]].map(([label,value])=><div key={label} style={{padding:"14px 8px",borderRadius:20,textAlign:"center",background:"rgba(255,255,255,.55)",border:"1px solid rgba(30,25,17,.045)"}}><b style={{display:"block",fontSize:19,fontWeight:500}}>{value}</b><small style={{fontSize:9,opacity:.4}}>{label}</small></div>)}
   </div>

   <div style={{marginTop:16,height:5,borderRadius:999,overflow:"hidden",background:"rgba(21,19,15,.07)"}}><div style={{width:`${progress}%`,height:"100%",borderRadius:999,background:GOLD,transition:"width .2s ease"}}/></div>

   <section style={{marginTop:18}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}><span style={{fontSize:11,opacity:.45}}>{ar?"هدف الجولة":"Round goal"}</span></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>{[33,100,1000].map(n=><button key={n} onClick={()=>setTarget(n)} style={{height:50,border:0,borderRadius:18,fontFamily:"inherit",fontSize:14,background:target===n?INK:"rgba(255,255,255,.58)",color:target===n?"white":INK,boxShadow:target===n?"0 12px 30px rgba(21,19,15,.14)":"inset 0 0 0 1px rgba(21,19,15,.055)",cursor:"pointer"}}>{n}</button>)}</div>
   </section>
  </div>
 </div>;
}
