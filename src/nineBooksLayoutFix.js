function fixNineBooks(){
 const input=document.querySelector('input[placeholder="ابحث عن كتاب…"],input[placeholder="ابحث برقم الحديث أو داخل النص…"]');
 if(!input)return;
 let main=input.closest('main');
 const shell=main?.parentElement;
 if(shell){shell.style.width='100%';shell.style.maxWidth='100vw';shell.style.overflowX='hidden';shell.style.boxSizing='border-box'}
 if(main){main.style.width='100%';main.style.maxWidth='660px';main.style.minWidth='0';main.style.boxSizing='border-box';main.style.overflowX='hidden'}
 if(main){
  main.querySelectorAll('button,input,select,section,article,div').forEach(el=>{el.style.maxWidth='100%';el.style.boxSizing='border-box'});
  [...main.querySelectorAll('section')].forEach(el=>{
   const t=(el.textContent||'').replace(/\s+/g,' ').trim();
   if(t.startsWith('البيانات محلية داخل')&&t.includes('الحفاظ على سرعة التطبيق'))el.remove();
  });
 }
}
export function installNineBooksLayoutFix(){
 fixNineBooks();
 let q=false;
 const run=()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;fixNineBooks()})};
 new MutationObserver(run).observe(document.body,{childList:true,subtree:true});
 window.addEventListener('sakinah:feature',run);
}
