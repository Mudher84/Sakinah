import React,{useMemo,useState} from "react";

const C={ivory:"#F6F3EC",ink:"#26343B",lapis:"#173B57",gold:"#B59A62",mint:"#DDECE3",sky:"#DDEAF4"};
const activeProfile=()=>{try{return localStorage.getItem("sakinah-active-profile")||"me"}catch{return"me"}};
const key=n=>`sakinah-quran-teacher-${activeProfile()}-${n}`;
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};

const LESSONS=[
 {id:"letters",title:"الحروف العربية",sub:"نبدأ من شكل الحرف وصوته",items:[
  {title:"أ · ألف",text:"أَلِف",say:"ألف",hint:"افتح فمك قليلاً وقل: أ"},{title:"ب · باء",text:"بَ",say:"باء",hint:"أغلق الشفتين ثم افتحهما برفق"},{title:"ت · تاء",text:"تَ",say:"تاء",hint:"طرف اللسان قريب من الأسنان العليا"},{title:"ث · ثاء",text:"ثَ",say:"ثاء",hint:"أخرج طرف اللسان قليلاً بين الأسنان"}]},
 {id:"harakat",title:"الحركات",sub:"كيف يتغير صوت الحرف بالحركة",items:[
  {title:"الفتحة",text:"بَ",say:"بَ",hint:"صوت قصير مفتوح: بَ"},{title:"الضمة",text:"بُ",say:"بُ",hint:"ضم الشفتين قليلاً: بُ"},{title:"الكسرة",text:"بِ",say:"بِ",hint:"ابتسامة خفيفة: بِ"},{title:"السكون",text:"بْ",say:"بْ",hint:"الحرف يتوقف بلا حركة بعده"}]},
 {id:"words",title:"كلمات قرآنية",sub:"نقرأ كلمة قصيرة ثم نعيدها",items:[
  {title:"رَبِّ",text:"رَبِّ",say:"رَبِّ",hint:"راء مفتوحة، ثم باء مكسورة مشددة"},{title:"هُدَى",text:"هُدَى",say:"هُدَى",hint:"هاء مضمومة ثم دال مفتوحة"},{title:"نُور",text:"نُور",say:"نُور",hint:"نون مضمومة ثم واو مد"},{title:"رَحْمَة",text:"رَحْمَة",say:"رَحْمَة",hint:"اقرأها ببطء: رَحْ ـ مَ ـ ة"}]},
 {id:"fatiha",title:"سورة الفاتحة",sub:"آية آية: استمع، ردد، ثم علّمها كمكتملة",items:[
  {title:"الآية ١",text:"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",say:"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",hint:"ابدأ بهدوء ووضوح"},
  {title:"الآية ٢",text:"الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",say:"الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",hint:"انتبه إلى تشديد اللام في لله"},
  {title:"الآية ٣",text:"الرَّحْمَٰنِ الرَّحِيمِ",say:"الرَّحْمَٰنِ الرَّحِيمِ",hint:"مد طبيعي في الرحمن"},
  {title:"الآية ٤",text:"مَالِكِ يَوْمِ الدِّينِ",say:"مَالِكِ يَوْمِ الدِّينِ",hint:"مد الألف في مالك"},
  {title:"الآية ٥",text:"إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",say:"إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",hint:"شدّد الياء في إياك"},
  {title:"الآية ٦",text:"اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",say:"اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",hint:"الصاد مفخمة"},
  {title:"الآية ٧",text:"صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",say:"صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",hint:"قسّم الآية إلى مقاطع قصيرة ثم اجمعها"}]},
 {id:"short",title:"قصار السور",sub:"سور قصيرة للحفظ بالتكرار",items:[
  {title:"الإخلاص ١",text:"قُلْ هُوَ اللَّهُ أَحَدٌ",say:"قُلْ هُوَ اللَّهُ أَحَدٌ",hint:"قل ثم هو الله أحد"},
  {title:"الإخلاص ٢",text:"اللَّهُ الصَّمَدُ",say:"اللَّهُ الصَّمَدُ",hint:"الصاد مفخمة"},
  {title:"الإخلاص ٣",text:"لَمْ يَلِدْ وَلَمْ يُولَدْ",say:"لَمْ يَلِدْ وَلَمْ يُولَدْ",hint:"اقرأها مقطعين"},
  {title:"الإخلاص ٤",text:"وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",say:"وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",hint:"تمهل في كفواً"}]},
 {id:"tajweed",title:"التجويد المبسط",sub:"قواعد أساسية يسمعها الطفل ويطبقها",items:[
  {title:"المد الطبيعي",text:"قَالَ",say:"قَالَ",hint:"مد حرف الألف مقدار حركتين"},{title:"الغنة",text:"إِنَّ",say:"إِنَّ",hint:"صوت أنفي لطيف مع النون المشددة"},{title:"القلقلة",text:"أَحَدْ",say:"أَحَدْ",hint:"ارتداد خفيف للصوت عند الدال الساكنة"},{title:"التفخيم",text:"صِرَاط",say:"صِرَاط",hint:"الصاد تُقرأ بصوت ممتلئ"}]}
];

function speak(text,repeat=1){if(!window.speechSynthesis)return false;window.speechSynthesis.cancel();let left=repeat;const run=()=>{const u=new SpeechSynthesisUtterance(text);u.lang="ar-SA";u.rate=.72;u.pitch=1;u.onend=()=>{left--;if(left>0)setTimeout(run,220)};window.speechSynthesis.speak(u)};run();return true}

export default function QuranTeacherLive({go,back="kids-home",learningOnly=false}){
 const [lesson,setLesson]=useState(()=>read(key("lesson"),0));
 const [item,setItem]=useState(()=>read(key("item"),0));
 const [repeat,setRepeat]=useState(()=>read(key("repeat"),3));
 const [done,setDone]=useState(()=>read(key("done"),{}));
 const [msg,setMsg]=useState("");
 const L=LESSONS[lesson]||LESSONS[0],I=L.items[item]||L.items[0];
 const total=useMemo(()=>LESSONS.reduce((n,x)=>n+x.items.length,0),[]);
 const completed=Object.keys(done).filter(k=>done[k]).length;
 const setLessonSafe=i=>{setLesson(i);setItem(0);save(key("lesson"),i);save(key("item"),0)};
 const setItemSafe=i=>{setItem(i);save(key("item"),i)};
 const listen=()=>{setMsg("");if(!speak(I.say,repeat))setMsg("ميزة القراءة الصوتية غير مدعومة في هذا المتصفح")};
 const mark=()=>{const id=`${L.id}:${item}`;const next={...done,[id]:true};setDone(next);save(key("done"),next);setMsg("أحسنت ✦ تم حفظ تقدمك");if(item<L.items.length-1)setItemSafe(item+1);else if(lesson<LESSONS.length-1)setLessonSafe(lesson+1)};
 return <div dir="rtl" style={{position:"fixed",inset:0,zIndex:50000,overflowY:"auto",background:"linear-gradient(180deg,#F8F4EA,#EEF4F1)",color:C.ink,fontFamily:"inherit"}}>
  <div style={{maxWidth:720,margin:"0 auto",padding:"max(82px,calc(env(safe-area-inset-top) + 54px)) 18px 120px"}}>
   <button onClick={()=>go(back)} style={{border:0,borderRadius:999,padding:"9px 14px",background:"rgba(255,255,255,.76)",fontFamily:"inherit",boxShadow:"0 8px 24px rgba(38,52,59,.07)"}}>→ {learningOnly?"القرآن":"الأطفال"}</button>
   <div style={{textAlign:"center",marginTop:22}}><div style={{fontSize:10,color:C.gold,letterSpacing:.7}}>سكينة للأطفال</div><h1 style={{fontSize:32,lineHeight:1.5,margin:"4px 0 0"}}>معلّم القرآن</h1><p style={{fontSize:12,opacity:.5,lineHeight:1.8,maxWidth:520,margin:"7px auto 0"}}>استمع، كرر، اقرأ، ثم احفظ تقدمك خطوة بخطوة.</p></div>

   <div style={{marginTop:20,padding:16,borderRadius:24,background:"rgba(255,255,255,.68)",border:"1px solid rgba(38,52,59,.055)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:11,opacity:.48}}>التقدم الكلي</span><b style={{fontSize:14}}>{completed} / {total}</b></div><div style={{height:8,borderRadius:99,background:"rgba(38,52,59,.08)",overflow:"hidden",marginTop:10}}><div style={{height:"100%",width:`${Math.min(100,completed/total*100)}%`,background:C.gold,transition:"width .3s"}}/></div></div>

   <div style={{display:"flex",gap:8,overflowX:"auto",padding:"4px 0 8px",marginTop:16}}>{LESSONS.map((x,i)=><button key={x.id} onClick={()=>setLessonSafe(i)} style={{flex:"0 0 auto",border:0,borderRadius:999,padding:"10px 14px",background:lesson===i?C.lapis:"rgba(255,255,255,.7)",color:lesson===i?"white":C.ink,fontFamily:"inherit",whiteSpace:"nowrap"}}>{x.title}</button>)}</div>

   <section style={{marginTop:10,borderRadius:32,padding:"22px 18px",background:`linear-gradient(145deg,${lesson%2?C.sky:C.mint},#FFF8E9)`,boxShadow:"0 18px 48px rgba(38,52,59,.07)"}}>
    <div style={{fontSize:10,opacity:.45}}>{L.title} · {item+1} من {L.items.length}</div><div style={{fontSize:14,opacity:.58,marginTop:5}}>{L.sub}</div>
    <div style={{fontFamily:"'Amiri Quran','Noto Naskh Arabic',serif",fontSize:L.id==="letters"?68:36,lineHeight:1.9,textAlign:"center",margin:"24px 0 12px",color:C.ink}}>{I.text}</div>
    <div style={{padding:13,borderRadius:18,background:"rgba(255,255,255,.58)",fontSize:12.5,lineHeight:1.8,textAlign:"center"}}>{I.hint}</div>
    <button onClick={listen} style={{width:"100%",marginTop:12,border:0,borderRadius:18,padding:14,background:C.lapis,color:"white",fontFamily:"inherit",fontSize:14}}>▶ استمع وكرر {repeat}×</button>
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:7,marginTop:9}}>{[1,2,3,5,7].map(n=><button key={n} onClick={()=>{setRepeat(n);save(key("repeat"),n)}} style={{padding:9,borderRadius:13,border:repeat===n?`1px solid ${C.gold}`:"1px solid rgba(38,52,59,.08)",background:repeat===n?"rgba(181,154,98,.14)":"rgba(255,255,255,.48)",fontFamily:"inherit"}}>{n}×</button>)}</div>
   </section>

   <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginTop:12}}><button disabled={item===0} onClick={()=>setItemSafe(Math.max(0,item-1))} style={{padding:12,border:0,borderRadius:16,background:"rgba(255,255,255,.7)",fontFamily:"inherit",opacity:item===0?.45:1}}>السابق</button><button disabled={item===L.items.length-1} onClick={()=>setItemSafe(Math.min(L.items.length-1,item+1))} style={{padding:12,border:0,borderRadius:16,background:"rgba(255,255,255,.7)",fontFamily:"inherit",opacity:item===L.items.length-1?.45:1}}>التالي</button></div>
   <button onClick={mark} style={{width:"100%",marginTop:10,padding:14,border:0,borderRadius:18,background:C.gold,color:"white",fontFamily:"inherit",fontSize:14,fontWeight:700}}>✓ أتقنت هذا الدرس</button>
   {msg&&<div style={{marginTop:10,textAlign:"center",fontSize:12,color:C.lapis}}>{msg}</div>}
  </div>
 </div>;
}
