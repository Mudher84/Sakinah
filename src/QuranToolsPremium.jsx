import React,{useMemo,useState} from "react";

const C={navy:'#102D43',gold:'#C0A062',goldDark:'#8E6F38',bg:'#F7F3EA',card:'#FDFBF7',line:'rgba(16,45,67,0.07)',muted:'#8E96A0',soft:'#C3C9CF'};
const SURAH_AR=['الفاتحة','البقرة','آل عمران','النساء','المائدة','الأنعام','الأعراف','الأنفال','التوبة','يونس','هود','يوسف','الرعد','إبراهيم','الحجر','النحل','الإسراء','الكهف','مريم','طه','الأنبياء','الحج','المؤمنون','النور','الفرقان','الشعراء','النمل','القصص','العنكبوت','الروم','لقمان','السجدة','الأحزاب','سبأ','فاطر','يس','الصافات','ص','الزمر','غافر','فصلت','الشورى','الزخرف','الدخان','الجاثية','الأحقاف','محمد','الفتح','الحجرات','ق','الذاريات','الطور','النجم','القمر','الرحمن','الواقعة','الحديد','المجادلة','الحشر','الممتحنة','الصف','الجمعة','المنافقون','التغابن','الطلاق','التحريم','الملك','القلم','الحاقة','المعارج','نوح','الجن','المزمل','المدثر','القيامة','الإنسان','المرسلات','النبأ','النازعات','عبس','التكوير','الانفطار','المطففين','الانشقاق','البروج','الطارق','الأعلى','الغاشية','الفجر','البلد','الشمس','الليل','الضحى','الشرح','التين','العلق','القدر','البينة','الزلزلة','العاديات','القارعة','التكاثر','العصر','الهمزة','الفيل','قريش','الماعون','الكوثر','الكافرون','النصر','المسد','الإخلاص','الفلق','الناس'];
const GROUPS=[
 {title:'القراءة والاستماع',note:'٣ أدوات',items:[
  {icon:'◍',name:'المصحف',sub:'صفحات المصحف · الأجزاء · العلامات',meta:'٦٠٤ ص',to:'quran-mushaf'},
  {icon:'♪',name:'الاستماع للقرآن',sub:'القرّاء · التكرار · السرعة',meta:'١٧٤',to:'quran-audio'},
  {icon:'⇩',name:'التنزيلات',sub:'السور المحفوظة للاستماع بدون إنترنت',meta:'',to:'quran-audio',kind:'downloads'}]},
 {title:'الفهم والتدبّر',note:'٤ أدوات',items:[
  {icon:'▤',name:'التفسير',sub:'الميسّر · ابن كثير · السعدي',meta:'٣',to:'tafsir-library'},
  {icon:'✧',name:'تدبّر آية',sub:'وقفات وفوائد مرتبطة بالآيات',meta:'جديد',to:'tadabbur-ayah'},
  {icon:'◈',name:'موضوعات القرآن',sub:'الرحمة · الصبر · المال وغيرها',meta:'٤٦',to:'quran-topics'},
  {icon:'⌘',name:'جذور الكلمات',sub:'الجذر وتصريفاته ومواضعه',meta:'١٧٠٠+',to:'quran-roots'}]},
 {title:'الحفظ والتعلّم',note:'٣ أدوات',items:[
  {icon:'◎',name:'المعلّم',sub:'الحروف والحركات والتجويد خطوة خطوة',meta:'٦ مراحل',to:'quran-teacher'},
  {icon:'◇',name:'خطة الحفظ',sub:'ورد يومي ومراجعة ذكية',meta:'٨١٪',to:'memorization-center'},
  {icon:'⌕',name:'البحث في القرآن',sub:'ابحث بكلمة أو معنى أو رقم آية',meta:'',to:'quran-search'}]}
];
const STATS=[['٣/٥','ورد اليوم'],['١٢ سورة','حفظت'],['٢٦ يوماً','متّصل']];
const arNum=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
function snapshot(){
 if(typeof window==='undefined')return{surah:1,ayah:4,page:12,ago:'قبل ساعتين',downloads:0};
 let surah=1,ayah=4,page=12,ago='قبل ساعتين';
 try{
  const raw=JSON.parse(localStorage.getItem('sakinah-quran-last-read')||'null');
  if(raw){surah=Number(raw.surahId||raw.surah||1)||1;ayah=Number(raw.ayah||raw.ayahId||4)||4;page=Number(raw.page||12)||12;if(raw.savedAt){const m=Math.max(1,Math.round((Date.now()-raw.savedAt)/60000));ago=m<60?`قبل ${arNum(m)} دقيقة`:`قبل ${arNum(Math.max(1,Math.round(m/60)))} ساعة`;}}
 }catch{}
 let downloads=0;
 try{const arr=JSON.parse(localStorage.getItem('muslim-mirror-quran-downloads')||'[]');downloads=Array.isArray(arr)?arr.length:0}catch{}
 return{surah:Math.min(114,Math.max(1,surah)),ayah,page,ago,downloads};
}
export default function QuranToolsPremium({go}){
 const[snap]=useState(snapshot),[active,setActive]=useState('');
 const groups=useMemo(()=>GROUPS.map(g=>({...g,items:g.items.map(t=>({...t,meta:t.kind==='downloads'?arNum(snap.downloads):t.meta}))})),[snap]);
 const pick=t=>{setActive(t.name);go?.(t.to)};
 return <div className="qtp-stage" dir="rtl">
  <style>{`
   .qtp-stage{position:fixed;inset:0;z-index:2147483500;background:#E6E0D4;display:flex;align-items:flex-start;justify-content:center;overflow:auto;font-family:'Noto Kufi Arabic','Cairo',sans-serif;color:${C.navy};scrollbar-width:none}.qtp-stage::-webkit-scrollbar{display:none}.qtp-stage *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}.qtp-frame{width:min(100%,406px);min-height:874px;padding:8px}.qtp-shell{width:100%;min-height:858px;border-radius:34px;overflow:hidden;background:${C.bg};box-shadow:0 40px 90px -40px rgba(16,45,67,.5),0 0 0 1px rgba(16,45,67,.08)}
   .qtp-top{position:sticky;top:0;z-index:10;height:59px;background:rgba(247,243,234,.94);backdrop-filter:blur(10px);border-bottom:1px solid ${C.line};padding:0 20px;display:grid;grid-template-columns:44px 1fr 44px;align-items:center}.qtp-topbtn{width:44px;height:44px;border:0;background:transparent;color:${C.goldDark};font-family:inherit;font-size:18px;cursor:pointer}.qtp-title{text-align:center;font-size:13px;font-weight:600}
   .qtp-resume{margin:16px 20px 0;padding:18px 20px;border-radius:24px;background:${C.navy};color:${C.bg};position:relative;overflow:hidden}.qtp-resume:before{content:'';position:absolute;inset:0;background:radial-gradient(80% 75% at 88% -14%,rgba(192,160,98,.30),transparent 62%);pointer-events:none}.qtp-resume>*{position:relative}.qtp-resumehead{display:flex;align-items:center;justify-content:space-between}.qtp-resumelabel{font-size:11px;color:rgba(247,243,234,.5)}.qtp-page{font-family:'IBM Plex Mono',monospace;font-size:10px;color:${C.gold};direction:ltr}.qtp-resumebody{display:flex;align-items:flex-end;justify-content:space-between;margin-top:12px;gap:12px}.qtp-surah{font-family:'Amiri',serif;font-size:29px;line-height:1.2}.qtp-sub{font-size:11px;color:rgba(247,243,234,.6);margin-top:5px}.qtp-play{width:46px;height:46px;min-width:46px;min-height:46px;border-radius:999px;border:0;background:${C.gold};color:${C.navy};display:grid;place-items:center;font-size:15px;cursor:pointer}.qtp-progress{height:3px;background:rgba(247,243,234,.16);border-radius:3px;margin-top:14px;overflow:hidden}.qtp-progress>span{display:block;height:100%;background:${C.gold};border-radius:3px}
   .qtp-shortcuts{margin:10px 20px 0;display:flex;gap:9px}.qtp-shortcut{flex:1;min-height:64px;padding:9px 8px;border-radius:18px;background:${C.card};border:1px solid ${C.line};text-align:center;color:${C.navy};font-family:inherit;cursor:pointer}.qtp-shortcut i{display:block;font-style:normal;font-size:15px;color:${C.goldDark}}.qtp-shortcut span{display:block;font-size:11px;font-weight:500;margin-top:6px}
   .qtp-group{margin:24px 20px 0}.qtp-ghead{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:10px}.qtp-gtitle{font-size:13px;font-weight:600}.qtp-gnote{font-size:10px;color:#A9B0B8}.qtp-panel{border-radius:22px;background:${C.card};border:1px solid ${C.line};overflow:hidden}.qtp-row{width:100%;min-height:64px;display:flex;align-items:center;gap:13px;padding:10px 16px;border:0;border-top:1px solid ${C.line};background:transparent;color:${C.navy};font-family:inherit;text-align:right;cursor:pointer}.qtp-row:first-child{border-top:0}.qtp-row.active{background:rgba(192,160,98,.09)}.qtp-icon{width:36px;height:36px;min-width:36px;border-radius:13px;background:rgba(192,160,98,.13);color:${C.goldDark};display:grid;place-items:center;font-size:14px}.qtp-copy{flex:1;min-width:0}.qtp-name{display:block;font-size:13px;font-weight:500}.qtp-desc{display:block;font-size:10px;color:${C.muted};margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.qtp-meta{font-family:'IBM Plex Mono',monospace;font-size:10px;color:${C.goldDark};flex:none}.qtp-arrow{font-size:12px;color:${C.soft};flex:none}.qtp-stats{margin:24px 20px 0;padding:16px 18px;border-radius:22px;background:#EFE8DA;border:1px solid rgba(192,160,98,.28);display:flex;align-items:center;justify-content:space-between}.qtp-stat{text-align:center;flex:1}.qtp-statn{font-family:'IBM Plex Mono',monospace;font-size:15px;color:${C.goldDark}}.qtp-statl{font-size:10px;color:#8A7F6C;margin-top:4px}.qtp-bottom{height:132px}
   @supports (height: env(safe-area-inset-bottom)){.qtp-bottom{height:calc(132px + env(safe-area-inset-bottom))}}
   @media(max-width:405px){.qtp-frame{padding:0}.qtp-shell{border-radius:0;min-height:100vh}.qtp-stage{background:${C.bg}}}
  `}</style>
  <div className="qtp-frame"><main className="qtp-shell">
   <header className="qtp-top"><button className="qtp-topbtn" onClick={()=>go?.('home')} aria-label="رجوع">→</button><div className="qtp-title">القرآن الكريم</div><button className="qtp-topbtn" onClick={()=>go?.('quran-search')} aria-label="بحث">⌕</button></header>
   <section className="qtp-resume"><div className="qtp-resumehead"><span className="qtp-resumelabel">تابع القراءة</span><span className="qtp-page">{snap.page} / 604</span></div><div className="qtp-resumebody"><div><div className="qtp-surah">سُورَةُ {SURAH_AR[snap.surah-1]}</div><div className="qtp-sub">توقّفت عند الآية {arNum(snap.ayah)} · {snap.ago}</div></div><button className="qtp-play" onClick={()=>go?.('quran-mushaf')} aria-label="تابع القراءة">▷</button></div><div className="qtp-progress"><span style={{width:`${Math.max(1,Math.min(100,(snap.page/604)*100))}%`}}/></div></section>
   <div className="qtp-shortcuts"><button className="qtp-shortcut" onClick={()=>go?.('quran-mushaf')}><i>▤</i><span>فهرس السور</span></button><button className="qtp-shortcut" onClick={()=>go?.('quran-audio')}><i>♪</i><span>استماع</span></button><button className="qtp-shortcut" onClick={()=>go?.('smart-khatmah')}><i>◈</i><span>وردي</span></button></div>
   {groups.map(g=><section className="qtp-group" key={g.title}><div className="qtp-ghead"><span className="qtp-gtitle">{g.title}</span><span className="qtp-gnote">{g.note}</span></div><div className="qtp-panel">{g.items.map(t=><button key={t.name} className={`qtp-row ${active===t.name?'active':''}`} onClick={()=>pick(t)}><span className="qtp-icon">{t.icon}</span><span className="qtp-copy"><span className="qtp-name">{t.name}</span><span className="qtp-desc">{t.sub}</span></span><span className="qtp-meta">{t.meta}</span><span className="qtp-arrow">‹</span></button>)}</div></section>)}
   <section className="qtp-stats">{STATS.map(([num,label])=><div className="qtp-stat" key={label}><div className="qtp-statn">{num}</div><div className="qtp-statl">{label}</div></div>)}</section><div className="qtp-bottom"/>
  </main></div>
 </div>;
}
