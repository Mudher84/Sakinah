import React,{useMemo,useState} from "react";
const C={ivory:"#F6F3EC",ink:"#10100F",gold:"#B59A62",green:"#4F915C"};
const prayers=["الفجر","الظهر","العصر","المغرب","العشاء"];
const profile=()=>{try{return localStorage.getItem("sakinah-active-profile")||"me"}catch{return"me"}};
const dayKey=d=>d.toISOString().slice(0,10);
const key=d=>`sakinah-prayer-journal-${profile()}-${dayKey(d)}`;
const read=d=>{try{return JSON.parse(localStorage.getItem(key(d))||"{}")||{}}catch{return{}}};
const write=(d,v)=>{try{localStorage.setItem(key(d),JSON.stringify(v))}catch{}};
export default function PrayerJournal({go}){
 const days=useMemo(()=>Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));return d}),[]);
 const [selected,setSelected]=useState(days[6]);
 const [done,setDone]=useState(()=>read(days[6]));
 const choose=d=>{setSelected(d);setDone(read(d))};
 const toggle=p=>{const n={...done,[p]:!done[p]};setDone(n);write(selected,n)};
 const count=prayers.filter(p=>done[p]).length;
 return <div dir="rtl" style={{position:"fixed",inset:0,zIndex:50000,background:C.ivory,color:C.ink,overflowY:"auto"}}><main style={{maxWidth:720,margin:"0 auto",padding:"76px 20px 130px"}}><button onClick={()=>go("my-day")} style={{border:0,background:"transparent",fontFamily:"inherit",color:"inherit"}}>→ رجوع</button><div style={{textAlign:"center",marginTop:10}}><div style={{fontSize:10,color:C.gold,letterSpacing:.8}}>MUSLIM MIRROR</div><h1 style={{fontSize:29,margin:"4px 0"}}>سجل الصلاة</h1><div style={{fontSize:11,opacity:.46}}>متابعة بسيطة لصلواتك خلال آخر سبعة أيام</div></div><div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6,marginTop:22}}>{days.map(d=>{const active=dayKey(d)===dayKey(selected);return <button key={dayKey(d)} onClick={()=>choose(d)} style={{border:`1px solid ${active?"rgba(181,154,98,.5)":"rgba(16,16,15,.08)"}`,borderRadius:15,padding:"9px 3px",background:active?"rgba(181,154,98,.10)":"rgba(255,255,255,.28)",fontFamily:"inherit",color:"inherit"}}><small style={{display:"block",opacity:.45}}>{d.toLocaleDateString("ar-IQ",{weekday:"short"})}</small><b style={{display:"block",marginTop:4}}>{d.getDate()}</b></button>})}</div><section style={{marginTop:16,padding:16,border:"1px solid rgba(16,16,15,.07)",borderRadius:22,background:"rgba(255,255,255,.34)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><b>{selected.toLocaleDateString("ar-IQ",{weekday:"long",day:"numeric",month:"long"})}</b><span style={{fontSize:12,color:C.gold}}>{count}/5</span></div><div style={{height:7,borderRadius:99,background:"rgba(16,16,15,.07)",overflow:"hidden",marginTop:12}}><div style={{height:"100%",width:`${count/5*100}%`,background:C.gold}}/></div><div style={{marginTop:12,display:"grid",gap:8}}>{prayers.map(p=><button key={p} onClick={()=>toggle(p)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",border:"1px solid rgba(16,16,15,.07)",borderRadius:16,padding:"12px 13px",background:done[p]?"rgba(79,145,92,.09)":"transparent",fontFamily:"inherit",color:"inherit"}}><span>{p}</span><span style={{width:27,height:27,borderRadius:9,display:"grid",placeItems:"center",border:"1px solid rgba(16,16,15,.08)",color:done[p]?C.green:"rgba(16,16,15,.25)"}}>{done[p]?"✓":""}</span></button>)}</div></section></main></div>
}
