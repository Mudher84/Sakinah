import React,{useEffect,useMemo,useState} from "react";

const INK="#15130F",GOLD="#B99755",BLUE="#173B57";
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
 const item=DHIKR[idx]||DHIKR[0];
 useEffect(()=>{write(pkey("tasbeeh-dhikr"),idx);write(pkey("tasbeeh-count"),count);write(pkey("tasbeeh-target"),target);write(pkey("tasbeeh-vibrate"),vibrate)},[idx,count,target,vibrate]);
 const step=count%target;
 const progress=useMemo(()=>count===0?0:((step||target)/target)*100,[count,step,target]);
 const remaining=count===0?target:(step===0?0:target-step);
 const round=Math.floor(count/target)+1;
 const tap=()=>{const n=count+1;setCount(n);const today=new Date().toISOString().slice(0,10);const h=read(pkey("tasbeeh-history"),{});h[today]=(h[today]||0)+1;write(pkey("tasbeeh-history"),h);if(vibrate&&navigator.vibrate)navigator.vibrate(n%target===0?[55,45,95]:14)};
 const beadCount=17;
 return <div dir={ar?"rtl":"ltr"} style={{position:"fixed",inset:0,zIndex:50000,overflowY:"auto",boxSizing:"border-box",background:"#F3EFE6",color:INK,fontFamily:"inherit"}}>
  <div style={{maxWidth:620,minHeight:"100%",margin:"0 auto",padding:"max(72px,calc(env(safe-area-inset-top) + 42px)) 18px 120px",boxSizing:"border-box"}}>
   <header style={{display:"grid",gridTemplateColumns:"48px 1fr 48px",alignItems:"center",gap:8}}>
    <button onClick={go} style={{width:44,height:44,border:0,borderRadius:22,background:"rgba(255,255,255,.72)",boxShadow:"0 8px 25px rgba(31,25,14,.07)",fontSize:19,color:INK,cursor:"pointer"}}>←</button>
    <div style={{textAlign:"center"}}><div style={{fontSize:9,letterSpacing:2.5,color:GOLD,fontWeight:700}}>SAKINAH</div><h1 style={{fontFamily:"'IBM Plex Sans Arabic','Noto Naskh Arabic',sans-serif",fontSize:27,lineHeight:1.55,fontWeight:500,margin:"2px 0 0",paddingTop:2,overflow:"visible"}}>{ar?"المسبحة الذكية":"Smart Tasbeeh"}</h1></div>
    <button onClick={()=>setVibrate(v=>!v)} title={ar?"الاهتزاز":"Vibration"} style={{width:44,height:44,border:0,borderRadius:22,background:vibrate?BLUE:"rgba(255,255,255,.72)",color:vibrate?"white":INK,fontSize:15,cursor:"pointer"}}>〰</button>
   </header>

   <div style={{marginTop:24,display:"flex",alignItems:"center",gap:10,padding:"9px 10px 9px 14px",borderRadius:22,background:"rgba(255,255,255,.62)",boxShadow:"0 14px 40px rgba(38,30,16,.055)"}}>
    <div style={{width:42,height:42,borderRadius:16,display:"grid",placeItems:"center",background:"#EAE1CE",color:GOLD,fontSize:18}}>✦</div>
    <select value={idx} onChange={e=>{const i=+e.target.value;setIdx(i);setCount(0);setTarget(DHIKR[i][2])}} style={{flex:1,minWidth:0,height:42,border:0,outline:0,background:"transparent",fontFamily:"inherit",fontSize:14,color:INK}}>{DHIKR.map((x,i)=><option key={x[0]} value={i}>{ar?x[0]:x[1]}</option>)}</select>
    <div style={{fontSize:10,opacity:.42,whiteSpace:"nowrap"}}>{ar?`هدف ${target}`:`Goal ${target}`}</div>
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
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}><span style={{fontSize:11,opacity:.45}}>{ar?"هدف الجولة":"Round goal"}</span><button onClick={()=>setCount(0)} style={{border:0,background:"transparent",fontFamily:"inherit",fontSize:11,color:"#9A7440",cursor:"pointer"}}>{ar?"تصفير العداد":"Reset"}</button></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>{[33,100,1000].map(n=><button key={n} onClick={()=>setTarget(n)} style={{height:50,border:0,borderRadius:18,fontFamily:"inherit",fontSize:14,background:target===n?INK:"rgba(255,255,255,.58)",color:target===n?"white":INK,boxShadow:target===n?"0 12px 30px rgba(21,19,15,.14)":"inset 0 0 0 1px rgba(21,19,15,.055)",cursor:"pointer"}}>{n}</button>)}</div>
   </section>
  </div>
 </div>;
}
