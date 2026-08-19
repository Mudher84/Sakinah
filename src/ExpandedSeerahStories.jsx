import React,{useMemo,useState} from "react";

const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62"};
const btn={border:"1px solid rgba(16,16,15,.08)",borderRadius:16,padding:11,background:"rgba(255,255,255,.62)",fontFamily:"inherit",color:"inherit"};
const nd=s=>String(s).replace(/[0-9]/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]);

const SEERAH=[
 {id:"revelation",title:"بدء الوحي",era:"مكة",ref:"96:1-5",summary:"افتتاح الرسالة بالقراءة والعلم وذكر خلق الإنسان وتعليمه.",beats:["خلوة النبي ﷺ وتعبده قبل البعثة","نزول أول آيات الوحي","بداية مرحلة النبوة والبلاغ","العلم والقراءة في أول خطاب قرآني"]},
 {id:"public-call",title:"الجهر بالدعوة",era:"مكة",ref:"26:214",summary:"الانتقال من الدعوة الخاصة إلى تبليغ الأقربين ثم الناس.",beats:["دعوة الأقربين","إعلان التوحيد","تحمل الأذى والثبات","استمرار البلاغ بالحكمة"]},
 {id:"isra",title:"الإسراء",era:"مكة",ref:"17:1",summary:"الإسراء من المسجد الحرام إلى المسجد الأقصى وآية من آيات الله.",beats:["المسجد الحرام","المسجد الأقصى","إراءة النبي ﷺ من آيات الله","تثبيت الرسول والمؤمنين"]},
 {id:"hijrah",title:"الهجرة والغار",era:"الهجرة",ref:"9:40",summary:"الخروج من مكة والهجرة إلى المدينة وما صاحب الغار من سكينة وتأييد.",beats:["قرار الهجرة","الخروج من مكة","الغار ومعية الله","الوصول إلى المدينة وبداية مجتمع جديد"]},
 {id:"qibla",title:"تحويل القبلة",era:"المدينة",ref:"2:144",summary:"تحويل القبلة إلى المسجد الحرام بعد الهجرة.",beats:["التوجه السابق","ترقب النبي ﷺ للأمر","نزول أمر التحويل","استجابة المسلمين"]},
 {id:"badr",title:"غزوة بدر",era:"المدينة",ref:"3:123-125",summary:"أول مواجهة كبرى ونصر الله للمؤمنين وهم قلة.",beats:["قلة عدد المسلمين","الثبات والدعاء","التأييد والنصر","الدرس في التوكل وعدم الاغترار بالقوة"]},
 {id:"uhud",title:"غزوة أحد",era:"المدينة",ref:"3:152-153",summary:"ابتلاء أحد وما حملته أحداثها من دروس في الطاعة والثبات.",beats:["بداية المعركة","مخالفة بعض الرماة","تحول ميزان القتال","التربية القرآنية بعد الحدث"]},
 {id:"ifk",title:"حادثة الإفك",era:"المدينة",ref:"24:11-20",summary:"المحنة التي نزلت فيها آيات البراءة وآداب التثبت وحفظ الأعراض.",beats:["انتشار الخبر الكاذب","موقف المؤمن من الشائعة","نزول البراءة","آداب المجتمع في التثبت وصيانة الأعراض"]},
 {id:"ahzab",title:"غزوة الأحزاب",era:"المدينة",ref:"33:9-27",summary:"حصار المدينة واجتماع الأحزاب ثم كفاية الله للمؤمنين.",beats:["تحالف الأحزاب","شدة الحصار والخوف","ثبات المؤمنين","انكشاف الأحزاب ونهاية الحصار"]},
 {id:"hudaybiyyah",title:"الحديبية والفتح المبين",era:"المدينة",ref:"48:1-27",summary:"صلح الحديبية الذي سماه القرآن فتحاً مبيناً وما أعقبه من توسع الدعوة.",beats:["الخروج للعمرة","التوقف في الحديبية","البيعة والصلح","وعد الفتح وطمأنينة المؤمنين"]},
 {id:"hunayn",title:"غزوة حنين",era:"المدينة",ref:"9:25-27",summary:"يوم حنين حين لم تغن الكثرة ثم نزلت السكينة وانقلب الموقف.",beats:["الإعجاب بالكثرة","المفاجأة في أول القتال","نزول السكينة","عودة الثبات والنصر"]},
 {id:"tabuk",title:"تبوك والعسرة",era:"المدينة",ref:"9:117",summary:"الخروج في شدة الحر وقلة الزاد وما سماه القرآن ساعة العسرة.",beats:["الاستعداد في ظروف صعبة","بذل الصحابة","المسير الطويل","التوبة والرحمة بأهل العسرة"]},
 {id:"victory",title:"النصر",era:"أواخر العهد المدني",ref:"110:1-3",summary:"تمام النعمة ودخول الناس في دين الله أفواجاً مع الأمر بالتسبيح والاستغفار.",beats:["مجيء نصر الله","دخول الناس في الدين","التسبيح بحمد الله","الاستغفار عند تمام العمل"]}
];

const PROPHETS=[
 {id:"adam",title:"آدم عليه السلام",tag:"البداية",ref:"2:30-39",summary:"بداية قصة الإنسان: الاستخلاف والعلم والسجود والابتلاء ثم التوبة والهداية.",beats:["إخبار الملائكة بالاستخلاف","تعليم آدم الأسماء","أمر السجود وامتناع إبليس","السكن في الجنة والابتلاء","الهبوط وقبول التوبة ووعد الهداية"]},
 {id:"nuh",title:"نوح عليه السلام",tag:"الصبر",ref:"11:25-49",summary:"دعوة طويلة إلى التوحيد ثم السفينة والطوفان ونجاة المؤمنين.",beats:["دعوة نوح قومه إلى عبادة الله","إصرار المكذبين","الأمر بصنع السفينة","بدء الطوفان","نجاة المؤمنين واستقرار السفينة"]},
 {id:"hud",title:"هود عليه السلام",tag:"الثبات",ref:"11:50-60",summary:"دعوة عاد إلى التوحيد والاستغفار ورفض التكبر.",beats:["دعوة عاد للتوحيد","رفض الأجر الدنيوي","مواجهة التكذيب","التوكل على الله","نجاة هود والمؤمنين وعاقبة عاد"]},
 {id:"salih",title:"صالح عليه السلام",tag:"الآية",ref:"11:61-68",summary:"دعوة ثمود وظهور الناقة آيةً ثم عاقبة الاعتداء عليها.",beats:["الدعوة إلى عبادة الله","الناقة آية لقومه","التحذير من أذيتها","العقر والتكذيب","نجاة صالح والمؤمنين"]},
 {id:"ibrahim",title:"إبراهيم عليه السلام",tag:"التوحيد",ref:"21:51-70",summary:"مواجهة الشرك وكسر الأصنام وإقامة الحجة ثم النجاة من النار.",beats:["إنكار عبادة الأصنام","كسر الأصنام","محاجة القوم","قرار الإحراق","قول الله للنار كوني برداً وسلاماً"]},
 {id:"lut",title:"لوط عليه السلام",tag:"النجاة",ref:"11:77-83",summary:"مجيء الملائكة وإخبار لوط بالعذاب ثم نجاته ومن آمن معه.",beats:["وصول الملائكة","ضيق لوط بقومه","إعلان حقيقة الضيوف","أمر الخروج ليلاً","نجاة المؤمنين ووقوع العذاب"]},
 {id:"ismail",title:"إسماعيل عليه السلام",tag:"الوفاء",ref:"19:54-55",summary:"ثناء القرآن عليه بصدق الوعد وحرصه على الصلاة والزكاة.",beats:["صدق الوعد","النبوة والرسالة","أمر أهله بالصلاة","الزكاة ورضا الله"]},
 {id:"ishaq",title:"إسحاق عليه السلام",tag:"البشارة",ref:"11:71-73",summary:"بشارة إبراهيم وزوجه بإسحاق ومن وراء إسحاق يعقوب.",beats:["زيارة الملائكة","البشارة بإسحاق","التعجب من البشرى","تأكيد رحمة الله وبركته"]},
 {id:"yaqub",title:"يعقوب عليه السلام",tag:"الرجاء",ref:"12:83-87",summary:"صبر يعقوب الجميل وثقته بالله وعدم اليأس من رحمته.",beats:["تجدد الحزن","الصبر الجميل","بث الشكوى إلى الله","الأمر بالبحث عن يوسف وأخيه","النهي عن اليأس من روح الله"]},
 {id:"yusuf",title:"يوسف عليه السلام",tag:"العفة",ref:"12:4-101",summary:"من أوسع القصص القرآنية: الرؤيا والبئر والبيت والفتنة والسجن ثم التمكين ولمّ شمل الأسرة.",beats:["رؤيا يوسف ونصيحة أبيه","كيد الإخوة وإلقاؤه في الجب","انتقاله إلى مصر وبيعه","ابتلاء بيت العزيز والعفة","السجن وتعبير الرؤى","رؤيا الملك وخطة سنوات الخصب والقحط","خروج يوسف بريئاً وتوليه خزائن الأرض","مجيء الإخوة وامتحانهم","إظهار الحقيقة والعفو","قدوم يعقوب واجتماع الأسرة وتحقق الرؤيا"]},
 {id:"shuayb",title:"شعيب عليه السلام",tag:"الأمانة",ref:"11:84-95",summary:"دعوة مدين إلى التوحيد والعدل في الكيل والميزان وترك الفساد.",beats:["التوحيد","إيفاء المكيال والميزان","رفض الفساد","مواجهة التهديد","نجاة شعيب وعاقبة المكذبين"]},
 {id:"ayyub",title:"أيوب عليه السلام",tag:"الصبر",ref:"21:83-84",summary:"دعاء نبي الله أيوب عند الضر واستجابة الله وكشف البلاء.",beats:["نزول الضر","الدعاء بأدب","استجابة الله","كشف الضر ورد الأهل والرحمة"]},
 {id:"musa",title:"موسى عليه السلام",tag:"الرسالة",ref:"20:9-98",summary:"نداء موسى وإرساله إلى فرعون، المعجزات، مواجهة السحرة، الخروج ببني إسرائيل، ثم فتنة السامري.",beats:["النار والنداء عند الطور","العصا واليد آيتان","دعاء شرح الصدر ومؤازرة هارون","مواجهة فرعون","موعد السحرة وإيمانهم","الخروج ببني إسرائيل وانفلاق البحر","نجاة المؤمنين وغرق فرعون","موعد الطور","فتنة العجل والسامري","عودة موسى ومعالجة الفتنة"]},
 {id:"harun",title:"هارون عليه السلام",tag:"المؤازرة",ref:"20:29-36",summary:"طلب موسى أن يكون هارون وزيراً له وشريكاً في حمل الرسالة.",beats:["دعاء موسى","طلب الوزير من أهله","تقوية الظهر به","الاشتراك في الذكر والتسبيح","إجابة الله للدعاء"]},
 {id:"dawud",title:"داود عليه السلام",tag:"الحكم",ref:"38:17-26",summary:"القوة في العبادة والحكم بالحق والإنابة إلى الله.",beats:["تسبيح الجبال والطير","إيتاء الحكمة وفصل الخطاب","قصة الخصمين","التنبه والإنابة","الأمر بالحكم بالحق"]},
 {id:"sulayman",title:"سليمان عليه السلام",tag:"الشكر",ref:"27:15-44",summary:"العلم والملك وقصة النملة والهدهد وملكة سبأ وانتهاء الأمر بإسلامها لله.",beats:["وراثة العلم والملك","وادي النمل وشكر النعمة","غياب الهدهد وخبر سبأ","كتاب سليمان إلى الملكة","اختبار العرش","مجيء الملكة وإسلامها لله"]},
 {id:"ilyas",title:"إلياس عليه السلام",tag:"الدعوة",ref:"37:123-132",summary:"دعوة قومه إلى الله وترك عبادة بعل.",beats:["الرسالة إلى قومه","إنكار عبادة بعل","تذكيرهم بالخالق","نجاة عباد الله المخلصين","بقاء الذكر الحسن"]},
 {id:"alyasa",title:"اليسع عليه السلام",tag:"الصلاح",ref:"38:48",summary:"ذكره القرآن ضمن الأخيار.",beats:["ذكره مع إسماعيل وذا الكفل","وصف الجميع بأنهم من الأخيار"]},
 {id:"yunus",title:"يونس عليه السلام",tag:"الكرب",ref:"21:87-88",summary:"دعاؤه في الظلمات واعترافه بالتوحيد والتقصير ثم استجابة الله له.",beats:["الذهاب مغاضباً","الظلمات","دعاء لا إله إلا أنت سبحانك","الاستجابة والنجاة","قاعدة قرآنية: وكذلك ننجي المؤمنين"]},
 {id:"zakariyya",title:"زكريا عليه السلام",tag:"الدعاء",ref:"19:2-15",summary:"دعاء خفي بالذرية وبشارة يحيى رغم الكبر.",beats:["الدعاء الخفي","ذكر الضعف والكبر","طلب الولي الصالح","البشارة بيحيى","آية الصمت وولادة يحيى"]},
 {id:"yahya",title:"يحيى عليه السلام",tag:"الطهارة",ref:"19:7-15",summary:"البشارة بيحيى وإيتاؤه الحكم والحنان والطهارة والبر.",beats:["البشارة باسم يحيى","إيتاء الحكم صبياً","الحنان والزكاة","البر بالوالدين","السلام عليه في مراحل حياته"]},
 {id:"isa",title:"عيسى عليه السلام",tag:"الآية",ref:"19:16-36",summary:"اعتزال مريم، البشارة بعيسى، الولادة، ثم كلامه في المهد وإعلانه عبوديته لله ونبوته.",beats:["اعتزال مريم","مجيء الروح والبشارة","الحمل والولادة","العودة إلى قومها","كلام عيسى في المهد","إعلانه أنه عبد الله ونبي وأوصي بالصلاة والزكاة"]}
];

function parseRef(ref){const[s,r]=ref.split(":");const[a,b]=r.split("-").map(Number);return{surah:Number(s),from:a,to:b||a}}
async function fetchRange(ref){
 const {surah,from,to}=parseRef(ref);
 const r=await fetch(`https://api.alquran.cloud/v1/surah/${surah}/editions/quran-uthmani,en.sahih`);
 if(!r.ok)throw new Error("http");
 const j=await r.json(),ar=j.data?.[0]?.ayahs||[],en=j.data?.[1]?.ayahs||[];
 return ar.filter(x=>x.numberInSurah>=from&&x.numberInSurah<=to).map(x=>{const e=en.find(y=>y.numberInSurah===x.numberInSurah);return{n:x.numberInSurah,ar:x.text,en:e?.text||""}});
}

function StoryDetail({item,onClose,saved,onSave}){
 const[verses,setVerses]=useState(null),[busy,setBusy]=useState(false),[err,setErr]=useState("");
 const load=async()=>{setBusy(true);setErr("");try{setVerses(await fetchRange(item.ref))}catch{setErr("تعذر تحميل النص القرآني الآن. تحقق من الاتصال وحاول مرة أخرى.")}finally{setBusy(false)}};
 return <article style={{marginTop:14,padding:18,borderRadius:26,background:"rgba(255,255,255,.64)",border:"1px solid rgba(16,16,15,.06)"}}>
  <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"flex-start"}}><div><h2 style={{fontSize:24,margin:0}}>{item.title}</h2><div style={{fontSize:10,opacity:.45,marginTop:5}}>المرجع القرآني · {nd(item.ref)}</div></div><button onClick={onClose} style={{...btn,padding:"7px 10px"}}>إغلاق</button></div>
  <p style={{fontSize:13.5,lineHeight:2,margin:"14px 0 0",opacity:.8}}>{item.summary}</p>
  <section style={{marginTop:16}}><div style={{fontSize:12,fontWeight:800,color:C.gold}}>القصة كاملة — تسلسل الأحداث</div><div style={{marginTop:9,display:"grid",gap:8}}>{item.beats.map((x,i)=><div key={x} style={{display:"grid",gridTemplateColumns:"34px 1fr",gap:9,alignItems:"start",padding:"10px 12px",borderRadius:16,background:"rgba(181,154,98,.075)"}}><div style={{width:30,height:30,borderRadius:"50%",background:C.lapis,color:"white",display:"grid",placeItems:"center",fontSize:11}}>{nd(i+1)}</div><div style={{fontSize:12.5,lineHeight:1.8,paddingTop:3}}>{x}</div></div>)}</div></section>
  <div style={{display:"grid",gridTemplateColumns:"1.4fr .8fr",gap:8,marginTop:14}}><button onClick={load} style={{...btn,background:C.lapis,color:"white",border:0,fontWeight:700}}>{busy?"جاري تحميل القصة…":"قراءة النص القرآني الكامل"}</button><button onClick={onSave} style={{...btn}}>{saved?"★ محفوظة":"☆ حفظ"}</button></div>
  {err&&<div style={{fontSize:10.5,color:"#A44D3C",marginTop:9}}>{err}</div>}
  {verses&&<section style={{marginTop:18}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}><div style={{fontSize:12,fontWeight:800}}>النص القرآني المرتبط بالقصة</div><div style={{fontSize:10,opacity:.45}}>{nd(verses.length)} آية</div></div><div style={{marginTop:10,display:"grid",gap:10}}>{verses.map(v=><div key={v.n} style={{padding:15,borderRadius:19,background:"rgba(181,154,98,.08)"}}><div style={{fontFamily:"'Amiri','Noto Naskh Arabic',serif",fontSize:23,lineHeight:2.05,textAlign:"right"}}>{v.ar}</div><div style={{fontSize:10.5,lineHeight:1.75,opacity:.56,direction:"ltr",textAlign:"left",marginTop:7}}>{v.en}</div><div style={{fontSize:9,opacity:.4,marginTop:8}}>الآية {nd(v.n)}</div></div>)}</div></section>}
  <div style={{fontSize:9.5,opacity:.42,lineHeight:1.8,marginTop:14}}>سكينة لا يختصر النص القرآني في هذا العرض: عند اختيار «قراءة النص القرآني الكامل» تُحمّل جميع آيات المقطع المحدد للقصة، حتى في القصص الطويلة مثل يوسف وموسى.</div>
 </article>
}

export default function ExpandedSeerahStories(){
 const[tab,setTab]=useState("seerah"),[filter,setFilter]=useState("الكل"),[q,setQ]=useState(""),[selected,setSelected]=useState(null),[saved,setSaved]=useState(()=>{try{return JSON.parse(localStorage.getItem("sakinah-seerah-saved")||"[]")}catch{return[]}});
 const rows=tab==="seerah"?SEERAH:PROPHETS;
 const filters=tab==="seerah"?["الكل","مكة","الهجرة","المدينة","أواخر العهد المدني"]:["الكل","البداية","التوحيد","الصبر","الدعاء","الرسالة","الشكر","النجاة","العفة"];
 const filtered=useMemo(()=>rows.filter(x=>(filter==="الكل"||(x.era||x.tag)===filter)&&(`${x.title} ${x.summary} ${x.ref}`).includes(q)),[rows,filter,q]);
 const toggle=id=>{const n=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];setSaved(n);try{localStorage.setItem("sakinah-seerah-saved",JSON.stringify(n))}catch{}};
 return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,overflowY:"auto"}} dir="rtl"><div style={{maxWidth:760,margin:"0 auto",padding:"28px 18px 140px",boxSizing:"border-box"}}>
  <header style={{textAlign:"center"}}><div style={{fontSize:10,color:C.gold,letterSpacing:1.2}}>SAKINAH</div><h1 style={{fontSize:30,margin:"7px 0 3px"}}>السيرة وقصص الأنبياء</h1><div style={{fontSize:11,opacity:.5}}>قصة مرتبة كاملة، ثم النص القرآني المرتبط بها بدون قطع للمقاطع الطويلة.</div></header>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:18}}><button onClick={()=>{setTab("seerah");setFilter("الكل");setSelected(null)}} style={{...btn,background:tab==="seerah"?"rgba(181,154,98,.15)":"rgba(255,255,255,.55)",border:tab==="seerah"?`1px solid ${C.gold}`:btn.border}}>السيرة النبوية</button><button onClick={()=>{setTab("prophets");setFilter("الكل");setSelected(null)}} style={{...btn,background:tab==="prophets"?"rgba(181,154,98,.15)":"rgba(255,255,255,.55)",border:tab==="prophets"?`1px solid ${C.gold}`:btn.border}}>قصص الأنبياء</button></div>
  <input value={q} onChange={e=>setQ(e.target.value)} placeholder="ابحث عن نبي أو حدث…" style={{...btn,width:"100%",boxSizing:"border-box",marginTop:10}}/>
  <div style={{display:"flex",gap:7,overflowX:"auto",padding:"10px 0 4px"}}>{filters.map(x=><button key={x} onClick={()=>setFilter(x)} style={{...btn,whiteSpace:"nowrap",padding:"8px 11px",background:filter===x?C.lapis:"rgba(255,255,255,.55)",color:filter===x?"white":C.ink}}>{x}</button>)}</div>
  {selected&&<StoryDetail item={selected} onClose={()=>setSelected(null)} saved={saved.includes(selected.id)} onSave={()=>toggle(selected.id)}/>} 
  {!selected&&<div style={{marginTop:10,display:"grid",gap:9}}>{filtered.map(x=><button key={x.id} onClick={()=>setSelected(x)} style={{...btn,textAlign:"right",padding:15,borderRadius:21}}><div style={{display:"flex",justifyContent:"space-between",gap:10}}><b style={{fontSize:14}}>{x.title}</b><span style={{fontSize:9.5,opacity:.42}}>{nd(x.ref)}</span></div><div style={{fontSize:11,lineHeight:1.8,opacity:.58,marginTop:5}}>{x.summary}</div><div style={{display:"flex",justifyContent:"space-between",marginTop:9,fontSize:9.5,color:C.gold}}><span>{x.era||x.tag}</span><span>{saved.includes(x.id)?"★ محفوظة":"قراءة القصة كاملة ←"}</span></div></button>)}</div>}
 </div></div>
}
