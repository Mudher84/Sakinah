import React,{useMemo,useState} from "react";

const C={navy:'#102D43',gold:'#C0A062',goldDark:'#8E6F38',bg:'#F7F3EA',card:'#FDFBF7',line:'rgba(16,45,67,0.07)',muted:'#8E96A0',soft:'#C3C9CF'};
const GROUPS=[
 {title:'القراءة والاستماع',note:'٣ أدوات',items:[
  {icon:'◍',name:'المصحف',sub:'صفحات المصحف · الأجزاء · العلامات',meta:'٦٠٤ ص',to:'quran-home'},
  {icon:'♪',name:'الاستماع للقرآن',sub:'القرّاء · التكرار · السرعة',meta:'١٧٤',to:'quran-audio'},
  {icon:'⇩',name:'التنزيلات',sub:'السور المحفوظة للاستماع بدون إنترنت',meta:'',to:'quran-audio',kind:'downloads'}]},
 {title:'الفهم والتدبّر',note:'٤ أدوات',items:[
  {icon:'▤',name:'التفسير',sub:'الميسّر · ابن كثير · السعدي',meta:'٣',to:'tafsir-library'},
  {icon:'✧',name:'تدبّر آية',sub:'وقفات وفوائد مرتبطة بالآيات',meta:'جديد',to:'tadabbur-ayah'},
  {icon:'◈',name:'موضوعات القرآن',sub:'الرحمة · الصبر · المال وغيرها',meta:'٤٦',to:'quran-topics'},
  {icon:'⌘',name:'جذور الكلمات',sub:'الجذر وتصريفاته ومواضعه',meta:'١٧٠٠+',to:'quran-roots'}]},
 {title:'الحفظ والتعلّم',note:'٣ أدوات',items:[
  {icon:'◎',name:'المعلّم',sub:'الحروف والحركات والتجويد خطوة خطوة',meta:'٦ مراحل',to:'quran-teacher'},
  {icon:'◇',name:'خطة الحفظ',sub:'ورد يومي ومراجعة ذكية',meta:'',to:'memorization-center',kind:'memorize'},
  {icon:'⌕',name:'البحث في القرآن',sub:'ابحث بكلمة أو معنى أو رقم آية',meta:'',to:'quran-search'}]}
];
const arNum=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
function storageSnapshot(){
 if(typeof window==='undefined')return{last:'سورة الكهف',page:'٢٩٤',downloads:0,progress:''};
 const pairs=Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)]);
 const find=(rx)=>pairs.find(([k])=>rx.test(k))?.[1]||'';
 const last=find(/quran.*(last|read)|last.*quran|mushaf.*last/i);
 const page=find(/quran.*page|mushaf.*page/i);
 const progress=find(/memor|hifz|khatm.*progress/i);
 const downloads=pairs.filter(([k,v])=>/quran.*download|download.*quran|offline.*quran/i.test(k)&&v&&v!=='0'&&v!=='false').length;
 let lastName='سورة الكهف';
 try{const p=JSON.parse(last);lastName=p.surahName||p.surah||p.name||lastName}catch{if(last&&last.length<40)lastName=last}
 return{last:lastName,page:page?arNum(String(page).replace(/\D/g,'')||'294'):'٢٩٤',downloads,progress};
}
export default function QuranToolsPremium({go}){
 const[snap]=useState(storageSnapshot),[active,setActive]=useState('');
 const groups=useMemo(()=>GROUPS.map(g=>({...g,items:g.items.map(x=>({...x,meta:x.kind==='downloads'?arNum(snap.downloads):x.kind==='memorize'?(snap.progress||''):x.meta}))})),[snap]);
 const pick=t=>{setActive(t.name);go?.(t.to)};
 return <div className="qt-screen" dir="rtl">
  <style>{`
   .qt-screen{position:fixed;inset:0;z-index:2147483500;background:#E6E0D4;color:${C.navy};font-family:'Noto Kufi Arabic','Cairo',sans-serif;overflow:auto;scrollbar-width:none}.qt-screen::-webkit-scrollbar{display:none}.qt-screen *{box-sizing:border-box}.qt-shell{width:min(100%,406px);min-height:874px;margin:auto;background:${C.bg};padding-bottom:28px}.qt-top{height:58px;padding:0 20px;display:grid;grid-template-columns:44px 1fr 44px;align-items:center;border-bottom:1px solid ${C.line};background:rgba(247,243,234,.96);position:sticky;top:0;z-index:4}.qt-btn{width:44px;height:44px;border:0;background:transparent;color:${C.goldDark};font:18px inherit;cursor:pointer}.qt-head{text-align:center;font-size:13px;font-weight:600}.qt-intro{text-align:center;padding:24px 20px 0}.qt-kicker{font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:.28em;color:${C.goldDark};direction:ltr}.qt-title{font-family:'Amiri',serif;font-size:31px;margin-top:7px}.qt-sub{font-size:11px;color:${C.muted};margin-top:7px}.qt-last{margin:18px 20px 0;padding:18px;border-radius:23px;background:${C.navy};color:${C.bg};position:relative;overflow:hidden}.qt-last:before{content:'';position:absolute;inset:0;background:radial-gradient(80% 90% at 90% -10%,rgba(192,160,98,.28),transparent 62%)}.qt-last>*{position:relative}.qt-lasttop{display:flex;justify-content:space-between;align-items:center;font-size:10.5px;color:rgba(247,243,234,.55)}.qt-lastname{font-family:'Amiri',serif;font-size:29px;margin-top:10px}.qt-lastsub{font-size:10.5px;color:rgba(247,243,234,.62);margin-top:5px}.qt-continue{margin-top:14px;min-height:44px;width:100%;border:0;border-radius:999px;background:${C.gold};color:${C.navy};font-family:inherit;font-size:12px;font-weight:600;cursor:pointer}.qt-groups{padding:18px 20px 0}.qt-group{margin-top:14px}.qt-ghead{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;padding:0 4px}.qt-gtitle{font-size:12.5px;font-weight:600}.qt-gnote{font-family:'IBM Plex Mono',monospace;font-size:9.5px;color:${C.goldDark}}.qt-panel{border-radius:22px;background:${C.card};border:1px solid ${C.line};overflow:hidden}.qt-row{width:100%;min-height:67px;padding:10px 13px;display:grid;grid-template-columns:42px minmax(0,1fr) auto 14px;gap:10px;align-items:center;border:0;border-top:1px solid ${C.line};background:transparent;color:${C.navy};font-family:inherit;text-align:right;cursor:pointer}.qt-row:first-child{border-top:0}.qt-row.active{background:rgba(192,160,98,.09)}.qt-icon{width:42px;height:42px;border-radius:14px;background:#F7F3EA;display:grid;place-items:center;color:${C.goldDark};font-size:17px}.qt-copy{min-width:0}.qt-name{font-size:13px;font-weight:500}.qt-desc{font-size:10px;color:${C.muted};margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.qt-meta{font-family:'IBM Plex Mono',monospace;font-size:10px;color:${C.goldDark};direction:rtl}.qt-arrow{font-size:12px;color:${C.soft}}.qt-stats{margin:24px 20px 0;padding:16px 18px;border-radius:22px;background:#EFE8DA;border:1px solid rgba(192,160,98,.28);display:flex;align-items:center;justify-content:space-between}.qt-stat{text-align:center;flex:1}.qt-statn{font-family:'IBM Plex Mono',monospace;font-size:15px;color:${C.goldDark}}.qt-statl{font-size:10px;color:#8A7F6C;margin-top:4px}
  `}</style>
  <main className="qt-shell">
   <header className="qt-top"><button className="qt-btn" onClick={()=>go?.('home')} aria-label="رجوع">→</button><div className="qt-head">القرآن الكريم</div><button className="qt-btn" onClick={()=>go?.('quran-search')} aria-label="بحث">⌕</button></header>
   <section className="qt-intro"><div className="qt-kicker">QURAN</div><div className="qt-title">القرآن الكريم</div><div className="qt-sub">اقرأ · استمع · افهم · احفظ</div></section>
   <section className="qt-last"><div className="qt-lasttop"><span>آخر موضع قراءة</span><span>ص {snap.page}</span></div><div className="qt-lastname">{snap.last}</div><div className="qt-lastsub">تابع من حيث توقفت</div><button className="qt-continue" onClick={()=>go?.('quran-home')}>تابع القراءة</button></section>
   <section className="qt-groups">{groups.map(g=><div className="qt-group" key={g.title}><div className="qt-ghead"><div className="qt-gtitle">{g.title}</div><div className="qt-gnote">{g.note}</div></div><div className="qt-panel">{g.items.map(t=><button key={t.name} className={`qt-row ${active===t.name?'active':''}`} onClick={()=>pick(t)}><span className="qt-icon">{t.icon}</span><span className="qt-copy"><span className="qt-name">{t.name}</span><span className="qt-desc">{t.sub}</span></span><span className="qt-meta">{t.meta}</span><span className="qt-arrow">‹</span></button>)}</div></div>)}</section>
   <section className="qt-stats"><div className="qt-stat"><div className="qt-statn">٣/٥</div><div className="qt-statl">ورد اليوم</div></div><div className="qt-stat"><div className="qt-statn">{snap.progress||'—'}</div><div className="qt-statl">الحفظ</div></div><div className="qt-stat"><div className="qt-statn">{arNum(snap.downloads)}</div><div className="qt-statl">التنزيلات</div></div></section>
  </main>
 </div>;
}
