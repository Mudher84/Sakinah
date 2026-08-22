const STYLE_ID='muslim-mirror-global-back-style';
const HIDDEN_CLASS='muslim-mirror-back-hidden';
const BAR_ID='sakinah-back-bar';
const BAR_BUTTON_ID='sakinah-back-bar-button';
const BAR_TITLE_ID='sakinah-back-bar-title';
const BAR_SEARCH_ID='sakinah-back-bar-search';
let activeTarget=null;

const FEATURE_TITLES={
 'daily-tools':'أدوات اليوم','daily-reflection':'تأمل اليوم','trusted-daily':'المحتوى الموثوق','quranic-duas':'أدعية قرآنية',
 'smart-quranic-adhkar':'الأذكار','sourced-seerah':'السيرة والقصص','kids-sourced-stories':'قصص الأطفال','kids-world':'عالم الأطفال',
 'kids-home':'عالم الأطفال','kids-quran-live':'معلّم القرآن للأطفال','quran-teacher':'معلّم القرآن','kids-quiz-live':'مسابقات الأطفال',
 'kids-nasheeds':'أناشيد الأطفال','offline-backup':'النسخ الاحتياطي','islamic-calendar':'التقويم الإسلامي','fasting-center':'الصيام',
 'ramadan-center':'رمضان','smart-khatmah':'الختمة','memorization-center':'خطة الحفظ','names-live':'أسماء الله الحسنى','hisn-center':'حصن المسلم',
 'jumuah-center':'الجمعة','worship-times':'مواقيت الصلاة','parental-controls':'الرقابة الأبوية','privacy-lock':'الخصوصية والقفل',
 'card-maker':'صانع البطاقات','islamic-search':'البحث الإسلامي الشامل','saved-library':'المحفوظات','quran-analytics':'إحصاءات القرآن',
 'quran-intelligence':'علوم القرآن','quran-topics':'موضوعات القرآن','quran-compare':'مقارنة الكلمات','quran-entities':'أعلام القرآن',
 'quran-roots':'جذور الكلمات','tadabbur-ayah':'تدبّر آية','my-day':'يومي','prayer-journal':'سجل الصلاة','quran-player':'القرآن الكريم',
 'quran-audio':'الاستماع للقرآن','nine-books':'الأحاديث النبوية','tafsir-library':'التفسير','notes':'دفتر الملاحظات','accounts':'دفتر الحسابات',
 'profiles':'البروفايلات','qibla':'القبلة','mosques':'المساجد القريبة','zakat':'الزكاة','manasik':'المناسك','tasbeeh':'المسبحة',
 'guide':'الصلاة والوضوء','alerts':'المؤذّن والتنبيهات','adhan-audio':'صوت الأذان','widget':'الويدجت'
};

function ensureStyles(){
 if(document.getElementById(STYLE_ID))return;
 const s=document.createElement('style');
 s.id=STYLE_ID;
 s.textContent=`
 .${HIDDEN_CLASS}{display:none!important}
 #${BAR_ID}{position:fixed!important;top:0!important;left:0!important;right:0!important;height:calc(42px + 1cm)!important;z-index:2147483595!important;display:grid!important;grid-template-columns:72px minmax(0,1fr) 72px!important;align-items:center!important;padding:1cm 9px 0!important;box-sizing:border-box!important;background:#fff!important;border-bottom:1px solid rgba(16,45,67,.07)!important;box-shadow:0 3px 12px rgba(16,16,15,.035)!important;backdrop-filter:blur(18px) saturate(130%)!important;-webkit-backdrop-filter:blur(18px) saturate(130%)!important;color:#102D43!important}
 #${BAR_ID}[data-visible="false"]{display:none!important}
 #${BAR_BUTTON_ID},#${BAR_SEARCH_ID}{height:32px!important;min-width:34px!important;padding:0 10px!important;border:0!important;border-radius:10px!important;background:transparent!important;color:#8E6F38!important;font-family:'Cairo',sans-serif!important;font-size:10px!important;font-weight:300!important;line-height:1!important;cursor:pointer!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;box-shadow:none!important}
 #${BAR_BUTTON_ID}{justify-self:start!important}
 #${BAR_SEARCH_ID}{justify-self:end!important;font-size:18px!important;padding:0!important;width:36px!important}
 #${BAR_TITLE_ID}{min-width:0!important;text-align:center!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-family:'Cairo',sans-serif!important;font-size:11px!important;font-weight:300!important;font-synthesis:none!important;line-height:1.2!important;color:#102D43!important;pointer-events:none!important}
 #${BAR_BUTTON_ID}.${HIDDEN_CLASS},#${BAR_SEARCH_ID}.${HIDDEN_CLASS}{visibility:hidden!important;display:inline-flex!important}
 body{padding-top:0!important;box-sizing:border-box!important}
 body.mm-has-global-back-bar{padding-top:calc(42px + 1cm)!important;background:#fff!important}
 .global-feature-shell{box-sizing:border-box!important}
 .qm-reader .qm-top{display:none!important}
 button[aria-label="أنا"],button[aria-label="تغيير صورة البروفايل"],button[aria-label="Change profile image"]{border-radius:50%!important;border:0!important;outline:0!important;box-shadow:none!important;filter:none!important;overflow:hidden!important;padding:0!important}
 button[aria-label="أنا"] img,button[aria-label="تغيير صورة البروفايل"] img,button[aria-label="Change profile image"] img{width:100%!important;height:100%!important;object-fit:cover!important;border-radius:50%!important;display:block!important;border:0!important;outline:0!important;box-shadow:none!important;filter:none!important}
 `;
 document.head.appendChild(s);
}

function isBackButton(b){
 if(!(b instanceof HTMLButtonElement)||b.id===BAR_BUTTON_ID)return false;
 const text=(b.textContent||'').replace(/\s+/g,' ').trim();
 const aria=(b.getAttribute('aria-label')||'').trim();
 const title=(b.getAttribute('title')||'').trim();
 const meta=`${aria} ${title}`.trim();
 const exact=/^(?:رجوع|الرجوع|عودة|Back|←|→|‹|›|⟵|⟶|←\s*رجوع|رجوع\s*[←→]|Back\s*[←→]|[←→]\s*Back)$/i.test(text);
 const labelled=/\bback\b|رجوع|الرجوع|عودة/i.test(meta);
 return exact||labelled||b.classList.contains('global-feature-back');
}
function visible(el){
 if(!el||!el.isConnected)return false;
 const s=getComputedStyle(el);
 return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0&&el.getClientRects().length>0;
}
function depth(el){let d=0;while(el?.parentElement){d++;el=el.parentElement}return d}
function pageTitle(){
 const feature=document.querySelector('.global-feature-shell')?.dataset?.feature;
 if(feature&&FEATURE_TITLES[feature])return FEATURE_TITLES[feature];
 if(document.querySelector('.qm-reader'))return 'المصحف الشريف';
 if(document.querySelector('.qtp-stage'))return 'القرآن الكريم';
 const me=document.querySelector('.mm-me-page');if(me)return 'أنا';
 const hadith=document.querySelector('[data-hadith-react-safe="true"]');if(hadith)return 'الأحاديث النبوية';
 const surahList=[...document.querySelectorAll('div')].find(el=>visible(el)&&/سور القرآن/.test((el.textContent||'').trim())&&el.children.length<6);if(surahList)return 'فهرس السور';
 const candidates=[...document.querySelectorAll('h1,h2,[role="heading"]')].filter(visible).map(el=>(el.textContent||'').replace(/\s+/g,' ').trim()).filter(t=>t&&t.length<45);
 if(candidates.length)return candidates[0];
 if(document.querySelector('.mm-reference-home'))return 'مرآة المسلم';
 return 'مرآة المسلم';
}
function ensureBar(){
 let bar=document.getElementById(BAR_ID);
 if(bar)return bar;
 bar=document.createElement('div');
 bar.id=BAR_ID;
 bar.setAttribute('role','navigation');
 bar.setAttribute('aria-label','شريط التطبيق');
 const back=document.createElement('button');
 back.id=BAR_BUTTON_ID;back.type='button';back.innerHTML='<span aria-hidden="true">→</span><span>رجوع</span>';back.setAttribute('aria-label','رجوع');
 back.onclick=()=>{const target=activeTarget;if(target&&target.isConnected){target.click();return}window.dispatchEvent(new CustomEvent('sakinah:global-root'));window.dispatchEvent(new CustomEvent('sakinah:feature',{detail:'home'}));};
 const title=document.createElement('div');title.id=BAR_TITLE_ID;title.textContent='مرآة المسلم';
 const search=document.createElement('button');search.id=BAR_SEARCH_ID;search.type='button';search.setAttribute('aria-label','بحث');search.textContent='⌕';
 search.onclick=()=>window.dispatchEvent(new CustomEvent('sakinah:feature',{detail:'islamic-search'}));
 bar.append(back,title,search);document.body.appendChild(bar);return bar;
}
function reconcile(){
 ensureStyles();const bar=ensureBar();
 const candidates=[...document.querySelectorAll('button')].filter(isBackButton).filter(b=>b.id!==BAR_BUTTON_ID);
 candidates.forEach(b=>b.classList.remove(HIDDEN_CLASS));
 const shown=candidates.filter(visible);
 activeTarget=shown.length?shown.reduce((best,b)=>!best||depth(b)>depth(best)?b:best,null):null;
 candidates.forEach(b=>b.classList.add(HIDDEN_CLASS));
 const onHome=!!document.querySelector('.mm-reference-home');
 bar.dataset.visible='true';
 document.body.classList.add('mm-has-global-back-bar');
 const globalBack=bar.querySelector(`#${BAR_BUTTON_ID}`);
 globalBack.classList.toggle(HIDDEN_CLASS,onHome&&!activeTarget);
 const title=bar.querySelector(`#${BAR_TITLE_ID}`);if(title)title.textContent=pageTitle();
 const search=bar.querySelector(`#${BAR_SEARCH_ID}`);
 const onSearch=document.querySelector('.global-feature-shell[data-feature="islamic-search"]');
 search.classList.toggle(HIDDEN_CLASS,!!onSearch);
 document.querySelectorAll('[data-mm-search-legacy-brand="true"]').forEach(el=>{el.classList.remove(HIDDEN_CLASS);el.removeAttribute('data-mm-search-legacy-brand')});
 if(onSearch){
  [...onSearch.querySelectorAll('button,a')].forEach(el=>{
   const text=(el.textContent||'').replace(/[←→‹›⟵⟶]/g,'').replace(/\s+/g,' ').trim();
   if(text==='مرآة المسلم'||text==='مِرْآةُ الْمُسْلِمِ'){
    el.dataset.mmSearchLegacyBrand='true';
    el.classList.add(HIDDEN_CLASS);
   }
  });
 }
}
export function installGlobalBackButtons(){
 reconcile();let queued=false;
 const run=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;reconcile()})};
 new MutationObserver(run).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-feature','data-visible']});
 ['sakinah:feature','sakinah:native','sakinah:devotion','sakinah:global-root','muslimmirror:dock','muslimmirror:legacy-nav','popstate','resize'].forEach(n=>window.addEventListener(n,run));
 document.addEventListener('click',run,true);
}
