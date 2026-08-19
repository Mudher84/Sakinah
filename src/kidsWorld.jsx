import React,{useMemo,useState} from "react";

const C={ivory:"#F8F5EE",ink:"#26343B",lapis:"#173B57",gold:"#B59A62",mint:"#DFF3E7",sky:"#DCEEFF",peach:"#FFE6CF",lilac:"#EDE3FA",rose:"#F9DFE5",sun:"#FFF2B8"};
function Shell({lang,go,titleAr,titleEn,subAr,subEn,children,back="kids-home",backLabelAr="الأطفال",backLabelEn="Kids"}){return <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,#FFF9EF,#F3F8F5)",color:C.ink,display:"flex",flexDirection:"column"}}><div style={{padding:"max(76px,calc(env(safe-area-inset-top) + 48px)) 18px 0"}}><button aria-label={lang==="ar"?`الرجوع إلى ${backLabelAr}`:`Back to ${backLabelEn}`} onClick={()=>go(back)} style={{border:0,background:"rgba(255,255,255,.82)",boxShadow:"0 8px 24px rgba(38,52,59,.07)",fontFamily:"inherit",cursor:"pointer",color:"inherit",display:"inline-flex",alignItems:"center",gap:8,padding:"6px 11px 6px 7px",borderRadius:999,minHeight:40}}><span style={{width:28,height:28,borderRadius:"50%",display:"grid",placeItems:"center",background:C.sun,color:C.lapis,fontSize:17,lineHeight:1}}>{lang==="ar"?"→":"←"}</span><span style={{fontSize:12,fontWeight:650}}>{lang==="ar"?backLabelAr:backLabelEn}</span></button></div><div style={{flex:1,overflowY:"auto",padding:"16px 18px 130px"}}><div style={{textAlign:"center"}}><div style={{fontSize:10,color:C.gold,letterSpacing:.7}}>سكينة للأطفال ✦</div><div style={{fontSize:30,lineHeight:1.5,fontWeight:700,marginTop:3}}>{lang==="ar"?titleAr:titleEn}</div><div style={{fontSize:12,opacity:.5,lineHeight:1.8,margin:"6px auto 0",maxWidth:520}}>{lang==="ar"?subAr:subEn}</div></div>{children}</div></div>}

const QUIZZES={
 young:[
  {q:"من خلقنا وخلق السماء والأرض؟",a:["الله","الناس","النجوم"],c:0,tip:"الله هو الخالق سبحانه."},
  {q:"كم صلاة مفروضة كل يوم؟",a:["٣","٥","٧"],c:1,tip:"نصلي خمس صلوات في اليوم والليلة."},
  {q:"ما كتاب المسلمين؟",a:["القرآن","القاموس","دفتر المدرسة"],c:0,tip:"القرآن كلام الله وكتاب المسلمين."},
  {q:"بماذا نبدأ قبل الأكل؟",a:["بسم الله","تصبح على خير","إلى اللقاء"],c:0,tip:"نقول بسم الله قبل الطعام."},
  {q:"إلى أي جهة نصلي؟",a:["الكعبة","البحر","الشمس"],c:0,tip:"نتجه إلى الكعبة المشرفة في الصلاة."},
  {q:"من هو أول نبي؟",a:["آدم عليه السلام","يوسف عليه السلام","يونس عليه السلام"],c:0,tip:"آدم عليه السلام أول البشر وأول نبي."}
 ],
 mid:[
  {q:"أين توجد الكعبة؟",a:["مكة","المدينة","القدس"],c:0,tip:"الكعبة في المسجد الحرام بمكة."},
  {q:"ما أول سورة في المصحف؟",a:["الفاتحة","البقرة","الإخلاص"],c:0,tip:"سورة الفاتحة هي أول سورة في المصحف."},
  {q:"في أي شهر نصوم رمضان؟",a:["رمضان","شوال","محرم"],c:0,tip:"الصيام المفروض يكون في شهر رمضان."},
  {q:"كم عدد أركان الإسلام؟",a:["٥","٦","٧"],c:0,tip:"أركان الإسلام خمسة."},
  {q:"أي نبي ابتلعه الحوت؟",a:["يونس عليه السلام","نوح عليه السلام","إبراهيم عليه السلام"],c:0,tip:"قصة يونس والحوت مذكورة في القرآن."},
  {q:"ما السورة التي تسمى أم الكتاب؟",a:["الفاتحة","الناس","الفلق"],c:0,tip:"الفاتحة من أعظم سور القرآن."}
 ],
 teen:[
  {q:"كم عدد أركان الإيمان؟",a:["٥","٦","٧"],c:1,tip:"أركان الإيمان ستة."},
  {q:"في أي شهر تكون ليلة القدر؟",a:["رمضان","شوال","محرم"],c:0,tip:"ليلة القدر تكون في رمضان."},
  {q:"ما الصلاة التي وقتها بعد غروب الشمس؟",a:["الفجر","المغرب","الظهر"],c:1,tip:"صلاة المغرب يدخل وقتها بعد غروب الشمس."},
  {q:"ما السورة التي تحكي قصة يوسف كاملة تقريباً؟",a:["يوسف","طه","مريم"],c:0,tip:"سورة يوسف تسرد قصته بتسلسل واضح."},
  {q:"ما معنى التوكل؟",a:["الأخذ بالأسباب مع الاعتماد على الله","ترك العمل","الخوف فقط"],c:0,tip:"نتوكل على الله ونأخذ بالأسباب."},
  {q:"ما أول ما يحاسب عليه العبد من عمله؟",a:["الصلاة","السفر","الطعام"],c:0,tip:"الصلاة أعظم أركان الإسلام العملية بعد الشهادتين."}
 ]
};

export function KidsQuranTeacherLive(){return null}

export function KidsQuizLive({lang="ar",go}){
 const [age,setAge]=useState("mid"),[i,setI]=useState(0),[score,setScore]=useState(0),[pick,setPick]=useState(null),[streak,setStreak]=useState(0);
 const bank=QUIZZES[age],x=bank[i%bank.length],answered=pick!==null,good=answered&&pick===x.c;
 const answer=j=>{if(answered)return;setPick(j);if(j===x.c){setScore(v=>v+1);setStreak(v=>v+1)}else setStreak(0)};
 const next=()=>{setI(v=>(v+1)%bank.length);setPick(null)};
 return <Shell lang={lang} go={go} titleAr="مسابقات الأطفال" titleEn="Kids Quizzes" subAr="أسئلة لطيفة حسب العمر، مع تفسير بسيط بعد كل إجابة" subEn="Playful age-based questions with a tiny explanation after every answer">
  <div style={{marginTop:18,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>{[["young","٤–٦","🐣",C.peach],["mid","٧–٩","🌟",C.sky],["teen","١٠–١٣","🚀",C.lilac]].map(([id,label,icon,tone])=><button key={id} onClick={()=>{setAge(id);setI(0);setScore(0);setPick(null);setStreak(0)}} style={{padding:"12px 6px",border:age===id?`2px solid ${C.gold}`:"2px solid transparent",borderRadius:20,background:tone,fontFamily:"inherit",color:C.ink}}><div style={{fontSize:25}}>{icon}</div><div style={{fontSize:12,fontWeight:700,marginTop:4}}>{label}</div></button>)}</div>
  <div style={{marginTop:14,padding:18,borderRadius:28,background:"rgba(255,255,255,.78)",boxShadow:"0 16px 38px rgba(38,52,59,.07)"}}>
   <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}><div style={{display:"flex",gap:7}}><span style={{padding:"6px 9px",borderRadius:999,background:C.sun,fontSize:10}}>⭐ {score}</span><span style={{padding:"6px 9px",borderRadius:999,background:C.mint,fontSize:10}}>🔥 {streak}</span></div><span style={{fontSize:10,opacity:.5}}>{i+1} / {bank.length}</span></div>
   <div style={{marginTop:12,height:7,borderRadius:99,background:"rgba(38,52,59,.07)",overflow:"hidden"}}><div style={{height:"100%",width:`${((i+1)/bank.length)*100}%`,background:C.gold}}/></div>
   <div style={{fontSize:23,lineHeight:1.7,fontWeight:700,textAlign:"center",margin:"24px 0 18px"}}>{x.q}</div>
   <div style={{display:"grid",gap:9}}>{x.a.map((a,j)=><button key={a} onClick={()=>answer(j)} style={{padding:"13px 14px",borderRadius:18,border:"1px solid rgba(38,52,59,.07)",background:!answered?"#FFF":j===x.c?"#E3F4E8":j===pick?"#F9E0E0":"rgba(255,255,255,.55)",fontFamily:"inherit",fontSize:13,textAlign:"right",color:C.ink}}>{a}</button>)}</div>
   {answered&&<div style={{marginTop:14,padding:14,borderRadius:18,background:good?C.mint:C.peach,textAlign:"center"}}><div style={{fontSize:22}}>{good?"🎉":"💡"}</div><div style={{fontSize:13,fontWeight:700,marginTop:3}}>{good?"أحسنت! إجابة صحيحة":"نتعلمها الآن"}</div><div style={{fontSize:11.5,lineHeight:1.8,opacity:.7,marginTop:4}}>{x.tip}</div></div>}
   {answered&&<button onClick={next} style={{width:"100%",marginTop:12,padding:13,border:0,borderRadius:17,background:C.lapis,color:"white",fontFamily:"inherit",fontWeight:700}}>السؤال التالي ✦</button>}
  </div>
 </Shell>;
}

export function KidsWorldHub({lang="ar",go}){
 const cards=[
  {ar:"معلّم القرآن",en:"Quran Teacher",to:"kids-quran-live",icon:"📖",desc:"حروف، حركات، قراءة، حفظ وتجويد",tone:C.mint},
  {ar:"قصص من القرآن",en:"Quran Stories",to:"kids-sourced-stories",icon:"🌙",desc:"حكايات حقيقية تقرأ للطفل بلغة جميلة",tone:C.peach},
  {ar:"مسابقات ذكية",en:"Smart Quizzes",to:"kids-quiz-live",icon:"🧠",desc:"أسئلة حسب العمر مع نقاط وتشجيع",tone:C.sky},
  {ar:"أناشيد الأطفال",en:"Kids Nasheeds",to:"kids-nasheeds",icon:"🎵",desc:"مكتبة صوتية محلية آمنة ولطيفة",tone:C.lilac}
 ];
 return <Shell lang={lang} go={go} back="profiles-center" titleAr="عالم سكينة الصغير" titleEn="Sakinah Kids" subAr="تعلم، اقرأ، استمع والعب في مساحة طفولية هادئة وآمنة" subEn="Learn, read, listen and play in a calm child-friendly space">
  <div style={{marginTop:18,borderRadius:30,padding:"20px 18px 24px",background:"linear-gradient(135deg,#FFF0C9,#DFF6FF 58%,#F3E7FF)",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",left:16,top:12,fontSize:26,pointerEvents:"none",zIndex:0}}>☁️</div><div style={{position:"absolute",left:18,bottom:12,fontSize:22,pointerEvents:"none",zIndex:0}}>⭐</div><div style={{position:"relative",zIndex:1,paddingLeft:42}}><div style={{fontSize:11,opacity:.55}}>مرحباً يا بطل ✨</div><div style={{fontSize:25,fontWeight:800,lineHeight:1.55,marginTop:5}}>ماذا تحب أن نكتشف اليوم؟</div><div style={{fontSize:11.5,opacity:.55,marginTop:5}}>اختر مغامرتك الصغيرة وابدأ من المكان الذي تحبه.</div></div></div>
  <div style={{marginTop:14,display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:10}}>{cards.map(c=><button key={c.to} onClick={()=>go(c.to)} style={{minHeight:166,padding:15,borderRadius:26,border:"1px solid rgba(38,52,59,.05)",background:c.tone,fontFamily:"inherit",color:C.ink,textAlign:"right",boxShadow:"0 12px 30px rgba(38,52,59,.045)"}}><div style={{width:48,height:48,borderRadius:18,display:"grid",placeItems:"center",background:"rgba(255,255,255,.62)",fontSize:27}}>{c.icon}</div><div style={{fontSize:14,fontWeight:800,marginTop:12}}>{lang==="ar"?c.ar:c.en}</div><div style={{fontSize:10.5,lineHeight:1.7,opacity:.58,marginTop:5}}>{c.desc}</div><div style={{marginTop:10,fontSize:10,color:C.lapis,fontWeight:700}}>ابدأ الآن ←</div></button>)}</div>
  <div style={{marginTop:13,padding:14,borderRadius:22,background:"rgba(255,255,255,.68)",display:"flex",alignItems:"center",gap:12}}><div style={{width:42,height:42,borderRadius:15,display:"grid",placeItems:"center",background:C.sun,fontSize:23}}>🌱</div><div><div style={{fontSize:12.5,fontWeight:750}}>خطوة صغيرة كل يوم</div><div style={{fontSize:10.5,opacity:.5,marginTop:3}}>درس واحد أو قصة واحدة اليوم تكفي. المهم أن نستمر بحب وهدوء.</div></div></div>
 </Shell>;
}
