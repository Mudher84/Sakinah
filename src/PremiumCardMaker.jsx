import React,{useMemo,useState} from "react";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62"};
const btn={border:"1px solid rgba(16,16,15,.10)",borderRadius:14,padding:11,background:"rgba(255,255,255,.48)",fontFamily:"inherit",color:"inherit"};
const PHOTOS=[
 {id:"madinah-minaret",label:"مئذنة المدينة",url:"https://unsplash.com/photos/QS7L9bud090/download?force=true&w=1400",position:"center",shade:"linear-gradient(180deg,rgba(8,17,28,.06),rgba(8,17,28,.58))"},
 {id:"najaf-minaret",label:"زخارف النجف",url:"https://unsplash.com/photos/ee3gy8B4bXQ/download?force=true&w=1400",position:"center",shade:"linear-gradient(180deg,rgba(8,13,23,.08),rgba(8,13,23,.58))"},
 {id:"erbil-mosque",label:"مسجد أربيل",url:"https://unsplash.com/photos/360TwcUpVVc/download?force=true&w=1400",position:"center",shade:"linear-gradient(180deg,rgba(18,14,10,.06),rgba(18,14,10,.54))"},
 {id:"mardin-mosque",label:"مسجد تاريخي",url:"https://unsplash.com/photos/B9x7rhrt07A/download?force=true&w=1400",position:"center",shade:"linear-gradient(180deg,rgba(16,14,10,.06),rgba(16,14,10,.58))"},
 {id:"mosul-mosque",label:"مسجد الموصل",url:"https://unsplash.com/photos/hYT5ghG0xsY/download?force=true&w=1400",position:"center",shade:"linear-gradient(180deg,rgba(5,18,30,.05),rgba(5,18,30,.55))"},
 {id:"brick-minaret",label:"مئذنة قديمة",url:"https://unsplash.com/photos/jle_1duVIMg/download?force=true&w=1400",position:"center",shade:"linear-gradient(180deg,rgba(12,15,18,.08),rgba(12,15,18,.58))"},
 {id:"green-minaret",label:"مئذنة وخضرة",url:"https://unsplash.com/photos/E5zMQ8qrxyA/download?force=true&w=1400",position:"center",shade:"linear-gradient(180deg,rgba(5,18,20,.04),rgba(5,18,20,.56))"},
 {id:"oman-arches",label:"أقواس مسجد",url:"https://unsplash.com/photos/1Oc1RdFUxmc/download?force=true&w=1400",position:"center",shade:"linear-gradient(180deg,rgba(5,18,30,.05),rgba(5,18,30,.56))"},
 {id:"white-minaret",label:"مئذنة وسماء",url:"https://unsplash.com/photos/TToTboHWGQM/download?force=true&w=1400",position:"center",shade:"linear-gradient(180deg,rgba(5,18,30,.04),rgba(5,18,30,.54))"},
 {id:"night",label:"ليلة هادئة",gradient:"radial-gradient(circle at 72% 18%,rgba(181,154,98,.38),transparent 24%),linear-gradient(145deg,#0B1521,#173B57 52%,#081019)",shade:"linear-gradient(180deg,transparent,rgba(0,0,0,.22))"},
 {id:"sand",label:"نور الصحراء",gradient:"radial-gradient(circle at 25% 20%,#FFF7DE 0 8%,transparent 28%),linear-gradient(145deg,#D7B985,#9B704B 55%,#3B2B27)",shade:"linear-gradient(180deg,rgba(40,22,12,.04),rgba(40,22,12,.42))"},
 {id:"emerald",label:"زمرد",gradient:"radial-gradient(circle at 50% -10%,rgba(221,199,137,.55),transparent 28%),linear-gradient(155deg,#173D37,#0D2928 55%,#071918)",shade:"linear-gradient(180deg,transparent,rgba(0,0,0,.25))"}
];
const PRESETS=["فَإِنَّ مَعَ الْعُسْرِ يُسْرًا","وَقُل رَّبِّ زِدْنِي عِلْمًا","حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ","رَبِّ اشْرَحْ لِي صَدْرِي"];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"}[c]));
function wrapSvgText(text,max=24){const words=text.trim().split(/\s+/),lines=[];let line="";for(const word of words){const next=(line+" "+word).trim();if(next.length>max&&line){lines.push(line);line=word}else line=next}if(line)lines.push(line);return lines.slice(0,6)}

export default function PremiumCardMaker({lang="ar",go}){
 const [text,setText]=useState(PRESETS[0]),[source,setSource]=useState("سورة الشرح • ٥"),[bgId,setBgId]=useState("madinah-minaret"),[size,setSize]=useState(34),[align,setAlign]=useState("center"),[tone,setTone]=useState("light");
 const bg=useMemo(()=>PHOTOS.find(x=>x.id===bgId)||PHOTOS[0],[bgId]);
 const fg=tone==="light"?"#FFFDF8":"#10100F";
 const cardBackground=bg.url?`${bg.shade},url(${bg.url})`:`${bg.shade},${bg.gradient}`;
 const download=()=>{
  const lines=wrapSvgText(text,22),lineH=Math.round(size*2.55),start=540-((lines.length-1)*lineH)/2;
  const tspans=lines.map((l,i)=>`<tspan x="540" y="${start+i*lineH}">${esc(l)}</tspan>`).join("");
  const image=bg.url?`<image href="${esc(bg.url)}" width="1080" height="1080" preserveAspectRatio="xMidYMid slice"/>`:`<rect width="1080" height="1080" fill="#173B57"/>`;
  const overlay=`<rect width="1080" height="1080" fill="${tone==="light"?"#08131d":"#fff7e7"}" opacity="${tone==="light"?".34":".42"}"/>`;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">${image}${overlay}<rect x="54" y="54" width="972" height="972" rx="42" fill="none" stroke="${fg}" stroke-opacity=".22"/><text x="540" y="${start}" fill="${fg}" text-anchor="middle" font-family="Amiri,Noto Naskh Arabic,serif" font-size="${size*2}" direction="rtl">${tspans}</text><text x="540" y="820" fill="${fg}" fill-opacity=".72" text-anchor="middle" font-family="sans-serif" font-size="26">${esc(source)}</text><line x1="455" x2="625" y1="875" y2="875" stroke="${fg}" stroke-opacity=".35"/><text x="540" y="940" fill="${fg}" fill-opacity=".72" text-anchor="middle" font-family="sans-serif" font-size="24" letter-spacing="5">SAKINAH</text></svg>`;
  const u=URL.createObjectURL(new Blob([svg],{type:"image/svg+xml;charset=utf-8"})),a=document.createElement("a");a.href=u;a.download="sakinah-islamic-card.svg";a.click();setTimeout(()=>URL.revokeObjectURL(u),800)
 };
 return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,display:"flex",flexDirection:"column"}} dir="rtl">
  <div style={{padding:"20px 20px 0"}}><button onClick={()=>go?.("daily-tools")} style={{...btn,border:0,background:"transparent",padding:0}}>← رجوع</button></div>
  <div style={{flex:1,overflowY:"auto",padding:"12px 20px 140px"}}>
   <div style={{textAlign:"center"}}><div style={{fontFamily:"'Amiri','Noto Naskh Arabic',serif",fontSize:30}}>صانع البطاقات الإسلامية</div><div style={{fontSize:11,opacity:.5,marginTop:4}}>اختر صورة، اكتب النص، وصمّم بطاقة هادئة وجميلة</div></div>
   <div style={{marginTop:18,aspectRatio:"1",borderRadius:30,overflow:"hidden",position:"relative",backgroundImage:cardBackground,backgroundSize:"cover",backgroundPosition:bg.position||"center",boxShadow:"0 18px 46px rgba(20,28,32,.15)"}}>
    <div style={{position:"absolute",inset:16,border:"1px solid rgba(255,255,255,.24)",borderRadius:22,pointerEvents:"none"}}/>
    <div style={{position:"absolute",inset:0,padding:"56px 34px 38px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:align==="center"?"center":align==="right"?"flex-end":"flex-start",textAlign:align,color:fg,textShadow:tone==="light"?"0 2px 18px rgba(0,0,0,.28)":"none"}}>
     <div style={{fontFamily:"'Amiri','Noto Naskh Arabic',serif",fontSize:size,lineHeight:1.85,maxWidth:"94%",whiteSpace:"pre-wrap"}}>{text}</div>
     <div style={{fontSize:11,opacity:.74,marginTop:18}}>{source}</div>
    </div>
    <div style={{position:"absolute",bottom:24,left:0,right:0,textAlign:"center",fontSize:9,letterSpacing:4,color:fg,opacity:.65}}>SAKINAH</div>
   </div>

   <div style={{marginTop:18,fontSize:11,fontWeight:700}}>صور وخلفيات</div>
   <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:8}}>{PHOTOS.map(x=><button key={x.id} onClick={()=>setBgId(x.id)} style={{border:bgId===x.id?`2px solid ${C.gold}`:"2px solid transparent",borderRadius:16,padding:3,background:"transparent",fontFamily:"inherit"}}><div style={{height:76,borderRadius:12,backgroundImage:x.url?`linear-gradient(180deg,transparent,rgba(0,0,0,.25)),url(${x.url})`:x.gradient,backgroundSize:"cover",backgroundPosition:x.position||"center"}}/><div style={{fontSize:9.5,marginTop:5}}>{x.label}</div></button>)}</div>

   <div style={{marginTop:17,fontSize:11,fontWeight:700}}>نصوص مقترحة</div>
   <div style={{display:"flex",gap:7,overflowX:"auto",padding:"8px 0 2px"}}>{PRESETS.map((p,i)=><button key={p} onClick={()=>{setText(p);setSource(["سورة الشرح • ٥","سورة طه • ١١٤","سورة آل عمران • ١٧٣","سورة طه • ٢٥"][i])}} style={{...btn,whiteSpace:"nowrap",fontFamily:"'Amiri',serif",fontSize:13}}>{p}</button>)}</div>

   <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="اكتب آية أو دعاء أو عبارة..." style={{...btn,width:"100%",boxSizing:"border-box",minHeight:92,marginTop:12,resize:"vertical",fontFamily:"'Amiri','Noto Naskh Arabic',serif",fontSize:18,lineHeight:1.7}}/>
   <input value={source} onChange={e=>setSource(e.target.value)} placeholder="المصدر أو اسم السورة" style={{...btn,width:"100%",boxSizing:"border-box",marginTop:8}}/>

   <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:10}}>
    <div style={{...btn}}><div style={{fontSize:9.5,opacity:.55}}>حجم الخط</div><input type="range" min="22" max="48" value={size} onChange={e=>setSize(Number(e.target.value))} style={{width:"100%",marginTop:8}}/></div>
    <div style={{...btn}}><div style={{fontSize:9.5,opacity:.55}}>لون النص</div><div style={{display:"flex",gap:6,marginTop:8}}><button onClick={()=>setTone("light")} style={{...btn,flex:1,padding:7,background:"#173B57",color:"white"}}>فاتح</button><button onClick={()=>setTone("dark")} style={{...btn,flex:1,padding:7,background:"#F4E9D2"}}>داكن</button></div></div>
   </div>
   <div style={{display:"flex",gap:7,marginTop:8}}>{[["right","يمين"],["center","وسط"],["left","يسار"]].map(([id,label])=><button key={id} onClick={()=>setAlign(id)} style={{...btn,flex:1,background:align===id?"rgba(181,154,98,.16)":"rgba(255,255,255,.45)"}}>{label}</button>)}</div>
   <button onClick={download} style={{...btn,width:"100%",marginTop:12,background:C.lapis,color:"white",border:0,fontWeight:700}}>حفظ البطاقة بدقة عالية</button>
   <div style={{fontSize:9,opacity:.42,lineHeight:1.7,marginTop:9,textAlign:"center"}}>الخلفيات الفوتوغرافية مخصصة للعمارة الإسلامية والمناظر الخالية من صور النساء. عند كتابة آية قرآنية، راجع النص والمصدر قبل المشاركة.</div>
  </div>
 </div>
}