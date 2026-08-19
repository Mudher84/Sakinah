import React,{useMemo,useState} from "react";

const C={ivory:"#F6F3EC",ink:"#26343B",lapis:"#173B57",gold:"#B59A62",mint:"#DDECE3",sky:"#DDEAF4",rose:"#F1E2DF"};
const activeProfile=()=>{try{return localStorage.getItem("sakinah-active-profile")||"me"}catch{return"me"}};
const key=n=>`sakinah-quran-teacher-${activeProfile()}-${n}`;
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};

const LETTERS=[
 ["أ","ألف","أَلِف","يخرج الصوت من الحلق بوضوح ومن دون ضغط"],
 ["ب","باء","بَ","أغلق الشفتين ثم افتحهما برفق"],
 ["ت","تاء","تَ","طرف اللسان قريب من أصول الأسنان العليا"],
 ["ث","ثاء","ثَ","أخرج طرف اللسان قليلاً بين الأسنان"],
 ["ج","جيم","جَ","وسط اللسان يقترب من الحنك الأعلى"],
 ["ح","حاء","حَ","صوت لطيف يخرج من وسط الحلق"],
 ["خ","خاء","خَ","صوت مفخم قليلاً يخرج من أعلى الحلق"],
 ["د","دال","دَ","طرف اللسان يلامس أصول الأسنان العليا"],
 ["ذ","ذال","ذَ","طرف اللسان يظهر قليلاً بين الأسنان"],
 ["ر","راء","رَ","طرف اللسان يقترب من اللثة العليا بخفة"],
 ["ز","زاي","زَ","صوت رقيق مع اقتراب الأسنان"],
 ["س","سين","سَ","هواء خفيف يمر بين الأسنان"],
 ["ش","شين","شَ","انشر الصوت بلطف في وسط الفم"],
 ["ص","صاد","صَ","حرف مفخم، املأ الفم بصوته"],
 ["ض","ضاد","ضَ","اضغط جانب اللسان برفق على الأضراس العليا"],
 ["ط","طاء","طَ","حرف قوي مفخم، طرف اللسان عند أصول الأسنان"],
 ["ظ","ظاء","ظَ","أظهر طرف اللسان قليلاً مع التفخيم"],
 ["ع","عين","عَ","يخرج من وسط الحلق بلا تكلف"],
 ["غ","غين","غَ","صوت مفخم من أعلى الحلق"],
 ["ف","فاء","فَ","باطن الشفة السفلى يلامس أطراف الأسنان العليا"],
 ["ق","قاف","قَ","من أقصى اللسان مع الحنك الأعلى وبصوت مفخم"],
 ["ك","كاف","كَ","أقصى اللسان يقترب من الحنك الأعلى برفق"],
 ["ل","لام","لَ","طرف اللسان يلامس ما وراء الأسنان العليا"],
 ["م","ميم","مَ","أطبق الشفتين مع خروج صوت واضح"],
 ["ن","نون","نَ","طرف اللسان عند اللثة مع غنة خفيفة"],
 ["ه","هاء","هَ","هواء لطيف يخرج من أقصى الحلق"],
 ["و","واو","وَ","ضم الشفتين من غير إغلاق كامل"],
 ["ي","ياء","يَ","وسط اللسان يقترب من الحنك الأعلى"],
].map(([letter,name,text,hint])=>({title:`${letter} · ${name}`,text,say:name,hint,letter}));

const LESSONS=[
 {id:"letters",icon:"أ",title:"الحروف العربية",sub:"جميع الحروف العربية: الشكل، الاسم، والصوت",tone:C.mint,items:LETTERS},
 {id:"harakat",icon:"َ",title:"الحركات",sub:"نتعلم الفتحة والضمة والكسرة والسكون",tone:C.sky,items:[{title:"الفتحة",text:"بَ",say:"بَ",hint:"صوت قصير مفتوح: بَ"},{title:"الضمة",text:"بُ",say:"بُ",hint:"ضم الشفتين قليلاً: بُ"},{title:"الكسرة",text:"بِ",say:"بِ",hint:"ابتسامة خفيفة: بِ"},{title:"السكون",text:"بْ",say:"بْ",hint:"الحرف يتوقف بلا حركة بعده"}]},
 {id:"words",icon:"ك",title:"كلمات قرآنية",sub:"كلمات قصيرة نقرأها ببطء ثم بطلاقة",tone:"#EEE6D7",items:[{title:"رَبِّ",text:"رَبِّ",say:"رَبِّ",hint:"راء مفتوحة، ثم باء مكسورة مشددة"},{title:"هُدَى",text:"هُدَى",say:"هُدَى",hint:"هاء مضمومة ثم دال مفتوحة"},{title:"نُور",text:"نُور",say:"نُور",hint:"نون مضمومة ثم واو مد"},{title:"رَحْمَة",text:"رَحْمَة",say:"رَحْمَة",hint:"اقرأها ببطء: رَحْ ـ مَ ـ ة"}]},
 {id:"fatiha",icon:"١",title:"سورة الفاتحة",sub:"استماع وترديد وحفظ آية آية",tone:"#E9E1F1",items:[{title:"الآية ١",text:"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",say:"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",hint:"ابدأ بهدوء ووضوح"},{title:"الآية ٢",text:"الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",say:"الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",hint:"انتبه إلى تشديد اللام في لله"},{title:"الآية ٣",text:"الرَّحْمَٰنِ الرَّحِيمِ",say:"الرَّحْمَٰنِ الرَّحِيمِ",hint:"مد طبيعي في الرحمن"},{title:"الآية ٤",text:"مَالِكِ يَوْمِ الدِّينِ",say:"مَالِكِ يَوْمِ الدِّينِ",hint:"مد الألف في مالك"},{title:"الآية ٥",text:"إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",say:"إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",hint:"شدّد الياء في إياك"},{title:"الآية ٦",text:"اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",say:"اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",hint:"الصاد مفخمة"},{title:"الآية ٧",text:"صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",say:"صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",hint:"قسّم الآية إلى مقاطع قصيرة ثم اجمعها"}]},
 {id:"short",icon:"ق",title:"قصار السور",sub:"حفظ قصير بالتكرار والرجوع الذكي",tone:"#E1ECE7",items:[{title:"الإخلاص ١",text:"قُلْ هُوَ اللَّهُ أَحَدٌ",say:"قُلْ هُوَ اللَّهُ أَحَدٌ",hint:"قل ثم هو الله أحد"},{title:"الإخلاص ٢",text:"اللَّهُ الصَّمَدُ",say:"اللَّهُ الصَّمَدُ",hint:"الصاد مفخمة"},{title:"الإخلاص ٣",text:"لَمْ يَلِدْ وَلَمْ يُولَدْ",say:"لَمْ يَلِدْ وَلَمْ يُولَدْ",hint:"اقرأها مقطعين"},{title:"الإخلاص ٤",text:"وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",say:"وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",hint:"تمهل في كفواً"}]},
 {id:"tajweed",icon:"ص",title:"التجويد المبسط",sub:"قاعدة صغيرة، مثال واضح، ثم تطبيق",tone:C.rose,items:[{title:"المد الطبيعي",text:"قَالَ",say:"قَالَ",hint:"مد حرف الألف مقدار حركتين"},{title:"الغنة",text:"إِنَّ",say:"إِنَّ",hint:"صوت أنفي لطيف مع النون المشددة"},{title:"القلقلة",text:"أَحَدْ",say:"أَحَدْ",hint:"ارتداد خفيف للصوت عند الدال الساكنة"},{title:"التفخيم",text:"صِرَاط",say:"صِرَاط",hint:"الصاد تُقرأ بصوت ممتلئ"}]}
];

function speak(text,repeat=1,onDone){if(!window.speechSynthesis)return false;window.speechSynthesis.cancel();let left=repeat;const run=()=>{const u=new SpeechSynthesisUtterance(text);u.lang="ar-SA";u.rate=.72;u.pitch=1;u.onend=()=>{left--;if(left>0)setTimeout(run,220);else onDone?.()};window.speechSynthesis.speak(u)};run();return true}

export default function QuranTeacherLive({go,back="kids-home",learningOnly=false}){
 const [lesson,setLesson]=useState(()=>read(key("lesson"),0)),[item,setItem]=useState(()=>read(key("item"),0)),[repeat,setRepeat]=useState(()=>read(key("repeat"),3)),[done,setDone]=useState(()=>read(key("done"),{})),[listening,setListening]=useState(false),[msg,setMsg]=useState("");
 const L=LESSONS[lesson]||LESSONS[0],I=L.items[item]||L.items[0];
 const total=useMemo(()=>LESSONS.reduce((n,x)=>n+x.items.length,0),[]),completed=Object.keys(done).filter(k=>done[k]).length,progress=Math.round(completed/total*100),lessonDone=x=>x.items.filter((_,i)=>done[`${x.id}:${i}`]).length;
 const setLessonSafe=i=>{setLesson(i);setItem(0);setMsg("");save(key("lesson"),i);save(key("item"),0)},setItemSafe=i=>{setItem(i);setMsg("");save(key("item"),i)};
 const listen=()=>{setMsg("");setListening(true);if(!speak(I.say,repeat,()=>setListening(false))){setListening(false);setMsg("ميزة القراءة الصوتية غير مدعومة في هذا المتصفح")}},stop=()=>{try{window.speechSynthesis?.cancel()}catch{}setListening(false)};
 const mark=()=>{const id=`${L.id}:${item}`,next={...done,[id]:true};setDone(next);save(key("done"),next);setMsg("أحسنت ✦ تم حفظ تقدمك");setTimeout(()=>{if(item<L.items.length-1)setItemSafe(item+1);else if(lesson<LESSONS.length-1)setLessonSafe(lesson+1)},450)};
 const review=()=>{for(let li=0;li<LESSONS.length;li++){const miss=LESSONS[li].items.findIndex((_,ii)=>!done[`${LESSONS[li].id}:${ii}`]);if(miss>=0){setLesson(li);setItem(miss);save(key("lesson"),li);save(key("item"),miss);setMsg("بدأنا من أول جزء يحتاج مراجعة");return}}setMsg("رائع! أكملت كل الدروس الحالية")};
 return <div dir="rtl" style={{position:"fixed",inset:0,zIndex:50000,overflowY:"auto",background:"linear-gradient(180deg,#F8F4EA,#EEF4F1)",color:C.ink,fontFamily:"inherit"}}><div style={{maxWidth:760,margin:"0 auto",padding:"max(84px,calc(env(safe-area-inset-top) + 56px)) 16px 124px",boxSizing:"border-box"}}>
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}><button onClick={()=>go(back)} style={{border:0,borderRadius:999,padding:"9px 14px",background:"rgba(255,255,255,.76)",fontFamily:"inherit",boxShadow:"0 8px 24px rgba(38,52,59,.07)"}}>→ {learningOnly?"القرآن":"الأطفال"}</button><button onClick={review} style={{border:0,borderRadius:999,padding:"9px 14px",background:C.lapis,color:"white",fontFamily:"inherit"}}>مراجعة ذكية</button></div>
  <div style={{textAlign:"center",marginTop:20}}><div style={{fontSize:10,color:C.gold,letterSpacing:.7}}>سكينة للأطفال</div><h1 style={{fontSize:30,lineHeight:1.5,margin:"3px 0 0"}}>معلّم القرآن</h1><p style={{fontSize:12,opacity:.52,lineHeight:1.8,maxWidth:520,margin:"6px auto 0"}}>ابدأ بالحروف كلها، ثم الحركات والكلمات والتلاوة خطوة بخطوة.</p></div>
  <section style={{marginTop:18,display:"grid",gridTemplateColumns:"1.2fr .8fr",gap:10}}><div style={{padding:16,borderRadius:24,background:"rgba(255,255,255,.72)",border:"1px solid rgba(38,52,59,.055)"}}><div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"end"}}><div><div style={{fontSize:10,opacity:.45}}>تقدمك</div><div style={{fontSize:25,fontWeight:650,marginTop:2}}>{progress}%</div></div><div style={{fontSize:11,opacity:.5}}>{completed} من {total}</div></div><div style={{height:8,borderRadius:99,background:"rgba(38,52,59,.08)",overflow:"hidden",marginTop:12}}><div style={{height:"100%",width:`${progress}%`,background:C.gold,transition:"width .3s"}}/></div></div><div style={{padding:16,borderRadius:24,background:C.lapis,color:"white",display:"flex",flexDirection:"column",justifyContent:"space-between"}}><div style={{fontSize:10,opacity:.62}}>أنت الآن في</div><div><div style={{fontSize:17,fontWeight:650}}>{L.title}</div><div style={{fontSize:10.5,opacity:.66,marginTop:3}}>{item+1} / {L.items.length}</div></div></div></section>
  <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:9,marginTop:14}}>{LESSONS.map((x,i)=>{const d=lessonDone(x);return <button key={x.id} onClick={()=>setLessonSafe(i)} style={{border:lesson===i?`1px solid ${C.gold}`:"1px solid rgba(38,52,59,.055)",borderRadius:22,padding:13,background:lesson===i?"rgba(181,154,98,.10)":"rgba(255,255,255,.62)",fontFamily:"inherit",color:C.ink,textAlign:"right",display:"grid",gridTemplateColumns:"44px 1fr auto",alignItems:"center",gap:10}}><span style={{width:42,height:42,borderRadius:15,display:"grid",placeItems:"center",background:x.tone,fontSize:20,fontWeight:700}}>{x.icon}</span><span><b style={{display:"block",fontSize:12.5}}>{x.title}</b><small style={{display:"block",fontSize:9.5,opacity:.45,marginTop:3}}>{x.sub}</small></span><span style={{fontSize:10,opacity:.45}}>{d}/{x.items.length}</span></button>})}</div>
  {L.id==="letters"&&<div style={{display:"grid",gridTemplateColumns:"repeat(7,minmax(0,1fr))",gap:6,marginTop:12}}>{L.items.map((x,i)=><button key={x.letter} onClick={()=>setItemSafe(i)} style={{aspectRatio:"1",border:item===i?`1px solid ${C.gold}`:"1px solid rgba(38,52,59,.06)",borderRadius:14,background:item===i?"rgba(181,154,98,.14)":"rgba(255,255,255,.62)",fontFamily:"'Amiri Quran','Noto Naskh Arabic',serif",fontSize:22,color:C.ink}}>{x.letter}</button>)}</div>}
  <section style={{marginTop:14,borderRadius:30,padding:"20px 16px",background:`linear-gradient(145deg,${L.tone},#FFF9EA)`,boxShadow:"0 18px 48px rgba(38,52,59,.06)"}}><div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center"}}><div><div style={{fontSize:10,opacity:.45}}>{L.title}</div><div style={{fontSize:14,fontWeight:650,marginTop:3}}>{I.title}</div></div><div style={{padding:"6px 9px",borderRadius:999,background:"rgba(255,255,255,.55)",fontSize:10}}>{item+1} من {L.items.length}</div></div><div style={{fontFamily:"'Amiri Quran','Noto Naskh Arabic',serif",fontSize:L.id==="letters"?72:34,lineHeight:1.85,textAlign:"center",margin:"22px 0 10px"}}>{I.text}</div><div style={{padding:13,borderRadius:18,background:"rgba(255,255,255,.58)",fontSize:12.5,lineHeight:1.8,textAlign:"center"}}>{I.hint}</div><div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8,marginTop:11}}><button onClick={listening?stop:listen} style={{border:0,borderRadius:17,padding:14,background:C.lapis,color:"white",fontFamily:"inherit",fontSize:13}}>{listening?"■ إيقاف":"▶ استمع وكرر"}</button><div style={{display:"flex",gap:5,alignItems:"center",padding:"0 6px"}}>{[1,3,5].map(n=><button key={n} onClick={()=>{setRepeat(n);save(key("repeat"),n)}} style={{width:38,height:38,borderRadius:12,border:repeat===n?`1px solid ${C.gold}`:"1px solid rgba(38,52,59,.08)",background:repeat===n?"rgba(181,154,98,.14)":"rgba(255,255,255,.5)",fontFamily:"inherit"}}>{n}×</button>)}</div></div>{msg&&<div style={{marginTop:10,textAlign:"center",fontSize:11,color:C.lapis}}>{msg}</div>}</section>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1.25fr 1fr",gap:8,marginTop:12}}><button disabled={item===0} onClick={()=>setItemSafe(Math.max(0,item-1))} style={{padding:12,border:0,borderRadius:16,background:"rgba(255,255,255,.72)",fontFamily:"inherit",opacity:item===0?.35:1}}>السابق</button><button onClick={mark} style={{padding:12,border:0,borderRadius:16,background:C.gold,color:"white",fontFamily:"inherit",fontWeight:650}}>{done[`${L.id}:${item}`]?"تم إتقانه ✓":"أتقنت هذا الدرس"}</button><button disabled={item===L.items.length-1} onClick={()=>setItemSafe(Math.min(L.items.length-1,item+1))} style={{padding:12,border:0,borderRadius:16,background:"rgba(255,255,255,.72)",fontFamily:"inherit",opacity:item===L.items.length-1?.35:1}}>التالي</button></div>
 </div></div>;
}
