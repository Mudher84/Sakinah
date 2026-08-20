const HADITHS=[
 {text:"إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى.",source:"صحيح البخاري · 1"},
 {text:"أحب الأعمال إلى الله أدومها وإن قل.",source:"صحيح مسلم · 783"},
 {text:"الكلمة الطيبة صدقة.",source:"صحيح البخاري · 2989"},
 {text:"يسروا ولا تعسروا، وبشروا ولا تنفروا.",source:"صحيح البخاري · 69"},
 {text:"من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت.",source:"صحيح البخاري · 6018"},
 {text:"الراحمون يرحمهم الرحمن.",source:"سنن الترمذي · 1924"},
 {text:"لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه.",source:"صحيح البخاري · 13"}
];
const TIPS=[
 "ابدأ بخمس دقائق قرآن فقط؛ الاستمرار أهم من الكثرة.",
 "اختر ذكراً واحداً تلازمه اليوم بدل أن تشتت نفسك بين أشياء كثيرة.",
 "قبل النوم راجع نعمة واحدة تستحق الحمد عليها.",
 "اجعل بينك وبين كل صلاة لحظة هدوء بلا هاتف.",
 "افتح المصحف على موضع توقفت عنده أمس ولا تبدأ من جديد.",
 "صلّ ركعتين بخشوع كامل أفضل من عمل كثير بلا حضور.",
 "اجعل لك دعاءً ثابتاً لأهلك ولمن تحب كل يوم."
];
const STORIES=[
 {title:"دقيقة من السيرة",text:"في الهجرة كان التخطيط الدقيق ملازماً للتوكل؛ أُخذت بالأسباب كاملة ثم تُركت النتيجة لله."},
 {title:"موقف نتعلم منه",text:"كان النبي ﷺ يختار الرفق ما لم يكن فيه إثم؛ القوة في الأسلوب الهادئ لا في القسوة."},
 {title:"معنى يستحق التوقف",text:"الثبات على القليل يصنع أثراً أعمق من دفعات كبيرة تنقطع سريعاً."},
 {title:"من أدب اليوم",text:"من أجمل ما يحفظ العلاقات أن تختار الكلمة التي تُصلح قبل الكلمة التي تنتصر لك."},
 {title:"لحظة سكينة",text:"ليس كل تأخير خسارة؛ أحياناً تكون المسافة بين الدعاء والإجابة تربية للقلب."}
];
function ensureStyle(){if(document.getElementById('sakinah-live-rotation-style'))return;const s=document.createElement('style');s.id='sakinah-live-rotation-style';s.textContent=`.sakinah-live-changing{transition:opacity .38s ease,transform .38s ease}.sakinah-live-changing.is-changing{opacity:0;transform:translateY(5px)}@media(prefers-reduced-motion:reduce){.sakinah-live-changing{transition:none!important}}`;document.head.appendChild(s)}
function nodes(){const root=document.querySelector('[data-sakinah-daily="1"]');if(!root)return null;const quote=root.querySelector('.sakinah-daily-quote'),source=root.querySelector('.sakinah-daily-source'),cards=root.querySelectorAll('.sakinah-daily-card');if(!quote||!source||cards.length<2)return null;const tip=cards[0].querySelector('b'),storyLabel=cards[1].querySelector('.sakinah-daily-label'),story=cards[1].querySelector('b');if(!tip||!storyLabel||!story)return null;[quote,source,tip,storyLabel,story].forEach(n=>n.classList.add('sakinah-live-changing'));return{quote,source,tip,storyLabel,story}}
function swap(index){const n=nodes();if(!n)return false;const all=[n.quote,n.source,n.tip,n.storyLabel,n.story];all.forEach(el=>el.classList.add('is-changing'));setTimeout(()=>{const h=HADITHS[index%HADITHS.length],tip=TIPS[(index*3+1)%TIPS.length],story=STORIES[(index*2+2)%STORIES.length];n.quote.textContent=h.text;n.source.textContent=h.source;n.tip.textContent=tip;n.storyLabel.textContent=story.title;n.story.textContent=story.text;requestAnimationFrame(()=>all.forEach(el=>el.classList.remove('is-changing')))},360);return true}
export function installLivingHomeRotation(){ensureStyle();let index=Math.floor(Date.now()/1000)%97,interval=null;const start=()=>{if(interval)return;if(!nodes())return;index++;swap(index);interval=setInterval(()=>{index++;swap(index)},45000)};const stopIfGone=()=>{if(interval&&!document.querySelector('[data-sakinah-daily="1"]')){clearInterval(interval);interval=null}};start();const obs=new MutationObserver(()=>{stopIfGone();start()});obs.observe(document.body,{childList:true,subtree:true});window.addEventListener('sakinah:global-root',start);window.addEventListener('sakinah:feature',start)}
