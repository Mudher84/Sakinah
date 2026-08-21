function fixHadithTodayRow(){
 const root=document.querySelector('[data-hadith-react-safe="true"]');
 if(!root)return;
 for(const row of root.querySelectorAll('section > div')){
  const spans=[...row.children].filter(el=>el.tagName==='SPAN');
  if(spans.length!==2)continue;
  const texts=spans.map(el=>(el.textContent||'').trim());
  if(texts.includes('حديث اليوم')&&texts.some(t=>t.includes('مشروح')&&t.includes('صحيح'))){
   row.style.direction='ltr';
   spans.forEach(el=>el.style.direction='rtl');
   return;
  }
 }
}
export function installHadithTodayRowFix(){
 fixHadithTodayRow();
 let queued=false;
 const run=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;fixHadithTodayRow()})};
 new MutationObserver(run).observe(document.body,{childList:true,subtree:true});
 window.addEventListener('muslimmirror:dock',run);
}
