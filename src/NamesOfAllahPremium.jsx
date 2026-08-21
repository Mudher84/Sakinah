import React,{useEffect,useMemo,useState} from "react";
import {createPortal} from "react-dom";

const C={bg:'#F7F3EA',paper:'#FDFBF7',navy:'#102D43',gold:'#C0A062',gold2:'#B08D4F',muted:'#8E96A0',soft:'#A9B0B8',text:'#102D43'};
const DETAIL=[
 {num:'٠١',ar:'الرَّحْمٰن',latin:'AR-RAHMAAN',meaning:'واسع الرحمة',proof:'الرَّحْمٰنُ عَلَّمَ الْقُرْآنَ',ref:'الرحمن · ١',full:'ذو الرحمة الواسعة التي شملت الخلق كلّهم في الدنيا.'},
 {num:'٠٢',ar:'الرَّحِيم',latin:'AR-RAHEEM',meaning:'رحيم بالمؤمنين',proof:'وَكَانَ بِالْمُؤْمِنِينَ رَحِيمًا',ref:'الأحزاب · ٤٣',full:'رحمة خاصّة موصولة بالمؤمنين في الدنيا والآخرة.'},
 {num:'٠٣',ar:'المَلِك',latin:'AL-MALIK',meaning:'المالك المتصرّف',proof:'فَتَعَالَى اللَّهُ الْمَلِكُ الْحَقُّ',ref:'المؤمنون · ١١٦',full:'المالك لكل شيء، المتصرّف في الملك بلا منازع.'},
 {num:'٠٤',ar:'القُدُّوس',latin:'AL-QUDDUS',meaning:'المنزَّه عن النقص',proof:'المَلِكِ القُدُّوسِ العَزِيزِ الحَكِيمِ',ref:'الجمعة · ١',full:'الطاهر المنزَّه عن كل عيب ونقص.'},
 {num:'٠٥',ar:'السَّلَام',latin:'AS-SALAAM',meaning:'السالم من كل عيب',proof:'السَّلَامُ المُؤْمِنُ المُهَيْمِنُ',ref:'الحشر · ٢٣',full:'السالم من كل نقص، ومنه السلامة لخلقه.'},
 {num:'٠٦',ar:'المُؤْمِن',latin:'AL-MU’MIN',meaning:'مانح الأمان',proof:'المُؤْمِنُ المُهَيْمِنُ العَزِيزُ',ref:'الحشر · ٢٣',full:'الذي يؤمِّن خلقه ويصدّق رسله بالبراهين.'},
 {num:'٠٧',ar:'المُهَيْمِن',latin:'AL-MUHAYMIN',meaning:'الرقيب الحفيظ',proof:'العَزِيزُ الجَبَّارُ المُتَكَبِّرُ',ref:'الحشر · ٢٣',full:'المطّلع على خلقه، الحافظ لهم، الشهيد عليهم.'},
 {num:'٠٨',ar:'العَزِيز',latin:'AL-AZEEZ',meaning:'الغالب القوي',proof:'وَهُوَ العَزِيزُ الحَكِيمُ',ref:'الحشر · ٢٤',full:'الغالب الذي لا يُمتنع عليه شيء، ولا يُغلب.'}
];
const arNum=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const normalize=s=>String(s||'').replace(/[ًٌٍَُِّْـٰ]/g,'').replace(/\s+/g,'').trim();

export default function NamesOfAllahPremium({go}){
 const[rows,setRows]=useState(DETAIL),[query,setQuery]=useState(''),[selected,setSelected]=useState(null),[saved,setSaved]=useState(()=>new Set()),[loading,setLoading]=useState(true);
 useEffect(()=>{
  let alive=true;
  fetch('https://api.aladhan.com/v1/asmaAlHusna').then(r=>r.ok?r.json():Promise.reject()).then(j=>{
   if(!alive)return;
   const data=Array.isArray(j?.data)?j.data:[];
   if(data.length){
    setRows(data.map((x,i)=>{
     const d=DETAIL.find(v=>normalize(v.ar)===normalize(x.name));
     return {num:arNum(x.number||i+1),ar:x.name||d?.ar||'',latin:x.transliteration||d?.latin||'',meaning:d?.meaning||x.en?.meaning||'',full:d?.full||x.en?.meaning||'',proof:d?.proof||'',ref:d?.ref||''};
    }));
   }
  }).catch(()=>{}).finally(()=>alive&&setLoading(false));
  return()=>{alive=false};
 },[]);
 useEffect(()=>{
  if(!selected)return;
  document.documentElement.classList.add('names-detail-open');
  document.body.classList.add('names-detail-open');
  return()=>{
   document.documentElement.classList.remove('names-detail-open');
   document.body.classList.remove('names-detail-open');
  };
 },[selected]);
 const shown=useMemo(()=>rows.filter(n=>!query||`${n.ar} ${n.meaning} ${n.latin}`.toLowerCase().includes(query.trim().toLowerCase())),[rows,query]);
 const today=rows[0]||DETAIL[0];
 const toggleSaved=n=>setSaved(s=>{const x=new Set(s);x.has(n.num)?x.delete(n.num):x.add(n.num);return x});
 const detailSheet=selected?<div className="np-overlay" onClick={()=>setSelected(null)}><div className="np-sheet" onClick={e=>e.stopPropagation()}><div className="np-sheetbar"><button className="np-iconbtn" onClick={()=>setSelected(null)} aria-label="إغلاق">✕</button><span style={{fontFamily:'IBM Plex Mono',fontSize:10,color:C.gold2}}>{selected.num} / ٩٩</span></div><div className="np-sheetname">{selected.ar}</div><div className="np-latin" style={{color:C.soft}}>{selected.latin}</div><div className="np-box"><div style={{fontSize:10,color:C.gold2}}>المعنى</div><div style={{fontSize:12,lineHeight:1.9,marginTop:6}}>{selected.meaning||selected.full}</div></div><div className="np-box"><div style={{fontSize:10,color:C.gold2}}>شرح اسم الله</div><div style={{fontSize:12.5,lineHeight:2,marginTop:7}}>{selected.full||selected.meaning||'شرح مختصر لمعنى هذا الاسم الكريم.'}</div></div>{selected.proof&&<div className="np-box"><div style={{fontSize:10,color:C.gold2}}>من الدليل</div><div className="np-proof">{selected.proof}</div><div style={{fontSize:9.5,color:C.soft,textAlign:'center',marginTop:6}}>{selected.ref}</div></div>}<div className="np-actions"><button className="np-primary" style={{background:C.navy,color:C.bg}} onClick={()=>toggleSaved(selected)}>{saved.has(selected.num)?'محفوظ':'أضف إلى المحفوظات'}</button></div></div></div>:null;
 return <div className="names-premium" dir="rtl">
  <style>{`
   .names-detail-open .dock{display:none!important}
   .names-premium{position:fixed;inset:0;z-index:2147483550;background:#E6E0D4;color:${C.text};font-family:'Noto Kufi Arabic','Cairo',sans-serif;overflow:auto;scrollbar-width:none}.names-premium::-webkit-scrollbar{display:none}.names-premium *{box-sizing:border-box}
   .np-shell{width:min(100%,430px);min-height:100%;margin:auto;background:${C.bg};padding-bottom:84px}.np-top{position:sticky;top:0;z-index:20;background:rgba(247,243,234,.94);backdrop-filter:blur(10px);border-bottom:1px solid rgba(16,45,67,.07);padding:12px 18px;display:grid;grid-template-columns:36px 1fr 36px;align-items:center}.np-iconbtn{border:0;background:transparent;color:${C.gold2};font-size:18px;cursor:pointer}.np-headtitle{text-align:center;font-size:13px;font-weight:600}.np-intro{text-align:center;padding:16px 20px 0}.np-kicker{font-family:'IBM Plex Mono',monospace;font-size:8.5px;letter-spacing:.28em;color:${C.gold2};direction:ltr}.np-title{font-family:'Amiri',serif;font-size:28px;margin-top:4px}.np-sub{font-size:10px;color:${C.muted};margin-top:4px}
   .np-today{margin:13px 20px 0;padding:16px 18px;border-radius:21px;background:${C.navy};color:${C.bg};position:relative;overflow:hidden}.np-today:before{content:'';position:absolute;inset:0;background:radial-gradient(85% 80% at 85% -14%,rgba(192,160,98,.30),transparent 62%);pointer-events:none}.np-today>*{position:relative}.np-todayhead{display:flex;align-items:center;justify-content:space-between;font-size:10px}.np-name{font-family:'Amiri',serif;font-size:38px;line-height:1.2;text-align:center;margin-top:8px}.np-latin{text-align:center;font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:.18em;color:rgba(247,243,234,.45);margin-top:4px;direction:ltr}.np-desc{text-align:center;font-size:10.5px;color:rgba(247,243,234,.7);margin-top:7px;line-height:1.7}.np-actions{display:flex;gap:8px;margin-top:12px}.np-primary{flex:1;border:0;border-radius:999px;padding:9px;background:${C.gold};color:${C.navy};font-size:11px;font-weight:600}.np-round{width:40px;border-radius:999px;border:1px solid rgba(247,243,234,.18);background:transparent;color:${C.gold};font-size:14px}
   .np-search{margin:13px 20px 0;display:flex;align-items:center;gap:8px;background:${C.paper};border:1px solid rgba(16,45,67,.09);border-radius:14px;padding:9px 12px}.np-search input{flex:1;border:0;outline:0;background:transparent;font-family:inherit;font-size:12px;color:${C.text}}.np-search span{color:${C.soft}}
   .np-list{margin:14px 20px 0}.np-listhead{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px}.np-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}.np-card{min-height:104px;padding:9px 10px 10px;border-radius:16px;background:${C.paper};border:1px solid rgba(16,45,67,.07);cursor:pointer}.np-cardtop{display:flex;justify-content:flex-end;align-items:center}.np-num{font-family:'IBM Plex Mono',monospace;font-size:8.5px;color:#C3C9CF}.np-cardname{font-family:'Amiri',serif;font-size:24px;text-align:center;margin-top:2px;line-height:1.22}.np-meaning{font-size:9.5px;color:#6F7A85;text-align:center;margin-top:5px;line-height:1.45}
   .np-overlay{position:fixed;inset:0;z-index:2147483647;background:rgba(16,45,67,.45);display:flex;align-items:center;justify-content:center;padding:22px}.np-sheet{width:min(calc(100vw - 44px),390px);max-height:min(74vh,620px);background:${C.bg};border-radius:26px;padding:19px 20px 22px;box-shadow:0 24px 70px -24px rgba(16,45,67,.7);overflow:auto}.np-sheetbar{display:flex;justify-content:space-between;align-items:center}.np-sheetname{font-family:'Amiri',serif;font-size:36px;text-align:center;margin-top:8px}.np-box{margin-top:9px;padding:13px 15px;border-radius:16px;background:${C.paper};border:1px solid rgba(16,45,67,.07)}.np-proof{font-family:'Amiri',serif;font-size:18px;line-height:1.9;text-align:center;margin-top:6px}
  `}</style>
  <div className="np-shell">
   <header className="np-top"><button className="np-iconbtn" onClick={()=>go?.('home')} aria-label="رجوع">→</button><div className="np-headtitle">أسماء الله الحسنى</div><button className="np-iconbtn" onClick={()=>document.querySelector('.np-search input')?.focus()} aria-label="بحث">⌕</button></header>
   <div className="np-intro"><div className="np-kicker">99 NAMES</div><div className="np-title">أسماء الله الحسنى</div><div className="np-sub">الاسم · المعنى · الشرح</div></div>
   <section className="np-today"><div className="np-todayhead"><span style={{color:'rgba(247,243,234,.5)'}}>اسم اليوم</span><span style={{fontFamily:'IBM Plex Mono',color:C.gold}}>{today.num} / ٩٩</span></div><div className="np-name">{today.ar}</div><div className="np-latin">{today.latin}</div><div className="np-desc">{today.full||today.meaning}</div><div className="np-actions"><button className="np-primary" onClick={()=>setSelected(today)}>اقرأ الشرح</button><button className="np-round" onClick={()=>toggleSaved(today)}>{saved.has(today.num)?'✓':'↗'}</button></div></section>
   <label className="np-search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث باسم أو معنى…"/></label>
   <section className="np-list"><div className="np-listhead"><strong style={{fontSize:12}}>الأسماء</strong><span style={{fontSize:10,color:C.soft}}>{loading?'تحميل…':`${arNum(shown.length)} من ٩٩`}</span></div><div className="np-grid">{shown.map(n=><button key={n.num} className="np-card" onClick={()=>setSelected(n)}><div className="np-cardtop"><span className="np-num">{n.num}</span></div><div className="np-cardname">{n.ar}</div><div className="np-meaning">{n.meaning}</div></button>)}</div></section>
  </div>
  {detailSheet&&createPortal(detailSheet,document.body)}
 </div>;
}
