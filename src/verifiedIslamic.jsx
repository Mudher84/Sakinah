import React,{useEffect,useMemo,useState} from "react";
const C={ivory:"#F6F3EC",ink:"#10100F",lapis:"#173B57",gold:"#B59A62"};
const nd=(s,l)=>l==="ar"?String(s).replace(/[0-9]/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]):String(s);
function Shell({lang,go,titleAr,titleEn,subAr,subEn,children,back="discover"}){return <div style={{position:"absolute",inset:0,background:C.ivory,color:C.ink,display:"flex",flexDirection:"column"}}><div style={{padding:"22px 22px 0"}}><button onClick={()=>go(back)} style={{border:0,background:"transparent",fontFamily:"inherit",cursor:"pointer"}}>{lang==="ar"?"← رجوع":"← Back"}</button></div><div style={{flex:1,overflowY:"auto",padding:"18px clamp(16px,4vw,28px) 130px"}}><div style={{fontFamily:"Fraunces,serif",fontSize:lang==="ar"?29:27}}>{lang==="ar"?titleAr:titleEn}</div><div style={{fontSize:11.5,opacity:.48,lineHeight:1.7,marginTop:7}}>{lang==="ar"?subAr:subEn}</div>{children}</div></div>}

const NAME_EXPLANATIONS={
"الرَّحْمَنُ":["واسع الرحمة التي شملت جميع الخلق في الدنيا.","The One whose vast mercy encompasses all creation."],
"الرَّحِيمُ":["كثير الرحمة بعباده، يرحمهم رحمة خاصة متصلة بلطفه وهدايته.","The Especially Merciful, continually bestowing mercy upon His servants."],
"الْمَلِكُ":["المالك الحقيقي لكل شيء، المتصرف في خلقه بلا شريك.","The Absolute King and true Owner of all creation."],
"الْقُدُّوسُ":["المنزّه عن كل نقص وعيب، الكامل في ذاته وصفاته.","The Most Holy, perfectly free from every defect and imperfection."],
"السَّلَامُ":["السالم من كل نقص، ومنه السلام والأمان لعباده.","The Source of Peace, free from all deficiency and giver of safety."],
"الْمُؤْمِنُ":["الذي يؤمّن عباده ويصدق رسله بآياته ويمنح الطمأنينة.","The Giver of Security and Faith, who grants reassurance and confirms truth."],
"الْمُهَيْمِنُ":["الرقيب الشهيد على خلقه، المحيط بهم حفظاً وعلماً.","The Guardian and Overseer, fully aware of and watching over all things."],
"الْعَزِيزُ":["الغالب الذي لا يُغلب، الكامل في القوة والعزة.","The Almighty, invincible and perfect in might and honor."],
"الْجَبَّارُ":["العظيم القاهر، ويجبر كسر عباده ويرفع ضعفهم.","The Compeller and Restorer, supreme in power and mender of brokenness."],
"الْمُتَكَبِّرُ":["المتعالي عن صفات النقص، صاحب الكبرياء والعظمة وحده.","The Supremely Great, above every imperfection and worthy of all grandeur."],
"الْخَالِقُ":["الذي أوجد المخلوقات من العدم بتقدير وحكمة.","The Creator who brings all things into existence by wisdom and decree."],
"الْبَارِئُ":["الذي أوجد الخلق على تقدير محكم وأبرزهم إلى الوجود.","The Originator who brings creation forth in perfect order."],
"الْمُصَوِّرُ":["الذي أعطى كل مخلوق صورته وهيئته التي شاءها.","The Fashioner who gives every created being its form and appearance."],
"الْغَفَّارُ":["كثير المغفرة، يستر الذنوب ويغفرها لمن تاب ورجع إليه.","The Constant Forgiver who repeatedly covers and forgives sins."],
"الْقَهَّارُ":["الغالب لكل شيء، الذي خضعت له جميع المخلوقات.","The All-Subduer before whom all creation is subject."],
"الْوَهَّابُ":["كثير العطاء، يهب النعم والفضل بلا مقابل.","The Bestower who gives abundant gifts and favors freely."],
"الرَّزَّاقُ":["الذي يرزق جميع خلقه ويوصل إليهم ما تقوم به حياتهم.","The Provider who sustains every creature and supplies all needs."],
"الْفَتَّاحُ":["الذي يفتح أبواب الخير والرحمة ويحكم بين عباده بالحق.","The Opener and Judge who opens the ways of mercy, provision and truth."],
"اَلْعَلِيْمُ":["المحيط علماً بكل ظاهر وباطن، لا يخفى عليه شيء.","The All-Knowing whose knowledge encompasses everything seen and unseen."],
"الْقَابِضُ":["الذي يقبض بحكمته الرزق والأرواح وما يشاء من خلقه.","The Withholder who constricts by perfect wisdom."],
"الْبَاسِطُ":["الذي يبسط الرزق والرحمة والفضل لمن يشاء بحكمة.","The Expander who widens provision, mercy and favor by wisdom."],
"الْخَافِضُ":["الذي يخفض من يشاء بعدله وحكمته.","The One who lowers whom He wills in perfect justice and wisdom."],
"الرَّافِعُ":["الذي يرفع من يشاء قدراً وذكراً ودرجة.","The Exalter who raises whom He wills in rank and honor."],
"الْمُعِزُّ":["الذي يمنح العزة والقوة والرفعة لمن يشاء.","The Giver of Honor who grants dignity and strength."],
"المُذِلُّ":["الذي يضع الذل على من يشاء بعدله وحكمته.","The One who humbles whom He wills in justice and wisdom."],
"السَّمِيعُ":["الذي يسمع جميع الأصوات على اختلافها وخفائها.","The All-Hearing who hears every voice, open or hidden."],
"الْبَصِيرُ":["الذي يرى كل شيء، لا يحجبه ظاهر ولا خفي.","The All-Seeing who sees every visible and hidden thing."],
"الْحَكَمُ":["الحاكم بالحق الذي لا يظلم في قضائه وحكمه.","The Perfect Judge whose judgment is always true and just."],
"الْعَدْلُ":["الكامل في عدله، المنزّه عن الظلم في حكمه وأفعاله.","The Utterly Just, never unjust in decree or action."],
"اللَّطِيفُ":["الذي يعلم دقائق الأمور ويوصل الخير لعباده بلطف خفي.","The Subtle and Gentle, aware of the finest details and kind in unseen ways."],
"الْخَبِيرُ":["العالم ببواطن الأمور وحقائقها وما تؤول إليه.","The All-Aware, knowing the inner reality and outcome of all things."],
"الْحَلِيمُ":["الذي لا يعاجل بالعقوبة مع قدرته، ويمهل عباده رحمة.","The Most Forbearing, not hasty to punish despite perfect power."],
"الْعَظِيمُ":["العظيم في ذاته وصفاته وأفعاله، له كمال العظمة.","The Magnificent, perfect in greatness of essence, attributes and acts."],
"الْغَفُورُ":["واسع المغفرة، يستر الذنب ويتجاوز عنه لمن يشاء.","The Great Forgiver whose forgiveness is vast and covering."],
"الشَّكُورُ":["الذي يقبل القليل من العمل ويضاعف عليه الجزاء الكثير.","The Most Appreciative, rewarding even small good deeds abundantly."],
"الْعَلِيُّ":["المتعالي فوق خلقه، العالي قدراً وقهراً وشأناً.","The Most High, exalted above creation in rank, authority and majesty."],
"الْكَبِيرُ":["العظيم الذي كل ما سواه صغير أمام عظمته.","The Most Great, before whose greatness all creation is small."],
"الْحَفِيظُ":["الحافظ لخلقه وأعمالهم، ولا يضيع عنده شيء.","The Preserver who protects creation and never loses any deed or detail."],
"المُقيِتُ":["الذي يوصل إلى كل مخلوق قوته وما يحتاج إليه.","The Sustainer who provides every creature what it needs to endure."],
"الْحسِيبُ":["الكافي لعباده، والمحاسب لهم على أعمالهم بدقة وعدل.","The Reckoner and Sufficient One who accounts for every deed with justice."],
"الْجَلِيلُ":["صاحب الجلال والعظمة والكمال.","The Majestic, possessing perfect greatness and glory."],
"الْكَرِيمُ":["واسع الجود والعطاء، كثير الإحسان والفضل.","The Most Generous, abundant in giving, kindness and favor."],
"الرَّقِيبُ":["المطلع على خلقه، لا يغيب عنه قول ولا عمل.","The Watchful, fully observing every word, deed and condition."],
"الْمُجِيبُ":["الذي يسمع دعاء عباده ويجيب من دعاه بحكمة.","The Responsive One who hears and answers supplication with wisdom."],
"الْوَاسِعُ":["الواسع في رحمته وعلمه وفضله ورزقه.","The All-Encompassing, vast in mercy, knowledge, favor and provision."],
"الْحَكِيمُ":["الذي يضع الأشياء مواضعها ولا يفعل شيئاً عبثاً.","The All-Wise, placing everything in its proper place and purpose."],
"الْوَدُودُ":["المحب لأوليائه، المتودد إليهم برحمته ونِعَمه.","The Most Loving, loving His servants and drawing them near with mercy."],
"الْمَجِيدُ":["عظيم المجد، واسع الكمال والشرف والإحسان.","The Most Glorious, perfect in honor, excellence and generosity."],
"الْبَاعِثُ":["الذي يبعث الخلق بعد الموت ويوقظ القلوب للخير.","The Resurrector who raises creation after death."],
"الشَّهِيدُ":["الحاضر بعلمه، الشاهد على كل شيء.","The Witness whose knowledge encompasses every event and deed."],
"الْحَقُّ":["الثابت الذي لا شك في وجوده ووعده وحكمه.","The Absolute Truth, whose existence, promise and judgment are certain."],
"الْوَكِيلُ":["الكفيل بأمور خلقه، ومن توكل عليه كفاه.","The Trustee and Disposer of affairs, sufficient for those who rely on Him."],
"الْقَوِيُّ":["كامل القوة، لا يلحقه ضعف ولا عجز.","The All-Strong, perfect in power and untouched by weakness."],
"الْمَتِينُ":["شديد القوة، الثابت الذي لا يلحق قدرته وهن.","The Firm and Steadfast, whose power never weakens."],
"الْوَلِيُّ":["الناصر والمتولي لعباده المؤمنين برحمته وهدايته.","The Protecting Friend and Patron of His believing servants."],
"الْحَمِيدُ":["المستحق لكل حمد لكمال صفاته وأفعاله.","The Praiseworthy, deserving all praise for perfect attributes and deeds."],
"الْمُحْصِي":["الذي أحصى كل شيء عدداً وعلماً، فلا يفوته شيء.","The All-Enumerating, counting and knowing every single thing."],
"الْمُبْدِئُ":["الذي بدأ خلق الأشياء وأوجدها أول مرة.","The Originator who begins creation and brings it into being."],
"الْمُعِيدُ":["الذي يعيد الخلق بعد فنائهم كما بدأهم أول مرة.","The Restorer who brings creation back after death."],
"الْمُحْيِي":["الذي يهب الحياة ويحيي الأجساد والقلوب.","The Giver of Life who grants life to bodies and hearts."],
"اَلْمُمِيتُ":["الذي يقدّر الموت على خلقه حين تنقضي آجالهم.","The Creator of Death who brings life to its appointed end."],
"الْحَيُّ":["الكامل في حياته، حياة أبدية لا يسبقها عدم ولا يلحقها فناء.","The Ever-Living, whose perfect life has neither beginning nor end."],
"الْقَيُّومُ":["القائم بنفسه والمقيم لغيره، تقوم به السماوات والأرض.","The Self-Sustaining One who upholds and maintains all creation."],
"الْوَاجِدُ":["الغني الذي لا يعوزه شيء، ويجد كل ما يشاء.","The Finder and Self-Sufficient One who lacks nothing."],
"الْمَاجِدُ":["الكامل في المجد والشرف وكثرة الإحسان.","The Noble and Illustrious, abundant in glory and generosity."],
"الْواحِدُ":["المنفرد بالألوهية والربوبية، لا شريك له.","The One, unique in divinity and lordship with no partner."],
"الاَحَدُ":["الواحد المتفرد الذي لا مثيل له ولا نظير.","The Unique One, absolutely singular with no equal or likeness."],
"الصَّمَدُ":["السيد الكامل المقصود في الحوائج، الغني عن كل أحد.","The Eternal Refuge, perfect and self-sufficient, upon whom all depend."],
"الْقَادِرُ":["الكامل القدرة على كل شيء.","The All-Powerful, fully able to do all things."],
"الْمُقْتَدِرُ":["تام القدرة، النافذ أمره الذي لا يعجزه شيء.","The Omnipotent, whose command and power are fully effective."],
"الْمُقَدِّمُ":["الذي يقدّم من يشاء وما يشاء بحكمته.","The Advancer who brings forward whom and what He wills by wisdom."],
"الْمُؤَخِّرُ":["الذي يؤخر من يشاء وما يشاء بحكمته.","The Delayer who postpones whom and what He wills by wisdom."],
"الأوَّلُ":["الذي ليس قبله شيء، فهو أول بلا بداية.","The First, before whom there was nothing."],
"الآخِرُ":["الذي ليس بعده شيء، الباقي بعد فناء الخلق.","The Last, after whom there is nothing."],
"الظَّاهِرُ":["العالي فوق خلقه، والظاهر بآيات قدرته.","The Manifest and Most High, evident through His signs and power."],
"الْبَاطِنُ":["القريب المحيط بكل شيء علماً، الذي لا تدركه الأبصار.","The Hidden and Near, encompassing all things in knowledge beyond sight."],
"الْوَالِي":["المالك المدبر لأمور الخلق والمتولي شؤونهم.","The Governor and Patron who manages all affairs of creation."],
"الْمُتَعَالِي":["المتعالي عن كل نقص، العالي فوق خلقه قدراً وقهراً.","The Most Exalted, far above every defect and imperfection."],
"الْبَرُّ":["كثير الخير والإحسان إلى عباده.","The Source of Goodness, abundant in kindness and beneficence."],
"التَّوَابُ":["الذي يوفق للتوبة ويقبلها من عباده مراراً.","The Accepter of Repentance, repeatedly turning to His servants with mercy."],
"الْمُنْتَقِمُ":["الذي يعاقب من استحق العقوبة بعدله.","The Just Retributor who punishes wrongdoing with perfect justice."],
"العَفُوُّ":["الذي يمحو الذنوب ويتجاوز عن السيئات.","The Pardoner who erases sins and overlooks wrongdoing."],
"الرَّؤُوفُ":["شديد الرحمة واللطف بعباده.","The Most Compassionate and exceptionally kind to His servants."],
"مَالِكُ الْمُلْكِ":["مالك الملك كله، يعطي الملك وينزعه ممن يشاء.","Owner of all Sovereignty, granting and removing authority as He wills."],
"ذُوالْجَلَالِ وَالإكْرَامِ":["صاحب العظمة والكبرياء والفضل والكرم.","Lord of Majesty and Honor, perfect in grandeur and generosity."],
"الْمُقْسِطُ":["العادل في حكمه، الذي يعطي كل ذي حق حقه.","The Equitable One who judges fairly and gives every right its due."],
"الْجَامِعُ":["الذي يجمع الخلق ليوم لا ريب فيه ويجمع ما شاء من الأمور.","The Gatherer who will assemble all creation and unite what He wills."],
"الْغَنِيُّ":["الغني بذاته عن كل خلقه، وكل الخلق فقراء إليه.","The Self-Sufficient, needing none while all creation depends on Him."],
"الْمُغْنِي":["الذي يغني من يشاء من فضله ويكفيه.","The Enricher who grants sufficiency and abundance from His favor."],
"اَلْمَانِعُ":["الذي يمنع ما يشاء بحكمته ولا رادّ لحكمه.","The Withholder who prevents by perfect wisdom and whose decree cannot be overturned."],
"الضَّارَّ":["الذي قدّر الضر بحكمة، ولا يقع شيء إلا بإذنه.","The One in whose decree hardship may occur by wisdom and permission."],
"النَّافِعُ":["الذي بيده النفع والخير، يوصل المنافع لمن يشاء.","The Giver of Benefit, from whom every true benefit and good comes."],
"النُّورُ":["نور السماوات والأرض، وهادي أهلها إلى الحق.","The Light of the heavens and earth, guiding creation to truth."],
"الْهَادِي":["الذي يهدي عباده إلى طريق الحق والرشاد.","The Guide who leads His servants to truth and the straight path."],
"الْبَدِيعُ":["الذي أبدع الخلق على غير مثال سابق.","The Incomparable Originator who creates without prior model."],
"اَلْبَاقِي":["الدائم الذي لا يلحقه فناء ولا زوال.","The Everlasting, remaining forever without end or disappearance."],
"الْوَارِثُ":["الباقي بعد فناء الخلق، وإليه ترجع الأملاك كلها.","The Inheritor who remains when creation passes and to whom all ownership returns."],
"الرَّشِيدُ":["الذي يرشد الخلق إلى مصالحهم، وتدبيره كله صواب وحكمة.","The Guide to Right Conduct, whose direction and management are perfectly wise."],
"الصَّبُورُ":["الذي لا يعجل بالعقوبة، ويمهل عباده بحلم وحكمة.","The Most Patient, never hasty and granting time with wisdom and forbearance."]
};
const normalizeName=s=>String(s||"").replace(/[ًٌٍَُِّْـ]/g,"").replace(/\s+/g," ").trim();
function explanationFor(name,enMeaning){const n=normalizeName(name);const hit=Object.entries(NAME_EXPLANATIONS).find(([k])=>normalizeName(k)===n)?.[1];return hit||["اسم من أسماء الله الحسنى، يدل على كمال يليق بالله سبحانه وتعالى.",enMeaning?`This Name expresses a perfect attribute of Allah: ${enMeaning}.`:"One of the Beautiful Names of Allah, expressing a perfect divine attribute."]}

export function LiveNamesOfAllah({lang,go}){
 const [rows,setRows]=useState([]),[q,setQ]=useState(""),[loading,setLoading]=useState(true),[err,setErr]=useState(""),[selected,setSelected]=useState(null);
 useEffect(()=>{fetch("https://api.aladhan.com/v1/asmaAlHusna").then(r=>{if(!r.ok)throw new Error();return r.json()}).then(x=>{setRows(Array.isArray(x.data)?x.data:[]);setLoading(false)}).catch(()=>{setErr(lang==="ar"?"تعذر تحميل الأسماء الحسنى":"Could not load the Names");setLoading(false)})},[lang]);
 const shown=useMemo(()=>rows.filter(x=>`${x.name||""} ${x.transliteration||""} ${x.en?.meaning||""}`.toLowerCase().includes(q.toLowerCase())),[rows,q]);
 const detail=selected?explanationFor(selected.name,selected.en?.meaning):null;
 return <Shell lang={lang} go={go} titleAr="أسماء الله الحسنى" titleEn="99 Names of Allah" subAr="اضغط على أي اسم لقراءة معناه بالعربية والإنجليزية" subEn="Tap any Name to read its meaning in Arabic and English">
  <input value={q} onChange={e=>setQ(e.target.value)} placeholder={lang==="ar"?"ابحث عن اسم…":"Search a Name…"} style={{marginTop:18,width:"100%",boxSizing:"border-box",padding:"13px 14px",borderRadius:15,border:"1px solid rgba(16,16,15,.09)",background:"rgba(255,255,255,.38)",fontFamily:"inherit",fontSize:13}}/>
  {loading&&<div style={{marginTop:24,opacity:.5}}>{lang==="ar"?"تحميل…":"Loading…"}</div>}{err&&<div style={{marginTop:20,color:"#8b3c31"}}>{err}</div>}
  <div style={{marginTop:14,display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:12}}>{shown.map((x,i)=><button key={x.number||i} onClick={()=>setSelected(x)} style={{padding:"18px 15px",minHeight:158,borderRadius:20,border:"1px solid rgba(16,16,15,.075)",background:"rgba(255,255,255,.50)",fontFamily:"inherit",color:"inherit",textAlign:"center",cursor:"pointer"}}><div style={{fontSize:9,opacity:.35,textAlign:"start"}}>{nd(x.number||i+1,lang)}</div><div style={{fontFamily:"'Amiri Quran','Noto Naskh Arabic',serif",fontSize:28,direction:"rtl",marginTop:8}}>{x.name}</div><div style={{fontSize:10.5,fontWeight:600,marginTop:8}}>{x.transliteration}</div><div style={{fontSize:10,opacity:.5,lineHeight:1.55,marginTop:6}}>{x.en?.meaning||""}</div><div style={{fontSize:9.5,color:C.gold,marginTop:10}}>{lang==="ar"?"اضغط للشرح":"Tap for explanation"}</div></button>)}</div>
  {selected&&<div role="dialog" aria-modal="true" onClick={()=>setSelected(null)} style={{position:"fixed",inset:0,zIndex:2147483300,background:"rgba(16,16,15,.38)",display:"grid",alignItems:"end",padding:"70px 12px 94px"}}><div onClick={e=>e.stopPropagation()} style={{width:"min(620px,100%)",margin:"0 auto",boxSizing:"border-box",borderRadius:28,padding:"24px 20px",background:C.ivory,border:"1px solid rgba(16,16,15,.08)",boxShadow:"0 24px 70px rgba(16,16,15,.18)",maxHeight:"72vh",overflowY:"auto"}} dir="rtl"><div style={{display:"flex",justifyContent:"space-between",alignItems:"start",gap:12}}><div><div style={{fontFamily:"'Amiri Quran','Noto Naskh Arabic',serif",fontSize:36}}>{selected.name}</div><div style={{fontSize:12,opacity:.5,marginTop:4,direction:"ltr",textAlign:"right"}}>{selected.transliteration}</div></div><button onClick={()=>setSelected(null)} aria-label="إغلاق" style={{width:38,height:38,borderRadius:13,border:"1px solid rgba(16,16,15,.08)",background:"rgba(255,255,255,.5)",fontFamily:"inherit",fontSize:18}}>×</button></div><div style={{marginTop:20,paddingTop:18,borderTop:"1px solid rgba(16,16,15,.08)"}}><div style={{fontSize:11,color:C.gold}}>المعنى بالعربية</div><div style={{fontSize:15,lineHeight:1.9,marginTop:7}}>{detail?.[0]}</div></div><div style={{marginTop:18,paddingTop:18,borderTop:"1px solid rgba(16,16,15,.08)",direction:"ltr",textAlign:"left"}}><div style={{fontSize:11,color:C.gold}}>Meaning in English</div><div style={{fontSize:14,lineHeight:1.8,marginTop:7}}>{detail?.[1]}</div></div>{selected.en?.meaning&&<div style={{marginTop:16,fontSize:10.5,opacity:.45,direction:"ltr",textAlign:"left"}}>Short meaning: {selected.en.meaning}</div>}</div></div>}
 </Shell>
}
const BOOKS=[["bukhari","صحيح البخاري","Sahih al-Bukhari"],["muslim","صحيح مسلم","Sahih Muslim"],["abudawud","سنن أبي داود","Sunan Abi Dawud"],["tirmidhi","جامع الترمذي","Jami' at-Tirmidhi"],["nasai","سنن النسائي","Sunan an-Nasa'i"],["ibnmajah","سنن ابن ماجه","Sunan Ibn Majah"],["malik","موطأ مالك","Muwatta Malik"],["ahmad","مسند أحمد","Musnad Ahmad"],["darimi","سنن الدارمي","Sunan ad-Darimi"]];
export function NineBooksHub({lang,go}){const [q,setQ]=useState("");const shown=BOOKS.filter(x=>(x[1]+x[2]).toLowerCase().includes(q.toLowerCase()));return <Shell lang={lang} go={go} titleAr="جامع الكتب التسعة" titleEn="Nine Hadith Books" subAr="فهرس موحد جاهز للربط بمصدر حديث موثوق من الخلفية" subEn="Unified index prepared for a trusted backend hadith provider"><div style={{marginTop:15,padding:14,borderRadius:16,background:"rgba(181,154,98,.10)",border:"1px solid rgba(181,154,98,.18)",fontSize:10.5,lineHeight:1.7}}>{lang==="ar"?"لا يعرض سكينة نص حديث قبل وصوله من مزود موثق مع رقم الكتاب والباب والحديث والمصدر.":"Sakinah does not display hadith text until it comes from a trusted provider with book, chapter, hadith number and provenance."}</div><input value={q} onChange={e=>setQ(e.target.value)} placeholder={lang==="ar"?"ابحث في الكتب…":"Search books…"} style={{marginTop:13,width:"100%",boxSizing:"border-box",padding:11,borderRadius:13,border:"1px solid rgba(16,16,15,.09)",background:"transparent",fontFamily:"inherit"}}/><div style={{marginTop:8}}>{shown.map((x,i)=><button key={x[0]} onClick={()=>go("hadith-book",{bookId:x[0],ar:x[1],en:x[2]})} style={{width:"100%",display:"grid",gridTemplateColumns:"36px 1fr auto",gap:10,alignItems:"center",padding:"13px 0",border:0,borderTop:"1px solid rgba(16,16,15,.07)",background:"transparent",fontFamily:"inherit",textAlign:lang==="ar"?"right":"left",color:"inherit"}}><div style={{width:32,height:32,borderRadius:"50%",border:"1px solid rgba(16,16,15,.12)",display:"grid",placeItems:"center",fontSize:10}}>{nd(i+1,lang)}</div><div><b style={{fontSize:13}}>{lang==="ar"?x[1]:x[2]}</b><small style={{display:"block",opacity:.42,marginTop:4}}>{lang==="ar"?x[2]:x[1]}</small></div><span style={{opacity:.3}}>›</span></button>)}</div></Shell>}
export function HadithBookPlaceholder({lang,go,data}){return <Shell lang={lang} go={go} back="nine-books" titleAr={data?.ar||"كتاب الحديث"} titleEn={data?.en||"Hadith Book"} subAr="موصل المصدر جاهز · يحتاج بيانات اعتماد خادم موثوقة" subEn="Provider connector ready · trusted server credentials required"><div style={{marginTop:24,padding:20,borderRadius:20,border:"1px solid rgba(16,16,15,.08)",background:"rgba(255,255,255,.42)"}}><div style={{fontSize:13,fontWeight:650}}>{lang==="ar"?"حالة المصدر":"Provider status"}</div><div style={{fontSize:11,opacity:.5,lineHeight:1.75,marginTop:8}}>{lang==="ar"?"لن نملأ الأحاديث من ذاكرة التطبيق أو API مجهول. عند توصيل مزود الحديث تظهر الأبواب، الأحاديث، البحث، التخريج والمفضلة هنا.":"No hadith text is invented or loaded from an unknown API. Once a trusted provider is connected, chapters, hadiths, search, provenance and favorites appear here."}</div></div></Shell>}
export function VerifiedContentHub({lang,go}){const items=[["names","أسماء الله الحسنى","99 Names","names-live"],["nine","الأحاديث الموثقة","Verified Hadith","nine-books"],["tafsir","التفسير","Tafsir","tafsir-library"],["dua","الأدعية القرآنية","Quranic Duas","quranic-duas"]];return <Shell lang={lang} go={go} titleAr="المحتوى الموثق" titleEn="Verified Content" subAr="كل مصدر وحالته في مكان واحد" subEn="Every provider and its status in one place"><div style={{marginTop:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>{items.map((x,i)=><button key={x[0]} onClick={()=>go(x[3])} style={{minHeight:112,padding:14,borderRadius:19,border:"1px solid rgba(16,16,15,.075)",background:i===0?"rgba(181,154,98,.10)":"rgba(255,255,255,.42)",fontFamily:"inherit",textAlign:lang==="ar"?"right":"left",color:"inherit"}}><div style={{fontSize:18,opacity:.35}}>◌</div><div style={{fontSize:12.5,fontWeight:650,marginTop:10}}>{lang==="ar"?x[1]:x[2]}</div><div style={{fontSize:9.5,opacity:.42,marginTop:6}}>{lang==="ar"?"مفعّل":"Active"}</div></button>)}</div></Shell>}
