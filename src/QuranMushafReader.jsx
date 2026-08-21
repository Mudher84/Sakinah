import React,{useEffect,useMemo,useState} from "react";

const C={bg:'#F7F3EA',paper:'#FDFBF7',navy:'#102D43',gold:'#C0A062',goldDark:'#8E6F38',line:'rgba(16,45,67,.08)',muted:'#8E96A0'};
const arDigits=s=>String(s).replace(/[0-9]/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const stripBismillah=text=>String(text||'').replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/,'').trim();

export default function QuranMushafReader({go,surahId=1}){
 const[data,setData]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState(''),[scale,setScale]=useState(1);
 useEffect(()=>{
  let alive=true;setLoading(true);setError('');
  fetch(`https://api.alquran.cloud/v1/surah/${surahId}/quran-uthmani`).then(r=>r.ok?r.json():Promise.reject()).then(x=>{
   if(!alive)return;
   const s=x?.data;if(!s?.ayahs?.length)throw new Error('missing');
   setData(s);setLoading(false);
   try{localStorage.setItem('sakinah-quran-last-read',JSON.stringify({surahId:s.number,ayah:1,page:s.ayahs[0]?.page||1,savedAt:Date.now()}))}catch{}
  }).catch(()=>{if(alive){setError('تعذر تحميل نص السورة. تحقق من الاتصال وحاول مجدداً.');setLoading(false)}});
  return()=>{alive=false};
 },[surahId]);
 const ayahs=useMemo(()=>{
  if(!data)return[];
  return data.ayahs.map((a,i)=>({...a,text:(i===0&&data.number!==1&&data.number!==9)?stripBismillah(a.text):a.text}));
 },[data]);
 const remember=a=>{try{localStorage.setItem('sakinah-quran-last-read',JSON.stringify({surahId:data?.number||surahId,ayah:a.numberInSurah,page:a.page||1,savedAt:Date.now()}))}catch{}};
 return <div className="qm-reader" dir="rtl">
  <style>{`
   .qm-reader{position:absolute;inset:0;background:#E7E0D3;color:${C.navy};font-family:'Noto Kufi Arabic','Cairo',sans-serif;display:flex;justify-content:center;overflow:hidden}.qm-frame{width:min(100%,430px);height:100%;background:${C.bg};display:flex;flex-direction:column}.qm-top{height:58px;min-height:58px;padding:8px 14px;border-bottom:1px solid ${C.line};display:grid;grid-template-columns:44px 1fr 44px;align-items:center;background:rgba(247,243,234,.96);backdrop-filter:blur(12px);z-index:5}.qm-top button{width:44px;height:44px;border:0;background:transparent;color:${C.goldDark};font:16px inherit}.qm-top strong{text-align:center;font-size:12px;font-weight:600}.qm-scroll{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:18px 14px 132px}.qm-scroll::-webkit-scrollbar{display:none}.qm-head{text-align:center;padding:4px 8px 14px}.qm-kicker{font-size:8px;letter-spacing:.24em;color:${C.goldDark};direction:ltr}.qm-title{font-family:'Amiri',serif;font-size:30px;line-height:1.35;margin-top:4px}.qm-meta{font-size:9.5px;color:${C.muted};margin-top:4px}.qm-tools{display:flex;justify-content:center;gap:8px;margin-top:11px}.qm-tools button{min-width:44px;height:44px;border-radius:14px;border:1px solid ${C.line};background:${C.paper};color:${C.navy};font:13px 'IBM Plex Mono',monospace}.qm-page{background:${C.paper};border:1px solid ${C.line};border-radius:24px;padding:22px 18px 28px;box-shadow:0 18px 40px rgba(16,45,67,.045)}.qm-surah-band{text-align:center;border:1px solid rgba(192,160,98,.28);border-radius:16px;padding:8px 12px;margin-bottom:15px;background:rgba(192,160,98,.07);font-family:'Amiri',serif;font-size:21px}.qm-bismillah{text-align:center;font-family:'Amiri',serif;font-size:24px;line-height:2;margin:2px 0 11px;color:${C.navy}}.qm-text{font-family:'Amiri','Noto Naskh Arabic',serif;font-size:${28}px;line-height:2.15;text-align:justify;text-align-last:right;direction:rtl;color:#111;word-spacing:.06em}.qm-text .qm-ayah{cursor:pointer}.qm-text .qm-mark{display:inline-block;color:${C.goldDark};font-family:'Amiri',serif;font-size:.78em;white-space:nowrap;margin:0 .12em}.qm-end{text-align:center;color:${C.gold};font-size:20px;margin-top:18px}.qm-loading,.qm-error{padding:40px 20px;text-align:center;font-size:12px;color:${C.muted}}.qm-error{color:#8b3c31}@media(max-width:430px){.qm-frame{width:100%}.qm-scroll{padding-left:10px;padding-right:10px}.qm-page{border-radius:18px;padding:19px 14px 26px}}
  `}</style>
  <div className="qm-frame">
   <header className="qm-top"><button onClick={()=>go?.('surah-list')} aria-label="رجوع">→</button><strong>المصحف الشريف</strong><span/></header>
   <main className="qm-scroll">
    {loading&&<div className="qm-loading">تحميل نص المصحف…</div>}
    {error&&<div className="qm-error">{error}</div>}
    {data&&<>
     <div className="qm-head"><div className="qm-kicker">THE HOLY QURAN</div><div className="qm-title">{data.name}</div><div className="qm-meta">{data.revelationType==='Meccan'?'مكية':'مدنية'} · {arDigits(data.numberOfAyahs)} آية</div><div className="qm-tools"><button onClick={()=>setScale(v=>Math.max(.82,+(v-.08).toFixed(2)))}>−A</button><button onClick={()=>setScale(v=>Math.min(1.42,+(v+.08).toFixed(2)))}>+A</button></div></div>
     <article className="qm-page">
      <div className="qm-surah-band">سُورَةُ {String(data.name).replace(/^سُورَةُ\s*/,'')}</div>
      {data.number!==1&&data.number!==9&&<div className="qm-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>}
      <div className="qm-text" style={{fontSize:`${28*scale}px`}}>{ayahs.map(a=><React.Fragment key={a.number}><span className="qm-ayah" onClick={()=>remember(a)}>{a.text}</span><span className="qm-mark">﴿{arDigits(a.numberInSurah)}﴾</span>{' '}</React.Fragment>)}</div>
      <div className="qm-end">۞</div>
     </article>
    </>}
   </main>
  </div>
 </div>;
}
